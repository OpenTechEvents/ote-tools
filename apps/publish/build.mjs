import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";

import * as esbuild from "esbuild";

const serve = process.argv.includes("--serve");

// The embed widget's version, read from the app that owns it. The publish
// tool hands out `<script src=".../embed/v<version>/…">` snippets, and those
// must point at a version that deploy-tools.yml actually publishes — reading
// it here means the snippet can never drift from the deployed assets.
const embedVersion = JSON.parse(readFileSync("../embed/package.json", "utf8")).version;

// `splitting` with an outdir instead of a single outfile, the same shape and
// for the same reason as apps/validator: validating a feed against the
// version it declares (#69) means @opentechevents/validate can reach any
// published version's compiled validators, and each one is a few hundred
// kilobytes. They sit behind a dynamic import there, so esbuild gives each
// its own chunk — without `splitting` they are all inlined and `main.js`
// goes from 464 KB to 1.3 MB for versions this page will usually never meet.
const options = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  splitting: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  outdir: "dist",
  // The page loads ./main.js by name; only the shared chunks get hashes.
  entryNames: "[name]",
  chunkNames: "chunks/[name]-[hash]",
  sourcemap: true,
  minify: !serve,
  logLevel: "info",
  define: { __EMBED_VERSION__: JSON.stringify(embedVersion) },
};

mkdirSync("dist", { recursive: true });
for (const file of ["index.html", "styles.css"]) {
  copyFileSync(file, `dist/${file}`);
}

// Dev-only: the preview panes load the widget from `../embed/v<version>/`,
// which exists on the deployed Pages site but not next to a local dev
// server. Copying the built widget there makes `pnpm dev` show real
// previews offline. Never done for a real build — production serves the
// canonical /embed/ assets, and a second copy would be one more thing to
// go stale.
if (serve) {
  const embedDist = `../embed/versions/v${embedVersion}`;
  if (existsSync(embedDist)) {
    cpSync(embedDist, `dist/embed/v${embedVersion}`, { recursive: true });
  }
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const port = Number(process.env.PORT) || undefined;
  const server = await ctx.serve({
    servedir: "dist",
    ...(port !== undefined && { port }),
  });
  console.log(`Publish tool running at http://localhost:${server.port}/`);
} else {
  await esbuild.build(options);
}
