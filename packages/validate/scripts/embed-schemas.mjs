// Regenerates src/schemas.generated.ts from the vendored schemas/ directory.
// The schemas are embedded as TypeScript constants so the package can be
// bundled for the browser (no node:fs at runtime). Run with: pnpm gen
import { readFileSync, writeFileSync } from "node:fs";

const schemasDir = new URL("../schemas/", import.meta.url);
const outFile = new URL("../src/schemas.generated.ts", import.meta.url);

function embed(filename) {
  // Parse + re-stringify: normalizes formatting and fails fast on bad JSON.
  const json = JSON.parse(readFileSync(new URL(filename, schemasDir), "utf8"));
  return JSON.stringify(json, null, 2);
}

const banner = `// GENERATED FILE — DO NOT EDIT.
// Source of truth: the vendored JSON files in schemas/ (see schemas/README.md).
// Regenerate with: pnpm gen
// A guard test (test/schemas-generated.test.ts) fails if this file drifts.

import type { AnySchemaObject } from "ajv";
`;

const body = `
/** OTE v0.2 JSON Schema for Event documents (vendored, see schemas/README.md). */
export const eventSchema: AnySchemaObject = ${embed("event.schema.json")};

/** OTE v0.2 JSON Schema for Feed documents (vendored, see schemas/README.md). */
export const feedSchema: AnySchemaObject = ${embed("feed.schema.json")};
`;

writeFileSync(outFile, banner + body);
console.log("Wrote src/schemas.generated.ts");
