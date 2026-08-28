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

describe("a non-ASCII feed URL", () => {
  // OTE Spec 0.4.0 validates HTTP(S) URLs as `iri`, so a feed can live at a
  // literal `…/pycamp-españa/feed.json`. Percent-encoding is correct for the
  // query-parameter builders and wrong for the scheme-swapping ones: the
  // handler that receives a webcal:// or feed:// URL is a calendar/reader app
  // opening the address itself, not a service reading it out of a parameter.
  const NON_ASCII_ICS = "https://ejemplo.org/eventos/pycamp-españa/feed.ics";
  const NON_ASCII_JSON = "https://ejemplo.org/eventos/pycamp-españa/feed.json";
  const NON_ASCII_RSS = "https://ejemplo.org/eventos/pycamp-españa/feed.xml";

  it("is encoded once in the query-parameter links", () => {
    const encoded = "https%3A%2F%2Fejemplo.org%2Feventos%2Fpycamp-espa%C3%B1a%2Ffeed";
    expect(buildFeedlyUrl(NON_ASCII_RSS)).toBe(`https://feedly.com/i/subscription/feed/${encoded}.xml`);
    expect(buildOteReaderUrl(NON_ASCII_JSON)).toBe(
      `https://reader.opentechevents.org/?subscribe=${encoded}.json`,
    );
    expect(buildOtePreviewUrl(NON_ASCII_JSON)).toBe(
      `https://tools.opentechevents.org/preview/?feed=${encoded}.json`,
    );
  });

  it("keeps its literal spelling in the scheme-swapping links", () => {
    expect(toWebcalUrl(NON_ASCII_ICS)).toBe("webcal://ejemplo.org/eventos/pycamp-españa/feed.ics");
    expect(toFeedProtocolUrl(NON_ASCII_RSS)).toBe("feed://ejemplo.org/eventos/pycamp-españa/feed.xml");
    expect(buildGoogleCalendarUrl(NON_ASCII_ICS)).toBe(
      "https://www.google.com/calendar/render?cid=webcal://ejemplo.org/eventos/pycamp-españa/feed.ics",
    );
  });
});
