import { htmlToMarkdown, looksLikeHtml } from "@opentechevents/import-ics";

import type {
  HtmlToEventsOptions,
  ImportResult,
  ImportWarning,
  OteAddress,
  OteAttendanceMode,
  OteEventStatus,
  OteImageEntry,
  OteOffer,
  OteOrganizer,
  OtePartOf,
  OteRecordingEntry,
  OteSpeaker,
  PartialOteEvent,
} from "./types.js";

export type {
  HtmlToEventsOptions,
  ImportResult,
  ImportWarning,
  OteAddress,
  OteAttendanceMode,
  OteEventStatus,
  OteGeo,
  OteImageEntry,
  OteLocation,
  OteOffer,
  OteOrganizer,
  OtePartOf,
  OteRecordingEntry,
  OteSpeaker,
  PartialOteEvent,
} from "./types.js";

type JsonObject = Record<string, unknown>;

const SCRIPT_RE =
  /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

/** All application/ld+json payloads in the page, still as text. */
function extractJsonLdBlocks(html: string): string[] {
  const blocks: string[] = [];
  SCRIPT_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SCRIPT_RE.exec(html)) !== null) blocks.push(match[1]);
  return blocks;
}

/**
 * schema.org Event and its subtypes. Anything `*Event` counts (BusinessEvent,
 * SocialEvent, ScreeningEvent…); the set lists the subtypes without the
 * suffix. `@type` values may be bare names or full schema.org URLs.
 */
const EVENT_TYPES = new Set([
  "Event",
  "EventSeries",
  "Festival",
  "Hackathon",
  "CourseInstance",
]);

function isEventType(node: JsonObject): boolean {
  const raw = node["@type"];
  const types = Array.isArray(raw) ? raw : [raw];
  return types.some((t) => {
    if (typeof t !== "string") return false;
    const bare = t.replace(/^https?:\/\/(www\.)?schema\.org\//i, "");
    return EVENT_TYPES.has(bare) || bare.endsWith("Event");
  });
}

/**
 * Walks a parsed JSON-LD document and collects every Event node, wherever it
 * sits: top level, inside an array, under `@graph`, or nested in wrappers
 * like ItemList → ListItem → item (Luma and guild.host landings do this).
 */
function collectEventNodes(value: unknown, out: JsonObject[]): void {
  if (Array.isArray(value)) {
    for (const entry of value) collectEventNodes(entry, out);
    return;
  }
  if (typeof value !== "object" || value === null) return;
  const node = value as JsonObject;
  if (isEventType(node)) {
    out.push(node);
    return; // sub-properties of an event (subEvent aside) are its own data
  }
  for (const child of Object.values(node)) collectEventNodes(child, out);
}

const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;

const asNumber = (value: unknown): number | undefined => {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
};

/** Bare enum name from a schema.org value ("https://schema.org/X" or "X"). */
const bareEnum = (value: string): string =>
  value.replace(/^https?:\/\/(www\.)?schema\.org\//i, "");

const CANONICAL_RE =
  /<link\b(?=[^>]*\brel\s*=\s*["']?canonical["']?)[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/i;

/**
 * The page's own `<link rel="canonical">`, when it has one.
 *
 * Needed because an Event's JSON-LD often omits `url` — the page is the url,
 * so saying it twice feels redundant to whoever wrote the markup. Reading the
 * canonical link recovers it from the HTML the caller already handed over,
 * which is why this needs no flag and works when the page arrives on stdin.
 */
function extractCanonicalUrl(html: string): string | undefined {
  const match = CANONICAL_RE.exec(html);
  const href = match ? asString(match[1]) : undefined;
  return href !== undefined && /^https?:\/\//i.test(href) ? href : undefined;
}

const DT_RE =
  /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2})(?::(\d{2}))?(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

interface ParsedDate {
  /** OTE wall-clock: date-only or local date-time, offset stripped. */
  wallClock: string;
  /** true when the value ended in Z — the wall clock is UTC. */
  utc: boolean;
  /** true when a numeric offset was present (an offset is not an IANA zone). */
  offset: boolean;
  dateOnly: boolean;
}

function parseSchemaDate(value: string): ParsedDate | null {
  const m = DT_RE.exec(value.trim());
  if (!m) return null;
  const [, date, time, , zone] = m;
  if (time === undefined) {
    return { wallClock: date, utc: false, offset: false, dateOnly: true };
  }
  // OTE's dateTime is deliberately seconds-less ("the hour on a poster, never
  // a technical instant"): any seconds in the source are truncated, not
  // rounded — a format conversion, not the kind of loss that gets a warning.
  return {
    wallClock: `${date}T${time}`,
    utc: zone === "Z",
    offset: zone !== undefined && zone !== "Z",
    dateOnly: false,
  };
}

const ATTENDANCE_MAP: Record<string, OteAttendanceMode> = {
  OfflineEventAttendanceMode: "in-person",
  OnlineEventAttendanceMode: "online",
  MixedEventAttendanceMode: "hybrid",
};

const STATUS_MAP: Record<string, OteEventStatus> = {
  EventScheduled: "scheduled",
  EventCancelled: "cancelled",
  EventPostponed: "postponed",
  EventRescheduled: "rescheduled",
  EventMovedOnline: "moved-online",
};

const AVAILABILITY_MAP: Record<string, "in-stock" | "sold-out"> = {
  InStock: "in-stock",
  SoldOut: "sold-out",
};

/**
 * schema.org properties OTE does not model — flagged when present.
 * `image`/`organizer`/`offers` used to be here too; v0.3 added real OTE
 * fields for all three. `performer` left in 0.5, which added `speakers`.
 * Empty for now, and kept rather than deleted: the next schema.org property
 * OTE declines to model goes here, and an empty list says that is a choice.
 */
const UNMODELED_PROPS = [] as const;

interface EventWarning {
  field?: string;
  message: string;
}

/**
 * schema.org PostalAddress → location.address, part for part.
 *
 * This is a straight 1:1 rename, not a judgement call: OTE's address fields
 * were modelled on PostalAddress precisely so a connector would not have to
 * decide anything here. Folding these into the `venue` string and dropping
 * the rest loses `locality` and `country`, the two a consumer actually
 * filters on.
 */
function mapAddress(postal: JsonObject, warnings: EventWarning[]): OteAddress | undefined {
  const address: OteAddress = {};
  for (const [schemaKey, oteKey] of [
    ["streetAddress", "street"],
    ["addressLocality", "locality"],
    ["addressRegion", "region"],
    ["postalCode", "postalCode"],
  ] as const) {
    const value = asString(postal[schemaKey]);
    if (value !== undefined) address[oteKey] = value;
  }

  // addressCountry is the one part that is not free text: OTE wants an ISO
  // 3166-1 alpha-2 code, while schema.org allows a code, a country name, or a
  // Country object. A name is not a code, and this connector has no table to
  // turn one into the other — so a two-letter value is taken as the code and
  // anything else is named in a warning rather than guessed at.
  const rawCountry = postal.addressCountry;
  const country =
    typeof rawCountry === "object" && rawCountry !== null
      ? (asString((rawCountry as JsonObject).name) ??
        asString((rawCountry as JsonObject)["@id"]))
      : asString(rawCountry);
  if (country !== undefined) {
    if (/^[A-Za-z]{2}$/.test(country)) {
      address.country = country.toUpperCase();
    } else {
      warnings.push({
        field: "location.address.country",
        message: `addressCountry "${country}" is not an ISO 3166-1 alpha-2 code — set it by hand (note the UK is "GB")`,
      });
    }
  }

  return Object.keys(address).length > 0 ? address : undefined;
}

function mapLocation(
  raw: unknown,
  event: PartialOteEvent,
  warnings: EventWarning[],
): void {
  const entries = Array.isArray(raw) ? raw : [raw];
  const location: NonNullable<PartialOteEvent["location"]> = {};
  for (const entry of entries) {
    if (typeof entry === "string") {
      if (location.venue === undefined) location.venue = entry.trim();
      continue;
    }
    if (typeof entry !== "object" || entry === null) continue;
    const node = entry as JsonObject;
    const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
    if (types.includes("VirtualLocation")) {
      const url = asString(node.url);
      if (url) location.onlineUrl = url;
      continue;
    }
    // Place (or untyped object shaped like one): name + postal address,
    // composed from streetAddress + addressLocality + addressRegion. Parts
    // already contained in what came before are skipped — street addresses
    // like "29071 Málaga" tend to repeat the locality.
    const parts: string[] = [];
    const addPart = (part: string | undefined) => {
      if (part === undefined) return;
      const lower = part.toLowerCase();
      if (
        part.length >= 3 &&
        parts.some((p) => p.toLowerCase().includes(lower))
      ) {
        return;
      }
      parts.push(part);
    };
    addPart(asString(node.name));
    const address = node.address;
    if (typeof address === "string") {
      addPart(asString(address));
    } else if (typeof address === "object" && address !== null) {
      const postal = address as JsonObject;
      addPart(asString(postal.streetAddress));
      addPart(asString(postal.addressLocality));
      addPart(asString(postal.addressRegion));
      // The parts again, this time unflattened. `address` complements
      // `venue` and does not replace it — venue stays the one string every
      // format can print, so the overlap is the spec's intent, not a bug.
      if (location.address === undefined) {
        const mapped = mapAddress(postal, warnings);
        if (mapped) location.address = mapped;
      }
    }
    if (parts.length > 0 && location.venue === undefined) {
      location.venue = parts.join(", ");
    }
    const geo = node.geo;
    if (typeof geo === "object" && geo !== null) {
      const lat = asNumber((geo as JsonObject).latitude);
      const lon = asNumber((geo as JsonObject).longitude);
      if (lat !== undefined && lon !== undefined) {
        location.geo = { lat, lon };
      } else {
        warnings.push({
          field: "location.geo",
          message: "the Place has geo coordinates that could not be parsed",
        });
      }
    }
  }
  if (Object.keys(location).length > 0) event.location = location;
}

/**
 * schema.org organizer → organizers[]. Unlike import-ics (where a private or
 * link-shared .ics might expose an email its owner never meant to publish),
 * this connector's source is always a page the user is viewing in a
 * browser — a public web page — so an organizer email present in its JSON-LD
 * is imported directly, no visibility gate needed.
 */
function mapOrganizers(raw: unknown, warnings: EventWarning[]): OteOrganizer[] | undefined {
  const entries = Array.isArray(raw) ? raw : [raw];
  const organizers: OteOrganizer[] = [];
  let sawUnnamed = false;
  for (const entry of entries) {
    if (typeof entry === "string") {
      const name = asString(entry);
      if (name) organizers.push({ name });
      continue;
    }
    if (typeof entry !== "object" || entry === null) continue;
    const node = entry as JsonObject;
    const name = asString(node.name);
    if (!name) {
      sawUnnamed = true;
      continue;
    }
    const organizer: OteOrganizer = { name };
    const url = asString(node.url);
    if (url) organizer.url = url;
    const email = asString(node.email);
    if (email) organizer.email = email.replace(/^mailto:/i, "");
    const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
    if (types.some((t) => typeof t === "string" && bareEnum(t) === "Person")) {
      organizer.type = "person";
    }
    organizers.push(organizer);
  }
  if (sawUnnamed) {
    warnings.push({
      field: "organizers",
      message: "an organizer had no name — could not import; add it by hand",
    });
  }
  return organizers.length > 0 ? organizers : undefined;
}

/** schema.org image (bare string, ImageObject, or an array of either) → image[]. */
function mapImages(raw: unknown): (string | OteImageEntry)[] | undefined {
  const entries = Array.isArray(raw) ? raw : [raw];
  const images: (string | OteImageEntry)[] = [];
  for (const entry of entries) {
    if (typeof entry === "string") {
      const url = asString(entry);
      if (url) images.push(url);
      continue;
    }
    if (typeof entry !== "object" || entry === null) continue;
    const node = entry as JsonObject;
    const url = asString(node.url) ?? asString(node["@id"]);
    if (!url) continue;
    // schema.org has no "alt" property; `caption` is the closest analog
    // (also what Google reads), per the spec's own image[].alt mapping table.
    const alt = asString(node.caption) ?? asString(node.name);
    images.push(alt ? { url, alt } : url);
  }
  return images.length > 0 ? images : undefined;
}

/** schema.org Offer (or an array) → offers[]. */
function mapOffers(raw: unknown, warnings: EventWarning[]): OteOffer[] | undefined {
  const entries = Array.isArray(raw) ? raw : [raw];
  const offers: OteOffer[] = [];
  for (const entry of entries) {
    if (typeof entry !== "object" || entry === null) continue;
    const node = entry as JsonObject;
    const offer: OteOffer = {};
    const name = asString(node.name);
    if (name) offer.name = name;
    const price = asNumber(node.price);
    if (price !== undefined) offer.price = price;
    const currency = asString(node.priceCurrency);
    if (currency) offer.currency = currency;
    const url = asString(node.url);
    if (url) offer.url = url;
    const availability = asString(node.availability);
    if (availability !== undefined) {
      const mapped = AVAILABILITY_MAP[bareEnum(availability)];
      if (mapped !== undefined) offer.availability = mapped;
      // Other schema.org availability values (PreOrder, BackOrder, …) have
      // no OTE equivalent (only in-stock/sold-out exist) — left unmapped,
      // not worth a warning for a field that was itself never required.
    }
    for (const [schemaKey, oteKey] of [
      ["validFrom", "opensAt"],
      ["validThrough", "closesAt"],
    ] as const) {
      const instant = asString(node[schemaKey]);
      if (instant === undefined) continue;
      // offers[].opensAt/closesAt is an instant: it REQUIRES an offset,
      // unlike startDate/endDate's wall clock. A schema.org date with no
      // offset can't become one without inventing data.
      if (/(Z|[+-]\d{2}:?\d{2})$/.test(instant)) {
        offer[oteKey] = instant;
      } else {
        warnings.push({
          field: `offers.${oteKey}`,
          message: `${schemaKey} "${instant}" has no UTC offset — an instant needs one; set it by hand`,
        });
      }
    }
    if (offer.name || offer.price !== undefined || offer.url || offer.currency) {
      offers.push(offer);
    }
  }
  return offers.length > 0 ? offers : undefined;
}

/**
 * schema.org performer → speakers[] (OTE 0.5+).
 *
 * Modelled on mapOrganizers, because `speakers` was modelled on `organizers`
 * — a name, where they are from, and where to find them.
 *
 * `affiliation` exists so the employer does not end up inside `name`: "Martí
 * Cristobal, Bettatech" as a name stops matching that person anywhere else.
 * schema.org spells it `affiliation` (an Organization) or `worksFor`; OTE
 * wants one display string, so only the organisation's name travels.
 */
function mapSpeakers(raw: unknown, warnings: EventWarning[]): OteSpeaker[] | undefined {
  const entries = Array.isArray(raw) ? raw : [raw];
  const speakers: OteSpeaker[] = [];
  let sawUnnamed = false;
  for (const entry of entries) {
    if (typeof entry === "string") {
      const name = asString(entry);
      if (name) speakers.push({ name });
      continue;
    }
    if (typeof entry !== "object" || entry === null) continue;
    const node = entry as JsonObject;
    const name = asString(node.name);
    if (!name) {
      sawUnnamed = true;
      continue;
    }
    const speaker: OteSpeaker = { name };

    const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
    const isOrganization = types.some(
      (t) => typeof t === "string" && bareEnum(t) === "Organization",
    );
    if (types.some((t) => typeof t === "string" && bareEnum(t) === "Person")) {
      speaker.type = "person";
    } else if (isOrganization) {
      speaker.type = "organization";
    }

    const url = asString(node.url);
    if (url) speaker.url = url;

    // sameAs is HTTP(S) only in OTE: schema.org sameAs is a web page, and a
    // DID or an acct: handle is an identifier rather than a page.
    const sameAsRaw = Array.isArray(node.sameAs) ? node.sameAs : [node.sameAs];
    const sameAs = sameAsRaw
      .map((value) => asString(value))
      .filter((value): value is string => value !== undefined && /^https?:\/\//i.test(value));
    if (sameAs.length > 0) speaker.sameAs = sameAs;

    // Ignored on an organization: the field means "the organisation this
    // speaker is there as", which an organisation does not have.
    if (!isOrganization) {
      const affiliationRaw = node.affiliation ?? node.worksFor;
      const affiliation =
        typeof affiliationRaw === "object" && affiliationRaw !== null
          ? asString((affiliationRaw as JsonObject).name)
          : asString(affiliationRaw);
      if (affiliation) speaker.affiliation = affiliation;
    }

    speakers.push(speaker);
  }
  if (sawUnnamed) {
    warnings.push({
      field: "speakers",
      message: "a performer had no name — could not import; add it by hand",
    });
  }
  return speakers.length > 0 ? speakers : undefined;
}

/**
 * schema.org recordedIn / workFeaturedIn → recordings[] (OTE 0.5+).
 *
 * A watch page is fine here, unlike `image`, so a CreativeWork's `url` (or
 * its `@id` when that is already a URL) is what travels. Recordings are
 * published after the event, so most pages carry none — absent is the normal
 * case and draws no warning.
 */
function mapRecordings(raw: unknown): (string | OteRecordingEntry)[] | undefined {
  const entries = Array.isArray(raw) ? raw : [raw];
  const recordings: (string | OteRecordingEntry)[] = [];
  for (const entry of entries) {
    if (typeof entry === "string") {
      if (/^https?:\/\//i.test(entry.trim())) recordings.push(entry.trim());
      continue;
    }
    if (typeof entry !== "object" || entry === null) continue;
    const node = entry as JsonObject;
    const url = asString(node.url) ?? asString(node["@id"]);
    if (!url || !/^https?:\/\//i.test(url)) continue;
    const title = asString(node.name) ?? asString(node.headline);
    recordings.push(title ? { url, title } : url);
  }
  return recordings.length > 0 ? recordings : undefined;
}

/**
 * schema.org superEvent → partOf. Only usable when it carries something that
 * can serve as partOf.id (a URI): its own @id, or its url. A bare name with
 * neither is not enough — partOf.id is required, and inventing a URI from a
 * name would be exactly the kind of data this connector must never invent.
 */
function mapPartOf(raw: unknown): OtePartOf | undefined {
  if (typeof raw === "string") {
    return /^https?:\/\//i.test(raw) ? { id: raw } : undefined;
  }
  if (typeof raw !== "object" || raw === null) return undefined;
  const node = raw as JsonObject;
  const id = asString(node["@id"]) ?? asString(node.url);
  if (!id) return undefined;
  const name = asString(node.name);
  return name ? { id, name } : { id };
}

/**
 * The `partOf` that an event's own parts should carry: the parent's identity,
 * as a URI.
 *
 * Falls back to the page url when the parent node carries neither `@id` nor
 * `url`, because a conference published as one page with its talks in
 * `subEvent` is exactly the shape that has no per-event URI — and `partOf.id`
 * is required, so without a URI the parts cannot be linked at all. Still
 * never invented: every candidate here is a URI the source actually supplied.
 */
function parentPartOf(node: JsonObject, pageUrl: string | undefined): OtePartOf | undefined {
  const id = asString(node["@id"]) ?? asString(node.url) ?? pageUrl;
  if (id === undefined) return undefined;
  const name = asString(node.name);
  return name ? { id, name } : { id };
}

/** schema.org subEvent (or an array of them) → the Event nodes it contains. */
function subEventNodes(raw: unknown): JsonObject[] {
  const entries = Array.isArray(raw) ? raw : [raw];
  return entries.filter(
    (entry): entry is JsonObject => typeof entry === "object" && entry !== null,
  );
}

function mapEvent(
  node: JsonObject,
  allDayTimezonePolicy: string,
  pageUrl: string | undefined,
  inheritedPartOf: OtePartOf | undefined,
): {
  event: PartialOteEvent;
  warnings: EventWarning[];
} {
  const event: PartialOteEvent = {};
  const warnings: EventWarning[] = [];

  const name = asString(node.name);
  if (name) event.name = name;
  else warnings.push({ field: "name", message: "the Event has no name" });

  const description = asString(node.description);
  if (description) {
    let normalizedDescription = description;
    // Some pages put HTML in their schema.org description even though it's
    // meant to be plain text. OTE wants plain text or Markdown, so HTML is
    // re-encoded — and flagged, because the conversion is best-effort and
    // deserves a human look (same treatment as ICS import).
    if (looksLikeHtml(description)) {
      normalizedDescription = htmlToMarkdown(description);
      warnings.push({
        field: "description",
        message: "description contained HTML and was converted to Markdown — review the result",
      });
    }
    event.description = normalizedDescription;
    // Meetup (and others) truncate the JSON-LD description with an ellipsis.
    if (/(\.\.\.|…)$/.test(normalizedDescription)) {
      warnings.push({
        field: "description",
        message:
          "the source truncated the description (it ends in an ellipsis) — complete it from the event page",
      });
    }
  }

  // The Event's own url, or failing that the page it was published on — the
  // markup frequently omits `url` because the page *is* the url.
  const url = asString(node.url) ?? pageUrl;
  if (url) event.url = url;

  // The id warning has to tell the truth about `url`, because its whole point
  // is telling the reader what they still have to supply. Claiming "the
  // page's url was kept in `url`" when no url was kept sends them looking for
  // a field that is not there.
  const mintAnId = "not imported: mint a stable OTE id (a URI under your domain)";
  warnings.push({
    field: "id",
    message: url
      ? `${mintAnId} — the page's url was kept in \`url\``
      : inheritedPartOf !== undefined
        // A part is not given the page url on purpose: every talk claiming the
        // conference's page as its own url is worse than no url. So --url is
        // not the fix here, and saying it would be would send the reader round
        // in a circle.
        ? `${mintAnId}. This part carries no url of its own, and it does not inherit the parent's — set both by hand`
        : `${mintAnId}. The source carried no url either, and the page has no <link rel="canonical"> to fall back on — pass --url, or set both by hand`,
  });

  // --- dates ---------------------------------------------------------------
  // schema.org dates are ISO 8601 with a UTC offset. OTE wants local time +
  // an IANA timezone, and an offset does NOT identify a zone (+02:00 is
  // Madrid, Paris and Cairo…). The local part is kept; timezone stays
  // pending with a warning. `Z` is the exception: UTC is a real zone.
  let timezoneWarned = false;
  for (const key of ["startDate", "endDate"] as const) {
    const raw = asString(node[key]);
    if (raw === undefined) continue;
    const parsed = parseSchemaDate(raw);
    if (parsed === null) {
      warnings.push({ field: key, message: `unparseable ${key} "${raw}"` });
      continue;
    }
    event[key] = parsed.wallClock;
    if (parsed.dateOnly) {
      // OTE requires timezone even for all-day events, but schema.org gives
      // no timezone data for a date-only value at all — always an
      // inference, so always warn (see HtmlToEventsOptions.allDayTimezonePolicy).
      if (key === "startDate") {
        event.timezone = allDayTimezonePolicy;
        warnings.push({
          field: "timezone",
          message: `all-day event: the source gives no timezone for a date-only value — inferred "${allDayTimezonePolicy}"; override if this event isn't actually in that zone`,
        });
      }
      continue;
    }
    if (key === "endDate") continue;
    if (parsed.utc) {
      event.timezone = "UTC";
    } else if (!timezoneWarned) {
      timezoneWarned = true;
      warnings.push({
        field: "timezone",
        message: parsed.offset
          ? "the source gives a UTC offset, which does not identify an IANA timezone — set it by hand"
          : "the source gives no timezone information — set it by hand",
      });
    }
  }
  if (node.startDate === undefined) {
    warnings.push({ field: "startDate", message: "the Event has no startDate" });
  }

  // --- enums ----------------------------------------------------------------
  const attendance = asString(node.eventAttendanceMode);
  if (attendance !== undefined) {
    const mapped = ATTENDANCE_MAP[bareEnum(attendance)];
    if (mapped !== undefined) {
      event.attendanceMode = mapped;
    } else {
      warnings.push({
        field: "attendanceMode",
        message: `eventAttendanceMode "${attendance}" has no OTE equivalent`,
      });
    }
  }

  const status = asString(node.eventStatus);
  if (status !== undefined) {
    const mapped = STATUS_MAP[bareEnum(status)];
    if (mapped !== undefined) {
      event.status = mapped;
    } else {
      // Any other schema.org eventStatus value has no OTE equivalent at
      // all — absent + warning, never a guess.
      warnings.push({
        field: "status",
        message: `eventStatus "${status}" has no OTE equivalent`,
      });
    }
  }

  // --- the rest ---------------------------------------------------------------
  if (node.location !== undefined) mapLocation(node.location, event, warnings);

  const inLanguage = node.inLanguage;
  const languages = (Array.isArray(inLanguage) ? inLanguage : [inLanguage])
    .map((entry) =>
      typeof entry === "object" && entry !== null
        ? asString((entry as JsonObject).name)
        : asString(entry),
    )
    .filter((s): s is string => s !== undefined);
  if (languages.length > 0) event.languages = languages;

  const keywords = node.keywords;
  const tags = (Array.isArray(keywords) ? keywords : [keywords])
    .flatMap((entry) => asString(entry)?.split(",") ?? [])
    .map((t) => t.trim())
    .filter(Boolean);
  if (tags.length > 0) event.tags = tags;

  if (node.organizer !== undefined) {
    const organizers = mapOrganizers(node.organizer, warnings);
    if (organizers) event.organizers = organizers;
  }

  if (node.image !== undefined) {
    const images = mapImages(node.image);
    if (images) event.image = images;
  }

  if (node.offers !== undefined) {
    const offers = mapOffers(node.offers, warnings);
    if (offers) event.offers = offers;
  }

  if (node.performer !== undefined) {
    const speakers = mapSpeakers(node.performer, warnings);
    if (speakers) event.speakers = speakers;
  }

  // Two schema.org properties land in the same OTE field; a page using both
  // gets one merged list rather than the second silently winning.
  const recordingSources = [node.recordedIn, node.workFeaturedIn].filter(
    (value) => value !== undefined,
  );
  if (recordingSources.length > 0) {
    const recordings = mapRecordings(recordingSources.flatMap((v) => (Array.isArray(v) ? v : [v])));
    if (recordings) event.recordings = recordings;
  }

  if (node.superEvent !== undefined) {
    const partOf = mapPartOf(node.superEvent);
    if (partOf) {
      event.partOf = partOf;
    } else {
      warnings.push({
        field: "partOf",
        message:
          "superEvent has no usable id (@id or url) — could not import; add partOf by hand",
      });
    }
  }

  // A part extracted from its parent's subEvent: the parent's identity is
  // what makes it a part, and it is not something the part's own node says.
  // An explicit superEvent wins — it is the source's own statement.
  if (inheritedPartOf !== undefined && event.partOf === undefined) {
    event.partOf = inheritedPartOf;
  }

  for (const prop of UNMODELED_PROPS) {
    if (node[prop] !== undefined) {
      warnings.push({
        message: `schema.org "${prop}" has no OTE equivalent and was not imported`,
      });
    }
  }

  return { event, warnings };
}

/**
 * Extracts the schema.org Events a page exposes as JSON-LD and converts
 * them into partial OTE event documents.
 *
 * Pure and deterministic: no network, no DOM, no clock — plain string and
 * JSON processing, so it runs identically in the browser (paste-the-HTML
 * fallback) and in Node. Never throws. Malformed JSON-LD blocks and JSON-LD
 * that is not an Event (Organization, BreadcrumbList…) are skipped without
 * noise; only "the page has no Event at all" warns. A connector never
 * invents data: every field the page did not carry (or OTE does not model)
 * is absent and identified by a warning.
 */
export function htmlToEvents(
  html: string,
  options: HtmlToEventsOptions = {},
): ImportResult {
  const events: PartialOteEvent[] = [];
  const warnings: ImportWarning[] = [];
  const allDayTimezonePolicy = options.allDayTimezonePolicy ?? "UTC";

  // An explicit --url wins over the page's own canonical link: the caller
  // knows where the HTML came from, and a scraped or mirrored page can carry
  // a canonical pointing somewhere else entirely.
  const pageUrl = options.pageUrl ?? extractCanonicalUrl(html);

  const nodes: JsonObject[] = [];
  for (const block of extractJsonLdBlocks(html)) {
    try {
      collectEventNodes(JSON.parse(block), nodes);
    } catch {
      // Malformed JSON-LD: the page's problem, not the organizer's.
    }
  }

  if (nodes.length === 0) {
    warnings.push({
      message:
        "no schema.org Event found in the page's JSON-LD — is this the event page's full HTML?",
    });
    return { events, warnings };
  }

  // A parent and its subEvent parts become one document each — OTE has no
  // nesting, it has `partOf`. The parent is kept too: a conference is a real
  // event in its own right, not just a container for its talks.
  //
  // collectEventNodes stops descending at an Event node, so a part is never
  // also collected on its own; flattening here is the only place it happens.
  const queue: { node: JsonObject; partOf: OtePartOf | undefined }[] = [];
  for (const node of nodes) {
    queue.push({ node, partOf: undefined });
    if (node.subEvent === undefined) continue;
    const parts = subEventNodes(node.subEvent);
    if (parts.length === 0) continue;
    const partOf = parentPartOf(node, pageUrl);
    if (partOf === undefined) {
      // Without a URI for the parent there is no partOf.id, and a part that
      // cannot say what it is part of would silently become a standalone
      // event — a quieter and worse outcome than saying so.
      warnings.push({
        eventIndex: events.length,
        field: "subEvent",
        message: `the Event has ${parts.length} subEvent(s) but no @id or url to use as partOf.id — the parts were not imported; give the parent a url (or pass --url) and re-run`,
      });
      continue;
    }
    for (const part of parts) queue.push({ node: part, partOf });
  }

  // Pages sometimes repeat the same event in several blocks; keep the first.
  const seen = new Set<string>();
  for (const { node, partOf } of queue) {
    const { event, warnings: eventWarnings } = mapEvent(
      node,
      allDayTimezonePolicy,
      // A part inherits the parent's identity, not the parent's url: giving
      // every talk the conference's url would make 17 events claim the same
      // page as their own.
      partOf === undefined ? pageUrl : undefined,
      partOf,
    );
    const key = `${event.name ?? ""}|${event.startDate ?? ""}|${event.url ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const eventIndex = events.length;
    events.push(event);
    for (const w of eventWarnings) warnings.push({ eventIndex, ...w });
  }
  return { events, warnings };
}
