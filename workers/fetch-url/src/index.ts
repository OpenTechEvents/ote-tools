/**
 * `fetch-url` — the only component of ote-tools with network access.
 *
 * It exists for exactly one reason: a browser cannot fetch a third-party feed
 * without CORS headers, and community feeds do not send them. So the URL mode
 * of the validator needs *something* server-side. This is the smallest
 * something that works: **given a URL, return the bytes**.
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
 * Handles one request. Dependencies are parameters so the tests — including
 * the SSRF ones, which are the tests that matter here — run with a fake
 * network and a fake resolver instead of reaching anything real.
 */
export async function handleRequest(
  request: Request,
  env: Env,
  deps: { fetchImpl: typeof fetch; resolve: (hostname: string) => Promise<string[]> },
): Promise<Response> {
  const cors = corsHeaders(request, env);

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "GET") {
    return json({ ok: false, code: "method-not-allowed", message: "Use GET." }, 405, cors);
  }

  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return json({ ok: true, limits: DEFAULT_LIMITS }, 200, cors);
  }

  if (url.pathname !== "/" && url.pathname !== "/fetch") {
    return json({ ok: false, code: "not-found", message: "Unknown endpoint." }, 404, cors);
  }

  const target = url.searchParams.get("url");
  if (!target) {
    return json({ ok: false, code: "invalid-url", message: "Pass ?url=…" }, 400, cors);
  }

  if (env.RATE_LIMITER) {
    const key = request.headers.get("cf-connecting-ip") ?? "unknown";
    const { success } = await env.RATE_LIMITER.limit({ key });
    if (!success) {
      return json(
        { ok: false, code: "rate-limited", message: "Too many requests; try again shortly." },
        429,
        cors,
      );
    }
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
    });
  },
};
