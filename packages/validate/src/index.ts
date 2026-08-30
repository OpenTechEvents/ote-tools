// The validators are compiled from the schemas at codegen time, by Ajv's
// standalone mode, into plain JavaScript: no Ajv here at runtime, no schema
// compilation on load, and — the point — no `new Function`, so a page running
// this needs no 'unsafe-eval' in its CSP. See
// scripts/compile-validators.mjs, and src/compiled-scope.ts for the formats
// and keywords that code closes over.
//
// Two APIs, and the difference matters:
//
//   - `validateFeed`/`validateEvent` (and the recommended-profile pair) are
//     synchronous and check against the LATEST published version. They are
//     the right thing for a tool that produces documents (it writes the
//     current version) and the wrong thing for one that judges documents it
//     did not write.
//   - `validateDocument` reads the version the document declares and checks
//     it against *that* — which is the only way to answer "is this document
//     valid?" without assuming the publisher upgrades on our schedule. It is
//     async because a version's schemas are loaded on demand (see loader.ts).
import {
  validateEvent as validateEventFn,
  validateFeed as validateFeedFn,
  checkEventRecommended as checkEventRecommendedFn,
  checkFeedRecommended as checkFeedRecommendedFn,
  specVersion,
} from "./generated/latest.js";

import { type ValidationError } from "./errors.js";
import { loadValidators, run, type ValidationResult } from "./loader.js";
import {
  classifySpecVersion,
  declaredSpecVersion,
  describeOverride,
  describeSpecVersion,
  versionToCheck,
  type SpecVersionLink,
  type SpecVersionVerdict,
} from "./versions.js";

export type { ValidationError } from "./errors.js";
export type { ValidationResult, VersionValidators } from "./loader.js";
export { loadValidators } from "./loader.js";
export type { SpecVersionLink, SpecVersionVerdict } from "./versions.js";
export {
  classifySpecVersion,
  declaredSpecVersion,
  describeOverride,
  describeSpecVersion,
  isSupported,
  schemaUrl,
  versionToCheck,
  CHANGELOG_URL,
  LATEST_VERSION,
  PUBLISHED_VERSIONS,
  SUPPORTED_VERSIONS,
  SUPPORT_WINDOW_MINORS,
  VERSIONS_WITH_RECOMMENDED,
} from "./versions.js";
export {
  eventSchema,
  eventRecommendedSchema,
  feedSchema,
  feedRecommendedSchema,
  specVersion,
} from "./schemas.js";

/**
 * Validates an (already-parsed) OTE Event document against the latest
 * published schema. Pure function: reads no files, makes no network calls.
 *
 * Checks against the latest version, whatever the document declares — so a
 * document from an earlier release fails here on `specVersion` alone. Use
 * `validateDocument` for documents somebody else published.
 */
export function validateEvent(json: unknown): ValidationResult {
  return run(validateEventFn, json, specVersion);
}

/**
 * Validates an (already-parsed) OTE Feed document against the latest
 * published schema — see `validateEvent` for what "latest" costs.
 */
export function validateFeed(json: unknown): ValidationResult {
  return run(validateFeedFn, json, specVersion);
}

/**
 * Checks an (already-parsed) OTE Event document against the latest
 * *recommended* (quality) profile. Unlike validateEvent, failures here are
 * never rejections — a document that fails is still a valid OTE document;
 * report these as warnings only. `valid: false` here means "missing fields
 * that help this event be found, filtered and subscribed to", not
 * "malformed".
 */
export function checkEventRecommended(json: unknown): ValidationResult {
  return run(checkEventRecommendedFn, json, specVersion);
}

/**
 * Checks an (already-parsed) OTE Feed document against the latest
 * *recommended* (quality) profile — see checkEventRecommended.
 */
export function checkFeedRecommended(json: unknown): ValidationResult {
  return run(checkFeedRecommendedFn, json, specVersion);
}

/** Which schema a document is checked against. */
export type DocumentKind = "feed" | "event";

export interface ValidateDocumentOptions {
  /**
   * Feed or event. Required: telling the two apart is a document-shape
   * question this package deliberately does not own (`@opentechevents/discover-feed`
   * does), and guessing wrong here would silently validate against the wrong
   * schema.
   */
  kind: DocumentKind;
  /**
   * Checks against this version instead of the declared one. The migration
   * rehearsal: "what would 0.4 break?", asked before committing to the
   * answer. Undefined — the default — means the document decides.
   */
  version?: string;
}

/** A document's verdict, and which version's rules produced it. */
export interface DocumentReport {
  kind: DocumentKind;
  /** The version whose schemas were applied; null when none could be. */
  checkedVersion: string | null;
  /** What the document says it is. Null when it says nothing usable. */
  declaredVersion: string | null;
  /** What the support policy makes of the declared version. */
  verdict: SpecVersionVerdict;
  /** True when `checkedVersion` came from the caller, not the document. */
  overridden: boolean;
  /** MUST-level: schema violations, plus a version error where policy says so. */
  errors: ValidationError[];
  /** SHOULD-level: unmet recommendations. These never affect `valid`. */
  recommendations: ValidationError[];
  /**
   * False when the checked version predates the recommended profile (before
   * 0.3.0): `recommendations` is empty because there was nothing to check,
   * not because the document met everything.
   */
  recommendedProfileChecked: boolean;
  /**
   * Things worth saying that are not defects: an older-but-supported release,
   * a version chosen by hand. A UI shows these away from the verdict — they
   * never make a document invalid.
   *
   * `links` are kept out of the sentence rather than written into it, so a
   * page can render them as links instead of printing a bare URL mid-text.
   */
  notices: SpecVersionNotice[];
  /** True when nothing MUST-level failed. */
  valid: boolean;
}

/** One thing worth saying about the version, with anywhere worth going. */
export interface SpecVersionNotice {
  message: string;
  links: SpecVersionLink[];
}

/** Where a version complaint points in the document. */
const versionErrorPath = (declared: string | null): string =>
  declared === null ? "(document)" : "specVersion";

/**
 * Validates a document against the version it declares.
 *
 * The rules, in one place (the policy itself is documented in versions.ts):
 * inside the support window a document is measured against its own version
 * and being behind is a notice, never an error; outside it, the document is
 * still measured against its own version but migration is required; and a
 * version that was never published leaves nothing to measure against at all.
 */
export async function validateDocument(
  json: unknown,
  options: ValidateDocumentOptions,
): Promise<DocumentReport> {
  const declared = declaredSpecVersion(json);
  const verdict = classifySpecVersion(declared);
  const overridden = options.version !== undefined && options.version !== declared;
  const checkedVersion = options.version ?? versionToCheck(verdict);

  const notices: SpecVersionNotice[] = [];
  const errors: ValidationError[] = [];

  if (overridden) {
    const note = describeOverride(declared, options.version!);
    if (note) notices.push({ message: note, links: [] });
  } else {
    // The policy's own words about the declared version — a notice for a
    // supported release, an error for one that is out of support or unknown.
    const description = describeSpecVersion(verdict);
    if (description?.severity === "notice") {
      notices.push({ message: description.message, links: description.links });
    }
    if (description?.severity === "error") {
      // The links go with the notice channel; an error carries its sentence,
      // and the version selector above it is what the reader acts on.
      errors.push({ path: versionErrorPath(declared), message: description.message });
      notices.push({ message: "Where to go next:", links: description.links });
    }
  }

  if (checkedVersion === null) {
    // No published version to apply: the version error above is the whole
    // report. Running some other version's schemas here would produce
    // findings measured against rules this document never claimed.
    return {
      kind: options.kind,
      checkedVersion: null,
      declaredVersion: declared,
      verdict,
      overridden,
      errors,
      recommendations: [],
      recommendedProfileChecked: false,
      notices,
      valid: false,
    };
  }

  const validators = await loadValidators(checkedVersion);
  const validity =
    options.kind === "feed"
      ? validators.validateFeed(json)
      : validators.validateEvent(json);
  const recommendedCheck =
    options.kind === "feed" ? validators.checkFeedRecommended : validators.checkEventRecommended;
  const recommended = recommendedCheck ? recommendedCheck(json) : null;

  errors.push(...validity.errors);

  return {
    kind: options.kind,
    checkedVersion,
    declaredVersion: declared,
    verdict,
    overridden,
    errors,
    recommendations: recommended?.errors ?? [],
    recommendedProfileChecked: recommended !== null,
    notices,
    valid: errors.length === 0,
  };
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

/** Rewrites feed-relative error paths to be relative to the event itself. */
function unwrapEventPaths(errors: ValidationError[]): ValidationError[] {
  return errors.map(({ path, message }) => ({
    message,
    path:
      path === EVENT_PATH_PREFIX
        ? "(document)"
        : path.startsWith(`${EVENT_PATH_PREFIX}.`)
          ? path.slice(EVENT_PATH_PREFIX.length + 1)
          : path,
  }));
}

/**
 * Validates a single event in FEED context: specVersion and license are
 * inherited from the feed, so they are not required (unlike a standalone
 * event document). This is the check for an events/<slug>.json file, which
 * is a feed fragment — `build-feed --check` applies the same rules by
 * validating the assembled feed. Error paths are relative to the event.
 *
 * The latest version, deliberately: an events/<slug>.json file is a file
 * being *written* in this repo's own kit, not a document somebody else
 * published, and what it should be written against is the current release.
 */
export function validateEventInFeed(json: unknown): ValidationResult {
  const result = validateFeed({ ...FEED_ENVELOPE, events: [json] });
  return { valid: result.valid, errors: unwrapEventPaths(result.errors) };
}
