// Regenerates the three generated modules from @opentechevents/schema — the
// npm package the spec repo publishes. Run with: pnpm gen
//
// schemas.generated.ts: the two validity schemas and the two recommended
// (quality) schemas are pure JSON data, embedded as TypeScript constants so
// this package can be bundled for the browser (no node:fs, no node:module
// at runtime) — @opentechevents/validate is consumed by apps/editor's
// esbuild build, which targets platform: "browser".
//
// validators.generated.ts: customFormats/customKeywords/annotationKeywords
// carry real validator functions (e.g. a full BCP-47 subtag checker backed
// by its own data file), not JSON-serializable data — they can't be embedded
// the way the schemas above are. They also can't be imported live from
// @opentechevents/schema at runtime the way the schemas' *shape* could:
// @opentechevents/schema's own index.js uses node:module's createRequire to
// load its two JSON data files, which esbuild's browser platform can't
// resolve — importing it live would break every browser bundle that depends
// on @opentechevents/validate (this broke apps/editor's build when first
// tried). So this vendors their exact source text here at codegen time —
// verbatim, not reimplemented, to avoid silent behavioral drift — with the
// one remaining require() call (its language-subtags.json data) inlined as
// an embedded object literal exactly like the schemas above.
//
// validators.compiled.generated.ts: the schemas above, compiled by Ajv into
// standalone validator code so nothing has to be compiled — that is, `eval`ed
// — at runtime. Written by scripts/compile-validators.mjs; see its header.
//
// Because of this, @opentechevents/schema stays a devDependency (only this
// script imports it, and only at codegen time in Node) — never a runtime
// dependency, and never fetched at runtime either way.
//
// package.json pins an exact registry version of @opentechevents/schema —
// never a `link:` to a local checkout of the spec repo, which would make the
// generated modules depend on whatever is uncommitted next door.
//
// Syncing with a new spec version = bump that pin (Dependabot opens the PR
// when the spec releases), run `pnpm gen`, review the diff by hand. The guard
// tests (test/schemas-generated.test.ts, test/validators-generated.test.ts,
// test/compiled-validators.test.ts) fail until the re-embed happens, so a
// bump can never land stale.
import { readFileSync, writeFileSync } from "node:fs";
import { compiledValidatorsSource } from "./compile-validators.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  eventSchema,
  eventRecommendedSchema,
  feedSchema,
  feedRecommendedSchema,
  specVersion,
} from "@opentechevents/schema";

// Re-stringify normalizes formatting regardless of how the package ships them.
const embed = (schema) => JSON.stringify(schema, null, 2);

const schemasOutFile = new URL("../src/schemas.generated.ts", import.meta.url);

const schemasBanner = `// GENERATED FILE — DO NOT EDIT.
// Source of truth: the @opentechevents/schema package (its version is pinned in package.json).
// Regenerate with: pnpm gen
// A guard test (test/schemas-generated.test.ts) fails if this file drifts.

import type { AnySchemaObject } from "ajv";
`;

const schemasBody = `
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

writeFileSync(schemasOutFile, schemasBanner + schemasBody);
console.log("Wrote src/schemas.generated.ts");

// --- Vendor the validator-function portion of @opentechevents/schema ------
const schemaPackageEntry = fileURLToPath(import.meta.resolve("@opentechevents/schema"));
const schemaPackageDir = dirname(schemaPackageEntry);
const schemaIndexSource = readFileSync(schemaPackageEntry, "utf8");
const languageSubtags = JSON.parse(
  readFileSync(join(schemaPackageDir, "language-subtags.json"), "utf8"),
);

const VENDOR_ANCHOR = "export const annotationKeywords";
const anchorIndex = schemaIndexSource.indexOf(VENDOR_ANCHOR);
if (anchorIndex === -1) {
  throw new Error(
    `embed-schemas.mjs: could not find "${VENDOR_ANCHOR}" in @opentechevents/schema's ` +
      "index.js — its layout changed upstream; update the vendoring logic in this script.",
  );
}

const REQUIRE_LINE = 'const languageSubtags = require("./language-subtags.json");';
if (!schemaIndexSource.includes(REQUIRE_LINE)) {
  throw new Error(
    "embed-schemas.mjs: could not find the expected language-subtags require() line — " +
      "@opentechevents/schema's index.js changed upstream; update the vendoring logic in this script.",
  );
}

const vendoredValidators = schemaIndexSource
  .slice(anchorIndex)
  .replace(REQUIRE_LINE, `const languageSubtags = ${JSON.stringify(languageSubtags)};`);

const validatorsOutFile = new URL("../src/validators.generated.ts", import.meta.url);

const validatorsBanner = `// GENERATED FILE — DO NOT EDIT.
// Vendored verbatim from @opentechevents/schema's index.js (its version is
// pinned in package.json) — see scripts/embed-schemas.mjs for why this is
// vendored source, not a live runtime import or a JSON embed.
// Regenerate with: pnpm gen
// Guard tests (test/validators-generated.test.ts) fail if this drifts.
// @ts-nocheck -- vendored plain JS, not authored/typed here.

`;

writeFileSync(validatorsOutFile, validatorsBanner + vendoredValidators);
console.log("Wrote src/validators.generated.ts");

// --- Compile the schemas into standalone validator code -------------------
// Last, and from the same @opentechevents/schema version: the two files above
// are what the browser ships as data, this is what it runs.
writeFileSync(
  new URL("../src/validators.compiled.generated.ts", import.meta.url),
  compiledValidatorsSource(),
);
console.log("Wrote src/validators.compiled.generated.ts");
