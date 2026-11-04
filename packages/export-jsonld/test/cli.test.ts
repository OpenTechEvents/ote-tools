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
  it("valid feed without output path → script block on stdout, exit 0", async () => {
    const io = makeIO();
    expect(await runCli([fixture], io)).toBe(0);
    expect(io.errLines).toEqual([]);
    expect(io.outLines[0]).toContain('<script type="application/ld+json">');
    expect(io.outLines[0]).toContain('"@graph"');
  });

  it("--item-list emits an ItemList instead of a @graph", async () => {
    const io = makeIO();
    expect(await runCli(["--item-list", fixture], io)).toBe(0);
    expect(io.outLines[0]).toContain('"ItemList"');
    expect(io.outLines[0]).not.toContain('"@graph"');
  });

  it("--json emits the bare document, no script wrapper", async () => {
    const io = makeIO();
    expect(await runCli(["--json", fixture], io)).toBe(0);
    expect(io.outLines[0]).not.toContain("<script");
    expect(JSON.parse(io.outLines[0]!)).toHaveProperty("@graph");
  });

  it("valid feed with output path → writes the file, exit 0", async () => {
    const io = makeIO();
    const out = join(mkdtempSync(join(tmpdir(), "ote-export-jsonld-")), "events.html");
    expect(await runCli([fixture, out], io)).toBe(0);
    expect(readFileSync(out, "utf8")).toContain('<script type="application/ld+json">');
    expect(io.outLines[0]).toContain("8 events");
  });

  it("invalid feed → exit 1 with validation errors", async () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-export-jsonld-bad-"));
    const file = join(dir, "not-a-feed.json");
    writeFileSync(file, JSON.stringify({ events: [] }), "utf8");
    expect(await runCli([file], io)).toBe(1);
    expect(io.errLines[0]).toContain("not a valid OTE feed");
  });

  it("invalid JSON → exit 1", async () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-export-jsonld-json-"));
    const file = join(dir, "broken.json");
    writeFileSync(file, "{ nope", "utf8");
    expect(await runCli([file], io)).toBe(1);
    expect(io.errLines[0]).toContain("invalid JSON");
  });

  it("missing file → exit 2", async () => {
    const io = makeIO();
    expect(await runCli([join(tmpdir(), "does-not-exist.json")], io)).toBe(2);
    expect(io.errLines[0]).toContain("cannot read");
  });

  it("no arguments, extra arguments or an unknown flag → usage, exit 2", async () => {
    for (const argv of [[], [fixture, "a.html", "b.html"], ["--nope", fixture]]) {
      const io = makeIO();
      expect(await runCli(argv, io)).toBe(2);
      expect(io.errLines[0]).toContain("Usage: ote-export-jsonld");
    }
  });
  it("accepts a feed that declares an older but supported version", async () => {
    // #69, and the bug the 0.6 pin turned from latent into live: these CLIs
    // read documents they did not write, so judging one by the newest rules
    // rejects a feed `ote-validate` calls valid. Measured against what it
    // declares, with the version note on stderr rather than as an error.
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-export-older-"));
    const file = join(dir, "feed-0.4.json");
    writeFileSync(
      file,
      JSON.stringify({
        specVersion: "0.4.0",
        title: "PyAlmería",
        license: "CC-BY-4.0",
        updatedAt: "2026-01-01T00:00:00Z",
        events: [
          {
            id: "https://pyalmeria.example/e/1",
            name: "Async",
            startDate: "2026-06-11T18:30",
            timezone: "Europe/Madrid",
            location: { venue: "Sala" },
          },
        ],
      }),
      "utf8",
    );
    expect(await runCli([file], io)).toBe(0);
    expect(io.errLines.join(" ")).toContain("supported release");
  });
});

