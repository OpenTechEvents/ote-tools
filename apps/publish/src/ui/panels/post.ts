import type { OteEvent } from "@opentechevents/export-jsonld";

import type { Destination } from "../../lib/destinations.js";
import { uiIcon } from "../../lib/icons.js";
import { composePost, composerUrl, submissionFields } from "../../lib/submission.js";
import { el, link, muted, snippetBlock } from "../dom.js";

/**
 * The announcement, in one network's own markup and inside its own limit.
 *
 * Copy only. No scheduling, no posting on the organizer's behalf and no
 * third-party credentials — a non-goal inherited from spec#12 and one worth
 * restating on the panel itself, because "post for me" is what everyone
 * assumes a broadcast tool does.
 */
export function postPanel(event: OteEvent, destination: Destination): HTMLElement {
  const body = el("div");
  const post = composePost(event, destination.id);

  const counter = el("p", post.trimmed ? "note" : "muted");
  counter.textContent = post.trimmed
    ? `${post.text.length} of ${post.limit} characters — the description was cut to fit. Edit it after pasting if the ending matters.`
    : `${post.text.length} of ${post.limit} characters.`;

  const composer = composerUrl(destination.id, post.text, event.url);
  if (composer) {
    const actions = el("div", "cta-row");
    const open = link(composer, `Open ${destination.name} with this text`, "button-link");
    open.append(uiIcon("external-link"));
    actions.append(open);
    body.append(actions);
  } else {
    body.append(
      muted(
        destination.id === "mastodon"
          ? "Mastodon's composer lives on whichever instance you are signed in to, so there is no single link to open — copy the text and paste it there."
          : `${destination.name} has no link that carries text into its composer, so copy and paste is the whole flow.`,
      ),
    );
  }

  body.append(counter, snippetBlock(post.text, "post"));

  // The image only matters once there is one. Nagging about missing alt text
  // on an event that has no image at all is the kind of misfiring warning
  // that teaches people to stop reading them.
  const fields = submissionFields(event, destination);
  const image = fields.find((field) => field.label === "Image");
  const alt = fields.find((field) => field.label === "Image alt text");
  if (image && !image.missing) {
    const row = el("p", "muted");
    row.append(el("strong", undefined, "Image: "), link(image.value!, image.value!, "break"));
    body.append(row);
    body.append(
      alt?.missing !== false
        ? el(
            "p",
            "note",
            "Your event image has no alt text. Every network asks for it and almost nobody fills it in — add it once in the editor and every post from here carries it.",
          )
        : muted(`Alt text: ${alt.value!}`),
    );
  }

  body.append(
    el(
      "p",
      "note",
      destination.note ??
        "Text to copy, never a post on your behalf: this tool holds no account of yours and never will.",
    ),
  );
  return body;
}
