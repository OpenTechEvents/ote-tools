import {
  ALL_FIELDS,
  DEFAULT_EVENT_ACTIONS,
  DEFAULT_FIELDS,
  type EventClickMode,
  type FieldKey,
  type GroupKey,
  type Layout,
  type NativeEventAction,
} from "./attrs.js";
import type { OteEventsElement } from "./element.js";
import type { EventAction, EventActionPlacement } from "./render.js";

declare const __EMBED_VERSION__: string;

const EMBED_SCRIPT_URL = `https://tools.opentechevents.org/embed/v${__EMBED_VERSION__}/ote-events.js`;

const feedInput = document.querySelector<HTMLInputElement>("#feed-input")!;
const feedDataInput = document.querySelector<HTMLTextAreaElement>("#feed-data-input")!;
const feedSourceField = document.querySelector<HTMLElement>("#feed-source-field")!;
const jsonSourceField = document.querySelector<HTMLElement>("#json-source-field")!;
const sourceModeInputs = Array.from(
  document.querySelectorAll<HTMLInputElement>('input[name="source-mode"]'),
);
const limitInput = document.querySelector<HTMLInputElement>("#limit-input")!;
const layoutButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-layout]"),
);
const placeholderImageInput = document.querySelector<HTMLInputElement>("#placeholder-image-input")!;
const eventClickSelect = document.querySelector<HTMLSelectElement>("#event-click-select")!;
const eventActionCheckboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>(".event-action-checkbox"),
);
const nativeActionPlacementSelect = document.querySelector<HTMLSelectElement>(
  "#native-action-placement-select",
)!;
const customActionCheckbox = document.querySelector<HTMLInputElement>("#custom-action-checkbox")!;
const customActionPlacementSelect = document.querySelector<HTMLSelectElement>(
  "#custom-action-placement-select",
)!;
const fontFamilyInput = document.querySelector<HTMLInputElement>("#font-family-input")!;
const fontSizeInput = document.querySelector<HTMLInputElement>("#font-size-input")!;
const themeButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-theme]"),
);
const langSelect = document.querySelector<HTMLSelectElement>("#lang-select")!;
const showPastCheckbox = document.querySelector<HTMLInputElement>("#show-past-checkbox")!;
const cardWidthSelect = document.querySelector<HTMLSelectElement>("#card-width-select")!;
const previewFieldCheckboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>(".field-key-preview-checkbox"),
);
const detailFieldCheckboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>(".field-key-detail-checkbox"),
);
const groupEventsCheckboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>(".group-key-checkbox"),
);
const widget = document.querySelector<OteEventsElement>("#preview-widget")!;
const widgetFrame = document.querySelector<HTMLElement>(".widget-frame")!;
const snippetCode = document.querySelector<HTMLElement>("#snippet-code")!;
const copyButton = document.querySelector<HTMLButtonElement>("#copy-button")!;
const dataError = document.querySelector<HTMLElement>("#data-error")!;

type RuntimeDataKind = "feedData" | "events" | "event";

interface RuntimeData {
  kind: RuntimeDataKind;
  value: unknown;
}

type SourceMode = "url" | "json";
type Theme = "auto" | "light" | "dark";
type RuntimeDataResult =
  | { status: "empty"; runtimeData?: undefined }
  | { status: "invalid"; runtimeData?: undefined }
  | { status: "valid"; runtimeData: RuntimeData };

declare global {
  interface Window {
    hljs?: {
      highlightElement(element: Element): void;
    };
  }
}

/** Escapes a value for embedding inside an HTML attribute. */
function attr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function checkedFields(checkboxes: HTMLInputElement[]): FieldKey[] {
  return checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value as FieldKey);
}

function currentPreviewFields(): FieldKey[] {
  return checkedFields(previewFieldCheckboxes);
}

function currentDetailFields(): FieldKey[] {
  return checkedFields(detailFieldCheckboxes);
}

function matchesFieldSet(fields: FieldKey[], reference: readonly FieldKey[]): boolean {
  const set = new Set(reference);
  return fields.length === reference.length && fields.every((field) => set.has(field));
}

function currentGroupEvents(): GroupKey[] {
  return groupEventsCheckboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value as GroupKey);
}

function currentEventActions(): NativeEventAction[] {
  return eventActionCheckboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value as NativeEventAction);
}

function isDefaultEventActions(actions: NativeEventAction[]): boolean {
  return (
    actions.length === DEFAULT_EVENT_ACTIONS.length &&
    actions.every((action, index) => action === DEFAULT_EVENT_ACTIONS[index])
  );
}

function buildSnippet(config: {
  feed: string;
  sourceMode: SourceMode;
  runtimeData: RuntimeData | undefined;
  limit: string;
  layout: string;
  placeholderImage: string;
  eventClick: EventClickMode;
  eventActions: string | undefined;
  nativeActions: NativeEventAction[];
  nativeActionPlacement: EventActionPlacement;
  customAction: boolean;
  customActionPlacement: EventActionPlacement;
  fontFamily: string;
  fontSize: string;
  theme: string;
  lang: string;
  showPast: boolean;
  cardWidth: string | undefined;
  fieldsPreview: string | undefined;
  fieldsDetail: string | undefined;
  groupEvents: string | undefined;
}): string {
  const lines: string[] = [
    `<script type="module" src="${EMBED_SCRIPT_URL}"></script>`,
    "",
  ];
  if (config.fontFamily || config.fontSize) {
    lines.push("<style>", "  #events-widget {");
    if (config.fontFamily) lines.push(`    --ote-font-family: ${config.fontFamily};`);
    if (config.fontSize) lines.push(`    --ote-font-size: ${config.fontSize};`);
    lines.push("  }", "</style>", "");
  }
  const elementLines = [
    `<ote-events id="events-widget"${config.sourceMode === "url" ? ` feed="${attr(config.feed)}"` : ""}`,
    `  layout="${attr(config.layout)}"`,
    `  theme="${attr(config.theme)}"`,
    `  lang="${attr(config.lang)}"`,
  ];
  if (config.limit) elementLines.push(`  limit="${attr(config.limit)}"`);
  if (config.placeholderImage) {
    elementLines.push(`  placeholder-image="${attr(config.placeholderImage)}"`);
  }
  if (config.eventClick !== "modal") elementLines.push(`  event-click="${attr(config.eventClick)}"`);
  if (config.eventActions) elementLines.push(`  event-actions="${attr(config.eventActions)}"`);
  if (!config.showPast) elementLines.push(`  show-past="false"`);
  if (config.cardWidth) elementLines.push(`  card-width="${attr(config.cardWidth)}"`);
  if (config.fieldsPreview) elementLines.push(`  fields-preview="${attr(config.fieldsPreview)}"`);
  if (config.fieldsDetail) elementLines.push(`  fields-detail="${attr(config.fieldsDetail)}"`);
  if (config.groupEvents) elementLines.push(`  group-events="${attr(config.groupEvents)}"`);
  elementLines.push("></ote-events>");
  lines.push(...elementLines);
  if (config.sourceMode === "json" && config.runtimeData) {
    lines.push(
      "",
      `<script type="module">`,
      `  await customElements.whenDefined("ote-events");`,
      `  document.querySelector("#events-widget").${config.runtimeData.kind} = ${JSON.stringify(config.runtimeData.value, null, 2)};`,
      "</script>",
    );
  }
  const nativeActionPropertyLines =
    config.nativeActionPlacement === "detail"
      ? []
      : config.nativeActions.map(
          (action) => `    { type: "${action}", placement: "${config.nativeActionPlacement}" },`,
        );
  const customActionPropertyLines = config.customAction
    ? [
        `    {`,
        `      id: "save",`,
        `      label: "Save",`,
        `      icon: "star",`,
        `      placement: "${config.customActionPlacement}",`,
        `      onClick(event, context) {`,
        `        alert(\`Custom action for: \${event.name} from \${context.feed?.title ?? "this feed"}\`);`,
        `      },`,
        `    },`,
      ]
    : [];
  const eventActionPropertyLines = [...nativeActionPropertyLines, ...customActionPropertyLines];
  if (eventActionPropertyLines.length > 0) {
    lines.push(
      "",
      `<script type="module">`,
      `  await customElements.whenDefined("ote-events");`,
      `  document.querySelector("#events-widget").eventActions = [`,
      ...eventActionPropertyLines,
      `  ];`,
      `</script>`,
    );
  }
  return lines.join("\n");
}

function setSnippet(text: string): void {
  snippetCode.textContent = text;
  snippetCode.removeAttribute("data-highlighted");
  highlightCodeBlock(snippetCode);
}

function highlightCodeBlock(block: Element): void {
  if (!window.hljs) return;
  block.removeAttribute("data-highlighted");
  window.hljs.highlightElement(block);
}

function highlightStaticCodeBlocks(): void {
  for (const block of document.querySelectorAll("pre code:not(#snippet-code)")) {
    highlightCodeBlock(block);
  }
}

function parseRuntimeData(value: string): RuntimeData | undefined {
  const text = value.trim();
  if (!text) return undefined;

  const parsed = JSON.parse(text) as unknown;
  if (Array.isArray(parsed)) return { kind: "events", value: parsed };
  if (parsed && typeof parsed === "object" && "events" in parsed) {
    return { kind: "feedData", value: parsed };
  }
  return { kind: "event", value: parsed };
}

function sourceMode(): SourceMode {
  return sourceModeInputs.find((input) => input.checked)?.value === "json" ? "json" : "url";
}

function currentLayout(): Layout {
  const pressed = layoutButtons.find((button) => button.getAttribute("aria-pressed") === "true");
  if (pressed?.dataset.layout === "list") return "list";
  if (pressed?.dataset.layout === "cards") return "cards";
  return "calendar";
}

function setLayout(layout: Layout): void {
  for (const button of layoutButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.layout === layout));
  }
}

function currentTheme(): Theme {
  const pressed = themeButtons.find((button) => button.getAttribute("aria-pressed") === "true");
  if (pressed?.dataset.theme === "light") return "light";
  if (pressed?.dataset.theme === "dark") return "dark";
  return "auto";
}

function setTheme(theme: Theme): void {
  for (const button of themeButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.theme === theme));
  }
}

function applyRuntimeData(runtimeData: RuntimeData | undefined): void {
  if (!runtimeData) {
    widget.feedData = undefined;
    return;
  }
  if (runtimeData.kind === "feedData") {
    widget.feedData = runtimeData.value as OteEventsElement["feedData"];
  } else if (runtimeData.kind === "events") {
    widget.events = runtimeData.value as OteEventsElement["events"];
  } else {
    widget.event = runtimeData.value as OteEventsElement["event"];
  }
}

function setSourceControls(mode: SourceMode): void {
  feedSourceField.hidden = mode !== "url";
  jsonSourceField.hidden = mode !== "json";
  feedInput.disabled = mode === "json";
  feedDataInput.disabled = mode === "url";
}

function clearDataError(): void {
  dataError.hidden = true;
  dataError.textContent = "";
  feedDataInput.removeAttribute("aria-invalid");
}

function readRuntimeData(mode: SourceMode): RuntimeDataResult {
  if (mode === "url") {
    clearDataError();
    return { status: "empty" };
  }

  if (!feedDataInput.value.trim()) {
    clearDataError();
    return { status: "empty" };
  }

  try {
    const runtimeData = parseRuntimeData(feedDataInput.value);
    clearDataError();
    return runtimeData ? { status: "valid", runtimeData } : { status: "empty" };
  } catch (error) {
    dataError.hidden = false;
    dataError.textContent = error instanceof Error ? error.message : String(error);
    feedDataInput.setAttribute("aria-invalid", "true");
    return { status: "invalid" };
  }
}

function applyAndRender(): void {
  const mode = sourceMode();
  setSourceControls(mode);

  const feed = feedInput.value.trim();
  const limit = limitInput.value.trim();
  const layout = currentLayout();
  const placeholderImage = placeholderImageInput.value.trim();
  const eventClick = eventClickSelect.value as EventClickMode;
  const eventActions = currentEventActions();
  const nativeActionPlacement = nativeActionPlacementSelect.value as EventActionPlacement;
  const eventActionsAttr =
    nativeActionPlacement !== "detail" || eventActions.length === 0
      ? "none"
      : isDefaultEventActions(eventActions)
        ? undefined
        : eventActions.join(",");
  const customAction = customActionCheckbox.checked;
  const customActionPlacement = customActionPlacementSelect.value as EventActionPlacement;
  const fontFamily = fontFamilyInput.value.trim();
  const fontSize = fontSizeInput.value.trim();
  const theme = currentTheme();
  const lang = langSelect.value;
  const showPast = showPastCheckbox.checked;
  const cardWidth = cardWidthSelect.value;
  const cardWidthAttr = cardWidth === "medium" ? undefined : cardWidth;
  const previewFields = currentPreviewFields();
  const previewFieldsAttr = matchesFieldSet(previewFields, DEFAULT_FIELDS) ? undefined : previewFields.join(",");
  const detailFields = currentDetailFields();
  const detailFieldsAttr = matchesFieldSet(detailFields, ALL_FIELDS) ? undefined : detailFields.join(",");
  const groupEvents = currentGroupEvents();
  const groupEventsAttr = groupEvents.length > 0 ? groupEvents.join(",") : undefined;
  const runtimeDataResult = readRuntimeData(mode);

  if (mode === "url" && feed && widget.getAttribute("feed") !== feed) widget.setAttribute("feed", feed);
  if (mode === "json" && widget.hasAttribute("feed")) widget.removeAttribute("feed");
  if (limit) widget.setAttribute("limit", limit);
  else widget.removeAttribute("limit");
  widget.setAttribute("layout", layout);
  widgetFrame.dataset.layout = layout;
  if (placeholderImage) widget.setAttribute("placeholder-image", placeholderImage);
  else widget.removeAttribute("placeholder-image");
  if (eventClick === "modal") widget.removeAttribute("event-click");
  else widget.setAttribute("event-click", eventClick);
  if (eventActionsAttr) widget.setAttribute("event-actions", eventActionsAttr);
  else widget.removeAttribute("event-actions");
  const propertyActions: EventAction[] =
    nativeActionPlacement === "detail"
      ? []
      : eventActions.map((action) => ({ type: action, placement: nativeActionPlacement }));
  if (customAction) {
    propertyActions.push({
      id: "save",
      label: "Save",
      icon: "copy",
      placement: customActionPlacement,
      onClick(event) {
        alert(`Custom action for: ${event.name}`);
      },
    });
  }
  widget.eventActions = propertyActions;
  if (fontFamily) widget.style.setProperty("--ote-font-family", fontFamily);
  else widget.style.removeProperty("--ote-font-family");
  if (fontSize) widget.style.setProperty("--ote-font-size", fontSize);
  else widget.style.removeProperty("--ote-font-size");
  widget.setAttribute("theme", theme);
  widgetFrame.dataset.theme = theme;
  widget.setAttribute("lang", lang);
  if (showPast) widget.removeAttribute("show-past");
  else widget.setAttribute("show-past", "false");
  if (cardWidthAttr) widget.setAttribute("card-width", cardWidthAttr);
  else widget.removeAttribute("card-width");
  if (previewFieldsAttr) widget.setAttribute("fields-preview", previewFieldsAttr);
  else widget.removeAttribute("fields-preview");
  if (detailFieldsAttr) widget.setAttribute("fields-detail", detailFieldsAttr);
  else widget.removeAttribute("fields-detail");
  if (groupEventsAttr) widget.setAttribute("group-events", groupEventsAttr);
  else widget.removeAttribute("group-events");
  if (mode === "json" && runtimeDataResult.status === "valid") {
    applyRuntimeData(runtimeDataResult.runtimeData);
  } else if (mode === "json" && runtimeDataResult.status === "empty") {
    widget.feedData = { events: [] };
  } else if (mode === "url" && widget.feedData !== undefined) {
    applyRuntimeData(undefined);
  }

  setSnippet(buildSnippet({
    feed,
    sourceMode: mode,
    runtimeData: runtimeDataResult.status === "valid" ? runtimeDataResult.runtimeData : undefined,
    limit,
    layout,
    placeholderImage,
    eventClick,
    eventActions: eventActionsAttr,
    nativeActions: eventActions,
    nativeActionPlacement,
    customAction,
    customActionPlacement,
    fontFamily,
    fontSize,
    theme,
    lang,
    showPast,
    cardWidth: cardWidthAttr,
    fieldsPreview: previewFieldsAttr,
    fieldsDetail: detailFieldsAttr,
    groupEvents: groupEventsAttr,
  }));
}

for (const control of [
  feedInput,
  limitInput,
  placeholderImageInput,
  eventClickSelect,
  nativeActionPlacementSelect,
  customActionCheckbox,
  customActionPlacementSelect,
  fontFamilyInput,
  fontSizeInput,
  langSelect,
  showPastCheckbox,
  cardWidthSelect,
  ...previewFieldCheckboxes,
  ...detailFieldCheckboxes,
  ...groupEventsCheckboxes,
  ...eventActionCheckboxes,
]) {
  control.addEventListener("input", applyAndRender);
  control.addEventListener("change", applyAndRender);
}

for (const button of layoutButtons) {
  button.addEventListener("click", () => {
    if (button.dataset.layout === "list" || button.dataset.layout === "cards") {
      setLayout(button.dataset.layout);
    } else {
      setLayout("calendar");
    }
    applyAndRender();
  });
}

for (const button of themeButtons) {
  button.addEventListener("click", () => {
    if (button.dataset.theme === "light" || button.dataset.theme === "dark") {
      setTheme(button.dataset.theme);
    } else {
      setTheme("auto");
    }
    applyAndRender();
  });
}

for (const control of sourceModeInputs) {
  control.addEventListener("change", applyAndRender);
}

feedDataInput.addEventListener("blur", applyAndRender);
feedDataInput.addEventListener("change", applyAndRender);
feedDataInput.addEventListener("paste", () => {
  setTimeout(applyAndRender, 0);
});

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
highlightStaticCodeBlocks();
window.addEventListener("load", highlightStaticCodeBlocks);
