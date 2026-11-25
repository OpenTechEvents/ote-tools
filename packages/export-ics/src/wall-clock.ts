const formatters = new Map<string, Intl.DateTimeFormat>();
function formatterFor(zone: string): Intl.DateTimeFormat {
  const cached = formatters.get(zone);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat("en-GB-u-ca-iso8601-nu-latn", {
    timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  });
  if (formatters.size >= 128) formatters.delete(formatters.keys().next().value!);
  formatters.set(zone, formatter);
  return formatter;
}

/** Convert an IANA local wall clock to an RFC 5545 UTC DATE-TIME. */
export function wallClockToUtc(value: string, zone: string): string {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) throw new Error(`Invalid local date-time: ${value}`);
  const iso = `${match[1]}T${match[2]}:${match[3] ?? "00"}Z`;
  const wall = Date.parse(iso);
  if (!Number.isFinite(wall)) throw new Error(`Invalid local date-time: ${value}`);
  const formatter = formatterFor(zone);
  const localAt = (instant: number): number => {
    const parts = formatter.formatToParts(new Date(instant));
    const get = (type: string) => parts.find((part) => part.type === type)?.value;
    return Date.parse(`${get("year")?.padStart(4, "0")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}Z`);
  };
  // Sampling on both sides of the date captures the offsets around a DST
  // transition; it also handles non-hour changes and full-day jumps.
  const offsets = new Set([-172800000, -86400000, 0, 86400000, 172800000].map((delta) => {
    const sample = wall + delta;
    return localAt(sample) - sample;
  }));
  const candidates = [...offsets].map(offset => {
    const instant = wall - offset;
    return { instant, difference: localAt(instant) - wall };
  });
  // RFC 5545 chooses the first occurrence in a fold. In a gap it uses the
  // offset before the transition, which maps to the next valid wall time.
  const exact = candidates.filter(c => c.difference === 0).sort((a, b) => a.instant - b.instant)[0];
  const afterGap = candidates.filter(c => c.difference > 0).sort((a, b) => a.difference - b.difference || a.instant - b.instant)[0];
  const chosen = exact ?? afterGap;
  if (!chosen) throw new Error(`Cannot resolve ${value} in ${zone}`);
  return new Date(chosen.instant).toISOString().slice(0, 19).replace(/[-:]/g, "") + "Z";
}
