// The deploy-path guard reads the workflow and the wrangler configs as text.
// This package's `types` names only @cloudflare/workers-types (see
// tsconfig.json), so `node:fs` is not available here — Vite's `?raw` import
// is, and it also keeps the guard honest about reading the committed files.
declare module "*?raw" {
  const content: string;
  export default content;
}
