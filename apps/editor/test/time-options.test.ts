import { describe, expect, it } from "vitest";

import { filterTimeOptions, QUARTER_HOUR_TIMES } from "../src/lib/time-options.js";

describe("QUARTER_HOUR_TIMES", () => {
  it("is every quarter-hour across 24 hours, in order", () => {
    expect(QUARTER_HOUR_TIMES.length).toBe(96);
    expect(QUARTER_HOUR_TIMES[0]).toBe("00:00");
    expect(QUARTER_HOUR_TIMES.at(-1)).toBe("23:45");
    expect(QUARTER_HOUR_TIMES.slice(0, 4)).toEqual(["00:00", "00:15", "00:30", "00:45"]);
  });
});

describe("filterTimeOptions", () => {
  it("empty query returns the full list (dropdown mode)", () => {
    expect(filterTimeOptions("")).toEqual([...QUARTER_HOUR_TIMES]);
    expect(filterTimeOptions("   ")).toEqual([...QUARTER_HOUR_TIMES]);
  });

  it("a two-digit hour matches only that hour's four slots", () => {
    expect(filterTimeOptions("14")).toEqual(["14:00", "14:15", "14:30", "14:45"]);
  });

  it("hour:minute-prefix narrows further", () => {
    expect(filterTimeOptions("14:3")).toEqual(["14:30"]);
    expect(filterTimeOptions("14:")).toEqual(["14:00", "14:15", "14:30", "14:45"]);
  });

  it("a single digit leads with the teens, not the zero-padded single hour", () => {
    expect(filterTimeOptions("1")).toEqual(
      QUARTER_HOUR_TIMES.filter((t) => t.startsWith("1")),
    );
    expect(filterTimeOptions("1")[0]).toBe("10:00");
  });

  it("falls back to the hour without its leading zero when the literal prefix has no hits", () => {
    expect(filterTimeOptions("9")).toEqual(["09:00", "09:15", "09:30", "09:45"]);
  });

  it("no match yields an empty list", () => {
    expect(filterTimeOptions("99")).toEqual([]);
  });
});
