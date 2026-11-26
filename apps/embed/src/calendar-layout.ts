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
 * The pin is not used here because it reserves `max-per-day` events' worth
 * of height in *every* week including the empty ones, which is what made a
 * sparse month scroll through ~750px of blank rows inside a 400px budget.
 * So a bounded day shows as many events as fit rather than exactly
 * `max-per-day` — see renderCalendar().
 */
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
    // be here — `close` included: it names the `+N more` popover's close
    // button, which did not exist before `dayMaxEvents` was switched on.
    buttonText: {
      prev: strings.prev,
      next: strings.next,
      today: strings.today,
      close: strings.close,
    },
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
  prev: string;
  next: string;
  today: string;
  close: string;
  nextEvent: string;
  moreLink: (num: number) => string;
  noEvents: string;
}

const CALENDAR_STRINGS: Record<Lang, CalendarStrings> = {
  en: {
    prev: "Previous month",
    next: "Next month",
    today: "Today",
    close: "Close",
    nextEvent: "Next event",
    moreLink: (num) => `+${num} more`,
    noEvents: "No events this month",
  },
  es: {
    prev: "Mes anterior",
    next: "Mes siguiente",
    today: "Hoy",
    close: "Cerrar",
    nextEvent: "Próximo evento",
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
  /** `Date.now()` by default; a seam for tests, which must not depend on the real clock. */
  now?: Date;
}

export function renderCalendar(
  container: HTMLElement,
  events: PreviewEvent[],
  options: RenderCalendarOptions,
): CalendarHandle {
  const { lang, maxPerDay, responsive, bounded, compact } = options;
  const now = options.now ?? new Date();
  const strings = CALENDAR_STRINGS[lang];
  const date = resolveCalendarDate(events, options.initialDate, now);
  const jumpTo = nextEventDate(events, toISODate(now));

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

  let view = calendarViewForWidth(container.clientWidth, responsive);

  const calendar: Calendar = createCalendar(container, [DayGrid, List], {
    ...calendarLocaleOptions(lang),
    view,
    ...(date ? { date } : {}),
    events: toCalendarEvents(events),
    // "100%" fills the budget `.calendar-host` hands down; "auto" grows to
    // the content. Filling it is what lets the weeks share a definite height
    // rather than each reserving `max-per-day`'s worth of room.
    height: bounded ? "100%" : "auto",
    dayMaxEvents: maxPerDay !== "off",
    // "Next event" earns its place on a 460-event feed, where paging month
    // by month is the only other way to find anything — but only when there
    // is something ahead to jump to.
    ...(jumpTo
      ? {
          customButtons: {
            nextEvent: {
              text: strings.nextEvent,
              click() {
                calendar.setOption("date", jumpTo);
              },
            },
          },
        }
      : {}),
    headerToolbar: {
      start: "title",
      center: "",
      end: `${jumpTo ? "nextEvent " : ""}today prev,next`,
    },
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
