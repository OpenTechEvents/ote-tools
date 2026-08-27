import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/fixtures/**",
      "apps/embed/versions/**",
      // Ajv's standalone output (`pnpm gen`): machine-generated validator
      // code, not authored here and not readable by the rules below. Its
      // guard test (packages/validate/test/compiled-validators.test.ts) is
      // what keeps it honest. Its hand-written neighbours — including
      // src/compiled-scope.ts — are still linted.
      "**/*.compiled.generated.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Node build/codegen scripts (plain ESM, no type-checking).
    files: ["**/*.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly",
        Buffer: "readonly",
        clearTimeout: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
      },
    },
  },
  {
    // Served browser scripts: self-contained classic scripts, no modules.
    files: ["apps/dashboard-checks/dashboard-checks.js", "apps/validator/boot-errors.js"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        sessionStorage: "readonly",
        Promise: "readonly",
        module: "writable",
      },
    },
  },
  {
    // Vendored codegen output (`pnpm gen`): plain JS copied verbatim from
    // @opentechevents/schema, so it carries a @ts-nocheck header and is not
    // authored here. Guard tests, not lint rules, keep it honest.
    files: ["**/*.generated.ts"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
);
