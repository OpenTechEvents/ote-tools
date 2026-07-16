# @opentechevents/build-feed

Assembles an OTE Feed (v0.2) from an organizer repo — `events/*.json` plus the
`feed` block of `ote.config.json` — validates it with
`@opentechevents/validate`, and exports it with the M2 exporters.

```ts
import { buildFeed } from "@opentechevents/build-feed";

const result = buildFeed({ config, events, now: new Date().toISOString() });
if (result.ok) {
  result.feed; // valid OteFeed, events sorted by startDate then id
} else {
  result.problems; // [{ file, path, message }] — every problem, not just the first
}
```

`buildFeed` is a pure function: no filesystem, no network, no clock (`now`
becomes the feed's `updatedAt`). The CLI does the I/O.

## What it does

1. Reads the `feed` block of `ote.config.json` (`title` and `license`
   required; `description`, `url`, `licenseUrl` optional). Other config keys
   (`profile`, `publish`…) are ignored here — they belong to other tools.
2. Assembles the feed: `specVersion: "0.2.0"`, config metadata, `updatedAt`,
   and the events sorted by `startDate` then `id` (stable output regardless
   of directory order).
3. Validates the **assembled feed** once and attributes every error back to
   its source file and field. Events are deliberately *not* validated as
   standalone documents: inside a feed they inherit `specVersion` and
   `license`, so a standalone check would wrongly demand a per-event license.
4. Checks what the schema cannot see across files: duplicate event `id`s.

An invalid event fails the whole build; the report names the file and the
field (e.g. `events/2026-06.json — startDate: must be a date…`).

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
