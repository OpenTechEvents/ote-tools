/**
 * The validator's service: the static page and its fetch endpoint, on one
 * origin — and the only component of ote-tools with network access.
 *
 * The page itself is served by the runtime from the `assets` binding
 * (`wrangler.jsonc`); this script only sees what is not a file: `/fetch`,
 * `/badge` and `/health`. Sharing an origin is a design decision, not packaging
 * convenience: the page needs no CORS at all, and its CSP can say
 * `connect-src 'self'`.
 *
 * The fetch endpoint exists for exactly one reason: a browser cannot fetch a
 * third-party feed without CORS headers, and community feeds do not send
 * them. So the URL mode of the validator needs *something* server-side. This
 * is the smallest something that works: **given a URL, return the bytes**.
 *
 * No database, no accounts, no authentication, no persistence. That is a
 * design decision, not a shortcut — it deletes half of the OWASP Top 10 by
 * construction (no SQL injection without SQL, no broken access control with
 * nothing to access) and concentrates what is left in one place: SSRF, which
 * ssrf.ts is entirely about.
 *
 * The upload and paste modes of the validator do not come anywhere near this
 * Worker; they run fully in the browser and keep working with it down.
 */

import { badgeTtlSeconds, renderBadge, resolveBadge } from "./badge.js";
import { dohResolver } from "./dns.js";
import { DEFAULT_LIMITS, fetchDocument, type FetchResult } from "./fetch-document.js";

export interface Env {
  /**
   * Comma-separated origins allowed to call this endpoint from a browser.
   * Not a security boundary (curl ignores CORS) — it keeps other people's
   * pages from quietly using our fetch budget.
   */
  ALLOWED_ORIGINS?: string;
  /**
   * Optional Cloudflare rate-limiting binding, keyed by client IP. Absent in
   * tests and in `wrangler dev`; the endpoint works without it.
   */
  RATE_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

/**
 * Only origins that are NOT this Worker belong here: the page it serves is
 * same-origin, so it never triggers a CORS check in the first place.
 */
const DEFAULT_ALLOWED_ORIGINS = [
  "https://tools.opentechevents.org",
  "https://opentechevents.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
];

/**
 * Response headers that hold whether or not anything went wrong. The body of
 * a response from here is a JSON envelope carrying *someone else's document*
 * as a string, so it must never be sniffed into HTML and never be allowed to
 * load or run anything if a browser is pointed straight at this endpoint.
 */
const SAFETY_HEADERS: Record<string, string> = {
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'; sandbox",
  "referrer-policy": "no-referrer",
  "cache-control": "no-store",
};

function allowedOrigins(env: Env): string[] {
  const configured = env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean);
  return configured && configured.length > 0 ? configured : DEFAULT_ALLOWED_ORIGINS;
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins(env).includes(origin)) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "origin",
  };
}

function json(body: unknown, status: number, extra: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...SAFETY_HEADERS, ...extra },
  });
}

/** Shapes a fetch outcome into the envelope the validator consumes. */
export function toResponseBody(result: FetchResult): unknown {
  if (result.ok) {
    return {
      ok: true,
      finalUrl: result.finalUrl,
      status: result.status,
      contentType: result.contentType,
      bytes: result.bytes,
      redirects: result.redirects,
      body: result.body,
    };
  }
  return { ok: false, code: result.code, message: result.message };
}

/**
 * The subset of the Cache API this Worker uses. Structural on purpose: the
 * tests hand it a Map, and `caches.default` satisfies it as it is.
 */
export interface BadgeCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}

export interface Deps {
  fetchImpl: typeof fetch;
  resolve: (hostname: string) => Promise<string[]>;
  /** Absent in tests that do not care about caching, and in `wrangler dev`. */
  cache?: BadgeCache;
}

/** True when this caller has spent its per-IP budget. */
async function overLimit(request: Request, env: Env): Promise<boolean> {
  if (!env.RATE_LIMITER) return false;
  const key = request.headers.get("cf-connecting-ip") ?? "unknown";
  const { success } = await env.RATE_LIMITER.limit({ key });
  return !success;
}

/**
 * Cache key for a badge: the requested document, normalized, and nothing
 * else. Not the incoming request — that carries whatever query parameters,
 * `Origin` and headers a README's reader happened to send, and each variation
 * would otherwise buy its own upstream fetch.
 */
function badgeCacheKey(origin: string, target: string): Request {
  let normalized = target;
  try {
    normalized = new URL(target).toString();
  } catch {
    // Not a URL at all; `fetchDocument` will refuse it. Cache the refusal
    // under the raw string rather than throwing here.
  }
  return new Request(`${origin}/badge?doc=${encodeURIComponent(normalized)}`);
}

/**
 * `/badge?doc=…` — the verdict as an SVG for a README.
 *
 * This is the one path other people's pages request on their own schedule, so
 * every answer is cached, both here (the Cloudflare cache, shared across
 * readers) and downstream via `Cache-Control` (browsers, and GitHub's image
 * proxy). The freshness a badge promises is therefore "within the hour", which
 * is the honest thing for a status somebody else's CI changes.
 */
async function handleBadge(
  request: Request,
  url: URL,
  env: Env,
  deps: Deps,
  cors: Record<string, string>,
): Promise<Response> {
  const target = url.searchParams.get("doc");
  if (!target) {
    return json({ ok: false, code: "invalid-url", message: "Pass ?doc=…" }, 400, cors);
  }

  const key = badgeCacheKey(url.origin, target);
  const cached = await deps.cache?.match(key);
  if (cached) return cached;

  // Checked only on a cache miss: a cached badge costs no outbound request,
  // and a popular README must not exhaust the budget for everyone else.
  if (await overLimit(request, env)) {
    return json(
      { ok: false, code: "rate-limited", message: "Too many requests; try again shortly." },
      429,
      cors,
    );
  }

  const verdict = await resolveBadge(target, { fetchImpl: deps.fetchImpl, resolve: deps.resolve });
  const ttl = badgeTtlSeconds(verdict.state);
  const response = new Response(renderBadge(verdict.state), {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate=86400`,
      // The state as a header too: a fixed vocabulary, so it can be asserted
      // in tests and read by `curl` without parsing the image.
      "x-ote-badge-state": verdict.state,
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; frame-ancestors 'none'; sandbox",
      "referrer-policy": "no-referrer",
    },
  });
  await deps.cache?.put(key, response.clone());
  return response;
}

/**
 * Handles one request. Dependencies are parameters so the tests — including
 * the SSRF ones, which are the tests that matter here — run with a fake
 * network and a fake resolver instead of reaching anything real.
 */
export async function handleRequest(request: Request, env: Env, deps: Deps): Promise<Response> {
  const cors = corsHeaders(request, env);

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "GET") {
    return json({ ok: false, code: "method-not-allowed", message: "Use GET." }, 405, cors);
  }

  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return json({ ok: true, limits: DEFAULT_LIMITS }, 200, cors);
  }

  if (url.pathname === "/badge") return handleBadge(request, url, env, deps, cors);

  // "/" is the page, served from the assets binding before this script runs;
  // only the API paths reach here.
  if (url.pathname !== "/fetch") {
    return json({ ok: false, code: "not-found", message: "Unknown endpoint." }, 404, cors);
  }

  const target = url.searchParams.get("url");
  if (!target) {
    return json({ ok: false, code: "invalid-url", message: "Pass ?url=…" }, 400, cors);
  }

  if (await overLimit(request, env)) {
    return json(
      { ok: false, code: "rate-limited", message: "Too many requests; try again shortly." },
      429,
      cors,
    );
  }

  const result = await fetchDocument(target, { fetchImpl: deps.fetchImpl, resolve: deps.resolve });
  return json(toResponseBody(result), result.ok ? 200 : result.status, cors);
}

/**
 * The global `fetch`, wrapped rather than passed by reference.
 *
 * Handing `fetch` itself to something that later calls it as a plain value
 * detaches it from its receiver, and the Workers runtime rejects that with
 * "Illegal invocation: function called with incorrect `this` reference" — at
 * request time, on every outbound call. Node's fetch tolerates it, so no unit
 * test catches this; it only showed up against the deployed Worker. Keep the
 * wrapper.
 */
const boundFetch: typeof fetch = (input, init) => fetch(input, init);

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env, {
      fetchImpl: boundFetch,
      resolve: dohResolver(boundFetch),
      cache: caches.default,
    });
  },
};
