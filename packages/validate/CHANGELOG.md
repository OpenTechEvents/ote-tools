# Changelog

All notable changes to `@opentechevents/validate` are documented here.

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
