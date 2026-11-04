import { describe, expect, it } from "vitest";

import { transportFindings } from "../src/lib/transport.js";
import type { Transport } from "../src/lib/resolve.js";

/** A feed served the way the spec's "Serving the feed" section asks for. */
const good: Transport = {
  encoding: "br",
  etag: '"abc123"',
  lastModified: null,
  cacheControl: "public, max-age=300",
  accessControlAllowOrigin: "*",
  headersMs: 120,
  totalMs: 276,
};

const transport = (over: Partial<Transport>): Transport => ({ ...good, ...over });

describe("transportFindings", () => {
  it("says nothing about a feed served well", () => {
    expect(transportFindings(good, 321 * 1024)).toEqual([]);
  });

  it("flags an uncompressed feed, and sizes the advice to the feed", () => {
    // The two adopter measurements this exists for: 553 KB uncompressed is
    // worth a sentence, 4 KB uncompressed is not the same problem.
    const big = transportFindings(transport({ encoding: null }), 553 * 1024);
    expect(big[0]).toContain("553 KB");
    expect(big[0]).toContain("brotli");

    const small = transportFindings(transport({ encoding: null }), 4 * 1024);
    expect(small[0]).toContain("not to matter today");
  });

  it("flags a feed with no cache validator at all", () => {
    const findings = transportFindings(transport({ etag: null, lastModified: null }), 1024);
    expect(findings.join(" ")).toContain("304");
  });

  it("accepts Last-Modified in place of an ETag", () => {
    const findings = transportFindings(
      transport({ etag: null, lastModified: "Wed, 01 Jan 2026 00:00:00 GMT" }),
      1024,
    );
    expect(findings).toEqual([]);
  });

  it("separates a slow origin from a slow transfer", () => {
    // They are identical in a total and have different fixes: 23.6 s of a
    // 23.9 s fetch was the origin thinking, which compression cannot help.
    const slowOrigin = transportFindings(
      transport({ headersMs: 23_600, totalMs: 23_900 }),
      553 * 1024,
    );
    expect(slowOrigin.join(" ")).toContain("to start answering");
    expect(slowOrigin.join(" ")).not.toContain("Compression is usually the fix");

    const slowTransfer = transportFindings(transport({ headersMs: 200, totalMs: 9_000 }), 1024);
    expect(slowTransfer.join(" ")).toContain("Compression is usually the fix");
  });

  it("stays quiet about timing when the feed is quick", () => {
    expect(transportFindings(transport({ headersMs: 120, totalMs: 276 }), 1024)).toEqual([]);
  });

  it("flags a missing Access-Control-Allow-Origin, and says who it affects", () => {
    const findings = transportFindings(transport({ accessControlAllowOrigin: null }), 1024);
    // The honest part: this validator fetches through a server and is not
    // affected, so the finding must not imply the page itself was blocked.
    expect(findings.join(" ")).toContain("another origin");
    expect(findings.join(" ")).toContain("unaffected");
  });

  it("reports several problems at once rather than only the first", () => {
    const findings = transportFindings(
      transport({ encoding: null, etag: null, lastModified: null, accessControlAllowOrigin: null }),
      553 * 1024,
    );
    expect(findings.length).toBe(3);
  });

  it("copes with an unknown size", () => {
    expect(() => transportFindings(transport({ encoding: null }), undefined)).not.toThrow();
  });
});
