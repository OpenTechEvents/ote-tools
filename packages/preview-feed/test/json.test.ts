import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { jsonToPreviewFeed, oteJsonToPreviewFeed } from "../src/json.js";

const fixture = readFileSync(
  fileURLToPath(new URL("../fixtures/feed.json", import.meta.url)),
  "utf8",
);

describe("jsonToPreviewFeed", () => {
  it("carries feed-level metadata through", () => {
    const feed = jsonToPreviewFeed(fixture);
    expect(feed.title).toBe("OTE Preview Fixture Feed");
    expect(feed.description).toBe("Fixture feed for @opentechevents/preview-feed tests");
    expect(feed.license).toBe("CC-BY-4.0");
    expect(feed.events).toHaveLength(3);
  });

  it("maps a full event, folding extra fields into details", () => {
    const [event] = jsonToPreviewFeed(fixture).events;
    expect(event).toMatchObject({
      name: "Fixture Conference",
      startDate: "2026-06-20T09:00",
      endDate: "2026-06-20T17:00",
      timezone: "Europe/Madrid",
      location: "Fixture Hall, Sample City",
      link: "https://fixture.example/events/2026-conf",
      description: "A sample conference used to test JSON normalization.",
    });
    expect(event!.details).toEqual([
      { label: "ID", value: "https://fixture.example/events/2026-conf" },
      { label: "Status", value: "scheduled" },
      { label: "Timezone", value: "Europe/Madrid" },
      { label: "Attendance", value: "in-person" },
      { label: "Languages", value: "en" },
      { label: "Tags", value: "fixture, testing" },
      { label: "Updated", value: "2026-06-01T09:00:00Z" },
    ]);
  });

  it("uses a friendly online location label while preserving the link target", () => {
    const [, event] = jsonToPreviewFeed(fixture).events;
    expect(event).toMatchObject({
      name: "Minimal Fixture Event",
      location: "Online link",
      locationLink: "https://meet.example/fixture",
      link: "https://meet.example/fixture",
    });
  });

  it("parses image (string form), the cheapest priced offer, and the first organizer", () => {
    const [, , event] = jsonToPreviewFeed(fixture).events;
    expect(event).toMatchObject({
      name: "Priced Workshop",
      image: { url: "https://fixture.example/img/workshop.jpg" },
      price: { amount: 30, currency: "EUR" },
      organizerName: "Fixture Community",
      attendanceMode: undefined,
    });
    expect(event!.details).toContainEqual({
      label: "Image",
      value: "https://fixture.example/img/workshop.jpg",
    });
    expect(event!.details).toContainEqual({ label: "Price", value: "30 EUR" });
    expect(event!.details).toContainEqual({ label: "Organizer", value: "Fixture Community" });
  });

  it("names untitled events rather than leaving name empty", () => {
    const feed = jsonToPreviewFeed(
      JSON.stringify({ events: [{ startDate: "2026-01-01" }] }),
    );
    expect(feed.events[0]!.name).toBe("(untitled event)");
  });

  it("maps an already-parsed OTE feed object", () => {
    const feed = oteJsonToPreviewFeed({
      title: "In-memory feed",
      events: [{ name: "Runtime Event", startDate: "2026-01-01" }],
    });

    expect(feed.title).toBe("In-memory feed");
    expect(feed.events[0]).toMatchObject({
      name: "Runtime Event",
      startDate: "2026-01-01",
    });
  });

  it("maps an already-parsed OTE event array", () => {
    const feed = oteJsonToPreviewFeed([
      { name: "First Runtime Event", startDate: "2026-01-01" },
      { name: "Second Runtime Event", startDate: "2026-01-02" },
    ]);

    expect(feed.events.map((event) => event.name)).toEqual([
      "First Runtime Event",
      "Second Runtime Event",
    ]);
  });

  it("throws when the input has no events array", () => {
    expect(() => jsonToPreviewFeed(JSON.stringify({ title: "No events" }))).toThrow(
      "feed.json has no events array",
    );
  });
});
