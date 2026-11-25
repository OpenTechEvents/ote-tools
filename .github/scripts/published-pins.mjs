// Compares the sibling pins inside each *published* package against what this
// workspace would publish today. Run it as part of the release checklist:
//
//     node .github/scripts/published-pins.mjs
//     node .github/scripts/published-pins.mjs --json
//
// Exit 0 = every published pin names the version this workspace ships.
//      1 = gaps, all of them a patch behind — a decision to record, not a bug.
//      2 = something to act on: a pin a minor or more behind, newer than the
//          workspace, naming a package this workspace does not ship, or not an
//          exact version at all.
//
// Why this exists, and why it is a script rather than a test. Every package
// here depends on its siblings with `workspace:*`, which pnpm rewrites to the
// **exact** version at pack time. The tarball is what a user installs, so a
// published package carries a frozen pin that this repo's own manifests do not
// show — and nothing checked them. `import-jsonld@0.6.0` shipped pinning
// `import-ics@0.4.1`, two minors behind, from the 0.6.0 release until #133,
// and it took a registry sweep during an unrelated review to see it.
//
// A vitest guard would have been the wrong shape: it would make `pnpm test`
// depend on npm being reachable, so the suite would fail for a reason that has
// nothing to do with the change under review. A release-time script leaves the
// answer where the decision is made. The comparison itself is pure and tested
// (`published-pins.test.mjs`); only `main()` touches the network.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const REGISTRY = "https://registry.npmjs.org";
const SCOPE = "@opentechevents/";

/** Every publishable workspace package: name → version. */
export function workspaceVersions(repoRoot) {
  const versions = new Map();
  for (const group of ["packages", "apps"]) {
    const base = join(repoRoot, group);
    if (!existsSync(base)) continue;
    for (const entry of readdirSync(base)) {
      const manifest = join(base, entry, "package.json");
      if (!existsSync(manifest)) continue;
      const pkg = JSON.parse(readFileSync(manifest, "utf8"));
      if (!pkg.name || !pkg.version || pkg.private) continue;
      versions.set(pkg.name, pkg.version);
    }
  }
  return versions;
}

/**
 * The premise of this script is that the pin in a tarball is **frozen** — an
 * exact `x.y.z` that pnpm wrote from `workspace:*`. Anything else breaks the
 * premise rather than failing the comparison, so it is reported as its own
 * finding instead of being coerced into one.
 *
 * The case that made this explicit: `parts()` parses `"0-rc"` as `0`, so a
 * prerelease pin like `0.7.0-rc.1` compared **equal** to `0.7.0` and the
 * single worst pin this script could meet came back clean. A range is the
 * milder version of the same lie — reporting `^0.6.0` as "a patch behind"
 * describes something that is not true, since it resolves to whatever is
 * newest.
 */
const EXACT = /^\d+\.\d+\.\d+$/;

const parts = (version) => version.split(".").map((n) => Number.parseInt(n, 10) || 0);

/**
 * How far apart two versions are, in the terms a release decision needs:
 * `patch` is "the sibling shipped a fix since", which is usually fine and
 * always worth saying out loud; anything wider means the published package
 * calls into a line the workspace has moved past.
 */
export function distance(pinned, shipped) {
  if (!EXACT.test(pinned)) return "not-frozen";
  if (pinned === shipped) return "match";
  const [pinnedParts, shippedParts] = [parts(pinned), parts(shipped)];
  for (let i = 0; i < 3; i++) {
    if (pinnedParts[i] === shippedParts[i]) continue;
    if (pinnedParts[i] > shippedParts[i]) return "ahead";
    return i === 2 ? "patch-behind" : "behind";
  }
  return "match";
}

/**
 * The whole judgement, over data somebody else fetched.
 *
 * `published` is one entry per package as the registry has it:
 * `{ name, version, dependencies }`. A package this workspace does not
 * publish is ignored, and a sibling the workspace does not ship is reported
 * rather than skipped — that is how a renamed or unpublished dependency would
 * show up.
 *
 * One blind spot worth knowing rather than coding around: a package marked
 * `private: true` leaves the sweep entirely, so retiring a *published*
 * package by making it private also retires its frozen pins from view. All
 * three private packages here are also unpublished, so there is nothing
 * behind it today.
 */
export function comparePins({ workspace, published }) {
  const rows = [];
  for (const entry of published) {
    if (!workspace.has(entry.name)) continue;
    // `peerDependencies` and `optionalDependencies` too: no manifest here
    // declares either today, and a peer pin on a stale sibling would be the
    // same defect reported as clean.
    const declared = {
      ...(entry.dependencies ?? {}),
      ...(entry.peerDependencies ?? {}),
      ...(entry.optionalDependencies ?? {}),
    };
    for (const [sibling, pinned] of Object.entries(declared)) {
      if (!sibling.startsWith(SCOPE)) continue;
      const shipped = workspace.get(sibling);
      rows.push({
        package: entry.name,
        publishedVersion: entry.version,
        sibling,
        pinned,
        shipped: shipped ?? null,
        status: shipped ? distance(pinned, shipped) : "unknown-sibling",
      });
    }
  }
  rows.sort((a, b) => a.package.localeCompare(b.package) || a.sibling.localeCompare(b.sibling));

  const serious = ["behind", "ahead", "unknown-sibling", "not-frozen"];
  const worst = rows.some((r) => serious.includes(r.status))
    ? 2
    : rows.some((r) => r.status === "patch-behind")
      ? 1
      : 0;
  return { rows, exitCode: worst };
}

const LABEL = {
  match: "ok",
  "not-frozen": "NOT AN EXACT PIN — a range or prerelease cannot be compared, and `workspace:*` should never produce one",
  "patch-behind": "a patch behind — record why that is fine",
  behind: "A MINOR OR MORE BEHIND — republish",
  ahead: "NEWER THAN THE WORKSPACE — the workspace is the one that is stale",
  "unknown-sibling": "names a package this workspace does not publish",
};

export function format({ rows, exitCode }) {
  const lines = rows.map(
    (r) =>
      `${r.status === "match" ? "✓" : "!"} ${r.package}@${r.publishedVersion} pins ` +
      `${r.sibling}@${r.pinned}, workspace ships ${r.shipped ?? "(nothing)"} — ${LABEL[r.status]}`,
  );
  if (!rows.length) lines.push("no published package pins a sibling");
  lines.push(
    exitCode === 0
      ? "every published pin names the version this workspace ships"
      : exitCode === 1
        ? "patch-level gaps only: decide package by package, and write the reason in the release notes"
        : "at least one published pin needs an answer before publishing — see the lines above",
  );
  return lines.join("\n");
}

async function fetchPublished(name) {
  const response = await fetch(`${REGISTRY}/${name.replace("/", "%2f")}/latest`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${name}: registry answered ${response.status}`);
  const { version, dependencies, peerDependencies, optionalDependencies } = await response.json();
  return { name, version, dependencies, peerDependencies, optionalDependencies };
}

async function main() {
  const repoRoot = resolve(import.meta.dirname, "../..");
  const workspace = workspaceVersions(repoRoot);

  const published = [];
  const unpublished = [];
  for (const name of workspace.keys()) {
    const entry = await fetchPublished(name);
    if (entry) published.push(entry);
    else unpublished.push(name);
  }

  const result = comparePins({ workspace, published });
  const asJson = process.argv.includes("--json");
  if (asJson) {
    console.log(JSON.stringify({ ...result, unpublished }, null, 2));
  } else {
    console.log(format(result));
    // Not a finding: a package whose first release has not happened cannot
    // have a stale pin. Said out loud so the list reads as complete.
    if (unpublished.length) console.log(`not on the registry yet: ${unpublished.join(", ")}`);
  }
  process.exitCode = result.exitCode;
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
