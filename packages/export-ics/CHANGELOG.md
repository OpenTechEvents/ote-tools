# Changelog

All notable changes to `@opentechevents/export-ics` are documented here.

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
