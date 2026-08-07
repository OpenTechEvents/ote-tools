import { describe, expect, it } from "vitest";

import {
  parseRecentRepos,
  withoutRecentRepo,
  withRecentRepo,
} from "../src/lib/recent-repos.js";

describe("parseRecentRepos", () => {
  it("returns an empty list for null/malformed/foreign JSON", () => {
    expect(parseRecentRepos(null)).toEqual([]);
    expect(parseRecentRepos("not json")).toEqual([]);
    expect(parseRecentRepos("{}")).toEqual([]);
    expect(parseRecentRepos("[1, 2, {}]")).toEqual([]);
  });

  it("round-trips entries with and without a title", () => {
    expect(
      parseRecentRepos('[{"repo":"o/r","title":"My Feed"},{"repo":"o2/r2"}]'),
    ).toEqual([{ repo: "o/r", title: "My Feed" }, { repo: "o2/r2" }]);
  });

  it("drops entries with no usable repo, keeps the rest", () => {
    expect(parseRecentRepos('[{"title":"no repo"},{"repo":"o/r"}]')).toEqual([
      { repo: "o/r" },
    ]);
  });
});

describe("withRecentRepo", () => {
  it("inserts a new repo at the front", () => {
    expect(withRecentRepo([{ repo: "a/b" }], "c/d")).toEqual([
      { repo: "c/d" },
      { repo: "a/b" },
    ]);
  });

  it("moves an existing repo to the front instead of duplicating it, case-insensitively", () => {
    expect(
      withRecentRepo([{ repo: "a/b" }, { repo: "C/D" }, { repo: "e/f" }], "c/d"),
    ).toEqual([{ repo: "c/d" }, { repo: "a/b" }, { repo: "e/f" }]);
  });

  it("a title arg updates the stored entry", () => {
    expect(withRecentRepo([{ repo: "a/b" }], "a/b", "My Feed")).toEqual([
      { repo: "a/b", title: "My Feed" },
    ]);
  });

  it("omitting title keeps whatever was already stored, instead of blanking it", () => {
    expect(withRecentRepo([{ repo: "a/b", title: "My Feed" }], "a/b")).toEqual([
      { repo: "a/b", title: "My Feed" },
    ]);
  });

  it("caps the list at 6 entries, dropping the oldest", () => {
    const current = Array.from({ length: 6 }, (_, i) => ({ repo: `o/r${i}` }));
    const result = withRecentRepo(current, "o/new");
    expect(result).toHaveLength(6);
    expect(result[0]).toEqual({ repo: "o/new" });
    expect(result).not.toContainEqual({ repo: "o/r5" });
  });
});

describe("withoutRecentRepo", () => {
  it("drops the matching entry, keeping the rest in order", () => {
    const current = [{ repo: "a/b" }, { repo: "c/d", title: "C/D" }, { repo: "e/f" }];
    expect(withoutRecentRepo(current, "c/d")).toEqual([{ repo: "a/b" }, { repo: "e/f" }]);
  });

  it("matches case-insensitively", () => {
    expect(withoutRecentRepo([{ repo: "A/B" }], "a/b")).toEqual([]);
  });

  it("is a no-op when the repo isn't in the list", () => {
    const current = [{ repo: "a/b" }];
    expect(withoutRecentRepo(current, "x/y")).toEqual(current);
  });
});
