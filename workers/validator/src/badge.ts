/**
 * `/badge?doc=…` — the validator's verdict as an image, so a community can
 * put its feed's status in its own README.
 *
 * Two halves, both here:
 *
 *  1. **resolveBadge** — the same two steps the page takes (discovery, then
 *     validation) collapsed into one word. It reuses `fetchDocument`,
 *     `@opentechevents/discover-feed` and `@opentechevents/validate` verbatim:
 *     a badge that disagreed with the page would be worse than no badge.
 *  2. **renderBadge** — the SVG. Every string it draws is a constant from
 *     `STATES` below; nothing fetched is ever written into the image, which is
 *     what keeps an SVG built from a stranger's document from carrying that
 *     stranger's markup.
 *
 * Unlike `/fetch`, this endpoint runs on *someone else's* schedule: a README
 * on a busy repository asks for it whenever a reader loads the page. So the
 * answer is cached (see `badgeTtlSeconds` and the cache in `index.ts`) and the
 * badge deliberately promises freshness in hours, not seconds.
 */

import { discover, detectDocumentKind } from "@opentechevents/discover-feed";
import { validateDocument } from "@opentechevents/validate";

import { fetchDocument, type FetchDeps } from "./fetch-document.js";

/**
 * What a badge can say. Deliberately coarse: a README has room for one word,
 * and the page at validator.opentechevents.org is where the detail lives.
 */
export type BadgeState =
  /** Discovered, and it passes every MUST in the schema. */
  | "valid"
  /** Discovered, and it does not. Recommendations never cause this. */
  | "invalid"
  /** Nothing to validate: the URL declares no OTE feed. Not the same as invalid. */
  | "not-discovered"
  /** The page declares several feeds; the badge refuses to pick, as the page does. */
  | "ambiguous"
  /** The document could not be fetched at all — DNS, timeout, refusal, 500. */
  | "unreachable";

export interface BadgeVerdict {
  state: BadgeState;
  /**
   * Why, for logs and tests. Never rendered into the SVG: it can quote a
   * remote server's words, and the image is served to third-party READMEs.
   */
  detail: string;
}

interface StateStyle {
  /** The right-hand text. A constant — see the module comment. */
  text: string;
  /** Fill for the right-hand half, from opentechevents.org's palette. */
  color: string;
  /** How long this answer may be reused. Failures expire sooner than verdicts. */
  ttlSeconds: number;
}

const STATES: Record<BadgeState, StateStyle> = {
  valid: { text: "valid", color: "#0f8a5f", ttlSeconds: 3600 },
  invalid: { text: "invalid", color: "#c4302f", ttlSeconds: 3600 },
  "not-discovered": { text: "no feed found", color: "#6f7787", ttlSeconds: 3600 },
  ambiguous: { text: "several feeds", color: "#b06d00", ttlSeconds: 3600 },
  // A transient outage must not stick to a README for an hour.
  unreachable: { text: "unreachable", color: "#b06d00", ttlSeconds: 300 },
};

/** Cache lifetime for a verdict, in seconds. */
export function badgeTtlSeconds(state: BadgeState): number {
  return STATES[state].ttlSeconds;
}

/**
 * Judges an already-fetched document, exactly as the page's report does —
 * including which version's schemas do the judging. A badge that measured
 * every feed against the newest release would turn every supported-but-older
 * feed in the ecosystem red, on somebody else's README, for months after each
 * spec release.
 */
async function judge(text: string): Promise<BadgeVerdict> {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { state: "invalid", detail: "the document is not valid JSON" };
  }

  const kind = detectDocumentKind(json);
  if (kind === "unknown") {
    return { state: "invalid", detail: "neither an OTE feed nor an OTE event" };
  }

  const report = await validateDocument(json, { kind });
  const against = report.checkedVersion ? ` against spec ${report.checkedVersion}` : "";
  return report.valid
    ? { state: "valid", detail: `a valid OTE ${kind}${against}` }
    : {
        state: "invalid",
        detail: `${report.errors.length} schema error(s) in the ${kind}${against}`,
      };
}

/**
 * URL in, one word out. Discovery and validation stay separate on the way —
 * "no feed found" and "invalid" are different bugs to go fix, and a badge that
 * merged them would send organizers to the wrong file.
 */
export async function resolveBadge(target: string, deps: FetchDeps): Promise<BadgeVerdict> {
  const first = await fetchDocument(target, deps);
  if (!first.ok) return { state: "unreachable", detail: first.message };

  const found = discover({
    url: first.finalUrl,
    contentType: first.contentType,
    body: first.body,
  });

  switch (found.outcome) {
    case "document":
      return await judge(found.text);

    case "not-found":
      return { state: "not-discovered", detail: found.reason };

    case "unsupported":
      return { state: "not-discovered", detail: found.reason };

    case "candidates": {
      if (found.candidates.length > 1) {
        return {
          state: "ambiguous",
          detail: `${found.candidates.length} feeds declared by this page`,
        };
      }
      const candidate = found.candidates[0];
      if (candidate.source === "embedded") {
        return await judge(candidate.inlineDocument ?? "");
      }

      const second = await fetchDocument(candidate.url, deps);
      if (!second.ok) return { state: "unreachable", detail: second.message };

      const linked = discover({
        url: second.finalUrl,
        contentType: second.contentType,
        body: second.body,
      });
      if (linked.outcome !== "document") {
        return {
          state: "not-discovered",
          detail: "the feed this page links to is not an OTE document",
        };
      }
      return await judge(linked.text);
    }
  }
}

const LABEL = "OTE feed";

/**
 * Width of a string at 11px in the badge's font, to within a pixel or two.
 * An SVG cannot measure text, and a badge whose halves do not fit its words
 * is the classic way this goes wrong; the table errs wide on purpose.
 */
function textWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    if ("iljI.,:;'|!".includes(char)) width += 3;
    else if ("frt()[]-".includes(char)) width += 4.5;
    else if ("mwMW@".includes(char)) width += 9.5;
    else if (char === char.toUpperCase() && char !== char.toLowerCase()) width += 7.5;
    else width += 6.4;
  }
  return width;
}

/**
 * The badge, flat two-tone, in the house palette. No `<style>`, no external
 * font, no remote text: it renders under `default-src 'none'` and stays an
 * image even when the document behind it is hostile.
 */
export function renderBadge(state: BadgeState): string {
  const { text, color } = STATES[state];
  const pad = 9;
  const labelWidth = Math.round(textWidth(LABEL) + pad * 2);
  const valueWidth = Math.round(textWidth(text) + pad * 2);
  const width = labelWidth + valueWidth;
  const title = `${LABEL}: ${text}`;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" `,
    `viewBox="0 0 ${width} 20" role="img" aria-label="${title}">`,
    `<title>${title}</title>`,
    `<rect width="${width}" height="20" rx="3" fill="#10131a"/>`,
    `<rect x="${labelWidth}" width="${valueWidth}" height="20" rx="3" fill="${color}"/>`,
    // Square off the inner edge of the right-hand half, which the rounded
    // rect above would otherwise notch out of the middle of the badge.
    `<rect x="${labelWidth}" width="4" height="20" fill="${color}"/>`,
    `<g fill="#ffffff" text-anchor="middle" font-size="11" `,
    `font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif">`,
    `<text x="${labelWidth / 2}" y="14">${LABEL}</text>`,
    `<text x="${labelWidth + valueWidth / 2}" y="14">${text}</text>`,
    `</g></svg>`,
  ].join("");
}
