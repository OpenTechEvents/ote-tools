// @vitest-environment jsdom
//
// rssToPreview delegates to @opentechevents/export-rss's rssToPreviewFeed,
// which is browser-only (uses DOMParser) — jsdom supplies that here so this
// file can run under vitest's default Node environment for every other test.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { rssToPreview } from "../src/rss.js";

// Built without `new URL(...)`: this file's `@vitest-environment jsdom`
// pragma replaces the global URL with jsdom's implementation, which
// fileURLToPath rejects even for a well-formed file: URL.
const fixture = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../fixtures/feed.rss.xml"),
  "utf8",
);

describe("rssToPreview", () => {
  it("carries channel-level metadata through", () => {
    const feed = rssToPreview(fixture);
    expect(feed.title).toBe("OTE Preview Fixture Feed");
    expect(feed.description).toBe("Fixture RSS feed for @opentechevents/preview-feed tests");
    expect(feed.license).toBe("CC-BY-4.0");
    expect(feed.events).toHaveLength(1);
  });

  it("recovers When/Where from the item's HTML body as dateLabel/location", () => {
    const [event] = rssToPreview(fixture).events;
    expect(event).toMatchObject({
      name: "Fixture Conference",
      startDate: "2026-06-20 09:00 – 2026-06-20 17:00 (Europe/Madrid)",
      dateLabel: "2026-06-20 09:00 – 2026-06-20 17:00 (Europe/Madrid)",
      location: "Fixture Hall, Sample City",
      link: "https://fixture.example/events/2026-conf",
      description: "A sample conference used to test RSS normalization.",
    });
    expect(event!.details).toEqual([
      { label: "GUID", value: "https://fixture.example/events/2026-conf" },
    ]);
  });

  it("falls back to online when the item has no recovered location", () => {
    const withoutLocation = fixture.replace(
      /&lt;p&gt;&lt;strong&gt;Where:.*?&lt;\/p&gt;\n/,
      "",
    );
    const [event] = rssToPreview(withoutLocation).events;
    expect(event!.location).toBe("online");
  });
});
