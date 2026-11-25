# Changelog

All notable changes to `@opentechevents/export-rss` are documented here.

## Unreleased

- **`feedToRss(feed, { locale })`** translates the field names this exporter
  adds (`When:`, `Where:`, `Attendance:`, the status prefix in a title) and
  formats the date in that language, while keeping the published wall clock
  and naming the zone — RSS has nowhere to say which zone a time belongs to.
  Publisher text is never translated. English and Spanish labels; another
  language gets English labels and its own date format.
- `rssToPreviewFeed` recognises the labels in every language the table has,
  derived from that table rather than listed again, so the two halves of the
  round trip cannot drift.
- Labels now come from `@opentechevents/validate`'s `labelsFor`; the
  eligibility, status and attendance dictionaries are no longer duplicated
  between the two exporters.
- Without `locale`, the output of this release is byte-identical to 0.6.1's.

## 0.6.1

- **An out-of-window feed exports instead of being refused.** This CLI read
  `DocumentReport.valid`, which was `false` for any feed whose `specVersion`
  had left the support window — even with zero schema violations — so it
  printed `not a valid OTE feed` and exited 1. Measured on a registered
  adopter's live feed: 25 valid events, declared 0.3.0, refused. The feed is
  now measured against its own schemas, exports, and the migration ask is
  printed as a note. See `@opentechevents/validate@0.6.1`.
- A feed whose declared version was *never published* is still refused —
  mapping a document whose rules this release does not have would mean
  inventing the mapping — but it is reported with `?` and the words "not
  checked" rather than `✗` and "not a valid OTE feed". It is this release
  that cannot answer, not the publisher's feed that is broken.

## 0.6.0

- **Implements OTE Spec 0.6.0.**
- **A feed is judged by the version it declares** (`validateDocument`), not by
  the newest release — see export-ics 0.6.0 for why. `runCli` is async.
- `speakers` → the item body, as `name, affiliation`.
- `recordings` → `media:player`. Deliberately **not** `media:content` and
  **not** `<enclosure>`: both promise a fetchable media resource, and a
  recording is a watch page, so a reader would try to play HTML.
- `feed.alternates` → `atom:link rel="alternate"` on the channel (the `atom`
  namespace is declared for it).
- `offers[].scope`: an `add-on` prints "additional charge on top of admission"
  instead of its figure, and the set admission is printed next to `Part of:`
  so the total stays reachable.
- `feed.covers` and `contributing` are not emitted: RSS has no element that
  means either, and inventing one would make a promise no reader could read.

## 0.4.0

- Tracks **OTE Spec 0.4.0**; no behavioural change in this package. A feed with
  a non-ASCII URL (`…/pycamp-españa`) — invalid under 0.3, valid under 0.4.0 —
  now has a round-trip test through this package's own reverse-parser proving
  the address survives export and re-parse byte for byte.

## 0.3.1

- `description` (plain text or Markdown, per the OTE spec) is now rendered to
  HTML before being embedded in the item body, instead of being escaped as
  literal text with newlines turned into `<br/>`. Raw inline/block HTML found
  in the Markdown source is escaped rather than passed through live.
- `parse.ts`'s reverse-parser (used by `apps/preview`) now reads every
  top-level block in the item body, not just `<p>` elements, so Markdown
  lists/headings/blockquotes in the description survive the round trip.

## 0.3.0

- Initial package release for OTE spec v0.3.
