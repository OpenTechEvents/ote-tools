import { describe, expect, it } from "vitest";

import { forkFileUrls, httpUrl, pagesUrls } from "../src/index.js";

describe("httpUrl", () => {
  it("keeps http and https and rejects everything else", () => {
    expect(httpUrl("https://example.org/feed.json")).toBe("https://example.org/feed.json");
    expect(httpUrl("http://example.org/feed.json")).toBe("http://example.org/feed.json");
    expect(httpUrl("javascript:alert(1)")).toBeNull();
    expect(httpUrl("data:text/json,{}")).toBeNull();
    expect(httpUrl("not a url")).toBeNull();
    expect(httpUrl(undefined)).toBeNull();
    expect(httpUrl("")).toBeNull();
  });
});

describe("pagesUrls", () => {
  it("is just the github.io URL without a referrer", () => {
    expect(pagesUrls("owner/name", "feed.json")).toEqual([
      "https://owner.github.io/name/feed.json",
    ]);
  });

  // The reason this module exists: the github.io URL 301s to the custom
  // domain and the redirect carries no CORS header, so it can never succeed.
  it("puts the referrer's origin first, as a possible custom domain", () => {
    expect(
      pagesUrls("ComBuildersES/events", "feed.ics", {
        referrer: "https://communitybuilders.dev/events/",
        origin: "https://tools.example",
      }),
    ).toEqual([
      "https://communitybuilders.dev/events/feed.ics",
      "https://communitybuilders.dev/feed.ics",
      // The owner is used verbatim: hostnames are case-insensitive anyway.
      "https://ComBuildersES.github.io/events/feed.ics",
    ]);
  });

  it("ignores a referrer from the tool itself", () => {
    expect(
      pagesUrls("owner/name", "feed.json", {
        referrer: "https://tools.example/publish/",
        origin: "https://tools.example",
      }),
    ).toEqual(["https://owner.github.io/name/feed.json"]);
  });

  it("never repeats a candidate when the referrer is the Pages site", () => {
    expect(
      pagesUrls("owner/name", "feed.json", {
        referrer: "https://owner.github.io/name/",
        origin: "https://tools.example",
      }),
    ).toEqual(["https://owner.github.io/name/feed.json", "https://owner.github.io/feed.json"]);
  });

  it("ignores a referrer that is not an http(s) URL", () => {
    expect(pagesUrls("owner/name", "feed.json", { referrer: "about:blank" })).toEqual([
      "https://owner.github.io/name/feed.json",
    ]);
  });
});

describe("forkFileUrls", () => {
  it("adds the default branch after the Pages candidates", () => {
    expect(forkFileUrls("owner/name", "feed.xml")).toEqual([
      "https://owner.github.io/name/feed.xml",
      "https://raw.githubusercontent.com/owner/name/HEAD/feed.xml",
    ]);
  });
});
