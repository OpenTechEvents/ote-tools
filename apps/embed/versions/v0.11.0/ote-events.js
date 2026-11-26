function Sn(t,e=320){if(!t)return;let n=t.replace(/\s+/g," ").trim();return n.length>e?`${n.slice(0,e-1)}\u2026`:n}function si(t){if(Array.isArray(t))return t.length>0?t.join(", "):void 0;if(typeof t=="string")return t.trim()||void 0;if(typeof t=="number"||typeof t=="boolean")return String(t);if(t&&typeof t=="object")return JSON.stringify(t)}function _n(t){return t.flatMap(([e,n])=>{let r=si(n);return r?[{label:e,value:r}]:[]})}function Dt(t){if(!t)return null;let e=/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/.exec(t),r=(e?new Date(`${e[1]}T${e[2]??"00:00:00"}`):new Date(t)).valueOf();return Number.isNaN(r)?null:r}function tt(t){let e=Date.now();return t.map((n,r)=>({event:n,index:r,sortDate:Dt(n.startDate)})).sort((n,r)=>{if(n.sortDate===null&&r.sortDate===null)return n.index-r.index;if(n.sortDate===null)return 1;if(r.sortDate===null)return-1;let i=n.sortDate<e,o=r.sortDate<e;return i!==o?i?1:-1:i?r.sortDate-n.sortDate:n.sortDate-r.sortDate}).map(({event:n})=>n)}function Pt(t){return t!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(t)}function Ln(t,e){let n=new Date(`${t}T00:00:00Z`);return n.setUTCDate(n.getUTCDate()+e),n.toISOString().slice(0,10)}function Mt(t,e){if(!t)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(t))return new Intl.DateTimeFormat(void 0,{dateStyle:"medium"}).format(new Date(`${t}T00:00:00Z`));let r=new Date(`${t}${e==="UTC"?"Z":""}`);if(!Number.isNaN(r.valueOf())){let i=new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short"}).format(r);return e?`${i} (${e})`:i}return e?`${t} (${e})`:t}function Cn(t){return t.location?.venue??It(t.location?.onlineUrl)??"online"}function It(t){if(!t)return;let e;try{e=new URL(t).hostname.toLowerCase().replace(/^www\./,"")}catch{return"Online event"}return e==="meet.google.com"?"Google Meet":e==="teams.microsoft.com"?"Microsoft Teams":e==="meet.jit.si"||e.endsWith(".jitsi.net")?"Jitsi Meet":e==="discord.gg"||e==="discord.com"?"Discord":e==="youtube.com"||e==="youtu.be"?"YouTube":e==="twitch.tv"?"Twitch":e==="lu.ma"?"Luma":e.endsWith(".zoom.us")||e==="zoom.us"?"Zoom":e.endsWith(".slack.com")||e==="slack.com"?"Slack":e.endsWith(".meetup.com")||e==="meetup.com"?"Meetup":e.endsWith(".eventbrite.com")||e==="eventbrite.com"?"Eventbrite":"Online event"}function nt(t){return t.dateLabel??(t.endDate?`${Mt(t.startDate,t.timezone)} to ${Mt(t.endDate,t.timezone)}`:Mt(t.startDate,t.timezone))}function Rn(t){let e=(t??[]).map(n=>typeof n=="string"?{url:n}:n);return e.find(n=>!cs(n.url))??e[0]}function cs(t){return/^http:\/\//i.test(t)}function On(t){let e=t.offers??[],n=t.partOf?.offers??[],r=ds(n);if(e.length===0)return r?{amount:r.price,currency:r.currency,url:r.url,basis:"shared"}:void 0;let i=[];for(let l of e){if(l.price===void 0)continue;if(l.scope!=="add-on"){i.push({amount:l.price,currency:l.currency,url:l.url,basis:"own"});continue}let c=!!r?.currency&&!!l.currency&&r.currency!==l.currency;if(r&&!c){i.push({amount:r.price+l.price,currency:r.currency??l.currency,url:l.url??r.url,basis:"shared-plus-add-on"});continue}i.push({amount:l.price,currency:l.currency,url:l.url,basis:"add-on-only"})}if(i.length===0)return;let o=i.filter(l=>l.basis!=="add-on-only");return(o.length>0?o:i).reduce((l,c)=>c.amount<l.amount?c:l)}var ds=t=>{let e=t.filter(r=>r.price!==void 0);if(e.length===0)return;let n=e.reduce((r,i)=>i.price<r.price?i:r);return{price:n.price,currency:n.currency,url:n.url}};function us(t){if(t?.id)return{id:t.id,type:t.type==="multipart"?"multipart":"series",name:t.name,url:t.url,offers:t.offers}}function ps(t){if(!t||t.amount===void 0)return;let e=`${t.amount}${t.currency?` ${t.currency}`:""}`;switch(t.basis){case"add-on-only":return`+${e} (additional charge, total unknown)`;case"shared":return`${e} (event admission)`;case"shared-plus-add-on":return`${e} (event admission + this part)`;case"own":return e}}function Nt(t){let e=Array.isArray(t)?{events:t}:t;if(!Array.isArray(e.events))throw new Error("feed.json has no events array");return{title:e.title,description:e.description,license:e.license,events:e.events.map(n=>{let r=Rn(n.image),i=On({offers:n.offers,partOf:n.partOf}),o=n.organizers?.[0]?.name;return{id:n.id,name:n.name??"(untitled event)",startDate:n.startDate,endDate:n.endDate,timezone:n.timezone,location:Cn(n),locationLink:n.location?.onlineUrl,link:n.url??n.location?.onlineUrl,description:n.description,image:r,price:i,organizerName:o,tags:n.tags,attendanceMode:n.attendanceMode,updatedAt:n.updatedAt,partOf:us(n.partOf),eligibility:n.eligibility,cfp:n.cfp,details:_n([["ID",n.id],["Status",n.status],["Timezone",n.timezone],["Attendance",n.attendanceMode],["Languages",n.languages],["Tags",n.tags],["Updated",n.updatedAt],["Source",n.source],["Image",r?.url],["Price",ps(i)],["Organizer",o]])}})}}function In(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ne=In();function vi(t){Ne=t}var De={exec:()=>null};function Me(t){let e=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),i=e[r];return i||(i=t(r),e[r]=i),i}}function _(t,e=""){let n=typeof t=="string"?t:t.source,r={replace:(i,o)=>{let s=typeof o=="string"?o:o.source;return s=s.replace(V.caret,"$1"),n=n.replace(i,s),r},getRegex:()=>new RegExp(n,e)};return r}var wi=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),V={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,listInterruptsParagraph:/^ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+)[ \t]*)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,blockquoteMarkerWhitespace:/^( {0,3}>)(\t[ \t]*)/gm,nestedBlockMarker:/^ {0,3}(?:(?:[*+-]|\d{1,9}[.)])(?: |$)|> ?)/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\][ \t]+\S/,listReplaceTask:/^\[[ xX]\][ \t]+/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,numericCharacterReferenceOrAmpersand:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:Me(t=>new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:Me(t=>new RegExp(`^ {0,${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:Me(t=>new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)),headingBeginRegex:Me(t=>new RegExp(`^ {0,${t}}#{1,6}(?:\\s|$)`)),pedanticHeadingBeginRegex:Me(t=>new RegExp(`^ {0,${t}}#`)),htmlBeginRegex:Me(t=>new RegExp(`^ {0,${t}}(?:</?(?:${zn})(?:[ \\t]+|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`,"i")),blockquoteBeginRegex:Me(t=>new RegExp(`^ {0,${t}}>`)),nestedContainerMarkers:/^(?: {0,3}(?:(?:[*+-]|\d{1,9}[.)])[ \t]+|>[ \t]?))+/},hs=/^(?:[ \t]*(?:\n|$))+/,fs=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ms=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}(?:(?=`)\1`*|(?=~)\1~*) *(?=\n|$)|$)/,ot=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,gs=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Nn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,zn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",at=_(" {0,3}(?:</?(?:tag)(?:[ \\t]+|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",zn).getRegex(),yi=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+)[ \t]*(?:\n+|$)/,xi=_(yi).replace(/bull/g,Nn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/\|table/g,"").replace(/html/g,at).getRegex(),bs=_(yi).replace(/bull/g,Nn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).replace(/html/g,at).getRegex(),$n=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,vs=/^[^\n]+/,Fn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\\n]|\n(?![ \t]*\n))+/,ws=_(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<(?:\\.|[^\n<>\\])*>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Fn).replace("title",/(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\\n]|\n(?!\n))*'|\((?:\\[\s\S]|[^()\\])*\))/).getRegex(),ys=_(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,Nn).getRegex(),Un=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,xs=_("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?:[ \\t]+|\\n|/?>|$)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*?[ \\t]*/?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Un).replace("tag",zn).replace("attribute",/[ \t]+[a-zA-Z:_][\w.:-]*(?:[ \t]*=[ \t]*"[^"\n]*"|[ \t]*=[ \t]*'[^'\n]*'|[ \t]*=[ \t]*[^\s"'=<>`]+)?/).getRegex(),ki=t=>_($n).replace("hr",ot).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",t).replace("html",at).getRegex(),ks=ki(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),Es=ki(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),Ts=_(/^( {0,3}> ?(?:(?![ \t]*(?:\n|$))(paragraph)|[^\n]*)(?:\n|$))+/).replace("paragraph",Es).getRegex(),Hn={blockquote:Ts,code:fs,def:ws,fences:ms,heading:gs,hr:ot,html:xs,lheading:xi,list:ys,newline:hs,paragraph:ks,table:De,text:vs},li=_("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",ot).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html",at).getRegex(),As={...Hn,lheading:bs,table:li,paragraph:_($n).replace("hr",ot).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",li).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html",at).getRegex()},Ss={...Hn,html:_(`^ *(?:comment(?: *\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1>(?: *\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?>(?: *\\n{2,}|\\s*$))`).replace("comment",Un).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:De,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:_($n).replace("hr",ot).replace("heading",` *#{1,6} *[^
]`).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").replace("lheading",xi).getRegex()},_s=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ls=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ei=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,Cs=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,le=/[\p{P}\p{S}]/u,je=/[\s\p{P}\p{S}]/u,st=/[^\s\p{P}\p{S}]/u,Rs=_(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,je).getRegex(),Os=/[\p{Pi}\p{Ps}"']/u,Ti=/(?!~)[\p{P}\p{S}]/u,Ms=/(?!~)[\s\p{P}\p{S}]/u,Ds=/(?:[^\s\p{P}\p{S}]|~)/u,Ps=_(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",wi?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Ai=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Is=_(Ai,"u").replace(/punct/g,le).getRegex(),Ns=_(Ai,"u").replace(/punct/g,Ti).getRegex(),zs=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,$s=_(zs,"u").replace(/openQuote/g,Os).replace(/punct/g,le).getRegex(),Si="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Fs=_(Si,"gu").replace(/notPunctSpace/g,st).replace(/punctSpace/g,je).replace(/punct/g,le).getRegex(),Us=_(Si,"gu").replace(/notPunctSpace/g,Ds).replace(/punctSpace/g,Ms).replace(/punct/g,Ti).getRegex(),Hs="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",Gs=_(Hs,"gu").replace(/notPunctSpace/g,st).replace(/punctSpace/g,je).replace(/punct/g,le).getRegex(),Bs=_("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,st).replace(/punctSpace/g,je).replace(/punct/g,le).getRegex(),Ws="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",js=_(Ws,"gu").replace(/notPunctSpace/g,st).replace(/punctSpace/g,je).replace(/punct/g,le).getRegex(),qs=_(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,le).getRegex(),Vs="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Ks=_(Vs,"gu").replace(/notPunctSpace/g,st).replace(/punctSpace/g,je).replace(/punct/g,le).getRegex(),Zs=_(/\\(punct)/,"gu").replace(/punct/g,le).getRegex(),Ys=_(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/,"gu").replace(/punct/g,le).getRegex(),Xs=_(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Js=_(Un).replace("(?:-->|$)","-->").getRegex(),Qs=_("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Js).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),_i=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,Ft=_(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",_i).getRegex(),el=_(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",Ft).replace("href",/<(?:\\.|[^\n<>\\])*>|(?!<)[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\((?:\\[\s\S]|[^)\\])*\)/).getRegex(),tl=_(/^!?\[(label)\]\[(ref)\]/).replace("label",Ft).replace("ref",Fn).getRegex(),nl=_(/^!?\[(ref)\](?:\[\])?/).replace("ref",Fn).getRegex(),ci=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,rl=_(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",_i).getRegex(),il=_("reflink|nolink(?!\\()","g").replace("reflink",_(/^!?\[(label)\]\[(ref)\]/).replace("label",rl).replace("ref",ci).getRegex()).replace("nolink",_(/^!?\[(ref)\](?:\[\])?/).replace("ref",ci).getRegex()).getRegex(),di=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,ol=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,al=_(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,ol).getRegex(),Gn={_backpedal:De,anyPunctuation:Zs,anyPunctuationOutsideCode:Ys,autolink:Xs,blockSkip:Ps,br:Ei,code:Ls,del:De,delLDelim:De,delRDelim:De,emStrongLDelim:Is,emStrongRDelimAst:Fs,emStrongRDelimUnd:Bs,escape:_s,link:el,nolink:nl,punctuation:Rs,reflink:tl,reflinkSearch:il,tag:Qs,text:Cs,url:De},sl={...Gn,emStrongLDelim:$s,emStrongRDelimAst:Gs,emStrongRDelimUnd:js,link:_(/^!?\[(label)\]\((.*?)\)/).replace("label",Ft).getRegex(),reflink:_(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ft).getRegex()},Mn={...Gn,emStrongRDelimAst:Us,emStrongLDelim:Ns,delLDelim:qs,delRDelim:Ks,url:_(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",al).replace("protocol",di).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:_(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|wwwStart|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",di).replace(/emailProtocol/g,/(?:mailto|xmpp):/).replace("wwwStart",wi?"(?<![^\\s*_~(])www\\.":"www\\.").getRegex()},ll={...Mn,br:_(Ei).replace("{2,}","*").getRegex(),text:_(Mn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},zt={normal:Hn,gfm:As,pedantic:Ss},rt={normal:Gn,gfm:Mn,breaks:ll,pedantic:sl},cl={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ui=t=>cl[t];function Y(t,e){if(e){if(V.escapeTest.test(t))return t.replace(V.escapeReplace,ui)}else if(V.escapeTestNoEncode.test(t))return t.replace(V.escapeReplaceNoEncode,ui);return t}function dl(t){return V.numericCharacterReference.test(t)?t.replace(V.numericCharacterReferenceOrAmpersand,(e,n,r)=>{if(n===void 0&&r===void 0)return"&amp;";let i=n===void 0?Number.parseInt(r,16):Number.parseInt(n,10);return i===0||i>1114111||i>=55296&&i<=57343?"\uFFFD":i===38?"&amp;":String.fromCodePoint(i)}):t}function pi(t){try{t=encodeURI(t).replace(V.percentDecode,"%")}catch{return null}return t}function hi(t,e){let n=t.replace(V.findPipe,(o,s,l)=>{let c=!1,m=s;for(;--m>=0&&l[m]==="\\";)c=!c;return c?"|":" |"}),r=n.split(V.splitPipe),i=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;i<r.length;i++)r[i]=r[i].trim().replace(V.slashPipe,"|");return r}function me(t,e,n){let r=t.length;if(r===0)return"";let i=0;for(;i<r;){let o=t.charAt(r-i-1);if(o===e&&!n)i++;else if(o!==e&&n)i++;else break}return t.slice(0,r-i)}function fi(t){let e=t.split(`
`),n=e.length-1;for(;n>=0&&V.blankLine.test(e[n]);)n--;return e.length-n<=2?t:e.slice(0,n+1).join(`
`)}function Ut(t){return t.trim().replace(V.multipleSpaceGlobal," ").toLowerCase().toUpperCase().toLowerCase()}function mi(t,e){if(t.indexOf(e[0])===-1&&t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}var We=new WeakMap;function Bn(t){let e={"*":-1,_:-1},n=-1,r=t.length;for(let i=0;i<r;i++){let o=t[i];if(o!=="*"&&o!=="_"&&o!=="~")continue;let s=i===0?`
`:t[i-1],l=i+1;for(;l<r&&t[l]===o;)l++;s!==" "&&s!=="	"&&s!==`
`&&s!=="\r"&&s!=="\f"&&(o==="~"?n=i:e[o]=i),i=l-1}return{maskedSrc:t,lastPossibleEmStrongCloserIndex:e,lastPossibleDelCloserIndex:n}}function ul(t,e){let n=Bn(e),r=We.get(t);r?r.push(n):We.set(t,[n])}function pl(t){let e=We.get(t);e&&(e.pop(),e.length===0&&We.delete(t))}function Li(t,e,n){let r=We.get(t)?.at(-1);return r&&r.maskedSrc===e?r.lastPossibleEmStrongCloserIndex[n]:Bn(e).lastPossibleEmStrongCloserIndex[n]}function Ci(t,e){let n=We.get(t)?.at(-1);return n&&n.maskedSrc===e?n.lastPossibleDelCloserIndex:Bn(e).lastPossibleDelCloserIndex}function $t(t,e=0){let n=e,r="";for(let i of t)if(i==="	"){let o=4-n%4;r+=" ".repeat(o),n+=o}else r+=i,n++;return r}function hl(t,e){let n="";for(let r=0;r<t.length;r++){if(t[r]==="`"){let i=e.inline.code.exec(t.slice(r));if(i){n+=i[0],r+=i[0].length-1;continue}}if(t[r]==="\\"&&(t[r+1]==="["||t[r+1]==="]")){n+=t[r+1],r++;continue}n+=t[r]}return n}function gi(t,e,n,r,i){let o=e.href,s=e.title||null,l=hl(t[1],i),c=t[0].charAt(0)==="!",m=r.state.inLink,u=r.state.linkEmitted,v=r.state.inRawBlock;r.state.inLink=!0,r.state.linkEmitted=!1;let g=r.inlineTokens(l),y=r.state.linkEmitted;if(r.state.linkEmitted=u,r.state.inLink=m,!c){if(y){r.state.inRawBlock=v;return}r.state.linkEmitted=!0}return{type:c?"image":"link",raw:n,href:o,title:s,text:l,tokens:g}}function fl(t,e,n){let r=t.match(n.other.indentCodeCompensation);if(r===null)return e;let i=r[1];return e.split(`
`).map(o=>{let s=o.match(n.other.beginningSpace);if(s===null)return o;let[l]=s;return o.slice(Math.min(l.length,i.length))}).join(`
`)}function bi(t,e,n,r){if(!e.includes("<"))return!1;for(let i=0;i<e.length;i++){if(e[i]==="\\"){i++;continue}if(e[i]==="`"){let l=r.inline.code.exec(e.slice(i));if(l){i+=l[0].length-1;continue}}if(e[i]!=="<")continue;let o=t.slice(n+i),s=r.inline.tag.exec(o)||r.inline.autolink.exec(o);if(s){if(s[0].length>e.length-i)return!0;i+=s[0].length-1}}return!1}var Pe=class{options;rules;lexer;constructor(t){this.options=t||Ne}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=this.options.pedantic?e[0]:fi(e[0]),r=n.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n,codeBlockStyle:"indented",text:r}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],r=fl(n,e[3]||"",this.rules);return e[3]!==void 0&&(r===""||r.endsWith(`
`))&&(r+=`
`),{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let r=me(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceTabChar.test(r))&&(n=r.trim())}return{type:"heading",raw:me(e[0],`
`),depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:me(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=me(e[0],`
`).split(`
`),r="",i="",o=[];for(;n.length>0;){let s=!1,l=[],c;for(c=0;c<n.length;c++)if(this.rules.other.blockquoteStart.test(n[c]))l.push(n[c]),s=!0;else if(!s)l.push(n[c]);else break;n=n.slice(c);let m=l.join(`
`),u=m.replace(this.rules.other.blockquoteMarkerWhitespace,(y,T,E)=>E.startsWith(" ")?T+" "+E.slice(1):T+$t(E,T.length)).replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${m}`:m,i=i?`${i}
${u}`:u;let v=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,o,!0),this.lexer.state.top=v,n.length===0)break;let g=o.at(-1);if(g?.type==="code"||g?.type==="heading"||g?.type==="hr"||g?.type==="html"||g?.type==="table")break;if(g?.type==="blockquote"){let y=g,T=n.join(`
`),E=y.raw+`
`+T.replace(this.rules.other.blockquoteSetextReplace2,""),A=this.blockquote(E);o[o.length-1]=A;let S=E.substring(A.raw.length).replace(/^\n/,""),B=S?S.split(`
`).length:0,R=B?n.slice(0,-B):n;if(R.length>0&&(r=`${r}
${R.join(`
`)}`),i=i.substring(0,i.length-y.text.length)+A.text,n=n.slice(R.length),n.length>0&&this.rules.other.blockquoteStart.test(n[0]))continue;break}else if(g?.type==="list"){let y=g,T=y.raw+`
`+n.join(`
`),E=this.list(T);o[o.length-1]=E;let A=E.raw.length>y.raw.length?T.slice(y.raw.length+1,E.raw.length).split(`
`).length:0;if(A>0){let S=n.slice(0,A).join(`
`);r=`${r}
${S}`,i=`${i}
${S}`}if(n=n.slice(A),n.length>0&&!this.rules.other.blockquoteStart.test(n[0]))break;continue}}return{type:"blockquote",raw:r,tokens:o,text:i}}}list(t){let e=this.rules.block.list.exec(t);if(e){if(!this.options.pedantic&&this.lexer.state.lastToken?.type==="text"&&!this.rules.other.listInterruptsParagraph.test(t))return;let n=t,r=()=>n.length-t.length,i=e[1].trim(),o=i.length>1,s={type:"list",raw:"",ordered:o,start:o?+i.slice(0,-1):"",loose:!1,items:[]};i=o?`\\d{1,9}\\${i.slice(-1)}`:`\\${i}`,this.options.pedantic&&(i=o?i:"[*+-]");let l=this.rules.other.listItemRegex(i),c=!1;for(;t;){let v=!1,g="";if(!(e=l.exec(t))||this.rules.block.hr.test(t))break;let y=r();t=t.substring(e[0].length);let T=e[2].split(`
`,1)[0],E=e[1].length,A=this.options.pedantic?$t(T,E):T.replace(this.rules.other.leadingSpaceTab,J=>$t(J,E)),S=t.split(`
`,1)[0],B=!A.trim(),R=0;if(this.options.pedantic?(R=2,g=A.trimStart()):B?R=E+1:(R=A.search(this.rules.other.nonSpaceChar),R=R>4?1:R,g=A.slice(R),R+=E),B&&this.rules.other.blankLine.test(S)&&(t=t.substring(S.length+1),v=!0),!v){let J=this.rules.other.nextBulletRegex(R),Q=this.rules.other.hrRegex(R),Te=this.rules.other.fencesBeginRegex(R),$=this.options.pedantic?this.rules.other.pedanticHeadingBeginRegex(R):this.rules.other.headingBeginRegex(R),Z=this.rules.other.htmlBeginRegex(R),Ae=this.rules.other.blockquoteBeginRegex(R),Se=!1;for(;t;){let vt=t.split(`
`,1)[0],W;if(S=vt,this.options.pedantic?(S=S.replace(this.rules.other.listReplaceNesting,"  "),W=S):W=S.replace(this.rules.other.leadingSpaceTab,j=>$t(j)),Te.test(S)||$.test(S)||Z.test(S)||Ae.test(S)||J.test(S)||Q.test(S))break;if(W.search(this.rules.other.nonSpaceChar)>=R||!S.trim())g+=`
`+W.slice(R),Se=!1;else{if(B)break;let j=A;if(!this.options.pedantic&&!g.includes(`
`)&&!A.includes("	")){let ue;for(;!Q.test(j)&&(ue=this.rules.other.nestedBlockMarker.exec(j));)j=j.slice(ue[0].length);if(!j.trim())break}if(j.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||Te.test(j)||$.test(j)||Z.test(j)||Q.test(j))break;if(!this.options.pedantic&&!Se){let ue=A.replace(this.rules.other.nestedContainerMarkers,"");if(this.rules.block.fences.test(ue)||this.rules.block.heading.test(ue)||this.rules.block.hr.test(ue))break}let Ve=!this.options.pedantic&&/^ {0,3}(?:=+|-+) *$/.test(S)&&this.rules.block.lheading.test(`${A}
${S}`)?`    ${W.replace(/^ {0,3}/,"")}`:S;g+=`
`+Ve,Se=!0}B=!S.trim(),t=t.substring(vt.length+1),A=W.slice(R)}}let de=n.slice(y,r());s.loose||(c?s.loose=!0:this.rules.other.doubleBlankLine.test(de)&&(c=!0)),s.items.push({type:"list_item",raw:de,task:!!this.options.gfm&&this.rules.other.listIsTask.test(g),loose:!1,text:g,tokens:[]})}let m=s.items.at(-1);if(m)m.raw=m.raw.trimEnd(),m.text=m.text.trimEnd();else return;s.raw=n.slice(0,r()).trimEnd();let u=[];for(let v of s.items)if(this.lexer.state.top=!1,u.push(this.lexer.inlineQueue.length),v.tokens=this.lexer.blockTokens(v.text,[]),!s.loose){let g=v.tokens.filter(T=>T.type==="space"),y=g.length>0&&g.some(T=>this.rules.other.anyLine.test(T.raw));s.loose=y}for(let v=0;v<s.items.length;v++){let g=s.items[v],y=g.tokens[0];if(g.task&&(y?.type==="text"||y?.type==="paragraph")){g.text=g.text.replace(this.rules.other.listReplaceTask,""),y.raw=y.raw.replace(this.rules.other.listReplaceTask,""),y.text=y.text.replace(this.rules.other.listReplaceTask,"");let T=this.lexer.inlineQueue;for(let A=u[v];A<T.length;A++)if(T[A].tokens===y.tokens){T[A].src=T[A].src.replace(this.rules.other.listReplaceTask,"");break}let E=this.rules.other.listTaskCheckbox.exec(g.raw);if(E){let A={type:"checkbox",raw:E[0]+" ",checked:E[0]!=="[ ]"};g.checked=A.checked,s.loose?g.tokens[0]&&["paragraph","text"].includes(g.tokens[0].type)&&"tokens"in g.tokens[0]&&g.tokens[0].tokens?(g.tokens[0].raw=A.raw+g.tokens[0].raw,g.tokens[0].text=A.raw+g.tokens[0].text,g.tokens[0].tokens.unshift(A)):g.tokens.unshift({type:"paragraph",raw:A.raw,text:A.raw,tokens:[A]}):g.tokens.unshift(A)}}else g.task&&(g.task=!1)}if(s.loose)for(let v of s.items){v.loose=!0;for(let g of v.tokens)g.type==="text"&&(g.type="paragraph")}return s}}html(t){let e=this.rules.block.html.exec(t);if(e){if(this.lexer.state.lastToken?.type==="paragraph"&&!this.rules.other.htmlBeginRegex(4).test(t))return;let n=fi(e[0]);return{type:"html",block:!0,raw:n,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:n}}}def(t){let e=this.rules.block.def.exec(t);if(e){if(!this.rules.other.startAngleBracket.test(e[2])&&mi(e[2],"()")!==-1)return;let n=Ut(e[1]),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:me(e[0],`
`),href:r,title:i}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=hi(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:me(e[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let s of r)this.rules.other.tableAlignRight.test(s)?o.align.push("right"):this.rules.other.tableAlignCenter.test(s)?o.align.push("center"):this.rules.other.tableAlignLeft.test(s)?o.align.push("left"):o.align.push(null);for(let s=0;s<n.length;s++)o.header.push({text:n[s],tokens:this.lexer.inline(n[s]),header:!0,align:o.align[s]});for(let s of i)o.rows.push(hi(s,o.header.length).map((l,c)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:o.align[c]})));return o}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let n=e[1].trim();return{type:"heading",raw:me(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){if(t.charCodeAt(0)!==92)return;let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){if(this.lexer.state.linkParenPossible===!1)return;let e=t.charCodeAt(0);if(e!==91&&e!==33)return;let n=this.rules.inline.link.exec(t);if(n){let r=n[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&bi(t,n[1],r,this.rules))return;let i=n[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(i)){if(!this.rules.other.endAngleBracket.test(i))return;let c=me(i.slice(0,-1),"\\");if((i.length-c.length)%2===0)return}else{let c=mi(n[2],"()");if(c===-2)return;if(c>-1){let m=(n[0].indexOf("!")===0?5:4)+n[1].length+c;n[2]=n[2].substring(0,c),n[0]=n[0].substring(0,m).trim(),n[3]=""}}let o=me(n[0].slice(0,-1),"\\");if((n[0].length-o.length)%2===0)return;let s=n[2],l="";if(this.options.pedantic){let c=this.rules.other.pedanticHrefTitle.exec(s);c&&(s=c[1],l=c[3])}else l=n[3]?n[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(i)?s=s.slice(1):s=s.slice(1,-1)),gi(n,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:l&&l.replace(this.rules.inline.anyPunctuation,"$1")},n[0],this.lexer,this.rules)}}reflink(t,e){let n=t.charCodeAt(0);if(n!==91&&n!==33)return;let r;if((r=this.rules.inline.reflink.exec(t))||(r=this.rules.inline.nolink.exec(t))){let i=r[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&bi(t,r[1],i,this.rules))return;let o=e[Ut(r[2]||r[1])];if(!o){let s=r[0].charAt(0);return{type:"text",raw:s,text:s}}return gi(r,o,r[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!r||!r[1]&&!r[2]&&!r[3]&&!r[4])return;let i=r[0][0],o=n===i,s=e.length-t.length,l=s;for(;!this.options.pedantic&&l>0&&e[l-1]===i;)l--;let c=[...e.slice(Math.max(0,l-2),l)].at(-1)??"",m=c==="*"||c==="_"||!!this.rules.inline.punctuation.exec(c);l<s&&(n=c);let u=l<s?m:n==="*"||n==="_"||!!this.rules.inline.punctuation.exec(n);if(r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))return;let v=r[1]||r[3]||"";if(!v||!n||u){let g=[...r[0]].length-1,y,T,E=g,A=0,S=s-l+g,B=!this.options.pedantic&&!!c.trim()&&(!!v||i==="*"&&!m);if(i!=="*"&&i!=="_")return;let R=i==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd,de=Li(this,e,i),J=e.length-t.length+g;if(de<J)return;e=e.slice(-1*t.length+g);let Q=de-J;for(R.lastIndex=0;(r=R.exec(e))!==null&&!(r.index>Q);){if(y=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!y)continue;if(T=[...y].length,r[3]||r[4]){E+=T;continue}else if((r[5]||r[6]||B)&&S%3&&!((S+T)%3)){if(o&&(r[5]||r[6]))break;A+=T;continue}if(E-=T,E>0)continue;T=Math.min(T,T+E+A);let Te=[...r[0]][0].length,$=t.slice(0,g+r.index+Te+T);if(Math.min(g,T)%2){let Ae=$.slice(1,-1);return{type:"em",raw:$,text:Ae,tokens:this.lexer.inlineTokens(Ae)}}let Z=$.slice(2,-2);return{type:"strong",raw:$,text:Z,tokens:this.lexer.inlineTokens(Z)}}}}codespan(t){if(t.charCodeAt(0)!==96)return;let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=t.charCodeAt(0);if(e!==32&&e!==92&&e!==10)return;let n=this.rules.inline.br.exec(t);if(n)return{type:"br",raw:n[0]}}del(t,e,n=""){if(t.charCodeAt(0)!==126)return;let r=this.rules.inline.delLDelim.exec(t);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,o,s,l=i,c=this.rules.inline.delRDelim,m=Ci(this,e),u=e.length-t.length+i;if(m<u)return;e=e.slice(-1*t.length+i);let v=m-u;for(c.lastIndex=0;(r=c.exec(e))!==null&&!(r.index>v);){if(o=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!o||(s=[...o].length,s!==i))continue;if(r[3]||r[4]){l+=s;continue}if(l-=s,l>0)continue;s=Math.min(s,s+l);let g=[...r[0]][0].length,y=t.slice(0,i+r.index+g+s),T=y.slice(i,-i);return{type:"del",raw:y,text:T,tokens:this.lexer.inlineTokens(T)}}}}autolink(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let i;do i=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(i!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:n?e[0]:dl(e[0]),escaped:n}}}},ee=class Dn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ne,this.options.tokenizer=this.options.tokenizer||new Pe,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0};let n={other:V,block:zt.normal,inline:rt.normal};this.options.pedantic?(n.block=zt.pedantic,n.inline=rt.pedantic):this.options.gfm&&(n.block=zt.gfm,this.options.breaks?n.inline=rt.breaks:n.inline=rt.gfm),this.tokenizer.rules=n}static get rules(){return{block:zt,inline:rt}}static lex(e,n){return new Dn(n).lex(e)}static lexInline(e,n){return new Dn(n).inlineTokens(e)}lex(e){e=e.replace(V.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.state.inRawBlock=!1,this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){this.tokenizer.lexer=this;let i=this.state.lastToken;this.options.pedantic&&(e=e.replace(V.tabCharGlobal,"    ").replace(V.spaceLine,""));let o=1/0,s,l=this.options.gfm&&!this.options.pedantic&&this.tokenizer.paragraph===Pe.prototype.paragraph;for(;e;){if(e.length<o)o=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}this.state.lastToken=n.at(-1);let c;if(this.options.extensions?.block?.some(u=>(c=u.call({lexer:this},e,n))?(e=e.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.space(e)){e=e.substring(c.raw.length);let u=n.at(-1);c.raw.length===1&&u!==void 0?u.raw+=`
`:n.push(c);continue}if(c=this.tokenizer.code(e)){e=e.substring(c.raw.length);let u=n.at(-1);u?.type==="paragraph"||u?.type==="text"?(u.raw+=(u.raw.endsWith(`
`)?"":`
`)+c.raw,u.text+=`
`+c.text,this.inlineQueue.at(-1).src=u.text):n.push(c);continue}if(c=this.tokenizer.fences(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.heading(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.hr(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.blockquote(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.list(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.html(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.def(e)){e=e.substring(c.raw.length);let u=n.at(-1);u?.type==="paragraph"||u?.type==="text"?(u.raw+=(u.raw.endsWith(`
`)?"":`
`)+c.raw,u.text+=`
`+c.raw,this.inlineQueue.at(-1).src=u.text):(this.tokens.links[c.tag]||(this.tokens.links[c.tag]={href:c.href,title:c.title}),n.push(c));continue}if(c=this.tokenizer.table(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.lheading(e)){e=e.substring(c.raw.length),n.push(c);continue}let m=e;if(this.options.extensions?.startBlock){let u=1/0,v=e.slice(1),g;this.options.extensions.startBlock.forEach(y=>{g=y.call({lexer:this},v),typeof g=="number"&&g>=0&&(u=Math.min(u,g))}),u<1/0&&u>=0&&(m=e.substring(0,u+1))}if(this.state.top&&(c=this.tokenizer.paragraph(m))){let u=n.at(-1);(r||u===s&&l)&&u?.type==="paragraph"?(u.raw+=(u.raw.endsWith(`
`)?"":`
`)+c.raw,u.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=u.text,s=u):(n.push(c),s=c),r=m.length!==e.length,e=e.substring(c.raw.length);continue}if(c=this.tokenizer.text(e)){e=e.substring(c.raw.length);let u=n.at(-1);u?.type==="text"?(u.raw+=(u.raw.endsWith(`
`)?"":`
`)+c.raw,u.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=u.text):n.push(c);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,this.state.lastToken=i,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}linkInText(e){if(!e.includes("["))return!1;let n=this.tokenizer.rules.inline.link;for(let r of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(n.test(r[0])&&e.charAt(r.index-1)!=="!")return!0;for(let r of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let i=r[0],o=i.lastIndexOf("[");if(!(i.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,Ut(i.slice(o+1,-1))))&&!(o>1&&this.linkInText(i.slice(1,o-1))))return!0}return!1}inlineTokens(e,n=[]){this.tokenizer.lexer=this;let r=this.state.linkParenPossible;this.state.linkParenPossible=e.includes(")");try{return this.#n(e,n)}finally{this.state.linkParenPossible=r}}#n(e,n){let r=e.includes("*")||e.includes("_")||e.includes("~"),i=r||this.options.hooks?.emStrongMask||this.tokenizer.emStrong!==Pe.prototype.emStrong||this.tokenizer.del!==Pe.prototype.del?this.#t(e):e;if(!r)return this.#e(e,i,n);ul(this.tokenizer,i);try{return this.#e(e,i,n)}finally{pl(this.tokenizer)}}#e(e,n,r){let i=!1,o="",s=1/0;for(;e;){if(e.length<s)s=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}i||(o=""),i=!1;let l;if(this.options.extensions?.inline?.some(u=>(l=u.call({lexer:this},e,r))?(e=e.substring(l.raw.length),r.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let u=r.at(-1);l.type==="text"&&u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):r.push(l);continue}let c=e[0];if(c==="*"||c==="_"){let u=n.length-e.length;if(Li(this.tokenizer,n,c)<=u){let v=1;for(;v<e.length&&e.charCodeAt(v)===c.charCodeAt(0);)v++;let g=e.substring(0,v),y=r.at(-1);y?.type==="text"&&!y.escaped?(y.raw+=g,y.text+=g):r.push({type:"text",raw:g,text:g,escaped:!1}),e=e.substring(v),o=c,i=!0;continue}}else if(c==="~"){let u=n.length-e.length;if(Ci(this.tokenizer,n)<=u){let v=1;for(;v<e.length&&e.charCodeAt(v)===126;)v++;let g=e.substring(0,v),y=r.at(-1);y?.type==="text"&&!y.escaped?(y.raw+=g,y.text+=g):r.push({type:"text",raw:g,text:g,escaped:!1}),e=e.substring(v),o=c,i=!0;continue}}if(l=this.tokenizer.emStrong(e,n,o)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.del(e,n,o)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),r.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),r.push(l);continue}let m=e;if(this.options.extensions?.startInline){let u=1/0,v=e.slice(1),g;this.options.extensions.startInline.forEach(y=>{g=y.call({lexer:this},v),typeof g=="number"&&g>=0&&(u=Math.min(u,g))}),u<1/0&&u>=0&&(m=e.substring(0,u+1))}if(l=this.tokenizer.inlineText(m)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(o=l.raw.slice(-1)),i=!0;let u=r.at(-1);u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):r.push(l);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return r}#s(e){let{blockSkip:n,tag:r,autolink:i}=this.tokenizer.rules.inline,o="",s=0,l;for(n.lastIndex=0;l=n.exec(e);){let c=l.index+(l[2]?l[2].length:0),m=l.index+l[0].length;if(e.charAt(c)==="<"){let u=e.slice(c),v=r.exec(u)||i.exec(u);if(!v){n.lastIndex=c+1;continue}m=c+v[0].length,n.lastIndex=m}o+=e.slice(s,c)+"["+"a".repeat(m-c-2)+"]",s=m}return o+e.slice(s)}#t(e){let n=e;if(this.tokens.links&&e.includes("[")){let r=this.tokenizer.rules.inline.reflinkSearch,i=o=>{let s=o.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,Ut(o.slice(s+1,-1))))return o;if(s>1&&o.charAt(0)!=="!"){let l=o.slice(1,s-1);if(this.linkInText(l))return"["+l.replace(r,i)+"]["+"a".repeat(o.length-s-2)+"]"}return"["+"a".repeat(o.length-2)+"]"};n=n.replace(r,i)}return n=n.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode,(r,i,o)=>o?"+".repeat(r.length):i?i+r.slice(i.length,-i.length).replace(/`/g,"+")+i:r),n=this.#s(n),n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n,n}infiniteLoopError(e){let n="Infinite loop on byte: "+e;if(this.options.silent)console.error(n);else throw new Error(n)}},Ht=class{options;parser;constructor(t){this.options=t||Ne}space(t){return""}code({text:t,lang:e,escaped:n}){let r=(e||"").match(V.notSpaceStart)?.[0],i=t?t.replace(V.endingNewline,"")+`
`:"";return r?'<pre><code class="language-'+Y(r)+'">'+(n?i:Y(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:Y(i,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,n=t.start,r="";for(let s=0;s<t.items.length;s++){let l=t.items[s];r+=this.listitem(l)}let i=e?"ol":"ul",o=e&&n!==1?' start="'+n+'"':"";return"<"+i+o+`>
`+r+"</"+i+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let i=0;i<t.header.length;i++)n+=this.tablecell(t.header[i]);e+=this.tablerow({text:n});let r="";for(let i=0;i<t.rows.length;i++){let o=t.rows[i];n="";for(let s=0;s<o.length;s++)n+=this.tablecell(o[s]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Y(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,text:n,tokens:r,autolink:i}){let o=i?Y(n,!0):this.parser.parseInline(r),s=pi(t);if(s===null)return o;t=Y(s,i);let l='<a href="'+t+'"';return e&&(l+=' title="'+Y(e)+'"'),l+=">"+o+"</a>",l}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=pi(t);if(i===null)return Y(n);t=i;let o=`<img src="${Y(t)}" alt="${Y(n)}"`;return e&&(o+=` title="${Y(e)}"`),o+=">",o}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Y(t.text)}},Wn=class{parser;strong({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}em({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}codespan({text:t}){return t}del({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}html({text:t}){return t}text({text:t}){return t}link({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}image({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}br(){return`
`}checkbox({raw:t}){return t}},te=class Pn{options;renderer;textRenderer;constructor(e){this.options=e||Ne,this.options.renderer=this.options.renderer||new Ht,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Wn,this.textRenderer.parser=this}static parse(e,n){return new Pn(n).parse(e)}static parseInline(e,n){return new Pn(n).parseInline(e)}parse(e){this.renderer.parser=this;let n="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let s=i,l=this.options.extensions.renderers[s.type].call({parser:this},s);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(s.type)){n+=l===!1?"":l??"";continue}}let o=i;switch(o.type){case"space":{n+=this.renderer.space(o);break}case"hr":{n+=this.renderer.hr(o);break}case"heading":{n+=this.renderer.heading(o);break}case"code":{n+=this.renderer.code(o);break}case"table":{n+=this.renderer.table(o);break}case"blockquote":{n+=this.renderer.blockquote(o);break}case"list":{n+=this.renderer.list(o);break}case"checkbox":{n+=this.renderer.checkbox(o);break}case"html":{n+=this.renderer.html(o);break}case"def":{n+=this.renderer.def(o);break}case"paragraph":{n+=this.renderer.paragraph(o);break}case"text":{n+=this.renderer.text(o);break}default:{let s='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return n}parseInline(e,n=this.renderer){this.renderer.parser=this;let r="";for(let i=0;i<e.length;i++){let o=e[i];if(this.options.extensions?.renderers?.[o.type]){let l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(o.type)){r+=l===!1?"":l??"";continue}}let s=o;switch(s.type){case"escape":{r+=n.text(s);break}case"html":{r+=n.html(s);break}case"link":{r+=n.link(s);break}case"image":{r+=n.image(s);break}case"checkbox":{r+=n.checkbox(s);break}case"strong":{r+=n.strong(s);break}case"em":{r+=n.em(s);break}case"codespan":{r+=n.codespan(s);break}case"br":{r+=n.br(s);break}case"del":{r+=n.del(s);break}case"text":{r+=n.text(s);break}default:{let l='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return r}},it=class{options;block;constructor(t){this.options=t||Ne}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?ee.lex:ee.lexInline}provideParser(t=this.block){return t?te.parse:te.parseInline}};function ye(t,e){if(Array.isArray(e))for(let n=0;n<e.length;n++)t.push(e[n]);else t.push(e)}var ml=class{defaults=In();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=te;Renderer=Ht;TextRenderer=Wn;Lexer=ee;Tokenizer=Pe;Hooks=it;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(let r of t)switch(ye(n,e.call(this,r)),r.type){case"table":{let i=r;for(let o of i.header)ye(n,this.walkTokens(o.tokens,e));for(let o of i.rows)for(let s of o)ye(n,this.walkTokens(s.tokens,e));break}case"list":{let i=r;ye(n,this.walkTokens(i.items,e));break}default:{let i=r;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(o=>{let s=i[o].flat(1/0);ye(n,this.walkTokens(s,e))}):i.tokens&&ye(n,this.walkTokens(i.tokens,e))}}return n}use(...t){let e=this.defaults.extensions||{renderers:Object.create(null),childTokens:Object.create(null)};return t.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let o=e.renderers[i.name];o?e.renderers[i.name]=function(...s){let l=i.renderer.apply(this,s);return l===!1&&(l=o.apply(this,s)),l}:e.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=e[i.level];o?o.unshift(i.tokenizer):e[i.level]=[i.tokenizer],i.start&&(i.level==="block"?e.startBlock?e.startBlock.push(i.start):e.startBlock=[i.start]:i.level==="inline"&&(e.startInline?e.startInline.push(i.start):e.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(e.childTokens[i.name]=i.childTokens)}),r.extensions=e),n.renderer){let i=this.defaults.renderer||new Ht(this.defaults);for(let o in n.renderer){if(!(o in i))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let s=o,l=n.renderer[s],c=i[s];i[s]=(...m)=>{let u=l.apply(i,m);return u===!1&&(u=c.apply(i,m)),u===!1?"":u??""}}r.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new Pe(this.defaults);for(let o in n.tokenizer){if(!(o in i))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let s=o,l=n.tokenizer[s],c=i[s];i[s]=(...m)=>{let u=l.apply(i,m);return u===!1&&(u=c.apply(i,m)),u}}r.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new it;for(let o in n.hooks){if(!(o in i))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let s=o,l=n.hooks[s],c=i[s];it.passThroughHooks.has(o)?i[s]=m=>{if(i.options.async&&it.passThroughHooksRespectAsync.has(o))return(async()=>{let v=await l.call(i,m);return c.call(i,v)})();let u=l.call(i,m);return c.call(i,u)}:i[s]=(...m)=>{if(i.options.async)return(async()=>{let v=await l.apply(i,m);return v===!1&&(v=await c.apply(i,m)),v})();let u=l.apply(i,m);return u===!1&&(u=c.apply(i,m)),u}}r.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,o=n.walkTokens;r.walkTokens=function(s){let l=[];return ye(l,o.call(this,s)),i&&ye(l,i.call(this,s)),l}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return ee.lex(t,e??this.defaults)}parser(t,e){return te.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let r={...n},i={...this.defaults,...r},o=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=t),i.async)return(async()=>{let s=i.hooks?await i.hooks.preprocess(e):e,l=await(i.hooks?await i.hooks.provideLexer(t):t?ee.lex:ee.lexInline)(s,i),c=i.hooks?await i.hooks.processAllTokens(l):l;i.walkTokens&&await Promise.all(this.walkTokens(c,i.walkTokens));let m=await(i.hooks?await i.hooks.provideParser(t):t?te.parse:te.parseInline)(c,i);return i.hooks?await i.hooks.postprocess(m):m})().catch(o);try{i.hooks&&(e=i.hooks.preprocess(e));let s=(i.hooks?i.hooks.provideLexer(t):t?ee.lex:ee.lexInline)(e,i);i.hooks&&(s=i.hooks.processAllTokens(s)),i.walkTokens&&this.walkTokens(s,i.walkTokens);let l=(i.hooks?i.hooks.provideParser(t):t?te.parse:te.parseInline)(s,i);return i.hooks&&(l=i.hooks.postprocess(l)),l}catch(s){return o(s)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let r="<p>An error occurred:</p><pre>"+Y(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},Ie=new ml;function O(t,e){return Ie.parse(t,e)}O.options=O.setOptions=function(t){return Ie.setOptions(t),O.defaults=Ie.defaults,vi(O.defaults),O};O.getDefaults=In;O.defaults=Ne;function gl(...t){return Ie.use(...t),O.defaults=Ie.defaults,vi(O.defaults),O}O.use=gl;O.walkTokens=function(t,e){return Ie.walkTokens(t,e)};O.parseInline=Ie.parseInline;O.Parser=te;O.parser=te.parse;O.Renderer=Ht;O.TextRenderer=Wn;O.Lexer=ee;O.lexer=ee.lex;O.Tokenizer=Pe;O.Hooks=it;O.parse=O;var xd=O.options,kd=O.setOptions,Ed=O.walkTokens,Td=O.parseInline;var Ad=te.parse,Sd=ee.lex;var qn=["image","when","location","attendance","description","price","tags","organizer","eligibility","cfp"],Ri=["image","when","location","attendance","description"],Oi=["google-calendar","outlook-calendar","yahoo-calendar","ics","link"],bl=["series","multipart"];function Pi(t){return qn.includes(t)}function vl(t){return bl.includes(t)}function Ii(t){if(!t)return 1/0;let e=Number.parseInt(t,10);return Number.isFinite(e)&&e>0?e:1/0}function Bt(t){return t==="en"||t==="es"?t:"auto"}function Wt(t,e){return t!=="auto"?t:e.toLowerCase().startsWith("es")?"es":"en"}function Ni(t){return t?.trim()||void 0}function zi(t){return t!=="false"}function $i(t){return t==="cards"?"cards":t==="list"?"list":"calendar"}function jt(t){return t==="link"||t==="none"?t:"modal"}function Fi(t){return t==="none"?"none":"auto"}function wl(t){return t==="google-calendar"||t==="outlook-calendar"||t==="yahoo-calendar"||t==="ics"||t==="link"}function Ui(t){if(t==="none")return[];if(!t)return[...Oi];let e=t.split(",").map(n=>n.trim()).filter(wl);return e.length>0?[...new Set(e)]:[...Oi]}function Hi(t){if(!t)return new Set(Ri);let e=t.split(",").map(n=>n.trim()).filter(Pi);return e.length>0?new Set(e):new Set(Ri)}function Gi(t){if(!t)return new Set(qn);let e=t.split(",").map(n=>n.trim()).filter(Pi);return e.length>0?new Set(e):new Set(qn)}function Bi(t){return t?new Set(t.split(",").map(e=>e.trim()).filter(vl)):new Set}function Wi(t){return t?t.split(",").map(e=>e.trim()).filter(e=>e.length>0):[]}var Gt={small:"160px",medium:"220px",large:"320px"};function ji(t){let e=t?.trim();return e?e in Gt?Gt[e]:/^\d+(\.\d+)?$/.test(e)?`${e}px`:/^\d+(\.\d+)?(px|rem|em|ch|vw|%)$/.test(e)?e:Gt.medium:Gt.medium}function qi(t){let e=t?.trim().toLowerCase();if(e&&!(e==="none"||e==="off"||e==="auto")){if(/^\d+(\.\d+)?$/.test(e))return`${e}px`;if(/^\d+(\.\d+)?(px|rem|em|ch|vh|dvh|svh|vmin|vmax)$/.test(e))return e}}function Vi(t){let e=t?.trim().toLowerCase();return e==="compact"||e==="comfortable"?e:"auto"}function Ki(t,e){return t==="compact"||t==="auto"&&e}var Mi=3;function yl(t){let e=t?.trim().toLowerCase();if(!e)return Mi;if(e==="off"||e==="none"||e==="false")return"off";let n=Number.parseInt(e,10);return Number.isFinite(n)&&n>0?n:Mi}function xl(t){let e=t?.trim();if(!e)return{kind:"next-event"};let n=e.toLowerCase();return n==="today"||n==="now"?{kind:"today"}:n==="next-event"?{kind:"next-event"}:/^\d{4}-\d{2}$/.test(e)&&Di(`${e}-01`)?{kind:"date",date:`${e}-01`}:/^\d{4}-\d{2}-\d{2}$/.test(e)&&Di(e)?{kind:"date",date:e}:{kind:"next-event"}}function Di(t){let[e,n,r]=t.split("-").map(Number),i=new Date(Date.UTC(e,n-1,r));return i.getUTCFullYear()===e&&i.getUTCMonth()===n-1&&i.getUTCDate()===r}function kl(t){let e=t?.trim().toLowerCase();return!(e==="off"||e==="false"||e==="none")}function Zi(t,e){return{maxPerDay:yl(t("max-per-day")),initialDate:e?{kind:"date",date:e}:xl(t("initial-date")),responsive:kl(t("responsive"))}}function Yi(t){let e=t?.trim().toLowerCase();return e?e==="off"||e==="none"||e==="false"?"off":e==="auto"?"auto":"on":"on"}function Xi(t){let e=t?.trim().toLowerCase();return!(e==="off"||e==="none"||e==="false")}var jn=["calendar","list","cards"];function El(t){return t==="calendar"||t==="list"||t==="cards"}function Vn(t){let e=t?.trim().toLowerCase();if(!e)return[...jn];if(e==="none"||e==="off"||e==="false")return[];let n=new Set(e.split(",").map(r=>r.trim()).filter(El));return n.size===0?[...jn]:jn.filter(r=>n.has(r))}function Ji(t,e,n){return t.length<2?e:n&&t.includes(n)?n:t.includes(e)?e:t[0]}function Tl(t,e){this.v=t,this.k=e}function Qi(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function Al(t){if(Array.isArray(t))return t}function Sl(t,e){var n=t==null?null:typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"];if(n!=null){var r,i,o,s,l=[],c=!0,m=!1;try{if(o=(n=n.call(t)).next,e===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=o.call(n)).done)&&(l.push(r.value),l.length!==e);c=!0);}catch(u){m=!0,i=u}finally{try{if(!c&&n.return!=null&&(s=n.return(),Object(s)!==s))return}finally{if(m)throw i}}return l}}function _l(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ll(t,e){return Al(t)||Sl(t,e)||Cl(t,e)||_l()}function Cl(t,e){if(t){if(typeof t=="string")return Qi(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Qi(t,e):void 0}}function qt(t){var e,n;function r(o,s){try{var l=t[o](s),c=l.value,m=c instanceof Tl;Promise.resolve(m?c.v:c).then(function(u){if(m){var v=o==="return"&&c.k?o:"next";if(!c.k||u.done)return r(v,u);u=t[v](u).value}i(!!l.done,u)},function(u){r("throw",u)})}catch(u){i(2,u)}}function i(o,s){o===2?e.reject(s):e.resolve({value:s,done:o}),(e=e.next)?r(e.key,e.arg):n=null}this._invoke=function(o,s){return new Promise(function(l,c){var m={key:o,arg:s,resolve:l,reject:c,next:null};n?n=n.next=m:(e=n=m,r(o,s))})},typeof t.return!="function"&&(this.return=void 0)}qt.prototype[typeof Symbol=="function"&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},qt.prototype.next=function(t){return this._invoke("next",t)},qt.prototype.throw=function(t){return this._invoke("throw",t)},qt.prototype.return=function(t){return this._invoke("return",t)};var bo=Object.entries,Rl=Object.keys,eo=Object.setPrototypeOf,Ol=Object.isFrozen,vo=Object.getPrototypeOf,wo=Object.getOwnPropertyDescriptor,q=Object.freeze,z=Object.seal,ke=Object.create,yo=typeof Reflect<"u"&&Reflect,Kt=yo.apply,ir=yo.construct;q||(q=function(e){return e});z||(z=function(e){return e});Kt||(Kt=function(e,n){for(var r=arguments.length,i=new Array(r>2?r-2:0),o=2;o<r;o++)i[o-2]=arguments[o];return e.apply(n,i)});ir||(ir=function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return new e(...r)});var ne=D(Array.prototype.forEach),Ml=D(Array.prototype.lastIndexOf),to=D(Array.prototype.pop),lt=D(Array.prototype.push),no=D(Array.prototype.slice),Dl=D(Array.prototype.splice),qe=Array.isArray,Kn=or(Set),Zn=D(Set.prototype.add),ct=D(Set.prototype.has),Pl=D(Set.prototype.delete),Il=or(Map),ro=D(Map.prototype.get),io=D(Map.prototype.set),ge=D(String.prototype.toLowerCase),Yn=D(String.prototype.toString),Nl=D(String.prototype.match),dt=D(String.prototype.replace),Xn=D(String.prototype.indexOf),zl=D(String.prototype.trim),$l=D(Number.prototype.toString),Fl=D(Boolean.prototype.toString),oo=typeof BigInt>"u"?null:D(BigInt.prototype.toString),ao=typeof Symbol>"u"?null:D(Symbol.prototype.toString),K=D(Object.prototype.hasOwnProperty),ut=D(Object.prototype.toString),Ul=RegExp.prototype.test,G=function(e,n){return e instanceof RegExp&&(e.lastIndex=0),Kt(Ul,e,[n])},ce=or(TypeError);function D(t){return function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return Kt(t,e,r)}}function or(t){return function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return ir(t,n)}}function C(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ge;if(eo&&eo(t,null),!qe(e))return t;let r=e.length;for(;r--;){let i=e[r];if(typeof i=="string"){let o=n(i);o!==i&&(Ol(e)||(e[r]=o),i=o)}t[i]=!0}return t}function Hl(t){for(let e=0;e<t.length;e++)K(t,e)||(t[e]=null);return t}function Zt(t){let e=ke(null);for(let r of bo(t)){var n=Ll(r,2);let i=n[0],o=n[1];K(t,i)&&(qe(o)?e[i]=Hl(o):o&&typeof o=="object"&&o.constructor===Object?e[i]=Zt(o):e[i]=o)}return e}function pt(t){let e=ke(null),n=Rl(t),r=n.length;for(;r--;)e[n[r]]=t[n[r]];return e}function Gl(t){switch(typeof t){case"string":return t;case"number":return $l(t);case"boolean":return Fl(t);case"bigint":return oo?oo(t):"0";case"symbol":return ao?ao(t):"Symbol()";case"undefined":return ut(t);case"function":case"object":{if(t===null)return ut(t);let e=t,n=X(e,"toString");if(typeof n=="function"){let r=n(e);return typeof r=="string"?r:ut(r)}return ut(t)}default:return ut(t)}}function X(t,e){for(;t!==null;){let r=wo(t,e);if(r){if(r.get)return D(r.get);if(typeof r.value=="function")return D(r.value)}t=vo(t)}function n(){return null}return n}function Bl(t,e){for(;t!==null;){let n=wo(t,e);if(n)return n.get?D(n.get):null;t=vo(t)}return null}function Wl(t){if(!t)return!1;try{return G(t,""),!0}catch{return!1}}var so=q(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Jn=q(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Qn=q(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),jl=q(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),er=q(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),ql=q(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),lo=q(["#text"]),co=q(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),tr=q(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),uo=q(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Vt=q(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Vl=z(/{{[\w\W]*|^[\w\W]*}}/g),Kl=z(/<%[\w\W]*|^[\w\W]*%>/g),Zl=z(/\${[\w\W]*/g),po=z(/{{|}}|\${|<%|%>/),Yl=z(/[^\t\n\f\r ]/),ho=z(/\u0000/g),Xl=z(/^data-[\-\w.\u00B7-\uFFFF]+$/),Jl=z(/^aria-[\-\w]+$/),fo=z(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ql=z(/^(?:\w+script|data):/i),ec=z(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),tc=z(/^html$/i),nc=z(/^[a-z][.\w]*(-[.\w]+)+$/i),nr=z(/<[/\w!]/g),rc=z(/<[/\w]/g),ic=z(/<[/\w]|^-?>|--!?>|<!-$/g),oc=z(/<\/no(script|embed|frames)/i),mo=z(/\/>/i),ac=z(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i),sc=z(/^[\r\n\t ]+/),P={element:1,text:3,processingInstruction:7,comment:8,document:9,documentFragment:11},lc=q(C({},["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"])),cc=q(C({},["textarea","title"])),dc=q(C({},["area","base","basefont","bgsound","br","col","embed","frame","hr","img","input","keygen","link","meta","param","source","track","wbr"])),uc=function(){return typeof window>"u"?null:window},pc=function(e,n){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let r=null,i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(r=n.getAttribute(i));let o="dompurify"+(r?"#"+r:"");try{return e.createPolicy(o,{createHTML(s){return s},createScriptURL(s){return s}})}catch{return console.warn("TrustedTypes policy "+o+" could not be created."),null}},go=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},xe=function(e,n,r,i){return K(e,n)&&qe(e[n])?C(i.base?pt(i.base):{},e[n],i.transform):r},rr=function(e,n,r){let i=K(e,n)?e[n]:void 0;return i&&typeof i=="object"?Zt(i):r};function xo(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:uc(),e=b=>xo(b);if(e.version="3.5.0",e.removed=[],!t||!t.document||t.document.nodeType!==P.document||!t.Element)return e.isSupported=!1,e;let n=t.document,r=n,i=r.currentScript,o=t.HTMLTemplateElement,s=t.Node,l=t.Element,c=t.NodeFilter,m=t.DOMParser,u=t.trustedTypes,v=l.prototype,g=X(v,"cloneNode"),y=X(v,"remove"),T=X(v,"removeChild"),E=X(v,"removeAttributeNode"),A=X(v,"nextSibling"),S=X(v,"childNodes"),B=X(v,"parentNode"),R=X(v,"shadowRoot"),de=X(v,"attributes"),J=s&&s.prototype?X(s.prototype,"nodeType"):null,Q=s&&s.prototype?X(s.prototype,"nodeName"):null,Te=s&&s.prototype?X(s.prototype,"ownerDocument"):null,$=function(a){return J?J(a):a.nodeType},Z=function(a){return Q?Q(a):a.nodeName},Ae=Bl(v,"namespaceURI"),Se=function(a){return Ae?Ae(a):a.namespaceURI},vt=function(a){return $(a)===P.element?de(a):null};if(typeof o=="function"){let b=n.createElement("template");b.content&&b.content.ownerDocument&&(n=b.content.ownerDocument)}let W,j="",Ve,ue=!1,Ke=0,Mr=function(){if(Ke>0)throw ce('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},Ze=function(a){Mr(),Ke++;try{return W.createHTML(a)}finally{Ke--}},Dr=function(a){return W&&dn?Ze(a):a},wa=function(a){Mr(),Ke++;try{return W.createScriptURL(a)}finally{Ke--}},ya=function(){return ue||(Ve=pc(u,i),ue=!0),Ve},wt=n,rn=wt.implementation,xa=wt.createNodeIterator,ka=wt.createDocumentFragment,Ea=wt.getElementsByTagName,Ta=r.importNode,F=go();e.isSupported=typeof bo=="function"&&typeof B=="function"&&rn&&rn.createHTMLDocument!==void 0;let Aa=Vl,Sa=Kl,_a=Zl,La=Xl,Ca=Jl,Ra=Ql,Oa=ec,Ma=nc,Pr=fo,I=null,on=C({},[...so,...Jn,...Qn,...er,...lo]),N=null,an=C({},[...co,...tr,...uo,...Vt]),re=null,Ye=null,Ir=null,ve=Object.seal(ke(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),Nr=!0,sn=!0,zr=!1,ln=!0,pe=!1,_e=!0,Le=!1,yt=!1,xt=null,kt=null,cn=!1,$e=!1,Et=!1,dn=!1,$r=!0,Fr=!1,Ur="user-content-",un=!0,pn=!1,he=null,Ce=null,Fe=!1,Re=null,Hr=C({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]),Gr=null,Br=C({},["audio","video","img","source","image","track"]),Wr=null,jr=C({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Tt="http://www.w3.org/1998/Math/MathML",At="http://www.w3.org/2000/svg",ie="http://www.w3.org/1999/xhtml",Ue=ie,hn=!1,qr=null,Da=C({},[Tt,At,ie],Yn),Pa=q(C({},["mi","mo","mn","ms","mtext"])),fn=null,Ia=q(C({},["annotation-xml"])),mn=null,Na=q(ke(null)),za=C({},["title","style","font","a","script"]),He=null,$a=["application/xhtml+xml","text/html"],Fa="text/html",U=null,Xe=null,St=null,Ua=n.createElement("form"),Vr=function(a){return a instanceof RegExp||a instanceof Function},_t=function(){let a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};(!a||typeof a!="object")&&(a={}),a=Zt(a),He=$a.indexOf(a.PARSER_MEDIA_TYPE)===-1?Fa:a.PARSER_MEDIA_TYPE,U=He==="application/xhtml+xml"?Yn:ge,I=xe(a,"ALLOWED_TAGS",on,{transform:U}),N=xe(a,"ALLOWED_ATTR",an,{transform:U}),qr=xe(a,"ALLOWED_NAMESPACES",Da,{transform:Yn}),Wr=xe(a,"ADD_URI_SAFE_ATTR",jr,{transform:U,base:jr}),Gr=xe(a,"ADD_DATA_URI_TAGS",Br,{transform:U,base:Br}),Re=xe(a,"FORBID_CONTENTS",Hr,{transform:U}),Ye=xe(a,"FORBID_TAGS",ke(null),{transform:U}),Ir=xe(a,"FORBID_ATTR",ke(null),{transform:U}),Fe=K(a,"USE_PROFILES")?a.USE_PROFILES&&typeof a.USE_PROFILES=="object"?Zt(a.USE_PROFILES):a.USE_PROFILES:!1,Nr=a.ALLOW_ARIA_ATTR!==!1,sn=a.ALLOW_DATA_ATTR!==!1,zr=a.ALLOW_UNKNOWN_PROTOCOLS||!1,ln=a.ALLOW_SELF_CLOSE_IN_ATTR!==!1,pe=a.SAFE_FOR_TEMPLATES||!1,_e=a.SAFE_FOR_XML!==!1,Le=a.WHOLE_DOCUMENT||!1,$e=a.RETURN_DOM||!1,Et=a.RETURN_DOM_FRAGMENT||!1,dn=a.RETURN_TRUSTED_TYPE||!1,cn=a.FORCE_BODY||!1,$r=a.SANITIZE_DOM!==!1,Fr=a.SANITIZE_NAMED_PROPS||!1,un=a.KEEP_CONTENT!==!1,pn=a.IN_PLACE||!1,Pr=Wl(a.ALLOWED_URI_REGEXP)?a.ALLOWED_URI_REGEXP:fo,Ue=typeof a.NAMESPACE=="string"?a.NAMESPACE:ie,fn=rr(a,"MATHML_TEXT_INTEGRATION_POINTS",Pa),mn=rr(a,"HTML_INTEGRATION_POINTS",Ia);let d=rr(a,"CUSTOM_ELEMENT_HANDLING",Na);if(re=ke(null),K(d,"tagNameCheck")&&Vr(d.tagNameCheck)&&(re.tagNameCheck=d.tagNameCheck),K(d,"attributeNameCheck")&&Vr(d.attributeNameCheck)&&(re.attributeNameCheck=d.attributeNameCheck),K(d,"allowCustomizedBuiltInElements")&&typeof d.allowCustomizedBuiltInElements=="boolean"&&(re.allowCustomizedBuiltInElements=d.allowCustomizedBuiltInElements),z(re),pe&&(sn=!1),Et&&($e=!0),Fe&&((K(a,"ALLOWED_TAGS")||K(a,"ALLOWED_ATTR"))&&typeof console<"u"&&typeof console.warn=="function"&&console.warn("DOMPurify: USE_PROFILES overrides ALLOWED_TAGS and ALLOWED_ATTR. Do not use these options together."),I=C({},lo),N=ke(null),Fe.html===!0&&(C(I,so),C(N,co)),Fe.svg===!0&&(C(I,Jn),C(N,tr),C(N,Vt)),Fe.svgFilters===!0&&(C(I,Qn),C(N,tr),C(N,Vt)),Fe.mathMl===!0&&(C(I,er),C(N,uo),C(N,Vt))),ve.tagCheck=null,ve.attributeCheck=null,K(a,"ADD_TAGS")&&(typeof a.ADD_TAGS=="function"?ve.tagCheck=a.ADD_TAGS:qe(a.ADD_TAGS)&&(I===on&&(I=pt(I)),C(I,a.ADD_TAGS,U))),K(a,"ADD_ATTR")&&(typeof a.ADD_ATTR=="function"?ve.attributeCheck=a.ADD_ATTR:qe(a.ADD_ATTR)&&(N===an&&(N=pt(N)),C(N,a.ADD_ATTR,U))),K(a,"ADD_FORBID_CONTENTS")&&qe(a.ADD_FORBID_CONTENTS)&&(Re===Hr&&(Re=pt(Re)),C(Re,a.ADD_FORBID_CONTENTS,U)),un&&(I["#text"]=!0),Le&&C(I,["html","head","body"]),I.table&&(I.tbody=!0,delete Ye.tbody),a.TRUSTED_TYPES_POLICY){if(typeof a.TRUSTED_TYPES_POLICY.createHTML!="function")throw ce('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof a.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw ce('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');let p=W;W=a.TRUSTED_TYPES_POLICY;try{j=Ze("")}catch(h){throw W=p,h}}else a.TRUSTED_TYPES_POLICY===null?(W=void 0,j=""):(W===void 0&&(W=ya()),W&&typeof j=="string"&&(j=Ze("")));Xe=q(a)},Kr=C({},[...Jn,...Qn,...jl]),Zr=C({},[...er,...ql]),Ha=function(a,d,p){return d===ie?a==="svg":d===Tt?a==="svg"&&(p==="annotation-xml"||fn[p]):!!Kr[a]},Ga=function(a,d,p){return d===ie?a==="math":d===At?a==="math"&&mn[p]:!!Zr[a]},Ba=function(a,d,p){return d===At&&!mn[p]||d===Tt&&!fn[p]?!1:!Zr[a]&&(za[a]||!Kr[a])},Wa=function(a){let d=Se(a),p=ge(Z(a)),h=B(a),w=Ue,x="template";return h&&$(h)===P.element&&(w=Se(h),x=ge(Z(h))),qr[d]?d===At?Ha(p,w,x):d===Tt?Ga(p,w,x):d===ie?Ba(p,w,x):He==="application/xhtml+xml":!1},we=function(a){lt(e.removed,{element:a}),Qr(a);try{B(a).removeChild(a)}catch{if(y(a),!B(a))throw ce("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},Yr=function(a,d,p){try{E(a,d)}catch{try{a.removeAttribute(p)}catch{}}},ja=function(a){vn(a);let d=S(a);d&&ne(no(d),p=>{try{T(a,p)}catch{}}),$(a)===P.element&&gn(a,!1)},Ge=function(a,d,p){if(!p)try{p=d.getAttributeNode(a)}catch{p=null}if(lt(e.removed,{attribute:p||null,from:d}),p)Yr(d,p,a);else try{d.removeAttribute(a)}catch{}if(a==="is")if($e||Et)try{we(d)}catch{}else try{d.setAttribute(a,"")}catch{}},gn=function(a,d){let p=de(a);if(p)for(let h=p.length-1;h>=0;--h){let w=p[h],x=w&&w.name;typeof x=="string"&&!(d&&N[U(x)])&&Yr(a,w,x)}},bn=function(a,d){let p=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,h=[a];for(;h.length>0;){let w=h.pop();if(d(w)===!1)continue;if(p&&$(w)===P.element){let k=R(w);Be(k)&&h.push(k)}let x=S(w);if(x)for(let k=x.length-1;k>=0;--k)h.push(x[k])}},vn=function(a){bn(a,d=>{$(d)===P.element&&gn(d,!0)})},wn=function(a){let d=[];return bn(a,p=>{d.push(p)},!0),d},qa=function(a,d){let p=Kn();ne(wn(a),h=>{$(h)===P.element&&Zn(p,h)}),ne(d,h=>{$(h)===P.element&&!ct(p,h)&&gn(h,!0)})},Xr=function(a,d){let p=!1;return ne(e.removed,h=>{h.element&&(p=p||h.element===a,vn(h.element))}),qa(a,d),p},yn=function(a,d){ja(a),Xr(a,d)},Jr=8,Va=function(a,d){let p=he,h=null,w=()=>(h||(h=Kn(),ne(d,x=>{Zn(h,x)})),h);for(let x=0;;x++){let k=wn(a),M=[a],fe=!1;if(ne(k,ae=>{$(ae)===P.documentFragment?lt(M,ae):!fe&&!ct(p,ae)&&(fe=ct(w(),ae))}),!fe)return;if(x>=Jr)throw ce("the tree kept changing during in-place sanitization; refusing to return it");ne(M,(ae,se)=>{Ka(ae,se>0,a,w())})}},Ka=function(a,d,p,h){let w=Lt(a),x;for(;x=w.nextNode();)!ct(h,x)||ct(he,x)||(d&&oe(F.uponSanitizeShadowNode,x,null),En(x,p))},Za=function(a){if(!he)return;Zn(he,a);let d=ro(Ce,a);if(d!==void 0){if(d>=Jr)throw ce("the tree kept changing during in-place sanitization; refusing to return it");io(Ce,a,d+1)}},Qr=function(a){he&&(Pl(he,a),ro(Ce,a)===void 0&&io(Ce,a,0))},ei=function(a,d){return _e?a==="patchsrc"?!0:a==="for"&&d!=="label"&&d!=="output":!1},Ya=function(a){_e&&bn(a,d=>{let p=$(d);if(p===P.processingInstruction||p===P.comment&&G(rc,d.data)){try{y(d)}catch{}return!1}if(p===P.element){let h=d,w=U(Z(d));try{h.hasAttribute&&h.hasAttribute("patchsrc")&&h.removeAttribute("patchsrc"),h.hasAttribute&&h.hasAttribute("for")&&ei("for",w)&&h.removeAttribute("for")}catch{}}return!0})},ti=function(a){let d=null,p=null;if(cn)a="<remove></remove>"+a;else{let x=Nl(a,sc);p=x&&x[0]}He==="application/xhtml+xml"&&Ue===ie&&(a='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+a+"</body></html>");let h=W?Ze(a):a;if(Ue===ie)try{d=new m().parseFromString(h,He)}catch{}if(!d||!d.documentElement){d=rn.createDocument(Ue,"template",null);try{d.documentElement.innerHTML=hn?j:h}catch{}}let w=d.body||d.documentElement;return a&&p&&w.insertBefore(n.createTextNode(p),w.childNodes[0]||null),Ue===ie?Ea.call(d,Le?"html":"body")[0]:Le?d.documentElement:w},Lt=function(a){let d=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,p=Te?Te(a):a.ownerDocument;return xa.call(p||a,a,(d?0:c.SHOW_ELEMENT)|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},Ct=function(a){return a=dt(a,Aa," "),a=dt(a,Sa," "),a=dt(a,_a," "),a},xn=function(a){var d;kn(a);let p=(d=a.querySelectorAll)===null||d===void 0?void 0:d.call(a,"template");p&&ne(p,h=>{Be(h.content)&&xn(h.content)})},Xa="table,tbody,thead,tfoot,tr,colgroup",Ja=C({},["caption","colgroup","col","thead","tbody","tfoot","tr","td","th","style","script","template"]),Qa=function(a){var d;if(He==="application/xhtml+xml")return;let p=(d=a.querySelectorAll)===null||d===void 0?void 0:d.call(a,Xa);!p||p.length===0||ne(p,h=>{ne(no(S(h)),w=>{let x=$(w);if(!(x===P.text?G(Yl,w.data):x===P.element&&!Ja[ge(Z(w))]))return;let k=h;for(;k&&ge(Z(k))!=="table";)k=k===a?null:B(k);let M=k&&k!==a?B(k):null;if(M)try{M.insertBefore(w,k)}catch{}})})},kn=function(a){Qa(a),a.normalize();let d=Lt(a,!0),p=null,h=d.nextNode();for(;h;){let w=h.data;if(G(ho,w)&&(w=dt(w,ho,""),h.data=w),G(po,w)&&(w=Ct(w),h.data=w),w&&$(h)===P.text){if(p){let x=p.data,k=x[x.length-1]+w[0];G(po,k)&&(p.data=Ct(x+w[0]))}p=h}h=d.nextNode()}},Rt=function(a){let d=Q?Q(a):null;return typeof d!="string"||U(d)!=="form"?!1:typeof a.nodeName!="string"||typeof a.textContent!="string"||typeof a.removeChild!="function"||a.attributes!==de(a)||typeof a.removeAttribute!="function"||typeof a.removeAttributeNode!="function"||typeof a.getAttributeNode!="function"||typeof a.setAttribute!="function"||typeof a.namespaceURI!="string"||typeof a.insertBefore!="function"||typeof a.hasChildNodes!="function"||a.nodeType!==J(a)||a.childNodes!==S(a)},ni=function(a){if(!J||typeof a!="object"||a===null)return null;try{let d=J(a);return typeof d=="number"?d:null}catch{return null}},Be=function(a){return ni(a)===P.documentFragment},Je=function(a){return ni(a)!==null};function oe(b,a,d){b.length!==0&&ne(b,p=>{p.call(e,a,d,Xe)})}let es=function(a,d){let p=!!dc[d],h=!!lc[d];return!p&&!h&&!cc[d]||Se(a)!==ie?!1:p?a.hasChildNodes():Je(a.firstElementChild)?!0:h&&typeof a.textContent=="string"&&G(nr,a.textContent)},ts=function(a,d,p){return!!(_e&&p===P.element&&a.hasChildNodes()&&!Je(a.firstElementChild)&&G(nr,a.textContent)&&G(nr,a.innerHTML)||_e&&p===P.element&&es(a,d)||p===P.processingInstruction||_e&&p===P.comment&&G(ic,a.data))},Ot=function(a,d){if(a instanceof RegExp)return G(a,d);if(a instanceof Function){for(var p=arguments.length,h=new Array(p>2?p-2:0),w=2;w<p;w++)h[w-2]=arguments[w];return!!a(d,...h)}return!1},ns=function(a,d,p){if(!Ye[d]&&oi(d)&&Ot(re.tagNameCheck,d))return!1;if(un&&!Re[d]&&!Re[ge(d)]){let h=B(a),w=S(a);if(w&&h){let x=w.length;for(let k=x-1;k>=0;--k){let M=a===p?g(w[k],!0):w[k];h.insertBefore(M,A(a))}}}return we(a),!0},ri=function(a,d,p,h){return a.length===0?d:d===p||d===h?pt(d):d},Qe=function(a,d){return a===d||B(a)!==null?!1:(pn&&vn(a),Qr(a),!0)},rs=function(a,d){if(Za(a),oe(F.beforeSanitizeElements,a,null),Qe(a,d))return!0;if(Rt(a))return we(a),!0;let p=U(Z(a)),h=$(a);if(I=ri(F.uponSanitizeElement,I,on,xt),oe(F.uponSanitizeElement,a,{tagName:p,allowedTags:I}),Qe(a,d))return!0;if(ts(a,p,h))return we(a),!0;if((Ye[p]||!(ve.tagCheck instanceof Function&&ve.tagCheck(p))&&!I[p])&&ns(a,p,d))return!0;if(h===P.element&&!Wa(a)||(p==="noscript"||p==="noembed"||p==="noframes")&&G(oc,a.innerHTML))return we(a),!0;if(pe&&h===P.text){let w=a.textContent,x=Ct(w);w!==x&&(lt(e.removed,{element:a.cloneNode()}),a.textContent=x)}return oe(F.afterSanitizeElements,a,null),Qe(a,d)},ii=function(a,d,p){if(Ir[d]||ei(d,a)||$r&&(d==="id"||d==="name")&&(p in n||p in Ua))return!1;let h=N[d]||ve.attributeCheck instanceof Function&&ve.attributeCheck(d,a);if(sn&&G(La,d)||Nr&&G(Ca,d))return!0;if(!h)return oi(a)&&Ot(re.tagNameCheck,a)&&Ot(re.attributeNameCheck,d,a)||d==="is"&&re.allowCustomizedBuiltInElements&&Ot(re.tagNameCheck,p);if(Wr[d])return!0;let w=dt(p,Oa,"");return G(Pr,w)||(d==="src"||d==="xlink:href"||d==="href")&&a!=="script"&&Xn(p,"data:")===0&&Gr[a]||zr&&!G(Ra,w)?!0:!p},is=C({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),oi=function(a){return!is[ge(a)]&&G(Ma,a)},os=function(a,d,p,h){if(W&&typeof u=="object"&&typeof u.getAttributeType=="function"&&!p)switch(u.getAttributeType(a,d)){case"TrustedHTML":return Ze(h);case"TrustedScriptURL":return wa(h)}return h},as=function(a,d,p,h){try{return p?a.setAttributeNS(p,d,h):a.setAttribute(d,h),Rt(a)?(we(a),!1):!0}catch{return Ge(d,a),!1}},ai=function(a,d){return _e&&G(ac,d)?!0:ge(a)==="attributename"&&Xn(d,"href")!==-1},ss=function(a,d){if(oe(F.beforeSanitizeAttributes,a,null),Qe(a,d))return;let p=vt(a);if(!p||Rt(a))return;N=ri(F.uponSanitizeAttribute,N,an,kt);let h={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:N,forceKeepAttr:void 0},w=p.length,x=U(Z(a));for(;w--;){let k=p[w];if(!k)continue;let M=k.name,fe=k.namespaceURI,ae=k.value,se=U(M),Oe=ae,H=M==="value"?Oe:zl(Oe),et=!1;if(h.attrName=se,h.attrValue=H,h.keepAttr=!0,h.forceKeepAttr=void 0,oe(F.uponSanitizeAttribute,a,h),H=h.attrValue,Fr&&(se==="id"||se==="name")&&Xn(H,Ur)!==0&&(Ge(M,a,k),H=Ur+H,et=!0),ai(M,H)){Ge(M,a,k);continue}if(!h.forceKeepAttr){if(!h.keepAttr){Ge(M,a,k);continue}if(!ln&&G(mo,H)){Ge(M,a,k);continue}if(pe&&(H=Ct(H)),!ii(x,se,H)){Ge(M,a,k);continue}H=os(x,se,fe,H),H!==Oe&&as(a,M,fe,H)&&et&&to(e.removed)}}oe(F.afterSanitizeAttributes,a,null),Qe(a,d)},En=function(a,d){rs(a,d),ss(a,d),Be(a.content)&&Tn(a.content)},Tn=function(a){let d=null,p=Lt(a);for(oe(F.beforeSanitizeShadowDOM,a,null);d=p.nextNode();)if(oe(F.uponSanitizeShadowNode,d,null),En(d,a),$(d)===P.element){let h=R(d);Be(h)&&(An(h),Tn(h))}pe&&kn(a),oe(F.afterSanitizeShadowDOM,a,null)},An=function(a){let d=[{node:a,shadow:null}];for(;d.length>0;){let p=d.pop();if(p.shadow){Tn(p.shadow);continue}let h=p.node,w=$(h)===P.element,x=S(h);if(x)for(let k=x.length-1;k>=0;--k)d.push({node:x[k],shadow:null});if(w){let k=Q?Q(h):null;if(typeof k=="string"&&U(k)==="template"){let M=h.content;Be(M)&&d.push({node:M,shadow:null})}}if(w){let k=R(h);Be(k)&&d.push({node:null,shadow:k},{node:k,shadow:null})}}},ls=function(a){let d=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},p=null,h=null,w=null,x=null;if(hn=!a,hn&&(a="<!-->"),typeof a!="string"&&!Je(a)&&(a=Gl(a),typeof a!="string"))throw ce("dirty is not a string, aborting");if(!e.isSupported)return a;yt?(I=xt,N=kt):_t(d),St=Xe,e.removed=[];let k=pn&&typeof a!="string"&&Je(a),M=[],fe=he,ae=Ce;if(k){Ya(a),M=wn(a);let H=Z(a);if(typeof H=="string"){let et=U(H);if(!I[et]||Ye[et])throw yn(a,M),ce("root node is forbidden and cannot be sanitized in-place")}if(Rt(a))throw yn(a,M),ce("root node is clobbered and cannot be sanitized in-place");he=Kn(),Ce=Il()}else if(Je(a))p=ti("<!---->"),h=p.ownerDocument.importNode(a,!0),h.nodeType===P.element&&h.nodeName==="BODY"||h.nodeName==="HTML"?p=h:p.appendChild(h),An(p);else{if(!$e&&!pe&&!Le&&a.indexOf("<")===-1)return Dr(a);if(p=ti(a),!p)return $e?null:dn?j:""}p&&cn&&we(p.firstChild);let se=k?a:p;try{k&&An(a);let H=Lt(se);for(;w=H.nextNode();)En(w,se);k&&Va(a,M)}catch(H){throw k&&yn(a,M),H}finally{he=fe,Ce=ae}if(k){if(Xr(a,M))throw ce("a node selected for removal could not be safely returned; refusing to sanitize in place");return pe&&xn(a),a}if($e){if(pe&&xn(p),Et)for(x=ka.call(p.ownerDocument);p.firstChild;)x.appendChild(p.firstChild);else x=p;return(N.shadowroot||N.shadowrootmode)&&(x=Ta.call(r,x,!0)),x}pe&&kn(p);let Oe=Le?p.outerHTML:p.innerHTML;return Le&&I["!doctype"]&&p.ownerDocument&&p.ownerDocument.doctype&&p.ownerDocument.doctype.name&&G(tc,p.ownerDocument.doctype.name)&&(Oe="<!DOCTYPE "+p.ownerDocument.doctype.name+`>
`+Oe),Dr(Oe)};return e.sanitize=function(b){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},d=St,p=I,h=N,w=e.removed;St=null;try{return ls(b,a)}finally{St=d,d&&(yt||_t(d),I=p,N=h,e.removed=w)}},e.setConfig=function(){let b=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};_t(b),yt=!0,xt=I,kt=N},e.clearConfig=function(){Xe=null,yt=!1,xt=null,kt=null,W=Ve,j=""},e.isValidAttribute=function(b,a,d){Xe||_t({});let p=U(b),h=U(a);return typeof d=="string"&&(ai(a,d)||!ln&&G(mo,d))?!1:ii(p,h,d)},e.addHook=function(b,a){typeof a=="function"&&K(F,b)&&lt(F[b],a)},e.removeHook=function(b,a){if(K(F,b)){if(a!==void 0){let d=Ml(F[b],a);return d===-1?void 0:Dl(F[b],d,1)[0]}return to(F[b])}},e.removeHooks=function(b){K(F,b)&&(F[b]=[])},e.removeAllHooks=function(){F=go()},e}var ko=xo();function f(t,e){let n=document.createElement(t);return e&&(n.className=e),n}function L(t,e){return t.textContent=e,t}function Ee(t,e){let n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("class",e),n.setAttribute("viewBox","0 0 24 24"),n.setAttribute("fill","none"),n.setAttribute("stroke","currentColor"),n.setAttribute("stroke-width","2"),n.setAttribute("stroke-linecap","round"),n.setAttribute("stroke-linejoin","round"),n.setAttribute("aria-hidden","true"),n.setAttribute("focusable","false");for(let r of t){let i=document.createElementNS("http://www.w3.org/2000/svg","path");i.setAttribute("d",r),n.append(i)}return n}var ar=["google","webcal","ics-download","feedly","feed-protocol","rss-download","ote-reader","ote-preview","json-download"];function hc(t){return ar.includes(t)}function Yt(t){return t==="badges"?"badges":"menu"}function Eo(t){if(t==="none")return new Set;if(!t)return new Set(ar);let e=t.split(",").map(n=>n.trim()).filter(hc);return e.length>0?new Set(e):new Set(ar)}var To=["ics","rss"];function fc(t){return To.includes(t)}function Ao(t){let e=t?.trim().toLowerCase();if(e===void 0||e==="")return new Set(To);let n=e.split(",").map(r=>r.trim()).filter(fc);return new Set(n)}function So(t){return`https://www.google.com/calendar/render?cid=${encodeURIComponent(sr(t))}`}function sr(t){return t.replace(/^https?:\/\//,"webcal://")}function _o(t){return`https://feedly.com/i/subscription/feed/${encodeURIComponent(t)}`}function Lo(t){return t.replace(/^https?:\/\//,"feed://")}function Co(t){return`https://reader.opentechevents.org/?subscribe=${encodeURIComponent(t)}`}function Ro(t){return`https://tools.opentechevents.org/preview/?feed=${encodeURIComponent(t)}`}function Oo(t){return`https://convert.opentechevents.org/ics?feed=${encodeURIComponent(t)}`}function Mo(t){return`https://convert.opentechevents.org/rss?feed=${encodeURIComponent(t)}`}var mc=new Set([22,23,25,465,587,110,143,993,995,445,3306,5432,6379,9200,11211,27017]),gc=new Set(["localhost","metadata.google.internal"]);function Do(t){let e;try{e=new URL(t)}catch{return!1}if(e.protocol!=="http:"&&e.protocol!=="https:"||e.username||e.password||e.port&&mc.has(Number(e.port)))return!1;let n=e.hostname.toLowerCase().replace(/\.$/,"");return!(gc.has(n)||n.endsWith(".localhost")||n.endsWith(".internal")||/^\[|^[0-9.]+$|^[0-9a-f:]*:[0-9a-f:]*$/i.test(n))}var bc={en:{subscribe:"Subscribe",subscribeTo:t=>`Subscribe to ${t}`,calendarGroup:"Calendar",rssGroup:"RSS",oteGroup:"OTE feed",icsBadge:"ICS",rssBadge:"RSS feed",oteBadge:"OTE feed",google:"Subscribe with Google Calendar",webcal:"Subscribe with app (Apple Calendar, Outlook desktop\u2026)",icsDownload:"Open/download ICS",feedly:"Subscribe with Feedly",feedProtocol:"Subscribe with feed reader (NetNewsWire, Reeder\u2026)",rssDownload:"Open/download RSS",oteReader:"Subscribe with OTE Reader",otePreview:"Preview in OTE Tools",jsonDownload:"Open/download JSON"},es:{subscribe:"Suscribirse",subscribeTo:t=>`Suscribirse a ${t}`,calendarGroup:"Calendario",rssGroup:"RSS",oteGroup:"Feed OTE",icsBadge:"ICS",rssBadge:"Feed RSS",oteBadge:"Feed OTE",google:"Suscribirse con Google Calendar",webcal:"Suscribirse con app (Apple Calendar, Outlook de escritorio\u2026)",icsDownload:"Abrir/descargar ICS",feedly:"Suscribirse con Feedly",feedProtocol:"Suscribirse con lector de feeds (NetNewsWire, Reeder\u2026)",rssDownload:"Abrir/descargar RSS",oteReader:"Suscribirse con OTE Reader",otePreview:"Vista previa en OTE Tools",jsonDownload:"Abrir/descargar JSON"}},vc={ics:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 9.5h18"/></svg>',rss:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg>',ote:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/></svg>'},wc=["google","webcal","ics-download"],yc=["feedly","feed-protocol","rss-download"],xc=["ote-reader","ote-preview","json-download"];function Po(t,e,n,r,i){if(t)return{url:t,generated:!1};if(!(!e||!r.has(n)||!Do(e)))return{url:i(e),generated:!0}}function kc(t,e){let n=[],r=Po(t.icsUrl,t.jsonUrl,"ics",t.convert,Oo),i=Po(t.rssUrl,t.jsonUrl,"rss",t.convert,Mo);if(r&&wc.some(o=>t.show.has(o))){let o=[];t.show.has("google")&&o.push({label:e.google,href:So(r.url),external:!0}),t.show.has("webcal")&&o.push({label:e.webcal,href:sr(r.url),external:!1}),t.show.has("ics-download")&&o.push({label:e.icsDownload,href:r.url,external:!0}),o.length>0&&n.push({key:"ics",label:e.calendarGroup,items:o,generated:r.generated})}if(i&&yc.some(o=>t.show.has(o))){let o=[];t.show.has("feedly")&&o.push({label:e.feedly,href:_o(i.url),external:!0}),t.show.has("feed-protocol")&&o.push({label:e.feedProtocol,href:Lo(i.url),external:!1}),t.show.has("rss-download")&&o.push({label:e.rssDownload,href:i.url,external:!0}),o.length>0&&n.push({key:"rss",label:e.rssGroup,items:o,generated:i.generated})}if(t.jsonUrl&&xc.some(o=>t.show.has(o))){let o=[];t.show.has("ote-reader")&&o.push({label:e.oteReader,href:Co(t.jsonUrl),external:!0}),t.show.has("ote-preview")&&o.push({label:e.otePreview,href:Ro(t.jsonUrl),external:!0}),t.show.has("json-download")&&o.push({label:e.jsonDownload,href:t.jsonUrl,external:!0}),o.length>0&&n.push({key:"ote",label:e.oteGroup,items:o,generated:!1})}return n}function No(t){let e=L(f("a"),t.label);return e.href=t.href,e.setAttribute("role","menuitem"),t.external&&(e.target="_blank",e.rel="noopener noreferrer"),e}function Ec(t,e){let n=f("div","popover"),r=f("div","menu");return r.id=t,r.setAttribute("role","menu"),r.append(...e.items.map(No)),n.append(r),n}var Io=typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function";function Tc(t,e){let i=t.getBoundingClientRect(),o=e.getBoundingClientRect(),s=document.documentElement.clientWidth,l=document.documentElement.clientHeight,c=i.bottom+4,m=i.top-4-o.height,v=c+o.height<=l-8||m<8?c:m,g=i.left;g+o.width>s-8&&(g=i.right-o.width),g=Math.min(Math.max(g,8),Math.max(8,s-o.width-8)),e.style.top=`${Math.max(8,Math.min(v,l-8))}px`,e.style.left=`${g}px`,e.style.maxHeight=`${Math.max(120,l-v-8)}px`}function lr(t,e){let n=f("div","item"),r=f("button","trigger");if(r.type="button",r.dataset.group=e.groupKey,r.disabled=e.disabled,r.setAttribute("aria-haspopup","menu"),r.setAttribute("aria-expanded",String(e.open)),r.setAttribute("aria-label",e.ariaLabel),e.generated&&(r.dataset.generated=""),e.iconSvg){let s=f("span","icon");s.innerHTML=e.iconSvg,r.append(s)}let i=document.createElement("slot");i.name=e.slotName,i.textContent=e.fallbackLabel,r.append(i),r.addEventListener("click",()=>{e.disabled||e.onClick()}),n.append(r);let o=e.open&&!e.disabled?e.buildMenuContent():void 0;o&&(r.setAttribute("aria-controls",e.menuId),Io&&o.setAttribute("popover","manual"),n.append(o)),t.append(n),o&&Io&&(o.showPopover(),Tc(r,o))}function zo(t,e){t.replaceChildren();let n=bc[e.lang],r=kc(e,n),i=e.name?n.subscribeTo(e.name):n.subscribe;if(r.length===0){lr(t,{groupKey:"menu",slotName:"trigger",fallbackLabel:n.subscribe,ariaLabel:i,disabled:!0,open:!1,menuId:"",buildMenuContent:()=>f("div","menu"),onClick:()=>{}});return}if(e.layout==="badges"){let o={ics:n.icsBadge,rss:n.rssBadge,ote:n.oteBadge};for(let s of r)lr(t,{groupKey:s.key,slotName:`${s.key}-trigger`,fallbackLabel:o[s.key],ariaLabel:s.label,disabled:!1,open:e.openGroup===s.key,menuId:`menu-${e.instanceId}-${s.key}`,iconSvg:vc[s.key],generated:s.generated,buildMenuContent:()=>Ec(`menu-${e.instanceId}-${s.key}`,s),onClick:()=>e.onToggle(s.key)});return}lr(t,{groupKey:"menu",slotName:"trigger",fallbackLabel:n.subscribe,ariaLabel:i,disabled:!1,open:e.openGroup==="menu",menuId:`menu-${e.instanceId}`,generated:r.some(o=>o.generated),buildMenuContent:()=>{let o=f("div","popover"),s=f("div","menu");s.id=`menu-${e.instanceId}`,s.setAttribute("role","menu");for(let l of r){let c=l.label,m=f("div","menu-section");m.setAttribute("role","group"),m.setAttribute("aria-label",c);let u=L(f("div","menu-group-label"),c);u.setAttribute("aria-hidden","true"),m.append(u,...l.items.map(No)),s.append(m)}return o.append(s),o},onClick:()=>e.onToggle("menu")})}var $o=`
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
`;var Ac=0,cr=class extends HTMLElement{static observedAttributes=["feed-ics","feed-rss","feed-json","name","show","convert","layout","theme","lang"];#n;#e=null;#s=`ote-subscribe-${++Ac}`;#t=e=>{e.composedPath().includes(this)||this.#l(!1)};#c=e=>{e.key==="Escape"&&this.#l(!0)};constructor(){super();let e=this.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=$o,this.#n=document.createElement("div"),this.#n.className="subscribe",e.append(n,this.#n)}connectedCallback(){this.#r()}disconnectedCallback(){this.#o()}attributeChangedCallback(){this.isConnected&&this.#r()}#d(e){this.#e===e?this.#l(!0):this.#u(e)}#u(e){let n=this.#e!==null;this.#e=e,this.#r(),n||this.#p()}#l(e){if(this.#e===null)return;let n=this.#e;this.#e=null,this.#o(),this.#r(),e&&this.#n.querySelector(`[data-group="${n}"]`)?.focus()}#p(){document.addEventListener("pointerdown",this.#t),document.addEventListener("keydown",this.#c)}#o(){document.removeEventListener("pointerdown",this.#t),document.removeEventListener("keydown",this.#c)}#r(){let e=Wt(Bt(this.getAttribute("lang")),navigator.language),n={icsUrl:this.getAttribute("feed-ics")?.trim()||void 0,rssUrl:this.getAttribute("feed-rss")?.trim()||void 0,jsonUrl:this.getAttribute("feed-json")?.trim()||void 0,name:this.getAttribute("name")?.trim()||void 0,show:Eo(this.getAttribute("show")),convert:Ao(this.getAttribute("convert")),lang:e,layout:Yt(this.getAttribute("layout")),openGroup:this.#e,instanceId:this.#s,onToggle:r=>this.#d(r)};zo(this.#n,n)}};function Fo(){customElements.get("ote-subscribe")||customElements.define("ote-subscribe",cr)}var Sc="https://opentechevents.org/spec/",_c={en:{sources:t=>`${t} sources`,timesIn:t=>`Times in ${t}`,mark:"Powered by OTE",markTitle:"Published as an Open Tech Events feed \u2014 an open format any OTE tool can read",footerLabel:"Feed information"},es:{sources:t=>`${t} fuentes`,timesIn:t=>`Horas en ${t}`,mark:"Funciona con OTE",markTitle:"Publicado como feed Open Tech Events \u2014 un formato abierto que cualquier herramienta OTE puede leer",footerLabel:"Informaci\xF3n del feed"}};function Lc(t){try{let e=t??new Intl.DateTimeFormat().resolvedOptions().timeZone;if(!e)return;let n=new Intl.DateTimeFormat("en",{timeZone:e,timeZoneName:"shortOffset"}).formatToParts(new Date).find(r=>r.type==="timeZoneName")?.value;return n?`${e} (${n})`:e}catch{return}}function Uo(t){if(typeof t!="string")return;let e=t.trim();return/^https?:\/\//i.test(e)?e:void 0}function Cc(t){return typeof t=="string"&&t.trim()?t.trim():void 0}function Rc(t){if(!Array.isArray(t))return{};let e=i=>{for(let o of t){if(typeof o?.mediaType!="string"||o.mediaType.split(";")[0].trim().toLowerCase()!==i)continue;let s=Uo(o.url);if(s)return s}},n=e("text/calendar"),r=e("application/rss+xml");return{...n?{icsUrl:n}:{},...r?{rssUrl:r}:{}}}function dr(t,e){let n=Cc(t?.title),r=Uo(t?.url);return{...n?{title:n}:{},...r?{url:r}:{},...e?{jsonUrl:e}:{},...Rc(t?.alternates)}}function Oc(t,e){let n=t.sources??[];if(n.length>1){let o=L(f("span","footer-feed"),e.sources(n.length));return o.title=n.join(", "),o}let r=t.title??n[0];if(!r)return;if(!t.url){let o=L(f("span","footer-feed"),r);return o.title=r,o}let i=L(f("a","footer-feed"),r);return i.title=r,i.href=t.url,i.target="_blank",i.rel="noopener noreferrer",i}function Mc(t,e,n,r){if(!t.jsonUrl)return;Fo();let i=document.createElement("ote-subscribe");return i.className="footer-subscribe",i.setAttribute("layout",r),i.setAttribute("feed-json",t.jsonUrl),i.setAttribute("lang",e),n&&i.setAttribute("theme",n),t.title&&i.setAttribute("name",t.title),t.icsUrl&&i.setAttribute("feed-ics",t.icsUrl),t.rssUrl&&i.setAttribute("feed-rss",t.rssUrl),t.convert!==void 0&&t.convert!==null&&i.setAttribute("convert",t.convert),i}function Dc(t){let e=L(f("a","footer-mark"),t.mark);return e.href=Sc,e.target="_blank",e.rel="noopener noreferrer",e.title=t.markTitle,e.setAttribute("aria-label",t.markTitle),e}function Ho(t){if(t.mode==="off")return;let e=t.meta??{},n=!!(e.title||e.url||e.jsonUrl||(e.sources??[]).length>0);if(t.mode==="auto"&&!n)return;let r=_c[t.lang],i=f("div","footer");i.setAttribute("role","contentinfo"),i.setAttribute("aria-label",r.footerLabel);let o=f("div","footer-meta"),s=Oc(e,r);s&&o.append(s);let l=t.hasTimes?Lc(t.timeZone):void 0;l&&o.append(L(f("span","footer-zone"),r.timesIn(l))),o.childElementCount>0&&i.append(o);let c=f("div","footer-actions"),m=Mc(e,t.lang,t.theme,t.subscribeLayout);return m&&c.append(m),t.mark&&c.append(Dc(r)),c.childElementCount>0&&i.append(c),i.childElementCount>0?i:void 0}var Pc={en:{label:"View",calendar:"Calendar",list:"List",cards:"Cards",today:"Today",prev:"Previous month",next:"Next month"},es:{label:"Vista",calendar:"Calendario",list:"Lista",cards:"Tarjetas",today:"Hoy",prev:"Mes anterior",next:"Mes siguiente"}},Go={calendar:["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],list:["M4 6h16","M4 12h16","M4 18h16"],cards:["M4 4h7v7H4z","M13 4h7v7h-7z","M4 13h7v7H4z","M13 13h7v7h-7z"]},Ic={prev:["M15 5l-7 7 7 7"],next:["M9 5l7 7-7 7"]};function Bo(t){let e=Pc[t.lang],n=t.views.length>1?zc(t,e):void 0,r=t.nav?Nc(t.nav,e):void 0;if(!n&&!r)return;let i=f("div","ote-header");return r&&i.append(r),n&&i.append(n),i}function Nc(t,e){let n=f("div","header-nav"),r=L(f("button","header-today"),e.today);r.type="button",r.disabled=t.showsToday!==!1,r.addEventListener("click",()=>t.onNav("today")),n.append(r);for(let o of["prev","next"]){let s=f("button","header-arrow");s.type="button",s.dataset.nav=o,s.setAttribute("aria-label",e[o]),s.title=e[o],s.disabled=t.title===void 0,s.append(Ee(Ic[o],"header-arrow-icon")),s.addEventListener("click",()=>t.onNav(o)),n.append(s)}let i=f("span","header-title");return i.setAttribute("aria-live","polite"),t.title&&(i.textContent=t.title),n.append(i),n}function zc(t,e){if(t.density==="menu")return $c(t,e);let n=f("div","view-switcher");n.setAttribute("role","group"),n.setAttribute("aria-label",e.label);for(let r of t.views){let i=f("button","view-button");i.type="button",i.dataset.view=r,i.setAttribute("aria-pressed",String(r===t.active)),i.title=e[r],i.append(Ee(Go[r],"view-icon"),L(f("span","view-button-label"),e[r])),i.addEventListener("click",()=>t.onSelect(r)),n.append(i)}return n}function $c(t,e){let n=f("div","view-select-wrapper");n.append(Ee(Go[t.active],"view-icon"));let r=f("select","view-select");r.setAttribute("aria-label",e.label);for(let i of t.views){let o=L(f("option"),e[i]);o.value=i,o.selected=i===t.active,r.append(o)}return r.addEventListener("change",()=>t.onSelect(r.value)),n.append(r),n}var Fc={headerOf:new Map,infoOf:new Map};function ur(t,e){if(e.size===0)return Fc;let n=new Map;for(let o of t){let s=o.partOf?.id;if(!s)continue;let l=n.get(s);l?l.push(o):n.set(s,[o])}let r=new Map,i=new Map;for(let[o,s]of n){if(s.length<2)continue;let l=tt(s),c=l[0],m=c.partOf.type;if(!e.has(m))continue;let u=l.length;l.forEach((v,g)=>{r.set(v,c),i.set(v,{key:o,type:m,index:g+1,total:u,members:l})})}return{headerOf:r,infoOf:i}}var Xo={en:{loading:"Loading events\u2026",empty:"No upcoming events.",notFound:"Event not found in this feed.",errorPrefix:"Could not load events: ",online:"Online",onlineEvent:"Online event",free:"Free",addOnAmount:t=>`+${t}`,addOnNote:"Additional charge on top of the event's admission",updated:"Updated",event:"Event",when:"When",lastUpdate:"Last update",location:"Location",locationUnknown:"Venue not specified",onlineLinkUnknown:"No public link",onlineLinkUnknownHint:"The organizer may share the link privately, e.g. after registration.",organizer:"Organizer",notAvailable:"\u2014",attendance:{"in-person":"In person",online:"Online",hybrid:"Hybrid"},eligibility:{open:"Open to all","members-only":"Members only","approval-required":"Approval required",restricted:"Restricted"},cfp:"Call for Proposals",cfpCloses:t=>`Call for Proposals \u2014 closes ${t}`,close:"Close",eventDetails:"Event details",addToGoogle:"Add to Google Calendar",addToOutlook:"Add to Outlook",addToYahoo:"Add to Yahoo",downloadIcs:"Download ICS",addToCalendar:"Add to calendar",openEventPage:"Open event page",groupSeries:"Series",groupMultipart:"Multi-part",groupCount:t=>`${t} occurrences`,groupCounter:(t,e)=>`${t} of ${e}`,previousOccurrence:"Previous occurrence",nextOccurrence:"Next occurrence"},es:{loading:"Cargando eventos\u2026",empty:"No hay pr\xF3ximos eventos.",notFound:"Evento no encontrado en este feed.",errorPrefix:"No se pudieron cargar los eventos: ",online:"En l\xEDnea",onlineEvent:"Evento en l\xEDnea",free:"Gratis",addOnAmount:t=>`+${t}`,addOnNote:"Cargo adicional sobre la entrada del evento",updated:"Actualizado",event:"Evento",when:"Cu\xE1ndo",lastUpdate:"\xDAltima actualizaci\xF3n",location:"Lugar",locationUnknown:"Sede no especificada",onlineLinkUnknown:"Sin enlace p\xFAblico",onlineLinkUnknownHint:"El organizador podr\xEDa compartir el enlace de forma privada, por ejemplo tras inscribirte.",organizer:"Organizador",notAvailable:"\u2014",attendance:{"in-person":"Presencial",online:"En l\xEDnea",hybrid:"H\xEDbrido"},eligibility:{open:"Abierto a todos","members-only":"Solo miembros","approval-required":"Requiere aprobaci\xF3n",restricted:"Acceso restringido"},cfp:"Convocatoria de ponencias",cfpCloses:t=>`Convocatoria de ponencias \u2014 cierra ${t}`,close:"Cerrar",eventDetails:"Detalles del evento",addToGoogle:"A\xF1adir a Google Calendar",addToOutlook:"A\xF1adir a Outlook",addToYahoo:"A\xF1adir a Yahoo",downloadIcs:"Descargar ICS",addToCalendar:"A\xF1adir al calendario",openEventPage:"Abrir p\xE1gina del evento",groupSeries:"Serie",groupMultipart:"Multi-part",groupCount:t=>`${t} ocurrencias`,groupCounter:(t,e)=>`${t} de ${e}`,previousOccurrence:"Ocurrencia anterior",nextOccurrence:"Ocurrencia siguiente"}};function mr(t,e="event-description"){let n=f("div",e),r=O.parse(t,{async:!1});n.innerHTML=ko.sanitize(r);for(let i of n.querySelectorAll("a[href]"))i.setAttribute("target","_blank"),i.setAttribute("rel","noopener");return n}function Uc(t){return Ee({online:["M15 10l4.6-2.3A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.4.9L15 14","M3 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2"],"in-person":["M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0","M12 10h.01"],hybrid:["M4 5h9a2 2 0 0 1 2 2v5H2V7a2 2 0 0 1 2-2","M8 19h4","M10 12v7","M18 21s4-3.2 4-6a4 4 0 0 0-8 0c0 2.8 4 6 4 6","M18 15h.01"]}[t],"badge-icon")}function gt(t){return Ee({calendar:["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],"external-link":["M15 3h6v6","M10 14 21 3","M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"],edit:["M12 20h9","M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],trash:["M3 6h18","M8 6V4h8v2","M19 6l-1 14H6L5 6","M10 11v6","M14 11v6"],copy:["M8 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2","M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"],star:["M12 2l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.77 5.82 21 7 14.13 2 9.26l6.91-1L12 2"],check:["M20 6 9 17l-5-5"],bookmark:["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],plus:["M12 5v14","M5 12h14"],folder:["M4 4h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],collection:["M4 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2","M8 2v4","M16 2v4","M7 10h10","M7 14h7"]}[t],"action-icon")}function gr(t,e){let n=f("span",`badge attendance-badge attendance-${t}`);return n.append(Uc(t),document.createTextNode(e)),n}function br(t,e){let n=e.eligibility[t.type],r=t.url?f("a"):f("span");if(r.classList.add("badge","eligibility-badge"),t.url){let i=r;i.href=t.url,i.target="_blank",i.rel="noopener"}return r.textContent=n,t.note&&(r.title=t.note,r.setAttribute("aria-label",`${n}: ${t.note}`)),r}function vr(t,e){let n=f("a","badge cfp-badge");n.href=t.url,n.target="_blank",n.rel="noopener",n.textContent=e.cfp;let r=ft(t.closesAt,void 0);if(r){let i=e.cfpCloses(r);n.title=i,n.setAttribute("aria-label",i)}return n}function Hc(t,e){return t==="multipart"?e.groupMultipart:e.groupSeries}function Gc(t,e){let n=Hc(t.type,e),r=f("span","badge event-group-badge");return r.textContent=n,r.setAttribute("aria-label",`${n}, ${e.groupCount(t.total)}`),r}function wr(t,e){let n=Jo(t,e),r=t.locationLink??Qo(n),i=yr(t,e);if(!r){let s=L(f("span"),i);return Bc(t)&&(s.title=e.onlineLinkUnknownHint),s}let o=f("a");return o.href=r,o.target="_blank",o.rel="noopener",o.textContent=i,o}function Bc(t){return t.attendanceMode==="online"&&!t.locationLink&&(!t.location||t.location==="online")}function Jo(t,e){return t.location&&t.location!=="online"?t.location:t.attendanceMode==="online"?e.onlineLinkUnknown:e.locationUnknown}function yr(t,e){let n=Jo(t,e),r=t.locationLink??Qo(n);return Wc(r?It(r):n,e)}function Wc(t,e){return!t||t==="online"?e.online:t==="Online link"||t==="Online event"?e.onlineEvent:t}function Qo(t){if(t)try{let e=new URL(t);return e.protocol==="http:"||e.protocol==="https:"?t:void 0}catch{return}}function xr(t){let e=Dt(t.startDate);return e!==null&&e<Date.now()}function ea(t){if(!t.feed)return[];let e=t.sort==="none"?[...t.feed.events]:tt(t.feed.events);return t.eventId!==void 0?e.filter(n=>n.id===t.eventId):e.filter(n=>t.showPast||!xr(n))}function bt(t){return t.layout!=="cards"||t.groupEvents.size===0?{headerOf:new Map,infoOf:new Map}:ur(ea(t),t.groupEvents)}function kr(t){let e=ea(t);if(t.layout!=="cards"||t.groupEvents.size===0)return e.slice(0,t.limit);let{headerOf:n}=ur(e,t.groupEvents),r=new Set,i=[];for(let o of e){let s=n.get(o)??o;r.has(s)||(r.add(s),i.push(s))}return i.slice(0,t.limit)}function Wo(t,e){if(e)try{return new Intl.NumberFormat(void 0,{style:"currency",currency:e}).format(t)}catch{return`${t} ${e}`}return String(t)}function jc(t,e){if(t.amount!==void 0)return t.basis==="add-on-only"?e.addOnAmount(Wo(t.amount,t.currency)):t.amount===0?e.free:Wo(t.amount,t.currency)}function Er(t,e){let n=jc(t,e);if(n===void 0)return;let r=t.basis==="add-on-only"?e.addOnNote:void 0;if(!t.url){let o=L(f("span","price"),n);return r&&(o.title=r),o}let i=f("a","price");return i.href=t.url,i.target="_blank",i.rel="noopener",i.textContent=n,r&&(i.title=r),i}function jo(t,e){if(!t)return;let n=Pt(t),r=new Date(`${t}${e==="UTC"&&!n?"Z":""}`);return Number.isNaN(r.valueOf())?void 0:r}function Xt(t,e){let n=t.toISOString();return e?n.slice(0,10).replace(/-/g,""):n.replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z")}function qc(t){let e=new Date(t);return e.setUTCDate(e.getUTCDate()+1),e}function Vc(t){let e=jo(t.startDate,t.timezone);if(!e)return;let n=Pt(t.startDate),r=jo(n&&t.endDate?Ln(t.endDate,1):t.endDate,t.timezone)??(n?qc(e):e);return{start:e,end:r,dateOnly:n}}function ta(t){return t.description??""}function Kc(t,e,n){if(t==="link")return e.link;let r=Vc(e);if(!r)return;let i=Xt(r.start,r.dateOnly),o=Xt(r.end,r.dateOnly),s=ta(e),l=yr(e,n);if(t==="google-calendar"){let c=new URL("https://calendar.google.com/calendar/render");return c.searchParams.set("action","TEMPLATE"),c.searchParams.set("text",e.name),c.searchParams.set("dates",`${i}/${o}`),s&&c.searchParams.set("details",s),l&&c.searchParams.set("location",l),e.timezone&&c.searchParams.set("ctz",e.timezone),c.toString()}if(t==="outlook-calendar"){let c=new URL("https://outlook.live.com/calendar/0/action/compose");return c.searchParams.set("rru","addevent"),c.searchParams.set("subject",e.name),c.searchParams.set("startdt",r.start.toISOString()),c.searchParams.set("enddt",r.end.toISOString()),s&&c.searchParams.set("body",s),l&&c.searchParams.set("location",l),c.toString()}if(t==="yahoo-calendar"){let c=new URL("https://calendar.yahoo.com/");return c.searchParams.set("v","60"),c.searchParams.set("title",e.name),c.searchParams.set("st",i),c.searchParams.set("et",o),s&&c.searchParams.set("desc",s),l&&c.searchParams.set("in_loc",l),c.toString()}return`data:text/calendar;charset=utf-8,${encodeURIComponent(Zc(e,r,n))}`}function ht(t){return t.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}function Zc(t,e,n){let r=c=>Xt(c,e.dateOnly),i=e.dateOnly?";VALUE=DATE":"",o=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//OpenTechEvents//ote-events//EN","BEGIN:VEVENT",`UID:${ht(t.link??t.name)}`,`DTSTAMP:${Xt(new Date,!1)}`,`DTSTART${i}:${r(e.start)}`,`DTEND${i}:${r(e.end)}`,`SUMMARY:${ht(t.name)}`],s=ta(t),l=yr(t,n);return s&&o.push(`DESCRIPTION:${ht(s)}`),l&&o.push(`LOCATION:${ht(l)}`),t.link&&o.push(`URL:${ht(t.link)}`),o.push("END:VEVENT","END:VCALENDAR"),o.join(`\r
`)}function Yc(t){if(!t)return null;let n=new Date(t).valueOf();return Number.isNaN(n)?null:n}function Xc(t){let e=Yc(t);if(e===null)return t;let n=Math.round((e-Date.now())/1e3),r=Math.abs(n),i=[["year",31536e3,"y"],["month",2592e3,"mo"],["week",604800,"w"],["day",86400,"d"],["hour",3600,"h"],["minute",60,"m"]];for(let[,o,s]of i)if(r>=o)return`${Math.max(1,Math.round(r/o))}${s}`;return"now"}function ft(t,e){if(!t)return;let n=/^\d{4}-\d{2}-\d{2}$/.test(t),r=new Date(`${t}${e==="UTC"&&!n?"Z":""}`);if(Number.isNaN(r.valueOf()))return e?`${t} (${e})`:t;let i=n?{weekday:"short",month:"short",day:"numeric",year:"numeric"}:{weekday:"short",month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"},o=new Intl.DateTimeFormat(void 0,i).format(r);return e&&!n?`${o} (${e})`:o}function qo(t){if(!t)return;let e=/^\d{4}-\d{2}-\d{2}$/.test(t),n=new Date(t);if(Number.isNaN(n.valueOf()))return t;let r=e?{month:"short",day:"numeric"}:{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"};return new Intl.DateTimeFormat(void 0,r).format(n)}function Jc(t){if(!t)return;let e=new Date(t);return Number.isNaN(e.valueOf())?t:new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric"}).format(e)}function Qc(t,e){if(!t||!e)return!1;let n=new Date(t),r=new Date(e);return Number.isNaN(n.valueOf())||Number.isNaN(r.valueOf())?!1:n.getFullYear()===r.getFullYear()&&n.getMonth()===r.getMonth()&&n.getDate()===r.getDate()}function Vo(t){if(!t||/^\d{4}-\d{2}-\d{2}$/.test(t))return;let e=new Date(t);if(!Number.isNaN(e.valueOf()))return new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).format(e)}function Tr(t){let e=qo(t.startDate),n=qo(t.endDate);if(e&&t.endDate&&Qc(t.startDate,t.endDate)){let r=Jc(t.startDate),i=Vo(t.startDate),o=Vo(t.endDate);if(r&&i&&o)return`${r}, ${i}-${o}`}return e&&n&&n!==e?`${e} \u2013 ${n}`:e??t.dateLabel}function Ar(t){if(t.dateLabel)return t.dateLabel;let e=ft(t.startDate,t.timezone),n=ft(t.endDate,t.timezone);return e&&n?`${e} to ${n}`:e}function ed(t){let e=Tr(t),n=Ar(t)??nt(t),r=e??n;if(!r)return;let i=L(f("p","event-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function td(t){let e=Tr(t),n=Ar(t)??nt(t),r=e??n;if(!r)return;let i=L(f("span","event-detail-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function Jt(t){if(t.image)return/^http:\/\//i.test(t.image.url)&&globalThis.location?.protocol==="https:"?void 0:t.image}function Sr(t,e){let n=Jt(t);if(!n)return;let r=f("img","event-image");return r.src=n.url,r.alt=n.alt??t.name,r.loading="lazy",r.addEventListener("error",()=>{r.replaceWith(na(e))}),r}function na(t){if(t){let e=f("img","event-image event-image-placeholder");return e.src=t,e.alt="",e.loading="lazy",e.addEventListener("error",()=>e.replaceWith(f("div","event-image event-image-placeholder"))),e}return f("div","event-image event-image-placeholder")}function nd(t,e,n,r){let i=f("li","event");xr(t)&&i.classList.add("event-past"),_r(i,t,e),rd(i,t,e);let o=r?.infoOf.get(t);o&&(i.classList.add("event-stacked"),i.append(Gc(o,n))),e.previewFields.has("image")&&i.append(Sr(t,e.placeholderImage)??na(e.placeholderImage));let s=f("div","event-body");i.append(s);let l=f("h3","event-title");if(t.link&&e.eventClick==="link"){let u=f("a");u.href=t.link,u.target="_blank",u.rel="noopener",u.textContent=t.name,l.append(u)}else l.textContent=t.name;if(s.append(l),e.previewFields.has("when")){let u=ed(t);u&&s.append(u)}let c=f("div","event-badges");if(e.previewFields.has("attendance")&&t.attendanceMode&&c.append(gr(t.attendanceMode,n.attendance[t.attendanceMode])),e.previewFields.has("price")&&t.price){let u=Er(t.price,n);u&&c.append(u)}e.previewFields.has("eligibility")&&t.eligibility&&c.append(br(t.eligibility,n)),e.previewFields.has("cfp")&&t.cfp&&c.append(vr(t.cfp,n)),Lr(c,t,e);let m=f("div","event-meta");if(c.children.length>0&&m.append(c),e.previewFields.has("location")){let u=f("p","event-location");u.append(wr(t,n)),m.append(u)}if(m.children.length>0&&s.append(m),e.previewFields.has("organizer")&&t.organizerName&&s.append(L(f("p","event-organizer"),t.organizerName)),e.previewFields.has("description")){let u=Sn(t.description,220);u&&s.append(mr(u))}if(e.previewFields.has("tags")&&t.tags&&t.tags.length>0){let u=f("ul","tags");for(let v of t.tags)u.append(L(f("li","tag"),v));s.append(u)}return cd(s,t,n,e),i}function pr(t,e){return t.details?.find(n=>n.label===e)?.value}var ra=new Set(["ID","Source","Image","Updated"]);function rd(t,e,n){n.eventClick!=="none"&&(t.classList.add("event-clickable"),t.tabIndex=0,t.addEventListener("click",r=>{let i=r.target;i instanceof Element&&i.closest("a, button, summary")||Ko(e,n)}),t.addEventListener("keydown",r=>{r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),Ko(e,n))}))}function Ko(t,e){e.onEventOpen?.(t),e.eventClick==="link"&&t.link&&window.open(t.link,"_blank","noopener")}function ze(t,e,n){n&&t.append(L(f("dt"),e),L(f("dd"),n))}function hr(t,e,n){if(!n)return;let r=f("dd");r.append(n),t.append(L(f("dt"),e),r)}function id(t,e){let n=f("span",`event-header-icon ${t}`);return n.title=e,n.setAttribute("aria-label",e),n}function od(t,e,n){let r=f("li","event event-row");xr(t)&&r.classList.add("event-past"),_r(r,t,n);let i=f("details","event-accordion");r.append(i);let o=f("summary","event-summary");i.append(o);let s=f("span","event-summary-title");s.textContent=t.name,o.append(s);let l=Ar(t)??nt(t),c=Tr(t)??l;o.append(L(f("span","event-summary-when"),c||e.notAvailable)),o.append(L(f("span","event-summary-updated"),Xc(t.updatedAt??pr(t,"Updated"))??e.notAvailable));let m=f("div","event-details"),u=n.detailFields.has("image")&&!!Jt(t),v=t.description?.trim().length??0;!u&&v>0&&v<=180&&m.classList.add("event-details-compact"),i.append(m);let g=f("div","event-details-content"),y=f("div","event-details-main"),T=f("aside","event-details-aside");if(g.append(y,T),m.append(g),u){let S=Sr(t,n.placeholderImage);S&&T.append(S)}let E=f("div","event-badges");if(n.detailFields.has("attendance")&&t.attendanceMode&&E.append(gr(t.attendanceMode,e.attendance[t.attendanceMode])),n.detailFields.has("price")&&t.price){let S=Er(t.price,e);S&&E.append(S)}n.detailFields.has("eligibility")&&t.eligibility&&E.append(br(t.eligibility,e)),n.detailFields.has("cfp")&&t.cfp&&E.append(vr(t.cfp,e)),Lr(E,t,n),E.children.length>0&&T.append(E),n.detailFields.has("description")&&t.description&&y.append(mr(t.description));let A=f("dl","event-detail-list");n.detailFields.has("when")&&ze(A,e.when,l),n.detailFields.has("location")&&hr(A,e.location,wr(t,e)),n.detailFields.has("organizer")&&ze(A,e.organizer,t.organizerName),ze(A,e.updated,ft(t.updatedAt??pr(t,"Updated"),void 0));for(let S of t.details??[])ra.has(S.label)||ze(A,S.label,S.value);if(A.children.length>0&&T.append(A),n.detailFields.has("tags")&&t.tags&&t.tags.length>0){let S=f("ul","tags");for(let B of t.tags)S.append(L(f("li","tag"),B));y.append(S)}return la(m,t,e,n),dd(r,t,e,n),r}function Zo(t,e){return t==="google-calendar"?e.addToGoogle:t==="outlook-calendar"?e.addToOutlook:t==="yahoo-calendar"?e.addToYahoo:t==="ics"?e.downloadIcs:e.openEventPage}var Qt=new Set(["google-calendar","outlook-calendar","yahoo-calendar","ics"]);function ad(t){return typeof t!="string"&&"type"in t}function sd(t){return typeof t!="string"&&"id"in t}function mt(t){return typeof t=="string"?t:t.type}function ia(t,e){return!t.layouts||t.layouts.includes(e)}function oa(t,e){let n=t.placement??"detail";return n===e||n==="both"}function ld(t,e,n){return typeof t=="string"?e==="detail":oa(t,e)&&ia(t,n)}function aa(t,e,n){return ua(t,e).filter(r=>(typeof r=="string"||ad(r))&&ld(r,n,t.layout))}function sa(t,e,n){return ua(t,e).filter(r=>sd(r)&&oa(r,n)&&ia(r,t.layout))}function en(t,e,n,r,i){let o=mt(e),s=Kc(o,n,r);if(!s)return;let l=f("a");l.href=s,l.target=o==="ics"?"_self":"_blank",l.rel="noopener",o==="ics"&&l.setAttribute("download","event.ics"),o==="link"?l.append(gt("external-link"),document.createTextNode(Zo(o,r))):l.textContent=Zo(o,r),l.addEventListener("click",()=>i.onEventAction?.(e,n)),t.append(l)}function la(t,e,n,r){let i=f("div","event-actions"),o=aa(r,e,"detail"),s=o.filter(l=>Qt.has(mt(l)));if(s.length>0){let l=f("details","event-action-menu"),c=f("summary","event-action-menu-trigger");c.append(gt("calendar"),document.createTextNode(n.addToCalendar)),l.append(c);let m=f("div","event-action-menu-items");for(let u of s)en(m,u,e,n,r);m.children.length>0&&(l.append(m),i.append(l))}for(let l of o)Qt.has(mt(l))||en(i,l,e,n,r);for(let l of sa(r,e,"detail"))i.append(da(l,e,r));i.children.length>0&&t.append(i)}function ca(t,e,n){let r=aa(n,t,"preview"),i=sa(n,t,"preview");if(r.length===0&&i.length===0)return;let o=f("div","event-actions event-preview-actions"),s=r.filter(l=>Qt.has(mt(l)));if(s.length>0){let l=f("details","event-action-menu"),c=f("summary","event-action-menu-trigger");c.append(gt("calendar"),document.createTextNode(e.addToCalendar)),l.append(c);let m=f("div","event-action-menu-items");for(let u of s)en(m,u,t,e,n);m.children.length>0&&(l.append(m),o.append(l))}for(let l of r)Qt.has(mt(l))||en(o,l,t,e,n);for(let l of i)o.append(da(l,t,n));return o}function cd(t,e,n,r){let i=ca(e,n,r);i&&t.append(i)}function dd(t,e,n,r){let i=ca(e,n,r);i&&(i.classList.add("event-row-actions"),t.append(i))}function da(t,e,n){let r=f("button");return r.type="button",r.classList.add("event-custom-action"),t.variant==="danger"&&r.classList.add("event-action-danger"),t.pressed!==void 0&&r.setAttribute("aria-pressed",String(t.pressed)),t.icon?r.append(gt(t.icon),document.createTextNode(t.label)):r.textContent=t.label,r.addEventListener("click",()=>{n.onEventAction?.(t,e),t.onClick(e,tn(n,e))}),r}function tn(t,e){let n=t.eventContext?.(e)??{previewEvent:e,index:t.feed?.events.indexOf(e)??-1},r=bt(t).infoOf.get(e);return r?{...n,group:r}:n}function ua(t,e){return typeof t.eventActions=="function"?t.eventActions(tn(t,e)):t.eventActions}function ud(t){return t?(Array.isArray(t)?t:t.split(/\s+/)).map(n=>n.trim()).filter(Boolean):[]}function _r(t,e,n){for(let r of ud(n.eventClassName?.(tn(n,e))))t.classList.add(r)}function Lr(t,e,n){let r=n.eventBadges?.(tn(n,e))??[];for(let i of r){if(typeof i=="string"){let s=f("span","badge event-custom-badge event-custom-badge-default");s.title=i,s.append(L(f("span","event-custom-badge-label"),i)),t.append(s);continue}let o=f("span",`badge event-custom-badge event-custom-badge-${i.tone??"default"}`);o.title=i.title??i.label,i.icon&&o.append(gt(i.icon)),o.append(L(f("span","event-custom-badge-label"),i.label)),t.append(o)}}function Yo(t){return Ee([t==="left"?"M15 18l-6-6 6-6":"M9 18l6-6-6-6"],"event-modal-nav-icon")}function pd(t,e,n){let r=f("div","event-modal-nav"),i=f("button","event-modal-nav-button");i.type="button",i.setAttribute("aria-label",e.previousOccurrence),i.title=e.previousOccurrence,i.append(Yo("left"));let o=t.members[t.index-2];i.disabled=!o,i.addEventListener("click",()=>{o&&n.onEventOpen?.(o)});let s=f("span","event-modal-nav-counter");s.setAttribute("aria-live","polite"),s.textContent=e.groupCounter(t.index,t.total);let l=f("button","event-modal-nav-button");l.type="button",l.setAttribute("aria-label",e.nextOccurrence),l.title=e.nextOccurrence,l.append(Yo("right"));let c=t.members[t.index];return l.disabled=!c,l.addEventListener("click",()=>{c&&n.onEventOpen?.(c)}),r.append(i,s,l),r}function fr(t,e,n,r){let i=f("div","event-modal-backdrop");i.tabIndex=-1,i.addEventListener("click",E=>{E.target===i&&n.onEventClose?.()}),i.addEventListener("keydown",E=>{E.key==="Escape"&&n.onEventClose?.()});let o=f("section","event-modal");_r(o,t,n);let s=t.description?.trim().length??0;!Jt(t)&&s>0&&s<=180&&o.classList.add("event-modal-compact"),o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-label",e.eventDetails),i.append(o);let l=f("div","event-modal-header");l.append(L(f("h2","event-modal-title"),t.name));let c=f("button","event-modal-close");c.type="button",c.textContent="\xD7",c.title=e.close,c.setAttribute("aria-label",e.close),c.addEventListener("click",()=>n.onEventClose?.()),l.append(c),o.append(l);let m=r?.infoOf.get(t),u=f("div","event-modal-content"),v=f("div","event-modal-main"),g=f("aside","event-modal-aside");if(u.append(v,g),o.append(u),n.detailFields.has("image")&&Jt(t)){let E=Sr(t,n.placeholderImage);E&&g.append(E)}let y=f("div","event-badges");if(n.detailFields.has("attendance")&&t.attendanceMode&&y.append(gr(t.attendanceMode,e.attendance[t.attendanceMode])),n.detailFields.has("price")&&t.price){let E=Er(t.price,e);E&&y.append(E)}n.detailFields.has("eligibility")&&t.eligibility&&y.append(br(t.eligibility,e)),n.detailFields.has("cfp")&&t.cfp&&y.append(vr(t.cfp,e)),Lr(y,t,n),y.children.length>0&&g.append(y),n.detailFields.has("description")&&t.description&&v.append(mr(t.description));let T=f("dl","event-detail-list");n.detailFields.has("when")&&hr(T,e.when,td(t)),m&&m.total>1&&T.append(pd(m,e,n)),n.detailFields.has("location")&&hr(T,e.location,wr(t,e)),n.detailFields.has("organizer")&&ze(T,e.organizer,t.organizerName),ze(T,e.updated,ft(t.updatedAt??pr(t,"Updated"),void 0));for(let E of t.details??[])ra.has(E.label)||ze(T,E.label,E.value);if(T.children.length>0&&g.append(T),n.detailFields.has("tags")&&t.tags&&t.tags.length>0){let E=f("ul","tags");for(let A of t.tags)E.append(L(f("li","tag"),A));v.append(E)}return la(o,t,e,n),queueMicrotask(()=>c.focus()),i}function pa(t,e){if(t.querySelector(".event-modal-backdrop")?.remove(),!e.selectedEvent)return;let n=Xo[e.lang],r=e.layout==="calendar"?void 0:bt(e);t.append(fr(e.selectedEvent,n,e,r))}function hd(t){return[t.startDate,t.endDate].some(e=>typeof e=="string"&&e.includes("T"))}function Cr(t){let e=t.onViewSelect;return Bo({views:e?t.views:[],active:t.layout,lang:t.lang,density:t.headerDensity,...t.calendarNav?{nav:t.calendarNav}:{},onSelect:n=>e?.(n)})}function ha(t,e){t.replaceChildren();let n=Xo[e.lang];if(e.status==="idle"||e.status==="loading"){t.append(L(f("p","message"),n.loading));return}if(e.status==="error"){t.append(L(f("p","message error"),`${n.errorPrefix}${e.errorMessage}`));return}let r=kr(e),i=Ho({mode:e.footer,lang:e.lang,theme:e.theme,meta:e.footerMeta,subscribeLayout:e.footerSubscribeLayout,mark:e.footerMark,hasTimes:r.some(hd)});if(r.length===0){let m=e.emptyMessage??(e.eventId!==void 0?n.notFound:n.empty);t.append(L(f("p","message"),m)),i&&t.append(i);return}let o=Cr(e),s=i||o?f("div","events-scroll"):t;if(o&&t.append(o),e.layout==="calendar"){s.append(L(f("div","calendar-host"),n.loading)),s!==t&&t.append(s),i&&t.append(i),e.selectedEvent&&t.append(fr(e.selectedEvent,n,e));return}let l=bt(e),c=f("ul",`events layout-${e.layout}`);if(e.layout==="list"){let m=f("li","event-list-header");m.append(L(f("span"),n.event),L(f("span"),n.when),id("icon-updated",n.lastUpdate)),c.append(m)}for(let m of r)c.append(e.layout==="list"?od(m,n,e):nd(m,e,n,l));s.append(c),s!==t&&t.append(s),i&&t.append(i),e.selectedEvent&&t.append(fr(e.selectedEvent,n,e,l))}var fa=`
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

/*
 * height: 100% is what lets a host size the widget with plain CSS -
 * ote-events { height: 400px }, or a flex/grid parent handing it a track -
 * and not just with the max-height attribute. Before it, the element obeyed
 * while its contents did not: the box took the height and the content kept
 * its own, so it either left dead space inside or spilled out of the
 * element (measured: a 400px element with 529px of calendar overflowing).
 *
 * It is safe precisely because it is a percentage. Against an auto-height
 * host - every embed that sets no height, which is most of them - it
 * resolves to auto and the widget lays out exactly as it did before. Only
 * a host that gives a definite height sees any change, which is the host
 * that asked for one.
 */
.ote-events {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
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

/*
 * The max-height height budget (#168). Everything here is gated on
 * [data-bounded], set by element.ts only when the attribute parses, so an
 * embed without it lays out exactly as it did before.
 *
 * The widget becomes a flex column that is at most --ote-max-height tall,
 * and the *event area* is what scrolls - not the whole component. That
 * distinction is the whole point: the host-side workaround this replaces
 * wrapped <ote-events> in its own overflow container, which scrolled the
 * widget from the outside and so carried the calendar's own sticky weekday
 * header away with the content. Scrolling an inner element leaves the
 * headers a scrollport to pin against.
 *
 * No overflow on .ote-events itself except for cards, deliberately: the
 * detail modal is appended here as a sibling of the event area (render.ts),
 * and while a position: fixed backdrop is out of flow and survives either
 * way (verified in Chrome: backdrop height equals viewport height, top 0),
 * there is no reason to clip a box whose children handle their own overflow.
 */
/* The attribute is only the budget itself now; the fitting is unconditional. */
.ote-events[data-bounded] {
  max-height: var(--ote-max-height);
}

/* min-height: 0 is what lets a flex item shrink below its content and scroll. */
.ote-events[data-layout="list"] ul.events,
.ote-events[data-layout="calendar"] ul.events {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/*
 * layout="cards" scrolls the container instead of the event area, which is
 * the one place this breaks symmetry with the other two layouts.
 *
 * The reason is that a grid given a definite height sizes its implicit auto
 * rows against that height rather than against their content. Making the
 * grid the flex item that absorbs the budget squashed every card to ~85px -
 * verified in Chrome against an unbounded control rendering the same feed at
 * 297px, with .event's own overflow: hidden hiding everything below the
 * placeholder image, so the cards looked merely empty rather than clipped.
 * align-content: start does not prevent it. Keeping the grid at flex: none
 * leaves its rows content-sized, and the overflow becomes the container's to
 * scroll. Cards have no sticky header, so nothing is lost by scrolling the
 * outer element here - which is exactly why list and calendar must not.
 *
 * The padding is room for .event-stacked's box-shadow (group-events), which
 * reaches about 10px: the 1rem grid gap absorbs it between cards, but the
 * rightmost column and the last row sit flush against the scrollport's
 * edge, which clips. Nothing needed it before because an unbounded grid
 * never clipped anything. It is symmetric left/right so the grid does not
 * sit visibly off-centre against the scrollbar.
 */
.ote-events[data-layout="cards"] {
  overflow-y: auto;
}

.ote-events[data-layout="cards"] ul.events {
  flex: none;
  padding: 0 0.75rem 0.75rem;
}

/*
 * The event area as its own scrollport, mounted only when there is a
 * footer (#68) \u2014 render.ts explains why its presence is conditional.
 *
 * It exists for layout="cards" and for nothing else: cards scroll
 * .ote-events itself (see above), so a footer appended inside it would
 * scroll away with the grid, and in a bounded widget the subscribe badges
 * would sit below the fold of a box the host deliberately shortened. With
 * the wrapper absorbing the budget, .ote-events has nothing left to
 * scroll and the footer stays put.
 *
 * list and calendar need nothing new: the rules above reach ul.events
 * and .calendar-host as descendants, so the row list and the month grid
 * still absorb the budget themselves, one level deeper. The footer is the
 * flex sibling that the budget is spent on before they see it, which is
 * what "subtracted from the budget, not drawn over the last row" means.
 */
.events-scroll {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.ote-events[data-layout="cards"] > .events-scroll {
  overflow-y: auto;
}

/*
 * layout="list" sets overflow: hidden to clip its own border radius. The
 * longhand above wins on overflow-y only, which is what we want: the rows
 * scroll vertically and the rounded corners still clip horizontally.
 *
 * The column header is already opaque (--ote-accent-soft), so pinning it
 * needs no extra background - and it earns its place on the 460-event feed
 * this attribute exists for, where "When" scrolling out of sight leaves
 * three unlabelled columns.
 */
.ote-events[data-layout="list"] ul.events.layout-list .event-list-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
}

/*
 * layout="calendar". The library's root (.ec) takes an inline height: 100%
 * from the height option (calendar-layout.ts#bounded), so .calendar-host
 * has to hand it a definite height to resolve against.
 */
.ote-events[data-layout="calendar"] .calendar-host {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.ote-events[data-layout="calendar"] .calendar-host .ec {
  flex: 1;
  min-height: 0;
}

/*
 * .ec-main is the library's scroll container and holds its sticky .ec-header,
 * but dayMaxEvents:true adds .ec-uniform, which sets overflow: hidden.
 *
 * A bounded calendar normally has nothing to scroll: calendar-layout.ts
 * drops the row pin so the weeks share the budget and the month fits. This
 * is the safety valve for the budgets where that is not enough - small
 * enough that even the day headers do not fit their share - where the
 * library would otherwise clip them silently with no way to reach them.
 *
 * One class more specific than the library's rule, same technique (and same
 * reason) as the row-height pin below - never !important.
 */
.ote-events[data-layout="calendar"] .calendar-host .ec-day-grid .ec-main.ec-uniform {
  overflow: auto;
}

/*
 * Empty weeks collapse under a budget, but only with max-per-day="off".
 *
 * The library floors every day cell at 5em (.ec-day-grid .ec-day), and
 * removes that floor only in uniform mode. So the non-uniform mode - the one
 * that actually sizes each week to its own content - still gave every empty
 * week 80px. Relaxing the floor to roughly the height of the date number
 * lets a week with no events shrink to it: measured on a real 25-event feed
 * at max-height="400px", the month went from six uniform 80px rows that
 * scrolled (511px) to 60/37/37/37/60/36 that does not scroll at all, with
 * the widget settling at 354px inside its 400px budget.
 *
 * Only while bounded, because unbounded there is no height to reclaim and
 * 5em is a better-looking month grid. Only with max-per-day="off", because
 * uniform mode already drops the floor itself - and the two cannot be
 * combined: a capped row needs a fixed height to cap against, while an auto
 * row grows to its content, so nothing ever overflows and the "+N more"
 * popover never triggers. That is the trade max-per-day="off" names.
 */
.ote-events[data-layout="calendar"] .calendar-host .ec-day-grid .ec-main:not(.ec-uniform) .ec-day {
  min-block-size: 2.2em;
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

/*
 * max-per-day (see calendar-layout.ts#dayRowHeight). The library's
 * dayMaxEvents:true adds .ec-uniform, which sizes rows minmax(0, 1fr) \u2014 and
 * 1fr tracks in a grid of indefinite height grow to the tallest row's
 * content, so a 15-event day would make every week 15 events tall and hide
 * nothing. Pinning the row height is what actually caps a day and sends the
 * rest to the "+N more" popover.
 *
 * It has to be a rule rather than an inline style on the host: .ec-main is
 * the library's own element and sets --ec-row-height on itself, which beats
 * anything inherited. This stylesheet is injected before the library's in
 * the shadow root, so the selector is deliberately one class more specific.
 */
.calendar-host[data-day-rows] .ec-day-grid .ec-main.ec-uniform {
  --ec-row-height: var(--ote-calendar-row-height);
}

/*
 * density="compact" (#170). The comfortable metrics give a day cell a 41px
 * header and a 27px chip, so showing one event costs ~68px; Google
 * Calendar's embed does the same job in ~36px (measured: 20px date box,
 * 16px chip), which is why its month fits a small container with its events
 * still readable while ours fell back to "+N more" links.
 *
 * These three rules are the whole difference, and the numbers they produce
 * are measured in Chrome rather than reasoned about - CALENDAR_DENSITY in
 * calendar-layout.ts carries them, because the max-per-day row maths has to
 * agree with what the cell actually renders. Re-measure both together.
 */
.calendar-host[data-density="compact"] .ec-day-grid.ec-month-view .ec-day-head {
  padding: 0.12rem 0.25rem;
  font-size: 0.82em;
}

.calendar-host[data-density="compact"] .ec-event {
  padding: 0 2px;
  font-size: 0.76em;
  line-height: 1.35;
}

.calendar-host[data-density="compact"] .ec-col-head {
  padding: 0.15rem 0.2rem;
  font-size: 0.72em;
}

.calendar-host[data-density="compact"] .ec-day-foot {
  padding: 0 0.25rem 0.1rem;
  font-size: 0.72em;
}

/*
 * Weeks sized to their own content (calendar-layout.ts#weekRowTracks).
 *
 * This is the rule that lets a month collapse its empty weeks while keeping
 * max-per-day. --ec-row-height cannot: it is one value for every row, so
 * content-sizing it grows each cell to its events and the "+N more" popover
 * stops firing. A track list sets each week independently, and the library
 * still hides whatever does not fit a given cell.
 *
 * One class more specific than the library's own grid-template-rows, and on
 * our container rather than its element, so its re-render cannot drop it.
 */
.calendar-host[data-week-rows] .ec-day-grid .ec-main {
  grid-template-rows: var(--ote-calendar-week-rows);
}

/*
 * The events the day cap hides are still laid out - the library hides them
 * with visibility: hidden, which leaves them occupying space - so they
 * inflate .ec-main's scrollHeight far past the grid. Harmless while
 * .ec-main is overflow: hidden, but a bounded calendar turns that to auto,
 * and then a month that fits its budget still grew a 17px scrollbar that
 * scrolled 400px into blank space (measured: scrollHeight 707 against a
 * 297px grid).
 *
 * Clipping the event layer to the grid fixes both halves: a month that fits
 * has no scrollbar at all, and one that does not scrolls through its actual
 * weeks. The chips and their "+N more" links are untouched.
 */
.calendar-host[data-week-rows] .ec-day-grid .ec-body {
  overflow: hidden;
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

/*
 * The header (#183): the chrome row above the events, in every layout.
 *
 * Google Calendar's order, because it is the one a visitor arrives with:
 * Today and the month arrows on the left, the title beside them, the view
 * control floating right. Same flex: none as .footer and for the same
 * reason \u2014 it is chrome, so it keeps its height and the event area absorbs
 * what is left of the budget.
 *
 * The library's own toolbar is switched off (calendar-layout.ts), so this
 * row is the only one: the two used to stack, and together they cost about
 * 76px of a budget that is often 300.
 *
 * No wrapping, deliberately: the row reports its overflow through
 * scrollWidth and element.ts steps the density down instead (see
 * #fitHeader). A row that wrapped would always fit, and so would never ask
 * for the smaller control that actually belongs at that width.
 */
.ote-header {
  display: flex;
  flex: none;
  align-items: center;
  gap: 0.75rem;
  margin-block-end: 0.75rem;
  min-width: 0;
  /* Past the last density step there is nothing left to drop, and a row
     that spills into the events is worse than one that is cut off. */
  overflow: hidden;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
}

/*
 * The month is the one thing here allowed to take the room, and the one
 * thing that may truncate \u2014 but not to nothing.
 *
 * The min-width is what makes the row's overflow a usable signal: without
 * it the title shrinks to zero and the header always "fits", so
 * element.ts#fitHeader would never see a reason to drop anything.
 *
 * 7.5rem is "a month and a year", measured: at 4.5rem the labels survived
 * down to a 360px widget while "November 2026" was already cut to
 * "Novemb\u2026" \u2014 the wrong thing given up first. The floor buys the month its
 * room and makes the view labels pay for it, which is the order a visitor
 * would choose.
 */
.header-title {
  flex: 0 1 auto;
  min-width: 7.5rem;
  margin-inline-start: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ote-text);
}

.header-today,
.header-arrow,
.view-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border: 1px solid transparent;
  background: transparent;
  color: var(--ote-muted);
  font: inherit;
  font-size: 0.8125rem;
  line-height: 1.2;
  cursor: pointer;
}

.header-today {
  padding: 0.3rem 0.6rem;
  border-color: var(--ote-border);
  border-radius: var(--ote-radius);
  white-space: nowrap;
}

.header-arrow {
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border-radius: 50%;
}

.header-today:hover:not(:disabled),
.header-arrow:hover:not(:disabled) {
  background: var(--ote-surface);
  color: var(--ote-text);
}

.header-today:focus-visible,
.header-arrow:focus-visible,
.view-button:focus-visible,
.view-select:focus-visible {
  color: var(--ote-text);
  outline: 2px solid var(--ote-accent);
  outline-offset: 1px;
}

/* Disabled means "you are already here" (Today) or "the calendar has not
   reported a month yet" (the arrows) \u2014 both are states, not failures, so
   they fade rather than look broken. */
.header-today:disabled,
.header-arrow:disabled {
  opacity: 0.45;
  cursor: default;
}

.header-arrow-icon {
  width: 1rem;
  height: 1rem;
}

/*
 * The view control. The segmented group is the playground's own
 * .segmented-toolbar (apps/embed/styles.css) ported to the --ote-* tokens,
 * so the control a publisher configures and the one their visitor clicks
 * are visibly the same control.
 */
/* margin-inline-start: auto, not justify-content on the row: in list and
   cards there is no nav beside it, and space-between alone would swing the
   control to the left exactly when the visitor switched views. Measured:
   it moved 513px. */
.view-switcher,
.view-select-wrapper {
  margin-inline-start: auto;
}

.view-switcher {
  display: inline-flex;
  flex: none;
  gap: 0.25rem;
  padding: 0.2rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
}

.view-button {
  padding: 0.3rem 0.55rem;
  border-radius: calc(var(--ote-radius) - 2px);
}

.view-button:hover {
  color: var(--ote-text);
  border-color: var(--ote-border);
}

.view-button[aria-pressed="true"] {
  background: var(--ote-accent-soft);
  border-color: var(--ote-border);
  color: var(--ote-accent);
  font-weight: 600;
}

.view-icon {
  display: block;
  width: 0.875rem;
  height: 0.875rem;
  flex: none;
}

/*
 * At the last step there is nothing left to drop, so the floor goes too:
 * the row clips from its end (overflow: hidden above), and what sits at
 * the end is the view control \u2014 the one thing a visitor at 320px still
 * needs. Measured: the nav wanted 35px more at 320px and 75px at 280px,
 * all of it the title's floor.
 */
.ote-events[data-header="menu"] .header-title {
  min-width: 0;
}

/*
 * data-header is written by element.ts after measuring the row, because a
 * media query inside a shadow root follows the viewport and this widget
 * lives in a column (the #169 mistake, re-made by this row once and
 * removed again). "icons" keeps every label in the DOM and only hides it
 * visually, so each button keeps its accessible name; clip rather than
 * display: none is what makes that true.
 */
.ote-events[data-header="icons"] .view-button-label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.ote-events[data-header="icons"] .view-button {
  padding: 0.3rem 0.45rem;
}

/*
 * The last step down is a native select, not a hand-built menu: the
 * platform renders its popup in the top layer with its own keyboard and
 * touch behaviour, and there is no "clicked outside" to detect \u2014 which is
 * the one thing a menu inside a shadow root gets wrong (see
 * suppressRetargetedOutsideEvents in calendar-layout.ts).
 */
.view-select-wrapper {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.4rem;
  border: 1px solid var(--ote-border);
  border-radius: var(--ote-radius);
  color: var(--ote-accent);
}

.view-select {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

/*
 * The library's toolbar is configured empty (calendar-layout.ts) but still
 * renders its container, and an empty 40px strip above the grid is exactly
 * the room this header set out to give back.
 */
.calendar-host .ec-toolbar {
  display: none;
}

/*
 * The footer (#68): feed name and time zone on one side, <ote-subscribe>
 * and the OTE mark on the other.
 *
 * flex: none is load-bearing \u2014 it is chrome, so it keeps its height and
 * the event area absorbs the budget. No background, for the same reason
 * :host has none: the strip has to sit on whatever the host page is
 * painted with, and only its top border separates it from the events.
 */
.footer {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem 1rem;
  margin-block-start: 0.75rem;
  padding-block-start: 0.6rem;
  border-block-start: 1px solid var(--ote-border);
  font-size: 0.8125rem;
  color: var(--ote-muted);
}

/*
 * Stacked, not inline: the name and the zone answer different questions
 * ("whose feed is this" / "whose clock are these times on"), and side by
 * side at a typical embed width the zone reads as part of the name. Two
 * short lines also cost less height than one line that wraps \u2014 measured at
 * 360px wide, where the inline version took three lines.
 */
.footer-meta {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  min-width: 0;
}

.footer-zone {
  font-size: 0.75rem;
}

/*
 * The name truncates rather than pushing the actions onto a third row:
 * with flex: 1 1 auto on .footer-meta above, a long title shrinks and
 * ellipsises, keeping the strip two lines at widths where it used to be
 * three. The full title stays reachable in the tooltip.
 */
.footer-feed {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
  color: var(--ote-text);
}

a.footer-feed {
  color: var(--ote-accent);
  text-decoration: none;
}

a.footer-feed:hover,
a.footer-feed:focus-visible {
  color: var(--ote-accent-hover);
  text-decoration: underline;
  outline: none;
}

.footer-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin-inline-start: auto;
}

/* The mark is the quietest thing in the strip on purpose: it is provenance,
   not an action. An earlier draft gave it a bordered pill, which read as a
   fourth button next to the subscribe badges \u2014 exactly what it must not
   be. Plain muted text, underlined only on hover. */
.footer-mark {
  font-size: 0.75rem;
  color: var(--ote-muted);
  text-decoration: none;
  white-space: nowrap;
}

.footer-mark:hover,
.footer-mark:focus-visible {
  color: var(--ote-accent);
  text-decoration: underline;
  outline: none;
}

@media (max-width: 480px) {
  /* Two lines rather than a name truncated to nothing: the strip's left
     side is the only part that can be long. */
  .footer {
    justify-content: flex-start;
  }

  .footer-actions {
    margin-inline-start: 0;
  }
}
`;var Rr=class extends HTMLElement{static observedAttributes=["feed","feeds","event-id","limit","theme","lang","show-past","layout","fields","fields-preview","fields-detail","card-width","group-events","placeholder-image","event-click","event-actions","sort","empty-message","max-per-day","initial-date","responsive","max-height","density","footer","convert","feed-ics","feed-rss","subscribe-layout","footer-mark","views"];#n;#e;#s;#t;#c=!1;#d=[];#u;#l;#p=new WeakMap;#o="idle";#r="";#y=0;#a;#x=[];#k;#E;#m;#b=0;#D=!1;#v;#T;#f="full";#h;#A=!1;#g;#P;#S=!1;constructor(){super();let e=this.attachShadow({mode:"open"});this.#n=document.createElement("style"),this.#n.textContent=fa,this.#e=document.createElement("div"),this.#e.className="ote-events",e.append(this.#n,this.#e)}connectedCallback(){!this.#g&&typeof ResizeObserver<"u"&&(this.#g=new ResizeObserver(e=>{let n=e[0]?.contentRect.width??this.clientWidth;n!==this.#P&&(this.#P=n,this.#z())}),this.#g.observe(this)),this.#c?this.#i():this.#_()}disconnectedCallback(){this.#g?.disconnect(),this.#g=void 0,this.#M()}attributeChangedCallback(e,n,r){this.isConnected&&(e==="feed"||e==="feeds"?(this.#v=void 0,this.#_()):e==="layout"||e==="views"?(n!==r&&(this.#T=void 0),this.#i()):this.#i())}get feedData(){return this.#t}set feedData(e){this.#L(e)}get events(){if(this.#t)return Array.isArray(this.#t)?this.#t:this.#t.events}set events(e){this.#L(e)}get event(){return this.events?.[0]}set event(e){this.#L(e==null?e:[e])}get eventActions(){return this.#x}set eventActions(e){this.#x=Array.isArray(e)||typeof e=="function"?e:[],this.isConnected&&this.#i()}get eventClassName(){return this.#k}set eventClassName(e){this.#k=typeof e=="function"?e:void 0,this.isConnected&&this.#i()}get eventBadges(){return this.#E}set eventBadges(e){this.#E=typeof e=="function"?e:void 0,this.isConnected&&this.#i()}#F(){let e=Wi(this.getAttribute("feeds"));if(e.length>0)return e;let n=this.getAttribute("feed");return n?[n]:[]}async#_(){if(this.#c)return;let e=this.#F();if(e.length===0){this.#o="error",this.#r='Missing required "feed" or "feeds" attribute.',this.#a=void 0,this.#i();return}this.#o="loading",this.#i();let n=++this.#y,r=await Promise.allSettled(e.map(fd));if(n!==this.#y)return;let i=r.filter(o=>o.status==="fulfilled");if(i.length===0){this.#o="error",this.#r=e.length===1?ga(r[0].reason):r.map((o,s)=>`${e[s]}: ${ga(o.reason)}`).join("; "),this.#a=void 0,this.#i();return}try{let o=md(i.map(l=>l.value)),s=Nt(o);this.#s=s,this.#t=o,this.#c=!1,this.#d=nn(o),this.#u=i.length===1?ba(o,i[0].value.url):void 0,this.#l=gd(i.map(l=>l.value)),this.#p=va(s,this.#d,this.#u),this.#o="loaded",this.#a=void 0}catch(o){this.#o="error",this.#r=o instanceof Error?o.message:String(o),this.#a=void 0,this.#l=void 0}this.#i()}#L(e){if(this.#y++,e==null){this.#t=void 0,this.#c=!1,this.#s=void 0,this.#d=[],this.#u=void 0,this.#l=void 0,this.#p=new WeakMap,this.#r="",this.#a=void 0,this.isConnected&&this.#_();return}this.#t=e,this.#c=!0;try{this.#s=Nt(e),this.#d=nn(e),this.#u=ba(e),this.#l=dr(Array.isArray(e)?void 0:e),this.#p=va(this.#s,this.#d,this.#u),this.#o="loaded",this.#r="",this.#a=void 0}catch(n){this.#s=void 0,this.#d=[],this.#u=void 0,this.#l=void 0,this.#p=new WeakMap,this.#o="error",this.#r=n instanceof Error?n.message:String(n),this.#a=void 0}this.isConnected&&this.#i()}#i(){this.style.setProperty("--ote-card-min-width",ji(this.getAttribute("card-width")));let e=this.#R();this.#e.setAttribute("data-layout",e.layout);let n=qi(this.getAttribute("max-height"));if(n===void 0?(this.style.removeProperty("--ote-max-height"),this.#e.removeAttribute("data-bounded")):(this.style.setProperty("--ote-max-height",n),this.#e.setAttribute("data-bounded","")),ha(this.#e,e),this.#$(),e.layout==="calendar"&&e.status==="loaded"){let r=kr(e);if(r.length>0){this.#B(r,e.lang,n!==void 0,this.#G());return}}this.#M()}#C(){pa(this.#e,this.#R())}#R(){let e=Wt(Bt(this.getAttribute("lang")),navigator.language),n={status:this.#o,errorMessage:this.#r,feed:this.#s,lang:e,limit:Ii(this.getAttribute("limit")),eventId:Ni(this.getAttribute("event-id")),showPast:zi(this.getAttribute("show-past")),sort:Fi(this.getAttribute("sort")),layout:this.#w(),views:this.#I(),onViewSelect:r=>this.#U(r),headerDensity:this.#f,...this.#w()==="calendar"?{calendarNav:{...this.#h!==void 0?{title:this.#h}:{},showsToday:this.#A,onNav:r=>{this.#m?.[r]()}}}:{},previewFields:Hi(this.getAttribute("fields-preview")??this.getAttribute("fields")),detailFields:Gi(this.getAttribute("fields-detail")??this.getAttribute("fields")),groupEvents:Bi(this.getAttribute("group-events")),placeholderImage:this.getAttribute("placeholder-image")?.trim()||void 0,emptyMessage:this.getAttribute("empty-message")?.trim()||void 0,footer:Yi(this.getAttribute("footer")),footerMeta:this.#H(),footerSubscribeLayout:Yt(this.getAttribute("subscribe-layout")??"badges"),footerMark:Xi(this.getAttribute("footer-mark")),theme:this.getAttribute("theme"),eventClick:jt(this.getAttribute("event-click")),eventActions:this.#j(),eventClassName:this.#k,eventBadges:this.#E,eventContext:r=>this.#p.get(r)??{previewEvent:r,index:-1},selectedEvent:this.#a,onEventOpen:r=>{this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#O(void 0,r,n)})),jt(this.getAttribute("event-click"))==="modal"&&(this.#a=r,this.#C())},onEventClose:()=>{this.#a=void 0,this.#C()},onEventAction:(r,i)=>{let o=typeof r=="string"?r:"type"in r?r.type:r.id;this.dispatchEvent(new CustomEvent("ote-event-action",{detail:this.#O(o,i,n)}))}};return n}#I(){let e=this.getAttribute("views");return e===null?this.#c?[]:Vn(null):Vn(e)}#w(){return Ji(this.#I(),$i(this.getAttribute("layout")),this.#T)}#U(e){let n=this.#w();e!==n&&(this.#T=e,this.#i(),this.#e.querySelector(`.view-switcher .view-button[data-view="${e}"]`)?.focus(),this.dispatchEvent(new CustomEvent("ote-view-change",{detail:{view:e,previousView:n},bubbles:!0,composed:!0})))}#H(){let e=this.#l,n=this.getAttribute("feed-ics")?.trim(),r=this.getAttribute("feed-rss")?.trim(),i=this.getAttribute("convert");if(!(!e&&!n&&!r))return{...e,...n?{icsUrl:n}:{},...r?{rssUrl:r}:{},...i!==null?{convert:i}:{}}}#G(){let e=this.#e.style.height;this.#e.style.height="0px";let n=this.clientHeight;return this.#e.style.height=e,n>1}async#B(e,n,r,i){this.#M();let o=++this.#b;try{let s=await import(new URL("./calendar-layout.js",import.meta.url).href);if(o!==this.#b||!this.isConnected)return;this.#D||(this.#n.textContent+=s.CALENDAR_CSS,this.#D=!0);let l=this.#e.querySelector(".calendar-host");if(!l)return;l.classList.remove("ec-dark","ec-auto-dark");let c=this.getAttribute("theme");c==="dark"?l.classList.add("ec-dark"):c!=="light"&&l.classList.add("ec-auto-dark"),l.replaceChildren(),this.#m=s.renderCalendar(l,e,{lang:n,bounded:r,fillsHeight:i,compact:Ki(Vi(this.getAttribute("density")),r||i),...Zi(m=>this.getAttribute(m),this.#v),onDatesSet:({title:m,showsToday:u})=>{this.#h=m,this.#A=u,this.#N()},onEventClick:m=>{let u=jt(this.getAttribute("event-click"));this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#O(void 0,m)})),u==="link"&&m.link?window.open(m.link,"_blank","noopener"):u==="modal"&&(this.#a=m,this.#C())}})}catch(s){if(o!==this.#b||!this.isConnected)return;let l=this.#e.querySelector(".calendar-host");l&&(l.textContent=s instanceof Error?s.message:String(s))}}#N(){let e=this.#e.querySelector(".header-title");e&&this.#h!==void 0&&(e.textContent=this.#h);let n=this.#e.querySelector(".header-today");n&&(n.disabled=this.#A);for(let r of this.#e.querySelectorAll(".header-arrow"))r.disabled=this.#h===void 0;this.#z()}#z(){if(this.#S)return;this.#S=!0;let e=()=>{this.#S=!1,this.isConnected&&this.#$()};typeof requestAnimationFrame=="function"?requestAnimationFrame(e):e()}#$(){if(this.#w()==="calendar"&&this.#h===void 0){this.#e.setAttribute("data-header",this.#f);return}for(let e of["full","icons","menu"]){if(e!==this.#f){let r=this.#f==="menu";this.#f=e,(e==="menu"||r)&&this.#W()}this.#e.setAttribute("data-header",e);let n=this.#e.querySelector(".ote-header");if(!n||!ma(n)&&!ma(n.querySelector(".header-nav")))return}}#W(){let e=this.#e.querySelector(".ote-header");if(!e)return;this.#e.setAttribute("data-header",this.#f);let n=Cr(this.#R());n&&e.replaceWith(n),this.#N()}#j(){let e=Ui(this.getAttribute("event-actions")),n=this.#x;return typeof n=="function"?r=>[...e,...n(r)]:[...e,...n]}#O(e,n,r){let i=this.#p.get(n)??{previewEvent:n,index:-1},o=r?bt(r).infoOf.get(n):void 0;return{...e?{action:e}:{},event:n,previewEvent:n,originalEvent:i.originalEvent,index:i.index,feed:i.feed,source:i.source,...o?{group:o}:{}}}#M(){this.#b++,this.#v=this.#m?.currentDate()??this.#v,this.#m?.destroy(),this.#m=void 0}};function ma(t){return t!==null&&t.scrollWidth>t.clientWidth+1}function nn(t){return Array.isArray(t)?t:Array.isArray(t.events)?t.events:[]}async function fd(t){let e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}`);let n=await e.text();return{url:t,data:JSON.parse(n)}}function ga(t){return t instanceof Error?t.message:String(t)}function md(t){return t.length===1?t[0].data:{events:t.flatMap(({url:e,data:n})=>{let r=Array.isArray(n)?void 0:be(n.title);return nn(n).map(i=>({...i,_feedUrl:be(i._feedUrl)??e,...!be(i._feedTitle)&&r?{_feedTitle:r}:{}}))})}}function be(t){return typeof t=="string"&&t.trim()?t:void 0}function ba(t,e){let n=nn(t)[0],r=Array.isArray(t)?void 0:be(t.title??t._feedTitle),i={url:e??be(n?._feedUrl),title:r??be(n?._feedTitle)};return i.url||i.title?i:void 0}function gd(t){if(t.length===1){let{url:e,data:n}=t[0];return dr(Array.isArray(n)?void 0:n,e)}return{sources:t.map(({url:e,data:n})=>(Array.isArray(n)?void 0:be(n.title))??bd(e)??e)}}function bd(t){try{return new URL(t,location.href).host||void 0}catch{return}}function va(t,e,n){let r=new WeakMap;return t.events.forEach((i,o)=>{let s=e[o],l={url:be(s?._feedUrl)??n?.url,title:be(s?._feedTitle)??n?.title};r.set(i,{previewEvent:i,originalEvent:s,index:o,feed:l.url||l.title?l:n,source:s?.source})}),r}function Or(){customElements.get("ote-events")||customElements.define("ote-events",Rr)}Or();export{Or as defineOteEvents};
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.5.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.5.0/LICENSE *)
  (*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE *)
*/
//# sourceMappingURL=ote-events.js.map
