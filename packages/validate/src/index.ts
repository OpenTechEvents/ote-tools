import { Ajv2020 } from "ajv/dist/2020.js";
import type { KeywordDefinition } from "ajv";
import ajvFormats from "ajv-formats";
// customFormats/customKeywords/annotationKeywords carry real validator
// functions (not JSON-serializable schema data), so — unlike eventSchema/
// feedSchema — they are imported directly from @opentechevents/schema at
// runtime rather than embedded via `pnpm gen`. This is why the package is a
// runtime dependency (not devDependencies-only, as under v0.2): Ajv needs
// these functions available whenever this module runs, not just at codegen
// time. There is no drift guard for these three because there is no copy to
// drift — the import always reflects whatever version is installed.
import { annotationKeywords, customFormats, customKeywords } from "@opentechevents/schema";

// CJS↔ESM interop: at runtime the default binding IS the plugin; TS types it as a namespace.
const addFormats = ajvFormats as unknown as typeof ajvFormats.default;

import { formatAjvErrors, type ValidationError } from "./errors.js";
import { specVersion } from "./schemas.generated.js";
import {
  eventSchema,
  eventRecommendedSchema,
  feedSchema,
  feedRecommendedSchema,
} from "./schemas.js";

export type { ValidationError } from "./errors.js";
export {
  eventSchema,
  eventRecommendedSchema,
  feedSchema,
  feedRecommendedSchema,
  specVersion,
} from "./schemas.js";

/** Result of validating an OTE document. */
export interface ValidationResult {
  valid: boolean;
  /** Empty when `valid` is true. */
  errors: ValidationError[];
}

/**
 * Builds an Ajv instance with every keyword/format the v0.3 schemas reference
 * already registered. `strict: true` (unlike v0.2's `strict: false`) means Ajv
 * refuses to compile if any of them is missing, instead of silently ignoring
 * unknown keywords/formats — the schemas' own structural rules (date
 * ordering, duplicate-ID rejection, translation-key collisions, etc.) would
 * otherwise pass compilation but never actually run.
 */
function buildAjv(): Ajv2020 {
  // strictRequired is relaxed on its own: the schemas' location/address
  // anyOf branches list `required` without repeating `properties` in the
  // same subschema (the properties live on the parent $defs object instead),
  // which strictRequired flags as a possible typo. Every other strict check
  // — in particular, rejecting unregistered keywords/formats, which is the
  // actual risk this migration cares about — stays on.
  const instance = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
  addFormats(instance);
  // @opentechevents/schema types these loosely (plain validate functions, not
  // Ajv's own discriminated KeywordDefinition union) — cast at this single
  // interop boundary rather than losing strict typing throughout this file.
  for (const keyword of annotationKeywords) {
    instance.addKeyword(keyword as unknown as KeywordDefinition);
  }
  for (const format of customFormats) instance.addFormat(format.name, format.validate);
  for (const keyword of customKeywords) {
    instance.addKeyword(keyword as unknown as KeywordDefinition);
  }
  return instance;
}

const ajv = buildAjv();
ajv.addSchema(eventSchema);
ajv.addSchema(feedSchema);

const validateEventFn = ajv.getSchema(eventSchema.$id as string);
const validateFeedFn = ajv.getSchema(feedSchema.$id as string);
if (!validateEventFn || !validateFeedFn) {
  throw new Error("Vendored OTE schemas failed to compile");
}

// Separate Ajv instance for the recommended (quality, warn-only) profiles:
// they reference the validity schemas by $id via $ref, so those must be
// registered here too, but keeping this compilation separate from the
// validity-only `ajv` instance above keeps `validateEvent`/`validateFeed`
// unaffected by whatever the recommended schemas add.
const recommendedAjv = buildAjv();
recommendedAjv.addSchema(eventSchema);
recommendedAjv.addSchema(feedSchema);
recommendedAjv.addSchema(eventRecommendedSchema);
recommendedAjv.addSchema(feedRecommendedSchema);

const checkEventRecommendedFn = recommendedAjv.getSchema(eventRecommendedSchema.$id as string);
const checkFeedRecommendedFn = recommendedAjv.getSchema(feedRecommendedSchema.$id as string);
if (!checkEventRecommendedFn || !checkFeedRecommendedFn) {
  throw new Error("Vendored OTE recommended schemas failed to compile");
}

function run(
  fn: NonNullable<ReturnType<typeof ajv.getSchema>>,
  json: unknown,
): ValidationResult {
  const valid = fn(json) as boolean;
  return { valid, errors: valid ? [] : formatAjvErrors(fn.errors) };
}

/**
 * Validates an (already-parsed) OTE Event document against the v0.3 schema.
 * Pure function: reads no files, makes no network calls.
 */
export function validateEvent(json: unknown): ValidationResult {
  return run(validateEventFn!, json);
}

/**
 * Validates an (already-parsed) OTE Feed document against the v0.3 schema.
 * Pure function: reads no files, makes no network calls.
 */
export function validateFeed(json: unknown): ValidationResult {
  return run(validateFeedFn!, json);
}

/**
 * Checks an (already-parsed) OTE Event document against the v0.3 *recommended*
 * (quality) profile. Unlike validateEvent, failures here are never rejections
 * — a document that fails is still a valid OTE document; report these as
 * warnings only. `valid: false` here means "missing fields that help this
 * event be found, filtered and subscribed to", not "malformed".
 */
export function checkEventRecommended(json: unknown): ValidationResult {
  return run(checkEventRecommendedFn!, json);
}

/**
 * Checks an (already-parsed) OTE Feed document against the v0.3 *recommended*
 * (quality) profile — see checkEventRecommended.
 */
export function checkFeedRecommended(json: unknown): ValidationResult {
  return run(checkFeedRecommendedFn!, json);
}

// Minimal valid feed envelope for validateEventInFeed. Constant values are
// never reported: any error a wrapped validation yields comes from the event.
const FEED_ENVELOPE = {
  specVersion,
  title: "validateEventInFeed envelope",
  license: "CC0-1.0",
  // Far enough in the future that no real event fixture's updatedAt can
  // exceed it — the eventsNotNewerThanFeed custom keyword rejects a feed
  // whose own updatedAt is earlier than any event it contains.
  updatedAt: "2099-01-01T00:00:00Z",
};

const EVENT_PATH_PREFIX = "events[0]";

/**
 * Validates a single event in FEED context: specVersion and license are
 * inherited from the feed, so they are not required (unlike a standalone
 * event document). This is the check for an events/<slug>.json file, which
 * is a feed fragment — `build-feed --check` applies the same rules by
 * validating the assembled feed. Error paths are relative to the event.
 */
export function validateEventInFeed(json: unknown): ValidationResult {
  const result = run(validateFeedFn!, { ...FEED_ENVELOPE, events: [json] });
  return {
    valid: result.valid,
    errors: result.errors.map(({ path, message }) => ({
      message,
      path:
        path === EVENT_PATH_PREFIX
          ? "(document)"
          : path.startsWith(`${EVENT_PATH_PREFIX}.`)
            ? path.slice(EVENT_PATH_PREFIX.length + 1)
            : path,
    })),
  };
}
