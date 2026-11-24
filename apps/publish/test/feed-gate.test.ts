/**
 * The gate decides whether Broadcast will act on somebody else's feed, so the
 * three cases are asserted directly rather than through `boot()`. The reason
 * is historical and specific: this decision was inside `boot()`, where the
 * whole surface could be broken — and was — with every test in this app still
 * passing (#124).
 */

import { validateDocument } from "@opentechevents/validate";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { feedGate } from "../src/lib/feed-gate.js";

const fixture = (name: string): unknown =>
  JSON.parse(
    readFileSync(
      fileURLToPath(new URL(`../../../packages/validate/fixtures/versioned/${name}`, import.meta.url)),
      "utf8",
    ),
  );

const gateFor = async (json: unknown) => feedGate(await validateDocument(json, { kind: "feed" }));

describe("feedGate", () => {
  it("broadcasts a feed on an older-but-published release, and says so beside it", async () => {
    // A registered adopter publishes 0.3.0. This used to refuse with "This
    // feed is not valid OTE" over a document with zero schema violations.
    const gate = await gateFor(fixture("feed-corunajug-0.3.0.json"));
    expect(gate.action).toBe("broadcast");
    expect(gate.action === "broadcast" && gate.support).toContain("support window");
  });

  it("broadcasts a current feed with nothing to say", async () => {
    const gate = await gateFor({
      specVersion: "0.6.0",
      title: "Comunidad",
      url: "https://comunidad.example",
      license: "CC-BY-4.0",
      updatedAt: "2026-01-01T00:00:00Z",
      events: [],
    });
    expect(gate.action).toBe("broadcast");
    expect(gate.action === "broadcast" && gate.support).toBeNull();
  });

  it("refuses a feed with real schema violations, carrying the findings", async () => {
    const gate = await gateFor({ specVersion: "0.6.0", events: [] });
    expect(gate.action).toBe("invalid");
    expect(gate.action === "invalid" && gate.errors.length).toBeGreaterThan(0);
  });

  it("refuses an unpublished version as unchecked, never as invalid", async () => {
    // Refused for the opposite reason: this release has no rules for that
    // version, so mapping the feed would mean inventing the mapping. The
    // distinction is the whole point — one blames the feed, one does not.
    const gate = await gateFor({ specVersion: "9.9.9", title: "x", events: [] });
    expect(gate.action).toBe("unchecked");
    expect(gate.action === "unchecked" && gate.reason).toContain("9.9.9");
  });
});
