import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { htmlToEvents } from "./index.js";

export interface CliIO {
  out: (text: string) => void;
  err: (line: string) => void;
}

const USAGE =
  "Usage: ote-import-jsonld [--tz <IANA zone>] [--url <page url>] <page.html|->\n" +
  "  -            read the page's HTML from stdin\n" +
  "  --tz <zone>  timezone for all-day events, which schema.org cannot carry (default: UTC)\n" +
  "  --url <url>  the url the page came from, used for `url` when the JSON-LD has none.\n" +
  "               Defaults to the page's own <link rel=\"canonical\">, so this is only\n" +
  "               needed when the page has none or points somewhere else.";

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
  const rest = [...argv];
  const takeValue = (flag: string): string | undefined | null => {
    const index = rest.indexOf(flag);
    if (index === -1) return undefined;
    const value = rest[index + 1];
    if (!value || value.startsWith("-")) return null; // present but unusable
    rest.splice(index, 2);
    return value;
  };

  const timezone = takeValue("--tz");
  const pageUrl = takeValue("--url");
  if (timezone === null || pageUrl === null) {
    io.err(USAGE);
    return 2;
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

  const result = htmlToEvents(html, {
    ...(timezone ? { allDayTimezonePolicy: timezone } : {}),
    ...(pageUrl ? { pageUrl } : {}),
  });
  io.out(JSON.stringify(result, null, 2));
  return result.events.length > 0 ? 0 : 1;
}
