import ICAL from "ical.js";

export interface IcsProperty {
  /** Property name, uppercased (`DTSTART`). */
  name: string;
  /** Parameters, keys uppercased. */
  params: Record<string, string>;
  /** First parsed value, normalized by ical.js. */
  value: string;
  /** All parsed values, for multi-value properties such as CATEGORIES. */
  values: string[];
}

export interface IcsComponent {
  /** Component name, uppercased (`VCALENDAR`, `VEVENT`). */
  name: string;
  properties: IcsProperty[];
  components: IcsComponent[];
}

type JCalProperty = [
  name: string,
  params: Record<string, string | string[]>,
  type: string,
  ...values: unknown[],
];

type JCalComponent = [
  name: string,
  properties: JCalProperty[],
  components: JCalComponent[],
];

/** Unescapes an iCalendar TEXT value. Parsed ical.js text passes through. */
export function unescapeText(value: string): string {
  return value.replace(/\\([\\;,nN])/g, (_, ch: string) =>
    ch === "n" || ch === "N" ? "\n" : ch,
  );
}

/** Splits a value on unescaped separators. Kept for connector compatibility. */
export function splitEscaped(value: string, separator: string): string[] {
  const parts: string[] = [];
  let current = "";
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "\\" && i + 1 < value.length) {
      current += ch + value[i + 1];
      i++;
    } else if (ch === separator) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts;
}

function normalizeValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).join(";");
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value ?? "");
}

function normalizeParams(
  params: Record<string, string | string[]>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    out[key.toUpperCase()] = Array.isArray(value) ? value[0] : value;
  }
  return out;
}

function toComponent(jcal: JCalComponent): IcsComponent {
  return {
    name: jcal[0].toUpperCase(),
    properties: jcal[1].map((property) => {
      const values = property.slice(3).map(normalizeValue);
      return {
        name: property[0].toUpperCase(),
        params: normalizeParams(property[1]),
        value: values[0] ?? "",
        values,
      };
    }),
    components: jcal[2].map(toComponent),
  };
}

function isJCalComponent(value: unknown): value is JCalComponent {
  return (
    Array.isArray(value) &&
    typeof value[0] === "string" &&
    Array.isArray(value[1]) &&
    Array.isArray(value[2])
  );
}

/**
 * Parses an iCalendar stream into top-level components using ical.js.
 *
 * The importer works with a deliberately small structural model so the rest
 * of the connector stays independent from parser-library object lifetimes.
 * Malformed input returns []: downstream import code turns that into a clear
 * warning, matching the previous connector behavior.
 */
export function parseIcs(text: string): IcsComponent[] {
  try {
    const parsed = ICAL.parse(text);
    const roots = Array.isArray(parsed) && isJCalComponent(parsed)
      ? [parsed]
      : Array.isArray(parsed)
        ? parsed.filter(isJCalComponent)
        : [];
    return roots.map(toComponent);
  } catch {
    return [];
  }
}
