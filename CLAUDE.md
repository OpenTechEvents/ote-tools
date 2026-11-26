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
  `const`, so checking a feed that is valid at one version against another
  version's schemas produces one meaningless error and calls a healthy feed
  broken — four tools in the ecosystem shipped exactly that, the most recent
  being the exporters, where bumping the pin to 0.6 turned a latent copy of
  this bug into a live one. `validateDocument()` picks the version;
  `validateEvent`/`validateFeed` stay synchronous and latest-only, which is
  right for documents this kit *writes* and wrong for documents it *judges*.
  The support policy (last three minors; older means migrate; unpublished means
  there is nothing to check against) mirrors the spec repo's decision and lives
  in `packages/validate/src/versions.ts` — do not reinvent it here. Being on a
  supported-but-older release is a notice, never a defect, and no message in
  this kit blames a publisher for a legitimate choice.

  **The window is computed, not listed, so a release can move it without
  anyone deciding to.** Publishing 0.5.0 and 0.6.0 on the same day slid it
  from {0.2, 0.3, 0.4} to {0.4, 0.5, 0.6} and dropped 0.3 out — and a
  registered adopter was on 0.3. That is the policy working, but check who it
  affects before announcing a release rather than after.
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

  Two things that bite here. pnpm re-adds a `minimumReleaseAgeExclude` entry
  to `pnpm-workspace.yaml`, because the spec is pinned the same day it is
  published — annotate it with a dated `TODO` and keep the list one line.
  And **`packages/validate/fixtures/` must be re-copied from the spec repo at
  the matching tag, not version-bumped in place**: the npm tarball ships
  schemas only, no examples, and the new version's examples are the only
  thing that exercises its new fields. `fixtures/README.md` has the procedure,
  including verifying the schemas at that tag are byte-identical to the
  installed package first.

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
- **`skills/` moves with the version, and a test says where.** A skill is prose
  carrying version literals nothing else checks — `npx -p
  @opentechevents/import-ics@<minor>` lines, a pinned embed URL, a
  `specVersion` in an example an agent will copy — and each one is an
  instruction a real organizer follows. They went stale exactly as you would
  expect: `references/website.md` sat two minors behind `SKILL.md`, because the
  rule asking for the pins to move lived in a different file from the pins, and
  the evals measured "ground truth" with the release whose version bug this kit
  exists to have fixed.

  So do not audit the prose. Run it:

  ```sh
  pnpm --filter @opentechevents/skill-evals test   # skills/evals/test/version-pins.test.ts
  ```

  It derives everything from the workspace's own `package.json` versions and
  from `packages/validate`'s support policy, and fails with the file, the line
  and the value to write. What it holds: npm pins name a package this repo
  ships, on the line it ships; a pinned `embed/v<x.y.z>` URL matches
  `apps/embed` **and** has a committed snapshot behind it; a `specVersion` in
  anything `skills/ote-event/` tells an organizer to write is the latest
  published version; and no `.md` names a bare spec minor in prose, because
  "what v0.4 documents" is read as current by whoever reads it.

  The one that is invisible without it: **eval fixtures pinned to a spec
  version change meaning when the support window moves.**
  `corunajug-feed.json` was stamped at an older-but-supported release to be the
  "a notice, never a defect" case; the 0.5.0/0.6.0 day slid the window past it
  and it became a *migration* case still asserting the old thing. Fixtures
  declare a **role** (`latest` / `older-supported` / `none`) and the test
  resolves it against the live policy, so a window move tells you which file to
  re-stamp. Re-stamp the fixture — never move the bar.

  There is no per-line ignore, on purpose — so **the scan only looks at lines
  that run something** (`npx`, `npm install`). That boundary is what makes a
  hatch-free guard survivable: prose names a version to state a fact about the
  past, and `SKILL.md` says the CLI judges by the declared version "(since
  `@opentechevents/validate@0.6.0`)", which is true and must not move. The
  first draft matched every occurrence, so the first patch release would have
  demanded that sentence be rewritten to `@0.6.1` — a guard satisfiable only
  by writing something false is worse than no guard. When the harness needs a
  verdict it imports `validateDocument` from the workspace rather than pinning
  a published release: an instrument must be the code under review, not a copy
  from npm.

  **Which release moves the pins, and which does not.** In this repo the
  **minor names the spec version a release implements** — the published lines
  are 0.1.0, 0.3.0, 0.4.0, 0.6.0, skipping the spec versions that got no
  implementation. So:

  - **A fix release is a patch** (`0.6.0 → 0.6.1`; precedent:
    `import-ics@0.4.1`). The `@0.6` pins in `skills/` are *minor* pins, which
    npm resolves to the newest `0.6.x`, so **a patch reaches every
    already-copied skill with no edit at all.** Do not touch them, and do not
    spend a minor on a fix: that announces a spec version that does not exist
    and strands every copied skill on the broken line forever.
  - **A minor is for implementing a new spec version**, and there the pins
    *do* move — in the same `release(<pkg>): <version>` commit, which is also
    the only moment they may name a line npm does not have yet, with
    `pnpm publish` run right after (`.github/workflows/publish.yml`:
    publishing is a manual decision, not a side effect of merging).

  Either way a feature PR changes behaviour and leaves the version alone,
  writing its entry under `## Unreleased`.
- Tests: `pnpm test` at the root. Every new package ships fixtures and tests.
- Build before type-checking a fresh clone or worktree: packages depend on each
  other through `dist/*.d.ts`, so `pnpm typecheck` (and any single-package
  `tsc`) fails with TS2307 "cannot find module '@opentechevents/…'" until
  `pnpm build` has run. That error means the workspace is unbuilt, not broken —
  never "fix" it by touching imports. CI never hits it: it builds first.
- Convention: connectors never invent data; absent field = absent + warning.
- **The audience for every tool here is technical.** Organizers who publish
  an OTE feed edit JSON, run a workflow and host files; the widgets are
  embedded by whoever maintains the site. So a label may name a format —
  `ICS`, `RSS`, `webcal://`, `feed.json` — without a gloss, and a control
  does not need a sentence explaining a distinction its reader already
  holds. Design review here should say "that explanation is for a different
  audience" at least as often as it asks for more help text.

  Two consequences that have already decided something. A UI *element* may
  assume the vocabulary; a **publisher-facing** decision — which third party
  a visitor is routed to, which action is the default — still has to be
  stated somewhere the publisher reads, because they are the one who can
  change it. And it cuts the other way too: `<ote-subscribe>`'s popover
  used to tell the *visitor* that its calendar feed was service-generated,
  which was both the wrong audience and an explanation its reader did not
  need (see `apps/embed/CLAUDE.md`).

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
- `workers/convert` is the hosted conversion service: it fetches a public OTE
  document, validates it against the version it declares, and converts it to
  iCalendar, RSS or schema.org JSON-LD. Read `workers/convert/README.md`
  before touching it. Two things that are easy to undo by accident: the
  default `wrangler.jsonc` is **staging** and declares no route, with
  production in `wrangler.production.jsonc` reached only by a hand-run
  workflow, and one request converts a bounded number of events rather than
  whatever a stranger publishes. Both are asserted in
  `workers/convert/test/hardening.test.ts` and `test/cap.test.ts`, so change
  them there or not at all. It shares the validator's fetcher by relative
  import across a package boundary, which is why `fetchDocument` takes a
  `userAgent` — and it is **one of two** such imports, not the only one: the
  landing page's adopters picker shares its registry shape check with
  `apps/embed` the same way. Both reach from a worker into an app's `src/`,
  which is the direction a fix has to cover; #158 is where that decision
  lives. Do not add a third without saying so there.
- `apps/publish` (Broadcast) has its own `CLAUDE.md` too — the pinned-event
  rule, the generated/guided/planned ladder that lets its destination
  catalogue be wide without becoming a wall of promises, and the
  generated-not-fetched icon set. Read it before publish work.
- **Verifying a fix: five checks, each one from a bug that green tests missed
  here.** They are cheap, mechanical, and in rough order of what they catch.

  1. **The test lives in the package whose behaviour the PR claims.**
     `report.valid` was fixed across seven call sites; `packages/validate`'s
     own tests caught the revert, and all 71 of `apps/publish`'s passed with
     the fix removed — the surface the PR headlined. Revert the fix at the
     headlined surface once and watch it fail; if it passes, the coverage is
     in the wrong package.
  2. **A comment asserting why a branch is safe needs a test asserting that
     branch.** An exit rule shipped with a rationale beside it that the same
     PR body contradicted two sections down, and let a `specVersion` typed
     `"0.6"` pass CI next to a healthy feed.
  3. **Construct the input your rule claims to handle.** That typo was found
     by running the tool on a crafted bad file, not by reading the diff.
  4. **Enumerate the consumers from the code, not from the issue.** The issue
     named three affected surfaces; `grep` found seven, and the four it missed
     refused to export and refused to broadcast rather than mislabelling.
     Changing a type so the compiler forces every call site to decide
     (`valid: boolean | null`) is what surfaced them.
  5. **A fix is not shipped until the published artifact shows it.**
     `workspace:*` publishes as an *exact* pin, so a dependent keeps the old
     library until it is republished too — and `skills/` sends organizers to
     the published line, not to this checkout.

  If evidence is the argument, print the N and name the source: a measurement
  quoted to the spec repo covered 4 of 7 registered feeds, because
  `adopters.json` was parsed without checking the shape of the file.

  And when a change carries a lot of prose justifying it, **have it reviewed
  with no context**: hand over the branch and the issues, say the description
  and the comments are claims by an interested party, and ask for verification
  by running things. Checks 2 and 5 came from doing that, after the author had
  read the diff twice.
- **Do not write prose that expires.** Almost every documentation bug found in
  this repo has the same shape: a true sentence that stopped being true, with
  nothing to notice. `references/website.md` sat two minors behind `SKILL.md`;
  `HANDOFF.md` claimed the repo implemented OTE Spec 0.4.0 with "seven
  published packages on npm at `0.4.0`" and listed per-package test counts;
  comments in `packages/migrate` asserted a behaviour that a merged PR had
  reversed; a skill told organizers a settled media type "may change".

  So, before writing a number, a version, a count or a status into prose:

  1. **Can a command print it?** Then write the command, not the answer — and
     check it prints what the sentence around it claims, which is where the
     first draft of this rule got caught.
  2. **Can a test assert it?** Then write the test — see the `skills/` bullet.
  3. **Neither?** Date it and name what would change it ("0.3.0 as of
     2026-11; re-check against the support policy"), so the next reader can
     tell a fact from a fossil.

  Two shapes to avoid outright. **Status prose** — "X is done, no open PRs,
  N tests pass" — is stale within days and belongs in issues, CI or a command.
  And **a second copy of a set**: a list of the badge's states beside the
  states themselves meant a new one rendered untested. Derive it.

  **"Put it in an issue" is not an escape.** Issue bodies rot the same way:
  #66 still says the `v1` tag is "164 commits back" when it is past 220. An
  issue is the right home for a *decision pending*, not for a number.

  This rule arrived with about a dozen counterexamples still in the tree —
  package READMEs and `CONTRIBUTING.md` describing a spec two minors old —
  because the guard that enforces it only walks `skills/`. Widening it is
  #135. Until that lands, the rule binds new prose and the old prose is a
  known debt, which is worth saying out loud: a rule whose violations are one
  `grep` away teaches the next reader that it is decorative.
- **`HANDOFF.md` is scratch, and clearing it is part of finishing.** It exists
  for what would be lost between sessions — traps, machine quirks, commands,
  test subjects — and explicitly not as a to-do list (issues) or a rulebook
  (this file). When a task ends, **delete its notes from `HANDOFF.md` in the
  same change that closes it**, keeping only what outlives the task. A handoff
  file that accumulates is how it came to describe a release two minors old as
  the current state; the next reader cannot tell which half is still true, so
  they trust none of it, and then it may as well not exist.
