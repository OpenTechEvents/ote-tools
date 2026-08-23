import { markdownToPlainText } from "./markdown.js";
import { wallClockWithOffset } from "./timezone.js";
import type {
  OteAttendanceMode,
  OteEvent,
  OteEventStatus,
  OteFeed,
  OteImageEntry,
  OteOffer,
  OteOrganizer,
} from "./types.js";

export { markdownToPlainText } from "./markdown.js";
export { wallClockWithOffset } from "./timezone.js";
export type {
  OteAttendanceMode,
  OteCfp,
  OteEligibility,
  OteEvent,
  OteEventStatus,
  OteFeed,
  OteGeo,
  OteImageEntry,
  OteLocation,
  OteOffer,
  OteOrganizer,
  OtePartOf,
  OteSource,
} from "./types.js";

/** A JSON-LD node: plain JSON, ready for `JSON.stringify`. */
export type JsonLdNode = Record<string, unknown>;

export interface JsonLdOptions {
  /**
   * Derive a UTC offset for `startDate`/`endDate` from the event's IANA
   * `timezone` (`2026-06-11T18:30` → `2026-06-11T18:30+02:00`). Default
   * `true`. Set `false` to emit the bare wall clock, which schema.org reads
   * as local to the event's location.
   */
  offsets?: boolean;
  /**
   * Render a Markdown `description` to plain text, since schema.org
   * `description` is plain text. Default `true`. Set `false` to pass the
   * OTE value through byte for byte.
   */
  plainTextDescription?: boolean;
}

const SCHEMA_CONTEXT = "https://schema.org";

const ATTENDANCE_MAP: Record<OteAttendanceMode, string> = {
  "in-person": "https://schema.org/OfflineEventAttendanceMode",
  online: "https://schema.org/OnlineEventAttendanceMode",
  hybrid: "https://schema.org/MixedEventAttendanceMode",
};

/**
 * OTE status → schema.org eventStatus. `tentative` is deliberately absent:
 * schema.org has no equivalent (its enum is Scheduled/Cancelled/Postponed/
 * Rescheduled/MovedOnline), and mapping it to `EventScheduled` would state
 * something the organizer did not — a tentative event would be advertised to
 * search engines as confirmed. Absent field, per the connector convention.
 */
const STATUS_MAP: Partial<Record<OteEventStatus, string>> = {
  scheduled: "https://schema.org/EventScheduled",
  cancelled: "https://schema.org/EventCancelled",
  postponed: "https://schema.org/EventPostponed",
  rescheduled: "https://schema.org/EventRescheduled",
  "moved-online": "https://schema.org/EventMovedOnline",
};

const AVAILABILITY_MAP: Record<NonNullable<OteOffer["availability"]>, string> = {
  "in-stock": "https://schema.org/InStock",
  "sold-out": "https://schema.org/SoldOut",
};

function organizerNode(organizer: OteOrganizer): JsonLdNode {
  const node: JsonLdNode = {
    "@type": organizer.type === "person" ? "Person" : "Organization",
    name: organizer.name,
  };
  if (organizer.url) node.url = organizer.url;
  if (organizer.email) node.email = organizer.email;
  return node;
}

function imageNode(image: string | OteImageEntry): string | JsonLdNode {
  if (typeof image === "string") return image;
  if (!image.alt) return image.url;
  // schema.org has no "alt" property; `caption` is the closest analog and
  // what Google reads — the same mapping @opentechevents/import-jsonld uses
  // in the inverse direction.
  return { "@type": "ImageObject", url: image.url, caption: image.alt };
}

function offerNode(offer: OteOffer): JsonLdNode {
  const node: JsonLdNode = { "@type": "Offer" };
  if (offer.name) node.name = offer.name;
  if (offer.price !== undefined) node.price = offer.price;
  if (offer.currency) node.priceCurrency = offer.currency;
  if (offer.url) node.url = offer.url;
  if (offer.availability) node.availability = AVAILABILITY_MAP[offer.availability];
  // OTE's opensAt/closesAt are instants (they already carry an offset), so
  // they map straight onto validFrom/validThrough.
  if (offer.opensAt) node.validFrom = offer.opensAt;
  if (offer.closesAt) node.validThrough = offer.closesAt;
  return node;
}

const isUrl = (value: string): boolean => /^https?:\/\//i.test(value.trim());

/**
 * OTE `location` → schema.org `location`. A hybrid event yields **both** a
 * Place and a VirtualLocation, as an array — schema.org's own modelling for
 * MixedEventAttendanceMode.
 */
function locationNodes(event: OteEvent): (string | JsonLdNode)[] {
  const nodes: JsonLdNode[] = [];
  const { venue, geo, onlineUrl } = event.location ?? {};

  // A `venue` that is a URL is a meeting link, not a place. Feeds get these
  // from ICS imports, where the organizer put the join URL in LOCATION —
  // valid OTE, but mapping it onto `Place.address` states that a room exists
  // at "https://meet.example/x", which is exactly the kind of nonsense a
  // structured-data validator flags. It becomes a VirtualLocation instead,
  // and is dropped when the event already declares an `onlineUrl` rather
  // than emitting the same link twice.
  if (venue !== undefined && isUrl(venue)) {
    if (onlineUrl === undefined) nodes.push({ "@type": "VirtualLocation", url: venue.trim() });
    if (onlineUrl) nodes.push({ "@type": "VirtualLocation", url: onlineUrl });
    if (geo) {
      nodes.push({
        "@type": "Place",
        geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lon },
      });
    }
    return nodes;
  }

  if (venue || geo) {
    const place: JsonLdNode = { "@type": "Place" };
    if (venue) {
      // OTE's `venue` is one free-text string ("Campus Madrid, Calle de
      // Moreno Nieto 2, Madrid"), with no structure to split it into
      // streetAddress/addressLocality/postalCode. It goes to `address` as
      // text (which schema.org allows) rather than being parsed apart —
      // splitting on commas would invent an address the organizer never
      // stated. `name` carries the same string so the venue still has a
      // label in results that show one.
      place.name = venue;
      place.address = venue;
    }
    if (geo) {
      place.geo = { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lon };
    }
    nodes.push(place);
  }
  if (onlineUrl) {
    nodes.push({ "@type": "VirtualLocation", url: onlineUrl });
  }
  return nodes;
}

/**
 * Converts one OTE event into a schema.org `Event` node.
 *
 * `withContext` adds `@context` — set it for a standalone event, omit it for
 * a node nested under a document that already declares one.
 */
function eventNode(
  event: OteEvent,
  options: JsonLdOptions,
  withContext: boolean,
): JsonLdNode {
  const offsets = options.offsets ?? true;
  const plainText = options.plainTextDescription ?? true;
  const node: JsonLdNode = {};
  if (withContext) node["@context"] = SCHEMA_CONTEXT;
  node["@type"] = "Event";
  // OTE's `id` is a stable URI, not necessarily a fetchable page — exactly
  // what @id means in JSON-LD. `url` (when present) is the page.
  node["@id"] = event.id;
  node.name = event.name;
  if (event.url) node.url = event.url;
  if (event.description) {
    node.description = plainText ? markdownToPlainText(event.description) : event.description;
  }

  node.startDate = offsets ? wallClockWithOffset(event.startDate, event.timezone) : event.startDate;
  if (event.endDate) {
    node.endDate = offsets ? wallClockWithOffset(event.endDate, event.timezone) : event.endDate;
  }

  if (event.attendanceMode) node.eventAttendanceMode = ATTENDANCE_MAP[event.attendanceMode];
  const status = event.status ? STATUS_MAP[event.status] : undefined;
  if (status) node.eventStatus = status;

  const locations = locationNodes(event);
  if (locations.length === 1) node.location = locations[0];
  else if (locations.length > 1) node.location = locations;

  if (event.languages && event.languages.length > 0) node.inLanguage = event.languages;
  if (event.tags && event.tags.length > 0) node.keywords = event.tags;
  if (event.organizers && event.organizers.length > 0) {
    const organizers = event.organizers.map(organizerNode);
    node.organizer = organizers.length === 1 ? organizers[0] : organizers;
  }
  if (event.image && event.image.length > 0) node.image = event.image.map(imageNode);
  if (event.offers && event.offers.length > 0) {
    const offers = event.offers.map(offerNode);
    node.offers = offers.length === 1 ? offers[0] : offers;
  }
  if (event.partOf) {
    const superEvent: JsonLdNode = { "@type": "Event", "@id": event.partOf.id };
    if (event.partOf.name) superEvent.name = event.partOf.name;
    if (event.partOf.url) superEvent.url = event.partOf.url;
    node.superEvent = superEvent;
  }
  // `cfp`, `eligibility`, `license`, `source` and `updatedAt` have no
  // schema.org/Event equivalent and are not emitted — see the README's
  // mapping table. A connector never invents data.
  return node;
}

/**
 * Whether the event has no physical address to put in `location`.
 *
 * This is not a mapping question but an eligibility one, and it belongs next
 * to the mapping so every consumer can ask it: **Google's event rich results
 * require a physical location** ("Virtual experiences that have no
 * real-world component aren't supported"). An online-only event still gets
 * correct, useful JSON-LD from this package — other consumers read it — but
 * it will never win a Google event rich result, no matter how it is marked
 * up. Tools that promise SEO should say so instead of letting the organizer
 * discover it from a red validator.
 *
 * A `venue` that is a URL does not count: it is a meeting link, not an
 * address (see `locationNodes`). Coordinates alone do not count either —
 * Google asks for `location.address` specifically.
 */
export function isOnlineOnly(event: OteEvent): boolean {
  const venue = event.location?.venue;
  return venue === undefined || isUrl(venue);
}

/**
 * Converts one **valid** OTE event into a standalone schema.org `Event`
 * JSON-LD node, `@context` included.
 *
 * Pure and deterministic: no network, no filesystem, no clock. It assumes the
 * event is valid; validate the feed first with `@opentechevents/validate`.
 */
export function eventToJsonLd(event: OteEvent, options: JsonLdOptions = {}): JsonLdNode {
  return eventNode(event, options, true);
}

/**
 * Converts a **valid** OTE feed into one JSON-LD document holding every
 * event, as a `@graph`. This is the form to embed on a page that shows the
 * events themselves.
 *
 * A feed with exactly one event still produces a `@graph` of one, so the
 * output shape does not depend on how many events the feed happens to hold.
 * For a single event, use `eventToJsonLd`.
 */
export function feedToJsonLd(feed: OteFeed, options: JsonLdOptions = {}): JsonLdNode {
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": feed.events.map((event) => eventNode(event, options, false)),
  };
}

/**
 * Converts a **valid** OTE feed into a schema.org `ItemList` of events — the
 * shape Google reads for an event *listing* page, where each entry links to
 * its own detail page.
 *
 * `ListItem.url` is only set for events that have a `url`: it must point at
 * the event's own page, and OTE's `id` is a stable URI that is not
 * necessarily fetchable.
 */
export function feedToItemList(feed: OteFeed, options: JsonLdOptions = {}): JsonLdNode {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "ItemList",
    name: feed.title,
    numberOfItems: feed.events.length,
    itemListElement: feed.events.map((event, index) => {
      const listItem: JsonLdNode = { "@type": "ListItem", position: index + 1 };
      if (event.url) listItem.url = event.url;
      listItem.item = eventNode(event, options, false);
      return listItem;
    }),
  };
}

/**
 * Wraps a JSON-LD document in a `<script type="application/ld+json">` block,
 * ready to paste into a page's HTML.
 *
 * Every `<` in the JSON is escaped as `\u003c` (valid JSON, and JSON-LD
 * consumers decode it transparently). That is what makes the block safe to
 * embed: an event whose description contains `</script>` would otherwise end
 * the script element early and inject the rest as live markup.
 */
export function toJsonLdScript(document: unknown, indent = 2): string {
  const json = JSON.stringify(document, null, indent).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">\n${json}\n</script>`;
}
