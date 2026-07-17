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

function issueBody(event: OteEvent, isNew: boolean): string {
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
  // The `ote-event` label is what the issue-to-pr workflow keys on (it runs
  // on issues opened/edited and filters by this label). Applying it via the
  // URL means the issue arrives labelled, so the workflow fires on `opened` —
  // no manual labelling, which wouldn't re-trigger it anyway (`labeled` is
  // not one of its events). GitHub applies the param only if the label
  // already exists in the repo; the ote-template ships it.
  const params = new URLSearchParams({ title, body, labels: "ote-event" });
  const url = `${base}?${params}`;
  if (url.length <= MAX_URL_LENGTH) return { kind: "url", url };
  // URL too long: the user pastes the body into a blank issue, but keep the
  // label on the blank-issue link so the workflow still fires on open.
  return {
    kind: "fallback",
    url: `${base}?${new URLSearchParams({ labels: "ote-event" })}`,
    copyText: body,
  };
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
