# Writing the document: `id`, slug, `source`, and the minimum

Read this before writing any file. The three rules here are the ones a validator
cannot catch and that silently break the people consuming the feed.

## The minimum a standalone event needs

```json
{
  "specVersion": "0.6.0",
  "id": "https://pyalmeria.example/eventos/2026-06-async",
  "name": "PyAlmería — Introducción a async/await",
  "startDate": "2026-06-11T18:30",
  "timezone": "Europe/Madrid",
  "license": "CC-BY-4.0"
}
```

**`specVersion` comes from the tool, not from this example.** Run
`ote-validate --versions` and write the `latest` it names — the number above is what
this release of the skill ships with, and a document minted two minors behind falls
out of the support window on a release nobody here will be around for. If the two
disagree, the tool wins and the skill is stale: say so.

Inside an organizer-kit fork you write **less** than that: an event in `events/*.json`
inherits `specVersion` from the assembled feed, and may inherit `license`,
`organizers` and `textLanguage` from `ote.config.json`. Do not repeat an inherited
value on every event, and never hand-write `specVersion` in a fork — `ote-build-feed`
generates it.

`startDate` carries **no UTC offset**: a local wall time plus a separate IANA
`timezone`. The only timestamps with an offset in the whole format are
`source.retrievedAt` and `updatedAt`, which are real instants about the data rather
than about something happening to people in a place.

## `id`: mint once, never change

The `id` is a URI, and the convention in the kit is `<feed url>/events/<slug>`.

Consumers use it to decide *"is this the event I already have, or a new one?"* A
changed `id` is a duplicate in every calendar and directory that subscribed. So:

- If the file already exists and has an `id`, **preserve it byte for byte**, whatever
  else you are editing.
- Mint it under a domain the organizer controls. An `id` under somebody else's domain
  is an identity they can lose.
- Two events in one feed may never share an `id`; the validator enforces it.

For an event imported from an `.ics` with no URL of its own, the examples use
`<ics-url>#<UID>`. It is stable, and the spec itself flags the cost: it ties the
identity to the originating calendar. Prefer minting under the organizer's own domain
when they have one.

## Appending to a feed that already exists

The rules above mint the *first* event. When Step 0 found a healthy feed on the
organizer's own domain and the event they are asking about is **not** in it, the job
is an append, and the shape is decided by what is already there — not by the defaults
on this page.

**Read the existing entries before writing, and copy their conventions:**

- **The `id` pattern.** Take it from the entries, not from the convention above: a
  feed may mint `…/events/<slug>-<YYYY-MM-DD>` while the kit's default is
  `…/events/<slug>`, and both are fine. What is not fine is a feed where the eleventh
  event is spelled differently from the first ten — consumers diff ids, and a new
  shape reads as somebody else's event. Derive the pattern, including which host the
  ids use: a feed served from `corunajug.org` whose ids all say
  `https://www.corunajug.org/events/…` keeps the `www.`.
- **The file layout.** Where the existing events live is where the new one goes:
  `events/*.json` in a kit fork, or a new entry in the feed document when the feed is
  hand-maintained as one file. Do not introduce a second layout, and never a second
  feed file.
- **What is inherited.** In a kit fork the member inherits `specVersion`, and usually
  `license`, `organizers` and `textLanguage` from `ote.config.json`. In a
  single-file feed the members inherit from the feed object the same way — so do not
  repeat `license` on the event, and do not touch the feed's `specVersion`: migrating
  the feed is a separate decision the organizer has to make, and an older supported
  version is not a reason to make it now.
- **`updatedAt`.** The feed's `updatedAt` describes the data, so move it to now when
  you add an event. An event's own `updatedAt`, if the siblings carry one, follows the
  same rule.

Two things that are still the same: the new `id` must be unique in the feed (the
validator enforces it), and `source` is required if you imported the event from a page
or a calendar rather than being told about it directly.

## The slug: minted once, never regenerated

The file name is `events/<slug>.json`, with the slug built once from date + name
(`2026-11-07-biznagafest`). When the event's date later changes, **the file keeps its
name**. It will look stale — `2026-07-…json` for an August event — and that is the
intended trade: the public `id` is derived from the slug and must never move. The file
name is a mnemonic; the date that matters is `startDate` inside the document.

Never "tidy up" a file name.

## `source`: required when imported, absent when it is yours

- The organizer describing **their own** event: no `source`. They *are* the source.
- Imported or aggregated from anywhere else (an `.ics`, Meetup, another directory):
  `source` is **required**. Either `name` or `url` is enough — ideally both — and a
  `source` carrying neither is rejected.
- `source.license` (what the origin allows) and `license` (what this document allows)
  are different fields and need not match. Declaring a `license` grants no rights the
  source never gave: if the origin says nothing, ask the organizer rather than
  assuming a permissive value.
- `organizers` is not `source`. An event run by PyAlmería and picked up from Meetup has
  `organizers: [PyAlmería]` **and** `source: { name: "Meetup" }`.

## What never to fill in

`cfp` and `eligibility` have no equivalent in schema.org or iCalendar, so no importer
can produce them. Set them only from what the organizer tells you directly. Guessing
`eligibility: "open"` is exactly the invention the field exists to prevent.

`offers` likewise: "free" is a claim about the world, not a field the page implied.
