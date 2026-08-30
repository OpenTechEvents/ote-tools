import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  classifySpecVersion,
  declaredSpecVersion,
  loadValidators,
  validateDocument,
  LATEST_VERSION,
  PUBLISHED_VERSIONS,
  SUPPORTED_VERSIONS,
  SUPPORT_WINDOW_MINORS,
} from "../src/index.js";

// The bug this file exists for: three tools in the ecosystem hardcoded the
// newest schemas and reported every feed on an earlier release as broken —
// one error, `specVersion must be equal to constant`, on documents that were
// perfectly valid. Two were fixed in the spec repo; the validator is the
// third. What must never come back: a supported-but-older document being
// called invalid.
const fixturesDir = fileURLToPath(new URL("../fixtures/", import.meta.url));

const loadFixture = (kind: string, file: string): unknown =>
  JSON.parse(readFileSync(join(fixturesDir, kind, file), "utf8"));

describe("the support window", () => {
  it("covers the last three minors, newest included", () => {
    expect(SUPPORTED_VERSIONS.length).toBeLessThanOrEqual(PUBLISHED_VERSIONS.length);
    expect(SUPPORTED_VERSIONS).toContain(LATEST_VERSION);
    const minors = new Set(SUPPORTED_VERSIONS.map((v) => v.split(".").slice(0, 2).join(".")));
    expect(minors.size).toBeLessThanOrEqual(SUPPORT_WINDOW_MINORS);
  });

  it("classifies each published version by the policy", () => {
    expect(classifySpecVersion(LATEST_VERSION)).toEqual({
      status: "current",
      version: LATEST_VERSION,
    });
    expect(classifySpecVersion("0.3.0")).toEqual({ status: "outdated", version: "0.3.0" });
    expect(classifySpecVersion("0.1.0")).toEqual({
      status: "out-of-window",
      version: "0.1.0",
    });
    expect(classifySpecVersion("9.9.9")).toEqual({ status: "unknown", declared: "9.9.9" });
    expect(classifySpecVersion(null)).toEqual({ status: "unknown", declared: null });
  });

  it("reads a declared version only when it is a string", () => {
    expect(declaredSpecVersion({ specVersion: "0.3.0" })).toBe("0.3.0");
    // A JSON number 0.4 is not the string "0.4.0", and treating it as one
    // would validate the document against rules it never declared.
    expect(declaredSpecVersion({ specVersion: 0.4 })).toBeNull();
    expect(declaredSpecVersion({})).toBeNull();
    expect(declaredSpecVersion(null)).toBeNull();
  });
});

describe("loadValidators", () => {
  it("loads every published version", async () => {
    for (const version of PUBLISHED_VERSIONS) {
      const validators = await loadValidators(version);
      expect(validators.version).toBe(version);
    }
  });

  it("caches by version", async () => {
    expect(await loadValidators(LATEST_VERSION)).toBe(await loadValidators(LATEST_VERSION));
  });

  it("has no recommended profile before 0.3.0", async () => {
    // Null, not an empty check: a 0.2 document has not met recommendations
    // that did not exist when it was written.
    expect((await loadValidators("0.2.0")).checkFeedRecommended).toBeNull();
    expect((await loadValidators("0.3.0")).checkFeedRecommended).not.toBeNull();
  });

  it("refuses a version it does not embed", async () => {
    await expect(loadValidators("9.9.9")).rejects.toThrow(/embeds no schemas/);
  });
});

describe("validateDocument — inside the support window", () => {
  it("calls a real 0.3 feed valid, and says so against 0.3", async () => {
    // The feed from the issue this work came out of: corunajug.org, 9 events,
    // declaring 0.3.0. The registration bot said "validates against v0.3" and
    // linked here; this page used to answer "invalid".
    const report = await validateDocument(
      loadFixture("versioned", "feed-corunajug-0.3.0.json"),
      { kind: "feed" },
    );
    expect(report.valid).toBe(true);
    expect(report.errors).toEqual([]);
    expect(report.checkedVersion).toBe("0.3.0");
    expect(report.verdict).toEqual({ status: "outdated", version: "0.3.0" });
  });

  it("says a newer release exists, as a notice and nothing more", async () => {
    const report = await validateDocument(loadFixture("versioned", "event-0.3.0.json"), {
      kind: "event",
    });
    expect(report.valid).toBe(true);
    expect(report.notices).toHaveLength(1);
    // The notice earns its place by saying what changed, not that something
    // did — and it carries the link as a link, not as a URL mid-sentence.
    expect(report.notices[0]!.message).toContain("0.4.0");
    expect(report.notices[0]!.links[0]!.href).toContain("CHANGELOG.md");
  });

  it("checks a 0.4 document exactly as before", async () => {
    const report = await validateDocument(loadFixture("valid", "feed.json"), {
      kind: "feed",
    });
    expect(report.valid).toBe(true);
    expect(report.checkedVersion).toBe(LATEST_VERSION);
    expect(report.notices).toEqual([]);
    expect(report.verdict.status).toBe("current");
  });

  it("still reports real errors in an older document", async () => {
    const stale = { ...(loadFixture("versioned", "event-0.3.0.json") as object), name: "" };
    const report = await validateDocument(stale, { kind: "event" });
    expect(report.valid).toBe(false);
    // Measured against 0.3, and about the actual defect — not about the version.
    expect(report.checkedVersion).toBe("0.3.0");
    expect(report.errors.map((e) => e.path)).toContain("name");
    expect(report.errors.map((e) => e.path)).not.toContain("specVersion");
  });

  it("reports the recommended profile of the version it checked", async () => {
    const report = await validateDocument(
      loadFixture("versioned", "feed-corunajug-0.3.0.json"),
      { kind: "feed" },
    );
    expect(report.recommendedProfileChecked).toBe(true);
    // Recommendations never touch validity — that is the existing contract,
    // and the version notice rides the same channel.
    expect(report.valid).toBe(true);
  });
});

describe("validateDocument — outside the window and beyond", () => {
  it("asks a 0.1 document to migrate, and still measures it against 0.1", async () => {
    const report = await validateDocument(loadFixture("versioned", "feed-0.1.0.json"), {
      kind: "feed",
    });
    expect(report.valid).toBe(false);
    expect(report.checkedVersion).toBe("0.1.0");
    const versionError = report.errors.find((e) => e.path === "specVersion");
    expect(versionError?.message).toContain("support window");
    expect(versionError?.message).toContain("0.1");
    // The schemas of an out-of-window version stay published, and the notice
    // channel links them rather than leaving "migrate" as the only instruction.
    const hrefs = report.notices.flatMap((notice) => notice.links.map((link) => link.href));
    expect(hrefs).toContain("https://opentechevents.org/schema/v0.1/feed.schema.json");
    // Nothing else is wrong with this document, and nothing else is claimed.
    expect(report.errors).toHaveLength(1);
    // Before 0.3 there was no recommended profile to check against.
    expect(report.recommendedProfileChecked).toBe(false);
  });

  it("has no rules for a document that declares no version", async () => {
    const report = await validateDocument(
      loadFixture("versioned", "feed-no-specversion.json"),
      { kind: "feed" },
    );
    expect(report.valid).toBe(false);
    expect(report.checkedVersion).toBeNull();
    expect(report.errors).toHaveLength(1);
    expect(report.errors[0]!.message).toContain("declares no specVersion");
    for (const version of PUBLISHED_VERSIONS) {
      expect(report.errors[0]!.message).toContain(version);
    }
  });

  it("says the same about a version nobody published", async () => {
    const report = await validateDocument(
      loadFixture("versioned", "feed-unknown-specversion.json"),
      { kind: "feed" },
    );
    expect(report.valid).toBe(false);
    expect(report.checkedVersion).toBeNull();
    expect(report.errors[0]!.path).toBe("specVersion");
    expect(report.errors[0]!.message).toContain('"9.9.9" is not a published OTE Spec version');
  });
});

describe("validateDocument — a version chosen by hand", () => {
  it("rehearses the migration: what 0.4 would break in a 0.3 document", async () => {
    const report = await validateDocument(loadFixture("versioned", "event-0.3.0.json"), {
      kind: "event",
      version: LATEST_VERSION,
    });
    expect(report.overridden).toBe(true);
    expect(report.checkedVersion).toBe(LATEST_VERSION);
    expect(report.declaredVersion).toBe("0.3.0");
    // The specVersion field is itself one of the things a migration changes,
    // so it shows up as a finding — with both versions named.
    const versionError = report.errors.find((e) => e.path === "specVersion");
    expect(versionError?.message).toContain("says OTE Spec 0.3.0");
    expect(versionError?.message).toContain("0.4.0");
    // And the notice says which of the two answers the user is looking at.
    expect(report.notices.map((notice) => notice.message).join(" ")).toContain(
      "because you selected it",
    );
  });

  it("selecting the version the document already declares is not an override", async () => {
    const report = await validateDocument(loadFixture("versioned", "event-0.3.0.json"), {
      kind: "event",
      version: "0.3.0",
    });
    expect(report.overridden).toBe(false);
    expect(report.valid).toBe(true);
  });
});
