# @opentechevents/import-ics

Converts an iCalendar (`.ics`) document into **partial** OTE event documents
(v0.4), ready for an organizer to review and complete.

Part of the [OpenTechEvents organizer kit](https://github.com/OpenTechEvents/ote-tools);
see [DESIGN.md](https://github.com/OpenTechEvents/ote-tools/blob/main/DESIGN.md)
for where importers fit ("Importar desde fuentes existentes").

## Install

```sh
npm install @opentechevents/import-ics
```

## Usage

```ts
import { icsToEvents } from "@opentechevents/import-ics";

const { events, warnings } = icsToEvents(icsText);

// Optional second argument:
icsToEvents(icsText, {
  // How to fill `timezone` for all-day events (VALUE=DATE), which iCalendar
  // structurally cannot carry a zone for. Default: the calendar's own
  // X-WR-TIMEZONE, else "UTC". Pass a real IANA zone to override both when
  // you know the organizer's actual locale.
  allDayTimezonePolicy: "Europe/Madrid",
  // Whether this .ics is itself publicly published. Only "public" imports
  // ORGANIZER's email into organizers[].email. Default: "unknown" (no email).
  sourceVisibility: "public",
});
```

`icsToEvents` is a pure function: no network, no filesystem, no clock, never
throws — unusable input yields `{ events: [], warnings: [...] }`. Like every
OTE connector it **never invents data**: any field the ICS did not (or cannot)
carry is simply absent from the event, and a warning identifies it
(`eventIndex` points into `events`, `field` names the OTE field).

Low-level iCalendar syntax parsing is handled by
[`ical.js`](https://github.com/mozilla-comm/ical.js); this package owns only
the OTE mapping and warnings.

The events are partial on purpose — they have no `id`, may lack `timezone`,
and are not valid OTE documents yet. Completing them is the caller's job
(the ote-tools editor does it with a form that marks the missing fields).

## Mapping (VEVENT → OTE v0.4)

| iCal | OTE |
| --- | --- |
| `SUMMARY` | `name` |
| `DESCRIPTION` | `description` |
| `DTSTART` / `DTEND` (or `DURATION`) | `startDate` / `endDate` + `timezone` (see below) |
| `LOCATION` | `location.venue` |
| `GEO` | `location.geo` |
| `URL` | `url` |
| `CATEGORIES` | `tags` |
| `STATUS` | `status` (`CONFIRMED`→`scheduled`, `CANCELLED`→`cancelled`, `TENTATIVE`→`tentative`) |
| `ORGANIZER` | `organizers[]` — `CN` → `name`; `mailto:` → `email`, only with `sourceVisibility: "public"` (see below) |
| `IMAGE` (RFC 7986, rare) | `image[]` |
| `LAST-MODIFIED` | `updatedAt` |

Empty property values (Google Calendar emits `DESCRIPTION:` for unset fields)
count as absent. iCalendar has no equivalent at all for `cfp`, `eligibility`,
`offers` or `partOf` — these are never set, and no warning is emitted (there's
nothing to warn about; the source format simply cannot express them).

## Decisions worth knowing

- **Dates.** Timed values keep their wall clock, truncated to `HH:MM` — OTE's
  `dateTime` is deliberately seconds-less ("the hour on a poster, never a
  technical instant"), so any seconds in the source are dropped as a format
  conversion, not a warned-about loss. `Z`-suffixed times map to
  `timezone: "UTC"`; a `TZID` is passed through only when it's a real IANA
  zone — checked against the same IANA enum `@opentechevents/validate`
  embeds from the v0.4 schema, not a shape regex (a regex would trust a
  plausible-looking but nonexistent zone like `Europe/Atlantida`). Windows
  zone names ("W. Europe Standard Time") and floating times (no `TZID`, no
  `Z`) yield **no timezone + a warning** — OTE requires IANA and guessing one
  would be inventing data.
- **All-day events** (`VALUE=DATE`) need a `timezone` in OTE too, but RFC 5545
  gives an all-day date no zone at all to read one from — a real gap in the
  spec today (documented upstream as
  [H003](https://github.com/OpenTechEvents/opentechevents-spec), unresolved).
  This importer's policy: use the calendar's own `X-WR-TIMEZONE` when present
  (a de facto Google/Outlook/Apple extension, not RFC 5545 itself), else
  `"UTC"`; always with a warning, since it's always an inference. Pass
  `allDayTimezonePolicy` to override with a known-correct zone. Separately,
  iCal `DTEND` is exclusive and OTE `endDate` is inclusive, so one day is
  subtracted; when that collapses onto `startDate` (a one-day event),
  `endDate` is omitted.
- **`DURATION`** (when there is no `DTEND`) is added to the start wall clock
  naively — an event crossing a DST change can be off by the shift, which is
  acceptable for an import the organizer reviews field by field.
- **Recurrence (`RRULE`/`RDATE`) is not expanded.** Faithful expansion needs a
  timezone database (DST-aware `BYDAY`/`UNTIL` math), and a wrong expansion
  would be invented data. The master occurrence is imported and a warning
  flags the recurrence; later occurrences must be added individually. Note
  that Meetup's feeds ship occurrences as separate VEVENTs already — this
  mostly affects Google Calendar masters.
- **HTML descriptions are converted to Markdown**, not copied raw. Some
  producers (Meetup, Outlook, and — verified against a real, public 871-VEVENT
  calendar — Google Calendar itself) put HTML in `DESCRIPTION`; OTE
  descriptions promise plain text or Markdown (another documented spec gap,
  [H007](https://github.com/OpenTechEvents/opentechevents-spec): the spec
  doesn't yet say what an importer facing HTML should do). This importer's
  policy: recognized tags are re-encoded (`<b>`→`**`, `<a>`→links, lists,
  headings, `<pre>`→fences), unknown tags stripped and entities decoded. The
  conversion is best-effort, so the field is flagged with a warning for
  review. Detection requires a recognized tag — a stray `a < b` in plain text
  never triggers it.
- **`ORGANIZER`'s email is only imported with `sourceVisibility: "public"`.**
  Its `CN` always maps to `organizers[].name`; the `mailto:` address is
  withheld by default (`"unknown"`, the default) — never assume a calendar's
  organizer consented to publishing their email just because it appears in a
  private or link-shared `.ics`. Pass `"public"` only when the source really
  is publicly published. No `CN` at all means no name to import from, so
  `organizers` stays absent (with a warning) rather than inventing one from
  the mailto address.
- **`UID` is not imported.** An ICS UID (`…@google.com`) is not an OTE `id`,
  which must be a stable URI the organizer mints under their own domain.
- **Discovery metadata ICS cannot model** — `id`, `attendanceMode`,
  `languages` — is warned about on every event, field by field, so no UI can
  quietly pretend the conversion was lossless. `license` and `source` are not
  warned about: the license is inherited from the feed, and provenance is for
  the importing tool to fill in (it knows the URL and the retrieval time; the
  ICS text does not). `cfp`, `eligibility`, `offers` and `partOf` have no
  iCalendar equivalent at all, so they're never set and never warned about
  either.
- Events keep the document's order; sorting and selection are UI concerns.
