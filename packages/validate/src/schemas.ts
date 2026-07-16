// The schemas are embedded (not read from disk at runtime) so this package
// can be bundled for the browser. Their source of truth is @opentechevents/schema
// (pinned in package.json); src/schemas.generated.ts is produced from it by `pnpm gen`.
export { eventSchema, feedSchema, specVersion } from "./schemas.generated.js";
