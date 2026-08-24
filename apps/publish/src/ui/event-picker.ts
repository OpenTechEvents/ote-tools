import type { OteEvent } from "@opentechevents/export-jsonld";

import { uiIcon } from "../lib/icons.js";
import { writePinnedEvent } from "../lib/store.js";
import { formatWhen } from "../lib/submission.js";
import type { AppContext } from "./context.js";
import { el } from "./dom.js";

const dialog = document.querySelector<HTMLDialogElement>("#event-picker")!;
const closeButton = document.querySelector<HTMLButtonElement>("#event-picker-close")!;
const filter = document.querySelector<HTMLInputElement>("#event-filter")!;
const list = document.querySelector<HTMLElement>("#event-list")!;

/**
 * Choosing the event is a deliberate, occasional act, so it gets a dialog
 * rather than a dropdown sitting in the toolbar inviting a re-pick. Upcoming
 * events first: an organizer is almost always publishing something that has
 * not happened yet.
 */
export function wireEventPicker(context: AppContext): () => void {
  closeButton.replaceChildren(uiIcon("x"));
  closeButton.addEventListener("click", () => dialog.close());
  filter.addEventListener("input", () => renderList(context));

  return () => {
    filter.value = "";
    renderList(context);
    dialog.showModal();
    filter.focus();
  };
}

function renderList(context: AppContext): void {
  const query = filter.value.trim().toLowerCase();
  const today = new Date().toISOString().slice(0, 10);
  const matches = context.state.feed.events.filter((event) =>
    query === "" ? true : event.name.toLowerCase().includes(query),
  );

  const upcoming = matches
    .filter((event) => event.startDate.slice(0, 10) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = matches
    .filter((event) => event.startDate.slice(0, 10) < today)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  list.replaceChildren();
  if (matches.length === 0) {
    list.append(el("p", "muted", "No event matches that."));
    return;
  }
  if (upcoming.length > 0) {
    list.append(el("h3", "picker-heading", "Upcoming"));
    for (const event of upcoming) list.append(row(context, event));
  }
  if (past.length > 0) {
    list.append(el("h3", "picker-heading", "Already happened"));
    for (const event of past) list.append(row(context, event));
  }
}

function row(context: AppContext, event: OteEvent): HTMLElement {
  const button = el("button", "picker-row");
  button.type = "button";
  if (event.id === context.state.eventId) button.setAttribute("aria-current", "true");
  const text = el("span", "picker-text");
  text.append(el("span", "picker-name", event.name), el("span", "picker-date", formatWhen(event)));
  button.append(text);
  if (event.id === context.state.eventId) button.append(uiIcon("check"));
  button.addEventListener("click", () => {
    context.state.eventId = event.id;
    // A profile guessed for the previous event says nothing about this one.
    context.state.profileOverride = null;
    writePinnedEvent(context.state.feedUrl, event.id);
    dialog.close();
    context.render();
  });
  return button;
}
