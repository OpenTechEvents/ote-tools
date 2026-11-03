import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { icsToEvents } from "./index.js";

export interface CliIO {
  out: (text: string) => void;
  err: (line: string) => void;
}

const USAGE =
  "Usage: ote-import-ics [--tz <IANA zone>] [--public] <calendar.ics|->\n" +
  "  -            read the calendar from stdin\n" +
  "  --tz <zone>  timezone for all-day events, which iCalendar cannot carry\n" +
  "               (default: the calendar's X-WR-TIMEZONE, else UTC)\n" +
  "  --public     this .ics is itself publicly published, so ORGANIZER's\n" +
  "               email may be imported. Omit it for anything shared by link,\n" +
  "               a company calendar or a private export.";

/**
 * Runs the CLI: reads an iCalendar document and writes the partial OTE events
 * it carried, as `{ events, warnings }` JSON on stdout. Returns the exit code:
 * 0 = at least one event · 1 = no VEVENT could be converted · 2 = usage or
 * I/O error.
 *
 * JSON, not a human summary, for the same reason as ote-import-jsonld: the
 * events are *partial* by design and the caller still has to complete them.
 * The warnings are the list of what to ask about — nothing else is missing.
 *
 * `--public` is opt-in and not a default, because the field it unlocks is
 * personal data: copying an email out of a calendar that was never published
 * is not translating a value, it is changing its level of exposure.
 */
export function runCli(
  argv: string[],
  io: CliIO = {
    out: (text) => console.log(text),
    err: (line) => console.error(line),
  },
  readStdin: () => string = () => readFileSync(0, "utf8"),
): number {
  const rest = [...argv];

  const publicIndex = rest.indexOf("--public");
  const isPublic = publicIndex !== -1;
  if (isPublic) rest.splice(publicIndex, 1);

  const tzIndex = rest.indexOf("--tz");
  let timezone: string | undefined;
  if (tzIndex !== -1) {
    timezone = rest[tzIndex + 1];
    if (!timezone || timezone.startsWith("-")) {
      io.err(USAGE);
      return 2;
    }
    rest.splice(tzIndex, 2);
  }

  const unknownFlag = rest.find((arg) => arg.startsWith("--"));
  const [input, ...extra] = rest;
  if (!input || extra.length > 0 || unknownFlag) {
    io.err(USAGE);
    return 2;
  }

  let ics: string;
  try {
    ics = input === "-" ? readStdin() : readFileSync(resolve(input), "utf8");
  } catch {
    io.err(`ote-import-ics: cannot read "${input}"`);
    return 2;
  }

  const result = icsToEvents(ics, {
    ...(timezone ? { allDayTimezonePolicy: timezone } : {}),
    ...(isPublic ? { sourceVisibility: "public" as const } : {}),
  });
  io.out(JSON.stringify(result, null, 2));
  return result.events.length > 0 ? 0 : 1;
}
