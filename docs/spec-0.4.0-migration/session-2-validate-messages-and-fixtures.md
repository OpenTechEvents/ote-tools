# Session 2 — `packages/validate`: messages that stopped being true, and fixtures for what 0.4.0 relaxed

**Goal:** the validator's human-readable output matches what 0.4.0 actually
enforces, and the three relaxations are pinned by fixtures so nothing can
silently re-tighten them.

**Depends on:** session 1 — done, pin is `@opentechevents/schema@0.4.0`.

**Status:** done (2026-08-28). `pnpm --filter @opentechevents/validate test` is
green (159 tests). Fixtures were **re-copied from `spec/v0.4/examples`** rather
than bulk-bumped: the upstream examples differ from the old fixtures only in
`specVersion` and the `docs/history/CHANGES.log` path in their comments, so the
copy is both the smaller diff and the one that keeps them evidence — and it
brings the spec's own `event-iri-url.json`. The `specVersion` decision is
recorded below and in `errors.ts`'s `specVersionMessage`.

What it left failing elsewhere (`pnpm -r --no-bail test`), for sessions 3 and 4:

- `packages/export-ics`, `packages/export-rss`, `packages/export-jsonld` — 3, 3
  and 5 tests. Each package's own feed fixture still declares `0.3.0`, so its
  "fixture is a valid OTE feed" guard and the CLI tests that validate before
  exporting fail. Session 3.
- `workers/validator` — 4 tests in `test/badge.test.ts`, same cause (the feed
  the badge test serves declares `0.3.0`). Session 4.

`pnpm typecheck` is clean across the workspace.

## What session 1 handed over

`pnpm --filter @opentechevents/validate test` is **24 failed / 122 passed**,
all of it this session's territory (the three codegen guard tests are green):

- `test/validate.test.ts` (21). Most are the bulk `specVersion` bump: every
  `valid/` fixture now fails with *"specVersion: is not a spec version this
  validator knows (it implements OTE Spec 0.4.0)"* — 12 fixture cases plus the
  feed-context ones. Four are real message work: `names the rule an http image
  URL broke, and only that` (the `^https://` entry is now unreachable, §2),
  `says what a credential-carrying URL is, in words`, "explains the other
  `not` in these schemas…" (the recommended-profile `textLanguage` message no
  longer mentions `organizers`, because 0.4.0 rewrote that rule — §3's last
  two fixtures),
  `a specVersion this validator doesn't know reads as drift` (§3, the product
  decision), and `empty location asks for venue or onlineUrl in a single
  message`.
- `test/cli.test.ts` (3) — all downstream of the fixtures declaring `0.3.0`
  (`single valid file → exit 0`, `feed.json is classified as feed`, `directory
  of valid fixtures → exit 0`).

## Why this session exists at all

`CLAUDE.md` states it: human-readable messages in
[packages/validate/src/errors.ts](../../packages/validate/src/errors.ts) are
keyed to specific rules, so a rule that moved leaves a message that lies. Two
rules moved.

## 1. Messages keyed to `uri`

- [errors.ts:44](../../packages/validate/src/errors.ts#L44) —
  `[/\/id$/, "must be a URI (e.g. …)"]`. "URI" is now the wrong word: an id may
  carry non-ASCII characters. Say what the rule is — an absolute `http(s)`
  address, no credentials — rather than naming a JSON Schema format.
- The generic `format` branch at
  [errors.ts:198-207](../../packages/validate/src/errors.ts#L198-L207) falls
  through to `must be a valid ${format}`, which will now print **"must be a
  valid iri"** at a publisher. Nobody outside JSON Schema knows that word. Give
  `iri` its own message before the fallthrough — the failure it reports is
  really "this isn't a usable web address" (control characters, spaces, `<`,
  `>`, `"`, or something `new URL()` cannot parse). Check `isIri` in the
  vendored `validators.generated.ts` for the exact rejection set and describe
  *that*, not the format name.
- Grep the whole package for the string `uri`/`URI` in user-facing text before
  declaring this done, including `README.md` and the CLI's help output in
  [cli.ts](../../packages/validate/src/cli.ts).

## 2. The https-only message is now a lie for images

[errors.ts:49-58](../../packages/validate/src/errors.ts#L49-L58): the
`PATTERN_BY_REGEX` table exists precisely because image URLs were `^https://`
while everything else was `^https?://`. In 0.4.0 **both image forms are
`^https?://`**, so:

- `["^https://", "must be an https:// URL — http:// is not accepted here"]` is
  now unreachable for images. Confirm with a grep of
  `src/schemas.generated.ts` for `"^https://"` — if the count is zero, delete
  the entry **and** the doc comment above the table that justifies it with the
  TLS argument, which no longer holds.
- The comment at [errors.ts:245-249](../../packages/validate/src/errors.ts#L245-L249)
  uses `{ "url": "http://…" }` as its worked example of branch noise. That
  document is now valid; the example must be rewritten around a failure that
  still fails (e.g. `{ "url": "ftp://…" }` or a missing `url`) or it teaches the
  next reader the wrong rule.
- `URL_FIELD` at [errors.ts:67](../../packages/validate/src/errors.ts#L67) still
  needs `/image/\d+$` — the credentials rule survives 0.4.0 unchanged.

## 3. Fixtures

`packages/validate/fixtures/` carries ~120 files, nearly all of them declaring
`"specVersion": "0.3.0"`.

- **Bulk bump** `0.3.0` → `0.4.0` across `fixtures/valid/` and
  `fixtures/invalid/`, then read the diff: any fixture that mentions `0.3.0` for
  a reason other than its own `specVersion` (e.g. a license id, a URL path, an
  id) must be reverted by hand. `copyleft-next-0.3.0` is the known trap.
- **Keep one deliberate drift fixture.** `test/validate.test.ts:62` asserts that
  an unknown `specVersion` reads as drift, not a typo, and its message embeds
  the implemented version. It should now use a version *newer* than 0.4.0, not
  `0.3.0` — a `0.3.0` document is a real thing a real publisher has, and the
  spec's own compatibility promise is that only `specVersion` changes. Decide
  and write down which behaviour is intended: reject `0.3.0` as drift (current
  behaviour, since the schema pins a `const`), or report it as a version this
  validator no longer implements with an upgrade hint. **This is the one real
  product decision in the migration** — the repo validates other people's live
  feeds, and most of them will say `0.3.0` for months.

### New fixtures to add

| Fixture | Kind | Pins |
| --- | --- | --- |
| `valid/event-non-ascii-id.json` | valid | `id`, `url` and `partOf.id` with a literal `ñ` (`…/pycamp-españa`) — the exact case from spec#32 |
| `valid/event-image-http.json` | valid | an `image[]` entry over plain `http://`, both bare-string and object form |
| `invalid/event-id-with-space.json` | invalid | an `iri` that is still not an address — proves the relaxation did not become "anything goes" |
| `invalid/event-image-userinfo.json` | invalid (may exist) | credentials still refused on images |
| `valid/feed-textlanguage-all-events-declare.json` | valid, **no recommendation** | the 0.4.0 recommended-profile change: no `feed.organizers`, feed has `textLanguage`, every event declares its own → warning must stay silent |
| `valid/feed-textlanguage-event-inherits.json` | valid, **one recommendation** | same shape but one event omits `textLanguage` → warning must still fire |

The last two are the only way to catch a regression in change #3 of the
release: it is invisible to a pure validity suite.

## 4. Package-level docs

- `packages/validate/README.md` — every `v0.3` reference.
- `packages/validate/fixtures/README.md` — explains the fixture set; add the new
  files.
- Do **not** bump `packages/validate/package.json`'s own `version` here; all
  package versions move together in session 6.

## The `specVersion` decision, as taken

**A `0.3.0` document stays an error, with an upgrade hint.** The schema pins one
version with a `const`, so accepting the previous release would mean shipping
two embedded schemas — out of scope here, and a promise this package would then
owe for every future release. But the message now distinguishes the two cases:

- older than the implemented version → *"is OTE Spec 0.3.0, an earlier release
  than the 0.4.0 this validator implements; set specVersion to "0.4.0" and
  check again — every other error here is already measured against 0.4.0"*
- newer, or not a version at all → the existing drift message, which points at
  updating `@opentechevents/validate` rather than the document.

Telling the two apart needs the document's own value, which Ajv's `const` error
does not carry (it reports the value the *schema* wanted). So `formatAjvErrors`
takes an optional second argument, the document, and reads the value back out
by the error's JSON Pointer. Both cases have a fixture
(`invalid/event-old-specversion.json`, `invalid/event-future-specversion.json`).

## Done when

- [ ] No user-facing message names a JSON Schema format the publisher cannot act
      on, and no message claims images must be https.
- [ ] Fixtures declare `0.4.0`, with the license-id trap checked.
- [ ] The six fixtures above exist and are asserted in `test/validate.test.ts`.
- [ ] The `specVersion` drift decision is written down in the PR body and in
      `errors.ts`'s comment.
- [ ] `pnpm --filter @opentechevents/validate test` green.
