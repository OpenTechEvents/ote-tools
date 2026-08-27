import { describe, expect, it } from "vitest";

import { looksMinified, reformatJson, READABLE_LINE_LENGTH } from "../src/lib/format.js";
import { excerptAt } from "../src/lib/locate.js";
import { buildReport } from "../src/lib/report.js";

/** A feed whose one event has an unparseable startDate, on a single line. */
const MINIFIED = JSON.stringify({
  specVersion: "0.3.0",
  title: "Comunidad",
  description: "Una comunidad que publica su feed minificado, como casi todas.",
  url: "https://comunidad.example",
  license: "CC0-1.0",
  organizers: [{ name: "Comunidad", url: "https://comunidad.example" }],
  updatedAt: "2026-07-06T10:00:00Z",
  events: [
    {
      id: "https://comunidad.example/e/1",
      url: "https://comunidad.example/e/1",
      name: "Meetup",
      description: "Un evento cualquiera, con texto suficiente para pasar de cuatrocientos caracteres en una sola línea, que es justo lo que hace ilegible un documento minificado.",
      startDate: "ayer por la tarde",
      timezone: "Europe/Madrid",
      attendanceMode: "in-person",
      location: { venue: "El Cable" },
      updatedAt: "2026-05-28T11:00:00Z",
    },
  ],
});

describe("looksMinified", () => {
  it("is true for one long line, false for an indented document", () => {
    expect(looksMinified(MINIFIED)).toBe(true);
    expect(looksMinified(JSON.stringify(JSON.parse(MINIFIED), null, 2))).toBe(false);
  });

  it("does not call a short document minified just because it has one line", () => {
    expect(looksMinified('{"specVersion":"0.3.0","events":[]}')).toBe(false);
  });

  it("draws the line where a human stops being able to read one", () => {
    expect(looksMinified("x".repeat(READABLE_LINE_LENGTH))).toBe(false);
    expect(looksMinified("x".repeat(READABLE_LINE_LENGTH + 1))).toBe(true);
  });
});

describe("reformatJson", () => {
  it("indents without changing the value", () => {
    const formatted = reformatJson(MINIFIED);
    expect(formatted).not.toBeNull();
    expect(JSON.parse(formatted!)).toEqual(JSON.parse(MINIFIED));
    expect(looksMinified(formatted!)).toBe(false);
  });

  it("refuses a document that does not parse — those bytes are the evidence", () => {
    expect(reformatJson('{"specVersion":"0.3.0",}')).toBeNull();
  });
});

describe("what this buys the reader", () => {
  it("turns 'line 1, column far away' into a line worth clicking", () => {
    const flat = buildReport(MINIFIED);
    const indented = buildReport(reformatJson(MINIFIED)!);

    // Same verdict either way: reformatting cannot change what is valid.
    expect(flat).toMatchObject({ status: "validated", valid: false });
    expect(indented).toMatchObject({ status: "validated", valid: false });

    const flatFinding = (flat as { errors: { position: { line: number } | null }[] }).errors[0];
    const indentedFinding = (indented as { errors: { position: { line: number } | null }[] })
      .errors[0];

    expect(flatFinding.position?.line).toBe(1);
    expect(indentedFinding.position?.line).toBeGreaterThan(1);
  });
});

describe("excerptAt", () => {
  it("cuts a window around the offset and marks the character", () => {
    const source = `${"a".repeat(100)}X${"b".repeat(100)}`;
    const { text, caret } = excerptAt(source, 100, 10);
    expect(text).toBe(`…${"a".repeat(10)}X${"b".repeat(10)}…`);
    expect(text[caret]).toBe("X");
  });

  it("keeps the caret aligned by flattening newlines and tabs", () => {
    const { text, caret } = excerptAt('{\n\t"a": 1,\n}', 10, 6);
    expect(text).not.toContain("\n");
    expect(text).not.toContain("\t");
    expect(text.length).toBeGreaterThan(caret);
  });

  it("marks both ends only when there is more document out there", () => {
    expect(excerptAt("short", 2, 50).text).toBe("short");
  });
});
