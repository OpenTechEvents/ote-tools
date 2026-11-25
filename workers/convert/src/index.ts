import { feedToIcs, type OteFeed as IcsFeed } from "@opentechevents/export-ics";
import { feedToRss, type OteFeed as RssFeed } from "@opentechevents/export-rss";
import { eventToJsonLd, feedToJsonLd, toJsonLdScript, type OteEvent, type OteFeed } from "@opentechevents/export-jsonld";
import { loadValidators, PUBLISHED_VERSIONS } from "@opentechevents/validate";
import { fetchDocument } from "../../validator/src/fetch-document.js";
import { dohResolver } from "../../validator/src/dns.js";
import { adoptersScript } from "./adopters.js";
import { landingPage } from "./landing.js";
import { renderSchemaPage, schemaPageScript } from "./schema-page.js";
import { availableTextLanguages, selectLanguage } from "./language.js";
import { normalizeLegacy } from "./legacy.js";
import type { TcpProbe } from "../../validator/src/tcp-probe.js";

type Bindings = Cloudflare.Env & { PURGE_TOKEN?: string };
const probe: TcpProbe = async (...args) => (await import("../../validator/src/tcp-probe.js")).tcpProbe(...args);
const tagFor = async (target: string) => "feed-" + Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(target))), b => b.toString(16).padStart(2, "0")).join("");
const supportedVersions = new Set(["0.1.0", "0.2.0", "0.3.0", "0.4.0", "0.5.0", "0.6.0"]);
const ttl = 900;
const headers = { "x-content-type-options": "nosniff", "referrer-policy": "no-referrer" };
const fail = (status: number, code: string, message: string) => new Response(JSON.stringify({ error: code, message }), {
  status, headers: { ...headers, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

export async function handleRequest(request: Request, env: Bindings, fetcher = fetchDocument, ctx?: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === "/purge" && request.method === "POST") {
    const allowed = await env.RATE_LIMITER.limit({ key: request.headers.get("cf-connecting-ip") ?? "unknown" });
    if (!allowed.success) return fail(429, "rate-limited", "Too many requests; try again later.");
    const token = /^Bearer (.+)$/.exec(request.headers.get("authorization") ?? "")?.[1] ?? "";
    if (!env.PURGE_TOKEN || !token) return fail(403, "forbidden", "Authorization required.");
    const digest = async (value: string) => crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    if (!crypto.subtle.timingSafeEqual(await digest(token), await digest(env.PURGE_TOKEN))) return fail(403, "forbidden", "Authorization required.");
    const source = url.searchParams.get("feed") ?? url.searchParams.get("event");
    if (!source) return fail(400, "invalid-input", "Pass a source URL.");
    if (!ctx?.cache) return fail(503, "purge-unavailable", "Cache purge is unavailable.");
    const result = await ctx.cache.purge({ tags: [await tagFor(source)] });
    return Response.json(result, { status: result.success ? 200 : 503, headers: { ...headers, "cache-control": "no-store" } });
  }
  if (request.method !== "GET" && request.method !== "HEAD") return fail(405, "method-not-allowed", "Use GET or HEAD.");
  if (url.pathname === "/" && (url.searchParams.has("feed") || url.searchParams.has("format"))) {
    const feeds = url.searchParams.getAll("feed");
    const formats = url.searchParams.getAll("format");
    if (feeds.length !== 1 || !feeds[0] || formats.length !== 1 || !["ics", "rss", "schema"].includes(formats[0]!)) {
      return fail(400, "invalid-input", "Choose one feed URL and one output format.");
    }
    const destination = new URL(`/${formats[0]}`, url);
    destination.searchParams.set("feed", feeds[0]);
    for (const key of ["lang", "cache"]) {
      const values = url.searchParams.getAll(key);
      if (values.length > 1) return fail(400, "invalid-input", "Pass each option at most once.");
      // The form's "Original text" option submits lang=; omit it so the
      // converter uses the source language and the URL matches the preview.
      if (key === "lang" && values[0] === "") continue;
      if (values.length && !values[0]) return fail(400, "invalid-input", "Option values cannot be empty.");
      if (values.length) destination.searchParams.set(key, values[0]!);
    }
    if (destination.searchParams.has("cache") && destination.searchParams.get("cache") !== "bypass") return fail(400, "invalid-cache", "Use cache=bypass.");
    return new Response(null, { status: 303, headers: { ...headers, location: destination.pathname + destination.search, "cache-control": "no-store" } });
  }
  if (url.pathname === "/") return new Response(request.method === "HEAD" ? null : landingPage, { headers: { ...headers, "content-type": "text/html; charset=utf-8", "content-security-policy": "default-src 'none'; script-src 'self'; connect-src 'self' https://opentechevents.org; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'", "cache-control": "public, max-age=0, s-maxage=900" } });
  if (url.pathname === "/adopters.js") return new Response(adoptersScript, { headers: { ...headers, "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=3600" } });
  if (url.pathname === "/schema-ui.js") return new Response(schemaPageScript, { headers: { ...headers, "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=3600" } });
  if (url.pathname === "/health") return new Response('{"ok":true}', { headers: { ...headers, "content-type": "application/json", "cache-control": "no-store" } });
  const format = url.pathname.slice(1);
  if (!["ics", "rss", "schema", "feed-languages"].includes(format)) return fail(404, "not-found", "Choose /ics, /rss, or /schema.");
  const feeds = url.searchParams.getAll("feed"), events = url.searchParams.getAll("event");
  if (feeds.length + events.length !== 1 || (format !== "schema" && events.length)) return fail(400, "invalid-input", "Pass exactly one feed URL, or one event URL for /schema.");
  const ids = url.searchParams.getAll("id");
  if (ids.length && (format !== "schema" || !feeds.length || ids.length !== 1 || !ids[0])) {
    return fail(400, "invalid-id", "Pass one non-empty id with /schema?feed=… only.");
  }
  const target = feeds[0] ?? events[0];
  if (!target) return fail(400, "invalid-input", "The source URL is empty.");
  const languages = url.searchParams.getAll("lang");
  if (languages.length > 1 || (languages.length && !languages[0])) return fail(400, "invalid-language", "Pass one language tag in lang.");
  let language: string | undefined;
  if (languages.length) {
    try { language = Intl.getCanonicalLocales(languages[0]!)[0]; }
    catch { return fail(400, "invalid-language", "Use a valid language tag such as es or en-US."); }
  }
  const output = url.searchParams.get("output") ?? "html";
  if (format === "schema" && !["html", "script", "json"].includes(output)) return fail(400, "invalid-output", "Use output=html, script, or json.");
  if (url.searchParams.has("cache") && url.searchParams.get("cache") !== "bypass") return fail(400, "invalid-cache", "Use cache=bypass.");
  const { success } = await env.RATE_LIMITER.limit({ key: request.headers.get("cf-connecting-ip") ?? "unknown" });
  if (!success) return fail(429, "rate-limited", "Too many requests; try again later.");
  const fetchImpl: typeof fetch = (input, init) => fetch(input, init);
  const fetched = await fetcher(target, { fetchImpl, resolve: dohResolver(fetchImpl), probe });
  if (!fetched.ok) return fail(fetched.status, fetched.code, fetched.message);
  let document: unknown;
  try { document = JSON.parse(fetched.body); } catch { return fail(422, "invalid-json", "The source is not valid JSON."); }
  if (!document || typeof document !== "object" || !("specVersion" in document) || typeof document.specVersion !== "string") return fail(422, "unknown-version", "The source must declare a published specVersion.");
  const version = document.specVersion;
  if (!(PUBLISHED_VERSIONS as readonly string[]).includes(version)) return fail(422, "unknown-version", "The declared OTE version is not known to this service.");
  if (!supportedVersions.has(version)) return fail(422, "unsupported-version", "This OTE version has not yet been tested by this service.");
  const validators = await loadValidators(version);
  const validation = feeds.length ? validators.validateFeed(document) : validators.validateEvent(document);
  if (!validation.valid) return fail(422, "invalid-ote", "The source does not validate against its declared OTE version. Check it with validator.opentechevents.org.");
  document = normalizeLegacy(document as Record<string, unknown>, feeds.length ? "feed" : "event", version);
  if (format === "feed-languages") {
    return Response.json({ languages: availableTextLanguages(document as Record<string, unknown>) }, {
      headers: { ...headers, "cache-control": url.searchParams.get("cache") === "bypass" ? "no-store" : `public, max-age=0, s-maxage=${ttl}` },
    });
  }
  document = selectLanguage(document as Record<string, unknown>, feeds.length ? "feed" : "event", language);
  let body: string, type: string;
  try {
    if (format === "ics") { body = feedToIcs(document as IcsFeed, { locale: language ?? (document as IcsFeed).textLanguage, utcTimes: true }); type = "text/calendar; charset=utf-8"; }
    else if (format === "rss") { body = feedToRss(document as RssFeed, { locale: language ?? (document as RssFeed).textLanguage }); type = "application/rss+xml; charset=utf-8"; }
    else {
      let data;
      if (feeds.length && ids.length) {
        const event = (document as OteFeed).events.find((entry) => entry.id === ids[0]);
        if (!event) return fail(404, "event-not-found", "No event with that exact id exists in the feed.");
        data = eventToJsonLd(event);
      } else {
        data = feeds.length ? feedToJsonLd(document as OteFeed) : eventToJsonLd(document as OteEvent);
      }
      if (output === "json") { body = JSON.stringify(data, null, 2); type = "application/ld+json; charset=utf-8"; }
      else {
        const script = toJsonLdScript(data);
        if (output === "script") { body = script; type = "text/plain; charset=utf-8"; }
        else { body = renderSchemaPage(data, url, feeds.length ? document as OteFeed : undefined, ids[0]); type = "text/html; charset=utf-8"; }
      }
    }
  } catch (error) {
    if (format === "ics" && error instanceof Error && error.message === "The event's end is not after its start when resolved in its time zone.") {
      return fail(422, "invalid-time-range", "An event's end is not after its start in its time zone. Check dates around daylight-saving transitions.");
    }
    if (format === "ics" && error instanceof RangeError) return fail(422, "unsupported-timezone", "An event's time zone is not supported by this runtime.");
    return fail(422, "conversion-failed", "The document could not be converted.");
  }
  return new Response(request.method === "HEAD" ? null : body, { headers: { ...headers, "content-type": type, "cache-tag": await tagFor(target), "content-security-policy": "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'", "cache-control": url.searchParams.get("cache") === "bypass" ? "no-store" : `public, max-age=0, s-maxage=${ttl}` } });
}
export default { fetch(request: Request, env: Bindings, ctx: ExecutionContext) { return handleRequest(request, env, fetchDocument, ctx); } };
