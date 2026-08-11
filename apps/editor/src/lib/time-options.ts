/**
 * Quarter-hour "HH:MM" options and filtering for the Time combobox
 * (ui/form.ts) — replaces the native `<input type="time">` picker, whose
 * minute step some browsers/OSes ignore entirely (confirmed on Android's
 * wheel picker). Pure so it's unit-testable, same split as timezones.ts.
 * The combobox itself still accepts any typed value, quarter-hour or not —
 * this only shapes the suggestion list.
 */

const HOURS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

export const QUARTER_HOUR_TIMES: readonly string[] = HOURS.flatMap((h) =>
  MINUTES.map((m) => `${h}:${m}`),
);

/**
 * Prefix match against "HH:MM", same idea as filterZones. A leading zero on
 * the hour is optional while typing ("9" still finds 09:00-09:45) — retried
 * only when the literal prefix comes up empty, so "1" still leads with the
 * 10-19 hours rather than 01:xx. An empty query returns the whole list —
 * the combobox's dropdown-on-focus mode.
 */
export function filterTimeOptions(query: string): string[] {
  const q = query.trim().replace(/\s+/g, "");
  if (q === "") return [...QUARTER_HOUR_TIMES];
  const prefix = QUARTER_HOUR_TIMES.filter((time) => time.startsWith(q));
  if (prefix.length > 0) return prefix;
  return QUARTER_HOUR_TIMES.filter((time) => time.replace(/^0/, "").startsWith(q));
}
