import {
  ALL_FIELDS,
  DEFAULT_EVENT_ACTIONS,
  DEFAULT_FIELDS,
  parseFeedsAttr,
  type EventClickMode,
  type FieldKey,
  type GroupKey,
  type Layout,
  type NativeEventAction,
} from "./attrs.js";
import type { OteEventsElement } from "./element.js";
import type { EventAction, EventActionPlacement } from "./render.js";
import { ALL_CONVERT_TOKENS, ALL_SHOW_TOKENS, type ConvertToken, type ShowToken } from "./subscribe-attrs.js";
import type { OteSubscribeElement } from "./subscribe-element.js";

declare const __EMBED_VERSION__: string;

const EMBED_SCRIPT_URL = `https://tools.opentechevents.org/embed/v${__EMBED_VERSION__}/ote-events.js`;
const SUBSCRIBE_SCRIPT_URL = `https://tools.opentechevents.org/embed/v${__EMBED_VERSION__}/ote-subscribe.js`;

/**
 * One input for both widgets. `<ote-events feed>` and `<ote-subscribe
 * feed-json>` name the same document — and since the converter derives ICS
 * and RSS from it (#186), it is the only URL a publisher has to have. Asking
 * for it once per widget taught the opposite.
 */
const feedInput = document.querySelector<HTMLInputElement>("#source-feed-input")!;
const sourceStatus = document.querySelector<HTMLElement>("#source-status")!;
const sourceResetButton = document.querySelector<HTMLButtonElement>("#source-reset-button")!;
const feedDataInput = document.querySelector<HTMLTextAreaElement>("#feed-data-input")!;
const feedSourceField = document.querySelector<HTMLElement>("#feed-source-field")!;
const jsonSourceField = document.querySelector<HTMLElement>("#json-source-field")!;
const sourceModeInputs = Array.from(
  document.querySelectorAll<HTMLInputElement>('input[name="source-mode"]'),
);
const eventIdInput = document.querySelector<HTMLInputElement>("#event-id-input")!;
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
const maxHeightInput = document.querySelector<HTMLInputElement>("#max-height-input")!;
const maxPerDayInput = document.querySelector<HTMLInputElement>("#max-per-day-input")!;
const densitySelect = document.querySelector<HTMLSelectElement>("#density-select")!;
const footerSelect = document.querySelector<HTMLSelectElement>("#footer-select")!;
const footerSubscribeLayoutSelect = document.querySelector<HTMLSelectElement>("#subscribe-layout-footer-select")!;
const footerMarkSelect = document.querySelector<HTMLSelectElement>("#footer-mark-select")!;
const initialDateSelect = document.querySelector<HTMLSelectElement>("#initial-date-select")!;
const responsiveCheckbox = document.querySelector<HTMLInputElement>("#responsive-checkbox")!;
const previewFieldCheckboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>(".field-key-preview-checkbox"),
);
const detailFieldCheckboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>(".field-key-detail-checkbox"),
);
const groupEventsCheckboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>(".group-key-checkbox"),
);
const viewsCheckboxes = Array.from(document.querySelectorAll<HTMLInputElement>(".view-key-checkbox"));
const widget = document.querySelector<OteEventsElement>("#preview-widget")!;
const widgetFrame = document.querySelector<HTMLElement>(".widget-frame")!;
const snippetCode = document.querySelector<HTMLElement>("#snippet-code")!;
const copyButton = document.querySelector<HTMLButtonElement>("#copy-button")!;
const dataError = document.querySelector<HTMLElement>("#data-error")!;

const subscribeIcsInput = document.querySelector<HTMLInputElement>("#subscribe-ics-input")!;
const subscribeRssInput = document.querySelector<HTMLInputElement>("#subscribe-rss-input")!;
const subscribeJsonInput = feedInput;
const subscribeNameInput = document.querySelector<HTMLInputElement>("#subscribe-name-input")!;
const subscribeShowCheckboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>(".subscribe-show-checkbox"),
);
const subscribeConvertCheckboxes = Array.from(
  document.querySelectorAll<HTMLInputElement>(".subscribe-convert-checkbox"),
);
const subscribeLayoutSelect = document.querySelector<HTMLSelectElement>("#subscribe-layout-select")!;
const subscribeThemeSelect = document.querySelector<HTMLSelectElement>("#subscribe-theme-select")!;
const subscribeLangSelect = document.querySelector<HTMLSelectElement>("#subscribe-lang-select")!;
const subscribeWidget = document.querySelector<OteSubscribeElement>("#subscribe-preview-widget")!;
const subscribeSnippetCode = document.querySelector<HTMLElement>("#subscribe-snippet-code")!;
const subscribeCopyButton = document.querySelector<HTMLButtonElement>("#subscribe-copy-button")!;

const siteTabsContainer = document.querySelector<HTMLElement>(".site-tabs")!;
const siteTabButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".site-tab"));
const tabPanels: Record<string, HTMLElement> = {
  events: document.querySelector<HTMLElement>("#tab-panel-events")!,
  subscribe: document.querySelector<HTMLElement>("#tab-panel-subscribe")!,
  reference: document.querySelector<HTMLElement>("#tab-panel-reference")!,
};

const cardWidthField = document.querySelector<HTMLElement>("#card-width-field")!;
const calendarField = document.querySelector<HTMLElement>("#calendar-field")!;
const groupEventsField = document.querySelector<HTMLElement>("#group-events-field")!;
const fieldsMatrixField = document.querySelector<HTMLElement>("#fields-matrix-field")!;

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

/**
 * The `views` attribute (#183) from the three boxes: every box checked is
 * the default and so emits no attribute, and none checked is `"none"`.
 *
 * The order is the checkboxes' own, which is the switcher's canonical one —
 * `parseViews` re-sorts anyway, so a snippet can never claim an order the
 * widget will not honour.
 */
function currentViewsAttr(): string | undefined {
  const views = viewsCheckboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
  if (views.length === viewsCheckboxes.length) return undefined;
  return views.length === 0 ? "none" : views.join(",");
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

function feedAttrLine(feedUrls: string[]): string {
  if (feedUrls.length > 1) return ` feeds="${attr(feedUrls.join(","))}"`;
  if (feedUrls.length === 1) return ` feed="${attr(feedUrls[0]!)}"`;
  return "";
}

function buildSnippet(config: {
  feedUrls: string[];
  sourceMode: SourceMode;
  runtimeData: RuntimeData | undefined;
  eventId: string;
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
  maxHeight: string | undefined;
  maxPerDay: string | undefined;
  density: string | undefined;
  footer: string | undefined;
  footerSubscribeLayout: string | undefined;
  footerMark: string | undefined;
  initialDate: string | undefined;
  responsive: boolean;
  fieldsPreview: string | undefined;
  fieldsDetail: string | undefined;
  groupEvents: string | undefined;
  views: string | undefined;
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
    `<ote-events id="events-widget"${config.sourceMode === "url" ? feedAttrLine(config.feedUrls) : ""}`,
    `  layout="${attr(config.layout)}"`,
    `  theme="${attr(config.theme)}"`,
    `  lang="${attr(config.lang)}"`,
  ];
  if (config.eventId) elementLines.push(`  event-id="${attr(config.eventId)}"`);
  if (config.limit) elementLines.push(`  limit="${attr(config.limit)}"`);
  if (config.placeholderImage) {
    elementLines.push(`  placeholder-image="${attr(config.placeholderImage)}"`);
  }
  if (config.eventClick !== "modal") elementLines.push(`  event-click="${attr(config.eventClick)}"`);
  if (config.eventActions) elementLines.push(`  event-actions="${attr(config.eventActions)}"`);
  if (!config.showPast) elementLines.push(`  show-past="false"`);
  if (config.cardWidth) elementLines.push(`  card-width="${attr(config.cardWidth)}"`);
  if (config.maxHeight) elementLines.push(`  max-height="${attr(config.maxHeight)}"`);
  if (config.maxPerDay) elementLines.push(`  max-per-day="${attr(config.maxPerDay)}"`);
  if (config.density) elementLines.push(`  density="${attr(config.density)}"`);
  if (config.footer) elementLines.push(`  footer="${attr(config.footer)}"`);
  if (config.footerSubscribeLayout) {
    elementLines.push(`  subscribe-layout="${attr(config.footerSubscribeLayout)}"`);
  }
  if (config.footerMark) elementLines.push(`  footer-mark="${attr(config.footerMark)}"`);
  if (config.initialDate) elementLines.push(`  initial-date="${attr(config.initialDate)}"`);
  if (!config.responsive) elementLines.push(`  responsive="off"`);
  if (config.fieldsPreview) elementLines.push(`  fields-preview="${attr(config.fieldsPreview)}"`);
  if (config.fieldsDetail) elementLines.push(`  fields-detail="${attr(config.fieldsDetail)}"`);
  if (config.groupEvents) elementLines.push(`  group-events="${attr(config.groupEvents)}"`);
  if (config.views) elementLines.push(`  views="${attr(config.views)}"`);
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

function currentShow(): ShowToken[] {
  return subscribeShowCheckboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value as ShowToken);
}

function currentConvert(): ConvertToken[] {
  return subscribeConvertCheckboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value as ConvertToken);
}

function isAllShowTokens(tokens: ShowToken[]): boolean {
  return tokens.length === ALL_SHOW_TOKENS.length && ALL_SHOW_TOKENS.every((token) => tokens.includes(token));
}

function buildSubscribeSnippet(config: {
  icsUrl: string;
  rssUrl: string;
  jsonUrl: string;
  name: string;
  show: string | undefined;
  convert: string | undefined;
  layout: string;
  theme: string;
  lang: string;
}): string {
  const lines: string[] = [`<script type="module" src="${SUBSCRIBE_SCRIPT_URL}"></script>`, ""];
  const elementLines = [`<ote-subscribe`];
  if (config.icsUrl) elementLines.push(`  feed-ics="${attr(config.icsUrl)}"`);
  if (config.rssUrl) elementLines.push(`  feed-rss="${attr(config.rssUrl)}"`);
  if (config.jsonUrl) elementLines.push(`  feed-json="${attr(config.jsonUrl)}"`);
  if (config.name) elementLines.push(`  name="${attr(config.name)}"`);
  if (config.show !== undefined) elementLines.push(`  show="${attr(config.show)}"`);
  if (config.convert !== undefined) elementLines.push(`  convert="${attr(config.convert)}"`);
  if (config.layout !== "menu") elementLines.push(`  layout="${attr(config.layout)}"`);
  elementLines.push(`  theme="${attr(config.theme)}"`, `  lang="${attr(config.lang)}"`, `></ote-subscribe>`);
  lines.push(...elementLines);
  return lines.join("\n");
}

function setSubscribeSnippet(text: string): void {
  subscribeSnippetCode.textContent = text;
  subscribeSnippetCode.removeAttribute("data-highlighted");
  highlightCodeBlock(subscribeSnippetCode);
}

function applySubscribeAndRender(): void {
  const icsUrl = subscribeIcsInput.value.trim();
  const rssUrl = subscribeRssInput.value.trim();
  // The shared field accepts several comma-separated feeds, which only the
  // events widget can combine. <ote-subscribe> links to one document, so it
  // takes the first — rather than emitting a comma-separated string as a
  // URL, which is what reading the raw field would do.
  const jsonUrl = parseFeedsAttr(subscribeJsonInput.value.trim())[0] ?? "";
  const name = subscribeNameInput.value.trim();
  const show = currentShow();
  const showAttr = show.length === 0 ? "none" : isAllShowTokens(show) ? undefined : show.join(",");
  const convert = currentConvert();
  const convertAttr =
    convert.length === 0
      ? "off"
      : convert.length === ALL_CONVERT_TOKENS.length
        ? undefined
        : convert.join(",");
  const layout = subscribeLayoutSelect.value;
  const theme = subscribeThemeSelect.value;
  const lang = subscribeLangSelect.value;

  if (icsUrl) subscribeWidget.setAttribute("feed-ics", icsUrl);
  else subscribeWidget.removeAttribute("feed-ics");
  if (rssUrl) subscribeWidget.setAttribute("feed-rss", rssUrl);
  else subscribeWidget.removeAttribute("feed-rss");
  if (jsonUrl) subscribeWidget.setAttribute("feed-json", jsonUrl);
  else subscribeWidget.removeAttribute("feed-json");
  if (name) subscribeWidget.setAttribute("name", name);
  else subscribeWidget.removeAttribute("name");
  if (showAttr) subscribeWidget.setAttribute("show", showAttr);
  else subscribeWidget.removeAttribute("show");
  if (convertAttr) subscribeWidget.setAttribute("convert", convertAttr);
  else subscribeWidget.removeAttribute("convert");
  subscribeWidget.setAttribute("layout", layout);
  subscribeWidget.setAttribute("theme", theme);
  subscribeWidget.setAttribute("lang", lang);

  setSubscribeSnippet(
    buildSubscribeSnippet({ icsUrl, rssUrl, jsonUrl, name, show: showAttr, convert: convertAttr, layout, theme, lang }),
  );
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

function setActiveTab(tab: string): void {
  for (const button of siteTabButtons) {
    const isActive = button.dataset.tab === tab;
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  }
  for (const [key, panel] of Object.entries(tabPanels)) {
    panel.hidden = key !== tab;
  }
}

function setControlDisabled(
  field: HTMLElement,
  controls: Array<HTMLInputElement | HTMLSelectElement>,
  disabled: boolean,
): void {
  field.classList.toggle("is-disabled", disabled);
  for (const control of controls) control.disabled = disabled;
}

function updateControlAvailability(layout: Layout): void {
  setControlDisabled(cardWidthField, [cardWidthSelect], layout !== "cards");
  setControlDisabled(
    calendarField,
    [maxPerDayInput, densitySelect, initialDateSelect, responsiveCheckbox],
    layout !== "calendar",
  );
  setControlDisabled(groupEventsField, groupEventsCheckboxes, layout !== "cards");
  setControlDisabled(
    fieldsMatrixField,
    [...previewFieldCheckboxes, ...detailFieldCheckboxes],
    layout === "calendar",
  );
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
  const feedUrls = parseFeedsAttr(feed);
  const eventId = eventIdInput.value.trim();
  const limit = limitInput.value.trim();
  const layout = currentLayout();
  updateControlAvailability(layout);
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
  const maxHeightAttr = maxHeightInput.value.trim() || undefined;
  const maxPerDayAttr = maxPerDayInput.value.trim() || undefined;
  const densityAttr = densitySelect.value === "auto" ? undefined : densitySelect.value;
  const footerAttr = footerSelect.value === "on" ? undefined : footerSelect.value;
  const footerSubscribeLayoutAttr =
    footerSubscribeLayoutSelect.value === "badges" ? undefined : footerSubscribeLayoutSelect.value;
  const footerMarkAttr = footerMarkSelect.value === "on" ? undefined : footerMarkSelect.value;
  const initialDateAttr = initialDateSelect.value === "next-event" ? undefined : initialDateSelect.value;
  const responsive = responsiveCheckbox.checked;
  const previewFields = currentPreviewFields();
  const previewFieldsAttr = matchesFieldSet(previewFields, DEFAULT_FIELDS) ? undefined : previewFields.join(",");
  const detailFields = currentDetailFields();
  const detailFieldsAttr = matchesFieldSet(detailFields, ALL_FIELDS) ? undefined : detailFields.join(",");
  const groupEvents = currentGroupEvents();
  const groupEventsAttr = groupEvents.length > 0 ? groupEvents.join(",") : undefined;
  const viewsAttr = currentViewsAttr();
  const runtimeDataResult = readRuntimeData(mode);

  if (mode === "url" && feedUrls.length > 1) {
    const feedsAttr = feedUrls.join(",");
    if (widget.getAttribute("feeds") !== feedsAttr) widget.setAttribute("feeds", feedsAttr);
    widget.removeAttribute("feed");
  } else if (mode === "url") {
    widget.removeAttribute("feeds");
    if (feed && widget.getAttribute("feed") !== feed) widget.setAttribute("feed", feed);
  }
  if (mode === "json") {
    if (widget.hasAttribute("feed")) widget.removeAttribute("feed");
    if (widget.hasAttribute("feeds")) widget.removeAttribute("feeds");
  }
  if (eventId) widget.setAttribute("event-id", eventId);
  else widget.removeAttribute("event-id");
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
  if (maxHeightAttr) widget.setAttribute("max-height", maxHeightAttr);
  else widget.removeAttribute("max-height");
  if (densityAttr) widget.setAttribute("density", densityAttr);
  else widget.removeAttribute("density");
  if (footerAttr) widget.setAttribute("footer", footerAttr);
  else widget.removeAttribute("footer");
  if (footerSubscribeLayoutAttr) widget.setAttribute("subscribe-layout", footerSubscribeLayoutAttr);
  else widget.removeAttribute("subscribe-layout");
  if (footerMarkAttr) widget.setAttribute("footer-mark", footerMarkAttr);
  else widget.removeAttribute("footer-mark");
  if (maxPerDayAttr) widget.setAttribute("max-per-day", maxPerDayAttr);
  else widget.removeAttribute("max-per-day");
  if (initialDateAttr) widget.setAttribute("initial-date", initialDateAttr);
  else widget.removeAttribute("initial-date");
  if (responsive) widget.removeAttribute("responsive");
  else widget.setAttribute("responsive", "off");
  if (previewFieldsAttr) widget.setAttribute("fields-preview", previewFieldsAttr);
  else widget.removeAttribute("fields-preview");
  if (detailFieldsAttr) widget.setAttribute("fields-detail", detailFieldsAttr);
  else widget.removeAttribute("fields-detail");
  if (groupEventsAttr) widget.setAttribute("group-events", groupEventsAttr);
  else widget.removeAttribute("group-events");
  if (viewsAttr) widget.setAttribute("views", viewsAttr);
  else widget.removeAttribute("views");
  if (mode === "json" && runtimeDataResult.status === "valid") {
    applyRuntimeData(runtimeDataResult.runtimeData);
  } else if (mode === "json" && runtimeDataResult.status === "empty") {
    widget.feedData = { events: [] };
  } else if (mode === "url" && widget.feedData !== undefined) {
    applyRuntimeData(undefined);
  }

  setSnippet(buildSnippet({
    feedUrls,
    sourceMode: mode,
    runtimeData: runtimeDataResult.status === "valid" ? runtimeDataResult.runtimeData : undefined,
    eventId,
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
    maxHeight: maxHeightAttr,
    maxPerDay: maxPerDayAttr,
    density: densityAttr,
    footer: footerAttr,
    footerSubscribeLayout: footerSubscribeLayoutAttr,
    footerMark: footerMarkAttr,
    initialDate: initialDateAttr,
    responsive,
    fieldsPreview: previewFieldsAttr,
    fieldsDetail: detailFieldsAttr,
    groupEvents: groupEventsAttr,
    views: viewsAttr,
  }));
}

for (const control of [
  feedInput,
  eventIdInput,
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
  maxHeightInput,
  maxPerDayInput,
  densitySelect,
  footerSelect,
  footerSubscribeLayoutSelect,
  footerMarkSelect,
  initialDateSelect,
  responsiveCheckbox,
  ...previewFieldCheckboxes,
  ...detailFieldCheckboxes,
  ...groupEventsCheckboxes,
  ...viewsCheckboxes,
  ...eventActionCheckboxes,
]) {
  control.addEventListener("input", applyAndRender);
  control.addEventListener("change", applyAndRender);
}

/*
 * The widget's own switcher (#183) and the playground's layout toolbar are
 * two controls over one thing, so the visitor-facing one reports back: a
 * click inside the preview leaves the toolbar, the snippet's `layout` and
 * the frame's own `data-layout` agreeing with what is on screen.
 *
 * It is also the demonstration of `ote-view-change` — the only way a host
 * can mirror a choice the widget deliberately does not persist.
 */
widget.addEventListener("ote-view-change", (event) => {
  const view = (event as CustomEvent<{ view: Layout }>).detail.view;
  setLayout(view);
  applyAndRender();
});

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

for (const control of [
  subscribeIcsInput,
  subscribeRssInput,
  subscribeJsonInput,
  subscribeNameInput,
  subscribeLayoutSelect,
  subscribeThemeSelect,
  subscribeLangSelect,
  ...subscribeShowCheckboxes,
  ...subscribeConvertCheckboxes,
]) {
  control.addEventListener("input", applySubscribeAndRender);
  control.addEventListener("change", applySubscribeAndRender);
}

subscribeCopyButton.addEventListener("click", () => {
  void navigator.clipboard.writeText(subscribeSnippetCode.textContent ?? "").then(() => {
    const original = subscribeCopyButton.textContent;
    subscribeCopyButton.textContent = "Copied!";
    setTimeout(() => {
      subscribeCopyButton.textContent = original;
    }, 1500);
  });
});

for (const button of siteTabButtons) {
  button.addEventListener("click", () => {
    if (button.dataset.tab) setActiveTab(button.dataset.tab);
  });
}

siteTabsContainer.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  const currentIndex = siteTabButtons.findIndex((button) => button.getAttribute("aria-selected") === "true");
  const delta = event.key === "ArrowRight" ? 1 : -1;
  const nextButton = siteTabButtons[(currentIndex + delta + siteTabButtons.length) % siteTabButtons.length]!;
  if (nextButton.dataset.tab) setActiveTab(nextButton.dataset.tab);
  nextButton.focus();
});

/**
 * The feed lives in the page's own address, so a configured playground is a
 * link: `?feed=https://saraoia.com/eventos-ote.json` opens both widgets
 * pointed at that feed. Same parameter name `apps/preview` and
 * `apps/validator` already use, so a URL moves between the tools unchanged.
 */
const EXAMPLE_FEED = "https://communitybuilders.dev/events/feed.json";
const FEED_STORAGE_KEY = "ote-embed-playground-feed";

function storedFeed(): string | null {
  try {
    return localStorage.getItem(FEED_STORAGE_KEY);
  } catch {
    // Storage can throw outright in a third-party iframe or with cookies
    // blocked. A playground must still work there.
    return null;
  }
}

function rememberFeed(value: string): void {
  const url = new URL(window.location.href);
  if (value && value !== EXAMPLE_FEED) url.searchParams.set("feed", value);
  else url.searchParams.delete("feed");
  window.history.replaceState(null, "", url);
  try {
    if (value && value !== EXAMPLE_FEED) localStorage.setItem(FEED_STORAGE_KEY, value);
    else localStorage.removeItem(FEED_STORAGE_KEY);
  } catch {
    // See storedFeed().
  }
}

/**
 * What the status line says, and why it says it from a real fetch rather
 * than from the URL's shape. A feed that 404s, is not JSON, or is served
 * without CORS looks identical to a healthy one in an address bar, and all
 * three render an empty widget — which reads as "the widget is broken"
 * rather than "the feed could not be read". The widget's own empty state
 * cannot tell them apart either; this line can.
 */
async function describeFeed(value: string, token: number): Promise<void> {
  const urls = parseFeedsAttr(value);
  if (urls.length === 0) {
    setStatus(token, "Paste the URL of your OTE feed.json to point both widgets at it.", "");
    return;
  }
  setStatus(token, urls.length > 1 ? `Checking ${urls.length} feeds…` : "Checking the feed…", "");

  const results = await Promise.all(urls.map(async (url) => readFeed(url)));
  const failed = results.filter((result) => result.error);
  if (failed.length > 0) {
    setStatus(token, failed.map((result) => result.error).join(" · "), "warn");
    return;
  }
  const events = results.reduce((total, result) => total + result.events, 0);
  const versions = [...new Set(results.map((result) => result.specVersion).filter(Boolean))];
  const parts = [
    `${events} event${events === 1 ? "" : "s"}`,
    versions.length > 0 ? `spec ${versions.join(", ")}` : null,
    "calendar and RSS generated from it",
  ].filter(Boolean);
  setStatus(token, `✓ ${parts.join(" · ")}`, "ok");
}

async function readFeed(url: string): Promise<{ events: number; specVersion: string; error?: string }> {
  let response: Response;
  try {
    response = await fetch(url, { headers: { accept: "application/json" } });
  } catch {
    // A CORS rejection and a dead host are indistinguishable from here by
    // design, so the message names both rather than guessing.
    return { events: 0, specVersion: "", error: `${hostOf(url)} could not be fetched — it may be offline, or served without CORS, which the widget needs.` };
  }
  if (!response.ok) return { events: 0, specVersion: "", error: `${hostOf(url)} answered ${response.status}.` };
  try {
    const document = (await response.json()) as { specVersion?: unknown; events?: unknown };
    if (!Array.isArray(document.events)) {
      return { events: 0, specVersion: "", error: `${hostOf(url)} is JSON, but has no "events" array — is it an OTE feed?` };
    }
    return { events: document.events.length, specVersion: typeof document.specVersion === "string" ? document.specVersion : "" };
  } catch {
    return { events: 0, specVersion: "", error: `${hostOf(url)} did not return JSON.` };
  }
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/**
 * `token` is the guard against a slow feed overwriting a fast one: typing
 * starts a request per keystroke-ish, and only the newest may report.
 */
let statusToken = 0;
function setStatus(token: number, text: string, kind: "ok" | "warn" | ""): void {
  if (token !== statusToken) return;
  sourceStatus.textContent = text;
  sourceStatus.dataset.kind = kind;
}

let describeTimer: ReturnType<typeof setTimeout> | undefined;
function onFeedChanged(): void {
  const value = feedInput.value.trim();
  rememberFeed(value);
  const token = ++statusToken;
  clearTimeout(describeTimer);
  describeTimer = setTimeout(() => void describeFeed(value, token), 400);
}

feedInput.addEventListener("input", onFeedChanged);
feedInput.addEventListener("change", onFeedChanged);
sourceResetButton.addEventListener("click", () => {
  feedInput.value = EXAMPLE_FEED;
  onFeedChanged();
  applyAndRender();
  applySubscribeAndRender();
  feedInput.focus();
});

feedInput.value = new URL(window.location.href).searchParams.get("feed")?.trim() || storedFeed() || EXAMPLE_FEED;
onFeedChanged();

/**
 * The sticky preview column has to clear the sticky feed/tabs strip, and the
 * strip's height is not a constant: its controls wrap at narrow widths and
 * the status line can run to a second row. So it is measured and published
 * as `--sticky-top`.
 *
 * No ResizeObserver loop here, unlike the widget's own header
 * (apps/embed/CLAUDE.md): the strip's height does not depend on the property
 * being written, so observing it cannot re-trigger itself.
 */
const pageStrip = document.querySelector<HTMLElement>(".page-strip");
if (pageStrip) {
  const publishStripHeight = (): void => {
    document.documentElement.style.setProperty(
      "--sticky-top",
      `${Math.round(pageStrip.getBoundingClientRect().height)}px`,
    );
  };
  publishStripHeight();
  new ResizeObserver(publishStripHeight).observe(pageStrip);
}

applyAndRender();
applySubscribeAndRender();
highlightStaticCodeBlocks();
window.addEventListener("load", highlightStaticCodeBlocks);
