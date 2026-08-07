import { icsToEvents, parseIcs } from "@opentechevents/import-ics";

import { detailRows } from "./format.js";
import type { PreviewFeed } from "./types.js";

export function calendarTitle(text: string): Pick<PreviewFeed, "title" | "description"> {
  const calendar = parseIcs(text).find((component) => component.name === "VCALENDAR");
  const first = (name: string) =>
    calendar?.properties.find((prop) => prop.name === name)?.value;
  return {
    title: first("X-WR-CALNAME"),
    description: first("X-WR-CALDESC"),
  };
}

export function icsToPreviewFeed(text: string): PreviewFeed {
  const result = icsToEvents(text);
  if (result.events.length === 0) {
    throw new Error(result.warnings[0]?.message ?? "The calendar contains no events");
  }
  return {
    ...calendarTitle(text),
    events: result.events.map((event) => ({
      name: event.name ?? "(untitled event)",
      startDate: event.startDate,
      endDate: event.endDate,
      timezone: event.timezone,
      location: event.location?.venue ?? event.location?.onlineUrl ?? "online",
      link: event.url ?? event.location?.onlineUrl,
      description: event.description,
      details: detailRows([
        ["Status", event.status],
        ["Timezone", event.timezone],
        ["Tags", event.tags],
        ["Updated", event.updatedAt],
      ]),
    })),
  };
}
