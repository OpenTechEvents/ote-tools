import { describe, expect, it, vi } from "vitest";

import { renderBadge, resolveBadge, type BadgeState } from "../src/badge.js";
import { handleRequest, type BadgeCache } from "../src/index.js";

/**
 * Inline rather than read from `packages/validate/fixtures`: this package
 * compiles against the Workers types, without Node's, so it has no `fs` and
 * no `import.meta.url`. The corpus is still the referee — what is asserted
 * here is the badge's plumbing, not the schema.
 */
const VALID_FEED = JSON.stringify({
  specVersion: "0.4.0",
  title: "Comunidad",
  url: "https://comunidad.example",
  license: "CC-BY-4.0",
  organizers: [{ name: "Comunidad", url: "https://comunidad.example" }],
  updatedAt: "2026-07-06T10:00:00Z",
  events: [
    {
      id: "https://comunidad.example/e/1",
      url: "https://comunidad.example/e/1",
      name: "Meetup",
      startDate: "2026-06-11T18:30",
      timezone: "Europe/Madrid",
      attendanceMode: "in-person",
      location: { venue: "El Cable" },
      updatedAt: "2026-05-28T11:00:00Z",
    },
  ],
});

/**
 * The same feed at a non-ASCII address, event ids included. Valid only from
 * 0.4.0 on, where HTTP(S) URL fields validate as `iri` instead of `uri`.
 */
const NON_ASCII_FEED = JSON.stringify({
  specVersion: "0.4.0",
  title: "Comunidad",
  url: "https://comunidad.example/pycamp-españa",
  license: "CC-BY-4.0",
  organizers: [{ name: "Comunidad", url: "https://comunidad.example/pycamp-españa" }],
  updatedAt: "2026-07-06T10:00:00Z",
  events: [
    {
      id: "https://comunidad.example/pycamp-españa/e/1",
      url: "https://comunidad.example/pycamp-españa/e/1",
      name: "Meetup",
      startDate: "2026-06-11T18:30",
      timezone: "Europe/Madrid",
      attendanceMode: "in-person",
      location: { venue: "El Cable" },
      updatedAt: "2026-05-28T11:00:00Z",
    },
  ],
});

/**
 * What `new URL(…).toString()` — and therefore `fetchDocument` — asks the
 * network for when the `ñ` is typed literally. The two spellings are the same
 * address; the fixtures below assert nobody encodes it a second time.
 */
const NON_ASCII_DOC = "https://comunidad.example/pycamp-españa/feed.json";
const NON_ASCII_DOC_ENCODED = "https://comunidad.example/pycamp-espa%C3%B1a/feed.json";

const resolve = async () => ["93.184.216.34"];

/** A network that answers a fixed body per URL, and 404s anything else. */
function network(pages: Record<string, { body: string; contentType: string }>): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const page = pages[input.toString()];
    if (!page) return new Response("nope", { status: 404 });
    return new Response(page.body, {
      status: 200,
      headers: { "content-type": page.contentType },
    });
  }) as unknown as typeof fetch;
}

const json = (body: string) => ({ body, contentType: "application/ote+json" });
const html = (body: string) => ({ body, contentType: "text/html" });

describe("resolveBadge", () => {
  it("says valid for a feed that passes the schema", async () => {
    const verdict = await resolveBadge("https://comunidad.example/feed.json", {
      fetchImpl: network({ "https://comunidad.example/feed.json": json(VALID_FEED) }),
      resolve,
    });
    expect(verdict.state).toBe("valid");
  });

  it("says valid for a feed at a non-ASCII address", async () => {
    for (const typed of [NON_ASCII_DOC, NON_ASCII_DOC_ENCODED]) {
      const verdict = await resolveBadge(typed, {
        fetchImpl: network({ [NON_ASCII_DOC_ENCODED]: json(NON_ASCII_FEED) }),
        resolve,
      });
      expect(verdict.state).toBe("valid");
    }
  });

  it("says invalid for a document that fails it", async () => {
    const verdict = await resolveBadge("https://comunidad.example/feed.json", {
      fetchImpl: network({
        "https://comunidad.example/feed.json": json('{"specVersion":"0.4.0"}'),
      }),
      resolve,
    });
    expect(verdict.state).toBe("invalid");
  });

  it("says invalid, not unreachable, for a body that is not JSON at all", async () => {
    const verdict = await resolveBadge("https://comunidad.example/feed.json", {
      fetchImpl: network({ "https://comunidad.example/feed.json": json("not json") }),
      resolve,
    });
    expect(verdict.state).toBe("invalid");
  });

  it("follows the single feed an HTML page declares", async () => {
    const verdict = await resolveBadge("https://comunidad.example/", {
      fetchImpl: network({
        "https://comunidad.example/": html(
          '<html><head><link rel="alternate" type="application/ote+json" href="/feed.json"></head></html>',
        ),
        "https://comunidad.example/feed.json": json(VALID_FEED),
      }),
      resolve,
    });
    expect(verdict.state).toBe("valid");
  });

  it("says no feed found — never invalid — for a page that declares none", async () => {
    const verdict = await resolveBadge("https://comunidad.example/", {
      fetchImpl: network({ "https://comunidad.example/": html("<html><head></head></html>") }),
      resolve,
    });
    expect(verdict.state).toBe("not-discovered");
  });

  it("refuses to pick when a page declares several feeds", async () => {
    const verdict = await resolveBadge("https://comunidad.example/", {
      fetchImpl: network({
        "https://comunidad.example/": html(
          '<html><head><link rel="alternate" type="application/ote+json" href="/a.json">' +
            '<link rel="alternate" type="application/ote+json" href="/b.json"></head></html>',
        ),
      }),
      resolve,
    });
    expect(verdict.state).toBe("ambiguous");
  });

  it("says unreachable when the document cannot be fetched", async () => {
    const verdict = await resolveBadge("https://comunidad.example/feed.json", {
      fetchImpl: network({}),
      resolve,
    });
    expect(verdict.state).toBe("unreachable");
  });

  it("applies the same SSRF rules as /fetch", async () => {
    const verdict = await resolveBadge("http://169.254.169.254/latest/meta-data/", {
      fetchImpl: network({}),
      resolve,
    });
    expect(verdict.state).toBe("unreachable");
    expect(verdict.detail).toMatch(/address/i);
  });
});

describe("renderBadge", () => {
  const states: BadgeState[] = [
    "valid",
    "invalid",
    "not-discovered",
    "ambiguous",
    "unreachable",
  ];

  it("draws only its own constants, never anything fetched", () => {
    // The remote document's words are in `detail`, which the SVG must not
    // carry: this image is served into other people's READMEs.
    const svg = renderBadge("invalid");
    expect(svg).toContain("OTE feed");
    expect(svg).toContain("invalid");
    expect(svg).not.toContain("<script");
  });

  it("is wide enough for its own text in every state", () => {
    for (const state of states) {
      const svg = renderBadge(state);
      const width = Number(/width="(\d+)"/.exec(svg)?.[1]);
      const words = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
      const longest = Math.max(...words.map((word) => word.length));
      expect(width).toBeGreaterThan(longest * 6);
    }
  });
});

describe("the /badge endpoint", () => {
  const deps = (fetchImpl: typeof fetch, cache?: BadgeCache) => ({ fetchImpl, resolve, cache });

  const badge = (doc: string) =>
    new Request(`https://validator.example/badge?doc=${encodeURIComponent(doc)}`);

  it("answers an SVG that no browser will sniff into markup", async () => {
    const response = await handleRequest(
      badge("https://comunidad.example/feed.json"),
      {},
      deps(network({ "https://comunidad.example/feed.json": json(VALID_FEED) })),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/svg+xml; charset=utf-8");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("content-security-policy")).toContain("default-src 'none'");
    expect(response.headers.get("x-ote-badge-state")).toBe("valid");
    expect(await response.text()).toContain("OTE feed");
  });

  it("is cacheable, and a failure expires sooner than a verdict", async () => {
    const valid = await handleRequest(
      badge("https://comunidad.example/feed.json"),
      {},
      deps(network({ "https://comunidad.example/feed.json": json(VALID_FEED) })),
    );
    expect(valid.headers.get("cache-control")).toContain("max-age=3600");

    const down = await handleRequest(badge("https://comunidad.example/feed.json"), {}, deps(network({})));
    expect(down.headers.get("x-ote-badge-state")).toBe("unreachable");
    expect(down.headers.get("cache-control")).toContain("max-age=300");
  });

  it("serves a cached badge without touching the network again", async () => {
    const store = new Map<string, Response>();
    const cache: BadgeCache = {
      match: async (request) => store.get(request.url)?.clone(),
      put: async (request, response) => void store.set(request.url, response),
    };
    const fetchImpl = vi.fn(
      network({ "https://comunidad.example/feed.json": json(VALID_FEED) }),
    ) as unknown as typeof fetch;

    const first = await handleRequest(
      badge("https://comunidad.example/feed.json"),
      {},
      deps(fetchImpl, cache),
    );
    expect(first.headers.get("x-ote-badge-state")).toBe("valid");
    const calls = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(calls).toBeGreaterThan(0);

    const second = await handleRequest(
      badge("https://comunidad.example/feed.json"),
      {},
      deps(fetchImpl, cache),
    );
    expect(second.headers.get("x-ote-badge-state")).toBe("valid");
    expect((fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(calls);
  });

  it("keys the cache on the document, not on the request's other parameters", async () => {
    const store = new Map<string, Response>();
    const cache: BadgeCache = {
      match: async (request) => store.get(request.url)?.clone(),
      put: async (request, response) => void store.set(request.url, response),
    };
    const fetchImpl = network({ "https://comunidad.example/feed.json": json(VALID_FEED) });

    await handleRequest(badge("https://comunidad.example/feed.json"), {}, deps(fetchImpl, cache));
    expect(store.size).toBe(1);

    await handleRequest(
      new Request(
        "https://validator.example/badge?doc=https%3A%2F%2Fcomunidad.example%2Ffeed.json&utm_source=readme",
      ),
      {},
      deps(fetchImpl, cache),
    );
    expect(store.size).toBe(1);
  });

  it("answers the same badge whichever spelling of a non-ASCII URL a README carries", async () => {
    const store = new Map<string, Response>();
    const cache: BadgeCache = {
      match: async (request) => store.get(request.url)?.clone(),
      put: async (request, response) => void store.set(request.url, response),
    };
    const fetchImpl = network({ [NON_ASCII_DOC_ENCODED]: json(NON_ASCII_FEED) });

    const literal = await handleRequest(badge(NON_ASCII_DOC), {}, deps(fetchImpl, cache));
    expect(literal.headers.get("x-ote-badge-state")).toBe("valid");

    const encoded = await handleRequest(badge(NON_ASCII_DOC_ENCODED), {}, deps(fetchImpl, cache));
    expect(encoded.headers.get("x-ote-badge-state")).toBe("valid");
    // One address, one cache entry: `badgeCacheKey` normalizes both spellings.
    expect(store.size).toBe(1);
  });

  it("spends the per-IP budget only on a cache miss", async () => {
    const store = new Map<string, Response>();
    const cache: BadgeCache = {
      match: async (request) => store.get(request.url)?.clone(),
      put: async (request, response) => void store.set(request.url, response),
    };
    const limit = vi.fn(async () => ({ success: true }));
    const fetchImpl = network({ "https://comunidad.example/feed.json": json(VALID_FEED) });

    await handleRequest(
      badge("https://comunidad.example/feed.json"),
      { RATE_LIMITER: { limit } },
      deps(fetchImpl, cache),
    );
    await handleRequest(
      badge("https://comunidad.example/feed.json"),
      { RATE_LIMITER: { limit } },
      deps(fetchImpl, cache),
    );
    expect(limit).toHaveBeenCalledTimes(1);
  });

  it("requires ?doc", async () => {
    const response = await handleRequest(
      new Request("https://validator.example/badge"),
      {},
      deps(network({})),
    );
    expect(response.status).toBe(400);
  });
});
