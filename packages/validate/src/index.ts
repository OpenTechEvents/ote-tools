import { Ajv2020 } from "ajv/dist/2020.js";
import ajvFormats from "ajv-formats";

// CJS↔ESM interop: at runtime the default binding IS the plugin; TS types it as a namespace.
const addFormats = ajvFormats as unknown as typeof ajvFormats.default;

import { formatAjvErrors, type ValidationError } from "./errors.js";
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
