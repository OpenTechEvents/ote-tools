// The schemas are embedded (not read from disk at runtime) so this package
// can be bundled for the browser. Their source of truth is @opentechevents/schema
// (pinned in package.json); src/generated/ is produced from it by `pnpm gen`.
//
// These names are the LATEST published version — the schemas a document
// should be written against today. Every published version is embedded (see
// src/generated/), and a document is validated against the one it declares;
// reach those through `loadValidators`, not from here.
export {
  eventSchema,
  feedSchema,
  eventRecommendedSchema,
  feedRecommendedSchema,
  specVersion,
} from "./generated/latest.js";
