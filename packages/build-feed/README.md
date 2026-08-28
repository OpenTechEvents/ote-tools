# @opentechevents/build-feed

Assembles an OTE Feed (v0.4) from an organizer repo — `events/*.json` plus the
`feed` block of `ote.config.json` — validates it with
`@opentechevents/validate`, and exports it with the M2 exporters.

```ts
import { buildFeed, resolveEventInheritance } from "@opentechevents/build-feed";

const result = buildFeed({ config, events, now: new Date().toISOString() });
if (result.ok) {
  result.feed; // valid OteFeed, events sorted by startDate then id

  // Feed-level organizers/textLanguage/license may be inherited rather than
  // repeated on every event (schema-valid either way) — result.feed keeps
  // that inheritance implicit. Resolve it first before handing the feed to
  // an exporter that reads each event's fields directly (see below).
  const resolved = resolveEventInheritance(result.feed);
} else {
  result.problems; // [{ file, path, message }] — every problem, not just the first
}
```

`buildFeed` is a pure function: no filesystem, no network, no clock (`now`
becomes the feed's `updatedAt`). The CLI does the I/O.

## What it does

1. Reads the `feed` block of `ote.config.json`: `title` is required;
   `description`, `url`, `license`, `licenseUrl`, `textLanguage`,
   `organizers`, `translations` are optional. Other config keys (`profile`,
   `publish`…) are ignored here — they belong to other tools.
   - `license` is optional per D029: a feed may omit it as long as every
     event declares its own instead. This isn't checked here — the
     assembled feed's own validation (step 3) is what actually enforces it,
     since only it can see every event at once.
2. Assembles the feed: `specVersion` (sourced from `@opentechevents/validate`,
   never hardcoded), config metadata, `updatedAt`, and the events sorted by
   `startDate` then `id` (stable output regardless of directory order).
3. Validates the **assembled feed** once and attributes every error back to
   its source file and field. Events are deliberately *not* validated as
   standalone documents: inside a feed they inherit `specVersion` and
   (optionally) `license`, so a standalone check would wrongly demand a
   per-event license even when the feed already provides one.
4. Checks what the schema *used to* not see across files: duplicate event
   `id`s. v0.4's own schema now also catches this feed-wide (via a custom
   keyword), but with worse attribution (it can't name which two files
   clash) — this package's own check runs first and wins; the schema's
   redundant copy of the same violation is filtered out.

An invalid event fails the whole build; the report names the file and the
field (e.g. `events/2026-06.json — startDate: must be a date…`).

## Feed-level inheritance: `resolveEventInheritance`

`organizers`, `textLanguage` and `license` can be set once on the feed and
left off every event (replacement semantics: an event that *does* declare
its own value overrides the feed's entirely — never merged). `feed.json`
itself keeps that inheritance implicit (it's schema-valid either way, and
materializing it onto every event would just be noise) — but
`@opentechevents/export-ics` and `@opentechevents/export-rss` read each
event's fields directly, with no notion of feed-level inheritance of their
own. Call `resolveEventInheritance(feed)` before handing the feed to either
— the CLI already does this for `feed.ics`/`feed.xml` while still writing
the un-resolved feed to `feed.json`.

## CLI

```
ote-build-feed [root] [--out <dir>] [--check]
```

- `root` — directory containing `events/` and `ote.config.json` (default `.`).
- `--out <dir>` — output directory (default `<root>/dist`). Writes
  `feed.json`, `feed.ics` (via `@opentechevents/export-ics`) and `feed.xml`
  (RSS, via `@opentechevents/export-rss`).
- `--check` — validate only, write nothing. This is what the reusable
  `validate.yml` workflow runs on PRs.

Exit codes: `0` built (or check passed) · `1` invalid input (JSON, config or
events) · `2` usage or I/O error. All problems are reported in one run.
