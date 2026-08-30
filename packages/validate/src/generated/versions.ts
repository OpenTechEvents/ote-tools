// GENERATED FILE — DO NOT EDIT.
// The OTE Spec versions @opentechevents/schema publishes, oldest first,
// derived from its export map (see scripts/spec-versions.mjs).
// Regenerate with: pnpm gen
// A guard test (test/schemas-generated.test.ts) fails if this file drifts.

/**
 * Every version whose schemas this package embeds — which is every version
 * the spec has ever published, because published versions are frozen and
 * their schemas stay reachable. Support (a policy: see src/versions.ts) is a
 * narrower set than this.
 */
export const PUBLISHED_VERSIONS = ["0.1.0","0.2.0","0.3.0","0.4.0"] as const;

/** The newest published version; what a new document should declare. */
export const LATEST_VERSION = "0.4.0";

/**
 * Versions whose schemas include the recommended (quality) profile. Before
 * 0.3.0 the profile did not exist, so there is nothing to check against.
 */
export const VERSIONS_WITH_RECOMMENDED = ["0.3.0","0.4.0"] as const;
