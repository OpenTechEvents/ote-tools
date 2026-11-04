import type { Transport } from "./resolve.js";

/**
 * How the feed was *served*, as findings a publisher can act on.
 *
 * Deliberately not a score. Each line names one thing and what it costs,
 * because the alternative — a number — invites tuning the number. The spec's
 * "Serving the feed" section is the source of the three that matter:
 * compression, a cache validator, and `Access-Control-Allow-Origin`.
 *
 * The adopter measurements are why this exists at all: 553 KB uncompressed
 * with no `ETag` answering in 23.9 s, against 321 KB brotli'd with an `ETag`
 * in 276 ms. The first publisher could have been told years before anyone
 * opened an issue.
 */
export function transportFindings(transport: Transport, bytes: number | undefined): string[] {
  const findings: string[] = [];
  const kb = bytes === undefined ? null : Math.round(bytes / 1024);

  if (transport.encoding === null) {
    findings.push(
      kb !== null && kb >= 64
        ? `Served uncompressed (${kb} KB). gzip or brotli typically cuts a JSON feed to a fifth, and costs the publisher one server setting.`
        : "Served uncompressed. Small enough not to matter today, and one server setting if the feed grows.",
    );
  }

  if (transport.etag === null && transport.lastModified === null) {
    findings.push(
      "No ETag and no Last-Modified, so a subscriber polling this feed downloads all of it every time. Either header lets a poll that finds nothing new cost a 304.",
    );
  }

  // The gap between headers and last byte separates a slow origin from a big
  // document: they look identical in a total, and have different fixes.
  if (transport.headersMs >= 2000) {
    findings.push(
      `The server took ${(transport.headersMs / 1000).toFixed(1)} s to start answering. That is the origin thinking, not the size of the document — a cached or statically-served feed answers immediately.`,
    );
  } else if (transport.totalMs >= 5000) {
    findings.push(
      `The whole fetch took ${(transport.totalMs / 1000).toFixed(1)} s, most of it transferring. Compression is usually the fix.`,
    );
  }

  if (transport.accessControlAllowOrigin === null) {
    findings.push(
      // No backticks: these strings become text nodes, not Markdown, so the
      // characters would be shown to the reader verbatim.
      'No Access-Control-Allow-Origin, so a page on another origin cannot read this feed from the browser. The spec asks for "*" — this validator reaches it through a server, so it is unaffected, and an embedded widget would not be.',
    );
  }

  return findings;
}
