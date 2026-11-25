# Changelog

All notable changes to `@opentechevents/import-jsonld` are documented here.

## 0.6.1

**A release with no code change, to fix what the tarball says.** `0.6.0`
shipped pinning `@opentechevents/import-ics@0.4.1` — two minors behind the
line the kit ships and the one `skills/` tells an organizer to install. The
pin is written by pnpm at pack time (`workspace:*` becomes an exact version),
so it lived in the tarball and in nothing this repo shows; it took a registry
sweep to see it.

What it did **not** do is change anybody's output: the two symbols this
package imports (`htmlToMarkdown`, `looksLikeHtml`) are re-exported from a
`html-to-markdown.js` that is byte-identical in `import-ics` 0.4.1 and 0.6.0,
verified by unpacking both. What it cost shows up in the installed
tree: `npm install @opentechevents/import-jsonld@0.6.0 @opentechevents/import-ics@0.6.0`
— the pair `skills/` tells an organizer to use — resolves to

```
├─ import-ics@0.6.0 → validate@0.6.0
└─ import-jsonld@0.6.0 → import-ics@0.4.1 → validate@0.4.0
```

so the tree gains not just a second `import-ics` but **`validate@0.4.0`**, the
release whose "support is not validity" defect the 0.6 line exists to have
fixed. `import-jsonld` never calls it — it imports two HTML helpers and
nothing else — so no verdict came from it; it was in the lockfile, in an audit's
view, and loaded at import. The other cost is the one that had not happened
yet: the next change to that shared file would have diverged invisibly.

`.github/scripts/published-pins.mjs` now sweeps every published package's
sibling pins against the workspace, as part of the release checklist (#133).

## 0.6.0

- **Targets OTE Spec 0.6.0.**
- `performer` → **`speakers`**, with `affiliation` from schema.org's
  `affiliation` Organization or `worksFor` (only the organisation's *name*
  travels; OTE wants one display string). Ignored on an `Organization`
  performer. It used to be reported as an unmapped drop.
- `sameAs` keeps HTTP(S) entries only — a `did:`, an `acct:` handle or an
  AT-URI is an identifier, not a web page.
- `recordedIn` / `workFeaturedIn` → **`recordings`**, merged into one list.
- **`location.address`** is mapped part for part from `PostalAddress` instead
  of being flattened into the `venue` string, which lost `locality` and
  `country` — the two a consumer filters on. `venue` is unchanged: the spec
  has `address` complement it. `addressCountry` is only taken when it already
  is a two-letter code; a country name is warned about, never guessed.
- **`url` falls back to the page's `<link rel="canonical">`**, so a page piped
  in on stdin gets one with no flag; `--url` overrides for a mirrored page.
  The `id` warning no longer promises a `url` it did not keep.
- **`subEvent` → one document per part**, each with `partOf` built from the
  parent's `@id`, `url`, or `--url`. Parts do not inherit the parent's `url`.
  With no URI for the parent the parts are not imported and a warning says how
  many were skipped, rather than letting them become standalone events.

## 0.4.1

- **New: `ote-import-jsonld` CLI.** `ote-import-jsonld [--tz <zone>] <page.html|->`
  prints `{ events, warnings }` as JSON; exit `0` = at least one event, `1` = the
  page carries no schema.org Event, `2` = usage or I/O. Reads stdin with `-`, so
  `curl … | ote-import-jsonld -` is the whole import step. Added for callers
  without a bundler — in particular the organizer skill (`skills/`), which
  otherwise would have had to re-derive the schema.org mapping in a prompt.

## 0.4.0

- Tracks **OTE Spec 0.4.0**; no behavioural change in this package. A
  non-ASCII `url` in schema.org markup is carried into the partial event
  unchanged, and the result is valid under 0.4.0's `format: iri` — covered by
  the round-trip test in `@opentechevents/export-jsonld`.

## 0.3.1 - 2026-08-10

- Convert HTML found in schema.org `description` values to Markdown and warn
  that the converted description should be reviewed.

## 0.3.0

- Initial package release for OTE spec v0.3.
