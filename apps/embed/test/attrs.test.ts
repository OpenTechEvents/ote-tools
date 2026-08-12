import { describe, expect, it } from "vitest";

import {
  ALL_FIELDS,
  DEFAULT_EVENT_ACTIONS,
  DEFAULT_FIELDS,
  parseCardWidth,
  parseDetailFields,
  parseEventActions,
  parseEventClick,
  parseFields,
  parseGroupEvents,
  parseLangAttr,
  parseLayout,
  parseLimit,
  parseShowPast,
  parseSort,
  resolveLang,
} from "../src/attrs.js";

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
