/**
 * The OTE validator page.
 *
 * Three input modes, one verdict. Upload and paste never touch the network:
 * they run `@opentechevents/validate` in this tab. URL mode is the one that
 * needs `workers/fetch-url`, because a browser cannot fetch a third-party
 * feed without CORS.
 *
 * Everything remote — the document, its values, the error messages quoting
 * them — is written with `textContent`, never `innerHTML`. A feed whose event
 * name is `<script>…</script>` must render as those characters, or this page
 * becomes a stored-XSS vehicle for whoever controls a feed.
 */

import type { FeedCandidate } from "@opentechevents/discover-feed";

import { looksMinified, reformatJson } from "./lib/format.js";
import { tokenizeJsonLine } from "./lib/highlight.js";
import { excerptAt, formatPointer } from "./lib/locate.js";
import {
  buildReport,
  MAX_SOURCE_BYTES,
  type DocumentKind,
  type Finding,
  type Report,
} from "./lib/report.js";
import { followCandidate, resolveUrl, type Provenance, type Resolution } from "./lib/resolve.js";

/** Injected at build time (see build.mjs); the CSP in index.html must match. */
declare const __FETCH_ENDPOINT__: string;

const FETCH_ENDPOINT = __FETCH_ENDPOINT__;

/**
 * The global `fetch`, wrapped rather than passed by reference.
 *
 * `fetch` detached from `window` throws "Illegal invocation" the moment it is
 * called — the browser requires its receiver. Node's fetch does not care, so
 * no unit test catches this; it only appears in a real tab, as a request that
 * never leaves. The Worker hit the identical trap (see workers/fetch-url's
 * `boundFetch`). Keep the wrapper on both sides.
 */
const browserFetch: typeof fetch = (input, init) => fetch(input, init);

const $ = <T extends HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`missing element #${id}`);
  return element as T;
};

const modeTabs = document.querySelectorAll<HTMLButtonElement>(".tab[data-mode]");
const panels = {
  url: $("panel-url"),
  file: $("panel-file"),
  paste: $("panel-paste"),
};
const urlForm = $<HTMLFormElement>("url-form");
const urlInput = $<HTMLInputElement>("url-input");
const fileInput = $<HTMLInputElement>("file-input");
const pasteInput = $<HTMLTextAreaElement>("paste-input");
const pasteButton = $<HTMLButtonElement>("paste-validate");
const statusBox = $("status");
const discoveryBox = $("discovery");
const candidatesBox = $("candidates");
const verdictBox = $("verdict");
const resultsBox = $("results");
const kindRow = $("kind-row");
const kindSelect = $<HTMLSelectElement>("kind-select");
const errorsBox = $("errors");
const recommendationsBox = $("recommendations");
const sourceBox = $("source");
const permalinkBox = $("permalink");
const permalinkInput = $<HTMLInputElement>("permalink-input");
const badgeInput = $<HTMLInputElement>("badge-input");

/** Everything currently on screen, so a kind override can re-render it. */
let current: {
  /** The text on screen, which the findings are addressed to. */
  source: string;
  label: string;
  provenance?: Provenance;
  /** True when `source` is an indented copy of what actually arrived. */
  reformatted: boolean;
} | null = null;

function setMode(mode: "url" | "file" | "paste"): void {
  for (const tab of modeTabs) {
    const active = tab.dataset.mode === mode;
    tab.setAttribute("aria-selected", String(active));
  }
  for (const [name, panel] of Object.entries(panels)) panel.hidden = name !== mode;
}

function clearResults(): void {
  for (const box of [discoveryBox, candidatesBox, verdictBox, errorsBox, recommendationsBox, sourceBox]) {
    box.replaceChildren();
    box.hidden = true;
  }
  // The results grid and the kind override only exist once there is a
  // verdict: an empty two-column layout and a control for correcting a
  // detection that has not happened yet are just furniture.
  resultsBox.hidden = true;
  kindRow.hidden = true;
  permalinkBox.hidden = true;
}

function setStatus(text: string, tone: "info" | "error" = "info"): void {
  statusBox.textContent = text;
  statusBox.dataset.tone = tone;
  statusBox.hidden = text === "";
}

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  // textContent, always: this is where somebody else's feed reaches the DOM.
  if (text !== undefined) node.textContent = text;
  return node;
}

/* ------------------------------------------------------------------ *
 * Step 1: discovery
 * ------------------------------------------------------------------ */

function mediaTypeLine(provenance: Provenance): string | null {
  if (provenance.via === "embedded") return null;
  switch (provenance.note.kind) {
    case "ote":
      return `Served as ${provenance.note.mediaType}.`;
    case "generic-json":
      return `Served as ${provenance.note.mediaType} — valid to parse, but it does not announce OTE. The spec has not settled on application/ote+json vs. application/feed+json yet.`;
    case "missing":
      return "Served without a content type; treated as JSON because it parses as JSON.";
  }
}

function renderDiscovery(provenance: Provenance, redirects: string[]): void {
  discoveryBox.replaceChildren();
  discoveryBox.hidden = false;
  discoveryBox.append(element("h2", undefined, "1. Discovery"));

  const list = element("dl", "facts");
  const fact = (term: string, value: string) => {
    list.append(element("dt", undefined, term), element("dd", undefined, value));
  };

  switch (provenance.via) {
    case "direct":
      discoveryBox.append(element("p", "ok", "This URL is the OTE document itself."));
      fact("Document", provenance.url);
      break;
    case "link":
      discoveryBox.append(
        element("p", "ok", "Found a feed declared by this page's <link rel=\"alternate\">."),
      );
      fact("Page", provenance.pageUrl);
      fact("Feed", provenance.url);
      break;
    case "embedded":
      discoveryBox.append(
        element("p", "ok", "Found a feed embedded in this page as <script type=\"application/ote+json\">."),
      );
      fact("Page", provenance.pageUrl);
      break;
  }

  const note = mediaTypeLine(provenance);
  if (note) fact("Media type", note);
  if (redirects.length > 0) fact("Redirects followed", redirects.join(" → "));
  discoveryBox.append(list);
}

function renderCandidates(pageUrl: string, candidates: FeedCandidate[]): void {
  candidatesBox.replaceChildren();
  candidatesBox.hidden = false;
  candidatesBox.append(
    element("h2", undefined, "1. Discovery"),
    element(
      "p",
      undefined,
      `This page declares ${candidates.length} OTE feeds. Pick the one to validate — this tool will not choose for you.`,
    ),
  );

  const list = element("ul", "candidates");
  for (const candidate of candidates) {
    const item = element("li");
    const button = element("button", "candidate", candidate.title || candidate.url);
    button.type = "button";
    button.append(element("span", "candidate-url", candidate.url));
    button.addEventListener("click", () => {
      void runCandidate(candidate, pageUrl);
    });
    item.append(button);
    list.append(item);
  }
  candidatesBox.append(list);
}

function renderNotFound(pageUrl: string, reason: string, wellKnownUrl?: string): void {
  discoveryBox.replaceChildren();
  discoveryBox.hidden = false;
  discoveryBox.append(
    element("h2", undefined, "1. Discovery"),
    // Deliberately NOT an invalid-document verdict: nothing has been
    // validated, because nothing was found to validate.
    element("p", "warn", "No OTE feed discovered on this page."),
    element("p", undefined, reason),
    element("p", "muted", `Page: ${pageUrl}`),
  );
  if (wellKnownUrl) {
    discoveryBox.append(element("p", "muted", `Not tried: ${wellKnownUrl} (still an open question in the spec).`));
  }
}

/* ------------------------------------------------------------------ *
 * Step 2: validation
 * ------------------------------------------------------------------ */

function renderFindings(
  box: HTMLElement,
  title: string,
  blurb: string,
  findings: Finding[],
  tone: "error" | "warn",
): void {
  box.replaceChildren();
  box.hidden = findings.length === 0;
  if (findings.length === 0) return;

  box.append(
    element("h3", undefined, `${title} (${findings.length})`),
    element("p", "muted", blurb),
  );

  const list = element("ol", `findings ${tone}`);
  for (const finding of findings) {
    const item = element("li");
    const where = element("button", "finding-where", formatPointer(finding.pointer));
    where.type = "button";
    if (finding.position) {
      where.append(
        element("span", "line-ref", `line ${finding.position.line}:${finding.position.column}`),
      );
      where.addEventListener("click", () => highlightLine(finding.position!.line));
    } else {
      where.disabled = true;
    }
    item.append(where, element("span", "finding-message", finding.message));
    list.append(item);
  }
  box.append(list);
}

function renderVerdict(report: Extract<Report, { status: "validated" }>, label: string): void {
  verdictBox.replaceChildren();
  verdictBox.hidden = false;

  const heading = element("h2", undefined, "2. Validation");
  const badge = element(
    "p",
    report.valid ? "badge ok" : "badge bad",
    report.valid ? "Valid OTE document" : "Invalid OTE document",
  );
  const summary = element(
    "p",
    "muted",
    report.valid
      ? `Checked as an OTE ${report.kind} against spec ${report.specVersion}. ${report.recommendations.length} recommendation(s) unmet.`
      : `Checked as an OTE ${report.kind} against spec ${report.specVersion}. ${report.errors.length} error(s) must be fixed.`,
  );
  verdictBox.append(heading, badge, summary, element("p", "muted", label));

  kindSelect.value = report.kind;
  const detection = element(
    "p",
    "muted",
    report.detected === "unknown"
      ? "This document's shape did not clearly say feed or event, so it was checked as a feed. Change it above if that is wrong."
      : `Detected as a ${report.detected} from the document's shape. Change it above if that is wrong.`,
  );
  verdictBox.append(detection);
}

function renderReport(report: Report, label: string): void {
  switch (report.status) {
    case "empty":
      setStatus("Nothing to validate yet.", "info");
      return;
    case "too-large":
    case "too-deep":
      setStatus(report.message, "error");
      return;
    case "parse-error":
      resultsBox.hidden = false;
      verdictBox.replaceChildren();
      verdictBox.hidden = false;
      verdictBox.append(
        element("h2", undefined, "2. Validation"),
        element("p", "badge bad", "Not valid JSON"),
        element(
          "p",
          undefined,
          // V8's own SyntaxError usually ends with "(line 1 column 3191)".
          // Appending our own copy of the same numbers reads like a bug.
          /line \d+ column \d+/.test(report.message)
            ? report.message
            : `${report.message} (line ${report.position.line}, column ${report.position.column})`,
        ),
        element("p", "muted", label),
      );
      // A document that does not parse is the one kind that cannot be
      // indented for reading, so a minified one leaves the user with a column
      // number in a line thousands of characters wide. Cut the window out for
      // them instead.
      if (current && looksMinified(current.source)) {
        const { text, caret } = excerptAt(current.source, report.position.offset);
        const window = element("pre", "excerpt");
        window.append(
          element("span", "excerpt-text", text),
          element("span", "excerpt-caret", `${" ".repeat(caret)}^`),
        );
        verdictBox.append(window);
      }
      errorsBox.hidden = true;
      recommendationsBox.hidden = true;
      highlightLine(report.position.line);
      return;
    case "validated":
      resultsBox.hidden = false;
      kindRow.hidden = false;
      renderVerdict(report, label);
      renderFindings(
        errorsBox,
        "Errors",
        "Schema violations (MUST). A document with any of these is not a valid OTE document.",
        report.errors,
        "error",
      );
      renderFindings(
        recommendationsBox,
        "Recommendations",
        "Unmet spec recommendations (SHOULD). The document is still valid; these make it easier to find, filter and subscribe to.",
        report.recommendations,
        "warn",
      );
  }
}

/* ------------------------------------------------------------------ *
 * Source view
 * ------------------------------------------------------------------ */

function renderSource(source: string, reformatted: boolean): void {
  sourceBox.replaceChildren();
  sourceBox.hidden = false;
  const heading = element("h3", undefined, "Document");
  if (reformatted) {
    // Said plainly, because the panel no longer shows the bytes that arrived:
    // an organizer comparing this against their own file must not conclude
    // the tool rewrote it.
    heading.append(element("span", "source-note", "indented for reading — your file is unchanged"));
  }
  sourceBox.append(heading);

  const pre = element("pre", "source");
  source.split("\n").forEach((text, index) => {
    const line = element("span", "source-line");
    line.dataset.line = String(index + 1);
    const code = element("span", "code");
    // Every piece goes in through `element`, which writes with textContent.
    // The tokenizer returns text and a class name, never markup.
    for (const token of tokenizeJsonLine(text)) {
      code.append(element("span", `tok-${token.kind}`, token.text));
    }
    line.append(element("span", "gutter", String(index + 1)), code);
    pre.append(line);
  });
  sourceBox.append(pre);
}

function highlightLine(line: number): void {
  const target = sourceBox.querySelector<HTMLElement>(`.source-line[data-line="${line}"]`);
  if (!target) return;
  for (const marked of sourceBox.querySelectorAll(".source-line.marked")) {
    marked.classList.remove("marked");
  }
  target.classList.add("marked");
  target.scrollIntoView({ block: "center", behavior: "smooth" });
}

/* ------------------------------------------------------------------ *
 * Running a validation
 * ------------------------------------------------------------------ */

/**
 * The text the page shows and validates: the document itself, or an indented
 * copy when it arrived minified.
 *
 * Published feeds are built artefacts, so the URL mode meets minified JSON as
 * the normal case — and against one 40 kB line every finding reads "line 1,
 * column 8452" and the source panel is unreadable. Reformatting cannot change
 * the verdict (same JSON value, same schema), only where the findings point,
 * which is why the report is built from this text rather than the original.
 *
 * Two documents keep their own bytes: one that does not parse (the characters
 * around a syntax error are the evidence) and one whose indented form would
 * cross the size ceiling, which would turn a valid document into "too large".
 */
function displayText(source: string): string {
  if (!looksMinified(source)) return source;
  const formatted = reformatJson(source);
  if (formatted === null || formatted.length > MAX_SOURCE_BYTES) return source;
  return formatted;
}

/** The kind chosen by hand, or undefined while the select is on "auto". */
function selectedKind(): DocumentKind | undefined {
  return kindSelect.value === "" ? undefined : (kindSelect.value as DocumentKind);
}

function validateSource(source: string, label: string, provenance?: Provenance): void {
  const shown = displayText(source);
  // `current` holds the text the findings are addressed to, not the bytes that
  // arrived: changing the kind re-renders against the same source the user is
  // looking at.
  current = { source: shown, label, provenance, reformatted: shown !== source };
  const report = buildReport(shown, { kind: selectedKind() });
  renderSource(shown, shown !== source);
  renderReport(report, label);
  setStatus("");
}

function applyResolution(resolution: Resolution, permalinkUrl: string): void {
  switch (resolution.outcome) {
    case "document":
      renderDiscovery(resolution.provenance, resolution.redirects);
      // A fresh document gets a fresh detection: the previous document's kind
      // must not leak into this one.
      kindSelect.value = "";
      validateSource(resolution.text, sourceLabel(resolution.provenance), resolution.provenance);
      showPermalink(permalinkUrl);
      break;
    case "candidates":
      renderCandidates(resolution.pageUrl, resolution.candidates);
      showPermalink(permalinkUrl);
      break;
    case "not-found":
      renderNotFound(resolution.pageUrl, resolution.reason, resolution.wellKnownUrl);
      showPermalink(permalinkUrl);
      break;
    case "error":
      setStatus(resolution.message, "error");
      break;
  }
}

function sourceLabel(provenance: Provenance): string {
  switch (provenance.via) {
    case "direct":
      return `Source: ${provenance.url}`;
    case "link":
      return `Source: ${provenance.url} (discovered from ${provenance.pageUrl})`;
    case "embedded":
      return `Source: feed embedded in ${provenance.pageUrl}`;
  }
}

function showPermalink(url: string): void {
  permalinkBox.hidden = false;
  permalinkInput.value = url;
  badgeInput.value = badgeMarkdownFor(url);
}

/**
 * The README snippet: the badge image, linking to this page's own check of the
 * same document. Built from the current origin rather than hard-coded, so a
 * page served from anywhere points at the badge endpoint next to it.
 */
function badgeMarkdownFor(permalinkUrl: string): string {
  const doc = new URL(permalinkUrl).searchParams.get("doc") ?? "";
  const badge = new URL("/badge", window.location.href);
  badge.searchParams.set("doc", doc);
  return `[![OTE feed](${badge.toString()})](${permalinkUrl})`;
}

function permalinkFor(url: string): string {
  const link = new URL(window.location.href);
  link.search = "";
  link.searchParams.set("doc", url);
  return link.toString();
}

async function runUrl(url: string): Promise<void> {
  clearResults();
  setStatus(`Fetching ${url}…`);
  const resolution = await resolveUrl(url, { endpoint: FETCH_ENDPOINT, fetchImpl: browserFetch });
  applyResolution(resolution, permalinkFor(url));
}

async function runCandidate(candidate: FeedCandidate, pageUrl: string): Promise<void> {
  setStatus(`Fetching ${candidate.url}…`);
  const resolution = await followCandidate(candidate, pageUrl, {
    endpoint: FETCH_ENDPOINT,
    fetchImpl: browserFetch,
  });
  candidatesBox.hidden = true;
  applyResolution(resolution, permalinkFor(candidate.url));
}

/* ------------------------------------------------------------------ *
 * Wiring
 * ------------------------------------------------------------------ */

for (const tab of modeTabs) {
  tab.addEventListener("click", () => setMode(tab.dataset.mode as "url" | "file" | "paste"));
}

urlForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = urlInput.value.trim();
  if (url) void runUrl(url);
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  clearResults();
  // Read in this tab and validate here: the file never leaves the browser,
  // and this mode works with the fetcher down.
  validateSource(await file.text(), `Source: ${file.name} (validated in your browser)`);
});

pasteButton.addEventListener("click", () => {
  clearResults();
  validateSource(pasteInput.value, "Source: pasted JSON (validated in your browser)");
});

kindSelect.addEventListener("change", () => {
  if (!current) return;
  const report = buildReport(current.source, { kind: selectedKind() });
  renderReport(report, current.label);
});

$("permalink-copy").addEventListener("click", () => {
  void navigator.clipboard?.writeText(permalinkInput.value);
});

$("badge-copy").addEventListener("click", () => {
  void navigator.clipboard?.writeText(badgeInput.value);
});

/** `?doc=<url>` — the mode that gets pasted into issues, and why the Worker exists. */
const requested = new URLSearchParams(window.location.search).get("doc");
if (requested) {
  setMode("url");
  urlInput.value = requested;
  void runUrl(requested);
} else {
  setMode("url");
}
