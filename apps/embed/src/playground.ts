const feedInput = document.querySelector<HTMLInputElement>("#feed-input")!;
const limitInput = document.querySelector<HTMLInputElement>("#limit-input")!;
const layoutSelect = document.querySelector<HTMLSelectElement>("#layout-select")!;
const themeSelect = document.querySelector<HTMLSelectElement>("#theme-select")!;
const langSelect = document.querySelector<HTMLSelectElement>("#lang-select")!;
const showPastCheckbox = document.querySelector<HTMLInputElement>("#show-past-checkbox")!;
const widget = document.querySelector<HTMLElement>("#preview-widget")!;
const snippetCode = document.querySelector<HTMLElement>("#snippet-code")!;
const copyButton = document.querySelector<HTMLButtonElement>("#copy-button")!;

/** Escapes a value for embedding inside an HTML attribute. */
function attr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildSnippet(config: {
  feed: string;
  limit: string;
  layout: string;
  theme: string;
  lang: string;
  showPast: boolean;
}): string {
  const lines = [
    `<script type="module" src="https://tools.opentechevents.org/embed/ote-events.js"></script>`,
    "",
    "<ote-events",
    `  feed="${attr(config.feed)}"`,
    `  limit="${attr(config.limit)}"`,
    `  layout="${attr(config.layout)}"`,
    `  theme="${attr(config.theme)}"`,
    `  lang="${attr(config.lang)}"`,
  ];
  if (config.showPast) lines.push(`  show-past="true"`);
  lines.push("></ote-events>");
  return lines.join("\n");
}

function applyAndRender(): void {
  const feed = feedInput.value.trim();
  const limit = limitInput.value.trim() || "6";
  const layout = layoutSelect.value;
  const theme = themeSelect.value;
  const lang = langSelect.value;
  const showPast = showPastCheckbox.checked;

  if (feed) widget.setAttribute("feed", feed);
  widget.setAttribute("limit", limit);
  widget.setAttribute("layout", layout);
  widget.setAttribute("theme", theme);
  widget.setAttribute("lang", lang);
  if (showPast) widget.setAttribute("show-past", "true");
  else widget.removeAttribute("show-past");

  snippetCode.textContent = buildSnippet({ feed, limit, layout, theme, lang, showPast });
}

for (const control of [feedInput, limitInput, layoutSelect, themeSelect, langSelect, showPastCheckbox]) {
  control.addEventListener("input", applyAndRender);
  control.addEventListener("change", applyAndRender);
}

copyButton.addEventListener("click", () => {
  void navigator.clipboard.writeText(snippetCode.textContent ?? "").then(() => {
    const original = copyButton.textContent;
    copyButton.textContent = "Copied!";
    setTimeout(() => {
      copyButton.textContent = original;
    }, 1500);
  });
});

applyAndRender();
