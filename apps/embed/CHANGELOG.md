# @opentechevents/embed changelog

## Unreleased

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

- Documentation tracking issue: https://github.com/OpenTechEvents/ote-tools/issues/45
