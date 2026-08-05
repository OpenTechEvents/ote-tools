import type { OteEvent, OteEventStatus, OteFeed } from "./types.js";

export { rssToPreviewFeed } from "./parse.js";
export type { RssPreviewEvent, RssPreviewFeed } from "./parse.js";
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

/** Escapes a value for XML text or attribute content. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Instant (with offset or Z) → RFC 822 date in GMT, as RSS 2.0 requires. */
function rfc822(instant: string): string {
  const d = new Date(instant);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${DAYS[d.getUTCDay()]}, ${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ` +
    `${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:` +
    `${pad(d.getUTCSeconds())} GMT`
  );
}

const STATUS_PREFIX: Record<OteEventStatus, string> = {
  scheduled: "",
  tentative: "[Tentative] ",
  cancelled: "[Cancelled] ",
  postponed: "[Postponed] ",
  rescheduled: "[Rescheduled] ",
  "moved-online": "[Moved online] ",
};

/** `2026-06-26T19:00:00` → `2026-06-26 19:00:00`; dates pass through. */
const humanize = (wallClock: string): string => wallClock.replace("T", " ");

function when(event: OteEvent): string {
  const range = event.endDate
    ? `${humanize(event.startDate)} – ${humanize(event.endDate)}`
    : humanize(event.startDate);
  return `${range} (${event.timezone})`;
}

/**
 * RSS does not model events, so dates, location and status go in the item
 * body as HTML (entity-encoded when embedded, per RSS 2.0 practice).
 */
function itemHtml(event: OteEvent): string {
  const parts: string[] = [];
  const field = (label: string, html: string) =>
    parts.push(`<p><strong>${label}:</strong> ${html}</p>`);

  if (event.status && event.status !== "scheduled") {
    field("Status", escapeXml(event.status));
  }
  field("When", escapeXml(when(event)));
  if (event.location?.venue) field("Where", escapeXml(event.location.venue));
  if (event.location?.onlineUrl) {
    const url = escapeXml(event.location.onlineUrl);
    field("Online", `<a href="${url}">${url}</a>`);
  }
  if (event.attendanceMode) field("Attendance", escapeXml(event.attendanceMode));
  if (event.description) {
    parts.push(
      `<p>${escapeXml(event.description).replace(/\r\n|\r|\n/g, "<br/>")}</p>`,
    );
  }
  // offers/cfp/eligibility/partOf have no RSS structure to hold them (accepted
  // total loss, per the spec's own mapping tables) — folded into the same
  // HTML-body pattern as `description`, as plain unlabeled paragraphs (not
  // via `field()`) so @opentechevents/export-rss's own reverse-parser
  // (parse.ts, used by the preview app) — which only recognizes the
  // Status/When/Where/Online/Attendance labels — still reads them as part of
  // the free-text description instead of silently dropping an unknown label.
  if (event.cfp) {
    const window = event.cfp.closesAt ? ` (closes ${escapeXml(event.cfp.closesAt)})` : "";
    const url = escapeXml(event.cfp.url);
    parts.push(`<p>Call for proposals: <a href="${url}">${url}</a>${window}</p>`);
  }
  if (event.eligibility) {
    const note = event.eligibility.note ? ` — ${escapeXml(event.eligibility.note)}` : "";
    parts.push(`<p>Eligibility: ${escapeXml(event.eligibility.type)}${note}</p>`);
  }
  if (event.offers && event.offers.length > 0) {
    const offerLines = event.offers.map((o) => {
      const price =
        o.price === 0 ? "Free" : o.price !== undefined && o.currency ? `${o.price} ${o.currency}` : undefined;
      return escapeXml([o.name, price, o.url].filter((part): part is string => Boolean(part)).join(" — "));
    });
    parts.push(`<p>Tickets:<br/>${offerLines.join("<br/>")}</p>`);
  }
  if (event.partOf) {
    parts.push(`<p>Part of: ${escapeXml(event.partOf.name ?? event.partOf.id)}</p>`);
  }
  return parts.join("\n");
}

function item(event: OteEvent): string[] {
  const lines = ["    <item>"];
  const prefix = event.status ? STATUS_PREFIX[event.status] : "";
  lines.push(`      <title>${escapeXml(prefix + event.name)}</title>`);
  if (event.url) lines.push(`      <link>${escapeXml(event.url)}</link>`);
  // id is a stable URI but not necessarily a fetchable page → never a permalink.
  lines.push(
    `      <guid isPermaLink="false">${escapeXml(event.id)}</guid>`,
  );
  for (const tag of event.tags ?? []) {
    lines.push(`      <category>${escapeXml(tag)}</category>`);
  }
  // RSS 2.0's <author> is specifically an email address ("email (name)");
  // without one, dc:creator (Dublin Core, name-only) is the fallback.
  const organizerWithEmail = event.organizers?.find((o) => o.email !== undefined);
  if (organizerWithEmail) {
    lines.push(
      `      <author>${escapeXml(organizerWithEmail.email!)} (${escapeXml(organizerWithEmail.name)})</author>`,
    );
  } else if (event.organizers && event.organizers.length > 0) {
    lines.push(`      <dc:creator>${escapeXml(event.organizers[0]!.name)}</dc:creator>`);
  }
  if (event.image && event.image.length > 0) {
    // media RSS module: first image only, chosen specifically over <enclosure>
    // because it can carry image[].alt without needing to infer a MIME type
    // or byte length (both required by <enclosure>, neither modeled by OTE).
    const first = event.image[0]!;
    const url = escapeXml(typeof first === "string" ? first : first.url);
    const alt = typeof first === "string" ? undefined : first.alt;
    if (alt) {
      lines.push(`      <media:content url="${url}" medium="image">`);
      lines.push(`        <media:description>${escapeXml(alt)}</media:description>`);
      lines.push("      </media:content>");
    } else {
      lines.push(`      <media:content url="${url}" medium="image" />`);
    }
  }
  lines.push(
    `      <description>${escapeXml(itemHtml(event))}</description>`,
  );
  lines.push("    </item>");
  return lines;
}

/**
 * Converts a VALID OTE Feed (v0.3) into an RSS 2.0 document, one item per
 * event. Pure and deterministic: no I/O, no clock — lastBuildDate comes from
 * the feed's updatedAt. Validate the feed first with @opentechevents/validate.
 *
 * No pubDate is emitted: OTE has no publication instant and the exporter
 * never invents data. See the package README for the mapping.
 */
export function feedToRss(feed: OteFeed): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${escapeXml(feed.title)}</title>`,
  ];
  if (feed.url) lines.push(`    <link>${escapeXml(feed.url)}</link>`);
  // <description> is required by RSS 2.0; empty when the feed has none.
  lines.push(`    <description>${escapeXml(feed.description ?? "")}</description>`);
  if (feed.textLanguage) {
    lines.push(`    <language>${escapeXml(feed.textLanguage)}</language>`);
  }
  // feed.license is optional since D029: when every event declares its own
  // license instead, there is no single channel-level copyright to state —
  // RSS's channel model has no per-item license, so <copyright> is omitted
  // rather than guessing which (or whether any single) license applies.
  if (feed.license) {
    const copyright = feed.licenseUrl ? `${feed.license} (${feed.licenseUrl})` : feed.license;
    lines.push(`    <copyright>${escapeXml(copyright)}</copyright>`);
  }
  lines.push(`    <lastBuildDate>${rfc822(feed.updatedAt)}</lastBuildDate>`);
  lines.push("    <generator>@opentechevents/export-rss</generator>");
  for (const event of feed.events) {
    lines.push(...item(event));
  }
  lines.push("  </channel>", "</rss>");
  return lines.join("\n") + "\n";
}
