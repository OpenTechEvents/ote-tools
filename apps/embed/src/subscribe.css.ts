// Same shape as theme.css.ts: a template string injected into this
// element's own shadow root <style>. Reuses the exact same --ote-* custom
// property names (and the same three-selector light/dark/auto pattern) so
// <ote-subscribe> looks and themes consistently with <ote-events> when both
// are on a page, while still declaring its own light-mode defaults so it
// works standalone if <ote-events> isn't present.
export const SUBSCRIBE_CSS = `
:host {
  display: inline-block;
  --ote-surface: #f6f7f9;
  --ote-border: #e3e6ea;
  --ote-text: #1c2128;
  --ote-muted: #626c77;
  --ote-accent: #3556c8;
  --ote-accent-hover: #2a46a8;
  --ote-accent-soft: #eef1fb;
  --ote-radius: 8px;
  --ote-subscribe-ics-color: var(--ote-accent);
  --ote-subscribe-rss-color: #ee7203;
  --ote-subscribe-ote-color: var(--ote-accent);
  font-family: var(--ote-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  font-size: var(--ote-font-size, 1rem);
  color: var(--ote-text);
}

@media (prefers-color-scheme: dark) {
  :host([theme="auto"]),
  :host(:not([theme])) {
    --ote-surface: #1f2228;
    --ote-border: #33373f;
    --ote-text: #e6e8eb;
    --ote-muted: #9aa2ad;
    --ote-accent: #7d93e8;
    --ote-accent-hover: #97a8ee;
    --ote-accent-soft: #262c42;
  }
}

:host([theme="dark"]) {
  --ote-surface: #1f2228;
  --ote-border: #33373f;
  --ote-text: #e6e8eb;
  --ote-muted: #9aa2ad;
  --ote-accent: #7d93e8;
  --ote-accent-hover: #97a8ee;
  --ote-accent-soft: #262c42;
}

* {
  box-sizing: border-box;
}

/* The actual flex layout lives here, not on :host — :host's own children
   are just this one container div, so a gap declared on :host itself has
   nothing to space (a bug an earlier version of this file had: the gap
   rule was set but never visibly applied, since the .item badges are
   grandchildren of :host, not direct children). */
.subscribe {
  display: inline-flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.item {
  position: relative;
  display: inline-flex;
}

.trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 2rem;
  padding: 0.35rem 0.65rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: var(--ote-accent-soft);
  color: var(--ote-accent);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  cursor: pointer;
}

.trigger:hover,
.trigger:focus-visible,
.trigger[aria-expanded="true"] {
  border-color: var(--ote-accent);
  color: var(--ote-accent-hover);
  outline: none;
}

.trigger:disabled {
  cursor: default;
  opacity: 0.5;
}

.icon {
  display: inline-flex;
  width: 1.1em;
  height: 1.1em;
  flex: 0 0 auto;
}

.icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* The colored-pill "badge" look (layout="badges"), matching the icon+text
   badge design this element was ported from. The plain layout="menu"
   trigger keeps the neutral soft-accent style above — it's a generic
   action button, not a feed-type-branded badge. */
.trigger[data-group="ics"],
.trigger[data-group="rss"],
.trigger[data-group="ote"] {
  border-radius: 999px;
  border-color: transparent;
  padding: 0.4rem 0.9rem;
  color: #fff;
}

.trigger[data-group="ics"] {
  background: var(--ote-subscribe-ics-color);
}

.trigger[data-group="rss"] {
  background: var(--ote-subscribe-rss-color);
}

.trigger[data-group="ote"] {
  background: var(--ote-subscribe-ote-color);
}

.trigger[data-group="ics"]:hover,
.trigger[data-group="ics"]:focus-visible,
.trigger[data-group="ics"][aria-expanded="true"],
.trigger[data-group="rss"]:hover,
.trigger[data-group="rss"]:focus-visible,
.trigger[data-group="rss"][aria-expanded="true"],
.trigger[data-group="ote"]:hover,
.trigger[data-group="ote"]:focus-visible,
.trigger[data-group="ote"][aria-expanded="true"] {
  border-color: transparent;
  color: #fff;
  filter: brightness(0.92);
  outline: none;
}

.menu {
  position: absolute;
  inset-block-start: calc(100% + 0.25rem);
  inset-inline-start: 0;
  z-index: 4;
  display: grid;
  gap: 0.3rem;
  min-width: 13rem;
  max-width: calc(100vw - 3rem);
  margin: 0;
  padding: 0.3rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: var(--ote-surface);
  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.12);
}

.menu-group-label {
  padding: 0.3rem 0.5rem 0.1rem;
  color: var(--ote-muted);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.menu a {
  display: block;
  padding: 0.4rem 0.5rem;
  border-radius: calc(var(--ote-radius) - 2px);
  color: var(--ote-text);
  font-size: 0.875rem;
  text-decoration: none;
}

.menu a:hover,
.menu a:focus-visible {
  background: var(--ote-accent-soft);
  color: var(--ote-accent);
  outline: none;
}
`;
