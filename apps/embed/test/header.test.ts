// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";

import { renderHeader, type HeaderState } from "../src/header.js";

function state(overrides: Partial<HeaderState> = {}): HeaderState {
  return {
    views: ["calendar", "list", "cards"],
    active: "calendar",
    lang: "en",
    density: "full",
    onSelect: () => {},
    ...overrides,
  };
}

describe("renderHeader", () => {
  it("puts the month navigation left and the view control right, in that order", () => {
    // Google Calendar's order, which is the one a visitor arrives with.
    const header = renderHeader(state({ nav: { title: "November 2026", showsToday: false, onNav: () => {} } }))!;
    expect([...header.children].map((child) => child.className)).toEqual(["header-nav", "view-switcher"]);
    expect(header.querySelector(".header-title")!.textContent).toBe("November 2026");
    expect([...header.querySelectorAll(".header-nav > *")].map((node) => node.className)).toEqual([
      "header-today",
      "header-arrow",
      "header-arrow",
      "header-title",
    ]);
  });

  it("renders no navigation outside the calendar", () => {
    // Nothing in list or cards has a month to page.
    const header = renderHeader(state({ active: "list" }))!;
    expect(header.querySelector(".header-nav")).toBeNull();
    expect(header.querySelector(".view-switcher")).not.toBeNull();
  });

  it("is absent when there is neither a switcher nor a month to page", () => {
    // Same contract as renderFooter(): the scroll wrapper the height
    // budget needs is mounted by whether there is chrome at all.
    expect(renderHeader(state({ views: ["list"] }))).toBeUndefined();
    expect(renderHeader(state({ views: [] }))).toBeUndefined();
  });

  it("names the arrows for a screen reader and greys them until the calendar reports a month", () => {
    const header = renderHeader(state({ nav: { showsToday: false, onNav: () => {} } }))!;
    const [prev, next] = [...header.querySelectorAll<HTMLButtonElement>(".header-arrow")];
    expect(prev!.getAttribute("aria-label")).toBe("Previous month");
    expect(next!.getAttribute("aria-label")).toBe("Next month");
    // A button that looks live but does nothing is worse than one that is
    // plainly not ready: the chunk that can page has not loaded yet.
    expect([prev!.disabled, next!.disabled]).toEqual([true, true]);
    expect(header.querySelector(".header-title")!.getAttribute("aria-live")).toBe("polite");
  });

  it("greys Today while today is already on screen, and wires all three commands", () => {
    const onNav = vi.fn();
    const here = renderHeader(state({ nav: { title: "November 2026", showsToday: true, onNav } }))!;
    expect(here.querySelector<HTMLButtonElement>(".header-today")!.disabled).toBe(true);

    const away = renderHeader(state({ nav: { title: "March 2027", showsToday: false, onNav } }))!;
    away.querySelector<HTMLButtonElement>(".header-today")!.click();
    away.querySelector<HTMLButtonElement>('.header-arrow[data-nav="prev"]')!.click();
    away.querySelector<HTMLButtonElement>('.header-arrow[data-nav="next"]')!.click();
    expect(onNav.mock.calls.flat()).toEqual(["today", "prev", "next"]);
  });

  it("keeps every label in the DOM at icon density, so the buttons keep their names", () => {
    // The CSS hides the span visually (theme.css.ts); removing it would
    // leave three unlabelled glyphs, which #183 rules out.
    const header = renderHeader(state({ density: "icons" }))!;
    expect([...header.querySelectorAll(".view-button-label")].map((node) => node.textContent)).toEqual([
      "Calendar",
      "List",
      "Cards",
    ]);
  });

  it("falls back to a native select at menu density", () => {
    // The platform renders its popup in the top layer and has no "clicked
    // outside" to detect — the one thing a hand-built menu inside a shadow
    // root gets wrong.
    const onSelect = vi.fn();
    const header = renderHeader(state({ density: "menu", active: "list", onSelect }))!;
    expect(header.querySelector(".view-switcher")).toBeNull();
    const select = header.querySelector<HTMLSelectElement>(".view-select")!;
    expect(select.getAttribute("aria-label")).toBe("View");
    expect([...select.options].map((option) => option.value)).toEqual(["calendar", "list", "cards"]);
    expect(select.value).toBe("list");

    select.value = "cards";
    select.dispatchEvent(new Event("change"));
    expect(onSelect).toHaveBeenCalledWith("cards");
  });

  it("translates the navigation as well as the views", () => {
    const header = renderHeader(
      state({ lang: "es", nav: { title: "noviembre de 2026", showsToday: false, onNav: () => {} } }),
    )!;
    expect(header.querySelector(".header-today")!.textContent).toBe("Hoy");
    expect(header.querySelector('.header-arrow[data-nav="prev"]')!.getAttribute("aria-label")).toBe("Mes anterior");
    expect(header.querySelector(".view-switcher")!.getAttribute("aria-label")).toBe("Vista");
  });
});
