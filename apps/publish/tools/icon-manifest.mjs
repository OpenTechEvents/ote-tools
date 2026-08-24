/**
 * The icons this app is allowed to ship, by name.
 *
 * An explicit allow-list rather than "bundle the library": simple-icons alone
 * carries 3400+ marks, and the generated module is committed, so anything not
 * listed here would be dead weight in both the repository and the bundle.
 *
 * Shared by `tools/gen-icons.mjs` (which writes the module) and
 * `test/icons.test.ts` (which fails when the module drifts from the
 * dependency), so the two can never disagree about what should be in there.
 */

/**
 * Brand marks, keyed by the name `src/lib/destinations.ts` uses, valued by
 * their simple-icons slug.
 *
 * simple-icons has dropped several marks over time on trademark grounds —
 * Eventbrite, LinkedIn and Slack among them. Those destinations fall back to a
 * monogram tile in `src/lib/icons.ts`; do not substitute a lookalike icon from
 * somewhere else, since a wrong logo is worse than an honest letter.
 */
export const BRAND_ICONS = {
  meetup: "meetup",
  sessionize: "sessionize",
  mastodon: "mastodon",
  bluesky: "bluesky",
  x: "x",
  whatsapp: "whatsapp",
  telegram: "telegram",
  discord: "discord",
  github: "github",
};

/**
 * UI and category glyphs from Lucide — the maintained successor to feather,
 * which is what `apps/editor/src/ui/form.ts` already inlines by hand. Same
 * geometry (24-box, stroke 2, round caps), so the kit reads as one set.
 */
export const UI_ICONS = [
  "arrow-left",
  "calendar",
  "check",
  "chevron-down",
  "circle-check",
  "code",
  "copy",
  "external-link",
  "globe",
  "library",
  "megaphone",
  "message-circle",
  "moon",
  "panel-left-close",
  "panel-left-open",
  "pin",
  "rss",
  "search",
  "star",
  "sun",
  "ticket",
  "triangle-alert",
  "x",
];
