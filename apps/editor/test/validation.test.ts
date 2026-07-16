import { describe, expect, it } from "vitest";

import { validateDraft } from "../src/lib/validation.js";
import type { OteEvent } from "../src/lib/types.js";

const NOW = "2026-07-16T12:00:00Z";

const config = {
  feed: { title: "Test feed", license: "CC-BY-4.0" },
  profile: "meetup",
};

const validEvent: OteEvent = {
  id: "https://x.example/events/2026-06-async",
  name: "Async night",
  startDate: "2026-06-11T18:30:00",
  timezone: "Europe/Madrid",
};

describe("validateDraft", () => {
  it("a minimal valid event (no license, no specVersion) passes", () => {
    const result = validateDraft(config, validEvent, NOW);
    expect(result.valid).toBe(true);
    expect(result.fieldErrors.size).toBe(0);
    expect(result.documentErrors).toEqual([]);
  });

  it("missing required fields map to their form fields", () => {
    const result = validateDraft(
      config,
      { name: "x" } as unknown as OteEvent,
      NOW,
    );
    expect(result.valid).toBe(false);
    const flagged = [...result.fieldErrors.keys()].concat(
      result.documentErrors,
    );
    // id, startDate and timezone are required; they surface somewhere visible
    expect(flagged.length).toBeGreaterThan(0);
    expect(result.fieldErrors.has("name")).toBe(false);
  });

  it("a bad nested field maps to its form field", () => {
    const result = validateDraft(
      config,
      {
        ...validEvent,
        location: { onlineUrl: "ftp://nope" },
      },
      NOW,
    );
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.has("onlineUrl")).toBe(true);
  });

  it("mixed date forms are reported, not silently accepted", () => {
    const result = validateDraft(
      config,
      { ...validEvent, endDate: "2026-06-12" }, // timed start, all-day end
      NOW,
    );
    expect(result.valid).toBe(false);
  });

  it("config problems are kept apart from event problems", () => {
    const result = validateDraft(
      { feed: { title: "no license" } },
      validEvent,
      NOW,
    );
    expect(result.valid).toBe(true); // the event itself is fine
    expect(result.configProblems.length).toBeGreaterThan(0);
  });

  it("a null config validates against a placeholder feed", () => {
    const result = validateDraft(null, validEvent, NOW);
    expect(result.valid).toBe(true);
    expect(result.configProblems).toEqual([]);
  });
});
