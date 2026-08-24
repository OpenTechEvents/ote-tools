import { BRAND_ICONS, UI_ICONS } from "./icons.generated.js";

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * A destination's mark, as a tile.
 *
 * Two shapes on purpose. A destination with a real brand mark gets it, because
 * an organizer recognises Meetup or Mastodon faster than they read the word.
 * The ones simple-icons has no mark for — the directories, and the handful of
 * brands it has dropped on trademark grounds — get a monogram in the same tile
 * rather than a lookalike logo from elsewhere: a wrong logo is a small lie, and
 * this tool's whole argument is that it doesn't tell them.
 *
 * The brand colour tints the tile, never the mark itself, so a grid of these
 * stays legible in both themes and no single destination shouts.
 */
export function destinationMark(name: string, icon: string | undefined, brand: string): HTMLElement {
  const tile = document.createElement("span");
  tile.className = "mark";
  tile.style.setProperty("--mark-brand", brand);
  tile.setAttribute("aria-hidden", "true");

  const svg = icon !== undefined ? brandIcon(icon) : undefined;
  if (svg) {
    tile.append(svg);
    return tile;
  }
  tile.classList.add("mark-monogram");
  tile.textContent = monogram(name);
  return tile;
}

/** The letters a monogram tile shows: one, or two for a two-word name. */
export function monogram(name: string): string {
  const words = name.replace(/[^\p{L}\p{N} .-]/gu, "").split(/[ .-]+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0]!.slice(0, 1).toUpperCase();
  return (words[0]![0]! + words[1]![0]!).toUpperCase();
}

/** A filled brand mark, or undefined when the name isn't in the generated set. */
export function brandIcon(name: string): SVGSVGElement | undefined {
  const icon = BRAND_ICONS[name];
  if (!icon) return undefined;
  const svg = svgRoot();
  svg.setAttribute("fill", "currentColor");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", icon.path);
  svg.append(path);
  return svg;
}

/**
 * A Lucide glyph. The markup comes from `icons.generated.ts`, which is our own
 * build output rather than anything a feed can reach, so assigning it as markup
 * introduces no injection surface.
 */
export function uiIcon(name: string, className = "icon"): SVGSVGElement {
  const svg = svgRoot();
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("class", className);
  svg.innerHTML = UI_ICONS[name] ?? "";
  return svg;
}

function svgRoot(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("class", "icon");
  return svg;
}

/** A button whose whole label is an icon still needs a name for screen readers. */
export function iconButton(name: string, label: string, className = ""): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `icon-button ${className}`.trim();
  button.title = label;
  button.setAttribute("aria-label", label);
  button.append(uiIcon(name));
  return button;
}
