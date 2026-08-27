/**
 * DNS resolution over HTTPS.
 *
 * A Worker has no socket-level resolver API, so the only way to see the
 * addresses a hostname points at — before deciding whether to fetch it — is to
 * ask a resolver over HTTP. `checkHost` (ssrf.ts) judges the answer.
 */

const DOH_ENDPOINT = "https://cloudflare-dns.com/dns-query";
const RECORD_TYPES = ["A", "AAAA"] as const;

interface DohAnswer {
  Answer?: Array<{ type: number; data: string }>;
}

/** RR type numbers for A and AAAA — other answer records (CNAME) are ignored. */
const ADDRESS_RR_TYPES = new Set([1, 28]);

/**
 * Builds a resolver backed by DNS-over-HTTPS. `fetchImpl` is injected so
 * tests never leave the process.
 */
export function dohResolver(
  fetchImpl: typeof fetch,
  endpoint: string = DOH_ENDPOINT,
  timeoutMs = 3000,
): (hostname: string) => Promise<string[]> {
  return async (hostname: string) => {
    const lookups = RECORD_TYPES.map(async (type) => {
      const url = `${endpoint}?name=${encodeURIComponent(hostname)}&type=${type}`;
      const signal = AbortSignal.timeout(timeoutMs);
      const response = await fetchImpl(url, {
        headers: { accept: "application/dns-json" },
        signal,
      });
      if (!response.ok) return [];
      const body = (await response.json()) as DohAnswer;
      return (body.Answer ?? [])
        .filter((answer) => ADDRESS_RR_TYPES.has(answer.type))
        .map((answer) => answer.data.trim());
    });

    const results = await Promise.all(lookups);
    return [...new Set(results.flat())];
  };
}
