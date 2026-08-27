// Same shape as apps/preview's build: esbuild bundles src/main.ts into
// dist/main.js and the static files are copied next to it.
//
// One addition: the fetcher Worker's origin is substituted into BOTH the
// bundle (as __FETCH_ENDPOINT__) and index.html's CSP connect-src. Doing it
// in one place is the point — a page that can call an endpoint its own CSP
// blocks fails only at runtime, in the one mode that needs a network.
import { copyFileSync, mkdirSync, readFileSync, watch, writeFileSync } from "node:fs";

import * as esbuild from "esbuild";

const serve = process.argv.includes("--serve");

// Empty means same origin, which is the production shape: workers/validator
// serves this page AND its /fetch endpoint, so the page calls a relative path
// and no cross-origin request happens at all. Set OTE_FETCH_ENDPOINT to an
// absolute origin only when the two are genuinely apart — notably `pnpm dev`,
// where esbuild serves the page on localhost while the fetcher lives on
// Cloudflare.
const FETCH_ENDPOINT = process.env.OTE_FETCH_ENDPOINT ?? "";

const options = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  outfile: "dist/main.js",
  sourcemap: true,
  minify: !serve,
  logLevel: "info",
  define: {
    __FETCH_ENDPOINT__: JSON.stringify(FETCH_ENDPOINT),
  },
};

const STATIC_FILES = ["styles.css", "boot-errors.js"];

function copyStatic() {
  mkdirSync("dist", { recursive: true });
  for (const file of STATIC_FILES) copyFileSync(file, `dist/${file}`);
  // The placeholder carries its own leading space so that removing it (the
  // same-origin case) leaves `connect-src 'self'` rather than a stray token.
  writeFileSync(
    "dist/index.html",
    readFileSync("index.html", "utf8").replaceAll(
      " __FETCH_ENDPOINT__",
      FETCH_ENDPOINT ? ` ${FETCH_ENDPOINT}` : "",
    ),
  );
}

copyStatic();

if (serve) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  // esbuild watches `src` only, so index.html would otherwise stay as it was
  // when the server started. That failure is nastier than it sounds: main.ts
  // resolves its elements at import time, so a bundle rebuilt against newer
  // markup throws against the stale page — and a page whose module throws
  // registers no listeners at all, which shows up as the URL form submitting
  // itself and being blocked by `form-action 'none'`, not as an error about
  // a missing element.
  for (const file of [...STATIC_FILES, "index.html"]) watch(file, () => copyStatic());
  const port = Number(process.env.PORT) || undefined;
  const server = await ctx.serve({
    servedir: "dist",
    ...(port !== undefined && { port }),
  });
  console.log(`Validator running at http://localhost:${server.port}/`);
} else {
  await esbuild.build(options);
}
