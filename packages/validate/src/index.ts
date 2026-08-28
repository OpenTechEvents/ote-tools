// The four validators are compiled from the schemas at codegen time, by Ajv's
// standalone mode, into plain JavaScript: no Ajv here at runtime, no schema
// compilation on load, and — the point — no `new Function`, so a page running
// this needs no 'unsafe-eval' in its CSP. See
// scripts/compile-validators.mjs, and src/compiled-scope.ts for the formats
// and keywords that code closes over.
import {
  validateEvent as validateEventFn,
  validateFeed as validateFeedFn,
  checkEventRecommended as checkEventRecommendedFn,
  checkFeedRecommended as checkFeedRecommendedFn,
} from "./validators.compiled.generated.js";

import { formatAjvErrors, type ValidationError } from "./errors.js";
import { specVersion } from "./schemas.generated.js";

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
 * A compiled validator: returns whether the document is valid and, when it is
 * not, leaves Ajv's own error objects on its `errors` property. Same contract
 * as the functions `ajv.compile()` used to return at runtime — the schemas'
 * structural rules (date ordering, duplicate-ID rejection, translation-key
 * collisions, etc.) are compiled in, not re-derived here.
 */
type CompiledValidator = ((json: unknown) => boolean) & {
  errors?: Parameters<typeof formatAjvErrors>[0];
};

function run(fn: CompiledValidator, json: unknown): ValidationResult {
  const valid = fn(json);
  return { valid, errors: valid ? [] : formatAjvErrors(fn.errors, json) };
}

/**
 * Validates an (already-parsed) OTE Event document against the v0.4 schema.
 * Pure function: reads no files, makes no network calls.
 */
export function validateEvent(json: unknown): ValidationResult {
  return run(validateEventFn, json);
}

/**
 * Validates an (already-parsed) OTE Feed document against the v0.4 schema.
 * Pure function: reads no files, makes no network calls.
 */
export function validateFeed(json: unknown): ValidationResult {
  return run(validateFeedFn, json);
}

/**
 * Checks an (already-parsed) OTE Event document against the v0.4 *recommended*
 * (quality) profile. Unlike validateEvent, failures here are never rejections
 * — a document that fails is still a valid OTE document; report these as
 * warnings only. `valid: false` here means "missing fields that help this
 * event be found, filtered and subscribed to", not "malformed".
 */
export function checkEventRecommended(json: unknown): ValidationResult {
  return run(checkEventRecommendedFn, json);
}

/**
 * Checks an (already-parsed) OTE Feed document against the v0.4 *recommended*
 * (quality) profile — see checkEventRecommended.
 */
export function checkFeedRecommended(json: unknown): ValidationResult {
  return run(checkFeedRecommendedFn, json);
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
  const result = run(validateFeedFn, { ...FEED_ENVELOPE, events: [json] });
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
