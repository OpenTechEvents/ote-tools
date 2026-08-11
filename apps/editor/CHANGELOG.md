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
- Simplified "Link to a series"'s create form: the "Series id (URL)" line
  stays out of the way until a name exists, then shows compactly inline
  (value + ⓘ + Edit) instead of its own label/input/hint/button stack;
  the "doesn't need to resolve" explanation moved into the ⓘ tooltip. The
  suggested id now lives under `/events/series/<slug>`.
- Fixed a bug where opening "Link to a series" for any reason — even just
  to review or tweak the id of an already-linked series — silently reset
  `partOf.type` back to `"series"`, discarding a `"multipart"` value the
  organizer had set by hand under "What". The type is now preserved
  unless the organizer picks a different series from search (which is
  always `type: "series"` by construction).
- Fixed the batch issue opened for a generated recurring series (repo
  mode) never triggering the `issue-to-pr` GitHub Action: the issue only
  carried the `ote-batch` label, but the reusable workflow's caller-side
  gate requires the `ote-event` label specifically (it checks labels, not
  the `[ote-event]` title prefix), so the run was silently `skipped`
  every time. The issue now gets both labels. Its title also now includes
  the series' event name — "Add `<name>` series (N events)" instead of
  just "Add N events" — to match the count-only case reserved for an
  (unreachable in practice) empty batch.
- Repo mode's events list now renders through the shared `<ote-events>`
  widget (`apps/embed`) instead of a hand-built card grid, closing part of
  [#47](https://github.com/OpenTechEvents/ote-tools/issues/47). Cards gain
  a click-to-preview detail modal — the exact rendering a public visitor
  would see — for free; edit/duplicate/delete stay as inline card buttons,
  now wired through the widget's `eventActions` API instead of custom DOM.
  The widget is self-hosted from the editor's own build (copied from
  `apps/embed/dist` at build time) rather than loaded from a public URL,
  so local dev and CI don't depend on the network or on a previously
  deployed embed version.
