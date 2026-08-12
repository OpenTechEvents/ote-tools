// Run with: node --test .github/scripts/issue-to-pr.test.mjs
//
// Uses the real @opentechevents/validate (packages/validate/dist/index.js
// must be built first — `pnpm --filter @opentechevents/validate build`,
// already a prerequisite of `pnpm build` at the repo root), same as the
// real workflow step does. No mocking: these are the actual validation
// rules an issue's JSON will be checked against.

import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
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

// --- recurring-template blocks ----------------------------------------------

const recurringTemplateBlock = (overrides = {}) => ({
  _oteBatchMode: "recurring-template",
  template: {
    name: "Monthly Meetup",
    timezone: "Europe/Madrid",
  },
  occurrences: [
    { id: "https://example.org/events/2026-06-monthly", startDate: "2026-06-08T18:00" },
    { id: "https://example.org/events/2026-07-monthly", startDate: "2026-07-13T18:00" },
    { id: "https://example.org/events/2026-08-monthly", startDate: "2026-08-10T18:00" },
  ],
  ...overrides,
});

test("parseIssueBody: recurring-template block expands into one result per occurrence", () => {
  const results = parseIssueBody(fence(recurringTemplateBlock()));
  assert.equal(results.length, 3);
  assert.deepEqual(results.map((r) => r.slug), [
    "2026-06-monthly",
    "2026-07-monthly",
    "2026-08-monthly",
  ]);
  for (const result of results) {
    assert.equal(result.event.name, "Monthly Meetup");
    assert.equal(result.event.timezone, "Europe/Madrid");
  }
  assert.equal(results[1].event.startDate, "2026-07-13T18:00");
});

test("parseIssueBody: an occurrence missing a required field fails the whole run", () => {
  const block = recurringTemplateBlock({
    template: { timezone: "Europe/Madrid" }, // no name, and occurrence below has no startDate either
    occurrences: [{ id: "https://example.org/events/2026-06-x" }],
  });
  assert.throws(
    () => parseIssueBody(fence(block)),
    (error) =>
      error instanceof IssueToPrError && /not valid against the OTE event schema/.test(error.title),
  );
});

test("parseIssueBody: an empty occurrences array is rejected", () => {
  const block = recurringTemplateBlock({ occurrences: [] });
  assert.throws(
    () => parseIssueBody(fence(block)),
    (error) =>
      error instanceof IssueToPrError && /non-empty "occurrences" array/.test(error.title),
  );
});

test("parseIssueBody: a non-object template is rejected", () => {
  const block = recurringTemplateBlock({ template: "not an object" });
  assert.throws(
    () => parseIssueBody(fence(block)),
    (error) => error instanceof IssueToPrError && /missing a "template" object/.test(error.title),
  );
});

test("parseIssueBody: an unrecognized _oteBatchMode value is rejected", () => {
  assert.throws(
    () => parseIssueBody(fence({ _oteBatchMode: "not-a-real-mode" })),
    (error) =>
      error instanceof IssueToPrError && /unrecognized "_oteBatchMode" value/.test(error.title),
  );
});

test("parseIssueBody: a legacy single-event block still parses exactly as before, alongside a recurring-template block", () => {
  const body = [
    fence(validEvent({ id: "https://example.org/events/2026-05-standalone", name: "Standalone" })),
    fence(recurringTemplateBlock()),
  ].join("\n\n");
  const results = parseIssueBody(body);
  assert.equal(results.length, 4); // 1 legacy + 3 expanded occurrences
  assert.equal(results[0].slug, "2026-05-standalone");
  assert.deepEqual(results.slice(1).map((r) => r.slug), [
    "2026-06-monthly",
    "2026-07-monthly",
    "2026-08-monthly",
  ]);
});

test("parseIssueBody: duplicate-slug detection spans a legacy block and a recurring-template block", () => {
  const body = [
    fence(validEvent({ id: "https://example.org/events/2026-06-monthly", name: "Collides" })),
    fence(recurringTemplateBlock()),
  ].join("\n\n");
  assert.throws(
    () => parseIssueBody(body),
    (error) => error instanceof IssueToPrError && /Duplicate filename/.test(error.title),
  );
});

test("parseIssueBody: the backend imposes no occurrence-count cap of its own", () => {
  // The client (apps/editor) caps a single recurrence rule at 24
  // occurrences — this script never re-asserts that limit itself, it just
  // expands whatever it's given.
  const occurrences = Array.from({ length: 30 }, (_, i) => ({
    id: `https://example.org/events/2026-occ-${i}`,
    startDate: `2026-01-${String((i % 28) + 1).padStart(2, "0")}T18:00`,
  }));
  const results = parseIssueBody(fence(recurringTemplateBlock({ occurrences })));
  assert.equal(results.length, 30);
});

// --- patch blocks ------------------------------------------------------

const patchBlock = (overrides = {}) => ({
  _oteBatchMode: "patch",
  slug: "2026-06-async",
  patch: { license: "CC0-1.0" },
  ...overrides,
});

function seedEvent(repoRoot, slug, event) {
  const dir = join(repoRoot, "events");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${slug}.json`), JSON.stringify(event, null, 2));
}

test("parseIssueBody: a patch block merges onto the existing file and validates the result", () => {
  withTmpDir((repoRoot) => {
    seedEvent(repoRoot, "2026-06-async", validEvent({ description: "Original description" }));
    const results = parseIssueBody(fence(patchBlock()), { repoRoot });
    assert.equal(results.length, 1);
    assert.equal(results[0].slug, "2026-06-async");
    assert.equal(results[0].event.license, "CC0-1.0");
    // Untouched keys survive verbatim from the seeded file.
    assert.equal(results[0].event.description, "Original description");
    assert.equal(results[0].event.name, validEvent().name);
  });
});

test("parseIssueBody: a null patch value deletes that key", () => {
  withTmpDir((repoRoot) => {
    seedEvent(repoRoot, "2026-06-async", validEvent({ description: "Will be removed" }));
    const block = patchBlock({ patch: { description: null } });
    const results = parseIssueBody(fence(block), { repoRoot });
    assert.equal("description" in results[0].event, false);
  });
});

test("parseIssueBody: a patch targeting a nonexistent file is rejected", () => {
  withTmpDir((repoRoot) => {
    assert.throws(
      () => parseIssueBody(fence(patchBlock({ slug: "does-not-exist" })), { repoRoot }),
      (error) =>
        error instanceof IssueToPrError && /patches a file that doesn't exist/.test(error.title),
    );
  });
});

test("parseIssueBody: a patch targeting a nonexistent file fails the whole run even mixed with a valid block", () => {
  withTmpDir((repoRoot) => {
    seedEvent(repoRoot, "2026-06-async", validEvent());
    const body = [fence(validEvent()), fence(patchBlock({ slug: "does-not-exist" }))].join("\n\n");
    assert.throws(
      () => parseIssueBody(body, { repoRoot }),
      (error) =>
        error instanceof IssueToPrError && /patches a file that doesn't exist/.test(error.title),
    );
  });
});

test("parseIssueBody: a no-op patch (reproducing existing content) succeeds", () => {
  withTmpDir((repoRoot) => {
    seedEvent(repoRoot, "2026-06-async", validEvent({ license: "CC0-1.0" }));
    const results = parseIssueBody(fence(patchBlock({ patch: { license: "CC0-1.0" } })), { repoRoot });
    assert.equal(results[0].event.license, "CC0-1.0");
  });
});

test("parseIssueBody: a patch with a missing or invalid slug is rejected", () => {
  withTmpDir((repoRoot) => {
    assert.throws(
      () => parseIssueBody(fence(patchBlock({ slug: undefined })), { repoRoot }),
      (error) => error instanceof IssueToPrError && /missing a valid "slug"/.test(error.title),
    );
    assert.throws(
      () => parseIssueBody(fence(patchBlock({ slug: "not a valid slug!" })), { repoRoot }),
      (error) => error instanceof IssueToPrError && /missing a valid "slug"/.test(error.title),
    );
  });
});

test("parseIssueBody: a non-object patch is rejected", () => {
  withTmpDir((repoRoot) => {
    assert.throws(
      () => parseIssueBody(fence(patchBlock({ patch: "not an object" })), { repoRoot }),
      (error) => error instanceof IssueToPrError && /missing a "patch" object/.test(error.title),
    );
  });
});

test("parseIssueBody: patch, full-document, and recurring-template blocks coexist in one issue", () => {
  withTmpDir((repoRoot) => {
    seedEvent(repoRoot, "2026-06-async", validEvent());
    const body = [
      fence(patchBlock()),
      fence(validEvent({ id: "https://example.org/events/2026-05-standalone", name: "Standalone" })),
      fence(recurringTemplateBlock()),
    ].join("\n\n");
    const results = parseIssueBody(body, { repoRoot });
    assert.equal(results.length, 5); // 1 patch + 1 legacy + 3 expanded occurrences
    assert.equal(results[0].slug, "2026-06-async");
    assert.equal(results[0].event.license, "CC0-1.0");
    assert.equal(results[1].slug, "2026-05-standalone");
  });
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
