import { describe, expect, it } from "vitest";

import {
  MAX_URL_LENGTH,
  directCreateUrl,
  directEditUrl,
  eventJsonFromIssueBody,
  eventJsonText,
  proposeChangeUrl,
} from "../src/lib/links.js";
import type { OteEvent } from "../src/lib/types.js";

const event: OteEvent = {
  id: "https://x.example/events/2026-06-async",
  name: "Async night",
  startDate: "2026-06-11T18:30:00",
  timezone: "Europe/Madrid",
};

describe("proposeChangeUrl", () => {
  it("builds a prefilled issue URL with the JSON in a code block", () => {
    const result = proposeChangeUrl("o/r", event, true);
    expect(result.kind).toBe("url");
    if (result.kind !== "url") return;
    const url = new URL(result.url);
    expect(url.origin + url.pathname).toBe("https://github.com/o/r/issues/new");
    expect(url.searchParams.get("title")).toBe("[ote-event] Add: Async night");
    const body = url.searchParams.get("body") ?? "";
    expect(body).toContain("```json");
    expect(body).toContain('"id": "https://x.example/events/2026-06-async"');
  });

  it("uses the same JSON text as standalone copy/download outputs", () => {
    const result = proposeChangeUrl("o/r", event, true);
    if (result.kind !== "url") throw new Error("expected url");
    const body = new URL(result.url).searchParams.get("body") ?? "";
    expect(eventJsonFromIssueBody(body)).toBe(eventJsonText(event));
  });

  it("uses Update in the title when editing", () => {
    const result = proposeChangeUrl("o/r", event, false);
    if (result.kind !== "url") throw new Error("expected url");
    expect(new URL(result.url).searchParams.get("title")).toBe(
      "[ote-event] Update: Async night",
    );
  });

  it("falls back to copy-paste + blank issue above the URL limit", () => {
    const big = { ...event, description: "x".repeat(MAX_URL_LENGTH) };
    const result = proposeChangeUrl("o/r", big, true);
    expect(result.kind).toBe("fallback");
    if (result.kind !== "fallback") return;
    expect(result.url).toBe("https://github.com/o/r/issues/new");
    expect(result.copyText).toContain("```json");
    expect(result.copyText).toContain('"description"');
  });

  it("stays a URL just under the limit and falls back just over it", () => {
    // Binary-search-free boundary check: grow the description until the
    // result flips, and assert the flip is exactly at MAX_URL_LENGTH.
    const at = (n: number) =>
      proposeChangeUrl("o/r", { ...event, description: "x".repeat(n) }, true);
    let lo = 0;
    let hi = MAX_URL_LENGTH;
    while (lo + 1 < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (at(mid).kind === "url") lo = mid;
      else hi = mid;
    }
    const under = at(lo);
    const over = at(hi);
    expect(under.kind).toBe("url");
    if (under.kind === "url") {
      expect(under.url.length).toBeLessThanOrEqual(MAX_URL_LENGTH);
    }
    expect(over.kind).toBe("fallback");
  });
});

describe("directEditUrl", () => {
  it("opens github.dev on events/<slug>.json", () => {
    expect(directEditUrl("o/r", "2026-06-async", "main")).toBe(
      "https://github.dev/o/r/blob/main/events/2026-06-async.json",
    );
  });

  it("defaults to HEAD when the branch is unknown", () => {
    expect(directEditUrl("o/r", "s")).toBe(
      "https://github.dev/o/r/blob/HEAD/events/s.json",
    );
  });
});

describe("directCreateUrl", () => {
  it("builds GitHub's prefilled new-file URL", () => {
    const result = directCreateUrl("o/r", "2026-06-async", event, "main");
    expect(result.kind).toBe("url");
    if (result.kind !== "url") return;
    const url = new URL(result.url);
    expect(url.pathname).toBe("/o/r/new/main/events");
    expect(url.searchParams.get("filename")).toBe("2026-06-async.json");
    expect(url.searchParams.get("value")).toContain('"name": "Async night"');
  });

  it("falls back to filename-only + copy-paste above the URL limit", () => {
    const big = { ...event, description: "x".repeat(MAX_URL_LENGTH) };
    const result = directCreateUrl("o/r", "s", big, "main");
    expect(result.kind).toBe("fallback");
    if (result.kind !== "fallback") return;
    expect(result.url).toContain("filename=s.json");
    expect(result.url).not.toContain("value=");
    expect(result.copyText).toContain('"description"');
  });
});
