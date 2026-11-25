import { marked } from "marked";

interface Token {
  type: string;
  text?: string;
  href?: string;
  ordered?: boolean;
  start?: number | "";
  tokens?: Token[];
  items?: Token[];
}

function inline(tokens: Token[]): string {
  return tokens.map((token) => {
    if (token.type === "br") return "\n";
    if (token.type === "html") return "";
    const text = token.tokens ? inline(token.tokens) : (token.text ?? "");
    if (token.type === "link" && token.href && token.href !== text) return `${text} (${token.href})`;
    if (token.type === "image") return text;
    return text;
  }).join("");
}

function block(token: Token): string {
  switch (token.type) {
    case "space": case "hr": case "html": return "";
    case "list": return (token.items ?? []).map((item, index) => {
      const content = (item.tokens ?? []).map(block).filter(Boolean).join("\n");
      const bullet = token.ordered ? `${(typeof token.start === "number" ? token.start : 1) + index}.` : "•";
      return content ? `${bullet} ${content}` : "";
    }).filter(Boolean).join("\n");
    case "blockquote": return (token.tokens ?? []).map(block).filter(Boolean).join("\n\n");
    case "code": return token.text ?? "";
    default: return token.tokens ? inline(token.tokens) : (token.text ?? "");
  }
}

/** Render Markdown as readable text while retaining the targets of links. */
export function markdownToCalendarText(markdown: string): string {
  return (marked.lexer(markdown) as Token[]).map(block).filter(Boolean).join("\n\n").trim();
}
