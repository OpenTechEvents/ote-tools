# Changelog

All notable changes to `@opentechevents/export-rss` are documented here.

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
