import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const fixturesDir = resolve(here, "../fixtures");
export const skillsDir = resolve(here, "../..");

export interface CaseSetup {
  /** URL → fixture file. Served to the agent from disk, never fetched. */
  fixtures?: Record<string, string>;
  /** Loose files to drop in the run directory: destination → fixture file. */
  files?: Record<string, string>;
  /** A fixture repo under fixtures/repos/ to start from. */
  repo?: string;
}

/**
 * Builds the throwaway directory a case runs in: the fixture repo (if any),
 * the loose files, the skill itself, and an offline fetch shim.
 *
 * Fixtures are files, never live URLs. A case pointed at the real
 * eventos.wiki would start failing the day that page changes, for a reason
 * that has nothing to do with the skill — and whoever hits it will spend the
 * afternoon looking in the wrong place.
 */
export function prepareRunDir(setup: CaseSetup): string {
  const dir = mkdtempSync(join(tmpdir(), "ote-eval-"));

  if (setup.repo) {
    const source = join(fixturesDir, "repos", setup.repo);
    if (!existsSync(source)) throw new Error(`no fixture repo "${setup.repo}" in fixtures/repos/`);
    cpSync(source, dir, { recursive: true });
  }

  for (const [destination, fixture] of Object.entries(setup.files ?? {})) {
    const target = join(dir, destination);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(join(fixturesDir, fixture), target);
  }

  // The skill under test, installed the way an organizer would install it.
  const skillTarget = join(dir, ".agents", "skills", "ote-event");
  mkdirSync(dirname(skillTarget), { recursive: true });
  cpSync(join(skillsDir, "ote-event"), skillTarget, { recursive: true });

  if (setup.fixtures) writeFetchShim(dir, setup.fixtures);
  return dir;
}

/**
 * `curl` and `fetch` in a run directory must resolve from fixtures, so the
 * eval is deterministic and offline. A shim on PATH is cruder than a proxy
 * and has the virtue of being visible in the transcript: whoever reads a
 * failed run sees exactly which URL was asked for.
 */
function writeFetchShim(dir: string, fixtures: Record<string, string>) {
  const binDir = join(dir, ".eval-bin");
  mkdirSync(binDir, { recursive: true });
  writeFileSync(join(binDir, "fixtures.json"), JSON.stringify(fixtures, null, 2));

  for (const [url, fixture] of Object.entries(fixtures)) {
    cpSync(join(fixturesDir, fixture), join(binDir, encodeURIComponent(url)));
  }

  const shim = `#!/usr/bin/env node
// Stands in for curl inside an eval run: serves frozen fixtures, refuses
// anything else loudly so a case can never silently depend on the network.
const { readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");
const binDir = __dirname;
const url = process.argv.slice(1).find((a) => /^https?:\\/\\//.test(a));
if (!url) { console.error("eval-curl: no URL in the arguments"); process.exit(2); }
const path = join(binDir, encodeURIComponent(url));
if (!existsSync(path)) {
  console.error("eval-curl: " + url + " is not a fixture of this case. The evals are offline on purpose.");
  process.exit(6);
}
process.stdout.write(readFileSync(path, "utf8"));
`;
  const curl = join(binDir, "curl");
  writeFileSync(curl, shim, { mode: 0o755 });

  const existing = existsSync(join(dir, "AGENTS.md")) ? readFileSync(join(dir, "AGENTS.md"), "utf8") : "";
  writeFileSync(
    join(dir, "AGENTS.md"),
    `${existing}\n## This environment\n\nThere is no network. \`${curl}\` serves this run's pages; use it in place of curl, and treat anything else as unreachable.\n`,
  );
}
