// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { parseFooter } from "../src/attrs.js";
import {
  alternateFeedUrls,
  footerMetaFromDocument,
  renderFooter,
  resolvedTimeZoneLabel,
} from "../src/footer.js";

describe("parseFooter", () => {
  it("defaults to on when the attribute is absent or empty", () => {
    expect(parseFooter(null)).toBe("on");
    expect(parseFooter("")).toBe("on");
    expect(parseFooter("   ")).toBe("on");
  });

  it("reads every spelling of no as off", () => {
    // The parseConvert lesson: an attribute whose job is to remove
    // something must not read a host's "false" as a typo and render anyway.
    for (const value of ["off", "none", "false", "OFF", " None "]) {
      expect(parseFooter(value)).toBe("off");
    }
  });

  it("reads auto, and anything unrecognized as the default", () => {
    expect(parseFooter("auto")).toBe("auto");
    expect(parseFooter("yes")).toBe("on");
    expect(parseFooter("on")).toBe("on");
  });
});

describe("alternateFeedUrls", () => {
  it("picks the ICS and RSS entries by media type", () => {
    expect(
      alternateFeedUrls([
        { mediaType: "application/rss+xml", url: "https://example.org/events.rss" },
        { mediaType: "text/calendar", url: "https://example.org/events.ics" },
        { mediaType: "application/ld+json", url: "https://example.org/events.jsonld" },
      ]),
    ).toEqual({
      icsUrl: "https://example.org/events.ics",
      rssUrl: "https://example.org/events.rss",
    });
  });

  it("compares the media type's essence, not the whole header", () => {
    expect(
      alternateFeedUrls([{ mediaType: "text/calendar; charset=utf-8", url: "https://example.org/a.ics" }]),
    ).toEqual({ icsUrl: "https://example.org/a.ics" });
  });

  it("refuses a URL a browser must not follow", () => {
    // The feed document is a stranger's JSON and these URLs land in an
    // href on the host's own page.
    expect(
      alternateFeedUrls([
        { mediaType: "text/calendar", url: "javascript:alert(1)" },
        { mediaType: "application/rss+xml", url: "data:text/xml,<rss/>" },
      ]),
    ).toEqual({});
  });

  it("survives a feed that declares nonsense", () => {
    expect(alternateFeedUrls(undefined)).toEqual({});
    expect(alternateFeedUrls("text/calendar")).toEqual({});
    expect(alternateFeedUrls([null, 3, { url: "https://example.org/a.ics" }])).toEqual({});
  });
});

describe("footerMetaFromDocument", () => {
  it("reads title, publisher URL and alternates off the fetched document", () => {
    expect(
      footerMetaFromDocument(
        {
          title: "  PyAlmería  ",
          url: "https://pyalmeria.example/",
          alternates: [{ mediaType: "text/calendar", url: "https://pyalmeria.example/events.ics" }],
          events: [],
        },
        "https://pyalmeria.example/feed.json",
      ),
    ).toEqual({
      title: "PyAlmería",
      url: "https://pyalmeria.example/",
      jsonUrl: "https://pyalmeria.example/feed.json",
      icsUrl: "https://pyalmeria.example/events.ics",
    });
  });

  it("drops a publisher URL that is not http(s)", () => {
    expect(footerMetaFromDocument({ title: "Hostile", url: "javascript:alert(1)" })).toEqual({
      title: "Hostile",
    });
  });

  it("has nothing to say about a bare events array", () => {
    expect(footerMetaFromDocument(undefined)).toEqual({});
  });
});

describe("resolvedTimeZoneLabel", () => {
  it("names the zone with its current short offset", () => {
    expect(resolvedTimeZoneLabel("UTC")).toBe("UTC (GMT+0)");
    expect(resolvedTimeZoneLabel("Europe/Madrid")).toMatch(/^Europe\/Madrid \(GMT[+-]\d/);
  });

  it("says nothing rather than guessing when the zone is unknown", () => {
    expect(resolvedTimeZoneLabel("Mars/Olympus_Mons")).toBeUndefined();
  });
});

describe("renderFooter", () => {
  const META = {
    title: "PyAlmería",
    url: "https://pyalmeria.example/",
    jsonUrl: "https://pyalmeria.example/feed.json",
  };

  it("renders the feed name as a link to the publisher's page, the zone, subscribe and the mark", () => {
    const footer = renderFooter({
      mode: "on",
      lang: "en",
      meta: META,
      hasTimes: true,
      timeZone: "Europe/Madrid",
    })!;

    const name = footer.querySelector("a.footer-feed") as HTMLAnchorElement;
    expect(name.textContent).toBe("PyAlmería");
    expect(name.href).toBe("https://pyalmeria.example/");
    expect(name.rel).toBe("noopener noreferrer");
    expect(footer.querySelector(".footer-zone")!.textContent).toMatch(/^Times in Europe\/Madrid \(GMT/);
    const subscribe = footer.querySelector("ote-subscribe")!;
    expect(subscribe.getAttribute("feed-json")).toBe(META.jsonUrl);
    expect(subscribe.getAttribute("layout")).toBe("badges");
    expect(subscribe.getAttribute("name")).toBe("PyAlmería");
    const mark = footer.querySelector("a.footer-mark") as HTMLAnchorElement;
    expect(mark.href).toBe("https://opentechevents.org/spec/");
  });

  it("renders the feed name as plain text when the feed declares no page", () => {
    const footer = renderFooter({ mode: "on", lang: "en", meta: { title: "No page" }, hasTimes: false })!;
    expect(footer.querySelector("a.footer-feed")).toBeNull();
    expect(footer.querySelector("span.footer-feed")!.textContent).toBe("No page");
  });

  it("leaves out the time zone when no rendered event has a clock time", () => {
    // A feed of date-only events shows no times, so naming a zone answers
    // a question the page never raised.
    const footer = renderFooter({ mode: "on", lang: "en", meta: META, hasTimes: false })!;
    expect(footer.querySelector(".footer-zone")).toBeNull();
  });

  it("names the source count for a multi-feed render, with the titles in the tooltip and no subscribe", () => {
    const footer = renderFooter({
      mode: "on",
      lang: "en",
      meta: { sources: ["PyAlmería", "ComBuilders"] },
      hasTimes: true,
      timeZone: "UTC",
    })!;
    const name = footer.querySelector(".footer-feed") as HTMLElement;
    expect(name.textContent).toBe("2 sources");
    expect(name.title).toBe("PyAlmería, ComBuilders");
    expect(footer.querySelector("ote-subscribe")).toBeNull();
  });

  it("mounts no subscribe element when there is no feed URL to subscribe to", () => {
    const footer = renderFooter({ mode: "on", lang: "en", meta: { title: "Host app" }, hasTimes: true })!;
    expect(footer.querySelector("ote-subscribe")).toBeNull();
    expect(footer.querySelector("a.footer-mark")).not.toBeNull();
  });

  it("passes convert through verbatim, including the empty string", () => {
    // parseConvert distinguishes "absent/empty means default" from "a value
    // naming no format means off"; re-deciding that here would give the
    // footer a different opt-out from the standalone element's.
    for (const convert of ["off", "", "ics"]) {
      const footer = renderFooter({
        mode: "on",
        lang: "en",
        meta: { ...META, convert },
        hasTimes: true,
      })!;
      expect(footer.querySelector("ote-subscribe")!.getAttribute("convert")).toBe(convert);
    }
  });

  it("hands declared ICS/RSS URLs to <ote-subscribe> so nothing is generated for them", () => {
    const footer = renderFooter({
      mode: "on",
      lang: "en",
      meta: { ...META, icsUrl: "https://pyalmeria.example/events.ics" },
      hasTimes: true,
    })!;
    const subscribe = footer.querySelector("ote-subscribe")!;
    expect(subscribe.getAttribute("feed-ics")).toBe("https://pyalmeria.example/events.ics");
    expect(subscribe.hasAttribute("feed-rss")).toBe(false);
  });

  it("renders nothing at all with footer=off", () => {
    expect(renderFooter({ mode: "off", lang: "en", meta: META, hasTimes: true })).toBeUndefined();
  });

  it("renders nothing with footer=auto when the widget knows nothing about the source", () => {
    expect(renderFooter({ mode: "auto", lang: "en", hasTimes: true })).toBeUndefined();
    expect(renderFooter({ mode: "auto", lang: "en", meta: {}, hasTimes: true })).toBeUndefined();
    expect(renderFooter({ mode: "auto", lang: "en", meta: { title: "Known" }, hasTimes: true })).toBeDefined();
  });

  it("renders a zone and a mark with footer=on even when the widget knows nothing", () => {
    // The difference between the two modes is exactly this case: a host app
    // driving the widget through .events = […].
    const footer = renderFooter({ mode: "on", lang: "en", hasTimes: true, timeZone: "UTC" })!;
    expect(footer.querySelector(".footer-feed")).toBeNull();
    expect(footer.querySelector(".footer-zone")!.textContent).toBe("Times in UTC (GMT+0)");
    expect(footer.querySelector("a.footer-mark")).not.toBeNull();
  });

  it("translates its own strings", () => {
    const footer = renderFooter({
      mode: "on",
      lang: "es",
      meta: { sources: ["Uno", "Dos"] },
      hasTimes: true,
      timeZone: "UTC",
    })!;
    expect(footer.querySelector(".footer-feed")!.textContent).toBe("2 fuentes");
    expect(footer.querySelector(".footer-zone")!.textContent).toBe("Horas en UTC (GMT+0)");
    expect(footer.querySelector("a.footer-mark")!.getAttribute("aria-label")).toContain("Publicado");
  });

  it("forwards the widget's theme and language to the mounted element", () => {
    const footer = renderFooter({ mode: "on", lang: "es", theme: "dark", meta: META, hasTimes: true })!;
    const subscribe = footer.querySelector("ote-subscribe")!;
    expect(subscribe.getAttribute("theme")).toBe("dark");
    expect(subscribe.getAttribute("lang")).toBe("es");
  });
});
