import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/fixtures/**"],
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
      },
    },
  },
  {
    // Served browser script: self-contained classic script, no modules.
    files: ["apps/dashboard-checks/dashboard-checks.js"],
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
