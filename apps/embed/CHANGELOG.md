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
- Past occurrences (only reachable with `show-past="true"`) now render at
  reduced opacity in `list`/`cards` layouts, so upcoming events stand out.
- `fields-preview` and `fields-detail` attributes let you configure the card
  (preview) and the detail modal/list-body independently, instead of the
  single `fields` attribute controlling both. `fields` still works as a
  shared fallback for both when the specific attribute is absent, so
  existing embeds are unaffected.
- `eligibility` and `cfp` are now captured from OTE feeds (via
  `@opentechevents/preview-feed`) and rendered as small, linkable badges —
  e.g. "Members only" or "Call for Proposals" — wherever `fields`/
  `fields-preview`/`fields-detail` includes them. Off by default on the card
  (same opt-in policy as `group-events`), but shown by default in the detail
  modal along with every other optional field.
- A priced event's badge now links to its registration/ticket URL when the
  winning `offers[]` entry has one (`PreviewEvent.price.url`).
- `card-width` attribute (`"small"`/`"medium"`/`"large"`, or any raw CSS
  length) and the underlying `--ote-card-min-width` CSS custom property
  control the minimum card width — and so, responsively, the column count —
  in `layout="cards"`. Default (`220px`) is unchanged.

### Fixed

- The detail modal now closes on Escape. The keydown listener already
  existed but nothing ever moved focus into the modal, so the key never
  reached it; opening a modal now focuses its close button.
- Markdown inline formatting is now recursive: a link nested inside
  `**bold**` or `*italic*` (e.g. `**see [our calendar](https://...)**`) now
  renders as an actual link instead of literal `[text](url)`.
- Numbered lists (`1. `, `2. `) in Markdown descriptions now render as `<ol>`
  instead of showing the literal `1. ` prefix as plain text.
- The detail modal now respects field configuration (`fields`/
  `fields-detail`) instead of always rendering every optional field
  unconditionally, regardless of what the card was configured to show.
- The location field no longer echoes the attendance badge's "Online" label
  for an online event with no link (now "No public link", with a `title`
  tooltip noting the organizer may share it privately), and no longer wrongly
  claims "Online" for an in-person/hybrid event with no venue (now "Venue not
  specified"). Both were symptoms of the same upstream fallback in
  `@opentechevents/preview-feed` defaulting to a generic "online" location
  whenever a source gave no venue and no URL, regardless of the event's
  actual `attendanceMode`.

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
