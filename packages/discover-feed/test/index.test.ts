import { describe, expect, it } from "vitest";

import {
  classifyContentType,
  detectDocumentKind,
  discover,
  discoverFromHtml,
  isOteMediaType,
  parseEmbeddedFeeds,
  parseLinkElements,
  wellKnownFeedUrl,
} from "../src/index.js";

const page = (head: string, body = "<body><p>hi</p></body>") =>
  `<!doctype html><html lang="es"><head>${head}</head>${body}</html>`;

const OTE_LINK =
  '<link rel="alternate" type="application/ote+json" href="/feed.json" title="Eventos">';

describe("classifyContentType", () => {
  it("recognizes both undecided OTE media types", () => {
    expect(classifyContentType("application/ote+json")).toBe("ote-json");
    expect(classifyContentType("application/feed+json; charset=utf-8")).toBe("ote-json");
    expect(isOteMediaType("APPLICATION/OTE+JSON")).toBe(true);
  });

  it("accepts generic JSON without claiming it announces OTE", () => {
    expect(classifyContentType("application/json")).toBe("json");
    expect(isOteMediaType("application/json")).toBe(false);
  });

  it("classifies HTML and everything else", () => {
    expect(classifyContentType("text/html; charset=utf-8")).toBe("html");
    expect(classifyContentType("text/calendar")).toBe("other");
    expect(classifyContentType(null)).toBe("other");
  });
});

describe("parseLinkElements", () => {
  it("reads rel, type, href and title, quoted or not", () => {
    const links = parseLinkElements(
      page(`<link rel=alternate type='application/ote+json' href=/a.json>${OTE_LINK}`),
    );
    expect(links).toEqual([
      { rel: "alternate", type: "application/ote+json", href: "/a.json", title: "" },
      { rel: "alternate", type: "application/ote+json", href: "/feed.json", title: "Eventos" },
    ]);
  });

  it("ignores links outside the head and inside comments", () => {
    const html = page(
      `<!-- ${OTE_LINK} -->`,
      `<body><link rel="alternate" type="application/ote+json" href="/body.json"></body>`,
    );
    expect(parseLinkElements(html)).toEqual([]);
  });

  it("decodes entities in href", () => {
    const html = page('<link rel="alternate" type="application/ote+json" href="/f.json?a=1&amp;b=2">');
    expect(parseLinkElements(html)[0].href).toBe("/f.json?a=1&b=2");
  });
});

describe("discoverFromHtml", () => {
  it("resolves hrefs against the document URL", () => {
    const candidates = discoverFromHtml(page(OTE_LINK), "https://comunidad.example/eventos/");
    expect(candidates).toEqual([
      {
        url: "https://comunidad.example/feed.json",
        mediaType: "application/ote+json",
        title: "Eventos",
        source: "link",
      },
    ]);
  });

  it("accepts application/feed+json while the spec has not decided", () => {
    const candidates = discoverFromHtml(
      page('<link rel="alternate" type="application/feed+json" href="feed.json">'),
      "https://comunidad.example/index.html",
    );
    expect(candidates[0]).toMatchObject({
      url: "https://comunidad.example/feed.json",
      mediaType: "application/feed+json",
    });
  });

  it("lists every declared feed instead of silently taking the first", () => {
    const candidates = discoverFromHtml(
      page(
        '<link rel="alternate" type="application/ote+json" href="/es.json" title="Español">' +
          '<link rel="alternate" type="application/ote+json" href="/en.json" title="English">',
      ),
      "https://comunidad.example/",
    );
    expect(candidates.map((c) => c.url)).toEqual([
      "https://comunidad.example/es.json",
      "https://comunidad.example/en.json",
    ]);
  });

  it("deduplicates the same feed declared twice", () => {
    const candidates = discoverFromHtml(page(OTE_LINK + OTE_LINK), "https://comunidad.example/");
    expect(candidates).toHaveLength(1);
  });

  it("skips RSS, icons and other alternates", () => {
    const candidates = discoverFromHtml(
      page(
        '<link rel="alternate" type="application/rss+xml" href="/rss.xml">' +
          '<link rel="icon" href="/favicon.ico">' +
          '<link rel="stylesheet" href="/style.css">',
      ),
      "https://comunidad.example/",
    );
    expect(candidates).toEqual([]);
  });

  it("drops non-http(s) hrefs: a page cannot point the fetcher at file:", () => {
    const candidates = discoverFromHtml(
      page(
        '<link rel="alternate" type="application/ote+json" href="file:///etc/passwd">' +
          '<link rel="alternate" type="application/ote+json" href="javascript:alert(1)">',
      ),
      "https://comunidad.example/",
    );
    expect(candidates).toEqual([]);
  });

  it("only reads embedded feeds when asked to", () => {
    const html = page("") .replace(
      "<p>hi</p>",
      '<script type="application/ote+json">{"specVersion":"0.4.0"}</script>',
    );
    expect(discoverFromHtml(html, "https://comunidad.example/")).toEqual([]);
    const [candidate] = discoverFromHtml(html, "https://comunidad.example/", { embedded: true });
    expect(candidate).toMatchObject({
      source: "embedded",
      inlineDocument: '{"specVersion":"0.4.0"}',
    });
  });
});

describe("parseEmbeddedFeeds", () => {
  it("ignores scripts of any other type", () => {
    const html = page("", '<body><script type="application/ld+json">{}</script><script>x=1</script></body>');
    expect(parseEmbeddedFeeds(html)).toEqual([]);
  });
});

describe("discover", () => {
  const json = '{"specVersion":"0.4.0","events":[]}';

  it("treats a JSON response as the document", () => {
    const result = discover({
      url: "https://comunidad.example/feed.json",
      contentType: "application/ote+json",
      body: json,
    });
    expect(result).toEqual({
      outcome: "document",
      text: json,
      mediaType: "application/ote+json",
      note: { kind: "ote", mediaType: "application/ote+json" },
    });
  });

  it("reports which media type it found for generic JSON", () => {
    const result = discover({
      url: "https://comunidad.example/feed.json",
      contentType: "application/json",
      body: json,
    });
    expect(result).toMatchObject({
      outcome: "document",
      note: { kind: "generic-json", mediaType: "application/json" },
    });
  });

  it("falls back to the bytes when the server sends no content-type", () => {
    expect(
      discover({ url: "https://comunidad.example/feed.json", contentType: null, body: json }),
    ).toMatchObject({ outcome: "document", note: { kind: "missing" } });
  });

  it("discovers the feed of a community home page", () => {
    const result = discover({
      url: "https://comunidad.example/",
      contentType: "text/html; charset=utf-8",
      body: page(OTE_LINK),
    });
    expect(result).toMatchObject({
      outcome: "candidates",
      candidates: [{ url: "https://comunidad.example/feed.json" }],
    });
  });

  it("says 'no feed found', not 'invalid', for a page without a link", () => {
    const result = discover({
      url: "https://comunidad.example/",
      contentType: "text/html",
      body: page("<title>Comunidad</title>"),
    });
    expect(result.outcome).toBe("not-found");
  });

  it("offers /.well-known/ote-feed only behind the flag", () => {
    const input = {
      url: "https://comunidad.example/pagina/",
      contentType: "text/html",
      body: page(""),
    };
    expect(discover(input)).not.toHaveProperty("wellKnownUrl");
    expect(discover({ ...input, options: { wellKnown: true } })).toMatchObject({
      wellKnownUrl: "https://comunidad.example/.well-known/ote-feed",
    });
  });

  it("rejects what is neither JSON nor HTML", () => {
    expect(
      discover({
        url: "https://comunidad.example/eventos.ics",
        contentType: "text/calendar",
        body: "BEGIN:VCALENDAR",
      }),
    ).toMatchObject({ outcome: "unsupported" });
  });
});

describe("wellKnownFeedUrl", () => {
  it("is origin-relative, not path-relative", () => {
    expect(wellKnownFeedUrl("https://comunidad.example/a/b/c.html")).toBe(
      "https://comunidad.example/.well-known/ote-feed",
    );
  });
});

describe("detectDocumentKind", () => {
  it("reads the document's shape, since the format has no discriminator", () => {
    expect(detectDocumentKind({ specVersion: "0.4.0", events: [] })).toBe("feed");
    expect(detectDocumentKind({ name: "Meetup", startDate: "2026-06-11T18:30" })).toBe("event");
    expect(detectDocumentKind({ title: "Feed", updatedAt: "2026-07-06T10:00:00Z" })).toBe("feed");
    expect(detectDocumentKind([])).toBe("unknown");
    expect(detectDocumentKind({ specVersion: "0.4.0" })).toBe("unknown");
  });

  it("still recognises a feed that declares an older spec version", () => {
    // Discovery precedes validation: a document is found, then judged. Most
    // live feeds will say 0.3.0 for months after 0.4.0 ships, and refusing to
    // recognise them here would hide them instead of reporting the version.
    expect(detectDocumentKind({ specVersion: "0.3.0", events: [] })).toBe("feed");
  });
});
