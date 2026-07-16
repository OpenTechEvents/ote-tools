/**
 * DOM rendering of the event form. No business logic here: which fields to
 * show comes from lib/presets.ts, values live in lib/types.ts FormState.
 * Tested by hand (the lib/ modules carry the vitest coverage).
 */

import type { ResolvedProfile, SectionId } from "../lib/presets.js";
import { FIELD_REGISTRY, SECTIONS } from "../lib/presets.js";
import type { FormState } from "../lib/types.js";

type StateKey = keyof FormState;

interface Control {
  key: StateKey;
  label: string;
  kind: "text" | "url" | "date" | "time" | "textarea" | "checkbox" | "select";
  options?: string[];
  placeholder?: string;
}

interface FieldSpec {
  label: string;
  required?: boolean;
  note?: string;
  controls: Control[];
}

const SECTION_TITLES: Record<SectionId, string> = {
  basics: "Basics",
  when: "When",
  where: "Where",
  identity: "File & id",
  advanced: "Advanced: data metadata",
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
    note: "Comma-separated, e.g. python, async.",
    controls: [{ key: "tags", label: "", kind: "text" }],
  },
  languages: {
    label: "Languages",
    note: "BCP 47 tags, comma-separated, e.g. es, en.",
    controls: [{ key: "languages", label: "", kind: "text" }],
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
    note: "IANA name, e.g. Europe/Madrid.",
    controls: [{ key: "timezone", label: "", kind: "text" }],
  },
  status: {
    label: "Status",
    note: "Cancelled or postponed events must stay published.",
    controls: [
      {
        key: "status",
        label: "",
        kind: "select",
        options: ["", "scheduled", "cancelled", "postponed", "rescheduled"],
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
    note: "Human-readable physical location.",
    controls: [{ key: "venue", label: "", kind: "text" }],
  },
  onlineUrl: {
    label: "Online URL",
    controls: [
      { key: "onlineUrl", label: "", kind: "url", placeholder: "https://…" },
    ],
  },
  geo: {
    label: "Coordinates",
    note: "WGS-84 decimal degrees.",
    controls: [
      { key: "geoLat", label: "Latitude", kind: "text" },
      { key: "geoLon", label: "Longitude", kind: "text" },
    ],
  },
  slug: {
    label: "Filename slug",
    required: true,
    note: "The event is stored as events/<slug>.json.",
    controls: [{ key: "slug", label: "", kind: "text" }],
  },
  id: {
    label: "Event id",
    required: true,
    note: "Stable URI, minted once and never rewritten.",
    controls: [{ key: "id", label: "", kind: "url" }],
  },
  license: {
    label: "Data license",
    note: "Usually left empty: the event inherits the feed's license.",
    controls: [
      { key: "license", label: "", kind: "text", placeholder: "CC-BY-4.0" },
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

function renderControl(
  control: Control,
  state: FormState,
  onInput: (key: StateKey, value: string | boolean) => void,
): HTMLElement {
  let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  if (control.kind === "textarea") {
    input = document.createElement("textarea");
    input.rows = 3;
  } else if (control.kind === "select") {
    input = document.createElement("select");
    for (const value of control.options ?? []) {
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
    outer.append(label, row);
    appendNoteAndError(outer, spec.note);
    return outer;
  }

  field.append(label, ...controls);
  appendNoteAndError(field, spec.note);
  return field;
}

function appendNoteAndError(field: HTMLElement, note?: string) {
  if (note) {
    const p = document.createElement("p");
    p.className = "note";
    p.textContent = note;
    field.append(p);
  }
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
      details.append(renderField(id, state, onInput));
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

/** Enables/disables the time inputs when "all-day" is toggled. */
export function setAllDay(root: HTMLElement, allDay: boolean): void {
  for (const key of ["startTime", "endTime"]) {
    const input = root.querySelector<HTMLInputElement>(
      `input[data-key="${key}"]`,
    );
    if (input) input.disabled = allDay;
  }
}
