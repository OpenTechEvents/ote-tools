import { describe, expect, it } from "vitest";

import {
  indexPositions,
  locatePointer,
  pathToPointer,
  positionOfOffset,
} from "../src/lib/locate.js";

describe("pathToPointer", () => {
  it("converts the validator's readable paths to RFC 6901 pointers", () => {
    expect(pathToPointer("events[3].location.address.locality")).toBe(
      "/events/3/location/address/locality",
    );
    expect(pathToPointer("startDate")).toBe("/startDate");
    expect(pathToPointer("organizers[0]")).toBe("/organizers/0");
    expect(pathToPointer("languages[0][1]")).toBe("/languages/0/1");
  });

  it("maps the document root to the empty pointer", () => {
    expect(pathToPointer("(document)")).toBe("");
    expect(pathToPointer("")).toBe("");
  });
});

describe("indexPositions", () => {
  const source = [
    "{",
    '  "specVersion": "0.3.0",',
    '  "events": [',
    "    {",
    '      "name": "Meetup",',
    '      "startDate": "nope"',
    "    }",
    "  ]",
    "}",
  ].join("\n");

  const positions = indexPositions(source);

  it("locates a nested value at its line and column", () => {
    expect(positions.get("/events/0/startDate")).toMatchObject({ line: 6, column: 20 });
    expect(positions.get("/specVersion")).toMatchObject({ line: 2, column: 18 });
    expect(positions.get("")).toMatchObject({ line: 1, column: 1 });
  });

  it("locates array elements by index", () => {
    expect(positions.get("/events/0")).toMatchObject({ line: 4, column: 5 });
  });

  it("survives escapes, unicode and empty containers", () => {
    const tricky = '{"a":"line\\nbreak","b\\"q":1,"c":{},"d":[],"e":"\\u00e9"}';
    const found = indexPositions(tricky);
    expect(found.has('/b"q')).toBe(true);
    expect(found.has("/c")).toBe(true);
    expect(found.has("/d")).toBe(true);
    expect(found.has("/e")).toBe(true);
  });

  it("escapes / and ~ in keys, as pointers require", () => {
    const found = indexPositions('{"a/b":1,"c~d":2}');
    expect(found.has("/a~1b")).toBe(true);
    expect(found.has("/c~0d")).toBe(true);
  });
});

describe("locatePointer", () => {
  const positions = indexPositions('{\n  "events": [\n    { "name": "x" }\n  ]\n}');

  it("falls back to the nearest ancestor for a property that is not there", () => {
    // "is missing required property startDate": the pointer cannot exist, but
    // the object that should contain it is where the user has to look.
    expect(locatePointer(positions, "/events/0/startDate")).toMatchObject({ line: 3 });
  });

  it("returns null only when even the root is unknown", () => {
    expect(locatePointer(new Map(), "/anything")).toBeNull();
  });
});

describe("positionOfOffset", () => {
  it("converts a raw offset into 1-based line and column", () => {
    expect(positionOfOffset("abc\ndefg", 5)).toMatchObject({ line: 2, column: 2 });
    expect(positionOfOffset("abc", 0)).toMatchObject({ line: 1, column: 1 });
  });
});
