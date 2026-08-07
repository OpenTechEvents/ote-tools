import { describe, expect, it } from "vitest";

import {
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
  it("accepts cards, defaults to list otherwise", () => {
    expect(parseLayout("cards")).toBe("cards");
    expect(parseLayout("list")).toBe("list");
    expect(parseLayout("grid")).toBe("list");
    expect(parseLayout(null)).toBe("list");
  });
});
