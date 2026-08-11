// Run with: node --test .github/scripts/issue-to-pr.test.mjs
//
// Uses the real @opentechevents/validate (packages/validate/dist/index.js
// must be built first — `pnpm --filter @opentechevents/validate build`,
// already a prerequisite of `pnpm build` at the repo root), same as the
// real workflow step does. No mocking: these are the actual validation
// rules an issue's JSON will be checked against.

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  extractFencedBlocks,
  fetchImage,
  isPrivateIp,
  IssueToPrError,
  localizeEventImages,
  parseIssueBody,
  slugFromId,
  suggestSlug,
} from "./issue-to-pr.mjs";

const validEvent = (overrides = {}) => ({
  id: "https://example.org/events/2026-06-async",
  name: "Async night",
  startDate: "2026-06-11T18:30",
  timezone: "Europe/Madrid",
  ...overrides,
});

const fence = (obj) => "```json\n" + JSON.stringify(obj, null, 2) + "\n```";

test("extractFencedBlocks: finds every fenced block, in order, regardless of language tag", () => {
  const body = "intro\n" + fence({ a: 1 }) + "\nmiddle\n```\nplain\n```\n" + fence({ b: 2 });
  const blocks = extractFencedBlocks(body);
  assert.equal(blocks.length, 3);
  assert.match(blocks[0], /"a": 1/);
  assert.match(blocks[2], /"b": 2/);
});

test("extractFencedBlocks: empty array when there is no fenced block at all", () => {
  assert.deepEqual(extractFencedBlocks("just some text, no code fence"), []);
});

test("parseIssueBody: a single fenced block behaves exactly like the pre-batch script (one result)", () => {
  const results = parseIssueBody(fence(validEvent()));
  assert.equal(results.length, 1);
  assert.equal(results[0].slug, "2026-06-async");
  assert.deepEqual(results[0].event, validEvent());
});

test("parseIssueBody: multiple fenced blocks produce one result per event, in order", () => {
  const body = [
    fence(validEvent({ id: "https://example.org/events/2026-06-a", name: "A" })),
    "some prose in between",
    fence(validEvent({ id: "https://example.org/events/2026-07-b", name: "B" })),
  ].join("\n\n");
  const results = parseIssueBody(body);
  assert.equal(results.length, 2);
  assert.equal(results[0].slug, "2026-06-a");
  assert.equal(results[1].slug, "2026-07-b");
});

test("parseIssueBody: no fenced block at all throws with a human-readable title", () => {
  assert.throws(
    () => parseIssueBody("no code fence here"),
    (error) => error instanceof IssueToPrError && /No event JSON found/.test(error.title),
  );
});

test("parseIssueBody: unparseable JSON in any block fails the WHOLE run, none published", () => {
  const body = [fence(validEvent()), "```json\nnot valid json\n```"].join("\n\n");
  assert.throws(
    () => parseIssueBody(body),
    (error) => error instanceof IssueToPrError && /does not parse/.test(error.title),
  );
});

test("parseIssueBody: a schema-invalid block among valid ones fails the whole run", () => {
  const body = [fence(validEvent()), fence({ name: "missing everything else" })].join("\n\n");
  assert.throws(
    () => parseIssueBody(body),
    (error) =>
      error instanceof IssueToPrError && /not valid against the OTE event schema/.test(error.title),
  );
});

test("parseIssueBody: two events resolving to the same slug is rejected as a collision", () => {
  const body = [
    fence(validEvent({ id: "https://example.org/events/2026-06-async" })),
    fence(validEvent({ id: "https://example.org/events/2026-06-async", name: "Different name" })),
  ].join("\n\n");
  assert.throws(
    () => parseIssueBody(body),
    (error) => error instanceof IssueToPrError && /Duplicate filename/.test(error.title),
  );
});

test("slugFromId: last path segment, .json suffix stripped", () => {
  assert.equal(slugFromId("https://example.org/events/2026-06-async"), "2026-06-async");
  assert.equal(slugFromId("https://example.org/events/2026-06-async.json"), "2026-06-async");
  assert.equal(slugFromId("not a url"), null);
});

test("suggestSlug: kebab-cases the name, prefixed with the start month", () => {
  assert.equal(suggestSlug("Async Night!", "2026-06-11T18:30"), "2026-06-async-night");
  assert.equal(suggestSlug("", "2026-06-11"), null);
});

// --- isPrivateIp -----------------------------------------------------------

test("isPrivateIp: flags loopback, link-local, and RFC1918 ranges", () => {
  assert.equal(isPrivateIp("127.0.0.1"), true);
  assert.equal(isPrivateIp("10.1.2.3"), true);
  assert.equal(isPrivateIp("172.16.0.5"), true);
  assert.equal(isPrivateIp("192.168.1.1"), true);
  assert.equal(isPrivateIp("169.254.169.254"), true); // cloud metadata endpoint
  assert.equal(isPrivateIp("::1"), true);
  assert.equal(isPrivateIp("fe80::1"), true);
});

test("isPrivateIp: does not flag ordinary public addresses", () => {
  assert.equal(isPrivateIp("93.184.216.34"), false);
  assert.equal(isPrivateIp("2606:2800:220:1::"), false);
});

// --- fetchImage --------------------------------------------------------------

function fakeResponse({ status = 200, headers = {}, body = new Uint8Array([1, 2, 3]) } = {}) {
  const lowered = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: (name) => lowered[name.toLowerCase()] ?? null },
    arrayBuffer: async () => body.buffer,
  };
}

test("fetchImage: refuses a non-https URL before ever calling fetch", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("fetch should not have been called");
  });
  await assert.rejects(
    () => fetchImage("http://example.org/photo.jpg", { maxBytes: 1000, timeoutMs: 1000, maxRedirects: 3 }),
    /non-https/,
  );
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("fetchImage: rejects a response whose content-type isn't image/*", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => fakeResponse({ headers: { "content-type": "text/html" } }),
  );
  await assert.rejects(
    () => fetchImage("https://192.0.2.1/page.html", { maxBytes: 1000, timeoutMs: 1000, maxRedirects: 3 }),
    /not an image/,
  );
});

test("fetchImage: rejects a body larger than maxBytes", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    fakeResponse({
      headers: { "content-type": "image/png" },
      body: new Uint8Array(2000),
    }),
  );
  await assert.rejects(
    () => fetchImage("https://192.0.2.1/huge.png", { maxBytes: 100, timeoutMs: 1000, maxRedirects: 3 }),
    /too large/,
  );
});

test("fetchImage: returns the bytes and content-type on a normal image response", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    fakeResponse({ headers: { "content-type": "image/png" }, body: new Uint8Array([9, 9, 9]) }),
  );
  const { buffer, contentType } = await fetchImage("https://192.0.2.1/ok.png", {
    maxBytes: 1000,
    timeoutMs: 1000,
    maxRedirects: 3,
  });
  assert.equal(contentType, "image/png");
  assert.deepEqual([...buffer], [9, 9, 9]);
});

// --- localizeEventImages -----------------------------------------------------

function withTmpDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), "ote-issue-to-pr-test-"));
  return fn(dir);
}

test("localizeEventImages: downloads an opted-in image and rewrites its url", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    fakeResponse({ headers: { "content-type": "image/png" }, body: new Uint8Array([1, 2, 3]) }),
  );
  await withTmpDir(async (tmpDir) => {
    const results = [
      {
        slug: "2026-06-async",
        event: {
          id: "https://example.org/events/2026-06-async",
          image: ["https://192.0.2.1/photo.png"],
          _localizeImages: ["https://192.0.2.1/photo.png"],
        },
      },
    ];
    const warnings = await localizeEventImages(results, {
      owner: "acme",
      repo: "ote-template",
      defaultBranch: "main",
      tmpDir,
    });
    assert.deepEqual(warnings, []);
    const { event } = results[0];
    assert.equal("_localizeImages" in event, false);
    assert.match(
      event.image[0],
      /^https:\/\/raw\.githubusercontent\.com\/acme\/ote-template\/main\/assets\/2026-06-async\/[0-9a-f]{12}\.png$/,
    );
    assert.equal(results[0].assets.length, 1);
    assert.deepEqual([...readFileSync(results[0].assets[0].tmpFile)], [1, 2, 3]);
  });
});

test("localizeEventImages: a failed download keeps the original url and reports a warning", async (t) => {
  t.mock.method(globalThis, "fetch", async () => fakeResponse({ status: 404 }));
  await withTmpDir(async (tmpDir) => {
    const results = [
      {
        slug: "2026-06-async",
        event: {
          id: "https://example.org/events/2026-06-async",
          image: ["https://192.0.2.1/missing.png"],
          _localizeImages: ["https://192.0.2.1/missing.png"],
        },
      },
    ];
    const warnings = await localizeEventImages(results, {
      owner: "acme",
      repo: "ote-template",
      defaultBranch: "main",
      tmpDir,
    });
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /192\.0\.2\.1\/missing\.png/);
    assert.equal(results[0].event.image[0], "https://192.0.2.1/missing.png");
    assert.equal(results[0].assets, undefined);
  });
});

test("localizeEventImages: strips _localizeImages even when absent, empty, or malformed", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("fetch should not have been called");
  });
  await withTmpDir(async (tmpDir) => {
    const results = [
      { slug: "a", event: { id: "https://example.org/a" } },
      { slug: "b", event: { id: "https://example.org/b", _localizeImages: [] } },
      { slug: "c", event: { id: "https://example.org/c", _localizeImages: "not-an-array" } },
    ];
    const warnings = await localizeEventImages(results, {
      owner: "acme",
      repo: "ote-template",
      defaultBranch: "main",
      tmpDir,
    });
    assert.deepEqual(warnings, []);
    for (const { event } of results) assert.equal("_localizeImages" in event, false);
  });
});
