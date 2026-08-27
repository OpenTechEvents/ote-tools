# ote-tools

[![CI](https://github.com/OpenTechEvents/ote-tools/actions/workflows/ci.yml/badge.svg)](https://github.com/OpenTechEvents/ote-tools/actions/workflows/ci.yml)
[![Deploy tools site](https://github.com/OpenTechEvents/ote-tools/actions/workflows/deploy-tools.yml/badge.svg)](https://github.com/OpenTechEvents/ote-tools/actions/workflows/deploy-tools.yml)
![OTE spec](https://img.shields.io/badge/OTE%20spec-v0.3-2563eb)
![Node](https://img.shields.io/badge/node-%3E%3D22-339933)
![pnpm](https://img.shields.io/badge/pnpm-11.13.1-f69220)

Central monorepo for the [OpenTechEvents](https://github.com/OpenTechEvents)
organizer kit: npm connectors (pure functions, no UI), reusable GitHub Actions
workflows, and (phase 2) the web dashboard/editor/previewer/embeddable widget.
Design rationale lives in [DESIGN.md](DESIGN.md); the spec lives in
[opentechevents-spec](https://github.com/OpenTechEvents/opentechevents-spec).

## Packages

| Package | What it does |
| --- | --- |
| [`@opentechevents/validate`](packages/validate/) | Validates OTE Event/Feed documents against the vendored v0.3 JSON Schema. |
| [`@opentechevents/export-ics`](packages/export-ics/) | Valid OTE Feed → iCalendar (RFC 5545). |
| [`@opentechevents/export-rss`](packages/export-rss/) | Valid OTE Feed → RSS 2.0. |
| [`@opentechevents/export-jsonld`](packages/export-jsonld/) | Valid OTE Feed/Event → schema.org `Event` JSON-LD (SEO structured data). |
| [`@opentechevents/import-ics`](packages/import-ics/) | iCalendar (`.ics`) → partial OTE event documents (review-and-complete). |
| [`@opentechevents/import-jsonld`](packages/import-jsonld/) | schema.org Event JSON-LD in an HTML page → partial OTE event documents. |
| [`@opentechevents/build-feed`](packages/build-feed/) | `events/*.json` + `ote.config.json` → validated `feed.json` + `feed.ics` + `feed.xml`. |
| [`@opentechevents/discover-feed`](packages/discover-feed/) | Reference implementation of feed discovery: response bytes + content-type + URL → candidate feed URLs. No network. |

All connectors are pure functions with a thin CLI on top. They never invent
data: a field absent in the input stays absent in the output.

Published packages follow the OTE spec minor they implement (`0.3.x` speaks
OTE spec v0.3). Each package also has its own changelog so fixes and
improvements can be traced package by package.

## Apps

| App | What it does |
| --- | --- |
| [`editor`](apps/editor/) | Static web editor for OTE events: form → event JSON → prefilled issue or direct edit. |
| [`preview`](apps/preview/) | Static feed previewer for OTE organizer forks. |
| [`publish`](apps/publish/) | "Broadcast" console: one event → every channel it can be published to. schema.org snippet, widget and subscribe links work today; directories, newsletters and social posts are declared and unbuilt. |
| [`embed`](apps/embed/) | Embeddable `<ote-events>` web component: drop an OTE feed into any website. |
| [`validator`](apps/validator/) | Is this document a valid OTE feed or event? Three input modes (URL, file, paste), linkable results, errors pointed at the exact line. |
| [`dashboard-checks`](apps/dashboard-checks/) | Client-side setup checks + template-update banner for OTE organizer dashboards. |

`editor`, `preview`, `publish`, `validator` and `embed` are built and deployed
together by `deploy-tools.yml`; `dashboard-checks.js` is served as a
standalone file. Once the `tools.opentechevents.org` custom domain is
configured (see `.github/workflows/deploy-tools.yml`), they're reachable at
`tools.opentechevents.org/editor`, `/preview`, `/validator` and `/embed`.

## Workers

| Worker | What it does |
| --- | --- |
| [`fetch-url`](workers/fetch-url/) | Cloudflare Worker, the **only** component with network access: given a URL, return the bytes, under SSRF and size limits. Deployed to Cloudflare, not to the tools site. |

It exists for one mode of one tool: the validator cannot fetch a third-party
feed from the browser, because community feeds send no CORS headers. This is
not the "CORS proxy for reading platforms" that DESIGN.md rules out — it
fetches a document the user already has the URL of, in order to validate it,
and stores nothing.

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

Both workflows accept optional inputs:

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
