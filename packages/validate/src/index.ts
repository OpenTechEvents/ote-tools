import { Ajv2020 } from "ajv/dist/2020.js";
import ajvFormats from "ajv-formats";

// CJS↔ESM interop: at runtime the default binding IS the plugin; TS types it as a namespace.
const addFormats = ajvFormats as unknown as typeof ajvFormats.default;

import { formatAjvErrors, type ValidationError } from "./errors.js";
import { specVersion } from "./schemas.generated.js";
import { eventSchema, feedSchema } from "./schemas.js";

export type { ValidationError } from "./errors.js";
export { eventSchema, feedSchema } from "./schemas.js";

/** Result of validating an OTE document. */
export interface ValidationResult {
  valid: boolean;
  /** Empty when `valid` is true. */
  errors: ValidationError[];
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(eventSchema);
ajv.addSchema(feedSchema);

const validateEventFn = ajv.getSchema(eventSchema.$id as string);
const validateFeedFn = ajv.getSchema(feedSchema.$id as string);
if (!validateEventFn || !validateFeedFn) {
  throw new Error("Vendored OTE schemas failed to compile");
}

function run(
  fn: NonNullable<ReturnType<typeof ajv.getSchema>>,
  json: unknown,
): ValidationResult {
  const valid = fn(json) as boolean;
  return { valid, errors: valid ? [] : formatAjvErrors(fn.errors) };
}

/**
 * Validates an (already-parsed) OTE Event document against the v0.2 schema.
 * Pure function: reads no files, makes no network calls.
 */
export function validateEvent(json: unknown): ValidationResult {
  return run(validateEventFn!, json);
}

/**
 * Validates an (already-parsed) OTE Feed document against the v0.2 schema.
 * Pure function: reads no files, makes no network calls.
 */
export function validateFeed(json: unknown): ValidationResult {
  return run(validateFeedFn!, json);
}

// Minimal valid feed envelope for validateEventInFeed. Constant values are
// never reported: any error a wrapped validation yields comes from the event.
const FEED_ENVELOPE = {
  specVersion,
  title: "validateEventInFeed envelope",
  license: "CC0-1.0",
  updatedAt: "2026-01-01T00:00:00Z",
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
