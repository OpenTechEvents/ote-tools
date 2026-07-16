# @opentechevents/export-rss

Converts a **valid** OTE Feed (v0.2) into an RSS 2.0 document, one `<item>`
per event.

```ts
import { feedToRss } from "@opentechevents/export-rss";

const rss = feedToRss(feed); // string, ready to serve as application/rss+xml
```

`feedToRss` is a pure function: no network, no filesystem, no clock. Output is
deterministic — the same feed always produces byte-identical XML. It assumes
the feed is valid; validate first with `@opentechevents/validate`.

## CLI

```
ote-export-rss <feed.json> [output.xml]
```

Reads the feed, validates it, writes the RSS to `output.xml` (or stdout when
omitted). Exit codes: `0` exported · `1` invalid JSON or invalid feed · `2`
usage or I/O error.

## Mapping (OTE v0.2 → RSS 2.0)

| OTE | RSS |
| --- | --- |
| feed `title` / `description` / `url` | channel `title` / `description` / `link` |
| feed `license` (+ `licenseUrl`) | channel `copyright` |
| feed `updatedAt` | channel `lastBuildDate` |
| `id` | `guid isPermaLink="false"` |
| `name` | `title` (prefixed `[Cancelled]` / `[Postponed]` / `[Rescheduled]` when applicable) |
| `url` | `link` |
| `tags` | one `category` per tag |
| everything else | item `description` body (see below) |

Decisions worth knowing:

- **RSS does not model events.** Dates, venue, online URL, attendance mode
  and non-scheduled status go in the item body as entity-encoded HTML,
  followed by the event's own description.
- **No `pubDate`.** OTE has no publication instant and the exporter never
  invents data; `updatedAt` means *last modified*, which is not the same
  thing. The channel's `lastBuildDate` comes from the feed's `updatedAt`.
- **`guid` is never a permalink**: `id` is a stable URI, not necessarily a
  fetchable page. The clickable page is `link` (from `url`), omitted when the
  event has none.
- **Cancelled events stay published**, marked in the title and body — same
  rationale as the spec: removing them would leave dead entries downstream.
