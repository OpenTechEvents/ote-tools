import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { LATEST_VERSION, loadValidators } from "@opentechevents/validate";
import { describe, expect, it } from "vitest";

import { migrateDocument, MigrationError } from "../src/index.js";

const fixture = (name: string): unknown =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url)), "utf8"));

const multipart04 = (): Record<string, unknown> =>
  fixture("feed-0.4-multipart.json") as Record<string, unknown>;
const feed03 = (): Record<string, unknown> => fixture("feed-0.3.json") as Record<string, unknown>;

describe("migrateDocument", () => {
  it("moves a feed to the latest version by default", async () => {
    const result = await migrateDocument(feed03());
    expect(result.from).toBe("0.3.0");
    expect(result.to).toBe(LATEST_VERSION);
    expect(result.changed).toBe(true);
    expect((result.document as Record<string, unknown>).specVersion).toBe(LATEST_VERSION);
  });

  // The whole reason this package exists rather than a `sed`: the adopter
  // who most needs to migrate is the one whose version left the support
  // window, and `validateDocument` calls that an error. Migrating must still
  // work for them.
  it("migrates a document whose version is outside the support window", async () => {
    const result = await migrateDocument(feed03(), { to: "0.6.0" });
    expect(result.to).toBe("0.6.0");
    const validators = await loadValidators("0.6.0");
    expect(validators.validateFeed(result.document).errors).toEqual([]);
  });

  it("leaves the input untouched", async () => {
    const input = feed03();
    await migrateDocument(input, { to: "0.6.0" });
    expect(input.specVersion).toBe("0.3.0");
  });

  it("reports no change when the document already declares the target", async () => {
    const result = await migrateDocument(feed03(), { to: "0.3.0" });
    expect(result.changed).toBe(false);
    expect(result.warnings).toEqual([]);
  });

  it("infers a standalone event from the absence of events[]", async () => {
    const event = fixture("../../validate/fixtures/versioned/event-0.4.0.json");
    const result = await migrateDocument(event, { to: "0.6.0" });
    expect(result.kind).toBe("event");
    expect(result.from).toBe("0.4.0");
  });

  describe("refusals", () => {
    it("refuses a document with no specVersion", async () => {
      await expect(migrateDocument({ title: "x", events: [] })).rejects.toThrow(MigrationError);
    });

    it("refuses a version that was never published", async () => {
      await expect(migrateDocument({ specVersion: "9.9.9", events: [] })).rejects.toThrow(
        /never published/,
      );
    });

    it("refuses an unpublished target", async () => {
      await expect(migrateDocument(feed03(), { to: "9.9.9" })).rejects.toThrow(
        /not a published version/,
      );
    });

    // Dropping the fields a newer version added is data loss, and the
    // publisher wrote them on purpose.
    it("refuses a downgrade", async () => {
      await expect(migrateDocument(feed03(), { to: "0.2.0" })).rejects.toThrow(/older/);
    });

    it("refuses input that is not valid at the version it claims", async () => {
      const broken = feed03();
      delete broken.title;
      await expect(migrateDocument(broken, { to: "0.6.0" })).rejects.toThrow(/not valid OTE 0.3.0/);
    });
  });

  describe("D032 — multi-part pricing", () => {
    /** The per-event "this offer now reads as admission" warnings only. */
    const scopeOnly = (warnings: { path: string }[]): { path: string }[] =>
      warnings.filter((w) => w.path.endsWith(".offers") && !w.path.includes("partOf"));

    it("warns that an unscoped offer on a part now reads as admission", async () => {
      const result = await migrateDocument(multipart04(), { to: "0.6.0" });
      const scopeWarnings = result.warnings.filter(
        (w) => w.path.endsWith(".offers") && !w.path.includes("partOf"),
      );
      expect(scopeWarnings.length).toBeGreaterThan(0);
      expect(scopeWarnings[0]!.decision).toBe("D032");
      expect(scopeWarnings[0]!.message).toMatch(/add-on/);
    });

    it("warns that a shared set has no partOf.offers", async () => {
      const result = await migrateDocument(multipart04(), { to: "0.6.0" });
      const shared = result.warnings.find((w) => w.path === "events[].partOf.offers");
      expect(shared).toBeDefined();
      expect(shared!.message).toMatch(/share partOf.id/);
    });

    it("stays quiet for a document with no multi-part events", async () => {
      const result = await migrateDocument(feed03(), { to: "0.6.0" });
      expect(result.warnings).toEqual([]);
    });

    // 0.5 is where the meaning changed. A document already on 0.5 has had
    // that conversation; repeating it on every 0.6 bump is noise.
    it("does not warn when the migration does not cross 0.5", async () => {
      const already05 = multipart04();
      already05.specVersion = "0.5.0";
      const result = await migrateDocument(already05, { to: "0.6.0" });
      expect(result.warnings).toEqual([]);
    });

    // A publisher who has answered the question says so with `scope`.
    it("does not warn about offers that already declare a scope", async () => {
      const answered = multipart04();
      const events = answered.events as Record<string, unknown>[];
      for (const event of events) {
        for (const offer of (event.offers ?? []) as Record<string, unknown>[]) {
          offer.scope = "admission";
        }
      }
      const result = await migrateDocument(answered, { to: "0.6.0" });
      expect(scopeOnly(result.warnings)).toEqual([]);
      // The set still has no partOf.offers, so that warning is untouched —
      // answering one question does not answer the other.
      expect(result.warnings.map((w) => w.path)).toEqual(["events[].partOf.offers"]);
    });
  });

  // Every published release so far has been additive, which is the claim the
  // package makes. If a future one is not, this is where it surfaces.
  it("produces a valid document for every upward hop between published versions", async () => {
    const result = await migrateDocument(fixture("feed-0.3.json"), { to: "0.4.0" });
    const validators = await loadValidators("0.4.0");
    expect(validators.validateFeed(result.document).errors).toEqual([]);
  });
});
