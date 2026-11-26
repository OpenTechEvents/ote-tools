// The widget's header (#183): month navigation on the left, the view
// switcher on the right — one row that exists in every layout.
//
// Its own module rather than part of render.ts, for the same reason
// footer.ts is: it is widget chrome, not an event surface.
//
// The order is Google Calendar's, and so is the division of labour: the
// nav acts on what is on screen, the view control floats right and stays
// put across layouts. Two deliberate differences, both from this widget
// being embedded rather than being the page:
//
//   - **The view control is a segmented group, not a dropdown.** Google
//     hides seven views plus checkboxes behind one; with three, hiding
//     costs discoverability (nobody learns `cards` exists), a click, and a
//     menu's keyboard contract — in a shadow root, where "clicked outside"
//     is the bug calendar-layout.ts documents. It degrades to icons, and
//     only then to a native <select>, when the row genuinely runs out of
//     width (element.ts measures; see `HeaderDensity`).
//   - **There is no "Next event" button.** The calendar already *opens* on
//     the next event (`initial-date`, #167), and the list and cards views
//     answer "what is next" better than a jump ever did.
//
// The nav exists only in `layout="calendar"`: nothing in `list`/`cards`
// has a month to page.

import type { Lang, Layout } from "./attrs.js";
import { el, svgIcon, withText } from "./dom.js";

const STRINGS = {
  en: {
    label: "View",
    calendar: "Calendar",
    list: "List",
    cards: "Cards",
    today: "Today",
    prev: "Previous month",
    next: "Next month",
  },
  es: {
    label: "Vista",
    calendar: "Calendario",
    list: "Lista",
    cards: "Tarjetas",
    today: "Hoy",
    prev: "Mes anterior",
    next: "Mes siguiente",
  },
} as const;

const ICONS: Record<Layout, string[]> = {
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],
  list: ["M4 6h16", "M4 12h16", "M4 18h16"],
  cards: ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"],
};

const CHEVRONS = {
  prev: ["M15 5l-7 7 7 7"],
  next: ["M9 5l7 7-7 7"],
};

/**
 * How much room the row has, decided by measuring it rather than by a media
 * query: a media query inside a shadow root follows the **viewport**, and
 * this widget lives in a column (the #169 mistake, re-made once by this very
 * row and removed again — see apps/embed/CLAUDE.md).
 *
 * `full` labels every view; `icons` keeps the names as accessible names
 * only; `menu` is the fallback where even three icons plus the month nav do
 * not fit.
 */
export type HeaderDensity = "full" | "icons" | "menu";

export interface HeaderNavState {
  /** The library's own rendered title — undefined until the lazy calendar chunk has mounted. */
  title?: string;
  /** Whether today is inside the range on screen, which greys the Today button. */
  showsToday?: boolean;
  onNav(action: "prev" | "next" | "today"): void;
}

export interface HeaderState {
  /** The views the visitor may choose, in render order; fewer than two renders no switcher. */
  views: readonly Layout[];
  /** The view this render is showing — the one control that reads as current. */
  active: Layout;
  lang: Lang;
  density: HeaderDensity;
  /** Only in `layout="calendar"`: the month navigation. */
  nav?: HeaderNavState;
  onSelect(view: Layout): void;
}

/**
 * `undefined` when there is to be no header at all: no switcher to draw
 * (`views="none"`, or a single view) and no month to page. Same contract as
 * `renderFooter()` — the scroll wrapper the height budget needs is mounted
 * by whether there is chrome at all (see render.ts), so "no header" has to
 * be an absent node rather than an empty one.
 */
export function renderHeader(state: HeaderState): HTMLElement | undefined {
  const strings = STRINGS[state.lang];
  const switcher = state.views.length > 1 ? viewControl(state, strings) : undefined;
  const nav = state.nav ? navGroup(state.nav, strings) : undefined;
  if (!switcher && !nav) return undefined;

  const header = el("div", "ote-header");
  if (nav) header.append(nav);
  if (switcher) header.append(switcher);
  return header;
}

function navGroup(nav: HeaderNavState, strings: (typeof STRINGS)[Lang]): HTMLElement {
  const group = el("div", "header-nav");

  const today = withText(el("button", "header-today"), strings.today);
  today.type = "button";
  // Disabled rather than hidden while the month on screen already contains
  // today: the button's job is to say where you are as much as to take you
  // there, and a control that disappears moves everything beside it.
  today.disabled = nav.showsToday !== false;
  today.addEventListener("click", () => nav.onNav("today"));
  group.append(today);

  for (const action of ["prev", "next"] as const) {
    const button = el("button", "header-arrow");
    button.type = "button";
    button.dataset.nav = action;
    // Icon-only, so the name is the attribute: "‹" is not a label.
    button.setAttribute("aria-label", strings[action]);
    button.title = strings[action];
    // Before the lazy calendar chunk reports a title there is nothing to
    // page, and a button that looks live but does nothing is worse than one
    // that is plainly not ready yet.
    button.disabled = nav.title === undefined;
    button.append(svgIcon(CHEVRONS[action], "header-arrow-icon"));
    button.addEventListener("click", () => nav.onNav(action));
    group.append(button);
  }

  // aria-live, not a heading: the month is the one thing on this row that
  // changes without the visitor moving focus, and a heading inside an
  // embedded widget lands in someone else's document outline.
  const title = el("span", "header-title");
  title.setAttribute("aria-live", "polite");
  if (nav.title) title.textContent = nav.title;
  group.append(title);
  return group;
}

/**
 * Toggle buttons with `aria-pressed`, inside a labelled `role="group"` —
 * not `role="radiogroup"`. A radio group owes the visitor arrow-key
 * navigation and a single tab stop, which means managing `tabindex` across
 * a tree this widget rebuilds on every render; a group of ordinary buttons
 * is already operable by Tab and Enter/Space with nothing to manage, and
 * `aria-pressed` carries which one is current.
 *
 * At `density: "menu"` it becomes a native `<select>` instead. That is not
 * a lesser fallback: the platform renders its popup in the top layer, with
 * its own keyboard and touch behaviour and no "clicked outside" to detect —
 * the one thing a hand-built menu inside a shadow root gets wrong (see
 * `suppressRetargetedOutsideEvents` in calendar-layout.ts).
 */
function viewControl(state: HeaderState, strings: (typeof STRINGS)[Lang]): HTMLElement {
  if (state.density === "menu") return viewSelect(state, strings);

  const switcher = el("div", "view-switcher");
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", strings.label);
  for (const view of state.views) {
    const button = el("button", "view-button");
    button.type = "button";
    button.dataset.view = view;
    button.setAttribute("aria-pressed", String(view === state.active));
    // The icon is decorative (aria-hidden in svgIcon) and the text is the
    // accessible name — at `density: "icons"` the span is still in the DOM
    // and only hidden visually, so the name survives and `title` serves a
    // pointer.
    button.title = strings[view];
    button.append(svgIcon(ICONS[view], "view-icon"), withText(el("span", "view-button-label"), strings[view]));
    button.addEventListener("click", () => state.onSelect(view));
    switcher.append(button);
  }
  return switcher;
}

function viewSelect(state: HeaderState, strings: (typeof STRINGS)[Lang]): HTMLElement {
  const wrapper = el("div", "view-select-wrapper");
  wrapper.append(svgIcon(ICONS[state.active], "view-icon"));
  const select = el("select", "view-select");
  select.setAttribute("aria-label", strings.label);
  for (const view of state.views) {
    const option = withText(el("option"), strings[view]);
    option.value = view;
    option.selected = view === state.active;
    select.append(option);
  }
  select.addEventListener("change", () => state.onSelect(select.value as Layout));
  wrapper.append(select);
  return wrapper;
}
