import { validateFeed } from "@opentechevents/validate";
import { describe, expect, it } from "vitest";

import { buildFeed, SPEC_VERSION, type EventFileInput } from "../src/index.js";

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
      startDate: "2026-08-01T18:00:00",
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

  it("materialises specVersion and the feed license onto each event", () => {
    // Event files may omit both (the editor does); the published feed fills
    // them so every event is a self-contained document.
    const result = buildFeed({ config, events: [event("a.json", {})], now: NOW });
    if (!result.ok) throw new Error(JSON.stringify(result.problems));
    expect(result.feed.events[0].specVersion).toBe(SPEC_VERSION);
    expect(result.feed.events[0].license).toBe("CC-BY-4.0");
  });

  it("a per-event license wins over the feed's (not overwritten)", () => {
    const result = buildFeed({
      config,
      events: [event("a.json", { license: "CC0-1.0" })],
      now: NOW,
    });
    if (!result.ok) throw new Error(JSON.stringify(result.problems));
    expect(result.feed.events[0].license).toBe("CC0-1.0");
    expect(result.feed.license).toBe("CC-BY-4.0"); // feed unchanged
  });

  it("sorts events by startDate then id, regardless of input order", () => {
    const result = buildFeed({
      config,
      events: [
        event("z-first.json", { startDate: "2026-12-01" }),
        event("a-last.json", { startDate: "2026-01-05T10:00:00" }),
      ],
      now: NOW,
    });
    if (!result.ok) throw new Error("expected ok");
    expect(result.feed.events.map((e) => e.startDate)).toEqual([
      "2026-01-05T10:00:00",
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

  it("missing title/license in the feed block → per-field problems", () => {
    const problems = problemsOf(
      buildFeed({ config: { feed: {} }, events: [], now: NOW }),
    );
    expect(problems.map((p) => p.path).sort()).toEqual([
      "feed.license",
      "feed.title",
    ]);
    expect(problems.every((p) => p.file === "ote.config.json")).toBe(true);
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
        config: { feed: { title: "T" } },
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
