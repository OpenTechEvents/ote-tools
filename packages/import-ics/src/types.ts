/**
 * Structural types for OTE v0.3 documents, as produced by this importer.
 *
 * Deliberately duplicated in each connector package instead of shared: the
 * packages are independent and the types are structural, so any valid OTE
 * document satisfies all of them. A shared types package can absorb them
 * later.
 *
 * Unlike the export packages, EVERY field here is optional: the importer
 * emits partial documents — whatever the ICS actually carried, nothing more.
 * Completing them (id, timezone when floating, …) is the caller's job.
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
  email?: string;
}

export type OteEventStatus =
  | "scheduled"
  | "tentative"
  | "cancelled"
  | "postponed"
  | "rescheduled"
  | "moved-online";

/** A partial OTE event: only the fields the ICS input actually carried. */
export interface PartialOteEvent {
  id?: string;
  url?: string;
  name?: string;
  description?: string;
  /**
   * IANA zone. For timed events, absent when the ICS time was floating or the
   * TZID not IANA. For all-day events, ALWAYS set (OTE requires timezone even
   * for all-day) via icsToEvents' allDayTimezonePolicy — see its doc comment.
   */
  timezone?: string;
  /** Wall-clock: a date (all-day) or a local date-time. Never carries an offset. */
  startDate?: string;
  /** Same form as startDate. Inclusive for all-day events. */
  endDate?: string;
  location?: OteLocation;
  tags?: string[];
  status?: OteEventStatus;
  /** RFC 7986 IMAGE, when present — rare in real-world .ics. */
  image?: string[];
  /** From ORGANIZER's CN parameter; email only when sourceVisibility is "public". */
  organizers?: OteOrganizer[];
  updatedAt?: string;
}

/**
 * One thing the import could not carry over. Warnings never block: the
 * events are still returned, with the affected field absent (a connector
 * never invents data — absent field = absent + warning).
 */
export interface ImportWarning {
  /** Index into `events` — absent when the warning is about the whole file. */
  eventIndex?: number;
  /** OTE field (dot path) the warning identifies, when it concerns one. */
  field?: string;
  message: string;
}

export interface ImportResult {
  events: PartialOteEvent[];
  warnings: ImportWarning[];
}

export interface IcsToEventsOptions {
  /**
   * OTE requires `timezone` even for all-day events, but iCalendar
   * `VALUE=DATE` (RFC 5545) structurally cannot carry one — a documented,
   * unresolved gap upstream (opentechevents-spec INTEGRATION-AUDIT.log H003).
   * Default (omitted): use the calendar's `X-WR-TIMEZONE` property when
   * present (a de facto Google/Outlook/Apple extension, not RFC 5545), else
   * `"UTC"`. Pass an explicit IANA zone to override both when you know the
   * organizer's real locale. Whichever is used, a warning is always emitted —
   * this is always an inference, never data the source actually provided.
   */
  allDayTimezonePolicy?: string;
  /**
   * Whether the source .ics is itself publicly published. ORGANIZER's email
   * (from its CN/mailto) is only imported into organizers[].email when this
   * is "public" — never guess a person's willingness to expose contact data
   * from a private or link-shared calendar. Default: "unknown" (no email).
   */
  sourceVisibility?: "public" | "private" | "unknown";
}
