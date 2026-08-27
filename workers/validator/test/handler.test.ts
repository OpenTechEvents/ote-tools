import { describe, expect, it, vi } from "vitest";

import { handleRequest, type Env } from "../src/index.js";

const ORIGIN = "https://tools.opentechevents.org";

const okFetch = (async () =>
  new Response('{"specVersion":"0.3.0","events":[]}', {
    status: 200,
    headers: { "content-type": "application/ote+json" },
  })) as unknown as typeof fetch;

function call(
  target: string,
  overrides: {
    env?: Env;
    fetchImpl?: typeof fetch;
    resolve?: (hostname: string) => Promise<string[]>;
    origin?: string | null;
  } = {},
) {
  const url = `https://fetch.example/fetch?url=${encodeURIComponent(target)}`;
  const origin = overrides.origin === undefined ? ORIGIN : overrides.origin;
  const request = new Request(url, { headers: origin ? { origin } : {} });
  return handleRequest(request, overrides.env ?? {}, {
    fetchImpl: overrides.fetchImpl ?? okFetch,
    resolve: overrides.resolve ?? (async () => ["93.184.216.34"]),
  });
}

describe("the four SSRF cases this endpoint exists to refuse", () => {
  it("file:// is rejected", async () => {
    const response = await call("file:///etc/passwd");
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ ok: false, code: "blocked-scheme" });
  });

  it("the cloud metadata address is rejected", async () => {
    const response = await call("http://169.254.169.254/latest/meta-data/");
    await expect(response.json()).resolves.toMatchObject({ ok: false, code: "blocked-address" });
  });

  it("a hostname resolving to 127.0.0.1 is rejected", async () => {
    const response = await call("https://feed.attacker.example/", {
      resolve: async () => ["127.0.0.1"],
    });
    await expect(response.json()).resolves.toMatchObject({ ok: false, code: "blocked-address" });
  });

  it("a public URL redirecting to a private IP is rejected", async () => {
    const fetchImpl = (async (input: RequestInfo | URL) =>
      input.toString() === "https://comunidad.example/feed"
        ? new Response(null, { status: 302, headers: { location: "http://10.0.0.5/admin" } })
        : new Response("secret", { status: 200 })) as unknown as typeof fetch;
    const response = await call("https://comunidad.example/feed", { fetchImpl });
    await expect(response.json()).resolves.toMatchObject({ ok: false, code: "blocked-address" });
  });
});

describe("handleRequest", () => {
  it("returns the document in a JSON envelope", async () => {
    const response = await call("https://comunidad.example/feed.json");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      finalUrl: "https://comunidad.example/feed.json",
      contentType: "application/ote+json",
      body: '{"specVersion":"0.3.0","events":[]}',
    });
  });

  it("never lets a remote body be sniffed or rendered as HTML", async () => {
    const evil = (async () =>
      new Response("<script>alert(1)</script>", {
        status: 200,
        headers: { "content-type": "text/html" },
      })) as unknown as typeof fetch;
    const response = await call("https://comunidad.example/", { fetchImpl: evil });
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("content-security-policy")).toContain("default-src 'none'");
    // The markup survives as data inside the envelope; it is never the response itself.
    await expect(response.json()).resolves.toMatchObject({
      body: "<script>alert(1)</script>",
    });
  });

  it("answers CORS only for allowed origins", async () => {
    const allowed = await call("https://comunidad.example/feed.json");
    expect(allowed.headers.get("access-control-allow-origin")).toBe(ORIGIN);

    const stranger = await call("https://comunidad.example/feed.json", {
      origin: "https://somebody-else.example",
    });
    expect(stranger.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("honours a configured origin allowlist", async () => {
    const response = await call("https://comunidad.example/feed.json", {
      env: { ALLOWED_ORIGINS: "https://staging.example" },
      origin: "https://staging.example",
    });
    expect(response.headers.get("access-control-allow-origin")).toBe("https://staging.example");
  });

  it("rate-limits per IP when the binding is present", async () => {
    const limit = vi.fn(async () => ({ success: false }));
    const request = new Request("https://fetch.example/fetch?url=https%3A%2F%2Fa.example%2F", {
      headers: { origin: ORIGIN, "cf-connecting-ip": "203.0.113.9" },
    });
    const response = await handleRequest(request, { RATE_LIMITER: { limit } }, {
      fetchImpl: okFetch,
      resolve: async () => ["93.184.216.34"],
    });
    expect(response.status).toBe(429);
    expect(limit).toHaveBeenCalledWith({ key: "203.0.113.9" });
  });

  it("requires ?url and only answers GET", async () => {
    const missing = await handleRequest(new Request("https://fetch.example/fetch"), {}, {
      fetchImpl: okFetch,
      resolve: async () => ["93.184.216.34"],
    });
    expect(missing.status).toBe(400);

    const posted = await handleRequest(
      new Request("https://fetch.example/fetch?url=https://a.example/", { method: "POST" }),
      {},
      { fetchImpl: okFetch, resolve: async () => ["93.184.216.34"] },
    );
    expect(posted.status).toBe(405);
  });

  it("has a health endpoint that publishes its limits", async () => {
    const response = await handleRequest(new Request("https://fetch.example/health"), {}, {
      fetchImpl: okFetch,
      resolve: async () => ["93.184.216.34"],
    });
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      limits: { maxBytes: 5 * 1024 * 1024, maxRedirects: 3 },
    });
  });
});
