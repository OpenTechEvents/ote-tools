# @opentechevents/embed changelog

## 0.7.0

### Added

- `event-id="<OTE id>"` renders a single event from the feed — the widget's
  answer to "put this one event on its own page", which previously needed
  the host page to fetch the feed itself and assign `widget.event` from
  JavaScript. Matched against the event's `id`, the stable URI the OTE spec
  documents as never changing after publication: a name or a date can be
  edited, so filtering on either would silently empty a page that was
  already published.
- `event-id` deliberately ignores `show-past`. Someone who pins an id to a
  page means *that* event, and having it vanish the morning after would be a
  surprise rather than a feature.
- When the id matches nothing, the empty state says "Event not found in this
  feed." instead of "No upcoming events." — a different problem, and one the
  organizer can only fix if the widget says which it is. `empty-message`
  still overrides both.
- The playground gained an `event-id` control, under Source.

## 0.6.0

### Added

- `layout="list"` now renders `placement: "preview"` event actions as a
  trailing action cluster on the compact row itself
  ([#46](https://github.com/OpenTechEvents/ote-tools/issues/46)), matching
  what `"preview"` already did for cards. Hidden until the row is
  hovered/focused on a fine-pointer device, always visible on touch — same
  action config (native calendar/link actions or custom `CustomEventAction`
  buttons), same `EventRenderContext`, no new API surface. `"detail"`
  actions are unaffected and still render inside the row's expanded
  accordion body.

### Fixed

- An event with no `attendanceMode` declared at all (neither `"online"`,
  `"in-person"`, nor `"hybrid"`) and no `location` no longer shows an
  "Online" location label — it now shows "Venue not specified", the same
  fallback an in-person event with no venue already used. `rawLocationText()`
  (`apps/embed/src/render.ts`) previously fell through to the "Online"
  default whenever `attendanceMode` wasn't one of the two handled cases,
  wrongly asserting online attendance for an event that never declared any
  attendance mode.

### Changed

- Restructured the playground (`/embed/`, [#53](https://github.com/OpenTechEvents/ote-tools/issues/53)):
  the Events widget, Subscribe widget, and reference docs (versioning,
  host-app integration, agent guide) each moved to their own tab instead of
  one long scrolling page. Controls are now grouped into collapsible
  Basics/Appearance/Behavior/Actions sections instead of a flat ~20-field
  list; the duplicated `fields-preview`/`fields-detail` checkbox blocks
  merged into a single preview/detail matrix; `card-width`, `group-events`,
  and the fields matrix now visibly dim/disable when the active layout
  ignores them instead of silently no-op'ing. Visual style refreshed to
  align with opentechevents.org (accent color, pill controls, dark
  "browser window" code blocks). No `<ote-events>`/`<ote-subscribe>`
  attribute or behavior changes — playground page only.
- `<ote-subscribe layout="badges">` triggers now match the colored-pill
  icon+text badge design this element was ported from (a distinct
  currentColor icon and solid background per group — calendar icon on
  `--ote-subscribe-ics-color`/`--ote-subscribe-ote-color`, feed icon on
  `--ote-subscribe-rss-color`), instead of the plain neutral soft-accent
  button. `layout="menu"`'s single trigger is unchanged — it's a generic
  action button, not a feed-type-branded badge. All three colors are
  overridable via those CSS custom properties.

## 0.5.0

### Added

- `feeds="url1,url2,..."` attribute: fetches multiple OTE feeds in parallel
  and renders their events combined into a single sorted/filtered/limited
  list, instead of just one `feed`. Takes full precedence over `feed` when
  present and non-empty (same "full replacement" precedent as `fields`); a
  bare `feed="..."` is unaffected. A feed that fails to fetch is dropped and
  the rest still render — the error state only appears if every feed fails.
  Each merged event is tagged with `_feedUrl`/`_feedTitle` (unless the source
  already set its own), so `EventRenderContext.feed` and the
  `ote-event-open`/`ote-event-action` DOM events still attribute each event
  to the feed it came from.
- The playground's "feed" control now doubles as "feed / feeds": enter one
  URL for `feed`, or several comma-separated to combine them via `feeds`, and
  the copy-paste snippet reflects whichever attribute applies.
- New `<ote-subscribe>` custom element (`dist/ote-subscribe.js`, its own
  esbuild entry point — consumers who don't use it pay nothing for it): a
  "subscribe to this feed" trigger + popover, for any site publishing an OTE
  feed, not just one running `<ote-events>`. Ported from a real-world fix in
  a `<ote-events>` consumer's hand-rolled version of these same links, where
  the Google Calendar and Feedly URLs were both silently broken and the
  Outlook web deep-link turned out to be unreliable after login (a
  Microsoft-side issue, not fixable from the caller's side — dropped in
  favor of a universal `webcal://` link, which already covers Outlook
  desktop).
  - `feed-ics`/`feed-rss`/`feed-json` attributes each enable an independent
    group of links: Calendar (Google Calendar, `webcal://`, ICS download),
    RSS (Feedly, `feed://`, RSS download), and OTE feed (OTE Reader, OTE
    Tools preview, JSON download) respectively. Any combination may be
    present.
  - `show="..."` (comma list, full-replacement semantics like `fields`)
    filters which individual links render.
  - `layout="menu"` (default) is a single trigger whose popover lists every
    available group. `layout="badges"` renders one small trigger per
    available group instead, each with its own popover and independent
    (mutually exclusive) open state.
  - `theme`/`lang` follow the same `auto`/`light`/`dark` and `auto`/`en`/`es`
    conventions as `<ote-events>`, and it reuses the same `--ote-*` CSS
    custom properties for consistent theming when both elements are on a
    page.
  - `<slot name="trigger">` (or `ics-trigger`/`rss-trigger`/`ote-trigger` in
    `layout="badges"`) lets a host swap in its own badge/icon markup instead
    of the default text button.

## 0.4.0

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
- Markdown descriptions are now rendered with `marked` (the same
  CommonMark+GFM parser the editor's own preview uses) instead of a hand-rolled
  line-based parser, with DOMPurify sanitizing the result since feed
  descriptions come from a remote, untrusted source. Headings (`### ...`) were
  previously stripped down to plain paragraph text; they now render as real
  `<h1>`-`<h6>` elements. A sub-list nested inside a list item (e.g. a bullet
  list under one step of a numbered list) previously got flattened into a
  separate sibling list; it now stays correctly nested.
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
