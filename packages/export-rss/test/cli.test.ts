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

describe("ote-export-rss CLI", () => {
  it("valid feed without output path → RSS on stdout, exit 0", async () => {
    const io = makeIO();
    expect(await runCli([fixture], io)).toBe(0);
    expect(io.errLines).toEqual([]);
    expect(io.outLines[0]).toContain('<rss version="2.0"');
    expect(io.outLines[0]).toContain("</rss>");
  });

  it("valid feed with output path → writes the file, exit 0", async () => {
    const io = makeIO();
    const out = join(mkdtempSync(join(tmpdir(), "ote-export-rss-")), "feed.xml");
    expect(await runCli([fixture, out], io)).toBe(0);
    expect(readFileSync(out, "utf8")).toContain('<rss version="2.0"');
    expect(io.outLines[0]).toContain("8 events");
  });

  it("invalid feed → exit 1 with validation errors", async () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-export-rss-bad-"));
    const file = join(dir, "not-a-feed.json");
    // A published specVersion, so the document really was measured — and it
    // really is broken. That is what "not a valid OTE feed" is for.
    writeFileSync(file, JSON.stringify({ specVersion: "0.6.0", events: [] }), "utf8");
    expect(await runCli([file], io)).toBe(1);
    expect(io.errLines[0]).toContain("not a valid OTE feed");
  });

  it("a version nobody published → exit 1, but not called invalid", async () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-export-rss-unknown-"));
    const file = join(dir, "feed.json");
    writeFileSync(file, JSON.stringify({ specVersion: "9.9.9", events: [] }), "utf8");
    // Still refused: mapping a document whose rules this release does not
    // have would mean inventing the mapping. But it is not a defect in the
    // feed, and the wording must not say it is (#124).
    expect(await runCli([file], io)).toBe(1);
    expect(io.errLines[0]).toContain("not checked");
    // Marked with ? rather than ✗ — the file is not a failure, the question is.
    expect(io.errLines[0]!.startsWith("?")).toBe(true);
    expect(io.errLines[0]).not.toContain("not a valid OTE feed");
  });

  it("an out-of-window feed exports, with the migration note", async () => {
    const io = makeIO();
    const feed = JSON.parse(
      readFileSync(
        fileURLToPath(
          new URL("../../validate/fixtures/versioned/feed-corunajug-0.3.0.json", import.meta.url),
        ),
        "utf8",
      ),
    );
    const dir = mkdtempSync(join(tmpdir(), "ote-export-rss-old-"));
    const file = join(dir, "feed.json");
    writeFileSync(file, JSON.stringify(feed), "utf8");
    // The regression this guards: the exporter used to refuse a healthy feed
    // on an older release and tell the publisher it was "not a valid OTE
    // feed" — measured live on a registered adopter's 0.3.0 feed (#124).
    expect(await runCli([file], io)).toBe(0);
    expect(io.errLines.join(" ")).toContain("support window");
    expect(io.errLines.join(" ")).not.toContain("not a valid OTE feed");
  });

  it("malformed JSON → exit 1 with parse message", async () => {
    const io = makeIO();
    const dir = mkdtempSync(join(tmpdir(), "ote-export-rss-json-"));
    const file = join(dir, "broken.json");
    writeFileSync(file, "{ not json", "utf8");
    expect(await runCli([file], io)).toBe(1);
    expect(io.errLines[0]).toContain("invalid JSON");
  });

  it("no arguments → exit 2 with usage", async () => {
    const io = makeIO();
    expect(await runCli([], io)).toBe(2);
    expect(io.errLines[0]).toContain("Usage:");
  });

  it("nonexistent input → exit 2", async () => {
    const io = makeIO();
    expect(await runCli(["/no/such.json"], io)).toBe(2);
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

