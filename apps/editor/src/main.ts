/**
 * Entry point: URL context, fetching and DOM wiring. All decisions
 * (fields, JSON shape, validation, links) live in lib/ and are unit-tested;
 * this file only connects them to the page.
 */

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
import { resolveProfile, type ResolvedProfile } from "./lib/presets.js";
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
  const profile = resolveProfile(config);
  for (const warning of profile.warnings) addWarning(warning);

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

  const form = el<HTMLFormElement>("event-form");
  const preview = el<HTMLPreElement>("json-preview");
  const badge = el<HTMLSpanElement>("valid-badge");
  const documentErrors = el<HTMLUListElement>("document-errors");
  const propose = el<HTMLButtonElement>("propose");
  const editDirect = el<HTMLButtonElement>("edit-direct");

  function setControlValue(key: string, value: string): void {
    const input = form.querySelector<HTMLInputElement>(`[data-key="${key}"]`);
    if (input) input.value = value;
  }

  function refresh(): void {
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

    preview.textContent = JSON.stringify(event, null, 2);
    updateErrors(form, result.fieldErrors);
    documentErrors.textContent = "";
    documentErrors.hidden = result.documentErrors.length === 0;
    for (const message of result.documentErrors) {
      const li = document.createElement("li");
      li.textContent = message;
      documentErrors.append(li);
    }
    badge.textContent = result.valid ? "✓ valid" : "✗ invalid";
    badge.className = result.valid ? "ok" : "invalid";
    propose.disabled = !result.valid;
    editDirect.disabled = !isNew && editSlug === null;
    editDirect.title =
      !isNew && editSlug === null
        ? "This event's filename could not be determined from the feed."
        : "";
  }

  function onInput(key: keyof FormState, value: string | boolean): void {
    if (key === "allDay") {
      state.allDay = value === true;
      setAllDay(form, state.allDay);
    } else {
      (state as unknown as Record<string, string>)[key] = String(value);
      if (key === "slug") slugDirty = true;
      if (key === "id") idDirty = true;
    }
    refresh();
  }

  function render(extra: ReadonlySet<string> = new Set()): void {
    renderForm(form, profile, state, extra, onInput);
    setAllDay(form, state.allDay);
    refresh();
  }

  render();

  // --- event listing: contents API first, Pages feed.json fallback -------
  const select = el<HTMLSelectElement>("event-select");
  let listed: ListedEvent[] = [];

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
    select.textContent = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent =
      listed.length > 0 ? "Choose an event…" : "(no events found)";
    select.append(placeholder);
    listed.forEach(({ event }, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${event.startDate ?? "????"} — ${event.name ?? event.id}`;
      select.append(option);
    });
  }

  void loadEvents();

  // --- mode switch --------------------------------------------------------
  for (const radio of document.querySelectorAll<HTMLInputElement>(
    'input[name="mode"]',
  )) {
    radio.addEventListener("input", () => {
      isNew = radio.value === "new";
      select.hidden = isNew;
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

  select.addEventListener("input", () => {
    const chosen = listed[Number(select.value)];
    if (!chosen) return;
    editSlug = chosen.slug;
    state = fromEventJson(chosen.event, chosen.slug ?? "");
    slugDirty = true;
    idDirty = true;
    render(extraFieldsFor(chosen.event, profile));
  });

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

  propose.addEventListener("click", () => {
    follow(proposeChangeUrl(repo, toEventJson(state), isNew));
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
