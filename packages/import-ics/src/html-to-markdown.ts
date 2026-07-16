/**
 * Minimal HTML → Markdown conversion for ICS DESCRIPTION values.
 *
 * Some producers (Meetup, Outlook, calendar apps that let users format text)
 * put HTML in DESCRIPTION even though RFC 5545 says TEXT. OTE descriptions
 * are plain text or Markdown, so HTML is re-encoded — a faithful format
 * translation, not invented data. Best effort by design: common inline and
 * block tags are mapped, unknown tags are stripped, and the caller flags the
 * event with a warning so the organizer reviews the result.
 *
 * No DOM, no dependencies: pure string transforms, so the same code runs in
 * the browser (the editor) and in Node (tests, future CLIs).
 */

/** Tags whose presence marks a value as HTML (a stray `a < b` does not). */
const KNOWN_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "u",
  "ul",
]);

const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9]*)(?:[\s/][^>]*)?>/g;

/** Whether the text contains at least one recognized HTML tag. */
export function looksLikeHtml(text: string): boolean {
  TAG_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TAG_RE.exec(text)) !== null) {
    if (KNOWN_TAGS.has(match[1].toLowerCase())) return true;
  }
  return false;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  copy: "©",
  reg: "®",
  trade: "™",
  euro: "€",
};

/** Decodes named and numeric entities; unknown ones are left untouched. */
function decodeEntities(text: string): string {
  return text.replace(
    /&(#[xX]?[0-9a-fA-F]+|[a-zA-Z]+);/g,
    (whole, body: string) => {
      if (body.startsWith("#")) {
        const hex = body[1] === "x" || body[1] === "X";
        const code = parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10);
        return Number.isFinite(code) && code > 0 && code <= 0x10ffff
          ? String.fromCodePoint(code)
          : whole;
      }
      return NAMED_ENTITIES[body.toLowerCase()] ?? whole;
    },
  );
}

/**
 * Converts an HTML fragment to Markdown. Call only when looksLikeHtml is
 * true — plain text goes through unchanged everywhere else.
 */
export function htmlToMarkdown(html: string): string {
  let text = html.replace(/\r\n?/g, "\n");

  text = text.replace(/<!--[\s\S]*?-->/g, "");
  text = text.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "");

  // Fenced code first, so nothing inside gets reinterpreted as tags.
  text = text.replace(
    /<pre[^>]*>([\s\S]*?)<\/pre>/gi,
    (_, inner: string) =>
      `\n\n\`\`\`\n${inner.replace(/<\/?[a-zA-Z][^>]*>/g, "").trim()}\n\`\`\`\n\n`,
  );

  text = text.replace(
    /<a\b[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/gi,
    (_, d: string, s: string, bare: string, inner: string) => {
      const href = d ?? s ?? bare ?? "";
      const label = inner.replace(/<\/?[a-zA-Z][^>]*>/g, "").trim();
      return label && label !== href ? `[${label}](${href})` : href;
    },
  );
  text = text.replace(
    /<img\b[^>]*src\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>/gi,
    (whole: string, d: string, s: string) => {
      const alt = /alt\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(whole);
      return `![${alt?.[1] ?? alt?.[2] ?? ""}](${d ?? s})`;
    },
  );

  text = text.replace(
    /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi,
    (_, level: string, inner: string) =>
      `\n\n${"#".repeat(Number(level))} ${inner.trim()}\n\n`,
  );
  text = text.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
  text = text.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // Ordered lists number their own items; remaining <li> become bullets.
  text = text.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner: string) => {
    let n = 0;
    return `\n${inner.replace(/<li[^>]*>/gi, () => `\n${++n}. `).replace(/<\/li>/gi, "")}\n\n`;
  });
  text = text.replace(/<li[^>]*>/gi, "\n- ").replace(/<\/li>/gi, "");
  text = text.replace(/<\/?ul[^>]*>/gi, "\n\n");

  text = text.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner: string) =>
    `\n\n${inner.trim().split("\n").map((line) => `> ${line}`).join("\n")}\n\n`,
  );

  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<hr\s*\/?>/gi, "\n\n---\n\n");
  text = text.replace(/<\/(p|div)>/gi, "\n\n");

  // Everything not handled above is stripped, then entities are decoded —
  // last, so a literal `&lt;b&gt;` never turns back into a tag.
  text = text.replace(/<\/?[a-zA-Z][^>]*>/g, "");
  text = decodeEntities(text);

  return text
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, "").replace(/^[ \t]+(?![-\d])/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
