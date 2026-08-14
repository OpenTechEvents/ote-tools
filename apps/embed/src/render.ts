import DOMPurify from "dompurify";
import { marked } from "marked";

import {
  addDays,
  eventWhen,
  isDateOnly,
  onlineLocationLabel,
  parseSortDate,
  sortedEvents,
  truncate,
} from "@opentechevents/preview-feed";
import type { OteJsonEvent, PreviewEvent, PreviewFeed } from "@opentechevents/preview-feed";

import type { EventClickMode, FieldKey, GroupKey, Lang, Layout, NativeEventAction, SortMode } from "./attrs.js";
import { el, withText } from "./dom.js";
import { computeEventGroups } from "./grouping.js";
import type { EventGroupInfo, EventGroups } from "./grouping.js";

export type EventActionPlacement = "detail" | "preview" | "both";
export type EventActionIcon =
  | "edit"
  | "trash"
  | "copy"
  | "external-link"
  | "calendar"
  | "star"
  | "check"
  | "bookmark"
  | "plus"
  | "folder"
  | "collection";
export type EventActionVariant = "default" | "danger";

export interface OriginalOteEvent extends OteJsonEvent {
  [key: string]: unknown;
}

export interface EventFeedSource {
  url?: string;
  title?: string;
}

export interface EventRenderContext {
  previewEvent: PreviewEvent;
  originalEvent?: OriginalOteEvent;
  index: number;
  feed?: EventFeedSource;
  source?: unknown;
  group?: EventGroupInfo;
}

export interface EventBadge {
  label: string;
  icon?: EventActionIcon;
  title?: string;
  tone?: "default" | "success" | "warning" | "danger";
}

export type EventActionResolver = (context: EventRenderContext) => EventAction[];
export type EventActionsInput = EventAction[] | EventActionResolver;
export type EventClassNameResolver = (context: EventRenderContext) => string | string[] | undefined;
export type EventBadgesResolver = (context: EventRenderContext) => Array<string | EventBadge> | undefined;

export interface CustomEventAction {
  id: string;
  label: string;
  icon?: EventActionIcon;
  variant?: EventActionVariant;
  pressed?: boolean;
  placement?: EventActionPlacement;
  layouts?: Layout[];
  onClick(event: PreviewEvent, context: EventRenderContext): void;
}

export interface NativeEventActionConfig {
  type: NativeEventAction;
  placement?: EventActionPlacement;
  layouts?: Layout[];
}

export type EventAction = NativeEventAction | NativeEventActionConfig | CustomEventAction;

export interface WidgetState {
  status: "idle" | "loading" | "loaded" | "error";
  errorMessage: string;
  feed: PreviewFeed | undefined;
  lang: Lang;
  limit: number;
  showPast: boolean;
  sort: SortMode;
  layout: Layout;
  previewFields: Set<FieldKey>;
  detailFields: Set<FieldKey>;
  groupEvents: Set<GroupKey>;
  placeholderImage?: string;
  emptyMessage?: string;
  eventClick: EventClickMode;
  eventActions: EventActionsInput;
  eventClassName?: EventClassNameResolver;
  eventBadges?: EventBadgesResolver;
  eventContext?(event: PreviewEvent): EventRenderContext;
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
    locationUnknown: "Venue not specified",
    onlineLinkUnknown: "No public link",
    onlineLinkUnknownHint: "The organizer may share the link privately, e.g. after registration.",
    organizer: "Organizer",
    notAvailable: "—",
    attendance: { "in-person": "In person", online: "Online", hybrid: "Hybrid" },
    eligibility: {
      open: "Open to all",
      "members-only": "Members only",
      "approval-required": "Approval required",
      restricted: "Restricted",
    },
    cfp: "Call for Proposals",
    cfpCloses: (date: string) => `Call for Proposals — closes ${date}`,
    close: "Close",
    eventDetails: "Event details",
    addToGoogle: "Add to Google Calendar",
    addToOutlook: "Add to Outlook",
    addToYahoo: "Add to Yahoo",
    downloadIcs: "Download ICS",
    addToCalendar: "Add to calendar",
    openEventPage: "Open event page",
    groupSeries: "Series",
    groupMultipart: "Multi-part",
    groupCount: (total: number) => `${total} occurrences`,
    groupCounter: (index: number, total: number) => `${index} of ${total}`,
    previousOccurrence: "Previous occurrence",
    nextOccurrence: "Next occurrence",
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
    locationUnknown: "Sede no especificada",
    onlineLinkUnknown: "Sin enlace público",
    onlineLinkUnknownHint: "El organizador podría compartir el enlace de forma privada, por ejemplo tras inscribirte.",
    organizer: "Organizador",
    notAvailable: "—",
    attendance: { "in-person": "Presencial", online: "En línea", hybrid: "Híbrido" },
    eligibility: {
      open: "Abierto a todos",
      "members-only": "Solo miembros",
      "approval-required": "Requiere aprobación",
      restricted: "Acceso restringido",
    },
    cfp: "Convocatoria de ponencias",
    cfpCloses: (date: string) => `Convocatoria de ponencias — cierra ${date}`,
    close: "Cerrar",
    eventDetails: "Detalles del evento",
    addToGoogle: "Añadir a Google Calendar",
    addToOutlook: "Añadir a Outlook",
    addToYahoo: "Añadir a Yahoo",
    downloadIcs: "Descargar ICS",
    addToCalendar: "Añadir al calendario",
    openEventPage: "Abrir página del evento",
    groupSeries: "Serie",
    groupMultipart: "Multi-part",
    groupCount: (total: number) => `${total} ocurrencias`,
    groupCounter: (index: number, total: number) => `${index} de ${total}`,
    previousOccurrence: "Ocurrencia anterior",
    nextOccurrence: "Ocurrencia siguiente",
  },
} as const;

type Strings = (typeof STRINGS)[Lang];


/**
 * `marked` gives full CommonMark+GFM support (headings, nested lists, code
 * spans, etc.) instead of the ad hoc line-based parser this replaced — same
 * library the editor uses for its own preview, so authors see the same
 * rendering both places. `event.description` comes from a remote feed the
 * widget doesn't control, so the resulting HTML is untrusted and must be
 * sanitized before insertion; DOMPurify's defaults strip script/event-handler
 * payloads and non-http(s) URL schemes. `target`/`rel` are then applied
 * uniformly to every link, matching every other outbound link this widget
 * renders (see e.g. `locationNode`, `cfpBadge`).
 */
function renderMarkdownDescription(markdown: string, className = "event-description"): HTMLElement {
  const wrapper = el("div", className);
  const html = marked.parse(markdown, { async: false });
  wrapper.innerHTML = DOMPurify.sanitize(html);
  for (const link of wrapper.querySelectorAll("a[href]")) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  }
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
    star: [
      "M12 2l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.77 5.82 21 7 14.13 2 9.26l6.91-1L12 2",
    ],
    check: ["M20 6 9 17l-5-5"],
    bookmark: ["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],
    plus: ["M12 5v14", "M5 12h14"],
    folder: [
      "M4 4h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2",
    ],
    collection: [
      "M4 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2",
      "M8 2v4",
      "M16 2v4",
      "M7 10h10",
      "M7 14h7",
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

function eligibilityBadge(
  eligibility: NonNullable<PreviewEvent["eligibility"]>,
  strings: Strings,
): HTMLElement {
  const label = strings.eligibility[eligibility.type];
  const badge = eligibility.url ? el("a") : el("span");
  badge.classList.add("badge", "eligibility-badge");
  if (eligibility.url) {
    const link = badge as HTMLAnchorElement;
    link.href = eligibility.url;
    link.target = "_blank";
    link.rel = "noopener";
  }
  badge.textContent = label;
  if (eligibility.note) {
    badge.title = eligibility.note;
    badge.setAttribute("aria-label", `${label}: ${eligibility.note}`);
  }
  return badge;
}

function cfpBadge(cfp: NonNullable<PreviewEvent["cfp"]>, strings: Strings): HTMLElement {
  const badge = el("a", "badge cfp-badge");
  badge.href = cfp.url;
  badge.target = "_blank";
  badge.rel = "noopener";
  badge.textContent = strings.cfp;
  const closesAt = formatReadableDate(cfp.closesAt, undefined);
  if (closesAt) {
    const title = strings.cfpCloses(closesAt);
    badge.title = title;
    badge.setAttribute("aria-label", title);
  }
  return badge;
}

function groupBadgeLabel(type: GroupKey, strings: Strings): string {
  return type === "multipart" ? strings.groupMultipart : strings.groupSeries;
}

/**
 * The stacked card's mandatory badge. Visible text is the type label only
 * (no occurrence count, by design — the count lives in the modal's "N of M"
 * counter) but the count is still exposed via aria-label for screen readers.
 */
function renderGroupBadge(info: EventGroupInfo, strings: Strings): HTMLElement {
  const label = groupBadgeLabel(info.type, strings);
  const badge = el("span", "badge event-group-badge");
  badge.textContent = label;
  badge.setAttribute("aria-label", `${label}, ${strings.groupCount(info.total)}`);
  return badge;
}

function locationNode(event: PreviewEvent, strings: Strings): HTMLElement {
  const rawLocation = rawLocationText(event, strings);
  const inferredLink = event.locationLink ?? urlLike(rawLocation);
  const location = locationText(event, strings);
  if (!inferredLink) {
    const span = withText(el("span"), location);
    if (isOnlineLinkUnpublished(event)) span.title = strings.onlineLinkUnknownHint;
    return span;
  }
  const link = el("a");
  link.href = inferredLink;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = location;
  return link;
}

/**
 * True for an online event with no link at all — as opposed to one whose
 * link simply isn't public yet for other reasons the schema can't express.
 * The short inline label ("No public link") can't say why on its own, so
 * this gates a `title` tooltip with a longer hint (e.g. "shared with
 * registered attendees") without bloating the card copy.
 */
function isOnlineLinkUnpublished(event: PreviewEvent): boolean {
  return event.attendanceMode === "online" && !event.locationLink && (!event.location || event.location === "online");
}

/**
 * `event.location` is set to the literal "online" sentinel by
 * `@opentechevents/preview-feed` whenever the source gave no venue and no
 * online URL — a data-agnostic fallback that doesn't know the event's
 * `attendanceMode`. Resolving that sentinel here, where `attendanceMode` is
 * available, avoids three bugs: an in-person event with no venue silently
 * claiming to be "Online" (wrong, not just noisy); an online event repeating
 * the same "Online" text the attendance badge already shows; and an event
 * with no `attendanceMode` at all (nothing declared either way) asserting
 * "Online" as if that were known — same wrongness as the in-person case,
 * just with attendance unspecified instead of specified-but-no-venue, so it
 * shares that case's fallback rather than defaulting to "Online".
 */
function rawLocationText(event: PreviewEvent, strings: Strings): string {
  if (event.location && event.location !== "online") return event.location;
  if (event.attendanceMode === "online") return strings.onlineLinkUnknown;
  return strings.locationUnknown;
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

/** Sort → filter past (unless show-past). Shared by every layout, pre-grouping/pre-limit. */
function visibleEvents(state: WidgetState): PreviewEvent[] {
  if (!state.feed) return [];
  const events = state.sort === "none" ? [...state.feed.events] : sortedEvents(state.feed.events);
  return events.filter((event) => state.showPast || !isPastEvent(event));
}

/**
 * Groups only apply to `layout="cards"`: `list` and `calendar` keep every
 * occurrence flat (calendar in particular must show each date on its own
 * day). Computed on demand from live state rather than cached, so toggling
 * `group-events`/`layout`/`sort`/`show-past` via attributeChangedCallback
 * alone (no feed reload) never leaves stale group info behind.
 */
export function resolveEventGroups(state: WidgetState): EventGroups {
  if (state.layout !== "cards" || state.groupEvents.size === 0) {
    return { headerOf: new Map(), infoOf: new Map() };
  }
  return computeEventGroups(visibleEvents(state), state.groupEvents);
}

/** Sort → filter past (unless show-past) → collapse groups → cap at limit. Shared by every layout. */
export function selectVisibleEvents(state: WidgetState): PreviewEvent[] {
  const events = visibleEvents(state);
  if (state.layout !== "cards" || state.groupEvents.size === 0) return events.slice(0, state.limit);

  const { headerOf } = computeEventGroups(events, state.groupEvents);
  const seen = new Set<PreviewEvent>();
  const collapsed: PreviewEvent[] = [];
  for (const event of events) {
    const header = headerOf.get(event) ?? event;
    if (seen.has(header)) continue;
    seen.add(header);
    collapsed.push(header);
  }
  return collapsed.slice(0, state.limit);
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

/** Links out to the registration/ticket page when the winning offer had a `url`. */
function priceBadge(price: NonNullable<PreviewEvent["price"]>, strings: Strings): HTMLElement {
  const text = formatPrice(price, strings);
  if (!price.url) return withText(el("span", "price"), text);
  const link = el("a", "price");
  link.href = price.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = text;
  return link;
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
  groups: EventGroups | undefined,
): HTMLLIElement {
  const item = el("li", "event");
  if (isPastEvent(event)) item.classList.add("event-past");
  applyEventClassNames(item, event, state);
  attachOpenBehavior(item, event, state);

  const groupInfo = groups?.infoOf.get(event);
  if (groupInfo) {
    item.classList.add("event-stacked");
    item.append(renderGroupBadge(groupInfo, strings));
  }

  if (state.previewFields.has("image")) {
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

  if (state.previewFields.has("when")) {
    const when = whenNode(event);
    if (when) body.append(when);
  }

  const badges = el("div", "event-badges");
  if (state.previewFields.has("attendance") && event.attendanceMode) {
    badges.append(attendanceBadge(event.attendanceMode, strings.attendance[event.attendanceMode]));
  }
  if (state.previewFields.has("price") && event.price) {
    badges.append(priceBadge(event.price, strings));
  }
  if (state.previewFields.has("eligibility") && event.eligibility) {
    badges.append(eligibilityBadge(event.eligibility, strings));
  }
  if (state.previewFields.has("cfp") && event.cfp) {
    badges.append(cfpBadge(event.cfp, strings));
  }
  appendCustomBadges(badges, event, state);

  const meta = el("div", "event-meta");
  if (badges.children.length > 0) meta.append(badges);
  if (state.previewFields.has("location")) {
    const location = el("p", "event-location");
    location.append(locationNode(event, strings));
    meta.append(location);
  }
  if (meta.children.length > 0) body.append(meta);

  if (state.previewFields.has("organizer") && event.organizerName) {
    body.append(withText(el("p", "event-organizer"), event.organizerName));
  }

  if (state.previewFields.has("description")) {
    const description = truncate(event.description, 220);
    if (description) body.append(renderMarkdownDescription(description));
  }

  if (state.previewFields.has("tags") && event.tags && event.tags.length > 0) {
    const tagList = el("ul", "tags");
    for (const tag of event.tags) tagList.append(withText(el("li", "tag"), tag));
    body.append(tagList);
  }

  appendPreviewActions(body, event, strings, state);

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
  if (isPastEvent(event)) item.classList.add("event-past");
  applyEventClassNames(item, event, state);
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
  const hasRenderedImage = state.detailFields.has("image") && Boolean(event.image);
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
  if (state.detailFields.has("attendance") && event.attendanceMode) {
    badges.append(attendanceBadge(event.attendanceMode, strings.attendance[event.attendanceMode]));
  }
  if (state.detailFields.has("price") && event.price) {
    badges.append(priceBadge(event.price, strings));
  }
  if (state.detailFields.has("eligibility") && event.eligibility) {
    badges.append(eligibilityBadge(event.eligibility, strings));
  }
  if (state.detailFields.has("cfp") && event.cfp) {
    badges.append(cfpBadge(event.cfp, strings));
  }
  appendCustomBadges(badges, event, state);
  if (badges.children.length > 0) aside.append(badges);

  if (state.detailFields.has("description")) {
    if (event.description) main.append(renderMarkdownDescription(event.description));
  }

  const detailList = el("dl", "event-detail-list");
  if (state.detailFields.has("when")) appendDetailRow(detailList, strings.when, when);
  if (state.detailFields.has("location")) {
    appendDetailNode(detailList, strings.location, locationNode(event, strings));
  }
  if (state.detailFields.has("organizer")) appendDetailRow(detailList, strings.organizer, event.organizerName);
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

  if (state.detailFields.has("tags") && event.tags && event.tags.length > 0) {
    const tagList = el("ul", "tags");
    for (const tag of event.tags) tagList.append(withText(el("li", "tag"), tag));
    main.append(tagList);
  }

  appendEventActions(body, event, strings, state);
  appendListPreviewActions(item, event, strings, state);

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

function isNativeActionConfig(action: EventAction): action is NativeEventActionConfig {
  return typeof action !== "string" && "type" in action;
}

function isCustomAction(action: EventAction): action is CustomEventAction {
  return typeof action !== "string" && "id" in action;
}

function nativeActionType(action: NativeEventAction | NativeEventActionConfig): NativeEventAction {
  return typeof action === "string" ? action : action.type;
}

function actionMatchesLayout(
  action: CustomEventAction | NativeEventActionConfig,
  layout: Layout,
): boolean {
  return !action.layouts || action.layouts.includes(layout);
}

function actionMatchesPlacement(
  action: CustomEventAction | NativeEventActionConfig,
  placement: "detail" | "preview",
): boolean {
  const actionPlacement = action.placement ?? "detail";
  return actionPlacement === placement || actionPlacement === "both";
}

function nativeActionMatchesPlacement(
  action: NativeEventAction | NativeEventActionConfig,
  placement: "detail" | "preview",
  layout: Layout,
): boolean {
  if (typeof action === "string") return placement === "detail";
  return actionMatchesPlacement(action, placement) && actionMatchesLayout(action, layout);
}

function nativeActionsForPlacement(
  state: WidgetState,
  event: PreviewEvent,
  placement: "detail" | "preview",
): Array<NativeEventAction | NativeEventActionConfig> {
  return eventActionsForEvent(state, event).filter(
    (action): action is NativeEventAction | NativeEventActionConfig =>
      (typeof action === "string" || isNativeActionConfig(action)) &&
      nativeActionMatchesPlacement(action, placement, state.layout),
  );
}

function customActionsForPlacement(
  state: WidgetState,
  event: PreviewEvent,
  placement: "detail" | "preview",
): CustomEventAction[] {
  return eventActionsForEvent(state, event).filter(
    (action): action is CustomEventAction =>
      isCustomAction(action) &&
      actionMatchesPlacement(action, placement) &&
      actionMatchesLayout(action, state.layout),
  );
}

function appendNativeActionLink(
  container: HTMLElement,
  action: NativeEventAction | NativeEventActionConfig,
  event: PreviewEvent,
  strings: Strings,
  state: WidgetState,
): void {
  const type = nativeActionType(action);
  const href = eventActionHref(type, event, strings);
  if (!href) return;
  const link = el("a");
  link.href = href;
  link.target = type === "ics" ? "_self" : "_blank";
  link.rel = "noopener";
  if (type === "ics") link.setAttribute("download", "event.ics");
  if (type === "link") link.append(actionIcon("external-link"), document.createTextNode(nativeActionLabel(type, strings)));
  else link.textContent = nativeActionLabel(type, strings);
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
  const nativeActions = nativeActionsForPlacement(state, event, "detail");
  const calendarActions = nativeActions.filter((action) => CALENDAR_ACTIONS.has(nativeActionType(action)));
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

  for (const action of nativeActions) {
    if (!CALENDAR_ACTIONS.has(nativeActionType(action))) {
      appendNativeActionLink(actions, action, event, strings, state);
    }
  }

  for (const action of customActionsForPlacement(state, event, "detail")) actions.append(customActionButton(action, event, state));
  if (actions.children.length > 0) container.append(actions);
}

/**
 * Shared by both `renderCardEvent` (appended inside the card body) and
 * `renderListEvent` (appended as a row-level overlay, see
 * `.event-row-actions` in theme.css.ts) — same action set, different mount
 * point. Returns `undefined` when there's nothing to show so callers can
 * skip mounting an empty wrapper.
 */
function buildPreviewActions(
  event: PreviewEvent,
  strings: Strings,
  state: WidgetState,
): HTMLElement | undefined {
  const nativeActions = nativeActionsForPlacement(state, event, "preview");
  const customActions = customActionsForPlacement(state, event, "preview");
  if (nativeActions.length === 0 && customActions.length === 0) return undefined;
  const actions = el("div", "event-actions event-preview-actions");
  const calendarActions = nativeActions.filter((action) => CALENDAR_ACTIONS.has(nativeActionType(action)));
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
  for (const action of nativeActions) {
    if (!CALENDAR_ACTIONS.has(nativeActionType(action))) {
      appendNativeActionLink(actions, action, event, strings, state);
    }
  }
  for (const action of customActions) actions.append(customActionButton(action, event, state));
  return actions;
}

function appendPreviewActions(
  container: HTMLElement,
  event: PreviewEvent,
  strings: Strings,
  state: WidgetState,
): void {
  const actions = buildPreviewActions(event, strings, state);
  if (actions) container.append(actions);
}

/**
 * Mounted as a sibling of `.event-accordion`, not a descendant of
 * `<summary>`: Chromium never fires a nested `<a>`'s own navigation once
 * it's inside a `<summary>` (verified empirically — a real click or Enter
 * keypress on the link is swallowed with no toggle *and* no navigation),
 * which would silently break native calendar/link preview actions. Living
 * outside `<summary>` keeps every existing action (native anchors, the
 * calendar `<details>` menu, custom buttons) working exactly as it does in
 * `.event-preview-actions` for cards, with no special-cased click handling
 * needed, while `.event-row-actions` in theme.css.ts absolutely-positions
 * it back on top of the collapsed row so it still reads as part of it.
 */
function appendListPreviewActions(
  row: HTMLElement,
  event: PreviewEvent,
  strings: Strings,
  state: WidgetState,
): void {
  const actions = buildPreviewActions(event, strings, state);
  if (!actions) return;
  actions.classList.add("event-row-actions");
  row.append(actions);
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
  if (action.pressed !== undefined) button.setAttribute("aria-pressed", String(action.pressed));
  if (action.icon) button.append(actionIcon(action.icon), document.createTextNode(action.label));
  else button.textContent = action.label;
  button.addEventListener("click", () => {
    state.onEventAction?.(action, event);
    action.onClick(event, eventContextFor(state, event));
  });
  return button;
}

function eventContextFor(state: WidgetState, event: PreviewEvent): EventRenderContext {
  const base = state.eventContext?.(event) ?? {
    previewEvent: event,
    index: state.feed?.events.indexOf(event) ?? -1,
  };
  const group = resolveEventGroups(state).infoOf.get(event);
  return group ? { ...base, group } : base;
}

function eventActionsForEvent(state: WidgetState, event: PreviewEvent): EventAction[] {
  return typeof state.eventActions === "function"
    ? state.eventActions(eventContextFor(state, event))
    : state.eventActions;
}

function normalizeClassNames(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const values = Array.isArray(value) ? value : value.split(/\s+/);
  return values.map((item) => item.trim()).filter(Boolean);
}

function applyEventClassNames(node: HTMLElement, event: PreviewEvent, state: WidgetState): void {
  for (const className of normalizeClassNames(state.eventClassName?.(eventContextFor(state, event)))) {
    node.classList.add(className);
  }
}

function appendCustomBadges(container: HTMLElement, event: PreviewEvent, state: WidgetState): void {
  const badges = state.eventBadges?.(eventContextFor(state, event)) ?? [];
  for (const badge of badges) {
    if (typeof badge === "string") {
      const node = el("span", "badge event-custom-badge event-custom-badge-default");
      node.title = badge;
      node.append(withText(el("span", "event-custom-badge-label"), badge));
      container.append(node);
      continue;
    }
    const node = el("span", `badge event-custom-badge event-custom-badge-${badge.tone ?? "default"}`);
    node.title = badge.title ?? badge.label;
    if (badge.icon) node.append(actionIcon(badge.icon));
    node.append(withText(el("span", "event-custom-badge-label"), badge.label));
    container.append(node);
  }
}

function chevronIcon(direction: "left" | "right"): SVGSVGElement {
  const path = direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6";
  return svgIcon([path], "event-modal-nav-icon");
}

function renderModalNav(info: EventGroupInfo, strings: Strings, state: WidgetState): HTMLElement {
  const nav = el("div", "event-modal-nav");

  const prev = el("button", "event-modal-nav-button");
  prev.type = "button";
  prev.setAttribute("aria-label", strings.previousOccurrence);
  prev.title = strings.previousOccurrence;
  prev.append(chevronIcon("left"));
  const previousMember = info.members[info.index - 2];
  prev.disabled = !previousMember;
  prev.addEventListener("click", () => {
    if (previousMember) state.onEventOpen?.(previousMember);
  });

  const counter = el("span", "event-modal-nav-counter");
  counter.setAttribute("aria-live", "polite");
  counter.textContent = strings.groupCounter(info.index, info.total);

  const next = el("button", "event-modal-nav-button");
  next.type = "button";
  next.setAttribute("aria-label", strings.nextOccurrence);
  next.title = strings.nextOccurrence;
  next.append(chevronIcon("right"));
  const nextMember = info.members[info.index];
  next.disabled = !nextMember;
  next.addEventListener("click", () => {
    if (nextMember) state.onEventOpen?.(nextMember);
  });

  nav.append(prev, counter, next);
  return nav;
}

function renderModal(
  event: PreviewEvent,
  strings: Strings,
  state: WidgetState,
  groups?: EventGroups,
): HTMLElement {
  const backdrop = el("div", "event-modal-backdrop");
  backdrop.tabIndex = -1;
  backdrop.addEventListener("click", (domEvent) => {
    if (domEvent.target === backdrop) state.onEventClose?.();
  });
  backdrop.addEventListener("keydown", (domEvent) => {
    if (domEvent.key === "Escape") state.onEventClose?.();
  });

  const modal = el("section", "event-modal");
  applyEventClassNames(modal, event, state);
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

  const groupInfo = groups?.infoOf.get(event);

  const content = el("div", "event-modal-content");
  const main = el("div", "event-modal-main");
  const aside = el("aside", "event-modal-aside");
  content.append(main, aside);
  modal.append(content);

  if (state.detailFields.has("image") && event.image) {
    const image = renderEventImage(event, state.placeholderImage);
    if (image) aside.append(image);
  }

  const badges = el("div", "event-badges");
  if (state.detailFields.has("attendance") && event.attendanceMode) {
    badges.append(attendanceBadge(event.attendanceMode, strings.attendance[event.attendanceMode]));
  }
  if (state.detailFields.has("price") && event.price) badges.append(priceBadge(event.price, strings));
  if (state.detailFields.has("eligibility") && event.eligibility) {
    badges.append(eligibilityBadge(event.eligibility, strings));
  }
  if (state.detailFields.has("cfp") && event.cfp) badges.append(cfpBadge(event.cfp, strings));
  appendCustomBadges(badges, event, state);
  if (badges.children.length > 0) aside.append(badges);

  if (state.detailFields.has("description") && event.description) {
    main.append(renderMarkdownDescription(event.description));
  }

  const detailList = el("dl", "event-detail-list");
  if (state.detailFields.has("when")) appendDetailNode(detailList, strings.when, detailWhenNode(event));
  // Nav sits right under "When" — the arrows change that specific value, so
  // keeping them adjacent reads as one unit rather than a disconnected control.
  if (groupInfo && groupInfo.total > 1) {
    detailList.append(renderModalNav(groupInfo, strings, state));
  }
  if (state.detailFields.has("location")) {
    appendDetailNode(detailList, strings.location, locationNode(event, strings));
  }
  if (state.detailFields.has("organizer")) appendDetailRow(detailList, strings.organizer, event.organizerName);
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

  if (state.detailFields.has("tags") && event.tags && event.tags.length > 0) {
    const tagList = el("ul", "tags");
    for (const tag of event.tags) tagList.append(withText(el("li", "tag"), tag));
    main.append(tagList);
  }

  appendEventActions(modal, event, strings, state);

  // `close` isn't in the DOM yet here — the caller appends the returned
  // backdrop synchronously right after this call. Deferring to a microtask
  // means the focus() runs after that append lands, so it actually takes
  // (a detached element can't receive focus). Without this, the keydown
  // listener above never fires: focus stays wherever it was on the host
  // page, outside this shadow-DOM subtree, so Escape silently does nothing.
  queueMicrotask(() => close.focus());

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
    container.append(withText(el("p", "message"), state.emptyMessage ?? strings.empty));
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

  const groups = resolveEventGroups(state);
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
        : renderCardEvent(event, state, strings, groups),
    );
  }
  container.append(list);
  if (state.selectedEvent) container.append(renderModal(state.selectedEvent, strings, state, groups));
}
