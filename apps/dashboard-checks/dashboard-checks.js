/*
 * dashboard-checks.js — setup checks + template-update banner for OTE
 * organizer dashboards (ote-template forks).
 *
 * Served from tools.opentechevents.org/dashboard-checks.js and loaded by the
 * fork's docs/index.html with `defer` + onerror="void 0". It runs in the
 * organizer's GitHub Pages origin.
 *
 * Contract with the template (do not change, wired on the template side):
 *   - window.OTE_REPO = "owner/name" (may be undefined on an undetected
 *     custom domain — handled gracefully: the script does nothing).
 *   - <div id="ote-checks" aria-live="polite"></div> is the mount point.
 *
 * Constraints: vanilla JS, no dependencies, no build step, no modules,
 * CSP-safe (no eval, no innerHTML, no injected <style>; styles are set via
 * CSSOM element.style.* which strict style-src does not block). Everything
 * FAILS SILENTLY: any network/CORS/parse error leaves the page exactly as-is.
 * Only public CORS-open endpoints are used (api.github.com sends CORS `*`,
 * raw.githubusercontent.com too). Idempotent: never double-injects.
 */
"use strict";

var API = "https://api.github.com";
var RAW = "https://raw.githubusercontent.com";
var UPSTREAM = "OpenTechEvents/ote-template";
var MOUNT_ID = "ote-checks";

// Sample values shipped by ote-template. "Config filled" flags any of these
// left untouched. Kept as data so they track the template's samples.
var SAMPLE_TITLE_PREFIX = "Sample Tech Community";
var SAMPLE_URL_PREFIX = "https://sample-community.example";
// Event slugs shipped as samples. `.etc` is covered by the loose matcher.
var SAMPLE_EVENT_SLUGS = ["2026-09-monthly-meetup"];
var SAMPLE_EVENT_RE = /(^|-)(monthly-meetup|lightning-talks)$/i;

/* ------------------------------------------------------------------ *
 * Pure helpers (exported for tests; no DOM, no network).
 * ------------------------------------------------------------------ */

// Parse a semver-ish string ("v1.2.0", "1.2.0-rc.1\n") into [major, minor,
// patch]; null when it does not start with x.y.z.
function parseSemver(value) {
  if (typeof value !== "string") return null;
  var m = value.trim().replace(/^v/i, "").match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
}

// -1 / 0 / 1. Unparseable operands compare equal, so a malformed VERSION
// never produces a false "update available".
function compareSemver(a, b) {
  var pa = parseSemver(a);
  var pb = parseSemver(b);
  if (!pa || !pb) return 0;
  for (var i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] > pb[i] ? 1 : -1;
  }
  return 0;
}

// Which feed fields of an ote.config.json still hold sample placeholders.
function detectConfigPlaceholders(config) {
  var feed = config && typeof config === "object" && config.feed ? config.feed : {};
  var flagged = [];
  if (!feed.title || String(feed.title).indexOf(SAMPLE_TITLE_PREFIX) === 0) {
    flagged.push("title");
  }
  if (!feed.description) {
    flagged.push("description");
  }
  if (!feed.url || String(feed.url).indexOf(SAMPLE_URL_PREFIX) === 0) {
    flagged.push("url");
  }
  return flagged;
}

// Which of the given event file names are still the shipped samples.
function detectSampleEvents(names) {
  if (!Array.isArray(names)) return [];
  return names
    .map(function (n) {
      return String(n).replace(/\.json$/i, "");
    })
    .filter(function (slug) {
      return SAMPLE_EVENT_SLUGS.indexOf(slug) !== -1 || SAMPLE_EVENT_RE.test(slug);
    });
}

// CHANGELOG.md sections whose version is in (fromVersion, toVersion]. Splits
// on Markdown headings that start with a version, e.g. "## [1.2.0] - 2026…".
function changelogSectionsBetween(text, fromVersion, toVersion) {
  if (typeof text !== "string") return [];
  var lines = text.split(/\r?\n/);
  var headRe = /^#{1,6}\s+\[?v?(\d+\.\d+\.\d+)/;
  var sections = [];
  var current = null;
  for (var i = 0; i < lines.length; i++) {
    var m = lines[i].match(headRe);
    if (m) {
      if (current) sections.push(current);
      current = { version: m[1], lines: [lines[i]] };
    } else if (current) {
      current.lines.push(lines[i]);
    }
  }
  if (current) sections.push(current);
  return sections.filter(function (s) {
    return (
      compareSemver(s.version, fromVersion) > 0 &&
      compareSemver(s.version, toVersion) <= 0
    );
  });
}

/* ------------------------------------------------------------------ *
 * Fetch helpers — never reject; resolve to null / a plain shape.
 * ------------------------------------------------------------------ */

function ghGet(path) {
  return fetch(API + path, { headers: { Accept: "application/vnd.github+json" } })
    .then(function (r) {
      return r
        .json()
        .catch(function () {
          return null;
        })
        .then(function (body) {
          return { ok: r.ok, status: r.status, body: body };
        });
    })
    .catch(function () {
      return null;
    });
}

function rawGet(repo, file) {
  return fetch(RAW + "/" + repo + "/HEAD/" + file)
    .then(function (r) {
      return r.ok ? r.text() : null;
    })
    .catch(function () {
      return null;
    });
}

// tag_name of the latest ote-template release; falls back to the newest tag.
function getLatestUpstreamVersion() {
  return ghGet("/repos/" + UPSTREAM + "/releases/latest").then(function (res) {
    if (res && res.ok && res.body && res.body.tag_name) return res.body.tag_name;
    return ghGet("/repos/" + UPSTREAM + "/tags?per_page=1").then(function (t) {
      if (t && t.ok && Array.isArray(t.body) && t.body[0]) return t.body[0].name;
      return null;
    });
  });
}

/* ------------------------------------------------------------------ *
 * Session cache (per repo). "For the session" → sessionStorage, so a
 * re-check happens in a new tab and the 60/h unauth limit is respected.
 * ------------------------------------------------------------------ */

function cacheKey(repo) {
  return "ote-checks:setup:" + repo;
}

function readCache(key) {
  try {
    var raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota: caching is best-effort */
  }
}

/* ------------------------------------------------------------------ *
 * Setup checks. Each returns a result object and never rejects.
 * status: pass | warn | fail | info | unverifiable | unknown
 * ------------------------------------------------------------------ */

function result(status, id, title, detail, link, linkText) {
  return {
    status: status,
    id: id,
    title: title,
    detail: detail || "",
    link: link || "",
    linkText: linkText || "",
  };
}

function unknownResult(id, title) {
  return result(
    "unknown",
    id,
    title,
    "Couldn't check automatically (rate limit, network or CORS).",
  );
}

function checkIssues(repo) {
  return ghGet("/repos/" + repo).then(function (res) {
    if (!res || !res.ok || !res.body) return unknownResult("issues", "Issues enabled");
    if (res.body.has_issues) return result("pass", "issues", "Issues are enabled");
    return result(
      "fail",
      "issues",
      "Issues are disabled",
      "The issue → PR write flow needs them. Turn on Settings → General → Features → Issues.",
      "https://github.com/" + repo + "/settings",
      "Open repository settings",
    );
  });
}

function checkLabel(repo) {
  return ghGet("/repos/" + repo + "/labels/ote-event").then(function (res) {
    if (!res) return unknownResult("label", "ote-event label");
    if (res.status === 200) return result("pass", "label", "The ote-event label exists");
    if (res.status === 404) {
      return result(
        "fail",
        "label",
        "The ote-event label is missing",
        "The issue → PR workflow filters on it. Create a label named exactly ote-event.",
        "https://github.com/" + repo + "/labels",
        "Manage labels",
      );
    }
    return unknownResult("label", "ote-event label");
  });
}

function checkActions(repo) {
  return ghGet("/repos/" + repo + "/actions/runs?per_page=1").then(function (res) {
    if (!res || !res.ok || !res.body) return unknownResult("actions", "GitHub Actions");
    var runs = res.body.workflow_runs;
    if (!runs || !runs.length) {
      return result(
        "warn",
        "actions",
        "No workflow runs yet",
        "Push to the default branch or open a PR to trigger the OTE workflows.",
        "https://github.com/" + repo + "/actions",
        "Open the Actions tab",
      );
    }
    var run = runs[0];
    var failed = ["failure", "cancelled", "timed_out", "startup_failure", "action_required"];
    if (run.conclusion && failed.indexOf(run.conclusion) !== -1) {
      return result(
        "fail",
        "actions",
        "The latest workflow run failed",
        "Open the run to see what broke: " + (run.name || "workflow") + ".",
        run.html_url || "https://github.com/" + repo + "/actions",
        "View the failing run",
      );
    }
    return result("pass", "actions", "GitHub Actions are running");
  });
}

function checkConfig(repo) {
  return rawGet(repo, "ote.config.json").then(function (text) {
    if (text == null) return unknownResult("config", "ote.config.json");
    var config;
    try {
      config = JSON.parse(text);
    } catch {
      return unknownResult("config", "ote.config.json");
    }
    var flagged = detectConfigPlaceholders(config);
    if (!flagged.length) return result("pass", "config", "ote.config.json is filled in");
    return result(
      "warn",
      "config",
      "ote.config.json still has sample values",
      "Replace the placeholder feed " + flagged.join(", ") + ".",
      "https://github.com/" + repo + "/edit/HEAD/ote.config.json",
      "Edit ote.config.json",
    );
  });
}

function checkSamples(repo) {
  return ghGet("/repos/" + repo + "/contents/events").then(function (res) {
    if (!res || !res.ok || !Array.isArray(res.body)) {
      return unknownResult("samples", "Sample events");
    }
    var names = res.body
      .filter(function (f) {
        return f && f.type === "file";
      })
      .map(function (f) {
        return f.name;
      });
    var samples = detectSampleEvents(names);
    if (!samples.length) return result("pass", "samples", "No sample events left");
    return result(
      "info",
      "samples",
      "Sample events are still published",
      "These shipped with the template: " + samples.join(", ") + ". Delete or replace them when ready.",
      "https://github.com/" + repo + "/tree/HEAD/events",
      "Open the events folder",
    );
  });
}

// BLIND SPOT: "Allow GitHub Actions to create and approve pull requests"
// lives at /repos/{repo}/actions/permissions/workflow, which needs
// administration:read and is NOT readable unauthenticated. Never fake a
// pass/fail — show it as an unverifiable reminder. The issue → PR reusable
// workflow catches this same setting at PR-open time and comments there.
function workflowPermissionReminder(repo) {
  return result(
    "unverifiable",
    "workflow-perms",
    "Actions can create pull requests",
    "Can't be checked automatically — confirm Settings → Actions → General → Workflow permissions has “Allow GitHub Actions to create and approve pull requests” enabled, or the issue → PR flow can't open PRs.",
    "https://github.com/" + repo + "/settings/actions",
    "Open Actions settings",
  );
}

function runSetupChecks(repo) {
  return Promise.all([
    checkIssues(repo),
    checkLabel(repo),
    checkActions(repo),
    checkConfig(repo),
    checkSamples(repo),
  ]).then(function (results) {
    results.push(workflowPermissionReminder(repo));
    return results;
  });
}

/* ------------------------------------------------------------------ *
 * DOM rendering. No innerHTML; styles via CSSOM (CSP-safe). Container
 * reuses the dashboard's `.banner` class and pins the same look inline
 * (light-yellow box, 1px border, 6px radius) so it holds even without it.
 * ------------------------------------------------------------------ */

var ICON = {
  pass: "✅",
  warn: "⚠️",
  fail: "❌",
  info: "ℹ️",
  unverifiable: "🔍",
  unknown: "➖",
};

function make(tag, props) {
  var el = document.createElement(tag);
  props = props || {};
  if (props.text != null) el.textContent = props.text;
  if (props.className) el.className = props.className;
  if (props.href) el.href = props.href;
  if (props.styles) {
    for (var k in props.styles) {
      if (Object.prototype.hasOwnProperty.call(props.styles, k)) el.style[k] = props.styles[k];
    }
  }
  if (props.attrs) {
    for (var a in props.attrs) {
      if (Object.prototype.hasOwnProperty.call(props.attrs, a)) el.setAttribute(a, props.attrs[a]);
    }
  }
  return el;
}

function styleBanner(el) {
  el.className = "banner";
  el.style.background = "#fff8c5";
  el.style.color = "#1f2328";
  el.style.border = "1px solid rgba(27,31,36,0.15)";
  el.style.borderRadius = "6px";
  el.style.padding = "12px 16px";
  el.style.margin = "12px 0";
}

function styleButton(el) {
  el.style.cursor = "pointer";
  el.style.font = "inherit";
  el.style.padding = "6px 12px";
  el.style.borderRadius = "6px";
  el.style.border = "1px solid rgba(27,31,36,0.15)";
  el.style.background = "#f6f8fa";
  el.style.color = "#1f2328";
}

function renderChecklist(container, repo, results) {
  container.textContent = "";
  var ul = make("ul", { styles: { listStyle: "none", padding: "0", margin: "8px 0 0" } });
  results.forEach(function (r) {
    var li = make("li", { styles: { margin: "8px 0", lineHeight: "1.4" } });
    li.appendChild(make("span", { text: (ICON[r.status] || "•") + " " }));
    li.appendChild(make("strong", { text: r.title }));
    if (r.detail) {
      li.appendChild(
        make("div", { text: r.detail, styles: { margin: "2px 0 0 1.6em", fontSize: "0.9em" } }),
      );
    }
    if (r.link) {
      li.appendChild(
        make("a", {
          text: r.linkText || "Open",
          href: r.link,
          attrs: { target: "_blank", rel: "noopener" },
          styles: { display: "inline-block", margin: "2px 0 0 1.6em", fontSize: "0.9em" },
        }),
      );
    }
    ul.appendChild(li);
  });
  container.appendChild(ul);
  var rerun = make("button", { text: "Re-run checks", attrs: { type: "button" } });
  styleButton(rerun);
  rerun.style.marginTop = "8px";
  rerun.addEventListener("click", function () {
    try {
      sessionStorage.removeItem(cacheKey(repo));
    } catch {
      /* best-effort */
    }
    loadSetupChecks(container, repo);
  });
  container.appendChild(rerun);
}

function loadSetupChecks(container, repo) {
  var cached = readCache(cacheKey(repo));
  if (cached) {
    renderChecklist(container, repo, cached);
    return;
  }
  container.textContent = "";
  container.appendChild(make("p", { text: "Checking…", styles: { margin: "8px 0" } }));
  runSetupChecks(repo).then(function (results) {
    writeCache(cacheKey(repo), results);
    renderChecklist(container, repo, results);
  });
}

function renderSetupPanel(mount, repo) {
  var panel = make("div", { attrs: { id: "ote-setup" }, styles: { margin: "12px 0" } });
  var button = make("button", { text: "Check setup", attrs: { type: "button" } });
  styleButton(button);
  var results = make("div", { attrs: { "aria-live": "polite" } });
  button.addEventListener("click", function () {
    loadSetupChecks(results, repo);
  });
  panel.appendChild(button);
  panel.appendChild(results);
  mount.appendChild(panel);
}

function renderUpdateBanner(mount, info) {
  var existing = document.getElementById("ote-update-banner");
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

  var banner = make("div", { attrs: { id: "ote-update-banner" } });
  styleBanner(banner);
  banner.appendChild(
    make("strong", {
      text: "Template update available: " + info.latest + " (you have " + info.local + ")",
    }),
  );
  if (info.changelog) {
    banner.appendChild(
      make("pre", {
        text: info.changelog,
        styles: {
          whiteSpace: "pre-wrap",
          overflowX: "auto",
          fontSize: "0.85em",
          margin: "8px 0",
        },
      }),
    );
  }
  var how = make("div", { styles: { marginTop: "8px" } });
  how.appendChild(document.createTextNode("Update with "));
  how.appendChild(
    make("code", {
      text: "git pull upstream main",
      styles: { background: "rgba(27,31,36,0.08)", padding: "1px 4px", borderRadius: "4px" },
    }),
  );
  how.appendChild(
    document.createTextNode(". If your fork has a Sync PR workflow, run it from the "),
  );
  how.appendChild(
    make("a", {
      text: "Actions tab",
      href: "https://github.com/" + info.repo + "/actions",
      attrs: { target: "_blank", rel: "noopener" },
    }),
  );
  how.appendChild(document.createTextNode("."));
  banner.appendChild(how);

  mount.insertBefore(banner, mount.firstChild);
}

function loadUpdateBanner(mount, repo) {
  Promise.all([rawGet(repo, "VERSION"), getLatestUpstreamVersion()])
    .then(function (vals) {
      var local = vals[0] ? vals[0].trim() : null;
      var latest = vals[1] ? String(vals[1]).trim() : null;
      if (!local || !latest) return;
      if (compareSemver(latest, local) <= 0) return;
      rawGetUpstream("CHANGELOG.md").then(function (changelog) {
        var slice = changelog
          ? changelogSectionsBetween(changelog, local, latest)
              .map(function (s) {
                return s.lines.join("\n").replace(/\s+$/, "");
              })
              .join("\n\n")
          : "";
        renderUpdateBanner(mount, {
          repo: repo,
          local: local,
          latest: latest,
          changelog: slice,
        });
      });
    })
    .catch(function () {
      /* silent: no banner on any error */
    });
}

function rawGetUpstream(file) {
  return fetch(RAW + "/" + UPSTREAM + "/HEAD/" + file)
    .then(function (r) {
      return r.ok ? r.text() : null;
    })
    .catch(function () {
      return null;
    });
}

/* ------------------------------------------------------------------ *
 * Entry point.
 * ------------------------------------------------------------------ */

function init() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__oteChecksInit) return; // idempotent: never double-inject
  window.__oteChecksInit = true;

  var mount = document.getElementById(MOUNT_ID);
  if (!mount) return;

  var repo = typeof window.OTE_REPO === "string" ? window.OTE_REPO : null;
  // Undetected custom domain, or a value that is not owner/name → do nothing.
  if (!repo || !/^[^/\s]+\/[^/\s]+$/.test(repo)) return;

  renderSetupPanel(mount, repo); // on-demand, respects the 60/h unauth limit
  loadUpdateBanner(mount, repo); // automatic, one api.github.com call
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

// Exposed for tests only; harmless in the browser (no `module` global there).
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    parseSemver: parseSemver,
    compareSemver: compareSemver,
    detectConfigPlaceholders: detectConfigPlaceholders,
    detectSampleEvents: detectSampleEvents,
    changelogSectionsBetween: changelogSectionsBetween,
  };
}
