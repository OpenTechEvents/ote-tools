import { specVersion, validateFeed } from "@opentechevents/validate";

import type { OteEvent, OteFeed, OteFeedConfig, OteOrganizer } from "./types.js";

export type {
  OteAttendanceMode,
  OteCfp,
  OteEligibility,
  OteEvent,
  OteEventStatus,
  OteFeed,
  OteFeedConfig,
  OteGeo,
  OteImageEntry,
  OteLocation,
  OteOffer,
  OteOrganizer,
  OtePartOf,
  OteSource,
} from "./types.js";

/**
 * Spec version stamped on every assembled feed. Sourced from
 * @opentechevents/validate's own re-export (which comes from the embedded
 * @opentechevents/schema package) instead of a local literal, so this can
 * never drift from the validator again on the next spec bump.
 */
export const SPEC_VERSION = specVersion;

/** One event file, already parsed. `file` is the path shown in error messages. */
export interface EventFileInput {
  file: string;
  json: unknown;
}

/** A build problem anchored to a source file and a field path within it. */
export interface BuildProblem {
  /** Source file the problem belongs to (e.g. "events/2026-06.json"). */
  file: string;
  /** Field path within that file, "(document)" for the whole document. */
  path: string;
  message: string;
}

export interface BuildFeedInput {
  /** Parsed ote.config.json. Only its `feed` block is consumed. */
  config: unknown;
  events: EventFileInput[];
  /** Feed `updatedAt` (ISO-8601 instant). Injected so the function stays pure. */
  now: string;
}

export type BuildFeedResult =
  | { ok: true; feed: OteFeed }
  | { ok: false; problems: BuildProblem[] };

const CONFIG_FILE = "ote.config.json";

/** String-valued feed fields sourced from the config's `feed` block. */
const STRING_FEED_CONFIG_FIELDS = [
  "title",
  "description",
  "url",
  "license",
  "licenseUrl",
  "textLanguage",
] as const;

/**
 * Every feed field this builder reads from config, string-valued or not —
 * used to attribute assembled-feed validation errors back to ote.config.json
 * (see `attribute()`). `translations` is read but never fed to exporters
 * (it's never inherited by events, only translates the feed's own
 * title/description), so it doesn't need special handling beyond this.
 */
const FEED_CONFIG_FIELDS = [
  ...STRING_FEED_CONFIG_FIELDS,
  "organizers",
  "translations",
] as const;

// Only `title` is unconditionally required: `license` is optional since D029
// (a feed may omit it as long as every event declares its own instead) — so
// its absence here is not automatically a config error; the assembled feed's
// own validation (which sees every event) is what actually enforces D029.
const REQUIRED_CONFIG_FIELDS = new Set(["title"]);

// The exact, hardcoded error.message @opentechevents/schema's uniqueEventIds
// custom keyword always emits — see the "skip the redundant copy" comment
// below for why this is matched against.
const UNIQUE_EVENT_IDS_MESSAGE = "events must not repeat the same id";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Structural read of the config's `feed` block. Presence and type only —
 * value constraints (license pattern, URL format…) come from the feed schema
 * once the feed is assembled, so they are never duplicated here.
 */
function readFeedConfig(
  config: unknown,
  problems: BuildProblem[],
): Partial<OteFeedConfig> {
  if (!isObject(config)) {
    problems.push({
      file: CONFIG_FILE,
      path: "(document)",
      message: "must be a JSON object",
    });
    return {};
  }
  const feed = config.feed;
  if (!isObject(feed)) {
    problems.push({
      file: CONFIG_FILE,
      path: "feed",
      message: 'is missing: ote.config.json needs a "feed" object with at least "title"',
    });
    return {};
  }
  const out: Partial<OteFeedConfig> = {};
  for (const field of STRING_FEED_CONFIG_FIELDS) {
    const value = feed[field];
    if (value === undefined) {
      if (REQUIRED_CONFIG_FIELDS.has(field)) {
        problems.push({
          file: CONFIG_FILE,
          path: `feed.${field}`,
          message: "is required",
        });
      }
      continue;
    }
    if (typeof value !== "string") {
      problems.push({
        file: CONFIG_FILE,
        path: `feed.${field}`,
        message: "must be a string",
      });
      continue;
    }
    out[field] = value;
  }
  if (feed.organizers !== undefined) {
    if (Array.isArray(feed.organizers)) {
      out.organizers = feed.organizers as OteOrganizer[];
    } else {
      problems.push({
        file: CONFIG_FILE,
        path: "feed.organizers",
        message: "must be an array",
      });
    }
  }
  if (feed.translations !== undefined) {
    if (isObject(feed.translations)) {
      out.translations = feed.translations as OteFeedConfig["translations"];
    } else {
      problems.push({
        file: CONFIG_FILE,
        path: "feed.translations",
        message: "must be an object",
      });
    }
  }
  return out;
}

/** Sort key: startDate, then id, so the feed is stable across readdir order. */
function compareEvents(a: OteEvent, b: OteEvent): number {
  const byStart = String(a.startDate ?? "").localeCompare(
    String(b.startDate ?? ""),
  );
  if (byStart !== 0) return byStart;
  return String(a.id ?? "").localeCompare(String(b.id ?? ""));
}

/**
 * Maps a validation error on the assembled feed back to its source file:
 * `events[i].field` belongs to the i-th event file; top-level feed fields
 * belong to ote.config.json (as `feed.<field>`); anything else (specVersion,
 * updatedAt, events) is generated by this builder.
 */
function attribute(
  error: { path: string; message: string },
  files: string[],
): BuildProblem {
  const eventMatch = /^events\[(\d+)\]\.?(.*)$/.exec(error.path);
  if (eventMatch) {
    const file = files[Number(eventMatch[1])] ?? "(unknown event file)";
    return {
      file,
      path: eventMatch[2] || "(document)",
      message: error.message,
    };
  }
  const head = error.path.split(/[.[]/, 1)[0];
  if ((FEED_CONFIG_FIELDS as readonly string[]).includes(head)) {
    return {
      file: CONFIG_FILE,
      path: `feed.${error.path}`,
      message: error.message,
    };
  }
  return { file: "(assembled feed)", path: error.path, message: error.message };
}

/**
 * Assembles an OTE Feed (v0.3) from parsed event documents and the `feed`
 * block of ote.config.json, then validates the whole feed. Pure function:
 * reads no files, makes no network calls, takes the clock as `now`.
 *
 * Events inherit the feed's specVersion and license, so event files are NOT
 * validated standalone (that would wrongly demand a per-event license):
 * the assembled feed is validated once and every error is attributed back to
 * its source file and field. Events are sorted by startDate, then id.
 */
export function buildFeed(input: BuildFeedInput): BuildFeedResult {
  const problems: BuildProblem[] = [];
  const feedConfig = readFeedConfig(input.config, problems);

  const entries: Array<{ file: string; event: OteEvent }> = [];
  const seenIds = new Map<string, string>();
  let hasDuplicateId = false;
  for (const { file, json } of input.events) {
    if (!isObject(json)) {
      problems.push({
        file,
        path: "(document)",
        message: "must be a JSON object",
      });
      continue;
    }
    const event = json as unknown as OteEvent;
    entries.push({ file, event });
    // Checked here (not left to the schema) for the richer message: this one
    // names BOTH files involved, not just "the feed has a duplicate".
    if (typeof event.id === "string") {
      const previous = seenIds.get(event.id);
      if (previous) {
        problems.push({
          file,
          path: "id",
          message: `duplicates the id already used by ${previous}`,
        });
        hasDuplicateId = true;
      } else {
        seenIds.set(event.id, file);
      }
    }
  }

  entries.sort((a, b) => compareEvents(a.event, b.event));

  // The title placeholder keeps feed validation running when the config is
  // broken, so event errors are still reported in the same pass — the
  // config problem pushed above already fails the build regardless. license
  // gets no such placeholder: it's genuinely optional now (D029), so leaving
  // it absent is a valid feed shape, not a broken one — the assembled feed's
  // own validation is what actually enforces "every event needs its own
  // license when the feed doesn't have one".
  const feed: OteFeed = {
    specVersion: SPEC_VERSION,
    title: feedConfig.title ?? "(missing title)",
    ...(feedConfig.description !== undefined && {
      description: feedConfig.description,
    }),
    ...(feedConfig.url !== undefined && { url: feedConfig.url }),
    ...(feedConfig.license !== undefined && { license: feedConfig.license }),
    ...(feedConfig.licenseUrl !== undefined && {
      licenseUrl: feedConfig.licenseUrl,
    }),
    ...(feedConfig.textLanguage !== undefined && {
      textLanguage: feedConfig.textLanguage,
    }),
    ...(feedConfig.organizers !== undefined && {
      organizers: feedConfig.organizers,
    }),
    ...(feedConfig.translations !== undefined && {
      translations: feedConfig.translations,
    }),
    updatedAt: input.now,
    events: entries.map((e) => e.event),
  };

  const result = validateFeed(feed);
  if (!result.valid) {
    const files = entries.map((e) => e.file);
    for (const error of result.errors) {
      // v0.3's own uniqueEventIds keyword now also catches this feed-wide
      // (it couldn't in v0.2 — the schema had no visibility across events),
      // but with strictly worse attribution: it can't name which two files
      // clash the way the check above already did. Skip the redundant copy.
      if (hasDuplicateId && error.message === UNIQUE_EVENT_IDS_MESSAGE) continue;
      problems.push(attribute(error, files));
    }
  }

  return problems.length > 0 ? { ok: false, problems } : { ok: true, feed };
}

/**
 * Resolves each event's EFFECTIVE `organizers`/`textLanguage`/`license` —
 * falling back to the feed's own value only when an event doesn't declare
 * its own (replacement, never merge: a declared `organizers[]` fully
 * replaces the feed's, it never appends to it — this is naturally what a
 * plain `??` fallback per field already does, no merging ever happens).
 *
 * `feed.json` itself is written from the UN-resolved feed (see `buildFeed`):
 * the inheritance is schema-valid to leave implicit, and materializing it
 * onto every event would just be noise. But `@opentechevents/export-ics` and
 * `@opentechevents/export-rss` read each event's fields directly — they have
 * no notion of feed-level inheritance themselves — so call this first when
 * handing the feed to either of them (see the CLI for the exact pattern).
 */
export function resolveEventInheritance(feed: OteFeed): OteFeed {
  return {
    ...feed,
    events: feed.events.map((event) => ({
      ...event,
      organizers: event.organizers ?? feed.organizers,
      textLanguage: event.textLanguage ?? feed.textLanguage,
      license: event.license ?? feed.license,
    })),
  };
}
