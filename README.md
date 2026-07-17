# ote-tools

Central monorepo for the [OpenTechEvents](https://github.com/OpenTechEvents)
organizer kit: npm connectors (pure functions, no UI), reusable GitHub Actions
workflows, and (phase 2) the web dashboard/editor. Design rationale lives in
[DESIGN.md](DESIGN.md); the spec lives in
[opentechevents-spec](https://github.com/OpenTechEvents/opentechevents-spec).

## Packages

| Package | What it does |
| --- | --- |
| [`@opentechevents/validate`](packages/validate/) | Validates OTE Event/Feed documents against the vendored v0.2 JSON Schema. |
| [`@opentechevents/export-ics`](packages/export-ics/) | Valid OTE Feed → iCalendar (RFC 5545). |
| [`@opentechevents/export-rss`](packages/export-rss/) | Valid OTE Feed → RSS 2.0. |
| [`@opentechevents/build-feed`](packages/build-feed/) | `events/*.json` + `ote.config.json` → validated `feed.json` + `feed.ics` + `feed.xml`. |

All connectors are pure functions with a thin CLI on top. They never invent
data: a field absent in the input stays absent in the output.

## Reusable workflows

Organizer repos (forks of `ote-template`) don't copy any build logic — they
call these workflows with `uses:`. The fork stays ~5 lines per workflow and
improvements arrive by moving the `@v1` tag here.

### Validate on PRs — `validate.yml`

Validates `events/*.json` and `ote.config.json`; fails with the offending
file and field. In the consuming repo:

```yaml
# .github/workflows/validate.yml
name: Validate
on:
  pull_request:

jobs:
  validate:
    uses: OpenTechEvents/ote-tools/.github/workflows/validate.yml@v1
```

### Build & deploy Pages — `build-pages.yml`

Builds the feed (`feed.json`, `feed.ics`, `feed.xml`), copies the repo's
`docs/` on top of the site root, and deploys everything to GitHub Pages. In
the consuming repo:

```yaml
# .github/workflows/pages.yml
name: Publish
on:
  push:
    branches: [main]

jobs:
  pages:
    uses: OpenTechEvents/ote-tools/.github/workflows/build-pages.yml@v1
    permissions:
      contents: read
      pages: write
      id-token: write
```

One-time setup in the consuming repo: **Settings → Pages → Source: GitHub
Actions**. After the first run the feed is served at
`https://<user>.github.io/<repo>/feed.json` (plus `feed.ics`, `feed.xml`),
with `docs/index.html` as the site's landing page.

### Issue → PR — `issue-to-pr.yml`

The write path for forks: an `ote-event` issue (the OTE editor's **Propose
change** button generates one) becomes a validated pull request. The event
JSON in the issue body is validated with `@opentechevents/validate` — an
invalid proposal gets a single sticky comment listing what to fix (re-editing
the issue re-runs the check), a valid one is committed to
`ote/issue-<number>` and opened as a PR that closes the issue. In the
consuming repo:

```yaml
# .github/workflows/issue-to-pr.yml
name: Issue to PR
on:
  issues:
    types: [opened, edited]
  pull_request:
    types: [closed]

jobs:
  issue-to-pr:
    if: github.event_name != 'issues' ||
        contains(github.event.issue.labels.*.name, 'ote-event')
    uses: OpenTechEvents/ote-tools/.github/workflows/issue-to-pr.yml@v1
    permissions:
      contents: write
      issues: write
      pull-requests: write
```

One-time setup in the consuming repo: **Settings → Actions → General →
Workflow permissions → enable "Allow GitHub Actions to create and approve
pull requests"**. Without it the workflow validates the JSON and pushes the
branch, but the final PR creation fails with *"GitHub Actions is not
permitted to create or approve pull requests"*.

These workflows accept optional inputs:

| Input | Default | Meaning |
| --- | --- | --- |
| `tools-ref` | commit of the workflow itself | Git ref of ote-tools to run the tools from. The default pins tools and workflow to the same commit, so they never drift. |
| `docs-dir` (build-pages only) | `docs` | Directory copied to the site root. |

Versioning: consume with a major tag (`@v1`). Non-breaking improvements move
the tag; breaking changes ship as `@v2` and are opt-in.

## Development

Node 22 + pnpm. `pnpm install`, then:

```
pnpm build      # compile every package
pnpm test       # vitest across the workspace
pnpm lint
pnpm typecheck
```

English is the official language of the repo — docs, comments, commits,
identifiers. See [CLAUDE.md](CLAUDE.md) for the contributor conventions.
