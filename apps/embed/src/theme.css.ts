// A template string, not a stylesheet file: it's injected into the custom
// element's shadow root via a <style> element (see element.ts), so it never
// leaks onto the host page and the host page's CSS never leaks into it.
// The --ote-* custom properties are the one deliberate exception — CSS
// custom properties inherit through the shadow boundary, so a host page can
// override any of them (e.g. `ote-events { --ote-accent: #e91e63; }`)
// without piercing the rest of the encapsulation.
export const WIDGET_CSS = `
:host {
  display: block;
  --ote-bg: #ffffff;
  --ote-surface: #f6f7f9;
  --ote-border: #e3e6ea;
  --ote-text: #1c2128;
  --ote-muted: #626c77;
  --ote-accent: #3556c8;
  --ote-accent-hover: #2a46a8;
  --ote-error: #c4302f;
  --ote-error-bg: #fcf1f1;
  --ote-radius: 8px;
  font-family: var(--ote-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  color: var(--ote-text);
  background: var(--ote-bg);
}

/* theme="auto" (the default: also matches when the attribute is absent)
   follows the host OS/browser preference. theme="dark" below applies the
   same overrides unconditionally, regardless of that preference. */
@media (prefers-color-scheme: dark) {
  :host([theme="auto"]),
  :host(:not([theme])) {
    --ote-bg: #16181d;
    --ote-surface: #1f2228;
    --ote-border: #33373f;
    --ote-text: #e6e8eb;
    --ote-muted: #9aa2ad;
    --ote-accent: #7d93e8;
    --ote-accent-hover: #97a8ee;
    --ote-error: #f28b82;
    --ote-error-bg: #3a2323;
  }
}

:host([theme="dark"]) {
  --ote-bg: #16181d;
  --ote-surface: #1f2228;
  --ote-border: #33373f;
  --ote-text: #e6e8eb;
  --ote-muted: #9aa2ad;
  --ote-accent: #7d93e8;
  --ote-accent-hover: #97a8ee;
  --ote-error: #f28b82;
  --ote-error-bg: #3a2323;
}

* {
  box-sizing: border-box;
}

.ote-events {
  margin: 0;
  padding: 0;
}

.message {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: var(--ote-radius);
  background: var(--ote-surface);
  color: var(--ote-muted);
}

.message.error {
  background: var(--ote-error-bg);
  color: var(--ote-error);
}

ul.events {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul.events.layout-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

ul.events.layout-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.event {
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  padding: 0.9rem 1rem;
  background: var(--ote-surface);
}

.event-title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
}

.event-title a {
  color: var(--ote-accent);
  text-decoration: none;
}

.event-title a:hover,
.event-title a:focus-visible {
  color: var(--ote-accent-hover);
  text-decoration: underline;
}

.event-when,
.event-location {
  margin: 0.15rem 0;
  font-size: 0.875rem;
  color: var(--ote-muted);
}

.event-description {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
}
`;
