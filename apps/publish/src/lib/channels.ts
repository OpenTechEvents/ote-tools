import type { EventProfile } from "./event-profile.js";

/**
 * `ready` channels do something today. `planned` are designed and agreed
 * (spec#12) but not built. `idea` are directions, not commitments.
 *
 * The distinction is load-bearing, not decoration: this page shows an
 * organizer what the tool will become, and the moment a placeholder reads as
 * a working button, the tool has lied to them. Every non-ready channel says
 * so on its own card, in its own words.
 */
export type ChannelStatus = "ready" | "planned" | "idea";

export interface ChannelGroup {
  id: string;
  name: string;
  blurb: string;
}

export interface Channel {
  id: string;
  name: string;
  group: ChannelGroup["id"];
  status: ChannelStatus;
  /** One line: what this channel does for the organizer. */
  summary: string;
  /** What it produces (or will) — the copy-paste artefacts themselves. */
  produces: string[];
  /** Which events this destination accepts. */
  accepts: "any" | EventProfile;
  /** An honest limitation, stated up front rather than discovered later. */
  note?: string;
  /** Where to follow or help — a real, existing issue or page. */
  issueUrl?: string;
}

export const GROUPS: ChannelGroup[] = [
  {
    id: "own-site",
    name: "Your own website",
    blurb:
      "The events are already yours and already published. These make your own pages carry them.",
  },
  {
    id: "directories",
    name: "Event directories",
    blurb:
      "Community-run listings. The GitHub-based ones take an issue or a pull request — no account, no API key.",
  },
  {
    id: "audience",
    name: "Your audience",
    blurb: "Newsletter, social posts, chat groups — the same event, written for each medium.",
  },
  {
    id: "manual",
    name: "Platforms with no open API",
    blurb:
      "Meetup, LinkedIn and friends. No integration is possible, so the tool prepares the text and gets you to the right form.",
  },
];

/**
 * The channel registry. Order inside a group is the order shown.
 *
 * Keeping this a plain data structure (not per-channel components) is what
 * makes the placeholder cards cost nothing to keep honest: a channel that
 * becomes real changes `status` and gains a panel, and nothing else moves.
 */
export const CHANNELS: Channel[] = [
  {
    // Named for the outcome, not the format: an organizer looks for "SEO",
    // not for "structured data", and least of all for "schema.org" — the
    // vocabulary is an implementation detail of the thing they want.
    id: "schema-org",
    name: "Search engines (SEO)",
    group: "own-site",
    status: "ready",
    summary:
      "Get your events into Google, Bing and AI assistants as events — with date, place and tickets — instead of anonymous page text. A schema.org JSON-LD snippet does it.",
    produces: ["A pasteable <script type=\"application/ld+json\"> block"],
    accepts: "any",
    issueUrl: "https://github.com/OpenTechEvents/opentechevents-spec/issues/11",
  },
  {
    id: "embed",
    name: "Embeddable widget",
    group: "own-site",
    status: "ready",
    summary:
      "Two lines that put a live, styled list of your events on any page — it re-reads your feed, so it never goes stale.",
    produces: ["A <script> tag and an <ote-events> element, pinned to a fixed version"],
    accepts: "any",
  },
  {
    id: "subscribe",
    name: "Calendar & RSS links",
    group: "own-site",
    status: "ready",
    summary:
      "The subscribe URLs your feed already publishes: people add your calendar once and stop missing events.",
    produces: ["feed.ics and feed.xml links, ready to paste into a page or a bio"],
    accepts: "any",
  },
  {
    id: "confs-tech",
    name: "confs.tech",
    group: "directories",
    status: "planned",
    summary: "A large, curated directory of tech conferences, maintained on GitHub.",
    produces: [
      "A pull request draft against their repository, with your event in their own JSON shape",
    ],
    accepts: "conference",
    note: "Conferences only — a recurring local meetup is out of scope for them.",
    issueUrl: "https://github.com/OpenTechEvents/opentechevents-spec/issues/12",
  },
  {
    id: "developers-events",
    name: "developers.events",
    group: "directories",
    status: "planned",
    summary: "Conference listing and CFP tracker, also GitHub-based.",
    produces: ["A pull request draft in their format", "A CFP entry when your event has one"],
    accepts: "conference",
    issueUrl: "https://github.com/OpenTechEvents/opentechevents-spec/issues/12",
  },
  {
    id: "eventos-wiki",
    name: "eventos.wiki",
    group: "directories",
    status: "planned",
    summary:
      "Spanish-speaking community calendar. They have offered to build an API, so this one may end up automated.",
    produces: ["A prefilled submission", "Later: a real API publisher, run from your own repo"],
    accepts: "any",
    issueUrl: "https://github.com/OpenTechEvents/opentechevents-spec/issues/12",
  },
  {
    id: "community-directories",
    name: "Community directories",
    group: "directories",
    status: "planned",
    summary:
      "Local and regional listings that accept issues or pull requests, starting with the ones OTE already links to.",
    produces: ["A prefilled issue in the destination repository"],
    accepts: "any",
    issueUrl: "https://github.com/OpenTechEvents/opentechevents-spec/issues/12",
  },
  {
    id: "newsletter",
    name: "Newsletter",
    group: "audience",
    status: "planned",
    summary: "Subject line and body text for your announcement, built from the event document.",
    produces: ["A subject line", "A plain-text and an HTML body", "A calendar link to include"],
    accepts: "any",
    issueUrl: "https://github.com/OpenTechEvents/opentechevents-spec/issues/12",
  },
  {
    id: "social",
    name: "Social posts",
    group: "audience",
    status: "planned",
    summary:
      "One post per network, each within its own length limit, with the date already formatted for your audience.",
    produces: [
      "Mastodon and Bluesky posts",
      "A LinkedIn post",
      "Alt text taken from your event image",
    ],
    accepts: "any",
    note: "Text to copy, not scheduled posting — no third-party credentials are ever stored.",
    issueUrl: "https://github.com/OpenTechEvents/opentechevents-spec/issues/12",
  },
  {
    id: "chat",
    name: "Chat groups",
    group: "audience",
    status: "planned",
    summary: "Announcement text for Telegram, Discord or Slack, in each one's markup.",
    produces: ["A message per platform, formatted for its own flavour of markup"],
    accepts: "any",
    issueUrl: "https://github.com/OpenTechEvents/opentechevents-spec/issues/12",
  },
  {
    id: "meetup",
    name: "Meetup",
    group: "manual",
    status: "planned",
    summary:
      "A field-by-field cheat sheet plus a direct link to the create-event form of your own group.",
    produces: ["Every field of their form, ready to copy in order"],
    accepts: "any",
    note: "Their API needs a paid plan, so no automation is possible — this is the honest alternative.",
    issueUrl: "https://github.com/OpenTechEvents/opentechevents-spec/issues/12",
  },
  {
    id: "contact-forms",
    name: "Contact forms & email",
    group: "manual",
    status: "planned",
    summary:
      "For listings that only accept a human writing to them: a ready message you can send as is.",
    produces: ["An email subject and body", "A short version for a form with a character limit"],
    accepts: "any",
    issueUrl: "https://github.com/OpenTechEvents/opentechevents-spec/issues/12",
  },
  {
    id: "browser-extension",
    name: "Browser extension",
    group: "manual",
    status: "idea",
    summary:
      "The missing half of the manual channels: fill a platform's own form from your event, in the page, with one click.",
    produces: [
      "Autofill for create-event forms that have no API",
      "Capture in the other direction: read an event off any page, CORS and all",
    ],
    accepts: "any",
    note: "An idea from DESIGN.md, not a commitment. It needs a maintainer before it needs code.",
    issueUrl: "https://github.com/OpenTechEvents/ote-tools/issues",
  },
];

/**
 * Whether a channel accepts this kind of event. Channels that don't are
 * still shown, marked and sorted last — an organizer learning that confs.tech
 * takes conferences only is useful; a channel silently vanishing is not.
 */
export function acceptsProfile(channel: Channel, profile: EventProfile): boolean {
  return channel.accepts === "any" || channel.accepts === profile;
}

/** Channels of a group, the ones that fit this event first. */
export function channelsForGroup(group: string, profile: EventProfile): Channel[] {
  return CHANNELS.filter((channel) => channel.group === group).sort(
    (a, b) => Number(acceptsProfile(b, profile)) - Number(acceptsProfile(a, profile)),
  );
}

const NEW_ISSUE = "https://github.com/OpenTechEvents/ote-tools/issues/new";

/** "Missing a platform?" — a prefilled issue, not a mailto into the void. */
export function requestChannelUrl(): string {
  const params = new URLSearchParams({
    title: "[Channel request] ",
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
export function buildChannelUrl(channel?: Channel): string {
  const params = new URLSearchParams({
    title: channel ? `[Channel] Implement ${channel.name}` : "[Channel] I'd like to build a channel",
    labels: "enhancement,help wanted",
    body: [
      channel
        ? `I'd like to implement the **${channel.name}** channel of the publish tool.`
        : "I'd like to implement a publish channel.",
      "",
      "A channel is a pure function: OTE event in, the destination's own format out —",
      "no UI, no credentials, no background posting. See CONTRIBUTING.md and",
      "packages/export-jsonld for the shape an existing one takes.",
      "",
      "**What I plan to build:**",
    ].join("\n"),
  });
  return `${NEW_ISSUE}?${params}`;
}
