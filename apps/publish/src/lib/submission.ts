import type { OteEvent } from "@opentechevents/export-jsonld";

import type { Destination } from "./destinations.js";

/**
 * The `assisted` level of the automation ladder, in one pure module.
 *
 * Nothing here is automation — it is the difference between "open their form
 * and go dig your event out of your own repository" and "open their form with
 * every answer already sitting next to it". That gap is most of the work of
 * publishing an event, and closing it needs no API, no account and no
 * credentials, which is exactly why it can ship for every destination at once.
 *
 * The repo-wide connector rule holds here as everywhere: a field this event
 * does not carry comes back marked missing. Nothing is invented, guessed or
 * filled with a plausible default.
 */

export interface SubmissionField {
  label: string;
  /** The value to copy, when there is one. */
  value?: string;
  /** True when the event has nothing to say here. */
  missing: boolean;
  /** Why the destination wants it — shown when it is missing. */
  wanted: string;
  /** Long values get a textarea rather than a one-line row. */
  long?: boolean;
}

/** How much text each destination will take, in characters. */
export const POST_LIMITS: Record<string, number> = {
  mastodon: 500,
  bluesky: 300,
  x: 280,
  linkedin: 3000,
  whatsapp: 4096,
  telegram: 4096,
  discord: 2000,
  slack: 3000,
};

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
};

/**
 * OTE dates are wall-clock — a date, or a local date-time with no offset — so
 * they are read as UTC and printed as UTC. Anything else would silently shift
 * an event by a day for readers west of the venue.
 */
export function formatDate(value: string): string {
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", DATE_FORMAT).format(date);
}

export function formatTime(value: string): string | undefined {
  const time = value.slice(11, 16);
  return /^\d{2}:\d{2}$/.test(time) ? time : undefined;
}

/** "Sat, 12 Mar 2026, 10:00" — or a range when the event runs more than a day. */
export function formatWhen(event: OteEvent): string {
  const start = formatDate(event.startDate);
  const startTime = formatTime(event.startDate);
  const sameDay = !event.endDate || event.endDate.slice(0, 10) === event.startDate.slice(0, 10);
  if (sameDay) {
    return startTime ? `${start}, ${startTime}` : start;
  }
  return `${start} → ${formatDate(event.endDate!)}`;
}

/** Where it happens, in the words a form expects. */
export function formatWhere(event: OteEvent): string | undefined {
  const venue = event.location?.venue;
  const online = event.location?.onlineUrl;
  if (venue && online) return `${venue} (and online: ${online})`;
  if (venue) return venue;
  if (online) return `Online — ${online}`;
  return undefined;
}

const ATTENDANCE: Record<string, string> = {
  "in-person": "In person",
  online: "Online",
  hybrid: "Hybrid",
};

function firstImage(event: OteEvent): string | undefined {
  const image = event.image?.[0];
  if (image === undefined) return undefined;
  return typeof image === "string" ? image : image.url;
}

function imageAlt(event: OteEvent): string | undefined {
  const image = event.image?.[0];
  return typeof image === "object" ? image.alt : undefined;
}

function offersLine(event: OteEvent): string | undefined {
  if (!event.offers?.length) return undefined;
  return event.offers
    .map((offer) => {
      const name = offer.name ?? "Ticket";
      const price =
        offer.price === undefined
          ? undefined
          : offer.price === 0
            ? "free"
            : `${offer.price}${offer.currency ? ` ${offer.currency}` : ""}`;
      return [name, price, offer.url].filter(Boolean).join(" — ");
    })
    .join("\n");
}

function cfpLine(event: OteEvent): string | undefined {
  if (!event.cfp) return undefined;
  const closes = event.cfp.closesAt ? `closes ${formatDate(event.cfp.closesAt)}` : undefined;
  return [event.cfp.url, closes].filter(Boolean).join(" — ");
}

/**
 * The sheet: every field a submission form asks for, in roughly the order they
 * ask, with this event's own answer next to it.
 *
 * The set is deliberately the same for every destination. Forms differ in
 * wording and in which subset they want, but they do not ask for things an
 * OTE event has no room for — and a per-destination field list would be a
 * mapping, which belongs in a package rather than in this app.
 */
export function submissionFields(event: OteEvent, destination?: Destination): SubmissionField[] {
  const where = formatWhere(event);
  const fields: SubmissionField[] = [
    {
      label: "Name",
      value: event.name,
      missing: false,
      wanted: "every destination starts here",
    },
    {
      label: "When",
      value: `${formatWhen(event)} (${event.timezone})`,
      missing: false,
      wanted: "every destination starts here",
    },
    {
      label: "Format",
      value: event.attendanceMode ? ATTENDANCE[event.attendanceMode] : undefined,
      missing: event.attendanceMode === undefined,
      wanted: "forms ask in person, online or hybrid, and will not guess",
    },
    {
      label: "Where",
      value: where,
      missing: where === undefined,
      wanted: "directories reject an event with nowhere to go",
    },
    {
      label: "Event page",
      value: event.url,
      missing: event.url === undefined,
      wanted: "listings link back to you — this is the link they use",
    },
    {
      label: "Description",
      value: event.description,
      missing: !event.description,
      wanted: "the body of every listing and post is this",
      long: true,
    },
    {
      label: "Topics",
      value: event.tags?.join(", "),
      missing: !event.tags?.length,
      wanted: "directories file events by topic",
    },
    {
      label: "Organizers",
      value: event.organizers
        ?.map((organizer) => [organizer.name, organizer.url ?? organizer.email].filter(Boolean).join(" — "))
        .join("\n"),
      missing: !event.organizers?.length,
      wanted: "submissions usually ask who is behind the event",
      long: true,
    },
    {
      label: "Tickets",
      value: offersLine(event),
      missing: !event.offers?.length,
      wanted: "some directories will not list an event with no way to attend",
      long: true,
    },
    {
      label: "Image",
      value: firstImage(event),
      missing: firstImage(event) === undefined,
      wanted: "social cards and listings look empty without one",
    },
    {
      label: "Image alt text",
      value: imageAlt(event),
      missing: imageAlt(event) === undefined,
      wanted: "the one accessibility field every network asks for and nobody fills",
    },
    {
      label: "Languages",
      value: event.languages?.join(", "),
      missing: !event.languages?.length,
      wanted: "regional directories filter by it",
    },
  ];

  // Only where it is actually asked for: a CFP row on a meetup's submission
  // sheet is a missing field the organizer can do nothing about.
  if (destination === undefined || destination.accepts !== "meetup") {
    fields.push({
      label: "Call for proposals",
      value: cfpLine(event),
      missing: event.cfp === undefined,
      wanted: "CFP trackers exist specifically for this",
    });
  }
  return fields;
}

// --- posts ------------------------------------------------------------------

const BOLD: Record<string, (text: string) => string> = {
  // WhatsApp and Slack both use single asterisks; everyone else uses two.
  whatsapp: (text) => `*${text}*`,
  slack: (text) => `*${text}*`,
};

function bold(destinationId: string, text: string): string {
  return (BOLD[destinationId] ?? ((value: string) => `**${value}**`))(text);
}

/** A hashtag per topic, for the networks where that still does something. */
function hashtags(event: OteEvent, max: number): string {
  if (!event.tags?.length) return "";
  return event.tags
    .slice(0, max)
    .map((tag) => `#${tag.replace(/[^\p{L}\p{N}]/gu, "")}`)
    .filter((tag) => tag.length > 1)
    .join(" ");
}

export interface Post {
  text: string;
  limit: number;
  /** True when the description had to be cut to fit. */
  trimmed: boolean;
}

/**
 * The announcement, in one destination's own markup and within its own limit.
 *
 * Built in fixed-then-flexible order on purpose: the title, date, place and
 * link are what make the post useful, so they are never what gets cut. Only
 * the description gives way, and when it does the post says so rather than
 * quietly shipping a sentence that stops mid-word.
 */
export function composePost(event: OteEvent, destinationId: string): Post {
  const limit = POST_LIMITS[destinationId] ?? 500;
  // Hashtags do nothing in a chat group and read as noise there.
  const chat = ["whatsapp", "telegram", "discord", "slack"].includes(destinationId);

  const header = [
    bold(destinationId, event.name),
    [formatWhen(event), formatWhere(event)].filter(Boolean).join(" · "),
  ].join("\n");
  const tail = [event.url, chat ? "" : hashtags(event, 3)].filter(Boolean).join("\n");

  const join = (body: string): string => [header, body, tail].filter(Boolean).join("\n\n");

  const description = (event.description ?? "").replace(/\s+/g, " ").trim();
  if (description === "") return { text: join(""), limit, trimmed: false };

  const room = limit - join("").length - 2;
  // Below that, whatever survives is a fragment rather than a sentence, and a
  // post with no description at all reads better than one with three words of
  // it.
  if (room < 40) return { text: join(""), limit, trimmed: true };
  if (description.length <= room) return { text: join(description), limit, trimmed: false };

  const cut = `${description.slice(0, room - 1).replace(/\s+\S*$/, "")}…`;
  return { text: join(cut), limit, trimmed: true };
}

/**
 * A link that opens the destination's own composer with the text already in
 * it, where such a link exists.
 *
 * Several networks have none: Mastodon's composer lives on whichever instance
 * the organizer is signed in to, and LinkedIn dropped text prefilling. Those
 * return undefined and the panel says so — an intent URL that silently drops
 * the text would be worse than no button.
 */
export function composerUrl(destinationId: string, text: string, eventUrl?: string): string | undefined {
  switch (destinationId) {
    case "bluesky":
      return `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`;
    case "x":
      return `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(text)}`;
    case "telegram":
      return eventUrl === undefined
        ? undefined
        : `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(text)}`;
    default:
      return undefined;
  }
}
