import { describe, expect, it } from "vitest";
import { eventSchema } from "../src/schemas.js";
import { INHERITED_FIELDS, resolveEventInheritance } from "../src/inherit.js";

describe("the inheritable fields are the ones the schema says", () => {
  it("matches the schema's own x-inheritsFrom annotations", () => {
    // Derived, so the day the spec annotates a fifth field this fails with
    // the name of it, instead of three exporters quietly dropping it. The
    // exclusion is deliberate: specVersion identifies the document's rules
    // and no consumer needs it stamped onto every event.
    // The event rules live under `$defs.event` in the published schema; the
    // top level is the envelope that references them.
    const properties = (eventSchema as unknown as { $defs: { event: { properties: Record<string, { "x-inheritsFrom"?: string }> } } }).$defs.event.properties;
    expect(Object.keys(properties).length).toBeGreaterThan(10);
    const annotated = Object.entries(properties)
      .filter(([, schema]) => schema["x-inheritsFrom"] !== undefined)
      .map(([field]) => field)
      .filter((field) => field !== "specVersion");
    expect([...INHERITED_FIELDS].sort()).toEqual(annotated.sort());
  });
});

describe("resolveEventInheritance", () => {
  const feed = {
    specVersion: "0.6.0", title: "T", updatedAt: "2026-01-01T00:00:00Z",
    organizers: [{ name: "Feed org" }], textLanguage: "es", license: "CC-BY-4.0",
    contributing: "mailto:fix@example.org",
    events: [
      { id: "a", name: "Inherits" },
      { id: "b", name: "Declares", organizers: [{ name: "Own org" }], textLanguage: "en" },
    ],
  };

  it("fills a blank and never overwrites a declared value", () => {
    const resolved = resolveEventInheritance(feed);
    expect(resolved.events[0]).toMatchObject({ organizers: [{ name: "Feed org" }], textLanguage: "es", license: "CC-BY-4.0", contributing: "mailto:fix@example.org" });
    expect(resolved.events[1]).toMatchObject({ organizers: [{ name: "Own org" }], textLanguage: "en" });
  });
  it("replaces rather than merging", () => {
    const resolved = resolveEventInheritance(feed);
    expect(resolved.events[1]!.organizers).toHaveLength(1);
  });
  it("leaves a field absent when neither level declares it", () => {
    const { textLanguage: _omitted, ...without } = feed;
    void _omitted;
    const resolved = resolveEventInheritance(without);
    // Absent textLanguage means unknown, never English: nothing here may
    // infer it from a locale or a header.
    expect("textLanguage" in resolved.events[0]!).toBe(false);
  });
  it("does not mutate the caller's document, and is idempotent", () => {
    const before = JSON.stringify(feed);
    const once = resolveEventInheritance(feed);
    expect(JSON.stringify(feed)).toBe(before);
    expect(resolveEventInheritance(once)).toEqual(once);
  });
  it("returns a document with no events unchanged", () => {
    // A standalone event has no feed to inherit from, and `/schema?event=`
    // hands one straight through.
    const event = { specVersion: "0.6.0", id: "a", name: "Standalone", events: undefined };
    expect(resolveEventInheritance(event)).toBe(event);
  });
});
