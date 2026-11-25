import { defineConfig } from "vitest/config";

// `@event-calendar/core` is a Svelte 5 component library, and Svelte ships two
// builds behind export conditions: the browser one, and a server one whose
// `mount()` throws `lifecycle_function_unavailable`. Vitest loads tests
// through Vite's SSR pipeline, so without this the server build wins and any
// test that actually renders the calendar dies before it asserts anything —
// which is why this package had no rendered-calendar test at all (#162).
//
// The widget ships to browsers, so `browser` is also the honest condition to
// test it under: `apps/embed`'s own build (build.mjs → esbuild with
// `platform: "browser"`) resolves the same way.
const browserFirst = ["browser", "import", "module", "default"];

export default defineConfig({
  resolve: { conditions: browserFirst },
  ssr: { resolve: { conditions: browserFirst } },
  test: {
    // Node's own resolution would still pick the server build for an
    // externalized dependency, so the calendar and Svelte go through Vite.
    server: { deps: { inline: ["@event-calendar/core", "svelte"] } },
  },
});
