# Fixtures

Copied from `spec/v0.3/examples` in
[opentechevents-spec](https://github.com/OpenTechEvents/opentechevents-spec/tree/main/spec/v0.3/examples)
(commit `9141383605f2ef8f299f79df9a13900bb48b83ad`, copied 2026-08-05).

`@opentechevents/schema@0.3.0` is not published to npm yet — v0.3 is still a
draft, consumed locally via a `link:` dependency (see `packages/validate/package.json`).
Re-copy these fixtures (and re-run `pnpm gen`) once 0.3.0 is published, in case
anything changed between this commit and the actual release.

- `valid/` — documents that must pass validation. `feed.json`, `feed-community.json`
  and `feed-multipart.json` are Feeds; the rest are Events.
- `invalid/` — documents that must fail, one per error type. Files prefixed
  `feed-` are Feed documents (validate with `validateFeed`); the rest are
  Events (validate with `validateEvent`). `event-future-specversion.json` is
  NOT from the spec's example set — it's specific to this package, testing
  that an unrecognized `specVersion` reads as "the spec moved on" rather than
  a generic validation error (see `src/errors.ts`).
