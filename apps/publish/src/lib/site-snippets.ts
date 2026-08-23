/**
 * The two "own website" channels that are not structured data: the embeddable
 * widget and the subscribe button. Both are pure string building — the assets
 * they point at already exist and are already deployed, which is exactly why
 * these ship as `ready` channels rather than placeholders.
 */

const TOOLS_BASE = "https://tools.opentechevents.org";

/** The `<ote-events>` attributes this tool lets an organizer set. */
export interface EmbedOptions {
  layout: "cards" | "list" | "calendar";
  theme: "auto" | "light" | "dark";
  /** Blank/undefined means "every event", which is the widget's own default. */
  limit?: number;
  /** From `event-id`: render one event of the feed, by its OTE id. */
  eventId?: string;
  showPast: boolean;
  cardWidth?: "small" | "medium" | "large";
}

export const DEFAULT_EMBED_OPTIONS: EmbedOptions = {
  layout: "cards",
  theme: "auto",
  showPast: false,
};

/**
 * Only non-default attributes are emitted. A snippet that spells out every
 * default reads as configuration the organizer has to maintain, and pins
 * behaviour they never asked to pin — the widget's own defaults should stay
 * free to improve under them.
 */
function embedAttributes(feedUrl: string, options: EmbedOptions): string {
  const attrs = [`feed="${feedUrl}"`];
  if (options.eventId) attrs.push(`event-id="${options.eventId}"`);
  if (options.layout !== "cards") attrs.push(`layout="${options.layout}"`);
  if (options.theme !== "auto") attrs.push(`theme="${options.theme}"`);
  if (options.limit !== undefined) attrs.push(`limit="${options.limit}"`);
  if (options.showPast) attrs.push(`show-past`);
  // card-width only means anything to the cards layout.
  if (options.cardWidth && options.layout === "cards") {
    attrs.push(`card-width="${options.cardWidth}"`);
  }
  return attrs.join(" ");
}

/**
 * The `<ote-events>` snippet, pinned to a fixed asset version.
 *
 * Pinned on purpose: `/embed/latest/` exists but moves under the consumer's
 * feet, and a widget that changes behaviour on someone else's site without
 * them touching anything is a bad trade for "always up to date" (see
 * apps/embed/CLAUDE.md). The version is injected at build time from
 * apps/embed/package.json so this can never drift from what is deployed.
 */
export function embedSnippet(
  feedUrl: string,
  options: EmbedOptions = DEFAULT_EMBED_OPTIONS,
  version = __EMBED_VERSION__,
): string {
  return [
    `<script type="module" src="${TOOLS_BASE}/embed/v${version}/ote-events.js"></script>`,
    `<ote-events ${embedAttributes(feedUrl, options)}></ote-events>`,
  ].join("\n");
}

/** Attributes for a live `<ote-events>` preview — the same set, as a map. */
export function embedPreviewAttributes(
  feedUrl: string,
  options: EmbedOptions,
): Record<string, string> {
  const attrs: Record<string, string> = { feed: feedUrl, layout: options.layout };
  if (options.eventId) attrs["event-id"] = options.eventId;
  if (options.theme !== "auto") attrs.theme = options.theme;
  if (options.limit !== undefined) attrs.limit = String(options.limit);
  if (options.showPast) attrs["show-past"] = "";
  if (options.cardWidth && options.layout === "cards") attrs["card-width"] = options.cardWidth;
  return attrs;
}

export interface SubscribeOptions {
  layout: "menu" | "badges";
  /** Feed title, used as the calendar's name in the subscribe links. */
  name?: string;
}

/**
 * The `<ote-subscribe>` snippet.
 *
 * It takes `feed-ics`/`feed-rss`/`feed-json` — one attribute per format,
 * each a plain URL — and **not** a single `feed=`. Unlike `<ote-events>` it
 * never fetches anything: with no URL attributes there is nothing to link to,
 * so the trigger renders with an empty menu. Getting this wrong looks exactly
 * like a broken widget, which is why it has a test.
 */
export function subscribeWidgetSnippet(
  urls: { ics: string; rss: string; json: string },
  options: SubscribeOptions = { layout: "menu" },
  version = __EMBED_VERSION__,
): string {
  const attrs = [
    `feed-ics="${urls.ics}"`,
    `feed-rss="${urls.rss}"`,
    `feed-json="${urls.json}"`,
  ];
  if (options.name) attrs.push(`name="${options.name}"`);
  if (options.layout !== "menu") attrs.push(`layout="${options.layout}"`);
  return [
    `<script type="module" src="${TOOLS_BASE}/embed/v${version}/ote-subscribe.js"></script>`,
    `<ote-subscribe ${attrs.join(" ")}></ote-subscribe>`,
  ].join("\n");
}

/** Attributes for a live `<ote-subscribe>` preview. */
export function subscribePreviewAttributes(
  urls: { ics: string; rss: string; json: string },
  options: SubscribeOptions,
): Record<string, string> {
  const attrs: Record<string, string> = {
    "feed-ics": urls.ics,
    "feed-rss": urls.rss,
    "feed-json": urls.json,
    layout: options.layout,
  };
  if (options.name) attrs.name = options.name;
  return attrs;
}

/**
 * The ICS and RSS files that sit next to a feed.json. A fork's build
 * publishes all three side by side, so they are derived from the feed URL
 * rather than fetched — a link that 404s is better than a spinner, and the
 * organizer can see immediately whether their exports ran.
 */
export function subscribeUrls(feedUrl: string): { ics: string; rss: string; json: string } {
  const swap = (filename: string): string => {
    try {
      const url = new URL(feedUrl);
      url.pathname = url.pathname.replace(/[^/]*$/, filename);
      return url.toString();
    } catch {
      return feedUrl.replace(/[^/]*$/, filename);
    }
  };
  return { ics: swap("feed.ics"), rss: swap("feed.xml"), json: feedUrl };
}
