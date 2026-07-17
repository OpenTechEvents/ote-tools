/**
 * Import-screen logic, shared by every importer (ICS, JSON-LD): which
 * detected events are preselected, how they are labelled, and which form
 * fields the source did not carry (so the form can mark them instead of
 * pretending the conversion was lossless).
 * Pure functions; the dialog DOM lives in main.ts.
 */

import { fromEventJson } from "./event-json.js";
import { FIELD_REGISTRY } from "./presets.js";
import type { FormState, OteEvent } from "./types.js";

/**
 * What every importer hands the editor: a partial OTE event and warnings
 * identifying what could not be carried over. Structural supertypes of the
 * outputs of @opentechevents/import-ics and @opentechevents/import-jsonld,
 * so the queue and the form prefill are importer-agnostic.
 */
export interface ImportedEvent {
  id?: string;
  url?: string;
  name?: string;
  description?: string;
  timezone?: string;
  startDate?: string;
  endDate?: string;
  location?: { venue?: string; onlineUrl?: string; geo?: { lat: number; lon: number } };
  attendanceMode?: string;
  languages?: string[];
  tags?: string[];
  status?: string;
  updatedAt?: string;
}

export interface ImportedWarning {
  eventIndex?: number;
  field?: string;
  message: string;
}

/**
 * Future = still relevant to import: the event's last day (endDate, else
 * startDate) is today or later. Undated events are never preselected — the
 * organizer must look at them.
 */
export function isFutureEvent(event: ImportedEvent, todayIso: string): boolean {
  const last = event.endDate ?? event.startDate;
  if (!last) return false;
  return last.slice(0, 10) >= todayIso.slice(0, 10);
}

/** List label, combobox style: "2026-07-26 — Rust Madrid July". */
export function importedEventLabel(event: ImportedEvent): string {
  const day = event.startDate?.split("T")[0] ?? "(no date)";
  return `${day} — ${event.name ?? "(unnamed event)"}`;
}

/**
 * Form field ids the imported event does NOT cover — the fields the form
 * marks visually after prefill. `slug` and `allDay` are the editor's own
 * (derived, not data), so they are never marked.
 */
export function missingFormFields(event: ImportedEvent): Set<string> {
  const present = new Set<string>();
  const has = (field: string, value: unknown) => {
    if (value !== undefined) present.add(field);
  };
  has("name", event.name);
  has("description", event.description);
  has("url", event.url);
  has("tags", event.tags);
  has("startDate", event.startDate);
  has("endDate", event.endDate);
  has("timezone", event.timezone);
  has("status", event.status);
  has("venue", event.location?.venue);
  has("onlineUrl", event.location?.onlineUrl);
  has("geo", event.location?.geo);
  has("attendanceMode", event.attendanceMode);
  has("languages", event.languages);
  has("updatedAt", event.updatedAt);
  // id and source: no importer carries them — id must be minted by the
  // organizer, provenance is the importing tool's to fill (see the
  // import-ics / import-jsonld READMEs), so they are legitimately marked as
  // gaps for the user to complete.
  // license is different: it inherits from the feed's ote.config.json and is
  // NOT a per-event field. An import not carrying it is not a gap — marking
  // it would tell the user to fill something that should stay empty — so it
  // is skipped, exactly like the editor's own derived fields (slug, allDay).
  const NOT_A_GAP = new Set(["slug", "allDay", "license"]);

  const missing = new Set<string>();
  for (const def of FIELD_REGISTRY) {
    if (NOT_A_GAP.has(def.id)) continue;
    if (!present.has(def.id)) missing.add(def.id);
  }
  return missing;
}

/**
 * Imported event → form state. Reuses the edit-mode prefill; the slug stays
 * empty so the editor's auto-suggestion (from name + date) kicks in. Nothing
 * is defaulted — a missing timezone stays empty for the organizer to set.
 */
export function importedToFormState(event: ImportedEvent): FormState {
  // Structurally safe: fromEventJson reads every field through `?? ""`.
  return fromEventJson(event as unknown as OteEvent, "");
}

/**
 * Newest first, undated events last: the import list leads with what the
 * organizer most likely wants to publish next.
 */
export function compareByStartDateDesc(
  a: ImportedEvent,
  b: ImportedEvent,
): number {
  return (b.startDate ?? "").localeCompare(a.startDate ?? "");
}

/**
 * One event in the import queue, with everything needed to leave and come
 * back to it: the raw imported event, its importer warnings, the form state
 * as last edited (null = never opened), and the submission bookkeeping.
 */
export interface ImportQueueItem {
  event: ImportedEvent;
  warnings: ImportedWarning[];
  state: FormState | null;
  /** Field ids still marked "not in the ICS" (Set serialized as array). */
  missing: string[];
  slugDirty: boolean;
  idDirty: boolean;
  /** "Open GitHub issue" was pressed for this event. */
  submitted: boolean;
  /** The event id at submit time, for the "check the feed" lookup. */
  submittedId: string | null;
}

export interface ImportQueue {
  pos: number;
  sourceUrl: string | null;
  retrievedAt: string;
  /** Which importer produced the queue ("ics" | "page"); null = unknown. */
  kind?: string | null;
  items: ImportQueueItem[];
}

/** Creates a queue item for a freshly detected event (form not opened yet). */
export function newQueueItem(
  event: ImportedEvent,
  warnings: ImportedWarning[],
): ImportQueueItem {
  return {
    event,
    warnings,
    state: null,
    missing: [],
    slugDirty: false,
    idDirty: false,
    submitted: false,
    submittedId: null,
  };
}

/** localStorage key for the pending import queue, one per target repo. */
export function importQueueKey(repo: string): string {
  return `ote-editor:import-queue:${repo}`;
}

export function encodeImportQueue(queue: ImportQueue): string {
  return JSON.stringify(queue);
}

/**
 * Parses a stored queue back. Lenient only about being our own write: any
 * unexpected shape (older version, corrupted entry) yields null and the
 * caller starts clean instead of crashing on garbage state.
 */
export function decodeImportQueue(raw: string | null): ImportQueue | null {
  if (raw === null) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const queue = parsed as ImportQueue;
  if (typeof queue.pos !== "number" || !Array.isArray(queue.items)) return null;
  if (queue.items.length === 0) return null;
  for (const item of queue.items) {
    if (typeof item !== "object" || item === null) return null;
    if (typeof item.event !== "object" || item.event === null) return null;
    if (!Array.isArray(item.missing) || !Array.isArray(item.warnings)) {
      return null;
    }
  }
  return queue;
}

/**
 * Whether the form holds anything a user could regret losing. Auto-derived
 * fields don't count: slug/id are suggestions and timezone defaults to the
 * browser's — a form where only those are set is still "empty".
 */
export function formHasContent(state: FormState): boolean {
  const auto = new Set(["slug", "id", "timezone"]);
  return Object.entries(state).some(
    ([key, value]) => typeof value === "string" && value !== "" && !auto.has(key),
  );
}

/** Hostname suffix → platform display name, for source provenance. */
const PLATFORMS: ReadonlyArray<[RegExp, string]> = [
  [/(^|\.)meetup\.com$/, "Meetup"],
  [/(^|\.)(luma\.com|lu\.ma)$/, "Luma"],
  [/(^|\.)eventbrite\.[a-z.]+$/, "Eventbrite"],
  [/(^|\.)guild\.host$/, "guild.host"],
  [/^calendar\.google\.com$/, "Google Calendar"],
];

/**
 * Platform name for the source metadata (`source.name`), derived from the
 * URL the data came from — the fetched URL when there was one, else the
 * event's own url. Unknown platforms fall back to the bare hostname (still
 * a fact, not a guess); null when there is no URL at all.
 */
export function sourceNameFor(url: string | null | undefined): string | null {
  if (!url) return null;
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  for (const [pattern, name] of PLATFORMS) {
    if (pattern.test(host)) return name;
  }
  return host.replace(/^www\./, "");
}

/** Whether a published feed.json already contains an event with this id. */
export function feedHasEventId(feed: unknown, id: string): boolean {
  if (typeof feed !== "object" || feed === null) return false;
  const events = (feed as { events?: unknown }).events;
  if (!Array.isArray(events)) return false;
  return events.some(
    (e) =>
      typeof e === "object" &&
      e !== null &&
      (e as { id?: unknown }).id === id,
  );
}
