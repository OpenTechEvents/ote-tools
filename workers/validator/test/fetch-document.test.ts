import { describe, expect, it, vi } from "vitest";

import { fetchDocument } from "../src/fetch-document.js";

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
