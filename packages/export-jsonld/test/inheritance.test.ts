import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateFeed } from "@opentechevents/validate";
import { feedToJsonLd, type OteFeed } from "../src/index.js";

// See the twin in export-ics. `organizer` is exactly the field a search
// engine reads, so dropping it for the events that inherit it is not a
// sparser result — it is a wrong one.
const feed = JSON.parse(readFileSync(
  new URL("../../validate/fixtures/valid/feed-community.json", import.meta.url), "utf8",
)) as OteFeed;

describe("a feed's defaults reach every node", () => {
  it("is a valid feed whose events inherit rather than repeat", () => {
    expect(validateFeed(feed).errors).toEqual([]);
    expect(feed.events.some((event) => event.organizers === undefined)).toBe(true);
  });
  it("gives every event an organizer, or none of them", () => {
    const graph = (feedToJsonLd(feed) as { "@graph": { organizer?: unknown }[] })["@graph"];
    expect(graph).toHaveLength(feed.events.length);
    for (const node of graph) expect(node.organizer).toBeDefined();
  });
});
