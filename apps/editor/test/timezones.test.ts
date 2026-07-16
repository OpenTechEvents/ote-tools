import { describe, expect, it } from "vitest";

import { filterZones } from "../src/lib/timezones.js";

const ZONES = [
  "UTC",
  "America/New_York",
  "Atlantic/Madeira",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Paris",
] as const;

describe("filterZones", () => {
  it("empty query returns the full list (dropdown mode)", () => {
    expect(filterZones(ZONES, "")).toEqual([...ZONES]);
    expect(filterZones(ZONES, "   ")).toEqual([...ZONES]);
  });

  it("ranks prefix matches (on any segment) before substring matches", () => {
    expect(filterZones(ZONES, "mad")).toEqual([
      "Atlantic/Madeira",
      "Europe/Madrid",
    ]);
    expect(filterZones(ZONES, "eu")).toEqual([
      "Europe/London",
      "Europe/Madrid",
      "Europe/Paris",
    ]);
    // "rid" is only inside Madrid, never a segment prefix.
    expect(filterZones(ZONES, "rid")).toEqual(["Europe/Madrid"]);
  });

  it("is case-insensitive and treats spaces as underscores", () => {
    expect(filterZones(ZONES, "new york")).toEqual(["America/New_York"]);
    expect(filterZones(ZONES, "UTC")).toEqual(["UTC"]);
  });

  it("no match yields an empty list", () => {
    expect(filterZones(ZONES, "zzz")).toEqual([]);
  });
});
