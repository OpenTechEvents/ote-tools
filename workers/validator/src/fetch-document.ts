/**
 * The fetch itself: one URL in, bytes out, under every limit the endpoint
 * promises. Redirects are followed by hand so each hop goes back through the
 * SSRF checks, and the body is capped while it streams — `Content-Length` is
 * an assertion by the other side, not a fact.
 */

import { checkHost, checkUrl, type Rejection, type Resolver } from "./ssrf.js";
import type { TcpProbe } from "./tcp-probe.js";

export interface FetchLimits {
  /** Hard ceiling on the decoded body. Anything larger is refused, not truncated. */
  maxBytes: number;
  /** Redirect hops followed, each one revalidated. */
  maxRedirects: number;
  /** Ceiling for a single hop. */
  hopTimeoutMs: number;
  /** Ceiling for the whole chain, redirects included. */
  totalTimeoutMs: number;
  /**
   * Ceiling for *accepting a connection*, which is a different question from
   * answering it. Small on purpose, and the reason the 60 s above is
   * affordable at all.
   */
  connectTimeoutMs: number;
  /**
   * Attempts per hop. The extra one is for a transport flake or a 5xx — a
   * failure that arrived *fast* and may not happen twice. A timeout is never
   * retried: see `fetchDocument`.
   */
  maxAttempts: number;
  /** Pause before a retry, and the reason a retry needs budget left to be worth starting. */
  retryBackoffMs: number;
}

/**
 * 60 s, because that is the number the rest of the ecosystem already settled
 * on — the spec repo's daily health check and the adopter-registration bot
 * both fetch with 60 s and retries, after this exact false negative was
 * removed from each (spec PRs #43 and #46). At 5 s/10 s this endpoint called
 * a registered adopter's feed `unreachable` while the bot that links here
 * told the same publisher their feed was valid (#70). The measured feed
 * answers 200 with ~554 KB in 23.6–51 s, consistently; anything under 60 s
 * reopens the bug on a slower day.
 *
 * The hop and the chain carry the *same* budget on purpose. The normal case
 * is one hop, and it must get the whole 60 s; a redirect chain then cannot
 * multiply the wait, because each hop takes only what the chain has left.
 *
 * A long download deadline must not become a long *connect* deadline, and
 * `fetch` cannot tell the two apart: one `AbortSignal` covers the handshake,
 * the origin thinking and the bytes moving alike. Measured against the real
 * runtime, a live host with a filtered port spent the entire 60 s and came
 * back reading "slow" — a false negative of its own, and the mirror image of
 * the one this issue is about.
 *
 * So each hop is preceded by a TCP probe under `connectTimeoutMs`
 * (`tcp-probe.ts`): the adopter feed above accepts a connection in 0.1 s and
 * answers in 23.6 s, whereas nothing-is-listening is established in 8 s and
 * reported as `no-connection`. Only a host that proved something is listening
 * earns the long clock.
 */
export const DEFAULT_LIMITS: FetchLimits = {
  maxBytes: 5 * 1024 * 1024,
  maxRedirects: 3,
  hopTimeoutMs: 60_000,
  totalTimeoutMs: 60_000,
  connectTimeoutMs: 8_000,
  maxAttempts: 2,
  retryBackoffMs: 500,
};

export interface FetchDeps {
  fetchImpl: typeof fetch;
  resolve: Resolver;
  limits?: Partial<FetchLimits>;
  /**
   * The connect check. Absent means no preflight at all — which is how the
   * unit tests run, since `cloudflare:sockets` exists only in the Workers
   * runtime. `index.ts` wires the real one; a missing probe can only make
   * this slower, never wrong.
   */
  probe?: TcpProbe;
  /**
   * Absolute deadline (`Date.now()` + budget) shared by several calls. The
   * badge resolves a page and then the feed that page links to; without this
   * those are two independent budgets and one badge request can hold a
   * reader's connection for twice the advertised ceiling.
   */
  deadline?: number;
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
  /**
   * How the document was *served*, as opposed to what it says.
   *
   * The spec grew a "Serving the feed" section for a reason the adopter
   * numbers make plain: one registered feed is 553 KB uncompressed with no
   * cache validator and answers in 23.9 s, of which 23.6 s is the origin
   * thinking; another is 321 KB, brotli'd, with an `ETag`, in 276 ms. A
   * validator that only ever said "valid" had nothing to tell the first
   * publisher.
   */
  transport: Transport;
}

/** What the response said about how it was delivered. */
export interface Transport {
  /** `content-encoding`, or null when the body came down uncompressed. */
  encoding: string | null;
  /** Present means a conditional request can answer 304 instead of resending. */
  etag: string | null;
  lastModified: string | null;
  /** `cache-control`, verbatim — the UI decides what is worth saying. */
  cacheControl: string | null;
  /** `access-control-allow-origin`: whether a browser on another origin may read it. */
  accessControlAllowOrigin: string | null;
  /**
   * Milliseconds to the response headers, and to the last byte. The gap is
   * the interesting part: 23.6 s of a 23.9 s fetch was the origin thinking,
   * which is a different problem from a large document.
   */
  headersMs: number;
  totalMs: number;
}

/** Codes that describe a failed fetch rather than a refused URL. */
export type FetchRejectionCode =
  | "upstream-error"
  | "too-large"
  | "timeout"
  | "too-many-redirects"
  /** Nothing accepted a connection. Not "slow": there is nothing there to be slow. */
  | "no-connection";

export interface FetchFailure {
  ok: false;
  /** Status the endpoint answers with; the refusal reason is in `code`. */
  status: number;
  code: Rejection["code"] | FetchRejectionCode;
  message: string;
}

export type FetchResult = FetchedDocument | FetchFailure;

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

/** Seconds, without a trailing `.0` for the whole ones. */
const seconds = (ms: number): string => String(Number((ms / 1000).toFixed(1)));

function failure(
  code: Rejection["code"] | FetchRejectionCode,
  message: string,
  status = 400,
): FetchFailure {
  return { ok: false, status, code, message };
}

/**
 * The timeout message names the limit it hit, says what running out of clock
 * does and does not mean, and points at the two modes that do not depend on
 * this service at all.
 *
 * The wording matters as much as the number. A slow origin is the one failure
 * here that is nobody’s bug — not the URL’s, not this service’s — and
 * "unreachable" is the wrong word for "did not finish inside our budget": it
 * reads as *your feed is broken* to a publisher whose feed is valid and
 * merely slow to generate. So the message says **slow**, which is also the
 * word the badge uses for this code, and leaves a next step rather than a
 * verdict.
 */
function timedOut(limits: FetchLimits): FetchFailure {
  // Only worth naming both numbers when they differ; with one budget for hop
  // and chain alike, repeating it reads like two separate limits were hit.
  const budget =
    limits.hopTimeoutMs === limits.totalTimeoutMs
      ? `${seconds(limits.totalTimeoutMs)} s, redirects included`
      : `${seconds(limits.hopTimeoutMs)} s ` +
        `(${seconds(limits.totalTimeoutMs)} s for the whole chain, redirects included)`;
  return failure(
    "timeout",
    `That server did not answer within ${budget}. That makes this origin slow, ` +
      "not this feed invalid — the document may well be fine. " +
      "Download it and use “Upload a file” or “Paste JSON”: both validate it in " +
      "your browser, without this fetch step.",
    504,
  );
}

/**
 * Nothing accepted a connection. Worded apart from the timeout above because
 * it is a different diagnosis with a different next step: there, a document
 * exists and the origin is slow to produce it; here, nothing answered the
 * door, and downloading the feed by hand is not going to work either.
 */
function noConnection(limits: FetchLimits): FetchFailure {
  return failure(
    "no-connection",
    `Nothing accepted a connection at that address within ${seconds(limits.connectTimeoutMs)} s. ` +
      "The host may be down, or the port may be closed or firewalled. " +
      "Check the URL and whether the feed is reachable from outside its own network.",
    502,
  );
}

/** Where a probe should knock, when the URL leaves it implicit. */
function portOf(url: URL): number {
  if (url.port) return Number(url.port);
  return url.protocol === "https:" ? 443 : 80;
}

/**
 * Statuses worth one more attempt. 429 and 5xx are the server saying "not
 * now"; a 404 is it saying "not ever", and asking twice only doubles the load
 * on an origin that already answered.
 */
function worthRetrying(status: number): boolean {
  return status === 429 || status >= 500;
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

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

/** A hop that produced a response, with the clock reading when it started. */
interface HopResponse {
  ok: true;
  response: Response;
  startedAt: number;
}

/**
 * One hop, attempted up to `maxAttempts` times.
 *
 * The retry exists because the other two tools in the ecosystem have one, and
 * for the same reason: a reset connection or a 502 from a shared host is not
 * a verdict about the feed. It is deliberately *narrower* than theirs, because
 * they run unattended on a schedule while this endpoint has somebody watching
 * a spinner — **a timeout is never retried**. Having waited the full budget
 * once, waiting it again turns a 60 s answer into a 120 s one and still says
 * "slow" at the end. Retries are for failures that arrived fast.
 */
async function requestHop(
  url: URL,
  limits: FetchLimits,
  deadline: number,
  deps: FetchDeps,
  roomForRetry: () => boolean,
): Promise<HopResponse | FetchFailure> {
  // Once per hop, not once per attempt: a retry after a 5xx has already been
  // answered by something, so there is nothing left to establish.
  if (deps.probe) {
    const budget = Math.min(limits.connectTimeoutMs, deadline - Date.now());
    if (budget <= 0) return timedOut(limits);
    if ((await deps.probe(url.hostname, portOf(url), budget)) === "no-connection") {
      return noConnection(limits);
    }
  }

  for (let attempt = 1; ; attempt++) {
    const remaining = Math.min(limits.hopTimeoutMs, deadline - Date.now());
    if (remaining <= 0) return timedOut(limits);

    const startedAt = Date.now();
    let response: Response;
    try {
      response = await deps.fetchImpl(url.toString(), {
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
      if (error instanceof Error && error.name === "TimeoutError") return timedOut(limits);
      if (attempt < limits.maxAttempts && roomForRetry()) {
        await sleep(limits.retryBackoffMs);
        continue;
      }
      return failure("upstream-error", "That URL could not be fetched.", 502);
    }

    if (worthRetrying(response.status) && attempt < limits.maxAttempts && roomForRetry()) {
      // The body of a discarded answer is never read, so release it rather
      // than leaving a stream open for the rest of the invocation.
      await response.body?.cancel().catch(() => {});
      await sleep(limits.retryBackoffMs);
      continue;
    }

    return { ok: true, response, startedAt };
  }
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
  const deadline = deps.deadline ?? Date.now() + limits.totalTimeoutMs;
  const redirects: string[] = [];
  let current = rawUrl;

  /** Enough budget left that a second attempt can plausibly finish. */
  const roomForRetry = (): boolean => deadline - Date.now() > limits.retryBackoffMs + 1_000;

  for (let hop = 0; hop <= limits.maxRedirects; hop++) {
    const checked = checkUrl(current);
    if (!checked.ok) return { ok: false, status: 400, code: checked.code, message: checked.message };

    const host = await checkHost(checked.url, deps.resolve);
    if (!host.ok) return { ok: false, status: 400, code: host.code, message: host.message };

    const hopResult = await requestHop(checked.url, limits, deadline, deps, roomForRetry);
    if (!hopResult.ok) return hopResult;
    const { response, startedAt } = hopResult;

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

    // Read before the body is drained: `content-encoding` in particular is
    // gone from a response whose stream has been consumed by some runtimes.
    const headersMs = Date.now() - startedAt;
    const readTransport = (totalMs: number): Transport => ({
      encoding: response.headers.get("content-encoding"),
      etag: response.headers.get("etag"),
      lastModified: response.headers.get("last-modified"),
      cacheControl: response.headers.get("cache-control"),
      accessControlAllowOrigin: response.headers.get("access-control-allow-origin"),
      headersMs,
      totalMs,
    });

    if (!response.body) {
      return {
        ok: true,
        finalUrl: checked.url.toString(),
        status: response.status,
        contentType: response.headers.get("content-type"),
        body: "",
        bytes: 0,
        redirects,
        transport: readTransport(Date.now() - startedAt),
      };
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
      transport: readTransport(Date.now() - startedAt),
    };
  }

  return failure("too-many-redirects", `More than ${limits.maxRedirects} redirects.`, 400);
}
