# Handoff — traps, quirks and commands

Working notes for picking this up in a fresh session. Not part of the
published docs, and **not a to-do list**: what is pending lives in issues, and
what is a rule lives in `CLAUDE.md`. What stays here is the knowledge that
would be lost if the file went away — the traps that cost an afternoon, this
machine's quirks, and the commands.

**It is also scratch, so it gets cleared.** When a task ends, delete its notes
from here in the change that closes it, and keep only what outlives the task.
A section describing finished work is worse than no section — see the rule in
`CLAUDE.md` for why.

## Where things stand

Deliberately short, because every line of it expires. One command each:

```sh
# Which spec version this repo implements — BOTH lines: the pin can be a
# release behind what the spec has published. See the spec-pin bullet in CLAUDE.md.
grep '"@opentechevents/schema"' packages/validate/package.json
npm view @opentechevents/schema version

# Published packages and their versions (skips the private ones).
pnpm -r exec node -p \
  "const p=require('./package.json'); p.private ? '' : p.name + ' ' + p.version"

gh issue list -R OpenTechEvents/ote-tools   # what is open
gh pr list -R OpenTechEvents/ote-tools      # including Dependabot's
```

`validator.opentechevents.org` serves the
validator page, `/fetch` and `/badge` from one Worker;
`tools.opentechevents.org/validator/` sends a browser there with a
`<meta http-equiv="refresh">` page — it answers `200`, not a 3xx, which is
worth knowing before debugging it with `curl`. Deploys are automatic
on push (`deploy-validator.yml`, `deploy-tools.yml`); **npm publishing is
manual** (`publish.yml`, `workflow_dispatch`).

`opentechevents.org` uses Cloudflare DNS (nameservers `hunts` /
`violet.ns.cloudflare.com`). All GitHub Pages records are DNS-only on purpose —
proxying them breaks Pages' certificate issuance.

Read before touching the validator: `apps/validator/README.md`,
`workers/validator/README.md`, and the validator bullet in `CLAUDE.md`.

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
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless
   --dump-dom "http://localhost:PORT/?doc=…"` (it is not on `PATH`) and
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
8. **`refs/tags/v1` is what every organizer fork runs**, and it is pinned far
   behind `main` (`git rev-list --count v1..main` says how far). Moving it
   deploys to everyone at once, so it is its own decision — issue #66. Do not
   move it as a side effect of anything else.
9. **Two different local failures look like "the fetcher is broken".** `pnpm
   dev` serves static files only: without `OTE_FETCH_ENDPOINT` the relative
   `/fetch` hits esbuild's `404 - Not Found` in `text/plain` and the page
   reports a fetch-service error — it never reached the feed. And editing
   `index.html` while the dev server runs used to leave the served markup
   stale, so a bundle rebuilt against new elements threw at import and the
   page registered no listeners (the URL form then submits itself and CSP
   blocks it with `form-action 'none'`). `build.mjs` now watches the static
   files too; the messages name both causes.

10. **A revert check lies across a package boundary.** `CLAUDE.md`'s first
    verification check is "revert the fix at the headlined surface and watch
    it fail". Apps consume workspace packages through `dist/`, so reverting
    only the source and re-running the app's suite tests the **still-fixed
    build** and reports a false clean: `apps/embed` kept its whole suite green
    with `packages/preview-feed`'s pricing reverted, until
    `pnpm --filter @opentechevents/preview-feed build` ran in between. Revert,
    rebuild, then measure — and if a fix spans two packages, do it in both.

11. **A `502` from GitHub's merge endpoint can still have merged the PR.**
    During an Actions/Git partial outage (observed 2026-11-25) `gh pr merge`
    and `gh api -X PUT /repos/…/pulls/N/merge` returned `502 Server Error`
    and `GraphQL: Something went wrong` while the merge went through anyway,
    and `gh pr view --json state` kept answering `OPEN` after it. Check
    `git fetch && git log origin/main` before retrying, or you will merge
    twice and open a replacement PR for nothing. `gh pr create` fails the
    same way and does create nothing — retry that one.
12. **A local `wrangler deploy` from this session is refused by the harness**
    (the sandbox classifier blocks it), so deploying by hand needs the
    maintainer's own shell. The repo path is the workflow —
    `gh workflow run deploy-convert.yml` with `target: staging` or
    `production` — which also means a GitHub Actions outage blocks deploys
    and npm publishing alike. `wrangler deploy --dry-run` is allowed and does
    confirm the bundle builds.

## Verifying a release on npm — three things that will mislead you

`CLAUDE.md` says a fix is not shipped until the published artifact shows it.
Doing that check has its own traps:

1. **The registry lags the workflow** (observed 2026-11-24). `pnpm publish` printed
   `✅ Published …@0.6.1` for four packages and the registry listed none of
   them for about three minutes. Concluding "the publish failed" in that window
   is a false negative — wait and re-check before relaunching anything. The
   workflow is idempotent, so a real partial failure is safe to re-run.
2. **`npm view` serves you cache, and `--prefer-online` is not enough.** The
   reliable read is the packument itself:
   `curl -s https://registry.npmjs.org/@opentechevents%2Fexport-ics`.
3. **`npx --ignore-existing` no longer exists** (removed from npm; checked
   against npm 11.6.2, 2026-11). To make
   sure you are not running a cached copy of the old version, use
   `npm cache clean --force`, or name the exact version rather than the minor.

## Local environment

Node and pnpm come from Volta: `export PATH="$HOME/.volta/bin:$PATH"`.

`CLOUDFLARE_API_TOKEN` lives in the maintainer's shell profile and is **not**
in a non-interactive shell's environment; `source ~/.zshrc` first to deploy by
hand. That local token is broad; CI uses a separate, narrower one stored as
the `CLOUDFLARE_API_TOKEN` repository secret (Workers Scripts: Edit, Workers
Routes: Edit, Account Settings: Read).

Two workarounds that used to be needed here are **obsolete as of 2026-11** —
do not reach for them: `git` in `PATH` was a broken Xcode shim (it now resolves to
`/usr/local/bin/git` on its own), and `gh issue create`/`comment` used to die
with a Projects-deprecation GraphQL error (fixed in the `gh` upgrade; the
`gh api … --input body.json` route is still the fallback if it returns).

## Commands worth remembering

```sh
# Local development. URL mode needs the deployed fetcher and PORT=8000,
# which is the origin allowed in ALLOWED_ORIGINS (issue #67 proposes removing
# those entries — if this stops working, read it before debugging CORS).
OTE_FETCH_ENDPOINT=https://ote-validator.hhkaos.workers.dev PORT=8000 \
  pnpm --filter @opentechevents/validator dev

# Deploy by hand (builds the page first, then the Worker).
source ~/.zshrc && pnpm --filter @opentechevents/validator-service run deploy

# Everything CI runs.
pnpm install --frozen-lockfile && pnpm lint && pnpm build && pnpm typecheck && pnpm test
```

## Useful test subjects

- `https://communitybuilders.dev/events/feed.json` — a registered adopter's
  real feed, declaring a spec version **outside the support window** (0.3.0 as
  of 2026-11). The best single test for "support is not validity": it must
  come back valid, export, and show a green badge, with migration asked for
  separately. If they upgrade, the committed equivalent is
  `packages/validate/fixtures/versioned/feed-corunajug-0.3.0.json` — but
  re-stamp it per the support policy rather than assuming 0.3.0 stays the
  out-of-window example.
- `https://communitybuilders.dev/` — the page that declares that feed, as
  `application/feed+json`; discovery finds it anyway, and says the type is
  wrong.
- `https://opentechevents.org/` — declares no feed (the `ote+json` string on
  it is inside a code sample). Must report "not discovered", never "invalid".
- `packages/validate/fixtures/valid|invalid/` — the same corpus CI validates.
- `packages/validate/fixtures/versioned/` — documents that exist to pin
  *version handling* rather than spec rules: an absent `specVersion`, a
  never-published one, and several older releases. `fixtures/README.md` says
  what each is for; a document on the **latest** version lives in `valid/`,
  not here. Faster than crafting them by hand.
