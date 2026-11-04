# Changelog

All notable changes to `@opentechevents/export-jsonld` are documented here.

## 0.6.0

- **Implements OTE Spec 0.6.0.**
- **A feed is judged by the version it declares** (`validateDocument`), not by
  the newest release — see export-ics 0.6.0 for why. `runCli` is async.
- `speakers` → `performer`, `Person` or `Organization` by `type`, with
  `affiliation` as an `Organization` node (schema.org's `Person.affiliation`
  wants a node; OTE keeps it a string so this is the only place that shape
  decision is made). `sameAs` passes through.
- `recordings` → `recordedIn` as `VideoObject { url, name? }`.
- `partOf.offers` → `superEvent.offers`, so a consumer can add the two.
- `offers[].scope`: an **`add-on` carries no `price` or `priceCurrency`**.
  schema.org cannot express "in addition to the parent's price", so the number
  alone would state a total that is wrong rather than incomplete. An unnamed
  add-on is labelled "Additional charge on top of admission"; the figures stay
  reachable through `superEvent.offers` and the offer's `url`.
- `contributing` is not emitted: schema.org has no term for it.

## 0.4.0

- Tracks **OTE Spec 0.4.0**; no behavioural change in this package. A feed with
  a non-ASCII URL (`…/pycamp-españa`) — invalid under 0.3, valid under 0.4.0 —
  now has a round-trip test through `@opentechevents/import-jsonld` proving the
  address survives export and re-import byte for byte.
- **First version of this package actually on npm.** 0.4.0 is where its public
  history starts; everything below describes the API as it was built, not as it
  was released.

## 0.3.0 — never published

- Written and tagged in the monorepo, but it never reached the registry, so no
  `@opentechevents/export-jsonld@0.3.0` exists to install. Kept here because
  the API it describes is the API 0.4.0 ships.
- Initial package release for OTE spec v0.3: `eventToJsonLd`, `feedToJsonLd`
  (a `@graph` of events), `feedToItemList` (a listing page's `ItemList`),
  `toJsonLdScript` (a pasteable `<script type="application/ld+json">` block),
  `isOnlineOnly` (Google rich-result eligibility) and the
  `ote-export-jsonld` CLI.
