/**
 * OTE feed discovery: given what a URL returned, say what the OTE document is
 * — or which candidates the user has to choose between.
 *
 * Pure by design. Every function here takes the response body, its
 * content-type and the URL it came from, and returns a decision; nothing in
 * this package opens a socket. The network half lives in the fetcher
 * (`workers/fetch-url`), so the spec logic can be tested without mocks and
 * the Worker stays a dumb fetcher instead of accumulating spec rules.
 *
 * Reference implementation of OpenTechEvents/opentechevents-spec#6 and of the
 * v0.3 "Discovery: how a feed is found from a website" section.
 */

import { parseEmbeddedFeeds, parseLinkElements } from "./html.js";
import { classifyContentType, isOteMediaType, normalizeMediaType } from "./media-types.js";

export type { HtmlLink } from "./html.js";
export { headSection, parseEmbeddedFeeds, parseLinkElements } from "./html.js";
export type { ContentKind } from "./media-types.js";
export {
  classifyContentType,
  GENERIC_JSON_MEDIA_TYPES,
  isJsonMediaType,
  isOteMediaType,
  normalizeMediaType,
  OTE_MEDIA_TYPES,
} from "./media-types.js";

/** Where a candidate feed URL came from. */
export type CandidateSource = "link" | "embedded" | "well-known";

/** A feed the page points at — not yet fetched, let alone validated. */
export interface FeedCandidate {
  /** Absolute URL, resolved against the document's own base. */
  url: string;
  /** The `type` attribute as declared by the page, "" when absent. */
  mediaType: string;
  /** The `title` attribute, "" when absent. Shown when disambiguating. */
  title: string;
  source: CandidateSource;
  /**
   * For `source: "embedded"`, the document text carried inside the page —
   * there is nothing left to fetch.
   */
  inlineDocument?: string;
}

/** The result of looking at one response. Never a validation verdict. */
export type DiscoveryResult =
  /** The response *is* the OTE document. */
  | { outcome: "document"; text: string; mediaType: string; note: MediaTypeNote }
  /** The page points at one or more feeds; the caller fetches the chosen one. */
  | { outcome: "candidates"; candidates: FeedCandidate[] }
  /** An HTML page with no OTE feed declared. Not an invalid feed — no feed. */
  | { outcome: "not-found"; reason: string; wellKnownUrl?: string }
  /** Neither JSON nor HTML: nothing discovery can do with it. */
  | { outcome: "unsupported"; reason: string; mediaType: string };

/** What the served media type says about OTE conformance. */
export type MediaTypeNote =
  /** Served as `application/ote+json` or `application/feed+json`. */
  | { kind: "ote"; mediaType: string }
  /** Served as generic JSON: parses fine, but the type announces nothing. */
  | { kind: "generic-json"; mediaType: string }
  /** No usable content-type at all; treated as JSON because it parses as one. */
  | { kind: "missing" };

export interface DiscoverOptions {
  /**
   * Offer `/.well-known/ote-feed` when a page declares no feed. Open question
   * in the spec (#6), so off by default — the caller decides.
   */
  wellKnown?: boolean;
  /**
   * Accept a feed embedded as `<script type="application/ote+json">`. Also an
   * open question in the spec (#6), so off by default.
   */
  embedded?: boolean;
}

export interface DiscoverInput {
  /** URL the body came from, after redirects. Used as the resolution base. */
  url: string;
  /** Response content-type, `null` when the server sent none. */
  contentType: string | null;
  /** Response body, decoded as text. */
  body: string;
  options?: DiscoverOptions;
}

/** `/.well-known/ote-feed` for a given URL's origin. */
export function wellKnownFeedUrl(url: string): string {
  return new URL("/.well-known/ote-feed", url).toString();
}

function mediaTypeNote(contentType: string | null): MediaTypeNote {
  const mediaType = normalizeMediaType(contentType);
  if (!mediaType) return { kind: "missing" };
  return isOteMediaType(mediaType)
    ? { kind: "ote", mediaType }
    : { kind: "generic-json", mediaType };
}

/**
 * Resolves an href against the document base, keeping only http(s). A page
 * that points at `javascript:` or `file:` is not handing us a feed, and the
 * component that would eventually fetch it should never see such a URL.
 */
function resolveHref(href: string, base: string): string | null {
  if (!href) return null;
  try {
    const resolved = new URL(href, base);
    return resolved.protocol === "http:" || resolved.protocol === "https:"
      ? resolved.toString()
      : null;
  } catch {
    return null;
  }
}

function hasRel(rel: string, wanted: string): boolean {
  return rel.split(/\s+/).includes(wanted);
}

/**
 * Every OTE feed an HTML document declares, in document order and
 * deduplicated by URL. The primary mechanism per the spec:
 * `<link rel="alternate" type="application/ote+json" href="…">` in the head.
 */
export function discoverFromHtml(
  html: string,
  baseUrl: string,
  options: DiscoverOptions = {},
): FeedCandidate[] {
  const candidates: FeedCandidate[] = [];
  const seen = new Set<string>();

  for (const link of parseLinkElements(html)) {
    if (!hasRel(link.rel, "alternate")) continue;
    if (!isOteMediaType(link.type)) continue;
    const url = resolveHref(link.href, baseUrl);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    candidates.push({ url, mediaType: link.type, title: link.title, source: "link" });
  }

  if (options.embedded) {
    parseEmbeddedFeeds(html).forEach((text, index) => {
      candidates.push({
        // Fragment-only URL: identifies which embedded block this is without
        // pretending there is something at the other end to fetch.
        url: `${baseUrl}#ote-feed-${index + 1}`,
        mediaType: "application/ote+json",
        title: "",
        source: "embedded",
        inlineDocument: text,
      });
    });
  }

  return candidates;
}

const NO_FEED_REASON =
  'This page declares no OTE feed: no <link rel="alternate" type="application/ote+json"> in its <head>.';

function fromHtml(body: string, url: string, options: DiscoverOptions): DiscoveryResult {
  const candidates = discoverFromHtml(body, url, options);
  if (candidates.length > 0) return { outcome: "candidates", candidates };
  return {
    outcome: "not-found",
    reason: NO_FEED_REASON,
    ...(options.wellKnown ? { wellKnownUrl: wellKnownFeedUrl(url) } : {}),
  };
}

/**
 * Resolves one response into an OTE document, a list of candidates, or a
 * plain "no feed here".
 *
 * The three outcomes are kept distinct on purpose: "I could not find your
 * feed" and "I found your feed and it is invalid" are different verdicts, and
 * collapsing them tells an organizer whose `<link>` has a typo that their
 * JSON is broken.
 */
export function discover(input: DiscoverInput): DiscoveryResult {
  const { url, contentType, body, options = {} } = input;
  const kind = classifyContentType(contentType);

  if (kind === "ote-json" || kind === "json") {
    return { outcome: "document", text: body, mediaType: normalizeMediaType(contentType), note: mediaTypeNote(contentType) };
  }

  if (kind === "html") return fromHtml(body, url, options);

  // No content-type, or one nobody should trust: fall back to the bytes. A
  // body that parses as JSON is treated as the document (static hosts serve
  // .json as octet-stream more often than anyone would like); one that looks
  // like markup goes down the HTML path.
  if (looksLikeJson(body)) {
    return { outcome: "document", text: body, mediaType: normalizeMediaType(contentType), note: mediaTypeNote(contentType) };
  }
  if (looksLikeHtml(body)) return fromHtml(body, url, options);

  return {
    outcome: "unsupported",
    reason: "This URL returned neither JSON nor HTML.",
    mediaType: normalizeMediaType(contentType),
  };
}

/** True when the body's first non-whitespace character starts a JSON object/array. */
export function looksLikeJson(body: string): boolean {
  const first = body.trimStart()[0];
  return first === "{" || first === "[";
}

/** True when the body starts with a doctype or a tag. */
export function looksLikeHtml(body: string): boolean {
  return /^\s*(<!doctype\b|<html\b|<head\b|<meta\b|<link\b|<!--)/i.test(body);
}

/** What kind of OTE document a parsed JSON value looks like. */
export type OteDocumentKind = "feed" | "event" | "unknown";

/**
 * Guesses feed vs. standalone event from the document's shape.
 *
 * The v0.3 spec has no `kind` discriminator, so this reads structure: a feed
 * is the document with an `events` array, an event is the one with a
 * `startDate`. The guess is always correctable by the user — the validator UI
 * shows which one it picked and lets them override it, because a document
 * that is malformed enough to be ambiguous is exactly the one being debugged.
 */
export function detectDocumentKind(json: unknown): OteDocumentKind {
  if (typeof json !== "object" || json === null || Array.isArray(json)) return "unknown";
  const record = json as Record<string, unknown>;
  if (Array.isArray(record.events)) return "feed";
  if (typeof record.startDate === "string" || typeof record.endDate === "string") return "event";
  if (typeof record.title === "string" && typeof record.updatedAt === "string") return "feed";
  if (typeof record.name === "string") return "event";
  return "unknown";
}
