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
