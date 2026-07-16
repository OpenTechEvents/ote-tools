/**
 * Entry point: URL context, fetching and DOM wiring. All decisions
 * (fields, JSON shape, validation, links) live in lib/ and are unit-tested;
 * this file only connects them to the page.
 */

import { findCollisions } from "./lib/collisions.js";
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
  proposeChangeUrl,
  type LinkResult,
} from "./lib/links.js";
import {
  availablePresets,
  resolveProfile,
  type ResolvedProfile,
} from "./lib/presets.js";
import {
  contentsApiUrl,
  pagesFeedUrl,
  parseContentsListing,
  parseFeedListing,
  parseRepoParam,
  rawConfigUrl,
  repoApiUrl,
} from "./lib/repo.js";
import type { FormState, ListedEvent, OteConfig, OteEvent } from "./lib/types.js";
import { validateDraft } from "./lib/validation.js";
import { renderForm, setAllDay, updateErrors } from "./ui/form.js";
import { mountGeoMap, type GeoMapHandle } from "./ui/map.js";

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

function showRepoPicker(): void {
  el("repo-picker").hidden = false;
  el<HTMLFormElement>("repo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const repo = el<HTMLInputElement>("repo-input").value.trim();
    location.search = `?${new URLSearchParams({ repo })}`;
  });
}

async function startEditor(repo: string): Promise<void> {
  el("editor").hidden = false;
  el("repo-banner").textContent = `Target repository: ${repo}`;

  // --- context: config, profile, default branch -------------------------
  const config = (await fetchJson(rawConfigUrl(repo))) as OteConfig | null;
  if (config === null) {
    addWarning(
      "ote.config.json could not be fetched from the repository; showing all fields.",
    );
  } else if (config.feed?.title) {
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
  void fetchJson(repoApiUrl(repo)).then((meta) => {
    const value = (meta as { default_branch?: unknown } | null)?.default_branch;
    if (typeof value === "string") branch = value;
  });

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

  const form = el<HTMLFormElement>("event-form");
  const badge = el<HTMLSpanElement>("valid-badge");
  const documentErrors = el<HTMLUListElement>("document-errors");
  const propose = el<HTMLButtonElement>("propose");
  const editDirect = el<HTMLButtonElement>("edit-direct");

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
    editDirect.disabled = !isNew && editSlug === null;
    editDirect.title =
      !isNew && editSlug === null
        ? "This event's filename could not be determined from the feed."
        : "";
    return draftValid;
  }

  let mapHandle: GeoMapHandle | null = null;

  function onInput(key: keyof FormState, value: string | boolean): void {
    touched.add(fieldIdForKey(key));
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
    mapHandle = mountGeoMap(slot, initial, (newLat, newLon) => {
      state.geoLat = String(newLat);
      state.geoLon = String(newLon);
      setControlValue("geoLat", state.geoLat);
      setControlValue("geoLon", state.geoLon);
      touched.add("geo");
      refresh();
    });
  }

  function render(extra: ReadonlySet<string> = new Set()): void {
    renderForm(form, profile, state, extra, onInput);
    setAllDay(form, state.allDay);
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
    const listing = parseContentsListing(await fetchJson(contentsApiUrl(repo)));
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
      listed = parseFeedListing(await fetchJson(pagesFeedUrl(repo)));
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

  void loadEvents();

  // --- mode switch --------------------------------------------------------
  for (const radio of document.querySelectorAll<HTMLInputElement>(
    'input[name="mode"]',
  )) {
    radio.addEventListener("input", () => {
      isNew = radio.value === "new";
      combo.hidden = isNew;
      touched = new Set();
      submitAttempted = false;
      if (isNew) {
        state = emptyFormState(state.timezone);
        editSlug = null;
        slugDirty = false;
        idDirty = false;
        render();
      } else {
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
    review.close();
    follow(proposeChangeUrl(repo, toEventJson(state), isNew));
  });

  propose.addEventListener("click", () => {
    if (!draftValid) {
      // First invalid attempt reveals every error instead of blocking silently.
      submitAttempted = true;
      refresh();
      const firstError = form.querySelector(".field-error:not(:empty)");
      (firstError ?? documentErrors).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    openReview();
  });

  editDirect.addEventListener("click", () => {
    if (isNew) {
      follow(directCreateUrl(repo, state.slug, toEventJson(state), branch ?? "main"));
    } else if (editSlug !== null) {
      window.open(directEditUrl(repo, editSlug, branch), "_blank", "noopener");
    }
  });
}

const repo = parseRepoParam(location.search);
if (repo === null) {
  showRepoPicker();
} else {
  void startEditor(repo);
}
