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
    previewFields: new Set(["location"]),
    detailFields: new Set(["location"]),
    groupEvents: new Set(),
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

  it("dims past events with an event-past class, but not upcoming ones", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/feed.json");
    document.body.append(el);
    await flush();

    const items = [...el.shadowRoot!.querySelectorAll("li.event")];
    const past = items.find((item) => item.textContent?.includes("Past Event"));
    const future = items.find((item) => item.textContent?.includes("Future Event"));
    expect(past?.classList.contains("event-past")).toBe(true);
    expect(future?.classList.contains("event-past")).toBe(false);
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

  it("feeds attribute fetches multiple feed URLs in parallel and renders their events combined", async () => {
    fetchMock.mockImplementation(async (url: string) => ({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [{ name: url.includes("/a.json") ? "Event A" : "Event B", startDate: "2999-01-01" }],
        }),
    }));
    const el = createListElement();
    el.setAttribute("feeds", "https://a.org/a.json, https://b.org/b.json");
    document.body.append(el);
    await flush();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(el.shadowRoot!.querySelectorAll("li.event")).toHaveLength(2);
    expect(el.shadowRoot!.textContent).toContain("Event A");
    expect(el.shadowRoot!.textContent).toContain("Event B");
  });

  it("the feeds attribute takes full precedence over feed when both are set", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://ignored.org/feed.json");
    el.setAttribute("feeds", "https://a.org/feed.json");
    document.body.append(el);
    await flush();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("https://a.org/feed.json");
  });

  it("falls back to the feed attribute when feeds is absent, empty, or only commas", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/feed.json");
    el.setAttribute("feeds", " , ");
    document.body.append(el);
    await flush();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("https://example.org/feed.json");
  });

  it("drops a feed that fails to fetch and still renders the events from the ones that succeed", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url === "https://down.org/feed.json") return { ok: false, status: 500, text: async () => "" };
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ events: [{ name: "Event OK", startDate: "2999-01-01" }] }),
      };
    });
    const el = createListElement();
    el.setAttribute("feeds", "https://down.org/feed.json,https://up.org/feed.json");
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".message.error")).toBeFalsy();
    expect(el.shadowRoot!.querySelectorAll("li.event")).toHaveLength(1);
    expect(el.shadowRoot!.textContent).toContain("Event OK");
  });

  it("shows the error state only when every feed in feeds fails", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503, text: async () => "" });
    const el = document.createElement("ote-events");
    el.setAttribute("feeds", "https://a.org/feed.json,https://b.org/feed.json");
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".message.error")).toBeTruthy();
    expect(el.shadowRoot!.textContent).toContain("503");
  });

  it("re-fetches all of them when the feeds attribute itself changes", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = createListElement();
    el.setAttribute("feeds", "https://example.org/a.json");
    document.body.append(el);
    await flush();
    el.setAttribute("feeds", "https://example.org/b.json,https://example.org/c.json");
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("tags each merged event with its originating feed, visible via originalEvent._feedUrl and the feed render context", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      const isA = url === "https://a.org/feed.json";
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            title: isA ? "Feed A" : "Feed B",
            events: [{ name: isA ? "Event A" : "Event B", startDate: "2999-01-01" }],
          }),
      };
    });
    const el = createCardsElement();
    el.setAttribute("feeds", "https://a.org/feed.json,https://b.org/feed.json");
    const opened = vi.fn();
    el.addEventListener("ote-event-open", opened);
    document.body.append(el);
    await flush();

    const cardA = [...el.shadowRoot!.querySelectorAll<HTMLElement>("li.event")].find((card) =>
      card.textContent?.includes("Event A"),
    );
    cardA?.click();

    expect(opened).toHaveBeenCalledTimes(1);
    const detail = (opened.mock.calls[0]?.[0] as CustomEvent).detail as Record<string, unknown>;
    expect((detail.originalEvent as Record<string, unknown>)?._feedUrl).toBe("https://a.org/feed.json");
    expect(detail.feed).toEqual({ url: "https://a.org/feed.json", title: "Feed A" });
  });

  const RICH_FEED = JSON.stringify({
    events: [
      {
        name: "Rich Event",
        startDate: "2999-01-01",
        url: "https://example.org/rich",
        image: [{ url: "https://example.org/poster.jpg", alt: "Poster" }],
        offers: [{ price: 20, currency: "EUR", url: "https://example.org/tickets" }],
        organizers: [{ name: "Fixture Org" }],
        tags: ["one", "two"],
        attendanceMode: "online",
        description: "A rich event with every optional field populated.",
        updatedAt: "2999-01-02T10:00:00Z",
        eligibility: {
          type: "members-only",
          note: "Discord members only",
          url: "https://example.org/join",
        },
        cfp: { url: "https://example.org/cfp", closesAt: "2026-07-15T23:59:59+02:00" },
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

  it("by default, the detail modal shows every field including eligibility/cfp/a ticket link, unlike the card", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    document.body.append(el);
    await flush();

    const root = el.shadowRoot!;
    // Card (preview) stays at DEFAULT_FIELDS: no price/tags/organizer/eligibility/cfp.
    expect(root.querySelector("li.event .price")).toBeNull();
    expect(root.querySelector("li.event .eligibility-badge")).toBeNull();
    expect(root.querySelector("li.event .cfp-badge")).toBeNull();

    root.querySelector<HTMLElement>("li.event")?.click();
    const modal = root.querySelector(".event-modal");
    expect(modal).toBeTruthy();
    expect(modal!.querySelector<HTMLAnchorElement>(".price")?.href).toBe("https://example.org/tickets");
    expect(modal!.querySelector(".price")?.textContent).toContain("20");
    const eligibility = modal!.querySelector<HTMLAnchorElement>(".eligibility-badge");
    expect(eligibility?.textContent).toBe("Members only");
    expect(eligibility?.href).toBe("https://example.org/join");
    const cfp = modal!.querySelector<HTMLAnchorElement>(".cfp-badge");
    expect(cfp?.textContent).toBe("Call for Proposals");
    expect(cfp?.href).toBe("https://example.org/cfp");
    expect(modal!.textContent).toContain("Fixture Org");
    expect(modal!.querySelectorAll(".tags .tag")).toHaveLength(2);
  });

  it("fields-preview and fields-detail configure the card and modal independently", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.setAttribute("fields-preview", "price,eligibility");
    el.setAttribute("fields-detail", "organizer,cfp");
    document.body.append(el);
    await flush();

    const root = el.shadowRoot!;
    expect(root.querySelector("li.event .price")).toBeTruthy();
    expect(root.querySelector("li.event .eligibility-badge")).toBeTruthy();
    expect(root.querySelector("li.event .cfp-badge")).toBeNull();
    expect(root.querySelector("li.event .event-description")).toBeNull();

    root.querySelector<HTMLElement>("li.event")?.click();
    const modal = root.querySelector(".event-modal");
    expect(modal!.querySelector(".cfp-badge")).toBeTruthy();
    expect(modal!.querySelector(".price")).toBeNull();
    expect(modal!.querySelector(".eligibility-badge")).toBeNull();
    expect(modal!.querySelector(".event-description")).toBeNull();
  });

  it('the legacy "fields" attribute now also narrows the detail modal (it used to render every field unconditionally)', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.setAttribute("fields", "price,tags");
    document.body.append(el);
    await flush();

    const root = el.shadowRoot!;
    root.querySelector<HTMLElement>("li.event")?.click();
    const modal = root.querySelector(".event-modal");
    expect(modal!.querySelector(".price")).toBeTruthy();
    expect(modal!.querySelectorAll(".tags .tag")).toHaveLength(2);
    expect(modal!.querySelector(".event-description")).toBeNull();
    expect(modal!.querySelector(".eligibility-badge")).toBeNull();
    expect(modal!.querySelector(".cfp-badge")).toBeNull();
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

  it("doesn't echo the attendance badge's 'Online' label when an online event has no link", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            { name: "Online, link shared privately", startDate: "2999-01-01", attendanceMode: "online" },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/online-no-link.json");
    document.body.append(el);
    await flush();

    const badge = el.shadowRoot!.querySelector(".attendance-online");
    const location = el.shadowRoot!.querySelector<HTMLElement>(".event-location span");
    expect(badge?.textContent).toContain("Online");
    expect(location?.textContent).toBe("No public link");
    expect(location?.title).toBe("The organizer may share the link privately, e.g. after registration.");
  });

  it("doesn't claim an in-person event with no venue is online", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            { name: "In person, venue TBA", startDate: "2999-01-01", attendanceMode: "in-person" },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/in-person-no-venue.json");
    document.body.append(el);
    await flush();

    const location = el.shadowRoot!.querySelector(".event-location");
    expect(location?.textContent).toBe("Venue not specified");
    expect(location?.textContent).not.toContain("Online");
  });

  it("doesn't claim an event with no attendanceMode declared is online", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [{ name: "Attendance unspecified", startDate: "2999-01-01" }],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/no-attendance-mode.json");
    document.body.append(el);
    await flush();

    const location = el.shadowRoot!.querySelector(".event-location");
    expect(location?.textContent).toBe("Venue not specified");
    expect(location?.textContent).not.toContain("Online");
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

  it("focuses the close button on open and closes the modal on Escape", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();
    const closeButton = el.shadowRoot!.querySelector<HTMLButtonElement>(".event-modal-close");
    expect(closeButton).toBeTruthy();

    // Focus is moved in a microtask (the element isn't in the DOM yet at the
    // point renderModal() builds it), so let pending microtasks flush.
    await Promise.resolve();
    expect(el.shadowRoot!.activeElement).toBe(closeButton);

    closeButton!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
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

  const GROUPED_SERIES = [
    {
      id: "e1",
      name: "Session One",
      startDate: "2999-01-10",
      partOf: { id: "https://fixture.example/series/monthly", type: "series" as const },
    },
    {
      id: "e2",
      name: "Session Two",
      startDate: "2999-02-10",
      partOf: { id: "https://fixture.example/series/monthly", type: "series" as const },
    },
    {
      id: "e3",
      name: "Session Three",
      startDate: "2999-03-10",
      partOf: { id: "https://fixture.example/series/monthly", type: "series" as const },
    },
  ];

  it("collapses events sharing partOf.id into a stacked card with a badge when group-events is set", async () => {
    const el = createCardsElement();
    el.setAttribute("group-events", "series");
    el.events = GROUPED_SERIES;
    document.body.append(el);
    await flush();

    const cards = [...el.shadowRoot!.querySelectorAll(".layout-cards > li.event")];
    expect(cards).toHaveLength(1);
    expect(cards[0]?.classList.contains("event-stacked")).toBe(true);
    expect(cards[0]?.querySelector(".event-title")?.textContent).toBe("Session One");

    const badge = cards[0]?.querySelector<HTMLElement>(".event-group-badge");
    expect(badge?.textContent).toBe("Series");
    expect(badge?.getAttribute("aria-label")).toContain("3");
  });

  it("renders every occurrence individually when group-events is absent (default no-op)", async () => {
    const el = createCardsElement();
    el.events = GROUPED_SERIES;
    document.body.append(el);
    await flush();

    const cards = [...el.shadowRoot!.querySelectorAll(".layout-cards > li.event")];
    expect(cards).toHaveLength(3);
    expect(cards.every((card) => !card.classList.contains("event-stacked"))).toBe(true);
    expect(el.shadowRoot!.querySelector(".event-group-badge")).toBeNull();
  });

  it("opens the modal on the header occurrence and navigates prev/next through the group", async () => {
    const el = createCardsElement();
    el.setAttribute("group-events", "series");
    el.events = GROUPED_SERIES;
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();

    let modal = el.shadowRoot!.querySelector<HTMLElement>(".event-modal");
    expect(modal?.querySelector(".event-modal-title")?.textContent).toBe("Session One");
    expect(modal?.querySelector(".event-modal-nav-counter")?.textContent).toBe("1 of 3");
    let navButtons = modal!.querySelectorAll<HTMLButtonElement>(".event-modal-nav-button");
    expect(navButtons[0]?.disabled).toBe(true);
    expect(navButtons[1]?.disabled).toBe(false);

    navButtons[1]?.click();
    modal = el.shadowRoot!.querySelector<HTMLElement>(".event-modal");
    expect(modal?.querySelector(".event-modal-title")?.textContent).toBe("Session Two");
    expect(modal?.querySelector(".event-modal-nav-counter")?.textContent).toBe("2 of 3");
    navButtons = modal!.querySelectorAll<HTMLButtonElement>(".event-modal-nav-button");
    expect(navButtons[0]?.disabled).toBe(false);
    expect(navButtons[1]?.disabled).toBe(false);

    navButtons[1]?.click();
    modal = el.shadowRoot!.querySelector<HTMLElement>(".event-modal");
    expect(modal?.querySelector(".event-modal-title")?.textContent).toBe("Session Three");
    expect(modal?.querySelector(".event-modal-nav-counter")?.textContent).toBe("3 of 3");
    navButtons = modal!.querySelectorAll<HTMLButtonElement>(".event-modal-nav-button");
    expect(navButtons[0]?.disabled).toBe(false);
    expect(navButtons[1]?.disabled).toBe(true);
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

  it("renders custom preview actions as a trailing cluster on list rows, separate from detail actions", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const save = vi.fn();
    const remove = vi.fn();
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.eventActions = [
      { id: "save", label: "Save", icon: "bookmark", placement: "preview", onClick: save },
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

    const row = el.shadowRoot!.querySelector("li.event-row")!;
    const rowActions = row.querySelector(".event-row-actions");
    expect(rowActions?.textContent).toContain("Save");
    expect(rowActions?.textContent).not.toContain("Delete");

    // Mounted as a sibling of the accordion, not nested inside <summary> —
    // a real click/keydown on a nested <a> inside <summary> is silently
    // swallowed by the browser (no navigation, no toggle), which would
    // break native link/calendar preview actions in this placement.
    expect(row.querySelector("summary")?.contains(rowActions)).toBe(false);
    expect(row.querySelector(".event-accordion")?.contains(rowActions)).toBe(false);

    const details = row.querySelector<HTMLDetailsElement>("details.event-accordion")!;
    rowActions?.querySelector<HTMLButtonElement>("button")?.click();

    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Rich Event" }),
      expect.objectContaining({ previewEvent: expect.objectContaining({ name: "Rich Event" }) }),
    );
    expect(details.open).toBe(false);
  });

  it("renders native link/calendar preview actions on list rows", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const actionEvent = vi.fn();
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.setAttribute("event-actions", "none");
    el.eventActions = [
      { type: "link", placement: "preview" },
      { type: "google-calendar", placement: "preview" },
    ];
    el.addEventListener("ote-event-action", actionEvent);
    document.body.append(el);
    await flush();

    const rowActions = el.shadowRoot!.querySelector(".event-row-actions");
    expect(rowActions?.textContent).toContain("Open event page");
    expect(rowActions?.textContent).toContain("Add to calendar");

    rowActions?.querySelector<HTMLAnchorElement>('a[href="https://example.org/rich"]')?.click();
    expect(actionEvent.mock.calls.at(-1)?.[0].detail.action).toBe("link");
  });

  it("honors custom action layout filters on list rows", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => RICH_FEED });
    const edit = vi.fn();
    const el = createListElement();
    el.setAttribute("feed", "https://example.org/rich.json");
    el.eventActions = [
      { id: "edit", label: "Edit", placement: "preview", layouts: ["cards"], onClick: edit },
    ];
    document.body.append(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".event-row-actions")).toBeNull();
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

  it("converts a link nested inside bold text, and renders numbered lists as <ol>", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Nested Markdown Event",
              startDate: "2999-01-01",
              description:
                "1. 📅 **Consultar o sincronizar [nuestro calendario](https://combuilderses.github.io/#events)** con tu aplicación favorita:\n2. Segundo paso",
            },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/nested-markdown.json");
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();
    const description = el.shadowRoot!.querySelector(".event-modal .event-description");

    const list = description?.querySelector("ol");
    expect(list).toBeTruthy();
    expect(list?.querySelectorAll("li")).toHaveLength(2);
    const link = list?.querySelector<HTMLAnchorElement>("strong a");
    expect(link?.href).toBe("https://combuilderses.github.io/#events");
    expect(link?.textContent).toBe("nuestro calendario");
    expect(description?.textContent).not.toContain("[nuestro calendario]");
  });

  it("renders a Markdown heading as a real heading element, not a stripped paragraph", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Heading Event",
              startDate: "2999-01-01",
              description: "### ¿Cómo puedo estar al tanto?\n\nTexto tras el encabezado.",
            },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/heading-markdown.json");
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();
    const description = el.shadowRoot!.querySelector(".event-modal .event-description");

    const heading = description?.querySelector("h3");
    expect(heading?.textContent).toBe("¿Cómo puedo estar al tanto?");
    expect(description?.textContent).not.toContain("###");
  });

  it("keeps a sub-list nested inside its parent <li> instead of flattening it to a sibling list", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Nested List Event",
              startDate: "2999-01-01",
              description:
                "1. Primer paso con opciones:\n\n   * Opción A\n   * Opción B\n2. Segundo paso",
            },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/nested-list-markdown.json");
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();
    const description = el.shadowRoot!.querySelector(".event-modal .event-description");

    const topList = description?.querySelector("ol");
    expect(topList?.children).toHaveLength(2);
    const nestedList = topList?.querySelector("li ul");
    expect(nestedList).toBeTruthy();
    expect(nestedList?.parentElement?.tagName).toBe("LI");
    expect(nestedList?.parentElement?.parentElement).toBe(topList);
    expect(nestedList?.querySelectorAll("li")).toHaveLength(2);
  });

  it("sanitizes script/event-handler payloads out of Markdown descriptions and forces safe link attributes", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          events: [
            {
              name: "Malicious Markdown Event",
              startDate: "2999-01-01",
              description:
                '<script>window.__pwned = true;</script>\n\n<img src="x" onerror="window.__pwned = true">\n\n[Safe link](https://example.org)',
            },
          ],
        }),
    });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/malicious-markdown.json");
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLElement>("li.event")?.click();
    const description = el.shadowRoot!.querySelector(".event-modal .event-description");

    expect(description?.querySelector("script")).toBeNull();
    expect(description?.innerHTML).not.toContain("onerror");
    expect((window as unknown as { __pwned?: boolean }).__pwned).toBeUndefined();
    const link = description?.querySelector<HTMLAnchorElement>("a");
    expect(link?.target).toBe("_blank");
    expect(link?.rel).toBe("noopener");
  });

  it('"card-width" resolves to --ote-card-min-width on the host element, defaulting to 220px', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => SAMPLE_FEED });
    const el = createCardsElement();
    el.setAttribute("feed", "https://example.org/sample.json");
    document.body.append(el);
    await flush();
    expect(el.style.getPropertyValue("--ote-card-min-width")).toBe("220px");

    el.setAttribute("card-width", "small");
    await flush();
    expect(el.style.getPropertyValue("--ote-card-min-width")).toBe("160px");

    el.setAttribute("card-width", "340px");
    await flush();
    expect(el.style.getPropertyValue("--ote-card-min-width")).toBe("340px");
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

  it("exposes group info on EventRenderContext and the ote-event-action DOM detail", async () => {
    const el = createCardsElement();
    el.setAttribute("group-events", "series");
    el.setAttribute("event-actions", "none");
    el.events = [
      {
        id: "e1",
        name: "Session One",
        startDate: "2999-01-10",
        partOf: { id: "https://fixture.example/series/monthly", type: "series" as const },
      },
      {
        id: "e2",
        name: "Session Two",
        startDate: "2999-02-10",
        partOf: { id: "https://fixture.example/series/monthly", type: "series" as const },
      },
    ];
    el.eventActions = (_context) => [
      {
        id: "noop",
        label: "Noop",
        placement: "preview",
        onClick: vi.fn(),
      },
    ];
    const actionEvent = vi.fn();
    el.addEventListener("ote-event-action", actionEvent);
    document.body.append(el);
    await flush();

    el.shadowRoot!.querySelector<HTMLButtonElement>(".event-preview-actions button")?.click();

    expect(actionEvent.mock.calls[0]?.[0].detail).toEqual(
      expect.objectContaining({
        group: expect.objectContaining({
          type: "series",
          index: 1,
          total: 2,
        }),
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
