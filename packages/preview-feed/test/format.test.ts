import { describe, expect, it } from "vitest";

import {
  addDays,
  attendancePrice,
  detailRows,
  eventLocation,
  eventWhen,
  firstImage,
  formatDate,
  isDateOnly,
  nonEmpty,
  onlineLocationLabel,
  parseSortDate,
  sortedEvents,
  truncate,
} from "../src/format.js";
import type { PreviewEvent } from "../src/types.js";

describe("truncate", () => {
  it("passes short text through unchanged", () => {
    expect(truncate("hello")).toBe("hello");
  });

  it("collapses whitespace and adds an ellipsis past the length budget", () => {
    const long = "word ".repeat(100).trim();
    const result = truncate(long, 20);
    expect(result!.length).toBe(20);
    expect(result!.endsWith("…")).toBe(true);
  });

  it("returns undefined for empty input", () => {
    expect(truncate(undefined)).toBeUndefined();
    expect(truncate("")).toBeUndefined();
  });
});

describe("nonEmpty", () => {
  it("joins non-empty arrays, drops empty ones", () => {
    expect(nonEmpty(["a", "b"])).toBe("a, b");
    expect(nonEmpty([])).toBeUndefined();
  });

  it("trims strings, drops blank ones", () => {
    expect(nonEmpty("  hi  ")).toBe("hi");
    expect(nonEmpty("   ")).toBeUndefined();
  });

  it("stringifies numbers/booleans and JSON-encodes plain objects", () => {
    expect(nonEmpty(42)).toBe("42");
    expect(nonEmpty(false)).toBe("false");
    expect(nonEmpty({ a: 1 })).toBe('{"a":1}');
  });
});

describe("detailRows", () => {
  it("drops entries whose value is empty, keeps the rest as label/value pairs", () => {
    expect(
      detailRows([
        ["Status", "scheduled"],
        ["Tags", []],
        ["Count", 3],
      ]),
    ).toEqual([
      { label: "Status", value: "scheduled" },
      { label: "Count", value: "3" },
    ]);
  });
});

describe("parseSortDate", () => {
  it("parses date-only and date-time values", () => {
    expect(parseSortDate("2026-06-15")).toBe(Date.parse("2026-06-15T00:00:00"));
    expect(parseSortDate("2026-06-15T18:00")).toBe(
      Date.parse("2026-06-15T18:00:00"),
    );
  });

  it("returns null for absent or unparseable values", () => {
    expect(parseSortDate(undefined)).toBeNull();
    expect(parseSortDate("not a date")).toBeNull();
  });
});

describe("isDateOnly", () => {
  it("recognizes YYYY-MM-DD and rejects anything else", () => {
    expect(isDateOnly("2026-06-15")).toBe(true);
    expect(isDateOnly("2026-06-15T18:00")).toBe(false);
    expect(isDateOnly(undefined)).toBe(false);
  });
});

describe("addDays", () => {
  it("adds calendar days in UTC, immune to host timezone", () => {
    expect(addDays("2026-06-30", 1)).toBe("2026-07-01");
  });
});

describe("eventLocation", () => {
  it("prefers venue over onlineUrl, falls back to an online label", () => {
    expect(eventLocation({ location: { venue: "Hall" } })).toBe("Hall");
    expect(eventLocation({ location: { onlineUrl: "https://x.example/room" } })).toBe(
      "Online event",
    );
    expect(eventLocation({})).toBe("online");
  });
});

describe("onlineLocationLabel", () => {
  it("labels recognizable online event platforms", () => {
    expect(onlineLocationLabel("https://meet.google.com/abc-defg-hij")).toBe("Google Meet");
    expect(onlineLocationLabel("https://example.zoom.us/j/123")).toBe("Zoom");
    expect(onlineLocationLabel("https://teams.microsoft.com/l/meetup-join/abc")).toBe(
      "Microsoft Teams",
    );
    expect(onlineLocationLabel("https://discord.gg/example")).toBe("Discord");
  });

  it("uses a generic label for unknown or invalid URLs", () => {
    expect(onlineLocationLabel("https://example.org/event")).toBe("Online event");
    expect(onlineLocationLabel("not a url")).toBe("Online event");
    expect(onlineLocationLabel(undefined)).toBeUndefined();
  });
});

describe("formatDate", () => {
  it("formats a date-only value without a time component", () => {
    expect(formatDate("2026-06-15", undefined)).not.toMatch(/:/);
  });

  it("appends the timezone label when given one", () => {
    expect(formatDate("2026-06-15T18:00", "Europe/Madrid")).toContain(
      "(Europe/Madrid)",
    );
  });

  it("returns an empty string for an absent value", () => {
    expect(formatDate(undefined, undefined)).toBe("");
  });
});

describe("eventWhen", () => {
  it("prefers an explicit dateLabel over computed formatting", () => {
    const event: PreviewEvent = { name: "x", dateLabel: "Every Tuesday" };
    expect(eventWhen(event)).toBe("Every Tuesday");
  });

  it("joins start and end with 'to' when both are present", () => {
    const event: PreviewEvent = {
      name: "x",
      startDate: "2026-06-15",
      endDate: "2026-06-16",
    };
    expect(eventWhen(event)).toMatch(/ to /);
  });
});

describe("sortedEvents", () => {
  const at = (startDate: string): PreviewEvent => ({ name: startDate, startDate });

  it("orders undated events last, keeping their original relative order", () => {
    const events = [at("2030-01-01"), { name: "no date" }, at("2030-06-01")];
    const result = sortedEvents(events);
    expect(result.map((e) => e.name)).toEqual([
      "2030-01-01",
      "2030-06-01",
      "no date",
    ]);
  });

  it("sorts upcoming events soonest-first and past events most-recent-first, upcoming before past", () => {
    const future1 = at("2999-01-01");
    const future2 = at("2999-06-01");
    const past1 = at("2000-01-01");
    const past2 = at("2000-06-01");
    const result = sortedEvents([past1, future2, past2, future1]);
    expect(result).toEqual([future1, future2, past2, past1]);
  });
});

describe("firstImage", () => {
  it("returns undefined for an absent/empty image list", () => {
    expect(firstImage(undefined)).toBeUndefined();
    expect(firstImage([])).toBeUndefined();
  });

  it("wraps a bare string URL as {url}", () => {
    expect(firstImage(["https://example.org/a.jpg"])).toEqual({
      url: "https://example.org/a.jpg",
    });
  });

  it("passes an {url, alt} entry through unchanged", () => {
    expect(firstImage([{ url: "https://example.org/a.jpg", alt: "A poster" }])).toEqual({
      url: "https://example.org/a.jpg",
      alt: "A poster",
    });
  });

  it("takes the first entry from a mixed string/object list", () => {
    expect(
      firstImage([{ url: "https://example.org/first.jpg" }, "https://example.org/second.jpg"]),
    ).toEqual({ url: "https://example.org/first.jpg" });
  });

  it("falls through an http:// entry to a later https:// one", () => {
    // OTE Spec 0.4.0 allows http:// images; on an https page they are mixed
    // content and never render, while the https entry below them would have.
    expect(
      firstImage(["http://example.org/insecure.jpg", { url: "https://example.org/secure.jpg", alt: "Poster" }]),
    ).toEqual({ url: "https://example.org/secure.jpg", alt: "Poster" });
  });

  it("still returns an http:// entry when the list offers nothing else", () => {
    expect(firstImage(["http://example.org/a.jpg", "http://example.org/b.jpg"])).toEqual({
      url: "http://example.org/a.jpg",
    });
  });

  it("keeps a non-ASCII image address exactly as published", () => {
    expect(firstImage(["https://example.org/imágenes/pycamp-españa.jpg"])).toEqual({
      url: "https://example.org/imágenes/pycamp-españa.jpg",
    });
  });
});

describe("attendancePrice", () => {
  // The shared admission of the schema's own partOf.offers example.
  const shared = [
    { name: "Early bird", price: 180, currency: "EUR", url: "https://trgcon.example/tickets" },
    { name: "General", price: 240, currency: "EUR", url: "https://trgcon.example/tickets" },
  ];

  it("returns undefined when nothing in the document prices the event", () => {
    expect(attendancePrice({})).toBeUndefined();
    expect(attendancePrice({ offers: [] })).toBeUndefined();
    expect(attendancePrice({ offers: [{ currency: "EUR" }, { price: undefined }] })).toBeUndefined();
  });

  it("picks the cheapest of the ways to attend this part", () => {
    expect(
      attendancePrice({
        offers: [{ price: 45, currency: "EUR" }, { price: 30, currency: "EUR" }, { currency: "EUR" }],
      }),
    ).toEqual({ amount: 30, currency: "EUR", url: undefined, basis: "own" });
  });

  it("treats a zero price as free, not as absent", () => {
    expect(attendancePrice({ offers: [{ price: 0 }] })).toEqual({
      amount: 0,
      currency: undefined,
      url: undefined,
      basis: "own",
    });
  });

  it("carries the winning offer's url through, for a ticket link", () => {
    expect(
      attendancePrice({
        offers: [
          { price: 45, currency: "EUR", url: "https://example.org/tickets/general" },
          { price: 30, currency: "EUR", url: "https://example.org/tickets/early-bird" },
        ],
      })?.url,
    ).toBe("https://example.org/tickets/early-bird");
  });

  // The three documents the old `Math.min` implementation answered wrongly.
  // Each is schema-valid and each wrong answer was shown to an attendee.
  describe("multi-part pricing (D032)", () => {
    it("prices a part with no offers from the set's shared admission", () => {
      // Was: undefined — "no price" for an event the document prices.
      expect(attendancePrice({ partOf: { offers: shared } })).toEqual({
        amount: 180,
        currency: "EUR",
        url: "https://trgcon.example/tickets",
        basis: "shared",
      });
    });

    it("adds an add-on to the shared admission instead of quoting it alone", () => {
      // Was: 60 — the surcharge, presented as the cost of attending.
      expect(
        attendancePrice({
          offers: [{ scope: "add-on", price: 60, currency: "EUR", url: "https://trgcon.example/workshop" }],
          partOf: { offers: shared },
        }),
      ).toEqual({
        amount: 240,
        currency: "EUR",
        url: "https://trgcon.example/workshop",
        basis: "shared-plus-add-on",
      });
    });

    it("compares totals, so a standalone admission can beat admission-plus-surcharge", () => {
      // Was: 20 — the cheapest number on the page, and the one price nobody
      // can pay. The spec composes an add-on with the SET admission, never
      // with the part's own, so attending costs 50 (own) or 180 + 20 (set).
      expect(
        attendancePrice({
          offers: [
            { scope: "admission", price: 50, currency: "EUR" },
            { scope: "add-on", price: 20, currency: "EUR" },
          ],
          partOf: { offers: shared },
        }),
      ).toEqual({ amount: 50, currency: "EUR", url: undefined, basis: "own" });
    });

    it("reads an absent scope as admission", () => {
      expect(
        attendancePrice({ offers: [{ price: 50, currency: "EUR" }], partOf: { offers: shared } })?.basis,
      ).toBe("own");
    });

    it("says the total is unknown when a surcharge has no priced admission to add to", () => {
      // The schema forbids this shape; the input here is unvalidated, and
      // reporting 20 € as the price is the false answer the spec rules out.
      expect(
        attendancePrice({ offers: [{ scope: "add-on", price: 20, currency: "EUR" }] }),
      ).toEqual({ amount: 20, currency: "EUR", url: undefined, basis: "add-on-only" });

      expect(
        attendancePrice({
          offers: [{ scope: "add-on", price: 20, currency: "EUR" }],
          partOf: { offers: [{ url: "https://trgcon.example/tickets" }] },
        })?.basis,
      ).toBe("add-on-only");
    });

    it("refuses to add across currencies, and says the surcharge instead", () => {
      // 240 EUR + 20 USD is not 260 of anything. Nothing in the schema makes
      // two offers share a currency, so this is reachable valid input.
      expect(
        attendancePrice({
          offers: [{ scope: "add-on", price: 20, currency: "USD" }],
          partOf: { offers: shared },
        }),
      ).toEqual({ amount: 20, currency: "USD", url: undefined, basis: "add-on-only" });
    });

    it("still reads a currency-less add-on in the currency the set is sold in", () => {
      // An inference about notation, not about money.
      expect(
        attendancePrice({ offers: [{ scope: "add-on", price: 20 }], partOf: { offers: shared } }),
      ).toEqual({
        amount: 200,
        currency: "EUR",
        url: "https://trgcon.example/tickets",
        basis: "shared-plus-add-on",
      });
    });

    it("does not let the shared admission price a part that states its own ways in", () => {
      // Own offers exist but carry no number: the part is not "covered", it
      // is unpriced, and the set admission is not what attending it costs.
      expect(
        attendancePrice({
          offers: [{ url: "https://trgcon.example/workshop" }],
          partOf: { offers: shared },
        }),
      ).toBeUndefined();
    });

    it("prefers a priced total over a surcharge whose total is unknown", () => {
      expect(
        attendancePrice({
          offers: [
            { scope: "add-on", price: 5, currency: "EUR" },
            { scope: "admission", price: 90, currency: "EUR" },
          ],
        }),
      ).toEqual({ amount: 90, currency: "EUR", url: undefined, basis: "own" });
    });
  });
});
