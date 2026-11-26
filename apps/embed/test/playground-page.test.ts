// @vitest-environment jsdom
//
// jsdom rather than node, and `DOMParser` rather than a separate `JSDOM`
// instance: `control-tabs.ts` tests nodes with `instanceof HTMLInputElement`,
// which is false across two different windows.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { countChangedControls } from "../src/control-tabs.js";
import { applyPreset, EVENT_PRESETS } from "../src/presets.js";

// `import.meta.url` is an http URL under the jsdom environment; vitest
// runs from this package's root.
const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
const page = (): Document => new DOMParser().parseFromString(html, "text/html");

describe("the playground's shipped markup", () => {
  it("leaves `group-events` unticked, because the absent attribute is a no-op", () => {
    // `parseGroupEvents()` yields an empty Set for an absent attribute, on
    // purpose: grouping is opt-in visual behaviour with a pinned consumer
    // (see apps/embed/CLAUDE.md). A form that ships it ticked hands every
    // visitor a snippet turning on a feature they did not ask for — which it
    // did, next to a hint reading "Off by default".
    const boxes = [...page().querySelectorAll<HTMLInputElement>(".group-key-checkbox")];
    expect(boxes.length).toBeGreaterThan(0);
    expect(boxes.every((box) => !box.hasAttribute("checked"))).toBe(true);
  });

  it("starts every control panel at its default", () => {
    const doc = page();
    for (const panel of doc.querySelectorAll<HTMLElement>(".control-panel")) {
      expect([panel.id, countChangedControls(panel)]).toEqual([panel.id, 0]);
    }
  });

  it("wires every info button to a popover, and every popover to a button", () => {
    const doc = page();
    const targets = [...doc.querySelectorAll("[popovertarget]")].map((b) => b.getAttribute("popovertarget"));
    const popovers = [...doc.querySelectorAll<HTMLElement>(".info-popover")].map((p) => p.id);

    expect(popovers.length).toBeGreaterThan(0);
    expect(new Set(popovers).size).toBe(popovers.length);
    for (const target of targets) expect(popovers).toContain(target);
    for (const id of popovers) expect(targets).toContain(id);
    for (const popover of doc.querySelectorAll(".info-popover")) {
      expect(popover.hasAttribute("popover")).toBe(true);
    }
  });

  it("gives each tablist panels that exist and exactly one selected tab", () => {
    const doc = page();
    const tablists = [...doc.querySelectorAll('[role="tablist"]')];
    expect(tablists.length).toBeGreaterThan(0);

    for (const tablist of tablists) {
      const tabs = [...tablist.querySelectorAll('[role="tab"]')];
      const selected = tabs.filter((tab) => tab.getAttribute("aria-selected") === "true");
      expect([tablist.getAttribute("aria-label"), selected.length]).toEqual([
        tablist.getAttribute("aria-label"),
        1,
      ]);
      for (const tab of tabs) {
        expect(doc.getElementById(tab.getAttribute("aria-controls") ?? "")).not.toBeNull();
        // Only the selected tab is in the tab order.
        expect([tab.id, tab.getAttribute("tabindex")]).toEqual([
          tab.id,
          tab.getAttribute("aria-selected") === "true" ? null : "-1",
        ]);
      }
    }
  });
});

describe("the event presets", () => {
  const column = (doc: Document): HTMLElement =>
    doc.querySelector<HTMLElement>("#tab-panel-events .controls-column")!;

  it.each(EVENT_PRESETS.map((preset) => [preset.id, preset] as const))(
    "%s names only controls that exist",
    (_id, preset) => {
      // A preset is selectors, so a renamed control makes it silently do
      // nothing rather than fail — the one failure mode worth a guard.
      const root = column(page());
      for (const selector of Object.keys(preset.values ?? {})) {
        expect([selector, root.querySelector(selector)]).not.toEqual([selector, null]);
      }
      for (const selector of Object.keys(preset.groups ?? {})) {
        expect([selector, root.querySelectorAll(selector).length]).not.toEqual([selector, 0]);
      }
    },
  );

  it.each(EVENT_PRESETS.map((preset) => [preset.id, preset] as const))(
    "%s actually changes the form",
    (_id, preset) => {
      const doc = page();
      const root = column(doc);
      let notified = 0;
      applyPreset(root, preset, () => (notified += 1));

      expect(notified).toBe(1);
      const changed = [...doc.querySelectorAll<HTMLElement>("#tab-panel-events .control-panel")].reduce(
        (total, panel) => total + countChangedControls(panel),
        0,
      );
      expect(changed).toBeGreaterThan(0);
    },
  );

  it("states a whole checkbox group rather than adding to what was there", () => {
    const doc = page();
    const root = column(doc);
    // Every view starts ticked; "Sidebar list" asks for list alone.
    const sidebar = EVENT_PRESETS.find((preset) => preset.id === "sidebar")!;
    applyPreset(root, sidebar, () => {});

    const ticked = [...root.querySelectorAll<HTMLInputElement>(".view-key-checkbox")]
      .filter((box) => box.checked)
      .map((box) => box.value);
    expect(ticked).toEqual(["list"]);
  });
});
