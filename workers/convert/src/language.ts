type ObjectValue = Record<string, unknown>;
const isObject = (value: unknown): value is ObjectValue => typeof value === "object" && value !== null && !Array.isArray(value);

/** Apply only translations actually supplied by the publisher, field by field. */
function translated(value: ObjectValue, fields: string[], language: string): ObjectValue {
  const copy = { ...value };
  if (typeof value.textLanguage === "string" && value.textLanguage.toLowerCase() === language.toLowerCase()) return copy;
  const translations = value.translations;
  if (!isObject(translations)) return copy;
  const requested = language.toLowerCase();
  const primary = requested.split("-")[0];
  const entries = Object.entries(translations);
  const match = entries.find(([key]) => key.toLowerCase() === requested)
    ?? (requested !== primary ? entries.find(([key]) => key.toLowerCase() === primary) : undefined);
  if (!match || !isObject(match[1])) return copy;
  const entry = match[1];
  for (const field of fields) if (typeof entry[field] === "string") copy[field] = entry[field];
  // A partial translation can mix languages. Only declare the selected
  // language when every present primary field has a translated counterpart.
  const translatedAll = fields.every(field => typeof value[field] !== "string" || typeof entry[field] === "string");
  if (translatedAll) copy.textLanguage = match[0];
  else delete copy.textLanguage;
  return copy;
}

/**
 * Inheritance is already resolved by the caller (`resolveEventInheritance`,
 * from `@opentechevents/validate`), so `translated` below compares against
 * each event's effective `textLanguage`.
 *
 * This function used to fill `textLanguage` and `organizers` itself: a
 * second, partial copy of the inheritance rules — 2 of the 4 inheritable
 * fields — living in a file about translation, and the reason the hosted
 * output differed from a local export of the same feed.
 */
function eventInLanguage(event: ObjectValue, language: string): ObjectValue {
  const result = translated({ ...event }, ["name", "description"], language);
  for (const [field, subfield] of [["image", "alt"], ["offers", "name"], ["recordings", "title"]]) {
    const values = result[field];
    if (Array.isArray(values)) result[field] = values.map(value => isObject(value) ? translated(value, [subfield!], language) : value);
  }
  for (const [field, subfield] of [["eligibility", "note"], ["partOf", "name"]]) {
    const value = result[field];
    if (isObject(value)) result[field] = translated(value, [subfield!], language);
  }
  return result;
}

export function selectLanguage(document: ObjectValue, kind: "feed" | "event", language?: string): ObjectValue {
  if (kind === "event") return language ? eventInLanguage(document, language) : document;
  const result = language ? translated(document, ["title", "description"], language) : { ...document };
  if (Array.isArray(document.events)) {
    result.events = document.events.map(event => isObject(event)
      ? eventInLanguage(event, language ?? "") : event);
  }
  return result;
}

/** Text languages and translation keys, never the event's spoken languages. */
export function availableTextLanguages(feed: ObjectValue): string[] {
  const tags = new Map<string, string>();
  const add = (tag: unknown) => {
    if (typeof tag !== "string") return;
    try {
      const canonical = Intl.getCanonicalLocales(tag)[0];
      if (canonical) tags.set(canonical.toLowerCase(), canonical);
    } catch { /* A tag unsupported by this runtime is not selectable. */ }
  };
  const inspect = (value: unknown) => {
    if (!isObject(value)) return;
    add(value.textLanguage);
    if (isObject(value.translations)) Object.keys(value.translations).forEach(add);
  };
  inspect(feed);
  if (Array.isArray(feed.events)) for (const event of feed.events) {
    if (!isObject(event)) continue;
    inspect(event);
    for (const field of ["image", "offers", "recordings"]) {
      if (Array.isArray(event[field])) event[field].forEach(inspect);
    }
    inspect(event.eligibility);
    inspect(event.partOf);
  }
  return [...tags.values()].sort((a, b) => a.localeCompare(b));
}
