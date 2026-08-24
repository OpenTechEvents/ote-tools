/**
 * Checks that every URL in the destination catalogue still answers.
 *
 * Deliberately a script and not a test: these are two dozen third-party hosts,
 * and a directory having a bad afternoon must not turn this repository's build
 * red. Run it when adding a destination, and every few months to catch the
 * ones that quietly moved their submission form — two of the URLs the spec's
 * own research recorded had already done exactly that.
 *
 * A 403 counts as reachable. Several of these sites refuse a plain scripted
 * request while being perfectly fine in a browser, which is a different
 * problem from being gone.
 *
 * Run with `pnpm check:links` — it needs Node's type stripping to read the
 * catalogue straight out of the TypeScript it lives in.
 */
import { DESTINATIONS } from "../src/lib/destinations.ts";

const AGENT = "Mozilla/5.0 (compatible; ote-tools link check)";
let bad = 0;

for (const destination of DESTINATIONS) {
  for (const url of [destination.homeUrl, destination.submitUrl].filter(Boolean)) {
    let status;
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": AGENT },
        signal: AbortSignal.timeout(15000),
      });
      status = String(response.status);
    } catch (error) {
      status = `failed (${error.name})`;
    }
    const ok = status === "200" || status === "403";
    if (!ok) bad += 1;
    console.log(`${ok ? "ok  " : "BAD "} ${status.padEnd(14)} ${destination.id.padEnd(22)} ${url}`);
  }
}

console.log(bad === 0 ? "\nEvery catalogue URL answers." : `\n${bad} URL(s) need looking at.`);
process.exit(bad === 0 ? 0 : 1);
