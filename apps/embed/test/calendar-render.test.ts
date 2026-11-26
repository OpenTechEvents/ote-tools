// @vitest-environment jsdom
//
// The calendar layout had two tests and both inspected `calendarLocaleOptions`,
// a pure object: nothing mounted a calendar, so a bump of
// `@event-calendar/core` had no safety net at all and had to be cleared by
// looking at it (#162, HANDOFF.md trap 3).
//
// **What jsdom can and cannot see here, measured.** The library mounts and
// draws its month structure — 35 day cells, seven column headers, a toolbar
// with localized prev/next controls — but every text node comes out empty:
// day numbers render as a single space and `.ec-event` elements are never
// created, with or without a ResizeObserver and however long the test waits.
// So these tests assert the structure and the wiring, which is what a version
// bump is most likely to break (a library that stops mounting, renames its
// grid contract, or drops the toolbar). They are deliberately NOT a
// substitute for seeing an event drawn on the right day: that still needs a
// browser, and #162 tracks it.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { dayRowHeight, renderCalendar, type CalendarHandle } from "../src/calendar-layout.js";
import type { PreviewEvent } from "@opentechevents/preview-feed";

const timed: PreviewEvent = {
  id: "https://example.org/events/timed",
  name: "Rust Madrid meetup",
  startDate: "2026-08-12T19:00",
  endDate: "2026-08-12T21:00",
  timezone: "Europe/Madrid",
};
const allDay: PreviewEvent = {
  id: "https://example.org/events/all-day",
  name: "PyCamp",
  startDate: "2026-08-10",
  endDate: "2026-08-12",
};

let container: HTMLElement;
let handle: CalendarHandle | undefined;

// The calendar observes its container's size. jsdom has no ResizeObserver,
// and without one the library throws on mount — so this stub reports a size
// rather than doing nothing, and `resizeTo()` can re-report a new one: the
// narrow fallback follows the *container*, which jsdom never measures on its
// own (clientWidth is always 0 there).
const observers = new Set<{ callback: ResizeObserverCallback; target: Element; observer: ResizeObserver }>();

class StubResizeObserver implements ResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}
  observe(target: Element): void {
    observers.add({ callback: this.callback, target, observer: this });
    this.callback(entriesFor(target), this);
  }
  unobserve(): void {}
  disconnect(): void {
    for (const entry of observers) {
      if (entry.observer === this) observers.delete(entry);
    }
  }
}

let width = 800;

function entriesFor(target: Element): ResizeObserverEntry[] {
  return [{ target, contentRect: { width, height: 600 } } as unknown as ResizeObserverEntry];
}

/** Re-reports the container's size to every observer, the way a browser does on a real resize. */
function resizeTo(next: number): void {
  width = next;
  Object.defineProperty(container, "clientWidth", { value: next, configurable: true });
  for (const { callback, target, observer } of observers) callback(entriesFor(target), observer);
}

const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

/** Svelte applies a changed option on a microtask; the DOM is not updated synchronously. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  Object.defineProperty(globalThis, "ResizeObserver", {
    value: StubResizeObserver,
    writable: true,
    configurable: true,
  });
  observers.clear();
  width = 800;
  container = document.createElement("div");
  Object.defineProperty(container, "clientWidth", { value: 800, configurable: true });
  document.body.append(container);
});
afterEach(() => {
  handle?.destroy();
  handle = undefined;
  container.remove();
});

type RenderOverrides = Partial<Omit<Parameters<typeof renderCalendar>[2], "lang" | "onEventClick">>;

const render = (events: PreviewEvent[], lang: "en" | "es" = "en", overrides: RenderOverrides = {}) => {
  const onEventClick = vi.fn();
  handle = renderCalendar(container, events, {
    lang,
    onEventClick,
    maxPerDay: 3,
    initialDate: { kind: "next-event" },
    responsive: true,
    ...overrides,
  });
  return onEventClick;
};

describe("the calendar the widget mounts", () => {
  it("draws a month grid, not an empty container", () => {
    render([timed, allDay]);
    expect(container.querySelector(".ec-month-view")).not.toBeNull();
    // A month is seven columns and five or six rows of days.
    expect(container.querySelectorAll(".ec-col-head")).toHaveLength(7);
    const days = container.querySelectorAll(".ec-day");
    expect(days.length).toBeGreaterThanOrEqual(28);
    expect(days.length).toBeLessThanOrEqual(42);
  });

  it("gives the month navigation the requested language", () => {
    render([timed], "es");
    expect(container.querySelector(".ec-prev")?.getAttribute("aria-label")).toBe("Mes anterior");
    expect(container.querySelector(".ec-next")?.getAttribute("aria-label")).toBe("Mes siguiente");
    handle!.destroy();
    container.innerHTML = "";
    render([timed], "en");
    expect(container.querySelector(".ec-prev")?.getAttribute("aria-label")).toBe("Previous month");
  });

  it("names the weekdays for a screen reader", () => {
    render([timed]);
    const labels = [...container.querySelectorAll(".ec-col-head span")].map((node) =>
      node.getAttribute("aria-label"),
    );
    expect(labels).toHaveLength(7);
    expect(labels).toContain("Monday");
    expect(labels.every((label) => label && label.length > 0)).toBe(true);
  });

  it("mounts for a feed with no events, and for an event with no date", () => {
    // Two inputs a publisher can really produce: an empty feed, and an event
    // whose startDate the exporter never wrote.
    expect(() => render([])).not.toThrow();
    expect(container.querySelectorAll(".ec-day").length).toBeGreaterThanOrEqual(28);
    handle!.destroy();
    container.innerHTML = "";
    expect(() => render([{ name: "Date unknown" }, timed])).not.toThrow();
    expect(container.querySelector(".ec-month-view")).not.toBeNull();
  });

  it("opens on the month of the next event, not on the current month", () => {
    // The bug: the library opens on today, so a feed starting next March
    // rendered an empty grid and read as broken (#167).
    // jsdom renders every library text node empty (see the file header), so
    // the month on show is read back through the handle rather than from the
    // toolbar title.
    render([timed, allDay], "en", { now: new Date(2026, 0, 15) });
    expect(handle!.currentDate()).toBe("2026-08-10");
  });

  it("honours initial-date=today and a fixed initial-date", () => {
    render([timed], "en", { initialDate: { kind: "today" }, now: new Date(2026, 0, 15) });
    // "today" hands the date back to the library, which uses the real clock.
    expect(handle!.currentDate()).toBe(todayISO());
    handle!.destroy();
    container.innerHTML = "";
    render([timed], "en", { initialDate: { kind: "date", date: "2026-12-01" } });
    expect(handle!.currentDate()).toBe("2026-12-01");
  });

  it("offers Today and Next event in the toolbar, and jumps with them", () => {
    // Before this, the toolbar was `title | prev,next` only, which makes a
    // 460-event feed a blind month-by-month walk (#167).
    render([timed], "en", { initialDate: { kind: "today" }, now: new Date(2026, 0, 15) });
    expect(container.querySelector(".ec-today")).not.toBeNull();
    const nextEvent = container.querySelector<HTMLButtonElement>("button.ec-nextEvent");
    expect(nextEvent).not.toBeNull();
    nextEvent!.click();
    expect(handle!.currentDate()).toBe("2026-08-12");
  });

  it("hides the Next event button when the feed has nothing upcoming", () => {
    // A button that can only answer "nothing ahead" is worse than no button.
    render([timed], "en", { now: new Date(2027, 0, 15) });
    expect(container.querySelector(".ec-today")).not.toBeNull();
    expect(container.querySelector(".ec-nextEvent")).toBeNull();
  });

  it("caps a day by pinning the row height, and off removes the cap", () => {
    // The cap is a height because `dayMaxEvents` only takes `true`; without
    // this the library stacks every event of a day without limit (#167).
    render([timed], "en", { maxPerDay: 4 });
    expect(container.getAttribute("data-day-rows")).toBe("4");
    // The formula itself is asserted in calendar-layout.test.ts; what
    // matters here is that the host carries it.
    expect(container.style.getPropertyValue("--ote-calendar-row-height")).toBe(dayRowHeight(4));
    expect(container.querySelector(".ec-uniform")).not.toBeNull();
    handle!.destroy();
    container.innerHTML = "";
    render([timed], "en", { maxPerDay: "off" });
    expect(container.hasAttribute("data-day-rows")).toBe(false);
    expect(container.querySelector(".ec-uniform")).toBeNull();
  });

  it("degrades to the list view in a narrow container, and not when responsive is off", async () => {
    // jsdom lays nothing out, so the width has to be dictated — the real
    // measurement is the ResizeObserver entry the browser hands over.
    resizeTo(390);
    render([timed], "en");
    await flush();
    expect(container.querySelector(".ec-list")).not.toBeNull();
    expect(container.querySelector(".ec-month-view")).not.toBeNull();
    expect(container.querySelector(".ec-day-grid")).toBeNull();
    handle!.destroy();
    container.innerHTML = "";
    render([timed], "en", { responsive: false });
    expect(container.querySelector(".ec-day-grid")).not.toBeNull();
    expect(container.querySelector(".ec-list")).toBeNull();
  });

  it("switches back to the grid when the container grows", async () => {
    resizeTo(390);
    render([timed], "en");
    await flush();
    expect(container.querySelector(".ec-list")).not.toBeNull();
    resizeTo(900);
    await flush();
    expect(container.querySelector(".ec-day-grid")).not.toBeNull();
    expect(container.querySelector(".ec-list")).toBeNull();
  });

  it("leaves nothing behind when destroyed", () => {
    render([timed]);
    expect(container.querySelector(".ec-month-view")).not.toBeNull();
    handle!.destroy();
    handle = undefined;
    expect(container.querySelector(".ec-month-view")).toBeNull();
    expect(container.children).toHaveLength(0);
  });
});
