# Changelog

All notable changes to `@opentechevents/import-ics` are documented here.

## 0.6.0

- **Targets OTE Spec 0.6.0.**
- **It mints the `id` now, following D040's order** — `--id-base` /
  `idBase` for a domain the community controls, `--source-url` /
  `sourceUrl` for the `<url>#<UID>` fallback, and neither means no `id` plus
  a warning naming both routes. Previously every event got a flat "an ICS UID
  is not an OTE id" warning and nothing else.

  Both minted forms warn that **the id is permanent**: re-minting gives every
  consumer that stored the old one a duplicate, with no way to relate the two
  and no migration path. The two differ in how they can drift —
  `<url>#<UID>` is stable by construction, while the `idBase` slug comes from
  the event's name and would change if the event were renamed.
- **A link can be rescued from an HTML `DESCRIPTION`** when the calendar has
  no `URL` property, which is the normal case. The first off-host link
  becomes `url`, with a warning to check it is the event's page and not a
  sponsor — "off-host" measured against `sourceUrl` when given, so a link
  back to the calendar provider is not mistaken for one. It is **never**
  allowed to become the `id`: a wrong `url` is corrected by the next import,
  a wrong `id` is a duplicate forever.
- Unchanged, and verified against the spec's worked example rather than
  assumed: HTML `DESCRIPTION` → Markdown, and the all-day `timezone`
  resolution order (`X-WR-TIMEZONE`, then a zone known from the publisher,
  then `UTC`, and never geocoding `LOCATION`). Given the same `.ics`, the
  `id` and `description` now match
  `spec/v0.6/examples/event-from-ics.json` character for character.

## 0.4.1

- **New: `ote-import-ics` CLI.** `ote-import-ics [--tz <zone>] [--public] <calendar.ics|->`
  prints `{ events, warnings }` as JSON; exit `0` = at least one event, `1` =
  nothing converted, `2` = usage or I/O. `--public` is opt-in, mirroring the
  library's `sourceVisibility` default, so no organizer email leaves a calendar
  that was never published. Added so the mapping stays behind one boundary for
  callers without a bundler — in particular the organizer skill (`skills/`),
  which otherwise would have had to re-derive the VEVENT mapping in a prompt.

## 0.4.0

- Tracks **OTE Spec 0.4.0**; no behavioural change in this package. New fixture
  `non-ascii-iri.ics`: a `URL` property with non-ASCII characters is carried
  into the partial event unchanged, and the result is valid under 0.4.0's
  `format: iri`.

## 0.3.0

- Initial package release for OTE spec v0.3.
