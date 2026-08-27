# Handoff — the OTE validator, and what is left around it

Working notes for picking this up in a fresh session. Not part of the
published docs: delete it once the pending list is empty.

## Where things stand

Issue #60 is **done and live**, and so is the `'unsafe-eval'` debt that used
to head the pending list. `main` is green and deployed; no open PRs.

| Thing | State |
| --- | --- |
| `apps/validator` | Built here, served by the Worker. Three modes: URL, file, paste. |
| `packages/discover-feed` | Pure discovery, no network. 23 tests. |
| `workers/validator` | Cloudflare Worker: the page **and** `/fetch` on one origin. 35 tests. |
| `packages/validate` | Schemas embedded **and compiled** by `pnpm gen` (ajv standalone). No ajv at runtime, so the page's CSP is `script-src 'self'`. 141 tests. |
| <https://validator.opentechevents.org/> | Live, deployed by `deploy-validator.yml` on push to main. |
| `tools.opentechevents.org/validator/` | Redirect to the canonical URL. |

`opentechevents.org` now uses Cloudflare DNS (nameservers `hunts` /
`violet.ns.cloudflare.com`). All GitHub Pages records are DNS-only on purpose —
proxying them breaks Pages' certificate issuance.

Read before touching any of it: `apps/validator/README.md`,
`workers/validator/README.md`, and the validator bullet in `CLAUDE.md`.

## Pending, most valuable first

### 1. Result badge for READMEs

Named in issue #60, never built. A `<img>`-able endpoint on the Worker
(`/badge?doc=…`) that returns SVG saying valid / invalid / not discovered, so
a community can put its feed's status in its own README. Watch out: it makes
the Worker fetch on someone else's schedule, so it needs caching (the fetch
limits are per request, not per minute) and a story for how stale the answer
may be.

### 2. Discovery mechanisms still open in the spec

`/.well-known/ote-feed` and `<script type="application/ote+json">` are
implemented in `packages/discover-feed` behind the `wellKnown` / `embedded`
options, off by default, and the UI does not expose them. Turn them on when
[opentechevents-spec#6](https://github.com/OpenTechEvents/opentechevents-spec/issues/6)
closes — that issue also settles `application/ote+json` vs.
`application/feed+json`, at which point the lax media-type matching can become
a definite answer plus a warning for the loser.

### 3. Housekeeping in Cloudflare

- **Dangling DNS record `fetch.opentechevents.org`** — still in the zone,
  pointing at Cloudflare with nothing behind it. The deploy token has no DNS
  permission, so it has to be deleted in the dashboard.
- **Old Worker `ote-fetch-url`** — orphaned after the rename to
  `ote-validator`; no custom domains left on it. Safe to delete.
- **`localhost:8000` in `ALLOWED_ORIGINS`** (`workers/validator/wrangler.jsonc`)
  — only serves local `pnpm dev` now that production is same-origin. Remove it
  if that is not worth the exposure.

### 4. UI polish nobody has judged yet

The redesign follows opentechevents.org's language (tokens, header, buttons,
cards, dark code blocks, footer — the rule is in `CLAUDE.md`). Not yet looked
at with fresh eyes: mobile layout below 620px, the candidate-picker when a
page declares many feeds, and whether the source viewer should collapse very
long documents.

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
   look for the verdict in the dumped DOM.
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
