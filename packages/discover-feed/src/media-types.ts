/**
 * Which media types count as "an OTE feed document".
 *
 * The spec has NOT decided between a dedicated `application/ote+json` and
 * reusing `application/feed+json` (OpenTechEvents/opentechevents-spec#6), so
 * matching here is deliberately lax: both are accepted, plus plain
 * `application/json` for the very common case of a feed served by a static
 * host that knows nothing about OTE. Callers are told which one was seen
 * (`mediaTypeNote`) instead of the tool hardcoding a winner and going stale
 * the day that issue closes.
 */

/** Media types that positively identify a document as an OTE feed. */
export const OTE_MEDIA_TYPES = [
  "application/ote+json",
  "application/feed+json",
] as const;

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

/** True for `application/ote+json` and `application/feed+json`. */
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
