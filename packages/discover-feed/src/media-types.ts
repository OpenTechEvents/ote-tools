/**
 * Which media types count as "an OTE feed document".
 *
 * Settled in OTE Spec 0.6 (DECISIONS.md D036): the canonical type is
 * **`application/ote+json`**. `application/feed+json` is JSON Feed's, and a
 * document that turns out to be an OTE feed served under it is accepted
 * **with a warning** — the label is wrong, the document is fine, and
 * refusing it would punish a publisher for a header. Plain
 * `application/json` is accepted too, for the very common case of a static
 * host that knows nothing about OTE.
 *
 * Accepting both silently, which is what this did while the question was
 * open, is precisely what kept it open.
 */

/** The canonical OTE feed media type. */
export const OTE_MEDIA_TYPE = "application/ote+json";

/**
 * JSON Feed's type. Accepted for an OTE document, but warned about: it
 * announces a different format.
 */
export const JSON_FEED_MEDIA_TYPE = "application/feed+json";

/** Media types that positively identify a document as an OTE feed. */
export const OTE_MEDIA_TYPES = [OTE_MEDIA_TYPE, JSON_FEED_MEDIA_TYPE] as const;

/** Generic JSON types: plausible feed, but they say nothing about OTE. */
export const GENERIC_JSON_MEDIA_TYPES = ["application/json", "text/json"] as const;

const HTML_MEDIA_TYPES = ["text/html", "application/xhtml+xml"] as const;

/** What a response looks like, judged by its media type alone. */
export type ContentKind = "ote-json" | "json" | "html" | "other";

/** Strips parameters and normalizes case: `Application/JSON; charset=utf-8` → `application/json`. */
export function normalizeMediaType(contentType: string | null | undefined): string {
  if (!contentType) return "";
  const [essence] = contentType.split(";");
  return essence.trim().toLowerCase();
}

/** True for the canonical type and for JSON Feed's, which is tolerated. */
export function isOteMediaType(contentType: string | null | undefined): boolean {
  const type = normalizeMediaType(contentType);
  return (OTE_MEDIA_TYPES as readonly string[]).includes(type);
}

/** True for any type this package is willing to parse as a feed document. */
export function isJsonMediaType(contentType: string | null | undefined): boolean {
  const type = normalizeMediaType(contentType);
  if (isOteMediaType(type)) return true;
  if ((GENERIC_JSON_MEDIA_TYPES as readonly string[]).includes(type)) return true;
  // Anything else structured as JSON (`application/vnd.foo+json`) still parses.
  return type.endsWith("+json");
}

/** Classifies a response by media type. */
export function classifyContentType(contentType: string | null | undefined): ContentKind {
  const type = normalizeMediaType(contentType);
  if (isOteMediaType(type)) return "ote-json";
  if (isJsonMediaType(type)) return "json";
  if ((HTML_MEDIA_TYPES as readonly string[]).includes(type)) return "html";
  return "other";
}
