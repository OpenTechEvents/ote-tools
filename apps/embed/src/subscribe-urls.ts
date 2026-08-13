// Pure "subscribe to this feed" URL builders for <ote-subscribe>. Ported
// from a real-world fix: the previous hand-rolled versions of these links
// (Google Calendar via an encodeURIComponent'd https:// cid, and Feedly via
// the old www.feedly.com/home#subscription/feed/ path) were both silently
// broken. See apps/embed/CLAUDE.md for the <ote-subscribe> element this
// module backs.

/**
 * Google Calendar's "add by URL" flow expects an *unencoded* webcal:// URL
 * in `cid` — not a URL-encoded https:// one. Verified against Google's own
 * documented pattern: https://www.google.com/calendar/render?cid=webcal://…
 */
export function buildGoogleCalendarUrl(icsUrl: string): string {
  return `https://www.google.com/calendar/render?cid=${toWebcalUrl(icsUrl)}`;
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
