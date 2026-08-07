import { jsonToPreviewFeed } from "@opentechevents/preview-feed";
import type { PreviewFeed } from "@opentechevents/preview-feed";

import { parseLangAttr, parseLayout, parseLimit, parseShowPast, resolveLang } from "./attrs.js";
import { renderWidget } from "./render.js";
import { WIDGET_CSS } from "./theme.css.js";

type Status = "idle" | "loading" | "loaded" | "error";

/**
 * `<ote-events feed="..." limit="6" theme="auto" lang="auto" show-past="false" layout="list">`
 *
 * Fetches a native OTE JSON feed client-side and renders upcoming events.
 * Deliberately JSON-only (not ICS/RSS): OTE's canonical publish format is
 * JSON, and pulling in the ICS/RSS converters here would drag their heavier
 * deps (ical.js, DOMParser-based XML parsing) into this bundle for a case
 * the acceptance criteria doesn't call for. See apps/embed/CLAUDE.md.
 */
export class OteEventsElement extends HTMLElement {
  static observedAttributes = ["feed", "limit", "theme", "lang", "show-past", "layout"];

  #container: HTMLElement;
  #feed: PreviewFeed | undefined;
  #status: Status = "idle";
  #errorMessage = "";
  #requestId = 0;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = WIDGET_CSS;
    this.#container = document.createElement("div");
    this.#container.className = "ote-events";
    root.append(style, this.#container);
  }

  connectedCallback(): void {
    void this.#load();
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnected) return;
    if (name === "feed") {
      void this.#load();
    } else {
      this.#renderNow();
    }
  }

  async #load(): Promise<void> {
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

  #renderNow(): void {
    const lang = resolveLang(parseLangAttr(this.getAttribute("lang")), navigator.language);
    renderWidget(this.#container, {
      status: this.#status,
      errorMessage: this.#errorMessage,
      feed: this.#feed,
      lang,
      limit: parseLimit(this.getAttribute("limit")),
      showPast: parseShowPast(this.getAttribute("show-past")),
      layout: parseLayout(this.getAttribute("layout")),
    });
  }
}

// theme="light"/"dark"/"auto" needs no JS branch: theme.css.ts's :host()
// selectors read the attribute directly, so setting it just works via CSS.

export function defineOteEvents(): void {
  if (!customElements.get("ote-events")) {
    customElements.define("ote-events", OteEventsElement);
  }
}
