import { describe, expect, it } from "vitest";

import { fromEventJson } from "../src/lib/event-json.js";
import {
  applyBulkEdit,
  buildBulkEditTemplate,
  collectKnownSeries,
  collectSeriesMembers,
  diffEventJson,
  diffFormState,
} from "../src/lib/series.js";
import type { FormState, ListedEvent, OteEvent } from "../src/lib/types.js";

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

const DAY = 24 * 60 * 60 * 1000;
const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * DAY).toISOString();

function listed(
  name: string,
  startDate: string,
  partOfId: string,
  overrides: Partial<OteEvent> = {},
): ListedEvent {
  return {
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    event: {
      id: `https://example.org/events/${name}`,
      name,
      startDate,
      partOf: { id: partOfId, type: "series" },
      ...overrides,
    } as OteEvent,
  };
}

describe("collectSeriesMembers", () => {
  it("returns an empty list when nothing matches", () => {
    expect(collectSeriesMembers([listed("A", iso(1), "s1")], "other")).toEqual([]);
  });

  it("includes multipart identities, unlike collectKnownSeries", () => {
    const entry = listed("A", iso(1), "s1", { partOf: { id: "s1", type: "multipart" } });
    expect(collectSeriesMembers([entry], "s1")).toEqual([entry]);
  });

  it("orders soonest-future-first", () => {
    const past = listed("Past", iso(-10), "s1");
    const soon = listed("Soon", iso(5), "s1");
    const later = listed("Later", iso(20), "s1");
    expect(collectSeriesMembers([later, past, soon], "s1").map((e) => e.event.name)).toEqual([
      "Soon",
      "Later",
      "Past",
    ]);
  });

  it("falls back to most-recent-past-first when none are future", () => {
    const older = listed("Older", iso(-30), "s1");
    const recent = listed("Recent", iso(-2), "s1");
    expect(collectSeriesMembers([older, recent], "s1").map((e) => e.event.name)).toEqual([
      "Recent",
      "Older",
    ]);
  });
});

describe("buildBulkEditTemplate", () => {
  it("blanks identity/schedule fields, keeping everything else from the header", () => {
    const header = listed("A", iso(1), "s1", { license: "CC-BY-4.0", description: "hi" });
    const template = buildBulkEditTemplate(header);
    expect(template.slug).toBe("");
    expect(template.id).toBe("");
    expect(template.startDate).toBe("");
    expect(template.startTime).toBe("");
    expect(template.endDate).toBe("");
    expect(template.endTime).toBe("");
    expect(template.status).toBe("");
    expect(template.updatedAt).toBe("");
    expect(template.license).toBe("CC-BY-4.0");
    expect(template.description).toBe("hi");
  });

  it("does not clear sourceRetrievedAt, matching duplicateEvent's own precedent", () => {
    const header = listed("A", iso(1), "s1", { source: { name: "Import", retrievedAt: "2026-01-01" } });
    expect(buildBulkEditTemplate(header).sourceRetrievedAt).toBe("2026-01-01");
  });
});

describe("diffFormState", () => {
  it("reports a changed scalar field", () => {
    const before = fromEventJson({ name: "A", license: "CC-BY-4.0" } as OteEvent, "");
    const after: FormState = { ...before, license: "CC0-1.0" };
    expect(diffFormState(before, after)).toEqual({ license: "CC0-1.0" });
  });

  it("never includes an excluded identity/schedule field, even when changed", () => {
    const before = fromEventJson({ name: "A", startDate: "2026-01-01" } as OteEvent, "slug-a");
    const after: FormState = { ...before, slug: "slug-b", startDate: "2026-02-01", partOfId: "https://x/series/a" };
    expect(diffFormState(before, after)).toEqual({});
  });

  it("uses structural comparison for repeater fields, not reference equality", () => {
    const before = fromEventJson({ name: "A" } as OteEvent, "");
    before.organizers = [{ name: "Org", url: "", email: "", type: "" }];
    const after: FormState = { ...before, organizers: [{ name: "Org", url: "", email: "", type: "" }] };
    expect(diffFormState(before, after)).toEqual({});
  });

  it("reports a repeater field that actually differs", () => {
    const before = fromEventJson({ name: "A" } as OteEvent, "");
    const after: FormState = {
      ...before,
      organizers: [{ name: "New Org", url: "", email: "", type: "" }],
    };
    expect(diffFormState(before, after)).toEqual({ organizers: after.organizers });
  });

  it("returns an empty patch when nothing differs", () => {
    const before = fromEventJson({ name: "A", license: "CC0-1.0" } as OteEvent, "");
    expect(diffFormState(before, { ...before })).toEqual({});
  });
});

describe("diffEventJson", () => {
  it("reports a changed scalar field with its new value", () => {
    const before = { id: "https://x/e", name: "A", license: "CC-BY-4.0" } as OteEvent;
    const after = { id: "https://x/e", name: "A", license: "CC0-1.0" } as OteEvent;
    expect(diffEventJson(before, after)).toEqual({ license: "CC0-1.0" });
  });

  it("reports a changed structural (array/object) field with its new value", () => {
    const before = { id: "https://x/e", name: "A", image: ["https://x/1.png"] } as OteEvent;
    const after = { id: "https://x/e", name: "A", image: ["https://x/2.png"] } as OteEvent;
    expect(diffEventJson(before, after)).toEqual({ image: ["https://x/2.png"] });
  });

  it("reports a key removed in `after` as null", () => {
    const before = { id: "https://x/e", name: "A", description: "hi" } as OteEvent;
    const after = { id: "https://x/e", name: "A" } as OteEvent;
    expect(diffEventJson(before, after)).toEqual({ description: null });
  });

  it("returns an empty patch when nothing differs", () => {
    const event = { id: "https://x/e", name: "A", license: "CC0-1.0" } as OteEvent;
    expect(diffEventJson(event, { ...event })).toEqual({});
  });

  it("never includes id, even when it differs", () => {
    const before = { id: "https://x/a", name: "A" } as OteEvent;
    const after = { id: "https://x/b", name: "A" } as OteEvent;
    expect(diffEventJson(before, after)).toEqual({});
  });
});

describe("applyBulkEdit", () => {
  it("drops a member entirely when nothing changed for it", () => {
    const a = listed("A", iso(1), "s1", { license: "CC0-1.0" });
    expect(applyBulkEdit([a], { license: "CC0-1.0" }, new Map())).toEqual([]);
  });

  it("applies the shared patch to every member whose value differs", () => {
    const a = listed("A", iso(1), "s1", { license: "CC-BY-4.0" });
    const b = listed("B", iso(2), "s1", { license: "CC0-1.0" });
    const entries = applyBulkEdit([a, b], { license: "CC0-1.0" }, new Map());
    expect(entries).toHaveLength(1);
    expect(entries[0]!.event.name).toBe("A");
    expect(entries[0]!.changedFields).toEqual(["license"]);
    expect(entries[0]!.patch).toEqual({ license: "CC0-1.0" });
  });

  it("applies a per-member date override independently of the shared patch", () => {
    const a = listed("A", iso(1), "s1");
    const b = listed("B", iso(2), "s1");
    const overrides = new Map([
      [a.slug!, { startDate: "2026-12-25", startTime: "10:00", endDate: "", endTime: "" }],
    ]);
    const entries = applyBulkEdit([a, b], {}, overrides);
    expect(entries).toHaveLength(1);
    expect(entries[0]!.event.name).toBe("A");
    expect(entries[0]!.event.startDate).toBe("2026-12-25T10:00");
    expect(entries[0]!.changedFields).toEqual(["startDate", "startTime"]);
    expect(entries[0]!.patch).toEqual({ startDate: "2026-12-25T10:00" });
  });

  it("combines a shared patch and a date override for the same member", () => {
    const a = listed("A", iso(1), "s1", { license: "CC-BY-4.0" });
    const overrides = new Map([
      [a.slug!, { startDate: "2026-12-25", startTime: "10:00", endDate: "", endTime: "" }],
    ]);
    const entries = applyBulkEdit([a], { license: "CC0-1.0" }, overrides);
    expect(entries).toHaveLength(1);
    expect(entries[0]!.changedFields.sort()).toEqual(["license", "startDate", "startTime"]);
    expect(entries[0]!.patch).toEqual({ license: "CC0-1.0", startDate: "2026-12-25T10:00" });
  });

  it("applies an end date/time override alongside start", () => {
    const a = listed("A", iso(1), "s1", { endDate: iso(1) });
    const overrides = new Map([
      [a.slug!, { startDate: "2026-12-25", startTime: "10:00", endDate: "2026-12-25", endTime: "12:00" }],
    ]);
    const entries = applyBulkEdit([a], {}, overrides);
    expect(entries).toHaveLength(1);
    expect(entries[0]!.event.endDate).toBe("2026-12-25T12:00");
    expect(entries[0]!.changedFields.sort()).toEqual(["endDate", "endTime", "startDate", "startTime"]);
    expect(entries[0]!.patch).toEqual({
      startDate: "2026-12-25T10:00",
      endDate: "2026-12-25T12:00",
    });
  });

  it("returns nothing for an empty patch and no date overrides", () => {
    const a = listed("A", iso(1), "s1");
    expect(applyBulkEdit([a], {}, new Map())).toEqual([]);
  });
});
