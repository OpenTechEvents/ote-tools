/** The handful of DOM helpers every view here is built out of. */

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function link(href: string, text: string, className?: string): HTMLAnchorElement {
  const anchor = el("a", className, text);
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener";
  return anchor;
}

/**
 * Copy, with the outcome said out loud.
 *
 * `navigator.clipboard` is unavailable over plain http and can be refused
 * outright; a button that silently does nothing in those cases would look
 * broken, so the failure path names the manual way out.
 */
export function copyToClipboard(text: string, status: HTMLElement): void {
  void navigator.clipboard
    .writeText(text)
    .then(() => {
      status.textContent = "Copied.";
    })
    .catch(() => {
      status.textContent = "Could not copy — select the text and copy it by hand.";
    });
}

/** A copyable block of generated text: this tool's whole output format. */
export function snippetBlock(text: string, label = "snippet"): HTMLElement {
  const wrapper = el("div", "snippet");
  const actions = el("div", "snippet-actions");
  const button = el("button", "primary", `Copy ${label}`);
  button.type = "button";
  const status = el("span", "muted");
  status.setAttribute("role", "status");
  button.addEventListener("click", () => copyToClipboard(text, status));
  actions.append(button, status);
  const pre = el("pre", "source-block");
  pre.append(el("code", undefined, text));
  wrapper.append(actions, pre);
  return wrapper;
}

/** A paragraph of secondary text — by far the most common node here. */
export function muted(text: string): HTMLParagraphElement {
  return el("p", "muted", text);
}

/** A sentence with a link in the middle of it, which `textContent` cannot do. */
export function sentence(...parts: (string | Node)[]): HTMLParagraphElement {
  const paragraph = el("p", "muted");
  for (const part of parts) {
    paragraph.append(typeof part === "string" ? document.createTextNode(part) : part);
  }
  return paragraph;
}
