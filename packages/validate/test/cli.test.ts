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
  it("directory of valid fixtures → exit 0", async () => {
    const io = makeIO();
    expect(await runCli([join(fixturesDir, "valid")], io)).toBe(0);
    expect(io.errLines).toEqual([]);
    expect(io.outLines.at(-1)).toBe("17/17 valid");
  });

  it("directory of invalid fixtures → exit 1 with per-file errors", async () => {
    const io = makeIO();
    expect(await runCli([join(fixturesDir, "invalid")], io)).toBe(1);
    expect(io.outLines).toContain("0/87 valid");
    expect(io.errLines.some((l) => l.startsWith("✗"))).toBe(true);
    expect(io.errLines.some((l) => l.includes("license"))).toBe(true);
    // One of the 87 (event-future-specversion.json, 0.9.0) is not a defect
    // but a version this release cannot judge, and the summary says so
    // separately. The run still exits 1: the other 86 are real defects.
    expect(io.outLines.at(-1)).toContain("1/87 not judged");
  });

  it("single valid file → exit 0, classified as event", async () => {
    const io = makeIO();
    const file = join(fixturesDir, "valid", "event-minimal.json");
    expect(await runCli([file], io)).toBe(0);
    expect(io.outLines[0]).toMatch(/✓ .*event-minimal\.json \(event\) — OTE 0\.4\.0/);
  });

  it("feed.json is classified as feed", async () => {
    const io = makeIO();
    expect(await runCli([join(fixturesDir, "valid", "feed.json")], io)).toBe(0);
    expect(io.outLines[0]).toMatch(/\(feed\) — OTE 0\.4\.0/);
  });

  it("no arguments → exit 2 with usage", async () => {
    const io = makeIO();
    expect(await runCli([], io)).toBe(2);
    expect(io.errLines[0]).toContain("Usage:");
  });

  it("nonexistent path → exit 2", async () => {
    const io = makeIO();
    expect(await runCli(["/no/such.json"], io)).toBe(2);
  });

  it("directory without .json files → exit 2", async () => {
    const io = makeIO();
    const empty = mkdtempSync(join(tmpdir(), "ote-validate-empty-"));
    expect(await runCli([empty], io)).toBe(2);
    expect(io.errLines[0]).toContain("no .json files");
  });

  it("malformed JSON → exit 1 with parse message", async () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-validate-bad-"));
    const file = join(dir, "broken.json");
    writeFileSync(file, "{ not json", "utf8");
    expect(await runCli([file], io)).toBe(1);
    expect(io.errLines[0]).toContain("invalid JSON");
  });
  it("a version this release cannot judge → exit 3, not 1", async () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-validate-future-"));
    const file = join(dir, "future.json");
    // 0.5.0 is a real spec version, published on the website but not yet in
    // the pinned @opentechevents/schema — exactly the case that reported
    // "0/18 valid" on documents that were fine.
    writeFileSync(file, JSON.stringify({ specVersion: "0.5.0", name: "x" }), "utf8");
    expect(await runCli([file], io)).toBe(3);
    expect(io.errLines[0]).toMatch(/^\? .*future\.json \(event\) — not checked/);
    expect(io.errLines.some((l) => l.includes("not a published OTE Spec version"))).toBe(true);
    expect(io.outLines).toContain("0/1 valid");
    expect(io.outLines.some((l) => l.includes("not judged"))).toBe(true);
  });

  it("a real defect outranks an unjudgeable version → exit 1", async () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-validate-mixed-"));
    writeFileSync(
      join(dir, "future.json"),
      JSON.stringify({ specVersion: "0.5.0", name: "x" }),
      "utf8",
    );
    writeFileSync(join(dir, "broken.json"), JSON.stringify({ specVersion: "0.4.0" }), "utf8");
    expect(await runCli([dir], io)).toBe(1);
  });

  it("--versions reports what this release can judge", async () => {
    const io = makeIO();
    expect(await runCli(["--versions"], io)).toBe(0);
    expect(io.outLines.some((l) => l.startsWith("latest:"))).toBe(true);
    expect(io.outLines.some((l) => l.startsWith("supported:"))).toBe(true);
    expect(io.errLines).toEqual([]);
  });

  it("--spec-version rehearses a migration against another version", async () => {
    const io = makeIO();
    const file = join(fixturesDir, "valid", "event-minimal.json");
    // A 0.4.0 document measured against 0.3.0: the point is that it is
    // measured against what was asked for, so specVersion itself is a finding.
    expect(await runCli([file, "--spec-version", "0.3.0"], io)).toBe(1);
    expect(io.errLines.some((l) => l.includes("specVersion"))).toBe(true);
  });

  it("--spec-version with an unpublished version → exit 2", async () => {
    const io = makeIO();
    expect(await runCli([join(fixturesDir, "valid"), "--spec-version", "9.9.9"], io)).toBe(2);
    expect(io.errLines[0]).toContain("not a published OTE Spec version");
  });

  it("unknown option → exit 2 with usage", async () => {
    const io = makeIO();
    expect(await runCli(["--nope"], io)).toBe(2);
    expect(io.errLines[0]).toContain('unknown option "--nope"');
  });

  it("a passing document says which version produced the ✓", async () => {
    const io = makeIO();
    const file = join(fixturesDir, "valid", "event-minimal.json");
    expect(await runCli([file], io)).toBe(0);
    // A green that does not name the rules it applied is the failure mode
    // this assertion guards: it is what let nine skipped keywords read as 18/18.
    expect(io.outLines[0]).toContain("OTE 0.4.0");
  });
});
