# Fixtures

Copied from `spec/v0.6/examples` in
[opentechevents-spec](https://github.com/OpenTechEvents/opentechevents-spec/tree/main/spec/v0.6/examples)
(tag `schema-v0.6.0`, commit `f81a190ffdaf2226243ee9be7cbbfbfcf0f84191`, copied
2026-11-03). Re-copy them whenever the pinned `@opentechevents/schema` version
moves: they are the spec's own examples, validated in the spec's CI, and
keeping them a copy rather than a rewrite is what makes them evidence.

The npm package ships schemas only, not examples, so the copy comes from the
spec repository at the tag matching the pinned version — not from
`node_modules`. Verify the four schema files at that tag are byte-identical to
the ones in the installed package before copying; if they are not, the tag and
the release have diverged and the examples cannot be trusted as evidence.

- `valid/` — documents that must pass validation. `feed.json`, `feed-community.json`
  and `feed-multipart.json` are Feeds; the rest are Events.
- `invalid/` — documents that must fail, one per error type. Files prefixed
  `feed-` are Feed documents (validate with `validateFeed`); the rest are
  Events (validate with `validateEvent`).
- `versioned/` — documents about the *spec version*, not the spec's rules.
  Each is valid or invalid depending on which version's schemas it is measured
  against, which is exactly what they exist to pin.

  **Which support case a fixture represents is decided by the policy, not by
  this file**, and the policy is computed from the last three releases — so a
  release moves it without anyone editing anything. `event-0.3.0.json` was the
  "older but supported" case when it was written and is now out of the window;
  `event-0.4.0.json` carries that role today. Nothing here has to be
  remembered: the test that asserts `support.action === "inform"` on it
  (`test/versions.test.ts`) fails the day the window moves past it, and the fix
  is to re-stamp a fixture at the oldest supported version — never to relax the
  assertion. `skills/evals` enforces the same thing by role, for the same
  reason.

## Not from the spec

These are specific to this package — they test what the *validator* says, not
what the spec allows, and each carries a `_comment` saying so:

| Fixture | What it pins |
| --- | --- |
| `invalid/event-future-specversion.json` | an unrecognized `specVersion` names the versions that do exist, rather than reading as a typo |
| `versioned/event-0.4.0.json` | a document from an **older but still supported** release is valid, with a notice and no error — the case `DocumentReport.support.action === "inform"` exists for |
| `versioned/event-0.3.0.json` | the same document one release further back, now **outside** the window: still valid against its own schemas, and asked to migrate — and, under a hand-picked version, it says which version each finding came from |
| `versioned/feed-corunajug-0.3.0.json` | the real feed this work came from (`corunajug.org`), verbatim: the page and the adopter-registration bot must not disagree about it |
| `versioned/feed-0.1.0.json` | out of the support window: an error that says to migrate, with the document still measured against its own schemas |
| `versioned/feed-no-specversion.json`<br>`versioned/feed-unknown-specversion.json` | no rules to judge the document by; the error lists the versions that exist |
| `valid/event-non-ascii-id.json` | the `iri` relaxation reaches `partOf.id` too, not just `id` and `url` (the spec's own `event-iri-url.json` covers those two) |
| `valid/event-image-http.json` | an image over plain `http://` is accepted — in **both** entry forms, bare string and object |
| `invalid/event-id-with-space.json` | that relaxation did not become "anything goes": a space is still not an address |
| `invalid/event-image-userinfo.json` | the credentials rule survives on the field that relaxation changed |
| `valid/feed-textlanguage-all-events-declare.json` | the recommended-profile change: with every event declaring its own `textLanguage`, the feed-level warning stays silent |
| `valid/feed-textlanguage-event-inherits.json` | its sibling — one event inherits, so the warning still fires |

The last two are the only way to catch a regression in that change: it is
invisible to a pure validity suite, since both documents are valid.
