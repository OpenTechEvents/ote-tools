# Changelog

All notable changes to `@opentechevents/migrate` are documented here.

## 0.1.0

First release. Closes the last open part of #97.

- **`migrateDocument(json, options?)` and `ote-migrate`** move an OTE feed or
  standalone event to a newer spec version. The JSON change is `specVersion`
  and nothing else — every published release so far has been additive — but
  the result is validated against the target version rather than assumed, so
  a future release that breaks that pattern fails here instead of shipping.
- **D032 warnings, which are the reason this is a package and not a `sed`.**
  Before 0.5 a part of a multi-part event carried its own complete `offers`;
  from 0.5 an unscoped offer is read as `admission` and a surcharge needs
  `"scope": "add-on"` plus `partOf.offers`. The old document stays valid
  while quietly under-reporting what attending costs, so the migration says
  which events need a human and what the question is. It never rewrites
  pricing: whether a number is the whole price or an extra is a fact about
  the event, not about the JSON.
- Warnings never change the exit code. They are decisions, not faults.
- **Documents outside the support window migrate.** Validation here is
  against the version the document declares, deliberately bypassing the
  support policy that `validateDocument` applies — a feed on an unsupported
  release is precisely the one that has to run this, and a migrator that
  refused it would be useless to the only people who need it. A registered
  adopter was on 0.3 when 0.3 left the window.
- Refuses, rather than guessing: a missing or never-published `specVersion`,
  an unpublished target, a **downgrade** (dropping fields a newer version
  added is silent data loss), and input that is already invalid at the
  version it claims.
- Output is written with two-space indent and a trailing newline — what OTE
  documents in this ecosystem already use, so migrating one does not show up
  as a whole-file reformat in the next diff.
