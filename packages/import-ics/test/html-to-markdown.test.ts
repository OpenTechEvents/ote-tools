import { describe, expect, it } from "vitest";

import { htmlToMarkdown, looksLikeHtml } from "../src/html-to-markdown.js";

describe("looksLikeHtml", () => {
  it("detects recognized tags only", () => {
    expect(looksLikeHtml("<p>hi</p>")).toBe(true);
    expect(looksLikeHtml("Talk about <b>Rust</b>")).toBe(true);
    expect(looksLikeHtml("line one<br>line two")).toBe(true);
  });

  it("ignores plain text that merely contains angle brackets", () => {
    expect(looksLikeHtml("a < b and c > d")).toBe(false);
    expect(looksLikeHtml("use <T> generics")).toBe(false);
    expect(looksLikeHtml("no markup at all")).toBe(false);
    // Entities alone are not proof of HTML — could be literal text.
    expect(looksLikeHtml("fish &amp; chips")).toBe(false);
  });
});

describe("htmlToMarkdown", () => {
  it("maps inline formatting", () => {
    expect(htmlToMarkdown("<b>bold</b> and <em>italic</em> and <code>x</code>")).toBe(
      "**bold** and *italic* and `x`",
    );
  });

  it("maps links, keeping bare ones as plain URLs", () => {
    expect(htmlToMarkdown('RSVP at <a href="https://x.example/e/1">this page</a>')).toBe(
      "RSVP at [this page](https://x.example/e/1)",
    );
    expect(
      htmlToMarkdown('<a href="https://x.example/1">https://x.example/1</a>'),
    ).toBe("https://x.example/1");
  });

  it("maps paragraphs, line breaks and headings", () => {
    expect(htmlToMarkdown("<p>one</p><p>two<br>three</p>")).toBe(
      "one\n\ntwo\nthree",
    );
    expect(htmlToMarkdown("<h2>Agenda</h2><p>talks</p>")).toBe(
      "## Agenda\n\ntalks",
    );
  });

  it("maps unordered and ordered lists", () => {
    expect(htmlToMarkdown("<ul><li>a</li><li>b</li></ul>")).toBe("- a\n- b");
    expect(htmlToMarkdown("<ol><li>first</li><li>second</li></ol>")).toBe(
      "1. first\n2. second",
    );
  });

  it("decodes entities after stripping, so escaped markup stays literal", () => {
    expect(htmlToMarkdown("<p>fish &amp; chips &mdash; 5&euro;</p>")).toBe(
      "fish & chips — 5€",
    );
    expect(htmlToMarkdown("<p>&lt;b&gt;not bold&lt;/b&gt;</p>")).toBe(
      "<b>not bold</b>",
    );
    expect(htmlToMarkdown("<p>code point &#233; and &#xE9;</p>")).toBe(
      "code point é and é",
    );
  });

  it("strips unknown tags and preserves <pre> as a fence", () => {
    expect(htmlToMarkdown('<p><span class="x">kept text</span></p>')).toBe(
      "kept text",
    );
    expect(htmlToMarkdown("<pre>let x = 1;\nlet y = 2;</pre>")).toBe(
      "```\nlet x = 1;\nlet y = 2;\n```",
    );
  });

  it("drops scripts, styles and comments entirely", () => {
    expect(
      htmlToMarkdown("<p>safe</p><script>alert(1)</script><!-- note -->"),
    ).toBe("safe");
  });
});
