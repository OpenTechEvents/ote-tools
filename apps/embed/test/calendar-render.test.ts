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

import { CALENDAR_DENSITY, boundedRowHeight, dayRowHeight, renderCalendar, type CalendarHandle } from "../src/calendar-layout.js";
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
    bounded: false,
    compact: false,
    fillsHeight: false,
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

  // The library's popover decides "a pointerdown happened outside me" with
  // `el.contains(jsEvent.target)` on a document-level listener, and inside a
  // shadow root that target is retargeted to the host — so it closed itself
  // on a click on one of its own events, and `noClick()` ate the click that
  // would have opened the modal. The dialog itself only ever renders in a
  // real browser (jsdom draws no `.ec-event`), so what is asserted here is
  // the contract the fix depends on: the verdict arrives as a
  // `pointerdownoutside` CustomEvent on the dialog, carrying the original
  // event, and the guard answers the question again with `composedPath()`.
  it("does not let the +N more popover close on a pointerdown that was really inside it", () => {
    render([timed]);

    const dialog = document.createElement("div");
    dialog.className = "ec-popup";
    container.querySelector(".ec-month-view")!.append(dialog);
    const closePopover = vi.fn();
    dialog.addEventListener("pointerdownoutside", closePopover);

    const verdict = (path: EventTarget[]) =>
      new CustomEvent("pointerdownoutside", { detail: { jsEvent: { composedPath: () => path } } });

    // Retargeted: the pointerdown was on an event inside the dialog.
    dialog.dispatchEvent(verdict([dialog, container, document.body]));
    expect(closePopover).not.toHaveBeenCalled();

    // Genuinely outside — including elsewhere in this same widget — still closes it.
    dialog.dispatchEvent(verdict([container, document.body]));
    expect(closePopover).toHaveBeenCalledTimes(1);
  });

  it("draws no toolbar of its own", () => {
    // The widget draws one header for every layout (#183), so the
    // library's toolbar is configured empty: it would otherwise stack a
    // second strip above the grid, and the two together cost about 76px
    // of a budget that is often 300.
    render([timed], "es");
    expect(container.querySelector("button.ec-today")).toBeNull();
    expect(container.querySelector(".ec-prev")).toBeNull();
    expect(container.querySelector(".ec-next")).toBeNull();
    expect(container.querySelector(".ec-toolbar")?.textContent?.trim() ?? "").toBe("");
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

  it("pages and returns to today on the header's behalf", async () => {
    // The header owns the controls; the calendar owns the month. These
    // three are the whole contract between them.
    render([timed], "en", { initialDate: { kind: "date", date: "2026-08-12" }, now: new Date(2026, 0, 15) });
    expect(handle!.currentDate()).toBe("2026-08-12");

    handle!.next();
    await flush();
    expect(handle!.currentDate()?.slice(0, 7)).toBe("2026-09");

    handle!.prev();
    handle!.prev();
    await flush();
    expect(handle!.currentDate()?.slice(0, 7)).toBe("2026-07");

    handle!.today();
    await flush();
    expect(handle!.currentDate()).toBe("2026-01-15");
  });

  it("reports the month it is showing, and whether today is on screen", async () => {
    // The title is the library's own rendered one rather than a date
    // reformatted here: the narrow list fallback titles a range of days,
    // not a month. `showsToday` is what greys the header's Today button.
    //
    // No injected `now` here, on purpose: `initial-date="today"` hands the
    // month to the library, which reads the real clock, so a fake one
    // would make the widget and the calendar disagree about what "today"
    // means and the test would assert that disagreement.
    const onDatesSet = vi.fn();
    render([timed], "en", { initialDate: { kind: "today" }, onDatesSet });
    // Svelte renders on a microtask, so the first report lands after mount
    // returns — which is why element.ts applies it to the row in place
    // rather than passing it into the render that created the row.
    await flush();

    expect(onDatesSet).toHaveBeenCalledTimes(1);
    const first = onDatesSet.mock.calls[0]![0] as { title: string; showsToday: boolean };
    expect(first.title).toContain("2026");
    expect(first.showsToday).toBe(true);

    handle!.next();
    await flush();
    const latest = onDatesSet.mock.calls.at(-1)![0] as { title: string; showsToday: boolean };
    expect(latest.title).not.toBe(first.title);
    expect(latest.showsToday).toBe(false);
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

  it("fills whatever height it is given, budget or not", () => {
    // The library writes its `height` option as an inline style on its own
    // root, and "100%" is what makes .ec-main a scroll container with the
    // sticky weekday header inside it. It is unconditional because a host
    // sizing the element with plain CSS asks for the same thing as one
    // setting max-height, and against an auto-height ancestor a percentage
    // height resolves to auto — the behaviour of every embed that sets no
    // height at all.
    render([timed], "en", { bounded: true });
    expect(container.querySelector<HTMLElement>(".ec")?.style.height).toBe("100%");
    handle!.destroy();
    container.innerHTML = "";
    render([timed], "en", { bounded: false });
    expect(container.querySelector<HTMLElement>(".ec")?.style.height).toBe("100%");
  });

  it("lets the weeks share a height budget instead of each reserving max-per-day", () => {
    // The flat pin sizes every week for max-per-day events, empty ones
    // included, so a sparse month scrolled through ~750px of blank rows
    // inside a 400px budget. Bounded, the rows share what the budget leaves.
    render([timed], "en", { maxPerDay: 4, bounded: true });
    expect(container.style.getPropertyValue("--ote-calendar-row-height")).toBe(boundedRowHeight());
    expect(container.style.getPropertyValue("--ote-calendar-row-height")).not.toBe(dayRowHeight(4));
    expect(container.querySelector<HTMLElement>(".ec")?.style.height).toBe("100%");
    // The rule that reads the property is gated on this attribute, so the
    // shared sizing only reaches the grid while it is set.
    expect(container.getAttribute("data-day-rows")).toBe("4");
    expect(container.querySelector(".ec-uniform")).not.toBeNull();
  });

  it("never shrinks a bounded row below a day showing one event", () => {
    // Pure 1fr is the library's native sizing and it fails at the small end:
    // a 400px budget over a six-week month gave 52px rows, which hold the
    // date and nothing else, so every single-event day rendered as "+1 more"
    // and the calendar showed no events at all. The floor is the height of a
    // day showing one event beside a "+N more" link.
    expect(boundedRowHeight()).toBe(`minmax(${dayRowHeight(1)}, 1fr)`);
    expect(boundedRowHeight()).toContain("1fr");
  });

  it("still pins the row height when there is no budget", () => {
    // Unbounded, 1fr tracks grow to the tallest row's content, so without
    // the pin one busy day makes every week that tall and nothing is capped.
    render([timed], "en", { maxPerDay: 4, bounded: false });
    expect(container.getAttribute("data-day-rows")).toBe("4");
    expect(container.style.getPropertyValue("--ote-calendar-row-height")).toBe(dayRowHeight(4));
  });

  it("marks the container compact and reserves the compact metrics", () => {
    // The marker drives the rules in theme.css.ts and the constants drive the
    // row maths; both come from the same flag because a reservation that
    // disagrees with what the cell renders caps a day at the wrong number.
    render([timed], "en", { maxPerDay: 3, compact: true });
    expect(container.getAttribute("data-density")).toBe("compact");
    expect(container.style.getPropertyValue("--ote-calendar-row-height")).toBe(dayRowHeight(3, true));
    handle!.destroy();
    container.innerHTML = "";
    render([timed], "en", { maxPerDay: 3, compact: false });
    expect(container.hasAttribute("data-density")).toBe(false);
    expect(container.style.getPropertyValue("--ote-calendar-row-height")).toBe(dayRowHeight(3, false));
  });

  it("gives a compact day a smaller floor, which is the point of it", () => {
    // Measured in Chrome: 5.8em of cell to show one event comfortably
    // against 3.4em compact, which is what takes a sparse month in a 400px
    // budget from 588px of content down to 367px.
    expect(boundedRowHeight(true)).toBe(`minmax(${dayRowHeight(1, true)}, 1fr)`);
    expect(boundedRowHeight(true)).not.toBe(boundedRowHeight(false));
    const compactFloor = CALENDAR_DENSITY.compact.head + CALENDAR_DENSITY.compact.row + CALENDAR_DENSITY.compact.foot;
    const comfyFloor =
      CALENDAR_DENSITY.comfortable.head + CALENDAR_DENSITY.comfortable.row + CALENDAR_DENSITY.comfortable.foot;
    expect(compactFloor).toBeLessThan(comfyFloor);
  });

  it("never reserves less than the boxes the stylesheet renders", () => {
    // The constants are measured box heights (apps/embed/CLAUDE.md says how
    // to re-measure). Reserving less than the cell actually draws is the one
    // way these can be wrong without any test noticing, so the measured
    // floor is asserted rather than left as a comment.
    expect(CALENDAR_DENSITY.compact.head).toBeGreaterThanOrEqual(1.238);
    expect(CALENDAR_DENSITY.compact.row).toBeGreaterThanOrEqual(1.139);
    expect(CALENDAR_DENSITY.compact.foot).toBeGreaterThanOrEqual(0.912);
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
