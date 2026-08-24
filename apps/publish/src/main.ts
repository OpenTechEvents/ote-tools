import { type OteFeed } from "@opentechevents/export-jsonld";
import { validateFeed } from "@opentechevents/validate";

import { feedUrls, parseFeedSource, type FeedSource } from "./lib/feed-source.js";
import { DEFAULT_EMBED_OPTIONS } from "./lib/site-snippets.js";
import {
  readFavourites,
  readPinnedEvent,
  resolvePinnedEvent,
  writePinnedEvent,
} from "./lib/store.js";
import { renderAppBar, setFeedLabel, wireBrand, wireEventChip, wireTheme } from "./ui/app-bar.js";
import type { AppContext, State } from "./ui/context.js";
import { el } from "./ui/dom.js";
import { renderDestination, wireDestinationChrome } from "./ui/destination.js";
import { wireEventPicker } from "./ui/event-picker.js";
import { renderHome } from "./ui/home.js";

const message = document.querySelector<HTMLElement>("#message")!;
const main = document.querySelector<HTMLElement>("#main")!;
const homeView = document.querySelector<HTMLElement>("#home-view")!;
const destinationView = document.querySelector<HTMLElement>("#destination-view")!;

function showMessage(heading: string, body: string, isError: boolean): void {
  message.className = isError ? "panel error" : "panel";
  message.replaceChildren(el("h2", undefined, heading), el("p", undefined, body));
  message.hidden = false;
}

/**
 * The whole navigation model: two views, one function that owns every piece of
 * chrome either of them needs. No router and no hash — the same shape
 * `apps/editor` uses, for the same reason: a static tool opened from a
 * dashboard link has exactly one meaningful URL parameter, and it is the feed.
 */
function showView(context: AppContext): void {
  const onHome = context.state.view === "home";
  homeView.hidden = !onHome;
  destinationView.hidden = onHome;
  renderAppBar(context);
  if (onHome) renderHome(context);
  else renderDestination(context);
  window.scrollTo({ top: 0 });
}

// --- loading ----------------------------------------------------------------

async function fetchFeed(
  source: FeedSource,
): Promise<{ url: string; text: string } | { error: string }> {
  const urls = feedUrls(source);
  for (const url of urls) {
    const cacheBusted = new URL(url);
    cacheBusted.searchParams.set("_", String(Date.now()));
    const response = await fetch(cacheBusted).catch(() => null);
    if (response?.ok) return { url, text: await response.text() };
  }
  return {
    error:
      urls.length > 1
        ? "Could not fetch feed.json from GitHub Pages or the default branch."
        : `Could not fetch ${urls[0]!}.`,
  };
}

async function boot(): Promise<void> {
  wireTheme();
  wireBrand();

  const source = parseFeedSource(window.location.search);
  if (source === null) {
    showMessage(
      "No feed to broadcast",
      "Open this tool from your dashboard, or add a feed to the URL: ?repo=owner/name or ?feed=https://…/feed.json.",
      false,
    );
    return;
  }

  setFeedLabel(source.kind === "repo" ? source.repo : source.url);

  const result = await fetchFeed(source);
  if ("error" in result) {
    showMessage("Feed not found", result.error, true);
    return;
  }

  let json: unknown;
  try {
    json = JSON.parse(result.text);
  } catch (error) {
    showMessage("Not valid JSON", (error as Error).message, true);
    return;
  }

  // Every destination maps the feed's own fields onto someone else's format;
  // none of them validates. An invalid feed would be broadcast, errors and
  // all, to every destination at once — so it stops here.
  const validation = validateFeed(json);
  if (!validation.valid) {
    message.className = "panel error";
    message.replaceChildren(
      el("h2", undefined, "This feed is not valid OTE"),
      el(
        "p",
        undefined,
        "Fix it before broadcasting from it — every destination would carry the same errors.",
      ),
    );
    const list = el("ul");
    for (const error of validation.errors) {
      const item = el("li");
      item.append(el("code", undefined, error.path), document.createTextNode(` — ${error.message}`));
      list.append(item);
    }
    message.append(list);
    message.hidden = false;
    return;
  }

  const feed = json as OteFeed;
  setFeedLabel(
    `${feed.title} · ${feed.events.length} event${feed.events.length === 1 ? "" : "s"}`,
    result.url,
  );

  const eventId = resolvePinnedEvent(feed.events, readPinnedEvent(result.url));
  // Write it back so the next visit opens on the same event even when this one
  // came from the upcoming-event fallback rather than from a stored choice.
  writePinnedEvent(result.url, eventId);

  const state: State = {
    feed,
    feedUrl: result.url,
    eventId,
    profileOverride: null,
    favourites: readFavourites(),
    view: "home",
    activeDestination: null,
    // Stacked on a phone the sidebar is a 26-item wall standing between the
    // organizer and the panel they just asked for, so it starts folded there.
    sidebarCollapsed: window.matchMedia("(max-width: 46rem)").matches,
    scope: "event",
    feedScope: "graph",
    embedOptions: { ...DEFAULT_EMBED_OPTIONS },
    subscribeOptions: { layout: "menu" },
  };

  const context: AppContext = {
    state,
    render: () => showView(context),
    renderStage: () => renderDestination(context),
    open: (id) => {
      state.activeDestination = id;
      state.view = "destination";
      // Subscribing is feed-level by nature — nobody follows one event.
      // Everything else opens on the pinned event, which is what publishing an
      // event means; the two feed-scoped panels offer to widen from there.
      state.scope = id === "subscribe" ? "feed" : "event";
      showView(context);
    },
    goHome: () => {
      state.view = "home";
      state.activeDestination = null;
      showView(context);
    },
  };

  wireDestinationChrome(context);
  wireBrand(() => context.goHome());
  const openPicker = wireEventPicker(context);
  wireEventChip(openPicker);

  main.hidden = false;
  showView(context);
}

void boot();
