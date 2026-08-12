import type { BulkEditEntry } from "./series.js";
import type { OteEvent } from "./types.js";

/**
 * The outputs of the editor, per DESIGN.md ("Flujo de escritura"): a
 * prefilled issue in the target repo (one event, or several batched
 * together — see proposeBatchChangeUrl), or a direct-edit link for the
 * owner. URLs above ~8K chars are rejected by browsers/GitHub, so every
 * prefilled form falls back to "copy this, then open the blank page".
 */

export const MAX_URL_LENGTH = 8000;

/**
 * GitHub's own hard cap on an issue body — over this, creating the issue
 * fails outright (not a silent truncation). MAX_URL_LENGTH above already
 * keeps every prefilled-URL body well under this by construction, so it
 * only matters for the copy-paste `fallback` bodies the batch/bulk flows
 * produce (many events in one issue) — those have no length check of
 * their own today. Callers should check `exceedsIssueBodyLimit` before
 * asking the organizer to paste a fallback body into GitHub's form, and
 * suggest splitting the selection (fewer occurrences) rather than letting
 * them discover the rejection on GitHub's own page.
 */
export const GITHUB_ISSUE_BODY_MAX_LENGTH = 65536;

export function exceedsIssueBodyLimit(body: string): boolean {
  return body.length > GITHUB_ISSUE_BODY_MAX_LENGTH;
}

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

/** A recurring-series occurrence's own varying fields — everything else
 * comes from the shared template (see recurringTemplateIssueBody). */
export interface RecurringOccurrenceOverride {
  id: string;
  startDate: string;
  endDate?: string;
}

/**
 * The issue body for a recurring-series batch-create: ONE shared template
 * plus a compact per-occurrence id/startDate/endDate override list, instead
 * of repeating the ~2-3KB template once per occurrence. A single
 * `_oteBatchMode: "recurring-template"` fenced block — same "transient
 * signal riding on the JSON payload" convention as `_localizeImages` above
 * — expanded back into one full document per occurrence server-side by
 * .github/scripts/issue-to-pr.mjs's parseRecurringTemplateBlock. The editor
 * still owns all date math and id suggestion; only the shared template's
 * repetition is what this avoids.
 */
export function recurringTemplateIssueBody(
  template: OteEvent,
  occurrences: RecurringOccurrenceOverride[],
  imagesToLocalize?: string[],
): string {
  const intro = [
    `${occurrences.length} events generated with the OTE editor (e.g. a recurring`,
    "series); a maintainer (or the repo's automation) will turn them into",
    "one PR with one file per event.",
    "",
  ];
  const templateBody = imagesToLocalize?.length
    ? { ...template, _localizeImages: imagesToLocalize }
    : template;
  const block = [
    "```json",
    JSON.stringify({ _oteBatchMode: "recurring-template", template: templateBody, occurrences }, null, 2),
    "```",
  ];
  return [...intro, ...block, ""].join("\n");
}

/**
 * "Proponer cambio" for a generated recurring series: always a blank-issue
 * + copy-paste flow, never a prefilled URL — the template already carries
 * enough JSON on its own that a URL-prefill isn't worth attempting.
 *
 * `labels` MUST include `ote-event`, not just `ote-batch`: the reusable
 * issue-to-pr workflow's caller-side gate
 * (`contains(github.event.issue.labels.*.name, 'ote-event')`) checks labels,
 * not the title prefix, so an issue missing it is silently skipped, not
 * failed. Unlike the single-event flow (proposeChangeUrl), which gets its
 * label from the repo's issue *template* rather than the `labels=` URL
 * param — because a `labels=` param only takes effect when the issue
 * author has triage permission, which an anonymous proposer usually
 * doesn't — this batch flow is only ever reached from a connected repo the
 * organizer themselves is editing, so they do have that permission and the
 * URL param works.
 */
export function proposeBatchChangeUrl(
  repo: string,
  template: OteEvent,
  occurrences: RecurringOccurrenceOverride[],
  imagesToLocalize?: string[],
): LinkResult {
  const name = template.name;
  const title = name
    ? `[ote-event] Add ${name} series (${occurrences.length} events)`
    : `[ote-event] Add ${occurrences.length} events`;
  const params = new URLSearchParams({
    title,
    labels: "ote-event,ote-batch",
  });
  const base = `https://github.com/${repo}/issues/new?${params}`;
  return {
    kind: "fallback",
    url: base,
    copyText: recurringTemplateIssueBody(template, occurrences, imagesToLocalize),
  };
}

/** A `_oteBatchMode: "patch"` block for one slug's own patch — see
 * patchIssueBody. */
function patchBlock(slug: string, patch: Record<string, unknown>): string {
  return ["```json", JSON.stringify({ _oteBatchMode: "patch", slug, patch }, null, 2), "```"].join(
    "\n",
  );
}

/** A `_oteBatchMode: "shared-patch"` block: one `patch` applied identically
 * to every slug in `slugs` — see patchIssueBody. */
function sharedPatchBlock(slugs: string[], patch: Record<string, unknown>): string {
  return [
    "```json",
    JSON.stringify({ _oteBatchMode: "shared-patch", slugs, patch }, null, 2),
    "```",
  ].join("\n");
}

/**
 * One wire block per DISTINCT patch, not per entry: entries with
 * `slug !== null` whose `.patch` (from `diffEventJson`/`applyBulkEdit` in
 * lib/series.ts — a `null` value means "delete this key") is byte-for-byte
 * identical (JSON.stringify equal) are combined into a single
 * `_oteBatchMode: "shared-patch"` block naming every one of their slugs,
 * instead of repeating the same value once per file — the common case for
 * a bulk edit that only touches shared template fields, with no
 * per-occurrence date override. An entry whose patch differs from every
 * other entry's (e.g. it also carries its own date override, or the
 * organizer left one occurrence out of the shared change) keeps its own
 * individual `_oteBatchMode: "patch"` block instead. An entry with
 * `slug === null` (the feed-fallback listing, no confirmed filename) always
 * falls back to a full document block — patch mode needs an authoritative
 * existing filename to target, which only a known slug can give it. Both
 * block shapes are expanded back onto their target file(s) server-side by
 * issue-to-pr.mjs's `resolvePatchOps`. Each returned block appears at the
 * position of its group's first member in `entries`.
 */
export function patchIssueBody(entries: BulkEditEntry[]): string[] {
  const bySignature = new Map<string, BulkEditEntry[]>();
  for (const entry of entries) {
    if (entry.slug === null) continue;
    const signature = JSON.stringify(entry.patch);
    const group = bySignature.get(signature);
    if (group) group.push(entry);
    else bySignature.set(signature, [entry]);
  }
  const emitted = new Set<BulkEditEntry>();
  const blocks: string[] = [];
  for (const entry of entries) {
    if (emitted.has(entry)) continue;
    if (entry.slug === null) {
      emitted.add(entry);
      blocks.push(fencedEventJson(entry.event));
      continue;
    }
    const group = bySignature.get(JSON.stringify(entry.patch))!;
    for (const member of group) emitted.add(member);
    blocks.push(
      group.length > 1
        ? sharedPatchBlock(
            group.map((member) => member.slug as string),
            entry.patch,
          )
        : patchBlock(entry.slug, entry.patch),
    );
  }
  return blocks;
}

/**
 * The issue body for a bulk edit of several EXISTING events (the editor's
 * "Edit series" tool): a numbered summary of what changed per file, then
 * the wire blocks that carry it (see patchIssueBody) — kept as two separate
 * sections rather than one block per numbered entry, since a single
 * shared-patch block can now cover several of the numbered entries at
 * once. Says "Update", not "Add": the workflow itself doesn't care (it
 * derives Add vs Update per file by checking whether events/<slug>.json
 * already exists on the default branch — see issue-to-pr.yml), but a
 * maintainer reading the issue should see the truth.
 */
export function bulkEditIssueBody(entries: BulkEditEntry[]): string {
  const intro = [
    `Bulk edit: ${entries.length} existing event(s) updated together with the OTE`,
    "editor's \"Edit series\" tool. Each file is patched with only its own",
    "changed fields listed below — a maintainer (or the repo's automation)",
    "merges each patch in, it does not replace the file. Identical changes",
    "shared by several files are sent once as a single shared-patch block",
    "instead of being repeated per file.",
    "",
  ];
  const summary = entries.map((entry, index) => {
    const name = entry.event.name ?? "(unnamed event)";
    const file = entry.slug ? ` (\`events/${entry.slug}.json\`)` : "";
    return `${index + 1}. ${name}${file} — Changed: ${entry.changedFields.join(", ")}`;
  });
  const blocks = patchIssueBody(entries);
  return [...intro, ...summary, "", ...blocks.flatMap((block) => [block, ""])].join("\n");
}

/**
 * "Editar la serie" for several EXISTING events at once. Always a blank-
 * issue + copy-paste flow, same justification as proposeBatchChangeUrl (N
 * full event documents reliably exceed MAX_URL_LENGTH well before double
 * digits). Same "ote-event,ote-batch" labels — see proposeBatchChangeUrl's
 * own doc comment for why the URL param works here (a connected-repo
 * organizer has triage permission) but not for the anonymous single-event
 * proposeChangeUrl flow.
 */
export function proposeBulkEditUrl(repo: string, entries: BulkEditEntry[]): LinkResult {
  const title = `[ote-event] Update ${entries.length} event(s)`;
  const params = new URLSearchParams({ title, labels: "ote-event,ote-batch" });
  const base = `https://github.com/${repo}/issues/new?${params}`;
  return { kind: "fallback", url: base, copyText: bulkEditIssueBody(entries) };
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

/** One line per event to delete — same plain-text convention as
 * proposeDeleteUrl (no automated delete-parsing exists, a human reads
 * this), just a list instead of a single event. */
export function bulkDeleteIssueBody(entries: Array<{ slug: string | null; event: OteEvent }>): string {
  const intro = [
    `Please delete these ${entries.length} event(s) — no longer happening / added by mistake.`,
    "",
  ];
  const lines = entries.map((entry) => {
    const file = entry.slug !== null ? ` — \`events/${entry.slug}.json\`` : "";
    return `- ${entry.event.name ?? entry.event.id}${file} (id: ${entry.event.id})`;
  });
  return [...intro, ...lines, "", "(opened via the OTE editor)"].join("\n");
}

/**
 * "Eliminar serie": the "Delete series" bulk equivalent of proposeDeleteUrl.
 * Short, plain-text body (a list, not full JSON per event) — a prefilled
 * URL is realistic for a normal-sized series, unlike the JSON-heavy batch
 * create/edit flows, so this tries the prefilled URL first like
 * proposeDeleteUrl/proposeChangeUrl do, rather than always falling back.
 */
export function proposeBulkDeleteUrl(
  repo: string,
  entries: Array<{ slug: string | null; event: OteEvent }>,
): LinkResult {
  const base = `https://github.com/${repo}/issues/new`;
  const title = `[ote-event] Delete ${entries.length} event(s)`;
  const body = bulkDeleteIssueBody(entries);
  const params = new URLSearchParams({ title, body });
  const url = `${base}?${params}`;
  if (url.length <= MAX_URL_LENGTH) return { kind: "url", url };
  return { kind: "fallback", url: base, copyText: body };
}
