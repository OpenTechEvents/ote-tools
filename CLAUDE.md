# ote-tools

Central monorepo for the OTE organizer kit. Read DESIGN.md before any task.

- **Language: English is the official language of the repo** — all documentation,
  code comments, test names, commit messages, error messages and identifiers.
  Localized versions of docs/UI may be offered later as translations, but English
  is canonical. This holds even when prompts, DESIGN.md or other inputs are in
  Spanish.
- Contains: npm packages (@opentechevents/*, pure functions, no UI), reusable
  GitHub Actions workflows, and (phase 2) the static web dashboard/editor.
- Does NOT contain: event data (lives in the ote-template forks) or the spec
  (lives in OpenTechEvents/opentechevents-spec).
- Stack: TypeScript + Node 22, pnpm workspaces, vitest, ajv for validation.
- OTE schema: from the @opentechevents/schema npm package (pinned devDependency of
  packages/validate; Dependabot bumps it when the spec releases). `pnpm gen` embeds
  it into TypeScript; a guard test fails if the embed drifts from the dependency.
  Never fetch the schema at runtime.
- Tests: `pnpm test` at the root. Every new package ships fixtures and tests.
- Build before type-checking a fresh clone or worktree: packages depend on each
  other through `dist/*.d.ts`, so `pnpm typecheck` (and any single-package
  `tsc`) fails with TS2307 "cannot find module '@opentechevents/…'" until
  `pnpm build` has run. That error means the workspace is unbuilt, not broken —
  never "fix" it by touching imports. CI never hits it: it builds first.
- Convention: connectors never invent data; absent field = absent + warning.
- **Visual language: every UI here follows opentechevents.org.** The tools are
  reached from that site and carry its name, so a visitor must never feel
  handed off to a different product. Take the tokens from its stylesheet
  (`https://opentechevents.org/styles.css`) rather than inventing a palette:
  ink `#10131a` / soft `#4a5265` / faint `#6f7787`, accent `#2b5bd7` with
  `#eaf0fe` soft and `#1e46ab` for hover, line `#e3e6ea`, alt background
  `#f6f7f9`, dark `#10131a`, ok `#0f8a5f`, warn `#b06d00`; radius 10px, wrap
  1120px, 17px/1.65 body in the system sans stack, mono for code. Reuse its
  components rather than re-designing them: sticky translucent header with the
  `OTE` brand mark, `.btn`/`.btn-primary`/`.btn-ghost`, white cards on
  `--line` borders, uppercase pill badges, dark code blocks with a caption
  bar, dark footer. `apps/validator/styles.css` is the current reference
  implementation. When the main site's palette moves, move it here too.
- Versioned public assets: `apps/embed` is a consumer-facing Web Component.
  Read `apps/embed/CLAUDE.md` before changing it. Changes to public widget
  behavior should use semantic versioning in `apps/embed/package.json`, update
  `apps/embed/CHANGELOG.md`, and regenerate the committed
  `apps/embed/versions/v<version>/` snapshot for releases.
- `apps/editor` has its own `CLAUDE.md` — dev-workflow gotchas (static
  files aren't watched), a recurring CSS `:not([hidden])` pitfall, and
  browser-testing notes specific to that app. Read it before editor work.
- `apps/validator` is built here but **served by `workers/validator`** at
  `validator.opentechevents.org`, page and `/fetch` endpoint on one origin (so
  it needs no CORS and its CSP is `connect-src 'self'`). It is the one tool
  without a `?repo=` context, hence its own hostname instead of a path under
  `tools.opentechevents.org`, which keeps redirecting to it. Read
  `apps/validator/README.md` before touching it: two failure modes there are
  invisible to the test suite (the detached global `fetch`, and ajv needing
  `'unsafe-eval'` in the page CSP).
- `apps/publish` (Broadcast) has its own `CLAUDE.md` too — the pinned-event
  rule, the generated/guided/planned ladder that lets its destination
  catalogue be wide without becoming a wall of promises, and the
  generated-not-fetched icon set. Read it before publish work.
