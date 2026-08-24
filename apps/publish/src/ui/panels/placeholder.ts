import type { OteEvent } from "@opentechevents/export-jsonld";

import { buildDestinationUrl, type Destination } from "../../lib/destinations.js";
import { readiness } from "../../lib/event-readiness.js";
import { el, link, muted } from "../dom.js";

/**
 * A destination that does not exist yet. It states what it will produce and
 * what it will never do, and turns the organizer's interest into the two
 * things that actually move it forward: a request, or a maintainer.
 *
 * It never renders a fake preview or a disabled button that looks live. With a
 * catalogue this wide that honesty is what keeps the page from reading as a
 * wall of promises — and it is why most destinations are `assisted` instead:
 * a placeholder is what you ship when there is genuinely nothing useful to do
 * yet, not the default.
 */
export function placeholderPanel(destination: Destination, event: OteEvent | undefined): HTMLElement {
  const body = el("div");
  body.append(el("h3", "sub", "What this will produce"));
  const list = el("ul", "produces");
  for (const item of destination.produces) list.append(el("li", undefined, item));
  body.append(list);
  if (destination.note) body.append(muted(destination.note));

  body.append(readinessSection(event));

  const actions = el("div", "cta-row");
  if (destination.issueUrl) {
    actions.append(link(destination.issueUrl, "Follow the discussion", "button-link secondary"));
  }
  actions.append(link(buildDestinationUrl(destination), "Build this destination", "button-link"));
  body.append(
    actions,
    muted(
      "A destination is a pure function — event in, their own format out. No UI, no credentials, no posting on your behalf.",
    ),
  );
  return body;
}

/**
 * What the pinned event already carries for a destination to use.
 *
 * This is what keeps an unbuilt destination from being pure promise: the
 * fields below are the ones every destination asks for, none of them can be
 * invented, and filling the gaps is work the organizer can do today.
 */
function readinessSection(event: OteEvent | undefined): HTMLElement {
  const section = el("div");
  section.append(el("h3", "sub", "What your event already has"));
  if (!event) {
    section.append(muted("Pick an event to see which fields are ready to go."));
    return section;
  }

  const items = readiness(event);
  const missing = items.filter((item) => !item.present).length;
  const list = el("ul", "readiness");
  for (const item of items) {
    const row = el("li", item.present ? "has" : "missing");
    row.append(el("span", "readiness-mark", item.present ? "✓" : "—"));
    const text = el("span");
    text.append(el("strong", undefined, item.label));
    text.append(
      el("span", "readiness-detail", item.present ? (item.detail ?? "set") : `— ${item.wanted}`),
    );
    row.append(text);
    list.append(row);
  }
  section.append(
    list,
    muted(
      missing === 0
        ? "Nothing missing: every field a destination asks for is already in your feed."
        : `${missing} field(s) missing. No destination can invent them — add them once in the editor and every one of them gets them.`,
    ),
  );
  return section;
}
