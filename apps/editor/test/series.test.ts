import { describe, expect, it } from "vitest";

import { collectKnownSeries } from "../src/lib/series.js";
import type { OteEvent } from "../src/lib/types.js";

function event(partOf?: OteEvent["partOf"]): OteEvent {
  return {
    id: "https://example.org/events/e",
    name: "Event",
    startDate: "2026-06-11T18:00:00+02:00",
    ...(partOf ? { partOf } : {}),
  } as OteEvent;
}

describe("collectKnownSeries", () => {
  it("returns an empty list for no events", () => {
    expect(collectKnownSeries([])).toEqual([]);
  });

  it("skips events with no partOf", () => {
    expect(collectKnownSeries([event()])).toEqual([]);
  });

  it("collects a series identity", () => {
    expect(
      collectKnownSeries([
        event({ id: "https://example.org/series/a", name: "Rust Madrid", url: "https://x" }),
      ]),
    ).toEqual([{ id: "https://example.org/series/a", name: "Rust Madrid", url: "https://x" }]);
  });

  it("dedupes by id, keeping the first occurrence's name", () => {
    const a = event({ id: "https://example.org/series/a", name: "Rust Madrid" });
    const b = event({ id: "https://example.org/series/a", name: "Rust Madrid (renamed)" });
    expect(collectKnownSeries([a, b])).toEqual([
      { id: "https://example.org/series/a", name: "Rust Madrid", url: "" },
    ]);
  });

  it("excludes multipart entries", () => {
    expect(
      collectKnownSeries([
        event({ id: "https://example.org/series/a", name: "Study jam", type: "multipart" }),
      ]),
    ).toEqual([]);
  });

  it("treats a missing type as series (schema default)", () => {
    expect(
      collectKnownSeries([event({ id: "https://example.org/series/a", name: "Rust Madrid" })]),
    ).toHaveLength(1);
  });

  it("falls back to the id as name when name is absent", () => {
    expect(collectKnownSeries([event({ id: "https://example.org/series/a" })])).toEqual([
      { id: "https://example.org/series/a", name: "https://example.org/series/a", url: "" },
    ]);
  });

  it("sorts by name", () => {
    const events = [
      event({ id: "https://example.org/series/b", name: "Zebra Meetup" }),
      event({ id: "https://example.org/series/a", name: "Async Study Jam" }),
    ];
    expect(collectKnownSeries(events).map((s) => s.name)).toEqual([
      "Async Study Jam",
      "Zebra Meetup",
    ]);
  });
});
