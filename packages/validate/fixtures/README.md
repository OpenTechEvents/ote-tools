# Fixtures

Copied from `spec/v0.4/examples` in
[opentechevents-spec](https://github.com/OpenTechEvents/opentechevents-spec/tree/main/spec/v0.4/examples)
(tag `schema-v0.4.0`, commit `6026f545e45fd4e2aa77a5b861612eb4b8f76fbc`, copied
2026-08-28). Re-copy them whenever the pinned `@opentechevents/schema` version
moves: they are the spec's own examples, validated in the spec's CI, and
keeping them a copy rather than a rewrite is what makes them evidence.

- `valid/` — documents that must pass validation. `feed.json`, `feed-community.json`
  and `feed-multipart.json` are Feeds; the rest are Events.
- `invalid/` — documents that must fail, one per error type. Files prefixed
  `feed-` are Feed documents (validate with `validateFeed`); the rest are
  Events (validate with `validateEvent`).
- `versioned/` — documents about the *spec version*, not the spec's rules.
  Each is valid or invalid depending on which version's schemas it is measured
  against, which is exactly what they exist to pin.

## Not from the spec

These are specific to this package — they test what the *validator* says, not
what the spec allows, and each carries a `_comment` saying so:

| Fixture | What it pins |
| --- | --- |
| `invalid/event-future-specversion.json` | an unrecognized `specVersion` names the versions that do exist, rather than reading as a typo |
| `versioned/event-0.3.0.json` | a document from an earlier supported release is **valid**, measured against its own version — and, under a hand-picked 0.4.0, says which version each finding came from |
| `versioned/feed-corunajug-0.3.0.json` | the real feed this work came from (`corunajug.org`, 9 events, `0.3.0`), verbatim: the page and the adopter-registration bot must not disagree about it |
| `versioned/feed-0.1.0.json` | out of the support window: an error that says to migrate, with the document still measured against its own schemas |
| `versioned/feed-no-specversion.json`<br>`versioned/feed-unknown-specversion.json` | no rules to judge the document by; the error lists the versions that exist |
| `valid/event-non-ascii-id.json` | v0.4's `iri` relaxation reaches `partOf.id` too, not just `id` and `url` (the spec's own `event-iri-url.json` covers those two) |
| `valid/event-image-http.json` | v0.4 accepts an image over plain `http://` — in **both** entry forms, bare string and object |
| `invalid/event-id-with-space.json` | that relaxation did not become "anything goes": a space is still not an address |
| `invalid/event-image-userinfo.json` | the credentials rule survives v0.4 on the field that changed |
| `valid/feed-textlanguage-all-events-declare.json` | v0.4's recommended-profile change: with every event declaring its own `textLanguage`, the feed-level warning stays silent |
| `valid/feed-textlanguage-event-inherits.json` | its sibling — one event inherits, so the warning still fires |

The last two are the only way to catch a regression in that change: it is
invisible to a pure validity suite, since both documents are valid.
