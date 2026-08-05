/**
 * Structural types for OTE v0.3 documents, as produced by this importer.
 *
 * Deliberately duplicated in each connector package instead of shared: the
 * packages are independent and the types are structural, so any valid OTE
 * document satisfies all of them. A shared types package can absorb them
 * later.
 *
 * Every field is optional: the importer emits partial documents — whatever
 * the page's JSON-LD actually carried, nothing more. Completing them (id,
 * timezone, …) is the caller's job.
 */

export interface OteGeo {
  lat: number;
  lon: number;
}

export interface OteLocation {
  venue?: string;
  onlineUrl?: string;
  geo?: OteGeo;
}

export interface OteOrganizer {
  name: string;
  url?: string;
  email?: string;
  type?: "organization" | "person";
}

export interface OteImageEntry {
  url: string;
  alt?: string;
}

export interface OteOffer {
  name?: string;
  price?: number;
  currency?: string;
  url?: string;
  availability?: "in-stock" | "sold-out";
  opensAt?: string;
  closesAt?: string;
}

export interface OtePartOf {
  id: string;
  name?: string;
}

export type OteEventStatus =
  | "scheduled"
  | "tentative"
  | "cancelled"
  | "postponed"
  | "rescheduled"
  | "moved-online";

export type OteAttendanceMode = "in-person" | "online" | "hybrid";

/** A partial OTE event: only the fields the JSON-LD actually carried. */
export interface PartialOteEvent {
  id?: string;
  url?: string;
  name?: string;
  description?: string;
  /**
   * IANA zone. For timed events, absent when the source only gave a UTC
   * offset (not a zone). For all-day (date-only startDate) events, ALWAYS
   * set (OTE requires timezone even for all-day) via htmlToEvents'
   * allDayTimezonePolicy — see its doc comment.
   */
  timezone?: string;
  /** Wall-clock: a date (all-day) or a local date-time. Never carries an offset. */
  startDate?: string;
  /** Same form as startDate. Inclusive for all-day events. */
  endDate?: string;
  location?: OteLocation;
  attendanceMode?: OteAttendanceMode;
  languages?: string[];
  tags?: string[];
  status?: OteEventStatus;
  /** From schema.org organizer — the source is a public page, so email (when given) is imported directly. */
  organizers?: OteOrganizer[];
  /** From schema.org image; ImageObject.caption becomes alt. */
  image?: (string | OteImageEntry)[];
  /** From schema.org offers. */
  offers?: OteOffer[];
  /** From schema.org superEvent, when it carries a usable id (its own @id or url). */
  partOf?: OtePartOf;
}

/**
 * One thing the import could not carry over. Warnings never block: the
 * events are still returned, with the affected field absent (a connector
 * never invents data — absent field = absent + warning).
 */
export interface ImportWarning {
  /** Index into `events` — absent when the warning is about the whole page. */
  eventIndex?: number;
  /** OTE field (dot path) the warning identifies, when it concerns one. */
  field?: string;
  message: string;
}

export interface ImportResult {
  events: PartialOteEvent[];
  warnings: ImportWarning[];
}

export interface HtmlToEventsOptions {
  /**
   * OTE requires `timezone` even for all-day events (a date-only
   * `startDate`), but schema.org gives no timezone data at all for one —
   * there's no page-level hint to fall back to the way iCalendar has
   * X-WR-TIMEZONE (see @opentechevents/import-ics's H003 policy, which this
   * mirrors for consistency). Default: `"UTC"`, always with a warning since
   * it's always an inference. Pass a real IANA zone to override when you
   * know the event's actual locale.
   */
  allDayTimezonePolicy?: string;
}
