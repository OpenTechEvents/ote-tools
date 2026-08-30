// Regenerates src/generated/ from @opentechevents/schema — the npm package
// the spec repo publishes. Run with: pnpm gen
//
// EVERY published spec version is embedded, not just the pinned one. A feed
// declares the version it was written against, and `feed.schema.json` pins
// that version with a `const` — so a perfectly valid 0.3 feed fails the 0.4
// schema with a single error about `specVersion` and nothing else. Embedding
// one version means answering "is this document valid?" with the wrong
// question ("would it be valid if it claimed to be the newest release?").
// The support policy over these versions lives in src/versions.ts.
//
// One directory per version, each with two generated modules:
//
// generated/<vX.Y>/schemas.ts: that version's validity schemas and (from 0.3
// on) its recommended (quality) schemas, as pure JSON data embedded in
// TypeScript so this package can be bundled for the browser (no node:fs, no
// node:module at runtime) — @opentechevents/validate is consumed by
// apps/editor's and apps/validator's esbuild builds, which target
// platform: "browser".
//
// generated/<vX.Y>/validators.compiled.ts: those schemas, compiled by Ajv
// into standalone validator code so nothing has to be compiled — that is,
// `eval`ed — at runtime. Written by scripts/compile-validators.mjs; see its
// header.
//
// Plus two modules that tie the set together:
//
// generated/versions.ts: the version list itself, derived from the package's
// export map (see spec-versions.mjs) so a spec release cannot be half
// adopted.
//
// generated/modules.ts: one dynamic `import()` per version, which is what
// keeps the browser paying for the versions it actually meets rather than
// all of them. See src/loader.ts.
//
// src/validators.generated.ts is shared by every version:
// customFormats/customKeywords/annotationKeywords carry real validator
// functions (e.g. a full BCP-47 subtag checker backed by its own data file),
// not JSON-serializable data — they can't be embedded the way the schemas
// above are. They also can't be imported live from @opentechevents/schema at
// runtime the way the schemas' *shape* could: @opentechevents/schema's own
// index.js uses node:module's createRequire to load its two JSON data files,
// which esbuild's browser platform can't resolve — importing it live would
// break every browser bundle that depends on @opentechevents/validate (this
// broke apps/editor's build when first tried). So this vendors their exact
// source text here at codegen time — verbatim, not reimplemented, to avoid
// silent behavioral drift — with the one remaining require() call (its
// language-subtags.json data) inlined as an embedded object literal exactly
// like the schemas above.
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
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  compiledValidatorsSource,
  latestModule,
  modulesModule,
  schemasModule,
  versionsModule,
} from "./generate-sources.mjs";
import { publishedVersions } from "./spec-versions.mjs";

const generatedDir = fileURLToPath(new URL("../src/generated/", import.meta.url));

// Blown away and rewritten: a version directory left behind by an earlier
// spec release would otherwise keep shipping schemas the package no longer
// claims to know about.
rmSync(generatedDir, { recursive: true, force: true });
mkdirSync(generatedDir, { recursive: true });

const versions = publishedVersions();

for (const entry of versions) {
  const dir = join(generatedDir, entry.dir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "schemas.ts"), schemasModule(entry));
  writeFileSync(join(dir, "validators.compiled.ts"), compiledValidatorsSource(entry));
  console.log(`Wrote src/generated/${entry.dir}/`);
}

for (const [name, source] of [
  ["versions.ts", versionsModule(versions)],
  ["modules.ts", modulesModule(versions)],
  ["latest.ts", latestModule(versions)],
]) {
  writeFileSync(join(generatedDir, name), source);
  console.log(`Wrote src/generated/${name}`);
}

// --- Vendor the validator-function portion of @opentechevents/schema ------
// Shared by every version: one implementation of the custom formats and
// keywords, which is also how the spec repo validates all of its published
// versions.
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
