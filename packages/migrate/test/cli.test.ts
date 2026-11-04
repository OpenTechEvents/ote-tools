import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { LATEST_VERSION } from "@opentechevents/validate";
import { describe, expect, it } from "vitest";

import { runCli } from "../src/cli.js";

const fixturePath = (name: string): string =>
  fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));

interface Run {
  code: number;
  out: string;
  err: string;
}

async function run(...argv: string[]): Promise<Run> {
  const out: string[] = [];
  const err: string[] = [];
  const code = await runCli(argv, {
    out: (text) => out.push(text),
    err: (line) => err.push(line),
  });
  return { code, out: out.join("\n"), err: err.join("\n") };
}

/** A throwaway copy, so a test that writes never touches the fixture. */
function tempCopy(name: string): string {
  const dir = mkdtempSync(join(tmpdir(), "ote-migrate-"));
  const path = join(dir, name);
  writeFileSync(path, readFileSync(fixturePath(name), "utf8"));
  return path;
}

describe("ote-migrate CLI", () => {
  it("prints usage and exits 2 with no arguments", async () => {
    const result = await run();
    expect(result.code).toBe(2);
    expect(result.err).toMatch(/Usage: ote-migrate/);
  });

  it("lists the published versions", async () => {
    const result = await run("--versions");
    expect(result.code).toBe(0);
    expect(result.out).toMatch(/published: /);
    expect(result.out).toMatch(new RegExp(`latest: ${LATEST_VERSION}`));
  });

  it("exits 2 for a file it cannot read", async () => {
    const result = await run("no-such-file.json");
    expect(result.code).toBe(2);
    expect(result.err).toMatch(/cannot read/);
  });

  it("exits 1 for invalid JSON", async () => {
    const dir = mkdtempSync(join(tmpdir(), "ote-migrate-"));
    const path = join(dir, "bad.json");
    writeFileSync(path, "{ not json");
    const result = await run(path);
    expect(result.code).toBe(1);
    expect(result.err).toMatch(/invalid JSON/);
  });

  // The document goes to stdout and everything else to stderr, so the JSON
  // can be piped without the notes landing in it.
  it("writes the document to stdout and the note to stderr", async () => {
    const result = await run(fixturePath("feed-0.3.json"), "--to", "0.6.0");
    expect(result.code).toBe(0);
    expect(JSON.parse(result.out).specVersion).toBe("0.6.0");
    expect(result.err).toMatch(/OTE 0\.3\.0 → 0\.6\.0/);
  });

  it("writes to an output path when given one", async () => {
    const dir = mkdtempSync(join(tmpdir(), "ote-migrate-"));
    const output = join(dir, "out.json");
    const result = await run(fixturePath("feed-0.3.json"), output, "--to", "0.6.0");
    expect(result.code).toBe(0);
    expect(JSON.parse(readFileSync(output, "utf8")).specVersion).toBe("0.6.0");
  });

  it("rewrites in place with --write", async () => {
    const path = tempCopy("feed-0.3.json");
    const result = await run(path, "--write", "--to", "0.6.0");
    expect(result.code).toBe(0);
    expect(JSON.parse(readFileSync(path, "utf8")).specVersion).toBe("0.6.0");
  });

  // Two different instructions about where the output goes; guessing would
  // be a coin flip over somebody's file.
  it("refuses --write together with an output path", async () => {
    const result = await run(fixturePath("feed-0.3.json"), "out.json", "--write");
    expect(result.code).toBe(2);
  });

  it("reports the D032 warnings on stderr and still exits 0", async () => {
    const result = await run(fixturePath("feed-0.4-multipart.json"), "--to", "0.6.0");
    expect(result.code).toBe(0);
    expect(result.err).toMatch(/D032/);
    expect(result.err).toMatch(/to check by hand/);
    // A warning is a decision, not a fault: the document still migrated.
    expect(JSON.parse(result.out).specVersion).toBe("0.6.0");
  });

  it("exits 1 when the document cannot be migrated", async () => {
    const dir = mkdtempSync(join(tmpdir(), "ote-migrate-"));
    const path = join(dir, "noversion.json");
    writeFileSync(path, JSON.stringify({ title: "x", events: [] }));
    const result = await run(path);
    expect(result.code).toBe(1);
    expect(result.err).toMatch(/no usable specVersion/);
  });

  it("rejects an unknown flag", async () => {
    const result = await run(fixturePath("feed-0.3.json"), "--nope");
    expect(result.code).toBe(2);
  });
});
