import type { OteConfig } from "./types.js";

/** Form sections, in render order. */
export const SECTIONS = [
  "basics",
  "when",
  "where",
  "identity",
  "advanced",
] as const;

export type SectionId = (typeof SECTIONS)[number];

export interface FieldDef {
  id: string;
  section: SectionId;
  /** Required by the OTE schema (or by the write flow, for slug/id). */
  required?: boolean;
}

/**
 * Registry of every field the editor can render, keyed by id. Presets and
 * customProfile select from this list; it is the extension point when the
 * schema grows (CFP, sponsors…).
 */
export const FIELD_REGISTRY: readonly FieldDef[] = [
  { id: "name", section: "basics", required: true },
  { id: "description", section: "basics" },
  { id: "url", section: "basics" },
  { id: "tags", section: "basics" },
  { id: "languages", section: "basics" },
  { id: "allDay", section: "when" },
  { id: "startDate", section: "when", required: true },
  { id: "endDate", section: "when" },
  { id: "timezone", section: "when", required: true },
  { id: "status", section: "when" },
  { id: "attendanceMode", section: "where" },
  { id: "venue", section: "where" },
  { id: "onlineUrl", section: "where" },
  { id: "geo", section: "where" },
  { id: "slug", section: "identity", required: true },
  { id: "id", section: "identity", required: true },
  { id: "license", section: "advanced" },
  { id: "source", section: "advanced" },
  { id: "updatedAt", section: "advanced" },
] as const;

/**
 * Fields every profile gets regardless of preset or customProfile: without
 * them no valid event file can be produced (schema-required fields plus the
 * filename and the endDate that startDate's form constrains).
 */
const CORE_FIELDS = [
  "name",
  "allDay",
  "startDate",
  "endDate",
  "timezone",
  "slug",
  "id",
] as const;

const PRESET_EXCLUSIONS: Record<string, ReadonlySet<string>> = {
  // Meetups: recurring, simple events — no cancellation workflow, no
  // coordinates, no data-provenance metadata.
  meetup: new Set(["status", "geo", "license", "source", "updatedAt"]),
  // Conferences add status (cancelled/postponed matters) and geo, but still
  // hide the provenance metadata.
  conference: new Set(["license", "source", "updatedAt"]),
  all: new Set(),
};

export interface ResolvedProfile {
  /** Preset the resolution is based on ("custom" when customProfile won). */
  preset: string;
  fields: ReadonlySet<string>;
  /** Sections rendered collapsed ("Advanced: …" in the "all" preset). */
  collapsedSections: ReadonlySet<SectionId>;
  /** Non-fatal config problems to surface in the UI. */
  warnings: string[];
}

const KNOWN_IDS = new Set(FIELD_REGISTRY.map((f) => f.id));

/**
 * Resolves which form fields the editor shows for a given ote.config.json.
 *
 * - `customProfile.fields` wins over `profile`: core fields + the listed ids.
 *   Unknown ids (e.g. "cfp", not in schema v0.2) are skipped with a warning.
 * - Otherwise `profile` picks a preset; unknown/missing profile falls back to
 *   "all" with a warning (show everything rather than silently hide fields).
 * - "all" renders the advanced section collapsed.
 */
export function resolveProfile(config: OteConfig | null): ResolvedProfile {
  const warnings: string[] = [];

  const customFields = config?.customProfile?.fields;
  if (Array.isArray(customFields)) {
    const fields = new Set<string>(CORE_FIELDS);
    for (const id of customFields) {
      if (KNOWN_IDS.has(id)) {
        fields.add(id);
      } else {
        warnings.push(
          `customProfile field "${id}" is not supported by this editor (schema v0.2) and was ignored`,
        );
      }
    }
    return { preset: "custom", fields, collapsedSections: new Set(), warnings };
  }

  let preset = config?.profile;
  if (preset === undefined) {
    if (config !== null) {
      warnings.push('no "profile" in ote.config.json, showing all fields');
    }
    preset = "all";
  } else if (!(preset in PRESET_EXCLUSIONS)) {
    warnings.push(`unknown profile "${preset}", showing all fields`);
    preset = "all";
  }

  const excluded = PRESET_EXCLUSIONS[preset];
  const fields = new Set<string>();
  for (const def of FIELD_REGISTRY) {
    if (!excluded.has(def.id)) fields.add(def.id);
  }
  const collapsedSections = new Set<SectionId>(
    preset === "all" ? ["advanced" as const] : [],
  );
  return { preset, fields, collapsedSections, warnings };
}
