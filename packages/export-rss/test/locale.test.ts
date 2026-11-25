import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { feedToRss } from "../src/index.js";
import type { OteFeed } from "../src/types.js";

const feed = JSON.parse(readFileSync(new URL("../fixtures/feed.json", import.meta.url), "utf8")) as OteFeed;
const decode = (xml: string) => xml.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&amp;", "&");

describe("labelled output in the reader's language", () => {
  it("translates the field names and the status prefix", () => {
    const xml = decode(feedToRss(feed, { locale: "es" }));
    expect(xml).toContain("<strong>Cuándo:</strong>");
    expect(xml).toContain("<strong>Dónde:</strong>");
    expect(xml).not.toContain("<strong>When:</strong>");
  });
  it("renders dates in the requested language while keeping the published zone", () => {
    const xml = decode(feedToRss(feed, { locale: "es" }));
    const when = /<strong>Cuándo:<\/strong> ([^<]+)/.exec(xml)?.[1] ?? "";
    expect(when).toMatch(/de \d{4}/);
    expect(when).toContain(feed.events[0]!.timezone);
    // The wall clock the publisher wrote, not an instant converted to the
    // reader's zone: RSS has no place to say which zone a time is in.
    expect(when).toContain(feed.events[0]!.startDate.slice(11, 16));
  });
  it("falls back to English labels for a language with no labels, and still localizes the date", () => {
    const xml = decode(feedToRss(feed, { locale: "de" }));
    expect(xml).toContain("<strong>When:</strong>");
    // A reader who asked for German gets the date they can read; translating
    // the words themselves would need a German column in the label table.
    const when = /<strong>When:<\/strong> ([^<]+)/.exec(xml)?.[1] ?? "";
    expect(when).not.toBe(`${feed.events[0]!.startDate.replace("T", " ")} (${feed.events[0]!.timezone})`);
  });
  it("changes nothing at all when no locale is asked for", () => {
    expect(feedToRss(feed, {})).toBe(feedToRss(feed));
  });
});
