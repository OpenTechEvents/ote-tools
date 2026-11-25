import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateFeed } from "@opentechevents/validate";
import { feedToRss, type OteFeed } from "../src/index.js";

// See the twin in export-ics: the spec's community feed inherits instead of
// repeating, which this package's own fixture never does.
const feed = JSON.parse(readFileSync(
  new URL("../../validate/fixtures/valid/feed-community.json", import.meta.url), "utf8",
)) as OteFeed;

describe("a feed's defaults reach every item", () => {
  it("is a valid feed whose events inherit rather than repeat", () => {
    expect(validateFeed(feed).errors).toEqual([]);
    expect(feed.events.some((event) => event.organizers === undefined)).toBe(true);
  });
  it("credits an author on every item, or on none", () => {
    const items = feedToRss(feed).split("<item>").slice(1);
    expect(items).toHaveLength(feed.events.length);
    for (const item of items) expect(item).toMatch(/<(author|dc:creator)>/);
  });
});
