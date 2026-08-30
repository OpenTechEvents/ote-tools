/**
 * Which spec version a document is measured against, and what to say about
 * the version it declares.
 *
 * Every OTE document declares a `specVersion`, and each version's
 * `feed.schema.json` pins that value with a `const`. So a document is not
 * "valid" or "invalid" on its own — it is valid *against a version*, and
 * checking it against any other one produces a single meaningless error about
 * `specVersion` and nothing else. Three tools in this ecosystem shipped that
 * bug (the daily health check, the adopter-registration bot, and this
 * validator), each one telling publishers with a perfectly good feed that it
 * was broken.
 *
 * The policy below is the spec repo's, mirrored here rather than reinvented:
 *
 *   - **The last three minors are supported.** Inside that window a document
 *     is validated against the version it declares and is *valid*. Being on
 *     an older-but-supported release is not a defect and never degrades the
 *     verdict — at most it earns a notice saying a newer release exists.
 *   - **Outside the window**, migration is required: an error, naming the
 *     version to move to, and linking the schemas of the declared version,
 *     which stay published forever.
 *   - **Missing, or a version never published**, is an error too, for a
 *     different reason: there are no rules to judge the document by. The
 *     message lists the versions that do exist.
 *
 * None of these messages blame the publisher. Running last season's release
 * is a legitimate choice; the messages say what a consumer needs in order to
 * use the feed, and stop there.
 */

import { LATEST_VERSION, PUBLISHED_VERSIONS } from "./generated/versions.js";

export { LATEST_VERSION, PUBLISHED_VERSIONS, VERSIONS_WITH_RECOMMENDED } from "./generated/versions.js";

/** How many minor releases stay supported, counting the newest. */
export const SUPPORT_WINDOW_MINORS = 3;

/** `0.3.0` → `0.3`; the window is counted in minors, not patches. */
function minorOf(version: string): string {
  const [major, minor] = version.split(".");
  return `${major}.${minor}`;
}

/**
 * The supported versions, oldest first: every published version belonging to
 * one of the last `SUPPORT_WINDOW_MINORS` minors.
 *
 * Computed rather than listed, so a spec release moves the window by itself.
 * Patches inside a supported minor are all supported — the window is about
 * how far back a *format* is honoured, and a patch does not change the
 * format.
 */
export const SUPPORTED_VERSIONS: readonly string[] = (() => {
  const minors = [...new Set(PUBLISHED_VERSIONS.map(minorOf))];
  const inWindow = new Set(minors.slice(-SUPPORT_WINDOW_MINORS));
  return PUBLISHED_VERSIONS.filter((version) => inWindow.has(minorOf(version)));
})();

/** A place worth sending the reader, kept apart from the sentence so a UI can make it a link. */
export interface SpecVersionLink {
  label: string;
  href: string;
}

/** Where each version's frozen schemas live, and where the changes are written down. */
export const SCHEMA_BASE_URL = "https://opentechevents.org/schema";
export const CHANGELOG_URL =
  "https://github.com/OpenTechEvents/opentechevents-spec/blob/main/CHANGELOG.md";

/** The published URL of one version's schema — the `$id` it carries. */
export function schemaUrl(version: string, kind: "feed" | "event"): string {
  return `${SCHEMA_BASE_URL}/v${minorOf(version)}/${kind}.schema.json`;
}

/** What the support policy says about the version a document declares. */
export type SpecVersionVerdict =
  /** The newest release. Nothing to say. */
  | { status: "current"; version: string }
  /** Supported, but not the newest: valid, with a notice. Never an error. */
  | { status: "outdated"; version: string }
  /** Published, but older than the support window: migrate. An error. */
  | { status: "out-of-window"; version: string }
  /** Absent, or a version that was never published: no rules to check against. */
  | { status: "unknown"; declared: string | null };

/**
 * The `specVersion` a document declares, or null when it declares none (or
 * something that is not a string — a number `0.4` is not a version).
 */
export function declaredSpecVersion(json: unknown): string | null {
  if (typeof json !== "object" || json === null) return null;
  const value = (json as Record<string, unknown>).specVersion;
  return typeof value === "string" ? value : null;
}

/** Applies the support policy to a declared version. */
export function classifySpecVersion(declared: string | null): SpecVersionVerdict {
  if (declared === null) return { status: "unknown", declared: null };
  if (!(PUBLISHED_VERSIONS as readonly string[]).includes(declared)) {
    return { status: "unknown", declared };
  }
  if (declared === LATEST_VERSION) return { status: "current", version: declared };
  return SUPPORTED_VERSIONS.includes(declared)
    ? { status: "outdated", version: declared }
    : { status: "out-of-window", version: declared };
}

/** True when documents of this version can still be checked as valid. */
export function isSupported(version: string): boolean {
  return SUPPORTED_VERSIONS.includes(version);
}

/**
 * The version whose schemas a document should be measured against: the one it
 * declares, when that version is published, and null when it is not — there
 * is nothing to fall back to, because the rules of a version this package
 * does not have are not the rules of any version it does.
 *
 * An out-of-window version still returns its own schemas: the migration
 * error is about the version, and hiding every other finding behind it would
 * make "migrate" the only thing a publisher on 0.1 ever hears.
 */
export function versionToCheck(verdict: SpecVersionVerdict): string | null {
  return verdict.status === "unknown" ? null : verdict.version;
}

const list = (versions: readonly string[]): string => versions.join(", ");

/**
 * One sentence about the declared version, for a UI to show next to the
 * verdict. Returns null when there is nothing worth saying (the document is
 * on the current release).
 *
 * `severity` is what the caller must do with it: `notice` never affects
 * validity, `error` does. Kept together with the text so the two cannot drift
 * — the whole bug this module exists for was a version note rendered as a
 * rejection.
 */
export function describeSpecVersion(
  verdict: SpecVersionVerdict,
): { severity: "notice" | "error"; message: string; links: SpecVersionLink[] } | null {
  const changelog = {
    label: `What changed in OTE Spec ${LATEST_VERSION}`,
    href: CHANGELOG_URL,
  };

  switch (verdict.status) {
    case "current":
      return null;

    case "outdated":
      return {
        severity: "notice",
        message:
          `This document declares OTE Spec ${verdict.version} and was checked against ` +
          `${verdict.version} — it is a supported release, and this notice does not affect ` +
          `the verdict. ${LATEST_VERSION} is the current one.`,
        links: [changelog],
      };

    case "out-of-window":
      return {
        severity: "error",
        message:
          `OTE Spec ${verdict.version} is outside the support window, which covers the last ` +
          `${SUPPORT_WINDOW_MINORS} releases (${list(SUPPORTED_VERSIONS)}). This document was ` +
          `still checked against its own ${verdict.version} schemas, so the findings below ` +
          `are real, but a consumer built for the supported window cannot read it: migrate ` +
          `to ${LATEST_VERSION}.`,
        links: [
          changelog,
          {
            label: `The ${verdict.version} schemas, still published`,
            href: schemaUrl(verdict.version, "feed"),
          },
        ],
      };

    case "unknown":
      return {
        severity: "error",
        message:
          verdict.declared === null
            ? `This document declares no specVersion, so there are no rules to check it ` +
              `against. Set it to one of the published versions: ${list(PUBLISHED_VERSIONS)} ` +
              `(${LATEST_VERSION} is the current one).`
            : `"${verdict.declared}" is not a published OTE Spec version, so there are no ` +
              `rules to check this document against. The published versions are ` +
              `${list(PUBLISHED_VERSIONS)} (${LATEST_VERSION} is the current one).`,
        links: [changelog],
      };
  }
}

/**
 * What to say when the version being checked against was chosen by hand
 * rather than read from the document — the "what would 0.4 break?" case,
 * which is a question a publisher planning a migration is entitled to ask
 * before committing to it.
 *
 * Returns null when the override agrees with the document, in which case
 * nothing was overridden in any meaningful sense.
 */
export function describeOverride(declared: string | null, checked: string): string | null {
  if (declared === checked) return null;
  const says =
    declared === null ? "declares no specVersion" : `declares OTE Spec ${declared}`;
  return (
    `Checked against OTE Spec ${checked} because you selected it. This document ${says}, ` +
    `so the findings below are what moving it to ${checked} would have to address — ` +
    `starting with specVersion itself. Switch back to automatic detection for the ` +
    `verdict on the document as it stands.`
  );
}
