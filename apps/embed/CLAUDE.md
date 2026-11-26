# apps/embed

The embeddable `<ote-events>` Web Component (issue #27) plus the playground
page that doubles as its documentation. Vanilla TypeScript, no framework —
same esbuild pattern as `apps/editor`/`apps/preview`.

## Three esbuild entry points, kept deliberately separate

`build.mjs` bundles **three** entry points into `dist/`:

- `src/main.ts` → `dist/ote-events.js` — the actual deliverable. This is
  what a consumer's `<script type="module" src="...">` loads on their own
  site. Keep it minimal: it must never pull in `src/playground.ts` or
  `src/calendar-layout.ts`.
- `src/playground.ts` → `dist/playground.js` — wires the demo page's
  controls and snippet generator. Loads `dist/ote-events.js` the same way an
  external site would (see `index.html`), so the playground also serves as a
  real-usage smoke test of the widget.
- `src/calendar-layout.ts` → `dist/calendar-layout.js` — `layout="calendar"`
  support. Never statically imported by `main.ts`; `element.ts` loads it at
  runtime via `import(new URL("./calendar-layout.js", import.meta.url).href)`
  only when a consumer actually requests that layout. See "The calendar
  layout" below for why.

If you add code that more than one entry point needs, put it in a fourth
module they all import — don't import one entry point from another.

## Static `index.html`/`styles.css` are copied once, not watched

Same gotcha as `apps/editor`/`apps/preview`: `pnpm dev` copies `index.html`
and `styles.css` into `dist/` **once**, at server startup. After editing
either, re-run the copy (or restart `pnpm dev`) before reloading the browser.

## Public embed assets are versioned

The playground can live at `/embed/`, but production snippets should point to
a fixed asset version such as:

```html
<script type="module" src="https://tools.opentechevents.org/embed/v0.1.0/ote-events.js"></script>
```

Use semantic versioning for `apps/embed/package.json`:

- Patch: compatible bug fixes, visual polish, accessibility fixes, docs, or
  build/deploy fixes that do not change the public API.
- Minor: compatible additions such as new attributes, CSS custom properties,
  layouts, default actions, action placements, or TypeScript exports.
- Major: breaking changes to attributes, properties, custom events, exported
  types, CSS custom properties, default behavior, or supported browser/runtime
  assumptions.

Before changing any public widget behavior, decide whether the change needs a
version bump. If it does, update `apps/embed/package.json` first and keep
`apps/embed/CHANGELOG.md` in the same commit. If the change is intentionally
unreleased, keep it under an `Unreleased` heading until the release commit.

`build.mjs` reads `apps/embed/package.json`'s `version` and `oteSpecVersion`.
It injects `version` into `playground.ts` as `__EMBED_VERSION__`, and replaces
the static HTML placeholders used by the playground header/versioning table.
This keeps the component version separate from the OTE Spec version the bundle
is designed to consume. For a release, run:

```sh
node build.mjs --snapshot-version
```

That writes the built files to `apps/embed/versions/v<version>/`. Those
snapshots are committed so future Pages deploys keep old versions available;
GitHub Pages deploys replace the whole artifact, so relying only on the latest
build output would silently delete older fixed URLs. The deploy workflow also
publishes `/embed/latest/` and the legacy `/embed/` alias from the current
build, but those floating URLs are not recommended for production embeds.

Release checklist for this component:

- Confirm the SemVer bump in `apps/embed/package.json`.
- Confirm `oteSpecVersion` still matches the OTE Spec shape supported by the
  bundle. This usually follows `@opentechevents/schema`/`packages/validate`'s
  generated `specVersion`, but the embed is a renderer rather than a full
  validator.
- Update `apps/embed/CHANGELOG.md`.
- Update the playground's version table in `apps/embed/index.html` when a new
  fixed version is released, keeping the previous rows and their supported OTE
  Spec versions visible.
- Run the embed typecheck/tests and `node build.mjs --snapshot-version`.
- Commit the source changes and the generated `apps/embed/versions/v<version>/`
  snapshot together.
- Push `main`, create an annotated tag named `embed-v<version>`, push the tag,
  and create the GitHub release from that tag.

## A version bump in `package.json` is not a release — this has already broken a consumer once

`package.json`'s `version` was bumped to `0.4.0` in a feature commit, but the
rest of the checklist above (changelog heading, `versions/v0.4.0/` snapshot,
tag, push, GitHub release) was never run. Four more commits landed on `main`
before anyone noticed, and a downstream app trying to pin `embed-v0.4.0` got
told no such tag existed on GitHub.

Before telling anyone (in a commit, a chat, or docs) that a version is
available to pin, verify the tag is actually pushed — don't trust
`package.json` alone:

```sh
git ls-remote --tags origin | grep "embed-v$(node -p "require('./apps/embed/package.json').version")"
```

If that prints nothing, the bump is unreleased: check `apps/embed/CHANGELOG.md`
for an `## Unreleased` section above the version heading — that's the
unfinished work. Finish the full release checklist (through pushing the tag
and creating the GitHub release) before pinning that version anywhere, and
avoid bumping `version` again in a later commit until the current bump is
tagged and pushed — a second bump on top of an untagged one hides the gap
even further. Prefer doing the version bump and the entire checklist in one
sitting rather than leaving `package.json` ahead of the last pushed tag
across multiple commits.

## An `http://` image is treated as absent on an `https` page

OTE Spec 0.4.0 dropped the https-only MUST on `image[]`, so a *valid* feed can
now point at an `http://` image. On an `https` page that is mixed content: the
browser blocks the request before a byte arrives, and an `<img>` can only
render a broken frame. `render.ts#displayableImage()` is the single gate — the
card falls back to its placeholder, and the list body/modal render without an
image and reclaim the space, which is exactly what an imageless event already
looks like. On an `http` page nothing is blocked and the image renders as
published, so the check reads `location.protocol` rather than assuming.

Upstream of it, `@opentechevents/preview-feed`'s `firstImage()` prefers the
first `https://` entry over an earlier `http://` one, so `displayableImage()`
only bites when *every* entry in `image[]` is `http://`. Both halves are
deliberate product behaviour, not lint: don't "fix" either by rendering the
blocked image anyway.

## The widget only fetches native JSON OTE feeds — on purpose

`icsToPreviewFeed`/`rssToPreview` (from `@opentechevents/preview-feed`) exist
for `apps/preview`'s diagnostic tabs, not for this widget. Wiring ICS/RSS
into `<ote-events feed="...">` would drag `ical.js` and a `DOMParser`-based
XML parser into `dist/ote-events.js` for a case issue #27's acceptance
criteria never asked for — OTE's canonical publish format for a site is
JSON. `@opentechevents/preview-feed` is built with `"sideEffects": false`
specifically so esbuild tree-shakes those unused converters (and their
heavier deps) out of this bundle when `src/element.ts` only imports
`oteJsonToPreviewFeed`. If ICS/RSS `feed=` support is ever requested, that's a
deliberate scope change to discuss, not a bug to quietly fix.

## Theming: `--ote-*` CSS custom properties, not `!important` overrides

`src/theme.css.ts` defines the widget's internal look inside its shadow
root using a `--ote-*`-prefixed set of custom properties (`--ote-surface`,
`--ote-accent`, etc.). CSS custom properties inherit through the shadow
boundary even though everything else in the shadow root is encapsulated —
so a host page can retheme the widget with plain CSS:

```css
ote-events {
  --ote-accent: #e91e63;
}
```

`theme="light"/"dark"/"auto"` needs no JavaScript: the CSS `:host([theme="dark"])`
selectors read the attribute directly. An unrecognized `theme` value simply
falls through to the light defaults — that's intentional, not a bug.

**`:host` has no `background` of its own, on purpose.** Only individual
pieces (`.event`, `.message`, badges/tags) get `--ote-surface`/
`--ote-accent-soft` backgrounds. An earlier version painted `:host` with a
`--ote-bg` variable, which made the *whole widget* — including the grid
gaps in `layout="cards"` — an opaque rectangle instead of blending into the
host page (very visible in dark mode against a light page). If you're
tempted to add a background back to `:host`, don't — that's the bug this
was, not a feature.

`layout="cards"`'s grid column width is `--ote-card-min-width` (default
`220px`, used as the min side of `minmax(...)` in the `auto-fill` grid — so
it controls both card width and, indirectly, how many columns fit). Set it
directly via host CSS for pixel-exact control, or use the `card-width`
attribute (`"small"`/`"medium"`/`"large"`, or any raw CSS length) — resolved
in `attrs.ts#parseCardWidth()` and applied by `element.ts#renderNow()` via
`this.style.setProperty(...)` on the host element itself, not inside the
shadow root (custom properties set on the host are still visible to its own
shadow tree). Deliberately no separate fixed "columns" attribute — turning a
min-width into a responsive column count via `auto-fill` already adapts
better across container sizes than a rigid count would.

## `event-id` is the single-event escape hatch — and it ignores `show-past`

`event-id="<OTE id>"` filters the feed to one event
(`visibleEvents()` in `render.ts`). Two decisions worth keeping:

- **It matches the OTE `id`, not the name or the date.** The `id` is a stable
  URI the spec documents as never changing after publication; a name or a
  date can be edited, and filtering on either would silently empty a page the
  organizer had already published and forgotten about.
- **It bypasses the past filter on purpose.** Someone who pins an id to a page
  means *that* event; having it disappear the morning after it happened is a
  surprise, not a feature. `limit` and grouping stay applied rather than
  special-cased — with one event they are moot anyway.

A non-matching id renders "Event not found in this feed.", not the ordinary
empty state: an id typo and a feed with nothing upcoming are different
problems, and only one of them is the organizer's to fix. `empty-message`
still overrides both.

The property route (`widget.event = …` / `widget.events = […]`) still exists
and still bypasses fetching entirely — that is for host apps like OTE Reader
that already hold the data. `event-id` is for a plain copy-paste page that
has nothing but a feed URL.

## The `fields` attribute is a full replacement, not a merge

`attrs.ts`'s `parseFields()` returns `DEFAULT_FIELDS` when the attribute is
absent, empty, or every comma-separated token is unrecognized. Any other
valid input **replaces** the default entirely — `fields="price,tags"` shows
*only* price and tags, not the defaults plus those two. This was a
deliberate choice ("elegir qué campos se muestran y cuales no") over an
additive/merge scheme, which would need a separate "hide" mechanism to ever
turn off a default field.

## `fields-preview`/`fields-detail` split the card from the modal/list-body — with asymmetric defaults

`fields` alone only ever gated the **card** (`renderCardEvent`) and the
**list layout's accordion body** (`renderListEvent`); the **detail modal**
(`renderModal`) used to render every optional field unconditionally, with no
`fields` gating at all — not a designed second surface, an oversight.

`WidgetState` now carries two sets instead of one: `previewFields` (cards)
and `detailFields` (list body + modal — both are "detail" surfaces, so they
share one config). Two new attributes, `fields-preview` and `fields-detail`,
use the same full-replacement `parseFields`-style semantics and can be set
independently of each other and of `fields`.

The fallback chain in `element.ts#renderNow()`:

```
previewFields = fields-preview ?? fields ?? DEFAULT_FIELDS
detailFields  = fields-detail  ?? fields  ?? ALL_FIELDS
```

The two ends of that chain deliberately use **different** fallbacks
(`DEFAULT_FIELDS` vs `ALL_FIELDS`), the same "asymmetric default"
precedent as `group-events` below: it's what makes both surfaces backward
compatible at once. An embed with no `fields`-anything set keeps its card
exactly as before (`DEFAULT_FIELDS`) *and* keeps its modal exactly as before
(everything, now expressed as `ALL_FIELDS` instead of no gating at all). Only
setting the legacy `fields` attribute changes modal behavior — and that's a
bug fix, not a regression: `fields` was documented as "what's shown," and the
modal silently ignoring it was never intentional.

`ALL_FIELDS` includes two field keys with no other home yet, `eligibility`
and `cfp` (from the OTE schema's `eligibility`/`cfp` event fields, now
captured by `@opentechevents/preview-feed`'s JSON converter) — both render as
small badges (`eligibilityBadge`/`cfpBadge` in `render.ts`), linking out when
the underlying data has a `url`. They're excluded from `DEFAULT_FIELDS` (same
opt-in-for-new-fields policy as `group-events`), so they only ever appear on
the card when explicitly requested — but they *do* show up in the detail
modal by default, since that surface's default is "everything."

## `group-events` defaults to the opposite of `fields`

`parseGroupEvents()` follows `fields`'s comma-list shape but **not** its
fallback: absent/empty/all-unrecognized input yields an *empty* `Set` (no
grouping), not "every type". This is deliberate — unlike `fields`, whose
default was already the pre-existing look, grouping is new opt-in visual
behavior (stacked cards + a mandatory badge in `layout="cards"`) shipped in a
minor release with a live pinned consumer (`ote-reader`), so the attribute
being absent must be a complete no-op. Only `layout="cards"` groups; `list`
and `calendar` always render every occurrence individually (calendar in
particular must show each date on its own day). See `src/grouping.ts` for the
header-selection rule (soonest future occurrence, else most recent past).

## Custom event actions are a typed JS API

Consumers that need host-app behavior (for example editor actions like edit,
clone, or delete) should set the element's `eventActions` property rather than
trying to pierce the Shadow DOM. The source-of-truth contract is exported from
`src/main.ts` as TypeScript types: `CustomEventAction`, `EventAction`,
`EventActionsInput`, `EventRenderContext`, `NativeEventActionConfig`,
`EventActionPlacement`, `EventActionIcon`, and `EventActionVariant`.

Native actions can be configured as strings for the simple detail-only case
(`"google-calendar"`, `"link"`) or as objects when they need placement/layout
control:

```ts
widget.eventActions = [
  { type: "google-calendar", placement: "both" },
  { type: "link", placement: "preview", layouts: ["cards"] },
];
```

Host apps such as OTE Reader can also make `eventActions` a function. The
function receives an `EventRenderContext` and returns actions for that
specific event, so labels/icons/pressed state can follow external state such
as folders, read/unread, saved, or collection membership:

```ts
widget.setAttribute("event-actions", "none");
widget.setAttribute("sort", "none");
widget.events = filteredEvents;
widget.eventActions = (context) => [
  {
    id: "save",
    label: saved.has(context.originalEvent?.id) ? "Saved" : "Save",
    icon: saved.has(context.originalEvent?.id) ? "bookmark" : "star",
    pressed: saved.has(context.originalEvent?.id),
    placement: "preview",
    onClick(_previewEvent, actionContext) {
      saveByStableRef(actionContext.originalEvent?.id, actionContext.feed?.url);
    },
  },
];
```

`onClick` intentionally keeps the old `PreviewEvent` as its first argument and
adds `EventRenderContext` as the second argument. Do not swap that order in a
minor release.

The `ote-event-action` DOM event includes both the legacy `event` field and
the richer context fields: `action`, `previewEvent`, `originalEvent`, `index`,
`feed`, `source`, and (when the event belongs to an active `group-events`
group) `group`.

Private in-memory metadata is allowed. The widget normalizes OTE input into
`PreviewEvent` for rendering, but it keeps a parallel mapping to the original
event object. Fields such as `_feedUrl`, `_feedTitle`, or `_readerRef` must
remain available through `context.originalEvent` and must not be rendered just
because they exist.

The widget stays stateless from the host app's point of view: it can render
`el.events = filteredEvents`, accept dynamic `layout` changes, honor
`sort="none"`, call host actions, and display host-provided `eventClassName`
or `eventBadges`, but it must not persist favorites, folders, collections,
read/unread state, subscriptions, or filters itself.

Default action behavior is deliberately conservative:

- `placement` defaults to `"detail"` (modal for cards/calendar, accordion body
  for list). Use `"preview"` for card preview buttons, or `"both"` for both
  preview and detail. In `layout="list"`, `"preview"` actions render as a
  trailing action cluster on the compact row itself (`.event-row-actions` in
  `theme.css.ts`) — hidden until hover/focus on fine-pointer devices, always
  visible on touch (`(hover: none), (pointer: coarse)`) — separate from the
  `"detail"` actions that live in the row's expanded accordion body. They are
  intentionally mounted as a sibling of `.event-accordion` rather than inside
  `<summary>`: Chromium silently drops a nested `<a>`'s own navigation once
  it's inside a `<summary>` (confirmed with a real click/keydown, not just
  reasoned about), which would otherwise break the native calendar/link
  actions specifically in this placement.
- `layouts` defaults to every layout. Pass `["cards"]`, `["list"]`, or
  `["calendar"]` to restrict where the action appears.
- `variant: "danger"` is available for destructive actions.
- `icon` supports the small built-in action icon set: `edit`, `trash`,
  `copy`, `external-link`, `calendar`, `star`, `check`, `bookmark`, `plus`,
  `folder`, and `collection`. Keep that set in `render.ts` close to the
  `EventActionIcon` type.
- `eventClassName(context)` returns host-controlled CSS class names for each
  event surface.
- `eventBadges(context)` returns extra non-OTE badges for host state. These
  are view hints only; the host app owns the underlying state.
- `empty-message="..."` customizes the empty state text.

Behavioral tests in `apps/embed/test/element.test.ts` are the living
documentation for placement, layout filtering, native calendar actions, and
the `ote-event-action` DOM event. The Reader-style in-memory tests are
especially important: update them with any API change so agent-facing docs do
not drift from the implementation.

## The calendar layout: why `@event-calendar/core`, not FullCalendar

`apps/preview` uses FullCalendar for its own calendar view. `layout="calendar"`
here deliberately uses a different library, `@event-calendar/core`, for two
reasons discovered while spiking this:

1. **Size.** FullCalendar's four `@fullcalendar/*` packages are ~3.8MB
   unminified; `@event-calendar/core` (which bundles all its views —
   `DayGrid`/`TimeGrid`/`List`/etc. — as named exports, no separate
   per-view packages despite what an npm search for
   `@event-calendar/day-grid` suggests; that package is a stale pre-4.x
   artifact, stuck at 3.12.0) compiles down to a fraction of that — and
   it's lazy-loaded, so it only costs anything for a consumer who actually
   sets `layout="calendar"`. `node build.mjs` prints the current size of
   `dist/calendar-layout.js`, which is the number that matters; registering
   the `List` view for the narrow fallback added about 9KB to it.
2. **Shadow DOM compatibility.** FullCalendar v5+ injects its CSS into
   `document.head` at runtime — a `<style>` there never reaches into a
   Shadow DOM at all, so it would render completely unstyled inside this
   widget. `@event-calendar/core` ships its stylesheet as a real importable
   file (`@event-calendar/core/index.css`), which `calendar-layout.ts`
   imports through an esbuild `.css` → `text` loader (configured for that
   one entry point only, in `build.mjs`) and injects into the widget's own
   `<style>` element in `element.ts`'s `#mountCalendar()` — verified
   working end-to-end in Chrome (month grid renders and is fully styled
   inside the shadow root). Its `createCalendar()` even types its `target`
   parameter as `Element | Document | ShadowRoot`, so Shadow DOM is a
   supported use case, not a lucky accident.

### `max-per-day` is a row height, and the numbers in it were measured

`dayMaxEvents` in this library only accepts `true` — "as many events as fit
the day cell" — so the numeric cap is implemented as a day-row height
(`calendar-layout.ts#dayRowHeight`, applied through
`--ote-calendar-row-height` by a rule in `theme.css.ts`). Two traps live
here, and both cost a measurement cycle:

1. **`dayMaxEvents: true` alone, with the calendar's `height: "auto"`, hides
   nothing.** `ec-uniform` sizes its rows `minmax(0, 1fr)`, and `1fr` tracks
   in a grid of indefinite height grow to the tallest row's content — so one
   15-event day makes *every* week 15 events tall. Pinning the row height is
   what actually caps a day.
2. **Empty weeks collapse only in the *uncapped* mode, and the cap is why —
   not the subgrid.** An earlier note here blamed the event overlay subgrid
   for forcing every track to the maximum; re-measuring in Chrome disproved
   that. With `max-per-day="off"` the rows are `auto` and genuinely
   non-uniform (measured 187/80/80/80/80 — the busy week, then the empty
   ones), and dropping the library's 5em `.ec-day` floor takes the empty
   ones to 37px.

   **Collapsing and capping together is available, but not through
   `--ec-row-height`.** That variable is a single value shared by every row,
   so content-sizing it (`auto`) grows each cell to its events and `+N more`
   never fires — every `minmax(auto, <cap>)` / `minmax(min-content, <cap>)`
   variant rendered all nine events of a busy day with no popover, because
   CSS ignores a `minmax()` max smaller than its min. Two earlier notes here
   concluded from that it was impossible; it is not, the variable was the
   constraint. `calendar-layout.ts#weekRowTracks()` writes
   `grid-template-rows` as an explicit track list instead — one track per
   visible week, sized by that week's busiest day and capped at
   `max-per-day` — and the library still hides whatever does not fit a given
   cell. Measured on a 158-event feed: six uniform 93px rows (644px) became
   26/26/26/26/92/92 (373px) with every `+N more` link unchanged.

   Two traps come with it. The track list must be reached through a custom
   property read by *our* stylesheet, not set inline on `.ec-main`, because
   the library rewrites that element's `style` on re-render. And the events
   the cap hides keep their layout box (`visibility: hidden`), so they
   inflate `.ec-main`'s `scrollHeight` far past the grid — invisible while
   it is `overflow: hidden`, but a bounded calendar turns that to `auto` and
   then a month that fits its budget still grows a scrollbar into blank
   space. `.ec-body { overflow: hidden }` under `[data-week-rows]` is what
   keeps both honest.

The `em` constants are measured in Chrome, not reasoned about. To re-measure
after a library or stylesheet change, serve `dist/` and have the page report
`.ec-day-head`, `.ec-event` and `.ec-day-foot` box heights for a day with
more events than the cap, then check that a cap of N shows exactly N chips
and an `+N more` link. Headless works and needs no CDP: put the measuring
script in the page itself, write the result into an element, and read it
back with `--virtual-time-budget=6000 --dump-dom`. The same trick drives
clicks (popover → modal → month preserved), which is how the remount fix was
verified.

### The library decides "clicked outside" in a way Shadow DOM breaks

`outsideEvent()` in `@event-calendar/core` (still so in 5.22.0) listens on
`document` and tests `el.contains(jsEvent.target)`. A `document`-level
listener inside a shadow root sees the event **retargeted to the host** —
measured here as `OTE-EVENTS`, with the real node only in
`composedPath()[0]` — so the test can never pass and *every* pointerdown
reads as outside. The visible bug: clicking an event in the `+N more`
popover closed the popover and opened nothing, because the dialog was torn
down before its own click handler ran and `noClick()` swallowed the click.

`calendar-layout.ts#suppressRetargetedOutsideEvents()` corrects the verdict
rather than the detection: the library announces it as a
`pointerdownoutside` CustomEvent on the dialog, and a capturing listener on
the container re-asks with `composedPath()` and
`stopImmediatePropagation()`s the ones that were really inside. Capture
reaches the target even though that event does not bubble — that is what
makes it possible to answer before the library's own handler.

Any other library feature wired through `outsideEvent()` has the same bug
waiting for it, and none of it is visible to the test suite: jsdom draws no
`.ec-event`, so the popover never exists there. `calendar-render.test.ts`
asserts the contract the fix hangs on (the CustomEvent, its `detail.jsEvent`,
the paths) and the popover itself has to be clicked in a real browser.

`@event-calendar/core`'s compiled `dist/index.js` imports from `svelte`
at runtime (it's built with Svelte 5 internally) — that's already accounted
for in the sizes above; no extra esbuild config is needed for it beyond the
`.css` loader, since `svelte` resolves normally through `node_modules` as a
transitive dependency.

## `<ote-subscribe>`'s ICS/RSS groups can come from the converter, not the publisher

`convert="ics,rss"` (the default) builds `/ics` and `/rss` links on
`convert.opentechevents.org` whenever `feed-json` is set and the matching
`feed-ics`/`feed-rss` is not. It is default-on because the registry case is the
common case — count it rather than trusting this sentence, and note the file
is an object with an `adopters` array, not an array (a measurement that
skipped that check once reported 4 of 7 feeds):

```sh
curl -s https://opentechevents.org/data/adopters.json \
  | node --input-type=module -e 'const d=JSON.parse(await new Response(process.stdin).text()); const a=d.adopters??[]; console.log(`${a.length} adopters, ${a.filter(x=>x.feed).length} with a feed, ${a.filter(x=>x.ics||x.rss).length} with their own ICS/RSS`)'
```

Default-off would have made the one action most visitors can actually use
something each adopter had to discover.

Four rules hold it together, and each is a test in
`test/subscribe-element.test.ts`:

- **A declared URL is never replaced.** The service is a fallback for a
  missing URL, not an override of a published one — including the mixed case,
  where a publisher's own `feed-ics` sits next to a generated RSS link.
- **`convert="off"` and `convert="none"` are both the opt-out.** `show` has
  only `"none"`, but an attribute whose job is to stop third-party URLs from
  being built must not read a host's `"off"` as an unrecognized token and
  then generate everything.
- **A feed URL the service would refuse generates nothing.**
  `subscribe-urls.ts#isConvertibleFeedUrl` predicts that refusal, and it has
  to predict the whole of it, not just the scheme: the first draft checked
  only `http(s)` and happily built links for `http://localhost:4000`,
  `http://192.168.1.1` and — worst — `https://user:pass@host`, which would
  have percent-encoded a publisher's password into a URL handed to Google
  Calendar and stored for years in a subscriber's client. The gate mirrors
  `workers/validator/src/ssrf.ts#checkUrl`, duplicated because that is
  Worker code and this is bundled into every consumer's page;
  `test/subscribe-urls.test.ts` imports the real `checkUrl` and asserts the
  two agree, with one documented divergence (public IP literals, refused
  here, allowed there). Absent beats broken.
- **Generated groups say so, to everyone.** A `.menu-note` in the popover,
  `data-generated` on the trigger, and the disclosure in the trigger's
  accessible name. The note sits **outside** the `role="menu"` element, in a
  `.popover` wrapper: `role="menu"` accepts only
  `menuitem`/`group`/`separator` children and assistive technology skips the
  rest, so a note inside it is visible to sighted users and silently dropped
  for the people most dependent on being told where a link points. Same
  reason the group headings are now `role="group"` with an `aria-label` and
  an `aria-hidden` visible label. A visitor subscribing `webcal://` to a
  generated URL is making this service long-lived infrastructure in their
  calendar client; that is worth one muted line.

The feed URL is percent-encoded, and the nesting is two deep for Google:
`cid=` wraps `/ics?feed=` wraps the publisher's URL, which may carry its own
query string. `test/subscribe-urls.test.ts` asserts what each service parses
back out rather than how the string looks — the #166 defect was a raw URL
ending at its first `&`, and the three tests that missed it all compared
strings.

The operational half lives in `workers/convert/README.md`: default-on turns
that Worker's caps into something real calendar clients poll on a schedule.

## The playground has one feed field, above the tabs, shared by both widgets

`<ote-events feed>` and `<ote-subscribe feed-json>` name the same document,
and since the converter derives ICS and RSS from it, that document is the
only file a publisher has to have. The playground used to ask for the URL
four times — `feed`, `feed-ics`, `feed-rss`, `feed-json`, in two tabs — which
taught the opposite of what OTE says: that you need three files. It also
meant the subscribe tab shipped `feed-ics`/`feed-rss` pre-filled, so the
conversion fallback never fired in the page that exists to demonstrate it.

`#source-feed-input` is now the single input. `playground.ts` aliases
`subscribeJsonInput` to it, the per-widget panels carry a pointer rather
than a field, and `feed-ics`/`feed-rss` live in a closed "Do you host your
own ICS or RSS?" group — they are exceptions now, not inputs. The snippets
still emit per-widget attributes: sharing the input must not blur that
`feed` and `feed-json` are different attributes.

Two things that are load-bearing:

- **`?feed=` round-trips, and the value is also kept in `localStorage`.**
  Same parameter `apps/preview` and `apps/validator` use, so a URL moves
  between the tools unchanged, and a configured playground is a link you can
  send someone with their own feed already loaded. Both reads are wrapped in
  `try`/`catch`: `localStorage` throws outright in a third-party iframe or
  with cookies blocked, and a playground has to work there.
- **The status line reports a real fetch, not the URL's shape.** A feed that
  404s, is not JSON, or is served without CORS looks identical to a healthy
  one in an address bar, and all three render an empty widget — which reads
  as "this widget is broken". The widget's own empty state cannot tell them
  apart; that line can, and it names CORS explicitly because a browser
  cannot distinguish it from a dead host.

## Testing the custom element needs jsdom, not the default Node environment

`element.test.ts` uses a `// @vitest-environment jsdom` pragma (kept
file-scoped, not global, so `attrs.test.ts`'s pure-function tests stay on
the faster default Node environment). `packages/preview-feed/test/rss.test.ts`
has the same pragma for the same reason — `rssToPreviewFeed` needs
`DOMParser`.

## Browser-testing the Copy button: clipboard permission blocks CDP

`playground.ts`'s Copy button calls `navigator.clipboard.writeText(...)`.
Clicking it through Claude-in-Chrome's `computer` tool triggers a real
Chrome clipboard-permission prompt that can hang the CDP `Runtime.evaluate`
call for the tab ("the renderer may be frozen or unresponsive") — the same
category of issue as the `confirm()`/`beforeunload` gotcha documented in
`apps/editor/CLAUDE.md`. It recovered on its own after a plain `navigate`
back to the page; `force: true` wasn't needed. This is an
automation-environment limitation, not a code defect — the button works
normally for a real user's click in a real browser. Don't spend time
forcing it through CDP; to verify the snippet text itself, read
`#snippet-code`'s `textContent` directly instead of exercising the button.
