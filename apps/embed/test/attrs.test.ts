import { describe, expect, it } from "vitest";

import {
  DEFAULT_EVENT_ACTIONS,
  DEFAULT_FIELDS,
  parseEventActions,
  parseEventClick,
  parseFields,
  parseLangAttr,
  parseLayout,
  parseLimit,
  parseShowPast,
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
