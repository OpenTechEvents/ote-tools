// GENERATED FILE — DO NOT EDIT.
// One dynamic import per published version. Regenerate with: pnpm gen
// A guard test (test/schemas-generated.test.ts) fails if this file drifts.

import type { CompiledModule } from "../loader.js";

/**
 * The compiled validators of each version, behind a dynamic `import()` so a
 * page loads only the version(s) it actually meets. Four versions of compiled
 * schema code is roughly four times the bytes; a validator that shipped all
 * of them to check one document would have traded a wrong answer for a slow
 * one.
 */
export const VERSION_MODULES: Record<string, () => Promise<CompiledModule>> = {
  "0.1.0": () => import("./v0.1/validators.compiled.js"),
  "0.2.0": () => import("./v0.2/validators.compiled.js"),
  "0.3.0": () => import("./v0.3/validators.compiled.js"),
  "0.4.0": () => import("./v0.4/validators.compiled.js"),
};
