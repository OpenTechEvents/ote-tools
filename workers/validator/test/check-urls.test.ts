import { describe, expect, it } from "vitest";

import { checkUrls, DEFAULT_CHECK_LIMITS, type UrlCheckResult } from "../src/check-urls.js";

// The whole point of this endpoint is *not* crying wolf. A feed with an image
// that 404s has a real problem its publisher wants to know about; a feed whose
// ticket page answers 403 to anything without a browser fingerprint has none,
// and reporting it as broken would recreate the exact false positive that was
// just removed from the ecosystem's daily health check.

const ORIGIN = "https://validator.example";

/** A network of fixed answers, plus a record of what was actually requested. */
function fakeNetwork(
  routes: Record<string, { status: number; methods?: string[] } | "throw" | "hang">,
) {
  const calls: { url: string; method: string }[] = [];
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    calls.push({ url, method });
    const route = routes[url];
    if (route === undefined) return new Response(null, { status: 404 });
    if (route === "throw") throw new TypeError("connection refused");
    if (route === "hang") throw new DOMException("timed out", "TimeoutError");
    if (route.methods && !route.methods.includes(method)) {
      // The servers that refuse HEAD: this is why there is a GET fallback.
      return new Response(null, { status: 405 });
    }
    return new Response(null, { status: route.status });
  }) as typeof fetch;
  return { fetchImpl, calls };
}

/** Every hostname resolves to one public address; the SSRF rules are tested elsewhere. */
const resolve = async (): Promise<string[]> => ["93.184.216.34"];

const check = (urls: string[], fetchImpl: typeof fetch, limits = {}): Promise<UrlCheckResult[]> =>
  checkUrls(urls, ORIGIN, { fetchImpl, resolve, limits });

describe("checkUrls — what counts as broken", () => {
  it("calls a 404 image broken", async () => {
    const { fetchImpl } = fakeNetwork({
      "https://example.org/missing.png": { status: 404 },
    });
    const [result] = await check(["https://example.org/missing.png"], fetchImpl);
    expect(result).toMatchObject({ state: "broken", status: 404 });
  });

  it("does NOT call a 403 broken — the bot wall is not the publisher's defect", async () => {
    const { fetchImpl } = fakeNetwork({
      "https://www.eventbrite.es/e/entradas-123": { status: 403 },
    });
    const [result] = await check(["https://www.eventbrite.es/e/entradas-123"], fetchImpl);
    expect(result!.state).toBe("unverifiable");
    expect(result!.state).not.toBe("broken");
    expect(result!.reason).toContain("refuses automated requests");
  });

  it("treats 429 the same way: rate limiting is not a dead link", async () => {
    const { fetchImpl } = fakeNetwork({ "https://meetup.com/group": { status: 429 } });
    const [result] = await check(["https://meetup.com/group"], fetchImpl);
    expect(result!.state).toBe("unverifiable");
  });

  it("treats a 5xx as unverifiable, not broken: today's outage is not a bad URL", async () => {
    const { fetchImpl } = fakeNetwork({ "https://example.org/x": { status: 503 } });
    const [result] = await check(["https://example.org/x"], fetchImpl);
    expect(result!.state).toBe("unverifiable");
  });

  it("calls an unresolvable hostname broken", async () => {
    const { fetchImpl } = fakeNetwork({});
    const results = await checkUrls(["https://nope.invalid/feed.json"], ORIGIN, {
      fetchImpl,
      resolve: async () => {
        throw new Error("NXDOMAIN");
      },
    });
    expect(results[0]).toMatchObject({ state: "broken", reason: "that hostname does not resolve" });
  });

  it("calls a refused connection broken", async () => {
    const { fetchImpl } = fakeNetwork({ "https://example.org/x": "throw" });
    const [result] = await check(["https://example.org/x"], fetchImpl);
    expect(result!.state).toBe("broken");
  });

  it("calls a timeout unverifiable — a slow server is nobody's bug", async () => {
    const { fetchImpl } = fakeNetwork({ "https://example.org/x": "hang" });
    const [result] = await check(["https://example.org/x"], fetchImpl);
    expect(result!.state).toBe("unverifiable");
  });
});

describe("checkUrls — how it asks", () => {
  it("uses HEAD first", async () => {
    const { fetchImpl, calls } = fakeNetwork({ "https://example.org/a": { status: 200 } });
    await check(["https://example.org/a"], fetchImpl);
    expect(calls).toEqual([{ url: "https://example.org/a", method: "HEAD" }]);
  });

  it("falls back to GET when HEAD is refused", async () => {
    const { fetchImpl, calls } = fakeNetwork({
      "https://example.org/a": { status: 200, methods: ["GET"] },
    });
    const [result] = await check(["https://example.org/a"], fetchImpl);
    expect(calls.map((c) => c.method)).toEqual(["HEAD", "GET"]);
    // A server that refuses HEAD serves the resource fine; saying otherwise
    // would invent a broken link.
    expect(result!.state).toBe("ok");
  });

  it("refuses a URL the SSRF rules refuse, without fetching it", async () => {
    const { fetchImpl, calls } = fakeNetwork({});
    const results = await checkUrls(
      ["http://169.254.169.254/latest/meta-data/", "file:///etc/passwd"],
      ORIGIN,
      { fetchImpl, resolve },
    );
    expect(results.map((r) => r.state)).toEqual(["skipped", "skipped"]);
    expect(calls).toEqual([]);
  });
});

describe("checkUrls — redirects", () => {
  it("follows a redirect and reports where it landed", async () => {
    const fetchImpl = (async (input: RequestInfo | URL) =>
      String(input) === "https://example.org/old"
        ? new Response(null, { status: 301, headers: { location: "https://example.org/new" } })
        : new Response(null, { status: 200 })) as unknown as typeof fetch;
    const [result] = await check(["https://example.org/old"], fetchImpl);
    expect(result!.state).toBe("ok");
  });

  it("re-checks every hop: a public URL redirecting inwards is refused", async () => {
    // The SSRF case a one-time check on the submitted URL cannot catch.
    const fetchImpl = (async (input: RequestInfo | URL) =>
      String(input) === "https://example.org/open"
        ? new Response(null, {
            status: 302,
            headers: { location: "http://169.254.169.254/latest/meta-data/" },
          })
        : new Response("secrets", { status: 200 })) as unknown as typeof fetch;
    const [result] = await check(["https://example.org/open"], fetchImpl);
    expect(result!.state).toBe("skipped");
    expect(result!.state).not.toBe("ok");
  });
});

describe("checkUrls — budgets", () => {
  it("deduplicates before asking anyone", async () => {
    const { fetchImpl, calls } = fakeNetwork({ "https://example.org/a": { status: 200 } });
    const results = await check(
      ["https://example.org/a", "https://example.org/a", "https://example.org/a"],
      fetchImpl,
    );
    expect(calls).toHaveLength(1);
    expect(results).toHaveLength(1);
  });

  it("skips what it cannot reach within the URL cap, and says so", async () => {
    const urls = Array.from({ length: 5 }, (_, i) => `https://example.org/${i}`);
    const { fetchImpl, calls } = fakeNetwork(
      Object.fromEntries(urls.map((url) => [url, { status: 200 }])),
    );
    const results = await check(urls, fetchImpl, { maxUrls: 2 });
    expect(calls).toHaveLength(2);
    // Skipped, never "ok": an unchecked URL must not read as a working one.
    expect(results.filter((r) => r.state === "skipped")).toHaveLength(3);
    expect(results[4]!.reason).toContain("2 URLs per request");
  });

  it("stops when the time budget is spent", async () => {
    const urls = Array.from({ length: 4 }, (_, i) => `https://example.org/${i}`);
    const { fetchImpl } = fakeNetwork(
      Object.fromEntries(urls.map((url) => [url, { status: 200 }])),
    );
    let clock = 0;
    const results = await checkUrls(urls, ORIGIN, {
      fetchImpl,
      resolve,
      limits: { concurrency: 1, totalBudgetMs: 10 },
      // Each read of the clock advances it, so the budget expires mid-batch.
      now: () => (clock += 6),
    });
    expect(results.some((r) => r.state === "skipped")).toBe(true);
    expect(results.filter((r) => r.state === "skipped")[0]!.reason).toContain("time budget");
  });

  it("reuses a cached answer instead of asking again", async () => {
    const { fetchImpl, calls } = fakeNetwork({ "https://example.org/a": { status: 200 } });
    const store = new Map<string, Response>();
    const cache = {
      match: async (request: Request) => store.get(request.url)?.clone(),
      put: async (request: Request, response: Response) => {
        store.set(request.url, response);
      },
    };
    const deps = { fetchImpl, resolve, cache };
    await checkUrls(["https://example.org/a"], ORIGIN, deps);
    const second = await checkUrls(["https://example.org/a"], ORIGIN, deps);
    // Two validations of the same feed in a row must not hammer anyone.
    expect(calls).toHaveLength(1);
    expect(second[0]!.state).toBe("ok");
  });

  it("has limits worth publishing", () => {
    expect(DEFAULT_CHECK_LIMITS.maxUrls).toBeGreaterThan(0);
    expect(DEFAULT_CHECK_LIMITS.concurrency).toBeLessThanOrEqual(10);
  });
});
