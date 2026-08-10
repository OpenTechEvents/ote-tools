function z(e,t=320){if(!e)return;let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function ae(e){if(Array.isArray(e))return e.length>0?e.join(", "):void 0;if(typeof e=="string")return e.trim()||void 0;if(typeof e=="number"||typeof e=="boolean")return String(e);if(e&&typeof e=="object")return JSON.stringify(e)}function W(e){return e.flatMap(([t,n])=>{let i=ae(n);return i?[{label:t,value:i}]:[]})}function L(e){if(!e)return null;let t=/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/.exec(e),i=(t?new Date(`${t[1]}T${t[2]??"00:00:00"}`):new Date(e)).valueOf();return Number.isNaN(i)?null:i}function H(e){let t=Date.now();return e.map((n,i)=>({event:n,index:i,sortDate:L(n.startDate)})).sort((n,i)=>{if(n.sortDate===null&&i.sortDate===null)return n.index-i.index;if(n.sortDate===null)return 1;if(i.sortDate===null)return-1;let r=n.sortDate<t,o=i.sortDate<t;return r!==o?r?1:-1:r?i.sortDate-n.sortDate:n.sortDate-i.sortDate}).map(({event:n})=>n)}function N(e){return e!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function U(e,t){let n=new Date(`${e}T00:00:00Z`);return n.setUTCDate(n.getUTCDate()+t),n.toISOString().slice(0,10)}function D(e,t){if(!e)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(e))return new Intl.DateTimeFormat(void 0,{dateStyle:"medium"}).format(new Date(`${e}T00:00:00Z`));let i=new Date(`${e}${t==="UTC"?"Z":""}`);if(!Number.isNaN(i.valueOf())){let r=new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short"}).format(i);return t?`${r} (${t})`:r}return t?`${e} (${t})`:e}function V(e){return e.location?.venue??S(e.location?.onlineUrl)??"online"}function S(e){if(!e)return;let t;try{t=new URL(e).hostname.toLowerCase().replace(/^www\./,"")}catch{return"Online event"}return t==="meet.google.com"?"Google Meet":t==="teams.microsoft.com"?"Microsoft Teams":t==="meet.jit.si"||t.endsWith(".jitsi.net")?"Jitsi Meet":t==="discord.gg"||t==="discord.com"?"Discord":t==="youtube.com"||t==="youtu.be"?"YouTube":t==="twitch.tv"?"Twitch":t==="lu.ma"?"Luma":t.endsWith(".zoom.us")||t==="zoom.us"?"Zoom":t.endsWith(".slack.com")||t==="slack.com"?"Slack":t.endsWith(".meetup.com")||t==="meetup.com"?"Meetup":t.endsWith(".eventbrite.com")||t==="eventbrite.com"?"Eventbrite":"Online event"}function y(e){return e.dateLabel??(e.endDate?`${D(e.startDate,e.timezone)} to ${D(e.endDate,e.timezone)}`:D(e.startDate,e.timezone))}function _(e){let t=e?.[0];if(t!==void 0)return typeof t=="string"?{url:t}:t}function B(e){let t=(e??[]).filter(i=>i.price!==void 0);if(t.length===0)return;let n=t.reduce((i,r)=>r.price<i.price?r:i);return{amount:n.price,currency:n.currency}}function M(e){let t=Array.isArray(e)?{events:e}:e;if(!Array.isArray(t.events))throw new Error("feed.json has no events array");return{title:t.title,description:t.description,license:t.license,events:t.events.map(n=>{let i=_(n.image),r=B(n.offers),o=n.organizers?.[0]?.name;return{name:n.name??"(untitled event)",startDate:n.startDate,endDate:n.endDate,timezone:n.timezone,location:V(n),locationLink:n.location?.onlineUrl,link:n.url??n.location?.onlineUrl,description:n.description,image:i,price:r,organizerName:o,tags:n.tags,attendanceMode:n.attendanceMode,updatedAt:n.updatedAt,details:W([["ID",n.id],["Status",n.status],["Timezone",n.timezone],["Attendance",n.attendanceMode],["Languages",n.languages],["Tags",n.tags],["Updated",n.updatedAt],["Source",n.source],["Image",i?.url],["Price",r&&`${r.amount}${r.currency?` ${r.currency}`:""}`],["Organizer",o]])}})}}var Ve=["image","when","location","attendance","description","price","tags","organizer"],de=["image","when","location","attendance","description"],se=["google-calendar","outlook-calendar","yahoo-calendar","ics","link"];function _e(e){return Ve.includes(e)}function ce(e){if(!e)return 1/0;let t=Number.parseInt(e,10);return Number.isFinite(t)&&t>0?t:1/0}function le(e){return e==="en"||e==="es"?e:"auto"}function ue(e,t){return e!=="auto"?e:t.toLowerCase().startsWith("es")?"es":"en"}function me(e){return e!=="false"}function fe(e){return e==="cards"?"cards":e==="list"?"list":"calendar"}function T(e){return e==="link"||e==="none"?e:"modal"}function pe(e){return e==="none"?"none":"auto"}function Be(e){return e==="google-calendar"||e==="outlook-calendar"||e==="yahoo-calendar"||e==="ics"||e==="link"}function ve(e){if(e==="none")return[];if(!e)return[...se];let t=e.split(",").map(n=>n.trim()).filter(Be);return t.length>0?[...new Set(t)]:[...se]}function ge(e){if(!e)return new Set(de);let t=e.split(",").map(n=>n.trim()).filter(_e);return t.length>0?new Set(t):new Set(de)}var je={en:{loading:"Loading events\u2026",empty:"No upcoming events.",errorPrefix:"Could not load events: ",online:"Online",onlineEvent:"Online event",free:"Free",updated:"Updated",event:"Event",when:"When",lastUpdate:"Last update",location:"Location",organizer:"Organizer",notAvailable:"\u2014",attendance:{"in-person":"In person",online:"Online",hybrid:"Hybrid"},close:"Close",eventDetails:"Event details",addToGoogle:"Add to Google Calendar",addToOutlook:"Add to Outlook",addToYahoo:"Add to Yahoo",downloadIcs:"Download ICS",addToCalendar:"Add to calendar",openEventPage:"Open event page"},es:{loading:"Cargando eventos\u2026",empty:"No hay pr\xF3ximos eventos.",errorPrefix:"No se pudieron cargar los eventos: ",online:"En l\xEDnea",onlineEvent:"Evento en l\xEDnea",free:"Gratis",updated:"Actualizado",event:"Evento",when:"Cu\xE1ndo",lastUpdate:"\xDAltima actualizaci\xF3n",location:"Lugar",organizer:"Organizador",notAvailable:"\u2014",attendance:{"in-person":"Presencial",online:"En l\xEDnea",hybrid:"H\xEDbrido"},close:"Cerrar",eventDetails:"Detalles del evento",addToGoogle:"A\xF1adir a Google Calendar",addToOutlook:"A\xF1adir a Outlook",addToYahoo:"A\xF1adir a Yahoo",downloadIcs:"Descargar ICS",addToCalendar:"A\xF1adir al calendario",openEventPage:"Abrir p\xE1gina del evento"}};function a(e,t){let n=document.createElement(e);return t&&(n.className=t),n}function l(e,t){return e.textContent=t,e}function Ae(e,t){let n=/(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_|`([^`]+)`)/g,i=0;for(let r of t.matchAll(n))if(r.index!==void 0){if(r.index>i&&e.append(document.createTextNode(t.slice(i,r.index))),r[2]&&r[3]){let o=a("a");o.href=r[3],o.target="_blank",o.rel="noopener",o.textContent=r[2],e.append(o)}else r[4]||r[5]?e.append(l(a("strong"),r[4]??r[5]??"")):r[6]||r[7]?e.append(l(a("em"),r[6]??r[7]??"")):r[8]&&e.append(l(a("code"),r[8]));i=r.index+r[0].length}i<t.length&&e.append(document.createTextNode(t.slice(i)))}function Ge(e){let t=a("p");return Ae(t,e),t}function J(e,t="event-description"){let n=a("div",t),i=e.replace(/\r\n?/g,`
`).split(`
`),r=[],o,c=()=>{let d=r.join(" ").trim();d&&n.append(Ge(d)),r=[]},s=()=>{o&&o.children.length>0&&n.append(o),o=void 0};for(let d of i){let m=d.trim();if(!m){c(),s();continue}let f=/^[-*]\s+(.+)$/.exec(m);if(f){c(),o??=a("ul");let p=a("li");Ae(p,f[1]??""),o.append(p);continue}s(),r.push(m.replace(/^#{1,6}\s+/,""))}return c(),s(),n}function ke(e,t){let n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("class",t),n.setAttribute("viewBox","0 0 24 24"),n.setAttribute("fill","none"),n.setAttribute("stroke","currentColor"),n.setAttribute("stroke-width","2"),n.setAttribute("stroke-linecap","round"),n.setAttribute("stroke-linejoin","round"),n.setAttribute("aria-hidden","true"),n.setAttribute("focusable","false");for(let i of e){let r=document.createElementNS("http://www.w3.org/2000/svg","path");r.setAttribute("d",i),n.append(r)}return n}function Je(e){return ke({online:["M15 10l4.6-2.3A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.4.9L15 14","M3 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2"],"in-person":["M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0","M12 10h.01"],hybrid:["M4 5h9a2 2 0 0 1 2 2v5H2V7a2 2 0 0 1 2-2","M8 19h4","M10 12v7","M18 21s4-3.2 4-6a4 4 0 0 0-8 0c0 2.8 4 6 4 6","M18 15h.01"]}[e],"badge-icon")}function A(e){return ke({calendar:["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],"external-link":["M15 3h6v6","M10 14 21 3","M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"],edit:["M12 20h9","M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],trash:["M3 6h18","M8 6V4h8v2","M19 6l-1 14H6L5 6","M10 11v6","M14 11v6"],copy:["M8 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2","M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"],star:["M12 2l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.77 5.82 21 7 14.13 2 9.26l6.91-1L12 2"],check:["M20 6 9 17l-5-5"],bookmark:["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],plus:["M12 5v14","M5 12h14"],folder:["M4 4h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],collection:["M4 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2","M8 2v4","M16 2v4","M7 10h10","M7 14h7"]}[e],"action-icon")}function K(e,t){let n=a("span",`badge attendance-badge attendance-${e}`);return n.append(Je(e),document.createTextNode(t)),n}function q(e,t){let n=Ce(e,t),i=e.locationLink??De(n),r=Y(e,t);if(!i)return l(a("span"),r);let o=a("a");return o.href=i,o.target="_blank",o.rel="noopener",o.textContent=r,o}function Ce(e,t){return e.location&&e.location!=="online"?e.location:t.online}function Y(e,t){let n=Ce(e,t),i=e.locationLink??De(n);return Ke(i?S(i):n,t)}function Ke(e,t){return!e||e==="online"?t.online:e==="Online link"||e==="Online event"?t.onlineEvent:e}function De(e){if(e)try{let t=new URL(e);return t.protocol==="http:"||t.protocol==="https:"?e:void 0}catch{return}}function qe(e){let t=L(e.startDate);return t!==null&&t<Date.now()}function Z(e){return e.feed?(e.sort==="none"?[...e.feed.events]:H(e.feed.events)).filter(n=>e.showPast||!qe(n)).slice(0,e.limit):[]}function Q(e,t){if(e.amount===0)return t.free;if(e.currency)try{return new Intl.NumberFormat(void 0,{style:"currency",currency:e.currency}).format(e.amount)}catch{return`${e.amount} ${e.currency}`}return String(e.amount)}function he(e,t){if(!e)return;let n=N(e),i=new Date(`${e}${t==="UTC"&&!n?"Z":""}`);return Number.isNaN(i.valueOf())?void 0:i}function P(e,t){let n=e.toISOString();return t?n.slice(0,10).replace(/-/g,""):n.replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z")}function Ye(e){let t=new Date(e);return t.setUTCDate(t.getUTCDate()+1),t}function Ze(e){let t=he(e.startDate,e.timezone);if(!t)return;let n=N(e.startDate),i=he(n&&e.endDate?U(e.endDate,1):e.endDate,e.timezone)??(n?Ye(t):t);return{start:t,end:i,dateOnly:n}}function Le(e){return e.description??""}function Qe(e,t,n){if(e==="link")return t.link;let i=Ze(t);if(!i)return;let r=P(i.start,i.dateOnly),o=P(i.end,i.dateOnly),c=Le(t),s=Y(t,n);if(e==="google-calendar"){let d=new URL("https://calendar.google.com/calendar/render");return d.searchParams.set("action","TEMPLATE"),d.searchParams.set("text",t.name),d.searchParams.set("dates",`${r}/${o}`),c&&d.searchParams.set("details",c),s&&d.searchParams.set("location",s),t.timezone&&d.searchParams.set("ctz",t.timezone),d.toString()}if(e==="outlook-calendar"){let d=new URL("https://outlook.live.com/calendar/0/action/compose");return d.searchParams.set("rru","addevent"),d.searchParams.set("subject",t.name),d.searchParams.set("startdt",i.start.toISOString()),d.searchParams.set("enddt",i.end.toISOString()),c&&d.searchParams.set("body",c),s&&d.searchParams.set("location",s),d.toString()}if(e==="yahoo-calendar"){let d=new URL("https://calendar.yahoo.com/");return d.searchParams.set("v","60"),d.searchParams.set("title",t.name),d.searchParams.set("st",r),d.searchParams.set("et",o),c&&d.searchParams.set("desc",c),s&&d.searchParams.set("in_loc",s),d.toString()}return`data:text/calendar;charset=utf-8,${encodeURIComponent(Xe(t,i,n))}`}function w(e){return e.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}function Xe(e,t,n){let i=d=>P(d,t.dateOnly),r=t.dateOnly?";VALUE=DATE":"",o=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//OpenTechEvents//ote-events//EN","BEGIN:VEVENT",`UID:${w(e.link??e.name)}`,`DTSTAMP:${P(new Date,!1)}`,`DTSTART${r}:${i(t.start)}`,`DTEND${r}:${i(t.end)}`,`SUMMARY:${w(e.name)}`],c=Le(e),s=Y(e,n);return c&&o.push(`DESCRIPTION:${w(c)}`),s&&o.push(`LOCATION:${w(s)}`),e.link&&o.push(`URL:${w(e.link)}`),o.push("END:VEVENT","END:VCALENDAR"),o.join(`\r
`)}function et(e){if(!e)return null;let n=new Date(e).valueOf();return Number.isNaN(n)?null:n}function tt(e){let t=et(e);if(t===null)return e;let n=Math.round((t-Date.now())/1e3),i=Math.abs(n),r=[["year",31536e3,"y"],["month",2592e3,"mo"],["week",604800,"w"],["day",86400,"d"],["hour",3600,"h"],["minute",60,"m"]];for(let[,o,c]of r)if(i>=o)return`${Math.max(1,Math.round(i/o))}${c}`;return"now"}function O(e,t){if(!e)return;let n=/^\d{4}-\d{2}-\d{2}$/.test(e),i=new Date(`${e}${t==="UTC"&&!n?"Z":""}`);if(Number.isNaN(i.valueOf()))return t?`${e} (${t})`:e;let r=n?{weekday:"short",month:"short",day:"numeric",year:"numeric"}:{weekday:"short",month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"},o=new Intl.DateTimeFormat(void 0,r).format(i);return t&&!n?`${o} (${t})`:o}function Ee(e){if(!e)return;let t=/^\d{4}-\d{2}-\d{2}$/.test(e),n=new Date(e);if(Number.isNaN(n.valueOf()))return e;let i=t?{month:"short",day:"numeric"}:{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"};return new Intl.DateTimeFormat(void 0,i).format(n)}function nt(e){if(!e)return;let t=new Date(e);return Number.isNaN(t.valueOf())?e:new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric"}).format(t)}function it(e,t){if(!e||!t)return!1;let n=new Date(e),i=new Date(t);return Number.isNaN(n.valueOf())||Number.isNaN(i.valueOf())?!1:n.getFullYear()===i.getFullYear()&&n.getMonth()===i.getMonth()&&n.getDate()===i.getDate()}function be(e){if(!e||/^\d{4}-\d{2}-\d{2}$/.test(e))return;let t=new Date(e);if(!Number.isNaN(t.valueOf()))return new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).format(t)}function X(e){let t=Ee(e.startDate),n=Ee(e.endDate);if(t&&e.endDate&&it(e.startDate,e.endDate)){let i=nt(e.startDate),r=be(e.startDate),o=be(e.endDate);if(i&&r&&o)return`${i}, ${r}-${o}`}return t&&n&&n!==t?`${t} \u2013 ${n}`:t??e.dateLabel}function ee(e){if(e.dateLabel)return e.dateLabel;let t=O(e.startDate,e.timezone),n=O(e.endDate,e.timezone);return t&&n?`${t} to ${n}`:t}function rt(e){let t=X(e),n=ee(e)??y(e),i=t??n;if(!i)return;let r=l(a("p","event-when"),i);return n&&n!==i&&(r.title=n,r.setAttribute("aria-label",n),r.tabIndex=0),r}function ot(e){let t=X(e),n=ee(e)??y(e),i=t??n;if(!i)return;let r=l(a("span","event-detail-when"),i);return n&&n!==i&&(r.title=n,r.setAttribute("aria-label",n),r.tabIndex=0),r}function te(e,t){if(!e.image)return;let n=a("img","event-image");return n.src=e.image.url,n.alt=e.image.alt??e.name,n.loading="lazy",n.addEventListener("error",()=>{n.replaceWith(Ne(t))}),n}function Ne(e){if(e){let t=a("img","event-image event-image-placeholder");return t.src=e,t.alt="",t.loading="lazy",t.addEventListener("error",()=>t.replaceWith(a("div","event-image event-image-placeholder"))),t}return a("div","event-image event-image-placeholder")}function at(e,t,n){let i=a("li","event");ne(i,e,t),dt(i,e,t),t.fields.has("image")&&i.append(te(e,t.placeholderImage)??Ne(t.placeholderImage));let r=a("div","event-body");i.append(r);let o=a("h3","event-title");if(e.link&&t.eventClick==="link"){let d=a("a");d.href=e.link,d.target="_blank",d.rel="noopener",d.textContent=e.name,o.append(d)}else o.textContent=e.name;if(r.append(o),t.fields.has("when")){let d=rt(e);d&&r.append(d)}let c=a("div","event-badges");t.fields.has("attendance")&&e.attendanceMode&&c.append(K(e.attendanceMode,n.attendance[e.attendanceMode])),t.fields.has("price")&&e.price&&c.append(l(a("span","price"),Q(e.price,n))),R(c,e,t);let s=a("div","event-meta");if(c.children.length>0&&s.append(c),t.fields.has("location")){let d=a("p","event-location");d.append(q(e,n)),s.append(d)}if(s.children.length>0&&r.append(s),t.fields.has("organizer")&&e.organizerName&&r.append(l(a("p","event-organizer"),e.organizerName)),t.fields.has("description")){let d=z(e.description,220);d&&r.append(J(d))}if(t.fields.has("tags")&&e.tags&&e.tags.length>0){let d=a("ul","tags");for(let m of e.tags)d.append(l(a("li","tag"),m));r.append(d)}return ft(r,e,n,t),i}function j(e,t){return e.details?.find(n=>n.label===t)?.value}var Se=new Set(["ID","Source","Image","Updated"]);function dt(e,t,n){n.eventClick!=="none"&&(e.classList.add("event-clickable"),e.tabIndex=0,e.addEventListener("click",i=>{let r=i.target;r instanceof Element&&r.closest("a, button, summary")||ye(t,n)}),e.addEventListener("keydown",i=>{i.key!=="Enter"&&i.key!==" "||(i.preventDefault(),ye(t,n))}))}function ye(e,t){t.onEventOpen?.(e),t.eventClick==="link"&&e.link&&window.open(e.link,"_blank","noopener")}function h(e,t,n){n&&e.append(l(a("dt"),t),l(a("dd"),n))}function G(e,t,n){if(!n)return;let i=a("dd");i.append(n),e.append(l(a("dt"),t),i)}function st(e,t){let n=a("span",`event-header-icon ${e}`);return n.title=t,n.setAttribute("aria-label",t),n}function ct(e,t,n){let i=a("li","event event-row");ne(i,e,n);let r=a("details","event-accordion");i.append(r);let o=a("summary","event-summary");r.append(o);let c=a("span","event-summary-title");c.textContent=e.name,o.append(c);let s=ee(e)??y(e),d=X(e)??s;o.append(l(a("span","event-summary-when"),d||t.notAvailable)),o.append(l(a("span","event-summary-updated"),tt(e.updatedAt??j(e,"Updated"))??t.notAvailable));let m=a("div","event-details"),f=n.fields.has("image")&&!!e.image,p=e.description?.trim().length??0;!f&&p>0&&p<=180&&m.classList.add("event-details-compact"),r.append(m);let u=a("div","event-details-content"),E=a("div","event-details-main"),C=a("aside","event-details-aside");if(u.append(E,C),m.append(u),f){let v=te(e,n.placeholderImage);v&&C.append(v)}let b=a("div","event-badges");n.fields.has("attendance")&&e.attendanceMode&&b.append(K(e.attendanceMode,t.attendance[e.attendanceMode])),n.fields.has("price")&&e.price&&b.append(l(a("span","price"),Q(e.price,t))),R(b,e,n),b.children.length>0&&C.append(b),n.fields.has("description")&&e.description&&E.append(J(e.description));let g=a("dl","event-detail-list");n.fields.has("when")&&h(g,t.when,s),n.fields.has("location")&&G(g,t.location,q(e,t)),n.fields.has("organizer")&&h(g,t.organizer,e.organizerName),h(g,t.updated,O(e.updatedAt??j(e,"Updated"),void 0));for(let v of e.details??[])Se.has(v.label)||h(g,v.label,v.value);if(g.children.length>0&&C.append(g),n.fields.has("tags")&&e.tags&&e.tags.length>0){let v=a("ul","tags");for(let Ue of e.tags)v.append(l(a("li","tag"),Ue));E.append(v)}return Ie(m,e,t,n),i}function we(e,t){return e==="google-calendar"?t.addToGoogle:e==="outlook-calendar"?t.addToOutlook:e==="yahoo-calendar"?t.addToYahoo:e==="ics"?t.downloadIcs:t.openEventPage}var I=new Set(["google-calendar","outlook-calendar","yahoo-calendar","ics"]);function lt(e){return typeof e!="string"&&"type"in e}function ut(e){return typeof e!="string"&&"id"in e}function x(e){return typeof e=="string"?e:e.type}function Me(e,t){return!e.layouts||e.layouts.includes(t)}function Te(e,t){let n=e.placement??"detail";return n===t||n==="both"}function mt(e,t,n){return typeof e=="string"?t==="detail":Te(e,t)&&Me(e,n)}function Pe(e,t,n){return Re(e,t).filter(i=>(typeof i=="string"||lt(i))&&mt(i,n,e.layout))}function Oe(e,t,n){return Re(e,t).filter(i=>ut(i)&&Te(i,n)&&Me(i,e.layout))}function F(e,t,n,i,r){let o=x(t),c=Qe(o,n,i);if(!c)return;let s=a("a");s.href=c,s.target=o==="ics"?"_self":"_blank",s.rel="noopener",o==="ics"&&s.setAttribute("download","event.ics"),o==="link"?s.append(A("external-link"),document.createTextNode(we(o,i))):s.textContent=we(o,i),s.addEventListener("click",()=>r.onEventAction?.(t,n)),e.append(s)}function Ie(e,t,n,i){let r=a("div","event-actions"),o=Pe(i,t,"detail"),c=o.filter(s=>I.has(x(s)));if(c.length>0){let s=a("details","event-action-menu"),d=a("summary","event-action-menu-trigger");d.append(A("calendar"),document.createTextNode(n.addToCalendar)),s.append(d);let m=a("div","event-action-menu-items");for(let f of c)F(m,f,t,n,i);m.children.length>0&&(s.append(m),r.append(s))}for(let s of o)I.has(x(s))||F(r,s,t,n,i);for(let s of Oe(i,t,"detail"))r.append(Fe(s,t,i));r.children.length>0&&e.append(r)}function ft(e,t,n,i){let r=Pe(i,t,"preview"),o=Oe(i,t,"preview");if(r.length===0&&o.length===0)return;let c=a("div","event-actions event-preview-actions"),s=r.filter(d=>I.has(x(d)));if(s.length>0){let d=a("details","event-action-menu"),m=a("summary","event-action-menu-trigger");m.append(A("calendar"),document.createTextNode(n.addToCalendar)),d.append(m);let f=a("div","event-action-menu-items");for(let p of s)F(f,p,t,n,i);f.children.length>0&&(d.append(f),c.append(d))}for(let d of r)I.has(x(d))||F(c,d,t,n,i);for(let d of o)c.append(Fe(d,t,i));e.append(c)}function Fe(e,t,n){let i=a("button");return i.type="button",i.classList.add("event-custom-action"),e.variant==="danger"&&i.classList.add("event-action-danger"),e.pressed!==void 0&&i.setAttribute("aria-pressed",String(e.pressed)),e.icon?i.append(A(e.icon),document.createTextNode(e.label)):i.textContent=e.label,i.addEventListener("click",()=>{n.onEventAction?.(e,t),e.onClick(t,$(n,t))}),i}function $(e,t){return e.eventContext?.(t)??{previewEvent:t,index:e.feed?.events.indexOf(t)??-1}}function Re(e,t){return typeof e.eventActions=="function"?e.eventActions($(e,t)):e.eventActions}function pt(e){return e?(Array.isArray(e)?e:e.split(/\s+/)).map(n=>n.trim()).filter(Boolean):[]}function ne(e,t,n){for(let i of pt(n.eventClassName?.($(n,t))))e.classList.add(i)}function R(e,t,n){let i=n.eventBadges?.($(n,t))??[];for(let r of i){if(typeof r=="string"){e.append(l(a("span","badge event-custom-badge"),r));continue}let o=a("span",`badge event-custom-badge event-custom-badge-${r.tone??"default"}`);r.title&&(o.title=r.title),r.icon&&o.append(A(r.icon)),o.append(document.createTextNode(r.label)),e.append(o)}}function xe(e,t,n){let i=a("div","event-modal-backdrop");i.tabIndex=-1,i.addEventListener("click",u=>{u.target===i&&n.onEventClose?.()}),i.addEventListener("keydown",u=>{u.key==="Escape"&&n.onEventClose?.()});let r=a("section","event-modal");ne(r,e,n);let o=e.description?.trim().length??0;!e.image&&o>0&&o<=180&&r.classList.add("event-modal-compact"),r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.setAttribute("aria-label",t.eventDetails),i.append(r);let c=a("div","event-modal-header");c.append(l(a("h2","event-modal-title"),e.name));let s=a("button","event-modal-close");s.type="button",s.textContent="\xD7",s.title=t.close,s.setAttribute("aria-label",t.close),s.addEventListener("click",()=>n.onEventClose?.()),c.append(s),r.append(c);let d=a("div","event-modal-content"),m=a("div","event-modal-main"),f=a("aside","event-modal-aside");if(d.append(m,f),r.append(d),e.image){let u=te(e,n.placeholderImage);u&&f.append(u)}if(e.attendanceMode||e.price){let u=a("div","event-badges");e.attendanceMode&&u.append(K(e.attendanceMode,t.attendance[e.attendanceMode])),e.price&&u.append(l(a("span","price"),Q(e.price,t))),R(u,e,n),f.append(u)}else{let u=a("div","event-badges");R(u,e,n),u.children.length>0&&f.append(u)}e.description&&m.append(J(e.description));let p=a("dl","event-detail-list");G(p,t.when,ot(e)),G(p,t.location,q(e,t)),h(p,t.organizer,e.organizerName),h(p,t.updated,O(e.updatedAt??j(e,"Updated"),void 0));for(let u of e.details??[])Se.has(u.label)||h(p,u.label,u.value);if(p.children.length>0&&f.append(p),e.tags&&e.tags.length>0){let u=a("ul","tags");for(let E of e.tags)u.append(l(a("li","tag"),E));m.append(u)}return Ie(r,e,t,n),i}function $e(e,t){e.replaceChildren();let n=je[t.lang];if(t.status==="idle"||t.status==="loading"){e.append(l(a("p","message"),n.loading));return}if(t.status==="error"){e.append(l(a("p","message error"),`${n.errorPrefix}${t.errorMessage}`));return}let i=Z(t);if(i.length===0){e.append(l(a("p","message"),t.emptyMessage??n.empty));return}if(t.layout==="calendar"){e.append(l(a("div","calendar-host"),n.loading)),t.selectedEvent&&e.append(xe(t.selectedEvent,n,t));return}let r=a("ul",`events layout-${t.layout}`);if(t.layout==="list"){let o=a("li","event-list-header");o.append(l(a("span"),n.event),l(a("span"),n.when),st("icon-updated",n.lastUpdate)),r.append(o)}for(let o of i)r.append(t.layout==="list"?ct(o,n,t):at(o,t,n));e.append(r),t.selectedEvent&&e.append(xe(t.selectedEvent,n,t))}var ze=`
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

.event-actions [aria-pressed="true"] {
  border-color: var(--ote-accent);
  background: var(--ote-accent);
  color: var(--ote-surface);
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

.event-custom-badge-success {
  color: #157347;
}

.event-custom-badge-warning {
  color: #8a5a00;
}

.event-custom-badge-danger {
  background: var(--ote-error-bg);
  color: var(--ote-error);
}

.event-custom-badge .action-icon {
  width: 1em;
  height: 1em;
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
`;var ie=class extends HTMLElement{static observedAttributes=["feed","limit","theme","lang","show-past","layout","fields","placeholder-image","event-click","event-actions","sort","empty-message"];#u;#r;#o;#n;#l=!1;#a=[];#d;#s=new WeakMap;#i="idle";#c="";#m=0;#t;#p=[];#v;#g;#h;#f=0;#x=!1;constructor(){super();let t=this.attachShadow({mode:"open"});this.#u=document.createElement("style"),this.#u.textContent=ze,this.#r=document.createElement("div"),this.#r.className="ote-events",t.append(this.#u,this.#r)}connectedCallback(){this.#l?this.#e():this.#E()}disconnectedCallback(){this.#w()}attributeChangedCallback(t){this.isConnected&&(t==="feed"?this.#E():this.#e())}get feedData(){return this.#n}set feedData(t){this.#b(t)}get events(){if(this.#n)return Array.isArray(this.#n)?this.#n:this.#n.events}set events(t){this.#b(t)}get event(){return this.events?.[0]}set event(t){this.#b(t==null?t:[t])}get eventActions(){return this.#p}set eventActions(t){this.#p=Array.isArray(t)||typeof t=="function"?t:[],this.isConnected&&this.#e()}get eventClassName(){return this.#v}set eventClassName(t){this.#v=typeof t=="function"?t:void 0,this.isConnected&&this.#e()}get eventBadges(){return this.#g}set eventBadges(t){this.#g=typeof t=="function"?t:void 0,this.isConnected&&this.#e()}async#E(){if(this.#l)return;let t=this.getAttribute("feed");if(!t){this.#i="error",this.#c='Missing required "feed" attribute.',this.#t=void 0,this.#e();return}this.#i="loading",this.#e();let n=++this.#m;try{let i=await fetch(t);if(!i.ok)throw new Error(`HTTP ${i.status}`);let r=await i.text(),o=JSON.parse(r),c=M(o);if(n!==this.#m)return;this.#o=c,this.#n=o,this.#l=!1,this.#a=re(o),this.#d=We(o,t),this.#s=He(c,this.#a,this.#d),this.#i="loaded",this.#t=void 0}catch(i){if(n!==this.#m)return;this.#i="error",this.#c=i instanceof Error?i.message:String(i),this.#t=void 0}this.#e()}#b(t){if(this.#m++,t==null){this.#n=void 0,this.#l=!1,this.#o=void 0,this.#a=[],this.#d=void 0,this.#s=new WeakMap,this.#c="",this.#t=void 0,this.isConnected&&this.#E();return}this.#n=t,this.#l=!0;try{this.#o=M(t),this.#a=re(t),this.#d=We(t),this.#s=He(this.#o,this.#a,this.#d),this.#i="loaded",this.#c="",this.#t=void 0}catch(n){this.#o=void 0,this.#a=[],this.#d=void 0,this.#s=new WeakMap,this.#i="error",this.#c=n instanceof Error?n.message:String(n),this.#t=void 0}this.isConnected&&this.#e()}#e(){let t=ue(le(this.getAttribute("lang")),navigator.language),n={status:this.#i,errorMessage:this.#c,feed:this.#o,lang:t,limit:ce(this.getAttribute("limit")),showPast:me(this.getAttribute("show-past")),sort:pe(this.getAttribute("sort")),layout:fe(this.getAttribute("layout")),fields:ge(this.getAttribute("fields")),placeholderImage:this.getAttribute("placeholder-image")?.trim()||void 0,emptyMessage:this.getAttribute("empty-message")?.trim()||void 0,eventClick:T(this.getAttribute("event-click")),eventActions:this.#k(),eventClassName:this.#v,eventBadges:this.#g,eventContext:i=>this.#s.get(i)??{previewEvent:i,index:-1},selectedEvent:this.#t,onEventOpen:i=>{this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#y(void 0,i)})),T(this.getAttribute("event-click"))==="modal"&&(this.#t=i,this.#e())},onEventClose:()=>{this.#t=void 0,this.#e()},onEventAction:(i,r)=>{let o=typeof i=="string"?i:"type"in i?i.type:i.id;this.dispatchEvent(new CustomEvent("ote-event-action",{detail:this.#y(o,r)}))}};if($e(this.#r,n),n.layout==="calendar"&&n.status==="loaded"){let i=Z(n);if(i.length>0){this.#A(i,n.lang);return}}this.#w()}async#A(t,n){this.#w();let i=++this.#f;try{let r=await import(new URL("./calendar-layout.js",import.meta.url).href);if(i!==this.#f||!this.isConnected)return;this.#x||(this.#u.textContent+=r.CALENDAR_CSS,this.#x=!0);let o=this.#r.querySelector(".calendar-host");if(!o)return;o.classList.remove("ec-dark","ec-auto-dark");let c=this.getAttribute("theme");c==="dark"?o.classList.add("ec-dark"):c!=="light"&&o.classList.add("ec-auto-dark"),o.replaceChildren(),this.#h=r.renderCalendar(o,t,{lang:n,onEventClick:s=>{let d=T(this.getAttribute("event-click"));this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#y(void 0,s)})),d==="link"&&s.link?window.open(s.link,"_blank","noopener"):d==="modal"&&(this.#t=s,this.#e())}})}catch(r){if(i!==this.#f||!this.isConnected)return;let o=this.#r.querySelector(".calendar-host");o&&(o.textContent=r instanceof Error?r.message:String(r))}}#k(){let t=ve(this.getAttribute("event-actions")),n=this.#p;return typeof n=="function"?i=>[...t,...n(i)]:[...t,...n]}#y(t,n){let i=this.#s.get(n)??{previewEvent:n,index:-1};return{...t?{action:t}:{},event:n,previewEvent:n,originalEvent:i.originalEvent,index:i.index,feed:i.feed,source:i.source}}#w(){this.#f++,this.#h?.destroy(),this.#h=void 0}};function re(e){return Array.isArray(e)?e:Array.isArray(e.events)?e.events:[]}function k(e){return typeof e=="string"&&e.trim()?e:void 0}function We(e,t){let n=re(e)[0],i=Array.isArray(e)?void 0:k(e.title??e._feedTitle),r={url:t??k(n?._feedUrl),title:i??k(n?._feedTitle)};return r.url||r.title?r:void 0}function He(e,t,n){let i=new WeakMap;return e.events.forEach((r,o)=>{let c=t[o],s={url:k(c?._feedUrl)??n?.url,title:k(c?._feedTitle)??n?.title};i.set(r,{previewEvent:r,originalEvent:c,index:o,feed:s.url||s.title?s:n,source:c?.source})}),i}function oe(){customElements.get("ote-events")||customElements.define("ote-events",ie)}oe();export{oe as defineOteEvents};
//# sourceMappingURL=ote-events.js.map
