# @opentechevents/export-jsonld

Converts **valid** OTE events (v0.4) into [schema.org](https://schema.org)
`Event` JSON-LD, so an organizer's own website can expose the events they
already publish as OTE to search engines — without maintaining the same data
twice. Implements
[opentechevents-spec#11](https://github.com/OpenTechEvents/opentechevents-spec/issues/11).

```ts
import { feedToJsonLd, toJsonLdScript } from "@opentechevents/export-jsonld";

const html = toJsonLdScript(feedToJsonLd(feed));
// <script type="application/ld+json">
// { "@context": "https://schema.org", "@graph": [ … ] }
// </script>
```

Every export is a pure function: no network, no filesystem, no clock, no DOM.
Output is deterministic — the same feed always produces the same document, in
Node and in the browser alike. The feed is assumed valid; validate it first
with `@opentechevents/validate`.

## API

| Function | Produces |
| --- | --- |
| `eventToJsonLd(event, options?)` | one standalone `Event` node, `@context` included |
| `feedToJsonLd(feed, options?)` | one document holding every event as a `@graph` — for a page that shows the events themselves |
| `feedToItemList(feed, options?)` | a schema.org `ItemList` — for a listing page whose entries link to their own detail pages |
| `toJsonLdScript(document, indent?)` | the pasteable `<script type="application/ld+json">` block |

`options`:

- `offsets` (default `true`) — derive a UTC offset for `startDate`/`endDate`
  from the event's IANA `timezone`. `false` emits the bare wall clock, which
  schema.org reads as local to the event's location.
- `plainTextDescription` (default `true`) — render a Markdown `description`
  to plain text. `false` passes the OTE value through byte for byte.

Two helpers used internally are exported too, since they are useful on their
own: `wallClockWithOffset(wallClock, timezone)` and
`markdownToPlainText(markdown)`.

## CLI

```
ote-export-jsonld [--item-list] [--json] <feed.json> [output.html]
```

Reads the feed, validates it, writes the JSON-LD to `output.html` (or stdout
when omitted). `--item-list` emits an `ItemList` instead of a `@graph`;
`--json` emits the bare document instead of a `<script>` block. Exit codes:
`0` exported · `1` invalid JSON or invalid feed · `2` usage or I/O error.

## Mapping (OTE v0.4 → schema.org/Event)

| OTE | schema.org |
| --- | --- |
| `id` | `@id` (a stable URI, not necessarily a fetchable page) |
| `url` | `url` |
| `name` | `name` |
| `description` | `description`, rendered to plain text (see below) |
| `startDate` / `endDate` + `timezone` | `startDate` / `endDate`, with the offset derived from the zone |
| `attendanceMode` | `eventAttendanceMode` (`Offline`/`Online`/`Mixed`) |
| `status` | `eventStatus` — except `tentative` (see below) |
| `location.venue` | `Place` with `name` **and** `address` (text) — unless it is a URL (see below) |
| `location.geo` | `Place.geo` → `GeoCoordinates` |
| `location.onlineUrl` | `VirtualLocation.url` |
| `languages` | `inLanguage` |
| `tags` | `keywords` |
| `organizers` | `organizer` → `Organization` (or `Person` when `type: "person"`) |
| `image` | `image`; `image[].alt` → `ImageObject.caption` |
| `offers` | `offers` → `Offer` (`price`, `priceCurrency`, `url`, `availability`, `validFrom`/`validThrough`) |
| `partOf` | `superEvent` |
| `cfp`, `eligibility`, `license`, `source`, `updatedAt`, `textLanguage` | **not emitted** (see below) |

Decisions worth knowing:

- **Wall clock + IANA zone → ISO 8601 offset.** OTE stores `2026-06-11T18:30`
  plus `Europe/Madrid`; schema.org wants the offset. Deriving `+02:00` from
  the zone and the date is a lookup in the runtime's own tz database
  (`Intl` — no tz dependency, so this stays browser-safe), not invented data.
  All-day events keep a bare date: a day has no single offset. When the zone
  is one the runtime does not know, the wall clock is emitted unchanged rather
  than with a guessed offset.
- **`tentative` has no schema.org equivalent.** Its `eventStatus` enum is
  Scheduled / Cancelled / Postponed / Rescheduled / MovedOnline. Mapping
  `tentative` onto `EventScheduled` would advertise an unconfirmed event to
  search engines as confirmed, so the property is simply absent — the
  connector convention: a connector never invents data.
- **`description` is plain text or Markdown (OTE spec); schema.org's is plain
  text.** Markdown is rendered down to its text, because
  `**Bold** intro with a [link](https://example.org)` in a search result is
  worse than no structured data at all. Raw HTML in the source is dropped —
  an inline tag leaves its surrounding prose intact, a block-level chunk goes
  whole.
- **A `venue` that is a URL is a meeting link, not a place.** Feeds imported
  from ICS routinely carry the join URL in `venue` (the organizer put it in
  `LOCATION`). Mapping it onto `Place.address` would claim a room exists at
  `https://meet.example/x` — so it becomes a `VirtualLocation` instead, and
  is dropped entirely when the event already declares an `onlineUrl`, rather
  than emitting the same link twice.
- **`venue` fills both `name` and `address`.** OTE's `venue` is one free-text
  string with no structure to split into `streetAddress`/`addressLocality`/
  `postalCode`; splitting on commas would invent an address the organizer
  never stated.
- **`cfp` and `eligibility` have no schema.org equivalent** and are dropped
  (accepted loss, symmetric with `@opentechevents/import-jsonld`'s own
  mapping). `license`, `source`, `updatedAt` and `textLanguage` are dropped
  because `schema.org/Event` does not define them — they belong to
  `CreativeWork`, not to an event.
- **`toJsonLdScript` escapes every `<` as `\u003c`.** Still valid JSON, and
  JSON-LD consumers decode it transparently — but an event whose description
  contains `</script>` can no longer end the script element early and inject
  the rest of itself as live markup.

## Google eligibility: `isOnlineOnly(event)`

Google's event rich results **require a physical location** — "Virtual
experiences that have no real-world component aren't supported". An
online-only event therefore never wins a Google rich result, however it is
marked up, and Google's Rich Results Test reports no eligible item for it.
That is a Google policy, not a defect in the markup: the JSON-LD is still
correct and still read by other search engines, AI assistants and calendar
tools.

`isOnlineOnly(event)` answers that question so a tool can say it up front
instead of letting the organizer discover it from a red validator. It is
true when the event has no `venue`, or when its `venue` is a URL.

## Related

- `@opentechevents/import-jsonld` — the inverse direction: schema.org `Event`
  JSON-LD found in a page → partial OTE events.
