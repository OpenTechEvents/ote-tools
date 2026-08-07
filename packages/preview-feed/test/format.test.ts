import { describe, expect, it } from "vitest";

import {
  addDays,
  detailRows,
  eventLocation,
  eventWhen,
  formatDate,
  isDateOnly,
  nonEmpty,
  parseSortDate,
  sortedEvents,
  truncate,
} from "../src/format.js";
import type { PreviewEvent } from "../src/types.js";

describe("truncate", () => {
  it("passes short text through unchanged", () => {
    expect(truncate("hello")).toBe("hello");
  });

  it("collapses whitespace and adds an ellipsis past the length budget", () => {
    const long = "word ".repeat(100).trim();
    const result = truncate(long, 20);
    expect(result!.length).toBe(20);
    expect(result!.endsWith("…")).toBe(true);
  });

  it("returns undefined for empty input", () => {
    expect(truncate(undefined)).toBeUndefined();
    expect(truncate("")).toBeUndefined();
  });
});

describe("nonEmpty", () => {
  it("joins non-empty arrays, drops empty ones", () => {
    expect(nonEmpty(["a", "b"])).toBe("a, b");
    expect(nonEmpty([])).toBeUndefined();
  });

  it("trims strings, drops blank ones", () => {
    expect(nonEmpty("  hi  ")).toBe("hi");
    expect(nonEmpty("   ")).toBeUndefined();
  });

  it("stringifies numbers/booleans and JSON-encodes plain objects", () => {
    expect(nonEmpty(42)).toBe("42");
    expect(nonEmpty(false)).toBe("false");
    expect(nonEmpty({ a: 1 })).toBe('{"a":1}');
  });
});

describe("detailRows", () => {
  it("drops entries whose value is empty, keeps the rest as label/value pairs", () => {
    expect(
      detailRows([
        ["Status", "scheduled"],
        ["Tags", []],
        ["Count", 3],
      ]),
    ).toEqual([
      { label: "Status", value: "scheduled" },
      { label: "Count", value: "3" },
    ]);
  });
});

describe("parseSortDate", () => {
  it("parses date-only and date-time values", () => {
    expect(parseSortDate("2026-06-15")).toBe(Date.parse("2026-06-15T00:00:00"));
    expect(parseSortDate("2026-06-15T18:00")).toBe(
      Date.parse("2026-06-15T18:00:00"),
    );
  });

  it("returns null for absent or unparseable values", () => {
    expect(parseSortDate(undefined)).toBeNull();
    expect(parseSortDate("not a date")).toBeNull();
  });
});

describe("isDateOnly", () => {
  it("recognizes YYYY-MM-DD and rejects anything else", () => {
    expect(isDateOnly("2026-06-15")).toBe(true);
    expect(isDateOnly("2026-06-15T18:00")).toBe(false);
    expect(isDateOnly(undefined)).toBe(false);
  });
});

describe("addDays", () => {
  it("adds calendar days in UTC, immune to host timezone", () => {
    expect(addDays("2026-06-30", 1)).toBe("2026-07-01");
  });
});

describe("eventLocation", () => {
  it("prefers venue over onlineUrl, falls back to 'online'", () => {
    expect(eventLocation({ location: { venue: "Hall" } })).toBe("Hall");
    expect(eventLocation({ location: { onlineUrl: "https://x" } })).toBe("https://x");
    expect(eventLocation({})).toBe("online");
  });
});

describe("formatDate", () => {
  it("formats a date-only value without a time component", () => {
    expect(formatDate("2026-06-15", undefined)).not.toMatch(/:/);
  });

  it("appends the timezone label when given one", () => {
    expect(formatDate("2026-06-15T18:00", "Europe/Madrid")).toContain(
      "(Europe/Madrid)",
    );
  });

  it("returns an empty string for an absent value", () => {
    expect(formatDate(undefined, undefined)).toBe("");
  });
});

describe("eventWhen", () => {
  it("prefers an explicit dateLabel over computed formatting", () => {
    const event: PreviewEvent = { name: "x", dateLabel: "Every Tuesday" };
    expect(eventWhen(event)).toBe("Every Tuesday");
  });

  it("joins start and end with 'to' when both are present", () => {
    const event: PreviewEvent = {
      name: "x",
      startDate: "2026-06-15",
      endDate: "2026-06-16",
    };
    expect(eventWhen(event)).toMatch(/ to /);
  });
});

describe("sortedEvents", () => {
  const at = (startDate: string): PreviewEvent => ({ name: startDate, startDate });

  it("orders undated events last, keeping their original relative order", () => {
    const events = [at("2030-01-01"), { name: "no date" }, at("2030-06-01")];
    const result = sortedEvents(events);
    expect(result.map((e) => e.name)).toEqual([
      "2030-01-01",
      "2030-06-01",
      "no date",
    ]);
  });

  it("sorts upcoming events soonest-first and past events most-recent-first, upcoming before past", () => {
    const future1 = at("2999-01-01");
    const future2 = at("2999-06-01");
    const past1 = at("2000-01-01");
    const past2 = at("2000-06-01");
    const result = sortedEvents([past1, future2, past2, future1]);
    expect(result).toEqual([future1, future2, past2, past1]);
  });
});
