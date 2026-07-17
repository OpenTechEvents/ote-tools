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
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
);
