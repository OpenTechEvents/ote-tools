import { describe, expect, it } from "vitest";

import { parseAdopterRegistry } from "../src/adopters.js";

const ok = { name: "CoruñaJUG", feed: "https://corunajug.org/feed.json" };

describe("parseAdopterRegistry", () => {
  it("keeps a well-formed entry unchanged", () => {
    expect(parseAdopterRegistry({ adopters: [ok] })).toEqual([ok]);
  });

  it.each([
    ["a non-object", 42],
    ["null", null],
    ["undefined", undefined],
    ["no adopters key", { feeds: [ok] }],
    ["adopters that is not an array", { adopters: { 0: ok } }],
  ])("returns nothing for %s rather than throwing", (_label, registry) => {
    // The registry is a third-party file this page cannot validate ahead of
    // time; it has been parsed without a shape check once already.
    expect(parseAdopterRegistry(registry)).toEqual([]);
  });

  it.each([
    ["no feed", { name: "No feed" }],
    ["no name", { feed: "https://example.org/feed.json" }],
    ["a non-string name", { name: 7, feed: "https://example.org/feed.json" }],
    ["a non-string feed", { name: "Odd", feed: ["https://example.org/feed.json"] }],
    ["an unparseable feed", { name: "Broken", feed: "not a url" }],
    ["a javascript: feed", { name: "Hostile", feed: "javascript:alert(1)" }],
    ["a data: feed", { name: "Hostile", feed: "data:application/json,{}" }],
    ["a file: feed", { name: "Local", feed: "file:///etc/passwd" }],
    ["credentials in the URL", { name: "Creds", feed: "https://u:p@example.org/feed.json" }],
    ["a username alone", { name: "Creds", feed: "https://u@example.org/feed.json" }],
    ["null in the list", null],
  ])("drops an entry with %s", (_label, entry) => {
    expect(parseAdopterRegistry({ adopters: [entry] })).toEqual([]);
  });

  it("keeps the good entries and drops the bad ones in the same registry", () => {
    // One hostile entry must not cost the page its whole example list.
    const registry = {
      adopters: [{ name: "Hostile", feed: "javascript:alert(1)" }, ok, { name: "No feed" }],
    };
    expect(parseAdopterRegistry(registry)).toEqual([ok]);
  });

  it("allows http, because a feed may legitimately be served over it", () => {
    const plain = { name: "Plain", feed: "http://example.org/feed.json" };
    expect(parseAdopterRegistry({ adopters: [plain] })).toEqual([plain]);
  });

  it("preserves the feed URL exactly, query string included", () => {
    // `new URL()` is a check here, not a normaliser: the value handed to the
    // widget and printed into the snippet must be what was registered.
    const query = { name: "Query", feed: "https://example.org/feed?one=1&two=2" };
    expect(parseAdopterRegistry({ adopters: [query] })[0].feed).toBe(query.feed);
  });

  it("closes over nothing, so it survives being embedded as source text", () => {
    // workers/convert serves a classic <script> built from a template string
    // and embeds this function's source. That only works while the function
    // has no free variables — a new import would break the converter's
    // picker, not this one, and silently.
    const standalone = new Function(`return (${parseAdopterRegistry});`)() as typeof parseAdopterRegistry;
    expect(standalone({ adopters: [ok, { name: "Hostile", feed: "javascript:alert(1)" }] })).toEqual([ok]);
  });
});
