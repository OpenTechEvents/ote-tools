/**
 * The SSRF boundary.
 *
 * This Worker is a public endpoint that fetches a URL a stranger chose. That
 * is, by default, a proxy into whatever the server can reach — so the rules
 * below are the point of the whole component, not a hardening pass bolted on
 * afterwards. Everything here is a pure function over a URL and a set of
 * resolved IPs, so each rule is a test case rather than a claim in a comment.
 */

/** Why a URL was refused. Codes are stable; messages are for humans. */
export type RejectionCode =
  | "invalid-url"
  | "blocked-scheme"
  | "blocked-credentials"
  | "blocked-port"
  | "blocked-address"
  | "dns-failure";

export interface Rejection {
  code: RejectionCode;
  message: string;
}

export type UrlCheck = { ok: true; url: URL } | { ok: false } & Rejection;

/** Only these two. `file:`, `gopher:`, `ftp:`, `data:` and the rest are refused. */
const ALLOWED_PROTOCOLS = ["http:", "https:"] as const;

/**
 * Ports that are not HTTP but are reachable by an HTTP client — the classic
 * SSRF pivot into SMTP, Redis, memcached… A feed lives on 80/443 or on a
 * development port; nothing legitimate needs port 25.
 */
const BLOCKED_PORTS = new Set([
  22, 23, 25, 465, 587, // ssh, telnet, smtp
  110, 143, 993, 995, // pop/imap
  445, 3306, 5432, 6379, 9200, 11211, 27017, // smb, databases, caches
]);

/** Parses a dotted-quad into its four octets, or null if it is not one. */
export function parseIpv4(host: string): [number, number, number, number] | null {
  const parts = host.split(".");
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const part of parts) {
    // Reject "01" and "0x7f": those forms are how a blocklist gets bypassed.
    if (!/^\d{1,3}$/.test(part)) return null;
    if (part.length > 1 && part.startsWith("0")) return null;
    const value = Number(part);
    if (value > 255) return null;
    octets.push(value);
  }
  return octets as [number, number, number, number];
}

/**
 * Blocks everything that is not a public unicast IPv4 address:
 * loopback (127/8), private (10/8, 172.16/12, 192.168/16), link-local
 * (169.254/16 — `169.254.169.254` is the cloud metadata endpoint and the
 * canonical SSRF target), CGNAT, benchmarking, multicast, reserved, 0/8 and
 * the broadcast address.
 */
export function isBlockedIpv4(host: string): boolean {
  const octets = parseIpv4(host);
  if (!octets) return false;
  const [a, b] = octets;
  if (a === 0) return true;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64/10
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 0) return true; // 192.0.0/24 + 192.0.2/24 (TEST-NET-1)
  if (a === 192 && b === 168) return true;
  if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking
  if (a === 198 && b === 51) return true; // TEST-NET-2
  if (a === 203 && b === 0) return true; // TEST-NET-3
  if (a >= 224) return true; // multicast, reserved, 255.255.255.255
  return false;
}

/** Expands an IPv6 address to its eight 16-bit groups, or null if malformed. */
export function parseIpv6(host: string): number[] | null {
  let text = host.trim().replace(/^\[|\]$/g, "");
  const zone = text.indexOf("%");
  if (zone !== -1) text = text.slice(0, zone);
  if (!/^[0-9a-fA-F:.]+$/.test(text)) return null;

  // An IPv4-mapped tail (::ffff:127.0.0.1) is rewritten into two groups so
  // the mapped address is checked as the IPv4 address it really is.
  const lastColon = text.lastIndexOf(":");
  const tail = text.slice(lastColon + 1);
  if (tail.includes(".")) {
    const octets = parseIpv4(tail);
    if (!octets) return null;
    const hi = ((octets[0] << 8) | octets[1]).toString(16);
    const lo = ((octets[2] << 8) | octets[3]).toString(16);
    text = `${text.slice(0, lastColon + 1)}${hi}:${lo}`;
  }

  const halves = text.split("::");
  if (halves.length > 2) return null;
  const parse = (part: string): number[] | null => {
    if (part === "") return [];
    const groups: number[] = [];
    for (const group of part.split(":")) {
      if (!/^[0-9a-fA-F]{1,4}$/.test(group)) return null;
      groups.push(parseInt(group, 16));
    }
    return groups;
  };
  const head = parse(halves[0]);
  const rest = halves.length === 2 ? parse(halves[1]) : [];
  if (!head || !rest) return null;
  if (halves.length === 2) {
    const fill = 8 - head.length - rest.length;
    if (fill < 0) return null;
    return [...head, ...Array<number>(fill).fill(0), ...rest];
  }
  return head.length === 8 ? head : null;
}

/**
 * Blocks loopback (`::1`), unspecified (`::`), unique-local (`fc00::/7`),
 * link-local (`fe80::/10`) and IPv4-mapped forms of anything IPv4 blocks —
 * `::ffff:169.254.169.254` reaches the same metadata service.
 */
export function isBlockedIpv6(host: string): boolean {
  const groups = parseIpv6(host);
  if (!groups) return false;
  const isZeroPrefix = groups.slice(0, 5).every((g) => g === 0);
  if (isZeroPrefix && groups[5] === 0xffff) {
    const mapped = [
      groups[6] >> 8,
      groups[6] & 0xff,
      groups[7] >> 8,
      groups[7] & 0xff,
    ].join(".");
    return isBlockedIpv4(mapped);
  }
  if (groups.every((g) => g === 0)) return true; // ::
  if (isZeroPrefix && groups[5] === 0 && groups[6] === 0 && groups[7] === 1) return true; // ::1
  const first = groups[0];
  if ((first & 0xfe00) === 0xfc00) return true; // fc00::/7
  if ((first & 0xffc0) === 0xfe80) return true; // fe80::/10
  if ((first & 0xff00) === 0xff00) return true; // ff00::/8 multicast
  return false;
}

/** True for any address this Worker must never connect to. */
export function isBlockedIp(address: string): boolean {
  return isBlockedIpv4(address) || isBlockedIpv6(address);
}

/** True when the host is a literal IP rather than a name to resolve. */
export function isIpLiteral(host: string): boolean {
  return parseIpv4(host) !== null || parseIpv6(host) !== null;
}

/**
 * Hostnames that resolve inside the network by convention rather than by DNS
 * record, and which therefore never appear in the resolver's answer.
 */
const BLOCKED_HOSTNAMES = new Set(["localhost", "metadata.google.internal"]);

/** Syntactic checks: scheme, credentials, port, obvious internal names. */
export function checkUrl(raw: string): UrlCheck {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, code: "invalid-url", message: "Not a URL." };
  }

  if (!(ALLOWED_PROTOCOLS as readonly string[]).includes(url.protocol)) {
    return {
      ok: false,
      code: "blocked-scheme",
      message: `Only http and https are fetched; "${url.protocol}" is not.`,
    };
  }

  // Credentials in the URL would be sent to the target as this fetch's
  // identity. Every fetch here is anonymous, so a URL that carries them is
  // refused rather than silently stripped.
  if (url.username || url.password) {
    return {
      ok: false,
      code: "blocked-credentials",
      message: "URLs with embedded credentials are not fetched.",
    };
  }

  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (BLOCKED_HOSTNAMES.has(host) || host.endsWith(".localhost") || host.endsWith(".internal")) {
    return { ok: false, code: "blocked-address", message: "That host is not publicly routable." };
  }

  if (url.port && BLOCKED_PORTS.has(Number(url.port))) {
    return { ok: false, code: "blocked-port", message: `Port ${url.port} is not fetched.` };
  }

  if (isIpLiteral(host) && isBlockedIp(host)) {
    return { ok: false, code: "blocked-address", message: "That address is not publicly routable." };
  }

  return { ok: true, url };
}

/** Resolves a hostname to IP addresses. Injected so tests need no network. */
export type Resolver = (hostname: string) => Promise<string[]>;

export type HostCheck = { ok: true; addresses: string[] } | { ok: false } & Rejection;

/**
 * The check that actually matters: **resolve first, then judge the resolved
 * addresses** — never the hostname. The attacker owns their DNS zone, so
 * `feed.attacker.example` can be an A record for `127.0.0.1`, and a
 * name-based allowlist would wave it through. Every returned address must be
 * public; one private answer rejects the whole name.
 */
export async function checkHost(url: URL, resolve: Resolver): Promise<HostCheck> {
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (isIpLiteral(host)) {
    return isBlockedIp(host)
      ? { ok: false, code: "blocked-address", message: "That address is not publicly routable." }
      : { ok: true, addresses: [host] };
  }

  let addresses: string[];
  try {
    addresses = await resolve(host);
  } catch {
    return { ok: false, code: "dns-failure", message: "That hostname could not be resolved." };
  }

  if (addresses.length === 0) {
    return { ok: false, code: "dns-failure", message: "That hostname resolves to no address." };
  }
  if (addresses.some((address) => isBlockedIp(address))) {
    return {
      ok: false,
      code: "blocked-address",
      message: "That hostname resolves to an address that is not publicly routable.",
    };
  }
  return { ok: true, addresses };
}
