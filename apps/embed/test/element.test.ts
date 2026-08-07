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

  const RICH_FEED = JSON.stringify({
    events: [
      {
        name: "Rich Event",
        startDate: "2999-01-01",
        url: "https://example.org/rich",
        image: [{ url: "https://example.org/poster.jpg", alt: "Poster" }],
        offers: [{ price: 20, currency: "EUR" }],
        organizers: [{ name: "Fixture Org" }],
        tags: ["one", "two"],
        attendanceMode: "online",
        description: "A rich event with every optional field populated.",
      },
    ],
  });

  it("shows the default fields (image/when/location/attendance/description) but not price/tags/organizer", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/rich.json");
    document.body.append(el);
    await flush();

    const root = el.shadowRoot!;
    expect(root.querySelector("img.event-image")).toBeTruthy();
    expect(root.querySelector(".badge")?.textContent).toBe("Online");
    expect(root.querySelector(".event-description")).toBeTruthy();
    expect(root.querySelector(".price")).toBeNull();
    expect(root.querySelector(".tags")).toBeNull();
    expect(root.querySelector(".event-organizer")).toBeNull();
  });

  it('fields="price,tags" shows only those, replacing the default set entirely', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/rich.json");
    el.setAttribute("fields", "price,tags");
    document.body.append(el);
    await flush();

    const root = el.shadowRoot!;
    expect(root.querySelector(".price")?.textContent).toContain("20");
    expect(root.querySelectorAll(".tag")).toHaveLength(2);
    expect(root.querySelector("img.event-image")).toBeNull();
    expect(root.querySelector(".badge")).toBeNull();
    expect(root.querySelector(".event-description")).toBeNull();
  });

  it('fields="organizer" shows the first organizer\'s name', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/rich.json");
    el.setAttribute("fields", "organizer");
    document.body.append(el);
    await flush();
    expect(el.shadowRoot!.querySelector(".event-organizer")?.textContent).toBe("Fixture Org");
  });

  it("removes a broken thumbnail image from the DOM instead of showing a broken-image icon", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/rich.json");
    document.body.append(el);
    await flush();

    const img = el.shadowRoot!.querySelector("img.event-image")!;
    expect(img).toBeTruthy();
    img.dispatchEvent(new Event("error"));
    expect(el.shadowRoot!.querySelector("img.event-image")).toBeNull();
  });

  it('layout="calendar" shows a calendar-host mount point instead of a list once loaded', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/feed.json");
    el.setAttribute("layout", "calendar");
    document.body.append(el);
    await flush();
    expect(el.shadowRoot!.querySelector(".calendar-host")).toBeTruthy();
    expect(el.shadowRoot!.querySelector("ul.events")).toBeNull();
  });
});
