import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

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

  // `valid === null` is not a verdict on the document: nothing was measured,
  // because the declared version was never published. Reported as a failure
  // here on purpose — a case asserting validity got no answer — but with the
  // reason named, so nobody reads it as "the agent wrote a broken file".
  if (report.valid === null) {
    return check(name, false, `not judged: ${report.support.message ?? "unknown spec version"}`);
  }

  // Out-of-window is NOT a failure here: the document was measured against
  // its own schemas and passed. The support sentence rides along in the
  // detail so a reader of a green check still learns about it.
  const support = report.support.message ? ` (${report.support.message})` : "";
  const detail = report.valid
    ? `valid against OTE ${report.checkedVersion}${support}`
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
 * The other half of `wroteNoEventFile`, and the branch that had no case at
 * all: the feed exists, this event is not in it, so the run is correct
 * precisely because the feed grew by exactly this one event.
 *
 * Takes the feed document before and after the run rather than the run
 * directory, so it is the same shape as `idPreserved` — and so a case can use
 * it whether the event landed in a single-file feed or in a kit fork's
 * `events/` that the harness reassembled.
 */
export function appendedEvent(before: unknown, after: unknown, name: string): Check {
  const label = `appended ${name} and nothing else`;
  const [was, is] = [feedEvents(before), feedEvents(after)];
  if (!is.length) return check(label, false, "the feed after the run carries no events");

  const added = is.filter((event) => !was.some((old) => sameEvent(old, event)));
  const dropped = was.filter((old) => !is.some((event) => sameEvent(old, event)));
  const matches = added.filter((event) => eventName(event).toLowerCase().includes(name.toLowerCase()));

  // The mutation that survives counting: two published entries trading ids.
  // Nothing was added or dropped, both ids are still unique, so the feed is
  // schema-valid and every count agrees — and two talks have swapped
  // identities for every subscriber. So check the pairing, not the set: an
  // `id` that already existed must still name the same event it named before.
  const reidentified = was.filter((old) => {
    const id = eventId(old);
    if (!id) return false;
    const now = is.find((event) => eventId(event) === id);
    return !!now && (eventName(now) !== eventName(old) || now.startDate !== old.startDate);
  });

  // "and nothing else" has to include what *left*: an agent that rewrites the
  // whole feed to add one entry can lose an entry on the way, and every
  // subscriber then sees the event cancelled. One appended event with one
  // dropped sibling is a net count of +1, so counting is not enough.
  const passed =
    added.length === 1 && matches.length === 1 && dropped.length === 0 && reidentified.length === 0;
  const detail = `${was.length} → ${is.length} events; added: ${
    added.map(eventName).join(", ") || "(none)"
  }${dropped.length ? `; dropped: ${dropped.map(eventName).join(", ")}` : ""}${
    reidentified.length ? `; re-identified: ${reidentified.map(eventName).join(", ")}` : ""
  }`;
  return check(label, passed, detail);
}

/**
 * An `id` appended to a feed has to look like the ids already in it.
 *
 * The pattern is **derived from the siblings**, never written down here: a
 * feed minting `…/events/<slug>-<YYYY-MM-DD>` and one minting
 * `…/events/<slug>` are both correct, and a list of accepted shapes in this
 * file would be a second copy of a convention that lives in the data. What is
 * wrong is the eleventh event being spelled unlike the first ten — including
 * the host, since a feed served from `corunajug.org` whose ids all say
 * `www.corunajug.org` keeps the `www.`.
 *
 * Two derived rules, which is all the siblings actually support:
 *   1. the prefix every existing id shares, cut at the last `/`;
 *   2. where a date sits, when every dated sibling agrees on trailing.
 */
export function idFollowsSiblings(before: unknown, after: unknown): Check {
  const label = "minted an id that matches the ones already in the feed";
  const existing = feedEvents(before).map(eventId).filter((id): id is string => !!id);
  const minted = feedEvents(after)
    .map(eventId)
    .filter((id): id is string => !!id && !existing.includes(id));

  if (!existing.length) return check(label, false, "the feed before the run has no ids to derive from");
  if (!minted.length) return check(label, false, "no new id in the feed after the run");

  const prefix = sharedPathPrefix(existing);

  // A prefix that stops before the host is not a pattern: ids spread over two
  // hosts share `https://`, and `urn:` ids share nothing with a `/` in it, so
  // the prefix test would then accept an id minted anywhere — including the
  // directory's domain, the failure this whole check exists to catch. Say so
  // and fail, rather than passing for want of something to compare against.
  if (!HOST_AND_PATH.test(prefix)) {
    return check(label, false, `the ids already in the feed share no pattern to derive from: ${existing.join(", ")}`);
  }

  const dated = existing.filter((id) => DATE.test(id));
  const alwaysTrailing = dated.length > 0 && dated.every((id) => TRAILING_DATE.test(id));

  const problems = minted.flatMap((id) => {
    if (!id.startsWith(prefix)) return [`${id} is not under ${prefix}`];
    // Under the prefix is not enough: the siblings each add exactly one path
    // segment there, and an id that adds none is the collection, not an event.
    const slug = id.slice(prefix.length);
    if (!slug) return [`${id} is the prefix itself, not an event id`];
    if (slug.includes("/")) return [`${id} nests a path the siblings do not have`];
    if (alwaysTrailing && DATE.test(id) && !TRAILING_DATE.test(id)) {
      return [`${id} carries its date mid-id; every sibling ends with one`];
    }
    return [];
  });
  return check(label, problems.length === 0, problems.join("; ") || minted.join(", "));
}

/**
 * Never a second feed. Checked on what is on disk rather than on what the
 * transcript recorded as a write: an agent that assembles a file with a shell
 * heredoc leaves no write turn, and that file is just as much a second feed.
 *
 * Takes the feed files that existed **before** the run, which the runner
 * snapshots, because a fixture repo can ship one already — `site-with-feed`
 * does, and an earlier version of this check failed on that repo before the
 * agent had done anything at all. Any feed-shaped document that was not there
 * before is the failure.
 */
export function wroteNoSecondFeed(run: Run, feedsBefore: string[]): Check {
  const rivals = feedDocumentsIn(run).filter((path) => !feedsBefore.includes(path));
  return check("created no second feed", rivals.length === 0, rivals.join(", "));
}

/**
 * Paths under a run directory that are feed documents: an `events` array in a
 * JSON body. The extensions are the ones a feed is actually published under —
 * `.jsonld` included, because a second feed under a name the scan does not
 * walk is a second feed nobody sees.
 */
const feedDocumentsIn = (run: Run): string[] =>
  jsonFilesIn(run.dir).filter((path) => {
    try {
      return isFeed(JSON.parse(read(run, path)));
    } catch {
      // A file that is not JSON cannot be a feed. Unreadable is not a verdict.
      return false;
    }
  });

/** The harness's own scaffolding, which the run did not write. */
const NOT_THE_RUN = new Set([".eval-bin", ".agents", ".git", "node_modules"]);

/** Every JSON-ish file under a run directory, as paths relative to it. */
const jsonFilesIn = (dir: string, prefix = ""): string[] => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (NOT_THE_RUN.has(entry.name)) return [];
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return jsonFilesIn(join(dir, entry.name), path);
    return /\.(json|jsonld)$/i.test(entry.name) ? [path] : [];
  });
};

const DATE = /\d{4}-\d{2}-\d{2}/;
/** A derived prefix is only usable once it reaches past the host. */
const HOST_AND_PATH = /:\/\/[^/]+\//;
const TRAILING_DATE = /\d{4}-\d{2}-\d{2}$/;

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

const isFeed = (value: unknown): boolean => Array.isArray(asRecord(value).events);

/** The events of a feed document, or the document itself if it is one event. */
const feedEvents = (value: unknown): Record<string, unknown>[] => {
  const doc = asRecord(value);
  if (Array.isArray(doc.events)) return doc.events.map(asRecord);
  return Object.keys(doc).length ? [doc] : [];
};

const eventId = (event: Record<string, unknown>): string | undefined =>
  typeof event.id === "string" ? event.id : undefined;

const eventName = (event: Record<string, unknown>): string =>
  typeof event.name === "string" ? event.name : "(unnamed)";

/**
 * Two entries are the same event when they share an `id`; with no id on
 * either side, when they share name and start — the same fallback the skill
 * tells the agent to use when matching an event against a feed.
 *
 * An id on **one** side only is deliberately *not* a match. The fallback
 * existed to let an undated hand-written fixture work, and it quietly
 * swallowed the worst failure this case can produce: an agent that appends the
 * new event and strips the `id` off a published one leaves name and startDate
 * intact, so the mutilated entry matched its old self, counted as neither
 * added nor dropped, and every check passed over a feed `ote-validate` then
 * rejects. A missing id is a different event to every consumer — which is the
 * whole reason the id is permanent.
 */
const sameEvent = (a: Record<string, unknown>, b: Record<string, unknown>): boolean => {
  const [idA, idB] = [eventId(a), eventId(b)];
  if (idA || idB) return !!idA && !!idB && idA === idB;
  return eventName(a) === eventName(b) && a.startDate === b.startDate;
};

/** The longest `/`-bounded prefix every id shares. */
const sharedPathPrefix = (ids: string[]): string => {
  let prefix = ids[0];
  for (const id of ids.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < id.length && prefix[i] === id[i]) i++;
    prefix = prefix.slice(0, i);
  }
  return prefix.slice(0, prefix.lastIndexOf("/") + 1);
};

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
