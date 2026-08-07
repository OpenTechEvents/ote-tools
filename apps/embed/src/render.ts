import { eventWhen, parseSortDate, sortedEvents, truncate } from "@opentechevents/preview-feed";
import type { PreviewEvent, PreviewFeed } from "@opentechevents/preview-feed";

import type { Lang, Layout } from "./attrs.js";

export interface WidgetState {
  status: "idle" | "loading" | "loaded" | "error";
  errorMessage: string;
  feed: PreviewFeed | undefined;
  lang: Lang;
  limit: number;
  showPast: boolean;
  layout: Layout;
}

const STRINGS = {
  en: {
    loading: "Loading events…",
    empty: "No upcoming events.",
    errorPrefix: "Could not load events: ",
    online: "Online",
  },
  es: {
    loading: "Cargando eventos…",
    empty: "No hay próximos eventos.",
    errorPrefix: "No se pudieron cargar los eventos: ",
    online: "En línea",
  },
} as const;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function withText<T extends HTMLElement>(node: T, text: string): T {
  node.textContent = text;
  return node;
}

function isPastEvent(event: PreviewEvent): boolean {
  const sortDate = parseSortDate(event.startDate);
  return sortDate !== null && sortDate < Date.now();
}

function renderEvent(
  event: PreviewEvent,
  strings: (typeof STRINGS)[Lang],
): HTMLLIElement {
  const item = el("li", "event");

  const title = el("h3", "event-title");
  if (event.link) {
    const link = el("a");
    link.href = event.link;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = event.name;
    title.append(link);
  } else {
    title.textContent = event.name;
  }
  item.append(title);

  const when = eventWhen(event);
  if (when) item.append(withText(el("p", "event-when"), when));

  const location = event.location && event.location !== "online" ? event.location : strings.online;
  item.append(withText(el("p", "event-location"), location));

  const description = truncate(event.description, 220);
  if (description) item.append(withText(el("p", "event-description"), description));

  return item;
}

export function renderWidget(container: HTMLElement, state: WidgetState): void {
  container.replaceChildren();
  const strings = STRINGS[state.lang];

  if (state.status === "idle" || state.status === "loading") {
    container.append(withText(el("p", "message"), strings.loading));
    return;
  }

  if (state.status === "error") {
    container.append(
      withText(el("p", "message error"), `${strings.errorPrefix}${state.errorMessage}`),
    );
    return;
  }

  if (!state.feed) return;

  const events = sortedEvents(state.feed.events)
    .filter((event) => state.showPast || !isPastEvent(event))
    .slice(0, state.limit);

  if (events.length === 0) {
    container.append(withText(el("p", "message"), strings.empty));
    return;
  }

  const list = el("ul", `events layout-${state.layout}`);
  for (const event of events) list.append(renderEvent(event, strings));
  container.append(list);
}
