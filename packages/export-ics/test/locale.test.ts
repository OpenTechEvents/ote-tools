import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { feedToIcs } from "../src/index.js";
import type { OteFeed } from "../src/types.js";

const feed = JSON.parse(readFileSync(new URL("../fixtures/feed.json", import.meta.url), "utf8")) as OteFeed;

describe("labelled output in the reader's language", () => {
  // Long property values are folded across lines, so assertions here compare
  // unfolded text rather than the wire bytes.
  const unfold = (ics: string) => ics.replaceAll("\r\n ", "");

  it("translates the field names this exporter adds", () => {
    const ics = unfold(feedToIcs(feed, { locale: "es-ES" }));
    expect(ics).toContain("Entradas:");
    expect(ics).toContain("SUMMARY:");
    expect(ics).not.toContain("Tickets:");
  });
  it("translates an enum value the spec writes in English", () => {
    const cancelled = { ...feed, events: feed.events.filter((event) => event.status === "cancelled") };
    expect(cancelled.events.length).toBeGreaterThan(0);
    const ics = unfold(feedToIcs({ ...cancelled, events: cancelled.events.map((event) => ({ ...event, eligibility: { type: "members-only" as const } })) }, { locale: "es" }));
    expect(ics).toContain("Requisitos: solo para miembros");
  });
  it("never translates the publisher's own words", () => {
    // Every SUMMARY is publisher content, so the Spanish and the default
    // output must agree on all of them, character for character.
    const summaries = (ics: string) => unfold(ics).split("\r\n").filter((line) => line.startsWith("SUMMARY"));
    expect(summaries(feedToIcs(feed, { locale: "es" }))).toEqual(summaries(feedToIcs(feed)));
    expect(summaries(feedToIcs(feed)).length).toBe(feed.events.length);
  });
  it("falls back to English for a language with no labels", () => {
    expect(feedToIcs(feed, { locale: "fr-CA" })).toBe(feedToIcs(feed));
  });
  it("changes nothing at all when no locale is asked for", () => {
    // The option is opt-in: every existing caller must keep its bytes.
    expect(feedToIcs(feed, {})).toBe(feedToIcs(feed));
  });
});
