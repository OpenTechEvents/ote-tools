function Kt(e,t=320){if(!e)return;let n=e.replace(/\s+/g," ").trim();return n.length>t?`${n.slice(0,t-1)}\u2026`:n}function yr(e){if(Array.isArray(e))return e.length>0?e.join(", "):void 0;if(typeof e=="string")return e.trim()||void 0;if(typeof e=="number"||typeof e=="boolean")return String(e);if(e&&typeof e=="object")return JSON.stringify(e)}function Xt(e){return e.flatMap(([t,n])=>{let r=yr(n);return r?[{label:t,value:r}]:[]})}function ft(e){if(!e)return null;let t=/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/.exec(e),r=(t?new Date(`${t[1]}T${t[2]??"00:00:00"}`):new Date(e)).valueOf();return Number.isNaN(r)?null:r}function Fe(e){let t=Date.now();return e.map((n,r)=>({event:n,index:r,sortDate:ft(n.startDate)})).sort((n,r)=>{if(n.sortDate===null&&r.sortDate===null)return n.index-r.index;if(n.sortDate===null)return 1;if(r.sortDate===null)return-1;let i=n.sortDate<t,o=r.sortDate<t;return i!==o?i?1:-1:i?r.sortDate-n.sortDate:n.sortDate-r.sortDate}).map(({event:n})=>n)}function ht(e){return e!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function Qt(e,t){let n=new Date(`${e}T00:00:00Z`);return n.setUTCDate(n.getUTCDate()+t),n.toISOString().slice(0,10)}function pt(e,t){if(!e)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(e))return new Intl.DateTimeFormat(void 0,{dateStyle:"medium"}).format(new Date(`${e}T00:00:00Z`));let r=new Date(`${e}${t==="UTC"?"Z":""}`);if(!Number.isNaN(r.valueOf())){let i=new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short"}).format(r);return t?`${i} (${t})`:i}return t?`${e} (${t})`:e}function Jt(e){return e.location?.venue??mt(e.location?.onlineUrl)??"online"}function mt(e){if(!e)return;let t;try{t=new URL(e).hostname.toLowerCase().replace(/^www\./,"")}catch{return"Online event"}return t==="meet.google.com"?"Google Meet":t==="teams.microsoft.com"?"Microsoft Teams":t==="meet.jit.si"||t.endsWith(".jitsi.net")?"Jitsi Meet":t==="discord.gg"||t==="discord.com"?"Discord":t==="youtube.com"||t==="youtu.be"?"YouTube":t==="twitch.tv"?"Twitch":t==="lu.ma"?"Luma":t.endsWith(".zoom.us")||t==="zoom.us"?"Zoom":t.endsWith(".slack.com")||t==="slack.com"?"Slack":t.endsWith(".meetup.com")||t==="meetup.com"?"Meetup":t.endsWith(".eventbrite.com")||t==="eventbrite.com"?"Eventbrite":"Online event"}function Ue(e){return e.dateLabel??(e.endDate?`${pt(e.startDate,e.timezone)} to ${pt(e.endDate,e.timezone)}`:pt(e.startDate,e.timezone))}function en(e){let t=(e??[]).map(n=>typeof n=="string"?{url:n}:n);return t.find(n=>!Eo(n.url))??t[0]}function Eo(e){return/^http:\/\//i.test(e)}function tn(e){let t=(e??[]).filter(r=>r.price!==void 0);if(t.length===0)return;let n=t.reduce((r,i)=>i.price<r.price?i:r);return{amount:n.price,currency:n.currency,url:n.url}}function xo(e){if(e?.id)return{id:e.id,type:e.type==="multipart"?"multipart":"series",name:e.name,url:e.url}}function gt(e){let t=Array.isArray(e)?{events:e}:e;if(!Array.isArray(t.events))throw new Error("feed.json has no events array");return{title:t.title,description:t.description,license:t.license,events:t.events.map(n=>{let r=en(n.image),i=tn(n.offers),o=n.organizers?.[0]?.name;return{id:n.id,name:n.name??"(untitled event)",startDate:n.startDate,endDate:n.endDate,timezone:n.timezone,location:Jt(n),locationLink:n.location?.onlineUrl,link:n.url??n.location?.onlineUrl,description:n.description,image:r,price:i,organizerName:o,tags:n.tags,attendanceMode:n.attendanceMode,updatedAt:n.updatedAt,partOf:xo(n.partOf),eligibility:n.eligibility,cfp:n.cfp,details:Xt([["ID",n.id],["Status",n.status],["Timezone",n.timezone],["Attendance",n.attendanceMode],["Languages",n.languages],["Tags",n.tags],["Updated",n.updatedAt],["Source",n.source],["Image",r?.url],["Price",i&&`${i.amount}${i.currency?` ${i.currency}`:""}`],["Organizer",o]])}})}}function an(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var be=an();function Rr(e){be=e}var ge={exec:()=>null};function Re(e){let t=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),i=t[r];return i||(i=e(r),t[r]=i),i}}function E(e,t=""){let n=typeof e=="string"?e:e.source,r={replace:(i,o)=>{let l=typeof o=="string"?o:o.source;return l=l.replace(F.caret,"$1"),n=n.replace(i,l),r},getRegex:()=>new RegExp(n,t)};return r}var Ao=((e="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+e)}catch{return!1}})(),F={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:Re(e=>new RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:Re(e=>new RegExp(`^ {0,${e}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),fencesBeginRegex:Re(e=>new RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),headingBeginRegex:Re(e=>new RegExp(`^ {0,${e}}#`)),htmlBeginRegex:Re(e=>new RegExp(`^ {0,${e}}<(?:[a-z].*>|!--)`,"i")),blockquoteBeginRegex:Re(e=>new RegExp(`^ {0,${e}}>`))},To=/^(?:[ \t]*(?:\n|$))+/,So=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,_o=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,We=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Lo=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,sn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Or=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Cr=E(Or).replace(/bull/g,sn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ro=E(Or).replace(/bull/g,sn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),ln=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,Oo=/^[^\n]+/,cn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Co=E(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",cn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Do=E(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,sn).getRegex(),yt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",dn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Po=E("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",dn).replace("tag",yt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Dr=e=>E(ln).replace("hr",We).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",e).replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",yt).getRegex(),Mo=Dr(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),Io=Dr(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),No=E(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Io).getRegex(),un={blockquote:No,code:So,def:Co,fences:_o,heading:Lo,hr:We,html:Po,lheading:Cr,list:Do,newline:To,paragraph:Mo,table:ge,text:Oo},Er=E("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",We).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",yt).getRegex(),$o={...un,lheading:Ro,table:Er,paragraph:E(ln).replace("hr",We).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Er).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",yt).getRegex()},zo={...un,html:E(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",dn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:ge,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:E(ln).replace("hr",We).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Cr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Fo=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Uo=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Pr=/^( {2,}|\\)\n(?!\s*$)/,Ho=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ie=/[\p{P}\p{S}]/u,Oe=/[\s\p{P}\p{S}]/u,Ge=/[^\s\p{P}\p{S}]/u,Bo=E(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Oe).getRegex(),Wo=/[\p{Pi}\p{Ps}"']/u,Mr=/(?!~)[\p{P}\p{S}]/u,Go=/(?!~)[\s\p{P}\p{S}]/u,jo=/(?:[^\s\p{P}\p{S}]|~)/u,qo=E(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Ao?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Ir=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Vo=E(Ir,"u").replace(/punct/g,ie).getRegex(),Yo=E(Ir,"u").replace(/punct/g,Mr).getRegex(),Zo=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,Ko=E(Zo,"u").replace(/openQuote/g,Wo).replace(/punct/g,ie).getRegex(),Nr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Xo=E(Nr,"gu").replace(/notPunctSpace/g,Ge).replace(/punctSpace/g,Oe).replace(/punct/g,ie).getRegex(),Qo=E(Nr,"gu").replace(/notPunctSpace/g,jo).replace(/punctSpace/g,Go).replace(/punct/g,Mr).getRegex(),Jo="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",ea=E(Jo,"gu").replace(/notPunctSpace/g,Ge).replace(/punctSpace/g,Oe).replace(/punct/g,ie).getRegex(),ta=E("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Ge).replace(/punctSpace/g,Oe).replace(/punct/g,ie).getRegex(),na="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",ra=E(na,"gu").replace(/notPunctSpace/g,Ge).replace(/punctSpace/g,Oe).replace(/punct/g,ie).getRegex(),ia=E(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,ie).getRegex(),oa="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",aa=E(oa,"gu").replace(/notPunctSpace/g,Ge).replace(/punctSpace/g,Oe).replace(/punct/g,ie).getRegex(),sa=E(/\\(punct)/,"gu").replace(/punct/g,ie).getRegex(),la=E(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ca=E(dn).replace("(?:-->|$)","-->").getRegex(),da=E("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ca).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),bt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,ua=E(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",bt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),$r=E(/^!?\[(label)\]\[(ref)\]/).replace("label",bt).replace("ref",cn).getRegex(),zr=E(/^!?\[(ref)\](?:\[\])?/).replace("ref",cn).getRegex(),pa=E("reflink|nolink(?!\\()","g").replace("reflink",$r).replace("nolink",zr).getRegex(),xr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,pn={_backpedal:ge,anyPunctuation:sa,autolink:la,blockSkip:qo,br:Pr,code:Uo,del:ge,delLDelim:ge,delRDelim:ge,emStrongLDelim:Vo,emStrongRDelimAst:Xo,emStrongRDelimUnd:ta,escape:Fo,link:ua,nolink:zr,punctuation:Bo,reflink:$r,reflinkSearch:pa,tag:da,text:Ho,url:ge},fa={...pn,emStrongLDelim:Ko,emStrongRDelimAst:ea,emStrongRDelimUnd:ra,link:E(/^!?\[(label)\]\((.*?)\)/).replace("label",bt).getRegex(),reflink:E(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",bt).getRegex()},nn={...pn,emStrongRDelimAst:Qo,emStrongLDelim:Yo,delLDelim:ia,delRDelim:aa,url:E(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",xr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:E(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",xr).getRegex()},ha={...nn,br:E(Pr).replace("{2,}","*").getRegex(),text:E(nn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},vt={normal:un,gfm:$o,pedantic:zo},He={normal:pn,gfm:nn,breaks:ha,pedantic:fa},ma={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Ar=e=>ma[e];function ne(e,t){if(t){if(F.escapeTest.test(e))return e.replace(F.escapeReplace,Ar)}else if(F.escapeTestNoEncode.test(e))return e.replace(F.escapeReplaceNoEncode,Ar);return e}function Tr(e){try{e=encodeURI(e).replace(F.percentDecode,"%")}catch{return null}return e}function Sr(e,t){let n=e.replace(F.findPipe,(o,l,s)=>{let d=!1,u=l;for(;--u>=0&&s[u]==="\\";)d=!d;return d?"|":" |"}),r=n.split(F.splitPipe),i=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),t)if(r.length>t)r.splice(t);else for(;r.length<t;)r.push("");for(;i<r.length;i++)r[i]=r[i].trim().replace(F.slashPipe,"|");return r}function le(e,t,n){let r=e.length;if(r===0)return"";let i=0;for(;i<r;){let o=e.charAt(r-i-1);if(o===t&&!n)i++;else if(o!==t&&n)i++;else break}return e.slice(0,r-i)}function _r(e){let t=e.split(`
`),n=t.length-1;for(;n>=0&&F.blankLine.test(t[n]);)n--;return t.length-n<=2?e:t.slice(0,n+1).join(`
`)}function ga(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]==="\\")r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return n>0?-2:-1}function va(e,t=0){let n=t,r="";for(let i of e)if(i==="	"){let o=4-n%4;r+=" ".repeat(o),n+=o}else r+=i,n++;return r}function Lr(e,t,n,r,i){let o=t.href,l=t.title||null,s=e[1].replace(i.other.outputLinkReplace,"$1"),d=e[0].charAt(0)==="!";r.state.inLink=!0;let u=r.state.linkEmitted,m=r.state.inRawBlock;r.state.linkEmitted=!1;let v=r.inlineTokens(s),w=r.state.linkEmitted;if(r.state.linkEmitted=u,r.state.inLink=!1,!d){if(w){r.state.inRawBlock=m;return}r.state.linkEmitted=!0}return{type:d?"image":"link",raw:n,href:o,title:l,text:s,tokens:v}}function ba(e,t,n){let r=e.match(n.other.indentCodeCompensation);if(r===null)return t;let i=r[1];return t.split(`
`).map(o=>{let l=o.match(n.other.beginningSpace);if(l===null)return o;let[s]=l;return s.length>=i.length?o.slice(i.length):o}).join(`
`)}var wt=class{options;rules;lexer;constructor(e){this.options=e||be}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=this.options.pedantic?t[0]:_r(t[0]),r=n.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n,codeBlockStyle:"indented",text:r}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],r=ba(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:r}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let r=le(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim())}return{type:"heading",raw:le(t[0],`
`),depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:le(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=le(t[0],`
`).split(`
`),r="",i="",o=[];for(;n.length>0;){let l=!1,s=[],d;for(d=0;d<n.length;d++)if(this.rules.other.blockquoteStart.test(n[d]))s.push(n[d]),l=!0;else if(!l)s.push(n[d]);else break;n=n.slice(d);let u=s.join(`
`),m=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${u}`:u,i=i?`${i}
${m}`:m;let v=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(m,o,!0),this.lexer.state.top=v,n.length===0)break;let w=o.at(-1);if(w?.type==="code")break;if(w?.type==="blockquote"){let T=w,y=n.join(`
`),x=T.raw+`
`+y.replace(this.rules.other.blockquoteSetextReplace2,""),P=this.blockquote(x);o[o.length-1]=P,r=`${r}
${y}`,i=i.substring(0,i.length-T.text.length)+P.text;break}else if(w?.type==="list"){let T=w,y=T.raw+`
`+n.join(`
`),x=this.list(y);o[o.length-1]=x,r=r.substring(0,r.length-w.raw.length)+x.raw,i=i.substring(0,i.length-T.raw.length)+x.raw,n=y.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:o,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let o=this.rules.other.listItemRegex(n),l=!1;for(;e;){let d=!1,u="",m="";if(!(t=o.exec(e))||this.rules.block.hr.test(e))break;u=t[0],e=e.substring(u.length);let v=va(t[2].split(`
`,1)[0],t[1].length),w=e.split(`
`,1)[0],T=!v.trim(),y=0;if(this.options.pedantic?(y=2,m=v.trimStart()):T?y=t[1].length+1:(y=v.search(this.rules.other.nonSpaceChar),y=y>4?1:y,m=v.slice(y),y+=t[1].length),T&&this.rules.other.blankLine.test(w)&&(u+=w+`
`,e=e.substring(w.length+1),d=!0),!d){let x=this.rules.other.nextBulletRegex(y),P=this.rules.other.hrRegex(y),N=this.rules.other.fencesBeginRegex(y),ue=this.rules.other.headingBeginRegex(y),Pe=this.rules.other.htmlBeginRegex(y),re=this.rules.other.blockquoteBeginRegex(y);for(;e;){let X=e.split(`
`,1)[0],Q;if(w=X,this.options.pedantic?(w=w.replace(this.rules.other.listReplaceNesting,"  "),Q=w):Q=w.replace(this.rules.other.tabCharGlobal,"    "),N.test(w)||ue.test(w)||Pe.test(w)||re.test(w)||x.test(w)||P.test(w))break;if(Q.search(this.rules.other.nonSpaceChar)>=y||!w.trim())m+=`
`+Q.slice(y);else{if(T||v.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||N.test(v)||ue.test(v)||P.test(v))break;m+=`
`+w}T=!w.trim(),u+=X+`
`,e=e.substring(X.length+1),v=Q.slice(y)}}i.loose||(l?i.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(l=!0)),i.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(m),loose:!1,text:m,tokens:[]}),i.raw+=u}let s=i.items.at(-1);if(s)s.raw=s.raw.trimEnd(),s.text=s.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let d of i.items)if(this.lexer.state.top=!1,d.tokens=this.lexer.blockTokens(d.text,[]),!i.loose){let u=d.tokens.filter(v=>v.type==="space"),m=u.length>0&&u.some(v=>this.rules.other.anyLine.test(v.raw));i.loose=m}for(let d of i.items){let u=d.tokens[0];if(d.task&&(u?.type==="text"||u?.type==="paragraph")){d.text=d.text.replace(this.rules.other.listReplaceTask,""),u.raw=u.raw.replace(this.rules.other.listReplaceTask,""),u.text=u.text.replace(this.rules.other.listReplaceTask,"");for(let v=this.lexer.inlineQueue.length-1;v>=0;v--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[v].src)){this.lexer.inlineQueue[v].src=this.lexer.inlineQueue[v].src.replace(this.rules.other.listReplaceTask,"");break}let m=this.rules.other.listTaskCheckbox.exec(d.raw);if(m){let v={type:"checkbox",raw:m[0]+" ",checked:m[0]!=="[ ]"};d.checked=v.checked,i.loose?d.tokens[0]&&["paragraph","text"].includes(d.tokens[0].type)&&"tokens"in d.tokens[0]&&d.tokens[0].tokens?(d.tokens[0].raw=v.raw+d.tokens[0].raw,d.tokens[0].text=v.raw+d.tokens[0].text,d.tokens[0].tokens.unshift(v)):d.tokens.unshift({type:"paragraph",raw:v.raw,text:v.raw,tokens:[v]}):d.tokens.unshift(v)}}else d.task&&(d.task=!1)}if(i.loose)for(let d of i.items){d.loose=!0;for(let u of d.tokens)u.type==="text"&&(u.type="paragraph")}return i}}html(e){let t=this.rules.block.html.exec(e);if(t){let n=_r(t[0]);return{type:"html",block:!0,raw:n,pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:n}}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:le(t[0],`
`),href:r,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Sr(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:le(t[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let l of r)this.rules.other.tableAlignRight.test(l)?o.align.push("right"):this.rules.other.tableAlignCenter.test(l)?o.align.push("center"):this.rules.other.tableAlignLeft.test(l)?o.align.push("left"):o.align.push(null);for(let l=0;l<n.length;l++)o.header.push({text:n[l],tokens:this.lexer.inline(n[l]),header:!0,align:o.align[l]});for(let l of i)o.rows.push(Sr(l,o.header.length).map((s,d)=>({text:s,tokens:this.lexer.inline(s),header:!1,align:o.align[d]})));return o}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let n=t[1].trim();return{type:"heading",raw:le(t[0],`
`),depth:t[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let o=le(n.slice(0,-1),"\\");if((n.length-o.length)%2===0)return}else{let o=ga(t[2],"()");if(o===-2)return;if(o>-1){let l=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,l).trim(),t[3]=""}}let r=t[2],i="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(r);o&&(r=o[1],i=o[3])}else i=t[3]?t[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),Lr(t,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=t[r.toLowerCase()];if(!i){let o=n[0].charAt(0);return{type:"text",raw:o,text:o}}return Lr(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,o,l,s=i,d=0,u=r[0][0],m=n===u,v=u==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(v.lastIndex=0,t=t.slice(-1*e.length+i);(r=v.exec(t))!==null;){if(o=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!o)continue;if(l=[...o].length,r[3]||r[4]){s+=l;continue}else if(r[5]||r[6]){if(i%3&&!((i+l)%3)){d+=l;continue}if(m)break}if(s-=l,s>0)continue;l=Math.min(l,l+s+d);let w=[...r[0]][0].length,T=e.slice(0,i+r.index+w+l);if(Math.min(i,l)%2){let x=T.slice(1,-1);return{type:"em",raw:T,text:x,tokens:this.lexer.inlineTokens(x)}}let y=T.slice(2,-2);return{type:"strong",raw:T,text:y,tokens:this.lexer.inlineTokens(y)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let r=this.rules.inline.delLDelim.exec(e);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,o,l,s=i,d=this.rules.inline.delRDelim;for(d.lastIndex=0,t=t.slice(-1*e.length+i);(r=d.exec(t))!==null;){if(o=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!o||(l=[...o].length,l!==i))continue;if(r[3]||r[4]){s+=l;continue}if(s-=l,s>0)continue;l=Math.min(l,l+s);let u=[...r[0]][0].length,m=e.slice(0,i+r.index+u+l),v=m.slice(i,-i);return{type:"del",raw:m,text:v,tokens:this.lexer.inlineTokens(v)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,r;return t[2]==="@"?(n=t[1],r="mailto:"+n):(n=t[1],r=n),{type:"link",raw:t[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,r;if(t[2]==="@")n=t[0],r="mailto:"+n;else{let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},Y=class rn{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||be,this.options.tokenizer=this.options.tokenizer||new wt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,top:!0};let n={other:F,block:vt.normal,inline:He.normal};this.options.pedantic?(n.block=vt.pedantic,n.inline=He.pedantic):this.options.gfm&&(n.block=vt.gfm,this.options.breaks?n.inline=He.breaks:n.inline=He.gfm),this.tokenizer.rules=n}static get rules(){return{block:vt,inline:He}}static lex(t,n){return new rn(n).lex(t)}static lexInline(t,n){return new rn(n).inlineTokens(t)}lex(t){t=t.replace(F.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],r=!1){this.tokenizer.lexer=this,this.options.pedantic&&(t=t.replace(F.tabCharGlobal,"    ").replace(F.spaceLine,""));let i=1/0;for(;t;){if(t.length<i)i=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}let o;if(this.options.extensions?.block?.some(s=>(o=s.call({lexer:this},t,n))?(t=t.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.space(t)){t=t.substring(o.raw.length);let s=n.at(-1);o.raw.length===1&&s!==void 0?s.raw+=`
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
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(o);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}linkInText(t){if(!t.includes("["))return!1;let n=this.tokenizer.rules.inline.link;for(let r of t.matchAll(this.tokenizer.rules.inline.blockSkip))if(n.test(r[0])&&t.charAt(r.index-1)!=="!")return!0;for(let r of t.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let i=r[0],o=i.lastIndexOf("[");if(!(i.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,i.slice(o+1,-1)))&&!(o>1&&this.linkInText(i.slice(1,o-1))))return!0}return!1}inlineTokens(t,n=[]){this.tokenizer.lexer=this;let r=t;if(this.tokens.links&&t.includes("[")){let s=this.tokenizer.rules.inline.reflinkSearch,d=u=>{let m=u.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,u.slice(m+1,-1)))return u;if(m>1&&u.charAt(0)!=="!"){let v=u.slice(1,m-1);if(this.linkInText(v))return"["+v.replace(s,d)+"]["+"a".repeat(u.length-m-2)+"]"}return"["+"a".repeat(u.length-2)+"]"};r=r.replace(s,d)}r=r.replace(this.tokenizer.rules.inline.anyPunctuation,s=>"+".repeat(s.length)),r=r.replace(this.tokenizer.rules.inline.blockSkip,(s,d,u)=>{let m=u?u.length:0;return s.slice(0,m)+"["+"a".repeat(s.length-m-2)+"]"}),r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let i=!1,o="",l=1/0;for(;t;){if(t.length<l)l=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}i||(o=""),i=!1;let s;if(this.options.extensions?.inline?.some(u=>(s=u.call({lexer:this},t,n))?(t=t.substring(s.raw.length),n.push(s),!0):!1))continue;if(s=this.tokenizer.escape(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.tag(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.link(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(s.raw.length);let u=n.at(-1);s.type==="text"&&u?.type==="text"?(u.raw+=s.raw,u.text+=s.text):n.push(s);continue}if(s=this.tokenizer.emStrong(t,r,o)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.codespan(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.br(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.del(t,r,o)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.autolink(t)){t=t.substring(s.raw.length),n.push(s);continue}if(!this.state.inLink&&(s=this.tokenizer.url(t))){t=t.substring(s.raw.length),n.push(s);continue}let d=t;if(this.options.extensions?.startInline){let u=1/0,m=t.slice(1),v;this.options.extensions.startInline.forEach(w=>{v=w.call({lexer:this},m),typeof v=="number"&&v>=0&&(u=Math.min(u,v))}),u<1/0&&u>=0&&(d=t.substring(0,u+1))}if(s=this.tokenizer.inlineText(d)){t=t.substring(s.raw.length),s.raw.slice(-1)!=="_"&&(o=s.raw.slice(-1)),i=!0;let u=n.at(-1);u?.type==="text"?(u.raw+=s.raw,u.text+=s.text):n.push(s);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return n}infiniteLoopError(t){let n="Infinite loop on byte: "+t;if(this.options.silent)console.error(n);else throw new Error(n)}},kt=class{options;parser;constructor(e){this.options=e||be}space(e){return""}code({text:e,lang:t,escaped:n}){let r=(t||"").match(F.notSpaceStart)?.[0],i=e.replace(F.endingNewline,"")+`
`;return r?'<pre><code class="language-'+ne(r)+'">'+(n?i:ne(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:ne(i,!0))+`</code></pre>
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
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${ne(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let r=this.parser.parseInline(n),i=Tr(e);if(i===null)return r;e=i;let o='<a href="'+e+'"';return t&&(o+=' title="'+ne(t)+'"'),o+=">"+r+"</a>",o}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=Tr(e);if(i===null)return ne(n);e=i;let o=`<img src="${e}" alt="${ne(n)}"`;return t&&(o+=` title="${ne(t)}"`),o+=">",o}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:ne(e.text)}},fn=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Z=class on{options;renderer;textRenderer;constructor(t){this.options=t||be,this.options.renderer=this.options.renderer||new kt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new fn}static parse(t,n){return new on(n).parse(t)}static parseInline(t,n){return new on(n).parseInline(t)}parse(t){this.renderer.parser=this;let n="";for(let r=0;r<t.length;r++){let i=t[r];if(this.options.extensions?.renderers?.[i.type]){let l=i,s=this.options.extensions.renderers[l.type].call({parser:this},l);if(s!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(l.type)){n+=s||"";continue}}let o=i;switch(o.type){case"space":{n+=this.renderer.space(o);break}case"hr":{n+=this.renderer.hr(o);break}case"heading":{n+=this.renderer.heading(o);break}case"code":{n+=this.renderer.code(o);break}case"table":{n+=this.renderer.table(o);break}case"blockquote":{n+=this.renderer.blockquote(o);break}case"list":{n+=this.renderer.list(o);break}case"checkbox":{n+=this.renderer.checkbox(o);break}case"html":{n+=this.renderer.html(o);break}case"def":{n+=this.renderer.def(o);break}case"paragraph":{n+=this.renderer.paragraph(o);break}case"text":{n+=this.renderer.text(o);break}default:{let l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return n}parseInline(t,n=this.renderer){this.renderer.parser=this;let r="";for(let i=0;i<t.length;i++){let o=t[i];if(this.options.extensions?.renderers?.[o.type]){let s=this.options.extensions.renderers[o.type].call({parser:this},o);if(s!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(o.type)){r+=s||"";continue}}let l=o;switch(l.type){case"escape":{r+=n.text(l);break}case"html":{r+=n.html(l);break}case"link":{r+=n.link(l);break}case"image":{r+=n.image(l);break}case"checkbox":{r+=n.checkbox(l);break}case"strong":{r+=n.strong(l);break}case"em":{r+=n.em(l);break}case"codespan":{r+=n.codespan(l);break}case"br":{r+=n.br(l);break}case"del":{r+=n.del(l);break}case"text":{r+=n.text(l);break}default:{let s='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return r}},Be=class{options;block;constructor(e){this.options=e||be}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?Y.lex:Y.lexInline}provideParser(e=this.block){return e?Z.parse:Z.parseInline}},wa=class{defaults=an();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Z;Renderer=kt;TextRenderer=fn;Lexer=Y;Tokenizer=wt;Hooks=Be;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case"table":{let i=r;for(let o of i.header)n=n.concat(this.walkTokens(o.tokens,t));for(let o of i.rows)for(let l of o)n=n.concat(this.walkTokens(l.tokens,t));break}case"list":{let i=r;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=r;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(o=>{let l=i[o].flat(1/0);n=n.concat(this.walkTokens(l,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let o=t.renderers[i.name];o?t.renderers[i.name]=function(...l){let s=i.renderer.apply(this,l);return s===!1&&(s=o.apply(this,l)),s}:t.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=t[i.level];o?o.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens)}),r.extensions=t),n.renderer){let i=this.defaults.renderer||new kt(this.defaults);for(let o in n.renderer){if(!(o in i))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let l=o,s=n.renderer[l],d=i[l];i[l]=(...u)=>{let m=s.apply(i,u);return m===!1&&(m=d.apply(i,u)),m||""}}r.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new wt(this.defaults);for(let o in n.tokenizer){if(!(o in i))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let l=o,s=n.tokenizer[l],d=i[l];i[l]=(...u)=>{let m=s.apply(i,u);return m===!1&&(m=d.apply(i,u)),m}}r.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new Be;for(let o in n.hooks){if(!(o in i))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let l=o,s=n.hooks[l],d=i[l];Be.passThroughHooks.has(o)?i[l]=u=>{if(this.defaults.async&&Be.passThroughHooksRespectAsync.has(o))return(async()=>{let v=await s.call(i,u);return d.call(i,v)})();let m=s.call(i,u);return d.call(i,m)}:i[l]=(...u)=>{if(this.defaults.async)return(async()=>{let v=await s.apply(i,u);return v===!1&&(v=await d.apply(i,u)),v})();let m=s.apply(i,u);return m===!1&&(m=d.apply(i,u)),m}}r.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,o=n.walkTokens;r.walkTokens=function(l){let s=[];return s.push(o.call(this,l)),i&&(s=s.concat(i.call(this,l))),s}}this.defaults={...this.defaults,...r}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Y.lex(e,t??this.defaults)}parser(e,t){return Z.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let r={...n},i={...this.defaults,...r},o=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let l=i.hooks?await i.hooks.preprocess(t):t,s=await(i.hooks?await i.hooks.provideLexer(e):e?Y.lex:Y.lexInline)(l,i),d=i.hooks?await i.hooks.processAllTokens(s):s;i.walkTokens&&await Promise.all(this.walkTokens(d,i.walkTokens));let u=await(i.hooks?await i.hooks.provideParser(e):e?Z.parse:Z.parseInline)(d,i);return i.hooks?await i.hooks.postprocess(u):u})().catch(o);try{i.hooks&&(t=i.hooks.preprocess(t));let l=(i.hooks?i.hooks.provideLexer(e):e?Y.lex:Y.lexInline)(t,i);i.hooks&&(l=i.hooks.processAllTokens(l)),i.walkTokens&&this.walkTokens(l,i.walkTokens);let s=(i.hooks?i.hooks.provideParser(e):e?Z.parse:Z.parseInline)(l,i);return i.hooks&&(s=i.hooks.postprocess(s)),s}catch(l){return o(l)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let r="<p>An error occurred:</p><pre>"+ne(n.message+"",!0)+"</pre>";return t?Promise.resolve(r):r}if(t)return Promise.reject(n);throw n}}},ve=new wa;function S(e,t){return ve.parse(e,t)}S.options=S.setOptions=function(e){return ve.setOptions(e),S.defaults=ve.defaults,Rr(S.defaults),S};S.getDefaults=an;S.defaults=be;function ka(...e){return ve.use(...e),S.defaults=ve.defaults,Rr(S.defaults),S}S.use=ka;S.walkTokens=function(e,t){return ve.walkTokens(e,t)};S.parseInline=ve.parseInline;S.Parser=Z;S.parser=Z.parse;S.Renderer=kt;S.TextRenderer=fn;S.Lexer=Y;S.lexer=Y.lex;S.Tokenizer=wt;S.Hooks=Be;S.parse=S;var zs=S.options,Fs=S.setOptions,Us=S.walkTokens,Hs=S.parseInline;var Bs=Z.parse,Ws=Y.lex;var hn=["image","when","location","attendance","description","price","tags","organizer","eligibility","cfp"],Fr=["image","when","location","attendance","description"],Ur=["google-calendar","outlook-calendar","yahoo-calendar","ics","link"],ya=["series","multipart"];function Hr(e){return hn.includes(e)}function Ea(e){return ya.includes(e)}function Br(e){if(!e)return 1/0;let t=Number.parseInt(e,10);return Number.isFinite(t)&&t>0?t:1/0}function Wr(e){return e==="en"||e==="es"?e:"auto"}function Gr(e,t){return e!=="auto"?e:t.toLowerCase().startsWith("es")?"es":"en"}function jr(e){return e?.trim()||void 0}function qr(e){return e!=="false"}function Vr(e){return e==="cards"?"cards":e==="list"?"list":"calendar"}function xt(e){return e==="link"||e==="none"?e:"modal"}function Yr(e){return e==="none"?"none":"auto"}function xa(e){return e==="google-calendar"||e==="outlook-calendar"||e==="yahoo-calendar"||e==="ics"||e==="link"}function Zr(e){if(e==="none")return[];if(!e)return[...Ur];let t=e.split(",").map(n=>n.trim()).filter(xa);return t.length>0?[...new Set(t)]:[...Ur]}function Kr(e){if(!e)return new Set(Fr);let t=e.split(",").map(n=>n.trim()).filter(Hr);return t.length>0?new Set(t):new Set(Fr)}function Xr(e){if(!e)return new Set(hn);let t=e.split(",").map(n=>n.trim()).filter(Hr);return t.length>0?new Set(t):new Set(hn)}function Qr(e){return e?new Set(e.split(",").map(t=>t.trim()).filter(Ea)):new Set}function Jr(e){return e?e.split(",").map(t=>t.trim()).filter(t=>t.length>0):[]}var Et={small:"160px",medium:"220px",large:"320px"};function ei(e){let t=e?.trim();return t?t in Et?Et[t]:/^\d+(\.\d+)?$/.test(t)?`${t}px`:/^\d+(\.\d+)?(px|rem|em|ch|vw|%)$/.test(t)?t:Et.medium:Et.medium}function ti(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function Aa(e){if(Array.isArray(e))return e}function Ta(e,t){var n=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var r,i,o,l,s=[],d=!0,u=!1;try{if(o=(n=n.call(e)).next,t!==0)for(;!(d=(r=o.call(n)).done)&&(s.push(r.value),s.length!==t);d=!0);}catch(m){u=!0,i=m}finally{try{if(!d&&n.return!=null&&(l=n.return(),Object(l)!==l))return}finally{if(u)throw i}}return s}}function Sa(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function _a(e,t){return Aa(e)||Ta(e,t)||La(e,t)||Sa()}function La(e,t){if(e){if(typeof e=="string")return ti(e,t);var n={}.toString.call(e).slice(8,-1);return n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set"?Array.from(e):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?ti(e,t):void 0}}var gi=Object.entries,ni=Object.setPrototypeOf,Ra=Object.isFrozen,Oa=Object.getPrototypeOf,Ca=Object.getOwnPropertyDescriptor,$=Object.freeze,z=Object.seal,Ce=Object.create,vi=typeof Reflect<"u"&&Reflect,yn=vi.apply,En=vi.construct;$||($=function(t){return t});z||(z=function(t){return t});yn||(yn=function(t,n){for(var r=arguments.length,i=new Array(r>2?r-2:0),o=2;o<r;o++)i[o-2]=arguments[o];return t.apply(n,i)});En||(En=function(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return new t(...r)});var ke=I(Array.prototype.forEach),Da=I(Array.prototype.lastIndexOf),ri=I(Array.prototype.pop),je=I(Array.prototype.push),Pa=I(Array.prototype.splice),De=Array.isArray,Ye=I(String.prototype.toLowerCase),mn=I(String.prototype.toString),ii=I(String.prototype.match),qe=I(String.prototype.replace),oi=I(String.prototype.indexOf),Ma=I(String.prototype.trim),Ia=I(Number.prototype.toString),Na=I(Boolean.prototype.toString),ai=typeof BigInt>"u"?null:I(BigInt.prototype.toString),si=typeof Symbol>"u"?null:I(Symbol.prototype.toString),j=I(Object.prototype.hasOwnProperty),Ve=I(Object.prototype.toString),U=I(RegExp.prototype.test),we=$a(TypeError);function I(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return yn(e,t,r)}}function $a(e){return function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return En(e,n)}}function A(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ye;if(ni&&ni(e,null),!De(t))return e;let r=t.length;for(;r--;){let i=t[r];if(typeof i=="string"){let o=n(i);o!==i&&(Ra(t)||(t[r]=o),i=o)}e[i]=!0}return e}function za(e){for(let t=0;t<e.length;t++)j(e,t)||(e[t]=null);return e}function V(e){let t=Ce(null);for(let r of gi(e)){var n=_a(r,2);let i=n[0],o=n[1];j(e,i)&&(De(o)?t[i]=za(o):o&&typeof o=="object"&&o.constructor===Object?t[i]=V(o):t[i]=o)}return t}function Fa(e){switch(typeof e){case"string":return e;case"number":return Ia(e);case"boolean":return Na(e);case"bigint":return ai?ai(e):"0";case"symbol":return si?si(e):"Symbol()";case"undefined":return Ve(e);case"function":case"object":{if(e===null)return Ve(e);let t=e,n=K(t,"toString");if(typeof n=="function"){let r=n(t);return typeof r=="string"?r:Ve(r)}return Ve(e)}default:return Ve(e)}}function K(e,t){for(;e!==null;){let r=Ca(e,t);if(r){if(r.get)return I(r.get);if(typeof r.value=="function")return I(r.value)}e=Oa(e)}function n(){return null}return n}function Ua(e){try{return U(e,""),!0}catch{return!1}}var li=$(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),gn=$(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),vn=$(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Ha=$(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),bn=$(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Ba=$(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),ci=$(["#text"]),di=$(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),wn=$(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),ui=$(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),At=$(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Wa=z(/{{[\w\W]*|^[\w\W]*}}/g),Ga=z(/<%[\w\W]*|^[\w\W]*%>/g),ja=z(/\${[\w\W]*/g),qa=z(/^data-[\-\w.\u00B7-\uFFFF]+$/),Va=z(/^aria-[\-\w]+$/),pi=z(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ya=z(/^(?:\w+script|data):/i),Za=z(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ka=z(/^html$/i),Xa=z(/^[a-z][.\w]*(-[.\w]+)+$/i),fi=z(/<[/\w!]/g),hi=z(/<[/\w]/g),Qa=z(/<\/no(script|embed|frames)/i),Ja=z(/\/>/i),q={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},bi=["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"],es=$(A({},bi)),ts=(function(){let e={};return ke(bi,t=>{e[t]=z(new RegExp("</"+t+"(?=[\\t\\n\\f\\r />])","i"))}),$(e)})(),ns=function(){return typeof window>"u"?null:window},rs=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let r=null,i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(r=n.getAttribute(i));let o="dompurify"+(r?"#"+r:"");try{return t.createPolicy(o,{createHTML(l){return l},createScriptURL(l){return l}})}catch{return console.warn("TrustedTypes policy "+o+" could not be created."),null}},mi=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},ce=function(t,n,r,i){return j(t,n)&&De(t[n])?A(i.base?V(i.base):{},t[n],i.transform):r},kn=function(t,n,r){let i=j(t,n)?t[n]:void 0;return i&&typeof i=="object"?V(i):r()};function wi(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:ns(),t=f=>wi(f);if(t.version="3.4.14",t.removed=[],!e||!e.document||e.document.nodeType!==q.document||!e.Element)return t.isSupported=!1,t;let n=e.document,r=n,i=r.currentScript;e.DocumentFragment;let o=e.HTMLTemplateElement,l=e.Node,s=e.Element,d=e.NodeFilter,u=e.NamedNodeMap;u===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;let m=e.DOMParser,v=e.trustedTypes,w=s.prototype,T=K(w,"cloneNode"),y=K(w,"remove"),x=K(w,"nextSibling"),P=K(w,"childNodes"),N=K(w,"parentNode"),ue=K(w,"shadowRoot"),Pe=K(w,"attributes"),re=l&&l.prototype?K(l.prototype,"nodeType"):null,X=l&&l.prototype?K(l.prototype,"nodeName"):null,Q=l&&l.prototype?K(l.prototype,"ownerDocument"):null,Me=function(a){return re?re(a):a.nodeType},Dt=function(a){return X?X(a):a.nodeName};if(typeof o=="function"){let f=n.createElement("template");f.content&&f.content.ownerDocument&&(n=f.content.ownerDocument)}let B,pe="",Pt,Wn=!1,Ie=0,Gn=function(){if(Ie>0)throw we('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},Ee=function(a){Gn(),Ie++;try{return B.createHTML(a)}finally{Ie--}},Vi=function(a){Gn(),Ie++;try{return B.createScriptURL(a)}finally{Ie--}},Yi=function(){return Wn||(Pt=rs(v,i),Wn=!0),Pt},Je=n,Mt=Je.implementation,jn=Je.createNodeIterator,Zi=Je.createDocumentFragment,Ki=Je.getElementsByTagName,Xi=r.importNode,L=mi();t.isSupported=typeof gi=="function"&&typeof N=="function"&&Mt&&Mt.createHTMLDocument!==void 0;let Qi=Wa,Ji=Ga,eo=ja,to=qa,no=Va,ro=Ya,qn=Za,io=Xa,Vn=pi,R=null,It=A({},[...li,...gn,...vn,...bn,...ci]),O=null,Nt=A({},[...di,...wn,...ui,...At]),J=Object.seal(Ce(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Ne=null,Yn=null,oe=Object.seal(Ce(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),Zn=!0,$t=!0,Kn=!1,Xn=!0,ae=!1,fe=!0,he=!1,zt=!1,et=null,tt=null,Ft=!1,xe=!1,nt=!1,rt=!1,Qn=!0,Jn=!1,er="user-content-",Ut=!0,Ht=!1,Ae={},Te=null,tr=A({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]),nr=null,rr=A({},["audio","video","img","source","image","track"]),ir=null,or=A({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),it="http://www.w3.org/1998/Math/MathML",ot="http://www.w3.org/2000/svg",ee="http://www.w3.org/1999/xhtml",Se=ee,Bt=!1,Wt=null,oo=A({},[it,ot,ee],mn),ar=$(["mi","mo","mn","ms","mtext"]),Gt=A({},ar),sr=$(["annotation-xml"]),jt=A({},sr),ao=A({},["title","style","font","a","script"]),$e=null,so=["application/xhtml+xml","text/html"],lo="text/html",M=null,_e=null,co=n.createElement("form"),lr=function(a){return a instanceof RegExp||a instanceof Function},qt=function(){let a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(_e&&_e===a)return;(!a||typeof a!="object")&&(a={}),a=V(a),$e=so.indexOf(a.PARSER_MEDIA_TYPE)===-1?lo:a.PARSER_MEDIA_TYPE,M=$e==="application/xhtml+xml"?mn:Ye,R=ce(a,"ALLOWED_TAGS",It,{transform:M}),O=ce(a,"ALLOWED_ATTR",Nt,{transform:M}),Wt=ce(a,"ALLOWED_NAMESPACES",oo,{transform:mn}),ir=ce(a,"ADD_URI_SAFE_ATTR",or,{transform:M,base:or}),nr=ce(a,"ADD_DATA_URI_TAGS",rr,{transform:M,base:rr}),Te=ce(a,"FORBID_CONTENTS",tr,{transform:M}),Ne=ce(a,"FORBID_TAGS",V({}),{transform:M}),Yn=ce(a,"FORBID_ATTR",V({}),{transform:M}),Ae=j(a,"USE_PROFILES")?a.USE_PROFILES&&typeof a.USE_PROFILES=="object"?V(a.USE_PROFILES):a.USE_PROFILES:!1,Zn=a.ALLOW_ARIA_ATTR!==!1,$t=a.ALLOW_DATA_ATTR!==!1,Kn=a.ALLOW_UNKNOWN_PROTOCOLS||!1,Xn=a.ALLOW_SELF_CLOSE_IN_ATTR!==!1,ae=a.SAFE_FOR_TEMPLATES||!1,fe=a.SAFE_FOR_XML!==!1,he=a.WHOLE_DOCUMENT||!1,xe=a.RETURN_DOM||!1,nt=a.RETURN_DOM_FRAGMENT||!1,rt=a.RETURN_TRUSTED_TYPE||!1,Ft=a.FORCE_BODY||!1,Qn=a.SANITIZE_DOM!==!1,Jn=a.SANITIZE_NAMED_PROPS||!1,Ut=a.KEEP_CONTENT!==!1,Ht=a.IN_PLACE||!1,Vn=Ua(a.ALLOWED_URI_REGEXP)?a.ALLOWED_URI_REGEXP:pi,Se=typeof a.NAMESPACE=="string"?a.NAMESPACE:ee,Gt=kn(a,"MATHML_TEXT_INTEGRATION_POINTS",()=>A({},ar)),jt=kn(a,"HTML_INTEGRATION_POINTS",()=>A({},sr));let c=kn(a,"CUSTOM_ELEMENT_HANDLING",()=>Ce(null));if(J=Ce(null),j(c,"tagNameCheck")&&lr(c.tagNameCheck)&&(J.tagNameCheck=c.tagNameCheck),j(c,"attributeNameCheck")&&lr(c.attributeNameCheck)&&(J.attributeNameCheck=c.attributeNameCheck),j(c,"allowCustomizedBuiltInElements")&&typeof c.allowCustomizedBuiltInElements=="boolean"&&(J.allowCustomizedBuiltInElements=c.allowCustomizedBuiltInElements),z(J),ae&&($t=!1),nt&&(xe=!0),Ae&&(R=A({},ci),O=Ce(null),Ae.html===!0&&(A(R,li),A(O,di)),Ae.svg===!0&&(A(R,gn),A(O,wn),A(O,At)),Ae.svgFilters===!0&&(A(R,vn),A(O,wn),A(O,At)),Ae.mathMl===!0&&(A(R,bn),A(O,ui),A(O,At))),oe.tagCheck=null,oe.attributeCheck=null,j(a,"ADD_TAGS")&&(typeof a.ADD_TAGS=="function"?oe.tagCheck=a.ADD_TAGS:De(a.ADD_TAGS)&&(R===It&&(R=V(R)),A(R,a.ADD_TAGS,M))),j(a,"ADD_ATTR")&&(typeof a.ADD_ATTR=="function"?oe.attributeCheck=a.ADD_ATTR:De(a.ADD_ATTR)&&(O===Nt&&(O=V(O)),A(O,a.ADD_ATTR,M))),j(a,"ADD_FORBID_CONTENTS")&&De(a.ADD_FORBID_CONTENTS)&&(Te===tr&&(Te=V(Te)),A(Te,a.ADD_FORBID_CONTENTS,M)),Ut&&(R["#text"]=!0),he&&A(R,["html","head","body"]),R.table&&(A(R,["tbody"]),delete Ne.tbody),a.TRUSTED_TYPES_POLICY){if(typeof a.TRUSTED_TYPES_POLICY.createHTML!="function")throw we('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof a.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw we('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');let p=B;B=a.TRUSTED_TYPES_POLICY;try{pe=Ee("")}catch(g){throw B=p,g}}else a.TRUSTED_TYPES_POLICY===null?(B=void 0,pe=""):(B===void 0&&(B=Yi()),B&&typeof pe=="string"&&(pe=Ee("")));$&&$(a),_e=a},cr=A({},[...gn,...vn,...Ha]),dr=A({},[...bn,...Ba]),uo=function(a,c,p){return c.namespaceURI===ee?a==="svg":c.namespaceURI===it?a==="svg"&&(p==="annotation-xml"||Gt[p]):!!cr[a]},po=function(a,c,p){return c.namespaceURI===ee?a==="math":c.namespaceURI===ot?a==="math"&&jt[p]:!!dr[a]},fo=function(a,c,p){return c.namespaceURI===ot&&!jt[p]||c.namespaceURI===it&&!Gt[p]?!1:!dr[a]&&(ao[a]||!cr[a])},ho=function(a){let c=N(a);(!c||!c.tagName)&&(c={namespaceURI:Se,tagName:"template"});let p=Ye(a.tagName),g=Ye(c.tagName);return Wt[a.namespaceURI]?a.namespaceURI===ot?uo(p,c,g):a.namespaceURI===it?po(p,c,g):a.namespaceURI===ee?fo(p,c,g):!!($e==="application/xhtml+xml"&&Wt[a.namespaceURI]):!1},se=function(a){je(t.removed,{element:a});try{N(a).removeChild(a)}catch{if(y(a),!N(a))throw we("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},ur=function(a,c,p){try{a.removeAttributeNode(c)}catch{try{a.removeAttribute(p)}catch{}}},at=function(a){st(a);let c=P(a);if(c){let g=[];ke(c,b=>{je(g,b)}),ke(g,b=>{try{y(b)}catch{}})}let p=Pe(a);if(p)for(let g=p.length-1;g>=0;--g){let b=p[g],k=b&&b.name;typeof k=="string"&&ur(a,b,k)}},me=function(a,c,p){if(!p)try{p=c.getAttributeNode(a)}catch{p=null}je(t.removed,{attribute:p||null,from:c});try{p?c.removeAttributeNode(p):c.removeAttribute(a)}catch{try{c.removeAttribute(a)}catch{}}if(a==="is")if(xe||nt)try{se(c)}catch{}else try{c.setAttribute(a,"")}catch{}},mo=function(a){let c=Pe(a);if(c)for(let p=c.length-1;p>=0;--p){let g=c[p],b=g&&g.name;typeof b!="string"||O[M(b)]||ur(a,g,b)}},st=function(a){let c=[a];for(;c.length>0;){let p=c.pop();Me(p)===q.element&&mo(p);let b=P(p);if(b)for(let k=b.length-1;k>=0;--k)c.push(b[k])}},pr=function(a,c){return fe?a==="patchsrc"?!0:a==="for"&&c!=="label"&&c!=="output":!1},go=function(a){if(!fe)return;let c=[a];for(;c.length>0;){let p=c.pop(),g=Me(p);if(g===q.processingInstruction||g===q.comment&&U(hi,p.data)){try{y(p)}catch{}continue}if(g===q.element){let k=p,_=M(Dt(p));try{k.hasAttribute&&k.hasAttribute("patchsrc")&&k.removeAttribute("patchsrc"),k.hasAttribute&&k.hasAttribute("for")&&pr("for",_)&&k.removeAttribute("for")}catch{}}let b=P(p);if(b)for(let k=b.length-1;k>=0;--k)c.push(b[k])}},fr=function(a){let c=null,p=null;if(Ft)a="<remove></remove>"+a;else{let k=ii(a,/^[\r\n\t ]+/);p=k&&k[0]}$e==="application/xhtml+xml"&&Se===ee&&(a='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+a+"</body></html>");let g=B?Ee(a):a;if(Se===ee)try{c=new m().parseFromString(g,$e)}catch{}if(!c||!c.documentElement){c=Mt.createDocument(Se,"template",null);try{c.documentElement.innerHTML=Bt?pe:g}catch{}}let b=c.body||c.documentElement;return a&&p&&b.insertBefore(n.createTextNode(p),b.childNodes[0]||null),Se===ee?Ki.call(c,he?"html":"body")[0]:he?c.documentElement:b},hr=function(a){let c=Q?Q(a):a.ownerDocument;return jn.call(c||a,a,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},lt=function(a){return a=qe(a,Qi," "),a=qe(a,Ji," "),a=qe(a,eo," "),a},Vt=function(a){var c;a.normalize();let p=Q?Q(a):a.ownerDocument,g=jn.call(p||a,a,d.SHOW_TEXT|d.SHOW_COMMENT|d.SHOW_CDATA_SECTION|d.SHOW_PROCESSING_INSTRUCTION,null),b=g.nextNode();for(;b;)b.data=lt(b.data),b=g.nextNode();let k=(c=a.querySelectorAll)===null||c===void 0?void 0:c.call(a,"template");k&&ke(k,_=>{Le(_.content)&&Vt(_.content)})},ct=function(a){let c=X?X(a):null;return typeof c!="string"||M(c)!=="form"?!1:typeof a.nodeName!="string"||typeof a.textContent!="string"||typeof a.removeChild!="function"||a.attributes!==Pe(a)||typeof a.removeAttribute!="function"||typeof a.setAttribute!="function"||typeof a.namespaceURI!="string"||typeof a.insertBefore!="function"||typeof a.hasChildNodes!="function"||a.nodeType!==re(a)||a.childNodes!==P(a)},Le=function(a){if(!re||typeof a!="object"||a===null)return!1;try{return re(a)===q.documentFragment}catch{return!1}},ze=function(a){if(!re||typeof a!="object"||a===null)return!1;try{return typeof re(a)=="number"}catch{return!1}};function te(f,a,c){f.length!==0&&ke(f,p=>{p.call(t,a,c,_e)})}let vo=function(a,c){return!!(fe&&a.hasChildNodes()&&!ze(a.firstElementChild)&&U(fi,a.textContent)&&U(fi,a.innerHTML)||fe&&a.namespaceURI===ee&&es[c]&&(ze(a.firstElementChild)||typeof a.textContent=="string"&&U(ts[c],a.textContent))||a.nodeType===q.processingInstruction||fe&&a.nodeType===q.comment&&U(hi,a.data))},dt=function(a,c){if(a instanceof RegExp)return U(a,c);if(a instanceof Function){for(var p=arguments.length,g=new Array(p>2?p-2:0),b=2;b<p;b++)g[b-2]=arguments[b];return!!a(c,...g)}return!1},bo=function(a,c,p){if(!Ne[c]&&wr(c)&&dt(J.tagNameCheck,c))return!1;if(Ut&&!Te[c]){let g=N(a),b=P(a);if(b&&g){let k=b.length;for(let _=k-1;_>=0;--_){let C=a===p?T(b[_],!0):b[_];g.insertBefore(C,x(a))}}}return se(a),!0},mr=function(a,c,p,g){return a.length===0?c:c===p||c===g?V(c):c},gr=function(a,c){return a===c||N(a)!==null?!1:(Ht&&st(a),!0)},vr=function(a,c){if(te(L.beforeSanitizeElements,a,null),gr(a,c))return!0;if(ct(a))return se(a),!0;let p=M(Dt(a));if(R=mr(L.uponSanitizeElement,R,It,et),te(L.uponSanitizeElement,a,{tagName:p,allowedTags:R}),gr(a,c))return!0;if(vo(a,p))return se(a),!0;if(Ne[p]||!(oe.tagCheck instanceof Function&&oe.tagCheck(p))&&!R[p]){let b=bo(a,p,c);return b===!1&&te(L.afterSanitizeElements,a,null),b}if(Me(a)===q.element&&!ho(a)||(p==="noscript"||p==="noembed"||p==="noframes")&&U(Qa,a.innerHTML))return se(a),!0;if(ae&&a.nodeType===q.text){let b=lt(a.textContent);a.textContent!==b&&(je(t.removed,{element:a.cloneNode()}),a.textContent=b)}return te(L.afterSanitizeElements,a,null),!1},br=function(a,c,p){if(Yn[c]||pr(c,a)||Qn&&(c==="id"||c==="name")&&(p in n||p in co))return!1;let g=O[c]||oe.attributeCheck instanceof Function&&oe.attributeCheck(c,a);return $t&&U(to,c)||Zn&&U(no,c)?!0:g?ir[c]||U(Vn,qe(p,qn,""))||(c==="src"||c==="xlink:href"||c==="href")&&a!=="script"&&oi(p,"data:")===0&&nr[a]||Kn&&!U(ro,qe(p,qn,""))?!0:!p:wr(a)&&dt(J.tagNameCheck,a)&&dt(J.attributeNameCheck,c,a)||c==="is"&&J.allowCustomizedBuiltInElements&&dt(J.tagNameCheck,p)},wo=A({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),wr=function(a){return!wo[Ye(a)]&&U(io,a)},ko=function(a,c,p,g){if(B&&typeof v=="object"&&typeof v.getAttributeType=="function"&&!p)switch(v.getAttributeType(a,c)){case"TrustedHTML":return Ee(g);case"TrustedScriptURL":return Vi(g)}return g},yo=function(a,c,p,g){try{p?a.setAttributeNS(p,c,g):a.setAttribute(c,g),ct(a)?se(a):ri(t.removed)}catch{me(c,a)}},kr=function(a){te(L.beforeSanitizeAttributes,a,null);let c=a.attributes;if(!c||ct(a))return;O=mr(L.uponSanitizeAttribute,O,Nt,tt);let p={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:O,forceKeepAttr:void 0},g=c.length,b=M(a.nodeName);for(;g--;){let k=c[g],_=k.name,C=k.namespaceURI,W=k.value,G=M(_),Zt=W,H=_==="value"?Zt:Ma(Zt);if(p.attrName=G,p.attrValue=H,p.keepAttr=!0,p.forceKeepAttr=void 0,te(L.uponSanitizeAttribute,a,p),H=p.attrValue,Jn&&(G==="id"||G==="name")&&oi(H,er)!==0&&(me(_,a,k),H=er+H),fe&&U(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,H)){me(_,a,k);continue}if(G==="attributename"&&ii(H,"href")){me(_,a,k);continue}if(!p.forceKeepAttr){if(!p.keepAttr){me(_,a,k);continue}if(!Xn&&U(Ja,H)){me(_,a,k);continue}if(ae&&(H=lt(H)),!br(b,G,H)){me(_,a,k);continue}H=ko(b,G,C,H),H!==Zt&&yo(a,_,C,H)}}te(L.afterSanitizeAttributes,a,null)},ut=function(a){let c=null,p=hr(a);for(te(L.beforeSanitizeShadowDOM,a,null);c=p.nextNode();)if(te(L.uponSanitizeShadowNode,c,null),vr(c,a),kr(c),Le(c.content)&&ut(c.content),Me(c)===q.element){let g=ue(c);Le(g)&&(Yt(g),ut(g))}te(L.afterSanitizeShadowDOM,a,null)},Yt=function(a){let c=[{node:a,shadow:null}];for(;c.length>0;){let p=c.pop();if(p.shadow){ut(p.shadow);continue}let g=p.node,k=Me(g)===q.element,_=P(g);if(_)for(let C=_.length-1;C>=0;--C)c.push({node:_[C],shadow:null});if(k){let C=X?X(g):null;if(typeof C=="string"&&M(C)==="template"){let W=g.content;Le(W)&&c.push({node:W,shadow:null})}}if(k){let C=ue(g);Le(C)&&c.push({node:null,shadow:C},{node:C,shadow:null})}}};return t.sanitize=function(f){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},c=null,p=null,g=null,b=null;if(Bt=!f,Bt&&(f="<!-->"),typeof f!="string"&&!ze(f)&&(f=Fa(f),typeof f!="string"))throw we("dirty is not a string, aborting");if(!t.isSupported)return f;zt?(R=et,O=tt):qt(a),(L.uponSanitizeElement.length>0||L.uponSanitizeAttribute.length>0)&&(R=V(R)),L.uponSanitizeAttribute.length>0&&(O=V(O)),t.removed=[];let k=Ht&&typeof f!="string"&&ze(f);if(k){go(f);let W=Dt(f);if(typeof W=="string"){let G=M(W);if(!R[G]||Ne[G])throw at(f),we("root node is forbidden and cannot be sanitized in-place")}if(ct(f))throw at(f),we("root node is clobbered and cannot be sanitized in-place");try{Yt(f)}catch(G){throw at(f),G}}else if(ze(f))c=fr("<!---->"),p=c.ownerDocument.importNode(f,!0),p.nodeType===q.element&&p.nodeName==="BODY"||p.nodeName==="HTML"?c=p:c.appendChild(p),Yt(p);else{if(!xe&&!ae&&!he&&f.indexOf("<")===-1)return B&&rt?Ee(f):f;if(c=fr(f),!c)return xe?null:rt?pe:""}c&&Ft&&se(c.firstChild);let _=k?f:c;try{let W=hr(_);for(;g=W.nextNode();)vr(g,_),kr(g),Le(g.content)&&ut(g.content)}catch(W){throw k&&(at(f),ke(t.removed,G=>{G.element&&st(G.element)})),W}if(k)return ke(t.removed,W=>{W.element&&st(W.element)}),ae&&Vt(f),f;if(xe){if(ae&&Vt(c),nt)for(b=Zi.call(c.ownerDocument);c.firstChild;)b.appendChild(c.firstChild);else b=c;return(O.shadowroot||O.shadowrootmode)&&(b=Xi.call(r,b,!0)),b}let C=he?c.outerHTML:c.innerHTML;return he&&R["!doctype"]&&c.ownerDocument&&c.ownerDocument.doctype&&c.ownerDocument.doctype.name&&U(Ka,c.ownerDocument.doctype.name)&&(C="<!DOCTYPE "+c.ownerDocument.doctype.name+`>
`+C),ae&&(C=lt(C)),B&&rt?Ee(C):C},t.setConfig=function(){let f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};qt(f),zt=!0,et=R,tt=O},t.clearConfig=function(){_e=null,zt=!1,et=null,tt=null,B=Pt,pe=""},t.isValidAttribute=function(f,a,c){_e||qt({});let p=M(f),g=M(a);return br(p,g,c)},t.addHook=function(f,a){typeof a=="function"&&j(L,f)&&je(L[f],a)},t.removeHook=function(f,a){if(j(L,f)){if(a!==void 0){let c=Da(L[f],a);return c===-1?void 0:Pa(L[f],c,1)[0]}return ri(L[f])}},t.removeHooks=function(f){j(L,f)&&(L[f]=[])},t.removeAllHooks=function(){L=mi()},t}var ki=wi();function h(e,t){let n=document.createElement(e);return t&&(n.className=t),n}function D(e,t){return e.textContent=t,e}var is={headerOf:new Map,infoOf:new Map};function xn(e,t){if(t.size===0)return is;let n=new Map;for(let o of e){let l=o.partOf?.id;if(!l)continue;let s=n.get(l);s?s.push(o):n.set(l,[o])}let r=new Map,i=new Map;for(let[o,l]of n){if(l.length<2)continue;let s=Fe(l),d=s[0],u=d.partOf.type;if(!t.has(u))continue;let m=s.length;s.forEach((v,w)=>{r.set(v,d),i.set(v,{key:o,type:u,index:w+1,total:m,members:s})})}return{headerOf:r,infoOf:i}}var os={en:{loading:"Loading events\u2026",empty:"No upcoming events.",notFound:"Event not found in this feed.",errorPrefix:"Could not load events: ",online:"Online",onlineEvent:"Online event",free:"Free",updated:"Updated",event:"Event",when:"When",lastUpdate:"Last update",location:"Location",locationUnknown:"Venue not specified",onlineLinkUnknown:"No public link",onlineLinkUnknownHint:"The organizer may share the link privately, e.g. after registration.",organizer:"Organizer",notAvailable:"\u2014",attendance:{"in-person":"In person",online:"Online",hybrid:"Hybrid"},eligibility:{open:"Open to all","members-only":"Members only","approval-required":"Approval required",restricted:"Restricted"},cfp:"Call for Proposals",cfpCloses:e=>`Call for Proposals \u2014 closes ${e}`,close:"Close",eventDetails:"Event details",addToGoogle:"Add to Google Calendar",addToOutlook:"Add to Outlook",addToYahoo:"Add to Yahoo",downloadIcs:"Download ICS",addToCalendar:"Add to calendar",openEventPage:"Open event page",groupSeries:"Series",groupMultipart:"Multi-part",groupCount:e=>`${e} occurrences`,groupCounter:(e,t)=>`${e} of ${t}`,previousOccurrence:"Previous occurrence",nextOccurrence:"Next occurrence"},es:{loading:"Cargando eventos\u2026",empty:"No hay pr\xF3ximos eventos.",notFound:"Evento no encontrado en este feed.",errorPrefix:"No se pudieron cargar los eventos: ",online:"En l\xEDnea",onlineEvent:"Evento en l\xEDnea",free:"Gratis",updated:"Actualizado",event:"Evento",when:"Cu\xE1ndo",lastUpdate:"\xDAltima actualizaci\xF3n",location:"Lugar",locationUnknown:"Sede no especificada",onlineLinkUnknown:"Sin enlace p\xFAblico",onlineLinkUnknownHint:"El organizador podr\xEDa compartir el enlace de forma privada, por ejemplo tras inscribirte.",organizer:"Organizador",notAvailable:"\u2014",attendance:{"in-person":"Presencial",online:"En l\xEDnea",hybrid:"H\xEDbrido"},eligibility:{open:"Abierto a todos","members-only":"Solo miembros","approval-required":"Requiere aprobaci\xF3n",restricted:"Acceso restringido"},cfp:"Convocatoria de ponencias",cfpCloses:e=>`Convocatoria de ponencias \u2014 cierra ${e}`,close:"Cerrar",eventDetails:"Detalles del evento",addToGoogle:"A\xF1adir a Google Calendar",addToOutlook:"A\xF1adir a Outlook",addToYahoo:"A\xF1adir a Yahoo",downloadIcs:"Descargar ICS",addToCalendar:"A\xF1adir al calendario",openEventPage:"Abrir p\xE1gina del evento",groupSeries:"Serie",groupMultipart:"Multi-part",groupCount:e=>`${e} ocurrencias`,groupCounter:(e,t)=>`${e} de ${t}`,previousOccurrence:"Ocurrencia anterior",nextOccurrence:"Ocurrencia siguiente"}};function Sn(e,t="event-description"){let n=h("div",t),r=S.parse(e,{async:!1});n.innerHTML=ki.sanitize(r);for(let i of n.querySelectorAll("a[href]"))i.setAttribute("target","_blank"),i.setAttribute("rel","noopener");return n}function _n(e,t){let n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("class",t),n.setAttribute("viewBox","0 0 24 24"),n.setAttribute("fill","none"),n.setAttribute("stroke","currentColor"),n.setAttribute("stroke-width","2"),n.setAttribute("stroke-linecap","round"),n.setAttribute("stroke-linejoin","round"),n.setAttribute("aria-hidden","true"),n.setAttribute("focusable","false");for(let r of e){let i=document.createElementNS("http://www.w3.org/2000/svg","path");i.setAttribute("d",r),n.append(i)}return n}function as(e){return _n({online:["M15 10l4.6-2.3A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.4.9L15 14","M3 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2"],"in-person":["M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0","M12 10h.01"],hybrid:["M4 5h9a2 2 0 0 1 2 2v5H2V7a2 2 0 0 1 2-2","M8 19h4","M10 12v7","M18 21s4-3.2 4-6a4 4 0 0 0-8 0c0 2.8 4 6 4 6","M18 15h.01"]}[e],"badge-icon")}function Qe(e){return _n({calendar:["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],"external-link":["M15 3h6v6","M10 14 21 3","M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"],edit:["M12 20h9","M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],trash:["M3 6h18","M8 6V4h8v2","M19 6l-1 14H6L5 6","M10 11v6","M14 11v6"],copy:["M8 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2","M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"],star:["M12 2l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.77 5.82 21 7 14.13 2 9.26l6.91-1L12 2"],check:["M20 6 9 17l-5-5"],bookmark:["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],plus:["M12 5v14","M5 12h14"],folder:["M4 4h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],collection:["M4 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2","M8 2v4","M16 2v4","M7 10h10","M7 14h7"]}[e],"action-icon")}function Ln(e,t){let n=h("span",`badge attendance-badge attendance-${e}`);return n.append(as(e),document.createTextNode(t)),n}function Rn(e,t){let n=t.eligibility[e.type],r=e.url?h("a"):h("span");if(r.classList.add("badge","eligibility-badge"),e.url){let i=r;i.href=e.url,i.target="_blank",i.rel="noopener"}return r.textContent=n,e.note&&(r.title=e.note,r.setAttribute("aria-label",`${n}: ${e.note}`)),r}function On(e,t){let n=h("a","badge cfp-badge");n.href=e.url,n.target="_blank",n.rel="noopener",n.textContent=t.cfp;let r=Ke(e.closesAt,void 0);if(r){let i=t.cfpCloses(r);n.title=i,n.setAttribute("aria-label",i)}return n}function ss(e,t){return e==="multipart"?t.groupMultipart:t.groupSeries}function ls(e,t){let n=ss(e.type,t),r=h("span","badge event-group-badge");return r.textContent=n,r.setAttribute("aria-label",`${n}, ${t.groupCount(e.total)}`),r}function Cn(e,t){let n=Li(e,t),r=e.locationLink??Ri(n),i=Dn(e,t);if(!r){let l=D(h("span"),i);return cs(e)&&(l.title=t.onlineLinkUnknownHint),l}let o=h("a");return o.href=r,o.target="_blank",o.rel="noopener",o.textContent=i,o}function cs(e){return e.attendanceMode==="online"&&!e.locationLink&&(!e.location||e.location==="online")}function Li(e,t){return e.location&&e.location!=="online"?e.location:e.attendanceMode==="online"?t.onlineLinkUnknown:t.locationUnknown}function Dn(e,t){let n=Li(e,t),r=e.locationLink??Ri(n);return ds(r?mt(r):n,t)}function ds(e,t){return!e||e==="online"?t.online:e==="Online link"||e==="Online event"?t.onlineEvent:e}function Ri(e){if(e)try{let t=new URL(e);return t.protocol==="http:"||t.protocol==="https:"?e:void 0}catch{return}}function Pn(e){let t=ft(e.startDate);return t!==null&&t<Date.now()}function Oi(e){if(!e.feed)return[];let t=e.sort==="none"?[...e.feed.events]:Fe(e.feed.events);return e.eventId!==void 0?t.filter(n=>n.id===e.eventId):t.filter(n=>e.showPast||!Pn(n))}function Rt(e){return e.layout!=="cards"||e.groupEvents.size===0?{headerOf:new Map,infoOf:new Map}:xn(Oi(e),e.groupEvents)}function Mn(e){let t=Oi(e);if(e.layout!=="cards"||e.groupEvents.size===0)return t.slice(0,e.limit);let{headerOf:n}=xn(t,e.groupEvents),r=new Set,i=[];for(let o of t){let l=n.get(o)??o;r.has(l)||(r.add(l),i.push(l))}return i.slice(0,e.limit)}function us(e,t){if(e.amount===0)return t.free;if(e.currency)try{return new Intl.NumberFormat(void 0,{style:"currency",currency:e.currency}).format(e.amount)}catch{return`${e.amount} ${e.currency}`}return String(e.amount)}function In(e,t){let n=us(e,t);if(!e.url)return D(h("span","price"),n);let r=h("a","price");return r.href=e.url,r.target="_blank",r.rel="noopener",r.textContent=n,r}function yi(e,t){if(!e)return;let n=ht(e),r=new Date(`${e}${t==="UTC"&&!n?"Z":""}`);return Number.isNaN(r.valueOf())?void 0:r}function Tt(e,t){let n=e.toISOString();return t?n.slice(0,10).replace(/-/g,""):n.replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z")}function ps(e){let t=new Date(e);return t.setUTCDate(t.getUTCDate()+1),t}function fs(e){let t=yi(e.startDate,e.timezone);if(!t)return;let n=ht(e.startDate),r=yi(n&&e.endDate?Qt(e.endDate,1):e.endDate,e.timezone)??(n?ps(t):t);return{start:t,end:r,dateOnly:n}}function Ci(e){return e.description??""}function hs(e,t,n){if(e==="link")return t.link;let r=fs(t);if(!r)return;let i=Tt(r.start,r.dateOnly),o=Tt(r.end,r.dateOnly),l=Ci(t),s=Dn(t,n);if(e==="google-calendar"){let d=new URL("https://calendar.google.com/calendar/render");return d.searchParams.set("action","TEMPLATE"),d.searchParams.set("text",t.name),d.searchParams.set("dates",`${i}/${o}`),l&&d.searchParams.set("details",l),s&&d.searchParams.set("location",s),t.timezone&&d.searchParams.set("ctz",t.timezone),d.toString()}if(e==="outlook-calendar"){let d=new URL("https://outlook.live.com/calendar/0/action/compose");return d.searchParams.set("rru","addevent"),d.searchParams.set("subject",t.name),d.searchParams.set("startdt",r.start.toISOString()),d.searchParams.set("enddt",r.end.toISOString()),l&&d.searchParams.set("body",l),s&&d.searchParams.set("location",s),d.toString()}if(e==="yahoo-calendar"){let d=new URL("https://calendar.yahoo.com/");return d.searchParams.set("v","60"),d.searchParams.set("title",t.name),d.searchParams.set("st",i),d.searchParams.set("et",o),l&&d.searchParams.set("desc",l),s&&d.searchParams.set("in_loc",s),d.toString()}return`data:text/calendar;charset=utf-8,${encodeURIComponent(ms(t,r,n))}`}function Ze(e){return e.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}function ms(e,t,n){let r=d=>Tt(d,t.dateOnly),i=t.dateOnly?";VALUE=DATE":"",o=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//OpenTechEvents//ote-events//EN","BEGIN:VEVENT",`UID:${Ze(e.link??e.name)}`,`DTSTAMP:${Tt(new Date,!1)}`,`DTSTART${i}:${r(t.start)}`,`DTEND${i}:${r(t.end)}`,`SUMMARY:${Ze(e.name)}`],l=Ci(e),s=Dn(e,n);return l&&o.push(`DESCRIPTION:${Ze(l)}`),s&&o.push(`LOCATION:${Ze(s)}`),e.link&&o.push(`URL:${Ze(e.link)}`),o.push("END:VEVENT","END:VCALENDAR"),o.join(`\r
`)}function gs(e){if(!e)return null;let n=new Date(e).valueOf();return Number.isNaN(n)?null:n}function vs(e){let t=gs(e);if(t===null)return e;let n=Math.round((t-Date.now())/1e3),r=Math.abs(n),i=[["year",31536e3,"y"],["month",2592e3,"mo"],["week",604800,"w"],["day",86400,"d"],["hour",3600,"h"],["minute",60,"m"]];for(let[,o,l]of i)if(r>=o)return`${Math.max(1,Math.round(r/o))}${l}`;return"now"}function Ke(e,t){if(!e)return;let n=/^\d{4}-\d{2}-\d{2}$/.test(e),r=new Date(`${e}${t==="UTC"&&!n?"Z":""}`);if(Number.isNaN(r.valueOf()))return t?`${e} (${t})`:e;let i=n?{weekday:"short",month:"short",day:"numeric",year:"numeric"}:{weekday:"short",month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"},o=new Intl.DateTimeFormat(void 0,i).format(r);return t&&!n?`${o} (${t})`:o}function Ei(e){if(!e)return;let t=/^\d{4}-\d{2}-\d{2}$/.test(e),n=new Date(e);if(Number.isNaN(n.valueOf()))return e;let r=t?{month:"short",day:"numeric"}:{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"};return new Intl.DateTimeFormat(void 0,r).format(n)}function bs(e){if(!e)return;let t=new Date(e);return Number.isNaN(t.valueOf())?e:new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric"}).format(t)}function ws(e,t){if(!e||!t)return!1;let n=new Date(e),r=new Date(t);return Number.isNaN(n.valueOf())||Number.isNaN(r.valueOf())?!1:n.getFullYear()===r.getFullYear()&&n.getMonth()===r.getMonth()&&n.getDate()===r.getDate()}function xi(e){if(!e||/^\d{4}-\d{2}-\d{2}$/.test(e))return;let t=new Date(e);if(!Number.isNaN(t.valueOf()))return new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).format(t)}function Nn(e){let t=Ei(e.startDate),n=Ei(e.endDate);if(t&&e.endDate&&ws(e.startDate,e.endDate)){let r=bs(e.startDate),i=xi(e.startDate),o=xi(e.endDate);if(r&&i&&o)return`${r}, ${i}-${o}`}return t&&n&&n!==t?`${t} \u2013 ${n}`:t??e.dateLabel}function $n(e){if(e.dateLabel)return e.dateLabel;let t=Ke(e.startDate,e.timezone),n=Ke(e.endDate,e.timezone);return t&&n?`${t} to ${n}`:t}function ks(e){let t=Nn(e),n=$n(e)??Ue(e),r=t??n;if(!r)return;let i=D(h("p","event-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function ys(e){let t=Nn(e),n=$n(e)??Ue(e),r=t??n;if(!r)return;let i=D(h("span","event-detail-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function St(e){if(e.image)return/^http:\/\//i.test(e.image.url)&&globalThis.location?.protocol==="https:"?void 0:e.image}function zn(e,t){let n=St(e);if(!n)return;let r=h("img","event-image");return r.src=n.url,r.alt=n.alt??e.name,r.loading="lazy",r.addEventListener("error",()=>{r.replaceWith(Di(t))}),r}function Di(e){if(e){let t=h("img","event-image event-image-placeholder");return t.src=e,t.alt="",t.loading="lazy",t.addEventListener("error",()=>t.replaceWith(h("div","event-image event-image-placeholder"))),t}return h("div","event-image event-image-placeholder")}function Es(e,t,n,r){let i=h("li","event");Pn(e)&&i.classList.add("event-past"),Fn(i,e,t),xs(i,e,t);let o=r?.infoOf.get(e);o&&(i.classList.add("event-stacked"),i.append(ls(o,n))),t.previewFields.has("image")&&i.append(zn(e,t.placeholderImage)??Di(t.placeholderImage));let l=h("div","event-body");i.append(l);let s=h("h3","event-title");if(e.link&&t.eventClick==="link"){let m=h("a");m.href=e.link,m.target="_blank",m.rel="noopener",m.textContent=e.name,s.append(m)}else s.textContent=e.name;if(l.append(s),t.previewFields.has("when")){let m=ks(e);m&&l.append(m)}let d=h("div","event-badges");t.previewFields.has("attendance")&&e.attendanceMode&&d.append(Ln(e.attendanceMode,n.attendance[e.attendanceMode])),t.previewFields.has("price")&&e.price&&d.append(In(e.price,n)),t.previewFields.has("eligibility")&&e.eligibility&&d.append(Rn(e.eligibility,n)),t.previewFields.has("cfp")&&e.cfp&&d.append(On(e.cfp,n)),Un(d,e,t);let u=h("div","event-meta");if(d.children.length>0&&u.append(d),t.previewFields.has("location")){let m=h("p","event-location");m.append(Cn(e,n)),u.append(m)}if(u.children.length>0&&l.append(u),t.previewFields.has("organizer")&&e.organizerName&&l.append(D(h("p","event-organizer"),e.organizerName)),t.previewFields.has("description")){let m=Kt(e.description,220);m&&l.append(Sn(m))}if(t.previewFields.has("tags")&&e.tags&&e.tags.length>0){let m=h("ul","tags");for(let v of e.tags)m.append(D(h("li","tag"),v));l.append(m)}return Rs(l,e,n,t),i}function An(e,t){return e.details?.find(n=>n.label===t)?.value}var Pi=new Set(["ID","Source","Image","Updated"]);function xs(e,t,n){n.eventClick!=="none"&&(e.classList.add("event-clickable"),e.tabIndex=0,e.addEventListener("click",r=>{let i=r.target;i instanceof Element&&i.closest("a, button, summary")||Ai(t,n)}),e.addEventListener("keydown",r=>{r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),Ai(t,n))}))}function Ai(e,t){t.onEventOpen?.(e),t.eventClick==="link"&&e.link&&window.open(e.link,"_blank","noopener")}function ye(e,t,n){n&&e.append(D(h("dt"),t),D(h("dd"),n))}function Tn(e,t,n){if(!n)return;let r=h("dd");r.append(n),e.append(D(h("dt"),t),r)}function As(e,t){let n=h("span",`event-header-icon ${e}`);return n.title=t,n.setAttribute("aria-label",t),n}function Ts(e,t,n){let r=h("li","event event-row");Pn(e)&&r.classList.add("event-past"),Fn(r,e,n);let i=h("details","event-accordion");r.append(i);let o=h("summary","event-summary");i.append(o);let l=h("span","event-summary-title");l.textContent=e.name,o.append(l);let s=$n(e)??Ue(e),d=Nn(e)??s;o.append(D(h("span","event-summary-when"),d||t.notAvailable)),o.append(D(h("span","event-summary-updated"),vs(e.updatedAt??An(e,"Updated"))??t.notAvailable));let u=h("div","event-details"),m=n.detailFields.has("image")&&!!St(e),v=e.description?.trim().length??0;!m&&v>0&&v<=180&&u.classList.add("event-details-compact"),i.append(u);let w=h("div","event-details-content"),T=h("div","event-details-main"),y=h("aside","event-details-aside");if(w.append(T,y),u.append(w),m){let N=zn(e,n.placeholderImage);N&&y.append(N)}let x=h("div","event-badges");n.detailFields.has("attendance")&&e.attendanceMode&&x.append(Ln(e.attendanceMode,t.attendance[e.attendanceMode])),n.detailFields.has("price")&&e.price&&x.append(In(e.price,t)),n.detailFields.has("eligibility")&&e.eligibility&&x.append(Rn(e.eligibility,t)),n.detailFields.has("cfp")&&e.cfp&&x.append(On(e.cfp,t)),Un(x,e,n),x.children.length>0&&y.append(x),n.detailFields.has("description")&&e.description&&T.append(Sn(e.description));let P=h("dl","event-detail-list");n.detailFields.has("when")&&ye(P,t.when,s),n.detailFields.has("location")&&Tn(P,t.location,Cn(e,t)),n.detailFields.has("organizer")&&ye(P,t.organizer,e.organizerName),ye(P,t.updated,Ke(e.updatedAt??An(e,"Updated"),void 0));for(let N of e.details??[])Pi.has(N.label)||ye(P,N.label,N.value);if(P.children.length>0&&y.append(P),n.detailFields.has("tags")&&e.tags&&e.tags.length>0){let N=h("ul","tags");for(let ue of e.tags)N.append(D(h("li","tag"),ue));T.append(N)}return zi(u,e,t,n),Os(r,e,t,n),r}function Ti(e,t){return e==="google-calendar"?t.addToGoogle:e==="outlook-calendar"?t.addToOutlook:e==="yahoo-calendar"?t.addToYahoo:e==="ics"?t.downloadIcs:t.openEventPage}var _t=new Set(["google-calendar","outlook-calendar","yahoo-calendar","ics"]);function Ss(e){return typeof e!="string"&&"type"in e}function _s(e){return typeof e!="string"&&"id"in e}function Xe(e){return typeof e=="string"?e:e.type}function Mi(e,t){return!e.layouts||e.layouts.includes(t)}function Ii(e,t){let n=e.placement??"detail";return n===t||n==="both"}function Ls(e,t,n){return typeof e=="string"?t==="detail":Ii(e,t)&&Mi(e,n)}function Ni(e,t,n){return Hi(e,t).filter(r=>(typeof r=="string"||Ss(r))&&Ls(r,n,e.layout))}function $i(e,t,n){return Hi(e,t).filter(r=>_s(r)&&Ii(r,n)&&Mi(r,e.layout))}function Lt(e,t,n,r,i){let o=Xe(t),l=hs(o,n,r);if(!l)return;let s=h("a");s.href=l,s.target=o==="ics"?"_self":"_blank",s.rel="noopener",o==="ics"&&s.setAttribute("download","event.ics"),o==="link"?s.append(Qe("external-link"),document.createTextNode(Ti(o,r))):s.textContent=Ti(o,r),s.addEventListener("click",()=>i.onEventAction?.(t,n)),e.append(s)}function zi(e,t,n,r){let i=h("div","event-actions"),o=Ni(r,t,"detail"),l=o.filter(s=>_t.has(Xe(s)));if(l.length>0){let s=h("details","event-action-menu"),d=h("summary","event-action-menu-trigger");d.append(Qe("calendar"),document.createTextNode(n.addToCalendar)),s.append(d);let u=h("div","event-action-menu-items");for(let m of l)Lt(u,m,t,n,r);u.children.length>0&&(s.append(u),i.append(s))}for(let s of o)_t.has(Xe(s))||Lt(i,s,t,n,r);for(let s of $i(r,t,"detail"))i.append(Ui(s,t,r));i.children.length>0&&e.append(i)}function Fi(e,t,n){let r=Ni(n,e,"preview"),i=$i(n,e,"preview");if(r.length===0&&i.length===0)return;let o=h("div","event-actions event-preview-actions"),l=r.filter(s=>_t.has(Xe(s)));if(l.length>0){let s=h("details","event-action-menu"),d=h("summary","event-action-menu-trigger");d.append(Qe("calendar"),document.createTextNode(t.addToCalendar)),s.append(d);let u=h("div","event-action-menu-items");for(let m of l)Lt(u,m,e,t,n);u.children.length>0&&(s.append(u),o.append(s))}for(let s of r)_t.has(Xe(s))||Lt(o,s,e,t,n);for(let s of i)o.append(Ui(s,e,n));return o}function Rs(e,t,n,r){let i=Fi(t,n,r);i&&e.append(i)}function Os(e,t,n,r){let i=Fi(t,n,r);i&&(i.classList.add("event-row-actions"),e.append(i))}function Ui(e,t,n){let r=h("button");return r.type="button",r.classList.add("event-custom-action"),e.variant==="danger"&&r.classList.add("event-action-danger"),e.pressed!==void 0&&r.setAttribute("aria-pressed",String(e.pressed)),e.icon?r.append(Qe(e.icon),document.createTextNode(e.label)):r.textContent=e.label,r.addEventListener("click",()=>{n.onEventAction?.(e,t),e.onClick(t,Ot(n,t))}),r}function Ot(e,t){let n=e.eventContext?.(t)??{previewEvent:t,index:e.feed?.events.indexOf(t)??-1},r=Rt(e).infoOf.get(t);return r?{...n,group:r}:n}function Hi(e,t){return typeof e.eventActions=="function"?e.eventActions(Ot(e,t)):e.eventActions}function Cs(e){return e?(Array.isArray(e)?e:e.split(/\s+/)).map(n=>n.trim()).filter(Boolean):[]}function Fn(e,t,n){for(let r of Cs(n.eventClassName?.(Ot(n,t))))e.classList.add(r)}function Un(e,t,n){let r=n.eventBadges?.(Ot(n,t))??[];for(let i of r){if(typeof i=="string"){let l=h("span","badge event-custom-badge event-custom-badge-default");l.title=i,l.append(D(h("span","event-custom-badge-label"),i)),e.append(l);continue}let o=h("span",`badge event-custom-badge event-custom-badge-${i.tone??"default"}`);o.title=i.title??i.label,i.icon&&o.append(Qe(i.icon)),o.append(D(h("span","event-custom-badge-label"),i.label)),e.append(o)}}function Si(e){return _n([e==="left"?"M15 18l-6-6 6-6":"M9 18l6-6-6-6"],"event-modal-nav-icon")}function Ds(e,t,n){let r=h("div","event-modal-nav"),i=h("button","event-modal-nav-button");i.type="button",i.setAttribute("aria-label",t.previousOccurrence),i.title=t.previousOccurrence,i.append(Si("left"));let o=e.members[e.index-2];i.disabled=!o,i.addEventListener("click",()=>{o&&n.onEventOpen?.(o)});let l=h("span","event-modal-nav-counter");l.setAttribute("aria-live","polite"),l.textContent=t.groupCounter(e.index,e.total);let s=h("button","event-modal-nav-button");s.type="button",s.setAttribute("aria-label",t.nextOccurrence),s.title=t.nextOccurrence,s.append(Si("right"));let d=e.members[e.index];return s.disabled=!d,s.addEventListener("click",()=>{d&&n.onEventOpen?.(d)}),r.append(i,l,s),r}function _i(e,t,n,r){let i=h("div","event-modal-backdrop");i.tabIndex=-1,i.addEventListener("click",x=>{x.target===i&&n.onEventClose?.()}),i.addEventListener("keydown",x=>{x.key==="Escape"&&n.onEventClose?.()});let o=h("section","event-modal");Fn(o,e,n);let l=e.description?.trim().length??0;!St(e)&&l>0&&l<=180&&o.classList.add("event-modal-compact"),o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-label",t.eventDetails),i.append(o);let s=h("div","event-modal-header");s.append(D(h("h2","event-modal-title"),e.name));let d=h("button","event-modal-close");d.type="button",d.textContent="\xD7",d.title=t.close,d.setAttribute("aria-label",t.close),d.addEventListener("click",()=>n.onEventClose?.()),s.append(d),o.append(s);let u=r?.infoOf.get(e),m=h("div","event-modal-content"),v=h("div","event-modal-main"),w=h("aside","event-modal-aside");if(m.append(v,w),o.append(m),n.detailFields.has("image")&&St(e)){let x=zn(e,n.placeholderImage);x&&w.append(x)}let T=h("div","event-badges");n.detailFields.has("attendance")&&e.attendanceMode&&T.append(Ln(e.attendanceMode,t.attendance[e.attendanceMode])),n.detailFields.has("price")&&e.price&&T.append(In(e.price,t)),n.detailFields.has("eligibility")&&e.eligibility&&T.append(Rn(e.eligibility,t)),n.detailFields.has("cfp")&&e.cfp&&T.append(On(e.cfp,t)),Un(T,e,n),T.children.length>0&&w.append(T),n.detailFields.has("description")&&e.description&&v.append(Sn(e.description));let y=h("dl","event-detail-list");n.detailFields.has("when")&&Tn(y,t.when,ys(e)),u&&u.total>1&&y.append(Ds(u,t,n)),n.detailFields.has("location")&&Tn(y,t.location,Cn(e,t)),n.detailFields.has("organizer")&&ye(y,t.organizer,e.organizerName),ye(y,t.updated,Ke(e.updatedAt??An(e,"Updated"),void 0));for(let x of e.details??[])Pi.has(x.label)||ye(y,x.label,x.value);if(y.children.length>0&&w.append(y),n.detailFields.has("tags")&&e.tags&&e.tags.length>0){let x=h("ul","tags");for(let P of e.tags)x.append(D(h("li","tag"),P));v.append(x)}return zi(o,e,t,n),queueMicrotask(()=>d.focus()),i}function Bi(e,t){e.replaceChildren();let n=os[t.lang];if(t.status==="idle"||t.status==="loading"){e.append(D(h("p","message"),n.loading));return}if(t.status==="error"){e.append(D(h("p","message error"),`${n.errorPrefix}${t.errorMessage}`));return}let r=Mn(t);if(r.length===0){let l=t.emptyMessage??(t.eventId!==void 0?n.notFound:n.empty);e.append(D(h("p","message"),l));return}if(t.layout==="calendar"){e.append(D(h("div","calendar-host"),n.loading)),t.selectedEvent&&e.append(_i(t.selectedEvent,n,t));return}let i=Rt(t),o=h("ul",`events layout-${t.layout}`);if(t.layout==="list"){let l=h("li","event-list-header");l.append(D(h("span"),n.event),D(h("span"),n.when),As("icon-updated",n.lastUpdate)),o.append(l)}for(let l of r)o.append(t.layout==="list"?Ts(l,n,t):Es(l,t,n,i));e.append(o),t.selectedEvent&&e.append(_i(t.selectedEvent,n,t,i))}var Wi=`
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
`;var Hn=class extends HTMLElement{static observedAttributes=["feed","feeds","event-id","limit","theme","lang","show-past","layout","fields","fields-preview","fields-detail","card-width","group-events","placeholder-image","event-click","event-actions","sort","empty-message"];#u;#o;#a;#n;#d=!1;#s=[];#l;#c=new WeakMap;#r="idle";#i="";#f=0;#t;#h=[];#m;#g;#v;#p=0;#E=!1;constructor(){super();let t=this.attachShadow({mode:"open"});this.#u=document.createElement("style"),this.#u.textContent=Wi,this.#o=document.createElement("div"),this.#o.className="ote-events",t.append(this.#u,this.#o)}connectedCallback(){this.#d?this.#e():this.#b()}disconnectedCallback(){this.#y()}attributeChangedCallback(t){this.isConnected&&(t==="feed"||t==="feeds"?this.#b():this.#e())}get feedData(){return this.#n}set feedData(t){this.#w(t)}get events(){if(this.#n)return Array.isArray(this.#n)?this.#n:this.#n.events}set events(t){this.#w(t)}get event(){return this.events?.[0]}set event(t){this.#w(t==null?t:[t])}get eventActions(){return this.#h}set eventActions(t){this.#h=Array.isArray(t)||typeof t=="function"?t:[],this.isConnected&&this.#e()}get eventClassName(){return this.#m}set eventClassName(t){this.#m=typeof t=="function"?t:void 0,this.isConnected&&this.#e()}get eventBadges(){return this.#g}set eventBadges(t){this.#g=typeof t=="function"?t:void 0,this.isConnected&&this.#e()}#x(){let t=Jr(this.getAttribute("feeds"));if(t.length>0)return t;let n=this.getAttribute("feed");return n?[n]:[]}async#b(){if(this.#d)return;let t=this.#x();if(t.length===0){this.#r="error",this.#i='Missing required "feed" or "feeds" attribute.',this.#t=void 0,this.#e();return}this.#r="loading",this.#e();let n=++this.#f,r=await Promise.allSettled(t.map(Ps));if(n!==this.#f)return;let i=r.filter(o=>o.status==="fulfilled");if(i.length===0){this.#r="error",this.#i=t.length===1?Gi(r[0].reason):r.map((o,l)=>`${t[l]}: ${Gi(o.reason)}`).join("; "),this.#t=void 0,this.#e();return}try{let o=Ms(i.map(s=>s.value)),l=gt(o);this.#a=l,this.#n=o,this.#d=!1,this.#s=Ct(o),this.#l=i.length===1?ji(o,i[0].value.url):void 0,this.#c=qi(l,this.#s,this.#l),this.#r="loaded",this.#t=void 0}catch(o){this.#r="error",this.#i=o instanceof Error?o.message:String(o),this.#t=void 0}this.#e()}#w(t){if(this.#f++,t==null){this.#n=void 0,this.#d=!1,this.#a=void 0,this.#s=[],this.#l=void 0,this.#c=new WeakMap,this.#i="",this.#t=void 0,this.isConnected&&this.#b();return}this.#n=t,this.#d=!0;try{this.#a=gt(t),this.#s=Ct(t),this.#l=ji(t),this.#c=qi(this.#a,this.#s,this.#l),this.#r="loaded",this.#i="",this.#t=void 0}catch(n){this.#a=void 0,this.#s=[],this.#l=void 0,this.#c=new WeakMap,this.#r="error",this.#i=n instanceof Error?n.message:String(n),this.#t=void 0}this.isConnected&&this.#e()}#e(){this.style.setProperty("--ote-card-min-width",ei(this.getAttribute("card-width")));let t=Gr(Wr(this.getAttribute("lang")),navigator.language),n={status:this.#r,errorMessage:this.#i,feed:this.#a,lang:t,limit:Br(this.getAttribute("limit")),eventId:jr(this.getAttribute("event-id")),showPast:qr(this.getAttribute("show-past")),sort:Yr(this.getAttribute("sort")),layout:Vr(this.getAttribute("layout")),previewFields:Kr(this.getAttribute("fields-preview")??this.getAttribute("fields")),detailFields:Xr(this.getAttribute("fields-detail")??this.getAttribute("fields")),groupEvents:Qr(this.getAttribute("group-events")),placeholderImage:this.getAttribute("placeholder-image")?.trim()||void 0,emptyMessage:this.getAttribute("empty-message")?.trim()||void 0,eventClick:xt(this.getAttribute("event-click")),eventActions:this.#T(),eventClassName:this.#m,eventBadges:this.#g,eventContext:r=>this.#c.get(r)??{previewEvent:r,index:-1},selectedEvent:this.#t,onEventOpen:r=>{this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#k(void 0,r,n)})),xt(this.getAttribute("event-click"))==="modal"&&(this.#t=r,this.#e())},onEventClose:()=>{this.#t=void 0,this.#e()},onEventAction:(r,i)=>{let o=typeof r=="string"?r:"type"in r?r.type:r.id;this.dispatchEvent(new CustomEvent("ote-event-action",{detail:this.#k(o,i,n)}))}};if(Bi(this.#o,n),n.layout==="calendar"&&n.status==="loaded"){let r=Mn(n);if(r.length>0){this.#A(r,n.lang);return}}this.#y()}async#A(t,n){this.#y();let r=++this.#p;try{let i=await import(new URL("./calendar-layout.js",import.meta.url).href);if(r!==this.#p||!this.isConnected)return;this.#E||(this.#u.textContent+=i.CALENDAR_CSS,this.#E=!0);let o=this.#o.querySelector(".calendar-host");if(!o)return;o.classList.remove("ec-dark","ec-auto-dark");let l=this.getAttribute("theme");l==="dark"?o.classList.add("ec-dark"):l!=="light"&&o.classList.add("ec-auto-dark"),o.replaceChildren(),this.#v=i.renderCalendar(o,t,{lang:n,onEventClick:s=>{let d=xt(this.getAttribute("event-click"));this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#k(void 0,s)})),d==="link"&&s.link?window.open(s.link,"_blank","noopener"):d==="modal"&&(this.#t=s,this.#e())}})}catch(i){if(r!==this.#p||!this.isConnected)return;let o=this.#o.querySelector(".calendar-host");o&&(o.textContent=i instanceof Error?i.message:String(i))}}#T(){let t=Zr(this.getAttribute("event-actions")),n=this.#h;return typeof n=="function"?r=>[...t,...n(r)]:[...t,...n]}#k(t,n,r){let i=this.#c.get(n)??{previewEvent:n,index:-1},o=r?Rt(r).infoOf.get(n):void 0;return{...t?{action:t}:{},event:n,previewEvent:n,originalEvent:i.originalEvent,index:i.index,feed:i.feed,source:i.source,...o?{group:o}:{}}}#y(){this.#p++,this.#v?.destroy(),this.#v=void 0}};function Ct(e){return Array.isArray(e)?e:Array.isArray(e.events)?e.events:[]}async function Ps(e){let t=await fetch(e);if(!t.ok)throw new Error(`HTTP ${t.status}`);let n=await t.text();return{url:e,data:JSON.parse(n)}}function Gi(e){return e instanceof Error?e.message:String(e)}function Ms(e){return e.length===1?e[0].data:{events:e.flatMap(({url:t,data:n})=>{let r=Array.isArray(n)?void 0:de(n.title);return Ct(n).map(i=>({...i,_feedUrl:de(i._feedUrl)??t,...!de(i._feedTitle)&&r?{_feedTitle:r}:{}}))})}}function de(e){return typeof e=="string"&&e.trim()?e:void 0}function ji(e,t){let n=Ct(e)[0],r=Array.isArray(e)?void 0:de(e.title??e._feedTitle),i={url:t??de(n?._feedUrl),title:r??de(n?._feedTitle)};return i.url||i.title?i:void 0}function qi(e,t,n){let r=new WeakMap;return e.events.forEach((i,o)=>{let l=t[o],s={url:de(l?._feedUrl)??n?.url,title:de(l?._feedTitle)??n?.title};r.set(i,{previewEvent:i,originalEvent:l,index:o,feed:s.url||s.title?s:n,source:l?.source})}),r}function Bn(){customElements.get("ote-events")||customElements.define("ote-events",Hn)}Bn();export{Bn as defineOteEvents};
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.4.14 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.14/LICENSE *)
*/
//# sourceMappingURL=ote-events.js.map
