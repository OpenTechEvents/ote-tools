import { jsonToPreviewFeed, oteJsonToPreviewFeed } from "@opentechevents/preview-feed";
import type {
  OteJsonEvent,
  OteJsonPreviewInput,
  PreviewFeed,
} from "@opentechevents/preview-feed";

import {
  parseFields,
  parseLangAttr,
  parseLayout,
  parseLimit,
  parseShowPast,
  resolveLang,
} from "./attrs.js";
import { renderWidget, selectVisibleEvents, type WidgetState } from "./render.js";
import { WIDGET_CSS } from "./theme.css.js";

type Status = "idle" | "loading" | "loaded" | "error";
type CalendarHandle = { destroy(): void };

/**
 * `<ote-events feed="..." limit="..." theme="auto" lang="auto" show-past="true" layout="calendar" fields="...">`
 *
 * Fetches a native OTE JSON feed client-side and renders upcoming events.
 * Deliberately JSON-only (not ICS/RSS): OTE's canonical publish format is
 * JSON, and pulling in the ICS/RSS converters here would drag their heavier
 * deps (ical.js, DOMParser-based XML parsing) into this bundle for a case
 * the acceptance criteria doesn't call for. See apps/embed/CLAUDE.md.
 */
export class OteEventsElement extends HTMLElement {
  static observedAttributes = [
    "feed",
    "limit",
    "theme",
    "lang",
    "show-past",
    "layout",
    "fields",
    "placeholder-image",
  ];

  #styleEl: HTMLStyleElement;
  #container: HTMLElement;
  #feed: PreviewFeed | undefined;
  #runtimeData: OteJsonPreviewInput | undefined;
  #status: Status = "idle";
  #errorMessage = "";
  #requestId = 0;

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
    if (this.#runtimeData) this.#renderNow();
    else void this.#load();
  }

  disconnectedCallback(): void {
    this.#teardownCalendar();
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnected) return;
    if (name === "feed") {
      void this.#load();
    } else {
      this.#renderNow();
    }
  }

  get feedData(): OteJsonPreviewInput | undefined {
    return this.#runtimeData;
  }

  set feedData(value: OteJsonPreviewInput | null | undefined) {
    this.#setRuntimeData(value);
  }

  get events(): OteJsonEvent[] | undefined {
    if (!this.#runtimeData) return undefined;
    return Array.isArray(this.#runtimeData) ? this.#runtimeData : this.#runtimeData.events;
  }

  set events(value: OteJsonEvent[] | null | undefined) {
    this.#setRuntimeData(value);
  }

  get event(): OteJsonEvent | undefined {
    return this.events?.[0];
  }

  set event(value: OteJsonEvent | null | undefined) {
    this.#setRuntimeData(value == null ? value : [value]);
  }

  async #load(): Promise<void> {
    if (this.#runtimeData) return;

    const feedUrl = this.getAttribute("feed");
    if (!feedUrl) {
      this.#status = "error";
      this.#errorMessage = 'Missing required "feed" attribute.';
      this.#renderNow();
      return;
    }

    this.#status = "loading";
    this.#renderNow();

    // Guards against a slow earlier request overwriting a newer one when the
    // `feed` attribute changes twice in quick succession.
    const requestId = ++this.#requestId;
    try {
      const response = await fetch(feedUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const feed = jsonToPreviewFeed(text);
      if (requestId !== this.#requestId) return;
      this.#feed = feed;
      this.#status = "loaded";
    } catch (error) {
      if (requestId !== this.#requestId) return;
      this.#status = "error";
      this.#errorMessage = error instanceof Error ? error.message : String(error);
    }
    this.#renderNow();
  }

  #setRuntimeData(value: OteJsonPreviewInput | null | undefined): void {
    this.#requestId++;

    if (value == null) {
      this.#runtimeData = undefined;
      this.#feed = undefined;
      this.#errorMessage = "";
      if (this.isConnected) void this.#load();
      return;
    }

    this.#runtimeData = value;
    try {
      this.#feed = oteJsonToPreviewFeed(value);
      this.#status = "loaded";
      this.#errorMessage = "";
    } catch (error) {
      this.#feed = undefined;
      this.#status = "error";
      this.#errorMessage = error instanceof Error ? error.message : String(error);
    }
    if (this.isConnected) this.#renderNow();
  }

  #renderNow(): void {
    const lang = resolveLang(parseLangAttr(this.getAttribute("lang")), navigator.language);
    const state: WidgetState = {
      status: this.#status,
      errorMessage: this.#errorMessage,
      feed: this.#feed,
      lang,
      limit: parseLimit(this.getAttribute("limit")),
      showPast: parseShowPast(this.getAttribute("show-past")),
      layout: parseLayout(this.getAttribute("layout")),
      fields: parseFields(this.getAttribute("fields")),
      placeholderImage: this.getAttribute("placeholder-image")?.trim() || undefined,
    };
    renderWidget(this.#container, state);

    if (state.layout === "calendar" && state.status === "loaded") {
      const events = selectVisibleEvents(state);
      if (events.length > 0) {
        void this.#mountCalendar(events);
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
  async #mountCalendar(events: ReturnType<typeof selectVisibleEvents>): Promise<void> {
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
        onEventClick: (event) => {
          if (event.link) window.open(event.link, "_blank", "noopener");
        },
      });
    } catch (error) {
      if (requestId !== this.#calendarRequestId || !this.isConnected) return;
      const host = this.#container.querySelector<HTMLElement>(".calendar-host");
      if (host) host.textContent = error instanceof Error ? error.message : String(error);
    }
  }

  #teardownCalendar(): void {
    this.#calendarRequestId++;
    this.#calendarHandle?.destroy();
    this.#calendarHandle = undefined;
  }
}

// theme="light"/"dark"/"auto" needs no JS branch: theme.css.ts's :host()
// selectors read the attribute directly, so setting it just works via CSS.

export function defineOteEvents(): void {
  if (!customElements.get("ote-events")) {
    customElements.define("ote-events", OteEventsElement);
  }
}
