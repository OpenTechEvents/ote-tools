// The text of every module `pnpm gen` writes under src/generated/.
//
// Separated from embed-schemas.mjs (which writes them) so the guard test can
// regenerate and compare without touching the disk — the same shape
// compile-validators.mjs already had. A generated file that drifts from its
// generator is the failure mode this whole arrangement exists to prevent, and
// a guard that could only check *some* of the generated files would leave the
// version list — the one file a new spec release changes — unguarded.
import { compiledValidatorsSource } from "./compile-validators.mjs";

export { compiledValidatorsSource };

// Re-stringify normalizes formatting regardless of how the package ships them.
const embed = (schema) => JSON.stringify(schema, null, 2);

const schemasBanner = (version) => `// GENERATED FILE — DO NOT EDIT.
// The OTE Spec ${version} schemas, from the @opentechevents/schema package
// (its version is pinned in package.json).
// Regenerate with: pnpm gen
// A guard test (test/schemas-generated.test.ts) fails if this file drifts.

import type { AnySchemaObject } from "ajv";
`;

/** One version's embedded schemas. */
export function schemasModule(entry) {
  const { schemas, version } = entry;
  const recommended = schemas.eventRecommended
    ? `
/**
 * Quality profile for Event documents, NOT validity: a document that fails
 * this is still a valid OTE document. References eventSchema by $id.
 */
export const eventRecommendedSchema: AnySchemaObject = ${embed(schemas.eventRecommended)};

/**
 * Quality profile for Feed documents, NOT validity — see eventRecommendedSchema.
 */
export const feedRecommendedSchema: AnySchemaObject = ${embed(schemas.feedRecommended)};
`
    : `
/**
 * OTE Spec ${version} has no recommended (quality) profile: it was introduced
 * in 0.3.0. Null rather than an empty schema — a document from before the
 * profile existed has not "met every recommendation", it predates them.
 */
export const eventRecommendedSchema = null;
export const feedRecommendedSchema = null;
`;

  return `${schemasBanner(version)}
/** The OTE Spec version these schemas describe. */
export const specVersion = ${JSON.stringify(version)};

/** OTE JSON Schema for Event documents (from @opentechevents/schema). */
export const eventSchema: AnySchemaObject = ${embed(schemas.event)};

/** OTE JSON Schema for Feed documents (from @opentechevents/schema). */
export const feedSchema: AnySchemaObject = ${embed(schemas.feed)};
${recommended}`;
}

/** The version list, derived from the package's export map. */
export function versionsModule(entries) {
  const latest = entries[entries.length - 1];
  return `// GENERATED FILE — DO NOT EDIT.
// The OTE Spec versions @opentechevents/schema publishes, oldest first,
// derived from its export map (see scripts/spec-versions.mjs).
// Regenerate with: pnpm gen
// A guard test (test/schemas-generated.test.ts) fails if this file drifts.

/**
 * Every version whose schemas this package embeds — which is every version
 * the spec has ever published, because published versions are frozen and
 * their schemas stay reachable. Support (a policy: see src/versions.ts) is a
 * narrower set than this.
 */
export const PUBLISHED_VERSIONS = ${JSON.stringify(entries.map((v) => v.version))} as const;

/** The newest published version; what a new document should declare. */
export const LATEST_VERSION = ${JSON.stringify(latest.version)};

/**
 * Versions whose schemas include the recommended (quality) profile. Before
 * 0.3.0 the profile did not exist, so there is nothing to check against.
 */
export const VERSIONS_WITH_RECOMMENDED = ${JSON.stringify(
    entries.filter((v) => v.hasRecommended).map((v) => v.version),
  )} as const;
`;
}

/**
 * The lazy module map. Static import specifiers, one literal per version:
 * that is what lets a bundler split each version into its own chunk. A
 * computed specifier (`import("./" + dir + "/validators.compiled.js")`) would
 * defeat both the bundler and the type checker.
 */
export function modulesModule(entries) {
  const loaderEntries = entries
    .map(
      (entry) =>
        `  ${JSON.stringify(entry.version)}: () => import("./${entry.dir}/validators.compiled.js"),`,
    )
    .join("\n");

  return `// GENERATED FILE — DO NOT EDIT.
// One dynamic import per published version. Regenerate with: pnpm gen
// A guard test (test/schemas-generated.test.ts) fails if this file drifts.

import type { CompiledModule } from "../loader.js";

/**
 * The compiled validators of each version, behind a dynamic \`import()\` so a
 * page loads only the version(s) it actually meets. Four versions of compiled
 * schema code is roughly four times the bytes; a validator that shipped all
 * of them to check one document would have traded a wrong answer for a slow
 * one.
 */
export const VERSION_MODULES: Record<string, () => Promise<CompiledModule>> = {
${loaderEntries}
};
`;
}

/**
 * The latest version, re-exported under stable names. This is the package's
 * one static import of a version module — so the bundle a consumer gets by
 * default is one version's worth of code, as before, and the others arrive
 * only if asked for.
 */
export function latestModule(entries) {
  const latest = entries[entries.length - 1];
  return `// GENERATED FILE — DO NOT EDIT.
// The newest published version, re-exported under stable names: this is what
// the package's synchronous API validates against.
// Regenerate with: pnpm gen
// A guard test (test/schemas-generated.test.ts) fails if this file drifts.

export {
  specVersion,
  eventSchema,
  feedSchema,
  eventRecommendedSchema,
  feedRecommendedSchema,
} from "./${latest.dir}/schemas.js";

export {
  validateEvent,
  validateFeed,
  checkEventRecommended,
  checkFeedRecommended,
} from "./${latest.dir}/validators.compiled.js";
`;
}
