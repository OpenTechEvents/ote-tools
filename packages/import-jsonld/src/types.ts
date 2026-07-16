/**
 * Structural types for OTE v0.2 documents, as produced by this importer.
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

export type OteEventStatus =
  | "scheduled"
  | "cancelled"
  | "postponed"
  | "rescheduled";

export type OteAttendanceMode = "in-person" | "online" | "hybrid";

/** A partial OTE event: only the fields the JSON-LD actually carried. */
export interface PartialOteEvent {
  id?: string;
  url?: string;
  name?: string;
  description?: string;
  /** IANA zone. Absent when the source only gave a UTC offset (not a zone). */
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
