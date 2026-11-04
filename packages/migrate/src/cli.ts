import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { LATEST_VERSION, PUBLISHED_VERSIONS } from "@opentechevents/validate";

import { migrateDocument, MigrationError, type DocumentKind } from "./index.js";

export interface CliIO {
  out: (text: string) => void;
  err: (line: string) => void;
}

const USAGE = [
  "Usage: ote-migrate <document.json> [output.json] [options]",
  "",
  "  --to <version>   Target spec version (default: the newest published one)",
  "  --kind <k>       feed | event (default: inferred from the document)",
  "  --write          Rewrite the input file in place",
  "  --versions       List the published versions and exit",
  "",
  "With no output path and no --write, the migrated document goes to stdout,",
  "so warnings and notes are on stderr and the JSON can be piped.",
].join("\n");

interface Args {
  input?: string;
  output?: string;
  to?: string;
  kind?: DocumentKind;
  write: boolean;
  versions: boolean;
}

/** Parses argv, or returns null when it does not make sense. */
function parseArgs(argv: string[]): Args | null {
  const args: Args = { write: false, versions: false };
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]!;
    if (arg === "--write") {
      args.write = true;
    } else if (arg === "--versions") {
      args.versions = true;
    } else if (arg === "--to") {
      const value = argv[++i];
      if (value === undefined) return null;
      args.to = value;
    } else if (arg === "--kind") {
      const value = argv[++i];
      if (value !== "feed" && value !== "event") return null;
      args.kind = value;
    } else if (arg.startsWith("-")) {
      return null;
    } else {
      positional.push(arg);
    }
  }

  if (args.versions) return args;
  if (positional.length === 0 || positional.length > 2) return null;
  args.input = positional[0];
  args.output = positional[1];
  // Writing in place and writing somewhere else are different instructions,
  // and obeying one of them silently would be a coin flip over the user's
  // file. Refuse instead.
  if (args.write && args.output !== undefined) return null;
  return args;
}

/**
 * Runs the CLI. Exit codes:
 * 0 = migrated (warnings do not change this — they are decisions, not faults)
 * 1 = cannot migrate: unplaceable version, a downgrade, or invalid input
 * 2 = usage or I/O error.
 */
export async function runCli(
  argv: string[],
  io: CliIO = {
    out: (text) => console.log(text),
    err: (line) => console.error(line),
  },
): Promise<number> {
  const args = parseArgs(argv);
  if (args === null) {
    io.err(USAGE);
    return 2;
  }
  if (args.versions) {
    io.out(`published: ${PUBLISHED_VERSIONS.join(", ")}`);
    io.out(`latest: ${LATEST_VERSION}`);
    return 0;
  }

  const input = args.input!;
  let raw: string;
  try {
    raw = readFileSync(resolve(input), "utf8");
  } catch {
    io.err(`ote-migrate: cannot read "${input}"`);
    return 2;
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    io.err(`✗ ${input} — invalid JSON: ${(e as Error).message}`);
    return 1;
  }

  let result;
  try {
    result = await migrateDocument(json, { kind: args.kind, to: args.to });
  } catch (e) {
    if (e instanceof MigrationError) {
      io.err(`✗ ${input} — ${e.message}`);
      return 1;
    }
    throw e;
  }

  // Two spaces of indent and a trailing newline: what every OTE document in
  // this ecosystem is written with, so migrating one does not show up as a
  // whole-file reformat in the publisher's next diff.
  const text = `${JSON.stringify(result.document, null, 2)}\n`;
  const destination = args.write ? input : args.output;

  if (destination !== undefined) {
    try {
      writeFileSync(resolve(destination), text, "utf8");
    } catch {
      io.err(`ote-migrate: cannot write "${destination}"`);
      return 2;
    }
    io.out(
      result.changed
        ? `✓ ${destination} — OTE ${result.from} → ${result.to}`
        : `✓ ${destination} — already OTE ${result.to}, nothing to change`,
    );
  } else {
    io.out(text.trimEnd());
    io.err(
      result.changed
        ? `✓ ${input} — OTE ${result.from} → ${result.to}`
        : `✓ ${input} — already OTE ${result.to}, nothing to change`,
    );
  }

  // On stderr even when the document went to a file: these are for the person
  // running the command, and they are the reason this is not a `sed`.
  for (const warning of result.warnings) {
    io.err("");
    io.err(`  ! ${warning.path} (${warning.decision})`);
    io.err(`    ${warning.message}`);
  }
  if (result.warnings.length > 0) {
    io.err("");
    io.err(
      `  ${result.warnings.length} thing${result.warnings.length === 1 ? "" : "s"} to check by ` +
        "hand. The document is valid either way — these are about what it means.",
    );
  }

  return 0;
}
