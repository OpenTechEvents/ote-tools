import { loadWidget } from "../../lib/preview.js";
import { el } from "../dom.js";

/**
 * A pane running the real widget. Not a screenshot and not a bundled copy:
 * it loads the same versioned asset the snippet names, so what the organizer
 * sees here is literally what their visitors will get.
 */
export function widgetPreview(
  tag: "ote-events" | "ote-subscribe",
  attrs: Record<string, string>,
): HTMLElement {
  const wrapper = el("div", tag === "ote-subscribe" ? "preview preview-open" : "preview");
  wrapper.append(
    el("div", "preview-label", "Live preview — the real widget, from the same URL as the snippet"),
  );
  // The subscribe widget opens a popover: capping and scrolling its pane
  // would clip the very thing the preview exists to show.
  const body = el(
    "div",
    tag === "ote-subscribe" ? "preview-body preview-body-open" : "preview-body",
  );
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
  body.append(element);
  wrapper.append(body);

  const file = tag === "ote-events" ? "ote-events.js" : "ote-subscribe.js";
  void loadWidget(file, __EMBED_VERSION__).then((ok) => {
    if (ok) return;
    // Offline, or a version not deployed yet. Say so plainly rather than
    // leaving an empty rectangle that looks like a broken widget.
    body.replaceChildren(
      el(
        "p",
        "muted",
        "Preview unavailable here — the widget assets could not be loaded. The snippet below is still correct.",
      ),
    );
  });
  return wrapper;
}
