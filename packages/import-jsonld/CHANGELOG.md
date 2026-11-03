# Changelog

All notable changes to `@opentechevents/import-jsonld` are documented here.

## Unreleased

- **New: `ote-import-jsonld` CLI.** `ote-import-jsonld [--tz <zone>] <page.html|->`
  prints `{ events, warnings }` as JSON; exit `0` = at least one event, `1` = the
  page carries no schema.org Event, `2` = usage or I/O. Reads stdin with `-`, so
  `curl … | ote-import-jsonld -` is the whole import step. Added for callers
  without a bundler — in particular the organizer skill (`skills/`), which
  otherwise would have had to re-derive the schema.org mapping in a prompt.

## 0.4.0

- Tracks **OTE Spec 0.4.0**; no behavioural change in this package. A
  non-ASCII `url` in schema.org markup is carried into the partial event
  unchanged, and the result is valid under 0.4.0's `format: iri` — covered by
  the round-trip test in `@opentechevents/export-jsonld`.

## 0.3.1 - 2026-08-10

- Convert HTML found in schema.org `description` values to Markdown and warn
  that the converted description should be reviewed.

## 0.3.0

- Initial package release for OTE spec v0.3.
