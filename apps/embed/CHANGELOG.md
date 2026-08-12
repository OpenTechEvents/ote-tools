# @opentechevents/embed changelog

## Unreleased

### Added

- `group-events="series,multipart"` attribute: in `layout="cards"`, collapses
  events sharing the same `partOf.id` into a single stacked card with a
  mandatory "Series"/"Multi-part" badge. The header card is always the
  group's next upcoming occurrence (or the most recent past one if none are
  upcoming). Opt-in only — absent by default, so existing embeds are
  unaffected. `list` and `calendar` layouts are unchanged; every occurrence
  keeps rendering individually there.
- The detail modal gains prev/next navigation and an "N of M" counter when
  opened from a grouped card, letting a viewer step through every occurrence.
- `PreviewEvent.id` and `PreviewEvent.partOf` (from `@opentechevents/preview-feed`)
  are now first-class fields, alongside the existing `id` detail row.
- `EventRenderContext.group` exposes `{ key, type, index, total, members }`
  for the currently-rendered occurrence, so host apps (e.g. the editor's own
  `eventActions`) can react to group membership. `ote-event-action`'s DOM
  event detail carries the same `group` field when applicable.

## 0.3.1

### Fixed

- Custom badges from `eventBadges(context)` (and the built-in attendance/CFP
  badges) no longer break the card/list layout when given a long label: the
  label truncates with an ellipsis, the badge falls back to `title` for the
  full text on hover, and the meta row wraps instead of squeezing the
  location text down to a sliver.

## 0.3.0

### Added

- Added host-app integration APIs for OTE Reader-style usage:
  `sort="none"`, `empty-message`, dynamic `eventActions(context)`,
  `eventClassName(context)`, and `eventBadges(context)`.
- Preserved original in-memory OTE event objects, including private metadata
  such as `_feedUrl`, `_feedTitle`, and `_readerRef`, through
  `EventRenderContext`.
- Expanded `ote-event-action` details with `previewEvent`, `originalEvent`,
  `index`, `feed`, and `source` while keeping the legacy `event` field.
- Added action icons for `star`, `check`, `bookmark`, `plus`, `folder`, and
  `collection`.
- Documented and tested no-refetch in-memory rendering with dynamic layouts,
  custom actions, host-owned ordering, badges, and classes.

### Changed

- Custom action `onClick` callbacks still receive `PreviewEvent` first and now
  receive `EventRenderContext` as a second argument.

## 0.2.0

### Added

- Added configurable placement/layout support for native event actions through
  the JavaScript `eventActions` API, using objects such as
  `{ type: "link", placement: "preview" }`.
- Added playground controls and snippets for native action placement.
- Added component/spec version metadata to the playground header and versioning
  guide, including release/script links for previous embed versions.

## 0.1.1

### Added

- Documented the fixed-version, latest, and legacy embed URLs in the playground
  so consumers can choose the right update policy before copying the snippet.

## 0.1.0

### Added

- Added event detail surfaces for the embed widget: cards and calendar open a modal by default, while list keeps an inline accordion detail view.
- Added per-event calendar actions for Google Calendar, Outlook, Yahoo Calendar, and single-event ICS downloads.
- Added `event-click` and `event-actions` configuration for native event interactions.
- Added the JavaScript `eventActions` API for custom host-app actions, including preview/detail placement, layout filters, icons, and danger styling.
- Added DOM events for integrations: `ote-event-open` and `ote-event-action`.
- Added Markdown rendering for event descriptions without using unsafe HTML injection.
- Added responsive detail layouts for modal and list views, including compact variants for short text-only events.
- Added playground controls and snippets for feed/manual JSON input, native actions, custom action examples, typography, layout, theme, and field selection.
- Added an agent-facing guide in `apps/embed/CLAUDE.md` so AI coding agents can discover the typed integration contract.

### Changed

- Calendar is now the default layout.
- `show-past` now defaults to true.
- Card and list dates use compact, human-friendly formatting.
- List layout now behaves more like a table-style accordion with compact metadata and relative updated times.
- Event location URLs are rendered as friendly labels and long text is wrapped defensively to avoid layout overlap.
- Card images use a built-in placeholder/fallback when an event has no usable image.

### References

- Feature issue: https://github.com/OpenTechEvents/ote-tools/issues/31
- Documentation tracking issue: https://github.com/OpenTechEvents/ote-tools/issues/45

## Versioned assets

Production embeds should use a fixed versioned URL:

```html
<script type="module" src="https://tools.opentechevents.org/embed/v0.3.0/ote-events.js"></script>
```

The floating URLs `https://tools.opentechevents.org/embed/latest/ote-events.js`
and `https://tools.opentechevents.org/embed/ote-events.js` are useful for
testing and playground usage, but they may receive non-breaking changes over
time.
