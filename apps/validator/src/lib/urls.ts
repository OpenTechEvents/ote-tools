/**
 * The URLs an OTE document points at, and what each one is *for*.
 *
 * Why this exists: a registered feed passed validation with every image
 * broken — the URLs carried a `www.` the server does not answer on. The
 * document was correct; no client could show it. Nothing in the ecosystem
 * noticed, because a schema cannot know whether an address resolves.
 *
 * Two rules shape what is collected:
 *
 * 1. **`id` is never collected.** An OTE `id` is an identifier that happens
 *    to be shaped like a URL; the spec says in so many words that it does not
 *    have to resolve to anything. Fetching them would manufacture "broken
 *    links" out of documents that are exactly right.
 * 2. **The kind travels with the URL.** A dead image and a dead registration
 *    page are different problems for whoever consumes the feed, and a flat
 *    list of failed URLs makes the reader work that out for themselves.
 *
 * Pure and DOM-free: the checking itself happens in the Worker (a browser
 * cannot tell a cross-origin failure from a missing CORS header), and this
 * module only says what to check.
 */

/** What a URL is for, which is what a broken one costs. */
export type UrlKind =
  /** `image[]`, `imageEntry.url` — shown next to the event. */
  | "image"
  /** `url` on the event, feed, organizer, partOf, cfp, source, eligibility. */
  | "page"
  /** `offers[].url`, `offers[].waitlistUrl` — how somebody signs up. */
  | "registration"
  /** `location.onlineUrl` — the meeting itself. Often gated; usually unverifiable. */
  | "online"
  /** `licenseUrl`, and `license` when it is a URL rather than an SPDX id. */
  | "license";

/** One URL found in the document, with every place it appears. */
export interface DocumentUrl {
  url: string;
  kind: UrlKind;
  /** RFC 6901 pointers to each occurrence — the same URL is often repeated. */
  pointers: string[];
}

/** Property names that hold a URL, and the kind each one means. */
const URL_KEYS: Record<string, UrlKind> = {
  url: "page",
  onlineUrl: "online",
  waitlistUrl: "registration",
  licenseUrl: "license",
  license: "license",
  image: "image",
};

/**
 * Property names whose `url` means something more specific than "page". Keyed
 * by the property that contains them, since `url` alone cannot say.
 */
const CONTAINER_KINDS: Record<string, UrlKind> = {
  offers: "registration",
  image: "image",
  imageTranslations: "image",
};

/** Keys never collected: identifiers, not addresses. See rule 1 above. */
const NEVER_FETCHED = new Set(["id"]);

const escapePointer = (segment: string): string =>
  segment.replace(/~/g, "~0").replace(/\//g, "~1");

/** http(s) only — `mailto:` and the rest are not this checker's business. */
function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Every http(s) URL in the document, deduplicated, with the kind it plays and
 * the pointers it appears at.
 *
 * Deduplication happens here rather than in the checker: one feed repeats its
 * organizer's URL on every event, and a hundred events must not become a
 * hundred requests to the same server.
 */
export function collectDocumentUrls(json: unknown): DocumentUrl[] {
  const found = new Map<string, DocumentUrl>();

  const add = (url: string, kind: UrlKind, pointer: string): void => {
    const existing = found.get(url);
    if (existing) {
      existing.pointers.push(pointer);
      // The first kind wins, except that an image seen anywhere stays an
      // image: it is the kind whose breakage is visible to every reader.
      if (kind === "image") existing.kind = "image";
      return;
    }
    found.set(url, { url, kind, pointers: [pointer] });
  };

  const walk = (node: unknown, pointer: string, kind: UrlKind | null): void => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        if (kind && isHttpUrl(item)) add(item, kind, `${pointer}/${index}`);
        else walk(item, `${pointer}/${index}`, kind);
      });
      return;
    }
    if (typeof node !== "object" || node === null) return;

    for (const [key, value] of Object.entries(node)) {
      const here = `${pointer}/${escapePointer(key)}`;
      if (NEVER_FETCHED.has(key)) continue;

      const container = CONTAINER_KINDS[key];
      const keyKind = URL_KEYS[key];

      if (keyKind && isHttpUrl(value)) {
        // A bare `url` takes its meaning from what contains it — inside
        // `offers` it is how somebody registers, not a page. Every other key
        // (`onlineUrl`, `licenseUrl`, …) already says what it is.
        // `license` is usually an SPDX identifier, which isHttpUrl rejects.
        add(value, key === "url" ? (container ?? kind ?? keyKind) : keyKind, here);
        continue;
      }
      // Inside `offers` or `image`, a nested `url` inherits that meaning;
      // anywhere else a nested object starts fresh.
      walk(value, here, container ?? (keyKind === "image" ? "image" : null));
    }
  };

  walk(json, "", null);
  return [...found.values()];
}
