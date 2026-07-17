# @opentechevents/dashboard-checks

The client-side script served at `tools.opentechevents.org/dashboard-checks.js`
and loaded by every `ote-template` fork's dashboard (`docs/index.html`). It runs
in the organizer's own GitHub Pages origin.

It is a single self-contained vanilla-JS file — no dependencies, no build step,
no modules. `dashboard-checks.js` is the served artifact as-is; the deploy
workflow copies it to the site root. The only build-time concern is `pnpm test`,
which exercises the pure helpers exported at the bottom of the file.

## Contract with the template (do not change)

- `window.OTE_REPO = "owner/name"` — may be `undefined` on an undetected custom
  domain; the script then does nothing.
- `<div id="ote-checks" aria-live="polite"></div>` — the mount point.
- Loaded with `defer` + `onerror="void 0"`. Everything fails silently: any
  network / CORS / parse error leaves the page exactly as-is.

## What it renders into `#ote-checks`

1. **Setup check** (on demand — a "Check setup" button, because the
   unauthenticated GitHub API allows only 60 req/h/IP). Against public,
   CORS-open endpoints it checks: Issues enabled, the `ote-event` label,
   whether Actions are running and green, whether `ote.config.json` still holds
   the sample placeholders, and whether the sample events are still published.
   Results are cached in `sessionStorage` per repo for the session.

   The "Allow GitHub Actions to create and approve pull requests" setting
   **cannot** be read unauthenticated (it needs `administration:read`), so it is
   shown as an *unverifiable* reminder, never a pass or fail. The `issue-to-pr`
   reusable workflow detects that same setting at PR-open time and comments on
   the issue when it is off.

2. **Template-update banner** (automatic, on load). Compares the fork's
   `VERSION` to the latest `ote-template` release and, when behind, shows the
   new version, the `CHANGELOG.md` entries between the two, and how to update.

## Endpoints used

Only `api.github.com` and `raw.githubusercontent.com`, both CORS-open. No
authentication, no secrets, no third-party hosts (CSP-safe).
