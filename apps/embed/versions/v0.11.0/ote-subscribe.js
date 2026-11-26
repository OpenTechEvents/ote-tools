function y(t){return t==="en"||t==="es"?t:"auto"}function x(t,e){return t!=="auto"?t:e.toLowerCase().startsWith("es")?"es":"en"}var f=["google","webcal","ics-download","feedly","feed-protocol","rss-download","ote-reader","ote-preview","json-download"];function K(t){return f.includes(t)}function S(t){return t==="badges"?"badges":"menu"}function k(t){if(t==="none")return new Set;if(!t)return new Set(f);let e=t.split(",").map(r=>r.trim()).filter(K);return e.length>0?new Set(e):new Set(f)}var C=["ics","rss"];function $(t){return C.includes(t)}function L(t){let e=t?.trim().toLowerCase();if(e===void 0||e==="")return new Set(C);let r=e.split(",").map(o=>o.trim()).filter($);return new Set(r)}function a(t,e){let r=document.createElement(t);return e&&(r.className=e),r}function b(t,e){return t.textContent=e,t}function T(t){return`https://www.google.com/calendar/render?cid=${encodeURIComponent(h(t))}`}function h(t){return t.replace(/^https?:\/\//,"webcal://")}function E(t){return`https://feedly.com/i/subscription/feed/${encodeURIComponent(t)}`}function A(t){return t.replace(/^https?:\/\//,"feed://")}function R(t){return`https://reader.opentechevents.org/?subscribe=${encodeURIComponent(t)}`}function I(t){return`https://tools.opentechevents.org/preview/?feed=${encodeURIComponent(t)}`}function M(t){return`https://convert.opentechevents.org/ics?feed=${encodeURIComponent(t)}`}function U(t){return`https://convert.opentechevents.org/rss?feed=${encodeURIComponent(t)}`}var _=new Set([22,23,25,465,587,110,143,993,995,445,3306,5432,6379,9200,11211,27017]),j=new Set(["localhost","metadata.google.internal"]);function G(t){let e;try{e=new URL(t)}catch{return!1}if(e.protocol!=="http:"&&e.protocol!=="https:"||e.username||e.password||e.port&&_.has(Number(e.port)))return!1;let r=e.hostname.toLowerCase().replace(/\.$/,"");return!(j.has(r)||r.endsWith(".localhost")||r.endsWith(".internal")||/^\[|^[0-9.]+$|^[0-9a-f:]*:[0-9a-f:]*$/i.test(r))}var B={en:{subscribe:"Subscribe",subscribeTo:t=>`Subscribe to ${t}`,calendarGroup:"Calendar",rssGroup:"RSS",oteGroup:"OTE feed",icsBadge:"ICS",rssBadge:"RSS feed",oteBadge:"OTE feed",google:"Subscribe with Google Calendar",webcal:"Subscribe with app (Apple Calendar, Outlook desktop\u2026)",icsDownload:"Open/download ICS",feedly:"Subscribe with Feedly",feedProtocol:"Subscribe with feed reader (NetNewsWire, Reeder\u2026)",rssDownload:"Open/download RSS",oteReader:"Subscribe with OTE Reader",otePreview:"Preview in OTE Tools",jsonDownload:"Open/download JSON"},es:{subscribe:"Suscribirse",subscribeTo:t=>`Suscribirse a ${t}`,calendarGroup:"Calendario",rssGroup:"RSS",oteGroup:"Feed OTE",icsBadge:"ICS",rssBadge:"Feed RSS",oteBadge:"Feed OTE",google:"Suscribirse con Google Calendar",webcal:"Suscribirse con app (Apple Calendar, Outlook de escritorio\u2026)",icsDownload:"Abrir/descargar ICS",feedly:"Suscribirse con Feedly",feedProtocol:"Suscribirse con lector de feeds (NetNewsWire, Reeder\u2026)",rssDownload:"Abrir/descargar RSS",oteReader:"Suscribirse con OTE Reader",otePreview:"Vista previa en OTE Tools",jsonDownload:"Abrir/descargar JSON"}},H={ics:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 9.5h18"/></svg>',rss:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg>',ote:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg>'},W=["google","webcal","ics-download"],z=["feedly","feed-protocol","rss-download"],V=["ote-reader","ote-preview","json-download"];function N(t,e,r,o,s){if(t)return{url:t,generated:!1};if(!(!e||!o.has(r)||!G(e)))return{url:s(e),generated:!0}}function q(t,e){let r=[],o=N(t.icsUrl,t.jsonUrl,"ics",t.convert,M),s=N(t.rssUrl,t.jsonUrl,"rss",t.convert,U);if(o&&W.some(n=>t.show.has(n))){let n=[];t.show.has("google")&&n.push({label:e.google,href:T(o.url),external:!0}),t.show.has("webcal")&&n.push({label:e.webcal,href:h(o.url),external:!1}),t.show.has("ics-download")&&n.push({label:e.icsDownload,href:o.url,external:!0}),n.length>0&&r.push({key:"ics",label:e.calendarGroup,items:n,generated:o.generated})}if(s&&z.some(n=>t.show.has(n))){let n=[];t.show.has("feedly")&&n.push({label:e.feedly,href:E(s.url),external:!0}),t.show.has("feed-protocol")&&n.push({label:e.feedProtocol,href:A(s.url),external:!1}),t.show.has("rss-download")&&n.push({label:e.rssDownload,href:s.url,external:!0}),n.length>0&&r.push({key:"rss",label:e.rssGroup,items:n,generated:s.generated})}if(t.jsonUrl&&V.some(n=>t.show.has(n))){let n=[];t.show.has("ote-reader")&&n.push({label:e.oteReader,href:R(t.jsonUrl),external:!0}),t.show.has("ote-preview")&&n.push({label:e.otePreview,href:I(t.jsonUrl),external:!0}),t.show.has("json-download")&&n.push({label:e.jsonDownload,href:t.jsonUrl,external:!0}),n.length>0&&r.push({key:"ote",label:e.oteGroup,items:n,generated:!1})}return r}function D(t){let e=b(a("a"),t.label);return e.href=t.href,e.setAttribute("role","menuitem"),t.external&&(e.target="_blank",e.rel="noopener noreferrer"),e}function J(t,e){let r=a("div","popover"),o=a("div","menu");return o.id=t,o.setAttribute("role","menu"),o.append(...e.items.map(D)),r.append(o),r}var O=typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function";function Y(t,e){let s=t.getBoundingClientRect(),n=e.getBoundingClientRect(),i=document.documentElement.clientWidth,d=document.documentElement.clientHeight,u=s.bottom+4,l=s.top-4-n.height,w=u+n.height<=d-8||l<8?u:l,c=s.left;c+n.width>i-8&&(c=s.right-n.width),c=Math.min(Math.max(c,8),Math.max(8,i-n.width-8)),e.style.top=`${Math.max(8,Math.min(w,d-8))}px`,e.style.left=`${c}px`,e.style.maxHeight=`${Math.max(120,d-w-8)}px`}function m(t,e){let r=a("div","item"),o=a("button","trigger");if(o.type="button",o.dataset.group=e.groupKey,o.disabled=e.disabled,o.setAttribute("aria-haspopup","menu"),o.setAttribute("aria-expanded",String(e.open)),o.setAttribute("aria-label",e.ariaLabel),e.generated&&(o.dataset.generated=""),e.iconSvg){let i=a("span","icon");i.innerHTML=e.iconSvg,o.append(i)}let s=document.createElement("slot");s.name=e.slotName,s.textContent=e.fallbackLabel,o.append(s),o.addEventListener("click",()=>{e.disabled||e.onClick()}),r.append(o);let n=e.open&&!e.disabled?e.buildMenuContent():void 0;n&&(o.setAttribute("aria-controls",e.menuId),O&&n.setAttribute("popover","manual"),r.append(n)),t.append(r),n&&O&&(n.showPopover(),Y(o,n))}function F(t,e){t.replaceChildren();let r=B[e.lang],o=q(e,r),s=e.name?r.subscribeTo(e.name):r.subscribe;if(o.length===0){m(t,{groupKey:"menu",slotName:"trigger",fallbackLabel:r.subscribe,ariaLabel:s,disabled:!0,open:!1,menuId:"",buildMenuContent:()=>a("div","menu"),onClick:()=>{}});return}if(e.layout==="badges"){let n={ics:r.icsBadge,rss:r.rssBadge,ote:r.oteBadge};for(let i of o)m(t,{groupKey:i.key,slotName:`${i.key}-trigger`,fallbackLabel:n[i.key],ariaLabel:i.label,disabled:!1,open:e.openGroup===i.key,menuId:`menu-${e.instanceId}-${i.key}`,iconSvg:H[i.key],generated:i.generated,buildMenuContent:()=>J(`menu-${e.instanceId}-${i.key}`,i),onClick:()=>e.onToggle(i.key)});return}m(t,{groupKey:"menu",slotName:"trigger",fallbackLabel:r.subscribe,ariaLabel:s,disabled:!1,open:e.openGroup==="menu",menuId:`menu-${e.instanceId}`,generated:o.some(n=>n.generated),buildMenuContent:()=>{let n=a("div","popover"),i=a("div","menu");i.id=`menu-${e.instanceId}`,i.setAttribute("role","menu");for(let d of o){let u=d.label,l=a("div","menu-section");l.setAttribute("role","group"),l.setAttribute("aria-label",u);let g=b(a("div","menu-group-label"),u);g.setAttribute("aria-hidden","true"),l.append(g,...d.items.map(D)),i.append(l)}return n.append(i),n},onClick:()=>e.onToggle("menu")})}var P=`
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

/* The popover box. It owns the positioning and the chrome; the
   role="menu" inside owns only the links, so the generated note can sit in
   the box without being an illegal child of the menu (subscribe-render.ts
   #buildPopover).

   max-height is not decoration. With the conversion fallback on, a
   JSON-only publisher's combined menu carries three groups \u2014 nine links \u2014
   and measured 523px tall against a 568px phone viewport, running past the
   fold and making a previously unscrollable page scroll. Capping it scrolls
   the links instead of the host's page. */
.popover {
  position: absolute;
  inset-block-start: calc(100% + 0.25rem);
  inset-inline-start: 0;
  z-index: 4;
  overflow: visible;
  display: flex;
  flex-direction: column;
  min-width: 13rem;
  max-width: calc(100vw - 3rem);
  max-height: min(60vh, 26rem);
  margin: 0;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: var(--ote-surface);
  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.12);
}

/* In the top layer (#187). A popover there is laid out against the
   viewport, so the anchoring comes from subscribe-render.ts#positionPopover
   writing top/left \u2014 but the reason to be there is what no amount of
   positioning can buy: nothing clips it. An ancestor with overflow:hidden,
   a host container shorter than the menu, <ote-events>'s own bounded
   column in #68's footer \u2014 none of them reach into the top layer.

   :popover-open rather than [popover]: the attribute is set while the
   element is still being measured, and these rules must not apply to the
   absolutely-positioned fallback. */
.popover:popover-open {
  position: fixed;
  inset: auto;
  margin: 0;
  padding: 0;
  z-index: auto;
  border: 1px solid var(--ote-border);
  background: var(--ote-surface);
  color: var(--ote-text);
  overflow: visible;
}

.popover::backdrop {
  background: none;
}

.menu {
  display: grid;
  gap: 0.3rem;
  align-content: start;
  overflow-y: auto;
  padding: 0.3rem;
}

.menu-section {
  display: grid;
  gap: 0.3rem;
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
`;var X=0,p=class extends HTMLElement{static observedAttributes=["feed-ics","feed-rss","feed-json","name","show","convert","layout","theme","lang"];#t;#e=null;#a=`ote-subscribe-${++X}`;#o=e=>{e.composedPath().includes(this)||this.#n(!1)};#i=e=>{e.key==="Escape"&&this.#n(!0)};constructor(){super();let e=this.attachShadow({mode:"open"}),r=document.createElement("style");r.textContent=P,this.#t=document.createElement("div"),this.#t.className="subscribe",e.append(r,this.#t)}connectedCallback(){this.#r()}disconnectedCallback(){this.#s()}attributeChangedCallback(){this.isConnected&&this.#r()}#l(e){this.#e===e?this.#n(!0):this.#d(e)}#d(e){let r=this.#e!==null;this.#e=e,this.#r(),r||this.#u()}#n(e){if(this.#e===null)return;let r=this.#e;this.#e=null,this.#s(),this.#r(),e&&this.#t.querySelector(`[data-group="${r}"]`)?.focus()}#u(){document.addEventListener("pointerdown",this.#o),document.addEventListener("keydown",this.#i)}#s(){document.removeEventListener("pointerdown",this.#o),document.removeEventListener("keydown",this.#i)}#r(){let e=x(y(this.getAttribute("lang")),navigator.language),r={icsUrl:this.getAttribute("feed-ics")?.trim()||void 0,rssUrl:this.getAttribute("feed-rss")?.trim()||void 0,jsonUrl:this.getAttribute("feed-json")?.trim()||void 0,name:this.getAttribute("name")?.trim()||void 0,show:k(this.getAttribute("show")),convert:L(this.getAttribute("convert")),lang:e,layout:S(this.getAttribute("layout")),openGroup:this.#e,instanceId:this.#a,onToggle:o=>this.#l(o)};F(this.#t,r)}};function v(){customElements.get("ote-subscribe")||customElements.define("ote-subscribe",p)}v();export{p as OteSubscribeElement,v as defineOteSubscribe};
//# sourceMappingURL=ote-subscribe.js.map
