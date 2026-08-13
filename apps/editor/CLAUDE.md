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

## Keep CHANGELOG.md current

`apps/editor/CHANGELOG.md` tracks notable changes to this app, dated
(not versioned — this app isn't published to npm). Add an entry for any
user-facing change (new field, changed flow, fixed bug) as part of the
same session/commit that makes it — don't leave it for a later pass.

## The slug/filename is minted once and never tracks later date edits

`suggestSlug`/`suggestSeriesSlug` (`lib/event-json.ts`) derive the filename
slug from `<year-month or date>-<kebab(name)>` at creation time only —
`main.ts`'s `refresh()` only re-suggests `state.slug`/`state.id` while
`isNew` is true. Editing an existing event's `startDate` does not
regenerate the slug, rename the file, or touch `id`; `issue-to-pr.yml`
writes back to the same `events/<slug>.json` regardless of what the date
now says. This is deliberate, not a bug: `id` (`<feed url>/events/<slug>`,
see the field note in `ui/form.ts`) is a stable identifier "never changed
after publishing" — consumers use it to update rather than duplicate an
event — and the filename is derived from it, so renaming on date-edit
would break that contract. Net effect: a published event's filename can
end up date-mismatched with its own `startDate` field after an edit; this
is expected and the filename should never be treated as authoritative —
only `startDate` inside the JSON is. See DESIGN.md's "Flujo de escritura"
section for the cross-repo rationale.

## The layout is no longer single-column at every width

`styles.css`'s top-of-file comment used to say the layout "never splits."
That was a deliberate choice at the time, but it's been overridden: from a
new wide-desktop breakpoint (`min-width: 72rem`) up, `#form-view` becomes a
two-column CSS grid — the form on the left, the live preview
(`#preview-column`, see below) on the right — so a wide screen shows both
instead of just getting more padding. Below that breakpoint (including the
existing "wider desktop" ~52rem tier), the app is still genuinely
single-column, unchanged. Don't assume single-column-always when reading
older comments or issues that predate this — check the `72rem` tier's rules
in `styles.css` first.

`body`'s `max-width` and `#action-bar`'s fixed width both grow to match at
the same `72rem` tier (44rem form column + 2rem gap + 26rem preview column),
reusing the exact centering mechanism `#action-bar` already used at the
52rem tier (`left: 50%; transform: translateX(-50%); width: …`) rather than
inventing new positioning math — that existing mechanism has its own
hard-won comment nearby about a centering bug already hit once; don't
recompute the action bar's position independently of `body`'s max-width, or
you'll likely reintroduce it.

`#form-view` toggling `data-mobile-tab="form"/"preview"` (below the wide
tier, to pick which of `#form-column`/`#preview-column` shows) uses
attribute-selector rules like `#form-view[data-mobile-tab="preview"]
#form-column`. The wide-tier override that forces both columns visible has
to repeat those same compound selectors (see the comment in `styles.css`
right above it) rather than a plain `#form-column, #preview-column { display:
block }` — a lower-specificity override there would silently lose to the
mobile-tab rule if `data-mobile-tab` still happens to be `"preview"` from a
narrower viewport (main.ts doesn't reset it on resize).

## Live preview: `<ote-events>` fed purely in-memory

`#preview-column` embeds the same `<ote-events>` widget (`apps/embed`,
already self-hosted via `dist/embed` — see `build.mjs`) as the events list
view, but driven from the in-memory draft rather than a fetched feed:
`main.ts`'s `refresh()` computes `toEventJson(state)` and calls
`schedulePreviewUpdate()`, which debounces ~200ms then sets
`previewWidget.events = events`. This works because
`oteJsonToPreviewFeed` (`packages/preview-feed`) treats every event field as
optional and only ever throws if its input isn't shaped like `{ events:
[...] }` — never true here — so the preview renders fine even for a blank
new-event draft or mid-edit bulk-edit template. There is deliberately no
"wait until the draft is schema-valid" gate; if you're tempted to add one,
it isn't needed and would just make the preview lag behind typing.

`events` is `[toEventJson(state)]` (one card) only when `getRecurrenceSeries()`
is empty. Once one or more "+ Add recurrence" rows exist, `refresh()` expands
them the same way `proposeOrGenerate()` does at Review & submit time
(`buildRecurringEvents(s, expandRecurrenceDates(s.rule))` per row, flattened)
and previews every occurrence instead — otherwise the preview would keep
showing just the shared template while the organizer builds a series, which
is exactly the state that's about to disappear once Review & submit expands
it for real. `getRecurrenceSeries` reads `renderForm`'s live recurrence-row
state (via its own `getSeries` closure) and only exists in the normal
single-event render path — `renderForm` never wires it up in bulk-edit mode
(`bulkEditChecklist` set), so it stays `() => []` there and bulk edit keeps
previewing the shared template alone, same as before.

## OTE has no recurrence-rule concept

The spec is explicit: one document per occurrence, always ("un documento
= una ocurrencia. Quien publica expande."). Never store a rule in an
event/feed file — a "repeat" feature must *generate* N documents, not
represent recurrence as data. The spec's own guidance for an otherwise
open-ended series: expand a bounded horizon ("12 meses o las próximas 12
ocurrencias"), not forever — `lib/recurrence.ts`'s `MAX_OCCURRENCES` caps
every generated series at 24 for this reason.
