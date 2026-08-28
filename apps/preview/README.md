# apps/preview

The static feed previewer: given a feed, it shows what the three exports
actually contain — the JSON as a readable list, the ICS as a calendar, the RSS
as entries — plus the raw source of each.

```sh
pnpm --filter @opentechevents/preview dev     # esbuild watch + static server
pnpm --filter @opentechevents/preview test
```

Like `apps/editor`, `pnpm dev` copies `index.html`/`styles.css` into `dist/`
**once**, at startup. After editing either, re-run the build or copy them by
hand before reloading.

## Two ways in

| Query | What it means |
| --- | --- |
| `?repo=owner/name` | An organizer fork. The three exports are looked up by their template names (`feed.json`, `feed.ics`, `feed.xml`) on GitHub Pages and on the default branch — see `@opentechevents/feed-urls`. |
| `?feed=<url>` | One published document, at whatever address and under whatever name. |
| `?format=json\|ics\|rss` | Optional, alongside `?feed=`. Forces the reading when detection would get it wrong. |

**A feed file does not have to be called `feed.json`.** That name is the OTE
template's own convention; the spec names no file. This previewer used to
require it and rejected real feeds outright — `https://eventos.wiki/events.json`
among them — so `?feed=` now takes any http(s) URL and *detects* the format, in
the order a person would: an explicit `?format=`, then the extension, then the
`Content-Type`, then the document's first bytes.

The sibling tabs follow from the same distinction. A URL named the template's
way has two siblings worth fetching; any other URL is one document, and the
other two tabs say so rather than showing 404s that read as the publisher's
fault.

## With no parameters, it asks

There is a form: feed URL (with the format select) or `owner/name`. Submitting
navigates rather than loading in place, so the query string stays the page's
whole state and every preview is a link somebody can paste into an issue — the
same reason `apps/validator` builds a permalink.

## Loading is announced, because feeds get slow

Every fetch is cache-busted (`?_=<timestamp>`), so an organizer who just fixed
their workflow sees the new export rather than a cached one — which means every
load pays the origin's full latency. Real feeds make that visible:
`eventos.wiki/events.json` is 539 kB, 475 events, and its server takes upwards
of 25 s to answer. A panel that said nothing for that long read as a page that
had finished and found nothing, so the destination tab shows an animated
"Loading <url>…" from the first frame — before any request has come back, and
including the tab a detection is still deciding on.
