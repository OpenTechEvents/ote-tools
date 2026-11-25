/**
 * The gate decides what can leave the editor and reach somebody's repository,
 * so the cases are asserted directly rather than through `main.ts`.
 *
 * The reason is specific (#159): this decision lived in two click handlers,
 * one of them got it wrong, and all 369 tests in this app passed with the bug
 * present — "Edit directly" prefilled GitHub's create-file page with an
 * invalid draft while "Propose" refused the same draft. A direct commit to
 * the default branch never runs `validate.yml`, so nothing downstream caught
 * it either.
 */

import { describe, expect, it } from "vitest";

import { carriesDraftJson, submitGate, type SubmitPath } from "../src/lib/submit-gate.js";

const PATHS: SubmitPath[] = ["propose", "commit-new", "edit-existing"];

const context = (over: Partial<Parameters<typeof submitGate>[1]> = {}) => ({
  hasRepo: true,
  draftValid: true,
  editSlug: "2026-03-12-biznagafest.json",
  ...over,
});

describe("submitGate", () => {
  describe("the #159 regression", () => {
    it("refuses to commit an invalid draft, and reveals why", () => {
      const decision = submitGate("commit-new", context({ draftValid: false }));
      expect(decision.action).toBe("reveal-invalid-draft");
    });

    it("still opens an existing file for editing while the draft is invalid", () => {
      // The narrowness is the point: this path opens a file that is already in
      // the repo and carries no draft JSON, so the draft's state is not a
      // reason to block it. The branch #159 was found on gated this too,
      // which would have blocked a legitimate edit.
      const decision = submitGate("edit-existing", context({ draftValid: false }));
      expect(decision.action).toBe("proceed");
    });

    it("commits a valid draft", () => {
      expect(submitGate("commit-new", context()).action).toBe("proceed");
    });
  });

  describe("the rule, over every path rather than a second copy of the list", () => {
    // Derived from `carriesDraftJson` so a fourth submit path has to answer
    // the question instead of defaulting to ungated — the shape of the
    // original bug.
    it.each(PATHS)("%s is gated on draft validity exactly when it carries the draft", (path) => {
      const decision = submitGate(path, context({ draftValid: false }));
      expect(decision.action === "reveal-invalid-draft").toBe(carriesDraftJson(path));
    });

    it("gates both of the paths that carry draft JSON", () => {
      // Guards the invariant itself: if `carriesDraftJson` ever returns false
      // for everything, the test above passes vacuously.
      expect(PATHS.filter(carriesDraftJson)).toEqual(["propose", "commit-new"]);
    });
  });

  describe("availability", () => {
    it("does nothing on the repo-only paths when no repo is connected", () => {
      expect(submitGate("commit-new", context({ hasRepo: false })).action).toBe("unavailable");
      expect(submitGate("edit-existing", context({ hasRepo: false })).action).toBe("unavailable");
    });

    it("proposes in standalone mode, where review means copy or download", () => {
      expect(submitGate("propose", context({ hasRepo: false })).action).toBe("proceed");
    });

    it("still reveals an invalid draft in standalone mode", () => {
      expect(submitGate("propose", context({ hasRepo: false, draftValid: false })).action).toBe(
        "reveal-invalid-draft",
      );
    });

    it("does nothing when the existing event's filename could not be determined", () => {
      expect(submitGate("edit-existing", context({ editSlug: null })).action).toBe("unavailable");
    });

    it("is unavailable rather than invalid when both apply", () => {
      // No repo and a bad draft: nothing to write to is the honest reason,
      // and revealing errors for a click that could never have written
      // anything would be a confusing answer.
      expect(submitGate("commit-new", context({ hasRepo: false, draftValid: false })).action).toBe(
        "unavailable",
      );
    });
  });
});
