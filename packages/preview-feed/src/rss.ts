import { rssToPreviewFeed } from "@opentechevents/export-rss";

import { detailRows } from "./format.js";
import type { PreviewFeed } from "./types.js";

export function rssToPreview(text: string): PreviewFeed {
  const feed = rssToPreviewFeed(text);
  return {
    title: feed.title,
    description: feed.description,
    license: feed.license,
    events: feed.events.map((event) => ({
      name: event.title,
      startDate: event.when,
      dateLabel: event.when,
      location: event.location ?? "online",
      link: event.link,
      description: event.description,
      details: detailRows([["GUID", event.guid]]),
    })),
  };
}
