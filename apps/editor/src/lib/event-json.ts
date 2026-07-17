import type { FormState, OteConfig, OteEvent } from "./types.js";

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
  };
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** "18:30" → "18:30:00"; anything else is passed through for the schema to judge. */
function normalizeTime(time: string): string {
  return /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;
}

/**
 * Combines the form's date/time parts into a schema wall-clock string.
 * All-day → "YYYY-MM-DD"; timed → "YYYY-MM-DDTHH:MM:SS". A timed date
 * without a time is emitted date-only so live validation flags the mismatch
 * instead of the editor inventing a time.
 */
function wallClock(date: string, time: string, allDay: boolean): string {
  if (!date) return "";
  if (allDay || !time) return date;
  return `${date}T${normalizeTime(time)}`;
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
    description: json.description ?? "",
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
  };
}

/**
 * Filename slug suggested from name + start date, fixture style
 * ("2026-06-async"). Diacritics folded, non-alphanumerics collapsed to "-".
 */
export function suggestSlug(name: string, startDate: string): string {
  const yearMonth = /^(\d{4}-\d{2})/.exec(startDate)?.[1];
  const kebab = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!kebab) return "";
  return yearMonth ? `${yearMonth}-${kebab}` : kebab;
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
