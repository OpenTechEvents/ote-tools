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
import {
  LATEST_VERSION,
  PUBLISHED_VERSIONS,
  SUPPORTED_VERSIONS,
  type SpecVersionNotice,
} from "@opentechevents/validate";

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
import {
  checkDocumentLinks,
  summarize,
  KIND_CONSEQUENCE,
  KIND_LABEL,
  type CheckedUrl,
} from "./lib/links.js";
import { followCandidate, resolveUrl, type Provenance, type Resolution } from "./lib/resolve.js";
import { collectDocumentUrls } from "./lib/urls.js";

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
const discoveryAlertBox = $("discovery-alert");
const candidatesBox = $("candidates");
const verdictBox = $("verdict");
const resultsBox = $("results");
const kindRow = $("kind-row");
const kindSelect = $<HTMLSelectElement>("kind-select");
const versionRow = $("version-row");
const versionSelect = $<HTMLSelectElement>("version-select");
const noticesBox = $("notices");
const errorsBox = $("errors");
const recommendationsBox = $("recommendations");
const linksBox = $("links");
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
  for (const box of [
    discoveryBox,
    discoveryAlertBox,
    candidatesBox,
    verdictBox,
    noticesBox,
    errorsBox,
    recommendationsBox,
    linksBox,
    sourceBox,
  ]) {
    box.replaceChildren();
    box.hidden = true;
  }
  // The results grid and the kind override only exist once there is a
  // verdict: an empty two-column layout and a control for correcting a
  // detection that has not happened yet are just furniture.
  resultsBox.hidden = true;
  kindRow.hidden = true;
  versionRow.hidden = true;
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

/**
 * Where the document came from, rendered *after* the verdict.
 *
 * Discovery used to open the page as step 1, which put a paragraph about
 * `<link rel="alternate">` above the one thing the reader came for. Once a
 * document has been found, how it was found is provenance: worth being able
 * to check — a URL that quietly resolved to a different feed is exactly the
 * confusion this panel prevents — but not worth reading first.
 *
 * Discovery that *fails* is the opposite, and is not rendered here: with no
 * document there is no verdict, so "no feed found" and "several feeds
 * declared" stay above the fold. See renderNotFound and renderCandidates.
 */
function renderDiscovery(provenance: Provenance, redirects: string[]): void {
  discoveryBox.replaceChildren();
  discoveryBox.hidden = false;
  discoveryBox.append(element("h3", undefined, "Where this came from"));

  const list = element("dl", "facts");
  const fact = (term: string, value: string) => {
    list.append(element("dt", undefined, term), element("dd", undefined, value));
  };

  switch (provenance.via) {
    case "direct":
      discoveryBox.append(element("p", "muted", "This URL is the OTE document itself."));
      fact("Document", provenance.url);
      break;
    case "link":
      discoveryBox.append(
        element("p", "muted", "Found a feed declared by this page's <link rel=\"alternate\">."),
      );
      fact("Page", provenance.pageUrl);
      fact("Feed", provenance.url);
      break;
    case "embedded":
      discoveryBox.append(
        element("p", "muted", "Found a feed embedded in this page as <script type=\"application/ote+json\">."),
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
    element("h2", undefined, "Which feed?"),
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
  discoveryAlertBox.replaceChildren();
  discoveryAlertBox.hidden = false;
  discoveryAlertBox.append(
    element("h2", undefined, "No feed found"),
    // Deliberately NOT an invalid-document verdict: nothing has been
    // validated, because nothing was found to validate.
    element("p", "warn", "No OTE feed discovered on this page."),
    element("p", undefined, reason),
    element("p", "muted", `Page: ${pageUrl}`),
  );
  if (wellKnownUrl) {
    discoveryAlertBox.append(
      element("p", "muted", `Not tried: ${wellKnownUrl} (still an open question in the spec).`),
    );
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

/**
 * How the verdict names the version it used. The document's own version is
 * the normal case and says so plainly; a hand-picked one has to be
 * unmistakable, because it answers a different question than the one the page
 * answers by default.
 */
function versionSentence(report: Extract<Report, { status: "validated" }>): string {
  if (report.specVersion === null) {
    return `Checked as an OTE ${report.kind}. No spec version could be applied.`;
  }
  const against = report.overridden
    ? `against spec ${report.specVersion} (selected by hand)`
    : `against spec ${report.specVersion}, the version it declares`;
  return `Checked as an OTE ${report.kind} ${against}.`;
}

function renderVerdict(report: Extract<Report, { status: "validated" }>, label: string): void {
  verdictBox.replaceChildren();
  verdictBox.hidden = false;

  const heading = element("h2", undefined, "Validation");
  const badge = element(
    "p",
    report.valid ? "badge ok" : "badge bad",
    report.valid ? "Valid OTE document" : "Invalid OTE document",
  );
  const counts = report.valid
    ? `${report.recommendations.length} recommendation(s) unmet.`
    : `${report.errors.length} error(s) must be fixed.`;
  const summary = element("p", "muted", `${versionSentence(report)} ${counts}`);
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

/**
 * Notices: true things that are not defects — an older but still supported
 * release, a version the user picked by hand.
 *
 * Deliberately NOT a third verdict state. The page already has exactly two
 * (valid / invalid) plus a warning channel for the recommended profile, and
 * inventing a yellow "valid, but…" badge is how a supported-but-older feed
 * ends up being "fixed" by a publisher who had nothing to fix.
 */
function renderNotices(notices: SpecVersionNotice[]): void {
  noticesBox.replaceChildren();
  noticesBox.hidden = notices.length === 0;
  if (notices.length === 0) return;

  noticesBox.append(
    element("h3", undefined, "Notices"),
    element(
      "p",
      "muted",
      "About this document's spec version. These do not affect the verdict above.",
    ),
  );
  const list = element("ul", "findings notice");
  for (const notice of notices) {
    const item = element("li", "notice");
    item.append(element("p", "notice-text", notice.message));
    // Links arrive as {label, href} rather than inside the sentence: a URL
    // printed mid-paragraph is something the reader has to copy by hand. These
    // are this page's own constants — nothing from a fetched document ever
    // becomes an anchor here.
    for (const link of notice.links) {
      const anchor = element("a", "notice-link", link.label);
      anchor.href = link.href;
      anchor.rel = "noopener noreferrer";
      anchor.target = "_blank";
      item.append(anchor);
    }
    list.append(item);
  }
  noticesBox.append(list);
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
        element("h2", undefined, "Validation"),
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
      noticesBox.hidden = true;
      highlightLine(report.position.line);
      return;
    case "validated":
      resultsBox.hidden = false;
      kindRow.hidden = false;
      versionRow.hidden = false;
      renderVerdict(report, label);
      renderNotices([
        ...report.notices,
        // Said rather than left as an empty list: "no recommendations" would
        // read as "nothing to improve", when the profile did not exist yet.
        ...(report.recommendedProfileChecked || report.specVersion === null
          ? []
          : [
              {
                message:
                  `OTE Spec ${report.specVersion} predates the recommended (quality) ` +
                  "profile, which arrived in 0.3.0 — so this check covers validity only.",
                links: [],
              },
            ]),
      ]);
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
      renderLinkOffer(report.document);
  }
}

/* ------------------------------------------------------------------ *
 * Step 3: are the document's URLs reachable?
 * ------------------------------------------------------------------ */

/**
 * Opt-in, and on its own: the schema verdict is instant, and hundreds of
 * network requests are not. Nothing here can change that verdict — a 404 is
 * not a schema violation, and a page that let one turn a feed red would have
 * publishers "fixing" documents that are already correct.
 */
function renderLinkOffer(json: unknown): void {
  const urls = collectDocumentUrls(json);
  linksBox.replaceChildren();
  linksBox.hidden = urls.length === 0;
  if (urls.length === 0) return;

  linksBox.append(
    element("h3", undefined, "Links"),
    element(
      "p",
      "muted",
      `This document points at ${urls.length} address(es). Checking them is a separate ` +
        "question from validity: a broken link never makes a document invalid.",
    ),
  );
  const button = element("button", "btn btn-ghost", "Check whether these URLs load");
  button.type = "button";
  button.addEventListener("click", () => {
    void runLinkCheck(json, button);
  });
  linksBox.append(button);
}

/** Groups the findings so the ones that need action are not buried. */
function renderLinkResults(checked: CheckedUrl[]): void {
  const counts = summarize(checked);
  linksBox.replaceChildren(
    element("h3", undefined, "Links"),
    element(
      "p",
      "muted",
      `${counts.ok} load, ${counts.broken} broken, ${counts.unverifiable} could not be checked` +
        (counts.skipped > 0 ? `, ${counts.skipped} not checked` : "") +
        ". None of this affects the verdict above.",
    ),
  );

  const section = (
    state: CheckedUrl["state"],
    title: string,
    blurb: string,
    tone: "error" | "warn" | "muted",
  ): void => {
    const entries = checked.filter((entry) => entry.state === state);
    if (entries.length === 0) return;
    linksBox.append(
      element("h4", undefined, `${title} (${entries.length})`),
      element("p", "muted", blurb),
    );
    const list = element("ul", `findings ${tone}`);
    for (const entry of entries) {
      const item = element("li");
      item.append(
        element("span", "link-kind", KIND_LABEL[entry.kind]),
        element("span", "link-url", entry.url),
        element(
          "span",
          "finding-message",
          state === "broken"
            ? `${entry.reason} — ${KIND_CONSEQUENCE[entry.kind]}`
            : entry.reason,
        ),
      );
      list.append(item);
    }
    linksBox.append(list);
  };

  section(
    "broken",
    "Broken",
    "Nobody can fetch these: they answered a client error, or the host does not resolve.",
    "error",
  );
  section(
    "unverifiable",
    "Could not be checked",
    // Said plainly, because this is the class that would otherwise be read as
    // a defect: platforms that refuse automated requests are the norm, not a
    // publisher's mistake.
    "These servers refuse automated requests, rate-limited us, or did not answer in time. " +
      "That is not a problem with the document — open them in a browser to be sure.",
    "warn",
  );
  section("skipped", "Not checked", "Left over from this batch's budget.", "muted");
}

async function runLinkCheck(json: unknown, button: HTMLButtonElement): Promise<void> {
  button.disabled = true;
  button.textContent = "Checking…";
  const report = await checkDocumentLinks(json, {
    endpoint: FETCH_ENDPOINT,
    fetchImpl: browserFetch,
  });
  if (report.status === "error") {
    button.disabled = false;
    button.textContent = "Check whether these URLs load";
    linksBox.append(element("p", "warn", report.message));
    return;
  }
  renderLinkResults(report.checked);
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

/** The version chosen by hand, or undefined while the select is on "auto". */
function selectedVersion(): string | undefined {
  return versionSelect.value === "" ? undefined : versionSelect.value;
}

/**
 * Fills the version selector from the versions this build embeds. Every
 * published version is offered, including the ones outside the support
 * window: somebody still on 0.1 is precisely who needs to see what a move
 * would cost, and the option's label says where each version stands.
 */
function fillVersionSelect(): void {
  versionSelect.replaceChildren();
  const auto = element("option", undefined, "From the document");
  auto.value = "";
  versionSelect.append(auto);
  // Newest first: the version a migration is heading towards is the one most
  // people are reaching for.
  for (const version of [...PUBLISHED_VERSIONS].reverse()) {
    const label =
      version === LATEST_VERSION
        ? `${version} (current)`
        : SUPPORTED_VERSIONS.includes(version)
          ? version
          : `${version} (out of support)`;
    const option = element("option", undefined, label);
    option.value = version;
    versionSelect.append(option);
  }
  versionSelect.value = "";
}

async function validateSource(
  source: string,
  label: string,
  provenance?: Provenance,
): Promise<void> {
  const shown = displayText(source);
  // `current` holds the text the findings are addressed to, not the bytes that
  // arrived: changing the kind re-renders against the same source the user is
  // looking at.
  current = { source: shown, label, provenance, reformatted: shown !== source };
  const report = await buildReport(shown, {
    kind: selectedKind(),
    version: selectedVersion(),
  });
  renderSource(shown, shown !== source);
  renderReport(report, label);
  setStatus("");
}

async function applyResolution(resolution: Resolution, permalinkUrl: string): Promise<void> {
  switch (resolution.outcome) {
    case "document":
      renderDiscovery(resolution.provenance, resolution.redirects);
      // A fresh document gets a fresh detection: the previous document's kind
      // — and the previous document's hand-picked version — must not leak
      // into this one.
      kindSelect.value = "";
      versionSelect.value = "";
      await validateSource(
        resolution.text,
        sourceLabel(resolution.provenance),
        resolution.provenance,
      );
      showPermalink(permalinkUrl);
      break;
    case "candidates":
      renderCandidates(resolution.pageUrl, resolution.candidates);
      showPermalink(permalinkUrl);
      // These two outcomes are as final as a verdict, and the "Fetching …"
      // line above them is not: only validateSource used to clear it, so a
      // finished discovery kept claiming to still be fetching.
      setStatus("");
      break;
    case "not-found":
      renderNotFound(resolution.pageUrl, resolution.reason, resolution.wellKnownUrl);
      showPermalink(permalinkUrl);
      setStatus("");
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
  await applyResolution(resolution, permalinkFor(url));
}

async function runCandidate(candidate: FeedCandidate, pageUrl: string): Promise<void> {
  setStatus(`Fetching ${candidate.url}…`);
  const resolution = await followCandidate(candidate, pageUrl, {
    endpoint: FETCH_ENDPOINT,
    fetchImpl: browserFetch,
  });
  candidatesBox.hidden = true;
  await applyResolution(resolution, permalinkFor(candidate.url));
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
  await validateSource(await file.text(), `Source: ${file.name} (validated in your browser)`);
});

pasteButton.addEventListener("click", () => {
  clearResults();
  void validateSource(pasteInput.value, "Source: pasted JSON (validated in your browser)");
});

/** Re-runs the current document after a kind or version override. */
async function revalidateCurrent(): Promise<void> {
  if (!current) return;
  const report = await buildReport(current.source, {
    kind: selectedKind(),
    version: selectedVersion(),
  });
  renderReport(report, current.label);
}

kindSelect.addEventListener("change", () => {
  void revalidateCurrent();
});

versionSelect.addEventListener("change", () => {
  void revalidateCurrent();
});

$("permalink-copy").addEventListener("click", () => {
  void navigator.clipboard?.writeText(permalinkInput.value);
});

$("badge-copy").addEventListener("click", () => {
  void navigator.clipboard?.writeText(badgeInput.value);
});

fillVersionSelect();

/** `?doc=<url>` — the mode that gets pasted into issues, and why the Worker exists. */
const requested = new URLSearchParams(window.location.search).get("doc");
if (requested) {
  setMode("url");
  urlInput.value = requested;
  void runUrl(requested);
} else {
  setMode("url");
}
