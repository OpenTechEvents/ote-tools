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
  it("validates a real feed fixture as valid", async () => {
    const report = validated(await buildReport(fixture("valid/feed.json")));
    expect(report).toMatchObject({ kind: "feed", detected: "feed", valid: true });
    expect(report.errors).toEqual([]);
  });

  it("validates a standalone event fixture as an event", async () => {
    const report = validated(await buildReport(fixture("valid/event-minimal.json")));
    expect(report).toMatchObject({ kind: "event", detected: "event", valid: true });
  });

  it("reports schema violations with a pointer and a line", async () => {
    const report = validated(await buildReport(fixture("invalid/event-invalid-timezone.json")));
    expect(report.valid).toBe(false);
    const [first] = report.errors;
    expect(first.pointer).toMatch(/^\//);
    expect(first.position?.line).toBeGreaterThan(0);
  });

  it("keeps MUST and SHOULD apart: a valid document can still have recommendations", async () => {
    const report = validated(await buildReport(fixture("valid/event-minimal.json")));
    expect(report.valid).toBe(true);
    // The minimal fixture is deliberately bare, so the recommended profile has
    // something to say — and saying it must not make the document invalid.
    expect(report.recommendations.length).toBeGreaterThan(0);
    expect(report.errors).toEqual([]);
  });

  it("honours a manual kind override", async () => {
    const source = fixture("valid/event-minimal.json");
    const asFeed = validated(await buildReport(source, { kind: "feed" }));
    expect(asFeed.kind).toBe("feed");
    expect(asFeed.detected).toBe("event");
    expect(asFeed.valid).toBe(false); // an event is not a feed
  });

  it("reports a JSON syntax error at its line and column, not as a schema error", async () => {
    const report = await buildReport('{\n  "specVersion": "0.4.0",\n  "events": [,]\n}');
    expect(report.status).toBe("parse-error");
    if (report.status !== "parse-error") return;
    expect(report.position.line).toBeGreaterThanOrEqual(1);
  });

  it("treats an empty input as nothing to do", async () => {
    expect((await buildReport("   ")).status).toBe("empty");
  });

  it("refuses a document nested deeper than any real one", async () => {
    const deep = "[".repeat(MAX_DEPTH + 5) + "]".repeat(MAX_DEPTH + 5);
    expect((await buildReport(deep)).status).toBe("too-deep");
  });

  it("does not count brackets inside strings as nesting", () => {
    expect(maxDepth('{"a":"[[[[["}')).toBe(1);
    expect(maxDepth('{"a":"\\"[["}')).toBe(1);
  });

  it("renders values containing markup as plain text data", async () => {
    // The finding carries the offending value as a string. It must survive as
    // characters — the DOM layer writes it with textContent — so nothing here
    // may escape, encode or otherwise mangle it either.
    const source = JSON.stringify({
      specVersion: "0.4.0",
      title: "<script>alert(1)</script>",
      license: "CC0-1.0",
      updatedAt: "not-an-instant",
      events: [],
    });
    const report = validated(await buildReport(source));
    expect(report.valid).toBe(false);
    expect(report.errors.some((error) => error.message.includes("<script>"))).toBe(false);
    // …and the document itself is handed back untouched for the source view.
    expect(source).toContain("<script>alert(1)</script>");
  });

  it("runs without any network at all", async () => {
    // The acceptance criterion "upload and paste work with the Worker down":
    // nothing in this path may reach for fetch.
    const original = globalThis.fetch;
    // @ts-expect-error — deliberately removing fetch for the duration.
    delete globalThis.fetch;
    try {
      expect(validated(await buildReport(fixture("valid/feed.json"))).valid).toBe(true);
    } finally {
      globalThis.fetch = original;
    }
  });
});

describe("MUST and SHOULD stay apart", () => {
  it("never repeats an error as a recommendation", async () => {
    // The recommended schemas re-declare the base formats, so a malformed
    // date fails both. The reader must be told once.
    const feed = JSON.parse(
      JSON.stringify({
        specVersion: "0.4.0",
        title: "Comunidad",
        url: "https://comunidad.example",
        license: "CC0-1.0",
        organizers: [{ name: "Comunidad", url: "https://comunidad.example" }],
        updatedAt: "2026-07-06T10:00:00Z",
        events: [
          {
            id: "https://comunidad.example/e/1",
            url: "https://comunidad.example/e/1",
            name: "Meetup",
            startDate: "ayer por la tarde",
            timezone: "Europe/Madrid",
            attendanceMode: "in-person",
            location: { venue: "El Cable" },
            updatedAt: "2026-05-28T11:00:00Z",
          },
        ],
      }),
    );

    const report = await buildReport(JSON.stringify(feed, null, 2));
    expect(report.status).toBe("validated");
    const { errors, recommendations } = report as {
      errors: { pointer: string; message: string }[];
      recommendations: { pointer: string; message: string }[];
    };

    expect(errors.length).toBeGreaterThan(0);
    const asErrors = new Set(errors.map((f) => `${f.pointer} ${f.message}`));
    for (const finding of recommendations) {
      expect(asErrors.has(`${finding.pointer} ${finding.message}`)).toBe(false);
    }
  });
});

// The bug this page shipped: a feed on a supported-but-older release was
// reported as invalid, on one meaningless error about `specVersion`, while
// the registration bot linked here saying the same feed validated. Everything
// below is about the two never disagreeing again.
describe("buildReport — spec versions", () => {
  it("calls a real 0.3 feed valid and says which version judged it", async () => {
    const report = validated(await buildReport(fixture("versioned/feed-corunajug-0.3.0.json")));
    expect(report.valid).toBe(true);
    expect(report.errors).toEqual([]);
    expect(report.specVersion).toBe("0.3.0");
    expect(report.declaredVersion).toBe("0.3.0");
  });

  it("puts the newer-release note in the notices, never in the errors", async () => {
    const report = validated(await buildReport(fixture("versioned/feed-corunajug-0.3.0.json")));
    expect(report.notices).toHaveLength(1);
    // The changelog travels as a link, not as a URL printed inside the text.
    expect(report.notices[0]!.links[0]!.href).toContain("CHANGELOG.md");
    expect(report.notices[0]!.message).not.toContain("http");
    expect(report.errors).toEqual([]);
    expect(report.valid).toBe(true);
  });

  it("still reports a 0.4 feed exactly as before", async () => {
    const report = validated(await buildReport(fixture("valid/feed.json")));
    expect(report).toMatchObject({ valid: true, specVersion: "0.4.0", notices: [] });
  });

  it("asks an out-of-window document to migrate", async () => {
    const report = validated(await buildReport(fixture("versioned/feed-0.1.0.json")));
    expect(report.valid).toBe(false);
    const versionError = report.errors.find((finding) => finding.path === "specVersion");
    expect(versionError?.message).toContain("support window");
    // And it points at the line, like every other finding.
    expect(versionError?.position?.line).toBeGreaterThan(0);
  });

  it("has nothing to check a version-less document against", async () => {
    const report = validated(await buildReport(fixture("versioned/feed-no-specversion.json")));
    expect(report.valid).toBe(false);
    expect(report.specVersion).toBeNull();
    expect(report.errors).toHaveLength(1);
  });

  it("honours a hand-picked version, and marks the answer as such", async () => {
    const report = validated(
      await buildReport(fixture("versioned/event-0.3.0.json"), { version: "0.4.0" }),
    );
    expect(report.overridden).toBe(true);
    expect(report.specVersion).toBe("0.4.0");
    expect(report.notices.map((notice) => notice.message).join(" ")).toContain("selected it");
  });

  it("says when a version predates the recommended profile", async () => {
    const report = validated(await buildReport(fixture("versioned/feed-0.1.0.json")));
    expect(report.recommendedProfileChecked).toBe(false);
    expect(report.recommendations).toEqual([]);
  });
});
