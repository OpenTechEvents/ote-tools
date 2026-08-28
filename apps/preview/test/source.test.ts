import { describe, expect, it } from "vitest";

import {
  formatFromBody,
  formatFromMediaType,
  formatFromPath,
  hasCanonicalSiblings,
  parseSource,
  siblingUrl,
  sourceQuery,
} from "../src/lib/source.js";

describe("parseSource", () => {
  it("reads a repository", () => {
    expect(parseSource("?repo=OpenTechEvents/ote-template")).toEqual({
      kind: "repo",
      repo: "OpenTechEvents/ote-template",
    });
  });

  /**
   * The bug this file exists for. `feed.json` is what the OTE template calls
   * its export; nothing in the spec names a feed file, and a real published
   * feed (`https://eventos.wiki/events.json`) was rejected outright by a
   * previewer that required that exact name.
   */
  it("accepts a feed whose file is not called feed.json", () => {
    const source = parseSource("?feed=https://eventos.wiki/events.json");
    expect(source).toMatchObject({ kind: "feed", siblings: false });
    if (source.kind !== "feed") return;
    expect(source.url.toString()).toBe("https://eventos.wiki/events.json");
  });

  it("knows when the three sibling exports are worth trying", () => {
    expect(parseSource("?feed=https://x.example/feed.json")).toMatchObject({ siblings: true });
    expect(parseSource("?feed=https://x.example/feed.ics")).toMatchObject({ siblings: true });
    expect(parseSource("?feed=https://x.example/feed.xml")).toMatchObject({ siblings: true });
    expect(parseSource("?feed=https://x.example/events.json")).toMatchObject({ siblings: false });
  });

  it("takes an explicit ?format= over anything the name suggests", () => {
    expect(parseSource("?feed=https://x.example/data&format=ics")).toMatchObject({ format: "ics" });
    expect(parseSource("?feed=https://x.example/a.json&format=rss")).toMatchObject({ format: "rss" });
    expect(parseSource("?feed=https://x.example/a.json&format=xml")).toMatchObject({ format: "rss" });
    expect(parseSource("?feed=https://x.example/a.json&format=nonsense")).not.toHaveProperty("format");
  });

  /**
   * Every rejection says which value was wrong. The page shows the form in all
   * three cases, and a form that reappears blank invites pasting the same URL
   * again.
   */
  it("says what was wrong instead of silently showing nothing", () => {
    expect(parseSource("?repo=not-a-repo")).toEqual({
      kind: "none",
      problem: "“not-a-repo” is not an owner/name repository.",
    });
    expect(parseSource("?feed=nonsense")).toMatchObject({ kind: "none" });
    expect(parseSource("?feed=javascript:alert(1)")).toMatchObject({ kind: "none" });
    expect((parseSource("?feed=javascript:alert(1)") as { problem: string }).problem).toContain(
      "javascript:",
    );
  });

  it("has nothing to say about an empty query", () => {
    expect(parseSource("")).toEqual({ kind: "none" });
  });
});

describe("format detection", () => {
  it("reads the extension when there is one", () => {
    expect(formatFromPath("/events.json")).toBe("json");
    expect(formatFromPath("/calendar/2026.ics")).toBe("ics");
    expect(formatFromPath("/feed.xml")).toBe("rss");
    expect(formatFromPath("/feed.atom")).toBe("rss");
    expect(formatFromPath("/events")).toBeUndefined();
  });

  it("reads the media type, including OTE's own", () => {
    expect(formatFromMediaType("application/ote+json; charset=utf-8")).toBe("json");
    expect(formatFromMediaType("text/calendar")).toBe("ics");
    expect(formatFromMediaType("application/rss+xml")).toBe("rss");
    expect(formatFromMediaType("text/plain")).toBeUndefined();
    expect(formatFromMediaType(null)).toBeUndefined();
  });

  /**
   * The last resort, and the only one a misconfigured server cannot defeat:
   * a feed served as `text/plain` from a path with no extension.
   */
  it("reads the document itself", () => {
    expect(formatFromBody('\n  {"specVersion":"0.4.0"}')).toBe("json");
    expect(formatFromBody("BEGIN:VCALENDAR\r\nVERSION:2.0")).toBe("ics");
    expect(formatFromBody('<?xml version="1.0"?><rss>')).toBe("rss");
    expect(formatFromBody("nothing recognizable")).toBeUndefined();
  });
});

describe("sibling URLs", () => {
  it("swaps only the last path segment", () => {
    expect(siblingUrl(new URL("https://x.example/events/feed.json"), "feed.ics")).toBe(
      "https://x.example/events/feed.ics",
    );
  });

  it("survives a non-ASCII path, as 0.4.0 allows", () => {
    expect(siblingUrl(new URL("https://x.example/pycamp-españa/feed.json"), "feed.xml")).toBe(
      "https://x.example/pycamp-espa%C3%B1a/feed.xml",
    );
  });

  it("recognizes the template's own names and nothing else", () => {
    expect(hasCanonicalSiblings(new URL("https://x.example/feed.json"))).toBe(true);
    expect(hasCanonicalSiblings(new URL("https://x.example/events.json"))).toBe(false);
  });
});

describe("sourceQuery", () => {
  it("builds the link the form navigates to", () => {
    expect(sourceQuery({ repo: "owner/name" })).toBe("?repo=owner%2Fname");
    expect(sourceQuery({ feed: "https://eventos.wiki/events.json" })).toBe(
      "?feed=https%3A%2F%2Feventos.wiki%2Fevents.json",
    );
    expect(sourceQuery({ feed: "https://x.example/data", format: "ics" })).toBe(
      "?feed=https%3A%2F%2Fx.example%2Fdata&format=ics",
    );
    // "Detect automatically" is the absence of the parameter, not `format=`.
    expect(sourceQuery({ feed: "https://x.example/a.json", format: "" })).toBe(
      "?feed=https%3A%2F%2Fx.example%2Fa.json",
    );
  });
});
