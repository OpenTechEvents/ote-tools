# @opentechevents/export-rss

Converts a **valid** OTE Feed (v0.3) into an RSS 2.0 document, one `<item>`
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

## Mapping (OTE v0.3 → RSS 2.0)

| OTE | RSS |
| --- | --- |
| feed `title` / `description` / `url` | channel `title` / `description` / `link` |
| feed `license` (+ `licenseUrl`) | channel `copyright`, **omitted when absent** (see below) |
| feed `textLanguage` | channel `language` |
| feed `updatedAt` | channel `lastBuildDate` |
| `id` | `guid isPermaLink="false"` |
| `name` | `title` (prefixed `[Tentative]` / `[Cancelled]` / `[Postponed]` / `[Rescheduled]` / `[Moved online]` when applicable) |
| `url` | `link` |
| `tags` | one `category` per tag |
| `organizers` | `author` (`email (name)`) for the first organizer **with an email**; otherwise `dc:creator` (name only) for the first organizer |
| `image` | `media:content`/`media:description` (first image only) — chosen over `<enclosure>` specifically because it can carry `image[].alt` without needing to infer a MIME type or byte length (both required by `<enclosure>`, neither modeled by OTE) |
| `offers` / `cfp` / `eligibility` / `partOf` | item `description` body, as unlabeled paragraphs (see below) |
| everything else | item `description` body (see below) |

Emitting `media:`/`dc:` content declares both namespaces (`xmlns:media`,
`xmlns:dc`) on the root `<rss>` element unconditionally, whether or not a
given feed actually uses them — simpler and harmless.

Decisions worth knowing:

- **RSS does not model events.** Dates, venue, online URL, attendance mode
  and non-scheduled status go in the item body as entity-encoded HTML,
  followed by the event's own description. `offers`/`cfp`/`eligibility`/
  `partOf` have no RSS structure either (accepted total loss, per the spec's
  own mapping tables) — folded into the same body **as unlabeled
  paragraphs**, not the labeled `<strong>Field:</strong>` style used for
  When/Where/Online/Attendance/Status, so this package's own reverse-parser
  (`parse.ts`, used by the preview app) — which only recognizes those five
  labels — reads them as part of the free-text description instead of
  silently dropping an unrecognized label.
- **`feed.license` is optional (D029).** When every event declares its own
  license instead of a shared feed-level one, there's no single value for
  channel `copyright` to state — RSS's channel model has no per-item
  license — so it's omitted rather than guessing.
- **No `pubDate`.** OTE has no publication instant and the exporter never
  invents data; `updatedAt` means *last modified*, which is not the same
  thing. The channel's `lastBuildDate` comes from the feed's `updatedAt`.
- **`guid` is never a permalink**: `id` is a stable URI, not necessarily a
  fetchable page. The clickable page is `link` (from `url`), omitted when the
  event has none.
- **`author` is structurally an email address** (RSS 2.0's own definition);
  without one, `dc:creator` (Dublin Core, name-only) is the fallback — same
  reasoning as `@opentechevents/export-ics`'s `ORGANIZER`.
- **Cancelled and moved-online events stay published**, marked in the title
  and body — same rationale as the spec: removing them would leave dead
  entries downstream. Unlike the iCal exporter, RSS's `status` text is free-form
  here, so `moved-online` needs no special-casing beyond the title prefix —
  the word itself already survives in the body.
