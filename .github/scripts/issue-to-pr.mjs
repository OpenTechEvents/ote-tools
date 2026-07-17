// Step script of the issue-to-pr.yml reusable workflow. Runs from the
// ote-tools checkout (`.ote-tools/`) after @opentechevents/validate is
// built, so validation is the exact same implementation the validate.yml
// workflow and the packages use.
//
// Reads the issue body, extracts the event JSON from the first fenced code
// block, validates it against the OTE event schema and derives the
// events/<slug>.json filename.
//
// Env in:
//   ISSUE_BODY          full issue body
//   OTE_COMMENT_MARKER  hidden marker that identifies the workflow's comment
//   RUNNER_TEMP         directory for the result files
// Outputs (GITHUB_OUTPUT):
//   valid  "true" | "false"
//   slug   filename slug (only when valid; matches /^[A-Za-z0-9._-]+$/)
// Files (in RUNNER_TEMP):
//   ote-event.json  normalized event JSON, ready to commit (only when valid)
//   ote-comment.md  issue comment body (only when invalid — the success
//                   comment is written by the workflow, it needs the PR URL)

import { appendFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { validateEventInFeed } from "../../packages/validate/dist/index.js";

const marker = process.env.OTE_COMMENT_MARKER ?? "<!-- ote-issue-to-pr -->";
const tmp = process.env.RUNNER_TEMP ?? ".";

function setOutputs(pairs) {
  const lines = Object.entries(pairs).map(([key, value]) => `${key}=${value}`);
  appendFileSync(process.env.GITHUB_OUTPUT, lines.join("\n") + "\n");
}

/** Writes the invalid-proposal comment, reports valid=false and exits 0. */
function reject(title, details) {
  const body = [
    marker,
    `### ❌ ${title}`,
    "",
    ...details,
    "",
    "Edit the issue body to fix this — validation re-runs automatically on",
    "every edit. No pull request was opened.",
  ].join("\n");
  writeFileSync(join(tmp, "ote-comment.md"), body + "\n");
  setOutputs({ valid: "false" });
  process.exit(0);
}

// Slugs must be usable as a filename in events/ and in URLs we build.
// Mirrors apps/editor/src/lib/repo.ts (slugFromId) and
// apps/editor/src/lib/event-json.ts (suggestSlug) so the file lands where
// the editor expects it.
const SLUG_RE = /^[A-Za-z0-9._-]+$/;

function slugFromId(id) {
  if (typeof id !== "string") return null;
  let pathname;
  try {
    pathname = new URL(id).pathname;
  } catch {
    return null;
  }
  const segment = decodeURIComponent(
    pathname.split("/").filter(Boolean).at(-1) ?? "",
  );
  const slug = segment.endsWith(".json")
    ? segment.slice(0, -".json".length)
    : segment;
  return SLUG_RE.test(slug) ? slug : null;
}

function suggestSlug(name, startDate) {
  const yearMonth = /^(\d{4}-\d{2})/.exec(startDate)?.[1];
  const kebab = String(name)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!kebab) return null;
  return yearMonth ? `${yearMonth}-${kebab}` : kebab;
}

const body = process.env.ISSUE_BODY ?? "";
const fenced = body.match(/```[^\n]*\r?\n([\s\S]*?)\r?\n?```/);
if (!fenced) {
  reject("No event JSON found in this issue", [
    "The issue body must contain the event as a fenced code block",
    "(<code>```json … ```</code>). The OTE editor's **Propose change**",
    "button generates the issue in the right shape.",
  ]);
}

let event;
try {
  event = JSON.parse(fenced[1]);
} catch (error) {
  reject("The event JSON does not parse", [
    "```",
    String(error.message),
    "```",
  ]);
}

// Feed context, not standalone: events/<slug>.json is a feed fragment that
// inherits specVersion and license from the feed (same rules build-feed
// --check applies — the editor deliberately omits both fields).
const result = validateEventInFeed(event);
if (!result.valid) {
  reject("The event JSON is not valid against the OTE event schema", [
    ...result.errors.map((e) => `- \`${e.path}\` — ${e.message}`),
  ]);
}

const slug = slugFromId(event.id) ?? suggestSlug(event.name, event.startDate);
if (!slug) {
  reject("Cannot derive a filename for this event", [
    "The event is valid, but neither its `id` (last path segment) nor its",
    "`name` yields a filename-safe slug for `events/<slug>.json`.",
    "Give the `id` a final path segment matching `[A-Za-z0-9._-]+`.",
  ]);
}

writeFileSync(
  join(tmp, "ote-event.json"),
  JSON.stringify(event, null, 2) + "\n",
);
setOutputs({ valid: "true", slug });
