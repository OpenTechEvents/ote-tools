/**
 * Repo context (?repo=owner/name) and the URLs the editor fetches from.
 * Pure functions; the actual fetching lives in main.ts.
 */

import type { ListedEvent, OteEvent } from "./types.js";

// owner: GitHub user/org (alnum + inner hyphens); name: repo name charset.
const REPO_RE =
  /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;

/** Extracts and validates ?repo=owner/name from a query string. */
export function parseRepoParam(search: string): string | null {
  const repo = new URLSearchParams(search).get("repo")?.trim();
  return repo && REPO_RE.test(repo) ? repo : null;
}

export type EditorContext =
  | { mode: "repo"; repo: string }
  | { mode: "generator" };

export function editorContextFromSearch(search: string): EditorContext {
  const repo = parseRepoParam(search);
  return repo === null ? { mode: "generator" } : { mode: "repo", repo };
}

export interface RepoFetchPlan {
  configUrl: string;
  contentsUrl: string;
  pagesFeedUrl: string;
  repoApiUrl: string;
}

export function repoFetchPlan(context: EditorContext): RepoFetchPlan | null {
  if (context.mode === "generator") return null;
  return {
    configUrl: rawConfigUrl(context.repo),
    contentsUrl: contentsApiUrl(context.repo),
    pagesFeedUrl: pagesFeedUrl(context.repo),
    repoApiUrl: repoApiUrl(context.repo),
  };
}

/** ote.config.json in the default branch, via raw.githubusercontent (CORS open). */
export function rawConfigUrl(repo: string): string {
  return `https://raw.githubusercontent.com/${repo}/HEAD/ote.config.json`;
}

/** GitHub contents API listing of the events/ directory. */
export function contentsApiUrl(repo: string): string {
  return `https://api.github.com/repos/${repo}/contents/events`;
}

/** Repo metadata (default_branch) from the GitHub API. */
export function repoApiUrl(repo: string): string {
  return `https://api.github.com/repos/${repo}`;
}

/**
 * feed.json on the fork's GitHub Pages site. Fallback listing source when the
 * contents API is unavailable (rate limit); breaks on custom domains, which
 * is accepted — the API path is the primary one.
 */
export function pagesFeedUrl(repo: string): string {
  const [owner, name] = repo.split("/");
  return `https://${owner}.github.io/${name}/feed.json`;
}

/** One events/*.json entry from the contents API listing. */
export interface ContentsEntry {
  slug: string;
  rawUrl: string;
}

/**
 * Parses a GitHub contents API directory listing down to the events/*.json
 * files. Unknown shapes yield [] rather than throwing: a broken listing
 * degrades to "no events found".
 */
export function parseContentsListing(json: unknown): ContentsEntry[] {
  if (!Array.isArray(json)) return [];
  const entries: ContentsEntry[] = [];
  for (const item of json) {
    if (typeof item !== "object" || item === null) continue;
    const { type, name, download_url: rawUrl } = item as Record<string, unknown>;
    if (type !== "file" || typeof name !== "string" || !name.endsWith(".json"))
      continue;
    if (typeof rawUrl !== "string") continue;
    entries.push({ slug: name.slice(0, -".json".length), rawUrl });
  }
  return entries;
}

// Slugs must be usable as a filename in events/ and in URLs we build.
const SLUG_RE = /^[A-Za-z0-9._-]+$/;

/**
 * Best-effort slug from an event id (last path segment of the URI), for the
 * Pages-feed fallback where filenames are unknown. Returns null when nothing
 * filename-safe can be derived — the UI then disables "direct edit" for that
 * event (never guesses; convention: absent = absent + warning).
 */
export function slugFromId(id: unknown): string | null {
  if (typeof id !== "string") return null;
  let pathname: string;
  try {
    pathname = new URL(id).pathname;
  } catch {
    return null;
  }
  const segment = decodeURIComponent(
    pathname.split("/").filter(Boolean).at(-1) ?? "",
  );
  const slug = segment.endsWith(".json")
    ? segment.slice(0, -".json".length)
    : segment;
  return SLUG_RE.test(slug) ? slug : null;
}

/**
 * Parses a Pages feed.json into the edit-mode event list (fallback source).
 * Filenames are unknown there, so slugs are derived from the ids; an
 * underivable slug stays null and the UI disables "direct edit" for it.
 */
export function parseFeedListing(json: unknown): ListedEvent[] {
  if (typeof json !== "object" || json === null) return [];
  const events = (json as { events?: unknown }).events;
  if (!Array.isArray(events)) return [];
  return events
    .filter((e): e is OteEvent => typeof e === "object" && e !== null)
    .map((event) => ({ slug: slugFromId(event.id), event }));
}
