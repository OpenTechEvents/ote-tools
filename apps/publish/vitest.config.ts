import { defineConfig } from "vitest/config";

// `__EMBED_VERSION__` is injected by build.mjs from apps/embed/package.json.
// Tests don't go through esbuild, so without this any code path that falls
// back to the default version would throw a ReferenceError instead of
// failing on what it was actually testing. The value is deliberately not a
// real version: a test that asserts on it is asserting on the wrong thing.
export default defineConfig({
  define: { __EMBED_VERSION__: JSON.stringify("0.0.0-test") },
});
