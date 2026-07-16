import { describe, expect, it } from "vitest";

import { tokenizeJson, type Token } from "../src/lib/highlight.js";

function ofType(tokens: Token[], type: Token["type"]): string[] {
  return tokens.filter((t) => t.type === type).map((t) => t.text);
}

describe("tokenizeJson", () => {
  const src = JSON.stringify(
    {
      name: "Async \"night\"",
      count: 3,
      lat: -2.46,
      online: true,
      end: null,
      tags: ["python"],
    },
    null,
    2,
  );
  const tokens = tokenizeJson(src);

  it("round-trips the input text exactly", () => {
    expect(tokens.map((t) => t.text).join("")).toBe(src);
  });

  it("classifies keys separately from string values", () => {
    expect(ofType(tokens, "key")).toEqual([
      '"name"',
      '"count"',
      '"lat"',
      '"online"',
      '"end"',
      '"tags"',
    ]);
    expect(ofType(tokens, "string")).toEqual([
      '"Async \\"night\\""',
      '"python"',
    ]);
  });

  it("classifies numbers and literals", () => {
    expect(ofType(tokens, "number")).toEqual(["3", "-2.46"]);
    expect(ofType(tokens, "literal")).toEqual(["true", "null"]);
  });

  it("handles empty and plain input", () => {
    expect(tokenizeJson("")).toEqual([]);
    expect(tokenizeJson("{}")).toEqual([{ text: "{}", type: "plain" }]);
  });
});
