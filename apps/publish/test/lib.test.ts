import { describe, expect, it } from "vitest";

import { feedUrls, parseFeedSource } from "../src/lib/feed-source.js";
import { buildSnippet, eligibilityNote } from "../src/lib/snippet.js";
import type { OteFeed } from "@opentechevents/export-jsonld";

const feed: OteFeed = {
  specVersion: "0.3.0",
  title: "Two events",
  updatedAt: "2026-07-06T10:00:00Z",
  events: [
    {
      id: "https://example.org/events/one",
      url: "https://example.org/events/one",
      name: "One",
      startDate: "2026-06-11T18:30",
      timezone: "Europe/Madrid",
    },
    {
      id: "https://example.org/events/two",
      name: "Two",
      startDate: "2026-07-11T18:30",
      timezone: "Europe/Madrid",
    },
  ],
};

describe("parseFeedSource", () => {
  it("reads ?repo=owner/name", () => {
    expect(parseFeedSource("?repo=OpenTechEvents/ote-template")).toEqual({
      kind: "repo",
      repo: "OpenTechEvents/ote-template",
    });
  });

  it("reads ?feed=<url>", () => {
    expect(parseFeedSource("?feed=https://example.org/feed.json")).toEqual({
      kind: "url",
      url: "https://example.org/feed.json",
    });
  });

  it("prefers repo when both are given", () => {
    const source = parseFeedSource("?repo=a/b&feed=https://example.org/feed.json");
    expect(source).toEqual({ kind: "repo", repo: "a/b" });
  });

  it("rejects a malformed repo, a non-http URL and an empty query", () => {
    expect(parseFeedSource("?repo=not-a-repo")).toBeNull();
    expect(parseFeedSource("?feed=javascript:alert(1)")).toBeNull();
    expect(parseFeedSource("?feed=data:text/json,{}")).toBeNull();
    expect(parseFeedSource("")).toBeNull();
  });
});

describe("feedUrls", () => {
  it("tries a fork's Pages site first, then the default branch", () => {
    expect(feedUrls({ kind: "repo", repo: "owner/name" })).toEqual([
      "https://owner.github.io/name/feed.json",
      "https://raw.githubusercontent.com/owner/name/HEAD/feed.json",
    ]);
  });

  it("uses a direct URL as given", () => {
    expect(feedUrls({ kind: "url", url: "https://example.org/feed.json" })).toEqual([
      "https://example.org/feed.json",
    ]);
  });
});

describe("eligibilityNote", () => {
  const online: OteFeed = {
    ...feed,
    events: [
      { ...feed.events[0]!, location: { onlineUrl: "https://meet.example/a" } },
      { ...feed.events[1]!, location: { venue: "https://meet.example/b" } },
    ],
  };
  const physical: OteFeed = {
    ...feed,
    events: feed.events.map((event) => ({ ...event, location: { venue: "Las Naves, València" } })),
  };

  it("says nothing when every event has a physical venue", () => {
    expect(eligibilityNote(physical, { kind: "graph" })).toBeNull();
    expect(eligibilityNote(physical, { kind: "event", index: 0 })).toBeNull();
  });

  it("warns for a single online-only event", () => {
    // A venue that is a meeting URL is not a physical location either.
    expect(eligibilityNote(online, { kind: "event", index: 1 })).toContain("no physical venue");
  });

  it("warns that no event is eligible when none has a venue", () => {
    expect(eligibilityNote(online, { kind: "graph" })).toContain("None of these events");
  });

  it("counts the online-only ones when the feed is mixed", () => {
    const mixed: OteFeed = { ...feed, events: [online.events[0]!, physical.events[1]!] };
    expect(eligibilityNote(mixed, { kind: "item-list" })).toContain("1 of 2 events");
  });
});

describe("buildSnippet", () => {
  const parse = (snippet: string): unknown =>
    JSON.parse(snippet.split("\n").slice(1, -1).join("\n"));

  it("graph: every event in one document", () => {
    const document = parse(buildSnippet(feed, { kind: "graph" })) as Record<string, unknown>;
    expect((document["@graph"] as unknown[]).length).toBe(2);
  });

  it("item-list: an ItemList of the feed", () => {
    const document = parse(buildSnippet(feed, { kind: "item-list" })) as Record<string, unknown>;
    expect(document["@type"]).toBe("ItemList");
  });

  it("event: the selected event alone", () => {
    const document = parse(buildSnippet(feed, { kind: "event", index: 1 })) as Record<
      string,
      unknown
    >;
    expect(document.name).toBe("Two");
    expect(document["@context"]).toBe("https://schema.org");
  });

  it("throws rather than emitting an empty snippet for a missing event", () => {
    expect(() => buildSnippet(feed, { kind: "event", index: 9 })).toThrow("no event at index 9");
  });
});
