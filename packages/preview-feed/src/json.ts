import { cheapestPrice, detailRows, eventLocation, firstImage } from "./format.js";
import type { PreviewEventCfp, PreviewEventEligibility, PreviewEventPartOf, PreviewFeed } from "./types.js";

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
  offers?: Array<{ name?: string; price?: number; currency?: string; url?: string }>;
  organizers?: Array<{ name: string }>;
  partOf?: { id?: string; type?: "series" | "multipart"; name?: string; url?: string };
  eligibility?: PreviewEventEligibility;
  cfp?: PreviewEventCfp;
}

// The OTE schema requires partOf.id and defaults partOf.type to "series", but
// this input is unvalidated — drop a partOf that's missing its identity
// rather than propagating a group key that can never actually group anything.
function normalizePartOf(partOf: OteJsonEvent["partOf"]): PreviewEventPartOf | undefined {
  if (!partOf?.id) return undefined;
  return { id: partOf.id, type: partOf.type === "multipart" ? "multipart" : "series", name: partOf.name, url: partOf.url };
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
      const price = cheapestPrice(event.offers);
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
          ["Price", price && `${price.amount}${price.currency ? ` ${price.currency}` : ""}`],
          ["Organizer", organizerName],
        ]),
      };
    }),
  };
}

export function jsonToPreviewFeed(text: string): PreviewFeed {
  return oteJsonToPreviewFeed(JSON.parse(text) as OteJsonPreviewInput);
}
