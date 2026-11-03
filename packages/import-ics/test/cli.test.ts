import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runCli, type CliIO } from "../src/cli.js";

const calendar = fileURLToPath(
  new URL("../fixtures/google-calendar.ics", import.meta.url),
);
const meetup = fileURLToPath(new URL("../fixtures/meetup.ics", import.meta.url));

function makeIO(): CliIO & { outLines: string[]; errLines: string[] } {
  const outLines: string[] = [];
  const errLines: string[] = [];
  return {
    outLines,
    errLines,
    out: (text) => outLines.push(text),
    err: (line) => errLines.push(line),
  };
}

function parse(io: { outLines: string[] }) {
  return JSON.parse(io.outLines.join("\n"));
}

describe("ote-import-ics CLI", () => {
  it("a calendar with VEVENTs → events + warnings as JSON, exit 0", () => {
    const io = makeIO();
    expect(runCli([calendar], io)).toBe(0);
    expect(io.errLines).toEqual([]);
    const result = parse(io);
    expect(result.events.length).toBeGreaterThan(0);
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it("the events stay partial — the CLI completes nothing", () => {
    const io = makeIO();
    runCli([meetup], io);
    expect(parse(io).events[0].license).toBeUndefined();
  });

  it("not a calendar at all → exit 1, nothing converted", () => {
    const io = makeIO();
    expect(runCli(["-"], io, () => "this is not a calendar")).toBe(1);
    expect(parse(io).events).toEqual([]);
  });

  it("reads the calendar from stdin with -", () => {
    const io = makeIO();
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "UID:x@example",
      "DTSTART:20260312T180000Z",
      "SUMMARY:Rust meetup",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    expect(runCli(["-"], io, () => ics)).toBe(0);
    expect(parse(io).events[0].name).toBe("Rust meetup");
  });

  it("--public is opt-in: without it no organizer email is imported", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "UID:x@example",
      "DTSTART:20260312T180000Z",
      "SUMMARY:Rust meetup",
      'ORGANIZER;CN="Rust Madrid":mailto:hola@rustmadrid.example',
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const closed = makeIO();
    runCli(["-"], closed, () => ics);
    expect(parse(closed).events[0].organizers?.[0].email).toBeUndefined();

    const open = makeIO();
    runCli(["--public", "-"], open, () => ics);
    expect(parse(open).events[0].organizers?.[0].email).toBe(
      "hola@rustmadrid.example",
    );
  });

  it("--tz fills the timezone an all-day event cannot carry", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "UID:x@example",
      "DTSTART;VALUE=DATE:20260312",
      "SUMMARY:Hack day",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const io = makeIO();
    expect(runCli(["--tz", "Europe/Madrid", "-"], io, () => ics)).toBe(0);
    expect(parse(io).events[0].timezone).toBe("Europe/Madrid");
  });

  it("no input, an unknown flag, or --tz with no zone → usage, exit 2", () => {
    for (const argv of [[], ["--nope", calendar], ["--tz"], ["--tz", "--public"]]) {
      const io = makeIO();
      expect(runCli(argv, io)).toBe(2);
      expect(io.errLines[0]).toContain("Usage: ote-import-ics");
    }
  });

  it("an unreadable path → exit 2, no JSON on stdout", () => {
    const io = makeIO();
    expect(runCli(["/nope/missing.ics"], io)).toBe(2);
    expect(io.outLines).toEqual([]);
  });
});
