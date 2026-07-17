import { afterEach, describe, expect, it } from "vitest";

import {
  loadTagVocabulary,
  mergeVocabularies,
  parseVocabulary,
  resetTagVocabularyCache,
  searchVocabulary,
  TAG_VOCABULARY_URLS,
  type TagSuggestion,
} from "../src/lib/tag-vocabulary.js";

const tagsFile = [
  {
    id: "javascript",
    label: "JavaScript",
    category: "Programming Languages",
    synonyms: ["js", "ecmascript"],
  },
  {
    id: "cpp",
    label: "C++",
    category: "Programming Languages",
    synonyms: ["c plus plus"],
  },
];

const audienceFile = [
  {
    id: "student",
    label: "Student",
    category: "Career Stage",
    synonyms: ["university student"],
  },
];

describe("parseVocabulary", () => {
  it("normalizes an entry and folds label + synonyms into keywords", () => {
    const [entry] = parseVocabulary(tagsFile);
    expect(entry).toEqual({
      id: "javascript",
      label: "JavaScript",
      category: "Programming Languages",
      keywords: ["javascript", "js", "ecmascript"],
    });
  });

  it("falls back to the id when a label is missing", () => {
    expect(parseVocabulary([{ id: "rust" }])[0]).toMatchObject({
      id: "rust",
      label: "rust",
      category: "",
      keywords: ["rust"],
    });
  });

  it("skips rows without a usable id and never throws on junk", () => {
    expect(parseVocabulary([{ label: "no id" }, { id: "  " }, 42])).toEqual([]);
    expect(parseVocabulary(null)).toEqual([]);
    expect(parseVocabulary("nope")).toEqual([]);
  });
});

describe("mergeVocabularies", () => {
  it("concatenates lists and keeps the first occurrence of a duplicate id", () => {
    const a = parseVocabulary([{ id: "go", label: "Go" }]);
    const b = parseVocabulary([{ id: "go", label: "Golang" }, ...audienceFile]);
    const merged = mergeVocabularies([a, b]);
    expect(merged.map((e) => e.id)).toEqual(["go", "student"]);
    expect(merged[0].label).toBe("Go");
  });
});

describe("searchVocabulary", () => {
  const vocab: TagSuggestion[] = mergeVocabularies([
    parseVocabulary(tagsFile),
    parseVocabulary(audienceFile),
  ]);

  it("returns the head of the list for an empty query", () => {
    expect(searchVocabulary(vocab, "", []).map((e) => e.id)).toEqual([
      "javascript",
      "cpp",
      "student",
    ]);
  });

  it("matches by id/label prefix, synonym and substring", () => {
    expect(searchVocabulary(vocab, "java", []).map((e) => e.id)).toEqual([
      "javascript",
    ]);
    // synonym word-start
    expect(searchVocabulary(vocab, "js", []).map((e) => e.id)).toEqual([
      "javascript",
    ]);
    // C++'s label/id prefix "c" outranks javascript's "ecmascript" substring
    expect(searchVocabulary(vocab, "c", []).map((e) => e.id)).toEqual([
      "cpp",
      "javascript",
    ]);
  });

  it("excludes already-chosen values and honours the limit", () => {
    expect(
      searchVocabulary(vocab, "", ["javascript"]).map((e) => e.id),
    ).not.toContain("javascript");
    expect(searchVocabulary(vocab, "", [], 1)).toHaveLength(1);
  });
});

describe("loadTagVocabulary", () => {
  afterEach(() => resetTagVocabularyCache());

  function stubFetch(bodies: Record<string, unknown>): typeof fetch {
    return (async (url: string) => {
      const body = bodies[url];
      if (body === undefined) throw new Error("network down");
      return { ok: true, json: async () => body } as Response;
    }) as unknown as typeof fetch;
  }

  it("fetches, parses and merges both source lists", async () => {
    const merged = await loadTagVocabulary(
      stubFetch({
        [TAG_VOCABULARY_URLS[0]]: tagsFile,
        [TAG_VOCABULARY_URLS[1]]: audienceFile,
      }),
    );
    expect(merged.map((e) => e.id)).toEqual(["javascript", "cpp", "student"]);
  });

  it("drops only the failing list, keeping the other", async () => {
    resetTagVocabularyCache();
    const merged = await loadTagVocabulary(
      stubFetch({ [TAG_VOCABULARY_URLS[0]]: tagsFile }),
    );
    expect(merged.map((e) => e.id)).toEqual(["javascript", "cpp"]);
  });

  it("degrades to an empty list when everything fails, never rejecting", async () => {
    resetTagVocabularyCache();
    await expect(loadTagVocabulary(stubFetch({}))).resolves.toEqual([]);
  });

  it("caches the promise across calls", async () => {
    resetTagVocabularyCache();
    let calls = 0;
    const counting = (async (_url: string) => {
      calls += 1;
      return { ok: true, json: async () => tagsFile } as Response;
    }) as unknown as typeof fetch;
    await loadTagVocabulary(counting);
    await loadTagVocabulary(counting);
    expect(calls).toBe(TAG_VOCABULARY_URLS.length);
  });
});
