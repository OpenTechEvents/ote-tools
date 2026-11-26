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
  const fittingRules = WIDGET_CSS.split("\n")
    .filter((line) => line.includes("[data-bounded") || line.includes("[data-layout"))
    .join("\n");

  it("applies the budget only when the attribute parsed", () => {
    // The plumbing is unconditional - a host can size the element with
    // plain CSS - but the budget itself is the attribute's alone.
    expect(WIDGET_CSS).toContain(".ote-events[data-bounded] {\n  max-height: var(--ote-max-height);\n}");
  });

  it("fits the widget to its host without needing the attribute", () => {
    // height: 100% against an auto-height host resolves to auto, so this is
    // inert for an embed that sets no height and load-bearing for one that
    // does. Before it, the element obeyed a CSS height while its contents
    // kept their own and spilled out of it.
    expect(WIDGET_CSS).toContain(".ote-events {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}");
  });

  it("re-enables scrolling on the element the calendar library clips", () => {
    // dayMaxEvents:true adds .ec-uniform, which sets overflow: hidden. Under
    // a budget that silently cuts off the last weeks of the month with no
    // way to reach them, so this single rule is what makes max-per-day and
    // max-height compose instead of lose data.
    expect(WIDGET_CSS).toContain(
      ".ote-events[data-layout=\"calendar\"] .calendar-host .ec-day-grid .ec-main.ec-uniform {\n  overflow: auto;\n}",
    );
  });

  it("keeps the cards layout on its own scroll container", () => {
    // A grid handed a definite height sizes its auto rows against that
    // height, squashing every card. Cards scroll the container and leave the
    // grid at its content height; list and calendar must not, because they
    // have headers that can only pin inside an inner scrollport.
    expect(WIDGET_CSS).toContain('.ote-events[data-layout="cards"]');
    expect(WIDGET_CSS).toContain('.ote-events[data-layout="cards"] ul.events {\n  flex: none;');
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

  it("carries compact cell metrics behind the density marker", () => {
    // These three rules are the whole of density="compact" (#170), and the
    // measured constants in calendar-layout.ts have to agree with them.
    expect(WIDGET_CSS).toContain('.calendar-host[data-density="compact"]');
    expect(WIDGET_CSS).toContain('[data-density="compact"] .ec-event');
    expect(WIDGET_CSS).toContain('[data-density="compact"] .ec-day-foot');
    // The weekday header was the one box compact never shrank: it stayed at
    // 31px in both densities, on a layout that is short of room by definition.
    expect(WIDGET_CSS).toContain('[data-density="compact"] .ec-col-head');
  });

  it("sizes month weeks from a track list rather than one shared row height", () => {
    // --ec-row-height is a single value for every row, so content-sizing it
    // grows each cell to its events and the "+N more" popover stops firing.
    // A track list sets each week independently and keeps the cap.
    expect(WIDGET_CSS).toContain(
      ".calendar-host[data-week-rows] .ec-day-grid .ec-main {\n  grid-template-rows: var(--ote-calendar-week-rows);\n}",
    );
  });

  it("clips the event layer so hidden events cannot inflate the scrollport", () => {
    // The capped-away events keep their layout box, so without this a month
    // that fits its budget still grew a scrollbar into 400px of blank space.
    expect(WIDGET_CSS).toContain(
      ".calendar-host[data-week-rows] .ec-day-grid .ec-body {\n  overflow: hidden;\n}",
    );
  });

  it("overrides the vendor stylesheet by specificity, never with !important", () => {
    // apps/embed/CLAUDE.md: the widget themes through --ote-* custom
    // properties and beats the library's own rules with one extra class,
    // because !important cannot be undone by a host page.
    expect(fittingRules).not.toContain("!important");
  });
});
