/**
 * DOM rendering of the event form. No business logic here: which fields to
 * show comes from lib/presets.ts, values live in lib/types.ts FormState.
 * Tested by hand (the lib/ modules carry the vitest coverage).
 */

import type { ResolvedProfile, SectionId } from "../lib/presets.js";
import { FIELD_REGISTRY, SECTIONS } from "../lib/presets.js";
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

/** The ⓘ next to a label: click/tap to reveal `text`, click elsewhere or Escape to close. */
function renderInfoToggle(text: string): HTMLElement {
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
    | "combobox";
  options?: string[];
  placeholder?: string;
  /** Autocomplete source for a "chips" control. Defaults to "languages". */
  vocab?: "languages" | "tags";
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
const LANGUAGE_SUGGESTIONS: ReadonlyArray<{ code: string; name: string }> = [
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
  basics: "Basics",
  when: "When",
  where: "Where",
  identity: "File & id",
  advanced: "Advanced",
  translations: "Translations",
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
      },
      {
        key: "eligibilityNote",
        label: "Note",
        kind: "text",
        placeholder: "Members of the Rust Girona Discord",
      },
      { key: "eligibilityUrl", label: "URL", kind: "url" },
    ],
  },
  cfp: {
    label: "Call for proposals",
    note: "Only for events accepting talk/workshop submissions.",
    info: "The one OTE field with no equivalent in ICS, RSS or plain schema.org — it exists because \"which conferences are still accepting proposals\" is a question only the organizer can answer today.",
    controls: [
      { key: "cfpUrl", label: "URL", kind: "url" },
      {
        key: "cfpOpensAt",
        label: "Opens at",
        kind: "text",
        placeholder: "2026-05-01T00:00:00+02:00",
      },
      {
        key: "cfpClosesAt",
        label: "Closes at",
        kind: "text",
        placeholder: "2026-07-15T23:59:59+02:00",
      },
      { key: "cfpCoversTravel", label: "Covers travel", kind: "checkbox" },
      {
        key: "cfpCoversAccommodation",
        label: "Covers accommodation",
        kind: "checkbox",
      },
    ],
  },
  partOf: {
    label: "Part of (series)",
    note: "Links this occurrence to a recurring series or multi-part event.",
    info: "A reference to the series, not a recurrence rule — OTE doesn't generate dates. A monthly meetup gets one event file per month, and each one points here at the same series id.",
    controls: [
      { key: "partOfId", label: "Series id (URL)", kind: "url" },
      { key: "partOfName", label: "Name", kind: "text" },
      { key: "partOfUrl", label: "URL", kind: "url" },
      {
        key: "partOfType",
        label: "Type",
        kind: "select",
        options: ["", "series", "multipart"],
      },
    ],
  },
  source: {
    label: "Source (provenance)",
    note: "Only when the event was imported from elsewhere.",
    info: "Where THIS DATA came from — required when the event was imported or aggregated, skipped when the organizer is describing their own event (they're already the source).",
    controls: [
      { key: "sourceName", label: "Name", kind: "text" },
      { key: "sourceUrl", label: "URL", kind: "url" },
      { key: "sourceLicense", label: "License", kind: "text" },
      {
        key: "sourceRetrievedAt",
        label: "Retrieved at",
        kind: "text",
        placeholder: "2026-06-01T05:00:00Z",
      },
    ],
  },
  updatedAt: {
    label: "Updated at",
    note: "Instant the event's data last changed (ISO-8601 with offset).",
    info: "Not when the EVENT happens or moves (that's Start/End changing) — when this file's DATA last changed, so a consumer can sync only what's new. Leave empty rather than guessing; absent means unknown, not \"never changed\".",
    controls: [
      {
        key: "updatedAt",
        label: "",
        kind: "text",
        placeholder: "2026-06-10T18:00:00Z",
      },
    ],
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
  input.placeholder = control.placeholder ?? "Type to add…";
  input.autocomplete = "off";
  const suggest = document.createElement("ul");
  suggest.className = "chips-suggest";
  suggest.hidden = true;
  wrap.append(list, suggest);
  list.append(input);

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
      remove.setAttribute("aria-label", `Remove ${value}`);
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
    suggest.hidden = true;
    renderList();
    commit();
  }

  function refreshSuggestions(): void {
    suggest.textContent = "";
    const hits = vocab.search(input.value, values);
    suggest.hidden = hits.length === 0;
    for (const hit of hits) {
      const li = document.createElement("li");
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
    setTimeout(() => (suggest.hidden = true), 150);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add(vocab.commitValue(input.value));
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
  if (control.placeholder) input.placeholder = control.placeholder;
  const value = state[control.key];
  input.value = typeof value === "string" ? value : "";

  const suggest = document.createElement("ul");
  suggest.className = "combo-suggest";
  suggest.hidden = true;
  wrap.append(input, suggest);

  function refreshSuggestions(query: string): void {
    suggest.textContent = "";
    const hits = filterZones(control.options ?? [], query);
    suggest.hidden = hits.length === 0;
    for (const hit of hits) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = hit;
      // mousedown, not click: it must win over the input's blur
      button.addEventListener("mousedown", (e) => {
        e.preventDefault();
        input.value = hit;
        suggest.hidden = true;
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
    setTimeout(() => (suggest.hidden = true), 150);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = suggest.querySelector("button");
      if (!suggest.hidden && first) {
        input.value = first.textContent ?? "";
        suggest.hidden = true;
        onInput(control.key, input.value);
      }
    } else if (e.key === "Escape") {
      suggest.hidden = true;
    }
  });

  return { element: wrap, input };
}

interface RepeaterItemField {
  key: string;
  label: string;
  kind: "text" | "url" | "email" | "number" | "select";
  options?: string[];
  placeholder?: string;
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
      { key: "name", label: "Name", kind: "text" },
      { key: "url", label: "URL", kind: "url", placeholder: "https://…" },
      { key: "email", label: "Email", kind: "email", placeholder: "hola@…" },
      {
        key: "type",
        label: "Type",
        kind: "select",
        options: ["", "organization", "person"],
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
      },
      { key: "price", label: "Price", kind: "number", placeholder: "0" },
      { key: "currency", label: "Currency", kind: "text", placeholder: "EUR" },
      { key: "url", label: "URL", kind: "url" },
      {
        key: "availability",
        label: "Availability",
        kind: "select",
        options: ["", "in-stock", "sold-out"],
      },
      { key: "waitlistUrl", label: "Waitlist URL", kind: "url" },
      {
        key: "opensAt",
        label: "Opens at",
        kind: "text",
        placeholder: "2026-05-01T00:00:00+02:00",
      },
      {
        key: "closesAt",
        label: "Closes at",
        kind: "text",
        placeholder: "2026-07-15T23:59:59+02:00",
      },
    ],
  },
};

function renderRepeaterItemControl(
  field: RepeaterItemField,
  row: Record<string, string>,
  onChange: (key: string, value: string) => void,
  describedBy?: string,
): HTMLElement {
  let input: HTMLInputElement | HTMLSelectElement;
  if (field.kind === "select") {
    input = document.createElement("select");
    for (const value of field.options ?? []) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value === "" ? "(not set)" : value;
      input.append(option);
    }
  } else {
    input = document.createElement("input");
    input.type = field.kind;
  }
  input.id = nextId(field.key);
  if (describedBy) input.setAttribute("aria-describedby", describedBy);
  if (field.placeholder && "placeholder" in input) {
    input.placeholder = field.placeholder;
  }
  input.value = row[field.key] ?? "";
  input.addEventListener("input", () => onChange(field.key, input.value));

  if (!field.label) return input;
  const wrap = document.createElement("div");
  const label = document.createElement("label");
  label.htmlFor = input.id;
  label.textContent = field.label;
  wrap.append(label, input);
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
function renderRepeaterField(
  fieldId: RepeaterKey,
  initial: readonly Record<string, string>[],
  onArrayChange: (key: RepeaterKey, items: Record<string, string>[]) => void,
): HTMLElement {
  const spec = REPEATER_SPECS[fieldId];
  const items: Record<string, string>[] = initial.map((row) => ({ ...row }));

  const field = document.createElement("div");
  field.className = "field repeater";
  field.dataset.fieldId = fieldId;
  field.setAttribute("role", "group");

  const label = document.createElement("label");
  label.id = nextId("label");
  field.setAttribute("aria-labelledby", label.id);
  label.textContent = spec.label;
  if (spec.info) label.append(renderInfoToggle(spec.info));
  field.append(label);
  appendNote(field, spec.note);

  const list = document.createElement("div");
  field.append(list);

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "repeater-add";
  addButton.textContent = spec.addLabel;
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
      item.setAttribute("aria-label", `${spec.label} #${index + 1}`);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "repeater-remove";
      remove.setAttribute("aria-label", `Remove ${spec.label} #${index + 1}`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        items.splice(index, 1);
        renderRows();
        commit();
      });

      const fields = document.createElement("div");
      fields.className = "repeater-item-fields";
      for (const itemField of spec.itemFields) {
        fields.append(
          renderRepeaterItemControl(
            itemField,
            row,
            (key, value) => {
              row[key] = value;
              commit();
            },
            errorId,
          ),
        );
      }

      item.append(remove, fields);
      list.append(item);
    });
  }

  addButton.addEventListener("click", () => {
    const row: Record<string, unknown> = { translations: {} };
    for (const itemField of spec.itemFields) row[itemField.key] = "";
    items.push(row as unknown as Record<string, string>);
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
  note.textContent = `Original: ${original}`;
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
  input.setAttribute("aria-label", "Add a translation language");
  input.placeholder = "Type a language to add… (es, en…)";
  input.autocomplete = "off";
  const suggest = document.createElement("ul");
  suggest.className = "chips-suggest";
  suggest.hidden = true;
  wrap.append(list, suggest);
  list.append(input);

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
    suggest.hidden = true;
    onAdd(clean);
  }

  function refreshSuggestions(): void {
    suggest.textContent = "";
    const exclude = excluded().map((l) => l.toLowerCase());
    const q = input.value.trim().toLowerCase();
    const hits = LANGUAGE_SUGGESTIONS.filter(
      (l) =>
        !exclude.includes(l.code) &&
        (q === "" || l.code.startsWith(q) || l.name.toLowerCase().includes(q)),
    ).slice(0, 6);
    suggest.hidden = hits.length === 0;
    for (const hit of hits) {
      const li = document.createElement("li");
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
    setTimeout(() => (suggest.hidden = true), 150);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add(commitValue(input.value));
    }
  });

  return wrap;
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
  remove.setAttribute("aria-label", `Remove ${lang} translation`);
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
        "Name",
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
        "Description",
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
        `Image ${i + 1} alt`,
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
        `Offer ${i + 1} name`,
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
        "Eligibility note",
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
        "Part of name",
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
    empty.textContent =
      "Nothing to translate yet — fill in the event's name (or any image, offer, eligibility note or series name you want translated) first.";
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
  label.textContent = "Translations";
  label.append(
    renderInfoToggle(
      "Optional versions of this event's text in other languages. Add a language, then fill in whichever fields below you want translated — the rest are fine left in the original language.",
    ),
  );
  field.append(label);

  const langNote = document.createElement("p");
  langNote.className = "note";
  field.append(langNote);

  const list = document.createElement("div");
  field.append(list);
  const errorId = appendError(field);

  function renderLangNote(): void {
    langNote.hidden = state.textLanguage !== "";
    langNote.textContent =
      "Set a text language above first — translations describe what language everything else in this event is written in.";
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
      option.textContent = value === "" ? "(not set)" : value;
      input.append(option);
    }
  } else {
    input = document.createElement("input");
    input.type = control.kind === "checkbox" ? "checkbox" : control.kind;
  }
  input.id = nextId(control.key);
  input.dataset.key = control.key;
  if (control.placeholder && "placeholder" in input) {
    input.placeholder = control.placeholder;
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
  const label = document.createElement("label");
  label.htmlFor = input.id;
  label.textContent = control.label;
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

  const label = document.createElement("label");
  label.textContent = spec.label;
  if (spec.required) {
    const req = document.createElement("span");
    req.className = "req";
    req.textContent = " *";
    label.append(req);
  }
  if (spec.info) label.append(renderInfoToggle(spec.info));

  const controls = spec.controls.map((c) => renderControl(c, state, onInput));
  // Required applies to the field as a whole; for a pair (Date+Time, say)
  // only the first control actually has to be filled in — the schema never
  // requires the second, so marking both aria-required would overclaim.
  if (spec.required) controls[0]?.input.setAttribute("aria-required", "true");

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
      noteId = appendNote(outer, spec.note);
      outer.append(row);
      errorId = appendError(outer);
    } else {
      outer.append(label, row);
      noteId = appendNote(outer, spec.note);
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
  const noteId = appendNote(field, spec.note);
  const errorId = appendError(field);
  const describedBy = describedByOf(noteId, errorId);
  if (describedBy) controls[0]?.input.setAttribute("aria-describedby", describedBy);
  return field;
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
): {
  refreshTranslations: () => void;
  sections: { id: SectionId; title: string }[];
} {
  root.textContent = "";
  let refreshTranslations: () => void = () => {};
  const renderedSections: { id: SectionId; title: string }[] = [];
  for (const section of SECTIONS) {
    const fieldIds = FIELD_REGISTRY.filter(
      (f) =>
        f.section === section &&
        (profile.fields.has(f.id) || extraFields.has(f.id)),
    ).map((f) => f.id);
    if (fieldIds.length === 0) continue;
    renderedSections.push({ id: section, title: SECTION_TITLES[section] });

    const details = document.createElement("details");
    details.id = `section-${section}`;
    details.open = !profile.collapsedSections.has(section);
    const summary = document.createElement("summary");
    summary.textContent = SECTION_TITLES[section];
    details.append(summary);
    for (const id of fieldIds) {
      // Venue and its map position are one place, two OTE fields: rendered
      // as a single block (the map nests under the venue input) so the
      // address is only ever typed once.
      if (id === "geo" && fieldIds.includes("venue")) continue;
      // organizers/image/offers are arrays of objects, not a single
      // FormState string/boolean — they get their own repeater renderer
      // instead of the generic Control-per-field path.
      if (id === "organizers" || id === "image" || id === "offers") {
        details.append(
          renderRepeaterField(
            id,
            state[id] as unknown as Record<string, string>[],
            onArrayInput,
          ),
        );
        continue;
      }
      // translations reads/writes several state slices at once and has no
      // single FormState key of its own — its own bespoke renderer, same
      // precedent as the repeater fields above.
      if (id === "translations") {
        const section = renderTranslationsSection(state, onTranslationsCommit);
        refreshTranslations = section.refresh;
        details.append(section.element);
        continue;
      }
      const field = renderField(id, state, onInput);
      if (id === "venue" && fieldIds.includes("geo")) {
        field.append(renderField("geo", state, onInput));
      }
      details.append(field);
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
      p.textContent = "Not in the imported ICS — fill in by hand if known.";
      const slot = field.querySelector(".field-error");
      if (slot) slot.before(p);
      else field.append(p);
    } else if (!gap && tag) {
      tag.remove();
    }
  }
}

/** Enables/disables the time inputs when "all-day" is toggled. */
export function setAllDay(root: HTMLElement, allDay: boolean): void {
  for (const key of ["startTime", "endTime"]) {
    const input = root.querySelector<HTMLInputElement>(
      `input[data-key="${key}"]`,
    );
    if (input) input.disabled = allDay;
  }
}
