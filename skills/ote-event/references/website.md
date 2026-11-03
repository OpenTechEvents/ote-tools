# Exposing the feed on the community's website

You are in the repo of a community's website (or the organizer asked you to touch it).
Four separate things can be added. **Offer them one at a time and get a yes for each**
before editing a file — a website is somebody's public face, not a scratch pad.

Prerequisite for all four: **a feed URL that actually resolves.** Fetch it and check.
If the feed is not published yet, finish that first; a `<link>` or a badge pointing at
a 404 is worse than nothing.

## 1. The discovery tag (do this one first)

The primary discovery mechanism, mirroring RSS. In the `<head>` of the site's **layout
or base template**, not in one page:

```html
<link rel="alternate"
      type="application/ote+json"
      href="https://yourcommunity.dev/events.json"
      title="Events (OTE)">
```

Find the real layout before editing: `_layouts/default.html`, `app/layout.tsx`,
`src/components/Layout.astro`, `templates/base.html`, `index.html` — whatever this site
actually uses. Adding it to a single page is a silent half-fix.

**Check first whether a tag already exists** — and check it properly. A bare
`<link rel="alternate">` with no `href` and no `type` is framework noise, not a feed
declaration (biznagafest.com emits exactly that), and an `alternate` pointing at a
blog's RSS is a different feed entirely. Only an `href` that resolves to the OTE feed
means "already done": then say so and change nothing.

Two cautions:

- The media type is **not settled** in the spec
  ([spec#33](https://github.com/OpenTechEvents/opentechevents-spec/issues/33)):
  `application/ote+json` vs. reusing `application/feed+json`. Write
  `application/ote+json` — what v0.4 documents — and mention in one line that it may
  change, so the organizer is not surprised later. When *reading* someone's site,
  accept all the spellings.
- `/.well-known/ote-feed` is a complement, only for organizers who control their
  domain apex, and also unsettled. Do not set it up unprompted.

## 2. The badge

Static SVGs served from `https://opentechevents.org/badge/`. Two different things:

**The feed badge** is a subscribe button. It must link **to the feed itself**, never to
opentechevents.org:

```markdown
[![OTE feed](https://opentechevents.org/badge/ote-feed.svg)](https://yourcommunity.dev/events.json)
```

Tight on space (nav bar, footer, table cell): `ote-feed-icon.svg` at 20×20, same link
rule. Spanish wordings exist as `ote-feed.es.svg` / `ote-supporter.es.svg`.

**The supporter badge** is a merit badge, and links to the project, not to a feed:

```markdown
[![OTE: supporter](https://opentechevents.org/badge/ote-supporter.svg)](https://opentechevents.org#support)
```

Do not mix the two up — a feed badge pointing at the project page stops working as a
subscribe button, and the badge docs are explicit that a badge which lies is worse than
no badge.

## 3. schema.org JSON-LD for SEO

This is usually what the organizer cares about most, and they rarely know to ask.
Generate it from the feed rather than hand-writing it:

```sh
npx -y -p @opentechevents/export-jsonld@0.4 ote-export-jsonld feed.json           # <script> block, @graph of events
npx -y -p @opentechevents/export-jsonld@0.4 ote-export-jsonld --item-list feed.json  # for a listing page
```

A `@graph` of events suits a page about those events; `--item-list` suits an index.
Google reads these for the Event rich result. If the site already emits its own
`Event` JSON-LD, do not add a second, competing copy — point out the duplicate and let
the organizer decide.

Regenerating this on every build is better than pasting it once. If the site has a
build step, wire the command into it; if not, paste it and say plainly that it will go
stale when events change.

## 4. The widgets

Two of them, and organizers want different ones. To **render** the events on the page:

```html
<script type="module" src="https://tools.opentechevents.org/embed/v0.7.0/ote-events.js"></script>
<ote-events feed="https://yourcommunity.dev/events.json"></ote-events>
```

The attribute is `feed` (or `feeds` for several), not `src`. Useful extras:
`limit`, `layout`, `sort`, `show-past`, `theme`, `card-width`, `lang`.

To offer a **subscribe** button instead — Google Calendar / `webcal:` / ICS, RSS,
and the OTE feed:

```html
<script type="module" src="https://tools.opentechevents.org/embed/v0.7.0/ote-subscribe.js"></script>
<ote-subscribe feed-ics="https://yourcommunity.dev/feed.ics"
               feed-rss="https://yourcommunity.dev/feed.xml"
               feed-json="https://yourcommunity.dev/events.json"></ote-subscribe>
```

**Pin the version in the URL**, as above — that is what the widget's own docs
recommend for production, so a future release cannot change a live site without the
organizer choosing it. `…/embed/latest/…` and the unversioned
`…/embed/ote-events.js` exist; prefer them only if the organizer explicitly wants
automatic updates. Check <https://tools.opentechevents.org/embed/> for the current
version number and the full attribute list before promising behaviour — the widget
versions independently of the spec.

## Afterwards

Offer, once: register the community at <https://opentechevents.org/register/> so
directories can find the feed. It is a one-time thing, and not your call to do silently.
