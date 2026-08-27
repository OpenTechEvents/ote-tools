/**
 * A JSON tokenizer for the source panel. Small on purpose.
 *
 * Highlighting a document somebody else controls is a place to be careful:
 * this returns *data* — text plus a class name — and the caller creates each
 * span with `textContent`. Nothing here builds markup, so a feed whose event
 * name is `</span><script>` colours badly at worst.
 *
 * It works one line at a time, which JSON allows: a JSON string cannot
 * contain a literal newline, so no token ever spans two lines and the panel
 * can tokenize exactly the lines it renders.
 *
 * It is also deliberately forgiving. The panel shows invalid documents too —
 * that is when people look at it hardest — so an unterminated string or a
 * stray character is coloured as best it can be, never thrown.
 */

export type TokenKind =
  /** A string in key position: `"name":`. */
  | "key"
  | "string"
  | "number"
  /** `true`, `false`, `null`. */
  | "literal"
  /** Braces, brackets, commas, colons. */
  | "punct"
  /** Whitespace, and anything the scanner does not recognize. */
  | "plain";

export interface Token {
  text: string;
  kind: TokenKind;
}

const PUNCTUATION = "{}[],:";

/** Reads a string literal starting at `start` (a quote). Returns its end. */
function endOfString(line: string, start: number): number {
  let index = start + 1;
  while (index < line.length) {
    const char = line[index];
    if (char === "\\") {
      index += 2;
      continue;
    }
    index++;
    if (char === '"') return index;
  }
  // Unterminated: the rest of the line is the string. Invalid JSON, but this
  // panel exists to show invalid JSON.
  return line.length;
}

/** True when the next non-space character is a colon. */
function isKeyPosition(line: string, from: number): boolean {
  for (let index = from; index < line.length; index++) {
    const char = line[index];
    if (char === " " || char === "\t") continue;
    return char === ":";
  }
  return false;
}

/** One line of JSON, split into coloured pieces. */
export function tokenizeJsonLine(line: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  let plain = "";

  const flush = () => {
    if (plain) {
      tokens.push({ text: plain, kind: "plain" });
      plain = "";
    }
  };

  while (index < line.length) {
    const char = line[index];

    if (char === '"') {
      const end = endOfString(line, index);
      const text = line.slice(index, end);
      flush();
      tokens.push({ text, kind: isKeyPosition(line, end) ? "key" : "string" });
      index = end;
      continue;
    }

    if (PUNCTUATION.includes(char)) {
      flush();
      tokens.push({ text: char, kind: "punct" });
      index++;
      continue;
    }

    const number = /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(line.slice(index));
    if (number && (char === "-" || (char >= "0" && char <= "9"))) {
      flush();
      tokens.push({ text: number[0], kind: "number" });
      index += number[0].length;
      continue;
    }

    const literal = /^(?:true|false|null)/.exec(line.slice(index));
    if (literal) {
      flush();
      tokens.push({ text: literal[0], kind: "literal" });
      index += literal[0].length;
      continue;
    }

    plain += char;
    index++;
  }

  flush();
  return tokens;
}
