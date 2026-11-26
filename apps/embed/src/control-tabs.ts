/**
 * Control tabs and their non-default badges (#192).
 *
 * Imported by `playground.ts` only — never by `main.ts`, which must not grow
 * demo-page code (see apps/embed/CLAUDE.md on the entry points).
 */

export type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * Whether a control still holds the value the markup shipped it with.
 *
 * Read from the DOM's own `defaultChecked`/`defaultValue`/`defaultSelected`
 * rather than from a list of defaults maintained next to the form: a second
 * copy of that set is how a control gets added and silently never counted.
 */
export function isAtDefault(control: FormControl): boolean {
  if (control instanceof HTMLSelectElement) {
    const selected = control.selectedOptions[0];
    return !selected || selected.defaultSelected;
  }
  if (control instanceof HTMLInputElement && (control.type === "checkbox" || control.type === "radio")) {
    return control.checked === control.defaultChecked;
  }
  return control.value === control.defaultValue;
}

/**
 * Whether a control is inside a hidden part of its panel — a group the form
 * has switched off, such as the custom ICS/RSS fields under a `generated`
 * radio. The panel's own `hidden` (the tab is not the open one) does not
 * count, or every badge would read zero exactly when it is needed.
 */
function isInHiddenGroup(control: Element, panel: HTMLElement): boolean {
  for (let node = control.parentElement; node && node !== panel; node = node.parentElement) {
    if (node.hidden) return true;
  }
  return false;
}

export function countChangedControls(panel: HTMLElement): number {
  let changed = 0;
  for (const control of panel.querySelectorAll<FormControl>("input, select, textarea")) {
    // A switched-off group contributes nothing to the snippet, so it must
    // contribute nothing to the count either.
    if (isInHiddenGroup(control, panel)) continue;
    // Only the *checked* radio of a group is counted: a group that moved
    // has one radio newly checked and one newly unchecked, which is one
    // decision, not two.
    if (control instanceof HTMLInputElement && control.type === "radio" && !control.checked) continue;
    if (!isAtDefault(control)) changed += 1;
  }
  return changed;
}

export function refreshTabBadges(column: HTMLElement): void {
  for (const tab of column.querySelectorAll<HTMLButtonElement>(".control-tab")) {
    const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
    const badge = tab.querySelector<HTMLElement>(".tab-badge");
    if (!panel || !badge) continue;
    const changed = countChangedControls(panel);
    badge.hidden = changed === 0;
    badge.textContent = String(changed);
    // The badge is aria-hidden, so the count reaches a screen reader through
    // the tab's label instead of as a bare number after its name.
    if (changed === 0) tab.removeAttribute("aria-label");
    else tab.setAttribute("aria-label", `${tab.textContent?.replace(/\d+$/, "").trim()}, ${changed} changed`);
  }
}

export function setupControlTabs(column: HTMLElement): void {
  const tablist = column.querySelector<HTMLElement>(".control-tabs");
  if (!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>(".control-tab"));

  const select = (next: HTMLButtonElement, moveFocus: boolean): void => {
    for (const tab of tabs) {
      const isActive = tab === next;
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
      if (panel) panel.hidden = !isActive;
    }
    if (moveFocus) next.focus();
  };

  for (const tab of tabs) tab.addEventListener("click", () => select(tab, false));

  // Roving tabindex: a tablist is one stop, and the arrows move within it.
  tablist.addEventListener("keydown", (event) => {
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    let next = -1;
    if (step !== 0) next = (current + step + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    if (next === -1) return;
    event.preventDefault();
    select(tabs[next], true);
  });

  // One delegated listener per column keeps the badges in step with every
  // control inside it, including ones added later.
  const refresh = (): void => refreshTabBadges(column);
  column.addEventListener("input", refresh);
  column.addEventListener("change", refresh);
  refresh();
}
