/**
 * What Broadcast does with a validated feed, as a pure function.
 *
 * Extracted from `boot()` because the decision is the one thing in this app
 * that must not be got wrong, and inside `boot()` it was untestable: the
 * whole surface could be — and was — broken without a single test failing.
 * The defect it exists to prevent is specific. Broadcast judges a feed
 * somebody else published, and it used to refuse any feed whose `specVersion`
 * had left the support window, telling the publisher "This feed is not valid
 * OTE" over a document with zero schema violations. A registered adopter was
 * in exactly that position.
 *
 * So the three cases are named, and only one of them is about the feed being
 * wrong:
 *
 *   - `broadcast` — nothing MUST-level failed against the version the feed
 *     declares. Includes a feed outside the support window: its schemas
 *     exist, it was measured against them, and it passed. `support` carries
 *     whatever is worth saying, and it is said *beside* the app, never
 *     instead of it.
 *   - `invalid` — real schema violations. Every destination maps the feed's
 *     own fields onto someone else's format, and none of them validates, so
 *     a broken feed would be broadcast errors and all.
 *   - `unchecked` — the feed declares a spec version that was never
 *     published, so nothing was measured. Refused too, for a different
 *     reason: mapping a document whose rules this release does not have would
 *     mean inventing the mapping. The wording has to say "could not be
 *     checked", not "your feed is broken", because this release is the one
 *     that cannot answer.
 */

import type { DocumentReport } from "@opentechevents/validate";

export type FeedGate =
  | { action: "broadcast"; support: string | null }
  | { action: "invalid"; errors: DocumentReport["errors"] }
  | { action: "unchecked"; reason: string };

export function feedGate(report: DocumentReport): FeedGate {
  // `valid === null` first, and deliberately before the falsy check that used
  // to stand here: null means "no verdict", and `!report.valid` would have
  // folded it into "invalid" — which is the bug one layer up.
  if (report.valid === null) {
    return {
      action: "unchecked",
      reason: report.support.message ?? "Its spec version was never published.",
    };
  }
  if (!report.valid) return { action: "invalid", errors: report.errors };
  return { action: "broadcast", support: report.support.message };
}
