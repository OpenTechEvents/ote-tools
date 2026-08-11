# Changelog

All notable changes to the OTE event editor are documented here as they
land. This app isn't published to npm, so entries are dated rather than
tied to semver releases.

## 2026-08-11

- **Link to a series**: a guided flow to set `partOf` from the "When"
  section, right next to "+ Add recurrence" — search series already used
  in the connected repo, or a short form to mint a new one (auto-suggested
  id under `/events/series/<slug>`, optional dedicated-page link). The
  "missing Part of" warning shown when generating a recurring series now
  links straight into this flow instead of only offering to acknowledge
  and continue.
- **Time fields**: replaced the native `<input type="time">` picker
  (whose minute `step` several browsers/OSes ignore) with a custom HH:MM
  combo that suggests quarter-hours by default; typing any value is still
  allowed.
- **End date/time** default to the Start date/time when left empty,
  without ever overwriting an already-set value.
- **Venue geocoding**: a search button next to the Venue field geocodes
  the typed address (pressing Enter in Venue does the same); the in-map
  search control replaces the old external search bar next to the map.
- Fixed the geo-search/geo-results map controls duplicating when an
  unrelated Who/Where field was added via its own "+" chip.
