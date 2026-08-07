/**
 * Recently-used tags, persisted in localStorage so the tag explorer can
 * surface "tags you've used before" across sessions and events — distinct
 * from "Suggested for you" (same category as what's already on THIS event).
 */

const STORAGE_KEY = "ote-editor-recent-tags";
const MAX_ENTRIES = 20;

/** Pure: parses the raw stored value into an ordered id list, most-recent-first. Never throws on malformed/foreign JSON. */
export function parseRecentTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    return [];
  }
}

/** Pure: moves/inserts `id` to the front, dedups, caps at MAX_ENTRIES. */
export function withRecentTag(current: readonly string[], id: string): string[] {
  return [id, ...current.filter((v) => v !== id)].slice(0, MAX_ENTRIES);
}

/** localStorage isn't just possibly-undefined — some runtimes (Node's own experimental global among them) expose it but throw when actually used, so this needs a try/catch, not just a typeof check. */
function readStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStorage(value: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage unavailable/blocked — history just won't persist across reloads.
  }
}

export function getRecentTags(): string[] {
  return parseRecentTags(readStorage());
}

export function recordTagUsed(id: string): void {
  writeStorage(JSON.stringify(withRecentTag(getRecentTags(), id)));
}
