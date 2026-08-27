import type { ErrorObject } from "ajv";

import { specVersion } from "./schemas.generated.js";

/** A validation error with a readable path and a human-readable message. */
export interface ValidationError {
  /** Readable field path, e.g. "events[0].startDate". "(document)" = root. */
  path: string;
  /** Human-readable message. */
  message: string;
}

/** Converts a JSON Pointer ("/events/0/startDate") to a readable path ("events[0].startDate"). */
function humanPath(instancePath: string): string {
  if (instancePath === "") return "(document)";
  return instancePath
    .slice(1)
    .split("/")
    .map((seg) => seg.replace(/~1/g, "/").replace(/~0/g, "~"))
    .reduce(
      (acc, seg) =>
        /^\d+$/.test(seg) ? `${acc}[${seg}]` : acc ? `${acc}.${seg}` : seg,
      "",
    );
}

const WALL_CLOCK_MESSAGE =
  "must be a date (YYYY-MM-DD) or a local date-time (YYYY-MM-DDTHH:MM, no seconds); a UTC offset is never allowed here — use `timezone` instead";

const DATE_FORM_MESSAGE =
  "startDate and endDate must use the same form: both all-day dates or both local date-times";

const LOCATION_MESSAGE =
  'location must include at least one of "venue" or "onlineUrl"';

const INSTANT_MESSAGE =
  "must be an ISO-8601 instant with offset or Z (e.g. 2026-07-06T10:00:00Z)";

/** Specific messages for known field patterns, keyed by path suffix. */
const PATTERN_MESSAGES: Array<[RegExp, string]> = [
  [/\/timezone$/, "must be an IANA timezone (e.g. Europe/Madrid) or UTC"],
  [/\/license$/, "must be an SPDX identifier (e.g. CC-BY-4.0) or a URL"],
  [/\/languages\/\d+$/, "must be a BCP 47 language tag (e.g. es, en-US)"],
  [/\/id$/, "must be a URI (e.g. https://example.org/events/2026-06)"],
  [/\/(url|onlineUrl|licenseUrl|waitlistUrl)$/, "must be an http(s) URL"],
];

/**
 * Messages keyed by the *pattern itself*, which beats keying by field name: the
 * same `url` property is `^https?://` in some places and `^https://` in others
 * (images must be fetchable over TLS by whoever renders the feed), and a field
 * that says "must be an http(s) URL" about an `http://` value it just rejected
 * sends the publisher looking for a typo that is not there.
 */
const PATTERN_BY_REGEX: Array<[string, string]> = [
  ["^https://", "must be an https:// URL — http:// is not accepted here"],
  ["^https?://", "must be an http(s) URL"],
];

/** The credential form every URL in the spec refuses: `https://user:pass@host`. */
const USERINFO_PATTERN = "^https?://[^/?#]*@";

const USERINFO_MESSAGE =
  "must not carry credentials in the URL (the user:pass@host form)";

/** Fields whose `not` forbids the credential form rather than the field itself. */
const URL_FIELD = /\/(id|url|onlineUrl|licenseUrl|waitlistUrl)$|\/image\/\d+$/;

/**
 * `not` says two different things in these schemas, and ajv's own words for
 * both ("must NOT be valid") say neither: `not: {pattern: …}` forbids
 * credentials inside a URL, while `not: {}` forbids the *field* in that
 * position. The error object carries no subschema, so the field decides.
 */
const NOT_MESSAGES: Array<[RegExp, string]> = [
  [
    /\/textLanguage$/,
    "should only be set when the feed also names its own organizers — without them it hands every event a single language none of them may actually share",
  ],
];

const DATE_PATTERN_PATHS = ["#/$defs/date/pattern", "#/$defs/dateTime/pattern"];

/**
 * Instance paths that fail BOTH patterns (date and dateTime): the value is not a
 * valid wall-clock at all (e.g. it carries a UTC offset). Failing only one means
 * the error comes from the form-consistency oneOf branch and is covered by
 * DATE_FORM_MESSAGE.
 */
function collectWallClockFailures(errors: ErrorObject[]): Set<string> {
  const byPath = new Map<string, Set<string>>();
  for (const err of errors) {
    if (err.keyword === "pattern" && DATE_PATTERN_PATHS.includes(err.schemaPath)) {
      const set = byPath.get(err.instancePath) ?? new Set<string>();
      set.add(err.schemaPath);
      byPath.set(err.instancePath, set);
    }
  }
  return new Set(
    [...byPath.entries()].filter(([, s]) => s.size === 2).map(([p]) => p),
  );
}

/**
 * Translates an ajv error into a readable `{path, message}`, or `null` when the
 * error is composition noise (anyOf/oneOf/allOf) already covered by a better message.
 */
function humanize(
  err: ErrorObject,
  wallClockFailures: Set<string>,
): { path: string; message: string } | null {
  const { keyword, instancePath, schemaPath, params } = err;

  // location.anyOf: "missing venue" + "missing onlineUrl" + "anyOf" → one single message.
  // Keyed on instancePath (not schemaPath): Ajv compiles $defs.location as its
  // own extracted schema (it's grown large enough, with `address`, to trigger
  // this), so errors inside it report schemaPath relative to that extracted
  // root (e.g. "#/anyOf/0/required") — the "$defs/location" text is gone.
  if (/(^|\.)location$/.test(humanPath(instancePath)) && /anyOf/.test(schemaPath)) {
    return { path: humanPath(instancePath), message: LOCATION_MESSAGE };
  }

  // Date patterns: invalid wall-clock → dedicated message; otherwise the oneOf covers it.
  if (keyword === "pattern" && DATE_PATTERN_PATHS.includes(schemaPath)) {
    return wallClockFailures.has(instancePath)
      ? { path: humanPath(instancePath), message: WALL_CLOCK_MESSAGE }
      : null;
  }

  // Date-form consistency oneOf ($defs/event → allOf/0/oneOf).
  // If some field already has a wall-clock error, this message would only add noise.
  if (keyword === "oneOf" && /allOf\/0\/oneOf$/.test(schemaPath)) {
    const hasWallClockError = [...wallClockFailures].some((p) =>
      p.startsWith(instancePath),
    );
    return hasWallClockError
      ? null
      : { path: humanPath(instancePath), message: DATE_FORM_MESSAGE };
  }

  // Instants (updatedAt, retrievedAt, feed.updatedAt).
  if (/\$defs\/instant/.test(schemaPath) && keyword === "pattern") {
    return { path: humanPath(instancePath), message: INSTANT_MESSAGE };
  }

  const path = humanPath(instancePath);

  switch (keyword) {
    case "required": {
      const prop = (params as { missingProperty: string }).missingProperty;
      return { path, message: `is missing required property "${prop}"` };
    }
    case "const": {
      // A specVersion this validator doesn't know is drift, not a typo: the
      // document may be perfectly valid against a newer spec. Say so, instead
      // of a bare "must be 0.2.0" that reads like the document is wrong.
      if (/\/specVersion$/.test(instancePath) || instancePath === "/specVersion") {
        return {
          path,
          message: `is not a spec version this validator knows (it implements OTE Spec ${specVersion}); if the spec has moved on, update @opentechevents/validate`,
        };
      }
      const allowed = (params as { allowedValue: unknown }).allowedValue;
      return { path, message: `must be ${JSON.stringify(allowed)}` };
    }
    case "enum": {
      const allowed = (params as { allowedValues: unknown[] }).allowedValues;
      return {
        path,
        message: `must be one of: ${allowed.map((v) => JSON.stringify(v)).join(", ")}`,
      };
    }
    case "type": {
      const type = (params as { type: string }).type;
      return { path, message: `must be of type ${type}` };
    }
    case "pattern": {
      const pattern = (params as { pattern: string }).pattern;
      if (pattern === USERINFO_PATTERN) return { path, message: USERINFO_MESSAGE };
      for (const [source, message] of PATTERN_BY_REGEX) {
        if (pattern === source) return { path, message };
      }
      for (const [re, message] of PATTERN_MESSAGES) {
        if (re.test(instancePath)) return { path, message };
      }
      return { path, message: `must match pattern ${pattern}` };
    }
    case "not": {
      for (const [re, message] of NOT_MESSAGES) {
        if (re.test(instancePath)) return { path, message };
      }
      return {
        path,
        message: URL_FIELD.test(instancePath) ? USERINFO_MESSAGE : "must not be set here",
      };
    }
    case "format": {
      const format = (params as { format: string }).format;
      // $defs.date carries both `pattern` and `format: "date"`; $defs.dateTime
      // carries both `pattern` and `format: "ote-local-date-time"`. Either
      // format check fires alongside the pattern check on the same malformed
      // value — WALL_CLOCK_MESSAGE already covers this path once.
      if (
        (format === "date" || format === "ote-local-date-time") &&
        wallClockFailures.has(instancePath)
      ) {
        return null;
      }
      return { path, message: `must be a valid ${format}` };
    }
    case "minLength":
      return { path, message: "must not be empty" };
    case "minItems": {
      const limit = (params as { limit: number }).limit;
      return {
        path,
        message: `must have at least ${limit} item${limit === 1 ? "" : "s"}`,
      };
    }
    case "minimum":
    case "maximum": {
      const { comparison, limit } = params as {
        comparison: string;
        limit: number;
      };
      return { path, message: `must be ${comparison} ${limit}` };
    }
    // Composition without a specific message: noise — more concrete errors exist.
    case "anyOf":
    case "oneOf":
    case "allOf":
    case "if":
      return null;
    default:
      return { path, message: err.message ?? `fails "${keyword}" constraint` };
  }
}

/** Keywords that describe the value itself rather than a failed alternative. */
const INFORMATIVE = (keyword: string): boolean =>
  !["type", "not", "oneOf", "anyOf", "allOf", "if"].includes(keyword);

/**
 * Drops the wreckage of the branch that was never the right one.
 *
 * When a value must match one of several shapes, ajv reports every branch's
 * failure. An image entry given as `{ "url": "http://…" }` fails the
 * *bare-string* branch twice — "must be string", and "must NOT be valid" from
 * the credentials check, which passes vacuously on a non-string and so trips
 * its own `not` — while the branch that actually applies reports the real
 * problem one level deeper, on `url`. Three messages, two of them about a
 * shape the publisher never used, and the useless one first.
 *
 * So a branch's `type`/`not` error is dropped when something more specific was
 * said at that path or below it. With no such error, they are kept: a value
 * that fits no branch at all still has to say so.
 */
function branchNoise(all: ErrorObject[]): Set<ErrorObject> {
  const noise = new Set<ErrorObject>();

  // A `not` that only forbids a *string* shape reports itself against values
  // that are not strings at all: the subschema it negates passes vacuously on
  // them, so the negation fails. The sibling "must be string" is the proof,
  // and telling a publisher their number carries credentials would be a lie.
  for (const err of all) {
    if (err.keyword !== "not") continue;
    const notAString = all.some(
      (other) =>
        other.instancePath === err.instancePath &&
        other.keyword === "type" &&
        (other.params as { type?: string }).type === "string",
    );
    if (notAString) noise.add(err);
  }

  const explains = (err: ErrorObject, path: string): boolean =>
    !noise.has(err) &&
    (INFORMATIVE(err.keyword) || err.keyword === "not") &&
    (err.instancePath === path || err.instancePath.startsWith(`${path}/`));

  for (const err of all) {
    if (err.keyword !== "type" && err.keyword !== "not") continue;
    if (all.some((other) => other !== err && explains(other, err.instancePath))) {
      noise.add(err);
    }
  }

  return noise;
}

/** Converts raw ajv errors into a deduplicated list of readable errors. */
export function formatAjvErrors(
  errors: ErrorObject[] | null | undefined,
): ValidationError[] {
  const all = errors ?? [];
  const wallClockFailures = collectWallClockFailures(all);
  const noise = branchNoise(all);
  const seen = new Set<string>();
  const out: ValidationError[] = [];
  for (const err of all) {
    if (noise.has(err)) continue;
    const humanized = humanize(err, wallClockFailures);
    if (!humanized) continue;
    const key = `${humanized.path}|${humanized.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(humanized);
  }
  return out;
}
