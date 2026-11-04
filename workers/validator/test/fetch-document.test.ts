import { describe, expect, it, vi } from "vitest";

import { DEFAULT_LIMITS, fetchDocument } from "../src/fetch-document.js";

const PUBLIC_IP = "93.184.216.34";

/** Resolver that answers "public" for everything except the names given. */
function resolver(map: Record<string, string[]> = {}) {
  return async (hostname: string) => map[hostname] ?? [PUBLIC_IP];
}

/** A fetch stub driven by a URL → Response table. */
function fakeFetch(routes: Record<string, () => Response>): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    const route = routes[url];
    if (!route) throw new Error(`unexpected fetch: ${url}`);
    return route();
  }) as unknown as typeof fetch;
}

const json = (body: string) =>
  new Response(body, { status: 200, headers: { "content-type": "application/ote+json" } });

const redirect = (to: string, status = 302) =>
  new Response(null, { status, headers: { location: to } });

/** A body of `chunks` × 1 MB, produced lazily so the test never holds it all. */
function hugeStream(chunks: number): Response {
  const megabyte = new Uint8Array(1024 * 1024).fill(0x61);
  let sent = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (sent++ >= chunks) return controller.close();
      controller.enqueue(megabyte);
    },
  });
  return new Response(stream, { status: 200, headers: { "content-type": "application/json" } });
}

/**
 * A host that accepts the request and then says nothing — the only failure
 * that really does spend the whole budget, and the one indistinguishable from
 * a slow origin from out here.
 */
function neverAnswers(): typeof fetch {
  return (async (_input: unknown, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        const error = new Error("timed out");
        error.name = "TimeoutError";
        reject(error);
      });
    })) as unknown as typeof fetch;
}

describe("fetchDocument", () => {
  it("returns the bytes, the final URL and the content-type", async () => {
    const result = await fetchDocument("https://comunidad.example/feed.json", {
      fetchImpl: fakeFetch({ "https://comunidad.example/feed.json": () => json('{"a":1}') }),
      resolve: resolver(),
    });
    expect(result).toMatchObject({
      ok: true,
      finalUrl: "https://comunidad.example/feed.json",
      contentType: "application/ote+json",
      body: '{"a":1}',
      redirects: [],
    });
  });

  it("sends no cookies, no authorization and no caller identity", async () => {
    const spy = vi.fn(async (_url: string, _init?: RequestInit) => json("{}"));
    await fetchDocument("https://comunidad.example/feed.json", {
      fetchImpl: spy as unknown as typeof fetch,
      resolve: resolver(),
    });
    const init = spy.mock.calls[0][1]!;
    const headers = init.headers as Record<string, string>;
    expect(Object.keys(headers).sort()).toEqual(["accept", "user-agent"]);
    expect(init.redirect).toBe("manual");
  });

  it("revalidates every redirect hop: public URL → private IP is refused", async () => {
    const result = await fetchDocument("https://comunidad.example/feed", {
      fetchImpl: fakeFetch({
        "https://comunidad.example/feed": () => redirect("http://169.254.169.254/latest/meta-data/"),
      }),
      resolve: resolver(),
    });
    expect(result).toMatchObject({ ok: false, code: "blocked-address" });
  });

  it("also refuses a redirect to a hostname that resolves privately", async () => {
    const result = await fetchDocument("https://comunidad.example/feed", {
      fetchImpl: fakeFetch({
        "https://comunidad.example/feed": () => redirect("https://inside.attacker.example/"),
      }),
      resolve: resolver({ "inside.attacker.example": ["127.0.0.1"] }),
    });
    expect(result).toMatchObject({ ok: false, code: "blocked-address" });
  });

  it("follows a bounded number of redirects and reports the chain", async () => {
    const result = await fetchDocument("https://comunidad.example/a", {
      fetchImpl: fakeFetch({
        "https://comunidad.example/a": () => redirect("/b"),
        "https://comunidad.example/b": () => json('{"ok":true}'),
      }),
      resolve: resolver(),
    });
    expect(result).toMatchObject({
      ok: true,
      finalUrl: "https://comunidad.example/b",
      redirects: ["https://comunidad.example/b"],
    });
  });

  it("gives up past the redirect limit instead of looping", async () => {
    const result = await fetchDocument("https://comunidad.example/loop", {
      fetchImpl: fakeFetch({ "https://comunidad.example/loop": () => redirect("/loop") }),
      resolve: resolver(),
      limits: { maxRedirects: 2 },
    });
    expect(result).toMatchObject({ ok: false, code: "too-many-redirects" });
  });

  it("waits the 60 s the rest of the ecosystem waits", () => {
    // Not a style preference: at 5 s/10 s this endpoint called a registered
    // adopter's feed unreachable while the bot that links here told the same
    // publisher it was valid (#70). https://eventos.wiki/events.json answers
    // 200 with ~554 KB in 23.6-51 s, measured; the spec repo's health check
    // and its registration bot both wait 60 s. Lower this and the bug is back
    // on the feed's slower days.
    expect(DEFAULT_LIMITS.totalTimeoutMs).toBeGreaterThanOrEqual(60_000);
    // The one hop of a direct feed must be able to spend the whole budget —
    // a per-hop ceiling below it would re-break exactly that feed.
    expect(DEFAULT_LIMITS.hopTimeoutMs).toBeGreaterThanOrEqual(
      DEFAULT_LIMITS.totalTimeoutMs,
    );
  });

  it("names the limit it hit, and the modes that do not need this service", async () => {
    // A slow origin is nobody's bug, so the message has to leave the organizer
    // with a next step rather than just "took too long".
    const slow = (async (_input: unknown, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          const error = new Error("timed out");
          error.name = "TimeoutError";
          reject(error);
        });
      })) as unknown as typeof fetch;

    const result = await fetchDocument("https://comunidad.example/slow.json", {
      fetchImpl: slow,
      resolve: resolver(),
      limits: { hopTimeoutMs: 100, totalTimeoutMs: 200 },
    });
    expect(result).toMatchObject({ ok: false, code: "timeout", status: 504 });
    expect((result as { message: string }).message).toContain("0.1 s");
    expect((result as { message: string }).message).toContain("0.2 s");
    expect((result as { message: string }).message).toMatch(/Upload a file/);
    expect((result as { message: string }).message).toMatch(/Paste JSON/);
  });

  it("calls a slow origin slow, and never invalid or unreachable", async () => {
    // The word is the fix (#70): "unreachable" over a feed that is valid and
    // merely slow to generate reads as an accusation in the publisher's
    // README, and the badge takes its wording from here.
    const result = await fetchDocument("https://comunidad.example/slow.json", {
      fetchImpl: neverAnswers(),
      resolve: resolver(),
      limits: { hopTimeoutMs: 100, totalTimeoutMs: 100 },
    });
    const message = (result as { message: string }).message;
    expect(message).toMatch(/this origin slow/);
    expect(message).not.toMatch(/unreachable/i);
    // Says which of the two is at fault, rather than leaving it open.
    expect(message).toMatch(/not this feed invalid/);
    // One budget for hop and chain means one number in the message, not the
    // same number twice as if two separate limits had been hit.
    expect(message.match(/0\.1 s/g)).toHaveLength(1);
  });

  it("tries a second time after a transport error, and says so only once", async () => {
    const attempts = vi.fn();
    const flaky = (async () => {
      if (attempts.mock.calls.length === 0) {
        attempts();
        throw new TypeError("network error");
      }
      attempts();
      return json('{"a":1}');
    }) as unknown as typeof fetch;

    const result = await fetchDocument("https://comunidad.example/feed.json", {
      fetchImpl: flaky,
      resolve: resolver(),
      limits: { retryBackoffMs: 1 },
    });
    expect(result).toMatchObject({ ok: true, body: '{"a":1}' });
    expect(attempts).toHaveBeenCalledTimes(2);
  });

  it("tries a second time after a 503, which is the host saying “not now”", async () => {
    const spy = vi.fn(async () => new Response("busy", { status: 503 }));
    const result = await fetchDocument("https://comunidad.example/feed.json", {
      fetchImpl: spy as unknown as typeof fetch,
      resolve: resolver(),
      limits: { retryBackoffMs: 1 },
    });
    expect(result).toMatchObject({ ok: false, code: "upstream-error" });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("does not ask twice about a 404, which is the host saying “not ever”", async () => {
    const spy = vi.fn(async () => new Response("nope", { status: 404 }));
    await fetchDocument("https://comunidad.example/feed.json", {
      fetchImpl: spy as unknown as typeof fetch,
      resolve: resolver(),
      limits: { retryBackoffMs: 1 },
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("never retries a timeout", async () => {
    // The deliberate divergence from the health check and the registration
    // bot, which do retry one: those run unattended, while somebody is
    // watching this endpoint. Having waited the whole budget once, waiting it
    // again doubles the wait and still ends in "slow".
    const spy = vi.fn(neverAnswers());
    const result = await fetchDocument("https://comunidad.example/slow.json", {
      fetchImpl: spy as unknown as typeof fetch,
      resolve: resolver(),
      limits: { hopTimeoutMs: 50, totalTimeoutMs: 50, retryBackoffMs: 1 },
    });
    expect(result).toMatchObject({ ok: false, code: "timeout" });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("gives up in the connect budget when nothing is listening", async () => {
    // The mirror-image false negative of #70, and the reason the 60 s above is
    // affordable: measured against the deployed runtime, a live host with a
    // filtered port spent the entire 60 s and came back reading "slow". A TCP
    // probe settles it in 8, and the adopter feed that needs the long clock
    // accepts a connection in 0.1 s.
    const spy = vi.fn(neverAnswers());
    const result = await fetchDocument("https://comunidad.example/feed.json", {
      fetchImpl: spy as unknown as typeof fetch,
      resolve: resolver(),
      probe: async () => "no-connection",
    });
    expect(result).toMatchObject({ ok: false, code: "no-connection", status: 502 });
    // Nothing is listening, so no 60 s fetch is even started.
    expect(spy).not.toHaveBeenCalled();
    const message = (result as { message: string }).message;
    expect(message).toContain("8 s");
    // "Slow" is the other diagnosis, with a different next step; the upload
    // and paste modes cannot rescue a URL that nothing answers.
    expect(message).not.toMatch(/slow/i);
    expect(message).not.toMatch(/Paste JSON/);
  });

  it("knocks on the port the URL implies, and only once per hop", async () => {
    const probe = vi.fn(async (_host: string, _port: number, _budgetMs: number) => "open" as const);
    await fetchDocument("https://comunidad.example/feed.json", {
      fetchImpl: fakeFetch({ "https://comunidad.example/feed.json": () => json("{}") }),
      resolve: resolver(),
      probe,
    });
    expect(probe).toHaveBeenCalledWith("comunidad.example", 443, 8_000);

    const explicit = vi.fn(
      async (_host: string, _port: number, _budgetMs: number) => "open" as const,
    );
    await fetchDocument("http://comunidad.example:8080/feed.json", {
      fetchImpl: fakeFetch({ "http://comunidad.example:8080/feed.json": () => json("{}") }),
      resolve: resolver(),
      probe: explicit,
    });
    expect(explicit).toHaveBeenCalledWith("comunidad.example", 8080, 8_000);
  });

  it("proceeds anyway when the probe cannot tell — it may shorten a wait, never invent a failure", async () => {
    // The probe fails open by design. Connecting to an IP literal does not
    // behave in the runtime (an IPv6 literal is refused outright), so an
    // inconclusive probe must cost nothing rather than turn a working feed
    // unreachable.
    const result = await fetchDocument("https://comunidad.example/feed.json", {
      fetchImpl: fakeFetch({ "https://comunidad.example/feed.json": () => json('{"a":1}') }),
      resolve: resolver(),
      probe: async () => "inconclusive",
    });
    expect(result).toMatchObject({ ok: true, body: '{"a":1}' });
  });

  it("re-probes each redirect hop, since a redirect can point anywhere", async () => {
    const probe = vi.fn(async (_host: string, _port: number, _budgetMs: number) => "open" as const);
    await fetchDocument("https://comunidad.example/feed", {
      fetchImpl: fakeFetch({
        "https://comunidad.example/feed": () => redirect("https://cdn.example/feed.json"),
        "https://cdn.example/feed.json": () => json("{}"),
      }),
      resolve: resolver(),
      probe,
    });
    expect(probe.mock.calls.map((call) => call[0])).toEqual([
      "comunidad.example",
      "cdn.example",
    ]);
  });

  it("honours a deadline set by its caller instead of starting a fresh budget", async () => {
    // How the badge keeps its two fetches inside one advertised ceiling.
    const spy = vi.fn(async () => json("{}"));
    const result = await fetchDocument("https://comunidad.example/feed.json", {
      fetchImpl: spy as unknown as typeof fetch,
      resolve: resolver(),
      deadline: Date.now() - 1,
    });
    expect(result).toMatchObject({ ok: false, code: "timeout" });
    expect(spy).not.toHaveBeenCalled();
  });

  it("cuts a 50 MB response at the cap without buffering it", async () => {
    const result = await fetchDocument("https://comunidad.example/huge.json", {
      fetchImpl: fakeFetch({ "https://comunidad.example/huge.json": () => hugeStream(50) }),
      resolve: resolver(),
    });
    expect(result).toMatchObject({ ok: false, code: "too-large", status: 413 });
  });

  it("applies the cap to decoded bytes, so a small declared size cannot lie", async () => {
    // Content-Length says 10; the stream delivers 2 MB. The cap is enforced
    // on what actually arrives.
    const response = hugeStream(2);
    Object.defineProperty(response.headers, "get", {
      value: (name: string) => (name === "content-length" ? "10" : null),
    });
    const result = await fetchDocument("https://comunidad.example/lies.json", {
      fetchImpl: fakeFetch({ "https://comunidad.example/lies.json": () => response }),
      resolve: resolver(),
      limits: { maxBytes: 1024 },
    });
    expect(result).toMatchObject({ ok: false, code: "too-large" });
  });

  it("reports upstream errors as upstream, not as a bad request", async () => {
    const result = await fetchDocument("https://comunidad.example/missing.json", {
      fetchImpl: fakeFetch({
        "https://comunidad.example/missing.json": () => new Response("nope", { status: 404 }),
      }),
      resolve: resolver(),
    });
    expect(result).toMatchObject({ ok: false, code: "upstream-error", status: 502 });
    expect((result as { message: string }).message).toContain("404");
  });

  it("refuses file: before any network call happens", async () => {
    const spy = vi.fn();
    const result = await fetchDocument("file:///etc/passwd", {
      fetchImpl: spy as unknown as typeof fetch,
      resolve: resolver(),
    });
    expect(result).toMatchObject({ ok: false, code: "blocked-scheme" });
    expect(spy).not.toHaveBeenCalled();
  });
});
