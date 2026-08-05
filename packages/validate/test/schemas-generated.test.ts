import {
  eventSchema as specEventSchema,
  eventRecommendedSchema as specEventRecommendedSchema,
  feedSchema as specFeedSchema,
  feedRecommendedSchema as specFeedRecommendedSchema,
  specVersion as specSpecVersion,
} from "@opentechevents/schema";
import { describe, expect, it } from "vitest";

import {
  eventSchema,
  eventRecommendedSchema,
  feedSchema,
  feedRecommendedSchema,
  specVersion,
} from "../src/schemas.generated.js";

// The generated module embeds the schemas from @opentechevents/schema so the
// package can be bundled for the browser. This is the drift guard: when the
// dependency is bumped to a new spec release (Dependabot opens that PR), these
// tests fail until `pnpm gen` re-embeds — stale schemas can never ship.
//
// customFormats/customKeywords/annotationKeywords are covered by the
// companion guard test in validators-generated.test.ts instead: they carry
// real validator functions, vendored (not embedded as JSON) into
// src/validators.generated.ts — see scripts/embed-schemas.mjs.
describe("schemas.generated.ts", () => {
  it("eventSchema matches @opentechevents/schema", () => {
    expect(eventSchema).toEqual(specEventSchema);
  });

  it("feedSchema matches @opentechevents/schema", () => {
    expect(feedSchema).toEqual(specFeedSchema);
  });

  it("eventRecommendedSchema matches @opentechevents/schema", () => {
    expect(eventRecommendedSchema).toEqual(specEventRecommendedSchema);
  });

  it("feedRecommendedSchema matches @opentechevents/schema", () => {
    expect(feedRecommendedSchema).toEqual(specFeedRecommendedSchema);
  });

  it("specVersion matches @opentechevents/schema", () => {
    expect(specVersion).toBe(specSpecVersion);
  });
});
