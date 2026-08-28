# Session 3 — connectors: a non-ASCII address that survives every round trip

**Goal:** an event whose `id`/`url` carries `ñ` exports to ICS, RSS and JSON-LD
without corruption, and comes back unchanged through the importers.

**Depends on:** session 2 (fixtures and messages settled).

**Status:** done (2026-08-28). All nine packages green; the only failure left in
`pnpm -r --no-bail test` is `workers/validator`'s `test/badge.test.ts` (4 tests),
session 4's territory as recorded in session 2.

What the session actually found:

- **ICS folding was already octet-aware** and needed no fix — `fold()` measures
  each character with `TextEncoder`. The new fixture proves it: a
  character-counting fold would have emitted a 78-octet `URL:` line.
- **No exporter percent-encodes an id.** ICS `UID`/`URL`/`RELATED-TO`/`X-OTE-*`,
  RSS `<link>`/`<guid>`/`<media:content>`, and JSON-LD `@id`/`url`/`image`/
  `superEvent` all carry the literal `ñ`.
- **One place does encode, and it is not an id:** on an ICS → OTE → ICS round
  trip, `X-ALT-DESC` hrefs come back percent-encoded. The importer turns the
  exported HTML links into Markdown, and `marked` encodes an href when it
  re-renders them. That is a rendered link inside prose — the link text beside
  it still reads as published — so it is documented in the round-trip test
  rather than "fixed" by patching marked's URL handling.
- **`feed-urls` and `discover-feed` normalise through `new URL().toString()`**,
  which percent-encodes the path and punycodes the host. Correct there: those
  are transport URLs (where to `fetch()` a fork's files), and fetch would do it
  anyway. Pinned by a test in `feed-urls` with the reason, so nobody later
  copies that call into id handling.
- **`pnpm lint` was red on `main`** before this session: session 1's vendored
  `isIri` matches control characters literally (`\x00`) and trips
  `no-control-regex`. Turned off for `**/*.generated.ts` in `eslint.config.js`,
  next to the existing `ban-ts-comment` exception.
- `build-feed` needed no edit: `SPEC_VERSION` follows the pin and its test
  asserts against the constant.

Packages in scope: `export-ics`, `export-rss`, `export-jsonld`, `import-ics`,
`import-jsonld`, `build-feed`, `discover-feed`, `preview-feed`, `feed-urls`.

## The actual risk

0.4.0 adds no fields, so **no exporter needs a new mapping**. What changes is
that values these packages already carry can now contain characters they have
never been handed before. Each output format has its own answer, and none of
them is "leave it alone and hope":

| Format | Where the address lands | The question to answer, with a test |
| --- | --- | --- |
| ICS | `UID`, `URL`, `X-OTE-CFP-URL`, `X-OTE-OFFER-URL`, `RELATED-TO`, the image property ([export-ics/src/index.ts:166-282](../../packages/export-ics/src/index.ts#L166-L282)) | ICS is UTF-8 already, but `URL` is emitted **unescaped** at line 252 while `UID` goes through `escapeText`. Does the 75-octet line folding count **octets or characters**? A multi-byte `ñ` in a long URL is where a folding bug shows up, and folding in the middle of a UTF-8 sequence corrupts the file. |
| RSS | `<link>`, `<guid>`, offer/CFP URLs ([export-rss/src/index.ts:144-147](../../packages/export-rss/src/index.ts#L144-L147)) | `escapeXml` handles the XML level; the feed declares UTF-8, so a literal `ñ` in `<link>` is well-formed. Confirm the declaration is actually emitted, and decide the policy: emit as published (matches the spec's intent) rather than percent-encoding, which would create a second spelling of the same id. |
| JSON-LD | `@id`, `url`, `image`, `organizer.url` | JSON carries it directly. The risk is a consumer-side `new URL()` normalising it; nothing to do here beyond a fixture. |

**Do not percent-encode on the way out.** The spec's whole point in 0.4.0 is
that `…/pycamp-españa` is not rewritten to `…/pycamp-espa%C3%B1a`; an exporter
that "helpfully" encodes it produces an id that no longer matches the one the
publisher minted, which breaks exactly the update-instead-of-duplicate promise
`id` exists for.

## Work

1. **Add one shared fixture case.** Each of `export-ics`, `export-rss`,
   `export-jsonld` has `fixtures/feed.json`; add a non-ASCII-IRI event to each
   (or a sibling fixture) and snapshot the output. This is the whole point of
   the session — everything else is verification.
2. **Round trip.** `import-ics` (`URL` at
   [import-ics/src/index.ts:339](../../packages/import-ics/src/index.ts#L339))
   and `import-jsonld` must return the address byte-identical to what went in.
   Add an ICS → OTE → ICS test over the non-ASCII fixture.
3. **`build-feed`.** `SPEC_VERSION` at
   [build-feed/src/index.ts:28](../../packages/build-feed/src/index.ts#L28) is
   re-exported from `@opentechevents/validate`, so it follows the pin with no
   edit — confirm, and check
   [test/build-feed.test.ts:46](../../packages/build-feed/test/build-feed.test.ts#L46)
   still asserts against the constant rather than a literal.
4. **`discover-feed`.** Its tests hardcode `{"specVersion":"0.3.0"}` in several
   places. Discovery does not care about the version — bump the strings, and
   keep at least one `0.3.0` case if discovery is meant to work on older feeds
   (it should be: discovery precedes validation).
5. **`preview-feed`, `feed-urls`.** Bump the version strings in fixtures/tests;
   check `feed-urls` for any assumption that a feed URL is ASCII.
6. **`connectors never invent data`** still holds: no exporter may synthesise a
   missing field to make a non-ASCII case look nicer.

## Done when

- [x] Each exporter has a non-ASCII-IRI fixture with a reviewed snapshot.
- [x] ICS line folding verified against a multi-byte URL (octets, not chars).
- [x] ICS → OTE → ICS and JSON-LD → OTE → JSON-LD round trips preserve the
      address byte for byte.
- [x] No exporter percent-encodes an address the publisher wrote literally.
- [x] `pnpm test` green across all nine packages.
