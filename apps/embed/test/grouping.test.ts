import { describe, expect, it } from "vitest";

import type { PreviewEvent } from "@opentechevents/preview-feed";

import { computeEventGroups } from "../src/grouping.js";

const DAY = 24 * 60 * 60 * 1000;
const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * DAY).toISOString();

function event(
  name: string,
  startDate: string,
  partOf?: { id: string; type?: "series" | "multipart" },
): PreviewEvent {
  return {
    name,
    startDate,
    partOf: partOf ? { id: partOf.id, type: partOf.type ?? "series" } : undefined,
  };
}

describe("computeEventGroups", () => {
  it("returns empty maps when no group types are enabled", () => {
    const events = [
      event("A", iso(1), { id: "s1" }),
      event("B", iso(2), { id: "s1" }),
    ];
    const groups = computeEventGroups(events, new Set());
    expect(groups.headerOf.size).toBe(0);
    expect(groups.infoOf.size).toBe(0);
  });

  it("ignores events without partOf", () => {
    const events = [event("A", iso(1)), event("B", iso(2))];
    const groups = computeEventGroups(events, new Set(["series"]));
    expect(groups.infoOf.size).toBe(0);
  });

  it("skips buckets with fewer than 2 members", () => {
    const events = [event("Solo", iso(1), { id: "s1" }), event("Other", iso(2))];
    const groups = computeEventGroups(events, new Set(["series"]));
    expect(groups.infoOf.size).toBe(0);
  });

  it("buckets by partOf.id and picks the soonest future occurrence as header", () => {
    const past = event("Past", iso(-10), { id: "s1" });
    const soonFuture = event("Soon", iso(5), { id: "s1" });
    const laterFuture = event("Later", iso(20), { id: "s1" });
    const groups = computeEventGroups([past, laterFuture, soonFuture], new Set(["series"]));

    const info = groups.infoOf.get(soonFuture)!;
    expect(info.members.map((m) => m.name)).toEqual(["Soon", "Later", "Past"]);
    expect(groups.headerOf.get(past)).toBe(soonFuture);
    expect(groups.headerOf.get(laterFuture)).toBe(soonFuture);
    expect(info.total).toBe(3);
  });

  it("falls back to the most recent past occurrence when none are future", () => {
    const older = event("Older", iso(-30), { id: "s1" });
    const recent = event("Recent", iso(-2), { id: "s1" });
    const groups = computeEventGroups([older, recent], new Set(["series"]));
    const header = groups.headerOf.get(older)!;
    expect(header.name).toBe("Recent");
  });

  it("assigns 1-based index within the chronological member order", () => {
    const a = event("A", iso(1), { id: "s1" });
    const b = event("B", iso(2), { id: "s1" });
    const c = event("C", iso(3), { id: "s1" });
    const groups = computeEventGroups([c, a, b], new Set(["series"]));
    expect(groups.infoOf.get(a)!.index).toBe(1);
    expect(groups.infoOf.get(b)!.index).toBe(2);
    expect(groups.infoOf.get(c)!.index).toBe(3);
  });

  it("gates the whole bucket atomically on the header's own type", () => {
    // Header (soonest future) is "series"; a sibling declares "multipart" —
    // the whole bucket must follow the header's type, not fragment.
    const header = event("Header", iso(1), { id: "s1", type: "series" });
    const sibling = event("Sibling", iso(2), { id: "s1", type: "multipart" });

    const seriesOnly = computeEventGroups([header, sibling], new Set(["series"]));
    expect(seriesOnly.infoOf.size).toBe(2);
    expect(seriesOnly.infoOf.get(header)!.type).toBe("series");
    expect(seriesOnly.infoOf.get(sibling)!.type).toBe("series");

    const multipartOnly = computeEventGroups([header, sibling], new Set(["multipart"]));
    expect(multipartOnly.infoOf.size).toBe(0);
  });

  it("keeps distinct partOf.id groups separate", () => {
    const a1 = event("A1", iso(1), { id: "a" });
    const a2 = event("A2", iso(2), { id: "a" });
    const b1 = event("B1", iso(1), { id: "b" });
    const b2 = event("B2", iso(2), { id: "b" });
    const groups = computeEventGroups([a1, a2, b1, b2], new Set(["series"]));
    expect(groups.infoOf.get(a1)!.key).toBe("a");
    expect(groups.infoOf.get(b1)!.key).toBe("b");
    expect(groups.infoOf.get(a1)!.total).toBe(2);
    expect(groups.infoOf.get(b1)!.total).toBe(2);
  });
});
