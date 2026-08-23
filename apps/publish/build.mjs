import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";

import * as esbuild from "esbuild";

const serve = process.argv.includes("--serve");

// The embed widget's version, read from the app that owns it. The publish
// tool hands out `<script src=".../embed/v<version>/…">` snippets, and those
// must point at a version that deploy-tools.yml actually publishes — reading
// it here means the snippet can never drift from the deployed assets.
const embedVersion = JSON.parse(readFileSync("../embed/package.json", "utf8")).version;

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
