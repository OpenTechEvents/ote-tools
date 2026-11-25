/**
 * Feed→event inheritance, resolved.
 *
 * A feed may declare `organizers`, `textLanguage`, `license` and
 * `contributing` once and let its events inherit them; the schemas say so in
 * machine-readable form (`x-inheritsFrom` on each event property) and the
 * feed schema's `eventsRespectInheritedTextLanguage` keyword *validates*
 * against the effective value, not the declared one. So a consumer that
 * reads `event.license` and finds nothing has not found a sparser document —
 * it has reached a conclusion the spec forbids: "No valid OTE document may
 * end up with an unknown licence."
 *
 * It lives here because it is a statement about what a document *means*, and
 * because every package that needs it already depends on this one. It used to
 * live in `@opentechevents/build-feed`, which the exporters cannot depend on
 * (it depends on them), so three published CLIs and the Broadcast app each
 * dropped inherited values on the floor while `build-feed` and the hosted
 * converter resolved them.
 *
 * **Replacement, never merge.** A declared `organizers[]` fully replaces the
 * feed's; it never appends. A plain `??` per field is exactly that, which is
 * also what makes resolving idempotent and safe to do twice.
 *
 * **Fills blanks only.** Where neither level declares a value the field stays
 * absent: absent `textLanguage` means *unknown*, never English, and nothing
 * here may infer it from a locale, an HTTP header or a guess.
 */

/**
 * The fields an event inherits from its feed.
 *
 * `specVersion` is annotated as inheritable too and is deliberately not here:
 * it identifies the document's rules, and no consumer of a feed needs it
 * stamped onto every event. `translations`, `covers` and `alternates` are not
 * inheritable at all — a feed's title is not an event's name, and the other
 * two describe the collection rather than anything in it.
 */
export const INHERITED_FIELDS: readonly string[] = [
  "organizers",
  "textLanguage",
  "license",
  "contributing",
];

/**
 * Each event's effective values, with the feed's defaults filled in.
 *
 * Returns the feed unchanged when it carries no events, and never mutates the
 * caller's document.
 */
export function resolveEventInheritance<T extends { events?: unknown }>(feed: T): T {
  if (!Array.isArray(feed.events)) return feed;
  const defaults = feed as Record<string, unknown>;
  const events = (feed.events as unknown[]).map((event) => {
    if (!event || typeof event !== "object") return event;
    const own = event as Record<string, unknown>;
    const inherited: Record<string, unknown> = {};
    for (const field of INHERITED_FIELDS) {
      if (own[field] === undefined && defaults[field] !== undefined) inherited[field] = defaults[field];
    }
    return Object.keys(inherited).length ? { ...own, ...inherited } : event;
  });
  return { ...feed, events };
}
