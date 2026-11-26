// Pure "subscribe to this feed" URL builders for <ote-subscribe>. Ported
// from a real-world fix: the previous hand-rolled versions of these links
// (Google Calendar's cid, and Feedly via the old
// www.feedly.com/home#subscription/feed/ path) were both silently broken.
// See apps/embed/CLAUDE.md for the <ote-subscribe> element this module backs.

/**
 * Google Calendar's "add by URL" flow, as `cid` on the `render` endpoint.
 *
 * Two decisions, and the second one reverses what this comment used to say.
 *
 * **The `webcal://` scheme swap stays.** It is the shape Google documents,
 * and it is known to work.
 *
 * **The value is percent-encoded.** This comment previously asserted that
 * Google "expects an *unencoded*" URL here, and three tests pinned the
 * literal spelling — but nothing ever executed either claim: every test in
 * this module compares strings, so "verified against Google's documented
 * pattern" was a reading of the docs, not a click. Checked against a real
 * Google account on 2026-11-26, both of these subscribe successfully:
 *
 *     ?cid=webcal://communitybuilders.dev/events/feed.ics
 *     ?cid=webcal%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.ics
 *
 * So encoding costs nothing, and not encoding costs correctness: a raw URL
 * nested in a query parameter ends at its first `&`, which silently
 * truncated the feed URL of any publisher whose ICS carries a query string
 * (#166). Google received a different URL from the one the organizer
 * published, and the failure looked like a broken feed rather than a broken
 * link.
 *
 * What is still untested, and therefore not relied on: whether an encoded
 * `https://` cid works. That was the other half of the old claim. The
 * scheme swap makes the question moot here — do not drop it on the
 * assumption that `https://` is equivalent.
 */
export function buildGoogleCalendarUrl(icsUrl: string): string {
  return `https://www.google.com/calendar/render?cid=${encodeURIComponent(toWebcalUrl(icsUrl))}`;
}

/**
 * The universal "open in whatever calendar app is installed" link: Apple
 * Calendar, Outlook desktop (classic and New Outlook), and Android calendar
 * apps all register a webcal:// handler. Deliberately the only
 * Outlook-flavored link this module offers — Microsoft's own web deep link
 * (outlook.live.com/calendar/0/addcalendar) is unreliable after login and
 * not fixable from the caller's side, so webcal:// covers that case instead.
 */
export function toWebcalUrl(icsUrl: string): string {
  return icsUrl.replace(/^https?:\/\//, "webcal://");
}

/** Feedly's current follow-a-feed URL. The old www.feedly.com/home#subscription/feed/ path 301-redirects and drops the target feed URL. */
export function buildFeedlyUrl(rssUrl: string): string {
  return `https://feedly.com/i/subscription/feed/${encodeURIComponent(rssUrl)}`;
}

/** The feed:// scheme most desktop feed readers (NetNewsWire, Reeder, …) register a handler for. */
export function toFeedProtocolUrl(rssUrl: string): string {
  return rssUrl.replace(/^https?:\/\//, "feed://");
}

/** OTE Reader's own "subscribe to this feed" deep link, for a native OTE JSON feed. */
export function buildOteReaderUrl(jsonUrl: string): string {
  return `https://reader.opentechevents.org/?subscribe=${encodeURIComponent(jsonUrl)}`;
}

/** OTE Tools' feed previewer/validator, for a native OTE JSON feed. */
export function buildOtePreviewUrl(jsonUrl: string): string {
  return `https://tools.opentechevents.org/preview/?feed=${encodeURIComponent(jsonUrl)}`;
}
