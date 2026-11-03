function hn(t,e=320){if(!t)return;let n=t.replace(/\s+/g," ").trim();return n.length>e?`${n.slice(0,e-1)}\u2026`:n}function Br(t){if(Array.isArray(t))return t.length>0?t.join(", "):void 0;if(typeof t=="string")return t.trim()||void 0;if(typeof t=="number"||typeof t=="boolean")return String(t);if(t&&typeof t=="object")return JSON.stringify(t)}function mn(t){return t.flatMap(([e,n])=>{let r=Br(n);return r?[{label:e,value:r}]:[]})}function Et(t){if(!t)return null;let e=/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/.exec(t),r=(e?new Date(`${e[1]}T${e[2]??"00:00:00"}`):new Date(t)).valueOf();return Number.isNaN(r)?null:r}function Xe(t){let e=Date.now();return t.map((n,r)=>({event:n,index:r,sortDate:Et(n.startDate)})).sort((n,r)=>{if(n.sortDate===null&&r.sortDate===null)return n.index-r.index;if(n.sortDate===null)return 1;if(r.sortDate===null)return-1;let i=n.sortDate<e,o=r.sortDate<e;return i!==o?i?1:-1:i?r.sortDate-n.sortDate:n.sortDate-r.sortDate}).map(({event:n})=>n)}function At(t){return t!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(t)}function gn(t,e){let n=new Date(`${t}T00:00:00Z`);return n.setUTCDate(n.getUTCDate()+e),n.toISOString().slice(0,10)}function xt(t,e){if(!t)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(t))return new Intl.DateTimeFormat(void 0,{dateStyle:"medium"}).format(new Date(`${t}T00:00:00Z`));let r=new Date(`${t}${e==="UTC"?"Z":""}`);if(!Number.isNaN(r.valueOf())){let i=new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short"}).format(r);return e?`${i} (${e})`:i}return e?`${t} (${e})`:t}function vn(t){return t.location?.venue??Tt(t.location?.onlineUrl)??"online"}function Tt(t){if(!t)return;let e;try{e=new URL(t).hostname.toLowerCase().replace(/^www\./,"")}catch{return"Online event"}return e==="meet.google.com"?"Google Meet":e==="teams.microsoft.com"?"Microsoft Teams":e==="meet.jit.si"||e.endsWith(".jitsi.net")?"Jitsi Meet":e==="discord.gg"||e==="discord.com"?"Discord":e==="youtube.com"||e==="youtu.be"?"YouTube":e==="twitch.tv"?"Twitch":e==="lu.ma"?"Luma":e.endsWith(".zoom.us")||e==="zoom.us"?"Zoom":e.endsWith(".slack.com")||e==="slack.com"?"Slack":e.endsWith(".meetup.com")||e==="meetup.com"?"Meetup":e.endsWith(".eventbrite.com")||e==="eventbrite.com"?"Eventbrite":"Online event"}function Qe(t){return t.dateLabel??(t.endDate?`${xt(t.startDate,t.timezone)} to ${xt(t.endDate,t.timezone)}`:xt(t.startDate,t.timezone))}function bn(t){let e=(t??[]).map(n=>typeof n=="string"?{url:n}:n);return e.find(n=>!Qo(n.url))??e[0]}function Qo(t){return/^http:\/\//i.test(t)}function wn(t){let e=(t??[]).filter(r=>r.price!==void 0);if(e.length===0)return;let n=e.reduce((r,i)=>i.price<r.price?i:r);return{amount:n.price,currency:n.currency,url:n.url}}function Jo(t){if(t?.id)return{id:t.id,type:t.type==="multipart"?"multipart":"series",name:t.name,url:t.url}}function St(t){let e=Array.isArray(t)?{events:t}:t;if(!Array.isArray(e.events))throw new Error("feed.json has no events array");return{title:e.title,description:e.description,license:e.license,events:e.events.map(n=>{let r=bn(n.image),i=wn(n.offers),o=n.organizers?.[0]?.name;return{id:n.id,name:n.name??"(untitled event)",startDate:n.startDate,endDate:n.endDate,timezone:n.timezone,location:vn(n),locationLink:n.location?.onlineUrl,link:n.url??n.location?.onlineUrl,description:n.description,image:r,price:i,organizerName:o,tags:n.tags,attendanceMode:n.attendanceMode,updatedAt:n.updatedAt,partOf:Jo(n.partOf),eligibility:n.eligibility,cfp:n.cfp,details:mn([["ID",n.id],["Status",n.status],["Timezone",n.timezone],["Attendance",n.attendanceMode],["Languages",n.languages],["Tags",n.tags],["Updated",n.updatedAt],["Source",n.source],["Image",r?.url],["Price",i&&`${i.amount}${i.currency?` ${i.currency}`:""}`],["Organizer",o]])}})}}function En(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ce=En();function Jr(t){Ce=t}var Re={exec:()=>null};function _e(t){let e=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),i=e[r];return i||(i=t(r),e[r]=i),i}}function A(t,e=""){let n=typeof t=="string"?t:t.source,r={replace:(i,o)=>{let l=typeof o=="string"?o:o.source;return l=l.replace(U.caret,"$1"),n=n.replace(i,l),r},getRegex:()=>new RegExp(n,e)};return r}var ei=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),U={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+)[ \t]*)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,blockquoteMarkerWhitespace:/^( {0,3}>)([ \t]+)/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\][ \t]+\S/,listReplaceTask:/^\[[ xX]\][ \t]+/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,numericCharacterReferenceOrAmpersand:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:_e(t=>new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:_e(t=>new RegExp(`^ {0,${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:_e(t=>new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)),headingBeginRegex:_e(t=>new RegExp(`^ {0,${t}}#{1,6}(?:\\s|$)`)),pedanticHeadingBeginRegex:_e(t=>new RegExp(`^ {0,${t}}#`)),htmlBeginRegex:_e(t=>new RegExp(`^ {0,${t}}(?:</?(?:${nt})(?: +|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`,"i")),blockquoteBeginRegex:_e(t=>new RegExp(`^ {0,${t}}>`))},ea=/^(?:[ \t]*(?:\n|$))+/,ta=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,na=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}(?:(?=`)\1`*|(?=~)\1~*) *(?=\n|$)|$)/,tt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ra=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,An=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,ti=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+)[ \t]*(?:\n+|$)/,ni=A(ti).replace(/bull/g,An).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ia=A(ti).replace(/bull/g,An).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Tn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,oa=/^[^\n]+/,Sn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\\n]|\n(?![ \t]*\n))+/,aa=A(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Sn).replace("title",/(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\\n]|\n(?!\n))*'|\((?:\\[\s\S]|[^()\\])*\))/).getRegex(),sa=A(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,An).getRegex(),nt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",_n=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,la=A("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?:[ \\t]+|\\n|/?>|$)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",_n).replace("tag",nt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ri=t=>A(Tn).replace("hr",tt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",t).replace("html"," {0,3}(?:</?(?:tag)(?: +|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",nt).getRegex(),ca=ri(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),da=ri(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),ua=A(/^( {0,3}> ?(?:(?![ \t]*(?:\n|$))(paragraph)|[^\n]*)(?:\n|$))+/).replace("paragraph",da).getRegex(),Rn={blockquote:ua,code:ta,def:aa,fences:na,heading:ra,hr:tt,html:la,lheading:ni,list:sa,newline:ea,paragraph:ca,table:Re,text:oa},Wr=A("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",tt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html"," {0,3}(?:</?(?:tag)(?: +|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",nt).getRegex(),pa={...Rn,lheading:ia,table:Wr,paragraph:A(Tn).replace("hr",tt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Wr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html"," {0,3}(?:</?(?:tag)(?: +|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",nt).getRegex()},fa={...Rn,html:A(`^ *(?:comment(?: *\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1>(?: *\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?>(?: *\\n{2,}|\\s*$))`).replace("comment",_n).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Re,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:A(Tn).replace("hr",tt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",ni).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ha=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ma=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ii=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,ga=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ce=/[\p{P}\p{S}]/u,We=/[\s\p{P}\p{S}]/u,rt=/[^\s\p{P}\p{S}]/u,va=A(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,We).getRegex(),ba=/[\p{Pi}\p{Ps}"']/u,oi=/(?!~)[\p{P}\p{S}]/u,wa=/(?!~)[\s\p{P}\p{S}]/u,ka=/(?:[^\s\p{P}\p{S}]|~)/u,ya=A(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",ei?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),ai=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,xa=A(ai,"u").replace(/punct/g,ce).getRegex(),Ea=A(ai,"u").replace(/punct/g,oi).getRegex(),Aa=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,Ta=A(Aa,"u").replace(/openQuote/g,ba).replace(/punct/g,ce).getRegex(),si="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Sa=A(si,"gu").replace(/notPunctSpace/g,rt).replace(/punctSpace/g,We).replace(/punct/g,ce).getRegex(),_a=A(si,"gu").replace(/notPunctSpace/g,ka).replace(/punctSpace/g,wa).replace(/punct/g,oi).getRegex(),Ra="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",La=A(Ra,"gu").replace(/notPunctSpace/g,rt).replace(/punctSpace/g,We).replace(/punct/g,ce).getRegex(),Ca=A("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,rt).replace(/punctSpace/g,We).replace(/punct/g,ce).getRegex(),Pa="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",Oa=A(Pa,"gu").replace(/notPunctSpace/g,rt).replace(/punctSpace/g,We).replace(/punct/g,ce).getRegex(),Da=A(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,ce).getRegex(),Ia="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Ma=A(Ia,"gu").replace(/notPunctSpace/g,rt).replace(/punctSpace/g,We).replace(/punct/g,ce).getRegex(),Na=A(/\\(punct)/,"gu").replace(/punct/g,ce).getRegex(),za=A(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/,"gu").replace(/punct/g,ce).getRegex(),$a=A(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Fa=A(_n).replace("(?:-->|$)","-->").getRegex(),Ua=A("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Fa).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),li=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,Lt=A(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",li).getRegex(),Ha=A(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",Lt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\((?:\\[\s\S]|[^)\\])*\)/).getRegex(),Ba=A(/^!?\[(label)\]\[(ref)\]/).replace("label",Lt).replace("ref",Sn).getRegex(),Wa=A(/^!?\[(ref)\](?:\[\])?/).replace("ref",Sn).getRegex(),Gr=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,Ga=A(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",li).getRegex(),ja=A("reflink|nolink(?!\\()","g").replace("reflink",A(/^!?\[(label)\]\[(ref)\]/).replace("label",Ga).replace("ref",Gr).getRegex()).replace("nolink",A(/^!?\[(ref)\](?:\[\])?/).replace("ref",Gr).getRegex()).getRegex(),jr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,qa=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,Va=A(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,qa).getRegex(),Ln={_backpedal:Re,anyPunctuation:Na,anyPunctuationOutsideCode:za,autolink:$a,blockSkip:ya,br:ii,code:ma,del:Re,delLDelim:Re,delRDelim:Re,emStrongLDelim:xa,emStrongRDelimAst:Sa,emStrongRDelimUnd:Ca,escape:ha,link:Ha,nolink:Wa,punctuation:va,reflink:Ba,reflinkSearch:ja,tag:Ua,text:ga,url:Re},Za={...Ln,emStrongLDelim:Ta,emStrongRDelimAst:La,emStrongRDelimUnd:Oa,link:A(/^!?\[(label)\]\((.*?)\)/).replace("label",Lt).getRegex(),reflink:A(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Lt).getRegex()},kn={...Ln,emStrongRDelimAst:_a,emStrongLDelim:Ea,delLDelim:Da,delRDelim:Ma,url:A(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",Va).replace("protocol",jr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:A(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|wwwStart|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",jr).replace(/emailProtocol/g,/(?:mailto|xmpp):/).replace("wwwStart",ei?"(?<![^\\s*_~(])www\\.":"www\\.").getRegex()},Ya={...kn,br:A(ii).replace("{2,}","*").getRegex(),text:A(kn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},_t={normal:Rn,gfm:pa,pedantic:fa},Je={normal:Ln,gfm:kn,breaks:Ya,pedantic:Za},Ka={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},qr=t=>Ka[t];function Q(t,e){if(e){if(U.escapeTest.test(t))return t.replace(U.escapeReplace,qr)}else if(U.escapeTestNoEncode.test(t))return t.replace(U.escapeReplaceNoEncode,qr);return t}function Xa(t){return U.numericCharacterReference.test(t)?t.replace(U.numericCharacterReferenceOrAmpersand,(e,n,r)=>{if(n===void 0&&r===void 0)return"&amp;";let i=n===void 0?Number.parseInt(r,16):Number.parseInt(n,10);return i===0||i>1114111||i>=55296&&i<=57343?"\uFFFD":i===38?"&amp;":String.fromCodePoint(i)}):t}function Vr(t){try{t=encodeURI(t).replace(U.percentDecode,"%")}catch{return null}return t}function Zr(t,e){let n=t.replace(U.findPipe,(o,l,s)=>{let d=!1,m=l;for(;--m>=0&&s[m]==="\\";)d=!d;return d?"|":" |"}),r=n.split(U.splitPipe),i=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;i<r.length;i++)r[i]=r[i].trim().replace(U.slashPipe,"|");return r}function fe(t,e,n){let r=t.length;if(r===0)return"";let i=0;for(;i<r;){let o=t.charAt(r-i-1);if(o===e&&!n)i++;else if(o!==e&&n)i++;else break}return t.slice(0,r-i)}function Yr(t){let e=t.split(`
`),n=e.length-1;for(;n>=0&&U.blankLine.test(e[n]);)n--;return e.length-n<=2?t:e.slice(0,n+1).join(`
`)}function Ct(t){return t.trim().replace(U.multipleSpaceGlobal," ").toLowerCase().toUpperCase().toLowerCase()}function Kr(t,e){if(t.indexOf(e[0])===-1&&t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}var Be=new WeakMap;function Cn(t){let e={"*":-1,_:-1},n=-1,r=t.length;for(let i=0;i<r;i++){let o=t[i];if(o!=="*"&&o!=="_"&&o!=="~")continue;let l=i===0?`
`:t[i-1],s=i+1;for(;s<r&&t[s]===o;)s++;l!==" "&&l!=="	"&&l!==`
`&&l!=="\r"&&l!=="\f"&&(o==="~"?n=i:e[o]=i),i=s-1}return{maskedSrc:t,lastPossibleEmStrongCloserIndex:e,lastPossibleDelCloserIndex:n}}function Qa(t,e){let n=Cn(e),r=Be.get(t);r?r.push(n):Be.set(t,[n])}function Ja(t){let e=Be.get(t);e&&(e.pop(),e.length===0&&Be.delete(t))}function es(t,e,n){let r=Be.get(t)?.at(-1);return r&&r.maskedSrc===e?r.lastPossibleEmStrongCloserIndex[n]:Cn(e).lastPossibleEmStrongCloserIndex[n]}function ts(t,e){let n=Be.get(t)?.at(-1);return n&&n.maskedSrc===e?n.lastPossibleDelCloserIndex:Cn(e).lastPossibleDelCloserIndex}function Rt(t,e=0){let n=e,r="";for(let i of t)if(i==="	"){let o=4-n%4;r+=" ".repeat(o),n+=o}else r+=i,n++;return r}function Xr(t,e,n,r,i){let o=e.href,l=e.title||null,s=t[1].replace(i.other.outputLinkReplace,"$1"),d=t[0].charAt(0)==="!",m=r.state.inLink,f=r.state.linkEmitted,v=r.state.inRawBlock;r.state.inLink=!0,r.state.linkEmitted=!1;let T=r.inlineTokens(s),w=r.state.linkEmitted;if(r.state.linkEmitted=f,r.state.inLink=m,!d){if(w){r.state.inRawBlock=v;return}r.state.linkEmitted=!0}return{type:d?"image":"link",raw:n,href:o,title:l,text:s,tokens:T}}function ns(t,e,n){let r=t.match(n.other.indentCodeCompensation);if(r===null)return e;let i=r[1];return e.split(`
`).map(o=>{let l=o.match(n.other.beginningSpace);if(l===null)return o;let[s]=l;return o.slice(Math.min(s.length,i.length))}).join(`
`)}function Qr(t,e,n,r){if(!e.includes("<"))return!1;for(let i=0;i<e.length;i++){if(e[i]==="\\"){i++;continue}if(e[i]==="`"){let s=r.inline.code.exec(e.slice(i));if(s){i+=s[0].length-1;continue}}if(e[i]!=="<")continue;let o=t.slice(n+i),l=r.inline.tag.exec(o)||r.inline.autolink.exec(o);if(l){if(l[0].length>e.length-i)return!0;i+=l[0].length-1}}return!1}var He=class{options;rules;lexer;constructor(t){this.options=t||Ce}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=this.options.pedantic?e[0]:Yr(e[0]),r=n.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n,codeBlockStyle:"indented",text:r}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],r=ns(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let r=fe(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceTabChar.test(r))&&(n=r.trim())}return{type:"heading",raw:fe(e[0],`
`),depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:fe(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=fe(e[0],`
`).split(`
`),r="",i="",o=[];for(;n.length>0;){let l=!1,s=[],d;for(d=0;d<n.length;d++)if(this.rules.other.blockquoteStart.test(n[d]))s.push(n[d]),l=!0;else if(!l)s.push(n[d]);else break;n=n.slice(d);let m=s.join(`
`),f=m.replace(this.rules.other.blockquoteMarkerWhitespace,(w,E,k)=>E+Rt(k,E.length)).replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${m}`:m,i=i?`${i}
${f}`:f;let v=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(f,o,!0),this.lexer.state.top=v,n.length===0)break;let T=o.at(-1);if(T?.type==="code"||T?.type==="heading"||T?.type==="hr"||T?.type==="html"||T?.type==="table")break;if(T?.type==="blockquote"){let w=T,E=n.join(`
`),k=w.raw+`
`+E.replace(this.rules.other.blockquoteSetextReplace2,""),x=this.blockquote(k);o[o.length-1]=x;let R=k.substring(x.raw.length).replace(/^\n/,""),L=R?R.split(`
`).length:0,K=L?n.slice(0,-L):n;if(K.length>0&&(r=`${r}
${K.join(`
`)}`),i=i.substring(0,i.length-w.text.length)+x.text,n=n.slice(K.length),n.length>0&&this.rules.other.blockquoteStart.test(n[0]))continue;break}else if(T?.type==="list"){let w=T,E=w.raw+`
`+n.join(`
`),k=this.list(E);o[o.length-1]=k;let x=k.raw.length>w.raw.length?E.slice(w.raw.length+1,k.raw.length).split(`
`).length:0;if(x>0){let R=n.slice(0,x).join(`
`);r=`${r}
${R}`,i=`${i}
${R}`}n=n.slice(x);continue}}return{type:"blockquote",raw:r,tokens:o,text:i}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=t,r=()=>n.length-t.length,i=e[1].trim(),o=i.length>1,l={type:"list",raw:"",ordered:o,start:o?+i.slice(0,-1):"",loose:!1,items:[]};i=o?`\\d{1,9}\\${i.slice(-1)}`:`\\${i}`,this.options.pedantic&&(i=o?i:"[*+-]");let s=this.rules.other.listItemRegex(i),d=!1;for(;t;){let f=!1,v="";if(!(e=s.exec(t))||this.rules.block.hr.test(t))break;let T=r();t=t.substring(e[0].length);let w=e[2].split(`
`,1)[0],E=e[1].length,k=this.options.pedantic?Rt(w,E):w.replace(this.rules.other.leadingSpaceTab,q=>Rt(q,E)),x=t.split(`
`,1)[0],R=!k.trim(),L=0;if(this.options.pedantic?(L=2,v=k.trimStart()):R?L=E+1:(L=k.search(this.rules.other.nonSpaceChar),L=L>4?1:L,v=k.slice(L),L+=E),R&&this.rules.other.blankLine.test(x)&&(t=t.substring(x.length+1),f=!0),!f){let q=this.rules.other.nextBulletRegex(L),ee=this.rules.other.hrRegex(L),de=this.rules.other.fencesBeginRegex(L),B=this.options.pedantic?this.rules.other.pedanticHeadingBeginRegex(L):this.rules.other.headingBeginRegex(L),X=this.rules.other.htmlBeginRegex(L),xe=this.rules.other.blockquoteBeginRegex(L);for(;t;){let ue=t.split(`
`,1)[0],N;if(x=ue,this.options.pedantic?(x=x.replace(this.rules.other.listReplaceNesting,"  "),N=x):N=x.replace(this.rules.other.leadingSpaceTab,ne=>Rt(ne)),de.test(x)||B.test(x)||X.test(x)||xe.test(x)||q.test(x)||ee.test(x))break;if(N.search(this.rules.other.nonSpaceChar)>=L||!x.trim())v+=`
`+N.slice(L);else{if(R||k.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||de.test(k)||B.test(k)||X.test(k)||ee.test(k))break;let ne=!this.options.pedantic&&/^ {0,3}(?:=+|-+) *$/.test(x)&&this.rules.block.lheading.test(`${k}
${x}`)?`    ${N.replace(/^ {0,3}/,"")}`:x;v+=`
`+ne}R=!x.trim(),t=t.substring(ue.length+1),k=N.slice(L)}}let K=n.slice(T,r());l.loose||(d?l.loose=!0:this.rules.other.doubleBlankLine.test(K)&&(d=!0)),l.items.push({type:"list_item",raw:K,task:!!this.options.gfm&&this.rules.other.listIsTask.test(v),loose:!1,text:v,tokens:[]})}let m=l.items.at(-1);if(m)m.raw=m.raw.trimEnd(),m.text=m.text.trimEnd();else return;l.raw=n.slice(0,r()).trimEnd();for(let f of l.items)if(this.lexer.state.top=!1,f.tokens=this.lexer.blockTokens(f.text,[]),!l.loose){let v=f.tokens.filter(w=>w.type==="space"),T=v.length>0&&v.some(w=>this.rules.other.anyLine.test(w.raw));l.loose=T}for(let f of l.items){let v=f.tokens[0];if(f.task&&(v?.type==="text"||v?.type==="paragraph")){f.text=f.text.replace(this.rules.other.listReplaceTask,""),v.raw=v.raw.replace(this.rules.other.listReplaceTask,""),v.text=v.text.replace(this.rules.other.listReplaceTask,"");for(let w=this.lexer.inlineQueue.length-1;w>=0;w--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[w].src)){this.lexer.inlineQueue[w].src=this.lexer.inlineQueue[w].src.replace(this.rules.other.listReplaceTask,"");break}let T=this.rules.other.listTaskCheckbox.exec(f.raw);if(T){let w={type:"checkbox",raw:T[0]+" ",checked:T[0]!=="[ ]"};f.checked=w.checked,l.loose?f.tokens[0]&&["paragraph","text"].includes(f.tokens[0].type)&&"tokens"in f.tokens[0]&&f.tokens[0].tokens?(f.tokens[0].raw=w.raw+f.tokens[0].raw,f.tokens[0].text=w.raw+f.tokens[0].text,f.tokens[0].tokens.unshift(w)):f.tokens.unshift({type:"paragraph",raw:w.raw,text:w.raw,tokens:[w]}):f.tokens.unshift(w)}}else f.task&&(f.task=!1)}if(l.loose)for(let f of l.items){f.loose=!0;for(let v of f.tokens)v.type==="text"&&(v.type="paragraph")}return l}}html(t){let e=this.rules.block.html.exec(t);if(e){let n=Yr(e[0]);return{type:"html",block:!0,raw:n,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:n}}}def(t){let e=this.rules.block.def.exec(t);if(e){if(!this.rules.other.startAngleBracket.test(e[2])&&Kr(e[2],"()")!==-1)return;let n=Ct(e[1]),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:fe(e[0],`
`),href:r,title:i}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=Zr(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:fe(e[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let l of r)this.rules.other.tableAlignRight.test(l)?o.align.push("right"):this.rules.other.tableAlignCenter.test(l)?o.align.push("center"):this.rules.other.tableAlignLeft.test(l)?o.align.push("left"):o.align.push(null);for(let l=0;l<n.length;l++)o.header.push({text:n[l],tokens:this.lexer.inline(n[l]),header:!0,align:o.align[l]});for(let l of i)o.rows.push(Zr(l,o.header.length).map((s,d)=>({text:s,tokens:this.lexer.inline(s),header:!1,align:o.align[d]})));return o}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let n=e[1].trim();return{type:"heading",raw:fe(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){if(this.lexer.state.linkParenPossible===!1)return;let e=this.rules.inline.link.exec(t);if(e){let n=e[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&Qr(t,e[1],n,this.rules))return;let r=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let s=fe(r.slice(0,-1),"\\");if((r.length-s.length)%2===0)return}else{let s=Kr(e[2],"()");if(s===-2)return;if(s>-1){let d=(e[0].indexOf("!")===0?5:4)+e[1].length+s;e[2]=e[2].substring(0,s),e[0]=e[0].substring(0,d).trim(),e[3]=""}}let i=fe(e[0].slice(0,-1),"\\");if((e[0].length-i.length)%2===0)return;let o=e[2],l="";if(this.options.pedantic){let s=this.rules.other.pedanticHrefTitle.exec(o);s&&(o=s[1],l=s[3])}else l=e[3]?e[3].slice(1,-1):"";return o=o.trim(),this.rules.other.startAngleBracket.test(o)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?o=o.slice(1):o=o.slice(1,-1)),Xr(e,{href:o&&o.replace(this.rules.inline.anyPunctuation,"$1"),title:l&&l.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let r=n[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&Qr(t,n[1],r,this.rules))return;let i=e[Ct(n[2]||n[1])];if(!i){let o=n[0].charAt(0);return{type:"text",raw:o,text:o}}return Xr(n,i,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!r||!r[1]&&!r[2]&&!r[3]&&!r[4])return;let i=r[0][0],o=n===i,l=e.length-t.length,s=l;for(;!this.options.pedantic&&s>0&&e[s-1]===i;)s--;let d=[...e.slice(Math.max(0,s-2),s)].at(-1)??"",m=d==="*"||d==="_"||!!this.rules.inline.punctuation.exec(d);s<l&&(n=d);let f=s<l?m:!!this.rules.inline.punctuation.exec(n);if(r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))return;let v=r[1]||r[3]||"";if(!v||!n||f){let T=[...r[0]].length-1,w,E,k=T,x=0,R=l-s+T,L=!this.options.pedantic&&!!d.trim()&&(!!v||i==="*"&&!m);if(i!=="*"&&i!=="_")return;let K=i==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd,q=es(this,e,i),ee=e.length-t.length+T;if(q<ee)return;e=e.slice(-1*t.length+T);let de=q-ee;for(K.lastIndex=0;(r=K.exec(e))!==null&&!(r.index>de);){if(w=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!w)continue;if(E=[...w].length,r[3]||r[4]){k+=E;continue}else if(r[5]||r[6]||L){if(o&&(r[5]||r[6]))break;if(R%3&&!((R+E)%3)){x+=E;continue}}if(k-=E,k>0)continue;E=Math.min(E,E+k+x);let B=[...r[0]][0].length,X=t.slice(0,T+r.index+B+E);if(Math.min(T,E)%2){let ue=X.slice(1,-1);return{type:"em",raw:X,text:ue,tokens:this.lexer.inlineTokens(ue)}}let xe=X.slice(2,-2);return{type:"strong",raw:X,text:xe,tokens:this.lexer.inlineTokens(xe)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let r=this.rules.inline.delLDelim.exec(t);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,o,l,s=i,d=this.rules.inline.delRDelim,m=ts(this,e),f=e.length-t.length+i;if(m<f)return;e=e.slice(-1*t.length+i);let v=m-f;for(d.lastIndex=0;(r=d.exec(e))!==null&&!(r.index>v);){if(o=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!o||(l=[...o].length,l!==i))continue;if(r[3]||r[4]){s+=l;continue}if(s-=l,s>0)continue;l=Math.min(l,l+s);let T=[...r[0]][0].length,w=t.slice(0,i+r.index+T+l),E=w.slice(i,-i);return{type:"del",raw:w,text:E,tokens:this.lexer.inlineTokens(E)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let i;do i=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(i!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:n?e[0]:Xa(e[0]),escaped:n}}}},ie=class yn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ce,this.options.tokenizer=this.options.tokenizer||new He,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0};let n={other:U,block:_t.normal,inline:Je.normal};this.options.pedantic?(n.block=_t.pedantic,n.inline=Je.pedantic):this.options.gfm&&(n.block=_t.gfm,this.options.breaks?n.inline=Je.breaks:n.inline=Je.gfm),this.tokenizer.rules=n}static get rules(){return{block:_t,inline:Je}}static lex(e,n){return new yn(n).lex(e)}static lexInline(e,n){return new yn(n).inlineTokens(e)}lex(e){e=e.replace(U.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.state.inRawBlock=!1,this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(U.tabCharGlobal,"    ").replace(U.spaceLine,""));let i=1/0;for(;e;){if(e.length<i)i=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}let o;if(this.options.extensions?.block?.some(s=>(o=s.call({lexer:this},e,n))?(e=e.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.space(e)){e=e.substring(o.raw.length);let s=n.at(-1);o.raw.length===1&&s!==void 0?s.raw+=`
`:n.push(o);continue}if(o=this.tokenizer.code(e)){e=e.substring(o.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+o.raw,s.text+=`
`+o.text,this.inlineQueue.at(-1).src=s.text):n.push(o);continue}if(o=this.tokenizer.fences(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.heading(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.hr(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.blockquote(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.list(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.html(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.def(e)){e=e.substring(o.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+o.raw,s.text+=`
`+o.raw,this.inlineQueue.at(-1).src=s.text):(this.tokens.links[o.tag]||(this.tokens.links[o.tag]={href:o.href,title:o.title}),n.push(o));continue}if(o=this.tokenizer.table(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.lheading(e)){e=e.substring(o.raw.length),n.push(o);continue}let l=e;if(this.options.extensions?.startBlock){let s=1/0,d=e.slice(1),m;this.options.extensions.startBlock.forEach(f=>{m=f.call({lexer:this},d),typeof m=="number"&&m>=0&&(s=Math.min(s,m))}),s<1/0&&s>=0&&(l=e.substring(0,s+1))}if(this.state.top&&(o=this.tokenizer.paragraph(l))){let s=n.at(-1);r&&s?.type==="paragraph"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+o.raw,s.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(o),r=l.length!==e.length,e=e.substring(o.raw.length);continue}if(o=this.tokenizer.text(e)){e=e.substring(o.raw.length);let s=n.at(-1);s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+o.raw,s.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(o);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}linkInText(e){if(!e.includes("["))return!1;let n=this.tokenizer.rules.inline.link;for(let r of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(n.test(r[0])&&e.charAt(r.index-1)!=="!")return!0;for(let r of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let i=r[0],o=i.lastIndexOf("[");if(!(i.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,Ct(i.slice(o+1,-1))))&&!(o>1&&this.linkInText(i.slice(1,o-1))))return!0}return!1}inlineTokens(e,n=[]){this.tokenizer.lexer=this;let r=this.state.linkParenPossible;this.state.linkParenPossible=r&&e.includes(")");try{return this.#s(e,n)}finally{this.state.linkParenPossible=r}}#s(e,n){let r=e.includes("*")||e.includes("_")||e.includes("~")||this.options.hooks?.emStrongMask||this.tokenizer.emStrong!==He.prototype.emStrong||this.tokenizer.del!==He.prototype.del?this.#r(e):e;Qa(this.tokenizer,r);try{return this.#n(e,r,n)}finally{Ja(this.tokenizer)}}#n(e,n,r){let i=!1,o="",l=1/0;for(;e;){if(e.length<l)l=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}i||(o=""),i=!1;let s;if(this.options.extensions?.inline?.some(m=>(s=m.call({lexer:this},e,r))?(e=e.substring(s.raw.length),r.push(s),!0):!1))continue;if(s=this.tokenizer.escape(e)){e=e.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.tag(e)){e=e.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.link(e)){e=e.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(s.raw.length);let m=r.at(-1);s.type==="text"&&m?.type==="text"?(m.raw+=s.raw,m.text+=s.text):r.push(s);continue}if(s=this.tokenizer.emStrong(e,n,o)){e=e.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.codespan(e)){e=e.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.br(e)){e=e.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.del(e,n,o)){e=e.substring(s.raw.length),r.push(s);continue}if(s=this.tokenizer.autolink(e)){e=e.substring(s.raw.length),r.push(s);continue}if(!this.state.inLink&&(s=this.tokenizer.url(e))){e=e.substring(s.raw.length),r.push(s);continue}let d=e;if(this.options.extensions?.startInline){let m=1/0,f=e.slice(1),v;this.options.extensions.startInline.forEach(T=>{v=T.call({lexer:this},f),typeof v=="number"&&v>=0&&(m=Math.min(m,v))}),m<1/0&&m>=0&&(d=e.substring(0,m+1))}if(s=this.tokenizer.inlineText(d)){e=e.substring(s.raw.length),s.raw.slice(-1)!=="_"&&(o=s.raw.slice(-1)),i=!0;let m=r.at(-1);m?.type==="text"?(m.raw+=s.raw,m.text+=s.text):r.push(s);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return r}#r(e){let n=e;if(this.tokens.links&&e.includes("[")){let r=this.tokenizer.rules.inline.reflinkSearch,i=o=>{let l=o.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,Ct(o.slice(l+1,-1))))return o;if(l>1&&o.charAt(0)!=="!"){let s=o.slice(1,l-1);if(this.linkInText(s))return"["+s.replace(r,i)+"]["+"a".repeat(o.length-l-2)+"]"}return"["+"a".repeat(o.length-2)+"]"};n=n.replace(r,i)}return n=n.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode,(r,i,o)=>o?"+".repeat(r.length):i?i+r.slice(i.length,-i.length).replace(/`/g,"+")+i:r),n=n.replace(this.tokenizer.rules.inline.blockSkip,(r,i,o)=>{let l=o?o.length:0;return r.slice(0,l)+"["+"a".repeat(r.length-l-2)+"]"}),n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n,n}infiniteLoopError(e){let n="Infinite loop on byte: "+e;if(this.options.silent)console.error(n);else throw new Error(n)}},Pt=class{options;parser;constructor(t){this.options=t||Ce}space(t){return""}code({text:t,lang:e,escaped:n}){let r=(e||"").match(U.notSpaceStart)?.[0],i=t?t.replace(U.endingNewline,"")+`
`:"";return r?'<pre><code class="language-'+Q(r)+'">'+(n?i:Q(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:Q(i,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,n=t.start,r="";for(let l=0;l<t.items.length;l++){let s=t.items[l];r+=this.listitem(s)}let i=e?"ol":"ul",o=e&&n!==1?' start="'+n+'"':"";return"<"+i+o+`>
`+r+"</"+i+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let i=0;i<t.header.length;i++)n+=this.tablecell(t.header[i]);e+=this.tablerow({text:n});let r="";for(let i=0;i<t.rows.length;i++){let o=t.rows[i];n="";for(let l=0;l<o.length;l++)n+=this.tablecell(o[l]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Q(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,text:n,tokens:r,autolink:i}){let o=i?Q(n,!0):this.parser.parseInline(r),l=Vr(t);if(l===null)return o;t=Q(l,i);let s='<a href="'+t+'"';return e&&(s+=' title="'+Q(e)+'"'),s+=">"+o+"</a>",s}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=Vr(t);if(i===null)return Q(n);t=i;let o=`<img src="${Q(t)}" alt="${Q(n)}"`;return e&&(o+=` title="${Q(e)}"`),o+=">",o}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Q(t.text)}},Pn=class{parser;strong({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}em({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}codespan({text:t}){return t}del({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}html({text:t}){return t}text({text:t}){return t}link({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}image({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}br(){return""}checkbox({raw:t}){return t}},oe=class xn{options;renderer;textRenderer;constructor(e){this.options=e||Ce,this.options.renderer=this.options.renderer||new Pt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Pn,this.textRenderer.parser=this}static parse(e,n){return new xn(n).parse(e)}static parseInline(e,n){return new xn(n).parseInline(e)}parse(e){this.renderer.parser=this;let n="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let l=i,s=this.options.extensions.renderers[l.type].call({parser:this},l);if(s!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(l.type)){n+=s||"";continue}}let o=i;switch(o.type){case"space":{n+=this.renderer.space(o);break}case"hr":{n+=this.renderer.hr(o);break}case"heading":{n+=this.renderer.heading(o);break}case"code":{n+=this.renderer.code(o);break}case"table":{n+=this.renderer.table(o);break}case"blockquote":{n+=this.renderer.blockquote(o);break}case"list":{n+=this.renderer.list(o);break}case"checkbox":{n+=this.renderer.checkbox(o);break}case"html":{n+=this.renderer.html(o);break}case"def":{n+=this.renderer.def(o);break}case"paragraph":{n+=this.renderer.paragraph(o);break}case"text":{n+=this.renderer.text(o);break}default:{let l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return n}parseInline(e,n=this.renderer){this.renderer.parser=this;let r="";for(let i=0;i<e.length;i++){let o=e[i];if(this.options.extensions?.renderers?.[o.type]){let s=this.options.extensions.renderers[o.type].call({parser:this},o);if(s!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(o.type)){r+=s||"";continue}}let l=o;switch(l.type){case"escape":{r+=n.text(l);break}case"html":{r+=n.html(l);break}case"link":{r+=n.link(l);break}case"image":{r+=n.image(l);break}case"checkbox":{r+=n.checkbox(l);break}case"strong":{r+=n.strong(l);break}case"em":{r+=n.em(l);break}case"codespan":{r+=n.codespan(l);break}case"br":{r+=n.br(l);break}case"del":{r+=n.del(l);break}case"text":{r+=n.text(l);break}default:{let s='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return r}},et=class{options;block;constructor(t){this.options=t||Ce}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?ie.lex:ie.lexInline}provideParser(t=this.block){return t?oe.parse:oe.parseInline}};function we(t,e){if(Array.isArray(e))for(let n=0;n<e.length;n++)t.push(e[n]);else t.push(e)}var rs=class{defaults=En();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=oe;Renderer=Pt;TextRenderer=Pn;Lexer=ie;Tokenizer=He;Hooks=et;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(let r of t)switch(we(n,e.call(this,r)),r.type){case"table":{let i=r;for(let o of i.header)we(n,this.walkTokens(o.tokens,e));for(let o of i.rows)for(let l of o)we(n,this.walkTokens(l.tokens,e));break}case"list":{let i=r;we(n,this.walkTokens(i.items,e));break}default:{let i=r;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(o=>{let l=i[o].flat(1/0);we(n,this.walkTokens(l,e))}):i.tokens&&we(n,this.walkTokens(i.tokens,e))}}return n}use(...t){let e=this.defaults.extensions||{renderers:Object.create(null),childTokens:Object.create(null)};return t.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let o=e.renderers[i.name];o?e.renderers[i.name]=function(...l){let s=i.renderer.apply(this,l);return s===!1&&(s=o.apply(this,l)),s}:e.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=e[i.level];o?o.unshift(i.tokenizer):e[i.level]=[i.tokenizer],i.start&&(i.level==="block"?e.startBlock?e.startBlock.push(i.start):e.startBlock=[i.start]:i.level==="inline"&&(e.startInline?e.startInline.push(i.start):e.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(e.childTokens[i.name]=i.childTokens)}),r.extensions=e),n.renderer){let i=this.defaults.renderer||new Pt(this.defaults);for(let o in n.renderer){if(!(o in i))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let l=o,s=n.renderer[l],d=i[l];i[l]=(...m)=>{let f=s.apply(i,m);return f===!1&&(f=d.apply(i,m)),f===!1?"":f??""}}r.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new He(this.defaults);for(let o in n.tokenizer){if(!(o in i))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let l=o,s=n.tokenizer[l],d=i[l];i[l]=(...m)=>{let f=s.apply(i,m);return f===!1&&(f=d.apply(i,m)),f}}r.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new et;for(let o in n.hooks){if(!(o in i))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let l=o,s=n.hooks[l],d=i[l];et.passThroughHooks.has(o)?i[l]=m=>{if(i.options.async&&et.passThroughHooksRespectAsync.has(o))return(async()=>{let v=await s.call(i,m);return d.call(i,v)})();let f=s.call(i,m);return d.call(i,f)}:i[l]=(...m)=>{if(i.options.async)return(async()=>{let v=await s.apply(i,m);return v===!1&&(v=await d.apply(i,m)),v})();let f=s.apply(i,m);return f===!1&&(f=d.apply(i,m)),f}}r.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,o=n.walkTokens;r.walkTokens=function(l){let s=[];return we(s,o.call(this,l)),i&&we(s,i.call(this,l)),s}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return ie.lex(t,e??this.defaults)}parser(t,e){return oe.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let r={...n},i={...this.defaults,...r},o=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=t),i.async)return(async()=>{let l=i.hooks?await i.hooks.preprocess(e):e,s=await(i.hooks?await i.hooks.provideLexer(t):t?ie.lex:ie.lexInline)(l,i),d=i.hooks?await i.hooks.processAllTokens(s):s;i.walkTokens&&await Promise.all(this.walkTokens(d,i.walkTokens));let m=await(i.hooks?await i.hooks.provideParser(t):t?oe.parse:oe.parseInline)(d,i);return i.hooks?await i.hooks.postprocess(m):m})().catch(o);try{i.hooks&&(e=i.hooks.preprocess(e));let l=(i.hooks?i.hooks.provideLexer(t):t?ie.lex:ie.lexInline)(e,i);i.hooks&&(l=i.hooks.processAllTokens(l)),i.walkTokens&&this.walkTokens(l,i.walkTokens);let s=(i.hooks?i.hooks.provideParser(t):t?oe.parse:oe.parseInline)(l,i);return i.hooks&&(s=i.hooks.postprocess(s)),s}catch(l){return o(l)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let r="<p>An error occurred:</p><pre>"+Q(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},Le=new rs;function C(t,e){return Le.parse(t,e)}C.options=C.setOptions=function(t){return Le.setOptions(t),C.defaults=Le.defaults,Jr(C.defaults),C};C.getDefaults=En;C.defaults=Ce;function is(...t){return Le.use(...t),C.defaults=Le.defaults,Jr(C.defaults),C}C.use=is;C.walkTokens=function(t,e){return Le.walkTokens(t,e)};C.parseInline=Le.parseInline;C.Parser=oe;C.parser=oe.parse;C.Renderer=Pt;C.TextRenderer=Pn;C.Lexer=ie;C.lexer=ie.lex;C.Tokenizer=He;C.Hooks=et;C.parse=C;var kl=C.options,yl=C.setOptions,xl=C.walkTokens,El=C.parseInline;var Al=oe.parse,Tl=ie.lex;var On=["image","when","location","attendance","description","price","tags","organizer","eligibility","cfp"],ci=["image","when","location","attendance","description"],di=["google-calendar","outlook-calendar","yahoo-calendar","ics","link"],os=["series","multipart"];function ui(t){return On.includes(t)}function as(t){return os.includes(t)}function pi(t){if(!t)return 1/0;let e=Number.parseInt(t,10);return Number.isFinite(e)&&e>0?e:1/0}function fi(t){return t==="en"||t==="es"?t:"auto"}function hi(t,e){return t!=="auto"?t:e.toLowerCase().startsWith("es")?"es":"en"}function mi(t){return t?.trim()||void 0}function gi(t){return t!=="false"}function vi(t){return t==="cards"?"cards":t==="list"?"list":"calendar"}function Dt(t){return t==="link"||t==="none"?t:"modal"}function bi(t){return t==="none"?"none":"auto"}function ss(t){return t==="google-calendar"||t==="outlook-calendar"||t==="yahoo-calendar"||t==="ics"||t==="link"}function wi(t){if(t==="none")return[];if(!t)return[...di];let e=t.split(",").map(n=>n.trim()).filter(ss);return e.length>0?[...new Set(e)]:[...di]}function ki(t){if(!t)return new Set(ci);let e=t.split(",").map(n=>n.trim()).filter(ui);return e.length>0?new Set(e):new Set(ci)}function yi(t){if(!t)return new Set(On);let e=t.split(",").map(n=>n.trim()).filter(ui);return e.length>0?new Set(e):new Set(On)}function xi(t){return t?new Set(t.split(",").map(e=>e.trim()).filter(as)):new Set}function Ei(t){return t?t.split(",").map(e=>e.trim()).filter(e=>e.length>0):[]}var Ot={small:"160px",medium:"220px",large:"320px"};function Ai(t){let e=t?.trim();return e?e in Ot?Ot[e]:/^\d+(\.\d+)?$/.test(e)?`${e}px`:/^\d+(\.\d+)?(px|rem|em|ch|vw|%)$/.test(e)?e:Ot.medium:Ot.medium}function ls(t,e){this.v=t,this.k=e}function Ti(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function cs(t){if(Array.isArray(t))return t}function ds(t,e){var n=t==null?null:typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"];if(n!=null){var r,i,o,l,s=[],d=!0,m=!1;try{if(o=(n=n.call(t)).next,e===0){if(Object(n)!==n)return;d=!1}else for(;!(d=(r=o.call(n)).done)&&(s.push(r.value),s.length!==e);d=!0);}catch(f){m=!0,i=f}finally{try{if(!d&&n.return!=null&&(l=n.return(),Object(l)!==l))return}finally{if(m)throw i}}return s}}function us(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ps(t,e){return cs(t)||ds(t,e)||fs(t,e)||us()}function fs(t,e){if(t){if(typeof t=="string")return Ti(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Ti(t,e):void 0}}function It(t){var e,n;function r(o,l){try{var s=t[o](l),d=s.value,m=d instanceof ls;Promise.resolve(m?d.v:d).then(function(f){if(m){var v=o==="return"&&d.k?o:"next";if(!d.k||f.done)return r(v,f);f=t[v](f).value}i(!!s.done,f)},function(f){r("throw",f)})}catch(f){i(2,f)}}function i(o,l){o===2?e.reject(l):e.resolve({value:l,done:o}),(e=e.next)?r(e.key,e.arg):n=null}this._invoke=function(o,l){return new Promise(function(s,d){var m={key:o,arg:l,resolve:s,reject:d,next:null};n?n=n.next=m:(e=n=m,r(o,l))})},typeof t.return!="function"&&(this.return=void 0)}It.prototype[typeof Symbol=="function"&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},It.prototype.next=function(t){return this._invoke("next",t)},It.prototype.throw=function(t){return this._invoke("throw",t)},It.prototype.return=function(t){return this._invoke("return",t)};var Ui=Object.entries,Si=Object.setPrototypeOf,hs=Object.isFrozen,Hi=Object.getPrototypeOf,Bi=Object.getOwnPropertyDescriptor,H=Object.freeze,G=Object.seal,Ge=Object.create,Wi=typeof Reflect<"u"&&Reflect,Bn=Wi.apply,Wn=Wi.construct;H||(H=function(e){return e});G||(G=function(e){return e});Bn||(Bn=function(e,n){for(var r=arguments.length,i=new Array(r>2?r-2:0),o=2;o<r;o++)i[o-2]=arguments[o];return e.apply(n,i)});Wn||(Wn=function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return new e(...r)});var he=I(Array.prototype.forEach);Array.prototype.indexOf;var ms=I(Array.prototype.lastIndexOf),_i=I(Array.prototype.pop),it=I(Array.prototype.push),gs=I(Array.prototype.slice),vs=I(Array.prototype.splice),je=Array.isArray,Dn=Gi(Set),In=I(Set.prototype.add),ot=I(Set.prototype.has),Pe=I(String.prototype.toLowerCase),Mn=I(String.prototype.toString),Ri=I(String.prototype.match),at=I(String.prototype.replace),Li=I(String.prototype.indexOf),bs=I(String.prototype.trim),ws=I(Number.prototype.toString),ks=I(Boolean.prototype.toString),Ci=typeof BigInt>"u"?null:I(BigInt.prototype.toString),Pi=typeof Symbol>"u"?null:I(Symbol.prototype.toString),Y=I(Object.prototype.hasOwnProperty),st=I(Object.prototype.toString),W=I(RegExp.prototype.test),me=Gi(TypeError);function I(t){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return Bn(t,e,r)}}function Gi(t){return function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return Wn(t,n)}}function _(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Pe;if(Si&&Si(t,null),!je(e))return t;let r=e.length;for(;r--;){let i=e[r];if(typeof i=="string"){let o=n(i);o!==i&&(hs(e)||(e[r]=o),i=o)}t[i]=!0}return t}function ys(t){for(let e=0;e<t.length;e++)Y(t,e)||(t[e]=null);return t}function J(t){let e=Ge(null);for(let r of Ui(t)){var n=ps(r,2);let i=n[0],o=n[1];Y(t,i)&&(je(o)?e[i]=ys(o):o&&typeof o=="object"&&o.constructor===Object?e[i]=J(o):e[i]=o)}return e}function xs(t){switch(typeof t){case"string":return t;case"number":return ws(t);case"boolean":return ks(t);case"bigint":return Ci?Ci(t):"0";case"symbol":return Pi?Pi(t):"Symbol()";case"undefined":return st(t);case"function":case"object":{if(t===null)return st(t);let e=t,n=te(e,"toString");if(typeof n=="function"){let r=n(e);return typeof r=="string"?r:st(r)}return st(t)}default:return st(t)}}function te(t,e){for(;t!==null;){let r=Bi(t,e);if(r){if(r.get)return I(r.get);if(typeof r.value=="function")return I(r.value)}t=Hi(t)}function n(){return null}return n}function Es(t,e){for(;t!==null;){let n=Bi(t,e);if(n)return n.get?I(n.get):null;t=Hi(t)}return null}function As(t){try{return W(t,""),!0}catch{return!1}}var Oi=H(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Nn=H(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),zn=H(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Ts=H(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),$n=H(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Ss=H(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Di=H(["#text"]),Ii=H(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),Fn=H(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Mi=H(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Mt=H(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),_s=G(/{{[\w\W]*|^[\w\W]*}}/g),Rs=G(/<%[\w\W]*|^[\w\W]*%>/g),Ls=G(/\${[\w\W]*/g),Cs=G(/^data-[\-\w.\u00B7-\uFFFF]+$/),Ps=G(/^aria-[\-\w]+$/),Ni=G(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Os=G(/^(?:\w+script|data):/i),Ds=G(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Is=G(/^html$/i),Ms=G(/^[a-z][.\w]*(-[.\w]+)+$/i),Un=G(/<[/\w!]/g),zi=G(/<[/\w]/g),Ns=G(/<\/no(script|embed|frames)/i),$i=G(/\/>/i),$={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},zs=H(_({},["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"])),$s=function(){return typeof window>"u"?null:window},Fs=function(e,n){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let r=null,i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(r=n.getAttribute(i));let o="dompurify"+(r?"#"+r:"");try{return e.createPolicy(o,{createHTML(l){return l},createScriptURL(l){return l}})}catch{return console.warn("TrustedTypes policy "+o+" could not be created."),null}},Fi=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},ke=function(e,n,r,i){return Y(e,n)&&je(e[n])?_(i.base?J(i.base):{},e[n],i.transform):r},Hn=function(e,n,r){let i=Y(e,n)?e[n]:void 0;return i&&typeof i=="object"?J(i):r()};function ji(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:$s(),e=h=>ji(h);if(e.version="3.4.17",e.removed=[],!t||!t.document||t.document.nodeType!==$.document||!t.Element)return e.isSupported=!1,e;let n=t.document,r=n,i=r.currentScript;t.DocumentFragment;let o=t.HTMLTemplateElement,l=t.Node,s=t.Element,d=t.NodeFilter;t.NamedNodeMap===void 0&&(t.NamedNodeMap||t.MozNamedAttrMap),t.HTMLFormElement;let m=t.DOMParser,f=t.trustedTypes,v=s.prototype,T=te(v,"cloneNode"),w=te(v,"remove"),E=te(v,"removeAttributeNode"),k=te(v,"nextSibling"),x=te(v,"childNodes"),R=te(v,"parentNode"),L=te(v,"shadowRoot"),K=te(v,"attributes"),q=l&&l.prototype?te(l.prototype,"nodeType"):null,ee=l&&l.prototype?te(l.prototype,"nodeName"):null,de=l&&l.prototype?te(l.prototype,"ownerDocument"):null,B=function(a){return q?q(a):a.nodeType},X=function(a){return ee?ee(a):a.nodeName},xe=Es(v,"namespaceURI"),ue=function(a){return xe?xe(a):a.namespaceURI};if(typeof o=="function"){let h=n.createElement("template");h.content&&h.content.ownerDocument&&(n=h.content.ownerDocument)}let N,ne="",Wt,dr=!1,qe=0,ur=function(){if(qe>0)throw me('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},De=function(a){ur(),qe++;try{return N.createHTML(a)}finally{qe--}},ko=function(a){ur(),qe++;try{return N.createScriptURL(a)}finally{qe--}},yo=function(){return dr||(Wt=Fs(f,i),dr=!0),Wt},pt=n,Gt=pt.implementation,pr=pt.createNodeIterator,xo=pt.createDocumentFragment,Eo=pt.getElementsByTagName,Ao=r.importNode,P=Fi();e.isSupported=typeof Ui=="function"&&typeof R=="function"&&Gt&&Gt.createHTMLDocument!==void 0;let To=_s,So=Rs,_o=Ls,Ro=Cs,Lo=Ps,Co=Os,fr=Ds,Po=Ms,hr=Ni,O=null,jt=_({},[...Oi,...Nn,...zn,...$n,...Di]),D=null,qt=_({},[...Ii,...Fn,...Mi,...Mt]),ae=Object.seal(Ge(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Ve=null,mr=null,ge=Object.seal(Ge(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),gr=!0,Vt=!0,vr=!1,Zt=!0,pe=!1,Ee=!0,Ae=!1,Yt=!1,ft=null,ht=null,Kt=!1,Ie=!1,mt=!1,gt=!1,br=!0,wr=!1,kr="user-content-",Xt=!0,Qt=!1,Te=null,Me={},Se=null,yr=_({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]),xr=null,Er=_({},["audio","video","img","source","image","track"]),Ar=null,Tr=_({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),vt="http://www.w3.org/1998/Math/MathML",bt="http://www.w3.org/2000/svg",se="http://www.w3.org/1999/xhtml",Ne=se,Jt=!1,en=null,Oo=_({},[vt,bt,se],Mn),Sr=H(["mi","mo","mn","ms","mtext"]),tn=_({},Sr),_r=H(["annotation-xml"]),nn=_({},_r),Do=_({},["title","style","font","a","script"]),Ze=null,Io=["application/xhtml+xml","text/html"],Mo="text/html",z=null,ze=null,No=n.createElement("form"),Rr=function(a){return a instanceof RegExp||a instanceof Function},rn=function(){let a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(ze&&ze===a)return;(!a||typeof a!="object")&&(a={}),a=J(a),Ze=Io.indexOf(a.PARSER_MEDIA_TYPE)===-1?Mo:a.PARSER_MEDIA_TYPE,z=Ze==="application/xhtml+xml"?Mn:Pe,O=ke(a,"ALLOWED_TAGS",jt,{transform:z}),D=ke(a,"ALLOWED_ATTR",qt,{transform:z}),en=ke(a,"ALLOWED_NAMESPACES",Oo,{transform:Mn}),Ar=ke(a,"ADD_URI_SAFE_ATTR",Tr,{transform:z,base:Tr}),xr=ke(a,"ADD_DATA_URI_TAGS",Er,{transform:z,base:Er}),Se=ke(a,"FORBID_CONTENTS",yr,{transform:z}),Ve=ke(a,"FORBID_TAGS",J({}),{transform:z}),mr=ke(a,"FORBID_ATTR",J({}),{transform:z}),Me=Y(a,"USE_PROFILES")?a.USE_PROFILES&&typeof a.USE_PROFILES=="object"?J(a.USE_PROFILES):a.USE_PROFILES:!1,gr=a.ALLOW_ARIA_ATTR!==!1,Vt=a.ALLOW_DATA_ATTR!==!1,vr=a.ALLOW_UNKNOWN_PROTOCOLS||!1,Zt=a.ALLOW_SELF_CLOSE_IN_ATTR!==!1,pe=a.SAFE_FOR_TEMPLATES||!1,Ee=a.SAFE_FOR_XML!==!1,Ae=a.WHOLE_DOCUMENT||!1,Ie=a.RETURN_DOM||!1,mt=a.RETURN_DOM_FRAGMENT||!1,gt=a.RETURN_TRUSTED_TYPE||!1,Kt=a.FORCE_BODY||!1,br=a.SANITIZE_DOM!==!1,wr=a.SANITIZE_NAMED_PROPS||!1,Xt=a.KEEP_CONTENT!==!1,Qt=a.IN_PLACE||!1,hr=As(a.ALLOWED_URI_REGEXP)?a.ALLOWED_URI_REGEXP:Ni,Ne=typeof a.NAMESPACE=="string"?a.NAMESPACE:se,tn=Hn(a,"MATHML_TEXT_INTEGRATION_POINTS",()=>_({},Sr)),nn=Hn(a,"HTML_INTEGRATION_POINTS",()=>_({},_r));let c=Hn(a,"CUSTOM_ELEMENT_HANDLING",()=>Ge(null));if(ae=Ge(null),Y(c,"tagNameCheck")&&Rr(c.tagNameCheck)&&(ae.tagNameCheck=c.tagNameCheck),Y(c,"attributeNameCheck")&&Rr(c.attributeNameCheck)&&(ae.attributeNameCheck=c.attributeNameCheck),Y(c,"allowCustomizedBuiltInElements")&&typeof c.allowCustomizedBuiltInElements=="boolean"&&(ae.allowCustomizedBuiltInElements=c.allowCustomizedBuiltInElements),G(ae),pe&&(Vt=!1),mt&&(Ie=!0),Me&&(O=_({},Di),D=Ge(null),Me.html===!0&&(_(O,Oi),_(D,Ii)),Me.svg===!0&&(_(O,Nn),_(D,Fn),_(D,Mt)),Me.svgFilters===!0&&(_(O,zn),_(D,Fn),_(D,Mt)),Me.mathMl===!0&&(_(O,$n),_(D,Mi),_(D,Mt))),ge.tagCheck=null,ge.attributeCheck=null,Y(a,"ADD_TAGS")&&(typeof a.ADD_TAGS=="function"?ge.tagCheck=a.ADD_TAGS:je(a.ADD_TAGS)&&(O===jt&&(O=J(O)),_(O,a.ADD_TAGS,z))),Y(a,"ADD_ATTR")&&(typeof a.ADD_ATTR=="function"?ge.attributeCheck=a.ADD_ATTR:je(a.ADD_ATTR)&&(D===qt&&(D=J(D)),_(D,a.ADD_ATTR,z))),Y(a,"ADD_FORBID_CONTENTS")&&je(a.ADD_FORBID_CONTENTS)&&(Se===yr&&(Se=J(Se)),_(Se,a.ADD_FORBID_CONTENTS,z)),Xt&&(O["#text"]=!0),Ae&&_(O,["html","head","body"]),O.table&&(_(O,["tbody"]),delete Ve.tbody),a.TRUSTED_TYPES_POLICY){if(typeof a.TRUSTED_TYPES_POLICY.createHTML!="function")throw me('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof a.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw me('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');let u=N;N=a.TRUSTED_TYPES_POLICY;try{ne=De("")}catch(p){throw N=u,p}}else a.TRUSTED_TYPES_POLICY===null?(N=void 0,ne=""):(N===void 0&&(N=yo()),N&&typeof ne=="string"&&(ne=De("")));H&&H(a),ze=a},Lr=_({},[...Nn,...zn,...Ts]),Cr=_({},[...$n,...Ss]),zo=function(a,c,u){return c.namespaceURI===se?a==="svg":c.namespaceURI===vt?a==="svg"&&(u==="annotation-xml"||tn[u]):!!Lr[a]},$o=function(a,c,u){return c.namespaceURI===se?a==="math":c.namespaceURI===bt?a==="math"&&nn[u]:!!Cr[a]},Fo=function(a,c,u){return c.namespaceURI===bt&&!nn[u]||c.namespaceURI===vt&&!tn[u]?!1:!Cr[a]&&(Do[a]||!Lr[a])},Uo=function(a){let c=ue(a),u=Pe(X(a)),p=R(a),b,y;return p&&B(p)===$.element?(b={namespaceURI:ue(p)},y=Pe(X(p))):(b={namespaceURI:Ne},y="template"),en[c]?c===bt?zo(u,b,y):c===vt?$o(u,b,y):c===se?Fo(u,b,y):!!(Ze==="application/xhtml+xml"&&en[c]):!1},ve=function(a){it(e.removed,{element:a});try{R(a).removeChild(a)}catch{if(w(a),!R(a))throw me("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},Pr=function(a,c,u){try{E(a,c)}catch{try{a.removeAttribute(u)}catch{}}},on=function(a){sn(a);let c=x(a);c&&he(gs(c),p=>{try{w(p)}catch{}});let u=B(a)===$.element?K(a):null;if(u)for(let p=u.length-1;p>=0;--p){let b=u[p],y=b&&b.name;typeof y=="string"&&Pr(a,b,y)}},$e=function(a,c,u){if(!u)try{u=c.getAttributeNode(a)}catch{u=null}it(e.removed,{attribute:u||null,from:c});try{u?E(c,u):c.removeAttribute(a)}catch{try{c.removeAttribute(a)}catch{}}if(a==="is")if(Ie||mt)try{ve(c)}catch{}else try{c.setAttribute(a,"")}catch{}},Or=function(a){let c=K(a);if(c)for(let u=c.length-1;u>=0;--u){let p=c[u],b=p&&p.name;typeof b!="string"||D[z(b)]||Pr(a,p,b)}},an=function(a,c){let u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,p=[a];for(;p.length>0;){let b=p.pop();if(c(b)===!1)continue;if(u&&B(b)===$.element){let S=L(b);be(S)&&p.push(S)}let y=x(b);if(y)for(let S=y.length-1;S>=0;--S)p.push(y[S])}},sn=function(a){an(a,c=>{B(c)===$.element&&Or(c)})},ln=function(a){let c=[];return an(a,u=>{c.push(u)},!0),c},Ho=function(a,c){let u=Dn();he(ln(a),p=>{B(p)===$.element&&In(u,p)}),he(c,p=>{B(p)===$.element&&!ot(u,p)&&Or(p)})},Dr=function(a,c){let u=!1;return he(e.removed,p=>{p.element&&(u=u||p.element===a,sn(p.element))}),Ho(a,c),u},Bo=8,Wo=function(a,c){let u=Te,p=null,b=()=>(p||(p=Dn(),he(c,y=>{In(p,y)})),p);for(let y=0;;y++){let S=ln(a),F=[a],le=!1;if(he(S,j=>{B(j)===$.documentFragment?it(F,j):!le&&!ot(u,j)&&(le=ot(b(),j))}),!le)return;if(y>=Bo)throw me("the tree kept changing during in-place sanitization; refusing to return it");he(F,(j,V)=>{Go(j,V>0,a,b())})}},Go=function(a,c,u,p){let b=cn(a),y;for(;y=b.nextNode();)!ot(p,y)||ot(Te,y)||(c&&re(P.uponSanitizeShadowNode,y,null),un(y,u),pn(y,u),be(y.content)&&Ke(y.content))},jo=function(a){Te&&In(Te,a)},Ir=function(a,c){return Ee?a==="patchsrc"?!0:a==="for"&&c!=="label"&&c!=="output":!1},qo=function(a){Ee&&an(a,c=>{let u=B(c);if(u===$.processingInstruction||u===$.comment&&W(zi,c.data)){try{w(c)}catch{}return!1}if(u===$.element){let p=c,b=z(X(c));try{p.hasAttribute&&p.hasAttribute("patchsrc")&&p.removeAttribute("patchsrc"),p.hasAttribute&&p.hasAttribute("for")&&Ir("for",b)&&p.removeAttribute("for")}catch{}}return!0})},Mr=function(a){let c=null,u=null;if(Kt)a="<remove></remove>"+a;else{let y=Ri(a,/^[\r\n\t ]+/);u=y&&y[0]}Ze==="application/xhtml+xml"&&Ne===se&&(a='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+a+"</body></html>");let p=N?De(a):a;if(Ne===se)try{c=new m().parseFromString(p,Ze)}catch{}if(!c||!c.documentElement){c=Gt.createDocument(Ne,"template",null);try{c.documentElement.innerHTML=Jt?ne:p}catch{}}let b=c.body||c.documentElement;return a&&u&&b.insertBefore(n.createTextNode(u),b.childNodes[0]||null),Ne===se?Eo.call(c,Ae?"html":"body")[0]:Ae?c.documentElement:b},cn=function(a){let c=de?de(a):a.ownerDocument;return pr.call(c||a,a,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},wt=function(a){return a=at(a,To," "),a=at(a,So," "),a=at(a,_o," "),a},dn=function(a){var c;Nr(a);let u=(c=a.querySelectorAll)===null||c===void 0?void 0:c.call(a,"template");u&&he(u,p=>{be(p.content)&&dn(p.content)})},Nr=function(a){a.normalize();let c=de?de(a):a.ownerDocument,u=pr.call(c||a,a,d.SHOW_TEXT|d.SHOW_COMMENT|d.SHOW_CDATA_SECTION|d.SHOW_PROCESSING_INSTRUCTION,null),p=u.nextNode();for(;p;)p.data=wt(p.data),p=u.nextNode()},kt=function(a){let c=ee?ee(a):null;return typeof c!="string"||z(c)!=="form"?!1:typeof a.nodeName!="string"||typeof a.textContent!="string"||typeof a.removeChild!="function"||a.attributes!==K(a)||typeof a.removeAttribute!="function"||typeof a.removeAttributeNode!="function"||typeof a.getAttributeNode!="function"||typeof a.setAttribute!="function"||typeof a.namespaceURI!="string"||typeof a.insertBefore!="function"||typeof a.hasChildNodes!="function"||a.nodeType!==q(a)||a.childNodes!==x(a)},be=function(a){if(!q||typeof a!="object"||a===null)return!1;try{return q(a)===$.documentFragment}catch{return!1}},Ye=function(a){if(!q||typeof a!="object"||a===null)return!1;try{return typeof q(a)=="number"}catch{return!1}};function re(h,a,c){h.length!==0&&he(h,u=>{u.call(e,a,c,ze)})}let Vo=function(a,c){return!!(Ee&&a.hasChildNodes()&&!Ye(a.firstElementChild)&&W(Un,a.textContent)&&W(Un,a.innerHTML)||Ee&&zs[c]&&B(a)===$.element&&ue(a)===se&&(Ye(a.firstElementChild)||typeof a.textContent=="string"&&W(Un,a.textContent))||a.nodeType===$.processingInstruction||Ee&&a.nodeType===$.comment&&W(zi,a.data))},yt=function(a,c){if(a instanceof RegExp)return W(a,c);if(a instanceof Function){for(var u=arguments.length,p=new Array(u>2?u-2:0),b=2;b<u;b++)p[b-2]=arguments[b];return!!a(c,...p)}return!1},Zo=function(a,c,u){if(!Ve[c]&&Fr(c)&&yt(ae.tagNameCheck,c))return!1;if(Xt&&!Se[c]&&!Se[Pe(c)]){let p=R(a),b=x(a);if(b&&p){let y=b.length;for(let S=y-1;S>=0;--S){let F=a===u?T(b[S],!0):b[S];p.insertBefore(F,k(a))}}}return ve(a),!0},zr=function(a,c,u,p){return a.length===0?c:c===u||c===p?J(c):c},Fe=function(a,c){return a===c||R(a)!==null?!1:(Qt&&sn(a),!0)},un=function(a,c){if(jo(a),re(P.beforeSanitizeElements,a,null),Fe(a,c))return!0;if(kt(a))return ve(a),!0;let u=z(X(a));if(O=zr(P.uponSanitizeElement,O,jt,ft),re(P.uponSanitizeElement,a,{tagName:u,allowedTags:O}),Fe(a,c))return!0;if(Vo(a,u))return ve(a),!0;if(Ve[u]||!(ge.tagCheck instanceof Function&&ge.tagCheck(u))&&!O[u]){let p=Zo(a,u,c);return p===!1&&(re(P.afterSanitizeElements,a,null),Fe(a,c))?!0:p}if(B(a)===$.element&&!Uo(a)||(u==="noscript"||u==="noembed"||u==="noframes")&&W(Ns,a.innerHTML))return ve(a),!0;if(pe&&a.nodeType===$.text){let p=wt(a.textContent);a.textContent!==p&&(it(e.removed,{element:a.cloneNode()}),a.textContent=p)}return re(P.afterSanitizeElements,a,null),Fe(a,c)},$r=function(a,c,u){if(mr[c]||Ir(c,a)||br&&(c==="id"||c==="name")&&(u in n||u in No))return!1;let p=D[c]||ge.attributeCheck instanceof Function&&ge.attributeCheck(c,a);return Vt&&W(Ro,c)||gr&&W(Lo,c)?!0:p?Ar[c]||W(hr,at(u,fr,""))||(c==="src"||c==="xlink:href"||c==="href")&&a!=="script"&&Li(u,"data:")===0&&xr[a]||vr&&!W(Co,at(u,fr,""))?!0:!u:Fr(a)&&yt(ae.tagNameCheck,a)&&yt(ae.attributeNameCheck,c,a)||c==="is"&&ae.allowCustomizedBuiltInElements&&yt(ae.tagNameCheck,u)},Yo=_({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),Fr=function(a){return!Yo[Pe(a)]&&W(Po,a)},Ko=function(a,c,u,p){if(N&&typeof f=="object"&&typeof f.getAttributeType=="function"&&!u)switch(f.getAttributeType(a,c)){case"TrustedHTML":return De(p);case"TrustedScriptURL":return ko(p)}return p},Xo=function(a,c,u,p){try{return u?a.setAttributeNS(u,c,p):a.setAttribute(c,p),kt(a)?(ve(a),!1):!0}catch{return $e(c,a),!1}},Ur=function(a,c){return Ee&&W(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,c)?!0:Pe(a)==="attributename"&&Ri(c,"href")!==null},pn=function(a,c){if(re(P.beforeSanitizeAttributes,a,null),Fe(a,c))return;let u=a.attributes;if(!u||kt(a))return;D=zr(P.uponSanitizeAttribute,D,qt,ht);let p={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:D,forceKeepAttr:void 0},b=u.length,y=z(a.nodeName);for(;b--;){let S=u[b],F=S.name,le=S.namespaceURI,j=S.value,V=z(F),Ue=j,Z=F==="value"?Ue:bs(Ue),Hr=!1;if(p.attrName=V,p.attrValue=Z,p.keepAttr=!0,p.forceKeepAttr=void 0,re(P.uponSanitizeAttribute,a,p),Z=p.attrValue,wr&&(V==="id"||V==="name")&&Li(Z,kr)!==0&&($e(F,a,S),Z=kr+Z,Hr=!0),Ur(F,Z)){$e(F,a,S);continue}if(!p.forceKeepAttr){if(!p.keepAttr){$e(F,a,S);continue}if(!Zt&&W($i,Z)){$e(F,a,S);continue}if(pe&&(Z=wt(Z)),!$r(y,V,Z)){$e(F,a,S);continue}Z=Ko(y,V,le,Z),Z!==Ue&&Xo(a,F,le,Z)&&Hr&&_i(e.removed)}}re(P.afterSanitizeAttributes,a,null),Fe(a,c)},Ke=function(a){let c=null,u=cn(a);for(re(P.beforeSanitizeShadowDOM,a,null);c=u.nextNode();)if(re(P.uponSanitizeShadowNode,c,null),un(c,a),pn(c,a),be(c.content)&&Ke(c.content),B(c)===$.element){let p=L(c);be(p)&&(fn(p),Ke(p))}pe&&Nr(a),re(P.afterSanitizeShadowDOM,a,null)},fn=function(a){let c=[{node:a,shadow:null}];for(;c.length>0;){let u=c.pop();if(u.shadow){Ke(u.shadow);continue}let p=u.node,b=B(p)===$.element,y=x(p);if(y)for(let S=y.length-1;S>=0;--S)c.push({node:y[S],shadow:null});if(b){let S=ee?ee(p):null;if(typeof S=="string"&&z(S)==="template"){let F=p.content;be(F)&&c.push({node:F,shadow:null})}}if(b){let S=L(p);be(S)&&c.push({node:null,shadow:S},{node:S,shadow:null})}}};return e.sanitize=function(h){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},c=null,u=null,p=null,b=null;if(Jt=!h,Jt&&(h="<!-->"),typeof h!="string"&&!Ye(h)&&(h=xs(h),typeof h!="string"))throw me("dirty is not a string, aborting");if(!e.isSupported)return h;Yt?(O=ft,D=ht):rn(a),(P.uponSanitizeElement.length>0||P.uponSanitizeAttribute.length>0)&&(O=J(O)),P.uponSanitizeAttribute.length>0&&(D=J(D)),e.removed=[];let y=Qt&&typeof h!="string"&&Ye(h),S=[],F=Te;if(y){qo(h);let V=X(h);if(typeof V=="string"){let Ue=z(V);if(!O[Ue]||Ve[Ue])throw on(h),me("root node is forbidden and cannot be sanitized in-place")}if(kt(h))throw on(h),me("root node is clobbered and cannot be sanitized in-place");S=ln(h),Te=Dn()}else if(Ye(h))c=Mr("<!---->"),u=c.ownerDocument.importNode(h,!0),u.nodeType===$.element&&u.nodeName==="BODY"||u.nodeName==="HTML"?c=u:c.appendChild(u),fn(c);else{if(!Ie&&!pe&&!Ae&&h.indexOf("<")===-1)return N&&gt?De(h):h;if(c=Mr(h),!c)return Ie?null:gt?ne:""}c&&Kt&&ve(c.firstChild);let le=y?h:c;try{y&&fn(h);let V=cn(le);for(;p=V.nextNode();)un(p,le),pn(p,le),be(p.content)&&Ke(p.content);y&&Wo(h,S)}catch(V){throw y&&(on(h),Dr(h,S)),V}finally{Te=F}if(y){if(Dr(h,S))throw me("a node selected for removal could not be safely returned; refusing to sanitize in place");return pe&&dn(h),h}if(Ie){if(pe&&dn(c),mt)for(b=xo.call(c.ownerDocument);c.firstChild;)b.appendChild(c.firstChild);else b=c;return(D.shadowroot||D.shadowrootmode)&&(b=Ao.call(r,b,!0)),b}let j=Ae?c.outerHTML:c.innerHTML;return Ae&&O["!doctype"]&&c.ownerDocument&&c.ownerDocument.doctype&&c.ownerDocument.doctype.name&&W(Is,c.ownerDocument.doctype.name)&&(j="<!DOCTYPE "+c.ownerDocument.doctype.name+`>
`+j),pe&&(j=wt(j)),N&&gt?De(j):j},e.setConfig=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};rn(h),Yt=!0,ft=O,ht=D},e.clearConfig=function(){ze=null,Yt=!1,ft=null,ht=null,N=Wt,ne=""},e.isValidAttribute=function(h,a,c){ze||rn({});let u=z(h),p=z(a);return typeof c=="string"&&(Ur(a,c)||!Zt&&W($i,c))?!1:$r(u,p,c)},e.addHook=function(h,a){typeof a=="function"&&Y(P,h)&&it(P[h],a)},e.removeHook=function(h,a){if(Y(P,h)){if(a!==void 0){let c=ms(P[h],a);return c===-1?void 0:vs(P[h],c,1)[0]}return _i(P[h])}},e.removeHooks=function(h){Y(P,h)&&(P[h]=[])},e.removeAllHooks=function(){P=Fi()},e}var qi=ji();function g(t,e){let n=document.createElement(t);return e&&(n.className=e),n}function M(t,e){return t.textContent=e,t}var Us={headerOf:new Map,infoOf:new Map};function Gn(t,e){if(e.size===0)return Us;let n=new Map;for(let o of t){let l=o.partOf?.id;if(!l)continue;let s=n.get(l);s?s.push(o):n.set(l,[o])}let r=new Map,i=new Map;for(let[o,l]of n){if(l.length<2)continue;let s=Xe(l),d=s[0],m=d.partOf.type;if(!e.has(m))continue;let f=s.length;s.forEach((v,T)=>{r.set(v,d),i.set(v,{key:o,type:m,index:T+1,total:f,members:s})})}return{headerOf:r,infoOf:i}}var Hs={en:{loading:"Loading events\u2026",empty:"No upcoming events.",notFound:"Event not found in this feed.",errorPrefix:"Could not load events: ",online:"Online",onlineEvent:"Online event",free:"Free",updated:"Updated",event:"Event",when:"When",lastUpdate:"Last update",location:"Location",locationUnknown:"Venue not specified",onlineLinkUnknown:"No public link",onlineLinkUnknownHint:"The organizer may share the link privately, e.g. after registration.",organizer:"Organizer",notAvailable:"\u2014",attendance:{"in-person":"In person",online:"Online",hybrid:"Hybrid"},eligibility:{open:"Open to all","members-only":"Members only","approval-required":"Approval required",restricted:"Restricted"},cfp:"Call for Proposals",cfpCloses:t=>`Call for Proposals \u2014 closes ${t}`,close:"Close",eventDetails:"Event details",addToGoogle:"Add to Google Calendar",addToOutlook:"Add to Outlook",addToYahoo:"Add to Yahoo",downloadIcs:"Download ICS",addToCalendar:"Add to calendar",openEventPage:"Open event page",groupSeries:"Series",groupMultipart:"Multi-part",groupCount:t=>`${t} occurrences`,groupCounter:(t,e)=>`${t} of ${e}`,previousOccurrence:"Previous occurrence",nextOccurrence:"Next occurrence"},es:{loading:"Cargando eventos\u2026",empty:"No hay pr\xF3ximos eventos.",notFound:"Evento no encontrado en este feed.",errorPrefix:"No se pudieron cargar los eventos: ",online:"En l\xEDnea",onlineEvent:"Evento en l\xEDnea",free:"Gratis",updated:"Actualizado",event:"Evento",when:"Cu\xE1ndo",lastUpdate:"\xDAltima actualizaci\xF3n",location:"Lugar",locationUnknown:"Sede no especificada",onlineLinkUnknown:"Sin enlace p\xFAblico",onlineLinkUnknownHint:"El organizador podr\xEDa compartir el enlace de forma privada, por ejemplo tras inscribirte.",organizer:"Organizador",notAvailable:"\u2014",attendance:{"in-person":"Presencial",online:"En l\xEDnea",hybrid:"H\xEDbrido"},eligibility:{open:"Abierto a todos","members-only":"Solo miembros","approval-required":"Requiere aprobaci\xF3n",restricted:"Acceso restringido"},cfp:"Convocatoria de ponencias",cfpCloses:t=>`Convocatoria de ponencias \u2014 cierra ${t}`,close:"Cerrar",eventDetails:"Detalles del evento",addToGoogle:"A\xF1adir a Google Calendar",addToOutlook:"A\xF1adir a Outlook",addToYahoo:"A\xF1adir a Yahoo",downloadIcs:"Descargar ICS",addToCalendar:"A\xF1adir al calendario",openEventPage:"Abrir p\xE1gina del evento",groupSeries:"Serie",groupMultipart:"Multi-part",groupCount:t=>`${t} ocurrencias`,groupCounter:(t,e)=>`${t} de ${e}`,previousOccurrence:"Ocurrencia anterior",nextOccurrence:"Ocurrencia siguiente"}};function Vn(t,e="event-description"){let n=g("div",e),r=C.parse(t,{async:!1});n.innerHTML=qi.sanitize(r);for(let i of n.querySelectorAll("a[href]"))i.setAttribute("target","_blank"),i.setAttribute("rel","noopener");return n}function Zn(t,e){let n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("class",e),n.setAttribute("viewBox","0 0 24 24"),n.setAttribute("fill","none"),n.setAttribute("stroke","currentColor"),n.setAttribute("stroke-width","2"),n.setAttribute("stroke-linecap","round"),n.setAttribute("stroke-linejoin","round"),n.setAttribute("aria-hidden","true"),n.setAttribute("focusable","false");for(let r of t){let i=document.createElementNS("http://www.w3.org/2000/svg","path");i.setAttribute("d",r),n.append(i)}return n}function Bs(t){return Zn({online:["M15 10l4.6-2.3A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.4.9L15 14","M3 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2"],"in-person":["M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0","M12 10h.01"],hybrid:["M4 5h9a2 2 0 0 1 2 2v5H2V7a2 2 0 0 1 2-2","M8 19h4","M10 12v7","M18 21s4-3.2 4-6a4 4 0 0 0-8 0c0 2.8 4 6 4 6","M18 15h.01"]}[t],"badge-icon")}function ut(t){return Zn({calendar:["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],"external-link":["M15 3h6v6","M10 14 21 3","M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"],edit:["M12 20h9","M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],trash:["M3 6h18","M8 6V4h8v2","M19 6l-1 14H6L5 6","M10 11v6","M14 11v6"],copy:["M8 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2","M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"],star:["M12 2l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.77 5.82 21 7 14.13 2 9.26l6.91-1L12 2"],check:["M20 6 9 17l-5-5"],bookmark:["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],plus:["M12 5v14","M5 12h14"],folder:["M4 4h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],collection:["M4 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2","M8 2v4","M16 2v4","M7 10h10","M7 14h7"]}[t],"action-icon")}function Yn(t,e){let n=g("span",`badge attendance-badge attendance-${t}`);return n.append(Bs(t),document.createTextNode(e)),n}function Kn(t,e){let n=e.eligibility[t.type],r=t.url?g("a"):g("span");if(r.classList.add("badge","eligibility-badge"),t.url){let i=r;i.href=t.url,i.target="_blank",i.rel="noopener"}return r.textContent=n,t.note&&(r.title=t.note,r.setAttribute("aria-label",`${n}: ${t.note}`)),r}function Xn(t,e){let n=g("a","badge cfp-badge");n.href=t.url,n.target="_blank",n.rel="noopener",n.textContent=e.cfp;let r=ct(t.closesAt,void 0);if(r){let i=e.cfpCloses(r);n.title=i,n.setAttribute("aria-label",i)}return n}function Ws(t,e){return t==="multipart"?e.groupMultipart:e.groupSeries}function Gs(t,e){let n=Ws(t.type,e),r=g("span","badge event-group-badge");return r.textContent=n,r.setAttribute("aria-label",`${n}, ${e.groupCount(t.total)}`),r}function Qn(t,e){let n=eo(t,e),r=t.locationLink??to(n),i=Jn(t,e);if(!r){let l=M(g("span"),i);return js(t)&&(l.title=e.onlineLinkUnknownHint),l}let o=g("a");return o.href=r,o.target="_blank",o.rel="noopener",o.textContent=i,o}function js(t){return t.attendanceMode==="online"&&!t.locationLink&&(!t.location||t.location==="online")}function eo(t,e){return t.location&&t.location!=="online"?t.location:t.attendanceMode==="online"?e.onlineLinkUnknown:e.locationUnknown}function Jn(t,e){let n=eo(t,e),r=t.locationLink??to(n);return qs(r?Tt(r):n,e)}function qs(t,e){return!t||t==="online"?e.online:t==="Online link"||t==="Online event"?e.onlineEvent:t}function to(t){if(t)try{let e=new URL(t);return e.protocol==="http:"||e.protocol==="https:"?t:void 0}catch{return}}function er(t){let e=Et(t.startDate);return e!==null&&e<Date.now()}function no(t){if(!t.feed)return[];let e=t.sort==="none"?[...t.feed.events]:Xe(t.feed.events);return t.eventId!==void 0?e.filter(n=>n.id===t.eventId):e.filter(n=>t.showPast||!er(n))}function Ut(t){return t.layout!=="cards"||t.groupEvents.size===0?{headerOf:new Map,infoOf:new Map}:Gn(no(t),t.groupEvents)}function tr(t){let e=no(t);if(t.layout!=="cards"||t.groupEvents.size===0)return e.slice(0,t.limit);let{headerOf:n}=Gn(e,t.groupEvents),r=new Set,i=[];for(let o of e){let l=n.get(o)??o;r.has(l)||(r.add(l),i.push(l))}return i.slice(0,t.limit)}function Vs(t,e){if(t.amount===0)return e.free;if(t.currency)try{return new Intl.NumberFormat(void 0,{style:"currency",currency:t.currency}).format(t.amount)}catch{return`${t.amount} ${t.currency}`}return String(t.amount)}function nr(t,e){let n=Vs(t,e);if(!t.url)return M(g("span","price"),n);let r=g("a","price");return r.href=t.url,r.target="_blank",r.rel="noopener",r.textContent=n,r}function Vi(t,e){if(!t)return;let n=At(t),r=new Date(`${t}${e==="UTC"&&!n?"Z":""}`);return Number.isNaN(r.valueOf())?void 0:r}function Nt(t,e){let n=t.toISOString();return e?n.slice(0,10).replace(/-/g,""):n.replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z")}function Zs(t){let e=new Date(t);return e.setUTCDate(e.getUTCDate()+1),e}function Ys(t){let e=Vi(t.startDate,t.timezone);if(!e)return;let n=At(t.startDate),r=Vi(n&&t.endDate?gn(t.endDate,1):t.endDate,t.timezone)??(n?Zs(e):e);return{start:e,end:r,dateOnly:n}}function ro(t){return t.description??""}function Ks(t,e,n){if(t==="link")return e.link;let r=Ys(e);if(!r)return;let i=Nt(r.start,r.dateOnly),o=Nt(r.end,r.dateOnly),l=ro(e),s=Jn(e,n);if(t==="google-calendar"){let d=new URL("https://calendar.google.com/calendar/render");return d.searchParams.set("action","TEMPLATE"),d.searchParams.set("text",e.name),d.searchParams.set("dates",`${i}/${o}`),l&&d.searchParams.set("details",l),s&&d.searchParams.set("location",s),e.timezone&&d.searchParams.set("ctz",e.timezone),d.toString()}if(t==="outlook-calendar"){let d=new URL("https://outlook.live.com/calendar/0/action/compose");return d.searchParams.set("rru","addevent"),d.searchParams.set("subject",e.name),d.searchParams.set("startdt",r.start.toISOString()),d.searchParams.set("enddt",r.end.toISOString()),l&&d.searchParams.set("body",l),s&&d.searchParams.set("location",s),d.toString()}if(t==="yahoo-calendar"){let d=new URL("https://calendar.yahoo.com/");return d.searchParams.set("v","60"),d.searchParams.set("title",e.name),d.searchParams.set("st",i),d.searchParams.set("et",o),l&&d.searchParams.set("desc",l),s&&d.searchParams.set("in_loc",s),d.toString()}return`data:text/calendar;charset=utf-8,${encodeURIComponent(Xs(e,r,n))}`}function lt(t){return t.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}function Xs(t,e,n){let r=d=>Nt(d,e.dateOnly),i=e.dateOnly?";VALUE=DATE":"",o=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//OpenTechEvents//ote-events//EN","BEGIN:VEVENT",`UID:${lt(t.link??t.name)}`,`DTSTAMP:${Nt(new Date,!1)}`,`DTSTART${i}:${r(e.start)}`,`DTEND${i}:${r(e.end)}`,`SUMMARY:${lt(t.name)}`],l=ro(t),s=Jn(t,n);return l&&o.push(`DESCRIPTION:${lt(l)}`),s&&o.push(`LOCATION:${lt(s)}`),t.link&&o.push(`URL:${lt(t.link)}`),o.push("END:VEVENT","END:VCALENDAR"),o.join(`\r
`)}function Qs(t){if(!t)return null;let n=new Date(t).valueOf();return Number.isNaN(n)?null:n}function Js(t){let e=Qs(t);if(e===null)return t;let n=Math.round((e-Date.now())/1e3),r=Math.abs(n),i=[["year",31536e3,"y"],["month",2592e3,"mo"],["week",604800,"w"],["day",86400,"d"],["hour",3600,"h"],["minute",60,"m"]];for(let[,o,l]of i)if(r>=o)return`${Math.max(1,Math.round(r/o))}${l}`;return"now"}function ct(t,e){if(!t)return;let n=/^\d{4}-\d{2}-\d{2}$/.test(t),r=new Date(`${t}${e==="UTC"&&!n?"Z":""}`);if(Number.isNaN(r.valueOf()))return e?`${t} (${e})`:t;let i=n?{weekday:"short",month:"short",day:"numeric",year:"numeric"}:{weekday:"short",month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"},o=new Intl.DateTimeFormat(void 0,i).format(r);return e&&!n?`${o} (${e})`:o}function Zi(t){if(!t)return;let e=/^\d{4}-\d{2}-\d{2}$/.test(t),n=new Date(t);if(Number.isNaN(n.valueOf()))return t;let r=e?{month:"short",day:"numeric"}:{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"};return new Intl.DateTimeFormat(void 0,r).format(n)}function el(t){if(!t)return;let e=new Date(t);return Number.isNaN(e.valueOf())?t:new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric"}).format(e)}function tl(t,e){if(!t||!e)return!1;let n=new Date(t),r=new Date(e);return Number.isNaN(n.valueOf())||Number.isNaN(r.valueOf())?!1:n.getFullYear()===r.getFullYear()&&n.getMonth()===r.getMonth()&&n.getDate()===r.getDate()}function Yi(t){if(!t||/^\d{4}-\d{2}-\d{2}$/.test(t))return;let e=new Date(t);if(!Number.isNaN(e.valueOf()))return new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).format(e)}function rr(t){let e=Zi(t.startDate),n=Zi(t.endDate);if(e&&t.endDate&&tl(t.startDate,t.endDate)){let r=el(t.startDate),i=Yi(t.startDate),o=Yi(t.endDate);if(r&&i&&o)return`${r}, ${i}-${o}`}return e&&n&&n!==e?`${e} \u2013 ${n}`:e??t.dateLabel}function ir(t){if(t.dateLabel)return t.dateLabel;let e=ct(t.startDate,t.timezone),n=ct(t.endDate,t.timezone);return e&&n?`${e} to ${n}`:e}function nl(t){let e=rr(t),n=ir(t)??Qe(t),r=e??n;if(!r)return;let i=M(g("p","event-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function rl(t){let e=rr(t),n=ir(t)??Qe(t),r=e??n;if(!r)return;let i=M(g("span","event-detail-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function zt(t){if(t.image)return/^http:\/\//i.test(t.image.url)&&globalThis.location?.protocol==="https:"?void 0:t.image}function or(t,e){let n=zt(t);if(!n)return;let r=g("img","event-image");return r.src=n.url,r.alt=n.alt??t.name,r.loading="lazy",r.addEventListener("error",()=>{r.replaceWith(io(e))}),r}function io(t){if(t){let e=g("img","event-image event-image-placeholder");return e.src=t,e.alt="",e.loading="lazy",e.addEventListener("error",()=>e.replaceWith(g("div","event-image event-image-placeholder"))),e}return g("div","event-image event-image-placeholder")}function il(t,e,n,r){let i=g("li","event");er(t)&&i.classList.add("event-past"),ar(i,t,e),ol(i,t,e);let o=r?.infoOf.get(t);o&&(i.classList.add("event-stacked"),i.append(Gs(o,n))),e.previewFields.has("image")&&i.append(or(t,e.placeholderImage)??io(e.placeholderImage));let l=g("div","event-body");i.append(l);let s=g("h3","event-title");if(t.link&&e.eventClick==="link"){let f=g("a");f.href=t.link,f.target="_blank",f.rel="noopener",f.textContent=t.name,s.append(f)}else s.textContent=t.name;if(l.append(s),e.previewFields.has("when")){let f=nl(t);f&&l.append(f)}let d=g("div","event-badges");e.previewFields.has("attendance")&&t.attendanceMode&&d.append(Yn(t.attendanceMode,n.attendance[t.attendanceMode])),e.previewFields.has("price")&&t.price&&d.append(nr(t.price,n)),e.previewFields.has("eligibility")&&t.eligibility&&d.append(Kn(t.eligibility,n)),e.previewFields.has("cfp")&&t.cfp&&d.append(Xn(t.cfp,n)),sr(d,t,e);let m=g("div","event-meta");if(d.children.length>0&&m.append(d),e.previewFields.has("location")){let f=g("p","event-location");f.append(Qn(t,n)),m.append(f)}if(m.children.length>0&&l.append(m),e.previewFields.has("organizer")&&t.organizerName&&l.append(M(g("p","event-organizer"),t.organizerName)),e.previewFields.has("description")){let f=hn(t.description,220);f&&l.append(Vn(f))}if(e.previewFields.has("tags")&&t.tags&&t.tags.length>0){let f=g("ul","tags");for(let v of t.tags)f.append(M(g("li","tag"),v));l.append(f)}return ul(l,t,n,e),i}function jn(t,e){return t.details?.find(n=>n.label===e)?.value}var oo=new Set(["ID","Source","Image","Updated"]);function ol(t,e,n){n.eventClick!=="none"&&(t.classList.add("event-clickable"),t.tabIndex=0,t.addEventListener("click",r=>{let i=r.target;i instanceof Element&&i.closest("a, button, summary")||Ki(e,n)}),t.addEventListener("keydown",r=>{r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),Ki(e,n))}))}function Ki(t,e){e.onEventOpen?.(t),e.eventClick==="link"&&t.link&&window.open(t.link,"_blank","noopener")}function Oe(t,e,n){n&&t.append(M(g("dt"),e),M(g("dd"),n))}function qn(t,e,n){if(!n)return;let r=g("dd");r.append(n),t.append(M(g("dt"),e),r)}function al(t,e){let n=g("span",`event-header-icon ${t}`);return n.title=e,n.setAttribute("aria-label",e),n}function sl(t,e,n){let r=g("li","event event-row");er(t)&&r.classList.add("event-past"),ar(r,t,n);let i=g("details","event-accordion");r.append(i);let o=g("summary","event-summary");i.append(o);let l=g("span","event-summary-title");l.textContent=t.name,o.append(l);let s=ir(t)??Qe(t),d=rr(t)??s;o.append(M(g("span","event-summary-when"),d||e.notAvailable)),o.append(M(g("span","event-summary-updated"),Js(t.updatedAt??jn(t,"Updated"))??e.notAvailable));let m=g("div","event-details"),f=n.detailFields.has("image")&&!!zt(t),v=t.description?.trim().length??0;!f&&v>0&&v<=180&&m.classList.add("event-details-compact"),i.append(m);let T=g("div","event-details-content"),w=g("div","event-details-main"),E=g("aside","event-details-aside");if(T.append(w,E),m.append(T),f){let R=or(t,n.placeholderImage);R&&E.append(R)}let k=g("div","event-badges");n.detailFields.has("attendance")&&t.attendanceMode&&k.append(Yn(t.attendanceMode,e.attendance[t.attendanceMode])),n.detailFields.has("price")&&t.price&&k.append(nr(t.price,e)),n.detailFields.has("eligibility")&&t.eligibility&&k.append(Kn(t.eligibility,e)),n.detailFields.has("cfp")&&t.cfp&&k.append(Xn(t.cfp,e)),sr(k,t,n),k.children.length>0&&E.append(k),n.detailFields.has("description")&&t.description&&w.append(Vn(t.description));let x=g("dl","event-detail-list");n.detailFields.has("when")&&Oe(x,e.when,s),n.detailFields.has("location")&&qn(x,e.location,Qn(t,e)),n.detailFields.has("organizer")&&Oe(x,e.organizer,t.organizerName),Oe(x,e.updated,ct(t.updatedAt??jn(t,"Updated"),void 0));for(let R of t.details??[])oo.has(R.label)||Oe(x,R.label,R.value);if(x.children.length>0&&E.append(x),n.detailFields.has("tags")&&t.tags&&t.tags.length>0){let R=g("ul","tags");for(let L of t.tags)R.append(M(g("li","tag"),L));w.append(R)}return uo(m,t,e,n),pl(r,t,e,n),r}function Xi(t,e){return t==="google-calendar"?e.addToGoogle:t==="outlook-calendar"?e.addToOutlook:t==="yahoo-calendar"?e.addToYahoo:t==="ics"?e.downloadIcs:e.openEventPage}var $t=new Set(["google-calendar","outlook-calendar","yahoo-calendar","ics"]);function ll(t){return typeof t!="string"&&"type"in t}function cl(t){return typeof t!="string"&&"id"in t}function dt(t){return typeof t=="string"?t:t.type}function ao(t,e){return!t.layouts||t.layouts.includes(e)}function so(t,e){let n=t.placement??"detail";return n===e||n==="both"}function dl(t,e,n){return typeof t=="string"?e==="detail":so(t,e)&&ao(t,n)}function lo(t,e,n){return ho(t,e).filter(r=>(typeof r=="string"||ll(r))&&dl(r,n,t.layout))}function co(t,e,n){return ho(t,e).filter(r=>cl(r)&&so(r,n)&&ao(r,t.layout))}function Ft(t,e,n,r,i){let o=dt(e),l=Ks(o,n,r);if(!l)return;let s=g("a");s.href=l,s.target=o==="ics"?"_self":"_blank",s.rel="noopener",o==="ics"&&s.setAttribute("download","event.ics"),o==="link"?s.append(ut("external-link"),document.createTextNode(Xi(o,r))):s.textContent=Xi(o,r),s.addEventListener("click",()=>i.onEventAction?.(e,n)),t.append(s)}function uo(t,e,n,r){let i=g("div","event-actions"),o=lo(r,e,"detail"),l=o.filter(s=>$t.has(dt(s)));if(l.length>0){let s=g("details","event-action-menu"),d=g("summary","event-action-menu-trigger");d.append(ut("calendar"),document.createTextNode(n.addToCalendar)),s.append(d);let m=g("div","event-action-menu-items");for(let f of l)Ft(m,f,e,n,r);m.children.length>0&&(s.append(m),i.append(s))}for(let s of o)$t.has(dt(s))||Ft(i,s,e,n,r);for(let s of co(r,e,"detail"))i.append(fo(s,e,r));i.children.length>0&&t.append(i)}function po(t,e,n){let r=lo(n,t,"preview"),i=co(n,t,"preview");if(r.length===0&&i.length===0)return;let o=g("div","event-actions event-preview-actions"),l=r.filter(s=>$t.has(dt(s)));if(l.length>0){let s=g("details","event-action-menu"),d=g("summary","event-action-menu-trigger");d.append(ut("calendar"),document.createTextNode(e.addToCalendar)),s.append(d);let m=g("div","event-action-menu-items");for(let f of l)Ft(m,f,t,e,n);m.children.length>0&&(s.append(m),o.append(s))}for(let s of r)$t.has(dt(s))||Ft(o,s,t,e,n);for(let s of i)o.append(fo(s,t,n));return o}function ul(t,e,n,r){let i=po(e,n,r);i&&t.append(i)}function pl(t,e,n,r){let i=po(e,n,r);i&&(i.classList.add("event-row-actions"),t.append(i))}function fo(t,e,n){let r=g("button");return r.type="button",r.classList.add("event-custom-action"),t.variant==="danger"&&r.classList.add("event-action-danger"),t.pressed!==void 0&&r.setAttribute("aria-pressed",String(t.pressed)),t.icon?r.append(ut(t.icon),document.createTextNode(t.label)):r.textContent=t.label,r.addEventListener("click",()=>{n.onEventAction?.(t,e),t.onClick(e,Ht(n,e))}),r}function Ht(t,e){let n=t.eventContext?.(e)??{previewEvent:e,index:t.feed?.events.indexOf(e)??-1},r=Ut(t).infoOf.get(e);return r?{...n,group:r}:n}function ho(t,e){return typeof t.eventActions=="function"?t.eventActions(Ht(t,e)):t.eventActions}function fl(t){return t?(Array.isArray(t)?t:t.split(/\s+/)).map(n=>n.trim()).filter(Boolean):[]}function ar(t,e,n){for(let r of fl(n.eventClassName?.(Ht(n,e))))t.classList.add(r)}function sr(t,e,n){let r=n.eventBadges?.(Ht(n,e))??[];for(let i of r){if(typeof i=="string"){let l=g("span","badge event-custom-badge event-custom-badge-default");l.title=i,l.append(M(g("span","event-custom-badge-label"),i)),t.append(l);continue}let o=g("span",`badge event-custom-badge event-custom-badge-${i.tone??"default"}`);o.title=i.title??i.label,i.icon&&o.append(ut(i.icon)),o.append(M(g("span","event-custom-badge-label"),i.label)),t.append(o)}}function Qi(t){return Zn([t==="left"?"M15 18l-6-6 6-6":"M9 18l6-6-6-6"],"event-modal-nav-icon")}function hl(t,e,n){let r=g("div","event-modal-nav"),i=g("button","event-modal-nav-button");i.type="button",i.setAttribute("aria-label",e.previousOccurrence),i.title=e.previousOccurrence,i.append(Qi("left"));let o=t.members[t.index-2];i.disabled=!o,i.addEventListener("click",()=>{o&&n.onEventOpen?.(o)});let l=g("span","event-modal-nav-counter");l.setAttribute("aria-live","polite"),l.textContent=e.groupCounter(t.index,t.total);let s=g("button","event-modal-nav-button");s.type="button",s.setAttribute("aria-label",e.nextOccurrence),s.title=e.nextOccurrence,s.append(Qi("right"));let d=t.members[t.index];return s.disabled=!d,s.addEventListener("click",()=>{d&&n.onEventOpen?.(d)}),r.append(i,l,s),r}function Ji(t,e,n,r){let i=g("div","event-modal-backdrop");i.tabIndex=-1,i.addEventListener("click",k=>{k.target===i&&n.onEventClose?.()}),i.addEventListener("keydown",k=>{k.key==="Escape"&&n.onEventClose?.()});let o=g("section","event-modal");ar(o,t,n);let l=t.description?.trim().length??0;!zt(t)&&l>0&&l<=180&&o.classList.add("event-modal-compact"),o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-label",e.eventDetails),i.append(o);let s=g("div","event-modal-header");s.append(M(g("h2","event-modal-title"),t.name));let d=g("button","event-modal-close");d.type="button",d.textContent="\xD7",d.title=e.close,d.setAttribute("aria-label",e.close),d.addEventListener("click",()=>n.onEventClose?.()),s.append(d),o.append(s);let m=r?.infoOf.get(t),f=g("div","event-modal-content"),v=g("div","event-modal-main"),T=g("aside","event-modal-aside");if(f.append(v,T),o.append(f),n.detailFields.has("image")&&zt(t)){let k=or(t,n.placeholderImage);k&&T.append(k)}let w=g("div","event-badges");n.detailFields.has("attendance")&&t.attendanceMode&&w.append(Yn(t.attendanceMode,e.attendance[t.attendanceMode])),n.detailFields.has("price")&&t.price&&w.append(nr(t.price,e)),n.detailFields.has("eligibility")&&t.eligibility&&w.append(Kn(t.eligibility,e)),n.detailFields.has("cfp")&&t.cfp&&w.append(Xn(t.cfp,e)),sr(w,t,n),w.children.length>0&&T.append(w),n.detailFields.has("description")&&t.description&&v.append(Vn(t.description));let E=g("dl","event-detail-list");n.detailFields.has("when")&&qn(E,e.when,rl(t)),m&&m.total>1&&E.append(hl(m,e,n)),n.detailFields.has("location")&&qn(E,e.location,Qn(t,e)),n.detailFields.has("organizer")&&Oe(E,e.organizer,t.organizerName),Oe(E,e.updated,ct(t.updatedAt??jn(t,"Updated"),void 0));for(let k of t.details??[])oo.has(k.label)||Oe(E,k.label,k.value);if(E.children.length>0&&T.append(E),n.detailFields.has("tags")&&t.tags&&t.tags.length>0){let k=g("ul","tags");for(let x of t.tags)k.append(M(g("li","tag"),x));v.append(k)}return uo(o,t,e,n),queueMicrotask(()=>d.focus()),i}function mo(t,e){t.replaceChildren();let n=Hs[e.lang];if(e.status==="idle"||e.status==="loading"){t.append(M(g("p","message"),n.loading));return}if(e.status==="error"){t.append(M(g("p","message error"),`${n.errorPrefix}${e.errorMessage}`));return}let r=tr(e);if(r.length===0){let l=e.emptyMessage??(e.eventId!==void 0?n.notFound:n.empty);t.append(M(g("p","message"),l));return}if(e.layout==="calendar"){t.append(M(g("div","calendar-host"),n.loading)),e.selectedEvent&&t.append(Ji(e.selectedEvent,n,e));return}let i=Ut(e),o=g("ul",`events layout-${e.layout}`);if(e.layout==="list"){let l=g("li","event-list-header");l.append(M(g("span"),n.event),M(g("span"),n.when),al("icon-updated",n.lastUpdate)),o.append(l)}for(let l of r)o.append(e.layout==="list"?sl(l,n,e):il(l,e,n,i));t.append(o),e.selectedEvent&&t.append(Ji(e.selectedEvent,n,e,i))}var go=`
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
  grid-template-columns: repeat(auto-fill, minmax(var(--ote-card-min-width, 220px), 1fr));
  gap: 1rem;
}

.event {
  position: relative;
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

/* Only reachable with show-past="true" \u2014 a past occurrence still opens and
   reads normally, it's just visually de-emphasized against upcoming ones. */
.event-past {
  opacity: 0.55;
}

.event-past:hover,
.event-past:focus-visible {
  opacity: 0.85;
}

/* group-events="...": layered "stack of cards" effect for a collapsed
   series/multi-part card. .event has overflow:hidden, which clips
   pseudo-elements but not the element's own box-shadow \u2014 same trick as
   .event-modal's shadow below. Kept within ul.events.layout-cards's 1rem
   gap so it doesn't visually collide with the next card. */
.layout-cards .event-stacked {
  box-shadow:
    0.3rem 0.3rem 0 -0.05rem var(--ote-surface),
    0.3rem 0.3rem 0 0 var(--ote-border),
    0.6rem 0.6rem 0 -0.05rem var(--ote-surface),
    0.6rem 0.6rem 0 0 var(--ote-border);
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

/* .event's overflow:hidden (for cards' flush-edge image corners) would
   otherwise clip .event-row-actions and, more importantly, its calendar
   .event-action-menu-items dropdown \u2014 that menu opens upward from a
   trigger pinned to the row's very top edge, so it has no room to render
   inside a clipped box. List rows have no flush-edge image relying on that
   clipping (.layout-list .event-details .event-image sets its own
   border-radius directly), so it's safe to opt back out here. */
.event-row {
  overflow: visible;
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

/* Compact-row preview actions (layout="list"): a small trailing cluster
   overlaid on top of the collapsed row instead of stacked in the card body,
   so .event-preview-actions's padding-top/border-top (meant for that
   stacked layout) are reset here. .event already sets position:relative on
   the row <li>, so this only needs its own absolute position. Hidden until
   the row is hovered/focused on a fine-pointer device; always shown under
   (hover: none), (pointer: coarse) so touch users don't need a hover state
   that doesn't exist for them. */
.event-row-actions {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0.5rem;
  z-index: 3;
  align-items: center;
  height: 3.25rem;
  margin: 0;
  padding-top: 0;
  border-top: 0;
  border-radius: var(--ote-radius) 0 0 var(--ote-radius);
  background: var(--ote-accent-soft);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;
}

.event-row:hover .event-row-actions,
.event-row:focus-within .event-row-actions {
  opacity: 1;
  pointer-events: auto;
}

@media (hover: none), (pointer: coarse) {
  .event-row-actions {
    opacity: 1;
    pointer-events: auto;
  }
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
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin: 0.35rem 0;
  min-width: 0;
  max-width: 100%;
  font-size: 0.8125rem;
}

.event-meta .event-badges {
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
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
  min-width: 0;
  max-width: 100%;
  font-size: 0.75rem;
  line-height: 1.4;
  background: var(--ote-accent-soft);
  color: var(--ote-accent);
}

/* eligibility/cfp badges, and a priced offer with a registration link, are
   sometimes rendered as <a> rather than <span> \u2014 undo the browser's default
   link underline, matching .event-description a's hover-only underline. */
a.badge,
a.price {
  text-decoration: none;
}

a.badge:hover,
a.badge:focus-visible,
a.price:hover,
a.price:focus-visible {
  text-decoration: underline;
}

/* Positioned after .badge so its background/color win the cascade
   (equal specificity, later rule wins) \u2014 this badge needs contrast against
   a photo, not the pill's usual accent-soft styling. */
.event-group-badge {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-end: 0.5rem;
  z-index: 2;
  background: rgb(0 0 0 / 0.55);
  color: #fff;
}

.badge-icon {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
}

.event-custom-badge-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
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

.event-modal-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0 0.5rem;
}

/* Lives inside .event-detail-list's 2-column grid, right after the "When"
   row \u2014 span both columns so it sits on its own full-width row instead of
   being column-sized alongside the dt/dd label column. */
.event-detail-list .event-modal-nav {
  grid-column: 1 / -1;
}

.event-modal-nav-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  background: transparent;
  color: var(--ote-muted);
  cursor: pointer;
}

.event-modal-nav-button:hover,
.event-modal-nav-button:focus-visible {
  border-color: var(--ote-accent);
  color: var(--ote-accent);
  outline: none;
}

.event-modal-nav-button:disabled {
  opacity: 0.4;
  cursor: default;
}

.event-modal-nav-icon {
  width: 1.1em;
  height: 1.1em;
}

.event-modal-nav-counter {
  font-size: 0.85rem;
  color: var(--ote-muted);
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

.event-description ul,
.event-description ol {
  padding-left: 1.25rem;
}

.event-description h1,
.event-description h2,
.event-description h3,
.event-description h4,
.event-description h5,
.event-description h6 {
  font-weight: 600;
  line-height: 1.3;
  color: var(--ote-text);
}

.event-description h1 {
  font-size: 1.3em;
}

.event-description h2 {
  font-size: 1.2em;
}

.event-description h3 {
  font-size: 1.1em;
}

.event-description h4,
.event-description h5,
.event-description h6 {
  font-size: 1em;
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

  /* The summary stacks into multiple lines at this width, so pinning the
     actions to the top-right (the desktop overlay position) would sit on
     top of the title text. Drop into normal flow, right after the row,
     instead \u2014 still always visible per the touch media query above. */
  .event-row-actions {
    position: static;
    height: auto;
    justify-content: flex-end;
    padding: 0 1rem 0.6rem;
    border-radius: 0;
    background: none;
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
`;var lr=class extends HTMLElement{static observedAttributes=["feed","feeds","event-id","limit","theme","lang","show-past","layout","fields","fields-preview","fields-detail","card-width","group-events","placeholder-image","event-click","event-actions","sort","empty-message"];#s;#n;#r;#i;#u=!1;#l=[];#c;#d=new WeakMap;#o="idle";#a="";#f=0;#t;#h=[];#m;#g;#v;#p=0;#x=!1;constructor(){super();let e=this.attachShadow({mode:"open"});this.#s=document.createElement("style"),this.#s.textContent=go,this.#n=document.createElement("div"),this.#n.className="ote-events",e.append(this.#s,this.#n)}connectedCallback(){this.#u?this.#e():this.#b()}disconnectedCallback(){this.#y()}attributeChangedCallback(e){this.isConnected&&(e==="feed"||e==="feeds"?this.#b():this.#e())}get feedData(){return this.#i}set feedData(e){this.#w(e)}get events(){if(this.#i)return Array.isArray(this.#i)?this.#i:this.#i.events}set events(e){this.#w(e)}get event(){return this.events?.[0]}set event(e){this.#w(e==null?e:[e])}get eventActions(){return this.#h}set eventActions(e){this.#h=Array.isArray(e)||typeof e=="function"?e:[],this.isConnected&&this.#e()}get eventClassName(){return this.#m}set eventClassName(e){this.#m=typeof e=="function"?e:void 0,this.isConnected&&this.#e()}get eventBadges(){return this.#g}set eventBadges(e){this.#g=typeof e=="function"?e:void 0,this.isConnected&&this.#e()}#E(){let e=Ei(this.getAttribute("feeds"));if(e.length>0)return e;let n=this.getAttribute("feed");return n?[n]:[]}async#b(){if(this.#u)return;let e=this.#E();if(e.length===0){this.#o="error",this.#a='Missing required "feed" or "feeds" attribute.',this.#t=void 0,this.#e();return}this.#o="loading",this.#e();let n=++this.#f,r=await Promise.allSettled(e.map(ml));if(n!==this.#f)return;let i=r.filter(o=>o.status==="fulfilled");if(i.length===0){this.#o="error",this.#a=e.length===1?vo(r[0].reason):r.map((o,l)=>`${e[l]}: ${vo(o.reason)}`).join("; "),this.#t=void 0,this.#e();return}try{let o=gl(i.map(s=>s.value)),l=St(o);this.#r=l,this.#i=o,this.#u=!1,this.#l=Bt(o),this.#c=i.length===1?bo(o,i[0].value.url):void 0,this.#d=wo(l,this.#l,this.#c),this.#o="loaded",this.#t=void 0}catch(o){this.#o="error",this.#a=o instanceof Error?o.message:String(o),this.#t=void 0}this.#e()}#w(e){if(this.#f++,e==null){this.#i=void 0,this.#u=!1,this.#r=void 0,this.#l=[],this.#c=void 0,this.#d=new WeakMap,this.#a="",this.#t=void 0,this.isConnected&&this.#b();return}this.#i=e,this.#u=!0;try{this.#r=St(e),this.#l=Bt(e),this.#c=bo(e),this.#d=wo(this.#r,this.#l,this.#c),this.#o="loaded",this.#a="",this.#t=void 0}catch(n){this.#r=void 0,this.#l=[],this.#c=void 0,this.#d=new WeakMap,this.#o="error",this.#a=n instanceof Error?n.message:String(n),this.#t=void 0}this.isConnected&&this.#e()}#e(){this.style.setProperty("--ote-card-min-width",Ai(this.getAttribute("card-width")));let e=hi(fi(this.getAttribute("lang")),navigator.language),n={status:this.#o,errorMessage:this.#a,feed:this.#r,lang:e,limit:pi(this.getAttribute("limit")),eventId:mi(this.getAttribute("event-id")),showPast:gi(this.getAttribute("show-past")),sort:bi(this.getAttribute("sort")),layout:vi(this.getAttribute("layout")),previewFields:ki(this.getAttribute("fields-preview")??this.getAttribute("fields")),detailFields:yi(this.getAttribute("fields-detail")??this.getAttribute("fields")),groupEvents:xi(this.getAttribute("group-events")),placeholderImage:this.getAttribute("placeholder-image")?.trim()||void 0,emptyMessage:this.getAttribute("empty-message")?.trim()||void 0,eventClick:Dt(this.getAttribute("event-click")),eventActions:this.#T(),eventClassName:this.#m,eventBadges:this.#g,eventContext:r=>this.#d.get(r)??{previewEvent:r,index:-1},selectedEvent:this.#t,onEventOpen:r=>{this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#k(void 0,r,n)})),Dt(this.getAttribute("event-click"))==="modal"&&(this.#t=r,this.#e())},onEventClose:()=>{this.#t=void 0,this.#e()},onEventAction:(r,i)=>{let o=typeof r=="string"?r:"type"in r?r.type:r.id;this.dispatchEvent(new CustomEvent("ote-event-action",{detail:this.#k(o,i,n)}))}};if(mo(this.#n,n),n.layout==="calendar"&&n.status==="loaded"){let r=tr(n);if(r.length>0){this.#A(r,n.lang);return}}this.#y()}async#A(e,n){this.#y();let r=++this.#p;try{let i=await import(new URL("./calendar-layout.js",import.meta.url).href);if(r!==this.#p||!this.isConnected)return;this.#x||(this.#s.textContent+=i.CALENDAR_CSS,this.#x=!0);let o=this.#n.querySelector(".calendar-host");if(!o)return;o.classList.remove("ec-dark","ec-auto-dark");let l=this.getAttribute("theme");l==="dark"?o.classList.add("ec-dark"):l!=="light"&&o.classList.add("ec-auto-dark"),o.replaceChildren(),this.#v=i.renderCalendar(o,e,{lang:n,onEventClick:s=>{let d=Dt(this.getAttribute("event-click"));this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#k(void 0,s)})),d==="link"&&s.link?window.open(s.link,"_blank","noopener"):d==="modal"&&(this.#t=s,this.#e())}})}catch(i){if(r!==this.#p||!this.isConnected)return;let o=this.#n.querySelector(".calendar-host");o&&(o.textContent=i instanceof Error?i.message:String(i))}}#T(){let e=wi(this.getAttribute("event-actions")),n=this.#h;return typeof n=="function"?r=>[...e,...n(r)]:[...e,...n]}#k(e,n,r){let i=this.#d.get(n)??{previewEvent:n,index:-1},o=r?Ut(r).infoOf.get(n):void 0;return{...e?{action:e}:{},event:n,previewEvent:n,originalEvent:i.originalEvent,index:i.index,feed:i.feed,source:i.source,...o?{group:o}:{}}}#y(){this.#p++,this.#v?.destroy(),this.#v=void 0}};function Bt(t){return Array.isArray(t)?t:Array.isArray(t.events)?t.events:[]}async function ml(t){let e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}`);let n=await e.text();return{url:t,data:JSON.parse(n)}}function vo(t){return t instanceof Error?t.message:String(t)}function gl(t){return t.length===1?t[0].data:{events:t.flatMap(({url:e,data:n})=>{let r=Array.isArray(n)?void 0:ye(n.title);return Bt(n).map(i=>({...i,_feedUrl:ye(i._feedUrl)??e,...!ye(i._feedTitle)&&r?{_feedTitle:r}:{}}))})}}function ye(t){return typeof t=="string"&&t.trim()?t:void 0}function bo(t,e){let n=Bt(t)[0],r=Array.isArray(t)?void 0:ye(t.title??t._feedTitle),i={url:e??ye(n?._feedUrl),title:r??ye(n?._feedTitle)};return i.url||i.title?i:void 0}function wo(t,e,n){let r=new WeakMap;return t.events.forEach((i,o)=>{let l=e[o],s={url:ye(l?._feedUrl)??n?.url,title:ye(l?._feedTitle)??n?.title};r.set(i,{previewEvent:i,originalEvent:l,index:o,feed:s.url||s.title?s:n,source:l?.source})}),r}function cr(){customElements.get("ote-events")||customElements.define("ote-events",lr)}cr();export{cr as defineOteEvents};
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.4.17 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.17/LICENSE *)
  (*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE *)
*/
//# sourceMappingURL=ote-events.js.map
