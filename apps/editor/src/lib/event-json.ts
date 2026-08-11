import { htmlToMarkdown, looksLikeHtml } from "@opentechevents/import-ics";

import type { FormState, OteConfig, OteEvent } from "./types.js";

/** Converts to Markdown only when the value actually looks like HTML — a
 * safety net for a description read from a file written before this
 * conversion existed, or by another tool (fresh imports already convert at
 * import time, see packages/import-ics and packages/import-jsonld). */
function normalizeDescription(value: string): string {
  return looksLikeHtml(value) ? htmlToMarkdown(value) : value;
}

/** A fresh, empty form. `timezone` is injected by the caller (browser TZ). */
export function emptyFormState(timezone = ""): FormState {
  return {
    slug: "",
    id: "",
    name: "",
    description: "",
    url: "",
    tags: "",
    languages: "",
    allDay: false,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    timezone,
    status: "",
    attendanceMode: "",
    venue: "",
    onlineUrl: "",
    geoLat: "",
    geoLon: "",
    license: "",
    sourceName: "",
    sourceUrl: "",
    sourceLicense: "",
    sourceRetrievedAt: "",
    updatedAt: "",
    textLanguage: "",
    organizers: [],
    image: [],
    offers: [],
    cfpUrl: "",
    cfpOpensAt: "",
    cfpClosesAt: "",
    cfpCoversTravel: false,
    cfpCoversAccommodation: false,
    eligibilityType: "",
    eligibilityNote: "",
    eligibilityUrl: "",
    partOfId: "",
    partOfName: "",
    partOfUrl: "",
    partOfType: "",
    translations: {},
    eligibilityNoteTranslations: {},
    partOfNameTranslations: {},
  };
}

/**
 * A repeater row where every field is still "" — `translations` (present on
 * image/offer rows) counts as empty when it has no language keys, since it's
 * a map, not a string.
 */
export function isRowEmpty(row: object): boolean {
  return Object.entries(row).every(([key, v]) => {
    if (key === "translations") return Object.keys(v as object).length === 0;
    // saveLocally is a checkbox, not data — checking it alone (no url yet)
    // must not count as "this row is filled in".
    if (key === "saveLocally") return true;
    return v === "";
  });
}

/**
 * Drops "" fields from a repeater row; a required-but-empty one is left for
 * the schema to flag. `translations` is skipped here — its wire shape
 * (`{ [lang]: { alt } }` vs `{ [lang]: { name } }`) varies per field, so the
 * caller wraps and attaches it itself.
 */
export function cleanRow(row: object): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (key === "translations") continue;
    if (value !== "") out[key] = value;
  }
  return out;
}

/** Drops language entries whose value is still "", from a lang → string map. */
function cleanLangMap(map: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [lang, value] of Object.entries(map)) {
    if (value !== "") out[lang] = value;
  }
  return out;
}

/** A lang → string map, wrapped into a lang → { [wrapKey]: string } translations map. */
function wrapTranslations(
  map: Record<string, string>,
  wrapKey: string,
): Record<string, Record<string, string>> | undefined {
  const cleaned = cleanLangMap(map);
  if (Object.keys(cleaned).length === 0) return undefined;
  return Object.fromEntries(
    Object.entries(cleaned).map(([lang, value]) => [lang, { [wrapKey]: value }]),
  );
}

/** Inverse of wrapTranslations: a lang → { [wrapKey]: string } map, flattened to lang → string. */
function unwrapTranslations(
  map: Record<string, Record<string, string>> | undefined,
  wrapKey: string,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [lang, entry] of Object.entries(map ?? {})) {
    if (entry[wrapKey] !== undefined) out[lang] = entry[wrapKey];
  }
  return out;
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Combines the form's date/time parts into a schema wall-clock string.
 * All-day → "YYYY-MM-DD"; timed → "YYYY-MM-DDTHH:MM" (OTE's dateTime is
 * deliberately seconds-less: "the hour on a poster, never a technical
 * instant" — native <input type="time"> already gives HH:MM, nothing to
 * strip or pad). A timed date without a time is emitted date-only so live
 * validation flags the mismatch instead of the editor inventing a time.
 */
function wallClock(date: string, time: string, allDay: boolean): string {
  if (!date) return "";
  if (allDay || !time) return date;
  return `${date}T${time}`;
}

/** Numeric form input → number; non-numeric text is kept for the schema to reject. */
function numberOrRaw(value: string): number | string {
  const n = Number(value);
  return Number.isFinite(n) && value.trim() !== "" ? n : value;
}

/**
 * Form state → event file JSON (the shape stored in events/<slug>.json).
 * Empty inputs are omitted, never defaulted — absent means absent. No
 * specVersion and no license unless the user set one: event files inherit
 * both from the feed.
 */
export function toEventJson(state: FormState): OteEvent {
  const event: Record<string, unknown> = {};
  const set = (key: string, value: unknown) => {
    if (value !== "" && value !== undefined) event[key] = value;
  };

  set("id", state.id);
  set("url", state.url);
  set("name", state.name);
  set("description", state.description);
  set("startDate", wallClock(state.startDate, state.startTime, state.allDay));
  const end = wallClock(
    state.endDate || (state.endTime && !state.allDay ? state.startDate : ""),
    state.endTime,
    state.allDay,
  );
  set("endDate", end);
  set("timezone", state.timezone);
  set("license", state.license);

  const location: Record<string, unknown> = {};
  if (state.venue) location.venue = state.venue;
  if (state.onlineUrl) location.onlineUrl = state.onlineUrl;
  if (state.geoLat || state.geoLon) {
    location.geo = {
      lat: numberOrRaw(state.geoLat),
      lon: numberOrRaw(state.geoLon),
    };
  }
  if (Object.keys(location).length > 0) event.location = location;

  set("attendanceMode", state.attendanceMode);
  const languages = splitList(state.languages);
  if (languages.length > 0) event.languages = languages;
  const tags = splitList(state.tags);
  if (tags.length > 0) event.tags = tags;
  set("status", state.status);

  const source: Record<string, unknown> = {};
  if (state.sourceName) source.name = state.sourceName;
  if (state.sourceUrl) source.url = state.sourceUrl;
  if (state.sourceLicense) source.license = state.sourceLicense;
  if (state.sourceRetrievedAt) source.retrievedAt = state.sourceRetrievedAt;
  if (Object.keys(source).length > 0) event.source = source;

  set("updatedAt", state.updatedAt);
  set("textLanguage", state.textLanguage);

  const organizers = state.organizers
    .filter((row) => !isRowEmpty(row))
    .map((row) => cleanRow(row));
  if (organizers.length > 0) event.organizers = organizers;

  // Bare URL when there's no alt text and nothing translating it (the common
  // case, and what every 0.2 document already looks like); an object once
  // alt or a translation of it earns its keep.
  const image = state.image
    .filter((row) => !isRowEmpty(row))
    .map((row) => {
      const translations = wrapTranslations(row.translations, "alt");
      if (!row.alt && !translations) return row.url;
      const entry: Record<string, unknown> = { url: row.url };
      if (row.alt) entry.alt = row.alt;
      if (translations) entry.translations = translations;
      return entry;
    });
  if (image.length > 0) event.image = image;

  const offers = state.offers
    .filter((row) => !isRowEmpty(row))
    .map((row) => {
      const offer = cleanRow(row);
      if (row.price !== "") offer.price = numberOrRaw(row.price);
      const translations = wrapTranslations(row.translations, "name");
      if (translations) offer.translations = translations;
      return offer;
    });
  if (offers.length > 0) event.offers = offers;

  const cfp: Record<string, unknown> = {};
  if (state.cfpUrl) cfp.url = state.cfpUrl;
  if (state.cfpOpensAt) cfp.opensAt = state.cfpOpensAt;
  if (state.cfpClosesAt) cfp.closesAt = state.cfpClosesAt;
  // Unchecked stays absent rather than asserting false: "not covered" is a
  // claim the organizer hasn't necessarily made just by leaving a box empty.
  if (state.cfpCoversTravel) cfp.coversTravel = true;
  if (state.cfpCoversAccommodation) cfp.coversAccommodation = true;
  if (Object.keys(cfp).length > 0) event.cfp = cfp;

  const eligibility: Record<string, unknown> = {};
  if (state.eligibilityType) eligibility.type = state.eligibilityType;
  if (state.eligibilityNote) eligibility.note = state.eligibilityNote;
  if (state.eligibilityUrl) eligibility.url = state.eligibilityUrl;
  const eligibilityTranslations = wrapTranslations(
    state.eligibilityNoteTranslations,
    "note",
  );
  if (eligibilityTranslations) eligibility.translations = eligibilityTranslations;
  if (Object.keys(eligibility).length > 0) event.eligibility = eligibility;

  const partOf: Record<string, unknown> = {};
  if (state.partOfId) partOf.id = state.partOfId;
  if (state.partOfName) partOf.name = state.partOfName;
  if (state.partOfUrl) partOf.url = state.partOfUrl;
  if (state.partOfType) partOf.type = state.partOfType;
  const partOfTranslations = wrapTranslations(state.partOfNameTranslations, "name");
  if (partOfTranslations) partOf.translations = partOfTranslations;
  if (Object.keys(partOf).length > 0) event.partOf = partOf;

  const translations: Record<string, unknown> = {};
  for (const [lang, entry] of Object.entries(state.translations)) {
    const t: Record<string, string> = {};
    if (entry.name) t.name = entry.name;
    if (entry.description) t.description = entry.description;
    if (Object.keys(t).length > 0) translations[lang] = t;
  }
  if (Object.keys(translations).length > 0) event.translations = translations;

  return event as unknown as OteEvent;
}

function splitWallClock(value: string | undefined): {
  date: string;
  time: string;
} {
  if (!value) return { date: "", time: "" };
  const [date, time = ""] = value.split("T");
  // Native <input type="time"> wants HH:MM; drop the seconds.
  return { date, time: time.replace(/^(\d{2}:\d{2}):\d{2}$/, "$1") };
}

/**
 * Event file JSON → form state, for edit-mode prefill. Inverse of
 * toEventJson: round-trips every field the form models.
 */
export function fromEventJson(json: OteEvent, slug: string): FormState {
  const start = splitWallClock(json.startDate);
  const end = splitWallClock(json.endDate);
  return {
    slug,
    id: json.id ?? "",
    name: json.name ?? "",
    description: normalizeDescription(json.description ?? ""),
    url: json.url ?? "",
    tags: (json.tags ?? []).join(", "),
    languages: (json.languages ?? []).join(", "),
    allDay: json.startDate !== undefined && !json.startDate.includes("T"),
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
    timezone: json.timezone ?? "",
    status: json.status ?? "",
    attendanceMode: json.attendanceMode ?? "",
    venue: json.location?.venue ?? "",
    onlineUrl: json.location?.onlineUrl ?? "",
    geoLat: json.location?.geo?.lat?.toString() ?? "",
    geoLon: json.location?.geo?.lon?.toString() ?? "",
    license: json.license ?? "",
    sourceName: json.source?.name ?? "",
    sourceUrl: json.source?.url ?? "",
    sourceLicense: json.source?.license ?? "",
    sourceRetrievedAt: json.source?.retrievedAt ?? "",
    updatedAt: json.updatedAt ?? "",
    textLanguage: json.textLanguage ?? "",
    organizers: (json.organizers ?? []).map((o) => ({
      name: o.name ?? "",
      url: o.url ?? "",
      email: o.email ?? "",
      type: o.type ?? "",
    })),
    image: (json.image ?? []).map((entry) =>
      typeof entry === "string"
        ? { url: entry, alt: "", saveLocally: "", translations: {} }
        : {
            url: entry.url,
            alt: entry.alt ?? "",
            saveLocally: "",
            translations: unwrapTranslations(entry.translations, "alt"),
          },
    ),
    offers: (json.offers ?? []).map((o) => ({
      name: o.name ?? "",
      price: o.price !== undefined ? String(o.price) : "",
      currency: o.currency ?? "",
      url: o.url ?? "",
      availability: o.availability ?? "",
      waitlistUrl: o.waitlistUrl ?? "",
      opensAt: o.opensAt ?? "",
      closesAt: o.closesAt ?? "",
      translations: unwrapTranslations(o.translations, "name"),
    })),
    cfpUrl: json.cfp?.url ?? "",
    cfpOpensAt: json.cfp?.opensAt ?? "",
    cfpClosesAt: json.cfp?.closesAt ?? "",
    cfpCoversTravel: json.cfp?.coversTravel === true,
    cfpCoversAccommodation: json.cfp?.coversAccommodation === true,
    eligibilityType: json.eligibility?.type ?? "",
    eligibilityNote: json.eligibility?.note ?? "",
    eligibilityUrl: json.eligibility?.url ?? "",
    partOfId: json.partOf?.id ?? "",
    partOfName: json.partOf?.name ?? "",
    partOfUrl: json.partOf?.url ?? "",
    partOfType: json.partOf?.type ?? "",
    translations: Object.fromEntries(
      Object.entries(json.translations ?? {}).map(([lang, entry]) => [
        lang,
        { name: entry.name ?? "", description: normalizeDescription(entry.description ?? "") },
      ]),
    ),
    eligibilityNoteTranslations: unwrapTranslations(
      json.eligibility?.translations,
      "note",
    ),
    partOfNameTranslations: unwrapTranslations(json.partOf?.translations, "name"),
  };
}

function kebabCase(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Filename slug suggested from name + start date, fixture style
 * ("2026-06-async"). Diacritics folded, non-alphanumerics collapsed to "-".
 * Month-level granularity only — fine for a single event a human reviews
 * before submitting; NOT unique enough for a batch of same-named
 * occurrences in the same month (see suggestSeriesSlug).
 */
export function suggestSlug(name: string, startDate: string): string {
  const yearMonth = /^(\d{4}-\d{2})/.exec(startDate)?.[1];
  const kebab = kebabCase(name);
  if (!kebab) return "";
  return yearMonth ? `${yearMonth}-${kebab}` : kebab;
}

/**
 * Filename slug for one occurrence of a generated recurring series
 * ("2026-06-13-weekly-meetup") — day-level, unlike suggestSlug's
 * month-level granularity. A weekly (or more frequent) series sharing one
 * name would otherwise collide every time two occurrences land in the same
 * month, and nobody reviews each occurrence individually to catch it
 * (batch submission proposes all of them as one issue, unreviewed — see
 * apps/editor/CLAUDE.md).
 */
export function suggestSeriesSlug(name: string, date: string): string {
  const kebab = kebabCase(name);
  return kebab ? `${date}-${kebab}` : date;
}

/**
 * Default event id: a URI under the publisher's domain. Prefers the feed's
 * canonical URL from ote.config.json; falls back to the fork's Pages URL.
 * Always editable — the suggestion is a convenience, not a rule.
 */
export function suggestId(
  config: OteConfig | null,
  repo: string | null,
  slug: string,
): string {
  if (!slug) return "";
  const feedUrl = config?.feed?.url?.replace(/\/+$/, "");
  if (feedUrl) return `${feedUrl}/events/${slug}`;
  if (repo === null) return `https://opentechevents.org/events/${slug}`;
  const [owner, name] = repo.split("/");
  return `https://${owner}.github.io/${name}/events/${slug}`;
}
