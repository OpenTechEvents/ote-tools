function xn(t,e=320){if(!t)return;let n=t.replace(/\s+/g," ").trim();return n.length>e?`${n.slice(0,e-1)}\u2026`:n}function Yr(t){if(Array.isArray(t))return t.length>0?t.join(", "):void 0;if(typeof t=="string")return t.trim()||void 0;if(typeof t=="number"||typeof t=="boolean")return String(t);if(t&&typeof t=="object")return JSON.stringify(t)}function En(t){return t.flatMap(([e,n])=>{let r=Yr(n);return r?[{label:e,value:r}]:[]})}function Dt(t){if(!t)return null;let e=/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?))?/.exec(t),r=(e?new Date(`${e[1]}T${e[2]??"00:00:00"}`):new Date(t)).valueOf();return Number.isNaN(r)?null:r}function et(t){let e=Date.now();return t.map((n,r)=>({event:n,index:r,sortDate:Dt(n.startDate)})).sort((n,r)=>{if(n.sortDate===null&&r.sortDate===null)return n.index-r.index;if(n.sortDate===null)return 1;if(r.sortDate===null)return-1;let i=n.sortDate<e,a=r.sortDate<e;return i!==a?i?1:-1:i?r.sortDate-n.sortDate:n.sortDate-r.sortDate}).map(({event:n})=>n)}function Pt(t){return t!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(t)}function An(t,e){let n=new Date(`${t}T00:00:00Z`);return n.setUTCDate(n.getUTCDate()+e),n.toISOString().slice(0,10)}function Ct(t,e){if(!t)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(t))return new Intl.DateTimeFormat(void 0,{dateStyle:"medium"}).format(new Date(`${t}T00:00:00Z`));let r=new Date(`${t}${e==="UTC"?"Z":""}`);if(!Number.isNaN(r.valueOf())){let i=new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short"}).format(r);return e?`${i} (${e})`:i}return e?`${t} (${e})`:t}function Tn(t){return t.location?.venue??Ot(t.location?.onlineUrl)??"online"}function Ot(t){if(!t)return;let e;try{e=new URL(t).hostname.toLowerCase().replace(/^www\./,"")}catch{return"Online event"}return e==="meet.google.com"?"Google Meet":e==="teams.microsoft.com"?"Microsoft Teams":e==="meet.jit.si"||e.endsWith(".jitsi.net")?"Jitsi Meet":e==="discord.gg"||e==="discord.com"?"Discord":e==="youtube.com"||e==="youtu.be"?"YouTube":e==="twitch.tv"?"Twitch":e==="lu.ma"?"Luma":e.endsWith(".zoom.us")||e==="zoom.us"?"Zoom":e.endsWith(".slack.com")||e==="slack.com"?"Slack":e.endsWith(".meetup.com")||e==="meetup.com"?"Meetup":e.endsWith(".eventbrite.com")||e==="eventbrite.com"?"Eventbrite":"Online event"}function tt(t){return t.dateLabel??(t.endDate?`${Ct(t.startDate,t.timezone)} to ${Ct(t.endDate,t.timezone)}`:Ct(t.startDate,t.timezone))}function Sn(t){let e=(t??[]).map(n=>typeof n=="string"?{url:n}:n);return e.find(n=>!Aa(n.url))??e[0]}function Aa(t){return/^http:\/\//i.test(t)}function _n(t){let e=t.offers??[],n=t.partOf?.offers??[],r=Ta(n);if(e.length===0)return r?{amount:r.price,currency:r.currency,url:r.url,basis:"shared"}:void 0;let i=[];for(let l of e){if(l.price===void 0)continue;if(l.scope!=="add-on"){i.push({amount:l.price,currency:l.currency,url:l.url,basis:"own"});continue}let c=!!r?.currency&&!!l.currency&&r.currency!==l.currency;if(r&&!c){i.push({amount:r.price+l.price,currency:r.currency??l.currency,url:l.url??r.url,basis:"shared-plus-add-on"});continue}i.push({amount:l.price,currency:l.currency,url:l.url,basis:"add-on-only"})}if(i.length===0)return;let a=i.filter(l=>l.basis!=="add-on-only");return(a.length>0?a:i).reduce((l,c)=>c.amount<l.amount?c:l)}var Ta=t=>{let e=t.filter(r=>r.price!==void 0);if(e.length===0)return;let n=e.reduce((r,i)=>i.price<r.price?i:r);return{price:n.price,currency:n.currency,url:n.url}};function Sa(t){if(t?.id)return{id:t.id,type:t.type==="multipart"?"multipart":"series",name:t.name,url:t.url,offers:t.offers}}function _a(t){if(!t||t.amount===void 0)return;let e=`${t.amount}${t.currency?` ${t.currency}`:""}`;switch(t.basis){case"add-on-only":return`+${e} (additional charge, total unknown)`;case"shared":return`${e} (event admission)`;case"shared-plus-add-on":return`${e} (event admission + this part)`;case"own":return e}}function It(t){let e=Array.isArray(t)?{events:t}:t;if(!Array.isArray(e.events))throw new Error("feed.json has no events array");return{title:e.title,description:e.description,license:e.license,events:e.events.map(n=>{let r=Sn(n.image),i=_n({offers:n.offers,partOf:n.partOf}),a=n.organizers?.[0]?.name;return{id:n.id,name:n.name??"(untitled event)",startDate:n.startDate,endDate:n.endDate,timezone:n.timezone,location:Tn(n),locationLink:n.location?.onlineUrl,link:n.url??n.location?.onlineUrl,description:n.description,image:r,price:i,organizerName:a,tags:n.tags,attendanceMode:n.attendanceMode,updatedAt:n.updatedAt,partOf:Sa(n.partOf),eligibility:n.eligibility,cfp:n.cfp,details:En([["ID",n.id],["Status",n.status],["Timezone",n.timezone],["Attendance",n.attendanceMode],["Languages",n.languages],["Tags",n.tags],["Updated",n.updatedAt],["Source",n.source],["Image",r?.url],["Price",_a(i)],["Organizer",a]])}})}}function Dn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Me=Dn();function ai(t){Me=t}var Pe={exec:()=>null};function De(t){let e=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),i=e[r];return i||(i=t(r),e[r]=i),i}}function _(t,e=""){let n=typeof t=="string"?t:t.source,r={replace:(i,a)=>{let s=typeof a=="string"?a:a.source;return s=s.replace(V.caret,"$1"),n=n.replace(i,s),r},getRegex:()=>new RegExp(n,e)};return r}var si=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),V={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,listInterruptsParagraph:/^ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+)[ \t]*)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,blockquoteMarkerWhitespace:/^( {0,3}>)(\t[ \t]*)/gm,nestedBlockMarker:/^ {0,3}(?:(?:[*+-]|\d{1,9}[.)])(?: |$)|> ?)/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\][ \t]+\S/,listReplaceTask:/^\[[ xX]\][ \t]+/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,numericCharacterReferenceOrAmpersand:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:De(t=>new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:De(t=>new RegExp(`^ {0,${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:De(t=>new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)),headingBeginRegex:De(t=>new RegExp(`^ {0,${t}}#{1,6}(?:\\s|$)`)),pedanticHeadingBeginRegex:De(t=>new RegExp(`^ {0,${t}}#`)),htmlBeginRegex:De(t=>new RegExp(`^ {0,${t}}(?:</?(?:${On})(?:[ \\t]+|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`,"i")),blockquoteBeginRegex:De(t=>new RegExp(`^ {0,${t}}>`)),nestedContainerMarkers:/^(?: {0,3}(?:(?:[*+-]|\d{1,9}[.)])[ \t]+|>[ \t]?))+/},La=/^(?:[ \t]*(?:\n|$))+/,Ra=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ca=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}(?:(?=`)\1`*|(?=~)\1~*) *(?=\n|$)|$)/,it=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Da=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Pn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,On="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",ot=_(" {0,3}(?:</?(?:tag)(?:[ \\t]+|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",On).getRegex(),li=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+)[ \t]*(?:\n+|$)/,ci=_(li).replace(/bull/g,Pn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/\|table/g,"").replace(/html/g,ot).getRegex(),Pa=_(li).replace(/bull/g,Pn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).replace(/html/g,ot).getRegex(),In=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,Oa=/^[^\n]+/,Mn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\\n]|\n(?![ \t]*\n))+/,Ia=_(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<(?:\\.|[^\n<>\\])*>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Mn).replace("title",/(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\\n]|\n(?!\n))*'|\((?:\\[\s\S]|[^()\\])*\))/).getRegex(),Ma=_(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,Pn).getRegex(),Nn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Na=_("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?:[ \\t]+|\\n|/?>|$)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*?[ \\t]*/?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Nn).replace("tag",On).replace("attribute",/[ \t]+[a-zA-Z:_][\w.:-]*(?:[ \t]*=[ \t]*"[^"\n]*"|[ \t]*=[ \t]*'[^'\n]*'|[ \t]*=[ \t]*[^\s"'=<>`]+)?/).getRegex(),di=t=>_(In).replace("hr",it).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",t).replace("html",ot).getRegex(),za=di(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),$a=di(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),Fa=_(/^( {0,3}> ?(?:(?![ \t]*(?:\n|$))(paragraph)|[^\n]*)(?:\n|$))+/).replace("paragraph",$a).getRegex(),zn={blockquote:Fa,code:Ra,def:Ia,fences:Ca,heading:Da,hr:it,html:Na,lheading:ci,list:Ma,newline:La,paragraph:za,table:Pe,text:Oa},Kr=_("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",it).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html",ot).getRegex(),Ua={...zn,lheading:Pa,table:Kr,paragraph:_(In).replace("hr",it).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Kr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html",ot).getRegex()},Ha={...zn,html:_(`^ *(?:comment(?: *\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1>(?: *\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?>(?: *\\n{2,}|\\s*$))`).replace("comment",Nn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Pe,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:_(In).replace("hr",it).replace("heading",` *#{1,6} *[^
]`).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").replace("lheading",ci).getRegex()},Ba=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Wa=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ui=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,Ga=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,le=/[\p{P}\p{S}]/u,Ge=/[\s\p{P}\p{S}]/u,at=/[^\s\p{P}\p{S}]/u,ja=_(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Ge).getRegex(),qa=/[\p{Pi}\p{Ps}"']/u,pi=/(?!~)[\p{P}\p{S}]/u,Va=/(?!~)[\s\p{P}\p{S}]/u,Za=/(?:[^\s\p{P}\p{S}]|~)/u,Ya=_(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",si?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),fi=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Ka=_(fi,"u").replace(/punct/g,le).getRegex(),Xa=_(fi,"u").replace(/punct/g,pi).getRegex(),Qa=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,Ja=_(Qa,"u").replace(/openQuote/g,qa).replace(/punct/g,le).getRegex(),hi="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",es=_(hi,"gu").replace(/notPunctSpace/g,at).replace(/punctSpace/g,Ge).replace(/punct/g,le).getRegex(),ts=_(hi,"gu").replace(/notPunctSpace/g,Za).replace(/punctSpace/g,Va).replace(/punct/g,pi).getRegex(),ns="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",rs=_(ns,"gu").replace(/notPunctSpace/g,at).replace(/punctSpace/g,Ge).replace(/punct/g,le).getRegex(),is=_("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,at).replace(/punctSpace/g,Ge).replace(/punct/g,le).getRegex(),os="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",as=_(os,"gu").replace(/notPunctSpace/g,at).replace(/punctSpace/g,Ge).replace(/punct/g,le).getRegex(),ss=_(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,le).getRegex(),ls="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",cs=_(ls,"gu").replace(/notPunctSpace/g,at).replace(/punctSpace/g,Ge).replace(/punct/g,le).getRegex(),ds=_(/\\(punct)/,"gu").replace(/punct/g,le).getRegex(),us=_(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/,"gu").replace(/punct/g,le).getRegex(),ps=_(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),fs=_(Nn).replace("(?:-->|$)","-->").getRegex(),hs=_("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",fs).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),mi=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,zt=_(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",mi).getRegex(),ms=_(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",zt).replace("href",/<(?:\\.|[^\n<>\\])*>|(?!<)[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\((?:\\[\s\S]|[^)\\])*\)/).getRegex(),gs=_(/^!?\[(label)\]\[(ref)\]/).replace("label",zt).replace("ref",Mn).getRegex(),vs=_(/^!?\[(ref)\](?:\[\])?/).replace("ref",Mn).getRegex(),Xr=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,bs=_(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",mi).getRegex(),ks=_("reflink|nolink(?!\\()","g").replace("reflink",_(/^!?\[(label)\]\[(ref)\]/).replace("label",bs).replace("ref",Xr).getRegex()).replace("nolink",_(/^!?\[(ref)\](?:\[\])?/).replace("ref",Xr).getRegex()).getRegex(),Qr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,ws=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,ys=_(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,ws).getRegex(),$n={_backpedal:Pe,anyPunctuation:ds,anyPunctuationOutsideCode:us,autolink:ps,blockSkip:Ya,br:ui,code:Wa,del:Pe,delLDelim:Pe,delRDelim:Pe,emStrongLDelim:Ka,emStrongRDelimAst:es,emStrongRDelimUnd:is,escape:Ba,link:ms,nolink:vs,punctuation:ja,reflink:gs,reflinkSearch:ks,tag:hs,text:Ga,url:Pe},xs={...$n,emStrongLDelim:Ja,emStrongRDelimAst:rs,emStrongRDelimUnd:as,link:_(/^!?\[(label)\]\((.*?)\)/).replace("label",zt).getRegex(),reflink:_(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",zt).getRegex()},Ln={...$n,emStrongRDelimAst:ts,emStrongLDelim:Xa,delLDelim:ss,delRDelim:cs,url:_(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",ys).replace("protocol",Qr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:_(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|wwwStart|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",Qr).replace(/emailProtocol/g,/(?:mailto|xmpp):/).replace("wwwStart",si?"(?<![^\\s*_~(])www\\.":"www\\.").getRegex()},Es={...Ln,br:_(ui).replace("{2,}","*").getRegex(),text:_(Ln.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Mt={normal:zn,gfm:Ua,pedantic:Ha},nt={normal:$n,gfm:Ln,breaks:Es,pedantic:xs},As={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Jr=t=>As[t];function K(t,e){if(e){if(V.escapeTest.test(t))return t.replace(V.escapeReplace,Jr)}else if(V.escapeTestNoEncode.test(t))return t.replace(V.escapeReplaceNoEncode,Jr);return t}function Ts(t){return V.numericCharacterReference.test(t)?t.replace(V.numericCharacterReferenceOrAmpersand,(e,n,r)=>{if(n===void 0&&r===void 0)return"&amp;";let i=n===void 0?Number.parseInt(r,16):Number.parseInt(n,10);return i===0||i>1114111||i>=55296&&i<=57343?"\uFFFD":i===38?"&amp;":String.fromCodePoint(i)}):t}function ei(t){try{t=encodeURI(t).replace(V.percentDecode,"%")}catch{return null}return t}function ti(t,e){let n=t.replace(V.findPipe,(a,s,l)=>{let c=!1,h=s;for(;--h>=0&&l[h]==="\\";)c=!c;return c?"|":" |"}),r=n.split(V.splitPipe),i=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;i<r.length;i++)r[i]=r[i].trim().replace(V.slashPipe,"|");return r}function me(t,e,n){let r=t.length;if(r===0)return"";let i=0;for(;i<r;){let a=t.charAt(r-i-1);if(a===e&&!n)i++;else if(a!==e&&n)i++;else break}return t.slice(0,r-i)}function ni(t){let e=t.split(`
`),n=e.length-1;for(;n>=0&&V.blankLine.test(e[n]);)n--;return e.length-n<=2?t:e.slice(0,n+1).join(`
`)}function $t(t){return t.trim().replace(V.multipleSpaceGlobal," ").toLowerCase().toUpperCase().toLowerCase()}function ri(t,e){if(t.indexOf(e[0])===-1&&t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}var We=new WeakMap;function Fn(t){let e={"*":-1,_:-1},n=-1,r=t.length;for(let i=0;i<r;i++){let a=t[i];if(a!=="*"&&a!=="_"&&a!=="~")continue;let s=i===0?`
`:t[i-1],l=i+1;for(;l<r&&t[l]===a;)l++;s!==" "&&s!=="	"&&s!==`
`&&s!=="\r"&&s!=="\f"&&(a==="~"?n=i:e[a]=i),i=l-1}return{maskedSrc:t,lastPossibleEmStrongCloserIndex:e,lastPossibleDelCloserIndex:n}}function Ss(t,e){let n=Fn(e),r=We.get(t);r?r.push(n):We.set(t,[n])}function _s(t){let e=We.get(t);e&&(e.pop(),e.length===0&&We.delete(t))}function gi(t,e,n){let r=We.get(t)?.at(-1);return r&&r.maskedSrc===e?r.lastPossibleEmStrongCloserIndex[n]:Fn(e).lastPossibleEmStrongCloserIndex[n]}function vi(t,e){let n=We.get(t)?.at(-1);return n&&n.maskedSrc===e?n.lastPossibleDelCloserIndex:Fn(e).lastPossibleDelCloserIndex}function Nt(t,e=0){let n=e,r="";for(let i of t)if(i==="	"){let a=4-n%4;r+=" ".repeat(a),n+=a}else r+=i,n++;return r}function Ls(t,e){let n="";for(let r=0;r<t.length;r++){if(t[r]==="`"){let i=e.inline.code.exec(t.slice(r));if(i){n+=i[0],r+=i[0].length-1;continue}}if(t[r]==="\\"&&(t[r+1]==="["||t[r+1]==="]")){n+=t[r+1],r++;continue}n+=t[r]}return n}function ii(t,e,n,r,i){let a=e.href,s=e.title||null,l=Ls(t[1],i),c=t[0].charAt(0)==="!",h=r.state.inLink,p=r.state.linkEmitted,b=r.state.inRawBlock;r.state.inLink=!0,r.state.linkEmitted=!1;let m=r.inlineTokens(l),w=r.state.linkEmitted;if(r.state.linkEmitted=p,r.state.inLink=h,!c){if(w){r.state.inRawBlock=b;return}r.state.linkEmitted=!0}return{type:c?"image":"link",raw:n,href:a,title:s,text:l,tokens:m}}function Rs(t,e,n){let r=t.match(n.other.indentCodeCompensation);if(r===null)return e;let i=r[1];return e.split(`
`).map(a=>{let s=a.match(n.other.beginningSpace);if(s===null)return a;let[l]=s;return a.slice(Math.min(l.length,i.length))}).join(`
`)}function oi(t,e,n,r){if(!e.includes("<"))return!1;for(let i=0;i<e.length;i++){if(e[i]==="\\"){i++;continue}if(e[i]==="`"){let l=r.inline.code.exec(e.slice(i));if(l){i+=l[0].length-1;continue}}if(e[i]!=="<")continue;let a=t.slice(n+i),s=r.inline.tag.exec(a)||r.inline.autolink.exec(a);if(s){if(s[0].length>e.length-i)return!0;i+=s[0].length-1}}return!1}var Oe=class{options;rules;lexer;constructor(t){this.options=t||Me}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=this.options.pedantic?e[0]:ni(e[0]),r=n.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n,codeBlockStyle:"indented",text:r}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],r=Rs(n,e[3]||"",this.rules);return e[3]!==void 0&&(r===""||r.endsWith(`
`))&&(r+=`
`),{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let r=me(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceTabChar.test(r))&&(n=r.trim())}return{type:"heading",raw:me(e[0],`
`),depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:me(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=me(e[0],`
`).split(`
`),r="",i="",a=[];for(;n.length>0;){let s=!1,l=[],c;for(c=0;c<n.length;c++)if(this.rules.other.blockquoteStart.test(n[c]))l.push(n[c]),s=!0;else if(!s)l.push(n[c]);else break;n=n.slice(c);let h=l.join(`
`),p=h.replace(this.rules.other.blockquoteMarkerWhitespace,(w,A,E)=>E.startsWith(" ")?A+" "+E.slice(1):A+Nt(E,A.length)).replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${h}`:h,i=i?`${i}
${p}`:p;let b=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(p,a,!0),this.lexer.state.top=b,n.length===0)break;let m=a.at(-1);if(m?.type==="code"||m?.type==="heading"||m?.type==="hr"||m?.type==="html"||m?.type==="table")break;if(m?.type==="blockquote"){let w=m,A=n.join(`
`),E=w.raw+`
`+A.replace(this.rules.other.blockquoteSetextReplace2,""),T=this.blockquote(E);a[a.length-1]=T;let S=E.substring(T.raw.length).replace(/^\n/,""),W=S?S.split(`
`).length:0,R=W?n.slice(0,-W):n;if(R.length>0&&(r=`${r}
${R.join(`
`)}`),i=i.substring(0,i.length-w.text.length)+T.text,n=n.slice(R.length),n.length>0&&this.rules.other.blockquoteStart.test(n[0]))continue;break}else if(m?.type==="list"){let w=m,A=w.raw+`
`+n.join(`
`),E=this.list(A);a[a.length-1]=E;let T=E.raw.length>w.raw.length?A.slice(w.raw.length+1,E.raw.length).split(`
`).length:0;if(T>0){let S=n.slice(0,T).join(`
`);r=`${r}
${S}`,i=`${i}
${S}`}if(n=n.slice(T),n.length>0&&!this.rules.other.blockquoteStart.test(n[0]))break;continue}}return{type:"blockquote",raw:r,tokens:a,text:i}}}list(t){let e=this.rules.block.list.exec(t);if(e){if(!this.options.pedantic&&this.lexer.state.lastToken?.type==="text"&&!this.rules.other.listInterruptsParagraph.test(t))return;let n=t,r=()=>n.length-t.length,i=e[1].trim(),a=i.length>1,s={type:"list",raw:"",ordered:a,start:a?+i.slice(0,-1):"",loose:!1,items:[]};i=a?`\\d{1,9}\\${i.slice(-1)}`:`\\${i}`,this.options.pedantic&&(i=a?i:"[*+-]");let l=this.rules.other.listItemRegex(i),c=!1;for(;t;){let b=!1,m="";if(!(e=l.exec(t))||this.rules.block.hr.test(t))break;let w=r();t=t.substring(e[0].length);let A=e[2].split(`
`,1)[0],E=e[1].length,T=this.options.pedantic?Nt(A,E):A.replace(this.rules.other.leadingSpaceTab,Q=>Nt(Q,E)),S=t.split(`
`,1)[0],W=!T.trim(),R=0;if(this.options.pedantic?(R=2,m=T.trimStart()):W?R=E+1:(R=T.search(this.rules.other.nonSpaceChar),R=R>4?1:R,m=T.slice(R),R+=E),W&&this.rules.other.blankLine.test(S)&&(t=t.substring(S.length+1),b=!0),!b){let Q=this.rules.other.nextBulletRegex(R),J=this.rules.other.hrRegex(R),Ee=this.rules.other.fencesBeginRegex(R),$=this.options.pedantic?this.rules.other.pedanticHeadingBeginRegex(R):this.rules.other.headingBeginRegex(R),Y=this.rules.other.htmlBeginRegex(R),Ae=this.rules.other.blockquoteBeginRegex(R),Te=!1;for(;t;){let gt=t.split(`
`,1)[0],G;if(S=gt,this.options.pedantic?(S=S.replace(this.rules.other.listReplaceNesting,"  "),G=S):G=S.replace(this.rules.other.leadingSpaceTab,j=>Nt(j)),Ee.test(S)||$.test(S)||Y.test(S)||Ae.test(S)||Q.test(S)||J.test(S))break;if(G.search(this.rules.other.nonSpaceChar)>=R||!S.trim())m+=`
`+G.slice(R),Te=!1;else{if(W)break;let j=T;if(!this.options.pedantic&&!m.includes(`
`)&&!T.includes("	")){let ue;for(;!J.test(j)&&(ue=this.rules.other.nestedBlockMarker.exec(j));)j=j.slice(ue[0].length);if(!j.trim())break}if(j.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||Ee.test(j)||$.test(j)||Y.test(j)||J.test(j))break;if(!this.options.pedantic&&!Te){let ue=T.replace(this.rules.other.nestedContainerMarkers,"");if(this.rules.block.fences.test(ue)||this.rules.block.heading.test(ue)||this.rules.block.hr.test(ue))break}let qe=!this.options.pedantic&&/^ {0,3}(?:=+|-+) *$/.test(S)&&this.rules.block.lheading.test(`${T}
${S}`)?`    ${G.replace(/^ {0,3}/,"")}`:S;m+=`
`+qe,Te=!0}W=!S.trim(),t=t.substring(gt.length+1),T=G.slice(R)}}let de=n.slice(w,r());s.loose||(c?s.loose=!0:this.rules.other.doubleBlankLine.test(de)&&(c=!0)),s.items.push({type:"list_item",raw:de,task:!!this.options.gfm&&this.rules.other.listIsTask.test(m),loose:!1,text:m,tokens:[]})}let h=s.items.at(-1);if(h)h.raw=h.raw.trimEnd(),h.text=h.text.trimEnd();else return;s.raw=n.slice(0,r()).trimEnd();let p=[];for(let b of s.items)if(this.lexer.state.top=!1,p.push(this.lexer.inlineQueue.length),b.tokens=this.lexer.blockTokens(b.text,[]),!s.loose){let m=b.tokens.filter(A=>A.type==="space"),w=m.length>0&&m.some(A=>this.rules.other.anyLine.test(A.raw));s.loose=w}for(let b=0;b<s.items.length;b++){let m=s.items[b],w=m.tokens[0];if(m.task&&(w?.type==="text"||w?.type==="paragraph")){m.text=m.text.replace(this.rules.other.listReplaceTask,""),w.raw=w.raw.replace(this.rules.other.listReplaceTask,""),w.text=w.text.replace(this.rules.other.listReplaceTask,"");let A=this.lexer.inlineQueue;for(let T=p[b];T<A.length;T++)if(A[T].tokens===w.tokens){A[T].src=A[T].src.replace(this.rules.other.listReplaceTask,"");break}let E=this.rules.other.listTaskCheckbox.exec(m.raw);if(E){let T={type:"checkbox",raw:E[0]+" ",checked:E[0]!=="[ ]"};m.checked=T.checked,s.loose?m.tokens[0]&&["paragraph","text"].includes(m.tokens[0].type)&&"tokens"in m.tokens[0]&&m.tokens[0].tokens?(m.tokens[0].raw=T.raw+m.tokens[0].raw,m.tokens[0].text=T.raw+m.tokens[0].text,m.tokens[0].tokens.unshift(T)):m.tokens.unshift({type:"paragraph",raw:T.raw,text:T.raw,tokens:[T]}):m.tokens.unshift(T)}}else m.task&&(m.task=!1)}if(s.loose)for(let b of s.items){b.loose=!0;for(let m of b.tokens)m.type==="text"&&(m.type="paragraph")}return s}}html(t){let e=this.rules.block.html.exec(t);if(e){if(this.lexer.state.lastToken?.type==="paragraph"&&!this.rules.other.htmlBeginRegex(4).test(t))return;let n=ni(e[0]);return{type:"html",block:!0,raw:n,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:n}}}def(t){let e=this.rules.block.def.exec(t);if(e){if(!this.rules.other.startAngleBracket.test(e[2])&&ri(e[2],"()")!==-1)return;let n=$t(e[1]),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:me(e[0],`
`),href:r,title:i}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=ti(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:me(e[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let s of r)this.rules.other.tableAlignRight.test(s)?a.align.push("right"):this.rules.other.tableAlignCenter.test(s)?a.align.push("center"):this.rules.other.tableAlignLeft.test(s)?a.align.push("left"):a.align.push(null);for(let s=0;s<n.length;s++)a.header.push({text:n[s],tokens:this.lexer.inline(n[s]),header:!0,align:a.align[s]});for(let s of i)a.rows.push(ti(s,a.header.length).map((l,c)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:a.align[c]})));return a}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let n=e[1].trim();return{type:"heading",raw:me(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){if(t.charCodeAt(0)!==92)return;let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){if(this.lexer.state.linkParenPossible===!1)return;let e=t.charCodeAt(0);if(e!==91&&e!==33)return;let n=this.rules.inline.link.exec(t);if(n){let r=n[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&oi(t,n[1],r,this.rules))return;let i=n[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(i)){if(!this.rules.other.endAngleBracket.test(i))return;let c=me(i.slice(0,-1),"\\");if((i.length-c.length)%2===0)return}else{let c=ri(n[2],"()");if(c===-2)return;if(c>-1){let h=(n[0].indexOf("!")===0?5:4)+n[1].length+c;n[2]=n[2].substring(0,c),n[0]=n[0].substring(0,h).trim(),n[3]=""}}let a=me(n[0].slice(0,-1),"\\");if((n[0].length-a.length)%2===0)return;let s=n[2],l="";if(this.options.pedantic){let c=this.rules.other.pedanticHrefTitle.exec(s);c&&(s=c[1],l=c[3])}else l=n[3]?n[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(i)?s=s.slice(1):s=s.slice(1,-1)),ii(n,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:l&&l.replace(this.rules.inline.anyPunctuation,"$1")},n[0],this.lexer,this.rules)}}reflink(t,e){let n=t.charCodeAt(0);if(n!==91&&n!==33)return;let r;if((r=this.rules.inline.reflink.exec(t))||(r=this.rules.inline.nolink.exec(t))){let i=r[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&oi(t,r[1],i,this.rules))return;let a=e[$t(r[2]||r[1])];if(!a){let s=r[0].charAt(0);return{type:"text",raw:s,text:s}}return ii(r,a,r[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!r||!r[1]&&!r[2]&&!r[3]&&!r[4])return;let i=r[0][0],a=n===i,s=e.length-t.length,l=s;for(;!this.options.pedantic&&l>0&&e[l-1]===i;)l--;let c=[...e.slice(Math.max(0,l-2),l)].at(-1)??"",h=c==="*"||c==="_"||!!this.rules.inline.punctuation.exec(c);l<s&&(n=c);let p=l<s?h:n==="*"||n==="_"||!!this.rules.inline.punctuation.exec(n);if(r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))return;let b=r[1]||r[3]||"";if(!b||!n||p){let m=[...r[0]].length-1,w,A,E=m,T=0,S=s-l+m,W=!this.options.pedantic&&!!c.trim()&&(!!b||i==="*"&&!h);if(i!=="*"&&i!=="_")return;let R=i==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd,de=gi(this,e,i),Q=e.length-t.length+m;if(de<Q)return;e=e.slice(-1*t.length+m);let J=de-Q;for(R.lastIndex=0;(r=R.exec(e))!==null&&!(r.index>J);){if(w=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!w)continue;if(A=[...w].length,r[3]||r[4]){E+=A;continue}else if((r[5]||r[6]||W)&&S%3&&!((S+A)%3)){if(a&&(r[5]||r[6]))break;T+=A;continue}if(E-=A,E>0)continue;A=Math.min(A,A+E+T);let Ee=[...r[0]][0].length,$=t.slice(0,m+r.index+Ee+A);if(Math.min(m,A)%2){let Ae=$.slice(1,-1);return{type:"em",raw:$,text:Ae,tokens:this.lexer.inlineTokens(Ae)}}let Y=$.slice(2,-2);return{type:"strong",raw:$,text:Y,tokens:this.lexer.inlineTokens(Y)}}}}codespan(t){if(t.charCodeAt(0)!==96)return;let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=t.charCodeAt(0);if(e!==32&&e!==92&&e!==10)return;let n=this.rules.inline.br.exec(t);if(n)return{type:"br",raw:n[0]}}del(t,e,n=""){if(t.charCodeAt(0)!==126)return;let r=this.rules.inline.delLDelim.exec(t);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,a,s,l=i,c=this.rules.inline.delRDelim,h=vi(this,e),p=e.length-t.length+i;if(h<p)return;e=e.slice(-1*t.length+i);let b=h-p;for(c.lastIndex=0;(r=c.exec(e))!==null&&!(r.index>b);){if(a=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!a||(s=[...a].length,s!==i))continue;if(r[3]||r[4]){l+=s;continue}if(l-=s,l>0)continue;s=Math.min(s,s+l);let m=[...r[0]][0].length,w=t.slice(0,i+r.index+m+s),A=w.slice(i,-i);return{type:"del",raw:w,text:A,tokens:this.lexer.inlineTokens(A)}}}}autolink(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let i;do i=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(i!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:n?e[0]:Ts(e[0]),escaped:n}}}},ee=class Rn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Me,this.options.tokenizer=this.options.tokenizer||new Oe,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0};let n={other:V,block:Mt.normal,inline:nt.normal};this.options.pedantic?(n.block=Mt.pedantic,n.inline=nt.pedantic):this.options.gfm&&(n.block=Mt.gfm,this.options.breaks?n.inline=nt.breaks:n.inline=nt.gfm),this.tokenizer.rules=n}static get rules(){return{block:Mt,inline:nt}}static lex(e,n){return new Rn(n).lex(e)}static lexInline(e,n){return new Rn(n).inlineTokens(e)}lex(e){e=e.replace(V.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.state.inRawBlock=!1,this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){this.tokenizer.lexer=this;let i=this.state.lastToken;this.options.pedantic&&(e=e.replace(V.tabCharGlobal,"    ").replace(V.spaceLine,""));let a=1/0,s,l=this.options.gfm&&!this.options.pedantic&&this.tokenizer.paragraph===Oe.prototype.paragraph;for(;e;){if(e.length<a)a=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}this.state.lastToken=n.at(-1);let c;if(this.options.extensions?.block?.some(p=>(c=p.call({lexer:this},e,n))?(e=e.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.space(e)){e=e.substring(c.raw.length);let p=n.at(-1);c.raw.length===1&&p!==void 0?p.raw+=`
`:n.push(c);continue}if(c=this.tokenizer.code(e)){e=e.substring(c.raw.length);let p=n.at(-1);p?.type==="paragraph"||p?.type==="text"?(p.raw+=(p.raw.endsWith(`
`)?"":`
`)+c.raw,p.text+=`
`+c.text,this.inlineQueue.at(-1).src=p.text):n.push(c);continue}if(c=this.tokenizer.fences(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.heading(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.hr(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.blockquote(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.list(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.html(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.def(e)){e=e.substring(c.raw.length);let p=n.at(-1);p?.type==="paragraph"||p?.type==="text"?(p.raw+=(p.raw.endsWith(`
`)?"":`
`)+c.raw,p.text+=`
`+c.raw,this.inlineQueue.at(-1).src=p.text):(this.tokens.links[c.tag]||(this.tokens.links[c.tag]={href:c.href,title:c.title}),n.push(c));continue}if(c=this.tokenizer.table(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.lheading(e)){e=e.substring(c.raw.length),n.push(c);continue}let h=e;if(this.options.extensions?.startBlock){let p=1/0,b=e.slice(1),m;this.options.extensions.startBlock.forEach(w=>{m=w.call({lexer:this},b),typeof m=="number"&&m>=0&&(p=Math.min(p,m))}),p<1/0&&p>=0&&(h=e.substring(0,p+1))}if(this.state.top&&(c=this.tokenizer.paragraph(h))){let p=n.at(-1);(r||p===s&&l)&&p?.type==="paragraph"?(p.raw+=(p.raw.endsWith(`
`)?"":`
`)+c.raw,p.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=p.text,s=p):(n.push(c),s=c),r=h.length!==e.length,e=e.substring(c.raw.length);continue}if(c=this.tokenizer.text(e)){e=e.substring(c.raw.length);let p=n.at(-1);p?.type==="text"?(p.raw+=(p.raw.endsWith(`
`)?"":`
`)+c.raw,p.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=p.text):n.push(c);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,this.state.lastToken=i,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}linkInText(e){if(!e.includes("["))return!1;let n=this.tokenizer.rules.inline.link;for(let r of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(n.test(r[0])&&e.charAt(r.index-1)!=="!")return!0;for(let r of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let i=r[0],a=i.lastIndexOf("[");if(!(i.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,$t(i.slice(a+1,-1))))&&!(a>1&&this.linkInText(i.slice(1,a-1))))return!0}return!1}inlineTokens(e,n=[]){this.tokenizer.lexer=this;let r=this.state.linkParenPossible;this.state.linkParenPossible=e.includes(")");try{return this.#s(e,n)}finally{this.state.linkParenPossible=r}}#s(e,n){let r=e.includes("*")||e.includes("_")||e.includes("~"),i=r||this.options.hooks?.emStrongMask||this.tokenizer.emStrong!==Oe.prototype.emStrong||this.tokenizer.del!==Oe.prototype.del?this.#n(e):e;if(!r)return this.#r(e,i,n);Ss(this.tokenizer,i);try{return this.#r(e,i,n)}finally{_s(this.tokenizer)}}#r(e,n,r){let i=!1,a="",s=1/0;for(;e;){if(e.length<s)s=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}i||(a=""),i=!1;let l;if(this.options.extensions?.inline?.some(p=>(l=p.call({lexer:this},e,r))?(e=e.substring(l.raw.length),r.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let p=r.at(-1);l.type==="text"&&p?.type==="text"?(p.raw+=l.raw,p.text+=l.text):r.push(l);continue}let c=e[0];if(c==="*"||c==="_"){let p=n.length-e.length;if(gi(this.tokenizer,n,c)<=p){let b=1;for(;b<e.length&&e.charCodeAt(b)===c.charCodeAt(0);)b++;let m=e.substring(0,b),w=r.at(-1);w?.type==="text"&&!w.escaped?(w.raw+=m,w.text+=m):r.push({type:"text",raw:m,text:m,escaped:!1}),e=e.substring(b),a=c,i=!0;continue}}else if(c==="~"){let p=n.length-e.length;if(vi(this.tokenizer,n)<=p){let b=1;for(;b<e.length&&e.charCodeAt(b)===126;)b++;let m=e.substring(0,b),w=r.at(-1);w?.type==="text"&&!w.escaped?(w.raw+=m,w.text+=m):r.push({type:"text",raw:m,text:m,escaped:!1}),e=e.substring(b),a=c,i=!0;continue}}if(l=this.tokenizer.emStrong(e,n,a)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.del(e,n,a)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),r.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),r.push(l);continue}let h=e;if(this.options.extensions?.startInline){let p=1/0,b=e.slice(1),m;this.options.extensions.startInline.forEach(w=>{m=w.call({lexer:this},b),typeof m=="number"&&m>=0&&(p=Math.min(p,m))}),p<1/0&&p>=0&&(h=e.substring(0,p+1))}if(l=this.tokenizer.inlineText(h)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(a=l.raw.slice(-1)),i=!0;let p=r.at(-1);p?.type==="text"?(p.raw+=l.raw,p.text+=l.text):r.push(l);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return r}#i(e){let{blockSkip:n,tag:r,autolink:i}=this.tokenizer.rules.inline,a="",s=0,l;for(n.lastIndex=0;l=n.exec(e);){let c=l.index+(l[2]?l[2].length:0),h=l.index+l[0].length;if(e.charAt(c)==="<"){let p=e.slice(c),b=r.exec(p)||i.exec(p);if(!b){n.lastIndex=c+1;continue}h=c+b[0].length,n.lastIndex=h}a+=e.slice(s,c)+"["+"a".repeat(h-c-2)+"]",s=h}return a+e.slice(s)}#n(e){let n=e;if(this.tokens.links&&e.includes("[")){let r=this.tokenizer.rules.inline.reflinkSearch,i=a=>{let s=a.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,$t(a.slice(s+1,-1))))return a;if(s>1&&a.charAt(0)!=="!"){let l=a.slice(1,s-1);if(this.linkInText(l))return"["+l.replace(r,i)+"]["+"a".repeat(a.length-s-2)+"]"}return"["+"a".repeat(a.length-2)+"]"};n=n.replace(r,i)}return n=n.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode,(r,i,a)=>a?"+".repeat(r.length):i?i+r.slice(i.length,-i.length).replace(/`/g,"+")+i:r),n=this.#i(n),n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n,n}infiniteLoopError(e){let n="Infinite loop on byte: "+e;if(this.options.silent)console.error(n);else throw new Error(n)}},Ft=class{options;parser;constructor(t){this.options=t||Me}space(t){return""}code({text:t,lang:e,escaped:n}){let r=(e||"").match(V.notSpaceStart)?.[0],i=t?t.replace(V.endingNewline,"")+`
`:"";return r?'<pre><code class="language-'+K(r)+'">'+(n?i:K(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:K(i,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,n=t.start,r="";for(let s=0;s<t.items.length;s++){let l=t.items[s];r+=this.listitem(l)}let i=e?"ol":"ul",a=e&&n!==1?' start="'+n+'"':"";return"<"+i+a+`>
`+r+"</"+i+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let i=0;i<t.header.length;i++)n+=this.tablecell(t.header[i]);e+=this.tablerow({text:n});let r="";for(let i=0;i<t.rows.length;i++){let a=t.rows[i];n="";for(let s=0;s<a.length;s++)n+=this.tablecell(a[s]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${K(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,text:n,tokens:r,autolink:i}){let a=i?K(n,!0):this.parser.parseInline(r),s=ei(t);if(s===null)return a;t=K(s,i);let l='<a href="'+t+'"';return e&&(l+=' title="'+K(e)+'"'),l+=">"+a+"</a>",l}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=ei(t);if(i===null)return K(n);t=i;let a=`<img src="${K(t)}" alt="${K(n)}"`;return e&&(a+=` title="${K(e)}"`),a+=">",a}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:K(t.text)}},Un=class{parser;strong({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}em({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}codespan({text:t}){return t}del({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}html({text:t}){return t}text({text:t}){return t}link({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}image({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}br(){return`
`}checkbox({raw:t}){return t}},te=class Cn{options;renderer;textRenderer;constructor(e){this.options=e||Me,this.options.renderer=this.options.renderer||new Ft,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Un,this.textRenderer.parser=this}static parse(e,n){return new Cn(n).parse(e)}static parseInline(e,n){return new Cn(n).parseInline(e)}parse(e){this.renderer.parser=this;let n="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let s=i,l=this.options.extensions.renderers[s.type].call({parser:this},s);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(s.type)){n+=l===!1?"":l??"";continue}}let a=i;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let s='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return n}parseInline(e,n=this.renderer){this.renderer.parser=this;let r="";for(let i=0;i<e.length;i++){let a=e[i];if(this.options.extensions?.renderers?.[a.type]){let l=this.options.extensions.renderers[a.type].call({parser:this},a);if(l!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(a.type)){r+=l===!1?"":l??"";continue}}let s=a;switch(s.type){case"escape":{r+=n.text(s);break}case"html":{r+=n.html(s);break}case"link":{r+=n.link(s);break}case"image":{r+=n.image(s);break}case"checkbox":{r+=n.checkbox(s);break}case"strong":{r+=n.strong(s);break}case"em":{r+=n.em(s);break}case"codespan":{r+=n.codespan(s);break}case"br":{r+=n.br(s);break}case"del":{r+=n.del(s);break}case"text":{r+=n.text(s);break}default:{let l='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return r}},rt=class{options;block;constructor(t){this.options=t||Me}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?ee.lex:ee.lexInline}provideParser(t=this.block){return t?te.parse:te.parseInline}};function ke(t,e){if(Array.isArray(e))for(let n=0;n<e.length;n++)t.push(e[n]);else t.push(e)}var Cs=class{defaults=Dn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=te;Renderer=Ft;TextRenderer=Un;Lexer=ee;Tokenizer=Oe;Hooks=rt;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(let r of t)switch(ke(n,e.call(this,r)),r.type){case"table":{let i=r;for(let a of i.header)ke(n,this.walkTokens(a.tokens,e));for(let a of i.rows)for(let s of a)ke(n,this.walkTokens(s.tokens,e));break}case"list":{let i=r;ke(n,this.walkTokens(i.items,e));break}default:{let i=r;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(a=>{let s=i[a].flat(1/0);ke(n,this.walkTokens(s,e))}):i.tokens&&ke(n,this.walkTokens(i.tokens,e))}}return n}use(...t){let e=this.defaults.extensions||{renderers:Object.create(null),childTokens:Object.create(null)};return t.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let a=e.renderers[i.name];a?e.renderers[i.name]=function(...s){let l=i.renderer.apply(this,s);return l===!1&&(l=a.apply(this,s)),l}:e.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=e[i.level];a?a.unshift(i.tokenizer):e[i.level]=[i.tokenizer],i.start&&(i.level==="block"?e.startBlock?e.startBlock.push(i.start):e.startBlock=[i.start]:i.level==="inline"&&(e.startInline?e.startInline.push(i.start):e.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(e.childTokens[i.name]=i.childTokens)}),r.extensions=e),n.renderer){let i=this.defaults.renderer||new Ft(this.defaults);for(let a in n.renderer){if(!(a in i))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let s=a,l=n.renderer[s],c=i[s];i[s]=(...h)=>{let p=l.apply(i,h);return p===!1&&(p=c.apply(i,h)),p===!1?"":p??""}}r.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new Oe(this.defaults);for(let a in n.tokenizer){if(!(a in i))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let s=a,l=n.tokenizer[s],c=i[s];i[s]=(...h)=>{let p=l.apply(i,h);return p===!1&&(p=c.apply(i,h)),p}}r.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new rt;for(let a in n.hooks){if(!(a in i))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let s=a,l=n.hooks[s],c=i[s];rt.passThroughHooks.has(a)?i[s]=h=>{if(i.options.async&&rt.passThroughHooksRespectAsync.has(a))return(async()=>{let b=await l.call(i,h);return c.call(i,b)})();let p=l.call(i,h);return c.call(i,p)}:i[s]=(...h)=>{if(i.options.async)return(async()=>{let b=await l.apply(i,h);return b===!1&&(b=await c.apply(i,h)),b})();let p=l.apply(i,h);return p===!1&&(p=c.apply(i,h)),p}}r.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,a=n.walkTokens;r.walkTokens=function(s){let l=[];return ke(l,a.call(this,s)),i&&ke(l,i.call(this,s)),l}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return ee.lex(t,e??this.defaults)}parser(t,e){return te.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let r={...n},i={...this.defaults,...r},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=t),i.async)return(async()=>{let s=i.hooks?await i.hooks.preprocess(e):e,l=await(i.hooks?await i.hooks.provideLexer(t):t?ee.lex:ee.lexInline)(s,i),c=i.hooks?await i.hooks.processAllTokens(l):l;i.walkTokens&&await Promise.all(this.walkTokens(c,i.walkTokens));let h=await(i.hooks?await i.hooks.provideParser(t):t?te.parse:te.parseInline)(c,i);return i.hooks?await i.hooks.postprocess(h):h})().catch(a);try{i.hooks&&(e=i.hooks.preprocess(e));let s=(i.hooks?i.hooks.provideLexer(t):t?ee.lex:ee.lexInline)(e,i);i.hooks&&(s=i.hooks.processAllTokens(s)),i.walkTokens&&this.walkTokens(s,i.walkTokens);let l=(i.hooks?i.hooks.provideParser(t):t?te.parse:te.parseInline)(s,i);return i.hooks&&(l=i.hooks.postprocess(l)),l}catch(s){return a(s)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let r="<p>An error occurred:</p><pre>"+K(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},Ie=new Cs;function C(t,e){return Ie.parse(t,e)}C.options=C.setOptions=function(t){return Ie.setOptions(t),C.defaults=Ie.defaults,ai(C.defaults),C};C.getDefaults=Dn;C.defaults=Me;function Ds(...t){return Ie.use(...t),C.defaults=Ie.defaults,ai(C.defaults),C}C.use=Ds;C.walkTokens=function(t,e){return Ie.walkTokens(t,e)};C.parseInline=Ie.parseInline;C.Parser=te;C.parser=te.parse;C.Renderer=Ft;C.TextRenderer=Un;C.Lexer=ee;C.lexer=ee.lex;C.Tokenizer=Oe;C.Hooks=rt;C.parse=C;var sc=C.options,lc=C.setOptions,cc=C.walkTokens,dc=C.parseInline;var uc=te.parse,pc=ee.lex;var Hn=["image","when","location","attendance","description","price","tags","organizer","eligibility","cfp"],bi=["image","when","location","attendance","description"],ki=["google-calendar","outlook-calendar","yahoo-calendar","ics","link"],Ps=["series","multipart"];function xi(t){return Hn.includes(t)}function Os(t){return Ps.includes(t)}function Ei(t){if(!t)return 1/0;let e=Number.parseInt(t,10);return Number.isFinite(e)&&e>0?e:1/0}function Ai(t){return t==="en"||t==="es"?t:"auto"}function Ti(t,e){return t!=="auto"?t:e.toLowerCase().startsWith("es")?"es":"en"}function Si(t){return t?.trim()||void 0}function _i(t){return t!=="false"}function Li(t){return t==="cards"?"cards":t==="list"?"list":"calendar"}function Ht(t){return t==="link"||t==="none"?t:"modal"}function Ri(t){return t==="none"?"none":"auto"}function Is(t){return t==="google-calendar"||t==="outlook-calendar"||t==="yahoo-calendar"||t==="ics"||t==="link"}function Ci(t){if(t==="none")return[];if(!t)return[...ki];let e=t.split(",").map(n=>n.trim()).filter(Is);return e.length>0?[...new Set(e)]:[...ki]}function Di(t){if(!t)return new Set(bi);let e=t.split(",").map(n=>n.trim()).filter(xi);return e.length>0?new Set(e):new Set(bi)}function Pi(t){if(!t)return new Set(Hn);let e=t.split(",").map(n=>n.trim()).filter(xi);return e.length>0?new Set(e):new Set(Hn)}function Oi(t){return t?new Set(t.split(",").map(e=>e.trim()).filter(Os)):new Set}function Ii(t){return t?t.split(",").map(e=>e.trim()).filter(e=>e.length>0):[]}var Ut={small:"160px",medium:"220px",large:"320px"};function Mi(t){let e=t?.trim();return e?e in Ut?Ut[e]:/^\d+(\.\d+)?$/.test(e)?`${e}px`:/^\d+(\.\d+)?(px|rem|em|ch|vw|%)$/.test(e)?e:Ut.medium:Ut.medium}var wi=3;function Ms(t){let e=t?.trim().toLowerCase();if(!e)return wi;if(e==="off"||e==="none"||e==="false")return"off";let n=Number.parseInt(e,10);return Number.isFinite(n)&&n>0?n:wi}function Ns(t){let e=t?.trim();if(!e)return{kind:"next-event"};let n=e.toLowerCase();return n==="today"||n==="now"?{kind:"today"}:n==="next-event"?{kind:"next-event"}:/^\d{4}-\d{2}$/.test(e)&&yi(`${e}-01`)?{kind:"date",date:`${e}-01`}:/^\d{4}-\d{2}-\d{2}$/.test(e)&&yi(e)?{kind:"date",date:e}:{kind:"next-event"}}function yi(t){let[e,n,r]=t.split("-").map(Number),i=new Date(Date.UTC(e,n-1,r));return i.getUTCFullYear()===e&&i.getUTCMonth()===n-1&&i.getUTCDate()===r}function zs(t){let e=t?.trim().toLowerCase();return!(e==="off"||e==="false"||e==="none")}function Ni(t,e){return{maxPerDay:Ms(t("max-per-day")),initialDate:e?{kind:"date",date:e}:Ns(t("initial-date")),responsive:zs(t("responsive"))}}function $s(t,e){this.v=t,this.k=e}function zi(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function Fs(t){if(Array.isArray(t))return t}function Us(t,e){var n=t==null?null:typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"];if(n!=null){var r,i,a,s,l=[],c=!0,h=!1;try{if(a=(n=n.call(t)).next,e===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(l.push(r.value),l.length!==e);c=!0);}catch(p){h=!0,i=p}finally{try{if(!c&&n.return!=null&&(s=n.return(),Object(s)!==s))return}finally{if(h)throw i}}return l}}function Hs(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Bs(t,e){return Fs(t)||Us(t,e)||Ws(t,e)||Hs()}function Ws(t,e){if(t){if(typeof t=="string")return zi(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?zi(t,e):void 0}}function Bt(t){var e,n;function r(a,s){try{var l=t[a](s),c=l.value,h=c instanceof $s;Promise.resolve(h?c.v:c).then(function(p){if(h){var b=a==="return"&&c.k?a:"next";if(!c.k||p.done)return r(b,p);p=t[b](p).value}i(!!l.done,p)},function(p){r("throw",p)})}catch(p){i(2,p)}}function i(a,s){a===2?e.reject(s):e.resolve({value:s,done:a}),(e=e.next)?r(e.key,e.arg):n=null}this._invoke=function(a,s){return new Promise(function(l,c){var h={key:a,arg:s,resolve:l,reject:c,next:null};n?n=n.next=h:(e=n=h,r(a,s))})},typeof t.return!="function"&&(this.return=void 0)}Bt.prototype[typeof Symbol=="function"&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},Bt.prototype.next=function(t){return this._invoke("next",t)},Bt.prototype.throw=function(t){return this._invoke("throw",t)},Bt.prototype.return=function(t){return this._invoke("return",t)};var eo=Object.entries,Gs=Object.keys,$i=Object.setPrototypeOf,js=Object.isFrozen,to=Object.getPrototypeOf,no=Object.getOwnPropertyDescriptor,q=Object.freeze,N=Object.seal,ye=Object.create,ro=typeof Reflect<"u"&&Reflect,Gt=ro.apply,Qn=ro.construct;q||(q=function(e){return e});N||(N=function(e){return e});Gt||(Gt=function(e,n){for(var r=arguments.length,i=new Array(r>2?r-2:0),a=2;a<r;a++)i[a-2]=arguments[a];return e.apply(n,i)});Qn||(Qn=function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return new e(...r)});var ne=P(Array.prototype.forEach),qs=P(Array.prototype.lastIndexOf),Fi=P(Array.prototype.pop),st=P(Array.prototype.push),Ui=P(Array.prototype.slice),Vs=P(Array.prototype.splice),je=Array.isArray,Bn=Jn(Set),Wn=P(Set.prototype.add),lt=P(Set.prototype.has),Zs=P(Set.prototype.delete),Ys=Jn(Map),Hi=P(Map.prototype.get),Bi=P(Map.prototype.set),ge=P(String.prototype.toLowerCase),Gn=P(String.prototype.toString),Ks=P(String.prototype.match),ct=P(String.prototype.replace),jn=P(String.prototype.indexOf),Xs=P(String.prototype.trim),Qs=P(Number.prototype.toString),Js=P(Boolean.prototype.toString),Wi=typeof BigInt>"u"?null:P(BigInt.prototype.toString),Gi=typeof Symbol>"u"?null:P(Symbol.prototype.toString),Z=P(Object.prototype.hasOwnProperty),dt=P(Object.prototype.toString),el=RegExp.prototype.test,B=function(e,n){return e instanceof RegExp&&(e.lastIndex=0),Gt(el,e,[n])},ce=Jn(TypeError);function P(t){return function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return Gt(t,e,r)}}function Jn(t){return function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return Qn(t,n)}}function L(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ge;if($i&&$i(t,null),!je(e))return t;let r=e.length;for(;r--;){let i=e[r];if(typeof i=="string"){let a=n(i);a!==i&&(js(e)||(e[r]=a),i=a)}t[i]=!0}return t}function tl(t){for(let e=0;e<t.length;e++)Z(t,e)||(t[e]=null);return t}function jt(t){let e=ye(null);for(let r of eo(t)){var n=Bs(r,2);let i=n[0],a=n[1];Z(t,i)&&(je(a)?e[i]=tl(a):a&&typeof a=="object"&&a.constructor===Object?e[i]=jt(a):e[i]=a)}return e}function ut(t){let e=ye(null),n=Gs(t),r=n.length;for(;r--;)e[n[r]]=t[n[r]];return e}function nl(t){switch(typeof t){case"string":return t;case"number":return Qs(t);case"boolean":return Js(t);case"bigint":return Wi?Wi(t):"0";case"symbol":return Gi?Gi(t):"Symbol()";case"undefined":return dt(t);case"function":case"object":{if(t===null)return dt(t);let e=t,n=X(e,"toString");if(typeof n=="function"){let r=n(e);return typeof r=="string"?r:dt(r)}return dt(t)}default:return dt(t)}}function X(t,e){for(;t!==null;){let r=no(t,e);if(r){if(r.get)return P(r.get);if(typeof r.value=="function")return P(r.value)}t=to(t)}function n(){return null}return n}function rl(t,e){for(;t!==null;){let n=no(t,e);if(n)return n.get?P(n.get):null;t=to(t)}return null}function il(t){if(!t)return!1;try{return B(t,""),!0}catch{return!1}}var ji=q(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),qn=q(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Vn=q(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),ol=q(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Zn=q(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),al=q(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),qi=q(["#text"]),Vi=q(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),Yn=q(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Zi=q(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Wt=q(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),sl=N(/{{[\w\W]*|^[\w\W]*}}/g),ll=N(/<%[\w\W]*|^[\w\W]*%>/g),cl=N(/\${[\w\W]*/g),Yi=N(/{{|}}|\${|<%|%>/),dl=N(/[^\t\n\f\r ]/),Ki=N(/\u0000/g),ul=N(/^data-[\-\w.\u00B7-\uFFFF]+$/),pl=N(/^aria-[\-\w]+$/),Xi=N(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),fl=N(/^(?:\w+script|data):/i),hl=N(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),ml=N(/^html$/i),gl=N(/^[a-z][.\w]*(-[.\w]+)+$/i),Kn=N(/<[/\w!]/g),vl=N(/<[/\w]/g),bl=N(/<[/\w]|^-?>|--!?>|<!-$/g),kl=N(/<\/no(script|embed|frames)/i),Qi=N(/\/>/i),wl=N(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i),yl=N(/^[\r\n\t ]+/),O={element:1,text:3,processingInstruction:7,comment:8,document:9,documentFragment:11},xl=q(L({},["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"])),El=q(L({},["textarea","title"])),Al=q(L({},["area","base","basefont","bgsound","br","col","embed","frame","hr","img","input","keygen","link","meta","param","source","track","wbr"])),Tl=function(){return typeof window>"u"?null:window},Sl=function(e,n){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let r=null,i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(r=n.getAttribute(i));let a="dompurify"+(r?"#"+r:"");try{return e.createPolicy(a,{createHTML(s){return s},createScriptURL(s){return s}})}catch{return console.warn("TrustedTypes policy "+a+" could not be created."),null}},Ji=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},we=function(e,n,r,i){return Z(e,n)&&je(e[n])?L(i.base?ut(i.base):{},e[n],i.transform):r},Xn=function(e,n,r){let i=Z(e,n)?e[n]:void 0;return i&&typeof i=="object"?jt(i):r};function io(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Tl(),e=g=>io(g);if(e.version="3.5.0",e.removed=[],!t||!t.document||t.document.nodeType!==O.document||!t.Element)return e.isSupported=!1,e;let n=t.document,r=n,i=r.currentScript,a=t.HTMLTemplateElement,s=t.Node,l=t.Element,c=t.NodeFilter,h=t.DOMParser,p=t.trustedTypes,b=l.prototype,m=X(b,"cloneNode"),w=X(b,"remove"),A=X(b,"removeChild"),E=X(b,"removeAttributeNode"),T=X(b,"nextSibling"),S=X(b,"childNodes"),W=X(b,"parentNode"),R=X(b,"shadowRoot"),de=X(b,"attributes"),Q=s&&s.prototype?X(s.prototype,"nodeType"):null,J=s&&s.prototype?X(s.prototype,"nodeName"):null,Ee=s&&s.prototype?X(s.prototype,"ownerDocument"):null,$=function(o){return Q?Q(o):o.nodeType},Y=function(o){return J?J(o):o.nodeName},Ae=rl(b,"namespaceURI"),Te=function(o){return Ae?Ae(o):o.namespaceURI},gt=function(o){return $(o)===O.element?de(o):null};if(typeof a=="function"){let g=n.createElement("template");g.content&&g.content.ownerDocument&&(n=g.content.ownerDocument)}let G,j="",qe,ue=!1,Ve=0,wr=function(){if(Ve>0)throw ce('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},Ze=function(o){wr(),Ve++;try{return G.createHTML(o)}finally{Ve--}},yr=function(o){return G&&an?Ze(o):o},Io=function(o){wr(),Ve++;try{return G.createScriptURL(o)}finally{Ve--}},Mo=function(){return ue||(qe=Sl(p,i),ue=!0),qe},vt=n,Jt=vt.implementation,No=vt.createNodeIterator,zo=vt.createDocumentFragment,$o=vt.getElementsByTagName,Fo=r.importNode,F=Ji();e.isSupported=typeof eo=="function"&&typeof W=="function"&&Jt&&Jt.createHTMLDocument!==void 0;let Uo=sl,Ho=ll,Bo=cl,Wo=ul,Go=pl,jo=fl,qo=hl,Vo=gl,xr=Xi,I=null,en=L({},[...ji,...qn,...Vn,...Zn,...qi]),M=null,tn=L({},[...Vi,...Yn,...Zi,...Wt]),re=null,Ye=null,Er=null,ve=Object.seal(ye(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),Ar=!0,nn=!0,Tr=!1,rn=!0,pe=!1,Se=!0,_e=!1,bt=!1,kt=null,wt=null,on=!1,ze=!1,yt=!1,an=!1,Sr=!0,_r=!1,Lr="user-content-",sn=!0,ln=!1,fe=null,Le=null,$e=!1,Re=null,Rr=L({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]),Cr=null,Dr=L({},["audio","video","img","source","image","track"]),Pr=null,Or=L({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),xt="http://www.w3.org/1998/Math/MathML",Et="http://www.w3.org/2000/svg",ie="http://www.w3.org/1999/xhtml",Fe=ie,cn=!1,Ir=null,Zo=L({},[xt,Et,ie],Gn),Yo=q(L({},["mi","mo","mn","ms","mtext"])),dn=null,Ko=q(L({},["annotation-xml"])),un=null,Xo=q(ye(null)),Qo=L({},["title","style","font","a","script"]),Ue=null,Jo=["application/xhtml+xml","text/html"],ea="text/html",U=null,Ke=null,At=null,ta=n.createElement("form"),Mr=function(o){return o instanceof RegExp||o instanceof Function},Tt=function(){let o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};(!o||typeof o!="object")&&(o={}),o=jt(o),Ue=Jo.indexOf(o.PARSER_MEDIA_TYPE)===-1?ea:o.PARSER_MEDIA_TYPE,U=Ue==="application/xhtml+xml"?Gn:ge,I=we(o,"ALLOWED_TAGS",en,{transform:U}),M=we(o,"ALLOWED_ATTR",tn,{transform:U}),Ir=we(o,"ALLOWED_NAMESPACES",Zo,{transform:Gn}),Pr=we(o,"ADD_URI_SAFE_ATTR",Or,{transform:U,base:Or}),Cr=we(o,"ADD_DATA_URI_TAGS",Dr,{transform:U,base:Dr}),Re=we(o,"FORBID_CONTENTS",Rr,{transform:U}),Ye=we(o,"FORBID_TAGS",ye(null),{transform:U}),Er=we(o,"FORBID_ATTR",ye(null),{transform:U}),$e=Z(o,"USE_PROFILES")?o.USE_PROFILES&&typeof o.USE_PROFILES=="object"?jt(o.USE_PROFILES):o.USE_PROFILES:!1,Ar=o.ALLOW_ARIA_ATTR!==!1,nn=o.ALLOW_DATA_ATTR!==!1,Tr=o.ALLOW_UNKNOWN_PROTOCOLS||!1,rn=o.ALLOW_SELF_CLOSE_IN_ATTR!==!1,pe=o.SAFE_FOR_TEMPLATES||!1,Se=o.SAFE_FOR_XML!==!1,_e=o.WHOLE_DOCUMENT||!1,ze=o.RETURN_DOM||!1,yt=o.RETURN_DOM_FRAGMENT||!1,an=o.RETURN_TRUSTED_TYPE||!1,on=o.FORCE_BODY||!1,Sr=o.SANITIZE_DOM!==!1,_r=o.SANITIZE_NAMED_PROPS||!1,sn=o.KEEP_CONTENT!==!1,ln=o.IN_PLACE||!1,xr=il(o.ALLOWED_URI_REGEXP)?o.ALLOWED_URI_REGEXP:Xi,Fe=typeof o.NAMESPACE=="string"?o.NAMESPACE:ie,dn=Xn(o,"MATHML_TEXT_INTEGRATION_POINTS",Yo),un=Xn(o,"HTML_INTEGRATION_POINTS",Ko);let d=Xn(o,"CUSTOM_ELEMENT_HANDLING",Xo);if(re=ye(null),Z(d,"tagNameCheck")&&Mr(d.tagNameCheck)&&(re.tagNameCheck=d.tagNameCheck),Z(d,"attributeNameCheck")&&Mr(d.attributeNameCheck)&&(re.attributeNameCheck=d.attributeNameCheck),Z(d,"allowCustomizedBuiltInElements")&&typeof d.allowCustomizedBuiltInElements=="boolean"&&(re.allowCustomizedBuiltInElements=d.allowCustomizedBuiltInElements),N(re),pe&&(nn=!1),yt&&(ze=!0),$e&&((Z(o,"ALLOWED_TAGS")||Z(o,"ALLOWED_ATTR"))&&typeof console<"u"&&typeof console.warn=="function"&&console.warn("DOMPurify: USE_PROFILES overrides ALLOWED_TAGS and ALLOWED_ATTR. Do not use these options together."),I=L({},qi),M=ye(null),$e.html===!0&&(L(I,ji),L(M,Vi)),$e.svg===!0&&(L(I,qn),L(M,Yn),L(M,Wt)),$e.svgFilters===!0&&(L(I,Vn),L(M,Yn),L(M,Wt)),$e.mathMl===!0&&(L(I,Zn),L(M,Zi),L(M,Wt))),ve.tagCheck=null,ve.attributeCheck=null,Z(o,"ADD_TAGS")&&(typeof o.ADD_TAGS=="function"?ve.tagCheck=o.ADD_TAGS:je(o.ADD_TAGS)&&(I===en&&(I=ut(I)),L(I,o.ADD_TAGS,U))),Z(o,"ADD_ATTR")&&(typeof o.ADD_ATTR=="function"?ve.attributeCheck=o.ADD_ATTR:je(o.ADD_ATTR)&&(M===tn&&(M=ut(M)),L(M,o.ADD_ATTR,U))),Z(o,"ADD_FORBID_CONTENTS")&&je(o.ADD_FORBID_CONTENTS)&&(Re===Rr&&(Re=ut(Re)),L(Re,o.ADD_FORBID_CONTENTS,U)),sn&&(I["#text"]=!0),_e&&L(I,["html","head","body"]),I.table&&(I.tbody=!0,delete Ye.tbody),o.TRUSTED_TYPES_POLICY){if(typeof o.TRUSTED_TYPES_POLICY.createHTML!="function")throw ce('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof o.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw ce('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');let u=G;G=o.TRUSTED_TYPES_POLICY;try{j=Ze("")}catch(f){throw G=u,f}}else o.TRUSTED_TYPES_POLICY===null?(G=void 0,j=""):(G===void 0&&(G=Mo()),G&&typeof j=="string"&&(j=Ze("")));Ke=q(o)},Nr=L({},[...qn,...Vn,...ol]),zr=L({},[...Zn,...al]),na=function(o,d,u){return d===ie?o==="svg":d===xt?o==="svg"&&(u==="annotation-xml"||dn[u]):!!Nr[o]},ra=function(o,d,u){return d===ie?o==="math":d===Et?o==="math"&&un[u]:!!zr[o]},ia=function(o,d,u){return d===Et&&!un[u]||d===xt&&!dn[u]?!1:!zr[o]&&(Qo[o]||!Nr[o])},oa=function(o){let d=Te(o),u=ge(Y(o)),f=W(o),k=Fe,y="template";return f&&$(f)===O.element&&(k=Te(f),y=ge(Y(f))),Ir[d]?d===Et?na(u,k,y):d===xt?ra(u,k,y):d===ie?ia(u,k,y):Ue==="application/xhtml+xml":!1},be=function(o){st(e.removed,{element:o}),Hr(o);try{W(o).removeChild(o)}catch{if(w(o),!W(o))throw ce("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},$r=function(o,d,u){try{E(o,d)}catch{try{o.removeAttribute(u)}catch{}}},aa=function(o){hn(o);let d=S(o);d&&ne(Ui(d),u=>{try{A(o,u)}catch{}}),$(o)===O.element&&pn(o,!1)},He=function(o,d,u){if(!u)try{u=d.getAttributeNode(o)}catch{u=null}if(st(e.removed,{attribute:u||null,from:d}),u)$r(d,u,o);else try{d.removeAttribute(o)}catch{}if(o==="is")if(ze||yt)try{be(d)}catch{}else try{d.setAttribute(o,"")}catch{}},pn=function(o,d){let u=de(o);if(u)for(let f=u.length-1;f>=0;--f){let k=u[f],y=k&&k.name;typeof y=="string"&&!(d&&M[U(y)])&&$r(o,k,y)}},fn=function(o,d){let u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,f=[o];for(;f.length>0;){let k=f.pop();if(d(k)===!1)continue;if(u&&$(k)===O.element){let x=R(k);Be(x)&&f.push(x)}let y=S(k);if(y)for(let x=y.length-1;x>=0;--x)f.push(y[x])}},hn=function(o){fn(o,d=>{$(d)===O.element&&pn(d,!0)})},mn=function(o){let d=[];return fn(o,u=>{d.push(u)},!0),d},sa=function(o,d){let u=Bn();ne(mn(o),f=>{$(f)===O.element&&Wn(u,f)}),ne(d,f=>{$(f)===O.element&&!lt(u,f)&&pn(f,!0)})},Fr=function(o,d){let u=!1;return ne(e.removed,f=>{f.element&&(u=u||f.element===o,hn(f.element))}),sa(o,d),u},gn=function(o,d){aa(o),Fr(o,d)},Ur=8,la=function(o,d){let u=fe,f=null,k=()=>(f||(f=Bn(),ne(d,y=>{Wn(f,y)})),f);for(let y=0;;y++){let x=mn(o),D=[o],he=!1;if(ne(x,ae=>{$(ae)===O.documentFragment?st(D,ae):!he&&!lt(u,ae)&&(he=lt(k(),ae))}),!he)return;if(y>=Ur)throw ce("the tree kept changing during in-place sanitization; refusing to return it");ne(D,(ae,se)=>{ca(ae,se>0,o,k())})}},ca=function(o,d,u,f){let k=St(o),y;for(;y=k.nextNode();)!lt(f,y)||lt(fe,y)||(d&&oe(F.uponSanitizeShadowNode,y,null),kn(y,u))},da=function(o){if(!fe)return;Wn(fe,o);let d=Hi(Le,o);if(d!==void 0){if(d>=Ur)throw ce("the tree kept changing during in-place sanitization; refusing to return it");Bi(Le,o,d+1)}},Hr=function(o){fe&&(Zs(fe,o),Hi(Le,o)===void 0&&Bi(Le,o,0))},Br=function(o,d){return Se?o==="patchsrc"?!0:o==="for"&&d!=="label"&&d!=="output":!1},ua=function(o){Se&&fn(o,d=>{let u=$(d);if(u===O.processingInstruction||u===O.comment&&B(vl,d.data)){try{w(d)}catch{}return!1}if(u===O.element){let f=d,k=U(Y(d));try{f.hasAttribute&&f.hasAttribute("patchsrc")&&f.removeAttribute("patchsrc"),f.hasAttribute&&f.hasAttribute("for")&&Br("for",k)&&f.removeAttribute("for")}catch{}}return!0})},Wr=function(o){let d=null,u=null;if(on)o="<remove></remove>"+o;else{let y=Ks(o,yl);u=y&&y[0]}Ue==="application/xhtml+xml"&&Fe===ie&&(o='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+o+"</body></html>");let f=G?Ze(o):o;if(Fe===ie)try{d=new h().parseFromString(f,Ue)}catch{}if(!d||!d.documentElement){d=Jt.createDocument(Fe,"template",null);try{d.documentElement.innerHTML=cn?j:f}catch{}}let k=d.body||d.documentElement;return o&&u&&k.insertBefore(n.createTextNode(u),k.childNodes[0]||null),Fe===ie?$o.call(d,_e?"html":"body")[0]:_e?d.documentElement:k},St=function(o){let d=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,u=Ee?Ee(o):o.ownerDocument;return No.call(u||o,o,(d?0:c.SHOW_ELEMENT)|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},_t=function(o){return o=ct(o,Uo," "),o=ct(o,Ho," "),o=ct(o,Bo," "),o},vn=function(o){var d;bn(o);let u=(d=o.querySelectorAll)===null||d===void 0?void 0:d.call(o,"template");u&&ne(u,f=>{Be(f.content)&&vn(f.content)})},pa="table,tbody,thead,tfoot,tr,colgroup",fa=L({},["caption","colgroup","col","thead","tbody","tfoot","tr","td","th","style","script","template"]),ha=function(o){var d;if(Ue==="application/xhtml+xml")return;let u=(d=o.querySelectorAll)===null||d===void 0?void 0:d.call(o,pa);!u||u.length===0||ne(u,f=>{ne(Ui(S(f)),k=>{let y=$(k);if(!(y===O.text?B(dl,k.data):y===O.element&&!fa[ge(Y(k))]))return;let x=f;for(;x&&ge(Y(x))!=="table";)x=x===o?null:W(x);let D=x&&x!==o?W(x):null;if(D)try{D.insertBefore(k,x)}catch{}})})},bn=function(o){ha(o),o.normalize();let d=St(o,!0),u=null,f=d.nextNode();for(;f;){let k=f.data;if(B(Ki,k)&&(k=ct(k,Ki,""),f.data=k),B(Yi,k)&&(k=_t(k),f.data=k),k&&$(f)===O.text){if(u){let y=u.data,x=y[y.length-1]+k[0];B(Yi,x)&&(u.data=_t(y+k[0]))}u=f}f=d.nextNode()}},Lt=function(o){let d=J?J(o):null;return typeof d!="string"||U(d)!=="form"?!1:typeof o.nodeName!="string"||typeof o.textContent!="string"||typeof o.removeChild!="function"||o.attributes!==de(o)||typeof o.removeAttribute!="function"||typeof o.removeAttributeNode!="function"||typeof o.getAttributeNode!="function"||typeof o.setAttribute!="function"||typeof o.namespaceURI!="string"||typeof o.insertBefore!="function"||typeof o.hasChildNodes!="function"||o.nodeType!==Q(o)||o.childNodes!==S(o)},Gr=function(o){if(!Q||typeof o!="object"||o===null)return null;try{let d=Q(o);return typeof d=="number"?d:null}catch{return null}},Be=function(o){return Gr(o)===O.documentFragment},Xe=function(o){return Gr(o)!==null};function oe(g,o,d){g.length!==0&&ne(g,u=>{u.call(e,o,d,Ke)})}let ma=function(o,d){let u=!!Al[d],f=!!xl[d];return!u&&!f&&!El[d]||Te(o)!==ie?!1:u?o.hasChildNodes():Xe(o.firstElementChild)?!0:f&&typeof o.textContent=="string"&&B(Kn,o.textContent)},ga=function(o,d,u){return!!(Se&&u===O.element&&o.hasChildNodes()&&!Xe(o.firstElementChild)&&B(Kn,o.textContent)&&B(Kn,o.innerHTML)||Se&&u===O.element&&ma(o,d)||u===O.processingInstruction||Se&&u===O.comment&&B(bl,o.data))},Rt=function(o,d){if(o instanceof RegExp)return B(o,d);if(o instanceof Function){for(var u=arguments.length,f=new Array(u>2?u-2:0),k=2;k<u;k++)f[k-2]=arguments[k];return!!o(d,...f)}return!1},va=function(o,d,u){if(!Ye[d]&&Vr(d)&&Rt(re.tagNameCheck,d))return!1;if(sn&&!Re[d]&&!Re[ge(d)]){let f=W(o),k=S(o);if(k&&f){let y=k.length;for(let x=y-1;x>=0;--x){let D=o===u?m(k[x],!0):k[x];f.insertBefore(D,T(o))}}}return be(o),!0},jr=function(o,d,u,f){return o.length===0?d:d===u||d===f?ut(d):d},Qe=function(o,d){return o===d||W(o)!==null?!1:(ln&&hn(o),Hr(o),!0)},ba=function(o,d){if(da(o),oe(F.beforeSanitizeElements,o,null),Qe(o,d))return!0;if(Lt(o))return be(o),!0;let u=U(Y(o)),f=$(o);if(I=jr(F.uponSanitizeElement,I,en,kt),oe(F.uponSanitizeElement,o,{tagName:u,allowedTags:I}),Qe(o,d))return!0;if(ga(o,u,f))return be(o),!0;if((Ye[u]||!(ve.tagCheck instanceof Function&&ve.tagCheck(u))&&!I[u])&&va(o,u,d))return!0;if(f===O.element&&!oa(o)||(u==="noscript"||u==="noembed"||u==="noframes")&&B(kl,o.innerHTML))return be(o),!0;if(pe&&f===O.text){let k=o.textContent,y=_t(k);k!==y&&(st(e.removed,{element:o.cloneNode()}),o.textContent=y)}return oe(F.afterSanitizeElements,o,null),Qe(o,d)},qr=function(o,d,u){if(Er[d]||Br(d,o)||Sr&&(d==="id"||d==="name")&&(u in n||u in ta))return!1;let f=M[d]||ve.attributeCheck instanceof Function&&ve.attributeCheck(d,o);if(nn&&B(Wo,d)||Ar&&B(Go,d))return!0;if(!f)return Vr(o)&&Rt(re.tagNameCheck,o)&&Rt(re.attributeNameCheck,d,o)||d==="is"&&re.allowCustomizedBuiltInElements&&Rt(re.tagNameCheck,u);if(Pr[d])return!0;let k=ct(u,qo,"");return B(xr,k)||(d==="src"||d==="xlink:href"||d==="href")&&o!=="script"&&jn(u,"data:")===0&&Cr[o]||Tr&&!B(jo,k)?!0:!u},ka=L({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),Vr=function(o){return!ka[ge(o)]&&B(Vo,o)},wa=function(o,d,u,f){if(G&&typeof p=="object"&&typeof p.getAttributeType=="function"&&!u)switch(p.getAttributeType(o,d)){case"TrustedHTML":return Ze(f);case"TrustedScriptURL":return Io(f)}return f},ya=function(o,d,u,f){try{return u?o.setAttributeNS(u,d,f):o.setAttribute(d,f),Lt(o)?(be(o),!1):!0}catch{return He(d,o),!1}},Zr=function(o,d){return Se&&B(wl,d)?!0:ge(o)==="attributename"&&jn(d,"href")!==-1},xa=function(o,d){if(oe(F.beforeSanitizeAttributes,o,null),Qe(o,d))return;let u=gt(o);if(!u||Lt(o))return;M=jr(F.uponSanitizeAttribute,M,tn,wt);let f={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:M,forceKeepAttr:void 0},k=u.length,y=U(Y(o));for(;k--;){let x=u[k];if(!x)continue;let D=x.name,he=x.namespaceURI,ae=x.value,se=U(D),Ce=ae,H=D==="value"?Ce:Xs(Ce),Je=!1;if(f.attrName=se,f.attrValue=H,f.keepAttr=!0,f.forceKeepAttr=void 0,oe(F.uponSanitizeAttribute,o,f),H=f.attrValue,_r&&(se==="id"||se==="name")&&jn(H,Lr)!==0&&(He(D,o,x),H=Lr+H,Je=!0),Zr(D,H)){He(D,o,x);continue}if(!f.forceKeepAttr){if(!f.keepAttr){He(D,o,x);continue}if(!rn&&B(Qi,H)){He(D,o,x);continue}if(pe&&(H=_t(H)),!qr(y,se,H)){He(D,o,x);continue}H=wa(y,se,he,H),H!==Ce&&ya(o,D,he,H)&&Je&&Fi(e.removed)}}oe(F.afterSanitizeAttributes,o,null),Qe(o,d)},kn=function(o,d){ba(o,d),xa(o,d),Be(o.content)&&wn(o.content)},wn=function(o){let d=null,u=St(o);for(oe(F.beforeSanitizeShadowDOM,o,null);d=u.nextNode();)if(oe(F.uponSanitizeShadowNode,d,null),kn(d,o),$(d)===O.element){let f=R(d);Be(f)&&(yn(f),wn(f))}pe&&bn(o),oe(F.afterSanitizeShadowDOM,o,null)},yn=function(o){let d=[{node:o,shadow:null}];for(;d.length>0;){let u=d.pop();if(u.shadow){wn(u.shadow);continue}let f=u.node,k=$(f)===O.element,y=S(f);if(y)for(let x=y.length-1;x>=0;--x)d.push({node:y[x],shadow:null});if(k){let x=J?J(f):null;if(typeof x=="string"&&U(x)==="template"){let D=f.content;Be(D)&&d.push({node:D,shadow:null})}}if(k){let x=R(f);Be(x)&&d.push({node:null,shadow:x},{node:x,shadow:null})}}},Ea=function(o){let d=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},u=null,f=null,k=null,y=null;if(cn=!o,cn&&(o="<!-->"),typeof o!="string"&&!Xe(o)&&(o=nl(o),typeof o!="string"))throw ce("dirty is not a string, aborting");if(!e.isSupported)return o;bt?(I=kt,M=wt):Tt(d),At=Ke,e.removed=[];let x=ln&&typeof o!="string"&&Xe(o),D=[],he=fe,ae=Le;if(x){ua(o),D=mn(o);let H=Y(o);if(typeof H=="string"){let Je=U(H);if(!I[Je]||Ye[Je])throw gn(o,D),ce("root node is forbidden and cannot be sanitized in-place")}if(Lt(o))throw gn(o,D),ce("root node is clobbered and cannot be sanitized in-place");fe=Bn(),Le=Ys()}else if(Xe(o))u=Wr("<!---->"),f=u.ownerDocument.importNode(o,!0),f.nodeType===O.element&&f.nodeName==="BODY"||f.nodeName==="HTML"?u=f:u.appendChild(f),yn(u);else{if(!ze&&!pe&&!_e&&o.indexOf("<")===-1)return yr(o);if(u=Wr(o),!u)return ze?null:an?j:""}u&&on&&be(u.firstChild);let se=x?o:u;try{x&&yn(o);let H=St(se);for(;k=H.nextNode();)kn(k,se);x&&la(o,D)}catch(H){throw x&&gn(o,D),H}finally{fe=he,Le=ae}if(x){if(Fr(o,D))throw ce("a node selected for removal could not be safely returned; refusing to sanitize in place");return pe&&vn(o),o}if(ze){if(pe&&vn(u),yt)for(y=zo.call(u.ownerDocument);u.firstChild;)y.appendChild(u.firstChild);else y=u;return(M.shadowroot||M.shadowrootmode)&&(y=Fo.call(r,y,!0)),y}pe&&bn(u);let Ce=_e?u.outerHTML:u.innerHTML;return _e&&I["!doctype"]&&u.ownerDocument&&u.ownerDocument.doctype&&u.ownerDocument.doctype.name&&B(ml,u.ownerDocument.doctype.name)&&(Ce="<!DOCTYPE "+u.ownerDocument.doctype.name+`>
`+Ce),yr(Ce)};return e.sanitize=function(g){let o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},d=At,u=I,f=M,k=e.removed;At=null;try{return Ea(g,o)}finally{At=d,d&&(bt||Tt(d),I=u,M=f,e.removed=k)}},e.setConfig=function(){let g=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Tt(g),bt=!0,kt=I,wt=M},e.clearConfig=function(){Ke=null,bt=!1,kt=null,wt=null,G=qe,j=""},e.isValidAttribute=function(g,o,d){Ke||Tt({});let u=U(g),f=U(o);return typeof d=="string"&&(Zr(o,d)||!rn&&B(Qi,d))?!1:qr(u,f,d)},e.addHook=function(g,o){typeof o=="function"&&Z(F,g)&&st(F[g],o)},e.removeHook=function(g,o){if(Z(F,g)){if(o!==void 0){let d=qs(F[g],o);return d===-1?void 0:Vs(F[g],d,1)[0]}return Fi(F[g])}},e.removeHooks=function(g){Z(F,g)&&(F[g]=[])},e.removeAllHooks=function(){F=Ji()},e}var oo=io();function v(t,e){let n=document.createElement(t);return e&&(n.className=e),n}function z(t,e){return t.textContent=e,t}var _l={headerOf:new Map,infoOf:new Map};function er(t,e){if(e.size===0)return _l;let n=new Map;for(let a of t){let s=a.partOf?.id;if(!s)continue;let l=n.get(s);l?l.push(a):n.set(s,[a])}let r=new Map,i=new Map;for(let[a,s]of n){if(s.length<2)continue;let l=et(s),c=l[0],h=c.partOf.type;if(!e.has(h))continue;let p=l.length;l.forEach((b,m)=>{r.set(b,c),i.set(b,{key:a,type:h,index:m+1,total:p,members:l})})}return{headerOf:r,infoOf:i}}var Ll={en:{loading:"Loading events\u2026",empty:"No upcoming events.",notFound:"Event not found in this feed.",errorPrefix:"Could not load events: ",online:"Online",onlineEvent:"Online event",free:"Free",addOnAmount:t=>`+${t}`,addOnNote:"Additional charge on top of the event's admission",updated:"Updated",event:"Event",when:"When",lastUpdate:"Last update",location:"Location",locationUnknown:"Venue not specified",onlineLinkUnknown:"No public link",onlineLinkUnknownHint:"The organizer may share the link privately, e.g. after registration.",organizer:"Organizer",notAvailable:"\u2014",attendance:{"in-person":"In person",online:"Online",hybrid:"Hybrid"},eligibility:{open:"Open to all","members-only":"Members only","approval-required":"Approval required",restricted:"Restricted"},cfp:"Call for Proposals",cfpCloses:t=>`Call for Proposals \u2014 closes ${t}`,close:"Close",eventDetails:"Event details",addToGoogle:"Add to Google Calendar",addToOutlook:"Add to Outlook",addToYahoo:"Add to Yahoo",downloadIcs:"Download ICS",addToCalendar:"Add to calendar",openEventPage:"Open event page",groupSeries:"Series",groupMultipart:"Multi-part",groupCount:t=>`${t} occurrences`,groupCounter:(t,e)=>`${t} of ${e}`,previousOccurrence:"Previous occurrence",nextOccurrence:"Next occurrence"},es:{loading:"Cargando eventos\u2026",empty:"No hay pr\xF3ximos eventos.",notFound:"Evento no encontrado en este feed.",errorPrefix:"No se pudieron cargar los eventos: ",online:"En l\xEDnea",onlineEvent:"Evento en l\xEDnea",free:"Gratis",addOnAmount:t=>`+${t}`,addOnNote:"Cargo adicional sobre la entrada del evento",updated:"Actualizado",event:"Evento",when:"Cu\xE1ndo",lastUpdate:"\xDAltima actualizaci\xF3n",location:"Lugar",locationUnknown:"Sede no especificada",onlineLinkUnknown:"Sin enlace p\xFAblico",onlineLinkUnknownHint:"El organizador podr\xEDa compartir el enlace de forma privada, por ejemplo tras inscribirte.",organizer:"Organizador",notAvailable:"\u2014",attendance:{"in-person":"Presencial",online:"En l\xEDnea",hybrid:"H\xEDbrido"},eligibility:{open:"Abierto a todos","members-only":"Solo miembros","approval-required":"Requiere aprobaci\xF3n",restricted:"Acceso restringido"},cfp:"Convocatoria de ponencias",cfpCloses:t=>`Convocatoria de ponencias \u2014 cierra ${t}`,close:"Cerrar",eventDetails:"Detalles del evento",addToGoogle:"A\xF1adir a Google Calendar",addToOutlook:"A\xF1adir a Outlook",addToYahoo:"A\xF1adir a Yahoo",downloadIcs:"Descargar ICS",addToCalendar:"A\xF1adir al calendario",openEventPage:"Abrir p\xE1gina del evento",groupSeries:"Serie",groupMultipart:"Multi-part",groupCount:t=>`${t} ocurrencias`,groupCounter:(t,e)=>`${t} de ${e}`,previousOccurrence:"Ocurrencia anterior",nextOccurrence:"Ocurrencia siguiente"}};function rr(t,e="event-description"){let n=v("div",e),r=C.parse(t,{async:!1});n.innerHTML=oo.sanitize(r);for(let i of n.querySelectorAll("a[href]"))i.setAttribute("target","_blank"),i.setAttribute("rel","noopener");return n}function ir(t,e){let n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.setAttribute("class",e),n.setAttribute("viewBox","0 0 24 24"),n.setAttribute("fill","none"),n.setAttribute("stroke","currentColor"),n.setAttribute("stroke-width","2"),n.setAttribute("stroke-linecap","round"),n.setAttribute("stroke-linejoin","round"),n.setAttribute("aria-hidden","true"),n.setAttribute("focusable","false");for(let r of t){let i=document.createElementNS("http://www.w3.org/2000/svg","path");i.setAttribute("d",r),n.append(i)}return n}function Rl(t){return ir({online:["M15 10l4.6-2.3A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.4.9L15 14","M3 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2"],"in-person":["M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0","M12 10h.01"],hybrid:["M4 5h9a2 2 0 0 1 2 2v5H2V7a2 2 0 0 1 2-2","M8 19h4","M10 12v7","M18 21s4-3.2 4-6a4 4 0 0 0-8 0c0 2.8 4 6 4 6","M18 15h.01"]}[t],"badge-icon")}function mt(t){return ir({calendar:["M8 2v4","M16 2v4","M3 10h18","M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],"external-link":["M15 3h6v6","M10 14 21 3","M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"],edit:["M12 20h9","M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],trash:["M3 6h18","M8 6V4h8v2","M19 6l-1 14H6L5 6","M10 11v6","M14 11v6"],copy:["M8 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2","M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"],star:["M12 2l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.77 5.82 21 7 14.13 2 9.26l6.91-1L12 2"],check:["M20 6 9 17l-5-5"],bookmark:["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"],plus:["M12 5v14","M5 12h14"],folder:["M4 4h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"],collection:["M4 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2","M8 2v4","M16 2v4","M7 10h10","M7 14h7"]}[t],"action-icon")}function or(t,e){let n=v("span",`badge attendance-badge attendance-${t}`);return n.append(Rl(t),document.createTextNode(e)),n}function ar(t,e){let n=e.eligibility[t.type],r=t.url?v("a"):v("span");if(r.classList.add("badge","eligibility-badge"),t.url){let i=r;i.href=t.url,i.target="_blank",i.rel="noopener"}return r.textContent=n,t.note&&(r.title=t.note,r.setAttribute("aria-label",`${n}: ${t.note}`)),r}function sr(t,e){let n=v("a","badge cfp-badge");n.href=t.url,n.target="_blank",n.rel="noopener",n.textContent=e.cfp;let r=ft(t.closesAt,void 0);if(r){let i=e.cfpCloses(r);n.title=i,n.setAttribute("aria-label",i)}return n}function Cl(t,e){return t==="multipart"?e.groupMultipart:e.groupSeries}function Dl(t,e){let n=Cl(t.type,e),r=v("span","badge event-group-badge");return r.textContent=n,r.setAttribute("aria-label",`${n}, ${e.groupCount(t.total)}`),r}function lr(t,e){let n=mo(t,e),r=t.locationLink??go(n),i=cr(t,e);if(!r){let s=z(v("span"),i);return Pl(t)&&(s.title=e.onlineLinkUnknownHint),s}let a=v("a");return a.href=r,a.target="_blank",a.rel="noopener",a.textContent=i,a}function Pl(t){return t.attendanceMode==="online"&&!t.locationLink&&(!t.location||t.location==="online")}function mo(t,e){return t.location&&t.location!=="online"?t.location:t.attendanceMode==="online"?e.onlineLinkUnknown:e.locationUnknown}function cr(t,e){let n=mo(t,e),r=t.locationLink??go(n);return Ol(r?Ot(r):n,e)}function Ol(t,e){return!t||t==="online"?e.online:t==="Online link"||t==="Online event"?e.onlineEvent:t}function go(t){if(t)try{let e=new URL(t);return e.protocol==="http:"||e.protocol==="https:"?t:void 0}catch{return}}function dr(t){let e=Dt(t.startDate);return e!==null&&e<Date.now()}function vo(t){if(!t.feed)return[];let e=t.sort==="none"?[...t.feed.events]:et(t.feed.events);return t.eventId!==void 0?e.filter(n=>n.id===t.eventId):e.filter(n=>t.showPast||!dr(n))}function Kt(t){return t.layout!=="cards"||t.groupEvents.size===0?{headerOf:new Map,infoOf:new Map}:er(vo(t),t.groupEvents)}function ur(t){let e=vo(t);if(t.layout!=="cards"||t.groupEvents.size===0)return e.slice(0,t.limit);let{headerOf:n}=er(e,t.groupEvents),r=new Set,i=[];for(let a of e){let s=n.get(a)??a;r.has(s)||(r.add(s),i.push(s))}return i.slice(0,t.limit)}function ao(t,e){if(e)try{return new Intl.NumberFormat(void 0,{style:"currency",currency:e}).format(t)}catch{return`${t} ${e}`}return String(t)}function Il(t,e){if(t.amount!==void 0)return t.basis==="add-on-only"?e.addOnAmount(ao(t.amount,t.currency)):t.amount===0?e.free:ao(t.amount,t.currency)}function pr(t,e){let n=Il(t,e);if(n===void 0)return;let r=t.basis==="add-on-only"?e.addOnNote:void 0;if(!t.url){let a=z(v("span","price"),n);return r&&(a.title=r),a}let i=v("a","price");return i.href=t.url,i.target="_blank",i.rel="noopener",i.textContent=n,r&&(i.title=r),i}function so(t,e){if(!t)return;let n=Pt(t),r=new Date(`${t}${e==="UTC"&&!n?"Z":""}`);return Number.isNaN(r.valueOf())?void 0:r}function qt(t,e){let n=t.toISOString();return e?n.slice(0,10).replace(/-/g,""):n.replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z")}function Ml(t){let e=new Date(t);return e.setUTCDate(e.getUTCDate()+1),e}function Nl(t){let e=so(t.startDate,t.timezone);if(!e)return;let n=Pt(t.startDate),r=so(n&&t.endDate?An(t.endDate,1):t.endDate,t.timezone)??(n?Ml(e):e);return{start:e,end:r,dateOnly:n}}function bo(t){return t.description??""}function zl(t,e,n){if(t==="link")return e.link;let r=Nl(e);if(!r)return;let i=qt(r.start,r.dateOnly),a=qt(r.end,r.dateOnly),s=bo(e),l=cr(e,n);if(t==="google-calendar"){let c=new URL("https://calendar.google.com/calendar/render");return c.searchParams.set("action","TEMPLATE"),c.searchParams.set("text",e.name),c.searchParams.set("dates",`${i}/${a}`),s&&c.searchParams.set("details",s),l&&c.searchParams.set("location",l),e.timezone&&c.searchParams.set("ctz",e.timezone),c.toString()}if(t==="outlook-calendar"){let c=new URL("https://outlook.live.com/calendar/0/action/compose");return c.searchParams.set("rru","addevent"),c.searchParams.set("subject",e.name),c.searchParams.set("startdt",r.start.toISOString()),c.searchParams.set("enddt",r.end.toISOString()),s&&c.searchParams.set("body",s),l&&c.searchParams.set("location",l),c.toString()}if(t==="yahoo-calendar"){let c=new URL("https://calendar.yahoo.com/");return c.searchParams.set("v","60"),c.searchParams.set("title",e.name),c.searchParams.set("st",i),c.searchParams.set("et",a),s&&c.searchParams.set("desc",s),l&&c.searchParams.set("in_loc",l),c.toString()}return`data:text/calendar;charset=utf-8,${encodeURIComponent($l(e,r,n))}`}function pt(t){return t.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}function $l(t,e,n){let r=c=>qt(c,e.dateOnly),i=e.dateOnly?";VALUE=DATE":"",a=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//OpenTechEvents//ote-events//EN","BEGIN:VEVENT",`UID:${pt(t.link??t.name)}`,`DTSTAMP:${qt(new Date,!1)}`,`DTSTART${i}:${r(e.start)}`,`DTEND${i}:${r(e.end)}`,`SUMMARY:${pt(t.name)}`],s=bo(t),l=cr(t,n);return s&&a.push(`DESCRIPTION:${pt(s)}`),l&&a.push(`LOCATION:${pt(l)}`),t.link&&a.push(`URL:${pt(t.link)}`),a.push("END:VEVENT","END:VCALENDAR"),a.join(`\r
`)}function Fl(t){if(!t)return null;let n=new Date(t).valueOf();return Number.isNaN(n)?null:n}function Ul(t){let e=Fl(t);if(e===null)return t;let n=Math.round((e-Date.now())/1e3),r=Math.abs(n),i=[["year",31536e3,"y"],["month",2592e3,"mo"],["week",604800,"w"],["day",86400,"d"],["hour",3600,"h"],["minute",60,"m"]];for(let[,a,s]of i)if(r>=a)return`${Math.max(1,Math.round(r/a))}${s}`;return"now"}function ft(t,e){if(!t)return;let n=/^\d{4}-\d{2}-\d{2}$/.test(t),r=new Date(`${t}${e==="UTC"&&!n?"Z":""}`);if(Number.isNaN(r.valueOf()))return e?`${t} (${e})`:t;let i=n?{weekday:"short",month:"short",day:"numeric",year:"numeric"}:{weekday:"short",month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"},a=new Intl.DateTimeFormat(void 0,i).format(r);return e&&!n?`${a} (${e})`:a}function lo(t){if(!t)return;let e=/^\d{4}-\d{2}-\d{2}$/.test(t),n=new Date(t);if(Number.isNaN(n.valueOf()))return t;let r=e?{month:"short",day:"numeric"}:{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"};return new Intl.DateTimeFormat(void 0,r).format(n)}function Hl(t){if(!t)return;let e=new Date(t);return Number.isNaN(e.valueOf())?t:new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric"}).format(e)}function Bl(t,e){if(!t||!e)return!1;let n=new Date(t),r=new Date(e);return Number.isNaN(n.valueOf())||Number.isNaN(r.valueOf())?!1:n.getFullYear()===r.getFullYear()&&n.getMonth()===r.getMonth()&&n.getDate()===r.getDate()}function co(t){if(!t||/^\d{4}-\d{2}-\d{2}$/.test(t))return;let e=new Date(t);if(!Number.isNaN(e.valueOf()))return new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).format(e)}function fr(t){let e=lo(t.startDate),n=lo(t.endDate);if(e&&t.endDate&&Bl(t.startDate,t.endDate)){let r=Hl(t.startDate),i=co(t.startDate),a=co(t.endDate);if(r&&i&&a)return`${r}, ${i}-${a}`}return e&&n&&n!==e?`${e} \u2013 ${n}`:e??t.dateLabel}function hr(t){if(t.dateLabel)return t.dateLabel;let e=ft(t.startDate,t.timezone),n=ft(t.endDate,t.timezone);return e&&n?`${e} to ${n}`:e}function Wl(t){let e=fr(t),n=hr(t)??tt(t),r=e??n;if(!r)return;let i=z(v("p","event-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function Gl(t){let e=fr(t),n=hr(t)??tt(t),r=e??n;if(!r)return;let i=z(v("span","event-detail-when"),r);return n&&n!==r&&(i.title=n,i.setAttribute("aria-label",n),i.tabIndex=0),i}function Vt(t){if(t.image)return/^http:\/\//i.test(t.image.url)&&globalThis.location?.protocol==="https:"?void 0:t.image}function mr(t,e){let n=Vt(t);if(!n)return;let r=v("img","event-image");return r.src=n.url,r.alt=n.alt??t.name,r.loading="lazy",r.addEventListener("error",()=>{r.replaceWith(ko(e))}),r}function ko(t){if(t){let e=v("img","event-image event-image-placeholder");return e.src=t,e.alt="",e.loading="lazy",e.addEventListener("error",()=>e.replaceWith(v("div","event-image event-image-placeholder"))),e}return v("div","event-image event-image-placeholder")}function jl(t,e,n,r){let i=v("li","event");dr(t)&&i.classList.add("event-past"),gr(i,t,e),ql(i,t,e);let a=r?.infoOf.get(t);a&&(i.classList.add("event-stacked"),i.append(Dl(a,n))),e.previewFields.has("image")&&i.append(mr(t,e.placeholderImage)??ko(e.placeholderImage));let s=v("div","event-body");i.append(s);let l=v("h3","event-title");if(t.link&&e.eventClick==="link"){let p=v("a");p.href=t.link,p.target="_blank",p.rel="noopener",p.textContent=t.name,l.append(p)}else l.textContent=t.name;if(s.append(l),e.previewFields.has("when")){let p=Wl(t);p&&s.append(p)}let c=v("div","event-badges");if(e.previewFields.has("attendance")&&t.attendanceMode&&c.append(or(t.attendanceMode,n.attendance[t.attendanceMode])),e.previewFields.has("price")&&t.price){let p=pr(t.price,n);p&&c.append(p)}e.previewFields.has("eligibility")&&t.eligibility&&c.append(ar(t.eligibility,n)),e.previewFields.has("cfp")&&t.cfp&&c.append(sr(t.cfp,n)),vr(c,t,e);let h=v("div","event-meta");if(c.children.length>0&&h.append(c),e.previewFields.has("location")){let p=v("p","event-location");p.append(lr(t,n)),h.append(p)}if(h.children.length>0&&s.append(h),e.previewFields.has("organizer")&&t.organizerName&&s.append(z(v("p","event-organizer"),t.organizerName)),e.previewFields.has("description")){let p=xn(t.description,220);p&&s.append(rr(p))}if(e.previewFields.has("tags")&&t.tags&&t.tags.length>0){let p=v("ul","tags");for(let b of t.tags)p.append(z(v("li","tag"),b));s.append(p)}return Ql(s,t,n,e),i}function tr(t,e){return t.details?.find(n=>n.label===e)?.value}var wo=new Set(["ID","Source","Image","Updated"]);function ql(t,e,n){n.eventClick!=="none"&&(t.classList.add("event-clickable"),t.tabIndex=0,t.addEventListener("click",r=>{let i=r.target;i instanceof Element&&i.closest("a, button, summary")||uo(e,n)}),t.addEventListener("keydown",r=>{r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),uo(e,n))}))}function uo(t,e){e.onEventOpen?.(t),e.eventClick==="link"&&t.link&&window.open(t.link,"_blank","noopener")}function Ne(t,e,n){n&&t.append(z(v("dt"),e),z(v("dd"),n))}function nr(t,e,n){if(!n)return;let r=v("dd");r.append(n),t.append(z(v("dt"),e),r)}function Vl(t,e){let n=v("span",`event-header-icon ${t}`);return n.title=e,n.setAttribute("aria-label",e),n}function Zl(t,e,n){let r=v("li","event event-row");dr(t)&&r.classList.add("event-past"),gr(r,t,n);let i=v("details","event-accordion");r.append(i);let a=v("summary","event-summary");i.append(a);let s=v("span","event-summary-title");s.textContent=t.name,a.append(s);let l=hr(t)??tt(t),c=fr(t)??l;a.append(z(v("span","event-summary-when"),c||e.notAvailable)),a.append(z(v("span","event-summary-updated"),Ul(t.updatedAt??tr(t,"Updated"))??e.notAvailable));let h=v("div","event-details"),p=n.detailFields.has("image")&&!!Vt(t),b=t.description?.trim().length??0;!p&&b>0&&b<=180&&h.classList.add("event-details-compact"),i.append(h);let m=v("div","event-details-content"),w=v("div","event-details-main"),A=v("aside","event-details-aside");if(m.append(w,A),h.append(m),p){let S=mr(t,n.placeholderImage);S&&A.append(S)}let E=v("div","event-badges");if(n.detailFields.has("attendance")&&t.attendanceMode&&E.append(or(t.attendanceMode,e.attendance[t.attendanceMode])),n.detailFields.has("price")&&t.price){let S=pr(t.price,e);S&&E.append(S)}n.detailFields.has("eligibility")&&t.eligibility&&E.append(ar(t.eligibility,e)),n.detailFields.has("cfp")&&t.cfp&&E.append(sr(t.cfp,e)),vr(E,t,n),E.children.length>0&&A.append(E),n.detailFields.has("description")&&t.description&&w.append(rr(t.description));let T=v("dl","event-detail-list");n.detailFields.has("when")&&Ne(T,e.when,l),n.detailFields.has("location")&&nr(T,e.location,lr(t,e)),n.detailFields.has("organizer")&&Ne(T,e.organizer,t.organizerName),Ne(T,e.updated,ft(t.updatedAt??tr(t,"Updated"),void 0));for(let S of t.details??[])wo.has(S.label)||Ne(T,S.label,S.value);if(T.children.length>0&&A.append(T),n.detailFields.has("tags")&&t.tags&&t.tags.length>0){let S=v("ul","tags");for(let W of t.tags)S.append(z(v("li","tag"),W));w.append(S)}return To(h,t,e,n),Jl(r,t,e,n),r}function po(t,e){return t==="google-calendar"?e.addToGoogle:t==="outlook-calendar"?e.addToOutlook:t==="yahoo-calendar"?e.addToYahoo:t==="ics"?e.downloadIcs:e.openEventPage}var Zt=new Set(["google-calendar","outlook-calendar","yahoo-calendar","ics"]);function Yl(t){return typeof t!="string"&&"type"in t}function Kl(t){return typeof t!="string"&&"id"in t}function ht(t){return typeof t=="string"?t:t.type}function yo(t,e){return!t.layouts||t.layouts.includes(e)}function xo(t,e){let n=t.placement??"detail";return n===e||n==="both"}function Xl(t,e,n){return typeof t=="string"?e==="detail":xo(t,e)&&yo(t,n)}function Eo(t,e,n){return Lo(t,e).filter(r=>(typeof r=="string"||Yl(r))&&Xl(r,n,t.layout))}function Ao(t,e,n){return Lo(t,e).filter(r=>Kl(r)&&xo(r,n)&&yo(r,t.layout))}function Yt(t,e,n,r,i){let a=ht(e),s=zl(a,n,r);if(!s)return;let l=v("a");l.href=s,l.target=a==="ics"?"_self":"_blank",l.rel="noopener",a==="ics"&&l.setAttribute("download","event.ics"),a==="link"?l.append(mt("external-link"),document.createTextNode(po(a,r))):l.textContent=po(a,r),l.addEventListener("click",()=>i.onEventAction?.(e,n)),t.append(l)}function To(t,e,n,r){let i=v("div","event-actions"),a=Eo(r,e,"detail"),s=a.filter(l=>Zt.has(ht(l)));if(s.length>0){let l=v("details","event-action-menu"),c=v("summary","event-action-menu-trigger");c.append(mt("calendar"),document.createTextNode(n.addToCalendar)),l.append(c);let h=v("div","event-action-menu-items");for(let p of s)Yt(h,p,e,n,r);h.children.length>0&&(l.append(h),i.append(l))}for(let l of a)Zt.has(ht(l))||Yt(i,l,e,n,r);for(let l of Ao(r,e,"detail"))i.append(_o(l,e,r));i.children.length>0&&t.append(i)}function So(t,e,n){let r=Eo(n,t,"preview"),i=Ao(n,t,"preview");if(r.length===0&&i.length===0)return;let a=v("div","event-actions event-preview-actions"),s=r.filter(l=>Zt.has(ht(l)));if(s.length>0){let l=v("details","event-action-menu"),c=v("summary","event-action-menu-trigger");c.append(mt("calendar"),document.createTextNode(e.addToCalendar)),l.append(c);let h=v("div","event-action-menu-items");for(let p of s)Yt(h,p,t,e,n);h.children.length>0&&(l.append(h),a.append(l))}for(let l of r)Zt.has(ht(l))||Yt(a,l,t,e,n);for(let l of i)a.append(_o(l,t,n));return a}function Ql(t,e,n,r){let i=So(e,n,r);i&&t.append(i)}function Jl(t,e,n,r){let i=So(e,n,r);i&&(i.classList.add("event-row-actions"),t.append(i))}function _o(t,e,n){let r=v("button");return r.type="button",r.classList.add("event-custom-action"),t.variant==="danger"&&r.classList.add("event-action-danger"),t.pressed!==void 0&&r.setAttribute("aria-pressed",String(t.pressed)),t.icon?r.append(mt(t.icon),document.createTextNode(t.label)):r.textContent=t.label,r.addEventListener("click",()=>{n.onEventAction?.(t,e),t.onClick(e,Xt(n,e))}),r}function Xt(t,e){let n=t.eventContext?.(e)??{previewEvent:e,index:t.feed?.events.indexOf(e)??-1},r=Kt(t).infoOf.get(e);return r?{...n,group:r}:n}function Lo(t,e){return typeof t.eventActions=="function"?t.eventActions(Xt(t,e)):t.eventActions}function ec(t){return t?(Array.isArray(t)?t:t.split(/\s+/)).map(n=>n.trim()).filter(Boolean):[]}function gr(t,e,n){for(let r of ec(n.eventClassName?.(Xt(n,e))))t.classList.add(r)}function vr(t,e,n){let r=n.eventBadges?.(Xt(n,e))??[];for(let i of r){if(typeof i=="string"){let s=v("span","badge event-custom-badge event-custom-badge-default");s.title=i,s.append(z(v("span","event-custom-badge-label"),i)),t.append(s);continue}let a=v("span",`badge event-custom-badge event-custom-badge-${i.tone??"default"}`);a.title=i.title??i.label,i.icon&&a.append(mt(i.icon)),a.append(z(v("span","event-custom-badge-label"),i.label)),t.append(a)}}function fo(t){return ir([t==="left"?"M15 18l-6-6 6-6":"M9 18l6-6-6-6"],"event-modal-nav-icon")}function tc(t,e,n){let r=v("div","event-modal-nav"),i=v("button","event-modal-nav-button");i.type="button",i.setAttribute("aria-label",e.previousOccurrence),i.title=e.previousOccurrence,i.append(fo("left"));let a=t.members[t.index-2];i.disabled=!a,i.addEventListener("click",()=>{a&&n.onEventOpen?.(a)});let s=v("span","event-modal-nav-counter");s.setAttribute("aria-live","polite"),s.textContent=e.groupCounter(t.index,t.total);let l=v("button","event-modal-nav-button");l.type="button",l.setAttribute("aria-label",e.nextOccurrence),l.title=e.nextOccurrence,l.append(fo("right"));let c=t.members[t.index];return l.disabled=!c,l.addEventListener("click",()=>{c&&n.onEventOpen?.(c)}),r.append(i,s,l),r}function ho(t,e,n,r){let i=v("div","event-modal-backdrop");i.tabIndex=-1,i.addEventListener("click",E=>{E.target===i&&n.onEventClose?.()}),i.addEventListener("keydown",E=>{E.key==="Escape"&&n.onEventClose?.()});let a=v("section","event-modal");gr(a,t,n);let s=t.description?.trim().length??0;!Vt(t)&&s>0&&s<=180&&a.classList.add("event-modal-compact"),a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.setAttribute("aria-label",e.eventDetails),i.append(a);let l=v("div","event-modal-header");l.append(z(v("h2","event-modal-title"),t.name));let c=v("button","event-modal-close");c.type="button",c.textContent="\xD7",c.title=e.close,c.setAttribute("aria-label",e.close),c.addEventListener("click",()=>n.onEventClose?.()),l.append(c),a.append(l);let h=r?.infoOf.get(t),p=v("div","event-modal-content"),b=v("div","event-modal-main"),m=v("aside","event-modal-aside");if(p.append(b,m),a.append(p),n.detailFields.has("image")&&Vt(t)){let E=mr(t,n.placeholderImage);E&&m.append(E)}let w=v("div","event-badges");if(n.detailFields.has("attendance")&&t.attendanceMode&&w.append(or(t.attendanceMode,e.attendance[t.attendanceMode])),n.detailFields.has("price")&&t.price){let E=pr(t.price,e);E&&w.append(E)}n.detailFields.has("eligibility")&&t.eligibility&&w.append(ar(t.eligibility,e)),n.detailFields.has("cfp")&&t.cfp&&w.append(sr(t.cfp,e)),vr(w,t,n),w.children.length>0&&m.append(w),n.detailFields.has("description")&&t.description&&b.append(rr(t.description));let A=v("dl","event-detail-list");n.detailFields.has("when")&&nr(A,e.when,Gl(t)),h&&h.total>1&&A.append(tc(h,e,n)),n.detailFields.has("location")&&nr(A,e.location,lr(t,e)),n.detailFields.has("organizer")&&Ne(A,e.organizer,t.organizerName),Ne(A,e.updated,ft(t.updatedAt??tr(t,"Updated"),void 0));for(let E of t.details??[])wo.has(E.label)||Ne(A,E.label,E.value);if(A.children.length>0&&m.append(A),n.detailFields.has("tags")&&t.tags&&t.tags.length>0){let E=v("ul","tags");for(let T of t.tags)E.append(z(v("li","tag"),T));b.append(E)}return To(a,t,e,n),queueMicrotask(()=>c.focus()),i}function Ro(t,e){t.replaceChildren();let n=Ll[e.lang];if(e.status==="idle"||e.status==="loading"){t.append(z(v("p","message"),n.loading));return}if(e.status==="error"){t.append(z(v("p","message error"),`${n.errorPrefix}${e.errorMessage}`));return}let r=ur(e);if(r.length===0){let s=e.emptyMessage??(e.eventId!==void 0?n.notFound:n.empty);t.append(z(v("p","message"),s));return}if(e.layout==="calendar"){t.append(z(v("div","calendar-host"),n.loading)),e.selectedEvent&&t.append(ho(e.selectedEvent,n,e));return}let i=Kt(e),a=v("ul",`events layout-${e.layout}`);if(e.layout==="list"){let s=v("li","event-list-header");s.append(z(v("span"),n.event),z(v("span"),n.when),Vl("icon-updated",n.lastUpdate)),a.append(s)}for(let s of r)a.append(e.layout==="list"?Zl(s,n,e):jl(s,e,n,i));t.append(a),e.selectedEvent&&t.append(ho(e.selectedEvent,n,e,i))}var Co=`
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

/* Four controls plus a month title do not fit a phone-width toolbar on one line. */
.calendar-host .ec-toolbar {
  flex-wrap: wrap;
  gap: 0.35rem;
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
`;var br=class extends HTMLElement{static observedAttributes=["feed","feeds","event-id","limit","theme","lang","show-past","layout","fields","fields-preview","fields-detail","card-width","group-events","placeholder-image","event-click","event-actions","sort","empty-message","max-per-day","initial-date","responsive"];#s;#r;#i;#n;#u=!1;#l=[];#c;#d=new WeakMap;#o="idle";#a="";#m=0;#t;#g=[];#v;#b;#p;#f=0;#E=!1;#h;constructor(){super();let e=this.attachShadow({mode:"open"});this.#s=document.createElement("style"),this.#s.textContent=Co,this.#r=document.createElement("div"),this.#r.className="ote-events",e.append(this.#s,this.#r)}connectedCallback(){this.#u?this.#e():this.#k()}disconnectedCallback(){this.#x()}attributeChangedCallback(e){this.isConnected&&(e==="feed"||e==="feeds"?(this.#h=void 0,this.#k()):this.#e())}get feedData(){return this.#n}set feedData(e){this.#w(e)}get events(){if(this.#n)return Array.isArray(this.#n)?this.#n:this.#n.events}set events(e){this.#w(e)}get event(){return this.events?.[0]}set event(e){this.#w(e==null?e:[e])}get eventActions(){return this.#g}set eventActions(e){this.#g=Array.isArray(e)||typeof e=="function"?e:[],this.isConnected&&this.#e()}get eventClassName(){return this.#v}set eventClassName(e){this.#v=typeof e=="function"?e:void 0,this.isConnected&&this.#e()}get eventBadges(){return this.#b}set eventBadges(e){this.#b=typeof e=="function"?e:void 0,this.isConnected&&this.#e()}#A(){let e=Ii(this.getAttribute("feeds"));if(e.length>0)return e;let n=this.getAttribute("feed");return n?[n]:[]}async#k(){if(this.#u)return;let e=this.#A();if(e.length===0){this.#o="error",this.#a='Missing required "feed" or "feeds" attribute.',this.#t=void 0,this.#e();return}this.#o="loading",this.#e();let n=++this.#m,r=await Promise.allSettled(e.map(nc));if(n!==this.#m)return;let i=r.filter(a=>a.status==="fulfilled");if(i.length===0){this.#o="error",this.#a=e.length===1?Do(r[0].reason):r.map((a,s)=>`${e[s]}: ${Do(a.reason)}`).join("; "),this.#t=void 0,this.#e();return}try{let a=rc(i.map(l=>l.value)),s=It(a);this.#i=s,this.#n=a,this.#u=!1,this.#l=Qt(a),this.#c=i.length===1?Po(a,i[0].value.url):void 0,this.#d=Oo(s,this.#l,this.#c),this.#o="loaded",this.#t=void 0}catch(a){this.#o="error",this.#a=a instanceof Error?a.message:String(a),this.#t=void 0}this.#e()}#w(e){if(this.#m++,e==null){this.#n=void 0,this.#u=!1,this.#i=void 0,this.#l=[],this.#c=void 0,this.#d=new WeakMap,this.#a="",this.#t=void 0,this.isConnected&&this.#k();return}this.#n=e,this.#u=!0;try{this.#i=It(e),this.#l=Qt(e),this.#c=Po(e),this.#d=Oo(this.#i,this.#l,this.#c),this.#o="loaded",this.#a="",this.#t=void 0}catch(n){this.#i=void 0,this.#l=[],this.#c=void 0,this.#d=new WeakMap,this.#o="error",this.#a=n instanceof Error?n.message:String(n),this.#t=void 0}this.isConnected&&this.#e()}#e(){this.style.setProperty("--ote-card-min-width",Mi(this.getAttribute("card-width")));let e=Ti(Ai(this.getAttribute("lang")),navigator.language),n={status:this.#o,errorMessage:this.#a,feed:this.#i,lang:e,limit:Ei(this.getAttribute("limit")),eventId:Si(this.getAttribute("event-id")),showPast:_i(this.getAttribute("show-past")),sort:Ri(this.getAttribute("sort")),layout:Li(this.getAttribute("layout")),previewFields:Di(this.getAttribute("fields-preview")??this.getAttribute("fields")),detailFields:Pi(this.getAttribute("fields-detail")??this.getAttribute("fields")),groupEvents:Oi(this.getAttribute("group-events")),placeholderImage:this.getAttribute("placeholder-image")?.trim()||void 0,emptyMessage:this.getAttribute("empty-message")?.trim()||void 0,eventClick:Ht(this.getAttribute("event-click")),eventActions:this.#S(),eventClassName:this.#v,eventBadges:this.#b,eventContext:r=>this.#d.get(r)??{previewEvent:r,index:-1},selectedEvent:this.#t,onEventOpen:r=>{this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#y(void 0,r,n)})),Ht(this.getAttribute("event-click"))==="modal"&&(this.#t=r,this.#e())},onEventClose:()=>{this.#t=void 0,this.#e()},onEventAction:(r,i)=>{let a=typeof r=="string"?r:"type"in r?r.type:r.id;this.dispatchEvent(new CustomEvent("ote-event-action",{detail:this.#y(a,i,n)}))}};if(Ro(this.#r,n),n.layout==="calendar"&&n.status==="loaded"){let r=ur(n);if(r.length>0){this.#T(r,n.lang);return}}this.#x()}async#T(e,n){this.#x();let r=++this.#f;try{let i=await import(new URL("./calendar-layout.js",import.meta.url).href);if(r!==this.#f||!this.isConnected)return;this.#E||(this.#s.textContent+=i.CALENDAR_CSS,this.#E=!0);let a=this.#r.querySelector(".calendar-host");if(!a)return;a.classList.remove("ec-dark","ec-auto-dark");let s=this.getAttribute("theme");s==="dark"?a.classList.add("ec-dark"):s!=="light"&&a.classList.add("ec-auto-dark"),a.replaceChildren(),this.#p=i.renderCalendar(a,e,{lang:n,...Ni(l=>this.getAttribute(l),this.#h),onEventClick:l=>{let c=Ht(this.getAttribute("event-click"));this.dispatchEvent(new CustomEvent("ote-event-open",{detail:this.#y(void 0,l)})),c==="link"&&l.link?window.open(l.link,"_blank","noopener"):c==="modal"&&(this.#t=l,this.#e())}})}catch(i){if(r!==this.#f||!this.isConnected)return;let a=this.#r.querySelector(".calendar-host");a&&(a.textContent=i instanceof Error?i.message:String(i))}}#S(){let e=Ci(this.getAttribute("event-actions")),n=this.#g;return typeof n=="function"?r=>[...e,...n(r)]:[...e,...n]}#y(e,n,r){let i=this.#d.get(n)??{previewEvent:n,index:-1},a=r?Kt(r).infoOf.get(n):void 0;return{...e?{action:e}:{},event:n,previewEvent:n,originalEvent:i.originalEvent,index:i.index,feed:i.feed,source:i.source,...a?{group:a}:{}}}#x(){this.#f++,this.#h=this.#p?.currentDate()??this.#h,this.#p?.destroy(),this.#p=void 0}};function Qt(t){return Array.isArray(t)?t:Array.isArray(t.events)?t.events:[]}async function nc(t){let e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}`);let n=await e.text();return{url:t,data:JSON.parse(n)}}function Do(t){return t instanceof Error?t.message:String(t)}function rc(t){return t.length===1?t[0].data:{events:t.flatMap(({url:e,data:n})=>{let r=Array.isArray(n)?void 0:xe(n.title);return Qt(n).map(i=>({...i,_feedUrl:xe(i._feedUrl)??e,...!xe(i._feedTitle)&&r?{_feedTitle:r}:{}}))})}}function xe(t){return typeof t=="string"&&t.trim()?t:void 0}function Po(t,e){let n=Qt(t)[0],r=Array.isArray(t)?void 0:xe(t.title??t._feedTitle),i={url:e??xe(n?._feedUrl),title:r??xe(n?._feedTitle)};return i.url||i.title?i:void 0}function Oo(t,e,n){let r=new WeakMap;return t.events.forEach((i,a)=>{let s=e[a],l={url:xe(s?._feedUrl)??n?.url,title:xe(s?._feedTitle)??n?.title};r.set(i,{previewEvent:i,originalEvent:s,index:a,feed:l.url||l.title?l:n,source:s?.source})}),r}function kr(){customElements.get("ote-events")||customElements.define("ote-events",br)}kr();export{kr as defineOteEvents};
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.5.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.5.0/LICENSE *)
  (*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE *)
*/
//# sourceMappingURL=ote-events.js.map
