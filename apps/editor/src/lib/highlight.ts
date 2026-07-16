/**
 * Tiny JSON syntax tokenizer for the review dialog. Pure: returns typed
 * tokens, the UI turns them into styled spans (never innerHTML).
 */

export type TokenType = "key" | "string" | "number" | "literal" | "plain";

export interface Token {
  text: string;
  type: TokenType;
}

// Order matters: key (a string followed by a colon) must win over string.
const TOKEN_RE =
  /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(true|false|null)/g;

/** Tokenizes pretty-printed JSON text (as produced by JSON.stringify). */
export function tokenizeJson(src: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of src.matchAll(TOKEN_RE)) {
    const index = match.index;
    if (index > last) {
      tokens.push({ text: src.slice(last, index), type: "plain" });
    }
    const [, str, colon, num, lit] = match;
    if (str !== undefined) {
      tokens.push({ text: str, type: colon ? "key" : "string" });
      if (colon) tokens.push({ text: colon, type: "plain" });
    } else if (num !== undefined) {
      tokens.push({ text: num, type: "number" });
    } else if (lit !== undefined) {
      tokens.push({ text: lit, type: "literal" });
    }
    last = index + match[0].length;
  }
  if (last < src.length) {
    tokens.push({ text: src.slice(last), type: "plain" });
  }
  return tokens;
}
