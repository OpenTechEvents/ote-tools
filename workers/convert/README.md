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

## Caching and administration

Successful responses use a 15-minute shared cache TTL. Errors and
`cache=bypass` responses are `no-store`. The bypass forces a fresh conversion
through this Worker, but does not control caches at the source itself.
Calendar and RSS clients control their own polling intervals and may show a
change later than 15 minutes. Source URLs, including their query strings, are
visible to the Worker and may appear in platform request logs; use public
feeds without credentials in their URLs.

**Purge has never worked here** (measured 2026-09, re-read 2026-11-25): an
authenticated purge reached Cloudflare and `ctx.cache.purge()` answered
`403 Unable to purge. Unauthorized`. Nobody has established whether that is
the staging account, the plan, or the call. Until somebody does, treat
`POST /purge` as unproven and use `cache=bypass`, which needs no secret and
is covered by tests. What would change this line: a purge that returns
`{"success":true}` against a real deployment.

The optional `PURGE_TOKEN` Worker secret enables `POST /purge?feed=<url>` (or
`event=<url>`), authenticated with `Authorization: Bearer <token>`. It purges
all cached output variants for the **exact source URL string** via Workers
Cache tags. Use a long randomly generated secret; do not put it in a URL or
commit it. Without the secret, purge is disabled. Purging cannot force a
calendar client or another intermediary to refresh. Purge and cache bypass
must be checked in the actual deployment environment before release.

A `HEAD` answer is `no-store` on every endpoint that answers 200, not only
the conversions: it carries no body, and a shared cache that stored it under
the `GET` key would serve an empty `text/calendar` — a subscription that
silently shows nothing — or an empty `/adopters.js`, which is a landing page
with no working controls at all.

Cloudflare Workers metrics provide a starting point for usage, errors and
latency. Cache hits may bypass Worker code, so application-level counters
alone do not count all requests. Review Cloudflare's edge metrics and logging
retention and sampling before promising a particular usage breakdown.

## Development and release checklist

Build workspace dependencies before type-checking in a fresh checkout. Run
`pnpm --filter @opentechevents/convert-service test` and `typecheck`. Wrangler
can bundle with `wrangler deploy --dry-run` without deploying.

Before production: verify the rate-limit and Workers Cache configuration and
purge with the target Cloudflare account; configure a secret and a staging
route; test real calendar subscriptions and RSS readers, including updates,
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
