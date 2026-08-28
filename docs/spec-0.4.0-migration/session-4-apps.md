# Session 4 — apps: validator, editor, publish, preview, dashboard-checks

**Goal:** every tool a person actually opens speaks 0.4.0, accepts a non-ASCII
address in its inputs, and stops telling anyone an image must be https.

**Depends on:** session 2. Export previews additionally depend on session 3.

**Status:** not started.

`apps/embed` is deliberately **not** here — it is a versioned public asset with
its own release rules. See [session 5](session-5-embed.md).

## `apps/validator`

The most visible surface: it reports verdicts on other people's live feeds.

- [index.html:101](../../apps/validator/index.html#L101) — the paste
  placeholder still shows `"specVersion": "0.3.0"`.
- [src/main.ts:273-274](../../apps/validator/src/main.ts#L273-L274) — the
  summary line prints `report.specVersion`, which follows the pin. No edit
  expected; verify in a browser, not only in tests.
- `test/format.test.ts`, `test/locate.test.ts`, `test/report.test.ts`,
  `test/resolve.test.ts` — bump the `0.3.0` literals, **except** wherever the
  point of the test is a version the validator does not implement.
- Add a browser check with a real non-ASCII feed URL: the page's own URL mode
  builds a permalink (`?doc=…`) out of what the user typed. A feed URL with `ñ`
  must survive the round trip through the permalink, the `/fetch` endpoint and
  the badge — three places that each do their own encoding. This is the one
  thing in this session that unit tests cannot see.
- Read `apps/validator/README.md` first; its worst failure mode (the detached
  global `fetch`, and a bundle that throws at import registering no listeners at
  all) is invisible to the suite.

## `workers/validator`

`test/badge.test.ts` and `test/handler.test.ts` carry `0.3.0` literals. Also
check `/badge` and `/fetch` against a non-ASCII `?doc=` — the Worker builds URLs
from query parameters, and a double-encoded or dropped `ñ` produces a "feed not
found" that looks like the publisher's fault.

## `apps/editor`

- `kind: "url"` fields in [src/ui/form.ts](../../apps/editor/src/ui/form.ts)
  (event `url` at :281, `onlineUrl` at :391, organizer url at :1312, image url
  at :1339) render as `<input type="url">`. Browsers apply their own validity
  check to that type, and it is **not** the spec's: confirm in a real browser
  (the editor's `CLAUDE.md` has the browser-testing notes) that a literal `ñ` in
  the path is accepted rather than showing "Please enter a URL". If the native
  check rejects it, the field has to drop `type="url"` and rely on the schema —
  which is the real authority anyway, via
  [src/lib/validation.ts](../../apps/editor/src/lib/validation.ts) and
  `buildFeed`.
- The image row's placeholder and help text at :1333-1346 assume https. With
  0.4.0 accepting `http://`, decide whether the editor keeps nudging toward
  https (reasonable — it is still the better address to publish) but it must not
  *reject*, and the wording should not claim the spec requires it.
- `test/event-json.test.ts` and `test/validation.test.ts` — check the `0.3.0`
  and https assumptions.
- The editor omits `specVersion` from event files on purpose (inherited from the
  feed); that stays true in 0.4.0.

## `apps/publish` (Broadcast)

- [test/lib.test.ts:8](../../apps/publish/test/lib.test.ts#L8) — version literal.
- [src/lib/submission.ts](../../apps/publish/src/lib/submission.ts) —
  `encodeURIComponent`s the event URL into intent links for Bluesky, X, WhatsApp
  and Telegram. That is correct and must stay: encoding a URL *as a query
  parameter value* is a different operation from rewriting the address itself.
  Add a test with a non-ASCII event URL so nobody "simplifies" it later.
- [src/lib/event-readiness.ts:61](../../apps/publish/src/lib/event-readiness.ts#L61)
  counts images; if any readiness rule requires https, relax it to match the
  spec.
- Read `apps/publish/CLAUDE.md` before touching it (pinned-event rule, the
  generated/guided/planned ladder).

## `apps/preview` and `apps/dashboard-checks`

Smaller: version strings, and a pass over anything that parses a feed URL or an
image URL. `dashboard-checks.js` is plain JS — check whether it asserts a
`specVersion` anywhere.

## Done when

- [ ] No app shows `0.3.0` in placeholder or copy.
- [ ] A feed at a non-ASCII URL validates end to end in a **real browser**:
      validator page → `/fetch` → verdict → permalink → badge.
- [ ] The editor accepts a non-ASCII `id`/`url`/image URL without native input
      validation getting in the way, verified in a browser.
- [ ] Nothing in any app claims images must be https.
- [ ] `pnpm test` green.
