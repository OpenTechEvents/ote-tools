import { marked } from "marked";

/**
 * A token as this module walks it. `marked`'s own token union is far more
 * specific, but every shape it can take is covered by these four optional
 * members, and walking them structurally keeps the traversal one function
 * instead of one branch per token type.
 */
interface TokenLike {
  type: string;
  text?: string;
  tokens?: TokenLike[];
  items?: TokenLike[];
}

/** Concatenates the text of inline tokens, dropping any HTML tags. */
function inlineText(tokens: TokenLike[]): string {
  return tokens
    .map((token) => {
      // A hard break is a real line break in the plain-text rendering.
      if (token.type === "br") return "\n";
      // Raw HTML found inside Markdown: the tag itself is markup, not text.
      // Dropping it (rather than keeping "<em>") leaves the text around it
      // intact, which is what a description reads like without markup.
      if (token.type === "html") return "";
      // An image's `text` is its alt text — the only part that reads as prose.
      if (token.tokens && token.tokens.length > 0) return inlineText(token.tokens);
      return token.text ?? "";
    })
    .join("");
}

/** Renders one block-level token to plain text. */
function blockText(token: TokenLike): string {
  switch (token.type) {
    case "space":
    case "hr":
    case "html":
      return "";
    case "code":
      return token.text ?? "";
    case "list":
      // List items keep one per line: the bullet is markup, the line break
      // is the part that survives into plain text.
      return (token.items ?? [])
        .map((item) => (item.tokens ?? []).map(blockText).filter(Boolean).join("\n"))
        .filter(Boolean)
        .join("\n");
    case "blockquote":
      return (token.tokens ?? []).map(blockText).filter(Boolean).join("\n\n");
    case "table":
      // Tables have no plain-text shape worth inventing; the spec's own
      // guidance is that `description` is prose. Dropped rather than
      // rendered as pipes.
      return "";
    default:
      return token.tokens && token.tokens.length > 0
        ? inlineText(token.tokens)
        : (token.text ?? "");
  }
}

/**
 * Renders an OTE `description` (plain text or Markdown, per the spec) to
 * plain text, because schema.org `description` is plain text — Google
 * explicitly rejects markup there, and a description that reads
 * `**Bold** intro with a [link](https://example.org)` in a search result is
 * worse than no structured data at all.
 *
 * A description with no Markdown in it passes through unchanged (that's the
 * common case). Pure and deterministic: no network, no DOM.
 *
 * Raw HTML is never text: an inline tag is dropped and the prose around it
 * kept, while a block-level HTML chunk is dropped whole, contents included.
 * That matters for something like a stray `<script>` in a description — it
 * leaves nothing behind to end up in the page's structured data.
 */
export function markdownToPlainText(markdown: string): string {
  const tokens = marked.lexer(markdown) as unknown as TokenLike[];
  return tokens.map(blockText).filter(Boolean).join("\n\n").trim();
}
