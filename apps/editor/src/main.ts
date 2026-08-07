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
  emptyFeedConfigState,
  fromOteConfig,
  likelyAggregatorFeed,
  toOteConfigJson,
} from "./lib/feed-config.js";
import {
  directCreateUrl,
  directDeleteUrl,
  directEditUrl,
  directFeedConfigUrl,
  eventJsonText,
  proposeChangeUrl,
  proposeDeleteUrl,
  type LinkResult,
} from "./lib/links.js";
import {
  availablePresets,
  CORE_FIELDS,
  FIELD_REGISTRY,
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
import type {
  FormState,
  ListedEvent,
  OrganizerRow,
  OteConfig,
  OteEvent,
} from "./lib/types.js";
import { validateDraft } from "./lib/validation.js";
import {
  LANGUAGE_SUGGESTIONS,
  markImportGaps,
  renderFeedTranslations,
  renderForm,
  renderInfoToggle,
  renderRepeaterField,
  SECTION_TITLES,
  setAllDay,
  updateErrors,
  type RepeaterKey,
  type TranslationsPatch,
} from "./ui/form.js";
import { geocodeVenue, mountGeoMap, type GeoMapHandle } from "./ui/map.js";
import { applyStaticTranslations, getLocale, setLocale, t, type Locale } from "./i18n/index.js";

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
    case "cfpUrl":
    case "cfpOpensAt":
    case "cfpClosesAt":
    case "cfpCoversTravel":
    case "cfpCoversAccommodation":
      return "cfp";
    case "eligibilityType":
    case "eligibilityNote":
    case "eligibilityUrl":
      return "eligibility";
    case "partOfId":
    case "partOfName":
    case "partOfUrl":
    case "partOfType":
      return "partOf";
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
  add("organizers", event.organizers);
  add("image", event.image);
  add("offers", event.offers);
  add("cfp", event.cfp);
  add("eligibility", event.eligibility);
  add("partOf", event.partOf);
  add("textLanguage", event.textLanguage);
  return used;
}

async function startEditor(repo: string | null): Promise<void> {
  const hasRepo = repo !== null;
  // Set once the config fetch resolves (below); updateRepoBanner re-reads it
  // on every call, including a later locale switch.
  let feedTitle: string | undefined;
  function updateRepoBanner(): void {
    el("repo-banner").textContent = hasRepo
      ? t("app.targetRepository", "Target repository: {repo}").replace("{repo}", repo)
      : t("app.standaloneGenerator", "Standalone JSON generator");
    if (feedTitle) el("repo-banner").textContent += ` — ${feedTitle}`;
  }

  // Localize the static shell before anything else renders — the dynamic
  // form picks up the same locale via t() lookups when renderForm runs.
  document.documentElement.lang = getLocale();
  applyStaticTranslations(document);
  const langSelect = el<HTMLSelectElement>("lang-select");
  langSelect.value = getLocale();
  langSelect.addEventListener("input", () => {
    setLocale(langSelect.value as Locale);
    applyStaticTranslations(document);
    updateRepoBanner();
    render(); // re-render is presentation-only — state (already-typed values) is untouched, same as a profile switch
  });

  const repoKey = repo ?? "__standalone__";
  const fetchPlan = repoFetchPlan(
    repo === null ? { mode: "generator" } : { mode: "repo", repo },
  );
  el("editor").hidden = false;
  updateRepoBanner();

  // --- context: config, profile, default branch -------------------------
  const config = fetchPlan !== null
    ? ((await fetchJson(fetchPlan.configUrl)) as OteConfig | null)
    : null;
  if (hasRepo && config === null) {
    addWarning(
      t(
        "warning.configNotFetched",
        "ote.config.json could not be fetched from the repository; showing all fields.",
      ),
    );
  } else if (hasRepo && config?.feed?.title) {
    feedTitle = config.feed.title;
    updateRepoBanner();
  }
  let profile = resolveProfile(config);
  for (const warning of profile.warnings) addWarning(warning);

  // Profile switcher: the config's profile is the default, not a cage.
  // A segmented control (styled like the New/Edit mode toggle) rather than
  // a <select> — every preset and the active one are visible at a glance,
  // making "this pre-filters your fields" obvious.
  const profileToggle = el<HTMLDivElement>("profile-toggle");
  for (const preset of availablePresets(config)) {
    const label = document.createElement("label");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "profile";
    radio.value = preset;
    radio.checked = preset === profile.preset;
    const span = document.createElement("span");
    span.textContent = preset;
    label.append(radio, span);
    profileToggle.append(label);
    radio.addEventListener("input", () => {
      profile = resolveProfile(config, radio.value);
      // Filled fields stay visible even when the new profile hides them.
      render(extraFieldsFor(toEventJson(state), profile));
    });
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
  // Snapshot of the event as loaded, for "Revert changes" while editing.
  let loadedSnapshot: FormState | null = null;
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

  // Repo mode lands on the events list; standalone mode has no feed to
  // list, so it goes straight to the form, same as before this view existed.
  let view: "list" | "form" | "settings" = hasRepo ? "list" : "form";
  const eventsListView = el<HTMLElement>("events-list-view");
  const formView = el<HTMLElement>("form-view");
  const feedSettingsView = el<HTMLElement>("feed-settings-view");
  const backToList = el<HTMLButtonElement>("back-to-list");
  const profileSwitch = el<HTMLElement>("profile-switch");

  /** Toggles the three top-level views. Elements *inside* form-view keep their own content-driven `hidden` logic (section-nav, document-errors…) untouched — this only gates the wrapper. */
  function showView(): void {
    eventsListView.hidden = view !== "list";
    formView.hidden = view !== "form";
    feedSettingsView.hidden = view !== "settings";
    backToList.hidden = !hasRepo || view === "list";
    // Profile pre-filters which FORM fields show — meaningless outside the
    // form itself.
    profileSwitch.hidden = view !== "form";
  }
  showView();
  backToList.addEventListener("click", () => {
    pauseImportBanner(); // leaving the current draft's context
    view = "list";
    showView();
    renderEventsGrid(eventsSearch.value);
  });

  const form = el<HTMLFormElement>("event-form");
  const sectionNav = el<HTMLElement>("section-nav");
  const badge = el<HTMLButtonElement>("valid-badge");
  const resetButton = el<HTMLButtonElement>("reset-draft");
  const documentErrors = el<HTMLUListElement>("document-errors");
  const propose = el<HTMLButtonElement>("propose");
  const editDirect = el<HTMLButtonElement>("edit-direct");
  const repoOutputActions = el<HTMLSpanElement>("repo-output-actions");
  const generatorOutputActions = el<HTMLSpanElement>("generator-output-actions");
  repoOutputActions.hidden = !hasRepo;
  generatorOutputActions.hidden = hasRepo;

  // Generator mode: let the organizer connect an existing feed so they can
  // edit/add straight in its repository. Connecting just reloads with
  // ?repo=owner/name, which re-enters repo mode (enabling "Edit directly" /
  // "Review & submit").
  const repoConnectOpen = el<HTMLButtonElement>("repo-connect-open");
  const repoConnectDialog = el<HTMLDialogElement>("repo-connect");
  repoConnectOpen.hidden = hasRepo;
  if (!hasRepo) {
    repoConnectOpen.addEventListener("click", () => repoConnectDialog.showModal());
    el<HTMLButtonElement>("repo-connect-cancel").addEventListener("click", () =>
      repoConnectDialog.close(),
    );
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
        connectError.textContent = t(
          "dialog.repoConnect.error",
          "Enter your repository as owner/repo — for example my-org/ote-events.",
        );
        connectError.hidden = false;
        return;
      }
      location.search = `?repo=${repo}`;
    });
  }

  // --- feed settings: edits ote.config.json's `feed` block only ----------
  // A third top-level view (list/form/settings), not a dialog — makes
  // better use of the screen than a modal for a form this size. Wired
  // directly here rather than routed through ui/form.ts's per-field/
  // validation machinery, which this doesn't need: ote.config.json isn't
  // checked against the OTE JSON Schema at all.
  const feedSettingsOpen = el<HTMLButtonElement>("feed-settings-open");
  feedSettingsOpen.hidden = !hasRepo;
  if (hasRepo) {
    const feedTitleInput = el<HTMLInputElement>("feed-title");
    const feedDescriptionInput = el<HTMLTextAreaElement>("feed-description");
    const feedUrlInput = el<HTMLInputElement>("feed-url");
    const feedLicenseInput = el<HTMLInputElement>("feed-license");
    const feedLicenseUrlInput = el<HTMLInputElement>("feed-license-url");
    const feedTextLanguageInput = el<HTMLInputElement>("feed-text-language");
    const feedOrganizersSlot = el<HTMLDivElement>("feed-organizers-slot");
    const feedTranslationsSlot = el<HTMLDivElement>("feed-translations-slot");

    // Info tooltips, same widget every other field in the app uses — added
    // once here (these labels are static, never re-rendered) rather than
    // hand-authoring the popover markup/interaction a second time.
    const feedInfo: Record<string, string> = {
      "feed-title": t(
        "dialog.feedSettings.titleInfo",
        "Shown as your feed's name wherever it's listed or embedded.",
      ),
      "feed-description": t(
        "dialog.feedSettings.descriptionInfo",
        "A short summary of what this feed covers.",
      ),
      "feed-url": t(
        "dialog.feedSettings.urlInfo",
        "Your community's own website or feed homepage — not the events/ files themselves.",
      ),
      "feed-license": t(
        "dialog.feedSettings.licenseInfo",
        "License of your event DATA (not of the events themselves). CC0-1.0 (public domain) or CC-BY-4.0 (requires attribution) are common choices; any SPDX identifier or URL works.",
      ),
      "feed-license-url": t(
        "dialog.feedSettings.licenseUrlInfo",
        "Link to the full license text, if the license itself needs explaining.",
      ),
      "feed-text-language": t(
        "dialog.feedSettings.textLanguageInfo",
        "The language your feed's title/description (and your events' name/description) are written in. Only needed if you use translations.",
      ),
    };
    for (const [id, info] of Object.entries(feedInfo)) {
      document.querySelector(`label[for="${id}"]`)?.append(renderInfoToggle(info));
    }

    const feedLanguageSuggestions = el<HTMLDataListElement>("feed-language-suggestions");
    for (const lang of LANGUAGE_SUGGESTIONS) {
      const option = document.createElement("option");
      option.value = lang.code;
      option.label = lang.name;
      feedLanguageSuggestions.append(option);
    }

    let feedState = emptyFeedConfigState();
    // Computed once per open (from the already-loaded event list, no new
    // fetch) — see the feedSettingsOpen handler below.
    let aggregatorLikely = false;

    function renderFeedOrganizers(): void {
      feedOrganizersSlot.textContent = "";

      // "Use the same details as above" — visible only while organizers is
      // still empty; appends one row prefilled from Title/URL, left fully
      // editable. Declared before renderRepeaterField so its onArrayChange
      // callback can toggle this button's visibility without a full rebuild.
      const quickFillBtn = document.createElement("button");
      quickFillBtn.type = "button";
      quickFillBtn.className = "secondary organizers-quick-fill";
      quickFillBtn.textContent = t(
        "dialog.feedSettings.organizersQuickFill",
        "Use the same details as above",
      );
      quickFillBtn.hidden = feedState.organizers.length > 0;
      quickFillBtn.addEventListener("click", () => {
        feedState.organizers = [
          ...feedState.organizers,
          { name: feedState.title, url: feedState.url, email: "", type: "" },
        ];
        renderFeedOrganizers(); // deliberate, infrequent action — a full rebuild here is fine
      });

      const rendered = renderRepeaterField(
        "organizers",
        feedState.organizers as unknown as Record<string, string>[],
        (_key, items) => {
          feedState.organizers = items as unknown as OrganizerRow[];
          quickFillBtn.hidden = feedState.organizers.length > 0;
        },
        () => "",
      );
      // REPEATER_SPECS.organizers' own info text is written for the EVENT
      // organizers field ("replaces the feed's own list for this event") —
      // wrong here, where this *is* the feed's own list. Same widget,
      // different tooltip copy.
      const info = rendered.querySelector<HTMLElement>(".info-popover");
      if (info) {
        info.textContent = t(
          "dialog.feedSettings.organizersInfo",
          "Who runs your community, by default. Every event inherits this list unless it declares its own organizers, which then REPLACES it, not merges.",
        );
      }

      // title/url above name who PUBLISHES the feed; this field is who
      // ORGANIZES the events in it — the same distinction REPEATER_SPECS'
      // own info text can't carry without leaking feed-specific wording
      // into the event form that reuses it, so it's a separate note here.
      const note = document.createElement("p");
      note.className = "hint organizers-feed-note";
      note.textContent = t(
        "dialog.feedSettings.organizersNote",
        "Title/URL above name who publishes this feed; organizers is who organizes the events in it. If this feed only publishes your own events, they probably match. They only differ once you aggregate events from other communities — leave this empty in that case (see the notice below).",
      );

      const label = rendered.querySelector("label");
      if (label) {
        // Inserted in reverse of the desired final order — each .after()
        // on the same reference node pushes the previous insertion down.
        label.after(quickFillBtn);
        if (aggregatorLikely) {
          const warning = document.createElement("div");
          warning.className = "warning-box organizers-warning";
          const p = document.createElement("p");
          p.textContent = t(
            "dialog.feedSettings.organizersAggregatorWarning",
            "Heads up: the events in this feed declare noticeably different organizers. If this feed aggregates events from other communities, leave this field empty — the spec requires it: filling it would attribute every aggregated event to whoever runs this feed, not who actually organizes each one.",
          );
          warning.append(p);
          label.after(warning);
        }
        label.after(note);
      }

      feedOrganizersSlot.append(rendered);
    }

    function renderFeedTranslationsUI(): void {
      feedTranslationsSlot.textContent = "";
      feedTranslationsSlot.append(
        renderFeedTranslations(
          feedState.translations,
          () => ({ title: feedState.title, description: feedState.description }),
          () => feedState.textLanguage,
          (translations) => {
            feedState.translations = translations;
          },
        ),
      );
    }

    // Default profile + custom field picker — writes the top-level
    // profile/customProfile keys (not nested under feed), via the same
    // feedState/toOteConfigJson save path as everything else in this view.
    const feedProfileToggle = el<HTMLDivElement>("feed-profile-toggle");
    const feedProfileFieldsWrap = el<HTMLDivElement>("feed-profile-fields-wrap");
    const feedProfileFields = el<HTMLDivElement>("feed-profile-fields");
    const coreFieldIds: readonly string[] = CORE_FIELDS;

    function renderFeedProfileFields(): void {
      feedProfileFieldsWrap.hidden = feedState.profile !== "custom";
      feedProfileFields.textContent = "";
      if (feedState.profile !== "custom") return;
      let currentSection: string | null = null;
      for (const def of FIELD_REGISTRY) {
        if (coreFieldIds.includes(def.id)) continue;
        if (def.section !== currentSection) {
          currentSection = def.section;
          const heading = document.createElement("p");
          heading.className = "field-checklist-section";
          heading.textContent = t(`section.${def.section}`, SECTION_TITLES[def.section]);
          feedProfileFields.append(heading);
        }
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = feedState.customProfileFields.includes(def.id);
        checkbox.addEventListener("input", () => {
          feedState.customProfileFields = checkbox.checked
            ? [...feedState.customProfileFields, def.id]
            : feedState.customProfileFields.filter((id) => id !== def.id);
        });
        const span = document.createElement("span");
        span.textContent = t(`field.${def.id}.label`, def.id);
        label.append(checkbox, span);
        feedProfileFields.append(label);
      }
    }

    // Always all four, regardless of what this repo's config currently has
    // (unlike the live #profile-toggle, which only offers "custom" once the
    // file already has one) — this picker is how an organizer creates one
    // for the first time. Built once; renderFeedProfileToggle() (called
    // each time the view opens) only sets which radio is checked.
    for (const preset of ["meetup", "conference", "all", "custom"]) {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "feed-profile";
      radio.value = preset;
      const span = document.createElement("span");
      span.textContent = preset;
      label.append(radio, span);
      feedProfileToggle.append(label);
      radio.addEventListener("input", () => {
        feedState.profile = preset;
        renderFeedProfileFields();
      });
    }

    function renderFeedProfileToggle(): void {
      for (const radio of feedProfileToggle.querySelectorAll<HTMLInputElement>(
        'input[name="feed-profile"]',
      )) {
        radio.checked = radio.value === feedState.profile;
      }
      renderFeedProfileFields();
    }

    feedSettingsOpen.addEventListener("click", () => {
      feedState = fromOteConfig(config);
      aggregatorLikely = likelyAggregatorFeed(listed.map((entry) => entry.event));
      feedTitleInput.value = feedState.title;
      feedDescriptionInput.value = feedState.description;
      feedUrlInput.value = feedState.url;
      feedLicenseInput.value = feedState.license;
      feedLicenseUrlInput.value = feedState.licenseUrl;
      feedTextLanguageInput.value = feedState.textLanguage;
      renderFeedOrganizers();
      renderFeedTranslationsUI();
      renderFeedProfileToggle();
      view = "settings";
      showView();
    });

    feedTitleInput.addEventListener("input", () => (feedState.title = feedTitleInput.value));
    feedDescriptionInput.addEventListener(
      "input",
      () => (feedState.description = feedDescriptionInput.value),
    );
    feedUrlInput.addEventListener("input", () => (feedState.url = feedUrlInput.value));
    feedLicenseInput.addEventListener("input", () => (feedState.license = feedLicenseInput.value));
    feedLicenseUrlInput.addEventListener(
      "input",
      () => (feedState.licenseUrl = feedLicenseUrlInput.value),
    );
    feedTextLanguageInput.addEventListener(
      "input",
      () => (feedState.textLanguage = feedTextLanguageInput.value),
    );

    el<HTMLButtonElement>("feed-settings-save").addEventListener("click", () => {
      if (repo === null) return;
      follow(
        directFeedConfigUrl(
          repo,
          branch ?? "main",
          toOteConfigJson(feedState, config as unknown as Record<string, unknown> | null),
        ),
      );
      view = "list";
      showView();
      renderEventsGrid(eventsSearch.value);
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
    // "Ready" is a proactive positive signal; "Incomplete" only shows once
    // the organizer has actually tried to submit — a blank new-event form
    // shouldn't open with a badge telling them what they already know.
    if (draftValid) {
      badge.hidden = false;
      badge.textContent = t("badge.ready", "✓ Ready");
      badge.className = "ok";
      badge.disabled = true;
    } else if (submitAttempted) {
      badge.hidden = false;
      badge.textContent = t("badge.incomplete", "Incomplete — jump to first error");
      badge.className = "invalid";
      badge.disabled = false;
    } else {
      badge.hidden = true;
    }
    resetButton.textContent = isNew
      ? t("action.reset", "Reset")
      : t("action.revertChanges", "Revert changes");
    resetButton.disabled = !isNew && loadedSnapshot === null;
    editDirect.disabled = !hasRepo || (!isNew && editSlug === null);
    editDirect.title =
      !isNew && editSlug === null
        ? t("action.editDirectlyUnavailable", "This event's filename could not be determined from the feed.")
        : "";
    return draftValid;
  }

  let mapHandle: GeoMapHandle | null = null;
  // Set by render() once the Translations section is mounted; re-derives its
  // slot list after an edit made elsewhere in the form changes what's
  // translatable (see the fields listed in onInput/onArrayInput below).
  let refreshTranslations: () => void = () => {};

  /** Fields whose value a translation card shows as "the original text". */
  const TRANSLATABLE_SOURCE_KEYS = new Set<keyof FormState>([
    "name",
    "description",
    "eligibilityNote",
    "partOfName",
    // Gates whether a translation can be added at all — see renderTranslationsSection.
    "textLanguage",
  ]);

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
    if (TRANSLATABLE_SOURCE_KEYS.has(key)) refreshTranslations();
    refresh();
    saveCurrentItem(); // no-op unless an import banner is on screen
  }

  function onArrayInput(key: RepeaterKey, items: Record<string, string>[]): void {
    touched.add(key);
    if (importMissing?.delete(key)) markImportGaps(form, importMissing);
    (state as unknown as Record<string, unknown>)[key] = items;
    // Image alts / offer names are also what a translation card shows as
    // "the original text" — an added/removed/edited row changes its slots.
    if (key === "image" || key === "offers") refreshTranslations();
    refresh();
    saveCurrentItem();
  }

  /** The Translations section's own writes: several state slices, one commit. */
  function onTranslationsCommit(patch: TranslationsPatch): void {
    touched.add("translations");
    Object.assign(state, patch);
    refresh();
    saveCurrentItem();
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

  /** One pill per rendered section — jumps to it, opening it first if collapsed. */
  /** Wires a toggle button + dropdown panel: click toggles, outside click/Escape closes. Returns close(). */
  function wireDropdown(
    toggle: HTMLButtonElement,
    panel: HTMLElement,
    container: HTMLElement,
  ): () => void {
    const close = () => {
      panel.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target as Node)) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    return close;
  }

  function renderSectionNav(sections: readonly { id: string; title: string }[]): void {
    sectionNav.textContent = "";
    sectionNav.hidden = sections.length === 0;
    if (sections.length === 0) return;

    // Under ~40rem (styles.css) this becomes a hamburger dropdown instead
    // of the horizontal-scrolling pill row — 8 sections is too many to
    // scroll through sideways on a phone.
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.id = "section-nav-toggle";
    toggle.textContent = t("nav.sectionsMenu", "☰ Sections");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "section-nav-list");

    const list = document.createElement("div");
    list.id = "section-nav-list";
    list.className = "dropdown-panel";

    const close = wireDropdown(toggle, list, sectionNav);

    for (const { id, title } of sections) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = title;
      button.addEventListener("click", () => {
        const target = form.querySelector<HTMLDetailsElement>(`#section-${id}`);
        if (!target) return;
        target.open = true;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        close();
      });
      list.append(button);
    }
    sectionNav.append(toggle, list);
  }

  function render(extra: ReadonlySet<string> = new Set()): void {
    const rendered = renderForm(
      form,
      profile,
      state,
      extra,
      onInput,
      onArrayInput,
      onTranslationsCommit,
      mountMap,
    );
    refreshTranslations = rendered.refreshTranslations;
    renderSectionNav(rendered.sections);
    setAllDay(form, state.allDay);
    markImportGaps(form, importMissing ?? new Set());
    mountMap();
    refresh();
  }

  render();

  // --- event listing: contents API first, Pages feed.json fallback -------
  // Rendered as a searchable card grid (events-list-view), repo mode's
  // landing view — pickEvent()/directDeleteUrl()/proposeDeleteUrl() give
  // each card its actions.
  const eventsSearch = el<HTMLInputElement>("events-search");
  const eventsGrid = el<HTMLDivElement>("events-grid");
  const eventsEmpty = el<HTMLParagraphElement>("events-empty");
  const eventsRefresh = el<HTMLButtonElement>("events-refresh");

  function eventLabel(event: OteEvent): string {
    const day = (event.startDate ?? "????").split("T")[0];
    return `${day} — ${event.name ?? event.id}`;
  }

  /** First image's URL, if any — an image entry is a bare string or an {url, alt} object; "first is primary" is the same convention documented on REPEATER_SPECS.image in ui/form.ts. */
  function firstImageUrl(event: OteEvent): string | null {
    const first = event.image?.[0];
    if (typeof first === "string") return first || null;
    return first?.url || null;
  }

  function renderEventCard(entry: ListedEvent, index: number): HTMLElement {
    const { event } = entry;
    const card = document.createElement("article");
    card.className = "event-card";

    const thumb = document.createElement("div");
    thumb.className = "event-card-thumb";
    const imageUrl = firstImageUrl(event);
    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "";
      thumb.append(img);
    } else {
      thumb.classList.add("placeholder");
    }
    card.append(thumb);

    const body = document.createElement("div");
    body.className = "event-card-body";

    const meta = document.createElement("p");
    meta.className = "event-card-meta";
    const day = (event.startDate ?? "").split("T")[0];
    meta.append(day || t("ui.eventCard.noDate", "No date"));
    if (event.attendanceMode && event.attendanceMode !== "in-person") {
      meta.append(` · ${event.attendanceMode}`);
    }
    body.append(meta);

    const name = document.createElement("h3");
    name.textContent = event.name || event.id;
    body.append(name);

    if (event.location?.venue) {
      const loc = document.createElement("p");
      loc.className = "event-card-location";
      loc.textContent = `📍 ${event.location.venue}`;
      body.append(loc);
    }

    if (event.status && event.status !== "scheduled") {
      const statusBadge = document.createElement("span");
      statusBadge.className = `event-card-status status-${event.status}`;
      statusBadge.textContent = t(`ui.eventStatus.${event.status}`, event.status);
      body.append(statusBadge);
    }

    const actions = document.createElement("div");
    actions.className = "event-card-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "secondary";
    editBtn.textContent = t("action.edit", "Edit");
    editBtn.addEventListener("click", () => pickEvent(index));
    actions.append(editBtn);

    if (repo !== null) {
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "event-card-delete-trigger";
      deleteBtn.textContent = t("action.delete", "Delete");
      deleteBtn.addEventListener("click", () => openDeleteDialog(entry));
      actions.append(deleteBtn);
    }

    body.append(actions);
    card.append(body);
    return card;
  }

  // A single shared dialog (not a per-card dropdown, which used to get
  // clipped by the card's own rounded-corner overflow and, for cards near
  // the grid's edge, by the viewport too) — showModal() promotes it to the
  // top layer regardless of where any card sits.
  const deleteDialog = el<HTMLDialogElement>("delete-dialog");
  const deleteDialogEventName = el<HTMLParagraphElement>("delete-dialog-event-name");
  const deleteDirectBtn = el<HTMLButtonElement>("delete-direct");
  const deleteProposeBtn = el<HTMLButtonElement>("delete-propose");
  let deleteTarget: ListedEvent | null = null;

  el<HTMLButtonElement>("delete-cancel").addEventListener("click", () => deleteDialog.close());
  deleteDirectBtn.addEventListener("click", () => {
    if (repo === null || !deleteTarget || deleteTarget.slug === null) return;
    window.open(directDeleteUrl(repo, deleteTarget.slug, branch), "_blank", "noopener");
    deleteDialog.close();
  });
  deleteProposeBtn.addEventListener("click", () => {
    if (repo === null || !deleteTarget) return;
    follow(proposeDeleteUrl(repo, deleteTarget.slug, deleteTarget.event));
    deleteDialog.close();
  });

  function openDeleteDialog(entry: ListedEvent): void {
    deleteTarget = entry;
    deleteDialogEventName.textContent = entry.event.name || entry.event.id;
    deleteDirectBtn.disabled = entry.slug === null;
    deleteDirectBtn.title =
      entry.slug === null
        ? t(
            "action.editDirectlyUnavailable",
            "This event's filename could not be determined from the feed.",
          )
        : "";
    deleteDialog.showModal();
  }

  function renderEventsGrid(query: string): void {
    eventsGrid.textContent = "";
    eventsEmpty.hidden = listed.length > 0;
    const q = query.trim().toLowerCase();
    const hits = listed
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry }) => eventLabel(entry.event).toLowerCase().includes(q));
    for (const { entry, index } of hits) eventsGrid.append(renderEventCard(entry, index));
  }

  eventsSearch.addEventListener("input", () => renderEventsGrid(eventsSearch.value));
  eventsRefresh.addEventListener("click", () => void loadEvents());

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
          t(
            "warning.feedFallback",
            "Event list loaded from the published feed (GitHub API unavailable); filenames are inferred from event ids.",
          ),
        );
      }
    }
    eventsSearch.placeholder = t("nav.comboFilter", "Type to filter, or pick an event…");
    eventsSearch.disabled = listed.length === 0;
    renderEventsGrid(eventsSearch.value);
    refresh(); // collision checks were waiting for the listing
  }

  if (hasRepo) void loadEvents();

  // --- mode switch --------------------------------------------------------

  /** Back to a blank draft — also what "New event" switches to when there's no pending import to resume. */
  function resetToBlank(): void {
    state = emptyFormState(state.timezone);
    editSlug = null;
    slugDirty = false;
    idDirty = false;
    loadedSnapshot = null;
    touched = new Set();
    submitAttempted = false;
    render();
  }

  /** "Reset"/"Revert changes" in the action bar: blank when drafting new, back to what was loaded when editing. */
  function resetDraft(): void {
    if (isNew) {
      resetToBlank();
      return;
    }
    if (!loadedSnapshot) return;
    state = structuredClone(loadedSnapshot);
    touched = new Set();
    submitAttempted = false;
    render(extraFieldsFor(toEventJson(state), profile));
  }
  resetButton.addEventListener("click", resetDraft);

  /** "+ New event"'s three actions all start here: a fresh draft (or the pending import queue, if there is one), landing on the form view. Editing an existing event instead goes through pickEvent(), which sets isNew = false itself. */
  function enterNewMode(): void {
    isNew = true;
    touched = new Set();
    submitAttempted = false;
    view = "form";
    showView();
    if (queue.length > 0) {
      loadImported();
      return;
    }
    resetToBlank();
  }

  function pickEvent(index: number): void {
    const chosen = listed[index];
    if (!chosen) return;
    pauseImportBanner(); // leaving any in-progress import/new-event context
    isNew = false;
    editSlug = chosen.slug;
    state = fromEventJson(chosen.event, chosen.slug ?? "");
    loadedSnapshot = structuredClone(state);
    slugDirty = true;
    idDirty = true;
    touched = new Set();
    submitAttempted = false;
    render(extraFieldsFor(chosen.event, profile));
    view = "form";
    showView();
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

  el<HTMLButtonElement>("jsonld-cancel").addEventListener("click", () =>
    jsonldDialog.close(),
  );

  // --- "+ New event" menu: blank draft, or either import dialog above -------
  {
    const menu = el<HTMLDivElement>("new-event-menu");
    const toggle = el<HTMLButtonElement>("new-event-toggle");
    const list = el<HTMLDivElement>("new-event-list");
    const closeMenu = wireDropdown(toggle, list, menu);

    list.querySelector('[data-action="blank"]')?.addEventListener("click", () => {
      enterNewMode();
      closeMenu();
    });
    list.querySelector('[data-action="jsonld"]')?.addEventListener("click", () => {
      enterNewMode();
      jsonldDialog.showModal();
      closeMenu();
    });
    list.querySelector('[data-action="ics"]')?.addEventListener("click", () => {
      enterNewMode();
      importDialog.showModal();
      closeMenu();
    });
  }

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
    const suffix = item.submitted
      ? t("importBanner.suffixSubmitted", " — issue opened ✓")
      : t("importBanner.suffixPending", " — review the marked fields before submitting.");
    importBannerText.textContent =
      t("importBanner.position", "Imported {n} of {total}: {label}")
        .replace("{n}", String(queuePos + 1))
        .replace("{total}", String(queue.length))
        .replace("{label}", importedEventLabel(item.event)) + suffix;
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
    // Import always lands on "new event" mode, in the form view.
    isNew = true;
    view = "form";
    showView();
    editSlug = null;
    loadedSnapshot = null;
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
    importCheckResult.textContent = t("importBanner.checking", "Checking…");
    // Cache-busting query: Pages serves feed.json with long-lived caches.
    if (fetchPlan === null) return;
    void fetchJson(`${fetchPlan.pagesFeedUrl}?t=${Date.now()}`).then((feed) => {
      if (feed === null) {
        importCheckResult.textContent = t(
          "importBanner.checkFailed",
          "Could not fetch the published feed (the Pages site may not be live yet).",
        );
      } else if (feedHasEventId(feed, id)) {
        importCheckResult.textContent = t(
          "importBanner.checkFound",
          "✓ The event is in the published feed.",
        );
      } else {
        importCheckResult.textContent = t(
          "importBanner.checkNotFound",
          "Not there yet — it appears once the maintainers accept the PR and Pages rebuilds.",
        );
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
  // The same dialog previews the JSON for both modes — repo mode confirms
  // into "Open GitHub issue", standalone mode into "Copy JSON"/"Download
  // .json" — so neither ever acts on unreviewed data.
  const review = el<HTMLDialogElement>("review");
  const reviewJson = el<HTMLPreElement>("review-json");
  el<HTMLParagraphElement>("review-hint-repo").hidden = !hasRepo;
  el<HTMLParagraphElement>("review-hint-standalone").hidden = hasRepo;
  el<HTMLButtonElement>("review-confirm").hidden = !hasRepo;
  el<HTMLButtonElement>("review-copy").hidden = hasRepo;
  el<HTMLButtonElement>("review-download").hidden = hasRepo;

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

  /** Opens the `<details>` the first error lives in (if any collapsed) and scrolls to it. */
  function jumpToFirstError(): void {
    const firstError = form.querySelector<HTMLElement>(".field-error:not(:empty)");
    const target = firstError ?? documentErrors;
    const section = target.closest<HTMLDetailsElement>("details");
    if (section) section.open = true;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  badge.addEventListener("click", jumpToFirstError);

  function revealInvalidDraft(): boolean {
    if (!draftValid) {
      // First invalid attempt reveals every error instead of blocking silently.
      submitAttempted = true;
      refresh();
      jumpToFirstError();
      return false;
    }
    return true;
  }

  propose.addEventListener("click", () => {
    if (!revealInvalidDraft()) return;
    openReview();
  });

  el<HTMLButtonElement>("review-standalone").addEventListener("click", () => {
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

  // Reachable only once the draft has already passed revealInvalidDraft() —
  // that's what got the review dialog open in the first place.
  el<HTMLButtonElement>("review-copy").addEventListener("click", () => {
    void navigator.clipboard.writeText(eventJsonText(toEventJson(state)));
    review.close();
  });

  el<HTMLButtonElement>("review-download").addEventListener("click", () => {
    const blob = new Blob([`${eventJsonText(toEventJson(state))}\n`], {
      type: "application/json",
    });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `${state.slug || "event"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    review.close();
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
