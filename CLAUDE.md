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
- OTE schema: v0.2, vendored in packages/validate/schemas/ (copied from the spec,
  version annotated). Never fetch the schema at runtime.
- Tests: `pnpm test` at the root. Every new package ships fixtures and tests.
- Convention: connectors never invent data; absent field = absent + warning.
