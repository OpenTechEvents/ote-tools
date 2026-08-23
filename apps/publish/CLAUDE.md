# apps/publish

The `publish` tool from DESIGN.md's phase 3, presented as **Broadcast**: one
event (or a whole feed) turned into whatever every other platform wants. Its
scope is
[opentechevents-spec#12](https://github.com/OpenTechEvents/opentechevents-spec/issues/12)
— GitHub directories (prefilled issues and PR drafts), newsletters, contact
forms, social posts, platforms with no open API — plus
[spec#11](https://github.com/OpenTechEvents/opentechevents-spec/issues/11),
the schema.org snippet, which is the first channel that actually works.

Same build shape as `apps/editor`/`apps/preview`: vanilla TypeScript, one
esbuild entry point, static `index.html`/`styles.css` copied into `dist/`
**once** at `pnpm dev` startup (re-run the copy after editing either).

Non-goals inherited from spec#12, worth keeping in view because every future
channel will be tempted by them: no automatic background publishing, no
direct Meetup/LinkedIn/Eventbrite integrations, no third-party credentials.
The organizer reviews and submits every output by hand.

## The page is a channel rail plus a stage, and the rail is the pitch

Most channels do not exist yet. The page still shows all twelve, grouped, with
a status pill each (`ready` / `planned` / `idea`) — because an organizer
deciding whether OTE is worth adopting is really asking "where can this take
my events?", and a page showing only the one finished channel answers that
question wrongly.

That makes the honesty of the placeholders load-bearing. `src/lib/channels.ts`
is plain data; a `planned` card states what it will produce, what it will
never do, and offers two real actions (follow the issue, build it). It never
renders a fake preview or a disabled button that looks live. **If you add a
channel, add it as data first** — status, summary, `produces`, `accepts` —
and only give it a panel in `main.ts` when it genuinely produces something.

## Placeholders earn their space with the organizer's own data

Under "What your event already has", a planned channel lists the fields every
destination asks for and whether this event carries them
(`src/lib/event-readiness.ts`). That turns a promise into work the organizer
can do **today**, in the editor, before any channel ships — and it is the
honest version of a preview: real data, no invented output.

## The widget previews run the real widget, not a picture

The "Embeddable widget" and "Calendar & RSS links" panels mount a live
`<ote-events>` / `<ote-subscribe>` **loaded from the same versioned asset the
snippet names** (`src/lib/preview.ts`): the sibling path on this deployment
first (`deploy-tools.yml` publishes both apps to one Pages site, so it is the
identical file, same origin), the absolute tools URL second. Deliberately not
a bundled copy of the widget source — that could drift from what a visitor's
browser will actually fetch, and "this is exactly what you are embedding" is
the entire value of the pane.

Both candidates can fail (offline, or a version not deployed yet). The pane
then says so in words; it never leaves an empty rectangle that reads as a
broken widget. `pnpm dev` copies `apps/embed/versions/v<version>/` into
`dist/embed/` so previews work offline — **dev only**, because production
already serves the canonical `/embed/` assets and a second copy would be one
more thing to go stale.

The subscribe panel also HEAD-checks `feed.ics` and `feed.xml`. A fork whose
export step has not run has a perfectly valid `feed.json` and two dead links;
better found here than by the first person who subscribes.

## The widget panels are a playground, in place

Layout, theme, card width, a cap on how many events, past events — each
control re-renders **both** the live preview and the snippet, so what an
organizer tunes is exactly what they copy. Only non-default attributes are
emitted (`src/lib/site-snippets.ts`): a snippet that spells out every default
reads as configuration to maintain, and pins behaviour nobody asked to pin.
The full attribute surface still lives in the embed playground, linked at the
bottom of the panel — this is the short path, not a second implementation of
it.

Two traps worth keeping in mind, both found by an organizer on a real feed:

- **`<ote-subscribe>` takes `feed-ics`/`feed-rss`/`feed-json`, not `feed`.**
  It never fetches anything; with no URL attributes there is nothing to link
  to, and the trigger renders an empty menu that looks exactly like a
  disabled button. There is a test for it.
- **The widget renders a feed, not an event** — unless `event-id` says
  otherwise. With an event selected in the header, the panel offers
  “Only «that event»” (on by default) and emits
  `event-id="<the event's OTE id>"`, added in embed 0.7.0 for exactly this.
  It still points at the feed URL, so the card follows later edits, and the
  widget keeps rendering it after the date passes — which is what an event's
  own page needs. Unchecked, it is the whole feed again and `limit` is the
  answer to "show fewer".

## Meetup vs conference is a hint, never a gate

Directories are picky in exactly this dimension: confs.tech and
developers.events take conferences, not a monthly meetup. `guessProfile`
(`src/lib/event-profile.ts`) reads signals from the event itself — a CFP,
more than one day, paid tickets — since OTE has no `type` field and inventing
one is not this tool's call.

The guess is **shown with its reasons**, overridable from the header, and only
ever reorders and annotates: an unfit channel sinks to the bottom of its group
and says "conferences only", but it is never hidden and never disabled. An
organizer learning that confs.tech will not take their meetup is useful; a
channel silently vanishing is not.

## An invalid feed stops everything, before any channel

`main.ts` runs `validateFeed` first and shows the errors *instead of* the
console. Channels are pure mappings, not validators: broadcasting from a
broken feed would carry the same errors to every destination at once. Don't
"improve" this into best-effort output with a warning.

## Online-only events are not eligible for Google rich results — say so

Google requires a physical location for event rich results ("Virtual
experiences that have no real-world component aren't supported"), so an
online-only event always comes back from the Rich Results Test as "no
eligible item", however good the markup is. The note under that link
(`eligibilityNote` in `src/lib/snippet.ts`, backed by `isOnlineOnly` in
`@opentechevents/export-jsonld`) exists because the link itself sets an
expectation this tool would otherwise break — an organizer seeing red there
reads it as our bug, not as Google policy. Keep the note next to whatever
sends them to a validator.

## Mapping logic lives in packages, not here

`schema-org` is a thin call into `@opentechevents/export-jsonld`; the widget
and subscribe snippets are string building in `src/lib/site-snippets.ts`
against assets `deploy-tools.yml` already publishes. Any question about how
an OTE field becomes someone else's field belongs in the package that owns
the mapping — the same code has to serve the SSR renderer (issue #58) and
every future channel, not just this page.

`site-snippets.ts` pins the widget version from `apps/embed/package.json`,
injected by `build.mjs` as `__EMBED_VERSION__`. Pinned, never `/latest/`: a
widget that changes behaviour on someone else's site without them touching
anything is a bad trade (see `apps/embed/CLAUDE.md`). `vitest.config.ts`
defines the same global for tests, which don't go through esbuild.

## Feed source: `?repo=` first, `?feed=` as the escape hatch

`?repo=owner/name` is the DESIGN.md convention every central tool follows
(the fork's dashboard already links here that way, at
`/publish?repo=…`). For a repo, the fork's GitHub Pages URL is tried first
and `raw.githubusercontent.com` on the default branch second — Pages may not
be enabled yet while `feed.json` is already committed. `?feed=<url>` covers
feeds published anywhere else; non-http(s) URLs are rejected.
