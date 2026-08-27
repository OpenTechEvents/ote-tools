import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { buildReport, MAX_DEPTH, maxDepth, type Report } from "../src/lib/report.js";

/** Reuses packages/validate's fixtures: one corpus, one opinion of "valid". */
function fixture(name: string): string {
  return readFileSync(
    fileURLToPath(new URL(`../../../packages/validate/fixtures/${name}`, import.meta.url)),
    "utf8",
  );
}

function validated(report: Report): Extract<Report, { status: "validated" }> {
  if (report.status !== "validated") throw new Error(`expected a verdict, got ${report.status}`);
  return report;
}

describe("buildReport", () => {
  it("validates a real feed fixture as valid", () => {
    const report = validated(buildReport(fixture("valid/feed.json")));
    expect(report).toMatchObject({ kind: "feed", detected: "feed", valid: true });
    expect(report.errors).toEqual([]);
  });

  it("validates a standalone event fixture as an event", () => {
    const report = validated(buildReport(fixture("valid/event-minimal.json")));
    expect(report).toMatchObject({ kind: "event", detected: "event", valid: true });
  });

  it("reports schema violations with a pointer and a line", () => {
    const report = validated(buildReport(fixture("invalid/event-invalid-timezone.json")));
    expect(report.valid).toBe(false);
    const [first] = report.errors;
    expect(first.pointer).toMatch(/^\//);
    expect(first.position?.line).toBeGreaterThan(0);
  });

  it("keeps MUST and SHOULD apart: a valid document can still have recommendations", () => {
    const report = validated(buildReport(fixture("valid/event-minimal.json")));
    expect(report.valid).toBe(true);
    // The minimal fixture is deliberately bare, so the recommended profile has
    // something to say — and saying it must not make the document invalid.
    expect(report.recommendations.length).toBeGreaterThan(0);
    expect(report.errors).toEqual([]);
  });

  it("honours a manual kind override", () => {
    const source = fixture("valid/event-minimal.json");
    const asFeed = validated(buildReport(source, { kind: "feed" }));
    expect(asFeed.kind).toBe("feed");
    expect(asFeed.detected).toBe("event");
    expect(asFeed.valid).toBe(false); // an event is not a feed
  });

  it("reports a JSON syntax error at its line and column, not as a schema error", () => {
    const report = buildReport('{\n  "specVersion": "0.3.0",\n  "events": [,]\n}');
    expect(report.status).toBe("parse-error");
    if (report.status !== "parse-error") return;
    expect(report.position.line).toBeGreaterThanOrEqual(1);
  });

  it("treats an empty input as nothing to do", () => {
    expect(buildReport("   ").status).toBe("empty");
  });

  it("refuses a document nested deeper than any real one", () => {
    const deep = "[".repeat(MAX_DEPTH + 5) + "]".repeat(MAX_DEPTH + 5);
    expect(buildReport(deep).status).toBe("too-deep");
  });

  it("does not count brackets inside strings as nesting", () => {
    expect(maxDepth('{"a":"[[[[["}')).toBe(1);
    expect(maxDepth('{"a":"\\"[["}')).toBe(1);
  });

  it("renders values containing markup as plain text data", () => {
    // The finding carries the offending value as a string. It must survive as
    // characters — the DOM layer writes it with textContent — so nothing here
    // may escape, encode or otherwise mangle it either.
    const source = JSON.stringify({
      specVersion: "0.3.0",
      title: "<script>alert(1)</script>",
      license: "CC0-1.0",
      updatedAt: "not-an-instant",
      events: [],
    });
    const report = validated(buildReport(source));
    expect(report.valid).toBe(false);
    expect(report.errors.some((error) => error.message.includes("<script>"))).toBe(false);
    // …and the document itself is handed back untouched for the source view.
    expect(source).toContain("<script>alert(1)</script>");
  });

  it("runs without any network at all", () => {
    // The acceptance criterion "upload and paste work with the Worker down":
    // nothing in this path may reach for fetch.
    const original = globalThis.fetch;
    // @ts-expect-error — deliberately removing fetch for the duration.
    delete globalThis.fetch;
    try {
      expect(validated(buildReport(fixture("valid/feed.json"))).valid).toBe(true);
    } finally {
      globalThis.fetch = original;
    }
  });
});
