import type { OteEvent } from "./types.js";

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
