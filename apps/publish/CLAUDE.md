# apps/publish

The `publish` tool from DESIGN.md's phase 3, presented as **Broadcast**: one
event turned into whatever every other platform wants. Its scope is
[opentechevents-spec#12](https://github.com/OpenTechEvents/opentechevents-spec/issues/12)
— directories, newsletters, contact forms, social posts, platforms with no open
API — plus
[spec#11](https://github.com/OpenTechEvents/opentechevents-spec/issues/11),
the schema.org snippet.

Same build shape as `apps/editor`/`apps/preview`: vanilla TypeScript, one
esbuild entry point, static `index.html`/`styles.css` copied into `dist/`
**once** at `pnpm dev` startup (re-run the copy after editing either).

Non-goals inherited from spec#12, worth keeping in view because every future
destination will be tempted by them: no automatic background publishing, no
direct Meetup/LinkedIn/Eventbrite integrations, no third-party credentials.
The organizer reviews and submits every output by hand.

## One event, pinned — never "all of them"

An organizer publishes **one** event. The first version of this tool opened on
`All N events` and made the choice a dropdown in the toolbar, which framed the
whole thing as mass broadcasting and made the organizer re-answer "which
event?" on every visit.

Now the event is context: chosen once in the `#event-picker` dialog, shown in
the app bar, and stored per feed (`ote-publish-event:<feedKey>` in
`src/lib/store.ts`). `resolvePinnedEvent` restores it when it is still in the
feed and otherwise falls back to the next upcoming event — **never to a
whole-feed mode**. Keys are namespaced by feed URL so two forks in two tabs do
not share a pin.

A whole feed still means something to exactly three destinations, so `scope`
is a control **inside** those panels (`scopeControl` in `src/ui/controls.ts`),
not a second event selector in the chrome. Do not promote it back into the app
bar.

## Two views, no router

`showView()` in `src/main.ts` owns every piece of chrome for both views and
toggles them with `hidden` — the same shape `apps/editor` uses, and for the
same reason: a static tool opened from a dashboard link has one meaningful URL
parameter and it is the feed. No router, no hash, no framework.

`#home-view` is the dashboard: destinations by group, ordered by reach, with
the starred ones in a row on top (`ote-publish-favourites`). `#destination-view`
is a sidebar of every destination plus the working panel, so publishing one
event to eight places does not mean eight trips back to the dashboard.

## The automation ladder is what lets the catalogue be wide

`src/lib/destinations.ts` grades each destination `generated` / `assisted` /
`planned` rather than "built or not". This is load-bearing. The catalogue is
the pitch — an organizer deciding whether OTE is worth adopting is asking
"where can this take my events?" — but two dozen placeholder cards would answer
that with a wall of promises.

- **`generated`** — the tool emits their own format. Today: the schema.org
  snippet, the widget, the subscribe links.
- **`assisted`** ("Guided" in the UI) — `src/lib/submission.ts` lays the
  organizer's own answers out field by field, each one click from the
  clipboard, next to a link to the real submission form; or, for the `paste`
  destinations, composes the announcement in that platform's markup and inside
  its character limit. No API, no account, no credentials — which is exactly
  why it could ship for nearly the whole catalogue at once. It closes the gap
  that actually costs an organizer their evening: digging their own event data
  out of their repository, once per form.
- **`planned`** — genuinely nothing yet. Keeps the honest placeholder card:
  what it will produce, what it will never do, the readiness list against the
  organizer's real data, and two real actions.

**Add a destination as data first.** Status, summary, `produces`, `accepts`,
`submitUrl`, `brand`. Only give it a panel when it genuinely produces
something. And never render a fake preview or a disabled button that looks
live — with a catalogue this wide, that honesty is the only thing keeping the
page from reading as vapour.

## The catalogue is a claim, so it is checked

Every entry answers five questions: does it take a submission of your own
event, does it reach a tech audience (or your event's language), is it free,
is there a documented way in, and was it answering when we last looked.
Aggregators that only crawl other listings are out — you cannot submit to
them, so a card would be a dead end; they appear as notes on the listings they
crawl. So are off-audience topic portals and gated commercial products.

`pnpm check:links` HEAD-checks every `homeUrl` and `submitUrl`. Deliberately
**not** a test: two dozen third-party hosts must not be able to redden this
repository's build. It treats 403 as reachable, because several of these sites
refuse a scripted request while working fine in a browser. Run it when adding
a destination — the spec's own research already had two URLs that had quietly
moved.

Social and chat are **one card per platform**. Collapsing them into "social
posts" and "chat groups" hid most of the destinations this tool exists to
reach, and there is a test that keeps them split.

## Icons are generated, and never fetched

`src/lib/icons.generated.ts` is written by `pnpm gen:icons` from an explicit
allow-list in `tools/icon-manifest.mjs`: brand marks from **simple-icons**
(CC0), UI and category glyphs from **Lucide** (ISC, the maintained successor to
feather, which is what `apps/editor` already inlines by hand). The committed
file means neither the build nor the tests need the icon packages resolvable;
`test/icons.test.ts` fails if it drifts from the installed dependency, the
same guard `packages/validate` puts on its embedded schema.

No CDN, no runtime fetch, no favicon scraping. A tool that phones out to two
dozen third-party hosts on load is a privacy and reliability regression.

simple-icons has dropped several marks on trademark grounds — Eventbrite,
LinkedIn and Slack among them — and has none for the directories. Those get a
**monogram** tile, not a lookalike logo from somewhere else. A wrong logo is a
small lie, and not telling them is this tool's whole argument.

The brand colour tints the tile; it never fills the mark. Two dozen logos at
full saturation is a ransom note, and the loudest brand would win attention it
has not earned.

## Dark mode lives here first

`styles.css` keeps the token *names* `apps/editor` and `apps/preview` use and
adds the dark half, taken from the palette `apps/embed` already ships in
`src/theme.css.ts` — so a widget previewed in this console matches it. The
explicit `:root[data-theme="…"]` blocks come **after** the
`prefers-color-scheme` query so a choice wins in both directions; `system` is
the absence of a stored value, not a third stored state.

Filled controls flip to dark text in the dark theme: the dark accent is a light
blue, and white on it is barely legible.

## The widget previews run the real widget, not a picture

The "Embeddable widget" and "Calendar & RSS" panels mount a live
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
  otherwise. At event scope the panel emits `event-id="<the event's OTE id>"`,
  added in embed 0.7.0 for exactly this. It still points at the feed URL, so
  the card follows later edits, and the widget keeps rendering it after the
  date passes — which is what an event's own page needs. At feed scope it is
  the whole feed again and `limit` is the answer to "show fewer".

## Meetup vs conference is a hint, never a gate

Directories are picky in exactly this dimension: confs.tech and
developers.events take conferences, not a monthly meetup. `guessProfile`
(`src/lib/event-profile.ts`) reads signals from the event itself — a CFP,
more than one day, paid tickets — since OTE has no `type` field and inventing
one is not this tool's call.

The guess is **shown with its reasons**, overridable, and only ever reorders
and annotates: an unfit destination sinks to the bottom of its group and says
"conferences only", but it is never hidden and never disabled. The override
lives in the destination panel rather than in the chrome, because that is the
only place the answer changes anything — and only for destinations whose
`accepts` is not `any`.

## Nothing is invented, on any panel

The repo-wide connector rule, at the one place an organizer would most like it
broken: a form field this event cannot answer comes back marked missing, with
the reason a destination wants it. Never a plausible default. `submissionFields`
is tested for exactly this, and the missing count is reported so the organizer
knows the fix is one trip to the editor, not one per destination.

A warning that misfires teaches people to stop reading warnings, so they are
kept narrow: the alt-text note only appears once there is an image, and the
CFP row is left out entirely where the destination would never ask.

## An invalid feed stops everything, before any destination

`main.ts` runs `validateFeed` first and shows the errors *instead of* the
console. Destinations are pure mappings, not validators: broadcasting from a
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
every future destination, not just this page.

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

**Custom domains are why `feedUrls` is more than two strings.** A Pages site
served from its own domain answers `owner.github.io/name/feed.json` with a
`301` that carries no `Access-Control-Allow-Origin`, and CORS applies to
every response in a redirect chain — so the fetch dies at the redirect even
though the destination sends `ACAO: *`. Script cannot read the `Location`,
and `raw.githubusercontent` is no help when the feed is generated by
`build-pages.yml` rather than committed. The real domain therefore has to
arrive from outside: an explicit `?feed=` alongside `?repo=` (which the
source now keeps instead of discarding), or the origin of the dashboard that
linked here, read from `document.referrer` — browsers trim it to the bare
origin cross-origin, so both `<origin>/<name>/feed.json` and
`<origin>/feed.json` are tried. Do not "simplify" these candidates away.

## Testing

`vitest` over `src/lib/` only, per CONTRIBUTING.md — the UI is checked by
hand. `src/ui/` is deliberately thin: anything worth a test belongs in a lib
module, which is why `submission.ts`, `store.ts` and `destinations.ts` are
pure and the panels only arrange their output.
