# Changelog

All notable changes to the OTE event editor are documented here as they
land. This app isn't published to npm, so entries are dated rather than
tied to semver releases.

## 2026-08-12

- **Fixed: the sticky action bar was shoved off-screen on wide viewports**.
  Above the 52rem breakpoint the responsive `#action-bar` rule lost its
  `left`/`right` to the base rule's higher-specificity `:not([hidden])`
  selector (the rule itself was missing it), so only its
  `transform: translateX(-50%)` applied on top of the base rule's `left: 0`
  — shifting the bar half its own width (384px) off the left edge instead
  of centering it.
- **Events list polish**: the View toggle now defaults to Grouped instead of
  Individual; a series' stacked card only shows the series-level "Edit
  series"/"Delete series" actions (the single-occurrence Edit/Clone/Delete
  moved into the modal, where you're looking at one specific occurrence);
  and the per-card "Duplicate" action is now labelled "Clone" ("Clonar" in
  Spanish) to better describe what it does.
- **Smaller issue bodies for recurring series and bulk edits**: both flows
  now send a compact diff instead of one full document per event, so they
  stay well under GitHub's 65536-character issue-body limit even for large
  series. "Repeat as a series" sends one shared template plus a per-
  occurrence id/startDate/endDate list; "Edit series" sends only each
  occurrence's actually-changed fields (a cleared field is sent as `null`,
  meaning "remove this field"). Both are expanded back into full documents
  server-side, transparent to the resulting PR.
- **Group events + edit/delete a whole series**: the events list gained a
  View: Individual/Grouped toggle (`group-events="series,multipart"` on the
  `<ote-events>` widget). Grouped, a series/multi-part card shows the
  widget's own stacked-card look with prev/next browsing; its card actions
  gain "Edit series" and "Delete series".
  - **Edit series** reuses the real single-event form: it opens on a
    synthetic shared template (seeded from the group's next-upcoming
    occurrence), and a banner replaces the usual Save/Propose actions with
    an occurrence checklist (future, non-cancelled ones preselected) and
    an "Apply to selected" button. Whatever you change in the form —
    including repeaters and translations, not just scalar fields — is
    diffed against the template's own starting values and applied only to
    the occurrences you selected; each row also has its own inline
    date/time so you can nudge an individual occurrence's schedule without
    touching the rest. Identity/schedule fields (id, slug, dates, status)
    and the series' own `partOf.id` are inert in the template — editing
    them there has no effect, by design. No pattern is inferred from
    existing dates — real series drift from any rule more often than they
    follow one, so each occurrence's date is shown and edited explicitly
    instead.
  - **Delete series** proposes deleting every checked occurrence as one
    plain-text GitHub issue — nothing preselected by default.
  - Both submit as a single GitHub issue, reusing the same batch-issue
    transport the recurring-series generator already uses.

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
