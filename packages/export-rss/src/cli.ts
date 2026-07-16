import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { validateFeed } from "@opentechevents/validate";

import { feedToRss } from "./index.js";
import type { OteFeed } from "./types.js";

export interface CliIO {
  out: (text: string) => void;
  err: (line: string) => void;
}

const USAGE = "Usage: ote-export-rss <feed.json> [output.xml]";

/**
 * Runs the CLI: reads a feed JSON file, validates it, and writes the RSS to
 * the given output path (or stdout when omitted). Returns the exit code:
 * 0 = exported · 1 = invalid JSON or invalid feed · 2 = usage or I/O error.
 */
export function runCli(
  argv: string[],
  io: CliIO = {
    out: (text) => console.log(text),
    err: (line) => console.error(line),
  },
): number {
  const [input, output, ...rest] = argv;
  if (!input || rest.length > 0) {
    io.err(USAGE);
    return 2;
  }

  let raw: string;
  try {
    raw = readFileSync(resolve(input), "utf8");
  } catch {
    io.err(`ote-export-rss: cannot read "${input}"`);
    return 2;
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    io.err(`✗ ${input} — invalid JSON: ${(e as Error).message}`);
    return 1;
  }

  const result = validateFeed(json);
  if (!result.valid) {
    io.err(`✗ ${input} — not a valid OTE feed`);
    for (const error of result.errors) {
      io.err(`    ${error.path}: ${error.message}`);
    }
    return 1;
  }

  const feed = json as OteFeed;
  const rss = feedToRss(feed);
  if (output) {
    try {
      writeFileSync(resolve(output), rss, "utf8");
    } catch {
      io.err(`ote-export-rss: cannot write "${output}"`);
      return 2;
    }
    io.out(`✓ ${output} (${feed.events.length} events)`);
  } else {
    io.out(rss);
  }
  return 0;
}
