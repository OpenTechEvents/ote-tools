import type { OteEvent } from "./types.js";

/**
 * The outputs of the editor, per DESIGN.md ("Flujo de escritura"): a
 * prefilled issue in the target repo (one event, or several batched
 * together — see proposeBatchChangeUrl), or a direct-edit link for the
 * owner. URLs above ~8K chars are rejected by browsers/GitHub, so every
 * prefilled form falls back to "copy this, then open the blank page".
 */

export const MAX_URL_LENGTH = 8000;

export type LinkResult =
  | { kind: "url"; url: string }
  | {
      /** URL too long: show `copyText` for manual pasting, open `url` blank. */
      kind: "fallback";
      url: string;
      copyText: string;
    };

/**
 * `imagesToLocalize`, when given, is a transient signal for the target
 * repo's issue-to-pr automation: URLs (a subset of this event's `image`
 * entries) the organizer confirmed they have the rights to host, which
 * the automation should download and commit alongside the event instead
 * of leaving as an external link. It rides as an extra top-level key on
 * the JSON blob (the only channel this transport has) and is never part
 * of the published event — issue-to-pr.mjs strips it before writing the
 * file. See apps/editor CLAUDE.md / the image repeater's saveLocally
 * checkbox (ui/form.ts) for where it originates.
 */
function fencedEventJson(event: OteEvent, imagesToLocalize?: string[]): string {
  const body = imagesToLocalize?.length
    ? { ...event, _localizeImages: imagesToLocalize }
    : event;
  return ["```json", JSON.stringify(body, null, 2), "```"].join("\n");
}

export function issueBody(
  event: OteEvent,
  isNew: boolean,
  imagesToLocalize?: string[],
): string {
  const action = isNew ? "Add" : "Update";
  return [
    `${action} this event. The JSON below was generated with the OTE editor;`,
    "a maintainer (or the repo's automation) will turn it into a PR.",
    "",
    fencedEventJson(event, imagesToLocalize),
    "",
  ].join("\n");
}

export function eventJsonText(event: OteEvent): string {
  return JSON.stringify(event, null, 2);
}

export function eventJsonFromIssueBody(body: string): string | null {
  const match = /```json\n([\s\S]*?)\n```/.exec(body);
  return match?.[1] ?? null;
}

/**
 * "Proponer cambio": prefilled issue in the target repo via URL params.
 * Works for anyone, no auth — the owner merges the resulting PR in seconds,
 * a third party waits for review.
 */
export function proposeChangeUrl(
  repo: string,
  event: OteEvent,
  isNew: boolean,
  imagesToLocalize?: string[],
): LinkResult {
  const base = `https://github.com/${repo}/issues/new`;
  const title = `[ote-event] ${isNew ? "Add" : "Update"}: ${event.name ?? "(unnamed event)"}`;
  const body = issueBody(event, isNew, imagesToLocalize);
  const params = new URLSearchParams({ title, body });
  const url = `${base}?${params}`;
  if (url.length <= MAX_URL_LENGTH) return { kind: "url", url };
  return { kind: "fallback", url: base, copyText: body };
}

/** The issue body for a batch submission: one numbered, fenced JSON block
 * per event, in order — issue-to-pr.mjs extracts every such block, not just
 * the first, once it sees more than one. */
export function batchIssueBody(events: OteEvent[], imagesToLocalize?: string[]): string {
  const intro = [
    `${events.length} events generated with the OTE editor (e.g. a recurring`,
    "series); a maintainer (or the repo's automation) will turn them into",
    "one PR with one file per event.",
    "",
  ];
  const blocks = events.flatMap((event, index) => [
    `### ${index + 1}. Add: ${event.name ?? "(unnamed event)"}`,
    "",
    fencedEventJson(event, imagesToLocalize),
    "",
  ]);
  return [...intro, ...blocks].join("\n");
}

/**
 * "Proponer cambio" for several new events at once (a generated recurring
 * series): always a blank-issue + copy-paste flow, never a prefilled URL —
 * unlike proposeChangeUrl there's no single-event case to optimize for, and
 * N events' JSON reliably exceeds MAX_URL_LENGTH well before N reaches
 * double digits, so there is no size worth branching on. `labels` is a
 * best-effort hint: GitHub silently ignores it if the label doesn't exist
 * in the target repo, so it's safe to always send.
 */
export function proposeBatchChangeUrl(
  repo: string,
  events: OteEvent[],
  imagesToLocalize?: string[],
): LinkResult {
  const params = new URLSearchParams({
    title: `[ote-event] Add ${events.length} events`,
    labels: "ote-batch",
  });
  const base = `https://github.com/${repo}/issues/new?${params}`;
  return { kind: "fallback", url: base, copyText: batchIssueBody(events, imagesToLocalize) };
}

/**
 * "Editar directo" on an existing event: github.dev over events/<slug>.json.
 * Owner-only in practice (needs push); `branch` comes from the repos API
 * when the listing fetched it, HEAD otherwise.
 */
export function directEditUrl(
  repo: string,
  slug: string,
  branch = "HEAD",
): string {
  return `https://github.dev/${repo}/blob/${branch}/events/${slug}.json`;
}

/**
 * "Editar directo" on a NEW event: github.dev cannot create a file from a
 * URL, so this uses GitHub's prefilled new-file page instead
 * (deliberate deviation from DESIGN.md's "github.dev" wording).
 */
export function directCreateUrl(
  repo: string,
  slug: string,
  event: OteEvent,
  branch = "main",
): LinkResult {
  const base = `https://github.com/${repo}/new/${branch}/events`;
  const json = JSON.stringify(event, null, 2) + "\n";
  const params = new URLSearchParams({
    filename: `${slug}.json`,
    value: json,
  });
  const url = `${base}?${params}`;
  if (url.length <= MAX_URL_LENGTH) return { kind: "url", url };
  return {
    kind: "fallback",
    url: `${base}?${new URLSearchParams({ filename: `${slug}.json` })}`,
    copyText: json,
  };
}

/**
 * Feed settings' "Open on GitHub" when ote.config.json does NOT exist yet:
 * same URL family as directCreateUrl, at the repo root (no /events/
 * segment) since ote.config.json isn't inside events/. Once the file
 * exists, directEditFeedConfigUrl (below) is used instead — this one is
 * unreachable in that case.
 */
export function directFeedConfigUrl(
  repo: string,
  branch: string,
  config: Record<string, unknown>,
): LinkResult {
  const base = `https://github.com/${repo}/new/${branch}`;
  const json = JSON.stringify(config, null, 2) + "\n";
  const params = new URLSearchParams({
    filename: "ote.config.json",
    value: json,
  });
  const url = `${base}?${params}`;
  if (url.length <= MAX_URL_LENGTH) return { kind: "url", url };
  return {
    kind: "fallback",
    url: `${base}?${new URLSearchParams({ filename: "ote.config.json" })}`,
    copyText: json,
  };
}

/**
 * Feed settings' "Open on GitHub" when ote.config.json already exists:
 * same github.dev edit family as directEditUrl, at the repo root since
 * ote.config.json isn't inside events/.
 */
export function directEditFeedConfigUrl(repo: string, branch = "HEAD"): string {
  return `https://github.dev/${repo}/blob/${branch}/ote.config.json`;
}

/**
 * "Eliminar directamente": GitHub's own native delete-confirmation page for
 * the file — same URL family as directEditUrl (/blob/) and directCreateUrl
 * (/new/), just /delete/. Owner-only in practice (needs push); this app
 * never deletes anything itself, it only opens GitHub's own UI for it.
 */
export function directDeleteUrl(
  repo: string,
  slug: string,
  branch = "HEAD",
): string {
  return `https://github.com/${repo}/delete/${branch}/events/${slug}.json`;
}

/**
 * "Proponer eliminación": a prefilled issue asking a maintainer to delete
 * the file — for anyone without push access. Unlike proposeChangeUrl there
 * is no JSON to parse automatically (the fork's issue-processing workflow
 * has no delete-parsing today); this is a plain-text ask a human reads.
 * `slug` is null when the listing came from the published feed fallback
 * (its filename can't be derived) — the id alone still identifies the event.
 */
export function proposeDeleteUrl(
  repo: string,
  slug: string | null,
  event: OteEvent,
): LinkResult {
  const base = `https://github.com/${repo}/issues/new`;
  const title = `[ote-event] Delete: ${event.name ?? slug ?? event.id}`;
  const body = [
    "Please delete this event — it's no longer happening / was added by mistake.",
    "",
    ...(slug !== null ? [`File: \`events/${slug}.json\``] : []),
    `Id: ${event.id}`,
    "",
    "(opened via the OTE editor)",
  ].join("\n");
  const params = new URLSearchParams({ title, body });
  const url = `${base}?${params}`;
  if (url.length <= MAX_URL_LENGTH) return { kind: "url", url };
  return { kind: "fallback", url: base, copyText: body };
}
