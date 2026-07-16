import { describe, expect, it } from "vitest";

import {
  parseContentLine,
  parseIcs,
  splitEscaped,
  unescapeText,
  unfold,
} from "../src/parse.js";

describe("unfold", () => {
  it("joins folded lines and tolerates LF-only input", () => {
    const crlf = "SUMMARY:Hello\r\n  world\r\nURL:x";
    expect(unfold(crlf)).toEqual(["SUMMARY:Hello world", "URL:x"]);
    const lf = "SUMMARY:Hello\n\tworld\nURL:x";
    expect(unfold(lf)).toEqual(["SUMMARY:Helloworld", "URL:x"]);
  });

  it("drops blank lines", () => {
    expect(unfold("A:1\r\n\r\nB:2\r\n")).toEqual(["A:1", "B:2"]);
  });
});

describe("unescapeText", () => {
  it("reverses RFC 5545 TEXT escaping", () => {
    expect(unescapeText("a\\, b\\; c\\nd\\Ne\\\\f")).toBe("a, b; c\nd\ne\\f");
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

describe("parseContentLine", () => {
  it("parses name, params and value", () => {
    const prop = parseContentLine("DTSTART;TZID=Europe/Madrid:20260626T190000");
    expect(prop).toEqual({
      name: "DTSTART",
      params: { TZID: "Europe/Madrid" },
      value: "20260626T190000",
    });
  });

  it("keeps colons inside quoted parameter values out of the separator scan", () => {
    const prop = parseContentLine(
      'ORGANIZER;CN="Rust Madrid: core team":mailto:x@example.com',
    );
    expect(prop?.params["CN"]).toBe("Rust Madrid: core team");
    expect(prop?.value).toBe("mailto:x@example.com");
  });

  it("unquotes and uppercases parameter names, not values", () => {
    const prop = parseContentLine('DTSTART;tzid="W. Europe Standard Time":20260915T170000');
    expect(prop?.params["TZID"]).toBe("W. Europe Standard Time");
  });

  it("returns null for non-content lines", () => {
    expect(parseContentLine("not a property line")).toBeNull();
    expect(parseContentLine(":no name")).toBeNull();
  });
});

describe("parseIcs", () => {
  it("nests components and assigns properties to the innermost", () => {
    const roots = parseIcs(
      [
        "BEGIN:VCALENDAR",
        "PRODID:-//X//X//EN",
        "BEGIN:VEVENT",
        "SUMMARY:One",
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
    expect(vevent.properties.map((p) => p.name)).toEqual(["SUMMARY"]);
    expect(vevent.components[0].name).toBe("VALARM");
  });

  it("never throws on garbage", () => {
    expect(parseIcs("")).toEqual([]);
    expect(parseIcs("random\ntext\nEND:VEVENT")).toEqual([]);
  });
});
