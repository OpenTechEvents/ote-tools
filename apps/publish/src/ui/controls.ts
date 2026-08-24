import { el } from "./dom.js";

/**
 * The controls that make the widget panels a playground rather than a fixed
 * snippet: every change re-renders both the live preview and the snippet, so
 * what the organizer tunes is exactly what they copy.
 */
export function controls(children: HTMLElement[]): HTMLElement {
  const row = el("div", "controls");
  row.append(...children);
  return row;
}

export function selectControl(
  labelText: string,
  options: [value: string, label: string][],
  current: string,
  onChange: (value: string) => void,
): HTMLElement {
  const wrapper = el("label", "control");
  wrapper.append(el("span", "control-label", labelText));
  const select = el("select");
  for (const [value, text] of options) {
    const option = el("option", undefined, text);
    option.value = value;
    option.selected = value === current;
    select.append(option);
  }
  select.addEventListener("change", () => onChange(select.value));
  wrapper.append(select);
  return wrapper;
}

export function numberControl(
  labelText: string,
  placeholder: string,
  current: number | undefined,
  onChange: (value: number | undefined) => void,
): HTMLElement {
  const wrapper = el("label", "control");
  wrapper.append(el("span", "control-label", labelText));
  const input = el("input");
  input.type = "number";
  input.min = "1";
  input.placeholder = placeholder;
  input.value = current === undefined ? "" : String(current);
  input.addEventListener("change", () => {
    const parsed = Number(input.value);
    onChange(
      input.value.trim() === "" || !Number.isFinite(parsed) || parsed < 1 ? undefined : parsed,
    );
  });
  wrapper.append(input);
  return wrapper;
}

export function checkboxControl(
  labelText: string,
  current: boolean,
  onChange: (value: boolean) => void,
): HTMLElement {
  const wrapper = el("label", "control control-inline");
  const input = el("input");
  input.type = "checkbox";
  input.checked = current;
  input.addEventListener("change", () => onChange(input.checked));
  wrapper.append(input, el("span", "control-label", labelText));
  return wrapper;
}

/**
 * This event, or the whole feed — offered only by the three destinations a
 * feed means anything to. Deliberately a per-panel control rather than a
 * second event selector in the header: publishing is a one-event act, and a
 * global "all events" mode framed the whole tool as mass broadcasting.
 */
export function scopeControl(
  eventName: string,
  current: "event" | "feed",
  onChange: (scope: "event" | "feed") => void,
): HTMLElement {
  const group = el("div", "segmented");
  group.setAttribute("role", "radiogroup");
  group.setAttribute("aria-label", "What this covers");
  for (const [value, label] of [
    ["event", `Only “${eventName}”`],
    ["feed", "The whole feed"],
  ] as const) {
    const option = el("label", "segment");
    const input = el("input");
    input.type = "radio";
    input.name = "panel-scope";
    input.value = value;
    input.checked = current === value;
    input.addEventListener("change", () => onChange(value));
    option.append(input, el("span", undefined, label));
    group.append(option);
  }
  return group;
}
