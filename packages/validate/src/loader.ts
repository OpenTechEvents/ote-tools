/**
 * Loads one spec version's compiled validators, on demand and once.
 *
 * Every published version is embedded (see scripts/embed-schemas.mjs), and
 * each one's compiled schema code is a few hundred kilobytes. Shipping all of
 * them to every page would trade the old wrong answer ("your 0.3 feed is
 * invalid") for a slow right one, so each version sits behind its own dynamic
 * `import()` and a bundler puts it in its own chunk. A page that only ever
 * meets 0.4 documents downloads 0.4.
 *
 * Nothing is compiled here — the validators were compiled by Ajv at codegen
 * time. "Loading" is fetching a module, which is why the cache below is keyed
 * by version and holds the *promise*: two documents of the same version
 * validated in the same tick share one download.
 */

import { formatAjvErrors, type ValidationError } from "./errors.js";
import { VERSION_MODULES } from "./generated/modules.js";
import { PUBLISHED_VERSIONS } from "./generated/versions.js";

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
export type CompiledValidator = ((json: unknown) => boolean) & {
  errors?: Parameters<typeof formatAjvErrors>[0];
};

/**
 * What one version's generated module exports. The recommended pair is
 * optional because the recommended (quality) profile only exists from 0.3 on.
 */
export interface CompiledModule {
  validateEvent: CompiledValidator;
  validateFeed: CompiledValidator;
  checkEventRecommended?: CompiledValidator;
  checkFeedRecommended?: CompiledValidator;
}

/** One version's validators, wrapped so they return readable errors. */
export interface VersionValidators {
  /** The version these were compiled from; every message cites it. */
  version: string;
  validateEvent(json: unknown): ValidationResult;
  validateFeed(json: unknown): ValidationResult;
  /** Null before 0.3.0, where the recommended profile was introduced. */
  checkEventRecommended: ((json: unknown) => ValidationResult) | null;
  checkFeedRecommended: ((json: unknown) => ValidationResult) | null;
}

/**
 * Runs a compiled validator and translates Ajv's errors.
 *
 * `version` reaches the messages: an error that says "must be 0.4.0" while
 * the document was measured against 0.3.0 is the same confusion this package
 * is trying to remove, one level down.
 */
export function run(fn: CompiledValidator, json: unknown, version: string): ValidationResult {
  const valid = fn(json);
  return { valid, errors: valid ? [] : formatAjvErrors(fn.errors, json, version) };
}

function wrap(module: CompiledModule, version: string): VersionValidators {
  const optional = (validator: CompiledValidator | undefined) =>
    validator ? (json: unknown) => run(validator, json, version) : null;
  return {
    version,
    validateEvent: (json) => run(module.validateEvent, json, version),
    validateFeed: (json) => run(module.validateFeed, json, version),
    checkEventRecommended: optional(module.checkEventRecommended),
    checkFeedRecommended: optional(module.checkFeedRecommended),
  };
}

const cache = new Map<string, Promise<VersionValidators>>();

/**
 * The validators for one published version. Rejects for a version this
 * package does not embed — callers decide what a document declaring an
 * unknown version means (see `classifySpecVersion`), and it is never "check
 * it against something else".
 */
export function loadValidators(version: string): Promise<VersionValidators> {
  const cached = cache.get(version);
  if (cached) return cached;

  const load = VERSION_MODULES[version];
  if (!load) {
    return Promise.reject(
      new Error(
        `@opentechevents/validate embeds no schemas for OTE Spec "${version}". ` +
          `Published versions: ${PUBLISHED_VERSIONS.join(", ")}.`,
      ),
    );
  }

  const pending = load().then((module) => wrap(module, version));
  cache.set(version, pending);
  // A failed import must not be cached as the answer for every later call.
  pending.catch(() => cache.delete(version));
  return pending;
}
