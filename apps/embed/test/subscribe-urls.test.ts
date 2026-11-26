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

/** What Google actually receives, rather than how the string looks. */
const cidOf = (url: string): string | null => new URL(url).searchParams.get("cid");

/** Query parameters other than `cid` — a raw nested URL leaks into these. */
const otherParams = (url: string): string[] =>
  [...new URL(url).searchParams.keys()].filter((key) => key !== "cid");

describe("toWebcalUrl", () => {
  it("replaces the https:// scheme with webcal://, unencoded", () => {
    expect(toWebcalUrl(ICS_URL)).toBe("webcal://communitybuilders.dev/events/feed.ics");
  });

  it("replaces a bare http:// scheme too", () => {
    expect(toWebcalUrl("http://example.org/feed.ics")).toBe("webcal://example.org/feed.ics");
  });
});

describe("buildGoogleCalendarUrl", () => {
  it("percent-encodes the webcal:// URL in the cid query param", () => {
    expect(buildGoogleCalendarUrl(ICS_URL)).toBe(
      "https://www.google.com/calendar/render?cid=webcal%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.ics",
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
    // `webcal://` and `feed://` are handed to the OS as-is, so they keep the
    // publisher's spelling. The Google link is a query parameter and does
    // not — see the assertion below it.
    expect(toWebcalUrl(NON_ASCII_ICS)).toBe("webcal://ejemplo.org/eventos/pycamp-españa/feed.ics");
    expect(toFeedProtocolUrl(NON_ASCII_RSS)).toBe("feed://ejemplo.org/eventos/pycamp-españa/feed.xml");
  });

  it("encodes a non-ASCII path for Google, and Google decodes it back", () => {
    const url = buildGoogleCalendarUrl(NON_ASCII_ICS);
    expect(url).toBe(
      "https://www.google.com/calendar/render?cid=webcal%3A%2F%2Fejemplo.org%2Feventos%2Fpycamp-espa%C3%B1a%2Ffeed.ics",
    );
    expect(cidOf(url)).toBe("webcal://ejemplo.org/eventos/pycamp-españa/feed.ics");
  });
});

describe("buildGoogleCalendarUrl: a feed URL that carries its own query string (#166)", () => {
  // Live shape: the hosted converter turns any OTE feed into ICS, and its URL
  // is two query parameters. Ordered `lang` first so that a truncated cid
  // loses the feed entirely — the converter answers 400, which is how this
  // bug was made to fail loudly rather than silently serve the wrong feed.
  const CONVERTED_ICS =
    "https://convert.opentechevents.org/ics?lang=es&feed=https%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.json";

  it("delivers the whole feed URL, including everything after the first &", () => {
    const url = buildGoogleCalendarUrl(CONVERTED_ICS);
    expect(cidOf(url)).toBe(
      "webcal://convert.opentechevents.org/ics?lang=es&feed=https%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.json",
    );
  });

  // The order the real consumer emits: opentechevents.org's text-language
  // control builds `feed` first, `lang` second. Truncation there keeps the
  // feed and drops the *language*, so the visitor subscribes successfully to
  // the wrong translation — a 200, no error, nothing to report. Both orders
  // are covered because the failure mode differs, not the cause.
  //
  // The feed is a registered adopter with real translations (96 events, 36
  // with `es`, `textLanguage: "en"`), chosen because the degradation is
  // observable there rather than theoretical. Measured against the live
  // converter: `&lang=es` returns 230430 b of `SUMMARY;LANGUAGE=es`, while
  // the truncated URL returns 220534 b of `SUMMARY;LANGUAGE=en` — so a
  // visitor who asks for Spanish subscribes to the English calendar, and
  // the ICS itself advertises the wrong language.
  const CONSUMER_ICS =
    "https://convert.opentechevents.org/ics?feed=https%3A%2F%2Fconfs.rauljimenez.info%2Fevents.json&lang=es";

  it("keeps the chosen language, which truncation dropped silently", () => {
    const url = buildGoogleCalendarUrl(CONSUMER_ICS);
    expect(cidOf(url)).toBe(
      "webcal://convert.opentechevents.org/ics?feed=https%3A%2F%2Fconfs.rauljimenez.info%2Fevents.json&lang=es",
    );
    expect(cidOf(url)).toContain("lang=es");
  });

  it("leaks nothing into a sibling query parameter", () => {
    // The defect: an unencoded cid ended at the feed's own `&`, and the rest
    // arrived as separate parameters that Google ignores.
    expect(otherParams(buildGoogleCalendarUrl(CONVERTED_ICS))).toEqual([]);
    expect(otherParams(buildGoogleCalendarUrl(CONSUMER_ICS))).toEqual([]);
  });

  it("survives a space and a fragment character in the path", () => {
    expect(cidOf(buildGoogleCalendarUrl("https://example.org/my feed.ics"))).toBe(
      "webcal://example.org/my feed.ics",
    );
    expect(cidOf(buildGoogleCalendarUrl("https://example.org/feed.ics#x"))).toBe(
      "webcal://example.org/feed.ics#x",
    );
  });
});
