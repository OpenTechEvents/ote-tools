import {
  subscribePreviewAttributes,
  subscribeUrls,
  subscribeWidgetSnippet,
  type SubscribeOptions,
} from "../../lib/site-snippets.js";
import type { AppContext } from "../context.js";
import { controls, selectControl } from "../controls.js";
import { el, link, muted, snippetBlock } from "../dom.js";
import { widgetPreview } from "./preview.js";

export function subscribePanel(context: AppContext): HTMLElement {
  const { state } = context;
  const urls = subscribeUrls(state.feedUrl);
  const { ics, rss } = urls;
  const options = { ...state.subscribeOptions, name: state.feed.title };
  const body = el("div");

  body.append(
    muted(
      "Always the whole feed: someone subscribing wants everything you do from now on, not one event. Your feed already publishes these next to feed.json.",
    ),
  );

  const list = el("ul", "link-list");
  for (const [label, url] of [
    ["Calendar (ICS)", ics],
    ["RSS", rss],
  ] as const) {
    const item = el("li");
    item.append(el("strong", undefined, `${label}: `), link(url, url, "break"));
    list.append(item);
  }

  body.append(
    list,
    muted(
      "Or drop in a subscribe button. It opens a menu of every way to follow you: Google Calendar, webcal, an ICS download, Feedly, RSS, and the raw OTE feed.",
    ),
    controls([
      selectControl(
        "Style",
        [
          ["menu", "One button with a menu"],
          ["badges", "One badge per format"],
        ],
        options.layout,
        (value) => {
          state.subscribeOptions = { layout: value as SubscribeOptions["layout"] };
          context.renderStage();
        },
      ),
    ]),
    widgetPreview("ote-subscribe", subscribePreviewAttributes(urls, options)),
    snippetBlock(subscribeWidgetSnippet(urls, options)),
  );

  // Whether those two files are actually published. A fork whose export
  // workflow has not run yet has a perfectly valid feed.json and two dead
  // links — better found here than by the first person who subscribes.
  const availability = muted("Checking the files…");
  body.append(availability);
  void Promise.all(
    [ics, rss].map(async (url) => {
      const response = await fetch(url, { method: "HEAD" }).catch(() => null);
      return Boolean(response?.ok);
    }),
  ).then(([icsOk, rssOk]) => {
    if (icsOk && rssOk) {
      availability.textContent = "Both files are live right now.";
      return;
    }
    const missing = [!icsOk && "feed.ics", !rssOk && "feed.xml"].filter(Boolean).join(" and ");
    availability.className = "note";
    availability.textContent = `${missing} could not be fetched. Your feed.json is fine — it is the export step that has not published them yet.`;
  });
  return body;
}
