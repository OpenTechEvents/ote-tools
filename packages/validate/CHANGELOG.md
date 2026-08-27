# Changelog

All notable changes to `@opentechevents/validate` are documented here.

## Unreleased

- Validators are now compiled from the schemas at codegen time (Ajv standalone
  mode, `pnpm gen`) instead of being compiled at runtime. No `new Function` on
  import, so consumers no longer need `script-src 'unsafe-eval'`, and no Ajv in
  the bundle: `apps/validator`'s gzipped bundle drops from ~102 kB to ~78 kB.
  The public API is unchanged.

## 0.3.0

- Initial package release for OTE spec v0.3.
