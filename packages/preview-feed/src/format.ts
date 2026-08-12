import type { PreviewEvent } from "./types.js";

export function truncate(text: string | undefined, length = 320): string | undefined {
  if (!text) return undefined;
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > length ? `${compact.slice(0, length - 1)}…` : compact;
}

export function nonEmpty(value: unknown): string | undefined {
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : undefined;
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value && typeof value === "object") return JSON.stringify(value);
  return undefined;
}

export function detailRows(entries: Array<[string, unknown]>): PreviewEvent["details"] {
  return entries.flatMap(([label, value]) => {
    const text = nonEmpty(value);
    return text ? [{ label, value: text }] : [];
  });
}

export function parseSortDate(value: string | undefined): number | null {
  if (!value) return null;
  const isoLike = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/.exec(
    value,
  );
  const date = isoLike
    ? new Date(`${isoLike[1]}T${isoLike[2] ?? "00:00:00"}`)
    : new Date(value);
  const time = date.valueOf();
  return Number.isNaN(time) ? null : time;
}

export function sortedEvents(events: PreviewEvent[]): PreviewEvent[] {
  const now = Date.now();
  return events
    .map((event, index) => ({ event, index, sortDate: parseSortDate(event.startDate) }))
    .sort((a, b) => {
      if (a.sortDate === null && b.sortDate === null) return a.index - b.index;
      if (a.sortDate === null) return 1;
      if (b.sortDate === null) return -1;
      const aPast = a.sortDate < now;
      const bPast = b.sortDate < now;
      if (aPast !== bPast) return aPast ? 1 : -1;
      return aPast ? b.sortDate - a.sortDate : a.sortDate - b.sortDate;
    })
    .map(({ event }) => event);
}

export function isDateOnly(value: string | undefined): boolean {
  return value !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDate(value: string | undefined, timezone: string | undefined): string {
  if (!value) return "";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (dateOnly) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
      new Date(`${value}T00:00:00Z`),
    );
  }
  const date = new Date(`${value}${timezone === "UTC" ? "Z" : ""}`);
  if (!Number.isNaN(date.valueOf())) {
    const formatted = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
    return timezone ? `${formatted} (${timezone})` : formatted;
  }
  return timezone ? `${value} (${timezone})` : value;
}

export function eventLocation(event: {
  location?: { venue?: string; onlineUrl?: string };
}): string {
  return event.location?.venue ?? onlineLocationLabel(event.location?.onlineUrl) ?? "online";
}

export function onlineLocationLabel(url: string | undefined): string | undefined {
  if (!url) return undefined;
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "Online event";
  }

  if (host === "meet.google.com") return "Google Meet";
  if (host === "teams.microsoft.com") return "Microsoft Teams";
  if (host === "meet.jit.si" || host.endsWith(".jitsi.net")) return "Jitsi Meet";
  if (host === "discord.gg" || host === "discord.com") return "Discord";
  if (host === "youtube.com" || host === "youtu.be") return "YouTube";
  if (host === "twitch.tv") return "Twitch";
  if (host === "lu.ma") return "Luma";
  if (host.endsWith(".zoom.us") || host === "zoom.us") return "Zoom";
  if (host.endsWith(".slack.com") || host === "slack.com") return "Slack";
  if (host.endsWith(".meetup.com") || host === "meetup.com") return "Meetup";
  if (host.endsWith(".eventbrite.com") || host === "eventbrite.com") return "Eventbrite";
  return "Online event";
}

export function eventWhen(event: PreviewEvent): string {
  return (
    event.dateLabel ??
    (event.endDate
      ? `${formatDate(event.startDate, event.timezone)} to ${formatDate(event.endDate, event.timezone)}`
      : formatDate(event.startDate, event.timezone))
  );
}

/** OTE's `image` field is `(string | {url, alt?})[]`; this picks the first entry. */
export function firstImage(
  images: Array<string | { url: string; alt?: string }> | undefined,
): { url: string; alt?: string } | undefined {
  const first = images?.[0];
  if (first === undefined) return undefined;
  return typeof first === "string" ? { url: first } : first;
}

/**
 * Picks the lowest-priced `offers[]` entry that actually declares a price —
 * an offer with only a `url` ("get tickets") has nothing to compare, so it's
 * skipped rather than treated as free. Carries that same offer's `url`
 * through (the registration/ticket link), so a price display can link out
 * to where it was quoted.
 */
export function cheapestPrice(
  offers: Array<{ price?: number; currency?: string; url?: string }> | undefined,
): { amount: number; currency?: string; url?: string } | undefined {
  const priced = (offers ?? []).filter(
    (offer): offer is { price: number; currency?: string; url?: string } => offer.price !== undefined,
  );
  if (priced.length === 0) return undefined;
  const cheapest = priced.reduce((min, offer) => (offer.price < min.price ? offer : min));
  return { amount: cheapest.price, currency: cheapest.currency, url: cheapest.url };
}
