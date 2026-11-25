// @vitest-environment jsdom
//
// `rssToPreviewFeed` is browser-only (DOMParser), so the round trip needs a
// DOM; every other test in this package runs under vitest's Node default.
import { describe, expect, it } from "vitest";
import { LABELS, type Labels } from "@opentechevents/validate";
import { feedToRss, rssToPreviewFeed } from "../src/index.js";
import type { OteFeed } from "../src/types.js";
// Imported rather than read: under jsdom `import.meta.url` is an http URL,
// so `readFileSync(new URL(…))` fails with "The URL must be of scheme file".
import fixture from "../fixtures/feed.json" with { type: "json" };

const feed = fixture as OteFeed;

describe("reading the labels back", () => {
  it("never strips a label-shaped line out of the publisher's own prose", () => {
    // An English feed whose description opens with a Spanish field name is
    // still just prose: the exporter did not write it, so the parser must
    // not claim it.
    const prose = "Estado: todo va bien.\n\nCuándo: ya lo diremos.";
    const xml = feedToRss({ ...feed, events: [{ ...feed.events[0]!, description: prose }] });
    const parsed = rssToPreviewFeed(xml);
    expect(parsed.events[0]!.description).toContain("Estado: todo va bien.");
    expect(parsed.events[0]!.description).toContain("Cuándo: ya lo diremos.");
  });
  it("recovers the fields it did write, in Spanish", () => {
    const parsed = rssToPreviewFeed(feedToRss(feed, { locale: "es" }));
    expect(parsed.events[0]!.when).toContain(feed.events[0]!.timezone);
    expect(parsed.events[0]!.when).not.toContain("Cuándo:");
  });
  it("keeps the when, where and online label sets disjoint across languages", () => {
    // A language whose `when` equalled another's `where` would silently drop
    // the location: the `when` branch is tested first.
    const names = (pick: (labels: Labels) => string) => Object.values(LABELS).map(pick);
    const when = new Set(names((labels) => labels.when));
    for (const name of [...names((labels) => labels.where), ...names((labels) => labels.online)]) {
      expect(when.has(name), name).toBe(false);
    }
  });
});
