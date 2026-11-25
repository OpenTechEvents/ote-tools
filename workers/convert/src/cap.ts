/**
 * How much of a feed one request is allowed to convert.
 *
 * A visitor hands this service a URL, so the work per request is bounded by
 * whatever somebody else publishes. Measured in this Worker on 2026-11-25,
 * per event: `/ics` ≈0.7 ms of CPU (the IANA resolution dominates), `/schema`
 * ≈2.6 KB of response. A 6000-event feed was 4.3 s and 15.6 MB, repeatable at
 * 30 requests a minute per IP with `cache=bypass`.
 *
 * Re-measure with `MAX_EVENTS` raised and the conversion timed per format
 * before moving it; the number is a budget, not a property of the format.
 *
 * **Nothing is dropped silently.** Over the cap, the events kept are the ones
 * a reader is about to need — the soonest upcoming — and every output says
 * what was left out, in band and in a response header, with the way to get
 * the whole feed.
 */
export const MAX_EVENTS = 1000;

export interface CapResult<T> {
  document: T;
  omitted: number;
  /** Total events the publisher's document carried. */
  total: number;
}

const startOf = (event: { startDate: string }): string => event.startDate;
const endOf = (event: { startDate: string; endDate?: string }): string => event.endDate ?? event.startDate;

/**
 * Keeps at most `MAX_EVENTS`, preferring events that have not finished.
 *
 * Within the kept set the publisher's order is preserved: an exporter decides
 * its own ordering, and a cap is not the place to change it.
 */
export function capEvents<T extends { events?: unknown }>(document: T, now = new Date()): CapResult<T> {
  const events = Array.isArray(document.events) ? document.events as { startDate: string; endDate?: string }[] : [];
  if (events.length <= MAX_EVENTS) return { document, omitted: 0, total: events.length };
  // A date-only `endDate` names the last day, so an event is past only once
  // that day is over: compare against the day, not the instant.
  const today = now.toISOString().slice(0, 10);
  const upcoming = events.filter((event) => endOf(event).slice(0, 10) >= today);
  const chosen = upcoming.length > MAX_EVENTS
    ? [...upcoming].sort((a, b) => startOf(a).localeCompare(startOf(b))).slice(0, MAX_EVENTS)
    : upcoming;
  const keep = new Set(chosen);
  const kept = events.filter((event) => keep.has(event));
  return { document: { ...document, events: kept }, omitted: events.length - kept.length, total: events.length };
}

/** What a reader is told when events were left out. Service prose, not publisher content. */
export function capNotice(kept: number, total: number, locale?: string): string {
  const spanish = /^es(?:-|$)/i.test(locale ?? "");
  return spanish
    ? `Este servicio convierte como máximo ${MAX_EVENTS} eventos por petición: se muestran los ${kept} próximos de ${total}. Para el feed completo, exporta en local con @opentechevents/export-ics o export-rss.`
    : `This service converts at most ${MAX_EVENTS} events per request: showing the ${kept} soonest of ${total}. For the whole feed, export locally with @opentechevents/export-ics or export-rss.`;
}
