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
  const paragraphs = Array.from(body?.querySelectorAll("p") ?? []);
  let when: string | undefined;
  let location: string | undefined;
  const description: string[] = [];

  for (const paragraph of paragraphs) {
    const label = paragraph.querySelector("strong")?.textContent?.trim();
    const content = paragraph.textContent
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
