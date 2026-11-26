// The provenance strip under the events (#68), built here rather than in
// render.ts: it is the one part of <ote-events> that is not about an event,
// and it mounts a second custom element.
//
// What a visitor could not see before it: whose feed this is, which zone the
// times are in, how to subscribe, and that the data is an open format they
// can take elsewhere. A host *could* mount <ote-subscribe> next to the
// widget by hand, but had to repeat the feed URL the widget already
// fetched — so almost nobody did.

import type { FooterMode, Lang } from "./attrs.js";
import { el, withText } from "./dom.js";
import type { SubscribeLayout } from "./subscribe-attrs.js";
import { defineOteSubscribe } from "./subscribe-element.js";

const SPEC_URL = "https://opentechevents.org/spec/";

const STRINGS = {
  en: {
    sources: (count: number) => `${count} sources`,
    timesIn: (zone: string) => `Times in ${zone}`,
    mark: "Powered by OTE",
    markTitle: "Published as an Open Tech Events feed — an open format any OTE tool can read",
    footerLabel: "Feed information",
  },
  es: {
    sources: (count: number) => `${count} fuentes`,
    timesIn: (zone: string) => `Horas en ${zone}`,
    mark: "Funciona con OTE",
    markTitle: "Publicado como feed Open Tech Events — un formato abierto que cualquier herramienta OTE puede leer",
    footerLabel: "Información del feed",
  },
} as const;

/** One entry of the feed document's `alternates` (OTE Spec 0.5+). */
export interface FeedAlternate {
  mediaType?: string;
  url?: string;
}

/**
 * What the footer knows about where the rendered events came from.
 *
 * Read off the **fetched document** in element.ts, not off `PreviewFeed`:
 * `title`/`url`/`alternates` are feed-level fields that
 * `@opentechevents/preview-feed` does not carry, and adding them there
 * would make this change wait on that package being republished before the
 * embed snapshot could show it (CLAUDE.md's fifth verification check).
 */
export interface FooterFeedMeta {
  /** `feed.title`. */
  title?: string;
  /** `feed.url` — the canonical page of whoever publishes the feed. */
  url?: string;
  /** The URL the document itself was fetched from; `<ote-subscribe feed-json>`. */
  jsonUrl?: string;
  /** A declared iCalendar URL: the `feed-ics` attribute, else a `text/calendar` alternate. */
  icsUrl?: string;
  /** A declared RSS URL: the `feed-rss` attribute, else an `application/rss+xml` alternate. */
  rssUrl?: string;
  /** The host's raw `convert` attribute, passed straight through to `<ote-subscribe>`. */
  convert?: string;
  /** With `feeds="a,b,c"`: the title (or host) of each source that loaded. */
  sources?: string[];
}

export interface FooterState {
  mode: FooterMode;
  lang: Lang;
  /** The host's raw `theme` attribute, so the mounted `<ote-subscribe>` follows the widget's theme. */
  theme?: string | null;
  meta?: FooterFeedMeta;
  /**
   * `subscribe-layout`: which shape the mounted `<ote-subscribe>` takes.
   * `"badges"` is the footer's default — in a strip that already carries a
   * name and a zone, one "Subscribe" button hides which formats exist
   * behind a click. `"menu"` is for a host who wants the strip quieter, or
   * who has three generated groups and finds three pills too loud.
   */
  subscribeLayout: SubscribeLayout;
  /** `footer-mark`: whether to render the "Powered by OTE" link. */
  mark: boolean;
  /**
   * Whether any event being rendered carries a clock time. A feed of
   * date-only events renders no times, and "Times in Europe/Madrid" under
   * it is an answer to a question the page never raised.
   */
  hasTimes: boolean;
  /** Injectable for tests; otherwise read from the runtime. */
  timeZone?: string;
}

/**
 * The zone the widget's times are **actually rendered in**, which is the
 * visitor's own: every formatter in render.ts and in
 * `@opentechevents/preview-feed` passes `undefined` as the locale's time
 * zone, so a `19:00+01:00` start is converted to local time before display.
 *
 * Named with its short offset because the IANA name alone does not settle
 * it for a reader checking against a clock, and the offset alone does not
 * survive a DST boundary.
 *
 * NOTE: `formatReadableDate()` in render.ts appends the event's *declared*
 * zone — `(Europe/Madrid)` — next to a time it has already converted to
 * the visitor's zone, which contradicts this line for any visitor outside
 * that zone. That is a pre-existing defect in the per-event label, filed
 * separately: it lives in `packages/preview-feed`'s `formatDate` as well
 * and so reaches `apps/preview` too.
 */
export function resolvedTimeZoneLabel(timeZone?: string): string | undefined {
  try {
    const zone = timeZone ?? new Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!zone) return undefined;
    const offset = new Intl.DateTimeFormat("en", { timeZone: zone, timeZoneName: "shortOffset" })
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName")?.value;
    return offset ? `${zone} (${offset})` : zone;
  } catch {
    // An unknown zone name throws RangeError; a runtime without full ICU
    // can report nothing at all. Both mean "say nothing", never "guess".
    return undefined;
  }
}

/**
 * A feed-declared URL only when it is one a browser may follow. The feed
 * document is a stranger's JSON: `url` and `alternates[].url` land in an
 * `href`, and `javascript:` in an `href` is script execution on the host's
 * page. The spec constrains both to `^https?://`, so this rejects nothing a
 * valid document can say — and the widget never validates what it renders.
 *
 * Host-supplied `feed-ics`/`feed-rss` attributes are deliberately *not*
 * filtered: those come from whoever wrote the embed, the same trust level
 * as the standalone `<ote-subscribe>`'s own attributes.
 */
function httpUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/** The ICS/RSS URLs the publisher declared in `alternates` (OTE Spec 0.5+), by media type. A declared URL is what keeps `<ote-subscribe>` from generating one through the converter (#186). */
export function alternateFeedUrls(alternates: unknown): { icsUrl?: string; rssUrl?: string } {
  if (!Array.isArray(alternates)) return {};
  const find = (mediaType: string): string | undefined => {
    for (const entry of alternates as FeedAlternate[]) {
      if (typeof entry?.mediaType !== "string") continue;
      // `type/subtype; charset=…` is a legal media type; compare the essence.
      if (entry.mediaType.split(";")[0]!.trim().toLowerCase() !== mediaType) continue;
      const url = httpUrl(entry.url);
      if (url) return url;
    }
    return undefined;
  };
  const icsUrl = find("text/calendar");
  const rssUrl = find("application/rss+xml");
  return { ...(icsUrl ? { icsUrl } : {}), ...(rssUrl ? { rssUrl } : {}) };
}

/**
 * What the footer can learn from one fetched OTE document.
 *
 * `alternates` is INFORMATIONAL in the spec — a consumer "MUST NOT assume
 * exact sync, completeness or derivation". That is the right caveat for a
 * tool that *reads* the linked file; here the links are handed to a visitor
 * who asked where else this collection is published, which is what the
 * field is for. Using it also keeps the publisher's own ICS ahead of a
 * generated one, which is #186's first rule.
 */
export function footerMetaFromDocument(
  document_: Record<string, unknown> | undefined,
  jsonUrl?: string,
): FooterFeedMeta {
  const title = nonEmptyString(document_?.["title"]);
  const url = httpUrl(document_?.["url"]);
  return {
    ...(title ? { title } : {}),
    ...(url ? { url } : {}),
    ...(jsonUrl ? { jsonUrl } : {}),
    ...alternateFeedUrls(document_?.["alternates"]),
  };
}

function feedNameNode(meta: FooterFeedMeta, strings: (typeof STRINGS)[Lang]): HTMLElement | undefined {
  const sources = meta.sources ?? [];
  // feeds="a,b,c": no single document is "the" feed, so the strip names the
  // count and keeps the titles in the tooltip rather than overflowing a
  // one-line footer with them.
  if (sources.length > 1) {
    const node = withText(el("span", "footer-feed"), strings.sources(sources.length));
    node.title = sources.join(", ");
    return node;
  }
  const title = meta.title ?? sources[0];
  if (!title) return undefined;
  // Always titled: the name ellipsises in a narrow strip (theme.css.ts), so
  // the full one has to stay reachable.
  if (!meta.url) {
    const node = withText(el("span", "footer-feed"), title);
    node.title = title;
    return node;
  }
  const link = withText(el("a", "footer-feed"), title);
  link.title = title;
  link.href = meta.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

/**
 * The `<ote-subscribe>` the footer mounts — the whole point of reusing the
 * element rather than writing a second subscribe menu: `subscribe-urls.ts`
 * stays the one implementation of these URLs, and the destination ranking
 * deferred in #171 reaches the footer with no work here.
 *
 * `layout` defaults to `"badges"` rather than the single `menu` trigger: in
 * a strip that already carries a name, a zone and a mark, one "Subscribe"
 * button hides which formats exist behind a click, and the badges are what
 * the element was ported from. `subscribe-layout="menu"` is the way back —
 * a JSON-only publisher gets three generated groups, and three saturated
 * pills in a footer is a defensible thing to not want.
 *
 * Only with a `jsonUrl`, which means only for a document the widget
 * fetched. A host that assigned `.events = […]` has no feed to subscribe
 * to, and `feeds="a,b"` has no *single* one — this element takes one
 * document, and inventing a primary among several would be answering for
 * the publisher.
 */
function subscribeNode(
  meta: FooterFeedMeta,
  lang: Lang,
  theme: string | null | undefined,
  layout: SubscribeLayout,
): HTMLElement | undefined {
  if (!meta.jsonUrl) return undefined;
  // Statically imported, not lazy-loaded like calendar-layout.js: the
  // footer is default-on, so practically every consumer needs the element,
  // and a runtime import of a sibling file fails silently for anyone who
  // self-hosts ote-events.js alone — a missing subscribe control with
  // nothing in the page to say why.
  //
  // The price was measured rather than estimated: when the footer landed,
  // dist/ote-events.js went from 154,905 to 177,596 bytes (49.5KB to
  // 56.5KB gzipped) for the element, this module and the footer's CSS
  // together. `node build.mjs` prints what it costs today.
  //
  // `defineOteSubscribe()` no-ops when the host already loaded
  // dist/ote-subscribe.js itself, so the first definition wins and the two
  // copies behave identically.
  defineOteSubscribe();
  const subscribe = document.createElement("ote-subscribe");
  subscribe.className = "footer-subscribe";
  subscribe.setAttribute("layout", layout);
  subscribe.setAttribute("feed-json", meta.jsonUrl);
  subscribe.setAttribute("lang", lang);
  if (theme) subscribe.setAttribute("theme", theme);
  if (meta.title) subscribe.setAttribute("name", meta.title);
  // Precedence: what the embedder wrote, then what the document declared,
  // then whatever convert.opentechevents.org can generate. The attributes
  // win because the person who set them is the person looking at the page.
  if (meta.icsUrl) subscribe.setAttribute("feed-ics", meta.icsUrl);
  if (meta.rssUrl) subscribe.setAttribute("feed-rss", meta.rssUrl);
  // Passed through verbatim, including the empty string: `convert`'s own
  // parser distinguishes "absent/empty means default" from "any value that
  // names no format means off", and re-deciding that here would give the
  // footer a different opt-out from the standalone element's.
  if (meta.convert !== undefined && meta.convert !== null) subscribe.setAttribute("convert", meta.convert);
  return subscribe;
}

function markNode(strings: (typeof STRINGS)[Lang]): HTMLAnchorElement {
  const mark = withText(el("a", "footer-mark"), strings.mark);
  mark.href = SPEC_URL;
  mark.target = "_blank";
  mark.rel = "noopener noreferrer";
  mark.title = strings.markTitle;
  mark.setAttribute("aria-label", strings.markTitle);
  return mark;
}

/**
 * `undefined` when there is to be no footer at all — `footer="off"`, or
 * `footer="auto"` with nothing to say. Returning a node only when there is
 * one is what keeps `footer="off"` byte-identical to the pre-#68 output:
 * the scroll wrapper the budget needs is mounted by the same condition
 * (see render.ts).
 */
export function renderFooter(state: FooterState): HTMLElement | undefined {
  if (state.mode === "off") return undefined;
  const meta = state.meta ?? {};
  const knowsSomething = Boolean(meta.title || meta.url || meta.jsonUrl || (meta.sources ?? []).length > 0);
  if (state.mode === "auto" && !knowsSomething) return undefined;

  const strings = STRINGS[state.lang];
  const footer = el("div", "footer");
  footer.setAttribute("role", "contentinfo");
  footer.setAttribute("aria-label", strings.footerLabel);

  const meta_ = el("div", "footer-meta");
  const name = feedNameNode(meta, strings);
  if (name) meta_.append(name);
  const zone = state.hasTimes ? resolvedTimeZoneLabel(state.timeZone) : undefined;
  if (zone) meta_.append(withText(el("span", "footer-zone"), strings.timesIn(zone)));
  if (meta_.childElementCount > 0) footer.append(meta_);

  const actions = el("div", "footer-actions");
  const subscribe = subscribeNode(meta, state.lang, state.theme, state.subscribeLayout);
  if (subscribe) actions.append(subscribe);
  if (state.mark) actions.append(markNode(strings));
  if (actions.childElementCount > 0) footer.append(actions);

  // Every part is conditional, so "all of them absent" is reachable:
  // footer-mark="off" on a host-app render with date-only events. A strip
  // that is nothing but a top border is worse than no strip.
  return footer.childElementCount > 0 ? footer : undefined;
}
