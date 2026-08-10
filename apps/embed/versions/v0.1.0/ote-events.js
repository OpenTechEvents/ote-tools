function M(e,t=320){if(!e)return;let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function X(e){if(Array.isArray(e))return e.length>0?e.join(", "):void 0;if(typeof e=="string")return e.trim()||void 0;if(typeof e=="number"||typeof e=="boolean")return String(e);if(e&&typeof e=="object")return JSON.stringify(e)}function N(e){return e.flatMap(([t,n])=>{let r=X(n);return r?[{label:t,value:r}]:[]})}function k(e){if(!e)return null;let t=/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/.exec(e),r=(t?new Date(`${t[1]}T${t[2]??"00:00:00"}`):new Date(e)).valueOf();return Number.isNaN(r)?null:r}function I(e){let t=Date.now();return e.map((n,r)=>({event:n,index:r,sortDate:k(n.startDate)})).sort((n,r)=>{if(n.sortDate===null&&r.sortDate===null)return n.index-r.index;if(n.sortDate===null)return 1;if(r.sortDate===null)return-1;let i=n.sortDate<t,o=r.sortDate<t;return i!==o?i?1:-1:i?r.sortDate-n.sortDate:n.sortDate-r.sortDate}).map(({event:n})=>n)}function L(e){return e!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function O(e,t){let n=new Date(`${e}T00:00:00Z`);return n.setUTCDate(n.getUTCDate()+t),n.toISOString().slice(0,10)}function A(e,t){if(!e)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(e))return new Intl.DateTimeFormat(void 0,{dateStyle:"medium"}).format(new Date(`${e}T00:00:00Z`));let r=new Date(`${e}${t==="UTC"?"Z":""}`);if(!Number.isNaN(r.valueOf())){let i=new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short"}).format(r);return t?`${i} (${t})`:i}return t?`${e} (${t})`:e}function $(e){return e.location?.venue??D(e.location?.onlineUrl)??"online"}function D(e){if(!e)return;let t;try{t=new URL(e).hostname.toLowerCase().replace(/^www\./,"")}catch{return"Online event"}return t==="meet.google.com"?"Google Meet":t==="teams.microsoft.com"?"Microsoft Teams":t==="meet.jit.si"||t.endsWith(".jitsi.net")?"Jitsi Meet":t==="discord.gg"||t==="discord.com"?"Discord":t==="youtube.com"||t==="youtu.be"?"YouTube":t==="twitch.tv"?"Twitch":t==="lu.ma"?"Luma":t.endsWith(".zoom.us")||t==="zoom.us"?"Zoom":t.endsWith(".slack.com")||t==="slack.com"?"Slack":t.endsWith(".meetup.com")||t==="meetup.com"?"Meetup":t.endsWith(".eventbrite.com")||t==="eventbrite.com"?"Eventbrite":"Online event"}function w(e){return e.dateLabel??(e.endDate?`${A(e.startDate,e.timezone)} to ${A(e.endDate,e.timezone)}`:A(e.startDate,e.timezone))}function z(e){let t=e?.[0];if(t!==void 0)return typeof t=="string"?{url:t}:t}function H(e){let t=(e??[]).filter(r=>r.price!==void 0);if(t.length===0)return;let n=t.reduce((r,i)=>i.price<r.price?i:r);return{amount:n.price,currency:n.currency}}function T(e){let t=Array.isArray(e)?{events:e}:e;if(!Array.isArray(t.events))throw new Error("feed.json has no events array");return{title:t.title,description:t.description,license:t.license,events:t.events.map(n=>{let r=z(n.image),i=H(n.offers),o=n.organizers?.[0]?.name;return{name:n.name??"(untitled event)",startDate:n.startDate,endDate:n.endDate,timezone:n.timezone,location:$(n),locationLink:n.location?.onlineUrl,link:n.url??n.location?.onlineUrl,description:n.description,image:r,price:i,organizerName:o,tags:n.tags,attendanceMode:n.attendanceMode,updatedAt:n.updatedAt,details:N([["ID",n.id],["Status",n.status],["Timezone",n.timezone],["Attendance",n.attendanceMode],["Languages",n.languages],["Tags",n.tags],["Updated",n.updatedAt],["Source",n.source],["Image",r?.url],["Price",i&&`${i.amount}${i.currency?` ${i.currency}`:""}`],["Organizer",o]])}})}}function F(e){return T(JSON.parse(e))}var Me=["image","when","location","attendance","description","price","tags","organizer"],ee=["image","when","location","attendance","description"],te=["google-calendar","outlook-calendar","yahoo-calendar","ics","link"];function Ne(e){return Me.includes(e)}function ne(e){if(!e)return 1/0;let t=Number.parseInt(e,10);return Number.isFinite(t)&&t>0?t:1/0}function re(e){return e==="en"||e==="es"?e:"auto"}function ie(e,t){return e!=="auto"?e:t.toLowerCase().startsWith("es")?"es":"en"}function oe(e){return e!=="false"}function ae(e){return e==="cards"?"cards":e==="list"?"list":"calendar"}function C(e){return e==="link"||e==="none"?e:"modal"}function Ie(e){return e==="google-calendar"||e==="outlook-calendar"||e==="yahoo-calendar"||e==="ics"||e==="link"}function de(e){if(e==="none")return[];if(!e)return[...te];let t=e.split(",").map(n=>n.trim()).filter(Ie);return t.length>0?[...new Set(t)]:[...te]}function se(e){if(!e)return new Set(ee);let t=e.split(",").map(n=>n.trim()).filter(Ne);return t.length>0?new Set(t):new Set(ee)}var Oe={en:{loading:"Loading events\u2026",empty:"No upcoming events.",errorPrefix:"Could not load events: ",online:"Online",onlineEvent:"Online event",free:"Free",updated:"Updated",event:"Event",when:"When",lastUpdate:"Last update",location:"Location",organizer:"Organizer",notAvailable:"\u2014",attendance:{"in-person":"In person",online:"Online",hybrid:"Hybrid"},close:"Close",eventDetails:"Event details",addToGoogle:"Add to Google Calendar",addToOutlook:"Add to Outlook",addToYahoo:"Add to Yahoo",downloadIcs:"Download ICS",addToCalendar:"Add to calendar",openEventPage:"Open event page"},es:{loading:"Cargando eventos\u2026",empty:"No hay pr\xF3ximos eventos.",errorPrefix:"No se pudieron cargar los eventos: ",online:"En l\xEDnea",onlineEvent:"Evento en l\xEDnea",free:"Gratis",updated:"Actualizado",event:"Evento",when:"Cu\xE1ndo",lastUpdate:"\xDAltima actualizaci\xF3n",location:"Lugar",organizer:"Organizador",notAvailable:"\u2014",attendance:{"in-person":"Presencial",online:"En l\xEDnea",hybrid:"H\xEDbrido"},close:"Cerrar",eventDetails:"Detalles del evento",addToGoogle:"A\xF1adir a Google Calendar",addToOutlook:"A\xF1adir a Outlook",addToYahoo:"A\xF1adir a Yahoo",downloadIcs:"Descargar ICS",addToCalendar:"A\xF1adir al calendario",openEventPage:"Abrir p\xE1gina del evento"}};function a(e,t){let n=document.createElement(e);return t&&(n.className=t),n}function l(e,t){return e.textContent=t,e}function ve(e,t){let n=/(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_|`([^`]+)`)/g,r=0;for(let i of t.matchAll(n))if(i.index!==void 0){if(i.index>r&&e.append(document.createTextNode(t.slice(r,i.index))),i[2]&&i[3]){let o=a("a");o.href=i[3],o.target="_blank",o.rel="noopener",o.textContent=i[2],e.append(o)}else i[4]||i[5]?e.append(l(a("strong"),i[4]??i[5]??"")):i[6]||i[7]?e.append(l(a("em"),i[6]??i[7]??"")):i[8]&&e.append(l(a("code"),i[8]));r=i.index+i[0].length}r<t.length&&e.append(document.createTextNode(t.slice(r)))}function $e(e){let t=a("p");return ve(t,e),t}function R(e,t="event-description"){let n=a("div",t),r=e.replace(/\r\n?/g,`
`).split(`
`),i=[],o,s=()=>{let d=i.join(" ").trim();d&&n.append($e(d)),i=[]},c=()=>{o&&o.children.length>0&&n.append(o),o=void 0};for(let d of r){let u=d.trim();if(!u){s(),c();continue}let f=/^[-*]\s+(.+)$/.exec(u);if(f){s(),o??=a("ul");let p=a("li");ve(p,f[1]??""),o.append(p);continue}c(),i.push(u.replace(/^#{1,6}\s+/,""))}return s(),c(),n}function be(e,t){let n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("class",t),n.setAttribute("viewBox","0 0 24 24"),n.setAttribute("fill","none"),n.setAttribute("stroke","currentColor"),n.setAttribute("stroke-width","2"),n.setAttribute("stroke-linecap","round"),n.setAttribute("stroke-linejoin","round"),n.setAttribute("aria-hidden","true"),n.setAttribute("focusable","false");for(let r of e){let i=document.createElementNS("http://www.w3.org/2000/svg","path");i.setAttribute("d",r),n.append(i)}return n}function ze(e){return be({online:["M15 10l4.6-2.3A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.4.9L15 14","M3 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2"],"in-person":["M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0","M12 10h.01"],hybrid:["M4 5h9a2 2 0 0 1 2 2v5H2V7a2 2 0 0 1 2-2","M8 19h4","M10 12v7","M18 21s4-3.2 4-6a4 4 0 0 0-8 0c0 2.8 4 6 4 6","M18 15h.01"]}[e],"badge-icon")}function V(e){return be({calendar:["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],"external-link":["M15 3h6v6","M10 14 21 3","M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"],edit:["M12 20h9","M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],trash:["M3 6h18","M8 6V4h8v2","M19 6l-1 14H6L5 6","M10 11v6","M14 11v6"],copy:["M8 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2","M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"]}[e],"action-icon")}function _(e,t){let n=a("span",`badge attendance-badge attendance-${e}`);return n.append(ze(e),document.createTextNode(t)),n}function j(e,t){let n=we(e,t),r=e.locationLink??ye(n),i=G(e,t);if(!r)return l(a("span"),i);let o=a("a");return o.href=r,o.target="_blank",o.rel="noopener",o.textContent=i,o}function we(e,t){return e.location&&e.location!=="online"?e.location:t.online}function G(e,t){let n=we(e,t),r=e.locationLink??ye(n);return He(r?D(r):n,t)}function He(e,t){return!e||e==="online"?t.online:e==="Online link"||e==="Online event"?t.onlineEvent:e}function ye(e){if(e)try{let t=new URL(e);return t.protocol==="http:"||t.protocol==="https:"?e:void 0}catch{return}}function Fe(e){let t=k(e.startDate);return t!==null&&t<Date.now()}function J(e){return e.feed?I(e.feed.events).filter(t=>e.showPast||!Fe(t)).slice(0,e.limit):[]}function K(e,t){if(e.amount===0)return t.free;if(e.currency)try{return new Intl.NumberFormat(void 0,{style:"currency",currency:e.currency}).format(e.amount)}catch{return`${e.amount} ${e.currency}`}return String(e.amount)}function ce(e,t){if(!e)return;let n=L(e),r=new Date(`${e}${t==="UTC"&&!n?"Z":""}`);return Number.isNaN(r.valueOf())?void 0:r}function P(e,t){let n=e.toISOString();return t?n.slice(0,10).replace(/-/g,""):n.replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z")}function We(e){let t=new Date(e);return t.setUTCDate(t.getUTCDate()+1),t}function Ue(e){let t=ce(e.startDate,e.timezone);if(!t)return;let n=L(e.startDate),r=ce(n&&e.endDate?O(e.endDate,1):e.endDate,e.timezone)??(n?We(t):t);return{start:t,end:r,dateOnly:n}}function Ee(e){return e.description??""}function Re(e,t,n){if(e==="link")return t.link;let r=Ue(t);if(!r)return;let i=P(r.start,r.dateOnly),o=P(r.end,r.dateOnly),s=Ee(t),c=G(t,n);if(e==="google-calendar"){let d=new URL("https://calendar.google.com/calendar/render");return d.searchParams.set("action","TEMPLATE"),d.searchParams.set("text",t.name),d.searchParams.set("dates",`${i}/${o}`),s&&d.searchParams.set("details",s),c&&d.searchParams.set("location",c),t.timezone&&d.searchParams.set("ctz",t.timezone),d.toString()}if(e==="outlook-calendar"){let d=new URL("https://outlook.live.com/calendar/0/action/compose");return d.searchParams.set("rru","addevent"),d.searchParams.set("subject",t.name),d.searchParams.set("startdt",r.start.toISOString()),d.searchParams.set("enddt",r.end.toISOString()),s&&d.searchParams.set("body",s),c&&d.searchParams.set("location",c),d.toString()}if(e==="yahoo-calendar"){let d=new URL("https://calendar.yahoo.com/");return d.searchParams.set("v","60"),d.searchParams.set("title",t.name),d.searchParams.set("st",i),d.searchParams.set("et",o),s&&d.searchParams.set("desc",s),c&&d.searchParams.set("in_loc",c),d.toString()}return`data:text/calendar;charset=utf-8,${encodeURIComponent(Ve(t,r,n))}`}function y(e){return e.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}function Ve(e,t,n){let r=d=>P(d,t.dateOnly),i=t.dateOnly?";VALUE=DATE":"",o=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//OpenTechEvents//ote-events//EN","BEGIN:VEVENT",`UID:${y(e.link??e.name)}`,`DTSTAMP:${P(new Date,!1)}`,`DTSTART${i}:${r(t.start)}`,`DTEND${i}:${r(t.end)}`,`SUMMARY:${y(e.name)}`],s=Ee(e),c=G(e,n);return s&&o.push(`DESCRIPTION:${y(s)}`),c&&o.push(`LOCATION:${y(c)}`),e.link&&o.push(`URL:${y(e.link)}`),o.push("END:VEVENT","END:VCALENDAR"),o.join(`\r
`)}function _e(e){if(!e)return null;let n=new Date(e).valueOf();return Number.isNaN(n)?null:n}function je(e){let t=_e(e);if(t===null)return e;let n=Math.round((t-Date.now())/1e3),r=Math.abs(n),i=[["year",31536e3,"y"],["month",2592e3,"mo"],["week",604800,"w"],["day",86400,"d"],["hour",3600,"h"],["minute",60,"m"]];for(let[,o,s]of i)if(r>=o)return`${Math.max(1,Math.round(r/o))}${s}`;return"now"}function S(e,t){if(!e)return;let n=/^\d{4}-\d{2}-\d{2}$/.test(e),r=new Date(`${e}${t==="UTC"&&!n?"Z":""}`);if(Number.isNaN(r.valueOf()))return t?`${e} (${t})`:e;let i=n?{weekday:"short",month:"short",day:"numeric",year:"numeric"}:{weekday:"short",month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"},o=new Intl.DateTimeFormat(void 0,i).format(r);return t&&!n?`${o} (${t})`:o}function le(e){if(!e)return;let t=/^\d{4}-\d{2}-\d{2}$/.test(e),n=new Date(e);if(Number.isNaN(n.valueOf()))return e;let r=t?{month:"short",day:"numeric"}:{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"};return new Intl.DateTimeFormat(void 0,r).format(n)}function Ge(e){if(!e)return;let t=new Date(e);return Number.isNaN(t.valueOf())?e:new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric"}).format(t)}function Je(e,t){if(!e||!t)return!1;let n=new Date(e),r=new Date(t);return Number.isNaN(n.valueOf())||Number.isNaN(r.valueOf())?!1:n.getFullYear()===r.getFullYear()&&n.getMonth()===r.getMonth()&&n.getDate()===r.getDate()}function me(e){if(!e||/^\d{4}-\d{2}-\d{2}$/.test(e))return;let t=new Date(e);if(!Number.isNaN(t.valueOf()))return new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).format(t)}function B(e){let t=le(e.startDate),n=le(e.endDate);if(t&&e.endDate&&Je(e.startDate,e.endDate)){let r=Ge(e.startDate),i=me(e.startDate),o=me(e.endDate);if(r&&i&&o)return`${r}, ${i}-${o}`}return t&&n&&n!==t?`${t} \u2013 ${n}`:t??e.dateLabel}function q(e){if(e.dateLabel)return e.dateLabel;let t=S(e.startDate,e.timezone),n=S(e.endDate,e.timezone);return t&&n?`${t} to ${n}`:t}function Ke(e){let t=B(e),n=q(e)??w(e),r=t??n;if(!r)return;let i=l(a("p","event-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function Be(e){let t=B(e),n=q(e)??w(e),r=t??n;if(!r)return;let i=l(a("span","event-detail-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function Y(e,t){if(!e.image)return;let n=a("img","event-image");return n.src=e.image.url,n.alt=e.image.alt??e.name,n.loading="lazy",n.addEventListener("error",()=>{n.replaceWith(xe(t))}),n}function xe(e){if(e){let t=a("img","event-image event-image-placeholder");return t.src=e,t.alt="",t.loading="lazy",t.addEventListener("error",()=>t.replaceWith(a("div","event-image event-image-placeholder"))),t}return a("div","event-image event-image-placeholder")}function qe(e,t,n){let r=a("li","event");Ye(r,e,t),t.fields.has("image")&&r.append(Y(e,t.placeholderImage)??xe(t.placeholderImage));let i=a("div","event-body");r.append(i);let o=a("h3","event-title");if(e.link&&t.eventClick==="link"){let d=a("a");d.href=e.link,d.target="_blank",d.rel="noopener",d.textContent=e.name,o.append(d)}else o.textContent=e.name;if(i.append(o),t.fields.has("when")){let d=Ke(e);d&&i.append(d)}let s=a("div","event-badges");t.fields.has("attendance")&&e.attendanceMode&&s.append(_(e.attendanceMode,n.attendance[e.attendanceMode])),t.fields.has("price")&&e.price&&s.append(l(a("span","price"),K(e.price,n)));let c=a("div","event-meta");if(s.children.length>0&&c.append(s),t.fields.has("location")){let d=a("p","event-location");d.append(j(e,n)),c.append(d)}if(c.children.length>0&&i.append(c),t.fields.has("organizer")&&e.organizerName&&i.append(l(a("p","event-organizer"),e.organizerName)),t.fields.has("description")){let d=M(e.description,220);d&&i.append(R(d))}if(t.fields.has("tags")&&e.tags&&e.tags.length>0){let d=a("ul","tags");for(let u of e.tags)d.append(l(a("li","tag"),u));i.append(d)}return et(i,e,t),r}function W(e,t){return e.details?.find(n=>n.label===t)?.value}var Ae=new Set(["ID","Source","Image","Updated"]);function Ye(e,t,n){n.eventClick!=="none"&&(e.classList.add("event-clickable"),e.tabIndex=0,e.addEventListener("click",r=>{let i=r.target;i instanceof Element&&i.closest("a, button, summary")||ue(t,n)}),e.addEventListener("keydown",r=>{r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),ue(t,n))}))}function ue(e,t){t.onEventOpen?.(e),t.eventClick==="link"&&e.link&&window.open(e.link,"_blank","noopener")}function v(e,t,n){n&&e.append(l(a("dt"),t),l(a("dd"),n))}function U(e,t,n){if(!n)return;let r=a("dd");r.append(n),e.append(l(a("dt"),t),r)}function Ze(e,t){let n=a("span",`event-header-icon ${e}`);return n.title=t,n.setAttribute("aria-label",t),n}function Qe(e,t,n){let r=a("li","event event-row"),i=a("details","event-accordion");r.append(i);let o=a("summary","event-summary");i.append(o);let s=a("span","event-summary-title");s.textContent=e.name,o.append(s);let c=q(e)??w(e),d=B(e)??c;o.append(l(a("span","event-summary-when"),d||t.notAvailable)),o.append(l(a("span","event-summary-updated"),je(e.updatedAt??W(e,"Updated"))??t.notAvailable));let u=a("div","event-details"),f=n.fields.has("image")&&!!e.image,p=e.description?.trim().length??0;!f&&p>0&&p<=180&&u.classList.add("event-details-compact"),i.append(u);let m=a("div","event-details-content"),b=a("div","event-details-main"),E=a("aside","event-details-aside");if(m.append(b,E),u.append(m),f){let g=Y(e,n.placeholderImage);g&&E.append(g)}let x=a("div","event-badges");n.fields.has("attendance")&&e.attendanceMode&&x.append(_(e.attendanceMode,t.attendance[e.attendanceMode])),n.fields.has("price")&&e.price&&x.append(l(a("span","price"),K(e.price,t))),x.children.length>0&&E.append(x),n.fields.has("description")&&e.description&&b.append(R(e.description));let h=a("dl","event-detail-list");n.fields.has("when")&&v(h,t.when,c),n.fields.has("location")&&U(h,t.location,j(e,t)),n.fields.has("organizer")&&v(h,t.organizer,e.organizerName),v(h,t.updated,S(e.updatedAt??W(e,"Updated"),void 0));for(let g of e.details??[])Ae.has(g.label)||v(h,g.label,g.value);if(h.children.length>0&&E.append(h),n.fields.has("tags")&&e.tags&&e.tags.length>0){let g=a("ul","tags");for(let Se of e.tags)g.append(l(a("li","tag"),Se));b.append(g)}return De(u,e,t,n),r}function pe(e,t){return e==="google-calendar"?t.addToGoogle:e==="outlook-calendar"?t.addToOutlook:e==="yahoo-calendar"?t.addToYahoo:e==="ics"?t.downloadIcs:t.openEventPage}var fe=new Set(["google-calendar","outlook-calendar","yahoo-calendar","ics"]);function ke(e,t){return!e.layouts||e.layouts.includes(t)}function Le(e,t){let n=e.placement??"detail";return n===t||n==="both"}function Xe(e,t){return e.eventActions.filter(n=>typeof n!="string"&&Le(n,t)&&ke(n,e.layout))}function ge(e,t,n,r,i){let o=Re(t,n,r);if(!o)return;let s=a("a");s.href=o,s.target=t==="ics"?"_self":"_blank",s.rel="noopener",t==="ics"&&s.setAttribute("download","event.ics"),t==="link"?s.append(V("external-link"),document.createTextNode(pe(t,r))):s.textContent=pe(t,r),s.addEventListener("click",()=>i.onEventAction?.(t,n)),e.append(s)}function De(e,t,n,r){let i=a("div","event-actions"),o=r.eventActions.filter(s=>typeof s=="string"&&fe.has(s));if(o.length>0){let s=a("details","event-action-menu"),c=a("summary","event-action-menu-trigger");c.append(V("calendar"),document.createTextNode(n.addToCalendar)),s.append(c);let d=a("div","event-action-menu-items");for(let u of o)ge(d,u,t,n,r);d.children.length>0&&(s.append(d),i.append(s))}for(let s of r.eventActions){if(typeof s=="string"){fe.has(s)||ge(i,s,t,n,r);continue}Le(s,"detail")&&ke(s,r.layout)&&i.append(Te(s,t,r))}i.children.length>0&&e.append(i)}function et(e,t,n){let r=Xe(n,"preview");if(r.length===0)return;let i=a("div","event-actions event-preview-actions");for(let o of r)i.append(Te(o,t,n));e.append(i)}function Te(e,t,n){let r=a("button");return r.type="button",r.classList.add("event-custom-action"),e.variant==="danger"&&r.classList.add("event-action-danger"),e.icon?r.append(V(e.icon),document.createTextNode(e.label)):r.textContent=e.label,r.addEventListener("click",()=>{n.onEventAction?.(e,t),e.onClick(t)}),r}function he(e,t,n){let r=a("div","event-modal-backdrop");r.tabIndex=-1,r.addEventListener("click",m=>{m.target===r&&n.onEventClose?.()}),r.addEventListener("keydown",m=>{m.key==="Escape"&&n.onEventClose?.()});let i=a("section","event-modal"),o=e.description?.trim().length??0;!e.image&&o>0&&o<=180&&i.classList.add("event-modal-compact"),i.setAttribute("role","dialog"),i.setAttribute("aria-modal","true"),i.setAttribute("aria-label",t.eventDetails),r.append(i);let s=a("div","event-modal-header");s.append(l(a("h2","event-modal-title"),e.name));let c=a("button","event-modal-close");c.type="button",c.textContent="\xD7",c.title=t.close,c.setAttribute("aria-label",t.close),c.addEventListener("click",()=>n.onEventClose?.()),s.append(c),i.append(s);let d=a("div","event-modal-content"),u=a("div","event-modal-main"),f=a("aside","event-modal-aside");if(d.append(u,f),i.append(d),e.image){let m=Y(e,n.placeholderImage);m&&f.append(m)}if(e.attendanceMode||e.price){let m=a("div","event-badges");e.attendanceMode&&m.append(_(e.attendanceMode,t.attendance[e.attendanceMode])),e.price&&m.append(l(a("span","price"),K(e.price,t))),f.append(m)}e.description&&u.append(R(e.description));let p=a("dl","event-detail-list");U(p,t.when,Be(e)),U(p,t.location,j(e,t)),v(p,t.organizer,e.organizerName),v(p,t.updated,S(e.updatedAt??W(e,"Updated"),void 0));for(let m of e.details??[])Ae.has(m.label)||v(p,m.label,m.value);if(p.children.length>0&&f.append(p),e.tags&&e.tags.length>0){let m=a("ul","tags");for(let b of e.tags)m.append(l(a("li","tag"),b));u.append(m)}return De(i,e,t,n),r}function Ce(e,t){e.replaceChildren();let n=Oe[t.lang];if(t.status==="idle"||t.status==="loading"){e.append(l(a("p","message"),n.loading));return}if(t.status==="error"){e.append(l(a("p","message error"),`${n.errorPrefix}${t.errorMessage}`));return}let r=J(t);if(r.length===0){e.append(l(a("p","message"),n.empty));return}if(t.layout==="calendar"){e.append(l(a("div","calendar-host"),n.loading)),t.selectedEvent&&e.append(he(t.selectedEvent,n,t));return}let i=a("ul",`events layout-${t.layout}`);if(t.layout==="list"){let o=a("li","event-list-header");o.append(l(a("span"),n.event),l(a("span"),n.when),Ze("icon-updated",n.lastUpdate)),i.append(o)}for(let o of r)i.append(t.layout==="list"?Qe(o,n,t):qe(o,t,n));e.append(i),t.selectedEvent&&e.append(he(t.selectedEvent,n,t))}var Pe=`
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
`;var Z=class extends HTMLElement{static observedAttributes=["feed","limit","theme","lang","show-past","layout","fields","placeholder-image","event-click","event-actions"];#d;#i;#a;#n;#r="idle";#o="";#s=0;#e;#l=[];#m;#c=0;#g=!1;constructor(){super();let t=this.attachShadow({mode:"open"});this.#d=document.createElement("style"),this.#d.textContent=Pe,this.#i=document.createElement("div"),this.#i.className="ote-events",t.append(this.#d,this.#i)}connectedCallback(){this.#n?this.#t():this.#u()}disconnectedCallback(){this.#f()}attributeChangedCallback(t){this.isConnected&&(t==="feed"?this.#u():this.#t())}get feedData(){return this.#n}set feedData(t){this.#p(t)}get events(){if(this.#n)return Array.isArray(this.#n)?this.#n:this.#n.events}set events(t){this.#p(t)}get event(){return this.events?.[0]}set event(t){this.#p(t==null?t:[t])}get eventActions(){return this.#l}set eventActions(t){this.#l=Array.isArray(t)?t:[],this.isConnected&&this.#t()}async#u(){if(this.#n)return;let t=this.getAttribute("feed");if(!t){this.#r="error",this.#o='Missing required "feed" attribute.',this.#e=void 0,this.#t();return}this.#r="loading",this.#t();let n=++this.#s;try{let r=await fetch(t);if(!r.ok)throw new Error(`HTTP ${r.status}`);let i=await r.text(),o=F(i);if(n!==this.#s)return;this.#a=o,this.#r="loaded",this.#e=void 0}catch(r){if(n!==this.#s)return;this.#r="error",this.#o=r instanceof Error?r.message:String(r),this.#e=void 0}this.#t()}#p(t){if(this.#s++,t==null){this.#n=void 0,this.#a=void 0,this.#o="",this.#e=void 0,this.isConnected&&this.#u();return}this.#n=t;try{this.#a=T(t),this.#r="loaded",this.#o="",this.#e=void 0}catch(n){this.#a=void 0,this.#r="error",this.#o=n instanceof Error?n.message:String(n),this.#e=void 0}this.isConnected&&this.#t()}#t(){let t=ie(re(this.getAttribute("lang")),navigator.language),n={status:this.#r,errorMessage:this.#o,feed:this.#a,lang:t,limit:ne(this.getAttribute("limit")),showPast:oe(this.getAttribute("show-past")),layout:ae(this.getAttribute("layout")),fields:se(this.getAttribute("fields")),placeholderImage:this.getAttribute("placeholder-image")?.trim()||void 0,eventClick:C(this.getAttribute("event-click")),eventActions:[...de(this.getAttribute("event-actions")),...this.#l],selectedEvent:this.#e,onEventOpen:r=>{this.dispatchEvent(new CustomEvent("ote-event-open",{detail:{event:r}})),C(this.getAttribute("event-click"))==="modal"&&(this.#e=r,this.#t())},onEventClose:()=>{this.#e=void 0,this.#t()},onEventAction:(r,i)=>{let o=typeof r=="string"?r:r.id;this.dispatchEvent(new CustomEvent("ote-event-action",{detail:{action:o,event:i}}))}};if(Ce(this.#i,n),n.layout==="calendar"&&n.status==="loaded"){let r=J(n);if(r.length>0){this.#h(r,n.lang);return}}this.#f()}async#h(t,n){this.#f();let r=++this.#c;try{let i=await import(new URL("./calendar-layout.js",import.meta.url).href);if(r!==this.#c||!this.isConnected)return;this.#g||(this.#d.textContent+=i.CALENDAR_CSS,this.#g=!0);let o=this.#i.querySelector(".calendar-host");if(!o)return;o.classList.remove("ec-dark","ec-auto-dark");let s=this.getAttribute("theme");s==="dark"?o.classList.add("ec-dark"):s!=="light"&&o.classList.add("ec-auto-dark"),o.replaceChildren(),this.#m=i.renderCalendar(o,t,{lang:n,onEventClick:c=>{let d=C(this.getAttribute("event-click"));this.dispatchEvent(new CustomEvent("ote-event-open",{detail:{event:c}})),d==="link"&&c.link?window.open(c.link,"_blank","noopener"):d==="modal"&&(this.#e=c,this.#t())}})}catch(i){if(r!==this.#c||!this.isConnected)return;let o=this.#i.querySelector(".calendar-host");o&&(o.textContent=i instanceof Error?i.message:String(i))}}#f(){this.#c++,this.#m?.destroy(),this.#m=void 0}};function Q(){customElements.get("ote-events")||customElements.define("ote-events",Z)}Q();export{Q as defineOteEvents};
//# sourceMappingURL=ote-events.js.map
