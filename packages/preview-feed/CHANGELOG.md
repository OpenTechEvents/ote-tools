# Changelog

All notable changes to `@opentechevents/preview-feed` are documented here.

## Unreleased

- `firstImage()` prefers the first `https://` entry in `image[]` over an
  earlier `http://` one. OTE Spec 0.4.0 dropped the https-only MUST on images,
  so a valid feed can list one; on an `https` page an `http://` image is mixed
  content and never renders, while the `https` entry below it would have.
  The publisher's order still decides between entries the browser can load.

## 0.1.0

- Initial private package release for preview feed normalization.
