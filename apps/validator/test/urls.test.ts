import { describe, expect, it } from "vitest";

import { checkDocumentLinks, summarize } from "../src/lib/links.js";
import { collectDocumentUrls } from "../src/lib/urls.js";

// The feed this comes from: corunajug.org validated cleanly while every image
// 404'd, because the URLs carried a `www.` the server does not answer on. What
// these tests protect is the pair of judgements that make the feature usable —
// which URLs are worth asking about, and which answers mean "broken".

const feed = {
  specVersion: "0.3.0",
  title: "Eventos de CoruñaJUG",
  url: "https://corunajug.org/",
  license: "CC-BY-4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  events: [
    {
      // An identifier, not an address: never fetched.
      id: "https://www.corunajug.org/events/ddd-jvm-2025-09-24",
      url: "https://www.eventbrite.es/e/entradas-ddd-1684478674059",
      name: "DDD, JVM e IA",
      image: ["https://www.corunajug.org/img/talks/ddd-vo.jpg"],
      organizers: [{ name: "CoruñaJUG", url: "https://corunajug.org/" }],
      location: { venue: "Sngular", onlineUrl: "https://meet.example/jug" },
      offers: [{ price: 0, currency: "EUR", url: "https://www.meetup.com/corunajug/events/123/" }],
    },
  ],
};

describe("collectDocumentUrls", () => {
  const urls = collectDocumentUrls(feed);
  const kindOf = (url: string) => urls.find((entry) => entry.url === url)?.kind;

  it("never collects an id", () => {
    // The spec is explicit that an `id` need not resolve to anything. Checking
    // them would manufacture broken links out of correct documents.
    expect(urls.map((entry) => entry.url)).not.toContain(
      "https://www.corunajug.org/events/ddd-jvm-2025-09-24",
    );
  });

  it("tells the kinds apart, because their consequences differ", () => {
    expect(kindOf("https://www.corunajug.org/img/talks/ddd-vo.jpg")).toBe("image");
    expect(kindOf("https://www.eventbrite.es/e/entradas-ddd-1684478674059")).toBe("page");
    expect(kindOf("https://www.meetup.com/corunajug/events/123/")).toBe("registration");
    expect(kindOf("https://meet.example/jug")).toBe("online");
    expect(kindOf("https://creativecommons.org/licenses/by/4.0/")).toBe("license");
  });

  it("deduplicates, keeping every place the URL appears", () => {
    const home = urls.filter((entry) => entry.url === "https://corunajug.org/");
    expect(home).toHaveLength(1);
    // Feed url and the organizer's url are the same address in this feed.
    expect(home[0]!.pointers.length).toBeGreaterThan(1);
  });

  it("collects an image given as an object entry, not only as a bare string", () => {
    const withEntry = collectDocumentUrls({
      image: [{ url: "https://example.org/a.png", alt: "…" }],
    });
    expect(withEntry).toEqual([
      { url: "https://example.org/a.png", kind: "image", pointers: ["/image/0/url"] },
    ]);
  });

  it("ignores an SPDX licence and anything that is not http(s)", () => {
    const other = collectDocumentUrls({
      license: "CC-BY-4.0",
      url: "mailto:hola@example.org",
      onlineUrl: "not a url",
    });
    expect(other).toEqual([]);
  });
});

describe("checkDocumentLinks", () => {
  const okResponse = (results: unknown) =>
    (async () =>
      new Response(JSON.stringify({ ok: true, results }), {
        headers: { "content-type": "application/json" },
      })) as unknown as typeof fetch;

  it("posts every URL once and pairs the answers back to their places", async () => {
    const seen: string[] = [];
    const fetchImpl = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as { urls: string[] };
      seen.push(...body.urls);
      return new Response(
        JSON.stringify({
          ok: true,
          results: body.urls.map((url) => ({ url, state: "ok", reason: "answered 200" })),
        }),
        { headers: { "content-type": "application/json" } },
      );
    }) as unknown as typeof fetch;

    const report = await checkDocumentLinks(feed, { endpoint: "", fetchImpl });
    expect(report.status).toBe("ok");
    if (report.status !== "ok") return;
    expect(new Set(seen).size).toBe(seen.length);
    expect(report.checked.every((entry) => entry.pointers.length > 0)).toBe(true);
  });

  it("keeps a 403 out of the broken count", async () => {
    const fetchImpl = okResponse([
      {
        url: "https://corunajug.org/",
        state: "unverifiable",
        status: 403,
        reason: "answered 403 — this server refuses automated requests",
      },
    ]);
    const report = await checkDocumentLinks({ url: "https://corunajug.org/" }, {
      endpoint: "",
      fetchImpl,
    });
    if (report.status !== "ok") throw new Error("expected results");
    expect(summarize(report.checked)).toMatchObject({ broken: 0, unverifiable: 1 });
  });

  it("survives a checker that is down, because the verdict does not depend on it", async () => {
    const fetchImpl = (async () => {
      throw new TypeError("network error");
    }) as unknown as typeof fetch;
    const report = await checkDocumentLinks(feed, { endpoint: "", fetchImpl });
    expect(report.status).toBe("error");
    if (report.status !== "error") return;
    expect(report.message).toContain("verdict above is unaffected");
  });

  it("asks nobody anything when the document has no URLs", async () => {
    const fetchImpl = (async () => {
      throw new Error("should not be called");
    }) as unknown as typeof fetch;
    const report = await checkDocumentLinks({ name: "no links here" }, {
      endpoint: "",
      fetchImpl,
    });
    expect(report).toEqual({ status: "ok", checked: [] });
  });
});
