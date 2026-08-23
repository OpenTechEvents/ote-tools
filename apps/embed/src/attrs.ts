// theme="light|dark|auto" has no parser here: theme.css.ts's :host()
// selectors read the raw attribute directly (see element.ts), and an
// unrecognized value simply falls back to the light defaults — no JS
// validation needed.
export type LangAttr = "en" | "es" | "auto";
export type Lang = "en" | "es";
export type Layout = "list" | "cards" | "calendar";
export type EventClickMode = "modal" | "link" | "none";
export type SortMode = "auto" | "none";
export type NativeEventAction = "google-calendar" | "outlook-calendar" | "yahoo-calendar" | "ics" | "link";

export type GroupKey = "series" | "multipart";

export type FieldKey =
  | "image"
  | "when"
  | "location"
  | "attendance"
  | "description"
  | "price"
  | "tags"
  | "organizer"
  | "eligibility"
  | "cfp";

export const ALL_FIELDS: readonly FieldKey[] = [
  "image",
  "when",
  "location",
  "attendance",
  "description",
  "price",
  "tags",
  "organizer",
  "eligibility",
  "cfp",
];

export const DEFAULT_FIELDS: readonly FieldKey[] = [
  "image",
  "when",
  "location",
  "attendance",
  "description",
];

export const DEFAULT_EVENT_ACTIONS: readonly NativeEventAction[] = [
  "google-calendar",
  "outlook-calendar",
  "yahoo-calendar",
  "ics",
  "link",
];

const ALL_GROUP_KEYS: readonly GroupKey[] = ["series", "multipart"];

function isFieldKey(value: string): value is FieldKey {
  return (ALL_FIELDS as readonly string[]).includes(value);
}

function isGroupKey(value: string): value is GroupKey {
  return (ALL_GROUP_KEYS as readonly string[]).includes(value);
}

export function parseLimit(value: string | null): number {
  if (!value) return Infinity;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : Infinity;
}

export function parseLangAttr(value: string | null): LangAttr {
  return value === "en" || value === "es" ? value : "auto";
}

/** Resolves "auto" against the runtime's own language, for a concrete UI-string lookup. */
export function resolveLang(attr: LangAttr, navigatorLanguage: string): Lang {
  if (attr !== "auto") return attr;
  return navigatorLanguage.toLowerCase().startsWith("es") ? "es" : "en";
}

/**
 * `event-id="<OTE id>"` — the single event to render, matched against the
 * event's own `id`. The OTE `id` is a stable URI documented as never
 * changing after publication, which is what makes it the right key here:
 * a name or a date can be edited, so filtering on either would silently
 * empty a page the organizer had already published.
 */
export function parseEventId(value: string | null): string | undefined {
  return value?.trim() || undefined;
}

export function parseShowPast(value: string | null): boolean {
  return value !== "false";
}

export function parseLayout(value: string | null): Layout {
  if (value === "cards") return "cards";
  if (value === "list") return "list";
  return "calendar";
}

export function parseEventClick(value: string | null): EventClickMode {
  if (value === "link" || value === "none") return value;
  return "modal";
}

export function parseSort(value: string | null): SortMode {
  return value === "none" ? "none" : "auto";
}

function isNativeEventAction(value: string): value is NativeEventAction {
  return (
    value === "google-calendar" ||
    value === "outlook-calendar" ||
    value === "yahoo-calendar" ||
    value === "ics" ||
    value === "link"
  );
}

export function parseEventActions(value: string | null): NativeEventAction[] {
  if (value === "none") return [];
  if (!value) return [...DEFAULT_EVENT_ACTIONS];
  const requested = value
    .split(",")
    .map((token) => token.trim())
    .filter(isNativeEventAction);
  return requested.length > 0 ? [...new Set(requested)] : [...DEFAULT_EVENT_ACTIONS];
}

/**
 * Comma-separated allow-list of which optional fields to render. Absent,
 * empty, or entirely-unrecognized input falls back to DEFAULT_FIELDS; any
 * valid non-empty input is a full replacement, not merged with the default —
 * `fields="price,tags"` shows *only* price and tags.
 */
export function parseFields(value: string | null): Set<FieldKey> {
  if (!value) return new Set(DEFAULT_FIELDS);
  const requested = value
    .split(",")
    .map((token) => token.trim())
    .filter(isFieldKey);
  return requested.length > 0 ? new Set(requested) : new Set(DEFAULT_FIELDS);
}

/**
 * Comma-separated allow-list for the "detail" surfaces — the list layout's
 * accordion body and the detail modal. Same full-replacement semantics as
 * `parseFields`, but a different fallback: absent, empty, or
 * entirely-unrecognized input yields ALL_FIELDS, not DEFAULT_FIELDS. This
 * preserves the modal's original behavior (it rendered every optional field
 * unconditionally, with no `fields` gating at all) as the true default —
 * only an explicit value (here, or via the legacy `fields` attribute)
 * narrows what the detail surfaces show.
 */
export function parseDetailFields(value: string | null): Set<FieldKey> {
  if (!value) return new Set(ALL_FIELDS);
  const requested = value
    .split(",")
    .map((token) => token.trim())
    .filter(isFieldKey);
  return requested.length > 0 ? new Set(requested) : new Set(ALL_FIELDS);
}

/**
 * Comma-separated opt-in list of `partOf.type` values to collapse into a
 * stacked card in `layout="cards"`. Deliberately the *opposite* default of
 * `parseFields`: absent, empty, or entirely-unrecognized input yields an
 * EMPTY set (no grouping), not "all types". This is new opt-in visual
 * behavior shipped in a minor release with a live pinned consumer — the
 * attribute being absent must be a complete no-op, unlike `fields`, whose
 * default was already the pre-existing look.
 */
export function parseGroupEvents(value: string | null): Set<GroupKey> {
  if (!value) return new Set();
  return new Set(
    value
      .split(",")
      .map((token) => token.trim())
      .filter(isGroupKey),
  );
}

/**
 * Comma-separated list of feed URLs for the `feeds` attribute (plural).
 * Unlike `parseFields`, there is no recognized-token allow-list — every
 * non-empty, trimmed token is a URL candidate; a bad one simply fails to
 * fetch like a bad `feed` URL would. Returns an empty array when absent,
 * blank, or only commas, so `element.ts` can fall back to the single `feed`
 * attribute.
 */
export function parseFeedsAttr(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

const CARD_WIDTH_PRESETS: Record<string, string> = {
  small: "160px",
  medium: "220px",
  large: "320px",
};

/**
 * Resolves `card-width` (only meaningful in `layout="cards"`) into a CSS
 * length for `--ote-card-min-width`. Accepts the presets `small`/`medium`/
 * `large`, or any raw CSS length (`"280px"`, `"18rem"`); a bare number is
 * treated as pixels. Absent or unrecognized falls back to `"220px"` — the
 * same value that was hardcoded before this attribute existed, so an
 * existing embed's default card width never changes.
 */
export function parseCardWidth(value: string | null): string {
  const trimmed = value?.trim();
  if (!trimmed) return CARD_WIDTH_PRESETS.medium!;
  if (trimmed in CARD_WIDTH_PRESETS) return CARD_WIDTH_PRESETS[trimmed]!;
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
  if (/^\d+(\.\d+)?(px|rem|em|ch|vw|%)$/.test(trimmed)) return trimmed;
  return CARD_WIDTH_PRESETS.medium!;
}
