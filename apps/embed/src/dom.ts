// Tiny DOM-building helpers shared by more than one esbuild entry point
// (src/render.ts for <ote-events>, src/subscribe-render.ts for
// <ote-subscribe>). Kept in their own module per apps/embed/CLAUDE.md: "If
// you add code that more than one entry point needs, put it in a fourth
// module they all import — don't import one entry point from another."

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export function withText<T extends HTMLElement>(node: T, text: string): T {
  node.textContent = text;
  return node;
}

/**
 * A 24×24 stroked icon, built from `path` `d` strings. Shared by
 * src/render.ts (event badges, action buttons, modal nav) and
 * src/view-switcher.ts, which is why it lives here rather than in either.
 *
 * `aria-hidden`/`focusable="false"`: every icon in this widget sits next to
 * its own text or inside a labelled control, so an exposed graphic would
 * only repeat it.
 */
export function svgIcon(paths: string[], className: string): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  for (const d of paths) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    svg.append(path);
  }
  return svg;
}
