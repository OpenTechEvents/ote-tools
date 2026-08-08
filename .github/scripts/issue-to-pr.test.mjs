// Run with: node --test .github/scripts/issue-to-pr.test.mjs
//
// Uses the real @opentechevents/validate (packages/validate/dist/index.js
// must be built first — `pnpm --filter @opentechevents/validate build`,
// already a prerequisite of `pnpm build` at the repo root), same as the
// real workflow step does. No mocking: these are the actual validation
// rules an issue's JSON will be checked against.

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  extractFencedBlocks,
  IssueToPrError,
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
