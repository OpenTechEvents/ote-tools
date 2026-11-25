import { describe, expect, it, vi } from "vitest";
import { PUBLISHED_VERSIONS } from "@opentechevents/validate";
import worker, { convertibleVersions, handleRequest } from "../src/index.js";
import { DEFAULT_USER_AGENT } from "../../validator/src/fetch-document.js";
import feed from "../../../packages/export-ics/fixtures/feed.json";
import workflow from "../../../.github/workflows/deploy-convert.yml?raw";
import stagingConfig from "../wrangler.jsonc?raw";
import productionConfig from "../wrangler.production.jsonc?raw";
import type { fetchDocument } from "../../validator/src/fetch-document.js";

const env = { RATE_LIMITER: { limit: async () => ({ success: true }) } };
const target = "https://example.org/feed.json";
const request = (path: string, init?: RequestInit) => new Request(`https://convert.example${path}`, init);
const fetcher = (document: unknown) => vi.fn(async () => ({ ok: true as const, body: JSON.stringify(document), bytes: 1, contentType: "application/json", finalUrl: target, redirects: [], status: 200, transport: {} })) as unknown as typeof fetchDocument;

// What these assert is the Worker's own behaviour on a HEAD it actually
// receives — a cache miss. Behind Cloudflare's cache a HEAD is answered from
// the GET entry with the body stripped at the edge and the Worker is not
// invoked at all (measured; see the README), so this is the belt, not the
// braces: the thing it protects against cannot be reached from outside.
describe("a HEAD answer never becomes the cached entry a GET is served from", () => {
  it.each(["/adopters.js", "/schema-ui.js", `/feed-languages?feed=${encodeURIComponent(target)}`])("%s answers HEAD with no body and no-store", async (path) => {
    // Enumerated from the code, not from the fix: a bodyless `/adopters.js`
    // cached for an hour is HANDOFF.md trap 2 — a page with no listeners.
    const response = await handleRequest(request(path, { method: "HEAD" }), env, fetcher(feed));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it.each(["/ics", "/rss"])("%s answers HEAD with no body and no-store", async (path) => {
    const response = await handleRequest(request(`${path}?feed=${encodeURIComponent(target)}`, { method: "HEAD" }), env, fetcher(feed));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
    // An empty 200 text/calendar is a silently broken subscription, which is
    // what caching this answer under the GET key would produce.
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("still caches the GET it mirrors", async () => {
    const response = await handleRequest(request(`/ics?feed=${encodeURIComponent(target)}`), env, fetcher(feed));
    expect(response.headers.get("cache-control")).toContain("s-maxage=900");
  });
  it("answers HEAD for the landing page without seeding an empty page", async () => {
    const response = await handleRequest(request("/", { method: "HEAD" }), env, fetcher(feed));
    expect(await response.text()).toBe("");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});

describe("the versions it converts are derived from the ones it embeds", () => {
  // The replaced code listed them, so its refusal branch was unreachable
  // until the next spec release, when it would have refused every document on
  // the new version while the rest of the kit validated them. This test fails
  // the day a published version stops converting, which is the only honest
  // moment to decide something about it.
  it.each(PUBLISHED_VERSIONS)("accepts a document declaring %s", async (version) => {
    const document = { ...structuredClone(feed), specVersion: version, events: [] };
    const response = await handleRequest(request(`/rss?feed=${encodeURIComponent(target)}`), env, fetcher(document));
    expect(response.status, await response.text()).toBe(200);
  });
  it("is the embedded list itself, not a copy that happens to match", () => {
    // `it.each(PUBLISHED_VERSIONS)` above cannot fail while a hand-written
    // copy is equal to it, which is the state the fix replaced. Identity can.
    expect(convertibleVersions).toBe(PUBLISHED_VERSIONS);
  });
  it("refuses a version that was never published, and says which exist", async () => {
    const document = { ...structuredClone(feed), specVersion: "9.9.9" };
    const response = await handleRequest(request(`/rss?feed=${encodeURIComponent(target)}`), env, fetcher(document));
    expect(response.status).toBe(422);
    const body = await response.json() as { error: string; message: string };
    expect(body.error).toBe("unknown-version");
    for (const version of PUBLISHED_VERSIONS) expect(body.message).toContain(version);
  });
});

describe("it introduces itself as the converter", () => {
  it("does not fetch publishers' feeds under the validator's name", async () => {
    const mock = fetcher(feed);
    await handleRequest(request(`/ics?feed=${encodeURIComponent(target)}`), env, mock);
    const deps = (mock as unknown as { mock: { calls: [string, { userAgent?: string }][] } }).mock.calls[0]![1];
    expect(deps.userAgent).toContain("OTE-Converter");
    expect(deps.userAgent).not.toBe(DEFAULT_USER_AGENT);
  });
});

describe("an unexpected throw is still this service answering", () => {
  it("answers 500 as JSON rather than the platform's error page", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    // A missing binding is the cheapest real example: the rate limiter is
    // touched before any try block in the handler.
    const response = await worker.fetch(request(`/ics?feed=${encodeURIComponent(target)}`), {} as never);
    expect(response.status).toBe(500);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect((await response.json() as { error: string }).error).toBe("internal-error");
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});

describe("no path reaches production without someone choosing it", () => {
  const config = (text: string) => JSON.parse(text.replace(/^\s*\/\/.*$/gm, "")) as { routes?: unknown[]; workers_dev?: boolean; name: string };

  // Read as sets, not as greps. The first draft of this guard asserted
  // `not.toMatch(/^\s*push:/)` and took the *first* line naming the
  // production config — satisfied by a flow-style `on: {push: …}` plus a
  // second, unconditional deploy line appended after the guarded one. A
  // guard that a sabotaged workflow passes is worse than no guard.
  const lines = workflow.split("\n");
  const topLevelKeys = lines.flatMap((line) => /^([a-z_]+):/.exec(line)?.[1] ?? []);
  const triggers = () => {
    const start = lines.findIndex((line) => /^on:/.test(line));
    const rest = lines.slice(start + 1);
    const end = rest.findIndex((line) => /^[a-z_]+:/.test(line));
    return (end === -1 ? rest : rest.slice(0, end)).flatMap((line) => /^ {2}([a-z_]+):/.exec(line)?.[1] ?? []);
  };

  it("has exactly one trigger, and it is a hand-run workflow", () => {
    expect(topLevelKeys).toContain("on");
    // Flow style (`on: {push: …}`) would hide a trigger from the block scan.
    expect(lines.find((line) => /^on:/.test(line))).toBe("on:");
    // Covers push, schedule, pull_request, repository_dispatch, workflow_call
    // and anything else added later, by naming what is allowed instead.
    expect(triggers()).toEqual(["workflow_dispatch"]);
  });
  it("names the production config on no line that is not conditional", () => {
    const naming = lines.filter((line) => line.includes("wrangler.production.jsonc"));
    expect(naming).toHaveLength(1);
    for (const line of naming) expect(line).toContain('inputs.target }}" = production');
  });
  it("points a bare `wrangler deploy` at staging, which has no route", () => {
    const staging = config(stagingConfig);
    expect(staging.name).toContain("staging");
    expect(staging.routes).toBeUndefined();
  });
  it("gives production one canonical URL and no workers.dev twin", () => {
    const production = config(productionConfig);
    expect(production.routes).toEqual([{ pattern: "convert.opentechevents.org", custom_domain: true }]);
    expect(production.workers_dev).toBe(false);
  });
});
