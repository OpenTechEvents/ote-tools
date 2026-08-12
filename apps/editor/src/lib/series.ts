import { sortedEvents } from "@opentechevents/preview-feed";
import type { PreviewEvent } from "@opentechevents/preview-feed";

import { fromEventJson, toEventJson } from "./event-json.js";
import type { FormState, ListedEvent, OteEvent } from "./types.js";

/**
 * Known series identity, distilled from an already-loaded event's
 * `partOf` — same 3 fields the "link to a series" dialog needs to show
 * a pickable option and to prefill the create/edit form.
 */
export interface SeriesOption {
  id: string;
  name: string;
  url: string;
}

/**
 * Distinct `partOf` identities already used across a set of loaded
 * events — the "known series" list the search screen offers instead of
 * making the organizer retype an id they minted a month ago.
 * `multipart` entries are excluded: this is only ever surfaced from
 * "Add recurrence", which generates rule-based occurrences and has no
 * legitimate reason to link into a multipart identity. `type` defaults
 * to "series" when absent, matching the schema's own default.
 */
export function collectKnownSeries(events: readonly OteEvent[]): SeriesOption[] {
  const byId = new Map<string, SeriesOption>();
  for (const event of events) {
    const partOf = event.partOf;
    if (!partOf?.id) continue;
    if ((partOf.type ?? "series") !== "series") continue;
    if (byId.has(partOf.id)) continue;
    byId.set(partOf.id, { id: partOf.id, name: partOf.name ?? partOf.id, url: partOf.url ?? "" });
  }
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Every loaded entry sharing one `partOf.id` — unlike collectKnownSeries
 * this is edit infrastructure, not a picker lookup, so it includes
 * multipart identities too and returns the full ListedEvent (slug + event),
 * not just the {id,name,url} identity. Ordered with the same sortedEvents
 * comparator apps/embed's own grouping.ts uses (soonest-future-first, else
 * most-recent-past-first), so "N of M" numbering here agrees with what the
 * organizer already saw in the widget's own modal counter.
 */
export function collectSeriesMembers(
  listed: readonly ListedEvent[],
  partOfId: string,
): ListedEvent[] {
  const members = listed.filter((entry) => entry.event.partOf?.id === partOfId);
  // sortedEvents wants PreviewEvent's shape (a string `location`, unlike
  // OteEvent's nested one) — a minimal proxy carrying just what the
  // comparator reads (name/startDate) satisfies it without a real
  // OteEvent → PreviewEvent conversion, while still reusing the exact same
  // comparator apps/embed's grouping.ts calls.
  const proxies: PreviewEvent[] = members.map((entry) => ({
    name: entry.event.name ?? "",
    startDate: entry.event.startDate,
  }));
  const byProxy = new Map(proxies.map((proxy, index) => [proxy, members[index]!]));
  return sortedEvents(proxies).map((proxy) => byProxy.get(proxy)!);
}

/**
 * Identity/schedule fields — never part of a bulk-edit diff, even if the
 * shared template form shows an edited value for one. Mirrors
 * duplicateEvent()'s own per-occurrence/shareable split (main.ts), plus
 * `partOfId`: it's the grouping key the whole operation is scoped by, so
 * editing it in a "shared template" is a different, confusing operation
 * (moving every selected occurrence into another series) that deserves its
 * own explicit flow, not a side effect of a text field.
 */
export const BULK_EDIT_EXCLUDED_FIELDS: ReadonlySet<keyof FormState> = new Set([
  "slug",
  "id",
  "startDate",
  "startTime",
  "endDate",
  "endTime",
  "status",
  "updatedAt",
  "partOfId",
]);

/** Fields whose value is an array/map, not a scalar — `!==` always reports
 * "changed" for these (different references), so they need a structural
 * comparison instead. Plain JSON.stringify is enough: every value here is
 * already JSON-serializable form data, no functions/dates/cycles. */
const STRUCTURAL_FIELDS: ReadonlySet<keyof FormState> = new Set([
  "organizers",
  "image",
  "offers",
  "translations",
  "eligibilityNoteTranslations",
  "partOfNameTranslations",
]);

function fieldsDiffer(key: keyof FormState, a: unknown, b: unknown): boolean {
  return STRUCTURAL_FIELDS.has(key) ? JSON.stringify(a) !== JSON.stringify(b) : a !== b;
}

/**
 * A synthetic "shared template" draft for the bulk-edit form: seeded from
 * one representative occurrence (the group's header), with identity/
 * schedule fields blanked — editing them here has no effect (see
 * BULK_EDIT_EXCLUDED_FIELDS), so blanking avoids implying otherwise.
 * `sourceRetrievedAt` is deliberately NOT cleared, matching
 * duplicateEvent()'s own precedent.
 */
export function buildBulkEditTemplate(header: ListedEvent): FormState {
  const state = fromEventJson(header.event, "");
  state.id = "";
  state.startDate = "";
  state.startTime = "";
  state.endDate = "";
  state.endTime = "";
  state.status = "";
  state.updatedAt = "";
  return state;
}

/**
 * Every field in `after` that differs from `before` and isn't excluded —
 * the "what did the organizer actually change" signal for the bulk-edit
 * form, replacing a manual per-field checkbox with a real diff against the
 * template's own initial snapshot (the same before/after pair the existing
 * Reset button already keeps, loadedSnapshot vs state).
 */
export function diffFormState(before: FormState, after: FormState): Partial<FormState> {
  const patch: Partial<FormState> = {};
  for (const key of Object.keys(after) as (keyof FormState)[]) {
    if (BULK_EDIT_EXCLUDED_FIELDS.has(key)) continue;
    if (fieldsDiffer(key, before[key], after[key])) {
      (patch as Record<string, unknown>)[key] = after[key];
    }
  }
  return patch;
}

export interface BulkEditEntry {
  slug: string | null;
  event: OteEvent;
  /** Field keys that actually differ from this event's own prior value —
   * for the issue body's summary line only. */
  changedFields: string[];
  /** Top-level OteEvent keys that actually differ, `toEventJson`-shape —
   * what actually goes on the wire for patch-mode issues (see
   * `patchIssueBody`). `null` marks a key removed entirely. */
  patch: Record<string, unknown>;
}

/**
 * Top-level structural diff between two `OteEvent`s: a key present in
 * `after` with a different (JSON.stringify-compared) value is included with
 * its new value; a key present in `before` but absent from `after` is
 * included as `null` (delete signal, matching issue-to-pr.mjs's patch-mode
 * merge). `id` is always excluded — identity never belongs in a patch.
 */
export function diffEventJson(before: OteEvent, after: OteEvent): Record<string, unknown> {
  const beforeRecord = before as unknown as Record<string, unknown>;
  const afterRecord = after as unknown as Record<string, unknown>;
  const keys = new Set([...Object.keys(beforeRecord), ...Object.keys(afterRecord)]);
  keys.delete("id");
  const patch: Record<string, unknown> = {};
  for (const key of keys) {
    if (JSON.stringify(beforeRecord[key]) === JSON.stringify(afterRecord[key])) continue;
    patch[key] = key in afterRecord ? afterRecord[key] : null;
  }
  return patch;
}

export interface OccurrenceOverride {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
}

/**
 * Applies `sharedPatch` (from diffFormState) plus each member's own
 * `overrides` entry (start/end date/time and all-day, keyed by slug) onto
 * that member's own current document — round-tripped through
 * fromEventJson/toEventJson so nested-object writes reuse the exact same
 * serialization the single-event form relies on. A per-row override wins
 * over the shared template for that field. Unlike start/end date/time,
 * `allDay` isn't in `BULK_EDIT_EXCLUDED_FIELDS` — a uniform "All day event"
 * toggle in the shared template is still a meaningful bulk edit on its own,
 * so it can be set both ways: for the whole selection via the shared
 * template, or per occurrence via a row's own override.
 *
 * A member is dropped entirely when nothing actually changed for it
 * specifically (its own value already matched every patched field) —
 * never propose a no-op file.
 */
export function applyBulkEdit(
  members: readonly ListedEvent[],
  sharedPatch: Partial<FormState>,
  overrides: ReadonlyMap<string, OccurrenceOverride>,
): BulkEditEntry[] {
  const sharedKeys = Object.keys(sharedPatch) as (keyof FormState)[];
  const OVERRIDE_KEYS: (keyof FormState)[] = ["startDate", "startTime", "endDate", "endTime", "allDay"];
  const entries: BulkEditEntry[] = [];
  for (const member of members) {
    const before = fromEventJson(member.event, member.slug ?? "");
    const after: FormState = { ...before, ...sharedPatch };
    const override = member.slug !== null ? overrides.get(member.slug) : undefined;
    if (override) {
      after.startDate = override.startDate;
      after.startTime = override.startTime;
      after.endDate = override.endDate;
      after.endTime = override.endTime;
      after.allDay = override.allDay;
    }
    const candidateKeys: (keyof FormState)[] = override
      ? [...new Set([...sharedKeys, ...OVERRIDE_KEYS])]
      : sharedKeys;
    const changedFields = candidateKeys.filter((key) => fieldsDiffer(key, before[key], after[key]));
    const afterEvent = toEventJson(after);
    const patch = diffEventJson(toEventJson(before), afterEvent);
    if (Object.keys(patch).length === 0) continue;
    entries.push({ slug: member.slug, event: afterEvent, changedFields, patch });
  }
  return entries;
}
