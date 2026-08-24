import type { OteEvent } from "@opentechevents/export-jsonld";

import type { Destination } from "../../lib/destinations.js";
import { uiIcon } from "../../lib/icons.js";
import { submissionFields } from "../../lib/submission.js";
import { copyToClipboard, el, link, muted } from "../dom.js";

const VIA_LABEL: Record<Destination["submitVia"], string> = {
  form: "Open their submission form",
  issue: "Open a prefilled issue",
  "pull-request": "Open their repository",
  api: "Open their submission page",
  paste: "Open the destination",
};

/**
 * The submission sheet: this event's own answers, in the order a form asks
 * for them, each one a click away from the clipboard.
 *
 * It is not automation and does not pretend to be. It closes the gap that
 * actually costs an organizer their evening — hunting their own event data
 * out of a repository, eight times, for eight forms — and it needs no API, no
 * account and no credentials to do it, which is why every destination can
 * have one on day one.
 */
export function sheetPanel(event: OteEvent, destination: Destination): HTMLElement {
  const body = el("div");
  const fields = submissionFields(event, destination);
  const missing = fields.filter((field) => field.missing).length;

  if (destination.submitUrl) {
    const actions = el("div", "cta-row");
    const open = link(destination.submitUrl, VIA_LABEL[destination.submitVia], "button-link");
    open.append(uiIcon("external-link"));
    actions.append(open);
    body.append(actions);
  }

  body.append(
    muted(
      "Open their form beside this and work down. Nothing here is sent anywhere — you are the one submitting.",
    ),
  );

  const list = el("dl", "sheet");
  for (const field of fields) {
    const term = el("dt", field.missing ? "missing" : undefined, field.label);
    const definition = el("dd", field.missing ? "missing" : undefined);
    if (field.missing) {
      definition.append(
        el("span", "sheet-missing", "Not in your event"),
        el("span", "sheet-wanted", `— ${field.wanted}`),
      );
    } else {
      const value = el(field.long ? "pre" : "span", "sheet-value", field.value);
      const button = el("button", "icon-button sheet-copy");
      button.type = "button";
      button.title = `Copy ${field.label.toLowerCase()}`;
      button.setAttribute("aria-label", button.title);
      button.append(uiIcon("copy"));
      const status = el("span", "visually-hidden");
      status.setAttribute("role", "status");
      button.addEventListener("click", () => copyToClipboard(field.value!, status));
      definition.append(value, button, status);
    }
    list.append(term, definition);
  }
  body.append(list);

  body.append(
    muted(
      missing === 0
        ? "Nothing missing: every field a form asks for is already in your event."
        : `${missing} field(s) are not in your event. No destination can invent them — add them once in the editor and every submission after this one has them.`,
    ),
  );

  if (destination.note) body.append(el("p", "note", destination.note));
  return body;
}
