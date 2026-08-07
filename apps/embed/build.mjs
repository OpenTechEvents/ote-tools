import { copyFileSync, mkdirSync } from "node:fs";

import * as esbuild from "esbuild";

const serve = process.argv.includes("--serve");

const common = {
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  sourcemap: true,
  minify: !serve,
  logLevel: "info",
};

// The real deliverable: what a consumer's <script src="..."> loads. Keep it
// on its own entry point so playground.js is never bundled into it.
const widget = { ...common, entryPoints: ["src/main.ts"], outfile: "dist/ote-events.js" };

// The demo/docs page's own script — wires the attribute controls and the
// copy-paste snippet generator. Loads dist/ote-events.js the same way an
// external site would (see index.html), so it also doubles as a real-usage
// smoke test of the widget.
const playground = {
  ...common,
  entryPoints: ["src/playground.ts"],
  outfile: "dist/playground.js",
};

mkdirSync("dist", { recursive: true });
for (const file of ["index.html", "styles.css"]) {
  copyFileSync(file, `dist/${file}`);
}

if (serve) {
  const widgetCtx = await esbuild.context(widget);
  const playgroundCtx = await esbuild.context(playground);
  await widgetCtx.watch();
  await playgroundCtx.watch();
  const port = Number(process.env.PORT) || undefined;
  const server = await widgetCtx.serve({
    servedir: "dist",
    ...(port !== undefined && { port }),
  });
  console.log(`Embed playground running at http://localhost:${server.port}/`);
} else {
  await esbuild.build(widget);
  await esbuild.build(playground);
}
