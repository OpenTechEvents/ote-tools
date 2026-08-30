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
  packages/validate; Dependabot bumps it when the spec releases).
  `pnpm --filter @opentechevents/validate gen` embeds it into TypeScript **and
  compiles it**: ajv turns the schemas into standalone validator code at codegen
  time, so nothing is compiled — `eval`ed — at runtime and no page needs
  `'unsafe-eval'`. Guard tests fail if either output drifts from the dependency.
  Never fetch the schema at runtime.
- **Every published spec version is embedded, and a document is judged against
  the version it declares.** Each release pins its own `specVersion` with a
  `const`, so checking a valid 0.3 feed against the 0.4 schemas produces one
  meaningless error and calls a healthy feed broken — three tools in the
  ecosystem shipped exactly that. `validateDocument()` picks the version;
  `validateEvent`/`validateFeed` stay synchronous and latest-only, which is
  right for documents this kit *writes* and wrong for documents it *judges*.
  The support policy (last three minors; older means migrate; unpublished means
  there is nothing to check against) mirrors the spec repo's decision and lives
  in `packages/validate/src/versions.ts` — do not reinvent it here. Being on a
  supported-but-older release is a notice, never a defect, and no message in
  this kit blames a publisher for a legitimate choice.
- **Check the pinned spec version before any schema-shaped work** — validation
  rules, error messages, connectors, fixtures, anything that asks "is this
  document valid". The spec moves on its own repo and its own schedule, so the
  pin here can be a release behind, and then every verdict this kit produces is
  measured against a spec that no longer exists:

  ```sh
  grep '"@opentechevents/schema"' packages/validate/package.json   # pinned
  npm view @opentechevents/schema version                          # released
  ```

  Same version: proceed. Newer released: **bring the repo up to it first**, as
  its own commit, before the work that prompted the check — a fix written
  against the old rules is a fix that has to be written twice.

  ```sh
  pnpm --filter @opentechevents/validate add -D @opentechevents/schema@<version>
  pnpm --filter @opentechevents/validate gen   # re-embeds AND re-compiles
  pnpm build && pnpm test                      # guard tests catch a missed gen
  ```

  Then read the spec's own CHANGES.log for what actually moved, and follow it
  through this repo rather than stopping at green tests: a rule that changed
  from MUST to SHOULD moves an error into the recommended profile, a new field
  needs its exporters (`packages/export-*`), its importers, the editor's form
  and the embed widget, and a new `format` or keyword must be reachable from
  `packages/validate/src/compiled-scope.ts` or codegen fails — that failure is
  the codegen doing its job, not a bug to route around. Human-readable messages
  in `packages/validate/src/errors.ts` are keyed to specific rules; a rule that
  moved leaves a message that lies. Say in the PR which spec version the repo
  now implements.
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
  `apps/validator/README.md` before touching it: its worst failure mode is
  invisible to the test suite (the detached global `fetch`), and a page whose
  bundle throws while importing registers no listeners at all rather than
  reporting anything — hence `boot-errors.js`.
- `apps/publish` (Broadcast) has its own `CLAUDE.md` too — the pinned-event
  rule, the generated/guided/planned ladder that lets its destination
  catalogue be wide without becoming a wall of promises, and the
  generated-not-fetched icon set. Read it before publish work.
