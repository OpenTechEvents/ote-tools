import { describe, expect, it } from "vitest";

import { parseRecentTags, withRecentTag } from "../src/lib/tag-history.js";

describe("parseRecentTags", () => {
  it("returns an empty list for null/malformed/foreign JSON", () => {
    expect(parseRecentTags(null)).toEqual([]);
    expect(parseRecentTags("not json")).toEqual([]);
    expect(parseRecentTags("{}")).toEqual([]);
    expect(parseRecentTags('[1, 2, "javascript"]')).toEqual(["javascript"]);
  });

  it("round-trips a plain string array", () => {
    expect(parseRecentTags('["javascript","rust"]')).toEqual(["javascript", "rust"]);
  });
});

describe("withRecentTag", () => {
  it("inserts a new id at the front", () => {
    expect(withRecentTag(["rust"], "javascript")).toEqual(["javascript", "rust"]);
  });

  it("moves an existing id to the front instead of duplicating it", () => {
    expect(withRecentTag(["rust", "javascript", "go"], "javascript")).toEqual([
      "javascript",
      "rust",
      "go",
    ]);
  });

  it("caps the list at 20 entries, dropping the oldest", () => {
    const current = Array.from({ length: 20 }, (_, i) => `tag-${i}`);
    const result = withRecentTag(current, "new-tag");
    expect(result).toHaveLength(20);
    expect(result[0]).toBe("new-tag");
    expect(result).not.toContain("tag-19");
  });
});
