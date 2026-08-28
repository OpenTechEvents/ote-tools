# Session 5 — `apps/embed`: the versioned public widget

**Goal:** `<ote-events>` renders a 0.4.0 feed, including events whose addresses
and images are not ASCII-and-https, and ships as a properly versioned release.

**Depends on:** session 2.

**Status:** not started.

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

- [ ] `oteSpecVersion` is `0.4.0` and the playground/table reflect it.
- [ ] Widget version bumped, `CHANGELOG.md` entry written, snapshot regenerated.
- [ ] The mixed-content image behaviour is decided, implemented and documented.
- [ ] Non-ASCII `id` matching verified against `event-id` in a real browser.
- [ ] Older `versions/` snapshots untouched, and their table rows still say v0.3.
