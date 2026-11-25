import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

import {
  validateDocument,
  LATEST_VERSION,
  PUBLISHED_VERSIONS,
  SUPPORTED_VERSIONS,
  VERSIONS_WITH_RECOMMENDED,
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
 * What happened to one file. Three outcomes, because two of them are not
 * verdicts about the document at all:
 *
 *   - `valid` / `invalid` — measured against the version it declares.
 *   - `not-judged` — the declared version was never published, so there are
 *     no rules. Nothing was measured; this is not a defect and not a pass.
 *
 * Being outside the support window is deliberately none of these: those
 * schemas exist, the document was measured against them, and the verdict is
 * whatever that measurement said. The support sentence is printed next to it.
 * Folding the window into the outcome is what made a healthy 0.5 feed read as
 * "0/18 valid" (#95) and a healthy kit fork read as "0/3 valid" (#117).
 */
type Outcome = "valid" | "invalid" | "not-judged" | "not-judged-member";

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

/**
 * Whether this file is a member of an organizer-kit feed, by the kit's own
 * layout: `<root>/events/<slug>.json` next to `<root>/ote.config.json`.
 *
 * Matched on the layout rather than by walking ancestors, because an ancestor
 * walk gets this wrong in the direction that matters. A standalone document
 * that happens to sit a few directories under somebody's unrelated
 * `ote.config.json` was told "do not add specVersion here", which is the
 * opposite of what it needs — and the advice flipped depending on how deep
 * the file happened to be.
 *
 * Used for the **message only, never for the verdict**. Applying inheritance
 * here would mean either duplicating `resolveEventInheritance` (which lives
 * in `@opentechevents/build-feed`, a package that depends on this one) or
 * inverting that dependency, and neither works in a browser bundle where
 * there is no filesystem at all.
 *
 * The real fix is for a feed member to be a document class a validator can
 * recognise — tracked in #119 and OpenTechEvents/opentechevents-spec#55.
 * Until then the honest output is "I cannot judge this alone, and here is the
 * command that can".
 */
function looksLikeFeedMember(file: string): boolean {
  const eventsDir = dirname(resolve(file));
  if (basename(eventsDir) !== "events") return false;
  return existsSync(join(dirname(eventsDir), "ote.config.json"));
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
  const support = report.support.message;

  // Nothing was measured: the declared version was never published, so there
  // is no verdict on the document to report. Printed to stderr with a `?`
  // rather than a `✗` — the file is not a failure, the question is.
  if (report.valid === null) {
    io.err(`? ${rel} (${kind}) — not checked`);
    // In a kit fork the policy's generic advice ("set specVersion to one of
    // the published versions") is the opposite of what the organizer should
    // do — a feed member inherits it, and writing one by hand is what
    // skills/ote-event forbids. So it is replaced, not accompanied: two
    // sentences telling the reader to do opposite things is worse than
    // either one alone.
    if (report.declaredVersion === null && looksLikeFeedMember(file)) {
      io.err(
        `    specVersion: absent, and this is an events/ file next to an ` +
          `ote.config.json — so it is an organizer-kit event, whose ` +
          `specVersion and license come from the feed. Do not add them here. ` +
          `Check it with \`ote-build-feed . --check\`, which validates the ` +
          `assembled feed.`,
      );
      return "not-judged-member";
    }
    if (support) {
      io.err(`    specVersion: ${support}`);
    }
    return "not-judged";
  }

  if (report.valid) {
    io.out(`✓ ${rel} (${kind}) — ${checkedAgainst(report)}`);
    // Including the support sentence, which does not change the ✓. A feed
    // outside the window is valid against its own schemas, and the publisher
    // needs to hear "migrate when you can", not "your feed is broken".
    if (support) io.out(`    note: ${support}`);
    for (const notice of report.notices) io.out(`    note: ${notice.message}`);
    return "valid";
  }

  io.err(`✗ ${rel} (${kind}) — ${checkedAgainst(report)}`);
  if (support) io.err(`    note: ${support}`);
  for (const error of report.errors) io.err(`    ${error.path}: ${error.message}`);
  return "invalid";
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
 *   0 — every document was measured and none was invalid. This includes a
 *       document outside the support window: its schemas exist, it was
 *       measured against them, and it passed. The support sentence is
 *       printed next to the ✓ and changes nothing else.
 *   1 — a document is invalid: a real defect, measured against the version
 *       the document itself declares.
 *   2 — usage or I/O error.
 *   3 — nothing was invalid, but at least one document could not be judged:
 *       it declares a spec version that was never published, so there are no
 *       rules and no verdict. Distinct from 1 on purpose — CI and agents need
 *       to tell "I cannot answer" from "your feed is broken", and 1 for both
 *       says the publisher is at fault when they are not.
 *
 * 1 wins over 3 when both occur — a real defect is the more urgent answer.
 * A single unjudgeable file is enough for a 3 even when the rest of the run
 * was clean: it is the only signal that something went unmeasured, and a
 * mistyped `specVersion` is exactly what it has to catch.
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

  let valid = 0;
  let invalid = 0;
  let notJudged = 0;
  let members = 0;
  for (const file of files) {
    const outcome = await validateFile(file, cwd, io, args.specVersion);
    if (outcome === "valid") valid++;
    else if (outcome === "invalid") invalid++;
    else {
      notJudged++;
      if (outcome === "not-judged-member") members++;
    }
  }

  // Three counts, never collapsed into one fraction. `0/3 valid` over three
  // files nobody judged reads as "three bad files", and that is how a healthy
  // kit fork was reported (#117): the denominator has to be what was actually
  // measured, and anything else gets its own line.
  const total = files.length;
  const judged = valid + invalid;
  // No fraction when nothing was judged: "0/0 valid" is arithmetic, not an
  // answer, and the line below says what actually happened.
  if (judged > 0) io.out(`${valid}/${judged} judged valid`);
  if (invalid > 0) io.out(`${invalid}/${total} invalid`);
  // The summary has to name the reason each file was not judged, because for
  // a kit fork the version sentence is false: a feed member declares no
  // version, so "a spec version this release cannot check against" and the
  // supported list describe something that never happened — and that line is
  // the last thing a non-technical organizer reads. Reporting it was the same
  // failure mode one line further down from #117's.
  if (members > 0) {
    io.out(
      `${members}/${total} not judged: organizer-kit feed members, which are ` +
        `judged when the feed is assembled (\`ote-build-feed . --check\`)`,
    );
  }
  if (notJudged - members > 0) {
    io.out(
      `${notJudged - members}/${total} not judged: a spec version this ` +
        `release cannot check against (supported: ${SUPPORTED_VERSIONS.join(", ")})`,
    );
  }

  // A file this release could not judge always reaches the exit code, even
  // when other files in the same run were fine. The alternative was tried and
  // is worse: exiting 0 whenever *something* was measured let a typo'd
  // `specVersion` ("0.6" for "0.6.0") sit in a directory next to a valid feed
  // and pass CI silently, because that file was never measured at all.
  //
  // This costs nothing that #117 asked for. An out-of-window document is no
  // longer counted here — it is measured against its own schemas and lands in
  // `valid` or `invalid` like any other — so a healthy feed on last season's
  // release exits 0 through the line above, which is the whole point.
  if (invalid > 0) return 1;
  return notJudged > 0 ? 3 : 0;
}
