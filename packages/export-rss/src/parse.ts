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
    const content = block.textContent
      ?.replace(/^(Status|When|Where|Online|Attendance):\s*/i, "")
      .trim();
    if (!content) continue;
    if (label === "When:") when = content;
    else if (label === "Where:" || label === "Online:") location = content;
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
