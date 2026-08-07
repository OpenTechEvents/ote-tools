import { afterEach, describe, expect, it } from "vitest";

import {
  ADOPTERS_URL,
  loadAdopters,
  parseAdopters,
  resetAdoptersCache,
  type Adopter,
} from "../src/lib/adopters.js";

describe("parseAdopters", () => {
  it("parses a well-formed entry", () => {
    const raw = {
      adopters: [
        {
          name: "Community Builders Community Events",
          url: "https://combuilderses.github.io/",
          feed: "https://combuilderses.github.io/events/feed.json",
          desc: { en: "A community of communities", es: "Una comunidad de comunidades" },
        },
      ],
    };
    expect(parseAdopters(raw)).toEqual<Adopter[]>([
      {
        name: "Community Builders Community Events",
        url: "https://combuilderses.github.io/",
        feed: "https://combuilderses.github.io/events/feed.json",
        desc: { en: "A community of communities", es: "Una comunidad de comunidades" },
      },
    ]);
  });

  it("drops rows without a usable name, never throws on junk", () => {
    expect(parseAdopters({ adopters: [{ url: "https://x.example" }, { name: "  " }] })).toEqual([]);
    expect(parseAdopters(null)).toEqual([]);
    expect(parseAdopters("nope")).toEqual([]);
    expect(parseAdopters({})).toEqual([]);
    expect(parseAdopters({ adopters: "nope" })).toEqual([]);
  });

  it("omits url/feed/desc when absent, rather than defaulting to \"\"", () => {
    expect(parseAdopters({ adopters: [{ name: "Minimal" }] })).toEqual([{ name: "Minimal" }]);
  });

  it("keeps a single available desc language", () => {
    expect(
      parseAdopters({ adopters: [{ name: "x", desc: { en: "English only" } }] }),
    ).toEqual([{ name: "x", desc: { en: "English only" } }]);
  });
});

describe("loadAdopters", () => {
  afterEach(() => resetAdoptersCache());

  function stubFetch(body: unknown, ok = true): typeof fetch {
    return (async (url: string) => {
      if (url !== ADOPTERS_URL) throw new Error("unexpected URL");
      return { ok, json: async () => body } as Response;
    }) as unknown as typeof fetch;
  }

  it("fetches and parses the adopters list", async () => {
    const result = await loadAdopters(stubFetch({ adopters: [{ name: "x" }] }));
    expect(result).toEqual([{ name: "x" }]);
  });

  it("degrades to an empty list on a non-ok response, never rejecting", async () => {
    await expect(loadAdopters(stubFetch({}, false))).resolves.toEqual([]);
  });

  it("degrades to an empty list when the fetch itself throws", async () => {
    const throwing = (async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;
    await expect(loadAdopters(throwing)).resolves.toEqual([]);
  });

  it("caches the promise across calls", async () => {
    let calls = 0;
    const counting = (async () => {
      calls += 1;
      return { ok: true, json: async () => ({ adopters: [] }) } as Response;
    }) as unknown as typeof fetch;
    await loadAdopters(counting);
    await loadAdopters(counting);
    expect(calls).toBe(1);
  });
});
