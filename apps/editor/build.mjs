// Builds the static editor app into dist/: bundles src/main.ts for the
// browser and copies the static shell next to it. `--serve` starts esbuild's
// dev server on http://localhost:8000 (override with PORT) with
// rebuild-on-request.
import { copyFileSync, mkdirSync } from "node:fs";

import * as esbuild from "esbuild";

const serve = process.argv.includes("--serve");

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
  // Leaflet's CSS references its control icons; inline them in main.css.
  loader: { ".png": "dataurl" },
};

mkdirSync("dist", { recursive: true });
for (const file of ["index.html", "styles.css"]) {
  copyFileSync(file, `dist/${file}`);
}

if (serve) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const port = Number(process.env.PORT) || 8000;
  await ctx.serve({ servedir: "dist", port });
} else {
  await esbuild.build(options);
}
