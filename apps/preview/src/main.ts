import { Calendar, type EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { forkFileUrls } from "@opentechevents/feed-urls";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  addDays,
  eventWhen,
  icsToPreviewFeed,
  isDateOnly,
  jsonToPreviewFeed,
  parseSortDate,
  rssToPreview,
  sortedEvents,
  truncate,
  type PreviewEvent,
  type PreviewFeed,
} from "@opentechevents/preview-feed";

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

/**
 * Every place this file might be, in order. More than the obvious Pages URL
 * because a fork on a custom domain answers that one with a CORS-less
 * redirect — see `@opentechevents/feed-urls`.
 */
function fileUrls(repo: string, filename: string): string[] {
  return forkFileUrls(repo, filename, {
    referrer: document.referrer,
    origin: window.location.origin,
  });
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
    for (const url of fileUrls(repo, state.filename)) {
      finalUrl = url;
      result = await fetchText(url).catch(() => null);
      if (result?.ok) break;
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
