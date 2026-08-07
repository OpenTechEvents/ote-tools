import { describe, expect, it } from "vitest";

import {
  DEFAULT_FIELDS,
  parseFields,
  parseLangAttr,
  parseLayout,
  parseLimit,
  parseShowPast,
  resolveLang,
} from "../src/attrs.js";

describe("parseLimit", () => {
  it("defaults to 6 when absent, blank, non-numeric, zero, or negative", () => {
    for (const value of [null, "", "abc", "0", "-3"]) {
      expect(parseLimit(value)).toBe(6);
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
  it("is true only for the literal string \"true\"", () => {
    expect(parseShowPast("true")).toBe(true);
    expect(parseShowPast("True")).toBe(false);
    expect(parseShowPast("1")).toBe(false);
    expect(parseShowPast(null)).toBe(false);
    expect(parseShowPast("")).toBe(false);
  });
});

describe("parseLayout", () => {
  it("accepts cards and calendar, defaults to list otherwise", () => {
    expect(parseLayout("cards")).toBe("cards");
    expect(parseLayout("calendar")).toBe("calendar");
    expect(parseLayout("list")).toBe("list");
    expect(parseLayout("grid")).toBe("list");
    expect(parseLayout(null)).toBe("list");
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
