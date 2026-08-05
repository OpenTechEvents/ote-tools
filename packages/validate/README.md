# @opentechevents/validate

Validates OTE **Event** and **Feed** documents against JSON Schema **v0.3**.
Everything is embedded at build time (`pnpm gen`): the two validity schemas
and two recommended (quality) schemas as JSON data
(`src/schemas.generated.ts`), and v0.3's real validator functions Ajv can't
run without — `customFormats`, `customKeywords`, `annotationKeywords` — as
vendored source (`src/validators.generated.ts`, verbatim from
`@opentechevents/schema`'s own code, not reimplemented). Nothing is fetched,
and nothing is imported from `@opentechevents/schema` at runtime — it stays a
devDependency, used only by `pnpm gen`. This matters because
`@opentechevents/validate` is also bundled for the browser (e.g. by
`apps/editor`'s esbuild build); `@opentechevents/schema`'s own package uses
Node's `createRequire` to load its JSON files, which breaks under
`platform: "browser"` — vendoring its logic at codegen time avoids dragging
that into every consumer's bundle.

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
