// Run with: node --test .github/scripts/published-pins.test.mjs
//
// No network: `comparePins` is handed the registry's answer, which is the
// whole reason it takes data instead of fetching. The cases are the real
// registry states this script was written for — the one that was a defect,
// and the ones that were deliberately left alone.

import assert from "node:assert/strict";
import { test } from "node:test";

import { comparePins, distance, format } from "./published-pins.mjs";

const workspace = new Map([
  ["@opentechevents/validate", "0.6.1"],
  ["@opentechevents/import-ics", "0.6.0"],
  ["@opentechevents/import-jsonld", "0.6.1"],
  ["@opentechevents/export-ics", "0.6.1"],
  ["@opentechevents/export-rss", "0.6.1"],
  ["@opentechevents/build-feed", "0.6.0"],
]);

test("distance names the gap in the terms a release decision needs", () => {
  assert.equal(distance("0.6.1", "0.6.1"), "match");
  assert.equal(distance("0.6.0", "0.6.1"), "patch-behind");
  assert.equal(distance("0.4.1", "0.6.0"), "behind");
  assert.equal(distance("0.5.0", "0.6.0"), "behind");
  assert.equal(distance("0.6.0", "1.0.0"), "behind");
  // The workspace being behind the registry is its own kind of wrong: it means
  // a version was published that this checkout cannot reproduce.
  assert.equal(distance("0.6.2", "0.6.1"), "ahead");
});

test("the defect this script exists for is a 2", () => {
  // import-jsonld@0.6.0 really shipped pinning import-ics@0.4.1.
  const { rows, exitCode } = comparePins({
    workspace,
    published: [
      {
        name: "@opentechevents/import-jsonld",
        version: "0.6.0",
        dependencies: { "@opentechevents/import-ics": "0.4.1" },
      },
    ],
  });
  assert.equal(exitCode, 2);
  assert.equal(rows[0].status, "behind");
  assert.match(format({ rows, exitCode }), /A MINOR OR MORE BEHIND/);
});

test("a patch-level lag is a 1: a decision, not a bug", () => {
  // build-feed@0.6.0 pins validate=0.6.0 while 0.6.1 is out, which was
  // checked and left: nothing it calls changed.
  const { rows, exitCode } = comparePins({
    workspace,
    published: [
      {
        name: "@opentechevents/build-feed",
        version: "0.6.0",
        dependencies: {
          "@opentechevents/validate": "0.6.0",
          "@opentechevents/export-ics": "0.6.0",
          "@opentechevents/export-rss": "0.6.0",
        },
      },
    ],
  });
  assert.equal(exitCode, 1);
  assert.deepEqual(new Set(rows.map((r) => r.status)), new Set(["patch-behind"]));
  assert.match(format({ rows, exitCode }), /write the reason in the release notes/);
});

test("everything matching is a 0", () => {
  const { exitCode } = comparePins({
    workspace,
    published: [
      {
        name: "@opentechevents/export-ics",
        version: "0.6.1",
        dependencies: { "@opentechevents/validate": "0.6.1" },
      },
    ],
  });
  assert.equal(exitCode, 0);
});

test("ignores foreign dependencies", () => {
  const { rows, exitCode } = comparePins({
    workspace,
    published: [
      {
        name: "@opentechevents/export-rss",
        version: "0.6.1",
        dependencies: { "@opentechevents/validate": "0.6.1", ical: "^3.0.0" },
      },
    ],
  });
  assert.equal(rows.length, 1, "a non-OTE dependency is not a sibling pin");
  assert.equal(exitCode, 0);
});

test("a pin that is not an exact version is its own finding, not a comparison", () => {
  // The premise is a frozen pin. A range resolves to whatever is newest, so
  // calling `^0.6.0` "a patch behind" would describe something untrue.
  for (const range of ["^0.6.0", "~0.6.0", ">=0.6.0 <0.7.0", "0.6", "", "*"]) {
    assert.equal(distance(range, "0.6.1"), "not-frozen", range);
  }
  const { rows, exitCode } = comparePins({
    workspace,
    published: [
      {
        name: "@opentechevents/export-rss",
        version: "0.6.1",
        dependencies: { "@opentechevents/validate": "^0.6.1" },
      },
    ],
  });
  assert.equal(rows[0].status, "not-frozen");
  assert.equal(exitCode, 2);
  assert.match(format({ rows, exitCode }), /NOT AN EXACT PIN/);
});

test("a prerelease pin is never reported as a match", () => {
  // The worst pin this script could meet, and the one the first version of
  // `parts()` called clean: parseInt("0-rc") is 0, so 0.7.0-rc.1 compared
  // equal to 0.7.0.
  assert.equal(distance("0.7.0-rc.1", "0.7.0"), "not-frozen");
  assert.equal(distance("0.6.1-next.0", "0.6.1"), "not-frozen");
});

test("reads peerDependencies and optionalDependencies too", () => {
  const { rows, exitCode } = comparePins({
    workspace,
    published: [
      {
        name: "@opentechevents/export-rss",
        version: "0.6.1",
        peerDependencies: { "@opentechevents/validate": "0.4.1" },
      },
      {
        name: "@opentechevents/export-ics",
        version: "0.6.1",
        optionalDependencies: { "@opentechevents/import-ics": "0.4.1" },
      },
    ],
  });
  assert.equal(rows.length, 2);
  assert.deepEqual(new Set(rows.map((r) => r.status)), new Set(["behind"]));
  assert.equal(exitCode, 2);
});

test("a package the workspace does not publish is not judged", () => {
  // The registry remembers things this repo may have stopped shipping; a
  // sweep must not turn that into a release blocker.
  const { rows, exitCode } = comparePins({
    workspace,
    published: [
      {
        name: "@opentechevents/retired",
        version: "0.1.0",
        dependencies: { "@opentechevents/validate": "0.1.0" },
      },
    ],
  });
  assert.deepEqual(rows, []);
  assert.equal(exitCode, 0);
});

test("a pin on a sibling this workspace no longer ships is reported, not skipped", () => {
  const { rows, exitCode } = comparePins({
    workspace,
    published: [
      {
        name: "@opentechevents/validate",
        version: "0.6.1",
        dependencies: { "@opentechevents/gone": "0.1.0" },
      },
    ],
  });
  assert.equal(rows[0].status, "unknown-sibling");
  assert.equal(exitCode, 2);
});

test("no sibling pins anywhere is a 0 and says so", () => {
  const result = comparePins({ workspace, published: [] });
  assert.equal(result.exitCode, 0);
  assert.match(format(result), /no published package pins a sibling/);
});
