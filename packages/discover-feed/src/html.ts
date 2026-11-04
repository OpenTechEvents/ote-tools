/**
 * A deliberately small HTML scanner. It exists because discovery must run in
 * three places with three different DOMs available (a browser tab, a
 * Cloudflare Worker, a Node test) and because the input is, by definition,
 * someone else's page: a scanner that only ever reads attribute values can't
 * be tricked into executing anything. It does not build a tree and makes no
 * claim of being an HTML parser — it looks for `<link>` the way a feed
 * reader does. It used to scan `<script type="application/ote+json">` too,
 * behind a flag; embedding is out of scope as of OTE Spec 0.6 (D036).
 */

import { normalizeMediaType } from "./media-types.js";

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
