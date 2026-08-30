/**
 * Asks the Worker whether the document's URLs are reachable, and turns the
 * answers into something a page can render.
 *
 * The check runs server-side and nowhere else. From this tab, a cross-origin
 * request to a feed's image host fails identically whether the host is dead
 * or merely CORS-less — "broken" and "not allowed to look" are the same
 * exception — so a browser-side checker would report perfectly good URLs as
 * broken. That is the failure this feature exists to remove, not to add.
 *
 * (The one client-side check that *would* work is loading an image in an
 * `<img>`, which needs no CORS. It cannot report a status code, so it can
 * only ever say "did not load" — which is exactly the answer that needs a
 * status code to be trustworthy. Not worth its own code path.)
 */

import { collectDocumentUrls, type DocumentUrl, type UrlKind } from "./urls.js";

export type { DocumentUrl, UrlKind } from "./urls.js";

/** What the Worker says about one URL. Mirrors workers/validator's own type. */
export type UrlState = "ok" | "broken" | "unverifiable" | "skipped";

export interface UrlCheckResult {
  url: string;
  state: UrlState;
  status?: number;
  reason: string;
}

/** One checked URL, back together with where it came from in the document. */
export interface CheckedUrl extends UrlCheckResult {
  kind: UrlKind;
  pointers: string[];
}

export type LinkReport =
  | { status: "ok"; checked: CheckedUrl[] }
  | { status: "error"; message: string };

export interface LinkCheckDeps {
  /** Same base as the fetch endpoint; empty string means this page's origin. */
  endpoint: string;
  fetchImpl: typeof fetch;
}

/** What a broken URL of each kind actually costs whoever reads the feed. */
export const KIND_CONSEQUENCE: Record<UrlKind, string> = {
  image: "no client can show this image",
  page: "readers following the event land on an error",
  registration: "nobody can sign up through this link",
  online: "attendees cannot reach the online session",
  license: "the licence terms cannot be read",
};

/** Human labels for the kinds, for a UI that groups by them. */
export const KIND_LABEL: Record<UrlKind, string> = {
  image: "Image",
  page: "Page",
  registration: "Registration",
  online: "Online location",
  license: "Licence",
};

/**
 * Checks every URL in a parsed document.
 *
 * Never throws: the link check is an extra, and a fetcher that is down must
 * leave the schema verdict — which is already on screen — untouched.
 */
export async function checkDocumentLinks(
  json: unknown,
  deps: LinkCheckDeps,
): Promise<LinkReport> {
  const urls = collectDocumentUrls(json);
  if (urls.length === 0) return { status: "ok", checked: [] };

  const endpoint = `${deps.endpoint.replace(/\/$/, "")}/check-urls`;
  let response: Response;
  try {
    response = await deps.fetchImpl(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ urls: urls.map((entry) => entry.url) }),
    });
  } catch {
    return {
      status: "error",
      message:
        "The link checker could not be reached. The verdict above is unaffected — it was " +
        "produced in this tab, from the document itself.",
    };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { status: "error", message: "The link checker answered something unreadable." };
  }

  if (!response.ok || (body as { ok?: boolean }).ok !== true) {
    const message = (body as { message?: string }).message;
    return {
      status: "error",
      message: message ?? `The link checker answered ${response.status}.`,
    };
  }

  const results = (body as { results?: UrlCheckResult[] }).results ?? [];
  const byUrl = new Map(results.map((result) => [result.url, result]));

  return {
    status: "ok",
    checked: urls.map((entry: DocumentUrl) => ({
      kind: entry.kind,
      pointers: entry.pointers,
      ...(byUrl.get(entry.url) ?? {
        url: entry.url,
        state: "skipped" as const,
        reason: "no answer for this URL",
      }),
    })),
  };
}

/** Counts by state, for a one-line summary. */
export function summarize(checked: CheckedUrl[]): Record<UrlState, number> {
  const counts: Record<UrlState, number> = { ok: 0, broken: 0, unverifiable: 0, skipped: 0 };
  for (const entry of checked) counts[entry.state]++;
  return counts;
}
