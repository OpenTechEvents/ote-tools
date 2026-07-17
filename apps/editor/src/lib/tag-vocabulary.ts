/**
 * Tag autocomplete vocabulary: the topic and audience tag lists the
 * ComBuildersES communities-directory publishes, fetched at runtime and merged
 * into a single suggestion list.
 *
 * OTE tags stay free-form (schema: "the field itself stays free") — this
 * vocabulary only powers the editor's autocomplete. Anything typed that is not
 * in the vocabulary is still accepted as a tag, and a failed or partial fetch
 * degrades to free-form entry (convention: absent data = absent + no crash).
 */

/** A normalized autocomplete entry, shared by both source lists. */
export interface TagSuggestion {
  /** Canonical tag slug stored in the event (the directory entry id). */
  id: string;
  /** Human-readable name shown in chips and the dropdown. */
  label: string;
  /** Grouping shown as secondary text (e.g. "Programming Languages"). */
  category: string;
  /** Extra match terms: the label plus the entry's synonyms, lowercased. */
  keywords: string[];
}

/** The two published lists that seed the tag autocomplete. */
export const TAG_VOCABULARY_URLS = [
  "https://raw.githubusercontent.com/ComBuildersES/communities-directory/master/public/data/tags.en.json",
  "https://raw.githubusercontent.com/ComBuildersES/communities-directory/master/public/data/audience.en.json",
] as const;

interface RawEntry {
  id?: unknown;
  label?: unknown;
  category?: unknown;
  synonyms?: unknown;
}

/**
 * Parses one directory file's JSON into suggestions, skipping malformed rows
 * (a row without a usable id is unusable as a tag). Never throws.
 */
export function parseVocabulary(raw: unknown): TagSuggestion[] {
  if (!Array.isArray(raw)) return [];
  const out: TagSuggestion[] = [];
  for (const item of raw as RawEntry[]) {
    if (typeof item?.id !== "string" || item.id.trim() === "") continue;
    const id = item.id.trim();
    const label =
      typeof item.label === "string" && item.label.trim() !== ""
        ? item.label.trim()
        : id;
    const category =
      typeof item.category === "string" ? item.category.trim() : "";
    const synonyms = Array.isArray(item.synonyms)
      ? item.synonyms.filter((s): s is string => typeof s === "string")
      : [];
    const keywords = [label, ...synonyms].map((s) => s.toLowerCase());
    out.push({ id, label, category, keywords });
  }
  return out;
}

/** Merges parsed lists into one, keeping the first occurrence of each id. */
export function mergeVocabularies(lists: TagSuggestion[][]): TagSuggestion[] {
  const byId = new Map<string, TagSuggestion>();
  for (const list of lists) {
    for (const entry of list) if (!byId.has(entry.id)) byId.set(entry.id, entry);
  }
  return [...byId.values()];
}

/**
 * Ranks suggestions for `query`, dropping ids already in `exclude`. An empty
 * query returns the head of the list, so focusing the field browses the
 * vocabulary. Ranking, best first: id/label prefix, then a keyword word-start,
 * then any substring match.
 */
export function searchVocabulary(
  vocab: readonly TagSuggestion[],
  query: string,
  exclude: readonly string[],
  limit = 8,
): TagSuggestion[] {
  const taken = new Set(exclude);
  const q = query.trim().toLowerCase();
  if (q === "") {
    return vocab.filter((s) => !taken.has(s.id)).slice(0, limit);
  }
  const scored: { entry: TagSuggestion; rank: number }[] = [];
  for (const entry of vocab) {
    if (taken.has(entry.id)) continue;
    const id = entry.id.toLowerCase();
    const label = entry.label.toLowerCase();
    let rank = -1;
    if (id.startsWith(q) || label.startsWith(q)) rank = 0;
    else if (entry.keywords.some((k) => k.split(/\s+/).some((w) => w.startsWith(q)))) rank = 1;
    else if (id.includes(q) || entry.keywords.some((k) => k.includes(q))) rank = 2;
    if (rank >= 0) scored.push({ entry, rank });
  }
  scored.sort((a, b) => a.rank - b.rank || a.entry.label.localeCompare(b.entry.label));
  return scored.slice(0, limit).map((x) => x.entry);
}

let cache: Promise<TagSuggestion[]> | null = null;

async function fetchList(
  url: string,
  fetchImpl: typeof fetch,
): Promise<TagSuggestion[]> {
  try {
    const res = await fetchImpl(url);
    if (!res.ok) return [];
    return parseVocabulary(await res.json());
  } catch {
    return [];
  }
}

/**
 * Fetches and merges the tag vocabulary once, caching the promise for the
 * session. Each list fails independently: a network or parse error on one URL
 * drops only that list, never the whole vocabulary, and never rejects.
 */
export function loadTagVocabulary(
  fetchImpl: typeof fetch = fetch,
): Promise<TagSuggestion[]> {
  if (!cache) {
    cache = Promise.all(TAG_VOCABULARY_URLS.map((u) => fetchList(u, fetchImpl)))
      .then(mergeVocabularies)
      .catch(() => []);
  }
  return cache;
}

/** Test seam: clears the cached fetch so a test can supply its own fetch. */
export function resetTagVocabularyCache(): void {
  cache = null;
}
