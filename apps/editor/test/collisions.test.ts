import { describe, expect, it } from "vitest";

import { findCollisions } from "../src/lib/collisions.js";
import type { ListedEvent } from "../src/lib/types.js";

const listed: ListedEvent[] = [
  {
    slug: "2026-06-async",
    event: {
      id: "https://x.example/events/2026-06-async",
      name: "Async",
      startDate: "2026-06-11",
      timezone: "UTC",
    },
  },
  {
    slug: null, // feed fallback could not derive a filename
    event: {
      id: "https://x.example/",
      name: "No slug",
      startDate: "2026-07-01",
      timezone: "UTC",
    },
  },
];

describe("findCollisions", () => {
  it("flags an existing filename slug", () => {
    const result = findCollisions(listed, "2026-06-async", "https://new.id");
    expect(result.slugTaken).toBe(true);
    expect(result.idTaken).toBe(false);
  });

  it("flags an id already used by another event", () => {
    const result = findCollisions(
      listed,
      "new-slug",
      "https://x.example/events/2026-06-async",
    );
    expect(result.slugTaken).toBe(false);
    expect(result.idTaken).toBe(true);
  });

  it("clean slug and id pass", () => {
    expect(findCollisions(listed, "new-slug", "https://new.id")).toEqual({
      slugTaken: false,
      idTaken: false,
    });
  });

  it("the event being edited never collides with itself", () => {
    const result = findCollisions(
      listed,
      "2026-06-async",
      "https://x.example/events/2026-06-async",
      "2026-06-async",
    );
    expect(result).toEqual({ slugTaken: false, idTaken: false });
  });

  it("empty slug and id are never collisions", () => {
    expect(findCollisions(listed, "", "")).toEqual({
      slugTaken: false,
      idTaken: false,
    });
  });

  it("null slugs in the listing never match", () => {
    // second entry has slug null; searching "" or anything must not match it
    const result = findCollisions(listed, "null", "https://x.example/");
    expect(result.slugTaken).toBe(false);
    expect(result.idTaken).toBe(true);
  });
});
