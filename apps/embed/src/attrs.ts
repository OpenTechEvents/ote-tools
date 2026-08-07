export const DEFAULT_LIMIT = 6;

// theme="light|dark|auto" has no parser here: theme.css.ts's :host()
// selectors read the raw attribute directly (see element.ts), and an
// unrecognized value simply falls back to the light defaults — no JS
// validation needed.
export type LangAttr = "en" | "es" | "auto";
export type Lang = "en" | "es";
export type Layout = "list" | "cards";

export function parseLimit(value: string | null): number {
  if (!value) return DEFAULT_LIMIT;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_LIMIT;
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
  return value === "true";
}

export function parseLayout(value: string | null): Layout {
  return value === "cards" ? "cards" : "list";
}
