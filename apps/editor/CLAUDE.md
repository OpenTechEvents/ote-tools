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

Same bug, different attribute: a native `<dialog>` relies on the UA
stylesheet's `dialog:not([open]) { display: none }` to stay invisible
until `showModal()`. An unconditional `#my-dialog { display: flex; ... }`
(needed for a dialog whose content should fill it, e.g. a tall
textarea) overrides that too — the dialog then renders inline in the
page's normal flow instead of staying hidden until opened
(`#description-editor-dialog` hit this). Scope it `#my-dialog[open] {
display: flex; ... }` instead.

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

## Recurring series: batch-submitted as one issue, not reviewed one by one

With a repo connected, confirming the "Repeat as a series" dialog calls
`submitRecurringBatch()` (`main.ts`), not `importSelected()` — it proposes
every checked occurrence as **one** GitHub issue (`proposeBatchChangeUrl`,
`lib/links.ts`) instead of loading them into the one-by-one import queue
ICS/JSON-LD import still uses. This was a deliberate change (see
CONTRIBUTING.md and the commit introducing it): a generated occurrence is
already a complete, independently valid event — a validated draft with only
the date changed — so there's nothing left to review per item the way a
heterogeneous ICS/JSON-LD import needs. Standalone mode (no repo) is
unaffected: it still goes through the queue, since "submit" there means
copy/download per item, not open an issue.

Because nothing opens the form per occurrence anymore, `buildRecurringEvents`
must fill in `id` itself (via the same `suggestSlug`/`suggestId` the form's
own `refresh()` uses) rather than leaving it `""` for the reactive
auto-suggest to fill in later — that reactive step only runs when a form
field changes, which never happens for an occurrence nobody opens.

`proposeBatchChangeUrl` always returns the copy-paste fallback shape, never
a prefilled URL — unlike single-event `proposeChangeUrl`, there's no small-N
case worth optimizing for: `MAX_URL_LENGTH` (8000) is reliably exceeded well
before a handful of full event JSON blocks (~2-2.5KB each) fit in one URL.

## A chippable section's "+ field" chip rebuilds its own subtree, not the whole form

Optional fields in the What/Who/Where/Metadata sections (Description,
Venue, Tags, …) live behind a "+ Field" chip (`renderChippableSection` in
`ui/form.ts`) — clicking it (or removing the field, or a dependent field
reacting to its driver) calls that section's own internal `renderBlocks()`,
**not** `main.ts`'s top-level `render()`. Anything that needs to run once
a field's DOM actually exists — attaching listeners to a native element
that can't be wired declaratively (the geo map, the description
toolbar/expand button) — must not assume `render()`'s own end-of-function
mounting calls (`mountMap()`, `mountDescriptionExpand()`, …) ever ran for
that field: they didn't, because the chip never called `render()`.

The fix is `renderChippableSection`'s `onRebuilt` param, threaded through
`renderForm` as `onSectionRebuilt` and implemented in `main.ts` as one
function that (re)runs every such mount call — `main.ts` passes the same
`onSectionRebuilt` for both the Where and What/Who/Metadata sections
rather than a per-field callback, since each mount function already
no-ops harmlessly when its own slot isn't present
(`form.querySelector(...); if (!slot) return;`). When adding a new field
whose behavior needs post-render wiring, add its mount call to
`onSectionRebuilt` in `main.ts`, not just to the bottom of `render()` —
otherwise it works when the field is already visible on load (edit an
existing event) but silently does nothing the first time it's added via
its own "+" chip (a new event, or any field not part of the active
profile's default set) — bitten by this with the description
toolbar/expand button.

## OTE has no recurrence-rule concept

The spec is explicit: one document per occurrence, always ("un documento
= una ocurrencia. Quien publica expande."). Never store a rule in an
event/feed file — a "repeat" feature must *generate* N documents, not
represent recurrence as data. The spec's own guidance for an otherwise
open-ended series: expand a bounded horizon ("12 meses o las próximas 12
ocurrencias"), not forever — `lib/recurrence.ts`'s `MAX_OCCURRENCES` caps
every generated series at 24 for this reason.
