import { describe, expect, it } from "vitest";

import { ALL_SHOW_TOKENS, parseShow, parseSubscribeLayout } from "../src/subscribe-attrs.js";

describe("parseShow", () => {
  it("defaults to every token when absent, empty, or all-unrecognized", () => {
    for (const value of [null, "", "bogus", "bogus,also-bogus"]) {
      expect(parseShow(value)).toEqual(new Set(ALL_SHOW_TOKENS));
    }
  });

  it('returns an empty set for "none"', () => {
    expect(parseShow("none")).toEqual(new Set());
  });

  it("is a full replacement, not a merge with the default", () => {
    expect(parseShow("google,feedly")).toEqual(new Set(["google", "feedly"]));
  });

  it("trims whitespace and de-duplicates", () => {
    expect(parseShow(" google , google ,webcal")).toEqual(new Set(["google", "webcal"]));
  });

  it("drops unrecognized tokens but keeps the recognized ones", () => {
    expect(parseShow("google,bogus,webcal")).toEqual(new Set(["google", "webcal"]));
  });
});

describe("parseSubscribeLayout", () => {
  it('defaults to "menu" when absent or unrecognized', () => {
    for (const value of [null, "", "bogus"]) {
      expect(parseSubscribeLayout(value)).toBe("menu");
    }
  });

  it('recognizes "badges"', () => {
    expect(parseSubscribeLayout("badges")).toBe("badges");
  });
});
