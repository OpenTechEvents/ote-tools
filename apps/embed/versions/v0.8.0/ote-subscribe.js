function b(e){return e==="en"||e==="es"?e:"auto"}function f(e,r){return e!=="auto"?e:r.toLowerCase().startsWith("es")?"es":"en"}var c=["google","webcal","ics-download","feedly","feed-protocol","rss-download","ote-reader","ote-preview","json-download"];function E(e){return c.includes(e)}function h(e){return e==="badges"?"badges":"menu"}function m(e){if(e==="none")return new Set;if(!e)return new Set(c);let r=e.split(",").map(o=>o.trim()).filter(E);return r.length>0?new Set(r):new Set(c)}function i(e,r){let o=document.createElement(e);return r&&(o.className=r),o}function l(e,r){return e.textContent=r,e}function w(e){return`https://www.google.com/calendar/render?cid=${u(e)}`}function u(e){return e.replace(/^https?:\/\//,"webcal://")}function y(e){return`https://feedly.com/i/subscription/feed/${encodeURIComponent(e)}`}function S(e){return e.replace(/^https?:\/\//,"feed://")}function v(e){return`https://reader.opentechevents.org/?subscribe=${encodeURIComponent(e)}`}function x(e){return`https://tools.opentechevents.org/preview/?feed=${encodeURIComponent(e)}`}var C={en:{subscribe:"Subscribe",subscribeTo:e=>`Subscribe to ${e}`,calendarGroup:"Calendar",rssGroup:"RSS",oteGroup:"OTE feed",icsBadge:"ICS",rssBadge:"RSS feed",oteBadge:"OTE feed",google:"Subscribe with Google Calendar",webcal:"Subscribe with app (Apple Calendar, Outlook desktop\u2026)",icsDownload:"Open/download ICS",feedly:"Subscribe with Feedly",feedProtocol:"Subscribe with feed reader (NetNewsWire, Reeder\u2026)",rssDownload:"Open/download RSS",oteReader:"Subscribe with OTE Reader",otePreview:"Preview in OTE Tools",jsonDownload:"Open/download JSON"},es:{subscribe:"Suscribirse",subscribeTo:e=>`Suscribirse a ${e}`,calendarGroup:"Calendario",rssGroup:"RSS",oteGroup:"Feed OTE",icsBadge:"ICS",rssBadge:"Feed RSS",oteBadge:"Feed OTE",google:"Suscribirse con Google Calendar",webcal:"Suscribirse con app (Apple Calendar, Outlook de escritorio\u2026)",icsDownload:"Abrir/descargar ICS",feedly:"Suscribirse con Feedly",feedProtocol:"Suscribirse con lector de feeds (NetNewsWire, Reeder\u2026)",rssDownload:"Abrir/descargar RSS",oteReader:"Suscribirse con OTE Reader",otePreview:"Vista previa en OTE Tools",jsonDownload:"Abrir/descargar JSON"}},I={ics:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 9.5h18"/></svg>',rss:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg>',ote:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg>'},A=["google","webcal","ics-download"],R=["feedly","feed-protocol","rss-download"],U=["ote-reader","ote-preview","json-download"];function G(e,r){let o=[];if(e.icsUrl&&A.some(t=>e.show.has(t))){let t=[];e.show.has("google")&&t.push({label:r.google,href:w(e.icsUrl),external:!0}),e.show.has("webcal")&&t.push({label:r.webcal,href:u(e.icsUrl),external:!1}),e.show.has("ics-download")&&t.push({label:r.icsDownload,href:e.icsUrl,external:!0}),t.length>0&&o.push({key:"ics",label:r.calendarGroup,items:t})}if(e.rssUrl&&R.some(t=>e.show.has(t))){let t=[];e.show.has("feedly")&&t.push({label:r.feedly,href:y(e.rssUrl),external:!0}),e.show.has("feed-protocol")&&t.push({label:r.feedProtocol,href:S(e.rssUrl),external:!1}),e.show.has("rss-download")&&t.push({label:r.rssDownload,href:e.rssUrl,external:!0}),t.length>0&&o.push({key:"rss",label:r.rssGroup,items:t})}if(e.jsonUrl&&U.some(t=>e.show.has(t))){let t=[];e.show.has("ote-reader")&&t.push({label:r.oteReader,href:v(e.jsonUrl),external:!0}),e.show.has("ote-preview")&&t.push({label:r.otePreview,href:x(e.jsonUrl),external:!0}),e.show.has("json-download")&&t.push({label:r.jsonDownload,href:e.jsonUrl,external:!0}),t.length>0&&o.push({key:"ote",label:r.oteGroup,items:t})}return o}function k(e){let r=l(i("a"),e.label);return r.href=e.href,r.setAttribute("role","menuitem"),e.external&&(r.target="_blank",r.rel="noopener noreferrer"),r}function M(e,r,o){let t=i("div","menu");return t.id=e,t.setAttribute("role","menu"),o&&t.append(l(i("div","menu-group-label"),o)),t.append(...r.map(k)),t}function p(e,r){let o=i("div","item"),t=i("button","trigger");if(t.type="button",t.dataset.group=r.groupKey,t.disabled=r.disabled,t.setAttribute("aria-haspopup","menu"),t.setAttribute("aria-expanded",String(r.open)),t.setAttribute("aria-label",r.ariaLabel),r.iconSvg){let s=i("span","icon");s.innerHTML=r.iconSvg,t.append(s)}let a=document.createElement("slot");a.name=r.slotName,a.textContent=r.fallbackLabel,t.append(a),t.addEventListener("click",()=>{r.disabled||r.onClick()}),o.append(t),r.open&&!r.disabled&&(t.setAttribute("aria-controls",r.menuId),o.append(r.buildMenuContent())),e.append(o)}function T(e,r){e.replaceChildren();let o=C[r.lang],t=G(r,o),a=r.name?o.subscribeTo(r.name):o.subscribe;if(t.length===0){p(e,{groupKey:"menu",slotName:"trigger",fallbackLabel:o.subscribe,ariaLabel:a,disabled:!0,open:!1,menuId:"",buildMenuContent:()=>i("div","menu"),onClick:()=>{}});return}if(r.layout==="badges"){let s={ics:o.icsBadge,rss:o.rssBadge,ote:o.oteBadge};for(let n of t)p(e,{groupKey:n.key,slotName:`${n.key}-trigger`,fallbackLabel:s[n.key],ariaLabel:n.label,disabled:!1,open:r.openGroup===n.key,menuId:`menu-${r.instanceId}-${n.key}`,iconSvg:I[n.key],buildMenuContent:()=>M(`menu-${r.instanceId}-${n.key}`,n.items),onClick:()=>r.onToggle(n.key)});return}p(e,{groupKey:"menu",slotName:"trigger",fallbackLabel:o.subscribe,ariaLabel:a,disabled:!1,open:r.openGroup==="menu",menuId:`menu-${r.instanceId}`,buildMenuContent:()=>{let s=i("div","menu");s.id=`menu-${r.instanceId}`,s.setAttribute("role","menu");for(let n of t)s.append(l(i("div","menu-group-label"),n.label),...n.items.map(k));return s},onClick:()=>r.onToggle("menu")})}var L=`
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

/* The actual flex layout lives here, not on :host \u2014 :host's own children
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
   trigger keeps the neutral soft-accent style above \u2014 it's a generic
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
`;var O=0,d=class extends HTMLElement{static observedAttributes=["feed-ics","feed-rss","feed-json","name","show","layout","theme","lang"];#r;#e=null;#a=`ote-subscribe-${++O}`;#n=r=>{r.composedPath().includes(this)||this.#o(!1)};#i=r=>{r.key==="Escape"&&this.#o(!0)};constructor(){super();let r=this.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=L,this.#r=document.createElement("div"),this.#r.className="subscribe",r.append(o,this.#r)}connectedCallback(){this.#t()}disconnectedCallback(){this.#s()}attributeChangedCallback(){this.isConnected&&this.#t()}#l(r){this.#e===r?this.#o(!0):this.#d(r)}#d(r){let o=this.#e!==null;this.#e=r,this.#t(),o||this.#c()}#o(r){if(this.#e===null)return;let o=this.#e;this.#e=null,this.#s(),this.#t(),r&&this.#r.querySelector(`[data-group="${o}"]`)?.focus()}#c(){document.addEventListener("pointerdown",this.#n),document.addEventListener("keydown",this.#i)}#s(){document.removeEventListener("pointerdown",this.#n),document.removeEventListener("keydown",this.#i)}#t(){let r=f(b(this.getAttribute("lang")),navigator.language),o={icsUrl:this.getAttribute("feed-ics")?.trim()||void 0,rssUrl:this.getAttribute("feed-rss")?.trim()||void 0,jsonUrl:this.getAttribute("feed-json")?.trim()||void 0,name:this.getAttribute("name")?.trim()||void 0,show:m(this.getAttribute("show")),lang:r,layout:h(this.getAttribute("layout")),openGroup:this.#e,instanceId:this.#a,onToggle:t=>this.#l(t)};T(this.#r,o)}};function g(){customElements.get("ote-subscribe")||customElements.define("ote-subscribe",d)}g();export{d as OteSubscribeElement,g as defineOteSubscribe};
//# sourceMappingURL=ote-subscribe.js.map
