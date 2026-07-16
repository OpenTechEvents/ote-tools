import type { ListedEvent } from "./types.js";

export interface CollisionCheck {
  /** events/<slug>.json already exists in the repository. */
  slugTaken: boolean;
  /** Another event already uses this id. */
  idTaken: boolean;
}

/**
 * Checks a draft's slug and id against the repository's existing events.
 * Best-effort: the listing may be incomplete (rate-limited fallback) — a
 * clean result here is no guarantee, the fork's validation workflow is the
 * authority. `editingSlug` excludes the event being edited from the check
 * (its own slug/id are not collisions with itself).
 */
export function findCollisions(
  listed: readonly ListedEvent[],
  slug: string,
  id: string,
  editingSlug: string | null = null,
): CollisionCheck {
  let slugTaken = false;
  let idTaken = false;
  for (const entry of listed) {
    if (entry.slug !== null && entry.slug === editingSlug) continue;
    if (slug !== "" && entry.slug === slug) slugTaken = true;
    if (id !== "" && entry.event.id === id) idTaken = true;
  }
  return { slugTaken, idTaken };
}
