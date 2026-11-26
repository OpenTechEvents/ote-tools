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

/**
 * The hosted conversion service (`workers/convert`), which fetches a public
 * OTE JSON feed and returns iCalendar or RSS for it. This is what lets a
 * publisher who hosts only `feed.json` still offer "add to calendar" and a
 * feed-reader link: see `isConvertibleFeedUrl` for the one precondition.
 *
 * The feed URL is percent-encoded, for the reason #166 cost us once: a raw
 * URL nested in a query parameter ends at its first `&`, so any publisher
 * whose feed carries a query string would have had a different URL fetched
 * from the one they published.
 */
export function buildConvertIcsUrl(jsonUrl: string): string {
  return `https://convert.opentechevents.org/ics?feed=${encodeURIComponent(jsonUrl)}`;
}

/** The RSS half of `buildConvertIcsUrl`. */
export function buildConvertRssUrl(jsonUrl: string): string {
  return `https://convert.opentechevents.org/rss?feed=${encodeURIComponent(jsonUrl)}`;
}

/**
 * Ports the conversion service refuses outright, and hostnames that resolve
 * inside a network by convention rather than by DNS record. Mirrored from
 * `workers/validator/src/ssrf.ts#checkUrl`, which is what actually decides:
 * duplicated rather than imported because that module is Worker code and
 * this one is bundled into every consumer's page.
 * `test/subscribe-urls.test.ts` imports the real gate and asserts the two
 * agree, so the copy cannot drift silently.
 */
const SERVICE_BLOCKED_PORTS = new Set([22, 23, 25, 465, 587, 110, 143, 993, 995, 445, 3306, 5432, 6379, 9200, 11211, 27017]);
const SERVICE_BLOCKED_HOSTS = new Set(["localhost", "metadata.google.internal"]);

/**
 * Whether the conversion service could actually fetch this feed URL.
 *
 * The service is a third party on the public internet: it resolves the URL
 * itself and refuses anything that is not publicly routable, so a link built
 * from a URL it will reject is guaranteed to fail. Absent beats broken —
 * a Calendar group whose every entry 400s is worse than no Calendar group,
 * and worse still once a visitor has `webcal://`-subscribed to it.
 *
 * What is refused here, and why each one is not theoretical:
 *
 * - **Anything but absolute `http:`/`https:`.** A relative
 *   `feed-json="/events/feed.json"` is perfectly valid for the OTE group's
 *   own links — the browser resolves it against the host page — but the
 *   service has no page to resolve it against. Same for a bare
 *   `//host/path`, `file:`, `data:`.
 * - **Credentials in the URL.** The service refuses these
 *   (`blocked-credentials`), and building the link anyway would
 *   percent-encode a publisher's basic-auth password into a URL handed to
 *   Google Calendar and Feedly — and then stored for years in whatever
 *   calendar client subscribed to it. For a link that cannot work.
 * - **Hosts that are not publicly routable**: `localhost`, `*.localhost`,
 *   `*.internal`, the cloud metadata name, and the blocked ports. An
 *   organizer developing against `http://localhost:4000/feed.json` would
 *   otherwise be shown two groups of dead links.
 *
 * One deliberate divergence from the service: **every IP literal is
 * refused here**, where the service refuses only the private and loopback
 * ranges. Re-implementing its IPv4/IPv6 parsers in a widget bundle to
 * rescue the vanishingly rare feed published on a bare public IP is not
 * worth the bytes; that publisher can still declare `feed-ics` by hand.
 */
export function isConvertibleFeedUrl(jsonUrl: string): boolean {
  let url: URL;
  try {
    url = new URL(jsonUrl);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  if (url.username || url.password) return false;
  if (url.port && SERVICE_BLOCKED_PORTS.has(Number(url.port))) return false;

  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (SERVICE_BLOCKED_HOSTS.has(host) || host.endsWith(".localhost") || host.endsWith(".internal")) return false;
  // An IP literal in either family, bracketed or not.
  if (/^\[|^[0-9.]+$|^[0-9a-f:]*:[0-9a-f:]*$/i.test(host)) return false;
  return true;
}
