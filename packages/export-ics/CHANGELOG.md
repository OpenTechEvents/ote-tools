# Changelog

All notable changes to `@opentechevents/export-ics` are documented here.

## Unreleased

- **Publishing note:** this release imports `@opentechevents/validate` from
  `src/index.ts`, not only from the CLI. `workspace:*` publishes as an exact
  pin, so `validate` must be published in the same run — releasing this
  package alone would ship a library whose `import { feedToIcs }` fails on a
  missing export, a breakage that previously could only reach the CLI.

### Output changes, for every caller

- **A feed's defaults now reach every event.** A feed may declare
  `organizers`, `textLanguage`, `license` and `contributing` once and let its
  events inherit them — the schemas say so in `x-inheritsFrom`, and the feed
  schema *validates* against the effective value — but this exporter read each
  event's own fields, so a correctly written community feed came out with
  `ORGANIZER` on some events and nothing on the others. One file, one
  publisher, one command, and half the events named nobody. Measured on the
  spec's own corpus: 13 of 26 events inherit `organizers`, 13 inherit
  `textLanguage`, 19 inherit `license` — the majority case, not an edge.
  Replacement, never merge; blanks only, so where neither level declares a
  value the field stays absent (absent `textLanguage` means unknown, never
  English).
- **`DESCRIPTION` is readable text rather than Markdown source.** A client
  with no HTML renderer showed `**Bold**` and a `[label](url)` whose target
  was unreachable; link targets are now kept in parentheses. `X-ALT-DESC` is
  unchanged.
- **The event page is always in `DESCRIPTION`**, as `Event: <url>`, not only
  when an online link also exists. `URL` is where a client looks for it, and
  the clients that do not read `URL` left a reader with no way back to the
  page.
- **`location.address` and `organizers` reach `DESCRIPTION`** as `Address:`
  and `Organizers:` lines. Neither has an iCalendar property that can hold
  them (`ORGANIZER` is structurally a `mailto:`), so the alternative was
  dropping them.
- Fixed: a `dateTime` that carries seconds produced an eight-digit time
  (`19:00:30` → `19003000`), which is not a valid RFC 5545 value. Documents on
  0.1 and 0.2 can carry seconds, and the official examples for those versions
  do.

### New options, off by default

- **`feedToIcs(feed, { utcTimes: true })`** emits timed events as RFC 5545 UTC
  `DATE-TIME` values instead of local times with a `TZID`, resolving the
  publisher's IANA zone with `Intl` (`src/wall-clock.ts`: first occurrence in
  a fold, the offset before the transition in a gap). The original zone is
  kept on each timed event as the iCalendar property `X-OTE-TIMEZONE`.
  All-day dates stay dates. It exists for the hosted converter, whose output
  has to be subscribable by clients that would otherwise need a `VTIMEZONE`.
- An event whose end stops being after its start once both are resolved in
  their zone (a start inside a spring-forward gap, pushed past the end) throws
  rather than emitting an interval a calendar client will reject. A
  zero-length event (`startDate === endDate`) is valid OTE and emits no
  `DTEND`, which RFC 5545 reads as ending at the same instant.
- **`feedToIcs(feed, { locale })`** translates the field names this exporter
  adds around publisher content (`Event:`, `Speakers:`, `Tickets:`, the
  eligibility and status values). Publisher text is never translated. English
  and Spanish; any other language gets English. The table is
  `@opentechevents/validate`'s `labelsFor`, shared with `export-rss` and its
  parser, because three copies is what the first draft had.

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
  the newest release. This CLI converts documents somebody else published, so
  measuring a valid 0.4 feed against 0.6's rules rejected it over one
  `specVersion` error — `ote-validate` called the same file valid. The version
  note now goes to stderr as a note. `runCli` is async as a result.
- `speakers` → `X-OTE-SPEAKER` plus a `DESCRIPTION` line. **Never `ATTENDEE`**:
  that means somebody *invited* to the event, and clients act on it with RSVP
  prompts and participant lists.
- `recordings` → `X-OTE-RECORDING` plus a `DESCRIPTION` line.
- `partOf.offers` → an "Admission (whole event)" line in `DESCRIPTION`.
- `offers[].scope`: an `add-on` emits **no** `X-OTE-OFFER-PRICE` or
  `-CURRENCY`, and reads "additional charge on top of admission". Its number
  is the price of nothing on its own — the real total is `partOf.offers` plus
  it, and iCalendar cannot say so.
- `contributing` is not emitted: iCalendar has no term for it.

## 0.4.0

- Tracks **OTE Spec 0.4.0**; no behavioural change in this package. A feed with
  a non-ASCII URL (`…/pycamp-españa`) — invalid under 0.3, valid under 0.4.0 —
  now has a round-trip test through `@opentechevents/import-ics` proving the
  address survives export and re-import byte for byte.

## 0.3.1

- Added `X-ALT-DESC;FMTTYPE=text/html` — `description` (plain text or
  Markdown, per the OTE spec) is now rendered to HTML for this de facto
  rich-text extension (Outlook 2007+, Thunderbird/Lightning), alongside the
  unchanged plain-text `DESCRIPTION`. Built from the same parts as
  `DESCRIPTION` (online link, moved-online note, cfp/eligibility/offers),
  since Outlook ignores `DESCRIPTION` entirely once `X-ALT-DESC` is present.
  Raw inline/block HTML found in the Markdown source is escaped rather than
  passed through live.

## 0.3.0

- Initial package release for OTE spec v0.3.
