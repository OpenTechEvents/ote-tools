import { describe, expect, it, vi } from "vitest";
import multilingualFeed from "../fixtures/spec-v0.6-community-feed.json";
import legacyFeed from "../fixtures/spec-v0.1-feed.json";
import legacyEvent from "../fixtures/spec-v0.1-event.json";
import legacyEvent2 from "../fixtures/spec-v0.2-event.json";
import oldFeed from "../fixtures/spec-v0.3-feed.json";
import feed from "../../../packages/export-ics/fixtures/feed.json";
import { handleRequest } from "../src/index.js";
import type { fetchDocument } from "../../validator/src/fetch-document.js";

const env = { RATE_LIMITER: { limit: async () => ({ success: true }) } };
const target = "https://example.org/feed.json";
const request = (path: string) => new Request(`https://convert.example${path}`);
const fetcher = (document: unknown) => vi.fn(async () => ({ ok: true as const, body: JSON.stringify(document), bytes: 1, contentType: "application/json", finalUrl: target, redirects: [], status: 200, transport: {} })) as unknown as typeof fetchDocument;

describe("conversion service", () => {
  it.each([["ics", "text/calendar", "BEGIN:VCALENDAR"], ["rss", "application/rss+xml", "<rss"]])("converts a feed to %s", async (format, type, marker) => {
    const response = await handleRequest(request(`/${format}?feed=${encodeURIComponent(target)}`), env, fetcher(feed));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain(type);
    expect(response.headers.get("cache-control")).toContain("s-maxage=900");
    expect(await response.text()).toContain(marker);
  });
  it("returns JSON-LD for a feed and script for an event", async () => {
    const feedResponse = await handleRequest(request(`/schema?feed=${encodeURIComponent(target)}&output=json`), env, fetcher(feed));
    expect((await feedResponse.json() as { "@graph": unknown[] })["@graph"]).toHaveLength(feed.events.length);
    const event = { ...feed.events[0], specVersion: feed.specVersion, license: "CC-BY-4.0" };
    const eventResponse = await handleRequest(request(`/schema?event=${encodeURIComponent(target)}&output=script`), env, fetcher(event));
    expect(await eventResponse.text()).toContain('<script type="application/ld+json">');
  });
  it.each(["json", "script", "html"])("selects one feed event by id in %s output", async (output) => {
    const event = multilingualFeed.events[0]!;
    const response = await handleRequest(request(`/schema?feed=${encodeURIComponent(target)}&id=${encodeURIComponent(event.id)}&output=${output}&lang=en`), env, fetcher(multilingualFeed));
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).toContain("Introduction to async/await");
    expect(body).not.toContain(multilingualFeed.events[1]!.id);
    expect(body).not.toContain("@graph");
    expect(body).toContain("PyAlmería");
  });
  it("renders an accessible event list with escaped titles and individual links", async () => {
    const malicious = structuredClone(multilingualFeed);
    malicious.events[0]!.name = '<img src=x onerror=alert(1)>';
    const response = await handleRequest(request(`/schema?feed=${encodeURIComponent(target)}`), env, fetcher(malicious));
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain("Events in this feed");
    expect(html).toContain("Copy code");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).not.toContain('<img src=x onerror=alert(1)>');
    expect(html).toContain(encodeURIComponent(malicious.events[0]!.id));
    expect(response.headers.get("content-security-policy")).toContain("script-src 'self'");
  });
  it("renders syntax-highlighted JSON-LD without changing the script output", async () => {
    const html = await handleRequest(request(`/schema?feed=${encodeURIComponent(target)}`), env, fetcher(feed));
    const markup = await html.text();
    expect(markup).toContain('class="syntax-key"');
    expect(markup).toContain('class="syntax-string"');
    expect(markup).toContain('class="syntax-tag"');
    expect(markup).toContain('&lt;script type=&quot;application/ld+json&quot;&gt;');
  });
  it("serves the landing page with endpoint documentation without fetching", async () => {
    const mock = fetcher(feed);
    const response = await handleRequest(request("/"), env, mock);
    const html = await response.text();
    expect(response.status).toBe(200);
    for (const value of ["/ics", "/rss", "/schema", "cache=bypass", "lang", "output", "event", "id"]) expect(html).toContain(value);
    expect(html).toContain('action="/"');
    expect(html).toContain('name="format"');
    expect(html).toContain('id="adopter-select"');
    expect(mock).not.toHaveBeenCalled();
  });
  it.each(["ics", "rss", "schema"])("redirects the form to %s with the selected feed", async (format) => {
    const response = await handleRequest(request(`/?feed=${encodeURIComponent(target)}&format=${format}`), env, fetcher(feed));
    expect(response.status).toBe(303);
    const destination = new URL(response.headers.get("location")!, "https://convert.example");
    expect(destination.pathname).toBe(`/${format}`);
    expect(destination.searchParams.get("feed")).toBe(target);
  });
  it.each(["ics", "rss", "schema"])("accepts the form's original language selection for %s", async (format) => {
    const response = await handleRequest(request(`/?feed=${encodeURIComponent(target)}&format=${format}&lang=&cache=bypass`), env, fetcher(feed));
    expect(response.status).toBe(303);
    const destination = new URL(response.headers.get("location")!, "https://convert.example");
    expect(destination.pathname).toBe(`/${format}`);
    expect(destination.searchParams.has("lang")).toBe(false);
    expect(destination.searchParams.get("cache")).toBe("bypass");
  });
  it("preserves language and cache options in the conversion redirect", async () => {
    const response = await handleRequest(request(`/?feed=${encodeURIComponent(target)}&format=ics&lang=es&cache=bypass`), env, fetcher(feed));
    const destination = new URL(response.headers.get("location")!, "https://convert.example");
    expect(destination.searchParams.get("lang")).toBe("es");
    expect(destination.searchParams.get("cache")).toBe("bypass");
  });
  it("detects text translations rather than spoken event languages", async () => {
    const doc = { ...multilingualFeed, events: multilingualFeed.events.map(event => ({ ...event, languages: ["fr"] })) };
    const response = await handleRequest(request(`/feed-languages?feed=${encodeURIComponent(target)}&cache=bypass`), env, fetcher(doc));
    const data = await response.json() as { languages: string[] };
    expect(data.languages).toEqual(["en", "es"]);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("requires an output format and rejects unknown paths", async () => {
    for (const path of [`/?feed=${encodeURIComponent(target)}`, `/?feed=${encodeURIComponent(target)}&format=other`]) {
      expect((await handleRequest(request(path), env, fetcher(feed))).status).toBe(400);
    }
  });
  it("offers a share URL and machine-readable links preserving the selected event and language", async () => {
    const id = multilingualFeed.events[0]!.id;
    const response = await handleRequest(request(`/schema?feed=${encodeURIComponent(target)}&id=${encodeURIComponent(id)}&lang=en&cache=bypass`), env, fetcher(multilingualFeed));
    const html = await response.text();
    expect(html).toContain('id="share-url"');
    expect(html).toContain('data-copy-url');
    expect(html).toContain('output=script');
    expect(html).toContain('output=json');
    expect(html).toContain(encodeURIComponent(id));
    expect(html).toContain('lang=en');
    expect(html).toContain('cache=bypass');
  });
  it("serves the copy script without fetching a source", async () => {
    const mock = fetcher(feed);
    const response = await handleRequest(request("/schema-ui.js"), env, mock);
    expect(response.headers.get("content-type")).toContain("javascript");
    expect(await response.text()).toContain("navigator.clipboard.writeText");
    expect(mock).not.toHaveBeenCalled();
  });
  it("returns a non-cacheable 404 when no event has the exact id", async () => {
    const response = await handleRequest(request(`/schema?feed=${encodeURIComponent(target)}&id=${encodeURIComponent("https://missing.example/event")}`), env, fetcher(feed));
    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect((await response.json() as { error: string }).error).toBe("event-not-found");
  });
  it.each(["/schema?event=https%3A%2F%2Fexample.org&id=x", "/ics?feed=https%3A%2F%2Fexample.org&id=x", "/schema?feed=https%3A%2F%2Fexample.org&id=", "/schema?feed=https%3A%2F%2Fexample.org&id=a&id=b"])("rejects an invalid id selector before fetching: %s", async (path) => {
    const mock = fetcher(feed);
    const response = await handleRequest(request(path), env, mock);
    expect(response.status).toBe(400);
    expect(mock).not.toHaveBeenCalled();
  });
  it("does not cache bypass responses or invalid documents", async () => {
    const bypass = await handleRequest(request(`/ics?feed=${encodeURIComponent(target)}&cache=bypass`), env, fetcher(feed));
    expect(bypass.headers.get("cache-control")).toBe("no-store");
    const invalid = await handleRequest(request(`/ics?feed=${encodeURIComponent(target)}`), env, fetcher({ specVersion: "0.6.0" }));
    expect(invalid.status).toBe(422);
    expect(invalid.headers.get("cache-control")).toBe("no-store");
  });
  it("converts a valid older feed using its own published schema", async () => {
    const response = await handleRequest(request(`/ics?feed=${encodeURIComponent(target)}`), env, fetcher(oldFeed));
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("BEGIN:VEVENT");
  });
  it.each([legacyEvent, legacyEvent2])("ignores pre-0.3 extensions that conflict with newer field shapes", async (event) => {
    const response = await handleRequest(request(`/schema?event=${encodeURIComponent(target)}&output=json`), env, fetcher(event));
    expect(response.status).toBe(200);
    const result = await response.json() as Record<string, unknown>;
    expect(result.name).toBe(event.name);
    expect(result.image).toBeUndefined();
    expect(result.offers).toBeUndefined();
  });
  it("preserves seconds in the official OTE 0.1 feed's iCalendar times", async () => {
    const response = await handleRequest(request(`/ics?feed=${encodeURIComponent(target)}`), env, fetcher(legacyFeed));
    const body = (await response.text()).replace(/\r\n[ \t]/g, "");
    expect(body).toContain("DTSTART:20260626T170000Z\r\n");
    expect(body).toContain("DTEND:20260626T190000Z\r\n");
    expect(body).toContain("X-OTE-TIMEZONE:Europe/Madrid\r\n");
    expect(body).not.toContain(";TZID=");
  });
  it.each(["ics", "rss", "schema"])("converts an official 0.1 feed to %s", async (format) => {
    const response = await handleRequest(request(`/${format}?feed=${encodeURIComponent(target)}`), env, fetcher(legacyFeed));
    expect(response.status).toBe(200);
  });
  it("returns a clear error for an interval inverted by a DST gap", async () => {
    const gap = { ...feed, events: [{ ...feed.events[0]!, startDate: "2026-03-29T02:30", endDate: "2026-03-29T03:15", timezone: "Europe/Madrid" }] };
    const response = await handleRequest(request(`/ics?feed=${encodeURIComponent(target)}`), env, fetcher(gap));
    expect(response.status).toBe(422);
    expect((await response.json() as { error: string }).error).toBe("invalid-time-range");
  });
  it("uses requested Spanish labels in plain-text and HTML calendar descriptions", async () => {
    const withSpeaker = { ...feed, events: feed.events.map((event, i) => i === 0 ? { ...event, speakers: [{ name: "Speaker" }] } : event) };
    const response = await handleRequest(request(`/ics?feed=${encodeURIComponent(target)}&lang=es`), env, fetcher(withSpeaker));
    const body = (await response.text()).replace(/\r\n[ \t]/g, "");
    expect(body).toContain("En línea: https://meet.example/rust-madrid");
    expect(body).toContain("Ponentes:");
    expect(body).toContain("<p>En línea: <a href=");
    const english = await handleRequest(request(`/ics?feed=${encodeURIComponent(target)}&lang=en`), env, fetcher(feed));
    expect((await english.text()).replace(/\r\n[ \t]/g, "")).toContain("Online: https://meet.example/rust-madrid");
  });
  it("uses Spanish RSS metadata labels when requested", async () => {
    const withSpeaker = { ...feed, events: feed.events.map((event, i) => i === 0 ? { ...event, speakers: [{ name: "Speaker" }] } : event) };
    const response = await handleRequest(request(`/rss?feed=${encodeURIComponent(target)}&lang=es`), env, fetcher(withSpeaker));
    const body = await response.text();
    expect(body).toContain("Cuándo:");
    expect(body).toContain("Dónde:");
    expect(body).toContain("Ponentes:");
    expect(body).toContain("Entradas:");
  });
  it("uses publisher translations and falls back per event", async () => {
    const response = await handleRequest(request(`/schema?feed=${encodeURIComponent(target)}&output=json&lang=en`), env, fetcher(multilingualFeed));
    expect(response.status).toBe(200);
    const json = await response.json() as { "@graph": { name: string; description?: string }[] };
    expect(json["@graph"][0]?.name).toContain("Introduction to async/await");
    expect(json["@graph"][1]?.name).toBe(multilingualFeed.events[1]?.name);
  });
  it("formats RSS event dates using the requested locale without shifting wall time", async () => {
    const response = await handleRequest(request(`/rss?feed=${encodeURIComponent(target)}&lang=es-ES`), env, fetcher(multilingualFeed));
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(body).toContain("11 de junio de 2026");
    expect(body).toContain("18:30");
  });
  it("rejects malformed locale before fetching", async () => {
    const mock = fetcher(feed);
    const response = await handleRequest(request(`/rss?feed=${encodeURIComponent(target)}&lang=not_a_tag`), env, mock);
    expect(response.status).toBe(400);
    expect(mock).not.toHaveBeenCalled();
  });
  it("limits expensive requests before fetching", async () => {
    const mock = fetcher(feed);
    const limited = { RATE_LIMITER: { limit: async () => ({ success: false }) } };
    const response = await handleRequest(request(`/ics?feed=${encodeURIComponent(target)}`), limited, mock);
    expect(response.status).toBe(429);
    expect(mock).not.toHaveBeenCalled();
  });
  it("answers 405 to a POST, now that no endpoint here accepts one", async () => {
    const response = await handleRequest(new Request(`https://convert.example/purge?feed=${encodeURIComponent(target)}`, { method: "POST" }), env);
    expect(response.status).toBe(405);
  });
  it("rejects ambiguous source parameters before fetching", async () => {
    const mock = fetcher(feed);
    const response = await handleRequest(request(`/schema?feed=${target}&event=${target}`), env, mock);
    expect(response.status).toBe(400);
    expect(mock).not.toHaveBeenCalled();
  });
});
