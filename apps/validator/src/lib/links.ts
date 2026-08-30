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
 *
 * The list is sent in **batches**, because a Worker invocation may make only
 * 50 subrequests and each URL costs several (#71). One request per feed asked
 * the Worker for something the platform does not grant; several small ones
 * ask for what it does, and the page shows each batch as it lands instead of
 * waiting for all of them.
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
  /** Called after each batch, so the page fills in as answers arrive. */
  onProgress?: (checked: CheckedUrl[], total: number) => void;
}

/**
 * URLs per request. Must stay at or below the Worker's own `maxUrls`
 * (`workers/validator/src/check-urls.ts`), which is sized so that a batch
 * fits inside one invocation's subrequest budget. Lower than that cap on
 * purpose: the margin is what absorbs a URL that needs a redirect hop or a
 * GET fallback.
 */
export const BATCH_SIZE = 10;

/**
 * Most URLs this page will check for one document. A 200-event feed carries
 * hundreds, and each batch is a request against a per-IP rate limit — so the
 * ceiling is stated and the remainder is reported as unchecked, rather than
 * quietly hammering the endpoint until it refuses.
 */
export const MAX_URLS_CHECKED = 120;

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

/** One batch. Returns the endpoint's answers, or a message to show instead. */
async function checkBatch(
  urls: string[],
  deps: LinkCheckDeps,
): Promise<{ ok: true; results: UrlCheckResult[] } | { ok: false; message: string }> {
  const endpoint = `${deps.endpoint.replace(/\/$/, "")}/check-urls`;
  let response: Response;
  try {
    response = await deps.fetchImpl(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ urls }),
    });
  } catch {
    return {
      ok: false,
      message:
        "The link checker could not be reached. The verdict above is unaffected — it was " +
        "produced in this tab, from the document itself.",
    };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { ok: false, message: "The link checker answered something unreadable." };
  }

  if (!response.ok || (body as { ok?: boolean }).ok !== true) {
    const message = (body as { message?: string }).message;
    return { ok: false, message: message ?? `The link checker answered ${response.status}.` };
  }

  return { ok: true, results: (body as { results?: UrlCheckResult[] }).results ?? [] };
}

/**
 * Checks every URL in a parsed document, a batch at a time.
 *
 * Never throws: the link check is an extra, and a checker that is down must
 * leave the schema verdict — which is already on screen — untouched.
 */
export async function checkDocumentLinks(
  json: unknown,
  deps: LinkCheckDeps,
): Promise<LinkReport> {
  const urls = collectDocumentUrls(json);
  if (urls.length === 0) return { status: "ok", checked: [] };

  const attempted = urls.slice(0, MAX_URLS_CHECKED);
  const beyondCap: CheckedUrl[] = urls.slice(MAX_URLS_CHECKED).map((entry) => ({
    kind: entry.kind,
    pointers: entry.pointers,
    url: entry.url,
    state: "skipped",
    reason: `not checked: this page checks the first ${MAX_URLS_CHECKED} addresses`,
  }));

  const answers = new Map<string, UrlCheckResult>();
  const checked = (): CheckedUrl[] => [
    ...attempted.map((entry: DocumentUrl) => ({
      kind: entry.kind,
      pointers: entry.pointers,
      ...(answers.get(entry.url) ?? {
        url: entry.url,
        state: "skipped" as const,
        reason: "not checked yet",
      }),
    })),
    ...beyondCap,
  ];

  // Sequential, not parallel: batches exist because the Worker has a budget,
  // and firing them all at once would just move the crowding one level up
  // (and into a per-IP rate limit).
  for (let start = 0; start < attempted.length; start += BATCH_SIZE) {
    const batch = attempted.slice(start, start + BATCH_SIZE);
    const answer = await checkBatch(
      batch.map((entry) => entry.url),
      deps,
    );
    // A failed batch ends the run, but never discards the batches already in:
    // partial answers are the whole point of doing this in pieces.
    if (!answer.ok) {
      return start === 0
        ? { status: "error", message: answer.message }
        : { status: "ok", checked: checked() };
    }
    for (const result of answer.results) answers.set(result.url, result);
    deps.onProgress?.(checked(), urls.length);
  }

  return { status: "ok", checked: checked() };
}

/** Counts by state, for a one-line summary. */
export function summarize(checked: CheckedUrl[]): Record<UrlState, number> {
  const counts: Record<UrlState, number> = { ok: 0, broken: 0, unverifiable: 0, skipped: 0 };
  for (const entry of checked) counts[entry.state]++;
  return counts;
}
