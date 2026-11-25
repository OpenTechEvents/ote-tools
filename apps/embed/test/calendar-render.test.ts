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

import { renderCalendar, type CalendarHandle } from "../src/calendar-layout.js";
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

beforeEach(() => {
  // The calendar observes its container's size. jsdom has no ResizeObserver,
  // and without one the library throws on mount — so this stub reports a size
  // rather than doing nothing.
  if (!("ResizeObserver" in globalThis)) {
    class StubResizeObserver implements ResizeObserver {
      constructor(private readonly callback: ResizeObserverCallback) {}
      observe(target: Element): void {
        this.callback(
          [{ target, contentRect: { width: 800, height: 600 } } as unknown as ResizeObserverEntry],
          this,
        );
      }
      unobserve(): void {}
      disconnect(): void {}
    }
    Object.defineProperty(globalThis, "ResizeObserver", { value: StubResizeObserver, writable: true });
  }
  container = document.createElement("div");
  document.body.append(container);
});
afterEach(() => {
  handle?.destroy();
  handle = undefined;
  container.remove();
});

const render = (events: PreviewEvent[], lang: "en" | "es" = "en") => {
  const onEventClick = vi.fn();
  handle = renderCalendar(container, events, { lang, onEventClick });
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

  it("leaves nothing behind when destroyed", () => {
    render([timed]);
    expect(container.querySelector(".ec-month-view")).not.toBeNull();
    handle!.destroy();
    handle = undefined;
    expect(container.querySelector(".ec-month-view")).toBeNull();
    expect(container.children).toHaveLength(0);
  });
});
