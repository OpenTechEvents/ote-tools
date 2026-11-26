import { oteJsonToPreviewFeed } from "@opentechevents/preview-feed";
import type {
  OteJsonFeed,
  OteJsonPreviewInput,
  PreviewEvent,
  PreviewFeed,
} from "@opentechevents/preview-feed";

import {
  parseCardWidth,
  parseDensity,
  parseMaxHeight,
  resolveCompact,
  parseDetailFields,
  parseCalendarAttributes,
  parseFields,
  parseFeedsAttr,
  parseFooter,
  parseFooterMark,
  parseEventActions,
  parseEventClick,
  parseGroupEvents,
  parseLangAttr,
  parseLayout,
  parseEventId,
  parseLimit,
  parseShowPast,
  parseSort,
  parseViews,
  resolveActiveView,
  resolveLang,
  type Layout,
} from "./attrs.js";
import {
  renderEventModal,
  renderWidget,
  renderWidgetHeader,
  resolveEventGroups,
  selectVisibleEvents,
  type EventActionsInput,
  type EventBadgesResolver,
  type EventClassNameResolver,
  type EventFeedSource,
  type EventRenderContext,
  type OriginalOteEvent,
  type WidgetState,
} from "./render.js";
import { footerMetaFromDocument, type FooterFeedMeta } from "./footer.js";
import { parseSubscribeLayout } from "./subscribe-attrs.js";
import { WIDGET_CSS } from "./theme.css.js";

import type { HeaderDensity } from "./header.js";

type Status = "idle" | "loading" | "loaded" | "error";
type CalendarHandle = {
  destroy(): void;
  currentDate(): string | undefined;
  prev(): void;
  next(): void;
  today(): void;
};

export interface OteEventsFeedObject extends Omit<OteJsonFeed, "events"> {
  events?: OriginalOteEvent[];
  [key: string]: unknown;
}

export type OteEventsFeedData = OteEventsFeedObject | OriginalOteEvent[];

/**
 * `<ote-events feed="..." limit="..." theme="auto" lang="auto" show-past="true" layout="calendar" fields="..." group-events="...">`
 *
 * Fetches a native OTE JSON feed client-side and renders upcoming events.
 * Deliberately JSON-only (not ICS/RSS): OTE's canonical publish format is
 * JSON, and pulling in the ICS/RSS converters here would drag their heavier
 * deps (ical.js, DOMParser-based XML parsing) into this bundle for a case
 * the acceptance criteria doesn't call for. See apps/embed/CLAUDE.md.
 *
 * `feeds="url1,url2,..."` fetches multiple OTE feeds in parallel and renders
 * their events combined, sorted/filtered/limited together as one list. It
 * takes full precedence over `feed` when present and non-empty (not merged
 * with it — same "full replacement" precedent as `fields`); `feed` remains
 * the single-URL case, unchanged. A feed that fails to fetch is dropped and
 * the rest still render; the error state only appears if every feed fails.
 * Each merged event is tagged with `_feedUrl`/`_feedTitle` (unless the
 * source already set its own), so `EventRenderContext.feed` and the
 * `ote-event-open`/`ote-event-action` DOM events still attribute each event
 * to the feed it came from.
 */
export class OteEventsElement extends HTMLElement {
  static observedAttributes = [
    "feed",
    "feeds",
    "event-id",
    "limit",
    "theme",
    "lang",
    "show-past",
    "layout",
    "fields",
    "fields-preview",
    "fields-detail",
    "card-width",
    "group-events",
    "placeholder-image",
    "event-click",
    "event-actions",
    "sort",
    "empty-message",
    "max-per-day",
    "initial-date",
    "responsive",
    "max-height",
    "density",
    "footer",
    // Three footer passthroughs, read by the <ote-subscribe> the footer
    // mounts. `convert` is the one that matters: with the footer on by
    // default, it is the publisher's only way to say "do not build
    // convert.opentechevents.org URLs for my visitors" (#186), and a lever
    // the publisher cannot reach is not a lever.
    "convert",
    "feed-ics",
    "feed-rss",
    "subscribe-layout",
    "footer-mark",
    // `views` (#183): which views the visitor may switch between. Observed
    // like any other, so a host can turn the row off — or narrow it — at
    // runtime.
    "views",
  ];

  #styleEl: HTMLStyleElement;
  #container: HTMLElement;
  #feed: PreviewFeed | undefined;
  #runtimeData: OteEventsFeedData | undefined;
  #runtimeDataOverride = false;
  #originalEvents: OriginalOteEvent[] = [];
  #feedSource: EventFeedSource | undefined;
  /** What the footer knows about the fetched document — title, publisher page, declared alternates. Attribute-driven parts are merged in #buildState(). */
  #feedMeta: FooterFeedMeta | undefined;
  #contexts = new WeakMap<PreviewEvent, EventRenderContext>();
  #status: Status = "idle";
  #errorMessage = "";
  #requestId = 0;
  #selectedEvent: WidgetState["selectedEvent"];
  #customEventActions: EventActionsInput = [];
  #eventClassName: EventClassNameResolver | undefined;
  #eventBadges: EventBadgesResolver | undefined;

  #calendarHandle: CalendarHandle | undefined;
  #calendarRequestId = 0;
  #calendarCssInjected = false;
  // The month the visitor last paged to. Every #renderNow() replaces
  // `.calendar-host` and so remounts the calendar — any attribute change,
  // a new feed, a `.events` assignment — and without this the calendar
  // would snap back to its `initial-date` each time, which
  // `initial-date="next-event"` makes very visible: page to June, change an
  // attribute, land back in March. (Opening a detail modal no longer
  // re-renders at all; see #renderModalNow().)
  #calendarDate: string | undefined;

  /**
   * The view the visitor picked in the switcher (#183), outranking the
   * `layout` attribute until the host re-states it.
   *
   * Visitor-held state in a widget that is deliberately stateless from the
   * host's point of view (apps/embed/CLAUDE.md), and it stays in memory
   * only: nothing is written to `localStorage` or to the host page's URL.
   * Whether visitor chrome may touch the host's URL is the open half of
   * #176, and a widget that answered it unilaterally — on someone else's
   * page, in a third-party iframe — would be answering for them. A host
   * that wants the choice remembered has `ote-view-change` and the
   * `layout` attribute.
   */
  #selectedView: Layout | undefined;

  /**
   * What the header row can afford to show, and what the mounted calendar
   * has told it (#183).
   *
   * The density is **measured**, not asked of a media query: one inside a
   * shadow root follows the viewport, and this widget lives in a column.
   * `#fitHeader()` renders at `full` and steps down only while the row
   * actually overflows, so a long title, a translated label or a host's
   * larger `--ote-font-size` all count without anything listing them.
   */
  #headerDensity: HeaderDensity = "full";
  #calendarTitle: string | undefined;
  #calendarShowsToday = false;
  #headerObserver: ResizeObserver | undefined;
  #headerWidth: number | undefined;
  #fitScheduled = false;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    this.#styleEl = document.createElement("style");
    this.#styleEl.textContent = WIDGET_CSS;
    this.#container = document.createElement("div");
    this.#container.className = "ote-events";
    root.append(this.#styleEl, this.#container);
  }

  connectedCallback(): void {
    // The header's density follows the widget's own width, which only a
    // ResizeObserver can report: a media query inside a shadow root
    // follows the viewport instead, and this widget lives in a column.
    // The observer re-fits an existing row rather than re-rendering, so a
    // host resizing its layout never remounts the calendar.
    if (!this.#headerObserver && typeof ResizeObserver !== "undefined") {
      this.#headerObserver = new ResizeObserver((entries) => {
        // Width only, and only when it actually moved. Re-fitting changes
        // the row's *height* (a select is not a segmented group), which
        // would resize this element and deliver another notification —
        // the feedback loop Chrome reports as "ResizeObserver loop
        // completed with undelivered notifications", measured here before
        // this guard existed. A host page's error reporting sees that.
        const width = entries[0]?.contentRect.width ?? this.clientWidth;
        if (width === this.#headerWidth) return;
        this.#headerWidth = width;
        // Out of the delivery itself, on the next frame: measuring and
        // restyling inside the callback is what makes Chrome report
        // "ResizeObserver loop completed with undelivered notifications",
        // and a host page's error reporting sees that.
        this.#scheduleFit();
      });
      this.#headerObserver.observe(this);
    }
    if (this.#runtimeDataOverride) this.#renderNow();
    else void this.#load();
  }

  disconnectedCallback(): void {
    this.#headerObserver?.disconnect();
    this.#headerObserver = undefined;
    this.#teardownCalendar();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (!this.isConnected) return;
    if (name === "feed" || name === "feeds") {
      this.#calendarDate = undefined;
      void this.#load();
    } else if (name === "layout" || name === "views") {
      // The host *moving* either of these is newer than the visitor's
      // click, so it wins: `layout` is documented as the *initial*
      // selection, and a `views` that no longer contains the pick would
      // leave the switcher with no pressed button.
      //
      // Writing the same value again is not moving it, and the DOM fires
      // this callback either way. A host that re-applies its whole
      // configuration on every change — the playground does, and it is the
      // shape any framework render produces — would otherwise throw the
      // visitor back to `layout` on an unrelated keystroke.
      if (oldValue !== newValue) this.#selectedView = undefined;
      this.#renderNow();
    } else {
      this.#renderNow();
    }
  }

  get feedData(): OteEventsFeedData | undefined {
    return this.#runtimeData;
  }

  set feedData(value: OteEventsFeedData | null | undefined) {
    this.#setRuntimeData(value);
  }

  get events(): OriginalOteEvent[] | undefined {
    if (!this.#runtimeData) return undefined;
    return Array.isArray(this.#runtimeData) ? this.#runtimeData : this.#runtimeData.events;
  }

  set events(value: OriginalOteEvent[] | null | undefined) {
    this.#setRuntimeData(value);
  }

  get event(): OriginalOteEvent | undefined {
    return this.events?.[0];
  }

  set event(value: OriginalOteEvent | null | undefined) {
    this.#setRuntimeData(value == null ? value : [value]);
  }

  get eventActions(): EventActionsInput {
    return this.#customEventActions;
  }

  set eventActions(value: EventActionsInput | null | undefined) {
    this.#customEventActions = Array.isArray(value) || typeof value === "function" ? value : [];
    if (this.isConnected) this.#renderNow();
  }

  get eventClassName(): EventClassNameResolver | undefined {
    return this.#eventClassName;
  }

  set eventClassName(value: EventClassNameResolver | null | undefined) {
    this.#eventClassName = typeof value === "function" ? value : undefined;
    if (this.isConnected) this.#renderNow();
  }

  get eventBadges(): EventBadgesResolver | undefined {
    return this.#eventBadges;
  }

  set eventBadges(value: EventBadgesResolver | null | undefined) {
    this.#eventBadges = typeof value === "function" ? value : undefined;
    if (this.isConnected) this.#renderNow();
  }

  #resolveFeedUrls(): string[] {
    const feedUrls = parseFeedsAttr(this.getAttribute("feeds"));
    if (feedUrls.length > 0) return feedUrls;
    const feedUrl = this.getAttribute("feed");
    return feedUrl ? [feedUrl] : [];
  }

  async #load(): Promise<void> {
    if (this.#runtimeDataOverride) return;

    const feedUrls = this.#resolveFeedUrls();
    if (feedUrls.length === 0) {
      this.#status = "error";
      this.#errorMessage = 'Missing required "feed" or "feeds" attribute.';
      this.#selectedEvent = undefined;
      this.#renderNow();
      return;
    }

    this.#status = "loading";
    this.#renderNow();

    // Guards against a slow earlier request overwriting a newer one when the
    // `feed`/`feeds` attribute changes twice in quick succession.
    const requestId = ++this.#requestId;
    const settled = await Promise.allSettled(feedUrls.map(fetchFeedData));
    if (requestId !== this.#requestId) return;

    const fulfilled = settled.filter(
      (result): result is PromiseFulfilledResult<FeedFetchResult> => result.status === "fulfilled",
    );
    // Best-effort: a feed that fails to fetch is dropped rather than failing
    // the whole widget, as long as at least one of the requested feeds loads.
    if (fulfilled.length === 0) {
      this.#status = "error";
      this.#errorMessage =
        feedUrls.length === 1
          ? rejectionMessage((settled[0] as PromiseRejectedResult).reason)
          : settled
              .map((result, i) => `${feedUrls[i]}: ${rejectionMessage((result as PromiseRejectedResult).reason)}`)
              .join("; ");
      this.#selectedEvent = undefined;
      this.#renderNow();
      return;
    }

    try {
      const runtimeData = mergeFeedResults(fulfilled.map((result) => result.value));
      const feed = oteJsonToPreviewFeed(runtimeData as OteJsonPreviewInput);
      this.#feed = feed;
      this.#runtimeData = runtimeData;
      this.#runtimeDataOverride = false;
      this.#originalEvents = originalEvents(runtimeData);
      this.#feedSource = fulfilled.length === 1 ? feedSource(runtimeData, fulfilled[0]!.value.url) : undefined;
      this.#feedMeta = feedMetaFromResults(fulfilled.map((result) => result.value));
      this.#contexts = buildContexts(feed, this.#originalEvents, this.#feedSource);
      this.#status = "loaded";
      this.#selectedEvent = undefined;
    } catch (error) {
      this.#status = "error";
      this.#errorMessage = error instanceof Error ? error.message : String(error);
      this.#selectedEvent = undefined;
      this.#feedMeta = undefined;
    }
    this.#renderNow();
  }

  #setRuntimeData(value: OteEventsFeedData | null | undefined): void {
    this.#requestId++;

    if (value == null) {
      this.#runtimeData = undefined;
      this.#runtimeDataOverride = false;
      this.#feed = undefined;
      this.#originalEvents = [];
      this.#feedSource = undefined;
      this.#feedMeta = undefined;
      this.#contexts = new WeakMap();
      this.#errorMessage = "";
      this.#selectedEvent = undefined;
      if (this.isConnected) void this.#load();
      return;
    }

    this.#runtimeData = value;
    this.#runtimeDataOverride = true;
    try {
      this.#feed = oteJsonToPreviewFeed(value as OteJsonPreviewInput);
      this.#originalEvents = originalEvents(value);
      this.#feedSource = feedSource(value);
      // A host app's own array has no document and no URL: whatever title
      // the object carries is all the footer gets, and there is nothing to
      // subscribe to. `footer="auto"` is the attribute for that case.
      this.#feedMeta = footerMetaFromDocument(Array.isArray(value) ? undefined : value);
      this.#contexts = buildContexts(this.#feed, this.#originalEvents, this.#feedSource);
      this.#status = "loaded";
      this.#errorMessage = "";
      this.#selectedEvent = undefined;
    } catch (error) {
      this.#feed = undefined;
      this.#originalEvents = [];
      this.#feedSource = undefined;
      this.#feedMeta = undefined;
      this.#contexts = new WeakMap();
      this.#status = "error";
      this.#errorMessage = error instanceof Error ? error.message : String(error);
      this.#selectedEvent = undefined;
    }
    if (this.isConnected) this.#renderNow();
  }

  #renderNow(): void {
    // Set on the host element itself (not inside the shadow root): a custom
    // property set here is still visible to the shadow tree it hosts, and
    // this is the one piece of layout.cards config that's genuinely a CSS
    // concern (--ote-card-min-width), not widget state.
    this.style.setProperty("--ote-card-min-width", parseCardWidth(this.getAttribute("card-width")));
    // `max-height` is applied the same way, and for the same reason: it is a
    // CSS concern, not widget state. The `data-bounded` marker is what turns
    // the scroll plumbing on — a stylesheet cannot test whether a custom
    // property is set, and the plumbing must stay off by default so an
    // unbounded widget keeps laying out exactly as it did before.
    // The layout always travels to the stylesheet, because layout="cards"
    // scrolls a different element from the other two and CSS cannot ask
    // which layout rendered. It is not gated on the budget: a host that
    // sizes the element with plain CSS (`ote-events { height: 400px }`)
    // gets the same treatment as one that sets `max-height`.
    // Built before the attributes below because the *active* view is state
    // now, not just an attribute: with a switcher, `data-layout` has to
    // name the view the visitor picked (see #activeView()).
    const state = this.#buildState();
    this.#container.setAttribute("data-layout", state.layout);
    const maxHeight = parseMaxHeight(this.getAttribute("max-height"));
    if (maxHeight === undefined) {
      this.style.removeProperty("--ote-max-height");
      this.#container.removeAttribute("data-bounded");
    } else {
      this.style.setProperty("--ote-max-height", maxHeight);
      this.#container.setAttribute("data-bounded", "");
    }
    renderWidget(this.#container, state);
    // The header is measured, not queried: see #fitHeader().
    this.#fitHeader();

    if (state.layout === "calendar" && state.status === "loaded") {
      const events = selectVisibleEvents(state);
      if (events.length > 0) {
        void this.#mountCalendar(events, state.lang, maxHeight !== undefined, this.#hasDefiniteHeight());
        return;
      }
    }
    this.#teardownCalendar();
  }

  /**
   * Render the detail modal without re-rendering the list or remounting the
   * calendar. Only safe as a follow-up to a `#renderNow()` whose output is
   * still on screen, which is exactly where the modal is opened and closed
   * from. See `renderEventModal()` in `render.ts` for why it exists.
   */
  #renderModalNow(): void {
    renderEventModal(this.#container, this.#buildState());
  }

  #buildState(): WidgetState {
    const lang = resolveLang(parseLangAttr(this.getAttribute("lang")), navigator.language);
    const state: WidgetState = {
      status: this.#status,
      errorMessage: this.#errorMessage,
      feed: this.#feed,
      lang,
      limit: parseLimit(this.getAttribute("limit")),
      eventId: parseEventId(this.getAttribute("event-id")),
      showPast: parseShowPast(this.getAttribute("show-past")),
      sort: parseSort(this.getAttribute("sort")),
      layout: this.#activeView(),
      views: this.#views(),
      onViewSelect: (view) => this.#selectView(view),
      headerDensity: this.#headerDensity,
      // The month nav belongs to the calendar and to nothing else: `list`
      // and `cards` have no month to page.
      ...(this.#activeView() === "calendar"
        ? {
            calendarNav: {
              ...(this.#calendarTitle !== undefined ? { title: this.#calendarTitle } : {}),
              showsToday: this.#calendarShowsToday,
              onNav: (action: "prev" | "next" | "today") => {
                // Straight to the mounted calendar, never through a
                // re-render: #renderNow() replaces `.calendar-host` and so
                // remounts the month, which would undo the navigation it
                // was asked to perform.
                this.#calendarHandle?.[action]();
              },
            },
          }
        : {}),
      previewFields: parseFields(this.getAttribute("fields-preview") ?? this.getAttribute("fields")),
      detailFields: parseDetailFields(this.getAttribute("fields-detail") ?? this.getAttribute("fields")),
      groupEvents: parseGroupEvents(this.getAttribute("group-events")),
      placeholderImage: this.getAttribute("placeholder-image")?.trim() || undefined,
      emptyMessage: this.getAttribute("empty-message")?.trim() || undefined,
      footer: parseFooter(this.getAttribute("footer")),
      footerMeta: this.#footerMeta(),
      // Defaulted to "badges" here, not to <ote-subscribe>'s own "menu":
      // the standalone element is a button a host places deliberately,
      // while the footer's is one of four things in a strip, where naming
      // the formats costs nothing and a single "Subscribe" hides them.
      footerSubscribeLayout: parseSubscribeLayout(this.getAttribute("subscribe-layout") ?? "badges"),
      footerMark: parseFooterMark(this.getAttribute("footer-mark")),
      theme: this.getAttribute("theme"),
      eventClick: parseEventClick(this.getAttribute("event-click")),
      eventActions: this.#eventActionsWithAttributeDefaults(),
      eventClassName: this.#eventClassName,
      eventBadges: this.#eventBadges,
      eventContext: (event) => this.#contexts.get(event) ?? { previewEvent: event, index: -1 },
      selectedEvent: this.#selectedEvent,
      onEventOpen: (event) => {
        this.dispatchEvent(
          new CustomEvent("ote-event-open", { detail: this.#domEventDetail(undefined, event, state) }),
        );
        if (parseEventClick(this.getAttribute("event-click")) === "modal") {
          this.#selectedEvent = event;
          this.#renderModalNow();
        }
      },
      onEventClose: () => {
        this.#selectedEvent = undefined;
        this.#renderModalNow();
      },
      onEventAction: (action, event) => {
        const actionId = typeof action === "string" ? action : "type" in action ? action.type : action.id;
        this.dispatchEvent(
          new CustomEvent("ote-event-action", { detail: this.#domEventDetail(actionId, event, state) }),
        );
      },
    };
    return state;
  }

  /**
   * The views the switcher offers (#183).
   *
   * Absent `views` defaults to all three — which changes the rendered
   * output of every embed that moves its pin, the reason this is a minor —
   * **except** for a host app driving the widget through `.events = […]` or
   * `.event = …`. OTE Reader already sets `event-actions="none"` and
   * `sort="none"` and owns its own view chrome; a second switcher inside
   * the widget would be a duplicate control it never asked for, and that
   * consumer has no feed URL to re-render from either. An explicit `views`
   * attribute turns it on there, which is what makes the default a default
   * and not a rule.
   */
  #views(): Layout[] {
    const attr = this.getAttribute("views");
    if (attr === null) return this.#runtimeDataOverride ? [] : parseViews(null);
    return parseViews(attr);
  }

  /** The view this render shows: the visitor's pick, else `layout`. See `resolveActiveView`. */
  #activeView(): Layout {
    return resolveActiveView(this.#views(), parseLayout(this.getAttribute("layout")), this.#selectedView);
  }

  /**
   * A click (or Enter/Space) on a switcher button.
   *
   * Re-renders through the ordinary path, which is what makes
   * `calendar-layout.js` still load on demand: #renderNow() mounts the
   * calendar exactly when the active view is `calendar`, so a visitor
   * switching to it from a cold `list` render fetches the chunk then and
   * not before. The remembered month survives the round trip
   * (`#calendarDate`), so switching away and back returns to where the
   * visitor was.
   *
   * Focus is put back on the pressed button because `renderWidget()`
   * starts with `replaceChildren()`: the node that was focused is gone by
   * the time the new row exists, and a keyboard visitor who pressed
   * "List" would otherwise land back at the top of the document.
   */
  #selectView(view: Layout): void {
    const previous = this.#activeView();
    if (view === previous) return;
    this.#selectedView = view;
    this.#renderNow();
    this.#container
      .querySelector<HTMLElement>(`.view-switcher .view-button[data-view="${view}"]`)
      ?.focus();
    // The widget persists nothing itself, so this event is the only way a
    // host can mirror the visitor's choice (into its own storage, its URL,
    // or a second widget). `composed` so it crosses the shadow boundary
    // like the other two.
    this.dispatchEvent(
      new CustomEvent("ote-view-change", {
        detail: { view, previousView: previous },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * The document-derived footer metadata with the host's attributes layered
   * on top. The attributes win: `feed-ics`/`feed-rss` are written by
   * whoever wrote the embed, and a declared URL beats a generated one
   * (#186's first rule) one level further out than `<ote-subscribe>` can
   * see.
   */
  #footerMeta(): FooterFeedMeta | undefined {
    const meta = this.#feedMeta;
    const icsUrl = this.getAttribute("feed-ics")?.trim();
    const rssUrl = this.getAttribute("feed-rss")?.trim();
    const convert = this.getAttribute("convert");
    if (!meta && !icsUrl && !rssUrl) return undefined;
    return {
      ...meta,
      ...(icsUrl ? { icsUrl } : {}),
      ...(rssUrl ? { rssUrl } : {}),
      ...(convert !== null ? { convert } : {}),
    };
  }

  /**
   * Whether the host has given this element a **definite** height — a CSS
   * `height`, or a flex/grid parent handing it a track — rather than
   * letting it size to its content.
   *
   * It cannot be asked of CSS and it cannot be read off `getComputedStyle`,
   * which reports the used value and so answers with the content height in
   * both cases. So it is probed: collapse the root and see whether the host
   * still has a height of its own. Synchronous, with the inline style put
   * back before anything can paint.
   *
   * It decides whether a month's weeks may *grow* into spare room. Only a
   * definite height has spare room to share; against an auto height the
   * same `1fr` track resolves against the tallest week's content and blows
   * the calendar up — measured at 4867px for a month that should be 529px,
   * which is the trap apps/embed/CLAUDE.md warns about.
   *
   * `max-height` deliberately reads as *not* definite: it is a ceiling, not
   * a height, so a month shorter than the budget must stay short rather
   * than stretch to fill it.
   */
  #hasDefiniteHeight(): boolean {
    const previous = this.#container.style.height;
    this.#container.style.height = "0px";
    const height = this.clientHeight;
    this.#container.style.height = previous;
    return height > 1;
  }

  /**
   * `layout="calendar"` is lazy-loaded: `calendar-layout.js` is its own
   * esbuild entry point, never statically imported by main.ts, fetched here
   * by a URL relative to this running script — not esbuild's `splitting`
   * feature, which this repo has no precedent for. See apps/embed/CLAUDE.md.
   */
  async #mountCalendar(
    events: ReturnType<typeof selectVisibleEvents>,
    lang: WidgetState["lang"],
    bounded: boolean,
    fillsHeight: boolean,
  ): Promise<void> {
    this.#teardownCalendar();
    const requestId = ++this.#calendarRequestId;
    try {
      // A non-literal import() specifier: esbuild leaves this as a genuine
      // runtime dynamic import rather than trying to statically bundle it.
      const module = (await import(
        new URL("./calendar-layout.js", import.meta.url).href
      )) as typeof import("./calendar-layout.js");
      if (requestId !== this.#calendarRequestId || !this.isConnected) return;

      if (!this.#calendarCssInjected) {
        this.#styleEl.textContent += module.CALENDAR_CSS;
        this.#calendarCssInjected = true;
      }
      const host = this.#container.querySelector<HTMLElement>(".calendar-host");
      if (!host) return;
      host.classList.remove("ec-dark", "ec-auto-dark");
      const theme = this.getAttribute("theme");
      if (theme === "dark") host.classList.add("ec-dark");
      else if (theme !== "light") host.classList.add("ec-auto-dark");
      host.replaceChildren(); // clear the "Loading…" placeholder before mounting
      this.#calendarHandle = module.renderCalendar(host, events, {
        lang,
        bounded,
        fillsHeight,
        compact: resolveCompact(parseDensity(this.getAttribute("density")), bounded || fillsHeight),
        ...parseCalendarAttributes((name) => this.getAttribute(name), this.#calendarDate),
        // The header's month title and Today state, straight from the
        // library's own rendered view — recomputing them from the date
        // would get the narrow `list` fallback wrong, which titles a range
        // of days rather than a month. Applied to the existing row rather
        // than through #renderNow(), which would remount this calendar and
        // lose the month it was just asked to move to.
        onDatesSet: ({ title, showsToday }) => {
          this.#calendarTitle = title;
          this.#calendarShowsToday = showsToday;
          this.#updateNav();
        },
        onEventClick: (event) => {
          const eventClick = parseEventClick(this.getAttribute("event-click"));
          this.dispatchEvent(new CustomEvent("ote-event-open", { detail: this.#domEventDetail(undefined, event) }));
          if (eventClick === "link" && event.link) {
            window.open(event.link, "_blank", "noopener");
          } else if (eventClick === "modal") {
            this.#selectedEvent = event;
            this.#renderModalNow();
          }
        },
      });
    } catch (error) {
      if (requestId !== this.#calendarRequestId || !this.isConnected) return;
      const host = this.#container.querySelector<HTMLElement>(".calendar-host");
      if (host) host.textContent = error instanceof Error ? error.message : String(error);
    }
  }

  /**
   * The month title and the Today button, updated in place.
   *
   * Everything else in this widget re-renders; this cannot. `#renderNow()`
   * replaces `.calendar-host`, which remounts the calendar — so applying a
   * month change that way would throw away the month change. Same reasoning
   * as `#renderModalNow()`.
   */
  #updateNav(): void {
    const title = this.#container.querySelector<HTMLElement>(".header-title");
    if (title && this.#calendarTitle !== undefined) title.textContent = this.#calendarTitle;
    const today = this.#container.querySelector<HTMLButtonElement>(".header-today");
    if (today) today.disabled = this.#calendarShowsToday;
    for (const arrow of this.#container.querySelectorAll<HTMLButtonElement>(".header-arrow")) {
      arrow.disabled = this.#calendarTitle === undefined;
    }
    // The month is the widest thing in the row and it arrives *after* the
    // row is first measured — the lazy calendar chunk reports it. Without
    // this, a 400px widget kept its view labels while "November 2026" was
    // pushing the nav 92px past its box (measured).
    this.#scheduleFit();
  }

  /**
   * Step the header down until it stops overflowing: labels, then icons,
   * then a native `<select>`.
   *
   * Measured rather than queried, because a media query inside a shadow
   * root follows the **viewport** and this widget is usually in a column —
   * the #169 mistake, which this row re-made once already. Measuring also
   * means a Spanish label, a long month name and a host's own
   * `--ote-font-size` all count without any of them being listed anywhere.
   *
   * It always restarts from `full`, so a widget that grows gets its labels
   * back. Only the `menu` step rebuilds DOM, and it rebuilds the header
   * alone — never the widget, whose calendar would remount with it.
   */
  /** One fit per frame, however many notifications arrive in it. */
  #scheduleFit(): void {
    if (this.#fitScheduled) return;
    this.#fitScheduled = true;
    const run = (): void => {
      this.#fitScheduled = false;
      if (this.isConnected) this.#fitHeader();
    };
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
    else run();
  }

  #fitHeader(): void {
    // Not until the row holds what it will hold. The month is the widest
    // thing in it and the lazy calendar chunk reports it a few frames
    // after the row is built, so measuring before it lands decides the
    // density against a title that is still empty — measured as the same
    // widget keeping its labels at 460px and dropping them at 420px,
    // purely on which render won the race. In `list`/`cards` there is no
    // title to wait for.
    if (this.#activeView() === "calendar" && this.#calendarTitle === undefined) {
      this.#container.setAttribute("data-header", this.#headerDensity);
      return;
    }
    for (const density of ["full", "icons", "menu"] as const) {
      if (density !== this.#headerDensity) {
        const wasMenu = this.#headerDensity === "menu";
        this.#headerDensity = density;
        // The first two steps are the same DOM with a different stylesheet
        // branch; only the select is a different control.
        if (density === "menu" || wasMenu) this.#renderHeaderNow();
      }
      this.#container.setAttribute("data-header", density);
      const header = this.#container.querySelector<HTMLElement>(".ote-header");
      if (!header) return;
      // The row and the nav group both, because the squeeze shows up in
      // whichever of them ran out first: a flex item cannot shrink below
      // its min-content width, so when the nav's buttons stop fitting it
      // is the nav that overflows while the row around it still "fits".
      // And `.header-title` has a min-width (theme.css.ts) so that a title
      // free to shrink to nothing cannot absorb the squeeze silently.
      if (!overflows(header) && !overflows(header.querySelector(".header-nav"))) return;
    }
  }

  /**
   * Replace the header row alone, leaving the events and the mounted
   * calendar untouched — the `#renderModalNow()` pattern, for the one
   * density step that changes the DOM.
   */
  #renderHeaderNow(): void {
    const existing = this.#container.querySelector<HTMLElement>(".ote-header");
    if (!existing) return;
    this.#container.setAttribute("data-header", this.#headerDensity);
    const rendered = renderWidgetHeader(this.#buildState());
    if (rendered) existing.replaceWith(rendered);
    this.#updateNav();
  }

  #eventActionsWithAttributeDefaults(): EventActionsInput {
    const attributeActions = parseEventActions(this.getAttribute("event-actions"));
    const customActions = this.#customEventActions;
    if (typeof customActions === "function") {
      return (context) => [...attributeActions, ...customActions(context)];
    }
    return [...attributeActions, ...customActions];
  }

  #domEventDetail(action: string | undefined, event: PreviewEvent, state?: WidgetState): Record<string, unknown> {
    const context = this.#contexts.get(event) ?? { previewEvent: event, index: -1 };
    // `state` is only passed from the cards/list render path; the calendar
    // layout's click handler omits it since grouping never applies there
    // (resolveEventGroups is gated on layout==="cards" anyway).
    const group = state ? resolveEventGroups(state).infoOf.get(event) : undefined;
    return {
      ...(action ? { action } : {}),
      event,
      previewEvent: event,
      originalEvent: context.originalEvent,
      index: context.index,
      feed: context.feed,
      source: context.source,
      ...(group ? { group } : {}),
    };
  }

  #teardownCalendar(): void {
    this.#calendarRequestId++;
    this.#calendarDate = this.#calendarHandle?.currentDate() ?? this.#calendarDate;
    this.#calendarHandle?.destroy();
    this.#calendarHandle = undefined;
  }
}

/** Whether an element's content needs more room than it has. */
function overflows(node: Element | null): boolean {
  return node !== null && node.scrollWidth > node.clientWidth + 1;
}

function originalEvents(input: OteEventsFeedData): OriginalOteEvent[] {
  return Array.isArray(input) ? input : Array.isArray(input.events) ? input.events : [];
}

interface FeedFetchResult {
  url: string;
  data: OteEventsFeedData;
}

async function fetchFeedData(url: string): Promise<FeedFetchResult> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const text = await response.text();
  return { url, data: JSON.parse(text) as OteEventsFeedData };
}

function rejectionMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}

/**
 * A single successfully-fetched feed passes through untouched, so `feed="..."`
 * (and a `feeds="..."` with just one URL, or where all but one failed) keeps
 * its exact pre-existing shape and behavior. Combining 2+ feeds tags each
 * event with `_feedUrl`/`_feedTitle` (unless the source already set its own —
 * see apps/embed/CLAUDE.md's "custom event actions" section on that private
 * metadata contract), so `buildContexts()` below can still attribute every
 * merged event to the feed it came from.
 */
function mergeFeedResults(results: FeedFetchResult[]): OteEventsFeedData {
  if (results.length === 1) return results[0]!.data;
  return {
    events: results.flatMap(({ url, data }) => {
      const feedTitle = !Array.isArray(data) ? stringMeta(data.title) : undefined;
      return originalEvents(data).map((event) => ({
        ...event,
        _feedUrl: stringMeta(event["_feedUrl"]) ?? url,
        ...(!stringMeta(event["_feedTitle"]) && feedTitle ? { _feedTitle: feedTitle } : {}),
      }));
    }),
  };
}

function stringMeta(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function feedSource(input: OteEventsFeedData, url?: string): EventFeedSource | undefined {
  const firstEvent = originalEvents(input)[0];
  const title = !Array.isArray(input) ? stringMeta(input.title ?? input["_feedTitle"]) : undefined;
  const source = {
    url: url ?? stringMeta(firstEvent?.["_feedUrl"]),
    title: title ?? stringMeta(firstEvent?.["_feedTitle"]),
  };
  return source.url || source.title ? source : undefined;
}

/**
 * The footer's view of what loaded. One feed is the document itself; two or
 * more have no single title, URL or subscribe target, so the strip names
 * the count and keeps each source's own name (falling back to its host) for
 * the tooltip — see footer.ts#feedNameNode.
 */
function feedMetaFromResults(results: FeedFetchResult[]): FooterFeedMeta {
  if (results.length === 1) {
    const { url, data } = results[0]!;
    return footerMetaFromDocument(Array.isArray(data) ? undefined : data, url);
  }
  return {
    sources: results.map(({ url, data }) => {
      const title = Array.isArray(data) ? undefined : stringMeta(data.title);
      return title ?? hostOf(url) ?? url;
    }),
  };
}

function hostOf(url: string): string | undefined {
  try {
    return new URL(url, location.href).host || undefined;
  } catch {
    return undefined;
  }
}

function buildContexts(
  feed: PreviewFeed,
  originals: OriginalOteEvent[],
  source: EventFeedSource | undefined,
): WeakMap<PreviewEvent, EventRenderContext> {
  const contexts = new WeakMap<PreviewEvent, EventRenderContext>();
  feed.events.forEach((previewEvent, index) => {
    const originalEvent = originals[index];
    const eventFeed = {
      url: stringMeta(originalEvent?.["_feedUrl"]) ?? source?.url,
      title: stringMeta(originalEvent?.["_feedTitle"]) ?? source?.title,
    };
    contexts.set(previewEvent, {
      previewEvent,
      originalEvent,
      index,
      feed: eventFeed.url || eventFeed.title ? eventFeed : source,
      source: originalEvent?.source,
    });
  });
  return contexts;
}

// theme="light"/"dark"/"auto" needs no JS branch: theme.css.ts's :host()
// selectors read the attribute directly, so setting it just works via CSS.

export function defineOteEvents(): void {
  if (!customElements.get("ote-events")) {
    customElements.define("ote-events", OteEventsElement);
  }
}
