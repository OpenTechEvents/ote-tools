import { buildFeed, type BuildProblem } from "@opentechevents/build-feed";

import type { OteConfig, OteEvent } from "./types.js";

/**
 * Event files omit specVersion and license (inherited from the feed), so
 * validating them standalone would report errors on fields the form doesn't
 * own. Instead the draft is validated exactly like the real pipeline does:
 * wrapped in a feed assembled by buildFeed, which validates with
 * @opentechevents/validate and attributes every problem back to its source
 * file and field path.
 */

export interface DraftValidation {
  valid: boolean;
  /** Problems in the event itself, keyed by form field id. */
  fieldErrors: Map<string, string[]>;
  /** Event problems that don't map to a single form field. */
  documentErrors: string[];
  /** Problems in ote.config.json — the organizer's to fix, not the form's. */
  configProblems: string[];
}

// When the config is missing/broken the event is validated against a
// placeholder feed, so event fields still get live feedback. The config
// problems are reported separately by the fetch layer.
const PLACEHOLDER_CONFIG = {
  feed: { title: "(no config)", license: "CC0-1.0" },
};

/** Schema path prefix → form field id. Longest prefix wins. */
const PATH_TO_FIELD: ReadonlyArray<[string, string]> = [
  ["location.geo", "geo"],
  ["location.venue", "venue"],
  ["location.onlineUrl", "onlineUrl"],
  ["location", "venue"],
  ["source", "source"],
  ["id", "id"],
  ["url", "url"],
  ["name", "name"],
  ["description", "description"],
  ["startDate", "startDate"],
  ["endDate", "endDate"],
  ["timezone", "timezone"],
  ["license", "license"],
  ["attendanceMode", "attendanceMode"],
  ["languages", "languages"],
  ["tags", "tags"],
  ["status", "status"],
  ["updatedAt", "updatedAt"],
];

function fieldForPath(path: string): string | null {
  for (const [prefix, field] of PATH_TO_FIELD) {
    if (path === prefix || path.startsWith(`${prefix}.`) || path.startsWith(`${prefix}[`)) {
      return field;
    }
  }
  return null;
}

/**
 * Validates a draft event within its feed context. Pure: the clock is
 * injected as `now` (feed updatedAt of the throwaway wrapper feed).
 */
export function validateDraft(
  config: OteConfig | null,
  event: OteEvent,
  now: string,
): DraftValidation {
  const file = "events/(draft).json";
  const result = buildFeed({
    config: config ?? PLACEHOLDER_CONFIG,
    events: [{ file, json: event }],
    now,
  });

  const fieldErrors = new Map<string, string[]>();
  const documentErrors: string[] = [];
  const configProblems: string[] = [];

  const problems: BuildProblem[] = result.ok ? [] : result.problems;
  for (const problem of problems) {
    if (problem.file !== file) {
      configProblems.push(`${problem.path} ${problem.message}`);
      continue;
    }
    const field = fieldForPath(problem.path);
    if (field === null) {
      documentErrors.push(
        problem.path === "(document)"
          ? problem.message
          : `${problem.path} ${problem.message}`,
      );
      continue;
    }
    const list = fieldErrors.get(field) ?? [];
    list.push(problem.message);
    fieldErrors.set(field, list);
  }

  return {
    valid: fieldErrors.size === 0 && documentErrors.length === 0,
    fieldErrors,
    documentErrors,
    configProblems,
  };
}
