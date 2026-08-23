import {
  eventToJsonLd,
  feedToItemList,
  feedToJsonLd,
  isOnlineOnly,
  toJsonLdScript,
  type OteFeed,
} from "@opentechevents/export-jsonld";

/**
 * Which shape of structured data the page being marked up needs. The choice
 * is the organizer's, not something this tool can infer from the feed: it
 * depends on what their page actually shows, and Google requires structured
 * data to describe visible content.
 */
export type SnippetScope =
  | { kind: "graph" }
  | { kind: "item-list" }
  | { kind: "event"; index: number };

export const SCOPE_HELP: Record<SnippetScope["kind"], string> = {
  graph:
    "For a page that shows the events themselves — every event as one document.",
  "item-list":
    "For a listing page whose entries link to their own event pages.",
  event: "For a single event's own page.",
};

/**
 * What Google will do with this snippet, when the answer is "less than the
 * organizer expects".
 *
 * Google's event rich results require a physical location — "Virtual
 * experiences that have no real-world component aren't supported" — so an
 * online-only event is never eligible, however it is marked up. The snippet
 * is still worth adding (other engines, AI assistants and calendar tools
 * read it), but the organizer has to hear that here rather than from a red
 * Rich Results Test they will assume is our bug.
 */
export function eligibilityNote(feed: OteFeed, scope: SnippetScope): string | null {
  const online = "Google's event rich results need a physical location, so online-only";
  const still =
    "The snippet is still worth adding: other search engines, AI assistants and " +
    "calendar tools read it, and Google itself uses the data outside rich results.";

  if (scope.kind === "event") {
    const event = feed.events[scope.index];
    if (!event || !isOnlineOnly(event)) return null;
    return `This event has no physical venue. ${online} events never win a Google rich result, and its Rich Results Test will report no eligible item. ${still}`;
  }

  const onlineOnly = feed.events.filter(isOnlineOnly).length;
  if (onlineOnly === 0) return null;
  if (onlineOnly === feed.events.length) {
    return `None of these events has a physical venue. ${online} events never win a Google rich result, and its Rich Results Test will report no eligible item. ${still}`;
  }
  return `${onlineOnly} of ${feed.events.length} events have no physical venue. ${online} events never win a Google rich result — the rest of this snippet is unaffected. ${still}`;
}

/** Builds the pasteable `<script type="application/ld+json">` block. */
export function buildSnippet(feed: OteFeed, scope: SnippetScope): string {
  if (scope.kind === "item-list") return toJsonLdScript(feedToItemList(feed));
  if (scope.kind === "graph") return toJsonLdScript(feedToJsonLd(feed));
  const event = feed.events[scope.index];
  if (!event) throw new Error(`no event at index ${scope.index}`);
  return toJsonLdScript(eventToJsonLd(event));
}
