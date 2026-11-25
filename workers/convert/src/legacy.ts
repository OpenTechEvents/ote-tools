/**
 * Before 0.3, arbitrary extensions were legal and several names later became
 * standardized with different shapes. Ignore these extensions instead of
 * interpreting an old publisher's `image` or `offers` as the newer fields.
 */
const eventFields = new Set([
  "specVersion", "id", "url", "name", "description", "timezone", "startDate",
  "endDate", "license", "location", "attendanceMode", "languages", "status", "source",
]);
const feedFields = new Set([
  "specVersion", "title", "description", "url", "license", "licenseUrl", "updatedAt", "events",
]);

function pick(value: Record<string, unknown>, keys: Set<string>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).filter(([key]) => keys.has(key)));
}

export function normalizeLegacy(document: Record<string, unknown>, kind: "feed" | "event", version: string): Record<string, unknown> {
  if (version !== "0.1.0" && version !== "0.2.0") return document;
  const fields = new Set(eventFields);
  if (version === "0.2.0") { fields.add("tags"); fields.add("updatedAt"); }
  if (kind === "event") return pick(document, fields);
  const feed = pick(document, feedFields);
  if (Array.isArray(feed.events)) feed.events = feed.events.map(event => pick(event as Record<string, unknown>, fields));
  return feed;
}
