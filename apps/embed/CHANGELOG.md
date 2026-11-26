# @opentechevents/embed changelog

## Unreleased

### Added

- **One header for the whole widget** (#183), in Google Calendar's order:
  `Today`, the month arrows and the month on the left, the view control
  floating right. It replaces two rows — the calendar library's own toolbar
  and the view switcher — which used to stack and together cost about 76px
  of a height budget that is often 300. Measured in Chrome: 36px for the
  row, and `.ec-toolbar` gone.

  - `<ote-events views>` chooses which views the visitor may switch
    between: Calendar, List and Cards. **On by default, so it changes the
    rendered output of every embed that moves its pin**; embeds pinned to a
    committed `versions/v<x.y.z>/` URL are untouched. `views="none"` (or
    `"off"`/`"false"`) keeps the layout the embedder chose and a one-view
    list renders no control, because a chrome row with a single button is
    noise. Tokens render in the switcher's canonical order whatever order
    they are written in.
  - `layout` becomes the view the widget *opens* on rather than the only one
    available, and still wins when a host moves it at runtime.
  - **The month nav belongs to the header, not to the calendar.** The
    library's `headerToolbar` is switched off: it only exists inside the
    lazy-loaded calendar chunk, so it could never carry a control that has
    to work in `list` and `cards` too. `Today` greys out while today is on
    screen; the arrows are inert until the chunk reports a month.
  - **The view control is a segmented group that degrades by measurement**,
    not by media query — one inside a shadow root follows the viewport, and
    this widget lives in a column. Measured in Chrome on a real feed: labels
    down to 520px, icon-only from 480px, and a native `<select>` from 340px,
    where even three icons beside the nav stop fitting. The select is the
    platform's own popup: top layer, its own keyboard and touch behaviour,
    and no "clicked outside" to get wrong inside a shadow root.
  - Three `aria-pressed` buttons inside a labelled `role="group"` — not a
    radio group, whose single tab stop would mean managing `tabindex` across
    a tree this widget rebuilds on every render — with focus restored after
    the re-render, `aria-live` on the month, named arrows, and translated
    labels (Calendario / Lista / Tarjetas, Hoy).
  - Switching to `calendar` still lazy-loads `calendar-layout.js`, and the
    month the visitor paged to survives the round trip.
  - The visitor's view lives in memory only — nothing is written to
    `localStorage` or to the host page's URL; that question is the open half
    of #176. A host that wants to remember it has the new
    **`ote-view-change`** event (`detail: { view, previousView }`), which
    the playground uses to keep its own layout toolbar in step. A host app
    driving the widget by property (`.events = […]`) gets **no** switcher
    unless it sets `views`: OTE Reader owns its own view chrome.

### Removed

- **The calendar's "Next event" button.** It existed because a sparse feed
  opens on an empty month (#167) — but the calendar already *opens* on the
  next event by default, and the List and Cards views the header now offers
  answer "what is next" better than a jump to one month ever did.
  `initial-date="next-event"` is unchanged.

### Fixed

- `<ote-events>` no longer discards state when a host writes an attribute
  without changing its value. `attributeChangedCallback` fires on any write,
  and a host that re-applies its whole configuration on every change — the
  playground does it, and it is the shape any framework render produces —
  would otherwise reset the visitor's view on an unrelated keystroke.

- `<ote-events footer>` (#68): a strip under the events carrying the feed's
  name — linked to the publisher's page when the document declares `url` —
  the time zone the times are rendered in, an `<ote-subscribe>`, and the OTE
  mark linking to the spec. **On by default, so it changes the rendered
  output of every embed that moves its pin**; embeds pinned to a committed
  `versions/v<x.y.z>/` URL are untouched, which is what those URLs are for.
  `footer="off"` reproduces the previous output exactly, and `"auto"`
  renders the strip only when the widget knows where the data came from — a
  host app driving it through `.events = […]` has no feed name, no feed URL
  and nothing to subscribe to.

  The footer is chrome inside the `max-height` budget rather than an overlay
  on the last row: the event area becomes its own scrollport and scrolls
  under it. Measured in Chrome at 43px when the strip fits one line, 65px at
  480px wide and 83px at 360px, where it wraps to three.

  The strip stacks the feed name and the time zone (they answer different
  questions, and side by side at a typical embed width the zone reads as
  part of the name), truncating a long name rather than pushing the
  subscribe row onto a third line. Measured in Chrome: 43px when it fits
  one line, 82px when it wraps — at or below roughly 560px wide.

  It **reuses `<ote-subscribe>`** rather than reimplementing it, so
  `subscribe-urls.ts` stays the one place these URLs are built: the element
  is handed the feed URL the widget already fetched, so a host no longer has
  to repeat it. The time-zone line names the visitor's own zone, which is
  the zone every time in the widget is converted to.

- `<ote-events>` reads the fetched document's `alternates` (OTE Spec 0.5+):
  a declared `text/calendar` or `application/rss+xml` URL is offered to
  visitors instead of one generated by `convert.opentechevents.org`, which
  is #186's "a declared URL is never replaced" one level further out — the
  declaration is in the feed document, which only the widget can see.

- `<ote-events feed-ics>`, `feed-rss` and `convert`: passed straight through
  to the footer's `<ote-subscribe>`, and they outrank the document's own
  `alternates`. `convert="off"` is the publisher's lever over the generated
  ICS/RSS links now that the widget mounts the element for them — a lever
  they cannot reach is not a lever.

- `<ote-events subscribe-layout>`: the shape of the `<ote-subscribe>` the
  footer mounts. Defaults to `"badges"` here — the standalone element
  defaults to `"menu"` — and `subscribe-layout="menu"` collapses the three
  pills a JSON-only publisher gets into one *Subscribe* trigger.

- `<ote-events footer-mark>`: whether the footer carries the "Powered by
  OTE" link to the spec. On by default, `footer-mark="off"` removes it and
  keeps the subscribe links, which turning the whole footer off would lose.

- Playground: `footer`, `subscribe-layout` and `footer-mark` controls, with
  the precedence rules and what `auto` is for.

### Changed

- `<ote-subscribe convert="ics,rss">`: when `feed-json` is set and
  `feed-ics`/`feed-rss` are not, the Calendar and RSS groups are now built
  from `convert.opentechevents.org` instead of being omitted. A publisher who
  hosts only the OTE JSON feed therefore offers "add to calendar", Google
  Calendar, `webcal://`, Feedly and `feed://` links with no edit to their
  embed — which is every entry in the public adopters registry.

  **This changes the rendered output of an existing `feed-json`-only
  embed**: groups that used to be absent now appear. `convert="ics"` /
  `convert="rss"` enable one format only, and any value naming no format at
  all — `"off"`, `"none"`, `"false"`, `"no"`, `"0"` — reproduces the
  previous output exactly. The attribute fails closed on purpose, unlike
  `show`/`fields`: an attribute whose job is to stop third-party URLs from
  being built must not read a host's `"false"` as a typo and then generate
  everything.

  A URL the publisher declared is never replaced by a generated one; the
  service is a fallback for a missing URL. A generated group's trigger
  carries a `data-generated` attribute for host styling; nothing is said to
  the visitor, since whether to route subscribers through the converter is
  the publisher's decision and they are the one who can set `convert="off"`.
  A `feed-json` the
  service could not fetch — relative, protocol-relative, or any non-`http(s)`
  scheme — generates nothing rather than a link that would fail.

- Playground: one **Your OTE feed** field above the tabs replaces the four
  URL inputs the page used to carry, both widgets read it, and `?feed=` and
  `localStorage` persist it — so a configured playground is a shareable
  link. A live status line reports the feed's event count and spec version,
  or names why it could not be read (404, not JSON, no CORS), which the
  widget's own empty state cannot distinguish. `feed-ics`/`feed-rss` moved
  into a closed "Do you host your own ICS or RSS?" group and are no longer
  pre-filled: with them filled, the conversion fallback never fired in the
  page that exists to demonstrate it.

### Fixed

- `layout="calendar"`: clicking an event inside the `+N more` popover now
  opens its detail modal. The popover used to close on that click and do
  nothing else: `@event-calendar/core` detects a pointerdown "outside" the
  popover with `el.contains(jsEvent.target)` on a `document` listener, and
  inside a shadow root that target is retargeted to the host element, so
  every pointerdown — its own events included — counted as outside. Clicks
  genuinely outside the popover still close it.
- Opening or closing an event's detail modal no longer re-renders the events
  behind it. A click used to rebuild the whole list — and in
  `layout="calendar"` unmount and remount the month, measured in Chrome at
  ~18ms of empty calendar behind the backdrop — which read as a flicker. The
  modal is now mounted and removed as an overlay, so cards keep their
  already-loaded images and the calendar keeps its DOM.

## 0.10.0 — 2026-11-26

### Changed

- **`layout="calendar"` lays a month out differently, so an embed that sets
  no attribute renders differently after this release.** Nothing is lost and
  no option is removed; the month gets shorter and shows the same events.
  A calendar tuned around the old shape is worth a look once:

  | before | now |
  | --- | --- |
  | every week the same height, empty ones included | each week sized to its busiest day, empty ones down to their date row |
  | a CSS height on the element sized the box only | a CSS height sizes the contents too |

  On a 158-event feed with no attributes at all, November goes from 951px to
  **529px** with the same events visible and the same `+N more` links.
  `max-per-day` still caps a day exactly, and `max-per-day="off"` still
  stacks everything.

### Added

- **`density="auto"` now follows a definite CSS height too, not only the
  `max-height` attribute.** They are the same statement made two ways — the
  host deciding the widget's height — and keying off only the attribute left
  a full-viewport calendar on the comfortable metrics, spending 31px of
  weekday header and 38px of date row on a layout that was short of room by
  definition. The compact metrics also shrink the weekday header now, which
  they had not been doing at all: it stayed at 31px in both densities.

- **A calendar given a definite height fills it, and shows more per day for
  the room.** Weeks that have events grow into whatever the height leaves
  over, so a full-viewport calendar has no dead band at the bottom and its
  day cells show as many events as actually fit — on a 158-event feed in a
  757px viewport, `+27 more` becomes `+22 more` because the cells grew.
  Empty weeks never grow: spare room is worth more to a week with something
  in it, and a tall row holding one date number is the waste this mechanism
  exists to remove.

  Growth is only offered where there is room to share. Against an
  auto-height host the same track resolves against the tallest week's
  content instead, which took a month that should be 529px to **4867px** —
  the trap `apps/embed/CLAUDE.md` documents. Since CSS cannot be asked
  whether a height is definite, and `getComputedStyle` answers with the used
  value either way, the element probes it: it collapses its root and sees
  whether the host still has a height of its own, synchronously, with the
  inline style restored before anything can paint.

  `max-height` deliberately does **not** count as definite. It is a ceiling,
  so a month shorter than the budget stays short rather than stretching to
  fill it.

  A week that cannot have the height it wants gives its cells up to the
  `+N more` link rather than making the month scroll, which is what Google
  Calendar's month view does in a short container. Measured on a 158-event
  feed in 400px: flooring at the content height kept 144px rows and
  scrolled, showing 7 events; flooring at the date row fits 80px rows with
  no scrollbar and shows 16. Together with the two changes above, the same
  feed in a 757px viewport goes from 21 events visible to **73**, and its
  busiest day from `+27 more` to `+17 more`.

- **The widget fits the height it is given, however the host gives it.** A
  CSS height on the element — `ote-events { height: 400px }`, or a flex or
  grid parent handing it a track — now sizes the contents, not just the box.
  Before, the element obeyed while its contents kept their own height: a
  400px element held 529px of calendar that spilled straight out of it, and
  a taller container left dead space inside. `max-height` was the only
  height the widget understood, which is not how a custom element is
  normally styled.

  The fitting is a percentage height on the widget's root, so it is inert
  where it should be: against an auto-height host — every embed that sets no
  height — it resolves to `auto` and the layout is exactly what it was.
  Verified in Chrome across all three layouts, with and without the
  attribute: an embed with no height set renders to the same pixel as
  before.

  One asymmetry worth knowing: `density="auto"` still keys off the
  `max-height` *attribute*, not off a CSS height, because the attribute is
  the declarative signal and measuring the box to decide would feed layout
  back into itself. A CSS-sized host that wants the compact metrics can ask
  for them with `density="compact"`.

- **`layout="calendar"` sizes each week to its own content, keeping
  `max-per-day`** (#170). A month used to give every week the same height,
  reserving room for `max-per-day` events in the empty ones too. Each
  visible week now gets the height its busiest day needs, capped, and a week
  with no events gets its date row and nothing more. On a 158-event feed
  that is six uniform 93px rows (644px) against 26/26/26/26/92/92 (373px),
  with every `+N more` link unchanged, and it is recomputed when the visitor
  pages to another month.

  Two earlier notes in this repo said collapsing and capping could not be
  combined. **They were wrong**, and the correction is worth stating because
  the reasoning looked sound: the constraint was never the calendar library,
  it was `--ec-row-height` being a *single value shared by every row*.
  Content-sizing it grows each cell to its events, so nothing overflows and
  the `+N more` popover stops firing. Writing `grid-template-rows` as an
  explicit per-week track list has no such limit.

  The events a cap hides keep their layout box, so they inflate the grid's
  scrollable height well past what it draws. That was invisible while the
  grid was `overflow: hidden`, but a `max-height` turns it to `auto`: a
  month that comfortably fits its budget still grew a scrollbar that
  scrolled 400px into blank space. The event layer is now clipped to the
  grid, so a month that fits has no scrollbar and one that does not scrolls
  through its actual weeks.

- **`density` controls how much room a `layout="calendar"` cell gives each
  event** (#170). `auto` (the default), `comfortable` or `compact`.

  Comfortably a day needs about `5.8em` of cell to show one event; compact
  brings that to `3.4em` by roughly halving the day header and the event
  chip. The numbers are measured in Chrome and live in `CALENDAR_DENSITY`
  beside the CSS that produces them, because `max-per-day`'s row maths has
  to agree with what the cell actually renders.

  `auto` resolves to compact exactly when the host set a `max-height`, and
  to comfortable otherwise — the same shape as `theme="auto"`. **An embed
  with no height budget is unchanged**, so this is additive rather than a
  default moving again.

  The reason it is tied to the budget: at the comfortable metrics a six-week
  month in a 400px budget left 52px per week, which holds a date and nothing
  else, so every day rendered as a `+N more` link and the calendar showed no
  events at all. Google Calendar's embed fits the same month because its
  equivalent cell is ~36px (20px date box, 16px chip, measured on its public
  embed), not because it sizes its rows differently — it uses uniform week
  rows too. On a real 25-event feed at `max-height="400px"` this takes the
  month from 588px of content scrolling 244px, with two events visible, to
  367px scrolling 23px with four. Unbounded, `density="compact"` renders the
  same 27 events in 559px instead of 807px.

- **`max-height` gives the host a vertical budget for the widget** (#168).
  A length in `px`/`rem`/`em`/`ch`/`vh`/`dvh`/`svh`/`vmin`/`vmax` (a bare
  number is read as pixels), and it applies to all three layouts. Anything
  else leaves the widget unbounded — including `calc()`, and including `%`,
  which parses but resolves against an auto-height containing block and so
  would mark the widget bounded while bounding nothing. Previously the rendered height was
  whatever the feed happened to need — `layout="calendar"` hardcoded the
  library's `height: "auto"` — so embedding `<ote-events>` in a dialog, a
  card or a sidebar meant letting somebody else's feed decide the layout.

  It is a **maximum, not a fixed height**: a feed shorter than the budget
  renders at its natural height rather than padding the box out. An absent,
  `none`/`off`, or unparseable value leaves the widget unbounded, and all of
  the scrolling behaviour below is gated on the attribute parsing, so an
  existing embed lays out exactly as it did before.

  What overflows scrolls **inside** the widget. That is the part the
  host-side `max-height` + `overflow-y` workaround could not do: a wrapper
  scrolls the widget from the outside, so the calendar's own sticky weekday
  header has no scrollport to pin against and rides away with the content.
  Now the weekday header and `layout="list"`'s column header both stay put
  while their rows scroll.

  In `layout="calendar"` the weeks **share the budget instead of each
  reserving `max-per-day` events' worth of height**. The cap is implemented
  as a flat row height, which sizes every week for that many events
  including the empty ones, so a sparse month scrolled through roughly 750px
  of mostly blank rows inside a 400px budget. Bounded rows shrink to an
  equal share of what the budget leaves — on a real 25-event feed that took
  the same month from ~750px to 588px, with the events still visible.

  Rows will not shrink below the height of **a day showing one event beside
  a `+N more` link**. The library's own sizing has no such floor, and
  without one a 400px budget over a six-week month produced 52px rows that
  held the date and nothing else: every single-event day rendered as
  `+1 more` and the calendar showed no events at all. Where even the floor
  does not fit, the weeks stop shrinking and the grid scrolls with the
  weekday header pinned.

  The trade is that **`max-per-day` stops being an exact count while a
  budget is set** and becomes "as many as fit" — a host that asked for a
  height asked for it first.

- **`max-per-day="off"` now lets empty weeks collapse under a budget**, so a
  sparse month stops reserving room it does not use. The library floors
  every day cell at 5em and lifts that floor only in its uniform (capped)
  mode, so the one mode that sizes each week to its own content still gave
  every empty week 80px. On a real 25-event feed at `max-height="400px"`
  that is six uniform 80px rows scrolling 511px, versus `60/37/37/37/60/36`
  that does not scroll at all and leaves the widget at 354px inside its
  400px budget.

  `max-per-day="off"` remains the uncapped mode, for a feed that would
  rather show a busy day in full than collapse it.

## 0.9.0 — 2026-11-26

### Changed

- **Three defaults of `layout="calendar"` moved**, so an embed that sets no
  attribute renders differently after this release. Each is the fix for a
  reported defect and each has an opt-out, but a calendar that was tuned
  around the old behaviour should be checked once:

  | before | now | opt out with |
  | --- | --- | --- |
  | a day stacked every event it had | at most 3, rest in the `+N more` popover | `max-per-day="off"` |
  | always opened on the current month | opens on the month of the next event | `initial-date="today"` |
  | the month grid at every width | the list view below 600px of container width | `responsive="off"` |

  Details and the reasoning for each are under Added below.

### Added

- **`layout="calendar"` caps a day and opens where the events are** (#167).
  Three new calendar-only attributes:

  - `max-per-day` (default `3`) collapses the rest of a day into the
    library's `+N more` popover. The library's own default is "never
    collapse", so one busy day stacked every event it had and grew the
    component without limit. `max-per-day="off"` is the old behaviour.
  - `initial-date` (default `next-event`) opens on the month of the next
    upcoming event, or of the most recent past one when the feed is entirely
    in the past. Before, the calendar always opened on the current month, so
    a feed whose events start next March opened empty and read as broken.
    Also accepts `today` or a fixed `YYYY-MM`/`YYYY-MM-DD`.
  - `responsive` (default on) degrades the month grid to the library's list
    view below 600px of **container** width (#169). At phone width a
    seven-column grid truncates the weekday headers and every event title,
    and `dayGridMonth` was the only view registered, so there was nothing to
    fall back to. Container width rather than viewport, because the widget is
    usually embedded in a column. `responsive="off"` keeps the grid.

  The toolbar gained **Today** and, when the feed has something upcoming,
  **Next event** — it was `title | prev,next` only, which makes a 460-event
  feed a month-by-month walk. Both, plus the `+N more` link and the popover's
  close button, are localized; the library hardcodes English for them.

  The month the visitor paged to now survives a re-render. Opening a detail
  modal remounts the calendar, which used to snap the view back.

  `layout="calendar"` lazy-loads `calendar-layout.js`, which grows from
  ~133KB to ~142KB minified with the list view registered. Nothing changes
  for an embed that does not use that layout. `oteSpecVersion` stays
  **0.4.0**.

### Fixed

- **`<ote-subscribe>`'s Google Calendar link, for any feed whose ICS URL
  carries a query string** (#166). The `cid` parameter nested the feed URL
  raw, so it ended at that URL's first `&`: Google received a truncated
  address and the organizer saw a broken feed rather than a broken link. A
  hosted-converter URL — `…/ics?feed=…&lang=es`, which is what
  opentechevents.org's text-language control hands the widget — arrived as
  `…/ics?feed=…`, with the chosen **language** dropped into a sibling
  parameter Google ignores: the subscription succeeds, in the wrong
  translation, with no error to report. Reverse the two parameters and it is
  the feed that is lost instead. The value is
  now percent-encoded; the `webcal://` scheme swap is unchanged. Both the
  encoded and the unencoded form were checked against a real Google account
  on 2026-11-26 and both subscribe, so this costs nothing for feeds that
  were already working. The comment claiming Google requires the unencoded
  form, and the three tests pinning that spelling, were never executed
  against Google — they compared strings.

- **A multi-part event's price.** A conference published one document per
  session prices them through `partOf.offers` (OTE Spec 0.5's D032), and the
  widget read neither that nor `offers[].scope`: a covered session showed no
  price at all, and a session with a 60 € `add-on` showed **60 €** — the
  surcharge, presented as the cost of attending a day that costs 300. Both
  come from `@opentechevents/preview-feed`'s pricing, which now composes the
  total; the widget renders what the number *is*.
- A surcharge with no priced admission to add to is rendered as `+20 €`, with
  a title saying it is an additional charge, and never as a total. The spec's
  rule for this area is that incomplete is acceptable and false is not.

`oteSpecVersion` stays **0.4.0**: `speakers`, `recordings` and `contributing`
are still unrendered (#115), so claiming 0.5 would be claiming more than the
widget does. This release fixes the half that produced *wrong* output rather
than absent output.

## 0.8.2

### Changed

- `@event-calendar/core` 5.12.0 → 5.18.1 (the bump asked for 5.17.2;
  `^5.17.2` resolves to 5.18.1). Only `layout="calendar"` loads this library,
  and it is lazy-loaded, so nothing changes for an embed that does not use
  that layout. `oteSpecVersion` stays **0.4.0**.

  Released apart from 0.8.1 because it is the one bump in this batch that can
  change how the widget *looks*. Verified in a real browser rather than from
  the test suite alone: the month grid renders inside the shadow root fully
  styled (106 day cells, 9 event chips, today highlighted, navigation
  working) with no console errors. That is the specific risk worth checking —
  this library was chosen over FullCalendar precisely because it ships its
  stylesheet as an importable file that survives the shadow boundary, and a
  regression there would render the calendar unstyled rather than broken.

## 0.8.1

### Changed

- Bundled dependencies only; no change to the widget's API, markup, styling or
  behavior, and `oteSpecVersion` stays **0.4.0**. Released as its own version
  because `/embed/latest/` and the legacy `/embed/` alias are rebuilt from
  `main`, so a bundle that reaches consumers without a version and a changelog
  row is a bundle nobody can tell apart from the last one.
  - `dompurify` 3.4.14 → 3.4.17. This is the sanitizer every feed-supplied
    string passes through before it reaches the DOM, which is why it gets a
    release of its own rather than waiting for the next feature.
  - `marked` 18.0.11 → 18.1.3 (the bump asked for 18.1.1; `^18.1.1` resolves
    to 18.1.3). Also bumped in `apps/editor` and the three `packages/export-*`
    renderers so the monorepo stays on one version of it.

## 0.8.0

### Changed

- The bundle now targets **OTE Spec 0.4.0** (`oteSpecVersion`), a
  compatibility release that only relaxes validation: no field was added or
  removed, and every 0.3.0 feed this widget renders today keeps rendering
  identically. Two relaxations reach the widget — HTTP(S) URL fields validate
  as `iri` (a published `id`, `url` or image address may contain non-ASCII
  characters such as `…/pycamp-españa`), and `image[]` accepts `http://` as
  well as `https://`.
- **An `http://` image is treated as absent on an `https` page.** The browser
  blocks it as mixed content before a byte arrives, so an `<img>` there can
  only ever produce a broken frame. Cards fall back to the usual placeholder
  (or `placeholder-image`), and the list body and detail modal render without
  an image and reclaim its space — exactly what an event with no image looks
  like. On an `http` page the image is not blocked and is rendered as
  published. No feed that is valid under 0.3.0 can hit this: `http://` images
  only became legal in 0.4.0.
- When an event lists several images, the first `https://` entry is preferred
  over an earlier `http://` one instead of the list's first entry winning
  unconditionally (`@opentechevents/preview-feed`'s `firstImage`). The
  publisher's order still decides between entries the browser will actually
  load; falling through is never worse, since an `https` image loads on an
  `http` page too.

### Fixed

- Non-ASCII addresses survive the render path unencoded: `event-id` matches an
  `id` containing a literal `ñ` (the match is exact string comparison, so a
  single re-encoding anywhere would silently empty a page pinned to one
  event), and event links and image `src`s keep the spelling the feed
  published. `<ote-subscribe>`'s links keep encoding the feed URL exactly once
  where it is a query parameter (Feedly, OTE Reader, OTE Tools preview) and
  not at all where the scheme is swapped for a handler to open
  (`webcal://`, `feed://`, Google Calendar's `cid`).

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
