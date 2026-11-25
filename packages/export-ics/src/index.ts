import { resolveEventInheritance } from "@opentechevents/validate";

import { marked, type Tokens } from "marked";

import { labelsFor, labelValue } from "@opentechevents/validate";

import { wallClockToUtc } from "./wall-clock.js";
import { markdownToCalendarText } from "./plain-text.js";

import type { OteEvent, OteEventStatus, OteFeed, OteOrganizer } from "./types.js";

export type {
  OteAttendanceMode,
  OteCfp,
  OteEligibility,
  OteEvent,
  OteEventStatus,
  OteFeed,
  OteGeo,
  OteImageEntry,
  OteLocation,
  OteOffer,
  OteOrganizer,
  OtePartOf,
  OteSource,
} from "./types.js";

const CRLF = "\r\n";
const encoder = new TextEncoder();

/** Escapes a value for literal display inside an HTML fragment (X-ALT-DESC). */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// `description` is plain text or Markdown (OTE spec). DESCRIPTION (RFC 5545
// TEXT) can't hold markup, so this is rendered separately into an HTML
// fragment for X-ALT-DESC;FMTTYPE=text/html — the de facto (non-standard but
// widely implemented, e.g. Outlook) extension for rich-text VEVENT
// descriptions. Raw inline/block HTML in the source is escaped rather than
// passed through live, so it can't smuggle real markup into a client that
// renders this fragment.
const descriptionRenderer = new marked.Renderer();
descriptionRenderer.html = ({ text }: Tokens.HTML | Tokens.Tag) => escapeHtml(text);

/** Renders an OTE `description` (plain text or Markdown) to an HTML fragment. */
function descriptionToHtml(markdown: string): string {
  return marked.parse(markdown, {
    renderer: descriptionRenderer,
    // A plain-text description is the common case, and a lone newline in one
    // reads as an intended line break, not two words meant to run together.
    breaks: true,
    async: false,
  });
}

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

/**
 * `2026-06-26T19:00` → `20260626T190000`. OTE's dateTime is deliberately
 * often seconds-less; older valid documents may include seconds. iCalendar's
 * `DTSTART`/`DTEND` require `HHMMSS`, so append seconds only when absent.
 */
function icsDateTimeLocal(wallClock: string): string {
  const [date, time] = wallClock.split("T");
  return `${icsDate(date)}T${time.replaceAll(":", "").padEnd(6, "0")}`;
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
  utcTimes = false,
): string[] {
  if (isDateOnly(wallClock)) {
    return prop(`${name};VALUE=DATE`, icsDate(wallClock));
  }
  if (utcTimes) return prop(name, wallClockToUtc(wallClock, timezone));
  if (timezone === "UTC") {
    return prop(name, `${icsDateTimeLocal(wallClock)}Z`);
  }
  return prop(`${name};TZID=${timezone}`, icsDateTimeLocal(wallClock));
}

const STATUS_MAP: Record<OteEventStatus, string> = {
  scheduled: "CONFIRMED",
  tentative: "TENTATIVE",
  cancelled: "CANCELLED",
  postponed: "TENTATIVE",
  rescheduled: "TENTATIVE",
  // RFC 5545 STATUS has no "moved online" concept — the event is still
  // happening, just not where it was, so CONFIRMED is the least-wrong
  // mapping. The semantic isn't fully lost though: a DESCRIPTION note is
  // added below (moved-online is the one status this exporter also
  // annotates in text, since silently degrading to CONFIRMED alone would
  // erase the one fact ("this moved online") that matters here).
  "moved-online": "CONFIRMED",
};

/** Appends `;LANGUAGE=<tag>` to a property name when textLanguage is set — native RFC 5545 support. */
function withLanguage(name: string, textLanguage: string | undefined): string {
  return textLanguage ? `${name};LANGUAGE=${textLanguage}` : name;
}

/** The first organizer that has an email — only that shape is a valid iCal ORGANIZER (a CAL-ADDRESS, in practice a mailto:). */
function primaryOrganizer(organizers: OteOrganizer[]): OteOrganizer | undefined {
  return organizers.find((o) => o.email !== undefined);
}

function vevent(event: OteEvent, dtstamp: string, locale?: string, utcTimes = false): string[] {
  // Field names only. Publisher text is never translated here; `locale` picks
  // the words this exporter adds around it. See `labelsFor`.
  const label = labelsFor(locale);
  const lines = ["BEGIN:VEVENT"];
  lines.push(...prop("UID", escapeText(event.id)));
  lines.push(...prop("DTSTAMP", dtstamp));
  lines.push(...prop(withLanguage("SUMMARY", event.textLanguage), escapeText(event.name)));
  const start = dateProp("DTSTART", event.startDate, event.timezone, utcTimes);
  lines.push(...start);
  if (utcTimes && !isDateOnly(event.startDate)) {
    lines.push(...prop("X-OTE-TIMEZONE", escapeText(event.timezone)));
  }
  if (event.endDate) {
    if (isDateOnly(event.endDate)) {
      // OTE endDate is the last day of the event; DTEND is exclusive.
      lines.push(...prop("DTEND;VALUE=DATE", nextDay(event.endDate)));
    } else {
      const end = dateProp("DTEND", event.endDate, event.timezone, utcTimes);
      if (utcTimes && !isDateOnly(event.startDate)) {
        // Compare the resolved instants, which is the only place a zone can
        // change the answer: `DTEND:20260626T170000Z` against
        // `DTSTART:20260626T170000Z`, property names trimmed.
        const resolvedEnd = end[0]!.slice("DTEND:".length);
        const resolvedStart = start[0]!.slice("DTSTART:".length);
        // A zero-length event is valid OTE (start === end), and RFC 5545
        // says a DATE-TIME `DTSTART` with no `DTEND` ends at the same instant
        // — so omitting it expresses exactly what the publisher wrote.
        // Refusing here instead meant the hosted converter rejected a whole
        // feed that validator.opentechevents.org calls valid, blaming
        // daylight saving for it.
        if (resolvedEnd < resolvedStart) {
          throw new Error("The event's end is not after its start when resolved in its time zone.");
        }
        if (resolvedEnd !== resolvedStart) lines.push(...end);
      } else {
        lines.push(...end);
      }
    }
  }

  // Both event.url and location.onlineUrl map to iCal URL. The canonical page
  // wins; when both exist the attend link is preserved in DESCRIPTION.
  const url = event.url ?? event.location?.onlineUrl;
  // Built in lockstep with descriptionParts: Outlook ignores DESCRIPTION
  // entirely once X-ALT-DESC is present, so the HTML version must carry
  // every fact the plain-text one does, not just the rendered description.
  const descriptionParts: string[] = [];
  const htmlParts: string[] = [];
  if (event.description) {
    // Markdown source is what the publisher wrote; a reader looking at a
    // calendar entry sees `**Bold**` and a link they cannot follow. The HTML
    // alternative below is ignored by clients that have no renderer, so the
    // plain-text one has to be readable on its own.
    descriptionParts.push(markdownToCalendarText(event.description));
    htmlParts.push(descriptionToHtml(event.description));
  }
  if (event.url) {
    descriptionParts.push(`${label.event}: ${event.url}`);
    const eventUrl = escapeHtml(event.url);
    htmlParts.push(`<p>${label.event}: <a href="${eventUrl}">${eventUrl}</a></p>`);
  }
  if (event.location?.onlineUrl && event.location.onlineUrl !== event.url) {
    descriptionParts.push(`${label.online}: ${event.location.onlineUrl}`);
    const onlineUrl = escapeHtml(event.location.onlineUrl);
    htmlParts.push(`<p>${label.online}: <a href="${onlineUrl}">${onlineUrl}</a></p>`);
  }
  const address = event.location?.address;
  if (address) {
    const parts = [address.street, address.postalCode, address.locality, address.region, address.country].filter(Boolean);
    if (parts.length) {
      const line = `${label.address}: ${parts.join(", ")}`;
      descriptionParts.push(line);
      htmlParts.push(`<p>${escapeHtml(line)}</p>`);
    }
  }
  if (event.organizers?.length) {
    const line = `${label.organizers}: ${event.organizers.map((organizer) => organizer.name).join(", ")}`;
    descriptionParts.push(line);
    htmlParts.push(`<p>${escapeHtml(line)}</p>`);
  }
  if (event.status === "moved-online") {
    descriptionParts.push(label.movedOnline);
    htmlParts.push(`<p>${label.movedOnline}</p>`);
  }
  // offers/cfp/eligibility have no iCalendar structure to hold them (accepted
  // total loss, per the spec's own mapping tables) — degraded to readable
  // DESCRIPTION text plus an X-OTE-* extension property below, so at least
  // the plain-text meaning and the primary URL survive.
  if (event.cfp) {
    const window = event.cfp.closesAt ? ` (${label.closes} ${event.cfp.closesAt})` : "";
    descriptionParts.push(`${label.cfp}: ${event.cfp.url}${window}`);
    const cfpUrl = escapeHtml(event.cfp.url);
    htmlParts.push(
      `<p>${label.cfp}: <a href="${cfpUrl}">${cfpUrl}</a>${escapeHtml(window)}</p>`,
    );
  }
  if (event.eligibility) {
    const note = event.eligibility.note ? ` — ${event.eligibility.note}` : "";
    const type = labelValue(event.eligibility.type, locale);
    descriptionParts.push(`${label.eligibility}: ${type}${note}`);
    htmlParts.push(
      `<p>${label.eligibility}: ${escapeHtml(type)}${escapeHtml(note)}</p>`,
    );
  }
  if (event.speakers && event.speakers.length > 0) {
    const names = event.speakers.map((s) =>
      s.affiliation ? `${s.name}, ${s.affiliation}` : s.name,
    );
    descriptionParts.push(`${label.speakers}: ${names.join(", ")}`);
    htmlParts.push(`<p>${label.speakers}: ${names.map(escapeHtml).join(", ")}</p>`);
  }
  if (event.recordings && event.recordings.length > 0) {
    const urls = event.recordings.map((r) => (typeof r === "string" ? r : r.url));
    const labels = event.recordings.map((r) =>
      typeof r === "string" ? r : (r.title ? `${r.title} — ${r.url}` : r.url),
    );
    descriptionParts.push(`${label.recording}:\n${labels.join("\n")}`);
    htmlParts.push(
      `<p>${label.recording}:<br/>${urls
        .map((url) => `<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`)
        .join("<br/>")}</p>`,
    );
  }
  if (event.offers && event.offers.length > 0) {
    const offerLines = event.offers.map((o) => {
      // An add-on costs partOf.offers PLUS this, and iCalendar has nowhere to
      // say so. Printing the bare number would state a total that is wrong
      // rather than incomplete, so the words go in instead of the figure.
      const price =
        o.scope === "add-on"
          ? label.addOn
          : o.price === 0
            ? label.free
            : o.price !== undefined && o.currency
              ? `${o.price} ${o.currency}`
              : undefined;
      return [o.name, price, o.url].filter((part): part is string => Boolean(part)).join(" — ");
    });
    descriptionParts.push(`${label.tickets}:\n${offerLines.join("\n")}`);
    htmlParts.push(`<p>${label.tickets}:<br/>${offerLines.map(escapeHtml).join("<br/>")}</p>`);
  }
  if (event.partOf?.offers && event.partOf.offers.length > 0) {
    const shared = event.partOf.offers.find(
      (o) => o.price !== undefined && o.currency !== undefined,
    );
    if (shared) {
      const amount = shared.price === 0 ? label.freeLower : `${shared.price} ${shared.currency}`;
      const line = `${label.wholeEventAdmission}: ${amount}`;
      descriptionParts.push(line);
      htmlParts.push(`<p>${escapeHtml(line)}</p>`);
    }
  }
  if (descriptionParts.length > 0) {
    lines.push(
      ...prop(
        withLanguage("DESCRIPTION", event.textLanguage),
        escapeText(descriptionParts.join("\n\n")),
      ),
    );
  }
  if (htmlParts.length > 0) {
    lines.push(
      ...prop(
        withLanguage("X-ALT-DESC;FMTTYPE=text/html", event.textLanguage),
        escapeText(htmlParts.join("\n")),
      ),
    );
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

  if (event.organizers && event.organizers.length > 0) {
    const primary = primaryOrganizer(event.organizers);
    if (primary) {
      lines.push(...prop(`ORGANIZER;CN=${escapeText(primary.name)}`, `mailto:${primary.email}`));
    }
    // Everyone else — and everyone, if none had an email at all, since a
    // valid ORGANIZER structurally requires one (a CAL-ADDRESS) — degrades
    // to an extension line. RFC 5545 permits only one ORGANIZER per VEVENT.
    for (const organizer of event.organizers) {
      if (organizer === primary) continue;
      lines.push(...prop("X-OTE-ORGANIZER", escapeText(organizer.name)));
    }
  }

  if (event.image && event.image.length > 0) {
    // RFC 7986 IMAGE: first image only, alt text has no home in iCalendar.
    const first = event.image[0];
    const imageUrl = typeof first === "string" ? first : first.url;
    lines.push(...prop("IMAGE;VALUE=URI;DISPLAY=BADGE", imageUrl));
  }

  if (event.partOf) {
    lines.push(...prop("RELATED-TO;RELTYPE=PARENT", escapeText(event.partOf.id)));
  }

  if (event.cfp) lines.push(...prop("X-OTE-CFP-URL", event.cfp.url));
  if (event.eligibility) {
    lines.push(...prop("X-OTE-ELIGIBILITY-TYPE", event.eligibility.type));
  }
  // Never ATTENDEE: in iCalendar that means somebody invited to the event, and
  // a speaker is not an invitee. RFC 9073's PARTICIPANT with
  // PARTICIPANT-TYPE:SPEAKER is the correct structured home, but it is a
  // VEVENT sub-component that older clients mishandle, so the conservative
  // X-OTE-SPEAKER carries it alongside the DESCRIPTION line.
  for (const speaker of event.speakers ?? []) {
    const value = speaker.affiliation ? `${speaker.name}, ${speaker.affiliation}` : speaker.name;
    lines.push(...prop("X-OTE-SPEAKER", escapeText(value)));
  }
  for (const recording of event.recordings ?? []) {
    const url = typeof recording === "string" ? recording : recording.url;
    lines.push(...prop("X-OTE-RECORDING", url));
  }
  if (event.offers && event.offers.length > 0) {
    const primary = event.offers[0]!;
    if (primary.url) lines.push(...prop("X-OTE-OFFER-URL", primary.url));
    // Same rule as the DESCRIPTION line: an add-on's number is not the price
    // of anything on its own, so it is not published as one. X-OTE-OFFER-SCOPE
    // says why the figure is missing rather than leaving it unexplained.
    if (primary.scope) lines.push(...prop("X-OTE-OFFER-SCOPE", primary.scope));
    if (primary.price !== undefined && primary.scope !== "add-on") {
      lines.push(...prop("X-OTE-OFFER-PRICE", String(primary.price)));
    }
    if (primary.currency && primary.scope !== "add-on") {
      lines.push(...prop("X-OTE-OFFER-CURRENCY", primary.currency));
    }
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
 * Converts a VALID OTE Feed (v0.3) into an iCalendar document (RFC 5545).
 * Pure and deterministic: no I/O, no clock — DTSTAMP comes from the feed's
 * updatedAt. Validate the feed first with @opentechevents/validate.
 *
 * Fields with no iCal equivalent (attendanceMode, languages, license, source)
 * are omitted, never approximated. offers/cfp/eligibility degrade to
 * DESCRIPTION text plus an X-OTE-* extension property (accepted total loss
 * of structure, per the spec's own mapping tables) rather than being
 * dropped outright. See the package README for the full mapping.
 */
export function feedToIcs(feed: OteFeed, options: { locale?: string; utcTimes?: boolean } = {}): string {
  // Each event's EFFECTIVE values. A feed may declare its organizers,
  // language and licence once and let its events inherit them — the schemas
  // say so in `x-inheritsFrom` and the feed schema validates against the
  // effective value — so reading `event.organizers` without resolving meant
  // half the events in a correctly written feed named nobody at all.
  // Idempotent: a caller that already resolved loses nothing.
  feed = resolveEventInheritance(feed);
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
    lines.push(...vevent(event, dtstamp, options.locale, options.utcTimes));
  }
  lines.push("END:VCALENDAR");
  return lines.join(CRLF) + CRLF;
}
