# @opentechevents/import-jsonld

Extracts the schema.org Events an HTML page exposes as
`<script type="application/ld+json">` (Meetup, Eventbrite, Luma, guild.host…)
and converts them into **partial** OTE event documents (v0.2), ready for an
organizer to review and complete.

Part of the [OpenTechEvents organizer kit](https://github.com/OpenTechEvents/ote-tools);
see [DESIGN.md](https://github.com/OpenTechEvents/ote-tools/blob/main/DESIGN.md)
for where importers fit ("Importar desde fuentes existentes").

## Install

```sh
npm install @opentechevents/import-jsonld
```

## Usage

```ts
import { htmlToEvents } from "@opentechevents/import-jsonld";

const { events, warnings } = htmlToEvents(pageHtml);
```

`htmlToEvents` is a pure function: no network, no DOM, no clock, never
throws — plain string and JSON processing, so it runs identically in the
browser (the editor's paste-the-HTML fallback for CORS-blocked sites) and in
Node. Like every OTE connector it **never invents data**: any field the page
did not carry — or OTE does not model — is absent from the event, and a
warning identifies it (`eventIndex` points into `events`, `field` names the
OTE field).

The events are partial on purpose — they have no `id` and usually lack
`timezone`. Completing them is the caller's job (the ote-tools editor does
it with a form that marks the missing fields).

## What counts as an Event

Blocks whose `@type` is `Event` or a subtype (`BusinessEvent`,
`SocialEvent`, `Festival`, `Hackathon`, anything `*Event`), given as a bare
name or a schema.org URL. Events are collected wherever they sit: top level,
arrays, `@graph`, or nested wrappers like `ItemList → ListItem → item`
(Luma/guild.host landings). Non-Event JSON-LD (Organization,
BreadcrumbList…) and malformed JSON blocks are skipped **without noise**;
only "the page has no Event at all" warns. The same event repeated across
blocks is deduplicated (by name + startDate + url).

## Mapping (schema.org → OTE v0.2)

| schema.org | OTE |
| --- | --- |
| `name` | `name` |
| `description` | `description` (flagged when the source truncated it — see below) |
| `url` | `url` (the editor derives an `id` proposal from it downstream) |
| `startDate` / `endDate` | `startDate` / `endDate` + `timezone` (see below) |
| `eventAttendanceMode` | `attendanceMode` (`Offline`→`in-person`, `Online`→`online`, `Mixed`→`hybrid`) |
| `eventStatus` | `status` (`EventScheduled`→`scheduled`, `EventCancelled`→`cancelled`, `EventPostponed`→`postponed`, `EventRescheduled`→`rescheduled`) |
| `location` `Place` | `location.venue` (name + streetAddress) and `location.geo` |
| `location` `VirtualLocation` | `location.onlineUrl` |
| `inLanguage` | `languages` |
| `keywords` | `tags` |

## Decisions worth knowing

- **Offsets are not timezones.** schema.org dates come as ISO 8601 with a
  UTC offset (`2025-10-25T08:30:00+02:00`); OTE wants local wall-clock time
  plus an IANA zone, and `+02:00` does not identify one (Madrid, Paris and
  Cairo all match at times). The local part is kept and `timezone` stays
  pending, with a warning. `Z` is the exception — UTC is a real IANA zone.
  Dates without any zone information get the same warning.
- **Truncated descriptions are flagged.** Meetup cuts the JSON-LD
  description short with an ellipsis; it is imported as-is plus a warning
  telling the organizer to complete it from the event page.
- **`eventStatus` values OTE does not model** (e.g. `EventMovedOnline`)
  yield no `status` + a warning — never a guess. Same for unknown
  `eventAttendanceMode` values.
- **Properties OTE does not model** (`image`, `organizer`, `offers`,
  `performer`) are flagged when present so the loss is visible, per the
  DESIGN.md rule: the import points out what it drops, field by field.
- **No `id` is ever derived.** An OTE id is a URI the organizer mints under
  their own domain; every event carries a warning saying so.
