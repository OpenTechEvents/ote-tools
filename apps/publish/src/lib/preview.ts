/**
 * Loading the real widget for the preview panes.
 *
 * The preview deliberately runs **the same asset the snippet hands out**, not
 * a bundled copy of the widget source: a picture (or a locally bundled build)
 * could drift from what a consumer's browser will actually fetch, and the
 * whole point of the pane is "this is what you are about to embed".
 *
 * Two candidates, in order:
 *
 * 1. The sibling path on this very deployment (`../embed/v<version>/…`).
 *    `deploy-tools.yml` publishes both apps to one Pages site, so in
 *    production this is the exact file the snippet names, same origin.
 * 2. The absolute tools.opentechevents.org URL — for anyone running this app
 *    somewhere else.
 *
 * Both can fail (offline, or a version not deployed yet). That is not an
 * error to swallow: the caller shows a plain "preview unavailable" note
 * instead of an empty box, and the snippet itself stays valid either way.
 */

const TOOLS_BASE = "https://tools.opentechevents.org";

export function previewScriptUrls(
  file: string,
  version: string,
  base: string = document.baseURI,
): string[] {
  const relative = new URL(`../embed/v${version}/${file}`, base).href;
  return [relative, `${TOOLS_BASE}/embed/v${version}/${file}`];
}

const loaded = new Map<string, Promise<boolean>>();

/** Loads a widget bundle once per file, reporting whether it worked. */
export function loadWidget(file: string, version: string): Promise<boolean> {
  const key = `${file}@${version}`;
  const existing = loaded.get(key);
  if (existing) return existing;
  const attempt = (async () => {
    for (const url of previewScriptUrls(file, version)) {
      try {
        await import(/* @vite-ignore */ url);
        return true;
      } catch {
        // Try the next candidate; the caller degrades to a note.
      }
    }
    return false;
  })();
  loaded.set(key, attempt);
  return attempt;
}
