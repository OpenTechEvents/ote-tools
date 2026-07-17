/**
 * Entry point: URL context, fetching and DOM wiring. All decisions
 * (fields, JSON shape, validation, links) live in lib/ and are unit-tested;
 * this file only connects them to the page.
 */

import { icsToEvents } from "@opentechevents/import-ics";
import { htmlToEvents } from "@opentechevents/import-jsonld";

import { findCollisions } from "./lib/collisions.js";
import {
  compareByStartDateDesc,
  decodeImportQueue,
  encodeImportQueue,
  feedHasEventId,
  formHasContent,
  importedEventLabel,
  importedToFormState,
  importQueueKey,
  isFutureEvent,
  missingFormFields,
  newQueueItem,
  sourceNameFor,
  type ImportedEvent,
  type ImportedWarning,
  type ImportQueueItem,
} from "./lib/import.js";
import { tokenizeJson } from "./lib/highlight.js";
import {
  emptyFormState,
  fromEventJson,
  suggestId,
  suggestSlug,
  toEventJson,
} from "./lib/event-json.js";
import {
  directCreateUrl,
  directEditUrl,
  eventJsonText,
  proposeChangeUrl,
  type LinkResult,
} from "./lib/links.js";
import {
  availablePresets,
  resolveProfile,
  type ResolvedProfile,
} from "./lib/presets.js";
import {
  editorContextFromSearch,
  parseContentsListing,
  parseFeedListing,
  parseRepoParam,
  repoFetchPlan,
} from "./lib/repo.js";
import type { FormState, ListedEvent, OteConfig, OteEvent } from "./lib/types.js";
import { validateDraft } from "./lib/validation.js";
import {
  markImportGaps,
  renderForm,
  setAllDay,
  updateErrors,
} from "./ui/form.js";
import { geocodeVenue, mountGeoMap, type GeoMapHandle } from "./ui/map.js";

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`missing #${id}`);
  return node as T;
}

const warningsBox = el<HTMLDivElement>("warnings");

function addWarning(text: string): void {
  const p = document.createElement("p");
  p.textContent = `⚠ ${text}`;
  warningsBox.append(p);
  warningsBox.hidden = false;
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

/** Form state key → the field id its errors and "touched" state hang from. */
function fieldIdForKey(key: keyof FormState): string {
  switch (key) {
    case "startTime":
      return "startDate";
    case "endTime":
      return "endDate";
    case "geoLat":
    case "geoLon":
      return "geo";
    case "sourceName":
    case "sourceUrl":
    case "sourceLicense":
    case "sourceRetrievedAt":
      return "source";
    default:
      return key;
  }
}

/** JSON keys of a loaded event → form field ids, for the "never drop data" rule. */
function extraFieldsFor(event: OteEvent, profile: ResolvedProfile): Set<string> {
  const used = new Set<string>();
  const add = (field: string, present: unknown) => {
    if (present !== undefined && !profile.fields.has(field)) used.add(field);
  };
  add("status", event.status);
  add("license", event.license);
  add("source", event.source);
  add("updatedAt", event.updatedAt);
  add("geo", event.location?.geo);
  add("venue", event.location?.venue);
  add("onlineUrl", event.location?.onlineUrl);
  add("url", event.url);
  add("description", event.description);
  add("tags", event.tags);
  add("languages", event.languages);
  add("attendanceMode", event.attendanceMode);
  return used;
}

async function startEditor(repo: string | null): Promise<void> {
  const hasRepo = repo !== null;
  const repoKey = repo ?? "__standalone__";
  const fetchPlan = repoFetchPlan(
    repo === null ? { mode: "generator" } : { mode: "repo", repo },
  );
  el("editor").hidden = false;
  el("repo-banner").textContent = hasRepo
    ? `Target repository: ${repo}`
    : "Standalone JSON generator";

  // --- context: config, profile, default branch -------------------------
  const config = fetchPlan !== null
    ? ((await fetchJson(fetchPlan.configUrl)) as OteConfig | null)
    : null;
  if (hasRepo && config === null) {
    addWarning(
      "ote.config.json could not be fetched from the repository; showing all fields.",
    );
  } else if (hasRepo && config?.feed?.title) {
    el("repo-banner").textContent += ` — ${config.feed.title}`;
  }
  let profile = resolveProfile(config);
  for (const warning of profile.warnings) addWarning(warning);

  // Profile switcher: the config's profile is the default, not a cage.
  const profileSelect = el<HTMLSelectElement>("profile-select");
  for (const preset of availablePresets(config)) {
    const option = document.createElement("option");
    option.value = preset;
    option.textContent = preset;
    option.selected = preset === profile.preset;
    profileSelect.append(option);
  }

  let branch: string | undefined;
  if (fetchPlan !== null) {
    void fetchJson(fetchPlan.repoApiUrl).then((meta) => {
      const value = (meta as { default_branch?: unknown } | null)?.default_branch;
      if (typeof value === "string") branch = value;
    });
  }

  // --- form state --------------------------------------------------------
  let state: FormState = emptyFormState(
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
  );
  let isNew = true;
  let editSlug: string | null = null;
  // Once the user touches slug/id, stop auto-suggesting over their input.
  let slugDirty = false;
  let idDirty = false;
  // Errors only show on fields the user has interacted with, until the
  // submit button is pressed with an invalid draft — then everything shows.
  let touched = new Set<string>();
  let submitAttempted = false;

  // Declared before refresh() uses it; filled asynchronously by loadEvents.
  let listed: ListedEvent[] = [];

  // Fields the last ICS import did not carry; null = no import in progress.
  let importMissing: Set<string> | null = null;

  const form = el<HTMLFormElement>("event-form");
  const badge = el<HTMLSpanElement>("valid-badge");
  const documentErrors = el<HTMLUListElement>("document-errors");
  const propose = el<HTMLButtonElement>("propose");
  const editDirect = el<HTMLButtonElement>("edit-direct");
  const repoOutputActions = el<HTMLSpanElement>("repo-output-actions");
  const generatorOutputActions = el<HTMLSpanElement>("generator-output-actions");
  repoOutputActions.hidden = !hasRepo;
  generatorOutputActions.hidden = hasRepo;

  // Generator mode: let the organizer connect a fork so they can edit/add
  // straight in their repository. Connecting just reloads with ?repo=owner/name,
  // which re-enters repo mode (enabling "Edit directly" / "Review & submit").
  const repoConnect = el<HTMLDivElement>("repo-connect");
  repoConnect.hidden = hasRepo;
  if (!hasRepo) {
    const connectInput = el<HTMLInputElement>("repo-connect-input");
    const connectError = el<HTMLParagraphElement>("repo-connect-error");
    el<HTMLFormElement>("repo-connect-form").addEventListener("submit", (e) => {
      e.preventDefault();
      // Accept a pasted github.com URL as well as bare owner/repo.
      const typed = connectInput.value
        .trim()
        .replace(/^https?:\/\/github\.com\//i, "")
        .replace(/\.git$/i, "")
        .replace(/\/+$/, "");
      const repo = parseRepoParam(`?repo=${encodeURIComponent(typed)}`);
      if (repo === null) {
        connectError.textContent =
          "Enter your repository as owner/repo — for example my-org/ote-events.";
        connectError.hidden = false;
        return;
      }
      location.search = `?repo=${repo}`;
    });
  }

  function setControlValue(key: string, value: string): void {
    const input = form.querySelector<HTMLInputElement>(`[data-key="${key}"]`);
    if (input) input.value = value;
  }

  /** Result of the last refresh, consulted by the button handlers. */
  let draftValid = false;

  function refresh(): boolean {
    if (isNew) {
      if (!slugDirty) {
        state.slug = suggestSlug(state.name, state.startDate);
        setControlValue("slug", state.slug);
      }
      if (!idDirty) {
        state.id = suggestId(config, repo, state.slug);
        setControlValue("id", state.id);
      }
    }
    const event = toEventJson(state);
    const result = validateDraft(config, event, new Date().toISOString());

    // Collisions against the repo's existing events (best-effort: the
    // listing may still be loading or rate-limited). Always shown — they
    // appear on auto-suggested values the user never typed.
    const collisions = findCollisions(
      listed,
      state.slug,
      state.id,
      isNew ? null : editSlug,
    );
    const shown = new Map<string, string[]>();
    for (const [field, errors] of result.fieldErrors) {
      if (submitAttempted || touched.has(field)) shown.set(field, errors);
    }
    if (collisions.slugTaken) {
      shown.set("slug", [
        ...(shown.get("slug") ?? []),
        `events/${state.slug}.json already exists in the repository`,
      ]);
    }
    if (collisions.idTaken) {
      shown.set("id", [
        ...(shown.get("id") ?? []),
        "already used by another event in this repository",
      ]);
    }
    draftValid =
      result.valid && !collisions.slugTaken && !collisions.idTaken;

    updateErrors(form, shown);
    documentErrors.textContent = "";
    documentErrors.hidden =
      !submitAttempted || result.documentErrors.length === 0;
    for (const message of result.documentErrors) {
      const li = document.createElement("li");
      li.textContent = message;
      documentErrors.append(li);
    }
    badge.textContent = draftValid ? "✓ Ready" : "Incomplete";
    badge.className = draftValid ? "ok" : "invalid";
    editDirect.disabled = !hasRepo || (!isNew && editSlug === null);
    editDirect.title =
      !isNew && editSlug === null
        ? "This event's filename could not be determined from the feed."
        : "";
    return draftValid;
  }

  let mapHandle: GeoMapHandle | null = null;

  function onInput(key: keyof FormState, value: string | boolean): void {
    touched.add(fieldIdForKey(key));
    // Editing a field the import marked as missing resolves its mark.
    if (importMissing?.delete(fieldIdForKey(key))) {
      markImportGaps(form, importMissing);
    }
    if (key === "allDay") {
      state.allDay = value === true;
      setAllDay(form, state.allDay);
    } else {
      (state as unknown as Record<string, string>)[key] = String(value);
      if (key === "slug") slugDirty = true;
      if (key === "id") idDirty = true;
      if (key === "geoLat" || key === "geoLon") {
        const lat = Number(state.geoLat);
        const lon = Number(state.geoLon);
        if (mapHandle && Number.isFinite(lat) && Number.isFinite(lon)) {
          mapHandle.setPosition(lat, lon);
        }
      }
    }
    refresh();
    saveCurrentItem(); // no-op unless an import banner is on screen
  }

  function mountMap(): void {
    mapHandle?.destroy();
    mapHandle = null;
    const slot = form.querySelector<HTMLElement>('[data-role="geo-map"]');
    if (!slot) return;
    const lat = Number(state.geoLat);
    const lon = Number(state.geoLon);
    const initial =
      state.geoLat !== "" && Number.isFinite(lat) && Number.isFinite(lon)
        ? { lat, lon }
        : null;
    mapHandle = mountGeoMap(
      slot,
      initial,
      (newLat, newLon) => {
        state.geoLat = String(newLat);
        state.geoLon = String(newLon);
        setControlValue("geoLat", state.geoLat);
        setControlValue("geoLon", state.geoLon);
        touched.add("geo");
        refresh();
        saveCurrentItem();
      },
      state.venue, // seeds the map search: the address is typed once
    );
  }

  function render(extra: ReadonlySet<string> = new Set()): void {
    renderForm(form, profile, state, extra, onInput);
    setAllDay(form, state.allDay);
    markImportGaps(form, importMissing ?? new Set());
    mountMap();
    refresh();
  }

  render();

  profileSelect.addEventListener("input", () => {
    profile = resolveProfile(config, profileSelect.value);
    // Filled fields stay visible even when the new profile hides them.
    render(extraFieldsFor(toEventJson(state), profile));
  });

  // --- event listing: contents API first, Pages feed.json fallback -------
  // Rendered as a filter-as-you-type combobox over the loaded events.
  const combo = el<HTMLDivElement>("event-combo");
  const comboInput = el<HTMLInputElement>("event-combo-input");
  const comboList = el<HTMLUListElement>("event-combo-list");
  const editModeLabel = document
    .querySelector<HTMLInputElement>('input[name="mode"][value="edit"]')
    ?.closest("label");
  if (editModeLabel instanceof HTMLElement) editModeLabel.hidden = !hasRepo;

  function eventLabel(event: OteEvent): string {
    const day = (event.startDate ?? "????").split("T")[0];
    return `${day} — ${event.name ?? event.id}`;
  }

  function renderComboList(query: string): void {
    comboList.textContent = "";
    const q = query.trim().toLowerCase();
    const hits = listed
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry }) => eventLabel(entry.event).toLowerCase().includes(q))
      .slice(0, 8);
    comboList.hidden = hits.length === 0;
    for (const { entry, index } of hits) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = eventLabel(entry.event);
      // mousedown, not click: it must win over the input's blur
      button.addEventListener("mousedown", (e) => {
        e.preventDefault();
        comboInput.value = eventLabel(entry.event);
        comboList.hidden = true;
        pickEvent(index);
      });
      li.append(button);
      comboList.append(li);
    }
  }

  comboInput.addEventListener("focus", () => renderComboList(""));
  comboInput.addEventListener("input", () =>
    renderComboList(comboInput.value),
  );
  comboInput.addEventListener("blur", () => {
    setTimeout(() => (comboList.hidden = true), 150);
  });

  async function loadEvents(): Promise<void> {
    if (fetchPlan === null) return;
    const listing = parseContentsListing(await fetchJson(fetchPlan.contentsUrl));
    if (listing.length > 0) {
      const events = await Promise.all(
        listing.map(async ({ slug, rawUrl }) => ({
          slug,
          event: (await fetchJson(rawUrl)) as OteEvent | null,
        })),
      );
      listed = events.filter(
        (e): e is { slug: string; event: OteEvent } => e.event !== null,
      );
    } else {
      // Rate-limited, private or empty: try the published feed.
      listed = parseFeedListing(await fetchJson(fetchPlan.pagesFeedUrl));
      if (listed.length > 0) {
        addWarning(
          "Event list loaded from the published feed (GitHub API unavailable); filenames are inferred from event ids.",
        );
      }
    }
    comboInput.placeholder =
      listed.length > 0
        ? "Type to filter, or pick an event…"
        : "No events found in this repository";
    comboInput.disabled = listed.length === 0;
    refresh(); // collision checks were waiting for the listing
  }

  if (hasRepo) void loadEvents();

  // --- mode switch --------------------------------------------------------
  const newActions = el<HTMLDivElement>("new-actions");

  for (const radio of document.querySelectorAll<HTMLInputElement>(
    'input[name="mode"]',
  )) {
    radio.addEventListener("input", () => {
      isNew = radio.value === "new";
      combo.hidden = isNew;
      newActions.hidden = !isNew;
      touched = new Set();
      submitAttempted = false;
      if (isNew) {
        // A pending import queue survives the round-trip to edit mode.
        if (queue.length > 0) {
          loadImported();
          return;
        }
        state = emptyFormState(state.timezone);
        editSlug = null;
        slugDirty = false;
        idDirty = false;
        render();
      } else {
        pauseImportBanner();
        refresh(); // disables "edit directly" until an event is chosen
      }
    });
  }

  function pickEvent(index: number): void {
    const chosen = listed[index];
    if (!chosen) return;
    editSlug = chosen.slug;
    state = fromEventJson(chosen.event, chosen.slug ?? "");
    slugDirty = true;
    idDirty = true;
    touched = new Set();
    submitAttempted = false;
    render(extraFieldsFor(chosen.event, profile));
  }

  // --- ICS import -----------------------------------------------------------
  // Dialog: upload/fetch → icsToEvents → pick events (futures preselected)
  // → a queue that prefills the form one event at a time, marking the
  // fields the ICS did not carry (lib/import.ts + markImportGaps). The
  // queue persists in localStorage: navigating between imported events,
  // switching modes or reloading the page never loses edits.
  const importDialog = el<HTMLDialogElement>("import-dialog");
  const importFileInput = el<HTMLInputElement>("import-file");
  const importUrlInput = el<HTMLInputElement>("import-url");
  const importStatus = el<HTMLParagraphElement>("import-status");
  const importWarningsBox = el<HTMLDivElement>("import-warnings");
  const importListBox = el<HTMLUListElement>("import-list");
  const importConfirm = el<HTMLButtonElement>("import-confirm");
  const importBanner = el<HTMLDivElement>("import-banner");
  const importBannerText = el<HTMLParagraphElement>("import-banner-text");
  const importBannerWarnings = el<HTMLUListElement>("import-banner-warnings");
  const importSubmitted = el<HTMLDivElement>("import-submitted");
  const importCheckFeed = el<HTMLButtonElement>("import-check-feed");
  const importCheckResult = el<HTMLSpanElement>("import-check-result");
  const importPrev = el<HTMLButtonElement>("import-prev");
  const importNext = el<HTMLButtonElement>("import-next");

  let detected: ImportQueueItem[] = [];
  let detectedSourceUrl: string | null = null;
  let detectedRetrievedAt = "";
  let queue: ImportQueueItem[] = [];
  let queuePos = 0;
  let queueSourceUrl: string | null = null;
  let queueRetrievedAt = "";
  let queueKind: string | null = null;

  function persistQueue(): void {
    // Private browsing / quota: the session simply continues unpersisted.
    try {
      if (queue.length === 0) {
        localStorage.removeItem(importQueueKey(repoKey));
      } else {
        localStorage.setItem(
          importQueueKey(repoKey),
          encodeImportQueue({
            pos: queuePos,
            sourceUrl: queueSourceUrl,
            retrievedAt: queueRetrievedAt,
            kind: queueKind,
            items: queue,
          }),
        );
      }
    } catch {
      /* ignore */
    }
  }

  /** Writes the form's current edits back into the queue item on screen. */
  function saveCurrentItem(): void {
    const item = queue[queuePos];
    if (!item || importBanner.hidden) return;
    item.state = state;
    item.missing = [...(importMissing ?? [])];
    item.slugDirty = slugDirty;
    item.idDirty = idDirty;
    persistQueue();
  }

  /** The pieces of a source dialog the shared detected-list logic drives. */
  interface DetectedUi {
    list: HTMLUListElement;
    warningsBox: HTMLDivElement;
    status: HTMLParagraphElement;
    confirm: HTMLButtonElement;
    emptyMessage: string;
  }

  function setStatus(ui: DetectedUi, text: string): void {
    ui.status.textContent = text;
    ui.status.hidden = text === "";
  }

  function updateConfirm(ui: DetectedUi): void {
    ui.confirm.disabled = ui.list.querySelectorAll("input:checked").length === 0;
  }

  /**
   * Renders an importer's result into a dialog's detected-events list —
   * shared by every import source (ICS, event page). Newest first; future
   * events preselected.
   */
  function showDetected(
    ui: DetectedUi,
    result: { events: ImportedEvent[]; warnings: ImportedWarning[] },
    sourceUrl: string | null,
  ): void {
    const { events, warnings } = result;
    // Warnings are tied to their event by index BEFORE sorting.
    detected = events
      .map((event, index) =>
        newQueueItem(
          event,
          warnings.filter((w) => w.eventIndex === index),
        ),
      )
      .sort((a, b) => compareByStartDateDesc(a.event, b.event));
    detectedSourceUrl = sourceUrl;
    detectedRetrievedAt = new Date().toISOString();

    ui.warningsBox.textContent = "";
    const fileWarnings = warnings.filter((w) => w.eventIndex === undefined);
    ui.warningsBox.hidden = fileWarnings.length === 0;
    for (const warning of fileWarnings) {
      const p = document.createElement("p");
      p.textContent = `⚠ ${warning.message}`;
      ui.warningsBox.append(p);
    }

    ui.list.textContent = "";
    ui.list.hidden = detected.length === 0;
    const today = new Date().toISOString();
    detected.forEach((item, index) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      const box = document.createElement("input");
      box.type = "checkbox";
      box.value = String(index);
      box.checked = isFutureEvent(item.event, today);
      label.append(box, ` ${importedEventLabel(item.event)}`);
      if (!isFutureEvent(item.event, today)) {
        const past = document.createElement("span");
        past.className = "import-past";
        past.textContent = item.event.startDate ? "past" : "no date";
        label.append(" ", past);
      }
      li.append(label);
      ui.list.append(li);
    });
    setStatus(
      ui,
      detected.length === 0
        ? ui.emptyMessage
        : `${detected.length} event(s) detected — future ones are preselected.`,
    );
    updateConfirm(ui);
  }

  /** "Import selected" — same queue whatever the source dialog. */
  function importSelected(
    ui: DetectedUi,
    dialog: HTMLDialogElement,
    kind: string,
  ): void {
    const selected = [
      ...ui.list.querySelectorAll<HTMLInputElement>("input:checked"),
    ].map((box) => detected[Number(box.value)]);
    if (selected.length === 0) return;

    // Importing replaces what is on screen — never silently. The pending
    // queue is the bigger loss, so it takes priority in the message; any
    // other form content still gets its own question.
    const pendingPrev = queue.filter((item) => !item.submitted).length;
    if (pendingPrev > 0) {
      if (
        !confirm(
          `Importing replaces the ${pendingPrev} previously imported event(s) not submitted yet. Discard them?`,
        )
      ) {
        return;
      }
    } else if (
      formHasContent(state) &&
      !confirm(
        "The form already has content; importing will replace it. Discard the current form?",
      )
    ) {
      return;
    }

    queue = selected;
    queuePos = 0;
    queueSourceUrl = detectedSourceUrl;
    queueRetrievedAt = detectedRetrievedAt;
    queueKind = kind;
    dialog.close();
    loadImported();
  }

  // --- source: iCalendar file/URL -------------------------------------------
  const icsUi: DetectedUi = {
    list: importListBox,
    warningsBox: importWarningsBox,
    status: importStatus,
    confirm: importConfirm,
    emptyMessage: "No events detected in this file.",
  };

  importListBox.addEventListener("input", () => updateConfirm(icsUi));

  el<HTMLButtonElement>("import-open").addEventListener("click", () => {
    importDialog.showModal();
  });
  el<HTMLButtonElement>("import-cancel").addEventListener("click", () =>
    importDialog.close(),
  );

  importFileInput.addEventListener("input", () => {
    const file = importFileInput.files?.[0];
    if (!file) return;
    void file.text().then((text) => showDetected(icsUi, icsToEvents(text), null));
  });

  el<HTMLFormElement>("import-url-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const url = importUrlInput.value.trim().replace(/^webcal:/, "https:");
    if (!url) return;
    setStatus(icsUi, "Fetching…");
    fetch(url)
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        showDetected(icsUi, icsToEvents(await response.text()), url);
      })
      .catch(() => {
        setStatus(
          icsUi,
          "Could not fetch that URL (network error, or the server does not allow browser access — CORS). Download the .ics and upload it as a file instead.",
        );
      });
  });

  // --- source: event page (schema.org JSON-LD) --------------------------------
  const jsonldDialog = el<HTMLDialogElement>("jsonld-dialog");
  const jsonldUrlInput = el<HTMLInputElement>("jsonld-url");
  const jsonldHtml = el<HTMLTextAreaElement>("jsonld-html");
  const jsonldUi: DetectedUi = {
    list: el<HTMLUListElement>("jsonld-list"),
    warningsBox: el<HTMLDivElement>("jsonld-warnings"),
    status: el<HTMLParagraphElement>("jsonld-status"),
    confirm: el<HTMLButtonElement>("jsonld-confirm"),
    emptyMessage: "No events detected in this page.",
  };

  jsonldUi.list.addEventListener("input", () => updateConfirm(jsonldUi));

  el<HTMLButtonElement>("jsonld-open").addEventListener("click", () => {
    jsonldDialog.showModal();
  });
  el<HTMLButtonElement>("jsonld-cancel").addEventListener("click", () =>
    jsonldDialog.close(),
  );

  el<HTMLFormElement>("jsonld-url-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const url = jsonldUrlInput.value.trim();
    if (!url) return;
    setStatus(jsonldUi, "Fetching…");
    fetch(url)
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        showDetected(jsonldUi, htmlToEvents(await response.text()), url);
      })
      .catch(() => {
        // The normal case: meetup.com & friends block cross-origin reads.
        // Any previously pasted HTML belongs to another page now — clear it.
        jsonldHtml.value = "";
        setStatus(
          jsonldUi,
          "Could not fetch that page from the browser (CORS). Paste its HTML code below instead.",
        );
        jsonldHtml.focus();
      });
  });

  // Fallback path: parses the pasted HTML locally — no network involved.
  el<HTMLButtonElement>("jsonld-parse").addEventListener("click", () => {
    const html = jsonldHtml.value;
    if (html.trim() === "") return;
    // The typed URL still identifies the source even when fetch failed.
    const url = jsonldUrlInput.value.trim() || null;
    showDetected(jsonldUi, htmlToEvents(html), url);
  });

  el<HTMLButtonElement>("jsonld-confirm").addEventListener("click", () =>
    importSelected(jsonldUi, jsonldDialog, "page"),
  );

  /** Banner: position, per-event warnings, submitted state, nav buttons. */
  function renderImportBanner(): void {
    const item = queue[queuePos];
    importBannerText.textContent = `Imported ${queuePos + 1} of ${queue.length}: ${importedEventLabel(item.event)}${item.submitted ? " — issue opened ✓" : " — review the marked fields before submitting."}`;
    importBannerWarnings.textContent = "";
    importBannerWarnings.hidden = item.submitted || item.warnings.length === 0;
    for (const warning of item.warnings) {
      const li = document.createElement("li");
      li.textContent = warning.field
        ? `${warning.field}: ${warning.message}`
        : warning.message;
      importBannerWarnings.append(li);
    }
    importSubmitted.hidden = !item.submitted;
    importCheckResult.textContent = "";
    importPrev.disabled = queuePos === 0;
    importNext.disabled = queuePos + 1 >= queue.length;
    importBanner.hidden = false;
  }

  /**
   * Imported venue without coordinates: proposes a pin by geocoding the
   * address (same Nominatim search the map uses). The proposal is flagged in
   * the banner — it is derived, not source data, so it must be verified.
   */
  function proposeGeoFor(item: ImportQueueItem): void {
    void geocodeVenue(state.venue).then((hit) => {
      if (hit === null) return;
      // Only apply if the user is still on this event and has not set a pin.
      if (queue[queuePos] !== item || importBanner.hidden) return;
      if (state.geoLat !== "" || state.geoLon !== "") return;
      state.geoLat = String(Math.round(hit.lat * 1e5) / 1e5);
      state.geoLon = String(Math.round(hit.lon * 1e5) / 1e5);
      setControlValue("geoLat", state.geoLat);
      setControlValue("geoLon", state.geoLon);
      mapHandle?.setPosition(hit.lat, hit.lon);
      importMissing?.delete("geo");
      markImportGaps(form, importMissing ?? new Set());
      item.warnings.push({
        field: "geo",
        message:
          "coordinates proposed by geocoding the venue address (OpenStreetMap) — verify the pin",
      });
      refresh();
      renderImportBanner();
      saveCurrentItem();
    });
  }

  /** Prefills the form with the queue's current event and updates the banner. */
  function loadImported(): void {
    const item = queue[queuePos];
    // Import always lands on "new event" mode.
    const newRadio = document.querySelector<HTMLInputElement>(
      'input[name="mode"][value="new"]',
    );
    if (newRadio) newRadio.checked = true;
    isNew = true;
    combo.hidden = true;
    newActions.hidden = false;
    editSlug = null;
    const fresh = item.state === null;
    if (item.state !== null) {
      // Re-visited event: restore the edits exactly as they were left.
      state = item.state;
      importMissing = new Set(item.missing);
      slugDirty = item.slugDirty;
      idDirty = item.idDirty;
    } else {
      state = importedToFormState(item.event);
      importMissing = missingFormFields(item.event);
      // Provenance the tool knows even though the source data does not
      // carry it: the platform it came from (fetched URL, else the event's
      // own url, else the import format), the URL and the retrieval time.
      const platform =
        sourceNameFor(queueSourceUrl ?? item.event.url) ??
        (queueKind === "ics" ? "iCalendar (.ics) file" : null);
      if (platform !== null) state.sourceName = platform;
      if (queueSourceUrl !== null) state.sourceUrl = queueSourceUrl;
      if (platform !== null || queueSourceUrl !== null) {
        state.sourceRetrievedAt = queueRetrievedAt;
        importMissing.delete("source");
      }
      slugDirty = false;
      idDirty = false;
    }
    touched = new Set();
    submitAttempted = false;
    render(extraFieldsFor(toEventJson(state), profile));
    renderImportBanner();
    saveCurrentItem();
    if (fresh && state.venue !== "" && state.geoLat === "" && state.geoLon === "") {
      proposeGeoFor(item);
    }
  }

  /** Hides the banner without touching the stored queue (mode switch). */
  function pauseImportBanner(): void {
    saveCurrentItem();
    importBanner.hidden = true;
    importMissing = null;
    markImportGaps(form, new Set());
  }

  /** Explicit end: forgets the whole queue (asking first if work is unsent). */
  function endImportSession(): void {
    const unsubmitted = queue.filter((i) => !i.submitted).length;
    if (
      unsubmitted > 0 &&
      !confirm(
        `Discard ${unsubmitted} imported event(s) that were not submitted yet?`,
      )
    ) {
      return;
    }
    queue = [];
    queuePos = 0;
    persistQueue();
    importBanner.hidden = true;
    importMissing = null;
    markImportGaps(form, new Set());
  }

  importConfirm.addEventListener("click", () =>
    importSelected(icsUi, importDialog, "ics"),
  );

  importPrev.addEventListener("click", () => {
    saveCurrentItem();
    queuePos--;
    loadImported();
  });
  importNext.addEventListener("click", () => {
    saveCurrentItem();
    queuePos++;
    loadImported();
  });

  el<HTMLButtonElement>("import-discard").addEventListener("click", () => {
    queue.splice(queuePos, 1);
    if (queue.length === 0) {
      endImportSession(); // nothing unsubmitted left to ask about
      return;
    }
    queuePos = Math.min(queuePos, queue.length - 1);
    persistQueue();
    loadImported();
  });

  el<HTMLButtonElement>("import-dismiss").addEventListener(
    "click",
    endImportSession,
  );

  importCheckFeed.addEventListener("click", () => {
    if (repo === null) return;
    const id = queue[queuePos]?.submittedId;
    if (!id) return;
    importCheckResult.textContent = "Checking…";
    // Cache-busting query: Pages serves feed.json with long-lived caches.
    if (fetchPlan === null) return;
    void fetchJson(`${fetchPlan.pagesFeedUrl}?t=${Date.now()}`).then((feed) => {
      if (feed === null) {
        importCheckResult.textContent =
          "Could not fetch the published feed (the Pages site may not be live yet).";
      } else if (feedHasEventId(feed, id)) {
        importCheckResult.textContent = "✓ The event is in the published feed.";
      } else {
        importCheckResult.textContent =
          "Not there yet — it appears once the maintainers accept the PR and Pages rebuilds.";
      }
    });
  });

  // Leaving the page with imported events not yet submitted loses work
  // beyond what localStorage can restore elsewhere — warn first.
  window.addEventListener("beforeunload", (e) => {
    if (queue.some((item) => !item.submitted)) e.preventDefault();
  });

  // A queue persisted by a previous session (or reload) resumes where it was.
  const storedQueue = (() => {
    try {
      return decodeImportQueue(
        localStorage.getItem(importQueueKey(repoKey)),
      );
    } catch {
      return null;
    }
  })();
  if (storedQueue !== null) {
    queue = storedQueue.items;
    queuePos = Math.min(storedQueue.pos, queue.length - 1);
    queueSourceUrl = storedQueue.sourceUrl;
    queueRetrievedAt = storedQueue.retrievedAt;
    queueKind = storedQueue.kind ?? null;
    loadImported();
  }

  // --- outputs --------------------------------------------------------------
  const fallback = el<HTMLElement>("fallback");
  const fallbackText = el<HTMLTextAreaElement>("fallback-text");
  const fallbackLink = el<HTMLAnchorElement>("fallback-link");
  el<HTMLButtonElement>("fallback-copy").addEventListener("click", () => {
    void navigator.clipboard.writeText(fallbackText.value);
  });

  function follow(result: LinkResult): void {
    if (result.kind === "url") {
      fallback.hidden = true;
      window.open(result.url, "_blank", "noopener");
    } else {
      fallbackText.value = result.copyText;
      fallbackLink.href = result.url;
      fallback.hidden = false;
    }
  }

  // --- review step ----------------------------------------------------------
  const review = el<HTMLDialogElement>("review");
  const reviewJson = el<HTMLPreElement>("review-json");

  function openReview(): void {
    const json = JSON.stringify(toEventJson(state), null, 2);
    reviewJson.textContent = "";
    for (const token of tokenizeJson(json)) {
      if (token.type === "plain") {
        reviewJson.append(token.text);
      } else {
        const span = document.createElement("span");
        span.className = `j-${token.type}`;
        span.textContent = token.text;
        reviewJson.append(span);
      }
    }
    review.showModal();
  }

  el<HTMLButtonElement>("review-cancel").addEventListener("click", () =>
    review.close(),
  );
  el<HTMLButtonElement>("review-confirm").addEventListener("click", () => {
    if (repo === null) return;
    review.close();
    follow(proposeChangeUrl(repo, toEventJson(state), isNew));
    // Submitting the event currently on screen from an import session:
    // remember it (and its id) so the banner can offer the feed check.
    const item = queue[queuePos];
    if (item && !importBanner.hidden) {
      item.submitted = true;
      item.submittedId = toEventJson(state).id ?? null;
      persistQueue();
      renderImportBanner();
      // Surface the "check the feed" block: the user just came back from
      // the bottom of the form, where the banner is out of sight.
      importBanner.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  function revealInvalidDraft(): boolean {
    if (!draftValid) {
      // First invalid attempt reveals every error instead of blocking silently.
      submitAttempted = true;
      refresh();
      const firstError = form.querySelector(".field-error:not(:empty)");
      (firstError ?? documentErrors).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return false;
    }
    return true;
  }

  propose.addEventListener("click", () => {
    if (!revealInvalidDraft()) return;
    openReview();
  });

  editDirect.addEventListener("click", () => {
    if (repo === null) return;
    if (isNew) {
      follow(directCreateUrl(repo, state.slug, toEventJson(state), branch ?? "main"));
    } else if (editSlug !== null) {
      window.open(directEditUrl(repo, editSlug, branch), "_blank", "noopener");
    }
  });

  el<HTMLButtonElement>("copy-json").addEventListener("click", () => {
    if (!revealInvalidDraft()) return;
    void navigator.clipboard.writeText(eventJsonText(toEventJson(state)));
  });

  el<HTMLButtonElement>("download-json").addEventListener("click", () => {
    if (!revealInvalidDraft()) return;
    const blob = new Blob([`${eventJsonText(toEventJson(state))}\n`], {
      type: "application/json",
    });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `${state.slug || "event"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// Feedback: prefilled issue in ote-tools carrying the editor URL (with its
// ?repo= context) so reports arrive reproducible.
el<HTMLAnchorElement>("feedback-link").href =
  `https://github.com/OpenTechEvents/ote-tools/issues/new?${new URLSearchParams(
    {
      body: `<!-- describe the problem above this line -->\n\n---\nEditor URL: ${location.href}`,
    },
  )}`;

const context = editorContextFromSearch(location.search);
void startEditor(context.mode === "repo" ? context.repo : null);
