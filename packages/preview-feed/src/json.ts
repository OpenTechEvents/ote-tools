import { cheapestPrice, detailRows, eventLocation, firstImage } from "./format.js";
import type { PreviewFeed } from "./types.js";

export function jsonToPreviewFeed(text: string): PreviewFeed {
  const json = JSON.parse(text) as {
    title?: string;
    description?: string;
    license?: string;
    events?: Array<{
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
      offers?: Array<{ name?: string; price?: number; currency?: string }>;
      organizers?: Array<{ name: string }>;
    }>;
  };
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
        name: event.name ?? "(untitled event)",
        startDate: event.startDate,
        endDate: event.endDate,
        timezone: event.timezone,
        location: eventLocation(event),
        link: event.url ?? event.location?.onlineUrl,
        description: event.description,
        image,
        price,
        organizerName,
        tags: event.tags,
        attendanceMode: event.attendanceMode,
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
