import { afterEach, describe, expect, it } from "vitest";

import { es } from "../src/i18n/es.js";
import { getLocale, pickLocale, setLocale, t } from "../src/i18n/index.js";

describe("pickLocale", () => {
  it("prefers a saved value when it's a supported locale", () => {
    expect(pickLocale("es", ["en-US"])).toBe("es");
  });

  it("ignores a saved value that isn't a supported locale", () => {
    expect(pickLocale("fr", ["es-ES"])).toBe("es");
  });

  it("falls back to the browser's preferred languages, matched by 2-letter prefix", () => {
    expect(pickLocale(null, ["fr-FR", "es-MX", "en-US"])).toBe("es");
  });

  it("falls back to English when nothing matches", () => {
    expect(pickLocale(null, ["fr-FR", "de-DE"])).toBe("en");
  });

  it("falls back to English when there's nothing to go on at all", () => {
    expect(pickLocale(null, [])).toBe("en");
  });
});

describe("t", () => {
  afterEach(() => {
    setLocale("en");
    delete es["test.only.key"];
  });

  it("always returns the fallback for locale en", () => {
    setLocale("en");
    expect(t("anything", "English fallback")).toBe("English fallback");
  });

  it("returns the translation when present in the active locale's dictionary", () => {
    es["test.only.key"] = "Traducción de prueba";
    setLocale("es");
    expect(t("test.only.key", "English fallback")).toBe("Traducción de prueba");
  });

  it("falls back to English when the key is missing from the active locale", () => {
    setLocale("es");
    expect(t("definitely.missing.key", "English fallback")).toBe("English fallback");
  });
});

describe("getLocale/setLocale", () => {
  afterEach(() => setLocale("en"));

  it("reflects the last locale set", () => {
    setLocale("es");
    expect(getLocale()).toBe("es");
  });
});
