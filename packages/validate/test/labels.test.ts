import { describe, expect, it } from "vitest";
import { LABELS, LABEL_LOCALES, labelsFor, labelValue } from "../src/labels.js";

describe("exporter labels", () => {
  const keysOf = (locale: string) => Object.keys(LABELS[locale]!).sort();

  it.each(LABEL_LOCALES)("%s defines every label English defines", (locale) => {
    // The failure this prevents: a label added to one language only, which
    // reads in the output as a feature that half works.
    expect(keysOf(locale)).toEqual(keysOf("en"));
    for (const [key, value] of Object.entries(LABELS[locale]!)) {
      if (typeof value === "string") expect(value, key).not.toBe("");
    }
  });
  it.each(LABEL_LOCALES)("%s translates every enum value and status prefix", (locale) => {
    expect(Object.keys(LABELS[locale]!.values).sort()).toEqual(Object.keys(LABELS.en!.values).sort());
    expect(Object.keys(LABELS[locale]!.statusPrefixes).sort()).toEqual(Object.keys(LABELS.en!.statusPrefixes).sort());
  });
  it("decides on the primary subtag and falls back to English", () => {
    expect(labelsFor("es-MX").speakers).toBe("Ponentes");
    expect(labelsFor("ES").speakers).toBe("Ponentes");
    expect(labelsFor("fr-CA").speakers).toBe("Speakers");
    expect(labelsFor(undefined).speakers).toBe("Speakers");
    expect(labelsFor("").speakers).toBe("Speakers");
  });
  it("leaves every English enum value exactly as the spec writes it", () => {
    // English output must be byte-identical to what the exporters produced
    // before the table existed, and the spec's values are the English words.
    for (const [value, english] of Object.entries(LABELS.en!.values)) expect(english).toBe(value);
  });
  it("returns an untranslated enum value unchanged rather than blank", () => {
    expect(labelValue("cancelled", "es")).toBe("cancelado");
    expect(labelValue("something-the-spec-added-later", "es")).toBe("something-the-spec-added-later");
  });
  it("covers every status the exporters prefix a title with", () => {
    for (const status of ["scheduled", "tentative", "cancelled", "postponed", "rescheduled", "moved-online"]) {
      expect(LABELS.en!.statusPrefixes[status], status).toBeDefined();
    }
  });
});
