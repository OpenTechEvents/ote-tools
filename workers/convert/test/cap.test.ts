import { describe, expect, it, vi } from "vitest";
import { handleRequest } from "../src/index.js";
import { MAX_EVENTS, capEvents } from "../src/cap.js";
import base from "../../../packages/export-ics/fixtures/feed.json";
import type { fetchDocument } from "../../validator/src/fetch-document.js";

const env = { RATE_LIMITER: { limit: async () => ({ success: true }) } };
const target = "https://example.org/feed.json";
const request = (path: string, init?: RequestInit) => new Request(`https://convert.example${path}`, init);
const fetcher = (document: unknown) => vi.fn(async () => ({ ok: true as const, body: JSON.stringify(document), bytes: 1, contentType: "application/json", finalUrl: target, redirects: [], status: 200, transport: {} })) as unknown as typeof fetchDocument;

/** `count` events, `past` of them already over. */
const feedOf = (count: number, past = 0) => {
  // The template's endDate belongs to its own startDate; a synthetic feed
  // reusing it would fail validation before it ever reached the cap.
  const template = { ...(base.events[0]! as Record<string, unknown>) };
  delete template.endDate;
  return {
    ...base,
    events: Array.from({ length: count }, (_, index) => ({
      ...template,
      id: `https://example.org/e/${index}`,
      name: `Event ${index}`,
      startDate: `${index < past ? "2020" : "2099"}-0${1 + (index % 9)}-1${index % 10}T19:00`,
    })),
  };
};

describe("one request converts a bounded amount of work", () => {
  it("leaves a feed inside the cap untouched", () => {
    const feed = feedOf(MAX_EVENTS);
    const capped = capEvents(feed);
    expect(capped.document).toBe(feed);
    expect(capped.omitted).toBe(0);
  });
  it("drops the events that are over before any that are not", () => {
    const capped = capEvents(feedOf(MAX_EVENTS + 10, 10));
    expect(capped.document.events).toHaveLength(MAX_EVENTS);
    expect(capped.omitted).toBe(10);
    expect(capped.document.events.every((event) => event.startDate.startsWith("2099"))).toBe(true);
  });
  it("keeps the soonest when even the upcoming events exceed the cap", () => {
    const capped = capEvents(feedOf(MAX_EVENTS + 50));
    expect(capped.document.events).toHaveLength(MAX_EVENTS);
    expect(capped.omitted).toBe(50);
    const kept = capped.document.events.map((event) => event.startDate);
    const dropped = feedOf(MAX_EVENTS + 50).events.map((event) => event.startDate).filter((date) => !kept.includes(date));
    for (const date of dropped) expect(kept.every((date2) => date2 <= date)).toBe(true);
  });
  it("counts an event as upcoming through its last day", () => {
    const today = new Date().toISOString().slice(0, 10);
    const feed = feedOf(MAX_EVENTS + 1, MAX_EVENTS + 1);
    feed.events[0]!.startDate = `${today}T09:00`;
    const capped = capEvents(feed);
    expect(capped.document.events.map((event) => event.id)).toContain("https://example.org/e/0");
  });
});

describe("nothing is dropped silently", () => {
  it.each([
    ["ics", "X-WR-CALDESC"],
    ["rss", "<description>"],
  ])("%s says what was left out, in band", async (format, marker) => {
    const response = await handleRequest(request(`/${format}?feed=${encodeURIComponent(target)}`), env, fetcher(feedOf(MAX_EVENTS + 5)));
    const body = (await response.text()).replace(/\r\n[ \t]/g, "");
    expect(response.status).toBe(200);
    expect(body).toContain(marker);
    expect(body).toContain(`showing the ${MAX_EVENTS} soonest of ${MAX_EVENTS + 5}`);
    expect(body).toContain("export locally");
    expect(response.headers.get("x-ote-events-omitted")).toBe("5");
    expect(response.headers.get("x-ote-events-total")).toBe(String(MAX_EVENTS + 5));
  });
  it("says it in Spanish when Spanish was asked for", async () => {
    const response = await handleRequest(request(`/rss?feed=${encodeURIComponent(target)}&lang=es`), env, fetcher(feedOf(MAX_EVENTS + 5)));
    expect(await response.text()).toContain(`se muestran los ${MAX_EVENTS} próximos de ${MAX_EVENTS + 5}`);
  });
  it("shows it on the schema page, escaped, and in the header for machine output", async () => {
    const html = await handleRequest(request(`/schema?feed=${encodeURIComponent(target)}`), env, fetcher(feedOf(MAX_EVENTS + 5)));
    expect(await html.text()).toContain('class="notice"');
    const json = await handleRequest(request(`/schema?feed=${encodeURIComponent(target)}&output=json`), env, fetcher(feedOf(MAX_EVENTS + 5)));
    const graph = (await json.json() as { "@graph": unknown[] })["@graph"];
    expect(graph).toHaveLength(MAX_EVENTS);
    expect(json.headers.get("x-ote-events-omitted")).toBe("5");
  });
  it("says nothing when nothing was left out", async () => {
    const response = await handleRequest(request(`/ics?feed=${encodeURIComponent(target)}`), env, fetcher(base));
    const body = await response.text();
    expect(response.headers.get("x-ote-events-omitted")).toBeNull();
    expect(body).not.toContain("soonest of");
  });
  it("never caps away the single event an id asked for", async () => {
    const feed = feedOf(MAX_EVENTS + 5, MAX_EVENTS + 5);
    const wanted = feed.events[0]!.id;
    const response = await handleRequest(request(`/schema?feed=${encodeURIComponent(target)}&id=${encodeURIComponent(wanted)}&output=json`), env, fetcher(feed));
    expect(response.status).toBe(200);
    expect(JSON.stringify(await response.json())).toContain(wanted);
  });
});
