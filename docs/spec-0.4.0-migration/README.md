# Migration to OTE Spec 0.4.0 — session plan

Working plan for bringing this repo from OTE Spec **0.3.0** to **0.4.0**.
One file per session; each is self-contained enough to start cold. Delete this
folder once every session is marked done.

## What 0.4.0 actually changes

A **compatibility release that only relaxes validation**. No new fields, no
removed fields. Every valid `0.3.0` document stays valid after changing
`specVersion` to `"0.4.0"`. But tooling must be updated, because the schemas now
use a format this repo does not ship by itself.

| # | Change | Blast radius here |
| --- | --- | --- |
| 1 | HTTP(S) URL fields validate as `format: "iri"` instead of `format: "uri"` — non-ASCII slugs (`…/pycamp-españa`) are valid as published | `packages/validate` codegen + compiled scope, `errors.ts` messages, every fixture, every exporter that writes a URL into ICS/RSS/JSON-LD, every app that parses one |
| 2 | `image[]` and `image[].url` accept `http://` as well as `https://` (was https-only MUST) | `errors.ts` https-only message, image fixtures, editor/embed/publish image handling |
| 3 | The feed recommended-profile warning for `feed.textLanguage` without `feed.organizers` now fires only when at least one embedded event omits its own `textLanguage` | recommended-profile fixtures + validator app copy |
| 4 | `specVersion` const is `"0.4.0"` on both schemas | everything that emits or asserts a spec version |

Both 1 and 2 are the spec issues this repo filed while validating a real
475-event feed ([spec#32](https://github.com/OpenTechEvents/opentechevents-spec/issues/32)
and [spec#31](https://github.com/OpenTechEvents/opentechevents-spec/issues/31)) —
`HANDOFF.md` §1 can drop them once this migration lands.

## Two blockers before any code moves — both cleared in session 1

1. ~~**`@opentechevents/schema@0.4.0` is not on npm.**~~ Published 2026-08-28
   from the spec repo's `schema-v0.4.0` tag. The pin here is that version.
2. ~~**The v0.4 SPDX enum looks corrupted by the release bump.**~~ Fixed
   upstream in `6026f54` before the tag, so 0.4.0 never shipped with
   `copyleft-next-0.4.0` and no `0.4.1` was needed.

## Sessions

| Session | File | Theme | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | [session-1-upstream-and-pin.md](session-1-upstream-and-pin.md) | Unblock upstream, bump the pin, regenerate | — | done |
| 2 | [session-2-validate-messages-and-fixtures.md](session-2-validate-messages-and-fixtures.md) | `packages/validate`: messages that stopped being true, fixtures for the relaxations | 1 | done |
| 3 | [session-3-connectors.md](session-3-connectors.md) | Exporters, importers, feed builders: non-ASCII IRIs end to end | 2 | done |
| 4 | [session-4-apps.md](session-4-apps.md) | validator, editor, publish, preview, dashboard-checks | 2 (3 for exports) | done |
| 5 | [session-5-embed.md](session-5-embed.md) | `apps/embed`: versioned public widget | 2 | done, minus the `embed-v0.8.0` tag/release |
| 6 | [session-6-release-and-docs.md](session-6-release-and-docs.md) | Version bumps to `0.4.x`, changelogs, publish, docs, handoff cleanup | 1–5 | not started |

Sessions 3 and 4 started from a red suite, on purpose — the suite is green
again as of session 4. Session 2 left
`export-ics`, `export-rss`, `export-jsonld` (3, 3 and 5 tests) and
`workers/validator` (4) failing, each on its own feed fixture still declaring
`0.3.0`. That list is at the top of session 2's file.

## Rules that hold across every session

- **English only** in code, comments, tests, docs, commit messages.
- `pnpm build` before `pnpm typecheck` in a fresh clone or worktree.
- Never hand-edit `packages/validate/src/*.generated.ts`; regenerate with
  `pnpm --filter @opentechevents/validate gen`.
- Nothing may compile a schema at runtime — the validator page's CSP has no
  `'unsafe-eval'`.
- Say in each PR which spec version the repo implements after it.
