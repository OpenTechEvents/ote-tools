function f(e){return e==="en"||e==="es"?e:"auto"}function b(e,t){return e!=="auto"?e:t.toLowerCase().startsWith("es")?"es":"en"}var u=["google","webcal","ics-download","feedly","feed-protocol","rss-download","ote-reader","ote-preview","json-download"];function L(e){return u.includes(e)}function m(e){return e==="badges"?"badges":"menu"}function h(e){if(e==="none")return new Set;if(!e)return new Set(u);let t=e.split(",").map(n=>n.trim()).filter(L);return t.length>0?new Set(t):new Set(u)}function i(e,t){let n=document.createElement(e);return t&&(n.className=t),n}function l(e,t){return e.textContent=t,e}function w(e){return`https://www.google.com/calendar/render?cid=${encodeURIComponent(c(e))}`}function c(e){return e.replace(/^https?:\/\//,"webcal://")}function y(e){return`https://feedly.com/i/subscription/feed/${encodeURIComponent(e)}`}function x(e){return e.replace(/^https?:\/\//,"feed://")}function v(e){return`https://reader.opentechevents.org/?subscribe=${encodeURIComponent(e)}`}function S(e){return`https://tools.opentechevents.org/preview/?feed=${encodeURIComponent(e)}`}var E={en:{subscribe:"Subscribe",subscribeTo:e=>`Subscribe to ${e}`,calendarGroup:"Calendar",rssGroup:"RSS",oteGroup:"OTE feed",icsBadge:"ICS",rssBadge:"RSS feed",oteBadge:"OTE feed",google:"Subscribe with Google Calendar",webcal:"Subscribe with app (Apple Calendar, Outlook desktop\u2026)",icsDownload:"Open/download ICS",feedly:"Subscribe with Feedly",feedProtocol:"Subscribe with feed reader (NetNewsWire, Reeder\u2026)",rssDownload:"Open/download RSS",oteReader:"Subscribe with OTE Reader",otePreview:"Preview in OTE Tools",jsonDownload:"Open/download JSON"},es:{subscribe:"Suscribirse",subscribeTo:e=>`Suscribirse a ${e}`,calendarGroup:"Calendario",rssGroup:"RSS",oteGroup:"Feed OTE",icsBadge:"ICS",rssBadge:"Feed RSS",oteBadge:"Feed OTE",google:"Suscribirse con Google Calendar",webcal:"Suscribirse con app (Apple Calendar, Outlook de escritorio\u2026)",icsDownload:"Abrir/descargar ICS",feedly:"Suscribirse con Feedly",feedProtocol:"Suscribirse con lector de feeds (NetNewsWire, Reeder\u2026)",rssDownload:"Abrir/descargar RSS",oteReader:"Suscribirse con OTE Reader",otePreview:"Vista previa en OTE Tools",jsonDownload:"Abrir/descargar JSON"}},I={ics:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 9.5h18"/></svg>',rss:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg>',ote:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg>'},U=["google","webcal","ics-download"],A=["feedly","feed-protocol","rss-download"],R=["ote-reader","ote-preview","json-download"];function G(e,t){let n=[];if(e.icsUrl&&U.some(r=>e.show.has(r))){let r=[];e.show.has("google")&&r.push({label:t.google,href:w(e.icsUrl),external:!0}),e.show.has("webcal")&&r.push({label:t.webcal,href:c(e.icsUrl),external:!1}),e.show.has("ics-download")&&r.push({label:t.icsDownload,href:e.icsUrl,external:!0}),r.length>0&&n.push({key:"ics",label:t.calendarGroup,items:r})}if(e.rssUrl&&A.some(r=>e.show.has(r))){let r=[];e.show.has("feedly")&&r.push({label:t.feedly,href:y(e.rssUrl),external:!0}),e.show.has("feed-protocol")&&r.push({label:t.feedProtocol,href:x(e.rssUrl),external:!1}),e.show.has("rss-download")&&r.push({label:t.rssDownload,href:e.rssUrl,external:!0}),r.length>0&&n.push({key:"rss",label:t.rssGroup,items:r})}if(e.jsonUrl&&R.some(r=>e.show.has(r))){let r=[];e.show.has("ote-reader")&&r.push({label:t.oteReader,href:v(e.jsonUrl),external:!0}),e.show.has("ote-preview")&&r.push({label:t.otePreview,href:S(e.jsonUrl),external:!0}),e.show.has("json-download")&&r.push({label:t.jsonDownload,href:e.jsonUrl,external:!0}),r.length>0&&n.push({key:"ote",label:t.oteGroup,items:r})}return n}function k(e){let t=l(i("a"),e.label);return t.href=e.href,t.setAttribute("role","menuitem"),e.external&&(t.target="_blank",t.rel="noopener noreferrer"),t}function M(e,t,n){let r=i("div","menu");return r.id=e,r.setAttribute("role","menu"),n&&r.append(l(i("div","menu-group-label"),n)),r.append(...t.map(k)),r}function p(e,t){let n=i("div","item"),r=i("button","trigger");if(r.type="button",r.dataset.group=t.groupKey,r.disabled=t.disabled,r.setAttribute("aria-haspopup","menu"),r.setAttribute("aria-expanded",String(t.open)),r.setAttribute("aria-label",t.ariaLabel),t.iconSvg){let s=i("span","icon");s.innerHTML=t.iconSvg,r.append(s)}let a=document.createElement("slot");a.name=t.slotName,a.textContent=t.fallbackLabel,r.append(a),r.addEventListener("click",()=>{t.disabled||t.onClick()}),n.append(r),t.open&&!t.disabled&&(r.setAttribute("aria-controls",t.menuId),n.append(t.buildMenuContent())),e.append(n)}function T(e,t){e.replaceChildren();let n=E[t.lang],r=G(t,n),a=t.name?n.subscribeTo(t.name):n.subscribe;if(r.length===0){p(e,{groupKey:"menu",slotName:"trigger",fallbackLabel:n.subscribe,ariaLabel:a,disabled:!0,open:!1,menuId:"",buildMenuContent:()=>i("div","menu"),onClick:()=>{}});return}if(t.layout==="badges"){let s={ics:n.icsBadge,rss:n.rssBadge,ote:n.oteBadge};for(let o of r)p(e,{groupKey:o.key,slotName:`${o.key}-trigger`,fallbackLabel:s[o.key],ariaLabel:o.label,disabled:!1,open:t.openGroup===o.key,menuId:`menu-${t.instanceId}-${o.key}`,iconSvg:I[o.key],buildMenuContent:()=>M(`menu-${t.instanceId}-${o.key}`,o.items),onClick:()=>t.onToggle(o.key)});return}p(e,{groupKey:"menu",slotName:"trigger",fallbackLabel:n.subscribe,ariaLabel:a,disabled:!1,open:t.openGroup==="menu",menuId:`menu-${t.instanceId}`,buildMenuContent:()=>{let s=i("div","menu");s.id=`menu-${t.instanceId}`,s.setAttribute("role","menu");for(let o of r)s.append(l(i("div","menu-group-label"),o.label),...o.items.map(k));return s},onClick:()=>t.onToggle("menu")})}var C=`
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
`;var D=0,d=class extends HTMLElement{static observedAttributes=["feed-ics","feed-rss","feed-json","name","show","layout","theme","lang"];#t;#e=null;#a=`ote-subscribe-${++D}`;#o=t=>{t.composedPath().includes(this)||this.#n(!1)};#i=t=>{t.key==="Escape"&&this.#n(!0)};constructor(){super();let t=this.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=C,this.#t=document.createElement("div"),this.#t.className="subscribe",t.append(n,this.#t)}connectedCallback(){this.#r()}disconnectedCallback(){this.#s()}attributeChangedCallback(){this.isConnected&&this.#r()}#l(t){this.#e===t?this.#n(!0):this.#d(t)}#d(t){let n=this.#e!==null;this.#e=t,this.#r(),n||this.#u()}#n(t){if(this.#e===null)return;let n=this.#e;this.#e=null,this.#s(),this.#r(),t&&this.#t.querySelector(`[data-group="${n}"]`)?.focus()}#u(){document.addEventListener("pointerdown",this.#o),document.addEventListener("keydown",this.#i)}#s(){document.removeEventListener("pointerdown",this.#o),document.removeEventListener("keydown",this.#i)}#r(){let t=b(f(this.getAttribute("lang")),navigator.language),n={icsUrl:this.getAttribute("feed-ics")?.trim()||void 0,rssUrl:this.getAttribute("feed-rss")?.trim()||void 0,jsonUrl:this.getAttribute("feed-json")?.trim()||void 0,name:this.getAttribute("name")?.trim()||void 0,show:h(this.getAttribute("show")),lang:t,layout:m(this.getAttribute("layout")),openGroup:this.#e,instanceId:this.#a,onToggle:r=>this.#l(r)};T(this.#t,n)}};function g(){customElements.get("ote-subscribe")||customElements.define("ote-subscribe",d)}g();export{d as OteSubscribeElement,g as defineOteSubscribe};
//# sourceMappingURL=ote-subscribe.js.map
