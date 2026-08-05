import { validateFeed } from "@opentechevents/validate";
import { describe, expect, it } from "vitest";

import {
  buildFeed,
  resolveEventInheritance,
  SPEC_VERSION,
  type EventFileInput,
  type OteFeed,
} from "../src/index.js";

const NOW = "2026-07-16T10:00:00Z";

const config = {
  feed: {
    title: "Test Events",
    description: "A test feed.",
    url: "https://community.example",
    license: "CC-BY-4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
};

function event(file: string, overrides: Record<string, unknown>): EventFileInput {
  return {
    file,
    json: {
      id: `https://community.example/events/${file}`,
      name: `Event ${file}`,
      startDate: "2026-08-01T18:00",
      timezone: "Europe/Madrid",
      ...overrides,
    },
  };
}

function problemsOf(result: ReturnType<typeof buildFeed>) {
  if (result.ok) throw new Error("expected a failed build");
  return result.problems;
}

describe("buildFeed", () => {
  it("assembles a valid feed from config + events", () => {
    const result = buildFeed({ config, events: [event("a.json", {})], now: NOW });
    if (!result.ok) throw new Error(JSON.stringify(result.problems));
    expect(result.feed.specVersion).toBe(SPEC_VERSION);
    expect(result.feed.title).toBe("Test Events");
    expect(result.feed.description).toBe("A test feed.");
    expect(result.feed.license).toBe("CC-BY-4.0");
    expect(result.feed.updatedAt).toBe(NOW);
    expect(result.feed.events).toHaveLength(1);
    expect(validateFeed(result.feed).errors).toEqual([]);
  });

  it("events inherit the feed license: no per-event license required", () => {
    const result = buildFeed({ config, events: [event("a.json", {})], now: NOW });
    expect(result.ok).toBe(true);
  });

  it("sorts events by startDate then id, regardless of input order", () => {
    const result = buildFeed({
      config,
      events: [
        event("z-first.json", { startDate: "2026-12-01" }),
        event("a-last.json", { startDate: "2026-01-05T10:00" }),
      ],
      now: NOW,
    });
    if (!result.ok) throw new Error("expected ok");
    expect(result.feed.events.map((e) => e.startDate)).toEqual([
      "2026-01-05T10:00",
      "2026-12-01",
    ]);
  });

  it("invalid event → problem carries the source file and the field", () => {
    const result = buildFeed({
      config,
      events: [
        event("good.json", {}),
        event("events/bad.json", { startDate: "2026-08-01T18:00:00+02:00" }),
      ],
      now: NOW,
    });
    const problems = problemsOf(result);
    expect(problems).toHaveLength(1);
    expect(problems[0].file).toBe("events/bad.json");
    expect(problems[0].path).toBe("startDate");
  });

  it("missing required event field → file + missing property in message", () => {
    const result = buildFeed({
      config,
      events: [{ file: "events/no-name.json", json: { id: "https://x.example/1", startDate: "2026-08-01", timezone: "UTC" } }],
      now: NOW,
    });
    const problems = problemsOf(result);
    expect(problems[0].file).toBe("events/no-name.json");
    expect(problems[0].message).toContain('"name"');
  });

  it("missing feed block → problem on ote.config.json", () => {
    const problems = problemsOf(buildFeed({ config: {}, events: [], now: NOW }));
    expect(problems[0].file).toBe("ote.config.json");
    expect(problems[0].path).toBe("feed");
  });

  it("missing title in the feed block → a problem, even with no events", () => {
    const problems = problemsOf(
      buildFeed({ config: { feed: {} }, events: [], now: NOW }),
    );
    expect(problems.map((p) => p.path)).toEqual(["feed.title"]);
    expect(problems.every((p) => p.file === "ote.config.json")).toBe(true);
  });

  it("missing feed.license with no events is fine (D029 is vacuously satisfied)", () => {
    const result = buildFeed({
      config: { feed: { title: "Unlicensed feed" } },
      events: [],
      now: NOW,
    });
    expect(result.ok).toBe(true);
  });

  it("missing feed.license WITH an event that also has none → D029 fails the build", () => {
    const problems = problemsOf(
      buildFeed({
        config: { feed: { title: "Unlicensed feed" } },
        events: [event("events/no-license.json", {})],
        now: NOW,
      }),
    );
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.some((p) => p.file === "events/no-license.json")).toBe(true);
  });

  it("missing feed.license WITH every event declaring its own → builds fine", () => {
    const result = buildFeed({
      config: { feed: { title: "Unlicensed feed" } },
      events: [event("events/licensed.json", { license: "CC0-1.0" })],
      now: NOW,
    });
    expect(result.ok).toBe(true);
  });

  it("schema constraints on config values map back to feed.<field>", () => {
    const problems = problemsOf(
      buildFeed({
        config: { feed: { title: "T", license: "CC-BY-4.0", licenseUrl: "nope" } },
        events: [],
        now: NOW,
      }),
    );
    // "nope" fails both the uri format and the ^https?:// pattern.
    expect(problems.length).toBeGreaterThan(0);
    for (const problem of problems) {
      expect(problem.file).toBe("ote.config.json");
      expect(problem.path).toBe("feed.licenseUrl");
    }
  });

  it("config problems and event problems are reported together", () => {
    const problems = problemsOf(
      buildFeed({
        config: { feed: {} }, // missing title: still unconditionally required
        events: [event("events/bad.json", { timezone: undefined })],
        now: NOW,
      }),
    );
    const files = new Set(problems.map((p) => p.file));
    expect(files).toContain("ote.config.json");
    expect(files).toContain("events/bad.json");
  });

  it("duplicate event ids across files → problem naming both files", () => {
    const problems = problemsOf(
      buildFeed({
        config,
        events: [
          event("events/a.json", { id: "https://x.example/same" }),
          event("events/b.json", { id: "https://x.example/same" }),
        ],
        now: NOW,
      }),
    );
    expect(problems).toHaveLength(1);
    expect(problems[0].file).toBe("events/b.json");
    expect(problems[0].path).toBe("id");
    expect(problems[0].message).toContain("events/a.json");
  });

  it("non-object event document → clear problem, no crash", () => {
    const problems = problemsOf(
      buildFeed({
        config,
        events: [{ file: "events/list.json", json: [1, 2, 3] }],
        now: NOW,
      }),
    );
    expect(problems[0]).toEqual({
      file: "events/list.json",
      path: "(document)",
      message: "must be a JSON object",
    });
  });

  it("empty events directory still builds a valid (empty) feed", () => {
    const result = buildFeed({ config, events: [], now: NOW });
    if (!result.ok) throw new Error("expected ok");
    expect(result.feed.events).toEqual([]);
    expect(validateFeed(result.feed).errors).toEqual([]);
  });
});

describe("buildFeed — v0.3 feed-level config fields", () => {
  it("reads textLanguage and organizers from the config's feed block", () => {
    const result = buildFeed({
      config: {
        feed: {
          ...config.feed,
          textLanguage: "es",
          organizers: [{ name: "PyAlmería", email: "hola@pyalmeria.example" }],
        },
      },
      events: [event("a.json", {})],
      now: NOW,
    });
    if (!result.ok) throw new Error(JSON.stringify(result.problems));
    expect(result.feed.textLanguage).toBe("es");
    expect(result.feed.organizers).toEqual([
      { name: "PyAlmería", email: "hola@pyalmeria.example" },
    ]);
  });

  it("reads translations from the config's feed block", () => {
    const result = buildFeed({
      config: {
        feed: {
          ...config.feed,
          textLanguage: "es",
          translations: { en: { title: "Test Events (EN)" } },
        },
      },
      events: [event("a.json", {})],
      now: NOW,
    });
    if (!result.ok) throw new Error(JSON.stringify(result.problems));
    expect(result.feed.translations).toEqual({ en: { title: "Test Events (EN)" } });
  });

  it("feed.organizers must be an array", () => {
    const problems = problemsOf(
      buildFeed({
        config: { feed: { ...config.feed, organizers: "not-an-array" } },
        events: [],
        now: NOW,
      }),
    );
    expect(problems).toContainEqual({
      file: "ote.config.json",
      path: "feed.organizers",
      message: "must be an array",
    });
  });

  it("feed.translations must be an object", () => {
    const problems = problemsOf(
      buildFeed({
        config: { feed: { ...config.feed, translations: "not-an-object" } },
        events: [],
        now: NOW,
      }),
    );
    expect(problems).toContainEqual({
      file: "ote.config.json",
      path: "feed.translations",
      message: "must be an object",
    });
  });
});

describe("resolveEventInheritance", () => {
  const feed: OteFeed = {
    specVersion: SPEC_VERSION,
    title: "Test Events",
    license: "CC-BY-4.0",
    textLanguage: "es",
    organizers: [{ name: "Feed-level org" }],
    updatedAt: NOW,
    events: [
      {
        id: "https://example.org/events/inherits-everything",
        name: "Inherits everything",
        startDate: "2026-08-01T18:00",
        timezone: "Europe/Madrid",
      },
      {
        id: "https://example.org/events/declares-its-own",
        name: "Declares its own",
        startDate: "2026-08-02T18:00",
        timezone: "Europe/Madrid",
        license: "CC0-1.0",
        textLanguage: "en",
        organizers: [{ name: "Event-level org" }],
      },
    ],
  };

  it("fills in organizers/textLanguage/license from the feed when an event has none", () => {
    const resolved = resolveEventInheritance(feed);
    const [inherits] = resolved.events;
    expect(inherits!.license).toBe("CC-BY-4.0");
    expect(inherits!.textLanguage).toBe("es");
    expect(inherits!.organizers).toEqual([{ name: "Feed-level org" }]);
  });

  it("an event's own values fully replace the feed's — never merged", () => {
    const resolved = resolveEventInheritance(feed);
    const [, declaresOwn] = resolved.events;
    expect(declaresOwn!.license).toBe("CC0-1.0");
    expect(declaresOwn!.textLanguage).toBe("en");
    expect(declaresOwn!.organizers).toEqual([{ name: "Event-level org" }]);
  });

  it("leaves the original feed object's events untouched (does not mutate)", () => {
    resolveEventInheritance(feed);
    expect(feed.events[0]!.license).toBeUndefined();
    expect(feed.events[0]!.organizers).toBeUndefined();
  });
});
