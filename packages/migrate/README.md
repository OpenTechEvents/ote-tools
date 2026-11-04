# @opentechevents/migrate

Moves an OTE document to a newer spec version — and tells you the one thing a
find-and-replace gets wrong.

```sh
npx @opentechevents/migrate feed.json --write
```

## Why this is not `sed`

What it does to your JSON really is small: it rewrites `specVersion`. Every
published OTE release so far has been additive, so no valid document has ever
needed a structural change to move up. `migrateDocument` checks that rather
than assuming it — the output is validated against the target version before
you get it back.

The reason this is a package is **D032**, the multi-part pricing change in
0.5.

Before 0.5, a part of a multi-part event carried its own complete `offers`.
That was the only way to price it; there was no way to say *"this workshop
costs 60 on top of the conference ticket"*. From 0.5 there is: the set's
shared admission goes in `partOf.offers`, and a surcharge is an offer with
`"scope": "add-on"`.

The trap is that the old document stays **valid**. An offer with no `scope` is
read as `admission` — a complete way to attend that part. So a workshop that
really costs 240 + 60 goes on publishing, validly and machine-readably, that
it costs 60. Nothing can flag that automatically: whether the 60 is the whole
price or an extra is a fact about your event, not about the JSON.

So `ote-migrate` asks you:

```text
✓ feed.json — OTE 0.4.0 → 0.6.0

  ! events[1].offers (D032)
    This event ("Taller de testing en Python") is part of a multi-part set and
    carries its own offers. From 0.5 an offer without a "scope" is read as
    "admission" — a complete way to attend this part. If any of these prices is
    really a surcharge on top of the set's ticket, mark it "scope": "add-on"
    and put the shared admission in partOf.offers, or the feed will
    under-report what attending costs.

  3 things to check by hand. The document is valid either way — these are
  about what it means.
```

Warnings never change the exit code. They are decisions, not faults.

## It works on versions that are out of support

The support window covers the last three minors. A document older than that
gets an error from `ote-validate` — correctly, because a consumer built for
the window cannot read it:

```sh
$ ote-validate feed-0.3.json
✗ feed-0.3.json (feed) — OTE 0.3.0
    specVersion: OTE Spec 0.3.0 is outside the support window … migrate to 0.6.0.
```

That document is exactly the one that needs migrating, so this tool validates
against the version the document declares and ignores the window:

```sh
$ ote-migrate feed-0.3.json --write
✓ feed-0.3.json — OTE 0.3.0 → 0.6.0
```

## CLI

```text
Usage: ote-migrate <document.json> [output.json] [options]

  --to <version>   Target spec version (default: the newest published one)
  --kind <k>       feed | event (default: inferred from the document)
  --write          Rewrite the input file in place
  --versions       List the published versions and exit
```

With no output path and no `--write`, the document goes to stdout and
everything else to stderr, so it pipes cleanly:

```sh
ote-migrate feed.json | jq .specVersion
```

Exit codes: `0` migrated · `1` cannot migrate (unplaceable version, a
downgrade, or input that is invalid at the version it claims) · `2` usage or
I/O error.

## Library

```ts
import { migrateDocument } from "@opentechevents/migrate";

const { document, from, to, warnings } = await migrateDocument(feed, {
  to: "0.6.0",
});
```

`migrateDocument(json, options?)` returns `{ kind, from, to, changed,
document, warnings }`. The input is never mutated. It throws `MigrationError`
when the migration cannot be attempted:

- the document declares no `specVersion`, or one that was never published —
  there are no rules to migrate it from;
- the target is not a published version;
- the target is **older** than the declared version. Migrating downwards means
  dropping fields a newer version added, and silently losing data somebody
  wrote on purpose is worse than refusing;
- the input is not valid at the version it claims. Migrating an invalid
  document produces an invalid one wearing a newer label, and a later reader
  has no way to tell the damage came from here.

## What it will not do

It does not rewrite your pricing, invent `partOf.offers`, or guess a `scope`.
The repo-wide rule that connectors never invent data applies here too, and
D032 is the case where guessing would be most tempting and most expensive —
a wrong price is worse than an absent one.
