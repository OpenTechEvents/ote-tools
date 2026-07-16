/**
 * Minimal iCalendar syntax layer (RFC 5545 §3.1–3.3): unfolding, content
 * lines, parameters and component nesting. No calendar semantics here —
 * mapping VEVENTs to OTE lives in index.ts.
 *
 * Deliberately lenient: real-world exports disagree on line endings and
 * casing, and a malformed line should degrade to "skipped", never to a
 * throw. Strictness belongs to the OTE validator downstream.
 */

export interface IcsProperty {
  /** Property name, uppercased (`DTSTART`). */
  name: string;
  /** Parameters, keys uppercased, values unquoted. Last duplicate wins. */
  params: Record<string, string>;
  /** Raw property value, still escaped. Unescape TEXT values with unescapeText. */
  value: string;
}

export interface IcsComponent {
  /** Component name, uppercased (`VCALENDAR`, `VEVENT`). */
  name: string;
  properties: IcsProperty[];
  components: IcsComponent[];
}

/** Undoes RFC 5545 folding. Tolerates LF-only files (Meetup serves them). */
export function unfold(text: string): string[] {
  const lines: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    if ((raw.startsWith(" ") || raw.startsWith("\t")) && lines.length > 0) {
      lines[lines.length - 1] += raw.slice(1);
    } else if (raw !== "") {
      lines.push(raw);
    }
  }
  return lines;
}

/** Unescapes an iCalendar TEXT value (RFC 5545 §3.3.11). */
export function unescapeText(value: string): string {
  return value.replace(/\\([\\;,nN])/g, (_, ch: string) =>
    ch === "n" || ch === "N" ? "\n" : ch,
  );
}

/** Splits a value on unescaped separators (CATEGORIES uses `,`). */
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

/**
 * Parses one unfolded content line. Scans characters because the `:` that
 * ends the name+params part may also appear inside quoted parameter values
 * (`TZID="America/Argentina/Buenos_Aires"`). Returns null on lines that are
 * not content lines at all.
 */
export function parseContentLine(line: string): IcsProperty | null {
  let inQuotes = false;
  let sep = -1;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ":" && !inQuotes) {
      sep = i;
      break;
    }
  }
  if (sep <= 0) return null;

  const value = line.slice(sep + 1);
  const nameAndParams = line.slice(0, sep);

  // Split name;param=val;param=val on unquoted semicolons.
  const segments: string[] = [];
  let current = "";
  inQuotes = false;
  for (const ch of nameAndParams) {
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (ch === ";" && !inQuotes) {
      segments.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  segments.push(current);

  const name = segments[0].trim().toUpperCase();
  if (!/^[A-Z0-9-]+$/.test(name)) return null;

  const params: Record<string, string> = {};
  for (const segment of segments.slice(1)) {
    const eq = segment.indexOf("=");
    if (eq <= 0) continue;
    const key = segment.slice(0, eq).trim().toUpperCase();
    let val = segment.slice(eq + 1).trim();
    if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
      val = val.slice(1, -1);
    }
    params[key] = val;
  }
  return { name, params, value };
}

/**
 * Parses a whole iCalendar stream into its top-level components. Content
 * outside any component and unparseable lines are dropped; an END without
 * its BEGIN closes nothing. Never throws.
 */
export function parseIcs(text: string): IcsComponent[] {
  const roots: IcsComponent[] = [];
  const stack: IcsComponent[] = [];
  for (const line of unfold(text)) {
    const prop = parseContentLine(line);
    if (prop === null) continue;
    if (prop.name === "BEGIN") {
      const component: IcsComponent = {
        name: prop.value.trim().toUpperCase(),
        properties: [],
        components: [],
      };
      const parent = stack[stack.length - 1];
      if (parent) parent.components.push(component);
      else roots.push(component);
      stack.push(component);
    } else if (prop.name === "END") {
      const name = prop.value.trim().toUpperCase();
      // Pop to the matching BEGIN; ignore an END that matches nothing.
      for (let at = stack.length - 1; at >= 0; at--) {
        if (stack[at].name === name) {
          stack.length = at;
          break;
        }
      }
    } else {
      const current = stack[stack.length - 1];
      if (current) current.properties.push(prop);
    }
  }
  return roots;
}
