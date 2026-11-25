import { describe, expect, it } from "vitest";
import { feedToIcs } from "../src/index.js";
import { wallClockToUtc } from "../src/wall-clock.js";

describe("UTC conversion of local event times", () => {
  it.each([
    ["2026-06-26T19:00", "Europe/Madrid", "20260626T170000Z"],
    ["2026-01-15T19:00", "Europe/Madrid", "20260115T180000Z"],
    ["2026-06-26T19:00:31", "Europe/Madrid", "20260626T170031Z"],
    ["2026-03-29T02:30", "Europe/Madrid", "20260329T013000Z"],
    ["2026-10-25T02:30", "Europe/Madrid", "20261025T003000Z"],
    ["2026-06-11T18:30", "Asia/Kathmandu", "20260611T124500Z"],
    ["2026-07-01T12:00", "Africa/Casablanca", "20260701T110000Z"],
    ["2026-04-05T01:45", "Australia/Lord_Howe", "20260404T144500Z"],
    ["2011-12-30T12:00", "Pacific/Apia", "20111230T220000Z"],
  ])("converts %s in %s to %s", (time, zone, expected) => {
    expect(wallClockToUtc(time, zone)).toBe(expected);
  });
  it("refuses an interval that becomes inverted in a spring-forward gap", () => {
    expect(() => feedToIcs({
      specVersion: "0.6.0", title: "Test", updatedAt: "2026-01-01T00:00:00Z", events: [{
        id: "https://example.org/event", name: "Gap", timezone: "Europe/Madrid",
        startDate: "2026-03-29T02:30", endDate: "2026-03-29T03:15",
      }],
    }, { utcTimes: true })).toThrow("end is not after its start");
  });
  it("refuses an unknown timezone rather than guessing", () => {
    expect(() => wallClockToUtc("2026-01-01T10:00", "Unknown/Zone")).toThrow();
  });
});
