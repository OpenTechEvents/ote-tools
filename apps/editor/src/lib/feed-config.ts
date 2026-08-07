import { cleanRow, isRowEmpty } from "./event-json.js";
import type { OrganizerRow, OteConfig, OteEvent } from "./types.js";

/**
 * Flat, all-string form model for ote.config.json — same "" = unset
 * convention as FormState. `feed`'s own sub-fields plus, at the top level,
 * `profile`/`customProfileFields` (config.profile / config.customProfile.
 * fields — outside `feed` in the file, kept here for one shared save
 * action; see toOteConfigJson for exactly how each round-trips).
 */
export interface FeedConfigState {
  title: string;
  description: string;
  url: string;
  license: string;
  licenseUrl: string;
  textLanguage: string;
  organizers: OrganizerRow[];
  /** BCP 47 tag → { title?, description? } in that language. */
  translations: Record<string, { title: string; description: string }>;
  /** "meetup" | "conference" | "all" | "custom" | "" (unset — resolveProfile falls back to "all"). */
  profile: string;
  /**
   * Only meaningful when profile === "custom". Kept exactly as read from
   * the file, unfiltered — a fork's config can list an id this editor's
   * FIELD_REGISTRY doesn't know about (a newer field this build predates),
   * and saving must not silently drop it just because the checklist UI has
   * no row for it.
   */
  customProfileFields: string[];
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
    translations: {},
    profile: "",
    customProfileFields: [],
  };
}

/** Reads the `feed` block into form state; a missing config or feed block just yields the empty draft (never throws — same convention as fromEventJson). */
export function fromOteConfig(config: OteConfig | null): FeedConfigState {
  const feed = config?.feed;
  // customProfile.fields wins over profile, same precedence resolveProfile
  // itself uses — so "custom" is what the picker should show as active.
  const customFields = config?.customProfile?.fields;
  const hasCustom = Array.isArray(customFields);
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
    translations: Object.fromEntries(
      Object.entries(feed?.translations ?? {}).map(([lang, entry]) => [
        lang,
        { title: entry.title ?? "", description: entry.description ?? "" },
      ]),
    ),
    profile: hasCustom ? "custom" : (config?.profile ?? ""),
    customProfileFields: hasCustom ? [...customFields] : [],
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

  const translations: Record<string, unknown> = {};
  for (const [lang, entry] of Object.entries(state.translations)) {
    const wrapped: Record<string, string> = {};
    if (entry.title) wrapped.title = entry.title;
    if (entry.description) wrapped.description = entry.description;
    if (Object.keys(wrapped).length > 0) translations[lang] = wrapped;
  }
  if (Object.keys(translations).length > 0) feed.translations = translations;
  else delete feed.translations;

  const result: Record<string, unknown> = { ...(rawConfig ?? {}), feed };
  // customProfile wins over profile per resolveProfile's own precedence —
  // leaving a stale profile behind when switching to "custom" (or vice
  // versa) would silently do nothing at read time, which is confusing for
  // anyone hand-reading the file later. profile === "" (never touched, or
  // explicitly cleared) drops both, same "absent stays absent" convention
  // every other field here already follows.
  if (state.profile === "custom") {
    result.customProfile = { fields: state.customProfileFields };
    delete result.profile;
  } else if (state.profile !== "") {
    result.profile = state.profile;
    delete result.customProfile;
  } else {
    delete result.profile;
    delete result.customProfile;
  }

  return result;
}

/**
 * True when 3+ distinct organizer sets appear among events that declare
 * their own `organizers` — the spec's own signal that a feed is (or is
 * becoming) an aggregator, where `feed.organizers` must stay empty (filling
 * it would misattribute every event to whoever runs the feed, not who
 * actually organizes each one). Deliberately conservative: a single
 * co-organized event alongside a one-community feed — the normal case the
 * spec itself documents (repeat the feed's own community plus the guest) —
 * produces exactly 2 distinct sets (the feed's own + the one guest event's),
 * not 3; this never fires on that case.
 */
export function likelyAggregatorFeed(events: readonly OteEvent[]): boolean {
  const signatures = new Set<string>();
  for (const event of events) {
    if (!event.organizers || event.organizers.length === 0) continue;
    signatures.add([...event.organizers].map((o) => o.name).sort().join("|"));
  }
  return signatures.size >= 3;
}
