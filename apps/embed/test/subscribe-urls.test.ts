import { describe, expect, it } from "vitest";

import {
  buildFeedlyUrl,
  buildGoogleCalendarUrl,
  buildOtePreviewUrl,
  buildOteReaderUrl,
  toFeedProtocolUrl,
  toWebcalUrl,
} from "../src/subscribe-urls.js";

const ICS_URL = "https://communitybuilders.dev/events/feed.ics";
const RSS_URL = "https://communitybuilders.dev/events/feed.xml";
const JSON_URL = "https://communitybuilders.dev/events/feed.json";

describe("toWebcalUrl", () => {
  it("replaces the https:// scheme with webcal://, unencoded", () => {
    expect(toWebcalUrl(ICS_URL)).toBe("webcal://communitybuilders.dev/events/feed.ics");
  });

  it("replaces a bare http:// scheme too", () => {
    expect(toWebcalUrl("http://example.org/feed.ics")).toBe("webcal://example.org/feed.ics");
  });
});

describe("buildGoogleCalendarUrl", () => {
  it("embeds an unencoded webcal:// URL in the cid query param", () => {
    expect(buildGoogleCalendarUrl(ICS_URL)).toBe(
      "https://www.google.com/calendar/render?cid=webcal://communitybuilders.dev/events/feed.ics",
    );
  });
});

describe("buildFeedlyUrl", () => {
  it("URL-encodes the feed URL under feedly.com/i/subscription/feed/", () => {
    expect(buildFeedlyUrl(RSS_URL)).toBe(
      "https://feedly.com/i/subscription/feed/https%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.xml",
    );
  });
});

describe("toFeedProtocolUrl", () => {
  it("replaces the https:// scheme with feed://, unencoded", () => {
    expect(toFeedProtocolUrl(RSS_URL)).toBe("feed://communitybuilders.dev/events/feed.xml");
  });
});

describe("buildOteReaderUrl", () => {
  it("URL-encodes the feed URL under reader.opentechevents.org/?subscribe=", () => {
    expect(buildOteReaderUrl(JSON_URL)).toBe(
      "https://reader.opentechevents.org/?subscribe=https%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.json",
    );
  });
});

describe("buildOtePreviewUrl", () => {
  it("URL-encodes the feed URL under tools.opentechevents.org/preview/?feed=", () => {
    expect(buildOtePreviewUrl(JSON_URL)).toBe(
      "https://tools.opentechevents.org/preview/?feed=https%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.json",
    );
  });
});
