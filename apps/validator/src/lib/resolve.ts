/**
 * URL mode: from a URL the user pasted to the document to validate.
 *
 * The user usually pastes the community's **home page**, not the feed file,
 * and that has to work — the spec's primary discovery mechanism is the
 * `<link>` in the head. So this is two steps, and the UI shows them as two:
 *
 *   1. discovery — did we find a feed, and where?
 *   2. validation — is that feed valid?
 *
 * Collapsing them tells an organizer whose `<link>` has a typo that their
 * JSON is broken, which is the wrong bug to go fix.
 *
 * All network access goes through `workers/fetch-url`; this module never
 * calls a third-party origin itself (it could not — no CORS).
 */

import {
  discover,
  type DiscoverOptions,
  type FeedCandidate,
  type MediaTypeNote,
} from "@opentechevents/discover-feed";

/** The envelope `workers/fetch-url` answers with. */
export type FetchEnvelope =
  | {
      ok: true;
      finalUrl: string;
      status: number;
      contentType: string | null;
      bytes: number;
      redirects: string[];
      body: string;
    }
  | { ok: false; code: string; message: string };

export interface ResolveDeps {
  /** Base URL of the fetcher Worker, e.g. `https://fetch.opentechevents.org`. */
  endpoint: string;
  fetchImpl: typeof fetch;
  options?: DiscoverOptions;
}

/** Where the document being validated came from — the discovery verdict. */
export type Provenance =
  /** The URL the user gave was itself the document. */
  | { via: "direct"; url: string; note: MediaTypeNote }
  /** An HTML page declared exactly one feed, and this is it. */
  | { via: "link"; pageUrl: string; url: string; note: MediaTypeNote }
  /** The feed was embedded in the page as `<script type="application/ote+json">`. */
  | { via: "embedded"; pageUrl: string };

export type Resolution =
  /** A document to validate, plus how it was found. */
  | { outcome: "document"; text: string; provenance: Provenance; redirects: string[] }
  /** Several feeds declared: the user picks. Never chosen silently. */
  | { outcome: "candidates"; pageUrl: string; candidates: FeedCandidate[] }
  /** An HTML page that declares no feed. A discovery result, not an error. */
  | { outcome: "not-found"; pageUrl: string; reason: string; wellKnownUrl?: string }
  /** The fetch failed or returned something undiscoverable. */
  | { outcome: "error"; code: string; message: string };

/** Calls the fetcher Worker for one URL. */
export async function fetchViaWorker(url: string, deps: ResolveDeps): Promise<FetchEnvelope> {
  const endpoint = `${deps.endpoint.replace(/\/$/, "")}/fetch?url=${encodeURIComponent(url)}`;
  let response: Response;
  try {
    response = await deps.fetchImpl(endpoint, { headers: { accept: "application/json" } });
  } catch (error) {
    // The browser's own reason is included on purpose. "Could not be reached"
    // alone is indistinguishable across DNS failure, a CSP that forbids the
    // origin, a CORS response that did not allow this page, and an extension
    // blocking the request — four different things to go fix, and the
    // difference cost a debugging round trip once already.
    const reason = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return {
      ok: false,
      code: "fetcher-unreachable",
      message:
        `The fetch service (${deps.endpoint}) could not be reached — ${reason}. ` +
        "Uploading a file or pasting JSON still works; those never leave your browser.",
    };
  }
  try {
    return (await response.json()) as FetchEnvelope;
  } catch {
    return { ok: false, code: "fetcher-error", message: "The fetch service answered unusably." };
  }
}

function toError(envelope: Extract<FetchEnvelope, { ok: false }>): Resolution {
  return { outcome: "error", code: envelope.code, message: envelope.message };
}

/**
 * Resolves a URL to a document, a choice of candidates, or "no feed here".
 *
 * A page declaring exactly one feed is followed automatically — there is
 * nothing to disambiguate — but the provenance still records both hops so the
 * UI can say *"page → feed"* rather than pretending the user's URL was the
 * document. Two or more feeds always stop and ask.
 */
export async function resolveUrl(url: string, deps: ResolveDeps): Promise<Resolution> {
  const envelope = await fetchViaWorker(url, deps);
  if (!envelope.ok) return toError(envelope);

  const found = discover({
    url: envelope.finalUrl,
    contentType: envelope.contentType,
    body: envelope.body,
    options: deps.options,
  });

  switch (found.outcome) {
    case "document":
      return {
        outcome: "document",
        text: found.text,
        provenance: { via: "direct", url: envelope.finalUrl, note: found.note },
        redirects: envelope.redirects,
      };

    case "not-found":
      return {
        outcome: "not-found",
        pageUrl: envelope.finalUrl,
        reason: found.reason,
        ...(found.wellKnownUrl ? { wellKnownUrl: found.wellKnownUrl } : {}),
      };

    case "unsupported":
      return {
        outcome: "error",
        code: "unsupported-content",
        message: `${found.reason} (${found.mediaType || "no content type"})`,
      };

    case "candidates": {
      if (found.candidates.length > 1) {
        return { outcome: "candidates", pageUrl: envelope.finalUrl, candidates: found.candidates };
      }
      return followCandidate(found.candidates[0], envelope.finalUrl, deps);
    }
  }
}

/** Fetches one chosen candidate and reports it as a two-hop provenance. */
export async function followCandidate(
  candidate: FeedCandidate,
  pageUrl: string,
  deps: ResolveDeps,
): Promise<Resolution> {
  if (candidate.source === "embedded") {
    return {
      outcome: "document",
      text: candidate.inlineDocument ?? "",
      provenance: { via: "embedded", pageUrl },
      redirects: [],
    };
  }

  const envelope = await fetchViaWorker(candidate.url, deps);
  if (!envelope.ok) return toError(envelope);

  const found = discover({
    url: envelope.finalUrl,
    contentType: envelope.contentType,
    body: envelope.body,
    options: deps.options,
  });

  if (found.outcome !== "document") {
    // The `<link>` points at something that is not a feed document. That is a
    // discovery failure of its own — still not "your JSON is invalid".
    return {
      outcome: "error",
      code: "link-not-a-feed",
      message: `The feed this page links to (${candidate.url}) did not return an OTE document.`,
    };
  }

  return {
    outcome: "document",
    text: found.text,
    provenance: { via: "link", pageUrl, url: envelope.finalUrl, note: found.note },
    redirects: envelope.redirects,
  };
}
