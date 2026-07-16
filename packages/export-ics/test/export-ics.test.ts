import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { validateFeed } from "@opentechevents/validate";
import { describe, expect, it } from "vitest";

import { feedToIcs, type OteFeed } from "../src/index.js";

const fixturePath = fileURLToPath(
  new URL("../fixtures/feed.json", import.meta.url),
);
const feed = JSON.parse(readFileSync(fixturePath, "utf8")) as OteFeed;
const ics = feedToIcs(feed);

/** Reverses RFC 5545 folding so properties can be asserted whole. */
const unfolded = ics.replace(/\r\n[ \t]/g, "");

function veventFor(id: string): string {
  const events = unfolded.split("BEGIN:VEVENT").slice(1);
  const match = events.find((e) => e.includes(`UID:${id}`));
  if (!match) throw new Error(`no VEVENT with UID ${id}`);
  return match;
}

describe("feedToIcs", () => {
  it("fixture is a valid OTE feed (guards the fixture itself)", () => {
    expect(validateFeed(feed).errors).toEqual([]);
  });

  it("produces a VCALENDAR wrapping one VEVENT per event", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(unfolded).toContain("VERSION:2.0");
    expect(unfolded).toContain("X-WR-CALNAME:OTE Export Fixtures");
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(feed.events.length);
    expect(ics.match(/END:VEVENT/g)).toHaveLength(feed.events.length);
  });

  it("is deterministic: DTSTAMP comes from feed.updatedAt, not a clock", () => {
    expect(feedToIcs(feed)).toBe(ics);
    expect(unfolded.match(/DTSTAMP:20260706T100000Z/g)).toHaveLength(
      feed.events.length,
    );
  });

  it("timed events carry TZID wall-clock DTSTART/DTEND", () => {
    const vevent = veventFor("https://rustmadrid.example/meetups/2026-06");
    expect(vevent).toContain("DTSTART;TZID=Europe/Madrid:20260626T190000");
    expect(vevent).toContain("DTEND;TZID=Europe/Madrid:20260626T210000");
  });

  it("multi-day all-day events use VALUE=DATE with exclusive DTEND (+1 day)", () => {
    const vevent = veventFor("https://devfest-levante.example/2026");
    expect(vevent).toContain("DTSTART;VALUE=DATE:20261016");
    expect(vevent).toContain("DTEND;VALUE=DATE:20261018");
  });

  it("all-day event without endDate omits DTEND", () => {
    const vevent = veventFor("https://coolconf.example/2026");
    expect(vevent).toContain("DTSTART;VALUE=DATE:20261105");
    expect(vevent).not.toContain("DTEND");
  });

  it("UTC timezone uses the Z form and pads missing seconds", () => {
    const vevent = veventFor("https://minimal.example/meetup/2026-09");
    expect(vevent).toContain("DTSTART:20260901T183000Z");
  });

  it("cancelled events map to STATUS:CANCELLED", () => {
    expect(veventFor("https://coolconf.example/2026")).toContain(
      "STATUS:CANCELLED",
    );
    expect(veventFor("https://rustmadrid.example/meetups/2026-06")).toContain(
      "STATUS:CONFIRMED",
    );
  });

  it("absent status stays absent — no STATUS invented", () => {
    const vevent = veventFor("https://devfest-levante.example/2026");
    expect(vevent).not.toContain("STATUS:");
  });

  it("online-only event: onlineUrl becomes URL, no LOCATION", () => {
    const vevent = veventFor("https://pyalmeria.example/eventos/2026-06-async");
    expect(vevent).toContain("URL:https://meet.example/pyalmeria");
    expect(vevent).not.toContain("LOCATION:");
  });

  it("hybrid event: canonical url wins URL, attend link kept in DESCRIPTION", () => {
    const vevent = veventFor("https://rustmadrid.example/meetups/2026-06");
    expect(vevent).toContain("URL:https://rustmadrid.example/meetups/2026-06");
    expect(vevent).toContain("\\n\\nOnline: https://meet.example/rust-madrid");
    expect(vevent).toContain(
      "LOCATION:Campus Madrid\\, Calle de Moreno Nieto 2\\, Madrid",
    );
    expect(vevent).toContain("GEO:40.4081;-3.7188");
  });

  it("escapes TEXT values (commas, semicolons, newlines)", () => {
    expect(veventFor("https://minimal.example/meetup/2026-09")).toContain(
      "SUMMARY:Minimal\\, but valid",
    );
    const online = veventFor("https://pyalmeria.example/eventos/2026-06-async");
    expect(online).toContain("live examples.\\nQ&A at the end.");
    expect(online).toContain("asynchronous Python\\;");
  });

  it("maps tags to CATEGORIES and updatedAt to LAST-MODIFIED", () => {
    const vevent = veventFor("https://pyalmeria.example/eventos/2026-06-async");
    expect(vevent).toContain("CATEGORIES:python,async");
    expect(vevent).toContain("LAST-MODIFIED:20260601T090000Z");
  });

  it("folds every content line at 75 octets", () => {
    const encoder = new TextEncoder();
    const lines = ics.split("\r\n");
    for (const line of lines) {
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
    }
    // The long description was actually folded and survives unfolding intact.
    expect(ics).toContain("\r\n ");
    expect(unfolded).toContain(
      "Talks on WASM and Rust tooling\\, with a deliberately long description to force iCalendar line folding in the exported output.",
    );
  });
});
