/**
 * What this tool remembers between visits.
 *
 * The point is the pinned event. Publishing one event to eight destinations
 * means eight visits to this page, and re-choosing the event each time is the
 * kind of small friction that quietly stops people finishing the list. So the
 * choice is context, kept until it is changed or until the event leaves the
 * feed.
 *
 * Every access is guarded: some runtimes expose `localStorage` and then throw
 * on use (Safari's private mode, an iframe with storage blocked), and losing a
 * preference is never worth losing the tool. Same idiom as
 * `apps/editor/src/lib/recent-repos.ts`.
 */

const PREFIX = "ote-publish";

export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function backing(): Storage | null {
  try {
    const store = globalThis.localStorage;
    // Touch it: merely reading the property succeeds in runtimes that then
    // throw on the first real operation.
    store.getItem(`${PREFIX}-probe`);
    return store;
  } catch {
    return null;
  }
}

function read(key: string): string | null {
  try {
    return backing()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  try {
    const store = backing();
    if (!store) return;
    if (value === null) store.removeItem(key);
    else store.setItem(key, value);
  } catch {
    /* A preference that cannot be saved is not an error worth showing. */
  }
}

/**
 * Per-feed keys. Two forks open in two tabs are two different organizers'
 * worth of context, and an event id from one feed means nothing in the other.
 */
export function feedKey(feedUrl: string): string {
  return feedUrl.replace(/[?#].*$/, "");
}

// --- the pinned event -------------------------------------------------------

export function readPinnedEvent(feedUrl: string): string | null {
  return read(`${PREFIX}-event:${feedKey(feedUrl)}`);
}

export function writePinnedEvent(feedUrl: string, eventId: string | null): void {
  write(`${PREFIX}-event:${feedKey(feedUrl)}`, eventId);
}

/**
 * Which event to open on: the one pinned last time if it is still in the feed,
 * otherwise the next one that has not happened yet, otherwise the most recent.
 *
 * Never "all of them". A tool whose default is the whole feed reads as a mass
 * broadcaster, and that is not what publishing an event is.
 */
export function resolvePinnedEvent(
  events: { id: string; startDate: string }[],
  storedId: string | null,
  now: Date = new Date(),
): string | null {
  if (events.length === 0) return null;
  if (storedId !== null && events.some((event) => event.id === storedId)) return storedId;

  const today = now.toISOString().slice(0, 10);
  const upcoming = events
    .filter((event) => event.startDate.slice(0, 10) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (upcoming.length > 0) return upcoming[0]!.id;

  const past = [...events].sort((a, b) => b.startDate.localeCompare(a.startDate));
  return past[0]!.id;
}

// --- favourites -------------------------------------------------------------

const FAVOURITES = `${PREFIX}-favourites`;

/** Favourites are ordered: the row on the dashboard is the organizer's own. */
export function readFavourites(): string[] {
  const raw = read(FAVOURITES);
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function writeFavourites(ids: string[]): void {
  write(FAVOURITES, ids.length === 0 ? null : JSON.stringify(ids));
}

/** Adds to the end, so the row keeps the order they were starred in. */
export function toggleFavourite(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((other) => other !== id) : [...ids, id];
}

// --- theme ------------------------------------------------------------------

export type Theme = "light" | "dark" | "system";

export function readTheme(): Theme {
  const raw = read(`${PREFIX}-theme`);
  return raw === "light" || raw === "dark" ? raw : "system";
}

export function writeTheme(theme: Theme): void {
  write(`${PREFIX}-theme`, theme === "system" ? null : theme);
}
