import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { icsToPreviewFeed } from "../src/ics.js";

const fixture = readFileSync(
  fileURLToPath(new URL("../fixtures/feed.ics", import.meta.url)),
  "utf8",
);

describe("icsToPreviewFeed", () => {
  it("reads the calendar title/description from X-WR-CALNAME/X-WR-CALDESC", () => {
    const feed = icsToPreviewFeed(fixture);
    expect(feed.title).toBe("OTE Preview Fixture Calendar");
    expect(feed.description).toBe("Fixture calendar for @opentechevents/preview-feed tests");
  });

  it("maps the VEVENT into a PreviewEvent", () => {
    const [event] = icsToPreviewFeed(fixture).events;
    expect(event).toMatchObject({
      name: "Fixture Meetup",
      startDate: "2026-06-15T18:00",
      endDate: "2026-06-15T20:00",
      timezone: "UTC",
      location: "Fixture Hall",
      description: "A sample meetup used to test ICS normalization.",
    });
    expect(event!.details).toEqual([
      { label: "Status", value: "scheduled" },
      { label: "Timezone", value: "UTC" },
      { label: "Tags", value: "community, testing" },
      { label: "Updated", value: "2026-06-01T09:00:00Z" },
    ]);
  });

  it("throws a human-readable error when the calendar has no events", () => {
    const empty = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "END:VCALENDAR",
      "",
    ].join("\n");
    expect(() => icsToPreviewFeed(empty)).toThrow(
      "the calendar contains no events",
    );
  });
});
