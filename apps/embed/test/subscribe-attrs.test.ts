import { describe, expect, it } from "vitest";

import { ALL_SHOW_TOKENS, parseConvert, parseShow, parseSubscribeLayout } from "../src/subscribe-attrs.js";

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

describe("parseConvert", () => {
  it("defaults to every format when absent or empty", () => {
    for (const value of [null, "", "   "]) {
      expect(parseConvert(value)).toEqual(new Set(["ics", "rss"]));
    }
  });

  it("treats every spelling of no as the opt-out", () => {
    // Found by an adversarial pass on the first draft, which recognized
    // only "off"/"none" and read each of the rest as an unrecognized token
    // — i.e. as "generate everything" — for a host who was plainly opting
    // out. This attribute fails closed; see parseConvert's comment.
    for (const value of ["off", "none", " OFF ", "false", "no", "0", "disabled", "never", "nope", "ical"]) {
      expect(parseConvert(value)).toEqual(new Set());
    }
  });

  it("is a full replacement, not a merge with the default", () => {
    expect(parseConvert("ics")).toEqual(new Set(["ics"]));
    expect(parseConvert("rss")).toEqual(new Set(["rss"]));
  });

  it("drops unrecognized tokens but keeps the recognized ones", () => {
    expect(parseConvert("ics,bogus")).toEqual(new Set(["ics"]));
  });

  it("keeps the recognized half of a partly-nonsense value", () => {
    expect(parseConvert("off,ics")).toEqual(new Set(["ics"]));
    expect(parseConvert("ics,,,")).toEqual(new Set(["ics"]));
  });

  // Absent and empty are the one case that still means the default: a host
  // who wrote nothing expressed no opinion, and a framework binding that
  // renders convert="" for "no value" is the same case. Anything a host
  // actually typed is taken at its word.
  it("means the default only when the attribute carries no value at all", () => {
    for (const value of [null, "", "   "]) {
      expect(parseConvert(value)).toEqual(new Set(["ics", "rss"]));
    }
    expect(parseConvert("bogus")).toEqual(new Set());
  });
});
