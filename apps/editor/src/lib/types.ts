import type { OteEvent } from "@opentechevents/build-feed";

export type { OteEvent } from "@opentechevents/build-feed";

/** Editor presets, per DESIGN.md ("Configuración: ote.config.json"). */
export type OteProfile = "meetup" | "conference" | "all";

/**
 * Structural shape of ote.config.json as the editor consumes it. Everything
 * is optional: a missing or partial config degrades to warnings, never to a
 * crash (convention: absent field = absent + warning).
 */
export interface OteConfig {
  feed?: {
    title?: string;
    description?: string;
    url?: string;
    license?: string;
    licenseUrl?: string;
  };
  profile?: string;
  customProfile?: { fields?: string[] };
}

/** One row of the `organizers` repeater. "" means "not filled in". */
export interface OrganizerRow {
  name: string;
  url: string;
  email: string;
  type: string;
}

/** One row of the `image` repeater. "" means "not filled in". */
export interface ImageRow {
  url: string;
  alt: string;
}

/** One row of the `offers` repeater. "" means "not filled in". */
export interface OfferRow {
  name: string;
  price: string;
  currency: string;
  url: string;
  availability: string;
  waitlistUrl: string;
  opensAt: string;
  closesAt: string;
}

/**
 * Mostly a flat, all-string form model: "" means "not filled in" and is
 * omitted from the generated event JSON. Dates and times are kept apart so
 * the form can use native date/time inputs; tags and languages are
 * comma-separated. The three genuinely-repeatable v0.3 fields
 * (organizers/image/offers) are the exception — arrays of row objects,
 * still "" = unset within each row, coerced in toEventJson like every other
 * field.
 */
export interface FormState {
  slug: string;
  id: string;
  name: string;
  description: string;
  url: string;
  tags: string;
  languages: string;
  allDay: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  status: string;
  attendanceMode: string;
  venue: string;
  onlineUrl: string;
  geoLat: string;
  geoLon: string;
  license: string;
  sourceName: string;
  sourceUrl: string;
  sourceLicense: string;
  sourceRetrievedAt: string;
  updatedAt: string;
  textLanguage: string;
  organizers: OrganizerRow[];
  image: ImageRow[];
  offers: OfferRow[];
  cfpUrl: string;
  cfpOpensAt: string;
  cfpClosesAt: string;
  cfpCoversTravel: boolean;
  cfpCoversAccommodation: boolean;
  eligibilityType: string;
  eligibilityNote: string;
  eligibilityUrl: string;
  partOfId: string;
  partOfName: string;
  partOfUrl: string;
  partOfType: string;
}

/** An event as listed from the target repo, with the filename-derived slug. */
export interface ListedEvent {
  /** events/<slug>.json; null when the slug could not be derived (feed fallback). */
  slug: string | null;
  event: OteEvent;
}
