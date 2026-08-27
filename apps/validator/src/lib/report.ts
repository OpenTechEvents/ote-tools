/**
 * Source text in, verdict out.
 *
 * Two rules shape everything here:
 *
 * 1. **`@opentechevents/validate` is reused verbatim.** The validator must not
 *    hold a second opinion about what is valid — if this page and CI disagree,
 *    the format has no referee, which is the entire reason this tool exists.
 * 2. **MUST and SHOULD are never mixed.** Schema failures mean *invalid*;
 *    unmet recommendations mean *valid, but findable by fewer people*.
 *    Blending them makes the tool useless for the second case and cruel for
 *    the first.
 */

import { detectDocumentKind, type OteDocumentKind } from "@opentechevents/discover-feed";
import {
  checkEventRecommended,
  checkFeedRecommended,
  specVersion,
  validateEvent,
  validateFeed,
  type ValidationError,
} from "@opentechevents/validate";

import {
  indexPositions,
  locatePointer,
  pathToPointer,
  positionOfOffset,
  type SourcePosition,
} from "./locate.js";

/** Which schema a document is checked against. */
export type DocumentKind = "feed" | "event";

/** One finding, addressed to a place in the user's own file. */
export interface Finding {
  /** Readable path from the validator, e.g. `events[0].startDate`. */
  path: string;
  /** RFC 6901 pointer for the same place; "" is the document root. */
  pointer: string;
  message: string;
  /** Where to look in the source. Null when the pointer cannot be located. */
  position: SourcePosition | null;
}

export type Report =
  | { status: "empty" }
  | { status: "too-large"; message: string }
  | { status: "too-deep"; message: string }
  | { status: "parse-error"; message: string; position: SourcePosition }
  | {
      status: "validated";
      /** Schema actually applied. */
      kind: DocumentKind;
      /** What the document's shape suggested, before any user override. */
      detected: OteDocumentKind;
      /** True when nothing MUST-level failed. Recommendations do not affect it. */
      valid: boolean;
      /** MUST: schema violations. A document with any of these is invalid. */
      errors: Finding[];
      /** SHOULD: unmet spec recommendations. Never make a document invalid. */
      recommendations: Finding[];
      /** Spec version the bundled validator implements. */
      specVersion: string;
    };

/**
 * Same ceiling the fetcher enforces, applied again here because the paste and
 * upload modes never go through the fetcher.
 */
export const MAX_SOURCE_BYTES = 5 * 1024 * 1024;

/**
 * Nesting ceiling, checked by scanning the text *before* `JSON.parse` sees
 * it: a deeply nested document is the cheap way to blow a parser's stack, and
 * OTE's own schema nests a handful of levels, nowhere near this.
 */
export const MAX_DEPTH = 64;

/** Deepest bracket nesting in the source, ignoring brackets inside strings. */
export function maxDepth(source: string): number {
  let depth = 0;
  let deepest = 0;
  let inString = false;
  let escaped = false;
  for (const char of source) {
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{" || char === "[") deepest = Math.max(deepest, ++depth);
    else if (char === "}" || char === "]") depth--;
  }
  return deepest;
}

/** Pulls a source position out of the engine's own SyntaxError message. */
function parseErrorPosition(source: string, error: unknown): SourcePosition {
  const message = error instanceof Error ? error.message : "";
  const lineColumn = /line (\d+) column (\d+)/.exec(message);
  if (lineColumn) {
    const line = Number(lineColumn[1]);
    const column = Number(lineColumn[2]);
    const offset =
      source.split("\n").slice(0, line - 1).reduce((sum, text) => sum + text.length + 1, 0) +
      column -
      1;
    return { offset, line, column };
  }
  const position = /position (\d+)/.exec(message);
  return positionOfOffset(source, position ? Number(position[1]) : 0);
}

function toFindings(
  errors: ValidationError[],
  positions: Map<string, SourcePosition>,
): Finding[] {
  return errors.map(({ path, message }) => {
    const pointer = pathToPointer(path);
    return { path, pointer, message, position: locatePointer(positions, pointer) };
  });
}

export interface ReportOptions {
  /** Overrides shape detection when the user corrects it by hand. */
  kind?: DocumentKind;
}

/**
 * Validates a document given as text.
 *
 * Pure: no network, no DOM, no clock. The upload and paste modes call this
 * directly in the browser, which is what makes them work with the fetcher
 * down — and what keeps a document nobody wants to share off the network.
 */
export function buildReport(source: string, options: ReportOptions = {}): Report {
  if (source.trim() === "") return { status: "empty" };

  if (source.length > MAX_SOURCE_BYTES) {
    return {
      status: "too-large",
      message: `This document is larger than the ${Math.round(MAX_SOURCE_BYTES / (1024 * 1024))} MB this page validates.`,
    };
  }

  if (maxDepth(source) > MAX_DEPTH) {
    return {
      status: "too-deep",
      message: `This document nests deeper than ${MAX_DEPTH} levels, which no OTE document does.`,
    };
  }

  let json: unknown;
  try {
    json = JSON.parse(source);
  } catch (error) {
    return {
      status: "parse-error",
      message: error instanceof Error ? error.message : "This is not valid JSON.",
      position: parseErrorPosition(source, error),
    };
  }

  const detected = detectDocumentKind(json);
  // An unrecognizable shape still gets validated — against the feed schema,
  // whose errors ("missing events", "missing title") are what an ambiguous
  // document usually needs to hear. The UI shows the guess and lets the user
  // switch, because the document being debugged is exactly the one whose
  // shape is unclear.
  const kind: DocumentKind = options.kind ?? (detected === "event" ? "event" : "feed");

  const positions = indexPositions(source);
  const validity = kind === "feed" ? validateFeed(json) : validateEvent(json);
  const recommended = kind === "feed" ? checkFeedRecommended(json) : checkEventRecommended(json);

  return {
    status: "validated",
    kind,
    detected,
    valid: validity.valid,
    errors: toFindings(validity.errors, positions),
    recommendations: toFindings(recommended.errors, positions),
    specVersion,
  };
}
