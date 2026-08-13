import { oteJsonToPreviewFeed } from "@opentechevents/preview-feed";
import type {
  OteJsonFeed,
  OteJsonPreviewInput,
  PreviewEvent,
  PreviewFeed,
} from "@opentechevents/preview-feed";

import {
  parseCardWidth,
  parseDetailFields,
  parseFields,
  parseFeedsAttr,
  parseEventActions,
  parseEventClick,
  parseGroupEvents,
  parseLangAttr,
  parseLayout,
  parseLimit,
  parseShowPast,
  parseSort,
  resolveLang,
} from "./attrs.js";
import {
  renderWidget,
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
import { WIDGET_CSS } from "./theme.css.js";

type Status = "idle" | "loading" | "loaded" | "error";
type CalendarHandle = { destroy(): void };

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
  ];

  #styleEl: HTMLStyleElement;
  #container: HTMLElement;
  #feed: PreviewFeed | undefined;
  #runtimeData: OteEventsFeedData | undefined;
  #runtimeDataOverride = false;
  #originalEvents: OriginalOteEvent[] = [];
  #feedSource: EventFeedSource | undefined;
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
    if (this.#runtimeDataOverride) this.#renderNow();
    else void this.#load();
  }

  disconnectedCallback(): void {
    this.#teardownCalendar();
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnected) return;
    if (name === "feed" || name === "feeds") {
      void this.#load();
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
      this.#contexts = buildContexts(feed, this.#originalEvents, this.#feedSource);
      this.#status = "loaded";
      this.#selectedEvent = undefined;
    } catch (error) {
      this.#status = "error";
      this.#errorMessage = error instanceof Error ? error.message : String(error);
      this.#selectedEvent = undefined;
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
      this.#contexts = buildContexts(this.#feed, this.#originalEvents, this.#feedSource);
      this.#status = "loaded";
      this.#errorMessage = "";
      this.#selectedEvent = undefined;
    } catch (error) {
      this.#feed = undefined;
      this.#originalEvents = [];
      this.#feedSource = undefined;
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
    const lang = resolveLang(parseLangAttr(this.getAttribute("lang")), navigator.language);
    const state: WidgetState = {
      status: this.#status,
      errorMessage: this.#errorMessage,
      feed: this.#feed,
      lang,
      limit: parseLimit(this.getAttribute("limit")),
      showPast: parseShowPast(this.getAttribute("show-past")),
      sort: parseSort(this.getAttribute("sort")),
      layout: parseLayout(this.getAttribute("layout")),
      previewFields: parseFields(this.getAttribute("fields-preview") ?? this.getAttribute("fields")),
      detailFields: parseDetailFields(this.getAttribute("fields-detail") ?? this.getAttribute("fields")),
      groupEvents: parseGroupEvents(this.getAttribute("group-events")),
      placeholderImage: this.getAttribute("placeholder-image")?.trim() || undefined,
      emptyMessage: this.getAttribute("empty-message")?.trim() || undefined,
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
          this.#renderNow();
        }
      },
      onEventClose: () => {
        this.#selectedEvent = undefined;
        this.#renderNow();
      },
      onEventAction: (action, event) => {
        const actionId = typeof action === "string" ? action : "type" in action ? action.type : action.id;
        this.dispatchEvent(
          new CustomEvent("ote-event-action", { detail: this.#domEventDetail(actionId, event, state) }),
        );
      },
    };
    renderWidget(this.#container, state);

    if (state.layout === "calendar" && state.status === "loaded") {
      const events = selectVisibleEvents(state);
      if (events.length > 0) {
        void this.#mountCalendar(events, state.lang);
        return;
      }
    }
    this.#teardownCalendar();
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
        onEventClick: (event) => {
          const eventClick = parseEventClick(this.getAttribute("event-click"));
          this.dispatchEvent(new CustomEvent("ote-event-open", { detail: this.#domEventDetail(undefined, event) }));
          if (eventClick === "link" && event.link) {
            window.open(event.link, "_blank", "noopener");
          } else if (eventClick === "modal") {
            this.#selectedEvent = event;
            this.#renderNow();
          }
        },
      });
    } catch (error) {
      if (requestId !== this.#calendarRequestId || !this.isConnected) return;
      const host = this.#container.querySelector<HTMLElement>(".calendar-host");
      if (host) host.textContent = error instanceof Error ? error.message : String(error);
    }
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
    this.#calendarHandle?.destroy();
    this.#calendarHandle = undefined;
  }
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
