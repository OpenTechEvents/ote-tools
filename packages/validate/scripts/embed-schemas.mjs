// Regenerates src/schemas.generated.ts from @opentechevents/schema — the npm
// package the spec repo publishes. The two validity schemas and the two
// recommended (quality) schemas are pure JSON data, so they're embedded as
// TypeScript constants: this package can be bundled for the browser (no
// node:fs at runtime), and the dependency's pinned version is what ties each
// release of the validator to a release of the spec. Run with: pnpm gen
//
// customFormats/customKeywords/annotationKeywords are NOT embedded here: they
// carry real validator functions (e.g. a full BCP-47 subtag checker backed by
// its own data file), not JSON-serializable data. Those are imported directly
// from @opentechevents/schema at runtime instead (see src/index.ts) — which is
// why the package is a runtime `dependencies` entry, not devDependencies-only
// as it was under v0.2, when the package only needed schema JSON.
//
// TEMPORARY: @opentechevents/schema@0.3.0 is not published to npm yet (the
// v0.3 spec is still a draft in the sibling opentechevents-spec repo), so
// package.json currently points at it via `link:../../../opentechevents-spec`.
// Swap that back to a real pinned version once 0.3.0 is published, then
// re-run `pnpm gen` and re-run tests — the guard test below will surface any
// last-minute drift between the draft and the published release.
//
// Syncing with a new spec version = bump the dependency (Dependabot opens
// that PR once this is on a real registry version), run `pnpm gen`, review
// the diff. The guard test (test/schemas-generated.test.ts) fails until the
// re-embed happens, so a bump can never land with stale schemas.
import { writeFileSync } from "node:fs";
import {
  eventSchema,
  eventRecommendedSchema,
  feedSchema,
  feedRecommendedSchema,
  specVersion,
} from "@opentechevents/schema";

const outFile = new URL("../src/schemas.generated.ts", import.meta.url);

// Re-stringify normalizes formatting regardless of how the package ships them.
const embed = (schema) => JSON.stringify(schema, null, 2);

const banner = `// GENERATED FILE — DO NOT EDIT.
// Source of truth: the @opentechevents/schema package (its version is pinned in package.json).
// Regenerate with: pnpm gen
// A guard test (test/schemas-generated.test.ts) fails if this file drifts.

import type { AnySchemaObject } from "ajv";
`;

const body = `
/** The OTE Spec version these schemas describe. */
export const specVersion = ${JSON.stringify(specVersion)};

/** OTE JSON Schema for Event documents (from @opentechevents/schema). */
export const eventSchema: AnySchemaObject = ${embed(eventSchema)};

/** OTE JSON Schema for Feed documents (from @opentechevents/schema). */
export const feedSchema: AnySchemaObject = ${embed(feedSchema)};

/**
 * Quality profile for Event documents, NOT validity: a document that fails
 * this is still a valid OTE document. References eventSchema by $id.
 */
export const eventRecommendedSchema: AnySchemaObject = ${embed(eventRecommendedSchema)};

/**
 * Quality profile for Feed documents, NOT validity — see eventRecommendedSchema.
 */
export const feedRecommendedSchema: AnySchemaObject = ${embed(feedRecommendedSchema)};
`;

writeFileSync(outFile, banner + body);
console.log("Wrote src/schemas.generated.ts");
