import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { htmlToEvents, type ImportWarning } from "../src/index.js";

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

describe("htmlToEvents · Meetup event page", () => {
  const { events, warnings } = htmlToEvents(fixture("meetup.html"));

  it("finds exactly the Event, ignoring the BreadcrumbList block", () => {
    expect(events).toHaveLength(1);
  });

  it("maps the schema.org fields", () => {
    const [event] = events;
    expect(event.name).toBe("Kotlin & Compose multiplatform en producción");
    expect(event.url).toBe("https://www.meetup.com/gdg-madrid/events/306543210/");
    expect(event.attendanceMode).toBe("in-person");
    expect(event.status).toBe("scheduled");
    expect(event.location?.venue).toBe("Campus Madrid, Calle de Moreno Nieto 2");
    expect(event.location?.geo).toEqual({ lat: 40.42272, lon: -3.70358 });
  });

  it("keeps the offset's local time and leaves timezone pending + warning", () => {
    const [event] = events;
    expect(event.startDate).toBe("2026-05-06T18:30");
    expect(event.endDate).toBe("2026-05-06T20:30");
    expect(event.timezone).toBeUndefined();
    const tz = warnings.find((w) => w.eventIndex === 0 && w.field === "timezone");
    expect(tz?.message).toContain("offset");
  });

  it("imports the truncated description and flags it as partial", () => {
    const [event] = events;
    expect(event.description).toMatch(/Puertas\.\.\.$/);
    const truncated = warnings.find(
      (w) => w.eventIndex === 0 && w.field === "description",
    );
    expect(truncated?.message).toContain("truncated");
  });

  it("always warns about id", () => {
    expect(fieldsWarned(warnings, 0).has("id")).toBe(true);
  });

  it("maps organizer, image and offers instead of flagging them as unmodeled", () => {
    const [event] = events;
    expect(event.organizers).toEqual([
      { name: "GDG Madrid", url: "https://www.meetup.com/gdg-madrid/" },
    ]);
    expect(event.image).toEqual([
      "https://secure.meetupstatic.com/photos/event/1/2/3/highres_523456789.jpeg",
    ]);
    expect(event.offers).toEqual([
      {
        price: 0,
        currency: "EUR",
        availability: "in-stock",
        url: "https://www.meetup.com/gdg-madrid/events/306543210/",
      },
    ]);
    const unmodeled = warnings
      .filter((w) => w.eventIndex === 0 && w.field === undefined)
      .map((w) => w.message);
    expect(unmodeled.some((m) => m.includes('"image"'))).toBe(false);
    expect(unmodeled.some((m) => m.includes('"organizer"'))).toBe(false);
    expect(unmodeled.some((m) => m.includes('"offers"'))).toBe(false);
  });
});

describe("htmlToEvents · Eventbrite event page", () => {
  const { events, warnings } = htmlToEvents(fixture("eventbrite.html"));

  it("accepts Event subtypes (BusinessEvent)", () => {
    expect(events).toHaveLength(1);
    expect(events[0].name).toBe("BiznagaFest 2025");
  });

  it("maps attendance mode, language and the composed Place address", () => {
    const [event] = events;
    expect(event.attendanceMode).toBe("in-person");
    expect(event.languages).toEqual(["es-ES"]);
    // name + streetAddress + addressRegion; addressLocality "Málaga" is
    // skipped because the street address already contains it.
    expect(event.location?.venue).toBe(
      "E.T.S. Ingeniería Informática. Universidad de Málaga, 35 Bulevar Louis Pasteur, 29071 Málaga, AL",
    );
    expect(event.startDate).toBe("2025-10-25T08:30");
    expect(event.endDate).toBe("2025-10-25T19:00");
  });

  it("composes locality and region when the street does not repeat them", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X",
      "startDate":"2026-09-01","location":{"@type":"Place","name":"ULab",
      "address":{"@type":"PostalAddress","streetAddress":"Avenida Doctor Gadea 1",
      "addressLocality":"Alicante","addressRegion":"Comunidad Valenciana"}}}</script>`;
    const { events: composed } = htmlToEvents(html);
    expect(composed[0].location?.venue).toBe(
      "ULab, Avenida Doctor Gadea 1, Alicante, Comunidad Valenciana",
    );
  });

  it("full description (no ellipsis) is not flagged", () => {
    expect(fieldsWarned(warnings, 0).has("description")).toBe(false);
  });
});

describe("htmlToEvents · Luma-style landing (@graph + ItemList)", () => {
  const { events } = htmlToEvents(fixture("luma-landing.html"));

  it("collects nested events and skips the Organization and broken JSON", () => {
    expect(events.map((e) => e.name)).toEqual([
      "PyData Madrid July: LLM evaluation in practice",
      "PyData Madrid online: lightning talks",
    ]);
  });

  it("hybrid event: Place → venue and VirtualLocation → onlineUrl", () => {
    const [hybrid] = events;
    expect(hybrid.attendanceMode).toBe("hybrid");
    expect(hybrid.location?.venue).toBe(
      "Google for Startups Campus, Calle de Moreno Nieto 2, Madrid",
    );
    expect(hybrid.location?.onlineUrl).toBe("https://luma.com/join/zoom-8l8ofrry");
  });

  it("Z-suffixed times map to timezone UTC (a real IANA zone)", () => {
    const [, online] = events;
    expect(online.startDate).toBe("2026-08-18T18:00");
    expect(online.timezone).toBe("UTC");
    expect(online.attendanceMode).toBe("online");
    expect(online.location?.onlineUrl).toBe("https://luma.com/join/zoom-9m9pgssz");
  });
});

describe("htmlToEvents · contract", () => {
  it("page without Event JSON-LD: no events, one warning, no throw", () => {
    const result = htmlToEvents(fixture("no-jsonld.html"));
    expect(result.events).toEqual([]);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].message).toContain("no schema.org Event");
  });

  it("arbitrary non-HTML input degrades the same way", () => {
    const result = htmlToEvents("just some text, no markup");
    expect(result.events).toEqual([]);
    expect(result.warnings).toHaveLength(1);
  });

  it("is deterministic", () => {
    const html = fixture("meetup.html");
    expect(htmlToEvents(html)).toEqual(htmlToEvents(html));
  });

  it("deduplicates the same event repeated across blocks", () => {
    const block = `<script type="application/ld+json">{"@type":"Event","name":"X","url":"https://x.example/1","startDate":"2026-09-01"}</script>`;
    const { events } = htmlToEvents(`<html>${block}${block}</html>`);
    expect(events).toHaveLength(1);
  });

  it("date-only startDate is an all-day event: timezone defaults to UTC, with a warning", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01"}</script>`;
    const { events, warnings } = htmlToEvents(html);
    expect(events[0].startDate).toBe("2026-09-01");
    expect(events[0].timezone).toBe("UTC");
    const warned = warnings.find((w) => w.field === "timezone");
    expect(warned?.message).toContain("all-day event");
  });

  it("converts HTML in description to Markdown and flags it", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01","description":"<p>Hello <strong>world</strong></p>"}</script>`;
    const { events, warnings } = htmlToEvents(html);
    expect(events[0].description).toBe("Hello **world**");
    const warned = warnings.find((w) => w.field === "description");
    expect(warned?.message).toContain("converted to Markdown");
  });

  it("a plain-text description is left untouched, no warning", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01","description":"Hello world"}</script>`;
    const { events, warnings } = htmlToEvents(html);
    expect(events[0].description).toBe("Hello world");
    expect(warnings.some((w) => w.field === "description")).toBe(false);
  });

  it("an ellipsis surviving HTML conversion still flags truncation", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01","description":"<p>Puertas abiertas...</p>"}</script>`;
    const { events, warnings } = htmlToEvents(html);
    expect(events[0].description).toBe("Puertas abiertas...");
    expect(
      warnings.filter((w) => w.field === "description").map((w) => w.message),
    ).toEqual([
      expect.stringContaining("converted to Markdown"),
      expect.stringContaining("truncated"),
    ]);
  });

  it("allDayTimezonePolicy overrides the UTC default", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01"}</script>`;
    const { events } = htmlToEvents(html, { allDayTimezonePolicy: "America/Bogota" });
    expect(events[0].timezone).toBe("America/Bogota");
  });

  it("EventMovedOnline maps to OTE's moved-online status", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01","eventStatus":"https://schema.org/EventMovedOnline"}</script>`;
    const { events, warnings } = htmlToEvents(html);
    expect(events[0].status).toBe("moved-online");
    expect(warnings.some((w) => w.field === "status")).toBe(false);
  });

  it("a genuinely unknown eventStatus stays absent + warning", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01","eventStatus":"https://schema.org/EventSomethingElse"}</script>`;
    const { events, warnings } = htmlToEvents(html);
    expect(events[0].status).toBeUndefined();
    expect(
      warnings.some((w) => w.field === "status" && w.message.includes("EventSomethingElse")),
    ).toBe(true);
  });

  it("ImageObject.caption becomes image[].alt", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01",
      "image":{"@type":"ImageObject","url":"https://example.org/poster.png","caption":"Event poster"}}</script>`;
    const { events } = htmlToEvents(html);
    expect(events[0].image).toEqual([{ url: "https://example.org/poster.png", alt: "Event poster" }]);
  });

  it("an organizer with no name cannot be imported: no name to use", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01",
      "organizer":{"@type":"Organization","url":"https://example.org"}}</script>`;
    const { events, warnings } = htmlToEvents(html);
    expect(events[0].organizers).toBeUndefined();
    expect(warnings.some((w) => w.field === "organizers")).toBe(true);
  });

  it("a Person organizer is typed accordingly", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01",
      "organizer":{"@type":"Person","name":"Ada Lovelace"}}</script>`;
    const { events } = htmlToEvents(html);
    expect(events[0].organizers).toEqual([{ name: "Ada Lovelace", type: "person" }]);
  });

  it("offers[].validFrom/validThrough with an offset map to opensAt/closesAt", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01",
      "offers":{"@type":"Offer","price":"10","priceCurrency":"EUR",
      "validFrom":"2026-07-01T00:00:00+02:00","validThrough":"2026-08-31T23:59:59+02:00"}}</script>`;
    const { events } = htmlToEvents(html);
    expect(events[0].offers).toEqual([
      {
        price: 10,
        currency: "EUR",
        opensAt: "2026-07-01T00:00:00+02:00",
        closesAt: "2026-08-31T23:59:59+02:00",
      },
    ]);
  });

  it("offers[].validFrom without an offset cannot become an instant: absent + warning", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01",
      "offers":{"@type":"Offer","price":"10","priceCurrency":"EUR","validFrom":"2026-07-01T00:00:00"}}</script>`;
    const { events, warnings } = htmlToEvents(html);
    expect(events[0].offers?.[0].opensAt).toBeUndefined();
    expect(warnings.some((w) => w.field === "offers.opensAt")).toBe(true);
  });

  it("superEvent with an @id maps to partOf", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01",
      "superEvent":{"@type":"EventSeries","@id":"https://example.org/series/pydata","name":"PyData Meetup"}}</script>`;
    const { events } = htmlToEvents(html);
    expect(events[0].partOf).toEqual({
      id: "https://example.org/series/pydata",
      name: "PyData Meetup",
    });
  });

  it("superEvent with no @id or url cannot become a partOf.id: absent + warning", () => {
    const html = `<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-09-01",
      "superEvent":{"@type":"EventSeries","name":"PyData Meetup"}}</script>`;
    const { events, warnings } = htmlToEvents(html);
    expect(events[0].partOf).toBeUndefined();
    expect(warnings.some((w) => w.field === "partOf")).toBe(true);
  });

  it("never invents an id", () => {
    for (const name of ["meetup.html", "eventbrite.html", "luma-landing.html"]) {
      for (const event of htmlToEvents(fixture(name)).events) {
        expect(event.id).toBeUndefined();
      }
    }
  });
});
