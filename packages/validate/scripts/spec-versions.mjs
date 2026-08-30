// Which spec versions @opentechevents/schema ships, read from the package
// itself rather than listed by hand here.
//
// The package exports one subpath per version (`./v0.3/feed.schema.json` and
// friends), and that export map is the only place that knows how many
// versions exist. Deriving the list from it means a spec release that adds
// `v0.5` is picked up by `pnpm gen` with no edit to this repo — and, more to
// the point, cannot be *half* picked up, which is what a hand-maintained list
// invites.
//
// Codegen-time only: this reads @opentechevents/schema's files from disk, so
// nothing here can end up in a browser bundle. See embed-schemas.mjs.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

/**
 * The package's own package.json, reached through its entry point: the
 * package does not export "./package.json" (deliberately — it exports schema
 * documents), so `require.resolve` cannot ask for it directly.
 */
function schemaPackageJsonPath() {
  return join(dirname(fileURLToPath(import.meta.resolve("@opentechevents/schema"))), "package.json");
}

/** `v0.3` → the four (or two) schema documents published under it. */
export function readVersionSchemas(dir) {
  const base = (name) => require(`@opentechevents/schema/${dir}/${name}.schema.json`);
  const event = base("event");
  const feed = base("feed");
  // The recommended (quality) profile is a v0.3 addition. Before that there
  // is no such thing — not "an empty profile", which would silently report
  // every 0.1 document as meeting recommendations it predates.
  let eventRecommended = null;
  let feedRecommended = null;
  try {
    eventRecommended = base("event.recommended");
    feedRecommended = base("feed.recommended");
  } catch {
    // Absent from the export map for this version: see above.
  }
  return { event, feed, eventRecommended, feedRecommended };
}

/**
 * Every published version, oldest first, as
 * `{ dir: "v0.3", version: "0.3.0", schemas, hasRecommended }`.
 *
 * `version` is read from the feed schema's own `specVersion` const — the
 * exact string a document has to declare to be measured against it. Deriving
 * it from the directory name ("v0.3" → "0.3.0") would be a guess about
 * patch numbering that the schema itself answers.
 */
export function publishedVersions() {
  const { exports } = JSON.parse(readFileSync(schemaPackageJsonPath(), "utf8"));

  const dirs = [
    ...new Set(
      Object.keys(exports)
        .map((subpath) => /^\.\/(v\d+\.\d+)\//.exec(subpath)?.[1])
        .filter((dir) => dir !== undefined),
    ),
  ];
  if (dirs.length === 0) {
    throw new Error(
      "spec-versions.mjs: @opentechevents/schema's export map lists no ./v<major>.<minor>/ " +
        "subpaths — its layout changed upstream; update this script.",
    );
  }

  return dirs
    .map((dir) => {
      const schemas = readVersionSchemas(dir);
      const version = schemas.feed.properties?.specVersion?.const;
      if (typeof version !== "string") {
        throw new Error(
          `spec-versions.mjs: ${dir}/feed.schema.json has no specVersion const — the schemas ` +
            "no longer pin their version, which is what makes a version identifiable.",
        );
      }
      return {
        dir,
        version,
        schemas,
        hasRecommended: schemas.eventRecommended !== null,
      };
    })
    .sort((a, b) => compareVersions(a.version, b.version));
}

/** Numeric semver comparison; the strings are `X.Y.Z` by the check above. */
export function compareVersions(a, b) {
  const parts = (v) => v.split(".").map(Number);
  const [aMajor, aMinor, aPatch] = parts(a);
  const [bMajor, bMinor, bPatch] = parts(b);
  return aMajor - bMajor || aMinor - bMinor || aPatch - bPatch;
}
