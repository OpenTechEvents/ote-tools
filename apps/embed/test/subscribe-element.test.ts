// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";

import { defineOteSubscribe, type OteSubscribeElement } from "../src/subscribe-element.js";

defineOteSubscribe();

const ICS_URL = "https://communitybuilders.dev/events/feed.ics";
const RSS_URL = "https://communitybuilders.dev/events/feed.xml";
const JSON_URL = "https://communitybuilders.dev/events/feed.json";

function createElement(attrs: Record<string, string> = {}): OteSubscribeElement {
  const el = document.createElement("ote-subscribe") as OteSubscribeElement;
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  return el;
}

function trigger(el: OteSubscribeElement): HTMLButtonElement {
  return el.shadowRoot!.querySelector<HTMLButtonElement>(".trigger")!;
}

function menuLinks(el: OteSubscribeElement): HTMLAnchorElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll<HTMLAnchorElement>(".menu a"));
}

function badge(el: OteSubscribeElement, group: string): HTMLButtonElement {
  return el.shadowRoot!.querySelector<HTMLButtonElement>(`.trigger[data-group="${group}"]`)!;
}

function menuLinksFor(el: OteSubscribeElement, group: string): HTMLAnchorElement[] {
  const item = badge(el, group).closest(".item")!;
  return Array.from(item.querySelectorAll<HTMLAnchorElement>(".menu a"));
}

describe("<ote-subscribe>", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("disables the trigger when neither feed-ics nor feed-rss is set", () => {
    const el = createElement();
    document.body.append(el);
    expect(trigger(el).disabled).toBe(true);
  });

  it("renders only the Calendar group when only feed-ics is set", () => {
    const el = createElement({ "feed-ics": ICS_URL });
    document.body.append(el);
    trigger(el).click();

    const hrefs = menuLinks(el).map((a) => a.href);
    expect(hrefs).toEqual([
      "https://www.google.com/calendar/render?cid=webcal://communitybuilders.dev/events/feed.ics",
      "webcal://communitybuilders.dev/events/feed.ics",
      ICS_URL,
    ]);
  });

  it("renders only the RSS group when only feed-rss is set", () => {
    const el = createElement({ "feed-rss": RSS_URL });
    document.body.append(el);
    trigger(el).click();

    const hrefs = menuLinks(el).map((a) => a.href);
    expect(hrefs).toEqual([
      "https://feedly.com/i/subscription/feed/https%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.xml",
      "feed://communitybuilders.dev/events/feed.xml",
      RSS_URL,
    ]);
  });

  it("renders all three groups when feed-ics, feed-rss, and feed-json are all set", () => {
    const el = createElement({ "feed-ics": ICS_URL, "feed-rss": RSS_URL, "feed-json": JSON_URL });
    document.body.append(el);
    trigger(el).click();

    expect(el.shadowRoot!.querySelectorAll(".menu-group-label")).toHaveLength(3);
    expect(menuLinks(el)).toHaveLength(9);
  });

  it("renders only the OTE feed group when only feed-json is set", () => {
    const el = createElement({ "feed-json": JSON_URL });
    document.body.append(el);
    trigger(el).click();

    const hrefs = menuLinks(el).map((a) => a.href);
    expect(hrefs).toEqual([
      "https://reader.opentechevents.org/?subscribe=https%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.json",
      "https://tools.opentechevents.org/preview/?feed=https%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.json",
      JSON_URL,
    ]);
  });

  it('"show" filters which links appear, as a full replacement', () => {
    const el = createElement({ "feed-ics": ICS_URL, "feed-rss": RSS_URL, show: "google,feedly" });
    document.body.append(el);
    trigger(el).click();

    expect(menuLinks(el).map((a) => a.textContent)).toEqual([
      "Subscribe with Google Calendar",
      "Subscribe with Feedly",
    ]);
  });

  it('disables the trigger when "show" excludes every link for the provided feed', () => {
    const el = createElement({ "feed-ics": ICS_URL, show: "feedly" });
    document.body.append(el);
    expect(trigger(el).disabled).toBe(true);
  });

  it("toggles aria-expanded and role=menu on open/close", () => {
    const el = createElement({ "feed-ics": ICS_URL });
    document.body.append(el);
    expect(trigger(el).getAttribute("aria-expanded")).toBe("false");
    expect(el.shadowRoot!.querySelector('[role="menu"]')).toBeNull();

    trigger(el).click();
    expect(trigger(el).getAttribute("aria-expanded")).toBe("true");
    expect(el.shadowRoot!.querySelector('[role="menu"]')).not.toBeNull();

    trigger(el).click();
    expect(trigger(el).getAttribute("aria-expanded")).toBe("false");
    expect(el.shadowRoot!.querySelector('[role="menu"]')).toBeNull();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    const el = createElement({ "feed-ics": ICS_URL });
    document.body.append(el);
    trigger(el).click();
    expect(el.shadowRoot!.querySelector('[role="menu"]')).not.toBeNull();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(el.shadowRoot!.querySelector('[role="menu"]')).toBeNull();
    expect(el.shadowRoot!.activeElement).toBe(trigger(el));
  });

  it("closes on an outside click, without moving focus", () => {
    const el = createElement({ "feed-ics": ICS_URL });
    const outside = document.createElement("button");
    document.body.append(el, outside);
    trigger(el).click();
    expect(el.shadowRoot!.querySelector('[role="menu"]')).not.toBeNull();

    outside.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    expect(el.shadowRoot!.querySelector('[role="menu"]')).toBeNull();
  });

  it("does not close on a click inside the element (e.g. on the menu itself)", () => {
    const el = createElement({ "feed-ics": ICS_URL });
    document.body.append(el);
    trigger(el).click();

    el.shadowRoot!.querySelector(".menu")!.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    expect(el.shadowRoot!.querySelector('[role="menu"]')).not.toBeNull();
  });

  describe('layout="badges"', () => {
    it("renders one badge per available group, and none for groups without a feed URL", () => {
      const el = createElement({ "feed-ics": ICS_URL, "feed-json": JSON_URL, layout: "badges" });
      document.body.append(el);

      const groups = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".trigger")).map(
        (t) => t.dataset.group,
      );
      expect(groups).toEqual(["ics", "ote"]);
    });

    it("each badge opens only its own group's links", () => {
      const el = createElement({ "feed-ics": ICS_URL, "feed-rss": RSS_URL, layout: "badges" });
      document.body.append(el);

      badge(el, "rss").click();
      expect(menuLinksFor(el, "rss").map((a) => a.href)).toEqual([
        "https://feedly.com/i/subscription/feed/https%3A%2F%2Fcommunitybuilders.dev%2Fevents%2Ffeed.xml",
        "feed://communitybuilders.dev/events/feed.xml",
        RSS_URL,
      ]);
      // No group-section label needed in badge popovers — the badge itself identifies the group.
      expect(el.shadowRoot!.querySelector(".menu-group-label")).toBeNull();
    });

    it("opening one badge closes another that was already open (mutually exclusive)", () => {
      const el = createElement({ "feed-ics": ICS_URL, "feed-rss": RSS_URL, layout: "badges" });
      document.body.append(el);

      badge(el, "ics").click();
      expect(badge(el, "ics").getAttribute("aria-expanded")).toBe("true");

      badge(el, "rss").click();
      expect(badge(el, "rss").getAttribute("aria-expanded")).toBe("true");
      expect(badge(el, "ics").getAttribute("aria-expanded")).toBe("false");
    });

    it("closes on Escape and returns focus to the badge that was open", () => {
      const el = createElement({ "feed-ics": ICS_URL, "feed-rss": RSS_URL, layout: "badges" });
      document.body.append(el);

      badge(el, "rss").click();
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      expect(el.shadowRoot!.querySelector('[role="menu"]')).toBeNull();
      expect(el.shadowRoot!.activeElement).toBe(badge(el, "rss"));
    });
  });
});
