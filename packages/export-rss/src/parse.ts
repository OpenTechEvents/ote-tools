import { LABELS, type Labels } from "@opentechevents/validate";

export interface RssPreviewEvent {
  title: string;
  link?: string;
  guid?: string;
  description?: string;
  when?: string;
  location?: string;
}

export interface RssPreviewFeed {
  title?: string;
  description?: string;
  license?: string;
  link?: string;
  events: RssPreviewEvent[];
}

function text(node: ParentNode, selector: string): string | undefined {
  const value = node.querySelector(selector)?.textContent?.trim();
  return value || undefined;
}

function parseItemDescription(html: string | undefined): {
  text?: string;
  when?: string;
  location?: string;
} {
  if (!html) return {};
  const doc = new DOMParser().parseFromString(
    `<main>${html}</main>`,
    "text/html",
  );
  const body = doc.querySelector("main");
  // Top-level blocks, not just <p>: the Markdown-rendered `description` can
  // contain <ul>/<ol>/<h1-6>/<blockquote>/etc., and only descending into
  // direct children (not querySelectorAll, which would also match a <p>
  // nested inside one of those) avoids double-counting their text.
  const blocks = Array.from(body?.children ?? []);
  let when: string | undefined;
  let location: string | undefined;
  const description: string[] = [];

  for (const block of blocks) {
    // The labeled metadata fields (When/Where/Online/...) are always plain
    // <p><strong>Label:</strong> ...</p>, emitted by field() in index.ts —
    // never any other tag, so only <p> needs to be checked for a label.
    const label =
      block.tagName === "P" ? block.querySelector("strong")?.textContent?.trim() : undefined;
    // Strip only the label this block actually carries, and only when the
    // exporter is the one who wrote it. Matching every locale's labels
    // against every block ate publisher prose instead: an English feed whose
    // description began "Estado: todo va bien" lost those words, and each new
    // language added another way to mangle a different language's text.
    const text = block.textContent?.trim() ?? "";
    const name = label?.slice(0, -1);
    const ours = name !== undefined && FIELD_LABELS.has(name);
    const content = (ours && text.startsWith(label!) ? text.slice(label!.length) : text).trim();
    if (!content) continue;
    if (ours && WHEN_LABELS.has(name!)) when = content;
    else if (ours && WHERE_LABELS.has(name!)) location = content;
    else if (!label) description.push(content);
  }

  return {
    text: description.join("\n\n") || body?.textContent?.trim() || undefined,
    when,
    location,
  };
}

/**
 * Reads the RSS 2.0 shape emitted by @opentechevents/export-rss into a small
 * preview model. Browser-only: the central tools are static web apps and use
 * the platform XML parser.
 */
/**
 * The field names `feedToRss` writes, in every language it can write them in.
 *
 * Derived from the same table the exporter uses, because the two halves of a
 * round trip drifting apart is the failure here: a label added for one
 * language and recognised in none leaves the date it introduces sitting in
 * the description as prose.
 */
const labelSet = (pick: (labels: Labels) => string): Set<string> =>
  new Set(Object.values(LABELS).map(pick));
const WHEN_LABELS = labelSet((labels) => labels.when);
const WHERE_LABELS = new Set([
  ...labelSet((labels) => labels.where),
  ...labelSet((labels) => labels.online),
]);
/** Every field name the exporter writes, in every language it has. */
const FIELD_LABELS = new Set(
  Object.values(LABELS).flatMap((labels) => [
    labels.status, labels.when, labels.where, labels.online, labels.attendance,
  ]),
);

export function rssToPreviewFeed(xml: string): RssPreviewFeed {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error(parserError.textContent?.trim() || "Invalid XML");
  }
  const channel = doc.querySelector("rss > channel");
  if (!channel) throw new Error("No RSS channel found");

  return {
    title: text(channel, ":scope > title"),
    description: text(channel, ":scope > description"),
    license: text(channel, ":scope > copyright"),
    link: text(channel, ":scope > link"),
    events: Array.from(channel.querySelectorAll(":scope > item")).map(
      (item) => {
        const parsedDescription = parseItemDescription(
          text(item, ":scope > description"),
        );
        return {
          title: text(item, ":scope > title") ?? "(untitled item)",
          link: text(item, ":scope > link"),
          guid: text(item, ":scope > guid"),
          description: parsedDescription.text,
          when: parsedDescription.when,
          location: parsedDescription.location,
        };
      },
    ),
  };
}
