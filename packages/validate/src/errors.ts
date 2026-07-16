import type { ErrorObject } from "ajv";

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
  "must be a date (YYYY-MM-DD) or a local date-time (YYYY-MM-DDTHH:MM[:SS]); a UTC offset is never allowed here — use `timezone` instead";

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
  [/\/(url|onlineUrl|licenseUrl)$/, "must be an http(s) URL"],
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
  if (/\$defs\/location/.test(schemaPath) && /anyOf/.test(schemaPath)) {
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
      for (const [re, message] of PATTERN_MESSAGES) {
        if (re.test(instancePath)) return { path, message };
      }
      const pattern = (params as { pattern: string }).pattern;
      return { path, message: `must match pattern ${pattern}` };
    }
    case "format": {
      const format = (params as { format: string }).format;
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

/** Converts raw ajv errors into a deduplicated list of readable errors. */
export function formatAjvErrors(
  errors: ErrorObject[] | null | undefined,
): ValidationError[] {
  const all = errors ?? [];
  const wallClockFailures = collectWallClockFailures(all);
  const seen = new Set<string>();
  const out: ValidationError[] = [];
  for (const err of all) {
    const humanized = humanize(err, wallClockFailures);
    if (!humanized) continue;
    const key = `${humanized.path}|${humanized.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(humanized);
  }
  return out;
}
