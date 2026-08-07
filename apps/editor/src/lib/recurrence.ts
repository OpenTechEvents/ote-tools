/**
 * Pure calendar-date math for the inline "repeats" row list in the
 * "Cuándo" section. Nothing here knows about event shape, wall-clock
 * times, or DOM — main.ts combines each returned date with a series row's
 * own time via the existing toEventJson()/wallClock() (see
 * event-json.ts). OTE itself has no recurrence-rule concept (one document
 * per occurrence, always) — this is purely an editor-side convenience for
 * generating that batch of documents.
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // matches Date#getUTCDay()

/**
 * No "never"/open-ended variant — OTE has no recurrence concept at all
 * (one document per occurrence, always), so an "endless" series can only
 * ever mean "generate up to MAX_OCCURRENCES and stop"; offering it as a
 * distinct choice would imply a guarantee this can't make. `count` and
 * `date` are both already bounded by MAX_OCCURRENCES regardless.
 */
export type RecurrenceUntil = { type: "count"; count: number } | { type: "date"; date: string };

export type RecurrenceRule =
  | { frequency: "daily"; interval: number; from: string; until: RecurrenceUntil }
  | {
      frequency: "weekly";
      interval: number;
      weekdays: Weekday[];
      from: string;
      until: RecurrenceUntil;
    }
  | {
      frequency: "monthly";
      interval: number;
      weekday: Weekday;
      /** nth weekday of the month; -1 = last */
      ordinal: 1 | 2 | 3 | 4 | -1;
      from: string;
      until: RecurrenceUntil;
    }
  | { frequency: "yearly"; interval: number; from: string; until: RecurrenceUntil };

/**
 * Hard ceiling regardless of `until` — the OTE spec's own guidance for
 * expanding an otherwise-open series ("12 meses o las próximas 12
 * ocurrencias"), doubled for headroom on a weekly series with a far-out
 * until-date. Applies per series (a draft with several rows can exceed
 * this in total, just not any single one).
 */
export const MAX_OCCURRENCES = 24;

/** Safety bound on weeks scanned in the weekly branch, independent of
 * `interval`/`maxCount` — a pathological interval must degrade (fewer
 * results than requested) rather than hang. ~96 years, never hit by any
 * realistic input. */
const MAX_WEEKS_SCANNED = 5000;

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

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
 * For dropdown option labels: which occurrence-of-the-month `date`'s
 * weekday is within its month (1-4), and whether it's also the last —
 * lets the UI offer "on the last Friday" instead of "on the fourth
 * Friday" when they coincide. A 5th occurrence (rare, only some
 * weekday/month combinations) is definitionally always also the last, so
 * it's reported as `{ordinal: 4, isLast: true}` rather than exposing a
 * "5th" ordinal the UI has no use for.
 */
export function ordinalInMonth(date: string): { ordinal: 1 | 2 | 3 | 4; isLast: boolean } | null {
  const ms = parseIsoDate(date);
  if (ms === null) return null;
  const d = new Date(ms);
  const day = d.getUTCDate();
  const ordinal = Math.min(Math.ceil(day / 7), 4) as 1 | 2 | 3 | 4;
  const nextWeek = new Date(ms + 7 * DAY_MS);
  const isLast =
    nextWeek.getUTCMonth() !== d.getUTCMonth() || nextWeek.getUTCFullYear() !== d.getUTCFullYear();
  return { ordinal, isLast };
}

/**
 * `date` shifted by `days` (may be negative) — used to carry a recurring
 * event's own duration (e.g. a 2-day conference) onto every generated
 * occurrence: each one starts on its own computed date but keeps the same
 * start-to-end gap as the reference occurrence the organizer configured.
 * Returns "" for an unparseable `date`, same defensive convention as the
 * rest of this module.
 */
export function addDaysToDate(date: string, days: number): string {
  const ms = parseIsoDate(date);
  if (ms === null) return "";
  return toIso(ms + days * DAY_MS);
}

/**
 * Whole calendar days from `from` to `to` (negative if `to` is earlier).
 * `null` when either date is unparseable — the caller (the recurrence row
 * UI) treats that as "no duration set" rather than guessing.
 */
export function daysBetweenDates(from: string, to: string): number | null {
  const fromMs = parseIsoDate(from);
  const toMs = parseIsoDate(to);
  if (fromMs === null || toMs === null) return null;
  return Math.round((toMs - fromMs) / DAY_MS);
}

function expandDaily(
  fromMs: number,
  interval: number,
  maxCount: number,
  untilDateIso: string | null,
): string[] {
  const results: string[] = [];
  let cursor = fromMs;
  while (results.length < maxCount) {
    const iso = toIso(cursor);
    if (untilDateIso !== null && iso > untilDateIso) break;
    results.push(iso);
    cursor += interval * DAY_MS;
  }
  return results;
}

function expandWeekly(
  fromMs: number,
  interval: number,
  weekdays: readonly Weekday[],
  maxCount: number,
  untilDateIso: string | null,
): string[] {
  if (weekdays.length === 0) return [];
  const sortedWeekdays = [...new Set(weekdays)].sort((a, b) => a - b);
  // Monday-start week containing `from` — the reference `interval` counts
  // from, so "every 2 weeks on Mon/Wed/Fri" skips a whole week at a time,
  // not every other calendar day.
  const daysSinceMonday = (new Date(fromMs).getUTCDay() + 6) % 7;
  const weekStartMs = fromMs - daysSinceMonday * DAY_MS;

  const results: string[] = [];
  for (let weekIndex = 0; weekIndex < MAX_WEEKS_SCANNED && results.length < maxCount; weekIndex++) {
    if (weekIndex % interval !== 0) continue;
    for (const wd of sortedWeekdays) {
      const dayOffset = (wd + 6) % 7; // Monday-relative offset within the week
      const candidateMs = weekStartMs + weekIndex * 7 * DAY_MS + dayOffset * DAY_MS;
      if (candidateMs < fromMs) continue;
      const iso = toIso(candidateMs);
      if (untilDateIso !== null && iso > untilDateIso) return results;
      results.push(iso);
      if (results.length >= maxCount) break;
    }
  }
  return results;
}

function expandMonthly(
  fromMs: number,
  interval: number,
  weekday: Weekday,
  ordinal: 1 | 2 | 3 | 4 | -1,
  maxCount: number,
  untilDateIso: string | null,
): string[] {
  const results: string[] = [];
  const start = new Date(fromMs);
  let year = start.getUTCFullYear();
  let month = start.getUTCMonth();
  // Bounded generously above maxCount: a requested month may fall before
  // `from` and get skipped without producing a result, so this can't infer
  // "done" purely from iteration count.
  for (let guard = 0; guard < MAX_OCCURRENCES * 6 && results.length < maxCount; guard++) {
    const occ = nthWeekdayOfMonth(year, month, weekday, ordinal);
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

function expandYearly(
  fromMs: number,
  interval: number,
  maxCount: number,
  untilDateIso: string | null,
): string[] {
  const start = new Date(fromMs);
  const month = start.getUTCMonth();
  const day = start.getUTCDate();
  const results: string[] = [];
  let year = start.getUTCFullYear();
  for (let guard = 0; results.length < maxCount && guard < MAX_OCCURRENCES * 40; guard++) {
    const ms = Date.UTC(year, month, day);
    // Date.UTC normalizes an out-of-range day (Feb 29 on a non-leap year
    // rolls into March) — detect and skip that year rather than emit a
    // silently-wrong date.
    const normalized = new Date(ms);
    if (normalized.getUTCMonth() === month && normalized.getUTCDate() === day) {
      const iso = toIso(ms);
      if (untilDateIso !== null && iso > untilDateIso) break;
      results.push(iso);
    }
    year += interval;
  }
  return results;
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
  const interval = Math.floor(rule.interval);

  const untilDateIso = rule.until.type === "date" ? rule.until.date : null;
  if (untilDateIso !== null && parseIsoDate(untilDateIso) === null) return [];
  const maxCount =
    rule.until.type === "count"
      ? Math.min(Math.max(0, Math.floor(rule.until.count)), MAX_OCCURRENCES)
      : MAX_OCCURRENCES;
  if (maxCount === 0) return [];

  switch (rule.frequency) {
    case "daily":
      return expandDaily(fromMs, interval, maxCount, untilDateIso);
    case "weekly":
      return expandWeekly(fromMs, interval, rule.weekdays, maxCount, untilDateIso);
    case "monthly":
      return expandMonthly(fromMs, interval, rule.weekday, rule.ordinal, maxCount, untilDateIso);
    case "yearly":
      return expandYearly(fromMs, interval, maxCount, untilDateIso);
  }
}
