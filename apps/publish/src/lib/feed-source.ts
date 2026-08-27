import { forkFileUrls, httpUrl, type PagesOrigin } from "@opentechevents/feed-urls";

/**
 * Where this tool gets a feed from. The dashboard links here as
 * `?repo=owner/name` (the DESIGN.md convention every central tool follows);
 * `?feed=<url>` is the escape hatch for a feed published anywhere else, and
 * may also travel *next to* `?repo=` — see `feedUrls` for why.
 */
export type FeedSource =
  | { kind: "repo"; repo: string; url?: string }
  | { kind: "url"; url: string };

const REPO_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;

/**
 * Reads `?repo=` / `?feed=` from a query string. `repo` wins when both are
 * set — it is the richer context — but the `feed` URL is kept on the source
 * so a dashboard that knows exactly where its own feed lives can say so.
 */
export function parseFeedSource(search: string): FeedSource | null {
  const params = new URLSearchParams(search);
  const repo = params.get("repo")?.trim();
  const feed = httpUrl(params.get("feed")?.trim());
  if (repo && REPO_RE.test(repo)) {
    return feed ? { kind: "repo", repo, url: feed } : { kind: "repo", repo };
  }
  return feed ? { kind: "url", url: feed } : null;
}

/**
 * The URLs to try, in order: an explicit `?feed=` first — the dashboard knows
 * its own address better than we can guess it — then whatever
 * `@opentechevents/feed-urls` derives from the repo, which is more than one
 * string because of custom domains. That package documents why.
 */
export function feedUrls(source: FeedSource, from: PagesOrigin = {}): string[] {
  if (source.kind === "url") return [source.url];
  const candidates = [
    ...(source.url ? [source.url] : []),
    ...forkFileUrls(source.repo, "feed.json", from),
  ];
  return [...new Set(candidates)];
}
