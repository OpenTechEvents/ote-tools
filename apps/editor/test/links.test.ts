import { describe, expect, it } from "vitest";

import {
  GITHUB_ISSUE_BODY_MAX_LENGTH,
  MAX_URL_LENGTH,
  bulkDeleteIssueBody,
  bulkEditIssueBody,
  directCreateUrl,
  directDeleteUrl,
  directEditFeedConfigUrl,
  directEditUrl,
  directFeedConfigUrl,
  eventJsonFromIssueBody,
  eventJsonText,
  exceedsIssueBodyLimit,
  patchIssueBody,
  proposeBatchChangeUrl,
  proposeBulkDeleteUrl,
  proposeBulkEditUrl,
  proposeChangeUrl,
  proposeDeleteUrl,
  recurringTemplateIssueBody,
  type RecurringOccurrenceOverride,
} from "../src/lib/links.js";
import type { BulkEditEntry } from "../src/lib/series.js";
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

const secondEvent: OteEvent = {
  id: "https://x.example/events/2026-07-async",
  name: "Async night #2",
  startDate: "2026-07-09T18:30:00",
  timezone: "Europe/Madrid",
};

const occurrences: RecurringOccurrenceOverride[] = [
  { id: "https://x.example/events/2026-06-async", startDate: "2026-06-11T18:30" },
  { id: "https://x.example/events/2026-07-async", startDate: "2026-07-09T18:30", endDate: "2026-07-09T20:00" },
];

describe("recurringTemplateIssueBody", () => {
  it("emits one _oteBatchMode: recurring-template block with the template and occurrences", () => {
    const body = recurringTemplateIssueBody(event, occurrences);
    expect(body.match(/```json/g)).toHaveLength(1);
    const match = /```json\n([\s\S]*?)\n```/.exec(body);
    const parsed = JSON.parse(match![1]!) as {
      _oteBatchMode: string;
      template: OteEvent;
      occurrences: RecurringOccurrenceOverride[];
    };
    expect(parsed._oteBatchMode).toBe("recurring-template");
    expect(parsed.template).toEqual(event);
    expect(parsed.occurrences).toEqual(occurrences);
  });

  it("mentions the occurrence count in the intro", () => {
    expect(recurringTemplateIssueBody(event, occurrences)).toContain("2 events");
  });

  it("attaches _localizeImages to the template when given", () => {
    const body = recurringTemplateIssueBody(event, occurrences, ["https://x.example/img.jpg"]);
    const match = /```json\n([\s\S]*?)\n```/.exec(body);
    const parsed = JSON.parse(match![1]!) as { template: { _localizeImages?: string[] } };
    expect(parsed.template._localizeImages).toEqual(["https://x.example/img.jpg"]);
  });
});

describe("proposeBatchChangeUrl", () => {
  it("is always a blank-issue + copy-paste fallback, never a prefilled URL", () => {
    // Even a tiny 2-occurrence batch: batch submission never tries the
    // single-event URL-prefill optimization.
    const result = proposeBatchChangeUrl("o/r", event, occurrences);
    expect(result.kind).toBe("fallback");
  });

  it("points the blank issue at the right repo, titled with the series name and count", () => {
    const result = proposeBatchChangeUrl("o/r", event, occurrences);
    if (result.kind !== "fallback") throw new Error("expected fallback");
    const url = new URL(result.url);
    expect(url.origin + url.pathname).toBe("https://github.com/o/r/issues/new");
    expect(url.searchParams.get("title")).toBe("[ote-event] Add Async night series (2 events)");
    expect(url.searchParams.get("labels")).toBe("ote-event,ote-batch");
  });

  it("falls back to a count-only title when the template has no name", () => {
    const unnamedTemplate = { ...event } as Record<string, unknown>;
    delete unnamedTemplate.name;
    const result = proposeBatchChangeUrl("o/r", unnamedTemplate as unknown as OteEvent, occurrences);
    if (result.kind !== "fallback") throw new Error("expected fallback");
    const url = new URL(result.url);
    expect(url.searchParams.get("title")).toBe("[ote-event] Add 2 events");
  });

  it("copyText is exactly recurringTemplateIssueBody's output for the same template/occurrences", () => {
    const result = proposeBatchChangeUrl("o/r", event, occurrences);
    if (result.kind !== "fallback") throw new Error("expected fallback");
    expect(result.copyText).toBe(recurringTemplateIssueBody(event, occurrences));
  });
});

const bulkEntry: BulkEditEntry = {
  slug: "2026-06-async",
  event,
  changedFields: ["license", "venue"],
  patch: { license: "CC0-1.0", venue: null },
};

const secondBulkEntry: BulkEditEntry = {
  slug: "2026-07-async",
  event: secondEvent,
  changedFields: ["license"],
  patch: { license: "CC0-1.0" },
};

describe("bulkEditIssueBody", () => {
  it("numbers every entry with an Update heading, its file path, and its own fenced JSON block", () => {
    const body = bulkEditIssueBody([bulkEntry, secondBulkEntry]);
    expect(body).toContain("### 1. Update: Async night (`events/2026-06-async.json`)");
    expect(body).toContain("### 2. Update: Async night #2 (`events/2026-07-async.json`)");
    expect(body.indexOf("### 1.")).toBeLessThan(body.indexOf("### 2."));
    expect(body.match(/```json/g)).toHaveLength(2);
  });

  it("includes a plain-text Changed: summary per entry, listing only its own changed fields", () => {
    const body = bulkEditIssueBody([bulkEntry, secondBulkEntry]);
    expect(body).toContain("Changed: license, venue");
    expect(body).toContain("Changed: license");
  });

  it("mentions the event count in the intro", () => {
    expect(bulkEditIssueBody([bulkEntry, secondBulkEntry])).toContain("2 existing event(s)");
  });

  it("omits the file path when slug is null", () => {
    const body = bulkEditIssueBody([{ ...bulkEntry, slug: null }]);
    expect(body).toContain("### 1. Update: Async night\n");
    expect(body).not.toContain("events/2026-06-async.json");
  });

  it("sends a _oteBatchMode: patch block carrying only slug + patch, not the full event", () => {
    const body = bulkEditIssueBody([bulkEntry]);
    const match = /```json\n([\s\S]*?)\n```/.exec(body);
    expect(match).not.toBeNull();
    const parsed = JSON.parse(match![1]!);
    expect(parsed).toEqual({
      _oteBatchMode: "patch",
      slug: "2026-06-async",
      patch: { license: "CC0-1.0", venue: null },
    });
    expect(body).not.toContain('"timezone"'); // full event fields never appear
  });

  it("falls back to a full-document block when an entry's slug is null", () => {
    const body = bulkEditIssueBody([{ ...bulkEntry, slug: null }]);
    const match = /```json\n([\s\S]*?)\n```/.exec(body);
    const parsed = JSON.parse(match![1]!);
    expect(parsed).toEqual(event);
    expect(parsed._oteBatchMode).toBeUndefined();
  });
});

describe("patchIssueBody", () => {
  it("returns one block per entry, in order", () => {
    const blocks = patchIssueBody([bulkEntry, secondBulkEntry]);
    expect(blocks).toHaveLength(2);
    expect(JSON.parse(/```json\n([\s\S]*?)\n```/.exec(blocks[0]!)![1]!).slug).toBe("2026-06-async");
    expect(JSON.parse(/```json\n([\s\S]*?)\n```/.exec(blocks[1]!)![1]!).slug).toBe("2026-07-async");
  });
});

describe("proposeBulkEditUrl", () => {
  it("is always a blank-issue + copy-paste fallback, never a prefilled URL", () => {
    const result = proposeBulkEditUrl("o/r", [bulkEntry, secondBulkEntry]);
    expect(result.kind).toBe("fallback");
  });

  it("points the blank issue at the right repo, titled with the count, same ote-batch labels", () => {
    const result = proposeBulkEditUrl("o/r", [bulkEntry, secondBulkEntry]);
    if (result.kind !== "fallback") throw new Error("expected fallback");
    const url = new URL(result.url);
    expect(url.origin + url.pathname).toBe("https://github.com/o/r/issues/new");
    expect(url.searchParams.get("title")).toBe("[ote-event] Update 2 event(s)");
    expect(url.searchParams.get("labels")).toBe("ote-event,ote-batch");
  });

  it("copyText is exactly bulkEditIssueBody's output for the same entries", () => {
    const result = proposeBulkEditUrl("o/r", [bulkEntry, secondBulkEntry]);
    if (result.kind !== "fallback") throw new Error("expected fallback");
    expect(result.copyText).toBe(bulkEditIssueBody([bulkEntry, secondBulkEntry]));
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

describe("directDeleteUrl", () => {
  it("opens GitHub's own delete-confirmation page for events/<slug>.json", () => {
    expect(directDeleteUrl("o/r", "2026-06-async", "main")).toBe(
      "https://github.com/o/r/delete/main/events/2026-06-async.json",
    );
  });

  it("defaults to HEAD when the branch is unknown", () => {
    expect(directDeleteUrl("o/r", "s")).toBe(
      "https://github.com/o/r/delete/HEAD/events/s.json",
    );
  });
});

describe("proposeDeleteUrl", () => {
  it("builds a prefilled issue URL naming the file and id, no JSON block", () => {
    const result = proposeDeleteUrl("o/r", "2026-06-async", event);
    expect(result.kind).toBe("url");
    if (result.kind !== "url") return;
    const url = new URL(result.url);
    expect(url.origin + url.pathname).toBe("https://github.com/o/r/issues/new");
    expect(url.searchParams.get("title")).toBe("[ote-event] Delete: Async night");
    const body = url.searchParams.get("body") ?? "";
    expect(body).toContain("events/2026-06-async.json");
    expect(body).toContain(event.id);
    expect(body).not.toContain("```json");
  });

  it("falls back to a blank issue + copy-paste above the URL limit", () => {
    const longId = "https://x.example/" + "x".repeat(MAX_URL_LENGTH);
    const result = proposeDeleteUrl("o/r", "s", { ...event, id: longId });
    expect(result.kind).toBe("fallback");
    if (result.kind !== "fallback") return;
    expect(result.url).toBe("https://github.com/o/r/issues/new");
    expect(result.copyText).toContain(longId);
  });
});

describe("bulkDeleteIssueBody", () => {
  it("lists every entry as one line with its file path and id, no JSON block", () => {
    const body = bulkDeleteIssueBody([
      { slug: "2026-06-async", event },
      { slug: "2026-07-async", event: secondEvent },
    ]);
    expect(body).toContain("- Async night — `events/2026-06-async.json` (id: https://x.example/events/2026-06-async)");
    expect(body).toContain("- Async night #2 — `events/2026-07-async.json`");
    expect(body).not.toContain("```json");
  });

  it("mentions the event count in the intro", () => {
    expect(bulkDeleteIssueBody([{ slug: "a", event }, { slug: "b", event }])).toContain("these 2 event(s)");
  });

  it("omits the file path when slug is null", () => {
    const body = bulkDeleteIssueBody([{ slug: null, event }]);
    expect(body).toContain(`- Async night (id: ${event.id})`);
  });
});

describe("proposeBulkDeleteUrl", () => {
  it("builds a prefilled issue URL for a normal-sized series, no JSON block", () => {
    const result = proposeBulkDeleteUrl("o/r", [
      { slug: "2026-06-async", event },
      { slug: "2026-07-async", event: secondEvent },
    ]);
    expect(result.kind).toBe("url");
    if (result.kind !== "url") return;
    const url = new URL(result.url);
    expect(url.origin + url.pathname).toBe("https://github.com/o/r/issues/new");
    expect(url.searchParams.get("title")).toBe("[ote-event] Delete 2 event(s)");
    expect(url.searchParams.get("body") ?? "").not.toContain("```json");
  });

  it("falls back to a blank issue + copy-paste above the URL limit", () => {
    const longId = "https://x.example/" + "x".repeat(MAX_URL_LENGTH);
    const result = proposeBulkDeleteUrl("o/r", [{ slug: "s", event: { ...event, id: longId } }]);
    expect(result.kind).toBe("fallback");
    if (result.kind !== "fallback") return;
    expect(result.url).toBe("https://github.com/o/r/issues/new");
    expect(result.copyText).toContain(longId);
  });

  it("embeds exactly bulkDeleteIssueBody's output as the body, for both the URL and fallback shapes", () => {
    const shortEntries = [{ slug: "2026-06-async", event }];
    const shortResult = proposeBulkDeleteUrl("o/r", shortEntries);
    if (shortResult.kind !== "url") throw new Error("expected a prefilled URL for this short body");
    expect(new URL(shortResult.url).searchParams.get("body")).toBe(bulkDeleteIssueBody(shortEntries));

    const longId = "https://x.example/" + "x".repeat(MAX_URL_LENGTH);
    const longEntries = [{ slug: "s", event: { ...event, id: longId } }];
    const longResult = proposeBulkDeleteUrl("o/r", longEntries);
    if (longResult.kind !== "fallback") throw new Error("expected fallback for this long body");
    expect(longResult.copyText).toBe(bulkDeleteIssueBody(longEntries));
  });
});

describe("directFeedConfigUrl", () => {
  it("builds GitHub's prefilled new-file URL at the repo root (no /events/)", () => {
    const result = directFeedConfigUrl("o/r", "main", { feed: { title: "x" } });
    expect(result.kind).toBe("url");
    if (result.kind !== "url") return;
    const url = new URL(result.url);
    expect(url.pathname).toBe("/o/r/new/main");
    expect(url.searchParams.get("filename")).toBe("ote.config.json");
    expect(url.searchParams.get("value")).toContain('"title": "x"');
  });

  it("falls back to filename-only + copy-paste above the URL limit", () => {
    const big = { feed: { description: "x".repeat(MAX_URL_LENGTH) } };
    const result = directFeedConfigUrl("o/r", "main", big);
    expect(result.kind).toBe("fallback");
    if (result.kind !== "fallback") return;
    expect(result.url).toContain("filename=ote.config.json");
    expect(result.url).not.toContain("value=");
    expect(result.copyText).toContain('"description"');
  });
});

describe("exceedsIssueBodyLimit", () => {
  it("is false at and under GitHub's limit", () => {
    expect(exceedsIssueBodyLimit("x".repeat(GITHUB_ISSUE_BODY_MAX_LENGTH))).toBe(false);
    expect(exceedsIssueBodyLimit("x".repeat(GITHUB_ISSUE_BODY_MAX_LENGTH - 1))).toBe(false);
  });

  it("is true just over the limit", () => {
    expect(exceedsIssueBodyLimit("x".repeat(GITHUB_ISSUE_BODY_MAX_LENGTH + 1))).toBe(true);
  });

  it("a real bulkEditIssueBody for a large-ish series can exceed it, even in patch mode", () => {
    // ~30 entries each changing one large field is a realistic "select
    // most of a long-running series and edit the description" scenario —
    // confirms patch mode's smaller payload still isn't a theoretical
    // limit for the bulk flows this guards (no member-count cap of its
    // own; a long enough series or big enough field still gets there).
    const bigEntry: BulkEditEntry = {
      slug: "s",
      event: { id: "https://x.example/e", name: "x".repeat(2000), description: "y".repeat(3000) } as OteEvent,
      changedFields: ["description"],
      patch: { description: "y".repeat(3000) },
    };
    const entries = Array.from({ length: 30 }, () => bigEntry);
    expect(exceedsIssueBodyLimit(bulkEditIssueBody(entries))).toBe(true);
  });
});

describe("directEditFeedConfigUrl", () => {
  it("opens github.dev on ote.config.json at the repo root", () => {
    expect(directEditFeedConfigUrl("o/r", "main")).toBe(
      "https://github.dev/o/r/blob/main/ote.config.json",
    );
  });

  it("defaults to HEAD when the branch is unknown", () => {
    expect(directEditFeedConfigUrl("o/r")).toBe(
      "https://github.dev/o/r/blob/HEAD/ote.config.json",
    );
  });
});
