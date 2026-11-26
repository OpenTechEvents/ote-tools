import { describe, expect, it } from "vitest";

import {
  ALL_FIELDS,
  DEFAULT_EVENT_ACTIONS,
  DEFAULT_FIELDS,
  parseCardWidth,
  parseDetailFields,
  parseEventActions,
  parseEventClick,
  parseEventId,
  parseFeedsAttr,
  parseFields,
  parseCalendarAttributes,
  parseGroupEvents,
  parseInitialDate,
  parseLangAttr,
  parseLayout,
  parseLimit,
  parseMaxPerDay,
  parseResponsive,
  parseShowPast,
  parseSort,
  resolveLang,
  parseMaxHeight,
  parseDensity,
  resolveCompact,
} from "../src/attrs.js";

describe("parseEventId", () => {
  it("trims the id and treats blank as absent", () => {
    expect(parseEventId(" https://example.org/events/x ")).toBe("https://example.org/events/x");
    expect(parseEventId("")).toBeUndefined();
    expect(parseEventId("   ")).toBeUndefined();
    expect(parseEventId(null)).toBeUndefined();
  });
});

describe("parseLimit", () => {
  it("defaults to no limit when absent, blank, non-numeric, zero, or negative", () => {
    for (const value of [null, "", "abc", "0", "-3"]) {
      expect(parseLimit(value)).toBe(Infinity);
    }
  });

  it("parses a positive integer string", () => {
    expect(parseLimit("12")).toBe(12);
  });

  it("truncates a fractional string to an integer", () => {
    expect(parseLimit("3.9")).toBe(3);
  });
});

describe("parseLangAttr", () => {
  it("accepts en/es, defaults to auto otherwise", () => {
    expect(parseLangAttr("en")).toBe("en");
    expect(parseLangAttr("es")).toBe("es");
    expect(parseLangAttr("fr")).toBe("auto");
    expect(parseLangAttr(null)).toBe("auto");
  });
});

describe("resolveLang", () => {
  it("passes an explicit en/es through unchanged, ignoring navigator.language", () => {
    expect(resolveLang("en", "es-ES")).toBe("en");
    expect(resolveLang("es", "en-US")).toBe("es");
  });

  it("resolves auto from navigator.language, case-insensitively", () => {
    expect(resolveLang("auto", "es-ES")).toBe("es");
    expect(resolveLang("auto", "ES-es")).toBe("es");
    expect(resolveLang("auto", "en-US")).toBe("en");
    expect(resolveLang("auto", "fr-FR")).toBe("en");
  });
});

describe("parseShowPast", () => {
  it('defaults to true and is false only for the literal string "false"', () => {
    expect(parseShowPast("true")).toBe(true);
    expect(parseShowPast("True")).toBe(true);
    expect(parseShowPast("1")).toBe(true);
    expect(parseShowPast(null)).toBe(true);
    expect(parseShowPast("")).toBe(true);
    expect(parseShowPast("false")).toBe(false);
    expect(parseShowPast("False")).toBe(true);
  });
});

describe("parseLayout", () => {
  it("accepts list/cards/calendar, defaults to calendar otherwise", () => {
    expect(parseLayout("cards")).toBe("cards");
    expect(parseLayout("calendar")).toBe("calendar");
    expect(parseLayout("list")).toBe("list");
    expect(parseLayout("grid")).toBe("calendar");
    expect(parseLayout(null)).toBe("calendar");
  });
});

describe("parseEventClick", () => {
  it("defaults to modal and accepts link/none", () => {
    expect(parseEventClick(null)).toBe("modal");
    expect(parseEventClick("modal")).toBe("modal");
    expect(parseEventClick("link")).toBe("link");
    expect(parseEventClick("none")).toBe("none");
    expect(parseEventClick("bogus")).toBe("modal");
  });
});

describe("parseSort", () => {
  it('accepts none and defaults to auto', () => {
    expect(parseSort("none")).toBe("none");
    expect(parseSort("auto")).toBe("auto");
    expect(parseSort(null)).toBe("auto");
    expect(parseSort("date")).toBe("auto");
  });
});

describe("parseEventActions", () => {
  it("defaults to the native calendar and link actions", () => {
    expect(parseEventActions(null)).toEqual([...DEFAULT_EVENT_ACTIONS]);
  });

  it("accepts none to hide native actions", () => {
    expect(parseEventActions("none")).toEqual([]);
  });

  it("keeps valid native actions in request order", () => {
    expect(parseEventActions("link, google-calendar, bogus, link")).toEqual([
      "link",
      "google-calendar",
    ]);
  });
});

describe("parseFields", () => {
  it("defaults to DEFAULT_FIELDS when absent, empty, or entirely unrecognized", () => {
    for (const value of [null, "", "bogus", "bogus,alsoBogus"]) {
      expect(parseFields(value)).toEqual(new Set(DEFAULT_FIELDS));
    }
  });

  it("is a full replacement, not a merge, for valid input", () => {
    expect(parseFields("price,tags")).toEqual(new Set(["price", "tags"]));
  });

  it("trims whitespace and drops unrecognized tokens, keeping the valid ones", () => {
    expect(parseFields(" image , bogus, price ")).toEqual(new Set(["image", "price"]));
  });

  it("dedupes repeated tokens", () => {
    expect(parseFields("tags,tags,tags")).toEqual(new Set(["tags"]));
  });
});

describe("parseDetailFields", () => {
  it("defaults to ALL_FIELDS (not DEFAULT_FIELDS) when absent, empty, or entirely unrecognized", () => {
    for (const value of [null, "", "bogus", "bogus,alsoBogus"]) {
      expect(parseDetailFields(value)).toEqual(new Set(ALL_FIELDS));
    }
  });

  it("is a full replacement, not a merge, for valid input", () => {
    expect(parseDetailFields("price,tags")).toEqual(new Set(["price", "tags"]));
  });

  it("trims whitespace and drops unrecognized tokens, keeping the valid ones", () => {
    expect(parseDetailFields(" image , bogus, price ")).toEqual(new Set(["image", "price"]));
  });

  it("accepts the new eligibility and cfp field keys", () => {
    expect(parseFields("eligibility,cfp")).toEqual(new Set(["eligibility", "cfp"]));
    expect(parseDetailFields("eligibility,cfp")).toEqual(new Set(["eligibility", "cfp"]));
  });
});

describe("parseCardWidth", () => {
  it('defaults to "220px" when absent, blank, or unrecognized', () => {
    for (const value of [null, "", "  ", "bogus"]) {
      expect(parseCardWidth(value)).toBe("220px");
    }
  });

  it("maps small/medium/large presets", () => {
    expect(parseCardWidth("small")).toBe("160px");
    expect(parseCardWidth("medium")).toBe("220px");
    expect(parseCardWidth("large")).toBe("320px");
  });

  it("passes through a raw CSS length, treating a bare number as pixels", () => {
    expect(parseCardWidth("280")).toBe("280px");
    expect(parseCardWidth("280px")).toBe("280px");
    expect(parseCardWidth("18rem")).toBe("18rem");
  });
});

describe("parseGroupEvents", () => {
  it("defaults to an empty set (no grouping) when absent, empty, or entirely unrecognized", () => {
    for (const value of [null, "", "bogus", "bogus,alsoBogus"]) {
      expect(parseGroupEvents(value)).toEqual(new Set());
      expect(parseGroupEvents(value).size).toBe(0);
    }
  });

  it("accepts series and multipart, individually or combined", () => {
    expect(parseGroupEvents("series")).toEqual(new Set(["series"]));
    expect(parseGroupEvents("multipart")).toEqual(new Set(["multipart"]));
    expect(parseGroupEvents("series,multipart")).toEqual(new Set(["series", "multipart"]));
  });

  it("trims whitespace and drops unrecognized tokens, keeping the valid ones", () => {
    expect(parseGroupEvents(" series , bogus, multipart ")).toEqual(new Set(["series", "multipart"]));
  });

  it("dedupes repeated tokens", () => {
    expect(parseGroupEvents("series,series,series")).toEqual(new Set(["series"]));
  });
});

describe("parseFeedsAttr", () => {
  it("returns an empty array when absent, empty, or only commas/whitespace", () => {
    for (const value of [null, "", ",", " , , "]) {
      expect(parseFeedsAttr(value)).toEqual([]);
    }
  });

  it("splits and trims a comma-separated list of URLs", () => {
    expect(parseFeedsAttr("https://a.org/feed.json, https://b.org/feed.json")).toEqual([
      "https://a.org/feed.json",
      "https://b.org/feed.json",
    ]);
  });

  it("drops empty tokens from stray/trailing commas but keeps the rest", () => {
    expect(parseFeedsAttr("https://a.org/feed.json,,https://b.org/feed.json,")).toEqual([
      "https://a.org/feed.json",
      "https://b.org/feed.json",
    ]);
  });

  it("returns a single-element array for one URL, same as a bare feed attribute would", () => {
    expect(parseFeedsAttr("https://a.org/feed.json")).toEqual(["https://a.org/feed.json"]);
  });
});

describe("parseMaxPerDay", () => {
  it("defaults to 3 — the library's own default is 'never collapse'", () => {
    for (const value of [null, "", "   ", "0", "-2", "many"]) {
      expect(parseMaxPerDay(value)).toBe(3);
    }
  });

  it("takes a positive integer", () => {
    expect(parseMaxPerDay("1")).toBe(1);
    expect(parseMaxPerDay(" 5 ")).toBe(5);
  });

  it("keeps the old stack-everything behaviour available", () => {
    expect(parseMaxPerDay("off")).toBe("off");
    expect(parseMaxPerDay("NONE")).toBe("off");
    expect(parseMaxPerDay("false")).toBe("off");
  });
});

describe("parseInitialDate", () => {
  it("defaults to the next event's month, including for a typo", () => {
    // Not today: landing on today is the behaviour the default exists to
    // avoid, so an unparseable value must not fall back to it.
    for (const value of [null, "", "2026-13", "2026-02-30", "soon", "2026/03"]) {
      expect(parseInitialDate(value)).toEqual({ kind: "next-event" });
    }
  });

  it("accepts today, a month, and a day", () => {
    expect(parseInitialDate("today")).toEqual({ kind: "today" });
    expect(parseInitialDate("next-event")).toEqual({ kind: "next-event" });
    expect(parseInitialDate("2026-03")).toEqual({ kind: "date", date: "2026-03-01" });
    expect(parseInitialDate("2026-03-17")).toEqual({ kind: "date", date: "2026-03-17" });
  });
});

describe("parseResponsive", () => {
  it("is on unless explicitly switched off", () => {
    expect(parseResponsive(null)).toBe(true);
    expect(parseResponsive("auto")).toBe(true);
    expect(parseResponsive("on")).toBe(true);
    expect(parseResponsive("off")).toBe(false);
    expect(parseResponsive("false")).toBe(false);
    expect(parseResponsive("none")).toBe(false);
  });
});

describe("parseCalendarAttributes", () => {
  const attributes = (map: Record<string, string>) => (name: string) => map[name] ?? null;

  it("reads the three calendar attributes together", () => {
    expect(
      parseCalendarAttributes(
        attributes({ "max-per-day": "off", "initial-date": "2026-03", responsive: "off" }),
      ),
    ).toEqual({
      maxPerDay: "off",
      initialDate: { kind: "date", date: "2026-03-01" },
      responsive: false,
    });
  });

  it("defaults to a 3-event cap, the next event's month, and the narrow fallback on", () => {
    expect(parseCalendarAttributes(() => null)).toEqual({
      maxPerDay: 3,
      initialDate: { kind: "next-event" },
      responsive: true,
    });
  });

  it("lets the month the visitor paged to outrank initial-date", () => {
    // Every re-render remounts the calendar, so without this, opening a
    // detail modal would snap the view back to `initial-date`.
    expect(
      parseCalendarAttributes(attributes({ "initial-date": "today" }), "2026-06-01").initialDate,
    ).toEqual({ kind: "date", date: "2026-06-01" });
  });
});

describe("parseMaxHeight", () => {
  it("passes through a CSS length and treats a bare number as pixels", () => {
    expect(parseMaxHeight("600px")).toBe("600px");
    expect(parseMaxHeight("40rem")).toBe("40rem");
    expect(parseMaxHeight("60vh")).toBe("60vh");
    expect(parseMaxHeight("70dvh")).toBe("70dvh");
    expect(parseMaxHeight("  500  ")).toBe("500px");
  });

  it("returns undefined for absent, off, or unparseable input", () => {
    // undefined is the pre-attribute behaviour: grow to fit the feed. An
    // unparseable value must not become a budget - a typo that silently
    // bounded the widget to something arbitrary would be worse than a typo
    // that does nothing.
    expect(parseMaxHeight(null)).toBeUndefined();
    expect(parseMaxHeight("")).toBeUndefined();
    expect(parseMaxHeight("   ")).toBeUndefined();
    expect(parseMaxHeight("none")).toBeUndefined();
    expect(parseMaxHeight("off")).toBeUndefined();
    expect(parseMaxHeight("auto")).toBeUndefined();
    expect(parseMaxHeight("potato")).toBeUndefined();
    expect(parseMaxHeight("600 px")).toBeUndefined();
  });

  it("refuses a percentage, which would claim to bound without bounding", () => {
    // A percentage max-height resolves against a containing block of auto
    // height and computes to none. Accepting it would set data-bounded -
    // turning on the scroll plumbing and the cards inset - around a widget
    // that is still exactly as tall as its feed.
    expect(parseMaxHeight("50%")).toBeUndefined();
    expect(parseMaxHeight("100%")).toBeUndefined();
  });

  it("refuses a CSS expression rather than letting it reach the stylesheet", () => {
    // The value is written into a custom property, so anything accepted here
    // lands in CSS verbatim.
    expect(parseMaxHeight("calc(100vh - 2rem)")).toBeUndefined();
    expect(parseMaxHeight("600px; background: red")).toBeUndefined();
    expect(parseMaxHeight("var(--x)")).toBeUndefined();
  });
});

describe("parseDensity", () => {
  it("accepts the two explicit densities and defaults to auto", () => {
    expect(parseDensity("compact")).toBe("compact");
    expect(parseDensity("comfortable")).toBe("comfortable");
    expect(parseDensity("  COMPACT  ")).toBe("compact");
    expect(parseDensity(null)).toBe("auto");
    expect(parseDensity("")).toBe("auto");
    // Same fall-through as `theme`: an unrecognized value is not an error.
    expect(parseDensity("cosy")).toBe("auto");
  });
});

describe("resolveCompact", () => {
  it("resolves auto from whether the host set a height budget", () => {
    // A budget is the host saying height is scarce, and at the comfortable
    // metrics one event costs ~5.8em of cell — enough that a six-week month
    // in 400px had nothing but "+N more" links.
    expect(resolveCompact("auto", true)).toBe(true);
    expect(resolveCompact("auto", false)).toBe(false);
  });

  it("lets an explicit density override the budget in both directions", () => {
    expect(resolveCompact("compact", false)).toBe(true);
    expect(resolveCompact("comfortable", true)).toBe(false);
  });
});
