// theme="light|dark|auto" has no parser here: theme.css.ts's :host()
// selectors read the raw attribute directly (see element.ts), and an
// unrecognized value simply falls back to the light defaults — no JS
// validation needed.
export type LangAttr = "en" | "es" | "auto";
export type Lang = "en" | "es";
export type Layout = "list" | "cards" | "calendar";
export type EventClickMode = "modal" | "link" | "none";
export type NativeEventAction = "google-calendar" | "outlook-calendar" | "yahoo-calendar" | "ics" | "link";

export type FieldKey =
  | "image"
  | "when"
  | "location"
  | "attendance"
  | "description"
  | "price"
  | "tags"
  | "organizer";

const ALL_FIELDS: readonly FieldKey[] = [
  "image",
  "when",
  "location",
  "attendance",
  "description",
  "price",
  "tags",
  "organizer",
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

function isFieldKey(value: string): value is FieldKey {
  return (ALL_FIELDS as readonly string[]).includes(value);
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
