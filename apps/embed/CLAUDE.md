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
   artifact, stuck at 3.12.0) compiles down to ~133KB minified / ~44KB
   gzip for core+DayGrid — and it's lazy-loaded, so it only costs anything
   for a consumer who actually sets `layout="calendar"`.
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

`@event-calendar/core`'s compiled `dist/index.js` imports from `svelte`
at runtime (it's built with Svelte 5 internally) — that's already accounted
for in the sizes above; no extra esbuild config is needed for it beyond the
`.css` loader, since `svelte` resolves normally through `node_modules` as a
transitive dependency.

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
