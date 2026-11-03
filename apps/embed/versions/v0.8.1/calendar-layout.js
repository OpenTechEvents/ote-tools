function zn(e){return e!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function Ri(e,t){let r=new Date(`${e}T00:00:00Z`);return r.setUTCDate(r.getUTCDate()+t),r.toISOString().slice(0,10)}var Wo=globalThis.process?.env?.NODE_ENV,m=Wo&&!Wo.toLowerCase().startsWith("prod");var tr=Array.isArray,Go=Array.prototype.indexOf,vr=Array.prototype.includes,Ur=Array.from,Ni=Object.keys,Pe=Object.defineProperty,lt=Object.getOwnPropertyDescriptor,Ii=Object.getOwnPropertyDescriptors,Oi=Object.prototype,jo=Array.prototype,Br=Object.getPrototypeOf,Mi=Object.isExtensible;var Oe=()=>{};function Un(e){for(var t=0;t<e.length;t++)e[t]()}function Bn(){var e,t,r=new Promise((n,i)=>{e=n,t=i});return{promise:r,resolve:e,reject:t}}var Fe=Symbol("$state"),vn=Symbol("legacy props"),Ko=Symbol(""),Vn=Symbol("proxy path"),Yn=Symbol("attributes"),gn=Symbol("class"),_n=Symbol("style"),mn=Symbol("text");var Li=Symbol("hmr anchor"),rr=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},Pi=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml");var Vr=3,wt=8;function Xo(e){if(m){let t=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${e}"
https://svelte.dev/e/invariant_violation`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invariant_violation")}function $n(e){if(m){let t=new Error(`lifecycle_outside_component
\`${e}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function Jo(){if(m){let e=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/async_derived_orphan")}function Qo(){if(m){let e=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/derived_references_self")}function Fi(e,t,r){if(m){let n=new Error(`each_key_duplicate
${r?`Keyed each block has duplicate key \`${r}\` at indexes ${e} and ${t}`:`Keyed each block has duplicate key at indexes ${e} and ${t}`}
https://svelte.dev/e/each_key_duplicate`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function es(e,t,r){if(m){let n=new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${e} was \`${t}\` but is now \`${r}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_volatile")}function ts(e){if(m){let t=new Error(`effect_in_teardown
\`${e}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function rs(){if(m){let e=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function ns(e){if(m){let t=new Error(`effect_orphan
\`${e}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_orphan")}function is(){if(m){let e=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function os(){if(m){let e=new Error("get_abort_signal_outside_reaction\n`getAbortSignal()` can only be called inside an effect or derived\nhttps://svelte.dev/e/get_abort_signal_outside_reaction");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/get_abort_signal_outside_reaction")}function ss(){if(m){let e=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/hydration_failed")}function as(){if(m){let e=new Error("invalid_snippet\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\nhttps://svelte.dev/e/invalid_snippet");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invalid_snippet")}function ls(e){if(m){let t=new Error(`props_invalid_value
Cannot do \`bind:${e}={undefined}\` when \`${e}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_invalid_value")}function cs(e){if(m){let t=new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${e}\` are readonly
https://svelte.dev/e/props_rest_readonly`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function ds(e){if(m){let t=new Error(`rune_outside_svelte
The \`${e}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function fs(){if(m){let e=new Error("set_context_after_init\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\nhttps://svelte.dev/e/set_context_after_init");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/set_context_after_init")}function us(){if(m){let e=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function ps(){if(m){let e=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function hs(){if(m){let e=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function vs(){if(m){let e=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var nr={};var ae=Symbol("uninitialized"),xt=Symbol("filename");var qn="http://www.w3.org/1999/xhtml";var ir="font-weight: bold",or="font-weight: normal";function gs(e){m?console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${e}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,ir,or):console.warn("https://svelte.dev/e/await_reactivity_loss")}function _s(e,t){m?console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${e}\` (${t}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,ir,or):console.warn("https://svelte.dev/e/await_waterfall")}function ms(){m?console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,ir,or):console.warn("https://svelte.dev/e/derived_inert")}function $s(e,t,r){m?console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${e}\` attribute on \`${t}\` changed its value between server and client renders. The client value, \`${r}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,ir,or):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function Tr(e){m?console.warn(`%c[svelte] hydration_mismatch
%c${e?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${e}`:"Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,ir,or):console.warn("https://svelte.dev/e/hydration_mismatch")}function bs(){m?console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,ir,or):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function Wn(e){m?console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${e}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,ir,or):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function ys(){m?console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`,ir,or):console.warn("https://svelte.dev/e/state_proxy_unmount")}function ws(){m?console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",ir,or):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var C=!1;function ge(e){C=e}var F;function te(e){if(e===null)throw Tr(),nr;return F=e}function Ue(){return te(Be(F))}function re(e){if(C){if(Be(F)!==null)throw Tr(),nr;F=e}}function Hi(e=1){if(C){for(var t=e,r=F;t--;)r=Be(r);F=r}}function Rt(e=!0){for(var t=0,r=F;;){if(r.nodeType===wt){var n=r.data;if(n==="]"){if(t===0)return r;t-=1}else(n==="["||n==="[!"||n[0]==="["&&!isNaN(Number(n.slice(1))))&&(t+=1)}var i=Be(r);e&&r.remove(),r=i}}function Gr(e){if(!e||e.nodeType!==wt)throw Tr(),nr;return e.data}function Gn(e){return e===this.v}function zi(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function jn(e){return!zi(e,this.v)}var $e=!1,sr=!1,Nt=!1;var bn=null;function oe(e,t){return e.label=t,Xn(e.v,t),e}function Xn(e,t){return e?.[Vn]?.(t),e}function jr(e){return typeof e=="symbol"?`Symbol(${e.description})`:typeof e=="function"?"<function>":typeof e=="object"&&e?"<object>":String(e)}function It(e){let t=new Error,r=_l();return r.length===0?null:(r.unshift(`
`),Pe(t,"stack",{value:r.join(`
`)}),Pe(t,"name",{value:e}),t)}function _l(){let e=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let t=new Error().stack;if(Error.stackTraceLimit=e,!t)return[];let r=t.split(`
`),n=[];for(let i=0;i<r.length;i++){let s=r[i],a=s.replaceAll("\\","/");if(s.trim()!=="Error"){if(s.includes("validate_each_keys"))return[];a.includes("svelte/src/internal")||a.includes("node_modules/.vite")||n.push(s)}}return n}function Es(e,t){if(!m)throw new Error("invariant(...) was not guarded by if (DEV)");e||Xo(t)}var V=null;function ar(e){V=e}var Ot=null;function Kr(e){Ot=e}var Mt=null;function Zn(e){Mt=e}function We(e){return ks("getContext").get(e)}function Jn(e,t){let r=ks("setContext");if($e){var n=k.f,i=!A&&(n&32)!==0&&!V.i;i||fs()}return r.set(e,t),t}function ct(e,t=!1,r){V={p:V,i:!1,c:null,e:null,s:e,x:null,r:k,l:sr&&!t?{s:null,u:null,$:[]}:null},m&&(V.function=r,Mt=r)}function dt(e){var t=V,r=t.e;if(r!==null){t.e=null;for(var n of r)Ui(n)}return e!==void 0&&(t.x=e),t.i=!0,V=t.p,m&&(Mt=V?.function??null),e??{}}function Kt(){return!sr||V!==null&&V.l===null}function ks(e){return V===null&&$n(e),V.c??=new Map(ml(V)||void 0)}function ml(e){let t=e.p;for(;t!==null;){let r=t.c;if(r!==null)return r;t=t.p}return null}var Cr=[];function Ts(){var e=Cr;Cr=[],Un(e)}function _e(e){if(Cr.length===0&&!Dr){var t=Cr;queueMicrotask(()=>{t===Cr&&Ts()})}Cr.push(e)}function Cs(){for(;Cr.length>0;)Ts()}var Bi=new WeakMap;function Qn(e){var t=k;if(t===null)return A.f|=8388608,e;if(m&&e instanceof Error&&!Bi.has(e)&&Bi.set(e,$l(e,t)),(t.f&32768)===0&&(t.f&4)===0)throw m&&!t.parent&&e instanceof Error&&Ds(e),e;Pt(e,t)}function Pt(e,t){if(!(t!==null&&(t.f&16384)!==0)){for(;t!==null;){if((t.f&128)!==0){if((t.f&32768)===0)throw e;try{t.b.error(e);return}catch(r){e=r}}t=t.parent}throw m&&e instanceof Error&&Ds(e),e}}function $l(e,t){let r=lt(e,"message");if(!(r&&!r.configurable)){for(var n=wn?"  ":"	",i=`
${n}in ${t.fn?.name||"<unknown>"}`,s=t.ctx;s!==null;)i+=`
${n}in ${s.function?.[xt].split("/").pop()}`,s=s.p;return{message:e.message+`
${i}
`,stack:e.stack?.split(`
`).filter(a=>!a.includes("svelte/src/internal")).join(`
`)}}}function Ds(e){let t=Bi.get(e);t&&(Pe(e,"message",{value:t.message}),Pe(e,"stack",{value:t.stack}))}var bl=-7169;function ne(e,t){e.f=e.f&bl|t}function Xr(e){(e.f&512)!==0||e.deps===null?ne(e,1024):ne(e,4096)}function Ss(e){if(e!==null)for(let t of e)(t.f&2)===0||(t.f&65536)===0||(t.f^=65536,Ss(t.deps))}function ei(e,t,r){(e.f&2048)!==0?t.add(e):(e.f&4096)!==0&&r.add(e),Ss(e.deps),ne(e,1024)}var As=!1,ti=!1;function Vi(e){var t=ti;try{return ti=!1,[e(),ti]}finally{ti=t}}function ri(e,t){if(t){let r=document.body;e.autofocus=!0,_e(()=>{document.activeElement===r&&e.focus()})}}function Ft(e){var t=A,r=k;be(null),De(null);try{return e()}finally{be(t),De(r)}}function ni(e){let t=0,r=Se(0),n;return m&&oe(r,"createSubscriber version"),()=>{gr()&&(o(r),Xe(()=>(t===0&&(n=T(()=>e(()=>ye(r)))),t+=1,()=>{_e(()=>{t-=1,t===0&&(n?.(),n=void 0,ye(r))})})))}}var xl=589824;function qi(e,t,r,n){new Yi(e,t,r,n)}var Yi=class{parent;is_pending=!1;transform_error;#e;#r=C?F:null;#t;#n;#i;#s=null;#o=null;#l=null;#a=null;#u=0;#d=0;#f=!1;#p=new Set;#g=new Set;#c=null;#$=ni(()=>(this.#c=Se(this.#u),m&&oe(this.#c,"$effect.pending()"),()=>{this.#c=null}));constructor(t,r,n,i){this.#e=t,this.#t=r,this.#n=s=>{var a=k;a.b=this,a.f|=128,n(s)},this.parent=k.b,this.transform_error=i??this.parent?.transform_error??(s=>s),this.#i=tt(()=>{if(C){let s=this.#r;Ue();let a=s.data==="[!";if(s.data.startsWith("[?")){let c=JSON.parse(s.data.slice("[?".length));this.#b(c)}else a?this.#w():this.#_()}else this.#h()},xl),C&&(this.#e=F)}#_(){try{this.#s=we(()=>this.#n(this.#e))}catch(t){this.error(t)}}#b(t){let r=this.#t.failed,{reset:n,invoke_onerror:i}=this.#y(t);_e(i),r&&(this.#l=we(()=>{r(this.#e,()=>t,()=>n)}))}#y(t){var r=!1,n=!1;let i=()=>{if(r){ws();return}r=!0,n&&vs(),this.#l!==null&&Xt(this.#l,()=>{this.#l=null}),this.#v(()=>{this.#h()})};return{reset:i,invoke_onerror:()=>{try{n=!0,this.#t.onerror?.(t,i),n=!1}catch(a){Pt(a,this.#i&&this.#i.parent)}}}}#w(){let t=this.#t.pending;t&&(this.is_pending=!0,this.#o=we(()=>t(this.#e)),_e(()=>{var r=this.#a=document.createDocumentFragment(),n=Ae();r.append(n),this.#s=this.#v(()=>we(()=>this.#n(n))),this.#d===0&&(this.#e.before(r),this.#a=null,Xt(this.#o,()=>{this.#o=null}),this.#m(L))}))}#h(){try{if(this.is_pending=this.has_pending_snippet(),this.#d=0,this.#u=0,this.#s=we(()=>{this.#n(this.#e)}),this.#d>0){var t=this.#a=document.createDocumentFragment();Zr(this.#s,t);let r=this.#t.pending;this.#o=we(()=>r(this.#e))}else this.#m(L)}catch(r){this.error(r)}}#m(t){this.is_pending=!1,t.transfer_effects(this.#p,this.#g)}defer_effect(t){ei(t,this.#p,this.#g)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#t.pending}#v(t){var r=k,n=A,i=V;De(this.#i),be(this.#i),ar(this.#i.ctx);try{return vt.ensure(),t()}catch(s){return Qn(s),null}finally{De(r),be(n),ar(i)}}#x(t,r){if(!this.has_pending_snippet()){this.parent&&this.parent.#x(t,r);return}this.#d+=t,this.#d===0&&(this.#m(r),this.#o&&Xt(this.#o,()=>{this.#o=null}),this.#a&&(this.#e.before(this.#a),this.#a=null))}update_pending_count(t,r){this.#x(t,r),this.#u+=t,!(!this.#c||this.#f)&&(this.#f=!0,_e(()=>{this.#f=!1,this.#c&&Ht(this.#c,this.#u)}))}get_effect_pending(){return this.#$(),o(this.#c)}error(t){if(!this.#t.onerror&&!this.#t.failed)throw t;L?.is_fork?(this.#s&&L.skip_effect(this.#s),this.#o&&L.skip_effect(this.#o),this.#l&&L.skip_effect(this.#l),L.oncommit(()=>{this.#E(t)})):this.#E(t)}#E(t){this.#s&&(pe(this.#s),this.#s=null),this.#o&&(pe(this.#o),this.#o=null),this.#l&&(pe(this.#l),this.#l=null),C&&(te(this.#r),Hi(),te(Rt()));let r=this.#t.failed,n=i=>{let{reset:s,invoke_onerror:a}=this.#y(i);a(),r&&(this.#l=this.#v(()=>{try{return we(()=>{var l=k;l.b=this,l.f|=128,r(this.#e,()=>i,()=>s)})}catch(l){return Pt(l,this.#i.parent),null}}))};_e(()=>{var i;try{i=this.transform_error(t)}catch(s){Pt(s,this.#i&&this.#i.parent);return}i!==null&&typeof i=="object"&&typeof i.then=="function"?i.then(n,s=>Pt(s,this.#i&&this.#i.parent)):n(i)})}};function ii(e,t,r,n){let i=Kt()?mr:Rr;var s=e.filter(u=>!u.settled),a=t.map(i);if(m&&a.forEach((u,g)=>{u.label=t[g].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\$\.get\((.+?)\)/g,($,_)=>_)}),r.length===0&&s.length===0){n(a);return}var l=k,c=Is(),d=s.length===1?s[0].promise:s.length>1?Promise.all(s.map(u=>u.promise)):null;function v(u){if((l.f&16384)===0){c();try{n([...a,...u])}catch(g){Pt(g,l)}Jr()}}var h=Wi();if(r.length===0){d.then(()=>v([])).finally(h);return}function f(){Promise.all(r.map(u=>ji(u))).then(v).catch(u=>Pt(u,l)).finally(h)}d?d.then(()=>{c(),f(),Jr()}):f()}function Is(){var e=k,t=A,r=V,n=L;if(m)var i=Ot;return function(a=!0){De(e),be(t),ar(r),a&&(e.f&16384)===0&&(n?.activate(),n?.apply()),m&&(Gi(null),Kr(i))}}function Jr(e=!0){De(null),be(null),ar(null),e&&L?.deactivate(),m&&(Gi(null),Kr(null))}function Wi(){var e=k,t=e.b,r=L,n=!!t?.is_rendered();return t?.update_pending_count(1,r),r.increment(n,e),()=>{t?.update_pending_count(-1,r),r.decrement(n,e)}}var pt=null;function Gi(e){pt=e}var En=new Set;function mr(e){var t=2050;k!==null&&(k.f|=524288);let r={ctx:V,deps:null,effects:null,equals:Gn,f:t,fn:e,reactions:null,rv:0,v:ae,wv:0,parent:k,ac:null};return m&&Nt&&(r.created=It("created at")),r}var Qr=Symbol("obsolete");function ji(e,t,r){let n=k;n===null&&Jo();var i=void 0,s=Se(ae);m&&(s.label=t??e.toString());var a=!A,l=new Set;return Ls(()=>{var c=k;m&&(pt={effect:c,effect_deps:new Set,warned:!1});var d=Bn();i=d.promise;try{Promise.resolve(e()).then(d.resolve,u=>{u!==rr&&d.reject(u)}).finally(Jr)}catch(u){d.reject(u),Jr()}if(m){if(pt){if(c.deps!==null)for(let u=0;u<rt;u+=1)pt.effect_deps.add(c.deps[u]);if(Me!==null)for(let u=0;u<Me.length;u+=1)pt.effect_deps.add(Me[u])}pt=null}var v=L;if(a){if((c.f&32768)!==0)var h=Wi();if(n.b?.is_rendered())v.async_deriveds.get(c)?.reject(Qr);else for(let u of l.values())u.reject(Qr);l.add(d),v.async_deriveds.set(c,d)}let f=(u,g=void 0)=>{m&&(pt=null),h?.(),l.delete(d),g!==Qr&&(v.activate(),g?(s.f|=8388608,Ht(s,g)):((s.f&8388608)!==0&&(s.f^=8388608),m&&r!==void 0&&!s.equals(u)&&(En.add(s),setTimeout(()=>{En.has(s)&&(c.f&16384)===0&&(_s(s.label,r),En.delete(s))})),Ht(s,u)),v.deactivate())};d.promise.then(f,u=>f(null,u||"unknown"))}),Ve(()=>{for(let c of l)c.reject(Qr)}),m&&(s.f|=4194304),new Promise(c=>{function d(v){function h(){v===i?c(s):d(i)}v.then(h,h)}d(i)})}function p(e){let t=mr(e);return $e||ai(t),t}function Rr(e){let t=mr(e);return t.equals=jn,t}function Os(e){var t=e.effects;if(t!==null){e.effects=null;for(var r=0;r<t.length;r+=1)pe(t[r])}}var Ki=[];function kn(e){var t,r=k,n=e.parent;if(!gt&&n!==null&&e.v!==ae&&(n.f&24576)!==0)return ms(),e.v;if(De(n),m){let i=Nr;oi(new Set);try{vr.call(Ki,e)&&Qo(),Ki.push(e),e.f&=-65537,Os(e),t=si(e)}finally{De(r),oi(i),Ki.pop()}}else try{e.f&=-65537,Os(e),t=si(e)}finally{De(r)}return t}function Xi(e){var t=kn(e);if(!e.equals(t)&&(e.wv=en(),(!L?.is_fork||e.deps===null)&&(L!==null?(L.capture(e,t,!0),$r?.capture(e,t,!0)):e.v=t,e.deps===null))){ne(e,1024);return}gt||(Le!==null?(gr()||L?.is_fork)&&Le.set(e,t):Xr(e))}function Ms(e){if(e.effects!==null)for(let t of e.effects)(t.teardown||t.ac)&&(t.teardown?.(),t.ac!==null&&Ft(()=>{t.ac.abort(rr),t.ac=null}),t.fn!==null&&(t.teardown=Oe),Ir(t,0),Tn(t))}function Zi(e){if(e.effects!==null)for(let t of e.effects)t.teardown&&t.fn!==null&&Zt(t)}var li=null,tn=null,L=null,$r=null,Le=null,eo=null,Dr=!1,Ji=!1,Or=null,Cn=null,Ps=0,Qi=new Set,Tl=1,vt=class e{id=Tl++;#e=!1;linked=!0;#r=null;#t=null;async_deriveds=new Map;current=new Map;previous=new Map;#n=new Set;#i=new Set;#s=0;#o=new Map;#l=null;#a=[];#u=[];#d=new Set;#f=new Set;#p=new Map;#g=new Set;is_fork=!1;#c=!1;constructor(){tn===null?li=tn=this:(tn.#t=this,this.#r=tn),tn=this}#$(){if(this.is_fork)return!0;for(let n of this.#o.keys()){for(var t=n,r=!1;t.parent!==null;){if(this.#p.has(t)){r=!0;break}t=t.parent}if(!r)return!0}return!1}skip_effect(t){this.#p.has(t)||this.#p.set(t,{d:[],m:[]}),this.#g.delete(t)}unskip_effect(t,r=n=>this.schedule(n)){var n=this.#p.get(t);if(n){this.#p.delete(t);for(var i of n.d)ne(i,2048),r(i);for(i of n.m)ne(i,4096),r(i)}this.#g.add(t)}#_(){if(this.#e=!0,Ps++>1e3&&(this.#v(),Cl()),m)for(let c of this.current.keys())Qi.add(c);for(let c of this.#d)this.#f.delete(c),ne(c,2048),this.schedule(c);for(let c of this.#f)ne(c,4096),this.schedule(c);let t=this.#a;this.#a=[],this.apply();var r=Or=[],n=[],i=Cn=[];for(let c of t)try{this.#b(c,r,n)}catch(d){throw Us(c),this.#$()||this.discard(),d}if(L=null,i.length>0){var s=e.ensure();for(let c of i)s.schedule(c)}if(Or=null,Cn=null,this.#$()){this.#h(n),this.#h(r);for(let[c,d]of this.#p)zs(c,d);i.length>0&&L.#_();return}let a=this.#y();if(a){this.#h(n),this.#h(r),a.#w(this);return}this.#d.clear(),this.#f.clear();for(let c of this.#n)c(this);this.#n.clear(),$r=this,Fs(n),Fs(r),$r=null,this.#l?.resolve();var l=L;if(this.#s===0&&(this.#a.length===0||l!==null)&&(this.#v(),$e&&(this.#m(),L=l)),this.#a.length>0)if(l!==null){let c=l;c.#a.push(...this.#a.filter(d=>!c.#a.includes(d)))}else l=this;l!==null&&l.#_()}#b(t,r,n){t.f^=1024;for(var i=t.first;i!==null;){var s=i.f,a=(s&96)!==0,l=a&&(s&1024)!==0,c=l||(s&8192)!==0||this.#p.has(i);if(!c&&i.fn!==null){a?i.f^=1024:(s&4)!==0?r.push(i):$e&&(s&16777224)!==0?n.push(i):br(i)&&((s&16)!==0&&this.#f.add(i),Zt(i));var d=i.first;if(d!==null){i=d;continue}}for(;i!==null;){var v=i.next;if(v!==null){i=v;break}i=i.parent}}}#y(){for(var t=this.#r;t!==null;){if(!t.is_fork){for(let[r,[,n]]of this.current)if(t.current.has(r)&&!n)return t}t=t.#r}return null}#w(t){for(let[n,i]of t.current)!this.previous.has(n)&&t.previous.has(n)&&this.previous.set(n,t.previous.get(n)),this.current.set(n,i);for(let[n,i]of t.async_deriveds){let s=this.async_deriveds.get(n);s&&i.promise.then(s.resolve).catch(s.reject)}t.async_deriveds.clear(),this.transfer_effects(t.#d,t.#f);let r=n=>{var i=n.reactions;if(i!==null&&!((n.f&2)!==0&&(n.f&6144)===0))for(let l of i){var s=l.f;if((s&2)!==0)r(l);else{var a=l;s&4194320&&!this.async_deriveds.has(a)&&(this.#f.delete(a),ne(a,2048),this.schedule(a))}}};for(let n of this.current.keys())r(n);this.oncommit(()=>t.discard()),t.#v(),L=this,this.#_()}#h(t){for(var r=0;r<t.length;r+=1)ei(t[r],this.#d,this.#f)}capture(t,r,n=!1){t.v!==ae&&!this.previous.has(t)&&this.previous.set(t,t.v),(t.f&8388608)===0&&(this.current.set(t,[r,n]),Le?.set(t,r)),this.is_fork||(t.v=r)}activate(){L=this}deactivate(){L=null,Le=null}flush(){try{m&&Qi.clear(),Ji=!0,L=this,this.#_()}finally{if(Ps=0,eo=null,Or=null,Cn=null,Ji=!1,L=null,Le=null,dr.clear(),m)for(let t of Qi)t.updated=null}}discard(){for(let t of this.#i)t(this);this.#i.clear();for(let t of this.async_deriveds.values())t.reject(Qr);this.#v(),this.#l?.resolve()}register_created_effect(t){this.#u.push(t)}#m(){for(let h=li;h!==null;h=h.#t){var t=h.id<this.id,r=[];for(let[f,[u,g]]of this.current){if(h.current.has(f)){var n=h.current.get(f)[0];if(t&&u!==n)h.current.set(f,[u,g]);else continue}r.push(f)}if(t)for(let[f,u]of this.async_deriveds){let g=h.async_deriveds.get(f);g&&u.promise.then(g.resolve).catch(g.reject)}var i=[...h.current.keys()].filter(f=>!h.current.get(f)[1]);if(!(!h.#e||i.length===0)){var s=i.filter(f=>!this.current.has(f));if(s.length===0)t&&h.discard();else if(r.length>0){if(m&&!h.#c&&Es(h.#a.length===0,"Batch has scheduled roots"),t)for(let f of this.#g)h.unskip_effect(f,u=>{(u.f&4194320)!==0?h.schedule(u):h.#h([u])});h.activate();var a=new Set,l=new Map;for(var c of r)Hs(c,s,a,l);l=new Map;var d=[...h.current].filter(([f,u])=>{let g=this.current.get(f);return g?g[0]!==u[0]||g[1]!==u[1]:!0}).map(([f])=>f);if(d.length>0)for(let f of this.#u)(f.f&155648)===0&&to(f,d,l)&&((f.f&4194320)!==0?(ne(f,2048),h.schedule(f)):h.#d.add(f));if(h.#a.length>0&&!h.#c){h.apply();for(var v of h.#a)h.#b(v,[],[]);h.#a=[]}h.deactivate()}}}}increment(t,r){if(this.#s+=1,t){let n=this.#o.get(r)??0;this.#o.set(r,n+1)}}decrement(t,r){if(this.#s-=1,t){let n=this.#o.get(r)??0;n===1?this.#o.delete(r):this.#o.set(r,n-1)}this.#c||(this.#c=!0,_e(()=>{this.#c=!1,this.linked&&this.flush()}))}transfer_effects(t,r){for(let n of t)this.#d.add(n);for(let n of r)this.#f.add(n);t.clear(),r.clear()}oncommit(t){this.#n.add(t)}ondiscard(t){this.#i.add(t)}settled(){return(this.#l??=Bn()).promise}static ensure(){if(L===null){let t=L=new e;!Ji&&!Dr&&_e(()=>{t.#e||t.flush()})}return L}apply(){if(!$e||!this.is_fork&&this.#r===null&&this.#t===null){Le=null;return}Le=new Map;for(let[r,[n]]of this.current)Le.set(r,n);for(let r=li;r!==null;r=r.#t)if(!(r===this||r.is_fork)){var t=!1;if(r.id<this.id){for(let[n,[,i]]of r.current)if(!i&&this.current.has(n)){t=!0;break}}if(!t)for(let[n,i]of r.previous)Le.has(n)||Le.set(n,i)}}schedule(t){if(eo=t,t.b?.is_pending&&(t.f&16777228)!==0&&(t.f&32768)===0){t.b.defer_effect(t);return}for(var r=t;r.parent!==null;){r=r.parent;var n=r.f;if(Or!==null&&r===k&&($e||(A===null||(A.f&2)===0)&&!As))return;if((n&96)!==0){if((n&1024)===0)return;r.f^=1024}}this.#a.push(r)}#v(){if(this.linked){var t=this.#r,r=this.#t;t===null?li=r:t.#t=r,r===null?tn=t:r.#r=t,this.linked=!1}}};function Lr(e){var t=Dr;Dr=!0;try{var r;for(e&&(L!==null&&!L.is_fork&&L.flush(),r=e());;){if(Cs(),L===null)return r;L.flush()}}finally{Dr=t}}function Cl(){if(m){var e=new Map;for(let r of L.current.keys())for(let[n,i]of r.updated??[]){var t=e.get(n);t||(t={error:i.error,count:0},e.set(n,t)),t.count+=i.count}for(let r of e.values())r.error&&console.error(r.error)}try{is()}catch(r){m&&Pe(r,"stack",{value:""}),Pt(r,eo)}}var Tt=null;function Fs(e){var t=e.length;if(t!==0){for(var r=0;r<t;){var n=e[r++];if((n.f&24576)===0&&br(n)&&(Tt=new Set,Zt(n),n.deps===null&&n.first===null&&n.nodes===null&&n.teardown===null&&n.ac===null&&ro(n),Tt?.size>0)){dr.clear();for(let i of Tt){if((i.f&24576)!==0)continue;let s=[i],a=i.parent;for(;a!==null;)Tt.has(a)&&(Tt.delete(a),s.push(a)),a=a.parent;for(let l=s.length-1;l>=0;l--){let c=s[l];(c.f&24576)===0&&Zt(c)}}Tt.clear()}}Tt=null}}function Hs(e,t,r,n){if(!r.has(e)&&(r.add(e),e.reactions!==null))for(let i of e.reactions){let s=i.f;(s&2)!==0?Hs(i,t,r,n):(s&4194320)!==0&&(s&2048)===0&&to(i,t,n)&&(ne(i,2048),Sn(i))}}function to(e,t,r){let n=r.get(e);if(n!==void 0)return n;if(e.deps!==null)for(let i of e.deps){if(vr.call(t,i))return!0;if((i.f&2)!==0&&to(i,t,r))return r.set(i,!0),!0}return r.set(e,!1),!1}function Sn(e){L.schedule(e)}function zs(e,t){if(!((e.f&32)!==0&&(e.f&1024)!==0)){(e.f&2048)!==0?t.d.push(e):(e.f&4096)!==0&&t.m.push(e),ne(e,1024);for(var r=e.first;r!==null;)zs(r,t),r=r.next}}function Us(e){ne(e,1024);for(var t=e.first;t!==null;)Us(t),t=t.next}var Nr=new Set,dr=new Map;function oi(e){Nr=e}var no=!1;function Vs(){no=!0}function Se(e,t){var r={f:0,v:e,reactions:null,equals:Gn,rv:0,wv:0};return m&&Nt&&(r.created=t??It("created at"),r.updated=null,r.set_during_effect=!1,r.trace=null),r}function H(e,t){let r=Se(e,t);return ai(r),r}function Sr(e,t=!1,r=!0){let n=Se(e);return t||(n.equals=jn),sr&&r&&V!==null&&V.l!==null&&(V.l.s??=[]).push(n),n}function b(e,t,r=!1){A!==null&&(!nt||(A.f&131072)!==0)&&Kt()&&(A.f&4325394)!==0&&(zt===null||!zt.has(e))&&hs();let n=r?xe(t):t;return m&&Xn(n,e.label),Ht(e,n,Cn)}function Ht(e,t,r=null){if(!e.equals(t)){dr.set(e,gt?t:e.v);var n=vt.ensure();if(n.capture(e,t),m){if(Nt||k!==null){e.updated??=new Map;let i=(e.updated.get("")?.count??0)+1;if(e.updated.set("",{error:null,count:i}),Nt||i>5){let s=It("updated at");if(s!==null){let a=e.updated.get(s.stack);a||(a={error:s,count:0},e.updated.set(s.stack,a)),a.count++}}}k!==null&&(e.set_during_effect=!0)}if((e.f&2)!==0){let i=e;(e.f&2048)!==0&&kn(i),Le===null&&Xr(i)}e.wv=en(),Ys(e,2048,r),Kt()&&k!==null&&(k.f&1024)!==0&&(k.f&96)===0&&(_t===null?qs([e]):_t.push(e)),!n.is_fork&&Nr.size>0&&!no&&ci()}return t}function ci(){no=!1;for(let e of Nr){(e.f&1024)!==0&&ne(e,4096);let t;try{t=br(e)}catch{t=!0}t&&Zt(e)}Nr.clear()}function ye(e){b(e,e.v+1)}function Ys(e,t,r){var n=e.reactions;if(n!==null)for(var i=Kt(),s=n.length,a=0;a<s;a++){var l=n[a],c=l.f;if(!(!i&&l===k)){var d=(c&2048)===0;if(d&&ne(l,t),(c&131072)!==0)Nr.add(l);else if((c&2)!==0){var v=l;Le?.delete(v),(c&65536)===0&&(c&512&&(k===null||(k.f&2097152)===0)&&(l.f|=65536),Ys(v,4096,r))}else if(d){var h=l;(c&16)!==0&&Tt!==null&&Tt.add(h),r!==null?r.push(h):Sn(h)}}}}var Sl=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function xe(e){if(typeof e!="object"||e===null||Fe in e)return e;let t=Br(e);if(t!==Oi&&t!==jo)return e;var r=new Map,n=tr(e),i=H(0),s=m&&Nt?It("created at"):null,a=Ct,l=h=>{if(Ct===a)return h();var f=A,u=Ct;be(null),io(a);var g=h();return be(f),io(u),g};n&&(r.set("length",H(e.length,s)),m&&(e=Rl(e)));var c="";let d=!1;function v(h){if(!d){d=!0,c=h,oe(i,`${c} version`);for(let[f,u]of r)oe(u,Pr(c,f));d=!1}}return new Proxy(e,{defineProperty(h,f,u){(!("value"in u)||u.configurable===!1||u.enumerable===!1||u.writable===!1)&&us();var g=r.get(f);return g===void 0?l(()=>{var $=H(u.value,s);return r.set(f,$),m&&typeof f=="string"&&oe($,Pr(c,f)),$}):b(g,u.value,!0),!0},deleteProperty(h,f){var u=r.get(f);if(u===void 0){if(f in h){let g=l(()=>H(ae,s));r.set(f,g),ye(i),m&&oe(g,Pr(c,f))}}else b(u,ae),ye(i);return!0},get(h,f,u){if(f===Fe)return e;if(m&&f===Vn)return v;var g=r.get(f),$=f in h;if(g===void 0&&(!$||lt(h,f)?.writable)&&(g=l(()=>{var y=xe($?h[f]:ae),E=H(y,s);return m&&oe(E,Pr(c,f)),E}),r.set(f,g)),g!==void 0){var _=o(g);return _===ae?void 0:_}return Reflect.get(h,f,u)},getOwnPropertyDescriptor(h,f){var u=Reflect.getOwnPropertyDescriptor(h,f);if(u&&"value"in u){var g=r.get(f);g&&(u.value=o(g))}else if(u===void 0){var $=r.get(f),_=$?.v;if($!==void 0&&_!==ae)return{enumerable:!0,configurable:!0,value:_,writable:!0}}return u},has(h,f){if(f===Fe)return!0;var u=r.get(f),g=u!==void 0&&u.v!==ae||Reflect.has(h,f);if(u!==void 0||k!==null&&(!g||lt(h,f)?.writable)){u===void 0&&(u=l(()=>{var _=g?xe(h[f]):ae,y=H(_,s);return m&&oe(y,Pr(c,f)),y}),r.set(f,u));var $=o(u);if($===ae)return!1}return g},set(h,f,u,g){var $=r.get(f),_=f in h;if(n&&f==="length")for(var y=u;y<$.v;y+=1){var E=r.get(y+"");E!==void 0?b(E,ae):y in h&&(E=l(()=>H(ae,s)),r.set(y+"",E),m&&oe(E,Pr(c,y)))}if($===void 0)(!_||lt(h,f)?.writable)&&($=l(()=>H(void 0,s)),m&&oe($,Pr(c,f)),b($,xe(u)),r.set(f,$));else{_=$.v!==ae;var R=l(()=>xe(u));b($,R)}var x=Reflect.getOwnPropertyDescriptor(h,f);if(x?.set&&x.set.call(g,u),!_){if(n&&typeof f=="string"){var D=r.get("length"),w=Number(f);Number.isInteger(w)&&w>=D.v&&b(D,w+1)}ye(i)}return!0},ownKeys(h){o(i);var f=Reflect.ownKeys(h).filter($=>{var _=r.get($);return _===void 0||_.v!==ae});for(var[u,g]of r)g.v!==ae&&!(u in h)&&f.push(u);return f},setPrototypeOf(){ps()}})}function Pr(e,t){return typeof t=="symbol"?`${e}[Symbol(${t.description??""})]`:Sl.test(t)?`${e}.${t}`:/^\d+$/.test(t)?`${e}[${t}]`:`${e}['${t}']`}function di(e){try{if(e!==null&&typeof e=="object"&&Fe in e)return e[Fe]}catch{}return e}var Al=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function Rl(e){return new Proxy(e,{get(t,r,n){var i=Reflect.get(t,r,n);return Al.has(r)?function(...s){Vs();var a=i.apply(this,s);return ci(),a}:i}})}function Ws(){let e=Array.prototype,t=Array.__svelte_cleanup;t&&t();let{indexOf:r,lastIndexOf:n,includes:i}=e;e.indexOf=function(s,a){let l=r.call(this,s,a);if(l===-1){for(let c=a??0;c<this.length;c+=1)if(di(this[c])===s){Wn("array.indexOf(...)");break}}return l},e.lastIndexOf=function(s,a){let l=n.call(this,s,a??this.length-1);if(l===-1){for(let c=0;c<=(a??this.length-1);c+=1)if(di(this[c])===s){Wn("array.lastIndexOf(...)");break}}return l},e.includes=function(s,a){let l=i.call(this,s,a);if(!l){for(let c=0;c<this.length;c+=1)if(di(this[c])===s){Wn("array.includes(...)");break}}return l},Array.__svelte_cleanup=()=>{e.indexOf=r,e.lastIndexOf=n,e.includes=i}}var fi,Gs,wn,js,Ks;function ui(){if(fi===void 0){fi=window,Gs=document,wn=/Firefox/.test(navigator.userAgent);var e=Element.prototype,t=Node.prototype,r=Text.prototype;js=lt(t,"firstChild").get,Ks=lt(t,"nextSibling").get,Mi(e)&&(e[gn]=void 0,e[Yn]=null,e[_n]=void 0,e.__e=void 0),Mi(r)&&(r[mn]=void 0),m&&(e.__svelte_meta=null,Ws())}}function Ae(e=""){return document.createTextNode(e)}function Ke(e){return js.call(e)}function Be(e){return Ks.call(e)}function he(e,t){if(!C)return Ke(e);var r=Ke(F);if(r===null)r=F.appendChild(Ae());else if(t&&r.nodeType!==Vr){var n=Ae();return r?.before(n),te(n),n}return t&&hi(r),te(r),r}function Ze(e,t=!1){if(!C){var r=Ke(e);return r instanceof Comment&&r.data===""?Be(r):r}if(t){if(F?.nodeType!==Vr){var n=Ae();return F?.before(n),te(n),n}hi(F)}return F}function mt(e,t=1,r=!1){let n=C?F:e;for(var i;t--;)i=n,n=Be(n);if(!C)return n;if(r){if(n?.nodeType!==Vr){var s=Ae();return n===null?i?.after(s):n.before(s),te(s),s}hi(n)}return te(n),n}function xn(e){e.textContent=""}function pi(){if(!$e||Tt!==null)return!1;var e=k.f;return(e&32768)!==0}function fr(e,t,r){return t==null||t===qn?r?document.createElement(e,{is:r}):document.createElement(e):r?document.createElementNS(t,e,{is:r}):document.createElementNS(t,e)}function hi(e){if(e.nodeValue.length<65536)return;let t=e.nextSibling;for(;t!==null&&t.nodeType===Vr;)t.remove(),e.nodeValue+=t.nodeValue,t=e.nextSibling}function so(e){k===null&&(A===null&&ns(e),rs()),gt&&ts(e)}function Nl(e,t){var r=t.last;r===null?t.last=t.first=e:(r.next=e,e.prev=r,t.last=e)}function Dt(e,t){var r=k;if(m)for(;r!==null&&(r.f&131072)!==0;)r=r.parent;r!==null&&(r.f&8192)!==0&&(e|=8192);var n={ctx:V,deps:null,nodes:null,f:e|2048|512,first:null,fn:t,last:null,next:null,parent:r,b:r&&r.b,prev:null,teardown:null,wv:0,ac:null};m&&(n.component_function=Mt),L?.register_created_effect(n);var i=n;if((e&4)!==0)Or!==null?Or.push(n):vt.ensure().schedule(n);else if(t!==null){try{Zt(n)}catch(a){throw pe(n),a}i.deps===null&&i.teardown===null&&i.nodes===null&&i.first===i.last&&(i.f&524288)===0&&(i=i.first,(e&16)!==0&&(e&65536)!==0&&i!==null&&(i.f|=65536))}if(i!==null&&(i.parent=r,r!==null&&Nl(i,r),A!==null&&(A.f&2)!==0&&(e&64)===0)){var s=A;(s.effects??=[]).push(i)}return n}function gr(){return A!==null&&!nt}function Ve(e){let t=Dt(8,null);return ne(t,1024),t.teardown=e,t}function ht(e){so("$effect"),m&&Pe(e,"name",{value:"$effect"});var t=k.f,r=!A&&(t&32)!==0&&V!==null&&!V.i;if(r){var n=V;(n.e??=[]).push(e)}else return Ui(e)}function Ui(e){return Dt(1048580,e)}function Jt(e){return so("$effect.pre"),m&&Pe(e,"name",{value:"$effect.pre"}),Dt(1048584,e)}function ao(e){vt.ensure();let t=Dt(524352,e);return()=>{pe(t)}}function Js(e){vt.ensure();let t=Dt(524352,e);return(r={})=>new Promise(n=>{r.outro?Xt(t,()=>{pe(t),n(void 0)}):(pe(t),n(void 0))})}function $t(e){return Dt(4,e)}function Ls(e){return Dt(4718592,e)}function Xe(e,t=0){return Dt(8|t,e)}function me(e,t=[],r=[],n=[]){ii(n,t,r,i=>{Dt(8,()=>{e(...i.map(o))})})}function tt(e,t=0){var r=Dt(16|t,e);return m&&(r.dev_stack=Ot),r}function lo(e,t=0){var r=Dt(16777216|t,e);return m&&(r.dev_stack=Ot),r}function we(e){return Dt(524320,e)}function co(e){var t=e.teardown;if(t!==null){let r=gt,n=A;oo(!0),be(null);try{t.call(null)}finally{oo(r),be(n)}}}function Tn(e,t=!1){var r=e.first;for(e.first=e.last=null;r!==null;){let i=r.ac;i!==null&&Ft(()=>{i.abort(rr)});var n=r.next;(r.f&64)!==0?r.parent=null:pe(r,t),r=n}}function Qs(e){for(var t=e.first;t!==null;){var r=t.next;(t.f&32)===0&&pe(t),t=r}}function pe(e,t=!0){var r=!1;(t||(e.f&262144)!==0)&&e.nodes!==null&&e.nodes.end!==null&&(ea(e.nodes.start,e.nodes.end),r=!0),e.f|=33554432,Tn(e,t&&!r),Ir(e,0);var n=e.nodes&&e.nodes.t;if(n!==null)for(let s of n)s.stop();co(e),e.f^=33554432,e.f|=16384;var i=e.parent;i!==null&&i.first!==null&&ro(e),m&&(e.component_function=null),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes=e.ac=e.b=null}function ea(e,t){for(;e!==null;){var r=e===t?null:Be(e);e.remove(),e=r}}function ro(e){var t=e.parent,r=e.prev,n=e.next;r!==null&&(r.next=n),n!==null&&(n.prev=r),t!==null&&(t.first===e&&(t.first=n),t.last===e&&(t.last=r))}function Xt(e,t,r=!0){var n=[];ta(e,n,!0);var i=()=>{r&&pe(e),t&&t()},s=n.length;if(s>0){var a=()=>--s||i();for(var l of n)l.out(a)}else i()}function ta(e,t,r){if((e.f&8192)===0){e.f^=8192;var n=e.nodes&&e.nodes.t;if(n!==null)for(let l of n)(l.is_global||r)&&t.push(l);for(var i=e.first;i!==null;){var s=i.next;if((i.f&64)===0){var a=(i.f&65536)!==0||(i.f&32)!==0&&(e.f&16)!==0;ta(i,t,a?r:!1)}i=s}}}function nn(e){ra(e,!0)}function ra(e,t){if((e.f&8192)!==0){e.f^=8192,(e.f&1024)===0&&(ne(e,2048),vt.ensure().schedule(e));for(var r=e.first;r!==null;){var n=r.next,i=(r.f&65536)!==0||(r.f&32)!==0;ra(r,i?t:!1),r=n}var s=e.nodes&&e.nodes.t;if(s!==null)for(let a of s)(a.is_global||t)&&a.in()}}function Zr(e,t){if(e.nodes)for(var r=e.nodes.start,n=e.nodes.end;r!==null;){var i=r===n?null:Be(r);t.append(r),r=i}}var na=null;var vi=!1,gt=!1;function oo(e){gt=e}var A=null,nt=!1;function be(e){A=e}var k=null;function De(e){k=e}var zt=null;function ai(e){A!==null&&(!$e||(A.f&2)!==0)&&(zt??=new Set).add(e)}var Me=null,rt=0,_t=null;function qs(e){_t=e}var ia=1,Fr=0,Ct=Fr;function io(e){Ct=e}function en(){return++ia}function br(e){var t=e.f;if((t&2048)!==0)return!0;if(t&2&&(e.f&=-65537),(t&4096)!==0){for(var r=e.deps,n=r.length,i=0;i<n;i++){var s=r[i];if(br(s)&&Xi(s),s.wv>e.wv)return!0}(t&512)!==0&&Le===null&&ne(e,1024)}return!1}function oa(e,t,r=!0){var n=e.reactions;if(n!==null&&!(!$e&&zt!==null&&zt.has(e)))for(var i=0;i<n.length;i++){var s=n[i];(s.f&2)!==0?oa(s,t,!1):t===s&&(r?ne(s,2048):(s.f&1024)!==0&&ne(s,4096),Sn(s))}}function si(e){var t=Me,r=rt,n=_t,i=A,s=zt,a=V,l=nt,c=Ct,d=e.f;Me=null,rt=0,_t=null,A=(d&96)===0?e:null,zt=null,ar(e.ctx),nt=!1,Ct=++Fr,e.ac!==null&&(Ft(()=>{e.ac.abort(rr)}),e.ac=null);try{e.f|=2097152;var v=e.fn,h=v();e.f|=32768;var f=e.deps,u=L?.is_fork;if(Me!==null){var g;if(u||Ir(e,rt),f!==null&&rt>0)for(f.length=rt+Me.length,g=0;g<Me.length;g++)f[rt+g]=Me[g];else e.deps=f=Me;if(gr()&&(e.f&512)!==0)for(g=rt;g<f.length;g++)(f[g].reactions??=[]).push(e)}else!u&&f!==null&&rt<f.length&&(Ir(e,rt),f.length=rt);if(Kt()&&_t!==null&&!nt&&f!==null&&(e.f&6146)===0)for(g=0;g<_t.length;g++)oa(_t[g],e);if(i!==null&&i!==e){if(Fr++,i.deps!==null)for(let $=0;$<r;$+=1)i.deps[$].rv=Fr;if(t!==null)for(let $ of t)$.rv=Fr;_t!==null&&(n===null?n=_t:n.push(..._t))}return(e.f&8388608)!==0&&(e.f^=8388608),h}catch($){return Qn($)}finally{e.f^=2097152,Me=t,rt=r,_t=n,A=i,zt=s,ar(a),nt=l,Ct=c}}function Il(e,t){let r=t.reactions;if(r!==null){var n=Go.call(r,e);if(n!==-1){var i=r.length-1;i===0?r=t.reactions=null:(r[n]=r[i],r.pop())}}if(r===null&&(t.f&2)!==0&&(Me===null||!vr.call(Me,t))){var s=t;(s.f&512)!==0&&(s.f^=512,s.f&=-65537),s.v!==ae&&Xr(s),s.ac!==null&&Ft(()=>{s.ac.abort(rr),s.ac=null,ne(s,2048)}),Ms(s),Ir(s,0)}}function Ir(e,t){var r=e.deps;if(r!==null)for(var n=t;n<r.length;n++)Il(e,r[n])}function Zt(e){var t=e.f;if((t&16384)===0){ne(e,1024);var r=k,n=vi;if(k=e,vi=(t&96)===0,m){var i=Mt;Zn(e.component_function);var s=Ot;Kr(e.dev_stack??Ot)}try{(t&16777232)!==0?Qs(e):Tn(e),co(e);var a=si(e);if(e.teardown=typeof a=="function"?a:null,e.wv=ia,m&&Nt&&(e.f&2048)!==0&&e.deps!==null)for(var l of e.deps)l.set_during_effect&&(l.wv=en(),l.set_during_effect=!1)}finally{vi=n,k=r,m&&(Zn(i),Kr(s))}}}async function yr(){if($e)return new Promise(e=>{requestAnimationFrame(()=>e()),setTimeout(()=>e())});await Promise.resolve(),Lr()}function o(e){var t=e.f,r=(t&2)!==0;if(na?.add(e),A!==null&&!nt){var n=k!==null&&(k.f&16384)!==0;if(!n&&(zt===null||!zt.has(e))){var i=A.deps;if((A.f&2097152)!==0)e.rv<Fr&&(e.rv=Fr,Me===null&&i!==null&&i[rt]===e?rt++:Me===null?Me=[e]:Me.push(e));else{A.deps??=[],vr.call(A.deps,e)||A.deps.push(e);var s=e.reactions;s===null?e.reactions=[A]:vr.call(s,A)||s.push(A)}}}if(m){if(!nt&&pt&&L===null&&$r===null&&!pt.warned&&(pt.effect.f&2097152)===0&&!pt.effect_deps.has(e)){pt.warned=!0,gs(e.label);var a=It("traced at");a&&console.warn(a)}if(En.delete(e),Nt&&!nt&&bn!==null&&A!==null&&bn.reaction===A){if(e.trace)e.trace();else if(a=It("traced at"),a){var l=bn.entries.get(e);l===void 0&&(l={traces:[]},bn.entries.set(e,l));var c=l.traces[l.traces.length-1];a.stack!==c?.stack&&l.traces.push(a)}}}if(gt&&dr.has(e))return dr.get(e);if(r){var d=e;if(gt){var v=d.v;return((d.f&1024)===0&&d.reactions!==null||aa(d))&&(v=kn(d)),dr.set(d,v),v}var h=(d.f&512)===0&&!nt&&A!==null&&(vi||(A.f&512)!==0),f=(d.f&32768)===0;br(d)&&(h&&(d.f|=512),Xi(d)),h&&!f&&(Zi(d),sa(d))}if(Le?.has(e))return Le.get(e);if((e.f&8388608)!==0)throw e.v;return e.v}function sa(e){if(e.f|=512,e.deps!==null)for(let t of e.deps)(t.reactions??=[]).push(e),(t.f&2)!==0&&(t.f&512)===0&&(Zi(t),sa(t))}function aa(e){if(e.v===ae)return!0;if(e.deps===null)return!1;for(let t of e.deps)if(dr.has(t)||(t.f&2)!==0&&aa(t))return!0;return!1}function T(e){var t=nt;try{return nt=!0,e()}finally{nt=t}}var Ml=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var _g=[...Ml,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var Ll=["touchstart","touchmove"];function la(e){return Ll.includes(e)}var Pl=["$state","$state.raw","$derived","$derived.by"],mg=[...Pl,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];var An=Symbol("events"),fo=new Set,gi=new Set;function ua(e,t,r,n={}){function i(s){if(n.capture||_i.call(t,s),!s.cancelBubble)return Ft(()=>r?.call(this,s))}return e.startsWith("pointer")||e.startsWith("touch")||e==="wheel"?_e(()=>{t.addEventListener(e,i,n)}):t.addEventListener(e,i,n),i}function on(e,t,r,n,i){var s={capture:n,passive:i},a=ua(e,t,r,s);(t===document.body||t===window||t===document||t instanceof HTMLMediaElement)&&Ve(()=>{t.removeEventListener(e,a,s)})}function Ye(e,t,r){(t[An]??={})[e]=r}function Ut(e){for(var t=0;t<e.length;t++)fo.add(e[t]);for(var r of gi)r(e)}var fa=null;function _i(e){var t=this,r=t.ownerDocument,n=e.type,i=e.composedPath?.()||[],s=i[0]||e.target;fa=e;var a=0,l=fa===e&&e[An];if(l){var c=i.indexOf(l);if(c!==-1&&(t===document||t===window)){e[An]=t;return}var d=i.indexOf(t);if(d===-1)return;c<=d&&(a=c)}if(s=i[a]||e.target,s!==t){Pe(e,"currentTarget",{configurable:!0,get(){return s||r}});var v=A,h=k;be(null),De(null);try{for(var f,u=[];s!==null&&s!==t;){try{var g=s[An]?.[n];g!=null&&(!s.disabled||e.target===s)&&g.call(s,e)}catch($){f?u.push($):f=$}if(e.cancelBubble)break;a++,s=a<i.length?i[a]:null}if(f){for(let $ of u)queueMicrotask(()=>{throw $});throw f}}finally{e[An]=t,delete e.currentTarget,be(v),De(h)}}}var Hl=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:e=>e});function pa(e){return Hl?.createHTML(e)??e}function uo(e){var t=fr("template");return t.innerHTML=pa(e.replaceAll("<!>","<!---->")),t.content}function Bt(e,t){var r=k;r.nodes===null&&(r.nodes={start:e,end:t,a:null,t:null})}function Y(e,t){var r=(t&1)!==0,n=(t&2)!==0,i,s=!e.startsWith("<!>");return()=>{if(C)return Bt(F,null),F;i===void 0&&(i=uo(s?e:"<!>"+e),r||(i=Ke(i)));var a=n||wn?document.importNode(i,!0):i.cloneNode(!0);if(r){var l=Ke(a),c=a.lastChild;Bt(l,c)}else Bt(a,a);return a}}function it(){if(C)return Bt(F,null),F;var e=document.createDocumentFragment(),t=document.createComment(""),r=Ae();return e.append(t,r),Bt(t,r),e}function K(e,t){if(C){var r=k;((r.f&32768)===0||r.nodes.end===null)&&(r.nodes.end=F),Ue();return}e!==null&&e.before(t)}var ho=!0;function $i(e,t){var r=t==null?"":typeof t=="object"?`${t}`:t;r!==(e[mn]??=e.nodeValue)&&(e[mn]=r,e.nodeValue=`${r}`)}function sn(e,t){return ha(e,t)}function go(e,t){ui(),t.intro=t.intro??!1;let r=t.target,n=C,i=F;try{for(var s=Ke(r);s&&(s.nodeType!==wt||s.data!=="[");)s=Be(s);if(!s)throw nr;ge(!0),te(s);let a=ha(e,{...t,anchor:s});return ge(!1),a}catch(a){if(a instanceof Error&&a.message.split(`
`).some(l=>l.startsWith("https://svelte.dev/e/")))throw a;return a!==nr&&console.warn("Failed to hydrate: ",a),t.recover===!1&&ss(),ui(),xn(r),ge(!1),sn(e,t)}finally{ge(n),te(i)}}var mi=new Map;function ha(e,{target:t,anchor:r,props:n={},events:i,context:s,intro:a=!0,transformError:l}){ui();var c=void 0,d=Js(()=>{var v=r??t.appendChild(Ae());qi(v,{pending:()=>{}},u=>{ct({});var g=V;if(s&&(g.c=s),i&&(n.$$events=i),C&&Bt(u,null),ho=a,c=e(u,n)||{},ho=!0,C&&(k.nodes.end=F,F===null||F.nodeType!==wt||F.data!=="]"))throw Tr(),nr;dt()},l);var h=new Set,f=u=>{for(var g=0;g<u.length;g++){var $=u[g];if(!h.has($)){h.add($);var _=la($);for(let R of[t,document]){var y=mi.get(R);y===void 0&&(y=new Map,mi.set(R,y));var E=y.get($);E===void 0?(R.addEventListener($,_i,{passive:_}),y.set($,1)):y.set($,E+1)}}}};return f(Ur(fo)),gi.add(f),()=>{for(var u of h)for(let _ of[t,document]){var g=mi.get(_),$=g.get(u);--$==0?(_.removeEventListener(u,_i),g.delete(u),g.size===0&&mi.delete(_)):g.set(u,$)}gi.delete(f),v!==r&&v.parentNode?.removeChild(v)}});return vo.set(c,d),c}var vo=new WeakMap;function Rn(e,t){let r=vo.get(e);return r?(vo.delete(e),r(t)):(m&&(Fe in e?ys():bs()),Promise.resolve())}var Vt=class{anchor;#e=new Map;#r=new Map;#t=new Map;#n=new Set;#i=!0;constructor(t,r=!0){this.anchor=t,this.#i=r}#s=t=>{if(this.#e.has(t)){var r=this.#e.get(t),n=this.#r.get(r);if(n)nn(n),this.#n.delete(r);else{var i=this.#t.get(r);i&&(nn(i.effect),this.#r.set(r,i.effect),this.#t.delete(r),m&&(i.fragment.lastChild[Li]=this.anchor),i.fragment.lastChild.remove(),this.anchor.before(i.fragment),n=i.effect)}for(let[s,a]of this.#e){if(this.#e.delete(s),s===t)break;let l=this.#t.get(a);l&&(pe(l.effect),this.#t.delete(a))}for(let[s,a]of this.#r){if(s===r||this.#n.has(s))continue;let l=()=>{if(Array.from(this.#e.values()).includes(s)){var d=document.createDocumentFragment();Zr(a,d),d.append(Ae()),this.#t.set(s,{effect:a,fragment:d})}else pe(a);this.#n.delete(s),this.#r.delete(s)};this.#i||!n?(this.#n.add(s),Xt(a,l,!1)):l()}}};#o=t=>{this.#e.delete(t);let r=Array.from(this.#e.values());for(let[n,i]of this.#t)r.includes(n)||(pe(i.effect),this.#t.delete(n))};ensure(t,r){var n=L,i=pi();if(r&&!this.#r.has(t)&&!this.#t.has(t))if(i){var s=document.createDocumentFragment(),a=Ae();s.append(a),this.#t.set(t,{effect:we(()=>r(a)),fragment:s})}else this.#r.set(t,we(()=>r(this.anchor)));if(this.#e.set(n,t),i){for(let[l,c]of this.#r)l===t?n.unskip_effect(c):n.skip_effect(c);for(let[l,c]of this.#t)l===t?n.unskip_effect(c.effect):n.skip_effect(c.effect);n.oncommit(this.#s),n.ondiscard(this.#o)}else C&&(this.anchor=F),this.#s(n)}};function Yt(e,t,r=!1){var n;C&&(n=F,Ue());var i=new Vt(e),s=r?65536:0;function a(l,c){if(C){var d=Gr(n);if(l!==parseInt(d.substring(1))){var v=Rt();te(v),i.anchor=v,ge(!1),i.ensure(l,c),ge(!0);return}}i.ensure(l,c)}tt(()=>{var l=!1;t((c,d=0)=>{l=!0,a(d,c)}),l||a(-1,null)},s)}function qt(e,t){return t}function Xl(e,t,r){for(var n=[],i=t.length,s,a=t.length,l=0;l<i;l++){let h=t[l];Xt(h,()=>{if(s){if(s.pending.delete(h),s.done.add(h),s.pending.size===0){var f=e.outrogroups;_o(e,Ur(s.done)),f.delete(s),f.size===0&&(e.outrogroups=null)}}else a-=1},!1)}if(a===0){var c=n.length===0&&r!==null;if(c){var d=r,v=d.parentNode;xn(v),v.append(d),e.items.clear()}_o(e,t,!c)}else s={pending:new Set(t),done:new Set},(e.outrogroups??=new Set).add(s)}function _o(e,t,r=!0){var n;if(e.pending.size>0){n=new Set;for(let a of e.pending.values())for(let l of a)n.add(e.items.get(l).e)}for(var i=0;i<t.length;i++){var s=t[i];if(n?.has(s)){s.f|=33554432;let a=document.createDocumentFragment();Zr(s,a)}else pe(t[i],r)}}var va;function bt(e,t,r,n,i,s=null){var a=e,l=new Map,c=(t&4)!==0;if(c){var d=e;a=C?te(Ke(d)):d.appendChild(Ae())}C&&Ue();var v=null,h=Rr(()=>{var R=r();return tr(R)?R:R==null?[]:Ur(R)});m&&oe(h,"{#each ...}");var f,u=new Map,g=!0;function $(R){(E.effect.f&16384)===0&&(E.pending.delete(R),E.fallback=v,Zl(E,f,a,t,n),v!==null&&(f.length===0?(v.f&33554432)===0?nn(v):(v.f^=33554432,In(v,null,a)):Xt(v,()=>{v=null})))}function _(R){E.pending.delete(R)}var y=tt(()=>{f=o(h);var R=f.length;let x=!1;if(C){var D=Gr(a)==="[!";D!==(R===0)&&(a=Rt(),te(a),ge(!1),x=!0)}for(var w=new Set,S=L,B=pi(),z=0;z<R;z+=1){C&&F.nodeType===wt&&F.data==="]"&&(a=F,x=!0,ge(!1));var X=f[z],O=n(X,z);if(m){var Z=n(X,z);O!==Z&&es(String(z),String(O),String(Z))}var U=g?null:l.get(O);U?(U.v&&Ht(U.v,X),U.i&&Ht(U.i,z),B&&S.unskip_effect(U.e)):(U=Jl(l,g?a:va??=Ae(),X,O,z,i,t,r),g||(U.e.f|=33554432),l.set(O,U)),w.add(O)}if(R===0&&s&&!v&&(g?v=we(()=>s(a)):(v=we(()=>s(va??=Ae())),v.f|=33554432)),R>w.size&&(m?Ql(f,n):Fi("","","")),C&&R>0&&te(Rt()),!g)if(u.set(S,w),B){for(let[q,j]of l)w.has(q)||S.skip_effect(j.e);S.oncommit($),S.ondiscard(_)}else $(S);x&&ge(!0),o(h)}),E={effect:y,flags:t,items:l,pending:u,outrogroups:null,fallback:v};g=!1,C&&(a=F)}function Nn(e){for(;e!==null&&(e.f&32)===0;)e=e.next;return e}function Zl(e,t,r,n,i){var s=(n&8)!==0,a=t.length,l=e.items,c=Nn(e.effect.first),d,v=null,h,f=[],u=[],g,$,_,y;if(s)for(y=0;y<a;y+=1)g=t[y],$=i(g,y),_=l.get($).e,(_.f&33554432)===0&&(_.nodes?.a?.measure(),(h??=new Set).add(_));for(y=0;y<a;y+=1){if(g=t[y],$=i(g,y),_=l.get($).e,e.outrogroups!==null)for(let X of e.outrogroups)X.pending.delete(_),X.done.delete(_);if((_.f&8192)!==0&&(nn(_),s&&(_.nodes?.a?.unfix(),(h??=new Set).delete(_))),(_.f&33554432)!==0)if(_.f^=33554432,_===c)In(_,null,r);else{var E=v?v.next:c;_===e.effect.last&&(e.effect.last=_.prev),_.prev&&(_.prev.next=_.next),_.next&&(_.next.prev=_.prev),wr(e,v,_),wr(e,_,E),In(_,E,r),v=_,f=[],u=[],c=Nn(v.next);continue}if(_!==c){if(d!==void 0&&d.has(_)){if(f.length<u.length){var R=u[0],x;v=R.prev;var D=f[0],w=f[f.length-1];for(x=0;x<f.length;x+=1)In(f[x],R,r);for(x=0;x<u.length;x+=1)d.delete(u[x]);wr(e,D.prev,w.next),wr(e,v,D),wr(e,w,R),c=R,v=w,y-=1,f=[],u=[]}else d.delete(_),In(_,c,r),wr(e,_.prev,_.next),wr(e,_,v===null?e.effect.first:v.next),wr(e,v,_),v=_;continue}for(f=[],u=[];c!==null&&c!==_;)(d??=new Set).add(c),u.push(c),c=Nn(c.next);if(c===null)continue}(_.f&33554432)===0&&f.push(_),v=_,c=Nn(_.next)}if(e.outrogroups!==null){for(let X of e.outrogroups)X.pending.size===0&&(_o(e,Ur(X.done)),e.outrogroups?.delete(X));e.outrogroups.size===0&&(e.outrogroups=null)}if(c!==null||d!==void 0){var S=[];if(d!==void 0)for(_ of d)(_.f&8192)===0&&S.push(_);for(;c!==null;)(c.f&8192)===0&&c!==e.fallback&&S.push(c),c=Nn(c.next);var B=S.length;if(B>0){var z=(n&4)!==0&&a===0?r:null;if(s){for(y=0;y<B;y+=1)S[y].nodes?.a?.measure();for(y=0;y<B;y+=1)S[y].nodes?.a?.fix()}Xl(e,S,z)}}s&&_e(()=>{if(h!==void 0)for(_ of h)_.nodes?.a?.apply()})}function Jl(e,t,r,n,i,s,a,l){var c=(a&1)!==0?(a&16)===0?Sr(r,!1,!1):Se(r):null,d=(a&2)!==0?Se(i):null;return m&&c&&(c.trace=()=>{l()[d?.v??i]}),{v:c,i:d,e:we(()=>(s(t,c??r,d??i,l),()=>{e.delete(n)}))}}function In(e,t,r){if(e.nodes)for(var n=e.nodes.start,i=e.nodes.end,s=t&&(t.f&33554432)===0?t.nodes.start:r;n!==null;){var a=Be(n);if(s.before(n),n===i)return;n=a}}function wr(e,t,r){t===null?e.effect.first=r:t.next=r,r===null?e.effect.last=t:r.prev=t}function Ql(e,t){let r=new Map,n=e.length;for(let i=0;i<n;i++){let s=t(e[i],i);if(r.has(s)){let a=String(r.get(s)),l=String(i),c=String(s);c.startsWith("[object ")&&(c=null),Fi(a,l,c)}r.set(s,i)}}function Wt(e,t,...r){var n=new Vt(e);tt(()=>{let i=t()??null;m&&i==null&&as(),n.ensure(i,i&&(s=>i(s,...r)))},65536)}function On(e,t,r){var n;C&&(n=F,Ue());var i=new Vt(e);tt(()=>{var s=t()??null;if(C){var a=Gr(n),l=a==="[",c=s!==null;if(l!==c){var d=Rt();te(d),i.anchor=d,ge(!1),i.ensure(s,s&&(v=>r(v,s))),ge(!0);return}}i.ensure(s,s&&(v=>r(v,s)))},65536)}function ot(e,t){var r=void 0,n;lo(()=>{r!==(r=t())&&(n&&(pe(n),n=null),r&&(n=we(()=>{$t(()=>r(e))})))})}function ma(e){var t,r,n="";if(typeof e=="string"||typeof e=="number")n+=e;else if(typeof e=="object")if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(r=ma(e[t]))&&(n&&(n+=" "),n+=r)}else for(r in e)e[r]&&(n&&(n+=" "),n+=r);return n}function $a(){for(var e,t,r=0,n="",i=arguments.length;r<i;r++)(e=arguments[r])&&(t=ma(e))&&(n&&(n+=" "),n+=t);return n}function Gt(e){return typeof e=="object"?$a(e):e??""}var ba=[...` 	
\r\f\xA0\v\uFEFF`];function wa(e,t,r){var n=e==null?"":""+e;if(t&&(n=n?n+" "+t:t),r){for(var i of Object.keys(r))if(r[i])n=n?n+" "+i:i;else if(n.length)for(var s=i.length,a=0;(a=n.indexOf(i,a))>=0;){var l=a+s;(a===0||ba.includes(n[a-1]))&&(l===n.length||ba.includes(n[l]))?n=(a===0?"":n.substring(0,a))+n.substring(l+1):a=l}}return n===""?null:n}function ya(e,t=!1){var r=t?" !important;":";",n="";for(var i of Object.keys(e)){var s=e[i];s!=null&&s!==""&&(n+=" "+i+": "+s+r)}return n}function mo(e){return e[0]!=="-"||e[1]!=="-"?e.toLowerCase():e}function xa(e,t){if(t){var r="",n,i;if(Array.isArray(t)?(n=t[0],i=t[1]):n=t,e){e=String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g,"").trim();var s=!1,a=0,l=!1,c=[];n&&c.push(...Object.keys(n).map(mo)),i&&c.push(...Object.keys(i).map(mo));var d=0,v=-1;let $=e.length;for(var h=0;h<$;h++){var f=e[h];if(l?f==="/"&&e[h-1]==="*"&&(l=!1):s?s===f&&(s=!1):f==="/"&&e[h+1]==="*"?l=!0:f==='"'||f==="'"?s=f:f==="("?a++:f===")"&&a--,!l&&s===!1&&a===0){if(f===":"&&v===-1)v=h;else if(f===";"||h===$-1){if(v!==-1){var u=mo(e.substring(d,v).trim());if(!c.includes(u)){f!==";"&&h++;var g=e.substring(d,h).trim();r+=" "+g+";"}}d=h+1,v=-1}}}}return n&&(r+=ya(n)),i&&(r+=ya(i,!0)),r=r.trim(),r===""?null:r}return e==null?null:String(e)}function Q(e,t,r,n,i,s){var a=e[gn];if(C||a!==r||a===void 0){var l=wa(r,n,s);(!C||l!==e.getAttribute("class"))&&(l==null?e.removeAttribute("class"):t?e.className=l:e.setAttribute("class",l)),e[gn]=r}else if(s&&i!==s)for(var c in s){var d=!!s[c];(i==null||d!==!!i[c])&&e.classList.toggle(c,d)}return s}function $o(e,t={},r,n){for(var i in r){var s=r[i];t[i]!==s&&(r[i]==null?e.style.removeProperty(i):e.style.setProperty(i,s,n))}}function Hr(e,t,r,n){var i=e[_n];if(C||i!==t){var s=xa(t,n);(!C||s!==e.getAttribute("style"))&&(s==null?e.removeAttribute("style"):e.style.cssText=s),e[_n]=t}else n&&(Array.isArray(n)?($o(e,r?.[0],n[0]),$o(e,r?.[1],n[1],"important")):$o(e,r,n));return n}var lc=Symbol("is custom element"),cc=Symbol("is html"),dc=Pi?"link":"LINK";function st(e,t,r,n){var i=fc(e);if(C&&(i[t]=e.getAttribute(t),t==="src"||t==="srcset"||t==="href"&&e.nodeName===dc)){n||pc(e,t,r??"");return}i[t]!==(i[t]=r)&&(t==="loading"&&(e[Ko]=r),r==null?e.removeAttribute(t):typeof r!="string"&&uc(e).includes(t)?e[t]=r:e.setAttribute(t,r))}function fc(e){return e[Yn]??={[lc]:e.nodeName.includes("-"),[cc]:e.namespaceURI===qn}}var Ea=new Map;function uc(e){var t=e.getAttribute("is")||e.nodeName,r=Ea.get(t);if(r)return r;Ea.set(t,r=[]);for(var n,i=e,s=Element.prototype;s!==i;){n=Ii(i);for(var a in n)n[a].set&&a!=="innerHTML"&&a!=="textContent"&&a!=="innerText"&&r.push(a);i=Br(i)}return r}function pc(e,t,r){m&&(t==="srcset"&&hc(e,r)||bo(e.getAttribute(t)??"",r)||$s(t,e.outerHTML.replace(e.innerHTML,e.innerHTML&&"..."),String(r)))}function bo(e,t){return e===t?!0:new URL(e,document.baseURI).href===new URL(t,document.baseURI).href}function ka(e){return e.split(",").map(t=>t.trim().split(" ").filter(Boolean))}function hc(e,t){var r=ka(e.srcset),n=ka(t);return n.length===r.length&&n.every(([i,s],a)=>s===r[a][1]&&(bo(r[a][0],i)||bo(i,r[a][0])))}function yo(e,t){return e===t||e?.[Fe]===t}function xr(e={},t,r,n){var i=V.r,s=k;return $t(()=>{var a,l;return Xe(()=>{a=l,l=n?.()||[],T(()=>{yo(r(...l),e)||(t(e,...l),a&&yo(r(...a),e)&&t(null,...a))})}),()=>{let c=s;for(;c!==i&&c.parent!==null&&c.parent.f&33554432;)c=c.parent;let d=()=>{l&&yo(r(...l),e)&&t(null,...l)},v=c.teardown;c.teardown=()=>{d(),v?.()}}}),e}var bc={get(e,t){if(!e.exclude.has(t))return e.props[t]},set(e,t){return m&&cs(`${e.name}.${String(t)}`),!1},getOwnPropertyDescriptor(e,t){if(!e.exclude.has(t)&&t in e.props)return{enumerable:!0,configurable:!0,value:e.props[t]}},has(e,t){return e.exclude.has(t)?!1:t in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(t=>!e.exclude.has(t))}};function wo(e,t,r){return new Proxy(m?{props:e,exclude:t,name:r}:{props:e,exclude:t},bc)}function Ee(e,t,r,n){var i=!sr||(r&2)!==0,s=(r&8)!==0,a=(r&16)!==0,l=n,c=!0,d=void 0,v=()=>a&&i?(d??=mr(n),o(d)):(c&&(c=!1,l=a?T(n):n),l);let h;if(s){var f=Fe in e||vn in e;h=lt(e,t)?.set??(f&&t in e?x=>e[t]=x:void 0)}var u,g=!1;s?[u,g]=Vi(()=>e[t]):u=e[t],u===void 0&&n!==void 0&&(u=v(),h&&(i&&ls(t),h(u)));var $;if(i?$=()=>{var x=e[t];return x===void 0?v():(c=!0,x)}:$=()=>{var x=e[t];return x!==void 0&&(l=void 0),x===void 0?l:x},i&&(r&4)===0)return $;if(h){var _=e.$$legacy;return(function(x,D){return arguments.length>0?((!i||!D||_||g)&&h(D?$():x),x):$()})}var y=!1,E=((r&1)!==0?mr:Rr)(()=>(y=!1,$()));m&&(E.label=t),s&&o(E);var R=k;return(function(x,D){if(arguments.length>0){let w=D?o(E):i&&s?xe(x):x;return b(E,w),y=!0,l!==void 0&&(l=w),x}return gt&&y||(R.f&16384)!==0?E.v:o(E)})}function Ca(e){return new xo(e)}var xo=class{#e;#r;constructor(t){var r=new Map,n=(s,a)=>{var l=Sr(a,!1,!1);return r.set(s,l),l};let i=new Proxy({...t.props||{},$$events:{}},{get(s,a){return o(r.get(a)??n(a,Reflect.get(s,a)))},has(s,a){return a===vn?!0:(o(r.get(a)??n(a,Reflect.get(s,a))),Reflect.has(s,a))},set(s,a,l){return b(r.get(a)??n(a,l),l),Reflect.set(s,a,l)}});this.#r=(t.hydrate?go:sn)(t.component,{target:t.target,anchor:t.anchor,props:i,context:t.context,intro:t.intro??!1,recover:t.recover,transformError:t.transformError}),!$e&&(!t?.props?.$$host||t.sync===!1)&&Lr(),this.#e=i.$$events;for(let s of Object.keys(this.#r))s==="$set"||s==="$destroy"||s==="$on"||Pe(this,s,{get(){return this.#r[s]},set(a){this.#r[s]=a},enumerable:!0});this.#r.$set=s=>{Object.assign(i,s)},this.#r.$destroy=()=>{Rn(this.#r)}}$set(t){this.#r.$set(t)}$on(t,r){this.#e[t]=this.#e[t]||[];let n=(...i)=>r.call(this,...i);return this.#e[t].push(n),()=>{this.#e[t]=this.#e[t].filter(i=>i!==n)}}$destroy(){this.#r.$destroy()}};var Dc;typeof HTMLElement=="function"&&(Dc=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(e,t,r){super(),this.$$ctor=e,this.$$s=t,r&&(this.$$shadowRoot=this.attachShadow(r))}addEventListener(e,t,r){if(this.$$l[e]=this.$$l[e]||[],this.$$l[e].push(t),this.$$c){let n=this.$$c.$on(e,t);this.$$l_u.set(t,n)}super.addEventListener(e,t,r)}removeEventListener(e,t,r){if(super.removeEventListener(e,t,r),this.$$c){let n=this.$$l_u.get(t);n&&(n(),this.$$l_u.delete(t))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let e=function(n){return i=>{let s=fr("slot");n!=="default"&&(s.name=n),K(i,s)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let t={},r=Sc(this);for(let n of this.$$s)n in r&&(n==="default"&&!this.$$d.children?(this.$$d.children=e(n),t.default=!0):t[n]=e(n));for(let n of this.attributes){let i=this.$$g_p(n.name);i in this.$$d||(this.$$d[i]=Eo(i,n.value,this.$$p_d,"toProp"))}for(let n in this.$$p_d)!(n in this.$$d)&&this[n]!==void 0&&(this.$$d[n]=this[n],delete this[n]);this.$$c=Ca({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:t,$$host:this}}),this.$$me=ao(()=>{Xe(()=>{this.$$r=!0;for(let n of Ni(this.$$c)){if(!this.$$p_d[n]?.reflect)continue;this.$$d[n]=this.$$c[n];let i=Eo(n,this.$$d[n],this.$$p_d,"toAttribute");i==null?this.removeAttribute(this.$$p_d[n].attribute||n):this.setAttribute(this.$$p_d[n].attribute||n,i)}this.$$r=!1})});for(let n in this.$$l)for(let i of this.$$l[n]){let s=this.$$c.$on(n,i);this.$$l_u.set(i,s)}this.$$l={}}}attributeChangedCallback(e,t,r){this.$$r||(e=this.$$g_p(e),this.$$d[e]=Eo(e,r,this.$$p_d,"toProp"),this.$$c?.$set({[e]:this.$$d[e]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(e){return Ni(this.$$p_d).find(t=>this.$$p_d[t].attribute===e||!this.$$p_d[t].attribute&&t.toLowerCase()===e)||e}});function Eo(e,t,r,n){let i=r[e]?.type;if(t=i==="Boolean"&&typeof t!="boolean"?t!=null:t,!n||!r[e])return t;if(n==="toAttribute")switch(i){case"Object":case"Array":return t==null?null:JSON.stringify(t);case"Boolean":return t?"":null;case"Number":return t??null;default:return t}else switch(i){case"Object":case"Array":return t&&JSON.parse(t);case"Boolean":return t;case"Number":return t!=null?+t:t;default:return t}}function Sc(e){let t={};return e.childNodes.forEach(r=>{t[r.slot||"default"]=!0}),t}if(m){let e=function(t){if(!(t in globalThis)){let r;Object.defineProperty(globalThis,t,{configurable:!0,get:()=>{if(r!==void 0)return r;ds(t)},set:n=>{r=n}})}};e("$state"),e("$effect"),e("$derived"),e("$inspect"),e("$props"),e("$bindable")}function Da(){return A===null&&os(),(A.ac??=new AbortController).signal}function yi(e){V===null&&$n("onMount"),sr&&V.l!==null?Nc(V).m.push(e):ht(()=>{let t=T(e);if(typeof t=="function")return t})}function Nc(e){var t=e.l;return t.u??={a:[],b:[],m:[]}}typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");var an=class extends Map{#e=new Map;#r=H(0);#t=H(0);#n=Ct||-1;constructor(t){if(super(),m&&(t=new Map(t),oe(this.#r,"SvelteMap version"),oe(this.#t,"SvelteMap.size")),t){for(var[r,n]of t)super.set(r,n);this.#t.v=super.size}}#i(t){return Ct===this.#n?H(t):Se(t)}has(t){var r=this.#e,n=r.get(t);if(n===void 0)if(super.has(t))n=this.#i(0),m&&oe(n,`SvelteMap get(${jr(t)})`),r.set(t,n);else return o(this.#r),!1;return o(n),!0}forEach(t,r){this.#s(),super.forEach(t,r)}get(t){var r=this.#e,n=r.get(t);if(n===void 0)if(super.has(t))n=this.#i(0),m&&oe(n,`SvelteMap get(${jr(t)})`),r.set(t,n);else{o(this.#r);return}return o(n),super.get(t)}set(t,r){var n=this.#e,i=n.get(t),s=super.get(t),a=super.set(t,r),l=this.#r;if(i===void 0)i=this.#i(0),m&&oe(i,`SvelteMap get(${jr(t)})`),n.set(t,i),b(this.#t,super.size),ye(l);else if(s!==r){ye(i);var c=l.reactions===null?null:new Set(l.reactions),d=c===null||!i.reactions?.every(v=>c.has(v));d&&ye(l)}return a}delete(t){var r=this.#e,n=r.get(t),i=super.delete(t);return n!==void 0&&(r.delete(t),b(n,-1)),i&&(b(this.#t,super.size),ye(this.#r)),i}clear(){if(super.size!==0){super.clear();var t=this.#e;b(this.#t,0);for(var r of t.values())b(r,-1);ye(this.#r),t.clear()}}#s(){o(this.#r);var t=this.#e;if(this.#t.v!==t.size){for(var r of super.keys())if(!t.has(r)){var n=this.#i(0);m&&oe(n,`SvelteMap get(${jr(r)})`),t.set(r,n)}}for([,n]of this.#e)o(n)}keys(){return o(this.#r),super.keys()}values(){return this.#s(),super.values()}entries(){return this.#s(),super.entries()}[Symbol.iterator](){return this.entries()}get size(){return o(this.#t),super.size}};var Sa=Symbol("replace"),wi=class extends URLSearchParams{#e=m?oe(H(0),"SvelteURLSearchParams version"):H(0);#r=Aa();#t=!1;#n(){if(!this.#r||this.#t)return;this.#t=!0;let t=this.toString();this.#r.search=t&&`?${t}`,this.#t=!1}[Sa](t){if(!this.#t&&t.toString()!==super.toString()){this.#t=!0;for(let r of[...super.keys()])super.delete(r);for(let[r,n]of t)super.append(r,n);ye(this.#e),this.#t=!1}}append(t,r){super.append(t,r),this.#n(),ye(this.#e)}delete(t,r){var n=super.has(t,r);super.delete(t,r),n&&(this.#n(),ye(this.#e))}get(t){return o(this.#e),super.get(t)}getAll(t){return o(this.#e),super.getAll(t)}has(t,r){return o(this.#e),super.has(t,r)}keys(){return o(this.#e),super.keys()}forEach(t,r){o(this.#e),super.forEach(t,r)}set(t,r){var n=super.getAll(t);super.set(t,r);var i=super.getAll(t);(n.length!==i.length||n.some((s,a)=>s!==i[a]))&&(this.#n(),ye(this.#e))}sort(){super.sort(),this.#n(),ye(this.#e)}toString(){return o(this.#e),super.toString()}values(){return o(this.#e),super.values()}entries(){return o(this.#e),super.entries()}[Symbol.iterator](){return this.entries()}get size(){return o(this.#e),super.size}};var Oc=null;function Aa(){return Oc}function Po(e,t=void 0){return function(r){return r.key==="Enter"||r.key===" "&&!r.preventDefault()?e.call(t,r):void 0}}function ur(e,t){return t?null:r=>{typeof e=="string"?r.innerText=e:e?.domNodes?r.replaceChildren(...e.domNodes):e?.html&&(r.innerHTML=e.html)}}function Mc(e){return t=>{let r=n=>{t&&!t.contains(n.target)&&t.dispatchEvent(new CustomEvent(e+"outside",{detail:{jsEvent:n}}))};return document.addEventListener(e,r,!0),()=>{document.removeEventListener(e,r,!0)}}}function Lc(e){return t=>{let r=new ResizeObserver(n=>{for(let i of n)e(t,i)});return r.observe(t),()=>{r.unobserve(t)}}}function Ne(...e){return Object.assign(...e)}function zr(e){return Object.keys(e)}function Pc(e){return Object.entries(e)}function Do(e,t){return Object.hasOwn(e,t)}function Fc(e){return Math.floor(e)}function Hc(e){return Math.ceil(e)}function So(...e){return Math.min(...e)}function cn(...e){return Math.max(...e)}function zc(){return Symbol("ec")}function Ln(e){return e.length}function dn(e){return!Ln(e)}function ki(e=new Date){return-e.getTimezoneOffset()}function pn(e){return Array.isArray(e)}function Ie(e){return typeof e=="function"}function Uc(e){if(typeof e!="object"||e===null)return!1;let t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}function Fo(e){return e instanceof Date}var Ti=e=>e;function Bc(e){return t=>t===void 0?void 0:e(t)}function Si(e,t,r,n){return n?{snippet:n,arg:t?.()}:{content:(Ie(e)?e(t?.()):e)??(Ie(r)?r():r)}}var Ao=86400;function At(e=new Date,t=void 0){return Fo(e)?Gc(e,t):jc(e,t)}function ln(e){if(typeof e=="number")e={seconds:e};else if(typeof e=="string"){let r=0,n=2;for(let i of e.split(":",3))r+=parseInt(i,10)*Math.pow(60,n--);e={seconds:r}}else Fo(e)&&(e={hours:e.getUTCHours(),minutes:e.getUTCMinutes(),seconds:e.getUTCSeconds()});let t=e.weeks||e.week||0;return{years:e.years||e.year||0,months:e.months||e.month||0,days:t*7+(e.days||e.day||0),seconds:(e.hours||e.hour||0)*60*60+(e.minutes||e.minute||0)*60+(e.seconds||e.second||0),inWeeks:!!t}}function G(e){let t=new Date(e.getTime());return Pn(t,Ro(e)),t}function Je(e,t,r=1){e.setUTCFullYear(e.getUTCFullYear()+r*t.years);let n=e.getUTCMonth()+r*t.months;for(e.setUTCMonth(n),n%=12,n<0&&(n+=12);e.getUTCMonth()!==n;)Ho(e);return e.setUTCDate(e.getUTCDate()+r*t.days),e.setUTCSeconds(e.getUTCSeconds()+r*t.seconds),e}function Vc(e,t,r=1){return Je(e,t,-r)}function er(e,t=1){return e.setUTCDate(e.getUTCDate()+t),e}function Ho(e,t=1){return er(e,-t)}function at(e){return e.setUTCHours(0,0,0,0),e}function Qe(e){return new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds())}function Er(e,t=19){return e.toISOString().substring(0,t)}function yt(e,...t){return t.every(r=>e.getTime()===r.getTime())}function Yc(e,t){let r=t-e.getUTCDay();return e.setUTCDate(e.getUTCDate()+(r>=0?r:r+7)),e}function za(e,t){let r=t-e.getUTCDay();return e.setUTCDate(e.getUTCDate()+(r<=0?r:r-7)),e}function Ra(e){return typeof e=="string"&&e.length<=10}function qc(e,t){return e.setUTCHours(t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds(),0),e}function Re(e){return e.seconds}function Ua(e,t,r){return Je(e,t),Wa(e,r,er),e}function Ba(e,t,r){return Vc(e,t),Wa(e,r,Ho),e}function Va(e,t){e=G(e),t===0?e.setUTCDate(e.getUTCDate()+6-e.getUTCDay()):e.setUTCDate(e.getUTCDate()+4-(e.getUTCDay()||7));let r=new Date(Date.UTC(e.getUTCFullYear(),0,1));return Math.ceil(((e-r)/1e3/Ao+1)/7)}function Wc(e,t,r,n){return Si(r,()=>({date:Qe(t),week:e}),()=>"W"+String(e).padStart(2,"0"),n)}function Ya(e,t={}){let r=e.match(/([+-])(\d{2}):(\d{2})$/);if(r)return Ne(t,r),+(r[1]+"1")*(+r[2]*60+ +r[3])}function zo(e,t){return t&&e.setUTCMinutes(e.getUTCMinutes()+t),e}var qa=Symbol("ec");function Pn(e,t){return e[qa]=t,e}function Ro(e){return e[qa]}function Gc(e,t=void 0){let r=new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds()));return zo(r,t?t-ki(r):0),Pn(r,t??ki(r)),r}function jc(e,t=void 0){let r={},n=Ya(e,r);n!==void 0&&(e=e.substring(0,r.index));let i=e.match(/\d+/g),s=new Date(Date.UTC(+i[0],+i[1]-1,+i[2],+i[3]||0,+i[4]||0,+i[5]||0));return t!==void 0&&n!==void 0&&zo(s,t-n),Pn(s,t??n),s}function Wa(e,t,r){if(t.length&&t.length<7)for(;t.includes(e.getUTCDay());)r(e)}var Uo=zc();function Ga(e,t){e[Uo]=t}function Kc(e){return!!e?.[Uo]}function ja(e){return e[Uo]}function Ka(e,t,r,n=[]){let i=document.createElement(e);i.className=t,typeof r=="string"?i.innerText=r:r.domNodes?i.replaceChildren(...r.domNodes):r.html&&(i.innerHTML=r.html);for(let s of n)i.setAttribute(...s);return i}function xi(e){return e.getBoundingClientRect()}function Mn(e){return xi(e).height}function Xa(e,t,r=document,n=[]){n.push(r);for(let i of r.elementsFromPoint(e,t)){if(Kc(i))return i;if(i.shadowRoot&&!n.includes(i.shadowRoot)){let s=Xa(e,t,i.shadowRoot,n);if(s)return s}}return null}function No(e,t=void 0){return function(r){r.stopPropagation(),e&&e.call(t,r)}}function Xc(e,t,r,n){return{type:e,title:t,currentStart:r.start,currentEnd:r.end,activeStart:n.start,activeEnd:n.end,calendar:void 0}}function pr(e){return e=Ne({},e),e.currentStart=Qe(e.currentStart),e.currentEnd=Qe(e.currentEnd),e.activeStart=Qe(e.activeStart),e.activeEnd=Qe(e.activeEnd),e}var Zc=1;function Ci(e,t=void 0){return e.map(r=>{let n={id:"id"in r?String(r.id):`{generated-${Zc++}}`,resourceIds:ko(r,"resourceId").map(String),allDay:r.allDay??(Ra(r.start)&&Ra(r.end)),start:At(r.start,t),end:At(r.end,t),title:r.title??"",editable:r.editable,startEditable:r.startEditable,durationEditable:r.durationEditable,display:r.display??"auto",extendedProps:r.extendedProps??{},backgroundColor:r.backgroundColor??r.color,textColor:r.textColor,classNames:ko(r,"className"),styles:ko(r,"style")};if(n.allDay){at(n.start);let i=G(n.end);at(n.end),(!yt(n.end,i)||yt(n.end,n.start))&&er(n.end)}return n})}function ko(e,t){let r=e[t+"s"]??e[t]??[];return pn(r)?r:[r]}function Jc(e){return e.map(t=>({events:t.events,url:t.url&&t.url.trimEnd("&")||"",method:t.method&&t.method.toUpperCase()||"GET",extraParams:t.extraParams||{}}))}function Qc(e,t,r){return r.formatRange(e.start,t&&e.event.display!=="pointer"&&!e.zeroDuration?qc(G(e.start),e.end):e.start)}function ed(e,t,r){let n;switch(e.event.display){case"background":n=[];break;case"pointer":n=e.event.allDay?[]:[Na(t,e,r)];break;default:n=[...e.event.allDay?[]:[Na(t,e,r)],Ka("h4",r.eventTitle,e.event.title)]}return{domNodes:n}}function Na(e,t,r){return Ka("time",r.eventTime,e,[["datetime",Er(t.start)]])}function td(e,t,r){let n=t.classNames;return e&&(Ie(e)&&(e=e({event:St(t),view:pr(r)})),n=[...pn(e)?e:[e],...n]),n}function St(e){return rd(e,Qe)}function rd(e,t){return e=Ne({},e),e.start=t(e.start),e.end=t(e.end),e}function nd(e,t){e.length=t.length;for(let r of e)r?.reposition()}function Fn(e,t,r,n=void 0){return(!n||e.resourceIds.includes(n.id))&&e.start<r&&e.end>t}function Za(e){return id(e)||od(e)||sd(e)}function hr(e){return e==="background"}function id(e){return e==="preview"}function od(e){return e==="ghost"}function sd(e){return e==="pointer"}function Ai(e,t,r){return t=e.start>t?e.start:t,r=e.end<r?e.end:r,{start:t,end:r,event:e,zeroDuration:yt(t,r)}}function fn(e,t,r=!0){let n=[],i,s,a,l;for(let{gridColumn:c,gridRow:d,resource:v,dayStart:h,dayEnd:f,disabled:u}of t)!u&&Fn(e,h,f,v)&&(n.push(h),i=f,s||(s=c,a=d,l=v));if(n.length){let c=Ai(e,n[0],i);return Ne(c,{gridColumn:s,gridRow:a,resource:l,dates:n}),r&&Bo(c),[c]}return[]}function Ja(e){let t={},r={};for(let n of e){let{gridColumn:i,gridRow:s}=n;for(let l=1;l<n.dates.length;++l){let c=`${s}_${i+l}`;r[c]?r[c].chunks.push(n):r[c]={sorted:!1,chunks:[n]}}let a=`${s}_${i}`;n.long=r[a],n.prev=t[a],t[a]=n}}function ad(e,t,r=1,n=1){e.prev&&(r=e.prev.bottom+n);let i=r+t;if(e.long){let s=e.long;s.sorted||(s.chunks.sort((a,l)=>a.top-l.top),s.sorted=!0);for(let a of s.chunks)if(r<a.bottom&&i>a.top){let l=a.bottom-r+n;r+=l,i+=l}}return Ne(e,{top:r,bottom:i}),r}var Ia=new WeakMap,ld=1;function Bo(e){let{event:t,gridColumn:r,gridRow:n}=e,i=Ia.get(t);i||(i=ld++,Ia.set(t,i)),e.id=`${i}-${r}-${n}`}function un(e,t){return()=>{let{options:{locale:r}}=e,n=e.options[t],i;return T(()=>{i=Ie(n)?{format:n}:new Intl.DateTimeFormat(r,n)}),{format:s=>i.format(Qe(s))}}}function Oa(e,t){return()=>{let{options:{locale:r}}=e,n=e.options[t],i;return T(()=>{if(Ie(n))i=n;else{let s=new Intl.DateTimeFormat(r,n);i=(a,l)=>{if(a<=l)return s.formatRange(a,l);{let c=s.formatRangeToParts(l,a),d="",v=["startRange","endRange"],h=[!1,!1];for(let f of c){let u=v.indexOf(f.source);u>=0?h[u]||(d+=cd(v[1-u],c),h[u]=!0):d+=f.value}return d}}}}),{formatRange:(s,a)=>i(Qe(s),Qe(a))}}}function cd(e,t){let r="";for(let n of t)n.source==e&&(r+=n.value);return r}function dd(e){return Vo(e,"day")}function fd(e){return Vo(e,"week")}function ud(e){return Vo(e,"month")}function Vo(e,t){return{...e,next:"Next "+t,prev:"Previous "+t}}function To(e){return t=>({...t,view:e})}function pd(e){let t,r;return e&&({start:t,end:r}=e,t&&(t=at(At(t))),r&&(r=at(At(r)))),{start:t,end:r}}function Hn(e,t){return t.start&&e<t.start||t.end&&e>t.end}function Yo(e){let t=[];return Qa(e,0,!1,t),t}function Qa(e,t,r,n){let i=[];for(let s of e){let a=hd(s);i.push(a),n.push(a);let l={level:t,children:[],hidden:r};Ga(a,l),s.children&&(l.children=Qa(s.children,t+1,r||!a.expanded,n))}return i}function hd(e){return{id:String(e.id),title:e.title||"",eventBackgroundColor:el(e),eventTextColor:tl(e),expanded:e.expanded??!0,extendedProps:e.extendedProps??{}}}function el(e){return e?.eventBackgroundColor}function tl(e){return e?.eventTextColor}function Ma(e,t){return dn(e.resourceIds)?void 0:t.find(r=>e.resourceIds.includes(r.id))}function rl(e,t,r,n,i){let s=[];e=G(e);let a=G(e);for(Je(e,n.min),Je(a,n.max);e<a;)s.push([Er(e),i.format(e)]),Je(e,t,r);let l=Fc((e-a)/1e3/Re(t));return l&&l!==r&&(s.at(-1)[2]=r-l),s}function nl(e,t,r,n,i){let s=ln(e),a=ln(t);if(r){let l=ln(So(Re(s),cn(0,Re(a)-Ao))),c=ln(cn(Re(a),Re(l)+Ao)),d=Ie(r?.eventFilter)?r.eventFilter:v=>!hr(v.display);e:for(let v of n){let h=Je(G(v),s),f=Je(G(v),a),u=Je(G(v),l),g=Je(G(v),c);for(let $ of i)if(!$.allDay&&d($)&&$.start<g&&$.end>u){if($.start<h){let _=cn(($.start-v)/1e3,Re(l));_<Re(s)&&(s.seconds=_)}if($.end>f){let _=So(($.end-v)/1e3,Re(c));_>Re(a)&&(a.seconds=_)}if(Re(s)===Re(l)&&Re(a)===Re(c))break e}}}return{min:s,max:a}}function Di(e){let t=0,r=H(xe(t));return il(e,()=>o(r),()=>!0,()=>b(r,++t,!0))}function vd(e){let t=0,r=xe({});return il(e,n=>r[n],(n,i)=>n!==i,n=>r[n]=++t)}function il(e,t,r,n){return new Proxy(e,{get(i,s,a){return Do(i,s)&&t(s),Reflect.get(i,s,a)},set(i,s,a,l){let c=r(i[s],a),d=Reflect.set(i,s,a,l);return c&&n(s),d}})}function gd(e){let t={buttonText:{today:"today"},customButtons:{},customScrollbars:!1,date:new Date,dateIncrement:void 0,datesSet:void 0,dayCellContent:void 0,dayHeaderFormat:{weekday:"short",month:"numeric",day:"numeric"},dayHeaderAriaLabelFormat:{dateStyle:"full"},displayEventEnd:!0,duration:{weeks:1},events:[],eventAllUpdated:void 0,eventBackgroundColor:void 0,eventClassNames:void 0,eventClick:void 0,eventColor:void 0,eventContent:void 0,eventDidMount:void 0,eventFilter:void 0,eventGap:1,eventMouseEnter:void 0,eventMouseLeave:void 0,eventOrder:void 0,eventOrderStrict:!1,eventSources:[],eventTextColor:void 0,eventTimeFormat:{hour:"numeric",minute:"2-digit"},filterEventsWithResources:!1,firstDay:0,headerToolbar:{start:"title",center:"",end:"today prev,next"},height:void 0,hiddenDays:[],highlightedDates:[],icons:{},lazyFetching:!0,loading:void 0,locale:void 0,refetchResourcesOnNavigate:!1,resources:[],selectable:!1,theme:{active:"ec-active",bgEvent:"ec-bg-event",bgEvents:"ec-bg-events",body:"ec-body",button:"ec-button",buttonGroup:"ec-button-group",calendar:"ec",colHead:"ec-col-head",customScrollbars:"ec-custom-scrollbars",day:"ec-day",dayHead:"ec-day-head",disabled:"ec-disabled",endClipped:"ec-end-clipped",event:"ec-event",eventBody:"ec-event-body",eventTime:"ec-event-time",eventTitle:"ec-event-title",events:"ec-events",grid:"ec-grid",header:"ec-header",hidden:"ec-hidden",highlight:"ec-highlight",icon:"ec-icon",main:"ec-main",noBeb:"ec-no-beb",noIeb:"ec-no-ieb",startClipped:"ec-start-clipped",today:"ec-today",title:"ec-title",toolbar:"ec-toolbar",view:"",weekdays:["ec-sun","ec-mon","ec-tue","ec-wed","ec-thu","ec-fri","ec-sat"],weekNumber:"ec-week-number"},timeZone:"local",titleFormat:{year:"numeric",month:"short",day:"numeric"},validRange:void 0,view:void 0,viewDidMount:void 0,views:{}};for(let r of e)r.createOptions?.(t);return t}function _d(e){let t={date:r=>at(At(r)),dateIncrement:Bc(ln),duration:ln,events:Ci,eventSources:Jc,hiddenDays:r=>[...new Set(r)],highlightedDates:r=>r.map(n=>at(At(n))),resources:r=>pn(r)?Yo(r):r,validRange:pd};for(let r of e)r.createParsers?.(t);return t}var ol=["buttonText","customButtons","icons","theme"];function md(e,t){let r=gd(e),n=_d(e);r=Io(r,n),t=Io(t,n);let i=Co(r,"views")??{},s=Co(t,"views")??{},a=vd({});Ne(a,r),t.view&&(a.view=t.view);let l={},c={},d={},v=new Set([...zr(i),...zr(s)]);for(let h of v){let f=s[h]??{},u=La(r,i[h]??i[f.type]??{}),g=La(u,t,f),$=Co(g,"component");delete g.view;for(let _ of zr(g))Do(a,_)?(l[_]??=[],l[_].push(ol.includes(_)?y=>g[_]=Ie(y)?y(u[_]):y:y=>g[_]=y)):delete g[_];c[h]=g,d[h]=$}return Ne(a,c[a.view]),[a,function(f,u,g=!0){Do(a,f)&&(g||(f in n?u=n[f](u):Uc(u)?u={...u}:pn(u)&&(u=[...u])),l[f]?.forEach($=>$(u)),a[f]=u)},function(f){return Ne(a,c[f]),d[f]}]}function Io(e,t){let r={...e};for(let n of zr(t))n in r&&(r[n]=t[n](r[n]));if(e.views){r.views={};for(let n of zr(e.views))r.views[n]=Io(e.views[n],t)}return r}function Co(e,t){let r=e[t];return delete e[t],r}function La(...e){let t={};for(let r of e){let n={};for(let i of ol)Ie(r[i])&&(n[i]=r[i](t[i]));t={...t,...r,...n}}return t}function $d(e,t){let r=[];for(let n of zr(e))e[n]!==t[n]&&r.push([n,e[n]]);return r}function bd(e){return()=>{let{options:{view:t}}=e;T(()=>{let r=e.setViewOptions(t);e.extensions={},e.features=[],e.viewComponent=r(e)})}}function yd(e,t){return()=>{let{activeRange:r,fetchedRange:{events:n},offset:i,viewDates:s,options:{events:a,eventSources:l,lazyFetching:c,timeZone:d}}=e;T(()=>{sl(l.map(v=>Ie(v.events)?v.events:v),a,v=>Ci(v,i),v=>e.events=Di(v),d,r,n,s,!0,c,t)})}}function wd(e,t){return()=>{let{activeRange:r,fetchedRange:{resources:n},viewDates:i,options:{lazyFetching:s,refetchResourcesOnNavigate:a,resources:l,timeZone:c}}=e;T(()=>{sl(pn(l)?[]:[l],l,Yo,d=>e.resources=Di(d),c,r,n,i,a,s,t)})}}function sl(e,t,r,n,i,s,a,l,c,d,v){if(!dn(l)){if(dn(e)){n(t);return}if((c||!a.start)&&(!d||!a.start||a.start>s.start||a.end<s.end||a.timeZone!==i)){let h=[],f=_=>v.stop(),u=_=>{h=h.concat(r(_)),n(h),v.stop()},g=Er(s.start),$=Er(s.end);for(let _ of e)if(v.start(),Ie(_)){let y=_(c?{start:Qe(s.start),end:Qe(s.end),startStr:g,endStr:$,timeZone:i}:{},u,f);y!==void 0&&Promise.resolve(y).then(u,f)}else{let y=Ie(_.extraParams)?_.extraParams():Ne({},_.extraParams);c&&(y.start=g,y.end=$,i!=="local"&&(y.timeZone=i)),y=new URLSearchParams(y);let E=_.url,R={},x;["GET","HEAD"].includes(_.method)?E+=(E.includes("?")?"&":"?")+y:(R["content-type"]="application/x-www-form-urlencoded;charset=UTF-8",x=String(y)),fetch(E,{method:_.method,headers:R,body:x,signal:Da(),credentials:"same-origin"}).then(D=>D.json()).then(u).catch(f)}Ne(a,{...s,timeZone:i})}}}function xd(e){let t=0;function r(n){let{options:{loading:i}}=e;Ie(i)&&i(n)}return{start:()=>++t===1&&r(!0),stop:()=>--t===0&&r(!1)}}function Ed(e){return()=>{let{offset:t}=e,r=setInterval(()=>{let n=At(void 0,t),i=at(G(n));e.now=n,yt(e.today,i)||(e.today=i)},1e3);return()=>clearInterval(r)}}function kd(e){return()=>{let{offset:t,options:r}=e;T(()=>{for(let i of e.events)if(!i.allDay)for(let s of["start","end"]){let a=Ro(i[s]);a!==void 0&&zo(i[s],t-a),Pn(i[s],t)}let n=Ro(r.date);if(n!==void 0){let i=At(void 0,t).getUTCDay()-At(void 0,n).getUTCDay(),s=er(G(r.date),i);e.setOption("date",s)}Pn(r.date,t)})}}function Td(e){return()=>{let{activeRange:t,options:{datesSet:r}}=e;T(()=>{Ie(r)&&r({start:Qe(t.start),end:Qe(t.end),startStr:Er(t.start),endStr:Er(t.end),view:pr(e.view)})})}}function Cd(e){let t;return()=>{let{filteredEvents:r,options:{eventAllUpdated:n}}=e;T(()=>{Ie(n)&&(t||(t=setTimeout(()=>{t=null,n({view:pr(e.view)})})))})}}function Dd(e){return()=>{let{options:{view:t,viewDidMount:r}}=e;T(()=>{Ie(r)&&yr().then(()=>r({view:pr(e.view)}))})}}function Sd(e){return()=>{let{options:{date:t,duration:r,firstDay:n}}=e,i,s;return T(()=>{i=G(t),r.years?(i.setUTCMonth(0),i.setUTCDate(1)):r.months?i.setUTCDate(1):r.inWeeks&&za(i,n),s=Je(G(i),r)}),{start:i,end:s}}}function Ad(e){return()=>{let{currentRange:t,extensions:{activeRange:r}}=e,n,i;return T(()=>{n=G(t.start),i=G(t.end)}),r?r(n,i):{start:n,end:i}}}function Rd(e){return()=>{let{events:t,options:{eventFilter:r,eventOrder:n,filterEventsWithResources:i,resources:s,view:a}}=e,l=[...t];return T(()=>{if(Ie(r)){let c=t.map(St),d=pr(e.view);l=l.filter((v,h)=>r({event:St(v),index:h,events:c,view:d}))}i&&(l=l.filter(c=>s.some(d=>c.resourceIds.includes(d.id)))),Ie(n)?l.sort((c,d)=>n(St(c),St(d))):l.sort((c,d)=>c.start-d.start||d.allDay-c.allDay)}),l}}function Nd(e){return()=>{let{options:{timeZone:t}}=e,r;return T(()=>{r=t==="local"?ki():t==="UTC"?0:Ya(t)??ki()}),r}}function Id(e){return()=>{let{options:t,activeRange:r}=e,{hiddenDays:n}=t,i=[];return T(()=>{let s=at(G(r.start)),a=at(G(r.end));for(;s<a;)n.includes(s.getUTCDay())||i.push(G(s)),er(s);if(!i.length&&n.length&&n.length<7){for(;n.includes(s.getUTCDay());)er(s);yr().then(()=>{e.setOption("date",s)})}}),i}}function Od(e){return()=>{let{currentRange:t,intlTitle:r}=e,n;return T(()=>{n=r.formatRange(t.start,Ho(G(t.end)))}),n}}function Md(e){return()=>{let{activeRange:t,currentRange:r,viewTitle:n,options:{view:i}}=e,s;return T(()=>{s=Xc(i,n,r,t)}),s}}var Ld=class{#e;get auxComponents(){return o(this.#e)}set auxComponents(e){b(this.#e,e,!0)}#r;get offset(){return o(this.#r)}set offset(e){b(this.#r,e)}#t;get currentRange(){return o(this.#t)}set currentRange(e){b(this.#t,e)}#n;get activeRange(){return o(this.#n)}set activeRange(e){b(this.#n,e)}#i;get fetchedRange(){return o(this.#i)}set fetchedRange(e){b(this.#i,e,!0)}#s;get events(){return o(this.#s)}set events(e){b(this.#s,e)}#o;get filteredEvents(){return o(this.#o)}set filteredEvents(e){b(this.#o,e)}#l;get mainEl(){return o(this.#l)}set mainEl(e){b(this.#l,e,!0)}#a;get now(){return o(this.#a)}set now(e){b(this.#a,e,!0)}#u;get resources(){return o(this.#u)}set resources(e){b(this.#u,e)}#d;get scrollDate(){return o(this.#d)}set scrollDate(e){b(this.#d,e,!0)}#f;get today(){return o(this.#f)}set today(e){b(this.#f,e,!0)}#p;get intlEventTime(){return o(this.#p)}set intlEventTime(e){b(this.#p,e)}#g;get intlDayHeader(){return o(this.#g)}set intlDayHeader(e){b(this.#g,e)}#c;get intlDayHeaderAL(){return o(this.#c)}set intlDayHeaderAL(e){b(this.#c,e)}#$;get intlTitle(){return o(this.#$)}set intlTitle(e){b(this.#$,e)}#_;get viewDates(){return o(this.#_)}set viewDates(e){b(this.#_,e)}#b;get viewTitle(){return o(this.#b)}set viewTitle(e){b(this.#b,e)}#y;get view(){return o(this.#y)}set view(e){b(this.#y,e)}#w;get viewComponent(){return o(this.#w)}set viewComponent(e){b(this.#w,e,!0)}#h;get extensions(){return o(this.#h)}set extensions(e){b(this.#h,e,!0)}#m;get features(){return o(this.#m)}set features(e){b(this.#m,e,!0)}#v;get interaction(){return o(this.#v)}set interaction(e){b(this.#v,e,!0)}#x;get iClasses(){return o(this.#x)}set iClasses(e){b(this.#x,e,!0)}#E;get iClass(){return o(this.#E)}set iClass(e){b(this.#E,e,!0)}options;setOption;setViewOptions;constructor(e,t){[this.options,this.setOption,this.setViewOptions]=md(e,t),this.#e=H(xe([])),this.#r=p(Nd(this)),this.#t=p(Sd(this)),this.#n=p(Ad(this)),this.#i=H(xe({events:{},resources:{}})),this.#s=H(Di(this.options.events)),this.#o=p(Rd(this)),this.#l=H(),this.#a=H(xe(At(void 0,this.offset))),this.#u=H(Di(pn(this.options.resources)?this.options.resources:[])),this.#d=H(),this.#f=H(xe(at(G(this.now)))),this.#p=p(Oa(this,"eventTimeFormat")),this.#g=p(un(this,"dayHeaderFormat")),this.#c=p(un(this,"dayHeaderAriaLabelFormat")),this.#$=p(Oa(this,"titleFormat")),this.#_=p(Id(this)),this.#b=p(Od(this)),this.#y=p(Md(this)),this.#w=H(),this.#h=H(xe({})),this.#m=H(xe([])),this.snippets={},this.#v=H(xe({})),this.iEvents=new an,this.#x=H(xe(Ti)),this.#E=H();for(let r of e)r.initState?.(this);this.#k()}#k(){let e=xd(this);Jt(bd(this)),Jt(kd(this)),Jt(Ed(this)),ht(yd(this,e)),ht(wd(this,e)),ht(Td(this)),ht(Cd(this)),ht(Dd(this))}},Pd=Y("<h2></h2>"),Pa=Y("<button><i></i></button>"),Fa=Y("<button> </button>"),Fd=Y("<button></button>");function Ha(e,t){ct(t,!0);let r=We("state"),n=p(()=>r.currentRange),i=p(()=>r.today),s=p(()=>r.viewTitle),a=p(()=>r.viewDates),l=p(()=>r.options.buttonText),c=p(()=>r.options.customButtons),d=p(()=>r.options.date),v=p(()=>r.options.dateIncrement),h=p(()=>r.options.duration),f=p(()=>r.options.hiddenDays),u=p(()=>r.options.theme),g=p(()=>r.options.validRange),$=p(()=>r.options.view),_=H(!1),y=H(!1),E=H(!1),R=!1;Jt(()=>{o(a),o(g),t.buttons,T(()=>{R||(R=!0,t.buttons.includes("prev")&&(b(_,!1),o(g).start&&b(_,x(D),!0)),t.buttons.includes("next")&&(b(y,!1),o(g).end&&b(y,x(w),!0)),t.buttons.includes("today")&&(b(E,o(i)>=o(n).start&&o(i)<o(n).end,!0),!o(E)&&(o(g).start||o(g).end)&&b(E,x(S),!0)),yr().then(()=>R=!1))})});function x(X){let O=o(d);X();let Z=o(a).every(U=>Hn(U,o(g)));return r.setOption("date",O),Z}function D(){r.setOption("date",Ba(G(o(d)),o(v)??o(h),o(f)))}function w(){r.setOption("date",Ua(G(o(d)),o(v)??o(h),o(f)))}function S(){r.setOption("date",G(o(i)))}var B=it(),z=Ze(B);bt(z,17,()=>t.buttons,qt,(X,O)=>{var Z=it(),U=Ze(Z),q=M=>{var I=Pd();ot(I,()=>ur(o(s))),me(()=>Q(I,1,o(u).title)),K(M,I)},j=M=>{var I=Pa(),N=he(I);re(I),me(()=>{Q(I,1,`${o(u).button??""} ec-${o(O)??""}`),st(I,"aria-label",o(l).prev),st(I,"title",o(l).prev),I.disabled=o(_),Q(N,1,`${o(u).icon??""} ec-${o(O)??""}`)}),Ye("click",I,D),K(M,I)},se=M=>{var I=Pa(),N=he(I);re(I),me(()=>{Q(I,1,`${o(u).button??""} ec-${o(O)??""}`),st(I,"aria-label",o(l).next),st(I,"title",o(l).next),I.disabled=o(y),Q(N,1,`${o(u).icon??""} ec-${o(O)??""}`)}),Ye("click",I,w),K(M,I)},de=M=>{var I=Fa(),N=he(I,!0);re(I),me(()=>{Q(I,1,`${o(u).button??""} ec-${o(O)??""}`),I.disabled=o(E),$i(N,o(l)[o(O)])}),Ye("click",I,S),K(M,I)},ee=M=>{var I=Fd();ot(I,()=>ur(o(c)[o(O)].text)),me(()=>Q(I,1,Gt([o(u).button,`ec-${o(O)}`,o(c)[o(O)].active&&o(u).active]))),Ye("click",I,function(...N){o(c)[o(O)].click?.apply(this,N)}),K(M,I)},P=M=>{var I=Fa(),N=he(I,!0);re(I),me(()=>{Q(I,1,Gt([o(u).button,`ec-${o(O)}`,o($)===o(O)&&o(u).active])),$i(N,o(l)[o(O)])}),Ye("click",I,()=>r.setOption("view",o(O))),K(M,I)};Yt(U,M=>{o(O)==="title"?M(q):o(O)==="prev"?M(j,1):o(O)==="next"?M(se,2):o(O)==="today"?M(de,3):o(c)[o(O)]?M(ee,4):o(O)!==""&&M(P,5)}),K(X,Z)}),K(e,B),dt()}Ut(["click"]);var Hd=Y("<div><!></div>"),zd=Y("<div></div>"),Ud=Y("<nav></nav>");function Bd(e,t){ct(t,!0);let r=p(()=>We("state")),n=p(()=>o(r).options.headerToolbar),i=p(()=>o(r).options.theme),s=p(()=>{let l={};for(let c of["start","center","end"])l[c]=o(n)[c]?.split(" ").map(d=>d.split(","))??[];return l});var a=Ud();bt(a,21,()=>zr(o(s)),qt,(l,c)=>{var d=zd();bt(d,21,()=>o(s)[o(c)],qt,(v,h)=>{var f=it(),u=Ze(f),g=_=>{var y=Hd();Ha(he(y),{get buttons(){return o(h)}}),re(y),me(()=>Q(y,1,o(i).buttonGroup)),K(_,y)},$=_=>{Ha(_,{get buttons(){return o(h)}})};Yt(u,_=>{o(h).length>1?_(g):_($,-1)}),K(v,f)}),re(d),me(()=>Q(d,1,`ec-${o(c)??""}`)),K(l,d)}),re(a),me(()=>Q(a,1,o(i).toolbar)),K(e,a),dt()}var Vd=new Set(["$$slots","$$events","$$legacy","plugins","options"]),Yd=Y("<div><!> <!> <!></div>");function qd(e,t){ct(t,!0);let r=Ee(t,"plugins",19,()=>[]),n=Ee(t,"options",19,()=>({})),i=wo(t,Vd),s=new Ld(r(),n());s.snippets=i,Jn("state",s);let a=p(()=>s.auxComponents),l=p(()=>s.features),c=p(()=>s.events),d=p(()=>s.interaction),v=p(()=>s.iClass),h=p(()=>s.offset),f=p(()=>s.view),u=p(()=>s.viewComponent),g=p(()=>s.options.date),$=p(()=>s.options.dateIncrement),_=p(()=>s.options.duration),y=p(()=>s.options.height),E=p(()=>s.options.hiddenDays),R=p(()=>s.options.customScrollbars),x=p(()=>s.options.theme),D={...n()};Jt(()=>{for(let[W,ue]of $d(n(),D))T(()=>{w(W,ue)});Ne(D,n())});function w(W,ue){return s.setOption(W,ue,!1),this}function S(W){let ue=s.options[W];return Fo(ue)?Qe(ue):ue}function B(){return s.fetchedRange.resources={},this}function z(){return s.fetchedRange.events={},this}function X(){return o(c).map(St)}function O(W){W=String(W);for(let ue of o(c))if(ue.id===W)return St(ue);return null}function Z(W){return W=Ci([W],o(h))[0],o(c).push(W),St(W)}function U(W){let ue=String(W.id),jt=o(c).findIndex(kr=>kr.id===ue);return jt>=0?(W=Ci([W],o(h))[0],o(c)[jt]=W,St(W)):null}function q(W){W=String(W);let ue=o(c).findIndex(jt=>jt.id===W);return ue>=0&&o(c).splice(ue,1),this}function j(){return pr(o(f))}function se(){return o(d).action?.unselect(),this}function de(W,ue){let jt=Xa(W,ue);if(jt){let kr=ja(jt)(W,ue);return kr.date=Qe(kr.date),kr}return null}function ee(W){return W=at(At(W)),s.setOption("date",G(W)),s.scrollDate=W,this}function P(){return s.setOption("date",Ua(G(o(g)),o($)??o(_),o(E))),this}function M(){return s.setOption("date",Ba(G(o(g)),o($)??o(_),o(E))),this}var I={setOption:w,getOption:S,refetchResources:B,refetchEvents:z,getEvents:X,getEventById:O,addEvent:Z,updateEvent:U,removeEventById:q,getView:j,unselect:se,dateFromPoint:de,gotoDate:ee,next:P,prev:M},N=Yd();let J;var fe=he(N);Bd(fe,{});var qe=mt(fe,2);On(qe,()=>o(u),(W,ue)=>{ue(W,{})});var hn=mt(qe,2);return bt(hn,17,()=>o(a),qt,(W,ue)=>{var jt=it(),kr=Ze(jt);On(kr,()=>o(ue),(hl,vl)=>{vl(hl,{})}),K(W,jt)}),re(N),me(W=>{Q(N,1,Gt([o(x).calendar,o(x).view,o(v)&&o(x)[o(v)],o(R)&&o(x).customScrollbars])),st(N,"role",W),J=Hr(N,"",J,{height:o(y)})},[()=>o(l).includes("list")?"list":"table"]),K(e,N),dt(I)}function Wd(e){"weekNumbers"in e||Ne(e,{weekNumbers:!1,weekNumberContent:void 0})}function Gd(e){return()=>{let{viewDates:t,options:{duration:r,hiddenDays:n}}=e,i;return T(()=>i=r.months||r.inWeeks?7-n.length:t.length),i}}function jd(e,t){return()=>{let{options:{highlightedDates:r,validRange:n},viewDates:i}=e,{colsCount:s}=t,a=[];return T(()=>{let l=[],c=1,d=1;for(let v of i)l.push({gridColumn:c,gridRow:d,resource:void 0,dayStart:v,dayEnd:er(G(v)),disabled:Hn(v,n),highlight:r.some(h=>yt(h,v))}),c===s&&(a.push(l),l=[],c=0,++d),++c}),a}}function Kd(e,t){return()=>{let{filteredEvents:r}=e,{grid:n}=t,i=[],s=[];return T(()=>{for(let a of r)for(let l of n)hr(a.display)?a.allDay&&(s=s.concat(fn(a,l))):i=i.concat(fn(a,l));Ja(i)}),{chunks:i,bgChunks:s}}}function Xd(e,t){return()=>{let{iEvents:r}=e,{grid:n}=t,i=[];for(let[,s]of r)s&&T(()=>{for(let a of n)i=i.concat(fn(s,a,!1))});return i}}var Zd=class{#e;get colsCount(){return o(this.#e)}set colsCount(e){b(this.#e,e)}#r;get grid(){return o(this.#r)}set grid(e){b(this.#r,e)}#t;get gridEl(){return o(this.#t)}set gridEl(e){b(this.#t,e,!0)}#n;get chunks(){return o(this.#n)}set chunks(e){b(this.#n,e)}#i;get bgChunks(){return o(this.#i)}set bgChunks(e){b(this.#i,e)}#s;get iChunks(){return o(this.#s)}set iChunks(e){b(this.#s,e)}#o;get intlDayCell(){return o(this.#o)}set intlDayCell(e){b(this.#o,e)}#l;get intlDayPopover(){return o(this.#l)}set intlDayPopover(e){b(this.#l,e)}#a;get popupDay(){return o(this.#a)}set popupDay(e){b(this.#a,e,!0)}constructor(e){this.#e=p(Gd(e)),this.#r=p(jd(e,this)),this.#t=H();let t=p(Kd(e,this)),r=p(()=>o(t).chunks),n=p(()=>o(t).bgChunks);this.#n=p(()=>o(r)),this.#i=p(()=>o(n)),this.#s=p(Xd(e,this)),this.hiddenChunks=new an,this.#o=p(un(e,"dayCellFormat")),this.#l=p(un(e,"dayPopoverFormat")),this.#a=H(null)}},Jd=Y("<div><!></div>");function Qd(e,t){ct(t,!0);let r=Ee(t,"el",15),n=Ee(t,"allDay",3,!1),i=Ee(t,"resource",3,void 0),s=Ee(t,"dateFromPoint",3,()=>t.date),a=Ee(t,"classes",3,Ti),l=Ee(t,"disabled",3,!1),c=Ee(t,"highlight",3,!1),d=Ee(t,"role",3,"cell"),v=Ee(t,"noIeb",3,!1),h=Ee(t,"noBeb",3,!1),f=Ee(t,"defaultContent",3,void 0),u=p(()=>We("state")),g=p(()=>o(u).today),$=p(()=>o(u).snippets),_=p(()=>o(u).interaction.action),y=p(()=>o(u).options.dayCellContent),E=p(()=>o(u).options.theme),R=p(()=>We("view-state")),x=p(()=>o(R).snap),D=p(()=>yt(t.date,o(g))),w=p(()=>Si(o(y),()=>({allDay:n(),date:Qe(t.date),isToday:o(D),resource:i()}),f(),o($).dayCellContent)),S=p(()=>a()([o(E).day,o(E).weekdays?.[t.date.getUTCDay()],o(D)&&o(E).today,c()&&o(E).highlight,l()&&o(E).disabled,v()&&o(E).noIeb,h()&&o(E).noBeb]));yi(()=>{Ga(r(),(U,q)=>({allDay:n(),date:s()(U,q),resource:i(),dayEl:r(),disabled:l()}))});let B=p(()=>!l()&&o(_)?U=>o(_).select(U,o(x)):void 0);var z=Jd(),X=he(z),O=U=>{var q=it(),j=Ze(q);Wt(j,()=>t.content,()=>o(w)),K(U,q)},Z=U=>{var q=it(),j=Ze(q);Wt(j,()=>o(w).snippet??Oe,()=>o(w).arg),K(U,q)};Yt(X,U=>{t.content?U(O):U(Z,-1)}),re(z),xr(z,U=>r(U),()=>r()),ot(z,()=>t.content?null:ur(o(w).content,o(w).snippet)),me(()=>{Q(z,1,Gt(o(S))),st(z,"role",d())}),Ye("pointerdown",z,function(...U){o(B)?.apply(this,U)}),K(e,z),dt()}Ut(["pointerdown"]);var ef=Y("<div><!></div>"),tf=Y("<article><!></article>");function rf(e,t){ct(t,!0);let r=Ee(t,"el",15),n=Ee(t,"classes",3,Ti),i=Ee(t,"styles",3,Ti),s=p(()=>We("state")),a=p(()=>o(s).intlEventTime),l=p(()=>o(s).resources),c=p(()=>o(s).snippets),d=p(()=>o(s).view),v=p(()=>o(s).options.displayEventEnd),h=p(()=>o(s).options.eventBackgroundColor),f=p(()=>o(s).options.eventColor),u=p(()=>o(s).options.eventContent),g=p(()=>o(s).options.eventClick),$=p(()=>o(s).options.eventDidMount),_=p(()=>o(s).options.eventClassNames),y=p(()=>o(s).options.eventMouseEnter),E=p(()=>o(s).options.eventMouseLeave),R=p(()=>o(s).options.eventTextColor),x=p(()=>o(s).options.theme),D=p(()=>t.chunk.event),w=p(()=>t.chunk.event.display),S=p(()=>o(D).backgroundColor??el(t.chunk.resource??Ma(o(D),o(l)))??o(h)??o(f)),B=p(()=>o(D).textColor??tl(t.chunk.resource??Ma(o(D),o(l)))??o(R)),z=p(()=>Pc(i()({"background-color":o(S),color:o(B)})).map(N=>`${N[0]}:${N[1]}`).concat(o(D).styles).join(";")),X=p(()=>{let N=[hr(o(w))?o(x).bgEvent:o(x).event];if(o(D).allDay){yt(at(G(t.chunk.start)),o(D).start)||N.push(o(x).startClipped);let J=G(t.chunk.end),fe=G(o(D).end);J.setUTCSeconds(J.getUTCSeconds()-1),fe.setUTCSeconds(fe.getUTCSeconds()-1),yt(at(J),at(fe))||N.push(o(x).endClipped)}else yt(t.chunk.start,o(D).start)||N.push(o(x).startClipped),yt(t.chunk.end,o(D).end)||N.push(o(x).endClipped);return n()(N.concat(td(o(_),o(D),o(d))))}),O=p(()=>Qc(t.chunk,o(v),o(a))),Z=p(()=>Si(o(u),()=>({event:St(o(D)),timeText:o(O),view:pr(o(d))}),()=>ed(t.chunk,o(O),o(x)),o(c).eventContent));yi(()=>{Ie(o($))&&o($)({event:St(o(D)),timeText:o(O),el:r(),view:pr(o(d))})});function U(N,J){return Ie(N)&&!Za(J)?fe=>N({event:St(o(D)),el:r(),jsEvent:fe,view:pr(o(d))}):void 0}let q=p(()=>!hr(o(w))&&U(o(g),o(w))||void 0),j=p(()=>o(q)&&Po(o(q))),se=p(()=>U(o(y),o(w))),de=p(()=>U(o(E),o(w)));var ee=tf();{let N=J=>{var fe=ef(),qe=he(fe);Wt(qe,()=>o(Z).snippet??Oe,()=>o(Z).arg),re(fe),ot(fe,()=>ur(o(Z).content,o(Z).snippet)),me(()=>Q(fe,1,Gt(o(x).eventBody))),K(J,fe)};var P=he(ee),M=J=>{var fe=it(),qe=Ze(fe);Wt(qe,()=>t.body,()=>N,()=>o(S),()=>o(B)),K(J,fe)},I=J=>{N(J)};Yt(P,J=>{t.body?J(M):J(I,-1)}),re(ee),xr(ee,J=>r(J),()=>r())}me(()=>{Q(ee,1,Gt(o(X))),Hr(ee,o(z)),st(ee,"role",o(q)?"button":void 0),st(ee,"tabindex",o(q)?0:void 0)}),Ye("click",ee,function(...N){o(q)?.apply(this,N)}),Ye("keydown",ee,function(...N){o(j)?.apply(this,N)}),on("mouseenter",ee,function(...N){o(se)?.apply(this,N)}),on("mouseleave",ee,function(...N){o(de)?.apply(this,N)}),Ye("pointerdown",ee,function(...N){t.onpointerdown?.apply(this,N)}),K(e,ee),dt()}Ut(["click","keydown","pointerdown"]);var w1=Y("<div><!></div>");var x1=Y("<time></time>");function nf(e,t){ct(t,!0);let r=Ee(t,"el",15),n=p(()=>We("state")),i=p(()=>o(n).iClasses),s=p(()=>o(n).interaction.action),a=p(()=>o(n).interaction.resizer),l=p(()=>We("view-state")),c=p(()=>o(l).snap),d=p(()=>t.chunk.event),v=p(()=>t.chunk.event.display),h=p(()=>g=>o(i)(g,o(d)));function f(g){return o(s)?.draggable(g)?$=>o(s).drag(g,$,t.forceDate,t.forceMargin,o(c)):o(s)?.noAction}let u=p(()=>!hr(o(v))&&!Za(o(v))?f(o(d)):void 0);rf(e,{get chunk(){return t.chunk},get classes(){return o(h)},get styles(){return t.styles},get onpointerdown(){return o(u)},get el(){return r()},set el($){r($)},body:($,_=Oe)=>{var y=it(),E=Ze(y),R=D=>{var w=it(),S=Ze(w);On(S,()=>o(a),(B,z)=>{z(B,{get chunk(){return t.chunk},get axis(){return t.axis},get forceDate(){return t.forceDate},get forceMargin(){return t.forceMargin},children:(X,O)=>{var Z=it(),U=Ze(Z);Wt(U,_),K(X,Z)},$$slots:{default:!0}})}),K(D,w)},x=D=>{var w=it(),S=Ze(w);Wt(S,_),K(D,w)};Yt(E,D=>{o(a)?D(R):D(x,-1)}),K($,y)},$$slots:{body:!0}}),dt()}var of=Y("<span><!></span>"),sf=Y('<a role="button" tabindex="0" aria-haspopup="dialog"><!></a>'),af=Y("<div><time><!></time> <!></div> <div><!></div>",1);function lf(e,t){ct(t,!0);let r=We("state"),n=We("view-state");p(()=>r.features);let i=p(()=>r.snippets),s=p(()=>r.options.date),a=p(()=>r.options.firstDay),l=p(()=>r.options.moreLinkContent),c=p(()=>r.options.theme),d=p(()=>r.options.weekNumbers),v=p(()=>r.options.weekNumberContent),h=p(()=>n.hiddenChunks),f=p(()=>n.intlDayCell),u=p(()=>t.day.dayStart),g=p(()=>t.day.disabled),$=p(()=>t.day.highlight),_=p(()=>o(u).getUTCMonth()!==o(s).getUTCMonth()),y=p(()=>S=>[...S,o(_)&&o(c).otherMonth]),E=p(()=>o(d)&&o(u).getUTCDay()===(o(a)?1:0)),R=p(()=>o(E)?Wc(Va(o(u),o(a)),o(u),o(v),o(i).weekNumberContent):{}),x=p(()=>o(h).get(o(u).getTime())),D=p(()=>{if(!o(x))return{};let S=o(x).length,B="+"+S+" more";return Si(o(l),()=>({num:S,text:B}),B,o(i).moreLinkContent)});function w(){n.popupDay=t.day}Qd(e,{get date(){return o(u)},allDay:!0,get classes(){return o(y)},get disabled(){return o(g)},get highlight(){return o($)},get noIeb(){return t.noIeb},get noBeb(){return t.noBeb},defaultContent:()=>o(f).format(o(u)),content:(B,z=Oe)=>{var X=af(),O=Ze(X),Z=he(O),U=he(Z);Wt(U,()=>z().snippet??Oe,()=>z().arg),re(Z),ot(Z,()=>ur(z().content,z().snippet));var q=mt(Z,2),j=P=>{var M=of(),I=he(M);Wt(I,()=>o(R).snippet??Oe,()=>o(R).arg),re(M),ot(M,()=>ur(o(R).content,o(R).snippet)),me(()=>Q(M,1,o(c).weekNumber)),K(P,M)};Yt(q,P=>{o(E)&&P(j)}),re(O);var se=mt(O,2),de=he(se),ee=P=>{var M=sf(),I=p(()=>No(w)),N=p(()=>Po(w)),J=p(No),fe=he(M);Wt(fe,()=>o(D).snippet??Oe,()=>o(D).arg),re(M),ot(M,()=>ur(o(D).content,o(D).snippet)),Ye("click",M,function(...qe){o(I)?.apply(this,qe)}),Ye("keydown",M,function(...qe){o(N)?.apply(this,qe)}),Ye("pointerdown",M,function(...qe){o(J)?.apply(this,qe)}),K(P,M)};Yt(de,P=>{o(x)&&P(ee)}),re(se),me(P=>{Q(O,1,o(c).dayHead),st(Z,"datetime",P),Q(se,1,o(c).dayFoot)},[()=>Er(o(u),10)]),K(B,X)},$$slots:{content:!0}}),dt()}Ut(["click","keydown","pointerdown"]);function Ei(e,t){ct(t,!0);let r=Ee(t,"inPopup",3,!1),n=p(()=>We("state")),i=p(()=>o(n).options.dayMaxEvents),s=p(()=>o(n).options.eventGap),a=p(()=>We("view-state")),l=p(()=>o(a).colsCount),c=p(()=>o(a).gridEl),d=p(()=>o(a).hiddenChunks),v=p(()=>o(a).popupDay),h=H(void 0),f=H(1),u=H(!1),g=p(()=>t.chunk.event),$=p(()=>t.chunk.event.display),_=p(()=>o(c).children.item((t.chunk.gridRow-1)*o(l)+t.chunk.gridColumn-1));ht(()=>{r()||b(f,Mn(o(_).firstElementChild)||1,!0)});let y=p(()=>w=>{if(w["grid-column"]=`${t.chunk.gridColumn} / span ${t.chunk.dates.length}`,w["grid-row"]=t.chunk.gridRow,!hr(o($))){let S=r()?1:o(f);if(o(g)._margin){let[B,z]=o(g)._margin;B>S&&t.chunk.gridRow===z&&(S=B)}w["margin-block-start"]=`${S}px`}return o(u)&&(w.visibility="hidden"),w});function E(){b(f,ad(t.chunk,Mn(o(h)),Mn(o(_).firstElementChild)||1,o(s)),!0)}function R(){if(o(i)===!0){let w=Mn(o(_))-x(o(_));if(b(u,t.chunk.bottom>w),o(u))for(let S of t.chunk.dates){let B=S.getTime();if(o(d).has(B)){let z=o(d).get(B);z.includes(t.chunk)||o(d).set(B,[...z,t.chunk])}else o(d).set(B,[t.chunk])}}else b(u,!1),o(d).size&&o(d).clear()}function x(w){let S=0;for(let B=0;B<t.chunk.dates.length&&(S=cn(S,Mn(w.lastElementChild)),w=w.nextElementSibling,!!w);++B);return S}var D={reposition:E,hide:R};{let w=p(()=>r()&&o(v).dayStart),S=p(()=>[o(f),t.chunk.gridRow]);nf(e,{get chunk(){return t.chunk},get styles(){return o(y)},axis:"x",get forceDate(){return o(w)},get forceMargin(){return o(S)},get el(){return o(h)},set el(B){b(h,B,!0)}})}return dt(D)}var cf=Y('<dialog closedby="closerequest"><header><time></time>  <a role="button" tabindex="0">&times;</a></header> <div></div></dialog>');function df(e,t){ct(t,!0);let r=We("view-state"),n=p(()=>We("state")),i=p(()=>o(n).interaction),s=p(()=>o(n).options.buttonText),a=p(()=>o(n).options.theme),l=p(()=>r.colsCount),c=p(()=>r.chunks),d=p(()=>r.gridEl),v=p(()=>r.intlDayPopover),h=p(()=>r.popupDay),f=H(void 0),u=H(""),g=p(()=>o(h).gridColumn),$=p(()=>o(h).gridRow),_=p(()=>o(h).dayStart),y=p(()=>o(h).dayEnd),E=p(()=>{let q=[];for(let j of o(c))j.gridRow===o($)&&j.gridColumn<=o(g)&&j.gridColumn+j.dates.length>o(g)&&q.push(Ne({},j,Ai(j.event,o(_),o(y))));return q.sort((j,se)=>j.top-se.top),q});yi(()=>{o(f).show()}),ht(()=>{o(E).length?T(R):x()});function R(){let q=o(d).children.item((o($)-1)*o(l)+o(g)-1),j=xi(o(f)),se=xi(q),de=xi(o(d));b(u,"");let ee;if(j.width>=de.width){ee=de.left-se.left;let M=se.right-de.right;b(u,o(u)+`inset-inline-end:${M}px;`)}else ee=(se.width-j.width)/2,se.left+ee<de.left?ee=de.left-se.left:se.left+ee+j.width>de.right&&(ee=de.right-se.left-j.width);b(u,o(u)+`inset-inline-start:${ee}px;`);let P;j.height>=de.height?(P=de.top-se.top,b(u,o(u)+`block-size:${de.height}px;`)):(P=(se.height-j.height)/2,se.top+P<de.top?P=de.top-se.top:se.top+P+j.height>de.bottom&&(P=de.bottom-se.top-j.height)),b(u,o(u)+`inset-block-start:${P}px;`)}function x(){r.popupDay=null}function D(){x(),o(i).action?.noClick()}var w=cf();let S;var B=he(w),z=he(B);ot(z,()=>ur(o(v).format(o(_))));var X=mt(z,2);ri(X,!0);var O=p(()=>No(x)),Z=p(()=>Po(x));re(B);var U=mt(B,2);bt(U,21,()=>o(E),qt,(q,j)=>{Ei(q,{get chunk(){return o(j)},inPopup:!0})}),re(U),re(w),xr(w,q=>b(f,q),()=>o(f)),ot(w,()=>Mc("pointerdown")),me(q=>{Q(w,1,o(a).popup),S=Hr(w,o(u),S,{"grid-area":`${o($)+1} / ${o(g)}`}),Q(B,1,o(a).dayHead),st(z,"datetime",q),st(X,"aria-label",o(s).close),Q(U,1,o(a).events)},[()=>Er(o(_),10)]),on("pointerdownoutside",w,D),on("close",w,x),Ye("click",X,function(...q){o(O)?.apply(this,q)}),Ye("keydown",X,function(...q){o(Z)?.apply(this,q)}),K(e,w),dt()}Ut(["click","keydown"]);var ff=Y('<div role="columnheader"><span></span></div>'),uf=Y('<section><header><div role="row"></div></header> <div><div></div> <div><!> <!> <!></div></div> <!></section>');function Oo(e,t){ct(t,!0);let r=We("state"),n=new Zd(r);Jn("view-state",n);let i=p(()=>r.intlDayHeader),s=p(()=>r.intlDayHeaderAL),a=p(()=>r.options.dayMaxEvents),l=p(()=>r.options.eventGap),c=p(()=>r.options.theme),d=p(()=>n.grid),v=p(()=>n.chunks),h=p(()=>n.bgChunks),f=p(()=>n.iChunks),u=p(()=>n.hiddenChunks),g=p(()=>n.popupDay),$=[];function _(){nd($,o(v)),o(u).clear(),yr().then(y)}function y(){o(u).size,$.forEach(w=>w?.hide())}ht(()=>{o(l),_()}),ht(y);var E=it(),R=Ze(E),x=w=>{var S=uf();let B;var z=he(S),X=he(z);bt(X,21,()=>o(d)[0],qt,(P,M,I)=>{let N=()=>o(M).dayStart;var J=ff();st(J,"aria-colindex",1+I);var fe=he(J);ot(fe,()=>ur(o(i).format(N()))),re(J),me((qe,hn)=>{Q(J,1,qe),st(fe,"aria-label",hn)},[()=>Gt([o(c).colHead,o(c).weekdays?.[N().getUTCDay()]]),()=>o(s).format(N())]),K(P,J)}),re(X),re(z);var O=mt(z,2),Z=he(O);bt(Z,21,()=>o(d),qt,(P,M,I)=>{var N=it(),J=Ze(N);bt(J,17,()=>o(M),qt,(fe,qe,hn)=>{{let W=p(()=>hn+1===Ln(o(M))),ue=p(()=>I+1===Ln(o(d)));lf(fe,{get day(){return o(qe)},get noIeb(){return o(W)},get noBeb(){return o(ue)}})}}),K(P,N)}),re(Z),xr(Z,P=>n.gridEl=P,()=>n?.gridEl);var U=mt(Z,2),q=he(U);bt(q,19,()=>o(v),P=>P.id,(P,M,I)=>{xr(Ei(P,{get chunk(){return o(M)}}),(N,J)=>$[J]=N,N=>$?.[N],()=>[o(I)])});var j=mt(q,2);bt(j,17,()=>o(h),P=>P.id,(P,M)=>{Ei(P,{get chunk(){return o(M)}})});var se=mt(j,2);bt(se,17,()=>o(f),qt,(P,M)=>{Ei(P,{get chunk(){return o(M)}})}),re(U),re(O);var de=mt(O,2),ee=P=>{df(P,{})};Yt(de,P=>{o(g)&&P(ee)}),re(S),xr(S,P=>r.mainEl=P,()=>r?.mainEl),ot(S,()=>Lc(_)),me(P=>{Q(S,1,Gt([o(c).main,o(a)===!0&&o(c).uniform])),B=Hr(S,"",B,P),Q(z,1,o(c).header),Q(X,1,o(c).grid),Q(O,1,o(c).body),Q(Z,1,o(c).grid),Q(U,1,o(c).events)},[()=>({"--ec-grid-cols":Ln(o(d)[0]),"--ec-grid-rows":Ln(o(d))})]),K(w,S)},D=p(()=>!dn(o(d))&&!dn(o(d)[0]));Yt(R,w=>{o(D)&&w(x)}),K(e,E),dt()}var al={createOptions(e){Wd(e),Ne(e,{dayMaxEvents:!1,dayCellFormat:{day:"numeric"},dayPopoverFormat:{month:"long",day:"numeric",year:"numeric"},moreLinkContent:void 0,view:"dayGridMonth"}),Ne(e.buttonText,{dayGridDay:"day",dayGridMonth:"month",dayGridWeek:"week",close:"Close"}),Ne(e.theme,{uniform:"ec-uniform",dayFoot:"ec-day-foot",otherMonth:"ec-other-month",popup:"ec-popup"}),Ne(e.views,{dayGridDay:{buttonText:dd,component:()=>Oo,dayHeaderFormat:{weekday:"long"},displayEventEnd:!1,duration:{days:1},theme:To("ec-day-grid ec-day-view")},dayGridWeek:{buttonText:fd,component:()=>Oo,displayEventEnd:!1,theme:To("ec-day-grid ec-week-view")},dayGridMonth:{buttonText:ud,component:pf,dayHeaderFormat:{weekday:"short"},dayHeaderAriaLabelFormat:{weekday:"long"},displayEventEnd:!1,duration:{months:1},theme:To("ec-day-grid ec-month-view"),titleFormat:{year:"numeric",month:"long"}}})}};function pf(e){return e.features=["dayNumber"],e.extensions.activeRange=(t,r)=>{let{options:{firstDay:n}}=e;return{start:za(t,n),end:Yc(r,n)}},Oo}var E1=Y("<div></div>"),k1=Y("<!> <!> <!>",1);Ut(["pointerdown"]);var T1=Y("<!> <!>",1);var C1=Y("<div></div> <!>",1);var D1=Y("<h4><time><!></time> <time></time></h4> <!>",1);var S1=Y("<div><!></div>"),A1=Y("<section><!></section>");Ut(["click"]);function Mo(e,t,r=!0){let n=[];for(let{gridColumn:i,gridRow:s,resource:a,start:l,end:c,disabled:d}of t)if(!d&&Fn(e,l,c,a)){let v=Ai(e,l,c);Ne(v,{gridColumn:i,gridRow:s,resource:a,top:(v.start-l)/1e3,height:(v.end-v.start)/1e3,maxHeight:(c-v.start)/1e3}),r&&Bo(v),n.push(v)}return n}function hf(e){let t={};for(let r of e){let{gridColumn:n}=r,i=t[n],s=0;if(i&&r.start<i.end){for(;s<i.columns.length&&!(i.columns[s].at(-1).end<=r.start);++s);r.end>i.end&&(i.end=r.end)}else i={columns:[],end:r.end};i.columns.length<s+1&&i.columns.push([]),i.columns[s].push(r),t[n]=i,r.group=i,r.groupColumn=s}}function vf(e,t){return()=>{let{viewDates:r,options:{highlightedDates:n,validRange:i}}=e,{slotTimeLimits:s}=t,a=[];return T(()=>{let l=1;for(let c of r)a.push({gridColumn:l,gridRow:1,resource:void 0,start:Je(G(c),s.min),end:Je(G(c),s.max),dayStart:c,dayEnd:er(G(c)),disabled:Hn(c,i),highlight:n.some(d=>yt(d,c))}),++l}),[a]}}function gf(e,t){return()=>{let{filteredEvents:r}=e,{grid:n}=t,i=[],s=[],a=[],l=[];return T(()=>{for(let c of r)for(let d of n)hr(c.display)?(s=s.concat(Mo(c,d)),c.allDay&&(l=l.concat(fn(c,d)))):c.allDay?a=a.concat(fn(c,d)):i=i.concat(Mo(c,d));hf(i),Ja(a)}),{chunks:i,bgChunks:s,allDayChunks:a,allDayBgChunks:l}}}function _f(e,t){return()=>{let{iEvents:r}=e,{grid:n}=t,i=[],s=[];for(let[,a]of r)a&&T(()=>{for(let l of n)a.allDay?s=s.concat(fn(a,l,!1)):i=i.concat(Mo(a,l,!1))});return{iChunks:i,allDayIChunks:s}}}function mf(e){return()=>{let{filteredEvents:t,viewDates:r,options:{flexibleSlotTimeLimits:n,slotMinTime:i,slotMaxTime:s}}=e,a;return T(()=>{a=nl(i,s,n,r,t)}),a}}function $f(e){return()=>{let{options:{slotDuration:t,slotLabelInterval:r}}=e,n;return T(()=>{n=r===void 0?Re(t)<3600?2:1:Hc(Re(r)/Re(t))||1}),n}}function bf(e,t){return()=>{let{offset:r,options:{slotDuration:n}}=e,{intlSlotLabel:i,slotLabelPeriodicity:s,slotTimeLimits:a}=t,l;return T(()=>{l=rl(at(At(void 0,r)),n,s,a,i)}),l}}function yf(e){return()=>{let{options:{slotDuration:t,snapDuration:r}}=e;return r??=t,{duration:r,ratio:Re(r)/Re(t)}}}function qo(){return class{#e;get intlSlotLabel(){return o(this.#e)}set intlSlotLabel(e){b(this.#e,e)}#r;get slotLabelPeriodicity(){return o(this.#r)}set slotLabelPeriodicity(e){b(this.#r,e)}#t;get sidebarWidth(){return o(this.#t)}set sidebarWidth(e){b(this.#t,e,!0)}#n;get snap(){return o(this.#n)}set snap(e){b(this.#n,e)}constructor(e){this.#e=p(un(e,"slotLabelFormat")),this.#r=p($f(e)),this.#t=H(0),this.#n=p(yf(e))}}}function ll(e){return class extends e{#e;get slotTimeLimits(){return o(this.#e)}set slotTimeLimits(t){b(this.#e,t)}#r;get slots(){return o(this.#r)}set slots(t){b(this.#r,t)}#t;get chunks(){return o(this.#t)}set chunks(t){b(this.#t,t)}#n;get bgChunks(){return o(this.#n)}set bgChunks(t){b(this.#n,t)}#i;get allDayChunks(){return o(this.#i)}set allDayChunks(t){b(this.#i,t)}#s;get allDayBgChunks(){return o(this.#s)}set allDayBgChunks(t){b(this.#s,t)}#o;get iChunks(){return o(this.#o)}set iChunks(t){b(this.#o,t)}#l;get allDayIChunks(){return o(this.#l)}set allDayIChunks(t){b(this.#l,t)}constructor(t){super(t),this.#e=p(mf(t)),this.#r=p(bf(t,this));let r=p(gf(t,this)),n=p(()=>o(r).chunks),i=p(()=>o(r).bgChunks),s=p(()=>o(r).allDayChunks),a=p(()=>o(r).allDayBgChunks);this.#t=p(()=>o(n)),this.#n=p(()=>o(i)),this.#i=p(()=>o(s)),this.#s=p(()=>o(a));let l=p(_f(t,this)),c=p(()=>o(l).iChunks),d=p(()=>o(l).allDayIChunks);this.#o=p(()=>o(c)),this.#l=p(()=>o(d))}}}var R1=class extends ll(qo()){#e;get grid(){return o(this.#e)}set grid(e){b(this.#e,e)}constructor(e){super(e),this.#e=p(vf(e,this))}};function wf(e){return()=>{let{activeRange:t,filteredEvents:r,resources:n,options:{filterResourcesWithEvents:i},extensions:{viewResources:s}}=e,a=s?s(n):n;return T(()=>{i&&(a=n.filter(l=>r.some(c=>!hr(c.display)&&Fn(c,t.start,t.end,l)))),a.length||(a=Yo([{}]))}),a}}function xf(e,t){return()=>{let{viewDates:r,options:{datesAboveResources:n,highlightedDates:i,validRange:s}}=e,{slotTimeLimits:a,viewResources:l}=t,c=[];return T(()=>{let d=1,v=n?[r,l]:[l,r];for(let h of v[0]){let f=[];for(let u of v[1]){let g=n?h:u,$=n?u:h;f.push({gridColumn:d,gridRow:1,resource:$,start:Je(G(g),a.min),end:Je(G(g),a.max),dayStart:g,dayEnd:er(G(g)),disabled:Hn(g,s),highlight:i.some(_=>yt(_,g))}),++d}c.push(f)}}),c}}function cl(e){return class extends e{#e;get viewResources(){return o(this.#e)}set viewResources(t){b(this.#e,t)}constructor(t){super(t),this.#e=p(wf(t))}}}var N1=class extends cl(ll(qo())){#e;get grid(){return o(this.#e)}set grid(e){b(this.#e,e)}constructor(e){super(e),this.#e=p(xf(e,this))}},I1=Y("<span><!></span>");var O1=Y("<div></div>");var M1=Y('<div><aside><!></aside> <div role="row"></div> <div><!> <!> <!></div></div>'),L1=Y("<div><time></time></div>"),P1=Y('<section><header><aside></aside> <div role="row"><!></div> <!></header> <div role="rowgroup"><aside aria-hidden="true"></aside> <div role="row"></div> <div><!> <!> <!></div></div> <!></section>');var F1=Y("<!> <!>",1);function Lo(e,t,r,n=!0){let i=[],s,a,l,c,d,v,h=0;for(let{gridColumn:f,gridRow:u,resource:g,dayStart:$,dayEnd:_,start:y,end:E,disabled:R}of t)R||(r?Fn(e,$,_,g)&&(i.length||(s=$,l=f,c=u,d=g),i.push($),a=_):Fn(e,y,E,g)&&(i.length||(s=y,l=f,c=u,d=g,v=cn(e.start-y,0)/1e3),i.push($),a=E,h+=(So(E,e.end)-cn(y,e.start))/1e3));if(i.length){let f=Ai(e,s,a);return Ne(f,{gridColumn:l,gridRow:c,resource:d,dates:i,left:v,width:h}),n&&Bo(f),[f]}return[]}function Ef(e,t){let r={};for(let n=0;n<e.length;++n){let i=e[n],{gridColumn:s,gridRow:a}=i;i.order=n;for(let l=0;l<i.dates.length;++l){let c=`${a}_${s+l}`;r[c]?r[c].push(i):r[c]=[i]}i.day=r[`${a}_${s}`]}if(t)for(let n of e){let{gridColumn:i,gridRow:s}=n,a=new Set([n]),l=[];for(let c=0;c<n.dates.length;++c)for(let d of r[`${s}_${i+c}`])a.has(d)||(a.add(d),l.push(d));n.group=l}}function kf(e,t){return()=>{let{viewDates:r,options:{highlightedDates:n,validRange:i}}=e,{dayTimeLimits:s,viewResources:a}=t,l=[];return T(()=>{let c=1;for(let d of a){let v=[],h=1;for(let f of r){let u=s[f.getTime()];v.push({gridColumn:h,gridRow:c,resource:d,start:Je(G(f),u.min),end:Je(G(f),u.max),dayStart:f,dayEnd:er(G(f)),disabled:Hn(f,i),highlight:n.some(g=>yt(g,f))}),++h}l.push(v),++c}}),l}}function Tf(e,t){return()=>{let{features:r,options:{firstDay:n,weekNumbers:i}}=e,{grid:s}=t,a=[],l=[];return T(()=>{let c,d;if(!dn(s)){for(let{dayStart:v,gridColumn:h}of s[0])if(r.includes("month")&&(c&&c.date.getUTCMonth()===v.getUTCMonth()?++c.span:(c={date:v,gridColumn:h,span:1},a.push(c))),i){let f=Va(v,n);d&&d.number===f?++d.span:(d={number:f,date:v,gridColumn:h,span:1},l.push(d))}}}),{months:a,weeks:l}}}function Cf(e,t){return()=>{let{filteredEvents:r,options:{eventOrderStrict:n}}=e,{grid:i,monthView:s}=t,a=[],l=[];return T(()=>{for(let c of r)for(let d of i)hr(c.display)?(!s||c.allDay)&&(l=l.concat(Lo(c,d,s))):a=a.concat(Lo(c,d,s));Ef(a,n)}),{chunks:a,bgChunks:l}}}function Df(e,t){return()=>{let{iEvents:r}=e,{grid:n,monthView:i}=t,s=[];for(let[,a]of r)a&&T(()=>{for(let l of n)s=s.concat(Lo(a,l,i,!1))});return s}}function Sf(e){return()=>{let{filteredEvents:t,viewDates:r,options:{flexibleSlotTimeLimits:n,slotMinTime:i,slotMaxTime:s}}=e,a={};return T(()=>{for(let l of r)a[l.getTime()]=nl(i,s,n,[l],t)}),a}}function Af(e,t){return()=>{let{viewDates:r,options:{slotDuration:n}}=e,{dayTimeLimits:i,intlSlotLabel:s,slotLabelPeriodicity:a}=t,l={};return T(()=>{for(let c of r){let d=c.getTime();l[d]=d in i?rl(c,n,a,i[d],s):[]}}),l}}function Rf(e){return()=>{let{resources:t}=e,r;return T(()=>{r=t.some(n=>ja(n).children.length)}),r}}function Nf(e){return()=>{let{options:{slotDuration:t}}=e,r;return T(()=>{r=!Re(t)}),r}}var H1=class extends cl(qo()){#e;get dayTimeLimits(){return o(this.#e)}set dayTimeLimits(e){b(this.#e,e)}#r;get daySlots(){return o(this.#r)}set daySlots(e){b(this.#r,e)}#t;get grid(){return o(this.#t)}set grid(e){b(this.#t,e)}#n;get extraHeads(){return o(this.#n)}set extraHeads(e){b(this.#n,e)}#i;get intlMonthHeader(){return o(this.#i)}set intlMonthHeader(e){b(this.#i,e)}#s;get monthView(){return o(this.#s)}set monthView(e){b(this.#s,e)}#o;get chunks(){return o(this.#o)}set chunks(e){b(this.#o,e)}#l;get bgChunks(){return o(this.#l)}set bgChunks(e){b(this.#l,e)}#a;get iChunks(){return o(this.#a)}set iChunks(e){b(this.#a,e)}#u;get nestedResources(){return o(this.#u)}set nestedResources(e){b(this.#u,e)}constructor(e){super(e),this.#e=p(Sf(e)),this.#r=p(Af(e,this)),this.#t=p(kf(e,this)),this.#n=p(Tf(e,this)),this.#i=p(un(e,"monthHeaderFormat")),this.#s=p(Nf(e));let t=p(Cf(e,this)),r=p(()=>o(t).chunks),n=p(()=>o(t).bgChunks);this.#o=p(()=>o(r)),this.#l=p(()=>o(n)),this.#a=p(Df(e,this)),this.#u=p(Rf(e))}};var z1=Y("<span></span>"),U1=Y("<button></button>"),B1=Y("<!> <span><!></span>",1);Ut(["click"]);var V1=Y("<div></div>");var Y1=Y("<time></time>"),q1=Y("<span><!></span>"),W1=Y("<div><time></time></div>"),G1=Y('<div role="rowheader"><!> <!></div>'),j1=Y('<section><header><aside></aside> <div role="row"><!> <!> <!> <!></div></header> <div role="rowgroup"><aside></aside> <div role="row"></div> <div><!> <!> <!></div></div> <!></section>');function dl(e,t,r){return sn(qd,{target:e,props:{plugins:t,options:r}})}function fl(e){return Rn(e)}var ul=`/*!
 * EventCalendar v5.12.0
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
    min-block-size: 1.5em;

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
        grid-template-columns: max-content repeat(var(--ec-grid-cols), min-content);
        grid-template-rows: max-content var(--ec-grid-rows);
        flex-grow: 1;
    }

    .ec-timeline:is(.ec-month-view, .ec-year-view) & {
        grid-template-columns: max-content repeat(var(--ec-grid-cols), var(--ec-col-width));
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
/*$vite$:1*/`;var lC=ul;function pl(e,t){if(e)return t==="UTC"&&!zn(e)?`${e}Z`:e}function Of(e){return e.flatMap(t=>{let r=pl(t.startDate,t.timezone);if(!r)return[];let n=zn(t.startDate),i=(n&&t.endDate?Ri(t.endDate,1):pl(t.endDate,t.timezone))??r;return[{title:t.name,start:r,end:i,allDay:n,extendedProps:{previewEvent:t}}]})}function Mf(e){let t=e==="es"?"es-ES":"en-US";return{locale:t,firstDay:e==="es"?1:0,buttonText:e==="es"?{prev:"Mes anterior",next:"Mes siguiente"}:{prev:"Previous month",next:"Next month"},titleFormat:r=>Lf(new Intl.DateTimeFormat(t,{month:"long",year:"numeric"}).format(r)),dayHeaderFormat:{weekday:"short"},dayHeaderAriaLabelFormat:{weekday:"long"},eventTimeFormat:{hour:"numeric",minute:"2-digit"}}}function Lf(e){return e.charAt(0).toLocaleUpperCase()+e.slice(1)}function cC(e,t,r){let n=dl(e,[al],{...Mf(r.lang),view:"dayGridMonth",events:Of(t),height:"auto",headerToolbar:{start:"title",center:"",end:"prev,next"},eventClick(i){let s=i.event.extendedProps.previewEvent;s&&r.onEventClick(s)}});return{destroy(){fl(n)}}}export{lC as CALENDAR_CSS,Mf as calendarLocaleOptions,cC as renderCalendar};
/*! Bundled license information:

@event-calendar/core/dist/index.js:
  (*!
   * EventCalendar v5.12.0
   * https://github.com/vkurko/calendar
   *)
*/
//# sourceMappingURL=calendar-layout.js.map
