import { describe, expect, it } from "vitest";

import {
  emptyFormState,
  fromEventJson,
  suggestId,
  suggestSlug,
  toEventJson,
} from "../src/lib/event-json.js";
import type { OteEvent } from "../src/lib/types.js";

describe("toEventJson", () => {
  it("empty inputs are omitted, never defaulted", () => {
    const state = emptyFormState();
    state.name = "Async night";
    expect(toEventJson(state)).toEqual({ name: "Async night" });
  });

  it("emits no specVersion and no license unless the user sets one", () => {
    const state = emptyFormState("Europe/Madrid");
    state.name = "x";
    const event = toEventJson(state) as unknown as Record<string, unknown>;
    expect(event.specVersion).toBeUndefined();
    expect(event.license).toBeUndefined();
  });

  it("combines date + time into a wall-clock date-time with seconds", () => {
    const state = emptyFormState("Europe/Madrid");
    state.startDate = "2026-06-11";
    state.startTime = "18:30";
    state.endDate = "2026-06-11";
    state.endTime = "20:00";
    const event = toEventJson(state);
    expect(event.startDate).toBe("2026-06-11T18:30:00");
    expect(event.endDate).toBe("2026-06-11T20:00:00");
  });

  it("all-day events emit date-only for both dates", () => {
    const state = emptyFormState();
    state.allDay = true;
    state.startDate = "2026-10-15";
    state.endDate = "2026-10-16";
    state.startTime = "09:00"; // stale from a previous timed edit: ignored
    const event = toEventJson(state);
    expect(event.startDate).toBe("2026-10-15");
    expect(event.endDate).toBe("2026-10-16");
  });

  it("end time without an end date reuses the start date", () => {
    const state = emptyFormState();
    state.startDate = "2026-06-11";
    state.startTime = "18:30";
    state.endTime = "20:00";
    expect(toEventJson(state).endDate).toBe("2026-06-11T20:00:00");
  });

  it("splits tags and languages on commas, dropping blanks", () => {
    const state = emptyFormState();
    state.tags = "python, async, ,";
    state.languages = "es,en";
    const event = toEventJson(state);
    expect(event.tags).toEqual(["python", "async"]);
    expect(event.languages).toEqual(["es", "en"]);
  });

  it("builds nested location and source only when something is filled", () => {
    const state = emptyFormState();
    state.venue = "El Cable, Almería";
    state.geoLat = "36.84";
    state.geoLon = "-2.46";
    state.sourceName = "Meetup";
    const event = toEventJson(state);
    expect(event.location).toEqual({
      venue: "El Cable, Almería",
      geo: { lat: 36.84, lon: -2.46 },
    });
    expect(event.source).toEqual({ name: "Meetup" });
  });

  it("keeps non-numeric geo text so validation can flag it", () => {
    const state = emptyFormState();
    state.geoLat = "north";
    state.geoLon = "-2.46";
    expect(toEventJson(state).location?.geo).toEqual({
      lat: "north",
      lon: -2.46,
    });
  });
});

describe("fromEventJson / round-trip", () => {
  const event: OteEvent = {
    id: "https://pyalmeria.example/eventos/2026-06-async",
    name: "Intro to async/await",
    description: "Introductory talk.",
    startDate: "2026-06-11T18:30:00",
    endDate: "2026-06-11T20:00:00",
    timezone: "Europe/Madrid",
    attendanceMode: "online",
    location: { onlineUrl: "https://meet.example/pyalmeria" },
    languages: ["es"],
    tags: ["python", "async"],
  };

  it("prefills the form from an event file", () => {
    const state = fromEventJson(event, "2026-06-async");
    expect(state.slug).toBe("2026-06-async");
    expect(state.allDay).toBe(false);
    expect(state.startDate).toBe("2026-06-11");
    expect(state.startTime).toBe("18:30");
    expect(state.tags).toBe("python, async");
    expect(state.onlineUrl).toBe("https://meet.example/pyalmeria");
  });

  it("round-trips a timed event unchanged", () => {
    expect(toEventJson(fromEventJson(event, "s"))).toEqual(event);
  });

  it("round-trips an all-day event unchanged", () => {
    const allDay: OteEvent = {
      id: "https://x.example/events/devfest",
      name: "DevFest",
      startDate: "2026-10-15",
      endDate: "2026-10-16",
      timezone: "UTC",
      status: "scheduled",
      location: { venue: "Campus", geo: { lat: 40.4168, lon: -3.7038 } },
      source: { name: "Meetup", retrievedAt: "2026-06-01T05:00:00Z" },
    };
    const state = fromEventJson(allDay, "devfest");
    expect(state.allDay).toBe(true);
    expect(toEventJson(state)).toEqual(allDay);
  });
});

describe("suggestSlug", () => {
  it("uses year-month + kebab-cased name, fixture style", () => {
    expect(suggestSlug("Intro a async/await", "2026-06-11")).toBe(
      "2026-06-intro-a-async-await",
    );
  });

  it("folds diacritics", () => {
    expect(suggestSlug("Charla en Almería", "2026-07-01")).toBe(
      "2026-07-charla-en-almeria",
    );
  });

  it("works without a date and returns '' without a name", () => {
    expect(suggestSlug("DevFest", "")).toBe("devfest");
    expect(suggestSlug("", "2026-06-11")).toBe("");
    expect(suggestSlug("¡¡¡", "2026-06-11")).toBe("");
  });
});

describe("suggestId", () => {
  it("prefers the feed url from ote.config.json", () => {
    expect(
      suggestId({ feed: { url: "https://pyalmeria.example/" } }, "o/r", "s"),
    ).toBe("https://pyalmeria.example/events/s");
  });

  it("falls back to the fork's Pages URL", () => {
    expect(suggestId(null, "octocat/my-events", "s")).toBe(
      "https://octocat.github.io/my-events/events/s",
    );
  });

  it("returns '' without a slug", () => {
    expect(suggestId(null, "o/r", "")).toBe("");
  });
});
