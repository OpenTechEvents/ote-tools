import { describe, expect, it } from "vitest";

import {
  FIELD_REGISTRY,
  availablePresets,
  resolvedCustomProfiles,
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
    // Sections with no required field always render collapsed.
    for (const collapsed of ["where", "who", "tickets", "cfp", "translations"] as const) {
      expect(resolved.collapsedSections.has(collapsed)).toBe(true);
    }
    expect(resolved.warnings).toEqual([]);
  });

  it("conference adds status over meetup", () => {
    const resolved = resolveProfile({ profile: "conference" });
    expect(resolved.fields.has("status")).toBe(true);
    expect(resolved.fields.has("source")).toBe(false);
  });

  it("all shows every field", () => {
    const resolved = resolveProfile({ profile: "all" });
    expect(resolved.fields.size).toBe(FIELD_REGISTRY.length);
  });

  it("collapsedSections is the same {where, who, tickets, cfp, translations} for every preset, and never includes what/when/metadata (they have a required field)", () => {
    const expected = ["cfp", "tickets", "translations", "where", "who"].sort();
    for (const profile of ["meetup", "conference", "all"]) {
      const resolved = resolveProfile({ profile });
      expect([...resolved.collapsedSections].sort()).toEqual(expected);
    }
    const custom = resolveProfile({ customProfile: { fields: [] } });
    expect([...custom.collapsedSections].sort()).toEqual(expected);
  });

  it("legacy customProfile.fields defaults to preset 'custom' when profile is unset: core + listed fields", () => {
    const resolved = resolveProfile({
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

  it("an explicit profile wins over a co-present legacy customProfile.fields (documented behavior change: the legacy field no longer always wins)", () => {
    const resolved = resolveProfile({
      profile: "meetup",
      customProfile: { fields: ["source", "status"] },
    });
    expect(resolved.preset).toBe("meetup");
    expect(resolved.fields.has("status")).toBe(false);
  });

  it("customProfile with unknown fields ignores them with a warning", () => {
    const resolved = resolveProfile({
      customProfile: { fields: ["sponsors", "workshops", "tags"] },
    });
    expect(resolved.fields.has("tags")).toBe(true);
    expect(resolved.fields.has("sponsors" as never)).toBe(false);
    expect(resolved.warnings).toHaveLength(2);
    expect(resolved.warnings[0]).toContain('"sponsors"');
  });

  it("meetup hides cfp; conference and all show it", () => {
    expect(resolveProfile({ profile: "meetup" }).fields.has("cfp")).toBe(false);
    expect(resolveProfile({ profile: "conference" }).fields.has("cfp")).toBe(
      true,
    );
    expect(resolveProfile({ profile: "all" }).fields.has("cfp")).toBe(true);
  });

  it("meetup and conference both show organizers/image/eligibility/offers/partOf/textLanguage", () => {
    for (const preset of ["meetup", "conference"]) {
      const resolved = resolveProfile({ profile: preset });
      for (const field of [
        "organizers",
        "image",
        "eligibility",
        "offers",
        "partOf",
        "textLanguage",
      ]) {
        expect(resolved.fields.has(field)).toBe(true);
      }
    }
  });

  it("translations is present and collapsed under every preset, including custom", () => {
    for (const profile of ["meetup", "conference", "all"]) {
      const resolved = resolveProfile({ profile });
      expect(resolved.fields.has("translations")).toBe(true);
      expect(resolved.collapsedSections.has("translations")).toBe(true);
    }
    const custom = resolveProfile({ customProfile: { fields: ["translations"] } });
    expect(custom.fields.has("translations")).toBe(true);
    expect(custom.collapsedSections.has("translations")).toBe(true);
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
    expect(resolved.fields.size).toBe(FIELD_REGISTRY.length);
    expect(resolved.collapsedSections.has("where")).toBe(true);
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

  it('override "custom" re-selects the legacy config customProfile', () => {
    const resolved = resolveProfile(
      { profile: "meetup", customProfile: { fields: ["source"] } },
      "custom",
    );
    expect(resolved.preset).toBe("custom");
    expect(resolved.fields.has("source")).toBe(true);
    expect(resolved.fields.has("venue")).toBe(false);
  });

  it("resolves a named custom profile via profile", () => {
    const resolved = resolveProfile({
      profile: "sponsors-track",
      customProfiles: { "sponsors-track": { fields: ["source", "cfp"] } },
    });
    expect(resolved.preset).toBe("sponsors-track");
    expect(resolved.fields.has("source")).toBe(true);
    expect(resolved.fields.has("cfp")).toBe(true);
    expect(resolved.fields.has("venue")).toBe(false);
  });

  it("a custom profile named like a builtin overrides it entirely, not merged", () => {
    const resolved = resolveProfile({
      profile: "meetup",
      customProfiles: { meetup: { fields: ["source"] } },
    });
    expect(resolved.preset).toBe("meetup");
    expect(resolved.fields.has("source")).toBe(true);
    // the builtin's own field set (e.g. venue, always shown for meetup) is
    // not merged in — a shadowing custom profile is fully explicit.
    expect(resolved.fields.has("venue")).toBe(false);
  });

  it("customProfiles wins over a same-named legacy customProfile.fields", () => {
    const resolved = resolveProfile({
      customProfile: { fields: ["source"] },
      customProfiles: { custom: { fields: ["cfp"] } },
    });
    expect(resolved.preset).toBe("custom");
    expect(resolved.fields.has("cfp")).toBe(true);
    expect(resolved.fields.has("source")).toBe(false);
  });

  it("multiple named custom profiles resolve independently by name", () => {
    const config = {
      customProfiles: {
        a: { fields: ["source"] },
        b: { fields: ["cfp"] },
      },
    };
    const a = resolveProfile(config, "a");
    const b = resolveProfile(config, "b");
    expect(a.fields.has("source")).toBe(true);
    expect(a.fields.has("cfp")).toBe(false);
    expect(b.fields.has("cfp")).toBe(true);
    expect(b.fields.has("source")).toBe(false);
  });
});

describe("resolvedCustomProfiles", () => {
  it("returns nothing for a config with neither key", () => {
    expect(resolvedCustomProfiles(null)).toEqual({});
    expect(resolvedCustomProfiles({ feed: { title: "x" } })).toEqual({});
  });

  it("reads the legacy singular key as 'custom'", () => {
    expect(resolvedCustomProfiles({ customProfile: { fields: ["cfp"] } })).toEqual({
      custom: ["cfp"],
    });
  });

  it("reads the new map, merged with any legacy entry", () => {
    expect(
      resolvedCustomProfiles({
        customProfile: { fields: ["cfp"] },
        customProfiles: { sponsors: { fields: ["source"] } },
      }),
    ).toEqual({ custom: ["cfp"], sponsors: ["source"] });
  });

  it("the new map wins over the legacy key on a name collision", () => {
    expect(
      resolvedCustomProfiles({
        customProfile: { fields: ["cfp"] },
        customProfiles: { custom: { fields: ["source"] } },
      }),
    ).toEqual({ custom: ["source"] });
  });
});

describe("availablePresets", () => {
  it("offers the three builtins, plus custom when the config has one", () => {
    expect(availablePresets(null)).toEqual(["meetup", "conference", "all"]);
    expect(availablePresets({ customProfile: { fields: [] } })).toEqual([
      "custom",
      "meetup",
      "conference",
      "all",
    ]);
  });

  it("lists every named custom profile before the builtins", () => {
    expect(
      availablePresets({
        customProfiles: {
          sponsors: { fields: [] },
          workshops: { fields: [] },
        },
      }),
    ).toEqual(["sponsors", "workshops", "meetup", "conference", "all"]);
  });

  it("a custom profile named like a builtin replaces it in the list, not duplicates it", () => {
    expect(
      availablePresets({ customProfiles: { meetup: { fields: [] } } }),
    ).toEqual(["meetup", "conference", "all"]);
  });
});
