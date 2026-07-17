import { describe, expect, it } from "vitest";

import { parseIcs, splitEscaped, unescapeText } from "../src/parse.js";

describe("unescapeText", () => {
  it("reverses RFC 5545 TEXT escaping and leaves parsed text unchanged", () => {
    expect(unescapeText("a\\, b\\; c\\nd\\Ne\\\\f")).toBe("a, b; c\nd\ne\\f");
    expect(unescapeText("already parsed")).toBe("already parsed");
  });
});

describe("splitEscaped", () => {
  it("splits on unescaped separators only", () => {
    expect(splitEscaped("gdg,devfest\\, community", ",")).toEqual([
      "gdg",
      "devfest\\, community",
    ]);
  });
});

describe("parseIcs", () => {
  it("adapts ical.js components and properties to the importer model", () => {
    const roots = parseIcs(
      [
        "BEGIN:VCALENDAR",
        "PRODID:-//X//X//EN",
        "BEGIN:VEVENT",
        "SUMMARY:Hello\\, world",
        "DTSTART;TZID=Europe/Madrid:20260626T190000",
        "GEO:40.4;-3.7",
        "CATEGORIES:gdg,devfest\\, community",
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n"),
    );

    expect(roots).toHaveLength(1);
    const calendar = roots[0];
    expect(calendar.name).toBe("VCALENDAR");
    expect(calendar.properties.map((p) => p.name)).toEqual(["PRODID"]);

    const vevent = calendar.components[0];
    expect(vevent.name).toBe("VEVENT");
    expect(vevent.components[0].name).toBe("VALARM");
    expect(vevent.properties.find((p) => p.name === "SUMMARY")?.value).toBe(
      "Hello, world",
    );
    expect(vevent.properties.find((p) => p.name === "DTSTART")).toMatchObject({
      params: { TZID: "Europe/Madrid" },
      value: "2026-06-26T19:00:00",
    });
    expect(vevent.properties.find((p) => p.name === "GEO")?.value).toBe(
      "40.4;-3.7",
    );
    expect(vevent.properties.find((p) => p.name === "CATEGORIES")?.values).toEqual(
      ["gdg", "devfest, community"],
    );
  });

  it("returns [] on malformed input", () => {
    expect(parseIcs("")).toEqual([]);
    expect(parseIcs("random\ntext\nEND:VEVENT")).toEqual([]);
  });
});
