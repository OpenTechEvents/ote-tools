import { buildSnippet, eligibilityNote, SCOPE_HELP, type SnippetScope } from "../../lib/snippet.js";
import { currentEvent, type AppContext } from "../context.js";
import { scopeControl } from "../controls.js";
import { el, link, muted, sentence, snippetBlock } from "../dom.js";

export function schemaOrgPanel(context: AppContext): HTMLElement {
  const { state } = context;
  const event = currentEvent(state);
  const body = el("div");

  if (event) {
    body.append(
      scopeControl(event.name, state.scope, (scope) => {
        state.scope = scope;
        context.renderStage();
      }),
    );
  }

  const index = event ? state.feed.events.indexOf(event) : -1;
  const scope: SnippetScope =
    state.scope === "event" && index >= 0
      ? { kind: "event", index }
      : { kind: state.feedScope === "item-list" ? "item-list" : "graph" };

  if (scope.kind !== "event") {
    // Which shape a listing page needs is the organizer's call, not something
    // the feed can say: Google requires the markup to describe what the page
    // visibly shows.
    const chooser = el("fieldset", "scope");
    chooser.append(el("legend", undefined, "What does the page show?"));
    for (const [value, title] of [
      ["graph", "The events themselves"],
      ["item-list", "A listing that links elsewhere"],
    ] as const) {
      const label = el("label");
      const input = el("input");
      input.type = "radio";
      input.name = "feed-scope";
      input.value = value;
      input.checked = state.feedScope === value;
      input.addEventListener("change", () => {
        state.feedScope = value;
        context.renderStage();
      });
      const text = el("span");
      text.append(el("strong", undefined, title), el("em", undefined, SCOPE_HELP[value]));
      label.append(input, text);
      chooser.append(label);
    }
    body.append(chooser);
  } else {
    body.append(muted(SCOPE_HELP.event));
  }

  body.append(
    muted(
      "Paste it anywhere inside <head> or <body>. Nothing changes visually — it is the machine-readable copy of what the page already shows, and it is a copy of your data rather than a live link, so regenerate it when the feed changes.",
    ),
    snippetBlock(buildSnippet(state.feed, scope)),
    sentence(
      "Check the result with ",
      link("https://search.google.com/test/rich-results", "Google's Rich Results Test"),
      ".",
    ),
    sentence(
      "Some directories read this straight off your page instead of asking you to fill a form — ",
      link("https://dev.events/new", "dev.events"),
      " is one, so this snippet can save you that submission entirely.",
    ),
  );

  const note = eligibilityNote(state.feed, scope);
  if (note !== null) body.append(el("p", "note", note));
  return body;
}
