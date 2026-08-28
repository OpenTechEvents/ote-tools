# Session 6 — release: version every package to `0.4.x`, publish, tidy the docs

**Goal:** the whole repo says, in one voice, that it implements OTE Spec 0.4.0 —
on npm, in the README badge, and in the docs an outside contributor reads.

**Depends on:** sessions 1–5 merged.

**Status:** not started.

## 1. Version bumps

`CONTRIBUTING.md:152-165` sets the rule: published packages track the spec minor
they implement, and **a new spec minor moves every published package to the
matching minor, even if it needed no code changes** — so consumers can read
compatibility without a lookup table.

So every non-private package goes to `0.4.0`:

| Package | Now | After |
| --- | --- | --- |
| `@opentechevents/validate` | 0.3.0 | 0.4.0 |
| `@opentechevents/build-feed` | 0.3.0 | 0.4.0 |
| `@opentechevents/export-ics` | 0.3.1 | 0.4.0 |
| `@opentechevents/export-jsonld` | 0.3.0 | 0.4.0 |
| `@opentechevents/export-rss` | 0.3.1 | 0.4.0 |
| `@opentechevents/import-ics` | 0.3.0 | 0.4.0 |
| `@opentechevents/import-jsonld` | 0.3.1 | 0.4.0 |
| `@opentechevents/discover-feed` | 0.1.0 | see below |
| `@opentechevents/preview-feed` | 0.1.0 | see below |
| `@opentechevents/feed-urls` | 0.1.0 | see below |

The three `0.1.0` packages are off the spec-minor ladder today. Decide once, in
this session, and record the answer in `CONTRIBUTING.md`: either they join it
(they do handle OTE documents) or the rule is narrowed to say which packages it
covers. Leaving it ambiguous is what produced the split in the first place.

Also: `packages/validate/package.json`'s `description` still says "against JSON
Schema v0.3".

## 2. Changelogs

Every published package needs a `0.4.0` entry, including the ones with no code
change — say plainly *"tracks OTE Spec 0.4.0; no behavioural change in this
package"*, which is more useful than an empty section. The ones with real
content:

- `validate` — `iri` format, image `http://` accepted, reworded messages, the
  recommended-profile change, and the `specVersion` drift decision from session 2.
- the exporters/importers — the non-ASCII round trip, if anything changed.
- `apps/embed/CHANGELOG.md` — already written in session 5 and **already
  released**: widget `0.8.0`, tag `embed-v0.8.0` pushed, GitHub release
  created. Nothing to do here beyond not bumping its `version` again for this
  migration; the embed is a private package and is not part of the npm
  publish below.

## 3. Publish

`publish.yml` is a manual `workflow_dispatch` and is idempotent: it publishes
only versions not already on the registry. Bump → merge → run it. Auth is npm
trusted publishing (OIDC), no token.

Order matters against the spec: **`@opentechevents/schema@0.4.x` must already be
on npm** (session 1) or the pin in `validate` is not reproducible for anyone
installing from the registry.

## 4. Docs sweep

- `README.md:5` — the badge `OTE%20spec-v0.3` → `v0.4`.
- `README.md:19,31-32` — the package table's "vendored v0.3 JSON Schema" and the
  versioning paragraph.
- `CONTRIBUTING.md:154-156` — the `0.3.x`/v0.3 examples, plus the decision from
  §1 above.
- `CLAUDE.md` — the spec-version check block is version-agnostic and stays as
  is; re-read it and confirm nothing in it hardcodes 0.3.
- `AGENTS.md` — check for spec references.
- `DESIGN.md` — check; it is a proposal document, so it may legitimately not
  name a version.
- `apps/*/README.md` and `packages/*/README.md` — grep for `v0.3` and `0.3.0`.

## 5. `HANDOFF.md`

Its §1 lists spec#31 (image https-only) and spec#32 (`format: uri` ASCII-only)
as open questions that would change what the validator reports "the day they
land". They landed — that is this whole migration. Remove both, and check
whether §1's remaining item (spec#6, the discovery mechanisms) moved too.

## 6. Deployment

- `deploy-validator.yml` runs on push to `main` — the validator goes out
  automatically. Confirm the live page reports 0.4.0 after the merge.
- `deploy-tools.yml` for the rest of `tools.opentechevents.org`.
- The reusable workflows (`validate.yml`, `build-pages.yml`, `issue-to-pr.yml`)
  are consumed by organizer forks through the floating `@v1` tag. 0.4.0 is a
  relaxation, so **no fork should break** — but a fork's `events/*.json` still
  says `specVersion: "0.3.0"` at the feed level, and the pinned validator now
  only accepts `"0.4.0"`. Whatever session 2 decided about drift is what decides
  whether every existing fork starts failing CI the moment this ships. If the
  answer is "they fail", this needs a migration note for organizers and probably
  an `ote migrate` step before the `@v1` tag moves — **do not move `@v1` until
  that is answered.**

## Done when

- [ ] Every published package is `0.4.0` with a changelog entry.
- [ ] `publish.yml` run, and `npm view @opentechevents/validate version` says
      `0.4.0`.
- [ ] README badge, package table, and CONTRIBUTING say v0.4.
- [ ] `HANDOFF.md` no longer lists spec#31/#32 as pending.
- [ ] The live validator reports spec 0.4.0.
- [ ] The fork-compatibility question in §6 is answered in writing before `@v1`
      moves.
- [ ] `docs/spec-0.4.0-migration/` deleted in the final commit.
