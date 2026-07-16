# @opentechevents/editor

Static web editor for OTE events (DESIGN.md phase 2). No backend: deployable
to any static host (GitHub Pages). It reads its target repository from the
URL — `?repo=owner/name` — fetches that fork's `ote.config.json` and events,
and renders an event form driven by the configured profile.

## What it does

- **Presets**: `profile` in `ote.config.json` picks the visible fields —
  `meetup` (no status/geo/metadata), `conference` (adds status + geo) or
  `all` (everything, advanced section collapsed). A `customProfile.fields`
  list wins over `profile`; unknown field ids are ignored with a warning.
- **Live validation**: the draft is validated on every keystroke exactly like
  the real pipeline validates it — wrapped in a feed by
  `@opentechevents/build-feed`, which uses `@opentechevents/validate`
  underneath. Errors are shown inline, per field.
- **Propose change**: opens a prefilled issue in the target repo (title +
  JSON body via URL params). Anyone can use it; the fork's issue→PR workflow
  or a maintainer takes it from there. URLs over ~8K chars fall back to
  copy-paste plus a link to the blank issue form.
- **Edit directly** (owner, needs push): existing events open on github.dev
  over `events/<slug>.json`; new events use GitHub's prefilled new-file page
  (github.dev cannot create files from a URL).
- **Edit mode**: existing events are listed via the GitHub contents API
  (which knows the filenames) with the published Pages `feed.json` as
  fallback when the API is rate-limited — there, slugs are inferred from
  event ids and "edit directly" is disabled when no slug can be derived.

## Development

```sh
pnpm dev        # dev server on http://localhost:8000 (PORT to override)
pnpm build      # static bundle in dist/
pnpm test       # vitest over src/lib/ (all decisions live there)
```

`src/lib/` is pure and unit-tested (field mapping, JSON generation, URL
building, validation wiring); `src/main.ts` and `src/ui/` are the untested
DOM layer, verified by hand.
