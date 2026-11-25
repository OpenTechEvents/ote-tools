/**
 * What each of the editor's submit paths is allowed to do, as a pure
 * function.
 *
 * Extracted from `main.ts` for the same reason `apps/publish` extracted
 * `feedGate`: the decision was spread across two click handlers, and one of
 * them got it wrong with every test in this app still passing (#159).
 * "Propose" ran `revealInvalidDraft()` first; "Edit directly" did not, so an
 * organizer with write access could commit an invalid event straight to their
 * fork — and a direct commit to the default branch never runs `validate.yml`,
 * which is what would otherwise have caught it.
 *
 * The rule is not "gate everything". It follows from what each path actually
 * hands GitHub:
 *
 *   - `propose` and `commit-new` carry **this draft's JSON** — a proposal
 *     issue body, or a prefilled create-file page. An invalid draft must not
 *     leave the editor through either, so both are gated on draft validity.
 *   - `edit-existing` opens a file that is already in the repo on github.dev.
 *     It carries no draft JSON, so gating it would block a legitimate edit
 *     for a reason that does not apply to it: the draft's state says nothing
 *     about the file being opened.
 *
 * `carriesDraftJson` is what the two groups are derived from rather than
 * listed twice, so a fourth path has to answer the question instead of
 * defaulting to ungated.
 */

declare const cleared: unique symbol;

/**
 * Proof that a draft passed the gate, required by every function that
 * prefills GitHub with the draft's own JSON (`directCreateUrl`).
 *
 * It exists because the unit tests below cannot cover the wiring: with the
 * gate removed from `main.ts`'s click handler and every rule in this file
 * intact, all 381 tests in this app still passed — measured, not assumed.
 * There is no DOM harness here (`main.ts` is a 3200-line side-effecting
 * script with no exports), so the type system is what is left. `submitGate`
 * is the only place that mints one, which makes removing the gate a compile
 * error rather than a silent regression.
 */
export type DraftClearance = { readonly [cleared]: true };

/** The ways a draft can leave the editor. */
export type SubmitPath = "propose" | "commit-new" | "edit-existing";

export type SubmitDecision =
  /**
   * Go ahead: open the review dialog, the create-file page, or the file.
   * `clearance` is what `directCreateUrl` demands — it travels with the
   * decision so the dangerous call cannot be reached another way.
   */
  | { action: "proceed"; clearance: DraftClearance }
  /** Reveal every error in the draft and stop. Never silently blocks. */
  | { action: "reveal-invalid-draft" }
  /** The path isn't available in this state; the click does nothing. */
  | { action: "unavailable" };

export interface SubmitContext {
  /** A target repository is connected (`?repo=`), rather than standalone. */
  hasRepo: boolean;
  /** The draft currently passes schema validation. */
  draftValid: boolean;
  /** Filename of the existing event being edited, if it could be determined. */
  editSlug: string | null;
}

/** True when the path hands GitHub the draft's own JSON. */
export function carriesDraftJson(path: SubmitPath): boolean {
  return path === "propose" || path === "commit-new";
}

export function submitGate(path: SubmitPath, context: SubmitContext): SubmitDecision {
  const { hasRepo, draftValid, editSlug } = context;

  // Both repo-only paths write to GitHub; without a repo there is nothing to
  // write to. `propose` is deliberately not in here — standalone mode reviews
  // the draft to copy or download it, which is the whole offline flow.
  if (path !== "propose" && !hasRepo) return { action: "unavailable" };

  // Opening an existing file needs to know which file. `main.ts` also keeps
  // the button disabled in this state; a disabled button can still be
  // clicked programmatically, so the decision does not rely on that.
  if (path === "edit-existing" && editSlug === null) return { action: "unavailable" };

  if (carriesDraftJson(path) && !draftValid) return { action: "reveal-invalid-draft" };

  // The single mint point. The cast is the price of a nominal type in
  // TypeScript and is deliberately confined to this line.
  return { action: "proceed", clearance: {} as DraftClearance };
}
