# OTE conversion service (prototype)

A Cloudflare Worker that fetches public OTE documents, validates them against
embedded schemas, and converts them using the workspace exporters.

**Nothing here deploys itself.** `wrangler.jsonc` — the config every bare
`wrangler` command picks up — is the staging Worker, and it declares no route.
Production (`convert.opentechevents.org`) lives in `wrangler.production.jsonc`
and is reached only by running `deploy-convert.yml` by hand with
`target: production`. The properties that sentence depends on are asserted in
`test/hardening.test.ts` rather than described here, because a claim about a
deploy path is exactly the kind that stops being true quietly.

## Endpoints

URL-encode the entire source URL when placing it in a query parameter.

- `GET /ics?feed=<url>` returns `text/calendar` for subscription clients.
- `GET /rss?feed=<url>` returns `application/rss+xml`.
- `GET /schema?event=<url>` or `GET /schema?feed=<url>` returns an HTML page
  with a copyable JSON-LD script. `output=script` returns only the script as
  plain text; `output=json` returns JSON-LD as `application/ld+json`.
  Add `&id=<event-id>` to select exactly one event from a feed. The `id`
  is matched exactly as a string and is not fetched. An unknown id returns
  a non-cacheable 404. URL-encode both the feed URL and the event id.
- `GET /health` returns service health.
- `GET /feed-languages?feed=<url>` (or `event=<url>`) lists the text languages
  the document itself carries. The landing page uses it to offer only
  translations the publisher actually supplies.

Add `lang=<BCP-47 tag>` to request publisher-supplied translations, for
example `&lang=en` or `&lang=es-ES`. The exact tag is tried first, then its
primary language, then the original field. Translation is field-by-field;
partial translations may produce mixed-language output. We do not machine
translate. RSS formats dates in the requested locale (or the feed text language
when available) while retaining the event
wall time and zone. iCalendar keeps structured dates for the calendar client
to render in its own locale. The hosted converter expresses timed events in
UTC, resolving the publisher's time zone with the runtime's IANA time-zone
data; it retains the original zone in the iCalendar property `X-OTE-TIMEZONE`
on each timed event (a calendar property, not an HTTP header). This avoids requiring
`VTIMEZONE` for `TZID`, but generic ICS importers may not preserve the original
zone. All-day dates remain dates. Service-generated labels are available in English and Spanish; other locales use English labels.

Use precisely one source parameter. Validation uses the document's published
schema version, and **every version `@opentechevents/validate` embeds can be
converted** — which is every published one, including versions outside the
support window, because a document outside the window is still valid against
its own schemas. The list is derived, never written down here:

```sh
# Run from workers/convert (the package's exports map has no CJS main, so
# `node -p "require(...)"` fails here with ERR_PACKAGE_PATH_NOT_EXPORTED).
node --input-type=module \
  -e "import('@opentechevents/validate').then(m => console.log(m.PUBLISHED_VERSIONS.join(', ')))"
```

In 0.1 and 0.2, extensions were allowed to use names that gained different standard meanings in 0.3. The service ignores
unstandardized legacy extensions instead of guessing what they meant.

Schema output is a snapshot. A website build can request `output=script` or
`output=json` on each build to refresh it. Structured data should describe
content visible on the destination page; search engine eligibility depends on
additional requirements and is not guaranteed.

## How much one request converts

At most **1000 events** per request (`src/cap.ts`). Over that, the events kept
are the soonest that have not finished yet, and every output says what was
left out: the calendar description, the RSS channel description, a notice on
the schema page, and the `X-OTE-Events-Omitted` / `X-OTE-Events-Total`
response headers on all of them — `output=json` and `output=script` have
nowhere to put a sentence, and a build script must still be able to tell it is
holding part of a feed. Nothing is ever dropped silently, and a full feed is
one local export away (`@opentechevents/export-ics`, `@opentechevents/export-rss`).

The cap is a budget, not a property of the formats. What it is set from,
measured in this Worker on 2026-11-25, per event: `/ics` ≈0.7 ms of CPU (the
IANA resolution dominates), `/schema` ≈2.6 KB of response. Uncapped, a
6000-event feed cost 4.3 s and 15.6 MB, repeatable at 30 requests a minute per
IP. Capped, the same feed and a 20000-event one both answer in under a second
with a 0.68 MB calendar and a 2.6 MB schema page. Re-measure per format before
moving the number; the fixture-sized feeds in `test/cap.test.ts` show the
shape.

Fetching is bounded separately and earlier: 5 MB decoded, 60 s, three
redirects, each revalidated (`workers/validator/src/fetch-document.ts`).

## `<ote-subscribe>` points subscribers here by default

`apps/embed`'s subscribe widget builds `/ics` and `/rss` links from a
publisher's JSON feed whenever that publisher declared no ICS/RSS URL of
their own (issue #186, `apps/embed/src/subscribe-urls.ts`), which is the
common case in the public adopters registry — `apps/embed/CLAUDE.md` has the
command that counts it. So the traffic this
service sees is no longer only people who typed a URL into the landing page:
it is calendar clients and feed readers polling on **their** schedule, for as
long as a subscription lives, from pages the service never hears about.

That changes the operational reading of the two bounds above rather than the
numbers in them. The 15-minute shared cache TTL is what keeps repeat polling
of one popular feed cheap; the 30-requests-a-minute-per-IP limiter is what
bounds a page that mounts several widgets. Neither is a reason to move the
event cap — a visitor who subscribes through a generated link is converting
the same feed the landing page would. Re-measure before raising anything, and
note that `<ote-subscribe convert="off">` is the publisher-side opt-out if a
site would rather not send its visitors here at all.

## Caching and administration

Successful responses use a 15-minute shared cache TTL. Errors and
`cache=bypass` responses are `no-store`. The bypass forces a fresh conversion
through this Worker, but does not control caches at the source itself.
Calendar and RSS clients control their own polling intervals and may show a
change later than 15 minutes. Source URLs, including their query strings, are
visible to the Worker and may appear in platform request logs; use public
feeds without credentials in their URLs.

**`HEAD` is answered by the platform, not by this Worker.** Measured against
the deployment (2026-11-25): `HEAD /ics?feed=…` comes back with
`cf-cache-status: HIT`, the cacheable `s-maxage=900` directive and a
`content-length` equal to the whole body — Cloudflare serves it from the
cached `GET` entry and strips the body at the edge, so the Worker is never
invoked and never sees the method. The handler still answers a `HEAD` it does
reach (a cache miss) with `no-store` and no body, which is also why the
"an empty `text/calendar` is a silently broken subscription" concern cannot
bite from outside: a bodyless answer is never what gets stored.

**There is no purge endpoint.** There was one, behind a `PURGE_TOKEN`
secret, purging by cache tag — and it never once returned success:
`ctx.cache.purge()` answered `403 Unable to purge. Unauthorized` (measured
2026-09, re-read 2026-11-25), consistent with purge-by-tag being an
Enterprise feature. It also could not be executed by any test
(`crypto.subtle.timingSafeEqual` exists only in the Workers runtime), so a
wrong token answered 500 rather than 403 everywhere the suite can reach, and
its rate-limit token was spent before the token was checked. `cache=bypass`
covers the actual need — a fresh conversion now — needs no secret, and is
tested. Re-adding purge means a plan that supports it and a
`@cloudflare/vitest-pool-workers` test, in that order.

Cloudflare Workers metrics provide a starting point for usage, errors and
latency. Cache hits may bypass Worker code, so application-level counters
alone do not count all requests. Review Cloudflare's edge metrics and logging
retention and sampling before promising a particular usage breakdown.

## Development and release checklist

Build workspace dependencies before type-checking in a fresh checkout. Run
`pnpm --filter @opentechevents/convert-service test` and `typecheck`. Wrangler
can bundle with `wrangler deploy --dry-run` without deploying.

Before production: verify the rate-limit and Workers Cache configuration with
the target Cloudflare account; test real calendar subscriptions and RSS readers, including updates,
cancellations, all-day events and daylight-saving transitions; check official
fixtures and field mapping across supported versions; evaluate large-feed CPU
and memory limits and Cloudflare costs; choose the final hostname and deploy.
The shared download code imports the validator Worker's source directly
(`../../validator/src/fetch-document.ts` and friends) — a cross-package import
with no dependency declaring it, so nothing makes the two move together.
`fetchDocument` takes a `userAgent` so a publisher's access log can tell a
conversion from a validation; everything else about that boundary is still
owed an extraction into a package.

The JSON files in `fixtures/` are official examples from the OpenTechEvents
specification repository, used for compatibility regression coverage. See
`fixtures/LICENSE-spec.txt` for their MIT licence.
