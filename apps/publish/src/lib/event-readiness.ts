import type { OteEvent } from "@opentechevents/export-jsonld";

/**
 * One thing a destination will ask for, and whether this event already has
 * it.
 *
 * A placeholder channel that only lists what it *will* do is a promise. This
 * turns it into something useful today: the organizer sees which of their
 * fields are ready to be broadcast and which ones every destination will ask
 * for and none of them can invent. Filling those in is work they can do now,
 * in the editor, before a single channel exists.
 */
export interface ReadinessItem {
  label: string;
  /** What the event actually says, when it says anything. */
  detail?: string;
  present: boolean;
  /** Why a destination wants it — shown when it's missing. */
  wanted: string;
}

const truncate = (value: string, max = 60): string =>
  value.length <= max ? value : `${value.slice(0, max - 1)}…`;

/** The fields destinations ask for, in the order they usually ask. */
export function readiness(event: OteEvent): ReadinessItem[] {
  const items: ReadinessItem[] = [];

  items.push({
    label: "Title",
    detail: truncate(event.name),
    present: true,
    wanted: "every destination starts here",
  });

  items.push({
    label: "Date and timezone",
    detail: `${event.startDate}${event.endDate ? ` → ${event.endDate}` : ""} (${event.timezone})`,
    present: true,
    wanted: "every destination starts here",
  });

  const venue = event.location?.venue;
  const online = event.location?.onlineUrl;
  items.push({
    label: "Venue or joining link",
    detail: venue ?? online,
    present: Boolean(venue ?? online),
    wanted: "directories reject an event with nowhere to go",
  });

  items.push({
    label: "Description",
    detail: event.description ? `${event.description.length} characters` : undefined,
    present: Boolean(event.description),
    wanted: "newsletters and social posts are mostly this",
  });

  items.push({
    label: "Image",
    detail: event.image?.length ? `${event.image.length} image(s)` : undefined,
    present: Boolean(event.image?.length),
    wanted: "social cards and listings look empty without one",
  });

  items.push({
    label: "Event page URL",
    detail: event.url,
    present: Boolean(event.url),
    wanted: "listings link back to you — this is the link they use",
  });

  items.push({
    label: "Tickets or registration",
    detail: event.offers?.length ? `${event.offers.length} offer(s)` : undefined,
    present: Boolean(event.offers?.length),
    wanted: "some directories will not list an event with no way to attend",
  });

  items.push({
    label: "Organizers",
    detail: event.organizers?.map((organizer) => organizer.name).join(", "),
    present: Boolean(event.organizers?.length),
    wanted: "submissions usually ask who is behind the event",
  });

  items.push({
    label: "Topics",
    detail: event.tags?.join(", "),
    present: Boolean(event.tags?.length),
    wanted: "directories file events by topic",
  });

  items.push({
    label: "Call for proposals",
    detail: event.cfp?.url,
    present: Boolean(event.cfp),
    wanted: "CFP trackers exist specifically for this",
  });

  return items;
}
