import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import { feedToIcs } from "@opentechevents/export-ics";
import { feedToRss } from "@opentechevents/export-rss";

import { buildFeed, type BuildProblem, type EventFileInput } from "./index.js";

export interface CliIO {
  out: (line: string) => void;
  err: (line: string) => void;
}

const USAGE = "Usage: ote-build-feed [root] [--out <dir>] [--check]";

const CONFIG_FILE = "ote.config.json";
const EVENTS_DIR = "events";

interface CliArgs {
  root: string;
  out?: string;
  check: boolean;
}

function parseArgs(argv: string[]): CliArgs | null {
  const args: CliArgs = { root: ".", check: false };
  let rootSeen = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--check") {
      args.check = true;
    } else if (arg === "--out") {
      const value = argv[++i];
      if (!value) return null;
      args.out = value;
    } else if (!arg.startsWith("-") && !rootSeen) {
      args.root = arg;
      rootSeen = true;
    } else {
      return null;
    }
  }
  return args;
}

/** Prints problems grouped by file, validate-CLI style. */
function printProblems(problems: BuildProblem[], io: CliIO): void {
  const byFile = new Map<string, BuildProblem[]>();
  for (const problem of problems) {
    const list = byFile.get(problem.file) ?? [];
    list.push(problem);
    byFile.set(problem.file, list);
  }
  for (const [file, list] of byFile) {
    io.err(`✗ ${file}`);
    for (const { path, message } of list) {
      io.err(`    ${path}: ${message}`);
    }
  }
}

/**
 * Runs the CLI: reads `<root>/events/*.json` and `<root>/ote.config.json`,
 * assembles and validates the feed, and writes feed.json, feed.ics and
 * feed.xml to the output directory (default `<root>/dist`). With `--check`
 * it validates only and writes nothing. Returns the exit code:
 * 0 = built (or check passed) · 1 = invalid input · 2 = usage or I/O error.
 */
export function runCli(
  argv: string[],
  io: CliIO = {
    out: (line) => console.log(line),
    err: (line) => console.error(line),
  },
): number {
  const args = parseArgs(argv);
  if (!args) {
    io.err(USAGE);
    return 2;
  }

  const root = resolve(args.root);

  let configRaw: string;
  try {
    configRaw = readFileSync(join(root, CONFIG_FILE), "utf8");
  } catch {
    io.err(`ote-build-feed: cannot read "${CONFIG_FILE}" in "${args.root}"`);
    return 2;
  }

  let eventNames: string[];
  try {
    eventNames = readdirSync(join(root, EVENTS_DIR))
      .filter((name) => name.endsWith(".json") && !name.startsWith("."))
      .sort();
  } catch {
    io.err(
      `ote-build-feed: cannot read "${EVENTS_DIR}/" directory in "${args.root}"`,
    );
    return 2;
  }

  // Parse errors don't stop the run: every broken file is reported at once.
  let parseFailures = 0;
  let config: unknown;
  try {
    config = JSON.parse(configRaw);
  } catch (e) {
    io.err(`✗ ${CONFIG_FILE} — invalid JSON: ${(e as Error).message}`);
    parseFailures++;
  }

  const events: EventFileInput[] = [];
  for (const name of eventNames) {
    const file = `${EVENTS_DIR}/${name}`;
    try {
      events.push({
        file,
        json: JSON.parse(readFileSync(join(root, EVENTS_DIR, name), "utf8")),
      });
    } catch (e) {
      io.err(`✗ ${file} — invalid JSON: ${(e as Error).message}`);
      parseFailures++;
    }
  }

  const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  const result = buildFeed({ config: config ?? {}, events, now });

  if (!result.ok || parseFailures > 0) {
    // A config that failed to parse already got its own line; drop the
    // follow-on problems buildFeed reports against the {} placeholder.
    const problems = result.ok
      ? []
      : result.problems.filter(
          (p) => config !== undefined || p.file !== CONFIG_FILE,
        );
    printProblems(problems, io);
    const total = parseFailures + problems.length;
    io.err(`Build failed: ${total} problem${total === 1 ? "" : "s"}`);
    return 1;
  }

  const { feed } = result;
  if (args.check) {
    io.out(`✓ ${CONFIG_FILE} and ${feed.events.length} event file${
      feed.events.length === 1 ? "" : "s"
    } valid`);
    return 0;
  }

  const outDir = resolve(args.out ?? join(root, "dist"));
  const outputs: Array<[string, string]> = [
    ["feed.json", JSON.stringify(feed, null, 2) + "\n"],
    ["feed.ics", feedToIcs(feed)],
    ["feed.xml", feedToRss(feed)],
  ];
  try {
    mkdirSync(outDir, { recursive: true });
    for (const [name, content] of outputs) {
      writeFileSync(join(outDir, name), content, "utf8");
    }
  } catch (e) {
    io.err(`ote-build-feed: cannot write to "${outDir}": ${(e as Error).message}`);
    return 2;
  }

  const shownDir = relative(process.cwd(), outDir) || ".";
  for (const [name] of outputs) {
    io.out(`✓ ${join(shownDir, name)}`);
  }
  io.out(`Feed built (${feed.events.length} events)`);
  return 0;
}
