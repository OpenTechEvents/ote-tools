import { es } from "./es.js";
import { SUPPORTED_LOCALES, type Locale } from "./types.js";

export { SUPPORTED_LOCALES, type Locale };

const DICTS: Partial<Record<Locale, Record<string, string>>> = { es };

const STORAGE_KEY = "ote-editor-lang";

function isSupportedLocale(value: string | null): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value ?? "");
}

/**
 * Pure precedence logic (localStorage choice, then browser language list,
 * then English) — takes its inputs as arguments rather than reading
 * `localStorage`/`navigator` itself, so it's directly unit-testable without
 * a DOM.
 */
export function pickLocale(
  savedValue: string | null,
  preferredLanguages: readonly string[],
): Locale {
  if (isSupportedLocale(savedValue)) return savedValue;
  for (const tag of preferredLanguages) {
    const short = tag.slice(0, 2).toLowerCase();
    if (isSupportedLocale(short)) return short;
  }
  return "en";
}

/** localStorage isn't just possibly-undefined — some runtimes (Node's own experimental global among them) expose it but throw when actually used, so this needs a try/catch, not just a typeof check. */
function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable/blocked — the choice just won't persist across reloads.
  }
}

/** Real-world entry point: reads the actual browser globals, guarded so importing this module in a non-browser test runner never throws. */
function detectInitialLocale(): Locale {
  const saved = readStorage(STORAGE_KEY);
  let preferred: readonly string[] = [];
  try {
    preferred = (navigator.languages ?? [navigator.language]).filter(
      (tag): tag is string => typeof tag === "string",
    );
  } catch {
    // navigator unavailable in this runtime — fine, pickLocale handles an empty list.
  }
  return pickLocale(saved, preferred);
}

let locale: Locale = detectInitialLocale();

export function getLocale(): Locale {
  return locale;
}

export function setLocale(next: Locale): void {
  locale = next;
  writeStorage(STORAGE_KEY, next);
  if (typeof document !== "undefined") document.documentElement.lang = next;
}

/** Looks up `key` in the active locale; `fallback` (the English literal already in code/HTML) covers "en" and any untranslated key. */
export function t(key: string, fallback: string): string {
  return DICTS[locale]?.[key] ?? fallback;
}

/**
 * Applies `data-i18n`/`data-i18n-placeholder`/`data-i18n-aria-label`
 * translations to everything already in `root`. The element's *original*
 * English text/attribute — cached in a sibling `data-i18n-en`/
 * `-placeholder-en`/`-aria-label-en` attribute the first time this runs —
 * is always the fallback, never whatever's currently displayed: this
 * function is called again on every locale switch (not just once at
 * startup), so reading the live text would mean switching back to English
 * after a Spanish render just reflects the Spanish text back unchanged
 * instead of restoring the original. index.html's own markup is the
 * English source; no separate English dictionary is needed.
 */
export function applyStaticTranslations(root: ParentNode): void {
  for (const el of root.querySelectorAll<HTMLElement>("[data-i18n]")) {
    const original = el.dataset.i18nEn ?? (el.dataset.i18nEn = el.textContent ?? "");
    el.textContent = t(el.dataset.i18n ?? "", original);
  }
  for (const el of root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "[data-i18n-placeholder]",
  )) {
    const original =
      el.dataset.i18nPlaceholderEn ?? (el.dataset.i18nPlaceholderEn = el.placeholder);
    el.placeholder = t(el.dataset.i18nPlaceholder ?? "", original);
  }
  for (const el of root.querySelectorAll<HTMLElement>("[data-i18n-aria-label]")) {
    const original =
      el.dataset.i18nAriaLabelEn ?? (el.dataset.i18nAriaLabelEn = el.getAttribute("aria-label") ?? "");
    el.setAttribute(
      "aria-label",
      t(el.dataset.i18nAriaLabel ?? "", original),
    );
  }
}
