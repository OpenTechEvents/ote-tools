# Changelog

All notable changes to `@opentechevents/import-ics` are documented here.

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
