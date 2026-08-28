import type { OteEvent } from "@opentechevents/export-jsonld";
import { describe, expect, it } from "vitest";

import { destinationById } from "../src/lib/destinations.js";
import {
  composePost,
  composerUrl,
  formatWhen,
  formatWhere,
  POST_LIMITS,
  submissionFields,
} from "../src/lib/submission.js";

const bare: OteEvent = {
  id: "https://example.org/events/meetup",
  name: "Monthly meetup",
  startDate: "2026-06-11T18:30",
  timezone: "Europe/Madrid",
};

const full: OteEvent = {
  id: "https://example.org/events/devfest",
  name: "DevFest Málaga",
  url: "https://example.org/devfest",
  description: "A one-day community conference about everything the local scene builds.",
  startDate: "2026-03-12",
  endDate: "2026-03-13",
  timezone: "Europe/Madrid",
  attendanceMode: "in-person",
  location: { venue: "Polo Digital, Málaga" },
  tags: ["javascript", "cloud", "open source"],
  languages: ["es", "en"],
  organizers: [{ name: "GDG Málaga", url: "https://example.org/gdg" }],
  offers: [{ name: "General", price: 0, currency: "EUR", url: "https://example.org/tickets" }],
  image: [{ url: "https://example.org/card.png", alt: "The DevFest stage" }],
  cfp: { url: "https://example.org/cfp", closesAt: "2026-01-31" },
};

describe("formatting", () => {
  it("reads wall-clock dates as UTC, so nobody's event moves a day", () => {
    expect(formatWhen(bare)).toBe("Thu, 11 Jun 2026, 18:30");
    expect(formatWhen(full)).toBe("Thu, 12 Mar 2026 → Fri, 13 Mar 2026");
  });

  it("says where, including the online case", () => {
    expect(formatWhere(full)).toBe("Polo Digital, Málaga");
    expect(formatWhere({ ...bare, location: { onlineUrl: "https://meet.example" } })).toBe(
      "Online — https://meet.example",
    );
    expect(formatWhere(bare)).toBeUndefined();
  });
});

describe("submissionFields", () => {
  /**
   * The repo-wide connector rule, at the one place an organizer would most
   * like it broken: a form field this event cannot answer comes back marked
   * missing, never filled with something plausible.
   */
  it("marks what the event does not carry instead of inventing it", () => {
    const byLabel = new Map(submissionFields(bare).map((field) => [field.label, field]));
    expect(byLabel.get("Name")!.value).toBe("Monthly meetup");
    expect(byLabel.get("Where")!.missing).toBe(true);
    expect(byLabel.get("Where")!.value).toBeUndefined();
    expect(byLabel.get("Where")!.wanted).toContain("nowhere to go");
    expect(byLabel.get("Format")!.missing).toBe(true);
    expect(byLabel.get("Image alt text")!.missing).toBe(true);
  });

  it("carries the real values when the event has them", () => {
    const byLabel = new Map(submissionFields(full).map((field) => [field.label, field]));
    expect(byLabel.get("Format")!.value).toBe("In person");
    expect(byLabel.get("Topics")!.value).toBe("javascript, cloud, open source");
    expect(byLabel.get("Organizers")!.value).toBe("GDG Málaga — https://example.org/gdg");
    expect(byLabel.get("Tickets")!.value).toBe("General — free — https://example.org/tickets");
    expect(byLabel.get("Image")!.value).toBe("https://example.org/card.png");
    expect(byLabel.get("Image alt text")!.value).toBe("The DevFest stage");
    expect(byLabel.get("Call for proposals")!.value).toBe(
      "https://example.org/cfp — closes Sat, 31 Jan 2026",
    );
  });

  /**
   * A missing-CFP row on a meetup-only destination's sheet is a gap the
   * organizer can do nothing about, which is exactly the kind of noise that
   * teaches people to stop reading the missing markers.
   */
  it("leaves the CFP row out where the destination would never ask", () => {
    const meetupOnly = { ...destinationById("meetup")!, accepts: "meetup" as const };
    const labels = submissionFields(full, meetupOnly).map((field) => field.label);
    expect(labels).not.toContain("Call for proposals");
    expect(submissionFields(full).map((field) => field.label)).toContain("Call for proposals");
  });
});

describe("composePost", () => {
  it("uses each destination's own markup for bold", () => {
    expect(composePost(full, "mastodon").text).toContain("**DevFest Málaga**");
    expect(composePost(full, "whatsapp").text).toContain("*DevFest Málaga*");
    expect(composePost(full, "slack").text).toContain("*DevFest Málaga*");
    expect(composePost(full, "whatsapp").text).not.toContain("**");
  });

  it("stays inside every network's limit", () => {
    const long = { ...full, description: "word ".repeat(400) };
    for (const [id, limit] of Object.entries(POST_LIMITS)) {
      const post = composePost(long, id);
      expect(post.limit).toBe(limit);
      expect(post.text.length, id).toBeLessThanOrEqual(limit);
    }
  });

  /**
   * The title, date, place and link are what make a post useful, so they are
   * never what gets cut — and when the description is, the panel says so
   * rather than shipping a sentence that stops mid-word without warning.
   */
  it("cuts the description, never the details, and admits it", () => {
    const post = composePost({ ...full, description: "word ".repeat(400) }, "x");
    expect(post.trimmed).toBe(true);
    expect(post.text).toContain("DevFest Málaga");
    expect(post.text).toContain("https://example.org/devfest");
    expect(post.text).toContain("…");
    expect(composePost(full, "mastodon").trimmed).toBe(false);
  });

  it("adds hashtags on social networks and not in chat groups", () => {
    expect(composePost(full, "mastodon").text).toContain("#javascript");
    // "open source" is one tag; the space cannot survive into a hashtag.
    expect(composePost(full, "mastodon").text).toContain("#opensource");
    expect(composePost(full, "telegram").text).not.toContain("#javascript");
  });

  it("omits what the event does not have rather than leaving a blank line", () => {
    const post = composePost(bare, "bluesky");
    expect(post.text).toBe("**Monthly meetup**\nThu, 11 Jun 2026, 18:30");
  });
});

describe("composerUrl", () => {
  it("carries the text where a network takes it", () => {
    const url = new URL(composerUrl("bluesky", "hello there")!);
    expect(url.origin + url.pathname).toBe("https://bsky.app/intent/compose");
    expect(url.searchParams.get("text")).toBe("hello there");
    expect(composerUrl("whatsapp", "hi")).toContain("https://wa.me/?text=");
  });

  it("telegram needs a URL to share, so without one there is no link", () => {
    expect(composerUrl("telegram", "hi")).toBeUndefined();
    expect(composerUrl("telegram", "hi", "https://example.org")).toContain("t.me/share/url");
  });

  /**
   * From 0.4.0 an event URL may carry non-ASCII characters as published
   * (`format: "iri"`). Here it is the *value of a query parameter* in somebody
   * else's intent link, and encoding it is therefore correct — that is a
   * different operation from rewriting the address itself, which nothing here
   * may do. Both halves are asserted so neither gets "simplified" later: the
   * parameter survives one round of decoding as the literal address, and the
   * link a network receives carries no raw `ñ`.
   */
  it("encodes a non-ASCII event URL as a parameter, and never rewrites the address", () => {
    const eventUrl = "https://example.org/eventos/pycamp-españa";
    const post = composePost({ ...full, url: eventUrl }, "telegram");
    // The address itself reaches the post exactly as the feed publishes it.
    expect(post.text).toContain(eventUrl);

    const link = composerUrl("telegram", post.text, eventUrl)!;
    expect(link).toContain(encodeURIComponent(eventUrl));
    expect(link).not.toContain("ñ");
    const parsed = new URL(link);
    expect(parsed.searchParams.get("url")).toBe(eventUrl);
    expect(parsed.searchParams.get("text")).toContain(eventUrl);
  });

  /**
   * Mastodon's composer is per-instance and LinkedIn dropped text prefilling.
   * A button that silently loses the post would be worse than no button.
   */
  it("returns nothing where no such link exists", () => {
    expect(composerUrl("mastodon", "hi")).toBeUndefined();
    expect(composerUrl("linkedin", "hi")).toBeUndefined();
    expect(composerUrl("discord", "hi")).toBeUndefined();
    expect(composerUrl("slack", "hi")).toBeUndefined();
  });
});
