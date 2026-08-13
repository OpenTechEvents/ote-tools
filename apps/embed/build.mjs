import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

import * as esbuild from "esbuild";

const serve = process.argv.includes("--serve");
const snapshotVersion = process.argv.includes("--snapshot-version");
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const version = packageJson.version;
const oteSpecVersion = packageJson.oteSpecVersion;
const oteSpecSchemaVersion = String(oteSpecVersion).split(".").slice(0, 2).join(".");

function copyStaticFile(file) {
  const contents = readFileSync(file, "utf8")
    .replaceAll("__EMBED_VERSION__", version)
    .replaceAll("__OTE_SPEC_VERSION__", oteSpecVersion)
    .replaceAll("__OTE_SPEC_SCHEMA_VERSION__", oteSpecSchemaVersion);
  mkdirSync("dist", { recursive: true });
  writeFileSync(`dist/${file}`, contents);
}

const common = {
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  sourcemap: true,
  minify: !serve,
  logLevel: "info",
  define: {
    __EMBED_VERSION__: JSON.stringify(version),
    __OTE_SPEC_VERSION__: JSON.stringify(oteSpecVersion),
  },
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

// layout="calendar" support, lazy-loaded by element.ts via a runtime
// `import()` of this file's own URL — never statically imported by
// main.ts, so it doesn't add a byte to dist/ote-events.js unless a
// consumer actually requests the calendar layout. The `.css` -> `text`
// loader is scoped to this entry point only: it lets calendar-layout.ts
// import @event-calendar/core's stylesheet as a plain string and inject it
// into the widget's own Shadow DOM, instead of the library linking/creating
// a <style> in document.head (which a Shadow DOM wouldn't see at all).
const calendarLayout = {
  ...common,
  entryPoints: ["src/calendar-layout.ts"],
  outfile: "dist/calendar-layout.js",
  loader: { ".css": "text" },
};

// A second, independent deliverable: what a consumer's second
// <script src="..."> loads for the <ote-subscribe> "subscribe to this feed"
// widget. Kept on its own entry point for the same reason as `widget` above
// — it must never pull in playground.js or calendar-layout.js, and vice
// versa <ote-events> consumers who don't want <ote-subscribe> pay nothing
// for it.
const subscribe = {
  ...common,
  entryPoints: ["src/subscribe-main.ts"],
  outfile: "dist/ote-subscribe.js",
};

mkdirSync("dist", { recursive: true });
for (const file of ["index.html", "styles.css"]) copyStaticFile(file);

if (serve) {
  const widgetCtx = await esbuild.context(widget);
  const playgroundCtx = await esbuild.context(playground);
  const calendarCtx = await esbuild.context(calendarLayout);
  const subscribeCtx = await esbuild.context(subscribe);
  await widgetCtx.watch();
  await playgroundCtx.watch();
  await calendarCtx.watch();
  await subscribeCtx.watch();
  const port = Number(process.env.PORT) || undefined;
  const server = await widgetCtx.serve({
    servedir: "dist",
    ...(port !== undefined && { port }),
  });
  console.log(`Embed playground running at http://localhost:${server.port}/`);
} else {
  await esbuild.build(widget);
  await esbuild.build(playground);
  await esbuild.build(calendarLayout);
  await esbuild.build(subscribe);
  if (snapshotVersion) {
    const target = `versions/v${version}`;
    rmSync(target, { force: true, recursive: true });
    mkdirSync(target, { recursive: true });
    cpSync("dist", target, { recursive: true });
    console.log(`Snapshotted embed v${version} assets to ${target}/`);
  }
}
