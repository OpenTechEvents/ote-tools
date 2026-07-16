import {
  eventSchema as specEventSchema,
  feedSchema as specFeedSchema,
  specVersion as specSpecVersion,
} from "@opentechevents/schema";
import { describe, expect, it } from "vitest";

import { eventSchema, feedSchema, specVersion } from "../src/schemas.generated.js";

// The generated module embeds the schemas from @opentechevents/schema so the
// package can be bundled for the browser. This is the drift guard: when the
// dependency is bumped to a new spec release (Dependabot opens that PR), these
// tests fail until `pnpm gen` re-embeds — stale schemas can never ship.
describe("schemas.generated.ts", () => {
  it("eventSchema matches @opentechevents/schema", () => {
    expect(eventSchema).toEqual(specEventSchema);
  });

  it("feedSchema matches @opentechevents/schema", () => {
    expect(feedSchema).toEqual(specFeedSchema);
  });

  it("specVersion matches @opentechevents/schema", () => {
    expect(specVersion).toBe(specSpecVersion);
  });
});
