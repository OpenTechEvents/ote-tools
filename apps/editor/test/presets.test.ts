import { describe, expect, it } from "vitest";

import {
  FIELD_REGISTRY,
  availablePresets,
  resolveProfile,
} from "../src/lib/presets.js";

describe("resolveProfile", () => {
  it("meetup hides status and the advanced metadata", () => {
    const resolved = resolveProfile({ profile: "meetup" });
    expect(resolved.preset).toBe("meetup");
    for (const hidden of ["status", "license", "source", "updatedAt"]) {
      expect(resolved.fields.has(hidden)).toBe(false);
    }
    for (const shown of ["name", "startDate", "timezone", "venue", "geo", "tags"]) {
      expect(resolved.fields.has(shown)).toBe(true);
    }
    expect(resolved.collapsedSections.size).toBe(0);
    expect(resolved.warnings).toEqual([]);
  });

  it("conference adds status over meetup", () => {
    const resolved = resolveProfile({ profile: "conference" });
    expect(resolved.fields.has("status")).toBe(true);
    expect(resolved.fields.has("source")).toBe(false);
  });

  it("all shows every field with the advanced section collapsed", () => {
    const resolved = resolveProfile({ profile: "all" });
    expect(resolved.fields.size).toBe(FIELD_REGISTRY.length);
    expect(resolved.collapsedSections.has("advanced")).toBe(true);
  });

  it("customProfile wins over profile: core + listed fields", () => {
    const resolved = resolveProfile({
      profile: "meetup",
      customProfile: { fields: ["source", "status"] },
    });
    expect(resolved.preset).toBe("custom");
    expect(resolved.fields.has("source")).toBe(true);
    expect(resolved.fields.has("status")).toBe(true);
    // core fields survive even when not listed
    for (const core of ["name", "startDate", "timezone", "slug", "id"]) {
      expect(resolved.fields.has(core)).toBe(true);
    }
    // non-core, non-listed fields are hidden
    expect(resolved.fields.has("venue")).toBe(false);
    expect(resolved.warnings).toEqual([]);
  });

  it("customProfile with unknown fields ignores them with a warning", () => {
    const resolved = resolveProfile({
      customProfile: { fields: ["cfp", "sponsors", "tags"] },
    });
    expect(resolved.fields.has("tags")).toBe(true);
    expect(resolved.fields.has("cfp" as never)).toBe(false);
    expect(resolved.warnings).toHaveLength(2);
    expect(resolved.warnings[0]).toContain('"cfp"');
  });

  it("unknown profile falls back to all with a warning", () => {
    const resolved = resolveProfile({ profile: "hackathon" });
    expect(resolved.preset).toBe("all");
    expect(resolved.fields.size).toBe(FIELD_REGISTRY.length);
    expect(resolved.warnings[0]).toContain('"hackathon"');
  });

  it("missing config falls back to all without blaming the organizer", () => {
    const resolved = resolveProfile(null);
    expect(resolved.preset).toBe("all");
    expect(resolved.warnings).toEqual([]);
  });

  it("config without profile falls back to all with a warning", () => {
    const resolved = resolveProfile({ feed: { title: "x" } });
    expect(resolved.preset).toBe("all");
    expect(resolved.warnings).toHaveLength(1);
  });

  it("an override preset wins over the config, without warnings", () => {
    const resolved = resolveProfile({ profile: "meetup" }, "conference");
    expect(resolved.preset).toBe("conference");
    expect(resolved.fields.has("geo")).toBe(true);
    expect(resolved.warnings).toEqual([]);
  });

  it("an override wins over customProfile too", () => {
    const resolved = resolveProfile(
      { customProfile: { fields: ["source"] } },
      "all",
    );
    expect(resolved.preset).toBe("all");
    expect(resolved.fields.size).toBe(FIELD_REGISTRY.length);
  });

  it('override "custom" re-selects the config customProfile', () => {
    const resolved = resolveProfile(
      { profile: "meetup", customProfile: { fields: ["source"] } },
      "custom",
    );
    expect(resolved.preset).toBe("custom");
    expect(resolved.fields.has("source")).toBe(true);
    expect(resolved.fields.has("venue")).toBe(false);
  });
});

describe("availablePresets", () => {
  it("offers the three presets, plus custom when the config has one", () => {
    expect(availablePresets(null)).toEqual(["meetup", "conference", "all"]);
    expect(availablePresets({ customProfile: { fields: [] } })).toEqual([
      "custom",
      "meetup",
      "conference",
      "all",
    ]);
  });
});
