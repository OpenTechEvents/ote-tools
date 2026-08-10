// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defineOteEvents, type OteEventsElement } from "../src/element.js";
import { renderWidget, type WidgetState } from "../src/render.js";

defineOteEvents();

function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function createListElement(): OteEventsElement {
  const el = document.createElement("ote-events") as OteEventsElement;
  el.setAttribute("layout", "list");
  return el;
}

function createCardsElement(): OteEventsElement {
  const el = document.createElement("ote-events") as OteEventsElement;
  el.setAttribute("layout", "cards");
  return el;
}

const SAMPLE_FEED = JSON.stringify({
  title: "Sample",
  events: [
    { name: "Future Event", startDate: "2999-01-01", url: "https://example.org/future" },
    { name: "Past Event", startDate: "2000-01-01" },
  ],
});

function rawLocationState(layout: WidgetState["layout"]): WidgetState {
  return {
    status: "loaded",
    errorMessage: "",
    feed: {
      events: [
        {
          name: "Raw Location Event",
          startDate: "2999-01-01",
          location: "https://meet.jit.si/ParliamentaryCommunicationsAspireSomehow",
        },
      ],
    },
    lang: "en",
    limit: Number.POSITIVE_INFINITY,
    showPast: true,
    layout,
    fields: new Set(["location"]),
  };
}

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

  it("shows a loading message, then all events once the feed resolves", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/feed.json");
    document.body.append(el);

    expect(el.shadowRoot!.textContent).toContain("Loading");
    await flush();

    expect(el.shadowRoot!.querySelectorAll("li.event")).toHaveLength(2);
    expect(el.shadowRoot!.textContent).toContain("Future Event");
    expect(el.shadowRoot!.textContent).toContain("Past Event");
  });

  it('hides past events when show-past="false"', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/feed.json");
    el.setAttribute("show-past", "false");
    document.body.append(el);
    await flush();
    expect(el.shadowRoot!.querySelectorAll("li.event")).toHaveLength(1);
    expect(el.shadowRoot!.textContent).not.toContain("Past Event");
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

  it("shows the empty-state message when every event is filtered out by show-past", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({ events: [{ name: "Past only", startDate: "2000-01-01" }] }),
    });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/feed.json");
    el.setAttribute("show-past", "false");
    document.body.append(el);
    await flush();
    expect(el.shadowRoot!.textContent).toMatch(/No upcoming events/);
  });

  it("re-renders on a limit change without re-fetching", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/feed.json");
    document.body.append(el);
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    el.setAttribute("limit", "1");
    expect(el.shadowRoot!.querySelectorAll("li.event")).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("re-fetches when the feed attribute itself changes", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/a.json");
    document.body.append(el);
    await flush();
    el.setAttribute("feed", "https://example.org/b.json");
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith("https://example.org/b.json");
  });

  it("renders an in-memory OTE feed object without fetching", async () => {
    const el = createListElement();
    el.feedData = {
      title: "Filtered events",
      events: [{ name: "Runtime Event", startDate: "2999-01-01" }],
    };
    document.body.append(el);
    await flush();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(el.shadowRoot!.querySelectorAll("li.event")).toHaveLength(1);
    expect(el.shadowRoot!.textContent).toContain("Runtime Event");
  });

  it("renders an in-memory OTE event array and re-renders when it is replaced", async () => {
    const el = createListElement();
    document.body.append(el);
    await flush();

    el.events = [{ name: "First Runtime Event", startDate: "2999-01-01" }];
    expect(el.shadowRoot!.textContent).toContain("First Runtime Event");

    el.events = [{ name: "Second Runtime Event", startDate: "2999-01-02" }];
    expect(el.shadowRoot!.textContent).not.toContain("First Runtime Event");
    expect(el.shadowRoot!.textContent).toContain("Second Runtime Event");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("renders a single in-memory OTE event", async () => {
    const el = createListElement();
    el.event = { name: "Single Runtime Event", startDate: "2999-01-01" };
    document.body.append(el);
    await flush();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(el.shadowRoot!.querySelectorAll("li.event")).toHaveLength(1);
    expect(el.shadowRoot!.textContent).toContain("Single Runtime Event");
  });

  it("lets in-memory feedData win over the feed attribute", async () => {
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/feed.json");
    el.feedData = {
      events: [{ name: "Runtime Winner", startDate: "2999-01-01" }],
    };
    document.body.append(el);
    await flush();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(el.shadowRoot!.textContent).toContain("Runtime Winner");
  });

  it("falls back to the feed attribute again when feedData is cleared", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/feed.json");
    el.feedData = {
      events: [{ name: "Runtime Event", startDate: "2999-01-01" }],
    };
    document.body.append(el);
    await flush();

    el.feedData = undefined;
    await flush();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(el.shadowRoot!.textContent).toContain("Future Event");
    expect(el.shadowRoot!.textContent).not.toContain("Runtime Event");
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
        updatedAt: "2999-01-02T10:00:00Z",
      },
    ],
  });

  it("shows the default fields (image/when/location/attendance/description) but not price/tags/organizer", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    document.body.append(el);
    await flush();

    const root = el.shadowRoot!;
    expect(root.querySelector("img.event-image")).toBeTruthy();
    expect(root.querySelector(".badge")?.textContent).toBe("Online");
    expect(root.querySelector(".badge svg.badge-icon")?.getAttribute("aria-hidden")).toBe("true");
    expect(root.querySelector(".event-when")?.nextElementSibling?.className).toBe("event-meta");
    expect(root.querySelector(".event-meta .event-badges")).toBeTruthy();
    expect(root.querySelector(".event-meta .event-location")).toBeTruthy();
    expect(root.querySelector(".event-description")).toBeTruthy();
    expect(root.querySelector(".price")).toBeNull();
    expect(root.querySelector(".tags")).toBeNull();
    expect(root.querySelector(".event-organizer")).toBeNull();
  });

  it("adds icons to every attendance badge mode", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            { name: "Online", startDate: "2999-01-01", attendanceMode: "online" },
            { name: "In Person", startDate: "2999-01-02", attendanceMode: "in-person" },
            { name: "Hybrid", startDate: "2999-01-03", attendanceMode: "hybrid" },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/modes.json");
    document.body.append(el);
    await flush();

    const badges = [...el.shadowRoot!.querySelectorAll(".attendance-badge")];
    expect(badges.map((badge) => badge.textContent)).toEqual(["Online", "In person", "Hybrid"]);
    expect(el.shadowRoot!.querySelector(".attendance-online svg.badge-icon")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".attendance-in-person svg.badge-icon")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".attendance-hybrid svg.badge-icon")).toBeTruthy();
  });

  it('fields="price,tags" shows only those, replacing the default set entirely', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createCardsElement();
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
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.setAttribute("fields", "organizer");
    document.body.append(el);
    await flush();
    expect(el.shadowRoot!.querySelector(".event-organizer")?.textContent).toBe("Fixture Org");
  });

  it("shows a friendly online location label instead of the raw URL", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Online Event",
              startDate: "2999-01-01",
              location: { onlineUrl: "https://meet.google.com/abc-defg-hij" },
            },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/online.json");
    document.body.append(el);
    await flush();

    const location = el.shadowRoot!.querySelector<HTMLAnchorElement>(".event-location a");
    expect(location?.textContent).toBe("Google Meet");
    expect(location?.href).toBe("https://meet.google.com/abc-defg-hij");
    expect(el.shadowRoot!.textContent).not.toContain("meet.google.com/abc-defg-hij");
  });

  it("translates the generic online location label", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Evento online",
              startDate: "2999-01-01",
              location: { onlineUrl: "https://example.org/sala" },
            },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/online.json");
    el.setAttribute("lang", "es");
    document.body.append(el);
    await flush();

    const location = el.shadowRoot!.querySelector<HTMLAnchorElement>(".event-location a");
    expect(location?.textContent).toBe("Evento en línea");
    expect(location?.href).toBe("https://example.org/sala");
    expect(el.shadowRoot!.textContent).not.toContain("Online link");
  });

  it("defensively hides raw URL locations in cards", () => {
    const container = document.createElement("div");
    renderWidget(container, rawLocationState("cards"));

    const location = container.querySelector<HTMLAnchorElement>(".event-location a");
    expect(location?.textContent).toBe("Jitsi Meet");
    expect(location?.href).toBe("https://meet.jit.si/ParliamentaryCommunicationsAspireSomehow");
    expect(container.textContent).not.toContain("meet.jit.si/ParliamentaryCommunicationsAspireSomehow");
  });

  it("shows a friendly online location label in the list details", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Online Event",
              startDate: "2999-01-01",
              location: { onlineUrl: "https://meet.google.com/abc-defg-hij" },
            },
          ],
        }),
    });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/online.json");
    document.body.append(el);
    await flush();

    const location = el.shadowRoot!.querySelector<HTMLAnchorElement>(
      ".event-detail-list dd a",
    );
    expect(location?.textContent).toBe("Google Meet");
    expect(location?.href).toBe("https://meet.google.com/abc-defg-hij");
    expect(el.shadowRoot!.textContent).not.toContain("meet.google.com/abc-defg-hij");
  });

  it("defensively hides raw URL locations in list details", () => {
    const container = document.createElement("div");
    renderWidget(container, rawLocationState("list"));

    const location = container.querySelector<HTMLAnchorElement>(".event-detail-list dd a");
    expect(location?.textContent).toBe("Jitsi Meet");
    expect(location?.href).toBe("https://meet.jit.si/ParliamentaryCommunicationsAspireSomehow");
    expect(container.textContent).not.toContain("meet.jit.si/ParliamentaryCommunicationsAspireSomehow");
  });

  it("renders the list layout as table-like accordions with readable metadata", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    document.body.append(el);
    await flush();

    const root = el.shadowRoot!;
    expect(root.querySelector(".event-list-header")?.textContent).toContain("Event");
    expect(root.querySelector(".event-list-header")?.textContent).toContain("When");
    expect(root.querySelector(".event-header-icon")?.getAttribute("aria-label")).toBe(
      "Last update",
    );
    expect(root.querySelector("details.event-accordion")).toBeTruthy();
    expect(root.querySelector(".event-summary-title")?.textContent).toBe("Rich Event");
    expect(root.querySelector(".event-summary-updated")?.textContent).toMatch(/\d+[ymwdh]|now/);
    expect(root.querySelector(".event-detail-list")?.textContent).toContain("Updated");
    expect(root.querySelector(".event-detail-list")?.textContent).not.toContain("ID");
    expect(root.querySelector(".event-detail-list")?.textContent).not.toContain("Source");
    expect(root.querySelector(".event-detail-list")?.textContent).not.toContain(
      "https://example.org/poster.jpg",
    );
  });

  it("renders event images inside the expanded list layout details", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    document.body.append(el);
    await flush();

    const img = el.shadowRoot!.querySelector<HTMLImageElement>(".event-details img.event-image");
    expect(img).toBeTruthy();
    expect(img?.src).toBe("https://example.org/poster.jpg");
  });

  it("compacts same-day event ranges in the list summary", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Same-day Event",
              startDate: "2999-07-31T10:00",
              endDate: "2999-07-31T11:00",
            },
          ],
        }),
    });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/feed.json");
    document.body.append(el);
    await flush();

    const when = el.shadowRoot!.querySelector(".event-summary-when")?.textContent ?? "";
    expect(when).toContain("Jul 31");
    expect((when.match(/Jul 31/g) ?? [])).toHaveLength(1);
    expect(when).toContain("10:00");
    expect(when).toContain("11:00");
  });

  it("compacts card dates and keeps the timezone in a subtle tooltip", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Same-day Card Event",
              startDate: "2999-07-31T10:00",
              endDate: "2999-07-31T11:00",
              timezone: "Europe/Madrid",
            },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/feed.json");
    document.body.append(el);
    await flush();

    const when = el.shadowRoot!.querySelector<HTMLElement>(".event-when");
    expect(when?.textContent).toContain("Jul 31");
    expect((when?.textContent?.match(/Jul 31/g) ?? [])).toHaveLength(1);
    expect(when?.textContent).toContain("10:00");
    expect(when?.textContent).toContain("11:00");
    expect(when?.textContent).not.toContain("Europe/Madrid");
    expect(when?.title).toContain("Europe/Madrid");
    expect(when?.tabIndex).toBe(0);
  });

  it("falls back to a card placeholder when an event image is broken", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/rich.json");
    el.setAttribute("layout", "cards");
    document.body.append(el);
    await flush();

    const img = el.shadowRoot!.querySelector("img.event-image")!;
    expect(img).toBeTruthy();
    img.dispatchEvent(new Event("error"));

    const placeholder = el.shadowRoot!.querySelector(".event-image-placeholder");
    expect(placeholder).toBeTruthy();
    expect(placeholder?.tagName).toBe("DIV");
  });

  it("shows a CSS image placeholder in cards layout when an event has no image", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/feed.json");
    el.setAttribute("layout", "cards");
    document.body.append(el);
    await flush();

    const placeholder = el.shadowRoot!.querySelector(".event-image-placeholder");
    expect(placeholder).toBeTruthy();
    expect(placeholder?.tagName).toBe("DIV");
  });

  it("does not show missing-image placeholders in list layout", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/feed.json");
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".event-image-placeholder")).toBeNull();
  });

  it("uses the configured placeholder image in cards layout", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/feed.json");
    el.setAttribute("layout", "cards");
    el.setAttribute("placeholder-image", "https://example.org/placeholder.jpg");
    document.body.append(el);
    await flush();

    const placeholder = el.shadowRoot!.querySelector<HTMLImageElement>(
      "img.event-image-placeholder",
    );
    expect(placeholder).toBeTruthy();
    expect(placeholder?.src).toBe("https://example.org/placeholder.jpg");
  });

  it("defaults to the calendar layout once loaded", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = document.createElement("ote-events");
    el.setAttribute("feed", "https://example.org/feed.json");
    document.body.append(el);
    await flush();
    expect(el.shadowRoot!.querySelector(".calendar-host")).toBeTruthy();
    expect(el.shadowRoot!.querySelector("ul.events")).toBeNull();
  });
});
