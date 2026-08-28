import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { icsToEvents, type ImportWarning } from "../src/index.js";

function fixture(name: string): string {
  return readFileSync(
    fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url)),
    "utf8",
  );
}

/** Warnings for one event, keyed by the field they identify. */
function fieldsWarned(warnings: ImportWarning[], eventIndex: number): Set<string> {
  return new Set(
    warnings
      .filter((w) => w.eventIndex === eventIndex && w.field !== undefined)
      .map((w) => w.field as string),
  );
}

describe("icsToEvents · Google Calendar export", () => {
  const { events, warnings } = icsToEvents(fixture("google-calendar.ics"));

  it("imports both events, skipping the VTIMEZONE component", () => {
    expect(events).toHaveLength(2);
  });

  it("maps the timed event's fields, unfolding and unescaping TEXT", () => {
    const [event] = events;
    expect(event.name).toBe("Python meetup: asyncio in production");
    expect(event.startDate).toBe("2026-09-10T19:00");
    expect(event.endDate).toBe("2026-09-10T21:00");
    expect(event.timezone).toBe("Europe/Madrid");
    expect(event.description).toBe(
      "Monthly session on asyncio in production: pitfalls, patterns and a live demo.\nBring your laptop; Q&A at the end.",
    );
    expect(event.location?.venue).toBe(
      "La Oficina Cultural, Calle de las Tiendas 26, Almería",
    );
    expect(event.status).toBe("scheduled");
    expect(event.updatedAt).toBe("2026-07-02T09:00:00Z");
  });

  it("single all-day event: date-only startDate, no endDate (exclusive DTEND collapsed)", () => {
    const [, allDay] = events;
    expect(allDay.startDate).toBe("2026-11-05");
    expect(allDay.endDate).toBeUndefined();
  });

  it("all-day event: timezone inferred from the calendar's X-WR-TIMEZONE, with a warning", () => {
    const [, allDay] = events;
    expect(allDay.timezone).toBe("Europe/Madrid");
    const warned = warnings.find((w) => w.eventIndex === 1 && w.field === "timezone");
    expect(warned?.message).toContain("X-WR-TIMEZONE");
  });

  it("empty DESCRIPTION:/LOCATION: lines mean absent, not empty string", () => {
    const [, allDay] = events;
    expect(allDay.description).toBeUndefined();
    expect(allDay.location).toBeUndefined();
  });

  it("warns per event about the fields ICS cannot model", () => {
    for (const index of [0, 1]) {
      const warned = fieldsWarned(warnings, index);
      expect(warned.has("id")).toBe(true);
      expect(warned.has("attendanceMode")).toBe(true);
      expect(warned.has("languages")).toBe(true);
    }
  });
});

describe("icsToEvents · Meetup feed", () => {
  const { events, warnings } = icsToEvents(fixture("meetup.ics"));

  it("maps URL and GEO", () => {
    const [workshop] = events;
    expect(workshop.url).toBe(
      "https://www.meetup.com/rust-madrid/events/310000001/",
    );
    expect(workshop.location?.geo).toEqual({ lat: 40.42272, lon: -3.70358 });
    expect(workshop.location?.venue).toBe(
      "Campus Madrid, Calle de Moreno Nieto 2, Madrid",
    );
  });

  it("derives endDate from DURATION when DTEND is absent", () => {
    const [, social] = events;
    expect(social.startDate).toBe("2026-08-30T11:00");
    expect(social.endDate).toBe("2026-08-30T13:30");
  });

  it("no timezone warnings: both events carry an IANA TZID", () => {
    expect(warnings.some((w) => w.field === "timezone")).toBe(false);
  });

  it("ORGANIZER's CN maps to organizers[].name, email withheld by default", () => {
    const [workshop] = events;
    expect(workshop.organizers).toEqual([{ name: "Rust Madrid" }]);
    const warned = warnings.find((w) => w.eventIndex === 0 && w.field === "organizers");
    expect(warned?.message).toContain('sourceVisibility: "public"');
  });

  it('sourceVisibility: "public" also imports the organizer email', () => {
    const result = icsToEvents(fixture("meetup.ics"), { sourceVisibility: "public" });
    expect(result.events[0].organizers).toEqual([
      { name: "Rust Madrid", email: "hola@rustmadrid.example" },
    ]);
    expect(
      result.warnings.some((w) => w.eventIndex === 0 && w.field === "organizers"),
    ).toBe(false);
  });
});

describe("icsToEvents · multi-day all-day conference", () => {
  const { events, warnings } = icsToEvents(fixture("multi-day.ics"));

  it("converts exclusive DTEND to the inclusive OTE endDate (-1 day)", () => {
    const [conf] = events;
    expect(conf.startDate).toBe("2026-10-16");
    expect(conf.endDate).toBe("2026-10-17");
  });

  it("no X-WR-TIMEZONE on this calendar: all-day timezone defaults to UTC, with a warning", () => {
    const [conf] = events;
    expect(conf.timezone).toBe("UTC");
    const warned = warnings.find((w) => w.eventIndex === 0 && w.field === "timezone");
    expect(warned?.message).toContain("no X-WR-TIMEZONE");
  });

  it("accumulates repeated CATEGORIES into tags", () => {
    expect(events[0].tags).toEqual(["gdg", "devfest", "community"]);
  });
});

describe("icsToEvents · recurring event (RRULE)", () => {
  const { events, warnings } = icsToEvents(fixture("recurring.ics"));

  it("imports only the first occurrence and warns instead of expanding", () => {
    expect(events).toHaveLength(1);
    expect(events[0].startDate).toBe("2026-07-07T19:00");
    const recurring = warnings.find(
      (w) => w.eventIndex === 0 && w.message.includes("not expanded"),
    );
    expect(recurring).toBeDefined();
    expect(recurring?.field).toBeUndefined(); // whole-event, not one field
  });
});

describe("icsToEvents · edge cases", () => {
  const { events, warnings } = icsToEvents(fixture("edge-cases.ics"));

  it("floating time: wall clock kept, timezone absent + warning", () => {
    const [floating] = events;
    expect(floating.startDate).toBe("2026-09-01T18:00");
    expect(floating.timezone).toBeUndefined();
    expect(fieldsWarned(warnings, 0).has("timezone")).toBe(true);
  });

  it("STATUS:TENTATIVE maps directly to OTE's tentative status", () => {
    expect(events[0].status).toBe("tentative");
    expect(fieldsWarned(warnings, 0).has("status")).toBe(false);
  });

  it("non-IANA (Windows) TZID: wall clock kept, timezone absent + warning", () => {
    const [, outlook] = events;
    expect(outlook.startDate).toBe("2026-09-15T17:00");
    expect(outlook.timezone).toBeUndefined();
    expect(fieldsWarned(warnings, 1).has("timezone")).toBe(true);
  });

  it("Z-suffixed times map to timezone UTC; nested VALARM is ignored", () => {
    const [, , utc] = events;
    expect(utc.startDate).toBe("2026-09-20T10:00");
    expect(utc.endDate).toBe("2026-09-20T11:30");
    expect(utc.timezone).toBe("UTC");
  });

  it("ORGANIZER without a CN (display name) cannot be imported: no name to use", () => {
    const [, , utc] = events;
    expect(utc.organizers).toBeUndefined();
    expect(fieldsWarned(warnings, 2).has("organizers")).toBe(true);
  });

  it("missing SUMMARY: name absent + warning", () => {
    const [, , , nameless] = events;
    expect(nameless.name).toBeUndefined();
    expect(fieldsWarned(warnings, 3).has("name")).toBe(true);
  });

  it("all-day, no X-WR-TIMEZONE on this calendar: defaults to UTC", () => {
    const [, , , nameless] = events;
    expect(nameless.timezone).toBe("UTC");
  });
});

describe("icsToEvents · HTML description (Meetup-style)", () => {
  const { events, warnings } = icsToEvents(fixture("html-description.ics"));

  it("converts the HTML to Markdown and flags the field", () => {
    expect(events[0].description).toBe(
      [
        "**Vue Valencia** is back!",
        "",
        "Agenda:",
        "",
        "- Doors open & networking",
        "- Talk: *Signals in Vue*",
        "- Q&A",
        "",
        "RSVP at [meetup.com](https://www.meetup.com/vue-valencia/events/320000001/) — free entry.",
      ].join("\n"),
    );
    const flagged = warnings.find(
      (w) => w.eventIndex === 0 && w.field === "description",
    );
    expect(flagged?.message).toContain("converted to Markdown");
  });

  it("plain-text descriptions are untouched and unflagged", () => {
    const plain = icsToEvents(fixture("meetup.ics"));
    expect(plain.events[0].description).toContain("Hands-on embedded Rust");
    expect(plain.warnings.some((w) => w.field === "description")).toBe(false);
  });
});

describe("icsToEvents · allDayTimezonePolicy override (H003)", () => {
  it("an explicit policy wins over the calendar's own X-WR-TIMEZONE", () => {
    const { events, warnings } = icsToEvents(fixture("google-calendar.ics"), {
      allDayTimezonePolicy: "America/Bogota",
    });
    const [, allDay] = events;
    expect(allDay.timezone).toBe("America/Bogota");
    const warned = warnings.find((w) => w.eventIndex === 1 && w.field === "timezone");
    expect(warned?.message).toContain("explicit allDayTimezonePolicy");
  });
});

describe("icsToEvents · TZID validated against the real IANA enum, not a shape regex", () => {
  it("a plausible-looking but nonexistent zone is rejected, not trusted", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "UID:fake-tz-1@example.com",
      "DTSTAMP:20260701T000000Z",
      "DTSTART;TZID=Europe/Atlantida:20260901T180000",
      "SUMMARY:Bogus timezone",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const { events, warnings } = icsToEvents(ics);
    expect(events[0].timezone).toBeUndefined();
    const warned = warnings.find((w) => w.eventIndex === 0 && w.field === "timezone");
    expect(warned?.message).toContain('"Europe/Atlantida" is not an IANA timezone');
  });
});

describe("icsToEvents · IMAGE (RFC 7986)", () => {
  it("maps IMAGE to image[] when present", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "UID:with-image-1@example.com",
      "DTSTAMP:20260701T000000Z",
      "DTSTART:20260901T180000Z",
      "SUMMARY:Event with a poster",
      "IMAGE;VALUE=URI:https://example.org/poster.png",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const { events } = icsToEvents(ics);
    expect(events[0].image).toEqual(["https://example.org/poster.png"]);
  });
});

describe("icsToEvents · contract", () => {
  it("is deterministic", () => {
    const text = fixture("meetup.ics");
    expect(icsToEvents(text)).toEqual(icsToEvents(text));
  });

  it("never invents an id, attendance mode or languages", () => {
    for (const name of [
      "google-calendar.ics",
      "meetup.ics",
      "multi-day.ics",
      "recurring.ics",
      "edge-cases.ics",
    ]) {
      for (const event of icsToEvents(fixture(name)).events) {
        expect(event.id).toBeUndefined();
        expect(event).not.toHaveProperty("attendanceMode");
        expect(event).not.toHaveProperty("languages");
      }
    }
  });

  it("non-ICS input: no events, one warning, no throw", () => {
    const result = icsToEvents("this is not a calendar");
    expect(result.events).toEqual([]);
    expect(result.warnings).toHaveLength(1);
  });

  it("calendar without events: no events, one warning", () => {
    const result = icsToEvents("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR");
    expect(result.events).toEqual([]);
    expect(result.warnings[0].message).toContain("no events");
  });
});

describe("icsToEvents · non-ASCII IRI", () => {
  // The fixture is export-ics output: its URL and LOCATION lines are folded
  // in the middle of a word, and one fold lands next to a multi-byte `ñ`.
  const { events } = icsToEvents(fixture("non-ascii-iri.ics"));

  it("unfolds a multi-byte address back to exactly what was published", () => {
    expect(events).toHaveLength(1);
    expect(events[0].url).toBe(
      "https://eventos.example/comunidad-española/2026/pycamp-españa-edición-de-otoño",
    );
  });

  it("keeps the characters as characters — no percent-encoding on the way in", () => {
    expect(JSON.stringify(events[0])).not.toContain("%C3%B1");
    expect(events[0].name).toBe("PyCamp España — edición de otoño");
  });
});
