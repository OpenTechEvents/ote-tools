// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { feedToRss, rssToPreviewFeed } from "@opentechevents/export-rss";
import fixture from "../../../packages/export-rss/fixtures/feed.json";
import { adoptersScript } from "../src/adopters.js";

declare const document: {
  body: { innerHTML: string };
  querySelector(selector: string): { textContent: string | null; value: string; checked: boolean; disabled: boolean; dispatchEvent(event: Event): boolean } | null;
  querySelectorAll(selector: string): Iterable<{ href: string }> & { length: number };
};

afterEach(() => { vi.unstubAllGlobals(); document.body.innerHTML = ""; });

const markup = `<form id="convert-form"><input id="feed"><select id="adopter-select"><option value="">Choose</option></select><input type="radio" name="format" value="ics"><input type="radio" name="format" value="rss"><input type="radio" name="format" value="schema"><div id="language-block" hidden><select id="language" name="lang" disabled><option value="">Original text</option></select></div><input type="checkbox" id="cache-bypass" name="cache" value="bypass"><button id="convert-submit"></button><input id="result-url"><button id="copy-url"></button><p id="url-copy-status"></p></form>`;

describe("conversion form", () => {
  it("fills the feed URL from a safe registered adopter and builds a copyable conversion URL", async () => {
    document.body.innerHTML = markup;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ adopters: [
      { name: '<img src=x onerror=alert(1)>', feed: 'https://example.org/feed?one=1&two=2' },
      { name: 'No feed' }, { name: 'Invalid', feed: 'javascript:alert(1)' },
    ] }) }));
    new Function(adoptersScript)();
    await vi.waitFor(() => expect(document.querySelectorAll('#adopter-select option')).toHaveLength(2));
    const select = document.querySelector('#adopter-select')!;
    select.value = 'https://example.org/feed?one=1&two=2';
    select.dispatchEvent(new Event('change'));
    expect(document.querySelector('#feed')?.value).toBe('https://example.org/feed?one=1&two=2');
    expect(document.querySelector('#adopter-select img')).toBeNull();
    expect(document.querySelector('#copy-url')?.disabled).toBe(true);
    const schema = document.querySelector('input[value="schema"]')!;
    schema.checked = true;
    schema.dispatchEvent(new Event('change', { bubbles: true }));
    const url = new URL(document.querySelector('#result-url')!.value);
    expect(url.pathname).toBe('/schema');
    expect(url.searchParams.get('feed')).toBe('https://example.org/feed?one=1&two=2');
    expect(document.querySelector('#copy-url')?.disabled).toBe(false);
    expect(document.querySelector('#convert-submit')?.textContent).toBe('View schema.org');
    const bypass = document.querySelector('#cache-bypass')!;
    bypass.checked = true;
    bypass.dispatchEvent(new Event('change', { bubbles: true }));
    expect(new URL(document.querySelector('#result-url')!.value).searchParams.get('cache')).toBe('bypass');
    const rss = document.querySelector('input[value="rss"]')!;
    rss.checked = true;
    rss.dispatchEvent(new Event('change', { bubbles: true }));
    expect(new URL(document.querySelector('#result-url')!.value).pathname).toBe('/rss');
    expect(document.querySelector('#convert-submit')?.textContent).toBe('Open RSS');
  });
  it("shows detected text languages and includes the chosen language in the URL", async () => {
    document.body.innerHTML = markup;
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string | URL) => ({
      ok: true,
      json: async () => String(url).includes('adopters.json') ? { adopters: [] } : { languages: ['en', 'es'] },
    })));
    new Function(adoptersScript)();
    const input = document.querySelector('#feed')!;
    input.value = 'https://example.org/feed.json';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const format = document.querySelector('input[value="schema"]')!;
    format.checked = true;
    format.dispatchEvent(new Event('change', { bubbles: true }));
    await vi.waitFor(() => expect(document.querySelectorAll('#language option')).toHaveLength(3), { timeout: 2000 });
    const language = document.querySelector('#language')!;
    expect(language.disabled).toBe(false);
    language.value = 'es';
    language.dispatchEvent(new Event('change', { bubbles: true }));
    expect(new URL(document.querySelector('#result-url')!.value).searchParams.get('lang')).toBe('es');
  });
  it("keeps manual entry available when the registry is unreachable", async () => {
    document.body.innerHTML = markup;
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error('offline')));
    new Function(adoptersScript)();
    await vi.waitFor(() => expect(document.querySelector('#adopter-select option')?.textContent).toBe('Examples unavailable'));
    expect(document.querySelector('#feed')).not.toBeNull();
  });
});

describe("Spanish RSS preview", () => {
  it("recognizes localized date and place labels", () => {
    const xml = feedToRss(JSON.parse(JSON.stringify(fixture)), { locale: "es" });
    const preview = rssToPreviewFeed(xml);
    const june = preview.events.find((event) => event.title.includes("PyAlmería"));
    expect(june?.when).toContain("junio");
    expect(june?.location).toBeTruthy();
  });
});
