# @opentechevents/preview-feed

Internal, workspace-only package. Normalizes the three formats an OTE feed
can be exported as — JSON (`feed.json`), iCalendar (`feed.ics`), RSS
(`feed.xml`) — into one shared `PreviewFeed`/`PreviewEvent` shape for
display.

```ts
import { jsonToPreviewFeed, sortedEvents, eventWhen } from "@opentechevents/preview-feed";

const feed = jsonToPreviewFeed(jsonText);
for (const event of sortedEvents(feed.events)) {
  console.log(event.name, eventWhen(event));
}
```

All exports are pure functions: no DOM, no fetch, no clock (besides
`sortedEvents`, which reads `Date.now()` to split past/upcoming). Consumers:

- `apps/preview` — all three converters (`jsonToPreviewFeed`,
  `icsToPreviewFeed`, `rssToPreview`), for its JSON/ICS/RSS diagnostic tabs.
- `apps/embed` — only `jsonToPreviewFeed` and the format/sort helpers. The
  package is built with `"sideEffects": false` so bundlers tree-shake the
  ICS/RSS converters (and their heavier transitive deps, `ical.js` and
  `DOMParser`) out of the embed's bundle.

Not published to npm — this is display-normalization glue between two apps
in this monorepo, not an OTE connector.
