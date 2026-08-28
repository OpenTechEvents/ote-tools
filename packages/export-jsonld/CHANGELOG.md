# Changelog

All notable changes to `@opentechevents/export-jsonld` are documented here.

## 0.4.0

- Tracks **OTE Spec 0.4.0**; no behavioural change in this package. A feed with
  a non-ASCII URL (`…/pycamp-españa`) — invalid under 0.3, valid under 0.4.0 —
  now has a round-trip test through `@opentechevents/import-jsonld` proving the
  address survives export and re-import byte for byte.

## 0.3.0

- Initial package release for OTE spec v0.3: `eventToJsonLd`, `feedToJsonLd`
  (a `@graph` of events), `feedToItemList` (a listing page's `ItemList`),
  `toJsonLdScript` (a pasteable `<script type="application/ld+json">` block),
  `isOnlineOnly` (Google rich-result eligibility) and the
  `ote-export-jsonld` CLI.
