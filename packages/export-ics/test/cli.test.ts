import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runCli, type CliIO } from "../src/cli.js";

const fixture = fileURLToPath(new URL("../fixtures/feed.json", import.meta.url));

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

describe("ote-export-ics CLI", () => {
  it("valid feed without output path → ICS on stdout, exit 0", () => {
    const io = makeIO();
    expect(runCli([fixture], io)).toBe(0);
    expect(io.errLines).toEqual([]);
    expect(io.outLines[0]).toContain("BEGIN:VCALENDAR");
    expect(io.outLines[0]).toContain("END:VCALENDAR");
  });

  it("valid feed with output path → writes the file, exit 0", () => {
    const io = makeIO();
    const out = join(mkdtempSync(join(tmpdir(), "ote-export-ics-")), "feed.ics");
    expect(runCli([fixture, out], io)).toBe(0);
    expect(readFileSync(out, "utf8")).toContain("BEGIN:VCALENDAR");
    expect(io.outLines[0]).toContain("5 events");
  });

  it("invalid feed → exit 1 with validation errors", () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-export-ics-bad-"));
    const file = join(dir, "not-a-feed.json");
    writeFileSync(file, JSON.stringify({ events: [] }), "utf8");
    expect(runCli([file], io)).toBe(1);
    expect(io.errLines[0]).toContain("not a valid OTE feed");
  });

  it("malformed JSON → exit 1 with parse message", () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-export-ics-json-"));
    const file = join(dir, "broken.json");
    writeFileSync(file, "{ not json", "utf8");
    expect(runCli([file], io)).toBe(1);
    expect(io.errLines[0]).toContain("invalid JSON");
  });

  it("no arguments → exit 2 with usage", () => {
    const io = makeIO();
    expect(runCli([], io)).toBe(2);
    expect(io.errLines[0]).toContain("Usage:");
  });

  it("nonexistent input → exit 2", () => {
    const io = makeIO();
    expect(runCli(["/no/such.json"], io)).toBe(2);
  });
});
