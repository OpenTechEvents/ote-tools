// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";

import { countChangedControls, isAtDefault, setupControlTabs } from "../src/control-tabs.js";

function column(): HTMLElement {
  document.body.innerHTML = `
    <div class="controls-column">
      <div class="control-tabs" role="tablist">
        <button class="control-tab" role="tab" id="t-a" aria-controls="p-a" aria-selected="true">Basics<span class="tab-badge" hidden aria-hidden="true"></span></button>
        <button class="control-tab" role="tab" id="t-b" aria-controls="p-b" aria-selected="false" tabindex="-1">Appearance<span class="tab-badge" hidden aria-hidden="true"></span></button>
        <button class="control-tab" role="tab" id="t-c" aria-controls="p-c" aria-selected="false" tabindex="-1">Behavior<span class="tab-badge" hidden aria-hidden="true"></span></button>
      </div>
      <div class="control-panel" id="p-a" role="tabpanel">
        <input id="text" type="text" value="" />
        <input id="on" type="checkbox" checked />
        <input id="off" type="checkbox" />
        <label><input type="radio" name="mode" value="url" checked /></label>
        <label><input type="radio" name="mode" value="json" /></label>
      </div>
      <div class="control-panel" id="p-b" role="tabpanel" hidden>
        <select id="pick">
          <option value="a" selected>a</option>
          <option value="b">b</option>
        </select>
      </div>
      <div class="control-panel" id="p-c" role="tabpanel" hidden>
        <div id="off-group" hidden><input id="in-hidden-group" type="text" value="" /></div>
      </div>
    </div>`;
  return document.querySelector<HTMLElement>(".controls-column")!;
}

const el = <T extends Element>(selector: string): T => document.querySelector<T>(selector)!;
const badgeOf = (tab: string): HTMLElement => el<HTMLElement>(`#${tab} .tab-badge`);

describe("isAtDefault", () => {
  beforeEach(column);

  it("reads a text input against the value the markup shipped", () => {
    const input = el<HTMLInputElement>("#text");
    expect(isAtDefault(input)).toBe(true);
    input.value = "600px";
    expect(isAtDefault(input)).toBe(false);
  });

  it("reads a checkbox against `checked`, in both directions", () => {
    const on = el<HTMLInputElement>("#on");
    const off = el<HTMLInputElement>("#off");
    expect(isAtDefault(on)).toBe(true);
    expect(isAtDefault(off)).toBe(true);
    on.checked = false;
    off.checked = true;
    expect(isAtDefault(on)).toBe(false);
    expect(isAtDefault(off)).toBe(false);
  });

  it("reads a select against the option carrying the `selected` attribute", () => {
    const select = el<HTMLSelectElement>("#pick");
    expect(isAtDefault(select)).toBe(true);
    select.value = "b";
    expect(isAtDefault(select)).toBe(false);
  });
});

describe("countChangedControls", () => {
  beforeEach(column);

  it("is zero for an untouched panel", () => {
    expect(countChangedControls(el("#p-a"))).toBe(0);
  });

  it("counts a moved radio group once, not twice", () => {
    // Moving a group unchecks one radio and checks another. That is one
    // decision; counting the unchecked one too would report every group
    // change as two.
    el<HTMLInputElement>('input[value="url"]').checked = false;
    el<HTMLInputElement>('input[value="json"]').checked = true;
    expect(countChangedControls(el("#p-a"))).toBe(1);
  });

  it("ignores a control the form has switched off", () => {
    // A hidden group contributes nothing to the snippet, so counting it
    // would point at a setting that changes nothing.
    const panel = el<HTMLElement>("#p-c");
    const input = el<HTMLInputElement>("#in-hidden-group");
    input.value = "https://example.org/a.ics";
    expect(countChangedControls(panel)).toBe(0);

    el<HTMLElement>("#off-group").hidden = false;
    expect(countChangedControls(panel)).toBe(1);
  });

  it("still counts controls in a panel that is merely the closed tab", () => {
    // #p-b is hidden because its tab is not open. That must not zero its
    // badge — the badge exists precisely to speak for a closed tab.
    const select = el<HTMLSelectElement>("#pick");
    select.value = "b";
    expect(el<HTMLElement>("#p-b").hidden).toBe(true);
    expect(countChangedControls(el("#p-b"))).toBe(1);
  });

  it("adds up controls of different kinds", () => {
    el<HTMLInputElement>("#text").value = "600px";
    el<HTMLInputElement>("#on").checked = false;
    expect(countChangedControls(el("#p-a"))).toBe(2);
  });
});

describe("setupControlTabs", () => {
  it("shows one panel at a time and moves the roving tabindex", () => {
    setupControlTabs(column());
    el<HTMLButtonElement>("#t-b").click();

    expect(el<HTMLElement>("#p-a").hidden).toBe(true);
    expect(el<HTMLElement>("#p-b").hidden).toBe(false);
    expect(el("#t-a").getAttribute("aria-selected")).toBe("false");
    expect(el("#t-b").getAttribute("aria-selected")).toBe("true");
    expect(el<HTMLButtonElement>("#t-a").tabIndex).toBe(-1);
    expect(el<HTMLButtonElement>("#t-b").tabIndex).toBe(0);
  });

  it("moves with the arrow keys and wraps, taking focus with it", () => {
    setupControlTabs(column());
    el<HTMLButtonElement>("#t-a").focus();

    const press = (key: string): void =>
      void el(".control-tabs").dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));

    press("ArrowRight");
    expect(document.activeElement?.id).toBe("t-b");
    press("ArrowLeft");
    press("ArrowLeft");
    expect(document.activeElement?.id).toBe("t-c");
    press("End");
    expect(document.activeElement?.id).toBe("t-c");
    press("Home");
    expect(document.activeElement?.id).toBe("t-a");
  });

  it("badges the panel a changed control sits in, not the open one", () => {
    const root = column();
    setupControlTabs(root);
    expect(badgeOf("t-b").hidden).toBe(true);

    const select = el<HTMLSelectElement>("#pick");
    select.value = "b";
    select.dispatchEvent(new Event("change", { bubbles: true }));

    // #p-b is hidden; the badge on its tab is the only thing saying so.
    expect(badgeOf("t-b").hidden).toBe(false);
    expect(badgeOf("t-b").textContent).toBe("1");
    expect(badgeOf("t-a").hidden).toBe(true);
    expect(el("#t-b").getAttribute("aria-label")).toBe("Appearance, 1 changed");
  });

  it("clears the badge and the label when a control returns to its default", () => {
    const root = column();
    setupControlTabs(root);
    const input = el<HTMLInputElement>("#text");

    input.value = "600px";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(badgeOf("t-a").hidden).toBe(false);

    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(badgeOf("t-a").hidden).toBe(true);
    expect(el("#t-a").hasAttribute("aria-label")).toBe(false);
  });
});
