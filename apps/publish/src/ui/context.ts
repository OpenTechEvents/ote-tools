import type { OteEvent, OteFeed } from "@opentechevents/export-jsonld";

import type { EventProfile } from "../lib/event-profile.js";
import { guessProfile } from "../lib/event-profile.js";
import type { EmbedOptions, SubscribeOptions } from "../lib/site-snippets.js";

/**
 * Everything the two views run on.
 *
 * `eventId` rather than an index: the pin survives reloads and the feed can be
 * re-fetched with events added or removed underneath it, and an index would
 * quietly start pointing at a different event.
 */
export interface State {
  feed: OteFeed;
  feedUrl: string;
  eventId: string | null;
  profileOverride: EventProfile | null;
  favourites: string[];
  view: "home" | "destination";
  activeDestination: string | null;
  sidebarCollapsed: boolean;
  /**
   * Whether a feed-scoped destination is showing this event or the whole feed.
   * Per-panel and only offered by the three destinations it means anything to
   * — it is not, and must not become, a second event selector.
   */
  scope: "event" | "feed";
  /** Only meaningful for the search-engines destination at feed scope. */
  feedScope: "graph" | "item-list";
  embedOptions: EmbedOptions;
  subscribeOptions: SubscribeOptions;
}

/** What a view needs to be able to do to the app around it. */
export interface AppContext {
  state: State;
  /** Re-render whichever view is showing. */
  render(): void;
  open(destinationId: string): void;
  goHome(): void;
  /** Re-render only the working panel, for controls that tune their own output. */
  renderStage(): void;
}

export function currentEvent(state: State): OteEvent | undefined {
  if (state.eventId === null) return undefined;
  return state.feed.events.find((event) => event.id === state.eventId);
}

/**
 * The event's profile, and why. Overridable, shown with its reasons, and only
 * ever used to reorder and annotate — never to hide a destination.
 */
export function currentProfile(state: State): { profile: EventProfile; reason: string } {
  if (state.profileOverride) {
    return { profile: state.profileOverride, reason: "You set this by hand." };
  }
  const event = currentEvent(state);
  if (!event) return { profile: "meetup", reason: "No event selected." };
  const guess = guessProfile(event);
  return { profile: guess.profile, reason: `Detected: ${guess.reasons.join(", ")}.` };
}
