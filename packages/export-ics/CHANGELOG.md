# Changelog

All notable changes to `@opentechevents/export-ics` are documented here.

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
