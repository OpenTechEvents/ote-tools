// Types for spec-versions.mjs — see compile-validators.d.mts.
import type { PublishedVersion, VersionSchemas } from "./compile-validators.d.mts";

export function readVersionSchemas(dir: string): VersionSchemas;
export function publishedVersions(): PublishedVersion[];
export function compareVersions(a: string, b: string): number;
