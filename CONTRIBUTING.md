# Contributing to ote-tools

Read [DESIGN.md](DESIGN.md) first — it explains what lives here, what lives in
the template forks, and why. English is the repository's official language for
code, comments, tests, commits and docs (see [CLAUDE.md](CLAUDE.md)).

## Prerequisites

- Node 22+ (`engines` enforces it)
- pnpm 11 (`corepack enable` gives you the version pinned in `packageManager`)

## Setup

```sh
pnpm install
pnpm build        # tsc for the packages, esbuild bundles for static apps
```

`pnpm build` is not optional here: the packages import each other through the
`dist/*.d.ts` files it emits, so on an unbuilt clone `pnpm typecheck` fails
with `TS2307: Cannot find module '@opentechevents/…'` in the first package
that depends on another. Build first and it goes away — nothing is broken.

## Repository layout

| Path | What | How it's tested |
| --- | --- | --- |
| `packages/validate` | Event/Feed validation against the OTE JSON Schema | vitest + fixtures |
| `packages/build-feed` | Assembles `events/*.json` + `ote.config.json` → `feed.json` | vitest + fixtures |
| `packages/export-ics` / `export-rss` / `export-jsonld` | `feed.json` → ICS / RSS / schema.org JSON-LD | vitest + fixtures |
| `apps/editor` | Static web editor (form → event JSON → issue/PR links) | vitest for `src/lib/`; UI by hand |
| `apps/preview` | Static feed previewer (`feed.json`, `feed.ics`, `feed.xml` → readable tabs) | typecheck + UI by hand |
| `apps/publish` | "Broadcast" console (feed → per-channel output; schema.org, widget and subscribe links so far) | vitest for `src/lib/`; UI by hand |
| `.github/workflows` | CI, reusable workflows for forks, deploys, npm publish | see below |

## Everyday commands (repo root)

```sh
pnpm test         # all test suites
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit everywhere
pnpm build        # everything
```

Each of these also works inside a single package, or from the root with
`pnpm --filter @opentechevents/<name> <cmd>`.

## Testing the packages

Unit tests live in each package's `test/`, with input fixtures in `fixtures/`
(valid and invalid trees). Every new package or feature ships fixtures and
tests — that's the repo convention.

The packages also expose CLIs you can run against any directory that looks
like a template fork (see `packages/build-feed/fixtures/valid/` for the
expected shape):

```sh
node packages/validate/dist/bin.js packages/build-feed/fixtures/valid
node packages/build-feed/dist/bin.js packages/build-feed/fixtures/valid --out /tmp/ote-out
node packages/export-ics/dist/bin.js /tmp/ote-out/feed.json
node packages/export-rss/dist/bin.js /tmp/ote-out/feed.json
node packages/export-jsonld/dist/bin.js /tmp/ote-out/feed.json
```

### Regenerating the embedded schemas (`packages/validate`)

The schemas come from the `@opentechevents/schema` npm package and are
embedded into `src/schemas.generated.ts` so the validator can be bundled for
the browser. After bumping the dependency (Dependabot opens that PR):

```sh
cd packages/validate
pnpm gen          # re-embeds from @opentechevents/schema
pnpm test         # the drift-guard test fails until you do
```

Never edit `schemas.generated.ts` by hand.

## Testing the editor (apps/editor)

```sh
pnpm --filter @opentechevents/editor dev
```

It prints the URL (first free port from 8000 up; set `PORT` to force one).

esbuild rebuilds on change; reload the browser (no HMR).

What to try:

- **No `?repo=`** → the app asks for a repository.
- **`?repo=owner/name` of any repo without `ote.config.json`** (e.g.
  `octocat/Hello-World`) → warning banner, full form. Fill Name + Start date
  and watch the slug/id auto-suggest and the status badge in the action bar.
  "Add event" opens the review step (summary + collapsible JSON) and from
  there a prefilled issue in that repo — don't submit it against repos you
  don't own.
- **Full flow** needs a repo shaped like a template fork: `ote.config.json`
  plus `events/*.json` (copy them from `packages/build-feed/fixtures/valid/`
  into a scratch repo on your account). Then the banner shows the feed title,
  the configured profile drives the form, and "Edit existing" lists and
  prefills events.
- **Fallback paths**: a >8000-char description flips "Add event" to the
  copy-paste fallback; exhausting the unauthenticated GitHub API quota
  (60 req/h) makes the event list fall back to the fork's published
  `feed.json`, with a warning.
- **"Repeat as a series"** (recurrence rows in the "Cuándo" section) generates
  every occurrence at once. With a repo connected, its confirm button
  submits all of them as **one** issue (multiple JSON blocks, always the
  copy-paste fallback — a batch is never small enough for a URL prefill) —
  no per-occurrence review, since each is already a complete, independently
  valid event. Standalone mode (no `?repo=`) still reviews one occurrence at
  a time, since "submit" there means copy/download, not open an issue.

The logic lives in `apps/editor/src/lib/` (pure, vitest-tested — add tests
there for any behavior change); `src/main.ts` and `src/ui/` are the DOM layer,
verified by hand. UI changes: include before/after checks in your PR
description, there is no browser test suite.

Note the editor talks to real external services (GitHub raw/API, OSM tiles,
Nominatim search) even in dev.

## Testing the previewer (apps/preview)

```sh
pnpm --filter @opentechevents/preview dev
```

Open the printed URL with `?repo=owner/name`. The app first tries the fork's
GitHub Pages exports (`feed.json`, `feed.ics`, `feed.xml`) and falls back to
the same filenames at the repository root on the default branch via
`raw.githubusercontent.com`.

## Workflows

- **CI** (`ci.yml`): lint + build + typecheck + test on every push/PR. Green CI
  is the bar for merging.
- **Deploy tools site** (`deploy-tools.yml`): publishes the static tools to
  this repo's Pages (`/editor`, `/preview`) on every push to `main`. Verify
  after merge: <https://opentechevents.github.io/ote-tools/editor/> and
  <https://opentechevents.github.io/ote-tools/preview/>.
- **Reusable workflows for forks** (`validate.yml`, `build-pages.yml`):
  called by ote-template forks via `uses:`. Test changes against a scratch
  fork pointing `uses:` at your branch (`...@your-branch`) before merging —
  every fork on `@v1` gets them.
- **Publish to npm** (`publish.yml`): manual (`workflow_dispatch`), publishes
  whatever workspace versions aren't on the registry yet. Releasing = bump
  `version` in the package(s), merge, run the workflow.

### Versioning and changelogs

The **published** packages track the OTE spec minor they implement: packages
that speak OTE spec v0.4 are versioned `0.4.x`. That keeps the compatibility
story obvious: `@opentechevents/validate` 0.4.x validates against spec v0.4,
and `@opentechevents/import-jsonld` 0.4.x imports into that same event shape.

The ladder covers exactly the packages that go to npm — the ones without
`"private": true`. Workspace-internal packages (`discover-feed`, `feed-urls`,
`preview-feed`) are `private: true`, are consumed only through
`workspace:*`, and keep their own independent versions; nobody installs them
by version, so putting them on the ladder would only add release work. If one
of them is ever published, it joins the ladder at that release.

Within a spec minor, each package uses SemVer patch releases independently:
bug fixes and backwards-compatible improvements bump only the package that
changed (`0.4.0` → `0.4.1`). A new OTE spec minor moves every published
package to the matching minor, even if one package did not need code changes,
so consumers can read compatibility without a lookup table — those packages
still get a changelog entry saying so. Breaking package API changes wait for
the next compatible major/minor plan and must be called out explicitly in the
package changelog.

Every published package has its own `CHANGELOG.md`. Add an `Unreleased` entry
for user-visible fixes, improvements, warnings, mappings, CLI behavior or
dependency changes. On release, move those entries under the version being
published. Keep changelogs focused on the package's behavior, not on commit
mechanics.

The apps (`apps/*`) are `private: true`, never published to npm, and keep their
own versions. Consumer-facing apps or artifacts should still have changelogs
when their deployed behavior matters; `apps/embed` already does because it is a
public widget.
