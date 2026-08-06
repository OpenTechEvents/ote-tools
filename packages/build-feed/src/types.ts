/**
 * Structural types for OTE v0.3 documents, as consumed by this builder.
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

export interface OteOrganizer {
  name: string;
  url?: string;
  email?: string;
  type?: "organization" | "person";
}

export interface OteImageEntry {
  url: string;
  alt?: string;
  /** This image's alt text in other languages, keyed by BCP 47 tag. */
  translations?: Record<string, { alt: string }>;
}

export interface OteOffer {
  name?: string;
  price?: number;
  currency?: string;
  url?: string;
  availability?: "in-stock" | "sold-out";
  waitlistUrl?: string;
  opensAt?: string;
  closesAt?: string;
  /** This offer's name in other languages, keyed by BCP 47 tag. */
  translations?: Record<string, { name: string }>;
}

export interface OteCfp {
  url: string;
  opensAt?: string;
  closesAt?: string;
  coversTravel?: boolean;
  coversAccommodation?: boolean;
}

export interface OteEligibility {
  type: "open" | "members-only" | "approval-required" | "restricted";
  note?: string;
  url?: string;
  /** The note in other languages, keyed by BCP 47 tag. */
  translations?: Record<string, { note: string }>;
}

export interface OtePartOf {
  id: string;
  name?: string;
  url?: string;
  type?: "series" | "multipart";
  /** The series' display name in other languages, keyed by BCP 47 tag. */
  translations?: Record<string, { name: string }>;
}

export type OteEventStatus =
  | "scheduled"
  | "tentative"
  | "cancelled"
  | "postponed"
  | "rescheduled"
  | "moved-online";

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
  /** Language this document's own text (name/description) is written in. */
  textLanguage?: string;
  tags?: string[];
  status?: OteEventStatus;
  source?: OteSource;
  organizers?: OteOrganizer[];
  image?: (string | OteImageEntry)[];
  offers?: OteOffer[];
  cfp?: OteCfp;
  eligibility?: OteEligibility;
  partOf?: OtePartOf;
  updatedAt?: string;
  /** This event's own free text (name/description) in other languages, keyed by BCP 47 tag. */
  translations?: Record<string, { name?: string; description?: string }>;
}

export interface OteFeed {
  specVersion: string;
  title: string;
  description?: string;
  url?: string;
  /** Optional per D029: if absent, every event must declare its own license. */
  license?: string;
  licenseUrl?: string;
  textLanguage?: string;
  organizers?: OteOrganizer[];
  /** Translates feed title/description only — never inherited by events. */
  translations?: Record<string, { title?: string; description?: string }>;
  updatedAt: string;
  events: OteEvent[];
}

/** The `feed` block of ote.config.json: the feed's own metadata. */
export interface OteFeedConfig {
  title: string;
  description?: string;
  url?: string;
  /** Optional per D029: if absent, every event must declare its own license. */
  license?: string;
  licenseUrl?: string;
  textLanguage?: string;
  /** A list — replaces, never merges with, each event's own organizers. */
  organizers?: OteOrganizer[];
  /** Translates feed title/description only — never inherited by events. */
  translations?: Record<string, { title?: string; description?: string }>;
}
