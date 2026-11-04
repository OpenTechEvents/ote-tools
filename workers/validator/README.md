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
- **Budgets are hard, and the platform's is the hardest.** A Worker
  invocation may make **50 subrequests**, and every outbound call counts: each
  `fetch`, each DNS lookup, and — the one that is easy to forget — each Cache
  API call. At ~4 per URL, the ceiling arrives at the eleventh, which is why
  this endpoint answered 500 for every real feed until #71. So subrequests are
  counted against a budget of 40, DNS is resolved once per hostname instead of
  once per URL, and `maxUrls` is **12**: a number one invocation can honour,
  rather than a promise. A caller with more URLs sends more requests — the
  page batches at 10. Whatever cannot be afforded comes back `skipped`, never
  as fine, and the endpoint answers 200 with partial results rather than
  failing. Answers are cached per URL for five minutes (a cache hit costs one
  subrequest instead of four), so two validations of the same feed do not
  hammer anyone.

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
and the badge refuses to pick, exactly as the UI does), `unreachable` and
`slow`. The state also travels as `x-ote-badge-state`, from that fixed
vocabulary, so it can be read with `curl` without parsing an image.

`slow` and `unreachable` are kept apart for the reason in #70: this image
lives in a publisher's README, and a feed that answers `200` in 51 s is not a
feed nobody can reach. Only the clock running out produces `slow`; a name that
does not resolve, nothing listening, or a 500 is `unreachable`, because there
is nothing at the other end to be slow. A feed that *is* valid and slow badges
`valid` — performance is not validity, and the page is where the seconds are
reported. Measured against the four cases that matter:

| Feed | Badge | Time |
| --- | --- | --- |
| Valid, slow origin (the adopter feed in #70) | `valid` | 23.7 s |
| Nothing listening on the port | `unreachable` | 8.1 s |
| Hostname does not resolve | `unreachable` | 0.1 s |
| Answers nothing at all past 60 s | `slow` | 60 s |

Resolving a badge can cost two fetches (a page, then the feed it declares), so
they share **one** 60 s budget rather than taking one each: a README reader's
connection must not be held for twice the ceiling this service advertises.

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

- **The connect probe runs after those checks, never instead of them**, and
  connects by hostname because the runtime will not usefully connect to an IP
  literal (above). It therefore learns exactly what the `fetch` on the next
  line would learn — whether something accepts a connection — and adds no
  reach the fetch does not already have.

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
- **Timeouts: 60 s, for the hop and for the whole chain alike.** Not a number
  chosen here — it is the one the rest of the ecosystem already settled on.
  The spec repo's daily health check and its adopter-registration bot both
  fetch with 60 s and retries, each after this same false negative was removed
  from it (spec PRs #43 and #46). At the previous 5 s/10 s this endpoint
  answered `unreachable` for `https://eventos.wiki/events.json` — a registered
  adopter's feed that answers `200` with ~554 KB in 23.6–51 s, consistently —
  while the bot that links here told that publisher their feed was valid
  (#70). Three tools, one feed, two answers.

  The hop and the chain carry the **same** budget deliberately. The normal
  case is a single hop and it has to be able to spend all 60 s, since that is
  what the measured feed needs; a redirect chain still cannot multiply the
  wait, because each hop takes only what the chain has left.

- **8 s to accept a connection, which is a different question from answering
  one.** A long download deadline must not become a long *connect* deadline,
  and `fetch` cannot tell the two apart: one `AbortSignal` covers the
  handshake, the origin thinking and the bytes moving alike. Measured against
  the runtime: a live host with a filtered port (`example.com:81`) spent the
  entire 60 s and came back reading **slow** — the mirror image of the false
  negative this issue is about, and a worse wait than the 10 s it replaced.

  So every hop opens a bare TCP connection first, under its own budget
  (`src/tcp-probe.ts`, one extra subrequest per hop). The discrimination is
  stark: the adopter feed accepts a connection in **0.1 s** and answers in
  23.6 s, while nothing-is-listening is established in 8. A host that proves
  something is listening earns the long clock; one that does not gets
  `no-connection` — and *not* the word "slow", because there is nothing there
  to be slow. Measured end to end: 60.0 s → **8.2 s**.

  Two things the runtime decided for us, both found by probing it rather than
  reading about it. **The probe connects to the hostname, not to the address
  the SSRF check validated**: `connect()` to an IP literal does not behave —
  `93.184.215.14:443` timed out at 6 s where `example.com:443` opened in 25
  ms, and an IPv6 literal is refused outright. And **`close()` is never
  awaited** on a socket that never opened, because it may not settle, which
  would hang the request past the very budget the probe exists to impose.

  **The probe fails open.** Anything other than a clean "nothing accepted a
  connection in time" is treated as inconclusive and the fetch proceeds as if
  no probe had run. It may shorten a hopeless wait; it must never be able to
  invent a failure for a feed that would have loaded.

- **One retry, and never for a timeout.** A reset connection, or a 502 from a
  shared host, is not a verdict about a feed, so a hop gets a second attempt
  (`maxAttempts: 2`) after a transport error or a 429/5xx — failures that
  arrive *fast*. 4xx is deterministic and is not asked twice. The retry is
  narrower than the health check's and the bot's on purpose: those run
  unattended on a schedule, whereas here somebody is watching a spinner, and
  having waited the full 60 s once, waiting it again turns a 60 s answer into
  a 120 s one that still says "slow" at the end.

- **The wording is part of the fix.** "Unreachable" is the wrong word for
  "did not finish inside our budget": to a publisher whose feed is valid and
  merely slow to generate it reads as an accusation. The timeout message names
  the budget, says plainly that this makes the *origin* slow and not the
  *feed* invalid, and points at the file and paste modes, which validate the
  same document in the browser without this service.

  And raising the clock is not the whole fix — a feed that takes 23.6 s to
  start answering still has something worth fixing. That is what the page's
  "How this was served" section reports (`apps/validator/src/lib/transport.ts`,
  #105): the gap between time-to-first-byte and total tells a publisher
  whether the cost is the origin thinking or the bytes moving. A slow feed now
  validates *and* is told it is slow; a dead one is still reported as dead.
  The two must not end up telling the same story.
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
