import { Calendar, type EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import { rssToPreviewFeed } from "@opentechevents/export-rss";
import { icsToEvents, parseIcs } from "@opentechevents/import-ics";

interface PreviewEvent {
  name: string;
  startDate?: string;
  endDate?: string;
  timezone?: string;
  dateLabel?: string;
  location?: string;
  link?: string;
  description?: string;
  details?: Array<{ label: string; value: string }>;
}

interface PreviewFeed {
  title?: string;
  description?: string;
  license?: string;
  events: PreviewEvent[];
}

interface FileState {
  label: string;
  filename: string;
  status: "loading" | "ready" | "missing" | "error";
  directUrl?: string;
  url?: string;
  source?: string;
  feed?: PreviewFeed;
  error?: string;
}

const REPO_RE =
  /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;

type FileKey = "json" | "ics" | "rss";

const files: Record<FileKey, FileState> = {
  json: { label: "Feed (JSON)", filename: "feed.json", status: "loading" },
  ics: { label: "Calendar (ICS)", filename: "feed.ics", status: "loading" },
  rss: { label: "RSS (XML)", filename: "feed.xml", status: "loading" },
};

const repoBanner = document.querySelector<HTMLParagraphElement>("#repo-banner")!;
const repoMessage = document.querySelector<HTMLElement>("#repo-message")!;
const preview = document.querySelector<HTMLElement>("#preview")!;
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>(".tab"));
const panels: Record<FileKey, HTMLElement> = {
  json: document.querySelector<HTMLElement>("#panel-json")!,
  ics: document.querySelector<HTMLElement>("#panel-ics")!,
  rss: document.querySelector<HTMLElement>("#panel-rss")!,
};
const calendars: Calendar[] = [];

function clearCalendars(): void {
  for (const calendar of calendars) calendar.destroy();
  calendars.length = 0;
}

function parseRepoParam(search: string): string | null {
  const repo = new URLSearchParams(search).get("repo")?.trim();
  return repo && REPO_RE.test(repo) ? repo : null;
}

function parseFeedParam(search: string): { url: URL; tab: FileKey } | null {
  const raw = new URLSearchParams(search).get("feed")?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const filename = url.pathname.split("/").at(-1);
    if (filename === "feed.json") return { url, tab: "json" };
    if (filename === "feed.ics") return { url, tab: "ics" };
    if (filename === "feed.xml") return { url, tab: "rss" };
    return null;
  } catch {
    return null;
  }
}

function pagesUrl(repo: string, filename: string): string {
  const [owner, name] = repo.split("/");
  return `https://${owner}.github.io/${name}/${filename}`;
}

function rawUrl(repo: string, filename: string): string {
  return `https://raw.githubusercontent.com/${repo}/HEAD/${filename}`;
}

function siblingFeedUrl(feedUrl: URL, filename: string): string {
  const url = new URL(feedUrl);
  url.pathname = url.pathname.replace(/[^/]*$/, filename);
  return url.toString();
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function truncate(text: string | undefined, length = 320): string | undefined {
  if (!text) return undefined;
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > length ? `${compact.slice(0, length - 1)}…` : compact;
}

function nonEmpty(value: unknown): string | undefined {
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : undefined;
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value && typeof value === "object") return JSON.stringify(value);
  return undefined;
}

function detailRows(entries: Array<[string, unknown]>): PreviewEvent["details"] {
  return entries.flatMap(([label, value]) => {
    const text = nonEmpty(value);
    return text ? [{ label, value: text }] : [];
  });
}

function parseSortDate(value: string | undefined): number | null {
  if (!value) return null;
  const isoLike = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/.exec(
    value,
  );
  const date = isoLike
    ? new Date(`${isoLike[1]}T${isoLike[2] ?? "00:00:00"}`)
    : new Date(value);
  const time = date.valueOf();
  return Number.isNaN(time) ? null : time;
}

function sortedEvents(events: PreviewEvent[]): PreviewEvent[] {
  const now = Date.now();
  return events
    .map((event, index) => ({ event, index, sortDate: parseSortDate(event.startDate) }))
    .sort((a, b) => {
      if (a.sortDate === null && b.sortDate === null) return a.index - b.index;
      if (a.sortDate === null) return 1;
      if (b.sortDate === null) return -1;
      const aPast = a.sortDate < now;
      const bPast = b.sortDate < now;
      if (aPast !== bPast) return aPast ? 1 : -1;
      return aPast ? b.sortDate - a.sortDate : a.sortDate - b.sortDate;
    })
    .map(({ event }) => event);
}

function isDateOnly(value: string | undefined): boolean {
  return value !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDate(value: string | undefined, timezone: string | undefined): string {
  if (!value) return "";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (dateOnly) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
      new Date(`${value}T00:00:00Z`),
    );
  }
  const date = new Date(`${value}${timezone === "UTC" ? "Z" : ""}`);
  if (!Number.isNaN(date.valueOf())) {
    const formatted = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
    return timezone ? `${formatted} (${timezone})` : formatted;
  }
  return timezone ? `${value} (${timezone})` : value;
}

function eventLocation(event: {
  location?: { venue?: string; onlineUrl?: string };
}): string {
  return event.location?.venue ?? event.location?.onlineUrl ?? "online";
}

function jsonToPreviewFeed(text: string): PreviewFeed {
  const json = JSON.parse(text) as {
    title?: string;
    description?: string;
    license?: string;
    events?: Array<{
      id?: string;
      name?: string;
      startDate?: string;
      endDate?: string;
      timezone?: string;
      location?: { venue?: string; onlineUrl?: string };
      url?: string;
      description?: string;
      status?: string;
      attendanceMode?: string;
      languages?: string[];
      tags?: string[];
      updatedAt?: string;
      source?: unknown;
    }>;
  };
  if (!Array.isArray(json.events)) throw new Error("feed.json has no events array");
  return {
    title: json.title,
    description: json.description,
    license: json.license,
    events: json.events.map((event) => ({
      name: event.name ?? "(untitled event)",
      startDate: event.startDate,
      endDate: event.endDate,
      timezone: event.timezone,
      location: eventLocation(event),
      link: event.url ?? event.location?.onlineUrl,
      description: event.description,
      details: detailRows([
        ["ID", event.id],
        ["Status", event.status],
        ["Timezone", event.timezone],
        ["Attendance", event.attendanceMode],
        ["Languages", event.languages],
        ["Tags", event.tags],
        ["Updated", event.updatedAt],
        ["Source", event.source],
      ]),
    })),
  };
}

function calendarTitle(text: string): Pick<PreviewFeed, "title" | "description"> {
  const calendar = parseIcs(text).find((component) => component.name === "VCALENDAR");
  const first = (name: string) =>
    calendar?.properties.find((prop) => prop.name === name)?.value;
  return {
    title: first("X-WR-CALNAME"),
    description: first("X-WR-CALDESC"),
  };
}

function icsToPreviewFeed(text: string): PreviewFeed {
  const result = icsToEvents(text);
  if (result.events.length === 0) {
    throw new Error(result.warnings[0]?.message ?? "The calendar contains no events");
  }
  return {
    ...calendarTitle(text),
    events: result.events.map((event) => ({
      name: event.name ?? "(untitled event)",
      startDate: event.startDate,
      endDate: event.endDate,
      timezone: event.timezone,
      location: event.location?.venue ?? event.location?.onlineUrl ?? "online",
      link: event.url ?? event.location?.onlineUrl,
      description: event.description,
      details: detailRows([
        ["Status", event.status],
        ["Timezone", event.timezone],
        ["Tags", event.tags],
        ["Updated", event.updatedAt],
      ]),
    })),
  };
}

function rssToPreview(text: string): PreviewFeed {
  const feed = rssToPreviewFeed(text);
  return {
    title: feed.title,
    description: feed.description,
    license: feed.license,
    events: feed.events.map((event: {
      title: string;
      link?: string;
      description?: string;
      when?: string;
      location?: string;
      guid?: string;
    }) => ({
      name: event.title,
      startDate: event.when,
      dateLabel: event.when,
      location: event.location ?? "online",
      link: event.link,
      description: event.description,
      details: detailRows([["GUID", event.guid]]),
    })),
  };
}

async function fetchText(url: string): Promise<{ ok: true; text: string } | { ok: false; status: number }> {
  const cacheBusted = new URL(url);
  cacheBusted.searchParams.set("_", String(Date.now()));
  const response = await fetch(cacheBusted);
  if (!response.ok) return { ok: false, status: response.status };
  return { ok: true, text: await response.text() };
}

async function loadFile(
  repo: string | null,
  key: FileKey,
  parser: (text: string) => PreviewFeed,
): Promise<void> {
  const state = files[key];
  let finalUrl = state.directUrl ?? "";
  let result: Awaited<ReturnType<typeof fetchText>> | null = null;
  if (state.directUrl) {
    result = await fetchText(state.directUrl).catch(() => null);
  } else if (repo) {
    const pages = pagesUrl(repo, state.filename);
    const pagesResult = await fetchText(pages).catch(() => null);
    finalUrl = pages;
    result = pagesResult;
    if (result === null || !result.ok) {
      finalUrl = rawUrl(repo, state.filename);
      result = await fetchText(finalUrl).catch(() => null);
    }
  }

  if (result === null) {
    Object.assign(state, {
      status: "error",
      url: finalUrl,
      error: "Could not fetch this file from GitHub Pages or the default branch.",
    });
  } else if (!result.ok) {
    Object.assign(state, {
      status: result.status === 404 ? "missing" : "error",
      url: finalUrl,
      error:
        result.status === 404
          ? "This file has not been generated yet. Check that the export workflow ran successfully."
          : `Fetch failed with HTTP ${result.status}.`,
    });
  } else {
    try {
      Object.assign(state, {
        status: "ready",
        url: finalUrl,
        source: result.text,
        feed: parser(result.text),
        error: undefined,
      });
    } catch (error) {
      Object.assign(state, {
        status: "error",
        url: finalUrl,
        source: result.text,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  renderPanel(key);
}

function renderSummary(parent: HTMLElement, feed: PreviewFeed): void {
  const summary = el("section", undefined, "summary panel");
  const title = el("h2", feed.title ?? "Untitled feed");
  summary.append(title);
  if (feed.description) summary.append(el("p", feed.description));
  const meta = el("dl");
  for (const [label, value] of [["License", feed.license]]) {
    if (!value) continue;
    meta.append(el("dt", label), el("dd", value));
  }
  if (meta.children.length > 0) summary.append(meta);
  parent.append(summary);
}

function renderEvents(
  parent: HTMLElement,
  events: PreviewEvent[],
  options: { collapsedByDefault: boolean },
): void {
  if (events.length === 0) {
    parent.append(el("p", "No events found in this export.", "panel muted"));
    return;
  }
  const ordered = sortedEvents(events);
  const list = el("ul", undefined, "event-list");
  for (const [index, event] of ordered.entries()) {
    const item = el("li");
    const details = el("details", undefined, "event");
    details.open = !options.collapsedByDefault && index === 0;
    const summary = el("summary");
    summary.append(el("h3", event.name));
    details.append(summary);
    const facts = el("dl");
    for (const [label, value] of [
      ["When", eventWhen(event)],
      ["Where", event.location ?? "online"],
    ]) {
      if (!value) continue;
      facts.append(el("dt", label), el("dd", value));
    }
    if (event.link) {
      const link = el("a", event.link);
      link.href = event.link;
      link.target = "_blank";
      link.rel = "noopener";
      const linkValue = el("dd");
      linkValue.append(link);
      facts.append(el("dt", "Link"), linkValue);
    }
    for (const detail of event.details ?? []) {
      facts.append(el("dt", detail.label), el("dd", detail.value));
    }
    details.append(facts);
    const description = options.collapsedByDefault
      ? event.description
      : truncate(event.description);
    if (description) details.append(el("p", description, "description"));
    item.append(details);
    list.append(item);
  }
  parent.append(list);
}

function eventWhen(event: PreviewEvent): string {
  return (
    event.dateLabel ??
    (event.endDate
      ? `${formatDate(event.startDate, event.timezone)} to ${formatDate(event.endDate, event.timezone)}`
      : formatDate(event.startDate, event.timezone))
  );
}

function calendarDate(value: string | undefined, timezone: string | undefined): string | undefined {
  if (!value) return undefined;
  return timezone === "UTC" && !isDateOnly(value) ? `${value}Z` : value;
}

function toCalendarEvent(event: PreviewEvent): EventInput | null {
  const start = calendarDate(event.startDate, event.timezone);
  if (!start) return null;
  const allDay = isDateOnly(event.startDate);
  const end =
    allDay && event.endDate
      ? addDays(event.endDate, 1)
      : calendarDate(event.endDate, event.timezone);
  return {
    title: event.name,
    start,
    ...(end && { end }),
    allDay,
    extendedProps: {
      previewEvent: event,
    },
  };
}

function initialCalendarDate(events: PreviewEvent[]): string | undefined {
  return sortedEvents(events).find((event) => parseSortDate(event.startDate) !== null)
    ?.startDate;
}

function showCalendarEventModal(event: PreviewEvent): void {
  const dialog = el("dialog", undefined, "event-dialog");
  const title = el("h2", event.name);
  const facts = el("dl");
  for (const [label, value] of [
    ["When", eventWhen(event)],
    ["Where", event.location ?? "online"],
  ]) {
    if (!value) continue;
    facts.append(el("dt", label), el("dd", value));
  }
  if (event.link) {
    const link = el("a", event.link);
    link.href = event.link;
    link.target = "_blank";
    link.rel = "noopener";
    const value = el("dd");
    value.append(link);
    facts.append(el("dt", "Link"), value);
  }
  for (const detail of event.details ?? []) {
    facts.append(el("dt", detail.label), el("dd", detail.value));
  }
  dialog.append(title, facts);
  if (event.description) {
    dialog.append(el("p", event.description, "description"));
  }

  const actions = el("div", undefined, "actions");
  const close = el("button", "Close", "secondary");
  close.type = "button";
  close.addEventListener("click", () => dialog.close());
  actions.append(close);
  if (event.link) {
    const open = el("a", "Open event page");
    open.href = event.link;
    open.target = "_blank";
    open.rel = "noopener";
    actions.append(open);
  }
  dialog.append(actions);
  dialog.addEventListener("close", () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
}

function renderIcsCalendar(parent: HTMLElement, events: PreviewEvent[]): void {
  const calendarEvents = events.flatMap((event) => {
    const converted = toCalendarEvent(event);
    return converted ? [converted] : [];
  });
  if (calendarEvents.length === 0) return;

  const wrapper = el("section", undefined, "calendar-panel panel");
  const calendarHost = el("div", undefined, "calendar-host");
  wrapper.append(calendarHost);
  parent.append(wrapper);

  const calendar = new Calendar(calendarHost, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: window.matchMedia("(max-width: 44rem)").matches
      ? "listMonth"
      : "dayGridMonth",
    ...(initialCalendarDate(events) && {
      initialDate: initialCalendarDate(events),
    }),
    events: calendarEvents,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    height: "auto",
    nowIndicator: true,
    eventDisplay: "block",
    dayMaxEvents: false,
    eventContent(info) {
      const title = el("span", info.event.title, "calendar-event-title");
      return { domNodes: [title] };
    },
    eventClick(info) {
      info.jsEvent.preventDefault();
      const event = info.event.extendedProps["previewEvent"];
      if (event) showCalendarEventModal(event as PreviewEvent);
    },
    eventDidMount(info) {
      const event = info.event.extendedProps["previewEvent"] as
        | PreviewEvent
        | undefined;
      if (event?.location) {
        info.el.title = `${event.name}\n${event.location}`;
      }
    },
  });
  calendar.render();
  calendars.push(calendar);
}

function renderSource(parent: HTMLElement, state: FileState): void {
  const actions = el("div", undefined, "actions");
  const button = el("button", "View source", "secondary");
  button.type = "button";
  const link = el("a", "Open raw file");
  link.href = state.url ?? "#";
  link.target = "_blank";
  link.rel = "noopener";
  const source = el("div", undefined, "source-block");
  source.hidden = true;
  source.append(el("pre", state.source ?? ""));
  button.addEventListener("click", () => {
    source.hidden = !source.hidden;
    button.textContent = source.hidden ? "View source" : "Hide source";
  });
  actions.append(button, link);
  parent.append(actions, source);
}

function renderPanel(key: FileKey): void {
  const panel = panels[key];
  const state = files[key];
  if (key === "ics") clearCalendars();
  panel.replaceChildren();
  if (state.status === "loading") {
    panel.append(el("p", `Loading ${state.filename}…`, "panel muted"));
    return;
  }
  if (state.status === "missing") {
    const message = el("section", undefined, "panel");
    message.append(el("h2", state.label), el("p", state.error));
    if (state.url) renderSourceLink(message, state.url);
    panel.append(message);
    return;
  }
  if (state.status === "error") {
    const message = el("section", undefined, "panel error");
    message.append(el("h2", state.label), el("p", state.error));
    if (state.url) renderSourceLink(message, state.url);
    if (state.source) renderSource(message, state);
    panel.append(message);
    return;
  }
  if (!state.feed) return;
  renderSummary(panel, state.feed);
  if (key === "ics") {
    renderIcsCalendar(panel, state.feed.events);
  } else {
    renderEvents(panel, state.feed.events, { collapsedByDefault: key === "rss" });
  }
  renderSource(panel, state);
}

function renderSourceLink(parent: HTMLElement, url: string): void {
  const actions = el("div", undefined, "actions");
  const link = el("a", "Open raw file");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  actions.append(link);
  parent.append(actions);
}

function selectTab(name: FileKey): void {
  for (const tab of tabs) {
    tab.setAttribute("aria-selected", String(tab.dataset.tab === name));
  }
  for (const [key, panel] of Object.entries(panels) as Array<[FileKey, HTMLElement]>) {
    panel.hidden = key !== name;
  }
  for (const calendar of calendars) calendar.updateSize();
}

for (const tab of tabs) {
  tab.addEventListener("click", () => {
    const key = tab.dataset.tab as FileKey | undefined;
    selectTab(key ?? "json");
  });
}

const repo = parseRepoParam(location.search);
const directFeed = parseFeedParam(location.search);
if (directFeed) {
  for (const key of Object.keys(files) as FileKey[]) {
    files[key].directUrl = siblingFeedUrl(directFeed.url, files[key].filename);
  }
  repoBanner.textContent = directFeed.url.toString();
  preview.hidden = false;
  selectTab(directFeed.tab);
  renderPanel("json");
  renderPanel("ics");
  renderPanel("rss");
  void loadFile(null, "json", jsonToPreviewFeed);
  void loadFile(null, "ics", icsToPreviewFeed);
  void loadFile(null, "rss", rssToPreview);
} else if (!repo) {
  repoBanner.textContent = "No feed selected";
  repoMessage.hidden = false;
  repoMessage.append(
    el("h2", "Repository or feed URL required"),
    el(
      "p",
      "Expected URL format: /preview?repo=owner/name or /preview?feed=https%3A%2F%2Fexample.org%2Ffeed.json.",
    ),
  );
} else {
  repoBanner.textContent = repo;
  preview.hidden = false;
  renderPanel("json");
  renderPanel("ics");
  renderPanel("rss");
  void loadFile(repo, "json", jsonToPreviewFeed);
  void loadFile(repo, "ics", icsToPreviewFeed);
  void loadFile(repo, "rss", rssToPreview);
}
