# Changelog

All notable changes to `@opentechevents/validate` are documented here.

## Unreleased

- **`resolveEventInheritance(feed)` and `INHERITED_FIELDS`**: each event's
  effective `organizers`/`textLanguage`/`license`/`contributing`, with the
  feed's defaults filled in. It used to live in
  `@opentechevents/build-feed`, which the exporters cannot depend on (it
  depends on them) — so `build-feed` and the hosted converter resolved
  inheritance while three published CLIs and Broadcast silently did not.
  `build-feed` re-exports it, so its API is unchanged. `INHERITED_FIELDS` is
  checked against the schema's own `x-inheritsFrom` annotations by a test, so
  a fifth inheritable field fails with its name rather than being dropped by
  four consumers.

- **The not-judged summary names its reason.** A kit fork's `events/*.json`
  were already reported per file as organizer-kit members, with the right
  command to judge them — and then the closing count said *"a spec version
  this release cannot check against (supported: …)"*, which for a file that
  declares no version describes something that never happened. It is the
  last line a non-technical organizer reads, so it is the one that decided
  what they thought was wrong. The summary now reports members and
  unjudgeable versions as separate counts, and a run with both says both.
  Exit codes are unchanged (#119).

- **`labelsFor(locale)`, `labelValue(value, locale)`, `LABELS`,
  `LABEL_LOCALES`**: the field names the exporters put around publisher
  content, in English and Spanish. One table, because `export-ics`,
  `export-rss` and `export-rss`'s parser all need the same words and all
  three already depend on this package. Not an i18n framework and not for
  publisher text, which this kit never machine translates.

## 0.6.1

**Support is no longer validity.** Two breaking changes to `DocumentReport`,
both of which exist because six consumers read the support window as a defect
in somebody's feed (#124):

- **`DocumentReport.support`** is new: a typed `SupportStatus` carrying the
  policy's reading of the declared version (`status`), what a caller must do
  with it (`action`: `none` / `inform` / `migrate` / `cannot-judge`), the
  sentence, and its links. **The policy message is no longer pushed into
  `errors`.** A document outside the support window with no schema violations
  is now `valid: true` — it was measured against its own schemas and it
  passed. Being outside the window is a fact about which releases this build
  keeps a code path for, not a finding about the document.
- **`DocumentReport.valid` is now `boolean | null`.** Null when nothing was
  measured, because the declared version was never published. It is not
  `false`: a document declaring `0.9.9` is an unanswerable question, not an
  invalid document, and the two call for opposite behaviour from a consumer.
  The type makes that choice unavoidable instead of letting a falsy check
  decide it silently.

Both are breaking for consumers of `DocumentReport`, and this still ships as a
**patch**. In this repo the minor names the spec version a release implements
(0.1.0, 0.3.0, 0.4.0, 0.6.0 — the gaps are spec versions that got no
implementation), so spending a minor on a fix would announce an OTE Spec 0.7.0
that does not exist. It costs nothing to do it this way and buys the thing the
fix is for: the `@0.6` pins in `skills/` are minor pins, so npm resolves them
to this patch and **every already-copied skill gets the fix without an edit**.
A minor would have stranded them all on 0.6.0.

The breaking half has no known external cost — the adopter registry lists no
live consumers of OTE documents, so nothing outside this monorepo reads
`DocumentReport`.

Migrating: anywhere you read `report.valid`, handle `null` first.
`if (!report.valid)` now treats "could not be judged" as "invalid", which is
the bug this release fixes.

The CLI changes with it (#117):

- The summary no longer collapses into one fraction. `N/M judged valid` counts
  only what was measured, and unjudged files get their own line — `0/3 valid`
  over three files nobody judged read as "three bad files".
- **Exit `0` now includes an out-of-window document**, and `3` narrows to
  "something could not be judged at all" — one such file is enough, even when
  the rest of the run was clean. That last part matters: a looser rule
  (exiting `0` whenever anything had been measured) let a typo'd `specVersion`
  pass CI next to a valid feed.
- The exit-code table in the README notes this narrowing of `3` explicitly
  rather than claiming the contract was never touched.
- A document with no `specVersion` under an `ote.config.json` is named as an
  organizer-kit feed member, and pointed at `ote-build-feed . --check`,
  instead of being told to add a `specVersion` the kit forbids writing by hand.
  Detection is for the message only — it never changes a verdict.

### Dependents deliberately not republished

`0.6.1` changed `DocumentReport.valid`, the CLI's counter and its exit codes.
Three published dependents still pin `0.6.0`, and that is a decision rather
than an oversight — `node .github/scripts/published-pins.mjs` reports them as
patch-level gaps (exit `1`), which is the state this is meant to leave. Each
one was checked against what it actually calls:

- **`build-feed`** reads `validateFeed`, whose `ValidationResult.valid` is a
  plain `boolean` and did not change. `src/index.ts:319` is its only read of
  it. It also pins `export-ics` / `export-rss` at `0.6.0`, which is the same
  case one level out: it uses their libraries (`feedToIcs`, `feedToRss`), and
  those `0.6.1` releases fixed how their **CLIs** read `DocumentReport.valid`.
- **`migrate`** reads `declaredSpecVersion`, `loadValidators`,
  `LATEST_VERSION` and `PUBLISHED_VERSIONS`. None of them is the
  `DocumentReport` path.
- **`import-ics`** imports `eventSchema` for its IANA timezone enum and never
  asks for a verdict. `import-jsonld` does not depend on this package at all.

So none of them exercises the path that moved, and republishing them would
have been noise. What makes this a record rather than a reassurance is that
the next release gets the same list from the sweep and has to answer it again:
the answer here is about `0.6.1`, not a standing exemption.

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
