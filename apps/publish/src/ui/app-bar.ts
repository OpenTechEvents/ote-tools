import { uiIcon } from "../lib/icons.js";
import { readTheme, writeTheme, type Theme } from "../lib/store.js";
import { formatWhen } from "../lib/submission.js";
import { currentEvent, type AppContext } from "./context.js";

const chip = document.querySelector<HTMLButtonElement>("#event-chip")!;
const chipName = document.querySelector<HTMLElement>("#event-chip-name")!;
const chipDate = document.querySelector<HTMLElement>("#event-chip-date")!;
const feedChip = document.querySelector<HTMLElement>("#feed-chip")!;
const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle")!;

/**
 * The pinned event, in the one place it stays visible from every destination.
 *
 * This is the whole navigation model in one control: pick once, then browse
 * destinations without ever answering "which event?" again.
 */
export function renderAppBar(context: AppContext): void {
  const event = currentEvent(context.state);
  chip.hidden = event === undefined;
  if (!event) return;
  chipName.textContent = event.name;
  chipDate.textContent = formatWhen(event);
}

export function setFeedLabel(text: string, title?: string): void {
  feedChip.textContent = text;
  if (title !== undefined) feedChip.title = title;
}

export function wireEventChip(onOpen: () => void): void {
  chip.addEventListener("click", onOpen);
}

/**
 * The wordmark goes back to the dashboard, not to a bare reload.
 *
 * It keeps `?feed=`/`?repo=` in its href so opening it in a new tab still
 * lands on the same feed, and intercepts the plain click so the trip home
 * costs nothing — the feed is already fetched and validated.
 */
export function wireBrand(onHome?: () => void): void {
  const brand = document.querySelector<HTMLAnchorElement>("#brand")!;
  // Set on every call, including the one before the feed has loaded: the
  // error states are exactly where reloading into a feedless page hurts most.
  brand.href = `./${window.location.search}`;
  if (!onHome) return;
  brand.addEventListener("click", (event) => {
    // Leave modified clicks alone: they mean "open this somewhere else".
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    onHome();
  });
}

// --- theme ------------------------------------------------------------------

/**
 * Light, dark, or whatever the system says — cycled in that order.
 *
 * The stored value is only ever an explicit choice; "system" is the absence of
 * one, so an organizer who never touches this keeps following their OS, and
 * one who does keeps their choice even when the OS flips at sunset.
 */
export function wireTheme(): void {
  let theme = readTheme();
  const apply = (): void => {
    if (theme === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", theme);
    const labels: Record<Theme, string> = {
      system: "Theme: following your system",
      light: "Theme: light",
      dark: "Theme: dark",
    };
    themeToggle.replaceChildren(uiIcon(theme === "dark" ? "moon" : "sun"));
    themeToggle.title = labels[theme];
    themeToggle.setAttribute("aria-label", `${labels[theme]}. Click to change.`);
  };
  themeToggle.addEventListener("click", () => {
    theme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    writeTheme(theme);
    apply();
  });
  apply();
}
