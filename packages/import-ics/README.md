# @opentechevents/import-ics

Converts an iCalendar (`.ics`) document into **partial** OTE event documents
(v0.2), ready for an organizer to review and complete.

```ts
import { icsToEvents } from "@opentechevents/import-ics";

const { events, warnings } = icsToEvents(icsText);
```

`icsToEvents` is a pure function: no network, no filesystem, no clock, never
throws — unusable input yields `{ events: [], warnings: [...] }`. Like every
OTE connector it **never invents data**: any field the ICS did not (or cannot)
carry is simply absent from the event, and a warning identifies it
(`eventIndex` points into `events`, `field` names the OTE field).

The events are partial on purpose — they have no `id`, may lack `timezone`,
and are not valid OTE documents yet. Completing them is the caller's job
(the ote-tools editor does it with a form that marks the missing fields).

## Mapping (VEVENT → OTE v0.2)

| iCal | OTE |
| --- | --- |
| `SUMMARY` | `name` |
| `DESCRIPTION` | `description` |
| `DTSTART` / `DTEND` (or `DURATION`) | `startDate` / `endDate` + `timezone` (see below) |
| `LOCATION` | `location.venue` |
| `GEO` | `location.geo` |
| `URL` | `url` |
| `CATEGORIES` | `tags` |
| `STATUS` | `status` (`CONFIRMED`→`scheduled`, `CANCELLED`→`cancelled`) |
| `LAST-MODIFIED` | `updatedAt` |

Empty property values (Google Calendar emits `DESCRIPTION:` for unset fields)
count as absent.

## Decisions worth knowing

- **Dates.** Timed values keep their wall clock. `Z`-suffixed times map to
  `timezone: "UTC"`; a `TZID` is passed through only when it looks IANA
  (`Area/Location`). Windows zone names ("W. Europe Standard Time") and
  floating times (no `TZID`, no `Z`) yield **no timezone + a warning** — OTE
  requires IANA and guessing one would be inventing data.
- **All-day events** (`VALUE=DATE`): iCal `DTEND` is exclusive, OTE `endDate`
  is inclusive, so one day is subtracted. When that collapses onto
  `startDate` (a one-day event), `endDate` is omitted.
- **`DURATION`** (when there is no `DTEND`) is added to the start wall clock
  naively — an event crossing a DST change can be off by the shift, which is
  acceptable for an import the organizer reviews field by field.
- **Recurrence (`RRULE`/`RDATE`) is not expanded.** Faithful expansion needs a
  timezone database (DST-aware `BYDAY`/`UNTIL` math), and a wrong expansion
  would be invented data. The master occurrence is imported and a warning
  flags the recurrence; later occurrences must be added individually. Note
  that Meetup's feeds ship occurrences as separate VEVENTs already — this
  mostly affects Google Calendar masters.
- **HTML descriptions are converted to Markdown.** Some producers (Meetup,
  Outlook) put HTML in `DESCRIPTION`; OTE descriptions are plain text or
  Markdown, so recognized tags are re-encoded (`<b>`→`**`, `<a>`→links,
  lists, headings, `<pre>`→fences), unknown tags stripped and entities
  decoded. The conversion is best-effort, so the field is flagged with a
  warning for review. Detection requires a recognized tag — a stray
  `a < b` in plain text never triggers it.
- **`STATUS:TENTATIVE`** has no unambiguous OTE equivalent (OTE splits it
  into `postponed`/`rescheduled`), so `status` stays absent + warning.
- **`UID` is not imported.** An ICS UID (`…@google.com`) is not an OTE `id`,
  which must be a stable URI the organizer mints under their own domain.
- **Discovery metadata ICS cannot model** — `id`, `attendanceMode`,
  `languages` — is warned about on every event, field by field, so no UI can
  quietly pretend the conversion was lossless. `license` and `source` are not
  warned about: the license is inherited from the feed, and provenance is for
  the importing tool to fill in (it knows the URL and the retrieval time; the
  ICS text does not).
- Events keep the document's order; sorting and selection are UI concerns.
