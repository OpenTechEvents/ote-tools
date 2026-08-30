import { Ajv2020 } from "ajv/dist/2020.js";
import type { KeywordDefinition } from "ajv";
import ajvFormats from "ajv-formats";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { formats, keywords } from "../src/compiled-scope.js";
// The vendored copies, not @opentechevents/schema's own: those two are tied
// together by validators-generated.test.ts, and it is the vendored functions
// that ship. This file checks the wiring around them.
import {
  annotationKeywords,
  customFormats,
  customKeywords,
} from "../src/validators.generated.js";

// CJS↔ESM interop: at runtime the default binding IS the plugin.
const addFormats = ajvFormats as unknown as typeof ajvFormats.default;

const { compiledValidatorsSource } = await import("../scripts/compile-validators.mjs");
const { publishedVersions } = await import("../scripts/spec-versions.mjs");

const entries = publishedVersions();

const compiledFileFor = (dir: string): string =>
  fileURLToPath(new URL(`../src/generated/${dir}/validators.compiled.ts`, import.meta.url));

/** Every version's compiled module, concatenated — for the checks that are about all of them. */
const allCompiledSources = (): string =>
  entries.map((entry) => readFileSync(compiledFileFor(entry.dir), "utf8")).join("\n");

// src/validators.compiled.generated.ts is Ajv's standalone output: the
// schemas compiled to plain JavaScript at codegen time so nothing has to be
// `eval`ed at runtime. Two ways for that to go stale, both guarded here —
// the checked-in code no longer matching the schemas it was compiled from,
// and src/compiled-scope.ts (which the generated code reaches its formats and
// keywords through, by name) no longer matching what Ajv registered when it
// compiled them.
describe.each(entries)("generated/$dir/validators.compiled.ts", (entry) => {
  const source = () => readFileSync(compiledFileFor(entry.dir), "utf8");

  it("matches what that version's schemas compile to", () => {
    // Fails after a @opentechevents/schema or ajv bump until `pnpm gen` runs.
    expect(source()).toBe(compiledValidatorsSource(entry));
  });

  it("exports one validator per schema the version has", () => {
    const names = ["validateEvent", "validateFeed"];
    // Before 0.3.0 there is no recommended profile to compile, and the module
    // must not pretend otherwise — src/loader.ts reports its absence.
    if (entry.hasRecommended) names.push("checkEventRecommended", "checkFeedRecommended");
    for (const name of names) {
      expect(source()).toContain(`export const ${name} = `);
    }
    if (!entry.hasRecommended) {
      expect(source()).not.toContain("export const checkEventRecommended = ");
    }
  });

  it("compiles to code that needs no eval", () => {
    // Comments stripped: the file's own header says the words this looks for.
    const code = source()
      .split("\n")
      .filter((line) => !line.startsWith("//"))
      .join("\n");
    // The whole point: a page running this needs no 'unsafe-eval'. A stray
    // `require` would break the browser bundle just as loudly.
    expect(code).not.toMatch(/new Function\b/);
    expect(code).not.toMatch(/\beval\(/);
    expect(code).not.toMatch(/\brequire\(/);
  });
});

describe("compiled-scope.ts", () => {
  it("carries every format Ajv registered when compiling", () => {
    const ajv = new Ajv2020({ strict: true, strictRequired: false });
    addFormats(ajv);
    for (const format of customFormats) ajv.addFormat(format.name, format.validate);

    // Same names, and the same implementations behind them: an ajv-formats
    // bump that renames a format, or switches its "full"/"fast" shape from a
    // function to a {type, validate} object, would leave the generated code
    // calling something that is no longer there.
    expect(Object.keys(formats).sort()).toEqual(Object.keys(ajv.formats).sort());
    for (const [name, format] of Object.entries(ajv.formats)) {
      expect(formats[name]).toBe(format);
    }
  });

  it("carries every restricting keyword, and only those", () => {
    expect(Object.keys(keywords).sort()).toEqual(
      customKeywords.map((keyword) => keyword.keyword).sort(),
    );
    for (const keyword of customKeywords) {
      expect(keywords[keyword.keyword]).toBe(keyword.validate);
    }
    // Annotation keywords restrict nothing, so the compiled code never calls
    // them — and Ajv proves it by generating code that references none.
    const source = allCompiledSources();
    for (const keyword of annotationKeywords) {
      expect(source).not.toContain(`keywords[${JSON.stringify(keyword.keyword)}]`);
    }
  });

  it("registers keywords Ajv still accepts", () => {
    // compiled-scope.ts holds bare functions, stripped of the definitions
    // around them; this keeps the vendored definitions themselves honest, so
    // a codegen run cannot start failing for a reason no test names.
    const ajv = new Ajv2020({ strict: true, strictRequired: false });
    addFormats(ajv);
    for (const format of customFormats) ajv.addFormat(format.name, format.validate);
    for (const keyword of [...annotationKeywords, ...customKeywords]) {
      expect(() => ajv.addKeyword(keyword as unknown as KeywordDefinition)).not.toThrow();
    }
  });
});
