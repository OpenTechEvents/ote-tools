/**
 * Whole configurations, one click each (#199).
 *
 * The form has ~25 controls across four tabs, which is a poor way to find
 * out what the widget can do: every individual setting is a small change,
 * and nothing in the page shows the range. A preset changes the preview and
 * the snippet together and dramatically, which is the thing worth
 * demonstrating.
 *
 * Each one is expressed as control values, applied through the same events a
 * human click fires — so there is no second path into `applyAndRender()` to
 * keep in step with the first.
 */

export interface Preset {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  /** Selector → value. A string sets `value`, a boolean sets `checked`. */
  readonly values?: Readonly<Record<string, string | boolean>>;
  /**
   * Selector matching a group of checkboxes → the values to leave ticked.
   * Everything else in the group is unticked, so a preset states the whole
   * group rather than adding to whatever was there.
   */
  readonly groups?: Readonly<Record<string, readonly string[]>>;
}

export const EVENT_PRESETS: readonly Preset[] = [
  {
    id: "sidebar",
    label: "Sidebar list",
    description: "A narrow column beside your own content: list only, height-capped, five events.",
    values: { "#layout-select": "list", "#max-height-input": "420px", "#limit-input": "5" },
    groups: { ".view-key-checkbox": ["list"] },
  },
  {
    id: "cards",
    label: "Cards grid",
    description: "Wide cards with images, and repeat events collapsed into one card.",
    values: { "#layout-select": "cards", "#card-width-select": "large" },
    groups: { ".view-key-checkbox": ["cards"], ".group-key-checkbox": ["series", "multipart"] },
  },
  {
    id: "compact-calendar",
    label: "Compact calendar",
    description: "A month grid inside a tight height budget, two events per day before +N more.",
    values: {
      "#layout-select": "calendar",
      "#max-height-input": "380px",
      "#density-select": "compact",
      "#max-per-day-input": "2",
    },
  },
  {
    id: "bare",
    label: "No chrome",
    description: "Events and nothing else — no footer, no view switcher, no subscribe strip.",
    values: { "#layout-select": "list", "#footer-select": "off" },
    groups: { ".view-key-checkbox": [] },
  },
];

/**
 * Apply a preset by driving the controls, then let the page react to them the
 * way it reacts to a person.
 */
export function applyPreset(root: ParentNode, preset: Preset, notify: () => void): void {
  for (const [selector, value] of Object.entries(preset.values ?? {})) {
    const control = root.querySelector<HTMLInputElement | HTMLSelectElement>(selector);
    if (!control) continue;
    if (typeof value === "boolean") (control as HTMLInputElement).checked = value;
    else control.value = value;
  }
  for (const [selector, wanted] of Object.entries(preset.groups ?? {})) {
    for (const box of root.querySelectorAll<HTMLInputElement>(selector)) {
      box.checked = wanted.includes(box.value);
    }
  }
  notify();
}
