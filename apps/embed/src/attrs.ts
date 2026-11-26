// theme="light|dark|auto" has no parser here: theme.css.ts's :host()
// selectors read the raw attribute directly (see element.ts), and an
// unrecognized value simply falls back to the light defaults — no JS
// validation needed.
export type LangAttr = "en" | "es" | "auto";
export type Lang = "en" | "es";
export type Layout = "list" | "cards" | "calendar";
export type EventClickMode = "modal" | "link" | "none";
export type SortMode = "auto" | "none";
export type NativeEventAction = "google-calendar" | "outlook-calendar" | "yahoo-calendar" | "ics" | "link";

export type GroupKey = "series" | "multipart";

export type FieldKey =
  | "image"
  | "when"
  | "location"
  | "attendance"
  | "description"
  | "price"
  | "tags"
  | "organizer"
  | "eligibility"
  | "cfp";

export const ALL_FIELDS: readonly FieldKey[] = [
  "image",
  "when",
  "location",
  "attendance",
  "description",
  "price",
  "tags",
  "organizer",
  "eligibility",
  "cfp",
];

export const DEFAULT_FIELDS: readonly FieldKey[] = [
  "image",
  "when",
  "location",
  "attendance",
  "description",
];

export const DEFAULT_EVENT_ACTIONS: readonly NativeEventAction[] = [
  "google-calendar",
  "outlook-calendar",
  "yahoo-calendar",
  "ics",
  "link",
];

const ALL_GROUP_KEYS: readonly GroupKey[] = ["series", "multipart"];

function isFieldKey(value: string): value is FieldKey {
  return (ALL_FIELDS as readonly string[]).includes(value);
}

function isGroupKey(value: string): value is GroupKey {
  return (ALL_GROUP_KEYS as readonly string[]).includes(value);
}

export function parseLimit(value: string | null): number {
  if (!value) return Infinity;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : Infinity;
}

export function parseLangAttr(value: string | null): LangAttr {
  return value === "en" || value === "es" ? value : "auto";
}

/** Resolves "auto" against the runtime's own language, for a concrete UI-string lookup. */
export function resolveLang(attr: LangAttr, navigatorLanguage: string): Lang {
  if (attr !== "auto") return attr;
  return navigatorLanguage.toLowerCase().startsWith("es") ? "es" : "en";
}

/**
 * `event-id="<OTE id>"` — the single event to render, matched against the
 * event's own `id`. The OTE `id` is a stable URI documented as never
 * changing after publication, which is what makes it the right key here:
 * a name or a date can be edited, so filtering on either would silently
 * empty a page the organizer had already published.
 */
export function parseEventId(value: string | null): string | undefined {
  return value?.trim() || undefined;
}

export function parseShowPast(value: string | null): boolean {
  return value !== "false";
}

export function parseLayout(value: string | null): Layout {
  if (value === "cards") return "cards";
  if (value === "list") return "list";
  return "calendar";
}

export function parseEventClick(value: string | null): EventClickMode {
  if (value === "link" || value === "none") return value;
  return "modal";
}

export function parseSort(value: string | null): SortMode {
  return value === "none" ? "none" : "auto";
}

function isNativeEventAction(value: string): value is NativeEventAction {
  return (
    value === "google-calendar" ||
    value === "outlook-calendar" ||
    value === "yahoo-calendar" ||
    value === "ics" ||
    value === "link"
  );
}

export function parseEventActions(value: string | null): NativeEventAction[] {
  if (value === "none") return [];
  if (!value) return [...DEFAULT_EVENT_ACTIONS];
  const requested = value
    .split(",")
    .map((token) => token.trim())
    .filter(isNativeEventAction);
  return requested.length > 0 ? [...new Set(requested)] : [...DEFAULT_EVENT_ACTIONS];
}

/**
 * Comma-separated allow-list of which optional fields to render. Absent,
 * empty, or entirely-unrecognized input falls back to DEFAULT_FIELDS; any
 * valid non-empty input is a full replacement, not merged with the default —
 * `fields="price,tags"` shows *only* price and tags.
 */
export function parseFields(value: string | null): Set<FieldKey> {
  if (!value) return new Set(DEFAULT_FIELDS);
  const requested = value
    .split(",")
    .map((token) => token.trim())
    .filter(isFieldKey);
  return requested.length > 0 ? new Set(requested) : new Set(DEFAULT_FIELDS);
}

/**
 * Comma-separated allow-list for the "detail" surfaces — the list layout's
 * accordion body and the detail modal. Same full-replacement semantics as
 * `parseFields`, but a different fallback: absent, empty, or
 * entirely-unrecognized input yields ALL_FIELDS, not DEFAULT_FIELDS. This
 * preserves the modal's original behavior (it rendered every optional field
 * unconditionally, with no `fields` gating at all) as the true default —
 * only an explicit value (here, or via the legacy `fields` attribute)
 * narrows what the detail surfaces show.
 */
export function parseDetailFields(value: string | null): Set<FieldKey> {
  if (!value) return new Set(ALL_FIELDS);
  const requested = value
    .split(",")
    .map((token) => token.trim())
    .filter(isFieldKey);
  return requested.length > 0 ? new Set(requested) : new Set(ALL_FIELDS);
}

/**
 * Comma-separated opt-in list of `partOf.type` values to collapse into a
 * stacked card in `layout="cards"`. Deliberately the *opposite* default of
 * `parseFields`: absent, empty, or entirely-unrecognized input yields an
 * EMPTY set (no grouping), not "all types". This is new opt-in visual
 * behavior shipped in a minor release with a live pinned consumer — the
 * attribute being absent must be a complete no-op, unlike `fields`, whose
 * default was already the pre-existing look.
 */
export function parseGroupEvents(value: string | null): Set<GroupKey> {
  if (!value) return new Set();
  return new Set(
    value
      .split(",")
      .map((token) => token.trim())
      .filter(isGroupKey),
  );
}

/**
 * Comma-separated list of feed URLs for the `feeds` attribute (plural).
 * Unlike `parseFields`, there is no recognized-token allow-list — every
 * non-empty, trimmed token is a URL candidate; a bad one simply fails to
 * fetch like a bad `feed` URL would. Returns an empty array when absent,
 * blank, or only commas, so `element.ts` can fall back to the single `feed`
 * attribute.
 */
export function parseFeedsAttr(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

const CARD_WIDTH_PRESETS: Record<string, string> = {
  small: "160px",
  medium: "220px",
  large: "320px",
};

/**
 * Resolves `card-width` (only meaningful in `layout="cards"`) into a CSS
 * length for `--ote-card-min-width`. Accepts the presets `small`/`medium`/
 * `large`, or any raw CSS length (`"280px"`, `"18rem"`); a bare number is
 * treated as pixels. Absent or unrecognized falls back to `"220px"` — the
 * same value that was hardcoded before this attribute existed, so an
 * existing embed's default card width never changes.
 */
export function parseCardWidth(value: string | null): string {
  const trimmed = value?.trim();
  if (!trimmed) return CARD_WIDTH_PRESETS.medium!;
  if (trimmed in CARD_WIDTH_PRESETS) return CARD_WIDTH_PRESETS[trimmed]!;
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
  if (/^\d+(\.\d+)?(px|rem|em|ch|vw|%)$/.test(trimmed)) return trimmed;
  return CARD_WIDTH_PRESETS.medium!;
}

/**
 * `max-height` — the vertical budget the host gives the widget, as a CSS
 * length (`"600px"`, `"60vh"`, `"40rem"`); a bare number is treated as
 * pixels. Absent, `"none"`/`"off"`, or unparseable yields `undefined`, which
 * means "grow to fit the feed" — the behaviour every embed had before this
 * attribute existed.
 *
 * It is a *max*, not a fixed height: a feed shorter than the budget renders
 * at its natural height rather than padding the box out with dead space.
 * What overflows the budget scrolls inside the widget, so the host no longer
 * has to wrap the element in its own `max-height`/`overflow` container — a
 * wrapper that scrolls the widget from the outside, which is why it dragged
 * the calendar's own sticky weekday header out of view (#168).
 *
 * The value is written straight into a CSS custom property, so the accepted
 * shapes are deliberately a closed list rather than "whatever CSS parses".
 */
export function parseMaxHeight(value: string | null): string | undefined {
  const trimmed = value?.trim().toLowerCase();
  if (!trimmed) return undefined;
  if (trimmed === "none" || trimmed === "off" || trimmed === "auto") return undefined;
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
  if (/^\d+(\.\d+)?(px|rem|em|ch|vh|dvh|svh|vmin|vmax|%)$/.test(trimmed)) return trimmed;
  return undefined;
}

export const DEFAULT_MAX_PER_DAY = 3;

/**
 * `max-per-day` — how many events a day cell shows in `layout="calendar"`
 * before the rest collapse into the library's `+N more` popover. A positive
 * integer, or `"off"` for the pre-0.9.0 behaviour of stacking every event.
 * Default `3`: the library's own default is `false` (never collapse), which
 * let one busy day grow a 15-event column and pushed the widget to 1570px
 * inside an 866px dialog (#167).
 *
 * The cap is a *height*, not a count, because `@event-calendar/core`'s
 * `dayMaxEvents` only accepts `true` ("as many as fit the day cell") —
 * `calendar-layout.ts#dayRowHeight()` turns the number into the row height
 * that fits it, so an unusual font can land on one event either side. The
 * popover is exact regardless: whatever does not fit is in it.
 */
export function parseMaxPerDay(value: string | null): number | "off" {
  const trimmed = value?.trim().toLowerCase();
  if (!trimmed) return DEFAULT_MAX_PER_DAY;
  if (trimmed === "off" || trimmed === "none" || trimmed === "false") return "off";
  const n = Number.parseInt(trimmed, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_PER_DAY;
}

export type InitialDate =
  | { kind: "next-event" }
  | { kind: "today" }
  | { kind: "date"; date: string };

/**
 * `initial-date` — which month `layout="calendar"` opens on:
 * `"next-event"` (default), `"today"`, or a fixed `YYYY-MM`/`YYYY-MM-DD`.
 *
 * The default is deliberately *not* "today": the library opens on the current
 * month, so a feed whose events start next March opened empty and read as
 * broken (#167). An unparseable value falls back to `"next-event"` rather
 * than to today — a typo in a date should not land on the one behaviour the
 * default exists to avoid.
 */
export function parseInitialDate(value: string | null): InitialDate {
  const trimmed = value?.trim();
  if (!trimmed) return { kind: "next-event" };
  const lower = trimmed.toLowerCase();
  if (lower === "today" || lower === "now") return { kind: "today" };
  if (lower === "next-event") return { kind: "next-event" };
  if (/^\d{4}-\d{2}$/.test(trimmed) && isCalendarDate(`${trimmed}-01`)) {
    return { kind: "date", date: `${trimmed}-01` };
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed) && isCalendarDate(trimmed)) {
    return { kind: "date", date: trimmed };
  }
  return { kind: "next-event" };
}

/**
 * `responsive` — whether `layout="calendar"` degrades to the library's list
 * view when its **container** is too narrow for a seven-column month grid
 * (see `calendar-layout.ts`). On by default; `responsive="off"` keeps the
 * grid at every width for a host that really wants it.
 *
 * Container width, not viewport: the widget is usually embedded in a column,
 * so a `matchMedia` test answers a question nobody asked — which is also why
 * opentechevents.org's own `layout="list"` workaround was the wrong shape to
 * copy into the component (#169).
 */
/** A shape-only regex would accept `"2026-13"` and `"2026-02-30"`; this round-trips the value through `Date` so it has to be a day that exists. */
function isCalendarDate(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number) as [number, number, number];
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

export function parseResponsive(value: string | null): boolean {
  const trimmed = value?.trim().toLowerCase();
  return !(trimmed === "off" || trimmed === "false" || trimmed === "none");
}

export interface CalendarAttributes {
  maxPerDay: number | "off";
  initialDate: InitialDate;
  responsive: boolean;
}

/**
 * The three calendar-only attributes, read together — `element.ts` has no
 * other reason to know their names, and this keeps attrs.ts DOM-free (it
 * takes a getter, not an element).
 *
 * `rememberedDate` is the month the visitor last paged to, and it outranks
 * `initial-date`: the attribute says where the calendar *opens*, not where it
 * returns to. Every re-render remounts the calendar (see `element.ts`), so
 * without this, opening a detail modal would snap the view back.
 */
export function parseCalendarAttributes(
  getAttribute: (name: string) => string | null,
  rememberedDate?: string,
): CalendarAttributes {
  return {
    maxPerDay: parseMaxPerDay(getAttribute("max-per-day")),
    initialDate: rememberedDate
      ? { kind: "date", date: rememberedDate }
      : parseInitialDate(getAttribute("initial-date")),
    responsive: parseResponsive(getAttribute("responsive")),
  };
}
