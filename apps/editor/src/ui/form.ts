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
};

const FIELD_SPECS: Record<string, FieldSpec> = {
  name: {
    label: "Name",
    required: true,
    controls: [{ key: "name", label: "", kind: "text" }],
  },
  description: {
    label: "Description",
    note: "Plain text or Markdown.",
    controls: [{ key: "description", label: "", kind: "textarea" }],
  },
  url: {
    label: "Event page URL",
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
    controls: [{ key: "allDay", label: "", kind: "checkbox" }],
  },
  startDate: {
    label: "Start",
    required: true,
    controls: [
      { key: "startDate", label: "Date", kind: "date" },
      { key: "startTime", label: "Time", kind: "time" },
    ],
  },
  endDate: {
    label: "End",
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
    controls: [{ key: "venue", label: "", kind: "text" }],
  },
  onlineUrl: {
    label: "Online URL",
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
): HTMLElement {
  const vocab = control.vocab === "tags" ? tagVocabulary : languageVocabulary;

  const wrap = document.createElement("div");
  wrap.className = "chips";
  wrap.dataset.key = control.key;

  const list = document.createElement("div");
  list.className = "chips-list";
  const input = document.createElement("input");
  input.type = "text";
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
  return wrap;
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
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "combo-field";

  const input = document.createElement("input");
  input.type = "text";
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

  return wrap;
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
    itemFields: [
      { key: "url", label: "URL", kind: "url", placeholder: "https://…" },
      { key: "alt", label: "Alt text", kind: "text" },
    ],
  },
  offers: {
    label: "Offers (tickets)",
    addLabel: "+ Add offer",
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
  if (field.placeholder && "placeholder" in input) {
    input.placeholder = field.placeholder;
  }
  input.value = row[field.key] ?? "";
  input.addEventListener("input", () => onChange(field.key, input.value));

  if (!field.label) return input;
  const wrap = document.createElement("div");
  const label = document.createElement("label");
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

  const label = document.createElement("label");
  label.textContent = spec.label;
  if (spec.info) {
    const info = document.createElement("span");
    info.className = "info";
    info.textContent = " ⓘ";
    info.title = spec.info;
    info.tabIndex = 0;
    label.append(info);
  }
  field.append(label);
  appendNote(field, spec.note);

  const list = document.createElement("div");
  field.append(list);

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "repeater-add";
  addButton.textContent = spec.addLabel;
  field.append(addButton);
  appendError(field);

  function commit(): void {
    onArrayChange(fieldId, items);
  }

  function renderRows(): void {
    list.textContent = "";
    items.forEach((row, index) => {
      const item = document.createElement("div");
      item.className = "repeater-item";

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
          renderRepeaterItemControl(itemField, row, (key, value) => {
            row[key] = value;
            commit();
          }),
        );
      }

      item.append(remove, fields);
      list.append(item);
    });
  }

  addButton.addEventListener("click", () => {
    const row: Record<string, string> = {};
    for (const itemField of spec.itemFields) row[itemField.key] = "";
    items.push(row);
    renderRows();
    commit();
  });

  renderRows();
  return field;
}

function renderControl(
  control: Control,
  state: FormState,
  onInput: (key: StateKey, value: string | boolean) => void,
): HTMLElement {
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

  if (!control.label) return input;
  const wrap = document.createElement("div");
  const label = document.createElement("label");
  label.textContent = control.label;
  wrap.append(label, input);
  return wrap;
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
  if (spec.info) {
    const info = document.createElement("span");
    info.className = "info";
    info.textContent = " ⓘ";
    info.title = spec.info;
    info.tabIndex = 0; // keyboard-reachable, exposes the title
    label.append(info);
  }

  const controls = spec.controls.map((c) => renderControl(c, state, onInput));

  if (field.classList.contains("pair")) {
    // label above, paired inputs side by side
    const outer = document.createElement("div");
    outer.className = "field";
    outer.dataset.fieldId = fieldId;
    delete field.dataset.fieldId;
    const row = document.createElement("div");
    row.className = "field pair";
    row.append(...controls);
    if (fieldId === "geo") {
      // Map first (main.ts mounts Leaflet here), then the hint,
      // then the coordinate inputs the map keeps in sync.
      const slot = document.createElement("div");
      slot.dataset.role = "geo-map";
      outer.append(label, slot);
      appendNote(outer, spec.note);
      outer.append(row);
      appendError(outer);
      return outer;
    }
    outer.append(label, row);
    appendNote(outer, spec.note);
    appendError(outer);
    return outer;
  }

  field.append(label, ...controls);
  appendNote(field, spec.note);
  appendError(field);
  return field;
}

function appendNote(field: HTMLElement, note?: string) {
  if (note) {
    const p = document.createElement("p");
    p.className = "note";
    p.textContent = note;
    field.append(p);
  }
}

function appendError(field: HTMLElement) {
  const error = document.createElement("p");
  error.className = "field-error";
  field.append(error);
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
): void {
  root.textContent = "";
  for (const section of SECTIONS) {
    const fieldIds = FIELD_REGISTRY.filter(
      (f) =>
        f.section === section &&
        (profile.fields.has(f.id) || extraFields.has(f.id)),
    ).map((f) => f.id);
    if (fieldIds.length === 0) continue;

    const details = document.createElement("details");
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
      const field = renderField(id, state, onInput);
      if (id === "venue" && fieldIds.includes("geo")) {
        field.append(renderField("geo", state, onInput));
      }
      details.append(field);
    }
    root.append(details);
  }
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
