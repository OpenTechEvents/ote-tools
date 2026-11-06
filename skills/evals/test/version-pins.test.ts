/**
 * The guard that keeps `skills/` from going stale when the spec moves.
 *
 * A skill is prose, and prose carries version literals that nothing checks:
 * an `npx -p @opentechevents/import-jsonld@0.6` line, a pinned embed URL, a
 * `specVersion` in an example an agent will copy. Every one of those was
 * correct the day it was written and silently wrong a release later —
 * `references/website.md` sat two minors behind `SKILL.md` because the rule
 * that says "move the pin in the same change" lives in one file and the pins
 * live in another, and `fileIsValid` measured ground truth with the release
 * whose version bug this kit exists to have fixed.
 *
 * So the rule is not discipline, it is this test. Everything below is derived
 * at run time — from the workspace's own package versions and from
 * `@opentechevents/validate`'s support policy — so a spec release or a package
 * bump fails CI with the file, the line and the value to write, instead of
 * being noticed by whoever reads the skill next.
 *
 * Add a pin to a skill and you add nothing here: the scan finds it.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import { LATEST_VERSION, SUPPORTED_VERSIONS } from "@opentechevents/validate";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../../..");
const skillsDir = join(repoRoot, "skills");

/**
 * Frozen captures of real third-party pages and the eval fixtures' own
 * documents: both carry version strings that are *data*, not pins this repo
 * owns. `biznagafest.html` really does load a v1 embed bundle — rewriting that
 * would destroy the fixture. Fixture documents are checked separately, by role.
 *
 * There is no per-line ignore mechanism, deliberately: a marker that silences
 * this scan would be reached for on the day the scan is right. A comment that
 * needs to discuss an old pin spells it out in words instead ("the 0.4 line"),
 * which is also what a reader needs.
 */
const FIXTURES = join(skillsDir, "evals", "fixtures");

/** Files whose version literals this repo is responsible for. */
function proseFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (full === FIXTURES) continue;
    if (entry.isDirectory()) found.push(...proseFiles(full));
    else if (/\.(md|ts|json)$/.test(entry.name)) found.push(full);
  }
  return found.sort();
}

/** `name` → version, for every workspace package that a skill can pin. */
function workspaceVersions(): Map<string, string> {
  const versions = new Map<string, string>();
  for (const group of ["packages", "apps"]) {
    const base = join(repoRoot, group);
    if (!existsSync(base)) continue;
    for (const entry of readdirSync(base)) {
      const manifest = join(base, entry, "package.json");
      if (!existsSync(manifest)) continue;
      const { name, version } = JSON.parse(readFileSync(manifest, "utf8"));
      if (name && version) versions.set(name, version);
    }
  }
  return versions;
}

interface Hit {
  file: string;
  line: number;
  text: string;
}

/** Every match of `pattern` across the prose, with where to go and fix it. */
function scan(pattern: RegExp): Hit[] {
  const hits: Hit[] = [];
  for (const file of proseFiles(skillsDir)) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((text, index) => {
      for (const match of text.matchAll(pattern)) {
        hits.push({ file: relative(repoRoot, file), line: index + 1, text: match[0] });
      }
    });
  }
  return hits;
}

const at = (hit: Hit): string => `${hit.file}:${hit.line}`;

describe("npm pins in the skills", () => {
  const versions = workspaceVersions();

  it("name a version of every package that exists", () => {
    const unknown = scan(/@opentechevents\/[a-z-]+(?=@\d)/g).filter(
      (hit) => !versions.has(hit.text),
    );
    expect(
      unknown.map((hit) => `${at(hit)} pins ${hit.text}, which is not a workspace package`),
    ).toEqual([]);
  });

  /**
   * A skill may pin a minor (`@0.6`, which npm resolves to the newest patch)
   * or an exact version — both are honest. What it may not do is name a line
   * this repo no longer ships: an organizer running `@0.4` gets tools that
   * implement a spec the kit has moved past, and the skill's own instructions
   * stop matching their output.
   */
  it("match the version the workspace ships", () => {
    const stale = scan(/@opentechevents\/[a-z-]+@[\d.]+/g).flatMap((hit) => {
      const [name, pinned] = [hit.text.slice(0, hit.text.lastIndexOf("@")), hit.text.slice(hit.text.lastIndexOf("@") + 1)];
      const shipped = versions.get(name);
      if (!shipped) return [];
      const ok = shipped === pinned || shipped.startsWith(`${pinned}.`);
      return ok ? [] : [`${at(hit)} pins ${name}@${pinned}, workspace ships ${shipped}`];
    });
    expect(stale).toEqual([]);
  });
});

describe("the embed widget URL in the skills", () => {
  it("pins the shipped version, and a snapshot that is committed", () => {
    const shipped = workspaceVersions().get("@opentechevents/embed");
    expect(shipped, "apps/embed must declare a version").toBeTruthy();

    const problems = scan(/embed\/v[\d.]+/g).flatMap((hit) => {
      const pinned = hit.text.replace("embed/v", "");
      if (pinned !== shipped) {
        return [`${at(hit)} pins embed v${pinned}, workspace ships v${shipped}`];
      }
      // The skill tells organizers to pin a version in a live <script> tag,
      // so the snapshot behind it has to be a directory that was published,
      // not just a number in a manifest.
      const snapshot = join(repoRoot, "apps", "embed", "versions", `v${pinned}`);
      return existsSync(snapshot) && statSync(snapshot).isDirectory()
        ? []
        : [`${at(hit)} pins embed v${pinned}, but apps/embed/versions/v${pinned}/ is not committed`];
    });
    expect(problems).toEqual([]);
  });
});

describe("spec versions written into the skills", () => {
  /**
   * An example an agent copies must carry the current version. A document is
   * valid against the version it declares, so a stale example is not invalid
   * today — it is a fork minted two minors behind, which falls out of the
   * support window on a release nobody involved will be present for. That is
   * how an adopter ended up on 0.3.0 (see the root CLAUDE.md).
   */
  it("use the latest published version in the documents organizers are told to write", () => {
    const stale = scan(/"specVersion":\s*"[\d.]+"/g)
      .filter((hit) => hit.file.startsWith("skills/ote-event/"))
      .filter((hit) => !hit.text.includes(`"${LATEST_VERSION}"`))
      .map((hit) => `${at(hit)} writes ${hit.text}, latest is ${LATEST_VERSION}`);
    expect(stale).toEqual([]);
  });

  /**
   * Prose that names a spec version ages the same way, and is worse: a
   * sentence like "what v0.4 documents" is read as current by whoever reads
   * it. Say "the current release" and let the tool answer — `ote-validate
   * --versions` is in the skill for exactly this.
   */
  it("do not name a bare spec minor in prose", () => {
    const named = scan(/\bv0\.\d+\b/g)
      .filter((hit) => hit.file.endsWith(".md"))
      // The embed widget versions independently of the spec and is pinned on
      // purpose; it has its own check above.
      .filter((hit) => !/embed\/v[\d.]+/.test(readFileSync(join(repoRoot, hit.file), "utf8").split("\n")[hit.line - 1]))
      .map((hit) => `${at(hit)} names ${hit.text}; say "the current release" and cite --versions`);
    expect(named).toEqual([]);
  });
});

/**
 * What each fixture document is *for*, resolved against the support policy at
 * run time rather than written down as a number.
 *
 * This is the drift that is invisible until it matters: `corunajug-feed.json`
 * was stamped 0.3.0 to be the "older but supported release — a notice, never a
 * defect" case, and when 0.5.0 and 0.6.0 shipped the same day the window moved
 * past it. The fixture still parsed, the case still ran, and it had quietly
 * become a *migration* case testing nothing it claimed to.
 */
const FIXTURE_ROLES: Record<string, "latest" | "older-supported" | "none"> = {
  // What a document this kit writes today looks like.
  "biznagafest-feed.json": "latest",
  "repos/site-with-feed/events.json": "latest",
  // The healthy feed on last season's release. Must stay inside the window.
  "corunajug-feed.json": "older-supported",
  // A feed member: specVersion is inherited from the assembled feed, and
  // writing one here would make the fixture wrong about the spec.
  "repos/kit-fork-with-one-event/events/2026-11-07-biznagafest.json": "none",
};

describe("the eval fixtures' spec versions", () => {
  const oldestSupported = SUPPORTED_VERSIONS[0];

  for (const [file, role] of Object.entries(FIXTURE_ROLES)) {
    it(`${file} is ${role}`, () => {
      const declared = JSON.parse(readFileSync(join(FIXTURES, file), "utf8")).specVersion;

      if (role === "none") {
        expect(
          declared,
          `${file} is a feed member: it must inherit specVersion, not declare it`,
        ).toBeUndefined();
        return;
      }

      if (role === "latest") {
        expect(declared, `re-stamp ${file} to ${LATEST_VERSION}`).toBe(LATEST_VERSION);
        return;
      }

      // Older than the newest release, and still inside the window — the two
      // halves of what this fixture exists to represent. When a release moves
      // the window past it, this fails and the fix is to re-stamp it to the
      // oldest version that is still supported.
      expect(SUPPORTED_VERSIONS, `re-stamp ${file} to ${oldestSupported}`).toContain(declared);
      expect(declared, `${file} must not be the latest release`).not.toBe(LATEST_VERSION);
    });
  }
});
