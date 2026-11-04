# Changelog

All notable changes to `@opentechevents/validate` are documented here.

## 0.6.0

- **Implements OTE Spec 0.6.0**, embedding every published version
  (`src/generated/v0.1/` … `v0.6/`). 0.5.0 is the one with content — eight new
  fields (`speakers` with `affiliation`, `recordings`, `contributing`,
  `feed.covers`, `feed.alternates`, `partOf.offers`, `offers[].scope`) and the
  multi-part pricing model where a part omitting `offers` under a
  `partOf.offers` is covered by the set admission. 0.6.0 changes no schema at
  all; it carries four decisions (D039–D042).
- Two new custom keywords ship with it, `orderedCoverage` and
  `sharedOffersConsistent`, both reachable from the compiled validators
  without a hand edit.
- **The support window moved to {0.4, 0.5, 0.6}.** It is computed from the
  published list, so releasing two minors in one day slid it by itself. 0.3 is
  now out of window: still measured against its own schemas, with migration
  asked for separately.
- **CLI: `ote-validate` dispatches on the declared `specVersion`.** It used to
  call the latest-only API, so a document from any other release came back
  with findings measured against rules it never claimed.
  - **New exit code `3`**: "this release cannot judge that version", distinct
    from `1` "the document is invalid". Conflating the two is what reported a
    healthy feed as broken, and neither CI nor an agent could tell a version
    pin from a defect. `1` still wins when both occur.
  - Every verdict line names the version whose rules produced it, and flags a
    version with no recommended profile — a `✓` that does not say what it
    checked is worth less than it looks.
  - New flags: `--versions` (what this release can judge, for asking before
    submitting) and `--spec-version <x.y.z>` (the migration rehearsal).
  - `runCli` is async, because loading a version's validators is.
- Ajv's options come from `@opentechevents/schema`'s `ajvOptions` export
  instead of being copied into the codegen script.

Everything below was written against an unreleased 0.5.0 that never shipped —
`validate` on npm was 0.4.0 until now, so none of it has ever reached a
consumer. It is part of this release:

- **A document is now validated against the spec version it declares.** Every
  published version's schemas are embedded (`src/generated/<vX.Y>/`), not just
  the pinned one, and `validateDocument(json, { kind })` picks the right set.
  Before this, a valid 0.3 feed failed with one error about `specVersion` and
  nothing else — the same bug that was already fixed in the spec repo's
  `check-feeds.mjs` (PR #43) and `register-adopter.mjs` (PR #46). The validator
  page and the `/badge` endpoint were the third instance.
- **Support policy, mirrored from the spec repo** (`src/versions.ts`): the last
  three minors are supported, and being on a supported-but-older release is a
  `notice`, never an error. Outside the window it is an error that says to
  migrate and links that version's still-published schemas. A `specVersion`
  that is absent or was never published is an error too, listing the versions
  that exist — there are no rules to judge such a document by, so nothing is
  validated against a version it never claimed.
- New: `validateDocument`, `loadValidators`, `classifySpecVersion`,
  `describeSpecVersion`, `declaredSpecVersion`, `versionToCheck`,
  `isSupported`, `schemaUrl`, `PUBLISHED_VERSIONS`, `SUPPORTED_VERSIONS`,
  `LATEST_VERSION`, `SUPPORT_WINDOW_MINORS`, `VERSIONS_WITH_RECOMMENDED`.
- Each version's compiled validators load on demand and are cached per version
  (`src/loader.ts`), behind a dynamic `import()` so a bundler splits them: a
  browser downloads the latest version up front and an older one only when it
  meets a document that declares it.
- Unchanged and still synchronous: `validateEvent`, `validateFeed`,
  `checkEventRecommended`, `checkFeedRecommended`, `validateEventInFeed`. They
  check against the latest version, which is what a tool *producing* documents
  wants; their doc comments now say so instead of naming v0.4.
- The `specVersion` mismatch message names both versions — the one declared and
  the one checked against — since reaching it now means the two disagree on
  purpose (a hand-picked version, or the latest-only synchronous API).
  `formatAjvErrors` takes the version as a third argument so no message can
  cite a version other than the one that produced it.
- Versions before 0.3.0 have no recommended profile, and the absence is
  reported (`recommendedProfileChecked: false`) rather than passed off as
  "nothing to improve".
- Fixtures: `fixtures/versioned/` holds the version cases, including the real
  `corunajug.org` feed that prompted this. `invalid/event-old-specversion.json`
  moved there — a 0.3 document is not invalid, which was the point.

## 0.4.0

- Implements **OTE Spec 0.4.0**: `specVersion` is now `"0.4.0"`, and the
  embedded schemas come from `@opentechevents/schema@0.4.0`.
- `format: uri` became `format: iri` on the spec's URL fields, so an address
  with non-ASCII characters (`…/pycamp-españa`) is valid instead of being
  reported as a malformed URL. The `iri` validator is vendored from the spec by
  `pnpm gen` and reached from `src/compiled-scope.ts`; `ajv-formats` does not
  ship one.
- Images may be served over `http://` — 0.4.0 relaxed the https-only `MUST` to
  a `SHOULD`, so a single old poster no longer invalidates a whole feed. The
  https recommendation moved into the recommended profile.
- A document declaring an **older** `specVersion` than the one this package
  implements now gets its own message — *"is OTE Spec 0.3.0, an earlier release
  than the 0.4.0 this validator implements; set specVersion to "0.4.0" and
  check again"* — instead of the generic drift message, which stays for newer
  or unparseable versions and still points at upgrading this package. This
  package embeds exactly one `specVersion`, so a 0.3.0 document is still an
  error; it is now an error that says what to do about it.
- Reworded the messages that had stopped being true: none of them names a JSON
  Schema format the publisher cannot act on, and none claims images must be
  https. `formatAjvErrors` takes an optional second argument (the document) so
  it can read a failing value back out by its JSON Pointer.
- Validators are now compiled from the schemas at codegen time (Ajv standalone
  mode, `pnpm gen`) instead of being compiled at runtime. No `new Function` on
  import, so consumers no longer need `script-src 'unsafe-eval'`, and no Ajv in
  the bundle: `apps/validator`'s gzipped bundle drops from ~102 kB to ~78 kB.
  The public API is unchanged.

## 0.3.0

- Initial package release for OTE spec v0.3.
