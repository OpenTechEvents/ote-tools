# @opentechevents/validator-service

Cloudflare Worker serving **validator.opentechevents.org**: the validator page
and its fetch endpoint, on one origin. Also **the only component in this
monorepo with network access**.

The page comes from the `assets` binding (`apps/validator/dist`, built first by
this package's `deploy` script); the runtime serves it directly and only
non-file paths reach the script:

```
GET https://validator.opentechevents.org/                      → the page
GET https://validator.opentechevents.org/fetch?url=…           → the fetcher
GET https://validator.opentechevents.org/badge?doc=…           → an SVG verdict
GET https://validator.opentechevents.org/health                → limits
POST https://validator.opentechevents.org/check-urls           → are these URLs alive?

GET /fetch?url=https%3A%2F%2Fcomunidad.example%2Ffeed.json

200 {"ok":true,"finalUrl":"…","status":200,"contentType":"application/ote+json",
     "bytes":812,"redirects":[],"body":"{…}"}
400 {"ok":false,"code":"blocked-address","message":"…"}
```

## One origin, so CORS stops existing

Page and endpoint could have been separate deployments. Sharing an origin
removes a whole class of configuration: the page issues a *relative* request,
no cross-origin check happens, and its CSP says `connect-src 'self'` instead
of naming a host that must be kept in sync with an allowlist. `ALLOWED_ORIGINS`
now only covers callers that genuinely are elsewhere — the local dev server and
the legacy Pages path.

## Why the fetch endpoint exists

The validator's *upload a file* and *paste JSON* modes run entirely in the
browser against `@opentechevents/validate` — they need no backend and keep
working with this Worker down. The **URL mode** cannot: a browser may not
fetch a third-party document without CORS headers, and community feeds do not
send them. This is the smallest thing that unblocks that mode.

No database, no accounts, no authentication, no persistence. That is a design
decision, not a simplification: it removes half of the OWASP Top 10 by
construction — no SQL injection without SQL, no broken access control with
nothing to access — and concentrates the remaining risk in one place.

## `/check-urls`

```
POST /check-urls   {"urls": ["https://comunidad.example/img/poster.png", …]}

200 {"ok":true,"limits":{…},"results":[
      {"url":"…","state":"ok","status":200,"reason":"answered 200"},
      {"url":"…","state":"broken","status":404,"reason":"answered 404"},
      {"url":"…","state":"unverifiable","status":403,"reason":"answered 403 — …"}]}
```

The failure it exists for: a registered feed validated cleanly with every image
URL carrying a `www.` its server does not answer on. Valid document, nothing
renders, nobody notices.

Three rules hold it to being useful rather than noisy:

- **It never touches validity.** The page shows this apart from the verdict. A
  broken link is not a schema violation.
- **403 and 429 are not failures.** Much of the web answers 403 to anything
  that looks automated; reporting those as broken is precisely the false
  positive that was just removed from the ecosystem's daily health check. They
  come back as `unverifiable`, which the page renders differently and never
  counts as the publisher's problem. So do timeouts and 5xx.
- **Budgets are hard**: deduplicated, capped at 60 URLs per request with a
  concurrency limit, a per-URL timeout and a total budget; whatever is left
  over is reported as `skipped`, never as fine. Answers are cached per URL for
  five minutes, so two validations of the same feed do not hammer anyone.

`HEAD` first, then `GET` with `Range: bytes=0-0` — plenty of servers refuse
`HEAD`, and treating that refusal as a verdict would invent broken links. The
URL list comes from the page (so it works for uploaded and pasted documents
too) and every URL goes through the same SSRF checks as `/fetch`: a list from a
stranger is a list from a stranger, whatever document it claims to come from.

## The badge

`/badge?doc=<url>` answers an SVG with one word, so a community can put its
feed's status in its own README. It judges with `validateDocument`, against the
version the document declares — a badge measuring every feed against the newest
release would turn every supported-but-older feed in the ecosystem red, on
somebody else's README, for months after each spec release:

```markdown
[![OTE feed](https://validator.opentechevents.org/badge?doc=https%3A%2F%2Fcomunidad.example%2Ffeed.json)](https://validator.opentechevents.org/?doc=https%3A%2F%2Fcomunidad.example%2Ffeed.json)
```

The validator page builds that snippet for you next to the permalink, after a
URL check.

It runs the same two steps the page does, and keeps them apart for the same
reason: **`no feed found` is not `invalid`**. The states are `valid`,
`invalid`, `no feed found`, `several feeds` (the page declares more than one
and the badge refuses to pick, exactly as the UI does) and `unreachable`. The
state also travels as `x-ote-badge-state`, from that fixed vocabulary, so it
can be read with `curl` without parsing an image.

Two properties make this endpoint different from `/fetch`:

- **It is requested on someone else's schedule.** Every reader of a README
  asks for it, so every answer is cached — in the Cloudflare cache, shared
  across readers, and downstream via `Cache-Control` for browsers and GitHub's
  image proxy. A verdict lives an hour, `unreachable` five minutes, so a
  transient outage does not stick to a README. The cache key is the normalized
  `doc` URL alone: other query parameters and headers must not each buy their
  own outbound fetch. The per-IP rate limit is therefore spent **only on a
  cache miss**.
- **Its output is an image built from a stranger's document.** Nothing fetched
  is ever written into the SVG — every string it draws is a constant in
  `src/badge.ts`, the reason it needs no escaping to be safe. It is served
  with `nosniff` and `default-src 'none'; sandbox` like everything else here.

Freshness is therefore "within the hour", which is the honest promise for a
status somebody else's publishing changes.

## That remaining risk is SSRF

A public endpoint that fetches whatever URL a stranger passes *is*, by
default, a proxy into whatever the server can reach. Every rule below lives in
`src/ssrf.ts` as a pure function with a test:

- **Scheme allowlist**: `http` and `https` only. `file:`, `gopher:`, `ftp:`,
  `data:`, `blob:` refused.
- **Resolve first, judge the resolved IP** — never the hostname. The attacker
  owns their DNS zone, so `feed.attacker.example` can be an A record for
  `127.0.0.1`. Blocked: `127/8`, `10/8`, `172.16/12`, `192.168/16`,
  `169.254/16` (`169.254.169.254` is the cloud metadata endpoint and the
  classic target), CGNAT, multicast/reserved, `::1`, `fc00::/7`, `fe80::/10`,
  and IPv4-mapped spellings of all of them. One private answer rejects the
  whole name.
- **Redirects by hand**, max 3, each hop revalidated. A public URL that
  answers `302 → 169.254.169.254` defeats a check that ran once at the start.
- **No credentials**: URLs with embedded userinfo are refused rather than
  silently stripped; the outgoing request carries only `accept` and
  `user-agent`. No cookies, no authorization, nothing identifying the caller.
- **Non-HTTP ports** an HTTP client can still reach (25, 6379, 3306, …) are
  refused.

**Known residual risk — DNS rebinding.** A Worker has no socket-level API to
pin the connection to the address it just validated, so a resolver answer that
changes between check and connect is not fully excluded. What is left is
bounded by the runtime: Cloudflare's egress is the public internet, not a LAN
with anything on the other side. The rules above stay mandatory regardless —
the runtime reduces the impact of a mistake, not the need to write them.

## Resource exhaustion

- **5 MB cap applied while streaming**, never after reading the body:
  `Content-Length` is an assertion, not a fact. A 50 MB response is cut at the
  cap without being buffered (there is a test for exactly that).
- The cap counts **decompressed** bytes, which is what a decompression bomb
  inflates.
- **Timeouts**: 5 s per hop, 10 s for the whole chain. Deliberately shorter
  than a feed reader's (those poll in the background and can wait 30 s); here
  somebody is watching the page. The timeout message therefore names the limit
  it hit **and** points at the file and paste modes, which validate the same
  document in the browser without this service — a slow origin is the one
  failure here that is nobody's bug to fix from this side.
- **Rate limiting per IP** via the optional `RATE_LIMITER` binding
  (`wrangler.jsonc`). The Worker runs without it — production should not.

## Output is data, never markup

Responses are `application/json` with `nosniff`, `Content-Security-Policy:
default-src 'none'; sandbox` and `no-store`. The remote document travels as a
JSON *string* inside the envelope, so pointing a browser straight at this
endpoint cannot render or run somebody else's feed. The validator renders it
as text (`textContent`), never as HTML.

CORS is answered only for the origins in `ALLOWED_ORIGINS`. That is not a
security boundary — `curl` ignores CORS — it just keeps unrelated pages off
this endpoint's fetch budget.

## Development

```sh
pnpm --filter @opentechevents/validator-service test       # vitest, no network
pnpm --filter @opentechevents/validator-service typecheck
pnpm --filter @opentechevents/validator-service run deploy # builds the page, then wrangler deploy
```

`run deploy`, not `deploy`: pnpm has a built-in `deploy` command of its own,
and `pnpm --filter … deploy` hits that instead of this package's script.

Deployed by `.github/workflows/deploy-validator.yml` on push to main, which
needs a `CLOUDFLARE_API_TOKEN` repository secret. Hostnames:
`validator.opentechevents.org` (canonical), `fetch.opentechevents.org` (the
endpoint addressed as an API) and the `workers.dev` URL as a fallback. Custom
domains are declared in `wrangler.jsonc`, so a deploy re-asserts them; they
require opentechevents.org's zone to live in Cloudflare DNS.

`handleRequest(request, env, { fetchImpl, resolve })` takes its network as
parameters, which is why the SSRF tests — the ones that matter here — run
against a fake fetch and a fake resolver instead of touching anything real.

`wrangler dev` additionally needs `workerd`, whose install script is disabled
in `pnpm-workspace.yaml`'s `allowBuilds` (nothing in CI needs it). Flip it to
`true` locally if you want the local runtime.

## Why the page is not on GitHub Pages

The other tools are: `apps/*` are static bundles published by
`deploy-tools.yml` under `tools.opentechevents.org/<tool>/`, and they take a
`?repo=` context from the organizer's fork. The validator does not — it serves
anyone with a JSON document, which is why it earns its own hostname — and it
needs a server for URL mode anyway. Shipping the page with the Worker that
already had to exist costs one deploy and buys the same-origin property above.

`tools.opentechevents.org/validator/` stays as a redirect so shared links keep
working and permalinks have one canonical form.
