// Same shape as apps/preview's build: esbuild bundles src/main.ts into
// dist/main.js and the static files are copied next to it.
//
// One addition: the fetcher Worker's origin is substituted into BOTH the
// bundle (as __FETCH_ENDPOINT__) and index.html's CSP connect-src. Doing it
// in one place is the point — a page that can call an endpoint its own CSP
// blocks fails only at runtime, in the one mode that needs a network.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

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

mkdirSync("dist", { recursive: true });
for (const file of ["styles.css", "boot-errors.js"]) copyFileSync(file, `dist/${file}`);
// The placeholder carries its own leading space so that removing it (the
// same-origin case) leaves `connect-src 'self'` rather than a stray token.
writeFileSync(
  "dist/index.html",
  readFileSync("index.html", "utf8").replaceAll(
    " __FETCH_ENDPOINT__",
    FETCH_ENDPOINT ? ` ${FETCH_ENDPOINT}` : "",
  ),
);

if (serve) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const port = Number(process.env.PORT) || undefined;
  const server = await ctx.serve({
    servedir: "dist",
    ...(port !== undefined && { port }),
  });
  console.log(`Validator running at http://localhost:${server.port}/`);
} else {
  await esbuild.build(options);
}
