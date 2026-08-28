import { describe, expect, it } from "vitest";

import { followCandidate, resolveUrl } from "../src/lib/resolve.js";

const ENDPOINT = "https://fetch.example";

const FEED = '{"specVersion":"0.4.0","title":"Comunidad","license":"CC0-1.0","updatedAt":"2026-07-06T10:00:00Z","events":[]}';

const page = (head: string) => `<!doctype html><html><head>${head}</head><body></body></html>`;

/** Stands in for the fetcher Worker: URL → the envelope it would answer. */
function fakeWorker(
  documents: Record<string, { contentType: string | null; body: string }>,
): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    const requested = new URL(input.toString());
    const target = requested.searchParams.get("url") ?? "";
    const document = documents[target];
    if (!document) {
      return new Response(
        JSON.stringify({ ok: false, code: "upstream-error", message: `That URL answered 404.` }),
        { status: 502, headers: { "content-type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify({
        ok: true,
        finalUrl: target,
        status: 200,
        contentType: document.contentType,
        bytes: document.body.length,
        redirects: [],
        body: document.body,
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  }) as unknown as typeof fetch;
}

const deps = (fetchImpl: typeof fetch) => ({ endpoint: ENDPOINT, fetchImpl });

describe("resolveUrl", () => {
  it("validates a URL that is already the document", async () => {
    const resolution = await resolveUrl(
      "https://comunidad.example/feed.json",
      deps(
        fakeWorker({
          "https://comunidad.example/feed.json": {
            contentType: "application/ote+json",
            body: FEED,
          },
        }),
      ),
    );
    expect(resolution).toMatchObject({
      outcome: "document",
      text: FEED,
      provenance: { via: "direct", note: { kind: "ote" } },
    });
  });

  it("asks the fetcher for a non-ASCII URL encoded exactly once", async () => {
    // 0.4.0 validates HTTP(S) URLs as `iri`, so `…/pycamp-españa/feed.json` is
    // an address a feed may really be published at. It travels as the value of
    // `?url=`, which is a different operation from rewriting the address: one
    // round of `encodeURIComponent`, undone by the Worker's own
    // `searchParams.get`. Encoded twice, the Worker fetches `%25C3%25B1` and
    // answers 404 — a broken feed by our own arithmetic.
    const feedUrl = "https://comunidad.example/pycamp-españa/feed.json";
    const asked: string[] = [];
    const worker = fakeWorker({
      [feedUrl]: { contentType: "application/ote+json", body: FEED },
    });
    const spy = (async (input: RequestInfo | URL, init?: RequestInit) => {
      asked.push(input.toString());
      return worker(input, init);
    }) as unknown as typeof fetch;

    const resolution = await resolveUrl(feedUrl, deps(spy));

    expect(asked).toEqual([`${ENDPOINT}/fetch?url=${encodeURIComponent(feedUrl)}`]);
    expect(asked[0]).not.toContain("%25");
    expect(resolution).toMatchObject({
      outcome: "document",
      provenance: { via: "direct", url: feedUrl },
    });
  });

  it("discovers the feed of a home page and reports both hops", async () => {
    const resolution = await resolveUrl(
      "https://comunidad.example/",
      deps(
        fakeWorker({
          "https://comunidad.example/": {
            contentType: "text/html",
            body: page('<link rel="alternate" type="application/ote+json" href="/feed.json">'),
          },
          "https://comunidad.example/feed.json": {
            contentType: "application/ote+json",
            body: FEED,
          },
        }),
      ),
    );
    expect(resolution).toMatchObject({
      outcome: "document",
      provenance: {
        via: "link",
        pageUrl: "https://comunidad.example/",
        url: "https://comunidad.example/feed.json",
      },
    });
  });

  it("asks the user to choose when a page declares several feeds", async () => {
    const resolution = await resolveUrl(
      "https://comunidad.example/",
      deps(
        fakeWorker({
          "https://comunidad.example/": {
            contentType: "text/html",
            body: page(
              '<link rel="alternate" type="application/ote+json" href="/es.json" title="Español">' +
                '<link rel="alternate" type="application/ote+json" href="/en.json" title="English">',
            ),
          },
        }),
      ),
    );
    expect(resolution).toMatchObject({ outcome: "candidates" });
    if (resolution.outcome !== "candidates") return;
    expect(resolution.candidates).toHaveLength(2);
  });

  it("says 'not discovered' for a page without a link — never 'invalid'", async () => {
    const resolution = await resolveUrl(
      "https://comunidad.example/",
      deps(
        fakeWorker({
          "https://comunidad.example/": {
            contentType: "text/html",
            body: page("<title>Comunidad</title>"),
          },
        }),
      ),
    );
    expect(resolution.outcome).toBe("not-found");
  });

  it("passes the fetcher's own refusal through, SSRF codes included", async () => {
    const refusing = (async () =>
      new Response(
        JSON.stringify({ ok: false, code: "blocked-address", message: "not publicly routable" }),
        { status: 400, headers: { "content-type": "application/json" } },
      )) as unknown as typeof fetch;
    const resolution = await resolveUrl("http://169.254.169.254/", deps(refusing));
    expect(resolution).toMatchObject({ outcome: "error", code: "blocked-address" });
  });

  it("explains that the other two modes still work when the fetcher is down", async () => {
    const down = (async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;
    const resolution = await resolveUrl("https://comunidad.example/feed.json", deps(down));
    expect(resolution).toMatchObject({ outcome: "error", code: "fetcher-unreachable" });
    if (resolution.outcome !== "error") return;
    expect(resolution.message).toContain("pasting JSON");
  });

  it("reports a <link> that points at something that is not a feed as a discovery failure", async () => {
    const resolution = await resolveUrl(
      "https://comunidad.example/",
      deps(
        fakeWorker({
          "https://comunidad.example/": {
            contentType: "text/html",
            body: page('<link rel="alternate" type="application/ote+json" href="/feed.ics">'),
          },
          "https://comunidad.example/feed.ics": {
            contentType: "text/calendar",
            body: "BEGIN:VCALENDAR",
          },
        }),
      ),
    );
    expect(resolution).toMatchObject({ outcome: "error", code: "link-not-a-feed" });
  });
});

describe("followCandidate", () => {
  it("uses an embedded feed without going back to the network", async () => {
    const never = (async () => {
      throw new Error("should not fetch");
    }) as unknown as typeof fetch;
    const resolution = await followCandidate(
      {
        url: "https://comunidad.example/#ote-feed-1",
        mediaType: "application/ote+json",
        title: "",
        source: "embedded",
        inlineDocument: FEED,
      },
      "https://comunidad.example/",
      deps(never),
    );
    expect(resolution).toMatchObject({ outcome: "document", text: FEED, provenance: { via: "embedded" } });
  });

  it("fetches the chosen candidate and keeps the page it came from", async () => {
    const resolution = await followCandidate(
      {
        url: "https://comunidad.example/en.json",
        mediaType: "application/ote+json",
        title: "English",
        source: "link",
      },
      "https://comunidad.example/",
      deps(
        fakeWorker({
          "https://comunidad.example/en.json": {
            contentType: "application/feed+json",
            body: FEED,
          },
        }),
      ),
    );
    expect(resolution).toMatchObject({
      outcome: "document",
      provenance: {
        via: "link",
        pageUrl: "https://comunidad.example/",
        url: "https://comunidad.example/en.json",
        note: { kind: "ote", mediaType: "application/feed+json" },
      },
    });
  });
});

describe("when nothing usable is behind the fetch endpoint", () => {
  it("says what answered instead of JSON, and how to fix it locally", async () => {
    // The shape of `pnpm dev` without OTE_FETCH_ENDPOINT: the page is served
    // by esbuild, the relative /fetch hits its 404, and the old message
    // ("answered unusably") named neither the cause nor a next step.
    const staticServer = (async () =>
      new Response("404 - Not Found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" },
      })) as unknown as typeof fetch;

    const resolution = await resolveUrl("https://comunidad.example/feed.json", {
      endpoint: "",
      fetchImpl: staticServer,
    });

    expect(resolution).toMatchObject({ outcome: "error", code: "fetcher-error" });
    const { message } = resolution as { message: string };
    expect(message).toContain("404");
    expect(message).toContain("text/plain");
    expect(message).toContain("OTE_FETCH_ENDPOINT");
  });
});
