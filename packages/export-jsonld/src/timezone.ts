/**
 * OTE stores a wall clock (`2026-06-11T18:30`) plus an IANA zone
 * (`Europe/Madrid`); schema.org wants ISO 8601, where the offset is the part
 * that pins the instant. Deriving `+02:00` from the zone and the date is a
 * lookup in the runtime's own tz database (`Intl`), not invented data — the
 * same wall clock in the same zone always yields the same offset.
 *
 * `Intl` is used rather than a tz dependency so this stays browser-safe:
 * Node 22 and every current browser ship a full tz database.
 */

const formatters = new Map<string, Intl.DateTimeFormat | null>();

/** A cached `longOffset` formatter for a zone, or null when it isn't valid. */
function formatterFor(timezone: string): Intl.DateTimeFormat | null {
  const cached = formatters.get(timezone);
  if (cached !== undefined) return cached;
  let formatter: Intl.DateTimeFormat | null;
  try {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "longOffset",
    });
  } catch {
    // Not an IANA zone this runtime knows. The caller falls back to emitting
    // the wall clock with no offset rather than guessing one.
    formatter = null;
  }
  formatters.set(timezone, formatter);
  return formatter;
}

/** Offset in minutes east of UTC for `timezone` at the given instant. */
function offsetMinutesAt(timezone: string, utcMs: number): number | undefined {
  const formatter = formatterFor(timezone);
  if (formatter === null) return undefined;
  const name = formatter
    .formatToParts(new Date(utcMs))
    .find((part) => part.type === "timeZoneName")?.value;
  if (name === undefined) return undefined;
  // "GMT" (exactly UTC), "GMT+2", "GMT+02:00", "GMT-05:30".
  const match = /^GMT(?:([+-])(\d{1,2})(?::(\d{2}))?)?$/.exec(name);
  if (match === null) return undefined;
  const [, sign, hours, minutes] = match;
  if (sign === undefined || hours === undefined) return 0;
  const total = Number(hours) * 60 + Number(minutes ?? 0);
  return sign === "-" ? -total : total;
}

function formatOffset(minutes: number): string {
  if (minutes === 0) return "Z";
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

const WALL_CLOCK_RE = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/;

/**
 * `2026-06-11T18:30` + `Europe/Madrid` → `2026-06-11T18:30+02:00`.
 *
 * Returns the wall clock unchanged when:
 *
 * - it is date-only (an all-day event) — schema.org takes a bare date there,
 *   and a day has no single offset to attach;
 * - the zone is not one the runtime knows;
 * - the value does not parse as an OTE wall clock.
 *
 * Seconds are never added: OTE's `dateTime` is deliberately seconds-less
 * ("the hour on a poster, never a technical instant") and ISO 8601 does not
 * require them.
 *
 * DST edge cases: the offset is resolved in two passes (interpret the wall
 * clock as UTC, look up the offset at that instant, then re-look-up at the
 * corrected instant). For the one ambiguous hour when clocks go back, this
 * picks a single deterministic answer rather than reporting ambiguity — the
 * wall clock itself, which is what the organizer published, is unaffected.
 */
export function wallClockWithOffset(wallClock: string, timezone: string): string {
  const match = WALL_CLOCK_RE.exec(wallClock);
  if (match === null) return wallClock;
  const [, year, month, day, hour, minute] = match;
  if (hour === undefined || minute === undefined) return wallClock;

  const guess = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  const first = offsetMinutesAt(timezone, guess);
  if (first === undefined) return wallClock;
  const corrected = offsetMinutesAt(timezone, guess - first * 60_000) ?? first;
  return `${wallClock}${formatOffset(corrected)}`;
}
