function f(e){return e==="en"||e==="es"?e:"auto"}function g(e,t){return e!=="auto"?e:t.toLowerCase().startsWith("es")?"es":"en"}var d=["google","webcal","ics-download","feedly","feed-protocol","rss-download","ote-reader","ote-preview","json-download"];function T(e){return d.includes(e)}function m(e){return e==="badges"?"badges":"menu"}function h(e){if(e==="none")return new Set;if(!e)return new Set(d);let t=e.split(",").map(n=>n.trim()).filter(T);return t.length>0?new Set(t):new Set(d)}function i(e,t){let n=document.createElement(e);return t&&(n.className=t),n}function a(e,t){return e.textContent=t,e}function w(e){return`https://www.google.com/calendar/render?cid=${u(e)}`}function u(e){return e.replace(/^https?:\/\//,"webcal://")}function S(e){return`https://feedly.com/i/subscription/feed/${encodeURIComponent(e)}`}function y(e){return e.replace(/^https?:\/\//,"feed://")}function x(e){return`https://reader.opentechevents.org/?subscribe=${encodeURIComponent(e)}`}function v(e){return`https://tools.opentechevents.org/preview/?feed=${encodeURIComponent(e)}`}var C={en:{subscribe:"Subscribe",subscribeTo:e=>`Subscribe to ${e}`,calendarGroup:"Calendar",rssGroup:"RSS",oteGroup:"OTE feed",google:"Subscribe with Google Calendar",webcal:"Subscribe with app (Apple Calendar, Outlook desktop\u2026)",icsDownload:"Open/download ICS",feedly:"Subscribe with Feedly",feedProtocol:"Subscribe with feed reader (NetNewsWire, Reeder\u2026)",rssDownload:"Open/download RSS",oteReader:"Subscribe with OTE Reader",otePreview:"Preview in OTE Tools",jsonDownload:"Open/download JSON"},es:{subscribe:"Suscribirse",subscribeTo:e=>`Suscribirse a ${e}`,calendarGroup:"Calendario",rssGroup:"RSS",oteGroup:"Feed OTE",google:"Suscribirse con Google Calendar",webcal:"Suscribirse con app (Apple Calendar, Outlook de escritorio\u2026)",icsDownload:"Abrir/descargar ICS",feedly:"Suscribirse con Feedly",feedProtocol:"Suscribirse con lector de feeds (NetNewsWire, Reeder\u2026)",rssDownload:"Abrir/descargar RSS",oteReader:"Suscribirse con OTE Reader",otePreview:"Vista previa en OTE Tools",jsonDownload:"Abrir/descargar JSON"}},A=["google","webcal","ics-download"],U=["feedly","feed-protocol","rss-download"],I=["ote-reader","ote-preview","json-download"];function G(e,t){let n=[];if(e.icsUrl&&A.some(r=>e.show.has(r))){let r=[];e.show.has("google")&&r.push({label:t.google,href:w(e.icsUrl),external:!0}),e.show.has("webcal")&&r.push({label:t.webcal,href:u(e.icsUrl),external:!1}),e.show.has("ics-download")&&r.push({label:t.icsDownload,href:e.icsUrl,external:!0}),r.length>0&&n.push({key:"ics",label:t.calendarGroup,items:r})}if(e.rssUrl&&U.some(r=>e.show.has(r))){let r=[];e.show.has("feedly")&&r.push({label:t.feedly,href:S(e.rssUrl),external:!0}),e.show.has("feed-protocol")&&r.push({label:t.feedProtocol,href:y(e.rssUrl),external:!1}),e.show.has("rss-download")&&r.push({label:t.rssDownload,href:e.rssUrl,external:!0}),r.length>0&&n.push({key:"rss",label:t.rssGroup,items:r})}if(e.jsonUrl&&I.some(r=>e.show.has(r))){let r=[];e.show.has("ote-reader")&&r.push({label:t.oteReader,href:x(e.jsonUrl),external:!0}),e.show.has("ote-preview")&&r.push({label:t.otePreview,href:v(e.jsonUrl),external:!0}),e.show.has("json-download")&&r.push({label:t.jsonDownload,href:e.jsonUrl,external:!0}),r.length>0&&n.push({key:"ote",label:t.oteGroup,items:r})}return n}function k(e){let t=a(i("a"),e.label);return t.href=e.href,t.setAttribute("role","menuitem"),e.external&&(t.target="_blank",t.rel="noopener noreferrer"),t}function R(e,t,n){let r=i("div","menu");return r.id=e,r.setAttribute("role","menu"),n&&r.append(a(i("div","menu-group-label"),n)),r.append(...t.map(k)),r}function c(e,t){let n=i("div","item"),r=i("button","trigger");r.type="button",r.dataset.group=t.groupKey,r.disabled=t.disabled,r.setAttribute("aria-haspopup","menu"),r.setAttribute("aria-expanded",String(t.open)),r.setAttribute("aria-label",t.ariaLabel);let s=document.createElement("slot");s.name=t.slotName,s.textContent=t.fallbackLabel,r.append(s),r.addEventListener("click",()=>{t.disabled||t.onClick()}),n.append(r),t.open&&!t.disabled&&(r.setAttribute("aria-controls",t.menuId),n.append(t.buildMenuContent())),e.append(n)}function L(e,t){e.replaceChildren();let n=C[t.lang],r=G(t,n),s=t.name?n.subscribeTo(t.name):n.subscribe;if(r.length===0){c(e,{groupKey:"menu",slotName:"trigger",fallbackLabel:n.subscribe,ariaLabel:s,disabled:!0,open:!1,menuId:"",buildMenuContent:()=>i("div","menu"),onClick:()=>{}});return}if(t.layout==="badges"){for(let o of r)c(e,{groupKey:o.key,slotName:`${o.key}-trigger`,fallbackLabel:o.label,ariaLabel:o.label,disabled:!1,open:t.openGroup===o.key,menuId:`menu-${t.instanceId}-${o.key}`,buildMenuContent:()=>R(`menu-${t.instanceId}-${o.key}`,o.items),onClick:()=>t.onToggle(o.key)});return}c(e,{groupKey:"menu",slotName:"trigger",fallbackLabel:n.subscribe,ariaLabel:s,disabled:!1,open:t.openGroup==="menu",menuId:`menu-${t.instanceId}`,buildMenuContent:()=>{let o=i("div","menu");o.id=`menu-${t.instanceId}`,o.setAttribute("role","menu");for(let b of r)o.append(a(i("div","menu-group-label"),b.label),...b.items.map(k));return o},onClick:()=>t.onToggle("menu")})}var E=`
:host {
  display: inline-flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.4rem;
  --ote-surface: #f6f7f9;
  --ote-border: #e3e6ea;
  --ote-text: #1c2128;
  --ote-muted: #626c77;
  --ote-accent: #3556c8;
  --ote-accent-hover: #2a46a8;
  --ote-accent-soft: #eef1fb;
  --ote-radius: 8px;
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

.item {
  position: relative;
  display: inline-flex;
}

.trigger {
  display: inline-flex;
  align-items: center;
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
`;var O=0,l=class extends HTMLElement{static observedAttributes=["feed-ics","feed-rss","feed-json","name","show","layout","theme","lang"];#t;#e=null;#a=`ote-subscribe-${++O}`;#o=t=>{t.composedPath().includes(this)||this.#n(!1)};#i=t=>{t.key==="Escape"&&this.#n(!0)};constructor(){super();let t=this.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=E,this.#t=document.createElement("div"),t.append(n,this.#t)}connectedCallback(){this.#r()}disconnectedCallback(){this.#s()}attributeChangedCallback(){this.isConnected&&this.#r()}#l(t){this.#e===t?this.#n(!0):this.#d(t)}#d(t){let n=this.#e!==null;this.#e=t,this.#r(),n||this.#u()}#n(t){if(this.#e===null)return;let n=this.#e;this.#e=null,this.#s(),this.#r(),t&&this.#t.querySelector(`[data-group="${n}"]`)?.focus()}#u(){document.addEventListener("pointerdown",this.#o),document.addEventListener("keydown",this.#i)}#s(){document.removeEventListener("pointerdown",this.#o),document.removeEventListener("keydown",this.#i)}#r(){let t=g(f(this.getAttribute("lang")),navigator.language),n={icsUrl:this.getAttribute("feed-ics")?.trim()||void 0,rssUrl:this.getAttribute("feed-rss")?.trim()||void 0,jsonUrl:this.getAttribute("feed-json")?.trim()||void 0,name:this.getAttribute("name")?.trim()||void 0,show:h(this.getAttribute("show")),lang:t,layout:m(this.getAttribute("layout")),openGroup:this.#e,instanceId:this.#a,onToggle:r=>this.#l(r)};L(this.#t,n)}};function p(){customElements.get("ote-subscribe")||customElements.define("ote-subscribe",l)}p();export{l as OteSubscribeElement,p as defineOteSubscribe};
//# sourceMappingURL=ote-subscribe.js.map
