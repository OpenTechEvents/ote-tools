// Types for the codegen scripts, so their guard tests
// (test/compiled-validators.test.ts, test/schemas-generated.test.ts) can
// import them under `strict`.
export interface VersionSchemas {
  event: Record<string, unknown>;
  feed: Record<string, unknown>;
  /** Null before 0.3, which is where the recommended profile was introduced. */
  eventRecommended: Record<string, unknown> | null;
  feedRecommended: Record<string, unknown> | null;
}

export interface PublishedVersion {
  /** Directory in @opentechevents/schema, e.g. "v0.3". */
  dir: string;
  /** The `specVersion` a document must declare, e.g. "0.3.0". */
  version: string;
  schemas: VersionSchemas;
  hasRecommended: boolean;
}

export function compiledValidatorsSource(entry: PublishedVersion): string;
