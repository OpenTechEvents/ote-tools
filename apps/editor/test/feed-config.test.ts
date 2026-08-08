import { describe, expect, it } from "vitest";

import {
  emptyFeedConfigState,
  fromOteConfig,
  likelyAggregatorFeed,
  toOteConfigJson,
} from "../src/lib/feed-config.js";
import type { OteConfig, OteEvent } from "../src/lib/types.js";

// Shaped after OpenTechEvents/ote-template's real ote.config.json (checked
// via the GitHub API while planning this feature): top-level `_comment*`
// keys (this repo's own convention for commenting JSON), a `profile`
// outside `feed`, and a `feed` block that already has organizers/
// textLanguage set by hand.
const realish = {
  _comment: "Your community's configuration.",
  _comment_organizers: "Who organizes your events, by default.",
  feed: {
    title: "GDG Sample City Events",
    description: "Monthly meetups and DevFest Sample City.",
    url: "https://gdgsamplecity.example",
    license: "CC0-1.0",
    textLanguage: "en",
    organizers: [
      { name: "GDG Sample City", url: "https://gdgsamplecity.example", email: "hello@gdgsamplecity.example" },
    ],
  },
  profile: "all",
};

describe("emptyFeedConfigState", () => {
  it("is all-empty, no organizers, no translations, no profile", () => {
    expect(emptyFeedConfigState()).toEqual({
      title: "",
      description: "",
      url: "",
      license: "",
      licenseUrl: "",
      textLanguage: "",
      organizers: [],
      translations: {},
      profile: "",
      customProfiles: [],
    });
  });
});

describe("fromOteConfig", () => {
  it("returns the empty draft for a null config", () => {
    expect(fromOteConfig(null)).toEqual(emptyFeedConfigState());
  });

  it("returns the empty draft when feed is absent", () => {
    expect(fromOteConfig({})).toEqual(emptyFeedConfigState());
  });

  it("reads every managed field, defaulting missing organizer sub-fields to \"\"", () => {
    const state = fromOteConfig(realish as unknown as OteConfig);
    expect(state.title).toBe("GDG Sample City Events");
    expect(state.textLanguage).toBe("en");
    expect(state.licenseUrl).toBe("");
    expect(state.organizers).toEqual([
      {
        name: "GDG Sample City",
        url: "https://gdgsamplecity.example",
        email: "hello@gdgsamplecity.example",
        type: "",
      },
    ]);
  });

  it("plain profile with no customProfile → profile as-is, no custom profiles", () => {
    const state = fromOteConfig(realish as unknown as OteConfig);
    expect(state.profile).toBe("all");
    expect(state.customProfiles).toEqual([]);
  });

  it("reads a legacy customProfile.fields as a named 'custom' row, independent of profile — including an id this editor's FIELD_REGISTRY doesn't recognize, kept unfiltered", () => {
    const config = {
      profile: "meetup",
      customProfile: { fields: ["description", "cfp", "sponsors"] }, // "sponsors" is not a real field id yet
    };
    const state = fromOteConfig(config as unknown as OteConfig);
    // An explicit profile now wins over the legacy key (documented behavior
    // change from the single-custom-profile model — see presets.test.ts).
    expect(state.profile).toBe("meetup");
    expect(state.customProfiles).toEqual([
      { name: "custom", fields: ["description", "cfp", "sponsors"] },
    ]);
  });

  it("a legacy customProfile.fields with no profile set defaults the picker to 'custom', matching resolveProfile", () => {
    const config = { customProfile: { fields: ["description"] } };
    const state = fromOteConfig(config as unknown as OteConfig);
    expect(state.profile).toBe("custom");
    expect(state.customProfiles).toEqual([{ name: "custom", fields: ["description"] }]);
  });

  it("reads the new customProfiles map as rows, one per name", () => {
    const config = {
      profile: "sponsors",
      customProfiles: {
        sponsors: { fields: ["source"] },
        workshops: { fields: ["cfp"] },
      },
    };
    const state = fromOteConfig(config as unknown as OteConfig);
    expect(state.profile).toBe("sponsors");
    expect(state.customProfiles).toEqual([
      { name: "sponsors", fields: ["source"] },
      { name: "workshops", fields: ["cfp"] },
    ]);
  });
});

describe("toOteConfigJson", () => {
  it("builds a fresh { feed } document from an empty draft when there's no existing config", () => {
    const state = emptyFeedConfigState();
    state.title = "New feed";
    expect(toOteConfigJson(state, null)).toEqual({ feed: { title: "New feed" } });
  });

  it("edits one field without disturbing untouched feed fields or top-level keys", () => {
    const state = fromOteConfig(realish as unknown as OteConfig);
    state.description = "Updated description";
    const result = toOteConfigJson(state, realish as unknown as Record<string, unknown>);
    expect(result._comment).toBe(realish._comment);
    expect(result._comment_organizers).toBe(realish._comment_organizers);
    expect(result.profile).toBe("all");
    const feed = result.feed as Record<string, unknown>;
    expect(feed.description).toBe("Updated description");
    expect(feed.title).toBe("GDG Sample City Events");
    expect(feed.textLanguage).toBe("en");
    expect(feed.organizers).toEqual(realish.feed.organizers);
  });

  it("round-trips existing feed.translations unchanged when the form doesn't touch them", () => {
    const withTranslations = {
      feed: { title: "x", translations: { es: { title: "x-es" } } },
    };
    const state = fromOteConfig(withTranslations as unknown as OteConfig);
    state.title = "y";
    const result = toOteConfigJson(
      state,
      withTranslations as unknown as Record<string, unknown>,
    );
    const feed = result.feed as Record<string, unknown>;
    expect(feed.title).toBe("y");
    expect(feed.translations).toEqual({ es: { title: "x-es" } });
  });

  it("writes an edited translation and drops language entries left fully blank", () => {
    const state = emptyFeedConfigState();
    state.title = "x";
    state.translations = {
      es: { title: "x-es", description: "" },
      fr: { title: "", description: "" },
    };
    const result = toOteConfigJson(state, null);
    const feed = result.feed as Record<string, unknown>;
    expect(feed.translations).toEqual({ es: { title: "x-es" } });
  });

  it("omits translations entirely when every language ends up blank", () => {
    const withTranslations = { feed: { title: "x", translations: { es: { title: "x-es" } } } };
    const state = fromOteConfig(withTranslations as unknown as OteConfig);
    state.translations = {};
    const result = toOteConfigJson(state, withTranslations as unknown as Record<string, unknown>);
    const feed = result.feed as Record<string, unknown>;
    expect(feed.translations).toBeUndefined();
  });

  it("drops blank organizer rows and empty string fields, same as events' own organizers", () => {
    const state = emptyFeedConfigState();
    state.organizers = [
      { name: "Real Org", url: "", email: "", type: "" },
      { name: "", url: "", email: "", type: "" },
    ];
    const result = toOteConfigJson(state, null);
    const feed = result.feed as Record<string, unknown>;
    expect(feed.organizers).toEqual([{ name: "Real Org" }]);
  });

  it("omits organizers entirely when the list ends up empty", () => {
    const state = emptyFeedConfigState();
    state.title = "x";
    const result = toOteConfigJson(state, realish as unknown as Record<string, unknown>);
    // realish had organizers set; clearing them in state should drop the key.
    const feed = result.feed as Record<string, unknown>;
    expect(feed.organizers).toBeUndefined();
  });

  it("a profile-less config round-trips with no profile/customProfiles written when left untouched", () => {
    const noProfile = { feed: { title: "x" } };
    const state = fromOteConfig(noProfile as unknown as OteConfig);
    expect(state.profile).toBe(""); // sanity: the picker would start unselected
    state.description = "edited elsewhere, profile never touched";
    const result = toOteConfigJson(state, noProfile as unknown as Record<string, unknown>);
    expect(result.profile).toBeUndefined();
    expect(result.customProfile).toBeUndefined();
    expect(result.customProfiles).toBeUndefined();
  });

  it("switching the default away from a custom profile keeps that profile defined, only changes the default", () => {
    const withCustom = { customProfile: { fields: ["description"] } };
    const state = fromOteConfig(withCustom as unknown as OteConfig);
    expect(state.profile).toBe("custom");
    state.profile = "meetup";
    const result = toOteConfigJson(state, withCustom as unknown as Record<string, unknown>);
    expect(result.profile).toBe("meetup");
    expect(result.customProfile).toBeUndefined();
    expect(result.customProfiles).toEqual({ custom: { fields: ["description"] } });
  });

  it("removing a custom profile row (not just switching the default) drops it from customProfiles", () => {
    const withCustom = { customProfile: { fields: ["description"] } };
    const state = fromOteConfig(withCustom as unknown as OteConfig);
    state.profile = "meetup";
    state.customProfiles = [];
    const result = toOteConfigJson(state, withCustom as unknown as Record<string, unknown>);
    expect(result.customProfiles).toBeUndefined();
  });

  it("adding and selecting a new named custom profile writes it under customProfiles, never the legacy key", () => {
    const withProfile = { profile: "conference" };
    const state = fromOteConfig(withProfile as unknown as OteConfig);
    state.customProfiles.push({ name: "custom", fields: ["description", "cfp"] });
    state.profile = "custom";
    const result = toOteConfigJson(state, withProfile as unknown as Record<string, unknown>);
    expect(result.profile).toBe("custom");
    expect(result.customProfile).toBeUndefined();
    expect(result.customProfiles).toEqual({ custom: { fields: ["description", "cfp"] } });
  });

  it("writes multiple named custom profiles, dropping rows with a blank name or no fields", () => {
    const state = emptyFeedConfigState();
    state.title = "x";
    state.customProfiles = [
      { name: "sponsors", fields: ["source"] },
      { name: "workshops", fields: ["cfp"] },
      { name: "", fields: ["source"] },
      { name: "empty", fields: [] },
    ];
    const result = toOteConfigJson(state, null);
    expect(result.customProfiles).toEqual({
      sponsors: { fields: ["source"] },
      workshops: { fields: ["cfp"] },
    });
  });

  it("a legacy-only config round-trips through fromOteConfig/toOteConfigJson onto the new map shape (migration on save)", () => {
    const legacy = { customProfile: { fields: ["description"] } };
    const state = fromOteConfig(legacy as unknown as OteConfig);
    const result = toOteConfigJson(state, legacy as unknown as Record<string, unknown>);
    expect(result.profile).toBe("custom");
    expect(result.customProfile).toBeUndefined();
    expect(result.customProfiles).toEqual({ custom: { fields: ["description"] } });
  });

  it("a custom profile named like a builtin round-trips, to support overriding it", () => {
    const state = emptyFeedConfigState();
    state.title = "x";
    state.profile = "meetup";
    state.customProfiles = [{ name: "meetup", fields: ["source"] }];
    const result = toOteConfigJson(state, null);
    expect(result.profile).toBe("meetup");
    expect(result.customProfiles).toEqual({ meetup: { fields: ["source"] } });
  });
});

describe("likelyAggregatorFeed", () => {
  const eventWithOrganizers = (id: string, names: string[]): OteEvent =>
    ({
      id,
      name: id,
      timezone: "Europe/Madrid",
      startDate: "2026-06-11T18:30",
      organizers: names.map((name) => ({ name })),
    }) as unknown as OteEvent;

  it("no events → false", () => {
    expect(likelyAggregatorFeed([])).toBe(false);
  });

  it("events with no organizers of their own → false", () => {
    const events = [
      { id: "a", name: "a", timezone: "Europe/Madrid", startDate: "2026-06-11T18:30" },
      { id: "b", name: "b", timezone: "Europe/Madrid", startDate: "2026-07-11T18:30" },
    ] as unknown as OteEvent[];
    expect(likelyAggregatorFeed(events)).toBe(false);
  });

  it("every event sharing the same organizer set → false", () => {
    const events = [
      eventWithOrganizers("a", ["PyAlmería"]),
      eventWithOrganizers("b", ["PyAlmería"]),
      eventWithOrganizers("c", ["PyAlmería"]),
    ];
    expect(likelyAggregatorFeed(events)).toBe(false);
  });

  it("one community feed plus a single co-organized guest event (2 sets) → false, the normal case", () => {
    const events = [
      eventWithOrganizers("a", ["PyAlmería"]),
      eventWithOrganizers("b", ["PyAlmería"]),
      // The one co-organized event: the community plus a guest.
      eventWithOrganizers("c", ["PyAlmería", "Django Girls Almería"]),
    ];
    expect(likelyAggregatorFeed(events)).toBe(false);
  });

  it("3+ genuinely distinct organizer sets → true", () => {
    const events = [
      eventWithOrganizers("a", ["PyAlmería"]),
      eventWithOrganizers("b", ["GDG Madrid"]),
      eventWithOrganizers("c", ["React Barcelona"]),
    ];
    expect(likelyAggregatorFeed(events)).toBe(true);
  });

  it("organizer order within an event doesn't create a false distinct set", () => {
    const events = [
      eventWithOrganizers("a", ["Alice", "Bob"]),
      eventWithOrganizers("b", ["Bob", "Alice"]),
      eventWithOrganizers("c", ["Carol"]),
    ];
    // Only 2 distinct sets ({Alice,Bob} and {Carol}) once order is ignored.
    expect(likelyAggregatorFeed(events)).toBe(false);
  });
});
