import { parseLangAttr, resolveLang } from "./attrs.js";
import { parseShow, parseSubscribeLayout } from "./subscribe-attrs.js";
import { renderSubscribe, type SubscribeState } from "./subscribe-render.js";
import { SUBSCRIBE_CSS } from "./subscribe.css.js";

let instanceCounter = 0;

/**
 * `<ote-subscribe feed-ics="..." feed-rss="..." feed-json="..." name="..." show="..." layout="menu" theme="auto" lang="auto">`
 *
 * A trigger + popover menu of "subscribe to this feed" links (Google
 * Calendar, webcal://, ICS download, Feedly, feed://, RSS download, OTE
 * Reader, OTE Tools preview, JSON download). Fully synchronous/
 * attribute-driven — unlike <ote-events>, it never fetches anything;
 * `feed-ics`/`feed-rss`/`feed-json` are just URLs it turns into links.
 * Renders a Calendar group when `feed-ics` is set, an RSS group when
 * `feed-rss` is set, and an OTE feed group when `feed-json` is set; any
 * combination may be present.
 *
 * `layout="menu"` (default) is a single trigger whose popover lists every
 * available group. `layout="badges"` renders one small trigger per
 * available group instead — the three-badge layout (ICS / RSS / OTE feed)
 * this element was ported from. See apps/embed/CLAUDE.md.
 */
export class OteSubscribeElement extends HTMLElement {
  static observedAttributes = ["feed-ics", "feed-rss", "feed-json", "name", "show", "layout", "theme", "lang"];

  #container: HTMLElement;
  /** `"menu"` or a group key ("ics"/"rss"/"ote"), whichever popover is open; null when none is — see subscribe-render.ts's SubscribeState. */
  #openGroup: string | null = null;
  #instanceId = `ote-subscribe-${++instanceCounter}`;

  #handlePointerDown = (event: PointerEvent): void => {
    if (!event.composedPath().includes(this)) this.#closeMenu(false);
  };

  #handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") this.#closeMenu(true);
  };

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    const styleEl = document.createElement("style");
    styleEl.textContent = SUBSCRIBE_CSS;
    this.#container = document.createElement("div");
    this.#container.className = "subscribe";
    root.append(styleEl, this.#container);
  }

  connectedCallback(): void {
    this.#renderNow();
  }

  disconnectedCallback(): void {
    this.#detachOutsideListeners();
  }

  attributeChangedCallback(): void {
    if (!this.isConnected) return;
    this.#renderNow();
  }

  #toggleGroup(group: string): void {
    if (this.#openGroup === group) this.#closeMenu(true);
    else this.#openGroupMenu(group);
  }

  #openGroupMenu(group: string): void {
    const wasOpen = this.#openGroup !== null;
    this.#openGroup = group;
    this.#renderNow();
    if (!wasOpen) this.#attachOutsideListeners();
  }

  #closeMenu(returnFocus: boolean): void {
    if (this.#openGroup === null) return;
    const previousGroup = this.#openGroup;
    this.#openGroup = null;
    this.#detachOutsideListeners();
    this.#renderNow();
    if (returnFocus) {
      this.#container.querySelector<HTMLButtonElement>(`[data-group="${previousGroup}"]`)?.focus();
    }
  }

  #attachOutsideListeners(): void {
    document.addEventListener("pointerdown", this.#handlePointerDown);
    document.addEventListener("keydown", this.#handleKeyDown);
  }

  #detachOutsideListeners(): void {
    document.removeEventListener("pointerdown", this.#handlePointerDown);
    document.removeEventListener("keydown", this.#handleKeyDown);
  }

  #renderNow(): void {
    const lang = resolveLang(parseLangAttr(this.getAttribute("lang")), navigator.language);
    const state: SubscribeState = {
      icsUrl: this.getAttribute("feed-ics")?.trim() || undefined,
      rssUrl: this.getAttribute("feed-rss")?.trim() || undefined,
      jsonUrl: this.getAttribute("feed-json")?.trim() || undefined,
      name: this.getAttribute("name")?.trim() || undefined,
      show: parseShow(this.getAttribute("show")),
      lang,
      layout: parseSubscribeLayout(this.getAttribute("layout")),
      openGroup: this.#openGroup,
      instanceId: this.#instanceId,
      onToggle: (group) => this.#toggleGroup(group),
    };
    renderSubscribe(this.#container, state);
  }
}

// theme="light"/"dark"/"auto" needs no JS branch: subscribe.css.ts's :host()
// selectors read the attribute directly, so setting it just works via CSS.

export function defineOteSubscribe(): void {
  if (!customElements.get("ote-subscribe")) {
    customElements.define("ote-subscribe", OteSubscribeElement);
  }
}
