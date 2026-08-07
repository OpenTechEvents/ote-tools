import { eventWhen, parseSortDate, sortedEvents, truncate } from "@opentechevents/preview-feed";
import type { PreviewEvent, PreviewFeed } from "@opentechevents/preview-feed";

import type { FieldKey, Lang, Layout } from "./attrs.js";

export interface WidgetState {
  status: "idle" | "loading" | "loaded" | "error";
  errorMessage: string;
  feed: PreviewFeed | undefined;
  lang: Lang;
  limit: number;
  showPast: boolean;
  layout: Layout;
  fields: Set<FieldKey>;
}

const STRINGS = {
  en: {
    loading: "Loading events…",
    empty: "No upcoming events.",
    errorPrefix: "Could not load events: ",
    online: "Online",
    free: "Free",
    attendance: { "in-person": "In person", online: "Online", hybrid: "Hybrid" },
  },
  es: {
    loading: "Cargando eventos…",
    empty: "No hay próximos eventos.",
    errorPrefix: "No se pudieron cargar los eventos: ",
    online: "En línea",
    free: "Gratis",
    attendance: { "in-person": "Presencial", online: "En línea", hybrid: "Híbrido" },
  },
} as const;

type Strings = (typeof STRINGS)[Lang];

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

/** Sort → filter past (unless show-past) → cap at limit. Shared by every layout. */
export function selectVisibleEvents(state: WidgetState): PreviewEvent[] {
  if (!state.feed) return [];
  return sortedEvents(state.feed.events)
    .filter((event) => state.showPast || !isPastEvent(event))
    .slice(0, state.limit);
}

function formatPrice(price: NonNullable<PreviewEvent["price"]>, strings: Strings): string {
  if (price.amount === 0) return strings.free;
  if (price.currency) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: price.currency }).format(
        price.amount,
      );
    } catch {
      return `${price.amount} ${price.currency}`;
    }
  }
  return String(price.amount);
}

function renderEvent(event: PreviewEvent, strings: Strings, fields: Set<FieldKey>): HTMLLIElement {
  const item = el("li", "event");

  if (fields.has("image") && event.image) {
    const img = el("img", "event-image");
    img.src = event.image.url;
    img.alt = event.image.alt ?? event.name;
    img.loading = "lazy";
    // No broken-image icon on a bad/expired URL — just disappear cleanly.
    img.addEventListener("error", () => img.remove());
    item.append(img);
  }

  const body = el("div", "event-body");
  item.append(body);

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
  body.append(title);

  const badges = el("div", "event-badges");
  if (fields.has("attendance") && event.attendanceMode) {
    badges.append(withText(el("span", "badge"), strings.attendance[event.attendanceMode]));
  }
  if (fields.has("price") && event.price) {
    badges.append(withText(el("span", "price"), formatPrice(event.price, strings)));
  }
  if (badges.children.length > 0) body.append(badges);

  if (fields.has("when")) {
    const when = eventWhen(event);
    if (when) body.append(withText(el("p", "event-when"), when));
  }

  if (fields.has("location")) {
    const location = event.location && event.location !== "online" ? event.location : strings.online;
    body.append(withText(el("p", "event-location"), location));
  }

  if (fields.has("organizer") && event.organizerName) {
    body.append(withText(el("p", "event-organizer"), event.organizerName));
  }

  if (fields.has("description")) {
    const description = truncate(event.description, 220);
    if (description) body.append(withText(el("p", "event-description"), description));
  }

  if (fields.has("tags") && event.tags && event.tags.length > 0) {
    const tagList = el("ul", "tags");
    for (const tag of event.tags) tagList.append(withText(el("li", "tag"), tag));
    body.append(tagList);
  }

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

  const events = selectVisibleEvents(state);
  if (events.length === 0) {
    container.append(withText(el("p", "message"), strings.empty));
    return;
  }

  if (state.layout === "calendar") {
    // Mount point only, with a loading placeholder: element.ts lazy-loads
    // calendar-layout.js and replaces this — render.ts stays
    // synchronous/dependency-free.
    container.append(withText(el("div", "calendar-host"), strings.loading));
    return;
  }

  const list = el("ul", `events layout-${state.layout}`);
  for (const event of events) list.append(renderEvent(event, strings, state.fields));
  container.append(list);
}
