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
GET https://validator.opentechevents.org/health                → limits

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
- **Timeouts**: 5 s per hop, 10 s for the whole chain.
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
