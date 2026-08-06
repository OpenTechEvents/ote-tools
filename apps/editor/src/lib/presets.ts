import type { OteConfig } from "./types.js";

/** Form sections, in render order — grouped by what an organizer is
 * answering ("what", "when", "where", "who"…), not by schema shape. */
export const SECTIONS = [
  "what",
  "when",
  "where",
  "who",
  "tickets",
  "cfp",
  "translations",
  "metadata",
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
  { id: "name", section: "what", required: true },
  { id: "description", section: "what" },
  { id: "url", section: "what" },
  { id: "tags", section: "what" },
  { id: "languages", section: "what" },
  { id: "image", section: "what" },
  { id: "partOf", section: "what" },
  { id: "allDay", section: "when" },
  { id: "startDate", section: "when", required: true },
  { id: "endDate", section: "when" },
  { id: "timezone", section: "when", required: true },
  { id: "status", section: "when" },
  { id: "attendanceMode", section: "where" },
  { id: "venue", section: "where" },
  { id: "geo", section: "where" },
  { id: "onlineUrl", section: "where" },
  { id: "organizers", section: "who" },
  { id: "eligibility", section: "who" },
  { id: "offers", section: "tickets" },
  { id: "cfp", section: "cfp" },
  // Not excluded by any preset (see PRESET_EXCLUSIONS below): translating an
  // event is an optional pass any organizer might want, not a preset concern.
  { id: "textLanguage", section: "translations" },
  { id: "translations", section: "translations" },
  { id: "slug", section: "metadata", required: true },
  { id: "id", section: "metadata", required: true },
  { id: "license", section: "metadata" },
  { id: "source", section: "metadata" },
  { id: "updatedAt", section: "metadata" },
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
  // data-provenance metadata, no call-for-proposals workflow (that's a
  // conference thing; DESIGN.md: "un organizador de meetups no necesita
  // ver campos de CFP").
  meetup: new Set(["status", "license", "source", "updatedAt", "cfp"]),
  // Conferences add status (cancelled/postponed matters) and cfp, but still
  // hide the provenance metadata.
  conference: new Set(["license", "source", "updatedAt"]),
  all: new Set(),
};

export interface ResolvedProfile {
  /** Preset the resolution is based on ("custom" when customProfile won). */
  preset: string;
  fields: ReadonlySet<string>;
  /** Sections rendered collapsed by default (those with no required field). */
  collapsedSections: ReadonlySet<SectionId>;
  /** Non-fatal config problems to surface in the UI. */
  warnings: string[];
}

const KNOWN_IDS = new Set(FIELD_REGISTRY.map((f) => f.id));

/**
 * Sections with no `required` field start collapsed under every preset —
 * derived from FIELD_REGISTRY rather than a hardcoded list, so it stays
 * correct as fields move between sections.
 */
const SECTIONS_WITH_REQUIRED = new Set(
  FIELD_REGISTRY.filter((f) => f.required).map((f) => f.section),
);
const DEFAULT_COLLAPSED_SECTIONS = new Set<SectionId>(
  SECTIONS.filter((s) => !SECTIONS_WITH_REQUIRED.has(s)),
);

/** Presets the UI can switch between; "custom" only when the config has one. */
export function availablePresets(config: OteConfig | null): string[] {
  const presets = Object.keys(PRESET_EXCLUSIONS);
  return Array.isArray(config?.customProfile?.fields)
    ? ["custom", ...presets]
    : presets;
}

/**
 * Resolves which form fields the editor shows for a given ote.config.json.
 *
 * - `customProfile.fields` wins over `profile`: core fields + the listed ids.
 *   Unknown ids (typos, or a field this editor doesn't support at all) are
 *   skipped with a warning.
 * - Otherwise `profile` picks a preset; unknown/missing profile falls back to
 *   "all" with a warning (show everything rather than silently hide fields).
 * - "all" renders the advanced section collapsed; translations render
 *   collapsed under every preset — it's an optional pass done after the rest
 *   of the event, never the first thing to fill in.
 * - `override` is the UI's profile switcher: a preset name or "custom" that
 *   takes precedence over everything in the config (no warnings — it is an
 *   explicit user choice, not a config problem).
 */
export function resolveProfile(
  config: OteConfig | null,
  override?: string,
): ResolvedProfile {
  const warnings: string[] = [];

  const useCustom =
    override === undefined
      ? Array.isArray(config?.customProfile?.fields)
      : override === "custom";
  const customFields = config?.customProfile?.fields;
  if (useCustom && Array.isArray(customFields)) {
    const fields = new Set<string>(CORE_FIELDS);
    for (const id of customFields) {
      if (KNOWN_IDS.has(id)) {
        fields.add(id);
      } else {
        warnings.push(
          `customProfile field "${id}" is not supported by this editor's form yet and was ignored`,
        );
      }
    }
    return {
      preset: "custom",
      fields,
      collapsedSections: new Set(DEFAULT_COLLAPSED_SECTIONS),
      warnings,
    };
  }

  let preset = override ?? config?.profile;
  if (preset === undefined) {
    if (config !== null) {
      warnings.push('no "profile" in ote.config.json, showing all fields');
    }
    preset = "all";
  } else if (!(preset in PRESET_EXCLUSIONS)) {
    if (override === undefined) {
      warnings.push(`unknown profile "${preset}", showing all fields`);
    }
    preset = "all";
  }

  const excluded = PRESET_EXCLUSIONS[preset];
  const fields = new Set<string>();
  for (const def of FIELD_REGISTRY) {
    if (!excluded.has(def.id)) fields.add(def.id);
  }
  const collapsedSections = new Set(DEFAULT_COLLAPSED_SECTIONS);
  return { preset, fields, collapsedSections, warnings };
}
