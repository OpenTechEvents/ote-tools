---
name: verify
description: Build, launch and drive the OTE editor app in a browser to verify changes end-to-end.
---

# Verifying the editor

- Launch: `PORT=8123 pnpm dev` in `apps/editor/` (esbuild watch + static
  server over `dist/`). Prints `Editor running at http://localhost:8123/`.
- Open `http://localhost:8123/?repo=octocat/ote-demo` — any `owner/name`
  works; a nonexistent repo just logs 404s for config/contents/feed and the
  editor degrades to "all fields" with a warning banner. No setup needed.
- Drive with Playwright MCP. Field inputs are addressable as
  `[data-key="<FormState key>"]`; field wrappers as `[data-field-id="<id>"]`.
- Same-origin test assets: drop files into `apps/editor/dist/` and fetch
  them as `http://localhost:8123/<file>` (avoids CORS in URL-fetch flows).
  Remove them afterwards.
- Playwright file uploads only accept paths under the repo root.
- Validation errors stay hidden until the field is touched or "Review &
  submit" is pressed once — check `#valid-badge` (`✓ Ready`/`Incomplete`)
  for the live state.
