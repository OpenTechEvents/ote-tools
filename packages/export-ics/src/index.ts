import type { OteEvent, OteEventStatus, OteFeed } from "./types.js";

export type {
  OteAttendanceMode,
  OteEvent,
  OteEventStatus,
  OteFeed,
  OteGeo,
  OteLocation,
  OteSource,
} from "./types.js";

const CRLF = "\r\n";
const encoder = new TextEncoder();

/** Escapes a value for an iCalendar TEXT property (RFC 5545 §3.3.11). */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * Folds a content line at 75 octets (RFC 5545 §3.1). Continuation lines start
 * with a space that counts towards their own 75-octet limit. Folding is
 * byte-aware so multi-byte UTF-8 characters are never split.
 */
function fold(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const charBytes = encoder.encode(char).length;
    if (bytes + charBytes > 75) {
      out.push(current);
      current = " ";
      bytes = 1;
    }
    current += char;
    bytes += charBytes;
  }
  out.push(current);
  return out;
}

/** Builds one property as folded content lines. */
function prop(nameAndParams: string, value: string): string[] {
  return fold(`${nameAndParams}:${value}`);
}

const isDateOnly = (wallClock: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(wallClock);

/** `2026-10-16` → `20261016` */
const icsDate = (date: string): string => date.replaceAll("-", "");

/** `2026-06-26T19:00[:00]` → `20260626T190000` (seconds padded if absent). */
function icsDateTimeLocal(wallClock: string): string {
  const [date, time] = wallClock.split("T");
  const padded = time.length === 5 ? `${time}:00` : time;
  return `${icsDate(date)}T${padded.replaceAll(":", "")}`;
}

/** Instant (with offset or Z) → UTC basic form `20260706T100000Z`. */
function icsUtc(instant: string): string {
  return `${new Date(instant).toISOString().slice(0, 19).replace(/[-:]/g, "")}Z`;
}

/** `2026-10-17` → `20261018`. OTE endDate is inclusive; iCal DTEND is exclusive. */
function nextDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return icsDate(d.toISOString().slice(0, 10));
}

/**
 * DTSTART/DTEND for a wall-clock value. All-day → VALUE=DATE. UTC events get
 * the `Z` form; anything else gets `TZID=<IANA>`. No VTIMEZONE is emitted:
 * generating one requires a timezone database, and modern clients (Google
 * Calendar, Apple Calendar, Thunderbird) resolve IANA TZIDs on their own.
 */
function dateProp(
  name: "DTSTART" | "DTEND",
  wallClock: string,
  timezone: string,
): string[] {
  if (isDateOnly(wallClock)) {
    return prop(`${name};VALUE=DATE`, icsDate(wallClock));
  }
  if (timezone === "UTC") {
    return prop(name, `${icsDateTimeLocal(wallClock)}Z`);
  }
  return prop(`${name};TZID=${timezone}`, icsDateTimeLocal(wallClock));
}

const STATUS_MAP: Record<OteEventStatus, string> = {
  scheduled: "CONFIRMED",
  cancelled: "CANCELLED",
  postponed: "TENTATIVE",
  rescheduled: "TENTATIVE",
};

function vevent(event: OteEvent, dtstamp: string): string[] {
  const lines = ["BEGIN:VEVENT"];
  lines.push(...prop("UID", escapeText(event.id)));
  lines.push(...prop("DTSTAMP", dtstamp));
  lines.push(...prop("SUMMARY", escapeText(event.name)));
  lines.push(...dateProp("DTSTART", event.startDate, event.timezone));
  if (event.endDate) {
    if (isDateOnly(event.endDate)) {
      // OTE endDate is the last day of the event; DTEND is exclusive.
      lines.push(...prop("DTEND;VALUE=DATE", nextDay(event.endDate)));
    } else {
      lines.push(...dateProp("DTEND", event.endDate, event.timezone));
    }
  }

  // Both event.url and location.onlineUrl map to iCal URL. The canonical page
  // wins; when both exist the attend link is preserved in DESCRIPTION.
  const url = event.url ?? event.location?.onlineUrl;
  const descriptionParts: string[] = [];
  if (event.description) descriptionParts.push(event.description);
  if (event.url && event.location?.onlineUrl) {
    descriptionParts.push(`Online: ${event.location.onlineUrl}`);
  }
  if (descriptionParts.length > 0) {
    lines.push(...prop("DESCRIPTION", escapeText(descriptionParts.join("\n\n"))));
  }

  if (event.location?.venue) {
    lines.push(...prop("LOCATION", escapeText(event.location.venue)));
  }
  if (event.location?.geo) {
    const { lat, lon } = event.location.geo;
    lines.push(...prop("GEO", `${lat};${lon}`));
  }
  if (url) lines.push(...prop("URL", url));
  if (event.tags && event.tags.length > 0) {
    lines.push(...prop("CATEGORIES", event.tags.map(escapeText).join(",")));
  }
  // Emitted only when the field is present: absent stays absent.
  if (event.status) lines.push(...prop("STATUS", STATUS_MAP[event.status]));
  if (event.updatedAt) {
    lines.push(...prop("LAST-MODIFIED", icsUtc(event.updatedAt)));
  }
  lines.push("END:VEVENT");
  return lines;
}

/**
 * Converts a VALID OTE Feed (v0.2) into an iCalendar document (RFC 5545).
 * Pure and deterministic: no I/O, no clock — DTSTAMP comes from the feed's
 * updatedAt. Validate the feed first with @opentechevents/validate.
 *
 * Fields with no iCal equivalent (attendanceMode, languages, license, source)
 * are omitted, never approximated. See the package README for the mapping.
 */
export function feedToIcs(feed: OteFeed): string {
  const dtstamp = icsUtc(feed.updatedAt);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OpenTechEvents//ote-tools export-ics//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...prop("X-WR-CALNAME", escapeText(feed.title)),
  ];
  if (feed.description) {
    lines.push(...prop("X-WR-CALDESC", escapeText(feed.description)));
  }
  for (const event of feed.events) {
    lines.push(...vevent(event, dtstamp));
  }
  lines.push("END:VCALENDAR");
  return lines.join(CRLF) + CRLF;
}
