/**
 * A deliberately small HTML scanner. It exists because discovery must run in
 * three places with three different DOMs available (a browser tab, a
 * Cloudflare Worker, a Node test) and because the input is, by definition,
 * someone else's page: a scanner that only ever reads attribute values can't
 * be tricked into executing anything. It does not build a tree and makes no
 * claim of being an HTML parser — it looks for `<link>` (and, behind a flag,
 * `<script type="application/ote+json">`) the way a feed reader does.
 */

import { normalizeMediaType, OTE_MEDIA_TYPES } from "./media-types.js";

/** A `<link>` element reduced to the attributes discovery cares about. */
export interface HtmlLink {
  rel: string;
  /** Lowercased, parameters stripped; "" when the attribute is absent. */
  type: string;
  href: string;
  title: string;
}

const COMMENT = /<!--[\s\S]*?-->/g;
const LINK_TAG = /<link\b([^>]*)>/gi;
const SCRIPT_TAG = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
const ATTRIBUTE = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'`=<>]+))/g;

/**
 * The `<head>` is where the spec puts the discovery `<link>`. Cutting the
 * document there keeps a `<link>` in the body — or inside some inert template
 * — from being read as the site's declared feed.
 */
export function headSection(html: string): string {
  const withoutComments = html.replace(COMMENT, "");
  const end = withoutComments.search(/<\/head\s*>|<body\b/i);
  return end === -1 ? withoutComments : withoutComments.slice(0, end);
}

function parseAttributes(source: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const match of source.matchAll(ATTRIBUTE)) {
    const name = match[1].toLowerCase();
    const value = match[3] ?? match[4] ?? match[5] ?? "";
    // First occurrence wins, as browsers do with duplicate attributes.
    if (!(name in attributes)) attributes[name] = value;
  }
  return attributes;
}

/** Decodes the handful of entities that legitimately show up inside an href. */
function decodeEntities(value: string): string {
  return value
    .replace(/&(?:amp|AMP);/g, "&")
    .replace(/&(?:lt|LT);/g, "<")
    .replace(/&(?:gt|GT);/g, ">")
    .replace(/&(?:quot|QUOT);/g, '"')
    .replace(/&(?:#39|apos);/g, "'");
}

/** Every `<link>` in the head, in document order. */
export function parseLinkElements(html: string): HtmlLink[] {
  const links: HtmlLink[] = [];
  for (const match of headSection(html).matchAll(LINK_TAG)) {
    const attributes = parseAttributes(match[1]);
    links.push({
      rel: (attributes.rel ?? "").trim().toLowerCase(),
      type: normalizeMediaType(attributes.type ?? ""),
      href: decodeEntities((attributes.href ?? "").trim()),
      title: decodeEntities(attributes.title ?? "").trim(),
    });
  }
  return links;
}

/**
 * Contents of every `<script type="application/ote+json">` in the document —
 * an open question in the spec, hence gated behind a flag by callers.
 */
export function parseEmbeddedFeeds(html: string): string[] {
  const embedded: string[] = [];
  for (const match of html.replace(COMMENT, "").matchAll(SCRIPT_TAG)) {
    const attributes = parseAttributes(match[1]);
    const type = normalizeMediaType(attributes.type ?? "");
    if ((OTE_MEDIA_TYPES as readonly string[]).includes(type)) embedded.push(match[2].trim());
  }
  return embedded;
}
