import { describe, expect, it } from "vitest";

import { tokenizeJsonLine, type Token } from "../src/lib/highlight.js";

/** The tokens of a line, as `kind:text` pairs, for readable assertions. */
const kinds = (line: string): string[] =>
  tokenizeJsonLine(line)
    .filter((token: Token) => token.text.trim() !== "")
    .map((token) => `${token.kind}:${token.text}`);

describe("tokenizeJsonLine", () => {
  it("tells a key from a string by what follows it", () => {
    expect(kinds('  "name": "PyAlmería",')).toEqual([
      'key:"name"',
      "punct::",
      'string:"PyAlmería"',
      "punct:,",
    ]);
  });

  it("keeps a colon inside a string from turning the next string into a key", () => {
    expect(kinds('"url": "https://comunidad.example/a:b"')).toEqual([
      'key:"url"',
      "punct::",
      'string:"https://comunidad.example/a:b"',
    ]);
  });

  it("does not mistake an escaped quote for the end of a string", () => {
    expect(kinds('"quote": "she said \\"hola\\"",')).toEqual([
      'key:"quote"',
      "punct::",
      'string:"she said \\"hola\\""',
      "punct:,",
    ]);
  });

  it("colours numbers and literals", () => {
    expect(kinds('"n": -12.5e3, "ok": true, "x": null')).toEqual([
      'key:"n"',
      "punct::",
      "number:-12.5e3",
      "punct:,",
      'key:"ok"',
      "punct::",
      "literal:true",
      "punct:,",
      'key:"x"',
      "punct::",
      "literal:null",
    ]);
  });

  it("does not read a literal out of the middle of a word", () => {
    expect(kinds("nullable")).toEqual(["literal:null", "plain:able"]);
    expect(kinds('"nullable": 1')).toEqual(['key:"nullable"', "punct::", "number:1"]);
  });

  it("survives the invalid documents this panel exists to show", () => {
    // Unterminated string: the rest of the line is that string, no throw.
    expect(kinds('"name": "sin cerrar')).toEqual(['key:"name"', "punct::", 'string:"sin cerrar']);
    expect(() => tokenizeJsonLine("}}}[[[,,,:::")).not.toThrow();
  });

  it("loses nothing: the tokens rebuild the line exactly", () => {
    const line = '    "events": [{ "id": "https://x/1", "n": 3, "ok": false }],';
    expect(tokenizeJsonLine(line).map((token) => token.text).join("")).toBe(line);
  });
});
