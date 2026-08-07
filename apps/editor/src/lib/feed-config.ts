import { cleanRow, isRowEmpty } from "./event-json.js";
import type { OrganizerRow, OteConfig } from "./types.js";

/**
 * Flat, all-string form model for ote.config.json's `feed` block — same
 * "" = unset convention as FormState. Scoped to the fields this dialog
 * actually edits; `profile`/`customProfile` and `feed.translations` live
 * outside it (see toOteConfigJson for how they're preserved anyway).
 */
export interface FeedConfigState {
  title: string;
  description: string;
  url: string;
  license: string;
  licenseUrl: string;
  textLanguage: string;
  organizers: OrganizerRow[];
}

/** A fresh, empty settings draft — used when a repo has no ote.config.json yet. */
export function emptyFeedConfigState(): FeedConfigState {
  return {
    title: "",
    description: "",
    url: "",
    license: "",
    licenseUrl: "",
    textLanguage: "",
    organizers: [],
  };
}

/** Reads the `feed` block into form state; a missing config or feed block just yields the empty draft (never throws — same convention as fromEventJson). */
export function fromOteConfig(config: OteConfig | null): FeedConfigState {
  const feed = config?.feed;
  return {
    title: feed?.title ?? "",
    description: feed?.description ?? "",
    url: feed?.url ?? "",
    license: feed?.license ?? "",
    licenseUrl: feed?.licenseUrl ?? "",
    textLanguage: feed?.textLanguage ?? "",
    organizers: (feed?.organizers ?? []).map((o) => ({
      name: o.name ?? "",
      url: o.url ?? "",
      email: o.email ?? "",
      type: o.type ?? "",
    })),
  };
}

/**
 * Merges the edited fields into `rawConfig`'s existing `feed` block —
 * spreading `rawConfig.feed` first (preserves `translations` and anything
 * else this dialog doesn't manage) then overwriting only the fields this
 * form owns — and keeps every top-level key besides `feed` (profile,
 * customProfile, publish, linking, a repo's own `_comment*` keys...)
 * completely untouched. `rawConfig` is the raw parsed JSON (not narrowed
 * to OteConfig), so unknown keys survive round-trip regardless of whether
 * the editor's own types know about them.
 */
export function toOteConfigJson(
  state: FeedConfigState,
  rawConfig: Record<string, unknown> | null,
): Record<string, unknown> {
  const rawFeed = (rawConfig?.feed as Record<string, unknown> | undefined) ?? {};
  const feed: Record<string, unknown> = { ...rawFeed };
  const set = (key: string, value: string) => {
    if (value !== "") feed[key] = value;
    else delete feed[key];
  };

  set("title", state.title);
  set("description", state.description);
  set("url", state.url);
  set("license", state.license);
  set("licenseUrl", state.licenseUrl);
  set("textLanguage", state.textLanguage);

  const organizers = state.organizers.filter((row) => !isRowEmpty(row)).map(cleanRow);
  if (organizers.length > 0) feed.organizers = organizers;
  else delete feed.organizers;

  return { ...(rawConfig ?? {}), feed };
}
