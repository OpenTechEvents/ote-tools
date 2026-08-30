# @opentechevents/validate

Validates OTE **Event** and **Feed** documents — each one against the spec
version it declares.

That last part is the whole design. Every OTE release pins its own version with
a `const` in `feed.schema.json`, so a perfectly valid 0.3 feed measured against
the 0.4 schemas fails with exactly one error, about `specVersion`, and nothing
else. Three tools in this ecosystem shipped that bug and told publishers with
healthy feeds that they were broken. So this package embeds **every published
version**, picks the one the document declares, and treats being on an
older-but-supported release as a notice rather than a defect. The policy —
last three minors supported, out-of-window means migrate, an unpublished
version means there is nothing to check against — lives in `src/versions.ts`,
mirroring the spec repo's decision rather than reinventing it.

Everything is embedded at build time (`pnpm gen`): each version's validity
schemas and (from 0.3 on) its recommended (quality) schemas as JSON data
(`src/generated/<vX.Y>/schemas.ts`), and the spec's real validator functions
Ajv can't run without — `customFormats`, `customKeywords`,
`annotationKeywords` — as vendored source (`src/validators.generated.ts`,
verbatim from `@opentechevents/schema`'s own code, not reimplemented). Nothing
is fetched, and nothing is imported from `@opentechevents/schema` at runtime —
it stays a devDependency, used only by `pnpm gen`. This matters because
`@opentechevents/validate` is also bundled for the browser (e.g. by
`apps/editor`'s esbuild build); `@opentechevents/schema`'s own package uses
Node's `createRequire` to load its JSON files, which breaks under
`platform: "browser"` — vendoring its logic at codegen time avoids dragging
that into every consumer's bundle.

The schemas are also **compiled** at build time, not just embedded: `pnpm gen`
runs Ajv in standalone mode and writes each version's validator code to
`src/generated/<vX.Y>/validators.compiled.ts`. Ajv's normal path builds those
functions with `new Function`, which is `eval` — a page running it needs
`script-src 'unsafe-eval'`, and pays for compiling the schemas on every load.
Neither is true here: the runtime carries no Ajv, only the generated code and
the formats and keywords it closes over (`src/compiled-scope.ts`).
`test/compiled-validators.test.ts` fails if any version's compiled output
drifts from its schemas, or if that scope stops matching what Ajv registered.

**Only the version a document needs is loaded.** The latest version is a
static import (so the synchronous API below costs what it always did); every
other version sits behind a dynamic `import()` in `src/generated/modules.ts`,
which a bundler turns into its own chunk. In `apps/validator` that is ~232 kB
eagerly and ~318 kB across three chunks that are fetched only when a document
of that vintage turns up.

> `package.json` pins an exact published version of `@opentechevents/schema`
> (never a local `link:`). When the spec releases, bump that pin, run
> `pnpm gen`, and review the generated diff — the guard tests fail until the
> re-embed happens (see `scripts/embed-schemas.mjs`). The version list itself
> is derived from the package's export map, so a release that adds `v0.5`
> cannot be half-adopted.

## API

### Judging a document somebody else published

```ts
import { validateDocument } from "@opentechevents/validate";

const report = await validateDocument(json, { kind: "feed" });
// {
//   valid: true,
//   checkedVersion: "0.3.0",     // the version the document declares
//   declaredVersion: "0.3.0",
//   verdict: { status: "outdated", version: "0.3.0" },
//   errors: [], recommendations: [ … ],
//   recommendedProfileChecked: true,   // false before 0.3.0: no profile existed
//   notices: ["This document declares OTE Spec 0.3.0 and was checked against …"],
//   overridden: false,
// }
```

`kind` is required — telling a feed from an event is a document-shape question
`@opentechevents/discover-feed` owns, and guessing here would silently apply
the wrong schema. `version` overrides the document's own declaration, which is
the migration rehearsal: *what would 0.4 break?*

`notices` never affect `valid`. A version outside the support window, or one
that was never published, is an `error` instead — see `src/versions.ts` and
`describeSpecVersion`.

### Judging a document this kit is writing

```ts
import { validateEvent, validateFeed } from "@opentechevents/validate";

const { valid, errors } = validateEvent(json);
// errors: [{ path: "location.geo.lat", message: "must be <= 90" }, …]
```

Synchronous, and always against the **latest** published version — the right
tool for a document being produced (an exporter, `build-feed`), and the wrong
one for a document somebody else published, which is what `validateDocument`
is for. `checkEventRecommended` / `checkFeedRecommended` are their
recommended-profile counterparts: a document that fails those is still valid;
treat them as warnings, never rejections.

Pure functions: they take an already-parsed document and touch neither disk
nor network. `errors` is `[]` when `valid` is `true`; each error carries a
readable `path` (`events[0].startDate`, `(document)` for the root) and a
human-readable `message`.

### Versions

```ts
import {
  classifySpecVersion,   // "current" | "outdated" | "out-of-window" | "unknown"
  describeSpecVersion,   // → { severity: "notice" | "error", message } | null
  loadValidators,        // one version's validators, loaded on demand and cached
  LATEST_VERSION,
  PUBLISHED_VERSIONS,
  SUPPORTED_VERSIONS,
} from "@opentechevents/validate";
```

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
