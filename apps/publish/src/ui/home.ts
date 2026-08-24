import {
  acceptsProfile,
  buildDestinationUrl,
  destinationById,
  destinationsForGroup,
  GROUPS,
  requestDestinationUrl,
  type Automation,
  type Destination,
} from "../lib/destinations.js";
import { destinationMark, uiIcon } from "../lib/icons.js";
import { toggleFavourite, writeFavourites } from "../lib/store.js";
import { currentProfile, type AppContext } from "./context.js";
import { el, link, muted } from "./dom.js";

const favouritesSection = document.querySelector<HTMLElement>("#favourites")!;
const groupsContainer = document.querySelector<HTMLElement>("#groups")!;
const cta = document.querySelector<HTMLElement>("#home-cta")!;

/**
 * What each level of the ladder is called in front of an organizer.
 *
 * "Guided" rather than "assisted" because the organizer is the one doing it:
 * the tool lays their answers next to the form and gets out of the way. The
 * word has to promise exactly that much and no more — the moment a level reads
 * as "we do it for you", the page has lied.
 */
export const AUTOMATION_LABEL: Record<Automation, string> = {
  generated: "Generated",
  assisted: "Guided",
  planned: "Planned",
};

export const AUTOMATION_HELP: Record<Automation, string> = {
  generated: "Ready to copy in their own format.",
  assisted: "Your event's answers, field by field, next to their form.",
  planned: "Agreed and designed. Nothing built yet.",
};

export function renderHome(context: AppContext): void {
  const { profile } = currentProfile(context.state);

  renderFavourites(context, profile);

  groupsContainer.replaceChildren();
  for (const group of GROUPS) {
    const destinations = destinationsForGroup(group.id, profile);
    const section = el("section", "group");
    const head = el("div", "group-head");
    const heading = el("h2");
    heading.append(uiIcon(group.icon, "icon group-icon"), document.createTextNode(group.name));
    head.append(heading, el("span", "count", String(destinations.length)));
    section.append(head, muted(group.blurb), grid(context, destinations, profile));
    groupsContainer.append(section);
  }

  renderCta();
}

function renderFavourites(context: AppContext, profile: ReturnType<typeof currentProfile>["profile"]): void {
  const favourites = context.state.favourites
    .map((id) => destinationById(id))
    .filter((destination): destination is Destination => destination !== undefined);

  favouritesSection.hidden = favourites.length === 0;
  if (favourites.length === 0) return;

  const head = el("div", "group-head");
  const heading = el("h2");
  heading.append(uiIcon("star", "icon group-icon starred"), document.createTextNode("Your destinations"));
  head.append(heading, el("span", "count", String(favourites.length)));
  favouritesSection.replaceChildren(
    head,
    muted("The ones you starred, in the order you starred them."),
    grid(context, favourites, profile),
  );
}

function grid(
  context: AppContext,
  destinations: Destination[],
  profile: ReturnType<typeof currentProfile>["profile"],
): HTMLElement {
  const wrapper = el("div", "grid");
  for (const destination of destinations) wrapper.append(tile(context, destination, profile));
  return wrapper;
}

function tile(
  context: AppContext,
  destination: Destination,
  profile: ReturnType<typeof currentProfile>["profile"],
): HTMLElement {
  const card = el("div", "tile");
  const fits = acceptsProfile(destination, profile);
  if (!fits) card.classList.add("tile-unfit");

  // The whole card opens the destination; the star is a separate control on
  // top of it, so starring never navigates by accident.
  const open = el("button", "tile-open");
  open.type = "button";
  open.setAttribute("aria-label", `Open ${destination.name}`);
  open.addEventListener("click", () => context.open(destination.id));

  const head = el("div", "tile-head");
  head.append(
    destinationMark(destination.name, destination.icon, destination.brand),
    el("span", "tile-name", destination.name),
  );

  const body = el("div", "tile-body");
  body.append(head, el("p", "tile-summary", destination.summary));

  const foot = el("div", "tile-foot");
  foot.append(automationBadge(destination.automation));
  if (!fits) foot.append(el("span", "tile-fit", `${destination.accepts}s only`));
  body.append(foot);

  card.append(open, body, favouriteButton(context, destination));
  return card;
}

function automationBadge(automation: Automation): HTMLElement {
  const badge = el("span", `badge badge-${automation}`);
  badge.title = AUTOMATION_HELP[automation];
  badge.append(el("span", "dot"), document.createTextNode(AUTOMATION_LABEL[automation]));
  return badge;
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
    context.render();
  });
  return button;
}

/**
 * The catalogue is a claim about where organizers actually publish. Being told
 * it is wrong is the most useful thing this page can collect.
 */
function renderCta(): void {
  const legend = el("div", "legend");
  for (const automation of ["generated", "assisted", "planned"] as const) {
    const item = el("span", `badge badge-${automation}`);
    item.append(el("span", "dot"), document.createTextNode(AUTOMATION_LABEL[automation]));
    const row = el("div", "legend-row");
    row.append(item, el("span", "muted", AUTOMATION_HELP[automation]));
    legend.append(row);
  }

  const actions = el("div", "cta-row");
  actions.append(
    link(requestDestinationUrl(), "Request a destination", "button-link secondary"),
    link(buildDestinationUrl(), "Build one", "button-link secondary"),
  );

  cta.replaceChildren(
    el("h2", undefined, "Somewhere missing?"),
    muted(
      "This list is where organizers actually publish, not where we guessed they might. Tell us what you use — or claim one and build it.",
    ),
    legend,
    actions,
  );
}
