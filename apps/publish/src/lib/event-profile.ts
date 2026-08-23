import type { OteEvent } from "@opentechevents/export-jsonld";

/**
 * What kind of event this is, as far as a destination cares. Directories
 * are picky in exactly this dimension: confs.tech and developers.events take
 * conferences, not a monthly meetup — so telling the two apart is what lets
 * the tool point an organizer at the channels that will actually accept
 * their event instead of a wall of undifferentiated logos.
 */
export type EventProfile = "meetup" | "conference";

export interface ProfileGuess {
  profile: EventProfile;
  /** Why, in the organizer's words — shown next to the guess, never hidden. */
  reasons: string[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days an event spans, or 1 when the dates don't say. */
function daysSpanned(event: OteEvent): number {
  if (!event.endDate) return 1;
  const start = Date.parse(`${event.startDate.slice(0, 10)}T00:00:00Z`);
  const end = Date.parse(`${event.endDate.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return 1;
  return Math.round((end - start) / DAY_MS) + 1;
}

/**
 * Guesses the profile from what the event document actually says. OTE has no
 * "type" field — deliberately, since one organizer's "meetup" is another's
 * "mini conference" — so this reads signals instead of inventing a field,
 * shows its reasoning, and is always overridable in the UI. It is a hint for
 * ordering channels, never a gate: nothing is hidden because of it.
 */
export function guessProfile(event: OteEvent): ProfileGuess {
  const reasons: string[] = [];
  if (event.cfp) reasons.push("it has a call for proposals");
  const days = daysSpanned(event);
  if (days > 1) reasons.push(`it runs ${days} days`);
  if (event.offers?.some((offer) => (offer.price ?? 0) > 0)) reasons.push("it sells tickets");
  if (reasons.length > 0) return { profile: "conference", reasons };
  return {
    profile: "meetup",
    reasons: ["it is a single-day, free event with no call for proposals"],
  };
}
