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
    textLanguage?: string;
    /** A list — replaces, never merges with, each event's own organizers. */
    organizers?: OrganizerRow[];
    /** Translates feed title/description only — never edited by this app, but kept on the type so it round-trips untouched. */
    translations?: Record<string, { title?: string; description?: string }>;
  };
  profile?: string;
  /** @deprecated read-only synonym for customProfiles.custom; new saves write customProfiles instead. */
  customProfile?: { fields?: string[] };
  /** Named custom profiles. A name matching a builtin (meetup/conference/all) overrides it. */
  customProfiles?: Record<string, { fields?: string[] }>;
}

/** One row of the `organizers` repeater. "" means "not filled in". */
export interface OrganizerRow {
  name: string;
  url: string;
  email: string;
  type: string;
}

/**
 * One row of the `image` repeater. "" means "not filled in". `translations`
 * is keyed by BCP 47 tag → this image's `alt` in that language; only
 * meaningful once `alt` itself is set (schema: dependentRequired).
 *
 * `saveLocally` ("true"/"") is editor-only UI state: it never appears in
 * the published event (event-json.ts's toEventJson deliberately excludes
 * it). It only affects the "Proponer cambio" issue body — see links.ts.
 */
export interface ImageRow {
  url: string;
  alt: string;
  saveLocally: string;
  translations: Record<string, string>;
}

/**
 * One row of the `offers` repeater. "" means "not filled in". `translations`
 * is keyed by BCP 47 tag → this offer's `name` in that language.
 */
export interface OfferRow {
  name: string;
  price: string;
  currency: string;
  url: string;
  availability: string;
  waitlistUrl: string;
  opensAt: string;
  closesAt: string;
  translations: Record<string, string>;
}

/**
 * Mostly a flat, all-string form model: "" means "not filled in" and is
 * omitted from the generated event JSON. Dates and times are kept apart so
 * the form can use native date/time inputs; tags and languages are
 * comma-separated. Exceptions: the three genuinely-repeatable spec fields
 * (organizers/image/offers) are arrays of row objects, and `translations`/
 * `eligibilityNoteTranslations`/`partOfNameTranslations` are language-keyed
 * maps — both still "" = unset at the leaf, coerced in toEventJson like
 * every other field.
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
  /** BCP 47 tag → { name?, description? } in that language. */
  translations: Record<string, { name: string; description: string }>;
  /** BCP 47 tag → eligibility.note in that language. */
  eligibilityNoteTranslations: Record<string, string>;
  /** BCP 47 tag → partOf.name in that language. */
  partOfNameTranslations: Record<string, string>;
}

/** An event as listed from the target repo, with the filename-derived slug. */
export interface ListedEvent {
  /** events/<slug>.json; null when the slug could not be derived (feed fallback). */
  slug: string | null;
  event: OteEvent;
}
