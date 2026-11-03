import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import {
  validateDocument,
  LATEST_VERSION,
  PUBLISHED_VERSIONS,
  SUPPORTED_VERSIONS,
  VERSIONS_WITH_RECOMMENDED,
  describeSpecVersion,
  type DocumentKind,
  type DocumentReport,
} from "./index.js";

export interface CliIO {
  out: (line: string) => void;
  err: (line: string) => void;
}

const USAGE = [
  "Usage: ote-validate <dir|file> [--spec-version <x.y.z>]",
  "       ote-validate --versions",
].join("\n");

/**
 * Why a document did not pass, kept apart because the two mean opposite
 * things to whoever reads the exit code: `invalid` is a defect in the
 * document, `unsupported` is this release being unable to judge it at all.
 * Collapsing them into one code is what made a healthy 0.5 feed read as
 * "0/18 valid" — see the module comment on runCli for the exit codes.
 */
type Outcome = "valid" | "invalid" | "unsupported";

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
function classify(json: unknown): DocumentKind {
  if (
    typeof json === "object" &&
    json !== null &&
    Array.isArray((json as Record<string, unknown>).events)
  ) {
    return "feed";
  }
  return "event";
}

/**
 * The version complaint among a report's errors, if the policy raised one.
 *
 * validateDocument puts it in `errors` alongside the schema findings, which
 * is right for a reader but wrong for an exit code: this CLI has to answer
 * "pin or defect?", so it pulls the version error back out. Identified by its
 * message, which the library builds from this very function's output — not by
 * its path, because `specVersion` is also a path a schema error can carry.
 */
function splitVersionError(report: DocumentReport): {
  versionError: string | null;
  schemaErrors: DocumentReport["errors"];
} {
  const description = report.overridden ? null : describeSpecVersion(report.verdict);
  if (description?.severity !== "error") {
    return { versionError: null, schemaErrors: report.errors };
  }
  const index = report.errors.findIndex((e) => e.message === description.message);
  if (index === -1) return { versionError: null, schemaErrors: report.errors };
  return {
    versionError: description.message,
    schemaErrors: report.errors.filter((_, i) => i !== index),
  };
}

/**
 * What a `✓` is worth: the version whose rules were applied, and a warning
 * when that version has no recommended profile to apply. A green that does
 * not say what it checked is the failure mode this line exists to prevent.
 */
function checkedAgainst(report: DocumentReport): string {
  const profile = report.recommendedProfileChecked
    ? ""
    : " — no recommended profile in this version";
  return `OTE ${report.checkedVersion}${profile}`;
}

async function validateFile(
  file: string,
  cwd: string,
  io: CliIO,
  override: string | undefined,
): Promise<Outcome> {
  const rel = relative(cwd, file) || file;
  let json: unknown;
  try {
    json = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    io.err(`✗ ${rel} — invalid JSON: ${(e as Error).message}`);
    return "invalid";
  }

  const kind = classify(json);
  const report = await validateDocument(json, { kind, version: override });
  const { versionError, schemaErrors } = splitVersionError(report);

  // A version this release cannot check against: nothing was measured, so
  // there is no verdict on the document itself to report.
  if (report.checkedVersion === null) {
    io.err(`? ${rel} (${kind}) — not checked`);
    if (versionError) io.err(`    specVersion: ${versionError}`);
    return "unsupported";
  }

  if (schemaErrors.length === 0 && versionError === null) {
    io.out(`✓ ${rel} (${kind}) — ${checkedAgainst(report)}`);
    for (const notice of report.notices) io.out(`    note: ${notice.message}`);
    return "valid";
  }

  // Out of the support window: the document *was* checked against its own
  // schemas, so any finding below is real, but migration is what a consumer
  // needs — that is a version matter, not a defect, unless there are also
  // schema errors.
  const outcome: Outcome = schemaErrors.length > 0 ? "invalid" : "unsupported";
  io.err(`✗ ${rel} (${kind}) — ${checkedAgainst(report)}`);
  if (versionError) io.err(`    specVersion: ${versionError}`);
  for (const error of schemaErrors) io.err(`    ${error.path}: ${error.message}`);
  return outcome;
}

/** `--versions`: what this release can judge, asked before submitting to it. */
function printVersions(io: CliIO): number {
  io.out(`latest:    ${LATEST_VERSION}`);
  io.out(`supported: ${SUPPORTED_VERSIONS.join(", ")}`);
  io.out(`published: ${PUBLISHED_VERSIONS.join(", ")}`);
  io.out(`recommended profile: ${VERSIONS_WITH_RECOMMENDED.join(", ")}`);
  return 0;
}

interface Args {
  target?: string;
  specVersion?: string;
  versions: boolean;
  error?: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { versions: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--versions") {
      args.versions = true;
    } else if (arg === "--spec-version") {
      const value = argv[++i];
      if (!value) return { ...args, error: "--spec-version needs a version" };
      args.specVersion = value;
    } else if (arg.startsWith("-")) {
      return { ...args, error: `unknown option "${arg}"` };
    } else if (args.target === undefined) {
      args.target = arg;
    } else {
      return { ...args, error: "one path at a time" };
    }
  }
  return args;
}

/**
 * Runs the CLI. Returns the exit code:
 *
 *   0 — every document valid.
 *   1 — a document is invalid: a real defect, measured against the version
 *       the document itself declares.
 *   2 — usage or I/O error.
 *   3 — no defect found, but a document declares a spec version this release
 *       cannot judge it against (unpublished, or outside the support window).
 *       Distinct from 1 on purpose: CI and agents need to tell a version pin
 *       from a broken feed, and 1 for both says the publisher is at fault
 *       when they are not.
 *
 * 1 wins over 3 when both occur — a real defect is the more urgent answer.
 */
export async function runCli(
  argv: string[],
  io: CliIO = {
    out: (line) => console.log(line),
    err: (line) => console.error(line),
  },
): Promise<number> {
  const args = parseArgs(argv);
  if (args.error) {
    io.err(`ote-validate: ${args.error}`);
    io.err(USAGE);
    return 2;
  }
  if (args.versions) return printVersions(io);
  if (!args.target) {
    io.err(USAGE);
    return 2;
  }

  if (
    args.specVersion !== undefined &&
    !(PUBLISHED_VERSIONS as readonly string[]).includes(args.specVersion)
  ) {
    io.err(
      `ote-validate: "${args.specVersion}" is not a published OTE Spec version ` +
        `(published: ${PUBLISHED_VERSIONS.join(", ")})`,
    );
    return 2;
  }

  const cwd = process.cwd();
  const path = resolve(cwd, args.target);
  let stats;
  try {
    stats = statSync(path);
  } catch {
    io.err(`ote-validate: cannot access "${args.target}"`);
    return 2;
  }

  const files = stats.isDirectory() ? collectJsonFiles(path) : [path];
  if (files.length === 0) {
    io.err(`ote-validate: no .json files found in "${args.target}"`);
    return 2;
  }

  let invalid = 0;
  let unsupported = 0;
  for (const file of files) {
    const outcome = await validateFile(file, cwd, io, args.specVersion);
    if (outcome === "invalid") invalid++;
    else if (outcome === "unsupported") unsupported++;
  }

  const total = files.length;
  io.out(`${total - invalid - unsupported}/${total} valid`);
  if (unsupported > 0) {
    io.out(
      `${unsupported}/${total} not judged: a spec version this release cannot ` +
        `check against (supported: ${SUPPORTED_VERSIONS.join(", ")})`,
    );
  }

  if (invalid > 0) return 1;
  return unsupported > 0 ? 3 : 0;
}
