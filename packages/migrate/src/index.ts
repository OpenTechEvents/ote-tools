// Moves an OTE document from the version it declares to a newer one.
//
// The honest summary of what this does to the JSON: it rewrites
// `specVersion`. Every published OTE release so far has been additive —
// 0.1→0.2→0.3→0.4 added optional fields, 0.5 added six more, and 0.6 changed
// no schema at all — so no valid document has ever needed a structural
// rewrite to move up. That is checked rather than assumed: `migrateDocument`
// validates the result against the target version before returning it.
//
// So why a package instead of `sed -i s/0.4.0/0.6.0/`? Because 0.5 carries
// D032, and D032 changes what pricing a document already contains *means*
// without changing whether it is valid. A `sed` produces a document that
// passes every check and quietly under-reports the cost of attending. The
// warnings below are the part that cannot be automated, and they are the
// reason this exists.

import {
  declaredSpecVersion,
  loadValidators,
  LATEST_VERSION,
  PUBLISHED_VERSIONS,
  type ValidationError,
} from "@opentechevents/validate";

/** Feed or event: the two document shapes the spec defines. */
export type DocumentKind = "feed" | "event";

/**
 * Something the migration could not decide on the publisher's behalf.
 *
 * Never a defect in the input and never a reason to stop: a warning means
 * the document is valid at the target version but may no longer mean what it
 * meant, and only the organizer knows which. `path` points into the document
 * so a CLI can say where to look.
 */
export interface MigrationWarning {
  /** Where in the document, in the same dotted style validation errors use. */
  path: string;
  /** What changed, and what the publisher has to decide. */
  message: string;
  /** The spec decision this comes from, for anyone who wants the prose. */
  decision: string;
}

export interface MigrateOptions {
  /** Feed or event. Inferred from the document's shape when omitted. */
  kind?: DocumentKind;
  /** Target version. Defaults to the newest published release. */
  to?: string;
}

export interface MigrationResult {
  kind: DocumentKind;
  /** The version the input declared. */
  from: string;
  /** The version the output declares. */
  to: string;
  /** False when the document already declared the target version. */
  changed: boolean;
  /** The migrated document. A new object; the input is never mutated. */
  document: unknown;
  /** Decisions left to the publisher. Never empty for nothing. */
  warnings: MigrationWarning[];
}

/** A migration that could not be attempted at all, with the reason. */
export class MigrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MigrationError";
  }
}

// `PUBLISHED_VERSIONS` is a `const` tuple, so its `includes` only accepts a
// member of that tuple — which is useless for checking a version that came
// out of somebody's document. Widened once, here.
const PUBLISHED: readonly string[] = PUBLISHED_VERSIONS;

/** `"0.4.0"` → `[0, 4, 0]`, for comparing releases rather than strings. */
function parts(version: string): number[] {
  return version.split(".").map((n) => Number.parseInt(n, 10));
}

/** True when `a` is strictly older than `b`. */
function isOlder(a: string, b: string): boolean {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i += 1) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) < (y[i] ?? 0);
  }
  return false;
}

/**
 * Feed or event, by shape.
 *
 * A feed is the one with `events`. Deliberately the only signal used: a
 * standalone event and a feed differ in several ways, but this is the one
 * the spec guarantees, and guessing from anything softer risks migrating a
 * document against the wrong schema.
 */
function inferKind(json: unknown): DocumentKind {
  const record = json as Record<string, unknown> | null;
  return record !== null && typeof record === "object" && Array.isArray(record.events)
    ? "feed"
    : "event";
}

/** Every event in the document, whichever shape it is. */
function eventsOf(document: Record<string, unknown>, kind: DocumentKind): Record<string, unknown>[] {
  if (kind === "event") return [document];
  const events = document.events;
  return Array.isArray(events) ? (events as Record<string, unknown>[]) : [];
}

/**
 * D032, the one change in OTE's history that a find-and-replace gets wrong.
 *
 * Before 0.5 a part of a multi-part event carried its own complete `offers`,
 * and that was the only way to price it — there was no way to say "this
 * costs 60 *on top of* the conference ticket". From 0.5 there is: the set's
 * shared admission goes in `partOf.offers`, and a surcharge is an offer with
 * `scope: "add-on"`.
 *
 * The trap is that the old document stays valid. An offer with no `scope` is
 * read as `admission` — "a complete way to attend this part" — so a workshop
 * that really costs 240 + 60 now publishes, validly and machine-readably,
 * that it costs 60. Nothing flags it, because nothing can: whether that 60
 * is the whole price or an extra is a fact about the event, not about the
 * JSON. Hence a warning aimed at a human, and no attempt to rewrite.
 *
 * Only parts of a multi-part set are worth asking about. A standalone event's
 * `offers` never had a shared admission to sit on top of, so its meaning is
 * unchanged and warning about it would be noise — and a warning that
 * misfires teaches people to stop reading warnings.
 */
function multipartPricingWarnings(
  document: Record<string, unknown>,
  kind: DocumentKind,
): MigrationWarning[] {
  const warnings: MigrationWarning[] = [];
  const events = eventsOf(document, kind);

  events.forEach((event, index) => {
    const partOf = event.partOf as Record<string, unknown> | undefined;
    const offers = event.offers;
    if (partOf === undefined || !Array.isArray(offers) || offers.length === 0) return;

    // Already answered: a document that says `scope` has been through this.
    const unscoped = (offers as Record<string, unknown>[]).filter(
      (offer) => offer !== null && typeof offer === "object" && offer.scope === undefined,
    );
    if (unscoped.length === 0) return;

    const where = kind === "feed" ? `events[${index}]` : "(document)";
    const name = typeof event.name === "string" ? ` ("${event.name}")` : "";
    warnings.push({
      path: `${where}.offers`,
      decision: "D032",
      message:
        `This event${name} is part of a multi-part set and carries its own offers. ` +
        `From 0.5 an offer without a "scope" is read as "admission" — a complete way to ` +
        `attend this part. If any of these prices is really a surcharge on top of the ` +
        `set's ticket, mark it "scope": "add-on" and put the shared admission in ` +
        `partOf.offers, or the feed will under-report what attending costs.`,
    });
  });

  // Several parts of one set repeating the same price is the other half of
  // D032: it is still valid, but `partOf.offers` is now where that belongs,
  // and `sharedOffersConsistent` keeps the copies honest from there on.
  const bySet = new Map<string, number>();
  for (const event of events) {
    const partOf = event.partOf as Record<string, unknown> | undefined;
    const id = partOf?.id;
    if (typeof id !== "string") continue;
    if (partOf?.offers !== undefined) continue;
    bySet.set(id, (bySet.get(id) ?? 0) + 1);
  }
  for (const [id, count] of bySet) {
    if (count < 2) continue;
    warnings.push({
      path: "events[].partOf.offers",
      decision: "D032",
      message:
        `${count} events share partOf.id "${id}" and none declares partOf.offers. ` +
        `From 0.5 the set's shared admission belongs there, written identically on every ` +
        `part — a consumer that needs the price of a multi-part event reads partOf.offers. ` +
        `Leaving it out is valid; it just means the set has no published price.`,
    });
  }

  return warnings;
}

/** The errors a document has against one specific version's schemas. */
async function errorsAgainst(
  json: unknown,
  kind: DocumentKind,
  version: string,
): Promise<ValidationError[]> {
  const validators = await loadValidators(version);
  const result = kind === "feed" ? validators.validateFeed(json) : validators.validateEvent(json);
  return result.errors;
}

/**
 * Migrates a document to a newer spec version.
 *
 * Validation happens against the declared version directly rather than
 * through `validateDocument`, and that is deliberate: `validateDocument`
 * applies the support policy, which calls an out-of-window version an error.
 * A document on an unsupported release is precisely the one that needs
 * migrating, and a migrator that refuses it would be useless to the only
 * people who have to run it.
 *
 * Throws `MigrationError` when the migration cannot be attempted — an
 * unplaceable version, a target that does not exist, a downgrade, or input
 * that is not valid at the version it claims. Migrating an invalid document
 * would produce an invalid one wearing a newer label.
 */
export async function migrateDocument(
  json: unknown,
  options: MigrateOptions = {},
): Promise<MigrationResult> {
  const kind = options.kind ?? inferKind(json);
  const to = options.to ?? LATEST_VERSION;
  const from = declaredSpecVersion(json);

  if (from === null) {
    throw new MigrationError(
      "This document declares no usable specVersion, so there is no version to migrate it " +
        `from. Published versions: ${PUBLISHED_VERSIONS.join(", ")}.`,
    );
  }
  if (!PUBLISHED.includes(from)) {
    throw new MigrationError(
      `This document declares OTE Spec ${from}, which was never published, so there are no ` +
        `rules to migrate it from. Published versions: ${PUBLISHED_VERSIONS.join(", ")}.`,
    );
  }
  if (!PUBLISHED.includes(to)) {
    throw new MigrationError(
      `OTE Spec ${to} is not a published version. Published versions: ` +
        `${PUBLISHED_VERSIONS.join(", ")}.`,
    );
  }
  if (isOlder(to, from)) {
    throw new MigrationError(
      `This document declares OTE Spec ${from}; ${to} is older. Migrating downwards would ` +
        "mean dropping fields the newer version added, and silently losing data a publisher " +
        "wrote on purpose is worse than refusing.",
    );
  }

  // Invalid in, invalid out — but now mislabelled, and a later reader has no
  // way to tell the damage was ours. The errors belong to the version the
  // document claims, so that is what they are measured against.
  const before = await errorsAgainst(json, kind, from);
  if (before.length > 0) {
    throw new MigrationError(
      `This document is not valid OTE ${from}, so it cannot be migrated — fix it first, ` +
        `then migrate. ${before.length} error${before.length === 1 ? "" : "s"}, starting with: ` +
        `${before[0]!.path}: ${before[0]!.message}`,
    );
  }

  const document = structuredClone(json) as Record<string, unknown>;
  const changed = from !== to;
  document.specVersion = to;

  // Only warn about a boundary this migration actually crosses. Going 0.5→0.6
  // cannot have changed what the pricing means, because 0.5 is where it
  // changed and the document is already there.
  const warnings =
    isOlder(from, "0.5.0") && !isOlder(to, "0.5.0")
      ? multipartPricingWarnings(document, kind)
      : [];

  // The claim this package makes is that the output is valid at the target.
  // Every release so far has been additive, so this has never yet failed —
  // which is exactly why it is checked rather than trusted. A future release
  // that breaks the pattern fails loudly here instead of shipping bad feeds.
  const after = await errorsAgainst(document, kind, to);
  if (after.length > 0) {
    throw new MigrationError(
      `Migrating from ${from} to ${to} produced a document that is not valid at ${to}: ` +
        `${after[0]!.path}: ${after[0]!.message}. This is a bug in @opentechevents/migrate — ` +
        "please report it rather than hand-editing around it.",
    );
  }

  return { kind, from, to, changed, document, warnings };
}
