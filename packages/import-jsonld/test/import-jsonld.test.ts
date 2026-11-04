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

describe("location.address (schema.org PostalAddress, unflattened)", () => {
  const page = (address: string) =>
    `<script type="application/ld+json">{"@type":"Event","name":"X",
      "startDate":"2026-09-01T10:00:00+02:00","location":{"@type":"Place",
      "name":"FYCMA","address":${address}}}</script>`;

  it("maps every part, and keeps venue alongside it", () => {
    const { events } = htmlToEvents(
      page(`{"@type":"PostalAddress","streetAddress":"Av. de Jose Ortega y Gasset, 201",
        "addressLocality":"Marbella","addressRegion":"Andalucia","postalCode":"29006",
        "addressCountry":"ES"}`),
    );
    expect(events[0].location?.address).toEqual({
      street: "Av. de Jose Ortega y Gasset, 201",
      locality: "Marbella",
      region: "Andalucia",
      postalCode: "29006",
      country: "ES",
    });
    // address COMPLEMENTS venue rather than replacing it: venue stays the one
    // string every output format can print, so the overlap is deliberate.
    expect(events[0].location?.venue).toContain("FYCMA");
  });

  it("locality and country survive even when that is all the page carries", () => {
    // The loss that started this: biznagafest.com publishes exactly these two
    // inside PostalAddress, and both used to be folded away into venue.
    const { events } = htmlToEvents(
      page(`{"@type":"PostalAddress","addressLocality":"Malaga","addressCountry":"ES"}`),
    );
    expect(events[0].location?.address).toEqual({ locality: "Malaga", country: "ES" });
  });

  it("a two-letter country code is upper-cased", () => {
    const { events } = htmlToEvents(page(`{"@type":"PostalAddress","addressCountry":"es"}`));
    expect(events[0].location?.address?.country).toBe("ES");
  });

  it("a country name is not a code: absent + warning, never guessed", () => {
    const { events, warnings } = htmlToEvents(
      page(`{"@type":"PostalAddress","addressLocality":"Madrid","addressCountry":"Spain"}`),
    );
    expect(events[0].location?.address).toEqual({ locality: "Madrid" });
    expect(
      warnings.some(
        (w) => w.field === "location.address.country" && w.message.includes("Spain"),
      ),
    ).toBe(true);
  });

  it("reads addressCountry from a Country object", () => {
    const { events } = htmlToEvents(
      page(`{"@type":"PostalAddress","addressCountry":{"@type":"Country","name":"ES"}}`),
    );
    expect(events[0].location?.address?.country).toBe("ES");
  });

  it("a string address leaves no parts to map", () => {
    const { events } = htmlToEvents(page(`"Calle Mayor 1, Madrid"`));
    expect(events[0].location?.address).toBeUndefined();
    expect(events[0].location?.venue).toContain("Calle Mayor 1");
  });
});

describe("url when the JSON-LD carries none", () => {
  const noUrl = `<link rel="canonical" href="https://www.biznagafest.com/">
    <script type="application/ld+json">{"@type":"Event","name":"BiznagaFest 2026",
    "startDate":"2026-11-07T09:00:00+01:00"}</script>`;

  it("falls back to the page's canonical link", () => {
    const { events } = htmlToEvents(noUrl);
    expect(events[0].url).toBe("https://www.biznagafest.com/");
  });

  it("the id warning only promises a url when one was actually kept", () => {
    const { warnings } = htmlToEvents(noUrl);
    expect(warnings.find((w) => w.field === "id")?.message).toContain(
      "the page's url was kept in `url`",
    );
  });

  it("no url anywhere: the id warning says so instead of promising one", () => {
    // The bug this replaces: the warning claimed the url "was kept in `url`"
    // while `url` was absent, sending the reader after a field that is not there.
    const { events, warnings } = htmlToEvents(
      `<script type="application/ld+json">{"@type":"Event","name":"X",
       "startDate":"2026-09-01T10:00:00+02:00"}</script>`,
    );
    expect(events[0].url).toBeUndefined();
    const id = warnings.find((w) => w.field === "id");
    expect(id?.message).not.toContain("was kept in `url`");
    expect(id?.message).toContain("--url");
  });

  it("pageUrl wins over the canonical link", () => {
    const { events } = htmlToEvents(noUrl, { pageUrl: "https://mirror.example/bz" });
    expect(events[0].url).toBe("https://mirror.example/bz");
  });

  it("the Event's own url wins over both", () => {
    const { events } = htmlToEvents(
      `<link rel="canonical" href="https://page.example/">
       <script type="application/ld+json">{"@type":"Event","name":"X",
       "url":"https://own.example/e/1","startDate":"2026-09-01T10:00:00+02:00"}</script>`,
      { pageUrl: "https://flag.example/" },
    );
    expect(events[0].url).toBe("https://own.example/e/1");
  });

  it("a non-http canonical is ignored", () => {
    const { events } = htmlToEvents(
      `<link rel="canonical" href="/relative/path">
       <script type="application/ld+json">{"@type":"Event","name":"X",
       "startDate":"2026-09-01T10:00:00+02:00"}</script>`,
    );
    expect(events[0].url).toBeUndefined();
  });
});

describe("subEvent: one document per part, linked with partOf", () => {
  const conference = `<script type="application/ld+json">{"@type":"Event",
    "name":"BiznagaFest 2026","url":"https://biznagafest.com/2026",
    "startDate":"2026-11-07T09:00:00+01:00","subEvent":[
      {"@type":"Event","name":"Talk A","startDate":"2026-11-07T10:00:00+01:00"},
      {"@type":"Event","name":"Talk B","startDate":"2026-11-07T11:00:00+01:00"}]}</script>`;

  it("emits the parent and each part", () => {
    const { events } = htmlToEvents(conference);
    expect(events.map((e) => e.name)).toEqual(["BiznagaFest 2026", "Talk A", "Talk B"]);
  });

  it("each part carries partOf pointing at the parent", () => {
    const { events } = htmlToEvents(conference);
    const partOf = { id: "https://biznagafest.com/2026", name: "BiznagaFest 2026" };
    expect(events[1].partOf).toEqual(partOf);
    expect(events[2].partOf).toEqual(partOf);
    // The parent is an event in its own right, not a container for its talks.
    expect(events[0].partOf).toBeUndefined();
  });

  it("a part does not inherit the parent's url as its own", () => {
    const { events } = htmlToEvents(conference);
    // 17 talks all claiming the conference's page as their url is worse than
    // 17 talks with no url: the id each still needs would be identical.
    expect(events[1].url).toBeUndefined();
    expect(events[0].url).toBe("https://biznagafest.com/2026");
  });

  it("an explicit superEvent on the part wins over the inherited parent", () => {
    const { events } = htmlToEvents(
      `<script type="application/ld+json">{"@type":"Event","name":"Parent",
       "url":"https://p.example/1","subEvent":{"@type":"Event","name":"Part",
       "startDate":"2026-09-01T10:00:00+02:00",
       "superEvent":{"@type":"Event","@id":"https://other.example/series"}}}</script>`,
    );
    expect(events[1].partOf).toEqual({ id: "https://other.example/series" });
  });

  it("falls back to the page url for partOf.id when the parent has none", () => {
    const { events } = htmlToEvents(
      `<script type="application/ld+json">{"@type":"Event","name":"Parent",
       "startDate":"2026-09-01T09:00:00+02:00","subEvent":{"@type":"Event",
       "name":"Part","startDate":"2026-09-01T10:00:00+02:00"}}</script>`,
      { pageUrl: "https://conf.example/2026" },
    );
    expect(events[1].partOf).toEqual({ id: "https://conf.example/2026", name: "Parent" });
  });

  it("no URI for the parent at all: the parts are not imported, and it says so", () => {
    // partOf.id is required. A part that cannot say what it is part of would
    // silently become a standalone event — quieter, and worse.
    const { events, warnings } = htmlToEvents(
      `<script type="application/ld+json">{"@type":"Event","name":"Parent",
       "startDate":"2026-09-01T09:00:00+02:00","subEvent":[{"@type":"Event",
       "name":"Part","startDate":"2026-09-01T10:00:00+02:00"}]}</script>`,
    );
    expect(events.map((e) => e.name)).toEqual(["Parent"]);
    const warning = warnings.find((w) => w.field === "subEvent");
    expect(warning?.message).toContain("1 subEvent(s)");
    expect(warning?.message).toContain("partOf.id");
  });

  it("a part is never also collected as a standalone event", () => {
    expect(htmlToEvents(conference).events).toHaveLength(3);
  });
});

describe("performer → speakers (OTE 0.5+)", () => {
  const page = (performer: string) =>
    `<script type="application/ld+json">{"@type":"Event","name":"X",
      "startDate":"2026-09-01T10:00:00+02:00","performer":${performer}}</script>`;

  it("imports a list of people", () => {
    // Exactly biznagafest.com's shape, which used to produce
    // 'schema.org "performer" has no OTE equivalent and was not imported'.
    const { events, warnings } = htmlToEvents(
      page(`[{"@type":"Person","name":"Fernando Herrera"},
             {"@type":"Person","name":"Gisela Torres"}]`),
    );
    expect(events[0].speakers).toEqual([
      { name: "Fernando Herrera", type: "person" },
      { name: "Gisela Torres", type: "person" },
    ]);
    expect(warnings.some((w) => w.message.includes("performer"))).toBe(false);
  });

  it("keeps the employer out of name, in affiliation", () => {
    const { events } = htmlToEvents(
      page(`{"@type":"Person","name":"Martí Cristobal",
             "affiliation":{"@type":"Organization","name":"Bettatech"}}`),
    );
    // The whole point of the field: "Martí Cristobal, Bettatech" inside name
    // stops matching that person anywhere else.
    expect(events[0].speakers).toEqual([
      { name: "Martí Cristobal", affiliation: "Bettatech", type: "person" },
    ]);
  });

  it("reads affiliation from worksFor, and from a bare string", () => {
    expect(
      htmlToEvents(page(`{"@type":"Person","name":"A","worksFor":{"name":"Acme"}}`))
        .events[0].speakers?.[0]?.affiliation,
    ).toBe("Acme");
    expect(
      htmlToEvents(page(`{"@type":"Person","name":"B","affiliation":"Globex"}`))
        .events[0].speakers?.[0]?.affiliation,
    ).toBe("Globex");
  });

  it("ignores affiliation on an organization", () => {
    // An organisation is not "there as" another organisation.
    const { events } = htmlToEvents(
      page(`{"@type":"Organization","name":"GDG Málaga","affiliation":"Google"}`),
    );
    expect(events[0].speakers).toEqual([{ name: "GDG Málaga", type: "organization" }]);
  });

  it("keeps only HTTP(S) sameAs entries", () => {
    // OTE's sameAs is a web page; a DID or an acct: handle is an identifier.
    const { events } = htmlToEvents(
      page(`{"@type":"Person","name":"A","url":"https://a.example",
             "sameAs":["https://github.com/a","did:plc:xyz","acct:a@b.social"]}`),
    );
    expect(events[0].speakers?.[0]).toEqual({
      name: "A",
      type: "person",
      url: "https://a.example",
      sameAs: ["https://github.com/a"],
    });
  });

  it("a performer with no name is warned, not invented", () => {
    const { events, warnings } = htmlToEvents(
      page(`[{"@type":"Person","url":"https://a.example"},{"@type":"Person","name":"B"}]`),
    );
    expect(events[0].speakers).toEqual([{ name: "B", type: "person" }]);
    expect(warnings.some((w) => w.field === "speakers")).toBe(true);
  });
});

describe("recordedIn / workFeaturedIn → recordings (OTE 0.5+)", () => {
  const page = (body: string) =>
    `<script type="application/ld+json">{"@type":"Event","name":"X",
      "startDate":"2026-09-01T10:00:00+02:00",${body}}</script>`;

  it("maps a watch page, with and without a title", () => {
    const { events } = htmlToEvents(
      page(`"recordedIn":[{"@type":"VideoObject","url":"https://youtube.com/watch?v=a","name":"Part 1"},
                          "https://peertube.example/w/b"]`),
    );
    expect(events[0].recordings).toEqual([
      { url: "https://youtube.com/watch?v=a", title: "Part 1" },
      "https://peertube.example/w/b",
    ]);
  });

  it("merges recordedIn and workFeaturedIn instead of one winning", () => {
    const { events } = htmlToEvents(
      page(`"recordedIn":"https://a.example/1","workFeaturedIn":"https://b.example/2"`),
    );
    expect(events[0].recordings).toEqual(["https://a.example/1", "https://b.example/2"]);
  });

  it("a non-http recording is dropped, not emitted", () => {
    const { events } = htmlToEvents(page(`"recordedIn":"ipfs://QmXyz"`));
    expect(events[0].recordings).toBeUndefined();
  });

  it("no recording is the normal case and draws no warning", () => {
    // Recordings are published after the event, so most pages carry none.
    const { events, warnings } = htmlToEvents(page(`"name":"X"`));
    expect(events[0].recordings).toBeUndefined();
    expect(warnings.some((w) => w.field === "recordings")).toBe(false);
  });
});

