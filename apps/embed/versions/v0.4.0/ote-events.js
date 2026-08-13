function Vt(e,t=320){if(!e)return;let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function fr(e){if(Array.isArray(e))return e.length>0?e.join(", "):void 0;if(typeof e=="string")return e.trim()||void 0;if(typeof e=="number"||typeof e=="boolean")return String(e);if(e&&typeof e=="object")return JSON.stringify(e)}function Yt(e){return e.flatMap(([t,n])=>{let r=fr(n);return r?[{label:t,value:r}]:[]})}function pt(e){if(!e)return null;let t=/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/.exec(e),r=(t?new Date(`${t[1]}T${t[2]??"00:00:00"}`):new Date(e)).valueOf();return Number.isNaN(r)?null:r}function Fe(e){let t=Date.now();return e.map((n,r)=>({event:n,index:r,sortDate:pt(n.startDate)})).sort((n,r)=>{if(n.sortDate===null&&r.sortDate===null)return n.index-r.index;if(n.sortDate===null)return 1;if(r.sortDate===null)return-1;let i=n.sortDate<t,o=r.sortDate<t;return i!==o?i?1:-1:i?r.sortDate-n.sortDate:n.sortDate-r.sortDate}).map(({event:n})=>n)}function ft(e){return e!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function Zt(e,t){let n=new Date(`${e}T00:00:00Z`);return n.setUTCDate(n.getUTCDate()+t),n.toISOString().slice(0,10)}function ut(e,t){if(!e)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(e))return new Intl.DateTimeFormat(void 0,{dateStyle:"medium"}).format(new Date(`${e}T00:00:00Z`));let r=new Date(`${e}${t==="UTC"?"Z":""}`);if(!Number.isNaN(r.valueOf())){let i=new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short"}).format(r);return t?`${i} (${t})`:i}return t?`${e} (${t})`:e}function Kt(e){return e.location?.venue??ht(e.location?.onlineUrl)??"online"}function ht(e){if(!e)return;let t;try{t=new URL(e).hostname.toLowerCase().replace(/^www\./,"")}catch{return"Online event"}return t==="meet.google.com"?"Google Meet":t==="teams.microsoft.com"?"Microsoft Teams":t==="meet.jit.si"||t.endsWith(".jitsi.net")?"Jitsi Meet":t==="discord.gg"||t==="discord.com"?"Discord":t==="youtube.com"||t==="youtu.be"?"YouTube":t==="twitch.tv"?"Twitch":t==="lu.ma"?"Luma":t.endsWith(".zoom.us")||t==="zoom.us"?"Zoom":t.endsWith(".slack.com")||t==="slack.com"?"Slack":t.endsWith(".meetup.com")||t==="meetup.com"?"Meetup":t.endsWith(".eventbrite.com")||t==="eventbrite.com"?"Eventbrite":"Online event"}function Ue(e){return e.dateLabel??(e.endDate?`${ut(e.startDate,e.timezone)} to ${ut(e.endDate,e.timezone)}`:ut(e.startDate,e.timezone))}function Xt(e){let t=e?.[0];if(t!==void 0)return typeof t=="string"?{url:t}:t}function Qt(e){let t=(e??[]).filter(r=>r.price!==void 0);if(t.length===0)return;let n=t.reduce((r,i)=>i.price<r.price?i:r);return{amount:n.price,currency:n.currency,url:n.url}}function lo(e){if(e?.id)return{id:e.id,type:e.type==="multipart"?"multipart":"series",name:e.name,url:e.url}}function mt(e){let t=Array.isArray(e)?{events:e}:e;if(!Array.isArray(t.events))throw new Error("feed.json has no events array");return{title:t.title,description:t.description,license:t.license,events:t.events.map(n=>{let r=Xt(n.image),i=Qt(n.offers),o=n.organizers?.[0]?.name;return{id:n.id,name:n.name??"(untitled event)",startDate:n.startDate,endDate:n.endDate,timezone:n.timezone,location:Kt(n),locationLink:n.location?.onlineUrl,link:n.url??n.location?.onlineUrl,description:n.description,image:r,price:i,organizerName:o,tags:n.tags,attendanceMode:n.attendanceMode,updatedAt:n.updatedAt,partOf:lo(n.partOf),eligibility:n.eligibility,cfp:n.cfp,details:Yt([["ID",n.id],["Status",n.status],["Timezone",n.timezone],["Attendance",n.attendanceMode],["Languages",n.languages],["Tags",n.tags],["Updated",n.updatedAt],["Source",n.source],["Image",r?.url],["Price",i&&`${i.amount}${i.currency?` ${i.currency}`:""}`],["Organizer",o]])}})}}function nn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var we=nn();function yr(e){we=e}var ve={exec:()=>null};function Re(e){let t=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),i=t[r];return i||(i=e(r),t[r]=i),i}}function E(e,t=""){let n=typeof e=="string"?e:e.source,r={replace:(i,o)=>{let l=typeof o=="string"?o:o.source;return l=l.replace(B.caret,"$1"),n=n.replace(i,l),r},getRegex:()=>new RegExp(n,t)};return r}var co=((e="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+e)}catch{return!1}})(),B={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:Re(e=>new RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:Re(e=>new RegExp(`^ {0,${e}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),fencesBeginRegex:Re(e=>new RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),headingBeginRegex:Re(e=>new RegExp(`^ {0,${e}}#`)),htmlBeginRegex:Re(e=>new RegExp(`^ {0,${e}}<(?:[a-z].*>|!--)`,"i")),blockquoteBeginRegex:Re(e=>new RegExp(`^ {0,${e}}>`))},uo=/^(?:[ \t]*(?:\n|$))+/,po=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,fo=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Be=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ho=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,rn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Er=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,xr=E(Er).replace(/bull/g,rn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),mo=E(Er).replace(/bull/g,rn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),on=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,go=/^[^\n]+/,an=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,vo=E(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",an).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),bo=E(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,rn).getRegex(),kt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",sn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,wo=E("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",sn).replace("tag",kt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Tr=e=>E(on).replace("hr",Be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list",e).replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",kt).getRegex(),ko=Tr(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),yo=Tr(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),Eo=E(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",yo).getRegex(),ln={blockquote:Eo,code:po,def:vo,fences:fo,heading:ho,hr:Be,html:wo,lheading:xr,list:bo,newline:uo,paragraph:ko,table:ve,text:go},hr=E("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",kt).getRegex(),xo={...ln,lheading:mo,table:hr,paragraph:E(on).replace("hr",Be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",hr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",kt).getRegex()},To={...ln,html:E(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",sn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:ve,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:E(on).replace("hr",Be).replace("heading",` *#{1,6} *[^
]`).replace("lheading",xr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Ao=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,So=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ar=/^( {2,}|\\)\n(?!\s*$)/,_o=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,oe=/[\p{P}\p{S}]/u,Le=/[\s\p{P}\p{S}]/u,We=/[^\s\p{P}\p{S}]/u,Ro=E(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Le).getRegex(),Lo=/[\p{Pi}\p{Ps}"']/u,Sr=/(?!~)[\p{P}\p{S}]/u,Oo=/(?!~)[\s\p{P}\p{S}]/u,Co=/(?:[^\s\p{P}\p{S}]|~)/u,Do=E(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",co?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),_r=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Po=E(_r,"u").replace(/punct/g,oe).getRegex(),No=E(_r,"u").replace(/punct/g,Sr).getRegex(),Mo=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,Io=E(Mo,"u").replace(/openQuote/g,Lo).replace(/punct/g,oe).getRegex(),Rr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",zo=E(Rr,"gu").replace(/notPunctSpace/g,We).replace(/punctSpace/g,Le).replace(/punct/g,oe).getRegex(),$o=E(Rr,"gu").replace(/notPunctSpace/g,Co).replace(/punctSpace/g,Oo).replace(/punct/g,Sr).getRegex(),Fo="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",Uo=E(Fo,"gu").replace(/notPunctSpace/g,We).replace(/punctSpace/g,Le).replace(/punct/g,oe).getRegex(),Ho=E("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,We).replace(/punctSpace/g,Le).replace(/punct/g,oe).getRegex(),Go="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",Bo=E(Go,"gu").replace(/notPunctSpace/g,We).replace(/punctSpace/g,Le).replace(/punct/g,oe).getRegex(),Wo=E(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,oe).getRegex(),jo="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",qo=E(jo,"gu").replace(/notPunctSpace/g,We).replace(/punctSpace/g,Le).replace(/punct/g,oe).getRegex(),Vo=E(/\\(punct)/,"gu").replace(/punct/g,oe).getRegex(),Yo=E(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Zo=E(sn).replace("(?:-->|$)","-->").getRegex(),Ko=E("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Zo).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),vt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,Xo=E(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",vt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Lr=E(/^!?\[(label)\]\[(ref)\]/).replace("label",vt).replace("ref",an).getRegex(),Or=E(/^!?\[(ref)\](?:\[\])?/).replace("ref",an).getRegex(),Qo=E("reflink|nolink(?!\\()","g").replace("reflink",Lr).replace("nolink",Or).getRegex(),mr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,cn={_backpedal:ve,anyPunctuation:Vo,autolink:Yo,blockSkip:Do,br:Ar,code:So,del:ve,delLDelim:ve,delRDelim:ve,emStrongLDelim:Po,emStrongRDelimAst:zo,emStrongRDelimUnd:Ho,escape:Ao,link:Xo,nolink:Or,punctuation:Ro,reflink:Lr,reflinkSearch:Qo,tag:Ko,text:_o,url:ve},Jo={...cn,emStrongLDelim:Io,emStrongRDelimAst:Uo,emStrongRDelimUnd:Bo,link:E(/^!?\[(label)\]\((.*?)\)/).replace("label",vt).getRegex(),reflink:E(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",vt).getRegex()},Jt={...cn,emStrongRDelimAst:$o,emStrongLDelim:No,delLDelim:Wo,delRDelim:qo,url:E(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",mr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:E(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",mr).getRegex()},ea={...Jt,br:E(Ar).replace("{2,}","*").getRegex(),text:E(Jt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},gt={normal:ln,gfm:xo,pedantic:To},He={normal:cn,gfm:Jt,breaks:ea,pedantic:Jo},ta={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},gr=e=>ta[e];function ie(e,t){if(t){if(B.escapeTest.test(e))return e.replace(B.escapeReplace,gr)}else if(B.escapeTestNoEncode.test(e))return e.replace(B.escapeReplaceNoEncode,gr);return e}function vr(e){try{e=encodeURI(e).replace(B.percentDecode,"%")}catch{return null}return e}function br(e,t){let n=e.replace(B.findPipe,(o,l,s)=>{let d=!1,u=l;for(;--u>=0&&s[u]==="\\";)d=!d;return d?"|":" |"}),r=n.split(B.splitPipe),i=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),t)if(r.length>t)r.splice(t);else for(;r.length<t;)r.push("");for(;i<r.length;i++)r[i]=r[i].trim().replace(B.slashPipe,"|");return r}function de(e,t,n){let r=e.length;if(r===0)return"";let i=0;for(;i<r;){let o=e.charAt(r-i-1);if(o===t&&!n)i++;else if(o!==t&&n)i++;else break}return e.slice(0,r-i)}function wr(e){let t=e.split(`
`),n=t.length-1;for(;n>=0&&B.blankLine.test(t[n]);)n--;return t.length-n<=2?e:t.slice(0,n+1).join(`
`)}function na(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]==="\\")r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return n>0?-2:-1}function ra(e,t=0){let n=t,r="";for(let i of e)if(i==="	"){let o=4-n%4;r+=" ".repeat(o),n+=o}else r+=i,n++;return r}function kr(e,t,n,r,i){let o=t.href,l=t.title||null,s=e[1].replace(i.other.outputLinkReplace,"$1");r.state.inLink=!0;let d={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:o,title:l,text:s,tokens:r.inlineTokens(s)};return r.state.inLink=!1,d}function ia(e,t,n){let r=e.match(n.other.indentCodeCompensation);if(r===null)return t;let i=r[1];return t.split(`
`).map(o=>{let l=o.match(n.other.beginningSpace);if(l===null)return o;let[s]=l;return s.length>=i.length?o.slice(i.length):o}).join(`
`)}var bt=class{options;rules;lexer;constructor(e){this.options=e||we}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=this.options.pedantic?t[0]:wr(t[0]),r=n.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n,codeBlockStyle:"indented",text:r}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],r=ia(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:r}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let r=de(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim())}return{type:"heading",raw:de(t[0],`
`),depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:de(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=de(t[0],`
`).split(`
`),r="",i="",o=[];for(;n.length>0;){let l=!1,s=[],d;for(d=0;d<n.length;d++)if(this.rules.other.blockquoteStart.test(n[d]))s.push(n[d]),l=!0;else if(!l)s.push(n[d]);else break;n=n.slice(d);let u=s.join(`
`),m=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${u}`:u,i=i?`${i}
${m}`:m;let g=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(m,o,!0),this.lexer.state.top=g,n.length===0)break;let w=o.at(-1);if(w?.type==="code")break;if(w?.type==="blockquote"){let A=w,k=n.join(`
`),x=A.raw+`
`+k.replace(this.rules.other.blockquoteSetextReplace2,""),P=this.blockquote(x);o[o.length-1]=P,r=`${r}
${k}`,i=i.substring(0,i.length-A.text.length)+P.text;break}else if(w?.type==="list"){let A=w,k=A.raw+`
`+n.join(`
`),x=this.list(k);o[o.length-1]=x,r=r.substring(0,r.length-w.raw.length)+x.raw,i=i.substring(0,i.length-A.raw.length)+x.raw,n=k.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:o,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let o=this.rules.other.listItemRegex(n),l=!1;for(;e;){let d=!1,u="",m="";if(!(t=o.exec(e))||this.rules.block.hr.test(e))break;u=t[0],e=e.substring(u.length);let g=ra(t[2].split(`
`,1)[0],t[1].length),w=e.split(`
`,1)[0],A=!g.trim(),k=0;if(this.options.pedantic?(k=2,m=g.trimStart()):A?k=t[1].length+1:(k=g.search(this.rules.other.nonSpaceChar),k=k>4?1:k,m=g.slice(k),k+=t[1].length),A&&this.rules.other.blankLine.test(w)&&(u+=w+`
`,e=e.substring(w.length+1),d=!0),!d){let x=this.rules.other.nextBulletRegex(k),P=this.rules.other.hrRegex(k),I=this.rules.other.fencesBeginRegex(k),fe=this.rules.other.headingBeginRegex(k),Pe=this.rules.other.htmlBeginRegex(k),U=this.rules.other.blockquoteBeginRegex(k);for(;e;){let q=e.split(`
`,1)[0],ee;if(w=q,this.options.pedantic?(w=w.replace(this.rules.other.listReplaceNesting,"  "),ee=w):ee=w.replace(this.rules.other.tabCharGlobal,"    "),I.test(w)||fe.test(w)||Pe.test(w)||U.test(w)||x.test(w)||P.test(w))break;if(ee.search(this.rules.other.nonSpaceChar)>=k||!w.trim())m+=`
`+ee.slice(k);else{if(A||g.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||I.test(g)||fe.test(g)||P.test(g))break;m+=`
`+w}A=!w.trim(),u+=q+`
`,e=e.substring(q.length+1),g=ee.slice(k)}}i.loose||(l?i.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(l=!0)),i.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(m),loose:!1,text:m,tokens:[]}),i.raw+=u}let s=i.items.at(-1);if(s)s.raw=s.raw.trimEnd(),s.text=s.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let d of i.items){this.lexer.state.top=!1,d.tokens=this.lexer.blockTokens(d.text,[]);let u=d.tokens[0];if(d.task&&(u?.type==="text"||u?.type==="paragraph")){d.text=d.text.replace(this.rules.other.listReplaceTask,""),u.raw=u.raw.replace(this.rules.other.listReplaceTask,""),u.text=u.text.replace(this.rules.other.listReplaceTask,"");for(let g=this.lexer.inlineQueue.length-1;g>=0;g--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[g].src)){this.lexer.inlineQueue[g].src=this.lexer.inlineQueue[g].src.replace(this.rules.other.listReplaceTask,"");break}let m=this.rules.other.listTaskCheckbox.exec(d.raw);if(m){let g={type:"checkbox",raw:m[0]+" ",checked:m[0]!=="[ ]"};d.checked=g.checked,i.loose?d.tokens[0]&&["paragraph","text"].includes(d.tokens[0].type)&&"tokens"in d.tokens[0]&&d.tokens[0].tokens?(d.tokens[0].raw=g.raw+d.tokens[0].raw,d.tokens[0].text=g.raw+d.tokens[0].text,d.tokens[0].tokens.unshift(g)):d.tokens.unshift({type:"paragraph",raw:g.raw,text:g.raw,tokens:[g]}):d.tokens.unshift(g)}}else d.task&&(d.task=!1);if(!i.loose){let m=d.tokens.filter(w=>w.type==="space"),g=m.length>0&&m.some(w=>this.rules.other.anyLine.test(w.raw));i.loose=g}}if(i.loose)for(let d of i.items){d.loose=!0;for(let u of d.tokens)u.type==="text"&&(u.type="paragraph")}return i}}html(e){let t=this.rules.block.html.exec(e);if(t){let n=wr(t[0]);return{type:"html",block:!0,raw:n,pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:n}}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:de(t[0],`
`),href:r,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=br(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:de(t[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let l of r)this.rules.other.tableAlignRight.test(l)?o.align.push("right"):this.rules.other.tableAlignCenter.test(l)?o.align.push("center"):this.rules.other.tableAlignLeft.test(l)?o.align.push("left"):o.align.push(null);for(let l=0;l<n.length;l++)o.header.push({text:n[l],tokens:this.lexer.inline(n[l]),header:!0,align:o.align[l]});for(let l of i)o.rows.push(br(l,o.header.length).map((s,d)=>({text:s,tokens:this.lexer.inline(s),header:!1,align:o.align[d]})));return o}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let n=t[1].trim();return{type:"heading",raw:de(t[0],`
`),depth:t[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let o=de(n.slice(0,-1),"\\");if((n.length-o.length)%2===0)return}else{let o=na(t[2],"()");if(o===-2)return;if(o>-1){let l=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,l).trim(),t[3]=""}}let r=t[2],i="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(r);o&&(r=o[1],i=o[3])}else i=t[3]?t[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),kr(t,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=t[r.toLowerCase()];if(!i){let o=n[0].charAt(0);return{type:"text",raw:o,text:o}}return kr(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,o,l,s=i,d=0,u=r[0][0],m=n===u,g=u==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(g.lastIndex=0,t=t.slice(-1*e.length+i);(r=g.exec(t))!==null;){if(o=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!o)continue;if(l=[...o].length,r[3]||r[4]){s+=l;continue}else if(r[5]||r[6]){if(i%3&&!((i+l)%3)){d+=l;continue}if(m)break}if(s-=l,s>0)continue;l=Math.min(l,l+s+d);let w=[...r[0]][0].length,A=e.slice(0,i+r.index+w+l);if(Math.min(i,l)%2){let x=A.slice(1,-1);return{type:"em",raw:A,text:x,tokens:this.lexer.inlineTokens(x)}}let k=A.slice(2,-2);return{type:"strong",raw:A,text:k,tokens:this.lexer.inlineTokens(k)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let r=this.rules.inline.delLDelim.exec(e);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,o,l,s=i,d=this.rules.inline.delRDelim;for(d.lastIndex=0,t=t.slice(-1*e.length+i);(r=d.exec(t))!==null;){if(o=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!o||(l=[...o].length,l!==i))continue;if(r[3]||r[4]){s+=l;continue}if(s-=l,s>0)continue;l=Math.min(l,l+s);let u=[...r[0]][0].length,m=e.slice(0,i+r.index+u+l),g=m.slice(i,-i);return{type:"del",raw:m,text:g,tokens:this.lexer.inlineTokens(g)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,r;return t[2]==="@"?(n=t[1],r="mailto:"+n):(n=t[1],r=n),{type:"link",raw:t[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,r;if(t[2]==="@")n=t[0],r="mailto:"+n;else{let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},X=class en{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||we,this.options.tokenizer=this.options.tokenizer||new bt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:B,block:gt.normal,inline:He.normal};this.options.pedantic?(n.block=gt.pedantic,n.inline=He.pedantic):this.options.gfm&&(n.block=gt.gfm,this.options.breaks?n.inline=He.breaks:n.inline=He.gfm),this.tokenizer.rules=n}static get rules(){return{block:gt,inline:He}}static lex(t,n){return new en(n).lex(t)}static lexInline(t,n){return new en(n).inlineTokens(t)}lex(t){t=t.replace(B.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],r=!1){this.tokenizer.lexer=this,this.options.pedantic&&(t=t.replace(B.tabCharGlobal,"    ").replace(B.spaceLine,""));let i=1/0;for(;t;){if(t.length<i)i=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}let o;if(this.options.extensions?.block?.some(s=>(o=s.call({lexer:this},t,n))?(t=t.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.space(t)){t=t.substring(o.raw.length);let s=n.at(-1);o.raw.length===1&&s!==void 0?s.raw+=`
`:n.push(o);continue}if(o=this.tokenizer.code(t)){t=t.substring(o.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+o.raw,s.text+=`
`+o.text,this.inlineQueue.at(-1).src=s.text):n.push(o);continue}if(o=this.tokenizer.fences(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.heading(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.hr(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.blockquote(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.list(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.html(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.def(t)){t=t.substring(o.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+o.raw,s.text+=`
`+o.raw,this.inlineQueue.at(-1).src=s.text):this.tokens.links[o.tag]||(this.tokens.links[o.tag]={href:o.href,title:o.title},n.push(o));continue}if(o=this.tokenizer.table(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.lheading(t)){t=t.substring(o.raw.length),n.push(o);continue}let l=t;if(this.options.extensions?.startBlock){let s=1/0,d=t.slice(1),u;this.options.extensions.startBlock.forEach(m=>{u=m.call({lexer:this},d),typeof u=="number"&&u>=0&&(s=Math.min(s,u))}),s<1/0&&s>=0&&(l=t.substring(0,s+1))}if(this.state.top&&(o=this.tokenizer.paragraph(l))){let s=n.at(-1);r&&s?.type==="paragraph"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+o.raw,s.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(o),r=l.length!==t.length,t=t.substring(o.raw.length);continue}if(o=this.tokenizer.text(t)){t=t.substring(o.raw.length);let s=n.at(-1);s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+o.raw,s.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(o);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){this.tokenizer.lexer=this;let r=t;if(this.tokens.links){let s=Object.keys(this.tokens.links);s.length>0&&(r=r.replace(this.tokenizer.rules.inline.reflinkSearch,d=>s.includes(d.slice(d.lastIndexOf("[")+1,-1))?"["+"a".repeat(d.length-2)+"]":d))}r=r.replace(this.tokenizer.rules.inline.anyPunctuation,"++"),r=r.replace(this.tokenizer.rules.inline.blockSkip,(s,d,u)=>{let m=u?u.length:0;return s.slice(0,m)+"["+"a".repeat(s.length-m-2)+"]"}),r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let i=!1,o="",l=1/0;for(;t;){if(t.length<l)l=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}i||(o=""),i=!1;let s;if(this.options.extensions?.inline?.some(u=>(s=u.call({lexer:this},t,n))?(t=t.substring(s.raw.length),n.push(s),!0):!1))continue;if(s=this.tokenizer.escape(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.tag(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.link(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(s.raw.length);let u=n.at(-1);s.type==="text"&&u?.type==="text"?(u.raw+=s.raw,u.text+=s.text):n.push(s);continue}if(s=this.tokenizer.emStrong(t,r,o)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.codespan(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.br(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.del(t,r,o)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.autolink(t)){t=t.substring(s.raw.length),n.push(s);continue}if(!this.state.inLink&&(s=this.tokenizer.url(t))){t=t.substring(s.raw.length),n.push(s);continue}let d=t;if(this.options.extensions?.startInline){let u=1/0,m=t.slice(1),g;this.options.extensions.startInline.forEach(w=>{g=w.call({lexer:this},m),typeof g=="number"&&g>=0&&(u=Math.min(u,g))}),u<1/0&&u>=0&&(d=t.substring(0,u+1))}if(s=this.tokenizer.inlineText(d)){t=t.substring(s.raw.length),s.raw.slice(-1)!=="_"&&(o=s.raw.slice(-1)),i=!0;let u=n.at(-1);u?.type==="text"?(u.raw+=s.raw,u.text+=s.text):n.push(s);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return n}infiniteLoopError(t){let n="Infinite loop on byte: "+t;if(this.options.silent)console.error(n);else throw new Error(n)}},wt=class{options;parser;constructor(e){this.options=e||we}space(e){return""}code({text:e,lang:t,escaped:n}){let r=(t||"").match(B.notSpaceStart)?.[0],i=e.replace(B.endingNewline,"")+`
`;return r?'<pre><code class="language-'+ie(r)+'">'+(n?i:ie(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:ie(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,r="";for(let l=0;l<e.items.length;l++){let s=e.items[l];r+=this.listitem(s)}let i=t?"ol":"ul",o=t&&n!==1?' start="'+n+'"':"";return"<"+i+o+`>
`+r+"</"+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let i=0;i<e.header.length;i++)n+=this.tablecell(e.header[i]);t+=this.tablerow({text:n});let r="";for(let i=0;i<e.rows.length;i++){let o=e.rows[i];n="";for(let l=0;l<o.length;l++)n+=this.tablecell(o[l]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${ie(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let r=this.parser.parseInline(n),i=vr(e);if(i===null)return r;e=i;let o='<a href="'+e+'"';return t&&(o+=' title="'+ie(t)+'"'),o+=">"+r+"</a>",o}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=vr(e);if(i===null)return ie(n);e=i;let o=`<img src="${e}" alt="${ie(n)}"`;return t&&(o+=` title="${ie(t)}"`),o+=">",o}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:ie(e.text)}},dn=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Q=class tn{options;renderer;textRenderer;constructor(t){this.options=t||we,this.options.renderer=this.options.renderer||new wt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new dn}static parse(t,n){return new tn(n).parse(t)}static parseInline(t,n){return new tn(n).parseInline(t)}parse(t){this.renderer.parser=this;let n="";for(let r=0;r<t.length;r++){let i=t[r];if(this.options.extensions?.renderers?.[i.type]){let l=i,s=this.options.extensions.renderers[l.type].call({parser:this},l);if(s!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(l.type)){n+=s||"";continue}}let o=i;switch(o.type){case"space":{n+=this.renderer.space(o);break}case"hr":{n+=this.renderer.hr(o);break}case"heading":{n+=this.renderer.heading(o);break}case"code":{n+=this.renderer.code(o);break}case"table":{n+=this.renderer.table(o);break}case"blockquote":{n+=this.renderer.blockquote(o);break}case"list":{n+=this.renderer.list(o);break}case"checkbox":{n+=this.renderer.checkbox(o);break}case"html":{n+=this.renderer.html(o);break}case"def":{n+=this.renderer.def(o);break}case"paragraph":{n+=this.renderer.paragraph(o);break}case"text":{n+=this.renderer.text(o);break}default:{let l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return n}parseInline(t,n=this.renderer){this.renderer.parser=this;let r="";for(let i=0;i<t.length;i++){let o=t[i];if(this.options.extensions?.renderers?.[o.type]){let s=this.options.extensions.renderers[o.type].call({parser:this},o);if(s!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(o.type)){r+=s||"";continue}}let l=o;switch(l.type){case"escape":{r+=n.text(l);break}case"html":{r+=n.html(l);break}case"link":{r+=n.link(l);break}case"image":{r+=n.image(l);break}case"checkbox":{r+=n.checkbox(l);break}case"strong":{r+=n.strong(l);break}case"em":{r+=n.em(l);break}case"codespan":{r+=n.codespan(l);break}case"br":{r+=n.br(l);break}case"del":{r+=n.del(l);break}case"text":{r+=n.text(l);break}default:{let s='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return r}},Ge=class{options;block;constructor(e){this.options=e||we}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?X.lex:X.lexInline}provideParser(e=this.block){return e?Q.parse:Q.parseInline}},oa=class{defaults=nn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Q;Renderer=wt;TextRenderer=dn;Lexer=X;Tokenizer=bt;Hooks=Ge;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case"table":{let i=r;for(let o of i.header)n=n.concat(this.walkTokens(o.tokens,t));for(let o of i.rows)for(let l of o)n=n.concat(this.walkTokens(l.tokens,t));break}case"list":{let i=r;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=r;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(o=>{let l=i[o].flat(1/0);n=n.concat(this.walkTokens(l,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let o=t.renderers[i.name];o?t.renderers[i.name]=function(...l){let s=i.renderer.apply(this,l);return s===!1&&(s=o.apply(this,l)),s}:t.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=t[i.level];o?o.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens)}),r.extensions=t),n.renderer){let i=this.defaults.renderer||new wt(this.defaults);for(let o in n.renderer){if(!(o in i))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let l=o,s=n.renderer[l],d=i[l];i[l]=(...u)=>{let m=s.apply(i,u);return m===!1&&(m=d.apply(i,u)),m||""}}r.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new bt(this.defaults);for(let o in n.tokenizer){if(!(o in i))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let l=o,s=n.tokenizer[l],d=i[l];i[l]=(...u)=>{let m=s.apply(i,u);return m===!1&&(m=d.apply(i,u)),m}}r.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new Ge;for(let o in n.hooks){if(!(o in i))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let l=o,s=n.hooks[l],d=i[l];Ge.passThroughHooks.has(o)?i[l]=u=>{if(this.defaults.async&&Ge.passThroughHooksRespectAsync.has(o))return(async()=>{let g=await s.call(i,u);return d.call(i,g)})();let m=s.call(i,u);return d.call(i,m)}:i[l]=(...u)=>{if(this.defaults.async)return(async()=>{let g=await s.apply(i,u);return g===!1&&(g=await d.apply(i,u)),g})();let m=s.apply(i,u);return m===!1&&(m=d.apply(i,u)),m}}r.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,o=n.walkTokens;r.walkTokens=function(l){let s=[];return s.push(o.call(this,l)),i&&(s=s.concat(i.call(this,l))),s}}this.defaults={...this.defaults,...r}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return X.lex(e,t??this.defaults)}parser(e,t){return Q.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let r={...n},i={...this.defaults,...r},o=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let l=i.hooks?await i.hooks.preprocess(t):t,s=await(i.hooks?await i.hooks.provideLexer(e):e?X.lex:X.lexInline)(l,i),d=i.hooks?await i.hooks.processAllTokens(s):s;i.walkTokens&&await Promise.all(this.walkTokens(d,i.walkTokens));let u=await(i.hooks?await i.hooks.provideParser(e):e?Q.parse:Q.parseInline)(d,i);return i.hooks?await i.hooks.postprocess(u):u})().catch(o);try{i.hooks&&(t=i.hooks.preprocess(t));let l=(i.hooks?i.hooks.provideLexer(e):e?X.lex:X.lexInline)(t,i);i.hooks&&(l=i.hooks.processAllTokens(l)),i.walkTokens&&this.walkTokens(l,i.walkTokens);let s=(i.hooks?i.hooks.provideParser(e):e?Q.parse:Q.parseInline)(l,i);return i.hooks&&(s=i.hooks.postprocess(s)),s}catch(l){return o(l)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let r="<p>An error occurred:</p><pre>"+ie(n.message+"",!0)+"</pre>";return t?Promise.resolve(r):r}if(t)return Promise.reject(n);throw n}}},be=new oa;function S(e,t){return be.parse(e,t)}S.options=S.setOptions=function(e){return be.setOptions(e),S.defaults=be.defaults,yr(S.defaults),S};S.getDefaults=nn;S.defaults=we;function aa(...e){return be.use(...e),S.defaults=be.defaults,yr(S.defaults),S}S.use=aa;S.walkTokens=function(e,t){return be.walkTokens(e,t)};S.parseInline=be.parseInline;S.Parser=Q;S.parser=Q.parse;S.Renderer=wt;S.TextRenderer=dn;S.Lexer=X;S.lexer=X.lex;S.Tokenizer=bt;S.Hooks=Ge;S.parse=S;var ws=S.options,ks=S.setOptions,ys=S.walkTokens,Es=S.parseInline;var xs=Q.parse,Ts=X.lex;var un=["image","when","location","attendance","description","price","tags","organizer","eligibility","cfp"],Cr=["image","when","location","attendance","description"],Dr=["google-calendar","outlook-calendar","yahoo-calendar","ics","link"],sa=["series","multipart"];function Pr(e){return un.includes(e)}function la(e){return sa.includes(e)}function Nr(e){if(!e)return 1/0;let t=Number.parseInt(e,10);return Number.isFinite(t)&&t>0?t:1/0}function Mr(e){return e==="en"||e==="es"?e:"auto"}function Ir(e,t){return e!=="auto"?e:t.toLowerCase().startsWith("es")?"es":"en"}function zr(e){return e!=="false"}function $r(e){return e==="cards"?"cards":e==="list"?"list":"calendar"}function Et(e){return e==="link"||e==="none"?e:"modal"}function Fr(e){return e==="none"?"none":"auto"}function ca(e){return e==="google-calendar"||e==="outlook-calendar"||e==="yahoo-calendar"||e==="ics"||e==="link"}function Ur(e){if(e==="none")return[];if(!e)return[...Dr];let t=e.split(",").map(n=>n.trim()).filter(ca);return t.length>0?[...new Set(t)]:[...Dr]}function Hr(e){if(!e)return new Set(Cr);let t=e.split(",").map(n=>n.trim()).filter(Pr);return t.length>0?new Set(t):new Set(Cr)}function Gr(e){if(!e)return new Set(un);let t=e.split(",").map(n=>n.trim()).filter(Pr);return t.length>0?new Set(t):new Set(un)}function Br(e){return e?new Set(e.split(",").map(t=>t.trim()).filter(la)):new Set}var yt={small:"160px",medium:"220px",large:"320px"};function Wr(e){let t=e?.trim();return t?t in yt?yt[t]:/^\d+(\.\d+)?$/.test(t)?`${t}px`:/^\d+(\.\d+)?(px|rem|em|ch|vw|%)$/.test(t)?t:yt.medium:yt.medium}function jr(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function da(e){if(Array.isArray(e))return e}function ua(e,t){var n=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var r,i,o,l,s=[],d=!0,u=!1;try{if(o=(n=n.call(e)).next,t!==0)for(;!(d=(r=o.call(n)).done)&&(s.push(r.value),s.length!==t);d=!0);}catch(m){u=!0,i=m}finally{try{if(!d&&n.return!=null&&(l=n.return(),Object(l)!==l))return}finally{if(u)throw i}}return s}}function pa(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function fa(e,t){return da(e)||ua(e,t)||ha(e,t)||pa()}function ha(e,t){if(e){if(typeof e=="string")return jr(e,t);var n={}.toString.call(e).slice(8,-1);return n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set"?Array.from(e):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?jr(e,t):void 0}}var ai=Object.entries,qr=Object.setPrototypeOf,ma=Object.isFrozen,ga=Object.getPrototypeOf,va=Object.getOwnPropertyDescriptor,H=Object.freeze,G=Object.seal,De=Object.create,si=typeof Reflect<"u"&&Reflect,vn=si.apply,bn=si.construct;H||(H=function(t){return t});G||(G=function(t){return t});vn||(vn=function(t,n){for(var r=arguments.length,i=new Array(r>2?r-2:0),o=2;o<r;o++)i[o-2]=arguments[o];return t.apply(n,i)});bn||(bn=function(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return new t(...r)});var Oe=z(Array.prototype.forEach),ba=z(Array.prototype.lastIndexOf),Vr=z(Array.prototype.pop),Ce=z(Array.prototype.push),wa=z(Array.prototype.splice),pe=Array.isArray,Ve=z(String.prototype.toLowerCase),pn=z(String.prototype.toString),Yr=z(String.prototype.match),je=z(String.prototype.replace),Zr=z(String.prototype.indexOf),ka=z(String.prototype.trim),ya=z(Number.prototype.toString),Ea=z(Boolean.prototype.toString),Kr=typeof BigInt>"u"?null:z(BigInt.prototype.toString),Xr=typeof Symbol>"u"?null:z(Symbol.prototype.toString),F=z(Object.prototype.hasOwnProperty),qe=z(Object.prototype.toString),$=z(RegExp.prototype.test),ke=xa(TypeError);function z(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return vn(e,t,r)}}function xa(e){return function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return bn(e,n)}}function T(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ve;if(qr&&qr(e,null),!pe(t))return e;let r=t.length;for(;r--;){let i=t[r];if(typeof i=="string"){let o=n(i);o!==i&&(ma(t)||(t[r]=o),i=o)}e[i]=!0}return e}function Ta(e){for(let t=0;t<e.length;t++)F(e,t)||(e[t]=null);return e}function W(e){let t=De(null);for(let r of ai(e)){var n=fa(r,2);let i=n[0],o=n[1];F(e,i)&&(pe(o)?t[i]=Ta(o):o&&typeof o=="object"&&o.constructor===Object?t[i]=W(o):t[i]=o)}return t}function Aa(e){switch(typeof e){case"string":return e;case"number":return ya(e);case"boolean":return Ea(e);case"bigint":return Kr?Kr(e):"0";case"symbol":return Xr?Xr(e):"Symbol()";case"undefined":return qe(e);case"function":case"object":{if(e===null)return qe(e);let t=e,n=J(t,"toString");if(typeof n=="function"){let r=n(t);return typeof r=="string"?r:qe(r)}return qe(e)}default:return qe(e)}}function J(e,t){for(;e!==null;){let r=va(e,t);if(r){if(r.get)return z(r.get);if(typeof r.value=="function")return z(r.value)}e=ga(e)}function n(){return null}return n}function Sa(e){try{return $(e,""),!0}catch{return!1}}var Qr=H(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),fn=H(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),hn=H(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),_a=H(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),mn=H(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Ra=H(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Jr=H(["#text"]),ei=H(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),gn=H(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),ti=H(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),xt=H(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),La=G(/{{[\w\W]*|^[\w\W]*}}/g),Oa=G(/<%[\w\W]*|^[\w\W]*%>/g),Ca=G(/\${[\w\W]*/g),Da=G(/^data-[\-\w.\u00B7-\uFFFF]+$/),Pa=G(/^aria-[\-\w]+$/),ni=G(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Na=G(/^(?:\w+script|data):/i),Ma=G(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ia=G(/^html$/i),za=G(/^[a-z][.\w]*(-[.\w]+)+$/i),ri=G(/<[/\w!]/g),ii=G(/<[/\w]/g),$a=G(/<\/no(script|embed|frames)/i),Fa=G(/\/>/i),K={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},Ua=function(){return typeof window>"u"?null:window},Ha=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let r=null,i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(r=n.getAttribute(i));let o="dompurify"+(r?"#"+r:"");try{return t.createPolicy(o,{createHTML(l){return l},createScriptURL(l){return l}})}catch{return console.warn("TrustedTypes policy "+o+" could not be created."),null}},oi=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},ue=function(t,n,r,i){return F(t,n)&&pe(t[n])?T(i.base?W(i.base):{},t[n],i.transform):r};function li(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Ua(),t=f=>li(f);if(t.version="3.4.13",t.removed=[],!e||!e.document||e.document.nodeType!==K.document||!e.Element)return t.isSupported=!1,t;let n=e.document,r=n,i=r.currentScript;e.DocumentFragment;let o=e.HTMLTemplateElement,l=e.Node,s=e.Element,d=e.NodeFilter,u=e.NamedNodeMap;u===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;let m=e.DOMParser,g=e.trustedTypes,w=s.prototype,A=J(w,"cloneNode"),k=J(w,"remove"),x=J(w,"nextSibling"),P=J(w,"childNodes"),I=J(w,"parentNode"),fe=J(w,"shadowRoot"),Pe=J(w,"attributes"),U=l&&l.prototype?J(l.prototype,"nodeType"):null,q=l&&l.prototype?J(l.prototype,"nodeName"):null,ee=l&&l.prototype?J(l.prototype,"ownerDocument"):null;if(typeof o=="function"){let f=n.createElement("template");f.content&&f.content.ownerDocument&&(n=f.content.ownerDocument)}let V,he="",Lt,Un=!1,Ne=0,Hn=function(){if(Ne>0)throw ke('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},Ee=function(a){Hn(),Ne++;try{return V.createHTML(a)}finally{Ne--}},Ni=function(a){Hn(),Ne++;try{return V.createScriptURL(a)}finally{Ne--}},Mi=function(){return Un||(Lt=Ha(g,i),Un=!0),Lt},Je=n,Ot=Je.implementation,Gn=Je.createNodeIterator,Ii=Je.createDocumentFragment,zi=Je.getElementsByTagName,$i=r.importNode,R=oi();t.isSupported=typeof ai=="function"&&typeof I=="function"&&Ot&&Ot.createHTMLDocument!==void 0;let Fi=La,Ui=Oa,Hi=Ca,Gi=Da,Bi=Pa,Wi=Na,Bn=Ma,ji=za,Wn=ni,L=null,Ct=T({},[...Qr,...fn,...hn,...mn,...Jr]),O=null,Dt=T({},[...ei,...gn,...ti,...xt]),N=Object.seal(De(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Me=null,jn=null,ae=Object.seal(De(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),qn=!0,Pt=!0,Vn=!1,Yn=!0,se=!1,le=!0,me=!1,Nt=!1,et=null,tt=null,Mt=!1,xe=!1,nt=!1,rt=!1,Zn=!0,Kn=!1,Xn="user-content-",It=!0,it=!1,Te={},te=null,zt=T({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]),Qn=null,Jn=T({},["audio","video","img","source","image","track"]),$t=null,er=T({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),ot="http://www.w3.org/1998/Math/MathML",at="http://www.w3.org/2000/svg",ne="http://www.w3.org/1999/xhtml",Ae=ne,Ft=!1,Ut=null,qi=T({},[ot,at,ne],pn),tr=H(["mi","mo","mn","ms","mtext"]),Ht=T({},tr),nr=H(["annotation-xml"]),Gt=T({},nr),Vi=T({},["title","style","font","a","script"]),Ie=null,Yi=["application/xhtml+xml","text/html"],Zi="text/html",C=null,Se=null,Ki=n.createElement("form"),rr=function(a){return a instanceof RegExp||a instanceof Function},Bt=function(){let a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(Se&&Se===a)return;(!a||typeof a!="object")&&(a={}),a=W(a),Ie=Yi.indexOf(a.PARSER_MEDIA_TYPE)===-1?Zi:a.PARSER_MEDIA_TYPE,C=Ie==="application/xhtml+xml"?pn:Ve,L=ue(a,"ALLOWED_TAGS",Ct,{transform:C}),O=ue(a,"ALLOWED_ATTR",Dt,{transform:C}),Ut=ue(a,"ALLOWED_NAMESPACES",qi,{transform:pn}),$t=ue(a,"ADD_URI_SAFE_ATTR",er,{transform:C,base:er}),Qn=ue(a,"ADD_DATA_URI_TAGS",Jn,{transform:C,base:Jn}),te=ue(a,"FORBID_CONTENTS",zt,{transform:C}),Me=ue(a,"FORBID_TAGS",W({}),{transform:C}),jn=ue(a,"FORBID_ATTR",W({}),{transform:C}),Te=F(a,"USE_PROFILES")?a.USE_PROFILES&&typeof a.USE_PROFILES=="object"?W(a.USE_PROFILES):a.USE_PROFILES:!1,qn=a.ALLOW_ARIA_ATTR!==!1,Pt=a.ALLOW_DATA_ATTR!==!1,Vn=a.ALLOW_UNKNOWN_PROTOCOLS||!1,Yn=a.ALLOW_SELF_CLOSE_IN_ATTR!==!1,se=a.SAFE_FOR_TEMPLATES||!1,le=a.SAFE_FOR_XML!==!1,me=a.WHOLE_DOCUMENT||!1,xe=a.RETURN_DOM||!1,nt=a.RETURN_DOM_FRAGMENT||!1,rt=a.RETURN_TRUSTED_TYPE||!1,Mt=a.FORCE_BODY||!1,Zn=a.SANITIZE_DOM!==!1,Kn=a.SANITIZE_NAMED_PROPS||!1,It=a.KEEP_CONTENT!==!1,it=a.IN_PLACE||!1,Wn=Sa(a.ALLOWED_URI_REGEXP)?a.ALLOWED_URI_REGEXP:ni,Ae=typeof a.NAMESPACE=="string"?a.NAMESPACE:ne,Ht=F(a,"MATHML_TEXT_INTEGRATION_POINTS")&&a.MATHML_TEXT_INTEGRATION_POINTS&&typeof a.MATHML_TEXT_INTEGRATION_POINTS=="object"?W(a.MATHML_TEXT_INTEGRATION_POINTS):T({},tr),Gt=F(a,"HTML_INTEGRATION_POINTS")&&a.HTML_INTEGRATION_POINTS&&typeof a.HTML_INTEGRATION_POINTS=="object"?W(a.HTML_INTEGRATION_POINTS):T({},nr);let c=F(a,"CUSTOM_ELEMENT_HANDLING")&&a.CUSTOM_ELEMENT_HANDLING&&typeof a.CUSTOM_ELEMENT_HANDLING=="object"?W(a.CUSTOM_ELEMENT_HANDLING):De(null);if(N=De(null),F(c,"tagNameCheck")&&rr(c.tagNameCheck)&&(N.tagNameCheck=c.tagNameCheck),F(c,"attributeNameCheck")&&rr(c.attributeNameCheck)&&(N.attributeNameCheck=c.attributeNameCheck),F(c,"allowCustomizedBuiltInElements")&&typeof c.allowCustomizedBuiltInElements=="boolean"&&(N.allowCustomizedBuiltInElements=c.allowCustomizedBuiltInElements),G(N),se&&(Pt=!1),nt&&(xe=!0),Te&&(L=T({},Jr),O=De(null),Te.html===!0&&(T(L,Qr),T(O,ei)),Te.svg===!0&&(T(L,fn),T(O,gn),T(O,xt)),Te.svgFilters===!0&&(T(L,hn),T(O,gn),T(O,xt)),Te.mathMl===!0&&(T(L,mn),T(O,ti),T(O,xt))),ae.tagCheck=null,ae.attributeCheck=null,F(a,"ADD_TAGS")&&(typeof a.ADD_TAGS=="function"?ae.tagCheck=a.ADD_TAGS:pe(a.ADD_TAGS)&&(L===Ct&&(L=W(L)),T(L,a.ADD_TAGS,C))),F(a,"ADD_ATTR")&&(typeof a.ADD_ATTR=="function"?ae.attributeCheck=a.ADD_ATTR:pe(a.ADD_ATTR)&&(O===Dt&&(O=W(O)),T(O,a.ADD_ATTR,C))),F(a,"ADD_URI_SAFE_ATTR")&&pe(a.ADD_URI_SAFE_ATTR)&&T($t,a.ADD_URI_SAFE_ATTR,C),F(a,"FORBID_CONTENTS")&&pe(a.FORBID_CONTENTS)&&(te===zt&&(te=W(te)),T(te,a.FORBID_CONTENTS,C)),F(a,"ADD_FORBID_CONTENTS")&&pe(a.ADD_FORBID_CONTENTS)&&(te===zt&&(te=W(te)),T(te,a.ADD_FORBID_CONTENTS,C)),It&&(L["#text"]=!0),me&&T(L,["html","head","body"]),L.table&&(T(L,["tbody"]),delete Me.tbody),a.TRUSTED_TYPES_POLICY){if(typeof a.TRUSTED_TYPES_POLICY.createHTML!="function")throw ke('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof a.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw ke('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');let p=V;V=a.TRUSTED_TYPES_POLICY;try{he=Ee("")}catch(v){throw V=p,v}}else a.TRUSTED_TYPES_POLICY===null?(V=void 0,he=""):(V===void 0&&(V=Mi()),V&&typeof he=="string"&&(he=Ee("")));H&&H(a),Se=a},ir=T({},[...fn,...hn,..._a]),or=T({},[...mn,...Ra]),Xi=function(a,c,p){return c.namespaceURI===ne?a==="svg":c.namespaceURI===ot?a==="svg"&&(p==="annotation-xml"||Ht[p]):!!ir[a]},Qi=function(a,c,p){return c.namespaceURI===ne?a==="math":c.namespaceURI===at?a==="math"&&Gt[p]:!!or[a]},Ji=function(a,c,p){return c.namespaceURI===at&&!Gt[p]||c.namespaceURI===ot&&!Ht[p]?!1:!or[a]&&(Vi[a]||!ir[a])},eo=function(a){let c=I(a);(!c||!c.tagName)&&(c={namespaceURI:Ae,tagName:"template"});let p=Ve(a.tagName),v=Ve(c.tagName);return Ut[a.namespaceURI]?a.namespaceURI===at?Xi(p,c,v):a.namespaceURI===ot?Qi(p,c,v):a.namespaceURI===ne?Ji(p,c,v):!!(Ie==="application/xhtml+xml"&&Ut[a.namespaceURI]):!1},ce=function(a){Ce(t.removed,{element:a});try{I(a).removeChild(a)}catch{if(k(a),!I(a))throw ke("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},st=function(a){ze(a);let c=P(a);if(c){let v=[];Oe(c,b=>{Ce(v,b)}),Oe(v,b=>{try{k(b)}catch{}})}let p=Pe(a);if(p)for(let v=p.length-1;v>=0;--v){let b=p[v],y=b&&b.name;if(typeof y=="string")try{a.removeAttribute(y)}catch{}}},ge=function(a,c){try{Ce(t.removed,{attribute:c.getAttributeNode(a),from:c})}catch{Ce(t.removed,{attribute:null,from:c})}if(c.removeAttribute(a),a==="is")if(xe||nt)try{ce(c)}catch{}else try{c.setAttribute(a,"")}catch{}},to=function(a){let c=Pe(a);if(c)for(let p=c.length-1;p>=0;--p){let v=c[p],b=v&&v.name;if(!(typeof b!="string"||O[C(b)]))try{a.removeAttribute(b)}catch{}}},ze=function(a){let c=[a];for(;c.length>0;){let p=c.pop();(U?U(p):p.nodeType)===K.element&&to(p);let b=P(p);if(b)for(let y=b.length-1;y>=0;--y)c.push(b[y])}},no=function(a){if(!le)return;let c=[a];for(;c.length>0;){let p=c.pop(),v=U?U(p):p.nodeType;if(v===K.processingInstruction||v===K.comment&&$(ii,p.data)){try{k(p)}catch{}continue}if(v===K.element){let y=p,_=C(q?q(p):p.nodeName);try{y.hasAttribute&&y.hasAttribute("patchsrc")&&y.removeAttribute("patchsrc"),y.hasAttribute&&y.hasAttribute("for")&&_!=="label"&&_!=="output"&&y.removeAttribute("for")}catch{}}let b=P(p);if(b)for(let y=b.length-1;y>=0;--y)c.push(b[y])}},ar=function(a){let c=null,p=null;if(Mt)a="<remove></remove>"+a;else{let y=Yr(a,/^[\r\n\t ]+/);p=y&&y[0]}Ie==="application/xhtml+xml"&&Ae===ne&&(a='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+a+"</body></html>");let v=V?Ee(a):a;if(Ae===ne)try{c=new m().parseFromString(v,Ie)}catch{}if(!c||!c.documentElement){c=Ot.createDocument(Ae,"template",null);try{c.documentElement.innerHTML=Ft?he:v}catch{}}let b=c.body||c.documentElement;return a&&p&&b.insertBefore(n.createTextNode(p),b.childNodes[0]||null),Ae===ne?zi.call(c,me?"html":"body")[0]:me?c.documentElement:b},sr=function(a){let c=ee?ee(a):a.ownerDocument;return Gn.call(c||a,a,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},lt=function(a){return a=je(a,Fi," "),a=je(a,Ui," "),a=je(a,Hi," "),a},Wt=function(a){var c;a.normalize();let p=ee?ee(a):a.ownerDocument,v=Gn.call(p||a,a,d.SHOW_TEXT|d.SHOW_COMMENT|d.SHOW_CDATA_SECTION|d.SHOW_PROCESSING_INSTRUCTION,null),b=v.nextNode();for(;b;)b.data=lt(b.data),b=v.nextNode();let y=(c=a.querySelectorAll)===null||c===void 0?void 0:c.call(a,"template");y&&Oe(y,_=>{_e(_.content)&&Wt(_.content)})},ct=function(a){let c=q?q(a):null;return typeof c!="string"||C(c)!=="form"?!1:typeof a.nodeName!="string"||typeof a.textContent!="string"||typeof a.removeChild!="function"||a.attributes!==Pe(a)||typeof a.removeAttribute!="function"||typeof a.setAttribute!="function"||typeof a.namespaceURI!="string"||typeof a.insertBefore!="function"||typeof a.hasChildNodes!="function"||a.nodeType!==U(a)||a.childNodes!==P(a)},_e=function(a){if(!U||typeof a!="object"||a===null)return!1;try{return U(a)===K.documentFragment}catch{return!1}},$e=function(a){if(!U||typeof a!="object"||a===null)return!1;try{return typeof U(a)=="number"}catch{return!1}};function re(f,a,c){f.length!==0&&Oe(f,p=>{p.call(t,a,c,Se)})}let ro=function(a,c){return!!(le&&a.hasChildNodes()&&!$e(a.firstElementChild)&&$(ri,a.textContent)&&$(ri,a.innerHTML)||le&&a.namespaceURI===ne&&c==="style"&&$e(a.firstElementChild)||a.nodeType===K.processingInstruction||le&&a.nodeType===K.comment&&$(ii,a.data))},io=function(a,c,p){if(!Me[c]&&ur(c)&&(N.tagNameCheck instanceof RegExp&&$(N.tagNameCheck,c)||N.tagNameCheck instanceof Function&&N.tagNameCheck(c)))return!1;if(It&&!te[c]){let v=I(a),b=P(a);if(b&&v){let y=b.length;for(let _=y-1;_>=0;--_){let D=a===p?A(b[_],!0):b[_];v.insertBefore(D,x(a))}}}return ce(a),!0},lr=function(a,c,p,v){return a.length===0?c:c===p||c===v?W(c):c},cr=function(a,c){if(re(R.beforeSanitizeElements,a,null),a!==c&&I(a)===null)return it&&ze(a),!0;if(ct(a))return ce(a),!0;let p=C(q?q(a):a.nodeName);if(L=lr(R.uponSanitizeElement,L,Ct,et),re(R.uponSanitizeElement,a,{tagName:p,allowedTags:L}),a!==c&&I(a)===null)return it&&ze(a),!0;if(ro(a,p))return ce(a),!0;if(Me[p]||!(ae.tagCheck instanceof Function&&ae.tagCheck(p))&&!L[p]){let b=io(a,p,c);return b===!1&&re(R.afterSanitizeElements,a,null),b}if((U?U(a):a.nodeType)===K.element&&!eo(a)||(p==="noscript"||p==="noembed"||p==="noframes")&&$($a,a.innerHTML))return ce(a),!0;if(se&&a.nodeType===K.text){let b=lt(a.textContent);a.textContent!==b&&(Ce(t.removed,{element:a.cloneNode()}),a.textContent=b)}return re(R.afterSanitizeElements,a,null),!1},dr=function(a,c,p){if(jn[c]||le&&c==="patchsrc"||le&&c==="for"&&a!=="label"&&a!=="output"||Zn&&(c==="id"||c==="name")&&(p in n||p in Ki))return!1;let v=O[c]||ae.attributeCheck instanceof Function&&ae.attributeCheck(c,a);if(!(Pt&&$(Gi,c))){if(!(qn&&$(Bi,c))){if(v){if(!$t[c]){if(!$(Wn,je(p,Bn,""))){if(!((c==="src"||c==="xlink:href"||c==="href")&&a!=="script"&&Zr(p,"data:")===0&&Qn[a])){if(!(Vn&&!$(Wi,je(p,Bn,"")))){if(p)return!1}}}}}else if(!(ur(a)&&(N.tagNameCheck instanceof RegExp&&$(N.tagNameCheck,a)||N.tagNameCheck instanceof Function&&N.tagNameCheck(a))&&(N.attributeNameCheck instanceof RegExp&&$(N.attributeNameCheck,c)||N.attributeNameCheck instanceof Function&&N.attributeNameCheck(c,a))||c==="is"&&N.allowCustomizedBuiltInElements&&(N.tagNameCheck instanceof RegExp&&$(N.tagNameCheck,p)||N.tagNameCheck instanceof Function&&N.tagNameCheck(p))))return!1}}return!0},oo=T({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),ur=function(a){return!oo[Ve(a)]&&$(ji,a)},ao=function(a,c,p,v){if(V&&typeof g=="object"&&typeof g.getAttributeType=="function"&&!p)switch(g.getAttributeType(a,c)){case"TrustedHTML":return Ee(v);case"TrustedScriptURL":return Ni(v)}return v},so=function(a,c,p,v){try{p?a.setAttributeNS(p,c,v):a.setAttribute(c,v),ct(a)?ce(a):Vr(t.removed)}catch{ge(c,a)}},pr=function(a){re(R.beforeSanitizeAttributes,a,null);let c=a.attributes;if(!c||ct(a))return;O=lr(R.uponSanitizeAttribute,O,Dt,tt);let p={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:O,forceKeepAttr:void 0},v=c.length,b=C(a.nodeName);for(;v--;){let y=c[v],_=y.name,D=y.namespaceURI,Y=y.value,Z=C(_),qt=Y,j=_==="value"?qt:ka(qt);if(p.attrName=Z,p.attrValue=j,p.keepAttr=!0,p.forceKeepAttr=void 0,re(R.uponSanitizeAttribute,a,p),j=p.attrValue,Kn&&(Z==="id"||Z==="name")&&Zr(j,Xn)!==0&&(ge(_,a),j=Xn+j),le&&$(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,j)){ge(_,a);continue}if(Z==="attributename"&&Yr(j,"href")){ge(_,a);continue}if(!p.forceKeepAttr){if(!p.keepAttr){ge(_,a);continue}if(!Yn&&$(Fa,j)){ge(_,a);continue}if(se&&(j=lt(j)),!dr(b,Z,j)){ge(_,a);continue}j=ao(b,Z,D,j),j!==qt&&so(a,_,D,j)}}re(R.afterSanitizeAttributes,a,null)},dt=function(a){let c=null,p=sr(a);for(re(R.beforeSanitizeShadowDOM,a,null);c=p.nextNode();)if(re(R.uponSanitizeShadowNode,c,null),cr(c,a),pr(c),_e(c.content)&&dt(c.content),(U?U(c):c.nodeType)===K.element){let b=fe(c);_e(b)&&(jt(b),dt(b))}re(R.afterSanitizeShadowDOM,a,null)},jt=function(a){let c=[{node:a,shadow:null}];for(;c.length>0;){let p=c.pop();if(p.shadow){dt(p.shadow);continue}let v=p.node,y=(U?U(v):v.nodeType)===K.element,_=P(v);if(_)for(let D=_.length-1;D>=0;--D)c.push({node:_[D],shadow:null});if(y){let D=q?q(v):null;if(typeof D=="string"&&C(D)==="template"){let Y=v.content;_e(Y)&&c.push({node:Y,shadow:null})}}if(y){let D=fe(v);_e(D)&&c.push({node:null,shadow:D},{node:D,shadow:null})}}};return t.sanitize=function(f){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},c=null,p=null,v=null,b=null;if(Ft=!f,Ft&&(f="<!-->"),typeof f!="string"&&!$e(f)&&(f=Aa(f),typeof f!="string"))throw ke("dirty is not a string, aborting");if(!t.isSupported)return f;Nt?(L=et,O=tt):Bt(a),(R.uponSanitizeElement.length>0||R.uponSanitizeAttribute.length>0)&&(L=W(L)),R.uponSanitizeAttribute.length>0&&(O=W(O)),t.removed=[];let y=it&&typeof f!="string"&&$e(f);if(y){no(f);let Y=q?q(f):f.nodeName;if(typeof Y=="string"){let Z=C(Y);if(!L[Z]||Me[Z])throw st(f),ke("root node is forbidden and cannot be sanitized in-place")}if(ct(f))throw st(f),ke("root node is clobbered and cannot be sanitized in-place");try{jt(f)}catch(Z){throw st(f),Z}}else if($e(f))c=ar("<!---->"),p=c.ownerDocument.importNode(f,!0),p.nodeType===K.element&&p.nodeName==="BODY"||p.nodeName==="HTML"?c=p:c.appendChild(p),jt(p);else{if(!xe&&!se&&!me&&f.indexOf("<")===-1)return V&&rt?Ee(f):f;if(c=ar(f),!c)return xe?null:rt?he:""}c&&Mt&&ce(c.firstChild);let _=y?f:c;try{let Y=sr(_);for(;v=Y.nextNode();)cr(v,_),pr(v),_e(v.content)&&dt(v.content)}catch(Y){throw y&&(st(f),Oe(t.removed,Z=>{Z.element&&ze(Z.element)})),Y}if(y)return Oe(t.removed,Y=>{Y.element&&ze(Y.element)}),se&&Wt(f),f;if(xe){if(se&&Wt(c),nt)for(b=Ii.call(c.ownerDocument);c.firstChild;)b.appendChild(c.firstChild);else b=c;return(O.shadowroot||O.shadowrootmode)&&(b=$i.call(r,b,!0)),b}let D=me?c.outerHTML:c.innerHTML;return me&&L["!doctype"]&&c.ownerDocument&&c.ownerDocument.doctype&&c.ownerDocument.doctype.name&&$(Ia,c.ownerDocument.doctype.name)&&(D="<!DOCTYPE "+c.ownerDocument.doctype.name+`>
`+D),se&&(D=lt(D)),V&&rt?Ee(D):D},t.setConfig=function(){let f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Bt(f),Nt=!0,et=L,tt=O},t.clearConfig=function(){Se=null,Nt=!1,et=null,tt=null,V=Lt,he=""},t.isValidAttribute=function(f,a,c){Se||Bt({});let p=C(f),v=C(a);return dr(p,v,c)},t.addHook=function(f,a){typeof a=="function"&&F(R,f)&&Ce(R[f],a)},t.removeHook=function(f,a){if(F(R,f)){if(a!==void 0){let c=ba(R[f],a);return c===-1?void 0:wa(R[f],c,1)[0]}return Vr(R[f])}},t.removeHooks=function(f){F(R,f)&&(R[f]=[])},t.removeAllHooks=function(){R=oi()},t}var ci=li();var Ga={headerOf:new Map,infoOf:new Map};function wn(e,t){if(t.size===0)return Ga;let n=new Map;for(let o of e){let l=o.partOf?.id;if(!l)continue;let s=n.get(l);s?s.push(o):n.set(l,[o])}let r=new Map,i=new Map;for(let[o,l]of n){if(l.length<2)continue;let s=Fe(l),d=s[0],u=d.partOf.type;if(!t.has(u))continue;let m=s.length;s.forEach((g,w)=>{r.set(g,d),i.set(g,{key:o,type:u,index:w+1,total:m,members:s})})}return{headerOf:r,infoOf:i}}var Ba={en:{loading:"Loading events\u2026",empty:"No upcoming events.",errorPrefix:"Could not load events: ",online:"Online",onlineEvent:"Online event",free:"Free",updated:"Updated",event:"Event",when:"When",lastUpdate:"Last update",location:"Location",locationUnknown:"Venue not specified",onlineLinkUnknown:"No public link",onlineLinkUnknownHint:"The organizer may share the link privately, e.g. after registration.",organizer:"Organizer",notAvailable:"\u2014",attendance:{"in-person":"In person",online:"Online",hybrid:"Hybrid"},eligibility:{open:"Open to all","members-only":"Members only","approval-required":"Approval required",restricted:"Restricted"},cfp:"Call for Proposals",cfpCloses:e=>`Call for Proposals \u2014 closes ${e}`,close:"Close",eventDetails:"Event details",addToGoogle:"Add to Google Calendar",addToOutlook:"Add to Outlook",addToYahoo:"Add to Yahoo",downloadIcs:"Download ICS",addToCalendar:"Add to calendar",openEventPage:"Open event page",groupSeries:"Series",groupMultipart:"Multi-part",groupCount:e=>`${e} occurrences`,groupCounter:(e,t)=>`${e} of ${t}`,previousOccurrence:"Previous occurrence",nextOccurrence:"Next occurrence"},es:{loading:"Cargando eventos\u2026",empty:"No hay pr\xF3ximos eventos.",errorPrefix:"No se pudieron cargar los eventos: ",online:"En l\xEDnea",onlineEvent:"Evento en l\xEDnea",free:"Gratis",updated:"Actualizado",event:"Evento",when:"Cu\xE1ndo",lastUpdate:"\xDAltima actualizaci\xF3n",location:"Lugar",locationUnknown:"Sede no especificada",onlineLinkUnknown:"Sin enlace p\xFAblico",onlineLinkUnknownHint:"El organizador podr\xEDa compartir el enlace de forma privada, por ejemplo tras inscribirte.",organizer:"Organizador",notAvailable:"\u2014",attendance:{"in-person":"Presencial",online:"En l\xEDnea",hybrid:"H\xEDbrido"},eligibility:{open:"Abierto a todos","members-only":"Solo miembros","approval-required":"Requiere aprobaci\xF3n",restricted:"Acceso restringido"},cfp:"Convocatoria de ponencias",cfpCloses:e=>`Convocatoria de ponencias \u2014 cierra ${e}`,close:"Cerrar",eventDetails:"Detalles del evento",addToGoogle:"A\xF1adir a Google Calendar",addToOutlook:"A\xF1adir a Outlook",addToYahoo:"A\xF1adir a Yahoo",downloadIcs:"Descargar ICS",addToCalendar:"A\xF1adir al calendario",openEventPage:"Abrir p\xE1gina del evento",groupSeries:"Serie",groupMultipart:"Multi-part",groupCount:e=>`${e} ocurrencias`,groupCounter:(e,t)=>`${e} de ${t}`,previousOccurrence:"Ocurrencia anterior",nextOccurrence:"Ocurrencia siguiente"}};function h(e,t){let n=document.createElement(e);return t&&(n.className=t),n}function M(e,t){return e.textContent=t,e}function En(e,t="event-description"){let n=h("div",t),r=S.parse(e,{async:!1});n.innerHTML=ci.sanitize(r);for(let i of n.querySelectorAll("a[href]"))i.setAttribute("target","_blank"),i.setAttribute("rel","noopener");return n}function xn(e,t){let n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("class",t),n.setAttribute("viewBox","0 0 24 24"),n.setAttribute("fill","none"),n.setAttribute("stroke","currentColor"),n.setAttribute("stroke-width","2"),n.setAttribute("stroke-linecap","round"),n.setAttribute("stroke-linejoin","round"),n.setAttribute("aria-hidden","true"),n.setAttribute("focusable","false");for(let r of e){let i=document.createElementNS("http://www.w3.org/2000/svg","path");i.setAttribute("d",r),n.append(i)}return n}function Wa(e){return xn({online:["M15 10l4.6-2.3A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.4.9L15 14","M3 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2"],"in-person":["M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0","M12 10h.01"],hybrid:["M4 5h9a2 2 0 0 1 2 2v5H2V7a2 2 0 0 1 2-2","M8 19h4","M10 12v7","M18 21s4-3.2 4-6a4 4 0 0 0-8 0c0 2.8 4 6 4 6","M18 15h.01"]}[e],"badge-icon")}function Xe(e){return xn({calendar:["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],"external-link":["M15 3h6v6","M10 14 21 3","M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"],edit:["M12 20h9","M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],trash:["M3 6h18","M8 6V4h8v2","M19 6l-1 14H6L5 6","M10 11v6","M14 11v6"],copy:["M8 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2","M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"],star:["M12 2l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.77 5.82 21 7 14.13 2 9.26l6.91-1L12 2"],check:["M20 6 9 17l-5-5"],bookmark:["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],plus:["M12 5v14","M5 12h14"],folder:["M4 4h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],collection:["M4 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2","M8 2v4","M16 2v4","M7 10h10","M7 14h7"]}[e],"action-icon")}function Tn(e,t){let n=h("span",`badge attendance-badge attendance-${e}`);return n.append(Wa(e),document.createTextNode(t)),n}function An(e,t){let n=t.eligibility[e.type],r=e.url?h("a"):h("span");if(r.classList.add("badge","eligibility-badge"),e.url){let i=r;i.href=e.url,i.target="_blank",i.rel="noopener"}return r.textContent=n,e.note&&(r.title=e.note,r.setAttribute("aria-label",`${n}: ${e.note}`)),r}function Sn(e,t){let n=h("a","badge cfp-badge");n.href=e.url,n.target="_blank",n.rel="noopener",n.textContent=t.cfp;let r=Ze(e.closesAt,void 0);if(r){let i=t.cfpCloses(r);n.title=i,n.setAttribute("aria-label",i)}return n}function ja(e,t){return e==="multipart"?t.groupMultipart:t.groupSeries}function qa(e,t){let n=ja(e.type,t),r=h("span","badge event-group-badge");return r.textContent=n,r.setAttribute("aria-label",`${n}, ${t.groupCount(e.total)}`),r}function _n(e,t){let n=vi(e,t),r=e.locationLink??bi(n),i=Rn(e,t);if(!r){let l=M(h("span"),i);return Va(e)&&(l.title=t.onlineLinkUnknownHint),l}let o=h("a");return o.href=r,o.target="_blank",o.rel="noopener",o.textContent=i,o}function Va(e){return e.attendanceMode==="online"&&!e.locationLink&&(!e.location||e.location==="online")}function vi(e,t){return e.location&&e.location!=="online"?e.location:e.attendanceMode==="online"?t.onlineLinkUnknown:e.attendanceMode==="in-person"||e.attendanceMode==="hybrid"?t.locationUnknown:t.online}function Rn(e,t){let n=vi(e,t),r=e.locationLink??bi(n);return Ya(r?ht(r):n,t)}function Ya(e,t){return!e||e==="online"?t.online:e==="Online link"||e==="Online event"?t.onlineEvent:e}function bi(e){if(e)try{let t=new URL(e);return t.protocol==="http:"||t.protocol==="https:"?e:void 0}catch{return}}function Ln(e){let t=pt(e.startDate);return t!==null&&t<Date.now()}function wi(e){return e.feed?(e.sort==="none"?[...e.feed.events]:Fe(e.feed.events)).filter(n=>e.showPast||!Ln(n)):[]}function _t(e){return e.layout!=="cards"||e.groupEvents.size===0?{headerOf:new Map,infoOf:new Map}:wn(wi(e),e.groupEvents)}function On(e){let t=wi(e);if(e.layout!=="cards"||e.groupEvents.size===0)return t.slice(0,e.limit);let{headerOf:n}=wn(t,e.groupEvents),r=new Set,i=[];for(let o of t){let l=n.get(o)??o;r.has(l)||(r.add(l),i.push(l))}return i.slice(0,e.limit)}function Za(e,t){if(e.amount===0)return t.free;if(e.currency)try{return new Intl.NumberFormat(void 0,{style:"currency",currency:e.currency}).format(e.amount)}catch{return`${e.amount} ${e.currency}`}return String(e.amount)}function Cn(e,t){let n=Za(e,t);if(!e.url)return M(h("span","price"),n);let r=h("a","price");return r.href=e.url,r.target="_blank",r.rel="noopener",r.textContent=n,r}function di(e,t){if(!e)return;let n=ft(e),r=new Date(`${e}${t==="UTC"&&!n?"Z":""}`);return Number.isNaN(r.valueOf())?void 0:r}function Tt(e,t){let n=e.toISOString();return t?n.slice(0,10).replace(/-/g,""):n.replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z")}function Ka(e){let t=new Date(e);return t.setUTCDate(t.getUTCDate()+1),t}function Xa(e){let t=di(e.startDate,e.timezone);if(!t)return;let n=ft(e.startDate),r=di(n&&e.endDate?Zt(e.endDate,1):e.endDate,e.timezone)??(n?Ka(t):t);return{start:t,end:r,dateOnly:n}}function ki(e){return e.description??""}function Qa(e,t,n){if(e==="link")return t.link;let r=Xa(t);if(!r)return;let i=Tt(r.start,r.dateOnly),o=Tt(r.end,r.dateOnly),l=ki(t),s=Rn(t,n);if(e==="google-calendar"){let d=new URL("https://calendar.google.com/calendar/render");return d.searchParams.set("action","TEMPLATE"),d.searchParams.set("text",t.name),d.searchParams.set("dates",`${i}/${o}`),l&&d.searchParams.set("details",l),s&&d.searchParams.set("location",s),t.timezone&&d.searchParams.set("ctz",t.timezone),d.toString()}if(e==="outlook-calendar"){let d=new URL("https://outlook.live.com/calendar/0/action/compose");return d.searchParams.set("rru","addevent"),d.searchParams.set("subject",t.name),d.searchParams.set("startdt",r.start.toISOString()),d.searchParams.set("enddt",r.end.toISOString()),l&&d.searchParams.set("body",l),s&&d.searchParams.set("location",s),d.toString()}if(e==="yahoo-calendar"){let d=new URL("https://calendar.yahoo.com/");return d.searchParams.set("v","60"),d.searchParams.set("title",t.name),d.searchParams.set("st",i),d.searchParams.set("et",o),l&&d.searchParams.set("desc",l),s&&d.searchParams.set("in_loc",s),d.toString()}return`data:text/calendar;charset=utf-8,${encodeURIComponent(Ja(t,r,n))}`}function Ye(e){return e.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}function Ja(e,t,n){let r=d=>Tt(d,t.dateOnly),i=t.dateOnly?";VALUE=DATE":"",o=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//OpenTechEvents//ote-events//EN","BEGIN:VEVENT",`UID:${Ye(e.link??e.name)}`,`DTSTAMP:${Tt(new Date,!1)}`,`DTSTART${i}:${r(t.start)}`,`DTEND${i}:${r(t.end)}`,`SUMMARY:${Ye(e.name)}`],l=ki(e),s=Rn(e,n);return l&&o.push(`DESCRIPTION:${Ye(l)}`),s&&o.push(`LOCATION:${Ye(s)}`),e.link&&o.push(`URL:${Ye(e.link)}`),o.push("END:VEVENT","END:VCALENDAR"),o.join(`\r
`)}function es(e){if(!e)return null;let n=new Date(e).valueOf();return Number.isNaN(n)?null:n}function ts(e){let t=es(e);if(t===null)return e;let n=Math.round((t-Date.now())/1e3),r=Math.abs(n),i=[["year",31536e3,"y"],["month",2592e3,"mo"],["week",604800,"w"],["day",86400,"d"],["hour",3600,"h"],["minute",60,"m"]];for(let[,o,l]of i)if(r>=o)return`${Math.max(1,Math.round(r/o))}${l}`;return"now"}function Ze(e,t){if(!e)return;let n=/^\d{4}-\d{2}-\d{2}$/.test(e),r=new Date(`${e}${t==="UTC"&&!n?"Z":""}`);if(Number.isNaN(r.valueOf()))return t?`${e} (${t})`:e;let i=n?{weekday:"short",month:"short",day:"numeric",year:"numeric"}:{weekday:"short",month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"},o=new Intl.DateTimeFormat(void 0,i).format(r);return t&&!n?`${o} (${t})`:o}function ui(e){if(!e)return;let t=/^\d{4}-\d{2}-\d{2}$/.test(e),n=new Date(e);if(Number.isNaN(n.valueOf()))return e;let r=t?{month:"short",day:"numeric"}:{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"};return new Intl.DateTimeFormat(void 0,r).format(n)}function ns(e){if(!e)return;let t=new Date(e);return Number.isNaN(t.valueOf())?e:new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric"}).format(t)}function rs(e,t){if(!e||!t)return!1;let n=new Date(e),r=new Date(t);return Number.isNaN(n.valueOf())||Number.isNaN(r.valueOf())?!1:n.getFullYear()===r.getFullYear()&&n.getMonth()===r.getMonth()&&n.getDate()===r.getDate()}function pi(e){if(!e||/^\d{4}-\d{2}-\d{2}$/.test(e))return;let t=new Date(e);if(!Number.isNaN(t.valueOf()))return new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).format(t)}function Dn(e){let t=ui(e.startDate),n=ui(e.endDate);if(t&&e.endDate&&rs(e.startDate,e.endDate)){let r=ns(e.startDate),i=pi(e.startDate),o=pi(e.endDate);if(r&&i&&o)return`${r}, ${i}-${o}`}return t&&n&&n!==t?`${t} \u2013 ${n}`:t??e.dateLabel}function Pn(e){if(e.dateLabel)return e.dateLabel;let t=Ze(e.startDate,e.timezone),n=Ze(e.endDate,e.timezone);return t&&n?`${t} to ${n}`:t}function is(e){let t=Dn(e),n=Pn(e)??Ue(e),r=t??n;if(!r)return;let i=M(h("p","event-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function os(e){let t=Dn(e),n=Pn(e)??Ue(e),r=t??n;if(!r)return;let i=M(h("span","event-detail-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function Nn(e,t){if(!e.image)return;let n=h("img","event-image");return n.src=e.image.url,n.alt=e.image.alt??e.name,n.loading="lazy",n.addEventListener("error",()=>{n.replaceWith(yi(t))}),n}function yi(e){if(e){let t=h("img","event-image event-image-placeholder");return t.src=e,t.alt="",t.loading="lazy",t.addEventListener("error",()=>t.replaceWith(h("div","event-image event-image-placeholder"))),t}return h("div","event-image event-image-placeholder")}function as(e,t,n,r){let i=h("li","event");Ln(e)&&i.classList.add("event-past"),Mn(i,e,t),ss(i,e,t);let o=r?.infoOf.get(e);o&&(i.classList.add("event-stacked"),i.append(qa(o,n))),t.previewFields.has("image")&&i.append(Nn(e,t.placeholderImage)??yi(t.placeholderImage));let l=h("div","event-body");i.append(l);let s=h("h3","event-title");if(e.link&&t.eventClick==="link"){let m=h("a");m.href=e.link,m.target="_blank",m.rel="noopener",m.textContent=e.name,s.append(m)}else s.textContent=e.name;if(l.append(s),t.previewFields.has("when")){let m=is(e);m&&l.append(m)}let d=h("div","event-badges");t.previewFields.has("attendance")&&e.attendanceMode&&d.append(Tn(e.attendanceMode,n.attendance[e.attendanceMode])),t.previewFields.has("price")&&e.price&&d.append(Cn(e.price,n)),t.previewFields.has("eligibility")&&e.eligibility&&d.append(An(e.eligibility,n)),t.previewFields.has("cfp")&&e.cfp&&d.append(Sn(e.cfp,n)),In(d,e,t);let u=h("div","event-meta");if(d.children.length>0&&u.append(d),t.previewFields.has("location")){let m=h("p","event-location");m.append(_n(e,n)),u.append(m)}if(u.children.length>0&&l.append(u),t.previewFields.has("organizer")&&e.organizerName&&l.append(M(h("p","event-organizer"),e.organizerName)),t.previewFields.has("description")){let m=Vt(e.description,220);m&&l.append(En(m))}if(t.previewFields.has("tags")&&e.tags&&e.tags.length>0){let m=h("ul","tags");for(let g of e.tags)m.append(M(h("li","tag"),g));l.append(m)}return fs(l,e,n,t),i}function kn(e,t){return e.details?.find(n=>n.label===t)?.value}var Ei=new Set(["ID","Source","Image","Updated"]);function ss(e,t,n){n.eventClick!=="none"&&(e.classList.add("event-clickable"),e.tabIndex=0,e.addEventListener("click",r=>{let i=r.target;i instanceof Element&&i.closest("a, button, summary")||fi(t,n)}),e.addEventListener("keydown",r=>{r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),fi(t,n))}))}function fi(e,t){t.onEventOpen?.(e),t.eventClick==="link"&&e.link&&window.open(e.link,"_blank","noopener")}function ye(e,t,n){n&&e.append(M(h("dt"),t),M(h("dd"),n))}function yn(e,t,n){if(!n)return;let r=h("dd");r.append(n),e.append(M(h("dt"),t),r)}function ls(e,t){let n=h("span",`event-header-icon ${e}`);return n.title=t,n.setAttribute("aria-label",t),n}function cs(e,t,n){let r=h("li","event event-row");Ln(e)&&r.classList.add("event-past"),Mn(r,e,n);let i=h("details","event-accordion");r.append(i);let o=h("summary","event-summary");i.append(o);let l=h("span","event-summary-title");l.textContent=e.name,o.append(l);let s=Pn(e)??Ue(e),d=Dn(e)??s;o.append(M(h("span","event-summary-when"),d||t.notAvailable)),o.append(M(h("span","event-summary-updated"),ts(e.updatedAt??kn(e,"Updated"))??t.notAvailable));let u=h("div","event-details"),m=n.detailFields.has("image")&&!!e.image,g=e.description?.trim().length??0;!m&&g>0&&g<=180&&u.classList.add("event-details-compact"),i.append(u);let w=h("div","event-details-content"),A=h("div","event-details-main"),k=h("aside","event-details-aside");if(w.append(A,k),u.append(w),m){let I=Nn(e,n.placeholderImage);I&&k.append(I)}let x=h("div","event-badges");n.detailFields.has("attendance")&&e.attendanceMode&&x.append(Tn(e.attendanceMode,t.attendance[e.attendanceMode])),n.detailFields.has("price")&&e.price&&x.append(Cn(e.price,t)),n.detailFields.has("eligibility")&&e.eligibility&&x.append(An(e.eligibility,t)),n.detailFields.has("cfp")&&e.cfp&&x.append(Sn(e.cfp,t)),In(x,e,n),x.children.length>0&&k.append(x),n.detailFields.has("description")&&e.description&&A.append(En(e.description));let P=h("dl","event-detail-list");n.detailFields.has("when")&&ye(P,t.when,s),n.detailFields.has("location")&&yn(P,t.location,_n(e,t)),n.detailFields.has("organizer")&&ye(P,t.organizer,e.organizerName),ye(P,t.updated,Ze(e.updatedAt??kn(e,"Updated"),void 0));for(let I of e.details??[])Ei.has(I.label)||ye(P,I.label,I.value);if(P.children.length>0&&k.append(P),n.detailFields.has("tags")&&e.tags&&e.tags.length>0){let I=h("ul","tags");for(let fe of e.tags)I.append(M(h("li","tag"),fe));A.append(I)}return _i(u,e,t,n),r}function hi(e,t){return e==="google-calendar"?t.addToGoogle:e==="outlook-calendar"?t.addToOutlook:e==="yahoo-calendar"?t.addToYahoo:e==="ics"?t.downloadIcs:t.openEventPage}var At=new Set(["google-calendar","outlook-calendar","yahoo-calendar","ics"]);function ds(e){return typeof e!="string"&&"type"in e}function us(e){return typeof e!="string"&&"id"in e}function Ke(e){return typeof e=="string"?e:e.type}function xi(e,t){return!e.layouts||e.layouts.includes(t)}function Ti(e,t){let n=e.placement??"detail";return n===t||n==="both"}function ps(e,t,n){return typeof e=="string"?t==="detail":Ti(e,t)&&xi(e,n)}function Ai(e,t,n){return Li(e,t).filter(r=>(typeof r=="string"||ds(r))&&ps(r,n,e.layout))}function Si(e,t,n){return Li(e,t).filter(r=>us(r)&&Ti(r,n)&&xi(r,e.layout))}function St(e,t,n,r,i){let o=Ke(t),l=Qa(o,n,r);if(!l)return;let s=h("a");s.href=l,s.target=o==="ics"?"_self":"_blank",s.rel="noopener",o==="ics"&&s.setAttribute("download","event.ics"),o==="link"?s.append(Xe("external-link"),document.createTextNode(hi(o,r))):s.textContent=hi(o,r),s.addEventListener("click",()=>i.onEventAction?.(t,n)),e.append(s)}function _i(e,t,n,r){let i=h("div","event-actions"),o=Ai(r,t,"detail"),l=o.filter(s=>At.has(Ke(s)));if(l.length>0){let s=h("details","event-action-menu"),d=h("summary","event-action-menu-trigger");d.append(Xe("calendar"),document.createTextNode(n.addToCalendar)),s.append(d);let u=h("div","event-action-menu-items");for(let m of l)St(u,m,t,n,r);u.children.length>0&&(s.append(u),i.append(s))}for(let s of o)At.has(Ke(s))||St(i,s,t,n,r);for(let s of Si(r,t,"detail"))i.append(Ri(s,t,r));i.children.length>0&&e.append(i)}function fs(e,t,n,r){let i=Ai(r,t,"preview"),o=Si(r,t,"preview");if(i.length===0&&o.length===0)return;let l=h("div","event-actions event-preview-actions"),s=i.filter(d=>At.has(Ke(d)));if(s.length>0){let d=h("details","event-action-menu"),u=h("summary","event-action-menu-trigger");u.append(Xe("calendar"),document.createTextNode(n.addToCalendar)),d.append(u);let m=h("div","event-action-menu-items");for(let g of s)St(m,g,t,n,r);m.children.length>0&&(d.append(m),l.append(d))}for(let d of i)At.has(Ke(d))||St(l,d,t,n,r);for(let d of o)l.append(Ri(d,t,r));e.append(l)}function Ri(e,t,n){let r=h("button");return r.type="button",r.classList.add("event-custom-action"),e.variant==="danger"&&r.classList.add("event-action-danger"),e.pressed!==void 0&&r.setAttribute("aria-pressed",String(e.pressed)),e.icon?r.append(Xe(e.icon),document.createTextNode(e.label)):r.textContent=e.label,r.addEventListener("click",()=>{n.onEventAction?.(e,t),e.onClick(t,Rt(n,t))}),r}function Rt(e,t){let n=e.eventContext?.(t)??{previewEvent:t,index:e.feed?.events.indexOf(t)??-1},r=_t(e).infoOf.get(t);return r?{...n,group:r}:n}function Li(e,t){return typeof e.eventActions=="function"?e.eventActions(Rt(e,t)):e.eventActions}function hs(e){return e?(Array.isArray(e)?e:e.split(/\s+/)).map(n=>n.trim()).filter(Boolean):[]}function Mn(e,t,n){for(let r of hs(n.eventClassName?.(Rt(n,t))))e.classList.add(r)}function In(e,t,n){let r=n.eventBadges?.(Rt(n,t))??[];for(let i of r){if(typeof i=="string"){let l=h("span","badge event-custom-badge event-custom-badge-default");l.title=i,l.append(M(h("span","event-custom-badge-label"),i)),e.append(l);continue}let o=h("span",`badge event-custom-badge event-custom-badge-${i.tone??"default"}`);o.title=i.title??i.label,i.icon&&o.append(Xe(i.icon)),o.append(M(h("span","event-custom-badge-label"),i.label)),e.append(o)}}function mi(e){return xn([e==="left"?"M15 18l-6-6 6-6":"M9 18l6-6-6-6"],"event-modal-nav-icon")}function ms(e,t,n){let r=h("div","event-modal-nav"),i=h("button","event-modal-nav-button");i.type="button",i.setAttribute("aria-label",t.previousOccurrence),i.title=t.previousOccurrence,i.append(mi("left"));let o=e.members[e.index-2];i.disabled=!o,i.addEventListener("click",()=>{o&&n.onEventOpen?.(o)});let l=h("span","event-modal-nav-counter");l.setAttribute("aria-live","polite"),l.textContent=t.groupCounter(e.index,e.total);let s=h("button","event-modal-nav-button");s.type="button",s.setAttribute("aria-label",t.nextOccurrence),s.title=t.nextOccurrence,s.append(mi("right"));let d=e.members[e.index];return s.disabled=!d,s.addEventListener("click",()=>{d&&n.onEventOpen?.(d)}),r.append(i,l,s),r}function gi(e,t,n,r){let i=h("div","event-modal-backdrop");i.tabIndex=-1,i.addEventListener("click",x=>{x.target===i&&n.onEventClose?.()}),i.addEventListener("keydown",x=>{x.key==="Escape"&&n.onEventClose?.()});let o=h("section","event-modal");Mn(o,e,n);let l=e.description?.trim().length??0;!e.image&&l>0&&l<=180&&o.classList.add("event-modal-compact"),o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-label",t.eventDetails),i.append(o);let s=h("div","event-modal-header");s.append(M(h("h2","event-modal-title"),e.name));let d=h("button","event-modal-close");d.type="button",d.textContent="\xD7",d.title=t.close,d.setAttribute("aria-label",t.close),d.addEventListener("click",()=>n.onEventClose?.()),s.append(d),o.append(s);let u=r?.infoOf.get(e),m=h("div","event-modal-content"),g=h("div","event-modal-main"),w=h("aside","event-modal-aside");if(m.append(g,w),o.append(m),n.detailFields.has("image")&&e.image){let x=Nn(e,n.placeholderImage);x&&w.append(x)}let A=h("div","event-badges");n.detailFields.has("attendance")&&e.attendanceMode&&A.append(Tn(e.attendanceMode,t.attendance[e.attendanceMode])),n.detailFields.has("price")&&e.price&&A.append(Cn(e.price,t)),n.detailFields.has("eligibility")&&e.eligibility&&A.append(An(e.eligibility,t)),n.detailFields.has("cfp")&&e.cfp&&A.append(Sn(e.cfp,t)),In(A,e,n),A.children.length>0&&w.append(A),n.detailFields.has("description")&&e.description&&g.append(En(e.description));let k=h("dl","event-detail-list");n.detailFields.has("when")&&yn(k,t.when,os(e)),u&&u.total>1&&k.append(ms(u,t,n)),n.detailFields.has("location")&&yn(k,t.location,_n(e,t)),n.detailFields.has("organizer")&&ye(k,t.organizer,e.organizerName),ye(k,t.updated,Ze(e.updatedAt??kn(e,"Updated"),void 0));for(let x of e.details??[])Ei.has(x.label)||ye(k,x.label,x.value);if(k.children.length>0&&w.append(k),n.detailFields.has("tags")&&e.tags&&e.tags.length>0){let x=h("ul","tags");for(let P of e.tags)x.append(M(h("li","tag"),P));g.append(x)}return _i(o,e,t,n),queueMicrotask(()=>d.focus()),i}function Oi(e,t){e.replaceChildren();let n=Ba[t.lang];if(t.status==="idle"||t.status==="loading"){e.append(M(h("p","message"),n.loading));return}if(t.status==="error"){e.append(M(h("p","message error"),`${n.errorPrefix}${t.errorMessage}`));return}let r=On(t);if(r.length===0){e.append(M(h("p","message"),t.emptyMessage??n.empty));return}if(t.layout==="calendar"){e.append(M(h("div","calendar-host"),n.loading)),t.selectedEvent&&e.append(gi(t.selectedEvent,n,t));return}let i=_t(t),o=h("ul",`events layout-${t.layout}`);if(t.layout==="list"){let l=h("li","event-list-header");l.append(M(h("span"),n.event),M(h("span"),n.when),ls("icon-updated",n.lastUpdate)),o.append(l)}for(let l of r)o.append(t.layout==="list"?cs(l,n,t):as(l,t,n,i));e.append(o),t.selectedEvent&&e.append(gi(t.selectedEvent,n,t,i))}var Ci=`
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
`;var zn=class extends HTMLElement{static observedAttributes=["feed","limit","theme","lang","show-past","layout","fields","fields-preview","fields-detail","card-width","group-events","placeholder-image","event-click","event-actions","sort","empty-message"];#u;#i;#o;#n;#d=!1;#a=[];#s;#l=new WeakMap;#r="idle";#c="";#p=0;#t;#h=[];#m;#g;#v;#f=0;#E=!1;constructor(){super();let t=this.attachShadow({mode:"open"});this.#u=document.createElement("style"),this.#u.textContent=Ci,this.#i=document.createElement("div"),this.#i.className="ote-events",t.append(this.#u,this.#i)}connectedCallback(){this.#d?this.#e():this.#b()}disconnectedCallback(){this.#y()}attributeChangedCallback(t){this.isConnected&&(t==="feed"?this.#b():this.#e())}get feedData(){return this.#n}set feedData(t){this.#w(t)}get events(){if(this.#n)return Array.isArray(this.#n)?this.#n:this.#n.events}set events(t){this.#w(t)}get event(){return this.events?.[0]}set event(t){this.#w(t==null?t:[t])}get eventActions(){return this.#h}set eventActions(t){this.#h=Array.isArray(t)||typeof t=="function"?t:[],this.isConnected&&this.#e()}get eventClassName(){return this.#m}set eventClassName(t){this.#m=typeof t=="function"?t:void 0,this.isConnected&&this.#e()}get eventBadges(){return this.#g}set eventBadges(t){this.#g=typeof t=="function"?t:void 0,this.isConnected&&this.#e()}async#b(){if(this.#d)return;let t=this.getAttribute("feed");if(!t){this.#r="error",this.#c='Missing required "feed" attribute.',this.#t=void 0,this.#e();return}this.#r="loading",this.#e();let n=++this.#p;try{let r=await fetch(t);if(!r.ok)throw new Error(`HTTP ${r.status}`);let i=await r.text(),o=JSON.parse(i),l=mt(o);if(n!==this.#p)return;this.#o=l,this.#n=o,this.#d=!1,this.#a=$n(o),this.#s=Di(o,t),this.#l=Pi(l,this.#a,this.#s),this.#r="loaded",this.#t=void 0}catch(r){if(n!==this.#p)return;this.#r="error",this.#c=r instanceof Error?r.message:String(r),this.#t=void 0}this.#e()}#w(t){if(this.#p++,t==null){this.#n=void 0,this.#d=!1,this.#o=void 0,this.#a=[],this.#s=void 0,this.#l=new WeakMap,this.#c="",this.#t=void 0,this.isConnected&&this.#b();return}this.#n=t,this.#d=!0;try{this.#o=mt(t),this.#a=$n(t),this.#s=Di(t),this.#l=Pi(this.#o,this.#a,this.#s),this.#r="loaded",this.#c="",this.#t=void 0}catch(n){this.#o=void 0,this.#a=[],this.#s=void 0,this.#l=new WeakMap,this.#r="error",this.#c=n instanceof Error?n.message:String(n),this.#t=void 0}this.isConnected&&this.#e()}#e(){this.style.setProperty("--ote-card-min-width",Wr(this.getAttribute("card-width")));let t=Ir(Mr(this.getAttribute("lang")),navigator.language),n={status:this.#r,errorMessage:this.#c,feed:this.#o,lang:t,limit:Nr(this.getAttribute("limit")),showPast:zr(this.getAttribute("show-past")),sort:Fr(this.getAttribute("sort")),layout:$r(this.getAttribute("layout")),previewFields:Hr(this.getAttribute("fields-preview")??this.getAttribute("fields")),detailFields:Gr(this.getAttribute("fields-detail")??this.getAttribute("fields")),groupEvents:Br(this.getAttribute("group-events")),placeholderImage:this.getAttribute("placeholder-image")?.trim()||void 0,emptyMessage:this.getAttribute("empty-message")?.trim()||void 0,eventClick:Et(this.getAttribute("event-click")),eventActions:this.#T(),eventClassName:this.#m,eventBadges:this.#g,eventContext:r=>this.#l.get(r)??{previewEvent:r,index:-1},selectedEvent:this.#t,onEventOpen:r=>{this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#k(void 0,r,n)})),Et(this.getAttribute("event-click"))==="modal"&&(this.#t=r,this.#e())},onEventClose:()=>{this.#t=void 0,this.#e()},onEventAction:(r,i)=>{let o=typeof r=="string"?r:"type"in r?r.type:r.id;this.dispatchEvent(new CustomEvent("ote-event-action",{detail:this.#k(o,i,n)}))}};if(Oi(this.#i,n),n.layout==="calendar"&&n.status==="loaded"){let r=On(n);if(r.length>0){this.#x(r,n.lang);return}}this.#y()}async#x(t,n){this.#y();let r=++this.#f;try{let i=await import(new URL("./calendar-layout.js",import.meta.url).href);if(r!==this.#f||!this.isConnected)return;this.#E||(this.#u.textContent+=i.CALENDAR_CSS,this.#E=!0);let o=this.#i.querySelector(".calendar-host");if(!o)return;o.classList.remove("ec-dark","ec-auto-dark");let l=this.getAttribute("theme");l==="dark"?o.classList.add("ec-dark"):l!=="light"&&o.classList.add("ec-auto-dark"),o.replaceChildren(),this.#v=i.renderCalendar(o,t,{lang:n,onEventClick:s=>{let d=Et(this.getAttribute("event-click"));this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#k(void 0,s)})),d==="link"&&s.link?window.open(s.link,"_blank","noopener"):d==="modal"&&(this.#t=s,this.#e())}})}catch(i){if(r!==this.#f||!this.isConnected)return;let o=this.#i.querySelector(".calendar-host");o&&(o.textContent=i instanceof Error?i.message:String(i))}}#T(){let t=Ur(this.getAttribute("event-actions")),n=this.#h;return typeof n=="function"?r=>[...t,...n(r)]:[...t,...n]}#k(t,n,r){let i=this.#l.get(n)??{previewEvent:n,index:-1},o=r?_t(r).infoOf.get(n):void 0;return{...t?{action:t}:{},event:n,previewEvent:n,originalEvent:i.originalEvent,index:i.index,feed:i.feed,source:i.source,...o?{group:o}:{}}}#y(){this.#f++,this.#v?.destroy(),this.#v=void 0}};function $n(e){return Array.isArray(e)?e:Array.isArray(e.events)?e.events:[]}function Qe(e){return typeof e=="string"&&e.trim()?e:void 0}function Di(e,t){let n=$n(e)[0],r=Array.isArray(e)?void 0:Qe(e.title??e._feedTitle),i={url:t??Qe(n?._feedUrl),title:r??Qe(n?._feedTitle)};return i.url||i.title?i:void 0}function Pi(e,t,n){let r=new WeakMap;return e.events.forEach((i,o)=>{let l=t[o],s={url:Qe(l?._feedUrl)??n?.url,title:Qe(l?._feedTitle)??n?.title};r.set(i,{previewEvent:i,originalEvent:l,index:o,feed:s.url||s.title?s:n,source:l?.source})}),r}function Fn(){customElements.get("ote-events")||customElements.define("ote-events",zn)}Fn();export{Fn as defineOteEvents};
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.4.13 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.13/LICENSE *)
*/
//# sourceMappingURL=ote-events.js.map
