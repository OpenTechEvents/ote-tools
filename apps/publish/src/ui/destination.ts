import {
  acceptsProfile,
  destinationById,
  destinationsForGroup,
  GROUPS,
  type Destination,
} from "../lib/destinations.js";
import type { EventProfile } from "../lib/event-profile.js";
import { destinationMark, uiIcon } from "../lib/icons.js";
import { toggleFavourite, writeFavourites } from "../lib/store.js";
import { currentEvent, currentProfile, type AppContext } from "./context.js";
import { el, link, muted } from "./dom.js";
import { AUTOMATION_HELP, AUTOMATION_LABEL } from "./home.js";
import { embedPanel } from "./panels/embed.js";
import { placeholderPanel } from "./panels/placeholder.js";
import { postPanel } from "./panels/post.js";
import { schemaOrgPanel } from "./panels/schema-org.js";
import { sheetPanel } from "./panels/sheet.js";
import { subscribePanel } from "./panels/subscribe.js";

const view = document.querySelector<HTMLElement>("#destination-view")!;
const sidebarList = document.querySelector<HTMLElement>("#sidebar-list")!;
const backHome = document.querySelector<HTMLButtonElement>("#back-home")!;
const sidebarToggle = document.querySelector<HTMLButtonElement>("#sidebar-toggle")!;
const stage = document.querySelector<HTMLElement>("#stage")!;

export function wireDestinationChrome(context: AppContext): void {
  // The label is a span so the collapsed rail can hide it: a bare text node
  // has nothing to hang `display: none` on and wraps into the 3rem column.
  backHome.replaceChildren(uiIcon("arrow-left"), el("span", undefined, "All destinations"));
  backHome.title = "All destinations";
  backHome.setAttribute("aria-label", "All destinations");
  backHome.addEventListener("click", () => context.goHome());
  sidebarToggle.addEventListener("click", () => {
    context.state.sidebarCollapsed = !context.state.sidebarCollapsed;
    renderDestination(context);
  });
}

export function renderDestination(context: AppContext): void {
  const { profile } = currentProfile(context.state);
  view.dataset.sidebar = context.state.sidebarCollapsed ? "collapsed" : "open";
  sidebarToggle.replaceChildren(
    uiIcon(context.state.sidebarCollapsed ? "panel-left-open" : "panel-left-close"),
  );
  sidebarToggle.title = context.state.sidebarCollapsed ? "Show the list" : "Hide the list";
  sidebarToggle.setAttribute("aria-label", sidebarToggle.title);
  sidebarToggle.setAttribute("aria-expanded", String(!context.state.sidebarCollapsed));

  renderSidebar(context, profile);
  renderStage(context, profile);
}

/**
 * Every destination, always reachable. Publishing one event means visiting a
 * handful of these in a row, and making that a trip back to the dashboard each
 * time is the friction that stops people at destination three.
 */
function renderSidebar(context: AppContext, profile: EventProfile): void {
  sidebarList.replaceChildren();
  for (const group of GROUPS) {
    const section = el("div", "sidebar-group");
    const heading = el("p", "sidebar-heading");
    heading.append(uiIcon(group.icon, "icon group-icon"), document.createTextNode(group.name));
    section.append(heading);

    const list = el("ul");
    for (const destination of destinationsForGroup(group.id, profile)) {
      const item = el("li");
      const button = el("button", "sidebar-item");
      button.type = "button";
      button.title = destination.name;
      if (destination.id === context.state.activeDestination) {
        button.setAttribute("aria-current", "true");
      }
      if (!acceptsProfile(destination, profile)) button.classList.add("sidebar-unfit");
      button.append(
        destinationMark(destination.name, destination.icon, destination.brand),
        el("span", "sidebar-name", destination.name),
        el("span", `dot dot-${destination.automation}`),
      );
      button.addEventListener("click", () => context.open(destination.id));
      item.append(button);
      list.append(item);
    }
    section.append(list);
    sidebarList.append(section);
  }
}

function renderStage(context: AppContext, profile: EventProfile): void {
  const destination = destinationById(context.state.activeDestination ?? "");
  if (!destination) {
    stage.replaceChildren();
    return;
  }
  const event = currentEvent(context.state);

  const panel = el("section", "panel stage-panel");
  panel.append(stageHeader(context, destination, profile));

  if (!acceptsProfile(destination, profile)) {
    panel.append(
      el(
        "p",
        "note",
        `This destination takes ${destination.accepts}s only, and this event looks like a ${profile}. You can still prepare a submission — change what it is treated as above if the guess is wrong.`,
      ),
    );
  }

  panel.append(body(context, destination, event));
  stage.replaceChildren(panel);
}

function body(
  context: AppContext,
  destination: Destination,
  event: ReturnType<typeof currentEvent>,
): HTMLElement {
  if (destination.automation === "generated") {
    if (destination.id === "schema-org") return schemaOrgPanel(context);
    if (destination.id === "embed") return embedPanel(context);
    return subscribePanel(context);
  }
  if (destination.automation === "assisted" && event) {
    return destination.submitVia === "paste"
      ? postPanel(event, destination)
      : sheetPanel(event, destination);
  }
  return placeholderPanel(destination, event);
}

function stageHeader(
  context: AppContext,
  destination: Destination,
  profile: EventProfile,
): HTMLElement {
  const header = el("div", "stage-header");

  const titleRow = el("div", "stage-title");
  titleRow.append(
    destinationMark(destination.name, destination.icon, destination.brand),
    el("h2", undefined, destination.name),
  );

  const badge = el("span", `badge badge-${destination.automation}`);
  badge.title = AUTOMATION_HELP[destination.automation];
  badge.append(el("span", "dot"), document.createTextNode(AUTOMATION_LABEL[destination.automation]));
  titleRow.append(badge, favouriteButton(context, destination));

  header.append(titleRow, muted(destination.summary));

  const meta = el("div", "stage-meta");
  meta.append(link(destination.homeUrl, new URL(destination.homeUrl).host, "quiet-link"));
  for (const tag of destination.tags ?? []) meta.append(el("span", "tag", TAG_LABEL[tag] ?? tag));
  header.append(meta);

  // Only where the answer changes something. Every destination has a profile;
  // only the picky ones make the organizer care what it is.
  if (destination.accepts !== "any") header.append(profileControl(context, profile));
  return header;
}

const TAG_LABEL: Record<string, string> = {
  cfp: "Call for papers",
  spanish: "Spanish-speaking",
  global: "Worldwide",
  "open-source": "Open source",
};

function profileControl(context: AppContext, profile: EventProfile): HTMLElement {
  const { reason } = currentProfile(context.state);
  const wrapper = el("div", "profile-control");
  const label = el("label", "control");
  label.append(el("span", "control-label", "Treat this event as"));
  const select = el("select");
  for (const [value, text] of [
    ["auto", "Detect automatically"],
    ["meetup", "A meetup"],
    ["conference", "A conference"],
  ] as const) {
    const option = el("option", undefined, text);
    option.value = value;
    option.selected = (context.state.profileOverride ?? "auto") === value;
    select.append(option);
  }
  select.addEventListener("change", () => {
    context.state.profileOverride = select.value === "auto" ? null : (select.value as EventProfile);
    renderDestination(context);
  });
  label.append(select);
  wrapper.append(label, el("p", "muted", `${profile}. ${reason}`));
  return wrapper;
}

function favouriteButton(context: AppContext, destination: Destination): HTMLElement {
  const starred = context.state.favourites.includes(destination.id);
  const button = el("button", starred ? "star starred" : "star");
  button.type = "button";
  button.title = starred ? "Remove from your destinations" : "Add to your destinations";
  button.setAttribute("aria-pressed", String(starred));
  button.setAttribute("aria-label", button.title);
  button.append(uiIcon("star"));
  button.addEventListener("click", () => {
    context.state.favourites = toggleFavourite(context.state.favourites, destination.id);
    writeFavourites(context.state.favourites);
    renderDestination(context);
  });
  return button;
}
