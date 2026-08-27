/**
 * The fetch itself: one URL in, bytes out, under every limit the endpoint
 * promises. Redirects are followed by hand so each hop goes back through the
 * SSRF checks, and the body is capped while it streams — `Content-Length` is
 * an assertion by the other side, not a fact.
 */

import { checkHost, checkUrl, type Rejection, type Resolver } from "./ssrf.js";

export interface FetchLimits {
  /** Hard ceiling on the decoded body. Anything larger is refused, not truncated. */
  maxBytes: number;
  /** Redirect hops followed, each one revalidated. */
  maxRedirects: number;
  /** Ceiling for a single hop. */
  hopTimeoutMs: number;
  /** Ceiling for the whole chain, redirects included. */
  totalTimeoutMs: number;
}

export const DEFAULT_LIMITS: FetchLimits = {
  maxBytes: 5 * 1024 * 1024,
  maxRedirects: 3,
  hopTimeoutMs: 5_000,
  totalTimeoutMs: 10_000,
};

export interface FetchDeps {
  fetchImpl: typeof fetch;
  resolve: Resolver;
  limits?: Partial<FetchLimits>;
}

export interface FetchedDocument {
  ok: true;
  /** The URL the bytes actually came from, after redirects. */
  finalUrl: string;
  status: number;
  contentType: string | null;
  /** Decoded as UTF-8. Never HTML-escaped here: the caller must not render it. */
  body: string;
  bytes: number;
  /** Hops followed, for the UI to show what it really fetched. */
  redirects: string[];
}

/** Codes that describe a failed fetch rather than a refused URL. */
export type FetchRejectionCode = "upstream-error" | "too-large" | "timeout" | "too-many-redirects";

export interface FetchFailure {
  ok: false;
  /** Status the endpoint answers with; the refusal reason is in `code`. */
  status: number;
  code: Rejection["code"] | FetchRejectionCode;
  message: string;
}

export type FetchResult = FetchedDocument | FetchFailure;

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function failure(
  code: Rejection["code"] | FetchRejectionCode,
  message: string,
  status = 400,
): FetchFailure {
  return { ok: false, status, code, message };
}

/**
 * Reads at most `maxBytes` from the stream, then stops and reports.
 *
 * Two things this buys, both of which reading `response.text()` would lose:
 * a 50 MB answer never lands in memory, and a compressed body that expands
 * past the cap is caught — the runtime decompresses transparently, so the
 * bytes counted here are the *decompressed* ones, which is exactly the number
 * a decompression bomb inflates.
 */
async function readCapped(
  body: ReadableStream<Uint8Array>,
  maxBytes: number,
): Promise<{ ok: true; text: string; bytes: number } | { ok: false }> {
  const reader = body.getReader();
  const decoder = new TextDecoder("utf-8");
  const chunks: string[] = [];
  let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        return { ok: false };
      }
      chunks.push(decoder.decode(value, { stream: true }));
    }
  } finally {
    reader.releaseLock();
  }
  chunks.push(decoder.decode());
  return { ok: true, text: chunks.join(""), bytes };
}

/**
 * Fetches a URL under the SSRF and resource rules.
 *
 * Every hop is checked before it is made: scheme, credentials, port, and the
 * *resolved addresses* of the hostname. Doing this per hop is the point — a
 * perfectly public URL that answers `302 → http://169.254.169.254/` defeats
 * any check that only ran on the URL the user typed.
 *
 * Known residual risk: a Worker cannot pin the connection to the IP it
 * validated (there is no socket-level API for it), so a resolver answer that
 * changes between the check and the connection — DNS rebinding — is not fully
 * excluded. What remains is bounded by the runtime: Cloudflare's egress is
 * the public internet, not a LAN with anything to reach on the other side.
 * The checks stay mandatory anyway; the runtime limits the blast radius of a
 * mistake, it does not replace the rules.
 */
export async function fetchDocument(rawUrl: string, deps: FetchDeps): Promise<FetchResult> {
  const limits = { ...DEFAULT_LIMITS, ...deps.limits };
  const deadline = Date.now() + limits.totalTimeoutMs;
  const redirects: string[] = [];
  let current = rawUrl;

  for (let hop = 0; hop <= limits.maxRedirects; hop++) {
    const checked = checkUrl(current);
    if (!checked.ok) return { ok: false, status: 400, code: checked.code, message: checked.message };

    const host = await checkHost(checked.url, deps.resolve);
    if (!host.ok) return { ok: false, status: 400, code: host.code, message: host.message };

    const remaining = Math.min(limits.hopTimeoutMs, deadline - Date.now());
    if (remaining <= 0) return failure("timeout", "The upstream server took too long.", 504);

    let response: Response;
    try {
      response = await deps.fetchImpl(checked.url.toString(), {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(remaining),
        // A fixed, honest, anonymous request: no cookies, no authorization,
        // nothing identifying whoever asked for this URL.
        headers: {
          accept:
            "application/ote+json, application/feed+json, application/json;q=0.9, text/html;q=0.8, */*;q=0.1",
          "user-agent": "OTE-Validator/0.1 (+https://tools.opentechevents.org/validator/)",
        },
      });
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "TimeoutError";
      return timedOut
        ? failure("timeout", "The upstream server took too long.", 504)
        : failure("upstream-error", "That URL could not be fetched.", 502);
    }

    if (REDIRECT_STATUSES.has(response.status)) {
      const location = response.headers.get("location");
      if (!location) return failure("upstream-error", "Redirect without a Location header.", 502);
      let next: string;
      try {
        next = new URL(location, checked.url).toString();
      } catch {
        return failure("upstream-error", "Redirect to a location that is not a URL.", 502);
      }
      redirects.push(next);
      current = next;
      continue;
    }

    if (response.status >= 400) {
      return failure(
        "upstream-error",
        `That URL answered ${response.status}.`,
        // Upstream's fault, not the caller's: report it as a bad gateway and
        // let the UI show the real status in the message.
        502,
      );
    }

    if (!response.body) {
      return { ok: true, finalUrl: checked.url.toString(), status: response.status, contentType: response.headers.get("content-type"), body: "", bytes: 0, redirects };
    }

    const read = await readCapped(response.body, limits.maxBytes);
    if (!read.ok) {
      return failure(
        "too-large",
        `That document is larger than the ${Math.round(limits.maxBytes / (1024 * 1024))} MB this endpoint fetches.`,
        413,
      );
    }

    return {
      ok: true,
      finalUrl: checked.url.toString(),
      status: response.status,
      contentType: response.headers.get("content-type"),
      body: read.text,
      bytes: read.bytes,
      redirects,
    };
  }

  return failure("too-many-redirects", `More than ${limits.maxRedirects} redirects.`, 400);
}
