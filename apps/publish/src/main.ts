import { type OteFeed } from "@opentechevents/export-jsonld";
import { validateFeed } from "@opentechevents/validate";

import {
  acceptsProfile,
  buildChannelUrl,
  channelsForGroup,
  CHANNELS,
  GROUPS,
  requestChannelUrl,
  type Channel,
} from "./lib/channels.js";
import { guessProfile, type EventProfile } from "./lib/event-profile.js";
import { readiness } from "./lib/event-readiness.js";
import { loadWidget } from "./lib/preview.js";
import { feedUrls, parseFeedSource, type FeedSource } from "./lib/feed-source.js";
import {
  DEFAULT_EMBED_OPTIONS,
  embedPreviewAttributes,
  embedSnippet,
  subscribePreviewAttributes,
  subscribeUrls,
  subscribeWidgetSnippet,
  type EmbedOptions,
  type SubscribeOptions,
} from "./lib/site-snippets.js";
import {
  buildSnippet,
  eligibilityNote,
  SCOPE_HELP,
  type SnippetScope,
} from "./lib/snippet.js";

const banner = document.querySelector<HTMLParagraphElement>("#source-banner")!;
const message = document.querySelector<HTMLElement>("#message")!;
const tool = document.querySelector<HTMLElement>("#tool")!;
const eventSelect = document.querySelector<HTMLSelectElement>("#event-select")!;
const profileSelect = document.querySelector<HTMLSelectElement>("#profile-select")!;
const profileReason = document.querySelector<HTMLElement>("#profile-reason")!;
const rail = document.querySelector<HTMLElement>("#rail")!;
const stage = document.querySelector<HTMLElement>("#stage")!;

const ALL = "all";

interface State {
  feed: OteFeed;
  feedUrl: string;
  /** Index into feed.events, or ALL for the whole feed. */
  selection: number | typeof ALL;
  profileOverride: EventProfile | null;
  activeChannel: string;
  /** Only meaningful for the schema.org channel with the whole feed selected. */
  feedScope: "graph" | "item-list";
  /** The widget channels' own controls — a playground, in place. */
  embedOptions: EmbedOptions;
  /** Whether the widget channel narrows to the selected event via event-id. */
  embedSingleEvent: boolean;
  subscribeOptions: SubscribeOptions;
}

/**
 * The controls that make the widget panels a playground rather than a fixed
 * snippet: every change re-renders both the live preview and the snippet, so
 * what the organizer tunes is exactly what they copy.
 */
function controls(children: HTMLElement[]): HTMLElement {
  const row = el("div", "controls");
  row.append(...children);
  return row;
}

function selectControl(
  labelText: string,
  options: [value: string, label: string][],
  current: string,
  onChange: (value: string) => void,
): HTMLElement {
  const wrapper = el("label", "control");
  wrapper.append(el("span", "control-label", labelText));
  const select = el("select");
  for (const [value, text] of options) {
    const option = el("option", undefined, text);
    option.value = value;
    option.selected = value === current;
    select.append(option);
  }
  select.addEventListener("change", () => onChange(select.value));
  wrapper.append(select);
  return wrapper;
}

function numberControl(
  labelText: string,
  placeholder: string,
  current: number | undefined,
  onChange: (value: number | undefined) => void,
): HTMLElement {
  const wrapper = el("label", "control");
  wrapper.append(el("span", "control-label", labelText));
  const input = el("input");
  input.type = "number";
  input.min = "1";
  input.placeholder = placeholder;
  input.value = current === undefined ? "" : String(current);
  input.addEventListener("change", () => {
    const parsed = Number(input.value);
    onChange(
      input.value.trim() === "" || !Number.isFinite(parsed) || parsed < 1 ? undefined : parsed,
    );
  });
  wrapper.append(input);
  return wrapper;
}

function checkboxControl(
  labelText: string,
  current: boolean,
  onChange: (value: boolean) => void,
): HTMLElement {
  const wrapper = el("label", "control control-inline");
  const input = el("input");
  input.type = "checkbox";
  input.checked = current;
  input.addEventListener("change", () => onChange(input.checked));
  wrapper.append(input, el("span", "control-label", labelText));
  return wrapper;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function link(href: string, text: string, className?: string): HTMLAnchorElement {
  const anchor = el("a", className, text);
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener";
  return anchor;
}

function showMessage(heading: string, body: string, isError: boolean): void {
  message.className = isError ? "panel error" : "panel";
  message.replaceChildren(el("h2", undefined, heading), el("p", undefined, body));
  message.hidden = false;
}

/** A copyable block of generated text: the tool's whole output format. */
function snippetBlock(text: string, label: string): HTMLElement {
  const wrapper = el("div", "snippet");
  const actions = el("div", "snippet-actions");
  const button = el("button", undefined, `Copy ${label}`);
  const status = el("span", "muted");
  status.setAttribute("role", "status");
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Copied.";
    } catch {
      status.textContent = "Could not copy — select the text and copy it by hand.";
    }
  });
  actions.append(button, status);
  const pre = el("pre", "source-block");
  pre.append(el("code", undefined, text));
  wrapper.append(actions, pre);
  return wrapper;
}

function statusPill(channel: Channel): HTMLElement {
  const labels = { ready: "Ready", planned: "Planned", idea: "Idea" } as const;
  return el("span", `pill pill-${channel.status}`, labels[channel.status]);
}

function currentProfile(state: State): { profile: EventProfile; reason: string } {
  if (state.profileOverride) {
    return { profile: state.profileOverride, reason: "You set this by hand." };
  }
  if (state.selection === ALL) {
    const conferences = state.feed.events.filter(
      (event) => guessProfile(event).profile === "conference",
    ).length;
    const profile: EventProfile = conferences * 2 >= state.feed.events.length ? "conference" : "meetup";
    return {
      profile,
      reason: `${conferences} of ${state.feed.events.length} events look like conferences. Pick a single event for a per-event answer.`,
    };
  }
  const event = state.feed.events[state.selection]!;
  const guess = guessProfile(event);
  return { profile: guess.profile, reason: `Detected: ${guess.reasons.join(", ")}.` };
}

// --- channel panels ---------------------------------------------------------

function schemaOrgPanel(state: State): HTMLElement {
  const body = el("div");
  const scope: SnippetScope =
    state.selection === ALL
      ? { kind: state.feedScope === "item-list" ? "item-list" : "graph" }
      : { kind: "event", index: state.selection };

  if (state.selection === ALL) {
    const chooser = el("fieldset", "scope");
    const legend = el("legend", undefined, "What does the page show?");
    chooser.append(legend);
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
        renderStage(state);
      });
      const text = el("span");
      text.append(el("strong", undefined, title), el("em", undefined, SCOPE_HELP[value]));
      label.append(input, text);
      chooser.append(label);
    }
    body.append(chooser);
  } else {
    body.append(
      el("p", "muted", `A single ${SCOPE_HELP.event.replace(/^For /, "")}`),
    );
  }

  body.append(
    el(
      "p",
      "muted",
      "Paste it anywhere inside <head> or <body>. Nothing changes visually — it is the machine-readable copy of what the page already shows, and it is a copy of your data rather than a live link, so regenerate it when the feed changes.",
    ),
    snippetBlock(buildSnippet(state.feed, scope), "snippet"),
  );

  const check = el("p", "muted");
  check.append(
    document.createTextNode("Check the result with "),
    link("https://search.google.com/test/rich-results", "Google's Rich Results Test"),
    document.createTextNode("."),
  );
  body.append(check);

  const note = eligibilityNote(state.feed, scope);
  if (note !== null) body.append(el("p", "note", note));
  return body;
}

/**
 * A pane running the real widget. Not a screenshot and not a bundled copy:
 * it loads the same versioned asset the snippet names, so what the organizer
 * sees here is literally what their visitors will get.
 */
function widgetPreview(tag: "ote-events" | "ote-subscribe", attrs: Record<string, string>): HTMLElement {
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

function embedPanel(state: State): HTMLElement {
  const body = el("div");
  const options = state.embedOptions;
  const update = (change: Partial<EmbedOptions>): void => {
    state.embedOptions = { ...options, ...change };
    renderStage(state);
  };

  body.append(
    el(
      "p",
      "muted",
      "Unlike the SEO snippet, this one stays current on its own: the widget re-reads your feed every time the page loads.",
    ),
  );

  const selectedEvent = state.selection === ALL ? undefined : state.feed.events[state.selection];
  const singleEvent = selectedEvent !== undefined && state.embedSingleEvent;

  body.append(
    controls([
      // Only offered when an event is selected above: `event-id` needs an
      // id to point at, and the header selection is the only place the
      // organizer says which event they mean.
      ...(selectedEvent
        ? [
            checkboxControl(`Only “${selectedEvent.name}”`, state.embedSingleEvent, (value) => {
              state.embedSingleEvent = value;
              renderStage(state);
            }),
          ]
        : []),
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
              (value) =>
                update({ cardWidth: (value || undefined) as EmbedOptions["cardWidth"] }),
            ),
          ]
        : []),
      numberControl("Show at most", "All", options.limit, (value) => update({ limit: value })),
      ...(singleEvent
        ? []
        : [
            checkboxControl("Include past events", options.showPast, (value) =>
              update({ showPast: value }),
            ),
          ]),
    ]),
  );

  const effective: EmbedOptions = singleEvent
    ? { ...options, eventId: selectedEvent.id, limit: undefined, showPast: false }
    : options;

  body.append(
    el(
      "p",
      "muted",
      singleEvent
        ? "Pinned to this event by its OTE id, so the card stays right even if the event is edited — and it keeps showing after the date passes, which is what an event's own page needs."
        : "The widget shows your whole feed and re-reads it on every page load, so it never goes stale.",
    ),
    widgetPreview("ote-events", embedPreviewAttributes(state.feedUrl, effective)),
    snippetBlock(embedSnippet(state.feedUrl, effective), "snippet"),
  );

  const more = el("p", "muted");
  more.append(
    document.createTextNode("Fields, grouping, custom actions and every other attribute: "),
    link("https://tools.opentechevents.org/embed/", "the full widget playground"),
    document.createTextNode("."),
  );
  body.append(more);
  return body;
}

function subscribePanel(state: State): HTMLElement {
  const urls = subscribeUrls(state.feedUrl);
  const { ics, rss } = urls;
  const subscribeOptions = { ...state.subscribeOptions, name: state.feed.title };
  const body = el("div");
  body.append(
    el(
      "p",
      "muted",
      "Your feed already publishes these next to feed.json. Anyone who subscribes once keeps getting your events — no visit to your site required.",
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
    el(
      "p",
      "muted",
      "Or drop in a subscribe button. It opens a menu of every way to follow you: Google Calendar, webcal, an ICS download, Feedly, RSS, and the raw OTE feed.",
    ),
    controls([
      selectControl(
        "Style",
        [
          ["menu", "One button with a menu"],
          ["badges", "One badge per format"],
        ],
        subscribeOptions.layout,
        (value) => {
          state.subscribeOptions = { layout: value as SubscribeOptions["layout"] };
          renderStage(state);
        },
      ),
    ]),
    widgetPreview("ote-subscribe", subscribePreviewAttributes(urls, subscribeOptions)),
    snippetBlock(subscribeWidgetSnippet(urls, subscribeOptions), "snippet"),
  );

  // Whether those two files are actually published. A fork whose export
  // workflow has not run yet has a perfectly valid feed.json and two dead
  // links — better found here than by the first person who subscribes.
  const availability = el("p", "muted", "Checking the files…");
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

/**
 * What the selected event already carries for a destination to use.
 *
 * This is what keeps an unbuilt channel from being pure promise: the fields
 * below are the ones every destination asks for, no channel can invent them,
 * and filling the gaps is work the organizer can do today in the editor.
 */
function readinessSection(state: State): HTMLElement {
  const section = el("div");
  section.append(el("h3", "sub", "What your event already has"));
  if (state.selection === ALL) {
    section.append(
      el("p", "muted", "Pick a single event above to see which fields are ready to go."),
    );
    return section;
  }

  const items = readiness(state.feed.events[state.selection]!);
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
  section.append(list);
  section.append(
    el(
      "p",
      "muted",
      missing === 0
        ? "Nothing missing: every field a destination asks for is already in your feed."
        : `${missing} field(s) missing. No channel can invent them — add them once in the editor and every destination gets them.`,
    ),
  );
  return section;
}

/**
 * A channel that does not exist yet. It states what it will produce and what
 * it will never do, and turns the organizer's interest into the two things
 * that actually move it forward: a channel request, or a maintainer.
 */
function placeholderPanel(channel: Channel, state: State): HTMLElement {
  const body = el("div");
  body.append(el("h3", "sub", "What this will produce"));
  const list = el("ul", "produces");
  for (const item of channel.produces) list.append(el("li", undefined, item));
  body.append(list);
  if (channel.note) body.append(el("p", "muted", channel.note));

  body.append(readinessSection(state));

  const actions = el("div", "cta-row");
  if (channel.issueUrl) {
    actions.append(link(channel.issueUrl, "Follow the discussion", "button-link secondary"));
  }
  actions.append(link(buildChannelUrl(channel), "Build this channel", "button-link"));
  body.append(actions);
  body.append(
    el(
      "p",
      "muted",
      "A channel is a pure function — event in, the destination's own format out. No UI, no credentials, no posting on your behalf.",
    ),
  );
  return body;
}

// --- shell ------------------------------------------------------------------

function renderStage(state: State): void {
  const channel = CHANNELS.find((c) => c.id === state.activeChannel)!;
  const { profile } = currentProfile(state);
  const header = el("div", "stage-header");
  const titleRow = el("div", "title-row");
  titleRow.append(el("h2", undefined, channel.name), statusPill(channel));
  header.append(titleRow, el("p", "muted", channel.summary));

  const panel = el("section", "panel stage-panel");
  panel.append(header);

  if (!acceptsProfile(channel, profile)) {
    panel.append(
      el(
        "p",
        "note",
        `This destination takes ${channel.accepts}s only, and the selected event looks like a ${profile}. You can still prepare a submission — change "Treat as" above if the guess is wrong.`,
      ),
    );
  }

  if (channel.status === "ready") {
    if (channel.id === "schema-org") panel.append(schemaOrgPanel(state));
    if (channel.id === "embed") panel.append(embedPanel(state));
    if (channel.id === "subscribe") panel.append(subscribePanel(state));
  } else {
    panel.append(placeholderPanel(channel, state));
  }

  stage.replaceChildren(panel);
}

function renderRail(state: State): void {
  const { profile } = currentProfile(state);
  rail.replaceChildren();
  for (const group of GROUPS) {
    const section = el("div", "rail-group");
    section.append(el("h2", undefined, group.name), el("p", "muted", group.blurb));
    const list = el("ul");
    for (const channel of channelsForGroup(group.id, profile)) {
      const item = el("li");
      const button = el("button", "channel");
      if (channel.id === state.activeChannel) button.setAttribute("aria-current", "true");
      if (!acceptsProfile(channel, profile)) button.classList.add("channel-unfit");
      const row = el("span", "channel-row");
      const name = el("span", "channel-name", channel.name);
      // Why a channel sank to the bottom of its group, said in the rail
      // itself — otherwise the reordering just looks arbitrary.
      if (!acceptsProfile(channel, profile)) {
        name.append(el("span", "channel-fit", `${channel.accepts}s only`));
      }
      row.append(name, statusPill(channel));
      button.append(row);
      button.addEventListener("click", () => {
        state.activeChannel = channel.id;
        renderRail(state);
        renderStage(state);
      });
      item.append(button);
      list.append(item);
    }
    section.append(list);
    rail.append(section);
  }

  const cta = el("div", "rail-cta");
  cta.append(
    el("h2", undefined, "Somewhere missing?"),
    el(
      "p",
      "muted",
      "This list is where organizers actually publish, not where we guessed they might. Tell us what you use.",
    ),
    link(requestChannelUrl(), "Request a platform", "button-link secondary"),
    el("p", "muted", "Or claim one and build it — every channel is a small, pure function."),
    link(buildChannelUrl(), "Build a channel", "button-link"),
  );
  rail.append(cta);
}

function renderContext(state: State): void {
  const { reason } = currentProfile(state);
  profileReason.textContent = reason;
}

function render(state: State): void {
  renderContext(state);
  renderRail(state);
  renderStage(state);
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

async function main(): Promise<void> {
  const source = parseFeedSource(window.location.search);
  if (source === null) {
    showMessage(
      "No feed to broadcast",
      "Open this tool from your dashboard, or add a feed to the URL: ?repo=owner/name or ?feed=https://…/feed.json.",
      false,
    );
    return;
  }

  banner.textContent = source.kind === "repo" ? source.repo : source.url;

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

  // Every channel maps the feed's own fields onto someone else's format; none
  // of them validates. An invalid feed would be broadcast, errors and all, to
  // every destination at once — so it stops here.
  const validation = validateFeed(json);
  if (!validation.valid) {
    message.className = "panel error";
    message.replaceChildren(
      el("h2", undefined, "This feed is not valid OTE"),
      el(
        "p",
        undefined,
        "Fix it before broadcasting from it — every channel would carry the same errors.",
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
  banner.textContent = `${feed.title} — ${feed.events.length} event${
    feed.events.length === 1 ? "" : "s"
  } · ${result.url}`;

  const state: State = {
    feed,
    feedUrl: result.url,
    selection: ALL,
    profileOverride: null,
    activeChannel: "schema-org",
    feedScope: "graph",
    embedOptions: { ...DEFAULT_EMBED_OPTIONS },
    embedSingleEvent: true,
    subscribeOptions: { layout: "menu" },
  };

  const allOption = el("option", undefined, `All ${feed.events.length} events`);
  allOption.value = ALL;
  eventSelect.append(allOption);
  for (const [index, event] of feed.events.entries()) {
    const option = el("option", undefined, `${event.startDate.slice(0, 10)} — ${event.name}`);
    option.value = String(index);
    eventSelect.append(option);
  }

  eventSelect.addEventListener("change", () => {
    state.selection = eventSelect.value === ALL ? ALL : Number(eventSelect.value);
    render(state);
  });
  profileSelect.addEventListener("change", () => {
    state.profileOverride =
      profileSelect.value === "auto" ? null : (profileSelect.value as EventProfile);
    render(state);
  });

  tool.hidden = false;
  render(state);
}

void main();
