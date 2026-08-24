import {
  embedPreviewAttributes,
  embedSnippet,
  type EmbedOptions,
} from "../../lib/site-snippets.js";
import { currentEvent, type AppContext } from "../context.js";
import {
  checkboxControl,
  controls,
  numberControl,
  scopeControl,
  selectControl,
} from "../controls.js";
import { el, link, muted, sentence, snippetBlock } from "../dom.js";
import { widgetPreview } from "./preview.js";

export function embedPanel(context: AppContext): HTMLElement {
  const { state } = context;
  const body = el("div");
  const options = state.embedOptions;
  const update = (change: Partial<EmbedOptions>): void => {
    state.embedOptions = { ...options, ...change };
    context.renderStage();
  };

  const event = currentEvent(state);
  const singleEvent = event !== undefined && state.scope === "event";

  body.append(
    muted(
      "Unlike the SEO snippet, this one stays current on its own: the widget re-reads your feed every time the page loads.",
    ),
  );

  if (event) {
    body.append(
      scopeControl(event.name, state.scope, (scope) => {
        state.scope = scope;
        context.renderStage();
      }),
    );
  }

  body.append(
    controls([
      selectControl(
        "Layout",
        [
          ["cards", "Cards"],
          ["list", "List"],
          ["calendar", "Calendar"],
        ],
        options.layout,
        (value) => update({ layout: value as EmbedOptions["layout"] }),
      ),
      selectControl(
        "Theme",
        [
          ["auto", "Follow the page"],
          ["light", "Light"],
          ["dark", "Dark"],
        ],
        options.theme,
        (value) => update({ theme: value as EmbedOptions["theme"] }),
      ),
      ...(options.layout === "cards"
        ? [
            selectControl(
              "Card width",
              [
                ["", "Default"],
                ["small", "Small"],
                ["medium", "Medium"],
                ["large", "Large"],
              ],
              options.cardWidth ?? "",
              (value) => update({ cardWidth: (value || undefined) as EmbedOptions["cardWidth"] }),
            ),
          ]
        : []),
      // Both only mean anything to a feed: one event is one card, and it is
      // shown whether or not it has already happened.
      ...(singleEvent
        ? []
        : [
            numberControl("Show at most", "All", options.limit, (value) => update({ limit: value })),
            checkboxControl("Include past events", options.showPast, (value) =>
              update({ showPast: value }),
            ),
          ]),
    ]),
  );

  const effective: EmbedOptions = singleEvent
    ? { ...options, eventId: event.id, limit: undefined, showPast: false }
    : options;

  body.append(
    muted(
      singleEvent
        ? "Pinned to this event by its OTE id, so the card stays right even if the event is edited — and it keeps showing after the date passes, which is what an event's own page needs."
        : "The widget shows your whole feed and re-reads it on every page load, so it never goes stale.",
    ),
    widgetPreview("ote-events", embedPreviewAttributes(state.feedUrl, effective)),
    snippetBlock(embedSnippet(state.feedUrl, effective)),
    sentence(
      "Fields, grouping, custom actions and every other attribute: ",
      link("https://tools.opentechevents.org/embed/", "the full widget playground"),
      ".",
    ),
  );
  return body;
}
