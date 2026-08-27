/**
 * Making a minified document readable enough to point at.
 *
 * Every finding here is addressed to a line: "line 42, column 7", clickable,
 * highlighted in the source panel. A feed served minified is one line, so all
 * of that collapses into "line 1, column 8452" — technically true and
 * completely useless, which is the whole reason this module exists.
 *
 * Published feeds are *usually* minified: they are built artefacts. So this is
 * not an edge case, it is the common case for the URL mode.
 *
 * The reformatting is for display only. The document is never sent anywhere,
 * never written back, and the verdict does not change: `JSON.stringify` of the
 * parsed value is the same JSON value the schema already judged. What it does
 * change is where the findings *point*, so the source shown to the user and
 * the source the report was built from must be the same text — see
 * `validateSource` in main.ts, which validates the reformatted copy rather
 * than reformatting after the fact.
 */

/**
 * Longest line a human still reads as a line. Well past any wrapped
 * description in a hand-written feed, well under one line of minified JSON.
 */
export const READABLE_LINE_LENGTH = 400;

/** True when at least one line is too long to point inside of. */
export function looksMinified(source: string): boolean {
  let longest = 0;
  let current = 0;
  for (const char of source) {
    if (char === "\n") {
      longest = Math.max(longest, current);
      current = 0;
      // A single overlong line is enough; no need to scan the rest.
      if (longest > READABLE_LINE_LENGTH) return true;
    } else {
      current++;
    }
  }
  return Math.max(longest, current) > READABLE_LINE_LENGTH;
}

/**
 * The same document, indented. `null` when it cannot be parsed — a broken
 * document is exactly the one that must not be rewritten, since the bytes
 * around the syntax error are what the user has to look at.
 */
export function reformatJson(source: string): string | null {
  try {
    return JSON.stringify(JSON.parse(source), null, 2);
  } catch {
    return null;
  }
}
