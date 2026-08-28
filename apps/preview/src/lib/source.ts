/**
 * What this page was asked to preview, read from its own query string.
 *
 * Two ways in, and they answer different questions:
 *
 *   - `?repo=owner/name` — an organizer fork. The three exports are files with
 *     fixed names (`feed.json`, `feed.ics`, `feed.xml`) next to each other, so
 *     all three tabs are worth loading and a missing one really does mean the
 *     export workflow has not run.
 *   - `?feed=<url>` — somebody's published feed, wherever it lives and however
 *     it is named. `https://eventos.wiki/events.json` is a real one, and the
 *     previewer used to reject it outright: it required the basename to be
 *     literally `feed.json`, which is a convention of the OTE template, not a
 *     rule of the spec. Nothing in the spec names a feed file.
 *
 * So the format of a direct URL is *detected*, in the order a person would:
 * an explicit `?format=`, then the file extension, then the media type the
 * server sent, then the first bytes of the document itself.
 */

export type FileKey = "json" | "ics" | "rss";

/** The canonical export names an OTE fork publishes, per format. */
export const CANONICAL_FILENAME: Record<FileKey, string> = {
  json: "feed.json",
  ics: "feed.ics",
  rss: "feed.xml",
};

export type PreviewSource =
  /** An organizer fork: three sibling files with known names. */
  | { kind: "repo"; repo: string }
  /**
   * One document at one URL. `format` is what the query string asked for, if
   * anything; `siblings` says whether the other two formats are worth trying
   * (true only when the URL follows the template's own naming).
   */
  | { kind: "feed"; url: URL; format?: FileKey; siblings: boolean }
  /** Nothing to preview — the page asks for a URL instead of guessing. */
  | { kind: "none"; problem?: string };

const REPO_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;

/** `?format=` — an escape hatch for a URL whose name and headers both lie. */
function parseFormat(params: URLSearchParams): FileKey | undefined {
  const raw = params.get("format")?.trim().toLowerCase();
  if (raw === "json" || raw === "ics") return raw;
  if (raw === "rss" || raw === "xml") return "rss";
  return undefined;
}

/** The format an extension implies, or undefined when it implies nothing. */
export function formatFromPath(pathname: string): FileKey | undefined {
  const name = pathname.split("/").at(-1)?.toLowerCase() ?? "";
  if (name.endsWith(".json")) return "json";
  if (name.endsWith(".ics") || name.endsWith(".ical")) return "ics";
  if (name.endsWith(".xml") || name.endsWith(".rss") || name.endsWith(".atom")) return "rss";
  return undefined;
}

/** The format a `Content-Type` implies. `application/ote+json` is the OTE one. */
export function formatFromMediaType(contentType: string | null): FileKey | undefined {
  const type = contentType?.split(";")[0]?.trim().toLowerCase();
  if (!type) return undefined;
  if (type.endsWith("json")) return "json";
  if (type === "text/calendar") return "ics";
  if (type.endsWith("xml") || type === "application/rss+xml") return "rss";
  return undefined;
}

/**
 * The format the bytes themselves imply — the last resort, and the only one
 * that cannot be got wrong by a server sending `text/plain` for everything.
 */
export function formatFromBody(text: string): FileKey | undefined {
  const head = text.trimStart().slice(0, 200);
  if (head.startsWith("{") || head.startsWith("[")) return "json";
  if (head.toUpperCase().startsWith("BEGIN:VCALENDAR")) return "ics";
  if (head.startsWith("<")) return "rss";
  return undefined;
}

/**
 * True when this URL is one of the template's own exports, and its two
 * siblings are therefore worth fetching. For any other name — `events.json`,
 * `calendar/2026.ics` — the siblings are a guess, and three tabs of "not
 * found" would read as three broken files rather than one naming convention
 * this feed does not follow.
 */
export function hasCanonicalSiblings(url: URL): boolean {
  const name = url.pathname.split("/").at(-1) ?? "";
  return Object.values(CANONICAL_FILENAME).includes(name);
}

/** The URL of a sibling export next to a canonical one. */
export function siblingUrl(feedUrl: URL, filename: string): string {
  const url = new URL(feedUrl);
  url.pathname = url.pathname.replace(/[^/]*$/, filename);
  return url.toString();
}

/**
 * Reads the query string into one source. A malformed parameter comes back as
 * `none` *with the reason*: the page shows the form either way, and "that is
 * not a repository name" is the sentence that stops someone re-pasting the
 * same URL a second time.
 */
export function parseSource(search: string): PreviewSource {
  const params = new URLSearchParams(search);
  const repo = params.get("repo")?.trim();
  const feed = params.get("feed")?.trim();

  if (repo) {
    if (REPO_RE.test(repo)) return { kind: "repo", repo };
    if (!feed) return { kind: "none", problem: `“${repo}” is not an owner/name repository.` };
  }

  if (feed) {
    let url: URL;
    try {
      url = new URL(feed);
    } catch {
      return { kind: "none", problem: `“${feed}” is not a URL.` };
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { kind: "none", problem: `Only http and https URLs are fetched, not “${url.protocol}”.` };
    }
    return {
      kind: "feed",
      url,
      ...(parseFormat(params) ? { format: parseFormat(params) } : {}),
      siblings: hasCanonicalSiblings(url),
    };
  }

  return { kind: "none" };
}

/** The query string for a chosen source — what the form navigates to. */
export function sourceQuery(input: { repo: string } | { feed: string; format?: FileKey | "" }): string {
  const params = new URLSearchParams();
  if ("repo" in input) {
    params.set("repo", input.repo);
  } else {
    params.set("feed", input.feed);
    if (input.format) params.set("format", input.format);
  }
  return `?${params.toString()}`;
}
