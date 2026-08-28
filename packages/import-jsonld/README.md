# @opentechevents/import-jsonld

Extracts the schema.org Events an HTML page exposes as
`<script type="application/ld+json">` (Meetup, Eventbrite, Luma, guild.host…)
and converts them into **partial** OTE event documents (v0.4), ready for an
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

// Optional second argument:
htmlToEvents(pageHtml, {
  // How to fill `timezone` for all-day events (a date-only startDate), which
  // schema.org gives no timezone data for at all. Default: "UTC". Pass a
  // real IANA zone to override when you know the event's actual locale.
  allDayTimezonePolicy: "Europe/Madrid",
});
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

## Mapping (schema.org → OTE v0.4)

| schema.org | OTE |
| --- | --- |
| `name` | `name` |
| `description` | `description` (flagged when the source truncated it — see below) |
| `url` | `url` (the editor derives an `id` proposal from it downstream) |
| `startDate` / `endDate` | `startDate` / `endDate` + `timezone` (see below) |
| `eventAttendanceMode` | `attendanceMode` (`Offline`→`in-person`, `Online`→`online`, `Mixed`→`hybrid`) |
| `eventStatus` | `status` (`EventScheduled`→`scheduled`, `EventCancelled`→`cancelled`, `EventPostponed`→`postponed`, `EventRescheduled`→`rescheduled`, `EventMovedOnline`→`moved-online`) |
| `location` `Place` | `location.venue` (name + streetAddress) and `location.geo` |
| `location` `VirtualLocation` | `location.onlineUrl` |
| `inLanguage` | `languages` |
| `keywords` | `tags` |
| `organizer` | `organizers[]` — `name`, `url`, `email` (see below), `@type: Person`→`type: "person"` |
| `image` (bare string or `ImageObject`) | `image[]` — `ImageObject.caption` becomes `alt` |
| `offers` | `offers[]` — `price`, `priceCurrency`→`currency`, `url`, `availability` (`InStock`→`in-stock`, `SoldOut`→`sold-out`), `validFrom`/`validThrough`→`opensAt`/`closesAt` (only when they carry a UTC offset — see below) |
| `superEvent` | `partOf` — only when it carries a usable id (its own `@id` or `url`) |

`cfp` and `eligibility` have no schema.org equivalent at all, so this
importer never sets them.

## Decisions worth knowing

- **Offsets are not timezones.** schema.org dates come as ISO 8601 with a
  UTC offset (`2025-10-25T08:30:00+02:00`); OTE wants local wall-clock time
  plus an IANA zone, and `+02:00` does not identify one (Madrid, Paris and
  Cairo all match at times). The local part is kept (truncated to `HH:MM` —
  OTE's `dateTime` is deliberately seconds-less) and `timezone` stays
  pending, with a warning. `Z` is the exception — UTC is a real IANA zone.
  Dates without any zone information get the same warning.
- **All-day events (a date-only `startDate`) still need a `timezone` in
  OTE**, but schema.org gives no timezone data for one at all — unlike
  iCalendar, there's no calendar-level hint to fall back to (see
  `@opentechevents/import-ics`'s analogous `X-WR-TIMEZONE` policy). This
  importer's policy: default to `"UTC"`, always with a warning since it's
  always an inference; pass `allDayTimezonePolicy` to override with a
  known-correct zone.
- **Truncated descriptions are flagged.** Meetup cuts the JSON-LD
  description short with an ellipsis; it is imported as-is plus a warning
  telling the organizer to complete it from the event page.
- **`eventStatus`/`eventAttendanceMode` values OTE does not model** yield no
  `status`/`attendanceMode` + a warning — never a guess.
- **`organizer` email is imported directly, no visibility gate.** Unlike
  `@opentechevents/import-ics` (where a private or link-shared `.ics` might
  expose an email its owner never meant to publish), this connector's input
  is always a page the user is viewing in a browser — a public page by
  construction — so there's no equivalent privacy concern to gate on.
- **`offers[].opensAt`/`closesAt` require a UTC offset.** They're OTE
  *instants*, unlike `startDate`'s wall clock — a schema.org `validFrom`/
  `validThrough` with no offset can't become one without inventing data, so
  it's left absent + warned instead.
- **`superEvent` needs a real id to become `partOf`.** `partOf.id` is
  required and must be a URI; a bare name with no `@id` or `url` isn't
  enough to build one without inventing data.
- **`cfp`, `eligibility` and `performer`** have no schema.org equivalent at
  all (`performer` specifically has no OTE field to map to), so none of them
  are ever set; `performer`'s presence is still flagged as unmodeled, since
  unlike the other two it's a real schema.org property being silently
  dropped.
- **No `id` is ever derived.** An OTE id is a URI the organizer mints under
  their own domain; every event carries a warning saying so.
