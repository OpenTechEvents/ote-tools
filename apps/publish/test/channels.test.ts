import { describe, expect, it } from "vitest";

import type { OteEvent } from "@opentechevents/export-jsonld";

import {
  acceptsProfile,
  buildChannelUrl,
  channelsForGroup,
  CHANNELS,
  GROUPS,
  requestChannelUrl,
} from "../src/lib/channels.js";
import { guessProfile } from "../src/lib/event-profile.js";
import { readiness } from "../src/lib/event-readiness.js";
import { previewScriptUrls } from "../src/lib/preview.js";
import {
  DEFAULT_EMBED_OPTIONS,
  embedPreviewAttributes,
  embedSnippet,
  subscribePreviewAttributes,
  subscribeUrls,
  subscribeWidgetSnippet,
} from "../src/lib/site-snippets.js";

const meetup: OteEvent = {
  id: "https://example.org/events/meetup",
  name: "Monthly meetup",
  startDate: "2026-06-11T18:30",
  timezone: "Europe/Madrid",
};

const conference: OteEvent = {
  id: "https://example.org/events/conf",
  name: "DevFest",
  startDate: "2026-10-16",
  endDate: "2026-10-17",
  timezone: "Europe/Madrid",
  cfp: { url: "https://example.org/cfp" },
  offers: [{ price: 45, currency: "EUR" }],
};

describe("channel registry", () => {
  it("every channel belongs to a declared group", () => {
    const groups = new Set(GROUPS.map((group) => group.id));
    for (const channel of CHANNELS) expect(groups.has(channel.group)).toBe(true);
  });

  it("ids are unique — the rail and the stage look channels up by id", () => {
    expect(new Set(CHANNELS.map((c) => c.id)).size).toBe(CHANNELS.length);
  });

  it("every non-ready channel says what it will produce", () => {
    for (const channel of CHANNELS.filter((c) => c.status !== "ready")) {
      expect(channel.produces.length).toBeGreaterThan(0);
    }
  });
});

describe("acceptsProfile", () => {
  it("conference-only destinations reject meetups but nothing is hidden", () => {
    const confsTech = CHANNELS.find((c) => c.id === "confs-tech")!;
    expect(acceptsProfile(confsTech, "meetup")).toBe(false);
    expect(acceptsProfile(confsTech, "conference")).toBe(true);
    // Still listed in its group — the organizer learns why, not nothing.
    expect(channelsForGroup("directories", "meetup")).toContain(confsTech);
  });

  it("sorts the channels that fit this event first", () => {
    const forMeetup = channelsForGroup("directories", "meetup");
    const firstUnfitIndex = forMeetup.findIndex((c) => !acceptsProfile(c, "meetup"));
    const lastFitIndex = forMeetup.reduce(
      (last, channel, index) => (acceptsProfile(channel, "meetup") ? index : last),
      -1,
    );
    expect(firstUnfitIndex).toBeGreaterThan(lastFitIndex);
  });
});

describe("call-to-action links", () => {
  it("requesting a platform opens a prefilled issue, not an empty one", () => {
    const url = new URL(requestChannelUrl());
    expect(url.origin + url.pathname).toBe("https://github.com/OpenTechEvents/ote-tools/issues/new");
    expect(url.searchParams.get("title")).toContain("[Channel request]");
    expect(url.searchParams.get("body")).toContain("submission URL");
  });

  it("offering to build one names the channel", () => {
    const channel = CHANNELS.find((c) => c.id === "newsletter")!;
    const url = new URL(buildChannelUrl(channel));
    expect(url.searchParams.get("title")).toBe("[Channel] Implement Newsletter");
    expect(url.searchParams.get("labels")).toContain("help wanted");
  });
});

describe("guessProfile", () => {
  it("reads conference signals and says which ones", () => {
    const guess = guessProfile(conference);
    expect(guess.profile).toBe("conference");
    expect(guess.reasons).toEqual([
      "it has a call for proposals",
      "it runs 2 days",
      "it sells tickets",
    ]);
  });

  it("falls back to meetup, with its reason", () => {
    const guess = guessProfile(meetup);
    expect(guess.profile).toBe("meetup");
    expect(guess.reasons[0]).toContain("single-day");
  });

  it("a free single-day event with a CFP is still a conference", () => {
    expect(guessProfile({ ...meetup, cfp: { url: "https://x.example" } }).profile).toBe(
      "conference",
    );
  });
});

describe("readiness", () => {
  it("marks what the event carries and what destinations will ask for", () => {
    const items = readiness(meetup);
    const byLabel = new Map(items.map((item) => [item.label, item]));
    expect(byLabel.get("Title")!.present).toBe(true);
    expect(byLabel.get("Venue or joining link")!.present).toBe(false);
    expect(byLabel.get("Venue or joining link")!.wanted).toContain("nowhere to go");
    expect(byLabel.get("Call for proposals")!.present).toBe(false);
  });

  it("reports the fields a fuller event does have", () => {
    const byLabel = new Map(readiness(conference).map((item) => [item.label, item]));
    expect(byLabel.get("Call for proposals")!.detail).toBe("https://example.org/cfp");
    expect(byLabel.get("Tickets or registration")!.present).toBe(true);
  });
});

describe("site snippets", () => {
  const feedUrl = "https://owner.github.io/name/feed.json";
  const urls = subscribeUrls(feedUrl);

  it("pins the widget to a fixed version, never /latest/", () => {
    const snippet = embedSnippet(feedUrl, DEFAULT_EMBED_OPTIONS, "0.6.0");
    expect(snippet).toContain("/embed/v0.6.0/ote-events.js");
    expect(snippet).not.toContain("/latest/");
    expect(snippet).toContain(`<ote-events feed="${feedUrl}"`);
  });

  it("emits only the attributes that differ from the widget's own defaults", () => {
    const plain = embedSnippet(feedUrl, DEFAULT_EMBED_OPTIONS, "0.6.0");
    expect(plain).not.toContain("layout=");
    expect(plain).not.toContain("theme=");
    expect(plain).not.toContain("show-past");

    const tuned = embedSnippet(
      feedUrl,
      { layout: "list", theme: "dark", limit: 5, showPast: true, cardWidth: "large" },
      "0.6.0",
    );
    expect(tuned).toContain('layout="list"');
    expect(tuned).toContain('theme="dark"');
    expect(tuned).toContain('limit="5"');
    expect(tuned).toContain("show-past");
    // card-width means nothing outside the cards layout.
    expect(tuned).not.toContain("card-width");
  });

  it("event-id pins the snippet to one event of the feed", () => {
    const options = { ...DEFAULT_EMBED_OPTIONS, eventId: "https://example.org/events/one" };
    const snippet = embedSnippet(feedUrl, options, "0.7.0");
    expect(snippet).toContain('event-id="https://example.org/events/one"');
    // Still the feed URL: the widget fetches the feed and picks the event
    // out of it, so the embed keeps working when the event is edited.
    expect(snippet).toContain(`feed="${feedUrl}"`);
    expect(embedPreviewAttributes(feedUrl, options)["event-id"]).toBe(
      "https://example.org/events/one",
    );
  });

  it("preview attributes match the snippet, so what you tune is what you copy", () => {
    const options = { ...DEFAULT_EMBED_OPTIONS, layout: "calendar" as const, limit: 3 };
    const attrs = embedPreviewAttributes(feedUrl, options);
    expect(attrs).toEqual({ feed: feedUrl, layout: "calendar", limit: "3" });
    const snippet = embedSnippet(feedUrl, options, "0.6.0");
    expect(snippet).toContain('layout="calendar"');
    expect(snippet).toContain('limit="3"');
  });

  it("subscribe takes one URL per format — a bare feed= renders an empty menu", () => {
    const snippet = subscribeWidgetSnippet(urls, { layout: "menu", name: "My feed" }, "0.6.0");
    expect(snippet).toContain("ote-subscribe.js");
    expect(snippet).toContain(`feed-ics="${urls.ics}"`);
    expect(snippet).toContain(`feed-rss="${urls.rss}"`);
    expect(snippet).toContain(`feed-json="${urls.json}"`);
    expect(snippet).toContain('name="My feed"');
    expect(snippet).not.toMatch(/\sfeed="/);
    expect(subscribePreviewAttributes(urls, { layout: "badges" })).toMatchObject({
      "feed-ics": urls.ics,
      layout: "badges",
    });
  });

  it("derives the ICS and RSS URLs from the feed's own location", () => {
    expect(urls).toEqual({
      ics: "https://owner.github.io/name/feed.ics",
      rss: "https://owner.github.io/name/feed.xml",
      json: feedUrl,
    });
  });
});

describe("previewScriptUrls", () => {
  it("prefers the sibling deployment, then the absolute tools URL", () => {
    // Both apps ship to one Pages site, so in production the relative URL is
    // the very file the snippet names — same origin, same bytes.
    expect(previewScriptUrls("ote-events.js", "0.6.0", "https://tools.opentechevents.org/publish/")).toEqual([
      "https://tools.opentechevents.org/embed/v0.6.0/ote-events.js",
      "https://tools.opentechevents.org/embed/v0.6.0/ote-events.js",
    ]);
    expect(previewScriptUrls("ote-subscribe.js", "0.6.0", "https://example.org/tools/publish/")[0]).toBe(
      "https://example.org/tools/embed/v0.6.0/ote-subscribe.js",
    );
  });
});
