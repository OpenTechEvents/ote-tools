import { describe, expect, it, vi } from "vitest";
import type { OteFeed } from "@opentechevents/export-jsonld";
import { isPastEvent, renderSchemaPage } from "../src/schema-page.js";

const event = (id: string, startDate: string, endDate?: string): OteFeed["events"][number] => ({
  id, name: id, startDate, ...(endDate ? { endDate } : {}), timezone: "Europe/Madrid",
});

describe("schema event list", () => {
  it("uses each event's timezone and preserves all-day or undated endings until the day ends", () => {
    const now = new Date("2026-11-24T22:30:00Z"); // 23:30 in Madrid
    expect(isPastEvent(event("past", "2026-11-23"), now)).toBe(true);
    expect(isPastEvent(event("today", "2026-11-24"), now)).toBe(false);
    expect(isPastEvent(event("unknown end", "2026-11-24T12:00"), now)).toBe(false);
    expect(isPastEvent(event("ended", "2026-11-24T12:00", "2026-11-24T13:00"), now)).toBe(true);
    expect(isPastEvent(event("ongoing", "2026-11-24", "2026-11-25"), now)).toBe(false);
    expect(isPastEvent({ ...event("unknown zone", "2026-01-01"), timezone: "Unknown/Zone" }, now)).toBe(false);
  });
  it("sorts descending, collapses past events and expands the selected past event", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-11-24T12:00:00Z"));
      const feed: OteFeed = { specVersion: "0.6.0", title: "Events", updatedAt: "2026-01-01T00:00:00Z", events: [
        event("old", "2025-01-01"), event("new", "2027-01-01"), event("newer", "2028-01-01"),
      ] };
      const url = new URL("https://convert.example/schema?feed=https%3A%2F%2Fexample.org%2Ffeed.json");
      const data = { "@context": "https://schema.org", "@graph": [] };
      const html = renderSchemaPage(data, url, feed);
      expect(html.indexOf('>newer</span>')).toBeLessThan(html.indexOf('>new</span>'));
      expect(html).toContain('<details class="past-events"><summary>Past events (1)</summary>');
      expect(renderSchemaPage(data, url, feed, "old")).toContain('<details class="past-events" open>');
      expect(html).toContain('<a class="brand" href="/">');
    } finally { vi.useRealTimers(); }
  });
});
