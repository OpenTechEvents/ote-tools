import type { PreviewEvent, PreviewOffer, PreviewPrice } from "./types.js";

export function truncate(text: string | undefined, length = 320): string | undefined {
  if (!text) return undefined;
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > length ? `${compact.slice(0, length - 1)}…` : compact;
}

export function nonEmpty(value: unknown): string | undefined {
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : undefined;
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value && typeof value === "object") return JSON.stringify(value);
  return undefined;
}

export function detailRows(entries: Array<[string, unknown]>): PreviewEvent["details"] {
  return entries.flatMap(([label, value]) => {
    const text = nonEmpty(value);
    return text ? [{ label, value: text }] : [];
  });
}

export function parseSortDate(value: string | undefined): number | null {
  if (!value) return null;
  const isoLike = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/.exec(
    value,
  );
  const date = isoLike
    ? new Date(`${isoLike[1]}T${isoLike[2] ?? "00:00:00"}`)
    : new Date(value);
  const time = date.valueOf();
  return Number.isNaN(time) ? null : time;
}

export function sortedEvents(events: PreviewEvent[]): PreviewEvent[] {
  const now = Date.now();
  return events
    .map((event, index) => ({ event, index, sortDate: parseSortDate(event.startDate) }))
    .sort((a, b) => {
      if (a.sortDate === null && b.sortDate === null) return a.index - b.index;
      if (a.sortDate === null) return 1;
      if (b.sortDate === null) return -1;
      const aPast = a.sortDate < now;
      const bPast = b.sortDate < now;
      if (aPast !== bPast) return aPast ? 1 : -1;
      return aPast ? b.sortDate - a.sortDate : a.sortDate - b.sortDate;
    })
    .map(({ event }) => event);
}

export function isDateOnly(value: string | undefined): boolean {
  return value !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDate(value: string | undefined, timezone: string | undefined): string {
  if (!value) return "";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (dateOnly) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
      new Date(`${value}T00:00:00Z`),
    );
  }
  const date = new Date(`${value}${timezone === "UTC" ? "Z" : ""}`);
  if (!Number.isNaN(date.valueOf())) {
    const formatted = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
    return timezone ? `${formatted} (${timezone})` : formatted;
  }
  return timezone ? `${value} (${timezone})` : value;
}

export function eventLocation(event: {
  location?: { venue?: string; onlineUrl?: string };
}): string {
  return event.location?.venue ?? onlineLocationLabel(event.location?.onlineUrl) ?? "online";
}

export function onlineLocationLabel(url: string | undefined): string | undefined {
  if (!url) return undefined;
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "Online event";
  }

  if (host === "meet.google.com") return "Google Meet";
  if (host === "teams.microsoft.com") return "Microsoft Teams";
  if (host === "meet.jit.si" || host.endsWith(".jitsi.net")) return "Jitsi Meet";
  if (host === "discord.gg" || host === "discord.com") return "Discord";
  if (host === "youtube.com" || host === "youtu.be") return "YouTube";
  if (host === "twitch.tv") return "Twitch";
  if (host === "lu.ma") return "Luma";
  if (host.endsWith(".zoom.us") || host === "zoom.us") return "Zoom";
  if (host.endsWith(".slack.com") || host === "slack.com") return "Slack";
  if (host.endsWith(".meetup.com") || host === "meetup.com") return "Meetup";
  if (host.endsWith(".eventbrite.com") || host === "eventbrite.com") return "Eventbrite";
  return "Online event";
}

export function eventWhen(event: PreviewEvent): string {
  return (
    event.dateLabel ??
    (event.endDate
      ? `${formatDate(event.startDate, event.timezone)} to ${formatDate(event.endDate, event.timezone)}`
      : formatDate(event.startDate, event.timezone))
  );
}

/**
 * OTE's `image` field is `(string | {url, alt?})[]`; this picks the entry to
 * display.
 *
 * Order is the publisher's preference, so it wins — except that an `https://`
 * entry is preferred over an earlier `http://` one. OTE Spec 0.4.0 dropped the
 * https-only MUST on `image`, so a valid feed may now list an `http://` image;
 * on an `https` page that address is mixed content and is blocked outright by
 * the browser, while the `https` entry further down the list would have
 * rendered. Falling through to it costs the publisher nothing and is never
 * worse: an `https` image also loads fine on an `http` page.
 */
export function firstImage(
  images: Array<string | { url: string; alt?: string }> | undefined,
): { url: string; alt?: string } | undefined {
  const entries = (images ?? []).map((image) => (typeof image === "string" ? { url: image } : image));
  return entries.find((image) => !isInsecureUrl(image.url)) ?? entries[0];
}

function isInsecureUrl(url: string): boolean {
  return /^http:\/\//i.test(url);
}

/**
 * What it costs to attend this event, by the spec's rules for multi-part
 * pricing (D032) rather than by `Math.min` over `offers[]`.
 *
 * The old implementation took the numerically lowest priced offer, which is
 * wrong by construction once scopes exist: an `admission` offer and an
 * `add-on` offer are not alternatives to choose between, they are additive.
 * Three documents it answered wrongly, all of them schema-valid:
 *
 * - a part with no `offers`, in a document carrying `partOf.offers` → it said
 *   "no price" when the document states the price;
 * - a part whose only offer is a 20 € `add-on` → it said "20 €", presented as
 *   the cost of attending, when 20 € is the surcharge;
 * - a part with its own 50 € admission and a 20 € add-on → it picked the
 *   surcharge, 20 €, the cheapest number on the page and the one price nobody
 *   can pay.
 *
 * The rule, from the schema's own words: an absent `scope` is `admission`, a
 * complete way to attend this part. An `add-on` is "an ADDITIONAL charge on
 * top of the set admission — total is a priced `partOf.offers` entry plus
 * this entry's price when both carry a number, otherwise an additional
 * charge, total unknown". So the candidates are compared as **totals**, and
 * an add-on composes with the *set's* admission, never with the part's own:
 * a part sold standalone for 50 € is attendable for 50 €.
 *
 * `undefined` means nothing in the document prices this event. An offer with
 * only a `url` ("get tickets") carries no number and is skipped rather than
 * read as free — only `price: 0` says free.
 */
export function attendancePrice(input: {
  offers?: PreviewOffer[];
  partOf?: { offers?: PreviewOffer[] };
}): PreviewPrice | undefined {
  const own = input.offers ?? [];
  const shared = input.partOf?.offers ?? [];

  // Cheapest priced entry of the set's shared admission. `partOf.offers` is
  // the admission by definition, so a `scope` inside it changes nothing.
  const sharedAdmission = cheapestPriced(shared);

  // The one place an absent offers list means something other than unknown.
  if (own.length === 0) {
    return sharedAdmission
      ? { amount: sharedAdmission.price, currency: sharedAdmission.currency, url: sharedAdmission.url, basis: "shared" }
      : undefined;
  }

  const candidates: PreviewPrice[] = [];

  for (const offer of own) {
    if (offer.price === undefined) continue;
    if (offer.scope !== "add-on") {
      candidates.push({ amount: offer.price, currency: offer.currency, url: offer.url, basis: "own" });
      continue;
    }
    // Two currencies cannot be added. Nothing in the schema makes two offers
    // in one document share one, and a local-currency admission with a USD
    // workshop fee is an ordinary shape — so summing them would invent
    // "260 EUR" out of 240 EUR + 20 USD, which is a false number in the one
    // change whose purpose is to stop producing them. The surcharge is still
    // known, so it is reported as a surcharge.
    const mixedCurrency =
      !!sharedAdmission?.currency && !!offer.currency && sharedAdmission.currency !== offer.currency;

    if (sharedAdmission && !mixedCurrency) {
      candidates.push({
        amount: sharedAdmission.price + offer.price,
        // An add-on with no currency of its own is read in the currency the
        // set is sold in; that is an inference about notation, not about
        // money.
        currency: sharedAdmission.currency ?? offer.currency,
        url: offer.url ?? sharedAdmission.url,
        basis: "shared-plus-add-on",
      });
      continue;
    }
    // A priced surcharge with nothing it can be added to: either no priced
    // admission (the schema forbids that shape, but this input is
    // unvalidated) or one in a different currency. Reporting the surcharge as
    // a total is the false answer the spec rules out, so say what is known.
    candidates.push({ amount: offer.price, currency: offer.currency, url: offer.url, basis: "add-on-only" });
  }

  if (candidates.length === 0) {
    // Own offers exist but none is priced (a bare ticket link). The set's
    // admission does not cover a part that states its own ways to attend.
    return undefined;
  }

  // Compare totals. An add-on-only candidate has no total, so it only wins
  // when nothing else is priced at all.
  const totals = candidates.filter((candidate) => candidate.basis !== "add-on-only");
  const pool = totals.length > 0 ? totals : candidates;
  return pool.reduce((best, candidate) => (candidate.amount! < best.amount! ? candidate : best));
}

const cheapestPriced = (
  offers: PreviewOffer[],
): { price: number; currency?: string; url?: string } | undefined => {
  const priced = offers.filter(
    (offer): offer is PreviewOffer & { price: number } => offer.price !== undefined,
  );
  if (priced.length === 0) return undefined;
  const cheapest = priced.reduce((min, offer) => (offer.price < min.price ? offer : min));
  return { price: cheapest.price, currency: cheapest.currency, url: cheapest.url };
};
