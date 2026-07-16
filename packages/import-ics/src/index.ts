import { htmlToMarkdown, looksLikeHtml } from "./html-to-markdown.js";
import {
  parseIcs,
  splitEscaped,
  unescapeText,
  type IcsComponent,
  type IcsProperty,
} from "./parse.js";

export type {
  ImportResult,
  ImportWarning,
  OteEventStatus,
  OteGeo,
  OteLocation,
  PartialOteEvent,
} from "./types.js";
export { parseIcs, unescapeText } from "./parse.js";
export { htmlToMarkdown, looksLikeHtml } from "./html-to-markdown.js";

import type {
  ImportResult,
  ImportWarning,
  OteEventStatus,
  PartialOteEvent,
} from "./types.js";

/** First property with that name, or null. */
function first(component: IcsComponent, name: string): IcsProperty | null {
  return component.properties.find((p) => p.name === name) ?? null;
}

/** Every property with that name (CATEGORIES may repeat). */
function all(component: IcsComponent, name: string): IcsProperty[] {
  return component.properties.filter((p) => p.name === name);
}

const DATE_RE = /^(\d{4})(\d{2})(\d{2})$/;
const DATETIME_RE = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/;

type DtValue =
  | { kind: "date"; date: string }
  | { kind: "datetime"; wallClock: string; utc: boolean };

/** `20261016` → `2026-10-16`; `20260626T190000[Z]` → wall clock. */
function parseDtValue(prop: IcsProperty): DtValue | null {
  const value = prop.value.trim();
  const date = DATE_RE.exec(value);
  if (date) return { kind: "date", date: `${date[1]}-${date[2]}-${date[3]}` };
  const dt = DATETIME_RE.exec(value);
  if (dt) {
    return {
      kind: "datetime",
      wallClock: `${dt[1]}-${dt[2]}-${dt[3]}T${dt[4]}:${dt[5]}:${dt[6]}`,
      utc: dt[7] === "Z",
    };
  }
  return null;
}

/**
 * Whether a TZID names an IANA zone this importer will pass through.
 * Heuristic: IANA zones are `Area/Location` (or `UTC`); Windows zone names
 * ("W. Europe Standard Time") and other vendor spellings are not, and OTE
 * requires IANA — those events come out without a timezone, plus a warning.
 */
function isIanaTzid(tzid: string): boolean {
  return tzid === "UTC" || /^[A-Za-z_+-]+\/[A-Za-z0-9_+/-]+$/.test(tzid);
}

/** `20260601T090000Z` → `2026-06-01T09:00:00Z` (RFC requires the UTC form). */
function parseUtcInstant(value: string): string | null {
  const dt = DATETIME_RE.exec(value.trim());
  if (!dt || dt[7] !== "Z") return null;
  return `${dt[1]}-${dt[2]}-${dt[3]}T${dt[4]}:${dt[5]}:${dt[6]}Z`;
}

/** Date-only arithmetic in UTC, immune to the host timezone. */
function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const DURATION_RE =
  /^([+-])?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

/** RFC 5545 DURATION → seconds, or null when unparseable or negative. */
function parseDurationSeconds(value: string): number | null {
  const m = DURATION_RE.exec(value.trim());
  if (!m || m[1] === "-") return null;
  const [, , w, d, h, min, s] = m;
  const seconds =
    Number(w ?? 0) * 604800 +
    Number(d ?? 0) * 86400 +
    Number(h ?? 0) * 3600 +
    Number(min ?? 0) * 60 +
    Number(s ?? 0);
  return seconds > 0 ? seconds : null;
}

/**
 * Wall clock + seconds, computed naively (no timezone database). If the
 * event crosses a DST change this can be off by the shift — acceptable for
 * an import the organizer reviews field by field anyway.
 */
function addSecondsToWallClock(wallClock: string, seconds: number): string {
  const d = new Date(`${wallClock}Z`);
  d.setUTCSeconds(d.getUTCSeconds() + seconds);
  return d.toISOString().slice(0, 19);
}

const STATUS_MAP: Record<string, OteEventStatus> = {
  CONFIRMED: "scheduled",
  CANCELLED: "cancelled",
};

interface EventWarning {
  field?: string;
  message: string;
}

/** Fields ICS structurally cannot carry: warned about on every event. */
const UNMODELED: ReadonlyArray<EventWarning> = [
  {
    field: "id",
    message:
      "not imported: an ICS UID is not an OTE id — mint a stable URI under your domain",
  },
  {
    field: "attendanceMode",
    message: "iCalendar does not model attendance mode; set it if known",
  },
  {
    field: "languages",
    message: "iCalendar does not model event languages; set them if known",
  },
];

function convertVevent(vevent: IcsComponent): {
  event: PartialOteEvent;
  warnings: EventWarning[];
} {
  const event: PartialOteEvent = {};
  const warnings: EventWarning[] = [...UNMODELED];

  // Google Calendar emits empty DESCRIPTION:/LOCATION: lines for unset
  // fields; an empty value is treated as absent everywhere.
  const summary = first(vevent, "SUMMARY");
  if (summary && summary.value !== "") {
    event.name = unescapeText(summary.value);
  } else {
    warnings.push({ field: "name", message: "the VEVENT has no SUMMARY" });
  }

  const description = first(vevent, "DESCRIPTION");
  if (description && description.value !== "") {
    const unescaped = unescapeText(description.value);
    // Some producers (Meetup, Outlook) put HTML in DESCRIPTION. OTE wants
    // plain text or Markdown, so HTML is re-encoded — and flagged, because
    // the conversion is best-effort and deserves a human look.
    if (looksLikeHtml(unescaped)) {
      event.description = htmlToMarkdown(unescaped);
      warnings.push({
        field: "description",
        message:
          "DESCRIPTION contained HTML and was converted to Markdown — review the result",
      });
    } else {
      event.description = unescaped;
    }
  }

  // --- dates -------------------------------------------------------------
  const dtstartProp = first(vevent, "DTSTART");
  const dtstart = dtstartProp ? parseDtValue(dtstartProp) : null;
  let allDay = false;
  if (dtstart === null) {
    warnings.push({
      field: "startDate",
      message: dtstartProp
        ? `unparseable DTSTART "${dtstartProp.value}"`
        : "the VEVENT has no DTSTART",
    });
  } else if (dtstart.kind === "date") {
    allDay = true;
    event.startDate = dtstart.date;
    // All-day events have no timezone in OTE either: nothing lost, no warning.
  } else {
    event.startDate = dtstart.wallClock;
    const tzid = dtstartProp?.params["TZID"];
    if (dtstart.utc) {
      event.timezone = "UTC";
    } else if (tzid === undefined) {
      warnings.push({
        field: "timezone",
        message:
          "DTSTART is a floating time (no TZID) — set the timezone by hand",
      });
    } else if (isIanaTzid(tzid)) {
      event.timezone = tzid;
    } else {
      warnings.push({
        field: "timezone",
        message: `TZID "${tzid}" is not an IANA timezone — set it by hand`,
      });
    }
  }

  const dtendProp = first(vevent, "DTEND");
  const dtend = dtendProp ? parseDtValue(dtendProp) : null;
  if (dtendProp && dtend === null) {
    warnings.push({
      field: "endDate",
      message: `unparseable DTEND "${dtendProp.value}"`,
    });
  } else if (dtend?.kind === "date") {
    // iCal DTEND is exclusive; OTE endDate is the inclusive last day.
    const inclusive = addDays(dtend.date, -1);
    if (event.startDate === undefined || inclusive > event.startDate) {
      event.endDate = inclusive;
    }
    // inclusive === startDate is a one-day event: endDate stays absent.
  } else if (dtend?.kind === "datetime") {
    event.endDate = dtend.wallClock;
    const endTzid = dtendProp?.params["TZID"];
    const startTzid = dtstartProp?.params["TZID"];
    if (endTzid !== undefined && startTzid !== undefined && endTzid !== startTzid) {
      warnings.push({
        field: "endDate",
        message: `DTEND timezone "${endTzid}" differs from DTSTART's "${startTzid}"; the end wall-clock time was kept as written`,
      });
    }
  } else if (dtend === null) {
    // No DTEND: RFC 5545 §3.8.2.5 allows DURATION instead.
    const duration = first(vevent, "DURATION");
    if (duration && event.startDate !== undefined) {
      const seconds = parseDurationSeconds(duration.value);
      if (seconds === null) {
        warnings.push({
          field: "endDate",
          message: `unparseable DURATION "${duration.value}"`,
        });
      } else if (allDay) {
        // Duration counts days from an exclusive end; inclusive = days - 1.
        const days = Math.floor(seconds / 86400);
        if (days > 1) event.endDate = addDays(event.startDate, days - 1);
      } else {
        event.endDate = addSecondsToWallClock(event.startDate, seconds);
      }
    }
  }

  // --- everything else ----------------------------------------------------
  const location: PartialOteEvent["location"] = {};
  const venue = first(vevent, "LOCATION");
  if (venue && venue.value !== "") location.venue = unescapeText(venue.value);
  const geo = first(vevent, "GEO");
  if (geo) {
    const [lat, lon] = geo.value.split(";").map(Number);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      location.geo = { lat, lon };
    } else {
      warnings.push({
        field: "location.geo",
        message: `unparseable GEO "${geo.value}"`,
      });
    }
  }
  if (Object.keys(location).length > 0) event.location = location;

  const url = first(vevent, "URL");
  if (url && url.value !== "") event.url = url.value;

  const tags = all(vevent, "CATEGORIES")
    .flatMap((p) => splitEscaped(p.value, ","))
    .map((t) => unescapeText(t).trim())
    .filter(Boolean);
  if (tags.length > 0) event.tags = tags;

  const status = first(vevent, "STATUS");
  if (status) {
    const mapped = STATUS_MAP[status.value.trim().toUpperCase()];
    if (mapped !== undefined) {
      event.status = mapped;
    } else {
      // TENTATIVE is ambiguous (OTE splits it into postponed/rescheduled)
      // and anything else is non-standard: absent + warning, never a guess.
      warnings.push({
        field: "status",
        message: `STATUS "${status.value}" has no unambiguous OTE equivalent`,
      });
    }
  }

  const lastModified = first(vevent, "LAST-MODIFIED");
  if (lastModified) {
    const instant = parseUtcInstant(lastModified.value);
    if (instant !== null) event.updatedAt = instant;
  }

  // Recurrence is not expanded: doing it faithfully needs a timezone
  // database (DST-aware BYDAY/UNTIL math), and a wrong expansion would be
  // invented data. The master occurrence is imported; the rest are flagged.
  if (first(vevent, "RRULE") || first(vevent, "RDATE")) {
    warnings.push({
      message:
        "recurring event: occurrences are not expanded — only the first occurrence was imported; add later ones individually",
    });
  }

  return { event, warnings };
}

/**
 * Converts iCalendar text into partial OTE event documents.
 *
 * Pure and deterministic: no network, no filesystem, no clock. Never throws —
 * unusable input yields `{ events: [], warnings: [...] }`. Events keep the
 * document's order. A connector never invents data: every field the ICS did
 * not (or cannot) carry is absent from the event and identified by a warning
 * (`eventIndex` points into `events`; `field` names the OTE field).
 */
export function icsToEvents(text: string): ImportResult {
  const warnings: ImportWarning[] = [];
  const events: PartialOteEvent[] = [];

  const calendars = parseIcs(text).filter((c) => c.name === "VCALENDAR");
  if (calendars.length === 0) {
    warnings.push({
      message: "no VCALENDAR found — this does not look like an iCalendar file",
    });
    return { events, warnings };
  }

  const vevents = calendars.flatMap((c) =>
    c.components.filter((child) => child.name === "VEVENT"),
  );
  if (vevents.length === 0) {
    warnings.push({ message: "the calendar contains no events" });
    return { events, warnings };
  }

  for (const vevent of vevents) {
    const { event, warnings: eventWarnings } = convertVevent(vevent);
    const eventIndex = events.length;
    events.push(event);
    for (const w of eventWarnings) warnings.push({ eventIndex, ...w });
  }
  return { events, warnings };
}
