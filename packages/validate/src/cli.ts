import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import { validateEvent, validateFeed, type ValidationResult } from "./index.js";

export interface CliIO {
  out: (line: string) => void;
  err: (line: string) => void;
}

const USAGE = "Usage: ote-validate <dir|file>";

/** Collects .json files recursively, skipping node_modules and hidden entries. */
function collectJsonFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) files.push(full);
  }
  return files.sort();
}

/** A document with an `events` array is a Feed; any other object is an Event. */
function classify(json: unknown): "feed" | "event" {
  if (
    typeof json === "object" &&
    json !== null &&
    Array.isArray((json as Record<string, unknown>).events)
  ) {
    return "feed";
  }
  return "event";
}

function validateFile(file: string, cwd: string, io: CliIO): boolean {
  const rel = relative(cwd, file) || file;
  let json: unknown;
  try {
    json = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    io.err(`✗ ${rel} — invalid JSON: ${(e as Error).message}`);
    return false;
  }
  const kind = classify(json);
  const result: ValidationResult =
    kind === "feed" ? validateFeed(json) : validateEvent(json);
  if (result.valid) {
    io.out(`✓ ${rel} (${kind})`);
    return true;
  }
  io.err(`✗ ${rel} (${kind})`);
  for (const error of result.errors) {
    io.err(`    ${error.path}: ${error.message}`);
  }
  return false;
}

/**
 * Runs the CLI. Returns the exit code:
 * 0 = all valid · 1 = some document invalid · 2 = usage or I/O error.
 */
export function runCli(
  argv: string[],
  io: CliIO = {
    out: (line) => console.log(line),
    err: (line) => console.error(line),
  },
): number {
  const [target, ...rest] = argv;
  if (!target || rest.length > 0) {
    io.err(USAGE);
    return 2;
  }

  const cwd = process.cwd();
  const path = resolve(cwd, target);
  let stats;
  try {
    stats = statSync(path);
  } catch {
    io.err(`ote-validate: cannot access "${target}"`);
    return 2;
  }

  const files = stats.isDirectory() ? collectJsonFiles(path) : [path];
  if (files.length === 0) {
    io.err(`ote-validate: no .json files found in "${target}"`);
    return 2;
  }

  let failures = 0;
  for (const file of files) {
    if (!validateFile(file, cwd, io)) failures++;
  }

  const total = files.length;
  io.out(`${total - failures}/${total} valid`);
  return failures > 0 ? 1 : 0;
}
