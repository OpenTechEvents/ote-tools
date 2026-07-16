// The schemas are embedded (not read from disk at runtime) so this package
// can be bundled for the browser. schemas/*.json stays the vendored source
// of truth; src/schemas.generated.ts is produced from it by `pnpm gen`.
export { eventSchema, feedSchema } from "./schemas.generated.js";
