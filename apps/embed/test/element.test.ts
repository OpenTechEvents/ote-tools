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
    sort: "auto",
    layout,
    fields: new Set(["location"]),
    eventClick: "modal",
    eventActions: ["google-calendar", "outlook-calendar", "yahoo-calendar", "ics", "link"],
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
    expect(root.querySelector(".event-details-content")).toBeTruthy();
    expect(root.querySelector(".event-details-main .event-description")).toBeTruthy();
    expect(root.querySelector(".event-details-aside .event-detail-list")).toBeTruthy();
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

  it("shows the full description in expanded list details", async () => {
    const longDescription = `This expanded description should stay complete. ${"Details ".repeat(80)}Final sentence.`;
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [{ name: "Long Description", startDate: "2999-01-01", description: longDescription }],
        }),
    });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/long.json");
    document.body.append(el);
    await flush();

    const description = el.shadowRoot!.querySelector(".event-details-main .event-description");
    expect(description?.textContent).toContain("Final sentence.");
    expect(description?.textContent).not.toContain("...");
  });

  it("keeps long unspaced strings in expanded list descriptions", async () => {
    const longUrl =
      "https://meet.jit.si/ParliamentaryCommunicationsAspireSomehowWithAVeryLongRoomName";
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Long URL",
              startDate: "2999-01-01",
              description: `Join here: ${longUrl}`,
            },
          ],
        }),
    });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/long-url.json");
    document.body.append(el);
    await flush();

    const description = el.shadowRoot!.querySelector(".event-details-main .event-description");
    expect(description?.textContent).toContain(longUrl);
  });

  it("uses a compact expanded list layout for short text-only events", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Short List Event",
              startDate: "2999-09-17T18:30",
              description: "Short practical meetup.",
            },
          ],
        }),
    });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/short-list.json");
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".event-details-compact")).toBeTruthy();
  });

  it("keeps the roomy expanded list layout when an event has an image", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".event-details-compact")).toBeNull();
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

  it("opens a detail modal from the cards layout by default", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    document.body.append(el);
    await flush();

    const opened = vi.fn();
    el.addEventListener("ote-event-open", opened);
    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();

    const modal = el.shadowRoot!.querySelector<HTMLElement>(".event-modal");
    expect(opened).toHaveBeenCalledTimes(1);
    expect(modal).toBeTruthy();
    expect(modal?.querySelector(".event-modal-content")).toBeTruthy();
    expect(modal?.querySelector(".event-modal-main .event-description")).toBeTruthy();
    expect(modal?.querySelector(".event-modal-aside .event-detail-list")).toBeTruthy();
    expect(modal?.textContent).toContain("Rich Event");
    expect(modal?.querySelectorAll(".event-action-menu")).toHaveLength(1);
    expect(modal?.querySelector(".event-action-menu-trigger")?.textContent).toContain(
      "Add to calendar",
    );
    expect(modal?.querySelector(".event-action-menu-trigger .action-icon")).toBeTruthy();
    expect(modal?.textContent).toContain("Add to Google Calendar");
    expect(modal?.textContent).toContain("Add to Outlook");
    expect(modal?.textContent).toContain("Add to Yahoo");
    expect(modal?.textContent).toContain("Download ICS");
    expect(modal?.textContent).toContain("Open event page");
    expect(modal?.querySelector('a[href="https://example.org/rich"] .action-icon')).toBeTruthy();
    const modalDetails = modal!.querySelector(".event-detail-list")!;
    const modalActions = modal!.querySelector(".event-actions")!;
    expect(
      modalDetails.compareDocumentPosition(modalActions) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    const google = modal?.querySelector<HTMLAnchorElement>('a[href^="https://calendar.google.com"]');
    expect(google?.href).toContain("Rich+Event");
    expect(google?.href).toContain("action=TEMPLATE");

    el.shadowRoot!.querySelector<HTMLButtonElement>(".event-modal-close")?.click();
    expect(el.shadowRoot!.querySelector(".event-modal")).toBeNull();
  });

  it("uses compact friendly dates in the detail modal", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Same-day Modal Event",
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

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();

    const when = el.shadowRoot!.querySelector<HTMLElement>(".event-modal .event-detail-when");
    expect(when?.textContent).toContain("Jul 31");
    expect((when?.textContent?.match(/Jul 31/g) ?? [])).toHaveLength(1);
    expect(when?.textContent).toContain("10:00");
    expect(when?.textContent).toContain("11:00");
    expect(when?.textContent).not.toContain("Europe/Madrid");
    expect(when?.title).toContain("Europe/Madrid");
  });

  it("uses a compact modal layout for short text-only events", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Short Event",
              startDate: "2999-09-17T18:30",
              description: "Short practical meetup.",
            },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/short.json");
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();

    expect(el.shadowRoot!.querySelector(".event-modal-compact")).toBeTruthy();
  });

  it("keeps the roomy modal layout when an event has an image", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();

    expect(el.shadowRoot!.querySelector(".event-modal-compact")).toBeNull();
  });

  it('uses event-click="link" to keep the external-link card behavior', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const open = vi.fn();
    vi.stubGlobal("open", open);
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.setAttribute("event-click", "link");
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();
    expect(open).toHaveBeenCalledWith("https://example.org/rich", "_blank", "noopener");
    expect(el.shadowRoot!.querySelector(".event-modal")).toBeNull();
  });

  it("renders custom event actions from the JavaScript API", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const onClick = vi.fn();
    const actionEvent = vi.fn();
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.setAttribute("event-actions", "none");
    el.eventActions = [{ id: "favorite", label: "Save favorite", onClick }];
    el.addEventListener("ote-event-action", actionEvent);
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();
    el.shadowRoot!.querySelector<HTMLButtonElement>(".event-actions button")?.click();

    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Rich Event" }),
      expect.objectContaining({ previewEvent: expect.objectContaining({ name: "Rich Event" }) }),
    );
    expect(actionEvent).toHaveBeenCalledTimes(1);
    expect(actionEvent.mock.calls[0]?.[0].detail.action).toBe("favorite");
  });

  it("renders custom preview actions in cards without showing detail-only actions", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const edit = vi.fn();
    const remove = vi.fn();
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.eventActions = [
      { id: "edit", label: "Edit", icon: "edit", placement: "preview", onClick: edit },
      {
        id: "delete",
        label: "Delete",
        icon: "trash",
        variant: "danger",
        placement: "detail",
        onClick: remove,
      },
    ];
    document.body.append(el);
    await flush();

    const previewActions = el.shadowRoot!.querySelector(".event-preview-actions");
    expect(previewActions?.textContent).toContain("Edit");
    expect(previewActions?.textContent).not.toContain("Delete");
    expect(previewActions?.querySelector(".action-icon")).toBeTruthy();
    expect(previewActions?.querySelector(".event-action-danger")).toBeNull();

    previewActions?.querySelector<HTMLButtonElement>("button")?.click();
    expect(edit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Rich Event" }),
      expect.objectContaining({ previewEvent: expect.objectContaining({ name: "Rich Event" }) }),
    );
  });

  it("renders both-placement custom actions in preview and detail", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const clone = vi.fn();
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.eventActions = [{ id: "clone", label: "Clone", icon: "copy", placement: "both", onClick: clone }];
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".event-preview-actions")?.textContent).toContain("Clone");
    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();

    const modalActions = el.shadowRoot!.querySelector(".event-modal > .event-actions");
    expect(modalActions?.textContent).toContain("Clone");
  });

  it("renders configured native actions in preview and detail placements", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const actionEvent = vi.fn();
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.setAttribute("event-actions", "none");
    el.eventActions = [
      { type: "link", placement: "preview" },
      { type: "google-calendar", placement: "both" },
    ];
    el.addEventListener("ote-event-action", actionEvent);
    document.body.append(el);
    await flush();

    const previewActions = el.shadowRoot!.querySelector(".event-preview-actions");
    expect(previewActions?.textContent).toContain("Open event page");
    expect(previewActions?.textContent).toContain("Add to calendar");
    expect(previewActions?.querySelector('a[href="https://example.org/rich"] .action-icon')).toBeTruthy();

    previewActions?.querySelector<HTMLAnchorElement>('a[href="https://example.org/rich"]')?.click();
    expect(actionEvent.mock.calls.at(-1)?.[0].detail.action).toBe("link");

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();

    const modalActions = el.shadowRoot!.querySelector(".event-modal > .event-actions");
    expect(modalActions?.textContent).toContain("Add to calendar");
    expect(modalActions?.textContent).not.toContain("Open event page");
  });

  it("honors custom action layout filters", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const edit = vi.fn();
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.eventActions = [
      { id: "edit", label: "Edit", placement: "preview", layouts: ["list"], onClick: edit },
    ];
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".event-preview-actions")).toBeNull();
  });

  it("places list detail actions after the event details", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    document.body.append(el);
    await flush();

    const details = el.shadowRoot!.querySelector(".event-detail-list");
    const actions = el.shadowRoot!.querySelector(".event-actions");
    expect(
      details!.compareDocumentPosition(actions!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("renders Markdown descriptions safely inside the detail modal", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Markdown Event",
              startDate: "2999-01-01",
              description:
                "**Bring questions** about `web components`.\n\n- First item\n- [Project site](https://example.org)",
            },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/markdown.json");
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();
    const description = el.shadowRoot!.querySelector(".event-modal .event-description");

    expect(description?.querySelector("strong")?.textContent).toBe("Bring questions");
    expect(description?.querySelector("code")?.textContent).toBe("web components");
    expect(description?.querySelectorAll("li")).toHaveLength(2);
    expect(description?.querySelector<HTMLAnchorElement>("a")?.href).toBe("https://example.org/");
    expect(description?.textContent).not.toContain("**");
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

  it("supports Reader-style in-memory events without fetching or reordering", async () => {
    const first = {
      id: "event-later",
      name: "Later but first",
      startDate: "2999-02-01",
      _feedUrl: "https://reader.example/feed-a.json",
      _feedTitle: "Feed A",
      _readerRef: "read",
      source: { origin: "reader" },
    };
    const second = {
      id: "event-earlier",
      name: "Earlier but second",
      startDate: "2999-01-01",
      _feedUrl: "https://reader.example/feed-b.json",
      _feedTitle: "Feed B",
      _readerRef: "unread",
    };
    const saved = new Set(["event-later"]);
    const onSave = vi.fn();
    const actionEvent = vi.fn();
    const el = createCardsElement();
    el.setAttribute("sort", "none");
    el.setAttribute("event-actions", "none");
    el.events = [first, second];
    el.eventActions = (context) => [
      {
        id: "save",
        label: saved.has(String(context.originalEvent?.id)) ? "Saved" : "Save",
        icon: saved.has(String(context.originalEvent?.id)) ? "bookmark" : "star",
        pressed: saved.has(String(context.originalEvent?.id)),
        placement: "preview",
        onClick: onSave,
      },
    ];
    el.eventClassName = (context) => `reader-${String(context.originalEvent?._readerRef)}`;
    el.eventBadges = (context) => [{ label: context.feed?.title ?? "Feed", icon: "folder" }];
    el.addEventListener("ote-event-action", actionEvent);
    document.body.append(el);
    await flush();

    const cards = [...el.shadowRoot!.querySelectorAll(".layout-cards > li.event")];
    expect(fetchMock).not.toHaveBeenCalled();
    expect(cards.map((card) => card.querySelector(".event-title")?.textContent)).toEqual([
      "Later but first",
      "Earlier but second",
    ]);
    expect(cards[0]?.classList.contains("reader-read")).toBe(true);
    expect(cards[1]?.classList.contains("reader-unread")).toBe(true);
    expect(cards[0]?.querySelector(".event-custom-badge")?.textContent).toBe("Feed A");
    expect(cards[0]?.querySelector<HTMLButtonElement>(".event-preview-actions button")?.getAttribute("aria-pressed")).toBe("true");

    cards[0]?.querySelector<HTMLButtonElement>(".event-preview-actions button")?.click();

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Later but first" }),
      expect.objectContaining({
        originalEvent: first,
        index: 0,
        feed: { url: "https://reader.example/feed-a.json", title: "Feed A" },
        source: { origin: "reader" },
      }),
    );
    expect(actionEvent.mock.calls[0]?.[0].detail).toEqual(
      expect.objectContaining({
        action: "save",
        previewEvent: expect.objectContaining({ name: "Later but first" }),
        originalEvent: first,
        index: 0,
        feed: { url: "https://reader.example/feed-a.json", title: "Feed A" },
        source: { origin: "reader" },
      }),
    );
  });

  it("re-resolves function eventActions when host state changes", async () => {
    const saved = new Set<string>();
    const el = createCardsElement();
    el.setAttribute("event-actions", "none");
    el.events = [{ id: "runtime", name: "Runtime", startDate: "2999-01-01" }];
    const actions = () => [
      {
        id: "bookmark",
        label: saved.has("runtime") ? "Saved" : "Save",
        icon: "bookmark" as const,
        placement: "preview" as const,
        pressed: saved.has("runtime"),
        onClick: vi.fn(),
      },
    ];
    el.eventActions = actions;
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".event-preview-actions")?.textContent).toContain("Save");

    saved.add("runtime");
    el.eventActions = actions;

    expect(el.shadowRoot!.querySelector(".event-preview-actions")?.textContent).toContain("Saved");
    expect(el.shadowRoot!.querySelector(".event-preview-actions button")?.getAttribute("aria-pressed")).toBe("true");
  });

  it("renders the added custom action icons", async () => {
    const el = createCardsElement();
    el.setAttribute("event-actions", "none");
    el.events = [{ name: "Icon Event", startDate: "2999-01-01" }];
    el.eventActions = ["star", "check", "bookmark", "plus", "folder", "collection"].map((icon) => ({
      id: icon,
      label: icon,
      icon: icon as "star" | "check" | "bookmark" | "plus" | "folder" | "collection",
      placement: "preview",
      onClick: vi.fn(),
    }));
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelectorAll(".event-preview-actions .action-icon")).toHaveLength(6);
  });

  it("uses a custom empty message", async () => {
    const el = createListElement();
    el.setAttribute("show-past", "false");
    el.setAttribute("empty-message", "No events match these filters.");
    el.events = [{ name: "Past", startDate: "2000-01-01" }];
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".message")?.textContent).toBe("No events match these filters.");
  });

  it("lets the host change layout around the same in-memory events without refetching", async () => {
    const el = createListElement();
    el.events = [{ name: "Layout Runtime", startDate: "2999-01-01" }];
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".layout-list")).toBeTruthy();
    el.setAttribute("layout", "cards");

    expect(el.shadowRoot!.querySelector(".layout-cards")).toBeTruthy();
    expect(el.shadowRoot!.textContent).toContain("Layout Runtime");
    expect(fetchMock).not.toHaveBeenCalled();
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
