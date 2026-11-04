# @opentechevents/discover-feed

Internal, workspace-only package. Answers *"where is the OTE feed of this
URL?"* — the reference implementation of the spec's discovery mechanism
([opentechevents-spec#6](https://github.com/OpenTechEvents/opentechevents-spec/issues/6),
[spec/v0.4 § Discovery](https://github.com/OpenTechEvents/opentechevents-spec/blob/main/spec/v0.4/README.md#discovery-how-a-feed-is-found-from-a-website)).

```ts
import { discover } from "@opentechevents/discover-feed";

const result = discover({
  url: "https://comunidad.example/",          // after redirects
  contentType: "text/html; charset=utf-8",
  body: html,
});

switch (result.outcome) {
  case "document":   // the response IS the feed → validate result.text
  case "candidates": // the page declares feeds → let the user pick, then fetch
  case "not-found":  // an HTML page that declares no feed
  case "unsupported":// neither JSON nor HTML
}
```

## No network, on purpose

Every function takes bytes + content-type + base URL and returns a decision.
The fetching lives in `workers/fetch-url`, the only component in this
monorepo with network access. Two reasons:

- These rules are testable without mocking a single socket, and the tests
  read as spec cases rather than as HTTP plumbing.
- The Worker stays what it is — *"given a URL, return the bytes"* — instead of
  accumulating spec logic behind an SSRF boundary, where every change is a
  security review.

The crawler and the discovery bot will want the same rules later; that is why
this is its own package and not a file inside `apps/validator`.

## Decisions worth knowing

**The canonical media type is `application/ote+json`** (OTE Spec 0.6,
DECISIONS.md D036). `application/feed+json` is JSON Feed's: a document that
turns out to be an OTE feed served under it is **accepted with a warning** —
reported as `note.kind: "json-feed-type"`, not as the canonical type. The
label is wrong and the document is fine, and refusing it would punish a
publisher for a header they can fix in one line. Accepting both silently,
which is what this package did while the question was open, is precisely
what kept it open.

Generic `application/json` is parsed too — plenty of static hosts serve a
feed that way — and reported as `generic-json`, since the type announces
nothing.

**Every declared feed is listed, never just the first.** A page with a
Spanish and an English feed gets both `<link>`s returned; picking silently
would validate a document the user did not mean.

**"Not found" is its own outcome, not a validation error.** A page with a
typo'd `<link>` must not read as "your JSON is broken". Consumers are
expected to render discovery and validation as two separate verdicts.

**Non-http(s) hrefs are dropped here**, before any fetcher sees them: a
third-party page must not be able to aim the fetcher at `file:///etc/passwd`.
That is defense in depth — `workers/fetch-url` refuses those schemes too.

**`/.well-known/ote-feed` is offered by default**, since D036 made it a
documented MAY: a consumer that looks there is correct, and a publisher who
has not set one up loses nothing by being asked. Pass `wellKnown: false` to
skip it. It stays a *complement* — the primary mechanism is
`<link rel="alternate">` in the page `<head>`.

**A feed embedded in the page is out of scope**, and the `embedded` option
is gone rather than defaulted off. The blocker named in D036 is that the
document carries no discriminator: "has `events[]`" does not tell an OTE
feed from any other JSON on the page. The slot is reserved, and whatever
lands will arrive with that discriminator — so the implementation that was
here would not have been the one to keep.

## The HTML scanner

`html.ts` is a small attribute scanner, not an HTML parser: it looks for
`<link>` in the `<head>` (comments stripped, cut at `</head>`/`<body>`) the
way a feed reader does. It never builds a tree and never evaluates anything,
which is what makes it safe to point at an arbitrary page in a browser tab, a
Worker and a Node test alike.
