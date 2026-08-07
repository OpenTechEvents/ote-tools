import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { validateFeed } from "@opentechevents/validate";
import { describe, expect, it } from "vitest";

import { runCli, type CliIO } from "../src/cli.js";

const validProject = fileURLToPath(new URL("../fixtures/valid", import.meta.url));
const invalidProject = fileURLToPath(
  new URL("../fixtures/invalid", import.meta.url),
);

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

const tempDir = () => mkdtempSync(join(tmpdir(), "ote-build-feed-"));

describe("ote-build-feed CLI", () => {
  it("valid project → writes feed.json, feed.ics and feed.xml, exit 0", () => {
    const io = makeIO();
    const out = join(tempDir(), "dist");
    expect(runCli([validProject, "--out", out], io)).toBe(0);
    expect(io.errLines).toEqual([]);

    const feed = JSON.parse(readFileSync(join(out, "feed.json"), "utf8"));
    expect(validateFeed(feed).errors).toEqual([]);
    expect(feed.title).toBe("PyAlmería Events");
    expect(feed.events).toHaveLength(3);
    // Sorted by startDate: 0-devfest.json sorts first by name but is last by date.
    expect(feed.events.at(-1).name).toBe("DevFest Almería 2026");

    expect(readFileSync(join(out, "feed.ics"), "utf8")).toContain("BEGIN:VCALENDAR");
    expect(readFileSync(join(out, "feed.xml"), "utf8")).toContain('<rss version="2.0"');
    expect(io.outLines.at(-1)).toContain("3 events");
  });

  it("--check validates without writing anything", () => {
    const io = makeIO();
    const out = join(tempDir(), "dist");
    expect(runCli([validProject, "--check", "--out", out], io)).toBe(0);
    expect(existsSync(out)).toBe(false);
    expect(existsSync(join(validProject, "dist"))).toBe(false);
    expect(io.outLines[0]).toContain("3 event files valid");
  });

  it("invalid project → exit 1, problems name file and field", () => {
    const io = makeIO();
    expect(runCli([invalidProject, "--check"], io)).toBe(1);
    const err = io.errLines.join("\n");
    expect(err).toContain("✗ ote.config.json");
    expect(err).toContain("feed.licenseUrl:");
    expect(err).toContain("✗ events/bad-offset.json");
    expect(err).toContain("startDate:");
    // The fixture's config has no feed.license, and neither event declares
    // its own — D029 fails the build for both, since there's no license to
    // fall back to for either of them.
    expect(err).toContain('"license"');
    expect(err).toContain("✗ events/missing-name.json");
    expect(err).toContain('"name"');
    expect(io.errLines.at(-1)).toMatch(/^Build failed: \d+ problems$/);
  });

  it("malformed JSON in an event file → reported with the file, exit 1", () => {
    const io = makeIO();
    const root = tempDir();
    cpSync(validProject, root, { recursive: true });
    writeFileSync(join(root, "events", "broken.json"), "{ nope", "utf8");
    expect(runCli([root, "--check"], io)).toBe(1);
    expect(io.errLines[0]).toContain("events/broken.json");
    expect(io.errLines[0]).toContain("invalid JSON");
  });

  it("malformed ote.config.json → single parse error, no follow-on noise", () => {
    const io = makeIO();
    const root = tempDir();
    cpSync(validProject, root, { recursive: true });
    writeFileSync(join(root, "ote.config.json"), "{ nope", "utf8");
    expect(runCli([root, "--check"], io)).toBe(1);
    expect(io.errLines[0]).toContain("ote.config.json — invalid JSON");
    expect(io.errLines.at(-1)).toBe("Build failed: 1 problem");
  });

  it("missing ote.config.json → exit 2", () => {
    const io = makeIO();
    const root = tempDir();
    mkdirSync(join(root, "events"));
    expect(runCli([root], io)).toBe(2);
    expect(io.errLines[0]).toContain("ote.config.json");
  });

  it("missing events/ directory with an otherwise-invalid config → still exit 2 on the config, not the directory", () => {
    // Config alone ({}) is missing the required "title" — this asserts the
    // events/ fix didn't paper over that separate, real error.
    const io = makeIO();
    const root = tempDir();
    writeFileSync(join(root, "ote.config.json"), "{}", "utf8");
    expect(runCli([root, "--check"], io)).toBe(1);
    expect(io.errLines.join("\n")).not.toContain('"events/"');
  });

  it("missing events/ directory + valid config → builds a zero-event feed, exit 0 (issue #23)", () => {
    // Git doesn't track empty directories, so this is exactly what happens
    // once an organizer deletes the last sample event before adding their
    // own — should be indistinguishable from an events/ that exists and is
    // empty, not a fatal I/O error.
    const io = makeIO();
    const root = tempDir();
    writeFileSync(
      join(root, "ote.config.json"),
      JSON.stringify({ feed: { title: "Empty Feed" } }),
      "utf8",
    );
    expect(runCli([root, "--check"], io)).toBe(0);
    expect(io.errLines).toEqual([]);
    expect(io.outLines[0]).toContain("0 event files valid");
  });

  it("events/ existing as a plain file (not a directory) → still a fatal I/O error, exit 2", () => {
    const io = makeIO();
    const root = tempDir();
    writeFileSync(join(root, "ote.config.json"), "{}", "utf8");
    writeFileSync(join(root, "events"), "not a directory", "utf8");
    expect(runCli([root], io)).toBe(2);
    expect(io.errLines[0]).toContain('"events/"');
  });

  it("unknown flag → exit 2 with usage", () => {
    const io = makeIO();
    expect(runCli(["--nope"], io)).toBe(2);
    expect(io.errLines[0]).toContain("Usage:");
  });
});
