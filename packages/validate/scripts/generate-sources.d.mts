// Types for generate-sources.mjs — see compile-validators.d.mts.
import type { PublishedVersion } from "./compile-validators.d.mts";

export function compiledValidatorsSource(entry: PublishedVersion): string;
export function schemasModule(entry: PublishedVersion): string;
export function versionsModule(entries: PublishedVersion[]): string;
export function modulesModule(entries: PublishedVersion[]): string;
export function latestModule(entries: PublishedVersion[]): string;
