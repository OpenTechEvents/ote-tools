import { describe, expect, it } from "vitest";

import type { PreviewEvent } from "@opentechevents/preview-feed";

import {
  CALENDAR_LIST_BREAKPOINT,
  calendarLocaleOptions,
  calendarViewForWidth,
  dayRowHeight,
  weekRowTracks,
  nextEventDate,
  resolveCalendarDate,
  toISODate,
} from "../src/calendar-layout.js";

describe("calendarLocaleOptions", () => {
  it("localizes the calendar for Spanish", () => {
    const options = calendarLocaleOptions("es");
    expect(options).toMatchObject({
      locale: "es-ES",
      firstDay: 1,
      buttonText: { prev: "Mes anterior", next: "Mes siguiente", today: "Hoy", close: "Cerrar" },
      dayHeaderFormat: { weekday: "short" },
    });
    expect((options.titleFormat as (date: Date) => string)(new Date("2026-08-01T00:00:00Z"))).toBe(
      "Agosto de 2026",
    );
  });

  it("keeps the English calendar defaults explicit", () => {
    expect(calendarLocaleOptions("en")).toMatchObject({
      locale: "en-US",
      firstDay: 0,
      buttonText: { prev: "Previous month", next: "Next month", today: "Today", close: "Close" },
    });
  });

  it("localizes the two strings the library hardcodes in English", () => {
    const es = calendarLocaleOptions("es");
    expect((es.moreLinkContent as (info: { num: number }) => string)({ num: 12 })).toBe("+12 más");
    expect((es.noEventsContent as () => string)()).toBe("No hay eventos este mes");
    const en = calendarLocaleOptions("en");
    expect((en.moreLinkContent as (info: { num: number }) => string)({ num: 12 })).toBe("+12 more");
  });
});

const event = (id: string, startDate: string, endDate?: string): PreviewEvent => ({
  id: `https://example.org/events/${id}`,
  name: id,
  startDate,
  ...(endDate ? { endDate } : {}),
});

describe("calendarViewForWidth", () => {
  it("degrades the month grid to a list in a narrow container", () => {
    expect(calendarViewForWidth(390, true)).toBe("listMonth");
    expect(calendarViewForWidth(CALENDAR_LIST_BREAKPOINT - 1, true)).toBe("listMonth");
    expect(calendarViewForWidth(CALENDAR_LIST_BREAKPOINT, true)).toBe("dayGridMonth");
    expect(calendarViewForWidth(1024, true)).toBe("dayGridMonth");
  });

  it("keeps the grid when responsive is off, and when the width is unknown", () => {
    // 0 is "not measured yet" — an unattached container, or jsdom. Guessing
    // "narrow" there would hand an existing embed a list it never asked for.
    expect(calendarViewForWidth(390, false)).toBe("dayGridMonth");
    expect(calendarViewForWidth(0, true)).toBe("dayGridMonth");
  });
});

describe("dayRowHeight", () => {
  it("scales with the cap and stays in em, so it follows the host's font size", () => {
    expect(dayRowHeight(3)).toBe("calc(2.4em + 3 * 1.6em + 1.8em)");
    expect(dayRowHeight(1)).toBe("calc(2.4em + 1 * 1.6em + 1.8em)");
  });
});

describe("toISODate", () => {
  it("reads the local date, not the UTC one", () => {
    // A UTC-based spelling would answer "2026-03-01" for a date that is
    // still February where the visitor is, and open the wrong month.
    expect(toISODate(new Date(2026, 2, 1, 0, 30))).toBe("2026-03-01");
    expect(toISODate(new Date(2026, 11, 31, 23, 59))).toBe("2026-12-31");
  });
});

describe("nextEventDate", () => {
  const events = [
    event("past", "2026-01-10"),
    event("far", "2026-09-01T19:00"),
    event("soon", "2026-03-04T19:00"),
  ];

  it("picks the earliest event that has not finished", () => {
    expect(nextEventDate(events, "2026-02-01")).toBe("2026-03-04");
    expect(nextEventDate(events, "2026-05-01")).toBe("2026-09-01");
  });

  it("counts an event that is running right now, and lands on its start", () => {
    const running = [event("camp", "2026-03-01", "2026-03-05")];
    expect(nextEventDate(running, "2026-03-03")).toBe("2026-03-01");
  });

  it("is undefined when everything is over, and ignores events with no date", () => {
    expect(nextEventDate(events, "2026-10-01")).toBeUndefined();
    expect(nextEventDate([{ name: "Date unknown" }], "2026-01-01")).toBeUndefined();
  });
});

describe("resolveCalendarDate", () => {
  const now = new Date(2026, 1, 1); // 2026-02-01, local

  it("opens on the next event's month by default", () => {
    const events = [event("a", "2026-05-20"), event("b", "2026-03-04")];
    expect(resolveCalendarDate(events, { kind: "next-event" }, now)).toBe("2026-03-04");
  });

  it("falls back to the most recent past event for an archived feed", () => {
    // The bug this exists for: a feed with nothing upcoming opened on an
    // empty current month and read as broken.
    const events = [event("a", "2025-11-20"), event("b", "2025-06-04")];
    expect(resolveCalendarDate(events, { kind: "next-event" }, now)).toBe("2025-11-20");
  });

  it("leaves the date to the library for today, and honours a fixed date", () => {
    const events = [event("a", "2026-05-20")];
    expect(resolveCalendarDate(events, { kind: "today" }, now)).toBeUndefined();
    expect(resolveCalendarDate(events, { kind: "date", date: "2027-01-01" }, now)).toBe("2027-01-01");
  });

  it("has nothing to say about a feed with no dated events", () => {
    expect(resolveCalendarDate([], { kind: "next-event" }, now)).toBeUndefined();
    expect(resolveCalendarDate([{ name: "Date unknown" }], { kind: "next-event" }, now)).toBeUndefined();
  });
});

describe("weekRowTracks", () => {
  const ev = (id: string, startDate: string, endDate?: string) => ({
    id,
    name: id,
    startDate,
    ...(endDate ? { endDate } : {}),
  });
  // A six-week November 2026 grid starting Sunday 25 Oct.
  const start = new Date(2026, 9, 25);
  const end = new Date(2026, 11, 6);
  /** The per-week tracks, without the library's `max-content` header track. */
  const weeks = (...args: Parameters<typeof weekRowTracks>) =>
    weekRowTracks(...args)
      .replace(/^max-content /, "")
      .split(/ (?![^(]*\))/);

  it("gives an empty week its date row and nothing more", () => {
    // The bug this exists for: a flat row height reserved max-per-day
    // events' worth of room in every week, the empty ones included, so a
    // sparse month was mostly blank rows. An empty track must therefore be
    // the bare head — asserting it merely *contains* the head would also
    // pass for the reserved-for-three value, which is the bug itself.
    const tracks = weeks([ev("a", "2026-11-26T09:00")], start, end, 3, false);
    const busyWeek = "calc(2.4em + 1 * 1.6em)";
    expect(tracks).toContain("2.4em");
    expect(tracks.filter((t) => t === "2.4em").length).toBe(tracks.length - 1);
    expect(tracks).toContain(busyWeek);
    for (const track of tracks) expect(track === "2.4em" || track === busyWeek).toBe(true);
  });

  it("sizes a week by its busiest day, not by its total", () => {
    // Three events across three days is a one-event week; three on one day
    // is a three-event week. A row is as tall as its tallest cell.
    const spread = weeks(
      [ev("a", "2026-11-23T09:00"), ev("b", "2026-11-24T09:00"), ev("c", "2026-11-25T09:00")],
      start,
      end,
      3,
      false,
    );
    const stacked = weeks(
      [ev("a", "2026-11-23T09:00"), ev("b", "2026-11-23T10:00"), ev("c", "2026-11-23T11:00")],
      start,
      end,
      3,
      false,
    );
    expect(spread).toContain("calc(2.4em + 1 * 1.6em)");
    expect(stacked).toContain("calc(2.4em + 3 * 1.6em)");
  });

  it("caps a busy week at max-per-day and only then reserves the +N more line", () => {
    const events = Array.from({ length: 9 }, (_, i) => ev(`e${i}`, "2026-11-26T09:00"));
    expect(weeks(events, start, end, 3, false)).toContain("calc(2.4em + 3 * 1.6em + 1.8em)");
    // A week within the cap hides nothing, so it reserves no footer.
    expect(weeks([ev("a", "2026-11-26T09:00")], start, end, 3, false)).toContain(
      "calc(2.4em + 1 * 1.6em)",
    );
  });

  it("raises every week a multi-day event covers, not just the one it starts in", () => {
    // Thu 5 Nov to Tue 10 Nov crosses a week boundary. Counting only the
    // start day leaves the second week reading as empty, which would hide a
    // congress that is still running that week.
    const tracks = weeks([ev("congress", "2026-11-05", "2026-11-10")], start, end, 3, false);
    const raised = tracks.filter((t) => t !== "2.4em");
    expect(raised.length).toBe(2);
    for (const track of raised) expect(track).toBe("calc(2.4em + 1 * 1.6em)");
  });

  it("follows the density, because the cell metrics are what it measures", () => {
    const events = [ev("a", "2026-11-26T09:00")];
    expect(weeks(events, start, end, 3, true)).toContain("calc(1.25em + 1 * 1.2em)");
    expect(weeks(events, start, end, 3, false)).toContain("calc(2.4em + 1 * 1.6em)");
  });
});
