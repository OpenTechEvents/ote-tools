# Changelog

All notable changes to `@opentechevents/preview-feed` are documented here.

## Unreleased

- **Multi-part pricing no longer publishes a false price** (the spec's D032,
  new in 0.5). `cheapestPrice()` took the numerically lowest `offers[]` entry,
  which is wrong by construction once `offers[].scope` exists: an `admission`
  offer and an `add-on` offer are not alternatives to choose between, they are
  additive. Three schema-valid documents it answered wrongly, each wrong
  answer shown to an attendee:

  | Document | It said | It says now |
  | --- | --- | --- |
  | A part with no `offers`, document carries `partOf.offers` | nothing — "price unknown" | the set's shared admission, which is what the document states |
  | A part whose only offer is a 60 € `add-on` | `60 €`, as the cost of attending | admission + 60 |
  | A part with its own 50 € admission and a 20 € `add-on` | `20 €` — the surcharge, and the one price nobody can pay | `50 €`, the cheapest way in |

  `cheapestPrice` is replaced by `attendancePrice({ offers, partOf })`, and
  `PreviewEvent.price` gained a required `basis` (`own` / `shared` /
  `shared-plus-add-on` / `add-on-only`) with an optional `amount`. The type
  change is the point: a renderer cannot print a surcharge as a total without
  deciding to, and when a surcharge has no priced admission to add to, the
  answer is "an additional charge, total unknown" rather than a number —
  incomplete, which the spec accepts, instead of false, which it does not.
- Two currencies are not added. A 240 EUR set admission with a 20 USD
  surcharge used to be reportable as "260 EUR"; it is now "+20 USD, total
  unknown". Nothing in the schema makes two offers in one document share a
  currency, so this is reachable valid input — and a number invented by
  adding across currencies is the same false-pricing failure, one layer in.
- `partOf.offers` survives the mapping. It was dropped, which left even a
  scope-aware renderer with no shared admission to fall back to.

- `firstImage()` prefers the first `https://` entry in `image[]` over an
  earlier `http://` one. OTE Spec 0.4.0 dropped the https-only MUST on images,
  so a valid feed can list one; on an `https` page an `http://` image is mixed
  content and never renders, while the `https` entry below it would have.
  The publisher's order still decides between entries the browser can load.

## 0.1.0

- Initial private package release for preview feed normalization.
