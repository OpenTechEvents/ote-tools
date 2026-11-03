function qn(e){return e!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function Oi(e,t){let r=new Date(`${e}T00:00:00Z`);return r.setUTCDate(r.getUTCDate()+t),r.toISOString().slice(0,10)}var ts=globalThis.process?.env?.NODE_ENV,m=ts&&!ts.toLowerCase().startsWith("prod");var sr=Array.isArray,rs=Array.prototype.indexOf,ar=Array.prototype.includes,Gr=Array.from,Ii=Object.keys,Se=Object.defineProperty,ct=Object.getOwnPropertyDescriptor,Mi=Object.getOwnPropertyDescriptors,Li=Object.prototype,ns=Array.prototype,Wr=Object.getPrototypeOf,Pi=Object.isExtensible;var Re=()=>{};function Gn(e){for(var t=0;t<e.length;t++)e[t]()}function Wn(){var e,t,r=new Promise((n,i)=>{e=n,t=i});return{promise:r,resolve:e,reject:t}}var tt=Symbol("$state"),jn=Symbol("component"),mn=Symbol("legacy props"),is=Symbol(""),Xn=Symbol("proxy path"),Kn=Symbol("attributes"),$n=Symbol("class"),yn=Symbol("style"),bn=Symbol("text");var Fi=Symbol("hmr anchor"),lr=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},Hi=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml");var jr=3,kt=8;var _t={};var le=Symbol("uninitialized"),Tt=Symbol("filename");var Zn="http://www.w3.org/1999/xhtml";var mr="font-weight: bold",$r="font-weight: normal";function os(e){m?console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${e}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,mr,$r):console.warn("https://svelte.dev/e/await_reactivity_loss")}function ss(e,t){m?console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${e}\` (${t}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,mr,$r):console.warn("https://svelte.dev/e/await_waterfall")}function as(){m?console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,mr,$r):console.warn("https://svelte.dev/e/derived_inert")}function ls(e,t,r){m?console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${e}\` attribute on \`${t}\` changed its value between server and client renders. The client value, \`${r}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,mr,$r):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function Ar(e){m?console.warn(`%c[svelte] hydration_mismatch
%c${e?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${e}`:"Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,mr,$r):console.warn("https://svelte.dev/e/hydration_mismatch")}function cs(){m?console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,mr,$r):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function Jn(e){m?console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${e}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,mr,$r):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function ds(){m?console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",mr,$r):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var D=!1;function _e(e){D=e}var L;function ne(e){if(e===null)throw Ar(),_t;return L=e}function Ue(){return ne(Be(L))}function ie(e){if(D){if(Be(L)!==null)throw Ar(),_t;L=e}}function zi(e=1){if(D){for(var t=e,r=L;t--;)r=Be(r);L=r}}function Lt(e=!0){for(var t=0,r=L;;){if(r.nodeType===kt){var n=r.data;if(n==="]"){if(t===0)return r;t-=1}else(n==="["||n==="[!"||n[0]==="["&&!isNaN(Number(n.slice(1))))&&(t+=1)}var i=Be(r);e&&r.remove(),r=i}}function yr(e){if(!e||e.nodeType!==kt)throw Ar(),_t;return e.data}function Qn(e){return e===this.v}function Ui(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function ei(e){return!Ui(e,this.v)}function fs(e){if(m){let t=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${e}"
https://svelte.dev/e/invariant_violation`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invariant_violation")}function wn(e){if(m){let t=new Error(`lifecycle_outside_component
\`${e}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function us(){if(m){let e=new Error("set_context_after_init\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\nhttps://svelte.dev/e/set_context_after_init");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/set_context_after_init")}function hs(){if(m){let e=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/async_derived_orphan")}function vs(){if(m){let e=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/derived_references_self")}function Bi(e,t,r){if(m){let n=new Error(`each_key_duplicate
${r?`Keyed each block has duplicate key \`${r}\` at indexes ${e} and ${t}`:`Keyed each block has duplicate key at indexes ${e} and ${t}`}
https://svelte.dev/e/each_key_duplicate`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function gs(e,t,r){if(m){let n=new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${e} was \`${t}\` but is now \`${r}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_volatile")}function _s(e){if(m){let t=new Error(`effect_in_teardown
\`${e}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function ms(){if(m){let e=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function $s(e){if(m){let t=new Error(`effect_orphan
\`${e}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_orphan")}function ys(){if(m){let e=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function bs(){if(m){let e=new Error("get_abort_signal_outside_reaction\n`getAbortSignal()` can only be called inside an effect or derived\nhttps://svelte.dev/e/get_abort_signal_outside_reaction");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/get_abort_signal_outside_reaction")}function ws(){if(m){let e=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/hydration_failed")}function xs(){if(m){let e=new Error("invalid_snippet\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\nhttps://svelte.dev/e/invalid_snippet");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invalid_snippet")}function Es(e){if(m){let t=new Error(`props_invalid_value
Cannot do \`bind:${e}={undefined}\` when \`${e}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_invalid_value")}function ks(e){if(m){let t=new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${e}\` are readonly
https://svelte.dev/e/props_rest_readonly`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function Ts(e){if(m){let t=new Error(`rune_outside_svelte
The \`${e}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function Cs(){if(m){let e=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function Ds(){if(m){let e=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Ss(){if(m){let e=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function Rs(){if(m){let e=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var Ae=!1,cr=!1,Pt=!1;var xn=null;function oe(e,t){return e.label=t,ri(e.v,t),e}function ri(e,t){return e?.[Xn]?.(t),e}function Jr(e){return typeof e=="symbol"?`Symbol(${e.description})`:typeof e=="function"?"<function>":typeof e=="object"&&e?"<object>":String(e)}function Ft(e){let t=new Error,r=Nl();return r.length===0?null:(r.unshift(`
`),Se(t,"stack",{value:r.join(`
`)}),Se(t,"name",{value:e}),t)}function Nl(){let e=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let t=new Error().stack;if(Error.stackTraceLimit=e,!t)return[];let r=t.split(`
`),n=[];for(let i=0;i<r.length;i++){let s=r[i],a=s.replaceAll("\\","/");if(s.trim()!=="Error"){if(s.includes("validate_each_keys"))return[];a.includes("svelte/src/internal")||a.includes("node_modules/.vite")||n.push(s)}}return n}function Ns(e,t){if(!m)throw new Error("invariant(...) was not guarded by if (DEV)");e||fs(t)}function Ol(e){let t=e.p;for(;t!==null&&t.c===null;)t=t.p;return t?.c??null}function Vi(e,t){return e===null&&wn(t),e.c??=new Map(Ol(e)||void 0)}var Y=null;function dr(e){Y=e}var Ht=null;function Qr(e){Ht=e}var zt=null;function ni(e){zt=e}function je(e){return Vi(Y,"getContext").get(e)}function ii(e,t){let r=Vi(Y,"setContext");if(Ae){var n=C.f,i=!N&&(n&32)!==0&&!Y.i;i||us()}return r.set(e,t),t}function dt(e,t=!1,r){Y={p:Y,i:!1,c:null,e:null,s:e,x:null,r:C,l:cr&&!t?{s:null,u:null,$:[]}:null},m&&(Y.function=r,zt=r)}function ft(e){var t=Y,r=t.e;if(r!==null){t.e=null;for(var n of r)Yi(n)}return e!==void 0&&(t.x=e),t.i=!0,Y=t.p,m&&(zt=Y?.function??null),En(e)}function En(e={}){return Se(e,jn,{value:!0}),e}function Jt(){return!cr||Y!==null&&Y.l===null}var Nr=[];function Os(){var e=Nr;Nr=[],Gn(e)}function ye(e){if(Nr.length===0&&!Or){var t=Nr;queueMicrotask(()=>{t===Nr&&Os()})}Nr.push(e)}function Is(){for(;Nr.length>0;)Os()}var Il=-7169;function se(e,t){e.f=e.f&Il|t}function en(e){(e.f&512)!==0||e.deps===null?se(e,1024):se(e,4096)}function oi(e,t){(e.f&2048)!==0?t.set(e,2048):(e.f&4096)!==0&&t.get(e)!==2048&&t.set(e,4096),se(e,1024)}function Ms(e){return`{${e.toString().replace(/^async \(\) => /,"").replace(/^\(/,"").replace(/\$\.get\((.+?)\)/g,(t,r)=>r).replace(/\$\.track_reactivity_loss\((.+?)\)\(\)/g,(t,r)=>r).replace(/\)$/,"")}}`}function si(e,t){if(t){let r=document.body;e.autofocus=!0,ye(()=>{document.activeElement===r&&e.focus()})}}function Dt(e){var t=N,r=C;be(null),Oe(null);try{return e()}finally{be(t),Oe(r)}}function ai(e,t,r,n){let i=Jt()?xr:Mr;var s=e.filter(d=>!d.settled),a=t.map(i);if(m&&a.forEach((d,g)=>{d.label=t[g].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\$\.get\((.+?)\)/g,($,_)=>_)}),r.length===0&&s.length===0){n(a);return}var l=C,c=Ps(),u=s.length===1?s[0].promise:s.length>1?Promise.all(s.map(d=>d.promise)):null;function v(d){if((l.f&16384)===0){c();try{n([...a,...d])}catch(g){pt(g,l)}tn()}}var h=qi();if(r.length===0){u.then(()=>v([])).finally(h);return}function p(){Promise.all(r.map(d=>Wi(d))).then(v).catch(d=>pt(d,l)).finally(h)}u?u.then(()=>{if((l.f&16384)!==0){h();return}c(),p(),tn()}):p()}function Ps(){var e=C,t=N,r=Y,n=P;if(m)var i=Ht;return function(a=!0){Oe(e),be(t),dr(r),a&&(e.f&16384)===0&&(n?.activate(),n?.apply()),m&&(Gi(null),Qr(i))}}var Ll=!1;function tn(e=!0){Ll=!1,Oe(null),be(null),dr(null),e&&P?.deactivate(),m&&(Gi(null),Qr(null))}function qi(){var e=C,t=e.b,r=P,n=!!t?.is_rendered();return t?.update_pending_count(1,r),r.increment(n,e),()=>{t?.update_pending_count(-1,r),r.decrement(n,e)}}var ht=null;function Gi(e){ht=e}var Cn=new Set;function xr(e){var t=2050;C!==null&&(C.f|=524288);let r={ctx:Y,deps:null,effects:null,equals:Qn,f:t,fn:e,reactions:null,rv:0,v:le,wv:0,parent:C,ac:null};return m&&Pt&&(r.created=Ft("created at")),r}var rn=Symbol("obsolete");function Wi(e,t,r){let n=C;n===null&&hs();var i=void 0,s=Ie(le);m&&(s.label=t??Ms(e));var a=!N,l=new Set;return zs(()=>{var c=C;m&&(ht={effect:c,effect_deps:new Set,warned:!1});var u=Wn();i=u.promise;try{Promise.resolve(e()).then(u.resolve,d=>{d!==lr&&u.reject(d)}).finally(tn)}catch(d){u.reject(d),tn()}if(m){if(ht){if(c.deps!==null)for(let d=0;d<rt;d+=1)ht.effect_deps.add(c.deps[d]);if(Fe!==null)for(let d=0;d<Fe.length;d+=1)ht.effect_deps.add(Fe[d])}ht=null}var v=P;if(a){if((c.f&32768)!==0)var h=qi();if(n.b?.is_rendered())v.async_deriveds.get(c)?.reject(rn);else for(let d of l.values())d.reject(rn);l.add(u),v.async_deriveds.set(c,u)}let p=(d,g=void 0)=>{m&&(ht=null),h?.(),l.delete(u),g!==rn&&(v.activate(),g?(s.f|=8388608,Bt(s,g)):((s.f&8388608)!==0&&(s.f^=8388608),m&&r!==void 0&&!s.equals(d)&&(Cn.add(s),setTimeout(()=>{Cn.has(s)&&(c.f&16384)===0&&(ss(s.label,r),Cn.delete(s))})),Bt(s,d)),v.deactivate())};u.promise.then(p,d=>p(null,d||"unknown"))}),qe(()=>{for(let c of l)c.reject(rn)}),m&&(s.f|=4194304),new Promise(c=>{function u(v){function h(){v===i?c(s):u(i)}v.then(h,h)}u(i)})}function f(e){let t=xr(e);return Ae||di(t),t}function Mr(e){let t=xr(e);return t.equals=ei,t}function Fs(e){var t=e.effects;if(t!==null){e.effects=null;for(var r=0;r<t.length;r+=1)pe(t[r])}}var ji=[];function Dn(e){var t,r=C,n=e.parent;if(!$t&&n!==null&&e.v!==le&&(n.f&24576)!==0)return as(),e.v;if(Oe(n),m){let i=Lr;li(new Set);try{ar.call(ji,e)&&vs(),ji.push(e),Fs(e),t=ci(e)}finally{Oe(r),li(i),ji.pop()}}else try{Fs(e),t=ci(e)}finally{Oe(r)}return t}function Xi(e){var t=Dn(e);if(!e.equals(t)&&(e.wv=nn(),(!P?.is_fork||e.deps===null)&&(P!==null?(P.capture(e,t,!0),Vt?.capture(e,t,!0)):e.v=t,e.deps===null))){se(e,1024);return}$t||(He!==null?(br()||P?.is_fork)&&He.set(e,t):en(e))}function Hs(e){if(e.effects!==null)for(let t of e.effects)(t.teardown||t.ac)&&(t.teardown?.(),t.ac!==null&&Dt(()=>{t.ac.abort(lr),t.ac=null}),t.fn!==null&&(t.teardown=Re),Pr(t,0),Sn(t))}function Ki(e){if(e.effects!==null)for(let t of e.effects)t.teardown&&t.fn!==null&&Qt(t)}var fi=null,on=null,P=null,Vt=null,He=null,Qi=null,Or=!1,Zi=!1,sn=null,Rn=null,Us=0,Ji=new Set,Hl=1,yt=class e{id=Hl++;started=!1;linked=!0;prev=null;next=null;async_deriveds=new Map;current=new Map;previous=new Map;#e=new Set;#r=new Set;#t=0;#n=new Map;#i=null;#o=[];#a=[];#s=new Map;#l=new Map;#d=new Set;is_fork=!1;#c=!1;constructor(){on===null?fi=on=this:(on.next=this,this.prev=on),on=this}#v(){if(this.is_fork)return!0;for(let t of this.#n.keys())if(!this.#m(t))return!0;return!1}#m(t){for(var r=t;r!==null;r=r.parent)if(this.#l.has(r))return!0;return!1}skip_effect(t){this.#l.has(t)||this.#l.set(t,{d:[],m:[]}),this.#d.delete(t)}unskip_effect(t,r=n=>this.schedule(n)){var n=this.#l.get(t);if(n){this.#l.delete(t);for(var i of n.d)se(i,2048),r(i);for(i of n.m)se(i,4096),r(i)}this.#d.add(t)}#f(){var t=[];for(let s of this.#o)if(!((s.f&16384)!==0||(s.f&6144)===0)){for(var r=s,n=!1;r.parent!==null;){r=r.parent;var i=r.f;if((i&96)!==0){if((i&1024)===0){n=!0;break}r.f^=1024}}n||t.push(r)}return this.#o=[],t}#g(){if(this.started=!0,m)for(let l of this.current.keys())Ji.add(l);for(let[l,c]of this.#s)se(l,c),this.schedule(l);this.apply();for(var t=sn=[],r=[],n=Rn=[];this.#o.length>0;){Us++>1e3&&(this.#p(),zl());for(let l of this.#f())try{this.#$(l,t,r)}catch(c){throw qs(l),this.#v()||this.discard(),c}}if(P=null,n.length>0){var i=e.ensure();for(let l of n)i.schedule(l)}if(sn=null,Rn=null,this.#v()){this.#h(r),this.#h(t);for(let[l,c]of this.#l)Ys(l,c);n.length>0&&P.#g();return}let s=this.#b();if(s){this.#h(r),this.#h(t),s.#u(this);return}this.#s.clear();for(let l of this.#e)l(this);this.#e.clear(),Vt=this,Bs(r),Bs(t),Vt=null,this.#i?.resolve();var a=P;this.#t===0&&(this.#o.length===0||a!==null)&&(this.#p(),Ae&&(this.#y(),P=a)),a!==null&&(Rt.clear(),a.#g())}#$(t,r,n){t.f^=1024;for(var i=t.first;i!==null;){var s=i.f,a=(s&96)!==0,l=a&&(s&1024)!==0,c=l||(s&8192)!==0||this.#l.has(i);if(!c&&i.fn!==null){a?i.f^=1024:(s&4)!==0?r.push(i):Ae&&(s&16777224)!==0?n.push(i):kr(i)&&((s&16)!==0&&this.add_dirty_reaction(i,4096),Qt(i));var u=i.first;if(u!==null){i=u;continue}}for(;i!==null;){var v=i.next;if(v!==null){i=v;break}i=i.parent}}}#b(){for(var t=this.prev;t!==null;t=t.prev)if(!t.is_fork&&this.#_(t))return t;return null}#_(t){for(let[r,[,n]]of this.current)if(!n&&t.current.has(r))return!0;return!1}#u(t){for(let[n,i]of t.current)!this.previous.has(n)&&t.previous.has(n)&&this.previous.set(n,t.previous.get(n)),this.current.set(n,i);for(let[n,i]of t.async_deriveds){let s=this.async_deriveds.get(n);s&&i.promise.then(s.resolve).catch(s.reject)}t.async_deriveds.clear(),this.transfer_reactions(t.#s);let r=n=>{var i=n.reactions;if(i!==null&&!((n.f&2)!==0&&(n.f&6144)===0))for(let l of i){var s=l.f;if((s&2)!==0)r(l);else{var a=l;s&4194320&&!this.async_deriveds.has(a)&&(this.#s.delete(a),se(a,2048),this.schedule(a))}}};for(let n of this.current.keys())r(n);this.oncommit(()=>t.discard()),t.#p(),P=this,this.#g()}#h(t){for(var r=0;r<t.length;r+=1)oi(t[r],this.#s)}capture(t,r,n=!1){t.v!==le&&!this.previous.has(t)&&this.previous.set(t,t.v),(t.f&8388608)===0&&(this.current.set(t,[r,n]),He?.set(t,r)),this.is_fork||(t.v=r)}activate(){P=this}deactivate(){P=null,He=null}flush(){try{m&&Ji.clear(),Zi=!0,P=this,this.#g()}finally{if(Us=0,Qi=null,sn=null,Rn=null,Zi=!1,P=null,He=null,Rt.clear(),m)for(let t of Ji)t.updated=null}}discard(){for(let t of this.#r)t(this);this.#r.clear();for(let t of this.async_deriveds.values())t.reject(rn);this.#p(),this.#i?.resolve()}register_created_effect(t){this.#a.push(t)}#y(){for(let h=fi;h!==null;h=h.next){var t=h.id<this.id,r=[];for(let[p,[d,g]]of this.current){if(h.current.has(p)){var n=h.current.get(p)[0];if(t&&d!==n)h.current.set(p,[d,g]);else continue}r.push(p)}if(t)for(let[p,d]of this.async_deriveds){let g=h.async_deriveds.get(p);g&&d.promise.then(g.resolve).catch(g.reject)}var i=[...h.current.keys()].filter(p=>!h.current.get(p)[1]);if(!(!h.started||i.length===0)){var s=i.filter(p=>!this.current.has(p));if(s.length===0)t&&h.discard();else if(r.length>0){if(m&&!h.#c&&Ns(h.#o.length===0,"Batch has scheduled effects"),t)for(let p of this.#d)h.unskip_effect(p,d=>{(d.f&4194320)!==0?h.schedule(d):h.#h([d])});h.activate();var a=new Set,l=new Map;for(var c of r)Vs(c,s,a,l);l=new Map;var u=[...h.current].filter(([p,d])=>{let g=this.current.get(p);return g?g[0]!==d[0]||g[1]!==d[1]:!0}).map(([p])=>p);if(u.length>0)for(let p of this.#a)(p.f&155648)===0&&eo(p,u,l)&&((p.f&4194320)!==0?(se(p,2048),h.schedule(p)):h.add_dirty_reaction(p,2048));if(h.#o.length>0&&!h.#c){h.apply();for(var v of h.#f())h.#$(v,[],[])}h.deactivate()}}}}increment(t,r){if(this.#t+=1,t){let n=this.#n.get(r)??0;this.#n.set(r,n+1)}}decrement(t,r){if(this.#t-=1,t){let n=this.#n.get(r)??0;n===1?this.#n.delete(r):this.#n.set(r,n-1)}this.#c||(this.#c=!0,ye(()=>{this.#c=!1,this.linked&&this.flush()}))}transfer_reactions(t){for(let[r,n]of t)this.add_dirty_reaction(r,n);t.clear()}add_dirty_reaction(t,r){(r===2048||this.#s.get(t)!==2048)&&this.#s.set(t,r)}oncommit(t){this.#e.add(t)}ondiscard(t){this.#r.add(t)}settled(){return(this.#i??=Wn()).promise}static ensure(){if(P===null){let t=P=new e;!Zi&&!Or&&ye(()=>{t.started||t.flush()})}return P}apply(){if(!Ae||!this.is_fork&&this.prev===null&&this.next===null){He=null;return}He=new Map;for(let[t,[r]]of this.current)He.set(t,r);for(let t=fi;t!==null;t=t.next)if(!(t===this||t.is_fork)&&(t.id>=this.id||!t.#_(this)))for(let[r,n]of t.previous)He.has(r)||He.set(r,n)}schedule(t){if(Qi=t,t.b?.is_pending&&(t.f&16777228)!==0&&(t.f&32768)===0){t.b.defer_effect(t);return}this.#o.push(t)}#p(){if(this.linked){var t=this.prev,r=this.next;t===null?fi=r:t.next=r,r===null?on=t:r.prev=t,this.linked=!1}}};function Er(e){var t=Or,r=Vt;Vt=null,Or=!0;try{var n;for(e&&(Er(),n=e());;){if(Is(),P===null)return n;P.flush()}}finally{Or=t,Vt=r}}function zl(){if(m){var e=new Map;for(let r of P.current.keys())for(let[n,i]of r.updated??[]){var t=e.get(n);t||(t={error:i.error,count:0},e.set(n,t)),t.count+=i.count}for(let r of e.values())r.error&&console.error(r.error)}try{ys()}catch(r){m&&Se(r,"stack",{value:""}),pt(r,Qi)}}var St=null;function Bs(e){var t=e.length;if(t!==0){for(var r=0;r<t;){var n=e[r++];if((n.f&24576)===0&&kr(n)&&(St=new Set,Qt(n),n.deps===null&&n.first===null&&n.nodes===null&&n.teardown===null&&n.ac===null&&to(n),St?.size>0)){Rt.clear();for(let i of St){if((i.f&24576)!==0)continue;let s=[i],a=i.parent;for(;a!==null;)St.has(a)&&(St.delete(a),s.push(a)),a=a.parent;for(let l=s.length-1;l>=0;l--){let c=s[l];(c.f&24576)===0&&Qt(c)}}St.clear()}}St=null}}function Vs(e,t,r,n){if(!r.has(e)&&(r.add(e),e.reactions!==null))for(let i of e.reactions){let s=i.f;(s&2)!==0?Vs(i,t,r,n):(s&4194320)!==0&&(s&2048)===0&&eo(i,t,n)&&(se(i,2048),An(i))}}function eo(e,t,r){let n=r.get(e);if(n!==void 0)return n;if(e.deps!==null)for(let i of e.deps){if(ar.call(t,i))return!0;if((i.f&2)!==0&&eo(i,t,r))return r.set(i,!0),!0}return r.set(e,!1),!1}function An(e){P.schedule(e)}function Ys(e,t){if(!((e.f&32)!==0&&(e.f&1024)!==0)){(e.f&2048)!==0?t.d.push(e):(e.f&4096)!==0&&t.m.push(e),se(e,1024);for(var r=e.first;r!==null;)Ys(r,t),r=r.next}}function qs(e){se(e,1024);for(var t=e.first;t!==null;)qs(t),t=t.next}var Lr=new Set,Rt=new Map;function li(e){Lr=e}var no=!1;function Ws(){no=!0}function Ie(e,t){var r={f:0,v:e,reactions:null,equals:Qn,rv:0,wv:0};return m&&Pt&&(r.created=t??Ft("created at"),r.updated=null,r.set_during_effect=!1,r.trace=null),r}function F(e,t){let r=Ie(e,t);return di(r),r}function zr(e,t=!1,r=!0){let n=Ie(e);return t||(n.equals=ei),cr&&r&&Y!==null&&Y.l!==null&&(Y.l.s??=[]).push(n),n}function y(e,t,r=!1){N!==null&&(!nt||(N.f&131072)!==0)&&Jt()&&(N.f&4325394)!==0&&(Yt===null||!Yt.has(e))&&Ss();let n=r?xe(t):t;return m&&ri(n,e.label),Bt(e,n,Rn)}var Hr=null,ro=0;function Bt(e,t,r=null){if(!e.equals(t)){$t?Rt.set(e,t):Rt.has(e)||Rt.set(e,e.v);var n=yt.ensure();if(n.capture(e,t),m){if(Pt||C!==null){e.updated??=new Map;let i=(e.updated.get("")?.count??0)+1;if(e.updated.set("",{error:null,count:i}),Pt||i>5){let s=Ft("updated at");if(s!==null){let a=e.updated.get(s.stack);a||(a={error:s,count:0},e.updated.set(s.stack,a)),a.count++}}}C!==null&&(e.set_during_effect=!0)}if((e.f&2)!==0){let i=e;(e.f&2048)!==0&&Dn(i),He===null&&en(i)}e.wv=nn(),Hr=null,ro=0,js(e,2048,r),Hr=null,Jt()&&C!==null&&(C.f&1024)!==0&&(C.f&96)===0&&(bt===null?Xs([e]):bt.push(e)),!n.is_fork&&Lr.size>0&&!no&&ui()}return t}function ui(){no=!1;for(let e of Lr){(e.f&1024)!==0&&se(e,4096);let t;try{t=kr(e)}catch{t=!0}t&&Qt(e)}Lr.clear()}function we(e){y(e,e.v+1)}function js(e,t,r){var n=e.reactions;if(n!==null){var i=Jt(),s=n.length;if(ro+=s,ro>1e5&&Hr===null&&(Hr=new Set),Hr!==null){if(Hr.has(e))return;Hr.add(e)}for(var a=0;a<s;a++){var l=n[a],c=l.f;if(!(!i&&l===C)){var u=(c&2048)===0;if(u&&se(l,t),(c&131072)!==0)Lr.add(l);else if((c&2)!==0){var v=l;He?.delete(v),js(v,4096,r)}else if(u){var h=l;(c&16)!==0&&St!==null&&St.add(h),r!==null?r.push(h):An(h)}}}}}var Bl=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function xe(e){if(typeof e!="object"||e===null||tt in e||jn in e)return e;let t=Wr(e);if(t!==Li&&t!==ns)return e;var r=new Map,n=sr(e),i=F(0),s=m&&Pt?Ft("created at"):null,a=At,l=h=>{if(At===a)return h();var p=N,d=At;be(null),io(a);var g=h();return be(p),io(d),g};n&&(r.set("length",F(e.length,s)),m&&(e=Yl(e)));var c="";let u=!1;function v(h){if(!u){u=!0,c=h,oe(i,`${c} version`);for(let[p,d]of r)oe(d,Ur(c,p));u=!1}}return new Proxy(e,{defineProperty(h,p,d){(!("value"in d)||d.configurable===!1||d.enumerable===!1||d.writable===!1)&&Cs();var g=r.get(p);return g===void 0?l(()=>{var $=F(d.value,s);return r.set(p,$),m&&typeof p=="string"&&oe($,Ur(c,p)),$}):y(g,d.value,!0),!0},deleteProperty(h,p){var d=r.get(p);if(d===void 0){if(p in h){let g=l(()=>F(le,s));r.set(p,g),we(i),m&&oe(g,Ur(c,p))}}else y(d,le),we(i);return!0},get(h,p,d){if(p===tt)return e;if(m&&p===Xn)return v;var g=r.get(p),$=p in h;if(g===void 0&&(!$||ct(h,p)?.writable)&&(g=l(()=>{var b=xe($?h[p]:le),w=F(b,s);return m&&oe(w,Ur(c,p)),w}),r.set(p,g)),g!==void 0){var _=o(g);return _===le?void 0:_}return Reflect.get(h,p,d)},getOwnPropertyDescriptor(h,p){this.has?.(h,p);var d=Reflect.getOwnPropertyDescriptor(h,p),g=r.get(p);if(g!==void 0){var $=o(g);if($===le)return;if(d&&"value"in d)d.value=$;else return{enumerable:!0,configurable:!0,value:$,writable:!0}}return d},has(h,p){if(p===tt)return!0;var d=r.get(p),g=d!==void 0&&d.v!==le||Reflect.has(h,p);if(d!==void 0||(C!==null||N!==null)&&(!g||ct(h,p)?.writable)){d===void 0&&(d=l(()=>{var _=g?xe(h[p]):le,b=F(_,s);return m&&oe(b,Ur(c,p)),b}),r.set(p,d));var $=o(d);if($===le)return!1}return g},set(h,p,d,g){var $=r.get(p),_=p in h;if(n&&p==="length")for(var b=d;b<$.v;b+=1){var w=r.get(b+"");w!==void 0?y(w,le):b in h&&(w=l(()=>F(le,s)),r.set(b+"",w),m&&oe(w,Ur(c,b)))}if($===void 0)(!_||ct(h,p)?.writable)&&($=l(()=>F(void 0,s)),m&&oe($,Ur(c,p)),y($,xe(d)),r.set(p,$));else{_=$.v!==le;var O=l(()=>xe(d));y($,O)}var E=Reflect.getOwnPropertyDescriptor(h,p);if(E?.set&&E.set.call(g,d),!_){if(n&&typeof p=="string"){var S=r.get("length"),x=Number(p);Number.isInteger(x)&&x>=S.v&&y(S,x+1)}we(i)}return!0},ownKeys(h){o(i);var p=Reflect.ownKeys(h).filter($=>{var _=r.get($);return _===void 0||_.v!==le});for(var[d,g]of r)g.v!==le&&!(d in h)&&p.push(d);return p},setPrototypeOf(){Ds()}})}function Ur(e,t){return typeof t=="symbol"?`${e}[Symbol(${t.description??""})]`:Bl.test(t)?`${e}.${t}`:/^\d+$/.test(t)?`${e}[${t}]`:`${e}['${t}']`}function pi(e){try{if(e!==null&&typeof e=="object"&&tt in e)return e[tt]}catch{}return e}var Vl=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function Yl(e){return new Proxy(e,{get(t,r,n){var i=Reflect.get(t,r,n);return Vl.has(r)?function(...s){Ws();var a=i.apply(this,s);return ui(),a}:i}})}function Ks(){let e=Array.prototype,t=Array.__svelte_cleanup;t&&t();let{indexOf:r,lastIndexOf:n,includes:i}=e;e.indexOf=function(s,a){let l=r.call(this,s,a);if(l===-1){for(let c=a??0;c<this.length;c+=1)if(pi(this[c])===s){Jn("array.indexOf(...)");break}}return l},e.lastIndexOf=function(s,a){let l=n.call(this,s,a??this.length-1);if(l===-1){for(let c=0;c<=(a??this.length-1);c+=1)if(pi(this[c])===s){Jn("array.lastIndexOf(...)");break}}return l},e.includes=function(s,a){let l=i.call(this,s,a);if(!l){for(let c=0;c<this.length;c+=1)if(pi(this[c])===s){Jn("array.includes(...)");break}}return l},Array.__svelte_cleanup=()=>{e.indexOf=r,e.lastIndexOf=n,e.includes=i}}var hi,Zs,Nn,Js,Qs;function vi(){if(hi===void 0){hi=window,Zs=document,Nn=/Firefox/.test(navigator.userAgent);var e=Element.prototype,t=Node.prototype,r=Text.prototype;Js=ct(t,"firstChild").get,Qs=ct(t,"nextSibling").get,Pi(e)&&(e[$n]=void 0,e[Kn]=null,e[yn]=void 0,e.__e=void 0),Pi(r)&&(r[bn]=void 0),m&&(e.__svelte_meta=null,Ks())}}function Ee(e=""){return document.createTextNode(e)}function Ye(e){return Js.call(e)}function Be(e){return Qs.call(e)}function $e(e,t){if(!D)return Ye(e);var r=Ye(L);if(r===null)r=L.appendChild(Ee());else if(t&&r.nodeType!==jr){var n=Ee();return r?.before(n),ne(n),n}return t&&_i(r),ne(r),r}function Ke(e,t=!1){if(!D){var r=Ye(e);return r instanceof Comment&&r.data===""?Be(r):r}if(t){if(L?.nodeType!==jr){var n=Ee();return L?.before(n),ne(n),n}_i(L)}return L}function an(e,t=!1){if(!D)return Ye(e);var r=$e(e,t);return ie(e),r}function wt(e,t=1,r=!1){let n=D?L:e;for(var i;t--;)i=n,n=Be(n);if(!D)return n;if(r){if(n?.nodeType!==jr){var s=Ee();return n===null?i?.after(s):n.before(s),ne(s),s}_i(n)}return ne(n),n}function Tn(e){e.textContent=""}function gi(){if(!Ae||St!==null)return!1;var e=C.f;return(e&32768)!==0}function er(e,t,r){return t==null||t===Zn?r?document.createElement(e,{is:r}):document.createElement(e):r?document.createElementNS(t,e,{is:r}):document.createElementNS(t,e)}function _i(e){if(e.nodeValue.length<65536)return;let t=e.nextSibling;for(;t!==null&&t.nodeType===jr;)t.remove(),e.nodeValue+=t.nodeValue,t=e.nextSibling}var oo=new WeakMap;function ea(e){var t=C;if(t===null)return N.f|=8388608,e;if(m&&e instanceof Error&&!oo.has(e)&&oo.set(e,ql(e,t)),(t.f&32768)===0&&(t.f&4)===0)throw m&&!t.parent&&e instanceof Error&&ta(e),e;pt(e,t)}function pt(e,t){if(e===_t)throw e;if(!(t!==null&&(t.f&16384)!==0)){for(;t!==null;){if((t.f&128)!==0&&(t.f&33570816)===0){if((t.f&32768)===0)throw e;try{t.b.error(e);return}catch(r){e=r}}t=t.parent}throw m&&e instanceof Error&&ta(e),e}}function ql(e,t){let r=ct(e,"message");if(!(r&&!r.configurable)){for(var n=Nn?"  ":"	",i=`
${n}in ${t.fn?.name||"<unknown>"}`,s=t.ctx;s!==null;)i+=`
${n}in ${s.function?.[Tt].split("/").pop()}`,s=s.p;return{message:e.message+`
${i}
`,stack:e.stack?.split(`
`).filter(a=>!a.includes("svelte/src/internal")).join(`
`)}}}function ta(e){let t=oo.get(e);t&&(Se(e,"message",{value:t.message}),Se(e,"stack",{value:t.stack}))}function lo(e){C===null&&(N===null&&$s(e),ms()),$t&&_s(e)}function Gl(e,t){var r=t.last;r===null?t.last=t.first=e:(r.next=e,e.prev=r,t.last=e)}function Nt(e,t){var r=C;if(m)for(;r!==null&&(r.f&131072)!==0;)r=r.parent;r!==null&&(r.f&8192)!==0&&(e|=8192);var n={ctx:Y,deps:null,nodes:null,f:e|2048|512,first:null,fn:t,last:null,next:null,parent:r,b:r&&r.b,prev:null,teardown:null,wv:0,ac:null};m&&(n.component_function=zt),P?.register_created_effect(n);var i=n;if((e&4)!==0)sn!==null?sn.push(n):yt.ensure().schedule(n);else if(t!==null){try{Qt(n)}catch(a){throw pe(n),a}i.deps===null&&i.teardown===null&&i.nodes===null&&i.first===i.last&&(i.f&524288)===0&&(i=i.first,(e&16)!==0&&(e&65536)!==0&&i!==null&&(i.f|=65536))}if(i!==null&&(i.parent=r,r!==null&&Gl(i,r),N!==null&&(N.f&2)!==0&&(e&64)===0)){var s=N;(s.effects??=[]).push(i)}return n}function br(){return N!==null&&!nt}function qe(e){let t=Nt(8,null);return se(t,1024),t.teardown=e,t}function gt(e){lo("$effect"),m&&Se(e,"name",{value:"$effect"});var t=C.f,r=!N&&(t&32)!==0&&Y!==null&&!Y.i;if(r){var n=Y;(n.e??=[]).push(e)}else return Yi(e)}function Yi(e){return Nt(1048580,e)}function tr(e){return lo("$effect.pre"),m&&Se(e,"name",{value:"$effect.pre"}),Nt(1048584,e)}function co(e){yt.ensure();let t=Nt(524352,e);return()=>{pe(t)}}function ia(e){yt.ensure();let t=Nt(524352,e);return(r={})=>new Promise(n=>{r.outro?rr(t,()=>{pe(t),n(void 0)}):(pe(t),n(void 0))})}function xt(e){return Nt(4,e)}function zs(e){return Nt(4718592,e)}function Ze(e,t=0){return Nt(8|t,e)}function ve(e,t=[],r=[],n=[]){ai(n,t,r,i=>{Nt(8,()=>{e(...i.map(o))})})}function ot(e,t=0){var r=Nt(16|t,e);return m&&(r.dev_stack=Ht),r}function fo(e,t=0){var r=Nt(16777216|t,e);return m&&(r.dev_stack=Ht),r}function ke(e){return Nt(524320,e)}function uo(e){var t=e.teardown;if(t!==null){let r=$t,n=N;so(!0),be(null);try{t.call(null)}catch(i){pt(i,e.parent)}finally{so(r),be(n)}}}function Sn(e,t=!1){var r=e.first;for(e.first=e.last=null;r!==null;){let i=r.ac;i!==null&&Dt(()=>{i.abort(lr)});var n=r.next;(r.f&64)!==0?r.parent=null:pe(r,t),r=n}}function oa(e){for(var t=e.first;t!==null;){var r=t.next;(t.f&32)===0&&pe(t),t=r}}function pe(e,t=!0){var r=!1;(t||(e.f&262144)!==0)&&e.nodes!==null&&e.nodes.end!==null&&(sa(e.nodes.start,e.nodes.end),r=!0),e.f|=33554432,Sn(e,t&&!r),Pr(e,0);var n=e.nodes&&e.nodes.t;if(n!==null)for(let s of n)s.stop();uo(e),e.f^=33554432,e.f|=16384;var i=e.parent;i!==null&&i.first!==null&&to(e),m&&(e.component_function=null),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes=e.ac=e.b=null}function sa(e,t){for(;e!==null;){var r=e===t?null:Be(e);e.remove(),e=r}}function to(e){var t=e.parent,r=e.prev,n=e.next;r!==null&&(r.next=n),n!==null&&(n.prev=r),t!==null&&(t.first===e&&(t.first=n),t.last===e&&(t.last=r))}function rr(e,t,r=!0){var n=[];e.f|=256,aa(e,n,!0);var i=()=>{r&&pe(e),t&&t()},s=n.length;if(s>0){var a=()=>--s||i();for(var l of n)l.out(a)}else i()}function aa(e,t,r){if((e.f&8192)===0){e.f^=8192;var n=e.nodes&&e.nodes.t;if(n!==null)for(let l of n)(l.is_global||r)&&t.push(l);for(var i=e.first;i!==null;){var s=i.next;if((i.f&64)===0){var a=(i.f&65536)!==0||(i.f&32)!==0&&(e.f&16)!==0;aa(i,t,a?r:!1)}i=s}}}function ln(e){e.f&=-257,la(e,!0)}function la(e,t){if((e.f&256)===0&&(e.f&8192)!==0){e.f^=8192,(e.f&1024)===0&&(se(e,2048),yt.ensure().schedule(e));for(var r=e.first;r!==null;){var n=r.next,i=(r.f&65536)!==0||(r.f&32)!==0;la(r,i?t:!1),r=n}var s=e.nodes&&e.nodes.t;if(s!==null)for(let a of s)(a.is_global||t)&&a.in()}}function cn(e,t){if(e.nodes)for(var r=e.nodes.start,n=e.nodes.end;r!==null;){var i=r===n?null:Be(r);t.append(r),r=i}}var ca=null;var $t=!1;function so(e){$t=e}var N=null,nt=!1;function be(e){N=e}var C=null;function Oe(e){C=e}var Yt=null;function di(e){N!==null&&(!Ae&&(N.f&2097152)!==0||(N.f&2)!==0)&&(Yt??=new Set).add(e)}var Fe=null,rt=0,bt=null;function Xs(e){bt=e}var fa=1,Br=0,At=Br;function io(e){At=e}function nn(){return++fa}function kr(e){var t=e.f;if((t&2048)!==0)return!0;if((t&4096)!==0){for(var r=e.deps,n=r.length,i=0;i<n;i++){var s=r[i];if(kr(s)&&Xi(s),s.wv>e.wv)return!0}(t&512)!==0&&He===null&&se(e,1024)}return!1}function ua(e,t,r=!0){var n=e.reactions;if(n!==null&&!(!Ae&&Yt!==null&&Yt.has(e)))for(var i=0;i<n.length;i++){var s=n[i];(s.f&2)!==0?ua(s,t,!1):t===s&&(r?se(s,2048):(s.f&1024)!==0&&se(s,4096),An(s))}}function ci(e){var t=Fe,r=rt,n=bt,i=N,s=Yt,a=Y,l=nt,c=At,u=e.f;Fe=null,rt=0,bt=null,N=(u&96)===0?e:null,Yt=null,dr(e.ctx),nt=!1,At=++Br,e.ac!==null&&(Dt(()=>{e.ac.abort(lr)}),e.ac=null);try{e.f|=2097152;var v=e.fn,h=v();e.f|=32768;var p=da(e);if(Jt()&&bt!==null&&!nt&&p!==null&&(e.f&6146)===0)for(var d=0;d<bt.length;d++)ua(bt[d],e);if(i!==null&&i!==e){if(Br++,i.deps!==null)for(let g=0;g<r;g+=1)i.deps[g].rv=Br;if(t!==null)for(let g of t)g.rv=Br;bt!==null&&(n===null?n=bt:n.push(...bt))}return(e.f&8388608)!==0&&(e.f^=8388608),h}catch(g){return da(e),ea(g)}finally{e.f^=2097152,Fe=t,rt=r,bt=n,N=i,Yt=s,dr(a),nt=l,At=c}}function da(e){var t=e.deps,r=P?.is_fork;if(Fe!==null){var n;if(r||Pr(e,rt),t!==null&&rt>0)for(t.length=rt+Fe.length,n=0;n<Fe.length;n++)t[rt+n]=Fe[n];else e.deps=t=Fe;if(br()&&(e.f&512)!==0)for(n=rt;n<t.length;n++)(t[n].reactions??=[]).push(e)}else!r&&t!==null&&rt<t.length&&(Pr(e,rt),t.length=rt);return t}function Wl(e,t){let r=t.reactions;if(r!==null){var n=rs.call(r,e);if(n!==-1){var i=r.length-1;i===0?r=t.reactions=null:(r[n]=r[i],r.pop())}}if(r===null&&(t.f&2)!==0&&(Fe===null||!ar.call(Fe,t))){var s=t;(s.f&512)!==0&&(s.f^=512),s.v!==le&&en(s),s.ac!==null&&Dt(()=>{s.ac.abort(lr),s.ac=null,se(s,2048)}),Hs(s),Pr(s,0)}}function Pr(e,t){var r=e.deps;if(r!==null)for(var n=t;n<r.length;n++)Wl(e,r[n])}function Qt(e){var t=e.f;if((t&16384)===0){se(e,1024);var r=C;if(C=e,m){var n=zt;ni(e.component_function);var i=Ht;Qr(e.dev_stack??Ht)}try{(t&16777232)!==0?oa(e):Sn(e),uo(e);var s=ci(e);if(e.teardown=typeof s=="function"?s:null,e.wv=fa,m&&Pt&&(e.f&2048)!==0&&e.deps!==null)for(var a of e.deps)a.set_during_effect&&(a.wv=nn(),a.set_during_effect=!1)}finally{C=r,m&&(ni(n),Qr(i))}}}async function hr(){if(Ae)return new Promise(e=>{requestAnimationFrame(()=>e()),setTimeout(()=>e())});await Promise.resolve(),Er()}function o(e){var t=e.f,r=(t&2)!==0;if(ca?.add(e),N!==null&&!nt){var n=C!==null&&(C.f&16384)!==0;if(!n&&(Yt===null||!Yt.has(e))){var i=N.deps;if((N.f&2097152)!==0)e.rv<Br&&(e.rv=Br,Fe===null&&i!==null&&i[rt]===e?rt++:Fe===null?Fe=[e]:Fe.push(e));else{N.deps??=[],ar.call(N.deps,e)||N.deps.push(e);var s=e.reactions;s===null?e.reactions=[N]:ar.call(s,N)||s.push(N)}}}if(m){if(!nt&&ht&&P===null&&Vt===null&&!ht.warned&&(ht.effect.f&2097152)===0&&!ht.effect_deps.has(e)){ht.warned=!0,os(e.label);var a=Ft("traced at");a&&console.warn(a)}if(Cn.delete(e),Pt&&!nt&&xn!==null&&N!==null&&xn.reaction===N){if(e.trace)e.trace();else if(a=Ft("traced at"),a){var l=xn.entries.get(e);l===void 0&&(l={traces:[]},xn.entries.set(e,l));var c=l.traces[l.traces.length-1];a.stack!==c?.stack&&l.traces.push(a)}}}if($t&&Rt.has(e))return Rt.get(e);if(r){var u=e;if($t){var v=u.v;return((u.f&1024)===0&&u.reactions!==null||ha(u))&&(v=Dn(u)),Rt.set(u,v),v}var h=(u.f&512)===0&&!nt&&N!==null&&(N.f&512)!==0,p=(u.f&32768)===0;kr(u)&&(h&&(u.f|=512),Xi(u)),h&&!p&&(Ki(u),pa(u))}if(He?.has(e))return He.get(e);if((e.f&8388608)!==0)throw e.v;return e.v}function pa(e){if(e.f|=512,e.deps!==null)for(let r of e.deps){var t=r.reactions;t===null?r.reactions=[e]:ar.call(t,e)||t.push(e),(r.f&2)!==0&&(r.f&512)===0&&(Ki(r),pa(r))}}function ha(e){if(e.v===le)return!0;if(e.deps===null)return!1;for(let t of e.deps)if(Rt.has(t)||(t.f&2)!==0&&ha(t))return!0;return!1}function T(e){var t=nt;try{return nt=!0,e()}finally{nt=t}}var Xl=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var Jv=[...Xl,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var Kl=["touchstart","touchmove"];function va(e){return Kl.includes(e)}var Zl=["$state","$state.raw","$derived","$derived.by"],Qv=[...Zl,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];var In=Symbol("events"),vo=new Set,mi=new Set;function ma(e,t,r,n={}){function i(s){if(n.capture||$i.call(t,s),!s.cancelBubble)return Dt(()=>r?.call(this,s))}return e.startsWith("pointer")||e.startsWith("touch")||e==="wheel"?(i.__removed=!1,ye(()=>{i.__removed||t.addEventListener(e,i,n)})):t.addEventListener(e,i,n),i}function dn(e,t,r,n,i){var s={capture:n,passive:i},a=ma(e,t,r,s);(t===document.body||t===window||t===document||t instanceof HTMLMediaElement)&&qe(()=>{a.__removed=!0,t.removeEventListener(e,a,s)})}function Ge(e,t,r){(t[In]??={})[e]=r}function qt(e){for(var t=0;t<e.length;t++)vo.add(e[t]);for(var r of mi)r(e)}var po=null,ho=!1;function $i(e){var t=this,r=t.ownerDocument,n=e.type,i=e.composedPath?.()||[],s=i[0]||e.target;po=e,ho||(ho=!0,setTimeout(()=>{ho=!1,po=null}));var a=0,l=po===e&&e[In];if(l){var c=i.indexOf(l);if(c!==-1&&(t===document||t===window)){e[In]=t;return}var u=i.indexOf(t);if(u===-1)return;c<=u&&(a=c)}if(s=i[a]||e.target,s!==t){Se(e,"currentTarget",{configurable:!0,get(){return s||r}});var v=N,h=C;be(null),Oe(null);try{for(var p,d=[];s!==null&&s!==t;){try{var g=s[In]?.[n];g!=null&&(!s.disabled||e.target===s)&&g.call(s,e)}catch($){p?d.push($):p=$}if(e.cancelBubble)break;a++,s=a<i.length?i[a]:null}if(p){for(let $ of d)queueMicrotask(()=>{throw $});throw p}}finally{e[In]=t,delete e.currentTarget,be(v),Oe(h)}}}var Ql=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:e=>e});function $a(e){return Ql?.createHTML(e)??e}function go(e){var t=er("template");return t.innerHTML=$a(e.replaceAll("<!>","<!---->")),t.content}function Gt(e,t){var r=C;r.nodes===null&&(r.nodes={start:e,end:t,a:null,t:null})}function U(e,t){var r=(t&1)!==0,n=(t&2)!==0,i,s=!e.startsWith("<!>");return()=>{if(D)return Gt(L,null),L;i===void 0&&(i=go(s?e:"<!>"+e),r||(i=Ye(i)));var a=n||Nn?document.importNode(i,!0):i.cloneNode(!0);if(r){var l=Ye(a),c=a.lastChild;Gt(l,c)}else Gt(a,a);return a}}function st(){if(D)return Gt(L,null),L;var e=document.createDocumentFragment(),t=document.createComment(""),r=Ee();return e.append(t,r),Gt(t,r),e}function j(e,t){if(D){var r=C;((r.f&32768)===0||r.nodes.end===null)&&(r.nodes.end=L),Ue();return}e!==null&&e.before(t)}function yi(e){let t=0,r=Ie(0),n;return m&&oe(r,"createSubscriber version"),()=>{br()&&(o(r),Ze(()=>(t===0&&(n=T(()=>e(()=>we(r)))),t+=1,()=>{ye(()=>{t-=1,t===0&&(n?.(),n=void 0,we(r))})})))}}var ic=589824;function $o(e,t,r,n){new mo(e,t,r,n)}var mo=class{parent;is_pending=!1;transform_error;#e;#r=D?L:null;#t;#n;#i;#o=null;#a=null;#s=null;#l=null;#d=0;#c=0;#v=!1;#m=new Map;#f=null;#g=yi(()=>(this.#f=Ie(this.#d),m&&oe(this.#f,"$effect.pending()"),()=>{this.#f=null}));constructor(t,r,n,i){this.#e=t,this.#t=r,this.#n=s=>{var a=C;a.b=this,a.f|=128,n(s)},this.parent=C.b,this.transform_error=i??this.parent?.transform_error??(s=>s),this.#i=ot(()=>{if(D){let s=yr(this.#r);Ue();let a=s==="[!";if(s.startsWith("[?")){let c=JSON.parse(s.slice("[?".length));this.#b(c)}else a?this.#h():this.#$()}else this.#y()},ic),D&&(this.#e=L)}#$(){try{this.#o=ke(()=>this.#n(this.#e))}catch(t){this.error(t)}}#b(t){let r=this.#t.failed,{reset:n,invoke_onerror:i}=this.#_(t);ye(i),r&&(this.#s=ke(()=>{r(this.#e,()=>t,()=>n)}))}#_(t){var r=!1,n=!1;let i=()=>{if(!this.#u()){if(r){ds();return}r=!0,n&&Rs(),this.#s!==null&&rr(this.#s,()=>{this.#s=null}),this.#w(()=>{this.#y()})}};return{reset:i,invoke_onerror:()=>{if(!this.#u())try{n=!0,this.#t.onerror?.(t,i),n=!1}catch(a){pt(a,this.#i&&this.#i.parent)}}}}#u(){return(this.#i.f&33570816)!==0}#h(){let t=this.#t.pending;t&&(this.is_pending=!0,this.#a=ke(()=>t(this.#e)),ye(()=>{if(!this.#u()){var r=this.#l=document.createDocumentFragment(),n=Ee(),i=!1;if(r.append(n),this.#o=this.#w(()=>{try{return ke(()=>this.#n(n))}catch(s){try{this.error(s),i=!0}catch(a){pt(a,this.#i.parent)}return null}}),this.#o===null){this.#l=null,i&&this.#p(P);return}this.#c===0&&(this.#e.before(r),this.#l=null,rr(this.#a,()=>{this.#a=null}),this.#p(P))}}))}#y(){try{if(this.is_pending=this.has_pending_snippet(),this.#c=0,this.#d=0,this.#o=ke(()=>{this.#n(this.#e)}),this.#c>0){var t=this.#l=document.createDocumentFragment();cn(this.#o,t);let r=this.#t.pending;this.#a=ke(()=>r(this.#e))}else this.#p(P)}catch(r){this.error(r)}}#p(t){this.is_pending=!1,t.transfer_reactions(this.#m)}defer_effect(t){oi(t,this.#m)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#t.pending}#w(t){var r=C,n=N,i=Y;Oe(this.#i),be(this.#i),dr(this.#i.ctx);try{return yt.ensure(),t()}finally{Oe(r),be(n),dr(i)}}#x(t,r){if(!this.has_pending_snippet()){this.parent&&this.parent.#x(t,r);return}this.#c+=t,this.#c===0&&(this.#p(r),this.#a&&rr(this.#a,()=>{this.#a=null}),this.#l&&(this.#e.before(this.#l),this.#l=null))}update_pending_count(t,r){this.#x(t,r),this.#d+=t,!(!this.#f||this.#v)&&(this.#v=!0,ye(()=>{this.#v=!1,this.#f&&Bt(this.#f,this.#d)}))}get_effect_pending(){return this.#g(),o(this.#f)}error(t){if(t===_t||!this.#t.onerror&&!this.#t.failed)throw t;P?.is_fork?(this.#o&&P.skip_effect(this.#o),this.#a&&P.skip_effect(this.#a),this.#s&&P.skip_effect(this.#s),P.oncommit(()=>{this.#u()||this.#E(t)})):this.#E(t)}#E(t){this.#o&&(pe(this.#o),this.#o=null),this.#a&&(pe(this.#a),this.#a=null),this.#s&&(pe(this.#s),this.#s=null),D&&(ne(this.#r),zi(),ne(Lt()));let r=this.#t.failed,n=i=>{if(this.#u())return;let{reset:s,invoke_onerror:a}=this.#_(i);a(),r&&!this.#u()&&(this.#s=this.#w(()=>{try{return ke(()=>{var l=C;l.b=this,l.f|=128,r(this.#e,()=>i,()=>s)})}catch(l){return pt(l,this.#i.parent),null}}))};ye(()=>{if(!this.#u()){var i;try{i=this.transform_error(t)}catch(s){pt(s,this.#i&&this.#i.parent);return}i!==null&&typeof i=="object"&&typeof i.then=="function"?i.then(n,s=>pt(s,this.#i&&this.#i.parent)):n(i)}})}};var yo=!0;function wi(e,t){var r=t==null?"":typeof t=="object"?`${t}`:t;r!==(e[bn]??=e.nodeValue)&&(e[bn]=r,e.nodeValue=`${r}`)}function fn(e,t){return ba(e,t)}function wo(e,t){vi(),t.intro=t.intro??!1;let r=t.target,n=D,i=L;try{for(var s=Ye(r);s&&(s.nodeType!==kt||s.data!=="[");)s=Be(s);if(!s)throw _t;_e(!0),ne(s);let a=ba(e,{...t,anchor:s});return _e(!1),a}catch(a){if(a instanceof Error&&a.message.split(`
`).some(l=>l.startsWith("https://svelte.dev/e/")))throw a;return a!==_t&&console.warn("Failed to hydrate: ",a),t.recover===!1&&ws(),vi(),Tn(r),_e(!1),fn(e,t)}finally{_e(n),ne(i)}}var bi=new Map;function ba(e,{target:t,anchor:r,props:n={},events:i,context:s,intro:a=!0,transformError:l}){vi();var c=void 0,u=ia(()=>{var v=r??t.appendChild(Ee());$o(v,{pending:()=>{}},d=>{dt({});var g=Y;if(s&&(g.c=s),i&&(n.$$events=i),D&&Gt(d,null),yo=a,c=e(d,n)||En(),yo=!0,D&&(C.nodes.end=L,L===null||L.nodeType!==kt||L.data!=="]"))throw Ar(),_t;ft()},l);var h=new Set,p=d=>{for(var g=0;g<d.length;g++){var $=d[g];if(!h.has($)){h.add($);var _=va($);for(let O of[t,document]){var b=bi.get(O);b===void 0&&(b=new Map,bi.set(O,b));var w=b.get($);w===void 0?(O.addEventListener($,$i,{passive:_}),b.set($,1)):b.set($,w+1)}}}};return p(Gr(vo)),mi.add(p),()=>{for(var d of h)for(let _ of[t,document]){var g=bi.get(_),$=g.get(d);--$==0?(_.removeEventListener(d,$i),g.delete(d),g.size===0&&bi.delete(_)):g.set(d,$)}mi.delete(p),v!==r&&v.parentNode?.removeChild(v)}});return bo.set(c,u),c}var bo=new WeakMap;function Mn(e,t){let r=bo.get(e);return r?(bo.delete(e),r(t)):(m&&cs(),Promise.resolve())}var Wt=class{anchor;#e=new Map;#r=new Map;#t=new Map;#n=new Set;#i=!0;constructor(t,r=!0){this.anchor=t,this.#i=r}#o=t=>{if(this.#e.has(t)){var r=this.#e.get(t),n=this.#r.get(r);if(n)ln(n),this.#n.delete(r);else{var i=this.#t.get(r);i&&(ln(i.effect),this.#r.set(r,i.effect),this.#t.delete(r),m&&(i.fragment.lastChild[Fi]=this.anchor),i.fragment.lastChild.remove(),this.anchor.before(i.fragment),n=i.effect)}for(let[s,a]of this.#e){if(this.#e.delete(s),s===t)break;let l=this.#t.get(a);l&&(pe(l.effect),this.#t.delete(a))}for(let[s,a]of this.#r){if(s===r||this.#n.has(s))continue;let l=()=>{if(Array.from(this.#e.values()).includes(s)){var u=document.createDocumentFragment();cn(a,u),u.append(Ee()),this.#t.set(s,{effect:a,fragment:u})}else pe(a);this.#n.delete(s),this.#r.delete(s)};this.#i||!n?(this.#n.add(s),rr(a,l,!1)):l()}}};#a=t=>{this.#e.delete(t);let r=Array.from(this.#e.values());for(let[n,i]of this.#t)r.includes(n)||(pe(i.effect),this.#t.delete(n))};ensure(t,r){var n=P,i=gi();if(r&&!this.#r.has(t)&&!this.#t.has(t))if(i){var s=document.createDocumentFragment(),a=Ee();s.append(a),this.#t.set(t,{effect:ke(()=>r(a)),fragment:s})}else this.#r.set(t,ke(()=>r(this.anchor)));if(this.#e.set(n,t),i){for(let[l,c]of this.#r)l===t?n.unskip_effect(c):n.skip_effect(c);for(let[l,c]of this.#t)l===t?n.unskip_effect(c.effect):n.skip_effect(c.effect);n.oncommit(this.#o),n.ondiscard(this.#a)}else D&&(this.anchor=L),this.#o(n)}};function jt(e,t,r=!1){var n;D&&(n=L,Ue());var i=new Wt(e),s=r?65536:0;function a(l,c){if(D){var u=yr(n);if(l!==parseInt(u.substring(1))){var v=Lt();ne(v),i.anchor=v,_e(!1),i.ensure(l,c),_e(!0);return}}i.ensure(l,c)}ot(()=>{var l=!1;t((c,u=0)=>{l=!0,a(u,c)}),l||a(-1,null)},s)}function Xt(e,t){return t}function fc(e,t,r){for(var n=[],i=t.length,s,a=t.length,l=0;l<i;l++){let h=t[l];rr(h,()=>{if(s){if(s.pending.delete(h),s.done.add(h),s.pending.size===0){var p=e.outrogroups;xo(e,Gr(s.done)),p.delete(s),p.size===0&&(e.outrogroups=null)}}else a-=1},!1)}if(a===0){var c=n.length===0&&r!==null&&e.pending.size===0;if(c){var u=r,v=u.parentNode;Tn(v),v.append(u),e.items.clear()}xo(e,t,!c)}else s={pending:new Set(t),done:new Set},(e.outrogroups??=new Set).add(s)}function xo(e,t,r=!0){var n;if(e.pending.size>0){n=new Set;for(let a of e.pending.values())for(let l of a)n.add(e.items.get(l).e)}for(var i=0;i<t.length;i++){var s=t[i];if(n?.has(s)){s.f|=33554432;let a=document.createDocumentFragment();cn(s,a)}else pe(t[i],r)}}var wa;function Et(e,t,r,n,i,s=null){var a=e,l=new Map,c=(t&4)!==0;if(c){var u=e;a=D?ne(Ye(u)):u.appendChild(Ee())}D&&Ue();var v=null,h=Mr(()=>{var w=r();return sr(w)?w:w==null?[]:Gr(w)});m&&oe(h,"{#each ...}");var p=new Map,d=!0;function g(w){if((b.effect.f&16384)===0){b.pending.delete(w);var O=o(h);b.fallback=v,uc(b,O,a,t,n),v!==null&&(O.length===0?(v.f&33554432)===0?ln(v):(v.f^=33554432,Pn(v,null,a)):rr(v,()=>{v=null}))}}function $(w){b.pending.delete(w)}var _=ot(()=>{var w=o(h),O=w.length;let E=!1;if(D){var S=yr(a)==="[!";S!==(O===0)&&(a=Lt(),ne(a),_e(!1),E=!0)}for(var x=new Set,R=P,q=gi(),I=0;I<O;I+=1){D&&L.nodeType===kt&&L.data==="]"&&(a=L,E=!0,_e(!1));var X=w[I],te=n(X,I);if(m){var K=n(X,I);te!==K&&gs(String(I),String(te),String(K))}var k=d?null:l.get(te);k?(k.v&&Bt(k.v,X),k.i&&Bt(k.i,I),q&&R.unskip_effect(k.e)):(k=pc(l,d?a:wa??=Ee(),X,te,I,i,t,r),d||(k.e.f|=33554432),l.set(te,k)),x.add(te)}if(O===0&&s&&!v&&(d?v=ke(()=>s(a)):(v=ke(()=>s(wa??=Ee())),v.f|=33554432)),O>x.size&&(m?hc(w,n):Bi("","","")),D&&O>0&&ne(Lt()),!d)if(p.set(R,x),q){for(let[B,W]of l)x.has(B)||R.skip_effect(W.e);R.oncommit(g),R.ondiscard($)}else g(R);E&&_e(!0),o(h)}),b={effect:_,flags:t,items:l,pending:p,outrogroups:null,fallback:v};d=!1,D&&(a=L)}function Ln(e){for(;e!==null&&(e.f&32)===0;)e=e.next;return e}function uc(e,t,r,n,i){var s=(n&8)!==0,a=t.length,l=e.items,c=Ln(e.effect.first),u,v=null,h,p=[],d=[],g,$,_,b;if(s)for(b=0;b<a;b+=1)g=t[b],$=i(g,b),_=l.get($).e,(_.f&33554432)===0&&(_.nodes?.a?.measure(),(h??=new Set).add(_));for(b=0;b<a;b+=1){if(g=t[b],$=i(g,b),_=l.get($).e,e.outrogroups!==null)for(let X of e.outrogroups)X.pending.delete(_),X.done.delete(_);if((_.f&8192)!==0&&(ln(_),s&&(_.nodes?.a?.unfix(),(h??=new Set).delete(_))),(_.f&33554432)!==0)if(_.f^=33554432,_===c)Pn(_,null,r);else{var w=v?v.next:c;_===e.effect.last&&(e.effect.last=_.prev),_.prev&&(_.prev.next=_.next),_.next&&(_.next.prev=_.prev),Tr(e,v,_),Tr(e,_,w),Pn(_,w,r),v=_,p=[],d=[],c=Ln(v.next);continue}if(_!==c){if(u!==void 0&&u.has(_)){if(p.length<d.length){var O=d[0],E;v=O.prev;var S=p[0],x=p[p.length-1];for(E=0;E<p.length;E+=1)Pn(p[E],O,r);for(E=0;E<d.length;E+=1)u.delete(d[E]);Tr(e,S.prev,x.next),Tr(e,v,S),Tr(e,x,O),c=O,v=x,b-=1,p=[],d=[]}else u.delete(_),Pn(_,c,r),Tr(e,_.prev,_.next),Tr(e,_,v===null?e.effect.first:v.next),Tr(e,v,_),v=_;continue}for(p=[],d=[];c!==null&&c!==_;)(u??=new Set).add(c),d.push(c),c=Ln(c.next);if(c===null)continue}(_.f&33554432)===0&&p.push(_),v=_,c=Ln(_.next)}if(e.outrogroups!==null){for(let X of e.outrogroups)X.pending.size===0&&(xo(e,Gr(X.done)),e.outrogroups?.delete(X));e.outrogroups.size===0&&(e.outrogroups=null)}if(c!==null||u!==void 0){var R=[];if(u!==void 0)for(_ of u)(_.f&8192)===0&&R.push(_);for(;c!==null;)(c.f&8192)===0&&c!==e.fallback&&R.push(c),c=Ln(c.next);var q=R.length;if(q>0){var I=(n&4)!==0&&a===0?r:null;if(s){for(b=0;b<q;b+=1)R[b].nodes?.a?.measure();for(b=0;b<q;b+=1)R[b].nodes?.a?.fix()}fc(e,R,I)}}s&&ye(()=>{if(h!==void 0)for(_ of h)_.nodes?.a?.apply()})}function pc(e,t,r,n,i,s,a,l){var c=(a&1)!==0?(a&16)===0?zr(r,!1,!1):Ie(r):null,u=(a&2)!==0?Ie(i):null;return m&&c&&(c.trace=()=>{l()[u?.v??i]}),{v:c,i:u,e:ke(()=>(s(t,c??r,u??i,l),()=>{e.delete(n)}))}}function Pn(e,t,r){if(e.nodes)for(var n=e.nodes.start,i=e.nodes.end,s=t&&(t.f&33554432)===0?t.nodes.start:r;n!==null;){var a=Be(n);if(s.before(n),n===i)return;n=a}}function Tr(e,t,r){t===null?e.effect.first=r:t.next=r,r===null?e.effect.last=t:r.prev=t}function hc(e,t){let r=new Map,n=e.length;for(let i=0;i<n;i++){let s=t(e[i],i);if(r.has(s)){let a=String(r.get(s)),l=String(i),c=String(s);c.startsWith("[object ")&&(c=null),Bi(a,l,c)}r.set(s,i)}}function Ot(e,t,...r){var n=new Wt(e);ot(()=>{let i=t()??null;m&&i==null&&xs(),n.ensure(i,i&&(s=>i(s,...r)))},65536)}function Fn(e,t,r){var n;D&&(n=L,Ue());var i=new Wt(e);ot(()=>{var s=t()??null;if(D){var a=yr(n),l=a==="[",c=s!==null;if(l!==c){var u=Lt();ne(u),i.anchor=u,_e(!1),i.ensure(s,s&&(v=>r(v,s))),_e(!0);return}}i.ensure(s,s&&(v=>r(v,s)))},65536)}function Je(e,t){var r=void 0,n;fo(()=>{r!==(r=t())&&(n&&(pe(n),n=null),r&&(n=ke(()=>{xt(()=>r(e))})))})}function ka(e){var t,r,n="";if(typeof e=="string"||typeof e=="number")n+=e;else if(typeof e=="object")if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(r=ka(e[t]))&&(n&&(n+=" "),n+=r)}else for(r in e)e[r]&&(n&&(n+=" "),n+=r);return n}function Ta(){for(var e,t,r=0,n="",i=arguments.length;r<i;r++)(e=arguments[r])&&(t=ka(e))&&(n&&(n+=" "),n+=t);return n}function Kt(e){return typeof e=="object"?Ta(e):e??""}var Ca=[...` 	
\r\f\xA0\v\uFEFF`];function Sa(e,t,r){var n=e==null?"":""+e;if(t&&(n=n?n+" "+t:t),r){for(var i of Object.keys(r))if(r[i])n=n?n+" "+i:i;else if(n.length)for(var s=i.length,a=0;(a=n.indexOf(i,a))>=0;){var l=a+s;(a===0||Ca.includes(n[a-1]))&&(l===n.length||Ca.includes(n[l]))?n=(a===0?"":n.substring(0,a))+n.substring(l+1):a=l}}return n===""?null:n}function Da(e,t=!1){var r=t?" !important;":";",n="";for(var i of Object.keys(e)){var s=e[i];s!=null&&s!==""&&(n+=" "+i+": "+s+r)}return n}function Eo(e){return e[0]!=="-"||e[1]!=="-"?e.toLowerCase():e}function Ra(e,t){if(t){var r="",n,i;if(Array.isArray(t)?(n=t[0],i=t[1]):n=t,e){e=String(e).replaceAll(/\/\*.*?\*\//g,"").trim();var s=!1,a=0,l=!1,c=[];n&&c.push(...Object.keys(n).map(Eo)),i&&c.push(...Object.keys(i).map(Eo));var u=0,v=-1;let $=e.length;for(var h=0;h<$;h++){var p=e[h];if(l?p==="/"&&e[h-1]==="*"&&(l=!1):s?s===p&&(s=!1):p==="/"&&e[h+1]==="*"?l=!0:p==='"'||p==="'"?s=p:p==="("?a++:p===")"&&a--,!l&&s===!1&&a===0){if(p===":"&&v===-1)v=h;else if(p===";"||h===$-1){if(v!==-1){var d=Eo(e.substring(u,v).trim());if(!c.includes(d)){p!==";"&&h++;var g=e.substring(u,h).trim();r+=" "+g+";"}}u=h+1,v=-1}}}}return n&&(r+=Da(n)),i&&(r+=Da(i,!0)),r=r.trim(),r===""?null:r}return e==null?null:String(e)}function ee(e,t,r,n,i,s){var a=e[$n];if(D||a!==r||a===void 0){var l=Sa(r,n,s);(!D||l!==e.getAttribute("class"))&&(l==null?e.removeAttribute("class"):t?e.className=l:e.setAttribute("class",l)),e[$n]=r}else if(s&&i!==s)for(var c in s){var u=!!s[c];(i==null||u!==!!i[c])&&e.classList.toggle(c,u)}return s}function ko(e,t={},r,n){for(var i in r){var s=r[i];t[i]!==s&&(r[i]==null?e.style.removeProperty(i):e.style.setProperty(i,s,n))}}function Vr(e,t,r,n){var i=e[yn];if(D||i!==t){var s=Ra(t,n);(!D||s!==e.getAttribute("style"))&&(s==null?e.removeAttribute("style"):e.style.cssText=s),e[yn]=t}else n&&(Array.isArray(n)?(ko(e,r?.[0],n[0]),ko(e,r?.[1],n[1],"important")):ko(e,r,n));return n}var kc=Symbol("is custom element"),Tc=Symbol("is html"),Cc=Hi?"link":"LINK";function at(e,t,r,n){var i=Dc(e);if(D&&(i[t]=e.getAttribute(t),t==="src"||t==="srcset"||t==="href"&&e.nodeName===Cc)){n||Rc(e,t,r??"");return}var s=i[t];s!==(i[t]=r)&&(t==="loading"&&(e[is]=r),r==null?e.removeAttribute(t):typeof r!="string"&&Sc(e).has(t)?e[t]=r:D&&(typeof r=="number"||typeof r=="boolean")&&s===String(r)||e.setAttribute(t,r))}function Dc(e){return e[Kn]??={[kc]:e.nodeName.includes("-"),[Tc]:e.namespaceURI===Zn}}var Aa=new Map;function Sc(e){var t=e.getAttribute("is")||e.nodeName,r=Aa.get(t);if(r)return r;Aa.set(t,r=new Set);for(var n,i=e,s=Element.prototype;s!==i;){n=Mi(i);for(var a in n)n[a].set&&a!=="innerHTML"&&a!=="textContent"&&a!=="innerText"&&r.add(a);i=Wr(i)}return r}function Rc(e,t,r){m&&(t==="srcset"&&Ac(e,r)||To(e.getAttribute(t)??"",r)||ls(t,e.outerHTML.replace(e.innerHTML,e.innerHTML&&"..."),String(r)))}function To(e,t){return e===t?!0:new URL(e,document.baseURI).href===new URL(t,document.baseURI).href}function Na(e){return e.split(",").map(t=>t.trim().split(" ").filter(Boolean))}function Ac(e,t){var r=Na(e.srcset),n=Na(t);return n.length===r.length&&n.every(([i,s],a)=>s===r[a][1]&&(To(r[a][0],i)||To(i,r[a][0])))}function Co(e,t){return e===t||e?.[tt]===t}function Cr(e=En(),t,r,n){var i=Y.r,s=C;return xt(()=>{var a,l;return Ze(()=>{a=l,l=n?.()||[],T(()=>{Co(r(...l),e)||(t(e,...l),a&&Co(r(...a),e)&&t(null,...a))})}),()=>{let c=s;for(;c!==i&&c.parent!==null&&c.parent.f&33554432;)c=c.parent;let u=()=>{l&&Co(r(...l),e)&&t(null,...l)},v=c.teardown;c.teardown=()=>{u(),v?.()}}}),e}var Ei=!1;function Do(e){var t=Ei;try{return Ei=!1,[e(),Ei]}finally{Ei=t}}var Fc={get(e,t){if(!e.exclude.has(t))return e.props[t]},set(e,t){return m&&ks(`${e.name}.${String(t)}`),!1},getOwnPropertyDescriptor(e,t){if(!e.exclude.has(t)&&t in e.props)return{enumerable:!0,configurable:!0,value:e.props[t]}},has(e,t){return e.exclude.has(t)?!1:t in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(t=>!e.exclude.has(t))}};function So(e,t,r){return new Proxy(m?{props:e,exclude:t,name:r}:{props:e,exclude:t},Fc)}function Te(e,t,r,n){var i=!cr||(r&2)!==0,s=(r&8)!==0,a=(r&16)!==0,l=n,c=!0,u=void 0,v=()=>a&&i?(u??=xr(n),o(u)):(c&&(c=!1,l=a?T(n):n),l);let h;if(s){var p=tt in e||mn in e;h=ct(e,t)?.set??(p&&t in e?E=>e[t]=E:void 0)}var d,g=!1;s?[d,g]=Do(()=>e[t]):d=e[t],d===void 0&&n!==void 0&&(d=v(),h&&(i&&Es(t),h(d)));var $;if(i?$=()=>{var E=e[t];return E===void 0?v():(c=!0,E)}:$=()=>{var E=e[t];return E!==void 0&&(l=void 0),E===void 0?l:E},i&&(r&4)===0)return $;if(h){var _=e.$$legacy;return(function(E,S){return arguments.length>0?((!i||!S||_||g)&&h(S?$():E),E):$()})}var b=!1,w=((r&1)!==0?xr:Mr)(()=>(b=!1,$()));m&&(w.label=t),s&&o(w);var O=C;return(function(E,S){if(arguments.length>0){let x=S?o(w):i&&s?xe(E):E;return y(w,x),b=!0,l!==void 0&&(l=x),E}return $t&&b||(O.f&16384)!==0?w.v:o(w)})}function Ia(e){return new Ro(e)}var Ro=class{#e;#r;constructor(t){var r=new Map,n=(s,a)=>{var l=zr(a,!1,!1);return r.set(s,l),l};let i=new Proxy({...t.props||{},$$events:{}},{get(s,a){return o(r.get(a)??n(a,Reflect.get(s,a)))},has(s,a){return a===mn?!0:(o(r.get(a)??n(a,Reflect.get(s,a))),Reflect.has(s,a))},set(s,a,l){return y(r.get(a)??n(a,l),l),Reflect.set(s,a,l)}});this.#r=(t.hydrate?wo:fn)(t.component,{target:t.target,anchor:t.anchor,props:i,context:t.context,intro:t.intro??!1,recover:t.recover,transformError:t.transformError}),!Ae&&(!t?.props?.$$host||t.sync===!1)&&Er(),this.#e=i.$$events;for(let s of Object.keys(this.#r))s==="$set"||s==="$destroy"||s==="$on"||Se(this,s,{get(){return this.#r[s]},set(a){this.#r[s]=a},enumerable:!0});this.#r.$set=s=>{Object.assign(i,s)},this.#r.$destroy=()=>{Mn(this.#r)}}$set(t){this.#r.$set(t)}$on(t,r){this.#e[t]=this.#e[t]||[];let n=(...i)=>r.call(this,...i);return this.#e[t].push(n),()=>{this.#e[t]=this.#e[t].filter(i=>i!==n)}}$destroy(){this.#r.$destroy()}};var Gc;typeof HTMLElement=="function"&&(Gc=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(e,t,r){super(),this.$$ctor=e,this.$$s=t,r&&(this.$$shadowRoot=this.attachShadow(r))}addEventListener(e,t,r){if(this.$$l[e]=this.$$l[e]||[],this.$$l[e].push(t),this.$$c){let n=this.$$c.$on(e,t);this.$$l_u.set(t,n)}super.addEventListener(e,t,r)}removeEventListener(e,t,r){if(super.removeEventListener(e,t,r),this.$$c){let n=this.$$l_u.get(t);n&&(n(),this.$$l_u.delete(t))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let e=function(n){return i=>{let s=er("slot");n!=="default"&&(s.name=n),j(i,s)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let t={},r=Wc(this);for(let n of this.$$s)n in r&&(n==="default"&&!this.$$d.children?(this.$$d.children=e(n),t.default=!0):t[n]=e(n));for(let n of this.attributes){let i=this.$$g_p(n.name);i in this.$$d||(this.$$d[i]=Ao(i,n.value,this.$$p_d,"toProp"))}for(let n in this.$$p_d)!(n in this.$$d)&&this[n]!==void 0&&(this.$$d[n]=this[n],delete this[n]);this.$$c=Ia({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:t,$$host:this}}),this.$$me=co(()=>{Ze(()=>{this.$$r=!0;for(let n of Ii(this.$$c)){if(!this.$$p_d[n]?.reflect)continue;this.$$d[n]=this.$$c[n];let i=Ao(n,this.$$d[n],this.$$p_d,"toAttribute");i==null?this.removeAttribute(this.$$p_d[n].attribute||n):this.setAttribute(this.$$p_d[n].attribute||n,i)}this.$$r=!1})});for(let n in this.$$l)for(let i of this.$$l[n]){let s=this.$$c.$on(n,i);this.$$l_u.set(i,s)}this.$$l={}}}attributeChangedCallback(e,t,r){this.$$r||(e=this.$$g_p(e),this.$$d[e]=Ao(e,r,this.$$p_d,"toProp"),this.$$c?.$set({[e]:this.$$d[e]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(e){return Ii(this.$$p_d).find(t=>this.$$p_d[t].attribute===e||!this.$$p_d[t].attribute&&t.toLowerCase()===e)||e}});function Ao(e,t,r,n){let i=r[e]?.type;if(t=i==="Boolean"&&typeof t!="boolean"?t!=null:t,!n||!r[e])return t;if(n==="toAttribute")switch(i){case"Object":case"Array":return t==null?null:JSON.stringify(t);case"Boolean":return t?"":null;case"Number":return t??null;default:return t}else switch(i){case"Object":case"Array":return t&&JSON.parse(t);case"Boolean":return t;case"Number":return t!=null?+t:t;default:return t}}function Wc(e){let t={};return e.childNodes.forEach(r=>{t[r.slot||"default"]=!0}),t}if(m){let e=function(t){if(!(t in globalThis)){let r;Object.defineProperty(globalThis,t,{configurable:!0,get:()=>{if(r!==void 0)return r;Ts(t)},set:n=>{r=n}})}};e("$state"),e("$effect"),e("$derived"),e("$inspect"),e("$props"),e("$bindable")}function Ma(){return N===null&&bs(),(N.ac??=new AbortController).signal}function ki(e){Y===null&&wn("onMount"),cr&&Y.l!==null?Kc(Y).m.push(e):gt(()=>{let t=T(e);if(typeof t=="function")return t})}function Kc(e){var t=e.l;return t.u??={a:[],b:[],m:[]}}typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");var un=class extends Map{#e=new Map;#r=F(0);#t=F(0);#n=At||-1;constructor(t){if(super(),m&&(t=new Map(t),oe(this.#r,"SvelteMap version"),oe(this.#t,"SvelteMap.size")),t){for(var[r,n]of t)super.set(r,n);this.#t.v=super.size}}#i(t){return At===this.#n?F(t):Ie(t)}has(t){var r=this.#e,n=r.get(t);if(n===void 0)if(super.has(t))n=this.#i(0),m&&oe(n,`SvelteMap get(${Jr(t)})`),r.set(t,n);else return o(this.#r),!1;return o(n),!0}forEach(t,r){this.#o(),super.forEach(t,r)}get(t){var r=this.#e,n=r.get(t);if(n===void 0)if(super.has(t))n=this.#i(0),m&&oe(n,`SvelteMap get(${Jr(t)})`),r.set(t,n);else{o(this.#r);return}return o(n),super.get(t)}getOrInsert(t,r){return super.has(t)||this.set(t,r),this.get(t)}getOrInsertComputed(t,r){return super.has(t)||this.set(t,r(t)),this.get(t)}set(t,r){var n=this.#e,i=n.get(t),s=super.get(t),a=super.set(t,r),l=this.#r;if(i===void 0)i=this.#i(0),m&&oe(i,`SvelteMap get(${Jr(t)})`),n.set(t,i),y(this.#t,super.size),we(l);else if(s!==r){we(i);var c=l.reactions===null?null:new Set(l.reactions),u=c===null||!i.reactions?.every(v=>c.has(v));u&&we(l)}return a}delete(t){var r=this.#e,n=r.get(t),i=super.delete(t);return n!==void 0&&(r.delete(t),y(n,-1)),i&&(y(this.#t,super.size),we(this.#r)),i}clear(){if(super.size!==0){super.clear();var t=this.#e;y(this.#t,0);for(var r of t.values())y(r,-1);we(this.#r),t.clear()}}#o(){o(this.#r);var t=this.#e;if(this.#t.v!==t.size){for(var r of super.keys())if(!t.has(r)){var n=this.#i(0);m&&oe(n,`SvelteMap get(${Jr(r)})`),t.set(r,n)}}for([,n]of this.#e)o(n)}keys(){return o(this.#r),super.keys()}values(){return this.#o(),super.values()}entries(){return this.#o(),super.entries()}[Symbol.iterator](){return this.entries()}get size(){return o(this.#t),super.size}};var La=Symbol("replace"),Ti=class extends URLSearchParams{#e=m?oe(F(0),"SvelteURLSearchParams version"):F(0);#r=Pa();#t=!1;#n(){if(!this.#r||this.#t)return;this.#t=!0;let t=super.toString();this.#r.search=t&&`?${t}`,this.#t=!1}[La](t){if(!this.#t&&t.toString()!==super.toString()){this.#t=!0;for(let r of[...super.keys()])super.delete(r);for(let[r,n]of t)super.append(r,n);we(this.#e),this.#t=!1}}append(t,r){super.append(t,r),this.#n(),we(this.#e)}delete(t,r){var n=super.has(t,r);super.delete(t,r),n&&(this.#n(),we(this.#e))}get(t){return o(this.#e),super.get(t)}getAll(t){return o(this.#e),super.getAll(t)}has(t,r){return o(this.#e),super.has(t,r)}keys(){return o(this.#e),super.keys()}forEach(t,r){o(this.#e),super.forEach(t,r)}set(t,r){var n=super.getAll(t);super.set(t,r);var i=super.getAll(t);(n.length!==i.length||n.some((s,a)=>s!==i[a]))&&(this.#n(),we(this.#e))}sort(){super.sort(),this.#n(),we(this.#e)}toString(){return o(this.#e),super.toString()}values(){return o(this.#e),super.values()}entries(){return o(this.#e),super.entries()}[Symbol.iterator](){return this.entries()}get size(){return o(this.#e),super.size}};var Jc=null;function Pa(){return Jc}function qo(e,t=void 0){return function(r){return r.key==="Enter"||r.key===" "&&!r.preventDefault()?e.call(t,r):void 0}}function ir(e,t){return t?null:r=>{typeof e=="string"?r.innerText=e:e?.domNodes?r.replaceChildren(...e.domNodes):e?.html&&(r.innerHTML=e.html)}}function Qc(e){return t=>{let r=n=>{t&&!t.contains(n.target)&&t.dispatchEvent(new CustomEvent(e+"outside",{detail:{jsEvent:n}}))};return document.addEventListener(e,r,!0),()=>{document.removeEventListener(e,r,!0)}}}function ed(e,t=!1){return r=>{let n,i=new ResizeObserver(s=>{for(let a of s){if(t){let{inlineSize:l}=a.contentBoxSize?.[0]??{inlineSize:a.contentRect.width};if(l===n)continue;n=l}e(r,a)}});return i.observe(r),()=>{i.unobserve(r)}}}function Le(...e){return Object.assign(...e)}function qr(e){return Object.keys(e)}function td(e){return Object.entries(e)}function Lo(e,t){return Object.hasOwn(e,t)}function rd(e){return Math.floor(e)}function nd(e){return Math.ceil(e)}function zn(...e){return Math.min(...e)}function Dr(...e){return Math.max(...e)}function id(){return Symbol("ec")}function Yr(e){return e.length}function hn(e){return!Yr(e)}function Go(e=new Date){return-e.getTimezoneOffset()}function _n(e){return Array.isArray(e)}function De(e){return typeof e=="function"}function Xa(e){if(typeof e!="object"||e===null)return!1;let t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}function Wo(e){return e instanceof Date}var Si=e=>e;function od(e){return t=>t===void 0?void 0:e(t)}var Fa=new WeakMap,sd=1;function Ka(e){let t=Fa.get(e);return t||(t=sd++,Fa.set(e,t)),t}function Za(e){return{url:e.url?.replace(/&+$/,"")||"",method:e.method?.toUpperCase()||"GET",extraParams:e.extraParams??{}}}function Vn(e,t,r,n){return n?{snippet:n,arg:t?.()}:{content:(De(e)?e(t?.()):e)??(De(r)?r():r)}}var Po=86400;function Mt(e=new Date,t=void 0){return Wo(e)?fd(e,t):ud(e,t)}function pn(e){if(typeof e=="number")e={seconds:e};else if(typeof e=="string"){let r=0,n=2;for(let i of e.split(":",3))r+=parseInt(i,10)*Math.pow(60,n--);e={seconds:r}}else Wo(e)&&(e={hours:e.getUTCHours(),minutes:e.getUTCMinutes(),seconds:e.getUTCSeconds()});let t=e.weeks||e.week||0;return{years:e.years||e.year||0,months:e.months||e.month||0,days:t*7+(e.days||e.day||0),seconds:(e.hours||e.hour||0)*60*60+(e.minutes||e.minute||0)*60+(e.seconds||e.second||0),inWeeks:!!t}}function G(e){let t=new Date(gr(e));return Un(t,Ho(e)),t}function Qe(e,t,r=1){e.setUTCFullYear(e.getUTCFullYear()+r*t.years);let n=e.getUTCMonth()+r*t.months;for(e.setUTCMonth(n),n%=12,n<0&&(n+=12);e.getUTCMonth()!==n;)jo(e);return e.setUTCDate(e.getUTCDate()+r*t.days),e.setUTCSeconds(e.getUTCSeconds()+r*t.seconds),e}function ad(e,t,r=1){return Qe(e,t,-r)}function or(e,t=1){return e.setUTCDate(e.getUTCDate()+t),e}function jo(e,t=1){return or(e,-t)}function lt(e){return e.setUTCHours(0,0,0,0),e}function Ce(e){return new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds())}function Sr(e,t=19){return e.toISOString().substring(0,t)}function gr(e){return e.getTime()}function We(e,...t){return t.every(r=>gr(e)===gr(r))}function ld(e,t){let r=t-e.getUTCDay();return e.setUTCDate(e.getUTCDate()+(r>=0?r:r+7)),e}function Ja(e,t){let r=t-e.getUTCDay();return e.setUTCDate(e.getUTCDate()+(r<=0?r:r-7)),e}function Ha(e){return typeof e=="string"&&e.length<=10}function cd(e,t){return e.setUTCHours(t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds(),0),e}function Me(e){return e.seconds}function Qa(e,t,r){return Qe(e,t),il(e,r,or),e}function el(e,t,r){return ad(e,t),il(e,r,jo),e}function tl(e,t){e=G(e),t===0?e.setUTCDate(e.getUTCDate()+6-e.getUTCDay()):e.setUTCDate(e.getUTCDate()+4-(e.getUTCDay()||7));let r=new Date(Date.UTC(e.getUTCFullYear(),0,1));return Math.ceil(((e-r)/1e3/Po+1)/7)}function dd(e,t,r,n){return Vn(r,()=>({date:Ce(t),week:e}),()=>"W"+String(e).padStart(2,"0"),n)}function rl(e,t={}){let r=e.match(/(?:Z|([+-])(\d{2}):?(\d{2}))$/);if(r)return Le(t,r),r[1]?+(r[1]+"1")*(+r[2]*60+ +r[3]):0}function Xo(e,t,r){return r==="local"&&(r=Go(new Date(e.getTime()-t*6e4))),r!==t&&e.setUTCMinutes(e.getUTCMinutes()+r-t),Un(e,r)}function Fo(e,t){return t==="local"?Go(Ce(e)):t}var nl=Symbol("ec");function Un(e,t){return e[nl]=t,e}function Ho(e){return e[nl]}function fd(e,t=void 0){return Xo(new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds())),Go(e),t??"local")}function ud(e,t=void 0){let r={},n=rl(e,r);n!==void 0&&(e=e.substring(0,r.index));let i=e.match(/\d+/g),s=new Date(Date.UTC(+i[0],+i[1]-1,+i[2],+i[3]||0,+i[4]||0,+i[5]||0));return t!==void 0&&n!==void 0?Xo(s,n,t):Un(s,n??Fo(s,t))}function il(e,t,r){if(t.length&&t.length<7)for(;t.includes(e.getUTCDay());)r(e)}var Ko=id();function ol(e,t){e[Ko]=t}function pd(e){return!!e?.[Ko]}function sl(e){return e[Ko]}function al(e,t,r,n=[]){let i=document.createElement(e);i.className=t,typeof r=="string"?i.innerText=r:r.domNodes?i.replaceChildren(...r.domNodes):r.html&&(i.innerHTML=r.html);for(let s of n)i.setAttribute(...s);return i}function Ci(e){return e.getBoundingClientRect()}function Hn(e){return Ci(e).height}function ll(e,t,r=document,n=[]){n.push(r);for(let i of r.elementsFromPoint(e,t)){if(pd(i))return i;if(i.shadowRoot&&!n.includes(i.shadowRoot)){let s=ll(e,t,i.shadowRoot,n);if(s)return s}}return null}function zo(e,t=void 0){return function(r){r.stopPropagation(),e&&e.call(t,r)}}function hd(e,t,r,n){return{type:e,title:t,currentStart:r.start,currentEnd:r.end,activeStart:n.start,activeEnd:n.end,calendar:void 0}}function vr(e){return e=Le({},e),e.currentStart=Ce(e.currentStart),e.currentEnd=Ce(e.currentEnd),e.activeStart=Ce(e.activeStart),e.activeEnd=Ce(e.activeEnd),e}var vd=1;function Ri(e,t=void 0){return e.map(r=>{let n={id:r.id!=null?String(r.id):`{generated-${vd++}}`,resourceIds:No(r,"resourceId").map(String),allDay:r.allDay??(Ha(r.start)&&Ha(r.end)),start:Mt(r.start,t),end:Mt(r.end,t),title:r.title??"",editable:r.editable,startEditable:r.startEditable,durationEditable:r.durationEditable,display:r.display??"auto",layoutGroup:r.layoutGroup?.toString(),extendedProps:r.extendedProps??{},backgroundColor:r.backgroundColor??r.color,textColor:r.textColor,classNames:No(r,"className"),styles:No(r,"style")};if(n.allDay){lt(n.start);let i=G(n.end);lt(n.end),(!We(n.end,i)||We(n.end,n.start))&&or(n.end)}return n})}function No(e,t){let r=e[t+"s"]??e[t]??[];return _n(r)?r:[r]}function gd(e){return e.map(t=>({events:t.events,...Za(t)}))}function _d(e,t,r){return r.formatRange(e.start,t&&e.event.display!=="pointer"&&!e.zeroDuration?e.end:null)}function md(e,t,r){let n;switch(e.event.display){case"background":n=[];break;case"pointer":n=e.event.allDay?[]:[za(t,e,r)];break;default:n=[...e.event.allDay?[]:[za(t,e,r)],al("h4",r.eventTitle,e.event.title)]}return{domNodes:n}}function za(e,t,r){return al("time",r.eventTime,e,[["datetime",Sr(t.start)]])}function $d(e,t,r){let n=t.classNames;return e&&(De(e)&&(e=e({event:It(t),view:vr(r)})),n=[..._n(e)?e:[e],...n]),n}function It(e){return yd(e,Ce)}function yd(e,t){return e=Le({},e),e.start=t(e.start),e.end=t(e.end),e}var Ua=0;function bd(e,t){e.length=t.length,++Ua;for(let r of e)r?.reposition(Ua)}function Bn(e,t,r,n=void 0){return(!n||e.resourceIds.includes(n.id))&&e.start<r&&e.end>t}function cl(e){return dl(e)||wd(e)||fl(e)}function _r(e){return e==="background"}function dl(e){return e==="preview"}function wd(e){return e==="ghost"}function fl(e){return e==="pointer"}function Ni(e,t,r){return t=e.start>t?e.start:t,r=e.end<r?e.end:r,{start:t,end:r,event:e,zeroDuration:We(t,r)}}function vn(e,t,r=!0){let n=[],i,s,a,l;for(let{gridColumn:c,gridRow:u,resource:v,dayStart:h,dayEnd:p,disabled:d}of t)!d&&Bn(e,h,p,v)&&(n.push(h),i=p,s||(s=c,a=u,l=v));if(n.length){let c=Ni(e,n[0],i);return Le(c,{gridColumn:s,gridRow:a,resource:l,dates:n}),r&&Zo(c),[c]}return[]}function ul(e){let t={},r={};for(let n of e){let{gridColumn:i,gridRow:s}=n;for(let l=1;l<n.dates.length;++l){let c=`${s}_${i+l}`;r[c]?r[c].chunks.push(n):r[c]={sorted:!1,chunks:[n]}}let a=`${s}_${i}`;n.long=r[a],n.prev=t[a],t[a]=n}}function xd(e,t,r=1,n=1){e.prev&&(r=e.prev.bottom+n);let i=r+t;if(e.long){let s=e.long;s.sorted||(s.chunks.sort((a,l)=>a.top-l.top),s.sorted=!0);for(let a of s.chunks)if(r<a.bottom&&i>a.top){let l=a.bottom-r+n;r+=l,i+=l}}return Le(e,{top:r,bottom:i}),r}function Zo(e){let{event:t,gridColumn:r,gridRow:n}=e;e.id=`${Ka(t)}-${r}-${n}`}function gn(e,t){return()=>{let{options:{locale:r}}=e,n=e.options[t],i;return T(()=>{i=De(n)?{format:n}:new Intl.DateTimeFormat(r,n)}),{format:s=>i.format(Ce(s))}}}function Ba(e,t,r=!1){return()=>{let{options:{locale:n}}=e,i=e.options[t],s;return T(()=>{if(De(i))s=(a,l)=>i(Ce(a),l&&Ce(l));else{let a=new Intl.DateTimeFormat(n,i);s=(l,c)=>{if(!c)return a.format(Ce(l));if(r&&(c=cd(G(l),c)),l=Ce(l),c=Ce(c),l<=c)return a.formatRange(l,c);{let u=a.formatRangeToParts(c,l),v="",h=["startRange","endRange"],p=[!1,!1];for(let d of u){let g=h.indexOf(d.source);g>=0?p[g]||(v+=Ed(h[1-g],u),p[g]=!0):v+=d.value}return v}}}}),{formatRange:s}}}function Ed(e,t){let r="";for(let n of t)n.source==e&&(r+=n.value);return r}function kd(e){return Jo(e,"day")}function Td(e){return Jo(e,"week")}function Cd(e){return Jo(e,"month")}function Jo(e,t){return{...e,next:"Next "+t,prev:"Previous "+t}}function Oo(e){return t=>({...t,view:e})}function Dd(e){let t,r;return e&&({start:t,end:r}=e,t&&(t=lt(Mt(t))),r&&(r=lt(Mt(r)))),{start:t,end:r}}function Yn(e,t){return t.start&&e<t.start||t.end&&e>t.end}function Qo(e){let t=[];return pl(e,0,void 0,t),t}function pl(e,t,r,n){let i=[];for(let s of e){let a=Sd(s);i.push(a),n.push(a);let l={level:t,parent:r,children:[]};ol(a,l),s.children&&(l.children=pl(s.children,t+1,a,n))}return i}function Sd(e){return{id:e.id!=null?String(e.id):"",title:e.title??"",eventBackgroundColor:hl(e),eventTextColor:vl(e),expanded:e.expanded,extendedProps:e.extendedProps??{}}}function hl(e){return e?.eventBackgroundColor}function vl(e){return e?.eventTextColor}function Va(e,t){return hn(e.resourceIds)?void 0:t.find(r=>e.resourceIds.includes(r.id))}function gl(e,t,r,n,i){let s=[];e=G(e);let a=G(e);for(Qe(e,n.min),Qe(a,n.max);e<a;)s.push([Sr(e),i.format(e)]),Qe(e,t,r);let l=rd((e-a)/1e3/Me(t));return l&&l!==r&&(s.at(-1)[2]=r-l),s}function _l(e,t,r,n,i){let s=pn(e),a=pn(t);if(r){let l=pn(zn(Me(s),Dr(0,Me(a)-Po))),c=pn(Dr(Me(a),Me(l)+Po)),u=De(r?.eventFilter)?r.eventFilter:v=>!_r(v.display);e:for(let v of n){let h=Qe(G(v),s),p=Qe(G(v),a),d=Qe(G(v),l),g=Qe(G(v),c);for(let $ of i)if(!$.allDay&&u($)&&$.start<g&&$.end>d){if($.start<h){let _=Dr(($.start-v)/1e3,Me(l));_<Me(s)&&(s.seconds=_)}if($.end>p){let _=zn(($.end-v)/1e3,Me(c));_>Me(a)&&(a.seconds=_)}if(Me(s)===Me(l)&&Me(a)===Me(c))break e}}}return{min:s,max:a}}function Ai(e){let t=0,r=F(xe(t));return ml(e,()=>o(r),()=>!0,()=>y(r,++t,!0))}function Rd(e){let t=0,r=xe({});return ml(e,n=>r[n],(n,i)=>n!==i,n=>r[n]=++t)}function ml(e,t,r,n){return new Proxy(e,{get(i,s,a){return Lo(i,s)&&t(s),Reflect.get(i,s,a)},set(i,s,a,l){let c=r(i[s],a),u=Reflect.set(i,s,a,l);return c&&n(s),u}})}function Ad(e){let t={buttonText:{today:"today"},customButtons:{},customScrollbars:!1,date:new Date,dateIncrement:void 0,datesSet:void 0,dayCellContent:void 0,dayHeaderFormat:{weekday:"short",month:"numeric",day:"numeric"},dayHeaderAriaLabelFormat:{dateStyle:"full"},displayEventEnd:!0,duration:{weeks:1},events:[],eventAllUpdated:void 0,eventBackgroundColor:void 0,eventClassNames:void 0,eventClick:void 0,eventColor:void 0,eventContent:void 0,eventDidMount:void 0,eventFilter:void 0,eventGap:1,eventMouseEnter:void 0,eventMouseLeave:void 0,eventOrder:void 0,eventOrderStrict:!1,eventSources:[],eventTextColor:void 0,eventTimeFormat:{hour:"numeric",minute:"2-digit"},filterEventsWithResources:!1,firstDay:0,headerToolbar:{start:"title",center:"",end:"today prev,next"},height:void 0,hiddenDays:[],highlightedDates:[],icons:{},lazyFetching:!0,loading:void 0,locale:void 0,refetchResourcesOnNavigate:!1,resources:[],selectable:!1,theme:{active:"ec-active",bgEvent:"ec-bg-event",bgEvents:"ec-bg-events",body:"ec-body",button:"ec-button",buttonGroup:"ec-button-group",calendar:"ec",colHead:"ec-col-head",customScrollbars:"ec-custom-scrollbars",day:"ec-day",dayHead:"ec-day-head",disabled:"ec-disabled",endClipped:"ec-end-clipped",event:"ec-event",eventBody:"ec-event-body",eventTime:"ec-event-time",eventTitle:"ec-event-title",events:"ec-events",grid:"ec-grid",header:"ec-header",hidden:"ec-hidden",highlight:"ec-highlight",icon:"ec-icon",main:"ec-main",noBeb:"ec-no-beb",noIeb:"ec-no-ieb",startClipped:"ec-start-clipped",today:"ec-today",title:"ec-title",toolbar:"ec-toolbar",view:"",weekdays:["ec-sun","ec-mon","ec-tue","ec-wed","ec-thu","ec-fri","ec-sat"],weekNumber:"ec-week-number"},timeZone:"local",titleFormat:{year:"numeric",month:"short",day:"numeric"},validRange:void 0,view:void 0,viewDidMount:void 0,views:{}};for(let r of e)r.createOptions?.(t);return t}function Nd(e){let t={date:r=>lt(Mt(r)),dateIncrement:od(pn),duration:pn,events:Ri,eventSources:gd,hiddenDays:r=>[...new Set(r)],highlightedDates:r=>r.map(n=>lt(Mt(n))),resources:r=>_n(r)?Qo(r):Xa(r)?Za(r):r,validRange:Dd};for(let r of e)r.createParsers?.(t);return t}var Uo=["buttonText","customButtons","icons","theme"];function Od(e,t){let r=Ad(e),n=Nd(e);r=Bo(r,n),t=Bo(t,n);let i=Io(r,"views")??{},s=Io(t,"views")??{},a=Rd({});Le(a,r),t.view&&(a.view=t.view);let l={},c={},u={},v=new Set([...qr(i),...qr(s)]);for(let h of v){let p=s[h]??{},d=Ya(r,i[h]??i[p.type]??{}),g=Ya(d,t,p),$=Io(g,"component");delete g.view;for(let _ of qr(g))Lo(a,_)?(l[_]??=[],l[_].push(Uo.includes(_)?b=>g[_]=De(b)?b(d[_]):b:b=>g[_]=b)):delete g[_];c[h]=g,u[h]=$}return Le(a,c[a.view]),[a,function(p,d,g=!0){Lo(a,p)&&(g||(p in n?d=n[p](d):Xa(d)?d={...d}:_n(d)&&(d=[...d])),l[p]?.forEach($=>$(d)),a[p]=Uo.includes(p)&&De(d)?c[a.view][p]:d)},function(p){return Le(a,c[p]),u[p]}]}function Bo(e,t){let r={...e};for(let n of qr(t))n in r&&(r[n]=t[n](r[n]));if(e.views){r.views={};for(let n of qr(e.views))r.views[n]=Bo(e.views[n],t)}return r}function Io(e,t){let r=e[t];return delete e[t],r}function Ya(...e){let t={};for(let r of e){let n={};for(let i of Uo)De(r[i])&&(n[i]=r[i](t[i]));t={...t,...r,...n}}return t}function Id(e,t){let r=[];for(let n of qr(e))e[n]!==t[n]&&r.push([n,e[n]]);return r}function Md(e){return()=>{let{options:{view:t}}=e;T(()=>{let r=e.setViewOptions(t);e.extensions={},e.features=[],e.viewComponent=r(e)})}}function Ld(e,t){return()=>{let{activeRange:r,fetchedRange:{events:n},offset:i,viewDates:s,options:{events:a,eventSources:l,lazyFetching:c,timeZone:u}}=e;T(()=>{$l(l.map(v=>De(v.events)?v.events:v),a,v=>Ri(v,i),v=>e.events=Ai(v),u,r,n,s,!0,c,t)})}}function Pd(e,t){return()=>{let{activeRange:r,fetchedRange:{resources:n},viewDates:i,options:{lazyFetching:s,refetchResourcesOnNavigate:a,resources:l,timeZone:c}}=e;T(()=>{$l(_n(l)?[]:[l],l,Qo,u=>e.resources=Ai(u),c,r,n,i,a,s,t)})}}function $l(e,t,r,n,i,s,a,l,c,u,v){if(!hn(l)){if(hn(e)){n(t);return}if((c||!a.start)&&(!u||!a.start||a.start>s.start||a.end<s.end||a.timeZone!==i)){let h=[],p=_=>v.stop(),d=_=>{h=h.concat(r(_)),n(h),v.stop()},g=Sr(s.start),$=Sr(s.end);for(let _ of e)if(v.start(),De(_)){let b=_(c?{start:Ce(s.start),end:Ce(s.end),startStr:g,endStr:$,timeZone:i}:{},d,p);b!==void 0&&Promise.resolve(b).then(d,p)}else{let b=De(_.extraParams)?_.extraParams():Le({},_.extraParams);c&&(b.start=g,b.end=$,i!=="local"&&(b.timeZone=i)),b=new URLSearchParams(b);let w=_.url,O={},E;["GET","HEAD"].includes(_.method)?w+=(w.includes("?")?"&":"?")+b:(O["content-type"]="application/x-www-form-urlencoded;charset=UTF-8",E=String(b)),fetch(w,{method:_.method,headers:O,body:E,signal:Ma(),credentials:"same-origin"}).then(S=>S.json()).then(d).catch(p)}Le(a,{...s,timeZone:i})}}}function Fd(e){let t=0;function r(n){let{options:{loading:i}}=e;De(i)&&i(n)}return{start:()=>++t===1&&r(!0),stop:()=>--t===0&&r(!1)}}function Hd(e){return()=>{let{offset:t}=e,r=setInterval(()=>{let n=Mt(void 0,t),i=lt(G(n));e.now=n,We(e.today,i)||(e.today=i)},1e3);return()=>clearInterval(r)}}function zd(e){return()=>{let{offset:t,options:r}=e;T(()=>{for(let i of e.events)if(!i.allDay)for(let s of["start","end"]){let a=i[s],l=Ho(a);l!==void 0?Xo(a,l,t):Un(a,Fo(a,t))}let n=Ho(r.date);if(n!==void 0){let i=Mt(void 0,t).getUTCDay()-Mt(void 0,n).getUTCDay(),s=or(G(r.date),i);e.setOption("date",s)}Un(r.date,Fo(r.date,t))})}}function Ud(e){return()=>{let{activeRange:t,options:{datesSet:r}}=e;T(()=>{De(r)&&r({start:Ce(t.start),end:Ce(t.end),startStr:Sr(t.start),endStr:Sr(t.end),view:vr(e.view)})})}}function Bd(e){let t;return()=>{let{filteredEvents:r,options:{eventAllUpdated:n}}=e;T(()=>{De(n)&&(t||(t=setTimeout(()=>{t=null,n({view:vr(e.view)})})))})}}function Vd(e){return()=>{let{options:{view:t,viewDidMount:r}}=e;T(()=>{De(r)&&hr().then(()=>r({view:vr(e.view)}))})}}function Yd(e){let t;return()=>{let{options:{date:r,duration:n,firstDay:i}}=e,s,a;return T(()=>{s=G(r),n.years?(s.setUTCMonth(0),s.setUTCDate(1)):n.months?s.setUTCDate(1):n.inWeeks&&Ja(s,i),a=Qe(G(s),n)}),t&&We(t.start,s)&&We(t.end,a)?t:t={start:s,end:a}}}function qd(e){let t;return()=>{let{currentRange:r,extensions:{activeRange:n}}=e,i,s;T(()=>{i=G(r.start),s=G(r.end)});let a=n?n(i,s):{start:i,end:s};return t&&We(t.start,a.start)&&We(t.end,a.end)?t:t=a}}function Gd(e){return()=>{let{events:t,options:{eventFilter:r,eventOrder:n,filterEventsWithResources:i,resources:s,view:a}}=e,l=[...t];return T(()=>{if(De(r)){let c=t.map(It),u=vr(e.view);l=l.filter((v,h)=>r({event:It(v),index:h,events:c,view:u}))}i&&(l=l.filter(c=>s.some(u=>c.resourceIds.includes(u.id)))),De(n)?l.sort((c,u)=>n(It(c),It(u))):l.sort((c,u)=>c.start-u.start||u.allDay-c.allDay)}),l}}function Wd(e){return()=>{let{options:{timeZone:t}}=e,r;return T(()=>{r=t==="UTC"?0:rl(t)??"local"}),r}}function jd(e){return()=>{let{options:t,activeRange:r}=e,{hiddenDays:n}=t,i=[];return T(()=>{let s=lt(G(r.start)),a=lt(G(r.end));for(;s<a;)n.includes(s.getUTCDay())||i.push(G(s)),or(s);if(!i.length&&n.length&&n.length<7){for(;n.includes(s.getUTCDay());)or(s);hr().then(()=>{e.setOption("date",s)})}}),i}}function Xd(e){return()=>{let{currentRange:t,intlTitle:r}=e,n;return T(()=>{n=r.formatRange(t.start,jo(G(t.end)))}),n}}function Kd(e){return()=>{let{activeRange:t,currentRange:r,viewTitle:n,options:{view:i}}=e,s;return T(()=>{s=hd(i,n,r,t)}),s}}var Zd=class{#e;get auxComponents(){return o(this.#e)}set auxComponents(e){y(this.#e,e,!0)}#r;get offset(){return o(this.#r)}set offset(e){y(this.#r,e)}#t;get currentRange(){return o(this.#t)}set currentRange(e){y(this.#t,e)}#n;get activeRange(){return o(this.#n)}set activeRange(e){y(this.#n,e)}#i;get fetchedRange(){return o(this.#i)}set fetchedRange(e){y(this.#i,e,!0)}#o;get events(){return o(this.#o)}set events(e){y(this.#o,e)}#a;get filteredEvents(){return o(this.#a)}set filteredEvents(e){y(this.#a,e)}#s;get mainEl(){return o(this.#s)}set mainEl(e){y(this.#s,e,!0)}#l;get now(){return o(this.#l)}set now(e){y(this.#l,e,!0)}#d;get resources(){return o(this.#d)}set resources(e){y(this.#d,e)}#c;get scrollDate(){return o(this.#c)}set scrollDate(e){y(this.#c,e,!0)}#v;get today(){return o(this.#v)}set today(e){y(this.#v,e,!0)}#m;get intlEventTime(){return o(this.#m)}set intlEventTime(e){y(this.#m,e)}#f;get intlDayHeader(){return o(this.#f)}set intlDayHeader(e){y(this.#f,e)}#g;get intlDayHeaderAL(){return o(this.#g)}set intlDayHeaderAL(e){y(this.#g,e)}#$;get intlTitle(){return o(this.#$)}set intlTitle(e){y(this.#$,e)}#b;get viewDates(){return o(this.#b)}set viewDates(e){y(this.#b,e)}#_;get viewTitle(){return o(this.#_)}set viewTitle(e){y(this.#_,e)}#u;get view(){return o(this.#u)}set view(e){y(this.#u,e)}#h;get viewComponent(){return o(this.#h)}set viewComponent(e){y(this.#h,e,!0)}#y;get extensions(){return o(this.#y)}set extensions(e){y(this.#y,e,!0)}#p;get features(){return o(this.#p)}set features(e){y(this.#p,e,!0)}#w;get interaction(){return o(this.#w)}set interaction(e){y(this.#w,e,!0)}#x;get iClasses(){return o(this.#x)}set iClasses(e){y(this.#x,e,!0)}#E;get iClass(){return o(this.#E)}set iClass(e){y(this.#E,e,!0)}options;setOption;setViewOptions;constructor(e,t){[this.options,this.setOption,this.setViewOptions]=Od(e,t),this.#e=F(xe([])),this.#r=f(Wd(this)),this.#t=f(Yd(this)),this.#n=f(qd(this)),this.#i=F(xe({events:{},resources:{}})),this.#o=F(Ai(this.options.events)),this.#a=f(Gd(this)),this.#s=F(),this.#l=F(xe(Mt(void 0,this.offset))),this.#d=F(Ai(_n(this.options.resources)?this.options.resources:[])),this.#c=F(),this.#v=F(xe(lt(G(this.now)))),this.#m=f(Ba(this,"eventTimeFormat",!0)),this.#f=f(gn(this,"dayHeaderFormat")),this.#g=f(gn(this,"dayHeaderAriaLabelFormat")),this.#$=f(Ba(this,"titleFormat")),this.#b=f(jd(this)),this.#_=f(Xd(this)),this.#u=f(Kd(this)),this.#h=F(),this.#y=F(xe({})),this.#p=F(xe([])),this.snippets={},this.#w=F(xe({})),this.iEvents=new un,this.#x=F(xe(Si)),this.#E=F();for(let r of e)r.initState?.(this);this.#k()}#k(){let e=Fd(this);tr(Md(this)),tr(zd(this)),tr(Hd(this)),gt(Ld(this,e)),gt(Pd(this,e)),gt(Ud(this)),gt(Bd(this)),gt(Vd(this))}},Jd=U("<h2></h2>"),qa=U("<button><i></i></button>"),Ga=U("<button> </button>"),Qd=U("<div><!></div>"),ef=U("<button></button>");function Wa(e,t){dt(t,!0);let r=je("state"),n=f(()=>r.currentRange),i=f(()=>r.snippets),s=f(()=>r.today),a=f(()=>r.viewTitle),l=f(()=>r.viewDates),c=f(()=>r.options.buttonText),u=f(()=>r.options.customButtons),v=f(()=>r.options.date),h=f(()=>r.options.dateIncrement),p=f(()=>r.options.duration),d=f(()=>r.options.hiddenDays),g=f(()=>r.options.theme),$=f(()=>r.options.validRange),_=f(()=>r.options.view),b=F(!1),w=F(!1),O=F(!1),E=!1;tr(()=>{o(l),o($),t.buttons,T(()=>{E||(E=!0,t.buttons.includes("prev")&&(y(b,!1),o($).start&&y(b,S(x),!0)),t.buttons.includes("next")&&(y(w,!1),o($).end&&y(w,S(R),!0)),t.buttons.includes("today")&&(y(O,o(s)>=o(n).start&&o(s)<o(n).end,!0),!o(O)&&(o($).start||o($).end)&&y(O,S(q),!0)),hr().then(()=>E=!1))})});function S(K){let k=o(v);K();let B=o(l).every(W=>Yn(W,o($)));return r.setOption("date",k),B}function x(){r.setOption("date",el(G(o(v)),o(h)??o(p),o(d)))}function R(){r.setOption("date",Qa(G(o(v)),o(h)??o(p),o(d)))}function q(){r.setOption("date",G(o(s)))}function I(K){return"customButton"+K.charAt(0).toUpperCase()+K.slice(1)}var X=st(),te=Ke(X);Et(te,17,()=>t.buttons,Xt,(K,k)=>{var B=st(),W=Ke(B),ae=z=>{var A=Jd();Je(A,()=>ir(o(a))),ve(()=>ee(A,1,o(g).title)),j(z,A)},fe=z=>{var A=qa(),ge=an(A);ve(()=>{ee(A,1,`${o(g).button??""} ec-${o(k)??""}`),at(A,"aria-label",o(c).prev),at(A,"title",o(c).prev),A.disabled=o(b),ee(ge,1,`${o(g).icon??""} ec-${o(k)??""}`)}),Ge("click",A,x),j(z,A)},re=z=>{var A=qa(),ge=an(A);ve(()=>{ee(A,1,`${o(g).button??""} ec-${o(k)??""}`),at(A,"aria-label",o(c).next),at(A,"title",o(c).next),A.disabled=o(w),ee(ge,1,`${o(g).icon??""} ec-${o(k)??""}`)}),Ge("click",A,R),j(z,A)},M=z=>{var A=Ga(),ge=an(A,!0);ve(()=>{ee(A,1,`${o(g).button??""} ec-${o(k)??""}`),A.disabled=o(O),wi(ge,o(c)[o(k)])}),Ge("click",A,q),j(z,A)},Z=z=>{let A=f(()=>Vn(o(u)[o(k)]?.content,void 0,void 0,o(i)[I(o(k))]));var ge=Qd(),V=$e(ge);Ot(V,()=>o(A).snippet??Re),ie(ge),Je(ge,()=>ir(o(A).content,o(A).snippet)),ve(()=>ee(ge,1,`ec-${o(k)??""}`)),j(z,ge)},et=f(()=>o(i)[I(o(k))]||o(u)[o(k)]?.content!=null),H=z=>{var A=ef();Je(A,()=>ir(o(u)[o(k)].text)),ve(()=>ee(A,1,Kt([o(g).button,`ec-${o(k)}`,o(u)[o(k)].active&&o(g).active]))),Ge("click",A,function(...ge){o(u)[o(k)].click?.apply(this,ge)}),j(z,A)},Q=z=>{var A=Ga(),ge=an(A,!0);ve(()=>{ee(A,1,Kt([o(g).button,`ec-${o(k)}`,o(_)===o(k)&&o(g).active])),wi(ge,o(c)[o(k)])}),Ge("click",A,()=>r.setOption("view",o(k))),j(z,A)};jt(W,z=>{o(k)==="title"?z(ae):o(k)==="prev"?z(fe,1):o(k)==="next"?z(re,2):o(k)==="today"?z(M,3):o(et)?z(Z,4):o(u)[o(k)]?z(H,5):z(Q,-1)}),j(K,B)}),j(e,X),ft()}qt(["click"]);var tf=U("<div><!></div>"),rf=U("<div></div>"),nf=U("<nav></nav>");function of(e,t){dt(t,!0);let r=f(()=>je("state")),n=f(()=>o(r).options.headerToolbar),i=f(()=>o(r).options.theme),s=f(()=>{let l={};for(let c of["start","center","end"])l[c]=o(n)[c]?.split(" ").filter(Boolean).map(u=>u.split(",").filter(Boolean))??[];return l});var a=nf();Et(a,21,()=>qr(o(s)),Xt,(l,c)=>{var u=rf();Et(u,21,()=>o(s)[o(c)],Xt,(v,h)=>{var p=st(),d=Ke(p),g=_=>{var b=tf();Wa($e(b),{get buttons(){return o(h)}}),ie(b),ve(()=>ee(b,1,o(i).buttonGroup)),j(_,b)},$=_=>{Wa(_,{get buttons(){return o(h)}})};jt(d,_=>{o(h).length>1?_(g):_($,-1)}),j(v,p)}),ie(u),ve(()=>ee(u,1,`ec-${o(c)??""}`)),j(l,u)}),ie(a),ve(()=>ee(a,1,o(i).toolbar)),j(e,a),ft()}var sf=new Set(["$$slots","$$events","$$legacy","plugins","options"]),af=U("<div><!> <!> <!></div>");function lf(e,t){dt(t,!0);let r=Te(t,"plugins",19,()=>[]),n=Te(t,"options",19,()=>({})),i=So(t,sf),s=new Zd(r(),n());s.snippets=i,ii("state",s);let a=f(()=>s.auxComponents),l=f(()=>s.features),c=f(()=>s.events),u=f(()=>s.interaction),v=f(()=>s.iClass),h=f(()=>s.offset),p=f(()=>s.view),d=f(()=>s.viewComponent),g=f(()=>s.options.date),$=f(()=>s.options.dateIncrement),_=f(()=>s.options.duration),b=f(()=>s.options.height),w=f(()=>s.options.hiddenDays),O=f(()=>s.options.customScrollbars),E=f(()=>s.options.theme),S={...n()};tr(()=>{for(let[V,ue]of Id(n(),S))T(()=>{x(V,ue)});Le(S,n())});function x(V,ue){return s.setOption(V,ue,!1),this}function R(V){let ue=s.options[V];return Wo(ue)?Ce(ue):ue}function q(){return s.fetchedRange.resources={},this}function I(){return s.fetchedRange.events={},this}function X(){return o(c).map(It)}function te(V){V=String(V);for(let ue of o(c))if(ue.id===V)return It(ue);return null}function K(V){return V=Ri([V],o(h))[0],o(c).push(V),It(V)}function k(V){let ue=String(V.id),Zt=o(c).findIndex(Rr=>Rr.id===ue);return Zt>=0?(V=Ri([V],o(h))[0],o(c)[Zt]=V,It(V)):null}function B(V){V=String(V);let ue=o(c).findIndex(Zt=>Zt.id===V);return ue>=0&&o(c).splice(ue,1),this}function W(){return vr(o(p))}function ae(){return o(u).action?.unselect(),this}function fe(V,ue){let Zt=ll(V,ue);if(Zt){let Rr=sl(Zt)(V,ue);return Rr.date=Ce(Rr.date),Rr}return null}function re(V){return V=lt(Mt(V)),s.setOption("date",G(V)),s.scrollDate=V,this}function M(){return s.setOption("date",Qa(G(o(g)),o($)??o(_),o(w))),this}function Z(){return s.setOption("date",el(G(o(g)),o($)??o(_),o(w))),this}var et={setOption:x,getOption:R,refetchResources:q,refetchEvents:I,getEvents:X,getEventById:te,addEvent:K,updateEvent:k,removeEventById:B,getView:W,unselect:ae,dateFromPoint:fe,gotoDate:re,next:M,prev:Z},H=af();let Q;var z=$e(H);of(z,{});var A=wt(z,2);Fn(A,()=>o(d),(V,ue)=>{ue(V,{})});var ge=wt(A,2);return Et(ge,17,()=>o(a),Xt,(V,ue)=>{var Zt=st(),Rr=Ke(Zt);Fn(Rr,()=>o(ue),(Sl,Rl)=>{Rl(Sl,{})}),j(V,Zt)}),ie(H),ve(V=>{ee(H,1,Kt([o(E).calendar,o(E).view,o(v)&&o(E)[o(v)],o(O)&&o(E).customScrollbars])),at(H,"role",V),Q=Vr(H,"",Q,{height:o(b)})},[()=>o(l).includes("list")?"list":"table"]),j(e,H),ft(et)}function cf(e){"weekNumbers"in e||Le(e,{weekNumbers:!1,weekNumberContent:void 0})}function df(e){return()=>{let{viewDates:t,options:{duration:r,hiddenDays:n}}=e,i;return T(()=>i=r.months||r.inWeeks?7-n.length:t.length),i}}function ff(e,t){return()=>{let{options:{highlightedDates:r,validRange:n},viewDates:i}=e,{colsCount:s}=t,a=[];return T(()=>{let l=[],c=1,u=1;for(let v of i)l.push({gridColumn:c,gridRow:u,resource:void 0,dayStart:v,dayEnd:or(G(v)),disabled:Yn(v,n),highlight:r.some(h=>We(h,v))}),c===s&&(a.push(l),l=[],c=0,++u),++c}),a}}function uf(e,t){return()=>{let{filteredEvents:r}=e,{grid:n}=t,i=[],s=[];return T(()=>{for(let a of r)for(let l of n)_r(a.display)?a.allDay&&(s=s.concat(vn(a,l))):i=i.concat(vn(a,l));ul(i)}),{chunks:i,bgChunks:s}}}function pf(e,t){return()=>{let{iEvents:r}=e,{grid:n}=t,i=[];for(let[,s]of r)s&&T(()=>{for(let a of n)i=i.concat(vn(s,a,!1))});return i}}var hf=class{#e;get colsCount(){return o(this.#e)}set colsCount(e){y(this.#e,e)}#r;get grid(){return o(this.#r)}set grid(e){y(this.#r,e)}#t;get gridEl(){return o(this.#t)}set gridEl(e){y(this.#t,e,!0)}#n;get chunks(){return o(this.#n)}set chunks(e){y(this.#n,e)}#i;get bgChunks(){return o(this.#i)}set bgChunks(e){y(this.#i,e)}#o;get iChunks(){return o(this.#o)}set iChunks(e){y(this.#o,e)}#a;get intlDayCell(){return o(this.#a)}set intlDayCell(e){y(this.#a,e)}#s;get intlDayPopover(){return o(this.#s)}set intlDayPopover(e){y(this.#s,e)}#l;get popupDay(){return o(this.#l)}set popupDay(e){y(this.#l,e,!0)}constructor(e){this.#e=f(df(e)),this.#r=f(ff(e,this)),this.#t=F();let t=f(uf(e,this)),r=f(()=>o(t).chunks),n=f(()=>o(t).bgChunks);this.#n=f(()=>o(r)),this.#i=f(()=>o(n)),this.#o=f(pf(e,this)),this.hiddenChunks=new un,this.#a=f(gn(e,"dayCellFormat")),this.#s=f(gn(e,"dayPopoverFormat")),this.#l=F(null)}},vf=U("<div><!></div>");function gf(e,t){dt(t,!0);let r=Te(t,"el",15),n=Te(t,"allDay",3,!1),i=Te(t,"resource",3,void 0),s=Te(t,"dateFromPoint",3,()=>t.date),a=Te(t,"classes",3,Si),l=Te(t,"disabled",3,!1),c=Te(t,"highlight",3,!1),u=Te(t,"role",3,"cell"),v=Te(t,"noIeb",3,!1),h=Te(t,"noBeb",3,!1),p=Te(t,"defaultContent",3,void 0),d=f(()=>je("state")),g=f(()=>o(d).today),$=f(()=>o(d).snippets),_=f(()=>o(d).interaction.action),b=f(()=>o(d).options.dayCellContent),w=f(()=>o(d).options.theme),O=f(()=>je("view-state")),E=f(()=>o(O).snap),S=f(()=>We(t.date,o(g))),x=f(()=>Vn(o(b),()=>({allDay:n(),date:Ce(t.date),isToday:o(S),resource:i()}),p(),o($).dayCellContent)),R=f(()=>a()([o(w).day,o(w).weekdays?.[t.date.getUTCDay()],o(S)&&o(w).today,c()&&o(w).highlight,l()&&o(w).disabled,v()&&o(w).noIeb,h()&&o(w).noBeb]));ki(()=>{ol(r(),(k,B)=>({allDay:n(),date:s()(k,B),resource:i(),dayEl:r(),disabled:l()}))});let q=f(()=>!l()&&o(_)?k=>o(_).select(k,o(E)):void 0);var I=vf(),X=$e(I),te=k=>{var B=st(),W=Ke(B);Ot(W,()=>t.content,()=>o(x)),j(k,B)},K=k=>{var B=st(),W=Ke(B);Ot(W,()=>o(x).snippet??Re,()=>o(x).arg),j(k,B)};jt(X,k=>{t.content?k(te):k(K,-1)}),ie(I),Cr(I,k=>r(k),()=>r()),Je(I,()=>t.content?null:ir(o(x).content,o(x).snippet)),ve(()=>{ee(I,1,Kt(o(R))),at(I,"role",u())}),Ge("pointerdown",I,function(...k){o(q)?.apply(this,k)}),j(e,I),ft()}qt(["pointerdown"]);var _f=U("<div><!></div>"),mf=U("<article><!></article>");function $f(e,t){dt(t,!0);let r=Te(t,"el",15),n=Te(t,"classes",3,Si),i=Te(t,"styles",3,Si),s=f(()=>je("state")),a=f(()=>o(s).intlEventTime),l=f(()=>o(s).resources),c=f(()=>o(s).snippets),u=f(()=>o(s).view),v=f(()=>o(s).options.displayEventEnd),h=f(()=>o(s).options.eventBackgroundColor),p=f(()=>o(s).options.eventColor),d=f(()=>o(s).options.eventContent),g=f(()=>o(s).options.eventClick),$=f(()=>o(s).options.eventDidMount),_=f(()=>o(s).options.eventClassNames),b=f(()=>o(s).options.eventMouseEnter),w=f(()=>o(s).options.eventMouseLeave),O=f(()=>o(s).options.eventTextColor),E=f(()=>o(s).options.theme),S=f(()=>t.chunk.event),x=f(()=>t.chunk.event.display),R=f(()=>o(S).backgroundColor??hl(t.chunk.resource??Va(o(S),o(l)))??o(h)??o(p)),q=f(()=>o(S).textColor??vl(t.chunk.resource??Va(o(S),o(l)))??o(O)),I=f(()=>td(i()({"background-color":o(R),color:o(q)})).map(H=>`${H[0]}:${H[1]}`).concat(o(S).styles).join(";")),X=f(()=>{let H=[_r(o(x))?o(E).bgEvent:o(E).event];if(o(S).allDay){We(lt(G(t.chunk.start)),o(S).start)||H.push(o(E).startClipped);let Q=G(t.chunk.end),z=G(o(S).end);Q.setUTCSeconds(Q.getUTCSeconds()-1),z.setUTCSeconds(z.getUTCSeconds()-1),We(lt(Q),lt(z))||H.push(o(E).endClipped)}else We(t.chunk.start,o(S).start)||H.push(o(E).startClipped),We(t.chunk.end,o(S).end)||H.push(o(E).endClipped);return n()(H.concat($d(o(_),o(S),o(u))))}),te=f(()=>_d(t.chunk,o(v),o(a))),K=f(()=>Vn(o(d),()=>({event:It(o(S)),timeText:o(te),view:vr(o(u))}),()=>md(t.chunk,o(te),o(E)),o(c).eventContent));ki(()=>{De(o($))&&o($)({event:It(o(S)),timeText:o(te),el:r(),view:vr(o(u))})});function k(H,Q){return De(H)&&!cl(Q)?z=>H({event:It(o(S)),el:r(),jsEvent:z,view:vr(o(u))}):void 0}let B=f(()=>!_r(o(x))&&k(o(g),o(x))||void 0),W=f(()=>o(B)&&qo(o(B))),ae=f(()=>k(o(b),o(x))),fe=f(()=>k(o(w),o(x)));var re=mf();{let H=Q=>{var z=_f(),A=$e(z);Ot(A,()=>o(K).snippet??Re,()=>o(K).arg),ie(z),Je(z,()=>ir(o(K).content,o(K).snippet)),ve(()=>ee(z,1,Kt(o(E).eventBody))),j(Q,z)};var M=$e(re),Z=Q=>{var z=st(),A=Ke(z);Ot(A,()=>t.body,()=>H,()=>o(R),()=>o(q)),j(Q,z)},et=Q=>{H(Q)};jt(M,Q=>{t.body?Q(Z):Q(et,-1)}),ie(re),Cr(re,Q=>r(Q),()=>r())}ve(()=>{ee(re,1,Kt(o(X))),Vr(re,o(I)),at(re,"role",o(B)?"button":void 0),at(re,"tabindex",o(B)?0:void 0)}),Ge("click",re,function(...H){o(B)?.apply(this,H)}),Ge("keydown",re,function(...H){o(W)?.apply(this,H)}),dn("mouseenter",re,function(...H){o(ae)?.apply(this,H)}),dn("mouseleave",re,function(...H){o(fe)?.apply(this,H)}),Ge("pointerdown",re,function(...H){t.onpointerdown?.apply(this,H)}),j(e,re),ft()}qt(["click","keydown","pointerdown"]);var W1=U("<div><!></div>");var j1=U("<time></time>");function yf(e,t){dt(t,!0);let r=Te(t,"el",15),n=f(()=>je("state")),i=f(()=>o(n).iClasses),s=f(()=>o(n).interaction.action),a=f(()=>o(n).interaction.resizer),l=f(()=>je("view-state")),c=f(()=>o(l).snap),u=f(()=>t.chunk.event),v=f(()=>t.chunk.event.display),h=f(()=>g=>o(i)(g,o(u)));function p(g){return o(s)?.draggable(g)?$=>o(s).drag(g,$,t.forceDate,t.forceMargin,o(c)):o(s)?.noAction}let d=f(()=>!_r(o(v))&&!cl(o(v))?p(o(u)):void 0);$f(e,{get chunk(){return t.chunk},get classes(){return o(h)},get styles(){return t.styles},get onpointerdown(){return o(d)},get el(){return r()},set el($){r($)},body:($,_=Re)=>{var b=st(),w=Ke(b),O=S=>{var x=st(),R=Ke(x);Fn(R,()=>o(a),(q,I)=>{I(q,{get chunk(){return t.chunk},get axis(){return t.axis},get forceDate(){return t.forceDate},get forceMargin(){return t.forceMargin},children:(X,te)=>{var K=st(),k=Ke(K);Ot(k,_),j(X,K)},$$slots:{default:!0}})}),j(S,x)},E=S=>{var x=st(),R=Ke(x);Ot(R,_),j(S,x)};jt(w,S=>{o(a)?S(O):S(E,-1)}),j($,b)},$$slots:{body:!0}}),ft()}var bf=U("<span><!></span>"),wf=U('<a role="button" tabindex="0" aria-haspopup="dialog"><!></a>'),xf=U("<div><time><!></time> <!></div> <div><!></div>",1);function Ef(e,t){dt(t,!0);let r=je("state"),n=je("view-state");f(()=>r.features);let i=f(()=>r.snippets),s=f(()=>r.options.date),a=f(()=>r.options.firstDay),l=f(()=>r.options.moreLinkContent),c=f(()=>r.options.theme),u=f(()=>r.options.weekNumbers),v=f(()=>r.options.weekNumberContent),h=f(()=>n.hiddenChunks),p=f(()=>n.intlDayCell),d=f(()=>t.day.dayStart),g=f(()=>t.day.disabled),$=f(()=>t.day.highlight),_=f(()=>o(d).getUTCMonth()!==o(s).getUTCMonth()),b=f(()=>R=>[...R,o(_)&&o(c).otherMonth]),w=f(()=>o(u)&&o(d).getUTCDay()===(o(a)?1:0)),O=f(()=>o(w)?dd(tl(o(d),o(a)),o(d),o(v),o(i).weekNumberContent):{}),E=f(()=>o(h).get(gr(o(d)))),S=f(()=>{if(!o(E))return{};let R=o(E).length,q="+"+R+" more";return Vn(o(l),()=>({num:R,text:q}),q,o(i).moreLinkContent)});function x(){n.popupDay=t.day}gf(e,{get date(){return o(d)},allDay:!0,get classes(){return o(b)},get disabled(){return o(g)},get highlight(){return o($)},get noIeb(){return t.noIeb},get noBeb(){return t.noBeb},defaultContent:()=>o(p).format(o(d)),content:(q,I=Re)=>{var X=xf(),te=Ke(X),K=$e(te),k=$e(K);Ot(k,()=>I().snippet??Re,()=>I().arg),ie(K),Je(K,()=>ir(I().content,I().snippet));var B=wt(K,2),W=M=>{var Z=bf(),et=$e(Z);Ot(et,()=>o(O).snippet??Re,()=>o(O).arg),ie(Z),Je(Z,()=>ir(o(O).content,o(O).snippet)),ve(()=>ee(Z,1,o(c).weekNumber)),j(M,Z)};jt(B,M=>{o(w)&&M(W)}),ie(te);var ae=wt(te,2),fe=$e(ae),re=M=>{var Z=wf(),et=f(()=>zo(x)),H=f(()=>qo(x)),Q=f(zo),z=$e(Z);Ot(z,()=>o(S).snippet??Re,()=>o(S).arg),ie(Z),Je(Z,()=>ir(o(S).content,o(S).snippet)),Ge("click",Z,function(...A){o(et)?.apply(this,A)}),Ge("keydown",Z,function(...A){o(H)?.apply(this,A)}),Ge("pointerdown",Z,function(...A){o(Q)?.apply(this,A)}),j(M,Z)};jt(fe,M=>{o(E)&&M(re)}),ie(ae),ve(M=>{ee(te,1,o(c).dayHead),at(K,"datetime",M),ee(ae,1,o(c).dayFoot)},[()=>Sr(o(d),10)]),j(q,X)},$$slots:{content:!0}}),ft()}qt(["click","keydown","pointerdown"]);function Di(e,t){dt(t,!0);let r=Te(t,"inPopup",3,!1),n=f(()=>je("state")),i=f(()=>o(n).options.dayMaxEvents),s=f(()=>o(n).options.eventGap),a=f(()=>je("view-state")),l=f(()=>o(a).colsCount),c=f(()=>o(a).gridEl),u=f(()=>o(a).hiddenChunks),v=f(()=>o(a).popupDay),h=F(void 0),p=F(1),d=F(!1),g=f(()=>t.chunk.event),$=f(()=>t.chunk.event.display);function _(){return o(c).children.item((t.chunk.gridRow-1)*o(l)+t.chunk.gridColumn-1)}gt(()=>{!r()&&(dl(o($))||fl(o($)))&&y(p,Hn(_().firstElementChild)||1,!0)});let b=f(()=>x=>{if(x["grid-column"]=`${t.chunk.gridColumn} / span ${t.chunk.dates.length}`,x["grid-row"]=t.chunk.gridRow,!_r(o($))){let R=r()?1:o(p);if(o(g)._margin){let[q,I]=o(g)._margin;q>R&&t.chunk.gridRow===I&&(R=q)}x["margin-block-start"]=`${R}px`}return o(d)&&(x.visibility="hidden"),x});function w(){y(p,xd(t.chunk,Hn(o(h)),Hn(_().firstElementChild)||1,o(s)),!0)}function O(){if(o(i)===!0){let x=_(),R=Hn(x)-E(x);if(y(d,t.chunk.bottom>R),o(d))for(let q of t.chunk.dates){let I=gr(q);if(o(u).has(I)){let X=o(u).get(I);X.includes(t.chunk)||o(u).set(I,[...X,t.chunk])}else o(u).set(I,[t.chunk])}}else y(d,!1),o(u).size&&o(u).clear()}function E(x){let R=0;for(let q=0;q<t.chunk.dates.length&&(R=Dr(R,Hn(x.lastElementChild)),x=x.nextElementSibling,!!x);++q);return R}var S={reposition:w,hide:O};{let x=f(()=>r()&&o(v).dayStart),R=f(()=>[o(p),t.chunk.gridRow]);yf(e,{get chunk(){return t.chunk},get styles(){return o(b)},axis:"x",get forceDate(){return o(x)},get forceMargin(){return o(R)},get el(){return o(h)},set el(q){y(h,q,!0)}})}return ft(S)}var kf=U('<dialog closedby="closerequest"><header><time></time>  <a role="button" tabindex="0">&times;</a></header> <div></div></dialog>');function Tf(e,t){dt(t,!0);let r=je("view-state"),n=f(()=>je("state")),i=f(()=>o(n).interaction),s=f(()=>o(n).options.buttonText),a=f(()=>o(n).options.theme),l=f(()=>r.colsCount),c=f(()=>r.chunks),u=f(()=>r.gridEl),v=f(()=>r.intlDayPopover),h=f(()=>r.popupDay),p=F(void 0),d=F(""),g=f(()=>o(h).gridColumn),$=f(()=>o(h).gridRow),_=f(()=>o(h).dayStart),b=f(()=>o(h).dayEnd),w=f(()=>{let B=[];for(let W of o(c))W.gridRow===o($)&&W.gridColumn<=o(g)&&W.gridColumn+W.dates.length>o(g)&&B.push(Le({},W,Ni(W.event,o(_),o(b))));return B.sort((W,ae)=>W.top-ae.top),B});ki(()=>{o(p).show()}),gt(()=>{o(w).length?T(O):E()});function O(){let B=o(u).children.item((o($)-1)*o(l)+o(g)-1),W=Ci(o(p)),ae=Ci(B),fe=Ci(o(u));y(d,"");let re;if(W.width>=fe.width){re=fe.left-ae.left;let Z=ae.right-fe.right;y(d,o(d)+`inset-inline-end:${Z}px;`)}else re=(ae.width-W.width)/2,ae.left+re<fe.left?re=fe.left-ae.left:ae.left+re+W.width>fe.right&&(re=fe.right-ae.left-W.width);y(d,o(d)+`inset-inline-start:${re}px;`);let M;W.height>=fe.height?(M=fe.top-ae.top,y(d,o(d)+`block-size:${fe.height}px;`)):(M=(ae.height-W.height)/2,ae.top+M<fe.top?M=fe.top-ae.top:ae.top+M+W.height>fe.bottom&&(M=fe.bottom-ae.top-W.height)),y(d,o(d)+`inset-block-start:${M}px;`)}function E(){r.popupDay=null}function S(){E(),o(i).action?.noClick()}var x=kf();let R;var q=$e(x),I=$e(q);Je(I,()=>ir(o(v).format(o(_))));var X=wt(I,2);si(X,!0);var te=f(()=>zo(E)),K=f(()=>qo(E));ie(q);var k=wt(q,2);Et(k,21,()=>o(w),Xt,(B,W)=>{Di(B,{get chunk(){return o(W)},inPopup:!0})}),ie(k),ie(x),Cr(x,B=>y(p,B),()=>o(p)),Je(x,()=>Qc("pointerdown")),ve(B=>{ee(x,1,o(a).popup),R=Vr(x,o(d),R,{"grid-area":`${o($)+1} / ${o(g)}`}),ee(q,1,o(a).dayHead),at(I,"datetime",B),at(X,"aria-label",o(s).close),ee(k,1,o(a).events)},[()=>Sr(o(_),10)]),dn("pointerdownoutside",x,S),dn("close",x,E),Ge("click",X,function(...B){o(te)?.apply(this,B)}),Ge("keydown",X,function(...B){o(K)?.apply(this,B)}),j(e,x),ft()}qt(["click","keydown"]);var Cf=U('<div role="columnheader"><span></span></div>'),Df=U('<section><header><div role="row"></div></header> <div><div></div> <div><!> <!> <!></div></div> <!></section>');function Vo(e,t){dt(t,!0);let r=je("state"),n=new hf(r);ii("view-state",n);let i=f(()=>r.intlDayHeader),s=f(()=>r.intlDayHeaderAL),a=f(()=>r.options.dayMaxEvents),l=f(()=>r.options.eventGap),c=f(()=>r.options.theme),u=f(()=>n.grid),v=f(()=>n.chunks),h=f(()=>n.bgChunks),p=f(()=>n.iChunks),d=f(()=>n.hiddenChunks),g=f(()=>n.popupDay),$=[];function _(){bd($,o(v)),o(d).clear(),hr().then(b)}function b(){o(d).size,$.forEach(x=>x?.hide())}gt(()=>{o(l),o(v),hr().then(_)}),gt(b);var w=st(),O=Ke(w),E=x=>{var R=Df();let q;var I=$e(R),X=$e(I);Et(X,21,()=>o(u)[0],Xt,(M,Z,et)=>{let H=()=>o(Z).dayStart;var Q=Cf();at(Q,"aria-colindex",1+et);var z=$e(Q);Je(z,()=>ir(o(i).format(H()))),ie(Q),ve((A,ge)=>{ee(Q,1,A),at(z,"aria-label",ge)},[()=>Kt([o(c).colHead,o(c).weekdays?.[H().getUTCDay()]]),()=>o(s).format(H())]),j(M,Q)}),ie(X),ie(I);var te=wt(I,2),K=$e(te);Et(K,21,()=>o(u),Xt,(M,Z,et)=>{var H=st(),Q=Ke(H);Et(Q,17,()=>o(Z),Xt,(z,A,ge)=>{{let V=f(()=>ge+1===Yr(o(Z))),ue=f(()=>et+1===Yr(o(u)));Ef(z,{get day(){return o(A)},get noIeb(){return o(V)},get noBeb(){return o(ue)}})}}),j(M,H)}),ie(K),Cr(K,M=>n.gridEl=M,()=>n?.gridEl);var k=wt(K,2),B=$e(k);Et(B,19,()=>o(v),M=>M.id,(M,Z,et)=>{Cr(Di(M,{get chunk(){return o(Z)}}),(H,Q)=>$[Q]=H,H=>$?.[H],()=>[o(et)])});var W=wt(B,2);Et(W,17,()=>o(h),M=>M.id,(M,Z)=>{Di(M,{get chunk(){return o(Z)}})});var ae=wt(W,2);Et(ae,17,()=>o(p),Xt,(M,Z)=>{Di(M,{get chunk(){return o(Z)}})}),ie(k),ie(te);var fe=wt(te,2),re=M=>{Tf(M,{})};jt(fe,M=>{o(g)&&M(re)}),ie(R),Cr(R,M=>r.mainEl=M,()=>r?.mainEl),Je(R,()=>ed(_)),ve((M,Z)=>{ee(R,1,Kt([o(c).main,o(a)===!0&&o(c).uniform])),q=Vr(R,"",q,{"--ec-grid-cols":M,"--ec-grid-rows":Z}),ee(I,1,o(c).header),ee(X,1,o(c).grid),ee(te,1,o(c).body),ee(K,1,o(c).grid),ee(k,1,o(c).events)},[()=>Yr(o(u)[0]),()=>Yr(o(u))]),j(x,R)},S=f(()=>!hn(o(u))&&!hn(o(u)[0]));jt(O,x=>{o(S)&&x(E)}),j(e,w),ft()}var yl={createOptions(e){cf(e),Le(e,{dayMaxEvents:!1,dayCellFormat:{day:"numeric"},dayPopoverFormat:{month:"long",day:"numeric",year:"numeric"},moreLinkContent:void 0,view:"dayGridMonth"}),Le(e.buttonText,{dayGridDay:"day",dayGridMonth:"month",dayGridWeek:"week",close:"Close"}),Le(e.theme,{uniform:"ec-uniform",dayFoot:"ec-day-foot",otherMonth:"ec-other-month",popup:"ec-popup"}),Le(e.views,{dayGridDay:{buttonText:kd,component:()=>Vo,dayHeaderFormat:{weekday:"long"},displayEventEnd:!1,duration:{days:1},theme:Oo("ec-day-grid ec-day-view")},dayGridWeek:{buttonText:Td,component:()=>Vo,displayEventEnd:!1,theme:Oo("ec-day-grid ec-week-view")},dayGridMonth:{buttonText:Cd,component:Sf,dayHeaderFormat:{weekday:"short"},dayHeaderAriaLabelFormat:{weekday:"long"},displayEventEnd:!1,duration:{months:1},theme:Oo("ec-day-grid ec-month-view"),titleFormat:{year:"numeric",month:"long"}}})}};function Sf(e){return e.features=["dayNumber"],e.extensions.activeRange=(t,r)=>{let{options:{firstDay:n}}=e;return{start:Ja(t,n),end:ld(r,n)}},Vo}var X1=U("<div></div>"),K1=U("<!> <!> <!>",1);qt(["pointerdown"]);var Z1=U("<!> <!>",1);var J1=U("<div></div> <!>",1);var Q1=U("<h4><time><!></time> <time></time></h4> <!>",1);var eC=U("<div><!></div>"),tC=U("<section><!></section>");qt(["click"]);function Yo(e,t,r=!0){let n=[];for(let{gridColumn:i,gridRow:s,resource:a,start:l,end:c,disabled:u}of t)if(!u&&Bn(e,l,c,a)){let v=Ni(e,l,c);Le(v,{gridColumn:i,gridRow:s,resource:a,top:(v.start-l)/1e3,height:(v.end-v.start)/1e3,maxHeight:(c-v.start)/1e3}),r&&Zo(v),n.push(v)}return n}function Rf(e){let t={};for(let r of e){let{gridColumn:n}=r,i=t[n],s=0;if(i&&r.start<i.end){for(;s<i.columns.length&&!(i.columns[s].at(-1).end<=r.start);++s);r.end>i.end&&(i.end=r.end)}else i={columns:[],end:r.end};i.columns.length<s+1&&i.columns.push([]),i.columns[s].push(r),t[n]=i,r.group=i,r.groupColumn=s}}function Af(e,t){return()=>{let{viewDates:r,options:{highlightedDates:n,validRange:i}}=e,{slotTimeLimits:s}=t,a=[];return T(()=>{let l=1;for(let c of r)a.push({gridColumn:l,gridRow:1,resource:void 0,start:Qe(G(c),s.min),end:Qe(G(c),s.max),dayStart:c,dayEnd:or(G(c)),disabled:Yn(c,i),highlight:n.some(u=>We(u,c))}),++l}),[a]}}function Nf(e,t){return()=>{let{filteredEvents:r}=e,{grid:n}=t,i=[],s=[],a=[],l=[];return T(()=>{for(let c of r)for(let u of n)_r(c.display)?(s=s.concat(Yo(c,u)),c.allDay&&(l=l.concat(vn(c,u)))):c.allDay?a=a.concat(vn(c,u)):i=i.concat(Yo(c,u));Rf(i),ul(a)}),{chunks:i,bgChunks:s,allDayChunks:a,allDayBgChunks:l}}}function Of(e,t){return()=>{let{iEvents:r}=e,{grid:n}=t,i=[],s=[];for(let[,a]of r)a&&T(()=>{for(let l of n)a.allDay?s=s.concat(vn(a,l,!1)):i=i.concat(Yo(a,l,!1))});return{iChunks:i,allDayIChunks:s}}}function If(e){return()=>{let{filteredEvents:t,viewDates:r,options:{flexibleSlotTimeLimits:n,slotMinTime:i,slotMaxTime:s}}=e,a;return T(()=>{a=_l(i,s,n,r,t)}),a}}function Mf(e){return()=>{let{options:{slotDuration:t,slotLabelInterval:r}}=e,n;return T(()=>{n=r===void 0?Me(t)<3600?2:1:nd(Me(r)/Me(t))||1}),n}}function Lf(e,t){return()=>{let{offset:r,options:{slotDuration:n}}=e,{intlSlotLabel:i,slotLabelPeriodicity:s,slotTimeLimits:a}=t,l;return T(()=>{l=gl(lt(Mt(void 0,r)),n,s,a,i)}),l}}function Pf(e){return()=>{let{options:{slotDuration:t,snapDuration:r}}=e;return r??=t,{duration:r,ratio:Me(r)/Me(t)}}}function es(){return class{#e;get intlSlotLabel(){return o(this.#e)}set intlSlotLabel(e){y(this.#e,e)}#r;get slotLabelPeriodicity(){return o(this.#r)}set slotLabelPeriodicity(e){y(this.#r,e)}#t;get sidebarWidth(){return o(this.#t)}set sidebarWidth(e){y(this.#t,e,!0)}#n;get snap(){return o(this.#n)}set snap(e){y(this.#n,e)}constructor(e){this.#e=f(gn(e,"slotLabelFormat")),this.#r=f(Mf(e)),this.#t=F(0),this.#n=f(Pf(e))}}}function bl(e){return class extends e{#e;get slotTimeLimits(){return o(this.#e)}set slotTimeLimits(t){y(this.#e,t)}#r;get slots(){return o(this.#r)}set slots(t){y(this.#r,t)}#t;get chunks(){return o(this.#t)}set chunks(t){y(this.#t,t)}#n;get bgChunks(){return o(this.#n)}set bgChunks(t){y(this.#n,t)}#i;get allDayChunks(){return o(this.#i)}set allDayChunks(t){y(this.#i,t)}#o;get allDayBgChunks(){return o(this.#o)}set allDayBgChunks(t){y(this.#o,t)}#a;get iChunks(){return o(this.#a)}set iChunks(t){y(this.#a,t)}#s;get allDayIChunks(){return o(this.#s)}set allDayIChunks(t){y(this.#s,t)}constructor(t){super(t),this.#e=f(If(t)),this.#r=f(Lf(t,this));let r=f(Nf(t,this)),n=f(()=>o(r).chunks),i=f(()=>o(r).bgChunks),s=f(()=>o(r).allDayChunks),a=f(()=>o(r).allDayBgChunks);this.#t=f(()=>o(n)),this.#n=f(()=>o(i)),this.#i=f(()=>o(s)),this.#o=f(()=>o(a));let l=f(Of(t,this)),c=f(()=>o(l).iChunks),u=f(()=>o(l).allDayIChunks);this.#a=f(()=>o(c)),this.#s=f(()=>o(u))}}}var rC=class extends bl(es()){#e;get grid(){return o(this.#e)}set grid(e){y(this.#e,e)}constructor(e){super(e),this.#e=f(Af(e,this))}},Ff;function Hf(e){return()=>{let{activeRange:t,filteredEvents:r,resources:n,options:{filterResourcesWithEvents:i},extensions:{viewResources:s}}=e,a=s?s(n):n;return T(()=>{i&&(a=n.filter(l=>r.some(c=>!_r(c.display)&&Bn(c,t.start,t.end,l)))),a.length||(a=Ff??=Qo([{}]))}),a}}function zf(e,t){return()=>{let{viewDates:r,options:{datesAboveResources:n,highlightedDates:i,validRange:s}}=e,{slotTimeLimits:a,viewResources:l}=t,c=[];return T(()=>{let u=1,v=[l,r],h=[Ka,gr];n&&(v.reverse(),h.reverse());for(let p of v[0]){let d=[],g=h[0](p);for(let $ of v[1]){let _=n?p:$,b=n?$:p;d.push({gridColumn:u,gridRow:1,resource:b,key:h[1]($),groupKey:g,start:Qe(G(_),a.min),end:Qe(G(_),a.max),dayStart:_,dayEnd:or(G(_)),disabled:Yn(_,s),highlight:i.some(w=>We(w,_))}),++u}c.push(d)}}),c}}function wl(e){return class extends e{#e;get viewResources(){return o(this.#e)}set viewResources(t){y(this.#e,t)}constructor(t){super(t),this.#e=f(Hf(t))}}}var nC=class extends wl(bl(es())){#e;get grid(){return o(this.#e)}set grid(e){y(this.#e,e)}constructor(e){super(e),this.#e=f(zf(e,this))}},iC=U("<span><!></span>");var oC=U("<div></div>");var sC=U('<div><aside><!></aside> <div role="row"></div> <div><!> <!> <!></div></div>'),aC=U("<div><time></time></div>"),lC=U('<section><header><aside></aside> <div role="row"><!></div> <!></header> <div role="rowgroup"><aside aria-hidden="true"></aside> <div role="row"></div> <div><!> <!> <!></div></div> <!></section>');var cC=U("<!> <!>",1);function Uf(e,t){let r=0,n=t.length;for(;r<n;){let i=r+n>>1;t[i].dayEnd>e.start?n=i:r=i+1}for(;r>0&&t[r-1].end>e.start;)--r;return r}function xl(e,t,r,n=!0){let i=[],s,a,l,c,u,v,h=0;for(let p=Uf(e,t);p<t.length;++p){let{gridColumn:d,gridRow:g,resource:$,dayStart:_,dayEnd:b,start:w,end:O,disabled:E}=t[p];if(_>=e.end)break;E||(r?Bn(e,_,b,$)&&(i.length||(s=_,l=d,c=g,u=$),i.push(_),a=b):Bn(e,w,O,$)&&(i.length||(s=w,l=d,c=g,u=$,v=Dr(e.start-w,0)/1e3),i.push(_),a=O,h+=(zn(O,e.end)-Dr(w,e.start))/1e3))}if(i.length){let p=Ni(e,s,a);return Le(p,{gridColumn:l,gridRow:c,resource:u,dates:i,left:v,width:h}),n&&Zo(p),p}return null}function El(e,t){let r=t[0]?.resource;return!r||e.resourceIds.includes(r.id)}function Bf(e,t){let r=[],n={};for(let a of e){let{gridColumn:l,gridRow:c,dates:u,start:v,end:h,event:{layoutGroup:p}}=a;a.span=t?[l,l+u.length]:[+v,+h];let d;if(p!==void 0){let g=`${c}_${p}`;d=n[g],d||(d=ja(a,r),n[g]=d)}else d=ja(a,r);a.rivals=d.chunks.filter(g=>Mo(g.span,a.span)),d.chunks.push(a),Vf(d.span,a.span),d.startColumn=zn(d.startColumn,l),d.endColumn=Dr(d.endColumn,l+u.length)}let i=[],s=(a,l)=>(i[a]??=[])[l]??={spanning:[],starting:[]};for(let a of r){let{gridRow:l,startColumn:c,endColumn:u,span:v}=a,h=[],p=s(l,c);for(let d of p.spanning)Mo(d.span,v)&&h.push(d);for(let d=c+1;d<u;++d)for(let g of s(l,d).starting)Mo(g.span,v)&&h.push(g);a.rivals=h,p.starting.push(a);for(let d=c;d<u;++d)s(l,d).spanning.push(a)}return r}function ja(e,t){let{gridColumn:r,gridRow:n,span:i}=e,s={gridRow:n,chunks:[],span:[...i],startColumn:r,endColumn:r};return t.push(s),s}function Mo([e,t],[r,n]){return e<n&&t>r}function Vf(e,t){e[0]=zn(e[0],t[0]),e[1]=Dr(e[1],t[1])}function Yf(e,t){return()=>{let{viewDates:r,options:{highlightedDates:n,validRange:i}}=e,{dayTimeLimits:s,viewResources:a}=t,l=[];return T(()=>{let c=1;for(let u of a){let v=[],h=1;for(let p of r){let d=s[gr(p)];v.push({gridColumn:h,gridRow:c,resource:u,start:Qe(G(p),d.min),end:Qe(G(p),d.max),dayStart:p,dayEnd:or(G(p)),disabled:Yn(p,i),highlight:n.some(g=>We(g,p))}),++h}l.push(v),++c}}),l}}function qf(e){return e.months===1&&!e.years&&!e.days&&!e.seconds}function Gf(e){return e.inWeeks&&e.days===7&&!e.years&&!e.months&&!e.seconds}function Wf(e,t){return()=>{let{features:r,options:{duration:n,firstDay:i,weekNumbers:s}}=e,{grid:a}=t,l=[],c=[];return T(()=>{let u,v;if(!hn(a)){for(let{dayStart:h,gridColumn:p}of a[0])if(r.includes("month")&&(u&&u.date.getUTCMonth()===h.getUTCMonth()?++u.span:(u={date:h,gridColumn:p,span:1},l.push(u))),s){let d=tl(h,i);v&&v.number===d?++v.span:(v={number:d,date:h,gridColumn:p,span:1},c.push(v))}}Yr(l)===1&&qf(n)&&(l=[]),Yr(c)===1&&Gf(n)&&(c=[])}),{months:l,weeks:c}}}function jf(e,t){return()=>{let{filteredEvents:r}=e,{grid:n,monthView:i}=t,s=[],a=[],l;return T(()=>{for(let c of r){let u=_r(c.display);if(u&&i&&!c.allDay)continue;let v=u?a:s;for(let h of n){if(!El(c,h))continue;let p=xl(c,h,i);p&&v.push(p)}}l=Bf(s,i)}),{chunks:s,bgChunks:a,units:l}}}function Xf(e,t){return()=>{let{iEvents:r}=e,{grid:n,monthView:i}=t,s=[];for(let[,a]of r)a&&T(()=>{for(let l of n){if(!El(a,l))continue;let c=xl(a,l,i,!1);c&&s.push(c)}});return s}}function Kf(e){return()=>{let{filteredEvents:t,viewDates:r,options:{flexibleSlotTimeLimits:n,slotMinTime:i,slotMaxTime:s}}=e,a={};return T(()=>{for(let l of r)a[gr(l)]=_l(i,s,n,[l],t)}),a}}function Zf(e,t){return()=>{let{viewDates:r,options:{slotDuration:n}}=e,{dayTimeLimits:i,intlSlotLabel:s,slotLabelPeriodicity:a}=t,l={};return T(()=>{for(let c of r){let u=gr(c);l[u]=u in i?gl(c,n,a,i[u],s):[]}}),l}}function Jf(e){return()=>{let{resources:t}=e,r;return T(()=>{r=t.some(n=>sl(n).children.length)}),r}}function Qf(e){return()=>{let{options:{slotDuration:t}}=e,r;return T(()=>{r=!Me(t)}),r}}var dC=class extends wl(es()){#e;get dayTimeLimits(){return o(this.#e)}set dayTimeLimits(e){y(this.#e,e)}#r;get daySlots(){return o(this.#r)}set daySlots(e){y(this.#r,e)}#t;get grid(){return o(this.#t)}set grid(e){y(this.#t,e)}#n;get extraHeads(){return o(this.#n)}set extraHeads(e){y(this.#n,e)}#i;get intlMonthHeader(){return o(this.#i)}set intlMonthHeader(e){y(this.#i,e)}#o;get monthView(){return o(this.#o)}set monthView(e){y(this.#o,e)}#a;get chunks(){return o(this.#a)}set chunks(e){y(this.#a,e)}#s;get bgChunks(){return o(this.#s)}set bgChunks(e){y(this.#s,e)}#l;get units(){return o(this.#l)}set units(e){y(this.#l,e)}#d;get iChunks(){return o(this.#d)}set iChunks(e){y(this.#d,e)}#c;get nestedResources(){return o(this.#c)}set nestedResources(e){y(this.#c,e)}constructor(e){super(e),this.#e=f(Kf(e)),this.#r=f(Zf(e,this)),this.#t=f(Yf(e,this)),this.#n=f(Wf(e,this)),this.#i=f(gn(e,"monthHeaderFormat")),this.#o=f(Qf(e));let t=f(jf(e,this)),r=f(()=>o(t).chunks),n=f(()=>o(t).bgChunks),i=f(()=>o(t).units);this.#a=f(()=>o(r)),this.#s=f(()=>o(n)),this.#l=f(()=>o(i)),this.#d=f(Xf(e,this)),this.#c=f(Jf(e))}};var fC=U("<span></span>"),uC=U("<button></button>"),pC=U("<!> <span><!></span>",1);qt(["click"]);var hC=U("<div></div>");var vC=U("<time></time>"),gC=U("<span><!></span>"),_C=U("<div><time></time></div>"),mC=U('<div role="rowheader"><!> <!></div>'),$C=U('<section><header><aside></aside> <div role="row"><!> <!> <!> <!></div></header> <div role="rowgroup"><aside></aside> <div role="row"></div> <div><!> <!> <!></div></div> <!></section>');function kl(e,t,r){return fn(lf,{target:e,props:{plugins:t,options:r}})}function Tl(e){return Mn(e)}var Cl=`/*!
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
/*$vite$:1*/`;var OC=Cl;function Dl(e,t){if(e)return t==="UTC"&&!qn(e)?`${e}Z`:e}function tu(e){return e.flatMap(t=>{let r=Dl(t.startDate,t.timezone);if(!r)return[];let n=qn(t.startDate),i=(n&&t.endDate?Oi(t.endDate,1):Dl(t.endDate,t.timezone))??r;return[{title:t.name,start:r,end:i,allDay:n,extendedProps:{previewEvent:t}}]})}function ru(e){let t=e==="es"?"es-ES":"en-US";return{locale:t,firstDay:e==="es"?1:0,buttonText:e==="es"?{prev:"Mes anterior",next:"Mes siguiente"}:{prev:"Previous month",next:"Next month"},titleFormat:r=>nu(new Intl.DateTimeFormat(t,{month:"long",year:"numeric"}).format(r)),dayHeaderFormat:{weekday:"short"},dayHeaderAriaLabelFormat:{weekday:"long"},eventTimeFormat:{hour:"numeric",minute:"2-digit"}}}function nu(e){return e.charAt(0).toLocaleUpperCase()+e.slice(1)}function IC(e,t,r){let n=kl(e,[yl],{...ru(r.lang),view:"dayGridMonth",events:tu(t),height:"auto",headerToolbar:{start:"title",center:"",end:"prev,next"},eventClick(i){let s=i.event.extendedProps.previewEvent;s&&r.onEventClick(s)}});return{destroy(){Tl(n)}}}export{OC as CALENDAR_CSS,ru as calendarLocaleOptions,IC as renderCalendar};
/*! Bundled license information:

@event-calendar/core/dist/index.js:
  (*!
   * EventCalendar v5.18.1
   * https://github.com/vkurko/calendar
   *)
*/
//# sourceMappingURL=calendar-layout.js.map
