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

/** An http(s) URL, or null for anything else — javascript:, data:, file:, junk. */
function httpUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

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

/** Where the organizer came from, used to guess a custom Pages domain. */
export interface FeedUrlContext {
  /** `document.referrer` — the dashboard that linked here, if it sent one. */
  referrer?: string;
  /** `location.origin` of this tool, so its own pages are never candidates. */
  origin?: string;
}

/**
 * The URLs to try, in order.
 *
 * A fork's feed normally lives on its GitHub Pages site, but three things go
 * wrong with the obvious `owner.github.io/name/feed.json`:
 *
 * 1. **Custom domains.** When Pages serves a repo from one, the `github.io`
 *    URL answers `301` to that domain — and the redirect itself carries no
 *    `Access-Control-Allow-Origin`, so the browser blocks the whole fetch
 *    before it ever reaches the (perfectly CORS-open) destination. There is
 *    no way to read the `Location` from script, so the domain has to arrive
 *    some other way: `?feed=` from the dashboard, or the origin of the
 *    dashboard that linked here (`document.referrer`, which browsers trim to
 *    the bare origin cross-origin — hence trying both `/name/feed.json` and
 *    `/feed.json` under it).
 * 2. **Pages not enabled yet**, or still building, while the file is already
 *    committed — `raw.githubusercontent` on the default branch covers that,
 *    exactly as `apps/preview` does it.
 * 3. A generated feed is never on the default branch at all, so 2 is a
 *    fallback, not a guarantee.
 */
export function feedUrls(source: FeedSource, context: FeedUrlContext = {}): string[] {
  if (source.kind === "url") return [source.url];
  const [owner, name] = source.repo.split("/");
  const candidates = [
    source.url,
    ...referrerCandidates(name!, context),
    `https://${owner}.github.io/${name}/feed.json`,
    `https://raw.githubusercontent.com/${source.repo}/HEAD/feed.json`,
  ].filter((url): url is string => url !== undefined);
  return [...new Set(candidates)];
}

function referrerCandidates(name: string, context: FeedUrlContext): string[] {
  const referrer = httpUrl(context.referrer);
  if (referrer === null) return [];
  const origin = new URL(referrer).origin;
  // Navigating inside this tool sets a referrer too; it is never a feed host.
  if (origin === context.origin) return [];
  // Project sites keep the repo name in the path, user/org sites and custom
  // domains mapped to one repo do not.
  return [`${origin}/${name}/feed.json`, `${origin}/feed.json`];
}
