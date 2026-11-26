function jn(e){return e!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function Li(e,t){let r=new Date(`${e}T00:00:00Z`);return r.setUTCDate(r.getUTCDate()+t),r.toISOString().slice(0,10)}var is=globalThis.process?.env?.NODE_ENV,m=is&&!is.toLowerCase().startsWith("prod");var lr=Array.isArray,os=Array.prototype.indexOf,cr=Array.prototype.includes,Xr=Array.from,Pi=Object.keys,Oe=Object.defineProperty,ht=Object.getOwnPropertyDescriptor,Fi=Object.getOwnPropertyDescriptors,Hi=Object.prototype,ss=Array.prototype,Kr=Object.getPrototypeOf,zi=Object.isExtensible;var ue=()=>{};function Xn(e){for(var t=0;t<e.length;t++)e[t]()}function Kn(){var e,t,r=new Promise((n,o)=>{e=n,t=o});return{promise:r,resolve:e,reject:t}}var st=Symbol("$state"),Zn=Symbol("component"),wn=Symbol("legacy props"),as=Symbol(""),Jn=Symbol("proxy path"),Qn=Symbol("attributes"),xn=Symbol("class"),En=Symbol("style"),kn=Symbol("text");var Ui=Symbol("hmr anchor"),dr=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},Bi=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml");var Zr=3,Dt=8;var yt={};var le=Symbol("uninitialized"),St=Symbol("filename");var ei="http://www.w3.org/1999/xhtml";var yr="font-weight: bold",br="font-weight: normal";function ls(e){m?console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${e}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,yr,br):console.warn("https://svelte.dev/e/await_reactivity_loss")}function cs(e,t){m?console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${e}\` (${t}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,yr,br):console.warn("https://svelte.dev/e/await_waterfall")}function ds(){m?console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,yr,br):console.warn("https://svelte.dev/e/derived_inert")}function fs(e,t,r){m?console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${e}\` attribute on \`${t}\` changed its value between server and client renders. The client value, \`${r}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,yr,br):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function Or(e){m?console.warn(`%c[svelte] hydration_mismatch
%c${e?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${e}`:"Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,yr,br):console.warn("https://svelte.dev/e/hydration_mismatch")}function us(){m?console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,yr,br):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function ti(e){m?console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${e}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,yr,br):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function ps(){m?console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",yr,br):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var A=!1;function ye(e){A=e}var L;function ie(e){if(e===null)throw Or(),yt;return L=e}function Ge(){return ie(We(L))}function re(e){if(A){if(We(L)!==null)throw Or(),yt;L=e}}function Vi(e=1){if(A){for(var t=e,r=L;t--;)r=We(r);L=r}}function zt(e=!0){for(var t=0,r=L;;){if(r.nodeType===Dt){var n=r.data;if(n==="]"){if(t===0)return r;t-=1}else(n==="["||n==="[!"||n[0]==="["&&!isNaN(Number(n.slice(1))))&&(t+=1)}var o=We(r);e&&r.remove(),r=o}}function wr(e){if(!e||e.nodeType!==Dt)throw Or(),yt;return e.data}function ri(e){return e===this.v}function Yi(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function ni(e){return!Yi(e,this.v)}function hs(e){if(m){let t=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${e}"
https://svelte.dev/e/invariant_violation`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invariant_violation")}function Tn(e){if(m){let t=new Error(`lifecycle_outside_component
\`${e}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function vs(){if(m){let e=new Error("set_context_after_init\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\nhttps://svelte.dev/e/set_context_after_init");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/set_context_after_init")}function _s(){if(m){let e=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/async_derived_orphan")}function ms(){if(m){let e=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/derived_references_self")}function qi(e,t,r){if(m){let n=new Error(`each_key_duplicate
${r?`Keyed each block has duplicate key \`${r}\` at indexes ${e} and ${t}`:`Keyed each block has duplicate key at indexes ${e} and ${t}`}
https://svelte.dev/e/each_key_duplicate`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function $s(e,t,r){if(m){let n=new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${e} was \`${t}\` but is now \`${r}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_volatile")}function ys(e){if(m){let t=new Error(`effect_in_teardown
\`${e}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function bs(){if(m){let e=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function ws(e){if(m){let t=new Error(`effect_orphan
\`${e}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_orphan")}function xs(){if(m){let e=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function Es(){if(m){let e=new Error("get_abort_signal_outside_reaction\n`getAbortSignal()` can only be called inside an effect or derived\nhttps://svelte.dev/e/get_abort_signal_outside_reaction");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/get_abort_signal_outside_reaction")}function ks(){if(m){let e=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/hydration_failed")}function Ts(){if(m){let e=new Error("invalid_snippet\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\nhttps://svelte.dev/e/invalid_snippet");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invalid_snippet")}function Cs(e){if(m){let t=new Error(`props_invalid_value
Cannot do \`bind:${e}={undefined}\` when \`${e}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_invalid_value")}function Ds(e){if(m){let t=new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${e}\` are readonly
https://svelte.dev/e/props_rest_readonly`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function Ss(e){if(m){let t=new Error(`rune_outside_svelte
The \`${e}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function Rs(){if(m){let e=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function As(){if(m){let e=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Ns(){if(m){let e=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function Os(){if(m){let e=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var Ie=!1,fr=!1,Ut=!1;var Cn=null;function oe(e,t){return e.label=t,oi(e.v,t),e}function oi(e,t){return e?.[Jn]?.(t),e}function tn(e){return typeof e=="symbol"?`Symbol(${e.description})`:typeof e=="function"?"<function>":typeof e=="object"&&e?"<object>":String(e)}function Bt(e){let t=new Error,r=Yl();return r.length===0?null:(r.unshift(`
`),Oe(t,"stack",{value:r.join(`
`)}),Oe(t,"name",{value:e}),t)}function Yl(){let e=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let t=new Error().stack;if(Error.stackTraceLimit=e,!t)return[];let r=t.split(`
`),n=[];for(let o=0;o<r.length;o++){let s=r[o],a=s.replaceAll("\\","/");if(s.trim()!=="Error"){if(s.includes("validate_each_keys"))return[];a.includes("svelte/src/internal")||a.includes("node_modules/.vite")||n.push(s)}}return n}function Ms(e,t){if(!m)throw new Error("invariant(...) was not guarded by if (DEV)");e||hs(t)}function ql(e){let t=e.p;for(;t!==null&&t.c===null;)t=t.p;return t?.c??null}function Gi(e,t){return e===null&&Tn(t),e.c??=new Map(ql(e)||void 0)}var G=null;function ur(e){G=e}var Vt=null;function rn(e){Vt=e}var Yt=null;function si(e){Yt=e}function xe(e){return Gi(G,"getContext").get(e)}function Dn(e,t){let r=Gi(G,"setContext");if(Ie){var n=S.f,o=!O&&(n&32)!==0&&!G.i;o||vs()}return r.set(e,t),t}function Xe(e,t=!1,r){G={p:G,i:!1,c:null,e:null,s:e,x:null,r:S,l:fr&&!t?{s:null,u:null,$:[]}:null},m&&(G.function=r,Yt=r)}function Ke(e){var t=G,r=t.e;if(r!==null){t.e=null;for(var n of r)Wi(n)}return e!==void 0&&(t.x=e),t.i=!0,G=t.p,m&&(Yt=G?.function??null),Sn(e)}function Sn(e={}){return Oe(e,Zn,{value:!0}),e}function tr(){return!fr||G!==null&&G.l===null}var Ir=[];function Ls(){var e=Ir;Ir=[],Xn(e)}function Ee(e){if(Ir.length===0&&!Mr){var t=Ir;queueMicrotask(()=>{t===Ir&&Ls()})}Ir.push(e)}function Ps(){for(;Ir.length>0;)Ls()}var Gl=-7169;function se(e,t){e.f=e.f&Gl|t}function nn(e){(e.f&512)!==0||e.deps===null?se(e,1024):se(e,4096)}function ai(e,t){(e.f&2048)!==0?t.set(e,2048):(e.f&4096)!==0&&t.get(e)!==2048&&t.set(e,4096),se(e,1024)}function Fs(e){return`{${e.toString().replace(/^async \(\) => /,"").replace(/^\(/,"").replace(/\$\.get\((.+?)\)/g,(t,r)=>r).replace(/\$\.track_reactivity_loss\((.+?)\)\(\)/g,(t,r)=>r).replace(/\)$/,"")}}`}function li(e,t){if(t){let r=document.body;e.autofocus=!0,Ee(()=>{document.activeElement===r&&e.focus()})}}function At(e){var t=O,r=S;ke(null),Le(null);try{return e()}finally{ke(t),Le(r)}}function ci(e,t,r,n){let o=tr()?kr:Pr;var s=e.filter(d=>!d.settled),a=t.map(o);if(m&&a.forEach((d,g)=>{d.label=t[g].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\$\.get\((.+?)\)/g,($,_)=>_)}),r.length===0&&s.length===0){n(a);return}var l=S,c=zs(),p=s.length===1?s[0].promise:s.length>1?Promise.all(s.map(d=>d.promise)):null;function v(d){if((l.f&16384)===0){c();try{n([...a,...d])}catch(g){gt(g,l)}on()}}var h=ji();if(r.length===0){p.then(()=>v([])).finally(h);return}function u(){Promise.all(r.map(d=>Ki(d))).then(v).catch(d=>gt(d,l)).finally(h)}p?p.then(()=>{if((l.f&16384)!==0){h();return}c(),u(),on()}):u()}function zs(){var e=S,t=O,r=G,n=P;if(m)var o=Vt;return function(a=!0){Le(e),ke(t),ur(r),a&&(e.f&16384)===0&&(n?.activate(),n?.apply()),m&&(Xi(null),rn(o))}}var jl=!1;function on(e=!0){jl=!1,Le(null),ke(null),ur(null),e&&P?.deactivate(),m&&(Xi(null),rn(null))}function ji(){var e=S,t=e.b,r=P,n=!!t?.is_rendered();return t?.update_pending_count(1,r),r.increment(n,e),()=>{t?.update_pending_count(-1,r),r.decrement(n,e)}}var _t=null;function Xi(e){_t=e}var Nn=new Set;function kr(e){var t=2050;S!==null&&(S.f|=524288);let r={ctx:G,deps:null,effects:null,equals:ri,f:t,fn:e,reactions:null,rv:0,v:le,wv:0,parent:S,ac:null};return m&&Ut&&(r.created=Bt("created at")),r}var sn=Symbol("obsolete");function Ki(e,t,r){let n=S;n===null&&_s();var o=void 0,s=Pe(le);m&&(s.label=t??Fs(e));var a=!O,l=new Set;return Vs(()=>{var c=S;m&&(_t={effect:c,effect_deps:new Set,warned:!1});var p=Kn();o=p.promise;try{Promise.resolve(e()).then(p.resolve,d=>{d!==dr&&p.reject(d)}).finally(on)}catch(d){p.reject(d),on()}if(m){if(_t){if(c.deps!==null)for(let d=0;d<at;d+=1)_t.effect_deps.add(c.deps[d]);if(Ue!==null)for(let d=0;d<Ue.length;d+=1)_t.effect_deps.add(Ue[d])}_t=null}var v=P;if(a){if((c.f&32768)!==0)var h=ji();if(n.b?.is_rendered())v.async_deriveds.get(c)?.reject(sn);else for(let d of l.values())d.reject(sn);l.add(p),v.async_deriveds.set(c,p)}let u=(d,g=void 0)=>{m&&(_t=null),h?.(),l.delete(p),g!==sn&&(v.activate(),g?(s.f|=8388608,Gt(s,g)):((s.f&8388608)!==0&&(s.f^=8388608),m&&r!==void 0&&!s.equals(d)&&(Nn.add(s),setTimeout(()=>{Nn.has(s)&&(c.f&16384)===0&&(cs(s.label,r),Nn.delete(s))})),Gt(s,d)),v.deactivate())};p.promise.then(u,d=>u(null,d||"unknown"))}),Je(()=>{for(let c of l)c.reject(sn)}),m&&(s.f|=4194304),new Promise(c=>{function p(v){function h(){v===o?c(s):p(o)}v.then(h,h)}p(o)})}function f(e){let t=kr(e);return Ie||ui(t),t}function Pr(e){let t=kr(e);return t.equals=ni,t}function Us(e){var t=e.effects;if(t!==null){e.effects=null;for(var r=0;r<t.length;r+=1)ge(t[r])}}var Zi=[];function On(e){var t,r=S,n=e.parent;if(!wt&&n!==null&&e.v!==le&&(n.f&24576)!==0)return ds(),e.v;if(Le(n),m){let o=Fr;di(new Set);try{cr.call(Zi,e)&&ms(),Zi.push(e),Us(e),t=fi(e)}finally{Le(r),di(o),Zi.pop()}}else try{Us(e),t=fi(e)}finally{Le(r)}return t}function Ji(e){var t=On(e);if(!e.equals(t)&&(e.wv=an(),(!P?.is_fork||e.deps===null)&&(P!==null?(P.capture(e,t,!0),Wt?.capture(e,t,!0)):e.v=t,e.deps===null))){se(e,1024);return}wt||(Be!==null?(xr()||P?.is_fork)&&Be.set(e,t):nn(e))}function Bs(e){if(e.effects!==null)for(let t of e.effects)(t.teardown||t.ac)&&(t.teardown?.(),t.ac!==null&&At(()=>{t.ac.abort(dr),t.ac=null}),t.fn!==null&&(t.teardown=ue),Hr(t,0),In(t))}function Qi(e){if(e.effects!==null)for(let t of e.effects)t.teardown&&t.fn!==null&&rr(t)}var pi=null,ln=null,P=null,Wt=null,Be=null,ro=null,Mr=!1,eo=!1,cn=null,Mn=null,Ys=0,to=new Set,Zl=1,xt=class e{id=Zl++;started=!1;linked=!0;prev=null;next=null;async_deriveds=new Map;current=new Map;previous=new Map;#e=new Set;#t=new Set;#r=0;#n=new Map;#i=null;#o=[];#a=[];#s=new Map;#l=new Map;#d=new Set;is_fork=!1;#c=!1;constructor(){ln===null?pi=ln=this:(ln.next=this,this.prev=ln),ln=this}#v(){if(this.is_fork)return!0;for(let t of this.#n.keys())if(!this.#m(t))return!0;return!1}#m(t){for(var r=t;r!==null;r=r.parent)if(this.#l.has(r))return!0;return!1}skip_effect(t){this.#l.has(t)||this.#l.set(t,{d:[],m:[]}),this.#d.delete(t)}unskip_effect(t,r=n=>this.schedule(n)){var n=this.#l.get(t);if(n){this.#l.delete(t);for(var o of n.d)se(o,2048),r(o);for(o of n.m)se(o,4096),r(o)}this.#d.add(t)}#f(){var t=[];for(let s of this.#o)if(!((s.f&16384)!==0||(s.f&6144)===0)){for(var r=s,n=!1;r.parent!==null;){r=r.parent;var o=r.f;if((o&96)!==0){if((o&1024)===0){n=!0;break}r.f^=1024}}n||t.push(r)}return this.#o=[],t}#g(){if(this.started=!0,m)for(let l of this.current.keys())to.add(l);for(let[l,c]of this.#s)se(l,c),this.schedule(l);this.apply();for(var t=cn=[],r=[],n=Mn=[];this.#o.length>0;){Ys++>1e3&&(this.#p(),Jl());for(let l of this.#f())try{this.#$(l,t,r)}catch(c){throw js(l),this.#v()||this.discard(),c}}if(P=null,n.length>0){var o=e.ensure();for(let l of n)o.schedule(l)}if(cn=null,Mn=null,this.#v()){this.#h(r),this.#h(t);for(let[l,c]of this.#l)Ws(l,c);n.length>0&&P.#g();return}let s=this.#b();if(s){this.#h(r),this.#h(t),s.#u(this);return}this.#s.clear();for(let l of this.#e)l(this);this.#e.clear(),Wt=this,qs(r),qs(t),Wt=null,this.#i?.resolve();var a=P;this.#r===0&&(this.#o.length===0||a!==null)&&(this.#p(),Ie&&(this.#y(),P=a)),a!==null&&(Ot.clear(),a.#g())}#$(t,r,n){t.f^=1024;for(var o=t.first;o!==null;){var s=o.f,a=(s&96)!==0,l=a&&(s&1024)!==0,c=l||(s&8192)!==0||this.#l.has(o);if(!c&&o.fn!==null){a?o.f^=1024:(s&4)!==0?r.push(o):Ie&&(s&16777224)!==0?n.push(o):Cr(o)&&((s&16)!==0&&this.add_dirty_reaction(o,4096),rr(o));var p=o.first;if(p!==null){o=p;continue}}for(;o!==null;){var v=o.next;if(v!==null){o=v;break}o=o.parent}}}#b(){for(var t=this.prev;t!==null;t=t.prev)if(!t.is_fork&&this.#_(t))return t;return null}#_(t){for(let[r,[,n]]of this.current)if(!n&&t.current.has(r))return!0;return!1}#u(t){for(let[n,o]of t.current)!this.previous.has(n)&&t.previous.has(n)&&this.previous.set(n,t.previous.get(n)),this.current.set(n,o);for(let[n,o]of t.async_deriveds){let s=this.async_deriveds.get(n);s&&o.promise.then(s.resolve).catch(s.reject)}t.async_deriveds.clear(),this.transfer_reactions(t.#s);let r=n=>{var o=n.reactions;if(o!==null&&!((n.f&2)!==0&&(n.f&6144)===0))for(let l of o){var s=l.f;if((s&2)!==0)r(l);else{var a=l;s&4194320&&!this.async_deriveds.has(a)&&(this.#s.delete(a),se(a,2048),this.schedule(a))}}};for(let n of this.current.keys())r(n);this.oncommit(()=>t.discard()),t.#p(),P=this,this.#g()}#h(t){for(var r=0;r<t.length;r+=1)ai(t[r],this.#s)}capture(t,r,n=!1){t.v!==le&&!this.previous.has(t)&&this.previous.set(t,t.v),(t.f&8388608)===0&&(this.current.set(t,[r,n]),Be?.set(t,r)),this.is_fork||(t.v=r)}activate(){P=this}deactivate(){P=null,Be=null}flush(){try{m&&to.clear(),eo=!0,P=this,this.#g()}finally{if(Ys=0,ro=null,cn=null,Mn=null,eo=!1,P=null,Be=null,Ot.clear(),m)for(let t of to)t.updated=null}}discard(){for(let t of this.#t)t(this);this.#t.clear();for(let t of this.async_deriveds.values())t.reject(sn);this.#p(),this.#i?.resolve()}register_created_effect(t){this.#a.push(t)}#y(){for(let h=pi;h!==null;h=h.next){var t=h.id<this.id,r=[];for(let[u,[d,g]]of this.current){if(h.current.has(u)){var n=h.current.get(u)[0];if(t&&d!==n)h.current.set(u,[d,g]);else continue}r.push(u)}if(t)for(let[u,d]of this.async_deriveds){let g=h.async_deriveds.get(u);g&&d.promise.then(g.resolve).catch(g.reject)}var o=[...h.current.keys()].filter(u=>!h.current.get(u)[1]);if(!(!h.started||o.length===0)){var s=o.filter(u=>!this.current.has(u));if(s.length===0)t&&h.discard();else if(r.length>0){if(m&&!h.#c&&Ms(h.#o.length===0,"Batch has scheduled effects"),t)for(let u of this.#d)h.unskip_effect(u,d=>{(d.f&4194320)!==0?h.schedule(d):h.#h([d])});h.activate();var a=new Set,l=new Map;for(var c of r)Gs(c,s,a,l);l=new Map;var p=[...h.current].filter(([u,d])=>{let g=this.current.get(u);return g?g[0]!==d[0]||g[1]!==d[1]:!0}).map(([u])=>u);if(p.length>0)for(let u of this.#a)(u.f&155648)===0&&no(u,p,l)&&((u.f&4194320)!==0?(se(u,2048),h.schedule(u)):h.add_dirty_reaction(u,2048));if(h.#o.length>0&&!h.#c){h.apply();for(var v of h.#f())h.#$(v,[],[])}h.deactivate()}}}}increment(t,r){if(this.#r+=1,t){let n=this.#n.get(r)??0;this.#n.set(r,n+1)}}decrement(t,r){if(this.#r-=1,t){let n=this.#n.get(r)??0;n===1?this.#n.delete(r):this.#n.set(r,n-1)}this.#c||(this.#c=!0,Ee(()=>{this.#c=!1,this.linked&&this.flush()}))}transfer_reactions(t){for(let[r,n]of t)this.add_dirty_reaction(r,n);t.clear()}add_dirty_reaction(t,r){(r===2048||this.#s.get(t)!==2048)&&this.#s.set(t,r)}oncommit(t){this.#e.add(t)}ondiscard(t){this.#t.add(t)}settled(){return(this.#i??=Kn()).promise}static ensure(){if(P===null){let t=P=new e;!eo&&!Mr&&Ee(()=>{t.started||t.flush()})}return P}apply(){if(!Ie||!this.is_fork&&this.prev===null&&this.next===null){Be=null;return}Be=new Map;for(let[t,[r]]of this.current)Be.set(t,r);for(let t=pi;t!==null;t=t.next)if(!(t===this||t.is_fork)&&(t.id>=this.id||!t.#_(this)))for(let[r,n]of t.previous)Be.has(r)||Be.set(r,n)}schedule(t){if(ro=t,t.b?.is_pending&&(t.f&16777228)!==0&&(t.f&32768)===0){t.b.defer_effect(t);return}this.#o.push(t)}#p(){if(this.linked){var t=this.prev,r=this.next;t===null?pi=r:t.next=r,r===null?ln=t:r.prev=t,this.linked=!1}}};function Tr(e){var t=Mr,r=Wt;Wt=null,Mr=!0;try{var n;for(e&&(Tr(),n=e());;){if(Ps(),P===null)return n;P.flush()}}finally{Mr=t,Wt=r}}function Jl(){if(m){var e=new Map;for(let r of P.current.keys())for(let[n,o]of r.updated??[]){var t=e.get(n);t||(t={error:o.error,count:0},e.set(n,t)),t.count+=o.count}for(let r of e.values())r.error&&console.error(r.error)}try{xs()}catch(r){m&&Oe(r,"stack",{value:""}),gt(r,ro)}}var Nt=null;function qs(e){var t=e.length;if(t!==0){for(var r=0;r<t;){var n=e[r++];if((n.f&24576)===0&&Cr(n)&&(Nt=new Set,rr(n),n.deps===null&&n.first===null&&n.nodes===null&&n.teardown===null&&n.ac===null&&io(n),Nt?.size>0)){Ot.clear();for(let o of Nt){if((o.f&24576)!==0)continue;let s=[o],a=o.parent;for(;a!==null;)Nt.has(a)&&(Nt.delete(a),s.push(a)),a=a.parent;for(let l=s.length-1;l>=0;l--){let c=s[l];(c.f&24576)===0&&rr(c)}}Nt.clear()}}Nt=null}}function Gs(e,t,r,n){if(!r.has(e)&&(r.add(e),e.reactions!==null))for(let o of e.reactions){let s=o.f;(s&2)!==0?Gs(o,t,r,n):(s&4194320)!==0&&(s&2048)===0&&no(o,t,n)&&(se(o,2048),Ln(o))}}function no(e,t,r){let n=r.get(e);if(n!==void 0)return n;if(e.deps!==null)for(let o of e.deps){if(cr.call(t,o))return!0;if((o.f&2)!==0&&no(o,t,r))return r.set(o,!0),!0}return r.set(e,!1),!1}function Ln(e){P.schedule(e)}function Ws(e,t){if(!((e.f&32)!==0&&(e.f&1024)!==0)){(e.f&2048)!==0?t.d.push(e):(e.f&4096)!==0&&t.m.push(e),se(e,1024);for(var r=e.first;r!==null;)Ws(r,t),r=r.next}}function js(e){se(e,1024);for(var t=e.first;t!==null;)js(t),t=t.next}var Fr=new Set,Ot=new Map;function di(e){Fr=e}var so=!1;function Ks(){so=!0}function Pe(e,t){var r={f:0,v:e,reactions:null,equals:ri,rv:0,wv:0};return m&&Ut&&(r.created=t??Bt("created at"),r.updated=null,r.set_during_effect=!1,r.trace=null),r}function F(e,t){let r=Pe(e,t);return ui(r),r}function Br(e,t=!1,r=!0){let n=Pe(e);return t||(n.equals=ni),fr&&r&&G!==null&&G.l!==null&&(G.l.s??=[]).push(n),n}function b(e,t,r=!1){O!==null&&(!lt||(O.f&131072)!==0)&&tr()&&(O.f&4325394)!==0&&(jt===null||!jt.has(e))&&Ns();let n=r?Ce(t):t;return m&&oi(n,e.label),Gt(e,n,Mn)}var Ur=null,oo=0;function Gt(e,t,r=null){if(!e.equals(t)){wt?Ot.set(e,t):Ot.has(e)||Ot.set(e,e.v);var n=xt.ensure();if(n.capture(e,t),m){if(Ut||S!==null){e.updated??=new Map;let o=(e.updated.get("")?.count??0)+1;if(e.updated.set("",{error:null,count:o}),Ut||o>5){let s=Bt("updated at");if(s!==null){let a=e.updated.get(s.stack);a||(a={error:s,count:0},e.updated.set(s.stack,a)),a.count++}}}S!==null&&(e.set_during_effect=!0)}if((e.f&2)!==0){let o=e;(e.f&2048)!==0&&On(o),Be===null&&nn(o)}e.wv=an(),Ur=null,oo=0,Zs(e,2048,r),Ur=null,tr()&&S!==null&&(S.f&1024)!==0&&(S.f&96)===0&&(Et===null?Js([e]):Et.push(e)),!n.is_fork&&Fr.size>0&&!so&&hi()}return t}function hi(){so=!1;for(let e of Fr){(e.f&1024)!==0&&se(e,4096);let t;try{t=Cr(e)}catch{t=!0}t&&rr(e)}Fr.clear()}function Te(e){b(e,e.v+1)}function Zs(e,t,r){var n=e.reactions;if(n!==null){var o=tr(),s=n.length;if(oo+=s,oo>1e5&&Ur===null&&(Ur=new Set),Ur!==null){if(Ur.has(e))return;Ur.add(e)}for(var a=0;a<s;a++){var l=n[a],c=l.f;if(!(!o&&l===S)){var p=(c&2048)===0;if(p&&se(l,t),(c&131072)!==0)Fr.add(l);else if((c&2)!==0){var v=l;Be?.delete(v),Zs(v,4096,r)}else if(p){var h=l;(c&16)!==0&&Nt!==null&&Nt.add(h),r!==null?r.push(h):Ln(h)}}}}}var ec=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function Ce(e){if(typeof e!="object"||e===null||st in e||Zn in e)return e;let t=Kr(e);if(t!==Hi&&t!==ss)return e;var r=new Map,n=lr(e),o=F(0),s=m&&Ut?Bt("created at"):null,a=It,l=h=>{if(It===a)return h();var u=O,d=It;ke(null),ao(a);var g=h();return ke(u),ao(d),g};n&&(r.set("length",F(e.length,s)),m&&(e=rc(e)));var c="";let p=!1;function v(h){if(!p){p=!0,c=h,oe(o,`${c} version`);for(let[u,d]of r)oe(d,Vr(c,u));p=!1}}return new Proxy(e,{defineProperty(h,u,d){(!("value"in d)||d.configurable===!1||d.enumerable===!1||d.writable===!1)&&Rs();var g=r.get(u);return g===void 0?l(()=>{var $=F(d.value,s);return r.set(u,$),m&&typeof u=="string"&&oe($,Vr(c,u)),$}):b(g,d.value,!0),!0},deleteProperty(h,u){var d=r.get(u);if(d===void 0){if(u in h){let g=l(()=>F(le,s));r.set(u,g),Te(o),m&&oe(g,Vr(c,u))}}else b(d,le),Te(o);return!0},get(h,u,d){if(u===st)return e;if(m&&u===Jn)return v;var g=r.get(u),$=u in h;if(g===void 0&&(!$||ht(h,u)?.writable)&&(g=l(()=>{var y=Ce($?h[u]:le),w=F(y,s);return m&&oe(w,Vr(c,u)),w}),r.set(u,g)),g!==void 0){var _=i(g);return _===le?void 0:_}return Reflect.get(h,u,d)},getOwnPropertyDescriptor(h,u){this.has?.(h,u);var d=Reflect.getOwnPropertyDescriptor(h,u),g=r.get(u);if(g!==void 0){var $=i(g);if($===le)return;if(d&&"value"in d)d.value=$;else return{enumerable:!0,configurable:!0,value:$,writable:!0}}return d},has(h,u){if(u===st)return!0;var d=r.get(u),g=d!==void 0&&d.v!==le||Reflect.has(h,u);if(d!==void 0||(S!==null||O!==null)&&(!g||ht(h,u)?.writable)){d===void 0&&(d=l(()=>{var _=g?Ce(h[u]):le,y=F(_,s);return m&&oe(y,Vr(c,u)),y}),r.set(u,d));var $=i(d);if($===le)return!1}return g},set(h,u,d,g){var $=r.get(u),_=u in h;if(n&&u==="length")for(var y=d;y<$.v;y+=1){var w=r.get(y+"");w!==void 0?b(w,le):y in h&&(w=l(()=>F(le,s)),r.set(y+"",w),m&&oe(w,Vr(c,y)))}if($===void 0)(!_||ht(h,u)?.writable)&&($=l(()=>F(void 0,s)),m&&oe($,Vr(c,u)),b($,Ce(d)),r.set(u,$));else{_=$.v!==le;var k=l(()=>Ce(d));b($,k)}var x=Reflect.getOwnPropertyDescriptor(h,u);if(x?.set&&x.set.call(g,d),!_){if(n&&typeof u=="string"){var C=r.get("length"),E=Number(u);Number.isInteger(E)&&E>=C.v&&b(C,E+1)}Te(o)}return!0},ownKeys(h){i(o);var u=Reflect.ownKeys(h).filter($=>{var _=r.get($);return _===void 0||_.v!==le});for(var[d,g]of r)g.v!==le&&!(d in h)&&u.push(d);return u},setPrototypeOf(){As()}})}function Vr(e,t){return typeof t=="symbol"?`${e}[Symbol(${t.description??""})]`:ec.test(t)?`${e}.${t}`:/^\d+$/.test(t)?`${e}[${t}]`:`${e}['${t}']`}function vi(e){try{if(e!==null&&typeof e=="object"&&st in e)return e[st]}catch{}return e}var tc=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function rc(e){return new Proxy(e,{get(t,r,n){var o=Reflect.get(t,r,n);return tc.has(r)?function(...s){Ks();var a=o.apply(this,s);return hi(),a}:o}})}function Qs(){let e=Array.prototype,t=Array.__svelte_cleanup;t&&t();let{indexOf:r,lastIndexOf:n,includes:o}=e;e.indexOf=function(s,a){let l=r.call(this,s,a);if(l===-1){for(let c=a??0;c<this.length;c+=1)if(vi(this[c])===s){ti("array.indexOf(...)");break}}return l},e.lastIndexOf=function(s,a){let l=n.call(this,s,a??this.length-1);if(l===-1){for(let c=0;c<=(a??this.length-1);c+=1)if(vi(this[c])===s){ti("array.lastIndexOf(...)");break}}return l},e.includes=function(s,a){let l=o.call(this,s,a);if(!l){for(let c=0;c<this.length;c+=1)if(vi(this[c])===s){ti("array.includes(...)");break}}return l},Array.__svelte_cleanup=()=>{e.indexOf=r,e.lastIndexOf=n,e.includes=o}}var gi,ea,Pn,ta,ra;function _i(){if(gi===void 0){gi=window,ea=document,Pn=/Firefox/.test(navigator.userAgent);var e=Element.prototype,t=Node.prototype,r=Text.prototype;ta=ht(t,"firstChild").get,ra=ht(t,"nextSibling").get,zi(e)&&(e[xn]=void 0,e[Qn]=null,e[En]=void 0,e.__e=void 0),zi(r)&&(r[kn]=void 0),m&&(e.__svelte_meta=null,Qs())}}function De(e=""){return document.createTextNode(e)}function Ze(e){return ta.call(e)}function We(e){return ra.call(e)}function pe(e,t){if(!A)return Ze(e);var r=Ze(L);if(r===null)r=L.appendChild(De());else if(t&&r.nodeType!==Zr){var n=De();return r?.before(n),ie(n),n}return t&&$i(r),ie(r),r}function Se(e,t=!1){if(!A){var r=Ze(e);return r instanceof Comment&&r.data===""?We(r):r}if(t){if(L?.nodeType!==Zr){var n=De();return L?.before(n),ie(n),n}$i(L)}return L}function dn(e,t=!1){if(!A)return Ze(e);var r=pe(e,t);return re(e),r}function rt(e,t=1,r=!1){let n=A?L:e;for(var o;t--;)o=n,n=We(n);if(!A)return n;if(r){if(n?.nodeType!==Zr){var s=De();return n===null?o?.after(s):n.before(s),ie(s),s}$i(n)}return ie(n),n}function An(e){e.textContent=""}function mi(){if(!Ie||Nt!==null)return!1;var e=S.f;return(e&32768)!==0}function nr(e,t,r){return t==null||t===ei?r?document.createElement(e,{is:r}):document.createElement(e):r?document.createElementNS(t,e,{is:r}):document.createElementNS(t,e)}function $i(e){if(e.nodeValue.length<65536)return;let t=e.nextSibling;for(;t!==null&&t.nodeType===Zr;)t.remove(),e.nodeValue+=t.nodeValue,t=e.nextSibling}var lo=new WeakMap;function na(e){var t=S;if(t===null)return O.f|=8388608,e;if(m&&e instanceof Error&&!lo.has(e)&&lo.set(e,nc(e,t)),(t.f&32768)===0&&(t.f&4)===0)throw m&&!t.parent&&e instanceof Error&&ia(e),e;gt(e,t)}function gt(e,t){if(e===yt)throw e;if(!(t!==null&&(t.f&16384)!==0)){for(;t!==null;){if((t.f&128)!==0&&(t.f&33570816)===0){if((t.f&32768)===0)throw e;try{t.b.error(e);return}catch(r){e=r}}t=t.parent}throw m&&e instanceof Error&&ia(e),e}}function nc(e,t){let r=ht(e,"message");if(!(r&&!r.configurable)){for(var n=Pn?"  ":"	",o=`
${n}in ${t.fn?.name||"<unknown>"}`,s=t.ctx;s!==null;)o+=`
${n}in ${s.function?.[St].split("/").pop()}`,s=s.p;return{message:e.message+`
${o}
`,stack:e.stack?.split(`
`).filter(a=>!a.includes("svelte/src/internal")).join(`
`)}}}function ia(e){let t=lo.get(e);t&&(Oe(e,"message",{value:t.message}),Oe(e,"stack",{value:t.stack}))}function uo(e){S===null&&(O===null&&ws(e),bs()),wt&&ys(e)}function ic(e,t){var r=t.last;r===null?t.last=t.first=e:(r.next=e,e.prev=r,t.last=e)}function Mt(e,t){var r=S;if(m)for(;r!==null&&(r.f&131072)!==0;)r=r.parent;r!==null&&(r.f&8192)!==0&&(e|=8192);var n={ctx:G,deps:null,nodes:null,f:e|2048|512,first:null,fn:t,last:null,next:null,parent:r,b:r&&r.b,prev:null,teardown:null,wv:0,ac:null};m&&(n.component_function=Yt),P?.register_created_effect(n);var o=n;if((e&4)!==0)cn!==null?cn.push(n):xt.ensure().schedule(n);else if(t!==null){try{rr(n)}catch(a){throw ge(n),a}o.deps===null&&o.teardown===null&&o.nodes===null&&o.first===o.last&&(o.f&524288)===0&&(o=o.first,(e&16)!==0&&(e&65536)!==0&&o!==null&&(o.f|=65536))}if(o!==null&&(o.parent=r,r!==null&&ic(o,r),O!==null&&(O.f&2)!==0&&(e&64)===0)){var s=O;(s.effects??=[]).push(o)}return n}function xr(){return O!==null&&!lt}function Je(e){let t=Mt(8,null);return se(t,1024),t.teardown=e,t}function $t(e){uo("$effect"),m&&Oe(e,"name",{value:"$effect"});var t=S.f,r=!O&&(t&32)!==0&&G!==null&&!G.i;if(r){var n=G;(n.e??=[]).push(e)}else return Wi(e)}function Wi(e){return Mt(1048580,e)}function ir(e){return uo("$effect.pre"),m&&Oe(e,"name",{value:"$effect.pre"}),Mt(1048584,e)}function po(e){xt.ensure();let t=Mt(524352,e);return()=>{ge(t)}}function aa(e){xt.ensure();let t=Mt(524352,e);return(r={})=>new Promise(n=>{r.outro?or(t,()=>{ge(t),n(void 0)}):(ge(t),n(void 0))})}function kt(e){return Mt(4,e)}function Vs(e){return Mt(4718592,e)}function nt(e,t=0){return Mt(8|t,e)}function fe(e,t=[],r=[],n=[]){ci(n,t,r,o=>{Mt(8,()=>{e(...o.map(i))})})}function dt(e,t=0){var r=Mt(16|t,e);return m&&(r.dev_stack=Vt),r}function ho(e,t=0){var r=Mt(16777216|t,e);return m&&(r.dev_stack=Vt),r}function Re(e){return Mt(524320,e)}function vo(e){var t=e.teardown;if(t!==null){let r=wt,n=O;co(!0),ke(null);try{t.call(null)}catch(o){gt(o,e.parent)}finally{co(r),ke(n)}}}function In(e,t=!1){var r=e.first;for(e.first=e.last=null;r!==null;){let o=r.ac;o!==null&&At(()=>{o.abort(dr)});var n=r.next;(r.f&64)!==0?r.parent=null:ge(r,t),r=n}}function la(e){for(var t=e.first;t!==null;){var r=t.next;(t.f&32)===0&&ge(t),t=r}}function ge(e,t=!0){var r=!1;(t||(e.f&262144)!==0)&&e.nodes!==null&&e.nodes.end!==null&&(ca(e.nodes.start,e.nodes.end),r=!0),e.f|=33554432,In(e,t&&!r),Hr(e,0);var n=e.nodes&&e.nodes.t;if(n!==null)for(let s of n)s.stop();vo(e),e.f^=33554432,e.f|=16384;var o=e.parent;o!==null&&o.first!==null&&io(e),m&&(e.component_function=null),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes=e.ac=e.b=null}function ca(e,t){for(;e!==null;){var r=e===t?null:We(e);e.remove(),e=r}}function io(e){var t=e.parent,r=e.prev,n=e.next;r!==null&&(r.next=n),n!==null&&(n.prev=r),t!==null&&(t.first===e&&(t.first=n),t.last===e&&(t.last=r))}function or(e,t,r=!0){var n=[];e.f|=256,da(e,n,!0);var o=()=>{r&&ge(e),t&&t()},s=n.length;if(s>0){var a=()=>--s||o();for(var l of n)l.out(a)}else o()}function da(e,t,r){if((e.f&8192)===0){e.f^=8192;var n=e.nodes&&e.nodes.t;if(n!==null)for(let l of n)(l.is_global||r)&&t.push(l);for(var o=e.first;o!==null;){var s=o.next;if((o.f&64)===0){var a=(o.f&65536)!==0||(o.f&32)!==0&&(e.f&16)!==0;da(o,t,a?r:!1)}o=s}}}function fn(e){e.f&=-257,fa(e,!0)}function fa(e,t){if((e.f&256)===0&&(e.f&8192)!==0){e.f^=8192,(e.f&1024)===0&&(se(e,2048),xt.ensure().schedule(e));for(var r=e.first;r!==null;){var n=r.next,o=(r.f&65536)!==0||(r.f&32)!==0;fa(r,o?t:!1),r=n}var s=e.nodes&&e.nodes.t;if(s!==null)for(let a of s)(a.is_global||t)&&a.in()}}function un(e,t){if(e.nodes)for(var r=e.nodes.start,n=e.nodes.end;r!==null;){var o=r===n?null:We(r);t.append(r),r=o}}var ua=null;var wt=!1;function co(e){wt=e}var O=null,lt=!1;function ke(e){O=e}var S=null;function Le(e){S=e}var jt=null;function ui(e){O!==null&&(!Ie&&(O.f&2097152)!==0||(O.f&2)!==0)&&(jt??=new Set).add(e)}var Ue=null,at=0,Et=null;function Js(e){Et=e}var ha=1,Yr=0,It=Yr;function ao(e){It=e}function an(){return++ha}function Cr(e){var t=e.f;if((t&2048)!==0)return!0;if((t&4096)!==0){for(var r=e.deps,n=r.length,o=0;o<n;o++){var s=r[o];if(Cr(s)&&Ji(s),s.wv>e.wv)return!0}(t&512)!==0&&Be===null&&se(e,1024)}return!1}function va(e,t,r=!0){var n=e.reactions;if(n!==null&&!(!Ie&&jt!==null&&jt.has(e)))for(var o=0;o<n.length;o++){var s=n[o];(s.f&2)!==0?va(s,t,!1):t===s&&(r?se(s,2048):(s.f&1024)!==0&&se(s,4096),Ln(s))}}function fi(e){var t=Ue,r=at,n=Et,o=O,s=jt,a=G,l=lt,c=It,p=e.f;Ue=null,at=0,Et=null,O=(p&96)===0?e:null,jt=null,ur(e.ctx),lt=!1,It=++Yr,e.ac!==null&&(At(()=>{e.ac.abort(dr)}),e.ac=null);try{e.f|=2097152;var v=e.fn,h=v();e.f|=32768;var u=pa(e);if(tr()&&Et!==null&&!lt&&u!==null&&(e.f&6146)===0)for(var d=0;d<Et.length;d++)va(Et[d],e);if(o!==null&&o!==e){if(Yr++,o.deps!==null)for(let g=0;g<r;g+=1)o.deps[g].rv=Yr;if(t!==null)for(let g of t)g.rv=Yr;Et!==null&&(n===null?n=Et:n.push(...Et))}return(e.f&8388608)!==0&&(e.f^=8388608),h}catch(g){return pa(e),na(g)}finally{e.f^=2097152,Ue=t,at=r,Et=n,O=o,jt=s,ur(a),lt=l,It=c}}function pa(e){var t=e.deps,r=P?.is_fork;if(Ue!==null){var n;if(r||Hr(e,at),t!==null&&at>0)for(t.length=at+Ue.length,n=0;n<Ue.length;n++)t[at+n]=Ue[n];else e.deps=t=Ue;if(xr()&&(e.f&512)!==0)for(n=at;n<t.length;n++)(t[n].reactions??=[]).push(e)}else!r&&t!==null&&at<t.length&&(Hr(e,at),t.length=at);return t}function oc(e,t){let r=t.reactions;if(r!==null){var n=os.call(r,e);if(n!==-1){var o=r.length-1;o===0?r=t.reactions=null:(r[n]=r[o],r.pop())}}if(r===null&&(t.f&2)!==0&&(Ue===null||!cr.call(Ue,t))){var s=t;(s.f&512)!==0&&(s.f^=512),s.v!==le&&nn(s),s.ac!==null&&At(()=>{s.ac.abort(dr),s.ac=null,se(s,2048)}),Bs(s),Hr(s,0)}}function Hr(e,t){var r=e.deps;if(r!==null)for(var n=t;n<r.length;n++)oc(e,r[n])}function rr(e){var t=e.f;if((t&16384)===0){se(e,1024);var r=S;if(S=e,m){var n=Yt;si(e.component_function);var o=Vt;rn(e.dev_stack??Vt)}try{(t&16777232)!==0?la(e):In(e),vo(e);var s=fi(e);if(e.teardown=typeof s=="function"?s:null,e.wv=ha,m&&Ut&&(e.f&2048)!==0&&e.deps!==null)for(var a of e.deps)a.set_during_effect&&(a.wv=an(),a.set_during_effect=!1)}finally{S=r,m&&(si(n),rn(o))}}}async function gr(){if(Ie)return new Promise(e=>{requestAnimationFrame(()=>e()),setTimeout(()=>e())});await Promise.resolve(),Tr()}function i(e){var t=e.f,r=(t&2)!==0;if(ua?.add(e),O!==null&&!lt){var n=S!==null&&(S.f&16384)!==0;if(!n&&(jt===null||!jt.has(e))){var o=O.deps;if((O.f&2097152)!==0)e.rv<Yr&&(e.rv=Yr,Ue===null&&o!==null&&o[at]===e?at++:Ue===null?Ue=[e]:Ue.push(e));else{O.deps??=[],cr.call(O.deps,e)||O.deps.push(e);var s=e.reactions;s===null?e.reactions=[O]:cr.call(s,O)||s.push(O)}}}if(m){if(!lt&&_t&&P===null&&Wt===null&&!_t.warned&&(_t.effect.f&2097152)===0&&!_t.effect_deps.has(e)){_t.warned=!0,ls(e.label);var a=Bt("traced at");a&&console.warn(a)}if(Nn.delete(e),Ut&&!lt&&Cn!==null&&O!==null&&Cn.reaction===O){if(e.trace)e.trace();else if(a=Bt("traced at"),a){var l=Cn.entries.get(e);l===void 0&&(l={traces:[]},Cn.entries.set(e,l));var c=l.traces[l.traces.length-1];a.stack!==c?.stack&&l.traces.push(a)}}}if(wt&&Ot.has(e))return Ot.get(e);if(r){var p=e;if(wt){var v=p.v;return((p.f&1024)===0&&p.reactions!==null||_a(p))&&(v=On(p)),Ot.set(p,v),v}var h=(p.f&512)===0&&!lt&&O!==null&&(O.f&512)!==0,u=(p.f&32768)===0;Cr(p)&&(h&&(p.f|=512),Ji(p)),h&&!u&&(Qi(p),ga(p))}if(Be?.has(e))return Be.get(e);if((e.f&8388608)!==0)throw e.v;return e.v}function ga(e){if(e.f|=512,e.deps!==null)for(let r of e.deps){var t=r.reactions;t===null?r.reactions=[e]:cr.call(t,e)||t.push(e),(r.f&2)!==0&&(r.f&512)===0&&(Qi(r),ga(r))}}function _a(e){if(e.v===le)return!0;if(e.deps===null)return!1;for(let t of e.deps)if(Ot.has(t)||(t.f&2)!==0&&_a(t))return!0;return!1}function D(e){var t=lt;try{return lt=!0,e()}finally{lt=t}}var ac=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var bg=[...ac,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var lc=["touchstart","touchmove"];function ma(e){return lc.includes(e)}var cc=["$state","$state.raw","$derived","$derived.by"],wg=[...cc,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];var Hn=Symbol("events"),mo=new Set,yi=new Set;function ba(e,t,r,n={}){function o(s){if(n.capture||bi.call(t,s),!s.cancelBubble)return At(()=>r?.call(this,s))}return e.startsWith("pointer")||e.startsWith("touch")||e==="wheel"?(o.__removed=!1,Ee(()=>{o.__removed||t.addEventListener(e,o,n)})):t.addEventListener(e,o,n),o}function pn(e,t,r,n,o){var s={capture:n,passive:o},a=ba(e,t,r,s);(t===document.body||t===window||t===document||t instanceof HTMLMediaElement)&&Je(()=>{a.__removed=!0,t.removeEventListener(e,a,s)})}function Ve(e,t,r){(t[Hn]??={})[e]=r}function Xt(e){for(var t=0;t<e.length;t++)mo.add(e[t]);for(var r of yi)r(e)}var go=null,_o=!1;function bi(e){var t=this,r=t.ownerDocument,n=e.type,o=e.composedPath?.()||[],s=o[0]||e.target;go=e,_o||(_o=!0,setTimeout(()=>{_o=!1,go=null}));var a=0,l=go===e&&e[Hn];if(l){var c=o.indexOf(l);if(c!==-1&&(t===document||t===window)){e[Hn]=t;return}var p=o.indexOf(t);if(p===-1)return;c<=p&&(a=c)}if(s=o[a]||e.target,s!==t){Oe(e,"currentTarget",{configurable:!0,get(){return s||r}});var v=O,h=S;ke(null),Le(null);try{for(var u,d=[];s!==null&&s!==t;){try{var g=s[Hn]?.[n];g!=null&&(!s.disabled||e.target===s)&&g.call(s,e)}catch($){u?d.push($):u=$}if(e.cancelBubble)break;a++,s=a<o.length?o[a]:null}if(u){for(let $ of d)queueMicrotask(()=>{throw $});throw u}}finally{e[Hn]=t,delete e.currentTarget,ke(v),Le(h)}}}var fc=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:e=>e});function wa(e){return fc?.createHTML(e)??e}function $o(e){var t=nr("template");return t.innerHTML=wa(e.replaceAll("<!>","<!---->")),t.content}function Kt(e,t){var r=S;r.nodes===null&&(r.nodes={start:e,end:t,a:null,t:null})}function U(e,t){var r=(t&1)!==0,n=(t&2)!==0,o,s=!e.startsWith("<!>");return()=>{if(A)return Kt(L,null),L;o===void 0&&(o=$o(s?e:"<!>"+e),r||(o=Ze(o)));var a=n||Pn?document.importNode(o,!0):o.cloneNode(!0);if(r){var l=Ze(a),c=a.lastChild;Kt(l,c)}else Kt(a,a);return a}}function Qe(){if(A)return Kt(L,null),L;var e=document.createDocumentFragment(),t=document.createComment(""),r=De();return e.append(t,r),Kt(t,r),e}function B(e,t){if(A){var r=S;((r.f&32768)===0||r.nodes.end===null)&&(r.nodes.end=L),Ge();return}e!==null&&e.before(t)}function wi(e){let t=0,r=Pe(0),n;return m&&oe(r,"createSubscriber version"),()=>{xr()&&(i(r),nt(()=>(t===0&&(n=D(()=>e(()=>Te(r)))),t+=1,()=>{Ee(()=>{t-=1,t===0&&(n?.(),n=void 0,Te(r))})})))}}var gc=589824;function wo(e,t,r,n){new bo(e,t,r,n)}var bo=class{parent;is_pending=!1;transform_error;#e;#t=A?L:null;#r;#n;#i;#o=null;#a=null;#s=null;#l=null;#d=0;#c=0;#v=!1;#m=new Map;#f=null;#g=wi(()=>(this.#f=Pe(this.#d),m&&oe(this.#f,"$effect.pending()"),()=>{this.#f=null}));constructor(t,r,n,o){this.#e=t,this.#r=r,this.#n=s=>{var a=S;a.b=this,a.f|=128,n(s)},this.parent=S.b,this.transform_error=o??this.parent?.transform_error??(s=>s),this.#i=dt(()=>{if(A){let s=wr(this.#t);Ge();let a=s==="[!";if(s.startsWith("[?")){let c=JSON.parse(s.slice("[?".length));this.#b(c)}else a?this.#h():this.#$()}else this.#y()},gc),A&&(this.#e=L)}#$(){try{this.#o=Re(()=>this.#n(this.#e))}catch(t){this.error(t)}}#b(t){let r=this.#r.failed,{reset:n,invoke_onerror:o}=this.#_(t);Ee(o),r&&(this.#s=Re(()=>{r(this.#e,()=>t,()=>n)}))}#_(t){var r=!1,n=!1;let o=()=>{if(!this.#u()){if(r){ps();return}r=!0,n&&Os(),this.#s!==null&&or(this.#s,()=>{this.#s=null}),this.#w(()=>{this.#y()})}};return{reset:o,invoke_onerror:()=>{if(!this.#u())try{n=!0,this.#r.onerror?.(t,o),n=!1}catch(a){gt(a,this.#i&&this.#i.parent)}}}}#u(){return(this.#i.f&33570816)!==0}#h(){let t=this.#r.pending;t&&(this.is_pending=!0,this.#a=Re(()=>t(this.#e)),Ee(()=>{if(!this.#u()){var r=this.#l=document.createDocumentFragment(),n=De(),o=!1;if(r.append(n),this.#o=this.#w(()=>{try{return Re(()=>this.#n(n))}catch(s){try{this.error(s),o=!0}catch(a){gt(a,this.#i.parent)}return null}}),this.#o===null){this.#l=null,o&&this.#p(P);return}this.#c===0&&(this.#e.before(r),this.#l=null,or(this.#a,()=>{this.#a=null}),this.#p(P))}}))}#y(){try{if(this.is_pending=this.has_pending_snippet(),this.#c=0,this.#d=0,this.#o=Re(()=>{this.#n(this.#e)}),this.#c>0){var t=this.#l=document.createDocumentFragment();un(this.#o,t);let r=this.#r.pending;this.#a=Re(()=>r(this.#e))}else this.#p(P)}catch(r){this.error(r)}}#p(t){this.is_pending=!1,t.transfer_reactions(this.#m)}defer_effect(t){ai(t,this.#m)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#r.pending}#w(t){var r=S,n=O,o=G;Le(this.#i),ke(this.#i),ur(this.#i.ctx);try{return xt.ensure(),t()}finally{Le(r),ke(n),ur(o)}}#x(t,r){if(!this.has_pending_snippet()){this.parent&&this.parent.#x(t,r);return}this.#c+=t,this.#c===0&&(this.#p(r),this.#a&&or(this.#a,()=>{this.#a=null}),this.#l&&(this.#e.before(this.#l),this.#l=null))}update_pending_count(t,r){this.#x(t,r),this.#d+=t,!(!this.#f||this.#v)&&(this.#v=!0,Ee(()=>{this.#v=!1,this.#f&&Gt(this.#f,this.#d)}))}get_effect_pending(){return this.#g(),i(this.#f)}error(t){if(t===yt||!this.#r.onerror&&!this.#r.failed)throw t;P?.is_fork?(this.#o&&P.skip_effect(this.#o),this.#a&&P.skip_effect(this.#a),this.#s&&P.skip_effect(this.#s),P.oncommit(()=>{this.#u()||this.#E(t)})):this.#E(t)}#E(t){this.#o&&(ge(this.#o),this.#o=null),this.#a&&(ge(this.#a),this.#a=null),this.#s&&(ge(this.#s),this.#s=null),A&&(ie(this.#t),Vi(),ie(zt()));let r=this.#r.failed,n=o=>{if(this.#u())return;let{reset:s,invoke_onerror:a}=this.#_(o);a(),r&&!this.#u()&&(this.#s=this.#w(()=>{try{return Re(()=>{var l=S;l.b=this,l.f|=128,r(this.#e,()=>o,()=>s)})}catch(l){return gt(l,this.#i.parent),null}}))};Ee(()=>{if(!this.#u()){var o;try{o=this.transform_error(t)}catch(s){gt(s,this.#i&&this.#i.parent);return}o!==null&&typeof o=="object"&&typeof o.then=="function"?o.then(n,s=>gt(s,this.#i&&this.#i.parent)):n(o)}})}};var xo=!0;function Ei(e,t){var r=t==null?"":typeof t=="object"?`${t}`:t;r!==(e[kn]??=e.nodeValue)&&(e[kn]=r,e.nodeValue=`${r}`)}function hn(e,t){return Ea(e,t)}function ko(e,t){_i(),t.intro=t.intro??!1;let r=t.target,n=A,o=L;try{for(var s=Ze(r);s&&(s.nodeType!==Dt||s.data!=="[");)s=We(s);if(!s)throw yt;ye(!0),ie(s);let a=Ea(e,{...t,anchor:s});return ye(!1),a}catch(a){if(a instanceof Error&&a.message.split(`
`).some(l=>l.startsWith("https://svelte.dev/e/")))throw a;return a!==yt&&console.warn("Failed to hydrate: ",a),t.recover===!1&&ks(),_i(),An(r),ye(!1),hn(e,t)}finally{ye(n),ie(o)}}var xi=new Map;function Ea(e,{target:t,anchor:r,props:n={},events:o,context:s,intro:a=!0,transformError:l}){_i();var c=void 0,p=aa(()=>{var v=r??t.appendChild(De());wo(v,{pending:()=>{}},d=>{Xe({});var g=G;if(s&&(g.c=s),o&&(n.$$events=o),A&&Kt(d,null),xo=a,c=e(d,n)||Sn(),xo=!0,A&&(S.nodes.end=L,L===null||L.nodeType!==Dt||L.data!=="]"))throw Or(),yt;Ke()},l);var h=new Set,u=d=>{for(var g=0;g<d.length;g++){var $=d[g];if(!h.has($)){h.add($);var _=ma($);for(let k of[t,document]){var y=xi.get(k);y===void 0&&(y=new Map,xi.set(k,y));var w=y.get($);w===void 0?(k.addEventListener($,bi,{passive:_}),y.set($,1)):y.set($,w+1)}}}};return u(Xr(mo)),yi.add(u),()=>{for(var d of h)for(let _ of[t,document]){var g=xi.get(_),$=g.get(d);--$==0?(_.removeEventListener(d,bi),g.delete(d),g.size===0&&xi.delete(_)):g.set(d,$)}yi.delete(u),v!==r&&v.parentNode?.removeChild(v)}});return Eo.set(c,p),c}var Eo=new WeakMap;function zn(e,t){let r=Eo.get(e);return r?(Eo.delete(e),r(t)):(m&&us(),Promise.resolve())}var Zt=class{anchor;#e=new Map;#t=new Map;#r=new Map;#n=new Set;#i=!0;constructor(t,r=!0){this.anchor=t,this.#i=r}#o=t=>{if(this.#e.has(t)){var r=this.#e.get(t),n=this.#t.get(r);if(n)fn(n),this.#n.delete(r);else{var o=this.#r.get(r);o&&(fn(o.effect),this.#t.set(r,o.effect),this.#r.delete(r),m&&(o.fragment.lastChild[Ui]=this.anchor),o.fragment.lastChild.remove(),this.anchor.before(o.fragment),n=o.effect)}for(let[s,a]of this.#e){if(this.#e.delete(s),s===t)break;let l=this.#r.get(a);l&&(ge(l.effect),this.#r.delete(a))}for(let[s,a]of this.#t){if(s===r||this.#n.has(s))continue;let l=()=>{if(Array.from(this.#e.values()).includes(s)){var p=document.createDocumentFragment();un(a,p),p.append(De()),this.#r.set(s,{effect:a,fragment:p})}else ge(a);this.#n.delete(s),this.#t.delete(s)};this.#i||!n?(this.#n.add(s),or(a,l,!1)):l()}}};#a=t=>{this.#e.delete(t);let r=Array.from(this.#e.values());for(let[n,o]of this.#r)r.includes(n)||(ge(o.effect),this.#r.delete(n))};ensure(t,r){var n=P,o=mi();if(r&&!this.#t.has(t)&&!this.#r.has(t))if(o){var s=document.createDocumentFragment(),a=De();s.append(a),this.#r.set(t,{effect:Re(()=>r(a)),fragment:s})}else this.#t.set(t,Re(()=>r(this.anchor)));if(this.#e.set(n,t),o){for(let[l,c]of this.#t)l===t?n.unskip_effect(c):n.skip_effect(c);for(let[l,c]of this.#r)l===t?n.unskip_effect(c.effect):n.skip_effect(c.effect);n.oncommit(this.#o),n.ondiscard(this.#a)}else A&&(this.anchor=L),this.#o(n)}};function Tt(e,t,r=!1){var n;A&&(n=L,Ge());var o=new Zt(e),s=r?65536:0;function a(l,c){if(A){var p=wr(n);if(l!==parseInt(p.substring(1))){var v=zt();ie(v),o.anchor=v,ye(!1),o.ensure(l,c),ye(!0);return}}o.ensure(l,c)}dt(()=>{var l=!1;t((c,p=0)=>{l=!0,a(p,c)}),l||a(-1,null)},s)}function Lt(e,t){return t}function xc(e,t,r){for(var n=[],o=t.length,s,a=t.length,l=0;l<o;l++){let h=t[l];or(h,()=>{if(s){if(s.pending.delete(h),s.done.add(h),s.pending.size===0){var u=e.outrogroups;To(e,Xr(s.done)),u.delete(s),u.size===0&&(e.outrogroups=null)}}else a-=1},!1)}if(a===0){var c=n.length===0&&r!==null&&e.pending.size===0;if(c){var p=r,v=p.parentNode;An(v),v.append(p),e.items.clear()}To(e,t,!c)}else s={pending:new Set(t),done:new Set},(e.outrogroups??=new Set).add(s)}function To(e,t,r=!0){var n;if(e.pending.size>0){n=new Set;for(let a of e.pending.values())for(let l of a)n.add(e.items.get(l).e)}for(var o=0;o<t.length;o++){var s=t[o];if(n?.has(s)){s.f|=33554432;let a=document.createDocumentFragment();un(s,a)}else ge(t[o],r)}}var ka;function ft(e,t,r,n,o,s=null){var a=e,l=new Map,c=(t&4)!==0;if(c){var p=e;a=A?ie(Ze(p)):p.appendChild(De())}A&&Ge();var v=null,h=Pr(()=>{var w=r();return lr(w)?w:w==null?[]:Xr(w)});m&&oe(h,"{#each ...}");var u=new Map,d=!0;function g(w){if((y.effect.f&16384)===0){y.pending.delete(w);var k=i(h);y.fallback=v,Ec(y,k,a,t,n),v!==null&&(k.length===0?(v.f&33554432)===0?fn(v):(v.f^=33554432,Bn(v,null,a)):or(v,()=>{v=null}))}}function $(w){y.pending.delete(w)}var _=dt(()=>{var w=i(h),k=w.length;let x=!1;if(A){var C=wr(a)==="[!";C!==(k===0)&&(a=zt(),ie(a),ye(!1),x=!0)}for(var E=new Set,R=P,V=mi(),I=0;I<k;I+=1){A&&L.nodeType===Dt&&L.data==="]"&&(a=L,x=!0,ye(!1));var j=w[I],ee=n(j,I);if(m){var K=n(j,I);ee!==K&&$s(String(I),String(ee),String(K))}var T=d?null:l.get(ee);T?(T.v&&Gt(T.v,j),T.i&&Gt(T.i,I),V&&R.unskip_effect(T.e)):(T=kc(l,d?a:ka??=De(),j,ee,I,o,t,r),d||(T.e.f|=33554432),l.set(ee,T)),E.add(ee)}if(k===0&&s&&!v&&(d?v=Re(()=>s(a)):(v=Re(()=>s(ka??=De())),v.f|=33554432)),k>E.size&&(m?Tc(w,n):qi("","","")),A&&k>0&&ie(zt()),!d)if(u.set(R,E),V){for(let[Y,X]of l)E.has(Y)||R.skip_effect(X.e);R.oncommit(g),R.ondiscard($)}else g(R);x&&ye(!0),i(h)}),y={effect:_,flags:t,items:l,pending:u,outrogroups:null,fallback:v};d=!1,A&&(a=L)}function Un(e){for(;e!==null&&(e.f&32)===0;)e=e.next;return e}function Ec(e,t,r,n,o){var s=(n&8)!==0,a=t.length,l=e.items,c=Un(e.effect.first),p,v=null,h,u=[],d=[],g,$,_,y;if(s)for(y=0;y<a;y+=1)g=t[y],$=o(g,y),_=l.get($).e,(_.f&33554432)===0&&(_.nodes?.a?.measure(),(h??=new Set).add(_));for(y=0;y<a;y+=1){if(g=t[y],$=o(g,y),_=l.get($).e,e.outrogroups!==null)for(let j of e.outrogroups)j.pending.delete(_),j.done.delete(_);if((_.f&8192)!==0&&(fn(_),s&&(_.nodes?.a?.unfix(),(h??=new Set).delete(_))),(_.f&33554432)!==0)if(_.f^=33554432,_===c)Bn(_,null,r);else{var w=v?v.next:c;_===e.effect.last&&(e.effect.last=_.prev),_.prev&&(_.prev.next=_.next),_.next&&(_.next.prev=_.prev),Dr(e,v,_),Dr(e,_,w),Bn(_,w,r),v=_,u=[],d=[],c=Un(v.next);continue}if(_!==c){if(p!==void 0&&p.has(_)){if(u.length<d.length){var k=d[0],x;v=k.prev;var C=u[0],E=u[u.length-1];for(x=0;x<u.length;x+=1)Bn(u[x],k,r);for(x=0;x<d.length;x+=1)p.delete(d[x]);Dr(e,C.prev,E.next),Dr(e,v,C),Dr(e,E,k),c=k,v=E,y-=1,u=[],d=[]}else p.delete(_),Bn(_,c,r),Dr(e,_.prev,_.next),Dr(e,_,v===null?e.effect.first:v.next),Dr(e,v,_),v=_;continue}for(u=[],d=[];c!==null&&c!==_;)(p??=new Set).add(c),d.push(c),c=Un(c.next);if(c===null)continue}(_.f&33554432)===0&&u.push(_),v=_,c=Un(_.next)}if(e.outrogroups!==null){for(let j of e.outrogroups)j.pending.size===0&&(To(e,Xr(j.done)),e.outrogroups?.delete(j));e.outrogroups.size===0&&(e.outrogroups=null)}if(c!==null||p!==void 0){var R=[];if(p!==void 0)for(_ of p)(_.f&8192)===0&&R.push(_);for(;c!==null;)(c.f&8192)===0&&c!==e.fallback&&R.push(c),c=Un(c.next);var V=R.length;if(V>0){var I=(n&4)!==0&&a===0?r:null;if(s){for(y=0;y<V;y+=1)R[y].nodes?.a?.measure();for(y=0;y<V;y+=1)R[y].nodes?.a?.fix()}xc(e,R,I)}}s&&Ee(()=>{if(h!==void 0)for(_ of h)_.nodes?.a?.apply()})}function kc(e,t,r,n,o,s,a,l){var c=(a&1)!==0?(a&16)===0?Br(r,!1,!1):Pe(r):null,p=(a&2)!==0?Pe(o):null;return m&&c&&(c.trace=()=>{l()[p?.v??o]}),{v:c,i:p,e:Re(()=>(s(t,c??r,p??o,l),()=>{e.delete(n)}))}}function Bn(e,t,r){if(e.nodes)for(var n=e.nodes.start,o=e.nodes.end,s=t&&(t.f&33554432)===0?t.nodes.start:r;n!==null;){var a=We(n);if(s.before(n),n===o)return;n=a}}function Dr(e,t,r){t===null?e.effect.first=r:t.next=r,r===null?e.effect.last=t:r.prev=t}function Tc(e,t){let r=new Map,n=e.length;for(let o=0;o<n;o++){let s=t(e[o],o);if(r.has(s)){let a=String(r.get(s)),l=String(o),c=String(s);c.startsWith("[object ")&&(c=null),qi(a,l,c)}r.set(s,o)}}function ut(e,t,...r){var n=new Zt(e);dt(()=>{let o=t()??null;m&&o==null&&Ts(),n.ensure(o,o&&(s=>o(s,...r)))},65536)}function Vn(e,t,r){var n;A&&(n=L,Ge());var o=new Zt(e);dt(()=>{var s=t()??null;if(A){var a=wr(n),l=a==="[",c=s!==null;if(l!==c){var p=zt();ie(p),o.anchor=p,ye(!1),o.ensure(s,s&&(v=>r(v,s))),ye(!0);return}}o.ensure(s,s&&(v=>r(v,s)))},65536)}function Fe(e,t){var r=void 0,n;ho(()=>{r!==(r=t())&&(n&&(ge(n),n=null),r&&(n=Re(()=>{kt(()=>r(e))})))})}function Da(e){var t,r,n="";if(typeof e=="string"||typeof e=="number")n+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(r=Da(e[t]))&&(n&&(n+=" "),n+=r)}else for(r in e)e[r]&&(n&&(n+=" "),n+=r);return n}function Sa(){for(var e,t,r=0,n="",o=arguments.length;r<o;r++)(e=arguments[r])&&(t=Da(e))&&(n&&(n+=" "),n+=t);return n}function Jt(e){return typeof e=="object"?Sa(e):e??""}var Ra=[...` 	
\r\f\xA0\v\uFEFF`];function Na(e,t,r){var n=e==null?"":""+e;if(t&&(n=n?n+" "+t:t),r){for(var o of Object.keys(r))if(r[o])n=n?n+" "+o:o;else if(n.length)for(var s=o.length,a=0;(a=n.indexOf(o,a))>=0;){var l=a+s;(a===0||Ra.includes(n[a-1]))&&(l===n.length||Ra.includes(n[l]))?n=(a===0?"":n.substring(0,a))+n.substring(l+1):a=l}}return n===""?null:n}function Aa(e,t=!1){var r=t?" !important;":";",n="";for(var o of Object.keys(e)){var s=e[o];s!=null&&s!==""&&(n+=" "+o+": "+s+r)}return n}function Co(e){return e[0]!=="-"||e[1]!=="-"?e.toLowerCase():e}function Oa(e,t){if(t){var r="",n,o;if(Array.isArray(t)?(n=t[0],o=t[1]):n=t,e){e=String(e).replaceAll(/\/\*.*?\*\//g,"").trim();var s=!1,a=0,l=!1,c=[];n&&c.push(...Object.keys(n).map(Co)),o&&c.push(...Object.keys(o).map(Co));var p=0,v=-1;let $=e.length;for(var h=0;h<$;h++){var u=e[h];if(l?u==="/"&&e[h-1]==="*"&&(l=!1):s?s===u&&(s=!1):u==="/"&&e[h+1]==="*"?l=!0:u==='"'||u==="'"?s=u:u==="("?a++:u===")"&&a--,!l&&s===!1&&a===0){if(u===":"&&v===-1)v=h;else if(u===";"||h===$-1){if(v!==-1){var d=Co(e.substring(p,v).trim());if(!c.includes(d)){u!==";"&&h++;var g=e.substring(p,h).trim();r+=" "+g+";"}}p=h+1,v=-1}}}}return n&&(r+=Aa(n)),o&&(r+=Aa(o,!0)),r=r.trim(),r===""?null:r}return e==null?null:String(e)}function Z(e,t,r,n,o,s){var a=e[xn];if(A||a!==r||a===void 0){var l=Na(r,n,s);(!A||l!==e.getAttribute("class"))&&(l==null?e.removeAttribute("class"):t?e.className=l:e.setAttribute("class",l)),e[xn]=r}else if(s&&o!==s)for(var c in s){var p=!!s[c];(o==null||p!==!!o[c])&&e.classList.toggle(c,p)}return s}function Do(e,t={},r,n){for(var o in r){var s=r[o];t[o]!==s&&(r[o]==null?e.style.removeProperty(o):e.style.setProperty(o,s,n))}}function Sr(e,t,r,n){var o=e[En];if(A||o!==t){var s=Oa(t,n);(!A||s!==e.getAttribute("style"))&&(s==null?e.removeAttribute("style"):e.style.cssText=s),e[En]=t}else n&&(Array.isArray(n)?(Do(e,r?.[0],n[0]),Do(e,r?.[1],n[1],"important")):Do(e,r,n));return n}var Pc=Symbol("is custom element"),Fc=Symbol("is html"),Hc=Bi?"link":"LINK";function et(e,t,r,n){var o=zc(e);if(A&&(o[t]=e.getAttribute(t),t==="src"||t==="srcset"||t==="href"&&e.nodeName===Hc)){n||Bc(e,t,r??"");return}var s=o[t];s!==(o[t]=r)&&(t==="loading"&&(e[as]=r),r==null?e.removeAttribute(t):typeof r!="string"&&Uc(e).has(t)?e[t]=r:A&&(typeof r=="number"||typeof r=="boolean")&&s===String(r)||e.setAttribute(t,r))}function zc(e){return e[Qn]??={[Pc]:e.nodeName.includes("-"),[Fc]:e.namespaceURI===ei}}var Ia=new Map;function Uc(e){var t=e.getAttribute("is")||e.nodeName,r=Ia.get(t);if(r)return r;Ia.set(t,r=new Set);for(var n,o=e,s=Element.prototype;s!==o;){n=Fi(o);for(var a in n)n[a].set&&a!=="innerHTML"&&a!=="textContent"&&a!=="innerText"&&r.add(a);o=Kr(o)}return r}function Bc(e,t,r){m&&(t==="srcset"&&Vc(e,r)||So(e.getAttribute(t)??"",r)||fs(t,e.outerHTML.replace(e.innerHTML,e.innerHTML&&"..."),String(r)))}function So(e,t){return e===t?!0:new URL(e,document.baseURI).href===new URL(t,document.baseURI).href}function Ma(e){return e.split(",").map(t=>t.trim().split(" ").filter(Boolean))}function Vc(e,t){var r=Ma(e.srcset),n=Ma(t);return n.length===r.length&&n.every(([o,s],a)=>s===r[a][1]&&(So(r[a][0],o)||So(o,r[a][0])))}function Ro(e,t){return e===t||e?.[st]===t}function _r(e=Sn(),t,r,n){var o=G.r,s=S;return kt(()=>{var a,l;return nt(()=>{a=l,l=n?.()||[],D(()=>{Ro(r(...l),e)||(t(e,...l),a&&Ro(r(...a),e)&&t(null,...a))})}),()=>{let c=s;for(;c!==o&&c.parent!==null&&c.parent.f&33554432;)c=c.parent;let p=()=>{l&&Ro(r(...l),e)&&t(null,...l)},v=c.teardown;c.teardown=()=>{p(),v?.()}}}),e}var Ti=!1;function Ao(e){var t=Ti;try{return Ti=!1,[e(),Ti]}finally{Ti=t}}var Kc={get(e,t){if(!e.exclude.has(t))return e.props[t]},set(e,t){return m&&Ds(`${e.name}.${String(t)}`),!1},getOwnPropertyDescriptor(e,t){if(!e.exclude.has(t)&&t in e.props)return{enumerable:!0,configurable:!0,value:e.props[t]}},has(e,t){return e.exclude.has(t)?!1:t in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(t=>!e.exclude.has(t))}};function No(e,t,r){return new Proxy(m?{props:e,exclude:t,name:r}:{props:e,exclude:t},Kc)}function Ae(e,t,r,n){var o=!fr||(r&2)!==0,s=(r&8)!==0,a=(r&16)!==0,l=n,c=!0,p=void 0,v=()=>a&&o?(p??=kr(n),i(p)):(c&&(c=!1,l=a?D(n):n),l);let h;if(s){var u=st in e||wn in e;h=ht(e,t)?.set??(u&&t in e?x=>e[t]=x:void 0)}var d,g=!1;s?[d,g]=Ao(()=>e[t]):d=e[t],d===void 0&&n!==void 0&&(d=v(),h&&(o&&Cs(t),h(d)));var $;if(o?$=()=>{var x=e[t];return x===void 0?v():(c=!0,x)}:$=()=>{var x=e[t];return x!==void 0&&(l=void 0),x===void 0?l:x},o&&(r&4)===0)return $;if(h){var _=e.$$legacy;return(function(x,C){return arguments.length>0?((!o||!C||_||g)&&h(C?$():x),x):$()})}var y=!1,w=((r&1)!==0?kr:Pr)(()=>(y=!1,$()));m&&(w.label=t),s&&i(w);var k=S;return(function(x,C){if(arguments.length>0){let E=C?i(w):o&&s?Ce(x):x;return b(w,E),y=!0,l!==void 0&&(l=E),x}return wt&&y||(k.f&16384)!==0?w.v:i(w)})}function Pa(e){return new Oo(e)}var Oo=class{#e;#t;constructor(t){var r=new Map,n=(s,a)=>{var l=Br(a,!1,!1);return r.set(s,l),l};let o=new Proxy({...t.props||{},$$events:{}},{get(s,a){return i(r.get(a)??n(a,Reflect.get(s,a)))},has(s,a){return a===wn?!0:(i(r.get(a)??n(a,Reflect.get(s,a))),Reflect.has(s,a))},set(s,a,l){return b(r.get(a)??n(a,l),l),Reflect.set(s,a,l)}});this.#t=(t.hydrate?ko:hn)(t.component,{target:t.target,anchor:t.anchor,props:o,context:t.context,intro:t.intro??!1,recover:t.recover,transformError:t.transformError}),!Ie&&(!t?.props?.$$host||t.sync===!1)&&Tr(),this.#e=o.$$events;for(let s of Object.keys(this.#t))s==="$set"||s==="$destroy"||s==="$on"||Oe(this,s,{get(){return this.#t[s]},set(a){this.#t[s]=a},enumerable:!0});this.#t.$set=s=>{Object.assign(o,s)},this.#t.$destroy=()=>{zn(this.#t)}}$set(t){this.#t.$set(t)}$on(t,r){this.#e[t]=this.#e[t]||[];let n=(...o)=>r.call(this,...o);return this.#e[t].push(n),()=>{this.#e[t]=this.#e[t].filter(o=>o!==n)}}$destroy(){this.#t.$destroy()}};var id;typeof HTMLElement=="function"&&(id=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(e,t,r){super(),this.$$ctor=e,this.$$s=t,r&&(this.$$shadowRoot=this.attachShadow(r))}addEventListener(e,t,r){if(this.$$l[e]=this.$$l[e]||[],this.$$l[e].push(t),this.$$c){let n=this.$$c.$on(e,t);this.$$l_u.set(t,n)}super.addEventListener(e,t,r)}removeEventListener(e,t,r){if(super.removeEventListener(e,t,r),this.$$c){let n=this.$$l_u.get(t);n&&(n(),this.$$l_u.delete(t))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let e=function(n){return o=>{let s=nr("slot");n!=="default"&&(s.name=n),B(o,s)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let t={},r=od(this);for(let n of this.$$s)n in r&&(n==="default"&&!this.$$d.children?(this.$$d.children=e(n),t.default=!0):t[n]=e(n));for(let n of this.attributes){let o=this.$$g_p(n.name);o in this.$$d||(this.$$d[o]=Io(o,n.value,this.$$p_d,"toProp"))}for(let n in this.$$p_d)!(n in this.$$d)&&this[n]!==void 0&&(this.$$d[n]=this[n],delete this[n]);this.$$c=Pa({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:t,$$host:this}}),this.$$me=po(()=>{nt(()=>{this.$$r=!0;for(let n of Pi(this.$$c)){if(!this.$$p_d[n]?.reflect)continue;this.$$d[n]=this.$$c[n];let o=Io(n,this.$$d[n],this.$$p_d,"toAttribute");o==null?this.removeAttribute(this.$$p_d[n].attribute||n):this.setAttribute(this.$$p_d[n].attribute||n,o)}this.$$r=!1})});for(let n in this.$$l)for(let o of this.$$l[n]){let s=this.$$c.$on(n,o);this.$$l_u.set(o,s)}this.$$l={}}}attributeChangedCallback(e,t,r){this.$$r||(e=this.$$g_p(e),this.$$d[e]=Io(e,r,this.$$p_d,"toProp"),this.$$c?.$set({[e]:this.$$d[e]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(e){return Pi(this.$$p_d).find(t=>this.$$p_d[t].attribute===e||!this.$$p_d[t].attribute&&t.toLowerCase()===e)||e}});function Io(e,t,r,n){let o=r[e]?.type;if(t=o==="Boolean"&&typeof t!="boolean"?t!=null:t,!n||!r[e])return t;if(n==="toAttribute")switch(o){case"Object":case"Array":return t==null?null:JSON.stringify(t);case"Boolean":return t?"":null;case"Number":return t??null;default:return t}else switch(o){case"Object":case"Array":return t&&JSON.parse(t);case"Boolean":return t;case"Number":return t!=null?+t:t;default:return t}}function od(e){let t={};return e.childNodes.forEach(r=>{t[r.slot||"default"]=!0}),t}if(m){let e=function(t){if(!(t in globalThis)){let r;Object.defineProperty(globalThis,t,{configurable:!0,get:()=>{if(r!==void 0)return r;Ss(t)},set:n=>{r=n}})}};e("$state"),e("$effect"),e("$derived"),e("$inspect"),e("$props"),e("$bindable")}function Fa(){return O===null&&Es(),(O.ac??=new AbortController).signal}function Ci(e){G===null&&Tn("onMount"),fr&&G.l!==null?ld(G).m.push(e):$t(()=>{let t=D(e);if(typeof t=="function")return t})}function ld(e){var t=e.l;return t.u??={a:[],b:[],m:[]}}typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");var vn=class extends Map{#e=new Map;#t=F(0);#r=F(0);#n=It||-1;constructor(t){if(super(),m&&(t=new Map(t),oe(this.#t,"SvelteMap version"),oe(this.#r,"SvelteMap.size")),t){for(var[r,n]of t)super.set(r,n);this.#r.v=super.size}}#i(t){return It===this.#n?F(t):Pe(t)}has(t){var r=this.#e,n=r.get(t);if(n===void 0)if(super.has(t))n=this.#i(0),m&&oe(n,`SvelteMap get(${tn(t)})`),r.set(t,n);else return i(this.#t),!1;return i(n),!0}forEach(t,r){this.#o(),super.forEach(t,r)}get(t){var r=this.#e,n=r.get(t);if(n===void 0)if(super.has(t))n=this.#i(0),m&&oe(n,`SvelteMap get(${tn(t)})`),r.set(t,n);else{i(this.#t);return}return i(n),super.get(t)}getOrInsert(t,r){return super.has(t)||this.set(t,r),this.get(t)}getOrInsertComputed(t,r){return super.has(t)||this.set(t,r(t)),this.get(t)}set(t,r){var n=this.#e,o=n.get(t),s=super.get(t),a=super.set(t,r),l=this.#t;if(o===void 0)o=this.#i(0),m&&oe(o,`SvelteMap get(${tn(t)})`),n.set(t,o),b(this.#r,super.size),Te(l);else if(s!==r){Te(o);var c=l.reactions===null?null:new Set(l.reactions),p=c===null||!o.reactions?.every(v=>c.has(v));p&&Te(l)}return a}delete(t){var r=this.#e,n=r.get(t),o=super.delete(t);return n!==void 0&&(r.delete(t),b(n,-1)),o&&(b(this.#r,super.size),Te(this.#t)),o}clear(){if(super.size!==0){super.clear();var t=this.#e;b(this.#r,0);for(var r of t.values())b(r,-1);Te(this.#t),t.clear()}}#o(){i(this.#t);var t=this.#e;if(this.#r.v!==t.size){for(var r of super.keys())if(!t.has(r)){var n=this.#i(0);m&&oe(n,`SvelteMap get(${tn(r)})`),t.set(r,n)}}for([,n]of this.#e)i(n)}keys(){return i(this.#t),super.keys()}values(){return this.#o(),super.values()}entries(){return this.#o(),super.entries()}[Symbol.iterator](){return this.entries()}get size(){return i(this.#r),super.size}};var Ha=Symbol("replace"),Di=class extends URLSearchParams{#e=m?oe(F(0),"SvelteURLSearchParams version"):F(0);#t=za();#r=!1;#n(){if(!this.#t||this.#r)return;this.#r=!0;let t=super.toString();this.#t.search=t&&`?${t}`,this.#r=!1}[Ha](t){if(!this.#r&&t.toString()!==super.toString()){this.#r=!0;for(let r of[...super.keys()])super.delete(r);for(let[r,n]of t)super.append(r,n);Te(this.#e),this.#r=!1}}append(t,r){super.append(t,r),this.#n(),Te(this.#e)}delete(t,r){var n=super.has(t,r);super.delete(t,r),n&&(this.#n(),Te(this.#e))}get(t){return i(this.#e),super.get(t)}getAll(t){return i(this.#e),super.getAll(t)}has(t,r){return i(this.#e),super.has(t,r)}keys(){return i(this.#e),super.keys()}forEach(t,r){i(this.#e),super.forEach(t,r)}set(t,r){var n=super.getAll(t);super.set(t,r);var o=super.getAll(t);(n.length!==o.length||n.some((s,a)=>s!==o[a]))&&(this.#n(),Te(this.#e))}sort(){super.sort(),this.#n(),Te(this.#e)}toString(){return i(this.#e),super.toString()}values(){return i(this.#e),super.values()}entries(){return i(this.#e),super.entries()}[Symbol.iterator](){return this.entries()}get size(){return i(this.#e),super.size}};var dd=null;function za(){return dd}function Wo(e,t=void 0){return function(r){return r.key==="Enter"||r.key===" "&&!r.preventDefault()?e.call(t,r):void 0}}function Ct(e,t){return t?null:r=>{typeof e=="string"?r.innerText=e:e?.domNodes?r.replaceChildren(...e.domNodes):e?.html&&(r.innerHTML=e.html)}}function fd(e){return t=>{let r=n=>{t&&!t.contains(n.target)&&t.dispatchEvent(new CustomEvent(e+"outside",{detail:{jsEvent:n}}))};return document.addEventListener(e,r,!0),()=>{document.removeEventListener(e,r,!0)}}}function ud(e,t=!1){return r=>{let n,o=new ResizeObserver(s=>{for(let a of s){if(t){let{inlineSize:l}=a.contentBoxSize?.[0]??{inlineSize:a.contentRect.width};if(l===n)continue;n=l}e(r,a)}});return o.observe(r),()=>{o.unobserve(r)}}}function _e(...e){return Object.assign(...e)}function Wr(e){return Object.keys(e)}function pd(e){return Object.entries(e)}function Fo(e,t){return Object.hasOwn(e,t)}function hd(e){return Math.floor(e)}function vd(e){return Math.ceil(e)}function qn(...e){return Math.min(...e)}function Rr(...e){return Math.max(...e)}function gd(){return Symbol("ec")}function qr(e){return e.length}function jr(e){return!qr(e)}function jo(e=new Date){return-e.getTimezoneOffset()}function $n(e){return Array.isArray(e)}function we(e){return typeof e=="function"}function Ja(e){if(typeof e!="object"||e===null)return!1;let t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}function Xo(e){return e instanceof Date}var Ni=e=>e;function _d(e){return t=>t===void 0?void 0:e(t)}var Ua=new WeakMap,md=1;function Qa(e){let t=Ua.get(e);return t||(t=md++,Ua.set(e,t)),t}function el(e){return{url:e.url?.replace(/&+$/,"")||"",method:e.method?.toUpperCase()||"GET",extraParams:e.extraParams??{}}}function yn(e,t,r,n){return n?{snippet:n,arg:t?.()}:{content:(we(e)?e(t?.()):e)??(we(r)?r():r)}}var Ho=86400;function Ft(e=new Date,t=void 0){return Xo(e)?xd(e,t):Ed(e,t)}function gn(e){if(typeof e=="number")e={seconds:e};else if(typeof e=="string"){let r=0,n=2;for(let o of e.split(":",3))r+=parseInt(o,10)*Math.pow(60,n--);e={seconds:r}}else Xo(e)&&(e={hours:e.getUTCHours(),minutes:e.getUTCMinutes(),seconds:e.getUTCSeconds()});let t=e.weeks||e.week||0;return{years:e.years||e.year||0,months:e.months||e.month||0,days:t*7+(e.days||e.day||0),seconds:(e.hours||e.hour||0)*60*60+(e.minutes||e.minute||0)*60+(e.seconds||e.second||0),inWeeks:!!t}}function W(e){let t=new Date($r(e));return Gn(t,Uo(e)),t}function it(e,t,r=1){e.setUTCFullYear(e.getUTCFullYear()+r*t.years);let n=e.getUTCMonth()+r*t.months;for(e.setUTCMonth(n),n%=12,n<0&&(n+=12);e.getUTCMonth()!==n;)Ko(e);return e.setUTCDate(e.getUTCDate()+r*t.days),e.setUTCSeconds(e.getUTCSeconds()+r*t.seconds),e}function $d(e,t,r=1){return it(e,t,-r)}function Ht(e,t=1){return e.setUTCDate(e.getUTCDate()+t),e}function Ko(e,t=1){return Ht(e,-t)}function pt(e){return e.setUTCHours(0,0,0,0),e}function Ne(e){return new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds())}function mr(e,t=19){return e.toISOString().substring(0,t)}function $r(e){return e.getTime()}function Ye(e,...t){return t.every(r=>$r(e)===$r(r))}function yd(e,t){let r=t-e.getUTCDay();return e.setUTCDate(e.getUTCDate()+(r>=0?r:r+7)),e}function tl(e,t){let r=t-e.getUTCDay();return e.setUTCDate(e.getUTCDate()+(r<=0?r:r-7)),e}function Ba(e){return typeof e=="string"&&e.length<=10}function bd(e,t){return e.setUTCHours(t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds(),0),e}function He(e){return e.seconds}function rl(e,t,r){return it(e,t),al(e,r,Ht),e}function nl(e,t,r){return $d(e,t),al(e,r,Ko),e}function il(e,t){e=W(e),t===0?e.setUTCDate(e.getUTCDate()+6-e.getUTCDay()):e.setUTCDate(e.getUTCDate()+4-(e.getUTCDay()||7));let r=new Date(Date.UTC(e.getUTCFullYear(),0,1));return Math.ceil(((e-r)/1e3/Ho+1)/7)}function wd(e,t,r,n){return yn(r,()=>({date:Ne(t),week:e}),()=>"W"+String(e).padStart(2,"0"),n)}function ol(e,t={}){let r=e.match(/(?:Z|([+-])(\d{2}):?(\d{2}))$/);if(r)return _e(t,r),r[1]?+(r[1]+"1")*(+r[2]*60+ +r[3]):0}function Zo(e,t,r){return r==="local"&&(r=jo(new Date(e.getTime()-t*6e4))),r!==t&&e.setUTCMinutes(e.getUTCMinutes()+r-t),Gn(e,r)}function zo(e,t){return t==="local"?jo(Ne(e)):t}var sl=Symbol("ec");function Gn(e,t){return e[sl]=t,e}function Uo(e){return e[sl]}function xd(e,t=void 0){return Zo(new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds())),jo(e),t??"local")}function Ed(e,t=void 0){let r={},n=ol(e,r);n!==void 0&&(e=e.substring(0,r.index));let o=e.match(/\d+/g),s=new Date(Date.UTC(+o[0],+o[1]-1,+o[2],+o[3]||0,+o[4]||0,+o[5]||0));return t!==void 0&&n!==void 0?Zo(s,n,t):Gn(s,n??zo(s,t))}function al(e,t,r){if(t.length&&t.length<7)for(;t.includes(e.getUTCDay());)r(e)}var Jo=gd();function ll(e,t){e[Jo]=t}function kd(e){return!!e?.[Jo]}function cl(e){return e[Jo]}function dl(e,t,r,n=[]){let o=document.createElement(e);o.className=t,typeof r=="string"?o.innerText=r:r.domNodes?o.replaceChildren(...r.domNodes):r.html&&(o.innerHTML=r.html);for(let s of n)o.setAttribute(...s);return o}function Ri(e){return e.getBoundingClientRect()}function Yn(e){return Ri(e).height}function fl(e,t,r=document,n=[]){n.push(r);for(let o of r.elementsFromPoint(e,t)){if(kd(o))return o;if(o.shadowRoot&&!n.includes(o.shadowRoot)){let s=fl(e,t,o.shadowRoot,n);if(s)return s}}return null}function Bo(e,t=void 0){return function(r){r.stopPropagation(),e&&e.call(t,r)}}function Td(e,t,r,n){return{type:e,title:t,currentStart:r.start,currentEnd:r.end,activeStart:n.start,activeEnd:n.end,calendar:void 0}}function ar(e){return e=_e({},e),e.currentStart=Ne(e.currentStart),e.currentEnd=Ne(e.currentEnd),e.activeStart=Ne(e.activeStart),e.activeEnd=Ne(e.activeEnd),e}var Cd=1;function Oi(e,t=void 0){return e.map(r=>{let n={id:r.id!=null?String(r.id):`{generated-${Cd++}}`,resourceIds:Mo(r,"resourceId").map(String),allDay:r.allDay??(Ba(r.start)&&Ba(r.end)),start:Ft(r.start,t),end:Ft(r.end,t),title:r.title??"",editable:r.editable,startEditable:r.startEditable,durationEditable:r.durationEditable,display:r.display??"auto",layoutGroup:r.layoutGroup?.toString(),extendedProps:r.extendedProps??{},backgroundColor:r.backgroundColor??r.color,textColor:r.textColor,classNames:Mo(r,"className"),styles:Mo(r,"style")};if(n.allDay){pt(n.start);let o=W(n.end);pt(n.end),(!Ye(n.end,o)||Ye(n.end,n.start))&&Ht(n.end)}return n})}function Mo(e,t){let r=e[t+"s"]??e[t]??[];return $n(r)?r:[r]}function Dd(e){return e.map(t=>({events:t.events,...el(t)}))}function Sd(e,t,r){return r.formatRange(e.start,t&&e.event.display!=="pointer"&&!e.zeroDuration?e.end:null)}function Rd(e,t,r){let n;switch(e.event.display){case"background":n=[];break;case"pointer":n=e.event.allDay?[]:[Va(t,e,r)];break;default:n=[...e.event.allDay?[]:[Va(t,e,r)],dl("h4",r.eventTitle,e.event.title)]}return{domNodes:n}}function Va(e,t,r){return dl("time",r.eventTime,e,[["datetime",mr(t.start)]])}function Ad(e,t,r){let n=t.classNames;return e&&(we(e)&&(e=e({event:Pt(t),view:ar(r)})),n=[...$n(e)?e:[e],...n]),n}function Pt(e){return Nd(e,Ne)}function Nd(e,t){return e=_e({},e),e.start=t(e.start),e.end=t(e.end),e}var Ya=0;function Od(e,t){e.length=t.length,++Ya;for(let r of e)r?.reposition(Ya)}function _n(e,t,r,n=void 0){return(!n||e.resourceIds.includes(n.id))&&e.start<r&&e.end>t}function ul(e){return pl(e)||Id(e)||hl(e)}function Qt(e){return e==="background"}function pl(e){return e==="preview"}function Id(e){return e==="ghost"}function hl(e){return e==="pointer"}function Wn(e,t,r){return t=e.start>t?e.start:t,r=e.end<r?e.end:r,{start:t,end:r,event:e,zeroDuration:Ye(t,r)}}function mn(e,t,r=!0){let n=[],o,s,a,l;for(let{gridColumn:c,gridRow:p,resource:v,dayStart:h,dayEnd:u,disabled:d}of t)!d&&_n(e,h,u,v)&&(n.push(h),o=u,s||(s=c,a=p,l=v));if(n.length){let c=Wn(e,n[0],o);return _e(c,{gridColumn:s,gridRow:a,resource:l,dates:n}),r&&Qo(c),[c]}return[]}function vl(e){let t={},r={};for(let n of e){let{gridColumn:o,gridRow:s}=n;for(let l=1;l<n.dates.length;++l){let c=`${s}_${o+l}`;r[c]?r[c].chunks.push(n):r[c]={sorted:!1,chunks:[n]}}let a=`${s}_${o}`;n.long=r[a],n.prev=t[a],t[a]=n}}function Md(e,t,r=1,n=1){e.prev&&(r=e.prev.bottom+n);let o=r+t;if(e.long){let s=e.long;s.sorted||(s.chunks.sort((a,l)=>a.top-l.top),s.sorted=!0);for(let a of s.chunks)if(r<a.bottom&&o>a.top){let l=a.bottom-r+n;r+=l,o+=l}}return _e(e,{top:r,bottom:o}),r}function Qo(e){let{event:t,gridColumn:r,gridRow:n}=e;e.id=`${Qa(t)}-${r}-${n}`}function Ar(e,t){return()=>{let{options:{locale:r}}=e,n=e.options[t],o;return D(()=>{o=we(n)?{format:n}:new Intl.DateTimeFormat(r,n)}),{format:s=>o.format(Ne(s))}}}function qa(e,t,r=!1){return()=>{let{options:{locale:n}}=e,o=e.options[t],s;return D(()=>{if(we(o))s=(a,l)=>o(Ne(a),l&&Ne(l));else{let a=new Intl.DateTimeFormat(n,o);s=(l,c)=>{if(!c)return a.format(Ne(l));if(r&&(c=bd(W(l),c)),l=Ne(l),c=Ne(c),l<=c)return a.formatRange(l,c);{let p=a.formatRangeToParts(c,l),v="",h=["startRange","endRange"],u=[!1,!1];for(let d of p){let g=h.indexOf(d.source);g>=0?u[g]||(v+=Ld(h[1-g],p),u[g]=!0):v+=d.value}return v}}}}),{formatRange:s}}}function Ld(e,t){let r="";for(let n of t)n.source==e&&(r+=n.value);return r}function gl(e){return Mi(e,"day")}function _l(e){return Mi(e,"week")}function ml(e){return Mi(e,"month")}function Pd(e){return Mi(e,"year")}function Mi(e,t){return{...e,next:"Next "+t,prev:"Previous "+t}}function Gr(e){return t=>({...t,view:e})}function Fd(e){let t,r;return e&&({start:t,end:r}=e,t&&(t=pt(Ft(t))),r&&(r=pt(Ft(r)))),{start:t,end:r}}function bn(e,t){return t.start&&e<t.start||t.end&&e>t.end}function es(e){let t=[];return $l(e,0,void 0,t),t}function $l(e,t,r,n){let o=[];for(let s of e){let a=Hd(s);o.push(a),n.push(a);let l={level:t,parent:r,children:[]};ll(a,l),s.children&&(l.children=$l(s.children,t+1,a,n))}return o}function Hd(e){return{id:e.id!=null?String(e.id):"",title:e.title??"",eventBackgroundColor:yl(e),eventTextColor:bl(e),expanded:e.expanded,extendedProps:e.extendedProps??{}}}function yl(e){return e?.eventBackgroundColor}function bl(e){return e?.eventTextColor}function Ga(e,t){return jr(e.resourceIds)?void 0:t.find(r=>e.resourceIds.includes(r.id))}function wl(e,t,r,n,o){let s=[];e=W(e);let a=W(e);for(it(e,n.min),it(a,n.max);e<a;)s.push([mr(e),o.format(e)]),it(e,t,r);let l=hd((e-a)/1e3/He(t));return l&&l!==r&&(s.at(-1)[2]=r-l),s}function xl(e,t,r,n,o){let s=gn(e),a=gn(t);if(r){let l=gn(qn(He(s),Rr(0,He(a)-Ho))),c=gn(Rr(He(a),He(l)+Ho)),p=we(r?.eventFilter)?r.eventFilter:v=>!Qt(v.display);e:for(let v of n){let h=it(W(v),s),u=it(W(v),a),d=it(W(v),l),g=it(W(v),c);for(let $ of o)if(!$.allDay&&p($)&&$.start<g&&$.end>d){if($.start<h){let _=Rr(($.start-v)/1e3,He(l));_<He(s)&&(s.seconds=_)}if($.end>u){let _=qn(($.end-v)/1e3,He(c));_>He(a)&&(a.seconds=_)}if(He(s)===He(l)&&He(a)===He(c))break e}}}return{min:s,max:a}}function Ii(e){let t=0,r=F(Ce(t));return El(e,()=>i(r),()=>!0,()=>b(r,++t,!0))}function zd(e){let t=0,r=Ce({});return El(e,n=>r[n],(n,o)=>n!==o,n=>r[n]=++t)}function El(e,t,r,n){return new Proxy(e,{get(o,s,a){return Fo(o,s)&&t(s),Reflect.get(o,s,a)},set(o,s,a,l){let c=r(o[s],a),p=Reflect.set(o,s,a,l);return c&&n(s),p}})}function Ud(e){let t={buttonText:{today:"today"},customButtons:{},customScrollbars:!1,date:new Date,dateIncrement:void 0,datesSet:void 0,dayCellContent:void 0,dayHeaderFormat:{weekday:"short",month:"numeric",day:"numeric"},dayHeaderAriaLabelFormat:{dateStyle:"full"},displayEventEnd:!0,duration:{weeks:1},events:[],eventAllUpdated:void 0,eventBackgroundColor:void 0,eventClassNames:void 0,eventClick:void 0,eventColor:void 0,eventContent:void 0,eventDidMount:void 0,eventFilter:void 0,eventGap:1,eventMouseEnter:void 0,eventMouseLeave:void 0,eventOrder:void 0,eventOrderStrict:!1,eventSources:[],eventTextColor:void 0,eventTimeFormat:{hour:"numeric",minute:"2-digit"},filterEventsWithResources:!1,firstDay:0,headerToolbar:{start:"title",center:"",end:"today prev,next"},height:void 0,hiddenDays:[],highlightedDates:[],icons:{},lazyFetching:!0,loading:void 0,locale:void 0,refetchResourcesOnNavigate:!1,resources:[],selectable:!1,theme:{active:"ec-active",bgEvent:"ec-bg-event",bgEvents:"ec-bg-events",body:"ec-body",button:"ec-button",buttonGroup:"ec-button-group",calendar:"ec",colHead:"ec-col-head",customScrollbars:"ec-custom-scrollbars",day:"ec-day",dayHead:"ec-day-head",disabled:"ec-disabled",endClipped:"ec-end-clipped",event:"ec-event",eventBody:"ec-event-body",eventTime:"ec-event-time",eventTitle:"ec-event-title",events:"ec-events",grid:"ec-grid",header:"ec-header",hidden:"ec-hidden",highlight:"ec-highlight",icon:"ec-icon",main:"ec-main",noBeb:"ec-no-beb",noIeb:"ec-no-ieb",startClipped:"ec-start-clipped",today:"ec-today",title:"ec-title",toolbar:"ec-toolbar",view:"",weekdays:["ec-sun","ec-mon","ec-tue","ec-wed","ec-thu","ec-fri","ec-sat"],weekNumber:"ec-week-number"},timeZone:"local",titleFormat:{year:"numeric",month:"short",day:"numeric"},validRange:void 0,view:void 0,viewDidMount:void 0,views:{}};for(let r of e)r.createOptions?.(t);return t}function Bd(e){let t={date:r=>pt(Ft(r)),dateIncrement:_d(gn),duration:gn,events:Oi,eventSources:Dd,hiddenDays:r=>[...new Set(r)],highlightedDates:r=>r.map(n=>pt(Ft(n))),resources:r=>$n(r)?es(r):Ja(r)?el(r):r,validRange:Fd};for(let r of e)r.createParsers?.(t);return t}var Vo=["buttonText","customButtons","icons","theme"];function Vd(e,t){let r=Ud(e),n=Bd(e);r=Yo(r,n),t=Yo(t,n);let o=Lo(r,"views")??{},s=Lo(t,"views")??{},a=zd({});_e(a,r),t.view&&(a.view=t.view);let l={},c={},p={},v=new Set([...Wr(o),...Wr(s)]);for(let h of v){let u=s[h]??{},d=Wa(r,o[h]??o[u.type]??{}),g=Wa(d,t,u),$=Lo(g,"component");delete g.view;for(let _ of Wr(g))Fo(a,_)?(l[_]??=[],l[_].push(Vo.includes(_)?y=>g[_]=we(y)?y(d[_]):y:y=>g[_]=y)):delete g[_];c[h]=g,p[h]=$}return _e(a,c[a.view]),[a,function(u,d,g=!0){Fo(a,u)&&(g||(u in n?d=n[u](d):Ja(d)?d={...d}:$n(d)&&(d=[...d])),l[u]?.forEach($=>$(d)),a[u]=Vo.includes(u)&&we(d)?c[a.view][u]:d)},function(u){return _e(a,c[u]),p[u]}]}function Yo(e,t){let r={...e};for(let n of Wr(t))n in r&&(r[n]=t[n](r[n]));if(e.views){r.views={};for(let n of Wr(e.views))r.views[n]=Yo(e.views[n],t)}return r}function Lo(e,t){let r=e[t];return delete e[t],r}function Wa(...e){let t={};for(let r of e){let n={};for(let o of Vo)we(r[o])&&(n[o]=r[o](t[o]));t={...t,...r,...n}}return t}function Yd(e,t){let r=[];for(let n of Wr(e))e[n]!==t[n]&&r.push([n,e[n]]);return r}function qd(e){return()=>{let{options:{view:t}}=e;D(()=>{let r=e.setViewOptions(t);e.extensions={},e.features=[],e.viewComponent=r(e)})}}function Gd(e,t){return()=>{let{activeRange:r,fetchedRange:{events:n},offset:o,viewDates:s,options:{events:a,eventSources:l,lazyFetching:c,timeZone:p}}=e;D(()=>{kl(l.map(v=>we(v.events)?v.events:v),a,v=>Oi(v,o),v=>e.events=Ii(v),p,r,n,s,!0,c,t)})}}function Wd(e,t){return()=>{let{activeRange:r,fetchedRange:{resources:n},viewDates:o,options:{lazyFetching:s,refetchResourcesOnNavigate:a,resources:l,timeZone:c}}=e;D(()=>{kl($n(l)?[]:[l],l,es,p=>e.resources=Ii(p),c,r,n,o,a,s,t)})}}function kl(e,t,r,n,o,s,a,l,c,p,v){if(!jr(l)){if(jr(e)){n(t);return}if((c||!a.start)&&(!p||!a.start||a.start>s.start||a.end<s.end||a.timeZone!==o)){let h=[],u=_=>v.stop(),d=_=>{h=h.concat(r(_)),n(h),v.stop()},g=mr(s.start),$=mr(s.end);for(let _ of e)if(v.start(),we(_)){let y=_(c?{start:Ne(s.start),end:Ne(s.end),startStr:g,endStr:$,timeZone:o}:{},d,u);y!==void 0&&Promise.resolve(y).then(d,u)}else{let y=we(_.extraParams)?_.extraParams():_e({},_.extraParams);c&&(y.start=g,y.end=$,o!=="local"&&(y.timeZone=o)),y=new URLSearchParams(y);let w=_.url,k={},x;["GET","HEAD"].includes(_.method)?w+=(w.includes("?")?"&":"?")+y:(k["content-type"]="application/x-www-form-urlencoded;charset=UTF-8",x=String(y)),fetch(w,{method:_.method,headers:k,body:x,signal:Fa(),credentials:"same-origin"}).then(C=>C.json()).then(d).catch(u)}_e(a,{...s,timeZone:o})}}}function jd(e){let t=0;function r(n){let{options:{loading:o}}=e;we(o)&&o(n)}return{start:()=>++t===1&&r(!0),stop:()=>--t===0&&r(!1)}}function Xd(e){return()=>{let{offset:t}=e,r=setInterval(()=>{let n=Ft(void 0,t),o=pt(W(n));e.now=n,Ye(e.today,o)||(e.today=o)},1e3);return()=>clearInterval(r)}}function Kd(e){return()=>{let{offset:t,options:r}=e;D(()=>{for(let o of e.events)if(!o.allDay)for(let s of["start","end"]){let a=o[s],l=Uo(a);l!==void 0?Zo(a,l,t):Gn(a,zo(a,t))}let n=Uo(r.date);if(n!==void 0){let o=Ft(void 0,t).getUTCDay()-Ft(void 0,n).getUTCDay(),s=Ht(W(r.date),o);e.setOption("date",s)}Gn(r.date,zo(r.date,t))})}}function Zd(e){return()=>{let{activeRange:t,options:{datesSet:r}}=e;D(()=>{we(r)&&r({start:Ne(t.start),end:Ne(t.end),startStr:mr(t.start),endStr:mr(t.end),view:ar(e.view)})})}}function Jd(e){let t;return()=>{let{filteredEvents:r,options:{eventAllUpdated:n}}=e;D(()=>{we(n)&&(t||(t=setTimeout(()=>{t=null,n({view:ar(e.view)})})))})}}function Qd(e){return()=>{let{options:{view:t,viewDidMount:r}}=e;D(()=>{we(r)&&gr().then(()=>r({view:ar(e.view)}))})}}function ef(e){let t;return()=>{let{options:{date:r,duration:n,firstDay:o}}=e,s,a;return D(()=>{s=W(r),n.years?(s.setUTCMonth(0),s.setUTCDate(1)):n.months?s.setUTCDate(1):n.inWeeks&&tl(s,o),a=it(W(s),n)}),t&&Ye(t.start,s)&&Ye(t.end,a)?t:t={start:s,end:a}}}function tf(e){let t;return()=>{let{currentRange:r,extensions:{activeRange:n}}=e,o,s;D(()=>{o=W(r.start),s=W(r.end)});let a=n?n(o,s):{start:o,end:s};return t&&Ye(t.start,a.start)&&Ye(t.end,a.end)?t:t=a}}function rf(e){return()=>{let{events:t,options:{eventFilter:r,eventOrder:n,filterEventsWithResources:o,resources:s,view:a}}=e,l=[...t];return D(()=>{if(we(r)){let c=t.map(Pt),p=ar(e.view);l=l.filter((v,h)=>r({event:Pt(v),index:h,events:c,view:p}))}o&&(l=l.filter(c=>s.some(p=>c.resourceIds.includes(p.id)))),we(n)?l.sort((c,p)=>n(Pt(c),Pt(p))):l.sort((c,p)=>c.start-p.start||p.allDay-c.allDay)}),l}}function nf(e){return()=>{let{options:{timeZone:t}}=e,r;return D(()=>{r=t==="UTC"?0:ol(t)??"local"}),r}}function of(e){return()=>{let{options:t,activeRange:r}=e,{hiddenDays:n}=t,o=[];return D(()=>{let s=pt(W(r.start)),a=pt(W(r.end));for(;s<a;)n.includes(s.getUTCDay())||o.push(W(s)),Ht(s);if(!o.length&&n.length&&n.length<7){for(;n.includes(s.getUTCDay());)Ht(s);gr().then(()=>{e.setOption("date",s)})}}),o}}function sf(e){return()=>{let{currentRange:t,intlTitle:r}=e,n;return D(()=>{n=r.formatRange(t.start,Ko(W(t.end)))}),n}}function af(e){return()=>{let{activeRange:t,currentRange:r,viewTitle:n,options:{view:o}}=e,s;return D(()=>{s=Td(o,n,r,t)}),s}}var lf=class{#e;get auxComponents(){return i(this.#e)}set auxComponents(e){b(this.#e,e,!0)}#t;get offset(){return i(this.#t)}set offset(e){b(this.#t,e)}#r;get currentRange(){return i(this.#r)}set currentRange(e){b(this.#r,e)}#n;get activeRange(){return i(this.#n)}set activeRange(e){b(this.#n,e)}#i;get fetchedRange(){return i(this.#i)}set fetchedRange(e){b(this.#i,e,!0)}#o;get events(){return i(this.#o)}set events(e){b(this.#o,e)}#a;get filteredEvents(){return i(this.#a)}set filteredEvents(e){b(this.#a,e)}#s;get mainEl(){return i(this.#s)}set mainEl(e){b(this.#s,e,!0)}#l;get now(){return i(this.#l)}set now(e){b(this.#l,e,!0)}#d;get resources(){return i(this.#d)}set resources(e){b(this.#d,e)}#c;get scrollDate(){return i(this.#c)}set scrollDate(e){b(this.#c,e,!0)}#v;get today(){return i(this.#v)}set today(e){b(this.#v,e,!0)}#m;get intlEventTime(){return i(this.#m)}set intlEventTime(e){b(this.#m,e)}#f;get intlDayHeader(){return i(this.#f)}set intlDayHeader(e){b(this.#f,e)}#g;get intlDayHeaderAL(){return i(this.#g)}set intlDayHeaderAL(e){b(this.#g,e)}#$;get intlTitle(){return i(this.#$)}set intlTitle(e){b(this.#$,e)}#b;get viewDates(){return i(this.#b)}set viewDates(e){b(this.#b,e)}#_;get viewTitle(){return i(this.#_)}set viewTitle(e){b(this.#_,e)}#u;get view(){return i(this.#u)}set view(e){b(this.#u,e)}#h;get viewComponent(){return i(this.#h)}set viewComponent(e){b(this.#h,e,!0)}#y;get extensions(){return i(this.#y)}set extensions(e){b(this.#y,e,!0)}#p;get features(){return i(this.#p)}set features(e){b(this.#p,e,!0)}#w;get interaction(){return i(this.#w)}set interaction(e){b(this.#w,e,!0)}#x;get iClasses(){return i(this.#x)}set iClasses(e){b(this.#x,e,!0)}#E;get iClass(){return i(this.#E)}set iClass(e){b(this.#E,e,!0)}options;setOption;setViewOptions;constructor(e,t){[this.options,this.setOption,this.setViewOptions]=Vd(e,t),this.#e=F(Ce([])),this.#t=f(nf(this)),this.#r=f(ef(this)),this.#n=f(tf(this)),this.#i=F(Ce({events:{},resources:{}})),this.#o=F(Ii(this.options.events)),this.#a=f(rf(this)),this.#s=F(),this.#l=F(Ce(Ft(void 0,this.offset))),this.#d=F(Ii($n(this.options.resources)?this.options.resources:[])),this.#c=F(),this.#v=F(Ce(pt(W(this.now)))),this.#m=f(qa(this,"eventTimeFormat",!0)),this.#f=f(Ar(this,"dayHeaderFormat")),this.#g=f(Ar(this,"dayHeaderAriaLabelFormat")),this.#$=f(qa(this,"titleFormat")),this.#b=f(of(this)),this.#_=f(sf(this)),this.#u=f(af(this)),this.#h=F(),this.#y=F(Ce({})),this.#p=F(Ce([])),this.snippets={},this.#w=F(Ce({})),this.iEvents=new vn,this.#x=F(Ce(Ni)),this.#E=F();for(let r of e)r.initState?.(this);this.#k()}#k(){let e=jd(this);ir(qd(this)),ir(Kd(this)),ir(Xd(this)),$t(Gd(this,e)),$t(Wd(this,e)),$t(Zd(this)),$t(Jd(this)),$t(Qd(this))}},cf=U("<h2></h2>"),ja=U("<button><i></i></button>"),Xa=U("<button> </button>"),df=U("<div><!></div>"),ff=U("<button></button>");function Ka(e,t){Xe(t,!0);let r=xe("state"),n=f(()=>r.currentRange),o=f(()=>r.snippets),s=f(()=>r.today),a=f(()=>r.viewTitle),l=f(()=>r.viewDates),c=f(()=>r.options.buttonText),p=f(()=>r.options.customButtons),v=f(()=>r.options.date),h=f(()=>r.options.dateIncrement),u=f(()=>r.options.duration),d=f(()=>r.options.hiddenDays),g=f(()=>r.options.theme),$=f(()=>r.options.validRange),_=f(()=>r.options.view),y=F(!1),w=F(!1),k=F(!1),x=!1;ir(()=>{i(l),i($),t.buttons,D(()=>{x||(x=!0,t.buttons.includes("prev")&&(b(y,!1),i($).start&&b(y,C(E),!0)),t.buttons.includes("next")&&(b(w,!1),i($).end&&b(w,C(R),!0)),t.buttons.includes("today")&&(b(k,i(s)>=i(n).start&&i(s)<i(n).end,!0),!i(k)&&(i($).start||i($).end)&&b(k,C(V),!0)),gr().then(()=>x=!1))})});function C(K){let T=i(v);K();let Y=i(l).every(X=>bn(X,i($)));return r.setOption("date",T),Y}function E(){r.setOption("date",nl(W(i(v)),i(h)??i(u),i(d)))}function R(){r.setOption("date",rl(W(i(v)),i(h)??i(u),i(d)))}function V(){r.setOption("date",W(i(s)))}function I(K){return"customButton"+K.charAt(0).toUpperCase()+K.slice(1)}var j=Qe(),ee=Se(j);ft(ee,17,()=>t.buttons,Lt,(K,T)=>{var Y=Qe(),X=Se(Y),ae=z=>{var N=cf();Fe(N,()=>Ct(i(a))),fe(()=>Z(N,1,i(g).title)),B(z,N)},he=z=>{var N=ja(),$e=dn(N);fe(()=>{Z(N,1,`${i(g).button??""} ec-${i(T)??""}`),et(N,"aria-label",i(c).prev),et(N,"title",i(c).prev),N.disabled=i(y),Z($e,1,`${i(g).icon??""} ec-${i(T)??""}`)}),Ve("click",N,E),B(z,N)},ne=z=>{var N=ja(),$e=dn(N);fe(()=>{Z(N,1,`${i(g).button??""} ec-${i(T)??""}`),et(N,"aria-label",i(c).next),et(N,"title",i(c).next),N.disabled=i(w),Z($e,1,`${i(g).icon??""} ec-${i(T)??""}`)}),Ve("click",N,R),B(z,N)},M=z=>{var N=Xa(),$e=dn(N,!0);fe(()=>{Z(N,1,`${i(g).button??""} ec-${i(T)??""}`),N.disabled=i(k),Ei($e,i(c)[i(T)])}),Ve("click",N,V),B(z,N)},J=z=>{let N=f(()=>yn(i(p)[i(T)]?.content,void 0,void 0,i(o)[I(i(T))]));var $e=df(),q=pe($e);ut(q,()=>i(N).snippet??ue),re($e),Fe($e,()=>Ct(i(N).content,i(N).snippet)),fe(()=>Z($e,1,`ec-${i(T)??""}`)),B(z,$e)},ot=f(()=>i(o)[I(i(T))]||i(p)[i(T)]?.content!=null),H=z=>{var N=ff();Fe(N,()=>Ct(i(p)[i(T)].text)),fe(()=>Z(N,1,Jt([i(g).button,`ec-${i(T)}`,i(p)[i(T)].active&&i(g).active]))),Ve("click",N,function(...$e){i(p)[i(T)].click?.apply(this,$e)}),B(z,N)},te=z=>{var N=Xa(),$e=dn(N,!0);fe(()=>{Z(N,1,Jt([i(g).button,`ec-${i(T)}`,i(_)===i(T)&&i(g).active])),Ei($e,i(c)[i(T)])}),Ve("click",N,()=>r.setOption("view",i(T))),B(z,N)};Tt(X,z=>{i(T)==="title"?z(ae):i(T)==="prev"?z(he,1):i(T)==="next"?z(ne,2):i(T)==="today"?z(M,3):i(ot)?z(J,4):i(p)[i(T)]?z(H,5):z(te,-1)}),B(K,Y)}),B(e,j),Ke()}Xt(["click"]);var uf=U("<div><!></div>"),pf=U("<div></div>"),hf=U("<nav></nav>");function vf(e,t){Xe(t,!0);let r=f(()=>xe("state")),n=f(()=>i(r).options.headerToolbar),o=f(()=>i(r).options.theme),s=f(()=>{let l={};for(let c of["start","center","end"])l[c]=i(n)[c]?.split(" ").filter(Boolean).map(p=>p.split(",").filter(Boolean))??[];return l});var a=hf();ft(a,21,()=>Wr(i(s)),Lt,(l,c)=>{var p=pf();ft(p,21,()=>i(s)[i(c)],Lt,(v,h)=>{var u=Qe(),d=Se(u),g=_=>{var y=uf();Ka(pe(y),{get buttons(){return i(h)}}),re(y),fe(()=>Z(y,1,i(o).buttonGroup)),B(_,y)},$=_=>{Ka(_,{get buttons(){return i(h)}})};Tt(d,_=>{i(h).length>1?_(g):_($,-1)}),B(v,u)}),re(p),fe(()=>Z(p,1,`ec-${i(c)??""}`)),B(l,p)}),re(a),fe(()=>Z(a,1,i(o).toolbar)),B(e,a),Ke()}var gf=new Set(["$$slots","$$events","$$legacy","plugins","options"]),_f=U("<div><!> <!> <!></div>");function mf(e,t){Xe(t,!0);let r=Ae(t,"plugins",19,()=>[]),n=Ae(t,"options",19,()=>({})),o=No(t,gf),s=new lf(r(),n());s.snippets=o,Dn("state",s);let a=f(()=>s.auxComponents),l=f(()=>s.features),c=f(()=>s.events),p=f(()=>s.interaction),v=f(()=>s.iClass),h=f(()=>s.offset),u=f(()=>s.view),d=f(()=>s.viewComponent),g=f(()=>s.options.date),$=f(()=>s.options.dateIncrement),_=f(()=>s.options.duration),y=f(()=>s.options.height),w=f(()=>s.options.hiddenDays),k=f(()=>s.options.customScrollbars),x=f(()=>s.options.theme),C={...n()};ir(()=>{for(let[q,ve]of Yd(n(),C))D(()=>{E(q,ve)});_e(C,n())});function E(q,ve){return s.setOption(q,ve,!1),this}function R(q){let ve=s.options[q];return Xo(ve)?Ne(ve):ve}function V(){return s.fetchedRange.resources={},this}function I(){return s.fetchedRange.events={},this}function j(){return i(c).map(Pt)}function ee(q){q=String(q);for(let ve of i(c))if(ve.id===q)return Pt(ve);return null}function K(q){return q=Oi([q],i(h))[0],i(c).push(q),Pt(q)}function T(q){let ve=String(q.id),er=i(c).findIndex(Nr=>Nr.id===ve);return er>=0?(q=Oi([q],i(h))[0],i(c)[er]=q,Pt(q)):null}function Y(q){q=String(q);let ve=i(c).findIndex(er=>er.id===q);return ve>=0&&i(c).splice(ve,1),this}function X(){return ar(i(u))}function ae(){return i(p).action?.unselect(),this}function he(q,ve){let er=fl(q,ve);if(er){let Nr=cl(er)(q,ve);return Nr.date=Ne(Nr.date),Nr}return null}function ne(q){return q=pt(Ft(q)),s.setOption("date",W(q)),s.scrollDate=q,this}function M(){return s.setOption("date",rl(W(i(g)),i($)??i(_),i(w))),this}function J(){return s.setOption("date",nl(W(i(g)),i($)??i(_),i(w))),this}var ot={setOption:E,getOption:R,refetchResources:V,refetchEvents:I,getEvents:j,getEventById:ee,addEvent:K,updateEvent:T,removeEventById:Y,getView:X,unselect:ae,dateFromPoint:he,gotoDate:ne,next:M,prev:J},H=_f();let te;var z=pe(H);vf(z,{});var N=rt(z,2);Vn(N,()=>i(d),(q,ve)=>{ve(q,{})});var $e=rt(N,2);return ft($e,17,()=>i(a),Lt,(q,ve)=>{var er=Qe(),Nr=Se(er);Vn(Nr,()=>i(ve),(Ul,Bl)=>{Bl(Ul,{})}),B(q,er)}),re(H),fe(q=>{Z(H,1,Jt([i(x).calendar,i(x).view,i(v)&&i(x)[i(v)],i(k)&&i(x).customScrollbars])),et(H,"role",q),te=Sr(H,"",te,{height:i(y)})},[()=>i(l).includes("list")?"list":"table"]),B(e,H),Ke(ot)}function $f(e){"weekNumbers"in e||_e(e,{weekNumbers:!1,weekNumberContent:void 0})}function yf(e){return()=>{let{viewDates:t,options:{duration:r,hiddenDays:n}}=e,o;return D(()=>o=r.months||r.inWeeks?7-n.length:t.length),o}}function bf(e,t){return()=>{let{options:{highlightedDates:r,validRange:n},viewDates:o}=e,{colsCount:s}=t,a=[];return D(()=>{let l=[],c=1,p=1;for(let v of o)l.push({gridColumn:c,gridRow:p,resource:void 0,dayStart:v,dayEnd:Ht(W(v)),disabled:bn(v,n),highlight:r.some(h=>Ye(h,v))}),c===s&&(a.push(l),l=[],c=0,++p),++c}),a}}function wf(e,t){return()=>{let{filteredEvents:r}=e,{grid:n}=t,o=[],s=[];return D(()=>{for(let a of r)for(let l of n)Qt(a.display)?a.allDay&&(s=s.concat(mn(a,l))):o=o.concat(mn(a,l));vl(o)}),{chunks:o,bgChunks:s}}}function xf(e,t){return()=>{let{iEvents:r}=e,{grid:n}=t,o=[];for(let[,s]of r)s&&D(()=>{for(let a of n)o=o.concat(mn(s,a,!1))});return o}}var Ef=class{#e;get colsCount(){return i(this.#e)}set colsCount(e){b(this.#e,e)}#t;get grid(){return i(this.#t)}set grid(e){b(this.#t,e)}#r;get gridEl(){return i(this.#r)}set gridEl(e){b(this.#r,e,!0)}#n;get chunks(){return i(this.#n)}set chunks(e){b(this.#n,e)}#i;get bgChunks(){return i(this.#i)}set bgChunks(e){b(this.#i,e)}#o;get iChunks(){return i(this.#o)}set iChunks(e){b(this.#o,e)}#a;get intlDayCell(){return i(this.#a)}set intlDayCell(e){b(this.#a,e)}#s;get intlDayPopover(){return i(this.#s)}set intlDayPopover(e){b(this.#s,e)}#l;get popupDay(){return i(this.#l)}set popupDay(e){b(this.#l,e,!0)}constructor(e){this.#e=f(yf(e)),this.#t=f(bf(e,this)),this.#r=F();let t=f(wf(e,this)),r=f(()=>i(t).chunks),n=f(()=>i(t).bgChunks);this.#n=f(()=>i(r)),this.#i=f(()=>i(n)),this.#o=f(xf(e,this)),this.hiddenChunks=new vn,this.#a=f(Ar(e,"dayCellFormat")),this.#s=f(Ar(e,"dayPopoverFormat")),this.#l=F(null)}},kf=U("<div><!></div>");function Tl(e,t){Xe(t,!0);let r=Ae(t,"el",15),n=Ae(t,"allDay",3,!1),o=Ae(t,"resource",3,void 0),s=Ae(t,"dateFromPoint",3,()=>t.date),a=Ae(t,"classes",3,Ni),l=Ae(t,"disabled",3,!1),c=Ae(t,"highlight",3,!1),p=Ae(t,"role",3,"cell"),v=Ae(t,"noIeb",3,!1),h=Ae(t,"noBeb",3,!1),u=Ae(t,"defaultContent",3,void 0),d=f(()=>xe("state")),g=f(()=>i(d).today),$=f(()=>i(d).snippets),_=f(()=>i(d).interaction.action),y=f(()=>i(d).options.dayCellContent),w=f(()=>i(d).options.theme),k=f(()=>xe("view-state")),x=f(()=>i(k).snap),C=f(()=>Ye(t.date,i(g))),E=f(()=>yn(i(y),()=>({allDay:n(),date:Ne(t.date),isToday:i(C),resource:o()}),u(),i($).dayCellContent)),R=f(()=>a()([i(w).day,i(w).weekdays?.[t.date.getUTCDay()],i(C)&&i(w).today,c()&&i(w).highlight,l()&&i(w).disabled,v()&&i(w).noIeb,h()&&i(w).noBeb]));Ci(()=>{ll(r(),(T,Y)=>({allDay:n(),date:s()(T,Y),resource:o(),dayEl:r(),disabled:l()}))});let V=f(()=>!l()&&i(_)?T=>i(_).select(T,i(x)):void 0);var I=kf(),j=pe(I),ee=T=>{var Y=Qe(),X=Se(Y);ut(X,()=>t.content,()=>i(E)),B(T,Y)},K=T=>{var Y=Qe(),X=Se(Y);ut(X,()=>i(E).snippet??ue,()=>i(E).arg),B(T,Y)};Tt(j,T=>{t.content?T(ee):T(K,-1)}),re(I),_r(I,T=>r(T),()=>r()),Fe(I,()=>t.content?null:Ct(i(E).content,i(E).snippet)),fe(()=>{Z(I,1,Jt(i(R))),et(I,"role",p())}),Ve("pointerdown",I,function(...T){i(V)?.apply(this,T)}),B(e,I),Ke()}Xt(["pointerdown"]);var Tf=U("<div><!></div>"),Cf=U("<article><!></article>");function Cl(e,t){Xe(t,!0);let r=Ae(t,"el",15),n=Ae(t,"classes",3,Ni),o=Ae(t,"styles",3,Ni),s=f(()=>xe("state")),a=f(()=>i(s).intlEventTime),l=f(()=>i(s).resources),c=f(()=>i(s).snippets),p=f(()=>i(s).view),v=f(()=>i(s).options.displayEventEnd),h=f(()=>i(s).options.eventBackgroundColor),u=f(()=>i(s).options.eventColor),d=f(()=>i(s).options.eventContent),g=f(()=>i(s).options.eventClick),$=f(()=>i(s).options.eventDidMount),_=f(()=>i(s).options.eventClassNames),y=f(()=>i(s).options.eventMouseEnter),w=f(()=>i(s).options.eventMouseLeave),k=f(()=>i(s).options.eventTextColor),x=f(()=>i(s).options.theme),C=f(()=>t.chunk.event),E=f(()=>t.chunk.event.display),R=f(()=>i(C).backgroundColor??yl(t.chunk.resource??Ga(i(C),i(l)))??i(h)??i(u)),V=f(()=>i(C).textColor??bl(t.chunk.resource??Ga(i(C),i(l)))??i(k)),I=f(()=>pd(o()({"background-color":i(R),color:i(V)})).map(H=>`${H[0]}:${H[1]}`).concat(i(C).styles).join(";")),j=f(()=>{let H=[Qt(i(E))?i(x).bgEvent:i(x).event];if(i(C).allDay){Ye(pt(W(t.chunk.start)),i(C).start)||H.push(i(x).startClipped);let te=W(t.chunk.end),z=W(i(C).end);te.setUTCSeconds(te.getUTCSeconds()-1),z.setUTCSeconds(z.getUTCSeconds()-1),Ye(pt(te),pt(z))||H.push(i(x).endClipped)}else Ye(t.chunk.start,i(C).start)||H.push(i(x).startClipped),Ye(t.chunk.end,i(C).end)||H.push(i(x).endClipped);return n()(H.concat(Ad(i(_),i(C),i(p))))}),ee=f(()=>Sd(t.chunk,i(v),i(a))),K=f(()=>yn(i(d),()=>({event:Pt(i(C)),timeText:i(ee),view:ar(i(p))}),()=>Rd(t.chunk,i(ee),i(x)),i(c).eventContent));Ci(()=>{we(i($))&&i($)({event:Pt(i(C)),timeText:i(ee),el:r(),view:ar(i(p))})});function T(H,te){return we(H)&&!ul(te)?z=>H({event:Pt(i(C)),el:r(),jsEvent:z,view:ar(i(p))}):void 0}let Y=f(()=>!Qt(i(E))&&T(i(g),i(E))||void 0),X=f(()=>i(Y)&&Wo(i(Y))),ae=f(()=>T(i(y),i(E))),he=f(()=>T(i(w),i(E)));var ne=Cf();{let H=te=>{var z=Tf(),N=pe(z);ut(N,()=>i(K).snippet??ue,()=>i(K).arg),re(z),Fe(z,()=>Ct(i(K).content,i(K).snippet)),fe(()=>Z(z,1,Jt(i(x).eventBody))),B(te,z)};var M=pe(ne),J=te=>{var z=Qe(),N=Se(z);ut(N,()=>t.body,()=>H,()=>i(R),()=>i(V)),B(te,z)},ot=te=>{H(te)};Tt(M,te=>{t.body?te(J):te(ot,-1)}),re(ne),_r(ne,te=>r(te),()=>r())}fe(()=>{Z(ne,1,Jt(i(j))),Sr(ne,i(I)),et(ne,"role",i(Y)?"button":void 0),et(ne,"tabindex",i(Y)?0:void 0)}),Ve("click",ne,function(...H){i(Y)?.apply(this,H)}),Ve("keydown",ne,function(...H){i(X)?.apply(this,H)}),pn("mouseenter",ne,function(...H){i(ae)?.apply(this,H)}),pn("mouseleave",ne,function(...H){i(he)?.apply(this,H)}),Ve("pointerdown",ne,function(...H){t.onpointerdown?.apply(this,H)}),B(e,ne),Ke()}Xt(["click","keydown","pointerdown"]);var gC=U("<div><!></div>");var _C=U("<time></time>");function Df(e,t){Xe(t,!0);let r=Ae(t,"el",15),n=f(()=>xe("state")),o=f(()=>i(n).iClasses),s=f(()=>i(n).interaction.action),a=f(()=>i(n).interaction.resizer),l=f(()=>xe("view-state")),c=f(()=>i(l).snap),p=f(()=>t.chunk.event),v=f(()=>t.chunk.event.display),h=f(()=>g=>i(o)(g,i(p)));function u(g){return i(s)?.draggable(g)?$=>i(s).drag(g,$,t.forceDate,t.forceMargin,i(c)):i(s)?.noAction}let d=f(()=>!Qt(i(v))&&!ul(i(v))?u(i(p)):void 0);Cl(e,{get chunk(){return t.chunk},get classes(){return i(h)},get styles(){return t.styles},get onpointerdown(){return i(d)},get el(){return r()},set el($){r($)},body:($,_=ue)=>{var y=Qe(),w=Se(y),k=C=>{var E=Qe(),R=Se(E);Vn(R,()=>i(a),(V,I)=>{I(V,{get chunk(){return t.chunk},get axis(){return t.axis},get forceDate(){return t.forceDate},get forceMargin(){return t.forceMargin},children:(j,ee)=>{var K=Qe(),T=Se(K);ut(T,_),B(j,K)},$$slots:{default:!0}})}),B(C,E)},x=C=>{var E=Qe(),R=Se(E);ut(R,_),B(C,E)};Tt(w,C=>{i(a)?C(k):C(x,-1)}),B($,y)},$$slots:{body:!0}}),Ke()}var Sf=U("<span><!></span>"),Rf=U('<a role="button" tabindex="0" aria-haspopup="dialog"><!></a>'),Af=U("<div><time><!></time> <!></div> <div><!></div>",1);function Nf(e,t){Xe(t,!0);let r=xe("state"),n=xe("view-state");f(()=>r.features);let o=f(()=>r.snippets),s=f(()=>r.options.date),a=f(()=>r.options.firstDay),l=f(()=>r.options.moreLinkContent),c=f(()=>r.options.theme),p=f(()=>r.options.weekNumbers),v=f(()=>r.options.weekNumberContent),h=f(()=>n.hiddenChunks),u=f(()=>n.intlDayCell),d=f(()=>t.day.dayStart),g=f(()=>t.day.disabled),$=f(()=>t.day.highlight),_=f(()=>i(d).getUTCMonth()!==i(s).getUTCMonth()),y=f(()=>R=>[...R,i(_)&&i(c).otherMonth]),w=f(()=>i(p)&&i(d).getUTCDay()===(i(a)?1:0)),k=f(()=>i(w)?wd(il(i(d),i(a)),i(d),i(v),i(o).weekNumberContent):{}),x=f(()=>i(h).get($r(i(d)))),C=f(()=>{if(!i(x))return{};let R=i(x).length,V="+"+R+" more";return yn(i(l),()=>({num:R,text:V}),V,i(o).moreLinkContent)});function E(){n.popupDay=t.day}Tl(e,{get date(){return i(d)},allDay:!0,get classes(){return i(y)},get disabled(){return i(g)},get highlight(){return i($)},get noIeb(){return t.noIeb},get noBeb(){return t.noBeb},defaultContent:()=>i(u).format(i(d)),content:(V,I=ue)=>{var j=Af(),ee=Se(j),K=pe(ee),T=pe(K);ut(T,()=>I().snippet??ue,()=>I().arg),re(K),Fe(K,()=>Ct(I().content,I().snippet));var Y=rt(K,2),X=M=>{var J=Sf(),ot=pe(J);ut(ot,()=>i(k).snippet??ue,()=>i(k).arg),re(J),Fe(J,()=>Ct(i(k).content,i(k).snippet)),fe(()=>Z(J,1,i(c).weekNumber)),B(M,J)};Tt(Y,M=>{i(w)&&M(X)}),re(ee);var ae=rt(ee,2),he=pe(ae),ne=M=>{var J=Rf(),ot=f(()=>Bo(E)),H=f(()=>Wo(E)),te=f(Bo),z=pe(J);ut(z,()=>i(C).snippet??ue,()=>i(C).arg),re(J),Fe(J,()=>Ct(i(C).content,i(C).snippet)),Ve("click",J,function(...N){i(ot)?.apply(this,N)}),Ve("keydown",J,function(...N){i(H)?.apply(this,N)}),Ve("pointerdown",J,function(...N){i(te)?.apply(this,N)}),B(M,J)};Tt(he,M=>{i(x)&&M(ne)}),re(ae),fe(M=>{Z(ee,1,i(c).dayHead),et(K,"datetime",M),Z(ae,1,i(c).dayFoot)},[()=>mr(i(d),10)]),B(V,j)},$$slots:{content:!0}}),Ke()}Xt(["click","keydown","pointerdown"]);function Ai(e,t){Xe(t,!0);let r=Ae(t,"inPopup",3,!1),n=f(()=>xe("state")),o=f(()=>i(n).options.dayMaxEvents),s=f(()=>i(n).options.eventGap),a=f(()=>xe("view-state")),l=f(()=>i(a).colsCount),c=f(()=>i(a).gridEl),p=f(()=>i(a).hiddenChunks),v=f(()=>i(a).popupDay),h=F(void 0),u=F(1),d=F(!1),g=f(()=>t.chunk.event),$=f(()=>t.chunk.event.display);function _(){return i(c).children.item((t.chunk.gridRow-1)*i(l)+t.chunk.gridColumn-1)}$t(()=>{!r()&&(pl(i($))||hl(i($)))&&b(u,Yn(_().firstElementChild)||1,!0)});let y=f(()=>E=>{if(E["grid-column"]=`${t.chunk.gridColumn} / span ${t.chunk.dates.length}`,E["grid-row"]=t.chunk.gridRow,!Qt(i($))){let R=r()?1:i(u);if(i(g)._margin){let[V,I]=i(g)._margin;V>R&&t.chunk.gridRow===I&&(R=V)}E["margin-block-start"]=`${R}px`}return i(d)&&(E.visibility="hidden"),E});function w(){b(u,Md(t.chunk,Yn(i(h)),Yn(_().firstElementChild)||1,i(s)),!0)}function k(){if(i(o)===!0){let E=_(),R=Yn(E)-x(E);if(b(d,t.chunk.bottom>R),i(d))for(let V of t.chunk.dates){let I=$r(V);if(i(p).has(I)){let j=i(p).get(I);j.includes(t.chunk)||i(p).set(I,[...j,t.chunk])}else i(p).set(I,[t.chunk])}}else b(d,!1),i(p).size&&i(p).clear()}function x(E){let R=0;for(let V=0;V<t.chunk.dates.length&&(R=Rr(R,Yn(E.lastElementChild)),E=E.nextElementSibling,!!E);++V);return R}var C={reposition:w,hide:k};{let E=f(()=>r()&&i(v).dayStart),R=f(()=>[i(u),t.chunk.gridRow]);Df(e,{get chunk(){return t.chunk},get styles(){return i(y)},axis:"x",get forceDate(){return i(E)},get forceMargin(){return i(R)},get el(){return i(h)},set el(V){b(h,V,!0)}})}return Ke(C)}var Of=U('<dialog closedby="closerequest"><header><time></time>  <a role="button" tabindex="0">&times;</a></header> <div></div></dialog>');function If(e,t){Xe(t,!0);let r=xe("view-state"),n=f(()=>xe("state")),o=f(()=>i(n).interaction),s=f(()=>i(n).options.buttonText),a=f(()=>i(n).options.theme),l=f(()=>r.colsCount),c=f(()=>r.chunks),p=f(()=>r.gridEl),v=f(()=>r.intlDayPopover),h=f(()=>r.popupDay),u=F(void 0),d=F(""),g=f(()=>i(h).gridColumn),$=f(()=>i(h).gridRow),_=f(()=>i(h).dayStart),y=f(()=>i(h).dayEnd),w=f(()=>{let Y=[];for(let X of i(c))X.gridRow===i($)&&X.gridColumn<=i(g)&&X.gridColumn+X.dates.length>i(g)&&Y.push(_e({},X,Wn(X.event,i(_),i(y))));return Y.sort((X,ae)=>X.top-ae.top),Y});Ci(()=>{i(u).show()}),$t(()=>{i(w).length?D(k):x()});function k(){let Y=i(p).children.item((i($)-1)*i(l)+i(g)-1),X=Ri(i(u)),ae=Ri(Y),he=Ri(i(p));b(d,"");let ne;if(X.width>=he.width){ne=he.left-ae.left;let J=ae.right-he.right;b(d,i(d)+`inset-inline-end:${J}px;`)}else ne=(ae.width-X.width)/2,ae.left+ne<he.left?ne=he.left-ae.left:ae.left+ne+X.width>he.right&&(ne=he.right-ae.left-X.width);b(d,i(d)+`inset-inline-start:${ne}px;`);let M;X.height>=he.height?(M=he.top-ae.top,b(d,i(d)+`block-size:${he.height}px;`)):(M=(ae.height-X.height)/2,ae.top+M<he.top?M=he.top-ae.top:ae.top+M+X.height>he.bottom&&(M=he.bottom-ae.top-X.height)),b(d,i(d)+`inset-block-start:${M}px;`)}function x(){r.popupDay=null}function C(){x(),i(o).action?.noClick()}var E=Of();let R;var V=pe(E),I=pe(V);Fe(I,()=>Ct(i(v).format(i(_))));var j=rt(I,2);li(j,!0);var ee=f(()=>Bo(x)),K=f(()=>Wo(x));re(V);var T=rt(V,2);ft(T,21,()=>i(w),Lt,(Y,X)=>{Ai(Y,{get chunk(){return i(X)},inPopup:!0})}),re(T),re(E),_r(E,Y=>b(u,Y),()=>i(u)),Fe(E,()=>fd("pointerdown")),fe(Y=>{Z(E,1,i(a).popup),R=Sr(E,i(d),R,{"grid-area":`${i($)+1} / ${i(g)}`}),Z(V,1,i(a).dayHead),et(I,"datetime",Y),et(j,"aria-label",i(s).close),Z(T,1,i(a).events)},[()=>mr(i(_),10)]),pn("pointerdownoutside",E,C),pn("close",E,x),Ve("click",j,function(...Y){i(ee)?.apply(this,Y)}),Ve("keydown",j,function(...Y){i(K)?.apply(this,Y)}),B(e,E),Ke()}Xt(["click","keydown"]);var Mf=U('<div role="columnheader"><span></span></div>'),Lf=U('<section><header><div role="row"></div></header> <div><div></div> <div><!> <!> <!></div></div> <!></section>');function qo(e,t){Xe(t,!0);let r=xe("state"),n=new Ef(r);Dn("view-state",n);let o=f(()=>r.intlDayHeader),s=f(()=>r.intlDayHeaderAL),a=f(()=>r.options.dayMaxEvents),l=f(()=>r.options.eventGap),c=f(()=>r.options.theme),p=f(()=>n.grid),v=f(()=>n.chunks),h=f(()=>n.bgChunks),u=f(()=>n.iChunks),d=f(()=>n.hiddenChunks),g=f(()=>n.popupDay),$=[];function _(){Od($,i(v)),i(d).clear(),gr().then(y)}function y(){i(d).size,$.forEach(E=>E?.hide())}$t(()=>{i(l),i(v),gr().then(_)}),$t(y);var w=Qe(),k=Se(w),x=E=>{var R=Lf();let V;var I=pe(R),j=pe(I);ft(j,21,()=>i(p)[0],Lt,(M,J,ot)=>{let H=()=>i(J).dayStart;var te=Mf();et(te,"aria-colindex",1+ot);var z=pe(te);Fe(z,()=>Ct(i(o).format(H()))),re(te),fe((N,$e)=>{Z(te,1,N),et(z,"aria-label",$e)},[()=>Jt([i(c).colHead,i(c).weekdays?.[H().getUTCDay()]]),()=>i(s).format(H())]),B(M,te)}),re(j),re(I);var ee=rt(I,2),K=pe(ee);ft(K,21,()=>i(p),Lt,(M,J,ot)=>{var H=Qe(),te=Se(H);ft(te,17,()=>i(J),Lt,(z,N,$e)=>{{let q=f(()=>$e+1===qr(i(J))),ve=f(()=>ot+1===qr(i(p)));Nf(z,{get day(){return i(N)},get noIeb(){return i(q)},get noBeb(){return i(ve)}})}}),B(M,H)}),re(K),_r(K,M=>n.gridEl=M,()=>n?.gridEl);var T=rt(K,2),Y=pe(T);ft(Y,19,()=>i(v),M=>M.id,(M,J,ot)=>{_r(Ai(M,{get chunk(){return i(J)}}),(H,te)=>$[te]=H,H=>$?.[H],()=>[i(ot)])});var X=rt(Y,2);ft(X,17,()=>i(h),M=>M.id,(M,J)=>{Ai(M,{get chunk(){return i(J)}})});var ae=rt(X,2);ft(ae,17,()=>i(u),Lt,(M,J)=>{Ai(M,{get chunk(){return i(J)}})}),re(T),re(ee);var he=rt(ee,2),ne=M=>{If(M,{})};Tt(he,M=>{i(g)&&M(ne)}),re(R),_r(R,M=>r.mainEl=M,()=>r?.mainEl),Fe(R,()=>ud(_)),fe((M,J)=>{Z(R,1,Jt([i(c).main,i(a)===!0&&i(c).uniform])),V=Sr(R,"",V,{"--ec-grid-cols":M,"--ec-grid-rows":J}),Z(I,1,i(c).header),Z(j,1,i(c).grid),Z(ee,1,i(c).body),Z(K,1,i(c).grid),Z(T,1,i(c).events)},[()=>qr(i(p)[0]),()=>qr(i(p))]),B(E,R)},C=f(()=>!jr(i(p))&&!jr(i(p)[0]));Tt(k,E=>{i(C)&&E(x)}),B(e,w),Ke()}var Dl={createOptions(e){$f(e),_e(e,{dayMaxEvents:!1,dayCellFormat:{day:"numeric"},dayPopoverFormat:{month:"long",day:"numeric",year:"numeric"},moreLinkContent:void 0,view:"dayGridMonth"}),_e(e.buttonText,{dayGridDay:"day",dayGridMonth:"month",dayGridWeek:"week",close:"Close"}),_e(e.theme,{uniform:"ec-uniform",dayFoot:"ec-day-foot",otherMonth:"ec-other-month",popup:"ec-popup"}),_e(e.views,{dayGridDay:{buttonText:gl,component:()=>qo,dayHeaderFormat:{weekday:"long"},displayEventEnd:!1,duration:{days:1},theme:Gr("ec-day-grid ec-day-view")},dayGridWeek:{buttonText:_l,component:()=>qo,displayEventEnd:!1,theme:Gr("ec-day-grid ec-week-view")},dayGridMonth:{buttonText:ml,component:Pf,dayHeaderFormat:{weekday:"short"},dayHeaderAriaLabelFormat:{weekday:"long"},displayEventEnd:!1,duration:{months:1},theme:Gr("ec-day-grid ec-month-view"),titleFormat:{year:"numeric",month:"long"}}})}};function Pf(e){return e.features=["dayNumber"],e.extensions.activeRange=(t,r)=>{let{options:{firstDay:n}}=e;return{start:tl(t,n),end:yd(r,n)}},qo}var mC=U("<div></div>"),$C=U("<!> <!> <!>",1);Xt(["pointerdown"]);var yC=U("<!> <!>",1);var Ff=class{#e;get intlListDay(){return i(this.#e)}set intlListDay(e){b(this.#e,e)}#t;get intlListDaySide(){return i(this.#t)}set intlListDaySide(e){b(this.#t,e)}constructor(e){this.#e=f(Ar(e,"listDayFormat")),this.#t=f(Ar(e,"listDaySideFormat"))}},Hf=U("<div></div> <!>",1);function zf(e,t){Xe(t,!0);let r=f(()=>xe("state")),n=f(()=>i(r).interaction),o=f(()=>i(r).options.theme),s=f(()=>a=>(delete a["background-color"],delete a.color,a));{let a=(c,p=ue,v=ue,h=ue)=>{var u=Hf(),d=Se(u);let g;var $=rt(d,2);ut($,p),fe(()=>{Z(d,1,i(o).eventTag),g=Sr(d,"",g,{"background-color":v()})}),B(c,u)},l=f(()=>i(n).action?.noAction);Cl(e,{get chunk(){return t.chunk},get styles(){return i(s)},get onpointerdown(){return i(l)},body:a,$$slots:{body:!0}})}Ke()}var Uf=U("<h4><time><!></time> <time></time></h4> <!>",1);function Bf(e,t){Xe(t,!0);let r=f(()=>xe("state")),n=f(()=>i(r).filteredEvents),o=f(()=>i(r).options.highlightedDates),s=f(()=>i(r).options.theme),a=f(()=>i(r).options.validRange),l=f(()=>xe("view-state")),c=f(()=>i(l).intlListDay),p=f(()=>i(l).intlListDaySide),v=f(()=>i(o).some(y=>Ye(y,t.date))),h=f(()=>bn(t.date,i(a))),u=f(()=>mr(t.date,10)),d=f(()=>{let y=[];if(!i(h)){let w=t.date,k=Ht(W(t.date));for(let x of i(n))if(!Qt(x.display)&&_n(x,w,k)){let C=Wn(x,w,k);y.push(C)}}return y});var g=Qe(),$=Se(g),_=y=>{Tl(y,{get date(){return t.date},allDay:!0,role:"listitem",get disabled(){return i(h)},get highlight(){return i(v)},defaultContent:()=>i(c).format(t.date),content:(k,x=ue)=>{var C=Uf(),E=Se(C),R=pe(E),V=pe(R);ut(V,()=>x().snippet??ue,()=>x().arg),re(R),Fe(R,()=>Ct(x().content,x().snippet));var I=rt(R,2);Fe(I,()=>Ct(i(p).format(t.date))),re(E);var j=rt(E,2);ft(j,17,()=>i(d),ee=>ee.event,(ee,K)=>{zf(ee,{get chunk(){return i(K)}})}),fe(()=>{Z(E,1,i(s).dayHead),et(R,"datetime",i(u)),Z(I,1,i(s).daySide),et(I,"datetime",i(u))}),B(k,C)},$$slots:{content:!0}})};Tt($,y=>{i(d).length&&y(_)}),B(e,g),Ke()}var Vf=U("<div><!></div>"),Yf=U("<section><!></section>");function qf(e,t){Xe(t,!0);let r=xe("state"),n=new Ff(r);Dn("view-state",n);let o=f(()=>r.filteredEvents),s=f(()=>r.snippets),a=f(()=>r.view),l=f(()=>r.viewDates),c=f(()=>r.options.noEventsClick),p=f(()=>r.options.noEventsContent),v=f(()=>r.options.theme),h=f(()=>{let w=!0;if(!jr(i(l))){let k=i(l)[0],x=Ht(W(i(l).at(-1)));for(let C of i(o))if(!Qt(C.display)&&C.start<x&&C.end>k){w=!1;break}}return w}),u=f(()=>yn(i(p),void 0,void 0,i(s).noEventsContent));function d(w){we(i(c))&&i(c)({jsEvent:w,view:ar(i(a))})}var g=Yf(),$=pe(g),_=w=>{var k=Vf(),x=pe(k);ut(x,()=>i(u).snippet??ue,()=>i(u).arg),re(k),Fe(k,()=>Ct(i(u).content,i(u).snippet)),fe(()=>Z(k,1,i(v).noEvents)),Ve("click",k,d),B(w,k)},y=w=>{var k=Qe(),x=Se(k);ft(x,17,()=>i(l),Lt,(C,E)=>{Bf(C,{get date(){return i(E)}})}),B(w,k)};Tt($,w=>{i(h)?w(_):w(y,-1)}),re(g),_r(g,w=>r.mainEl=w,()=>r?.mainEl),fe(()=>Z(g,1,i(v).main)),B(e,g),Ke()}Xt(["click"]);var Sl={createOptions(e){_e(e,{listDayFormat:{weekday:"long"},listDaySideFormat:{year:"numeric",month:"long",day:"numeric"},noEventsClick:void 0,noEventsContent:"No events",view:"listWeek"}),_e(e.buttonText,{listDay:"day",listWeek:"week",listMonth:"month",listYear:"year"}),_e(e.theme,{daySide:"ec-day-side",eventTag:"ec-event-tag",noEvents:"ec-no-events"}),_e(e.views,{listDay:{buttonText:gl,component:Si,duration:{days:1},theme:Gr("ec-list ec-day-view"),titleFormat:{year:"numeric",month:"long",day:"numeric"}},listWeek:{buttonText:_l,component:Si,duration:{weeks:1},theme:Gr("ec-list ec-week-view")},listMonth:{buttonText:ml,component:Si,duration:{months:1},theme:Gr("ec-list ec-month-view"),titleFormat:{year:"numeric",month:"long"}},listYear:{buttonText:Pd,component:Si,duration:{years:1},theme:Gr("ec-list ec-year-view"),titleFormat:{year:"numeric"}}})}};function Si(e){return e.features=["list"],qf}function Go(e,t,r=!0){let n=[];for(let{gridColumn:o,gridRow:s,resource:a,start:l,end:c,disabled:p}of t)if(!p&&_n(e,l,c,a)){let v=Wn(e,l,c);_e(v,{gridColumn:o,gridRow:s,resource:a,top:(v.start-l)/1e3,height:(v.end-v.start)/1e3,maxHeight:(c-v.start)/1e3}),r&&Qo(v),n.push(v)}return n}function Gf(e){let t={};for(let r of e){let{gridColumn:n}=r,o=t[n],s=0;if(o&&r.start<o.end){for(;s<o.columns.length&&!(o.columns[s].at(-1).end<=r.start);++s);r.end>o.end&&(o.end=r.end)}else o={columns:[],end:r.end};o.columns.length<s+1&&o.columns.push([]),o.columns[s].push(r),t[n]=o,r.group=o,r.groupColumn=s}}function Wf(e,t){return()=>{let{viewDates:r,options:{highlightedDates:n,validRange:o}}=e,{slotTimeLimits:s}=t,a=[];return D(()=>{let l=1;for(let c of r)a.push({gridColumn:l,gridRow:1,resource:void 0,start:it(W(c),s.min),end:it(W(c),s.max),dayStart:c,dayEnd:Ht(W(c)),disabled:bn(c,o),highlight:n.some(p=>Ye(p,c))}),++l}),[a]}}function jf(e,t){return()=>{let{filteredEvents:r}=e,{grid:n}=t,o=[],s=[],a=[],l=[];return D(()=>{for(let c of r)for(let p of n)Qt(c.display)?(s=s.concat(Go(c,p)),c.allDay&&(l=l.concat(mn(c,p)))):c.allDay?a=a.concat(mn(c,p)):o=o.concat(Go(c,p));Gf(o),vl(a)}),{chunks:o,bgChunks:s,allDayChunks:a,allDayBgChunks:l}}}function Xf(e,t){return()=>{let{iEvents:r}=e,{grid:n}=t,o=[],s=[];for(let[,a]of r)a&&D(()=>{for(let l of n)a.allDay?s=s.concat(mn(a,l,!1)):o=o.concat(Go(a,l,!1))});return{iChunks:o,allDayIChunks:s}}}function Kf(e){return()=>{let{filteredEvents:t,viewDates:r,options:{flexibleSlotTimeLimits:n,slotMinTime:o,slotMaxTime:s}}=e,a;return D(()=>{a=xl(o,s,n,r,t)}),a}}function Zf(e){return()=>{let{options:{slotDuration:t,slotLabelInterval:r}}=e,n;return D(()=>{n=r===void 0?He(t)<3600?2:1:vd(He(r)/He(t))||1}),n}}function Jf(e,t){return()=>{let{offset:r,options:{slotDuration:n}}=e,{intlSlotLabel:o,slotLabelPeriodicity:s,slotTimeLimits:a}=t,l;return D(()=>{l=wl(pt(Ft(void 0,r)),n,s,a,o)}),l}}function Qf(e){return()=>{let{options:{slotDuration:t,snapDuration:r}}=e;return r??=t,{duration:r,ratio:He(r)/He(t)}}}function ts(){return class{#e;get intlSlotLabel(){return i(this.#e)}set intlSlotLabel(e){b(this.#e,e)}#t;get slotLabelPeriodicity(){return i(this.#t)}set slotLabelPeriodicity(e){b(this.#t,e)}#r;get sidebarWidth(){return i(this.#r)}set sidebarWidth(e){b(this.#r,e,!0)}#n;get snap(){return i(this.#n)}set snap(e){b(this.#n,e)}constructor(e){this.#e=f(Ar(e,"slotLabelFormat")),this.#t=f(Zf(e)),this.#r=F(0),this.#n=f(Qf(e))}}}function Rl(e){return class extends e{#e;get slotTimeLimits(){return i(this.#e)}set slotTimeLimits(t){b(this.#e,t)}#t;get slots(){return i(this.#t)}set slots(t){b(this.#t,t)}#r;get chunks(){return i(this.#r)}set chunks(t){b(this.#r,t)}#n;get bgChunks(){return i(this.#n)}set bgChunks(t){b(this.#n,t)}#i;get allDayChunks(){return i(this.#i)}set allDayChunks(t){b(this.#i,t)}#o;get allDayBgChunks(){return i(this.#o)}set allDayBgChunks(t){b(this.#o,t)}#a;get iChunks(){return i(this.#a)}set iChunks(t){b(this.#a,t)}#s;get allDayIChunks(){return i(this.#s)}set allDayIChunks(t){b(this.#s,t)}constructor(t){super(t),this.#e=f(Kf(t)),this.#t=f(Jf(t,this));let r=f(jf(t,this)),n=f(()=>i(r).chunks),o=f(()=>i(r).bgChunks),s=f(()=>i(r).allDayChunks),a=f(()=>i(r).allDayBgChunks);this.#r=f(()=>i(n)),this.#n=f(()=>i(o)),this.#i=f(()=>i(s)),this.#o=f(()=>i(a));let l=f(Xf(t,this)),c=f(()=>i(l).iChunks),p=f(()=>i(l).allDayIChunks);this.#a=f(()=>i(c)),this.#s=f(()=>i(p))}}}var bC=class extends Rl(ts()){#e;get grid(){return i(this.#e)}set grid(e){b(this.#e,e)}constructor(e){super(e),this.#e=f(Wf(e,this))}},eu;function tu(e){return()=>{let{activeRange:t,filteredEvents:r,resources:n,options:{filterResourcesWithEvents:o},extensions:{viewResources:s}}=e,a=s?s(n):n;return D(()=>{o&&(a=n.filter(l=>r.some(c=>!Qt(c.display)&&_n(c,t.start,t.end,l)))),a.length||(a=eu??=es([{}]))}),a}}function ru(e,t){return()=>{let{viewDates:r,options:{datesAboveResources:n,highlightedDates:o,validRange:s}}=e,{slotTimeLimits:a,viewResources:l}=t,c=[];return D(()=>{let p=1,v=[l,r],h=[Qa,$r];n&&(v.reverse(),h.reverse());for(let u of v[0]){let d=[],g=h[0](u);for(let $ of v[1]){let _=n?u:$,y=n?$:u;d.push({gridColumn:p,gridRow:1,resource:y,key:h[1]($),groupKey:g,start:it(W(_),a.min),end:it(W(_),a.max),dayStart:_,dayEnd:Ht(W(_)),disabled:bn(_,s),highlight:o.some(w=>Ye(w,_))}),++p}c.push(d)}}),c}}function Al(e){return class extends e{#e;get viewResources(){return i(this.#e)}set viewResources(t){b(this.#e,t)}constructor(t){super(t),this.#e=f(tu(t))}}}var wC=class extends Al(Rl(ts())){#e;get grid(){return i(this.#e)}set grid(e){b(this.#e,e)}constructor(e){super(e),this.#e=f(ru(e,this))}},xC=U("<span><!></span>");var EC=U("<div></div>");var kC=U('<div><aside><!></aside> <div role="row"></div> <div><!> <!> <!></div></div>'),TC=U("<div><time></time></div>"),CC=U('<section><header><aside></aside> <div role="row"><!></div> <!></header> <div role="rowgroup"><aside aria-hidden="true"></aside> <div role="row"></div> <div><!> <!> <!></div></div> <!></section>');var DC=U("<!> <!>",1);function nu(e,t){let r=0,n=t.length;for(;r<n;){let o=r+n>>1;t[o].dayEnd>e.start?n=o:r=o+1}for(;r>0&&t[r-1].end>e.start;)--r;return r}function Nl(e,t,r,n=!0){let o=[],s,a,l,c,p,v,h=0;for(let u=nu(e,t);u<t.length;++u){let{gridColumn:d,gridRow:g,resource:$,dayStart:_,dayEnd:y,start:w,end:k,disabled:x}=t[u];if(_>=e.end)break;x||(r?_n(e,_,y,$)&&(o.length||(s=_,l=d,c=g,p=$),o.push(_),a=y):_n(e,w,k,$)&&(o.length||(s=w,l=d,c=g,p=$,v=Rr(e.start-w,0)/1e3),o.push(_),a=k,h+=(qn(k,e.end)-Rr(w,e.start))/1e3))}if(o.length){let u=Wn(e,s,a);return _e(u,{gridColumn:l,gridRow:c,resource:p,dates:o,left:v,width:h}),n&&Qo(u),u}return null}function Ol(e,t){let r=t[0]?.resource;return!r||e.resourceIds.includes(r.id)}function iu(e,t){let r=[],n={};for(let a of e){let{gridColumn:l,gridRow:c,dates:p,start:v,end:h,event:{layoutGroup:u}}=a;a.span=t?[l,l+p.length]:[+v,+h];let d;if(u!==void 0){let g=`${c}_${u}`;d=n[g],d||(d=Za(a,r),n[g]=d)}else d=Za(a,r);a.rivals=d.chunks.filter(g=>Po(g.span,a.span)),d.chunks.push(a),ou(d.span,a.span),d.startColumn=qn(d.startColumn,l),d.endColumn=Rr(d.endColumn,l+p.length)}let o=[],s=(a,l)=>(o[a]??=[])[l]??={spanning:[],starting:[]};for(let a of r){let{gridRow:l,startColumn:c,endColumn:p,span:v}=a,h=[],u=s(l,c);for(let d of u.spanning)Po(d.span,v)&&h.push(d);for(let d=c+1;d<p;++d)for(let g of s(l,d).starting)Po(g.span,v)&&h.push(g);a.rivals=h,u.starting.push(a);for(let d=c;d<p;++d)s(l,d).spanning.push(a)}return r}function Za(e,t){let{gridColumn:r,gridRow:n,span:o}=e,s={gridRow:n,chunks:[],span:[...o],startColumn:r,endColumn:r};return t.push(s),s}function Po([e,t],[r,n]){return e<n&&t>r}function ou(e,t){e[0]=qn(e[0],t[0]),e[1]=Rr(e[1],t[1])}function su(e,t){return()=>{let{viewDates:r,options:{highlightedDates:n,validRange:o}}=e,{dayTimeLimits:s,viewResources:a}=t,l=[];return D(()=>{let c=1;for(let p of a){let v=[],h=1;for(let u of r){let d=s[$r(u)];v.push({gridColumn:h,gridRow:c,resource:p,start:it(W(u),d.min),end:it(W(u),d.max),dayStart:u,dayEnd:Ht(W(u)),disabled:bn(u,o),highlight:n.some(g=>Ye(g,u))}),++h}l.push(v),++c}}),l}}function au(e){return e.months===1&&!e.years&&!e.days&&!e.seconds}function lu(e){return e.inWeeks&&e.days===7&&!e.years&&!e.months&&!e.seconds}function cu(e,t){return()=>{let{features:r,options:{duration:n,firstDay:o,weekNumbers:s}}=e,{grid:a}=t,l=[],c=[];return D(()=>{let p,v;if(!jr(a)){for(let{dayStart:h,gridColumn:u}of a[0])if(r.includes("month")&&(p&&p.date.getUTCMonth()===h.getUTCMonth()?++p.span:(p={date:h,gridColumn:u,span:1},l.push(p))),s){let d=il(h,o);v&&v.number===d?++v.span:(v={number:d,date:h,gridColumn:u,span:1},c.push(v))}}qr(l)===1&&au(n)&&(l=[]),qr(c)===1&&lu(n)&&(c=[])}),{months:l,weeks:c}}}function du(e,t){return()=>{let{filteredEvents:r}=e,{grid:n,monthView:o}=t,s=[],a=[],l;return D(()=>{for(let c of r){let p=Qt(c.display);if(p&&o&&!c.allDay)continue;let v=p?a:s;for(let h of n){if(!Ol(c,h))continue;let u=Nl(c,h,o);u&&v.push(u)}}l=iu(s,o)}),{chunks:s,bgChunks:a,units:l}}}function fu(e,t){return()=>{let{iEvents:r}=e,{grid:n,monthView:o}=t,s=[];for(let[,a]of r)a&&D(()=>{for(let l of n){if(!Ol(a,l))continue;let c=Nl(a,l,o,!1);c&&s.push(c)}});return s}}function uu(e){return()=>{let{filteredEvents:t,viewDates:r,options:{flexibleSlotTimeLimits:n,slotMinTime:o,slotMaxTime:s}}=e,a={};return D(()=>{for(let l of r)a[$r(l)]=xl(o,s,n,[l],t)}),a}}function pu(e,t){return()=>{let{viewDates:r,options:{slotDuration:n}}=e,{dayTimeLimits:o,intlSlotLabel:s,slotLabelPeriodicity:a}=t,l={};return D(()=>{for(let c of r){let p=$r(c);l[p]=p in o?wl(c,n,a,o[p],s):[]}}),l}}function hu(e){return()=>{let{resources:t}=e,r;return D(()=>{r=t.some(n=>cl(n).children.length)}),r}}function vu(e){return()=>{let{options:{slotDuration:t}}=e,r;return D(()=>{r=!He(t)}),r}}var SC=class extends Al(ts()){#e;get dayTimeLimits(){return i(this.#e)}set dayTimeLimits(e){b(this.#e,e)}#t;get daySlots(){return i(this.#t)}set daySlots(e){b(this.#t,e)}#r;get grid(){return i(this.#r)}set grid(e){b(this.#r,e)}#n;get extraHeads(){return i(this.#n)}set extraHeads(e){b(this.#n,e)}#i;get intlMonthHeader(){return i(this.#i)}set intlMonthHeader(e){b(this.#i,e)}#o;get monthView(){return i(this.#o)}set monthView(e){b(this.#o,e)}#a;get chunks(){return i(this.#a)}set chunks(e){b(this.#a,e)}#s;get bgChunks(){return i(this.#s)}set bgChunks(e){b(this.#s,e)}#l;get units(){return i(this.#l)}set units(e){b(this.#l,e)}#d;get iChunks(){return i(this.#d)}set iChunks(e){b(this.#d,e)}#c;get nestedResources(){return i(this.#c)}set nestedResources(e){b(this.#c,e)}constructor(e){super(e),this.#e=f(uu(e)),this.#t=f(pu(e,this)),this.#r=f(su(e,this)),this.#n=f(cu(e,this)),this.#i=f(Ar(e,"monthHeaderFormat")),this.#o=f(vu(e));let t=f(du(e,this)),r=f(()=>i(t).chunks),n=f(()=>i(t).bgChunks),o=f(()=>i(t).units);this.#a=f(()=>i(r)),this.#s=f(()=>i(n)),this.#l=f(()=>i(o)),this.#d=f(fu(e,this)),this.#c=f(hu(e))}};var RC=U("<span></span>"),AC=U("<button></button>"),NC=U("<!> <span><!></span>",1);Xt(["click"]);var OC=U("<div></div>");var IC=U("<time></time>"),MC=U("<span><!></span>"),LC=U("<div><time></time></div>"),PC=U('<div role="rowheader"><!> <!></div>'),FC=U('<section><header><aside></aside> <div role="row"><!> <!> <!> <!></div></header> <div role="rowgroup"><aside></aside> <div role="row"></div> <div><!> <!> <!></div></div> <!></section>');function Il(e,t,r){return hn(mf,{target:e,props:{plugins:t,options:r}})}function Ml(e){return zn(e)}var Ll=`/*!
 * EventCalendar v5.18.1
 * https://github.com/vkurko/calendar
 */
.ec {
    color-scheme: light;

    /* Main colors */
    --ec-color-400: oklch(70.8% 0 0);
    --ec-color-300: oklch(87% 0 0);
    --ec-color-200: oklch(92.2% 0 0);
    --ec-color-100: oklch(97% 0 0);
    --ec-color-50: oklch(98.5% 0 0);

    /* General props */
    --ec-bg-color: #fff;
    --ec-text-color: currentcolor;
    --ec-border-color: var(--ec-color-300);

    /* Buttons */
    --ec-button-bg-color: var(--ec-bg-color);
    --ec-button-border-color: var(--ec-border-color);
    --ec-button-text-color: var(--ec-text-color);
    --ec-button-active-bg-color: var(--ec-color-200);
    --ec-button-active-border-color: var(--ec-color-400);
    --ec-button-active-text-color: var(--ec-button-text-color);

    /* Days */
    --ec-today-bg-color: oklch(98.7% 0.026 102.212);
    --ec-highlight-color: oklch(98.4% 0.019 200.873);

    /* Events */
    --ec-event-bg-color: oklch(70.7% 0.165 254.624);
    --ec-event-text-color: #fff;
    --ec-bg-event-color: var(--ec-color-300);
    --ec-bg-event-opacity: 0.3;
    --ec-event-col-gap: .375rem;

    /* Now Indicator */
    --ec-now-indicator-color: oklch(63.7% 0.237 25.331);

    /* Popup */
    --ec-popup-bg-color: var(--ec-bg-color);

    .ec-dark & {
        color-scheme: dark;
        --ec-color-400: oklch(43.9% 0 0);
        --ec-color-300: oklch(37.1% 0 0);
        --ec-color-200: oklch(26.9% 0 0);
        --ec-color-100: oklch(20.5% 0 0);
        --ec-color-50: oklch(14.5% 0 0);
        --ec-bg-color: var(--ec-color-100);
        --ec-today-bg-color: oklch(28.6% 0.066 53.813);
        --ec-highlight-color: oklch(30.2% 0.056 229.695);
        --ec-bg-event-opacity: 0.5;
    }

    @media (prefers-color-scheme: dark) {
        .ec-auto-dark & {
            color-scheme: dark;
            --ec-color-400: oklch(43.9% 0 0);
            --ec-color-300: oklch(37.1% 0 0);
            --ec-color-200: oklch(26.9% 0 0);
            --ec-color-100: oklch(20.5% 0 0);
            --ec-color-50: oklch(14.5% 0 0);
            --ec-bg-color: var(--ec-color-100);
            --ec-today-bg-color: oklch(28.6% 0.066 53.813);
            --ec-highlight-color: oklch(30.2% 0.056 229.695);
            --ec-bg-event-opacity: 0.5;
        }
    }
}

.ec-day {
    --ec-day-bg-color: var(--ec-bg-color);
    background-color: var(--ec-day-bg-color);
    border: 1px solid var(--ec-border-color);
    border-block-start: none;
    border-inline-start: none;

    &.ec-today {
        --ec-day-bg-color: var(--ec-today-bg-color);
    }

    &.ec-highlight {
        --ec-day-bg-color: var(--ec-highlight-color);
    }

    .ec-time-grid .ec-body & {
        background-image:
                linear-gradient(to top, var(--ec-day-bg-color) 1px, transparent 1px),
                linear-gradient(to top, var(--ec-border-color) 1px, transparent 1px),
                linear-gradient(to right, var(--ec-day-bg-color) 1px, transparent 1px),
                linear-gradient(to top, var(--ec-border-color) 1px, transparent 1px);
        background-size:
                100% 100%,
                100% calc(var(--ec-slot-height) * var(--ec-slot-label-periodicity)),
                2px 100%,
                100% var(--ec-slot-height);
    }

    .ec-timeline:not(.ec-month-view, .ec-year-view) .ec-body & {
        --ec-last-line-color: transparent;
        --ec-direction: to left;
        [dir="rtl"] & {
            --ec-direction: to right;
        }
        background-image:
                linear-gradient(var(--ec-direction), var(--ec-last-line-color) 1px, transparent 1px),
                linear-gradient(var(--ec-direction), var(--ec-border-color) 1px, transparent 1px),
                linear-gradient(var(--ec-day-bg-color) 1px, transparent 1px),
                linear-gradient(var(--ec-direction), var(--ec-border-color) 1px, transparent 1px);
        background-size:
                100% 100%,
                calc(var(--ec-slot-width) * var(--ec-slot-label-periodicity)) 100%,
                100% 2px,
                var(--ec-slot-width) 100%;
        border-inline: none;

        &.ec-no-ieb {
            --ec-last-line-color: var(--ec-day-bg-color);
        }
    }

    .ec-day-grid & {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-block-size: 5em;
    }

    .ec-day-grid .ec-uniform & {
        min-block-size: auto;
    }

    .ec-list & {
        border-inline: none;

        &:last-child {
            border: none;
        }
    }

    &.ec-no-ieb {
        border-inline-end: none;
    }

    &.ec-no-beb {
        border-block-end: none;
    }
}

.ec-day-head {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;

    .ec-day-grid.ec-month-view & {
        padding: .375rem;
    }

    .ec-day.ec-other-month & time {
        opacity: .3;
    }

    .ec-list & {
        background-color: var(--ec-day-bg-color);
        border-block-end: 1px solid var(--ec-border-color);
        flex-direction: unset;
        margin: 0 0 -1px;
        padding: .5em 1.5em;
        position: sticky;
        inset-block-start: 0;
        z-index: 2;
    }
}

.ec-day-foot {
    padding: .18rem;
    font-size: .85em;

    a {
        cursor: pointer;
    }
}

.ec-disabled {
    position: relative;
    &:after {
        content: '';
        position: absolute;
        inset: 0 0 0 0;
        background-color: var(--ec-bg-event-color);
        opacity: var(--ec-bg-event-opacity);
    }
}

/* Toolbar */
.ec-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: 1em;

    > * {
        display: inline-flex;
        flex-wrap: wrap;
        column-gap: .75rem;
        row-gap: .5rem;
    }
}

.ec-title {
    margin: 0;
}

.ec-button {
    background-color: var(--ec-button-bg-color);
    border: 1px solid var(--ec-button-border-color);
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;

    &:not(:disabled) {
        color: var(--ec-button-text-color);
        cursor: pointer;
    }

    &:not(:disabled):hover,
    &.ec-active {
        background-color: var(--ec-button-active-bg-color);
        border-color: var(--ec-button-active-border-color);
        color: var(--ec-button-active-text-color);
        z-index: 1;  /* make all borders visible */
    }
}

.ec-button-group {
    display: inline-flex;
    vertical-align: top;

    .ec-button:not(:first-child) {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
        margin-inline-start: -1px;
    }

    .ec-button:not(:last-child) {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }
}

.ec-icon {
    display: inline-block;
    inline-size: 1em;

    &.ec-prev:after,
    &.ec-next:after {
        content: '';
        position: relative;
        inline-size: .5em;
        block-size: .5em;
        border-block-start: 2px solid currentcolor;
        border-inline-end: 2px solid currentcolor;
        display: inline-block;
    }

    &.ec-prev:after {
        inset-inline-start: 3px;
        rotate: -135deg;
    }
    [dir="rtl"] &.ec-prev:after {
        rotate: 135deg;
    }

    &.ec-next:after {
        inset-inline-start: -3px;
        rotate: 45deg;
    }
    [dir="rtl"] &.ec-next:after {
        rotate: -45deg;
    }
}

.ec-sidebar {
    position: sticky;
    inset-inline-start: 0;
    z-index: 1;
    background-color: var(--ec-bg-color);
    border-inline-end: 1px solid var(--ec-border-color);
    text-align: end;
    overflow: clip;

    .ec-header & {
        border-block-end: 1px solid var(--ec-border-color);
        padding-block: .375rem;
    }

    .ec-time-grid & {
        padding-inline: .75rem;
    }

    .ec-time-grid .ec-body & {
        --ec-direction: to left;
        [dir="rtl"] & {
            --ec-direction: to right;
        }
        background-image:
                linear-gradient(var(--ec-direction), transparent .375rem, var(--ec-bg-color) .375rem),
                linear-gradient(to top, var(--ec-bg-color) 1px, transparent 1px),
                linear-gradient(to top, var(--ec-border-color) 1px, transparent 1px),
                linear-gradient(to right, var(--ec-bg-color) 1px, transparent 1px),
                linear-gradient(to top, var(--ec-border-color) 1px, transparent 1px);
        background-size:
                100% 100%,
                100% 100%,
                100% calc(var(--ec-slot-height) * var(--ec-slot-label-periodicity)),
                2px 100%,
                100% var(--ec-slot-height);
    }

    .ec-timeline .ec-body & {
        grid-area: 1 / 1 / -1 / 2;
        display: grid;
        grid-template-rows: subgrid;
    }
}

.ec-row-head {
    display: flex;
    border-block-end: 1px solid var(--ec-border-color);
    padding: .375em .75rem;

    > span {
        min-block-size: 1.5em;
    }

    &:last-child {
        border: none;
    }
}

.ec-expander {
    inline-size: 1.25em;
    margin-inline-end: .25em;
    margin-block-start: -1px;

    .ec-button {
        line-height: normal;
        padding: 0;
        aspect-ratio: 1;
        block-size: 1.25em;
    }
}

.ec-slot {
    white-space: nowrap;

    .ec-time-grid & {
        block-size: calc(var(--ec-slot-height) * var(--ec-slot-label-periodicity));
        position: relative;
        inset-block-start: -.5lh;
    }

    .ec-timeline & {
        grid-column: span var(--ec-slot-label-periodicity);
        font-size: .95em;
        padding: .18rem 0;
        overflow: clip;
        text-overflow: ellipsis;
    }
}

.ec-slots {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: var(--ec-slot-width);
    text-align: center;

    --ec-day-bg-color: var(--ec-bg-color);
    background-color: var(--ec-day-bg-color);
    border-block-end: 1px solid var(--ec-border-color);

    &.ec-today {
        --ec-day-bg-color: var(--ec-today-bg-color);
    }

    &.ec-highlight {
        --ec-day-bg-color: var(--ec-highlight-color);
    }

    --ec-last-line-color: transparent;
    --ec-direction: to left;
    [dir="rtl"] & {
        --ec-direction: to right;
    }
    background-image:
            linear-gradient(var(--ec-direction), var(--ec-last-line-color) 1px, transparent 1px),
            linear-gradient(var(--ec-direction), var(--ec-border-color) 1px, transparent 1px);
    background-size:
            100% 100%,
            calc(var(--ec-slot-width) * var(--ec-slot-label-periodicity)) 100%;

    &:last-child {
        --ec-last-line-color: var(--ec-day-bg-color);
    }
}

.ec-events {
    grid-area: 1 / 2 / -1 / -1;
    display: grid;
    grid-template: subgrid / subgrid;
    isolation: isolate;
    pointer-events: none;

    .ec-day-grid & {
        grid-column-start: 1;
    }
}

.ec-event {
    display: flex;
    position: relative;
    padding: 2px;
    color: var(--ec-event-text-color);
    box-sizing: border-box;
    box-shadow: 0 0 1px 0 var(--ec-border-color);
    background-color: var(--ec-event-bg-color);
    border-radius: 3px;
    font-size: .85em;
    line-height: 1.5;
    z-index: 1;
    pointer-events: all;
    inline-size: calc(100% - var(--ec-event-col-gap));

    .ec-time-grid & {
        grid-row: 1;
    }

    .ec-day-grid &,
    .ec-all-day &,
    .ec-timeline & {
        block-size: max-content;
        margin-block-end: var(--ec-event-col-gap);
        &.ec-start-clipped {
            border-start-start-radius: 0;
            border-end-start-radius: 0;
            border-start-end-radius: 3px;
            border-end-end-radius: 3px;
        }
        &.ec-end-clipped {
            border-start-end-radius: 0;
            border-end-end-radius: 0;
            border-start-start-radius: 3px;
            border-end-start-radius: 3px;
        }
    }

    .ec-list & {
        flex-direction: row;
        padding: .5em 1.5em;
        color: inherit;
        background-color: var(--ec-day-bg-color);
        border-radius: 0;
    }

    &.ec-preview {
        z-index: 1000;
        user-select: none;
        opacity: .8;
    }

    &.ec-pointer {
        color: inherit;
        pointer-events: none;
        user-select: none;
        z-index: 0;
        box-shadow: none;
    }

    &.ec-start-clipped {
        border-start-start-radius: 0;
        border-start-end-radius: 0;
    }
    &.ec-end-clipped {
        border-end-start-radius: 0;
        border-end-end-radius: 0;
    }
    &.ec-start-clipped.ec-end-clipped {
        border-radius: 0;
    }
}

.ec-bg-event {
    grid-row: 1;
    position: relative;
    background-color: var(--ec-bg-event-color);
    opacity: var(--ec-bg-event-opacity);
}

.ec-draggable {
    cursor: pointer;
    user-select: none;
    -webkit-touch-callout: none;
}

.ec-ghost {
    opacity: .5;
    user-select: none;
    pointer-events: none;
}

.ec-event-body {
    display: flex;
    flex-direction: column;
    inline-size: 100%;

    .ec-day-grid &,
    .ec-all-day &,
    .ec-timeline & {
        flex-direction: row;
    }
}

.ec-event-tag {
    inline-size: 4px;
    border-radius: 2px;
    margin-inline-end: 8px;
}

.ec-event-time {
    overflow: hidden;
    white-space: nowrap;
    margin: 0 0 1px 0;
    flex-shrink: 0;
    max-block-size: 100%;

    .ec-day-grid &,
    .ec-timeline & {
        margin: 0 3px 0 0;
        max-inline-size: 100%;
        text-overflow: ellipsis;
    }
}

.ec-event-title {
    overflow: hidden;
    margin: 0;
    font-weight: inherit;

    .ec-time-grid & {
        position: sticky;
        inset-block-start: var(--ec-header-height);
    }

    .ec-day-grid &,
    .ec-all-day &,
    .ec-timeline & {
        min-block-size: 1.5em;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: sticky;
        inset-inline-start: calc(var(--ec-sidebar-width) + .18em);
    }

    .ec-list & {
        font-size: 1rem;
    }
}

.ec-resizer {
    position: absolute;
    user-select: none;

    .ec-time-grid .ec-body & {
        inset: auto 0 0 0;
        block-size: 50%;
        max-block-size: 8px;
        cursor: ns-resize;

        &.ec-start {
            inset: 0 0 auto 0;
        }
    }
    .ec-day-grid &,
    .ec-all-day &,
    .ec-timeline & {
        inset: 0 0 0 auto;
        inline-size: 50%;
        max-inline-size: 8px;
        cursor: ew-resize;

        &.ec-start {
            inset: 0 auto 0 0;
        }
    }
}

.ec-dragging, .ec-dragging * {
    cursor: pointer!important;
}
.ec-resizing-y, .ec-resizing-y * {
    cursor: ns-resize!important;
}
.ec-resizing-x, .ec-resizing-x * {
    cursor: ew-resize!important;
}
.ec-not-allowed, .ec-not-allowed * {
    cursor: not-allowed!important;
}

.ec-no-events {
    text-align: center;
    padding: 5em 0;
    background-color: var(--ec-bg-color);
}

.ec-now-indicator {
    grid-row: 2;
    position: relative;
    pointer-events: none;
    will-change: inset;

    .ec-time-grid & {
        inline-size: 100%;
        block-size: 0;
        border-block-start: var(--ec-now-indicator-color) solid 2px;
    }

    .ec-timeline & {
        inline-size: 0;
        border-inline-start: var(--ec-now-indicator-color) solid 2px;

        &:before {
            inset-block-start: calc(var(--ec-header-height) - 6.5px);
            z-index: 2;
        }
    }

    &:before {
        background: var(--ec-now-indicator-color);
        border-radius: 50%;
        content: "";
        display: block;
        block-size: 12px;
        inline-size: 12px;
        margin-block-start: -7px;
        margin-inline-start: -7px;
        position: sticky;
        inset-inline-start: calc(var(--ec-sidebar-width) - 6.5px);
        z-index: 1;
    }
}

.ec-popup {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    block-size: max-content;
    inline-size: 125%;
    min-block-size: 8em;
    min-inline-size: 12em;
    padding: .375rem .75rem .75rem;
    background-color: var(--ec-popup-bg-color);
    border: 1px solid var(--ec-border-color);
    border-radius: .25rem;
    box-shadow: var(--ec-color-300) 0 10px 15px -3px, var(--ec-color-300) 0 4px 6px -4px;

    .ec-day-head {
        flex-direction: row;
        padding-inline: 0;

        a {
            cursor: pointer;
            font-size: 1.5em;
            line-height: .8;
        }
    }

    .ec-events {
        --ec-event-col-gap: 0;
        display: block;
        overflow-y: auto;
        pointer-events: auto;
    }
}

.ec-custom-scrollbars {
    .ec-main {
        &::-webkit-scrollbar {
            background-color: transparent;
        }

        &::-webkit-scrollbar-thumb {
            border: 4px solid transparent;
            box-shadow: none;
            background-color: var(--ec-border-color);
            background-clip: padding-box;
            border-radius: 8px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background-color: var(--ec-color-400);
        }
    }
}

.ec {
    display: flex;
    flex-direction: column;
}

.ec-main {
    display: grid;
    border: 1px solid var(--ec-border-color);
    overflow: auto;
    /*scrollbar-width: thin;*/

    .ec-time-grid & {
        grid-template-columns: max-content repeat(var(--ec-grid-cols), var(--ec-col-width));
        grid-template-rows: repeat(2, max-content);
    }

    .ec-day-grid & {
        --ec-row-height: auto;
        grid-template-columns: repeat(var(--ec-grid-cols), minmax(0, 1fr));
        grid-template-rows: max-content repeat(var(--ec-grid-rows), var(--ec-row-height));

        &.ec-uniform {
            --ec-row-height: minmax(0, 1fr);
            overflow: hidden;
            flex-grow: 1;
        }
    }

    .ec-timeline & {
        grid-template-columns: max-content repeat(var(--ec-grid-cols), var(--ec-col-width));
        grid-template-rows: max-content var(--ec-grid-rows);
        flex-grow: 1;
    }

    .ec-list & {

    }
}

.ec-header {
    grid-area: 1 / 1 / 2 / -1;
    display: grid;
    grid-template-columns: subgrid;
    position: sticky;
    inset-block-start: 0;
    z-index: 2;
}

.ec-grid {
    grid-area: 1 / 1 / -1 / -1;
    display: grid;
    grid-template-columns: subgrid;

    .ec-body & {
        grid-template-rows: subgrid;
    }

    .ec-time-grid &,
    .ec-timeline & {
        grid-column-start: 2;
    }
}

.ec-all-day {
    grid-area: 2 / 1 / auto / -1;
    display: grid;
    grid-template-columns: subgrid;
    min-block-size: var(--ec-slot-height);
}

.ec-col-group {
    grid-column: span  var(--ec-col-group-span);
}

.ec-col-group,
.ec-col-head {
    text-align: center;
    padding: .375rem .18em;
    background-color: var(--ec-bg-color);
    border: 1px solid var(--ec-border-color);
    border-block-start: none;
    border-inline-start: none;
    overflow: clip;
    text-overflow: ellipsis;

    &.ec-today {
        background-color: var(--ec-today-bg-color);
    }

    &.ec-highlight {
        background-color: var(--ec-highlight-color);
    }
}

.ec-col-group:nth-last-child(1 of .ec-col-group),
.ec-col-head:nth-last-child(1 of .ec-col-head) {
    border-inline-end: none;
}

.ec-col-group > *,
.ec-timeline .ec-col-head > * {
    position: sticky;
    inset-inline-start: calc(var(--ec-sidebar-width) + .18em);
}

.ec-body {
    grid-area: 2 / 1 / -1 / -1;
    display: grid;
    grid-template: subgrid / subgrid;
}

.ec-hidden {
    visibility: hidden;
}
/*$vite$:1*/`;var QC=Ll,_u=600;function Pl(e,t){return t&&e>0&&e<_u?"listMonth":"dayGridMonth"}function mu(e){return`calc(${$u}em + ${e} * ${yu}em + ${bu}em)`}var $u=2.4,yu=1.6,bu=1.8;function rs(e){return e.slice(0,10)}function ns(e){let t=String(e.getFullYear()).padStart(4,"0"),r=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${t}-${r}-${n}`}function Hl(e,t){let r;for(let n of e){if(!n.startDate)continue;let o=rs(n.startDate);(n.endDate?rs(n.endDate):o)<t||(r===void 0||o<r)&&(r=o)}return r}function wu(e){let t;for(let r of e){if(!r.startDate)continue;let n=rs(r.startDate);(t===void 0||n>t)&&(t=n)}return t}function xu(e,t,r){if(t.kind==="today")return;if(t.kind==="date")return t.date;let n=ns(r);return Hl(e,n)??wu(e)}function Fl(e,t){if(e)return t==="UTC"&&!jn(e)?`${e}Z`:e}function Eu(e){return e.flatMap(t=>{let r=Fl(t.startDate,t.timezone);if(!r)return[];let n=jn(t.startDate),o=(n&&t.endDate?Li(t.endDate,1):Fl(t.endDate,t.timezone))??r;return[{title:t.name,start:r,end:o,allDay:n,extendedProps:{previewEvent:t}}]})}function ku(e){let t=e==="es"?"es-ES":"en-US",r=zl[e];return{locale:t,firstDay:e==="es"?1:0,buttonText:{prev:r.prev,next:r.next,today:r.today,close:r.close},titleFormat:n=>Tu(new Intl.DateTimeFormat(t,{month:"long",year:"numeric"}).format(n)),dayHeaderFormat:{weekday:"short"},dayHeaderAriaLabelFormat:{weekday:"long"},eventTimeFormat:{hour:"numeric",minute:"2-digit"},moreLinkContent:n=>r.moreLink(n.num),noEventsContent:()=>r.noEvents}}var zl={en:{prev:"Previous month",next:"Next month",today:"Today",close:"Close",nextEvent:"Next event",moreLink:e=>`+${e} more`,noEvents:"No events this month"},es:{prev:"Mes anterior",next:"Mes siguiente",today:"Hoy",close:"Cerrar",nextEvent:"Pr\xF3ximo evento",moreLink:e=>`+${e} m\xE1s`,noEvents:"No hay eventos este mes"}};function Tu(e){return e.charAt(0).toLocaleUpperCase()+e.slice(1)}function eD(e,t,r){let{lang:n,maxPerDay:o,responsive:s}=r,a=r.now??new Date,l=zl[n],c=xu(t,r.initialDate,a),p=Hl(t,ns(a));o==="off"?(e.removeAttribute("data-day-rows"),e.style.removeProperty("--ote-calendar-row-height")):(e.setAttribute("data-day-rows",String(o)),e.style.setProperty("--ote-calendar-row-height",mu(o)));let v=Pl(e.clientWidth,s),h=Il(e,[Dl,Sl],{...ku(n),view:v,...c?{date:c}:{},events:Eu(t),height:"auto",dayMaxEvents:o!=="off",...p?{customButtons:{nextEvent:{text:l.nextEvent,click(){h.setOption("date",p)}}}}:{},headerToolbar:{start:"title",center:"",end:`${p?"nextEvent ":""}today prev,next`},eventClick(d){let g=d.event.extendedProps.previewEvent;g&&r.onEventClick(g)}}),u;return s&&typeof ResizeObserver<"u"&&(u=new ResizeObserver(d=>{let g=d[0]?.contentRect.width??e.clientWidth,$=Pl(g,s);$!==v&&(v=$,h.setOption("view",$))}),u.observe(e)),{currentDate(){let d=h.getOption("date");return d instanceof Date?ns(d):typeof d=="string"?d:void 0},destroy(){u?.disconnect(),Ml(h)}}}export{QC as CALENDAR_CSS,_u as CALENDAR_LIST_BREAKPOINT,ku as calendarLocaleOptions,Pl as calendarViewForWidth,mu as dayRowHeight,Hl as nextEventDate,eD as renderCalendar,xu as resolveCalendarDate,ns as toISODate};
/*! Bundled license information:

@event-calendar/core/dist/index.js:
  (*!
   * EventCalendar v5.18.1
   * https://github.com/vkurko/calendar
   *)
*/
//# sourceMappingURL=calendar-layout.js.map
