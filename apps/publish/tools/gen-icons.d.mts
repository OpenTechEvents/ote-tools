/**
 * Types for the icon generator, so `test/icons.test.ts` can call the same two
 * builders the script writes with and compare them against the committed
 * module. The script itself stays plain ESM, like every other build script in
 * this repository.
 */
import type { BrandIcon } from "../src/lib/icons.generated.js";

export declare function brandIconData(): Record<string, BrandIcon>;
export declare function uiIconData(): Record<string, string>;
export declare function render(): string;
