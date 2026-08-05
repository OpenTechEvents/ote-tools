import {
  annotationKeywords as liveAnnotationKeywords,
  customFormats as liveCustomFormats,
  customKeywords as liveCustomKeywords,
} from "@opentechevents/schema";
import { describe, expect, it } from "vitest";

import {
  annotationKeywords,
  customFormats,
  customKeywords,
} from "../src/validators.generated.js";

// validators.generated.ts vendors real functions (not JSON), so it can't be
// deep-equal-compared against @opentechevents/schema the way
// schemas.generated.ts is. Instead: metadata (names, keywords, error
// messages) is compared directly, and behavior is spot-checked on a battery
// of representative inputs — if vendoring ever falls out of sync with a
// dependency bump, either a metadata mismatch or a behavioral divergence
// here should catch it, on top of the full fixture suite in validate.test.ts
// (which exercises this same vendored code through real validation).
describe("validators.generated.ts", () => {
  it("annotationKeywords matches @opentechevents/schema", () => {
    expect(annotationKeywords).toEqual(liveAnnotationKeywords);
  });

  it("customFormats: same names, in the same order", () => {
    expect(customFormats.map((f) => f.name)).toEqual(
      liveCustomFormats.map((f) => f.name),
    );
  });

  it("customFormats: identical validate() behavior on representative inputs", () => {
    const samples = [
      "2026-06-11T18:30",
      "2026-06-11T18:30:00",
      "2026-02-30T10:00",
      "2024-02-29T10:00",
      "2023-02-29T10:00",
      "not-a-date",
      "",
      "en",
      "en-US",
      "es-419",
      "xx-zz-yy",
      "EN-us",
      "zzz",
    ];
    for (let i = 0; i < customFormats.length; i++) {
      const vendored = customFormats[i]!;
      const live = liveCustomFormats.find((f) => f.name === vendored.name)!;
      for (const sample of samples) {
        expect(vendored.validate(sample)).toBe(live.validate(sample));
      }
    }
  });

  it("customKeywords: same keyword/type/schemaType/error, in the same order", () => {
    const metadata = (list: typeof customKeywords) =>
      list.map((k) => ({
        keyword: k.keyword,
        type: k.type,
        schemaType: k.schemaType,
        error: k.error,
      }));
    expect(metadata(customKeywords)).toEqual(metadata(liveCustomKeywords));
  });

  it("customKeywords: identical validate() behavior on representative event/feed data", () => {
    const samples: Record<string, unknown>[] = [
      { startDate: "2026-06-01", endDate: "2026-05-01" },
      { startDate: "2026-06-01", endDate: "2026-07-01" },
      { opensAt: "2026-01-01T00:00:00Z", closesAt: "2025-01-01T00:00:00Z" },
      {
        textLanguage: "es",
        translations: { es: { name: "x" }, en: { name: "y" } },
      },
      { events: [{ id: "a" }, { id: "a" }] },
      { events: [{ id: "a" }, { id: "b" }] },
      { id: "https://x.example/1", partOf: { id: "https://x.example/1" } },
      { id: "https://x.example/1", partOf: { id: "https://x.example/2" } },
      { updatedAt: "2026-01-01T00:00:00Z", events: [{ updatedAt: "2026-02-01T00:00:00Z" }] },
      { languages: ["es", "ES"] },
      { languages: ["es", "en"] },
    ];
    for (let i = 0; i < customKeywords.length; i++) {
      const vendored = customKeywords[i]!;
      const live = liveCustomKeywords.find((k) => k.keyword === vendored.keyword)!;
      for (const sample of samples) {
        expect(vendored.validate(true, sample as never)).toBe(
          live.validate(true, sample as never),
        );
      }
    }
  });
});
