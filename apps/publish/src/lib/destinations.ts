import type { EventProfile } from "./event-profile.js";

/**
 * How much of the work this tool does for a destination.
 *
 * The ladder replaces a plain "is it built yet" flag, because the honest
 * answer for most destinations is neither yes nor no. It is what lets the
 * catalogue be wide without turning into a wall of promises: an `assisted`
 * destination does real work today — the organizer's own values, field by
 * field, next to the form that wants them — even though nothing about it is
 * automated.
 *
 * - `generated` — the tool emits the destination's own format, ready to paste.
 * - `assisted`  — a field-by-field submission sheet plus a link to their form.
 * - `planned`   — designed and agreed, nothing built. Says so on its own card.
 */
export type Automation = "generated" | "assisted" | "planned";

/** How a submission actually reaches the destination. */
export type SubmitVia = "form" | "issue" | "pull-request" | "api" | "paste";

export type DestinationGroup = "platforms" | "directories" | "social" | "chat" | "own-site";

export type DestinationTag = "cfp" | "spanish" | "global" | "open-source";

export interface Group {
  id: DestinationGroup;
  name: string;
  blurb: string;
  /** A Lucide glyph name from `icons.generated.ts`. */
  icon: string;
}

export interface Destination {
  id: string;
  name: string;
  group: DestinationGroup;
  automation: Automation;
  submitVia: SubmitVia;
  /** Where the destination lives — shown, and used when there is no form. */
  homeUrl: string;
  /**
   * The page that actually takes a submission. Required for every `assisted`
   * destination except the `paste` ones: the link is half of what that level
   * delivers, and a sheet of fields with nowhere to put them is not a feature.
   * A `paste` destination has no form — its artefact is the message, and the
   * composer link is built per event in `src/lib/submission.ts`.
   */
  submitUrl?: string;
  /** A key into `BRAND_ICONS`; without one the tile falls back to a monogram. */
  icon?: string;
  /** The brand's colour, used to tint the tile. */
  brand: string;
  /** One line: what this destination does for the organizer. */
  summary: string;
  /** What it produces (or will) — the copy-paste artefacts themselves. */
  produces: string[];
  /** Which events this destination accepts. */
  accepts: "any" | EventProfile;
  tags?: DestinationTag[];
  /** An honest limitation, stated up front rather than discovered later. */
  note?: string;
  /** Where to follow or help — a real, existing issue or page. */
  issueUrl?: string;
}

const SPEC_12 = "https://github.com/OpenTechEvents/opentechevents-spec/issues/12";
const SPEC_11 = "https://github.com/OpenTechEvents/opentechevents-spec/issues/11";

/**
 * Ordered by reach, which is the order an organizer with one evening should
 * work down: the places that bring an audience of their own first, the ones
 * that only reach people who already follow you last.
 */
export const GROUPS: Group[] = [
  {
    id: "platforms",
    name: "Event platforms",
    blurb: "Where the event gets a page, an RSVP list and an audience that is not yours yet.",
    icon: "ticket",
  },
  {
    id: "directories",
    name: "Directories",
    blurb:
      "Curated listings people search when they are looking for something to attend. Most are free and several are just a GitHub issue.",
    icon: "library",
  },
  {
    id: "social",
    name: "Social networks",
    blurb: "One post per network, each within its own limits and written for its own readers.",
    icon: "megaphone",
  },
  {
    id: "chat",
    name: "Chat groups",
    blurb:
      "The communities you are already in. Each one has its own flavour of markup, so each gets its own text.",
    icon: "message-circle",
  },
  {
    id: "own-site",
    name: "Your own site",
    blurb: "The events are already yours. These make your own pages carry them.",
    icon: "globe",
  },
];

/**
 * The destination registry.
 *
 * Every entry earned its place against the same five questions: does it take a
 * submission of your own event, does it reach a tech audience (or your event's
 * language), is it free, is there a documented way in, and was it answering
 * when we last looked. Aggregators that only crawl other listings are not here
 * — you cannot submit to them, so a card would be a dead end; they show up as
 * notes on the listings they crawl instead.
 *
 * Keeping this plain data is what makes the catalogue cheap to widen: a
 * destination that gains real code changes `automation` and gains a panel, and
 * nothing else moves.
 */
export const DESTINATIONS: Destination[] = [
  // --- event platforms ------------------------------------------------------
  {
    id: "meetup",
    name: "Meetup",
    group: "platforms",
    automation: "assisted",
    submitVia: "form",
    homeUrl: "https://www.meetup.com/",
    submitUrl: "https://www.meetup.com/create/",
    icon: "meetup",
    brand: "#ED1C40",
    summary:
      "Still where most people look for a local tech event, and its own members get notified when you post.",
    produces: ["Every field of their create-event form, ready to copy in order"],
    accepts: "any",
    note: "Their create-event page lives under your own group's URL, and their API needs a paid plan — so this stays a cheat sheet rather than an integration.",
    issueUrl: SPEC_12,
  },
  {
    id: "luma",
    name: "Luma",
    group: "platforms",
    automation: "assisted",
    submitVia: "form",
    homeUrl: "https://lu.ma/",
    submitUrl: "https://lu.ma/create",
    brand: "#F2604C",
    summary: "Fast, good-looking event pages with registration built in. Popular with tech meetups.",
    produces: ["The fields their create form asks for, in its order"],
    accepts: "any",
    tags: ["global"],
    note: "They do have a real create-event API, but it needs a per-account key. Storing third-party credentials is a non-goal here, so this is manual on purpose.",
    issueUrl: SPEC_12,
  },
  {
    id: "eventbrite",
    name: "Eventbrite",
    group: "platforms",
    automation: "assisted",
    submitVia: "form",
    homeUrl: "https://www.eventbrite.com/",
    submitUrl: "https://www.eventbrite.com/create",
    brand: "#F05537",
    summary: "Ticketing plus a search people actually use, including for free events.",
    produces: ["Their form's fields, filled from your event"],
    accepts: "any",
    tags: ["global"],
    issueUrl: SPEC_12,
  },
  {
    id: "guild",
    name: "Guild",
    group: "platforms",
    automation: "assisted",
    submitVia: "form",
    homeUrl: "https://guild.host/",
    submitUrl: "https://guild.host/events/new",
    brand: "#5B5BD6",
    summary:
      "Community-first event hosting built for tech groups, with networks that carry your event to nearby communities.",
    produces: ["The fields their create form asks for"],
    accepts: "any",
    issueUrl: SPEC_12,
  },
  {
    id: "sessionize",
    name: "Sessionize",
    group: "platforms",
    automation: "assisted",
    submitVia: "form",
    homeUrl: "https://sessionize.com/",
    submitUrl: "https://sessionize.com/app/organizer/event/create",
    icon: "sessionize",
    brand: "#1AB394",
    summary: "Runs the call for papers and the speaker pipeline. Its public event list is a listing in itself.",
    produces: ["Your CFP dates and event details, ready for their setup form"],
    accepts: "conference",
    tags: ["cfp"],
    note: "Their public API is read-only — there is no way to create an event from outside, so this is a sheet and a link.",
    issueUrl: SPEC_12,
  },
  {
    id: "papercall",
    name: "Papercall",
    group: "platforms",
    automation: "assisted",
    submitVia: "form",
    homeUrl: "https://www.papercall.io/",
    submitUrl: "https://www.papercall.io/events/new",
    brand: "#E8574B",
    summary: "A lightweight CFP host. Several CFP trackers read their listings, so one entry travels.",
    produces: ["The CFP fields, taken from your event's cfp block"],
    accepts: "conference",
    tags: ["cfp"],
    issueUrl: SPEC_12,
  },
  {
    id: "joindin",
    name: "joind.in",
    group: "platforms",
    automation: "planned",
    submitVia: "api",
    homeUrl: "https://joind.in/",
    submitUrl: "https://joind.in/event/submit",
    brand: "#B23E3E",
    summary:
      "The long-running community feedback site: attendees rate your talks afterwards, and the event page is public.",
    produces: ["A submission through their REST API, run from your own repository"],
    accepts: "any",
    tags: ["open-source"],
    note: "They have a real, authenticated create API — the best candidate for a genuine auto-publisher after eventos.wiki. Submissions from non-admins wait for approval.",
    issueUrl: SPEC_12,
  },

  // --- directories ----------------------------------------------------------
  {
    id: "confs-tech",
    name: "confs.tech",
    group: "directories",
    automation: "planned",
    submitVia: "pull-request",
    homeUrl: "https://confs.tech/",
    submitUrl: "https://confs.tech/conferences/new",
    icon: "github",
    brand: "#3556C8",
    summary: "The large, curated, open-source directory of tech conferences.",
    produces: [
      "A pull request draft against their repository, with your event in their own JSON shape",
    ],
    accepts: "conference",
    tags: ["global", "open-source", "cfp"],
    note: "Conferences only — a recurring local meetup is out of scope for them. Listing here also reaches the aggregators that read them, such as CallingAllPapers and CFP Tracker.",
    issueUrl: SPEC_12,
  },
  {
    id: "developers-events",
    name: "developers.events",
    group: "directories",
    automation: "planned",
    submitVia: "pull-request",
    homeUrl: "https://developers.events/",
    submitUrl: "https://github.com/scraly/developers-conferences-agenda",
    icon: "github",
    brand: "#2D6CDF",
    summary: "Conference and CFP agenda, maintained on GitHub and re-published as open JSON.",
    produces: ["A pull request draft in their format", "A CFP entry when your event has one"],
    accepts: "conference",
    tags: ["global", "open-source", "cfp"],
    note: "Their JSON exports feed several other trackers, so one entry here shows up in more than one place.",
    issueUrl: SPEC_12,
  },
  {
    id: "dev-events",
    name: "dev.events",
    group: "directories",
    automation: "assisted",
    submitVia: "form",
    homeUrl: "https://dev.events/",
    submitUrl: "https://dev.events/new",
    brand: "#0F766E",
    summary: "A worldwide listing of developer conferences, browsable by region and topic.",
    produces: ["Their submission form's fields, filled from your event"],
    accepts: "conference",
    tags: ["global"],
    note: "They also read schema.org markup straight off an event page — so adding the SEO snippet first can save you the form entirely.",
    issueUrl: SPEC_12,
  },
  {
    id: "techconf-directory",
    name: "TechConf.Directory",
    group: "directories",
    automation: "assisted",
    submitVia: "issue",
    homeUrl: "https://techconf.directory/",
    submitUrl: "https://github.com/DeclanChidlow/techconf.directory/issues/new/choose",
    icon: "github",
    brand: "#7C3AED",
    summary: "An open, YAML-backed directory of tech conferences and speaking opportunities.",
    produces: ["A prefilled GitHub issue in their own template"],
    accepts: "conference",
    tags: ["global", "open-source"],
    issueUrl: SPEC_12,
  },
  {
    id: "conventions-io",
    name: "conventions.io",
    group: "directories",
    automation: "assisted",
    submitVia: "form",
    homeUrl: "https://conventions.io/",
    submitUrl: "https://conventions.io/add-conference",
    brand: "#0EA5E9",
    summary: "Hundreds of verified tech conferences across 50-odd countries, filed by topic.",
    produces: ["Their add-conference form, field by field"],
    accepts: "conference",
    tags: ["global"],
    note: "Free, but reviewed: they check submissions within about two days and turn down ones that miss their bar.",
    issueUrl: SPEC_12,
  },
  {
    id: "eventos-wiki",
    name: "eventos.wiki",
    group: "directories",
    automation: "planned",
    submitVia: "issue",
    homeUrl: "https://eventos.wiki/",
    submitUrl: "https://github.com/achamorro-dev/eventoswiki/issues/new/choose",
    icon: "github",
    brand: "#DB2777",
    summary: "The Spanish-speaking community calendar, run in the open on GitHub.",
    produces: ["A prefilled issue in their YAML template", "Later: a real API publisher, run from your own repo"],
    accepts: "any",
    tags: ["spanish", "open-source"],
    note: "They have offered to build an API, which makes this the first destination likely to become genuinely automatic.",
    issueUrl: SPEC_12,
  },
  {
    id: "event-garden",
    name: "Event Garden",
    group: "directories",
    automation: "assisted",
    submitVia: "form",
    homeUrl: "https://eventgarden.io/",
    submitUrl: "https://eventgarden.io/new-event",
    brand: "#16A34A",
    summary: "A Spanish-language listing of tech events, reviewed by their team before it goes up.",
    produces: ["Their new-event form, filled from your event"],
    accepts: "any",
    tags: ["spanish"],
    issueUrl: SPEC_12,
  },
  {
    id: "developer-events",
    name: "Developer Events",
    group: "directories",
    automation: "assisted",
    submitVia: "form",
    homeUrl: "https://www.developerevents.org/",
    submitUrl: "https://www.developerevents.org/submit-event/",
    brand: "#C2410C",
    summary: "A broad listing of developer conferences and webinars, online and in person.",
    produces: ["Their submission form's fields, filled from your event"],
    accepts: "any",
    tags: ["global"],
    note: "Their form asks for rather more contact detail than most — have your organizer block ready.",
    issueUrl: SPEC_12,
  },

  // --- social ---------------------------------------------------------------
  {
    id: "mastodon",
    name: "Mastodon",
    group: "social",
    automation: "assisted",
    submitVia: "paste",
    homeUrl: "https://joinmastodon.org/",
    icon: "mastodon",
    brand: "#6364FF",
    summary: "Where a lot of the tech community moved. Hashtags still work, and posts are not throttled.",
    produces: ["A post within 500 characters", "Alt text taken from your event image"],
    accepts: "any",
    note: "Text to copy, opened in your own instance's composer. No posting on your behalf and no credentials, ever.",
    issueUrl: SPEC_12,
  },
  {
    id: "bluesky",
    name: "Bluesky",
    group: "social",
    automation: "assisted",
    submitVia: "paste",
    homeUrl: "https://bsky.app/",
    icon: "bluesky",
    brand: "#1185FE",
    summary: "Fast-growing, link-friendly, and its cards render your event image well.",
    produces: ["A post within 300 characters", "Alt text taken from your event image"],
    accepts: "any",
    issueUrl: SPEC_12,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    group: "social",
    automation: "assisted",
    submitVia: "paste",
    homeUrl: "https://www.linkedin.com/",
    brand: "#0A66C2",
    summary: "Where corporate attendees and sponsors are, and where a professional event reads as normal.",
    produces: ["A longer post, written for a professional feed"],
    accepts: "any",
    note: "Their posting API is closed to individual developers, so this is text to paste — the same limitation their own tooling has.",
    issueUrl: SPEC_12,
  },
  {
    id: "x",
    name: "X",
    group: "social",
    automation: "assisted",
    submitVia: "paste",
    homeUrl: "https://x.com/",
    icon: "x",
    brand: "#111111",
    summary: "Reach is thinner than it was, but plenty of local tech scenes still coordinate there.",
    produces: ["A post within 280 characters"],
    accepts: "any",
    issueUrl: SPEC_12,
  },

  // --- chat -----------------------------------------------------------------
  {
    id: "whatsapp",
    name: "WhatsApp",
    group: "chat",
    automation: "assisted",
    submitVia: "paste",
    homeUrl: "https://www.whatsapp.com/",
    icon: "whatsapp",
    brand: "#25D366",
    summary: "For many local communities this is the group that actually gets read.",
    produces: ["An announcement in WhatsApp's own formatting", "A share link that opens the composer"],
    accepts: "any",
    issueUrl: SPEC_12,
  },
  {
    id: "telegram",
    name: "Telegram",
    group: "chat",
    automation: "assisted",
    submitVia: "paste",
    homeUrl: "https://telegram.org/",
    icon: "telegram",
    brand: "#26A5E4",
    summary: "Big public groups and channels, and messages there stay findable.",
    produces: ["An announcement in Telegram's markup", "A share link that opens the composer"],
    accepts: "any",
    issueUrl: SPEC_12,
  },
  {
    id: "discord",
    name: "Discord",
    group: "chat",
    automation: "assisted",
    submitVia: "paste",
    homeUrl: "https://discord.com/",
    icon: "discord",
    brand: "#5865F2",
    summary: "Most dev communities have a server, and most have an #events channel waiting for this.",
    produces: ["An announcement in Discord's markdown, sized for a channel post"],
    accepts: "any",
    issueUrl: SPEC_12,
  },
  {
    id: "slack",
    name: "Slack",
    group: "chat",
    automation: "assisted",
    submitVia: "paste",
    homeUrl: "https://slack.com/",
    brand: "#4A154B",
    summary: "Community workspaces and your own company's — both take the same announcement.",
    produces: ["An announcement in Slack's mrkdwn, which is not quite Markdown"],
    accepts: "any",
    issueUrl: SPEC_12,
  },

  // --- your own site --------------------------------------------------------
  {
    // Named for the outcome, not the format: an organizer looks for "SEO",
    // not for "structured data", and least of all for "schema.org" — the
    // vocabulary is an implementation detail of the thing they want.
    id: "schema-org",
    name: "Search engines",
    group: "own-site",
    automation: "generated",
    submitVia: "paste",
    homeUrl: "https://schema.org/Event",
    brand: "#3556C8",
    summary:
      "Get your events into Google, Bing and AI assistants as events — with date, place and tickets — instead of anonymous page text.",
    produces: ['A pasteable <script type="application/ld+json"> block'],
    accepts: "any",
    issueUrl: SPEC_11,
  },
  {
    id: "embed",
    name: "Embeddable widget",
    group: "own-site",
    automation: "generated",
    submitVia: "paste",
    homeUrl: "https://tools.opentechevents.org/embed/",
    brand: "#0F766E",
    summary:
      "Two lines that put a live, styled list of your events on any page — it re-reads your feed, so it never goes stale.",
    produces: ["A <script> tag and an <ote-events> element, pinned to a fixed version"],
    accepts: "any",
  },
  {
    id: "subscribe",
    name: "Calendar & RSS",
    group: "own-site",
    automation: "generated",
    submitVia: "paste",
    homeUrl: "https://tools.opentechevents.org/embed/",
    brand: "#B45309",
    summary:
      "The subscribe URLs your feed already publishes: people add your calendar once and stop missing events.",
    produces: ["feed.ics and feed.xml links, ready to paste into a page or a bio"],
    accepts: "any",
  },
];

export function destinationById(id: string): Destination | undefined {
  return DESTINATIONS.find((destination) => destination.id === id);
}

/**
 * Whether a destination accepts this kind of event. Ones that don't are still
 * shown, marked and sorted last — an organizer learning that confs.tech takes
 * conferences only is useful; a destination silently vanishing is not.
 */
export function acceptsProfile(destination: Destination, profile: EventProfile): boolean {
  return destination.accepts === "any" || destination.accepts === profile;
}

/** Destinations of a group, the ones that fit this event first. */
export function destinationsForGroup(group: string, profile: EventProfile): Destination[] {
  return DESTINATIONS.filter((destination) => destination.group === group).sort(
    (a, b) => Number(acceptsProfile(b, profile)) - Number(acceptsProfile(a, profile)),
  );
}

const NEW_ISSUE = "https://github.com/OpenTechEvents/ote-tools/issues/new";

/** "Somewhere missing?" — a prefilled issue, not a mailto into the void. */
export function requestDestinationUrl(): string {
  const params = new URLSearchParams({
    title: "[Destination request] ",
    labels: "enhancement",
    body: [
      "**Which platform is missing?**",
      "",
      "**Its submission URL (form, repository, or contact page):**",
      "",
      "**What does it accept?** (conferences, meetups, a region, a language…)",
      "",
      "**Do you publish there already?** Anything you know about how they take submissions helps.",
    ].join("\n"),
  });
  return `${NEW_ISSUE}?${params}`;
}

/** "Build one" — the same form, aimed at someone offering to implement it. */
export function buildDestinationUrl(destination?: Destination): string {
  const params = new URLSearchParams({
    title: destination
      ? `[Destination] Implement ${destination.name}`
      : "[Destination] I'd like to build a destination",
    labels: "enhancement,help wanted",
    body: [
      destination
        ? `I'd like to implement the **${destination.name}** destination of the publish tool.`
        : "I'd like to implement a publish destination.",
      "",
      "A destination is a pure function: OTE event in, the destination's own format out —",
      "no UI, no credentials, no background posting. See CONTRIBUTING.md and",
      "packages/export-jsonld for the shape an existing one takes.",
      "",
      "**What I plan to build:**",
    ].join("\n"),
  });
  return `${NEW_ISSUE}?${params}`;
}
