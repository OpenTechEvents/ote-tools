import { describe, expect, it } from "vitest";

import {
  contentsApiUrl,
  editorContextFromSearch,
  pagesFeedUrl,
  parseContentsListing,
  parseFeedListing,
  parseRepoParam,
  repoFetchPlan,
  rawConfigUrl,
  slugFromId,
} from "../src/lib/repo.js";

describe("parseRepoParam", () => {
  it("accepts owner/name", () => {
    expect(parseRepoParam("?repo=octocat/my-events")).toBe("octocat/my-events");
  });

  it("accepts dots, underscores and hyphens in the repo name", () => {
    expect(parseRepoParam("?repo=my-org/ote.data_2026")).toBe(
      "my-org/ote.data_2026",
    );
  });

  it("rejects missing, malformed or path-traversing values", () => {
    expect(parseRepoParam("")).toBeNull();
    expect(parseRepoParam("?repo=")).toBeNull();
    expect(parseRepoParam("?repo=just-owner")).toBeNull();
    expect(parseRepoParam("?repo=a/b/c")).toBeNull();
    expect(parseRepoParam("?repo=../../etc")).toBeNull();
    expect(parseRepoParam("?repo=owner/name?x=1")).toBeNull();
  });
});

describe("editorContextFromSearch / repoFetchPlan", () => {
  it("uses generator mode without a repo and plans no GitHub fetches", () => {
    const context = editorContextFromSearch("");
    expect(context).toEqual({ mode: "generator" });
    expect(repoFetchPlan(context)).toBeNull();
  });

  it("uses repo mode when ?repo= is valid", () => {
    const context = editorContextFromSearch("?repo=octocat/my-events");
    expect(context).toEqual({ mode: "repo", repo: "octocat/my-events" });
    expect(repoFetchPlan(context)).toEqual({
      configUrl:
        "https://raw.githubusercontent.com/octocat/my-events/HEAD/ote.config.json",
      contentsUrl:
        "https://api.github.com/repos/octocat/my-events/contents/events",
      pagesFeedUrl: "https://octocat.github.io/my-events/feed.json",
      repoApiUrl: "https://api.github.com/repos/octocat/my-events",
    });
  });
});

describe("URL builders", () => {
  it("builds the raw config URL against HEAD", () => {
    expect(rawConfigUrl("o/r")).toBe(
      "https://raw.githubusercontent.com/o/r/HEAD/ote.config.json",
    );
  });

  it("builds the contents API URL for events/", () => {
    expect(contentsApiUrl("o/r")).toBe(
      "https://api.github.com/repos/o/r/contents/events",
    );
  });

  it("builds the Pages feed URL from owner and name", () => {
    expect(pagesFeedUrl("octocat/my-events")).toBe(
      "https://octocat.github.io/my-events/feed.json",
    );
  });
});

describe("parseContentsListing", () => {
  it("keeps only *.json files and derives the slug from the filename", () => {
    const listing = [
      { type: "file", name: "2026-06-async.json", download_url: "https://raw/x" },
      { type: "file", name: "README.md", download_url: "https://raw/y" },
      { type: "dir", name: "archive.json", download_url: null },
    ];
    expect(parseContentsListing(listing)).toEqual([
      { slug: "2026-06-async", rawUrl: "https://raw/x" },
    ]);
  });

  it("returns [] for non-array or malformed input", () => {
    expect(parseContentsListing({ message: "Not Found" })).toEqual([]);
    expect(parseContentsListing(null)).toEqual([]);
    expect(parseContentsListing([null, 42, "x"])).toEqual([]);
  });
});

describe("slugFromId", () => {
  it("takes the last path segment of the id URI", () => {
    expect(slugFromId("https://pyalmeria.example/eventos/2026-06-async")).toBe(
      "2026-06-async",
    );
  });

  it("strips a .json extension", () => {
    expect(slugFromId("https://x.example/events/foo.json")).toBe("foo");
  });

  it("ignores the fragment", () => {
    expect(slugFromId("https://calendar.example/ics/rust-madrid#a1b2-uid")).toBe(
      "rust-madrid",
    );
  });

  it("returns null when nothing filename-safe can be derived", () => {
    expect(slugFromId("not a uri")).toBeNull();
    expect(slugFromId("https://x.example/")).toBeNull();
    expect(slugFromId("https://x.example/eventos/a%2Fb")).toBeNull();
    expect(slugFromId(undefined)).toBeNull();
  });
});

describe("parseFeedListing", () => {
  it("maps feed events to listed events with derived slugs", () => {
    const feed = {
      events: [
        { id: "https://x.example/events/2026-06-async", name: "Async" },
        { id: "https://x.example/", name: "No slug" },
      ],
    };
    const listed = parseFeedListing(feed);
    expect(listed).toHaveLength(2);
    expect(listed[0].slug).toBe("2026-06-async");
    expect(listed[1].slug).toBeNull();
  });

  it("returns [] for malformed feeds", () => {
    expect(parseFeedListing(null)).toEqual([]);
    expect(parseFeedListing({})).toEqual([]);
    expect(parseFeedListing({ events: "nope" })).toEqual([]);
  });
});
