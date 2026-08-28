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

import {
  CANONICAL_FILENAME,
  formatFromBody,
  formatFromMediaType,
  formatFromPath,
  parseSource,
  siblingUrl,
  sourceQuery,
  type FileKey,
} from "./lib/source.js";

interface FileState {
  label: string;
  filename: string;
  /** `unavailable` = this format was never published here, as far as we know. */
  status: "loading" | "ready" | "missing" | "error" | "unavailable";
  directUrl?: string;
  url?: string;
  source?: string;
  feed?: PreviewFeed;
  error?: string;
}

const files: Record<FileKey, FileState> = {
  json: { label: "Feed (JSON)", filename: CANONICAL_FILENAME.json, status: "loading" },
  ics: { label: "Calendar (ICS)", filename: CANONICAL_FILENAME.ics, status: "loading" },
  rss: { label: "RSS (XML)", filename: CANONICAL_FILENAME.rss, status: "loading" },
};

const PARSERS: Record<FileKey, (text: string) => PreviewFeed> = {
  json: jsonToPreviewFeed,
  ics: icsToPreviewFeed,
  rss: rssToPreview,
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

async function fetchText(
  url: string,
): Promise<{ ok: true; text: string; contentType: string | null } | { ok: false; status: number }> {
  const cacheBusted = new URL(url);
  cacheBusted.searchParams.set("_", String(Date.now()));
  const response = await fetch(cacheBusted);
  if (!response.ok) return { ok: false, status: response.status };
  return {
    ok: true,
    text: await response.text(),
    contentType: response.headers.get("content-type"),
  };
}

/**
 * What a 404 means depends on how we got here. In a fork, a missing export is
 * a workflow that has not run — the organizer's own problem to go fix. At a
 * feed URL somebody else published, the same 404 usually means only that they
 * do not publish that format under the name the template uses, which is not a
 * fault at all and must not be reported as one.
 */
let missingMeans: "workflow" | "not-published" = "workflow";

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
      error:
        missingMeans === "workflow"
          ? "Could not fetch this file from GitHub Pages or the default branch."
          : "Could not fetch this file. The server may not allow requests from other origins (CORS).",
    });
  } else if (!result.ok) {
    Object.assign(state, {
      status: result.status === 404 ? "missing" : "error",
      url: finalUrl,
      error:
        result.status === 404
          ? missingMeans === "workflow"
            ? "This file has not been generated yet. Check that the export workflow ran successfully."
            : `No ${state.filename} is published next to this feed. That is not an error — the spec does not require this format, or it may be published under another name.`
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

/**
 * Loads one URL whose format nobody declared, and works out what it is.
 *
 * In order: what `?format=` said, then the extension, then the media type the
 * server sent, then the document's own first bytes. The last one is what makes
 * a feed served as `text/plain` from a path with no extension work at all, and
 * it is also the only one that cannot be wrong — so when detection and parsing
 * disagree, the parse error is reported against the format we chose, with the
 * source visible, rather than as "invalid feed".
 */
async function loadDetected(url: URL, requested: FileKey | undefined): Promise<FileKey> {
  const result = await fetchText(url.toString()).catch(() => null);
  const fallback = requested ?? formatFromPath(url.pathname) ?? "json";

  if (result === null || !result.ok) {
    const state = files[fallback];
    Object.assign(state, {
      status: "error",
      url: url.toString(),
      error:
        result === null
          ? "Could not fetch this URL. The server may not allow requests from other origins (CORS)."
          : `Fetch failed with HTTP ${result.status}.`,
    });
    renderPanel(fallback);
    return fallback;
  }

  const key =
    requested ??
    formatFromPath(url.pathname) ??
    formatFromMediaType(result.contentType) ??
    formatFromBody(result.text) ??
    "json";

  const state = files[key];
  try {
    Object.assign(state, {
      status: "ready",
      url: url.toString(),
      source: result.text,
      feed: PARSERS[key](result.text),
      error: undefined,
    });
  } catch (error) {
    Object.assign(state, {
      status: "error",
      url: url.toString(),
      source: result.text,
      error: `Read as ${state.label}: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
  renderPanel(key);
  return key;
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
    // The animated ellipsis is not decoration: eventos.wiki's feed is 539 kB
    // and 475 events, and a static "Loading" for that long reads as a page
    // that has finished and found nothing.
    const message = el("p", undefined, "panel muted loading");
    message.append(
      `Loading ${state.url ?? state.filename}`,
      el("span", "…", "loading-dots"),
    );
    panel.append(message);
    return;
  }
  if (state.status === "unavailable") {
    const message = el("section", undefined, "panel");
    message.append(el("h2", state.label), el("p", state.error, "muted"));
    panel.append(message);
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

/* ------------------------------------------------------------------ *
 * The form: what this page shows when it was given nothing to preview
 * ------------------------------------------------------------------ */

const sourcePanel = document.querySelector<HTMLElement>("#source-form-panel")!;
const sourceForm = document.querySelector<HTMLFormElement>("#source-form")!;
const sourceProblem = document.querySelector<HTMLElement>("#source-problem")!;
const feedFields = document.querySelector<HTMLElement>("#feed-fields")!;
const repoFields = document.querySelector<HTMLElement>("#repo-fields")!;
const feedInput = document.querySelector<HTMLInputElement>("#feed-url")!;
const formatSelect = document.querySelector<HTMLSelectElement>("#feed-format")!;
const repoInput = document.querySelector<HTMLInputElement>("#repo-name")!;
const changeSource = document.querySelector<HTMLElement>("#change-source")!;

function selectedKind(): "feed" | "repo" {
  const checked = sourceForm.querySelector<HTMLInputElement>('input[name="kind"]:checked');
  return checked?.value === "repo" ? "repo" : "feed";
}

function syncFormKind(): void {
  const kind = selectedKind();
  feedFields.hidden = kind !== "feed";
  repoFields.hidden = kind !== "repo";
}

for (const radio of sourceForm.querySelectorAll<HTMLInputElement>('input[name="kind"]')) {
  radio.addEventListener("change", syncFormKind);
}

/**
 * Submitting navigates rather than loading in place: the query string *is* the
 * state of this page, so every preview stays a link somebody can paste into an
 * issue — the same reason the validator builds a permalink.
 */
sourceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query =
    selectedKind() === "repo"
      ? sourceQuery({ repo: repoInput.value.trim() })
      : sourceQuery({
          feed: feedInput.value.trim(),
          format: formatSelect.value as FileKey | "",
        });
  window.location.search = query;
});

document.querySelector<HTMLButtonElement>("#change-source-button")!.addEventListener("click", () => {
  sourcePanel.hidden = false;
  sourcePanel.scrollIntoView({ behavior: "smooth", block: "start" });
  feedInput.focus();
});

function showForm(problem?: string): void {
  sourcePanel.hidden = false;
  if (problem) {
    sourceProblem.textContent = problem;
    sourceProblem.hidden = false;
  }
  syncFormKind();
}

/* ------------------------------------------------------------------ *
 * Boot
 * ------------------------------------------------------------------ */

const source = parseSource(location.search);

if (source.kind === "none") {
  repoBanner.textContent = "No feed selected";
  repoMessage.hidden = true;
  showForm(source.problem);
} else if (source.kind === "feed") {
  repoBanner.textContent = source.url.toString();
  preview.hidden = false;
  changeSource.hidden = false;
  missingMeans = "not-published";
  feedInput.value = source.url.toString();
  formatSelect.value = source.format ?? "";
  syncFormKind();

  if (source.siblings) {
    // A file named the way the template names it: the other two exports are
    // published next to it, so all three tabs are worth loading.
    for (const key of Object.keys(files) as FileKey[]) {
      files[key].directUrl = siblingUrl(source.url, files[key].filename);
    }
    const tab = source.format ?? formatFromPath(source.url.pathname) ?? "json";
    selectTab(tab);
    renderPanel("json");
    renderPanel("ics");
    renderPanel("rss");
    void loadFile(null, "json", jsonToPreviewFeed);
    void loadFile(null, "ics", icsToPreviewFeed);
    void loadFile(null, "rss", rssToPreview);
  } else {
    // Any other address — `events.json`, `calendar/2026.ics`. Only this one
    // document exists as far as we know: guessing two sibling names would fill
    // two tabs with 404s that look like the publisher's fault.
    //
    // The tab this URL is *probably* going to fill says "loading" from the
    // first frame, before anything has been fetched. Painting all three as
    // unavailable and correcting one later means the destination tab spends
    // the whole download telling the visitor there is nothing here — which,
    // on a 539 kB feed, is most of the time they spend looking at it.
    const guess = source.format ?? formatFromPath(source.url.pathname) ?? "json";
    for (const key of Object.keys(files) as FileKey[]) {
      if (key === guess) {
        Object.assign(files[key], { status: "loading", url: source.url.toString() });
      } else {
        Object.assign(files[key], {
          status: "unavailable",
          error: `This URL points at a single document. ${files[key].label} would have to be published separately — preview it by its own URL.`,
        });
      }
      renderPanel(key);
    }
    selectTab(guess);
    void loadDetected(source.url, source.format).then((key) => {
      // Detection can land elsewhere: a `.json` extension over an ICS body, or
      // no extension at all. Hand the guessed tab back its placeholder.
      if (key !== guess) {
        Object.assign(files[guess], {
          status: "unavailable",
          url: undefined,
          error: `This URL points at a single document. ${files[guess].label} would have to be published separately — preview it by its own URL.`,
        });
        renderPanel(guess);
        selectTab(key);
      }
    });
  }
} else {
  repoBanner.textContent = source.repo;
  preview.hidden = false;
  changeSource.hidden = false;
  repoInput.value = source.repo;
  sourceForm.querySelector<HTMLInputElement>('input[name="kind"][value="repo"]')!.checked = true;
  syncFormKind();
  renderPanel("json");
  renderPanel("ics");
  renderPanel("rss");
  void loadFile(source.repo, "json", jsonToPreviewFeed);
  void loadFile(source.repo, "ics", icsToPreviewFeed);
  void loadFile(source.repo, "rss", rssToPreview);
}
