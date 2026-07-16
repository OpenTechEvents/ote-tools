import type {
  ImportResult,
  ImportWarning,
  OteAttendanceMode,
  OteEventStatus,
  PartialOteEvent,
} from "./types.js";

export type {
  ImportResult,
  ImportWarning,
  OteAttendanceMode,
  OteEventStatus,
  OteGeo,
  OteLocation,
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
  const [, date, time, seconds, zone] = m;
  if (time === undefined) {
    return { wallClock: date, utc: false, offset: false, dateOnly: true };
  }
  return {
    wallClock: `${date}T${time}:${seconds ?? "00"}`,
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
};

/** schema.org properties OTE does not model — flagged when present. */
const UNMODELED_PROPS = ["image", "organizer", "offers", "performer"] as const;

interface EventWarning {
  field?: string;
  message: string;
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

function mapEvent(node: JsonObject): {
  event: PartialOteEvent;
  warnings: EventWarning[];
} {
  const event: PartialOteEvent = {};
  const warnings: EventWarning[] = [
    {
      field: "id",
      message:
        "not imported: mint a stable OTE id (a URI under your domain) — the page's url was kept in `url`",
    },
  ];

  const name = asString(node.name);
  if (name) event.name = name;
  else warnings.push({ field: "name", message: "the Event has no name" });

  const description = asString(node.description);
  if (description) {
    event.description = description;
    // Meetup (and others) truncate the JSON-LD description with an ellipsis.
    if (/(\.\.\.|…)$/.test(description)) {
      warnings.push({
        field: "description",
        message:
          "the source truncated the description (it ends in an ellipsis) — complete it from the event page",
      });
    }
  }

  const url = asString(node.url);
  if (url) event.url = url;

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
    if (parsed.dateOnly || key === "endDate") continue;
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
      // e.g. EventMovedOnline: OTE does not model it — absent + warning.
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
export function htmlToEvents(html: string): ImportResult {
  const events: PartialOteEvent[] = [];
  const warnings: ImportWarning[] = [];

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

  // Pages sometimes repeat the same event in several blocks; keep the first.
  const seen = new Set<string>();
  for (const node of nodes) {
    const { event, warnings: eventWarnings } = mapEvent(node);
    const key = `${event.name ?? ""}|${event.startDate ?? ""}|${event.url ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const eventIndex = events.length;
    events.push(event);
    for (const w of eventWarnings) warnings.push({ eventIndex, ...w });
  }
  return { events, warnings };
}
