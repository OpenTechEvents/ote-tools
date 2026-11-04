# Changelog

All notable changes to `@opentechevents/build-feed` are documented here.

## 0.6.0

- **Implements OTE Spec 0.6.0.**
- Reads `contributing`, `covers` and `alternates` from `ote.config.json`'s
  `feed` block and carries them into the assembled feed. Shape only is checked
  here; the feed schema owns the rest once the feed exists.
- **`contributing` is inherited feed→event**, like `license`, so
  `resolveEventInheritance` pushes it down — the exporters read each event's
  fields directly and know nothing about feed-level inheritance. `covers` and
  `alternates` deliberately do not inherit: both describe the collection, not
  an event in it.
- `OteEvent` gains `speakers` and `recordings` so a 0.5+ feed type-checks.
- No change to `--check`'s coverage, and that is worth stating: all five
  feed-root keywords — `uniqueEventIds`, `sharedOffersConsistent`,
  `eventsNotNewerThanFeed`, `eventsRespectInheritedTextLanguage` and
  `orderedCoverage` — already ran, because `--check` validates the assembled
  feed and the keywords are compiled into the validators. `partOf.offers`
  consistency (D032) is caught today; tests now pin it.

## 0.4.0

- Tracks **OTE Spec 0.4.0**; no behavioural change in this package. It builds
  and validates through `@opentechevents/validate` 0.4.0, so a feed it accepts
  is a feed measured against 0.4.0 — including `http://` images and non-ASCII
  URLs, both of which 0.3 rejected.

## 0.3.0

- Initial package release for OTE spec v0.3.
