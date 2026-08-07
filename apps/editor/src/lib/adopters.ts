/**
 * Communities/events already publishing in OTE format, for the "Connect a
 * feed" dialog's browsable list — fetched at runtime from the public
 * adopters directory, not maintained in this repo (mirrors lib/
 * tag-vocabulary.ts's fetch/parse/cache shape).
 */

export interface Adopter {
  name: string;
  url?: string;
  feed?: string;
  desc?: { en?: string; es?: string };
}

export const ADOPTERS_URL = "https://opentechevents.org/data/adopters.json";

interface RawAdopter {
  name?: unknown;
  url?: unknown;
  feed?: unknown;
  desc?: { en?: unknown; es?: unknown };
}

/**
 * Defensive parsing of the fetched JSON's `adopters` array — a row without
 * a usable name is unusable as an entry, so it's skipped; anything else
 * malformed just yields a partial list rather than throwing (same
 * convention as parseVocabulary in tag-vocabulary.ts).
 */
export function parseAdopters(raw: unknown): Adopter[] {
  if (typeof raw !== "object" || raw === null) return [];
  const list = (raw as { adopters?: unknown }).adopters;
  if (!Array.isArray(list)) return [];
  const out: Adopter[] = [];
  for (const item of list as RawAdopter[]) {
    if (typeof item?.name !== "string" || item.name.trim() === "") continue;
    const adopter: Adopter = { name: item.name.trim() };
    if (typeof item.url === "string" && item.url.trim() !== "") adopter.url = item.url.trim();
    if (typeof item.feed === "string" && item.feed.trim() !== "") adopter.feed = item.feed.trim();
    const en = typeof item.desc?.en === "string" ? item.desc.en : undefined;
    const es = typeof item.desc?.es === "string" ? item.desc.es : undefined;
    if (en || es) adopter.desc = { ...(en && { en }), ...(es && { es }) };
    out.push(adopter);
  }
  return out;
}

let cache: Promise<Adopter[]> | null = null;

/**
 * Fetches and parses the adopters list once, caching the promise for the
 * session. A network or parse error degrades to an empty list rather than
 * rejecting — same convention as loadTagVocabulary, and the "everything
 * fails silently" contract dashboard-checks documents for this exact kind
 * of best-effort public-directory fetch.
 */
export function loadAdopters(fetchImpl: typeof fetch = fetch): Promise<Adopter[]> {
  if (!cache) {
    cache = fetchImpl(ADOPTERS_URL)
      .then((res) => (res.ok ? res.json() : []))
      .then(parseAdopters)
      .catch(() => []);
  }
  return cache;
}

/** Test seam: clears the cached fetch so a test can supply its own fetch. */
export function resetAdoptersCache(): void {
  cache = null;
}
