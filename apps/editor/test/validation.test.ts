import { describe, expect, it } from "vitest";

import { validateDraft } from "../src/lib/validation.js";
import type { OteEvent } from "../src/lib/types.js";

const NOW = "2026-07-16T12:00:00Z";

const config = {
  feed: { title: "Test feed", license: "CC-BY-4.0" },
  profile: "meetup",
};

const validEvent: OteEvent = {
  id: "https://x.example/events/2026-06-async",
  name: "Async night",
  startDate: "2026-06-11T18:30",
  timezone: "Europe/Madrid",
};

describe("validateDraft", () => {
  it("a minimal valid event (no license, no specVersion) passes", () => {
    const result = validateDraft(config, validEvent, NOW);
    expect(result.valid).toBe(true);
    expect(result.fieldErrors.size).toBe(0);
    expect(result.documentErrors).toEqual([]);
  });

  /**
   * The two relaxations 0.4.0 brought, at the surface an organizer types into.
   * The schema is the authority here — the form's own `type="url"` inputs are
   * a convenience on top of it — so neither of these may come back as an error
   * the editor invented.
   */
  it("accepts a non-ASCII address and an http image, as 0.4.0 does", () => {
    const result = validateDraft(
      config,
      {
        ...validEvent,
        id: "https://x.example/eventos/pycamp-españa",
        url: "https://x.example/eventos/pycamp-españa",
        image: ["http://x.example/cartel.png"],
        location: { onlineUrl: "https://reunión.example/sala" },
      } as unknown as OteEvent,
      NOW,
    );
    expect([...result.fieldErrors.keys()]).toEqual([]);
    expect(result.documentErrors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("missing required fields map to their form fields", () => {
    const result = validateDraft(
      config,
      { name: "x" } as unknown as OteEvent,
      NOW,
    );
    expect(result.valid).toBe(false);
    const flagged = [...result.fieldErrors.keys()].concat(
      result.documentErrors,
    );
    // id, startDate and timezone are required; they surface somewhere visible
    expect(flagged.length).toBeGreaterThan(0);
    expect(result.fieldErrors.has("name")).toBe(false);
  });

  it("a bad nested field maps to its form field", () => {
    const result = validateDraft(
      config,
      {
        ...validEvent,
        location: { onlineUrl: "ftp://nope" },
      },
      NOW,
    );
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.has("onlineUrl")).toBe(true);
  });

  it("mixed date forms are reported, not silently accepted", () => {
    const result = validateDraft(
      config,
      { ...validEvent, endDate: "2026-06-12" }, // timed start, all-day end
      NOW,
    );
    expect(result.valid).toBe(false);
  });

  it("config problems are kept apart from event problems", () => {
    // license is present (so D029 doesn't also fail the event itself over a
    // missing license neither side declares) but licenseUrl is malformed —
    // a config-only problem, isolated from the event's own validity.
    const result = validateDraft(
      { feed: { title: "T", license: "CC-BY-4.0", licenseUrl: "not-a-url" } },
      validEvent,
      NOW,
    );
    expect(result.valid).toBe(true); // the event itself is fine
    expect(result.configProblems.length).toBeGreaterThan(0);
  });

  it("a null config validates against a placeholder feed", () => {
    const result = validateDraft(null, validEvent, NOW);
    expect(result.valid).toBe(true);
    expect(result.configProblems).toEqual([]);
  });

  it("cfp/eligibility/partOf/organizers errors map to their form fields", () => {
    const result = validateDraft(
      config,
      {
        ...validEvent,
        cfp: { opensAt: "2026-05-01T00:00:00+02:00" }, // missing required url
        eligibility: { note: "x" }, // missing required type
        partOf: { name: "Series" }, // missing required id
        organizers: [{ url: "https://x.example" }], // missing required name
      } as unknown as OteEvent,
      NOW,
    );
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.has("cfp")).toBe(true);
    expect(result.fieldErrors.has("eligibility")).toBe(true);
    expect(result.fieldErrors.has("partOf")).toBe(true);
    expect(result.fieldErrors.has("organizers")).toBe(true);
  });

  it("offers/image/textLanguage errors map to their form fields", () => {
    const result = validateDraft(
      config,
      {
        ...validEvent,
        textLanguage: "not a valid tag!!",
        image: ["not-a-url"],
        offers: [{ price: -5 }],
      } as unknown as OteEvent,
      NOW,
    );
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.has("textLanguage")).toBe(true);
    expect(result.fieldErrors.has("image")).toBe(true);
    expect(result.fieldErrors.has("offers")).toBe(true);
  });

  it("a translation entry with neither name nor description maps to translations", () => {
    const result = validateDraft(
      config,
      {
        ...validEvent,
        textLanguage: "en",
        translations: { es: {} },
      } as unknown as OteEvent,
      NOW,
    );
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.has("translations")).toBe(true);
  });

  it("a translation language equal to textLanguage surfaces as a document error", () => {
    // distinctTranslationLanguages validates the whole event, so ajv reports
    // it at the document root — it must still reach the user, just not
    // pinned to a single field.
    const result = validateDraft(
      config,
      {
        ...validEvent,
        textLanguage: "en",
        translations: { en: { name: "Same language as the original" } },
      } as unknown as OteEvent,
      NOW,
    );
    expect(result.valid).toBe(false);
    expect(result.documentErrors.length).toBeGreaterThan(0);
  });
});
