/**
 * Structural types for OTE v0.2 documents, as consumed by this builder.
 *
 * Deliberately duplicated in each connector package instead of shared: the
 * packages are independent connectors and the types are structural, so any
 * valid OTE feed satisfies all of them. A shared types package can absorb
 * them later.
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

export interface OteSource {
  name: string;
  url?: string;
  license?: string;
  retrievedAt?: string;
}

export type OteEventStatus =
  | "scheduled"
  | "cancelled"
  | "postponed"
  | "rescheduled";

export type OteAttendanceMode = "in-person" | "online" | "hybrid";

export interface OteEvent {
  specVersion?: string;
  id: string;
  url?: string;
  name: string;
  description?: string;
  timezone: string;
  /** Wall-clock: a date (all-day) or a local date-time. Never carries an offset. */
  startDate: string;
  /** Same form as startDate. Inclusive for all-day events. */
  endDate?: string;
  license?: string;
  location?: OteLocation;
  attendanceMode?: OteAttendanceMode;
  languages?: string[];
  tags?: string[];
  status?: OteEventStatus;
  source?: OteSource;
  updatedAt?: string;
}

export interface OteFeed {
  specVersion: string;
  title: string;
  description?: string;
  url?: string;
  license: string;
  licenseUrl?: string;
  updatedAt: string;
  events: OteEvent[];
}

/** The `feed` block of ote.config.json: the feed's own metadata. */
export interface OteFeedConfig {
  title: string;
  description?: string;
  url?: string;
  license: string;
  licenseUrl?: string;
}
