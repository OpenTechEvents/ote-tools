import { describe, expect, it } from "vitest";

import { expandRecurrenceDates, MAX_OCCURRENCES, type RecurrenceRule } from "../src/lib/recurrence.js";

function weekdayOf(iso: string): number {
  return new Date(`${iso}T00:00:00Z`).getUTCDay();
}

function dayOfMonth(iso: string): number {
  return Number(iso.slice(8, 10));
}

function addDays(iso: string, days: number): string {
  const ms = new Date(`${iso}T00:00:00Z`).getTime() + days * 86_400_000;
  return new Date(ms).toISOString().slice(0, 10);
}

describe("expandRecurrenceDates — weekly", () => {
  const base: RecurrenceRule = {
    frequency: "weekly",
    interval: 1,
    weekday: 2, // Tuesday
    from: "2026-01-01",
    until: { type: "count", count: 5 },
  };

  it("returns `count` dates, all matching the requested weekday, 7 days apart", () => {
    const dates = expandRecurrenceDates(base);
    expect(dates).toHaveLength(5);
    for (const d of dates) expect(weekdayOf(d)).toBe(2);
    for (let i = 1; i < dates.length; i++) {
      expect(addDays(dates[i - 1], 7)).toBe(dates[i]);
    }
  });

  it("the first date is on/after `from`, never before", () => {
    const dates = expandRecurrenceDates(base);
    expect(dates[0] >= base.from).toBe(true);
    // The occurrence one week earlier, if any, must fall before `from`.
    expect(addDays(dates[0], -7) < base.from).toBe(true);
  });

  it("respects a multi-week interval", () => {
    const dates = expandRecurrenceDates({ ...base, interval: 2, until: { type: "count", count: 4 } });
    for (let i = 1; i < dates.length; i++) {
      expect(addDays(dates[i - 1], 14)).toBe(dates[i]);
    }
  });

  it("stops at an until-date instead of a count", () => {
    const dates = expandRecurrenceDates({
      ...base,
      until: { type: "date", date: "2026-01-20" },
    });
    expect(dates.length).toBeGreaterThan(0);
    for (const d of dates) expect(d <= "2026-01-20").toBe(true);
    expect(addDays(dates[dates.length - 1], 7) > "2026-01-20").toBe(true);
  });

  it("an until-date before `from` yields no dates", () => {
    expect(
      expandRecurrenceDates({ ...base, from: "2026-06-01", until: { type: "date", date: "2026-01-01" } }),
    ).toEqual([]);
  });

  it("caps at MAX_OCCURRENCES regardless of a larger requested count", () => {
    const dates = expandRecurrenceDates({ ...base, until: { type: "count", count: 1000 } });
    expect(dates).toHaveLength(MAX_OCCURRENCES);
  });

  it("caps at MAX_OCCURRENCES against a far-future until-date too", () => {
    const dates = expandRecurrenceDates({ ...base, until: { type: "date", date: "2080-01-01" } });
    expect(dates).toHaveLength(MAX_OCCURRENCES);
  });
});

describe("expandRecurrenceDates — monthly", () => {
  const lastTuesday: RecurrenceRule = {
    frequency: "monthly",
    interval: 1,
    weekday: 2,
    ordinal: -1,
    from: "2026-01-01",
    until: { type: "count", count: 14 }, // spans February
  };

  it("returns the last matching weekday of each month, one per month", () => {
    const dates = expandRecurrenceDates(lastTuesday);
    expect(dates).toHaveLength(14);
    for (const d of dates) {
      expect(weekdayOf(d)).toBe(2);
      // "last" means the same weekday 7 days later falls in the next month.
      expect(addDays(d, 7).slice(0, 7)).not.toBe(d.slice(0, 7));
    }
  });

  it("covers a February without skipping or duplicating a month", () => {
    const dates = expandRecurrenceDates(lastTuesday);
    const months = dates.map((d) => d.slice(0, 7));
    expect(new Set(months).size).toBe(months.length); // no duplicate month
    expect(months).toContain("2026-02");
  });

  it("ordinal 1 gives the first matching weekday of the month", () => {
    const dates = expandRecurrenceDates({ ...lastTuesday, ordinal: 1, until: { type: "count", count: 6 } });
    for (const d of dates) {
      expect(weekdayOf(d)).toBe(2);
      expect(dayOfMonth(d)).toBeLessThanOrEqual(7);
      // "first" means the same weekday 7 days earlier falls in the previous month.
      expect(addDays(d, -7).slice(0, 7)).not.toBe(d.slice(0, 7));
    }
  });

  it("ordinals 2-4 land in their expected day-of-month band", () => {
    for (const ordinal of [2, 3, 4] as const) {
      const dates = expandRecurrenceDates({ ...lastTuesday, ordinal, until: { type: "count", count: 3 } });
      for (const d of dates) {
        expect(weekdayOf(d)).toBe(2);
        expect(dayOfMonth(d)).toBeGreaterThanOrEqual((ordinal - 1) * 7 + 1);
        expect(dayOfMonth(d)).toBeLessThanOrEqual(ordinal * 7);
      }
    }
  });

  it("respects a multi-month interval", () => {
    const dates = expandRecurrenceDates({ ...lastTuesday, interval: 3, until: { type: "count", count: 4 } });
    const months = dates.map((d) => Number(d.slice(5, 7)) + Number(d.slice(0, 4)) * 12);
    for (let i = 1; i < months.length; i++) {
      expect(months[i] - months[i - 1]).toBe(3);
    }
  });

  it("skips straight to the next month when `from` lands after this month's occurrence", () => {
    // The last Tuesday of January 2026 is the 27th; starting from the 28th
    // must not return January's (already past) occurrence.
    const dates = expandRecurrenceDates({ ...lastTuesday, from: "2026-01-28", until: { type: "count", count: 1 } });
    expect(dates).toHaveLength(1);
    expect(dates[0].slice(0, 7)).toBe("2026-02");
  });
});

describe("expandRecurrenceDates — malformed input degrades to []", () => {
  const base: RecurrenceRule = {
    frequency: "weekly",
    interval: 1,
    weekday: 2,
    from: "2026-01-01",
    until: { type: "count", count: 5 },
  };

  it("an unparseable `from` date", () => {
    expect(expandRecurrenceDates({ ...base, from: "not-a-date" })).toEqual([]);
  });

  it("interval below 1", () => {
    expect(expandRecurrenceDates({ ...base, interval: 0 })).toEqual([]);
    expect(expandRecurrenceDates({ ...base, interval: -1 })).toEqual([]);
  });

  it("a non-positive count", () => {
    expect(expandRecurrenceDates({ ...base, until: { type: "count", count: 0 } })).toEqual([]);
    expect(expandRecurrenceDates({ ...base, until: { type: "count", count: -3 } })).toEqual([]);
  });

  it("an unparseable until-date", () => {
    expect(expandRecurrenceDates({ ...base, until: { type: "date", date: "soon" } })).toEqual([]);
  });
});
