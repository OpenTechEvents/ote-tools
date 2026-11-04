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

/**
 * The fields OTE 0.5 added to the feed, and the feed-root keywords that only
 * a whole assembled feed can break. #97 asked for both; the keywords turned
 * out to already run — `validateFeed` applies the compiled schema, custom
 * keywords included — so these tests exist to keep that true rather than to
 * make it true.
 */
describe("ote-build-feed — OTE 0.5+ feed fields", () => {
  /** A copy of the valid project whose ote.config.json gets `feed` patched. */
  function projectWith(feedExtra: Record<string, unknown>): string {
    const root = join(tempDir(), "project");
    cpSync(validProject, root, { recursive: true });
    const configPath = join(root, "ote.config.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    config.feed = { ...config.feed, ...feedExtra };
    writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
    return root;
  }

  const buildFeed = (root: string, io: CliIO): { code: number; feed: any } => {
    const out = join(tempDir(), "dist");
    const code = runCli([root, "--out", out], io);
    const path = join(out, "feed.json");
    return { code, feed: existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null };
  };

  it("carries contributing, covers and alternates into the feed", () => {
    const io = makeIO();
    const { code, feed } = buildFeed(
      projectWith({
        contributing: "https://github.com/pyalmeria/events/issues/new",
        covers: { from: "2026-01-01", to: "2026-12-31" },
        alternates: [{ mediaType: "text/calendar", url: "https://pyalmeria.example/feed.ics" }],
      }),
      io,
    );
    expect(io.errLines).toEqual([]);
    expect(code).toBe(0);
    expect(feed.contributing).toBe("https://github.com/pyalmeria/events/issues/new");
    expect(feed.covers).toEqual({ from: "2026-01-01", to: "2026-12-31" });
    expect(feed.alternates).toEqual([
      { mediaType: "text/calendar", url: "https://pyalmeria.example/feed.ics" },
    ]);
    expect(validateFeed(feed).errors).toEqual([]);
  });

  it("omitting them keeps the previous feed exactly", () => {
    // covers in particular is additive on purpose: no window means the feed
    // claims no completeness, which is what every 0.4 feed already said.
    const io = makeIO();
    const { feed } = buildFeed(projectWith({}), io);
    expect(feed.covers).toBeUndefined();
    expect(feed.alternates).toBeUndefined();
    expect(feed.contributing).toBeUndefined();
  });

  it("a covers window that runs backwards fails the build", () => {
    // orderedCoverage, a feed-root keyword: only the assembled feed can break it.
    const io = makeIO();
    const { code } = buildFeed(
      projectWith({ covers: { from: "2026-12-01", to: "2026-01-01" } }),
      io,
    );
    expect(code).toBe(1);
    expect(io.errLines.join(" ")).toContain("covers.to");
  });

  it("rejects a covers that is not an object, naming the config", () => {
    const io = makeIO();
    const { code } = buildFeed(projectWith({ covers: "2026" }), io);
    expect(code).toBe(1);
    // The file and the field are reported on two lines: "✗ ote.config.json"
    // and an indented "feed.covers: …" under it.
    expect(io.errLines.some((l) => l.includes("ote.config.json"))).toBe(true);
    expect(io.errLines.some((l) => l.includes("feed.covers: must be an object"))).toBe(true);
  });

  it("rejects an alternates that is not an array", () => {
    const io = makeIO();
    const { code } = buildFeed(projectWith({ alternates: {} }), io);
    expect(code).toBe(1);
    expect(io.errLines.some((l) => l.includes("alternates"))).toBe(true);
  });
});

describe("ote-build-feed — the feed-root keywords run in --check", () => {
  /** Writes a project whose events are given verbatim. */
  function projectOf(events: Record<string, unknown>[]): string {
    const root = join(tempDir(), "kw");
    mkdirSync(join(root, "events"), { recursive: true });
    writeFileSync(
      join(root, "ote.config.json"),
      JSON.stringify({ feed: { title: "T", license: "CC0-1.0" } }),
      "utf8",
    );
    events.forEach((event, i) =>
      writeFileSync(join(root, "events", `e${i}.json`), JSON.stringify(event), "utf8"),
    );
    return root;
  }

  const event = (id: string, extra: Record<string, unknown> = {}) => ({
    id,
    name: "E",
    startDate: "2026-06-11T18:30",
    timezone: "Europe/Madrid",
    location: { venue: "Sala" },
    ...extra,
  });

  it("catches a multi-part set whose shared offers disagree", () => {
    // D032: every part sharing a partOf.id must carry the same partOf.offers,
    // compared by value. Keeping 17 files in sync by hand is what #97 said
    // guarantees eventual drift — this is the check that makes it free.
    const io = makeIO();
    const root = projectOf([
      event("https://c.example/1", {
        partOf: { id: "https://c.example/conf", offers: [{ price: 10, currency: "EUR" }] },
      }),
      event("https://c.example/2", {
        partOf: { id: "https://c.example/conf", offers: [{ price: 99, currency: "EUR" }] },
      }),
    ]);
    expect(runCli([root, "--check"], io)).toBe(1);
    expect(io.errLines.join(" ")).toContain("multi-part");
  });

  it("accepts the same set when the shared offers match", () => {
    const io = makeIO();
    const offers = [{ price: 10, currency: "EUR" }];
    const root = projectOf([
      event("https://c.example/1", { partOf: { id: "https://c.example/conf", offers } }),
      event("https://c.example/2", { partOf: { id: "https://c.example/conf", offers } }),
    ]);
    expect(runCli([root, "--check"], io)).toBe(0);
  });

  it("catches two events sharing one id", () => {
    const io = makeIO();
    const root = projectOf([event("https://c.example/1"), event("https://c.example/1")]);
    expect(runCli([root, "--check"], io)).toBe(1);
    expect(io.errLines.join(" ")).toMatch(/same id|duplicate/i);
  });
});

