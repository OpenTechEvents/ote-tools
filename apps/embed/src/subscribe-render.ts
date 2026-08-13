import type { Lang } from "./attrs.js";
import { el, withText } from "./dom.js";
import type { ShowToken, SubscribeLayout } from "./subscribe-attrs.js";
import {
  buildFeedlyUrl,
  buildGoogleCalendarUrl,
  buildOtePreviewUrl,
  buildOteReaderUrl,
  toFeedProtocolUrl,
  toWebcalUrl,
} from "./subscribe-urls.js";

const STRINGS = {
  en: {
    subscribe: "Subscribe",
    subscribeTo: (name: string) => `Subscribe to ${name}`,
    calendarGroup: "Calendar",
    rssGroup: "RSS",
    oteGroup: "OTE feed",
    google: "Subscribe with Google Calendar",
    webcal: "Subscribe with app (Apple Calendar, Outlook desktop…)",
    icsDownload: "Open/download ICS",
    feedly: "Subscribe with Feedly",
    feedProtocol: "Subscribe with feed reader (NetNewsWire, Reeder…)",
    rssDownload: "Open/download RSS",
    oteReader: "Subscribe with OTE Reader",
    otePreview: "Preview in OTE Tools",
    jsonDownload: "Open/download JSON",
  },
  es: {
    subscribe: "Suscribirse",
    subscribeTo: (name: string) => `Suscribirse a ${name}`,
    calendarGroup: "Calendario",
    rssGroup: "RSS",
    oteGroup: "Feed OTE",
    google: "Suscribirse con Google Calendar",
    webcal: "Suscribirse con app (Apple Calendar, Outlook de escritorio…)",
    icsDownload: "Abrir/descargar ICS",
    feedly: "Suscribirse con Feedly",
    feedProtocol: "Suscribirse con lector de feeds (NetNewsWire, Reeder…)",
    rssDownload: "Abrir/descargar RSS",
    oteReader: "Suscribirse con OTE Reader",
    otePreview: "Vista previa en OTE Tools",
    jsonDownload: "Abrir/descargar JSON",
  },
} as const;

type GroupKey = "ics" | "rss" | "ote";

interface RenderItem {
  label: string;
  href: string;
  external: boolean;
}

interface RenderGroup {
  key: GroupKey;
  label: string;
  items: RenderItem[];
}

const ICS_TOKENS: readonly ShowToken[] = ["google", "webcal", "ics-download"];
const RSS_TOKENS: readonly ShowToken[] = ["feedly", "feed-protocol", "rss-download"];
const OTE_TOKENS: readonly ShowToken[] = ["ote-reader", "ote-preview", "json-download"];

export interface SubscribeState {
  icsUrl: string | undefined;
  rssUrl: string | undefined;
  jsonUrl: string | undefined;
  name: string | undefined;
  show: Set<ShowToken>;
  lang: Lang;
  layout: SubscribeLayout;
  /** `"menu"` (the single combined trigger) or a GroupKey, whichever popover is currently open; null when none is. */
  openGroup: string | null;
  /** Stable across re-renders of the same element instance, for aria-controls. */
  instanceId: string;
  onToggle: (group: string) => void;
}

function buildGroups(state: SubscribeState, strings: (typeof STRINGS)[Lang]): RenderGroup[] {
  const groups: RenderGroup[] = [];

  if (state.icsUrl && ICS_TOKENS.some((token) => state.show.has(token))) {
    const items: RenderItem[] = [];
    if (state.show.has("google")) items.push({ label: strings.google, href: buildGoogleCalendarUrl(state.icsUrl), external: true });
    if (state.show.has("webcal")) items.push({ label: strings.webcal, href: toWebcalUrl(state.icsUrl), external: false });
    if (state.show.has("ics-download")) items.push({ label: strings.icsDownload, href: state.icsUrl, external: true });
    if (items.length > 0) groups.push({ key: "ics", label: strings.calendarGroup, items });
  }

  if (state.rssUrl && RSS_TOKENS.some((token) => state.show.has(token))) {
    const items: RenderItem[] = [];
    if (state.show.has("feedly")) items.push({ label: strings.feedly, href: buildFeedlyUrl(state.rssUrl), external: true });
    if (state.show.has("feed-protocol")) items.push({ label: strings.feedProtocol, href: toFeedProtocolUrl(state.rssUrl), external: false });
    if (state.show.has("rss-download")) items.push({ label: strings.rssDownload, href: state.rssUrl, external: true });
    if (items.length > 0) groups.push({ key: "rss", label: strings.rssGroup, items });
  }

  if (state.jsonUrl && OTE_TOKENS.some((token) => state.show.has(token))) {
    const items: RenderItem[] = [];
    if (state.show.has("ote-reader")) items.push({ label: strings.oteReader, href: buildOteReaderUrl(state.jsonUrl), external: true });
    if (state.show.has("ote-preview")) items.push({ label: strings.otePreview, href: buildOtePreviewUrl(state.jsonUrl), external: true });
    if (state.show.has("json-download")) items.push({ label: strings.jsonDownload, href: state.jsonUrl, external: true });
    if (items.length > 0) groups.push({ key: "ote", label: strings.oteGroup, items });
  }

  return groups;
}

function menuLink(item: RenderItem): HTMLAnchorElement {
  const a = withText(el("a"), item.label);
  a.href = item.href;
  a.setAttribute("role", "menuitem");
  if (item.external) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  return a;
}

function buildMenu(menuId: string, items: RenderItem[], groupLabel?: string): HTMLElement {
  const menu = el("div", "menu");
  menu.id = menuId;
  menu.setAttribute("role", "menu");
  if (groupLabel) menu.append(withText(el("div", "menu-group-label"), groupLabel));
  menu.append(...items.map(menuLink));
  return menu;
}

/** One trigger + its popover (when open), wrapped in its own positioning context so the menu anchors under that specific trigger. */
function renderTrigger(
  container: HTMLElement,
  options: {
    groupKey: string;
    slotName: string;
    fallbackLabel: string;
    ariaLabel: string;
    disabled: boolean;
    open: boolean;
    menuId: string;
    buildMenuContent: () => HTMLElement;
    onClick: () => void;
  },
): void {
  const wrap = el("div", "item");
  const trigger = el("button", "trigger");
  trigger.type = "button";
  trigger.dataset.group = options.groupKey;
  trigger.disabled = options.disabled;
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", String(options.open));
  trigger.setAttribute("aria-label", options.ariaLabel);

  const slot = document.createElement("slot");
  slot.name = options.slotName;
  slot.textContent = options.fallbackLabel;
  trigger.append(slot);

  trigger.addEventListener("click", () => {
    if (!options.disabled) options.onClick();
  });
  wrap.append(trigger);

  if (options.open && !options.disabled) {
    trigger.setAttribute("aria-controls", options.menuId);
    wrap.append(options.buildMenuContent());
  }

  container.append(wrap);
}

export function renderSubscribe(container: HTMLElement, state: SubscribeState): void {
  container.replaceChildren();
  const strings = STRINGS[state.lang];
  const groups = buildGroups(state, strings);
  const ariaLabel = state.name ? strings.subscribeTo(state.name) : strings.subscribe;

  if (groups.length === 0) {
    renderTrigger(container, {
      groupKey: "menu",
      slotName: "trigger",
      fallbackLabel: strings.subscribe,
      ariaLabel,
      disabled: true,
      open: false,
      menuId: "",
      buildMenuContent: () => el("div", "menu"),
      onClick: () => {},
    });
    return;
  }

  if (state.layout === "badges") {
    for (const group of groups) {
      renderTrigger(container, {
        groupKey: group.key,
        slotName: `${group.key}-trigger`,
        fallbackLabel: group.label,
        ariaLabel: group.label,
        disabled: false,
        open: state.openGroup === group.key,
        menuId: `menu-${state.instanceId}-${group.key}`,
        buildMenuContent: () => buildMenu(`menu-${state.instanceId}-${group.key}`, group.items),
        onClick: () => state.onToggle(group.key),
      });
    }
    return;
  }

  renderTrigger(container, {
    groupKey: "menu",
    slotName: "trigger",
    fallbackLabel: strings.subscribe,
    ariaLabel,
    disabled: false,
    open: state.openGroup === "menu",
    menuId: `menu-${state.instanceId}`,
    buildMenuContent: () => {
      const menu = el("div", "menu");
      menu.id = `menu-${state.instanceId}`;
      menu.setAttribute("role", "menu");
      for (const group of groups) {
        menu.append(withText(el("div", "menu-group-label"), group.label), ...group.items.map(menuLink));
      }
      return menu;
    },
    onClick: () => state.onToggle("menu"),
  });
}
