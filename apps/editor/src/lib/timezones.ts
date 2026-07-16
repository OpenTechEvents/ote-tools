/**
 * Filtering for the timezone combobox. Pure so it can be unit-tested; the
 * zone list itself comes from Intl in ui/form.ts.
 */

/**
 * Case-insensitive match with prefix hits ranked before substring hits, so
 * typing "eu" leads with Europe/*. Spaces count as underscores ("new york"
 * finds America/New_York). An empty query returns the whole list — that is
 * the combobox's dropdown mode.
 */
export function filterZones(
  zones: readonly string[],
  query: string,
): string[] {
  const q = query.trim().toLowerCase().replace(/ /g, "_");
  if (q === "") return [...zones];
  const prefix: string[] = [];
  const contains: string[] = [];
  for (const zone of zones) {
    const z = zone.toLowerCase();
    // A prefix match on the zone or on any of its /-separated segments
    // ("madrid" should lead with Europe/Madrid, not trail it).
    if (z.startsWith(q) || z.split("/").some((part) => part.startsWith(q))) {
      prefix.push(zone);
    } else if (z.includes(q)) {
      contains.push(zone);
    }
  }
  return [...prefix, ...contains];
}
