import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { validateFeed } from "@opentechevents/validate";
import { describe, expect, it } from "vitest";

import { feedToRss, type OteFeed } from "../src/index.js";

const fixturePath = fileURLToPath(
  new URL("../fixtures/feed.json", import.meta.url),
);
const feed = JSON.parse(readFileSync(fixturePath, "utf8")) as OteFeed;
const rss = feedToRss(feed);

function itemFor(id: string): string {
  const items = rss.split("<item>").slice(1);
  const match = items.find((i) => i.includes(`>${id}</guid>`));
  if (!match) throw new Error(`no <item> with guid ${id}`);
  return match;
}

describe("feedToRss", () => {
  it("fixture is a valid OTE feed (guards the fixture itself)", () => {
    expect(validateFeed(feed).errors).toEqual([]);
  });

  it("produces an RSS 2.0 channel with feed metadata", () => {
    expect(rss.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n')).toBe(true);
    expect(rss).toContain('<rss version="2.0"');
    expect(rss).toContain("<title>OTE Export Fixtures</title>");
    expect(rss).toContain("<link>https://opentechevents.example</link>");
    expect(rss).toContain(
      "<copyright>CC-BY-4.0 (https://creativecommons.org/licenses/by/4.0/)</copyright>",
    );
    expect(rss).toContain(
      "<lastBuildDate>Mon, 06 Jul 2026 10:00:00 GMT</lastBuildDate>",
    );
    expect(rss.match(/<item>/g)).toHaveLength(feed.events.length);
  });

  it("is deterministic: no clock, lastBuildDate comes from feed.updatedAt", () => {
    expect(feedToRss(feed)).toBe(rss);
  });

  it("emits no pubDate — OTE has no publication instant", () => {
    expect(rss).not.toContain("<pubDate>");
  });

  it("guid is the event id, never a permalink", () => {
    expect(rss).toContain(
      '<guid isPermaLink="false">https://minimal.example/meetup/2026-09</guid>',
    );
  });

  it("link comes from event.url and is omitted when absent", () => {
    expect(itemFor("https://rustmadrid.example/meetups/2026-06")).toContain(
      "<link>https://rustmadrid.example/meetups/2026-06</link>",
    );
    expect(itemFor("https://minimal.example/meetup/2026-09")).not.toContain(
      "<link>",
    );
  });

  it("cancelled event: title prefixed and status in the body", () => {
    const cancelled = itemFor("https://coolconf.example/2026");
    expect(cancelled).toContain("<title>[Cancelled] CoolConf 2026</title>");
    expect(cancelled).toContain("Status:&lt;/strong&gt; cancelled");
  });

  it("scheduled/absent status leaves the title untouched", () => {
    expect(itemFor("https://rustmadrid.example/meetups/2026-06")).toContain(
      "<title>Rust Madrid — June meetup</title>",
    );
    expect(itemFor("https://minimal.example/meetup/2026-09")).toContain(
      "<title>Minimal, but valid</title>",
    );
  });

  it("dates and location go in the body, per the standards mapping", () => {
    const online = itemFor("https://pyalmeria.example/eventos/2026-06-async");
    expect(online).toContain(
      "When:&lt;/strong&gt; 2026-06-11 18:30 – 2026-06-11 20:00 (Europe/Madrid)",
    );
    expect(online).toContain(
      "&lt;a href=&quot;https://meet.example/pyalmeria&quot;&gt;",
    );
    expect(online).toContain("Attendance:&lt;/strong&gt; online");

    const multiDay = itemFor("https://devfest-levante.example/2026");
    expect(multiDay).toContain(
      "When:&lt;/strong&gt; 2026-10-16 – 2026-10-17 (Europe/Madrid)",
    );
    expect(multiDay).toContain("Where:&lt;/strong&gt; Las Naves, València");
  });

  it("maps tags to <category> elements", () => {
    const item = itemFor("https://devfest-levante.example/2026");
    expect(item).toContain("<category>cloud</category>");
    expect(item).toContain("<category>ai</category>");
    expect(item).toContain("<category>web</category>");
    expect(itemFor("https://minimal.example/meetup/2026-09")).not.toContain(
      "<category>",
    );
  });

  it("entity-encodes the embedded HTML exactly once per layer", () => {
    const online = itemFor("https://pyalmeria.example/eventos/2026-06-async");
    // "Q&A" → HTML "Q&amp;A" → embedded in XML as "Q&amp;amp;A".
    expect(online).toContain("Q&amp;amp;A");
    // Newline in the Markdown description becomes <br> in the embedded HTML.
    expect(online).toContain("&lt;br&gt;");
  });

  it("renders a Markdown description to HTML (bold, links)", () => {
    const item = itemFor("https://mdtest.example/2026-11");
    expect(item).toContain("&lt;strong&gt;Bold&lt;/strong&gt;");
    expect(item).toContain(
      "&lt;a href=&quot;https://example.org/info&quot;&gt;link&lt;/a&gt;",
    );
  });

  it("escapes raw HTML found inside a Markdown description instead of passing it through live", () => {
    const item = itemFor("https://mdtest.example/2026-11");
    expect(item).not.toContain("<script>");
    // Content-escaped once for HTML, then the whole item body once more for
    // XML — same double layer as "Q&A" → "&amp;amp;A" above.
    expect(item).toContain("&amp;lt;script&amp;gt;");
  });

  it("declares the media and dc namespaces on the root element", () => {
    expect(rss).toContain('xmlns:media="http://search.yahoo.com/mrss/"');
    expect(rss).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
  });

  it("first organizer with an email becomes <author>; others are dropped from that element", () => {
    const item = itemFor("https://pyalmeria.example/eventos/2026-06-async");
    expect(item).toContain("<author>hola@pyalmeria.example (PyAlmería)</author>");
    expect(item.match(/<author>/g)).toHaveLength(1);
    expect(item).not.toContain("<dc:creator>");
  });

  it("organizers with no email at all fall back to <dc:creator>", () => {
    const feedNoEmail: OteFeed = {
      ...feed,
      events: [{ ...feed.events[0]!, organizers: [{ name: "No Email Org" }] }],
    };
    const item = feedToRss(feedNoEmail).split("<item>")[1]!;
    expect(item).toContain("<dc:creator>No Email Org</dc:creator>");
    expect(item).not.toContain("<author>");
  });

  it("image[].alt maps to <media:content><media:description>", () => {
    const item = itemFor("https://pyalmeria.example/eventos/2026-06-async");
    expect(item).toContain(
      '<media:content url="https://pyalmeria.example/img/2026-06.png" medium="image">',
    );
    expect(item).toContain("<media:description>Event poster</media:description>");
  });

  it("cfp/eligibility/offers/partOf fold into the item body as unlabeled paragraphs", () => {
    const item = itemFor("https://devfest-levante.example/2026");
    expect(item).toContain("Call for proposals:");
    expect(item).toContain("devfest-levante.example/2026/cfp");
    expect(item).toContain("Eligibility: restricted");
    expect(item).toContain("Tickets:");
    expect(item).toContain("General");
    expect(item).toContain("Part of: DevFest");
  });

  it("moved-online: title prefixed, status visible in the body", () => {
    const item = itemFor("https://pydata-madrid.example/2026-07");
    expect(item).toContain("<title>[Moved online] PyData Madrid: now online</title>");
    expect(item).toContain("Status:&lt;/strong&gt; moved-online");
  });

  it("feed.textLanguage maps to channel <language>", () => {
    expect(rss).not.toContain("<language>"); // fixture feed has no textLanguage set
    const withLanguage = feedToRss({ ...feed, textLanguage: "es" });
    expect(withLanguage).toContain("<language>es</language>");
  });

  it("feed.license absent (D029): <copyright> is omitted, not guessed", () => {
    const withoutLicense = feedToRss({
      ...feed,
      license: undefined,
      events: feed.events.map((e) => ({ ...e, license: "CC0-1.0" })),
    });
    expect(withoutLicense).not.toContain("<copyright>");
  });
});
