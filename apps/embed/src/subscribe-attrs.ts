export type ShowToken =
  | "google"
  | "webcal"
  | "ics-download"
  | "feedly"
  | "feed-protocol"
  | "rss-download"
  | "ote-reader"
  | "ote-preview"
  | "json-download";

export const ALL_SHOW_TOKENS: readonly ShowToken[] = [
  "google",
  "webcal",
  "ics-download",
  "feedly",
  "feed-protocol",
  "rss-download",
  "ote-reader",
  "ote-preview",
  "json-download",
];

function isShowToken(value: string): value is ShowToken {
  return (ALL_SHOW_TOKENS as readonly string[]).includes(value);
}

export type SubscribeLayout = "menu" | "badges";

/**
 * "menu" (default): one trigger, one popover listing every available group
 * with a section label. "badges": one small trigger per available group
 * (Calendar/RSS/OTE feed), each with its own popover — the ComBuilders
 * three-badge layout this element was ported from.
 */
export function parseSubscribeLayout(value: string | null): SubscribeLayout {
  return value === "badges" ? "badges" : "menu";
}

/**
 * Comma-separated allow-list of which subscribe links to render, same
 * full-replacement semantics as attrs.ts's parseFields/parseEventActions:
 * absent/empty/all-unrecognized falls back to every token, `show="none"`
 * yields an empty set, any other valid input fully replaces the default.
 *
 * This does not know which of `feed-ics`/`feed-rss` are actually set —
 * subscribe-render.ts intersects the result with whichever feed URLs are
 * present, the same separation `parseFields`'s FieldKeys have from whether
 * an event actually has that data.
 */
export function parseShow(value: string | null): Set<ShowToken> {
  if (value === "none") return new Set();
  if (!value) return new Set(ALL_SHOW_TOKENS);
  const requested = value
    .split(",")
    .map((token) => token.trim())
    .filter(isShowToken);
  return requested.length > 0 ? new Set(requested) : new Set(ALL_SHOW_TOKENS);
}
