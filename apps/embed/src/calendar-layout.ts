import { addDays, isDateOnly } from "@opentechevents/preview-feed";
import type { PreviewEvent } from "@opentechevents/preview-feed";
import { createCalendar, destroyCalendar, DayGrid } from "@event-calendar/core";
import type { Calendar } from "@event-calendar/core";

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

export function renderCalendar(
  container: HTMLElement,
  events: PreviewEvent[],
  options: { onEventClick: (event: PreviewEvent) => void },
): CalendarHandle {
  const calendar: Calendar = createCalendar(container, [DayGrid], {
    view: "dayGridMonth",
    events: toCalendarEvents(events),
    height: "auto",
    headerToolbar: { start: "title", center: "", end: "prev,next" },
    eventClick(info) {
      const previewEvent = info.event.extendedProps["previewEvent"] as PreviewEvent | undefined;
      if (previewEvent) options.onEventClick(previewEvent);
    },
  });

  return {
    destroy() {
      void destroyCalendar(calendar);
    },
  };
}
