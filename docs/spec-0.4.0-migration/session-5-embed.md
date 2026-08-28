# Session 5 — `apps/embed`: the versioned public widget

**Goal:** `<ote-events>` renders a 0.4.0 feed, including events whose addresses
and images are not ASCII-and-https, and ships as a properly versioned release.

**Depends on:** session 2.

**Status:** done (2026-08-28), except the release itself — see "What is left"
below. Widget `0.8.0` / `oteSpecVersion` `0.4.0`, `pnpm test` and
`pnpm typecheck` green at the root, `versions/v0.8.0/` snapshotted.

What the session decided and found:

- **The mixed-content decision: an `http://` image is treated as absent on an
  `https` page.** Cards fall back to the placeholder (or `placeholder-image`),
  the list body and modal render without an image and reclaim the space — the
  same surface an imageless event already produces. Rendering a frame that the
  browser refuses to fill is the one option that tells the visitor the
  *publisher* is broken. On an `http` page nothing is blocked, so the image is
  rendered as published: the gate reads `location.protocol`
  (`render.ts#displayableImage()`) rather than assuming https.
- **Upstream of it, `firstImage()` now falls through.** With several images,
  the first `https://` entry wins over an earlier `http://` one
  (`packages/preview-feed/src/format.ts`), so the degrade above only happens
  when *every* entry is `http://`. Never worse than the old behaviour: an
  `https` image loads on an `http` page too. This is the one change outside
  `apps/embed`, and `apps/preview` inherits it.
- **No consumer's rendering changes.** `http://` images only became legal in
  0.4.0, so no feed that is valid under 0.3.0 can reach either branch — minor
  bump, not major, exactly as this file predicted.
- **`new URL(value)` in `render.ts#urlLike()` neither throws nor re-encodes**:
  it returns the *original* `value`, and only reads `url.protocol`. Nothing in
  the render path re-encodes, so `event-id` keeps matching.
- **Verified in a real browser** (headless Chrome over CDP; Playwright's
  profile was locked by another session), a card widget pinned with
  `event-id="https://ejemplo.org/eventos/pycamp-españa"` against a local 0.4.0
  feed: on `http://localhost` one card, "PyCamp España", `src` still the
  literal `…/imágenes/cartel.jpg`; on an `https://localhost` copy of the same
  page, the same single card with **no `<img>` and the placeholder `div`
  instead**. Both halves of the decision, on a real engine.
- `<ote-subscribe>`'s builders were already right and now say so in tests: one
  round of encoding for the query-parameter services, none for the
  scheme-swapping links (`webcal://`, `feed://`, Google's `cid`), which a
  calendar app opens as an address rather than reading out of a parameter.

## What is left: the release is not finished

`package.json` is at `0.8.0` with the changelog and snapshot in the same
change, but the **tag, push and GitHub release have not been made** — that is
precisely the gap `apps/embed/CLAUDE.md` warns about, and until it is closed
nobody may be told to pin `embed-v0.8.0`. Finish it (or fold it into
[session 6](session-6-release-and-docs.md)) before advertising the version:

```sh
git ls-remote --tags origin | grep embed-v0.8.0   # prints nothing today
```

Read [apps/embed/CLAUDE.md](../../apps/embed/CLAUDE.md) before anything else.
This is the one app whose old builds stay live forever: consumers pin
`https://tools.opentechevents.org/embed/v0.7.0/ote-events.js` on their own
sites, and `apps/embed/versions/` holds a committed snapshot per release.

## The version fields are two different things

`apps/embed/package.json` carries both:

- `"version": "0.7.0"` — the **widget's** semver, on its own ladder.
- `"oteSpecVersion": "0.3.0"` — the spec it speaks. `build.mjs:9-31` derives
  `v0.3` from it, injects `__OTE_SPEC_VERSION__` into the playground, and fills
  the versioning table in `index.html`.

Only `oteSpecVersion` tracks the spec. Bumping it to `0.4.0` changes the
playground header, the schema links in the table
([index.html:542-605](../../apps/embed/index.html#L542-L605)), and the row for
the release being cut.

## What the widget actually has to handle

1. **Non-ASCII addresses.** [src/render.ts:435](../../apps/embed/src/render.ts#L435)
   does `new URL(value)` on a value from the feed — verify it does not throw or
   silently normalise a literal `ñ` into a percent-encoded form that then
   mismatches an `event-id` filter. `event-id` matching is exact string
   comparison against `id`; if anything in the pipeline re-encodes, pinning an
   event by id breaks for exactly the publishers 0.4.0 was written for.
2. **`http://` images.** The widget renders `image[]`. An `http://` image on an
   `https` host is **mixed content** and the browser blocks it. The spec now
   permits such a feed, so the widget must degrade rather than show a broken
   frame: decide the behaviour (skip the entry and fall through to the next in
   the list, or render without an image) and write it down in the changelog —
   this is a real, user-visible product decision, not a lint fix.
3. **Subscribe URLs.** [src/subscribe-urls.ts](../../apps/embed/src/subscribe-urls.ts)
   `encodeURIComponent`s the feed URL into third-party services. Correct as a
   query-parameter encoding; add a non-ASCII case so it stays that way.

## Release mechanics

Per `apps/embed/CLAUDE.md`:

1. Decide the bump. Spec-version support plus the mixed-content behaviour is at
   least a **minor** (`0.8.0`) — new behaviour, no break. If the image decision
   ends up changing what a consumer already sees for a feed that works today,
   argue major instead, in the PR.
2. Update `apps/embed/package.json` (`version` **and** `oteSpecVersion`) first,
   in the same commit as `apps/embed/CHANGELOG.md`.
3. Regenerate the committed snapshot at `apps/embed/versions/v<version>/`.
4. Update the versioning table rows in `index.html` — every existing row keeps
   pointing at the spec version it was built against; only the new row says
   v0.4. **Do not rewrite history in that table**: an old build genuinely does
   speak v0.3, and telling a consumer otherwise sends them debugging the wrong
   thing.
5. `apps/embed/versions/v0.4.0/` already exists — that is the **widget's**
   0.4.0, released long before this spec version. Do not confuse the two
   ladders; the coincidence is exactly the kind of thing that makes someone
   overwrite a live asset.

## Done when

- [x] `oteSpecVersion` is `0.4.0` and the playground/table reflect it.
- [x] Widget version bumped, `CHANGELOG.md` entry written, snapshot regenerated.
- [x] The mixed-content image behaviour is decided, implemented and documented
      (changelog, playground versioning tab, `apps/embed/CLAUDE.md`).
- [x] Non-ASCII `id` matching verified against `event-id` in a real browser.
- [x] Older `versions/` snapshots untouched, and their table rows still say v0.3
      — v0.7.0 moved from the templated top row to a static one, still v0.3.0.
- [ ] Tagged and released as `embed-v0.8.0` (see "What is left" above).
