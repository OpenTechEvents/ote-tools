# unblock upstream, move the pin, regenerate

**Goal:** `packages/validate` compiles OTE Spec 0.4.0 from a real registry
version of `@opentechevents/schema`, with all three generated modules
regenerated and the guard tests green. Nothing else in the repo changes yet.

**Status:** done (2026-08-28). Upstream SPDX fix was already committed
(`6026f54`); the release was tagged `schema-v0.4.0` from it and
`@opentechevents/schema@0.4.0` is on npm — so no `0.4.1` was needed, 0.4.0
never shipped with the bad enum. Pin moved, all three modules regenerated,
`compiled-scope.ts` needed no hand-edit, stale `TEMPORARY:` comment rewritten.
The 24 test failures this exposed are listed in
[session 2](session-2-validate-messages-and-fixtures.md).

## 1. Fix the SPDX enum upstream (blocker)

In `../opentechevents-spec`, `spec/v0.4/event.schema.json` has:

```
"copyleft-next-0.4.0",     ← does not exist in the SPDX License List
"copyleft-next-0.3.1",
```

v0.3 has `copyleft-next-0.3.0` there. The 0.4.0 release bumped the version
string across the file and hit the license list with it. Consequences if it
ships: a feed licensed `copyleft-next-0.3.0` is reported invalid, and an
invented id validates.

Steps (upstream repo):

1. Re-run the generator rather than hand-patching, so nothing else silently
   drifted: `node scripts/update-licenses.mjs` (check its actual name/flags).
2. Diff `spec/v0.4/event.schema.json` against `spec/v0.3/event.schema.json` and
   confirm the only remaining differences are the intended ones: `$id`,
   `specVersion` const/examples, `uri` → `iri`, the image `^https://` →
   `^https?://` pair, description prose, and `CHANGES.log` →
   `docs/history/CHANGES.log` in `$comment`s.
3. Same sweep on `feed.schema.json`, `event.recommended.schema.json`,
   `feed.recommended.schema.json` — look for any other value that a blanket
   version replace could have caught (examples, `$comment`s, enum members).
4. Open the fix as its own upstream PR/issue. If it lands after the release, the
   spec needs `0.4.1`, and **this repo pins that instead of 0.4.0**.

## 2. Publish the spec package (blocker)

`npm view @opentechevents/schema version` must return the version this repo is
about to pin. Until it does, do not change `packages/validate/package.json` —
the `link:../../../opentechevents-spec` trick described in
`scripts/embed-schemas.mjs`'s header is documented as temporary and left a stale
comment behind last time; do not reintroduce it.

If publishing is out of scope for the person doing this session, stop here and
hand back: everything downstream depends on the pin.

## 3. Move the pin and regenerate

```sh
pnpm --filter @opentechevents/validate add -D @opentechevents/schema@<version>
pnpm --filter @opentechevents/validate gen   # re-embeds AND recompiles
pnpm build && pnpm test
```

Review the generated diff by hand, do not just accept green:

- `src/schemas.generated.ts` — `specVersion` is `"0.4.0"`; `"format": "uri"`
  survives only where the spec intends it (nowhere for HTTP(S) fields);
  `copyleft-next-0.3.0` is present and `copyleft-next-0.4.0` is not.
- `src/validators.generated.ts` — `customFormats` now vendors the spec's `iri`
  validator (`isIri`, an `encodeURI` + `new URL` check that rejects control
  chars, `<`, `>` and `"`). Confirm its source text arrived verbatim.
- `src/validators.compiled.generated.ts` — the standalone ajv output references
  `formats["iri"]`, i.e. the compiled code reaches the new format through
  `src/compiled-scope.ts`.

## 4. compiled-scope.ts

`src/compiled-scope.ts` merges `fullFormats` from `ajv-formats` with the spec's
`customFormats`. **`ajv-formats` does not ship an `iri` format** — the only
reason `iri` resolves at all is that the spec exports it as a custom format and
the codegen vendors it. Expected outcome: no hand-edit needed. If codegen or the
guard test complains that `iri` is unreachable, that failure is the codegen
doing its job — fix the scope, never route around it.

## 5. Clean up the stale codegen comment

`scripts/embed-schemas.mjs` still carries a `TEMPORARY:` block saying 0.3.0 is
unpublished and the dependency points at `link:…`. Both statements are already
false. Rewrite it to describe the real flow (pinned registry version, Dependabot
bump, `pnpm gen`, guard tests).

## Done when

- [ ] Upstream SPDX enum fixed (or confirmed a non-issue) and the version this
      repo will pin is on npm.
- [ ] `grep '"@opentechevents/schema"' packages/validate/package.json` shows the
      new version, and `npm view @opentechevents/schema version` matches.
- [ ] The three generated modules regenerated and reviewed line by line.
- [ ] `pnpm build && pnpm test` green — expect **failures in later sessions'
      territory to appear here first** (fixtures asserting `"0.3.0"`, messages
      asserting `uri`). Record which tests fail and hand the list to session 2
      rather than papering over them; only session 1's own guard tests
      (`test/schemas-generated.test.ts`, `test/validators-generated.test.ts`,
      `test/compiled-validators.test.ts`) must be green to close this session.
- [ ] Commit is standalone: dependency bump + regeneration + comment fix, no
      behavioral edits.
