import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  validateEvent,
  validateEventInFeed,
  validateFeed,
} from "../src/index.js";

const fixturesDir = fileURLToPath(new URL("../fixtures/", import.meta.url));

function loadFixture(...segments: string[]): unknown {
  return JSON.parse(readFileSync(join(fixturesDir, ...segments), "utf8"));
}

describe("validateEvent — valid fixtures", () => {
  const eventFiles = readdirSync(join(fixturesDir, "valid")).filter(
    (f) => f.startsWith("event-") && f.endsWith(".json"),
  );

  it.each(eventFiles)("%s is valid", (file) => {
    const result = validateEvent(loadFixture("valid", file));
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });
});

describe("validateFeed — valid fixtures", () => {
  it("feed.json is valid", () => {
    const result = validateFeed(loadFixture("valid", "feed.json"));
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });
});

describe("validateEvent — invalid fixtures", () => {
  const invalidFiles = readdirSync(join(fixturesDir, "invalid")).filter((f) =>
    f.endsWith(".json"),
  );

  it.each(invalidFiles)("%s is invalid with readable errors", (file) => {
    const result = validateEvent(loadFixture("invalid", file));
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    for (const error of result.errors) {
      expect(error.path).toBeTruthy();
      expect(error.message).toBeTruthy();
    }
  });

  it("a specVersion this validator doesn't know reads as drift, not as a typo", () => {
    const { errors } = validateEvent(
      loadFixture("invalid", "event-future-specversion.json"),
    );
    expect(errors).toContainEqual({
      path: "specVersion",
      message:
        "is not a spec version this validator knows (it implements OTE Spec 0.2.0); if the spec has moved on, update @opentechevents/validate",
    });
  });

  it("out-of-range geo pinpoints the exact field", () => {
    const { errors } = validateEvent(loadFixture("invalid", "event-bad-geo.json"));
    expect(errors).toContainEqual({
      path: "location.geo.lat",
      message: "must be <= 90",
    });
  });

  it("missing license is named explicitly", () => {
    const { errors } = validateEvent(
      loadFixture("invalid", "event-no-license.json"),
    );
    expect(errors).toContainEqual({
      path: "(document)",
      message: 'is missing required property "license"',
    });
  });

  it("invalid attendanceMode lists the allowed values", () => {
    const { errors } = validateEvent(
      loadFixture("invalid", "event-bad-attendance.json"),
    );
    expect(errors).toContainEqual({
      path: "attendanceMode",
      message: 'must be one of: "in-person", "online", "hybrid"',
    });
  });

  it("empty location asks for venue or onlineUrl in a single message", () => {
    const { errors } = validateEvent(
      loadFixture("invalid", "event-empty-location.json"),
    );
    expect(errors).toEqual([
      {
        path: "location",
        message: 'location must include at least one of "venue" or "onlineUrl"',
      },
    ]);
  });

  it("mixed date forms produce a consistency message", () => {
    const { errors } = validateEvent(
      loadFixture("invalid", "event-mixed-date-forms.json"),
    );
    expect(errors).toContainEqual({
      path: "(document)",
      message:
        "startDate and endDate must use the same form: both all-day dates or both local date-times",
    });
  });

  it("UTC offset in startDate explains it belongs in timezone", () => {
    const { errors } = validateEvent(
      loadFixture("invalid", "event-offset-in-startdate.json"),
    );
    const messages = errors.map((e) => e.message);
    expect(
      messages.some((m) => m.includes("UTC offset is never allowed")),
    ).toBe(true);
  });
});

describe("validateEventInFeed — feed-context rules for a single event", () => {
  it("an event file without specVersion/license is valid (both inherited)", () => {
    const feed = loadFixture("valid", "feed.json") as {
      events: Record<string, unknown>[];
    };
    const event = feed.events[0]!;
    expect(event.specVersion).toBeUndefined();
    expect(event.license).toBeUndefined();
    expect(validateEvent(event).valid).toBe(false); // standalone demands both…
    const result = validateEventInFeed(event); // …feed context does not
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("a standalone-shaped event (with specVersion/license) is also valid", () => {
    const result = validateEventInFeed(loadFixture("valid", "event-minimal.json"));
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("error paths are relative to the event, not the envelope", () => {
    const result = validateEventInFeed({ name: "No id, date or timezone" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      path: "(document)",
      message: 'is missing required property "id"',
    });
    const { errors } = validateEventInFeed({
      id: "https://example.org/events/x",
      name: "Bad geo",
      startDate: "2026-06-01",
      timezone: "UTC",
      location: { venue: "Somewhere", geo: { lat: 91, lon: 0 } },
    });
    expect(errors).toContainEqual({
      path: "location.geo.lat",
      message: "must be <= 90",
    });
  });
});

describe("non-object inputs", () => {
  it.each([null, "text", 42, []])("%o is invalid", (input) => {
    expect(validateEvent(input).valid).toBe(false);
    expect(validateFeed(input).valid).toBe(false);
    expect(validateEventInFeed(input).valid).toBe(false);
  });
});

describe("validateFeed — invalid cases", () => {
  it("a standalone Event is not a Feed", () => {
    const result = validateFeed(loadFixture("valid", "event-minimal.json"));
    expect(result.valid).toBe(false);
    const missing = result.errors.map((e) => e.message);
    expect(missing).toContain('is missing required property "events"');
  });

  it("an invalid event inside the feed pinpoints its index", () => {
    const feed = loadFixture("valid", "feed.json") as {
      events: Record<string, unknown>[];
    };
    delete feed.events[0]!.name;
    const result = validateFeed(feed);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      path: "events[0]",
      message: 'is missing required property "name"',
    });
  });

  it("an event inside a feed does NOT need its own specVersion or license", () => {
    const feed = loadFixture("valid", "feed.json") as {
      events: Record<string, unknown>[];
    };
    for (const event of feed.events) {
      expect(event.specVersion).toBeUndefined();
    }
    expect(validateFeed(feed).valid).toBe(true);
  });
});
