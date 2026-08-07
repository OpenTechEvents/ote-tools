/**
 * Recently-connected repos, persisted in localStorage so returning to a
 * feed already opened once doesn't mean retyping/re-finding owner/repo
 * every time — same shape as lib/tag-history.ts's recently-used tags.
 */

export interface RecentRepo {
  repo: string;
  /** Feed title, filled in once the config fetch resolves — see main.ts. Absent means "not known yet", not "no title". */
  title?: string;
}

const STORAGE_KEY = "ote-editor-recent-repos";
const MAX_ENTRIES = 6;

/** Pure: parses the raw stored value into an ordered list, most-recent-first. Never throws on malformed/foreign JSON. */
export function parseRecentRepos(raw: string | null): RecentRepo[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const out: RecentRepo[] = [];
    for (const item of parsed) {
      if (typeof item?.repo !== "string" || item.repo === "") continue;
      out.push(
        typeof item.title === "string" && item.title !== ""
          ? { repo: item.repo, title: item.title }
          : { repo: item.repo },
      );
    }
    return out;
  } catch {
    return [];
  }
}

/**
 * Pure: moves/inserts `repo` to the front (matched case-insensitively,
 * since GitHub owner/repo names are), caps at MAX_ENTRIES. `title` updates
 * the stored entry when given; omitted keeps whatever title was already
 * there — the immediate record-on-load call (before the config fetch has
 * resolved) must not blank out a title recorded on a previous visit.
 */
export function withRecentRepo(
  current: readonly RecentRepo[],
  repo: string,
  title?: string,
): RecentRepo[] {
  const key = repo.toLowerCase();
  const existing = current.find((r) => r.repo.toLowerCase() === key);
  const resolvedTitle = title ?? existing?.title;
  const entry: RecentRepo = resolvedTitle ? { repo, title: resolvedTitle } : { repo };
  return [entry, ...current.filter((r) => r.repo.toLowerCase() !== key)].slice(
    0,
    MAX_ENTRIES,
  );
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
    // Storage unavailable/blocked — the list just won't persist across reloads.
  }
}

export function getRecentRepos(): RecentRepo[] {
  return parseRecentRepos(readStorage());
}

export function recordRepoUsed(repo: string, title?: string): void {
  writeStorage(JSON.stringify(withRecentRepo(getRecentRepos(), repo, title)));
}
