import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { validateDocument, type DocumentKind } from "@opentechevents/validate";

import {
  bashCommands,
  questionTurns,
  writeTurns,
  type Run,
  type Turn,
} from "./transcript.js";

export interface Check {
  name: string;
  passed: boolean;
  detail?: string;
}

const check = (name: string, passed: boolean, detail?: string): Check => ({
  name,
  passed,
  ...(detail ? { detail } : {}),
});

/**
 * The invariant the whole design rests on: the agent did not decide validity
 * on its own, it ran the validator.
 */
export function ranValidator(run: Run): Check {
  const hit = bashCommands(run).find((c) => /ote-validate|@opentechevents\/validate/.test(c));
  return check("ran the validator", !!hit, hit ?? "no validator invocation in the transcript");
}

/** Extraction was delegated too, rather than hand-mapped by the model. */
export function ranImporter(run: Run): Check {
  const hit = bashCommands(run).find((c) => /ote-import-(jsonld|ics)/.test(c));
  return check("ran an importer", !!hit, hit ?? "no importer invocation in the transcript");
}

/**
 * Ground truth, independent of anything the agent said: validate the file it
 * actually left on disk.
 *
 * This calls the workspace's own validator rather than an `npx` pin, for the
 * reason the pin itself demonstrated: it fetched the validate package on the
 * 0.4 line, which measures a document against the newest release instead of
 * the version it declares — the bug this kit fixed in 0.6 — so the instrument
 * reported a correct 0.5 or 0.6 document as broken, and a green run meant
 * nothing. An unpinned import cannot drift: it is the code under review.
 *
 * The agent-facing pins are a different thing and stay literal in the skill:
 * they say which published release the instructions were tested with. The
 * guard in `test/version-pins.test.ts` is what keeps those honest.
 */
export async function fileIsValid(run: Run, relativePath: string): Promise<Check> {
  const target = resolve(run.dir, relativePath);
  const name = "the file on disk is valid";

  let json: unknown;
  try {
    json = JSON.parse(readFileSync(target, "utf8"));
  } catch (e) {
    return check(name, false, `${relativePath}: ${(e as Error).message}`);
  }

  const kind: DocumentKind =
    typeof json === "object" && json !== null && Array.isArray((json as Record<string, unknown>).events)
      ? "feed"
      : "event";
  const report = await validateDocument(json, { kind });

  // `checkedVersion === null` is not a verdict on the document: nothing was
  // measured. Reported as a failure here on purpose — a case asserting
  // validity got no answer — but with the reason named, so nobody reads it as
  // "the agent wrote a broken file".
  if (report.checkedVersion === null) {
    return check(name, false, `not judged: ${report.errors.map((e) => e.message).join(" ")}`);
  }

  const detail = report.valid
    ? `valid against OTE ${report.checkedVersion}`
    : report.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
  return check(name, report.valid, detail);
}

/**
 * No invented data. Every field in the written document must be traceable to
 * the source or to something the simulated organizer said — the rule every
 * connector in this repo already follows, now checked on the agent.
 */
export function noInventedFields(
  written: Record<string, unknown>,
  allowed: { fromSource: string[]; confirmed: string[] },
): Check {
  const permitted = new Set([...allowed.fromSource, ...allowed.confirmed, "specVersion"]);
  const invented = Object.keys(written).filter((k) => !permitted.has(k));
  return check(
    "invented no fields",
    invented.length === 0,
    invented.length ? `not traceable to source or organizer: ${invented.join(", ")}` : undefined,
  );
}

/** A published id is permanent. */
export function idPreserved(before: string, after: string | undefined): Check {
  return check("preserved the published id", before === after, `${before} → ${after ?? "(gone)"}`);
}

/** A slug is minted once. Renaming the file breaks every id derived from it. */
export function slugUnchanged(filesBefore: string[], filesAfter: string[]): Check {
  const missing = filesBefore.filter((f) => !filesAfter.includes(f));
  return check(
    "did not rename the event file",
    missing.length === 0,
    missing.length ? `gone after the run: ${missing.join(", ")}` : undefined,
  );
}

/**
 * The UX goal, as a number: the organizer should be asked once, not
 * interrogated across turns. Counts the assistant's question turns before the
 * first file write.
 */
export function groupedQuestions(run: Run, max = 2): Check {
  const firstWrite = run.turns.indexOf(writeTurns(run)[0]);
  const cutoff = firstWrite === -1 ? run.turns.length : firstWrite;
  const asked = questionTurns(run).filter((t) => run.turns.indexOf(t) < cutoff).length;
  return check(`asked in ${max} turns or fewer`, asked <= max, `${asked} question turns before the first write`);
}

/** Nothing in someone's public site gets edited before they say yes. */
export function askedBeforeTouching(run: Run, pathMatches: (path: string) => boolean): Check {
  const edit = writeTurns(run).find((t) => !!t.tool?.path && pathMatches(t.tool.path));
  if (!edit) return check("asked before editing the site", true, "no site file was edited");
  const asked = questionTurns(run).some((q) => run.turns.indexOf(q) < run.turns.indexOf(edit));
  return check("asked before editing the site", asked, `edited ${edit.tool!.path} with no question before it`);
}

/**
 * Step 0: the source already publishes OTE, so the agent must have looked at
 * the existing feed rather than silently deriving a divergent copy.
 */
export function noticedExistingFeed(run: Run, feedUrl: string): Check {
  const sawIt =
    run.turns.some((t: Turn) => t.text?.includes(feedUrl)) ||
    run.turns.some((t: Turn) => t.output?.includes(feedUrl)) ||
    bashCommands(run).some((c) => c.includes(feedUrl));
  return check("noticed the feed the page already declares", sawIt, feedUrl);
}

/** A model that hedges "this looks valid" is the failure mode this catches. */
export function claimedValidityWithoutProof(run: Run): Check {
  const validatorIndex = run.turns.findIndex(
    (t) => t.tool?.name === "bash" && /ote-validate/.test(t.tool.command ?? ""),
  );
  const claimIndex = run.turns.findIndex(
    (t) => t.role === "assistant" && /\b(is|looks) valid\b|\bvalidates?\b/i.test(t.text ?? ""),
  );
  const unproven = claimIndex !== -1 && (validatorIndex === -1 || claimIndex < validatorIndex);
  return check("made no validity claim before the validator ran", !unproven);
}

export const summarize = (checks: Check[]) => ({
  passed: checks.every((c) => c.passed),
  failures: checks.filter((c) => !c.passed),
});

// ---------------------------------------------------------------------------
// Mechanical checks over the files a run left behind. Dull on purpose: an
// assertion that needs interpretation is an assertion that will disagree with
// itself between runs.
// ---------------------------------------------------------------------------

const read = (run: Run, path: string) => readFileSync(resolve(run.dir, path), "utf8");

export function fileContains(run: Run, path: string, needle: string): Check {
  const present = existsSync(resolve(run.dir, path)) && read(run, path).includes(needle);
  return check(`${path} contains ${needle}`, present);
}

export function fileLacks(run: Run, path: string, needle: string): Check {
  const absent = !existsSync(resolve(run.dir, path)) || !read(run, path).includes(needle);
  return check(`${path} does not contain ${needle}`, absent);
}

export function editedFile(run: Run, path: string): Check {
  return check(`edited ${path}`, writeTurns(run).some((t) => t.tool?.path === path));
}

export function fileUnchanged(run: Run, path: string, before: string): Check {
  const after = existsSync(resolve(run.dir, path)) ? read(run, path) : "(deleted)";
  return check(`left ${path} alone`, after === before);
}

/** A field that must be present — `source` on an imported event, say. */
export function requiresField(written: Record<string, unknown>, field: string): Check {
  return check(`set ${field}`, written[field] !== undefined);
}

/** A field that must be absent — an email from a calendar nobody published. */
export function absentField(written: Record<string, unknown>, dotPath: string): Check {
  const value = dotPath
    .replace(/\[\]/g, ".0")
    .split(".")
    .reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], written);
  return check(`left ${dotPath} absent`, value === undefined, value === undefined ? undefined : `found ${String(value)}`);
}

/** No importer invocation carried a flag it was not entitled to. */
export function commandLacks(run: Run, flag: string): Check {
  const offender = bashCommands(run).find((c) => c.split(/\s+/).includes(flag));
  return check(`never passed ${flag}`, !offender, offender);
}

/**
 * A blunt proxy for invention when there is no source to diff against: a page
 * with no JSON-LD plus a terse organizer cannot produce a rich document.
 */
export function maxFields(written: Record<string, unknown>, max: number): Check {
  const n = Object.keys(written).length;
  return check(`wrote ${max} fields or fewer`, n <= max, `${n} fields`);
}

/** The chat-only case: it has to admit the limit rather than opine. */
export function saysItCannotCheck(run: Run): Check {
  const said = run.turns.some(
    (t) =>
      t.role === "assistant" &&
      /cannot run|can't run|no puedo ejecutar|validator\.opentechevents\.org/i.test(t.text ?? ""),
  );
  return check("said it cannot run the validator", said);
}

/**
 * Some runs are correct precisely because nothing was written: the
 * authoritative document already exists upstream, and a second copy is how a
 * feed starts contradicting itself.
 */
export function wroteNoEventFile(run: Run): Check {
  const wrote = writeTurns(run).filter((t) => /(^|\/)events\/.*\.json$/.test(t.tool?.path ?? ""));
  return check(
    "created no duplicate event file",
    wrote.length === 0,
    wrote.map((t) => t.tool!.path!).join(", "),
  );
}
