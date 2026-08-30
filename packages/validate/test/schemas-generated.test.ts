import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

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
} from "../src/generated/latest.js";
import { VERSION_MODULES } from "../src/generated/modules.js";
import {
  LATEST_VERSION,
  PUBLISHED_VERSIONS,
  VERSIONS_WITH_RECOMMENDED,
} from "../src/generated/versions.js";

const { latestModule, modulesModule, schemasModule, versionsModule } = await import(
  "../scripts/generate-sources.mjs"
);
const { publishedVersions } = await import("../scripts/spec-versions.mjs");

// src/generated/ embeds the schemas from @opentechevents/schema so the package
// can be bundled for the browser. This is the drift guard: when the dependency
// is bumped to a new spec release (Dependabot opens that PR), these tests fail
// until `pnpm gen` re-embeds — stale schemas can never ship, and a release
// that adds a version can never be *half* adopted, which is the failure the
// version list and the module map below are here to make impossible.
//
// customFormats/customKeywords/annotationKeywords are covered by the
// companion guard test in validators-generated.test.ts instead: they carry
// real validator functions, vendored (not embedded as JSON) into
// src/validators.generated.ts — see scripts/embed-schemas.mjs.
const entries = publishedVersions();

const generatedFile = (relative: string): string =>
  readFileSync(fileURLToPath(new URL(`../src/generated/${relative}`, import.meta.url)), "utf8");

describe("generated/versions.ts", () => {
  it("matches what the generator writes", () => {
    expect(generatedFile("versions.ts")).toBe(versionsModule(entries));
  });

  it("lists exactly the versions @opentechevents/schema publishes, oldest first", () => {
    expect([...PUBLISHED_VERSIONS]).toEqual(entries.map((entry) => entry.version));
  });

  it("names the newest version as the latest", () => {
    expect(LATEST_VERSION).toBe(entries[entries.length - 1]!.version);
    // The pinned dependency's own headline version: the package's latest is
    // the spec release it was generated from, not one of the older sets it
    // also carries.
    expect(LATEST_VERSION).toBe(specSpecVersion);
  });

  it("records which versions carry a recommended profile", () => {
    expect([...VERSIONS_WITH_RECOMMENDED]).toEqual(
      entries.filter((entry) => entry.hasRecommended).map((entry) => entry.version),
    );
  });
});

describe("generated/modules.ts", () => {
  it("matches what the generator writes", () => {
    expect(generatedFile("modules.ts")).toBe(modulesModule(entries));
  });

  it("has a loader for every published version, and only those", () => {
    expect(Object.keys(VERSION_MODULES).sort()).toEqual([...PUBLISHED_VERSIONS].sort());
  });
});

describe("generated/latest.ts", () => {
  it("matches what the generator writes", () => {
    expect(generatedFile("latest.ts")).toBe(latestModule(entries));
  });

  it("re-exports the pinned dependency's own schemas", () => {
    expect(specVersion).toBe(specSpecVersion);
    expect(eventSchema).toEqual(specEventSchema);
    expect(feedSchema).toEqual(specFeedSchema);
    expect(eventRecommendedSchema).toEqual(specEventRecommendedSchema);
    expect(feedRecommendedSchema).toEqual(specFeedRecommendedSchema);
  });
});

describe.each(entries)("generated/$dir/schemas.ts", (entry) => {
  // Text, not a deep-equal against an import: a computed dynamic import is
  // something neither the bundler nor the type checker can follow, and the
  // embedded JSON in this text came from the live package a line above.
  it("matches what the generator writes from @opentechevents/schema", () => {
    expect(generatedFile(`${entry.dir}/schemas.ts`)).toBe(schemasModule(entry));
  });

  it("embeds the version its schemas pin", () => {
    expect(generatedFile(`${entry.dir}/schemas.ts`)).toContain(
      `export const specVersion = ${JSON.stringify(entry.version)};`,
    );
  });

  it("carries the recommended profile exactly when the version has one", () => {
    const source = generatedFile(`${entry.dir}/schemas.ts`);
    // Null, not an empty schema: a 0.1 document has not "met every
    // recommendation", it predates the profile entirely.
    expect(source.includes("export const eventRecommendedSchema = null;")).toBe(
      !entry.hasRecommended,
    );
  });
});
