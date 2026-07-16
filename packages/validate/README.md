# @opentechevents/validate

Validates OTE **Event** and **Feed** documents against JSON Schema **v0.2**
(vendored in [schemas/](schemas/), no runtime fetch).

## API

```ts
import { validateEvent, validateFeed } from "@opentechevents/validate";

const { valid, errors } = validateEvent(json);
// errors: [{ path: "location.geo.lat", message: "must be <= 90" }, …]
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
