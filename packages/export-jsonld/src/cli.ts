import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { validateFeed } from "@opentechevents/validate";

import { feedToItemList, feedToJsonLd, toJsonLdScript } from "./index.js";
import type { OteFeed } from "./types.js";

export interface CliIO {
  out: (text: string) => void;
  err: (line: string) => void;
}

const USAGE =
  "Usage: ote-export-jsonld [--item-list] [--json] <feed.json> [output.html]";

/**
 * Runs the CLI: reads a feed JSON file, validates it, and writes the JSON-LD
 * to the given output path (or stdout when omitted). Returns the exit code:
 * 0 = exported · 1 = invalid JSON or invalid feed · 2 = usage or I/O error.
 *
 * `--item-list` emits a schema.org ItemList (for a listing page) instead of
 * a `@graph` of events. `--json` emits the bare JSON-LD document instead of
 * a pasteable `<script type="application/ld+json">` block.
 */
export function runCli(
  argv: string[],
  io: CliIO = {
    out: (text) => console.log(text),
    err: (line) => console.error(line),
  },
): number {
  const itemList = argv.includes("--item-list");
  const bare = argv.includes("--json");
  const positional = argv.filter((arg) => !arg.startsWith("--"));
  const unknownFlag = argv.find(
    (arg) => arg.startsWith("--") && arg !== "--item-list" && arg !== "--json",
  );
  const [input, output, ...rest] = positional;
  if (!input || rest.length > 0 || unknownFlag) {
    io.err(USAGE);
    return 2;
  }

  let raw: string;
  try {
    raw = readFileSync(resolve(input), "utf8");
  } catch {
    io.err(`ote-export-jsonld: cannot read "${input}"`);
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
  const document = itemList ? feedToItemList(feed) : feedToJsonLd(feed);
  const text = bare ? JSON.stringify(document, null, 2) : toJsonLdScript(document);
  if (output) {
    try {
      writeFileSync(resolve(output), text + "\n", "utf8");
    } catch {
      io.err(`ote-export-jsonld: cannot write "${output}"`);
      return 2;
    }
    io.out(`✓ ${output} (${feed.events.length} events)`);
  } else {
    io.out(text);
  }
  return 0;
}
