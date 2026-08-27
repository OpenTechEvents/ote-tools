import { describe, expect, it } from "vitest";

import { checkHost, checkUrl, isBlockedIp, isIpLiteral, parseIpv6 } from "../src/ssrf.js";

const publicResolver = async () => ["93.184.216.34"];

describe("checkUrl", () => {
  it("allows plain http(s)", () => {
    expect(checkUrl("https://comunidad.example/feed.json").ok).toBe(true);
    expect(checkUrl("http://comunidad.example/feed.json").ok).toBe(true);
  });

  it("refuses every scheme but http(s)", () => {
    for (const url of [
      "file:///etc/passwd",
      "gopher://comunidad.example/",
      "ftp://comunidad.example/feed.json",
      "data:application/json,{}",
      "blob:https://comunidad.example/x",
    ]) {
      expect(checkUrl(url)).toMatchObject({ ok: false, code: "blocked-scheme" });
    }
  });

  it("refuses URLs carrying credentials instead of stripping them", () => {
    expect(checkUrl("https://user:pass@comunidad.example/feed.json")).toMatchObject({
      ok: false,
      code: "blocked-credentials",
    });
  });

  it("refuses non-HTTP ports that an HTTP client can still reach", () => {
    expect(checkUrl("http://comunidad.example:25/")).toMatchObject({ ok: false, code: "blocked-port" });
    expect(checkUrl("http://comunidad.example:6379/")).toMatchObject({ ok: false, code: "blocked-port" });
    expect(checkUrl("http://comunidad.example:8080/").ok).toBe(true);
  });

  it("refuses literal private and metadata addresses", () => {
    for (const url of [
      "http://127.0.0.1/",
      "http://169.254.169.254/latest/meta-data/",
      "http://10.0.0.5/",
      "http://192.168.1.1/",
      "http://172.16.9.9/",
      "http://[::1]/",
      "http://[fe80::1]/",
      "http://[fc00::1]/",
      "http://[::ffff:127.0.0.1]/",
    ]) {
      expect(checkUrl(url)).toMatchObject({ ok: false, code: "blocked-address" });
    }
  });

  it("refuses hostnames that resolve internally by convention", () => {
    expect(checkUrl("http://localhost:3000/")).toMatchObject({ ok: false, code: "blocked-address" });
    expect(checkUrl("http://metadata.google.internal/")).toMatchObject({
      ok: false,
      code: "blocked-address",
    });
  });

  it("is not fooled by octal, decimal or zero-padded spellings of 127.0.0.1", () => {
    // The WHATWG URL parser normalizes all of these to the dotted quad before
    // this code sees them, which is why the blocklist can work on that one
    // canonical form — and why parseIpv4 refuses the weird spellings outright
    // instead of trying to reimplement the normalization.
    for (const url of ["http://0177.0.0.1/", "http://2130706433/", "http://127.000.000.001/"]) {
      expect(checkUrl(url)).toMatchObject({ ok: false, code: "blocked-address" });
    }
    expect(isIpLiteral("0177.0.0.1")).toBe(false);
    expect(isBlockedIp("127.000.000.001")).toBe(false);
  });

  it("rejects what is not a URL at all", () => {
    expect(checkUrl("not a url")).toMatchObject({ ok: false, code: "invalid-url" });
  });
});

describe("parseIpv6", () => {
  it("expands compressed forms and IPv4-mapped tails", () => {
    expect(parseIpv6("::1")).toEqual([0, 0, 0, 0, 0, 0, 0, 1]);
    expect(parseIpv6("::ffff:169.254.169.254")).toEqual([0, 0, 0, 0, 0, 0xffff, 0xa9fe, 0xa9fe]);
    expect(parseIpv6("2001:db8::1")).toEqual([0x2001, 0xdb8, 0, 0, 0, 0, 0, 1]);
    expect(parseIpv6("nope")).toBeNull();
  });
});

describe("checkHost", () => {
  it("judges the resolved address, not the hostname", async () => {
    // The attacker owns their own DNS zone: a perfectly ordinary name with an
    // A record for 127.0.0.1 is the whole trick.
    const result = await checkHost(new URL("https://feed.attacker.example/"), async () => [
      "127.0.0.1",
    ]);
    expect(result).toMatchObject({ ok: false, code: "blocked-address" });
  });

  it("rejects a name where any answer is private, not just the first", async () => {
    const result = await checkHost(new URL("https://mixed.example/"), async () => [
      "93.184.216.34",
      "10.1.2.3",
    ]);
    expect(result).toMatchObject({ ok: false, code: "blocked-address" });
  });

  it("passes a public name through", async () => {
    expect(await checkHost(new URL("https://comunidad.example/"), publicResolver)).toEqual({
      ok: true,
      addresses: ["93.184.216.34"],
    });
  });

  it("reports resolution failures as such", async () => {
    const thrown = await checkHost(new URL("https://nope.example/"), async () => {
      throw new Error("SERVFAIL");
    });
    expect(thrown).toMatchObject({ ok: false, code: "dns-failure" });
    const empty = await checkHost(new URL("https://nope.example/"), async () => []);
    expect(empty).toMatchObject({ ok: false, code: "dns-failure" });
  });
});
