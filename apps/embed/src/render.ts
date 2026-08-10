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
  placeholderImage?: string;
}

const STRINGS = {
  en: {
    loading: "Loading events…",
    empty: "No upcoming events.",
    errorPrefix: "Could not load events: ",
    online: "Online",
    free: "Free",
    updated: "Updated",
    event: "Event",
    when: "When",
    lastUpdate: "Last update",
    location: "Location",
    organizer: "Organizer",
    notAvailable: "—",
    attendance: { "in-person": "In person", online: "Online", hybrid: "Hybrid" },
  },
  es: {
    loading: "Cargando eventos…",
    empty: "No hay próximos eventos.",
    errorPrefix: "No se pudieron cargar los eventos: ",
    online: "En línea",
    free: "Gratis",
    updated: "Actualizado",
    event: "Evento",
    when: "Cuándo",
    lastUpdate: "Última actualización",
    location: "Lugar",
    organizer: "Organizador",
    notAvailable: "—",
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

function dateValue(value: string | undefined): number | null {
  if (!value) return null;
  const date = new Date(value);
  const time = date.valueOf();
  return Number.isNaN(time) ? null : time;
}

function formatRelativeDate(value: string | undefined): string | undefined {
  const time = dateValue(value);
  if (time === null) return value;
  const diffSeconds = Math.round((time - Date.now()) / 1000);
  const abs = Math.abs(diffSeconds);
  const units: Array<[Intl.RelativeTimeFormatUnit, number, string]> = [
    ["year", 31536000, "y"],
    ["month", 2592000, "mo"],
    ["week", 604800, "w"],
    ["day", 86400, "d"],
    ["hour", 3600, "h"],
    ["minute", 60, "m"],
  ];
  for (const [, seconds, suffix] of units) {
    if (abs >= seconds) return `${Math.max(1, Math.round(abs / seconds))}${suffix}`;
  }
  return "now";
}

function formatReadableDate(value: string | undefined, timezone: string | undefined): string | undefined {
  if (!value) return undefined;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = new Date(`${value}${timezone === "UTC" && !dateOnly ? "Z" : ""}`);
  if (Number.isNaN(date.valueOf())) return timezone ? `${value} (${timezone})` : value;
  const options: Intl.DateTimeFormatOptions = dateOnly
    ? { weekday: "short", month: "short", day: "numeric", year: "numeric" }
    : {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      };
  const formatted = new Intl.DateTimeFormat(undefined, options).format(date);
  return timezone && !dateOnly ? `${formatted} (${timezone})` : formatted;
}

function formatCompactDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  const options: Intl.DateTimeFormatOptions = dateOnly
    ? { month: "short", day: "numeric" }
    : { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" };
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function formatCompactDay(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function sameCalendarDay(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return false;
  const aDate = new Date(a);
  const bDate = new Date(b);
  if (Number.isNaN(aDate.valueOf()) || Number.isNaN(bDate.valueOf())) return false;
  return (
    aDate.getFullYear() === bDate.getFullYear() &&
    aDate.getMonth() === bDate.getMonth() &&
    aDate.getDate() === bDate.getDate()
  );
}

function formatCompactTime(value: string | undefined): string | undefined {
  if (!value || /^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return undefined;
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

function formatCompactWhen(event: PreviewEvent): string | undefined {
  const start = formatCompactDate(event.startDate);
  const end = formatCompactDate(event.endDate);
  if (start && event.endDate && sameCalendarDay(event.startDate, event.endDate)) {
    const day = formatCompactDay(event.startDate);
    const startTime = formatCompactTime(event.startDate);
    const endTime = formatCompactTime(event.endDate);
    if (day && startTime && endTime) return `${day}, ${startTime}-${endTime}`;
  }
  if (start && end && end !== start) return `${start} – ${end}`;
  return start ?? event.dateLabel;
}

function formatReadableWhen(event: PreviewEvent): string | undefined {
  if (event.dateLabel) return event.dateLabel;
  const start = formatReadableDate(event.startDate, event.timezone);
  const end = formatReadableDate(event.endDate, event.timezone);
  if (start && end) return `${start} to ${end}`;
  return start;
}

function renderEventImage(event: PreviewEvent, placeholderImage: string | undefined): HTMLElement | undefined {
  if (!event.image) return undefined;
  const img = el("img", "event-image");
  img.src = event.image.url;
  img.alt = event.image.alt ?? event.name;
  img.loading = "lazy";
  img.addEventListener("error", () => {
    img.replaceWith(renderCardPlaceholder(placeholderImage));
  });
  return img;
}

function renderCardPlaceholder(placeholderImage: string | undefined): HTMLElement {
  if (placeholderImage) {
    const img = el("img", "event-image event-image-placeholder");
    img.src = placeholderImage;
    img.alt = "";
    img.loading = "lazy";
    img.addEventListener("error", () => img.replaceWith(el("div", "event-image event-image-placeholder")));
    return img;
  }
  return el("div", "event-image event-image-placeholder");
}

function renderCardEvent(
  event: PreviewEvent,
  strings: Strings,
  fields: Set<FieldKey>,
  placeholderImage: string | undefined,
): HTMLLIElement {
  const item = el("li", "event");

  if (fields.has("image")) {
    item.append(renderEventImage(event, placeholderImage) ?? renderCardPlaceholder(placeholderImage));
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

function findDetail(event: PreviewEvent, label: string): string | undefined {
  return event.details?.find((detail) => detail.label === label)?.value;
}

const TECHNICAL_DETAIL_LABELS = new Set(["ID", "Source", "Image", "Updated"]);

function appendDetailRow(list: HTMLDListElement, label: string, value: string | undefined): void {
  if (!value) return;
  list.append(withText(el("dt"), label), withText(el("dd"), value));
}

function iconHeader(className: string, label: string): HTMLElement {
  const node = el("span", `event-header-icon ${className}`);
  node.title = label;
  node.setAttribute("aria-label", label);
  return node;
}

function renderListEvent(
  event: PreviewEvent,
  strings: Strings,
  fields: Set<FieldKey>,
  placeholderImage: string | undefined,
): HTMLLIElement {
  const item = el("li", "event event-row");
  const details = el("details", "event-accordion");
  item.append(details);

  const summary = el("summary", "event-summary");
  details.append(summary);

  const title = el("span", "event-summary-title");
  title.textContent = event.name;
  summary.append(title);

  const when = formatReadableWhen(event) ?? eventWhen(event);
  const compactWhen = formatCompactWhen(event) ?? when;
  summary.append(withText(el("span", "event-summary-when"), compactWhen || strings.notAvailable));

  summary.append(
    withText(
      el("span", "event-summary-updated"),
      formatRelativeDate(event.updatedAt ?? findDetail(event, "Updated")) ?? strings.notAvailable,
    ),
  );

  const body = el("div", "event-details");
  details.append(body);

  if (fields.has("image")) {
    const image = renderEventImage(event, placeholderImage);
    if (image) body.append(image);
  }

  const actions = el("div", "event-actions");
  if (event.link) {
    const link = el("a");
    link.href = event.link;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = event.name;
    actions.append(link);
  }
  if (actions.children.length > 0) body.append(actions);

  const badges = el("div", "event-badges");
  if (fields.has("attendance") && event.attendanceMode) {
    badges.append(withText(el("span", "badge"), strings.attendance[event.attendanceMode]));
  }
  if (fields.has("price") && event.price) {
    badges.append(withText(el("span", "price"), formatPrice(event.price, strings)));
  }
  if (badges.children.length > 0) body.append(badges);

  if (fields.has("description")) {
    const description = truncate(event.description, 320);
    if (description) body.append(withText(el("p", "event-description"), description));
  }

  const detailList = el("dl", "event-detail-list");
  if (fields.has("when")) appendDetailRow(detailList, strings.when, when);
  if (fields.has("location")) {
    const location = event.location && event.location !== "online" ? event.location : strings.online;
    appendDetailRow(detailList, strings.location, location);
  }
  if (fields.has("organizer")) appendDetailRow(detailList, strings.organizer, event.organizerName);
  appendDetailRow(
    detailList,
    strings.updated,
    formatReadableDate(event.updatedAt ?? findDetail(event, "Updated"), undefined),
  );
  for (const detail of event.details ?? []) {
    if (TECHNICAL_DETAIL_LABELS.has(detail.label)) continue;
    appendDetailRow(detailList, detail.label, detail.value);
  }
  if (detailList.children.length > 0) body.append(detailList);

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
  if (state.layout === "list") {
    const header = el("li", "event-list-header");
    header.append(
      withText(el("span"), strings.event),
      withText(el("span"), strings.when),
      iconHeader("icon-updated", strings.lastUpdate),
    );
    list.append(header);
  }
  for (const event of events) {
    list.append(
      state.layout === "list"
        ? renderListEvent(event, strings, state.fields, state.placeholderImage)
        : renderCardEvent(event, strings, state.fields, state.placeholderImage),
    );
  }
  container.append(list);
}
