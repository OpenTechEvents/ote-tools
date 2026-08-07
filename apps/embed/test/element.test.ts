// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defineOteEvents } from "../src/element.js";

defineOteEvents();

function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const SAMPLE_FEED = JSON.stringify({
  title: "Sample",
  events: [
    { name: "Future Event", startDate: "2999-01-01", url: "https://example.org/future" },
    { name: "Past Event", startDate: "2000-01-01" },
  ],
});

describe("<ote-events>", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.unstubAllGlobals();
  });

  it("shows a loading message, then only the upcoming event once the feed resolves", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/feed.json");
    document.body.append(el);

    expect(el.shadowRoot!.textContent).toContain("Loading");
    await flush();

    expect(el.shadowRoot!.querySelectorAll("li.event")).toHaveLength(1);
    expect(el.shadowRoot!.textContent).toContain("Future Event");
    expect(el.shadowRoot!.textContent).not.toContain("Past Event");
  });

  it('includes past events too when show-past="true"', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/feed.json");
    el.setAttribute("show-past", "true");
    document.body.append(el);
    await flush();
    expect(el.shadowRoot!.querySelectorAll("li.event")).toHaveLength(2);
  });

  it("shows a human-readable error state on a non-ok response", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404, text: async () => "" });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/missing.json");
    document.body.append(el);
    await flush();
    expect(el.shadowRoot!.querySelector(".message.error")).toBeTruthy();
    expect(el.shadowRoot!.textContent).toContain("404");
  });

  it('shows an error state without ever calling fetch when "feed" is missing', async () => {
    const el = document.createElement("ote-events");
    document.body.append(el);
    await flush();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector(".message.error")).toBeTruthy();
  });

  it("shows the empty-state message when every event is filtered out", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({ events: [{ name: "Past only", startDate: "2000-01-01" }] }),
    });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/feed.json");
    document.body.append(el);
    await flush();
    expect(el.shadowRoot!.textContent).toMatch(/No upcoming events/);
  });

  it("re-renders on a limit change without re-fetching", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/feed.json");
    el.setAttribute("show-past", "true");
    document.body.append(el);
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    el.setAttribute("limit", "1");
    expect(el.shadowRoot!.querySelectorAll("li.event")).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("re-fetches when the feed attribute itself changes", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/a.json");
    document.body.append(el);
    await flush();
    el.setAttribute("feed", "https://example.org/b.json");
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith("https://example.org/b.json");
  });
});
