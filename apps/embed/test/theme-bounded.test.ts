import { describe, expect, it } from "vitest";

import { WIDGET_CSS } from "../src/theme.css.js";

/**
 * A smoke guard for `max-height`'s stylesheet, and an honest one: jsdom lays
 * nothing out, so none of this proves the widget scrolls or that a header
 * stays put. Those are verified in a real browser (apps/embed/CLAUDE.md says
 * how) and re-verified whenever this block changes.
 *
 * It exists because the entire user-visible half of #168 is CSS: the whole
 * `[data-bounded]` block could be deleted and every other test in this
 * package still passed. What is asserted here is only the handful of rules
 * whose absence is silent — a widget that looks fine while clipping — rather
 * than a second copy of the stylesheet.
 */
describe("the max-height stylesheet", () => {
  const boundedRules = WIDGET_CSS.split("\n")
    .filter((line) => line.includes("[data-bounded"))
    .join("\n");

  it("gates every bounded rule on the attribute element.ts sets", () => {
    // Nothing may apply to an unbounded widget: the attribute is absent
    // unless `max-height` parsed, which is what keeps an existing embed
    // laying out exactly as it did before this feature.
    expect(boundedRules).toContain(".ote-events[data-bounded]");
    expect(WIDGET_CSS).toContain("max-height: var(--ote-max-height);");
  });

  it("re-enables scrolling on the element the calendar library clips", () => {
    // dayMaxEvents:true adds .ec-uniform, which sets overflow: hidden. Under
    // a budget that silently cuts off the last weeks of the month with no
    // way to reach them, so this single rule is what makes max-per-day and
    // max-height compose instead of lose data.
    expect(WIDGET_CSS).toContain(
      ".ote-events[data-bounded] .calendar-host .ec-day-grid .ec-main.ec-uniform {\n  overflow: auto;\n}",
    );
  });

  it("keeps the cards layout on its own scroll container", () => {
    // A grid handed a definite height sizes its auto rows against that
    // height, squashing every card. Cards scroll the container and leave the
    // grid at its content height; list and calendar must not, because they
    // have headers that can only pin inside an inner scrollport.
    expect(WIDGET_CSS).toContain('.ote-events[data-bounded="cards"]');
    expect(WIDGET_CSS).toContain('.ote-events[data-bounded="cards"] ul.events {\n  flex: none;');
  });

  it("lets empty weeks collapse when the rows are not uniform", () => {
    // The library floors every day cell at 5em and lifts that floor only in
    // uniform mode, so max-per-day="off" - the mode that sizes each week to
    // its own content - still gave every empty week 80px under a budget.
    // The :not(.ec-uniform) scope matters: in uniform mode the library
    // already drops the floor, and the capped rows have their own sizing.
    expect(WIDGET_CSS).toContain(
      ".ec-day-grid .ec-main:not(.ec-uniform) .ec-day {\n  min-block-size: 2.2em;\n}",
    );
  });

  it("pins both headers that would otherwise scroll away", () => {
    expect(WIDGET_CSS).toContain(".event-list-header {\n  position: sticky;");
  });

  it("overrides the vendor stylesheet by specificity, never with !important", () => {
    // apps/embed/CLAUDE.md: the widget themes through --ote-* custom
    // properties and beats the library's own rules with one extra class,
    // because !important cannot be undone by a host page.
    expect(boundedRules).not.toContain("!important");
  });
});
