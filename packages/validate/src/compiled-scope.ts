// The scope the precompiled validators close over.
//
// validators.compiled.generated.ts is standalone Ajv output: plain JavaScript
// that checks a document without Ajv and without `new Function` (see
// scripts/compile-validators.mjs). It can inline the schemas' data, but not
// their formats and keywords — those are real functions — so it reaches them
// through these two maps, by the exact names the schemas use.
//
// Hand-written, unlike its two neighbours: it is the seam between generated
// code and the vendored implementations, and it is what a browser bundle
// pulls in instead of Ajv itself. The guard test
// (test/compiled-validators.test.ts) checks it against what Ajv would have
// registered, so an ajv-formats bump that adds or renames a format cannot
// leave the generated code pointing at nothing.
import { fullFormats } from "ajv-formats/dist/formats.js";

import { customFormats, customKeywords } from "./validators.generated.js";

/**
 * Every format the compiled validators may reference: ajv-formats' own (in
 * its default "full" mode — the mode this package registers) plus the OTE
 * formats vendored from @opentechevents/schema.
 */
export const formats: Record<string, unknown> = {
  ...fullFormats,
  ...Object.fromEntries(customFormats.map((format) => [format.name, format.validate])),
};

/**
 * The OTE custom keywords' validate functions, by keyword name. Annotation
 * keywords are absent on purpose: they restrict nothing, so the compiled code
 * never calls them.
 */
export const keywords: Record<string, unknown> = Object.fromEntries(
  customKeywords.map((keyword) => [keyword.keyword, keyword.validate]),
);
