import { describe, expect, it } from "vitest";

import {
  expandRecurrenceDates,
  MAX_OCCURRENCES,
  ordinalInMonth,
  type RecurrenceRule,
} from "../src/lib/recurrence.js";

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

describe("expandRecurrenceDates — daily", () => {
  const base: RecurrenceRule = {
    frequency: "daily",
    interval: 1,
    from: "2026-01-01",
    until: { type: "count", count: 5 },
  };

  it("returns `count` consecutive dates", () => {
    const dates = expandRecurrenceDates(base);
    expect(dates).toEqual(["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-04", "2026-01-05"]);
  });

  it("respects an interval of N days", () => {
    const dates = expandRecurrenceDates({ ...base, interval: 3, until: { type: "count", count: 3 } });
    expect(dates).toEqual(["2026-01-01", "2026-01-04", "2026-01-07"]);
  });

  it("stops at an until-date", () => {
    const dates = expandRecurrenceDates({
      ...base,
      until: { type: "date", date: "2026-01-03" },
    });
    expect(dates).toEqual(["2026-01-01", "2026-01-02", "2026-01-03"]);
  });

  it("'never' behaves like a count of MAX_OCCURRENCES", () => {
    expect(expandRecurrenceDates({ ...base, until: { type: "never" } })).toHaveLength(
      MAX_OCCURRENCES,
    );
  });
});

describe("expandRecurrenceDates — weekly", () => {
  const base: RecurrenceRule = {
    frequency: "weekly",
    interval: 1,
    weekdays: [2], // Tuesday
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
    expect(addDays(dates[0], -7) < base.from).toBe(true);
  });

  it("respects a multi-week interval by whole weeks, not raw day count", () => {
    const dates = expandRecurrenceDates({ ...base, interval: 2, until: { type: "count", count: 4 } });
    for (let i = 1; i < dates.length; i++) {
      expect(addDays(dates[i - 1], 14)).toBe(dates[i]);
    }
  });

  it("multiple weekdays in one rule, interleaved chronologically", () => {
    const dates = expandRecurrenceDates({
      ...base,
      weekdays: [1, 5], // Monday and Friday
      from: "2026-01-05", // a Monday, so both fall on/after `from` in week 0
      until: { type: "count", count: 4 },
    });
    expect(dates.map(weekdayOf)).toEqual([1, 5, 1, 5]);
    for (let i = 1; i < dates.length; i++) expect(dates[i] > dates[i - 1]).toBe(true);
  });

  it('"every weekday" is just weekdays 1-5 with no special-casing', () => {
    const dates = expandRecurrenceDates({
      ...base,
      weekdays: [1, 2, 3, 4, 5],
      from: "2026-01-05", // a Monday
      until: { type: "count", count: 5 },
    });
    expect(dates).toEqual(["2026-01-05", "2026-01-06", "2026-01-07", "2026-01-08", "2026-01-09"]);
  });

  it("an every-2-weeks multi-weekday rule keeps both weekdays in the same included week", () => {
    const dates = expandRecurrenceDates({
      ...base,
      weekdays: [1, 5],
      interval: 2,
      from: "2026-01-05", // Monday of week 0
      until: { type: "count", count: 4 },
    });
    // Week 0: Mon 01-05, Fri 01-09. Week 1 skipped. Week 2: Mon 01-19, Fri 01-23.
    expect(dates).toEqual(["2026-01-05", "2026-01-09", "2026-01-19", "2026-01-23"]);
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

  it("no weekdays selected yields no dates", () => {
    expect(expandRecurrenceDates({ ...base, weekdays: [] })).toEqual([]);
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
      expect(addDays(d, 7).slice(0, 7)).not.toBe(d.slice(0, 7));
    }
  });

  it("covers a February without skipping or duplicating a month", () => {
    const dates = expandRecurrenceDates(lastTuesday);
    const months = dates.map((d) => d.slice(0, 7));
    expect(new Set(months).size).toBe(months.length);
    expect(months).toContain("2026-02");
  });

  it("ordinal 1 gives the first matching weekday of the month", () => {
    const dates = expandRecurrenceDates({ ...lastTuesday, ordinal: 1, until: { type: "count", count: 6 } });
    for (const d of dates) {
      expect(weekdayOf(d)).toBe(2);
      expect(dayOfMonth(d)).toBeLessThanOrEqual(7);
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
    const dates = expandRecurrenceDates({ ...lastTuesday, from: "2026-01-28", until: { type: "count", count: 1 } });
    expect(dates).toHaveLength(1);
    expect(dates[0].slice(0, 7)).toBe("2026-02");
  });
});

describe("expandRecurrenceDates — yearly", () => {
  const base: RecurrenceRule = {
    frequency: "yearly",
    interval: 1,
    from: "2026-08-07",
    until: { type: "count", count: 3 },
  };

  it("repeats the same month/day each year", () => {
    expect(expandRecurrenceDates(base)).toEqual(["2026-08-07", "2027-08-07", "2028-08-07"]);
  });

  it("respects a multi-year interval", () => {
    expect(expandRecurrenceDates({ ...base, interval: 2 })).toEqual([
      "2026-08-07",
      "2028-08-07",
      "2030-08-07",
    ]);
  });

  it("a Feb 29 anchor skips non-leap years instead of drifting to Mar 1", () => {
    const dates = expandRecurrenceDates({
      ...base,
      from: "2024-02-29", // leap year
      until: { type: "count", count: 2 },
    });
    expect(dates).toEqual(["2024-02-29", "2028-02-29"]);
  });
});

describe("expandRecurrenceDates — malformed input degrades to []", () => {
  const base: RecurrenceRule = {
    frequency: "weekly",
    interval: 1,
    weekdays: [2],
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

describe("ordinalInMonth", () => {
  it("reports the ordinal for a regular mid-month occurrence", () => {
    // 2026-08-07 is a Friday, the first Friday of August 2026.
    expect(ordinalInMonth("2026-08-07")).toEqual({ ordinal: 1, isLast: false });
  });

  it("detects the last occurrence of the month", () => {
    // 2026-08-25 is the last Tuesday of August 2026 (the next is Sep 1).
    expect(ordinalInMonth("2026-08-25")).toEqual({ ordinal: 4, isLast: true });
  });

  it("a 4th occurrence that is not also the last", () => {
    // 2026-01-22 is the 4th Thursday of January 2026, but Jan 29 is a 5th.
    expect(ordinalInMonth("2026-01-22")).toEqual({ ordinal: 4, isLast: false });
  });

  it("handles a last-Tuesday-of-February correctly (short month)", () => {
    // 2026-02-24 is the last Tuesday of February 2026 (28 days).
    expect(ordinalInMonth("2026-02-24")).toEqual({ ordinal: 4, isLast: true });
  });

  it("returns null for an unparseable date", () => {
    expect(ordinalInMonth("not-a-date")).toBeNull();
  });
});
