import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { htmlToEvents } from "./index.js";

export interface CliIO {
  out: (text: string) => void;
  err: (line: string) => void;
}

const USAGE =
  "Usage: ote-import-jsonld [--tz <IANA zone>] <page.html|->\n" +
  "  -            read the page's HTML from stdin\n" +
  "  --tz <zone>  timezone for all-day events, which schema.org cannot carry (default: UTC)";

/**
 * Runs the CLI: reads an event page's HTML and writes the partial OTE events
 * its JSON-LD carried, as `{ events, warnings }` JSON on stdout. Returns the
 * exit code: 0 = at least one event · 1 = the page carries no schema.org
 * Event · 2 = usage or I/O error.
 *
 * JSON, not a human summary, because the caller is a program (the editor, an
 * agent following the organizer skill) that still has to complete the events:
 * they are *partial* by design — no `id`, often no `timezone` — and the
 * warnings name, field by field, what the page could not supply. Printing a
 * verdict here would invite treating the output as finished.
 */
export function runCli(
  argv: string[],
  io: CliIO = {
    out: (text) => console.log(text),
    err: (line) => console.error(line),
  },
  readStdin: () => string = () => readFileSync(0, "utf8"),
): number {
  const tzIndex = argv.indexOf("--tz");
  let timezone: string | undefined;
  const rest = [...argv];
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

  let html: string;
  try {
    html = input === "-" ? readStdin() : readFileSync(resolve(input), "utf8");
  } catch {
    io.err(`ote-import-jsonld: cannot read "${input}"`);
    return 2;
  }

  const result = htmlToEvents(
    html,
    timezone ? { allDayTimezonePolicy: timezone } : {},
  );
  io.out(JSON.stringify(result, null, 2));
  return result.events.length > 0 ? 0 : 1;
}
