# @opentechevents/export-ics

Converts a **valid** OTE Feed (v0.2) into an iCalendar document (RFC 5545).

```ts
import { feedToIcs } from "@opentechevents/export-ics";

const ics = feedToIcs(feed); // string, ready to serve as text/calendar
```

`feedToIcs` is a pure function: no network, no filesystem, no clock. Output is
deterministic — the same feed always produces byte-identical ICS. It assumes
the feed is valid; validate first with `@opentechevents/validate`.

## CLI

```
ote-export-ics <feed.json> [output.ics]
```

Reads the feed, validates it, writes the ICS to `output.ics` (or stdout when
omitted). Exit codes: `0` exported · `1` invalid JSON or invalid feed · `2`
usage or I/O error.

## Mapping (OTE v0.2 → VEVENT)

| OTE | iCal |
| --- | --- |
| `id` | `UID` |
| `name` | `SUMMARY` |
| `description` | `DESCRIPTION` |
| `startDate` / `endDate` + `timezone` | `DTSTART` / `DTEND` (see below) |
| `url` (else `location.onlineUrl`) | `URL` |
| `location.venue` | `LOCATION` |
| `location.geo` | `GEO` |
| `tags` | `CATEGORIES` |
| `status` | `STATUS` (`scheduled`→`CONFIRMED`, `cancelled`→`CANCELLED`, `postponed`/`rescheduled`→`TENTATIVE`) |
| `updatedAt` | `LAST-MODIFIED` |
| feed `updatedAt` | `DTSTAMP` on every VEVENT (keeps the function pure) |
| feed `title` / `description` | `X-WR-CALNAME` / `X-WR-CALDESC` |

Decisions worth knowing:

- **Dates.** Timed events emit wall-clock values with `TZID=<IANA zone>`
  (`UTC` uses the `Z` form). **No `VTIMEZONE` is emitted**: generating one
  requires a timezone database, and mainstream clients resolve IANA TZIDs on
  their own.
- **All-day events** use `VALUE=DATE`. OTE `endDate` is inclusive; iCal
  `DTEND` is exclusive, so the export adds one day. Without `endDate`, `DTEND`
  is omitted (RFC default: one day).
- **Hybrid events.** `url` and `location.onlineUrl` both map to `URL`; the
  canonical page wins and the attend link is appended to `DESCRIPTION` as
  `Online: <url>` so it is never lost.
- **Dropped, not approximated**: `attendanceMode`, `languages`, `license`,
  `source` have no iCal equivalent and are omitted. Absent fields stay absent
  (e.g. no `STATUS` is invented when `status` is missing).
