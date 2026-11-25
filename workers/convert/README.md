# OTE conversion service (prototype)

A Cloudflare Worker that fetches public OTE documents, validates them against
embedded schemas, and converts them using the workspace exporters. The Worker
has a separate staging configuration and no production route configured.

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

Add `lang=<BCP-47 tag>` to request publisher-supplied translations, for
example `&lang=en` or `&lang=es-ES`. The exact tag is tried first, then its
primary language, then the original field. Translation is field-by-field;
partial translations may produce mixed-language output. We do not machine
translate. RSS formats dates in the requested locale (or the feed text language
when available) while retaining the event
wall time and zone. iCalendar keeps structured dates for the calendar client
to render in its own locale. The hosted converter expresses timed events in
UTC, resolving the publisher's time zone with the runtime's IANA time-zone
data; it retains the original zone in `X-OTE-TIMEZONE`. This avoids requiring
`VTIMEZONE` for `TZID`, but generic ICS importers may not preserve the original
zone. All-day dates remain dates. Service-generated labels are available in English and Spanish; other locales use English labels.

Use precisely one source parameter. Validation uses the document's published
schema version. Versions 0.1 through 0.6 are currently accepted, including versions outside
the validator's support window. In 0.1 and 0.2, extensions were allowed to
use names that gained different standard meanings in 0.3. The service ignores
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

**Staging limitation:** an authenticated purge reached Cloudflare, but
`ctx.cache.purge()` returned `403 Unable to purge. Unauthorized`. Purge is
not yet operational in the staging account; investigate before production.

The optional `PURGE_TOKEN` Worker secret enables `POST /purge?feed=<url>` (or
`event=<url>`), authenticated with `Authorization: Bearer <token>`. It purges
all cached output variants for the **exact source URL string** via Workers
Cache tags. Use a long randomly generated secret; do not put it in a URL or
commit it. Without the secret, purge is disabled. Purging cannot force a
calendar client or another intermediary to refresh. Purge and cache bypass
must be checked in the actual deployment environment before release.

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
The shared download code currently imports the validator Worker's source;
coordinate any extraction or concurrent changes with that Worker.

The JSON files in `fixtures/` are official examples from the OpenTechEvents
specification repository, used for compatibility regression coverage. See
`fixtures/LICENSE-spec.txt` for their MIT licence.
