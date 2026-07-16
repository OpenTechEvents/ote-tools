// Regenerates src/schemas.generated.ts from @opentechevents/schema — the npm
// package the spec repo publishes. The schemas are embedded as TypeScript
// constants so this package can be bundled for the browser (no node:fs at
// runtime), and the dependency's pinned version is what ties each release of
// the validator to a release of the spec. Run with: pnpm gen
//
// Syncing with a new spec version = bump the devDependency (Dependabot opens
// that PR), run `pnpm gen`, review the diff. The guard test
// (test/schemas-generated.test.ts) fails until the re-embed happens, so a bump
// can never land with stale schemas.
import { writeFileSync } from "node:fs";
import { eventSchema, feedSchema, specVersion } from "@opentechevents/schema";

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
`;

writeFileSync(outFile, banner + body);
console.log("Wrote src/schemas.generated.ts");
