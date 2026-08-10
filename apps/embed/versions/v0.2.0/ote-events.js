function $(e,t=320){if(!e)return;let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function re(e){if(Array.isArray(e))return e.length>0?e.join(", "):void 0;if(typeof e=="string")return e.trim()||void 0;if(typeof e=="number"||typeof e=="boolean")return String(e);if(e&&typeof e=="object")return JSON.stringify(e)}function z(e){return e.flatMap(([t,n])=>{let i=re(n);return i?[{label:t,value:i}]:[]})}function L(e){if(!e)return null;let t=/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/.exec(e),i=(t?new Date(`${t[1]}T${t[2]??"00:00:00"}`):new Date(e)).valueOf();return Number.isNaN(i)?null:i}function H(e){let t=Date.now();return e.map((n,i)=>({event:n,index:i,sortDate:L(n.startDate)})).sort((n,i)=>{if(n.sortDate===null&&i.sortDate===null)return n.index-i.index;if(n.sortDate===null)return 1;if(i.sortDate===null)return-1;let r=n.sortDate<t,o=i.sortDate<t;return r!==o?r?1:-1:r?i.sortDate-n.sortDate:n.sortDate-i.sortDate}).map(({event:n})=>n)}function D(e){return e!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function F(e,t){let n=new Date(`${e}T00:00:00Z`);return n.setUTCDate(n.getUTCDate()+t),n.toISOString().slice(0,10)}function k(e,t){if(!e)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(e))return new Intl.DateTimeFormat(void 0,{dateStyle:"medium"}).format(new Date(`${e}T00:00:00Z`));let i=new Date(`${e}${t==="UTC"?"Z":""}`);if(!Number.isNaN(i.valueOf())){let r=new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short"}).format(i);return t?`${r} (${t})`:r}return t?`${e} (${t})`:e}function W(e){return e.location?.venue??T(e.location?.onlineUrl)??"online"}function T(e){if(!e)return;let t;try{t=new URL(e).hostname.toLowerCase().replace(/^www\./,"")}catch{return"Online event"}return t==="meet.google.com"?"Google Meet":t==="teams.microsoft.com"?"Microsoft Teams":t==="meet.jit.si"||t.endsWith(".jitsi.net")?"Jitsi Meet":t==="discord.gg"||t==="discord.com"?"Discord":t==="youtube.com"||t==="youtu.be"?"YouTube":t==="twitch.tv"?"Twitch":t==="lu.ma"?"Luma":t.endsWith(".zoom.us")||t==="zoom.us"?"Zoom":t.endsWith(".slack.com")||t==="slack.com"?"Slack":t.endsWith(".meetup.com")||t==="meetup.com"?"Meetup":t.endsWith(".eventbrite.com")||t==="eventbrite.com"?"Eventbrite":"Online event"}function w(e){return e.dateLabel??(e.endDate?`${k(e.startDate,e.timezone)} to ${k(e.endDate,e.timezone)}`:k(e.startDate,e.timezone))}function U(e){let t=e?.[0];if(t!==void 0)return typeof t=="string"?{url:t}:t}function R(e){let t=(e??[]).filter(i=>i.price!==void 0);if(t.length===0)return;let n=t.reduce((i,r)=>r.price<i.price?r:i);return{amount:n.price,currency:n.currency}}function C(e){let t=Array.isArray(e)?{events:e}:e;if(!Array.isArray(t.events))throw new Error("feed.json has no events array");return{title:t.title,description:t.description,license:t.license,events:t.events.map(n=>{let i=U(n.image),r=R(n.offers),o=n.organizers?.[0]?.name;return{name:n.name??"(untitled event)",startDate:n.startDate,endDate:n.endDate,timezone:n.timezone,location:W(n),locationLink:n.location?.onlineUrl,link:n.url??n.location?.onlineUrl,description:n.description,image:i,price:r,organizerName:o,tags:n.tags,attendanceMode:n.attendanceMode,updatedAt:n.updatedAt,details:z([["ID",n.id],["Status",n.status],["Timezone",n.timezone],["Attendance",n.attendanceMode],["Languages",n.languages],["Tags",n.tags],["Updated",n.updatedAt],["Source",n.source],["Image",i?.url],["Price",r&&`${r.amount}${r.currency?` ${r.currency}`:""}`],["Organizer",o]])}})}}function V(e){return C(JSON.parse(e))}var Oe=["image","when","location","attendance","description","price","tags","organizer"],oe=["image","when","location","attendance","description"],ae=["google-calendar","outlook-calendar","yahoo-calendar","ics","link"];function $e(e){return Oe.includes(e)}function de(e){if(!e)return 1/0;let t=Number.parseInt(e,10);return Number.isFinite(t)&&t>0?t:1/0}function se(e){return e==="en"||e==="es"?e:"auto"}function ce(e,t){return e!=="auto"?e:t.toLowerCase().startsWith("es")?"es":"en"}function le(e){return e!=="false"}function me(e){return e==="cards"?"cards":e==="list"?"list":"calendar"}function N(e){return e==="link"||e==="none"?e:"modal"}function ze(e){return e==="google-calendar"||e==="outlook-calendar"||e==="yahoo-calendar"||e==="ics"||e==="link"}function ue(e){if(e==="none")return[];if(!e)return[...ae];let t=e.split(",").map(n=>n.trim()).filter(ze);return t.length>0?[...new Set(t)]:[...ae]}function pe(e){if(!e)return new Set(oe);let t=e.split(",").map(n=>n.trim()).filter($e);return t.length>0?new Set(t):new Set(oe)}var He={en:{loading:"Loading events\u2026",empty:"No upcoming events.",errorPrefix:"Could not load events: ",online:"Online",onlineEvent:"Online event",free:"Free",updated:"Updated",event:"Event",when:"When",lastUpdate:"Last update",location:"Location",organizer:"Organizer",notAvailable:"\u2014",attendance:{"in-person":"In person",online:"Online",hybrid:"Hybrid"},close:"Close",eventDetails:"Event details",addToGoogle:"Add to Google Calendar",addToOutlook:"Add to Outlook",addToYahoo:"Add to Yahoo",downloadIcs:"Download ICS",addToCalendar:"Add to calendar",openEventPage:"Open event page"},es:{loading:"Cargando eventos\u2026",empty:"No hay pr\xF3ximos eventos.",errorPrefix:"No se pudieron cargar los eventos: ",online:"En l\xEDnea",onlineEvent:"Evento en l\xEDnea",free:"Gratis",updated:"Actualizado",event:"Evento",when:"Cu\xE1ndo",lastUpdate:"\xDAltima actualizaci\xF3n",location:"Lugar",organizer:"Organizador",notAvailable:"\u2014",attendance:{"in-person":"Presencial",online:"En l\xEDnea",hybrid:"H\xEDbrido"},close:"Cerrar",eventDetails:"Detalles del evento",addToGoogle:"A\xF1adir a Google Calendar",addToOutlook:"A\xF1adir a Outlook",addToYahoo:"A\xF1adir a Yahoo",downloadIcs:"Descargar ICS",addToCalendar:"A\xF1adir al calendario",openEventPage:"Abrir p\xE1gina del evento"}};function a(e,t){let n=document.createElement(e);return t&&(n.className=t),n}function l(e,t){return e.textContent=t,e}function ye(e,t){let n=/(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_|`([^`]+)`)/g,i=0;for(let r of t.matchAll(n))if(r.index!==void 0){if(r.index>i&&e.append(document.createTextNode(t.slice(i,r.index))),r[2]&&r[3]){let o=a("a");o.href=r[3],o.target="_blank",o.rel="noopener",o.textContent=r[2],e.append(o)}else r[4]||r[5]?e.append(l(a("strong"),r[4]??r[5]??"")):r[6]||r[7]?e.append(l(a("em"),r[6]??r[7]??"")):r[8]&&e.append(l(a("code"),r[8]));i=r.index+r[0].length}i<t.length&&e.append(document.createTextNode(t.slice(i)))}function Fe(e){let t=a("p");return ye(t,e),t}function G(e,t="event-description"){let n=a("div",t),i=e.replace(/\r\n?/g,`
`).split(`
`),r=[],o,c=()=>{let d=r.join(" ").trim();d&&n.append(Fe(d)),r=[]},s=()=>{o&&o.children.length>0&&n.append(o),o=void 0};for(let d of i){let m=d.trim();if(!m){c(),s();continue}let p=/^[-*]\s+(.+)$/.exec(m);if(p){c(),o??=a("ul");let f=a("li");ye(f,p[1]??""),o.append(f);continue}s(),r.push(m.replace(/^#{1,6}\s+/,""))}return c(),s(),n}function Ee(e,t){let n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("class",t),n.setAttribute("viewBox","0 0 24 24"),n.setAttribute("fill","none"),n.setAttribute("stroke","currentColor"),n.setAttribute("stroke-width","2"),n.setAttribute("stroke-linecap","round"),n.setAttribute("stroke-linejoin","round"),n.setAttribute("aria-hidden","true"),n.setAttribute("focusable","false");for(let i of e){let r=document.createElementNS("http://www.w3.org/2000/svg","path");r.setAttribute("d",i),n.append(r)}return n}function We(e){return Ee({online:["M15 10l4.6-2.3A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.4.9L15 14","M3 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2"],"in-person":["M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0","M12 10h.01"],hybrid:["M4 5h9a2 2 0 0 1 2 2v5H2V7a2 2 0 0 1 2-2","M8 19h4","M10 12v7","M18 21s4-3.2 4-6a4 4 0 0 0-8 0c0 2.8 4 6 4 6","M18 15h.01"]}[e],"badge-icon")}function O(e){return Ee({calendar:["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],"external-link":["M15 3h6v6","M10 14 21 3","M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"],edit:["M12 20h9","M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],trash:["M3 6h18","M8 6V4h8v2","M19 6l-1 14H6L5 6","M10 11v6","M14 11v6"],copy:["M8 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2","M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"]}[e],"action-icon")}function J(e,t){let n=a("span",`badge attendance-badge attendance-${e}`);return n.append(We(e),document.createTextNode(t)),n}function K(e,t){let n=xe(e,t),i=e.locationLink??Ae(n),r=B(e,t);if(!i)return l(a("span"),r);let o=a("a");return o.href=i,o.target="_blank",o.rel="noopener",o.textContent=r,o}function xe(e,t){return e.location&&e.location!=="online"?e.location:t.online}function B(e,t){let n=xe(e,t),i=e.locationLink??Ae(n);return Ue(i?T(i):n,t)}function Ue(e,t){return!e||e==="online"?t.online:e==="Online link"||e==="Online event"?t.onlineEvent:e}function Ae(e){if(e)try{let t=new URL(e);return t.protocol==="http:"||t.protocol==="https:"?e:void 0}catch{return}}function Re(e){let t=L(e.startDate);return t!==null&&t<Date.now()}function q(e){return e.feed?H(e.feed.events).filter(t=>e.showPast||!Re(t)).slice(0,e.limit):[]}function Y(e,t){if(e.amount===0)return t.free;if(e.currency)try{return new Intl.NumberFormat(void 0,{style:"currency",currency:e.currency}).format(e.amount)}catch{return`${e.amount} ${e.currency}`}return String(e.amount)}function fe(e,t){if(!e)return;let n=D(e),i=new Date(`${e}${t==="UTC"&&!n?"Z":""}`);return Number.isNaN(i.valueOf())?void 0:i}function P(e,t){let n=e.toISOString();return t?n.slice(0,10).replace(/-/g,""):n.replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z")}function Ve(e){let t=new Date(e);return t.setUTCDate(t.getUTCDate()+1),t}function _e(e){let t=fe(e.startDate,e.timezone);if(!t)return;let n=D(e.startDate),i=fe(n&&e.endDate?F(e.endDate,1):e.endDate,e.timezone)??(n?Ve(t):t);return{start:t,end:i,dateOnly:n}}function ke(e){return e.description??""}function je(e,t,n){if(e==="link")return t.link;let i=_e(t);if(!i)return;let r=P(i.start,i.dateOnly),o=P(i.end,i.dateOnly),c=ke(t),s=B(t,n);if(e==="google-calendar"){let d=new URL("https://calendar.google.com/calendar/render");return d.searchParams.set("action","TEMPLATE"),d.searchParams.set("text",t.name),d.searchParams.set("dates",`${r}/${o}`),c&&d.searchParams.set("details",c),s&&d.searchParams.set("location",s),t.timezone&&d.searchParams.set("ctz",t.timezone),d.toString()}if(e==="outlook-calendar"){let d=new URL("https://outlook.live.com/calendar/0/action/compose");return d.searchParams.set("rru","addevent"),d.searchParams.set("subject",t.name),d.searchParams.set("startdt",i.start.toISOString()),d.searchParams.set("enddt",i.end.toISOString()),c&&d.searchParams.set("body",c),s&&d.searchParams.set("location",s),d.toString()}if(e==="yahoo-calendar"){let d=new URL("https://calendar.yahoo.com/");return d.searchParams.set("v","60"),d.searchParams.set("title",t.name),d.searchParams.set("st",r),d.searchParams.set("et",o),c&&d.searchParams.set("desc",c),s&&d.searchParams.set("in_loc",s),d.toString()}return`data:text/calendar;charset=utf-8,${encodeURIComponent(Ge(t,i,n))}`}function y(e){return e.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}function Ge(e,t,n){let i=d=>P(d,t.dateOnly),r=t.dateOnly?";VALUE=DATE":"",o=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//OpenTechEvents//ote-events//EN","BEGIN:VEVENT",`UID:${y(e.link??e.name)}`,`DTSTAMP:${P(new Date,!1)}`,`DTSTART${r}:${i(t.start)}`,`DTEND${r}:${i(t.end)}`,`SUMMARY:${y(e.name)}`],c=ke(e),s=B(e,n);return c&&o.push(`DESCRIPTION:${y(c)}`),s&&o.push(`LOCATION:${y(s)}`),e.link&&o.push(`URL:${y(e.link)}`),o.push("END:VEVENT","END:VCALENDAR"),o.join(`\r
`)}function Je(e){if(!e)return null;let n=new Date(e).valueOf();return Number.isNaN(n)?null:n}function Ke(e){let t=Je(e);if(t===null)return e;let n=Math.round((t-Date.now())/1e3),i=Math.abs(n),r=[["year",31536e3,"y"],["month",2592e3,"mo"],["week",604800,"w"],["day",86400,"d"],["hour",3600,"h"],["minute",60,"m"]];for(let[,o,c]of r)if(i>=o)return`${Math.max(1,Math.round(i/o))}${c}`;return"now"}function S(e,t){if(!e)return;let n=/^\d{4}-\d{2}-\d{2}$/.test(e),i=new Date(`${e}${t==="UTC"&&!n?"Z":""}`);if(Number.isNaN(i.valueOf()))return t?`${e} (${t})`:e;let r=n?{weekday:"short",month:"short",day:"numeric",year:"numeric"}:{weekday:"short",month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"},o=new Intl.DateTimeFormat(void 0,r).format(i);return t&&!n?`${o} (${t})`:o}function ge(e){if(!e)return;let t=/^\d{4}-\d{2}-\d{2}$/.test(e),n=new Date(e);if(Number.isNaN(n.valueOf()))return e;let i=t?{month:"short",day:"numeric"}:{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"};return new Intl.DateTimeFormat(void 0,i).format(n)}function Be(e){if(!e)return;let t=new Date(e);return Number.isNaN(t.valueOf())?e:new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric"}).format(t)}function qe(e,t){if(!e||!t)return!1;let n=new Date(e),i=new Date(t);return Number.isNaN(n.valueOf())||Number.isNaN(i.valueOf())?!1:n.getFullYear()===i.getFullYear()&&n.getMonth()===i.getMonth()&&n.getDate()===i.getDate()}function ve(e){if(!e||/^\d{4}-\d{2}-\d{2}$/.test(e))return;let t=new Date(e);if(!Number.isNaN(t.valueOf()))return new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).format(t)}function Z(e){let t=ge(e.startDate),n=ge(e.endDate);if(t&&e.endDate&&qe(e.startDate,e.endDate)){let i=Be(e.startDate),r=ve(e.startDate),o=ve(e.endDate);if(i&&r&&o)return`${i}, ${r}-${o}`}return t&&n&&n!==t?`${t} \u2013 ${n}`:t??e.dateLabel}function Q(e){if(e.dateLabel)return e.dateLabel;let t=S(e.startDate,e.timezone),n=S(e.endDate,e.timezone);return t&&n?`${t} to ${n}`:t}function Ye(e){let t=Z(e),n=Q(e)??w(e),i=t??n;if(!i)return;let r=l(a("p","event-when"),i);return n&&n!==i&&(r.title=n,r.setAttribute("aria-label",n),r.tabIndex=0),r}function Ze(e){let t=Z(e),n=Q(e)??w(e),i=t??n;if(!i)return;let r=l(a("span","event-detail-when"),i);return n&&n!==i&&(r.title=n,r.setAttribute("aria-label",n),r.tabIndex=0),r}function X(e,t){if(!e.image)return;let n=a("img","event-image");return n.src=e.image.url,n.alt=e.image.alt??e.name,n.loading="lazy",n.addEventListener("error",()=>{n.replaceWith(Le(t))}),n}function Le(e){if(e){let t=a("img","event-image event-image-placeholder");return t.src=e,t.alt="",t.loading="lazy",t.addEventListener("error",()=>t.replaceWith(a("div","event-image event-image-placeholder"))),t}return a("div","event-image event-image-placeholder")}function Qe(e,t,n){let i=a("li","event");Xe(i,e,t),t.fields.has("image")&&i.append(X(e,t.placeholderImage)??Le(t.placeholderImage));let r=a("div","event-body");i.append(r);let o=a("h3","event-title");if(e.link&&t.eventClick==="link"){let d=a("a");d.href=e.link,d.target="_blank",d.rel="noopener",d.textContent=e.name,o.append(d)}else o.textContent=e.name;if(r.append(o),t.fields.has("when")){let d=Ye(e);d&&r.append(d)}let c=a("div","event-badges");t.fields.has("attendance")&&e.attendanceMode&&c.append(J(e.attendanceMode,n.attendance[e.attendanceMode])),t.fields.has("price")&&e.price&&c.append(l(a("span","price"),Y(e.price,n)));let s=a("div","event-meta");if(c.children.length>0&&s.append(c),t.fields.has("location")){let d=a("p","event-location");d.append(K(e,n)),s.append(d)}if(s.children.length>0&&r.append(s),t.fields.has("organizer")&&e.organizerName&&r.append(l(a("p","event-organizer"),e.organizerName)),t.fields.has("description")){let d=$(e.description,220);d&&r.append(G(d))}if(t.fields.has("tags")&&e.tags&&e.tags.length>0){let d=a("ul","tags");for(let m of e.tags)d.append(l(a("li","tag"),m));r.append(d)}return ot(r,e,n,t),i}function _(e,t){return e.details?.find(n=>n.label===t)?.value}var De=new Set(["ID","Source","Image","Updated"]);function Xe(e,t,n){n.eventClick!=="none"&&(e.classList.add("event-clickable"),e.tabIndex=0,e.addEventListener("click",i=>{let r=i.target;r instanceof Element&&r.closest("a, button, summary")||he(t,n)}),e.addEventListener("keydown",i=>{i.key!=="Enter"&&i.key!==" "||(i.preventDefault(),he(t,n))}))}function he(e,t){t.onEventOpen?.(e),t.eventClick==="link"&&e.link&&window.open(e.link,"_blank","noopener")}function h(e,t,n){n&&e.append(l(a("dt"),t),l(a("dd"),n))}function j(e,t,n){if(!n)return;let i=a("dd");i.append(n),e.append(l(a("dt"),t),i)}function et(e,t){let n=a("span",`event-header-icon ${e}`);return n.title=t,n.setAttribute("aria-label",t),n}function tt(e,t,n){let i=a("li","event event-row"),r=a("details","event-accordion");i.append(r);let o=a("summary","event-summary");r.append(o);let c=a("span","event-summary-title");c.textContent=e.name,o.append(c);let s=Q(e)??w(e),d=Z(e)??s;o.append(l(a("span","event-summary-when"),d||t.notAvailable)),o.append(l(a("span","event-summary-updated"),Ke(e.updatedAt??_(e,"Updated"))??t.notAvailable));let m=a("div","event-details"),p=n.fields.has("image")&&!!e.image,f=e.description?.trim().length??0;!p&&f>0&&f<=180&&m.classList.add("event-details-compact"),r.append(m);let u=a("div","event-details-content"),b=a("div","event-details-main"),x=a("aside","event-details-aside");if(u.append(b,x),m.append(u),p){let g=X(e,n.placeholderImage);g&&x.append(g)}let A=a("div","event-badges");n.fields.has("attendance")&&e.attendanceMode&&A.append(J(e.attendanceMode,t.attendance[e.attendanceMode])),n.fields.has("price")&&e.price&&A.append(l(a("span","price"),Y(e.price,t))),A.children.length>0&&x.append(A),n.fields.has("description")&&e.description&&b.append(G(e.description));let v=a("dl","event-detail-list");n.fields.has("when")&&h(v,t.when,s),n.fields.has("location")&&j(v,t.location,K(e,t)),n.fields.has("organizer")&&h(v,t.organizer,e.organizerName),h(v,t.updated,S(e.updatedAt??_(e,"Updated"),void 0));for(let g of e.details??[])De.has(g.label)||h(v,g.label,g.value);if(v.children.length>0&&x.append(v),n.fields.has("tags")&&e.tags&&e.tags.length>0){let g=a("ul","tags");for(let Ie of e.tags)g.append(l(a("li","tag"),Ie));b.append(g)}return Ne(m,e,t,n),i}function be(e,t){return e==="google-calendar"?t.addToGoogle:e==="outlook-calendar"?t.addToOutlook:e==="yahoo-calendar"?t.addToYahoo:e==="ics"?t.downloadIcs:t.openEventPage}var M=new Set(["google-calendar","outlook-calendar","yahoo-calendar","ics"]);function nt(e){return typeof e!="string"&&"type"in e}function Te(e){return typeof e!="string"&&"id"in e}function E(e){return typeof e=="string"?e:e.type}function ee(e,t){return!e.layouts||e.layouts.includes(t)}function te(e,t){let n=e.placement??"detail";return n===t||n==="both"}function it(e,t,n){return typeof e=="string"?t==="detail":te(e,t)&&ee(e,n)}function Ce(e,t){return e.eventActions.filter(n=>(typeof n=="string"||nt(n))&&it(n,t,e.layout))}function rt(e,t){return e.eventActions.filter(n=>Te(n)&&te(n,t)&&ee(n,e.layout))}function I(e,t,n,i,r){let o=E(t),c=je(o,n,i);if(!c)return;let s=a("a");s.href=c,s.target=o==="ics"?"_self":"_blank",s.rel="noopener",o==="ics"&&s.setAttribute("download","event.ics"),o==="link"?s.append(O("external-link"),document.createTextNode(be(o,i))):s.textContent=be(o,i),s.addEventListener("click",()=>r.onEventAction?.(t,n)),e.append(s)}function Ne(e,t,n,i){let r=a("div","event-actions"),o=Ce(i,"detail"),c=o.filter(s=>M.has(E(s)));if(c.length>0){let s=a("details","event-action-menu"),d=a("summary","event-action-menu-trigger");d.append(O("calendar"),document.createTextNode(n.addToCalendar)),s.append(d);let m=a("div","event-action-menu-items");for(let p of c)I(m,p,t,n,i);m.children.length>0&&(s.append(m),r.append(s))}for(let s of o)M.has(E(s))||I(r,s,t,n,i);for(let s of i.eventActions)Te(s)&&te(s,"detail")&&ee(s,i.layout)&&r.append(Pe(s,t,i));r.children.length>0&&e.append(r)}function ot(e,t,n,i){let r=Ce(i,"preview"),o=rt(i,"preview");if(r.length===0&&o.length===0)return;let c=a("div","event-actions event-preview-actions"),s=r.filter(d=>M.has(E(d)));if(s.length>0){let d=a("details","event-action-menu"),m=a("summary","event-action-menu-trigger");m.append(O("calendar"),document.createTextNode(n.addToCalendar)),d.append(m);let p=a("div","event-action-menu-items");for(let f of s)I(p,f,t,n,i);p.children.length>0&&(d.append(p),c.append(d))}for(let d of r)M.has(E(d))||I(c,d,t,n,i);for(let d of o)c.append(Pe(d,t,i));e.append(c)}function Pe(e,t,n){let i=a("button");return i.type="button",i.classList.add("event-custom-action"),e.variant==="danger"&&i.classList.add("event-action-danger"),e.icon?i.append(O(e.icon),document.createTextNode(e.label)):i.textContent=e.label,i.addEventListener("click",()=>{n.onEventAction?.(e,t),e.onClick(t)}),i}function we(e,t,n){let i=a("div","event-modal-backdrop");i.tabIndex=-1,i.addEventListener("click",u=>{u.target===i&&n.onEventClose?.()}),i.addEventListener("keydown",u=>{u.key==="Escape"&&n.onEventClose?.()});let r=a("section","event-modal"),o=e.description?.trim().length??0;!e.image&&o>0&&o<=180&&r.classList.add("event-modal-compact"),r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-label",t.eventDetails),i.append(r);let c=a("div","event-modal-header");c.append(l(a("h2","event-modal-title"),e.name));let s=a("button","event-modal-close");s.type="button",s.textContent="\xD7",s.title=t.close,s.setAttribute("aria-label",t.close),s.addEventListener("click",()=>n.onEventClose?.()),c.append(s),r.append(c);let d=a("div","event-modal-content"),m=a("div","event-modal-main"),p=a("aside","event-modal-aside");if(d.append(m,p),r.append(d),e.image){let u=X(e,n.placeholderImage);u&&p.append(u)}if(e.attendanceMode||e.price){let u=a("div","event-badges");e.attendanceMode&&u.append(J(e.attendanceMode,t.attendance[e.attendanceMode])),e.price&&u.append(l(a("span","price"),Y(e.price,t))),p.append(u)}e.description&&m.append(G(e.description));let f=a("dl","event-detail-list");j(f,t.when,Ze(e)),j(f,t.location,K(e,t)),h(f,t.organizer,e.organizerName),h(f,t.updated,S(e.updatedAt??_(e,"Updated"),void 0));for(let u of e.details??[])De.has(u.label)||h(f,u.label,u.value);if(f.children.length>0&&p.append(f),e.tags&&e.tags.length>0){let u=a("ul","tags");for(let b of e.tags)u.append(l(a("li","tag"),b));m.append(u)}return Ne(r,e,t,n),i}function Se(e,t){e.replaceChildren();let n=He[t.lang];if(t.status==="idle"||t.status==="loading"){e.append(l(a("p","message"),n.loading));return}if(t.status==="error"){e.append(l(a("p","message error"),`${n.errorPrefix}${t.errorMessage}`));return}let i=q(t);if(i.length===0){e.append(l(a("p","message"),n.empty));return}if(t.layout==="calendar"){e.append(l(a("div","calendar-host"),n.loading)),t.selectedEvent&&e.append(we(t.selectedEvent,n,t));return}let r=a("ul",`events layout-${t.layout}`);if(t.layout==="list"){let o=a("li","event-list-header");o.append(l(a("span"),n.event),l(a("span"),n.when),et("icon-updated",n.lastUpdate)),r.append(o)}for(let o of i)r.append(t.layout==="list"?tt(o,n,t):Qe(o,t,n));e.append(r),t.selectedEvent&&e.append(we(t.selectedEvent,n,t))}var Me=`
:host {
  display: block;
  --ote-surface: #f6f7f9;
  --ote-border: #e3e6ea;
  --ote-text: #1c2128;
  --ote-muted: #626c77;
  --ote-accent: #3556c8;
  --ote-accent-hover: #2a46a8;
  --ote-accent-soft: #eef1fb;
  --ote-error: #c4302f;
  --ote-error-bg: #fcf1f1;
  --ote-radius: 8px;
  font-family: var(--ote-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  font-size: var(--ote-font-size, 1rem);
  color: var(--ote-text);
}

/* theme="auto" (the default: also matches when the attribute is absent)
   follows the host OS/browser preference. theme="dark" below applies the
   same overrides unconditionally, regardless of that preference. */
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
    --ote-error: #f28b82;
    --ote-error-bg: #3a2323;
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
  gap: 0;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  overflow: hidden;
}

ul.events.layout-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.event {
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: var(--ote-surface);
  overflow: hidden;
}

.event-clickable {
  cursor: pointer;
}

.event-clickable:hover,
.event-clickable:focus-visible {
  border-color: var(--ote-accent);
  outline: none;
}

.layout-list .event {
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid var(--ote-border);
  overflow: visible;
}

.layout-list .event:last-child {
  border-bottom: 0;
}

.event-list-header {
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(10rem, max-content) max-content;
  gap: 1rem;
  padding: 0.55rem 1rem;
  border-bottom: 1px solid var(--ote-border);
  background: var(--ote-accent-soft);
  color: var(--ote-muted);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.event-header-icon {
  display: block;
  width: 0.9rem;
  height: 0.9rem;
  color: currentColor;
  justify-self: start;
}

.icon-updated {
  border: 1.6px solid currentColor;
  border-radius: 50%;
  position: relative;
}

.icon-updated::after {
  content: "";
  position: absolute;
  left: 0.38rem;
  top: 0.17rem;
  width: 0.22rem;
  height: 0.33rem;
  border-left: 1.6px solid currentColor;
  border-bottom: 1.6px solid currentColor;
}

.event-accordion {
  background: var(--ote-surface);
}

.event-summary {
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(10rem, max-content) max-content;
  gap: 1rem;
  align-items: center;
  min-height: 3.25rem;
  padding: 0.7rem 1rem;
  cursor: pointer;
  list-style: none;
}

.event-summary::-webkit-details-marker {
  display: none;
}

.event-summary::after {
  content: none;
}

.event-summary:hover,
.event-summary:focus-visible {
  background: var(--ote-accent-soft);
  outline: none;
}

.event-summary-title {
  min-width: 0;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.event-summary-when,
.event-summary-updated {
  min-width: 0;
  color: var(--ote-muted);
  font-size: 0.875rem;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.event-details {
  padding: 0.2rem 1rem 1rem;
}

.event-details-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(13rem, 18rem);
  gap: 1rem;
  align-items: start;
}

.event-details-main,
.event-details-aside {
  min-width: 0;
  max-width: 100%;
}

.event-details-aside {
  padding-inline-start: 1rem;
  border-inline-start: 1px solid var(--ote-border);
}

.event-details-compact .event-details-content {
  grid-template-columns: 1fr;
  gap: 0.65rem;
}

.event-details-compact .event-details-aside {
  padding-inline-start: 0;
  border-inline-start: 0;
}

.event-details-compact .event-detail-list {
  grid-template-columns: minmax(4.5rem, max-content) minmax(0, 1fr) minmax(4.5rem, max-content) minmax(0, 1fr);
  gap: 0.35rem 0.85rem;
  padding-top: 0.65rem;
  border-top: 1px solid var(--ote-border);
}

.layout-list .event-details .event-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0 0 0.85rem;
  border-radius: var(--ote-radius);
}

.event-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.45rem;
  margin: 0.85rem 0 0;
}

.event-actions a,
.event-actions button,
.event-action-menu-trigger {
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
  text-decoration: none;
  cursor: pointer;
  list-style: none;
}

.event-action-menu-trigger::-webkit-details-marker {
  display: none;
}

.event-actions a:hover,
.event-actions a:focus-visible,
.event-actions button:hover,
.event-actions button:focus-visible,
.event-action-menu-trigger:hover,
.event-action-menu-trigger:focus-visible {
  border-color: var(--ote-accent);
  color: var(--ote-accent-hover);
  outline: none;
}

.event-action-menu {
  position: relative;
  z-index: 3;
}

.event-action-menu[open] .event-action-menu-trigger {
  border-color: var(--ote-accent);
}

.event-action-menu-items {
  position: absolute;
  inset-block-end: calc(100% + 0.25rem);
  inset-inline-start: 0;
  z-index: 4;
  display: grid;
  gap: 0.2rem;
  min-width: 13rem;
  max-width: calc(100vw - 3rem);
  margin: 0;
  padding: 0.3rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: var(--ote-surface);
  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.12);
}

.event-action-menu-items a {
  justify-content: flex-start;
  width: 100%;
  border-color: transparent;
  background: transparent;
}

.event-preview-actions {
  padding-top: 0.65rem;
  border-top: 1px solid var(--ote-border);
}

.event-actions .event-action-danger {
  background: var(--ote-error-bg);
  color: var(--ote-error);
}

.event-actions .event-action-danger:hover,
.event-actions .event-action-danger:focus-visible {
  border-color: var(--ote-error);
  color: var(--ote-error);
}

.action-icon {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
}

.event-detail-list {
  display: grid;
  grid-template-columns: minmax(5rem, max-content) minmax(0, 1fr);
  gap: 0.35rem 0.75rem;
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  min-width: 0;
  max-width: 100%;
}

.event-detail-list dt {
  min-width: 0;
  color: var(--ote-muted);
  font-weight: 700;
  overflow-wrap: anywhere;
}

.event-detail-list dd {
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
}

/* Cards layout: image (if any) is a full-width cover strip above the body. */
.layout-cards .event-body {
  padding: 0.9rem 1rem;
}

.layout-cards .event-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0;
}

.event-image {
  display: block;
  object-fit: cover;
  border-radius: var(--ote-radius);
  background: var(--ote-border);
}

.event-image-placeholder {
  background:
    linear-gradient(135deg, var(--ote-accent-soft), transparent 55%),
    linear-gradient(315deg, var(--ote-border), transparent 50%),
    var(--ote-surface);
}

.layout-cards .event-image {
  border-radius: 0;
}

.event-body {
  min-width: 0;
  flex: 1;
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

.event-location a {
  color: var(--ote-accent);
  text-decoration: none;
}

.event-location > span,
.event-location a {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-detail-list dd a {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
  color: var(--ote-accent);
  text-decoration: none;
}

.event-location a:hover,
.event-location a:focus-visible,
.event-detail-list dd a:hover,
.event-detail-list dd a:focus-visible {
  color: var(--ote-accent-hover);
  text-decoration: underline;
}

.event-when,
.event-location,
.event-organizer {
  margin: 0.15rem 0;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  font-size: 0.875rem;
  color: var(--ote-muted);
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0.35rem 0;
  min-width: 0;
  max-width: 100%;
  font-size: 0.8125rem;
}

.event-meta .event-badges {
  flex: 0 0 auto;
  margin: 0;
  font-size: inherit;
}

.event-meta .event-location {
  flex: 1 1 auto;
  margin: 0;
  font-size: inherit;
}

.event-description {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.event-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.35rem 0;
}

.badge,
.price {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  line-height: 1.4;
  background: var(--ote-accent-soft);
  color: var(--ote-accent);
}

.badge-icon {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
}

.event-meta .badge,
.event-meta .price {
  font-size: inherit;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
}

.tag {
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--ote-border);
  font-size: 0.75rem;
  color: var(--ote-muted);
}

.calendar-host {
  min-height: 20rem;
}

/* @event-calendar/core renders these event nodes; they open the same detail view as cards. */
.calendar-host .ec-event {
  cursor: pointer;
}

.event-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: grid;
  align-items: center;
  justify-items: center;
  padding: 1rem;
  background: rgb(0 0 0 / 0.45);
}

.event-modal {
  width: min(72rem, 100%);
  max-height: calc(100vh - 2rem);
  max-height: calc(100dvh - 2rem);
  overflow: auto;
  padding: 1.1rem 1.25rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: var(--ote-surface);
  box-shadow: 0 1rem 3rem rgb(0 0 0 / 0.22);
}

.event-modal-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 0.75rem;
  align-items: start;
  margin: 0 0 1rem;
}

.event-modal-title {
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.25;
}

.event-modal-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(15rem, 22rem);
  gap: 1.25rem;
  align-items: start;
}

.event-modal-main {
  min-width: 0;
}

.event-modal-aside {
  min-width: 0;
  padding-inline-start: 1.25rem;
  border-inline-start: 1px solid var(--ote-border);
}

.event-modal-compact {
  width: min(56rem, 100%);
}

.event-modal-compact .event-modal-content {
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.event-modal-compact .event-modal-aside {
  padding-inline-start: 0;
  border-inline-start: 0;
}

.event-modal-compact .event-detail-list {
  grid-template-columns: minmax(4.5rem, max-content) minmax(0, 1fr) minmax(4.5rem, max-content) minmax(0, 1fr);
  gap: 0.45rem 0.85rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--ote-border);
}

.event-modal-close {
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: transparent;
  color: var(--ote-muted);
  font: inherit;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

.event-modal-close:hover,
.event-modal-close:focus-visible {
  border-color: var(--ote-accent);
  color: var(--ote-accent);
  outline: none;
}

.event-modal .event-image {
  width: 100%;
  height: clamp(8rem, 22vh, 12rem);
  margin: 0 0 0.85rem;
  object-fit: cover;
}

.event-modal .event-description {
  margin-top: 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

.event-modal .event-badges {
  margin: 0 0 0.75rem;
}

.event-modal .event-detail-list {
  margin-top: 0.75rem;
  font-size: 0.85rem;
}

.event-modal > .event-actions {
  margin: 1.1rem 0 0;
  padding-top: 0.85rem;
  border-top: 1px solid var(--ote-border);
}

.event-description > * {
  margin: 0.45rem 0 0;
}

.event-description > :first-child {
  margin-top: 0;
}

.event-description ul {
  padding-left: 1.25rem;
}

.event-description code {
  padding: 0.05rem 0.25rem;
  border-radius: 4px;
  background: var(--ote-accent-soft);
  color: var(--ote-text);
}

.event-description a {
  color: var(--ote-accent);
  text-decoration: none;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.event-description a:hover,
.event-description a:focus-visible {
  color: var(--ote-accent-hover);
  text-decoration: underline;
}

@media (max-width: 64rem) {
  .event-details-content {
    grid-template-columns: 1fr;
  }

  .event-details-aside {
    order: -1;
    padding-inline-start: 0;
    padding-bottom: 0.75rem;
    border-inline-start: 0;
    border-bottom: 1px solid var(--ote-border);
  }

  .layout-list .event-details .event-image {
    width: min(100%, 20rem);
  }
}

@media (max-width: 40rem) {
  .event-list-header {
    display: none;
  }

  .event-summary {
    grid-template-columns: 1fr;
    gap: 0.25rem 0.75rem;
  }

  .event-summary-title {
    grid-column: 1;
  }

  .event-summary-when,
  .event-summary-updated {
    grid-column: 1;
  }

  .event-detail-list {
    grid-template-columns: 1fr;
  }

  .event-details-compact .event-detail-list {
    grid-template-columns: 1fr;
  }

  .event-modal-compact .event-detail-list {
    grid-template-columns: 1fr;
  }

  .event-modal {
    padding: 1rem;
  }

  .event-modal-content {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  .event-modal-aside {
    order: -1;
    padding-inline-start: 0;
    padding-bottom: 0.85rem;
    border-inline-start: 0;
    border-bottom: 1px solid var(--ote-border);
  }
}
`;var ne=class extends HTMLElement{static observedAttributes=["feed","limit","theme","lang","show-past","layout","fields","placeholder-image","event-click","event-actions"];#d;#r;#a;#n;#i="idle";#o="";#s=0;#e;#l=[];#m;#c=0;#g=!1;constructor(){super();let t=this.attachShadow({mode:"open"});this.#d=document.createElement("style"),this.#d.textContent=Me,this.#r=document.createElement("div"),this.#r.className="ote-events",t.append(this.#d,this.#r)}connectedCallback(){this.#n?this.#t():this.#u()}disconnectedCallback(){this.#f()}attributeChangedCallback(t){this.isConnected&&(t==="feed"?this.#u():this.#t())}get feedData(){return this.#n}set feedData(t){this.#p(t)}get events(){if(this.#n)return Array.isArray(this.#n)?this.#n:this.#n.events}set events(t){this.#p(t)}get event(){return this.events?.[0]}set event(t){this.#p(t==null?t:[t])}get eventActions(){return this.#l}set eventActions(t){this.#l=Array.isArray(t)?t:[],this.isConnected&&this.#t()}async#u(){if(this.#n)return;let t=this.getAttribute("feed");if(!t){this.#i="error",this.#o='Missing required "feed" attribute.',this.#e=void 0,this.#t();return}this.#i="loading",this.#t();let n=++this.#s;try{let i=await fetch(t);if(!i.ok)throw new Error(`HTTP ${i.status}`);let r=await i.text(),o=V(r);if(n!==this.#s)return;this.#a=o,this.#i="loaded",this.#e=void 0}catch(i){if(n!==this.#s)return;this.#i="error",this.#o=i instanceof Error?i.message:String(i),this.#e=void 0}this.#t()}#p(t){if(this.#s++,t==null){this.#n=void 0,this.#a=void 0,this.#o="",this.#e=void 0,this.isConnected&&this.#u();return}this.#n=t;try{this.#a=C(t),this.#i="loaded",this.#o="",this.#e=void 0}catch(n){this.#a=void 0,this.#i="error",this.#o=n instanceof Error?n.message:String(n),this.#e=void 0}this.isConnected&&this.#t()}#t(){let t=ce(se(this.getAttribute("lang")),navigator.language),n={status:this.#i,errorMessage:this.#o,feed:this.#a,lang:t,limit:de(this.getAttribute("limit")),showPast:le(this.getAttribute("show-past")),layout:me(this.getAttribute("layout")),fields:pe(this.getAttribute("fields")),placeholderImage:this.getAttribute("placeholder-image")?.trim()||void 0,eventClick:N(this.getAttribute("event-click")),eventActions:[...ue(this.getAttribute("event-actions")),...this.#l],selectedEvent:this.#e,onEventOpen:i=>{this.dispatchEvent(new CustomEvent("ote-event-open",{detail:{event:i}})),N(this.getAttribute("event-click"))==="modal"&&(this.#e=i,this.#t())},onEventClose:()=>{this.#e=void 0,this.#t()},onEventAction:(i,r)=>{let o=typeof i=="string"?i:"type"in i?i.type:i.id;this.dispatchEvent(new CustomEvent("ote-event-action",{detail:{action:o,event:r}}))}};if(Se(this.#r,n),n.layout==="calendar"&&n.status==="loaded"){let i=q(n);if(i.length>0){this.#v(i,n.lang);return}}this.#f()}async#v(t,n){this.#f();let i=++this.#c;try{let r=await import(new URL("./calendar-layout.js",import.meta.url).href);if(i!==this.#c||!this.isConnected)return;this.#g||(this.#d.textContent+=r.CALENDAR_CSS,this.#g=!0);let o=this.#r.querySelector(".calendar-host");if(!o)return;o.classList.remove("ec-dark","ec-auto-dark");let c=this.getAttribute("theme");c==="dark"?o.classList.add("ec-dark"):c!=="light"&&o.classList.add("ec-auto-dark"),o.replaceChildren(),this.#m=r.renderCalendar(o,t,{lang:n,onEventClick:s=>{let d=N(this.getAttribute("event-click"));this.dispatchEvent(new CustomEvent("ote-event-open",{detail:{event:s}})),d==="link"&&s.link?window.open(s.link,"_blank","noopener"):d==="modal"&&(this.#e=s,this.#t())}})}catch(r){if(i!==this.#c||!this.isConnected)return;let o=this.#r.querySelector(".calendar-host");o&&(o.textContent=r instanceof Error?r.message:String(r))}}#f(){this.#c++,this.#m?.destroy(),this.#m=void 0}};function ie(){customElements.get("ote-events")||customElements.define("ote-events",ne)}ie();export{ie as defineOteEvents};
//# sourceMappingURL=ote-events.js.map
