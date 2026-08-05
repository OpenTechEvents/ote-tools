# @opentechevents/validate

Validates OTE **Event** and **Feed** documents against JSON Schema **v0.3**.
The two validity schemas are embedded at build time (`pnpm gen`, see
`src/schemas.generated.ts`) so they never need a runtime fetch. v0.3 also
requires registering real validator functions Ajv can't run without
(`customFormats`, `customKeywords`, `annotationKeywords`) — those are imported
directly from `@opentechevents/schema` at runtime instead (they can't be
embedded as data), which is why this package depends on it at runtime, not
just as a devDependency the way it did under v0.2.

> `@opentechevents/schema@0.3.0` isn't published to npm yet — v0.3 is still a
> draft in the sibling `opentechevents-spec` repo. `package.json` currently
> points at it via a local `link:` dependency; swap that for a real pinned
> version once 0.3.0 is released (see `scripts/embed-schemas.mjs`).

## API

```ts
import {
  validateEvent,
  validateFeed,
  checkEventRecommended,
  checkFeedRecommended,
} from "@opentechevents/validate";

const { valid, errors } = validateEvent(json);
// errors: [{ path: "location.geo.lat", message: "must be <= 90" }, …]

const { valid: complete, errors: warnings } = checkEventRecommended(json);
// checks the *recommended* (quality) profile — a document that fails this is
// still a valid OTE document; treat these as warnings, never rejections.
```

Pure functions: they take an already-parsed document and touch neither disk nor
network. `errors` is `[]` when `valid` is `true`; each error carries a readable
`path` (`events[0].startDate`, `(document)` for the root) and a human-readable
`message`.

## CLI

```
ote-validate <dir|file>
```

- File: validates that document.
- Directory: validates every `*.json` recursively (skips `node_modules` and
  hidden entries).
- Type detection: an object with an `events` array is a Feed; anything else is
  an Event.
- Output: `✓`/`✗` per file with indented errors, plus an `N/M valid` summary.
- Exit codes: `0` all valid · `1` some invalid · `2` usage or I/O error.

## Development

```
pnpm build   # tsc → dist/
pnpm test    # vitest against fixtures/
```
