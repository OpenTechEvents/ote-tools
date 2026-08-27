// Compiles the OTE schemas into standalone validator code at build time —
// the third step of `pnpm gen`, on top of the schema embed and the validator
// vendoring in embed-schemas.mjs.
//
// WHY: Ajv normally compiles a schema by generating JavaScript source and
// handing it to `new Function`. That is `eval`, so any page running this
// package needs `script-src 'unsafe-eval'` — an ugly CSP for a tool whose
// whole job is to render documents fetched from strangers. Ajv's "standalone"
// mode emits the same generated code as a module instead, so it can be
// compiled here, in Node, and shipped as ordinary JavaScript. No `new
// Function` at runtime, no schema compilation on page load.
//
// The emitted code cannot inline everything it needs: custom formats and
// custom keywords are real functions, not data. Ajv references them through
// its "scope", and this script points that scope at src/compiled-scope.ts —
// two maps, keyed by the exact format/keyword names the schemas use. Formats
// go through Ajv's own `code.formats` option; keywords have no equivalent
// option (Ajv only emits a bare reference for a keyword defined with
// `validate`), so each one is pre-seeded into the value scope below with the
// code that reaches it. Ajv de-duplicates scope values by function reference,
// so the seeded name is the one the generated code ends up using.
import { Ajv2020 } from "ajv/dist/2020.js";
import { _ } from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";
import ajvFormats from "ajv-formats";
import {
  annotationKeywords,
  customFormats,
  customKeywords,
  eventSchema,
  eventRecommendedSchema,
  feedSchema,
  feedRecommendedSchema,
} from "@opentechevents/schema";

const addFormats = ajvFormats.default ?? ajvFormats;

// Ajv's generated code reaches two of its own runtime helpers with
// `require(...).default`, even when emitting ESM — the strings are hardcoded
// in Ajv, its `code.esm` option does not rewrite them. Rewriting them here to
// real imports is what makes the output loadable in a browser bundle at all.
//
// The `?? ` in each binding is not defensive noise: these helpers are CJS
// modules with an `exports.default`, and what a default import of one yields
// differs by loader — Node hands over the whole `module.exports` (so the
// function is under `.default`), while a bundler that honours `__esModule`
// (esbuild, Vite/vitest) hands over the function itself.
const RUNTIME_IMPORTS = [
  {
    module: "ajv/dist/runtime/equal.js",
    expression: 'require("ajv/dist/runtime/equal").default',
    name: "equalRuntime",
  },
  {
    module: "ajv/dist/runtime/ucs2length.js",
    expression: 'require("ajv/dist/runtime/ucs2length").default',
    name: "ucs2lengthRuntime",
  },
];

/**
 * Builds the Ajv instance used for code generation. Mirrors the options the
 * package used to compile with at runtime — `strict: true` still refuses to
 * generate code for a schema whose keywords/formats are not all registered,
 * except that failure now happens here, at codegen time, instead of in a
 * browser.
 */
function buildAjv() {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    // See the same note in src/index.ts's former buildAjv: the schemas'
    // location/address anyOf branches list `required` without repeating
    // `properties` in the same subschema.
    strictRequired: false,
    // Keyword functions are invoked as `fn.call(<context>, …)`. The default
    // context is Ajv's `self`, which a standalone module has no value for —
    // and in a browser `self` silently resolves to the global object instead
    // of failing. `passContext` makes the generated code pass `this` (which
    // is `undefined` here) — none of the OTE keywords read their context.
    passContext: true,
    code: {
      source: true,
      esm: true,
      lines: true,
      // Every format — ajv-formats' own and the OTE ones — is referenced as
      // `formats.<name>` instead of being captured by value.
      formats: _`formats`,
    },
  });
  addFormats(ajv);
  for (const keyword of annotationKeywords) ajv.addKeyword(keyword);
  for (const format of customFormats) ajv.addFormat(format.name, format.validate);
  for (const keyword of customKeywords) {
    ajv.addKeyword(keyword);
    if (keyword.validate) {
      ajv.scope.value("keyword", { ref: keyword.validate, code: _`keywords[${keyword.keyword}]` });
    }
  }
  ajv.addSchema(eventSchema);
  ajv.addSchema(feedSchema);
  ajv.addSchema(eventRecommendedSchema);
  ajv.addSchema(feedRecommendedSchema);
  return ajv;
}

const BANNER = `// GENERATED FILE — DO NOT EDIT.
// Standalone validator code for the OTE schemas, compiled from
// @opentechevents/schema by Ajv at codegen time — see
// scripts/compile-validators.mjs for why this is precompiled rather than
// compiled at runtime (short version: no \`new Function\`, so no
// 'unsafe-eval' in the CSP of any page that runs it).
// Regenerate with: pnpm gen
// A guard test (test/compiled-validators.test.ts) fails if this drifts.
// @ts-nocheck -- machine-generated JavaScript, not authored/typed here.
`;

/**
 * Returns the full source text of src/validators.compiled.generated.ts.
 * Exported so the guard test can regenerate and compare without writing.
 */
export function compiledValidatorsSource() {
  const ajv = buildAjv();
  const generated = standaloneCode(ajv, {
    validateEvent: eventSchema.$id,
    validateFeed: feedSchema.$id,
    checkEventRecommended: eventRecommendedSchema.$id,
    checkFeedRecommended: feedRecommendedSchema.$id,
  });

  // The emitted module opens with a "use strict" directive, which is a no-op
  // inside an ES module (and, after the imports below, not even a directive).
  let code = generated.replace(/^"use strict";\n?/, "");
  for (const runtime of RUNTIME_IMPORTS) {
    code = code.replaceAll(runtime.expression, runtime.name);
  }
  const usedRuntimeImports = RUNTIME_IMPORTS.filter(({ name }) =>
    new RegExp(`\\b${name}\\b`).test(code),
  );
  const leftoverRequire = /require\(/.exec(code);
  if (leftoverRequire) {
    throw new Error(
      "compile-validators.mjs: the generated code still contains a require() call " +
        `(${code.slice(leftoverRequire.index, leftoverRequire.index + 60)}…) — Ajv references a ` +
        "runtime helper this script does not know about; add it to RUNTIME_IMPORTS.",
    );
  }

  const imports = [
    ...usedRuntimeImports.map(
      (r) => `import ${r.name}Module from "${r.module}";`,
    ),
    'import { formats, keywords } from "./compiled-scope.js";',
    ...usedRuntimeImports.map(
      (r) => `const ${r.name} = ${r.name}Module.default ?? ${r.name}Module;`,
    ),
  ].join("\n");

  return `${BANNER}\n${imports}\n\n${code}`;
}
