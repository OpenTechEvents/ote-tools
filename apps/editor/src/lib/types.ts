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

/**
 * Flat, all-string form model. "" means "not filled in" and is omitted from
 * the generated event JSON. Dates and times are kept apart so the form can
 * use native date/time inputs; tags and languages are comma-separated.
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
}

/** An event as listed from the target repo, with the filename-derived slug. */
export interface ListedEvent {
  /** events/<slug>.json; null when the slug could not be derived (feed fallback). */
  slug: string | null;
  event: OteEvent;
}
