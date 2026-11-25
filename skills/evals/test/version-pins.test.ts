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

/**
 * The repo's prose, beyond `skills/`.
 *
 * The scan started inside `skills/` because that is where a version literal
 * is an instruction an organizer follows. The rule it enforces is wider than
 * that, and when it was written down in `CLAUDE.md` it arrived with about a
 * dozen counterexamples one `grep` away — seven package READMEs introducing
 * themselves with a spec minor two releases old, and `CONTRIBUTING.md`
 * describing a versioning scheme this repo had stopped using (#135). A rule
 * whose violations are one `grep` away teaches the next reader that it is
 * decorative.
 *
 * Two different surfaces, with deliberately different rules:
 *
 * - **What a reader copies** (`EXAMPLE_FILES`): a `specVersion` in an example
 *   must be the current release, everywhere, no exceptions. The live
 *   validator page shipped `"specVersion": "0.4.0"` in its placeholder — the
 *   one tool whose job is judging versions, handing out a stale one.
 * - **What a contributor reads first** (`CONTRIBUTOR_PROSE`): a bare spec
 *   minor is allowed only when the line carries a date. That is not a
 *   loophole, it is the third rung of the rule in `CLAUDE.md` — if a command
 *   cannot print it and a test cannot assert it, date it and name what would
 *   change it. A dated sentence is a fact about the past; the same sentence
 *   undated is a claim about the present that will quietly stop being true.
 *
 * Version *history* is excluded by file, not by line, and only where history
 * is the document's subject: changelogs, and the embed's released-versions
 * table. Everything else is in.
 */
const EXCLUDED = [
  "CHANGELOG.md",
  // The fixture *documents* carry versions as data — a 0.3.0 example is the
  // point of the file. Their README is prose and is scanned.
  "/fixtures/valid/",
  "/fixtures/invalid/",
  "/fixtures/versioned/",
  "/fixtures/repos/",
  "/node_modules/",
  "apps/embed/versions/",
  // The embed's own docs page is a version history: every past release, its
  // schema version and its script URL, by design.
  "apps/embed/index.html",
  "apps/embed/CLAUDE.md",
];

const isExcluded = (file: string): boolean => EXCLUDED.some((part) => file.includes(part));

/** Every `.md` and `.html` a reader might copy an example out of. */
function exampleFiles(): string[] {
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "dist") continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(md|html)$/.test(entry.name) && !isExcluded(full)) found.push(full);
    }
  };
  walk(repoRoot);
  return found.sort();
}

/**
 * The files a contributor reads before touching anything: the front door, the
 * contributing guide, and each package's and app's own introduction.
 */
function contributorProse(): string[] {
  const found = [join(repoRoot, "README.md"), join(repoRoot, "CONTRIBUTING.md")];

  // Every README under those trees, at any depth. The first version of this
  // collected `packages/*/README.md` only, which left
  // `packages/validate/fixtures/README.md` — the file #135's own item 4 was
  // about — guarded by nothing, so the one line that got fixed by hand had
  // nothing keeping it fixed. That is the failure the issue opens with.
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "dist") continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "README.md" && !isExcluded(full)) found.push(full);
    }
  };
  for (const group of ["packages", "apps"]) {
    const base = join(repoRoot, group);
    if (existsSync(base)) walk(base);
  }
  return found.filter((file) => existsSync(file)).sort();
}

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

/** A skill is `SKILL.md` plus whatever it tells the agent to read. */
function referenceFiles(skillDir: string): string[] {
  const base = join(skillDir, "references");
  if (!existsSync(base)) return [];
  return readdirSync(base)
    .filter((entry) => entry.endsWith(".md"))
    .map((entry) => join(base, entry))
    .sort();
}

/**
 * Workspace packages that are not published. They version independently —
 * `apps/embed` does so deliberately — so they cannot stand for the line a
 * skill was tested against.
 */
function privatePackages(): Set<string> {
  const names = new Set<string>();
  for (const group of ["packages", "apps"]) {
    const base = join(repoRoot, group);
    if (!existsSync(base)) continue;
    for (const entry of readdirSync(base)) {
      const manifest = join(base, entry, "package.json");
      if (!existsSync(manifest)) continue;
      const pkg = JSON.parse(readFileSync(manifest, "utf8"));
      if (pkg.name && pkg.private) names.add(pkg.name);
    }
  }
  return names;
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

/** Every match of `pattern` across a given set of files. */
function scanFiles(files: string[], pattern: RegExp): Hit[] {
  const hits: Hit[] = [];
  for (const file of files) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((text, index) => {
      for (const match of text.matchAll(pattern)) {
        hits.push({ file: relative(repoRoot, file), line: index + 1, text: match[0] });
      }
    });
  }
  return hits;
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

/**
 * The markdown block a hit sits in — lines up to the blank line on either
 * side.
 *
 * The date rule reads this rather than the single line, because prose wraps
 * and a statement is a paragraph, not a row of 80 columns. The first version
 * checked the line alone and demanded a date inside a link URL, which is how
 * a guard starts shaping sentences into something worse than what it found.
 * The cost is honest, and it is two things: a date anywhere in the paragraph
 * covers every version named in it, and the date is not required to be *about*
 * a version — "benchmarked on 2026-01 hardware" licenses the paragraph as
 * surely as "0.4 as of 2026-11" does.
 */
const sourceBlock = (hit: Hit): string => {
  const lines = readFileSync(join(repoRoot, hit.file), "utf8").split("\n");
  let start = hit.line - 1;
  let end = hit.line - 1;
  while (start > 0 && lines[start - 1]!.trim() !== "") start--;
  while (end < lines.length - 1 && lines[end + 1]!.trim() !== "") end++;
  return lines.slice(start, end + 1).join("\n");
};

/** The whole line a hit sits on, for deciding whether it is a command. */
const sourceLine = (hit: Hit): string =>
  readFileSync(join(repoRoot, hit.file), "utf8").split("\n")[hit.line - 1] ?? "";

/**
 * Whether this line tells someone to run something, as opposed to mentioning
 * a version in a sentence. An executable pin is an instruction an organizer
 * follows; a prose mention is a fact about when behaviour changed, and the two
 * must not be held to the same rule.
 */
const runsSomething = (line: string): boolean => /\b(?:npx|npm\s+(?:i|install|exec))\b/.test(line);

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
   *
   * **Only lines that run something are checked**, and this restriction is
   * the whole reason the test is usable. Prose mentions a version to state a
   * fact about the past — `SKILL.md` says the CLI judges by the declared
   * version "(since `@opentechevents/validate@0.6.0`)", which is true and
   * must not move. An earlier version of this scan matched every occurrence,
   * so the first patch release would have demanded that sentence be rewritten
   * to `@0.6.1` — turning a correct statement into a false one, with no
   * per-line ignore to escape through. A guard that can only be satisfied by
   * writing something untrue is worse than no guard.
   *
   * A minor pin needs no release-day edit at all: npm resolves `@0.6` to the
   * newest `0.6.x`, so publishing a patch reaches every already-copied skill
   * without touching a file. Which is also why the published minor matters
   * more than the patch — in this repo the minor names the spec version a
   * release implements (see the release note in `packages/validate`).
   */
  /**
   * The rule above has no per-line ignore, on purpose, so the line that
   * decides what it applies to is load-bearing and gets its own assertion.
   */
  it("tells a command from a sentence", () => {
    const commands = [
      "curl -sL url | npx -y -p @opentechevents/import-jsonld@0.6 ote-import-jsonld -",
      "npx -y -p @opentechevents/validate@0.6 ote-validate <file|dir>",
      "npm install @opentechevents/validate@0.6",
    ];
    const prose = [
      "declares (since `@opentechevents/validate@0.6.0`). A healthy feed on an older release",
      "the behaviour arrived in @opentechevents/validate@0.6.0 and has not changed since",
    ];
    for (const line of commands) expect(runsSomething(line), line).toBe(true);
    for (const line of prose) expect(runsSomething(line), line).toBe(false);
  });

  it("match the version the workspace ships", () => {
    const stale = scan(/@opentechevents\/[a-z-]+@[\d.]+/g)
      .filter((hit) => runsSomething(sourceLine(hit)))
      .flatMap((hit) => {
        const at_ = hit.text.lastIndexOf("@");
        const [name, pinned] = [hit.text.slice(0, at_), hit.text.slice(at_ + 1)];
        const shipped = versions.get(name);
        if (!shipped) return [];
        const ok = shipped === pinned || shipped.startsWith(`${pinned}.`);
        return ok ? [] : [`${at(hit)} pins ${name}@${pinned}, workspace ships ${shipped}`];
      });
    expect(stale).toEqual([]);
  });
});

describe("the skill's version handshake", () => {
  /**
   * The line a copied skill compares itself against, and where it has to live.
   *
   * The pins in the body are checked here, where the file is maintained — and
   * that check cannot reach the copy under somebody's
   * `.agents/skills/ote-event/`, which still says `@0.6` a year later. So the
   * skill names the line it was tested against and asks the installed CLI
   * (`--versions`) whether it is newer.
   *
   * **In the body, below the closing `---`.** The first draft put the number
   * only in the frontmatter, which is the one place it cannot work: an agent
   * is handed the body, and frontmatter is configuration its runtime reads
   * and does not pass on. The number was therefore invisible to the only
   * reader that needed it, and no test could have caught that by reading the
   * file from disk — which is exactly the vantage point the agent does not
   * have. So the assertion is specifically about the body.
   */
  const minorOf = (version: string) => version.split(".").slice(0, 2).join(".");

  const skillDir = join(skillsDir, "ote-event");
  const skillFile = join(skillDir, "SKILL.md");

  /** Everything after the frontmatter: what an agent actually receives. */
  const body = (file: string): string => {
    const text = readFileSync(file, "utf8");
    const match = text.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    return match ? match[1]! : text;
  };

  const testedLine = (file: string): string | undefined =>
    body(file).match(/tested against the `(\d+\.\d+)` tool line/)?.[1];

  /** The minor the packages this skill runs are released on. */
  function shippedMinor(): { minor?: string; problem?: string } {
    const versions = workspaceVersions();
    const published = privatePackages();
    const pinned = new Set(
      scanFiles([skillFile, ...referenceFiles(skillDir)], /@opentechevents\/[a-z-]+(?=@\d)/g)
        .filter((hit) => runsSomething(sourceLine(hit)))
        .map((hit) => hit.text)
        // A private package is versioned on its own terms — `apps/embed` ships
        // its own line on purpose — so it cannot decide this one.
        .filter((name) => versions.has(name) && !published.has(name)),
    );
    if (!pinned.size) return { problem: "the skill pins no publishable workspace package" };

    const minors = new Set([...pinned].map((name) => minorOf(versions.get(name)!)));
    if (minors.size > 1) {
      return {
        problem:
          `the packages this skill runs are on ${[...minors].join(" and ")} ` +
          `(${[...pinned].join(", ")}), so one line cannot name them: either hold the ` +
          `skill's pins until they converge, or pin it to the oldest line it was tested on`,
      };
    }
    return { minor: [...minors][0] };
  }

  it("names the tested line in the body, where an agent can read it", () => {
    const declared = testedLine(skillFile);
    expect(
      declared,
      "SKILL.md's body must say \"tested against the `<minor>` tool line\" — the frontmatter is not passed to the agent",
    ).toBeTruthy();

    const { minor, problem } = shippedMinor();
    expect(problem, problem).toBeUndefined();
    expect(declared, `re-stamp the tested line to ${minor}`).toBe(minor);
  });

  it("keeps the frontmatter copy, which is for tooling, in step with it", () => {
    const text = readFileSync(skillFile, "utf8");
    const inFrontmatter = text.slice(0, text.indexOf("\n---", 4)).match(/tested-with:\s*"?(\d+\.\d+)"?/)?.[1];
    if (!inFrontmatter) return; // optional: the body is the authority
    expect(inFrontmatter, "metadata.tested-with disagrees with the body").toBe(testedLine(skillFile));
  });

  it("names the same line the skill's own pins do", () => {
    const declared = testedLine(skillFile);
    const versions = workspaceVersions();
    const wrong = scanFiles([skillFile, ...referenceFiles(skillDir)], /@opentechevents\/[a-z-]+@[\d.]+/g)
      .filter((hit) => runsSomething(sourceLine(hit)))
      .flatMap((hit) => {
        const cut = hit.text.lastIndexOf("@");
        const [name, pin] = [hit.text.slice(0, cut), hit.text.slice(cut + 1)];
        if (!versions.has(name)) return [];
        return minorOf(pin) === declared
          ? []
          : [`${at(hit)} pins ${hit.text}, but this skill says it was tested against ${declared}`];
      });
    expect(wrong).toEqual([]);
  });

  it("spends the declaration instead of only recording it", () => {
    // #122's point: the skill asserted its pins as fact while telling the
    // agent to ask the tool about everything else. The number is worth
    // nothing unless the prose says what to do when the answer differs, so
    // that sentence is the assertion.
    expect(body(skillFile), "the handshake must say what to do when the CLI is newer").toMatch(
      /your CLI implements/i,
    );
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

describe("the rest of the repo's prose", () => {
  const LATEST_MINOR = LATEST_VERSION.split(".").slice(0, 2).join(".");

  /**
   * Same rule as the skills', same reason, wider blast radius: whatever a
   * reader copies has to be current. This one caught a live page — the
   * validator's own placeholder — so it is deliberately absolute.
   */
  it("writes the current spec version in every example a reader can copy", () => {
    const stale = scanFiles(exampleFiles(), /"specVersion":\s*"[\d.]+"/g)
      .filter((hit) => !hit.text.includes(`"${LATEST_VERSION}"`))
      .map((hit) => `${at(hit)} writes ${hit.text}, latest is ${LATEST_VERSION}`);
    expect(stale).toEqual([]);
  });

  /**
   * A bare spec minor in the files a contributor reads first is a claim about
   * the present. Undated, it expires with nothing to notice: seven package
   * READMEs introduced themselves as "(v0.4)" while the repo implemented two
   * minors past it, and `CONTRIBUTING.md` described a release scheme the repo
   * had replaced.
   *
   * A date in the paragraph is what makes it readable as history — `CLAUDE.md`'s
   * third rung, and the only escape there is. Be clear about how much that
   * buys: the rung is "date it **and** name what would change it", and this
   * checks the first half. `As of 2026-11, v0.4 is the current release` passes
   * and is a lie. What the date does is force the author to decide whether the
   * sentence is about the past, and leave the reader a way to tell a fact from
   * a fossil. There is no marker to silence the rule, on purpose: a sentence
   * that cannot be dated and cannot be derived is a sentence to delete.
   *
   * Only the `v0.X` spelling is matched, and that boundary is load-bearing in
   * the same way the npm rule's "lines that run something" is. A bare `0.5`
   * is usually *data*: `packages/migrate` exists to move documents between
   * spec minors and names them the way a function names its arguments, and
   * `apps/validator` documents what each release decided. `v0.4` is the
   * spelling that reads as "the spec version this is about", which is the
   * claim that expires.
   */
  it("dates every spec minor it names, or does not name one", () => {
    const undated = scanFiles(contributorProse(), /\bv0\.\d+\b/gi)
      .filter((hit) => !/\b20\d\d-\d\d\b/.test(sourceBlock(hit)))
      // The badge is a pin with its own rule below, derived rather than
      // banned.
      .filter((hit) => !/img\.shields\.io/.test(sourceLine(hit)))
      .map(
        (hit) =>
          `${at(hit)} names ${hit.text} with no date on the line; ` +
          `say "the current release" and cite \`ote-validate --versions\`, or date it`,
      );
    expect(undated).toEqual([]);
  });

  /**
   * The badge on the front page is a pin like any other, and the one most
   * people see. It is derived here rather than banned: a badge that names no
   * version says nothing.
   */
  it("keeps the front page's spec badge on the current minor", () => {
    const readme = readFileSync(join(repoRoot, "README.md"), "utf8");
    const badge = readme.match(/OTE%20spec-v([\d.]+)/);
    expect(badge, "README.md must carry an OTE spec badge").not.toBeNull();
    expect(badge![1], `re-point the spec badge at v${LATEST_MINOR}`).toBe(LATEST_MINOR);
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
