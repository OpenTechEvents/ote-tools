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
- `apps/editor` has its own `CLAUDE.md` — dev-workflow gotchas (static
  files aren't watched), a recurring CSS `:not([hidden])` pitfall, and
  browser-testing notes specific to that app. Read it before editor work.
