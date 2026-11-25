import { describe, expect, it } from "vitest";
import { markdownToCalendarText } from "../src/plain-text.js";

describe("calendar plain text", () => {
  it("renders headings, emphasis, links and lists without Markdown syntax", () => {
    const source = "### Join us\n\nA **great** event at [our site](https://example.org).\n\n1. [Calendar](https://example.org/calendar)\n2. **Updates**";
    expect(markdownToCalendarText(source)).toBe("Join us\n\nA great event at our site (https://example.org).\n\n1. Calendar (https://example.org/calendar)\n2. Updates");
  });
  it("keeps bare URLs and leaves ordinary text readable", () => {
    expect(markdownToCalendarText("Visit https://example.org\nQuestions welcome")).toBe("Visit https://example.org\nQuestions welcome");
  });
});
