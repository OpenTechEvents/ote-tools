import { DEFAULT_FIELDS, type FieldKey } from "./attrs.js";

const feedInput = document.querySelector<HTMLInputElement>("#feed-input")!;
const limitInput = document.querySelector<HTMLInputElement>("#limit-input")!;
const layoutSelect = document.querySelector<HTMLSelectElement>("#layout-select")!;
const themeSelect = document.querySelector<HTMLSelectElement>("#theme-select")!;
const langSelect = document.querySelector<HTMLSelectElement>("#lang-select")!;
const showPastCheckbox = document.querySelector<HTMLInputElement>("#show-past-checkbox")!;
const fieldCheckboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>(".field-key-checkbox"),
);
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

function currentFields(): FieldKey[] {
  return fieldCheckboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value as FieldKey);
}

function isDefaultFields(fields: FieldKey[]): boolean {
  const defaults = new Set(DEFAULT_FIELDS);
  return fields.length === DEFAULT_FIELDS.length && fields.every((field) => defaults.has(field));
}

function buildSnippet(config: {
  feed: string;
  limit: string;
  layout: string;
  theme: string;
  lang: string;
  showPast: boolean;
  fields: string | undefined;
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
  if (config.fields) lines.push(`  fields="${attr(config.fields)}"`);
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
  const fields = currentFields();
  const fieldsAttr = isDefaultFields(fields) ? undefined : fields.join(",");

  if (feed) widget.setAttribute("feed", feed);
  widget.setAttribute("limit", limit);
  widget.setAttribute("layout", layout);
  widget.setAttribute("theme", theme);
  widget.setAttribute("lang", lang);
  if (showPast) widget.setAttribute("show-past", "true");
  else widget.removeAttribute("show-past");
  if (fieldsAttr) widget.setAttribute("fields", fieldsAttr);
  else widget.removeAttribute("fields");

  snippetCode.textContent = buildSnippet({
    feed,
    limit,
    layout,
    theme,
    lang,
    showPast,
    fields: fieldsAttr,
  });
}

for (const control of [
  feedInput,
  limitInput,
  layoutSelect,
  themeSelect,
  langSelect,
  showPastCheckbox,
  ...fieldCheckboxes,
]) {
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
