# Handoff — the OTE validator, and what is left around it

Working notes for picking this up in a fresh session. Not part of the
published docs. It used to carry the pending list too; that list is now issues
(see below), so what is left here is the knowledge that would be lost if the
file went away — traps, machine quirks, commands, test subjects.

## Where things stand

Issue #60 is **done and live**, along with the `'unsafe-eval'` debt and the
README badge (`/badge?doc=…` on the Worker — see
`workers/validator/README.md`). `main` is green and deployed; no open PRs.

**The repo implements OTE Spec 0.4.0.** All seven published packages are on npm
at `0.4.0`, the validator is deployed and reports it, and the migration that
got there is finished — its per-session notes were deleted with the release
commit, and every decision worth keeping is in this file, `CONTRIBUTING.md` or
the package changelogs.

| Thing | State |
| --- | --- |
| `apps/validator` | Built here, served by the Worker. Three modes: URL, file, paste. |
| `packages/discover-feed` | Pure discovery, no network. 23 tests. |
| `workers/validator` | Cloudflare Worker: the page, `/fetch` and `/badge` on one origin. 52 tests. |
| `packages/validate` | Schemas embedded **and compiled** by `pnpm gen` (ajv standalone). No ajv at runtime, so the page's CSP is `script-src 'self'`. 141 tests. |
| <https://validator.opentechevents.org/> | Live, deployed by `deploy-validator.yml` on push to main. |
| `tools.opentechevents.org/validator/` | Redirect to the canonical URL. |

`opentechevents.org` now uses Cloudflare DNS (nameservers `hunts` /
`violet.ns.cloudflare.com`). All GitHub Pages records are DNS-only on purpose —
proxying them breaks Pages' certificate issuance.

Read before touching any of it: `apps/validator/README.md`,
`workers/validator/README.md`, and the validator bullet in `CLAUDE.md`.

## What is still open — all of it is an issue now

Nothing in this file is a to-do list any more. The three things that were
pending have been filed, with their reasoning, so they can be picked up one at
a time by whoever gets there:

- **[ote-tools#66](https://github.com/OpenTechEvents/ote-tools/issues/66) — move
  the `@v1` tag.** It still points at `305eda2` (2026-07-16), 164 commits back,
  so every organizer fork runs July's tools rather than the 0.4.0 ones. The
  spec side is already answered in the issue (0.4.0 only relaxes, and forks
  never write `specVersion` — `buildFeed()` generates it). What blocks the move
  is the rest of those six weeks: the fork-visible surface has to be diffed, or
  a scratch fork pointed at `@main`, before the tag deploys it to everyone.
- **[spec#33](https://github.com/OpenTechEvents/opentechevents-spec/issues/33) —
  settle discovery.** `/.well-known/ote-feed`, the embedded
  `<script type="application/ote+json">`, and `ote+json` vs. `feed+json`. Both
  mechanisms are implemented in `packages/discover-feed` behind options that
  default to off, and the media-type match is deliberately lax, until the spec
  decides. This used to be tracked against spec#6, which is the umbrella Feed
  Schema issue and was never about discovery — so nothing was tracking it.
- **[ote-tools#67](https://github.com/OpenTechEvents/ote-tools/issues/67) —
  `localhost` in the validator's `ALLOWED_ORIGINS`.** Production is same-origin
  now, so the entries only let `pnpm dev` borrow the deployed fetcher, at the
  cost of letting any localhost page drive a public outbound-request endpoint.

Closed since the last pass: the `'unsafe-eval'` debt, the README badge, the
dangling `fetch.opentechevents.org` DNS record, `export-jsonld`'s trusted
publisher, and spec#31 / spec#32 — both of which shipped in OTE Spec 0.4.0.

The validator UI has also been judged and needs nothing: at 375px in a real
browser there is no horizontal overflow, the candidate picker holds up with
five feeds and long titles, and the source panel already scrolls inside
`max-height: 32rem`.

What stays below is the part that does not belong in an issue tracker: the
traps, the machine's quirks, and the commands.

## Traps that cost time — do not rediscover them

1. **Never pass the global `fetch` by reference.** `fetchImpl: fetch` throws
   `Illegal invocation` in a browser and in the Workers runtime; Node tolerates
   it, so the whole test suite passes against code that cannot make a single
   request. Both sides wrap it: `browserFetch` in `apps/validator/src/main.ts`,
   `boundFetch` in `workers/validator/src/index.ts`.
2. **Nothing may compile a schema at runtime.** `@opentechevents/validate`
   ships validators ajv compiled at codegen time (`pnpm gen`), so the page's
   CSP is plain `script-src 'self'`. Reintroducing runtime ajv compilation
   would make the module throw at import under that CSP, and the page would
   then register **no listeners at all** — every button silently dead, in all
   three modes, which is why `apps/validator/boot-errors.js` exists.
3. **Unit tests cannot see either of the above.** Load the page in a real
   browser before believing a green suite. Headless works: serve
   `apps/validator/dist` plus a stub `/fetch`, then
   `Google\ Chrome --headless --dump-dom "http://localhost:PORT/?doc=…"` and
   look for the verdict in the dumped DOM. **But `--window-size` will not go
   below ~485 CSS px**: ask for 375 and the page still lays out at 485 while
   the screenshot is cropped to 375, which looks exactly like a page
   overflowing its viewport. It cost a false "mobile is broken" once. To judge
   a phone width, load the page in a 375px `<iframe>` on a wider window —
   media queries follow the frame.
4. **`pnpm --filter … deploy` runs pnpm's own built-in `deploy`.** Use
   `run deploy`.
5. **Declaring `routes` disables the `workers.dev` URL** unless
   `workers_dev: true` is set explicitly. A deploy silently took it down once.
6. **A second custom domain does not give the fetcher an "API name".** Assets
   are served before the Worker script runs, so the extra hostname served the
   whole page — two canonical URLs for one tool. An API hostname needs its own
   Worker without an assets binding.
7. **Dependabot PRs need `@dependabot rebase`, not a CI re-run**, to pick up a
   fix that landed on `main`: re-runs reuse the cached merge base.
8. **Two different local failures look like "the fetcher is broken".** `pnpm
   dev` serves static files only: without `OTE_FETCH_ENDPOINT` the relative
   `/fetch` hits esbuild's `404 - Not Found` in `text/plain` and the page
   reports a fetch-service error — it never reached the feed. And editing
   `index.html` while the dev server runs used to leave the served markup
   stale, so a bundle rebuilt against new elements threw at import and the
   page registered no listeners (the URL form then submits itself and CSP
   blocks it with `form-action 'none'`). `build.mjs` now watches the static
   files too; the messages name both causes.

## Local environment

`git` on this machine resolves to a broken Xcode shim — use
`/usr/local/bin/git` (2.55.0), and put it on `PATH` before running `gh`, which
shells out to git. Node/pnpm come from Volta: `export PATH="$HOME/.volta/bin:$PATH"`.

`CLOUDFLARE_API_TOKEN` lives in the maintainer's shell profile and is **not**
in a non-interactive shell's environment; `source ~/.zshrc` first to deploy by
hand. That local token is broad; CI uses a separate, narrower one stored as
the `CLOUDFLARE_API_TOKEN` repository secret (Workers Scripts: Edit, Workers
Routes: Edit, Account Settings: Read).

## Commands worth remembering

```sh
# Local development. URL mode needs the deployed fetcher and PORT=8000,
# which is the origin allowed in ALLOWED_ORIGINS.
OTE_FETCH_ENDPOINT=https://ote-validator.hhkaos.workers.dev PORT=8000 \
  pnpm --filter @opentechevents/validator dev

# Deploy by hand (builds the page first, then the Worker).
source ~/.zshrc && pnpm --filter @opentechevents/validator-service run deploy

# Everything CI runs.
pnpm install --frozen-lockfile && pnpm lint && pnpm build && pnpm typecheck && pnpm test
```

## Useful test subjects

- `https://communitybuilders.dev/` — real page declaring a feed as
  `application/feed+json`; discovery finds it, 25 events, valid.
- `https://opentechevents.org/` — declares no feed (the `ote+json` string on
  it is inside a code sample). Must report "not discovered", never "invalid".
- `packages/validate/fixtures/valid|invalid/` — the same corpus CI validates.
