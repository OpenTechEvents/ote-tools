import { describe, expect, it } from "vitest";

import { checkUrl } from "../../../workers/validator/src/ssrf.js";
import {
  buildConvertIcsUrl,
  buildConvertRssUrl,
  buildFeedlyUrl,
  buildGoogleCalendarUrl,
  buildOtePreviewUrl,
  buildOteReaderUrl,
  isConvertibleFeedUrl,
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

describe("the conversion-service builders (#186)", () => {
  it("URL-encodes the JSON feed under convert.opentechevents.org/ics", () => {
    expect(buildConvertIcsUrl(JSON_URL)).toBe(
      "https://convert.opentechevents.org/ics?feed=https%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.json",
    );
  });

  it("URL-encodes the JSON feed under convert.opentechevents.org/rss", () => {
    expect(buildConvertRssUrl(JSON_URL)).toBe(
      "https://convert.opentechevents.org/rss?feed=https%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.json",
    );
  });

  // The #166 shape, now one layer in: a feed URL carrying its own query
  // string is nested in `feed=`, and that URL is then nested again in
  // Google's `cid=`. Asserted on what the services receive, not on how the
  // string looks.
  describe("a feed URL that carries its own query string", () => {
    const QUERY_FEED = "https://example.org/api/events?org=pycamp&format=ote";

    it("round-trips through the converter's own feed parameter", () => {
      for (const build of [buildConvertIcsUrl, buildConvertRssUrl]) {
        const url = new URL(build(QUERY_FEED));
        expect(url.searchParams.get("feed")).toBe(QUERY_FEED);
        expect([...url.searchParams.keys()]).toEqual(["feed"]);
      }
    });

    it("survives being nested again inside Google's cid", () => {
      const url = buildGoogleCalendarUrl(buildConvertIcsUrl(QUERY_FEED));
      const cid = cidOf(url);
      expect(otherParams(url)).toEqual([]);
      expect(cid).toBe(
        "webcal://convert.opentechevents.org/ics?feed=https%3A%2F%2Fexample.org%2Fapi%2Fevents%3Forg%3Dpycamp%26format%3Dote",
      );
      // What the converter itself then parses out of that cid.
      expect(new URL(cid!.replace("webcal://", "https://")).searchParams.get("feed")).toBe(QUERY_FEED);
    });
  });

  describe("isConvertibleFeedUrl", () => {
    it("accepts an absolute http(s) URL", () => {
      expect(isConvertibleFeedUrl(JSON_URL)).toBe(true);
      expect(isConvertibleFeedUrl("http://example.org/feed.json")).toBe(true);
      expect(isConvertibleFeedUrl("https://example.org:8443/feed.json")).toBe(true);
    });

    it("rejects a URL only the host page's browser could resolve", () => {
      // A relative or protocol-relative feed-json is valid for the OTE
      // group's own links — the browser resolves it against the page — but
      // the conversion service resolves the URL itself, so handing it one of
      // these produces a link guaranteed to fail.
      for (const value of ["/events/feed.json", "events/feed.json", "//example.org/feed.json", ""]) {
        expect(isConvertibleFeedUrl(value)).toBe(false);
      }
    });

    it("rejects a non-http scheme", () => {
      for (const value of ["file:///tmp/feed.json", "data:application/json,{}", "webcal://example.org/f.ics"]) {
        expect(isConvertibleFeedUrl(value)).toBe(false);
      }
    });

    it("rejects credentials rather than handing them to Google and Feedly", () => {
      // The service refuses these outright (blocked-credentials), so the
      // link cannot work — and building it anyway would percent-encode a
      // publisher's password into a URL that a calendar client then stores
      // for years.
      expect(isConvertibleFeedUrl("https://user:pass@example.org/feed.json")).toBe(false);
      expect(isConvertibleFeedUrl("https://user@example.org/feed.json")).toBe(false);
    });

    it("rejects a host that is not publicly routable", () => {
      for (const value of [
        "http://localhost:4000/feed.json",
        "http://app.localhost/feed.json",
        "http://metadata.google.internal/feed.json",
        "http://registry.internal/feed.json",
        "http://127.0.0.1:8080/feed.json",
        "http://[::1]/feed.json",
        "http://192.168.1.1/feed.json",
        "http://169.254.169.254/feed.json",
        "https://example.org:22/feed.json",
      ]) {
        expect(isConvertibleFeedUrl(value)).toBe(false);
      }
    });
  });

  // The gate above is a copy of the service's own syntactic checks, kept in
  // this bundle because importing Worker code into a widget is not an
  // option. A copy with nothing holding it to the original is how it stops
  // matching, so this imports the real decider and compares verdicts.
  describe("the gate agrees with the service it is predicting", () => {
    const CASES = [
      "https://communitybuilders.dev/events/feed.json",
      "http://example.org/feed.json",
      "https://example.org:8443/feed.json",
      "https://example.org:22/feed.json",
      "https://user:pass@example.org/feed.json",
      "http://localhost:4000/feed.json",
      "http://app.localhost/feed.json",
      "http://metadata.google.internal/feed.json",
      "http://registry.internal/feed.json",
      "http://127.0.0.1:8080/feed.json",
      "http://[::1]/feed.json",
      "http://192.168.1.1/feed.json",
      "http://169.254.169.254/feed.json",
      "file:///tmp/feed.json",
      "data:application/json,{}",
      "not a url",
      "/events/feed.json",
    ];

    it("refuses everything checkUrl refuses", () => {
      const disagreements = CASES.filter((value) => isConvertibleFeedUrl(value) && !checkUrl(value).ok);
      expect(disagreements).toEqual([]);
    });

    it("has exactly one documented divergence: public IP literals", () => {
      // Re-implementing the service's IPv4/IPv6 parsers in a page bundle to
      // rescue a feed published on a bare public IP is not worth the bytes.
      // That publisher can still declare feed-ics by hand.
      const stricter = CASES.concat("http://93.184.216.34/feed.json").filter(
        (value) => !isConvertibleFeedUrl(value) && checkUrl(value).ok,
      );
      expect(stricter).toEqual(["http://93.184.216.34/feed.json"]);
    });
  });
});
