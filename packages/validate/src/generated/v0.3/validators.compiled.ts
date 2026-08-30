// GENERATED FILE — DO NOT EDIT.
// Standalone validator code for the OTE Spec 0.3.0 schemas, compiled from
// @opentechevents/schema by Ajv at codegen time — see
// scripts/compile-validators.mjs for why this is precompiled rather than
// compiled at runtime (short version: no `new Function`, so no
// 'unsafe-eval' in the CSP of any page that runs it).
// Regenerate with: pnpm gen
// A guard test (test/compiled-validators.test.ts) fails if this drifts.
// @ts-nocheck -- machine-generated JavaScript, not authored/typed here.

import equalRuntimeModule from "ajv/dist/runtime/equal.js";
import ucs2lengthRuntimeModule from "ajv/dist/runtime/ucs2length.js";
import { formats, keywords } from "../../compiled-scope.js";
const equalRuntime = equalRuntimeModule.default ?? equalRuntimeModule;
const ucs2lengthRuntime = ucs2lengthRuntimeModule.default ?? ucs2lengthRuntimeModule;

export const validateEvent = validate21;
const schema32 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://opentechevents.org/schema/v0.3/event.schema.json","title":"OTE Event","description":"A single tech community event. See https://opentechevents.org for the normative prose.","allOf":[{"$ref":"#/$defs/event"},{"type":"object","description":"A standalone event document must carry its own specVersion and license. Inside a feed, both are inherited from the feed.","required":["specVersion","license"]},{"description":"A map of translations is unusable without knowing which language the primary text is in: a consumer cannot tell which entry duplicates it, nor what it is falling back to. So ANY translations map in the document — the event's own, or one inside image, offers, eligibility or partOf — requires textLanguage. It is the one place where a field of this spec depends on another being present, and it holds at every depth because the primary language is a property of the whole document, not of each object. A standalone document has no feed to inherit textLanguage from, so it must always carry its own; inside a feed, the same requirement is enforced against the effective (possibly inherited) language — see feed.schema.json.","if":{"type":"object","anyOf":[{"required":["translations"]},{"required":["eligibility"],"properties":{"eligibility":{"required":["translations"],"type":"object"}}},{"required":["partOf"],"properties":{"partOf":{"required":["translations"],"type":"object"}}},{"required":["offers"],"properties":{"offers":{"contains":{"required":["translations"],"type":"object"},"type":"array"}}},{"required":["image"],"properties":{"image":{"contains":{"required":["translations"],"type":"object"},"type":"array"}}}]},"then":{"type":"object","required":["textLanguage"]}}],"$defs":{"event":{"type":"object","required":["id","name","startDate","timezone"],"properties":{"specVersion":{"description":"Version of OTE Spec this document adheres to.","x-inheritsFrom":"feed.specVersion","const":"0.3.0","examples":["0.3.0"]},"id":{"description":"Stable, globally unique identifier: an HTTP(S) URL under a domain the publisher controls — not necessarily one they own; a canonical page on a platform they use (Meetup, GitHub Pages, LinkedIn) works exactly as well, since what matters is that the URL is stable and nobody else can end up with that same one. Minted once, never rewritten — this is what lets consumers update an event instead of duplicating it.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://pyalmeria.example/eventos/2026-06-async","https://calendar.example/ics/rust-madrid#a1b2c3d4-uid","https://www.meetup.com/pyalmeria/events/123456789/"]},"url":{"description":"Canonical URL where the event is described today. May change over time; id may not.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://pyalmeria.example/eventos/2026-06-async"]},"name":{"description":"Display name of the event.","type":"string","minLength":1,"pattern":"\\S","examples":["PyAlmería — Introducción a async/await"]},"description":{"description":"Short description. Plain text or Markdown.","type":"string","examples":["Charla introductoria a la programación asíncrona en Python, con ejemplos en vivo."]},"image":{"description":"Promotional images of the event: poster, cover, card. A list in preference order — the FIRST is the primary one, and often the only one a destination can use. The rest may be other crops or resolutions of that same image (Google asks for 1:1, 4:3 and 16:9) or different images altogether; a consumer that can show only one shows the first, and none may assume the list renders as a photo gallery. An entry is either a bare https URL to the image file itself — never to a page showing it — or an object that adds alt text.","$ref":"#/$defs/images","examples":[["https://rustmadrid.example/img/2026-06-16x9.png"],[{"url":"https://rustmadrid.example/img/2026-06-16x9.png","alt":"Cartel: Ferris sobre fondo morado, «Rust Madrid · 16 junio · Impact Hub»"},"https://rustmadrid.example/img/2026-06-1x1.png","https://rustmadrid.example/img/2026-06-4x3.png"]]},"organizers":{"description":"Who runs the event — not where the data came from (that is source). A list: co-organised events are the norm, not the exception. Declaring it REPLACES the inherited list, it does not add to it.","x-inheritsFrom":"feed.organizers","$ref":"#/$defs/organizers","examples":[[{"name":"PyAlmería","url":"https://pyalmeria.example"}],[{"name":"GDG Madrid","url":"https://gdgmadrid.example"},{"type":"person","name":"Ada Lovelace","url":"https://ada.example"}]]},"startDate":{"description":"Wall-clock start: a date (2026-10-15) for all-day events, or a local date-time (2026-10-15T09:00), never with seconds. Never carries a UTC offset — timezone does that. Which of the two forms you pick is not this field's decision alone: it has to match endDate's, and endDate (if present) must not be earlier — see the document's constraints.","$ref":"#/$defs/wallClock","examples":["2026-06-11T18:30","2026-10-15"]},"endDate":{"description":"Wall-clock end, in the SAME form as startDate (both dates, or both date-times) and never earlier than it. If absent, the event is assumed to end on the day it starts. For an all-day event (date form, no time), endDate is INCLUSIVE — it names the last day the event runs, not the day after. Converting to iCalendar needs +1 day for DTEND;VALUE=DATE (RFC 5545 defines it as the non-inclusive end); importing needs -1 day back. Both rules belong to the document, not to this field — see the document's constraints.","$ref":"#/$defs/wallClock","examples":["2026-06-11T20:00","2026-10-16"]},"timezone":{"description":"A real IANA timezone identifier (e.g. Europe/Madrid) — canonical name or historical alias, never an invented or malformed one. Turns a wall-clock startDate into an unambiguous instant. For all-day events it contextualises the date — it does not shift it. On the two nights a year local time is ambiguous (a repeated hour) or impossible (a skipped hour) because of a DST transition, resolve exactly as RFC 5545 §3.3.5 does: a repeated local time means its FIRST occurrence; a skipped local time is read using the UTC offset that was in effect BEFORE the transition.","type":"string","enum":["Africa/Abidjan","Africa/Accra","Africa/Addis_Ababa","Africa/Algiers","Africa/Asmara","Africa/Asmera","Africa/Bamako","Africa/Bangui","Africa/Banjul","Africa/Bissau","Africa/Blantyre","Africa/Brazzaville","Africa/Bujumbura","Africa/Cairo","Africa/Casablanca","Africa/Ceuta","Africa/Conakry","Africa/Dakar","Africa/Dar_es_Salaam","Africa/Djibouti","Africa/Douala","Africa/El_Aaiun","Africa/Freetown","Africa/Gaborone","Africa/Harare","Africa/Johannesburg","Africa/Juba","Africa/Kampala","Africa/Khartoum","Africa/Kigali","Africa/Kinshasa","Africa/Lagos","Africa/Libreville","Africa/Lome","Africa/Luanda","Africa/Lubumbashi","Africa/Lusaka","Africa/Malabo","Africa/Maputo","Africa/Maseru","Africa/Mbabane","Africa/Mogadishu","Africa/Monrovia","Africa/Nairobi","Africa/Ndjamena","Africa/Niamey","Africa/Nouakchott","Africa/Ouagadougou","Africa/Porto-Novo","Africa/Sao_Tome","Africa/Timbuktu","Africa/Tripoli","Africa/Tunis","Africa/Windhoek","America/Adak","America/Anchorage","America/Anguilla","America/Antigua","America/Araguaina","America/Argentina/Buenos_Aires","America/Argentina/Catamarca","America/Argentina/ComodRivadavia","America/Argentina/Cordoba","America/Argentina/Jujuy","America/Argentina/La_Rioja","America/Argentina/Mendoza","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan","America/Argentina/San_Luis","America/Argentina/Tucuman","America/Argentina/Ushuaia","America/Aruba","America/Asuncion","America/Atikokan","America/Atka","America/Bahia","America/Bahia_Banderas","America/Barbados","America/Belem","America/Belize","America/Blanc-Sablon","America/Boa_Vista","America/Bogota","America/Boise","America/Buenos_Aires","America/Cambridge_Bay","America/Campo_Grande","America/Cancun","America/Caracas","America/Catamarca","America/Cayenne","America/Cayman","America/Chicago","America/Chihuahua","America/Ciudad_Juarez","America/Coral_Harbour","America/Cordoba","America/Costa_Rica","America/Coyhaique","America/Creston","America/Cuiaba","America/Curacao","America/Danmarkshavn","America/Dawson","America/Dawson_Creek","America/Denver","America/Detroit","America/Dominica","America/Edmonton","America/Eirunepe","America/El_Salvador","America/Ensenada","America/Fort_Nelson","America/Fort_Wayne","America/Fortaleza","America/Glace_Bay","America/Godthab","America/Goose_Bay","America/Grand_Turk","America/Grenada","America/Guadeloupe","America/Guatemala","America/Guayaquil","America/Guyana","America/Halifax","America/Havana","America/Hermosillo","America/Indiana/Indianapolis","America/Indiana/Knox","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Tell_City","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Indianapolis","America/Inuvik","America/Iqaluit","America/Jamaica","America/Jujuy","America/Juneau","America/Kentucky/Louisville","America/Kentucky/Monticello","America/Knox_IN","America/Kralendijk","America/La_Paz","America/Lima","America/Los_Angeles","America/Louisville","America/Lower_Princes","America/Maceio","America/Managua","America/Manaus","America/Marigot","America/Martinique","America/Matamoros","America/Mazatlan","America/Mendoza","America/Menominee","America/Merida","America/Metlakatla","America/Mexico_City","America/Miquelon","America/Moncton","America/Monterrey","America/Montevideo","America/Montreal","America/Montserrat","America/Nassau","America/New_York","America/Nipigon","America/Nome","America/Noronha","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Nuuk","America/Ojinaga","America/Panama","America/Pangnirtung","America/Paramaribo","America/Phoenix","America/Port_of_Spain","America/Port-au-Prince","America/Porto_Acre","America/Porto_Velho","America/Puerto_Rico","America/Punta_Arenas","America/Rainy_River","America/Rankin_Inlet","America/Recife","America/Regina","America/Resolute","America/Rio_Branco","America/Rosario","America/Santa_Isabel","America/Santarem","America/Santiago","America/Santo_Domingo","America/Sao_Paulo","America/Scoresbysund","America/Shiprock","America/Sitka","America/St_Barthelemy","America/St_Johns","America/St_Kitts","America/St_Lucia","America/St_Thomas","America/St_Vincent","America/Swift_Current","America/Tegucigalpa","America/Thule","America/Thunder_Bay","America/Tijuana","America/Toronto","America/Tortola","America/Vancouver","America/Virgin","America/Whitehorse","America/Winnipeg","America/Yakutat","America/Yellowknife","Antarctica/Casey","Antarctica/Davis","Antarctica/DumontDUrville","Antarctica/Macquarie","Antarctica/Mawson","Antarctica/McMurdo","Antarctica/Palmer","Antarctica/Rothera","Antarctica/South_Pole","Antarctica/Syowa","Antarctica/Troll","Antarctica/Vostok","Arctic/Longyearbyen","Asia/Aden","Asia/Almaty","Asia/Amman","Asia/Anadyr","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Ashkhabad","Asia/Atyrau","Asia/Baghdad","Asia/Bahrain","Asia/Baku","Asia/Bangkok","Asia/Barnaul","Asia/Beirut","Asia/Bishkek","Asia/Brunei","Asia/Calcutta","Asia/Chita","Asia/Choibalsan","Asia/Chongqing","Asia/Chungking","Asia/Colombo","Asia/Dacca","Asia/Damascus","Asia/Dhaka","Asia/Dili","Asia/Dubai","Asia/Dushanbe","Asia/Famagusta","Asia/Gaza","Asia/Harbin","Asia/Hebron","Asia/Ho_Chi_Minh","Asia/Hong_Kong","Asia/Hovd","Asia/Irkutsk","Asia/Istanbul","Asia/Jakarta","Asia/Jayapura","Asia/Jerusalem","Asia/Kabul","Asia/Kamchatka","Asia/Karachi","Asia/Kashgar","Asia/Kathmandu","Asia/Katmandu","Asia/Khandyga","Asia/Kolkata","Asia/Krasnoyarsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Kuwait","Asia/Macao","Asia/Macau","Asia/Magadan","Asia/Makassar","Asia/Manila","Asia/Muscat","Asia/Nicosia","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Omsk","Asia/Oral","Asia/Phnom_Penh","Asia/Pontianak","Asia/Pyongyang","Asia/Qatar","Asia/Qostanay","Asia/Qyzylorda","Asia/Rangoon","Asia/Riyadh","Asia/Saigon","Asia/Sakhalin","Asia/Samarkand","Asia/Seoul","Asia/Shanghai","Asia/Singapore","Asia/Srednekolymsk","Asia/Taipei","Asia/Tashkent","Asia/Tbilisi","Asia/Tehran","Asia/Tel_Aviv","Asia/Thimbu","Asia/Thimphu","Asia/Tokyo","Asia/Tomsk","Asia/Ujung_Pandang","Asia/Ulaanbaatar","Asia/Ulan_Bator","Asia/Urumqi","Asia/Ust-Nera","Asia/Vientiane","Asia/Vladivostok","Asia/Yakutsk","Asia/Yangon","Asia/Yekaterinburg","Asia/Yerevan","Atlantic/Azores","Atlantic/Bermuda","Atlantic/Canary","Atlantic/Cape_Verde","Atlantic/Faeroe","Atlantic/Faroe","Atlantic/Jan_Mayen","Atlantic/Madeira","Atlantic/Reykjavik","Atlantic/South_Georgia","Atlantic/St_Helena","Atlantic/Stanley","Australia/ACT","Australia/Adelaide","Australia/Brisbane","Australia/Broken_Hill","Australia/Canberra","Australia/Currie","Australia/Darwin","Australia/Eucla","Australia/Hobart","Australia/LHI","Australia/Lindeman","Australia/Lord_Howe","Australia/Melbourne","Australia/North","Australia/NSW","Australia/Perth","Australia/Queensland","Australia/South","Australia/Sydney","Australia/Tasmania","Australia/Victoria","Australia/West","Australia/Yancowinna","Brazil/Acre","Brazil/DeNoronha","Brazil/East","Brazil/West","Canada/Atlantic","Canada/Central","Canada/Eastern","Canada/Mountain","Canada/Newfoundland","Canada/Pacific","Canada/Saskatchewan","Canada/Yukon","CET","Chile/Continental","Chile/EasterIsland","CST6CDT","Cuba","EET","Egypt","Eire","EST","EST5EDT","Etc/GMT","Etc/GMT-0","Etc/GMT-1","Etc/GMT-10","Etc/GMT-11","Etc/GMT-12","Etc/GMT-13","Etc/GMT-14","Etc/GMT-2","Etc/GMT-3","Etc/GMT-4","Etc/GMT-5","Etc/GMT-6","Etc/GMT-7","Etc/GMT-8","Etc/GMT-9","Etc/GMT+0","Etc/GMT+1","Etc/GMT+10","Etc/GMT+11","Etc/GMT+12","Etc/GMT+2","Etc/GMT+3","Etc/GMT+4","Etc/GMT+5","Etc/GMT+6","Etc/GMT+7","Etc/GMT+8","Etc/GMT+9","Etc/GMT0","Etc/Greenwich","Etc/UCT","Etc/Universal","Etc/UTC","Etc/Zulu","Europe/Amsterdam","Europe/Andorra","Europe/Astrakhan","Europe/Athens","Europe/Belfast","Europe/Belgrade","Europe/Berlin","Europe/Bratislava","Europe/Brussels","Europe/Bucharest","Europe/Budapest","Europe/Busingen","Europe/Chisinau","Europe/Copenhagen","Europe/Dublin","Europe/Gibraltar","Europe/Guernsey","Europe/Helsinki","Europe/Isle_of_Man","Europe/Istanbul","Europe/Jersey","Europe/Kaliningrad","Europe/Kiev","Europe/Kirov","Europe/Kyiv","Europe/Lisbon","Europe/Ljubljana","Europe/London","Europe/Luxembourg","Europe/Madrid","Europe/Malta","Europe/Mariehamn","Europe/Minsk","Europe/Monaco","Europe/Moscow","Europe/Nicosia","Europe/Oslo","Europe/Paris","Europe/Podgorica","Europe/Prague","Europe/Riga","Europe/Rome","Europe/Samara","Europe/San_Marino","Europe/Sarajevo","Europe/Saratov","Europe/Simferopol","Europe/Skopje","Europe/Sofia","Europe/Stockholm","Europe/Tallinn","Europe/Tirane","Europe/Tiraspol","Europe/Ulyanovsk","Europe/Uzhgorod","Europe/Vaduz","Europe/Vatican","Europe/Vienna","Europe/Vilnius","Europe/Volgograd","Europe/Warsaw","Europe/Zagreb","Europe/Zaporozhye","Europe/Zurich","GB","GB-Eire","GMT","GMT-0","GMT+0","GMT0","Greenwich","Hongkong","HST","Iceland","Indian/Antananarivo","Indian/Chagos","Indian/Christmas","Indian/Cocos","Indian/Comoro","Indian/Kerguelen","Indian/Mahe","Indian/Maldives","Indian/Mauritius","Indian/Mayotte","Indian/Reunion","Iran","Israel","Jamaica","Japan","Kwajalein","Libya","MET","Mexico/BajaNorte","Mexico/BajaSur","Mexico/General","MST","MST7MDT","Navajo","NZ","NZ-CHAT","Pacific/Apia","Pacific/Auckland","Pacific/Bougainville","Pacific/Chatham","Pacific/Chuuk","Pacific/Easter","Pacific/Efate","Pacific/Enderbury","Pacific/Fakaofo","Pacific/Fiji","Pacific/Funafuti","Pacific/Galapagos","Pacific/Gambier","Pacific/Guadalcanal","Pacific/Guam","Pacific/Honolulu","Pacific/Johnston","Pacific/Kanton","Pacific/Kiritimati","Pacific/Kosrae","Pacific/Kwajalein","Pacific/Majuro","Pacific/Marquesas","Pacific/Midway","Pacific/Nauru","Pacific/Niue","Pacific/Norfolk","Pacific/Noumea","Pacific/Pago_Pago","Pacific/Palau","Pacific/Pitcairn","Pacific/Pohnpei","Pacific/Ponape","Pacific/Port_Moresby","Pacific/Rarotonga","Pacific/Saipan","Pacific/Samoa","Pacific/Tahiti","Pacific/Tarawa","Pacific/Tongatapu","Pacific/Truk","Pacific/Wake","Pacific/Wallis","Pacific/Yap","Poland","Portugal","PRC","PST8PDT","ROC","ROK","Singapore","Turkey","UCT","Universal","US/Alaska","US/Aleutian","US/Arizona","US/Central","US/East-Indiana","US/Eastern","US/Hawaii","US/Indiana-Starke","US/Michigan","US/Mountain","US/Pacific","US/Samoa","UTC","W-SU","WET","Zulu"],"examples":["Europe/Madrid","America/Bogota","UTC"],"$comment":"Generated by scripts/update-timezones.mjs from IANA tzdata 2026c (https://www.iana.org/time-zones). Every Zone and Link (alias), so a historical rename (e.g. Europe/Kiev → Europe/Kyiv, 2022) never invalidates a document that used the old name."},"attendanceMode":{"description":"What the organiser says this event is. Absent never means in-person.","enum":["in-person","online","hybrid"],"examples":["in-person","online","hybrid"]},"location":{"$ref":"#/$defs/location","examples":[{"venue":"El Cable, Almería"},{"onlineUrl":"https://meet.example/pyalmeria"},{"venue":"Campus Madrid, Calle de Moreno Nieto 2, Madrid","address":{"street":"Calle de Moreno Nieto 2","locality":"Madrid","postalCode":"28005","country":"ES"},"onlineUrl":"https://meet.example/rust-madrid"}]},"eligibility":{"description":"Who may attend, when the answer is not \"anyone\". The third part of \"can I go?\", after attendanceMode and location: those two answer whether the event is reachable, this one whether you are allowed in. Absent never means open — an importer reading a .ics cannot know, and staying quiet is not the same claim as saying the door is open.","$ref":"#/$defs/eligibility","examples":[{"type":"open"},{"type":"members-only","note":"Miembros del Discord de Rust Girona","url":"https://rustgirona.example/join"},{"type":"restricted","note":"Solo alumnado de la Universidad de Almería"}]},"tags":{"description":"Free-form topic tags — what the event is ABOUT. Maps to iCal CATEGORIES and schema.org keywords. Not who may attend: that question has its own field, eligibility, because a tag like \"members-only\" is invisible to a consumer that does not already know to look for it. A controlled vocabulary may layer on top later; the field itself stays free.","type":"array","items":{"type":"string","minLength":1,"pattern":"\\S"},"minItems":1,"uniqueItems":true,"examples":[["rust","wasm"],["python","async"]]},"languages":{"description":"Languages SPOKEN at the event, as BCP 47 tags, e.g. [\"es\",\"en\"]. Not the language this document is written in — that is textLanguage, and the two disagree all the time: a bilingual session described in Catalan only.","type":"array","items":{"$ref":"#/$defs/languageTag"},"minItems":1,"uniqueItems":true,"distinctLanguageTags":true,"examples":[["es"],["es","en"]]},"textLanguage":{"description":"Language THIS DOCUMENT's free text is written in — name, description, and any other prose in it. One BCP 47 tag, not a list: a text is written in one language. A different question from languages, which says what is spoken at the event. Absent defaults to the enclosing feed's textLanguage; in a standalone document, with no feed to inherit from, absent means unknown, never English.","x-inheritsFrom":"feed.textLanguage","$ref":"#/$defs/languageTag","examples":["es","ca","en"]},"offers":{"description":"What it costs to attend, and where to register. A list: tiered pricing (early bird, student, patron) is one entry each, and a free event is a single entry with price 0. Absent means UNKNOWN, never free — saying free is what price 0 is for.","$ref":"#/$defs/offers","examples":[[{"price":0,"url":"https://rustmadrid.example/meetups/2026-06#registro"}],[{"name":"Early bird","price":35,"currency":"EUR","url":"https://devfest-levante.example/2026/entradas","availability":"sold-out","closesAt":"2026-07-31T23:59:59+02:00"},{"name":"General","price":45,"currency":"EUR","url":"https://devfest-levante.example/2026/entradas","availability":"in-stock"}]]},"cfp":{"description":"The event's open call for proposals — talks, workshops, papers. The one field of the spec with no equivalent in ANY of the three destination formats: it exists because 'which conferences are accepting proposals right now' is a question only the publisher can answer, and today it is answered by scraping.","$ref":"#/$defs/cfp","examples":[{"url":"https://devfest-levante.example/2026/cfp","closesAt":"2026-07-15T23:59:59+02:00"},{"url":"https://devfest-levante.example/2026/cfp","opensAt":"2026-05-01T00:00:00+02:00","closesAt":"2026-07-15T23:59:59+02:00","coversTravel":true,"coversAccommodation":true}]},"status":{"description":"What happened to the event, not to the data. An event that is cancelled, postponed or moved online MUST stay published: removing it leaves a dead event in subscribers' calendars. tentative means announced but not confirmed (iCal STATUS:TENTATIVE) — it exists so an importer never has to upgrade an unconfirmed event to scheduled.","enum":["scheduled","tentative","cancelled","postponed","rescheduled","moved-online"],"default":"scheduled","examples":["scheduled","cancelled","moved-online"]},"partOf":{"description":"The series or multi-part event this document is one occurrence of. A REFERENCE, never a recurrence rule: OTE does not generate dates: whoever publishes expands the recurrence into one document per occurrence, each with its own id, dates and status. A consumer that ignores this field still sees complete, correct events.","$ref":"#/$defs/partOf","examples":[{"id":"https://rustmadrid.example/meetups","name":"Rust Madrid — meetup mensual","url":"https://rustmadrid.example/meetups"},{"type":"multipart","id":"https://pyalmeria.example/study-jams/2026-testing","name":"Study Jam de testing en Python (3 sesiones)"}]},"license":{"description":"License of THIS DATA, not of the event. SPDX identifier (CC0-1.0, CC-BY-4.0…, full list at https://spdx.org/licenses/) or a URL.","x-inheritsFrom":"feed.license","$ref":"#/$defs/license","examples":["CC-BY-4.0","CC0-1.0"]},"source":{"description":"Provenance. Required when the event was imported or aggregated from elsewhere; omitted when the organiser describes their own event — they are the source.","$ref":"#/$defs/source","examples":[{"name":"Rust Madrid","url":"https://calendar.example/ics/rust-madrid","license":"CC-BY-4.0","retrievedAt":"2026-06-01T05:00:00Z"}]},"updatedAt":{"description":"Instant the event's DATA last changed — equivalent to iCal LAST-MODIFIED, not DTSTAMP (which marks generation and changes on every export). Lets a consumer sync incrementally: fetch only what changed since its last read. Absent means unknown, not 'never changed'.","$ref":"#/$defs/instant","examples":["2026-06-10T18:00:00Z"]},"translations":{"description":"The same event's free text in other languages, keyed by BCP 47 tag. The document keeps ONE primary text in its own fields — declared by textLanguage — and this carries the versions of it. Additive on purpose: name and description stay strings, so every existing consumer keeps working and a monolingual publisher writes nothing at all. Never a translation of the language the document is already in. Requires textLanguage — and so does any other translations map in the document, at any depth; see the document's constraints.","$ref":"#/$defs/translations","examples":[{"es":{"name":"Sesión semanal de programación — Rust Girona","description":"Cada semana nos juntamos en línea para picar Rust un rato."}}]}},"orderedDates":true,"distinctTranslationLanguages":true,"distinctPartOfId":true,"allOf":[{"description":"startDate and endDate must be of the same form: two all-day dates, or two local date-times.","oneOf":[{"properties":{"startDate":{"$ref":"#/$defs/date"},"endDate":{"$ref":"#/$defs/date"}},"type":"object"},{"properties":{"startDate":{"$ref":"#/$defs/dateTime"},"endDate":{"$ref":"#/$defs/dateTime"}},"type":"object"}]}]},"date":{"type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}$","format":"date"},"dateTime":{"description":"A calendar-valid wall-clock date-time, deliberately WITHOUT an offset — that is what timezone is for — and WITHOUT seconds: this is the hour on a poster, never a technical instant. No standard RFC 3339 format covers this shape, so validating it fully requires registering the `ote-local-date-time` format shipped as `customFormats` in the npm package.","type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$","format":"ote-local-date-time"},"wallClock":{"type":"string","anyOf":[{"$ref":"#/$defs/date"},{"$ref":"#/$defs/dateTime"}]},"instant":{"description":"An absolute point in time, WITH offset or Z. Used for metadata (when data was fetched) and for deadlines (when a sale or a call closes) — never for when an event happens, which is wall clock plus timezone.","type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$","format":"date-time"},"currency":{"type":"string","enum":["AED","AFN","ALL","AMD","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BHD","BIF","BMD","BND","BOB","BOV","BRL","BSD","BTN","BWP","BYN","BZD","CAD","CDF","CHE","CHF","CHW","CLF","CLP","CNY","COP","COU","CRC","CUP","CVE","CZK","DJF","DKK","DOP","DZD","EGP","ERN","ETB","EUR","FJD","FKP","GBP","GEL","GHS","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HTG","HUF","IDR","ILS","INR","IQD","IRR","ISK","JMD","JOD","JPY","KES","KGS","KHR","KMF","KPW","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRU","MUR","MVR","MWK","MXN","MXV","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK","SGD","SHP","SLE","SOS","SRD","SSP","STN","SVC","SYP","SZL","THB","TJS","TMT","TND","TOP","TRY","TTD","TWD","TZS","UAH","UGX","USD","USN","UYI","UYU","UYW","UZS","VED","VES","VND","VUV","WST","XAD","XAF","XAG","XAU","XBA","XBB","XBC","XBD","XCD","XCG","XDR","XOF","XPD","XPF","XPT","XSU","XTS","XUA","XXX","YER","ZAR","ZMW","ZWG"],"$comment":"Generated by scripts/update-currencies.mjs from the official ISO 4217 active-currency list published by SIX Group (list-one.xml, published 2026-01-01) — not from Intl.supportedValuesOf('currency'), which lags the real registry. See CHANGES.log #P004."},"country":{"type":"string","enum":["AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA","ZM","ZW"],"$comment":"Generated by scripts/update-countries.mjs from the officially assigned ISO 3166-1 alpha-2 codes. Fetched from the Debian iso-codes project (https://salsa.debian.org/iso-codes-team/iso-codes/-/raw/main/data/iso_3166-1.json) and verified to match a human-retrieved snapshot of the ISO Online Browsing Platform (retrieved 2026-08-03 by hhkaos) before being trusted — iso.org itself returns 403 to automated requests. See CHANGES.log #P005 / DECISIONS.md D006."},"license":{"description":"A real SPDX License List identifier, or a URL to the license text. Never an invented identifier: the whole point of asking for SPDX here instead of prose is that a consumer can compare it against an allowlist.","type":"string","anyOf":[{"enum":["0BSD","3D-Slicer-1.0","AAL","Abstyles","AdaCore-doc","Adobe-2006","Adobe-Display-PostScript","Adobe-Glyph","Adobe-Utopia","ADSL","Advanced-Cryptics-Dictionary","AFL-1.1","AFL-1.2","AFL-2.0","AFL-2.1","AFL-3.0","Afmparse","AGPL-1.0","AGPL-1.0-only","AGPL-1.0-or-later","AGPL-3.0","AGPL-3.0-only","AGPL-3.0-or-later","Aladdin","ALGLIB-Documentation","AMD-newlib","AMDPLPA","AML","AML-glslang","AMPAS","ANTLR-PD","ANTLR-PD-fallback","any-OSI","any-OSI-perl-modules","Apache-1.0","Apache-1.1","Apache-2.0","APAFML","APL-1.0","App-s2p","APSL-1.0","APSL-1.1","APSL-1.2","APSL-2.0","Arphic-1999","Artistic-1.0","Artistic-1.0-cl8","Artistic-1.0-Perl","Artistic-2.0","Artistic-dist","Aspell-RU","ASWF-Digital-Assets-1.0","ASWF-Digital-Assets-1.1","Baekmuk","Bahyph","Barr","bcrypt-Solar-Designer","Beerware","Bitstream-Charter","Bitstream-Vera","BitTorrent-1.0","BitTorrent-1.1","blessing","BlueOak-1.0.0","Boehm-GC","Boehm-GC-without-fee","BOLA-1.1","Borceux","Brian-Gladman-2-Clause","Brian-Gladman-3-Clause","BSD-1-Clause","BSD-2-Clause","BSD-2-Clause-Darwin","BSD-2-Clause-first-lines","BSD-2-Clause-FreeBSD","BSD-2-Clause-NetBSD","BSD-2-Clause-Patent","BSD-2-Clause-pkgconf-disclaimer","BSD-2-Clause-Views","BSD-3-Clause","BSD-3-Clause-acpica","BSD-3-Clause-Attribution","BSD-3-Clause-Clear","BSD-3-Clause-flex","BSD-3-Clause-HP","BSD-3-Clause-LBNL","BSD-3-Clause-Modification","BSD-3-Clause-No-Military-License","BSD-3-Clause-No-Nuclear-License","BSD-3-Clause-No-Nuclear-License-2014","BSD-3-Clause-No-Nuclear-Warranty","BSD-3-Clause-Open-MPI","BSD-3-Clause-Sun","BSD-3-Clause-Tso","BSD-4-Clause","BSD-4-Clause-Shortened","BSD-4-Clause-UC","BSD-4.3RENO","BSD-4.3TAHOE","BSD-Advertising-Acknowledgement","BSD-Attribution-HPND-disclaimer","BSD-Inferno-Nettverk","BSD-Mark-Modifications","BSD-Protection","BSD-Source-beginning-file","BSD-Source-Code","BSD-Systemics","BSD-Systemics-W3Works","BSL-1.0","Buddy","BUSL-1.1","bzip2-1.0.5","bzip2-1.0.6","C-UDA-1.0","CAL-1.0","CAL-1.0-Combined-Work-Exception","Caldera","Caldera-no-preamble","CAPEC-tou","Catharon","CATOSL-1.1","CC-BY-1.0","CC-BY-2.0","CC-BY-2.5","CC-BY-2.5-AU","CC-BY-3.0","CC-BY-3.0-AT","CC-BY-3.0-AU","CC-BY-3.0-DE","CC-BY-3.0-IGO","CC-BY-3.0-NL","CC-BY-3.0-US","CC-BY-4.0","CC-BY-NC-1.0","CC-BY-NC-2.0","CC-BY-NC-2.5","CC-BY-NC-3.0","CC-BY-NC-3.0-DE","CC-BY-NC-4.0","CC-BY-NC-ND-1.0","CC-BY-NC-ND-2.0","CC-BY-NC-ND-2.5","CC-BY-NC-ND-3.0","CC-BY-NC-ND-3.0-DE","CC-BY-NC-ND-3.0-IGO","CC-BY-NC-ND-4.0","CC-BY-NC-SA-1.0","CC-BY-NC-SA-2.0","CC-BY-NC-SA-2.0-DE","CC-BY-NC-SA-2.0-FR","CC-BY-NC-SA-2.0-UK","CC-BY-NC-SA-2.5","CC-BY-NC-SA-3.0","CC-BY-NC-SA-3.0-DE","CC-BY-NC-SA-3.0-IGO","CC-BY-NC-SA-4.0","CC-BY-ND-1.0","CC-BY-ND-2.0","CC-BY-ND-2.5","CC-BY-ND-3.0","CC-BY-ND-3.0-DE","CC-BY-ND-4.0","CC-BY-SA-1.0","CC-BY-SA-2.0","CC-BY-SA-2.0-UK","CC-BY-SA-2.1-JP","CC-BY-SA-2.5","CC-BY-SA-3.0","CC-BY-SA-3.0-AT","CC-BY-SA-3.0-DE","CC-BY-SA-3.0-IGO","CC-BY-SA-4.0","CC-PDDC","CC-PDM-1.0","CC-SA-1.0","CC0-1.0","CDDL-1.0","CDDL-1.1","CDL-1.0","CDLA-Permissive-1.0","CDLA-Permissive-2.0","CDLA-Sharing-1.0","CECILL-1.0","CECILL-1.1","CECILL-2.0","CECILL-2.1","CECILL-B","CECILL-C","CERN-OHL-1.1","CERN-OHL-1.2","CERN-OHL-P-2.0","CERN-OHL-S-2.0","CERN-OHL-W-2.0","CFITSIO","check-cvs","checkmk","ClArtistic","Clips","CMU-Mach","CMU-Mach-nodoc","CNRI-Jython","CNRI-Python","CNRI-Python-GPL-Compatible","COIL-1.0","Community-Spec-1.0","Condor-1.1","copyleft-next-0.3.0","copyleft-next-0.3.1","Cornell-Lossless-JPEG","CPAL-1.0","CPL-1.0","CPOL-1.02","Cronyx","Crossword","CryptoSwift","CrystalStacker","CUA-OPL-1.0","Cube","curl","cve-tou","D-FSL-1.0","DEC-3-Clause","diffmark","DL-DE-BY-2.0","DL-DE-ZERO-2.0","DOC","DocBook-DTD","DocBook-Schema","DocBook-Stylesheet","DocBook-XML","Dotseqn","DRL-1.0","DRL-1.1","DSDP","dtoa","dvipdfm","ECL-1.0","ECL-2.0","eCos-2.0","EFL-1.0","EFL-2.0","eGenix","Elastic-2.0","Entessa","EPICS","EPL-1.0","EPL-2.0","ErlPL-1.1","ESA-PL-permissive-2.4","ESA-PL-strong-copyleft-2.4","ESA-PL-weak-copyleft-2.4","etalab-2.0","EUDatagrid","EUPL-1.0","EUPL-1.1","EUPL-1.2","Eurosym","Fair","FBM","FDK-AAC","Ferguson-Twofish","Frameworx-1.0","FreeBSD-DOC","FreeImage","FSFAP","FSFAP-no-warranty-disclaimer","FSFUL","FSFULLR","FSFULLRSD","FSFULLRWD","FSL-1.1-ALv2","FSL-1.1-MIT","FTL","Furuseth","fwlw","Game-Programming-Gems","GCR-docs","GD","generic-xts","GFDL-1.1","GFDL-1.1-invariants-only","GFDL-1.1-invariants-or-later","GFDL-1.1-no-invariants-only","GFDL-1.1-no-invariants-or-later","GFDL-1.1-only","GFDL-1.1-or-later","GFDL-1.2","GFDL-1.2-invariants-only","GFDL-1.2-invariants-or-later","GFDL-1.2-no-invariants-only","GFDL-1.2-no-invariants-or-later","GFDL-1.2-only","GFDL-1.2-or-later","GFDL-1.3","GFDL-1.3-invariants-only","GFDL-1.3-invariants-or-later","GFDL-1.3-no-invariants-only","GFDL-1.3-no-invariants-or-later","GFDL-1.3-only","GFDL-1.3-or-later","Giftware","GL2PS","Glide","Glulxe","GLWTPL","gnuplot","GPL-1.0","GPL-1.0-only","GPL-1.0-or-later","GPL-1.0+","GPL-2.0","GPL-2.0-only","GPL-2.0-or-later","GPL-2.0-with-autoconf-exception","GPL-2.0-with-bison-exception","GPL-2.0-with-classpath-exception","GPL-2.0-with-font-exception","GPL-2.0-with-GCC-exception","GPL-2.0+","GPL-3.0","GPL-3.0-only","GPL-3.0-or-later","GPL-3.0-with-autoconf-exception","GPL-3.0-with-GCC-exception","GPL-3.0+","Graphics-Gems","gSOAP-1.3b","gtkbook","Gutmann","HaskellReport","HDF5","hdparm","HIDAPI","Hippocratic-2.1","HP-1986","HP-1989","HPND","HPND-DEC","HPND-doc","HPND-doc-sell","HPND-export-US","HPND-export-US-acknowledgement","HPND-export-US-modify","HPND-export2-US","HPND-Fenneberg-Livingston","HPND-INRIA-IMAG","HPND-Intel","HPND-Kevlin-Henney","HPND-Markus-Kuhn","HPND-merchantability-variant","HPND-MIT-disclaimer","HPND-Netrek","HPND-Pbmplus","HPND-sell-MIT-disclaimer-xserver","HPND-sell-regexpr","HPND-sell-variant","HPND-sell-variant-critical-systems","HPND-sell-variant-MIT-disclaimer","HPND-sell-variant-MIT-disclaimer-rev","HPND-SMC","HPND-UC","HPND-UC-export-US","HTMLTIDY","hyphen-bulgarian","IBM-pibs","ICU","IEC-Code-Components-EULA","IJG","IJG-short","ImageMagick","iMatix","Imlib2","Info-ZIP","Inner-Net-2.0","InnoSetup","Intel","Intel-ACPI","Interbase-1.0","IPA","IPL-1.0","ISC","ISC-Veillard","ISO-permission","Jam","JasPer-2.0","jove","JPL-image","JPNIC","JSON","Kastrup","Kazlib","Knuth-CTAN","LAL-1.2","LAL-1.3","Latex2e","Latex2e-translated-notice","Leptonica","LGPL-2.0","LGPL-2.0-only","LGPL-2.0-or-later","LGPL-2.0+","LGPL-2.1","LGPL-2.1-only","LGPL-2.1-or-later","LGPL-2.1+","LGPL-3.0","LGPL-3.0-only","LGPL-3.0-or-later","LGPL-3.0+","LGPLLR","Libpng","libpng-1.6.35","libpng-2.0","libselinux-1.0","libtiff","libutil-David-Nugent","LiLiQ-P-1.1","LiLiQ-R-1.1","LiLiQ-Rplus-1.1","Linux-man-pages-1-para","Linux-man-pages-copyleft","Linux-man-pages-copyleft-2-para","Linux-man-pages-copyleft-var","Linux-OpenIB","LOOP","LPD-document","LPL-1.0","LPL-1.02","LPPL-1.0","LPPL-1.1","LPPL-1.2","LPPL-1.3a","LPPL-1.3c","lsof","Lucida-Bitmap-Fonts","LZMA-SDK-9.11-to-9.20","LZMA-SDK-9.22","Mackerras-3-Clause","Mackerras-3-Clause-acknowledgment","magaz","mailprio","MakeIndex","man2html","Martin-Birgmeier","McPhee-slideshow","metamail","Minpack","MIPS","MirOS","MIT","MIT-0","MIT-advertising","MIT-Click","MIT-CMU","MIT-enna","MIT-feh","MIT-Festival","MIT-Khronos-old","MIT-Modern-Variant","MIT-open-group","MIT-STK","MIT-testregex","MIT-Wu","MITNFA","MMIXware","MMPL-1.0.1","Motosoto","MPEG-SSG","mpi-permissive","mpich2","MPL-1.0","MPL-1.1","MPL-2.0","MPL-2.0-no-copyleft-exception","mplus","MS-LPL","MS-PL","MS-RL","MTLL","MulanPSL-1.0","MulanPSL-2.0","Multics","Mup","NAIST-2003","NASA-1.3","Naumen","NBPL-1.0","NCBI-PD","NCGL-UK-2.0","NCL","NCSA","Net-SNMP","NetCDF","Newsletr","NGPL","ngrep","NICTA-1.0","NIST-PD","NIST-PD-fallback","NIST-PD-TNT","NIST-Software","NLOD-1.0","NLOD-2.0","NLPL","Nokia","NOSL","Noweb","NPL-1.0","NPL-1.1","NPOSL-3.0","NRL","NTIA-PD","NTP","NTP-0","Nunit","O-UDA-1.0","OAR","OCCT-PL","OCLC-2.0","ODbL-1.0","ODC-By-1.0","OFFIS","OFL-1.0","OFL-1.0-no-RFN","OFL-1.0-RFN","OFL-1.1","OFL-1.1-no-RFN","OFL-1.1-RFN","OGC-1.0","OGDL-Taiwan-1.0","OGL-Canada-2.0","OGL-UK-1.0","OGL-UK-2.0","OGL-UK-3.0","OGTSL","OLDAP-1.1","OLDAP-1.2","OLDAP-1.3","OLDAP-1.4","OLDAP-2.0","OLDAP-2.0.1","OLDAP-2.1","OLDAP-2.2","OLDAP-2.2.1","OLDAP-2.2.2","OLDAP-2.3","OLDAP-2.4","OLDAP-2.5","OLDAP-2.6","OLDAP-2.7","OLDAP-2.8","OLFL-1.3","OML","OpenMDW-1.0","OpenPBS-2.3","OpenSSL","OpenSSL-standalone","OpenVision","OPL-1.0","OPL-UK-3.0","OPUBL-1.0","OSC-1.0","OSET-PL-2.1","OSL-1.0","OSL-1.1","OSL-2.0","OSL-2.1","OSL-3.0","OSSP","PADL","ParaType-Free-Font-1.3","Parity-6.0.0","Parity-7.0.0","PDDL-1.0","PHP-3.0","PHP-3.01","Pixar","pkgconf","Plexus","pnmstitch","PolyForm-Noncommercial-1.0.0","PolyForm-Small-Business-1.0.0","PostgreSQL","PPL","PSF-2.0","psfrag","psutils","Python-2.0","Python-2.0.1","python-ldap","Qhull","QPL-1.0","QPL-1.0-INRIA-2004","radvd","Rdisc","RHeCos-1.1","RPL-1.1","RPL-1.5","RPSL-1.0","RSA-MD","RSCPL","Ruby","Ruby-pty","SAX-PD","SAX-PD-2.0","Saxpath","SCEA","SchemeReport","Sendmail","Sendmail-8.23","Sendmail-Open-Source-1.1","SGI-B-1.0","SGI-B-1.1","SGI-B-2.0","SGI-OpenGL","SGMLUG-PM","SGP4","SHL-0.5","SHL-0.51","SimPL-2.0","SISSL","SISSL-1.2","SL","Sleepycat","SMAIL-GPL","SMLNJ","SMPPL","SNIA","snprintf","SOFA","softSurfer","Soundex","Spencer-86","Spencer-94","Spencer-99","SPL-1.0","ssh-keyscan","SSH-OpenSSH","SSH-short","SSLeay-standalone","SSPL-1.0","StandardML-NJ","SugarCRM-1.1.3","SUL-1.0","Sun-PPP","Sun-PPP-2000","SunPro","SWL","swrule","Symlinks","TAPR-OHL-1.0","TCL","TCP-wrappers","TekHVC","TermReadKey","TGPPL-1.0","ThirdEye","threeparttable","TMate","TORQUE-1.1","TOSL","TPDL","TPL-1.0","TrustedQSL","TTWL","TTYP0","TU-Berlin-1.0","TU-Berlin-2.0","Ubuntu-font-1.0","UCAR","UCL-1.0","ulem","UMich-Merit","Unicode-3.0","Unicode-DFS-2015","Unicode-DFS-2016","Unicode-TOU","UnixCrypt","Unlicense","Unlicense-libtelnet","Unlicense-libwhirlpool","UnRAR","UPL-1.0","URT-RLE","Vim","Vixie-Cron","VOSTROM","VSL-1.0","W3C","W3C-19980720","W3C-20150513","w3m","Watcom-1.0","Widget-Workshop","WordNet","Wsuipa","WTFNMFPL","WTFPL","wwl","wxWindows","X11","X11-distribute-modifications-variant","X11-no-permit-persons","X11-swapped","Xdebug-1.03","Xerox","Xfig","XFree86-1.1","xinetd","xkeyboard-config-Zinoviev","xlock","Xnet","xpp","XSkat","xzoom","YPL-1.0","YPL-1.1","Zed","Zeeff","Zend-2.0","Zimbra-1.3","Zimbra-1.4","Zlib","zlib-acknowledgement","ZPL-1.1","ZPL-2.0","ZPL-2.1"],"$comment":"Generated by scripts/update-licenses.mjs from the official SPDX License List (v3.28.0, 3.28.0, released 2026-02-20T00:00:00Z) — github.com/spdx/license-list-data, the SPDX project's own repository. Includes deprecated IDs: SPDX states these remain valid, merely discouraged for new use. See CHANGES.log #P007."},{"format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"}}]},"dataLicense":{"type":"string","enum":["CC-BY-1.0","CC-BY-2.0","CC-BY-2.5","CC-BY-2.5-AU","CC-BY-3.0","CC-BY-3.0-AT","CC-BY-3.0-AU","CC-BY-3.0-DE","CC-BY-3.0-IGO","CC-BY-3.0-NL","CC-BY-3.0-US","CC-BY-4.0","CC-PDDC","CC-PDM-1.0","CC0-1.0","ODC-By-1.0","PDDL-1.0"],"$comment":"Generated by scripts/update-licenses.mjs, same source and release as $defs.license. The subset with no clause (NonCommercial, NoDerivatives, ShareAlike) that can block a directory from redistributing or transforming an event, and no software-copyleft ambiguity. Used only by the recommended (quality) profile, never validity. See CHANGES.log #P007 / DECISIONS.md D008."},"languageTag":{"description":"The CORE of a BCP 47 (RFC 5646) language tag: language, with optional script, region and variant subtags (\"es\", \"ca\", \"en\", \"es-MX\", \"zh-Hant\", \"ca-valencia\"), each checked against the real IANA Language Subtag Registry. Deliberately does NOT accept extended language subtags, extension singletons (\"-u-...\"), private use (\"x-...\") or grandfathered tags (\"i-klingon\") — none has a real use case for the language of an event's text, and grandfathered tags are relics RFC 5646 itself deprecates in favour of the modern subtag form. Shared by languages (spoken at the event), textLanguage (the document's own text) and the keys of translations, so the three can never drift into three notions of what a language is.","type":"string","pattern":"^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$","format":"ote-language-tag"},"languageMap":{"description":"The shape every translations map shares, wherever it appears: keys are BCP 47 tags, and an empty map is invalid — saying nothing is already done by omitting the field, the same rule location follows. Defined once so the five maps of this spec can never drift into five notions of what a language key is.","type":"object","minProperties":1,"propertyNames":{"$ref":"#/$defs/languageTag"}},"translations":{"description":"Free text in other languages, keyed by BCP 47 tag. A map and not a list because the language IS the key: one entry per language, and no way to publish two Spanish versions that contradict each other.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/translation"}},"translation":{"description":"One language's version of an event's OWN free text: name and description, the two fields every destination format prints. Not a mirror of the whole event — text that lives inside offers, eligibility or partOf is translated where it lives, by that object's own translations map. A positional mirror (translations.es.offers[0].name) is the one shape this spec refuses: a list has no stable keys, so reordering the offers would silently attach a translation to the wrong tier.","type":"object","minProperties":1,"properties":{"name":{"description":"The event's name in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Sesión semanal de programación — Rust Girona"]},"description":{"description":"The event's description in this language. Plain text or Markdown, like the field it translates.","type":"string","minLength":1,"pattern":"\\S","examples":["Cada semana nos juntamos en línea para picar Rust un rato."]}},"anyOf":[{"description":"A translation entry is only a translation if it translates something OTE recognizes. Extension fields may still ride alongside name/description — this only forbids an entry whose entire content is unrecognized, which minProperties alone cannot catch.","required":["name"]},{"required":["description"]}]},"feedTranslations":{"description":"A feed's OWN title and description in other languages, keyed by BCP 47 tag. Never its events': each event carries its own translations, because each event has its own text and its own languages.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/feedTranslation"}},"offerTranslations":{"description":"This offer's name in other languages. Local to the offer, so no consumer has to line up two lists by position. It exists because offers[].name stays FREE TEXT on purpose: a kind enum (general, early-bird, student) would have been multilingual for free, and it would also have taken away the organiser's right to name their own tickets. Free text is the choice; translating it is the price.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/offerTranslation"}},"offerTranslation":{"description":"One language's version of an offer's free text. Only name: price is a number, currency is a code, availability is an enum — none of them has a language.","type":"object","required":["name"],"properties":{"name":{"description":"This ticket's name in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Students","Estudiantes"]}}},"eligibilityTranslations":{"description":"This condition's note in other languages. Only note is translated: type is an enum, and an enum is multilingual for free — a consumer renders members-only in the reader's language without anyone translating the data.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/eligibilityTranslation"}},"eligibilityTranslation":{"description":"One language's version of the condition in words.","type":"object","required":["note"],"properties":{"note":{"description":"The condition, in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Miembros del Discord de Rust Girona"]}}},"partOfTranslations":{"description":"The series' or multi-part event's name in other languages. The id is never translated: it is an identifier, and translating it would split one series into two.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/partOfTranslation"}},"partOfTranslation":{"description":"One language's version of the series' display name.","type":"object","required":["name"],"properties":{"name":{"description":"The series' or multi-part event's name in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Sesión semanal de programación"]}}},"feedTranslation":{"description":"One language's version of a feed's own free text.","type":"object","minProperties":1,"properties":{"title":{"description":"The feed's title in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Rust Girona events"]},"description":{"description":"The feed's description in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Weekly online Rust coding sessions, in Catalan and Spanish."]}},"anyOf":[{"description":"Same rule as an event's own translation: extension fields may still ride alongside title/description, but an entry whose entire content is unrecognized is not a translation.","required":["title"]},{"required":["description"]}]},"organizers":{"description":"Who runs the event or the feed. Kept deliberately small: a name, and where to find them.","type":"array","minItems":1,"uniqueItems":true,"items":{"$ref":"#/$defs/organizer"}},"organizer":{"type":"object","required":["name"],"$comment":"email is deliberately NOT in the recommended profile: an .ics importer does not always have it, and warning about a missing address would push someone into publishing contact data they chose not to publish.","properties":{"name":{"description":"Display name of the organiser.","type":"string","minLength":1,"pattern":"\\S","examples":["PyAlmería","Ada Lovelace"]},"url":{"description":"Where this organiser lives on the web — their own site, or their profile on the platform they publish from.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://pyalmeria.example","https://www.meetup.com/pyalmeria/"]},"email":{"description":"Address for enquiries about the event. A ROLE address (info@, hola@) rather than someone's personal mailbox: a feed is open and crawlable, and what goes in it cannot be unpublished. Optional and deliberately NOT recommended. It exists because without it there is no valid iCal ORGANIZER to emit (a CAL-ADDRESS is in practice a mailto:) and no RSS 2.0 <author>, which requires an email. Written bare, without the mailto: prefix — the exporter adds it. Never populate it from a source that is not itself publicly published.","type":"string","format":"email","examples":["hola@pyalmeria.example","info@gdgmadrid.example"]},"type":{"description":"Organisation or person. A translator has to pick a schema.org @type either way, and Organization is the tolerant choice.","enum":["organization","person"],"default":"organization","examples":["organization","person"]}}},"partOf":{"description":"A reference to the whole this occurrence belongs to. Identity only — no dates: the occurrence already carries them.","type":"object","required":["id"],"properties":{"id":{"description":"Stable identifier of the series or multi-part event. Same rules as the event's id: an HTTP(S) URL under a domain the publisher controls — not necessarily one they own, a platform page (Meetup, GitHub Pages, LinkedIn) works too — minted once. It does NOT have to resolve to an OTE document — it is what lets a consumer group occurrences.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://rustmadrid.example/meetups","https://pyalmeria.example/study-jams/2026-testing"]},"name":{"description":"Display name of the series or multi-part event, so a consumer can group occurrences without resolving the id.","type":"string","minLength":1,"pattern":"\\S","examples":["Rust Madrid — meetup mensual","Study Jam de testing en Python (3 sesiones)"]},"url":{"description":"Page describing the series or the multi-part event as a whole.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://rustmadrid.example/meetups"]},"type":{"description":"series: independent occurrences that share an identity (a monthly meetup). multipart: parts of ONE event held on non-consecutive dates (a three-session study jam on non-consecutive Saturdays, one registration). series is the tolerant choice, and the choice changes the translation: a series becomes schema.org EventSeries, a multi-part event becomes an Event whose parts are its subEvent.","enum":["series","multipart"],"default":"series","examples":["series","multipart"]},"translations":{"description":"The series' display name in other languages. Its id stays untranslated — an identifier with two spellings is two series.","$ref":"#/$defs/partOfTranslations","examples":[{"es":{"name":"Sesión semanal de programación"}}]}}},"location":{"description":"What is KNOWN about where the event happens. Not the same question as attendanceMode, which states the organiser's intent.","type":"object","properties":{"venue":{"description":"Human-readable physical location, in one line of free text: the name of the place plus as much address as it takes to get there — how much is your call. Its presence means the event has a physical venue. It is not made redundant by address, because joining address's parts back up never gives you the name: a PostalAddress has no field for \"El Cable\" or \"Campus Madrid\", and the name is what people navigate by. In schema.org it is Place.name, a sibling of Place.address.","type":"string","minLength":1,"pattern":"\\S","examples":["El Cable, Almería","Campus Madrid, Calle de Moreno Nieto 2, Madrid"]},"address":{"description":"Postal address of the physical venue, in parts. COMPLEMENTS venue, never replaces it: venue is the one string every format can print, address is what a translator needs to emit a schema.org PostalAddress — whose subfields Google validates one by one for the Event rich result. Every part is optional; leave out what you do not know. An absent key means unknown; \"\" or null publish 'unknown' as if it were data, which is the one thing worse than saying nothing.","$ref":"#/$defs/address","examples":[{"street":"Calle de Moreno Nieto 2","locality":"Madrid","postalCode":"28005","country":"ES"},{"locality":"Almería","country":"ES"}]},"onlineUrl":{"description":"URL to attend online. Its presence means the event has online access.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://meet.example/pyalmeria"]},"geo":{"description":"Coordinates of the physical venue (WGS-84 decimal degrees). Independent of venue, which is free text — a point, not a name. Maps to iCal GEO and schema.org Place.geo (GeoCoordinates).","type":"object","required":["lat","lon"],"properties":{"lat":{"description":"Latitude in decimal degrees.","type":"number","minimum":-90,"maximum":90,"examples":[40.4168]},"lon":{"description":"Longitude in decimal degrees.","type":"number","minimum":-180,"maximum":180,"examples":[-3.7038]}}}},"anyOf":[{"required":["venue"]},{"required":["onlineUrl"]}]},"address":{"description":"A postal address in parts, mapped 1:1 onto schema.org PostalAddress. Five fields, all optional, none of them free-form enough to be a second venue: this is the machine-readable half of a location, not a prettier one.","type":"object","minProperties":1,"properties":{"street":{"description":"Street and number, as written locally. May carry a floor or a unit; it is one line of text, not a sub-object.","type":"string","minLength":1,"pattern":"\\S","examples":["Calle de Moreno Nieto 2","100 West Snickerpark Dr"]},"locality":{"description":"City, town or village.","type":"string","minLength":1,"pattern":"\\S","examples":["Madrid","Almería"]},"region":{"description":"Province, state or autonomous community — whatever level sits between locality and country in that country. Free text or an ISO 3166-2 code; both travel to schema.org addressRegion unchanged.","type":"string","minLength":1,"pattern":"\\S","examples":["Comunidad de Madrid","PA"]},"postalCode":{"description":"Postal code, as the local post office writes it. A string, never a number: leading zeros are part of it.","type":"string","minLength":1,"pattern":"\\S","examples":["28005","19019"]},"country":{"description":"A real, currently-assigned ISO 3166-1 alpha-2 code (ES, US, MX), never an invented, reserved or former one. A code and not a country name, because the name has one spelling per language: \"España\", \"Spain\" and \"Espagne\" are the same country, and a consumer grouping events by country would see three. Turning a name into a code is a table lookup, not an invention — which is why the spec asks for it here and nowhere else. Common mistake: the UK is GB, not UK — \"UK\" is not an ISO 3166-1 code.","$ref":"#/$defs/country","examples":["ES","US"]}}},"eligibility":{"description":"The door: whether there is a condition to get in, and what it is. An enum so a consumer can filter on it, plus a note so a human can read the part no enum can carry. It models the CONDITION, not the ticketing: no capacity, no seats left, no per-attendee approval state.","type":"object","required":["type"],"properties":{"type":{"description":"The kind of door. open: anyone may attend — including an event that sells tickets or runs out of seats, because a price and a capacity are not conditions on WHO you are. members-only: you have to belong to something first. approval-required: you sign up and the organiser DECIDES — Luma's request-to-approve, a Meetup group with an admission question, a workshop that picks a cohort. It is about a judgement on the person, never about capacity: first-come-first-served with limited seats is open, and the seats running out is offers[].availability. restricted: there IS a condition and none of the other values names it — say which in `note`, which is why the schema demands it there. Four values, kept small on purpose: a consumer that has to handle twenty doors handles none. invite-only is deliberately NOT one of them, see the spec prose.","enum":["open","members-only","approval-required","restricted"],"examples":["open","members-only","approval-required"]},"note":{"description":"The condition in words, for a person to read: which community, which university, which company. REQUIRED when type is restricted, because \"restricted\" on its own tells nobody anything; worth writing whenever the enum value alone leaves a question. This is the part that survives export to every format, inside the text.","type":"string","minLength":1,"pattern":"\\S","examples":["Miembros del Discord de Rust Girona","Solo alumnado de la Universidad de Almería"]},"url":{"description":"Where the condition is explained or met: the page to join the community, request an invitation, apply. Distinct from offers[].url, which is where a seat or money changes hands — here nothing is bought, a door is opened.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://rustgirona.example/join"]},"translations":{"description":"The note in other languages. type needs none: an enum carries no language, and a consumer renders it in the reader's.","$ref":"#/$defs/eligibilityTranslations","examples":[{"es":{"note":"Miembros del Discord de Rust Girona"}}]}},"allOf":[{"description":"restricted means \"there is a door the enum cannot name\". Without a note it names nothing, and a consumer can only show the word itself — which is how a field meant to answer \"can I go?\" ends up asking it.","if":{"type":"object","required":["type"],"properties":{"type":{"const":"restricted"}}},"then":{"type":"object","required":["note"]}}]},"images":{"description":"The event's images, in preference order. Two item forms on purpose: a bare URL string, which is what every 0.2 document already contains and keeps validating unchanged, and an object that adds alt text. Mixing them in one list is legal and expected — the primary image earns its alt, the extra crops of it do not need one.","type":"array","minItems":1,"items":{"oneOf":[{"type":"string","format":"uri","pattern":"^https://","not":{"pattern":"^https?://[^/?#]*@"}},{"$ref":"#/$defs/imageEntry"}]}},"imageEntry":{"description":"One image with its description. The alt travels attached to its own URL and not in a sibling field of the event, because the entries of the list are not guaranteed to be the same picture: one alt for the whole list would describe the first image and be applied to the third. Same reason there is no positional mirror in translations — a list has no stable keys.","type":"object","required":["url"],"properties":{"url":{"description":"Absolute https URL of the image file itself, never of a page showing it. The same value the bare-string form carries.","type":"string","format":"uri","pattern":"^https://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://rustmadrid.example/img/2026-06-16x9.png"]},"alt":{"description":"What the image SHOWS, for whoever cannot see it: screen readers, text-only clients, and any render where the image fails to load. Describe the picture, not the event — the name and description are already being read out next to it, so repeating them makes a screen reader say the same thing twice. Skip \"image of\" or \"poster showing\": the client already announces it is an image. Written in the document's textLanguage, like every other free text here, and translated by this entry's own translations map: alt is read aloud with the pronunciation of the surrounding language, so an English alt inside a Spanish document is worse for accessibility than the problem it was meant to solve. Purely decorative images have no place in a feed and no empty string here — an image with nothing to say is an image left out.","type":"string","minLength":1,"pattern":"\\S","maxLength":250,"examples":["Cartel: Ferris sobre fondo morado, «Rust Madrid · 16 junio · Impact Hub»","Sala diáfana con unas 60 sillas y una pantalla al fondo"]},"translations":{"description":"This image's alt text in other languages. Local to the image it describes — never a positional mirror of the image list. Requires the document's textLanguage, like every other translations map.","$ref":"#/$defs/imageTranslations","examples":[{"en":{"alt":"Poster: Ferris on a purple background, “Rust Madrid · June 16 · Impact Hub”"}}]}},"dependentRequired":{"translations":["alt"]}},"imageTranslations":{"description":"This image's alt text in other languages. Only alt is translated: the url is a file, and a file has no language.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/imageTranslation"}},"imageTranslation":{"description":"One language's version of what the image shows.","type":"object","required":["alt"],"properties":{"alt":{"description":"What the image shows, in this language.","type":"string","minLength":1,"pattern":"\\S","maxLength":250,"examples":["Poster: Ferris on a purple background, “Rust Madrid · June 16 · Impact Hub”"]}}},"offers":{"description":"Ways of attending, with their price. A list because an event may sell several kinds of ticket, and because the answer to \"is it free?\" has to survive an event that is free for students and paid for everyone else.","type":"array","minItems":1,"items":{"$ref":"#/$defs/offer"}},"offer":{"description":"One way of attending: a price, a place to get it, or both. Maps 1:1 onto a schema.org Offer, which is what Google reads to show a price. It models the ticket, not the ticketing: no capacity, no seats left, no per-ticket registration state.","type":"object","properties":{"name":{"description":"What this ticket is called (\"General admission\", \"Estudiantes\"). Worth writing when there is more than one offer, noise when there is only one.","type":"string","minLength":1,"pattern":"\\S","examples":["General admission","Estudiantes"]},"price":{"description":"Amount per attendee, in `currency`. 0 means free — and it is the ONLY way to say free: an absent offers list means the price is unknown. A number, never text: no currency symbol, no thousands separator, no range and no \"desde\", because the whole reason to publish a price as data is that someone can filter and compare on it. A price that cannot be written as one number is several offers.","type":"number","minimum":0,"examples":[0,45,12.5]},"currency":{"description":"A real ISO 4217 alpha-3 code (EUR, USD, MXN), never an invented one. Only meaningful alongside `price` — it names what price is denominated in, and nothing else — so it requires `price` to be present at all, whatever its value. Required whenever `price` is above 0, and pointless at 0: free is free in every currency, and emitting one there is how Luma ends up publishing a currency for a meetup that costs nothing.","$ref":"#/$defs/currency","examples":["EUR","USD"]},"url":{"description":"Where to buy the ticket or register for this particular offer. Distinct from the event's own url: that page describes the event, this one is where money or a seat changes hands. Omit it when registration happens on the event page itself.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://devfest-levante.example/2026/entradas"]},"availability":{"description":"Whether this offer can still be taken. Absent never means available — a stale feed that keeps claiming in-stock is worse than one that says nothing. Only the two states an attendee can act on are modelled.","enum":["in-stock","sold-out"],"examples":["in-stock","sold-out"]},"waitlistUrl":{"description":"Where to join the queue for this offer once it is gone. It exists so \"gone, nothing to do\" and \"gone, but you can queue\" stop being the same document — the third thing an attendee can act on, and the reason it is a URL and not a third availability value: every consumer that already exists keeps reading sold-out, which is TRUE, instead of meeting an enum value it cannot interpret. Distinct from url, where the ticket is bought: nothing is bought in a queue.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://devfest-levante.example/2026/lista-espera"]},"opensAt":{"description":"When this offer goes on sale. An INSTANT, with offset or Z — unlike the event's own dates, which are wall clock: a sale opening is a moment a button starts working, not an hour on a poster.","$ref":"#/$defs/instant","examples":["2026-05-01T10:00:00+02:00"]},"closesAt":{"description":"When this offer stops being available. An INSTANT, with offset or Z, for the same reason as opensAt — and because \"23:59\" without an offset is the classic deadline bug.","$ref":"#/$defs/instant","examples":["2026-07-31T23:59:59+02:00"]},"translations":{"description":"This offer's name in other languages. Local to the offer it belongs to — never a positional mirror of the offers list. Requires the document's textLanguage, like every other translations map.","$ref":"#/$defs/offerTranslations","examples":[{"en":{"name":"Students"}}]}},"anyOf":[{"description":"An offer must carry a price or a link — ideally both. One with neither says nothing that omitting the whole list does not already say, the same rule location follows with venue and onlineUrl.","required":["price"]},{"required":["url"]}],"dependentRequired":{"currency":["price"]},"orderedInstants":true,"allOf":[{"description":"A waitlist for something you can still buy is not a waitlist: the queue only makes sense once the offer is gone. Availability may still be ABSENT — a publisher who knows there is a queue and does not track the ticket state should not be forced to assert sold-out to mention it. Only the incoherent combination is rejected, never the incomplete one.","if":{"type":"object","required":["waitlistUrl"]},"then":{"type":"object","properties":{"availability":{"not":{"const":"in-stock"}}}}},{"description":"A non-zero amount without a currency is not a price: 45 is a different thing in EUR, USD and MXN, and a consumer that has to guess will guess its own.","if":{"type":"object","required":["price"],"properties":{"price":{"type":"number","exclusiveMinimum":0}}},"then":{"type":"object","required":["currency"]}}]},"cfp":{"description":"An open call for proposals. One per event: unlike organizers, no real producer publishes more than one — the CFP directories that exist (confs.tech, developers.events, Sessionize) all model exactly one link and one deadline. Deliberately small: it says where to submit and until when, not what a submission looks like.","type":"object","required":["url"],"orderedInstants":true,"properties":{"url":{"description":"Where proposals are submitted — the form, or the page describing the call. Required: a CFP nobody can find is not a call, and this is the one piece of it that survives export to every format, inside the text.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://devfest-levante.example/2026/cfp"]},"opensAt":{"description":"When the call starts accepting proposals. An INSTANT, with offset or Z. Absent means it is already open — a call that has not opened yet is announced, not published.","$ref":"#/$defs/instant","examples":["2026-05-01T00:00:00+02:00"]},"closesAt":{"description":"Deadline for proposals. An INSTANT, with offset or Z, never a bare \"23:59\": which midnight it is is the whole question, and \"anywhere on Earth\" is a real answer (-12:00) that a wall-clock field could not express. Absent means unknown, not open forever — and it is what a consumer needs to answer \"which CFPs are open right now\".","$ref":"#/$defs/instant","examples":["2026-07-15T23:59:59+02:00","2026-07-15T23:59:59-12:00"]},"coversTravel":{"description":"Whether the event covers a selected speaker's travel. Absent never means false. It is here and \"call for sponsors\" is not because this is what a speaker filters on before deciding whether they can afford to submit.","type":"boolean","examples":[true]},"coversAccommodation":{"description":"Whether the event covers a selected speaker's accommodation. Same rule as coversTravel: absent means unknown.","type":"boolean","examples":[true]}}},"source":{"type":"object","anyOf":[{"description":"Provenance has to point somewhere: a name a person can read, a URL a machine can follow, ideally both. Either alone is enough, and demanding the name would be worse than accepting the URL — an importer of an `.ics` always knows the address it fetched and often has no publisher name to read (iCalendar's X-WR-CALNAME is optional), so the requirement would be met by inventing one. A fabricated origin is worse than an origin given only as a link. Same rule as offers with price and url, and location with venue and onlineUrl.","required":["name"]},{"required":["url"]}],"properties":{"name":{"description":"Name of the origin (e.g. \"Rust Madrid\", \"Meetup\"), as a person would read it. Write it whenever the origin has a name of its own: a consumer showing where the data came from can derive a label from `url` (its host), but a derived label is a guess.","type":"string","minLength":1,"pattern":"\\S","examples":["Rust Madrid","Meetup"]},"url":{"description":"Link to the original record, so the data can be verified and corrected upstream.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://calendar.example/ics/rust-madrid"]},"license":{"description":"License under which the ORIGIN publishes the data. Constrains what may be republished: declaring a license does not grant rights the origin never gave.","$ref":"#/$defs/license","examples":["CC-BY-4.0"]},"retrievedAt":{"description":"When the data was fetched.","$ref":"#/$defs/instant","examples":["2026-06-01T05:00:00Z"]}}}}};
const schema33 = {"type":"object","required":["id","name","startDate","timezone"],"properties":{"specVersion":{"description":"Version of OTE Spec this document adheres to.","x-inheritsFrom":"feed.specVersion","const":"0.3.0","examples":["0.3.0"]},"id":{"description":"Stable, globally unique identifier: an HTTP(S) URL under a domain the publisher controls — not necessarily one they own; a canonical page on a platform they use (Meetup, GitHub Pages, LinkedIn) works exactly as well, since what matters is that the URL is stable and nobody else can end up with that same one. Minted once, never rewritten — this is what lets consumers update an event instead of duplicating it.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://pyalmeria.example/eventos/2026-06-async","https://calendar.example/ics/rust-madrid#a1b2c3d4-uid","https://www.meetup.com/pyalmeria/events/123456789/"]},"url":{"description":"Canonical URL where the event is described today. May change over time; id may not.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://pyalmeria.example/eventos/2026-06-async"]},"name":{"description":"Display name of the event.","type":"string","minLength":1,"pattern":"\\S","examples":["PyAlmería — Introducción a async/await"]},"description":{"description":"Short description. Plain text or Markdown.","type":"string","examples":["Charla introductoria a la programación asíncrona en Python, con ejemplos en vivo."]},"image":{"description":"Promotional images of the event: poster, cover, card. A list in preference order — the FIRST is the primary one, and often the only one a destination can use. The rest may be other crops or resolutions of that same image (Google asks for 1:1, 4:3 and 16:9) or different images altogether; a consumer that can show only one shows the first, and none may assume the list renders as a photo gallery. An entry is either a bare https URL to the image file itself — never to a page showing it — or an object that adds alt text.","$ref":"#/$defs/images","examples":[["https://rustmadrid.example/img/2026-06-16x9.png"],[{"url":"https://rustmadrid.example/img/2026-06-16x9.png","alt":"Cartel: Ferris sobre fondo morado, «Rust Madrid · 16 junio · Impact Hub»"},"https://rustmadrid.example/img/2026-06-1x1.png","https://rustmadrid.example/img/2026-06-4x3.png"]]},"organizers":{"description":"Who runs the event — not where the data came from (that is source). A list: co-organised events are the norm, not the exception. Declaring it REPLACES the inherited list, it does not add to it.","x-inheritsFrom":"feed.organizers","$ref":"#/$defs/organizers","examples":[[{"name":"PyAlmería","url":"https://pyalmeria.example"}],[{"name":"GDG Madrid","url":"https://gdgmadrid.example"},{"type":"person","name":"Ada Lovelace","url":"https://ada.example"}]]},"startDate":{"description":"Wall-clock start: a date (2026-10-15) for all-day events, or a local date-time (2026-10-15T09:00), never with seconds. Never carries a UTC offset — timezone does that. Which of the two forms you pick is not this field's decision alone: it has to match endDate's, and endDate (if present) must not be earlier — see the document's constraints.","$ref":"#/$defs/wallClock","examples":["2026-06-11T18:30","2026-10-15"]},"endDate":{"description":"Wall-clock end, in the SAME form as startDate (both dates, or both date-times) and never earlier than it. If absent, the event is assumed to end on the day it starts. For an all-day event (date form, no time), endDate is INCLUSIVE — it names the last day the event runs, not the day after. Converting to iCalendar needs +1 day for DTEND;VALUE=DATE (RFC 5545 defines it as the non-inclusive end); importing needs -1 day back. Both rules belong to the document, not to this field — see the document's constraints.","$ref":"#/$defs/wallClock","examples":["2026-06-11T20:00","2026-10-16"]},"timezone":{"description":"A real IANA timezone identifier (e.g. Europe/Madrid) — canonical name or historical alias, never an invented or malformed one. Turns a wall-clock startDate into an unambiguous instant. For all-day events it contextualises the date — it does not shift it. On the two nights a year local time is ambiguous (a repeated hour) or impossible (a skipped hour) because of a DST transition, resolve exactly as RFC 5545 §3.3.5 does: a repeated local time means its FIRST occurrence; a skipped local time is read using the UTC offset that was in effect BEFORE the transition.","type":"string","enum":["Africa/Abidjan","Africa/Accra","Africa/Addis_Ababa","Africa/Algiers","Africa/Asmara","Africa/Asmera","Africa/Bamako","Africa/Bangui","Africa/Banjul","Africa/Bissau","Africa/Blantyre","Africa/Brazzaville","Africa/Bujumbura","Africa/Cairo","Africa/Casablanca","Africa/Ceuta","Africa/Conakry","Africa/Dakar","Africa/Dar_es_Salaam","Africa/Djibouti","Africa/Douala","Africa/El_Aaiun","Africa/Freetown","Africa/Gaborone","Africa/Harare","Africa/Johannesburg","Africa/Juba","Africa/Kampala","Africa/Khartoum","Africa/Kigali","Africa/Kinshasa","Africa/Lagos","Africa/Libreville","Africa/Lome","Africa/Luanda","Africa/Lubumbashi","Africa/Lusaka","Africa/Malabo","Africa/Maputo","Africa/Maseru","Africa/Mbabane","Africa/Mogadishu","Africa/Monrovia","Africa/Nairobi","Africa/Ndjamena","Africa/Niamey","Africa/Nouakchott","Africa/Ouagadougou","Africa/Porto-Novo","Africa/Sao_Tome","Africa/Timbuktu","Africa/Tripoli","Africa/Tunis","Africa/Windhoek","America/Adak","America/Anchorage","America/Anguilla","America/Antigua","America/Araguaina","America/Argentina/Buenos_Aires","America/Argentina/Catamarca","America/Argentina/ComodRivadavia","America/Argentina/Cordoba","America/Argentina/Jujuy","America/Argentina/La_Rioja","America/Argentina/Mendoza","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan","America/Argentina/San_Luis","America/Argentina/Tucuman","America/Argentina/Ushuaia","America/Aruba","America/Asuncion","America/Atikokan","America/Atka","America/Bahia","America/Bahia_Banderas","America/Barbados","America/Belem","America/Belize","America/Blanc-Sablon","America/Boa_Vista","America/Bogota","America/Boise","America/Buenos_Aires","America/Cambridge_Bay","America/Campo_Grande","America/Cancun","America/Caracas","America/Catamarca","America/Cayenne","America/Cayman","America/Chicago","America/Chihuahua","America/Ciudad_Juarez","America/Coral_Harbour","America/Cordoba","America/Costa_Rica","America/Coyhaique","America/Creston","America/Cuiaba","America/Curacao","America/Danmarkshavn","America/Dawson","America/Dawson_Creek","America/Denver","America/Detroit","America/Dominica","America/Edmonton","America/Eirunepe","America/El_Salvador","America/Ensenada","America/Fort_Nelson","America/Fort_Wayne","America/Fortaleza","America/Glace_Bay","America/Godthab","America/Goose_Bay","America/Grand_Turk","America/Grenada","America/Guadeloupe","America/Guatemala","America/Guayaquil","America/Guyana","America/Halifax","America/Havana","America/Hermosillo","America/Indiana/Indianapolis","America/Indiana/Knox","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Tell_City","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Indianapolis","America/Inuvik","America/Iqaluit","America/Jamaica","America/Jujuy","America/Juneau","America/Kentucky/Louisville","America/Kentucky/Monticello","America/Knox_IN","America/Kralendijk","America/La_Paz","America/Lima","America/Los_Angeles","America/Louisville","America/Lower_Princes","America/Maceio","America/Managua","America/Manaus","America/Marigot","America/Martinique","America/Matamoros","America/Mazatlan","America/Mendoza","America/Menominee","America/Merida","America/Metlakatla","America/Mexico_City","America/Miquelon","America/Moncton","America/Monterrey","America/Montevideo","America/Montreal","America/Montserrat","America/Nassau","America/New_York","America/Nipigon","America/Nome","America/Noronha","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Nuuk","America/Ojinaga","America/Panama","America/Pangnirtung","America/Paramaribo","America/Phoenix","America/Port_of_Spain","America/Port-au-Prince","America/Porto_Acre","America/Porto_Velho","America/Puerto_Rico","America/Punta_Arenas","America/Rainy_River","America/Rankin_Inlet","America/Recife","America/Regina","America/Resolute","America/Rio_Branco","America/Rosario","America/Santa_Isabel","America/Santarem","America/Santiago","America/Santo_Domingo","America/Sao_Paulo","America/Scoresbysund","America/Shiprock","America/Sitka","America/St_Barthelemy","America/St_Johns","America/St_Kitts","America/St_Lucia","America/St_Thomas","America/St_Vincent","America/Swift_Current","America/Tegucigalpa","America/Thule","America/Thunder_Bay","America/Tijuana","America/Toronto","America/Tortola","America/Vancouver","America/Virgin","America/Whitehorse","America/Winnipeg","America/Yakutat","America/Yellowknife","Antarctica/Casey","Antarctica/Davis","Antarctica/DumontDUrville","Antarctica/Macquarie","Antarctica/Mawson","Antarctica/McMurdo","Antarctica/Palmer","Antarctica/Rothera","Antarctica/South_Pole","Antarctica/Syowa","Antarctica/Troll","Antarctica/Vostok","Arctic/Longyearbyen","Asia/Aden","Asia/Almaty","Asia/Amman","Asia/Anadyr","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Ashkhabad","Asia/Atyrau","Asia/Baghdad","Asia/Bahrain","Asia/Baku","Asia/Bangkok","Asia/Barnaul","Asia/Beirut","Asia/Bishkek","Asia/Brunei","Asia/Calcutta","Asia/Chita","Asia/Choibalsan","Asia/Chongqing","Asia/Chungking","Asia/Colombo","Asia/Dacca","Asia/Damascus","Asia/Dhaka","Asia/Dili","Asia/Dubai","Asia/Dushanbe","Asia/Famagusta","Asia/Gaza","Asia/Harbin","Asia/Hebron","Asia/Ho_Chi_Minh","Asia/Hong_Kong","Asia/Hovd","Asia/Irkutsk","Asia/Istanbul","Asia/Jakarta","Asia/Jayapura","Asia/Jerusalem","Asia/Kabul","Asia/Kamchatka","Asia/Karachi","Asia/Kashgar","Asia/Kathmandu","Asia/Katmandu","Asia/Khandyga","Asia/Kolkata","Asia/Krasnoyarsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Kuwait","Asia/Macao","Asia/Macau","Asia/Magadan","Asia/Makassar","Asia/Manila","Asia/Muscat","Asia/Nicosia","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Omsk","Asia/Oral","Asia/Phnom_Penh","Asia/Pontianak","Asia/Pyongyang","Asia/Qatar","Asia/Qostanay","Asia/Qyzylorda","Asia/Rangoon","Asia/Riyadh","Asia/Saigon","Asia/Sakhalin","Asia/Samarkand","Asia/Seoul","Asia/Shanghai","Asia/Singapore","Asia/Srednekolymsk","Asia/Taipei","Asia/Tashkent","Asia/Tbilisi","Asia/Tehran","Asia/Tel_Aviv","Asia/Thimbu","Asia/Thimphu","Asia/Tokyo","Asia/Tomsk","Asia/Ujung_Pandang","Asia/Ulaanbaatar","Asia/Ulan_Bator","Asia/Urumqi","Asia/Ust-Nera","Asia/Vientiane","Asia/Vladivostok","Asia/Yakutsk","Asia/Yangon","Asia/Yekaterinburg","Asia/Yerevan","Atlantic/Azores","Atlantic/Bermuda","Atlantic/Canary","Atlantic/Cape_Verde","Atlantic/Faeroe","Atlantic/Faroe","Atlantic/Jan_Mayen","Atlantic/Madeira","Atlantic/Reykjavik","Atlantic/South_Georgia","Atlantic/St_Helena","Atlantic/Stanley","Australia/ACT","Australia/Adelaide","Australia/Brisbane","Australia/Broken_Hill","Australia/Canberra","Australia/Currie","Australia/Darwin","Australia/Eucla","Australia/Hobart","Australia/LHI","Australia/Lindeman","Australia/Lord_Howe","Australia/Melbourne","Australia/North","Australia/NSW","Australia/Perth","Australia/Queensland","Australia/South","Australia/Sydney","Australia/Tasmania","Australia/Victoria","Australia/West","Australia/Yancowinna","Brazil/Acre","Brazil/DeNoronha","Brazil/East","Brazil/West","Canada/Atlantic","Canada/Central","Canada/Eastern","Canada/Mountain","Canada/Newfoundland","Canada/Pacific","Canada/Saskatchewan","Canada/Yukon","CET","Chile/Continental","Chile/EasterIsland","CST6CDT","Cuba","EET","Egypt","Eire","EST","EST5EDT","Etc/GMT","Etc/GMT-0","Etc/GMT-1","Etc/GMT-10","Etc/GMT-11","Etc/GMT-12","Etc/GMT-13","Etc/GMT-14","Etc/GMT-2","Etc/GMT-3","Etc/GMT-4","Etc/GMT-5","Etc/GMT-6","Etc/GMT-7","Etc/GMT-8","Etc/GMT-9","Etc/GMT+0","Etc/GMT+1","Etc/GMT+10","Etc/GMT+11","Etc/GMT+12","Etc/GMT+2","Etc/GMT+3","Etc/GMT+4","Etc/GMT+5","Etc/GMT+6","Etc/GMT+7","Etc/GMT+8","Etc/GMT+9","Etc/GMT0","Etc/Greenwich","Etc/UCT","Etc/Universal","Etc/UTC","Etc/Zulu","Europe/Amsterdam","Europe/Andorra","Europe/Astrakhan","Europe/Athens","Europe/Belfast","Europe/Belgrade","Europe/Berlin","Europe/Bratislava","Europe/Brussels","Europe/Bucharest","Europe/Budapest","Europe/Busingen","Europe/Chisinau","Europe/Copenhagen","Europe/Dublin","Europe/Gibraltar","Europe/Guernsey","Europe/Helsinki","Europe/Isle_of_Man","Europe/Istanbul","Europe/Jersey","Europe/Kaliningrad","Europe/Kiev","Europe/Kirov","Europe/Kyiv","Europe/Lisbon","Europe/Ljubljana","Europe/London","Europe/Luxembourg","Europe/Madrid","Europe/Malta","Europe/Mariehamn","Europe/Minsk","Europe/Monaco","Europe/Moscow","Europe/Nicosia","Europe/Oslo","Europe/Paris","Europe/Podgorica","Europe/Prague","Europe/Riga","Europe/Rome","Europe/Samara","Europe/San_Marino","Europe/Sarajevo","Europe/Saratov","Europe/Simferopol","Europe/Skopje","Europe/Sofia","Europe/Stockholm","Europe/Tallinn","Europe/Tirane","Europe/Tiraspol","Europe/Ulyanovsk","Europe/Uzhgorod","Europe/Vaduz","Europe/Vatican","Europe/Vienna","Europe/Vilnius","Europe/Volgograd","Europe/Warsaw","Europe/Zagreb","Europe/Zaporozhye","Europe/Zurich","GB","GB-Eire","GMT","GMT-0","GMT+0","GMT0","Greenwich","Hongkong","HST","Iceland","Indian/Antananarivo","Indian/Chagos","Indian/Christmas","Indian/Cocos","Indian/Comoro","Indian/Kerguelen","Indian/Mahe","Indian/Maldives","Indian/Mauritius","Indian/Mayotte","Indian/Reunion","Iran","Israel","Jamaica","Japan","Kwajalein","Libya","MET","Mexico/BajaNorte","Mexico/BajaSur","Mexico/General","MST","MST7MDT","Navajo","NZ","NZ-CHAT","Pacific/Apia","Pacific/Auckland","Pacific/Bougainville","Pacific/Chatham","Pacific/Chuuk","Pacific/Easter","Pacific/Efate","Pacific/Enderbury","Pacific/Fakaofo","Pacific/Fiji","Pacific/Funafuti","Pacific/Galapagos","Pacific/Gambier","Pacific/Guadalcanal","Pacific/Guam","Pacific/Honolulu","Pacific/Johnston","Pacific/Kanton","Pacific/Kiritimati","Pacific/Kosrae","Pacific/Kwajalein","Pacific/Majuro","Pacific/Marquesas","Pacific/Midway","Pacific/Nauru","Pacific/Niue","Pacific/Norfolk","Pacific/Noumea","Pacific/Pago_Pago","Pacific/Palau","Pacific/Pitcairn","Pacific/Pohnpei","Pacific/Ponape","Pacific/Port_Moresby","Pacific/Rarotonga","Pacific/Saipan","Pacific/Samoa","Pacific/Tahiti","Pacific/Tarawa","Pacific/Tongatapu","Pacific/Truk","Pacific/Wake","Pacific/Wallis","Pacific/Yap","Poland","Portugal","PRC","PST8PDT","ROC","ROK","Singapore","Turkey","UCT","Universal","US/Alaska","US/Aleutian","US/Arizona","US/Central","US/East-Indiana","US/Eastern","US/Hawaii","US/Indiana-Starke","US/Michigan","US/Mountain","US/Pacific","US/Samoa","UTC","W-SU","WET","Zulu"],"examples":["Europe/Madrid","America/Bogota","UTC"],"$comment":"Generated by scripts/update-timezones.mjs from IANA tzdata 2026c (https://www.iana.org/time-zones). Every Zone and Link (alias), so a historical rename (e.g. Europe/Kiev → Europe/Kyiv, 2022) never invalidates a document that used the old name."},"attendanceMode":{"description":"What the organiser says this event is. Absent never means in-person.","enum":["in-person","online","hybrid"],"examples":["in-person","online","hybrid"]},"location":{"$ref":"#/$defs/location","examples":[{"venue":"El Cable, Almería"},{"onlineUrl":"https://meet.example/pyalmeria"},{"venue":"Campus Madrid, Calle de Moreno Nieto 2, Madrid","address":{"street":"Calle de Moreno Nieto 2","locality":"Madrid","postalCode":"28005","country":"ES"},"onlineUrl":"https://meet.example/rust-madrid"}]},"eligibility":{"description":"Who may attend, when the answer is not \"anyone\". The third part of \"can I go?\", after attendanceMode and location: those two answer whether the event is reachable, this one whether you are allowed in. Absent never means open — an importer reading a .ics cannot know, and staying quiet is not the same claim as saying the door is open.","$ref":"#/$defs/eligibility","examples":[{"type":"open"},{"type":"members-only","note":"Miembros del Discord de Rust Girona","url":"https://rustgirona.example/join"},{"type":"restricted","note":"Solo alumnado de la Universidad de Almería"}]},"tags":{"description":"Free-form topic tags — what the event is ABOUT. Maps to iCal CATEGORIES and schema.org keywords. Not who may attend: that question has its own field, eligibility, because a tag like \"members-only\" is invisible to a consumer that does not already know to look for it. A controlled vocabulary may layer on top later; the field itself stays free.","type":"array","items":{"type":"string","minLength":1,"pattern":"\\S"},"minItems":1,"uniqueItems":true,"examples":[["rust","wasm"],["python","async"]]},"languages":{"description":"Languages SPOKEN at the event, as BCP 47 tags, e.g. [\"es\",\"en\"]. Not the language this document is written in — that is textLanguage, and the two disagree all the time: a bilingual session described in Catalan only.","type":"array","items":{"$ref":"#/$defs/languageTag"},"minItems":1,"uniqueItems":true,"distinctLanguageTags":true,"examples":[["es"],["es","en"]]},"textLanguage":{"description":"Language THIS DOCUMENT's free text is written in — name, description, and any other prose in it. One BCP 47 tag, not a list: a text is written in one language. A different question from languages, which says what is spoken at the event. Absent defaults to the enclosing feed's textLanguage; in a standalone document, with no feed to inherit from, absent means unknown, never English.","x-inheritsFrom":"feed.textLanguage","$ref":"#/$defs/languageTag","examples":["es","ca","en"]},"offers":{"description":"What it costs to attend, and where to register. A list: tiered pricing (early bird, student, patron) is one entry each, and a free event is a single entry with price 0. Absent means UNKNOWN, never free — saying free is what price 0 is for.","$ref":"#/$defs/offers","examples":[[{"price":0,"url":"https://rustmadrid.example/meetups/2026-06#registro"}],[{"name":"Early bird","price":35,"currency":"EUR","url":"https://devfest-levante.example/2026/entradas","availability":"sold-out","closesAt":"2026-07-31T23:59:59+02:00"},{"name":"General","price":45,"currency":"EUR","url":"https://devfest-levante.example/2026/entradas","availability":"in-stock"}]]},"cfp":{"description":"The event's open call for proposals — talks, workshops, papers. The one field of the spec with no equivalent in ANY of the three destination formats: it exists because 'which conferences are accepting proposals right now' is a question only the publisher can answer, and today it is answered by scraping.","$ref":"#/$defs/cfp","examples":[{"url":"https://devfest-levante.example/2026/cfp","closesAt":"2026-07-15T23:59:59+02:00"},{"url":"https://devfest-levante.example/2026/cfp","opensAt":"2026-05-01T00:00:00+02:00","closesAt":"2026-07-15T23:59:59+02:00","coversTravel":true,"coversAccommodation":true}]},"status":{"description":"What happened to the event, not to the data. An event that is cancelled, postponed or moved online MUST stay published: removing it leaves a dead event in subscribers' calendars. tentative means announced but not confirmed (iCal STATUS:TENTATIVE) — it exists so an importer never has to upgrade an unconfirmed event to scheduled.","enum":["scheduled","tentative","cancelled","postponed","rescheduled","moved-online"],"default":"scheduled","examples":["scheduled","cancelled","moved-online"]},"partOf":{"description":"The series or multi-part event this document is one occurrence of. A REFERENCE, never a recurrence rule: OTE does not generate dates: whoever publishes expands the recurrence into one document per occurrence, each with its own id, dates and status. A consumer that ignores this field still sees complete, correct events.","$ref":"#/$defs/partOf","examples":[{"id":"https://rustmadrid.example/meetups","name":"Rust Madrid — meetup mensual","url":"https://rustmadrid.example/meetups"},{"type":"multipart","id":"https://pyalmeria.example/study-jams/2026-testing","name":"Study Jam de testing en Python (3 sesiones)"}]},"license":{"description":"License of THIS DATA, not of the event. SPDX identifier (CC0-1.0, CC-BY-4.0…, full list at https://spdx.org/licenses/) or a URL.","x-inheritsFrom":"feed.license","$ref":"#/$defs/license","examples":["CC-BY-4.0","CC0-1.0"]},"source":{"description":"Provenance. Required when the event was imported or aggregated from elsewhere; omitted when the organiser describes their own event — they are the source.","$ref":"#/$defs/source","examples":[{"name":"Rust Madrid","url":"https://calendar.example/ics/rust-madrid","license":"CC-BY-4.0","retrievedAt":"2026-06-01T05:00:00Z"}]},"updatedAt":{"description":"Instant the event's DATA last changed — equivalent to iCal LAST-MODIFIED, not DTSTAMP (which marks generation and changes on every export). Lets a consumer sync incrementally: fetch only what changed since its last read. Absent means unknown, not 'never changed'.","$ref":"#/$defs/instant","examples":["2026-06-10T18:00:00Z"]},"translations":{"description":"The same event's free text in other languages, keyed by BCP 47 tag. The document keeps ONE primary text in its own fields — declared by textLanguage — and this carries the versions of it. Additive on purpose: name and description stay strings, so every existing consumer keeps working and a monolingual publisher writes nothing at all. Never a translation of the language the document is already in. Requires textLanguage — and so does any other translations map in the document, at any depth; see the document's constraints.","$ref":"#/$defs/translations","examples":[{"es":{"name":"Sesión semanal de programación — Rust Girona","description":"Cada semana nos juntamos en línea para picar Rust un rato."}}]}},"orderedDates":true,"distinctTranslationLanguages":true,"distinctPartOfId":true,"allOf":[{"description":"startDate and endDate must be of the same form: two all-day dates, or two local date-times.","oneOf":[{"properties":{"startDate":{"$ref":"#/$defs/date"},"endDate":{"$ref":"#/$defs/date"}},"type":"object"},{"properties":{"startDate":{"$ref":"#/$defs/dateTime"},"endDate":{"$ref":"#/$defs/dateTime"}},"type":"object"}]}]};
const schema34 = {"type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}$","format":"date"};
const schema36 = {"description":"A calendar-valid wall-clock date-time, deliberately WITHOUT an offset — that is what timezone is for — and WITHOUT seconds: this is the hour on a poster, never a technical instant. No standard RFC 3339 format covers this shape, so validating it fully requires registering the `ote-local-date-time` format shipped as `customFormats` in the npm package.","type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$","format":"ote-local-date-time"};
const schema42 = {"description":"The CORE of a BCP 47 (RFC 5646) language tag: language, with optional script, region and variant subtags (\"es\", \"ca\", \"en\", \"es-MX\", \"zh-Hant\", \"ca-valencia\"), each checked against the real IANA Language Subtag Registry. Deliberately does NOT accept extended language subtags, extension singletons (\"-u-...\"), private use (\"x-...\") or grandfathered tags (\"i-klingon\") — none has a real use case for the language of an event's text, and grandfathered tags are relics RFC 5646 itself deprecates in favour of the modern subtag form. Shared by languages (spoken at the event), textLanguage (the document's own text) and the keys of translations, so the three can never drift into three notions of what a language is.","type":"string","pattern":"^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$","format":"ote-language-tag"};
const schema70 = {"description":"A real SPDX License List identifier, or a URL to the license text. Never an invented identifier: the whole point of asking for SPDX here instead of prose is that a consumer can compare it against an allowlist.","type":"string","anyOf":[{"enum":["0BSD","3D-Slicer-1.0","AAL","Abstyles","AdaCore-doc","Adobe-2006","Adobe-Display-PostScript","Adobe-Glyph","Adobe-Utopia","ADSL","Advanced-Cryptics-Dictionary","AFL-1.1","AFL-1.2","AFL-2.0","AFL-2.1","AFL-3.0","Afmparse","AGPL-1.0","AGPL-1.0-only","AGPL-1.0-or-later","AGPL-3.0","AGPL-3.0-only","AGPL-3.0-or-later","Aladdin","ALGLIB-Documentation","AMD-newlib","AMDPLPA","AML","AML-glslang","AMPAS","ANTLR-PD","ANTLR-PD-fallback","any-OSI","any-OSI-perl-modules","Apache-1.0","Apache-1.1","Apache-2.0","APAFML","APL-1.0","App-s2p","APSL-1.0","APSL-1.1","APSL-1.2","APSL-2.0","Arphic-1999","Artistic-1.0","Artistic-1.0-cl8","Artistic-1.0-Perl","Artistic-2.0","Artistic-dist","Aspell-RU","ASWF-Digital-Assets-1.0","ASWF-Digital-Assets-1.1","Baekmuk","Bahyph","Barr","bcrypt-Solar-Designer","Beerware","Bitstream-Charter","Bitstream-Vera","BitTorrent-1.0","BitTorrent-1.1","blessing","BlueOak-1.0.0","Boehm-GC","Boehm-GC-without-fee","BOLA-1.1","Borceux","Brian-Gladman-2-Clause","Brian-Gladman-3-Clause","BSD-1-Clause","BSD-2-Clause","BSD-2-Clause-Darwin","BSD-2-Clause-first-lines","BSD-2-Clause-FreeBSD","BSD-2-Clause-NetBSD","BSD-2-Clause-Patent","BSD-2-Clause-pkgconf-disclaimer","BSD-2-Clause-Views","BSD-3-Clause","BSD-3-Clause-acpica","BSD-3-Clause-Attribution","BSD-3-Clause-Clear","BSD-3-Clause-flex","BSD-3-Clause-HP","BSD-3-Clause-LBNL","BSD-3-Clause-Modification","BSD-3-Clause-No-Military-License","BSD-3-Clause-No-Nuclear-License","BSD-3-Clause-No-Nuclear-License-2014","BSD-3-Clause-No-Nuclear-Warranty","BSD-3-Clause-Open-MPI","BSD-3-Clause-Sun","BSD-3-Clause-Tso","BSD-4-Clause","BSD-4-Clause-Shortened","BSD-4-Clause-UC","BSD-4.3RENO","BSD-4.3TAHOE","BSD-Advertising-Acknowledgement","BSD-Attribution-HPND-disclaimer","BSD-Inferno-Nettverk","BSD-Mark-Modifications","BSD-Protection","BSD-Source-beginning-file","BSD-Source-Code","BSD-Systemics","BSD-Systemics-W3Works","BSL-1.0","Buddy","BUSL-1.1","bzip2-1.0.5","bzip2-1.0.6","C-UDA-1.0","CAL-1.0","CAL-1.0-Combined-Work-Exception","Caldera","Caldera-no-preamble","CAPEC-tou","Catharon","CATOSL-1.1","CC-BY-1.0","CC-BY-2.0","CC-BY-2.5","CC-BY-2.5-AU","CC-BY-3.0","CC-BY-3.0-AT","CC-BY-3.0-AU","CC-BY-3.0-DE","CC-BY-3.0-IGO","CC-BY-3.0-NL","CC-BY-3.0-US","CC-BY-4.0","CC-BY-NC-1.0","CC-BY-NC-2.0","CC-BY-NC-2.5","CC-BY-NC-3.0","CC-BY-NC-3.0-DE","CC-BY-NC-4.0","CC-BY-NC-ND-1.0","CC-BY-NC-ND-2.0","CC-BY-NC-ND-2.5","CC-BY-NC-ND-3.0","CC-BY-NC-ND-3.0-DE","CC-BY-NC-ND-3.0-IGO","CC-BY-NC-ND-4.0","CC-BY-NC-SA-1.0","CC-BY-NC-SA-2.0","CC-BY-NC-SA-2.0-DE","CC-BY-NC-SA-2.0-FR","CC-BY-NC-SA-2.0-UK","CC-BY-NC-SA-2.5","CC-BY-NC-SA-3.0","CC-BY-NC-SA-3.0-DE","CC-BY-NC-SA-3.0-IGO","CC-BY-NC-SA-4.0","CC-BY-ND-1.0","CC-BY-ND-2.0","CC-BY-ND-2.5","CC-BY-ND-3.0","CC-BY-ND-3.0-DE","CC-BY-ND-4.0","CC-BY-SA-1.0","CC-BY-SA-2.0","CC-BY-SA-2.0-UK","CC-BY-SA-2.1-JP","CC-BY-SA-2.5","CC-BY-SA-3.0","CC-BY-SA-3.0-AT","CC-BY-SA-3.0-DE","CC-BY-SA-3.0-IGO","CC-BY-SA-4.0","CC-PDDC","CC-PDM-1.0","CC-SA-1.0","CC0-1.0","CDDL-1.0","CDDL-1.1","CDL-1.0","CDLA-Permissive-1.0","CDLA-Permissive-2.0","CDLA-Sharing-1.0","CECILL-1.0","CECILL-1.1","CECILL-2.0","CECILL-2.1","CECILL-B","CECILL-C","CERN-OHL-1.1","CERN-OHL-1.2","CERN-OHL-P-2.0","CERN-OHL-S-2.0","CERN-OHL-W-2.0","CFITSIO","check-cvs","checkmk","ClArtistic","Clips","CMU-Mach","CMU-Mach-nodoc","CNRI-Jython","CNRI-Python","CNRI-Python-GPL-Compatible","COIL-1.0","Community-Spec-1.0","Condor-1.1","copyleft-next-0.3.0","copyleft-next-0.3.1","Cornell-Lossless-JPEG","CPAL-1.0","CPL-1.0","CPOL-1.02","Cronyx","Crossword","CryptoSwift","CrystalStacker","CUA-OPL-1.0","Cube","curl","cve-tou","D-FSL-1.0","DEC-3-Clause","diffmark","DL-DE-BY-2.0","DL-DE-ZERO-2.0","DOC","DocBook-DTD","DocBook-Schema","DocBook-Stylesheet","DocBook-XML","Dotseqn","DRL-1.0","DRL-1.1","DSDP","dtoa","dvipdfm","ECL-1.0","ECL-2.0","eCos-2.0","EFL-1.0","EFL-2.0","eGenix","Elastic-2.0","Entessa","EPICS","EPL-1.0","EPL-2.0","ErlPL-1.1","ESA-PL-permissive-2.4","ESA-PL-strong-copyleft-2.4","ESA-PL-weak-copyleft-2.4","etalab-2.0","EUDatagrid","EUPL-1.0","EUPL-1.1","EUPL-1.2","Eurosym","Fair","FBM","FDK-AAC","Ferguson-Twofish","Frameworx-1.0","FreeBSD-DOC","FreeImage","FSFAP","FSFAP-no-warranty-disclaimer","FSFUL","FSFULLR","FSFULLRSD","FSFULLRWD","FSL-1.1-ALv2","FSL-1.1-MIT","FTL","Furuseth","fwlw","Game-Programming-Gems","GCR-docs","GD","generic-xts","GFDL-1.1","GFDL-1.1-invariants-only","GFDL-1.1-invariants-or-later","GFDL-1.1-no-invariants-only","GFDL-1.1-no-invariants-or-later","GFDL-1.1-only","GFDL-1.1-or-later","GFDL-1.2","GFDL-1.2-invariants-only","GFDL-1.2-invariants-or-later","GFDL-1.2-no-invariants-only","GFDL-1.2-no-invariants-or-later","GFDL-1.2-only","GFDL-1.2-or-later","GFDL-1.3","GFDL-1.3-invariants-only","GFDL-1.3-invariants-or-later","GFDL-1.3-no-invariants-only","GFDL-1.3-no-invariants-or-later","GFDL-1.3-only","GFDL-1.3-or-later","Giftware","GL2PS","Glide","Glulxe","GLWTPL","gnuplot","GPL-1.0","GPL-1.0-only","GPL-1.0-or-later","GPL-1.0+","GPL-2.0","GPL-2.0-only","GPL-2.0-or-later","GPL-2.0-with-autoconf-exception","GPL-2.0-with-bison-exception","GPL-2.0-with-classpath-exception","GPL-2.0-with-font-exception","GPL-2.0-with-GCC-exception","GPL-2.0+","GPL-3.0","GPL-3.0-only","GPL-3.0-or-later","GPL-3.0-with-autoconf-exception","GPL-3.0-with-GCC-exception","GPL-3.0+","Graphics-Gems","gSOAP-1.3b","gtkbook","Gutmann","HaskellReport","HDF5","hdparm","HIDAPI","Hippocratic-2.1","HP-1986","HP-1989","HPND","HPND-DEC","HPND-doc","HPND-doc-sell","HPND-export-US","HPND-export-US-acknowledgement","HPND-export-US-modify","HPND-export2-US","HPND-Fenneberg-Livingston","HPND-INRIA-IMAG","HPND-Intel","HPND-Kevlin-Henney","HPND-Markus-Kuhn","HPND-merchantability-variant","HPND-MIT-disclaimer","HPND-Netrek","HPND-Pbmplus","HPND-sell-MIT-disclaimer-xserver","HPND-sell-regexpr","HPND-sell-variant","HPND-sell-variant-critical-systems","HPND-sell-variant-MIT-disclaimer","HPND-sell-variant-MIT-disclaimer-rev","HPND-SMC","HPND-UC","HPND-UC-export-US","HTMLTIDY","hyphen-bulgarian","IBM-pibs","ICU","IEC-Code-Components-EULA","IJG","IJG-short","ImageMagick","iMatix","Imlib2","Info-ZIP","Inner-Net-2.0","InnoSetup","Intel","Intel-ACPI","Interbase-1.0","IPA","IPL-1.0","ISC","ISC-Veillard","ISO-permission","Jam","JasPer-2.0","jove","JPL-image","JPNIC","JSON","Kastrup","Kazlib","Knuth-CTAN","LAL-1.2","LAL-1.3","Latex2e","Latex2e-translated-notice","Leptonica","LGPL-2.0","LGPL-2.0-only","LGPL-2.0-or-later","LGPL-2.0+","LGPL-2.1","LGPL-2.1-only","LGPL-2.1-or-later","LGPL-2.1+","LGPL-3.0","LGPL-3.0-only","LGPL-3.0-or-later","LGPL-3.0+","LGPLLR","Libpng","libpng-1.6.35","libpng-2.0","libselinux-1.0","libtiff","libutil-David-Nugent","LiLiQ-P-1.1","LiLiQ-R-1.1","LiLiQ-Rplus-1.1","Linux-man-pages-1-para","Linux-man-pages-copyleft","Linux-man-pages-copyleft-2-para","Linux-man-pages-copyleft-var","Linux-OpenIB","LOOP","LPD-document","LPL-1.0","LPL-1.02","LPPL-1.0","LPPL-1.1","LPPL-1.2","LPPL-1.3a","LPPL-1.3c","lsof","Lucida-Bitmap-Fonts","LZMA-SDK-9.11-to-9.20","LZMA-SDK-9.22","Mackerras-3-Clause","Mackerras-3-Clause-acknowledgment","magaz","mailprio","MakeIndex","man2html","Martin-Birgmeier","McPhee-slideshow","metamail","Minpack","MIPS","MirOS","MIT","MIT-0","MIT-advertising","MIT-Click","MIT-CMU","MIT-enna","MIT-feh","MIT-Festival","MIT-Khronos-old","MIT-Modern-Variant","MIT-open-group","MIT-STK","MIT-testregex","MIT-Wu","MITNFA","MMIXware","MMPL-1.0.1","Motosoto","MPEG-SSG","mpi-permissive","mpich2","MPL-1.0","MPL-1.1","MPL-2.0","MPL-2.0-no-copyleft-exception","mplus","MS-LPL","MS-PL","MS-RL","MTLL","MulanPSL-1.0","MulanPSL-2.0","Multics","Mup","NAIST-2003","NASA-1.3","Naumen","NBPL-1.0","NCBI-PD","NCGL-UK-2.0","NCL","NCSA","Net-SNMP","NetCDF","Newsletr","NGPL","ngrep","NICTA-1.0","NIST-PD","NIST-PD-fallback","NIST-PD-TNT","NIST-Software","NLOD-1.0","NLOD-2.0","NLPL","Nokia","NOSL","Noweb","NPL-1.0","NPL-1.1","NPOSL-3.0","NRL","NTIA-PD","NTP","NTP-0","Nunit","O-UDA-1.0","OAR","OCCT-PL","OCLC-2.0","ODbL-1.0","ODC-By-1.0","OFFIS","OFL-1.0","OFL-1.0-no-RFN","OFL-1.0-RFN","OFL-1.1","OFL-1.1-no-RFN","OFL-1.1-RFN","OGC-1.0","OGDL-Taiwan-1.0","OGL-Canada-2.0","OGL-UK-1.0","OGL-UK-2.0","OGL-UK-3.0","OGTSL","OLDAP-1.1","OLDAP-1.2","OLDAP-1.3","OLDAP-1.4","OLDAP-2.0","OLDAP-2.0.1","OLDAP-2.1","OLDAP-2.2","OLDAP-2.2.1","OLDAP-2.2.2","OLDAP-2.3","OLDAP-2.4","OLDAP-2.5","OLDAP-2.6","OLDAP-2.7","OLDAP-2.8","OLFL-1.3","OML","OpenMDW-1.0","OpenPBS-2.3","OpenSSL","OpenSSL-standalone","OpenVision","OPL-1.0","OPL-UK-3.0","OPUBL-1.0","OSC-1.0","OSET-PL-2.1","OSL-1.0","OSL-1.1","OSL-2.0","OSL-2.1","OSL-3.0","OSSP","PADL","ParaType-Free-Font-1.3","Parity-6.0.0","Parity-7.0.0","PDDL-1.0","PHP-3.0","PHP-3.01","Pixar","pkgconf","Plexus","pnmstitch","PolyForm-Noncommercial-1.0.0","PolyForm-Small-Business-1.0.0","PostgreSQL","PPL","PSF-2.0","psfrag","psutils","Python-2.0","Python-2.0.1","python-ldap","Qhull","QPL-1.0","QPL-1.0-INRIA-2004","radvd","Rdisc","RHeCos-1.1","RPL-1.1","RPL-1.5","RPSL-1.0","RSA-MD","RSCPL","Ruby","Ruby-pty","SAX-PD","SAX-PD-2.0","Saxpath","SCEA","SchemeReport","Sendmail","Sendmail-8.23","Sendmail-Open-Source-1.1","SGI-B-1.0","SGI-B-1.1","SGI-B-2.0","SGI-OpenGL","SGMLUG-PM","SGP4","SHL-0.5","SHL-0.51","SimPL-2.0","SISSL","SISSL-1.2","SL","Sleepycat","SMAIL-GPL","SMLNJ","SMPPL","SNIA","snprintf","SOFA","softSurfer","Soundex","Spencer-86","Spencer-94","Spencer-99","SPL-1.0","ssh-keyscan","SSH-OpenSSH","SSH-short","SSLeay-standalone","SSPL-1.0","StandardML-NJ","SugarCRM-1.1.3","SUL-1.0","Sun-PPP","Sun-PPP-2000","SunPro","SWL","swrule","Symlinks","TAPR-OHL-1.0","TCL","TCP-wrappers","TekHVC","TermReadKey","TGPPL-1.0","ThirdEye","threeparttable","TMate","TORQUE-1.1","TOSL","TPDL","TPL-1.0","TrustedQSL","TTWL","TTYP0","TU-Berlin-1.0","TU-Berlin-2.0","Ubuntu-font-1.0","UCAR","UCL-1.0","ulem","UMich-Merit","Unicode-3.0","Unicode-DFS-2015","Unicode-DFS-2016","Unicode-TOU","UnixCrypt","Unlicense","Unlicense-libtelnet","Unlicense-libwhirlpool","UnRAR","UPL-1.0","URT-RLE","Vim","Vixie-Cron","VOSTROM","VSL-1.0","W3C","W3C-19980720","W3C-20150513","w3m","Watcom-1.0","Widget-Workshop","WordNet","Wsuipa","WTFNMFPL","WTFPL","wwl","wxWindows","X11","X11-distribute-modifications-variant","X11-no-permit-persons","X11-swapped","Xdebug-1.03","Xerox","Xfig","XFree86-1.1","xinetd","xkeyboard-config-Zinoviev","xlock","Xnet","xpp","XSkat","xzoom","YPL-1.0","YPL-1.1","Zed","Zeeff","Zend-2.0","Zimbra-1.3","Zimbra-1.4","Zlib","zlib-acknowledgement","ZPL-1.1","ZPL-2.0","ZPL-2.1"],"$comment":"Generated by scripts/update-licenses.mjs from the official SPDX License List (v3.28.0, 3.28.0, released 2026-02-20T00:00:00Z) — github.com/spdx/license-list-data, the SPDX project's own repository. Includes deprecated IDs: SPDX states these remain valid, merely discouraged for new use. See CHANGES.log #P007."},{"format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"}}]};
const schema60 = {"description":"An absolute point in time, WITH offset or Z. Used for metadata (when data was fetched) and for deadlines (when a sale or a call closes) — never for when an event happens, which is wall clock plus timezone.","type":"string","pattern":"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$","format":"date-time"};
const formats0 = formats.date;
const formats4 = formats["ote-local-date-time"];
const formats8 = formats.uri;
const formats16 = formats["ote-language-tag"];
const formats38 = formats["date-time"];
const pattern4 = new RegExp("^\\d{4}-\\d{2}-\\d{2}$", "u");
const pattern6 = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$", "u");
const pattern8 = new RegExp("^https?://[^/?#]*@", "u");
const pattern9 = new RegExp("^https?://", "u");
const pattern12 = new RegExp("\\S", "u");
const pattern18 = new RegExp("^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$", "u");
const pattern44 = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$", "u");
const func1 = ucs2lengthRuntime;
const func0 = equalRuntime;
const schema38 = {"description":"The event's images, in preference order. Two item forms on purpose: a bare URL string, which is what every 0.2 document already contains and keeps validating unchanged, and an object that adds alt text. Mixing them in one list is legal and expected — the primary image earns its alt, the extra crops of it do not need one.","type":"array","minItems":1,"items":{"oneOf":[{"type":"string","format":"uri","pattern":"^https://","not":{"pattern":"^https?://[^/?#]*@"}},{"$ref":"#/$defs/imageEntry"}]}};
const pattern14 = new RegExp("^https://", "u");
const schema39 = {"description":"One image with its description. The alt travels attached to its own URL and not in a sibling field of the event, because the entries of the list are not guaranteed to be the same picture: one alt for the whole list would describe the first image and be applied to the third. Same reason there is no positional mirror in translations — a list has no stable keys.","type":"object","required":["url"],"properties":{"url":{"description":"Absolute https URL of the image file itself, never of a page showing it. The same value the bare-string form carries.","type":"string","format":"uri","pattern":"^https://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://rustmadrid.example/img/2026-06-16x9.png"]},"alt":{"description":"What the image SHOWS, for whoever cannot see it: screen readers, text-only clients, and any render where the image fails to load. Describe the picture, not the event — the name and description are already being read out next to it, so repeating them makes a screen reader say the same thing twice. Skip \"image of\" or \"poster showing\": the client already announces it is an image. Written in the document's textLanguage, like every other free text here, and translated by this entry's own translations map: alt is read aloud with the pronunciation of the surrounding language, so an English alt inside a Spanish document is worse for accessibility than the problem it was meant to solve. Purely decorative images have no place in a feed and no empty string here — an image with nothing to say is an image left out.","type":"string","minLength":1,"pattern":"\\S","maxLength":250,"examples":["Cartel: Ferris sobre fondo morado, «Rust Madrid · 16 junio · Impact Hub»","Sala diáfana con unas 60 sillas y una pantalla al fondo"]},"translations":{"description":"This image's alt text in other languages. Local to the image it describes — never a positional mirror of the image list. Requires the document's textLanguage, like every other translations map.","$ref":"#/$defs/imageTranslations","examples":[{"en":{"alt":"Poster: Ferris on a purple background, “Rust Madrid · June 16 · Impact Hub”"}}]}},"dependentRequired":{"translations":["alt"]}};
const schema40 = {"description":"This image's alt text in other languages. Only alt is translated: the url is a file, and a file has no language.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/imageTranslation"}};
const schema43 = {"description":"One language's version of what the image shows.","type":"object","required":["alt"],"properties":{"alt":{"description":"What the image shows, in this language.","type":"string","minLength":1,"pattern":"\\S","maxLength":250,"examples":["Poster: Ferris on a purple background, “Rust Madrid · June 16 · Impact Hub”"]}}};
const schema41 = {"description":"The shape every translations map shares, wherever it appears: keys are BCP 47 tags, and an empty map is invalid — saying nothing is already done by omitting the field, the same rule location follows. Defined once so the five maps of this spec can never drift into five notions of what a language key is.","type":"object","minProperties":1,"propertyNames":{"$ref":"#/$defs/languageTag"}};

function validate26(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate26.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(Object.keys(data).length < 1){
const err0 = {instancePath,schemaPath:"#/minProperties",keyword:"minProperties",params:{limit: 1},message:"must NOT have fewer than 1 properties"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
for(const key0 in data){
const _errs1 = errors;
if(typeof key0 === "string"){
if(!pattern18.test(key0)){
const err1 = {instancePath,schemaPath:"#/$defs/languageTag/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"},message:"must match pattern \""+"^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"+"\"",propertyName:key0};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(!(formats16(key0))){
const err2 = {instancePath,schemaPath:"#/$defs/languageTag/format",keyword:"format",params:{format: "ote-language-tag"},message:"must match format \""+"ote-language-tag"+"\"",propertyName:key0};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath,schemaPath:"#/$defs/languageTag/type",keyword:"type",params:{type: "string"},message:"must be string",propertyName:key0};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var valid0 = _errs1 === errors;
if(!valid0){
const err4 = {instancePath,schemaPath:"#/propertyNames",keyword:"propertyNames",params:{propertyName: key0},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate26.errors = vErrors;
return errors === 0;
}
validate26.evaluated = {"dynamicProps":false,"dynamicItems":false};


function validate25(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate25.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate26.call(this, data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
for(const key0 in data){
let data0 = data[key0];
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.alt === undefined){
const err0 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/imageTranslation/required",keyword:"required",params:{missingProperty: "alt"},message:"must have required property '"+"alt"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data0.alt !== undefined){
let data1 = data0.alt;
if(typeof data1 === "string"){
if(func1(data1) > 250){
const err1 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/alt",schemaPath:"#/$defs/imageTranslation/properties/alt/maxLength",keyword:"maxLength",params:{limit: 250},message:"must NOT have more than 250 characters"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(func1(data1) < 1){
const err2 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/alt",schemaPath:"#/$defs/imageTranslation/properties/alt/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(!pattern12.test(data1)){
const err3 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/alt",schemaPath:"#/$defs/imageTranslation/properties/alt/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/alt",schemaPath:"#/$defs/imageTranslation/properties/alt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
else {
const err5 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/imageTranslation/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
else {
const err6 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
validate25.errors = vErrors;
return errors === 0;
}
validate25.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate24(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate24.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.url === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "url"},message:"must have required property '"+"url"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.url !== undefined){
let data0 = data.url;
const _errs3 = errors;
const _errs4 = errors;
if(typeof data0 === "string"){
if(!pattern8.test(data0)){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var valid1 = _errs4 === errors;
if(valid1){
const err2 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
if(typeof data0 === "string"){
if(!pattern14.test(data0)){
const err3 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(!(formats8(data0))){
const err4 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.alt !== undefined){
let data1 = data.alt;
if(typeof data1 === "string"){
if(func1(data1) > 250){
const err6 = {instancePath:instancePath+"/alt",schemaPath:"#/properties/alt/maxLength",keyword:"maxLength",params:{limit: 250},message:"must NOT have more than 250 characters"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(func1(data1) < 1){
const err7 = {instancePath:instancePath+"/alt",schemaPath:"#/properties/alt/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(!pattern12.test(data1)){
const err8 = {instancePath:instancePath+"/alt",schemaPath:"#/properties/alt/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/alt",schemaPath:"#/properties/alt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.translations !== undefined){
if(!(validate25.call(this, data.translations, {instancePath:instancePath+"/translations",parentData:data,parentDataProperty:"translations",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
errors = vErrors.length;
}
}
if(data.translations !== undefined){
if(data.alt === undefined){
const err10 = {instancePath,schemaPath:"#/dependentRequired",keyword:"dependentRequired",params:{property: "translations",
    missingProperty: "alt",
    depsCount: 1,
    deps: "alt"},message:"must have property alt when property translations is present"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
validate24.errors = vErrors;
return errors === 0;
}
validate24.evaluated = {"props":{"url":true,"alt":true,"translations":true},"dynamicProps":false,"dynamicItems":false};


function validate23(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate23.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(Array.isArray(data)){
if(data.length < 1){
const err0 = {instancePath,schemaPath:"#/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
const len0 = data.length;
for(let i0=0; i0<len0; i0++){
let data0 = data[i0];
const _errs2 = errors;
let valid2 = false;
let passing0 = null;
const _errs3 = errors;
const _errs5 = errors;
const _errs6 = errors;
if(typeof data0 === "string"){
if(!pattern8.test(data0)){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var valid3 = _errs6 === errors;
if(valid3){
const err2 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/oneOf/0/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
else {
errors = _errs5;
if(vErrors !== null){
if(_errs5){
vErrors.length = _errs5;
}
else {
vErrors = null;
}
}
}
if(typeof data0 === "string"){
if(!pattern14.test(data0)){
const err3 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/oneOf/0/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(!(formats8(data0))){
const err4 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/oneOf/0/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/oneOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var _valid0 = _errs3 === errors;
if(_valid0){
valid2 = true;
passing0 = 0;
}
const _errs7 = errors;
if(!(validate24.call(this, data0, {instancePath:instancePath+"/" + i0,parentData:data,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
errors = vErrors.length;
}
var _valid0 = _errs7 === errors;
if(_valid0 && valid2){
valid2 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid2 = true;
passing0 = 1;
var props0 = {};
props0.url = true;
props0.alt = true;
props0.translations = true;
}
}
if(!valid2){
const err6 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err7 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
validate23.errors = vErrors;
return errors === 0;
}
validate23.evaluated = {"items":true,"dynamicProps":false,"dynamicItems":false};

const schema44 = {"description":"Who runs the event or the feed. Kept deliberately small: a name, and where to find them.","type":"array","minItems":1,"uniqueItems":true,"items":{"$ref":"#/$defs/organizer"}};
const schema45 = {"type":"object","required":["name"],"$comment":"email is deliberately NOT in the recommended profile: an .ics importer does not always have it, and warning about a missing address would push someone into publishing contact data they chose not to publish.","properties":{"name":{"description":"Display name of the organiser.","type":"string","minLength":1,"pattern":"\\S","examples":["PyAlmería","Ada Lovelace"]},"url":{"description":"Where this organiser lives on the web — their own site, or their profile on the platform they publish from.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://pyalmeria.example","https://www.meetup.com/pyalmeria/"]},"email":{"description":"Address for enquiries about the event. A ROLE address (info@, hola@) rather than someone's personal mailbox: a feed is open and crawlable, and what goes in it cannot be unpublished. Optional and deliberately NOT recommended. It exists because without it there is no valid iCal ORGANIZER to emit (a CAL-ADDRESS is in practice a mailto:) and no RSS 2.0 <author>, which requires an email. Written bare, without the mailto: prefix — the exporter adds it. Never populate it from a source that is not itself publicly published.","type":"string","format":"email","examples":["hola@pyalmeria.example","info@gdgmadrid.example"]},"type":{"description":"Organisation or person. A translator has to pick a schema.org @type either way, and Organization is the tolerant choice.","enum":["organization","person"],"default":"organization","examples":["organization","person"]}}};
const formats20 = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

function validate31(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate31.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(Array.isArray(data)){
if(data.length < 1){
const err0 = {instancePath,schemaPath:"#/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
const len0 = data.length;
for(let i0=0; i0<len0; i0++){
let data0 = data[i0];
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.name === undefined){
const err1 = {instancePath:instancePath+"/" + i0,schemaPath:"#/$defs/organizer/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data0.name !== undefined){
let data1 = data0.name;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err2 = {instancePath:instancePath+"/" + i0+"/name",schemaPath:"#/$defs/organizer/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(!pattern12.test(data1)){
const err3 = {instancePath:instancePath+"/" + i0+"/name",schemaPath:"#/$defs/organizer/properties/name/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/" + i0+"/name",schemaPath:"#/$defs/organizer/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data0.url !== undefined){
let data2 = data0.url;
const _errs9 = errors;
const _errs10 = errors;
if(typeof data2 === "string"){
if(!pattern8.test(data2)){
const err5 = {};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
var valid4 = _errs10 === errors;
if(valid4){
const err6 = {instancePath:instancePath+"/" + i0+"/url",schemaPath:"#/$defs/organizer/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
errors = _errs9;
if(vErrors !== null){
if(_errs9){
vErrors.length = _errs9;
}
else {
vErrors = null;
}
}
}
if(typeof data2 === "string"){
if(!pattern9.test(data2)){
const err7 = {instancePath:instancePath+"/" + i0+"/url",schemaPath:"#/$defs/organizer/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(!(formats8(data2))){
const err8 = {instancePath:instancePath+"/" + i0+"/url",schemaPath:"#/$defs/organizer/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/" + i0+"/url",schemaPath:"#/$defs/organizer/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data0.email !== undefined){
let data3 = data0.email;
if(typeof data3 === "string"){
if(!(formats20.test(data3))){
const err10 = {instancePath:instancePath+"/" + i0+"/email",schemaPath:"#/$defs/organizer/properties/email/format",keyword:"format",params:{format: "email"},message:"must match format \""+"email"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/" + i0+"/email",schemaPath:"#/$defs/organizer/properties/email/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data0.type !== undefined){
let data4 = data0.type;
if(!((data4 === "organization") || (data4 === "person"))){
const err12 = {instancePath:instancePath+"/" + i0+"/type",schemaPath:"#/$defs/organizer/properties/type/enum",keyword:"enum",params:{allowedValues: schema45.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath:instancePath+"/" + i0,schemaPath:"#/$defs/organizer/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
let i1 = data.length;
let j0;
if(i1 > 1){
outer0:
for(;i1--;){
for(j0 = i1; j0--;){
if(func0(data[i1], data[j0])){
const err14 = {instancePath,schemaPath:"#/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
break outer0;
}
}
}
}
}
else {
const err15 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
validate31.errors = vErrors;
return errors === 0;
}
validate31.evaluated = {"items":true,"dynamicProps":false,"dynamicItems":false};

const schema46 = {"type":"string","anyOf":[{"$ref":"#/$defs/date"},{"$ref":"#/$defs/dateTime"}]};

function validate33(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate33.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(typeof data !== "string"){
const err0 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
const _errs1 = errors;
let valid0 = false;
const _errs2 = errors;
if(typeof data === "string"){
if(!pattern4.test(data)){
const err1 = {instancePath,schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(!(formats0.validate(data))){
const err2 = {instancePath,schemaPath:"#/$defs/date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath,schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var _valid0 = _errs2 === errors;
valid0 = valid0 || _valid0;
const _errs5 = errors;
if(typeof data === "string"){
if(!pattern6.test(data)){
const err4 = {instancePath,schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(!(formats4(data))){
const err5 = {instancePath,schemaPath:"#/$defs/dateTime/format",keyword:"format",params:{format: "ote-local-date-time"},message:"must match format \""+"ote-local-date-time"+"\""};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath,schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var _valid0 = _errs5 === errors;
valid0 = valid0 || _valid0;
if(!valid0){
const err7 = {instancePath,schemaPath:"#/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
else {
errors = _errs1;
if(vErrors !== null){
if(_errs1){
vErrors.length = _errs1;
}
else {
vErrors = null;
}
}
}
validate33.errors = vErrors;
return errors === 0;
}
validate33.evaluated = {"dynamicProps":false,"dynamicItems":false};

const schema49 = {"description":"What is KNOWN about where the event happens. Not the same question as attendanceMode, which states the organiser's intent.","type":"object","properties":{"venue":{"description":"Human-readable physical location, in one line of free text: the name of the place plus as much address as it takes to get there — how much is your call. Its presence means the event has a physical venue. It is not made redundant by address, because joining address's parts back up never gives you the name: a PostalAddress has no field for \"El Cable\" or \"Campus Madrid\", and the name is what people navigate by. In schema.org it is Place.name, a sibling of Place.address.","type":"string","minLength":1,"pattern":"\\S","examples":["El Cable, Almería","Campus Madrid, Calle de Moreno Nieto 2, Madrid"]},"address":{"description":"Postal address of the physical venue, in parts. COMPLEMENTS venue, never replaces it: venue is the one string every format can print, address is what a translator needs to emit a schema.org PostalAddress — whose subfields Google validates one by one for the Event rich result. Every part is optional; leave out what you do not know. An absent key means unknown; \"\" or null publish 'unknown' as if it were data, which is the one thing worse than saying nothing.","$ref":"#/$defs/address","examples":[{"street":"Calle de Moreno Nieto 2","locality":"Madrid","postalCode":"28005","country":"ES"},{"locality":"Almería","country":"ES"}]},"onlineUrl":{"description":"URL to attend online. Its presence means the event has online access.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://meet.example/pyalmeria"]},"geo":{"description":"Coordinates of the physical venue (WGS-84 decimal degrees). Independent of venue, which is free text — a point, not a name. Maps to iCal GEO and schema.org Place.geo (GeoCoordinates).","type":"object","required":["lat","lon"],"properties":{"lat":{"description":"Latitude in decimal degrees.","type":"number","minimum":-90,"maximum":90,"examples":[40.4168]},"lon":{"description":"Longitude in decimal degrees.","type":"number","minimum":-180,"maximum":180,"examples":[-3.7038]}}}},"anyOf":[{"required":["venue"]},{"required":["onlineUrl"]}]};
const schema50 = {"description":"A postal address in parts, mapped 1:1 onto schema.org PostalAddress. Five fields, all optional, none of them free-form enough to be a second venue: this is the machine-readable half of a location, not a prettier one.","type":"object","minProperties":1,"properties":{"street":{"description":"Street and number, as written locally. May carry a floor or a unit; it is one line of text, not a sub-object.","type":"string","minLength":1,"pattern":"\\S","examples":["Calle de Moreno Nieto 2","100 West Snickerpark Dr"]},"locality":{"description":"City, town or village.","type":"string","minLength":1,"pattern":"\\S","examples":["Madrid","Almería"]},"region":{"description":"Province, state or autonomous community — whatever level sits between locality and country in that country. Free text or an ISO 3166-2 code; both travel to schema.org addressRegion unchanged.","type":"string","minLength":1,"pattern":"\\S","examples":["Comunidad de Madrid","PA"]},"postalCode":{"description":"Postal code, as the local post office writes it. A string, never a number: leading zeros are part of it.","type":"string","minLength":1,"pattern":"\\S","examples":["28005","19019"]},"country":{"description":"A real, currently-assigned ISO 3166-1 alpha-2 code (ES, US, MX), never an invented, reserved or former one. A code and not a country name, because the name has one spelling per language: \"España\", \"Spain\" and \"Espagne\" are the same country, and a consumer grouping events by country would see three. Turning a name into a code is a table lookup, not an invention — which is why the spec asks for it here and nowhere else. Common mistake: the UK is GB, not UK — \"UK\" is not an ISO 3166-1 code.","$ref":"#/$defs/country","examples":["ES","US"]}}};
const schema51 = {"type":"string","enum":["AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA","ZM","ZW"],"$comment":"Generated by scripts/update-countries.mjs from the officially assigned ISO 3166-1 alpha-2 codes. Fetched from the Debian iso-codes project (https://salsa.debian.org/iso-codes-team/iso-codes/-/raw/main/data/iso_3166-1.json) and verified to match a human-retrieved snapshot of the ISO Online Browsing Platform (retrieved 2026-08-03 by hhkaos) before being trusted — iso.org itself returns 403 to automated requests. See CHANGES.log #P005 / DECISIONS.md D006."};

function validate37(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate37.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(Object.keys(data).length < 1){
const err0 = {instancePath,schemaPath:"#/minProperties",keyword:"minProperties",params:{limit: 1},message:"must NOT have fewer than 1 properties"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.street !== undefined){
let data0 = data.street;
if(typeof data0 === "string"){
if(func1(data0) < 1){
const err1 = {instancePath:instancePath+"/street",schemaPath:"#/properties/street/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(!pattern12.test(data0)){
const err2 = {instancePath:instancePath+"/street",schemaPath:"#/properties/street/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/street",schemaPath:"#/properties/street/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.locality !== undefined){
let data1 = data.locality;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err4 = {instancePath:instancePath+"/locality",schemaPath:"#/properties/locality/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(!pattern12.test(data1)){
const err5 = {instancePath:instancePath+"/locality",schemaPath:"#/properties/locality/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/locality",schemaPath:"#/properties/locality/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.region !== undefined){
let data2 = data.region;
if(typeof data2 === "string"){
if(func1(data2) < 1){
const err7 = {instancePath:instancePath+"/region",schemaPath:"#/properties/region/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(!pattern12.test(data2)){
const err8 = {instancePath:instancePath+"/region",schemaPath:"#/properties/region/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/region",schemaPath:"#/properties/region/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.postalCode !== undefined){
let data3 = data.postalCode;
if(typeof data3 === "string"){
if(func1(data3) < 1){
const err10 = {instancePath:instancePath+"/postalCode",schemaPath:"#/properties/postalCode/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(!pattern12.test(data3)){
const err11 = {instancePath:instancePath+"/postalCode",schemaPath:"#/properties/postalCode/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/postalCode",schemaPath:"#/properties/postalCode/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.country !== undefined){
let data4 = data.country;
if(typeof data4 !== "string"){
const err13 = {instancePath:instancePath+"/country",schemaPath:"#/$defs/country/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
let valid2;
valid2 = false;
for(const v0 of schema51.enum){
if(func0(data4, v0)){
valid2 = true;
break;
}
}
if(!valid2){
const err14 = {instancePath:instancePath+"/country",schemaPath:"#/$defs/country/enum",keyword:"enum",params:{allowedValues: schema51.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
}
else {
const err15 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
validate37.errors = vErrors;
return errors === 0;
}
validate37.evaluated = {"props":{"street":true,"locality":true,"region":true,"postalCode":true,"country":true},"dynamicProps":false,"dynamicItems":false};


function validate36(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate36.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs1 = errors;
let valid0 = false;
const _errs2 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.venue === undefined){
const err0 = {instancePath,schemaPath:"#/anyOf/0/required",keyword:"required",params:{missingProperty: "venue"},message:"must have required property '"+"venue"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs2 === errors;
valid0 = valid0 || _valid0;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.onlineUrl === undefined){
const err1 = {instancePath,schemaPath:"#/anyOf/1/required",keyword:"required",params:{missingProperty: "onlineUrl"},message:"must have required property '"+"onlineUrl"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs3 === errors;
valid0 = valid0 || _valid0;
if(!valid0){
const err2 = {instancePath,schemaPath:"#/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
else {
errors = _errs1;
if(vErrors !== null){
if(_errs1){
vErrors.length = _errs1;
}
else {
vErrors = null;
}
}
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.venue !== undefined){
let data0 = data.venue;
if(typeof data0 === "string"){
if(func1(data0) < 1){
const err3 = {instancePath:instancePath+"/venue",schemaPath:"#/properties/venue/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(!pattern12.test(data0)){
const err4 = {instancePath:instancePath+"/venue",schemaPath:"#/properties/venue/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/venue",schemaPath:"#/properties/venue/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.address !== undefined){
if(!(validate37.call(this, data.address, {instancePath:instancePath+"/address",parentData:data,parentDataProperty:"address",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
}
if(data.onlineUrl !== undefined){
let data2 = data.onlineUrl;
const _errs9 = errors;
const _errs10 = errors;
if(typeof data2 === "string"){
if(!pattern8.test(data2)){
const err6 = {};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
var valid2 = _errs10 === errors;
if(valid2){
const err7 = {instancePath:instancePath+"/onlineUrl",schemaPath:"#/properties/onlineUrl/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
else {
errors = _errs9;
if(vErrors !== null){
if(_errs9){
vErrors.length = _errs9;
}
else {
vErrors = null;
}
}
}
if(typeof data2 === "string"){
if(!pattern9.test(data2)){
const err8 = {instancePath:instancePath+"/onlineUrl",schemaPath:"#/properties/onlineUrl/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(!(formats8(data2))){
const err9 = {instancePath:instancePath+"/onlineUrl",schemaPath:"#/properties/onlineUrl/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/onlineUrl",schemaPath:"#/properties/onlineUrl/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.geo !== undefined){
let data3 = data.geo;
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
if(data3.lat === undefined){
const err11 = {instancePath:instancePath+"/geo",schemaPath:"#/properties/geo/required",keyword:"required",params:{missingProperty: "lat"},message:"must have required property '"+"lat"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data3.lon === undefined){
const err12 = {instancePath:instancePath+"/geo",schemaPath:"#/properties/geo/required",keyword:"required",params:{missingProperty: "lon"},message:"must have required property '"+"lon"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data3.lat !== undefined){
let data4 = data3.lat;
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 90 || isNaN(data4)){
const err13 = {instancePath:instancePath+"/geo/lat",schemaPath:"#/properties/geo/properties/lat/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data4 < -90 || isNaN(data4)){
const err14 = {instancePath:instancePath+"/geo/lat",schemaPath:"#/properties/geo/properties/lat/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/geo/lat",schemaPath:"#/properties/geo/properties/lat/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data3.lon !== undefined){
let data5 = data3.lon;
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 180 || isNaN(data5)){
const err16 = {instancePath:instancePath+"/geo/lon",schemaPath:"#/properties/geo/properties/lon/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data5 < -180 || isNaN(data5)){
const err17 = {instancePath:instancePath+"/geo/lon",schemaPath:"#/properties/geo/properties/lon/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/geo/lon",schemaPath:"#/properties/geo/properties/lon/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {instancePath:instancePath+"/geo",schemaPath:"#/properties/geo/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
}
else {
const err20 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
validate36.errors = vErrors;
return errors === 0;
}
validate36.evaluated = {"props":{"venue":true,"address":true,"onlineUrl":true,"geo":true},"dynamicProps":false,"dynamicItems":false};

const schema52 = {"description":"The door: whether there is a condition to get in, and what it is. An enum so a consumer can filter on it, plus a note so a human can read the part no enum can carry. It models the CONDITION, not the ticketing: no capacity, no seats left, no per-attendee approval state.","type":"object","required":["type"],"properties":{"type":{"description":"The kind of door. open: anyone may attend — including an event that sells tickets or runs out of seats, because a price and a capacity are not conditions on WHO you are. members-only: you have to belong to something first. approval-required: you sign up and the organiser DECIDES — Luma's request-to-approve, a Meetup group with an admission question, a workshop that picks a cohort. It is about a judgement on the person, never about capacity: first-come-first-served with limited seats is open, and the seats running out is offers[].availability. restricted: there IS a condition and none of the other values names it — say which in `note`, which is why the schema demands it there. Four values, kept small on purpose: a consumer that has to handle twenty doors handles none. invite-only is deliberately NOT one of them, see the spec prose.","enum":["open","members-only","approval-required","restricted"],"examples":["open","members-only","approval-required"]},"note":{"description":"The condition in words, for a person to read: which community, which university, which company. REQUIRED when type is restricted, because \"restricted\" on its own tells nobody anything; worth writing whenever the enum value alone leaves a question. This is the part that survives export to every format, inside the text.","type":"string","minLength":1,"pattern":"\\S","examples":["Miembros del Discord de Rust Girona","Solo alumnado de la Universidad de Almería"]},"url":{"description":"Where the condition is explained or met: the page to join the community, request an invitation, apply. Distinct from offers[].url, which is where a seat or money changes hands — here nothing is bought, a door is opened.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://rustgirona.example/join"]},"translations":{"description":"The note in other languages. type needs none: an enum carries no language, and a consumer renders it in the reader's.","$ref":"#/$defs/eligibilityTranslations","examples":[{"es":{"note":"Miembros del Discord de Rust Girona"}}]}},"allOf":[{"description":"restricted means \"there is a door the enum cannot name\". Without a note it names nothing, and a consumer can only show the word itself — which is how a field meant to answer \"can I go?\" ends up asking it.","if":{"type":"object","required":["type"],"properties":{"type":{"const":"restricted"}}},"then":{"type":"object","required":["note"]}}]};
const schema53 = {"description":"This condition's note in other languages. Only note is translated: type is an enum, and an enum is multilingual for free — a consumer renders members-only in the reader's language without anyone translating the data.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/eligibilityTranslation"}};
const schema54 = {"description":"One language's version of the condition in words.","type":"object","required":["note"],"properties":{"note":{"description":"The condition, in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Miembros del Discord de Rust Girona"]}}};

function validate41(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate41.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate26.call(this, data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
for(const key0 in data){
let data0 = data[key0];
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.note === undefined){
const err0 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/eligibilityTranslation/required",keyword:"required",params:{missingProperty: "note"},message:"must have required property '"+"note"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data0.note !== undefined){
let data1 = data0.note;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err1 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/note",schemaPath:"#/$defs/eligibilityTranslation/properties/note/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(!pattern12.test(data1)){
const err2 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/note",schemaPath:"#/$defs/eligibilityTranslation/properties/note/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/note",schemaPath:"#/$defs/eligibilityTranslation/properties/note/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
else {
const err4 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/eligibilityTranslation/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate41.errors = vErrors;
return errors === 0;
}
validate41.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate40(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate40.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = true;
const _errs3 = errors;
if(errors === _errs3){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.type === undefined) && (missing0 = "type")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
if(data.type !== undefined){
if("restricted" !== data.type){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
}
else {
const err2 = {};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
var _valid0 = _errs3 === errors;
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs6 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.note === undefined){
const err3 = {instancePath,schemaPath:"#/allOf/0/then/required",keyword:"required",params:{missingProperty: "note"},message:"must have required property '"+"note"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath,schemaPath:"#/allOf/0/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
var _valid0 = _errs6 === errors;
valid1 = _valid0;
}
if(!valid1){
const err5 = {instancePath,schemaPath:"#/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.type === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.type !== undefined){
let data1 = data.type;
if(!((((data1 === "open") || (data1 === "members-only")) || (data1 === "approval-required")) || (data1 === "restricted"))){
const err7 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema52.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.note !== undefined){
let data2 = data.note;
if(typeof data2 === "string"){
if(func1(data2) < 1){
const err8 = {instancePath:instancePath+"/note",schemaPath:"#/properties/note/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(!pattern12.test(data2)){
const err9 = {instancePath:instancePath+"/note",schemaPath:"#/properties/note/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/note",schemaPath:"#/properties/note/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.url !== undefined){
let data3 = data.url;
const _errs13 = errors;
const _errs14 = errors;
if(typeof data3 === "string"){
if(!pattern8.test(data3)){
const err11 = {};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
var valid4 = _errs14 === errors;
if(valid4){
const err12 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
else {
errors = _errs13;
if(vErrors !== null){
if(_errs13){
vErrors.length = _errs13;
}
else {
vErrors = null;
}
}
}
if(typeof data3 === "string"){
if(!pattern9.test(data3)){
const err13 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(!(formats8(data3))){
const err14 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.translations !== undefined){
if(!(validate41.call(this, data.translations, {instancePath:instancePath+"/translations",parentData:data,parentDataProperty:"translations",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate41.errors : vErrors.concat(validate41.errors);
errors = vErrors.length;
}
}
}
else {
const err16 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
validate40.errors = vErrors;
return errors === 0;
}
validate40.evaluated = {"props":{"type":true,"note":true,"url":true,"translations":true},"dynamicProps":false,"dynamicItems":false};

const schema57 = {"description":"Ways of attending, with their price. A list because an event may sell several kinds of ticket, and because the answer to \"is it free?\" has to survive an event that is free for students and paid for everyone else.","type":"array","minItems":1,"items":{"$ref":"#/$defs/offer"}};
const schema58 = {"description":"One way of attending: a price, a place to get it, or both. Maps 1:1 onto a schema.org Offer, which is what Google reads to show a price. It models the ticket, not the ticketing: no capacity, no seats left, no per-ticket registration state.","type":"object","properties":{"name":{"description":"What this ticket is called (\"General admission\", \"Estudiantes\"). Worth writing when there is more than one offer, noise when there is only one.","type":"string","minLength":1,"pattern":"\\S","examples":["General admission","Estudiantes"]},"price":{"description":"Amount per attendee, in `currency`. 0 means free — and it is the ONLY way to say free: an absent offers list means the price is unknown. A number, never text: no currency symbol, no thousands separator, no range and no \"desde\", because the whole reason to publish a price as data is that someone can filter and compare on it. A price that cannot be written as one number is several offers.","type":"number","minimum":0,"examples":[0,45,12.5]},"currency":{"description":"A real ISO 4217 alpha-3 code (EUR, USD, MXN), never an invented one. Only meaningful alongside `price` — it names what price is denominated in, and nothing else — so it requires `price` to be present at all, whatever its value. Required whenever `price` is above 0, and pointless at 0: free is free in every currency, and emitting one there is how Luma ends up publishing a currency for a meetup that costs nothing.","$ref":"#/$defs/currency","examples":["EUR","USD"]},"url":{"description":"Where to buy the ticket or register for this particular offer. Distinct from the event's own url: that page describes the event, this one is where money or a seat changes hands. Omit it when registration happens on the event page itself.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://devfest-levante.example/2026/entradas"]},"availability":{"description":"Whether this offer can still be taken. Absent never means available — a stale feed that keeps claiming in-stock is worse than one that says nothing. Only the two states an attendee can act on are modelled.","enum":["in-stock","sold-out"],"examples":["in-stock","sold-out"]},"waitlistUrl":{"description":"Where to join the queue for this offer once it is gone. It exists so \"gone, nothing to do\" and \"gone, but you can queue\" stop being the same document — the third thing an attendee can act on, and the reason it is a URL and not a third availability value: every consumer that already exists keeps reading sold-out, which is TRUE, instead of meeting an enum value it cannot interpret. Distinct from url, where the ticket is bought: nothing is bought in a queue.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://devfest-levante.example/2026/lista-espera"]},"opensAt":{"description":"When this offer goes on sale. An INSTANT, with offset or Z — unlike the event's own dates, which are wall clock: a sale opening is a moment a button starts working, not an hour on a poster.","$ref":"#/$defs/instant","examples":["2026-05-01T10:00:00+02:00"]},"closesAt":{"description":"When this offer stops being available. An INSTANT, with offset or Z, for the same reason as opensAt — and because \"23:59\" without an offset is the classic deadline bug.","$ref":"#/$defs/instant","examples":["2026-07-31T23:59:59+02:00"]},"translations":{"description":"This offer's name in other languages. Local to the offer it belongs to — never a positional mirror of the offers list. Requires the document's textLanguage, like every other translations map.","$ref":"#/$defs/offerTranslations","examples":[{"en":{"name":"Students"}}]}},"anyOf":[{"description":"An offer must carry a price or a link — ideally both. One with neither says nothing that omitting the whole list does not already say, the same rule location follows with venue and onlineUrl.","required":["price"]},{"required":["url"]}],"dependentRequired":{"currency":["price"]},"orderedInstants":true,"allOf":[{"description":"A waitlist for something you can still buy is not a waitlist: the queue only makes sense once the offer is gone. Availability may still be ABSENT — a publisher who knows there is a queue and does not track the ticket state should not be forced to assert sold-out to mention it. Only the incoherent combination is rejected, never the incomplete one.","if":{"type":"object","required":["waitlistUrl"]},"then":{"type":"object","properties":{"availability":{"not":{"const":"in-stock"}}}}},{"description":"A non-zero amount without a currency is not a price: 45 is a different thing in EUR, USD and MXN, and a consumer that has to guess will guess its own.","if":{"type":"object","required":["price"],"properties":{"price":{"type":"number","exclusiveMinimum":0}}},"then":{"type":"object","required":["currency"]}}]};
const schema59 = {"type":"string","enum":["AED","AFN","ALL","AMD","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BHD","BIF","BMD","BND","BOB","BOV","BRL","BSD","BTN","BWP","BYN","BZD","CAD","CDF","CHE","CHF","CHW","CLF","CLP","CNY","COP","COU","CRC","CUP","CVE","CZK","DJF","DKK","DOP","DZD","EGP","ERN","ETB","EUR","FJD","FKP","GBP","GEL","GHS","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HTG","HUF","IDR","ILS","INR","IQD","IRR","ISK","JMD","JOD","JPY","KES","KGS","KHR","KMF","KPW","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRU","MUR","MVR","MWK","MXN","MXV","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK","SGD","SHP","SLE","SOS","SRD","SSP","STN","SVC","SYP","SZL","THB","TJS","TMT","TND","TOP","TRY","TTD","TWD","TZS","UAH","UGX","USD","USN","UYI","UYU","UYW","UZS","VED","VES","VND","VUV","WST","XAD","XAF","XAG","XAU","XBA","XBB","XBC","XBD","XCD","XCG","XDR","XOF","XPD","XPF","XPT","XSU","XTS","XUA","XXX","YER","ZAR","ZMW","ZWG"],"$comment":"Generated by scripts/update-currencies.mjs from the official ISO 4217 active-currency list published by SIX Group (list-one.xml, published 2026-01-01) — not from Intl.supportedValuesOf('currency'), which lags the real registry. See CHANGES.log #P004."};
const schema62 = {"description":"This offer's name in other languages. Local to the offer, so no consumer has to line up two lists by position. It exists because offers[].name stays FREE TEXT on purpose: a kind enum (general, early-bird, student) would have been multilingual for free, and it would also have taken away the organiser's right to name their own tickets. Free text is the choice; translating it is the price.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/offerTranslation"}};
const schema63 = {"description":"One language's version of an offer's free text. Only name: price is a number, currency is a code, availability is an enum — none of them has a language.","type":"object","required":["name"],"properties":{"name":{"description":"This ticket's name in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Students","Estudiantes"]}}};

function validate47(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate47.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate26.call(this, data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
for(const key0 in data){
let data0 = data[key0];
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.name === undefined){
const err0 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/offerTranslation/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data0.name !== undefined){
let data1 = data0.name;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err1 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/name",schemaPath:"#/$defs/offerTranslation/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(!pattern12.test(data1)){
const err2 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/name",schemaPath:"#/$defs/offerTranslation/properties/name/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/name",schemaPath:"#/$defs/offerTranslation/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
else {
const err4 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/offerTranslation/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate47.errors = vErrors;
return errors === 0;
}
validate47.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const keyword1 = keywords["orderedInstants"];

function validate46(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate46.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs1 = errors;
let valid0 = false;
const _errs2 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.price === undefined){
const err0 = {instancePath,schemaPath:"#/anyOf/0/required",keyword:"required",params:{missingProperty: "price"},message:"must have required property '"+"price"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs2 === errors;
valid0 = valid0 || _valid0;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.url === undefined){
const err1 = {instancePath,schemaPath:"#/anyOf/1/required",keyword:"required",params:{missingProperty: "url"},message:"must have required property '"+"url"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs3 === errors;
valid0 = valid0 || _valid0;
if(!valid0){
const err2 = {instancePath,schemaPath:"#/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
else {
errors = _errs1;
if(vErrors !== null){
if(_errs1){
vErrors.length = _errs1;
}
else {
vErrors = null;
}
}
}
const _errs5 = errors;
let valid2 = true;
const _errs6 = errors;
if(errors === _errs6){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.waitlistUrl === undefined) && (missing0 = "waitlistUrl")){
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var _valid1 = _errs6 === errors;
errors = _errs5;
if(vErrors !== null){
if(_errs5){
vErrors.length = _errs5;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs8 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.availability !== undefined){
const _errs11 = errors;
const _errs12 = errors;
if("in-stock" !== data.availability){
const err5 = {};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var valid4 = _errs12 === errors;
if(valid4){
const err6 = {instancePath:instancePath+"/availability",schemaPath:"#/allOf/0/then/properties/availability/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
errors = _errs11;
if(vErrors !== null){
if(_errs11){
vErrors.length = _errs11;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err7 = {instancePath,schemaPath:"#/allOf/0/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var _valid1 = _errs8 === errors;
valid2 = _valid1;
if(valid2){
var props0 = {};
props0.availability = true;
}
}
if(!valid2){
const err8 = {instancePath,schemaPath:"#/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
const _errs14 = errors;
let valid5 = true;
const _errs15 = errors;
if(errors === _errs15){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((data.price === undefined) && (missing1 = "price")){
const err9 = {};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
else {
if(data.price !== undefined){
let data1 = data.price;
const _errs17 = errors;
if(errors === _errs17){
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 <= 0 || isNaN(data1)){
const err10 = {};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
}
}
}
else {
const err12 = {};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
var _valid2 = _errs15 === errors;
errors = _errs14;
if(vErrors !== null){
if(_errs14){
vErrors.length = _errs14;
}
else {
vErrors = null;
}
}
if(_valid2){
const _errs19 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.currency === undefined){
const err13 = {instancePath,schemaPath:"#/allOf/1/then/required",keyword:"required",params:{missingProperty: "currency"},message:"must have required property '"+"currency"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath,schemaPath:"#/allOf/1/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
var _valid2 = _errs19 === errors;
valid5 = _valid2;
}
if(!valid5){
const err15 = {instancePath,schemaPath:"#/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.price = true;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(props0 !== true){
props0 = props0 || {};
props0.name = true;
props0.price = true;
props0.currency = true;
props0.url = true;
props0.availability = true;
props0.waitlistUrl = true;
props0.opensAt = true;
props0.closesAt = true;
props0.translations = true;
}
if(data.name !== undefined){
let data2 = data.name;
if(typeof data2 === "string"){
if(func1(data2) < 1){
const err16 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(!pattern12.test(data2)){
const err17 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.price !== undefined){
let data3 = data.price;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 < 0 || isNaN(data3)){
const err19 = {instancePath:instancePath+"/price",schemaPath:"#/properties/price/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
else {
const err20 = {instancePath:instancePath+"/price",schemaPath:"#/properties/price/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.currency !== undefined){
let data4 = data.currency;
if(typeof data4 !== "string"){
const err21 = {instancePath:instancePath+"/currency",schemaPath:"#/$defs/currency/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(!((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((data4 === "AED") || (data4 === "AFN")) || (data4 === "ALL")) || (data4 === "AMD")) || (data4 === "AOA")) || (data4 === "ARS")) || (data4 === "AUD")) || (data4 === "AWG")) || (data4 === "AZN")) || (data4 === "BAM")) || (data4 === "BBD")) || (data4 === "BDT")) || (data4 === "BHD")) || (data4 === "BIF")) || (data4 === "BMD")) || (data4 === "BND")) || (data4 === "BOB")) || (data4 === "BOV")) || (data4 === "BRL")) || (data4 === "BSD")) || (data4 === "BTN")) || (data4 === "BWP")) || (data4 === "BYN")) || (data4 === "BZD")) || (data4 === "CAD")) || (data4 === "CDF")) || (data4 === "CHE")) || (data4 === "CHF")) || (data4 === "CHW")) || (data4 === "CLF")) || (data4 === "CLP")) || (data4 === "CNY")) || (data4 === "COP")) || (data4 === "COU")) || (data4 === "CRC")) || (data4 === "CUP")) || (data4 === "CVE")) || (data4 === "CZK")) || (data4 === "DJF")) || (data4 === "DKK")) || (data4 === "DOP")) || (data4 === "DZD")) || (data4 === "EGP")) || (data4 === "ERN")) || (data4 === "ETB")) || (data4 === "EUR")) || (data4 === "FJD")) || (data4 === "FKP")) || (data4 === "GBP")) || (data4 === "GEL")) || (data4 === "GHS")) || (data4 === "GIP")) || (data4 === "GMD")) || (data4 === "GNF")) || (data4 === "GTQ")) || (data4 === "GYD")) || (data4 === "HKD")) || (data4 === "HNL")) || (data4 === "HTG")) || (data4 === "HUF")) || (data4 === "IDR")) || (data4 === "ILS")) || (data4 === "INR")) || (data4 === "IQD")) || (data4 === "IRR")) || (data4 === "ISK")) || (data4 === "JMD")) || (data4 === "JOD")) || (data4 === "JPY")) || (data4 === "KES")) || (data4 === "KGS")) || (data4 === "KHR")) || (data4 === "KMF")) || (data4 === "KPW")) || (data4 === "KRW")) || (data4 === "KWD")) || (data4 === "KYD")) || (data4 === "KZT")) || (data4 === "LAK")) || (data4 === "LBP")) || (data4 === "LKR")) || (data4 === "LRD")) || (data4 === "LSL")) || (data4 === "LYD")) || (data4 === "MAD")) || (data4 === "MDL")) || (data4 === "MGA")) || (data4 === "MKD")) || (data4 === "MMK")) || (data4 === "MNT")) || (data4 === "MOP")) || (data4 === "MRU")) || (data4 === "MUR")) || (data4 === "MVR")) || (data4 === "MWK")) || (data4 === "MXN")) || (data4 === "MXV")) || (data4 === "MYR")) || (data4 === "MZN")) || (data4 === "NAD")) || (data4 === "NGN")) || (data4 === "NIO")) || (data4 === "NOK")) || (data4 === "NPR")) || (data4 === "NZD")) || (data4 === "OMR")) || (data4 === "PAB")) || (data4 === "PEN")) || (data4 === "PGK")) || (data4 === "PHP")) || (data4 === "PKR")) || (data4 === "PLN")) || (data4 === "PYG")) || (data4 === "QAR")) || (data4 === "RON")) || (data4 === "RSD")) || (data4 === "RUB")) || (data4 === "RWF")) || (data4 === "SAR")) || (data4 === "SBD")) || (data4 === "SCR")) || (data4 === "SDG")) || (data4 === "SEK")) || (data4 === "SGD")) || (data4 === "SHP")) || (data4 === "SLE")) || (data4 === "SOS")) || (data4 === "SRD")) || (data4 === "SSP")) || (data4 === "STN")) || (data4 === "SVC")) || (data4 === "SYP")) || (data4 === "SZL")) || (data4 === "THB")) || (data4 === "TJS")) || (data4 === "TMT")) || (data4 === "TND")) || (data4 === "TOP")) || (data4 === "TRY")) || (data4 === "TTD")) || (data4 === "TWD")) || (data4 === "TZS")) || (data4 === "UAH")) || (data4 === "UGX")) || (data4 === "USD")) || (data4 === "USN")) || (data4 === "UYI")) || (data4 === "UYU")) || (data4 === "UYW")) || (data4 === "UZS")) || (data4 === "VED")) || (data4 === "VES")) || (data4 === "VND")) || (data4 === "VUV")) || (data4 === "WST")) || (data4 === "XAD")) || (data4 === "XAF")) || (data4 === "XAG")) || (data4 === "XAU")) || (data4 === "XBA")) || (data4 === "XBB")) || (data4 === "XBC")) || (data4 === "XBD")) || (data4 === "XCD")) || (data4 === "XCG")) || (data4 === "XDR")) || (data4 === "XOF")) || (data4 === "XPD")) || (data4 === "XPF")) || (data4 === "XPT")) || (data4 === "XSU")) || (data4 === "XTS")) || (data4 === "XUA")) || (data4 === "XXX")) || (data4 === "YER")) || (data4 === "ZAR")) || (data4 === "ZMW")) || (data4 === "ZWG"))){
const err22 = {instancePath:instancePath+"/currency",schemaPath:"#/$defs/currency/enum",keyword:"enum",params:{allowedValues: schema59.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.url !== undefined){
let data5 = data.url;
const _errs31 = errors;
const _errs32 = errors;
if(typeof data5 === "string"){
if(!pattern8.test(data5)){
const err23 = {};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
var valid9 = _errs32 === errors;
if(valid9){
const err24 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
else {
errors = _errs31;
if(vErrors !== null){
if(_errs31){
vErrors.length = _errs31;
}
else {
vErrors = null;
}
}
}
if(typeof data5 === "string"){
if(!pattern9.test(data5)){
const err25 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(!(formats8(data5))){
const err26 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
else {
const err27 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data.availability !== undefined){
let data6 = data.availability;
if(!((data6 === "in-stock") || (data6 === "sold-out"))){
const err28 = {instancePath:instancePath+"/availability",schemaPath:"#/properties/availability/enum",keyword:"enum",params:{allowedValues: schema58.properties.availability.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data.waitlistUrl !== undefined){
let data7 = data.waitlistUrl;
const _errs36 = errors;
const _errs37 = errors;
if(typeof data7 === "string"){
if(!pattern8.test(data7)){
const err29 = {};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
var valid10 = _errs37 === errors;
if(valid10){
const err30 = {instancePath:instancePath+"/waitlistUrl",schemaPath:"#/properties/waitlistUrl/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
else {
errors = _errs36;
if(vErrors !== null){
if(_errs36){
vErrors.length = _errs36;
}
else {
vErrors = null;
}
}
}
if(typeof data7 === "string"){
if(!pattern9.test(data7)){
const err31 = {instancePath:instancePath+"/waitlistUrl",schemaPath:"#/properties/waitlistUrl/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(!(formats8(data7))){
const err32 = {instancePath:instancePath+"/waitlistUrl",schemaPath:"#/properties/waitlistUrl/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
else {
const err33 = {instancePath:instancePath+"/waitlistUrl",schemaPath:"#/properties/waitlistUrl/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.opensAt !== undefined){
let data8 = data.opensAt;
if(typeof data8 === "string"){
if(!pattern44.test(data8)){
const err34 = {instancePath:instancePath+"/opensAt",schemaPath:"#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(!(formats38.validate(data8))){
const err35 = {instancePath:instancePath+"/opensAt",schemaPath:"#/$defs/instant/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
else {
const err36 = {instancePath:instancePath+"/opensAt",schemaPath:"#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data.closesAt !== undefined){
let data9 = data.closesAt;
if(typeof data9 === "string"){
if(!pattern44.test(data9)){
const err37 = {instancePath:instancePath+"/closesAt",schemaPath:"#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(!(formats38.validate(data9))){
const err38 = {instancePath:instancePath+"/closesAt",schemaPath:"#/$defs/instant/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
else {
const err39 = {instancePath:instancePath+"/closesAt",schemaPath:"#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data.translations !== undefined){
if(!(validate47.call(this, data.translations, {instancePath:instancePath+"/translations",parentData:data,parentDataProperty:"translations",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate47.errors : vErrors.concat(validate47.errors);
errors = vErrors.length;
}
}
if(data.currency !== undefined){
if(data.price === undefined){
const err40 = {instancePath,schemaPath:"#/dependentRequired",keyword:"dependentRequired",params:{property: "currency",
    missingProperty: "price",
    depsCount: 1,
    deps: "price"},message:"must have property price when property currency is present"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
const _errs45 = errors;
let valid13;
keyword1.errors = null;
valid13 = keyword1.call(this, true, data, schema58, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid13){
if(Array.isArray(keyword1.errors)){
vErrors = vErrors === null ? keyword1.errors : vErrors.concat(keyword1.errors);
errors = vErrors.length;
for(let i0=_errs45; i0<errors; i0++){
const err41 = vErrors[i0];
if(err41.instancePath === undefined){
err41.instancePath = instancePath;
}
err41.schemaPath = "#/orderedInstants";
}
}
else {
const err42 = {instancePath,schemaPath:"#/orderedInstants",keyword:"orderedInstants",params:{},message:"closesAt must not be earlier than opensAt"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
}
else {
const err43 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
validate46.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate46.evaluated = {"dynamicProps":true,"dynamicItems":false};


function validate45(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate45.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(Array.isArray(data)){
if(data.length < 1){
const err0 = {instancePath,schemaPath:"#/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
const len0 = data.length;
for(let i0=0; i0<len0; i0++){
if(!(validate46.call(this, data[i0], {instancePath:instancePath+"/" + i0,parentData:data,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
errors = vErrors.length;
}
}
}
else {
const err1 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
validate45.errors = vErrors;
return errors === 0;
}
validate45.evaluated = {"items":true,"dynamicProps":false,"dynamicItems":false};

const schema64 = {"description":"An open call for proposals. One per event: unlike organizers, no real producer publishes more than one — the CFP directories that exist (confs.tech, developers.events, Sessionize) all model exactly one link and one deadline. Deliberately small: it says where to submit and until when, not what a submission looks like.","type":"object","required":["url"],"orderedInstants":true,"properties":{"url":{"description":"Where proposals are submitted — the form, or the page describing the call. Required: a CFP nobody can find is not a call, and this is the one piece of it that survives export to every format, inside the text.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://devfest-levante.example/2026/cfp"]},"opensAt":{"description":"When the call starts accepting proposals. An INSTANT, with offset or Z. Absent means it is already open — a call that has not opened yet is announced, not published.","$ref":"#/$defs/instant","examples":["2026-05-01T00:00:00+02:00"]},"closesAt":{"description":"Deadline for proposals. An INSTANT, with offset or Z, never a bare \"23:59\": which midnight it is is the whole question, and \"anywhere on Earth\" is a real answer (-12:00) that a wall-clock field could not express. Absent means unknown, not open forever — and it is what a consumer needs to answer \"which CFPs are open right now\".","$ref":"#/$defs/instant","examples":["2026-07-15T23:59:59+02:00","2026-07-15T23:59:59-12:00"]},"coversTravel":{"description":"Whether the event covers a selected speaker's travel. Absent never means false. It is here and \"call for sponsors\" is not because this is what a speaker filters on before deciding whether they can afford to submit.","type":"boolean","examples":[true]},"coversAccommodation":{"description":"Whether the event covers a selected speaker's accommodation. Same rule as coversTravel: absent means unknown.","type":"boolean","examples":[true]}}};

function validate52(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate52.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.url === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "url"},message:"must have required property '"+"url"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.url !== undefined){
let data0 = data.url;
const _errs3 = errors;
const _errs4 = errors;
if(typeof data0 === "string"){
if(!pattern8.test(data0)){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var valid1 = _errs4 === errors;
if(valid1){
const err2 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
if(typeof data0 === "string"){
if(!pattern9.test(data0)){
const err3 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(!(formats8(data0))){
const err4 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.opensAt !== undefined){
let data1 = data.opensAt;
if(typeof data1 === "string"){
if(!pattern44.test(data1)){
const err6 = {instancePath:instancePath+"/opensAt",schemaPath:"#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(!(formats38.validate(data1))){
const err7 = {instancePath:instancePath+"/opensAt",schemaPath:"#/$defs/instant/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/opensAt",schemaPath:"#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.closesAt !== undefined){
let data2 = data.closesAt;
if(typeof data2 === "string"){
if(!pattern44.test(data2)){
const err9 = {instancePath:instancePath+"/closesAt",schemaPath:"#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(!(formats38.validate(data2))){
const err10 = {instancePath:instancePath+"/closesAt",schemaPath:"#/$defs/instant/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/closesAt",schemaPath:"#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.coversTravel !== undefined){
if(typeof data.coversTravel !== "boolean"){
const err12 = {instancePath:instancePath+"/coversTravel",schemaPath:"#/properties/coversTravel/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.coversAccommodation !== undefined){
if(typeof data.coversAccommodation !== "boolean"){
const err13 = {instancePath:instancePath+"/coversAccommodation",schemaPath:"#/properties/coversAccommodation/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
const _errs15 = errors;
let valid4;
keyword1.errors = null;
valid4 = keyword1.call(this, true, data, schema64, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid4){
if(Array.isArray(keyword1.errors)){
vErrors = vErrors === null ? keyword1.errors : vErrors.concat(keyword1.errors);
errors = vErrors.length;
for(let i0=_errs15; i0<errors; i0++){
const err14 = vErrors[i0];
if(err14.instancePath === undefined){
err14.instancePath = instancePath;
}
err14.schemaPath = "#/orderedInstants";
}
}
else {
const err15 = {instancePath,schemaPath:"#/orderedInstants",keyword:"orderedInstants",params:{},message:"closesAt must not be earlier than opensAt"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
validate52.errors = vErrors;
return errors === 0;
}
validate52.evaluated = {"props":{"url":true,"opensAt":true,"closesAt":true,"coversTravel":true,"coversAccommodation":true},"dynamicProps":false,"dynamicItems":false};

const schema67 = {"description":"A reference to the whole this occurrence belongs to. Identity only — no dates: the occurrence already carries them.","type":"object","required":["id"],"properties":{"id":{"description":"Stable identifier of the series or multi-part event. Same rules as the event's id: an HTTP(S) URL under a domain the publisher controls — not necessarily one they own, a platform page (Meetup, GitHub Pages, LinkedIn) works too — minted once. It does NOT have to resolve to an OTE document — it is what lets a consumer group occurrences.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://rustmadrid.example/meetups","https://pyalmeria.example/study-jams/2026-testing"]},"name":{"description":"Display name of the series or multi-part event, so a consumer can group occurrences without resolving the id.","type":"string","minLength":1,"pattern":"\\S","examples":["Rust Madrid — meetup mensual","Study Jam de testing en Python (3 sesiones)"]},"url":{"description":"Page describing the series or the multi-part event as a whole.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://rustmadrid.example/meetups"]},"type":{"description":"series: independent occurrences that share an identity (a monthly meetup). multipart: parts of ONE event held on non-consecutive dates (a three-session study jam on non-consecutive Saturdays, one registration). series is the tolerant choice, and the choice changes the translation: a series becomes schema.org EventSeries, a multi-part event becomes an Event whose parts are its subEvent.","enum":["series","multipart"],"default":"series","examples":["series","multipart"]},"translations":{"description":"The series' display name in other languages. Its id stays untranslated — an identifier with two spellings is two series.","$ref":"#/$defs/partOfTranslations","examples":[{"es":{"name":"Sesión semanal de programación"}}]}}};
const schema68 = {"description":"The series' or multi-part event's name in other languages. The id is never translated: it is an identifier, and translating it would split one series into two.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/partOfTranslation"}};
const schema69 = {"description":"One language's version of the series' display name.","type":"object","required":["name"],"properties":{"name":{"description":"The series' or multi-part event's name in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Sesión semanal de programación"]}}};

function validate55(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate55.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate26.call(this, data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
for(const key0 in data){
let data0 = data[key0];
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.name === undefined){
const err0 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/partOfTranslation/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data0.name !== undefined){
let data1 = data0.name;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err1 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/name",schemaPath:"#/$defs/partOfTranslation/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(!pattern12.test(data1)){
const err2 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/name",schemaPath:"#/$defs/partOfTranslation/properties/name/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/name",schemaPath:"#/$defs/partOfTranslation/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
else {
const err4 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/partOfTranslation/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate55.errors = vErrors;
return errors === 0;
}
validate55.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate54(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate54.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.id !== undefined){
let data0 = data.id;
const _errs3 = errors;
const _errs4 = errors;
if(typeof data0 === "string"){
if(!pattern8.test(data0)){
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var valid1 = _errs4 === errors;
if(valid1){
const err2 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
if(typeof data0 === "string"){
if(!pattern9.test(data0)){
const err3 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(!(formats8(data0))){
const err4 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.name !== undefined){
let data1 = data.name;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err6 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(!pattern12.test(data1)){
const err7 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.url !== undefined){
let data2 = data.url;
const _errs9 = errors;
const _errs10 = errors;
if(typeof data2 === "string"){
if(!pattern8.test(data2)){
const err9 = {};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
var valid2 = _errs10 === errors;
if(valid2){
const err10 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
else {
errors = _errs9;
if(vErrors !== null){
if(_errs9){
vErrors.length = _errs9;
}
else {
vErrors = null;
}
}
}
if(typeof data2 === "string"){
if(!pattern9.test(data2)){
const err11 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(!(formats8(data2))){
const err12 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.type !== undefined){
let data3 = data.type;
if(!((data3 === "series") || (data3 === "multipart"))){
const err14 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema67.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.translations !== undefined){
if(!(validate55.call(this, data.translations, {instancePath:instancePath+"/translations",parentData:data,parentDataProperty:"translations",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate55.errors : vErrors.concat(validate55.errors);
errors = vErrors.length;
}
}
}
else {
const err15 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
validate54.errors = vErrors;
return errors === 0;
}
validate54.evaluated = {"props":{"id":true,"name":true,"url":true,"type":true,"translations":true},"dynamicProps":false,"dynamicItems":false};

const schema71 = {"type":"object","anyOf":[{"description":"Provenance has to point somewhere: a name a person can read, a URL a machine can follow, ideally both. Either alone is enough, and demanding the name would be worse than accepting the URL — an importer of an `.ics` always knows the address it fetched and often has no publisher name to read (iCalendar's X-WR-CALNAME is optional), so the requirement would be met by inventing one. A fabricated origin is worse than an origin given only as a link. Same rule as offers with price and url, and location with venue and onlineUrl.","required":["name"]},{"required":["url"]}],"properties":{"name":{"description":"Name of the origin (e.g. \"Rust Madrid\", \"Meetup\"), as a person would read it. Write it whenever the origin has a name of its own: a consumer showing where the data came from can derive a label from `url` (its host), but a derived label is a guess.","type":"string","minLength":1,"pattern":"\\S","examples":["Rust Madrid","Meetup"]},"url":{"description":"Link to the original record, so the data can be verified and corrected upstream.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://calendar.example/ics/rust-madrid"]},"license":{"description":"License under which the ORIGIN publishes the data. Constrains what may be republished: declaring a license does not grant rights the origin never gave.","$ref":"#/$defs/license","examples":["CC-BY-4.0"]},"retrievedAt":{"description":"When the data was fetched.","$ref":"#/$defs/instant","examples":["2026-06-01T05:00:00Z"]}}};

function validate59(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate59.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs1 = errors;
let valid0 = false;
const _errs2 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.name === undefined){
const err0 = {instancePath,schemaPath:"#/anyOf/0/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs2 === errors;
valid0 = valid0 || _valid0;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.url === undefined){
const err1 = {instancePath,schemaPath:"#/anyOf/1/required",keyword:"required",params:{missingProperty: "url"},message:"must have required property '"+"url"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs3 === errors;
valid0 = valid0 || _valid0;
if(!valid0){
const err2 = {instancePath,schemaPath:"#/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
else {
errors = _errs1;
if(vErrors !== null){
if(_errs1){
vErrors.length = _errs1;
}
else {
vErrors = null;
}
}
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.name !== undefined){
let data0 = data.name;
if(typeof data0 === "string"){
if(func1(data0) < 1){
const err3 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(!pattern12.test(data0)){
const err4 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.url !== undefined){
let data1 = data.url;
const _errs8 = errors;
const _errs9 = errors;
if(typeof data1 === "string"){
if(!pattern8.test(data1)){
const err6 = {};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
var valid2 = _errs9 === errors;
if(valid2){
const err7 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
else {
errors = _errs8;
if(vErrors !== null){
if(_errs8){
vErrors.length = _errs8;
}
else {
vErrors = null;
}
}
}
if(typeof data1 === "string"){
if(!pattern9.test(data1)){
const err8 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(!(formats8(data1))){
const err9 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.license !== undefined){
let data2 = data.license;
if(typeof data2 !== "string"){
const err11 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
const _errs13 = errors;
let valid4 = false;
const _errs14 = errors;
let valid5;
valid5 = false;
for(const v0 of schema70.anyOf[0].enum){
if(func0(data2, v0)){
valid5 = true;
break;
}
}
if(!valid5){
const err12 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/0/enum",keyword:"enum",params:{allowedValues: schema70.anyOf[0].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
var _valid1 = _errs14 === errors;
valid4 = valid4 || _valid1;
const _errs16 = errors;
const _errs17 = errors;
const _errs18 = errors;
if(typeof data2 === "string"){
if(!pattern8.test(data2)){
const err13 = {};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
var valid6 = _errs18 === errors;
if(valid6){
const err14 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
else {
errors = _errs17;
if(vErrors !== null){
if(_errs17){
vErrors.length = _errs17;
}
else {
vErrors = null;
}
}
}
if(typeof data2 === "string"){
if(!pattern9.test(data2)){
const err15 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(!(formats8(data2))){
const err16 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
var _valid1 = _errs16 === errors;
valid4 = valid4 || _valid1;
if(!valid4){
const err17 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
else {
errors = _errs13;
if(vErrors !== null){
if(_errs13){
vErrors.length = _errs13;
}
else {
vErrors = null;
}
}
}
}
if(data.retrievedAt !== undefined){
let data3 = data.retrievedAt;
if(typeof data3 === "string"){
if(!pattern44.test(data3)){
const err18 = {instancePath:instancePath+"/retrievedAt",schemaPath:"#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(!(formats38.validate(data3))){
const err19 = {instancePath:instancePath+"/retrievedAt",schemaPath:"#/$defs/instant/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
else {
const err20 = {instancePath:instancePath+"/retrievedAt",schemaPath:"#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
}
else {
const err21 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
validate59.errors = vErrors;
return errors === 0;
}
validate59.evaluated = {"props":{"name":true,"url":true,"license":true,"retrievedAt":true},"dynamicProps":false,"dynamicItems":false};

const schema75 = {"description":"Free text in other languages, keyed by BCP 47 tag. A map and not a list because the language IS the key: one entry per language, and no way to publish two Spanish versions that contradict each other.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/translation"}};
const schema76 = {"description":"One language's version of an event's OWN free text: name and description, the two fields every destination format prints. Not a mirror of the whole event — text that lives inside offers, eligibility or partOf is translated where it lives, by that object's own translations map. A positional mirror (translations.es.offers[0].name) is the one shape this spec refuses: a list has no stable keys, so reordering the offers would silently attach a translation to the wrong tier.","type":"object","minProperties":1,"properties":{"name":{"description":"The event's name in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Sesión semanal de programación — Rust Girona"]},"description":{"description":"The event's description in this language. Plain text or Markdown, like the field it translates.","type":"string","minLength":1,"pattern":"\\S","examples":["Cada semana nos juntamos en línea para picar Rust un rato."]}},"anyOf":[{"description":"A translation entry is only a translation if it translates something OTE recognizes. Extension fields may still ride alongside name/description — this only forbids an entry whose entire content is unrecognized, which minProperties alone cannot catch.","required":["name"]},{"required":["description"]}]};

function validate61(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate61.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate26.call(this, data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
for(const key0 in data){
let data0 = data[key0];
const _errs6 = errors;
let valid3 = false;
const _errs7 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.name === undefined){
const err0 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/translation/anyOf/0/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs7 === errors;
valid3 = valid3 || _valid0;
const _errs8 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.description === undefined){
const err1 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/translation/anyOf/1/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs8 === errors;
valid3 = valid3 || _valid0;
if(!valid3){
const err2 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/translation/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
else {
errors = _errs6;
if(vErrors !== null){
if(_errs6){
vErrors.length = _errs6;
}
else {
vErrors = null;
}
}
}
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(Object.keys(data0).length < 1){
const err3 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/translation/minProperties",keyword:"minProperties",params:{limit: 1},message:"must NOT have fewer than 1 properties"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data0.name !== undefined){
let data1 = data0.name;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err4 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/name",schemaPath:"#/$defs/translation/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(!pattern12.test(data1)){
const err5 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/name",schemaPath:"#/$defs/translation/properties/name/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/name",schemaPath:"#/$defs/translation/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data0.description !== undefined){
let data2 = data0.description;
if(typeof data2 === "string"){
if(func1(data2) < 1){
const err7 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/description",schemaPath:"#/$defs/translation/properties/description/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(!pattern12.test(data2)){
const err8 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/description",schemaPath:"#/$defs/translation/properties/description/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/description",schemaPath:"#/$defs/translation/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
else {
const err10 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/translation/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
validate61.errors = vErrors;
return errors === 0;
}
validate61.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const keyword8 = keywords["distinctLanguageTags"];
const keyword0 = keywords["orderedDates"];
const keyword2 = keywords["distinctTranslationLanguages"];
const keyword4 = keywords["distinctPartOfId"];

function validate22(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate22.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = false;
let passing0 = null;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.startDate !== undefined){
let data0 = data.startDate;
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err0 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(!(formats0.validate(data0))){
const err1 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.endDate !== undefined){
let data1 = data.endDate;
if(typeof data1 === "string"){
if(!pattern4.test(data1)){
const err3 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(!(formats0.validate(data1))){
const err4 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
else {
const err6 = {instancePath,schemaPath:"#/allOf/0/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var _valid0 = _errs3 === errors;
if(_valid0){
valid1 = true;
passing0 = 0;
var props0 = {};
props0.startDate = true;
props0.endDate = true;
}
const _errs11 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.startDate !== undefined){
let data2 = data.startDate;
if(typeof data2 === "string"){
if(!pattern6.test(data2)){
const err7 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(!(formats4(data2))){
const err8 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/format",keyword:"format",params:{format: "ote-local-date-time"},message:"must match format \""+"ote-local-date-time"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.endDate !== undefined){
let data3 = data.endDate;
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err10 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(!(formats4(data3))){
const err11 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/format",keyword:"format",params:{format: "ote-local-date-time"},message:"must match format \""+"ote-local-date-time"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath,schemaPath:"#/allOf/0/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
var _valid0 = _errs11 === errors;
if(_valid0 && valid1){
valid1 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid1 = true;
passing0 = 1;
if(props0 !== true){
props0 = props0 || {};
props0.startDate = true;
props0.endDate = true;
}
}
}
if(!valid1){
const err14 = {instancePath,schemaPath:"#/allOf/0/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
else {
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data.name === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data.startDate === undefined){
const err17 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "startDate"},message:"must have required property '"+"startDate"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data.timezone === undefined){
const err18 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "timezone"},message:"must have required property '"+"timezone"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.specVersion = true;
props0.id = true;
props0.url = true;
props0.name = true;
props0.description = true;
props0.image = true;
props0.organizers = true;
props0.startDate = true;
props0.endDate = true;
props0.timezone = true;
props0.attendanceMode = true;
props0.location = true;
props0.eligibility = true;
props0.tags = true;
props0.languages = true;
props0.textLanguage = true;
props0.offers = true;
props0.cfp = true;
props0.status = true;
props0.partOf = true;
props0.license = true;
props0.source = true;
props0.updatedAt = true;
props0.translations = true;
}
if(data.specVersion !== undefined){
if("0.3.0" !== data.specVersion){
const err19 = {instancePath:instancePath+"/specVersion",schemaPath:"#/properties/specVersion/const",keyword:"const",params:{allowedValue: "0.3.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.id !== undefined){
let data5 = data.id;
const _errs23 = errors;
const _errs24 = errors;
if(typeof data5 === "string"){
if(!pattern8.test(data5)){
const err20 = {};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
var valid9 = _errs24 === errors;
if(valid9){
const err21 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
else {
errors = _errs23;
if(vErrors !== null){
if(_errs23){
vErrors.length = _errs23;
}
else {
vErrors = null;
}
}
}
if(typeof data5 === "string"){
if(!pattern9.test(data5)){
const err22 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(!(formats8(data5))){
const err23 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
else {
const err24 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.url !== undefined){
let data6 = data.url;
const _errs27 = errors;
const _errs28 = errors;
if(typeof data6 === "string"){
if(!pattern8.test(data6)){
const err25 = {};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
var valid10 = _errs28 === errors;
if(valid10){
const err26 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
else {
errors = _errs27;
if(vErrors !== null){
if(_errs27){
vErrors.length = _errs27;
}
else {
vErrors = null;
}
}
}
if(typeof data6 === "string"){
if(!pattern9.test(data6)){
const err27 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(!(formats8(data6))){
const err28 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.name !== undefined){
let data7 = data.name;
if(typeof data7 === "string"){
if(func1(data7) < 1){
const err30 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(!pattern12.test(data7)){
const err31 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
else {
const err32 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data.description !== undefined){
if(typeof data.description !== "string"){
const err33 = {instancePath:instancePath+"/description",schemaPath:"#/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.image !== undefined){
if(!(validate23.call(this, data.image, {instancePath:instancePath+"/image",parentData:data,parentDataProperty:"image",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
}
if(data.organizers !== undefined){
if(!(validate31.call(this, data.organizers, {instancePath:instancePath+"/organizers",parentData:data,parentDataProperty:"organizers",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate31.errors : vErrors.concat(validate31.errors);
errors = vErrors.length;
}
}
if(data.startDate !== undefined){
if(!(validate33.call(this, data.startDate, {instancePath:instancePath+"/startDate",parentData:data,parentDataProperty:"startDate",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate33.errors : vErrors.concat(validate33.errors);
errors = vErrors.length;
}
}
if(data.endDate !== undefined){
if(!(validate33.call(this, data.endDate, {instancePath:instancePath+"/endDate",parentData:data,parentDataProperty:"endDate",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate33.errors : vErrors.concat(validate33.errors);
errors = vErrors.length;
}
}
if(data.timezone !== undefined){
let data13 = data.timezone;
if(typeof data13 !== "string"){
const err34 = {instancePath:instancePath+"/timezone",schemaPath:"#/properties/timezone/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
let valid11;
valid11 = false;
for(const v0 of schema33.properties.timezone.enum){
if(func0(data13, v0)){
valid11 = true;
break;
}
}
if(!valid11){
const err35 = {instancePath:instancePath+"/timezone",schemaPath:"#/properties/timezone/enum",keyword:"enum",params:{allowedValues: schema33.properties.timezone.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.attendanceMode !== undefined){
let data14 = data.attendanceMode;
if(!(((data14 === "in-person") || (data14 === "online")) || (data14 === "hybrid"))){
const err36 = {instancePath:instancePath+"/attendanceMode",schemaPath:"#/properties/attendanceMode/enum",keyword:"enum",params:{allowedValues: schema33.properties.attendanceMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data.location !== undefined){
if(!(validate36.call(this, data.location, {instancePath:instancePath+"/location",parentData:data,parentDataProperty:"location",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate36.errors : vErrors.concat(validate36.errors);
errors = vErrors.length;
}
}
if(data.eligibility !== undefined){
if(!(validate40.call(this, data.eligibility, {instancePath:instancePath+"/eligibility",parentData:data,parentDataProperty:"eligibility",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
errors = vErrors.length;
}
}
if(data.tags !== undefined){
let data17 = data.tags;
if(Array.isArray(data17)){
if(data17.length < 1){
const err37 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
const len0 = data17.length;
for(let i0=0; i0<len0; i0++){
let data18 = data17[i0];
if(typeof data18 === "string"){
if(func1(data18) < 1){
const err38 = {instancePath:instancePath+"/tags/" + i0,schemaPath:"#/properties/tags/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(!pattern12.test(data18)){
const err39 = {instancePath:instancePath+"/tags/" + i0,schemaPath:"#/properties/tags/items/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
else {
const err40 = {instancePath:instancePath+"/tags/" + i0,schemaPath:"#/properties/tags/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
let i1 = data17.length;
let j0;
if(i1 > 1){
const indices0 = {};
for(;i1--;){
let item0 = data17[i1];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
const err41 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
break;
}
indices0[item0] = i1;
}
}
}
else {
const err42 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data.languages !== undefined){
let data19 = data.languages;
if(Array.isArray(data19)){
if(data19.length < 1){
const err43 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
const len1 = data19.length;
for(let i2=0; i2<len1; i2++){
let data20 = data19[i2];
if(typeof data20 === "string"){
if(!pattern18.test(data20)){
const err44 = {instancePath:instancePath+"/languages/" + i2,schemaPath:"#/$defs/languageTag/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"},message:"must match pattern \""+"^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"+"\""};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(!(formats16(data20))){
const err45 = {instancePath:instancePath+"/languages/" + i2,schemaPath:"#/$defs/languageTag/format",keyword:"format",params:{format: "ote-language-tag"},message:"must match format \""+"ote-language-tag"+"\""};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
else {
const err46 = {instancePath:instancePath+"/languages/" + i2,schemaPath:"#/$defs/languageTag/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
let i3 = data19.length;
let j1;
if(i3 > 1){
outer0:
for(;i3--;){
for(j1 = i3; j1--;){
if(func0(data19[i3], data19[j1])){
const err47 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i3+" are identical)"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
break outer0;
}
}
}
}
const _errs53 = errors;
let valid19;
keyword8.errors = null;
valid19 = keyword8.call(this, true, data19, schema33.properties.languages, {instancePath:instancePath+"/languages",parentData:data,parentDataProperty:"languages",rootData,dynamicAnchors});
if(!valid19){
if(Array.isArray(keyword8.errors)){
vErrors = vErrors === null ? keyword8.errors : vErrors.concat(keyword8.errors);
errors = vErrors.length;
for(let i4=_errs53; i4<errors; i4++){
const err48 = vErrors[i4];
if(err48.instancePath === undefined){
err48.instancePath = instancePath+"/languages";
}
err48.schemaPath = "#/properties/languages/distinctLanguageTags";
}
}
else {
const err49 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/distinctLanguageTags",keyword:"distinctLanguageTags",params:{},message:"languages must not repeat the same language tag under different case"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
}
else {
const err50 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data.textLanguage !== undefined){
let data21 = data.textLanguage;
if(typeof data21 === "string"){
if(!pattern18.test(data21)){
const err51 = {instancePath:instancePath+"/textLanguage",schemaPath:"#/$defs/languageTag/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"},message:"must match pattern \""+"^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"+"\""};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
if(!(formats16(data21))){
const err52 = {instancePath:instancePath+"/textLanguage",schemaPath:"#/$defs/languageTag/format",keyword:"format",params:{format: "ote-language-tag"},message:"must match format \""+"ote-language-tag"+"\""};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
else {
const err53 = {instancePath:instancePath+"/textLanguage",schemaPath:"#/$defs/languageTag/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data.offers !== undefined){
if(!(validate45.call(this, data.offers, {instancePath:instancePath+"/offers",parentData:data,parentDataProperty:"offers",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate45.errors : vErrors.concat(validate45.errors);
errors = vErrors.length;
}
}
if(data.cfp !== undefined){
if(!(validate52.call(this, data.cfp, {instancePath:instancePath+"/cfp",parentData:data,parentDataProperty:"cfp",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate52.errors : vErrors.concat(validate52.errors);
errors = vErrors.length;
}
}
if(data.status !== undefined){
let data24 = data.status;
if(!((((((data24 === "scheduled") || (data24 === "tentative")) || (data24 === "cancelled")) || (data24 === "postponed")) || (data24 === "rescheduled")) || (data24 === "moved-online"))){
const err54 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema33.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data.partOf !== undefined){
if(!(validate54.call(this, data.partOf, {instancePath:instancePath+"/partOf",parentData:data,parentDataProperty:"partOf",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate54.errors : vErrors.concat(validate54.errors);
errors = vErrors.length;
}
}
if(data.license !== undefined){
let data26 = data.license;
if(typeof data26 !== "string"){
const err55 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
const _errs65 = errors;
let valid22 = false;
const _errs66 = errors;
let valid23;
valid23 = false;
for(const v1 of schema70.anyOf[0].enum){
if(func0(data26, v1)){
valid23 = true;
break;
}
}
if(!valid23){
const err56 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/0/enum",keyword:"enum",params:{allowedValues: schema70.anyOf[0].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
var _valid1 = _errs66 === errors;
valid22 = valid22 || _valid1;
const _errs68 = errors;
const _errs69 = errors;
const _errs70 = errors;
if(typeof data26 === "string"){
if(!pattern8.test(data26)){
const err57 = {};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
var valid24 = _errs70 === errors;
if(valid24){
const err58 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
else {
errors = _errs69;
if(vErrors !== null){
if(_errs69){
vErrors.length = _errs69;
}
else {
vErrors = null;
}
}
}
if(typeof data26 === "string"){
if(!pattern9.test(data26)){
const err59 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(!(formats8(data26))){
const err60 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
var _valid1 = _errs68 === errors;
valid22 = valid22 || _valid1;
if(!valid22){
const err61 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
else {
errors = _errs65;
if(vErrors !== null){
if(_errs65){
vErrors.length = _errs65;
}
else {
vErrors = null;
}
}
}
}
if(data.source !== undefined){
if(!(validate59.call(this, data.source, {instancePath:instancePath+"/source",parentData:data,parentDataProperty:"source",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate59.errors : vErrors.concat(validate59.errors);
errors = vErrors.length;
}
}
if(data.updatedAt !== undefined){
let data28 = data.updatedAt;
if(typeof data28 === "string"){
if(!pattern44.test(data28)){
const err62 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(!(formats38.validate(data28))){
const err63 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
else {
const err64 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data.translations !== undefined){
if(!(validate61.call(this, data.translations, {instancePath:instancePath+"/translations",parentData:data,parentDataProperty:"translations",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate61.errors : vErrors.concat(validate61.errors);
errors = vErrors.length;
}
}
const _errs77 = errors;
let valid26;
keyword0.errors = null;
valid26 = keyword0.call(this, true, data, schema33, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid26){
if(Array.isArray(keyword0.errors)){
vErrors = vErrors === null ? keyword0.errors : vErrors.concat(keyword0.errors);
errors = vErrors.length;
for(let i5=_errs77; i5<errors; i5++){
const err65 = vErrors[i5];
if(err65.instancePath === undefined){
err65.instancePath = instancePath;
}
err65.schemaPath = "#/orderedDates";
}
}
else {
const err66 = {instancePath,schemaPath:"#/orderedDates",keyword:"orderedDates",params:{},message:"endDate must not be earlier than startDate"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
const _errs78 = errors;
let valid27;
keyword2.errors = null;
valid27 = keyword2.call(this, true, data, schema33, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid27){
if(Array.isArray(keyword2.errors)){
vErrors = vErrors === null ? keyword2.errors : vErrors.concat(keyword2.errors);
errors = vErrors.length;
for(let i6=_errs78; i6<errors; i6++){
const err67 = vErrors[i6];
if(err67.instancePath === undefined){
err67.instancePath = instancePath;
}
err67.schemaPath = "#/distinctTranslationLanguages";
}
}
else {
const err68 = {instancePath,schemaPath:"#/distinctTranslationLanguages",keyword:"distinctTranslationLanguages",params:{},message:"a translations map must not repeat textLanguage's own language, or any of its own keys, twice"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
const _errs79 = errors;
let valid28;
keyword4.errors = null;
valid28 = keyword4.call(this, true, data, schema33, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid28){
if(Array.isArray(keyword4.errors)){
vErrors = vErrors === null ? keyword4.errors : vErrors.concat(keyword4.errors);
errors = vErrors.length;
for(let i7=_errs79; i7<errors; i7++){
const err69 = vErrors[i7];
if(err69.instancePath === undefined){
err69.instancePath = instancePath;
}
err69.schemaPath = "#/distinctPartOfId";
}
}
else {
const err70 = {instancePath,schemaPath:"#/distinctPartOfId",keyword:"distinctPartOfId",params:{},message:"partOf.id must not equal the event's own id"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
}
else {
const err71 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
validate22.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate22.evaluated = {"dynamicProps":true,"dynamicItems":false};


function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://opentechevents.org/schema/v0.3/event.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate21.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate22.call(this, data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
else {
var props0 = validate22.evaluated.props;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.specVersion === undefined){
const err0 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "specVersion"},message:"must have required property '"+"specVersion"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.license === undefined){
const err1 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
const _errs4 = errors;
let valid1 = true;
const _errs5 = errors;
if(!(data && typeof data == "object" && !Array.isArray(data))){
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
const _errs7 = errors;
let valid2 = false;
const _errs8 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.translations === undefined) && (missing0 = "translations")){
const err4 = {};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var _valid1 = _errs8 === errors;
valid2 = valid2 || _valid1;
const _errs9 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((data.eligibility === undefined) && (missing1 = "eligibility")){
const err5 = {};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
else {
if(data.eligibility !== undefined){
let data0 = data.eligibility;
const _errs10 = errors;
if(errors === _errs10){
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
let missing2;
if((data0.translations === undefined) && (missing2 = "translations")){
const err6 = {};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
}
}
}
var _valid1 = _errs9 === errors;
valid2 = valid2 || _valid1;
if(_valid1){
var props1 = {};
props1.eligibility = true;
}
const _errs12 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing3;
if((data.partOf === undefined) && (missing3 = "partOf")){
const err8 = {};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
else {
if(data.partOf !== undefined){
let data1 = data.partOf;
const _errs13 = errors;
if(errors === _errs13){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
let missing4;
if((data1.translations === undefined) && (missing4 = "translations")){
const err9 = {};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
}
}
var _valid1 = _errs12 === errors;
valid2 = valid2 || _valid1;
if(_valid1){
if(props1 !== true){
props1 = props1 || {};
props1.partOf = true;
}
}
const _errs15 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing5;
if((data.offers === undefined) && (missing5 = "offers")){
const err11 = {};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
else {
if(data.offers !== undefined){
let data2 = data.offers;
const _errs16 = errors;
if(errors === _errs16){
if(Array.isArray(data2)){
const _errs18 = errors;
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
const _errs19 = errors;
if(errors === _errs19){
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
let missing6;
if((data3.translations === undefined) && (missing6 = "translations")){
const err12 = {};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
var valid6 = _errs19 === errors;
if(valid6){
break;
}
}
if(!valid6){
const err14 = {};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
else {
errors = _errs18;
if(vErrors !== null){
if(_errs18){
vErrors.length = _errs18;
}
else {
vErrors = null;
}
}
}
}
else {
const err15 = {};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
}
}
var _valid1 = _errs15 === errors;
valid2 = valid2 || _valid1;
if(_valid1){
if(props1 !== true){
props1 = props1 || {};
props1.offers = true;
}
}
const _errs21 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing7;
if((data.image === undefined) && (missing7 = "image")){
const err16 = {};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
else {
if(data.image !== undefined){
let data4 = data.image;
const _errs22 = errors;
if(errors === _errs22){
if(Array.isArray(data4)){
const _errs24 = errors;
const len1 = data4.length;
for(let i1=0; i1<len1; i1++){
let data5 = data4[i1];
const _errs25 = errors;
if(errors === _errs25){
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
let missing8;
if((data5.translations === undefined) && (missing8 = "translations")){
const err17 = {};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
var valid8 = _errs25 === errors;
if(valid8){
break;
}
}
if(!valid8){
const err19 = {};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
else {
errors = _errs24;
if(vErrors !== null){
if(_errs24){
vErrors.length = _errs24;
}
else {
vErrors = null;
}
}
}
}
else {
const err20 = {};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
}
}
}
var _valid1 = _errs21 === errors;
valid2 = valid2 || _valid1;
if(_valid1){
if(props1 !== true){
props1 = props1 || {};
props1.image = true;
}
}
if(!valid2){
const err21 = {};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
var _valid0 = _errs5 === errors;
errors = _errs4;
if(vErrors !== null){
if(_errs4){
vErrors.length = _errs4;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs27 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.textLanguage === undefined){
const err22 = {instancePath,schemaPath:"#/allOf/2/then/required",keyword:"required",params:{missingProperty: "textLanguage"},message:"must have required property '"+"textLanguage"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath,schemaPath:"#/allOf/2/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
var _valid0 = _errs27 === errors;
valid1 = _valid0;
}
if(!valid1){
const err24 = {instancePath,schemaPath:"#/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(props0 !== true && props1 !== undefined){
if(props1 === true){
props0 = true;
}
else {
props0 = props0 || {};
Object.assign(props0, props1);
}
}
validate21.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate21.evaluated = {"dynamicProps":true,"dynamicItems":false};

export const validateFeed = validate65;
const schema77 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://opentechevents.org/schema/v0.3/feed.schema.json","title":"OTE Feed","description":"A collection of OTE events published at a stable URL. An exchange format, not an API.","type":"object","required":["specVersion","title","updatedAt","events"],"properties":{"specVersion":{"description":"Version of OTE Spec this feed adheres to. Applies to every event in it.","const":"0.3.0","examples":["0.3.0"]},"title":{"description":"Human-readable name of the feed.","type":"string","minLength":1,"pattern":"\\S","examples":["Eventos de PyAlmería"]},"description":{"description":"Short description of the feed.","type":"string","examples":["Meetups mensuales de Python en Almería."]},"url":{"description":"Canonical URL of the community, directory or organisation publishing the feed.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://pyalmeria.example"]},"textLanguage":{"description":"Language this feed's own free text is written in — title and description — and the default every event inherits when it omits its own. What makes it cheap: a monolingual publisher declares it once for the whole file and no event repeats it. Not the same as organizers: an aggregator whose events don't share one language must leave this out, exactly as it must leave out organizers, so each event states its own instead of inheriting the wrong one. Absent means unknown, never English and never the language of the HTTP response.","$ref":"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/languageTag","examples":["es","ca"]},"organizers":{"description":"Who runs the events in this feed. Not the same as title/url, which name whoever publishes the feed: an aggregator publishes events it does not organise, and must leave this out so each event states its own.","$ref":"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/organizers","examples":[[{"name":"PyAlmería","url":"https://pyalmeria.example"}]]},"license":{"description":"License for the feed's contents, and the default every event inherits when it omits its own. Optional only for an aggregator whose events carry different licenses: if this is absent, every event in the feed must declare its own license — no valid OTE document, standalone or inside any feed, may resolve to an unknown license. SPDX identifier (full list at https://spdx.org/licenses/) or URL.","$ref":"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/license","examples":["CC-BY-4.0","CC0-1.0"]},"licenseUrl":{"description":"URL of the full license text.","type":"string","format":"uri","pattern":"^https?://","not":{"pattern":"^https?://[^/?#]*@"},"examples":["https://creativecommons.org/licenses/by/4.0/"]},"updatedAt":{"description":"When this feed was generated. Never earlier than any event's own updatedAt — a feed cannot contain a revision that, by its own timestamps, didn't exist yet when it was generated.","$ref":"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/instant","examples":["2026-07-06T10:00:00Z"]},"translations":{"description":"This feed's own title and description in other languages. Its EVENTS are not translated here: each one carries its own translations, and unlike license or textLanguage this field is never inherited — a feed's title is not an event's name. Requires textLanguage, like an event's translations do — see the document's constraints.","$ref":"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/feedTranslations","examples":[{"en":{"title":"Rust Girona events","description":"Weekly online Rust coding sessions, in Catalan and Spanish."}}]},"events":{"description":"Events in this feed. Each one inherits the feed's specVersion and license unless it declares its own. No two may share an id — see the document's constraints.","type":"array","items":{"$ref":"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/event"}}},"distinctTranslationLanguages":true,"uniqueEventIds":true,"eventsNotNewerThanFeed":true,"eventsRespectInheritedTextLanguage":true,"allOf":[{"description":"Same rule as an event: a map of translations is unusable without knowing which language the primary text is in. A feed that translates its title must say what language that title is in.","if":{"type":"object","required":["translations"]},"then":{"type":"object","required":["textLanguage"]}},{"description":"license is the one default this spec never lets go missing by omission: an aggregator MAY leave feed.license out precisely because its events carry different licenses, but only if every event then declares its own — the same disciplined-omission pattern organizers/textLanguage already use for an aggregator, applied to a guarantee that is deliberately stricter than attribution or language, because redistributing data under an unknown license is a real legal risk, not just an editorial gap. CHANGES.log #P032 / DECISIONS.md D029.","if":{"type":"object","not":{"required":["license"]}},"then":{"type":"object","properties":{"events":{"type":"array","items":{"type":"object","required":["license"]}}}}}]};

function validate66(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate66.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(Array.isArray(data)){
if(data.length < 1){
const err0 = {instancePath,schemaPath:"#/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
const len0 = data.length;
for(let i0=0; i0<len0; i0++){
let data0 = data[i0];
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.name === undefined){
const err1 = {instancePath:instancePath+"/" + i0,schemaPath:"#/$defs/organizer/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data0.name !== undefined){
let data1 = data0.name;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err2 = {instancePath:instancePath+"/" + i0+"/name",schemaPath:"#/$defs/organizer/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(!pattern12.test(data1)){
const err3 = {instancePath:instancePath+"/" + i0+"/name",schemaPath:"#/$defs/organizer/properties/name/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/" + i0+"/name",schemaPath:"#/$defs/organizer/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data0.url !== undefined){
let data2 = data0.url;
const _errs9 = errors;
const _errs10 = errors;
if(typeof data2 === "string"){
if(!pattern8.test(data2)){
const err5 = {};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
var valid4 = _errs10 === errors;
if(valid4){
const err6 = {instancePath:instancePath+"/" + i0+"/url",schemaPath:"#/$defs/organizer/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
errors = _errs9;
if(vErrors !== null){
if(_errs9){
vErrors.length = _errs9;
}
else {
vErrors = null;
}
}
}
if(typeof data2 === "string"){
if(!pattern9.test(data2)){
const err7 = {instancePath:instancePath+"/" + i0+"/url",schemaPath:"#/$defs/organizer/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(!(formats8(data2))){
const err8 = {instancePath:instancePath+"/" + i0+"/url",schemaPath:"#/$defs/organizer/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/" + i0+"/url",schemaPath:"#/$defs/organizer/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data0.email !== undefined){
let data3 = data0.email;
if(typeof data3 === "string"){
if(!(formats20.test(data3))){
const err10 = {instancePath:instancePath+"/" + i0+"/email",schemaPath:"#/$defs/organizer/properties/email/format",keyword:"format",params:{format: "email"},message:"must match format \""+"email"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/" + i0+"/email",schemaPath:"#/$defs/organizer/properties/email/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data0.type !== undefined){
let data4 = data0.type;
if(!((data4 === "organization") || (data4 === "person"))){
const err12 = {instancePath:instancePath+"/" + i0+"/type",schemaPath:"#/$defs/organizer/properties/type/enum",keyword:"enum",params:{allowedValues: schema45.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath:instancePath+"/" + i0,schemaPath:"#/$defs/organizer/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
let i1 = data.length;
let j0;
if(i1 > 1){
outer0:
for(;i1--;){
for(j0 = i1; j0--;){
if(func0(data[i1], data[j0])){
const err14 = {instancePath,schemaPath:"#/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
break outer0;
}
}
}
}
}
else {
const err15 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
validate66.errors = vErrors;
return errors === 0;
}
validate66.evaluated = {"items":true,"dynamicProps":false,"dynamicItems":false};

const schema83 = {"description":"A feed's OWN title and description in other languages, keyed by BCP 47 tag. Never its events': each event carries its own translations, because each event has its own text and its own languages.","type":"object","allOf":[{"$ref":"#/$defs/languageMap"}],"additionalProperties":{"$ref":"#/$defs/feedTranslation"}};
const schema84 = {"description":"One language's version of a feed's own free text.","type":"object","minProperties":1,"properties":{"title":{"description":"The feed's title in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Rust Girona events"]},"description":{"description":"The feed's description in this language.","type":"string","minLength":1,"pattern":"\\S","examples":["Weekly online Rust coding sessions, in Catalan and Spanish."]}},"anyOf":[{"description":"Same rule as an event's own translation: extension fields may still ride alongside title/description, but an entry whose entire content is unrecognized is not a translation.","required":["title"]},{"required":["description"]}]};

function validate68(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate68.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate26.call(this, data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
for(const key0 in data){
let data0 = data[key0];
const _errs6 = errors;
let valid3 = false;
const _errs7 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.title === undefined){
const err0 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/feedTranslation/anyOf/0/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs7 === errors;
valid3 = valid3 || _valid0;
const _errs8 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.description === undefined){
const err1 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/feedTranslation/anyOf/1/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs8 === errors;
valid3 = valid3 || _valid0;
if(!valid3){
const err2 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/feedTranslation/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
else {
errors = _errs6;
if(vErrors !== null){
if(_errs6){
vErrors.length = _errs6;
}
else {
vErrors = null;
}
}
}
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(Object.keys(data0).length < 1){
const err3 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/feedTranslation/minProperties",keyword:"minProperties",params:{limit: 1},message:"must NOT have fewer than 1 properties"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data0.title !== undefined){
let data1 = data0.title;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err4 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/title",schemaPath:"#/$defs/feedTranslation/properties/title/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(!pattern12.test(data1)){
const err5 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/title",schemaPath:"#/$defs/feedTranslation/properties/title/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/title",schemaPath:"#/$defs/feedTranslation/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data0.description !== undefined){
let data2 = data0.description;
if(typeof data2 === "string"){
if(func1(data2) < 1){
const err7 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/description",schemaPath:"#/$defs/feedTranslation/properties/description/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(!pattern12.test(data2)){
const err8 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/description",schemaPath:"#/$defs/feedTranslation/properties/description/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1")+"/description",schemaPath:"#/$defs/feedTranslation/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
else {
const err10 = {instancePath:instancePath+"/" + key0.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/$defs/feedTranslation/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
validate68.errors = vErrors;
return errors === 0;
}
validate68.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate71(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate71.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = false;
let passing0 = null;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.startDate !== undefined){
let data0 = data.startDate;
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err0 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(!(formats0.validate(data0))){
const err1 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.endDate !== undefined){
let data1 = data.endDate;
if(typeof data1 === "string"){
if(!pattern4.test(data1)){
const err3 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(!(formats0.validate(data1))){
const err4 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
else {
const err6 = {instancePath,schemaPath:"#/allOf/0/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var _valid0 = _errs3 === errors;
if(_valid0){
valid1 = true;
passing0 = 0;
var props0 = {};
props0.startDate = true;
props0.endDate = true;
}
const _errs11 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.startDate !== undefined){
let data2 = data.startDate;
if(typeof data2 === "string"){
if(!pattern6.test(data2)){
const err7 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(!(formats4(data2))){
const err8 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/format",keyword:"format",params:{format: "ote-local-date-time"},message:"must match format \""+"ote-local-date-time"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.endDate !== undefined){
let data3 = data.endDate;
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err10 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(!(formats4(data3))){
const err11 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/format",keyword:"format",params:{format: "ote-local-date-time"},message:"must match format \""+"ote-local-date-time"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath,schemaPath:"#/allOf/0/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
var _valid0 = _errs11 === errors;
if(_valid0 && valid1){
valid1 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid1 = true;
passing0 = 1;
if(props0 !== true){
props0 = props0 || {};
props0.startDate = true;
props0.endDate = true;
}
}
}
if(!valid1){
const err14 = {instancePath,schemaPath:"#/allOf/0/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
else {
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data.name === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data.startDate === undefined){
const err17 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "startDate"},message:"must have required property '"+"startDate"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data.timezone === undefined){
const err18 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "timezone"},message:"must have required property '"+"timezone"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.specVersion = true;
props0.id = true;
props0.url = true;
props0.name = true;
props0.description = true;
props0.image = true;
props0.organizers = true;
props0.startDate = true;
props0.endDate = true;
props0.timezone = true;
props0.attendanceMode = true;
props0.location = true;
props0.eligibility = true;
props0.tags = true;
props0.languages = true;
props0.textLanguage = true;
props0.offers = true;
props0.cfp = true;
props0.status = true;
props0.partOf = true;
props0.license = true;
props0.source = true;
props0.updatedAt = true;
props0.translations = true;
}
if(data.specVersion !== undefined){
if("0.3.0" !== data.specVersion){
const err19 = {instancePath:instancePath+"/specVersion",schemaPath:"#/properties/specVersion/const",keyword:"const",params:{allowedValue: "0.3.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.id !== undefined){
let data5 = data.id;
const _errs23 = errors;
const _errs24 = errors;
if(typeof data5 === "string"){
if(!pattern8.test(data5)){
const err20 = {};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
var valid9 = _errs24 === errors;
if(valid9){
const err21 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
else {
errors = _errs23;
if(vErrors !== null){
if(_errs23){
vErrors.length = _errs23;
}
else {
vErrors = null;
}
}
}
if(typeof data5 === "string"){
if(!pattern9.test(data5)){
const err22 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(!(formats8(data5))){
const err23 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
else {
const err24 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.url !== undefined){
let data6 = data.url;
const _errs27 = errors;
const _errs28 = errors;
if(typeof data6 === "string"){
if(!pattern8.test(data6)){
const err25 = {};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
var valid10 = _errs28 === errors;
if(valid10){
const err26 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
else {
errors = _errs27;
if(vErrors !== null){
if(_errs27){
vErrors.length = _errs27;
}
else {
vErrors = null;
}
}
}
if(typeof data6 === "string"){
if(!pattern9.test(data6)){
const err27 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(!(formats8(data6))){
const err28 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.name !== undefined){
let data7 = data.name;
if(typeof data7 === "string"){
if(func1(data7) < 1){
const err30 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(!pattern12.test(data7)){
const err31 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
else {
const err32 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data.description !== undefined){
if(typeof data.description !== "string"){
const err33 = {instancePath:instancePath+"/description",schemaPath:"#/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.image !== undefined){
if(!(validate23.call(this, data.image, {instancePath:instancePath+"/image",parentData:data,parentDataProperty:"image",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
}
if(data.organizers !== undefined){
if(!(validate31.call(this, data.organizers, {instancePath:instancePath+"/organizers",parentData:data,parentDataProperty:"organizers",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate31.errors : vErrors.concat(validate31.errors);
errors = vErrors.length;
}
}
if(data.startDate !== undefined){
if(!(validate33.call(this, data.startDate, {instancePath:instancePath+"/startDate",parentData:data,parentDataProperty:"startDate",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate33.errors : vErrors.concat(validate33.errors);
errors = vErrors.length;
}
}
if(data.endDate !== undefined){
if(!(validate33.call(this, data.endDate, {instancePath:instancePath+"/endDate",parentData:data,parentDataProperty:"endDate",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate33.errors : vErrors.concat(validate33.errors);
errors = vErrors.length;
}
}
if(data.timezone !== undefined){
let data13 = data.timezone;
if(typeof data13 !== "string"){
const err34 = {instancePath:instancePath+"/timezone",schemaPath:"#/properties/timezone/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
let valid11;
valid11 = false;
for(const v0 of schema33.properties.timezone.enum){
if(func0(data13, v0)){
valid11 = true;
break;
}
}
if(!valid11){
const err35 = {instancePath:instancePath+"/timezone",schemaPath:"#/properties/timezone/enum",keyword:"enum",params:{allowedValues: schema33.properties.timezone.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.attendanceMode !== undefined){
let data14 = data.attendanceMode;
if(!(((data14 === "in-person") || (data14 === "online")) || (data14 === "hybrid"))){
const err36 = {instancePath:instancePath+"/attendanceMode",schemaPath:"#/properties/attendanceMode/enum",keyword:"enum",params:{allowedValues: schema33.properties.attendanceMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data.location !== undefined){
if(!(validate36.call(this, data.location, {instancePath:instancePath+"/location",parentData:data,parentDataProperty:"location",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate36.errors : vErrors.concat(validate36.errors);
errors = vErrors.length;
}
}
if(data.eligibility !== undefined){
if(!(validate40.call(this, data.eligibility, {instancePath:instancePath+"/eligibility",parentData:data,parentDataProperty:"eligibility",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
errors = vErrors.length;
}
}
if(data.tags !== undefined){
let data17 = data.tags;
if(Array.isArray(data17)){
if(data17.length < 1){
const err37 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
const len0 = data17.length;
for(let i0=0; i0<len0; i0++){
let data18 = data17[i0];
if(typeof data18 === "string"){
if(func1(data18) < 1){
const err38 = {instancePath:instancePath+"/tags/" + i0,schemaPath:"#/properties/tags/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(!pattern12.test(data18)){
const err39 = {instancePath:instancePath+"/tags/" + i0,schemaPath:"#/properties/tags/items/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
else {
const err40 = {instancePath:instancePath+"/tags/" + i0,schemaPath:"#/properties/tags/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
let i1 = data17.length;
let j0;
if(i1 > 1){
const indices0 = {};
for(;i1--;){
let item0 = data17[i1];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
const err41 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
break;
}
indices0[item0] = i1;
}
}
}
else {
const err42 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data.languages !== undefined){
let data19 = data.languages;
if(Array.isArray(data19)){
if(data19.length < 1){
const err43 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
const len1 = data19.length;
for(let i2=0; i2<len1; i2++){
let data20 = data19[i2];
if(typeof data20 === "string"){
if(!pattern18.test(data20)){
const err44 = {instancePath:instancePath+"/languages/" + i2,schemaPath:"#/$defs/languageTag/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"},message:"must match pattern \""+"^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"+"\""};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(!(formats16(data20))){
const err45 = {instancePath:instancePath+"/languages/" + i2,schemaPath:"#/$defs/languageTag/format",keyword:"format",params:{format: "ote-language-tag"},message:"must match format \""+"ote-language-tag"+"\""};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
else {
const err46 = {instancePath:instancePath+"/languages/" + i2,schemaPath:"#/$defs/languageTag/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
let i3 = data19.length;
let j1;
if(i3 > 1){
outer0:
for(;i3--;){
for(j1 = i3; j1--;){
if(func0(data19[i3], data19[j1])){
const err47 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i3+" are identical)"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
break outer0;
}
}
}
}
const _errs53 = errors;
let valid19;
keyword8.errors = null;
valid19 = keyword8.call(this, true, data19, schema33.properties.languages, {instancePath:instancePath+"/languages",parentData:data,parentDataProperty:"languages",rootData,dynamicAnchors});
if(!valid19){
if(Array.isArray(keyword8.errors)){
vErrors = vErrors === null ? keyword8.errors : vErrors.concat(keyword8.errors);
errors = vErrors.length;
for(let i4=_errs53; i4<errors; i4++){
const err48 = vErrors[i4];
if(err48.instancePath === undefined){
err48.instancePath = instancePath+"/languages";
}
err48.schemaPath = "#/properties/languages/distinctLanguageTags";
}
}
else {
const err49 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/distinctLanguageTags",keyword:"distinctLanguageTags",params:{},message:"languages must not repeat the same language tag under different case"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
}
else {
const err50 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data.textLanguage !== undefined){
let data21 = data.textLanguage;
if(typeof data21 === "string"){
if(!pattern18.test(data21)){
const err51 = {instancePath:instancePath+"/textLanguage",schemaPath:"#/$defs/languageTag/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"},message:"must match pattern \""+"^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"+"\""};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
if(!(formats16(data21))){
const err52 = {instancePath:instancePath+"/textLanguage",schemaPath:"#/$defs/languageTag/format",keyword:"format",params:{format: "ote-language-tag"},message:"must match format \""+"ote-language-tag"+"\""};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
else {
const err53 = {instancePath:instancePath+"/textLanguage",schemaPath:"#/$defs/languageTag/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data.offers !== undefined){
if(!(validate45.call(this, data.offers, {instancePath:instancePath+"/offers",parentData:data,parentDataProperty:"offers",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate45.errors : vErrors.concat(validate45.errors);
errors = vErrors.length;
}
}
if(data.cfp !== undefined){
if(!(validate52.call(this, data.cfp, {instancePath:instancePath+"/cfp",parentData:data,parentDataProperty:"cfp",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate52.errors : vErrors.concat(validate52.errors);
errors = vErrors.length;
}
}
if(data.status !== undefined){
let data24 = data.status;
if(!((((((data24 === "scheduled") || (data24 === "tentative")) || (data24 === "cancelled")) || (data24 === "postponed")) || (data24 === "rescheduled")) || (data24 === "moved-online"))){
const err54 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema33.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data.partOf !== undefined){
if(!(validate54.call(this, data.partOf, {instancePath:instancePath+"/partOf",parentData:data,parentDataProperty:"partOf",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate54.errors : vErrors.concat(validate54.errors);
errors = vErrors.length;
}
}
if(data.license !== undefined){
let data26 = data.license;
if(typeof data26 !== "string"){
const err55 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
const _errs65 = errors;
let valid22 = false;
const _errs66 = errors;
let valid23;
valid23 = false;
for(const v1 of schema70.anyOf[0].enum){
if(func0(data26, v1)){
valid23 = true;
break;
}
}
if(!valid23){
const err56 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/0/enum",keyword:"enum",params:{allowedValues: schema70.anyOf[0].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
var _valid1 = _errs66 === errors;
valid22 = valid22 || _valid1;
const _errs68 = errors;
const _errs69 = errors;
const _errs70 = errors;
if(typeof data26 === "string"){
if(!pattern8.test(data26)){
const err57 = {};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
var valid24 = _errs70 === errors;
if(valid24){
const err58 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
else {
errors = _errs69;
if(vErrors !== null){
if(_errs69){
vErrors.length = _errs69;
}
else {
vErrors = null;
}
}
}
if(typeof data26 === "string"){
if(!pattern9.test(data26)){
const err59 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(!(formats8(data26))){
const err60 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
var _valid1 = _errs68 === errors;
valid22 = valid22 || _valid1;
if(!valid22){
const err61 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
else {
errors = _errs65;
if(vErrors !== null){
if(_errs65){
vErrors.length = _errs65;
}
else {
vErrors = null;
}
}
}
}
if(data.source !== undefined){
if(!(validate59.call(this, data.source, {instancePath:instancePath+"/source",parentData:data,parentDataProperty:"source",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate59.errors : vErrors.concat(validate59.errors);
errors = vErrors.length;
}
}
if(data.updatedAt !== undefined){
let data28 = data.updatedAt;
if(typeof data28 === "string"){
if(!pattern44.test(data28)){
const err62 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(!(formats38.validate(data28))){
const err63 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
else {
const err64 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data.translations !== undefined){
if(!(validate61.call(this, data.translations, {instancePath:instancePath+"/translations",parentData:data,parentDataProperty:"translations",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate61.errors : vErrors.concat(validate61.errors);
errors = vErrors.length;
}
}
const _errs77 = errors;
let valid26;
keyword0.errors = null;
valid26 = keyword0.call(this, true, data, schema33, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid26){
if(Array.isArray(keyword0.errors)){
vErrors = vErrors === null ? keyword0.errors : vErrors.concat(keyword0.errors);
errors = vErrors.length;
for(let i5=_errs77; i5<errors; i5++){
const err65 = vErrors[i5];
if(err65.instancePath === undefined){
err65.instancePath = instancePath;
}
err65.schemaPath = "#/orderedDates";
}
}
else {
const err66 = {instancePath,schemaPath:"#/orderedDates",keyword:"orderedDates",params:{},message:"endDate must not be earlier than startDate"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
const _errs78 = errors;
let valid27;
keyword2.errors = null;
valid27 = keyword2.call(this, true, data, schema33, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid27){
if(Array.isArray(keyword2.errors)){
vErrors = vErrors === null ? keyword2.errors : vErrors.concat(keyword2.errors);
errors = vErrors.length;
for(let i6=_errs78; i6<errors; i6++){
const err67 = vErrors[i6];
if(err67.instancePath === undefined){
err67.instancePath = instancePath;
}
err67.schemaPath = "#/distinctTranslationLanguages";
}
}
else {
const err68 = {instancePath,schemaPath:"#/distinctTranslationLanguages",keyword:"distinctTranslationLanguages",params:{},message:"a translations map must not repeat textLanguage's own language, or any of its own keys, twice"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
const _errs79 = errors;
let valid28;
keyword4.errors = null;
valid28 = keyword4.call(this, true, data, schema33, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid28){
if(Array.isArray(keyword4.errors)){
vErrors = vErrors === null ? keyword4.errors : vErrors.concat(keyword4.errors);
errors = vErrors.length;
for(let i7=_errs79; i7<errors; i7++){
const err69 = vErrors[i7];
if(err69.instancePath === undefined){
err69.instancePath = instancePath;
}
err69.schemaPath = "#/distinctPartOfId";
}
}
else {
const err70 = {instancePath,schemaPath:"#/distinctPartOfId",keyword:"distinctPartOfId",params:{},message:"partOf.id must not equal the event's own id"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
}
else {
const err71 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
validate71.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate71.evaluated = {"dynamicProps":true,"dynamicItems":false};

const keyword3 = keywords["uniqueEventIds"];
const keyword5 = keywords["eventsNotNewerThanFeed"];
const keyword6 = keywords["eventsRespectInheritedTextLanguage"];

function validate65(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://opentechevents.org/schema/v0.3/feed.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate65.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = true;
const _errs3 = errors;
if(errors === _errs3){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.translations === undefined) && (missing0 = "translations")){
const err0 = {};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs3 === errors;
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs5 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.textLanguage === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/0/then/required",keyword:"required",params:{missingProperty: "textLanguage"},message:"must have required property '"+"textLanguage"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath,schemaPath:"#/allOf/0/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var _valid0 = _errs5 === errors;
valid1 = _valid0;
}
if(!valid1){
const err4 = {instancePath,schemaPath:"#/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
const _errs8 = errors;
let valid2 = true;
const _errs9 = errors;
if(!(data && typeof data == "object" && !Array.isArray(data))){
const err5 = {};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
const _errs11 = errors;
const _errs12 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((data.license === undefined) && (missing1 = "license")){
const err6 = {};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
var valid3 = _errs12 === errors;
if(valid3){
const err7 = {};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
else {
errors = _errs11;
if(vErrors !== null){
if(_errs11){
vErrors.length = _errs11;
}
else {
vErrors = null;
}
}
}
var _valid1 = _errs9 === errors;
errors = _errs8;
if(vErrors !== null){
if(_errs8){
vErrors.length = _errs8;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs13 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.events !== undefined){
let data0 = data.events;
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
let data1 = data0[i0];
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.license === undefined){
const err8 = {instancePath:instancePath+"/events/" + i0,schemaPath:"#/allOf/1/then/properties/events/items/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/events/" + i0,schemaPath:"#/allOf/1/then/properties/events/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
else {
const err10 = {instancePath:instancePath+"/events",schemaPath:"#/allOf/1/then/properties/events/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath,schemaPath:"#/allOf/1/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
var _valid1 = _errs13 === errors;
valid2 = _valid1;
if(valid2){
var props0 = {};
props0.events = true;
}
}
if(!valid2){
const err12 = {instancePath,schemaPath:"#/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.specVersion === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "specVersion"},message:"must have required property '"+"specVersion"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.title === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data.updatedAt === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "updatedAt"},message:"must have required property '"+"updatedAt"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data.events === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "events"},message:"must have required property '"+"events"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.specVersion = true;
props0.title = true;
props0.description = true;
props0.url = true;
props0.textLanguage = true;
props0.organizers = true;
props0.license = true;
props0.licenseUrl = true;
props0.updatedAt = true;
props0.translations = true;
props0.events = true;
}
if(data.specVersion !== undefined){
if("0.3.0" !== data.specVersion){
const err17 = {instancePath:instancePath+"/specVersion",schemaPath:"#/properties/specVersion/const",keyword:"const",params:{allowedValue: "0.3.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.title !== undefined){
let data3 = data.title;
if(typeof data3 === "string"){
if(func1(data3) < 1){
const err18 = {instancePath:instancePath+"/title",schemaPath:"#/properties/title/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(!pattern12.test(data3)){
const err19 = {instancePath:instancePath+"/title",schemaPath:"#/properties/title/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
else {
const err20 = {instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.description !== undefined){
if(typeof data.description !== "string"){
const err21 = {instancePath:instancePath+"/description",schemaPath:"#/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.url !== undefined){
let data5 = data.url;
const _errs26 = errors;
const _errs27 = errors;
if(typeof data5 === "string"){
if(!pattern8.test(data5)){
const err22 = {};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
var valid8 = _errs27 === errors;
if(valid8){
const err23 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
else {
errors = _errs26;
if(vErrors !== null){
if(_errs26){
vErrors.length = _errs26;
}
else {
vErrors = null;
}
}
}
if(typeof data5 === "string"){
if(!pattern9.test(data5)){
const err24 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(!(formats8(data5))){
const err25 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
else {
const err26 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data.textLanguage !== undefined){
let data6 = data.textLanguage;
if(typeof data6 === "string"){
if(!pattern18.test(data6)){
const err27 = {instancePath:instancePath+"/textLanguage",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/languageTag/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"},message:"must match pattern \""+"^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"+"\""};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(!(formats16(data6))){
const err28 = {instancePath:instancePath+"/textLanguage",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/languageTag/format",keyword:"format",params:{format: "ote-language-tag"},message:"must match format \""+"ote-language-tag"+"\""};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/textLanguage",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/languageTag/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.organizers !== undefined){
if(!(validate66.call(this, data.organizers, {instancePath:instancePath+"/organizers",parentData:data,parentDataProperty:"organizers",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate66.errors : vErrors.concat(validate66.errors);
errors = vErrors.length;
}
}
if(data.license !== undefined){
let data8 = data.license;
if(typeof data8 !== "string"){
const err30 = {instancePath:instancePath+"/license",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
const _errs35 = errors;
let valid11 = false;
const _errs36 = errors;
let valid12;
valid12 = false;
for(const v0 of schema70.anyOf[0].enum){
if(func0(data8, v0)){
valid12 = true;
break;
}
}
if(!valid12){
const err31 = {instancePath:instancePath+"/license",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/license/anyOf/0/enum",keyword:"enum",params:{allowedValues: schema70.anyOf[0].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
var _valid2 = _errs36 === errors;
valid11 = valid11 || _valid2;
const _errs38 = errors;
const _errs39 = errors;
const _errs40 = errors;
if(typeof data8 === "string"){
if(!pattern8.test(data8)){
const err32 = {};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
var valid13 = _errs40 === errors;
if(valid13){
const err33 = {instancePath:instancePath+"/license",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/license/anyOf/1/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
else {
errors = _errs39;
if(vErrors !== null){
if(_errs39){
vErrors.length = _errs39;
}
else {
vErrors = null;
}
}
}
if(typeof data8 === "string"){
if(!pattern9.test(data8)){
const err34 = {instancePath:instancePath+"/license",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/license/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(!(formats8(data8))){
const err35 = {instancePath:instancePath+"/license",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/license/anyOf/1/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
var _valid2 = _errs38 === errors;
valid11 = valid11 || _valid2;
if(!valid11){
const err36 = {instancePath:instancePath+"/license",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/license/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
else {
errors = _errs35;
if(vErrors !== null){
if(_errs35){
vErrors.length = _errs35;
}
else {
vErrors = null;
}
}
}
}
if(data.licenseUrl !== undefined){
let data9 = data.licenseUrl;
const _errs43 = errors;
const _errs44 = errors;
if(typeof data9 === "string"){
if(!pattern8.test(data9)){
const err37 = {};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
var valid14 = _errs44 === errors;
if(valid14){
const err38 = {instancePath:instancePath+"/licenseUrl",schemaPath:"#/properties/licenseUrl/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
else {
errors = _errs43;
if(vErrors !== null){
if(_errs43){
vErrors.length = _errs43;
}
else {
vErrors = null;
}
}
}
if(typeof data9 === "string"){
if(!pattern9.test(data9)){
const err39 = {instancePath:instancePath+"/licenseUrl",schemaPath:"#/properties/licenseUrl/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(!(formats8(data9))){
const err40 = {instancePath:instancePath+"/licenseUrl",schemaPath:"#/properties/licenseUrl/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
else {
const err41 = {instancePath:instancePath+"/licenseUrl",schemaPath:"#/properties/licenseUrl/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data.updatedAt !== undefined){
let data10 = data.updatedAt;
if(typeof data10 === "string"){
if(!pattern44.test(data10)){
const err42 = {instancePath:instancePath+"/updatedAt",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(!(formats38.validate(data10))){
const err43 = {instancePath:instancePath+"/updatedAt",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/instant/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
else {
const err44 = {instancePath:instancePath+"/updatedAt",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data.translations !== undefined){
if(!(validate68.call(this, data.translations, {instancePath:instancePath+"/translations",parentData:data,parentDataProperty:"translations",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate68.errors : vErrors.concat(validate68.errors);
errors = vErrors.length;
}
}
if(data.events !== undefined){
let data12 = data.events;
if(Array.isArray(data12)){
const len1 = data12.length;
for(let i1=0; i1<len1; i1++){
if(!(validate71.call(this, data12[i1], {instancePath:instancePath+"/events/" + i1,parentData:data12,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate71.errors : vErrors.concat(validate71.errors);
errors = vErrors.length;
}
}
}
else {
const err45 = {instancePath:instancePath+"/events",schemaPath:"#/properties/events/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
const _errs52 = errors;
let valid18;
keyword2.errors = null;
valid18 = keyword2.call(this, true, data, schema77, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid18){
if(Array.isArray(keyword2.errors)){
vErrors = vErrors === null ? keyword2.errors : vErrors.concat(keyword2.errors);
errors = vErrors.length;
for(let i2=_errs52; i2<errors; i2++){
const err46 = vErrors[i2];
if(err46.instancePath === undefined){
err46.instancePath = instancePath;
}
err46.schemaPath = "#/distinctTranslationLanguages";
}
}
else {
const err47 = {instancePath,schemaPath:"#/distinctTranslationLanguages",keyword:"distinctTranslationLanguages",params:{},message:"a translations map must not repeat textLanguage's own language, or any of its own keys, twice"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
const _errs53 = errors;
let valid19;
keyword3.errors = null;
valid19 = keyword3.call(this, true, data, schema77, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid19){
if(Array.isArray(keyword3.errors)){
vErrors = vErrors === null ? keyword3.errors : vErrors.concat(keyword3.errors);
errors = vErrors.length;
for(let i3=_errs53; i3<errors; i3++){
const err48 = vErrors[i3];
if(err48.instancePath === undefined){
err48.instancePath = instancePath;
}
err48.schemaPath = "#/uniqueEventIds";
}
}
else {
const err49 = {instancePath,schemaPath:"#/uniqueEventIds",keyword:"uniqueEventIds",params:{},message:"events must not repeat the same id"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
const _errs54 = errors;
let valid20;
keyword5.errors = null;
valid20 = keyword5.call(this, true, data, schema77, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid20){
if(Array.isArray(keyword5.errors)){
vErrors = vErrors === null ? keyword5.errors : vErrors.concat(keyword5.errors);
errors = vErrors.length;
for(let i4=_errs54; i4<errors; i4++){
const err50 = vErrors[i4];
if(err50.instancePath === undefined){
err50.instancePath = instancePath;
}
err50.schemaPath = "#/eventsNotNewerThanFeed";
}
}
else {
const err51 = {instancePath,schemaPath:"#/eventsNotNewerThanFeed",keyword:"eventsNotNewerThanFeed",params:{},message:"no event may be updated after the feed itself was generated"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
const _errs55 = errors;
let valid21;
keyword6.errors = null;
valid21 = keyword6.call(this, true, data, schema77, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid21){
if(Array.isArray(keyword6.errors)){
vErrors = vErrors === null ? keyword6.errors : vErrors.concat(keyword6.errors);
errors = vErrors.length;
for(let i5=_errs55; i5<errors; i5++){
const err52 = vErrors[i5];
if(err52.instancePath === undefined){
err52.instancePath = instancePath;
}
err52.schemaPath = "#/eventsRespectInheritedTextLanguage";
}
}
else {
const err53 = {instancePath,schemaPath:"#/eventsRespectInheritedTextLanguage",keyword:"eventsRespectInheritedTextLanguage",params:{},message:"every event's translations must have an effective textLanguage (own or inherited from the feed) and must not repeat it"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
}
else {
const err54 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
validate65.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate65.evaluated = {"dynamicProps":true,"dynamicItems":false};

export const checkEventRecommended = validate84;
const schema94 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://opentechevents.org/schema/v0.3/event.recommended.schema.json","title":"OTE Event — recommended profile","description":"A quality profile, NOT a validity profile. An event that fails this schema is still a valid OTE event: event.schema.json decides what is valid, and it is deliberately permissive because most published .ics files carry neither URL nor description. This schema decides something else — whether the event can actually be discovered, filtered and subscribed to. Tools SHOULD report failures here as warnings and MUST NOT reject a document for them. It applies both to a standalone event and to one inside a feed: it references #/$defs/event, so it never asks for specVersion or license.","type":"object","languagesCoveredByText":true,"allOf":[{"$ref":"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/event"},{"description":"Without these, the event is published but not findable: url is the only link RSS/Atom has, description is what every destination shows, image is what makes the event visible where it is listed (Google recommends it for the Event rich result, and every platform studied already emits one), organizers is who is trusted for it, attendanceMode and location answer 'can I go?', tags and languages are what someone filters by, and updatedAt is what lets a subscriber sync incrementally instead of refetching everything.","type":"object","required":["url","description","image","organizers","attendanceMode","location","tags","languages","updatedAt"]},{"description":"cfp.closesAt is recommended once there IS a call for proposals, and meaningless otherwise. The reason cfp exists is the question 'which conferences are accepting proposals right now', and without a deadline nobody can answer it: a consumer sees a link and cannot tell whether it closed last March. The warning is actionable by definition — whoever opened the call knows when it closes.","if":{"type":"object","required":["cfp"]},"then":{"type":"object","properties":{"cfp":{"type":"object","required":["closesAt"]}}}},{"description":"endDate is recommended only for a timed event: without it a calendar client invents a duration. For an all-day event its absence already means 'ends the day it starts', which is almost always right — so asking for it there would be noise, and a warning nobody can act on is a warning that gets ignored.","if":{"type":"object","required":["startDate"],"properties":{"startDate":{"$ref":"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/dateTime"}}},"then":{"type":"object","required":["endDate"]}},{"description":"license SHOULD carry no clause that can stop a directory or aggregator from redistributing or transforming the event: NonCommercial rules out any commercial directory outright, NoDerivatives blocks the reformatting/translation an aggregator routinely does, and ShareAlike (including ODbL) is viral for a COMBINED database — merging one event into a larger feed could force the whole feed to adopt that license. Software copyleft licenses (GPL and family) are excluded from the recommendation too: their mechanics are built around 'distributing the Program', legally murky applied to a JSON document, and that ambiguity alone is enough for a cautious directory to decline rather than risk it. None of this makes the license INVALID — event.schema.json already checks it is a real SPDX identifier or a URL — it only means a directory integration may need a conversation first. A URL is exempt: it names its own terms explicitly, which is the point of offering that alternative.","type":"object","properties":{"license":{"anyOf":[{"$ref":"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/dataLicense"},{"type":"string","format":"uri","pattern":"^https?://"}]}}},{"description":"description is only useful if it says something: event.schema.json deliberately leaves it unconstrained beyond being a string (an optional field has no minimum bar to clear, and forcing one would just move the required-field problem this profile already avoids elsewhere), but a document that carries an empty or whitespace-only description looks complete to this profile's own required check while giving a consumer nothing to show — worse than omitting it, which at least triggers this same warning honestly. CHANGES.log #P017.","type":"object","properties":{"description":{"type":"string","minLength":1,"pattern":"\\S"}}},{"description":"attendanceMode and location are deliberately independent fields — README.md says location is observable fact, attendanceMode is organiser intent, and if they disagree attendanceMode wins — so this is not a validity rule and never overrides that precedence. It only flags that the detail a consumer needs to act on the declared mode is missing: online without location.onlineUrl cannot produce a schema.org VirtualLocation.url, in-person without location.venue cannot produce a Place.name, and hybrid needs both halves of a MixedEventAttendanceMode. Silent when location itself is absent, since the required-fields warning above already covers that case. CHANGES.log #P028.","if":{"type":"object","required":["attendanceMode","location"],"properties":{"attendanceMode":{"const":"online"}}},"then":{"type":"object","properties":{"location":{"type":"object","required":["onlineUrl"]}}}},{"description":"See the 'online' rule above for why this is a warning, not a validity check. in-person without location.venue cannot produce a schema.org Place.name. CHANGES.log #P028.","if":{"type":"object","required":["attendanceMode","location"],"properties":{"attendanceMode":{"const":"in-person"}}},"then":{"type":"object","properties":{"location":{"type":"object","required":["venue"]}}}},{"description":"See the 'online' rule above for why this is a warning, not a validity check. hybrid needs both halves of a schema.org MixedEventAttendanceMode: location.venue for the in-person half and location.onlineUrl for the online half. CHANGES.log #P028.","if":{"type":"object","required":["attendanceMode","location"],"properties":{"attendanceMode":{"const":"hybrid"}}},"then":{"type":"object","properties":{"location":{"type":"object","required":["venue","onlineUrl"]}}}},{"description":"offers[].name is only recommended once a translation actually translates one: name itself stays fully optional (worth writing when there is more than one offer, noise when there is only one), but a producer who already wrote offers[].translations.*.name has demonstrated the name exists — leaving the primary blank then loses it for any consumer who reads offers[] directly (schema.org, RSS/iCal) instead of translations. CHANGES.log #P033 / DECISIONS.md D030.","type":"object","properties":{"offers":{"type":"array","items":{"type":"object","if":{"type":"object","required":["translations"]},"then":{"type":"object","required":["name"]}}}}},{"description":"See the offers[].name rule above for the same reasoning, applied to partOf.name: a producer who wrote partOf.translations.*.name has demonstrated the series/multipart event has a name, so leaving partOf.name itself blank loses it for any consumer who does not read translations. CHANGES.log #P033 / DECISIONS.md D030.","if":{"type":"object","required":["partOf"],"properties":{"partOf":{"type":"object","required":["translations"]}}},"then":{"type":"object","properties":{"partOf":{"type":"object","required":["name"]}}}},{"description":"See the offers[].name rule above for the same reasoning, applied to eligibility.note: a producer who wrote eligibility.translations.*.note has demonstrated the condition is stated somewhere, so leaving eligibility.note itself blank loses it for any consumer who does not read translations. Already a base-schema error when type is restricted (event.schema.json); this only adds the warning for the other eligibility types, where note stays optional. CHANGES.log #P033 / DECISIONS.md D030.","if":{"type":"object","required":["eligibility"],"properties":{"eligibility":{"type":"object","required":["translations"]}}},"then":{"type":"object","properties":{"eligibility":{"type":"object","required":["note"]}}}}]};
const schema105 = {"type":"string","enum":["CC-BY-1.0","CC-BY-2.0","CC-BY-2.5","CC-BY-2.5-AU","CC-BY-3.0","CC-BY-3.0-AT","CC-BY-3.0-AU","CC-BY-3.0-DE","CC-BY-3.0-IGO","CC-BY-3.0-NL","CC-BY-3.0-US","CC-BY-4.0","CC-PDDC","CC-PDM-1.0","CC0-1.0","ODC-By-1.0","PDDL-1.0"],"$comment":"Generated by scripts/update-licenses.mjs, same source and release as $defs.license. The subset with no clause (NonCommercial, NoDerivatives, ShareAlike) that can block a directory from redistributing or transforming an event, and no software-copyleft ambiguity. Used only by the recommended (quality) profile, never validity. See CHANGES.log #P007 / DECISIONS.md D008."};

function validate85(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate85.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs2 = errors;
let valid1 = false;
let passing0 = null;
const _errs3 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.startDate !== undefined){
let data0 = data.startDate;
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err0 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(!(formats0.validate(data0))){
const err1 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.endDate !== undefined){
let data1 = data.endDate;
if(typeof data1 === "string"){
if(!pattern4.test(data1)){
const err3 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(!(formats0.validate(data1))){
const err4 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
else {
const err6 = {instancePath,schemaPath:"#/allOf/0/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
var _valid0 = _errs3 === errors;
if(_valid0){
valid1 = true;
passing0 = 0;
var props0 = {};
props0.startDate = true;
props0.endDate = true;
}
const _errs11 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.startDate !== undefined){
let data2 = data.startDate;
if(typeof data2 === "string"){
if(!pattern6.test(data2)){
const err7 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(!(formats4(data2))){
const err8 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/format",keyword:"format",params:{format: "ote-local-date-time"},message:"must match format \""+"ote-local-date-time"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/startDate",schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.endDate !== undefined){
let data3 = data.endDate;
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err10 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(!(formats4(data3))){
const err11 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/format",keyword:"format",params:{format: "ote-local-date-time"},message:"must match format \""+"ote-local-date-time"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/endDate",schemaPath:"#/$defs/dateTime/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath,schemaPath:"#/allOf/0/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
var _valid0 = _errs11 === errors;
if(_valid0 && valid1){
valid1 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid1 = true;
passing0 = 1;
if(props0 !== true){
props0 = props0 || {};
props0.startDate = true;
props0.endDate = true;
}
}
}
if(!valid1){
const err14 = {instancePath,schemaPath:"#/allOf/0/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
else {
errors = _errs2;
if(vErrors !== null){
if(_errs2){
vErrors.length = _errs2;
}
else {
vErrors = null;
}
}
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data.name === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data.startDate === undefined){
const err17 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "startDate"},message:"must have required property '"+"startDate"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data.timezone === undefined){
const err18 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "timezone"},message:"must have required property '"+"timezone"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.specVersion = true;
props0.id = true;
props0.url = true;
props0.name = true;
props0.description = true;
props0.image = true;
props0.organizers = true;
props0.startDate = true;
props0.endDate = true;
props0.timezone = true;
props0.attendanceMode = true;
props0.location = true;
props0.eligibility = true;
props0.tags = true;
props0.languages = true;
props0.textLanguage = true;
props0.offers = true;
props0.cfp = true;
props0.status = true;
props0.partOf = true;
props0.license = true;
props0.source = true;
props0.updatedAt = true;
props0.translations = true;
}
if(data.specVersion !== undefined){
if("0.3.0" !== data.specVersion){
const err19 = {instancePath:instancePath+"/specVersion",schemaPath:"#/properties/specVersion/const",keyword:"const",params:{allowedValue: "0.3.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.id !== undefined){
let data5 = data.id;
const _errs23 = errors;
const _errs24 = errors;
if(typeof data5 === "string"){
if(!pattern8.test(data5)){
const err20 = {};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
var valid9 = _errs24 === errors;
if(valid9){
const err21 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
else {
errors = _errs23;
if(vErrors !== null){
if(_errs23){
vErrors.length = _errs23;
}
else {
vErrors = null;
}
}
}
if(typeof data5 === "string"){
if(!pattern9.test(data5)){
const err22 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(!(formats8(data5))){
const err23 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
else {
const err24 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.url !== undefined){
let data6 = data.url;
const _errs27 = errors;
const _errs28 = errors;
if(typeof data6 === "string"){
if(!pattern8.test(data6)){
const err25 = {};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
var valid10 = _errs28 === errors;
if(valid10){
const err26 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
else {
errors = _errs27;
if(vErrors !== null){
if(_errs27){
vErrors.length = _errs27;
}
else {
vErrors = null;
}
}
}
if(typeof data6 === "string"){
if(!pattern9.test(data6)){
const err27 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(!(formats8(data6))){
const err28 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/url",schemaPath:"#/properties/url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.name !== undefined){
let data7 = data.name;
if(typeof data7 === "string"){
if(func1(data7) < 1){
const err30 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(!pattern12.test(data7)){
const err31 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
else {
const err32 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data.description !== undefined){
if(typeof data.description !== "string"){
const err33 = {instancePath:instancePath+"/description",schemaPath:"#/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.image !== undefined){
if(!(validate23.call(this, data.image, {instancePath:instancePath+"/image",parentData:data,parentDataProperty:"image",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
}
if(data.organizers !== undefined){
if(!(validate31.call(this, data.organizers, {instancePath:instancePath+"/organizers",parentData:data,parentDataProperty:"organizers",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate31.errors : vErrors.concat(validate31.errors);
errors = vErrors.length;
}
}
if(data.startDate !== undefined){
if(!(validate33.call(this, data.startDate, {instancePath:instancePath+"/startDate",parentData:data,parentDataProperty:"startDate",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate33.errors : vErrors.concat(validate33.errors);
errors = vErrors.length;
}
}
if(data.endDate !== undefined){
if(!(validate33.call(this, data.endDate, {instancePath:instancePath+"/endDate",parentData:data,parentDataProperty:"endDate",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate33.errors : vErrors.concat(validate33.errors);
errors = vErrors.length;
}
}
if(data.timezone !== undefined){
let data13 = data.timezone;
if(typeof data13 !== "string"){
const err34 = {instancePath:instancePath+"/timezone",schemaPath:"#/properties/timezone/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
let valid11;
valid11 = false;
for(const v0 of schema33.properties.timezone.enum){
if(func0(data13, v0)){
valid11 = true;
break;
}
}
if(!valid11){
const err35 = {instancePath:instancePath+"/timezone",schemaPath:"#/properties/timezone/enum",keyword:"enum",params:{allowedValues: schema33.properties.timezone.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.attendanceMode !== undefined){
let data14 = data.attendanceMode;
if(!(((data14 === "in-person") || (data14 === "online")) || (data14 === "hybrid"))){
const err36 = {instancePath:instancePath+"/attendanceMode",schemaPath:"#/properties/attendanceMode/enum",keyword:"enum",params:{allowedValues: schema33.properties.attendanceMode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data.location !== undefined){
if(!(validate36.call(this, data.location, {instancePath:instancePath+"/location",parentData:data,parentDataProperty:"location",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate36.errors : vErrors.concat(validate36.errors);
errors = vErrors.length;
}
}
if(data.eligibility !== undefined){
if(!(validate40.call(this, data.eligibility, {instancePath:instancePath+"/eligibility",parentData:data,parentDataProperty:"eligibility",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
errors = vErrors.length;
}
}
if(data.tags !== undefined){
let data17 = data.tags;
if(Array.isArray(data17)){
if(data17.length < 1){
const err37 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
const len0 = data17.length;
for(let i0=0; i0<len0; i0++){
let data18 = data17[i0];
if(typeof data18 === "string"){
if(func1(data18) < 1){
const err38 = {instancePath:instancePath+"/tags/" + i0,schemaPath:"#/properties/tags/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(!pattern12.test(data18)){
const err39 = {instancePath:instancePath+"/tags/" + i0,schemaPath:"#/properties/tags/items/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
else {
const err40 = {instancePath:instancePath+"/tags/" + i0,schemaPath:"#/properties/tags/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
let i1 = data17.length;
let j0;
if(i1 > 1){
const indices0 = {};
for(;i1--;){
let item0 = data17[i1];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
const err41 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/uniqueItems",keyword:"uniqueItems",params:{i: i1, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i1+" are identical)"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
break;
}
indices0[item0] = i1;
}
}
}
else {
const err42 = {instancePath:instancePath+"/tags",schemaPath:"#/properties/tags/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data.languages !== undefined){
let data19 = data.languages;
if(Array.isArray(data19)){
if(data19.length < 1){
const err43 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
const len1 = data19.length;
for(let i2=0; i2<len1; i2++){
let data20 = data19[i2];
if(typeof data20 === "string"){
if(!pattern18.test(data20)){
const err44 = {instancePath:instancePath+"/languages/" + i2,schemaPath:"#/$defs/languageTag/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"},message:"must match pattern \""+"^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"+"\""};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(!(formats16(data20))){
const err45 = {instancePath:instancePath+"/languages/" + i2,schemaPath:"#/$defs/languageTag/format",keyword:"format",params:{format: "ote-language-tag"},message:"must match format \""+"ote-language-tag"+"\""};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
else {
const err46 = {instancePath:instancePath+"/languages/" + i2,schemaPath:"#/$defs/languageTag/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
let i3 = data19.length;
let j1;
if(i3 > 1){
outer0:
for(;i3--;){
for(j1 = i3; j1--;){
if(func0(data19[i3], data19[j1])){
const err47 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/uniqueItems",keyword:"uniqueItems",params:{i: i3, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i3+" are identical)"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
break outer0;
}
}
}
}
const _errs53 = errors;
let valid19;
keyword8.errors = null;
valid19 = keyword8.call(this, true, data19, schema33.properties.languages, {instancePath:instancePath+"/languages",parentData:data,parentDataProperty:"languages",rootData,dynamicAnchors});
if(!valid19){
if(Array.isArray(keyword8.errors)){
vErrors = vErrors === null ? keyword8.errors : vErrors.concat(keyword8.errors);
errors = vErrors.length;
for(let i4=_errs53; i4<errors; i4++){
const err48 = vErrors[i4];
if(err48.instancePath === undefined){
err48.instancePath = instancePath+"/languages";
}
err48.schemaPath = "#/properties/languages/distinctLanguageTags";
}
}
else {
const err49 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/distinctLanguageTags",keyword:"distinctLanguageTags",params:{},message:"languages must not repeat the same language tag under different case"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
}
else {
const err50 = {instancePath:instancePath+"/languages",schemaPath:"#/properties/languages/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data.textLanguage !== undefined){
let data21 = data.textLanguage;
if(typeof data21 === "string"){
if(!pattern18.test(data21)){
const err51 = {instancePath:instancePath+"/textLanguage",schemaPath:"#/$defs/languageTag/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"},message:"must match pattern \""+"^[A-Za-z]{2,8}(-[A-Za-z0-9]{2,8})*$"+"\""};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
if(!(formats16(data21))){
const err52 = {instancePath:instancePath+"/textLanguage",schemaPath:"#/$defs/languageTag/format",keyword:"format",params:{format: "ote-language-tag"},message:"must match format \""+"ote-language-tag"+"\""};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
else {
const err53 = {instancePath:instancePath+"/textLanguage",schemaPath:"#/$defs/languageTag/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data.offers !== undefined){
if(!(validate45.call(this, data.offers, {instancePath:instancePath+"/offers",parentData:data,parentDataProperty:"offers",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate45.errors : vErrors.concat(validate45.errors);
errors = vErrors.length;
}
}
if(data.cfp !== undefined){
if(!(validate52.call(this, data.cfp, {instancePath:instancePath+"/cfp",parentData:data,parentDataProperty:"cfp",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate52.errors : vErrors.concat(validate52.errors);
errors = vErrors.length;
}
}
if(data.status !== undefined){
let data24 = data.status;
if(!((((((data24 === "scheduled") || (data24 === "tentative")) || (data24 === "cancelled")) || (data24 === "postponed")) || (data24 === "rescheduled")) || (data24 === "moved-online"))){
const err54 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema33.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data.partOf !== undefined){
if(!(validate54.call(this, data.partOf, {instancePath:instancePath+"/partOf",parentData:data,parentDataProperty:"partOf",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate54.errors : vErrors.concat(validate54.errors);
errors = vErrors.length;
}
}
if(data.license !== undefined){
let data26 = data.license;
if(typeof data26 !== "string"){
const err55 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
const _errs65 = errors;
let valid22 = false;
const _errs66 = errors;
let valid23;
valid23 = false;
for(const v1 of schema70.anyOf[0].enum){
if(func0(data26, v1)){
valid23 = true;
break;
}
}
if(!valid23){
const err56 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/0/enum",keyword:"enum",params:{allowedValues: schema70.anyOf[0].enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
var _valid1 = _errs66 === errors;
valid22 = valid22 || _valid1;
const _errs68 = errors;
const _errs69 = errors;
const _errs70 = errors;
if(typeof data26 === "string"){
if(!pattern8.test(data26)){
const err57 = {};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
var valid24 = _errs70 === errors;
if(valid24){
const err58 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
else {
errors = _errs69;
if(vErrors !== null){
if(_errs69){
vErrors.length = _errs69;
}
else {
vErrors = null;
}
}
}
if(typeof data26 === "string"){
if(!pattern9.test(data26)){
const err59 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(!(formats8(data26))){
const err60 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf/1/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
var _valid1 = _errs68 === errors;
valid22 = valid22 || _valid1;
if(!valid22){
const err61 = {instancePath:instancePath+"/license",schemaPath:"#/$defs/license/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
else {
errors = _errs65;
if(vErrors !== null){
if(_errs65){
vErrors.length = _errs65;
}
else {
vErrors = null;
}
}
}
}
if(data.source !== undefined){
if(!(validate59.call(this, data.source, {instancePath:instancePath+"/source",parentData:data,parentDataProperty:"source",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate59.errors : vErrors.concat(validate59.errors);
errors = vErrors.length;
}
}
if(data.updatedAt !== undefined){
let data28 = data.updatedAt;
if(typeof data28 === "string"){
if(!pattern44.test(data28)){
const err62 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/pattern",keyword:"pattern",params:{pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"},message:"must match pattern \""+"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$"+"\""};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(!(formats38.validate(data28))){
const err63 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
else {
const err64 = {instancePath:instancePath+"/updatedAt",schemaPath:"#/$defs/instant/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data.translations !== undefined){
if(!(validate61.call(this, data.translations, {instancePath:instancePath+"/translations",parentData:data,parentDataProperty:"translations",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate61.errors : vErrors.concat(validate61.errors);
errors = vErrors.length;
}
}
const _errs77 = errors;
let valid26;
keyword0.errors = null;
valid26 = keyword0.call(this, true, data, schema33, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid26){
if(Array.isArray(keyword0.errors)){
vErrors = vErrors === null ? keyword0.errors : vErrors.concat(keyword0.errors);
errors = vErrors.length;
for(let i5=_errs77; i5<errors; i5++){
const err65 = vErrors[i5];
if(err65.instancePath === undefined){
err65.instancePath = instancePath;
}
err65.schemaPath = "#/orderedDates";
}
}
else {
const err66 = {instancePath,schemaPath:"#/orderedDates",keyword:"orderedDates",params:{},message:"endDate must not be earlier than startDate"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
const _errs78 = errors;
let valid27;
keyword2.errors = null;
valid27 = keyword2.call(this, true, data, schema33, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid27){
if(Array.isArray(keyword2.errors)){
vErrors = vErrors === null ? keyword2.errors : vErrors.concat(keyword2.errors);
errors = vErrors.length;
for(let i6=_errs78; i6<errors; i6++){
const err67 = vErrors[i6];
if(err67.instancePath === undefined){
err67.instancePath = instancePath;
}
err67.schemaPath = "#/distinctTranslationLanguages";
}
}
else {
const err68 = {instancePath,schemaPath:"#/distinctTranslationLanguages",keyword:"distinctTranslationLanguages",params:{},message:"a translations map must not repeat textLanguage's own language, or any of its own keys, twice"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
const _errs79 = errors;
let valid28;
keyword4.errors = null;
valid28 = keyword4.call(this, true, data, schema33, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid28){
if(Array.isArray(keyword4.errors)){
vErrors = vErrors === null ? keyword4.errors : vErrors.concat(keyword4.errors);
errors = vErrors.length;
for(let i7=_errs79; i7<errors; i7++){
const err69 = vErrors[i7];
if(err69.instancePath === undefined){
err69.instancePath = instancePath;
}
err69.schemaPath = "#/distinctPartOfId";
}
}
else {
const err70 = {instancePath,schemaPath:"#/distinctPartOfId",keyword:"distinctPartOfId",params:{},message:"partOf.id must not equal the event's own id"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
}
else {
const err71 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
validate85.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate85.evaluated = {"dynamicProps":true,"dynamicItems":false};

const keyword7 = keywords["languagesCoveredByText"];

function validate84(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://opentechevents.org/schema/v0.3/event.recommended.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate84.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate85.call(this, data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate85.errors : vErrors.concat(validate85.errors);
errors = vErrors.length;
}
else {
var props0 = validate85.evaluated.props;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.url === undefined){
const err0 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "url"},message:"must have required property '"+"url"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.description === undefined){
const err1 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.image === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "image"},message:"must have required property '"+"image"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.organizers === undefined){
const err3 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "organizers"},message:"must have required property '"+"organizers"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.attendanceMode === undefined){
const err4 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "attendanceMode"},message:"must have required property '"+"attendanceMode"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.location === undefined){
const err5 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "location"},message:"must have required property '"+"location"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.tags === undefined){
const err6 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "tags"},message:"must have required property '"+"tags"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.languages === undefined){
const err7 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "languages"},message:"must have required property '"+"languages"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.updatedAt === undefined){
const err8 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "updatedAt"},message:"must have required property '"+"updatedAt"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
const _errs5 = errors;
let valid1 = true;
const _errs6 = errors;
if(errors === _errs6){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.cfp === undefined) && (missing0 = "cfp")){
const err10 = {};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
var _valid0 = _errs6 === errors;
errors = _errs5;
if(vErrors !== null){
if(_errs5){
vErrors.length = _errs5;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs8 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.cfp !== undefined){
let data0 = data.cfp;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.closesAt === undefined){
const err12 = {instancePath:instancePath+"/cfp",schemaPath:"#/allOf/2/then/properties/cfp/required",keyword:"required",params:{missingProperty: "closesAt"},message:"must have required property '"+"closesAt"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/cfp",schemaPath:"#/allOf/2/then/properties/cfp/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
else {
const err14 = {instancePath,schemaPath:"#/allOf/2/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
var _valid0 = _errs8 === errors;
valid1 = _valid0;
if(valid1){
var props1 = {};
props1.cfp = true;
}
}
if(!valid1){
const err15 = {instancePath,schemaPath:"#/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(props0 !== true && props1 !== undefined){
if(props1 === true){
props0 = true;
}
else {
props0 = props0 || {};
Object.assign(props0, props1);
}
}
const _errs13 = errors;
let valid3 = true;
const _errs14 = errors;
if(errors === _errs14){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing1;
if((data.startDate === undefined) && (missing1 = "startDate")){
const err16 = {};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
else {
if(data.startDate !== undefined){
let data1 = data.startDate;
const _errs17 = errors;
if(errors === _errs17){
if(errors === _errs17){
if(typeof data1 === "string"){
if(!pattern6.test(data1)){
const err17 = {};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
else {
if(!(formats4(data1))){
const err18 = {};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
}
}
}
}
else {
const err20 = {};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
var _valid1 = _errs14 === errors;
errors = _errs13;
if(vErrors !== null){
if(_errs13){
vErrors.length = _errs13;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs19 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.endDate === undefined){
const err21 = {instancePath,schemaPath:"#/allOf/3/then/required",keyword:"required",params:{missingProperty: "endDate"},message:"must have required property '"+"endDate"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
else {
const err22 = {instancePath,schemaPath:"#/allOf/3/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
var _valid1 = _errs19 === errors;
valid3 = _valid1;
}
if(!valid3){
const err23 = {instancePath,schemaPath:"#/allOf/3/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.startDate = true;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.license !== undefined){
let data2 = data.license;
const _errs24 = errors;
let valid7 = false;
const _errs25 = errors;
if(typeof data2 !== "string"){
const err24 = {instancePath:instancePath+"/license",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/dataLicense/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(!(((((((((((((((((data2 === "CC-BY-1.0") || (data2 === "CC-BY-2.0")) || (data2 === "CC-BY-2.5")) || (data2 === "CC-BY-2.5-AU")) || (data2 === "CC-BY-3.0")) || (data2 === "CC-BY-3.0-AT")) || (data2 === "CC-BY-3.0-AU")) || (data2 === "CC-BY-3.0-DE")) || (data2 === "CC-BY-3.0-IGO")) || (data2 === "CC-BY-3.0-NL")) || (data2 === "CC-BY-3.0-US")) || (data2 === "CC-BY-4.0")) || (data2 === "CC-PDDC")) || (data2 === "CC-PDM-1.0")) || (data2 === "CC0-1.0")) || (data2 === "ODC-By-1.0")) || (data2 === "PDDL-1.0"))){
const err25 = {instancePath:instancePath+"/license",schemaPath:"https://opentechevents.org/schema/v0.3/event.schema.json#/$defs/dataLicense/enum",keyword:"enum",params:{allowedValues: schema105.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
var _valid2 = _errs25 === errors;
valid7 = valid7 || _valid2;
const _errs29 = errors;
if(typeof data2 === "string"){
if(!pattern9.test(data2)){
const err26 = {instancePath:instancePath+"/license",schemaPath:"#/allOf/4/properties/license/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^https?://"},message:"must match pattern \""+"^https?://"+"\""};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(!(formats8(data2))){
const err27 = {instancePath:instancePath+"/license",schemaPath:"#/allOf/4/properties/license/anyOf/1/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
else {
const err28 = {instancePath:instancePath+"/license",schemaPath:"#/allOf/4/properties/license/anyOf/1/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
var _valid2 = _errs29 === errors;
valid7 = valid7 || _valid2;
if(!valid7){
const err29 = {instancePath:instancePath+"/license",schemaPath:"#/allOf/4/properties/license/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
else {
errors = _errs24;
if(vErrors !== null){
if(_errs24){
vErrors.length = _errs24;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err30 = {instancePath,schemaPath:"#/allOf/4/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.license = true;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.description !== undefined){
let data3 = data.description;
if(typeof data3 === "string"){
if(func1(data3) < 1){
const err31 = {instancePath:instancePath+"/description",schemaPath:"#/allOf/5/properties/description/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(!pattern12.test(data3)){
const err32 = {instancePath:instancePath+"/description",schemaPath:"#/allOf/5/properties/description/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
else {
const err33 = {instancePath:instancePath+"/description",schemaPath:"#/allOf/5/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
}
else {
const err34 = {instancePath,schemaPath:"#/allOf/5/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.description = true;
}
const _errs36 = errors;
let valid10 = true;
const _errs37 = errors;
if(errors === _errs37){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing2;
if(((data.attendanceMode === undefined) && (missing2 = "attendanceMode")) || ((data.location === undefined) && (missing2 = "location"))){
const err35 = {};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
else {
if(data.attendanceMode !== undefined){
if("online" !== data.attendanceMode){
const err36 = {};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
}
}
else {
const err37 = {};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
var _valid3 = _errs37 === errors;
errors = _errs36;
if(vErrors !== null){
if(_errs36){
vErrors.length = _errs36;
}
else {
vErrors = null;
}
}
if(_valid3){
const _errs40 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.location !== undefined){
let data5 = data.location;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.onlineUrl === undefined){
const err38 = {instancePath:instancePath+"/location",schemaPath:"#/allOf/6/then/properties/location/required",keyword:"required",params:{missingProperty: "onlineUrl"},message:"must have required property '"+"onlineUrl"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
else {
const err39 = {instancePath:instancePath+"/location",schemaPath:"#/allOf/6/then/properties/location/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
}
else {
const err40 = {instancePath,schemaPath:"#/allOf/6/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
var _valid3 = _errs40 === errors;
valid10 = _valid3;
if(valid10){
var props2 = {};
props2.location = true;
props2.attendanceMode = true;
}
}
if(!valid10){
const err41 = {instancePath,schemaPath:"#/allOf/6/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(props0 !== true && props2 !== undefined){
if(props2 === true){
props0 = true;
}
else {
props0 = props0 || {};
Object.assign(props0, props2);
}
}
const _errs45 = errors;
let valid13 = true;
const _errs46 = errors;
if(errors === _errs46){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing3;
if(((data.attendanceMode === undefined) && (missing3 = "attendanceMode")) || ((data.location === undefined) && (missing3 = "location"))){
const err42 = {};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
else {
if(data.attendanceMode !== undefined){
if("in-person" !== data.attendanceMode){
const err43 = {};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
}
}
else {
const err44 = {};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
var _valid4 = _errs46 === errors;
errors = _errs45;
if(vErrors !== null){
if(_errs45){
vErrors.length = _errs45;
}
else {
vErrors = null;
}
}
if(_valid4){
const _errs49 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.location !== undefined){
let data7 = data.location;
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
if(data7.venue === undefined){
const err45 = {instancePath:instancePath+"/location",schemaPath:"#/allOf/7/then/properties/location/required",keyword:"required",params:{missingProperty: "venue"},message:"must have required property '"+"venue"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
else {
const err46 = {instancePath:instancePath+"/location",schemaPath:"#/allOf/7/then/properties/location/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
}
else {
const err47 = {instancePath,schemaPath:"#/allOf/7/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
var _valid4 = _errs49 === errors;
valid13 = _valid4;
if(valid13){
var props3 = {};
props3.location = true;
props3.attendanceMode = true;
}
}
if(!valid13){
const err48 = {instancePath,schemaPath:"#/allOf/7/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(props0 !== true && props3 !== undefined){
if(props3 === true){
props0 = true;
}
else {
props0 = props0 || {};
Object.assign(props0, props3);
}
}
const _errs54 = errors;
let valid16 = true;
const _errs55 = errors;
if(errors === _errs55){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing4;
if(((data.attendanceMode === undefined) && (missing4 = "attendanceMode")) || ((data.location === undefined) && (missing4 = "location"))){
const err49 = {};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
else {
if(data.attendanceMode !== undefined){
if("hybrid" !== data.attendanceMode){
const err50 = {};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
}
}
else {
const err51 = {};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
var _valid5 = _errs55 === errors;
errors = _errs54;
if(vErrors !== null){
if(_errs54){
vErrors.length = _errs54;
}
else {
vErrors = null;
}
}
if(_valid5){
const _errs58 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.location !== undefined){
let data9 = data.location;
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
if(data9.venue === undefined){
const err52 = {instancePath:instancePath+"/location",schemaPath:"#/allOf/8/then/properties/location/required",keyword:"required",params:{missingProperty: "venue"},message:"must have required property '"+"venue"+"'"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data9.onlineUrl === undefined){
const err53 = {instancePath:instancePath+"/location",schemaPath:"#/allOf/8/then/properties/location/required",keyword:"required",params:{missingProperty: "onlineUrl"},message:"must have required property '"+"onlineUrl"+"'"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/location",schemaPath:"#/allOf/8/then/properties/location/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath,schemaPath:"#/allOf/8/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
var _valid5 = _errs58 === errors;
valid16 = _valid5;
if(valid16){
var props4 = {};
props4.location = true;
props4.attendanceMode = true;
}
}
if(!valid16){
const err56 = {instancePath,schemaPath:"#/allOf/8/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
if(props0 !== true && props4 !== undefined){
if(props4 === true){
props0 = true;
}
else {
props0 = props0 || {};
Object.assign(props0, props4);
}
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.offers !== undefined){
let data10 = data.offers;
if(Array.isArray(data10)){
const len0 = data10.length;
for(let i0=0; i0<len0; i0++){
let data11 = data10[i0];
if(!(data11 && typeof data11 == "object" && !Array.isArray(data11))){
const err57 = {instancePath:instancePath+"/offers/" + i0,schemaPath:"#/allOf/9/properties/offers/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
const _errs68 = errors;
let valid22 = true;
const _errs69 = errors;
if(errors === _errs69){
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
let missing5;
if((data11.translations === undefined) && (missing5 = "translations")){
const err58 = {};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
else {
const err59 = {};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
var _valid6 = _errs69 === errors;
errors = _errs68;
if(vErrors !== null){
if(_errs68){
vErrors.length = _errs68;
}
else {
vErrors = null;
}
}
if(_valid6){
const _errs71 = errors;
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
if(data11.name === undefined){
const err60 = {instancePath:instancePath+"/offers/" + i0,schemaPath:"#/allOf/9/properties/offers/items/then/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
else {
const err61 = {instancePath:instancePath+"/offers/" + i0,schemaPath:"#/allOf/9/properties/offers/items/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
var _valid6 = _errs71 === errors;
valid22 = _valid6;
}
if(!valid22){
const err62 = {instancePath:instancePath+"/offers/" + i0,schemaPath:"#/allOf/9/properties/offers/items/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
}
else {
const err63 = {instancePath:instancePath+"/offers",schemaPath:"#/allOf/9/properties/offers/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
}
else {
const err64 = {instancePath,schemaPath:"#/allOf/9/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.offers = true;
}
const _errs74 = errors;
let valid23 = true;
const _errs75 = errors;
if(errors === _errs75){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing6;
if((data.partOf === undefined) && (missing6 = "partOf")){
const err65 = {};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
else {
if(data.partOf !== undefined){
let data12 = data.partOf;
const _errs77 = errors;
if(errors === _errs77){
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
let missing7;
if((data12.translations === undefined) && (missing7 = "translations")){
const err66 = {};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
else {
const err67 = {};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
}
}
}
else {
const err68 = {};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
var _valid7 = _errs75 === errors;
errors = _errs74;
if(vErrors !== null){
if(_errs74){
vErrors.length = _errs74;
}
else {
vErrors = null;
}
}
if(_valid7){
const _errs79 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.partOf !== undefined){
let data13 = data.partOf;
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.name === undefined){
const err69 = {instancePath:instancePath+"/partOf",schemaPath:"#/allOf/10/then/properties/partOf/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
else {
const err70 = {instancePath:instancePath+"/partOf",schemaPath:"#/allOf/10/then/properties/partOf/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
}
else {
const err71 = {instancePath,schemaPath:"#/allOf/10/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
var _valid7 = _errs79 === errors;
valid23 = _valid7;
if(valid23){
var props5 = {};
props5.partOf = true;
}
}
if(!valid23){
const err72 = {instancePath,schemaPath:"#/allOf/10/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(props0 !== true && props5 !== undefined){
if(props5 === true){
props0 = true;
}
else {
props0 = props0 || {};
Object.assign(props0, props5);
}
}
const _errs84 = errors;
let valid26 = true;
const _errs85 = errors;
if(errors === _errs85){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing8;
if((data.eligibility === undefined) && (missing8 = "eligibility")){
const err73 = {};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
else {
if(data.eligibility !== undefined){
let data14 = data.eligibility;
const _errs87 = errors;
if(errors === _errs87){
if(data14 && typeof data14 == "object" && !Array.isArray(data14)){
let missing9;
if((data14.translations === undefined) && (missing9 = "translations")){
const err74 = {};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
else {
const err75 = {};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
}
}
}
else {
const err76 = {};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
var _valid8 = _errs85 === errors;
errors = _errs84;
if(vErrors !== null){
if(_errs84){
vErrors.length = _errs84;
}
else {
vErrors = null;
}
}
if(_valid8){
const _errs89 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.eligibility !== undefined){
let data15 = data.eligibility;
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.note === undefined){
const err77 = {instancePath:instancePath+"/eligibility",schemaPath:"#/allOf/11/then/properties/eligibility/required",keyword:"required",params:{missingProperty: "note"},message:"must have required property '"+"note"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
else {
const err78 = {instancePath:instancePath+"/eligibility",schemaPath:"#/allOf/11/then/properties/eligibility/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
}
else {
const err79 = {instancePath,schemaPath:"#/allOf/11/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
var _valid8 = _errs89 === errors;
valid26 = _valid8;
if(valid26){
var props6 = {};
props6.eligibility = true;
}
}
if(!valid26){
const err80 = {instancePath,schemaPath:"#/allOf/11/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
if(props0 !== true && props6 !== undefined){
if(props6 === true){
props0 = true;
}
else {
props0 = props0 || {};
Object.assign(props0, props6);
}
}
if(data && typeof data == "object" && !Array.isArray(data)){
const _errs93 = errors;
let valid29;
keyword7.errors = null;
valid29 = keyword7.call(this, true, data, schema94, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors});
if(!valid29){
if(Array.isArray(keyword7.errors)){
vErrors = vErrors === null ? keyword7.errors : vErrors.concat(keyword7.errors);
errors = vErrors.length;
for(let i1=_errs93; i1<errors; i1++){
const err81 = vErrors[i1];
if(err81.instancePath === undefined){
err81.instancePath = instancePath;
}
err81.schemaPath = "#/languagesCoveredByText";
}
}
else {
const err82 = {instancePath,schemaPath:"#/languagesCoveredByText",keyword:"languagesCoveredByText",params:{},message:"languages should be covered by the effective textLanguage or a translations key"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
}
else {
const err83 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
validate84.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate84.evaluated = {"dynamicProps":true,"dynamicItems":false};

export const checkFeedRecommended = validate98;
const schema106 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://opentechevents.org/schema/v0.3/feed.recommended.schema.json","title":"OTE Feed — recommended profile","description":"A quality profile, NOT a validity profile. A feed that fails this schema is still a valid OTE feed. Tools SHOULD report failures here as warnings and MUST NOT reject a document for them. Deliberately short: a feed's job is to carry events, so nearly all of the quality lives in event.recommended.schema.json — which a checker applies to each entry of `events` separately.","allOf":[{"$ref":"https://opentechevents.org/schema/v0.3/feed.schema.json"},{"description":"url is where the publisher lives, and it is what a consumer shows to say where these events came from. description is what a directory lists the feed under. `organizers` is NOT recommended, on purpose: an aggregator MUST leave it out so each event states its own, and a warning that pushes an aggregator to claim events it does not organise would corrupt the very data the field exists to protect.","type":"object","required":["url","description"]},{"description":"textLanguage SHOULD only be set when the feed also names its own organizers — the same field that already tells an aggregator to leave organizers out because its events are not all its own. Without organizers, textLanguage risks handing every event a single language none of them may actually share. Not a validity error: it is not this field's job to decide who is or is not an aggregator, only to flag the one combination most likely to mis-attribute a language. See CHANGES.log #P015 / DECISIONS.md D016.","if":{"type":"object","not":{"required":["organizers"]}},"then":{"type":"object","properties":{"textLanguage":{"not":{}}}}},{"description":"description is only useful if it says something: feed.schema.json deliberately leaves it unconstrained beyond being a string, but a feed that carries an empty or whitespace-only description looks complete to this profile's own required check while giving a consumer nothing to show — worse than omitting it, which at least triggers this same warning honestly. CHANGES.log #P017.","type":"object","properties":{"description":{"type":"string","minLength":1,"pattern":"\\S"}}}]};

function validate98(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://opentechevents.org/schema/v0.3/feed.recommended.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate98.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate65.call(this, data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate65.errors : vErrors.concat(validate65.errors);
errors = vErrors.length;
}
else {
var props0 = validate65.evaluated.props;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.url === undefined){
const err0 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "url"},message:"must have required property '"+"url"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.description === undefined){
const err1 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
const _errs4 = errors;
let valid1 = true;
const _errs5 = errors;
if(!(data && typeof data == "object" && !Array.isArray(data))){
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
const _errs7 = errors;
const _errs8 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.organizers === undefined) && (missing0 = "organizers")){
const err4 = {};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
var valid2 = _errs8 === errors;
if(valid2){
const err5 = {};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
else {
errors = _errs7;
if(vErrors !== null){
if(_errs7){
vErrors.length = _errs7;
}
else {
vErrors = null;
}
}
}
var _valid0 = _errs5 === errors;
errors = _errs4;
if(vErrors !== null){
if(_errs4){
vErrors.length = _errs4;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs9 = errors;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.textLanguage !== undefined){
const err6 = {instancePath:instancePath+"/textLanguage",schemaPath:"#/allOf/2/then/properties/textLanguage/not",keyword:"not",params:{},message:"must NOT be valid"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath,schemaPath:"#/allOf/2/then/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
var _valid0 = _errs9 === errors;
valid1 = _valid0;
if(valid1){
var props1 = {};
props1.textLanguage = true;
}
}
if(!valid1){
const err8 = {instancePath,schemaPath:"#/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(props0 !== true && props1 !== undefined){
if(props1 === true){
props0 = true;
}
else {
props0 = props0 || {};
Object.assign(props0, props1);
}
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.description !== undefined){
let data1 = data.description;
if(typeof data1 === "string"){
if(func1(data1) < 1){
const err9 = {instancePath:instancePath+"/description",schemaPath:"#/allOf/3/properties/description/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(!pattern12.test(data1)){
const err10 = {instancePath:instancePath+"/description",schemaPath:"#/allOf/3/properties/description/pattern",keyword:"pattern",params:{pattern: "\\S"},message:"must match pattern \""+"\\S"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/description",schemaPath:"#/allOf/3/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
}
else {
const err12 = {instancePath,schemaPath:"#/allOf/3/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(props0 !== true){
props0 = props0 || {};
props0.description = true;
}
validate98.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate98.evaluated = {"dynamicProps":true,"dynamicItems":false};
