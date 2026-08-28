import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { htmlToEvents } from "@opentechevents/import-jsonld";
import { validateFeed } from "@opentechevents/validate";
import { describe, expect, it } from "vitest";

import {
  eventToJsonLd,
  feedToItemList,
  feedToJsonLd,
  isOnlineOnly,
  markdownToPlainText,
  toJsonLdScript,
  wallClockWithOffset,
  type JsonLdNode,
  type OteEvent,
  type OteFeed,
} from "../src/index.js";

/** The 0.4.0 IRI case: an address the publisher minted with a literal `ñ`. */
const NON_ASCII_ID =
  "https://eventos.example/comunidad-española/2026/pycamp-españa-edición-de-otoño";

const fixturePath = fileURLToPath(new URL("../fixtures/feed.json", import.meta.url));
const feed = JSON.parse(readFileSync(fixturePath, "utf8")) as OteFeed;

function eventFor(id: string): OteEvent {
  const event = feed.events.find((e) => e.id === id);
  if (!event) throw new Error(`no fixture event with id ${id}`);
  return event;
}

const node = (id: string, options = {}): JsonLdNode => eventToJsonLd(eventFor(id), options);

describe("eventToJsonLd", () => {
  it("fixture is a valid OTE feed (guards the fixture itself)", () => {
    expect(validateFeed(feed).errors).toEqual([]);
  });

  it("emits a standalone Event with @context, @id and name", () => {
    expect(node("https://minimal.example/meetup/2026-09")).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
      "@id": "https://minimal.example/meetup/2026-09",
      name: "Minimal, but valid",
      startDate: "2026-09-01T18:30Z",
    });
  });

  it("is deterministic: no clock, no network", () => {
    const id = "https://rustmadrid.example/meetups/2026-06";
    expect(node(id)).toEqual(node(id));
  });

  it("derives the UTC offset from the event's IANA timezone", () => {
    const summer = node("https://rustmadrid.example/meetups/2026-06");
    expect(summer.startDate).toBe("2026-06-26T19:00+02:00");
    expect(summer.endDate).toBe("2026-06-26T21:00+02:00");
  });

  it("offsets: false emits the bare wall clock", () => {
    const bare = node("https://rustmadrid.example/meetups/2026-06", { offsets: false });
    expect(bare.startDate).toBe("2026-06-26T19:00");
  });

  it("leaves an all-day event's dates as plain dates", () => {
    const conference = node("https://devfest-levante.example/2026");
    expect(conference.startDate).toBe("2026-10-16");
    // OTE's endDate is inclusive for all-day events, which is also how
    // schema.org reads a date-only endDate — passed through as-is.
    expect(conference.endDate).toBe("2026-10-17");
  });

  it("maps an online event to a VirtualLocation", () => {
    const online = node("https://pyalmeria.example/eventos/2026-06-async");
    expect(online.eventAttendanceMode).toBe("https://schema.org/OnlineEventAttendanceMode");
    expect(online.location).toEqual({
      "@type": "VirtualLocation",
      url: "https://meet.example/pyalmeria",
    });
  });

  it("maps a hybrid event to both a Place and a VirtualLocation", () => {
    const hybrid = node("https://rustmadrid.example/meetups/2026-06");
    expect(hybrid.eventAttendanceMode).toBe("https://schema.org/MixedEventAttendanceMode");
    expect(hybrid.location).toEqual([
      {
        "@type": "Place",
        name: "Campus Madrid, Calle de Moreno Nieto 2, Madrid",
        address: "Campus Madrid, Calle de Moreno Nieto 2, Madrid",
        geo: { "@type": "GeoCoordinates", latitude: 40.4081, longitude: -3.7188 },
      },
      { "@type": "VirtualLocation", url: "https://meet.example/rust-madrid" },
    ]);
  });

  it("treats a venue that is a URL as a meeting link, not a Place", () => {
    // Feeds imported from ICS routinely carry the join URL in `venue`.
    // Emitting Place.address = "https://meet.example/x" claims a room exists
    // at a URL, which is what a structured-data validator flags.
    const fromIcs = eventToJsonLd({
      id: "https://example.org/online",
      name: "Online meetup",
      startDate: "2026-05-05T18:00",
      timezone: "UTC",
      attendanceMode: "online",
      location: { venue: "https://meet.example/room" },
    });
    expect(fromIcs.location).toEqual({
      "@type": "VirtualLocation",
      url: "https://meet.example/room",
    });
  });

  it("does not emit the same online link twice when venue duplicates onlineUrl", () => {
    const both = eventToJsonLd({
      id: "https://example.org/online",
      name: "Online meetup",
      startDate: "2026-05-05T18:00",
      timezone: "UTC",
      location: {
        venue: "https://meet.example/room",
        onlineUrl: "https://meet.example/room",
      },
    });
    expect(both.location).toEqual({
      "@type": "VirtualLocation",
      url: "https://meet.example/room",
    });
  });

  it("maps status, tags, languages, organizers, images, offers and superEvent", () => {
    const conference = node("https://devfest-levante.example/2026");
    expect(conference.keywords).toEqual(["cloud", "ai", "web"]);
    expect(conference.inLanguage).toEqual(["es", "en"]);
    expect(conference.offers).toEqual({
      "@type": "Offer",
      name: "General",
      price: 45,
      priceCurrency: "EUR",
      url: "https://devfest-levante.example/2026/entradas",
    });
    expect(conference.superEvent).toEqual({
      "@type": "Event",
      "@id": "https://devfest.example/series",
      name: "DevFest",
    });

    const cancelled = node("https://coolconf.example/2026");
    expect(cancelled.eventStatus).toBe("https://schema.org/EventCancelled");

    const online = node("https://pyalmeria.example/eventos/2026-06-async");
    expect(online.organizer).toEqual([
      { "@type": "Organization", name: "PyAlmería", email: "hola@pyalmeria.example" },
      { "@type": "Organization", name: "Community co-host" },
    ]);
    // image[].alt has no schema.org property; caption is the closest analog.
    expect(online.image).toEqual([
      {
        "@type": "ImageObject",
        url: "https://pyalmeria.example/img/2026-06.png",
        caption: "Event poster",
      },
    ]);
  });

  it("drops OTE fields schema.org/Event does not model, rather than inventing them", () => {
    const conference = node("https://devfest-levante.example/2026");
    // cfp and eligibility have no schema.org equivalent at all.
    expect(conference).not.toHaveProperty("cfp");
    expect(conference).not.toHaveProperty("eligibility");
    const cancelled = node("https://coolconf.example/2026");
    expect(cancelled).not.toHaveProperty("license");
  });

  it("omits eventStatus for a tentative event — schema.org has no equivalent", () => {
    const tentative = eventToJsonLd({
      id: "https://example.org/tentative",
      name: "Maybe",
      startDate: "2026-05-05T18:00",
      timezone: "UTC",
      status: "tentative",
    });
    expect(tentative).not.toHaveProperty("eventStatus");
  });

  it("maps offer availability and instant windows", () => {
    const withOffers = eventToJsonLd({
      id: "https://example.org/tickets",
      name: "Tickets",
      startDate: "2026-05-05T18:00",
      timezone: "UTC",
      offers: [
        {
          name: "Early bird",
          price: 0,
          currency: "EUR",
          availability: "sold-out",
          opensAt: "2026-01-01T00:00:00+01:00",
          closesAt: "2026-02-01T00:00:00+01:00",
        },
        { name: "General", price: 30, currency: "EUR", availability: "in-stock" },
      ],
    });
    expect(withOffers.offers).toEqual([
      {
        "@type": "Offer",
        name: "Early bird",
        price: 0,
        priceCurrency: "EUR",
        availability: "https://schema.org/SoldOut",
        validFrom: "2026-01-01T00:00:00+01:00",
        validThrough: "2026-02-01T00:00:00+01:00",
      },
      {
        "@type": "Offer",
        name: "General",
        price: 30,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    ]);
  });

  it("renders a Markdown description as plain text — schema.org takes no markup", () => {
    const markdown = node("https://mdtest.example/2026-11");
    // Emphasis and link syntax become their text; the raw-HTML block (a
    // <script> the fixture plants there) is dropped whole, markup and
    // contents alike — it was never prose.
    expect(markdown.description).toBe("Bold intro with a link.");
  });

  it("plainTextDescription: false passes the OTE value through unchanged", () => {
    const event = eventFor("https://mdtest.example/2026-11");
    const raw = eventToJsonLd(event, { plainTextDescription: false });
    expect(raw.description).toBe(event.description);
  });

  it("carries a non-ASCII IRI into @id, url, image and superEvent unchanged", () => {
    const iri = node(NON_ASCII_ID);
    expect(iri["@id"]).toBe(NON_ASCII_ID);
    expect(iri.url).toBe(NON_ASCII_ID);
    expect(iri.image).toEqual(["http://eventos.example/img/pycamp-españa.png"]);
    expect((iri.superEvent as JsonLdNode)["@id"]).toBe(
      "https://eventos.example/comunidad-española/pycamp-españa",
    );
    // JSON carries the characters directly; percent-encoding one here would
    // mint a second spelling of the publisher's id.
    expect(JSON.stringify(iri)).not.toContain("%C3%B1");
  });

  it("round trips a non-ASCII address through a script block and import-jsonld", () => {
    const script = toJsonLdScript(node(NON_ASCII_ID));
    const { events } = htmlToEvents(`<!doctype html><html><head>${script}</head><body></body></html>`);
    expect(events).toHaveLength(1);
    expect(events[0]!.url).toBe(NON_ASCII_ID);
  });
});

describe("isOnlineOnly", () => {
  it("is true when there is no physical address to put in location", () => {
    expect(isOnlineOnly(eventFor("https://pyalmeria.example/eventos/2026-06-async"))).toBe(true);
    // A venue that is a URL is a meeting link, not an address.
    expect(
      isOnlineOnly({
        id: "https://example.org/x",
        name: "x",
        startDate: "2026-05-05T18:00",
        timezone: "UTC",
        location: { venue: "https://meet.example/room" },
      }),
    ).toBe(true);
  });

  it("is false for an event with a real venue, hybrid included", () => {
    expect(isOnlineOnly(eventFor("https://devfest-levante.example/2026"))).toBe(false);
    expect(isOnlineOnly(eventFor("https://rustmadrid.example/meetups/2026-06"))).toBe(false);
  });
});

describe("feedToJsonLd", () => {
  const document = feedToJsonLd(feed);

  it("wraps every event in one @graph with a single @context", () => {
    expect(document["@context"]).toBe("https://schema.org");
    const graph = document["@graph"] as JsonLdNode[];
    expect(graph).toHaveLength(feed.events.length);
    // The @context belongs to the document, not to each nested node.
    expect(graph.every((n) => !("@context" in n))).toBe(true);
    expect(graph.every((n) => n["@type"] === "Event")).toBe(true);
  });
});

describe("feedToItemList", () => {
  const document = feedToItemList(feed);
  const items = document.itemListElement as JsonLdNode[];

  it("emits a positioned ItemList carrying the feed title and count", () => {
    expect(document["@type"]).toBe("ItemList");
    expect(document.name).toBe("OTE Export Fixtures");
    expect(document.numberOfItems).toBe(feed.events.length);
    expect(items.map((i) => i.position)).toEqual(
      feed.events.map((_, index) => index + 1),
    );
  });

  it("sets ListItem.url only for events that have a url", () => {
    const withUrl = items[1]!;
    expect(withUrl.url).toBe("https://rustmadrid.example/meetups/2026-06");
    // The first fixture event has an id but no url: an OTE id is a stable
    // URI, not necessarily a fetchable page, so it must not become a link.
    expect(items[0]).not.toHaveProperty("url");
  });
});

describe("toJsonLdScript", () => {
  it("wraps a document in a pasteable application/ld+json script block", () => {
    const script = toJsonLdScript({ "@context": "https://schema.org", "@type": "Event" });
    expect(script.startsWith('<script type="application/ld+json">\n')).toBe(true);
    expect(script.endsWith("\n</script>")).toBe(true);
    expect(JSON.parse(script.split("\n").slice(1, -1).join("\n"))).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
    });
  });

  it("escapes < so a description can never close the script element early", () => {
    const script = toJsonLdScript({ description: "</script><img src=x onerror=alert(1)>" });
    expect(script).not.toContain("</script><img");
    expect(script.match(/<\/script>/g)).toHaveLength(1);
    const json = script.split("\n").slice(1, -1).join("\n");
    // Escaped, but still the original string once parsed as JSON.
    expect(JSON.parse(json)).toEqual({
      description: "</script><img src=x onerror=alert(1)>",
    });
  });
});

describe("wallClockWithOffset", () => {
  it("resolves the offset for the event's own date, honouring DST", () => {
    expect(wallClockWithOffset("2026-01-15T10:00", "Europe/Madrid")).toBe("2026-01-15T10:00+01:00");
    expect(wallClockWithOffset("2026-07-15T10:00", "Europe/Madrid")).toBe("2026-07-15T10:00+02:00");
    expect(wallClockWithOffset("2026-07-15T10:00", "America/New_York")).toBe(
      "2026-07-15T10:00-04:00",
    );
    expect(wallClockWithOffset("2026-07-15T10:00", "Asia/Kolkata")).toBe("2026-07-15T10:00+05:30");
  });

  it("emits Z for UTC", () => {
    expect(wallClockWithOffset("2026-07-15T10:00", "UTC")).toBe("2026-07-15T10:00Z");
  });

  it("leaves the value alone when it cannot resolve an offset", () => {
    expect(wallClockWithOffset("2026-07-15", "Europe/Madrid")).toBe("2026-07-15");
    expect(wallClockWithOffset("2026-07-15T10:00", "Not/AZone")).toBe("2026-07-15T10:00");
  });
});

describe("markdownToPlainText", () => {
  it("leaves plain text untouched", () => {
    expect(markdownToPlainText("Introductory talk.\nQ&A at the end.")).toBe(
      "Introductory talk.\nQ&A at the end.",
    );
  });

  it("strips emphasis, links, headings and list markers", () => {
    expect(markdownToPlainText("## Agenda\n\n- **First** talk\n- [Second](https://x.example)")).toBe(
      "Agenda\n\nFirst talk\nSecond",
    );
  });
});
