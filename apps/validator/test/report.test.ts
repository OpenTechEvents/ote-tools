import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { LATEST_VERSION } from "@opentechevents/validate";

import {
  buildReport,
  MAX_DEPTH,
  maxDepth,
  recommendationsBlurb,
  type Report,
} from "../src/lib/report.js";

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
  it("calls an older-but-supported document valid and says which version judged it", async () => {
    // Was the corunajug 0.3 feed until 0.5.0 and 0.6.0 published on the same
    // day and slid 0.3 out of the three-minor window. The point is unchanged:
    // a document behind the latest release is judged by its own rules and is
    // valid. The out-of-window case has its own test below.
    const report = validated(await buildReport(fixture("versioned/event-0.4.0.json")));
    expect(report.valid).toBe(true);
    expect(report.errors).toEqual([]);
    expect(report.specVersion).toBe("0.4.0");
    expect(report.declaredVersion).toBe("0.4.0");
  });

  it("puts the newer-release note in the notices, never in the errors", async () => {
    const report = validated(await buildReport(fixture("versioned/event-0.4.0.json")));
    expect(report.notices).toHaveLength(1);
    // The changelog travels as a link, not as a URL printed inside the text.
    expect(report.notices[0]!.links[0]!.href).toContain("CHANGELOG.md");
    expect(report.notices[0]!.message).not.toContain("http");
    expect(report.errors).toEqual([]);
    expect(report.valid).toBe(true);
  });

  it("still reports a current-version feed exactly as before", async () => {
    const report = validated(await buildReport(fixture("valid/feed.json")));
    expect(report).toMatchObject({ valid: true, specVersion: LATEST_VERSION, notices: [] });
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
      await buildReport(fixture("versioned/event-0.3.0.json"), { version: LATEST_VERSION }),
    );
    expect(report.overridden).toBe(true);
    expect(report.specVersion).toBe(LATEST_VERSION);
    expect(report.notices.map((notice) => notice.message).join(" ")).toContain("selected it");
  });

  it("says when a version predates the recommended profile", async () => {
    const report = validated(await buildReport(fixture("versioned/feed-0.1.0.json")));
    expect(report.recommendedProfileChecked).toBe(false);
    expect(report.recommendations).toEqual([]);
  });
});

// D042: a 1.0 freezes validity, not the recommended profiles. Anything that
// scores or badges on this list has to know which version produced it.
describe("recommendationsBlurb", () => {
  it("names the version whose profile produced the list", () => {
    expect(recommendationsBlurb("0.6.0")).toContain("OTE 0.6.0's recommended profile");
  });

  it("warns that the list is not frozen the way validity is", () => {
    const blurb = recommendationsBlurb("0.6.0");
    expect(blurb).toContain("not frozen");
    expect(blurb).toMatch(/add or drop recommendations/);
  });

  // The recommendations are still SHOULD-level, and saying so is what keeps
  // them from reading as errors.
  it("keeps the SHOULD framing and the reassurance that the document is valid", () => {
    const blurb = recommendationsBlurb("0.6.0");
    expect(blurb).toContain("(SHOULD)");
    expect(blurb).toContain("still valid");
  });

  // Unreachable through the UI — no version checked means no recommendations,
  // and the box stays hidden — but the sentence must not read "OTE null's".
  it("does not invent a version when none was applied", () => {
    const blurb = recommendationsBlurb(null);
    expect(blurb).not.toContain("null");
    expect(blurb).toContain("the recommended profile");
  });

  // The version shown is the one actually checked, which is not always the
  // one the document declares — a hand-picked version has to win here too.
  it("reports whichever version was checked", async () => {
    const report = validated(
      await buildReport(fixture("versioned/event-0.3.0.json"), { version: LATEST_VERSION }),
    );
    expect(recommendationsBlurb(report.specVersion)).toContain(`OTE ${LATEST_VERSION}`);
  });
});
