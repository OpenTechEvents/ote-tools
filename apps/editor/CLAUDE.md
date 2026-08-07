# apps/editor

Vanilla TypeScript + DOM event editor (no framework). `main.ts` bundles
via esbuild to `dist/main.js`; `index.html`/`styles.css` are static files
copied into `dist/`.

## Dev workflow gotcha

`pnpm dev` (esbuild watch + static server) only rebuilds `dist/main.js`
on save. `index.html` and `styles.css` are copied into `dist/` **once**,
at server startup — they are not watched. After editing either, run:

    cp apps/editor/index.html apps/editor/styles.css apps/editor/dist/

before reloading the browser, or you'll be looking at stale markup/CSS.

## CSS: the `hidden` attribute loses to author `display` rules

Any CSS rule that sets `display:` on a selector that's *also* toggled via
the JS `hidden` property must be scoped `:not([hidden])`. An author
stylesheet rule always wins over the UA stylesheet's `[hidden] { display:
none }`, regardless of specificity — so a plain `.foo { display: flex }`
silently defeats `fooEl.hidden = true` elsewhere. Bitten by this
repeatedly in the same session: `#profile-switch`, `.recurrence-fields`,
`.field.pair`. When adding a new `display:` rule on anything toggled by
`.hidden = …` in `main.ts`/`ui/form.ts`, default to `:not([hidden])`.

## Native date/time inputs have a rendering-width floor

`<input type="date">`/`<input type="time">` won't shrink below their own
intrinsic minimum width in Chrome, regardless of `flex-basis`/`width`
CSS. Cramming 4-5 of them into a narrow flex row (e.g. inside a
`.repeater-item`) may still wrap even with generous CSS budgeting — a
real platform constraint, not a CSS bug worth chasing further.

## Browser-testing this app: avoid getting stuck on confirm()/beforeunload

The app calls `window.confirm(...)` before discarding a pending import
queue or replacing form content, and has a `beforeunload` handler
guarding unsaved changes. Both are **native browser dialogs** — triggering
one via the `computer` tool's click action blocks the whole
Claude-in-Chrome session (CDP calls time out) until dismissed.
- Before clicking anything that might trigger a confirm(), stub it first
  via `javascript_tool`: `window.confirm = () => true;`
- If a `beforeunload` "Leave site?" dialog gets stuck anyway, recover by
  calling `navigate` again with `force: true` — it discards the dialog
  and proceeds.

## OTE has no recurrence-rule concept

The spec is explicit: one document per occurrence, always ("un documento
= una ocurrencia. Quien publica expande."). Never store a rule in an
event/feed file — a "repeat" feature must *generate* N documents, not
represent recurrence as data. The spec's own guidance for an otherwise
open-ended series: expand a bounded horizon ("12 meses o las próximas 12
ocurrencias"), not forever — `lib/recurrence.ts`'s `MAX_OCCURRENCES` caps
every generated series at 24 for this reason.
