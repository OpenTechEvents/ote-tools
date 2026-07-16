import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runCli, type CliIO } from "../src/cli.js";

const fixturesDir = fileURLToPath(new URL("../fixtures/", import.meta.url));

function makeIO(): CliIO & { outLines: string[]; errLines: string[] } {
  const outLines: string[] = [];
  const errLines: string[] = [];
  return {
    outLines,
    errLines,
    out: (line) => outLines.push(line),
    err: (line) => errLines.push(line),
  };
}

describe("ote-validate CLI", () => {
  it("directory of valid fixtures → exit 0", () => {
    const io = makeIO();
    expect(runCli([join(fixturesDir, "valid")], io)).toBe(0);
    expect(io.errLines).toEqual([]);
    expect(io.outLines.at(-1)).toBe("6/6 valid");
  });

  it("directory of invalid fixtures → exit 1 with per-file errors", () => {
    const io = makeIO();
    expect(runCli([join(fixturesDir, "invalid")], io)).toBe(1);
    expect(io.outLines.at(-1)).toBe("0/7 valid");
    expect(io.errLines.some((l) => l.startsWith("✗"))).toBe(true);
    expect(io.errLines.some((l) => l.includes("license"))).toBe(true);
  });

  it("single valid file → exit 0, classified as event", () => {
    const io = makeIO();
    const file = join(fixturesDir, "valid", "event-minimal.json");
    expect(runCli([file], io)).toBe(0);
    expect(io.outLines[0]).toMatch(/✓ .*event-minimal\.json \(event\)/);
  });

  it("feed.json is classified as feed", () => {
    const io = makeIO();
    expect(runCli([join(fixturesDir, "valid", "feed.json")], io)).toBe(0);
    expect(io.outLines[0]).toMatch(/\(feed\)$/);
  });

  it("no arguments → exit 2 with usage", () => {
    const io = makeIO();
    expect(runCli([], io)).toBe(2);
    expect(io.errLines[0]).toContain("Usage:");
  });

  it("nonexistent path → exit 2", () => {
    const io = makeIO();
    expect(runCli(["/no/such.json"], io)).toBe(2);
  });

  it("directory without .json files → exit 2", () => {
    const io = makeIO();
    const empty = mkdtempSync(join(tmpdir(), "ote-validate-empty-"));
    expect(runCli([empty], io)).toBe(2);
    expect(io.errLines[0]).toContain("no .json files");
  });

  it("malformed JSON → exit 1 with parse message", () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-validate-bad-"));
    const file = join(dir, "broken.json");
    writeFileSync(file, "{ not json", "utf8");
    expect(runCli([file], io)).toBe(1);
    expect(io.errLines[0]).toContain("invalid JSON");
  });
});
