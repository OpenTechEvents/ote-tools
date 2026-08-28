# @opentechevents/export-ics

Converts a **valid** OTE Feed (v0.4) into an iCalendar document (RFC 5545).

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

## Mapping (OTE v0.4 → VEVENT)

| OTE | iCal |
| --- | --- |
| `id` | `UID` |
| `name` | `SUMMARY` (`;LANGUAGE=<textLanguage>` when set) |
| `description` | `DESCRIPTION` (`;LANGUAGE=<textLanguage>` when set, literal Markdown source) + `X-ALT-DESC;FMTTYPE=text/html` (rendered HTML, see below) |
| `startDate` / `endDate` + `timezone` | `DTSTART` / `DTEND` (see below) |
| `url` (else `location.onlineUrl`) | `URL` |
| `location.venue` | `LOCATION` |
| `location.geo` | `GEO` |
| `tags` | `CATEGORIES` |
| `status` | `STATUS` (`scheduled`→`CONFIRMED`, `tentative`→`TENTATIVE`, `cancelled`→`CANCELLED`, `postponed`/`rescheduled`→`TENTATIVE`, `moved-online`→`CONFIRMED` + a DESCRIPTION note) |
| `organizers` | `ORGANIZER;CN=<name>:mailto:<email>` for the first organizer **with an email**; the rest degrade to `X-OTE-ORGANIZER:<name>` (RFC 5545 permits only one `ORGANIZER`) |
| `image` | `IMAGE;VALUE=URI;DISPLAY=BADGE:<url>` (RFC 7986) — first image only, `alt` has no home in iCalendar |
| `partOf` | `RELATED-TO;RELTYPE=PARENT:<partOf.id>` |
| `offers` / `cfp` / `eligibility` | No iCalendar structure exists for any of these (accepted total loss, per the spec's own mapping tables) — degraded to readable text appended to `DESCRIPTION`, plus `X-OTE-CFP-URL` / `X-OTE-ELIGIBILITY-TYPE` / `X-OTE-OFFER-URL` / `X-OTE-OFFER-PRICE` / `X-OTE-OFFER-CURRENCY` extension properties (only the first offer becomes an `X-OTE-OFFER-*` line) |
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
- **`ORGANIZER` is structurally a `mailto:` address.** Without one, nothing
  valid can be emitted for that organizer — so the first organizer that
  *has* an email becomes `ORGANIZER`, not unconditionally the first one; the
  rest (and everyone, if none has an email) degrade to `X-OTE-ORGANIZER`
  extension lines.
- **`moved-online` keeps the event published, as OTE requires**, but RFC
  5545 `STATUS` has no such value — it maps to `CONFIRMED` (the event is
  still happening) plus a `DESCRIPTION` note, so the one fact that matters
  ("this moved online") isn't silently lost the way a bare `CONFIRMED`
  would lose it.
- **Dropped, not approximated**: `attendanceMode`, `languages`, `license`,
  `source` have no iCal equivalent and are omitted. Absent fields stay absent
  (e.g. no `STATUS` is invented when `status` is missing).
- **`description` is plain text or Markdown (OTE spec)**, but RFC 5545
  `DESCRIPTION` is TEXT-only — it can't hold markup. `X-ALT-DESC;FMTTYPE=text/html`
  is the de facto (non-standard, but widely implemented — Outlook 2007+,
  Thunderbird/Lightning) extension for a rich-text alternative, so it carries
  the Markdown rendered to HTML. It's built from the same parts as
  `DESCRIPTION` (the `Online:`/moved-online note, `cfp`/`eligibility`/`offers`
  text), not just the description alone: Outlook ignores `DESCRIPTION`
  entirely once `X-ALT-DESC` is present, so nothing may exist only in one of
  the two. Raw inline/block HTML found inside the Markdown source is escaped
  rather than passed through live, so it can't smuggle real markup into a
  client that renders this fragment. Apple Calendar's support for
  `X-ALT-DESC` is inconsistent; Google Calendar ignores it and always shows
  plain-text `DESCRIPTION`, which is why that property always stays
  populated too.
