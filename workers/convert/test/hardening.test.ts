import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { PUBLISHED_VERSIONS } from "@opentechevents/validate";
import worker, { handleRequest } from "../src/index.js";
import { DEFAULT_USER_AGENT } from "../../validator/src/fetch-document.js";
import feed from "../../../packages/export-ics/fixtures/feed.json";
import type { fetchDocument } from "../../validator/src/fetch-document.js";

const env = { RATE_LIMITER: { limit: async () => ({ success: true }) } };
const target = "https://example.org/feed.json";
const request = (path: string, init?: RequestInit) => new Request(`https://convert.example${path}`, init);
const fetcher = (document: unknown) => vi.fn(async () => ({ ok: true as const, body: JSON.stringify(document), bytes: 1, contentType: "application/json", finalUrl: target, redirects: [], status: 200, transport: {} })) as unknown as typeof fetchDocument;
const ctx = { waitUntil: () => {}, passThroughOnException: () => {} } as unknown as ExecutionContext;

describe("a HEAD answer never becomes the cached entry a GET is served from", () => {
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
    const response = await worker.fetch(request(`/ics?feed=${encodeURIComponent(target)}`), {} as never, ctx);
    expect(response.status).toBe(500);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect((await response.json() as { error: string }).error).toBe("internal-error");
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});

describe("no path reaches production without someone choosing it", () => {
  const workflow = readFileSync(new URL("../../../.github/workflows/deploy-convert.yml", import.meta.url), "utf8");
  const config = (name: string) => JSON.parse(readFileSync(new URL(`../${name}`, import.meta.url), "utf8").replace(/^\s*\/\/.*$/gm, "")) as { routes?: unknown[]; workers_dev?: boolean; name: string };

  it("deploys on no trigger but a hand-run workflow", () => {
    expect(workflow).toContain("workflow_dispatch:");
    // `on: push:` would make merging the deploy decision.
    expect(workflow).not.toMatch(/^\s*push:/m);
  });
  it("names the production config only under an explicit production target", () => {
    const line = workflow.split("\n").find((entry) => entry.includes("wrangler.production.jsonc"));
    expect(line).toContain('inputs.target }}" = production');
  });
  it("points a bare `wrangler deploy` at staging, which has no route", () => {
    const staging = config("wrangler.jsonc");
    expect(staging.name).toContain("staging");
    expect(staging.routes).toBeUndefined();
  });
  it("gives production one canonical URL and no workers.dev twin", () => {
    const production = config("wrangler.production.jsonc");
    expect(production.routes).toEqual([{ pattern: "convert.opentechevents.org", custom_domain: true }]);
    expect(production.workers_dev).toBe(false);
  });
});
