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
| From a URL | Through `workers/fetch-url`, the only component with network access. |

Upload and paste keep working with the Worker down — there is a test that
deletes `globalThis.fetch` and validates a fixture anyway. That is not a
detail: it means an organizer can check a document they are not ready to
publish, and that an outage degrades one mode instead of the tool.

## Reuses `@opentechevents/validate` verbatim

The page runs the same validator as the CLI, CI and `apps/editor`. A validator
with a second opinion about what is valid would leave the format without a
referee, which is the whole reason this page exists.

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

## The fetcher origin is baked in at build time

`build.mjs` substitutes `OTE_FETCH_ENDPOINT` (default
`https://fetch.opentechevents.org`) into **both** the bundle and the CSP's
`connect-src` in `index.html`. Change it in one place only and the page will
call an endpoint its own CSP blocks — which fails at runtime, in the one mode
that needs a network. `deploy-tools.yml` sets it from the
`OTE_FETCH_ENDPOINT` repository variable.

## Permalinks

`?doc=<url>` re-runs the whole thing: fetch, discover, validate. That is the
form that gets pasted into an issue when a feed is broken, and the reason the
Worker exists at all. A result badge for READMEs is a later step.

## Two traps no unit test here can catch

Both cost a live debugging round trip; both are invisible to vitest.

**Never pass the global `fetch` by reference.** `fetchImpl: fetch` throws
`TypeError: Illegal invocation` when called — the browser requires `window` as
the receiver, and the Workers runtime is stricter still. Node's fetch does not
care, so every test passed against code that could not make a single request.
Both sides now wrap it (`browserFetch` in `src/main.ts`, `boundFetch` in
`workers/fetch-url/src/index.ts`). Do not "simplify" either back.

**ajv compiles schemas with `new Function`.** A CSP without `'unsafe-eval'`
makes `@opentechevents/validate` throw at import time, which means `main.ts`
never finishes evaluating and the page registers no listeners at all: every
button silently does nothing, in all three modes. `boot-errors.js` exists to
make that state announce itself. The durable fix is build-time standalone
validators, which would let the CSP drop `'unsafe-eval'` again.

When touching either area, load the page in a real browser before believing
the test suite.

## Dev workflow gotcha

Like `apps/editor`: `pnpm dev` only rebuilds `dist/main.js` on save.
`index.html` and `styles.css` are copied into `dist/` once, at startup — and
`index.html` is *rewritten*, not copied, since the CSP placeholder has to be
substituted. After editing either, re-run `node build.mjs` (or restart `pnpm
dev`) rather than copying the file by hand.
