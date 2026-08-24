import { describe, expect, it } from "vitest";

import { DESTINATIONS } from "../src/lib/destinations.js";
import { monogram } from "../src/lib/icons.js";
import { BRAND_ICONS, UI_ICONS } from "../src/lib/icons.generated.js";
import { GROUPS } from "../src/lib/destinations.js";
import { brandIconData, uiIconData } from "../tools/gen-icons.mjs";

/**
 * `src/lib/icons.generated.ts` is committed so neither the build nor a test
 * run needs the icon packages present. That only stays safe if drift is loud:
 * this is the same guard `packages/validate` puts on its embedded schema.
 */
describe("the generated icon module", () => {
  it("matches the installed icon dependencies", () => {
    expect(BRAND_ICONS).toEqual(brandIconData());
    expect(UI_ICONS).toEqual(uiIconData());
  });

  it("every brand mark a destination asks for exists", () => {
    for (const destination of DESTINATIONS) {
      if (destination.icon !== undefined) {
        expect(BRAND_ICONS[destination.icon], destination.id).toBeDefined();
      }
    }
  });

  it("every group glyph exists", () => {
    for (const group of GROUPS) expect(UI_ICONS[group.icon], group.id).toBeDefined();
  });
});

/**
 * Destinations simple-icons has no mark for — the directories, plus the
 * brands it has dropped on trademark grounds — fall back to a letter rather
 * than to a lookalike logo. A wrong logo is a small lie, and honesty about
 * what this tool knows is the whole argument for it.
 */
describe("monogram", () => {
  it("takes one letter from a single word and two from a name", () => {
    expect(monogram("Luma")).toBe("L");
    expect(monogram("Event Garden")).toBe("EG");
    expect(monogram("dev.events")).toBe("DE");
    expect(monogram("confs.tech")).toBe("CT");
  });

  it("never comes back empty, whatever the name is made of", () => {
    expect(monogram("—")).toBe("?");
    expect(monogram("")).toBe("?");
  });
});
