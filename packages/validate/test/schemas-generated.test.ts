import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { eventSchema, feedSchema } from "../src/schemas.generated.js";

const schemasDir = new URL("../schemas/", import.meta.url);

function loadJson(filename: string): unknown {
  return JSON.parse(readFileSync(new URL(filename, schemasDir), "utf8"));
}

// The generated module embeds the vendored JSON schemas so the package can be
// bundled for the browser. If schemas/ changes without running `pnpm gen`,
// this test fails.
describe("schemas.generated.ts", () => {
  it("eventSchema matches schemas/event.schema.json", () => {
    expect(eventSchema).toEqual(loadJson("event.schema.json"));
  });

  it("feedSchema matches schemas/feed.schema.json", () => {
    expect(feedSchema).toEqual(loadJson("feed.schema.json"));
  });
});
