/**
 * DOM rendering of the event form. No business logic here: which fields to
 * show comes from lib/presets.ts, values live in lib/types.ts FormState.
 * Tested by hand (the lib/ modules carry the vitest coverage).
 */

import { t } from "../i18n/index.js";
import type { ResolvedProfile, SectionId } from "../lib/presets.js";
import { FIELD_REGISTRY, SECTIONS } from "../lib/presets.js";
import { getRecentTags, recordTagUsed } from "../lib/tag-history.js";
import type { TagSuggestion } from "../lib/tag-vocabulary.js";
import { loadTagVocabulary, searchVocabulary } from "../lib/tag-vocabulary.js";
import { filterZones } from "../lib/timezones.js";
import type { FormState } from "../lib/types.js";

type StateKey = keyof FormState;

/** Unique, stable DOM ids for label/input association and aria-describedby. */
let uid = 0;
function nextId(prefix: string): string {
  return `f-${prefix}-${uid++}`;
}

/**
 * Hides `dependent.element` unless `driver.input`'s current value is one of
 * `values` — re-evaluated on every change to the driver, and once
 * immediately (so editing a loaded event starts in the right state). Never
 * clears the dependent's own value: switching the driver back reveals
 * whatever was already typed, it doesn't come back empty.
 */
function linkVisibility(
  driver: { input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement },
  dependent: { element: HTMLElement },
  values: readonly string[],
): void {
  const apply = () => {
    dependent.element.hidden = !values.includes(driver.input.value);
  };
  driver.input.addEventListener("input", apply);
  apply();
}

// --- info tooltip: a tap/click disclosure, not a hover-only title -----------
// A `title` attribute needs :hover, which touch doesn't have. A disclosure
// button (aria-expanded/aria-controls) is the correct pattern for a
// click-triggered explanation — role="tooltip" is reserved for hover/focus
// content by the ARIA spec, so it would be the wrong fix, not just a
// different one. Only one popover is open at a time, closed by clicking
// elsewhere or Escape.
let openInfoPopover: { button: HTMLButtonElement; popover: HTMLElement } | null = null;

function closeInfoPopover(): void {
  if (!openInfoPopover) return;
  openInfoPopover.button.setAttribute("aria-expanded", "false");
  openInfoPopover.popover.hidden = true;
  openInfoPopover = null;
}

document.addEventListener("click", (e) => {
  if (!openInfoPopover) return;
  const target = e.target as Node;
  if (openInfoPopover.button.contains(target) || openInfoPopover.popover.contains(target)) {
    return;
  }
  closeInfoPopover();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeInfoPopover();
});

/**
 * Index-only bookkeeping for arrow-key movement over a suggestion `<ul>`'s
 * `<li role="option">` children. The caller still owns what "select index N"
 * means and what the list's items actually are — this only tracks which one
 * is highlighted and keeps `aria-activedescendant` in sync. `handleKey`
 * returns true when it consumed the key (an Up/Down move); Enter with a
 * highlighted item is the caller's job to check via `selectedIndex`, so the
 * existing "commit typed text" Enter behaviour keeps working as the
 * fallback when nothing is highlighted.
 */
function createListNav(input: HTMLInputElement, list: HTMLUListElement) {
  let index = -1;

  function items(): HTMLLIElement[] {
    return [...list.querySelectorAll<HTMLLIElement>("li")];
  }

  function apply(): void {
    const els = items();
    els.forEach((li, i) => li.classList.toggle("active", i === index));
    const active = index >= 0 ? els[index] : undefined;
    if (active) {
      if (!active.id) active.id = nextId("opt");
      input.setAttribute("aria-activedescendant", active.id);
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  return {
    get selectedIndex() {
      return index;
    },
    /** Call after the list's contents change — the old highlight no longer applies. */
    reset(): void {
      index = -1;
      apply();
    },
    /** Returns true if the key was an Up/Down move it handled. */
    handleKey(e: KeyboardEvent): boolean {
      const count = items().length;
      if (list.hidden || count === 0) return false;
      if (e.key === "ArrowDown") {
        index = (index + 1) % count;
        apply();
        return true;
      }
      if (e.key === "ArrowUp") {
        index = (index - 1 + count) % count;
        apply();
        return true;
      }
      return false;
    },
  };
}

/** The ⓘ next to a label: click/tap to reveal `text`, click elsewhere or Escape to close. */
export function renderInfoToggle(text: string): HTMLElement {
  const wrap = document.createElement("span");
  wrap.className = "info-wrap";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "info";
  button.textContent = " ⓘ";
  button.setAttribute("aria-expanded", "false");

  const popover = document.createElement("span");
  popover.className = "info-popover";
  popover.id = nextId("info");
  popover.textContent = text;
  popover.hidden = true;
  button.setAttribute("aria-controls", popover.id);

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const wasOpen = openInfoPopover?.button === button;
    closeInfoPopover();
    if (!wasOpen) {
      popover.hidden = false;
      button.setAttribute("aria-expanded", "true");
      openInfoPopover = { button, popover };
    }
  });

  wrap.append(button, popover);
  return wrap;
}

interface Control {
  key: StateKey;
  label: string;
  kind:
    | "text"
    | "url"
    | "email"
    | "number"
    | "date"
    | "time"
    | "textarea"
    | "checkbox"
    | "select"
    | "chips"
    | "combobox"
    | "instant";
  options?: string[];
  placeholder?: string;
  /** Autocomplete source for a "chips" control. Defaults to "languages". */
  vocab?: "languages" | "tags";
  /** Longer explanation shown as an ⓘ tooltip next to this sub-field's own label. */
  info?: string;
  /** Hidden unless the named sibling control's current value is one of `values`. */
  visibleWhen?: { key: StateKey; values: readonly string[] };
  /** Row-width hint relative to its siblings — short/fixed-shape values (a price, a 3-letter currency code) don't need as much room as a name or URL. "full" forces its own row, pushing whatever follows onto a fresh line (e.g. so a wide URL above a pair of dates doesn't steal the pair's row). Omit for the default (m). */
  size?: "s" | "m" | "l" | "full";
}

interface FieldSpec {
  label: string;
  required?: boolean;
  note?: string;
  /** Longer explanation shown as an ⓘ tooltip next to the label. */
  info?: string;
  controls: Control[];
}

/**
 * BCP 47 tags suggested by the languages autocomplete, with display names.
 * Anything outside this list can still be typed and added as a chip.
 */
export const LANGUAGE_SUGGESTIONS: ReadonlyArray<{ code: string; name: string }> = [
  { code: "es", name: "Spanish" },
  { code: "en", name: "English" },
  { code: "pt", name: "Portuguese" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ca", name: "Catalan" },
  { code: "eu", name: "Basque" },
  { code: "gl", name: "Galician" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "ko", name: "Korean" },
  { code: "tr", name: "Turkish" },
];

/** IANA timezone names for the timezone dropdown. */
function timezoneOptions(): string[] {
  try {
    const zones = Intl.supportedValuesOf("timeZone");
    return zones.includes("UTC") ? zones : ["UTC", ...zones];
  } catch {
    // Very old runtimes: a usable minimum, the schema validates the rest.
    return ["UTC", "Europe/Madrid", "Europe/London", "America/New_York"];
  }
}

const SECTION_TITLES: Record<SectionId, string> = {
  what: "What",
  when: "When",
  where: "Where",
  who: "Who",
  tickets: "Tickets",
  cfp: "C4P",
  translations: "Translations",
  metadata: "Metadata",
};

const FIELD_SPECS: Record<string, FieldSpec> = {
  name: {
    label: "Name",
    required: true,
    info: "Short display name. It's the one field every export format (ICS, RSS, schema.org) prints somewhere, so keep it readable on its own — not relying on today's date or venue for context.",
    controls: [{ key: "name", label: "", kind: "text" }],
  },
  description: {
    label: "Description",
    note: "Plain text or Markdown.",
    info: "A longer summary than the name — what the event actually is, for someone who's never heard of it. Most consumers render Markdown; the rest just show the raw text.",
    controls: [{ key: "description", label: "", kind: "textarea" }],
  },
  url: {
    label: "Event page URL",
    info: "The page describing this event today. Unlike the Event id in File & id, this one is allowed to change if the event moves platforms — leave it empty if there's no dedicated page yet.",
    controls: [
      { key: "url", label: "", kind: "url", placeholder: "https://…" },
    ],
  },
  tags: {
    label: "Tags",
    note: "Start typing to search topics and audiences; Enter adds any tag you type.",
    info: "Free-form topic and audience tags. Suggestions come from the ComBuildersES communities directory, but any tag is accepted — picking a suggestion just keeps the wording consistent.",
    controls: [
      {
        key: "tags",
        label: "",
        kind: "chips",
        vocab: "tags",
        placeholder: "Type to add… (python, junior…)",
      },
    ],
  },
  languages: {
    label: "Languages",
    info: "Languages the event is held in, as BCP 47 tags. Leave empty when unknown.",
    controls: [
      {
        key: "languages",
        label: "",
        kind: "chips",
        vocab: "languages",
        placeholder: "Type to add… (es, en…)",
      },
    ],
  },
  allDay: {
    label: "All-day event",
    info: "Not an OTE field itself — it decides whether Start/End below serialize as a date (\"2026-10-15\") or a date-time (\"2026-10-15T09:00\"). Toggle it before filling in the times; it changes what the Time inputs mean.",
    controls: [{ key: "allDay", label: "", kind: "checkbox" }],
  },
  startDate: {
    label: "Start",
    required: true,
    info: "Wall-clock time, not a fixed instant — no UTC offset here, that's what Timezone (below) is for. All-day events use just the date; timed events also need a time.",
    controls: [
      { key: "startDate", label: "Date", kind: "date" },
      { key: "startTime", label: "Time", kind: "time" },
    ],
  },
  endDate: {
    label: "End",
    info: "Must be the same form as Start (both dates, or both date-times) and can't be earlier. Leave empty when the event has no defined end.",
    controls: [
      { key: "endDate", label: "Date", kind: "date" },
      { key: "endTime", label: "Time", kind: "time" },
    ],
  },
  timezone: {
    label: "Timezone",
    required: true,
    info: "IANA timezone the event's wall-clock times belong to. Defaults to your browser's.",
    controls: [
      {
        key: "timezone",
        label: "",
        kind: "combobox",
        options: timezoneOptions(),
        placeholder: "Type to search… (Europe/Madrid)",
      },
    ],
  },
  status: {
    label: "Status",
    note: "Cancelled or postponed events must stay published.",
    info: "What happened to the EVENT, not to the data — cancelling it here doesn't delete the file, it marks it so subscribers see the cancellation instead of the entry just vanishing. \"tentative\" is for announced-but-unconfirmed. Defaults to \"scheduled\" when left unset.",
    controls: [
      {
        key: "status",
        label: "",
        kind: "select",
        options: [
          "",
          "scheduled",
          "tentative",
          "cancelled",
          "postponed",
          "rescheduled",
          "moved-online",
        ],
      },
    ],
  },
  attendanceMode: {
    label: "Attendance mode",
    note: "Leave empty when unknown — it never defaults to in-person.",
    info: "What the organizer says the event is — in-person, online, or both. Absent is a real answer (unknown), never silently assumed to be in-person.",
    controls: [
      {
        key: "attendanceMode",
        label: "",
        kind: "select",
        options: ["", "in-person", "online", "hybrid"],
      },
    ],
  },
  venue: {
    label: "Venue",
    note: "Human-readable place: name and address. The map below uses it to find the exact position.",
    info: "One line of free text — the name of the place plus as much address as it takes to get there. Not made redundant by the coordinates below: this is what a person reads, the pin is what a map plots.",
    controls: [{ key: "venue", label: "", kind: "text" }],
  },
  onlineUrl: {
    label: "Online URL",
    info: "Where to actually join online. Its presence is what tells a consumer this event has online access at all — independent of Attendance mode above.",
    controls: [
      { key: "onlineUrl", label: "", kind: "url", placeholder: "https://…" },
    ],
  },
  geo: {
    label: "Map position",
    note: "Search, click the map or drag the pin — or type WGS-84 decimal degrees.",
    info: "Optional exact position of the venue. Consumers use it for maps and distance filters; the venue text above stays the human-readable address.",
    controls: [
      { key: "geoLat", label: "Latitude", kind: "text" },
      { key: "geoLon", label: "Longitude", kind: "text" },
    ],
  },
  slug: {
    label: "Filename slug",
    required: true,
    note: "The event is stored as events/<slug>.json.",
    info: "Auto-suggested from the name and date; edit freely before publishing. Must be unique in the repository — the editor checks against the existing events.",
    controls: [{ key: "slug", label: "", kind: "text" }],
  },
  id: {
    label: "Event id",
    required: true,
    note: "Stable URI, minted once and never rewritten.",
    info: "Auto-suggested as <feed url>/events/<slug>, which is unique as long as the slug is. Consumers use it to update events instead of duplicating them, so never change it after publishing. The editor checks it against the repository's existing events; the fork's validation re-checks on every change.",
    controls: [{ key: "id", label: "", kind: "url" }],
  },
  license: {
    label: "Data license",
    note: "Usually left empty: the event inherits the feed's license. Suggestions are open, non-viral data licenses (SPDX ids).",
    info: "Licenses THIS DATA (the JSON), not the event itself. Almost always left empty — the event then inherits whatever the feed as a whole declares.",
    controls: [
      {
        key: "license",
        label: "",
        kind: "combobox",
        // Open-data licenses without share-alike/viral clauses. Free text
        // is still accepted; the suggestions are the sane defaults.
        options: ["CC0-1.0", "CC-BY-4.0", "PDDL-1.0", "ODC-By-1.0"],
        placeholder: "CC-BY-4.0",
      },
    ],
  },
  textLanguage: {
    label: "Text language",
    info: "BCP 47 tag for the language this event's own name/description are written in. Leave empty when unknown.",
    controls: [
      {
        key: "textLanguage",
        label: "",
        kind: "combobox",
        options: LANGUAGE_SUGGESTIONS.map((l) => l.code),
        placeholder: "es",
      },
    ],
  },
  eligibility: {
    label: "Eligibility",
    note: "Who may attend, when it isn't simply open to anyone.",
    info: "Answers \"can I go?\" — separate from Attendance mode and Where, which only say whether the event is reachable. Absent never means open: leave it unset rather than guessing.",
    controls: [
      {
        key: "eligibilityType",
        label: "Type",
        kind: "select",
        options: ["", "open", "members-only", "approval-required", "restricted"],
        info: "open needs nothing below; the other options should have a Note and/or URL explaining how to qualify.",
      },
      {
        key: "eligibilityNote",
        label: "Note",
        kind: "text",
        placeholder: "Members of the Rust Girona Discord",
        visibleWhen: {
          key: "eligibilityType",
          values: ["members-only", "approval-required", "restricted"],
        },
        info: "Plain-text explanation of who qualifies.",
      },
      {
        key: "eligibilityUrl",
        label: "URL",
        kind: "url",
        visibleWhen: {
          key: "eligibilityType",
          values: ["members-only", "approval-required", "restricted"],
        },
        info: "Where to read the full requirements or request access.",
      },
    ],
  },
  cfp: {
    label: "Call for proposals",
    note: "Only for events accepting talk/workshop submissions.",
    info: "The one OTE field with no equivalent in ICS, RSS or plain schema.org — it exists because \"which conferences are still accepting proposals\" is a question only the organizer can answer today.",
    controls: [
      {
        key: "cfpUrl",
        label: "URL",
        kind: "url",
        size: "full",
        info: "Where speakers submit a proposal.",
      },
      {
        key: "cfpOpensAt",
        label: "Opens at",
        kind: "instant",
        size: "l",
        info: "When submissions start being accepted.",
      },
      {
        key: "cfpClosesAt",
        label: "Closes at",
        kind: "instant",
        size: "l",
        info: "Submission deadline — after this, cfpUrl should stop accepting new ones.",
      },
      {
        key: "cfpCoversTravel",
        label: "Covers travel",
        kind: "checkbox",
        info: "Whether accepted speakers get their travel costs covered.",
      },
      {
        key: "cfpCoversAccommodation",
        label: "Covers accommodation",
        kind: "checkbox",
        info: "Whether accepted speakers get lodging covered.",
      },
    ],
  },
  partOf: {
    label: "Part of (series)",
    note: "Links this occurrence to a recurring series or multi-part event.",
    info: "A reference to the series, not a recurrence rule — OTE doesn't generate dates. A monthly meetup gets one event file per month, and each one points here at the same series id.",
    controls: [
      {
        key: "partOfId",
        label: "Series id (URL)",
        kind: "url",
        info: "The series' own id — the same value repeated across every occurrence, so consumers can group them.",
      },
      {
        key: "partOfName",
        label: "Name",
        kind: "text",
        info: "The series' name, e.g. \"Rust Girona Meetup\" for the occurrence \"Rust Girona Meetup #12\" — not this occurrence's own name.",
      },
      {
        key: "partOfUrl",
        label: "URL",
        kind: "url",
        info: "A page describing the series as a whole, not this specific occurrence.",
      },
      {
        key: "partOfType",
        label: "Type",
        kind: "select",
        options: ["", "series", "multipart"],
        info: "series for a recurring event (a monthly meetup); multipart for one event split across sessions (a multi-day workshop).",
      },
    ],
  },
  source: {
    label: "Source (provenance)",
    note: "Only when the event was imported from elsewhere.",
    info: "Where THIS DATA came from — required when the event was imported or aggregated, skipped when the organizer is describing their own event (they're already the source).",
    controls: [
      {
        key: "sourceName",
        label: "Name",
        kind: "text",
        size: "l",
        info: "Where this data was imported from — a platform name (\"Meetup\") or organization.",
      },
      {
        key: "sourceUrl",
        label: "URL",
        kind: "url",
        size: "l",
        info: "The exact page or feed this event's data was read from.",
      },
      {
        key: "sourceLicense",
        label: "License",
        kind: "text",
        size: "s",
        info: "The license the SOURCE data was published under, if stated — not this file's own license (see License above).",
      },
      {
        key: "sourceRetrievedAt",
        label: "Retrieved at",
        kind: "instant",
        size: "l",
        info: "When this data was fetched — set automatically by the import flow; edit only if importing by hand.",
      },
    ],
  },
  updatedAt: {
    label: "Updated at",
    note: "Instant the event's data last changed (ISO-8601 with offset).",
    info: "Not when the EVENT happens or moves (that's Start/End changing) — when this file's DATA last changed, so a consumer can sync only what's new. Leave empty rather than guessing; absent means unknown, not \"never changed\".",
    controls: [{ key: "updatedAt", label: "", kind: "instant" }],
  },
};

/** One row the chips control can show: a chip, or a suggestion in the dropdown. */
interface ChipView {
  /** Canonical value stored in the state string. */
  value: string;
  /** Primary display text (chip body and suggestion label). */
  label: string;
  /** Secondary muted text in the dropdown (a category), when known. */
  hint?: string;
}

/**
 * The autocomplete behind a chips control. Two implementations: a static one
 * for languages, and an async one for tags that fills in as the remote
 * vocabulary loads. Both keep the state value a comma-separated string.
 */
interface ChipVocabulary {
  /** Ranked suggestions for a query, excluding already-chosen values. */
  search(query: string, exclude: readonly string[]): ChipView[];
  /** How a stored value renders as a chip (falls back to the raw value). */
  chip(value: string): ChipView;
  /** Canonical value for a free-typed entry (Enter) — the raw text if none. */
  commitValue(raw: string): string;
  /** Resolves once late-loading data lands, so the control can re-render. */
  ready?: Promise<unknown>;
}

const languageVocabulary: ChipVocabulary = {
  search(query, exclude) {
    const q = query.trim().toLowerCase();
    return LANGUAGE_SUGGESTIONS.filter(
      (l) =>
        !exclude.includes(l.code) &&
        (q === "" || l.code.startsWith(q) || l.name.toLowerCase().includes(q)),
    )
      .slice(0, 6)
      .map((l) => ({ value: l.code, label: `${l.code} · ${l.name}` }));
  },
  chip(value) {
    const name = LANGUAGE_SUGGESTIONS.find((l) => l.code === value)?.name;
    return { value, label: name ? `${value} · ${name}` : value };
  },
  commitValue(raw) {
    const q = raw.trim().toLowerCase();
    const match = LANGUAGE_SUGGESTIONS.find(
      (l) => l.code === q || l.name.toLowerCase() === q,
    );
    return match ? match.code : raw.trim();
  },
};

// The tag vocabulary loads once, lazily, the first time a tags chips control is
// rendered — a couple of small JSON files, cached for the session.
let tagVocabEntries: readonly TagSuggestion[] = [];
let tagVocabReady: Promise<unknown> | null = null;

function ensureTagVocabulary(): Promise<unknown> {
  if (!tagVocabReady) {
    tagVocabReady = loadTagVocabulary().then((entries) => {
      tagVocabEntries = entries;
    });
  }
  return tagVocabReady;
}

const tagVocabulary: ChipVocabulary = {
  search(query, exclude) {
    return searchVocabulary(tagVocabEntries, query, exclude).map((s) => ({
      value: s.id,
      label: s.label,
      hint: s.category || undefined,
    }));
  },
  chip(value) {
    const entry = tagVocabEntries.find((t) => t.id === value);
    return { value, label: entry ? entry.label : value };
  },
  commitValue(raw) {
    const q = raw.trim().toLowerCase();
    const match = tagVocabEntries.find(
      (t) => t.id.toLowerCase() === q || t.label.toLowerCase() === q,
    );
    return match ? match.id : raw.trim();
  },
  get ready() {
    return ensureTagVocabulary();
  },
};

/**
 * Chips-with-autocomplete control (languages, tags): typing filters the
 * suggestions, picking one (or pressing Enter) adds a removable chip. Values
 * outside the vocabulary are accepted as-is. The state value stays a
 * comma-separated string.
 */
function renderChips(
  control: Control,
  state: FormState,
  onInput: (key: StateKey, value: string | boolean) => void,
): { element: HTMLElement; input: HTMLInputElement } {
  const vocab = control.vocab === "tags" ? tagVocabulary : languageVocabulary;

  const wrap = document.createElement("div");
  wrap.className = "chips";
  wrap.dataset.key = control.key;

  const list = document.createElement("div");
  list.className = "chips-list";
  const input = document.createElement("input");
  input.type = "text";
  input.id = nextId(control.key);
  input.className = "chips-input";
  input.placeholder = control.placeholder
    ? t(`control.${control.key}.placeholder`, control.placeholder)
    : t("ui.chips.placeholder", "Type to add…");
  input.autocomplete = "off";
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  const suggest = document.createElement("ul");
  suggest.id = nextId("listbox");
  suggest.className = "chips-suggest";
  suggest.setAttribute("role", "listbox");
  suggest.hidden = true;
  input.setAttribute("aria-controls", suggest.id);
  wrap.append(list, suggest);
  list.append(input);

  const nav = createListNav(input, suggest);
  let currentHits: ChipView[] = [];

  function setSuggestHidden(hidden: boolean): void {
    suggest.hidden = hidden;
    input.setAttribute("aria-expanded", String(!hidden));
  }

  let values = String(state[control.key])
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  function commit(): void {
    onInput(control.key, values.join(", "));
  }

  function renderList(): void {
    for (const chip of list.querySelectorAll(".chip")) chip.remove();
    for (const value of values) {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.append(vocab.chip(value).label);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "chip-remove";
      remove.setAttribute("aria-label", `${t("ui.remove", "Remove")} ${value}`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        values = values.filter((v) => v !== value);
        renderList();
        commit();
      });
      chip.append(remove);
      list.insertBefore(chip, input);
    }
  }

  function add(value: string): void {
    const clean = value.trim();
    if (!clean || values.includes(clean)) return;
    values.push(clean);
    input.value = "";
    setSuggestHidden(true);
    renderList();
    commit();
    if (control.vocab === "tags") recordTagUsed(clean);
  }

  function refreshSuggestions(): void {
    suggest.textContent = "";
    currentHits = vocab.search(input.value, values);
    nav.reset();
    setSuggestHidden(currentHits.length === 0);
    for (const hit of currentHits) {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      const button = document.createElement("button");
      button.type = "button";
      button.append(hit.label);
      if (hit.hint) {
        const cat = document.createElement("span");
        cat.className = "chips-cat";
        cat.textContent = hit.hint;
        button.append(cat);
      }
      // mousedown, not click: it must win over the input's blur
      button.addEventListener("mousedown", (e) => {
        e.preventDefault();
        add(hit.value);
      });
      li.append(button);
      suggest.append(li);
    }
  }

  input.addEventListener("focus", refreshSuggestions);
  input.addEventListener("input", refreshSuggestions);
  input.addEventListener("blur", () => {
    setTimeout(() => setSuggestHidden(true), 150);
  });
  input.addEventListener("keydown", (e) => {
    if (nav.handleKey(e)) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (nav.selectedIndex >= 0 && currentHits[nav.selectedIndex]) {
        add(currentHits[nav.selectedIndex].value);
      } else {
        add(vocab.commitValue(input.value));
      }
    } else if (e.key === "Backspace" && input.value === "" && values.length) {
      values = values.slice(0, -1);
      renderList();
      commit();
    }
  });

  // Tags load asynchronously: re-render chips (to gain their labels) and, if
  // the field is focused, the dropdown once the vocabulary arrives.
  vocab.ready?.then(() => {
    renderList();
    if (document.activeElement === input) refreshSuggestions();
  });

  if (control.vocab === "tags") {
    const exploreBtn = document.createElement("button");
    exploreBtn.type = "button";
    exploreBtn.className = "link-button chips-explore";
    exploreBtn.textContent = t("ui.tags.explore", "Explore tags");

    let dialog: HTMLDialogElement | null = null;
    // null = the category list; a category name = drilled into that
    // category's tags. Reset to the top level each time the dialog opens.
    let activeCategory: string | null = null;

    function tagChips(entries: readonly TagSuggestion[]): HTMLElement {
      const chipsWrap = document.createElement("div");
      chipsWrap.className = "tag-explorer-chips";
      for (const entry of entries) {
        const active = values.includes(entry.id);
        const chipBtn = document.createElement("button");
        chipBtn.type = "button";
        chipBtn.className = active ? "tag-explorer-tag active" : "tag-explorer-tag";
        chipBtn.textContent = entry.label;
        chipBtn.setAttribute("aria-pressed", String(active));
        chipBtn.addEventListener("click", () => {
          if (values.includes(entry.id)) {
            values = values.filter((v) => v !== entry.id);
            renderList();
            commit();
          } else {
            add(entry.id);
          }
          renderExplorerBody();
        });
        chipsWrap.append(chipBtn);
      }
      return chipsWrap;
    }

    function tagGroup(title: string, entries: readonly TagSuggestion[]): HTMLElement {
      const section = document.createElement("section");
      section.className = "tag-explorer-group";
      const h3 = document.createElement("h3");
      h3.textContent = title;
      section.append(h3, tagChips(entries));
      return section;
    }

    function categoryOf(entry: TagSuggestion): string {
      return entry.category || t("ui.tags.otherCategory", "Other");
    }

    function groupByCategory(): Map<string, TagSuggestion[]> {
      const byCategory = new Map<string, TagSuggestion[]>();
      for (const entry of tagVocabEntries) {
        const cat = categoryOf(entry);
        const list = byCategory.get(cat) ?? [];
        list.push(entry);
        byCategory.set(cat, list);
      }
      return byCategory;
    }

    /** Top level: one clickable card per category, not every tag at once. */
    function renderCategoryList(): HTMLElement {
      const section = document.createElement("section");
      section.className = "tag-explorer-group";
      const h3 = document.createElement("h3");
      h3.textContent = t("ui.tags.browseByCategory", "Browse by category");
      const grid = document.createElement("div");
      grid.className = "tag-explorer-category-grid";
      const byCategory = [...groupByCategory()].sort((a, b) => a[0].localeCompare(b[0]));
      for (const [cat, entries] of byCategory) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tag-explorer-category";
        const name = document.createElement("span");
        name.textContent = cat;
        const count = document.createElement("span");
        count.className = "tag-explorer-category-count";
        count.textContent = String(entries.length);
        btn.append(name, count);
        btn.addEventListener("click", () => {
          activeCategory = cat;
          renderExplorerBody();
        });
        grid.append(btn);
      }
      section.append(h3, grid);
      return section;
    }

    /** Drilled into one category: its tags, plus a way back to the list. */
    function renderCategoryDrilldown(cat: string): HTMLElement {
      const section = document.createElement("section");
      section.className = "tag-explorer-group";
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "tag-explorer-back";
      backBtn.textContent = "← " + t("ui.tags.backToCategories", "All categories");
      backBtn.addEventListener("click", () => {
        activeCategory = null;
        renderExplorerBody();
      });
      const h3 = document.createElement("h3");
      h3.textContent = cat;
      const entries = tagVocabEntries.filter((e) => categoryOf(e) === cat);
      section.append(backBtn, h3, tagChips(entries));
      return section;
    }

    function renderExplorerBody(): void {
      const body = dialog?.querySelector<HTMLElement>(".tag-explorer-body");
      if (!body) return;
      body.textContent = "";
      if (tagVocabEntries.length === 0) {
        const p = document.createElement("p");
        p.className = "hint";
        p.textContent = t("ui.tags.unavailable", "Tags aren't available right now.");
        body.append(p);
        return;
      }
      // Same-category-as-what's-already-picked, not yet picked — a light
      // nudge toward filling out a topic, not a hard recommendation engine.
      const activeCategories = new Set(
        values
          .map((v) => tagVocabEntries.find((e) => e.id === v)?.category)
          .filter((c): c is string => !!c),
      );
      if (activeCategories.size > 0) {
        const suggested = tagVocabEntries.filter(
          (e) => activeCategories.has(e.category) && !values.includes(e.id),
        );
        if (suggested.length > 0) {
          body.append(tagGroup(t("ui.tags.suggestedForYou", "Suggested for you"), suggested.slice(0, 12)));
        }
      }
      // Tags used on past events (any repo, any session, from localStorage) —
      // a shortcut for organizers who reuse the same handful of topics.
      const recent = getRecentTags()
        .filter((id) => !values.includes(id))
        .map((id) => tagVocabEntries.find((e) => e.id === id))
        .filter((e): e is TagSuggestion => !!e);
      if (recent.length > 0) {
        body.append(tagGroup(t("ui.tags.recentlyUsed", "Recently used"), recent));
      }
      body.append(activeCategory === null ? renderCategoryList() : renderCategoryDrilldown(activeCategory));
    }

    exploreBtn.addEventListener("click", async () => {
      await ensureTagVocabulary();
      if (!dialog) {
        dialog = document.createElement("dialog");
        dialog.className = "tag-explorer";
        const h2 = document.createElement("h2");
        h2.id = nextId("tag-explorer-title");
        h2.textContent = t("ui.tags.explorerTitle", "Explore tags");
        dialog.setAttribute("aria-labelledby", h2.id);
        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "dialog-close";
        closeBtn.setAttribute("aria-label", t("ui.close", "Close"));
        closeBtn.textContent = "×";
        closeBtn.addEventListener("click", () => dialog?.close());
        const body = document.createElement("div");
        body.className = "tag-explorer-body";
        dialog.append(h2, closeBtn, body);
        // Appended to `wrap`, not document.body: `showModal()` promotes it to
        // the top layer regardless of its DOM parent, and this way it's
        // discarded automatically along with the rest of the field's
        // subtree on the next structural re-render — no manual cleanup.
        wrap.append(dialog);
      }
      activeCategory = null;
      renderExplorerBody();
      dialog.showModal();
    });

    wrap.append(exploreBtn);
  }

  renderList();
  return { element: wrap, input };
}

/**
 * Type-to-filter combobox (timezone): free text commits live so the schema
 * judges it, focusing with an empty query drops down the full option list,
 * and typing narrows it (lib/timezones.ts ranks the hits).
 */
function renderCombobox(
  control: Control,
  state: FormState,
  onInput: (key: StateKey, value: string | boolean) => void,
): { element: HTMLElement; input: HTMLInputElement } {
  const wrap = document.createElement("div");
  wrap.className = "combo-field";

  const input = document.createElement("input");
  input.type = "text";
  input.id = nextId(control.key);
  input.dataset.key = control.key;
  input.autocomplete = "off";
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  if (control.placeholder) {
    input.placeholder = t(`control.${control.key}.placeholder`, control.placeholder);
  }
  const value = state[control.key];
  input.value = typeof value === "string" ? value : "";

  const suggest = document.createElement("ul");
  suggest.id = nextId("listbox");
  suggest.className = "combo-suggest";
  suggest.setAttribute("role", "listbox");
  suggest.hidden = true;
  input.setAttribute("aria-controls", suggest.id);
  wrap.append(input, suggest);

  const nav = createListNav(input, suggest);
  let currentHits: string[] = [];

  function setSuggestHidden(hidden: boolean): void {
    suggest.hidden = hidden;
    input.setAttribute("aria-expanded", String(!hidden));
  }

  function refreshSuggestions(query: string): void {
    suggest.textContent = "";
    currentHits = filterZones(control.options ?? [], query);
    nav.reset();
    setSuggestHidden(currentHits.length === 0);
    for (const hit of currentHits) {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = hit;
      // mousedown, not click: it must win over the input's blur
      button.addEventListener("mousedown", (e) => {
        e.preventDefault();
        input.value = hit;
        setSuggestHidden(true);
        onInput(control.key, hit);
      });
      li.append(button);
      suggest.append(li);
    }
  }

  // Focus browses the full list; only typing narrows it — a field already
  // holding a valid value would otherwise filter the dropdown down to itself.
  input.addEventListener("focus", () => refreshSuggestions(""));
  input.addEventListener("input", () => {
    refreshSuggestions(input.value);
    onInput(control.key, input.value);
  });
  input.addEventListener("blur", () => {
    setTimeout(() => setSuggestHidden(true), 150);
  });
  input.addEventListener("keydown", (e) => {
    if (nav.handleKey(e)) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      // No explicit highlight yet defaults to the first suggestion — same
      // as before arrow-key navigation existed.
      const chosen = currentHits[nav.selectedIndex >= 0 ? nav.selectedIndex : 0];
      if (!suggest.hidden && chosen !== undefined) {
        input.value = chosen;
        setSuggestHidden(true);
        onInput(control.key, chosen);
      }
    } else if (e.key === "Escape") {
      setSuggestHidden(true);
    }
  });

  return { element: wrap, input };
}

/**
 * ISO 4217 active-currency codes — the same enum @opentechevents/schema's
 * currency $def validates against (see packages/validate/src/
 * schemas.generated.ts). Copied rather than read from `eventSchema` at
 * runtime: that schema is an untyped AnySchemaObject, and reaching into its
 * $defs shape for a UI dropdown would tie this file to internal schema
 * structure that owes nothing to the editor. Re-copy if the list changes.
 */
const CURRENCY_CODES: readonly string[] = [
  "AED", "AFN", "ALL", "AMD", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM",
  "BBD", "BDT", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD",
  "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF",
  "CLP", "CNY", "COP", "COU", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK",
  "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL",
  "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HTG", "HUF",
  "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES",
  "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP",
  "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT",
  "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD",
  "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP",
  "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD",
  "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SOS", "SRD", "SSP", "STN",
  "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD",
  "TWD", "TZS", "UAH", "UGX", "USD", "USN", "UYI", "UYU", "UYW", "UZS",
  "VED", "VES", "VND", "VUV", "WST", "XAD", "XAF", "XAG", "XAU", "XBA",
  "XBB", "XBC", "XBD", "XCD", "XCG", "XDR", "XOF", "XPD", "XPF", "XPT",
  "XSU", "XTS", "XUA", "XXX", "YER", "ZAR", "ZMW", "ZWG",
];

interface RepeaterItemField {
  key: string;
  label: string;
  kind: "text" | "url" | "email" | "number" | "select" | "instant";
  options?: string[];
  placeholder?: string;
  /** Longer explanation shown as an ⓘ tooltip next to this sub-field's own label. */
  info?: string;
  /** Hidden unless the named sibling field's current value (within the same row) is one of `values`. */
  visibleWhen?: { key: string; values: readonly string[] };
  /** Row-width hint relative to its siblings — see Control.size. Omit for the default (m). */
  size?: "s" | "m" | "l" | "full";
}

interface RepeaterSpec {
  label: string;
  addLabel: string;
  note?: string;
  info?: string;
  itemFields: readonly RepeaterItemField[];
}

export type RepeaterKey = "organizers" | "image" | "offers";

const REPEATER_SPECS: Record<RepeaterKey, RepeaterSpec> = {
  organizers: {
    label: "Organizers",
    addLabel: "+ Add organizer",
    info: "Who runs the event. Declaring this REPLACES the feed's own organizers list for this event, it does not add to it.",
    itemFields: [
      {
        key: "name",
        label: "Name",
        kind: "text",
        size: "l",
        info: "As attendees would recognize it — the group or person's usual name.",
      },
      {
        key: "url",
        label: "URL",
        kind: "url",
        placeholder: "https://…",
        size: "l",
        info: "Website or profile for this organizer. Leave empty if they don't have one.",
      },
      {
        key: "email",
        label: "Email",
        kind: "email",
        placeholder: "hola@…",
        info: "Contact address for this organizer, only if it should be public.",
      },
      {
        key: "type",
        label: "Type",
        kind: "select",
        size: "s",
        options: ["", "organization", "person"],
        info: "Organization or individual person — lets consumers pick the right icon or label.",
      },
    ],
  },
  image: {
    label: "Images",
    addLabel: "+ Add image",
    note: "First image is the primary one — poster or cover.",
    info: "The rest of the list can be other crops of the primary image, or different images entirely — a consumer that can only show one always shows the first. Alt text describes what's IN the picture for anyone who can't see it, not the event itself.",
    itemFields: [
      { key: "url", label: "URL", kind: "url", placeholder: "https://…" },
      { key: "alt", label: "Alt text", kind: "text" },
    ],
  },
  offers: {
    label: "Offers (tickets)",
    addLabel: "+ Add offer",
    info: "One entry per ticket tier — a free event is a single offer with price 0. Absent means unknown, never free: price 0 is the only way to say \"free\".",
    itemFields: [
      {
        key: "name",
        label: "Name",
        kind: "text",
        placeholder: "General admission",
        size: "l",
        info: "What this tier is called — \"General admission\", \"Early bird\", \"Student\"…",
      },
      {
        key: "price",
        label: "Price",
        kind: "number",
        placeholder: "0",
        size: "s",
        info: "0 means free. Leave empty only when the price itself is unknown — that's not the same as free.",
      },
      {
        key: "currency",
        label: "Currency",
        kind: "select",
        size: "s",
        options: ["", ...CURRENCY_CODES],
        info: "ISO 4217 code — expected alongside a non-zero price.",
      },
      {
        key: "url",
        label: "URL",
        kind: "url",
        size: "full",
        info: "Where to buy or register for this specific tier.",
      },
      {
        key: "availability",
        label: "Availability",
        kind: "select",
        size: "s",
        options: ["", "in-stock", "sold-out"],
        info: "sold-out reveals a Waitlist URL below. Leave empty when unknown.",
      },
      {
        key: "waitlistUrl",
        label: "Waitlist URL",
        kind: "url",
        size: "l",
        visibleWhen: { key: "availability", values: ["sold-out"] },
        info: "Where interested people can join the waitlist once this tier sells out.",
      },
      {
        key: "opensAt",
        label: "Opens at",
        kind: "instant",
        size: "l",
        info: "When this tier becomes available for purchase — not the event's own start.",
      },
      {
        key: "closesAt",
        label: "Closes at",
        kind: "instant",
        size: "l",
        info: "When this tier stops being available (sale ends) — not the event's own end.",
      },
    ],
  },
};

/** Local `datetime-local` value ("YYYY-MM-DDTHH:mm") for a stored ISO instant, or "" if unset/unparseable. */
function isoToLocalDatetimeValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * A `datetime-local` value has no offset, so per the ECMAScript Date-string
 * spec it parses as the BROWSER's own local time — the fallback used when
 * the event has no (or an invalid) timezone of its own to interpret it in.
 */
function localDatetimeValueToIso(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toISOString();
}

/**
 * UTC instant for a wall-clock `datetime-local` value as read in the named
 * IANA `zone` — e.g. an organizer in Tokyo entering a CFP deadline for an
 * event whose own Timezone (When) is `America/New_York` gets the New York
 * offset, not their own. Falls back to the browser's own zone when `zone`
 * is empty or invalid (`Intl` throws on an unrecognized zone name).
 *
 * No offset table or extra dependency needed: guess the instant as if the
 * typed value were already UTC, ask `Intl.DateTimeFormat` what that guess
 * looks like when displayed in `zone`, and correct the guess by however far
 * off that display is from the original wall-clock value.
 */
function zonedDatetimeToIso(value: string, zone: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!m) return "";
  if (!zone) return localDatetimeValueToIso(value);
  try {
    const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const parts = dtf.formatToParts(new Date(guess));
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
    const zonedAsUtc = Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour"),
      get("minute"),
      get("second"),
    );
    return new Date(guess - (zonedAsUtc - guess)).toISOString();
  } catch {
    return localDatetimeValueToIso(value);
  }
}

/** Inverse of `zonedDatetimeToIso`: the `datetime-local` value an ISO instant displays as in `zone`. */
function isoToZonedDatetimeValue(iso: string, zone: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  if (!zone) return isoToLocalDatetimeValue(iso);
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const parts = dtf.formatToParts(d);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
    return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
  } catch {
    return isoToLocalDatetimeValue(iso);
  }
}

/** Native datetime-local picker for an `instant` field, with a live "what's actually stored" preview. */
function renderInstantInput(
  id: string,
  isoValue: string,
  onChange: (iso: string) => void,
  getZone: () => string,
): { element: HTMLElement; input: HTMLInputElement } {
  const wrap = document.createElement("div");
  wrap.className = "instant-field";
  const input = document.createElement("input");
  input.type = "datetime-local";
  input.id = id;
  input.value = isoToZonedDatetimeValue(isoValue, getZone());
  const preview = document.createElement("p");
  preview.className = "note instant-preview";
  const updatePreview = (iso: string) => {
    const zone = getZone() || t("ui.instant.yourDeviceTimezone", "your device's timezone");
    preview.textContent = iso
      ? t("ui.instant.preview", "UTC: {iso} (entered in {zone})")
          .replace("{iso}", iso)
          .replace("{zone}", zone)
      : "";
  };
  updatePreview(isoValue);
  // `getZone()` is re-read on every keystroke, not captured once at mount —
  // main.ts doesn't re-render the whole form when Timezone (When) changes,
  // so a closed-over string would go stale the moment the organizer edits
  // Timezone after this field is already on screen.
  input.addEventListener("input", () => {
    const iso = zonedDatetimeToIso(input.value, getZone());
    updatePreview(iso);
    onChange(iso);
  });
  wrap.append(input, preview);
  return { element: wrap, input };
}

function renderRepeaterItemControl(
  repeaterKey: RepeaterKey,
  field: RepeaterItemField,
  row: Record<string, string>,
  onChange: (key: string, value: string) => void,
  getZone: () => string,
  describedBy?: string,
): { element: HTMLElement; input: HTMLInputElement | HTMLSelectElement } {
  const i18nKey = `field.${repeaterKey}.${field.key}`;
  if (field.kind === "instant") {
    const rendered = renderInstantInput(
      nextId(field.key),
      row[field.key] ?? "",
      (iso) => onChange(field.key, iso),
      getZone,
    );
    if (describedBy) rendered.input.setAttribute("aria-describedby", describedBy);
    if (!field.label) return rendered;
    const wrap = document.createElement("div");
    if (field.size) wrap.classList.add(`size-${field.size}`);
    const label = document.createElement("label");
    label.htmlFor = rendered.input.id;
    label.textContent = t(`${i18nKey}.label`, field.label);
    if (field.info) label.append(renderInfoToggle(t(`${i18nKey}.info`, field.info)));
    wrap.append(label, rendered.element);
    return { element: wrap, input: rendered.input };
  }

  let input: HTMLInputElement | HTMLSelectElement;
  if (field.kind === "select") {
    input = document.createElement("select");
    for (const value of field.options ?? []) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value === "" ? t("ui.notSet", "(not set)") : value;
      input.append(option);
    }
  } else {
    input = document.createElement("input");
    input.type = field.kind;
  }
  input.id = nextId(field.key);
  if (describedBy) input.setAttribute("aria-describedby", describedBy);
  if (field.placeholder && "placeholder" in input) {
    input.placeholder = t(`${i18nKey}.placeholder`, field.placeholder);
  }
  input.value = row[field.key] ?? "";
  input.addEventListener("input", () => onChange(field.key, input.value));

  if (!field.label) return { element: input, input };
  const wrap = document.createElement("div");
  if (field.size) wrap.classList.add(`size-${field.size}`);
  const label = document.createElement("label");
  label.htmlFor = input.id;
  label.textContent = t(`${i18nKey}.label`, field.label);
  if (field.info) label.append(renderInfoToggle(t(`${i18nKey}.info`, field.info)));
  wrap.append(label, input);
  return { element: wrap, input };
}

/** A blank row for a repeater field, seeded with every itemField at "". */
function emptyRepeaterRow(key: RepeaterKey): Record<string, string> {
  const row: Record<string, unknown> = { translations: {} };
  for (const itemField of REPEATER_SPECS[key].itemFields) row[itemField.key] = "";
  return row as unknown as Record<string, string>;
}

/**
 * Single shared full-size viewer for every image preview thumbnail on the
 * page — created once, reused, since there's nothing row-specific about it
 * beyond whatever src/alt the most recent click passed in.
 */
let imageLightbox: HTMLDialogElement | null = null;

function openImageLightbox(src: string, alt: string): void {
  if (!imageLightbox) {
    imageLightbox = document.createElement("dialog");
    imageLightbox.className = "image-lightbox";
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "dialog-close";
    closeBtn.setAttribute("aria-label", t("ui.close", "Close"));
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => imageLightbox?.close());
    const img = document.createElement("img");
    imageLightbox.append(closeBtn, img);
    // A click that lands on the <dialog> element itself (not a descendant)
    // is a click on its own backdrop area/padding — treat it like Escape.
    imageLightbox.addEventListener("click", (e) => {
      if (e.target === imageLightbox) imageLightbox?.close();
    });
    document.body.append(imageLightbox);
  }
  const img = imageLightbox.querySelector("img")!;
  img.src = src;
  img.alt = alt;
  imageLightbox.showModal();
}

/**
 * Small clickable thumbnail next to an image row's URL field — hidden until
 * the URL has a value, kept live as it's typed/pasted, opens the full-size
 * lightbox on click. `getAlt` is read at click time (not captured once) so
 * it reflects whatever the row's own Alt text field currently holds.
 */
function renderImagePreview(urlInput: HTMLInputElement, getAlt: () => string): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "image-preview";
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "image-preview-trigger";
  trigger.setAttribute("aria-label", t("ui.image.viewFullSize", "View full size"));
  trigger.hidden = true;
  const img = document.createElement("img");
  img.alt = "";
  trigger.append(img);
  trigger.addEventListener("click", () => openImageLightbox(urlInput.value.trim(), getAlt()));
  wrap.append(trigger);

  function sync(): void {
    const url = urlInput.value.trim();
    trigger.hidden = !url;
    if (url) img.src = url;
    else img.removeAttribute("src");
  }
  urlInput.addEventListener("input", sync);
  sync();
  return wrap;
}

/**
 * Repeatable group of sub-fields (organizers/image/offers): each row is a
 * card with the field's itemFields as inputs, plus add/remove buttons.
 * Follows the same self-contained-subtree pattern renderChips uses above —
 * it keeps `items` in closure and re-renders only its own rows, committing
 * the array via onArrayChange. main.ts only calls renderForm again on
 * profile/event switches, not on every keystroke, so this control cannot
 * rely on being re-mounted to reflect its own edits.
 */
export function renderRepeaterField(
  fieldId: RepeaterKey,
  initial: readonly Record<string, string>[],
  onArrayChange: (key: RepeaterKey, items: Record<string, string>[]) => void,
  getZone: () => string,
): HTMLElement {
  const spec = REPEATER_SPECS[fieldId];
  const items: Record<string, string>[] = initial.map((row) => ({ ...row }));
  const specLabel = t(`field.${fieldId}.label`, spec.label);

  const field = document.createElement("div");
  field.className = "field repeater";
  field.dataset.fieldId = fieldId;
  field.setAttribute("role", "group");

  const label = document.createElement("label");
  label.id = nextId("label");
  field.setAttribute("aria-labelledby", label.id);
  label.textContent = specLabel;
  if (spec.info) label.append(renderInfoToggle(t(`field.${fieldId}.info`, spec.info)));
  field.append(label);
  appendNote(field, spec.note ? t(`field.${fieldId}.note`, spec.note) : undefined);

  const list = document.createElement("div");
  field.append(list);

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "repeater-add";
  addButton.textContent = t(`field.${fieldId}.addLabel`, spec.addLabel);
  field.append(addButton);
  const errorId = appendError(field);

  function commit(): void {
    onArrayChange(fieldId, items);
  }

  function renderRows(): void {
    list.textContent = "";
    items.forEach((row, index) => {
      const item = document.createElement("div");
      item.className = "repeater-item";
      item.setAttribute("role", "group");
      item.setAttribute("aria-label", `${specLabel} #${index + 1}`);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "repeater-remove";
      remove.setAttribute(
        "aria-label",
        `${t("ui.remove", "Remove")} ${specLabel} #${index + 1}`,
      );
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        items.splice(index, 1);
        renderRows();
        commit();
      });

      const fields = document.createElement("div");
      fields.className = "repeater-item-fields";
      const rendered = spec.itemFields.map((itemField) =>
        renderRepeaterItemControl(
          fieldId,
          itemField,
          row,
          (key, value) => {
            row[key] = value;
            commit();
          },
          getZone,
          errorId,
        ),
      );
      const byKey = new Map(spec.itemFields.map((f, i) => [f.key, rendered[i]]));
      spec.itemFields.forEach((f, i) => {
        if (!f.visibleWhen) return;
        const driver = byKey.get(f.visibleWhen.key);
        if (driver) linkVisibility(driver, rendered[i], f.visibleWhen.values);
      });
      for (const r of rendered) fields.append(r.element);

      if (fieldId === "image") {
        const urlInput = byKey.get("url")?.input;
        const altInput = byKey.get("alt")?.input;
        if (urlInput instanceof HTMLInputElement) {
          fields.append(renderImagePreview(urlInput, () => altInput?.value ?? ""));
        }
      }

      item.append(remove, fields);
      list.append(item);
    });
  }

  addButton.addEventListener("click", () => {
    items.push(emptyRepeaterRow(fieldId));
    renderRows();
    commit();
  });

  renderRows();
  return field;
}

/** Patch applied by the Translations section — the state keys it, and only it, writes. */
export type TranslationsPatch = Partial<
  Pick<
    FormState,
    | "translations"
    | "image"
    | "offers"
    | "eligibilityNoteTranslations"
    | "partOfNameTranslations"
  >
>;

/**
 * Every BCP 47 tag with at least one translation entry anywhere in the
 * event — the initial set of language cards to show. New, still-empty
 * languages are added on top of this by the section itself (see
 * `renderTranslationsSection`); this only recovers what a loaded event
 * already has.
 */
function translationLanguages(state: FormState): string[] {
  const langs = new Set<string>();
  for (const lang of Object.keys(state.translations)) langs.add(lang);
  for (const row of state.image) {
    for (const lang of Object.keys(row.translations)) langs.add(lang);
  }
  for (const row of state.offers) {
    for (const lang of Object.keys(row.translations)) langs.add(lang);
  }
  for (const lang of Object.keys(state.eligibilityNoteTranslations)) langs.add(lang);
  for (const lang of Object.keys(state.partOfNameTranslations)) langs.add(lang);
  return [...langs];
}

/** One translatable input inside a language card: the translation, with the original as a note. */
function renderTranslationSlot(
  label: string,
  original: string,
  value: string,
  multiline: boolean,
  onChange: (value: string) => void,
  describedBy?: string,
): HTMLElement {
  const wrap = document.createElement("div");
  const lbl = document.createElement("label");
  lbl.textContent = label;
  const input = multiline
    ? document.createElement("textarea")
    : document.createElement("input");
  input.id = nextId("translation");
  lbl.htmlFor = input.id;
  if (describedBy) input.setAttribute("aria-describedby", describedBy);
  if (multiline) (input as HTMLTextAreaElement).rows = 2;
  else (input as HTMLInputElement).type = "text";
  input.value = value;
  input.addEventListener("input", () => onChange(input.value));
  const note = document.createElement("p");
  note.className = "note translation-original";
  note.textContent = `${t("ui.translations.original", "Original")}: ${original}`;
  wrap.append(lbl, input, note);
  return wrap;
}

/**
 * "Type to add a language" input: a trimmed-down chips-input (see
 * renderChips above) that only fires `onAdd` on a deliberate commit —
 * Enter, or picking a suggestion — never on every keystroke, unlike
 * renderCombobox. Adding a language is an action, not a live field value.
 */
function renderLanguagePicker(
  excluded: () => readonly string[],
  onAdd: (lang: string) => void,
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "chips";
  const list = document.createElement("div");
  list.className = "chips-list";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "chips-input";
  input.setAttribute("aria-label", t("ui.translations.addLanguage", "Add a translation language"));
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  input.placeholder = t("ui.translations.addLanguagePlaceholder", "Type a language to add… (es, en…)");
  input.autocomplete = "off";
  const suggest = document.createElement("ul");
  suggest.id = nextId("listbox");
  suggest.className = "chips-suggest";
  suggest.setAttribute("role", "listbox");
  suggest.hidden = true;
  input.setAttribute("aria-controls", suggest.id);
  wrap.append(list, suggest);
  list.append(input);

  const nav = createListNav(input, suggest);
  let currentHits: { code: string; name: string }[] = [];

  function setSuggestHidden(hidden: boolean): void {
    suggest.hidden = hidden;
    input.setAttribute("aria-expanded", String(!hidden));
  }

  function commitValue(raw: string): string {
    const q = raw.trim().toLowerCase();
    const match = LANGUAGE_SUGGESTIONS.find(
      (l) => l.code === q || l.name.toLowerCase() === q,
    );
    return match ? match.code : raw.trim();
  }

  function add(value: string): void {
    const clean = value.trim();
    if (!clean) return;
    input.value = "";
    setSuggestHidden(true);
    onAdd(clean);
  }

  function refreshSuggestions(): void {
    suggest.textContent = "";
    const exclude = excluded().map((l) => l.toLowerCase());
    const q = input.value.trim().toLowerCase();
    currentHits = LANGUAGE_SUGGESTIONS.filter(
      (l) =>
        !exclude.includes(l.code) &&
        (q === "" || l.code.startsWith(q) || l.name.toLowerCase().includes(q)),
    ).slice(0, 6);
    nav.reset();
    setSuggestHidden(currentHits.length === 0);
    for (const hit of currentHits) {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      const button = document.createElement("button");
      button.type = "button";
      button.append(`${hit.code} · ${hit.name}`);
      // mousedown, not click: it must win over the input's blur
      button.addEventListener("mousedown", (e) => {
        e.preventDefault();
        add(hit.code);
      });
      li.append(button);
      suggest.append(li);
    }
  }

  input.addEventListener("focus", refreshSuggestions);
  input.addEventListener("input", refreshSuggestions);
  input.addEventListener("blur", () => {
    setTimeout(() => setSuggestHidden(true), 150);
  });
  input.addEventListener("keydown", (e) => {
    if (nav.handleKey(e)) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (nav.selectedIndex >= 0 && currentHits[nav.selectedIndex]) {
        add(currentHits[nav.selectedIndex].code);
      } else {
        add(commitValue(input.value));
      }
    } else if (e.key === "Escape") {
      setSuggestHidden(true);
    }
  });

  return wrap;
}

/**
 * Feed-level translations (title/description in other languages) — same
 * self-contained-subtree pattern as renderRepeaterField/renderChips above:
 * owns `translations` in closure, re-renders only its own list, commits the
 * whole map via onChange. Reuses renderLanguagePicker/renderTranslationSlot
 * as-is (both already state-shape-agnostic) rather than
 * renderTranslationsSection, which is tied to FormState's own event-only
 * slots (image alts, offer names…) that a feed doesn't have.
 */
export function renderFeedTranslations(
  initial: Record<string, { title: string; description: string }>,
  getOriginal: () => { title: string; description: string },
  getTextLanguage: () => string,
  onChange: (translations: Record<string, { title: string; description: string }>) => void,
): HTMLElement {
  let translations = { ...initial };

  const field = document.createElement("div");
  field.className = "field repeater";
  field.dataset.fieldId = "feedTranslations";
  field.setAttribute("role", "group");

  const label = document.createElement("label");
  label.id = nextId("label");
  field.setAttribute("aria-labelledby", label.id);
  label.textContent = t("section.translations", "Translations");
  label.append(
    renderInfoToggle(
      t(
        "ui.feedTranslations.info",
        "Optional versions of the feed's title and description in other languages.",
      ),
    ),
  );
  field.append(label);

  const list = document.createElement("div");
  field.append(list);

  function commit(): void {
    onChange(translations);
  }

  function renderList(): void {
    list.textContent = "";
    for (const lang of Object.keys(translations).sort()) {
      const card = document.createElement("div");
      card.className = "repeater-item";
      card.setAttribute("role", "group");

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "repeater-remove";
      remove.setAttribute(
        "aria-label",
        t("ui.translations.removeLanguage", "Remove {lang} translation").replace("{lang}", lang),
      );
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        const next = { ...translations };
        delete next[lang];
        translations = next;
        renderList();
        commit();
      });

      const heading = document.createElement("p");
      heading.id = nextId("heading");
      heading.className = "translation-lang";
      heading.textContent = lang;
      card.setAttribute("aria-labelledby", heading.id);

      const fields = document.createElement("div");
      fields.className = "repeater-item-fields";

      // Reads getOriginal()/translations[lang] fresh on every call rather
      // than closing over a snapshot — this card isn't remounted between
      // keystrokes, so editing Description after Title must not clobber
      // Title back to its value from when the card was first drawn.
      const original = getOriginal();
      const entry = translations[lang] ?? { title: "", description: "" };
      const setEntry = (patch: Partial<{ title: string; description: string }>) => {
        const current = translations[lang] ?? { title: "", description: "" };
        translations = { ...translations, [lang]: { ...current, ...patch } };
        commit();
      };

      fields.append(
        renderTranslationSlot(
          t("dialog.feedSettings.titleLabel", "Title"),
          original.title,
          entry.title,
          false,
          (v) => setEntry({ title: v }),
        ),
      );
      fields.append(
        renderTranslationSlot(
          t("dialog.feedSettings.descriptionLabel", "Description"),
          original.description,
          entry.description,
          true,
          (v) => setEntry({ description: v }),
        ),
      );

      card.append(heading, remove, fields);
      list.append(card);
    }
  }

  field.append(
    renderLanguagePicker(
      () => {
        const textLanguage = getTextLanguage();
        return [...(textLanguage ? [textLanguage] : []), ...Object.keys(translations)];
      },
      (lang) => {
        const textLanguage = getTextLanguage();
        const isTextLanguage =
          textLanguage !== "" && lang.toLowerCase() === textLanguage.toLowerCase();
        const exists = Object.keys(translations).some(
          (l) => l.toLowerCase() === lang.toLowerCase(),
        );
        if (isTextLanguage || exists) return;
        translations = { ...translations, [lang]: { title: "", description: "" } };
        renderList();
        commit();
      },
    ),
  );

  renderList();
  return field;
}

/**
 * One language's card: every currently-translatable slot (name/description,
 * per-image alt, per-offer name, eligibility note, part-of name — each only
 * once its original is filled in), with the original text shown as a note.
 * Committing any input clones just the state slice it belongs to and pushes
 * it up via onCommit — this widget never mutates `state` directly.
 */
function renderLanguageCard(
  lang: string,
  state: FormState,
  onCommit: (patch: TranslationsPatch) => void,
  onRemove: () => void,
  describedBy?: string,
): HTMLElement {
  const card = document.createElement("div");
  card.className = "repeater-item";
  card.setAttribute("role", "group");

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "repeater-remove";
  remove.setAttribute(
    "aria-label",
    t("ui.translations.removeLanguage", "Remove {lang} translation").replace("{lang}", lang),
  );
  remove.textContent = "×";
  remove.addEventListener("click", onRemove);

  const heading = document.createElement("p");
  heading.id = nextId("heading");
  card.setAttribute("aria-labelledby", heading.id);
  heading.className = "translation-lang";
  heading.textContent = lang;

  const fields = document.createElement("div");
  fields.className = "repeater-item-fields";

  const entry = state.translations[lang] ?? { name: "", description: "" };
  // Reads state.translations[lang] fresh on every call rather than closing
  // over `entry` — this card isn't remounted between keystrokes (see the
  // section-level comment above), so editing Description after Name must
  // not clobber Name back to its value from when the card was drawn.
  const setEntry = (patch: Partial<{ name: string; description: string }>) => {
    const current = state.translations[lang] ?? { name: "", description: "" };
    onCommit({
      translations: {
        ...state.translations,
        [lang]: { ...current, ...patch },
      },
    });
  };

  if (state.name) {
    fields.append(
      renderTranslationSlot(
        t("ui.translations.slot.name", "Name"),
        state.name,
        entry.name,
        false,
        (v) => setEntry({ name: v }),
        describedBy,
      ),
    );
  }
  if (state.description) {
    fields.append(
      renderTranslationSlot(
        t("ui.translations.slot.description", "Description"),
        state.description,
        entry.description,
        true,
        (v) => setEntry({ description: v }),
        describedBy,
      ),
    );
  }

  state.image.forEach((row, i) => {
    if (!row.alt) return;
    fields.append(
      renderTranslationSlot(
        t("ui.translations.slot.imageAlt", "Image {n} alt").replace("{n}", String(i + 1)),
        row.alt,
        row.translations[lang] ?? "",
        false,
        (v) => {
          onCommit({
            image: state.image.map((r, j) =>
              j === i ? { ...r, translations: { ...r.translations, [lang]: v } } : r,
            ),
          });
        },
        describedBy,
      ),
    );
  });

  state.offers.forEach((row, i) => {
    if (!row.name) return;
    fields.append(
      renderTranslationSlot(
        t("ui.translations.slot.offerName", "Offer {n} name").replace("{n}", String(i + 1)),
        row.name,
        row.translations[lang] ?? "",
        false,
        (v) => {
          onCommit({
            offers: state.offers.map((r, j) =>
              j === i ? { ...r, translations: { ...r.translations, [lang]: v } } : r,
            ),
          });
        },
        describedBy,
      ),
    );
  });

  if (state.eligibilityNote) {
    fields.append(
      renderTranslationSlot(
        t("ui.translations.slot.eligibilityNote", "Eligibility note"),
        state.eligibilityNote,
        state.eligibilityNoteTranslations[lang] ?? "",
        false,
        (v) =>
          onCommit({
            eligibilityNoteTranslations: {
              ...state.eligibilityNoteTranslations,
              [lang]: v,
            },
          }),
        describedBy,
      ),
    );
  }

  if (state.partOfName) {
    fields.append(
      renderTranslationSlot(
        t("ui.translations.slot.partOfName", "Part of name"),
        state.partOfName,
        state.partOfNameTranslations[lang] ?? "",
        false,
        (v) =>
          onCommit({
            partOfNameTranslations: { ...state.partOfNameTranslations, [lang]: v },
          }),
        describedBy,
      ),
    );
  }

  if (fields.children.length === 0) {
    const empty = document.createElement("p");
    empty.className = "note";
    empty.textContent = t(
      "ui.translations.empty",
      "Nothing to translate yet — fill in the event's name (or any image, offer, eligibility note or series name you want translated) first.",
    );
    fields.append(empty);
  }

  card.append(remove, heading, fields);
  return card;
}

/**
 * Translations section: a card per language, each showing only the slots
 * that currently have something to translate. Self-contained like
 * renderChips/renderRepeaterField — it owns `activeLangs` (which cards are
 * shown; seeded from whatever the loaded event already has, since an
 * empty just-added language has no data of its own to be discovered from),
 * commits edits via onCommit, and exposes refresh() so main.ts can ask it
 * to re-derive its slot list after an edit made elsewhere in the form (an
 * image alt, an offer name, eligibility note, part-of name) — renderForm
 * isn't re-run on every keystroke, so this can't rely on being remounted.
 */
function renderTranslationsSection(
  state: FormState,
  onInput: (key: StateKey, value: string | boolean) => void,
  onCommit: (patch: TranslationsPatch) => void,
): { element: HTMLElement; refresh: () => void } {
  const activeLangs = new Set(translationLanguages(state));

  const field = document.createElement("div");
  field.className = "field repeater";
  field.dataset.fieldId = "translations";
  field.setAttribute("role", "group");

  const label = document.createElement("label");
  label.id = nextId("label");
  field.setAttribute("aria-labelledby", label.id);
  label.textContent = t("section.translations", "Translations");
  label.append(
    renderInfoToggle(
      t(
        "ui.translations.info",
        "Optional versions of this event's text in other languages. Add a language, then fill in whichever fields below you want translated — the rest are fine left in the original language.",
      ),
    ),
  );
  field.append(label);

  // textLanguage lives here, not as its own section: it's a prerequisite
  // for everything else in this card (the note below refers to it).
  field.append(renderField("textLanguage", state, onInput));

  const langNote = document.createElement("p");
  langNote.className = "note";
  field.append(langNote);

  const list = document.createElement("div");
  field.append(list);
  const errorId = appendError(field);

  function renderLangNote(): void {
    langNote.hidden = state.textLanguage !== "";
    langNote.textContent = t(
      "ui.translations.setLanguageFirst",
      "Set a text language above first — translations describe what language everything else in this event is written in.",
    );
  }

  function renderCards(): void {
    list.textContent = "";
    for (const lang of [...activeLangs].sort()) {
      list.append(
        renderLanguageCard(
          lang,
          state,
          onCommit,
          () => {
            activeLangs.delete(lang);
            const patch: TranslationsPatch = {};
            if (lang in state.translations) {
              const translations = { ...state.translations };
              delete translations[lang];
              patch.translations = translations;
            }
            if (state.image.some((r) => lang in r.translations)) {
              patch.image = state.image.map((r) => {
                if (!(lang in r.translations)) return r;
                const translations = { ...r.translations };
                delete translations[lang];
                return { ...r, translations };
              });
            }
            if (state.offers.some((r) => lang in r.translations)) {
              patch.offers = state.offers.map((r) => {
                if (!(lang in r.translations)) return r;
                const translations = { ...r.translations };
                delete translations[lang];
                return { ...r, translations };
              });
            }
            if (lang in state.eligibilityNoteTranslations) {
              const m = { ...state.eligibilityNoteTranslations };
              delete m[lang];
              patch.eligibilityNoteTranslations = m;
            }
            if (lang in state.partOfNameTranslations) {
              const m = { ...state.partOfNameTranslations };
              delete m[lang];
              patch.partOfNameTranslations = m;
            }
            onCommit(patch);
            renderCards();
          },
          errorId,
        ),
      );
    }
    // Adding a translation needs something to translate FROM — gated on
    // textLanguage, not just explained by langNote above.
    if (state.textLanguage !== "") {
      list.append(
        renderLanguagePicker(
          () => [...(state.textLanguage ? [state.textLanguage] : []), ...activeLangs],
          (lang) => {
            const exists = [...activeLangs].some(
              (l) => l.toLowerCase() === lang.toLowerCase(),
            );
            const isTextLanguage =
              state.textLanguage !== "" &&
              lang.toLowerCase() === state.textLanguage.toLowerCase();
            if (exists || isTextLanguage) return;
            activeLangs.add(lang);
            renderCards();
          },
        ),
      );
    }
  }

  renderLangNote();
  renderCards();

  return {
    element: field,
    refresh(): void {
      renderLangNote();
      renderCards();
    },
  };
}

function renderControl(
  control: Control,
  state: FormState,
  onInput: (key: StateKey, value: string | boolean) => void,
): { element: HTMLElement; input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement } {
  if (control.kind === "chips") {
    return renderChips(control, state, onInput);
  }
  if (control.kind === "combobox") {
    return renderCombobox(control, state, onInput);
  }
  if (control.kind === "instant") {
    const current = state[control.key];
    const rendered = renderInstantInput(
      nextId(control.key),
      typeof current === "string" ? current : "",
      (iso) => onInput(control.key, iso),
      () => state.timezone,
    );
    rendered.input.dataset.key = control.key;
    if (!control.label) return rendered;
    const wrap = document.createElement("div");
    if (control.size) wrap.classList.add(`size-${control.size}`);
    const label = document.createElement("label");
    label.htmlFor = rendered.input.id;
    label.textContent = t(`control.${control.key}.label`, control.label);
    if (control.info) label.append(renderInfoToggle(t(`control.${control.key}.info`, control.info)));
    wrap.append(label, rendered.element);
    return { element: wrap, input: rendered.input };
  }
  let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  if (control.kind === "textarea") {
    input = document.createElement("textarea");
    input.rows = 3;
  } else if (control.kind === "select") {
    input = document.createElement("select");
    const options = [...(control.options ?? [])];
    // A loaded event may carry a value outside the list; keep it selectable.
    const current = state[control.key];
    if (typeof current === "string" && current && !options.includes(current)) {
      options.unshift(current);
    }
    for (const value of options) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value === "" ? t("ui.notSet", "(not set)") : value;
      input.append(option);
    }
  } else {
    input = document.createElement("input");
    input.type = control.kind === "checkbox" ? "checkbox" : control.kind;
  }
  input.id = nextId(control.key);
  input.dataset.key = control.key;
  if (control.placeholder && "placeholder" in input) {
    input.placeholder = t(`control.${control.key}.placeholder`, control.placeholder);
  }

  const value = state[control.key];
  if (input instanceof HTMLInputElement && input.type === "checkbox") {
    input.checked = value === true;
    input.addEventListener("input", () => onInput(control.key, input.checked));
  } else {
    input.value = typeof value === "string" ? value : "";
    input.addEventListener("input", () => onInput(control.key, input.value));
  }

  if (!control.label) return { element: input, input };
  const wrap = document.createElement("div");
  if (control.size) wrap.classList.add(`size-${control.size}`);
  const label = document.createElement("label");
  label.htmlFor = input.id;
  label.textContent = t(`control.${control.key}.label`, control.label);
  if (control.info) label.append(renderInfoToggle(t(`control.${control.key}.info`, control.info)));
  wrap.append(label, input);
  return { element: wrap, input };
}

function renderField(
  fieldId: string,
  state: FormState,
  onInput: (key: StateKey, value: string | boolean) => void,
): HTMLElement {
  const spec = FIELD_SPECS[fieldId];
  const field = document.createElement("div");
  field.className = spec.controls.length > 1 ? "field pair" : "field";
  field.dataset.fieldId = fieldId;
  const specLabel = t(`field.${fieldId}.label`, spec.label);

  const label = document.createElement("label");
  label.textContent = specLabel;
  if (spec.required) {
    const req = document.createElement("span");
    req.className = "req";
    req.textContent = " *";
    label.append(req);
  }
  if (spec.info) label.append(renderInfoToggle(t(`field.${fieldId}.info`, spec.info)));

  const controls = spec.controls.map((c) => renderControl(c, state, onInput));
  // Required applies to the field as a whole; for a pair (Date+Time, say)
  // only the first control actually has to be filled in — the schema never
  // requires the second, so marking both aria-required would overclaim.
  if (spec.required) controls[0]?.input.setAttribute("aria-required", "true");

  const byKey = new Map(spec.controls.map((c, i) => [c.key, controls[i]]));
  spec.controls.forEach((c, i) => {
    if (!c.visibleWhen) return;
    const driver = byKey.get(c.visibleWhen.key);
    if (driver) linkVisibility(driver, controls[i], c.visibleWhen.values);
  });

  if (field.classList.contains("pair")) {
    // label above, paired inputs side by side. The label describes the
    // GROUP, not one input, so it's associated via role="group" +
    // aria-labelledby rather than a (semantically incorrect) htmlFor —
    // each sub-control keeps its own <label for> from renderControl.
    label.id = nextId("label");
    const outer = document.createElement("div");
    outer.className = "field";
    outer.dataset.fieldId = fieldId;
    outer.setAttribute("role", "group");
    outer.setAttribute("aria-labelledby", label.id);
    delete field.dataset.fieldId;
    const row = document.createElement("div");
    row.className = "field pair";
    row.append(...controls.map((c) => c.element));
    let noteId: string | null;
    let errorId: string;
    if (fieldId === "geo") {
      // Map first (main.ts mounts Leaflet here), then the hint,
      // then the coordinate inputs the map keeps in sync.
      const slot = document.createElement("div");
      slot.dataset.role = "geo-map";
      outer.append(label, slot);
      noteId = appendNote(outer, spec.note ? t(`field.${fieldId}.note`, spec.note) : undefined);
      outer.append(row);
      errorId = appendError(outer);
      // The map is the primary way to set a position — typing raw decimal
      // degrees by hand is the rare case, so it isn't invited by default.
      addManualToggle(outer, controls, t("ui.enterCoordinatesManually", "Enter coordinates manually"));
    } else {
      outer.append(label, row);
      noteId = appendNote(outer, spec.note ? t(`field.${fieldId}.note`, spec.note) : undefined);
      errorId = appendError(outer);
    }
    const describedBy = describedByOf(noteId, errorId);
    if (describedBy) {
      for (const c of controls) c.input.setAttribute("aria-describedby", describedBy);
    }
    return outer;
  }

  label.htmlFor = controls[0]?.input.id ?? "";
  field.append(label, ...controls.map((c) => c.element));
  const noteId = appendNote(field, spec.note ? t(`field.${fieldId}.note`, spec.note) : undefined);
  const errorId = appendError(field);
  const describedBy = describedByOf(noteId, errorId);
  if (describedBy) controls[0]?.input.setAttribute("aria-describedby", describedBy);
  // Auto-suggested and rarely meant to be hand-edited — id's own tooltip
  // says as much ("never change it after publishing"). Reads as proposed
  // text, not an invitation to type, until Edit unlocks it.
  if (fieldId === "slug" || fieldId === "id") {
    addManualToggle(field, controls, t("ui.editSuggested", "Edit"));
  }
  return field;
}

/** Whether a field (FIELD_SPECS or repeater) already has something in it. */
function fieldHasData(id: string, state: FormState): boolean {
  switch (id) {
    case "organizers":
      return state.organizers.length > 0;
    case "image":
      return state.image.length > 0;
    case "eligibility":
      return !!(state.eligibilityType || state.eligibilityNote || state.eligibilityUrl);
    case "partOf":
      return !!(state.partOfId || state.partOfName || state.partOfUrl || state.partOfType);
    case "source":
      return !!(state.sourceName || state.sourceUrl || state.sourceLicense || state.sourceRetrievedAt);
    case "venue":
      return state.venue !== "" || state.geoLat !== "" || state.geoLon !== "";
    default: {
      const spec = FIELD_SPECS[id];
      return spec ? spec.controls.some((c) => state[c.key] !== "" && state[c.key] !== false) : false;
    }
  }
}

function fieldLabel(id: string): string {
  const fallback =
    id === "organizers" || id === "image"
      ? REPEATER_SPECS[id as RepeaterKey].label
      : FIELD_SPECS[id].label;
  return t(`field.${id}.label`, fallback);
}

/** Resets a FIELD_SPECS field's own state back to unset — used by a chip's "×". */
function clearField(
  id: string,
  onInput: (key: StateKey, value: string | boolean) => void,
): void {
  // venue and its map position are one field to the organizer; clearing one clears both.
  if (id === "venue") {
    onInput("geoLat", "");
    onInput("geoLon", "");
  }
  for (const c of FIELD_SPECS[id].controls) onInput(c.key, c.kind === "checkbox" ? false : "");
}

/**
 * Makes `controls` read-only (styled as plain text, not an input box — see
 * `.field input[readonly]` in styles.css) and appends a small toggle that
 * unlocks them for hand-editing. Used for values that already have a
 * correct answer most of the time — map-driven coordinates, auto-suggested
 * slug/id — so typing isn't the first thing invited.
 */
function addManualToggle(
  container: HTMLElement,
  controls: { input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement }[],
  toggleLabel: string,
): void {
  for (const c of controls) {
    if (c.input instanceof HTMLInputElement) c.input.readOnly = true;
  }
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "link-button";
  toggle.textContent = toggleLabel;
  toggle.addEventListener("click", () => {
    for (const c of controls) {
      if (c.input instanceof HTMLInputElement) c.input.readOnly = false;
    }
    controls[0]?.input.focus();
    toggle.remove();
  });
  container.append(toggle);
}

/** Wraps `inner` with a "×" button styled like a repeater row's, calling `onRemove` when clicked. */
function wrapRemovable(inner: HTMLElement, label: string, onRemove: () => void): HTMLElement {
  const block = document.createElement("div");
  block.className = "advanced-block";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "repeater-remove";
  remove.setAttribute("aria-label", `${t("ui.remove", "Remove")} ${label}`);
  remove.textContent = "×";
  remove.addEventListener("click", onRemove);
  block.append(inner, remove);
  return block;
}

/** Makes `dependentIds` visible only while the named driver field's current value is one of `values`. */
interface FieldDependency {
  driverId: string;
  values: readonly string[];
}

/**
 * A section made of chips: required fields always render, unremovable; the
 * rest start as "+ Add" buttons and become removable blocks once clicked
 * (or, for a loaded event, once they already have data). `recommendedIds`
 * get a visually distinct chip, sorted first — a nudge, not an auto-expand,
 * so the section's very first render never shows more than what's
 * required. `dependents` optionally ties some ids to another id in the same
 * section (e.g. Venue/Online URL to Attendance mode): while the driver is
 * active with a value outside `values`, the dependent's chip isn't offered
 * and an already-added dependent block hides (never clears) — same
 * never-lose-data precedent as `linkVisibility`. Self-contained like
 * renderRepeaterField/renderTranslationsSection: owns `active` in closure
 * and re-renders only its own subtree.
 */
function renderChippableSection(
  fieldIds: readonly string[],
  requiredIds: ReadonlySet<string>,
  recommendedIds: ReadonlySet<string>,
  state: FormState,
  onInput: (key: StateKey, value: string | boolean) => void,
  onArrayInput: (key: RepeaterKey, items: Record<string, string>[]) => void,
  dependents?: Record<string, FieldDependency>,
  onRebuilt?: () => void,
): HTMLElement {
  const active = new Set(
    fieldIds.filter((id) => requiredIds.has(id) || fieldHasData(id, state)),
  );
  const blockElements = new Map<string, HTMLElement>();

  const container = document.createElement("div");
  const blocksRoot = document.createElement("div");
  const picker = document.createElement("div");
  picker.className = "advanced-picker";
  container.append(blocksRoot, picker);

  function isApplicable(id: string): boolean {
    const dep = dependents?.[id];
    if (!dep) return true;
    if (!active.has(dep.driverId)) return true; // driver not added: unconstrained
    const driverValue = state[dep.driverId as StateKey];
    // Empty means "unknown" (e.g. attendanceMode's own note: never assume
    // in-person) — unconstrained, same as the driver not being added yet.
    if (driverValue === "") return true;
    return typeof driverValue === "string" && dep.values.includes(driverValue);
  }

  function applyDependentVisibility(): void {
    for (const [id, el] of blockElements) el.hidden = !isApplicable(id);
  }

  function wireDependencyDrivers(): void {
    if (!dependents) return;
    for (const driverId of new Set(Object.values(dependents).map((d) => d.driverId))) {
      const driverInput = blockElements
        .get(driverId)
        ?.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-key="${driverId}"]`);
      driverInput?.addEventListener("input", () => {
        applyDependentVisibility();
        renderPicker();
      });
    }
  }

  function renderOne(id: string): HTMLElement {
    let inner: HTMLElement;
    if (id === "organizers" || id === "image") {
      inner = renderRepeaterField(
        id,
        state[id] as unknown as Record<string, string>[],
        onArrayInput,
        () => state.timezone,
      );
    } else if (id === "venue") {
      inner = renderField("venue", state, onInput);
      inner.append(renderField("geo", state, onInput));
    } else {
      inner = renderField(id, state, onInput);
    }
    if (requiredIds.has(id)) return inner;

    return wrapRemovable(inner, fieldLabel(id), () => {
      active.delete(id);
      if (id === "organizers" || id === "image") onArrayInput(id as RepeaterKey, []);
      else clearField(id, onInput);
      renderBlocks();
      renderPicker();
    });
  }

  function renderBlocks(): void {
    blocksRoot.textContent = "";
    blockElements.clear();
    for (const id of fieldIds) {
      if (!active.has(id)) continue;
      const el = renderOne(id);
      blockElements.set(id, el);
      blocksRoot.append(el);
    }
    applyDependentVisibility();
    wireDependencyDrivers();
    onRebuilt?.();
  }

  function renderPicker(): void {
    picker.textContent = "";
    const notActive = fieldIds.filter((id) => !active.has(id) && isApplicable(id));
    const ordered = [
      ...notActive.filter((id) => recommendedIds.has(id)),
      ...notActive.filter((id) => !recommendedIds.has(id)),
    ];
    for (const id of ordered) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = recommendedIds.has(id) ? "repeater-add recommended" : "repeater-add";
      button.textContent = `+ ${fieldLabel(id)}`;
      button.addEventListener("click", () => {
        active.add(id);
        // A repeater chip only ever appears while its array is empty (see
        // `active`'s seeding above) — seed one row so the organizer can
        // start typing immediately instead of finding an empty block with
        // its own separate "+ Add" button to click first.
        if (id === "organizers" || id === "image") {
          onArrayInput(id as RepeaterKey, [emptyRepeaterRow(id as RepeaterKey)]);
        }
        renderBlocks();
        renderPicker();
      });
      picker.append(button);
    }
  }

  renderBlocks();
  renderPicker();
  return container;
}

/** Appends the note, if any, and returns its id for aria-describedby — null when there's no note. */
function appendNote(field: HTMLElement, note?: string): string | null {
  if (!note) return null;
  const id = nextId("note");
  const p = document.createElement("p");
  p.id = id;
  p.className = "note";
  p.textContent = note;
  field.append(p);
  return id;
}

/** Appends the (initially empty) error slot and returns its id for aria-describedby. */
function appendError(field: HTMLElement): string {
  const id = nextId("error");
  const error = document.createElement("p");
  error.id = id;
  error.className = "field-error";
  field.append(error);
  return id;
}

/** Joins note/error ids into a value for aria-describedby, or undefined when neither exists. */
function describedByOf(
  noteId: string | null,
  errorId: string,
): string | undefined {
  return noteId ? `${noteId} ${errorId}` : errorId;
}

/**
 * Renders the form for the resolved profile into `root`. `extraFields` are
 * fields outside the profile that the loaded event already uses — data is
 * never dropped in edit mode.
 */
export function renderForm(
  root: HTMLElement,
  profile: ResolvedProfile,
  state: FormState,
  extraFields: ReadonlySet<string>,
  onInput: (key: StateKey, value: string | boolean) => void,
  onArrayInput: (key: RepeaterKey, items: Record<string, string>[]) => void,
  onTranslationsCommit: (patch: TranslationsPatch) => void,
  /** Called whenever Venue's block (re)appears or disappears — main.ts uses it to (re)mount the geo map, since it can no longer assume the map slot exists right after renderForm returns. */
  onWhereRebuilt: () => void,
): {
  refreshTranslations: () => void;
  sections: { id: SectionId; title: string }[];
} {
  root.textContent = "";
  let refreshTranslations: () => void = () => {};
  const renderedSections: { id: SectionId; title: string }[] = [];

  // Deliberately small — a nudge for the picker's chip styling, not an
  // auto-expand. Every other non-required field starts as a plain chip.
  const RECOMMENDED: Partial<Record<SectionId, ReadonlySet<string>>> = {
    what: new Set(["description"]),
    where: new Set(["attendanceMode"]),
  };
  // Venue/Online URL only make sense for one attendance mode each; while
  // Attendance mode is set to something that rules one out, its chip isn't
  // offered and an already-added block hides (never clears) — see
  // renderChippableSection's `dependents` param.
  const WHERE_DEPENDENTS: Record<string, FieldDependency> = {
    venue: { driverId: "attendanceMode", values: ["in-person", "hybrid"] },
    onlineUrl: { driverId: "attendanceMode", values: ["online", "hybrid"] },
  };
  const WHEN_BUNDLED = ["allDay", "startDate", "endDate", "timezone"];

  for (const section of SECTIONS) {
    const fieldIds = FIELD_REGISTRY.filter(
      (f) =>
        f.section === section &&
        (profile.fields.has(f.id) || extraFields.has(f.id)),
    ).map((f) => f.id);
    if (fieldIds.length === 0) continue;
    const sectionTitle = t(`section.${section}`, SECTION_TITLES[section]);
    renderedSections.push({ id: section, title: sectionTitle });

    const details = document.createElement("details");
    details.id = `section-${section}`;
    details.open = !profile.collapsedSections.has(section);
    const summary = document.createElement("summary");
    summary.textContent = sectionTitle;
    details.append(summary);

    const requiredIds = new Set(
      FIELD_REGISTRY.filter((f) => f.section === section && f.required).map((f) => f.id),
    );

    if (section === "tickets") {
      // A single repeater field — the section itself starting closed
      // already gives the "hidden until wanted" effect, and each row has
      // its own "×" already, so removing every offer needs no extra
      // block-level control (unlike cfp below, which has no rows of its
      // own to remove).
      details.append(
        renderRepeaterField(
          "offers",
          state.offers as unknown as Record<string, string>[],
          onArrayInput,
          () => state.timezone,
        ),
      );
    } else if (section === "cfp") {
      const cfpRoot = document.createElement("div");
      const renderCfp = () => {
        cfpRoot.textContent = "";
        cfpRoot.append(
          wrapRemovable(
            renderField("cfp", state, onInput),
            t("field.cfp.label", FIELD_SPECS.cfp.label),
            () => {
              clearField("cfp", onInput);
              renderCfp();
            },
          ),
        );
      };
      renderCfp();
      details.append(cfpRoot);
    } else if (section === "translations") {
      // translations reads/writes several state slices at once and has no
      // single FormState key of its own — its own bespoke renderer.
      const translationsSection = renderTranslationsSection(state, onInput, onTranslationsCommit);
      refreshTranslations = translationsSection.refresh;
      details.append(translationsSection.element);
    } else if (section === "when") {
      // allDay/startDate/endDate/timezone are one structural unit (allDay
      // changes how start/end render) — never separately chippable.
      for (const id of WHEN_BUNDLED) {
        if (fieldIds.includes(id)) details.append(renderField(id, state, onInput));
      }
      const rest = fieldIds.filter((id) => !WHEN_BUNDLED.includes(id));
      details.append(
        renderChippableSection(rest, requiredIds, new Set(), state, onInput, onArrayInput),
      );
    } else if (section === "where") {
      // Venue and its map position are one place, two OTE fields — geo is
      // rendered nested under venue inside renderChippableSection, not as
      // its own chip.
      const chippable = fieldIds.filter((id) => id !== "geo");
      details.append(
        renderChippableSection(
          chippable,
          requiredIds,
          RECOMMENDED.where ?? new Set(),
          state,
          onInput,
          onArrayInput,
          WHERE_DEPENDENTS,
          onWhereRebuilt,
        ),
      );
    } else {
      // what, who, metadata
      details.append(
        renderChippableSection(
          fieldIds,
          requiredIds,
          RECOMMENDED[section] ?? new Set(),
          state,
          onInput,
          onArrayInput,
        ),
      );
    }
    root.append(details);
  }
  return { refreshTranslations, sections: renderedSections };
}

/** Writes per-field validation errors under their inputs. */
export function updateErrors(
  root: HTMLElement,
  fieldErrors: ReadonlyMap<string, string[]>,
): void {
  for (const field of root.querySelectorAll<HTMLElement>("[data-field-id]")) {
    const errors = fieldErrors.get(field.dataset.fieldId ?? "");
    const slot = field.querySelector<HTMLElement>(".field-error");
    if (slot) slot.textContent = errors ? errors.join("; ") : "";
    field.classList.toggle("has-error", (errors?.length ?? 0) > 0);
  }
}

/**
 * Marks the fields an ICS import did not carry (DESIGN.md: the import flags
 * the loss field by field, it never hides it). Idempotent: re-applying after
 * a re-render restores the marks; a field outside `missing` loses its mark.
 */
export function markImportGaps(
  root: HTMLElement,
  missing: ReadonlySet<string>,
): void {
  for (const field of root.querySelectorAll<HTMLElement>("[data-field-id]")) {
    const gap = missing.has(field.dataset.fieldId ?? "");
    field.classList.toggle("import-gap", gap);
    const tag = field.querySelector<HTMLElement>(".import-gap-tag");
    if (gap && !tag) {
      const p = document.createElement("p");
      p.className = "import-gap-tag";
      p.textContent = t(
        "ui.importGap",
        "Not in the imported ICS — fill in by hand if known.",
      );
      const slot = field.querySelector(".field-error");
      if (slot) slot.before(p);
      else field.append(p);
    } else if (!gap && tag) {
      tag.remove();
    }
  }
}

/** Hides (not just disables) the time inputs when "all-day" is toggled — a time genuinely doesn't apply, not just "currently unavailable". */
export function setAllDay(root: HTMLElement, allDay: boolean): void {
  for (const key of ["startTime", "endTime"]) {
    const input = root.querySelector<HTMLInputElement>(
      `input[data-key="${key}"]`,
    );
    if (!input) continue;
    input.disabled = allDay;
    const wrap = input.closest<HTMLElement>("div");
    if (wrap) wrap.hidden = allDay;
  }
}
