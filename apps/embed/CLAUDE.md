# apps/embed

The embeddable `<ote-events>` Web Component (issue #27) plus the playground
page that doubles as its documentation. Vanilla TypeScript, no framework —
same esbuild pattern as `apps/editor`/`apps/preview`.

## Two esbuild entry points, two very different audiences

`build.mjs` bundles **two** entry points into `dist/`:

- `src/main.ts` → `dist/ote-events.js` — the actual deliverable. This is
  what a consumer's `<script type="module" src="...">` loads on their own
  site. Keep it minimal: it must never pull in `src/playground.ts` or
  anything playground-only.
- `src/playground.ts` → `dist/playground.js` — wires the demo page's
  controls and snippet generator. Loads `dist/ote-events.js` the same way an
  external site would (see `index.html`), so the playground also serves as a
  real-usage smoke test of the widget.

If you add code that both files need, put it in a third module they both
import — don't import one entry point from the other.

## Static `index.html`/`styles.css` are copied once, not watched

Same gotcha as `apps/editor`/`apps/preview`: `pnpm dev` copies `index.html`
and `styles.css` into `dist/` **once**, at server startup. After editing
either, re-run the copy (or restart `pnpm dev`) before reloading the browser.

## The widget only fetches native JSON OTE feeds — on purpose

`icsToPreviewFeed`/`rssToPreview` (from `@opentechevents/preview-feed`) exist
for `apps/preview`'s diagnostic tabs, not for this widget. Wiring ICS/RSS
into `<ote-events feed="...">` would drag `ical.js` and a `DOMParser`-based
XML parser into `dist/ote-events.js` for a case issue #27's acceptance
criteria never asked for — OTE's canonical publish format for a site is
JSON. `@opentechevents/preview-feed` is built with `"sideEffects": false`
specifically so esbuild tree-shakes those unused converters (and their
heavier deps) out of this bundle when `src/element.ts` only imports
`jsonToPreviewFeed`. If ICS/RSS `feed=` support is ever requested, that's a
deliberate scope change to discuss, not a bug to quietly fix.

## Theming: `--ote-*` CSS custom properties, not `!important` overrides

`src/theme.css.ts` defines the widget's internal look inside its shadow
root using a `--ote-*`-prefixed set of custom properties (`--ote-bg`,
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
