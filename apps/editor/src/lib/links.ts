import type { OteEvent } from "./types.js";

/**
 * The two outputs of the editor, per DESIGN.md ("Flujo de escritura"):
 * a prefilled issue in the target repo, or a direct-edit link for the owner.
 * URLs above ~8K chars are rejected by browsers/GitHub, so both prefilled
 * forms fall back to "copy this, then open the blank page".
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

export function issueBody(event: OteEvent, isNew: boolean): string {
  const action = isNew ? "Add" : "Update";
  return [
    `${action} this event. The JSON below was generated with the OTE editor;`,
    "a maintainer (or the repo's automation) will turn it into a PR.",
    "",
    "```json",
    JSON.stringify(event, null, 2),
    "```",
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
): LinkResult {
  const base = `https://github.com/${repo}/issues/new`;
  const title = `[ote-event] ${isNew ? "Add" : "Update"}: ${event.name ?? "(unnamed event)"}`;
  const body = issueBody(event, isNew);
  const params = new URLSearchParams({ title, body });
  const url = `${base}?${params}`;
  if (url.length <= MAX_URL_LENGTH) return { kind: "url", url };
  return { kind: "fallback", url: base, copyText: body };
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
 * Feed settings' "Open on GitHub": same URL family as directCreateUrl, at
 * the repo root (no /events/ segment) since ote.config.json isn't inside
 * events/. GitHub's create-file page accepts a filename that already
 * exists and lets the commit update it in place, so this one URL shape
 * covers both "ote.config.json doesn't exist yet" and "it exists, update
 * it" — no separate edit-vs-create branching needed, unlike events.
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
