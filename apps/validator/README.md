# apps/validator

The public answer to *"is this OTE document valid?"* — a static page at
`tools.opentechevents.org/validator/`, nothing to install.

Vanilla TypeScript + DOM, no framework, same shape as `apps/preview`:
`build.mjs` bundles `src/main.ts` into `dist/main.js` and copies
`index.html`/`styles.css` next to it.

```sh
pnpm --filter @opentechevents/validator dev    # esbuild watch + static server
pnpm --filter @opentechevents/validator test
```

## Three modes, two of them offline

| Mode | Where it runs |
| --- | --- |
| Upload a file | Entirely in the tab. The file is never uploaded. |
| Paste JSON | Entirely in the tab. Nothing is sent anywhere. |
| From a URL | Through `/fetch` on the same origin, served by `workers/validator` — the only component with network access. |

Upload and paste keep working with the Worker down — there is a test that
deletes `globalThis.fetch` and validates a fixture anyway. That is not a
detail: it means an organizer can check a document they are not ready to
publish, and that an outage degrades one mode instead of the tool.

## Reuses `@opentechevents/validate` verbatim

The page runs the same validator as the CLI, CI and `apps/editor`. A validator
with a second opinion about what is valid would leave the format without a
referee, which is the whole reason this page exists.

## Each document is checked against the version it declares

Every OTE release pins its own `specVersion` with a `const`, so measuring a
0.3 feed against the 0.4 schemas yields exactly one error — about
`specVersion` — and calls a healthy feed broken. This page used to do that,
while the adopter-registration bot linked here saying the same feed validated.

Now `buildReport` asks `@opentechevents/validate` for the version the document
declares. Inside the support window (the last three releases) the document is
**valid**, with a *notice* saying a newer release exists and where to read what
changed. Outside it, the migration message is an error. A `specVersion` that is
missing or was never published is an error of its own: there are no rules to
judge such a document by.

The **Spec version** selector next to *Validate as* is an override, not a
setting: automatic is the default, and the verdict line always says which of
the two produced it. Its reason to exist is the migration rehearsal — someone
on 0.3 seeing what 0.4 would break before committing to it. Under an override
the mismatch on `specVersion` is a finding, as it should be: that field is one
of the things a migration changes.

Because the page embeds every version, `build.mjs` builds with `splitting: true`
into an outdir. The latest version's compiled schemas ship in the initial load;
the others sit in chunks fetched only when a document of that vintage turns up.

## Link checking is a separate question from validity

*"Do these URLs load?"* is answered by `POST /check-urls` on the Worker, opt-in
behind a button, and it can never change the verdict. A 404 is not a schema
violation, and a page where a broken image turned a feed red would have
publishers "fixing" documents that are already correct.

It runs server-side because it cannot run here: from a browser, a cross-origin
request without CORS fails identically whether the host is dead or merely
CORS-less, so a client-side checker would report healthy URLs as broken — the
exact false positive this feature exists to remove. `lib/urls.ts` decides what
is worth asking about (never `id`: an OTE `id` is an identifier that need not
resolve) and what each URL is for, since a dead image and a dead registration
page cost a reader different things.

## Two verdicts, never merged

**Discovery** ("I found your feed, here") and **validation** ("it is valid")
are rendered as separate steps. If they were one, an organizer whose `<link>`
has a typo would read *"my JSON is broken"* and go fix the wrong thing. A page
that declares no feed produces "no OTE feed discovered", not "invalid"; a page
declaring several stops and asks which one.

## MUST and SHOULD, never merged either

Schema violations make a document **invalid**. Unmet recommendations
(`checkFeedRecommended` / `checkEventRecommended`) leave it valid but harder to
find, filter and subscribe to. They are listed in separate sections with
different wording, because mixing them makes the tool useless for the second
case and alarming for the first.

## Errors point at a line

`lib/locate.ts` converts the validator's readable paths (`events[3].location`)
into JSON Pointers and indexes the source text once to find where each pointer
sits, so every finding carries `line:column` and highlights that line in the
document view. A finding whose property is *missing* falls back to its nearest
existing ancestor — the object the user has to open.

## Nothing remote is ever rendered as HTML

Every string that came from a fetched document reaches the DOM through
`textContent`. A feed whose event name is `<script>alert(1)</script>` shows
those characters. `index.html` carries a strict CSP with no `unsafe-inline`,
and `workers/fetch-url` independently answers `nosniff` + `default-src 'none'`
so the endpoint cannot be used to serve someone's feed as a page.

The document is displayed and validated. It is never executed.

## The fetch endpoint is same-origin in production

`build.mjs` leaves `OTE_FETCH_ENDPOINT` empty by default, which makes the page
call a relative `/fetch` — no cross-origin request, and a CSP that says
`connect-src 'self'`. Set the variable to an absolute origin only when page
and endpoint genuinely live apart, which in practice means `pnpm dev`:

```sh
OTE_FETCH_ENDPOINT=https://ote-validator.hhkaos.workers.dev PORT=8000 \
  pnpm --filter @opentechevents/validator dev
```

`build.mjs` substitutes the value into **both** the bundle and the CSP's
`connect-src`, so the two cannot drift — set only one and the page calls an
endpoint its own CSP blocks, which fails at runtime in the one mode that needs
a network.

Local URL mode also requires that origin to be in the Worker's
`ALLOWED_ORIGINS` (`localhost:8000` already is). Uploading and pasting need
none of this.

**Forget the variable and URL mode fails in a way that does not look like a
missing variable.** `pnpm dev` serves static files only, so the relative
`/fetch` hits esbuild's own `404 - Not Found` as `text/plain`, the page tries
to parse that as the envelope, and reports a fetch-service error. The message
now names the status, the media type and the variable — but if it ever comes
back as "unusably", this is the reason.

## Minified documents

A published feed is a build artefact, so the URL mode meets minified JSON as
the *normal* case — and every finding here is addressed to a line. Against one
40 kB line, "line 1, column 8452" is true and useless, and the source panel is
a single unreadable row.

So a document whose longest line passes `READABLE_LINE_LENGTH` (400 chars) is
indented for display, and — this is the part that matters — **the report is
built from the indented copy**, not from the original with the findings
remapped afterwards. The verdict cannot change: `JSON.stringify` of the parsed
value is the same JSON value the schema already judged. Only the coordinates
change, which is the whole point. The panel says so in its header, because an
organizer comparing the panel against their own file must not conclude the
tool rewrote it.

Two documents keep their own bytes: one whose indented form would cross the
5 MB ceiling (reformatting must not turn a valid document into "too large"),
and one that does not parse — there the exact bytes are the evidence. That
second case is also the one where line and column help least, so a syntax
error in a minified document additionally gets a one-line window cut around
the offending character, with a caret under it (`excerptAt` in `lib/locate.ts`).

## The source panel

Lines **wrap**, they do not scroll sideways. A feed carries URLs and
descriptions longer than any column, and a horizontal scrollbar inside the
panel hides precisely the end of the line a finding points at — on a phone,
most of the document.

Highlighting is `lib/highlight.ts`, a ~100-line JSON tokenizer with no
dependency. It returns *data* — text plus a kind — and `renderSource` turns
each token into a span with `textContent`, so a document whose event name is
`</span><script>` colours badly at worst. It tokenizes one line at a time,
which JSON permits (no string may contain a literal newline), and it never
throws on invalid input: the panel's whole job is showing documents that do
not parse.

## Permalinks and the badge

`?doc=<url>` re-runs the whole thing: fetch, discover, validate. That is the
form that gets pasted into an issue when a feed is broken, and the reason the
Worker exists at all.

The same panel offers the README badge: a Markdown snippet pointing at the
Worker's `/badge?doc=…`, which answers the same verdict as an SVG. The page
only composes the snippet — the endpoint, its caching and why it says "no feed
found" rather than "invalid" are documented in `workers/validator/README.md`.
The snippet is built from the page's own origin, so a locally served page
points at a local badge endpoint (and finds none: `pnpm dev` serves files
only).

## A trap no unit test here can catch

It cost a live debugging round trip, and it is invisible to vitest.

**Never pass the global `fetch` by reference.** `fetchImpl: fetch` throws
`TypeError: Illegal invocation` when called — the browser requires `window` as
the receiver, and the Workers runtime is stricter still. Node's fetch does not
care, so every test passed against code that could not make a single request.
Both sides now wrap it (`browserFetch` in `src/main.ts`, `boundFetch` in
`workers/fetch-url/src/index.ts`). Do not "simplify" either back.

When touching it, load the page in a real browser before believing the test
suite. The same goes for anything that changes what the bundle evaluates at
import time: this page once shipped with a CSP that made
`@opentechevents/validate` throw on import (ajv compiled its schemas with
`new Function`, which needed `'unsafe-eval'`), and the symptom was not an
error but silence — `main.ts` never finished evaluating, so the page
registered no listeners at all and every button did nothing, in all three
modes. `boot-errors.js` exists to make that state announce itself.

The CSP is now plain `script-src 'self'`: `@opentechevents/validate` ships
validators ajv compiled at codegen time, so nothing is compiled in the
browser (see `packages/validate/scripts/compile-validators.mjs`). If a change
ever seems to need `'unsafe-eval'` back, something started compiling at
runtime — find out what.

## Dev workflow gotcha

Like `apps/editor`: `pnpm dev` only rebuilds `dist/main.js` on save.
`index.html` and `styles.css` are copied into `dist/` once, at startup — and
`index.html` is *rewritten*, not copied, since the CSP placeholder has to be
substituted. After editing either, re-run `node build.mjs` (or restart `pnpm
dev`) rather than copying the file by hand.
