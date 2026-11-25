import { toJsonLdScript, type OteFeed } from "@opentechevents/export-jsonld";

const escapeHtml = (s: string): string => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

/** Highlight JSON-LD without changing its text or trusting document contents. */
function highlightScript(script: string): string {
  const firstNewline = script.indexOf("\n");
  const closing = script.lastIndexOf("\n</script>");
  if (firstNewline < 0 || closing < firstNewline) return escapeHtml(script);
  const opening = script.slice(0, firstNewline);
  const json = script.slice(firstNewline, closing);
  const tail = script.slice(closing);
  const token = /"(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  let result = "", pos = 0;
  for (const match of json.matchAll(token)) {
    const index = match.index;
    result += escapeHtml(json.slice(pos, index));
    const value = match[0];
    const kind = value.startsWith('"') ? (/^\s*:/.test(json.slice(index + value.length)) ? "key" : "string") : /^(true|false|null)$/.test(value) ? "literal" : "number";
    result += `<span class="syntax-${kind}">${escapeHtml(value)}</span>`;
    pos = index + value.length;
  }
  return `<span class="syntax-tag">${escapeHtml(opening)}</span>${result}${escapeHtml(json.slice(pos))}<span class="syntax-tag">${escapeHtml(tail)}</span>`;
}

/** Keep events visible through their final day when no end time is known. */
export function isPastEvent(event: OteFeed["events"][number], now: Date): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: event.timezone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }).formatToParts(now);
    const get = (name: string) => parts.find(part => part.type === name)?.value ?? "";
    const today = `${get("year")}-${get("month")}-${get("day")}`;
    const end = event.endDate ?? event.startDate;
    const day = end.slice(0, 10);
    if (day !== today) return day < today;
    if (!event.endDate || !end.includes("T")) return false;
    const time = end.slice(11).padEnd(8, ":00");
    return time <= `${get("hour")}:${get("minute")}:${get("second")}`;
  } catch {
    // Unknown timezone: do not hide an event on a guess.
    return false;
  }
}

/** Served from the same origin so user-supplied JSON never becomes executable code. */
export const schemaPageScript = `
const button = document.querySelector('[data-copy]');
const text = document.querySelector('#snippet');
const status = document.querySelector('#copy-status');
const urlInput = document.querySelector('#share-url');
const copyUrl = document.querySelector('[data-copy-url]');
const urlStatus = document.querySelector('#share-status');
if (urlInput && copyUrl && urlStatus) {
  urlInput.value = location.href;
  copyUrl.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(urlInput.value);
      urlStatus.textContent = 'URL copied to clipboard.';
    } catch {
      urlInput.focus();
      urlInput.select();
      urlStatus.textContent = 'Copy the selected URL with your keyboard.';
    }
  });
}
if (button && text && status) button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(text.textContent);
    status.textContent = 'Copied to clipboard.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(text);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Select the code and copy it with your keyboard.';
  }
});`;

export function renderSchemaPage(data: unknown, url: URL, feed?: OteFeed, selectedId?: string): string {
  const snippet = highlightScript(toJsonLdScript(data as Parameters<typeof toJsonLdScript>[0]));
  const source = url.searchParams.get("feed") ?? url.searchParams.get("event") ?? "";
  const selected = selectedId ? feed?.events.find((event) => event.id === selectedId) : undefined;
  const title = selected?.name ?? (feed ? feed.title : "Event structured data");
  const allUrl = new URL(url); allUrl.searchParams.delete("id"); allUrl.searchParams.delete("output");
  const scriptUrl = new URL(url); scriptUrl.searchParams.set("output", "script");
  const jsonUrl = new URL(url); jsonUrl.searchParams.set("output", "json");
  const now = new Date();
  const sorted = [...(feed?.events ?? [])].sort((a, b) => b.startDate.localeCompare(a.startDate) || a.id.localeCompare(b.id));
  const upcoming: OteFeed["events"] = [];
  const past: OteFeed["events"] = [];
  for (const event of sorted) (isPastEvent(event, now) ? past : upcoming).push(event);
  const eventLink = (event: OteFeed["events"][number]) => {
    const eventUrl = new URL(allUrl); eventUrl.searchParams.set("id", event.id);
    const active = event.id === selectedId;
    return `<li><a class="event-link${active ? " active" : ""}" href="${escapeHtml(eventUrl.pathname + eventUrl.search)}"${active ? ' aria-current="page"' : ""}><span class="event-name">${escapeHtml(event.name)}</span><span class="event-date">${escapeHtml(event.startDate.replace("T", " "))}</span></a></li>`;
  };
  const pastEvents = past.length ? `<li><details class="past-events"${past.some(event => event.id === selectedId) ? " open" : ""}><summary>Past events (${past.length})</summary><ul>${past.map(eventLink).join("")}</ul></details></li>` : "";
  const events = upcoming.map(eventLink).join("") + pastEvents;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Schema.org export | OTE</title><style>
:root{--ink:#10131a;--soft:#4a5265;--faint:#6f7787;--line:#e3e6ea;--accent:#2b5bd7;--alt:#f6f7f9;--mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;--sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Helvetica,Arial,sans-serif}*{box-sizing:border-box}body{margin:0;font:17px/1.6 var(--sans);color:var(--ink);background:#fff}a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}.wrap{max-width:1120px;padding:0 24px;margin:auto}.site-header{border-bottom:1px solid var(--line);background:#fff}.header-inner{height:64px;display:flex;align-items:center;gap:9px}.brand{display:flex;gap:9px;align-items:center;color:var(--ink);font-weight:650}.brand:hover{text-decoration:none}.brand-mark{font:700 .78rem var(--mono);letter-spacing:.06em;background:var(--ink);color:#fff;padding:6px 7px;border-radius:6px}.nav{margin-left:auto;display:flex;gap:20px;font-size:.92rem}.nav a{color:var(--soft)}main#main{margin-top:24px;padding:42px 0 72px}h1,h2,h3,p{margin:0}h1{font-size:clamp(1.8rem,4vw,2.6rem);line-height:1.15;letter-spacing:-.03em}h2{font-size:1.1rem;line-height:1.3}.intro{color:var(--soft);margin-top:20px;width:100%}.source{font-size:.85rem;color:var(--faint);margin-top:10px;overflow-wrap:anywhere}.layout{display:grid;grid-template-columns:minmax(0,1fr);gap:24px;margin-top:32px}.layout.with-events{grid-template-columns:minmax(220px,300px) minmax(0,1fr)}.panel{border:1px solid var(--line);border-radius:10px;background:#fff;min-width:0}.events-head,.code-head{padding:18px 20px;border-bottom:1px solid var(--line)}.muted{color:var(--soft);font-size:.9rem}.events-head p,.code-head p{margin-top:5px}.event-list{list-style:none;padding:8px;margin:0;max-height:620px;overflow:auto}.event-link{display:flex;flex-direction:column;padding:10px 12px;color:var(--ink);border-radius:7px;line-height:1.35}.event-link:hover,.event-link.active{background:#eaf0fe;text-decoration:none}.event-link.active{box-shadow:inset 3px 0 var(--accent)}.event-name{font-weight:600;overflow-wrap:anywhere}.event-date{font-size:.82rem;color:var(--soft);margin-top:4px}.all-link{display:block;padding:9px 12px;font-weight:600}.past-events{margin:8px 4px;border-top:1px solid var(--line);padding-top:8px}.past-events summary{cursor:pointer;padding:9px 8px;color:var(--soft);font-size:.9rem;font-weight:600}.past-events ul{list-style:none;margin:0;padding:0}.past-events summary:focus-visible{outline:3px solid #80a1ff;outline-offset:3px}.code-top{display:flex;align-items:center;justify-content:space-between;gap:16px}.btn{border:0;border-radius:7px;background:var(--accent);color:white;padding:10px 16px;font:600 .9rem var(--sans);cursor:pointer;white-space:nowrap}.btn:hover{background:#1e46ab}.btn:focus-visible,a:focus-visible{outline:3px solid #80a1ff;outline-offset:3px}.copy-status{font-size:.85rem;color:var(--soft);min-height:1.4em;margin-top:8px}.code-wrap{background:#10131a;color:#e9edf7;border-radius:0 0 9px 9px;overflow:auto}pre{margin:0;padding:22px;font:13px/1.6 var(--mono);white-space:pre;tab-size:2}.syntax-key{color:#9ac7ff}.syntax-string{color:#a8d8ab}.syntax-number,.syntax-literal{color:#edc58c}.syntax-tag{color:#c5a4f4}.share{margin-top:24px;padding:20px 22px}.share p{margin-top:6px}.share-row{display:flex;gap:10px;margin-top:12px}.share-row input{min-width:0;flex:1;border:1px solid #b8c0cb;border-radius:7px;padding:10px 12px;color:var(--ink);font:14px var(--mono)}.btn-secondary{background:#fff;color:var(--accent);border:1px solid #b8c0cb}.btn-secondary:hover{background:#eaf0fe}.share-status{font-size:.85rem;color:var(--soft);min-height:1.3em}.guidance{margin-top:24px;border-radius:10px;background:var(--alt);padding:20px 22px;color:var(--soft);font-size:.92rem}.guidance p+p{margin-top:10px}.validators{display:flex;gap:18px;flex-wrap:wrap;margin-top:10px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.skip{position:absolute;left:-9999px}.skip:focus{left:12px;top:12px;background:#fff;padding:8px;z-index:10}@media(max-width:720px){.share-row{flex-direction:column}.layout.with-events{grid-template-columns:1fr}.event-list{max-height:260px}.nav a:not(:last-child){display:none}main#main{padding-top:28px}.wrap{padding:0 16px}}
</style><script src="/schema-ui.js?v=2" defer></script></head><body><a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="wrap header-inner"><a class="brand" href="/"><span class="brand-mark">OTE</span><span>Converter</span></a><nav class="nav" aria-label="Site"><a href="https://opentechevents.org/spec/">Reference</a><a href="https://validator.opentechevents.org/">Validator</a><a href="https://github.com/OpenTechEvents/ote-tools">GitHub</a></nav></div></header><main id="main" class="wrap"><h1>Schema.org export</h1><p class="intro">Add structured event data to your website. Copy the JSON-LD into the page that describes the event.</p><p class="source">Source: ${escapeHtml(source)}</p><div class="layout${feed ? " with-events" : ""}">${feed ? `<aside class="panel"><div class="events-head"><h2>Events in this feed</h2><p class="muted">Choose an event to inspect its structured data.</p></div><ul class="event-list"><li><a class="all-link${selectedId ? "" : " active"}" href="${escapeHtml(allUrl.pathname + allUrl.search)}"${selectedId ? "" : ' aria-current="page"'}>All events (${feed.events.length})</a></li>${events}</ul></aside>` : ""}<section class="panel" aria-labelledby="code-title"><div class="code-head"><div class="code-top"><div><h2 id="code-title">${escapeHtml(title)}</h2><p class="muted">${selected || !feed ? "One event" : "All events"} · JSON-LD</p></div><button class="btn" type="button" data-copy>Copy code</button></div><p class="copy-status" id="copy-status" role="status" aria-live="polite"></p></div><div class="code-wrap"><pre><code id="snippet">${snippet}</code></pre></div></section></div><section class="panel share" aria-labelledby="share-heading"><h2 id="share-heading">Share or automate</h2><p class="muted">Copy the URL to share this view. For a build or integration, use the <a href="${escapeHtml(scriptUrl.pathname + scriptUrl.search)}">script output</a> or <a href="${escapeHtml(jsonUrl.pathname + jsonUrl.search)}">JSON-LD output</a>.</p><div class="share-row"><label class="sr-only" for="share-url">URL of this schema view</label><input id="share-url" type="text" readonly value="${escapeHtml(url.pathname + url.search)}"><button class="btn btn-secondary" type="button" data-copy-url>Copy URL</button></div><p class="share-status" id="share-status" role="status" aria-live="polite"></p></section><section class="guidance" aria-label="Using structured data"><p>Paste this code into the HTML of a page that visibly describes the same event${feed && !selectedId ? "s" : ""}. Regenerate it when the source changes.</p><p>Check your page or code with:</p><div class="validators"><a href="https://validator.schema.org/">Schema Markup Validator</a><a href="https://search.google.com/test/rich-results">Google Rich Results Test</a></div></section></main></body></html>`;
}
