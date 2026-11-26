/**
 * The public adopters registry at `https://opentechevents.org/data/adopters.json`,
 * validated before use (#185).
 *
 * **Pure and dependency-free on purpose.** `workers/convert` serves its
 * landing-page script as a classic `<script src="/adopters.js">` built from a
 * template string, so it cannot import anything at runtime — it embeds this
 * function's *source text* instead. That only works while the function closes
 * over nothing, so keep it that way: no imports, no module-level constants, no
 * helpers.
 *
 * Validating the shape is the point rather than ceremony. `adopters.json` has
 * been parsed without a shape check once already, and the result was a
 * measurement quoted to the spec repo that covered 4 of 7 registered feeds.
 */

export interface Adopter {
  readonly name: string;
  readonly feed: string;
}

export function parseAdopterRegistry(registry: unknown): Adopter[] {
  const list = (registry as { adopters?: unknown })?.adopters;
  if (!Array.isArray(list)) return [];

  const adopters: Adopter[] = [];
  for (const entry of list) {
    if (!entry || typeof entry.name !== "string" || typeof entry.feed !== "string") continue;
    let feed: URL;
    try {
      feed = new URL(entry.feed);
    } catch {
      continue;
    }
    // Credentials in a demo URL would be echoed into the snippet a visitor
    // copies, and a non-http scheme is not something either page can fetch.
    if (feed.protocol !== "https:" && feed.protocol !== "http:") continue;
    if (feed.username || feed.password) continue;
    adopters.push({ name: entry.name, feed: entry.feed });
  }
  return adopters;
}
