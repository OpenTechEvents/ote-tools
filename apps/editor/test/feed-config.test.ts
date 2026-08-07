import { describe, expect, it } from "vitest";

import {
  emptyFeedConfigState,
  fromOteConfig,
  toOteConfigJson,
} from "../src/lib/feed-config.js";
import type { OteConfig } from "../src/lib/types.js";

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
  it("is all-empty, no organizers", () => {
    expect(emptyFeedConfigState()).toEqual({
      title: "",
      description: "",
      url: "",
      license: "",
      licenseUrl: "",
      textLanguage: "",
      organizers: [],
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

  it("preserves feed.translations even though this form never edits it", () => {
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
});
