import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateFeed } from "@opentechevents/validate";
import { feedToIcs, type OteFeed } from "../src/index.js";

// The spec's own community feed: it declares its organizers, language and
// licence once at the feed level and lets its events inherit them, which is
// what the spec recommends ("One line in the feed, zero repetition"). This
// package's own fixture declares everything per event, so it cannot see this.
const feed = JSON.parse(readFileSync(
  new URL("../../validate/fixtures/valid/feed-community.json", import.meta.url), "utf8",
)) as OteFeed;

describe("a feed's defaults reach every event", () => {
  it("is a valid feed whose events inherit rather than repeat", () => {
    expect(validateFeed(feed).errors).toEqual([]);
    expect(feed.events.some((event) => event.organizers === undefined)).toBe(true);
  });
  it("names an organizer on every event, or on none", () => {
    // The publisher's sentence, not an implementation detail: one file, one
    // publisher, one command — and half the events must not come out
    // anonymous.
    const vevents = feedToIcs(feed).split("BEGIN:VEVENT").slice(1);
    expect(vevents).toHaveLength(feed.events.length);
    for (const vevent of vevents) expect(vevent).toMatch(/^(ORGANIZER|X-OTE-ORGANIZER)/m);
  });
  it("stamps the feed's language on an event that did not state one", () => {
    const ics = feedToIcs(feed).replaceAll("\r\n ", "");
    expect(feed.textLanguage).toBe("es");
    for (const vevent of ics.split("BEGIN:VEVENT").slice(1)) {
      expect(vevent).toContain("SUMMARY;LANGUAGE=");
    }
  });
});
