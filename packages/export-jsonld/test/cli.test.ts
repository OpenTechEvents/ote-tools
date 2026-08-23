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

describe("ote-export-jsonld CLI", () => {
  it("valid feed without output path → script block on stdout, exit 0", () => {
    const io = makeIO();
    expect(runCli([fixture], io)).toBe(0);
    expect(io.errLines).toEqual([]);
    expect(io.outLines[0]).toContain('<script type="application/ld+json">');
    expect(io.outLines[0]).toContain('"@graph"');
  });

  it("--item-list emits an ItemList instead of a @graph", () => {
    const io = makeIO();
    expect(runCli(["--item-list", fixture], io)).toBe(0);
    expect(io.outLines[0]).toContain('"ItemList"');
    expect(io.outLines[0]).not.toContain('"@graph"');
  });

  it("--json emits the bare document, no script wrapper", () => {
    const io = makeIO();
    expect(runCli(["--json", fixture], io)).toBe(0);
    expect(io.outLines[0]).not.toContain("<script");
    expect(JSON.parse(io.outLines[0]!)).toHaveProperty("@graph");
  });

  it("valid feed with output path → writes the file, exit 0", () => {
    const io = makeIO();
    const out = join(mkdtempSync(join(tmpdir(), "ote-export-jsonld-")), "events.html");
    expect(runCli([fixture, out], io)).toBe(0);
    expect(readFileSync(out, "utf8")).toContain('<script type="application/ld+json">');
    expect(io.outLines[0]).toContain("7 events");
  });

  it("invalid feed → exit 1 with validation errors", () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-export-jsonld-bad-"));
    const file = join(dir, "not-a-feed.json");
    writeFileSync(file, JSON.stringify({ events: [] }), "utf8");
    expect(runCli([file], io)).toBe(1);
    expect(io.errLines[0]).toContain("not a valid OTE feed");
  });

  it("invalid JSON → exit 1", () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-export-jsonld-json-"));
    const file = join(dir, "broken.json");
    writeFileSync(file, "{ nope", "utf8");
    expect(runCli([file], io)).toBe(1);
    expect(io.errLines[0]).toContain("invalid JSON");
  });

  it("missing file → exit 2", () => {
    const io = makeIO();
    expect(runCli([join(tmpdir(), "does-not-exist.json")], io)).toBe(2);
    expect(io.errLines[0]).toContain("cannot read");
  });

  it("no arguments, extra arguments or an unknown flag → usage, exit 2", () => {
    for (const argv of [[], [fixture, "a.html", "b.html"], ["--nope", fixture]]) {
      const io = makeIO();
      expect(runCli(argv, io)).toBe(2);
      expect(io.errLines[0]).toContain("Usage: ote-export-jsonld");
    }
  });
});
