import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runCli, type CliIO } from "../src/cli.js";

const meetup = fileURLToPath(new URL("../fixtures/meetup.html", import.meta.url));
const noJsonLd = fileURLToPath(new URL("../fixtures/no-jsonld.html", import.meta.url));

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

describe("ote-import-jsonld CLI", () => {
  it("a page with an Event → events + warnings as JSON on stdout, exit 0", () => {
    const io = makeIO();
    expect(runCli([meetup], io)).toBe(0);
    expect(io.errLines).toEqual([]);
    const result = JSON.parse(io.outLines.join("\n"));
    expect(result.events.length).toBeGreaterThan(0);
    expect(result.events[0].name).toBeTruthy();
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it("the events stay partial — the CLI completes nothing", () => {
    const io = makeIO();
    runCli([meetup], io);
    const result = JSON.parse(io.outLines.join("\n"));
    expect(result.events[0].id).toBeUndefined();
    expect(result.events[0].license).toBeUndefined();
  });

  it("a page with no Event → exit 1, and the warning says so", () => {
    const io = makeIO();
    expect(runCli([noJsonLd], io)).toBe(1);
    const result = JSON.parse(io.outLines.join("\n"));
    expect(result.events).toEqual([]);
    expect(result.warnings[0].message).toContain("no schema.org Event");
  });

  it("reads the page from stdin with -", () => {
    const io = makeIO();
    const html = '<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-03-12T19:00:00+01:00"}</script>';
    expect(runCli(["-"], io, () => html)).toBe(0);
    expect(JSON.parse(io.outLines.join("\n")).events[0].name).toBe("X");
  });

  it("--tz fills the timezone an all-day event cannot carry", () => {
    const io = makeIO();
    const html = '<script type="application/ld+json">{"@type":"Event","name":"X","startDate":"2026-03-12"}</script>';
    expect(runCli(["--tz", "Europe/Madrid", "-"], io, () => html)).toBe(0);
    expect(JSON.parse(io.outLines.join("\n")).events[0].timezone).toBe("Europe/Madrid");
  });

  it("no input, an unknown flag, or --tz with no zone → usage, exit 2", () => {
    for (const argv of [[], ["--nope", meetup], ["--tz"], ["--tz", "--json"]]) {
      const io = makeIO();
      expect(runCli(argv, io)).toBe(2);
      expect(io.errLines[0]).toContain("Usage: ote-import-jsonld");
    }
  });

  it("an unreadable path → exit 2, no JSON on stdout", () => {
    const io = makeIO();
    expect(runCli(["/nope/missing.html"], io)).toBe(2);
    expect(io.outLines).toEqual([]);
  });
});
