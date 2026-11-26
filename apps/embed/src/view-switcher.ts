// The view switcher (#183): Calendar / List / Cards, rendered by the widget
// so a visitor can pick the layout the embedder guessed.
//
// Its own module rather than part of render.ts, for the same reason
// footer.ts is: it is widget chrome, not an event surface. It is also the
// one control here that outlives a layout — it must be reachable from
// `list` and `cards`, the two views with no way back to the calendar, so it
// cannot live in `@event-calendar/core`'s own `ec-toolbar`, which exists
// only inside the lazy-loaded src/calendar-layout.ts.

import type { Lang, Layout } from "./attrs.js";
import { el, svgIcon, withText } from "./dom.js";

const STRINGS = {
  en: {
    label: "View",
    calendar: "Calendar",
    list: "List",
    cards: "Cards",
  },
  es: {
    label: "Vista",
    calendar: "Calendario",
    list: "Lista",
    cards: "Tarjetas",
  },
} as const;

const ICONS: Record<Layout, string[]> = {
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],
  list: ["M4 6h16", "M4 12h16", "M4 18h16"],
  cards: [
    "M4 4h7v7H4z",
    "M13 4h7v7h-7z",
    "M4 13h7v7H4z",
    "M13 13h7v7h-7z",
  ],
};

export interface ViewSwitcherState {
  /** The views the visitor may choose, in render order; fewer than two renders nothing. */
  views: readonly Layout[];
  /** The view this render is showing — the one button that reads as pressed. */
  active: Layout;
  lang: Lang;
  onSelect(view: Layout): void;
}

/**
 * `undefined` when there is to be no switcher — `views="none"`, or a
 * single-view allow-list. Same contract as `renderFooter()`: the scroll
 * wrapper the height budget needs is mounted by whether there is chrome at
 * all (see render.ts), so "no switcher" has to be an absent node rather
 * than an empty one.
 *
 * Toggle buttons with `aria-pressed`, inside a labelled `role="group"` —
 * not `role="radiogroup"`. A radio group owes the visitor arrow-key
 * navigation and a single tab stop, which means managing `tabindex` across
 * a tree this widget rebuilds on every render; a group of three ordinary
 * buttons is already operable by Tab and Enter/Space with nothing to
 * manage, and `aria-pressed` carries which one is current. The issue asks
 * for either.
 */
export function renderViewSwitcher(state: ViewSwitcherState): HTMLElement | undefined {
  if (state.views.length < 2) return undefined;
  const strings = STRINGS[state.lang];
  const switcher = el("div", "view-switcher");
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", strings.label);

  for (const view of state.views) {
    const button = el("button", "view-button");
    button.type = "button";
    button.dataset.view = view;
    button.setAttribute("aria-pressed", String(view === state.active));
    // The label is text, not a tooltip on an icon: three unlabelled glyphs
    // is what the issue's acceptance criteria rules out. The icon is
    // decorative (aria-hidden in svgIcon) and the text is the accessible
    // name; `title` repeats it for a pointer, and is what shows if a host
    // page's own CSS ever hides the span (theme.css.ts explains why the
    // widget does not hide it itself).
    button.title = strings[view];
    button.append(svgIcon(ICONS[view], "view-icon"), withText(el("span", "view-button-label"), strings[view]));
    button.addEventListener("click", () => state.onSelect(view));
    switcher.append(button);
  }
  return switcher;
}
