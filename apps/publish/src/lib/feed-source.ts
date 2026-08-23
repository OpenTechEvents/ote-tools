/**
 * Where this tool gets a feed from. The dashboard links here as
 * `?repo=owner/name` (the DESIGN.md convention every central tool follows);
 * `?feed=<url>` is the escape hatch for a feed published anywhere else.
 */
export type FeedSource =
  | { kind: "repo"; repo: string }
  | { kind: "url"; url: string };

const REPO_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;

/** Reads `?repo=` / `?feed=` from a query string. `repo` wins when both are set. */
export function parseFeedSource(search: string): FeedSource | null {
  const params = new URLSearchParams(search);
  const repo = params.get("repo")?.trim();
  if (repo && REPO_RE.test(repo)) return { kind: "repo", repo };
  const feed = params.get("feed")?.trim();
  if (!feed) return null;
  try {
    const url = new URL(feed);
    // Anything but http(s) — javascript:, data:, file: — is not a feed.
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return { kind: "url", url: url.toString() };
  } catch {
    return null;
  }
}

/**
 * The URLs to try, in order. A fork's feed is normally served from its
 * GitHub Pages site, but Pages may not be enabled yet (or may still be
 * building) while the file is already committed — so `raw.githubusercontent`
 * on the default branch is the fallback, exactly as `apps/preview` does it.
 */
export function feedUrls(source: FeedSource): string[] {
  if (source.kind === "url") return [source.url];
  const [owner, name] = source.repo.split("/");
  return [
    `https://${owner}.github.io/${name}/feed.json`,
    `https://raw.githubusercontent.com/${source.repo}/HEAD/feed.json`,
  ];
}
