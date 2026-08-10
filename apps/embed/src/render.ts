import {
  addDays,
  eventWhen,
  isDateOnly,
  onlineLocationLabel,
  parseSortDate,
  sortedEvents,
  truncate,
} from "@opentechevents/preview-feed";
import type { PreviewEvent, PreviewFeed } from "@opentechevents/preview-feed";

import type { EventClickMode, FieldKey, Lang, Layout, NativeEventAction } from "./attrs.js";

export type EventActionPlacement = "detail" | "preview" | "both";
export type EventActionIcon = "edit" | "trash" | "copy" | "external-link" | "calendar";
export type EventActionVariant = "default" | "danger";

export interface CustomEventAction {
  id: string;
  label: string;
  icon?: EventActionIcon;
  variant?: EventActionVariant;
  placement?: EventActionPlacement;
  layouts?: Layout[];
  onClick(event: PreviewEvent): void;
}

export type EventAction = NativeEventAction | CustomEventAction;

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
  eventClick: EventClickMode;
  eventActions: EventAction[];
  selectedEvent?: PreviewEvent;
  onEventOpen?(event: PreviewEvent): void;
  onEventClose?(): void;
  onEventAction?(action: EventAction, event: PreviewEvent): void;
}

const STRINGS = {
  en: {
    loading: "Loading events…",
    empty: "No upcoming events.",
    errorPrefix: "Could not load events: ",
    online: "Online",
    onlineEvent: "Online event",
    free: "Free",
    updated: "Updated",
    event: "Event",
    when: "When",
    lastUpdate: "Last update",
    location: "Location",
    organizer: "Organizer",
    notAvailable: "—",
    attendance: { "in-person": "In person", online: "Online", hybrid: "Hybrid" },
    close: "Close",
    eventDetails: "Event details",
    addToGoogle: "Add to Google Calendar",
    addToOutlook: "Add to Outlook",
    addToYahoo: "Add to Yahoo",
    downloadIcs: "Download ICS",
    addToCalendar: "Add to calendar",
    openEventPage: "Open event page",
  },
  es: {
    loading: "Cargando eventos…",
    empty: "No hay próximos eventos.",
    errorPrefix: "No se pudieron cargar los eventos: ",
    online: "En línea",
    onlineEvent: "Evento en línea",
    free: "Gratis",
    updated: "Actualizado",
    event: "Evento",
    when: "Cuándo",
    lastUpdate: "Última actualización",
    location: "Lugar",
    organizer: "Organizador",
    notAvailable: "—",
    attendance: { "in-person": "Presencial", online: "En línea", hybrid: "Híbrido" },
    close: "Cerrar",
    eventDetails: "Detalles del evento",
    addToGoogle: "Añadir a Google Calendar",
    addToOutlook: "Añadir a Outlook",
    addToYahoo: "Añadir a Yahoo",
    downloadIcs: "Descargar ICS",
    addToCalendar: "Añadir al calendario",
    openEventPage: "Abrir página del evento",
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

function appendInlineMarkdown(parent: HTMLElement, text: string): void {
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_|`([^`]+)`)/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index === undefined) continue;
    if (match.index > cursor) parent.append(document.createTextNode(text.slice(cursor, match.index)));

    if (match[2] && match[3]) {
      const link = el("a");
      link.href = match[3];
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = match[2];
      parent.append(link);
    } else if (match[4] || match[5]) {
      parent.append(withText(el("strong"), match[4] ?? match[5] ?? ""));
    } else if (match[6] || match[7]) {
      parent.append(withText(el("em"), match[6] ?? match[7] ?? ""));
    } else if (match[8]) {
      parent.append(withText(el("code"), match[8]));
    }

    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) parent.append(document.createTextNode(text.slice(cursor)));
}

function markdownParagraph(text: string): HTMLParagraphElement {
  const paragraph = el("p");
  appendInlineMarkdown(paragraph, text);
  return paragraph;
}

function renderMarkdownDescription(markdown: string, className = "event-description"): HTMLElement {
  const wrapper = el("div", className);
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  let paragraph: string[] = [];
  let list: HTMLUListElement | undefined;

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    if (text) wrapper.append(markdownParagraph(text));
    paragraph = [];
  };

  const flushList = () => {
    if (list && list.children.length > 0) wrapper.append(list);
    list = undefined;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const listMatch = /^[-*]\s+(.+)$/.exec(line);
    if (listMatch) {
      flushParagraph();
      list ??= el("ul");
      const item = el("li");
      appendInlineMarkdown(item, listMatch[1] ?? "");
      list.append(item);
      continue;
    }

    flushList();
    paragraph.push(line.replace(/^#{1,6}\s+/, ""));
  }

  flushParagraph();
  flushList();
  return wrapper;
}

function svgIcon(paths: string[], className: string): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  for (const d of paths) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    svg.append(path);
  }
  return svg;
}

function attendanceIcon(mode: NonNullable<PreviewEvent["attendanceMode"]>): SVGSVGElement {
  const icons = {
    online: [
      "M15 10l4.6-2.3A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.4.9L15 14",
      "M3 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2",
    ],
    "in-person": [
      "M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0",
      "M12 10h.01",
    ],
    hybrid: [
      "M4 5h9a2 2 0 0 1 2 2v5H2V7a2 2 0 0 1 2-2",
      "M8 19h4",
      "M10 12v7",
      "M18 21s4-3.2 4-6a4 4 0 0 0-8 0c0 2.8 4 6 4 6",
      "M18 15h.01",
    ],
  } satisfies Record<NonNullable<PreviewEvent["attendanceMode"]>, string[]>;
  return svgIcon(icons[mode], "badge-icon");
}

function actionIcon(name: EventActionIcon): SVGSVGElement {
  const icons = {
    calendar: [
      "M8 2v4",
      "M16 2v4",
      "M3 10h18",
      "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2",
    ],
    "external-link": [
      "M15 3h6v6",
      "M10 14 21 3",
      "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
    ],
    edit: [
      "M12 20h9",
      "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
    ],
    trash: [
      "M3 6h18",
      "M8 6V4h8v2",
      "M19 6l-1 14H6L5 6",
      "M10 11v6",
      "M14 11v6",
    ],
    copy: [
      "M8 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2",
      "M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2",
    ],
  } satisfies Record<EventActionIcon, string[]>;
  return svgIcon(icons[name], "action-icon");
}

function attendanceBadge(
  mode: NonNullable<PreviewEvent["attendanceMode"]>,
  label: string,
): HTMLElement {
  const badge = el("span", `badge attendance-badge attendance-${mode}`);
  badge.append(attendanceIcon(mode), document.createTextNode(label));
  return badge;
}

function locationNode(event: PreviewEvent, strings: Strings): HTMLElement {
  const rawLocation = rawLocationText(event, strings);
  const inferredLink = event.locationLink ?? urlLike(rawLocation);
  const location = locationText(event, strings);
  if (!inferredLink) return withText(el("span"), location);
  const link = el("a");
  link.href = inferredLink;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = location;
  return link;
}

function rawLocationText(event: PreviewEvent, strings: Strings): string {
  return event.location && event.location !== "online" ? event.location : strings.online;
}

function locationText(event: PreviewEvent, strings: Strings): string {
  const rawLocation = rawLocationText(event, strings);
  const inferredLink = event.locationLink ?? urlLike(rawLocation);
  return displayLocationLabel(inferredLink ? onlineLocationLabel(inferredLink) : rawLocation, strings);
}

function displayLocationLabel(value: string | undefined, strings: Strings): string {
  if (!value || value === "online") return strings.online;
  if (value === "Online link" || value === "Online event") return strings.onlineEvent;
  return value;
}

function urlLike(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : undefined;
  } catch {
    return undefined;
  }
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

function parseEventDate(value: string | undefined, timezone: string | undefined): Date | undefined {
  if (!value) return undefined;
  const dateOnly = isDateOnly(value);
  const date = new Date(`${value}${timezone === "UTC" && !dateOnly ? "Z" : ""}`);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

function calendarDateParam(date: Date, dateOnly: boolean): string {
  const iso = date.toISOString();
  if (dateOnly) return iso.slice(0, 10).replace(/-/g, "");
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function addOneUtcDay(date: Date): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + 1);
  return next;
}

function calendarRange(event: PreviewEvent): { start: Date; end: Date; dateOnly: boolean } | undefined {
  const start = parseEventDate(event.startDate, event.timezone);
  if (!start) return undefined;
  const dateOnly = isDateOnly(event.startDate);
  const end =
    parseEventDate(dateOnly && event.endDate ? addDays(event.endDate, 1) : event.endDate, event.timezone) ??
    (dateOnly ? addOneUtcDay(start) : start);
  return { start, end, dateOnly };
}

function eventDescription(event: PreviewEvent): string {
  return event.description ?? "";
}

export function eventActionHref(
  action: NativeEventAction,
  event: PreviewEvent,
  strings: Strings,
): string | undefined {
  if (action === "link") return event.link;

  const range = calendarRange(event);
  if (!range) return undefined;

  const start = calendarDateParam(range.start, range.dateOnly);
  const end = calendarDateParam(range.end, range.dateOnly);
  const details = eventDescription(event);
  const location = locationText(event, strings);

  if (action === "google-calendar") {
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", event.name);
    url.searchParams.set("dates", `${start}/${end}`);
    if (details) url.searchParams.set("details", details);
    if (location) url.searchParams.set("location", location);
    if (event.timezone) url.searchParams.set("ctz", event.timezone);
    return url.toString();
  }

  if (action === "outlook-calendar") {
    const url = new URL("https://outlook.live.com/calendar/0/action/compose");
    url.searchParams.set("rru", "addevent");
    url.searchParams.set("subject", event.name);
    url.searchParams.set("startdt", range.start.toISOString());
    url.searchParams.set("enddt", range.end.toISOString());
    if (details) url.searchParams.set("body", details);
    if (location) url.searchParams.set("location", location);
    return url.toString();
  }

  if (action === "yahoo-calendar") {
    const url = new URL("https://calendar.yahoo.com/");
    url.searchParams.set("v", "60");
    url.searchParams.set("title", event.name);
    url.searchParams.set("st", start);
    url.searchParams.set("et", end);
    if (details) url.searchParams.set("desc", details);
    if (location) url.searchParams.set("in_loc", location);
    return url.toString();
  }

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(eventIcs(event, range, strings))}`;
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function eventIcs(
  event: PreviewEvent,
  range: { start: Date; end: Date; dateOnly: boolean },
  strings: Strings,
): string {
  const dateParam = (date: Date) => calendarDateParam(date, range.dateOnly);
  const dateProperty = range.dateOnly ? ";VALUE=DATE" : "";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OpenTechEvents//ote-events//EN",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(event.link ?? event.name)}`,
    `DTSTAMP:${calendarDateParam(new Date(), false)}`,
    `DTSTART${dateProperty}:${dateParam(range.start)}`,
    `DTEND${dateProperty}:${dateParam(range.end)}`,
    `SUMMARY:${escapeIcsText(event.name)}`,
  ];
  const description = eventDescription(event);
  const location = locationText(event, strings);
  if (description) lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
  if (location) lines.push(`LOCATION:${escapeIcsText(location)}`);
  if (event.link) lines.push(`URL:${escapeIcsText(event.link)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
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

function whenNode(event: PreviewEvent): HTMLElement | undefined {
  const compactWhen = formatCompactWhen(event);
  const readableWhen = formatReadableWhen(event) ?? eventWhen(event);
  const when = compactWhen ?? readableWhen;
  if (!when) return undefined;
  const node = withText(el("p", "event-when"), when);
  if (readableWhen && readableWhen !== when) {
    node.title = readableWhen;
    node.setAttribute("aria-label", readableWhen);
    node.tabIndex = 0;
  }
  return node;
}

function detailWhenNode(event: PreviewEvent): HTMLElement | undefined {
  const compactWhen = formatCompactWhen(event);
  const readableWhen = formatReadableWhen(event) ?? eventWhen(event);
  const when = compactWhen ?? readableWhen;
  if (!when) return undefined;
  const node = withText(el("span", "event-detail-when"), when);
  if (readableWhen && readableWhen !== when) {
    node.title = readableWhen;
    node.setAttribute("aria-label", readableWhen);
    node.tabIndex = 0;
  }
  return node;
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
  state: WidgetState,
  strings: Strings,
): HTMLLIElement {
  const item = el("li", "event");
  attachOpenBehavior(item, event, state);

  if (state.fields.has("image")) {
    item.append(renderEventImage(event, state.placeholderImage) ?? renderCardPlaceholder(state.placeholderImage));
  }

  const body = el("div", "event-body");
  item.append(body);

  const title = el("h3", "event-title");
  if (event.link && state.eventClick === "link") {
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

  if (state.fields.has("when")) {
    const when = whenNode(event);
    if (when) body.append(when);
  }

  const badges = el("div", "event-badges");
  if (state.fields.has("attendance") && event.attendanceMode) {
    badges.append(attendanceBadge(event.attendanceMode, strings.attendance[event.attendanceMode]));
  }
  if (state.fields.has("price") && event.price) {
    badges.append(withText(el("span", "price"), formatPrice(event.price, strings)));
  }

  const meta = el("div", "event-meta");
  if (badges.children.length > 0) meta.append(badges);
  if (state.fields.has("location")) {
    const location = el("p", "event-location");
    location.append(locationNode(event, strings));
    meta.append(location);
  }
  if (meta.children.length > 0) body.append(meta);

  if (state.fields.has("organizer") && event.organizerName) {
    body.append(withText(el("p", "event-organizer"), event.organizerName));
  }

  if (state.fields.has("description")) {
    const description = truncate(event.description, 220);
    if (description) body.append(renderMarkdownDescription(description));
  }

  if (state.fields.has("tags") && event.tags && event.tags.length > 0) {
    const tagList = el("ul", "tags");
    for (const tag of event.tags) tagList.append(withText(el("li", "tag"), tag));
    body.append(tagList);
  }

  appendPreviewActions(body, event, state);

  return item;
}

function findDetail(event: PreviewEvent, label: string): string | undefined {
  return event.details?.find((detail) => detail.label === label)?.value;
}

const TECHNICAL_DETAIL_LABELS = new Set(["ID", "Source", "Image", "Updated"]);

function attachOpenBehavior(node: HTMLElement, event: PreviewEvent, state: WidgetState): void {
  if (state.eventClick === "none") return;
  node.classList.add("event-clickable");
  node.tabIndex = 0;
  node.addEventListener("click", (domEvent) => {
    const target = domEvent.target;
    if (target instanceof Element && target.closest("a, button, summary")) return;
    openEvent(event, state);
  });
  node.addEventListener("keydown", (domEvent) => {
    if (domEvent.key !== "Enter" && domEvent.key !== " ") return;
    domEvent.preventDefault();
    openEvent(event, state);
  });
}

function openEvent(event: PreviewEvent, state: WidgetState): void {
  state.onEventOpen?.(event);
  if (state.eventClick === "link" && event.link) window.open(event.link, "_blank", "noopener");
}

function appendDetailRow(list: HTMLDListElement, label: string, value: string | undefined): void {
  if (!value) return;
  list.append(withText(el("dt"), label), withText(el("dd"), value));
}

function appendDetailNode(list: HTMLDListElement, label: string, value: Node | undefined): void {
  if (!value) return;
  const dd = el("dd");
  dd.append(value);
  list.append(withText(el("dt"), label), dd);
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
  state: WidgetState,
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
  const hasRenderedImage = state.fields.has("image") && Boolean(event.image);
  const descriptionLength = event.description?.trim().length ?? 0;
  if (!hasRenderedImage && descriptionLength > 0 && descriptionLength <= 180) {
    body.classList.add("event-details-compact");
  }
  details.append(body);
  const content = el("div", "event-details-content");
  const main = el("div", "event-details-main");
  const aside = el("aside", "event-details-aside");
  content.append(main, aside);
  body.append(content);

  if (hasRenderedImage) {
    const image = renderEventImage(event, state.placeholderImage);
    if (image) aside.append(image);
  }

  const badges = el("div", "event-badges");
  if (state.fields.has("attendance") && event.attendanceMode) {
    badges.append(attendanceBadge(event.attendanceMode, strings.attendance[event.attendanceMode]));
  }
  if (state.fields.has("price") && event.price) {
    badges.append(withText(el("span", "price"), formatPrice(event.price, strings)));
  }
  if (badges.children.length > 0) aside.append(badges);

  if (state.fields.has("description")) {
    if (event.description) main.append(renderMarkdownDescription(event.description));
  }

  const detailList = el("dl", "event-detail-list");
  if (state.fields.has("when")) appendDetailRow(detailList, strings.when, when);
  if (state.fields.has("location")) {
    appendDetailNode(detailList, strings.location, locationNode(event, strings));
  }
  if (state.fields.has("organizer")) appendDetailRow(detailList, strings.organizer, event.organizerName);
  appendDetailRow(
    detailList,
    strings.updated,
    formatReadableDate(event.updatedAt ?? findDetail(event, "Updated"), undefined),
  );
  for (const detail of event.details ?? []) {
    if (TECHNICAL_DETAIL_LABELS.has(detail.label)) continue;
    appendDetailRow(detailList, detail.label, detail.value);
  }
  if (detailList.children.length > 0) aside.append(detailList);

  if (state.fields.has("tags") && event.tags && event.tags.length > 0) {
    const tagList = el("ul", "tags");
    for (const tag of event.tags) tagList.append(withText(el("li", "tag"), tag));
    main.append(tagList);
  }

  appendEventActions(body, event, strings, state);

  return item;
}

function nativeActionLabel(action: NativeEventAction, strings: Strings): string {
  if (action === "google-calendar") return strings.addToGoogle;
  if (action === "outlook-calendar") return strings.addToOutlook;
  if (action === "yahoo-calendar") return strings.addToYahoo;
  if (action === "ics") return strings.downloadIcs;
  return strings.openEventPage;
}

const CALENDAR_ACTIONS = new Set<NativeEventAction>([
  "google-calendar",
  "outlook-calendar",
  "yahoo-calendar",
  "ics",
]);

function actionMatchesLayout(action: CustomEventAction, layout: Layout): boolean {
  return !action.layouts || action.layouts.includes(layout);
}

function actionMatchesPlacement(action: CustomEventAction, placement: "detail" | "preview"): boolean {
  const actionPlacement = action.placement ?? "detail";
  return actionPlacement === placement || actionPlacement === "both";
}

function customActionsForPlacement(
  state: WidgetState,
  placement: "detail" | "preview",
): CustomEventAction[] {
  return state.eventActions.filter(
    (action): action is CustomEventAction =>
      typeof action !== "string" &&
      actionMatchesPlacement(action, placement) &&
      actionMatchesLayout(action, state.layout),
  );
}

function appendNativeActionLink(
  container: HTMLElement,
  action: NativeEventAction,
  event: PreviewEvent,
  strings: Strings,
  state: WidgetState,
): void {
  const href = eventActionHref(action, event, strings);
  if (!href) return;
  const link = el("a");
  link.href = href;
  link.target = action === "ics" ? "_self" : "_blank";
  link.rel = "noopener";
  if (action === "ics") link.setAttribute("download", "event.ics");
  if (action === "link") link.append(actionIcon("external-link"), document.createTextNode(nativeActionLabel(action, strings)));
  else link.textContent = nativeActionLabel(action, strings);
  link.addEventListener("click", () => state.onEventAction?.(action, event));
  container.append(link);
}

function appendEventActions(
  container: HTMLElement,
  event: PreviewEvent,
  strings: Strings,
  state: WidgetState,
): void {
  const actions = el("div", "event-actions");
  const calendarActions = state.eventActions.filter(
    (action): action is NativeEventAction => typeof action === "string" && CALENDAR_ACTIONS.has(action),
  );
  if (calendarActions.length > 0) {
    const menu = el("details", "event-action-menu");
    const summary = el("summary", "event-action-menu-trigger");
    summary.append(actionIcon("calendar"), document.createTextNode(strings.addToCalendar));
    menu.append(summary);

    const menuItems = el("div", "event-action-menu-items");
    for (const action of calendarActions) appendNativeActionLink(menuItems, action, event, strings, state);
    if (menuItems.children.length > 0) {
      menu.append(menuItems);
      actions.append(menu);
    }
  }

  for (const action of state.eventActions) {
    if (typeof action === "string") {
      if (!CALENDAR_ACTIONS.has(action)) appendNativeActionLink(actions, action, event, strings, state);
      continue;
    }
    if (actionMatchesPlacement(action, "detail") && actionMatchesLayout(action, state.layout)) {
      actions.append(customActionButton(action, event, state));
    }
  }
  if (actions.children.length > 0) container.append(actions);
}

function appendPreviewActions(
  container: HTMLElement,
  event: PreviewEvent,
  state: WidgetState,
): void {
  const customActions = customActionsForPlacement(state, "preview");
  if (customActions.length === 0) return;
  const actions = el("div", "event-actions event-preview-actions");
  for (const action of customActions) actions.append(customActionButton(action, event, state));
  container.append(actions);
}

function customActionButton(
  action: CustomEventAction,
  event: PreviewEvent,
  state: WidgetState,
): HTMLButtonElement {
  const button = el("button");
  button.type = "button";
  button.classList.add("event-custom-action");
  if (action.variant === "danger") button.classList.add("event-action-danger");
  if (action.icon) button.append(actionIcon(action.icon), document.createTextNode(action.label));
  else button.textContent = action.label;
  button.addEventListener("click", () => {
    state.onEventAction?.(action, event);
    action.onClick(event);
  });
  return button;
}

function renderModal(event: PreviewEvent, strings: Strings, state: WidgetState): HTMLElement {
  const backdrop = el("div", "event-modal-backdrop");
  backdrop.tabIndex = -1;
  backdrop.addEventListener("click", (domEvent) => {
    if (domEvent.target === backdrop) state.onEventClose?.();
  });
  backdrop.addEventListener("keydown", (domEvent) => {
    if (domEvent.key === "Escape") state.onEventClose?.();
  });

  const modal = el("section", "event-modal");
  const descriptionLength = event.description?.trim().length ?? 0;
  if (!event.image && descriptionLength > 0 && descriptionLength <= 180) {
    modal.classList.add("event-modal-compact");
  }
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", strings.eventDetails);
  backdrop.append(modal);

  const header = el("div", "event-modal-header");
  header.append(withText(el("h2", "event-modal-title"), event.name));
  const close = el("button", "event-modal-close");
  close.type = "button";
  close.textContent = "×";
  close.title = strings.close;
  close.setAttribute("aria-label", strings.close);
  close.addEventListener("click", () => state.onEventClose?.());
  header.append(close);
  modal.append(header);

  const content = el("div", "event-modal-content");
  const main = el("div", "event-modal-main");
  const aside = el("aside", "event-modal-aside");
  content.append(main, aside);
  modal.append(content);

  if (event.image) {
    const image = renderEventImage(event, state.placeholderImage);
    if (image) aside.append(image);
  }

  if (event.attendanceMode || event.price) {
    const badges = el("div", "event-badges");
    if (event.attendanceMode) {
      badges.append(attendanceBadge(event.attendanceMode, strings.attendance[event.attendanceMode]));
    }
    if (event.price) badges.append(withText(el("span", "price"), formatPrice(event.price, strings)));
    aside.append(badges);
  }

  if (event.description) main.append(renderMarkdownDescription(event.description));

  const detailList = el("dl", "event-detail-list");
  appendDetailNode(detailList, strings.when, detailWhenNode(event));
  appendDetailNode(detailList, strings.location, locationNode(event, strings));
  appendDetailRow(detailList, strings.organizer, event.organizerName);
  appendDetailRow(
    detailList,
    strings.updated,
    formatReadableDate(event.updatedAt ?? findDetail(event, "Updated"), undefined),
  );
  for (const detail of event.details ?? []) {
    if (TECHNICAL_DETAIL_LABELS.has(detail.label)) continue;
    appendDetailRow(detailList, detail.label, detail.value);
  }
  if (detailList.children.length > 0) aside.append(detailList);

  if (event.tags && event.tags.length > 0) {
    const tagList = el("ul", "tags");
    for (const tag of event.tags) tagList.append(withText(el("li", "tag"), tag));
    main.append(tagList);
  }

  appendEventActions(modal, event, strings, state);

  return backdrop;
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
    if (state.selectedEvent) container.append(renderModal(state.selectedEvent, strings, state));
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
        ? renderListEvent(event, strings, state)
        : renderCardEvent(event, state, strings),
    );
  }
  container.append(list);
  if (state.selectedEvent) container.append(renderModal(state.selectedEvent, strings, state));
}
