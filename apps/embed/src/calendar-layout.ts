import { addDays, isDateOnly } from "@opentechevents/preview-feed";
import type { PreviewEvent } from "@opentechevents/preview-feed";
import { createCalendar, destroyCalendar, DayGrid, List } from "@event-calendar/core";
import type { Calendar } from "@event-calendar/core";

import type { InitialDate, Lang } from "./attrs.js";

// esbuild's `.css` -> `text` loader, configured for this entry point only
// (see build.mjs), turns this into the stylesheet's plain text content
// instead of a linked <link>/<style> in the light DOM — the library itself
// never touches document.head, so we control exactly where its CSS lands:
// inside the widget's own Shadow DOM <style> (see element.ts). This is the
// specific property FullCalendar lacks and the reason it wasn't chosen.
import calendarCss from "@event-calendar/core/index.css";

export const CALENDAR_CSS = calendarCss;

export interface CalendarHandle {
  destroy(): void;
  /** The month the calendar is showing now, as `YYYY-MM-DD` — see `element.ts`: every re-render remounts the calendar, and without this the month the visitor paged to is lost. */
  currentDate(): string | undefined;
  /**
   * The month navigation, driven from the widget's own header (#183).
   *
   * The library has a `headerToolbar` and it is deliberately switched off:
   * it only exists inside this lazy-loaded chunk, so a toolbar drawn by it
   * cannot carry the view switcher, which has to be reachable from `list`
   * and `cards` too. One row of chrome that works in every layout beats two
   * that each work in one — and the widget's height budget is spent on
   * events, not on a second strip.
   */
  prev(): void;
  next(): void;
  today(): void;
}

/**
 * Below this **container** width the month grid degrades to the library's
 * list view (#169). At 390px a seven-column grid gives each day ~34px: the
 * weekday headers truncate to `do…`, event titles to `13…`, and nothing in
 * the view answers "what is on".
 *
 * Measured against the container, not the viewport, because the widget is
 * usually embedded in a column — a wide window says nothing about the space
 * this component actually has. 600px is where the narrowest of the seven
 * columns still fits a two-digit day number plus a few characters of title.
 */
export const CALENDAR_LIST_BREAKPOINT = 600;

export type CalendarView = "dayGridMonth" | "listMonth";

/**
 * A width of `0` means "not measured yet" (an unattached container, or
 * jsdom, which lays nothing out) — that keeps the month grid, so a
 * measurement failure degrades to the behaviour every existing embed
 * already has rather than to a surprise list.
 */
export function calendarViewForWidth(width: number, responsive: boolean): CalendarView {
  if (!responsive) return "dayGridMonth";
  return width > 0 && width < CALENDAR_LIST_BREAKPOINT ? "listMonth" : "dayGridMonth";
}

/**
 * The CSS row height that fits `maxPerDay` events in a day cell, as a
 * `calc()` in `em` so it tracks the host's font size.
 *
 * `@event-calendar/core`'s `dayMaxEvents` only takes `true` — "as many
 * events as fit the day cell" — so a numeric cap has to become a height.
 * The cell is a day-number header, N event chips, and the footer that holds
 * the `+N more` link; the library measures the real heights at runtime and
 * hides whatever crosses the bottom, so this only has to be close: an
 * unusual font lands on one event either side, and the popover is exact
 * regardless.
 *
 * Not `dayMaxEvents: true` with the calendar's own `height: "auto"`, which
 * looks like the obvious spelling and is the bug: `ec-uniform` sizes its
 * rows `minmax(0, 1fr)`, and `1fr` tracks in an auto-height grid grow to the
 * tallest row's content — so one 15-event day would make *every* week 15
 * events tall and still hide nothing.
 */
export function dayRowHeight(maxPerDay: number, compact = false): string {
  const { head, row, foot } = compact ? CALENDAR_DENSITY.compact : CALENDAR_DENSITY.comfortable;
  return `calc(${head}em + ${maxPerDay} * ${row}em + ${foot}em)`;
}

/**
 * The row height for a calendar under a `max-height` budget: at least a
 * one-event day, otherwise an equal share of whatever the budget leaves.
 *
 * `1fr` alone is what the library does natively, and it is wrong at the
 * small end — a 400px budget over a six-week month gives 52px rows, which
 * hold the date and nothing else, so every single-event day rendered as
 * "+1 more" and the calendar showed no events at all. The `minmax()` floor
 * is `dayRowHeight(1)`, the height of a day showing one event *and* a
 * "+N more" link, so a row can always show one event even when it has
 * others. Below that the weeks stop shrinking and `.ec-main` scrolls (the
 * safety valve in theme.css.ts).
 *
 * Superseded in practice by `weekRowTracks()`, whose track list overrides
 * `grid-template-rows` outright and sizes each week separately. This stays
 * as the value `--ec-row-height` falls back to when no track list is in
 * play — the narrow list fallback, and any path where `datesSet` has not
 * fired yet — so a month is never left sizing its rows from nothing.
 */
/**
 * The `grid-template-rows` for a month whose weeks are sized to their own
 * content, as a track list: the weekday header, then one track per visible
 * week.
 *
 * This is what lets a month collapse its empty weeks **and** keep
 * `max-per-day`. Driving the sizing through `--ec-row-height` cannot do
 * both — it is a single value shared by every row, so content-sizing it
 * (`auto`) grows each cell to fit its events and the "+N more" popover
 * never fires. An explicit track list has no such constraint: each week gets
 * the height its densest day needs, capped, and the library still hides
 * whatever does not fit that cell. Verified in Chrome on a 158-event feed —
 * six uniform 93px rows (644px) became 26/26/26/26/92/92 (373px) with every
 * `+N more` link unchanged.
 *
 * A week whose busiest day is within the cap reserves no footer, because
 * nothing is hidden and the "+N more" line is what the footer is for.
 */
export function weekRowTracks(
  events: PreviewEvent[],
  rangeStart: Date,
  rangeEnd: Date,
  maxPerDay: number,
  compact: boolean,
  fillsHeight = false,
): string {
  const { head, row, foot } = compact ? CALENDAR_DENSITY.compact : CALENDAR_DENSITY.comfortable;
  const perDay = eventsPerDay(events);
  const tracks: string[] = [];
  for (const week of weeksIn(rangeStart, rangeEnd)) {
    const busiest = Math.max(0, ...week.map((day) => perDay.get(day) ?? 0));
    // An empty week never grows: spare room is worth more to a week that
    // has something to show in it, and a 96px row holding one date number
    // is the waste this whole mechanism exists to remove.
    if (busiest === 0) {
      tracks.push(`${head}em`);
      continue;
    }
    const content =
      busiest <= maxPerDay
        ? `calc(${head}em + ${busiest} * ${row}em)`
        : `calc(${head}em + ${maxPerDay} * ${row}em + ${foot}em)`;
    // `1fr` only where there is room to share. Against an auto height it
    // resolves against the tallest week's content instead and blows the
    // month up — measured at 4867px for one that should be 529px.
    //
    // The floor is the date row, not the content: a week that cannot have
    // the height it wants should give its cells up to the "+N more" link
    // rather than make the month scroll, which is what Google Calendar's
    // month view does in a short container. Measured on a 158-event feed in
    // 400px: a content floor kept 144px rows and scrolled, showing 7 chips;
    // the date-row floor fits 80px rows with no scrollbar and shows 16.
    tracks.push(fillsHeight ? `minmax(${head}em, 1fr)` : content);
  }
  // `max-content` is the library's own first track, the weekday header.
  return `max-content ${tracks.join(" ")}`;
}

/** How many events land on each `YYYY-MM-DD`, counting every day a multi-day event covers. */
function eventsPerDay(events: PreviewEvent[]): Map<string, number> {
  const perDay = new Map<string, number>();
  for (const event of events) {
    if (!event.startDate) continue;
    const start = datePart(event.startDate);
    const end = event.endDate ? datePart(event.endDate) : start;
    for (const day of daysBetween(start, end)) perDay.set(day, (perDay.get(day) ?? 0) + 1);
  }
  return perDay;
}

/** The visible range split into weeks of seven `YYYY-MM-DD` days. */
function weeksIn(rangeStart: Date, rangeEnd: Date): string[][] {
  const weeks: string[][] = [];
  const cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
  // The range end is exclusive, and a guard keeps a bad range from spinning.
  while (cursor < rangeEnd && weeks.length < 10) {
    const week: string[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(toISODate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

/** Every `YYYY-MM-DD` from `start` to `end` inclusive, capped so a bad range cannot spin. */
function daysBetween(start: string, end: string): string[] {
  const days = [start];
  if (end <= start) return days;
  const cursor = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  while (days.length < 400) {
    cursor.setDate(cursor.getDate() + 1);
    if (cursor > last) break;
    days.push(toISODate(cursor));
  }
  return days;
}

export function boundedRowHeight(compact = false): string {
  return `minmax(${dayRowHeight(1, compact)}, 1fr)`;
}

/**
 * The box heights a day cell spends, per density, in `em` at the widget's
 * base size. **Measured in Chrome, not reasoned about** — they have to agree
 * with what `theme.css.ts` actually renders, or `max-per-day` caps a day at
 * the wrong number. Re-measure both together; apps/embed/CLAUDE.md says how.
 *
 * `comfortable` is the original look: `.ec-day-head` 38.4px, an `.ec-event`
 * chip plus its 1px gap 25.4px, `.ec-day-foot` 28.2px once it holds a
 * "+N more" link.
 *
 * `compact` is the same three boxes under the `[data-density="compact"]`
 * rules, measured the same way: `.ec-day-head` 19.8px, `.ec-event` 18.2px,
 * `.ec-day-foot` 14.6px at a 16px base, each rounded up slightly so the
 * reservation is never short of what the cell renders.
 *
 * It exists because one event cost ~5.8em of cell at the comfortable
 * metrics, so a month could not fit a small height budget without falling
 * back to "+N more" everywhere — Google Calendar's embed does the same job
 * in ~36px (20px date box, 16px chip, measured on its public embed).
 * Compact brings the one-event floor to 3.5em, which is what lets a bounded
 * month fit with its events still readable.
 *
 * These are a *reservation*: the library decides the final count by
 * measuring the cell at runtime, so an unusual font can still land on one
 * event either side — the same caveat `max-per-day` already carries. What
 * must hold is that the reservation is not smaller than the boxes above.
 */
export const CALENDAR_DENSITY = {
  comfortable: { head: 2.4, row: 1.6, foot: 1.8 },
  compact: { head: 1.25, row: 1.2, foot: 0.95 },
} as const;

/** The date portion of an OTE start/end value, which is already ISO-ordered — `"2026-08-12T19:00"` and `"2026-08-12"` both give `"2026-08-12"`. */
function datePart(value: string): string {
  return value.slice(0, 10);
}

export function toISODate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * The next event a visitor would be waiting for: the earliest one that has
 * not finished yet, as `YYYY-MM-DD`. An event that started yesterday and
 * ends tomorrow counts — it is still on — and the date returned is its
 * *start*, which is the day the calendar should land on.
 */
export function nextEventDate(events: PreviewEvent[], today: string): string | undefined {
  let next: string | undefined;
  for (const event of events) {
    if (!event.startDate) continue;
    const start = datePart(event.startDate);
    const end = event.endDate ? datePart(event.endDate) : start;
    if (end < today) continue;
    if (next === undefined || start < next) next = start;
  }
  return next;
}

function lastEventDate(events: PreviewEvent[]): string | undefined {
  let last: string | undefined;
  for (const event of events) {
    if (!event.startDate) continue;
    const start = datePart(event.startDate);
    if (last === undefined || start > last) last = start;
  }
  return last;
}

/**
 * Which date the calendar opens on. `undefined` means "leave it to the
 * library", i.e. today.
 *
 * `"next-event"` falls back to the most recent *past* event when nothing is
 * upcoming, so an archived feed opens on the month it ends in instead of on
 * an empty current month that reads as a broken widget (#167).
 */
export function resolveCalendarDate(
  events: PreviewEvent[],
  setting: InitialDate,
  now: Date,
): string | undefined {
  if (setting.kind === "today") return undefined;
  if (setting.kind === "date") return setting.date;
  const today = toISODate(now);
  return nextEventDate(events, today) ?? lastEventDate(events);
}

/** Same DTSTART/UTC-suffix nuance as apps/preview's own FullCalendar glue — deliberately not shared, it's calendar-library-specific. */
function calendarDate(value: string | undefined, timezone: string | undefined): string | undefined {
  if (!value) return undefined;
  return timezone === "UTC" && !isDateOnly(value) ? `${value}Z` : value;
}

function toCalendarEvents(events: PreviewEvent[]) {
  return events.flatMap((event) => {
    const start = calendarDate(event.startDate, event.timezone);
    if (!start) return [];
    const allDay = isDateOnly(event.startDate);
    const end =
      (allDay && event.endDate ? addDays(event.endDate, 1) : calendarDate(event.endDate, event.timezone)) ??
      start;
    return [
      {
        title: event.name,
        start,
        end,
        allDay,
        extendedProps: { previewEvent: event },
      },
    ];
  });
}

export function calendarLocaleOptions(lang: Lang): Calendar.Options {
  const locale = lang === "es" ? "es-ES" : "en-US";
  const strings = CALENDAR_STRINGS[lang];
  return {
    locale,
    firstDay: lang === "es" ? 1 : 0,
    // A plain object replaces the library's whole `buttonText` default (see
    // its `mergeOpts`), so every label the widget can actually show has to
    // be here. Since #183 that is one: the toolbar is off and the widget's
    // own header names prev/next/today (header.ts), while `close` still
    // names the `+N more` popover's close button. Keeping unused copies of
    // the other three here would be a second set to rot.
    buttonText: { close: strings.close },
    titleFormat: (start) => capitalizeFirst(
      new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(start),
    ),
    dayHeaderFormat: { weekday: "short" },
    dayHeaderAriaLabelFormat: { weekday: "long" },
    eventTimeFormat: { hour: "numeric", minute: "2-digit" },
    // The library hardcodes English for both: "+2 more" and "No events".
    moreLinkContent: (info) => strings.moreLink(info.num),
    noEventsContent: () => strings.noEvents,
  };
}

interface CalendarStrings {
  close: string;
  moreLink: (num: number) => string;
  noEvents: string;
}

const CALENDAR_STRINGS: Record<Lang, CalendarStrings> = {
  en: {
    close: "Close",
    moreLink: (num) => `+${num} more`,
    noEvents: "No events this month",
  },
  es: {
    close: "Cerrar",
    moreLink: (num) => `+${num} más`,
    noEvents: "No hay eventos este mes",
  },
};

function capitalizeFirst(value: string): string {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

export interface RenderCalendarOptions {
  lang: Lang;
  onEventClick: (event: PreviewEvent) => void;
  /** How many events a day cell shows before the rest go to the `+N more` popover; `"off"` stacks them all (the pre-0.9.0 behaviour). */
  maxPerDay: number | "off";
  initialDate: InitialDate;
  /** Whether the month grid may degrade to the list view in a narrow container. */
  responsive: boolean;
  /**
   * Whether the host gave the widget a height budget (`max-height`). It
   * switches the library's `height` option from `"auto"` to `"100%"`, which
   * is what makes `.ec-main` a bounded scroll container instead of a box
   * that grows to whatever the feed needs — and `.ec-main` is where the
   * library puts its own `position: sticky` weekday header, so the header
   * pins itself once there is a scrollport for it to pin to.
   */
  bounded: boolean;
  /** Resolved `density`: `true` uses the compact cell metrics (#170). */
  compact: boolean;
  /**
   * Whether the host gave the element a definite height, so the weeks may
   * grow into whatever it leaves over. A `max-height` does not count: it is
   * a ceiling, so a short month stays short rather than stretching to it.
   */
  fillsHeight: boolean;
  /** `Date.now()` by default; a seam for tests, which must not depend on the real clock. */
  now?: Date;
  /**
   * Called on mount and on every month change with what the widget's header
   * has to show: the library's own rendered title (not one recomputed from
   * the date — the narrow `list` fallback titles a *range of days*, not a
   * month), and whether today is inside the range on screen, which is what
   * greys the Today button.
   */
  onDatesSet?(info: { title: string; showsToday: boolean }): void;
}

/**
 * Undo the library's "a click inside me happened outside me" verdict, which
 * is what Shadow DOM does to its `+N more` popover.
 *
 * The popover closes itself on a pointerdown outside its dialog, detected
 * with a capturing `document` listener and `el.contains(jsEvent.target)`
 * (`outsideEvent()` in `@event-calendar/core`, unchanged through every
 * version this repo has pinned — `calendar-render.test.ts` asserts the
 * contract this fix hangs on, so a bump that changes it fails there). Inside a shadow root that test can never
 * pass: a `document`-level listener sees the event **retargeted** to the
 * host — measured here as `OTE-EVENTS`, with the real `<a>` only in
 * `composedPath()[0]`. So every pointerdown read as outside, and clicking an
 * event in the popover tore the popover down *before* its own click handler
 * could run — and `noClick()` swallowed the click on the way out. The
 * popover closed and nothing opened.
 *
 * The library announces the verdict as a `pointerdownoutside` CustomEvent
 * dispatched *on the dialog*, so the correction goes there: a capturing
 * listener on an ancestor runs before the target's own handler (capture
 * reaches the target even for a non-bubbling event, only the bubble phase is
 * skipped), and `stopImmediatePropagation()` keeps the event from arriving.
 * The guard re-asks the same question with `composedPath()`, which does not
 * retarget — a pointerdown genuinely outside still closes the popover,
 * including one elsewhere in this same widget.
 */
function suppressRetargetedOutsideEvents(container: HTMLElement): void {
  container.addEventListener(
    "pointerdownoutside",
    (domEvent) => {
      const { target } = domEvent;
      const source = (domEvent as CustomEvent<{ jsEvent?: Event }>).detail?.jsEvent;
      if (!(target instanceof Node) || !source?.composedPath) return;
      if (source.composedPath().includes(target)) domEvent.stopImmediatePropagation();
    },
    true,
  );
}

export function renderCalendar(
  container: HTMLElement,
  events: PreviewEvent[],
  options: RenderCalendarOptions,
): CalendarHandle {
  const { lang, maxPerDay, responsive, bounded, compact, fillsHeight } = options;
  const now = options.now ?? new Date();
  const date = resolveCalendarDate(events, options.initialDate, now);

  // A numeric cap is a row height, not a count — see dayRowHeight(). The
  // property is set on the container and read by a rule in theme.css.ts,
  // because `.ec-main` is the library's element and sets `--ec-row-height`
  // on itself, which beats inheritance.
  //
  // Under a height budget the pin is deliberately *not* applied. It sizes
  // every week for `maxPerDay` events, including the empty ones, so a sparse
  // month reserved ~750px of mostly blank rows inside a 400px budget and
  // scrolled through the gaps. Leaving it off lets the library's own
  // `ec-uniform` sizing (`minmax(0, 1fr)`) share the budget across the weeks:
  // the whole month fits, with no scrollbar, and `dayMaxEvents: true` still
  // sends whatever does not fit a day to the `+N more` popover.
  //
  // The trade is that `max-per-day` stops being an exact count while bounded
  // and becomes "as many as fit" — the host asked for a height first. With
  // `max-per-day="off"` there is no uniform sizing to fall back on, so that
  // combination keeps its natural row heights and scrolls instead.
  // The marker drives the compact rules in theme.css.ts; the constants below
  // have to match them, which is why both are set from the same flag.
  if (compact) container.setAttribute("data-density", "compact");
  else container.removeAttribute("data-density");

  if (maxPerDay === "off") {
    container.removeAttribute("data-day-rows");
    container.style.removeProperty("--ote-calendar-row-height");
  } else {
    container.setAttribute("data-day-rows", String(maxPerDay));
    container.style.setProperty(
      "--ote-calendar-row-height",
      bounded ? boundedRowHeight(compact) : dayRowHeight(maxPerDay, compact),
    );
  }

  // Weeks are sized to their own content, recomputed whenever the visible
  // range changes. It goes on the container as a custom property rather than
  // as an inline style on `.ec-main`, because that element belongs to the
  // library and its re-render rewrites the style attribute — the same reason
  // the row-height pin works this way.
  const applyWeekRows = (rangeStart: Date, rangeEnd: Date) => {
    if (maxPerDay === "off") {
      container.removeAttribute("data-week-rows");
      container.style.removeProperty("--ote-calendar-week-rows");
      return;
    }
    container.setAttribute("data-week-rows", "");
    container.style.setProperty(
      "--ote-calendar-week-rows",
      weekRowTracks(events, rangeStart, rangeEnd, maxPerDay, compact, fillsHeight),
    );
  };

  suppressRetargetedOutsideEvents(container);

  let view = calendarViewForWidth(container.clientWidth, responsive);

  const calendar: Calendar = createCalendar(container, [DayGrid, List], {
    ...calendarLocaleOptions(lang),
    view,
    ...(date ? { date } : {}),
    events: toCalendarEvents(events),
    // Always "100%": it fills whatever `.calendar-host` hands down, and
    // against an auto-height ancestor - every embed that sets no height - a
    // percentage height resolves to auto, so it is the old behaviour. That
    // is what lets a host size the element with plain CSS rather than only
    // with the `max-height` attribute.
    height: "100%",
    dayMaxEvents: maxPerDay !== "off",
    datesSet(info) {
      // Fires on mount and on every month/view change: the widget's header
      // reads its title and its Today state from here (see CalendarHandle).
      // Compared at local midnight, which is also where the library's
      // `info.start` sits: a range test against the raw clock would call
      // the current month "not today" for the rest of the day it starts on.
      const today = options.now ?? new Date();
      const todayStamp = +new Date(today.getFullYear(), today.getMonth(), today.getDate());
      options.onDatesSet?.({
        title: typeof info.view.title === "string" ? info.view.title : "",
        showsToday: todayStamp >= +info.start && todayStamp < +info.end,
      });
      // The list fallback has no month grid to size, so it is left alone.
      if (info.view.type === "list") {
        container.removeAttribute("data-week-rows");
        return;
      }
      applyWeekRows(info.start, info.end);
    },
    // The library's own toolbar is off: the widget draws one header for
    // every layout instead (see CalendarHandle). An empty `headerToolbar`
    // still renders its container, which theme.css.ts hides — measured,
    // because a 40px strip of nothing above the grid is exactly the room
    // this change set out to give back.
    headerToolbar: { start: "", center: "", end: "" },
    eventClick(info) {
      const previewEvent = info.event.extendedProps["previewEvent"] as PreviewEvent | undefined;
      if (previewEvent) options.onEventClick(previewEvent);
    },
  });

  // The narrow fallback follows the *container*, so it has to be measured
  // rather than asked of `matchMedia`: the widget is typically in a column
  // that is narrow on a wide window. The library observes this same element
  // for its own layout; this observer only ever changes the view.
  let observer: ResizeObserver | undefined;
  if (responsive && typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? container.clientWidth;
      const next = calendarViewForWidth(width, responsive);
      if (next === view) return;
      view = next;
      calendar.setOption("view", next);
    });
    observer.observe(container);
  }

  return {
    prev() {
      calendar.prev();
    },
    next() {
      calendar.next();
    },
    today() {
      calendar.setOption("date", toISODate(options.now ?? new Date()));
    },
    currentDate() {
      const current = calendar.getOption("date");
      return current instanceof Date ? toISODate(current) : typeof current === "string" ? current : undefined;
    },
    destroy() {
      observer?.disconnect();
      void destroyCalendar(calendar);
    },
  };
}
