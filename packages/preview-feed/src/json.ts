import { attendancePrice, detailRows, eventLocation, firstImage } from "./format.js";
import type {
  PreviewEventCfp,
  PreviewEventEligibility,
  PreviewEventPartOf,
  PreviewFeed,
  PreviewOffer,
  PreviewPrice,
} from "./types.js";

export interface OteJsonEvent {
  id?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  timezone?: string;
  location?: { venue?: string; onlineUrl?: string };
  url?: string;
  description?: string;
  status?: string;
  attendanceMode?: "in-person" | "online" | "hybrid";
  languages?: string[];
  tags?: string[];
  updatedAt?: string;
  source?: unknown;
  image?: Array<string | { url: string; alt?: string }>;
  offers?: PreviewOffer[];
  organizers?: Array<{ name: string }>;
  partOf?: {
    id?: string;
    type?: "series" | "multipart";
    name?: string;
    url?: string;
    offers?: PreviewOffer[];
  };
  eligibility?: PreviewEventEligibility;
  cfp?: PreviewEventCfp;
}

// The OTE schema requires partOf.id and defaults partOf.type to "series", but
// this input is unvalidated — drop a partOf that's missing its identity
// rather than propagating a group key that can never actually group anything.
function normalizePartOf(partOf: OteJsonEvent["partOf"]): PreviewEventPartOf | undefined {
  if (!partOf?.id) return undefined;
  return {
    id: partOf.id,
    type: partOf.type === "multipart" ? "multipart" : "series",
    name: partOf.name,
    url: partOf.url,
    // Carried through, not dropped: it is the set's shared admission, and a
    // part with no offers of its own is priced by it (D032). Dropping it left
    // even a scope-aware renderer with nothing to fall back to.
    offers: partOf.offers,
  };
}

/** The detail row for a price, which has to carry what the number *is*. */
function priceRow(price: PreviewPrice | undefined): string | undefined {
  if (!price || price.amount === undefined) return undefined;
  const amount = `${price.amount}${price.currency ? ` ${price.currency}` : ""}`;
  switch (price.basis) {
    case "add-on-only":
      return `+${amount} (additional charge, total unknown)`;
    case "shared":
      return `${amount} (event admission)`;
    case "shared-plus-add-on":
      return `${amount} (event admission + this part)`;
    case "own":
      return amount;
  }
}

export interface OteJsonFeed {
  title?: string;
  description?: string;
  license?: string;
  events?: OteJsonEvent[];
}

export type OteJsonPreviewInput = OteJsonFeed | OteJsonEvent[];

export function oteJsonToPreviewFeed(input: OteJsonPreviewInput): PreviewFeed {
  const json = Array.isArray(input) ? { events: input } : input;
  if (!Array.isArray(json.events)) throw new Error("feed.json has no events array");
  return {
    title: json.title,
    description: json.description,
    license: json.license,
    events: json.events.map((event) => {
      const image = firstImage(event.image);
      const price = attendancePrice({ offers: event.offers, partOf: event.partOf });
      const organizerName = event.organizers?.[0]?.name;
      return {
        id: event.id,
        name: event.name ?? "(untitled event)",
        startDate: event.startDate,
        endDate: event.endDate,
        timezone: event.timezone,
        location: eventLocation(event),
        locationLink: event.location?.onlineUrl,
        link: event.url ?? event.location?.onlineUrl,
        description: event.description,
        image,
        price,
        organizerName,
        tags: event.tags,
        attendanceMode: event.attendanceMode,
        updatedAt: event.updatedAt,
        partOf: normalizePartOf(event.partOf),
        eligibility: event.eligibility,
        cfp: event.cfp,
        details: detailRows([
          ["ID", event.id],
          ["Status", event.status],
          ["Timezone", event.timezone],
          ["Attendance", event.attendanceMode],
          ["Languages", event.languages],
          ["Tags", event.tags],
          ["Updated", event.updatedAt],
          ["Source", event.source],
          ["Image", image?.url],
          // The detail row says the same thing the badge does, including when
          // the number is a surcharge rather than a total: a row reading
          // "20 EUR" for a part whose admission is unpriced is the false
          // answer D032 exists to prevent, in the one view that looks
          // authoritative.
          ["Price", priceRow(price)],
          ["Organizer", organizerName],
        ]),
      };
    }),
  };
}

export function jsonToPreviewFeed(text: string): PreviewFeed {
  return oteJsonToPreviewFeed(JSON.parse(text) as OteJsonPreviewInput);
}
