import { icsToEvents } from "@opentechevents/import-ics";
import { htmlToEvents } from "@opentechevents/import-jsonld";
import { describe, expect, it } from "vitest";

import {
  compareByStartDateDesc,
  decodeImportQueue,
  encodeImportQueue,
  feedHasEventId,
  formHasContent,
  importedEventLabel,
  importedToFormState,
  importQueueKey,
  isFutureEvent,
  missingFormFields,
  newQueueItem,
  sourceNameFor,
  type ImportQueue,
} from "../src/lib/import.js";
import { emptyFormState } from "../src/lib/event-json.js";

const TODAY = "2026-07-16T12:00:00Z";

describe("isFutureEvent", () => {
  it("compares the event's last day against today (inclusive)", () => {
    expect(isFutureEvent({ startDate: "2026-07-16" }, TODAY)).toBe(true);
    expect(isFutureEvent({ startDate: "2026-07-15" }, TODAY)).toBe(false);
    expect(isFutureEvent({ startDate: "2026-08-01T19:00:00" }, TODAY)).toBe(
      true,
    );
  });

  it("an ongoing multi-day event counts as future via endDate", () => {
    expect(
      isFutureEvent({ startDate: "2026-07-14", endDate: "2026-07-17" }, TODAY),
    ).toBe(true);
  });

  it("undated events are never preselected", () => {
    expect(isFutureEvent({ name: "no date" }, TODAY)).toBe(false);
  });
});

describe("importedEventLabel", () => {
  it("formats date — name, with placeholders for gaps", () => {
    expect(
      importedEventLabel({ name: "Rust Madrid", startDate: "2026-07-26T18:30:00" }),
    ).toBe("2026-07-26 — Rust Madrid");
    expect(importedEventLabel({})).toBe("(no date) — (unnamed event)");
  });
});

describe("missingFormFields", () => {
  it("marks every data field the ICS did not carry, never slug/allDay", () => {
    const missing = missingFormFields({
      name: "X",
      startDate: "2026-09-10T19:00:00",
      timezone: "Europe/Madrid",
    });
    expect(missing.has("name")).toBe(false);
    expect(missing.has("startDate")).toBe(false);
    expect(missing.has("timezone")).toBe(false);
    for (const id of ["description", "url", "tags", "endDate", "venue", "geo"]) {
      expect(missing.has(id)).toBe(true);
    }
    expect(missing.has("slug")).toBe(false);
    expect(missing.has("allDay")).toBe(false);
  });

  it("always marks the fields ICS cannot model", () => {
    const missing = missingFormFields({ name: "X", startDate: "2026-09-10" });
    for (const id of ["id", "attendanceMode", "languages", "license", "source"]) {
      expect(missing.has(id)).toBe(true);
    }
  });

  it("JSON-LD events can cover attendanceMode and languages", () => {
    const missing = missingFormFields({
      name: "X",
      startDate: "2026-09-10T18:00:00",
      attendanceMode: "in-person",
      languages: ["es-ES"],
    });
    expect(missing.has("attendanceMode")).toBe(false);
    expect(missing.has("languages")).toBe(false);
    expect(missing.has("id")).toBe(true); // never importable
  });
});

describe("importedToFormState (event page JSON-LD → M6a prefill)", () => {
  const html = `<script type="application/ld+json">{
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "BiznagaFest",
    "url": "https://www.eventbrite.es/e/biznagafest-1052728016837",
    "startDate": "2026-10-25T08:30:00+02:00",
    "endDate": "2026-10-25T19:00:00+02:00",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "inLanguage": "es-ES",
    "location": {"@type": "Place", "name": "ETSII UMA",
      "address": {"@type": "PostalAddress", "streetAddress": "Bulevar Louis Pasteur 35"}}
  }</script>`;

  it("prefills the form, leaving the offset's timezone pending", () => {
    const { events, warnings } = htmlToEvents(html);
    const state = importedToFormState(events[0]);
    expect(state.name).toBe("BiznagaFest");
    expect(state.startDate).toBe("2026-10-25");
    expect(state.startTime).toBe("08:30");
    expect(state.endTime).toBe("19:00");
    expect(state.timezone).toBe(""); // +02:00 is an offset, not a zone
    expect(state.attendanceMode).toBe("in-person");
    expect(state.languages).toBe("es-ES");
    expect(state.status).toBe("scheduled");
    expect(state.venue).toBe("ETSII UMA, Bulevar Louis Pasteur 35");
    expect(warnings.some((w) => w.field === "timezone")).toBe(true);
    expect(missingFormFields(events[0]).has("timezone")).toBe(true);
  });
});

describe("importedToFormState (import → M6a prefill)", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Meetup//Meetup Events v1.0//EN",
    "BEGIN:VEVENT",
    "UID:event_1@meetup.com",
    "DTSTAMP:20260701T000000Z",
    "DTSTART;TZID=Europe/Madrid:20260726T183000",
    "DTEND;TZID=Europe/Madrid:20260726T203000",
    "SUMMARY:Rust Madrid July",
    "LOCATION:Campus Madrid\\, Madrid",
    "URL:https://www.meetup.com/rust-madrid/events/1/",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  it("prefills the form fields the ICS carried", () => {
    const [event] = icsToEvents(ics).events;
    const state = importedToFormState(event);
    expect(state.name).toBe("Rust Madrid July");
    expect(state.startDate).toBe("2026-07-26");
    expect(state.startTime).toBe("18:30");
    expect(state.endDate).toBe("2026-07-26");
    expect(state.endTime).toBe("20:30");
    expect(state.timezone).toBe("Europe/Madrid");
    expect(state.venue).toBe("Campus Madrid, Madrid");
    expect(state.url).toBe("https://www.meetup.com/rust-madrid/events/1/");
    expect(state.allDay).toBe(false);
  });

  it("never invents: id and slug stay empty (editor suggestions fill them)", () => {
    const [event] = icsToEvents(ics).events;
    const state = importedToFormState(event);
    expect(state.id).toBe("");
    expect(state.slug).toBe("");
  });

  it("a floating time leaves timezone empty instead of defaulting", () => {
    const floating = ics.replace(";TZID=Europe/Madrid", "");
    const [event] = icsToEvents(floating).events;
    expect(importedToFormState(event).timezone).toBe("");
  });

  it("all-day import sets the allDay flag", () => {
    const state = importedToFormState({ startDate: "2026-11-05" });
    expect(state.allDay).toBe(true);
    expect(state.startDate).toBe("2026-11-05");
    expect(state.startTime).toBe("");
  });
});

describe("compareByStartDateDesc", () => {
  it("sorts newest first, undated last", () => {
    const events = [
      { name: "old", startDate: "2026-01-10T19:00:00" },
      { name: "undated" },
      { name: "new", startDate: "2026-12-01" },
      { name: "mid", startDate: "2026-07-26T18:30:00" },
    ];
    expect(events.sort(compareByStartDateDesc).map((e) => e.name)).toEqual([
      "new",
      "mid",
      "old",
      "undated",
    ]);
  });
});

describe("import queue persistence", () => {
  const queue: ImportQueue = {
    pos: 1,
    sourceUrl: "https://example.com/cal.ics",
    retrievedAt: "2026-07-16T12:00:00Z",
    items: [
      newQueueItem({ name: "A", startDate: "2026-12-01" }, []),
      {
        ...newQueueItem({ name: "B", startDate: "2026-08-30T11:00:00" }, [
          { eventIndex: 1, field: "timezone", message: "floating" },
        ]),
        state: importedToFormState({ name: "B edited" }),
        missing: ["tags", "id"],
        slugDirty: true,
        submitted: true,
        submittedId: "https://x.example/events/b",
      },
    ],
  };

  it("round-trips through encode/decode", () => {
    expect(decodeImportQueue(encodeImportQueue(queue))).toEqual(queue);
  });

  it("rejects anything that is not a stored queue", () => {
    expect(decodeImportQueue(null)).toBeNull();
    expect(decodeImportQueue("not json {")).toBeNull();
    expect(decodeImportQueue('"a string"')).toBeNull();
    expect(decodeImportQueue('{"pos":0}')).toBeNull();
    expect(decodeImportQueue('{"pos":0,"items":[]}')).toBeNull();
    expect(decodeImportQueue('{"pos":0,"items":[{"event":null}]}')).toBeNull();
  });

  it("keys the storage per target repository", () => {
    expect(importQueueKey("octocat/a")).not.toBe(importQueueKey("octocat/b"));
  });
});

describe("formHasContent", () => {
  it("a fresh form is empty, even with the auto-derived fields set", () => {
    const state = emptyFormState("Europe/Madrid");
    state.slug = "2026-07-suggested";
    state.id = "https://x.example/events/2026-07-suggested";
    expect(formHasContent(state)).toBe(false);
  });

  it("any user-facing field counts as content", () => {
    const state = emptyFormState("Europe/Madrid");
    state.name = "Typed by hand";
    expect(formHasContent(state)).toBe(true);
  });
});

describe("sourceNameFor", () => {
  it("maps known platforms from the URL's hostname", () => {
    expect(sourceNameFor("https://www.meetup.com/gdg-madrid/events/1/")).toBe("Meetup");
    expect(sourceNameFor("https://luma.com/8l8ofrry")).toBe("Luma");
    expect(sourceNameFor("https://lu.ma/8l8ofrry")).toBe("Luma");
    expect(sourceNameFor("https://www.eventbrite.es/e/entradas-1052728016837")).toBe("Eventbrite");
    expect(sourceNameFor("https://guild.host/pydata-madrid/calendar")).toBe("guild.host");
    expect(sourceNameFor("https://calendar.google.com/calendar/ical/x/basic.ics")).toBe("Google Calendar");
  });

  it("unknown platforms fall back to the bare hostname; no URL → null", () => {
    expect(sourceNameFor("https://www.devfest-levante.example/2026")).toBe(
      "devfest-levante.example",
    );
    expect(sourceNameFor(null)).toBeNull();
    expect(sourceNameFor("not a url")).toBeNull();
  });

  it("never mistakes a lookalike domain for a platform", () => {
    expect(sourceNameFor("https://notmeetup.com/x")).toBe("notmeetup.com");
    expect(sourceNameFor("https://meetup.com.evil.example/x")).toBe(
      "meetup.com.evil.example",
    );
  });
});

describe("feedHasEventId", () => {
  const feed = {
    events: [{ id: "https://x.example/events/a" }, { id: "https://x.example/events/b" }],
  };

  it("finds a published event by id", () => {
    expect(feedHasEventId(feed, "https://x.example/events/b")).toBe(true);
    expect(feedHasEventId(feed, "https://x.example/events/c")).toBe(false);
  });

  it("tolerates broken feeds", () => {
    expect(feedHasEventId(null, "x")).toBe(false);
    expect(feedHasEventId({}, "x")).toBe(false);
    expect(feedHasEventId({ events: "nope" }, "x")).toBe(false);
    expect(feedHasEventId({ events: [null, 42] }, "x")).toBe(false);
  });
});
