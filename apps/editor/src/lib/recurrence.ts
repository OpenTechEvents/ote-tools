/**
 * Pure calendar-date math for the "repeat as a series" wizard. Nothing here
 * knows about event shape or wall-clock times — main.ts combines each
 * returned date with the current draft's time via the existing
 * toEventJson()/wallClock() (see event-json.ts). OTE itself has no
 * recurrence-rule concept (one document per occurrence, always) — this is
 * purely an editor-side convenience for generating that batch of documents.
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // matches Date#getUTCDay()

export interface RecurrenceRule {
  frequency: "weekly" | "monthly";
  /** Every N weeks (weekly) or N months (monthly). */
  interval: number;
  weekday: Weekday;
  /** monthly only: nth weekday of the month; -1 = last. */
  ordinal?: 1 | 2 | 3 | 4 | -1;
  /** YYYY-MM-DD — first candidate date; earlier occurrences are skipped. */
  from: string;
  until: { type: "count"; count: number } | { type: "date"; date: string };
}

/**
 * Hard ceiling regardless of `until` — the OTE spec's own guidance for
 * expanding an otherwise-open series ("12 meses o las próximas 12
 * ocurrencias"), doubled for headroom on weekly series with a far-out
 * until-date.
 */
export const MAX_OCCURRENCES = 24;

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseIsoDate(iso: string): number | null {
  const match = ISO_DATE_RE.exec(iso);
  if (!match) return null;
  const ms = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(ms) ? null : ms;
}

function toIso(ms: number): string {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const DAY_MS = 86_400_000;

/** First UTC-midnight timestamp on/after `fromMs` matching `weekday`. */
function firstWeekdayOnOrAfter(fromMs: number, weekday: Weekday): number {
  const delta = (weekday - new Date(fromMs).getUTCDay() + 7) % 7;
  return fromMs + delta * DAY_MS;
}

/** The nth (or last, ordinal === -1) `weekday` of the given UTC month (0-indexed, like Date). */
function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: Weekday,
  ordinal: 1 | 2 | 3 | 4 | -1,
): number {
  if (ordinal === -1) {
    const lastOfMonth = Date.UTC(year, month + 1, 0);
    const back = (new Date(lastOfMonth).getUTCDay() - weekday + 7) % 7;
    return lastOfMonth - back * DAY_MS;
  }
  const firstOfMonth = Date.UTC(year, month, 1);
  return firstWeekdayOnOrAfter(firstOfMonth, weekday) + (ordinal - 1) * 7 * DAY_MS;
}

/**
 * Rule -> ordered YYYY-MM-DD occurrence dates, capped at MAX_OCCURRENCES.
 * Malformed/nonsensical input (bad dates, interval < 1, count <= 0, an
 * until-date before `from`) degrades to `[]` rather than throwing — same
 * defensive convention as every other parser in lib/.
 */
export function expandRecurrenceDates(rule: RecurrenceRule): string[] {
  const fromMs = parseIsoDate(rule.from);
  if (fromMs === null || !Number.isFinite(rule.interval) || rule.interval < 1) {
    return [];
  }
  const untilDateIso = rule.until.type === "date" ? rule.until.date : null;
  if (untilDateIso !== null && parseIsoDate(untilDateIso) === null) return [];
  const maxCount =
    rule.until.type === "count"
      ? Math.min(Math.max(0, Math.floor(rule.until.count)), MAX_OCCURRENCES)
      : MAX_OCCURRENCES;
  if (maxCount === 0) return [];

  const results: string[] = [];
  const interval = Math.floor(rule.interval);

  if (rule.frequency === "weekly") {
    let cursor = firstWeekdayOnOrAfter(fromMs, rule.weekday);
    while (results.length < maxCount) {
      const iso = toIso(cursor);
      if (untilDateIso !== null && iso > untilDateIso) break;
      results.push(iso);
      cursor += 7 * interval * DAY_MS;
    }
    return results;
  }

  const ordinal = rule.ordinal ?? -1;
  const start = new Date(fromMs);
  let year = start.getUTCFullYear();
  let month = start.getUTCMonth();
  // Bounded generously above maxCount: a requested month may fall before
  // `from` and get skipped without producing a result, so this can't infer
  // "done" purely from iteration count the way the weekly branch does.
  for (let guard = 0; guard < MAX_OCCURRENCES * 6 && results.length < maxCount; guard++) {
    const occ = nthWeekdayOfMonth(year, month, rule.weekday, ordinal);
    if (occ >= fromMs) {
      const iso = toIso(occ);
      if (untilDateIso !== null && iso > untilDateIso) break;
      results.push(iso);
    }
    month += interval;
    while (month > 11) {
      month -= 12;
      year += 1;
    }
  }
  return results;
}
