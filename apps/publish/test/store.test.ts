import { beforeEach, describe, expect, it } from "vitest";

import {
  feedKey,
  readFavourites,
  readPinnedEvent,
  readTheme,
  resolvePinnedEvent,
  toggleFavourite,
  writeFavourites,
  writePinnedEvent,
  writeTheme,
} from "../src/lib/store.js";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

/** A runtime that exposes localStorage and then throws on every use. */
const hostile = {
  getItem(): never {
    throw new DOMException("denied");
  },
  setItem(): never {
    throw new DOMException("denied");
  },
  removeItem(): never {
    throw new DOMException("denied");
  },
};

function useStorage(storage: unknown): void {
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
    writable: true,
  });
}

const FEED = "https://owner.github.io/name/feed.json";

const events = [
  { id: "a", startDate: "2026-01-10" },
  { id: "b", startDate: "2026-09-01T18:30" },
  { id: "c", startDate: "2026-12-05" },
];

beforeEach(() => {
  useStorage(new MemoryStorage());
});

describe("the pinned event", () => {
  it("round-trips per feed, so two forks never share a pin", () => {
    writePinnedEvent(FEED, "b");
    writePinnedEvent("https://other.example/feed.json", "z");
    expect(readPinnedEvent(FEED)).toBe("b");
    expect(readPinnedEvent("https://other.example/feed.json")).toBe("z");
  });

  it("ignores the cache-busting query the feed was fetched with", () => {
    writePinnedEvent(`${FEED}?_=123`, "b");
    expect(readPinnedEvent(FEED)).toBe("b");
    expect(feedKey(`${FEED}?_=999#x`)).toBe(FEED);
  });

  it("keeps the stored event when it is still in the feed", () => {
    expect(resolvePinnedEvent(events, "a", new Date("2026-06-01T00:00:00Z"))).toBe("a");
  });

  /**
   * The stored event can vanish: the organizer deleted it, or the feed was
   * rebuilt with new ids. Falling back to the next upcoming event is the only
   * answer that is useful — and never to "all of them", which is the framing
   * this redesign exists to remove.
   */
  it("falls back to the next upcoming event when the stored one is gone", () => {
    expect(resolvePinnedEvent(events, "gone", new Date("2026-06-01T00:00:00Z"))).toBe("b");
    expect(resolvePinnedEvent(events, null, new Date("2026-06-01T00:00:00Z"))).toBe("b");
  });

  it("falls back to the most recent event when everything is in the past", () => {
    expect(resolvePinnedEvent(events, null, new Date("2027-01-01T00:00:00Z"))).toBe("c");
  });

  it("has nothing to pin in an empty feed", () => {
    expect(resolvePinnedEvent([], "a")).toBeNull();
  });
});

describe("favourites", () => {
  it("keeps the order they were starred in", () => {
    let ids = toggleFavourite([], "meetup");
    ids = toggleFavourite(ids, "mastodon");
    ids = toggleFavourite(ids, "confs-tech");
    writeFavourites(ids);
    expect(readFavourites()).toEqual(["meetup", "mastodon", "confs-tech"]);
  });

  it("un-starring removes only that one", () => {
    expect(toggleFavourite(["a", "b", "c"], "b")).toEqual(["a", "c"]);
  });

  it("survives a corrupted value rather than taking the page down with it", () => {
    globalThis.localStorage.setItem("ote-publish-favourites", "{not json");
    expect(readFavourites()).toEqual([]);
    globalThis.localStorage.setItem("ote-publish-favourites", '"a string"');
    expect(readFavourites()).toEqual([]);
    globalThis.localStorage.setItem("ote-publish-favourites", '["ok", 42]');
    expect(readFavourites()).toEqual(["ok"]);
  });
});

describe("theme", () => {
  it("stores only an explicit choice — system is the absence of one", () => {
    expect(readTheme()).toBe("system");
    writeTheme("dark");
    expect(readTheme()).toBe("dark");
    writeTheme("system");
    expect(readTheme()).toBe("system");
    expect(globalThis.localStorage.getItem("ote-publish-theme")).toBeNull();
  });
});

/**
 * Safari's private mode and a storage-blocked iframe both expose
 * `localStorage` and then throw on first use. Losing a preference is fine;
 * losing the tool is not.
 */
describe("a storage that throws", () => {
  it("degrades to no memory at all, without raising", () => {
    useStorage(hostile);
    expect(() => writePinnedEvent(FEED, "b")).not.toThrow();
    expect(readPinnedEvent(FEED)).toBeNull();
    expect(readFavourites()).toEqual([]);
    expect(readTheme()).toBe("system");
  });

  it("survives a runtime with no localStorage at all", () => {
    useStorage(undefined);
    expect(readPinnedEvent(FEED)).toBeNull();
    expect(() => writeFavourites(["a"])).not.toThrow();
  });
});
