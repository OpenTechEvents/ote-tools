import { describe, expect, it } from "vitest";

// The served file is plain CommonJS (no build step); its pure helpers are
// exposed via module.exports for exactly this test.
import mod from "../dashboard-checks.js";

const {
  parseSemver,
  compareSemver,
  detectConfigPlaceholders,
  detectSampleEvents,
  changelogSectionsBetween,
} = mod as {
  parseSemver: (v: unknown) => number[] | null;
  compareSemver: (a: unknown, b: unknown) => number;
  detectConfigPlaceholders: (config: unknown) => string[];
  detectSampleEvents: (names: unknown) => string[];
  changelogSectionsBetween: (
    text: unknown,
    from: string,
    to: string,
  ) => { version: string; lines: string[] }[];
};

describe("parseSemver", () => {
  it("parses x.y.z with optional leading v and trailing noise", () => {
    expect(parseSemver("1.2.3")).toEqual([1, 2, 3]);
    expect(parseSemver("v2.0.1")).toEqual([2, 0, 1]);
    expect(parseSemver("  1.4.0-rc.1\n")).toEqual([1, 4, 0]);
  });

  it("returns null for non-semver input", () => {
    expect(parseSemver("")).toBeNull();
    expect(parseSemver("main")).toBeNull();
    expect(parseSemver("1.2")).toBeNull();
    expect(parseSemver(undefined)).toBeNull();
  });
});

describe("compareSemver", () => {
  it("orders versions", () => {
    expect(compareSemver("1.2.0", "1.1.9")).toBe(1);
    expect(compareSemver("1.0.0", "2.0.0")).toBe(-1);
    expect(compareSemver("1.2.3", "1.2.3")).toBe(0);
    expect(compareSemver("v1.3.0", "1.2.9")).toBe(1);
  });

  it("treats unparseable operands as equal (no false update banner)", () => {
    expect(compareSemver("garbage", "1.0.0")).toBe(0);
    expect(compareSemver("1.0.0", "")).toBe(0);
  });
});

describe("detectConfigPlaceholders", () => {
  it("flags the shipped sample title and url", () => {
    const config = {
      feed: {
        title: "Sample Tech Community Events",
        description: "Events from a sample tech community.",
        url: "https://sample-community.example",
      },
    };
    expect(detectConfigPlaceholders(config)).toEqual(["title", "url"]);
  });

  it("returns nothing for a filled-in config", () => {
    const config = {
      feed: {
        title: "PyAlmería Events",
        description: "Monthly Python meetups in Almería.",
        url: "https://pyalmeria.example",
      },
    };
    expect(detectConfigPlaceholders(config)).toEqual([]);
  });

  it("flags missing fields and survives a malformed config", () => {
    expect(detectConfigPlaceholders({ feed: {} })).toEqual([
      "title",
      "description",
      "url",
    ]);
    expect(detectConfigPlaceholders(null)).toEqual(["title", "description", "url"]);
  });
});

describe("detectSampleEvents", () => {
  it("matches shipped sample slugs, with or without .json", () => {
    expect(
      detectSampleEvents([
        "2026-09-monthly-meetup.json",
        "2026-10-my-real-event.json",
        "2026-11-lightning-talks.json",
      ]),
    ).toEqual(["2026-09-monthly-meetup", "2026-11-lightning-talks"]);
  });

  it("returns nothing when only real events remain", () => {
    expect(detectSampleEvents(["2026-10-pycon-es.json"])).toEqual([]);
    expect(detectSampleEvents(undefined)).toEqual([]);
  });
});

describe("changelogSectionsBetween", () => {
  const changelog = [
    "# Changelog",
    "",
    "## [1.3.0] - 2026-07-10",
    "- New import flow",
    "",
    "## [1.2.0] - 2026-06-01",
    "- ICS export fix",
    "",
    "## [1.1.0] - 2026-05-01",
    "- Older change",
    "",
  ].join("\n");

  it("returns only sections in (from, to]", () => {
    const sections = changelogSectionsBetween(changelog, "1.1.0", "1.3.0");
    expect(sections.map((s) => s.version)).toEqual(["1.3.0", "1.2.0"]);
    expect(sections[0].lines).toContain("- New import flow");
  });

  it("is empty when up to date and tolerant of junk", () => {
    expect(changelogSectionsBetween(changelog, "1.3.0", "1.3.0")).toEqual([]);
    expect(changelogSectionsBetween(undefined, "1.0.0", "2.0.0")).toEqual([]);
  });
});
