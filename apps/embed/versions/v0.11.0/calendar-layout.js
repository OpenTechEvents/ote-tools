function Oi(e){return e!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function Lo(e,t){let r=new Date(`${e}T00:00:00Z`);return r.setUTCDate(r.getUTCDate()+t),r.toISOString().slice(0,10)}var _a=globalThis.process?.env?.NODE_ENV,$=_a&&!_a.toLowerCase().startsWith("prod");var Er=Array.isArray,ga=Array.prototype.indexOf,kr=Array.prototype.includes,wn=Array.from,Po=Object.keys,We=Object.defineProperty,It=Object.getOwnPropertyDescriptor,Fo=Object.getOwnPropertyDescriptors,zo=Object.prototype,ma=Array.prototype,xn=Object.getPrototypeOf,Ho=Object.isExtensible;var me=()=>{};function Ii(e){for(var t=0;t<e.length;t++)e[t]()}function Mi(){var e,t,r=new Promise((n,i)=>{e=n,t=i});return{promise:r,resolve:e,reject:t}}var Et=Symbol("$state"),Li=Symbol("component"),Xn=Symbol("legacy props"),$a=Symbol(""),Pi=Symbol("proxy path"),Fi=Symbol("attributes"),Jn=Symbol("class"),Qn=Symbol("style"),ei=Symbol("text");var Uo=Symbol("hmr anchor"),En=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},Bo=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml"),ti=1,on=3,kt=8,zi=11,ya={fragment:zi,element:ti,text:on,comment:kt};var Yt={};var de=Symbol("uninitialized"),Zt=Symbol("filename");var Hi="http://www.w3.org/1999/xhtml";var Hr="font-weight: bold",Ur="font-weight: normal";function ba(e){$?console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${e}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,Hr,Ur):console.warn("https://svelte.dev/e/await_reactivity_loss")}function wa(e,t){$?console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${e}\` (${t}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,Hr,Ur):console.warn("https://svelte.dev/e/await_waterfall")}function xa(){$?console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,Hr,Ur):console.warn("https://svelte.dev/e/derived_inert")}function Ea(e,t,r){$?console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${e}\` attribute on \`${t}\` changed its value between server and client renders. The client value, \`${r}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,Hr,Ur):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function sn(e){$?console.warn(`%c[svelte] hydration_mismatch
%c${e?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${e}`:"Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,Hr,Ur):console.warn("https://svelte.dev/e/hydration_mismatch")}function ka(){$?console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,Hr,Ur):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function Ui(e){$?console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${e}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,Hr,Ur):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function Ta(){$?console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",Hr,Ur):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var S=!1;function be(e){S=e}var B;function le(e){if(e===null)throw sn(),Yt;return B=e}function ot(){return le(Ie(B))}function se(e){if(S){if(Ie(B)!==null)throw sn(),Yt;B=e}}function Vo(e=1){if(S){for(var t=e,r=B;t--;)r=Ie(r);B=r}}function rr(e=!0){for(var t=0,r=B;;){if(Me(r)===kt){var n=Tt(r)??"";if(n==="]"){if(t===0)return r;t-=1}else(n==="["||n==="[!"||n.startsWith("[?")||n[0]==="["&&!isNaN(Number(n.slice(1))))&&(t+=1)}var i=Ie(r);e&&Tr(r),r=i}}function Br(e){if(!e||Me(e)!==kt)throw sn(),Yt;return Tt(e)??""}function Vi(e){return e===this.v}function Yo(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function Yi(e){return!Yo(e,this.v)}function Ca(e){if($){let t=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${e}"
https://svelte.dev/e/invariant_violation`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invariant_violation")}function ri(e){if($){let t=new Error(`lifecycle_outside_component
\`${e}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function Da(){if($){let e=new Error("set_context_after_init\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\nhttps://svelte.dev/e/set_context_after_init");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/set_context_after_init")}function qi(e){if($){let t=new Error(`custom_renderer_unsupported_operation
\`${e}\` is not supported when rendering with a custom renderer
https://svelte.dev/e/custom_renderer_unsupported_operation`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/custom_renderer_unsupported_operation")}function Ra(){if($){let e=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/derived_references_self")}function qo(e,t,r){if($){let n=new Error(`each_key_duplicate
${r?`Keyed each block has duplicate key \`${r}\` at indexes ${e} and ${t}`:`Keyed each block has duplicate key at indexes ${e} and ${t}`}
https://svelte.dev/e/each_key_duplicate`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function Aa(e,t,r){if($){let n=new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${e} was \`${t}\` but is now \`${r}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_volatile")}function Na(e){if($){let t=new Error(`effect_in_teardown
\`${e}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function Oa(){if($){let e=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function Ia(e){if($){let t=new Error(`effect_orphan
\`${e}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_orphan")}function Ma(){if($){let e=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function La(){if($){let e=new Error("get_abort_signal_after_await\n`getAbortSignal()` cannot be called after an `await`\nhttps://svelte.dev/e/get_abort_signal_after_await");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/get_abort_signal_after_await")}function Pa(){if($){let e=new Error("get_abort_signal_outside_reaction\n`getAbortSignal()` can only be called inside an effect or derived\nhttps://svelte.dev/e/get_abort_signal_outside_reaction");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/get_abort_signal_outside_reaction")}function Fa(){if($){let e=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/hydration_failed")}function za(){if($){let e=new Error("invalid_snippet\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\nhttps://svelte.dev/e/invalid_snippet");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invalid_snippet")}function Ha(e){if($){let t=new Error(`props_invalid_value
Cannot do \`bind:${e}={undefined}\` when \`${e}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_invalid_value")}function Ua(e){if($){let t=new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${e}\` are readonly
https://svelte.dev/e/props_rest_readonly`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function Ba(e){if($){let t=new Error(`rune_outside_svelte
The \`${e}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function Va(){if($){let e=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function Ya(){if($){let e=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function qa(){if($){let e=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function Ga(){if($){let e=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var Pe=!1,Cr=!1,nr=!1,ie=!1;var an=[];function ja(){var e=an;an=[],Ii(e)}function Se(e){if(an.length===0&&!ln){var t=an;queueMicrotask(()=>{t===an&&ja()})}an.push(e)}function Za(){for(;an.length>0;)ja()}var kd=-7169;function Re(e,t){e.f=e.f&kd|t}function Vr(e){(e.f&512)!==0||e.edges===null?Re(e,1024):Re(e,4096)}function ir(e){let t=new Error,r=Td();return r.length===0?null:(r.unshift(`
`),We(t,"stack",{value:r.join(`
`)}),We(t,"name",{value:e}),t)}function Td(){let e=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let t=new Error().stack;if(Error.stackTraceLimit=e,!t)return[];let r=t.split(`
`),n=[];for(let i=0;i<r.length;i++){let o=r[i],a=o.replaceAll("\\","/");if(o.trim()!=="Error"){if(o.includes("validate_each_keys"))return[];a.includes("svelte/src/internal")||a.includes("node_modules/.vite")||n.push(o)}}return n}function Gi(e,t){if(!$)throw new Error("invariant(...) was not guarded by if (DEV)");e||Ca(t)}function Cd(e){let t=e.p;for(;t!==null&&t.c===null;)t=t.p;return t?.c??null}function Go(e,t){return e===null&&ri(t),e.c??=new Map(Cd(e)||void 0)}var q=null;function Dr(e){q=e}var Mt=null;function Dn(e){Mt=e}var or=null;function Wi(e){or=e}function ze(e){return Go(q,"getContext").get(e)}function ni(e,t){let r=Go(q,"setContext");if(Pe){var n=R.f,i=!P&&(n&32)!==0&&!q.i;i||Da()}return r.set(e,t),t}function st(e,t=!1,r){q={p:q,i:!1,c:null,e:null,s:e,x:null,r:R,l:Cr&&!t?{s:null,u:null,$:[]}:null},$&&(q.function=r,or=r)}function at(e){var t=q,r=t.e;if(r!==null){t.e=null;for(var n of r)Wo(n)}return e!==void 0&&(t.x=e),t.i=!0,q=t.p,$&&(or=q?.function??null),ii(e)}function ii(e={}){return We(e,Li,{value:!0}),e}function sr(){return!Cr||q!==null&&q.l===null}var E=null;function jo(e){E=e}var Zi=0,ji=[];function Xe(e){var t=E;return E=e,Zi+=1,S&&e!==null&&(be(!1),ji.push(Zi)),t}function Je(e){ji[ji.length-1]===Zi&&(ji.pop(),be(!0)),Zi-=1,E=e}function Ki(e,t,r,n){var i=R,o=t.map(sr()?Yr:cn);$&&o.forEach((u,d)=>{u.label=t[d].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\$\.get\((.+?)\)/g,(v,_)=>_)});var a=e.filter(u=>!u.settled);if(a.length>0){var l=Ka(),c=Zo(),p=a.length===1?a[0].promise:Promise.all(a.map(u=>u.promise));p.then(()=>{if((i.f&16384)===0){l(a[0].run.get_batch());try{h()}catch(u){Lt(u,i)}Xi()}}).finally(c)}else h();function h(){if(!e.some(v=>v.failed)){if(r.length===0){n(o);return}var u=r.map(v=>Ja(v)),d=null;ct(()=>{for(var v of u)if(Qa(v)){s(v);return}d!==null?I.revalidate_branch(d):d=xe(()=>{try{n([...o,...u])}catch(_){Lt(_,i)}})},65536)}}}function Ka(){var e=R,t=P,r=q,n=I,i=ie?E:null;if($)var o=Mt;return function(l=n){Qe(e),He(t),Dr(r),ie&&jo(i),l!==null&&(e.f&16384)===0&&_t(l).activate(),$&&(Ko(null),Dn(o))}}var Dd=!1;function Xi(e=!0){Dd=!1,Qe(null),He(null),Dr(null),ie&&jo(null),e&&I?.deactivate(),$&&(Ko(null),Dn(null))}var Xa=null;function Zo(){for(var e=R,t=e.b,r=_t(I),n=t;n&&!n.is_pending;)n=n.parent;return r.increment(e),n?.increment(e,r),t?.update_effect_pending(1),()=>{_t(r).decrement(e),n?.decrement(e,r),t?.update_effect_pending(-1)}}function _t(e){for(;e.merged!==null;)e=e.merged;return e}function el(e){return`{${e.toString().replace(/^async \(\) => /,"").replace(/^\(/,"").replace(/\$\.get\((.+?)\)/g,(t,r)=>r).replace(/\$\.track_reactivity_loss\((.+?)\)\(\)/g,(t,r)=>r).replace(/\)$/,"")}}`}var Pt=null;function Ko(e){Pt=e}var oi=new Set;function Yr(e){var t=2050;R!==null&&(R.f|=524288);let r={ctx:q,deps:null,dv:null,edges:null,effects:null,equals:Vi,f:t,fn:e,reactions:null,rv:0,v:de,wv:0,parent:R,ac:null};return $&&nr&&(r.created=ir("created at")),r}var gr=Symbol("obsolete");function Ja(e,t,r,n){var i=je(de);i.f|=4194304,$&&(i.label=t??el(e));var o=new Set,a=Xa,l=a&&I,c=a&&[];function p(h=!1){var u=c;c=h?null:[],h&&(l=null);for(let d of u)d()}return Xo(()=>{var h=R;$&&(Pt={effect:h,effect_deps:new Set,warned:!1});var u=Mi();try{var d=e();if(d===de)return;var v=Promise.resolve(d),_=$t?.signal;v.then(x=>{_?.aborted||u.resolve(x)},x=>{_?.aborted||x===En&&a===null||u.reject(x===En?gr:x)}).finally(Xi)}catch(x){u.reject(x)}if($){if(Pt){if(h.deps!==null)for(let x=0;x<St;x+=1)Pt.effect_deps.add(h.deps[x]);if($e!==null)for(let x=0;x<$e.length;x+=1)Pt.effect_deps.add($e[x])}Pt=null}var m=I,g=Zo();m.async_deriveds.get(h)?.reject(gr),o.add(u),m.async_deriveds.set(h,u);let y=(x,T=void 0)=>{if($&&(Gi(pe===null,"Batch is currently active"),Pt=null),c!==null&&T!==gr&&(l??=m,_t(m)!==_t(l))){c.push(()=>{var k=(h.f&16384)!==0||(m.linked?m.async_deriveds.get(h)!==u:!_t(m).linked);y(x,k?gr:T)});return}if(g(),o.delete(u),T){if(c!==null&&l!==null&&(o.size>0||T===gr)&&_t(l)===_t(m)&&_t(m).async_deriveds.get(h)===u){l=null,p();return}else if(T===gr)return}var w=i.equals(x)&&!T&&(i.f&8388608)===0;_t(m).capture(i,T??x,w,!!T),a!==null&&(a.switch(m),a.continued.push(()=>p(!0)),a=null),n?.(T),n=void 0,$&&r!==void 0&&!i.equals(x)&&(oi.add(i),setTimeout(()=>{oi.has(i)&&(h.f&16384)===0&&(wa(i.label,r),oi.delete(i))}))};u.promise.then(y,x=>y(null,x||"unknown"))}),et(()=>{for(let h of o)h.reject(gr)}),i}function Qa(e){return(Q?.get(e)??e).v===de}function f(e){let t=Yr(e);return Pe||Qi(t),t}function cn(e){let t=Yr(e);return t.equals=Yi,t}function Sd(e){var t=e.effects;if(t!==null){e.effects=null;for(var r=0;r<t.length;r+=1)Ee(t[r])}}var Jo=[];function Rn(e){var t=R,r=e.parent;if(!Dt&&r!==null&&e.v!==de&&(r.f&24576)!==0)return xa(),Vr(e),e.v;$&&kr.call(Jo,e)&&Ra(),Qe(r);var n=qr;$&&(Qo(new Set),Jo.push(e));try{return Sd(e),ts(e)}finally{Qe(t),$&&(Qo(n),Jo.pop())}}function ai(e){var t=e;if(Gr(t)){var r=pe?.records,n=r?.get(t);n!==void 0&&si(n.deps,n.dv)?(r.delete(t),to(t,n)):Rn(t)}}function li(e){var t=zt,r=t.get(e);if(r!==void 0)return r;var n=pe,i=Q.get(e),o=i??e,a=i===void 0?(e.f&67108864)!==0:i.assigned,l=n.get_record(e);return a&&!eo((l??e).deps,o.wv)?r=o:l!==void 0&&si(l.deps,l.dv)?r=l:i===void 0&&!a&&e.dv!==null&&si(e.deps,e.dv)?r=e:(Rn(e),r=n.records?.get(e)??e),(e.f&512)!==0&&t.set(e,r),r}function tl(e){if(e.effects!==null)for(let t of e.effects)(t.teardown||(t.f&134217728)!==0)&&(t.teardown?.(),di(t),t.fn!==null&&(t.teardown=me),ui(t),ci(t))}function es(e){if(e.effects!==null)for(let t of e.effects)t.teardown&&t.fn!==null&&$r(t)}var yt=null,fn=null,I=null,ro=null,Ae=null;function so(e){Ae=e}function vi(e){var t=Ae={reverted_values:new Map(Ae?.reverted_values),derived_cache:new Map,parent:Ae};for(let[r,n]of e??[])t.reverted_values.set(r,n);return t}function os(e){for(var t=Ae;t!==null;t=t.parent)t.reverted_values.delete(e),t.derived_cache.clear()}var Q=null,zt=null,pe=null,ns=null,no=new Set,ln=!1,An=null,fi=null,rl=0,pi=new Set,pn=null,rs=0,Ad=1,io=null,Ht=class e{id=Ad++;started=!1;linked=!0;prev=null;next=null;async_deriveds=new Map;current=new Map;previous=new Map;records=null;folded=[];#e=new Map;#r=new Map;#t=new Map;#o=null;#n=new Map;#i=[];#s=new Set;#a=new Set;is_fork=!1;merged=null;merge_requests=new Set;#l=!1;constructor(){fn===null?yt=fn=this:(fn.next=this,this.prev=fn),fn=this}#f(){if(this.is_fork)return!0;for(let t of this.#t.keys())if(this.is_blocked_by(t))return!0;return!1}#u(t){return this.#s.has(t)||(t.f&33554432)!==0&&!this.#a.has(t)}is_skipped(t){for(var r=t;r!==null;r=r.parent)if(this.#u(r))return!0;return!1}is_blocked_by(t,r=null){for(var n=t;n!==null&&n!==r;n=n.parent)if(this.#u(n)||(n.f&16512)===128&&n.b.is_pending)return!1;return!0}skip_effect(t){this.#s.add(t),this.#a.delete(t)}unskip_effect(t){(this.#s.delete(t)||!this.#a.has(t)&&((t.f&33554432)!==0||this.folded.some(r=>r.#s.has(t))))&&this.revalidate_branch(t),this.#a.add(t)}unskip_new_effect(t){this.#a.add(t)}revalidate_branch(t){for(var r=t.first;r!==null;r=r.next){var n=r.f;(n&24576)===0&&!this.#u(r)&&((n&131168)===0&&r.fn!==null&&this.schedule(r,4096),this.revalidate_branch(r))}}#_(){var t=[];for(let o of this.#i)if(!((o.f&16384)!==0||(o.f&6144)===0)){for(var r=o,n=!1;r.parent!==null;){r=r.parent;var i=r.f;if((i&96)!==0){if((i&1024)===0){n=!0;break}r.f^=1024}}n||t.push(r)}return this.#i=[],t}#c(){if(I=ro=this,Ae?.derived_cache.clear(),Pe&&this.started&&io!==this.id&&this.#p(this.current.keys()),this.started=!0,io=this.id,this.#n.size>0){for(let[d,v]of this.#n)this.#m(d,v);this.#n.clear()}if($)for(let d of this.current.keys())pi.add(d);this.activate();for(var t=An=[],r=[],n=[],i=fi=[];this.#i.length>0;){rl++>1e3&&(this.#E(),Nd());for(let d of this.#_())try{this.#b(d,t,r,n)}catch(v){throw is(d,!0),this.#f()||this.discard(),v}if(this.#i.length>0){for(let d of r)this.#i.push(d);for(let d of t)this.#i.push(d);r.length=0,t.length=0}}if(I=null,i.length>0){var o=e.ensure();for(let d of i)(d.f&1024)===0&&o.schedule(d,4096)}if(An=null,fi=null,this.merge_requests.size>0){let d=Array.from(this.merge_requests,_t).filter(v=>v!==this&&v.linked&&!v.is_fork).sort((v,_)=>v.id-_.id);if(this.merge_requests.clear(),d.length>0){this.#v(r),this.#v(t);for(var a=this,l=d.length;l--;){var c=d[l];c!==a&&(c.#g(a),a=c)}a.#c();return}}if(this.#f()){this.#v(r),this.#v(t);for(let d of this.#s)is(d);i.length>0&&I.#c();return}let p=this.#w();if(p){this.#v(r),this.#v(t),p.#g(this),p.#c();return}for(let d of n)d.is_pending&&d.is_ready(this)&&d.reveal(t);this.#x(!0),this.#h(this.#e);var h=il(r);ie&&nl!==null&&nl(),il(t,h),this.#o?.resolve();var u=I;if(this.#t.size===0&&(this.#i.length===0||u!==null)&&this.#E(),Pe&&this.commit_writes(),u!==null){if(Ae!==null)for(let[d,v]of Ae.reverted_values)u.previous.get(d)?.wv!==v.wv&&Ae.reverted_values.delete(d);u.#c()}}#p(t){var r=new Set(t),n=new Set;for(let l of r){var i=l.reactions;if(i!==null)for(let c of i){var o=c.f;if((o&2)!==0){(o&1024)!==0&&Re(c,4096),r.add(c);continue}var a=c;n.has(a)||(n.add(a),(o&155648)===0&&!this.is_skipped(a)&&this.schedule(a,4096))}}}#b(t,r,n,i){t.f^=1024;for(var o=t.first;o!==null;){var a=o.f,l=(a&96)!==0,c=l&&(a&1024)!==0,p=c||(a&139264)!==0||this.#u(o);if(!p&&o.fn!==null){l?o.f^=1024:(a&4)!==0?r.push(o):Pe&&(a&16777224)!==0?n.push(o):Gr(o)&&$r(o);var h=o.first;if(h!==null){o=h;continue}}for(;o!==null;){if((o.f&16512)===128){var u=o.b;u.is_pending&&u.is_ready(this)&&i.push(u)}var d=o.next;if(d!==null){o=d;break}o=o.parent}}}#w(){for(var t=this.prev;t!==null;t=t.prev)if(!t.is_fork&&this.#$(t))return t;return null}#$(t){for(let r of this.current.keys())if(t.current.has(r))return!0;return!1}#g(t){for(let i of t.merge_requests)this.merge_requests.add(i);t.merge_requests.clear();for(let[i,o]of t.current){if(!this.previous.has(i)){let a=t.previous.get(i);a&&this.previous.set(i,a)}this.current.set(i,o)}for(let[i,o]of t.async_deriveds){let a=this.async_deriveds.get(i);a&&a!==o&&o.promise.then(a.resolve,a.reject),this.async_deriveds.set(i,o)}for(let[i,o]of t.records??[])if((i.f&16)===0){var r=this.records?.get(i);(this.records??=new Map).set(i,o),t.records?.delete(i),hi(i,r)}if(t.async_deriveds.clear(),t.#t.size>0){for(let[i,o]of t.#t)this.#t.set(i,(this.#t.get(i)??0)+o);t.#t.clear()}if(t.#n.size>0){for(let[i,o]of t.#n)this.#d(i,o);t.#n.clear()}let n=()=>t.discard();this.oncommit(n),this.ondiscard(n),t.merged=this,t.#E()}#d(t,r){(r===2048||this.#n.get(t)!==2048)&&this.#n.set(t,r)}#v(t){for(var r=0;r<t.length;r+=1){var n=t[r],i=n.f&6144;i!==0&&(this.#d(n,n.dv===null?4096:i),Re(n,1024))}}capture(t,r,n,i=!1,o=null){var a=this.previous.get(t),l=Id(this,t);a===void 0&&(a=l?.previous.get(t),a===void 0&&t.v!==de&&(a={v:t.v,wv:t.wv,e:(t.f&8388608)!==0,assigned:(t.f&67108864)!==0}),a!==void 0&&this.previous.set(t,a)),Dt?os(t):a!==void 0&&(Ae?.reverted_values.set(t,a),Ae?.derived_cache.clear());var c={v:r,wv:n?t.wv:_i(),e:i,assigned:(t.f&2)!==0,async:(t.f&4194304)!==0};this.current.set(t,c),Q?.set(t,c),zt?.delete(t),!this.is_fork&&l!==null&&l.previous.set(t,c),!this.is_fork&&!n&&l===null&&Md(t,c),n||(pn=null,rs=0,this.mark(t,2048,o),pn=null,qr.size>0&&!ao&&lo())}deactivate(){I=ro=Q=zt=pe=null}flush(){var t=vi(this.previous);try{if(this.#c(),no.size>0)for(let r of no)no.delete(r),r.linked&&!r.#l&&r.#c()}finally{if(rl=0,ns=null,An=null,fi=null,Ae=t.parent,this.deactivate(),$){for(let r of pi)r.updated=null;pi.clear()}}}discard(){this.#h(this.#r);for(let t of this.async_deriveds.values())t.reject(gr);this.#E(),this.#o?.resolve()}#y(){for(let o=yt;o!==null;o=o.next)if(o!==this){var t=o.id<this.id,r=[];for(let[a,l]of this.current){var n=o.current.get(a);if(n!==void 0)if(t&&l.v!==n.v&&!n.async)o.current.set(a,l);else continue;r.push(a)}if(!(!o.started||o.current.size===0)){var i=!0;for(let a of o.current.keys())if(!this.current.has(a)){i=!1;break}i&&t?o.discard():r.length>0&&($&&!o.#l&&Gi(o.#i.length===0,"Batch has scheduled effects"),o.#p(r),no.add(o))}}this.current.clear(),this.previous.clear()}commit_writes(){this.#y(),this.linked&&this.prev!==null&&this.#k()}increment(t){var r=this.#t.get(t)??0;this.#t.set(t,r+1)}decrement(t){var r=this.#t.get(t)??0;r===1?this.#t.delete(t):this.#t.set(t,r-1),!this.#l&&(this.#l=!0,Se(()=>{this.#l=!1,this.linked&&this.flush()}))}oncommit(t){this.#e.set(t,Ar?.size?Ar:null)}ondiscard(t){this.#r.set(t,Ar?.size?Ar:null)}#h(t){D(()=>{for(let[n,i]of t){if(i===null){n(this);continue}var r=vi();for(let[o,a]of i)r.reverted_values.has(o)&&r.reverted_values.set(o,a);try{n(this)}finally{Ae=r.parent}}}),t.clear()}settled(){return(this.#o??=Mi()).promise}static ensure(){if(I===null){let t=I=new e;ro===null&&!ln&&Se(()=>{t.started||t.flush()})}return I}activate(){if(I=this,pe=this,io!==this.id&&(io=null),!Pe){Q=zt=null;return}if(this.folded=[],!this.is_fork&&this.prev===null&&this.next===null){Q=zt=null;return}Q=new Map(this.current),zt=new Map;for(let t=yt;t!==null;t=t.next)if(!(t===this||t.is_fork))if(t.id<this.id&&t.#$(this))this.folded.push(t);else for(let[r,n]of t.previous)!Q.has(r)&&((r.f&2)!==0||!r.equals(n.v))&&Q.set(r,n)}get_record(t){for(var r=this.records?.get(t),n=this.folded.length;r===void 0&&n--;)r=this.folded[n].records?.get(t);return r}mark(t,r,n=null){var i=t.reactions;if(i!==null){var o=sr(),a=i.length;if(rs+=a,rs>1e5&&pn===null&&(pn=new Set),pn!==null){if(pn.has(t))return;pn.add(t)}for(var l=0;l<a;l++){var c=i[l],p=c.f;if(!(!o&&c===R)){var h=(p&2048)===0;if((p&131072)!==0)this.is_fork||(h&&Re(c,r),qr.add(c));else if((p&2)!==0){h&&Re(c,r);var u=c;zt?.delete(u),this.mark(u,4096,n)}else if(h){var d=c;(p&16)!==0&&Sr!==null&&(Re(d,r),Sr.add(d)),n!==null?(Re(d,r),n.push(d)):this.schedule(d,r)}}}}}schedule(t,r){if(ns=t,pe!==null&&pe!==this&&t!==P){this.#d(t,(t.f&2097152)!==0?r:4096);return}if(ro!==this&&P===null){if(this.prev!==null||this.next!==null||this.is_fork){this.#d(t,4096);return}r=4096}this.#m(t,r)}#m(t,r){(t.f&2048)===0&&Re(t,r),this.#i.push(t)}#x(t=!1){var r=this.records;if(r!==null){this.records=null;for(let[i,o]of r){if((i.f&16386)===0){var n=(i.f&4194304)!==0&&oo(o)&&!oo(i);if(t&&!n&&(to(i,o),(i.f&4194304)!==0))for(let a=yt;a!==null;a=a.next)a!==this&&!a.records?.has(i)&&a.async_deriveds.get(i)?.reject(gr);al(i)}hi(i,o)}}}#k(){var t=this.prev,r=yt;t.next=this.next,this.next===null?fn=t:this.next.prev=t,this.prev=null,this.next=r,r.prev=yt=this,this.id=r.id-1}#E(){if(this.linked){var t=this.prev,r=this.next;t===null?yt=r:t.next=r,r===null?fn=t:r.prev=t,this.linked=!1,this.#x()}}},nl=null;function jr(e){var t=ln,r=pe!==I?pe:null;ln=!0;try{var n;for(e&&(jr(),n=e());;){if(Za(),I===null)return n;I.flush()}}finally{ln=t,pe=r}}function Nd(){if($){var e=new Map;for(let r of I.current.keys())for(let[n,i]of r.updated??[]){var t=e.get(n);t||(t={error:i.error,count:0},e.set(n,t)),t.count+=i.count}for(let r of e.values())r.error&&console.error(r.error)}try{Ma()}catch(r){$&&We(r,"stack",{value:""}),Lt(r,ns)}}var Sr=null,Ar=null;function Od(e){if((e.f&32772)!==4)return!1;for(var t=e.b;t!==null;t=t.parent)if(t.is_pending)return t.defer_effect(e),!0;return!1}function il(e,t=null){var r=e.length;if(r===0)return t;for(var n=0;n<r;){var i=e[n++];if((i.f&24576)===0&&!I?.is_skipped(i)&&!Od(i)&&Gr(i)){Sr=new Set;var o=Nn;if($r(i),i.edges===null&&i.first===null&&i.nodes===null&&i.teardown===null&&i.ac===null&&ss(i),Sr?.size>0){var a=Ae;t!==null&&vi(t);var l=Ar;Ar=new Map(t);try{for(let c of Sr){if((c.f&24576)!==0||I?.is_skipped(c))continue;let p=[c],h=c.parent;for(;h!==null;)Sr.has(h)&&(Sr.delete(h),p.push(h)),h=h.parent;for(let u=p.length-1;u>=0;u--){let d=p[u];(d.f&24576)!==0||I?.is_skipped(d)||$r(d)}}}finally{Ar=l,Sr?.clear(),Ae=a}}if(Nn!==o&&I!==null)for(let[c,p]of I.current)p.wv>o&&(t??=new Map).set(c,p)}}return Sr=null,t}function Id(e,t){for(var r=e.next;r!==null&&(r.is_fork||!r.current.has(t));)r=r.next;return r}function Md(e,t){e.v=t.v,e.wv=t.wv,e.f=t.e?e.f|8388608:e.f&-8388609,(e.f&2)!==0&&(e.f|=67108864,Vr(e))}function ol(e){var t=Q,r=zt,n=pe;Q=zt=pe=null;try{e()}finally{Q=t,zt=r,pe=n}}function is(e,t=!1){if(!(!t&&(e.f&32)!==0&&(e.f&1024)!==0)){Re(e,1024);for(var r=e.first;r!==null;)is(r,t),r=r.next}}var gi=null;function fe(e,t){return e.label=t,co(e.v,t),e}function co(e,t){return e?.[Pi]?.(t),e}function On(e){return typeof e=="symbol"?`Symbol(${e.description})`:typeof e=="function"?"<function>":typeof e=="object"&&e?"<object>":String(e)}var qr=new Set;function Qo(e){qr=e}var ao=!1;function ll(){ao=!0}function je(e,t){var r={f:0,v:e,reactions:null,equals:Vi,rv:0,wv:0};return $&&nr&&(r.created=t??ir("created at"),r.updated=null,r.set_during_effect=!1,r.trace=null),r}function G(e,t){let r=je(e,t);return Qi(r),r}function vn(e,t=!1,r=!0){let n=je(e);return t||(n.equals=Yi),Cr&&r&&q!==null&&q.l!==null&&(q.l.s??=[]).push(n),n}function b(e,t,r=!1){P!==null&&(!Rt||(P.f&131072)!==0)&&sr()&&(P.f&4325394)!==0&&(ar===null||!ar.has(e))&&qa();let n=r?Ve(t):t;return $&&co(n,e.label),Zr(e,n,fi)}function Zr(e,t,r=null){var n=e.equals(t)&&(e.f&8388608)===0,i=Q?.get(e);if(!n||i!==void 0&&(i.e||!e.equals.call(i,t))){var o=Ht.ensure();if((e.f&67110914)===2050&&Rn(e),o.capture(e,t,n,!1,r),$){if(nr||R!==null){e.updated??=new Map,pi.add(e);let a=(e.updated.get("")?.count??0)+1;if(e.updated.set("",{error:null,count:a}),nr||a>5){let l=ir("updated at");if(l!==null){let c=e.updated.get(l.stack);c||(c={error:l,count:0},e.updated.set(l.stack,c)),c.count++}}}R!==null&&(e.set_during_effect=!0)}sr()&&R!==null&&(R.f&1024)!==0&&(R.f&96)===0&&(qt===null?cl([e]):qt.push(e))}else Dt&&os(e);return t}function lo(){ao=!1,ol(Pd)}function Pd(){for(let e of qr){(e.f&1024)!==0&&Re(e,4096);let t;try{t=Gr(e)}catch{t=!0}t&&$r(e)}qr.clear()}function Be(e){b(e,e.v+1)}var Fd=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function Ve(e){if(typeof e!="object"||e===null||Et in e||Li in e)return e;let t=xn(e);if(t!==zo&&t!==ma)return e;var r=new Map,n=Er(e),i=G(0),o=$&&nr?ir("created at"):null,a=Kt,l=u=>{if(Kt===a)return u();var d=P,v=Kt;He(null),cs(a);var _=u();return He(d),cs(v),_};n&&(r.set("length",G(e.length,o)),$&&(e=Hd(e)));var c="";let p=!1;function h(u){if(!p){p=!0,c=u,fe(i,`${c} version`);for(let[d,v]of r)fe(v,hn(c,d));p=!1}}return new Proxy(e,{defineProperty(u,d,v){(!("value"in v)||v.configurable===!1||v.enumerable===!1||v.writable===!1)&&Va();var _=r.get(d);return _===void 0?l(()=>{var m=G(v.value,o);return r.set(d,m),$&&typeof d=="string"&&fe(m,hn(c,d)),m}):b(_,v.value,!0),!0},deleteProperty(u,d){var v=r.get(d);if(v===void 0){if(d in u){let _=l(()=>G(de,o));r.set(d,_),Be(i),$&&fe(_,hn(c,d))}}else b(v,de),Be(i);return!0},get(u,d,v){if(d===Et)return e;if($&&d===Pi)return h;var _=r.get(d),m=d in u;if(_===void 0&&(!m||It(u,d)?.writable)&&(_=l(()=>{var y=Ve(m?u[d]:de),x=G(y,o);return $&&fe(x,hn(c,d)),x}),r.set(d,_)),_!==void 0){var g=s(_);return g===de?void 0:g}return Reflect.get(u,d,v)},getOwnPropertyDescriptor(u,d){this.has?.(u,d);var v=Reflect.getOwnPropertyDescriptor(u,d),_=r.get(d);if(_!==void 0){var m=s(_);if(m===de)return;if(v&&"value"in v)v.value=m;else return{enumerable:!0,configurable:!0,value:m,writable:!0}}return v},has(u,d){if(d===Et)return!0;var v=r.get(d),_=v!==void 0&&v.v!==de||Reflect.has(u,d);if(v!==void 0||(R!==null||P!==null)&&(!_||It(u,d)?.writable)){v===void 0&&(v=l(()=>{var g=_?Ve(u[d]):de,y=G(g,o);return $&&fe(y,hn(c,d)),y}),r.set(d,v));var m=s(v);if(m===de)return!1}return _},set(u,d,v,_){var m=r.get(d),g=d in u;if(n&&d==="length")for(var y=v;y<m.v;y+=1){var x=r.get(y+"");x!==void 0?b(x,de):y in u&&(x=l(()=>G(de,o)),r.set(y+"",x),$&&fe(x,hn(c,y)))}if(m===void 0)(!g||It(u,d)?.writable)&&(m=l(()=>G(void 0,o)),$&&fe(m,hn(c,d)),b(m,Ve(v)),r.set(d,m));else{g=m.v!==de;var T=l(()=>Ve(v));b(m,T)}var w=Reflect.getOwnPropertyDescriptor(u,d);if(w?.set&&w.set.call(_,v),!g){if(n&&typeof d=="string"){var k=r.get("length"),C=Number(d);Number.isInteger(C)&&C>=k.v&&b(k,C+1)}Be(i)}return!0},ownKeys(u){s(i);var d=Reflect.ownKeys(u).filter(m=>{var g=r.get(m);return g===void 0||g.v!==de});for(var[v,_]of r)_.v!==de&&!(v in u)&&d.push(v);return d},setPrototypeOf(){Ya()}})}function hn(e,t){return typeof t=="symbol"?`${e}[Symbol(${t.description??""})]`:Fd.test(t)?`${e}.${t}`:/^\d+$/.test(t)?`${e}[${t}]`:`${e}['${t}']`}function uo(e){try{if(e!==null&&typeof e=="object"&&Et in e)return e[Et]}catch{}return e}var zd=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function Hd(e){return new Proxy(e,{get(t,r,n){var i=Reflect.get(t,r,n);return zd.has(r)?function(...o){ll();var a=i.apply(this,o);return lo(),a}:i}})}function dl(){let e=Array.prototype,t=Array.__svelte_cleanup;t&&t();let{indexOf:r,lastIndexOf:n,includes:i}=e;e.indexOf=function(o,a){let l=r.call(this,o,a);if(l===-1){for(let c=a??0;c<this.length;c+=1)if(uo(this[c])===o){Ui("array.indexOf(...)");break}}return l},e.lastIndexOf=function(o,a){let l=n.call(this,o,a??this.length-1);if(l===-1){for(let c=0;c<=(a??this.length-1);c+=1)if(uo(this[c])===o){Ui("array.lastIndexOf(...)");break}}return l},e.includes=function(o,a){let l=i.call(this,o,a);if(!l){for(let c=0;c<this.length;c+=1)if(uo(this[c])===o){Ui("array.includes(...)");break}}return l},Array.__svelte_cleanup=()=>{e.indexOf=r,e.lastIndexOf=n,e.includes=i}}var fo,ul,mi,fl,pl;function vl(){if(fo===void 0){fo=window,ul=document,mi=/Firefox/.test(navigator.userAgent);var e=Element.prototype,t=Node.prototype,r=Text.prototype;fl=It(t,"firstChild").get,pl=It(t,"nextSibling").get,Ho(e)&&(e[Jn]=void 0,e[Fi]=null,e[Qn]=void 0,e.__e=void 0),Ho(r)&&(r[ei]=void 0),$&&(e.__svelte_meta=null,dl())}}function Ye(e=""){return E?E.createText(e):document.createTextNode(e)}function tt(e){return E?E.getFirstChild(e):fl.call(e)}function Ie(e){return E?E.getNextSibling(e):pl.call(e)}function ye(e,t){if(!S)return tt(e);var r=tt(B);if(r===null)r=Ne(B,Ye());else if(t&&Me(r)!==on){var n=Ye();return ft(r,n),le(n),n}return t&&vo(r),le(r),r}function qe(e,t=!1){if(!S){var r=tt(e);return Ud(r)&&Tt(r)===""?Ie(r):r}if(t){if(Me(B)!==on){var n=Ye();return B&&ft(B,n),le(n),n}vo(B)}return B}function Mn(e,t=!1){if(!S)return tt(e);var r=ye(e,t);return se(e),r}function bt(e,t=1,r=!1){let n=S?B:e;for(var i;t--;)i=n,n=Ie(n);if(!S)return n;if(r){if(Me(n)!==on){var o=Ye();return n===null?i&&Bd(i,o):ft(n,o),le(o),o}vo(n)}return le(n),n}function $i(e){if(E){for(var t=E.getFirstChild(e);t!==null;){var r=E.getNextSibling(t);E.remove(t),t=r}return}e.textContent=""}function yi(){if(!Pe&&Ar===null)return!1;var e=R.f;return(e&32768)!==0}function yr(e,t,r){return E?E.createElement(e):t==null||t===Hi?r?document.createElement(e,{is:r}):document.createElement(e):r?document.createElementNS(t,e,{is:r}):document.createElementNS(t,e)}function lr(){return E?E.createFragment():document.createDocumentFragment()}function po(e=""){return E?E.createComment(e):document.createComment(e)}function _n(e,t,r=""){if(E){E.setAttribute(e,t,r);return}if(t.startsWith("xlink:")){e.setAttributeNS("http://www.w3.org/1999/xlink",t,r);return}return e.setAttribute(t,r)}function vo(e){if(E||e.nodeValue.length<65536)return;let t=e.nextSibling;for(;t!==null&&Me(t)===on;)t.remove(),e.nodeValue+=t.nodeValue,t=e.nextSibling}function Ud(e){return E?!!e&&Me(e)===kt:e instanceof Comment}function Me(e){if(e!=null){if(E){let t=E.getNodeType(e);return ya[t]}return e.nodeType}}function bi(e){return E?"":e.nodeName}function gn(e){return E?E.getLastChild(e):e.lastChild}function Ln(e){return E?E.getParent(e):e.parentNode}function Ne(e,t){return E?(E.insert(e,t,null),t):e.appendChild(t)}function ft(e,t){if(E){var r=E.getParent(e);E.insert(r,t,e);return}e.before(t)}function Bd(e,t){if(E){var r=E.getParent(e),n=E.getNextSibling(e);E.insert(r,t,n);return}e.after(t)}function Tr(e){if(E){E.remove(e);return}e.remove()}function ds(e,t){return E?(E.remove(t),t):e.removeChild(t)}function hl(e,t){if(E){E.setText(e,t);return}e.nodeValue=t}function Tt(e){return E?E.getText(e):e.nodeValue}function Or(e,t){return E?E.getAttribute(e,t):e.getAttribute(t)}function Ir(e,t){if(E){E.removeAttribute(e,t);return}e.removeAttribute(t)}function us(e,t){E&&qi("innerHTML"),e.innerHTML=t}function _l(e,t){return E&&qi("cloneNode"),e.cloneNode(t)}function gl(e,t){return E&&qi("importNode"),document.importNode(e,t)}function ho(e,t,r,n){if(E){E.addEventListener(e,t,r,n);return}e.addEventListener(t,r,n)}function fs(e,t,r,n){if(E){E.removeEventListener(e,t,r,n);return}e.removeEventListener(t,r,n)}function ps(e,t,r,n){e.style.setProperty(t,r,n)}function vs(e,t){e.style.removeProperty(t)}function hs(e,t){if(E){E.setAttribute(e,"style",t);return}e.style.cssText=t}function ml(e,t,r){e.classList.toggle(t,r)}var _s=new WeakMap;function $l(e){var t=R;if(t===null)return e;if($&&e instanceof Error&&!_s.has(e)&&_s.set(e,Vd(e,t)),(t.f&32768)===0&&(t.f&4)===0)throw $&&!t.parent&&e instanceof Error&&yl(e),e;Lt(e,t)}function Lt(e,t){if(e===Yt)throw e;if(!(t!==null&&(t.f&16384)!==0)){for(;t!==null;){if((t.f&128)!==0&&(t.f&33570816)===0){if((t.f&32768)===0)throw e;try{t.b.error(e);return}catch(r){e=r}}t=t.parent}throw $&&e instanceof Error&&yl(e),e}}function Vd(e,t){let r=It(e,"message");if(!(r&&!r.configurable)){for(var n=mi?"  ":"	",i=`
${n}in ${t.fn?.name||"<unknown>"}`,o=t.ctx;o!==null;)i+=`
${n}in ${o.function?.[Zt].split("/").pop()}`,o=o.p;return{message:e.message+`
${i}
`,stack:e.stack?.split(`
`).filter(a=>!a.includes("svelte/src/internal")).join(`
`)}}}function yl(e){let t=_s.get(e);t&&(We(e,"message",{value:t.message}),We(e,"stack",{value:t.stack}))}function $s(e){R===null&&(P===null&&Ia(e),Oa()),Dt&&Na(e)}function Yd(e,t){var r=t.last;r===null?t.last=t.first=e:(r.next=e,e.prev=r,t.last=e)}function Xt(e,t){var r=R;if($)for(;r!==null&&(r.f&131072)!==0;)r=r.parent;r!==null&&(r.f&8192)!==0&&(e|=8192);var n={ctx:q,deps:null,dv:null,edges:null,nodes:null,f:e|2048|512,first:null,fn:t,last:null,next:null,parent:r,b:r&&r.b,prev:null,teardown:null,wv:0,ac:null,r:E};$&&(n.component_function=or);var i=n;if((e&4)!==0)An!==null?An.push(n):Ht.ensure().schedule(n,2048);else if(t!==null){try{$r(n)}catch(a){throw Ee(n),a}i.edges===null&&i.teardown===null&&i.nodes===null&&i.first===i.last&&(i.f&524288)===0&&(i=i.first,(e&16)!==0&&(e&65536)!==0&&i!==null&&(i.f|=65536))}if(i!==null&&(i.parent=r,r!==null&&Yd(i,r),P!==null&&(P.f&2)!==0&&(e&64)===0)){var o=P;(o.effects??=[]).push(i)}return n}function In(){return P!==null&&!Rt}function et(e){let t=Xt(8,null);return Re(t,1024),t.teardown=e,t}function Bt(e){$s("$effect"),$&&We(e,"name",{value:"$effect"});var t=R.f,r=!P&&(t&32)!==0&&q!==null&&!q.i;if(r){var n=q;(n.e??=[]).push(e)}else return Wo(e)}function Wo(e){return Xt(1048580,e)}function br(e){return $s("$effect.pre"),$&&We(e,"name",{value:"$effect.pre"}),Xt(1048584,e)}function ys(e){Ht.ensure();let t=Xt(524352,e);return()=>{Ee(t)}}function xl(e){Ht.ensure();let t=Xt(524352,e);return(r={})=>new Promise(n=>{r.outro?wr(t,()=>{Ee(t),n(void 0)}):(Ee(t),n(void 0))})}function Gt(e){return Xt(4,e)}function Xo(e){return Xt(4718592,e)}function wt(e,t=0){return Xt(8|t,e)}function _e(e,t=[],r=[],n=[]){Ki(n,t,r,i=>{Xt(8,()=>{e(...i.map(s))})})}function ct(e,t=0){var r=Xt(16|t,e);return $&&(r.dev_stack=Mt),r}function bs(e,t=0){var r=Xt(16777216|t,e);return $&&(r.dev_stack=Mt),r}function xe(e){return Xt(524320,e)}function ws(e){var t=e.teardown;if(t!==null){let r=Dt,n=_o,i=Ae,o=P;gs(!0),He(null);try{t.call(null)}catch(a){Lt(a,e.parent)}finally{gs(r,n),so(i),He(o)}}}function ci(e,t=!1){var r=e.first;for(e.first=e.last=null;r!==null;){di(r);var n=r.next;(r.f&64)!==0?r.parent=null:Ee(r,t),r=n}}function El(e){for(var t=e.first;t!==null;){var r=t.next;(t.f&32)===0&&Ee(t),t=r}}function Ee(e,t=!0){var r=!1,n=ie?Xe(e.r):null;try{(t||(e.f&262144)!==0)&&e.nodes!==null&&e.nodes.end!==null&&(kl(e.nodes.start,e.nodes.end),r=!0),e.f|=33554432,ci(e,t&&!r),ui(e);var i=e.nodes&&e.nodes.t;if(i!==null)for(let a of i)a.stop();ws(e)}finally{ie&&Je(n)}e.f^=33554432,e.f|=16384;var o=e.parent;o!==null&&o.first!==null&&ss(e),$&&(e.component_function=null),e.next=e.prev=e.teardown=e.ctx=e.deps=e.dv=e.edges=e.fn=e.nodes=e.ac=e.b=e.r=null}function kl(e,t){for(;e!==null;){var r=e===t?null:Ie(e);Tr(e),e=r}}function ss(e){var t=e.parent,r=e.prev,n=e.next;r!==null&&(r.next=n),n!==null&&(n.prev=r),t!==null&&(t.first===e&&(t.first=n),t.last===e&&(t.last=r))}function wr(e,t,r=!0){var n=[];e.f|=256,Tl(e,n,!0);var i=()=>{r&&Ee(e),t&&t()},o=n.length;if(o>0){var a=Ae,l=()=>{if(!--o){var p=Ae;try{a&&(a.derived_cache.clear(),so(a)),i()}finally{a&&so(p)}}};for(var c of n)c.out(l)}else i()}function Tl(e,t,r){if((e.f&8192)===0){e.f^=8192;var n=e.nodes&&e.nodes.t;if(n!==null)for(let l of n)(l.is_global||r)&&t.push(l);for(var i=e.first;i!==null;){var o=i.next;if((i.f&64)===0){var a=(i.f&65536)!==0||(i.f&32)!==0&&(e.f&16)!==0;Tl(i,t,a?r:!1)}i=o}}}function Pn(e){e.f&=-257,Cl(e,!0)}function Cl(e,t){if((e.f&256)===0&&(e.f&8192)!==0){e.f^=8192,(e.f&1024)===0&&Ht.ensure().schedule(e,4096);for(var r=e.first;r!==null;){var n=r.next,i=(r.f&65536)!==0||(r.f&32)!==0;Cl(r,i?t:!1),r=n}var o=e.nodes&&e.nodes.t;if(o!==null)for(let a of o)(a.is_global||t)&&a.in()}}function Fn(e,t){if(e.nodes){var r=ie?Xe(e.r):null;try{for(var n=e.nodes.start,i=e.nodes.end;n!==null;){var o=n===i?null:Ie(n);Ne(t,n),n=o}}finally{ie&&Je(r)}}}var Dl=null;function go(e,t){if(t){let r=document.body;e.autofocus=!0,Se(()=>{document.activeElement===r&&e.focus()})}}function Kr(e){var t=P,r=R;He(null),Qe(null);try{return e()}finally{He(t),Qe(r)}}var Dt=!1,_o=0;function gs(e,t=Nn){Dt=e,_o=t}var Al={v:void 0,wv:0,e:!1,assigned:!1},P=null,Rt=!1;function He(e){P=e}var R=null;function Qe(e){R=e}var ar=null;function Qi(e){P!==null&&(!Pe&&(P.f&2097152)!==0||(P.f&2)!==0)&&(ar??=new Set).add(e)}var $e=null,St=0,qt=null;function cl(e){qt=e}var Nn=1,mn=0,Kt=mn;function cs(e){Kt=e}function _i(){return++Nn}function as(e){return Q===null?(ai(e),e.wv):(e.f&2)!==0?li(e).wv:(Q.get(e)??e).wv}function si(e,t){if(e!==null){for(var r=0;r<t.length;r++)if(as(e[r])!==t[r])return!1}return!0}function eo(e,t,r=null){if(e!==null)for(var n=0;n<e.length;n++){var i=e[n];if((i.f&2)===0){if(as(i)>t)return!0;continue}var o=i;if(Q===null?ai(i):o=li(i),o.wv>t){var a=o===i?(i.f&67108864)!==0:!("dv"in o);if(a)return!0;if(r===null)r=new Set;else if(r.has(o))continue;if(eo(o.deps,t,r))return!0;r.add(o)}}return!1}function ls(e){return(e.f&4194320)!==0&&pe?.get_record(e)||e}function Gr(e){var t=e.f;if((t&6144)===0)return!1;if((t&67108864)!==0){if(eo(e.deps,e.wv))return!0}else{if((t&2048)!==0)return!0;var r=ls(e),n=r.deps,i=r.dv;if(i===null)return!0;if(Q===null)for(var o=0,a=i.length;o<a;o++){var l=n[o];if(ai(l),l.wv!==i[o])return!0}else if(!si(n,i))return!0}return(t&512)!==0&&Re(e,1024),!1}function Nl(e,t,r=!0){var n=e.reactions;if(n!==null&&!(!Pe&&ar!==null&&ar.has(e)))for(var i=0;i<n.length;i++){var o=n[i];(o.f&2)!==0?Nl(o,t,!1):t===o&&I.schedule(o,r?2048:4096)}}var $t=null;function Ol(e){return(e.f&2097152)===0&&La(),e.f|=134217728,($t??=new AbortController).signal}function Xr(e){e&&Kr(()=>e.abort(En))}function hi(e,t,r=!1){if(t?.ac){for(var n=yt;n!==null;n=n.next)if(n.records?.get(e)===t&&!(r&&(n===pe||xs(I,n))))return;Xr(t.ac),t.ac=null}}function Gd(e,t){var r=I,n=(t&2)!==0;if(!(n&&Dt)){var i=r===null||!r.is_fork;hi(e,pe?.records?.get(e),!0),(n?Q===null||i&&oo(e):i)&&Xr(e.ac);for(var o=yt;o!==null;o=o.next)xs(r,o)&&hi(e,o.records?.get(e),!0)}}function Il(e){Xr(e.ac),e.ac=$t}function oo({deps:e,dv:t}){return t===null||t.some((r,n)=>e[n].wv!==r)}function xs(e,t){return e!==null&&!e.is_fork&&!t.is_fork&&t.id<e.id&&(Q===null||t.previous.size===0||e.folded.includes(t))}function di(e){if((e.f&134217728)===0)return!1;e.f^=134217728,Xr(e.ac),e.ac=null;for(var t=yt;t!==null;t=t.next){var r=t.records?.get(e);r?.ac&&(Xr(r.ac),r.ac=null)}return!0}function Wd(e){return(e&4194304)===0&&(e&32784)!==32784?!1:pe!==null&&pe===I}function ts(e){let t=I;var r=$e,n=St,i=qt,o=P,a=ar,l=q,c=Rt,p=Kt,h=e.f;$e=null,St=0,qt=null,P=(h&96)===0?e:null,ar=null,Dr(e.ctx),Rt=!1,Kt=++mn;var u=$t;$t=null,(h&134217728)!==0&&Gd(e,h);try{e.f|=2097152;var d=e.fn,v=d();if(e.f|=32768,Rl(e,h,v,!1),sr()&&qt!==null&&!Rt&&($e!==null||St>0)&&(e.f&6146)===0)for(var _=0;_<qt.length;_++)Nl(qt[_],e);if(o!==null&&o!==e){if(mn++,o.deps!==null)for(let y=0;y<n;y+=1)o.deps[y].rv=mn;if(r!==null)for(let y of r)y.rv=mn;qt!==null&&(i===null?i=qt:i.push(...qt))}return v}catch(y){var m=y;try{m=$l(y)}finally{Rl(e,h,m,m===y)}return m}finally{var g=$t?.signal;t!==null&&g!==void 0&&g.addEventListener("abort",()=>{if(I!==null){let y=_t(t);y!==I&&y.linked&&!y.is_fork&&I.merge_requests.add(y)}}),e.f^=2097152,$e=r,St=n,qt=i,P=o,ar=a,Dr(l),Rt=c,Kt=p,$t=u}}function Rl(e,t,r,n){var i=e.deps,o=St+($e===null?0:$e.length),a=e.dv;if((e.f&16384)!==0){Xr($t);return}if($t!==null&&(e.f&134217728)===0&&(Xr($t),$t=null),(t&2)!==0&&Dt){for(var l=0,c=0;c<o;c++){var p=c<St?i[c]:$e[c-St];l=Math.max(l,Ul(p))}Al={v:r,wv:l,e:n,assigned:(t&67108864)!==0};return}if((t&2)!==0&&Q===null&&yt!==null&&yt.next!==null&&Ll(e,t),$e===null&&Q===null&&a!==null&&o===i?.length&&e.edges===i&&(t&4194320)===0){for(var h=0;h<o;h++)a[h]=i[h].wv;a.length!==o&&(a.length=o),(t&2)!==0&&Ml(e,r,n),(e.ac||$t)&&Il(e);return}jd(e,t,o,r,n)}function Ml(e,t,r){var n=e.f&-67108865;(r||(n&8388608)!==0||!e.equals(t))&&(e.v=t,e.wv=_i(),n=r?n|8388608:n&-8388609),e.f=n,Vr(e)}function jd(e,t,r,n,i){var o=Wd(t);if(Q!==null&&(t&2)!==0){var a=Q.get(e);a!==void 0&&a.wv!==e.wv&&(o=!0)}var l=e.deps,c=l;($e!==null||St!==l?.length)&&(c=St===0?$e:l.slice(0,St).concat($e??[]));for(var p=!o&&Q===null&&e.dv!==null?e.dv:[],h=0;h<r;h++){var u=c[h];p[h]=Zd(u),Q!==null&&(t&2)!==0&&(p[h]!==u.wv||(u.f&1026)===2)&&(o=!0)}p.length!==r&&(p.length=r),!o&&Q!==null&&(t&2)!==0&&Ll(e,t);var d=o||Pl(e),v=In()&&(e.f&512)!==0,_=e.edges;if(d&&_!==null){if($e!==null){e.edges=_=_.slice();for(u of $e)kr.call(_,u)||(_.push(u),v&&(u.reactions??=[]).push(e))}}else{if(_===l){if(_!==null)for(h=St;h<_.length;h++)mo(e,_[h]);if(v&&$e!==null)for(u of $e)(u.reactions??=[]).push(e)}else{var m=new Set(c);for(u of _)m.delete(u)||mo(e,u);if(v)for(u of m)(u.reactions??=[]).push(e)}e.edges=c}if(o){var g=pe;(g.records??=new Map).set(e,(t&2)!==0?{deps:c,dv:p,v:n,e:i,wv:Kd(e,g,n,i),ac:$t}:{deps:c,dv:p,ac:$t})}else e.deps=c,e.dv=p,(e.ac||$t)&&Il(e),(t&2)!==0&&(Ml(e,n,i),pe?.records?.delete(e))}function Ll(e,t){var r=e.dv;if(!(r===null||r.length===0||(t&67108864)!==0)){for(var n,i=e.ac,o=i!==null&&I!==null&&I.is_fork&&!i.signal.aborted,a=yt;a!==null;a=a.next)a!==pe&&!a.records?.has(e)&&(i===null||o||xs(I,a))&&(n??={deps:e.deps,dv:r.slice(),v:e.v,wv:e.wv,e:(t&8388608)!==0},(a.records??=new Map).set(e,n));o&&n!==void 0&&(n.ac=i,e.ac=null)}}function Zd(e){if(Q===null)return e.wv;if((e.f&2)!==0){var t=zt;return t.get(e)?.wv??-1}return(Q.get(e)??e).wv}function Kd(e,t,r,n){if(!n){var i=t.get_record(e);if(i!==void 0&&!i.e&&e.equals.call(i,r))return i.wv;if((e.f&8388608)===0&&e.equals(r))return e.wv}return _i()}function to(e,t){if(e.deps=t.deps,e.dv=(e.f&2)!==0?t.dv.slice():t.dv,(e.f&2)!==0){var r=e;r.v=t.v,r.wv=t.wv,r.f=(t.e?r.f|8388608:r.f&-8388609)&-67108865,Vr(r)}Xr(e.ac),e.ac=t.ac??null,t.ac=null}function Pl(e){for(var t=yt;t!==null;t=t.next)if(t.records?.has(e))return!0;return!1}function al(e){var t=e.edges,r=e.deps;if(!(t===r||Pl(e))){for(var n of t)(r===null||!kr.call(r,n))&&mo(e,n);e.edges=r}}function Fl(e,t){var r=e.reactions??=[];kr.call(r,t)||r.push(t)}function mo(e,t){let r=t.reactions;if(r!==null){var n=ga.call(r,e);if(n!==-1){var i=r.length-1;i===0?r=t.reactions=null:(r[n]=r[i],r.pop())}}if(r===null&&(t.f&2)!==0&&($e===null||!kr.call($e,t))){var o=t;if((o.f&512)!==0&&(o.f^=512),o.v!==de&&Vr(o),di(o)){Re(o,2048),o.dv=null;for(var a=yt;a!==null;a=a.next)a.records?.delete(o);zt?.delete(o)}tl(o),ui(o)}}function ui(e){var t=e.edges;if(t!==null)for(var r=0;r<t.length;r++)mo(e,t[r])}function $r(e){var t=e.f;if((t&16384)===0){Re(e,1024);var r=R;R=e;var n=ie?Xe(e.r):null;if($){var i=or;Wi(e.component_function);var o=Mt;Dn(e.dev_stack??Mt)}try{(t&16777232)!==0?El(e):ci(e),ws(e);var a=ts(e);if(e.teardown=typeof a=="function"?a:null,e.wv=Nn,$&&nr&&(e.f&2048)!==0&&e.edges!==null)for(var l of e.edges)l.set_during_effect&&(l.wv=_i(),l.set_during_effect=!1)}finally{R=r,ie&&Je(n),$&&(Wi(i),Dn(o))}}}async function Mr(){if(Pe)return new Promise(e=>{requestAnimationFrame(()=>e()),setTimeout(()=>e())});await Promise.resolve(),jr()}function s(e){var t=e.f,r=(t&2)!==0;Dl?.add(e);var n=null;if(P!==null&&!Rt){var i=R!==null&&(R.f&16384)!==0;if(!i&&(ar===null||!ar.has(e))){var o=P.deps;if((P.f&2097152)!==0)e.rv<mn&&(e.rv=mn,$e===null&&o!==null&&o[St]===e?St++:$e===null?$e=[e]:$e.push(e));else{n=P;var a=P.edges;(a===null||!kr.call(a,e))&&(P.edges=a===null?[e]:[...a,e]),Fl(e,P)}}}if($){if(!Rt&&pe===null&&Pt&&!Pt.warned&&(Pt.effect.f&2097152)===0&&!Pt.effect_deps.has(e)){Pt.warned=!0,ba(e.label);var l=ir("traced at");l&&console.warn(l)}if(oi.delete(e),nr&&!Rt&&gi!==null&&P!==null&&gi.reaction===P){if(e.trace)e.trace();else if(l=ir("traced at"),l){var c=gi.entries.get(e);c===void 0&&(c={traces:[]},gi.entries.set(e,c));var p=c.traces[c.traces.length-1];l.stack!==p?.stack&&c.traces.push(l)}}}if(Dt){var h=Hl(e);if(h!==void 0){if(h.e)throw h.v;return h.v}}var u;if(r){var d=e,v=(d.f&512)===0&&!Rt&&P!==null&&(P.f&512)!==0,_=(d.f&32768)===0;v&&(d.f|=512),Q!==null?u=li(d):ai(d),v&&!_&&(es(d),zl(d))}else Q!==null&&(u=Q.get(e));if(n!==null&&Xd(n,e,u===void 0?e.wv:u.wv),u!==void 0&&u!==e){if(u.e)throw u.v;return u.v}if((e.f&8388608)!==0)throw e.v;return e.v}function Xd(e,t,r){var n=ls(e),i=n.deps;n.dv!==null&&(i===null||!kr.call(i,t))&&(n.deps=i===null?[t]:[...i,t],n.dv.push(r))}function zl(e){if(e.f|=512,e.edges!==null)for(let t of e.edges)Fl(t,e),(t.f&2)!==0&&(t.f&512)===0&&(es(t),zl(t))}function Hl(e){var t=e.wv>_o?void 0:Ae?.reverted_values.get(e);if((e.f&2)===0)return t;var r=e,n=(Ae??vi()).derived_cache,i=n.get(r);if(i!==void 0)return i;var o=t??Q?.get(r),a=o===void 0?(r.f&67108864)!==0:o.assigned,l=o===void 0&&!a?r.dv:null,c=r.deps??[],p=a||l!==null,h=l?.length??c.length;o??={v:r.v,wv:r.wv,e:(r.f&8388608)!==0,assigned:(r.f&67108864)!==0};for(var u=0;p&&u<h;u++){var d=Ul(c[u]);p=l===null?d<=o.wv:d===l[u]}return p?i=o:(Rn(r),i=Al,o.wv<i.wv&&!o.e&&!i.e&&r.equals.call(o,i.v)&&(i.wv=o.wv)),n.set(r,i),i}function Ul(e){return(Hl(e)??Q?.get(e)??e).wv}function D(e){var t=Rt;try{return Rt=!0,e()}finally{Rt=t}}var Qd=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var Am=[...Qd,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var eu=["touchstart","touchmove"];function Bl(e){return eu.includes(e)}var tu=["$state","$state.raw","$derived","$derived.by"],Nm=[...tu,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];var wi=Symbol("events"),yo=Symbol("propagation stopped at"),Yl=new Set,Ts=new Set;function ql(e,t,r,n={}){var i=E!=null;function o(...a){if(i)return Kr(()=>r?.apply(this,a));var l=a[0];if(n.capture||Cs.call(t,l),n.capture||l[yo]!==t)return Kr(()=>r?.call(this,l))}return!i&&(e.startsWith("pointer")||e.startsWith("touch")||e==="wheel")?(o.__removed=!1,Se(()=>{o.__removed||ho(t,e,o,n)})):ho(t,e,o,n),o}function zn(e,t,r,n,i){var o={capture:n,passive:i},a=ql(e,t,r,o);E==null&&(t===document.body||t===window||t===document||t instanceof HTMLMediaElement)&&et(()=>{a.__removed=!0,fs(t,e,a,o)})}function rt(e,t,r){(t[wi]??={})[e]=r}function cr(e){for(var t=0;t<e.length;t++)Yl.add(e[t]);for(var r of Ts)r(e)}var $o=new Map;function Ds(e){var t=new Set,r=n=>{for(var i=0;i<n.length;i++){var o=n[i];if(!t.has(o)){t.add(o);var a=Bl(o);for(let p of[e,document]){var l=$o.get(p);l===void 0&&(l=new Map,$o.set(p,l));var c=l.get(o);c===void 0?(p.addEventListener(o,Cs,{passive:a}),l.set(o,1)):l.set(o,c+1)}}}};return r(wn(Yl)),Ts.add(r),()=>{for(var n of t)for(let a of[e,document]){var i=$o.get(a),o=i.get(n);--o==0?(a.removeEventListener(n,Cs),i.delete(n),i.size===0&&$o.delete(a)):i.set(n,o)}Ts.delete(r)}}var Es=null,ks=!1;function Cs(e){var t=this,r=e.cancelBubble;if(!(r&&e[yo]===t)){r||delete e[yo];var n=t.ownerDocument,i=e.type,o=e.composedPath?.()||[],a=o[0]||e.target;Es=e,ks||(ks=!0,setTimeout(()=>{ks=!1,Es=null}));var l=0,c=Es===e&&e[wi];if(c){var p=o.indexOf(c);if(p!==-1&&(t===document||t===window)){e[wi]=t;return}var h=o.indexOf(t);if(h===-1)return;p<=h&&(l=p)}if(a=o[l]||e.target,a!==t){We(e,"currentTarget",{configurable:!0,get(){return a||n}});var u=P,d=R;He(null),Qe(null);try{for(var v,_=[];a!==null&&a!==t;){try{var m=a[wi]?.[i];m!=null&&(!a.disabled||e.target===a)&&m.call(a,e)}catch(g){v?_.push(g):v=g}if(e.cancelBubble){r||(e[yo]=t);break}l++,a=l<o.length?o[l]:null}if(v){for(let g of _)queueMicrotask(()=>{throw g});throw v}}finally{e[wi]=t,delete e.currentTarget,He(u),Qe(d)}}}}var ru=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:e=>e});function Gl(e){return ru?.createHTML(e)??e}function Ss(e){var t=yr("template");return us(t,Gl(e.replaceAll("<!>","<!---->"))),t.content}function Jt(e,t){var r=R;r.nodes===null&&(r.nodes={start:e,end:t,a:null,t:null})}function V(e,t){var r=(t&1)!==0,n=(t&2)!==0,i,o=!e.startsWith("<!>");return()=>{if(S)return Jt(B,null),B;i===void 0&&(i=Ss(o?e:"<!>"+e),r||(i=tt(i)));var a=n||mi?gl(i,!0):_l(i,!0);if(r){var l=tt(a),c=gn(a);Jt(l,c)}else Jt(a,a);return a}}function pt(){if(S)return Jt(B,null),B;var e=lr(),t=po(""),r=Ye();return Ne(e,t),Ne(e,r),Jt(t,r),e}function j(e,t){if(S){var r=R;((r.f&32768)===0||r.nodes.end===null)&&(r.nodes.end=B),ot();return}e!==null&&ft(e,t)}function bo(e){let t=0,r=je(0),n;return $&&fe(r,"createSubscriber version"),()=>{In()&&(s(r),wt(()=>(t===0&&(n=D(()=>e(()=>Be(r)))),t+=1,()=>{Se(()=>{t-=1,t===0&&(n?.(),n=void 0,Be(r))})})))}}var au=589824;function Ns(e,t,r,n){new As(e,t,r,n)}var As=class{parent;is_pending=!1;transform_error;#e;#r=S?B:null;#t;#o;#n;#i=null;#s=null;#a=null;#l=null;#f=0;#u=!1;#_=[];#c=new Map;#p=null;#b=bo(()=>(this.#p=je(this.#f),$&&fe(this.#p,"$effect.pending()"),()=>{this.#p=null}));constructor(t,r,n,i){this.#e=t,this.#t=r,this.#o=o=>{var a=R;a.b=this,a.f|=128,n(o)},this.parent=R.b,this.transform_error=i??this.parent?.transform_error??(o=>o),this.#n=ct(()=>{if(S){let o=Br(this.#r);ot();let a=o==="[!";if(o.startsWith("[?")){let c=JSON.parse(o.slice("[?".length));this.#$(c)}else a?this.#v():this.#w()}else this.#y()},au),S&&(this.#e=B)}#w(){try{this.#i=xe(()=>this.#o(this.#e))}catch(t){this.error(t)}}#$(t){let r=this.#t.failed,{reset:n,invoke_onerror:i}=this.#g(t);Se(i),r&&(this.#a=xe(()=>{r(this.#e,()=>t,()=>n)}))}#g(t){var r=!1,n=!1;let i=()=>{if(!this.#d()){if(r){Ta();return}r=!0,n&&Ga(),this.#a!==null&&wr(this.#a,()=>{this.#a=null}),this.#h(()=>{this.#y()})}};return{reset:i,invoke_onerror:()=>{if(!this.#d())try{n=!0,this.#t.onerror?.(t,i),n=!1}catch(a){Lt(a,this.#n&&this.#n.parent)}}}}#d(){return(this.#n.f&33570816)!==0}#v(){let t=this.#t.pending;t&&(this.is_pending=!0,this.#s=xe(()=>t(this.#e)),Se(()=>{if(!this.#d()){var r=ie?Xe(this.#n.r):null;try{var n=this.#l=lr(),i=Ye();Ne(n,i),this.#i=this.#h(()=>{try{return xe(()=>this.#o(i))}catch(o){try{this.error(o)}catch(a){Lt(a,this.#n.parent)}return null}}),this.#i!==null&&this.#c.size===0&&(this.is_pending=!1,ft(this.#e,n),this.#l=null,wr(this.#s,()=>{this.#s=null}))}finally{ie&&Je(r)}}}))}#y(){try{if(this.is_pending=this.has_pending_snippet(),this.#f=0,this.#i=xe(()=>{this.#o(this.#e)}),this.#c.size===0)this.is_pending=!1;else{let r=this.#t.pending;if(r){var t=this.#l=lr();Fn(this.#i,t),this.#s=xe(()=>r(this.#e))}}}catch(r){this.error(r)}}defer_effect(t){this.#_.push(t)}has_pending_snippet(){return!!this.#t.pending}#h(t){var r=R,n=P,i=q;Qe(this.#n),He(this.#n),Dr(this.#n.ctx);var o=ie?Xe(this.#n.r):null;try{return Ht.ensure(),t()}finally{Qe(r),He(n),Dr(i),ie&&Je(o)}}is_ready(t){if(t.is_fork&&this.#c.size>0)return!1;for(let[r,n]of this.#c)if(!r.is_fork){for(let i of n.keys())if(t.is_blocked_by(i,this.#i))return!1}return!0}reveal(t){this.is_pending=!1;for(let n of this.#_)Re(n,2048),t.push(n);if(this.#_.length=0,this.#s&&wr(this.#s,()=>{this.#s=null}),this.#l){var r=ie?Xe(this.#n.r):null;try{ft(this.#e,this.#l),this.#l=null}finally{ie&&Je(r)}}}increment(t,r){var n=this.#c.get(r);n===void 0&&this.#c.set(r,n=new Map);var i=n.get(t)??0;n.set(t,i+1)}decrement(t,r){var n=this.#c.get(r),i=n.get(t);i===1?(n.delete(t),n.size===0&&this.#c.delete(r),Se(()=>{this.is_pending&&!this.#d()&&Ht.ensure().schedule(this.#n,4096)})):n.set(t,i-1)}update_effect_pending(t){this.#f+=t,!(!this.#p||this.#u)&&(this.#u=!0,Se(()=>{this.#u=!1,this.#p&&Zr(this.#p,this.#f)}))}get_effect_pending(){return this.#b(),s(this.#p)}error(t){if(t===Yt||!this.#t.onerror&&!this.#t.failed)throw t;I?.is_fork?(this.#i&&I.skip_effect(this.#i),this.#s&&I.skip_effect(this.#s),this.#a&&I.skip_effect(this.#a),I.oncommit(()=>{this.#d()||this.#m(t)})):this.#m(t)}#m(t){this.#i&&(Ee(this.#i),this.#i=null),this.#s&&(Ee(this.#s),this.#s=null),this.#a&&(Ee(this.#a),this.#a=null),S&&(le(this.#r),Vo(),le(rr()));let r=this.#t.failed,n=i=>{if(this.#d())return;let{reset:o,invoke_onerror:a}=this.#g(i);a(),r&&!this.#d()&&(this.#a=this.#h(()=>{try{return xe(()=>{var l=R;l.b=this,l.f|=128,r(this.#e,()=>i,()=>o)})}catch(l){return Lt(l,this.#n.parent),null}}))};Se(()=>{if(!this.#d()){var i;try{i=this.transform_error(t)}catch(o){Lt(o,this.#n&&this.#n.parent);return}i!==null&&typeof i=="object"&&typeof i.then=="function"?i.then(n,o=>Lt(o,this.#n&&this.#n.parent)):n(i)}})}};var Os=!0;function wo(e,t){var r=t==null?"":typeof t=="object"?`${t}`:t;r!==(e[ei]??=Tt(e))&&(e[ei]=r,hl(e,`${r}`))}function Hn(e,t){return jl(e,t)}function Ms(e,t){t.intro=t.intro??!1;let r=t.target,n=S,i=B;try{for(var o=tt(r);o&&(Me(o)!==kt||Tt(o)!=="[");)o=Ie(o);if(!o)throw Yt;be(!0),le(o);let a=jl(e,{...t,anchor:o});return Pe&&I!==null&&I.commit_writes(),be(!1),a}catch(a){if(a instanceof Error&&a.message.split(`
`).some(l=>l.startsWith("https://svelte.dev/e/")))throw a;return a!==Yt&&console.warn("Failed to hydrate: ",a),t.recover===!1&&Fa(),$i(r),be(!1),Hn(e,t)}finally{be(n),le(i)}}function jl(e,t){if(ie&&t.renderer){var r=Xe(t.renderer);try{return Wl(e,t)}finally{Je(r)}}return Wl(e,t)}function Wl(e,{target:t,anchor:r,props:n={},events:i,context:o,intro:a=!0,transformError:l,renderer:c}){var p=void 0,h=xl(()=>{var u=r??Ne(t,Ye());Ns(u,{pending:()=>{}},v=>{st({});var _=q;if(o&&(_.c=o),i&&(n.$$events=i),S&&Jt(v,null),Os=a,p=e(v,n)||ii(),Os=!0,S&&(R.nodes.end=B,B===null||Me(B)!==kt||Tt(B)!=="]"))throw sn(),Yt;at()},l);var d=c?null:Ds(t);return()=>{if(d?.(),u!==r){var v=Ln(u);v&&ds(v,u)}}});return Is.set(p,h),p}var Is=new WeakMap;function xi(e,t){let r=Is.get(e);return r?(Is.delete(e),r(t)):($&&ka(),Promise.resolve())}var dr=class{anchor;#e=new Map;#r=new Map;#t=new Map;#o=new Set;#n=!0;#i=null;constructor(t,r=!0){this.anchor=t,this.#n=r,this.#i=E}#s=t=>{if(this.#e.has(t)){var r=ie?Xe(this.#i):null;try{var n=this.#e.get(t),i=this.#r.get(n);if(i)Pn(i),this.#o.delete(n);else{var o=this.#t.get(n);o&&(Pn(o.effect),this.#r.set(n,o.effect),this.#t.delete(n),$&&(gn(o.fragment)[Uo]=this.anchor),Tr(gn(o.fragment)),ft(this.anchor,o.fragment),i=o.effect,i.f&=-33554433)}this.#a(t);for(let[a,l]of this.#r){if(a===n||this.#o.has(a))continue;let c=()=>{if(Array.from(this.#e.values()).includes(a)){var h=lr();Fn(l,h),Ne(h,Ye()),this.#t.set(a,{effect:l,fragment:h})}else Ee(l);this.#o.delete(a),this.#r.delete(a)};this.#n||!i?(this.#o.add(a),wr(l,c,!1)):c()}}finally{ie&&Je(r)}}};#a=t=>{for(let n of this.#e.keys())(n===t||!n.linked)&&this.#e.delete(n);let r=Array.from(this.#e.values());for(let[n,i]of this.#t)r.includes(n)||(Ee(i.effect),this.#t.delete(n))};ensure(t,r){var n=I,i=yi();if(r&&!this.#r.has(t)&&!this.#t.has(t))if(i){var o=lr(),a=Ye();Ne(o,a);var l=xe(()=>r(a));l.f|=33554432,n.unskip_new_effect(l),this.#t.set(t,{effect:l,fragment:o})}else this.#r.set(t,xe(()=>r(this.anchor)));if(this.#e.set(n,t),i){for(let[c,p]of this.#r)c===t?n.unskip_effect(p):n.skip_effect(p);for(let[c,p]of this.#t)c===t?n.unskip_effect(p.effect):n.skip_effect(p.effect);n.oncommit(this.#s),n.ondiscard(this.#a)}else S&&(this.anchor=B),this.#s(n)}};function Wt(e,t,r=!1){var n;S&&(n=B,ot());var i=new dr(e),o=r?65536:0;function a(l,c){if(S){var p=Br(n);if(l!==parseInt(p.substring(1))){var h=rr();le(h),i.anchor=h,be(!1),i.ensure(l,c),be(!0);return}}i.ensure(l,c)}ct(()=>{var l=!1;t((c,p=0)=>{l=!0,a(p,c)}),l||a(-1,null)},o)}function Zl(e){var t,r,n="";if(typeof e=="string"||typeof e=="number")n+=e;else if(typeof e=="object")if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(r=Zl(e[t]))&&(n&&(n+=" "),n+=r)}else for(r in e)e[r]&&(n&&(n+=" "),n+=r);return n}function Kl(){for(var e,t,r=0,n="",i=arguments.length;r<i;r++)(e=arguments[r])&&(t=Zl(e))&&(n&&(n+=" "),n+=t);return n}function ur(e){return typeof e=="object"?Kl(e):e??""}var Xl=[...` 	
\r\f\xA0\v\uFEFF`];function Ql(e,t,r){var n=e==null?"":""+e;if(t&&(n=n?n+" "+t:t),r){for(var i of Object.keys(r))if(r[i])n=n?n+" "+i:i;else if(n.length)for(var o=i.length,a=0;(a=n.indexOf(i,a))>=0;){var l=a+o;(a===0||Xl.includes(n[a-1]))&&(l===n.length||Xl.includes(n[l]))?n=(a===0?"":n.substring(0,a))+n.substring(l+1):a=l}}return n===""?null:n}function Jl(e,t=!1){var r=t?" !important;":";",n="";for(var i of Object.keys(e)){var o=e[i];o!=null&&o!==""&&(n+=" "+i+": "+o+r)}return n}function Ls(e){return e[0]!=="-"||e[1]!=="-"?e.toLowerCase():e}function Ps(e,t){if(t){var r="",n,i;if(Array.isArray(t)?(n=t[0],i=t[1]):n=t,e){e=String(e).replaceAll(/\/\*.*?\*\//g,"").trim();var o=!1,a=0,l=!1,c=[];n&&c.push(...Object.keys(n).map(Ls)),i&&c.push(...Object.keys(i).map(Ls));var p=0,h=-1;let m=e.length;for(var u=0;u<m;u++){var d=e[u];if(l?d==="/"&&e[u-1]==="*"&&(l=!1):o?o===d&&(o=!1):d==="/"&&e[u+1]==="*"?l=!0:d==='"'||d==="'"?o=d:d==="("?a++:d===")"&&a--,!l&&o===!1&&a===0){if(d===":"&&h===-1)h=u;else if(d===";"||u===m-1){if(h!==-1){var v=Ls(e.substring(p,h).trim());if(!c.includes(v)){d!==";"&&u++;var _=e.substring(p,u).trim();r+=" "+_+";"}}p=u+1,h=-1}}}}return n&&(r+=Jl(n)),i&&(r+=Jl(i,!0)),r=r.trim(),r===""?null:r}return e==null?null:String(e)}function Qt(e,t){return t}function hu(e,t,r){for(var n=[],i=t.length,o,a=t.length,l=0;l<i;l++){let u=t[l];wr(u,()=>{if(o){if(o.pending.delete(u),o.done.add(u),o.pending.size===0){var d=e.outrogroups;Fs(e,wn(o.done)),d.delete(o),d.size===0&&(e.outrogroups=null)}}else a-=1},!1)}if(a===0){var c=n.length===0&&r!==null&&e.pending.size===0;if(c){var p=r,h=Ln(p);$i(h),Ne(h,p),e.items.clear()}Fs(e,t,!c)}else o={pending:new Set(t),done:new Set},(e.outrogroups??=new Set).add(o)}function ic(e){var t=new Set;for(let r of e.pending.values())for(let n of r)t.add(e.items.get(n).e);return t}function Fs(e,t,r=!0){for(var n=e.pending.size>0?ic(e):void 0,i=0;i<t.length;i++){var o=t[i];if(n?.has(o)){o.f|=33554432;let a=lr();Fn(o,a),o!==e.effect.last&&(fr(e,o.prev,o.next),fr(e,e.effect.last,o),fr(e,o,null))}else Ee(t[i],r)}}function _u(e,t){if(e.outrogroups!==null){for(let r of e.outrogroups)if(r.pending.has(t)||r.done.has(t))return!0}return!1}var ec=new WeakMap,tc={};function rc(){var e=ec.get(E??tc);if(e)return e;var t=Ye();if(E){var r=lr();Ne(r,t)}return ec.set(E??tc,t),t}function At(e,t,r,n,i,o=null){var a=e,l=new Map,c=(t&4)!==0,p=E;if(c){var h=e;a=S?le(tt(h)):Ne(h,Ye())}S&&ot();var u=null,d=cn(()=>{var w=r();return Er(w)?w:w==null?[]:wn(w)});$&&fe(d,"{#each ...}");var v=new Map,_=!0;function m(w){if((T.effect.f&16384)===0){var k=ie?Xe(p):null;try{T.pending.delete(w);var C=s(d);T.fallback=u,gu(T,C,a,t,n),u!==null&&(C.length===0?(u.f&33554432)===0?Pn(u):(u.f^=33554432,ki(u,null,a)):wr(u,()=>{u=null}))}finally{ie&&Je(k)}y()}}function g(w){T.pending.delete(w),(T.effect.f&16384)===0&&y()}function y(){for(var w,k=T.effect.last;k!==null;){var C=k.prev;if((k.f&32)!==0&&k!==u){if((k.f&33554432)===0)break;w??=ic(T),!w.has(k)&&!_u(T,k)&&Ee(k)}k=C}}var x=ct(()=>{var w=s(d),k=w.length;let C=!1;if(S){var A=Br(a)==="[!";A!==(k===0)&&(a=rr(),le(a),be(!1),C=!0)}for(var F=new Set,Y=I,H=yi(),re=0;re<k;re+=1){S&&Me(B)===kt&&Tt(B)==="]"&&(a=B,C=!0,be(!1));var X=w[re],O=n(X,re);if($){var M=n(X,re);O!==M&&Aa(String(re),String(O),String(M))}var L=_?null:l.get(O);L?(L.v&&Zr(L.v,X),L.i&&Zr(L.i,re),H&&Y.unskip_effect(L.e)):(L=mu(l,_?a:rc(),X,O,re,i,t,r),_||(L.e.f|=33554432,H&&Y.unskip_new_effect(L.e)),l.set(O,L)),F.add(O)}if(k===0&&o&&!u&&(_?u=xe(()=>o(a)):(u=xe(()=>o(rc())),u.f|=33554432,H&&Y.unskip_new_effect(u))),H&&u!==null&&(k===0?Y.unskip_effect(u):Y.skip_effect(u)),k>F.size&&($?$u(w,n):qo("","","")),S&&k>0&&le(rr()),!_)if(v.set(Y,F),H){for(let[ne,ve]of l)F.has(ne)||Y.skip_effect(ve.e);Y.oncommit(m),Y.ondiscard(g)}else m(Y);C&&be(!0),s(d)}),T={effect:x,flags:t,items:l,pending:v,outrogroups:null,fallback:u};_=!1,S&&(a=B)}function Ei(e){for(;e!==null&&(e.f&32)===0;)e=e.next;return e}function gu(e,t,r,n,i){var o=(n&8)!==0,a=t.length,l=e.items,c=Ei(e.effect.first),p,h=null,u,d=[],v=[],_,m,g,y;if(o)for(y=0;y<a;y+=1)_=t[y],m=i(_,y),g=l.get(m).e,(g.f&33554432)===0&&(g.nodes?.a?.measure(),(u??=new Set).add(g));for(y=0;y<a;y+=1){if(_=t[y],m=i(_,y),g=l.get(m).e,e.outrogroups!==null)for(let H of e.outrogroups)H.pending.delete(g),H.done.delete(g);if((g.f&8192)!==0&&(Pn(g),o&&(g.nodes?.a?.unfix(),(u??=new Set).delete(g))),(g.f&33554432)!==0)if(g.f^=33554432,g===c)ki(g,null,r);else{var x=h?h.next:c;g===e.effect.last&&(e.effect.last=g.prev),g.prev&&(g.prev.next=g.next),g.next&&(g.next.prev=g.prev),fr(e,h,g),fr(e,g,x),ki(g,x,r),h=g,d=[],v=[],c=Ei(h.next);continue}if(g!==c){if(p!==void 0&&p.has(g)){if(d.length<v.length){var T=v[0],w;h=T.prev;var k=d[0],C=d[d.length-1];for(w=0;w<d.length;w+=1)ki(d[w],T,r);for(w=0;w<v.length;w+=1)p.delete(v[w]);fr(e,k.prev,C.next),fr(e,h,k),fr(e,C,T),c=T,h=C,y-=1,d=[],v=[]}else p.delete(g),ki(g,c,r),fr(e,g.prev,g.next),fr(e,g,h===null?e.effect.first:h.next),fr(e,h,g),h=g;continue}for(d=[],v=[];c!==null&&c!==g;)(p??=new Set).add(c),v.push(c),c=Ei(c.next);if(c===null)continue}(g.f&33554432)===0&&d.push(g),h=g,c=Ei(g.next)}if(e.outrogroups!==null){for(let H of e.outrogroups)H.pending.size===0&&(Fs(e,wn(H.done)),e.outrogroups?.delete(H));e.outrogroups.size===0&&(e.outrogroups=null)}if(c!==null||p!==void 0){var A=[];if(p!==void 0)for(g of p)(g.f&8192)===0&&A.push(g);for(;c!==null;)(c.f&8192)===0&&c!==e.fallback&&A.push(c),c=Ei(c.next);var F=A.length;if(F>0){var Y=(n&4)!==0&&a===0?r:null;if(o){for(y=0;y<F;y+=1)A[y].nodes?.a?.measure();for(y=0;y<F;y+=1)A[y].nodes?.a?.fix()}hu(e,A,Y)}}o&&Se(()=>{if(u!==void 0)for(g of u)g.nodes?.a?.apply()})}function mu(e,t,r,n,i,o,a,l){var c=(a&1)!==0?(a&16)===0?vn(r,!1,!1):je(r):null,p=(a&2)!==0?je(i):null;return $&&c&&(c.trace=()=>{l()[p?.v??i]}),{v:c,i:p,e:xe(()=>(o(t,c??r,p??i,l),()=>{e.delete(n)}))}}function ki(e,t,r){if(e.nodes)for(var n=e.nodes.start,i=e.nodes.end,o=t&&(t.f&33554432)===0?t.nodes.start:r;n!==null;){var a=Ie(n);if(ft(o,n),n===i)return;n=a}}function fr(e,t,r){t===null?e.effect.first=r:t.next=r,r===null?e.effect.last=t:r.prev=t}function $u(e,t){let r=new Map,n=e.length;for(let i=0;i<n;i++){let o=t(e[i],i);if(r.has(o)){let a=String(r.get(o)),l=String(i),c=String(o);c.startsWith("[object ")&&(c=null),qo(a,l,c)}r.set(o,i)}}function Nt(e,t,...r){var n=new dr(e);ct(()=>{let i=t()??null;$&&i==null&&za(),n.ensure(i,i&&(o=>i(o,...r)))},65536)}function Ti(e,t,r){var n;S&&(n=B,ot());var i=new dr(e);ct(()=>{var o=t()??null;if(S){var a=Br(n),l=a==="[",c=o!==null;if(l!==c){var p=rr();le(p),i.anchor=p,be(!1),i.ensure(o,o&&(h=>r(h,o))),be(!0);return}}i.ensure(o,o&&(h=>r(h,o)))},65536)}function Ge(e,t){var r=void 0,n;bs(()=>{r!==(r=t())&&(n&&(Ee(n),n=null),r&&(n=xe(()=>{Gt(()=>r(e))})))})}function ee(e,t,r,n,i,o){var a=e[Jn];if(S||a!==r||a===void 0||ie&&E!==null){var l=Ql(r,n,o);(!S||l!==Or(e,"class"))&&(l==null?Ir(e,"class"):t?e.className=l:_n(e,"class",l)),e[Jn]=r}else if(o&&i!==o)for(var c in o){var p=!!o[c];(i==null||p!==!!i[c])&&ml(e,c,p)}return o}function zs(e,t={},r,n){for(var i in r){var o=r[i];t[i]!==o&&(r[i]==null?vs(e,i):ps(e,i,o,n))}}function Jr(e,t,r,n){var i=e[Qn];if(S||i!==t||ie&&E!==null){var o=Ps(t,n);(!S||o!==Or(e,"style"))&&(o==null?Ir(e,"style"):hs(e,o)),e[Qn]=t}else n&&(Array.isArray(n)?(zs(e,r?.[0],n[0]),zs(e,r?.[1],n[1],"important")):zs(e,r,n));return n}var Ou=Symbol("is custom element"),Iu=Symbol("is html"),Mu=Bo?"link":"LINK";function vt(e,t,r,n){var i=Lu(e);if(S&&(i[t]=Or(e,t),t==="src"||t==="srcset"||t==="href"&&bi(e)===Mu)){n||zu(e,t,r??"");return}var o=i[t];o!==(i[t]=r)&&(t==="loading"&&(e[$a]=r),r==null?Ir(e,t):typeof r!="string"&&Fu(e).has(t)?e[t]=r:S&&(typeof r=="number"||typeof r=="boolean")&&o===String(r)||_n(e,t,r))}function Lu(e){return e[Fi]??={[Ou]:bi(e).includes("-"),[Iu]:E==null&&e.namespaceURI===Hi}}var sc=new Map,Pu=new Set;function Fu(e){if(E)return Pu;var t=Or(e,"is")||bi(e),r=sc.get(t);if(r)return r;sc.set(t,r=new Set);for(var n,i=e,o=Element.prototype;o!==i;){n=Fo(i);for(var a in n)n[a].set&&a!=="innerHTML"&&a!=="textContent"&&a!=="innerText"&&r.add(a);i=xn(i)}return r}function zu(e,t,r){!$||E!=null||t==="srcset"&&Hu(e,r)||Hs(Or(e,t)??"",r)||Ea(t,e.outerHTML.replace(e.innerHTML,e.innerHTML&&"..."),String(r))}function Hs(e,t){return e===t||E!=null?!0:new URL(e,document.baseURI).href===new URL(t,document.baseURI).href}function ac(e){return e.split(",").map(t=>t.trim().split(" ").filter(Boolean))}function Hu(e,t){if(E!=null)return!0;var r=ac(e.srcset),n=ac(t);return n.length===r.length&&n.every(([i,o],a)=>o===r[a][1]&&(Hs(r[a][0],i)||Hs(i,r[a][0])))}function Us(e,t){return e===t||e?.[Et]===t}function Lr(e=ii(),t,r,n){var i=q.r,o=R;return Gt(()=>{var a,l;return wt(()=>{a=l,l=n?.()||[],D(()=>{Us(r(...l),e)||(t(e,...l),a&&Us(r(...a),e)&&t(null,...a))})}),()=>{let c=o;for(;c!==i&&c.parent!==null&&c.parent.f&33554432;)c=c.parent;let p=()=>{l&&Us(r(...l),e)&&t(null,...l)},h=c.teardown;c.teardown=()=>{p(),h?.()}}}),e}var Eo=!1;function Bs(e){var t=Eo;try{return Eo=!1,[e(),Eo]}finally{Eo=t}}var Wu={get(e,t){if(!e.exclude.has(t))return e.props[t]},set(e,t){return $&&Ua(`${e.name}.${String(t)}`),!1},getOwnPropertyDescriptor(e,t){if(!e.exclude.has(t)&&t in e.props)return{enumerable:!0,configurable:!0,value:e.props[t]}},has(e,t){return e.exclude.has(t)?!1:t in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(t=>!e.exclude.has(t))}};function Vs(e,t,r){return new Proxy($?{props:e,exclude:t,name:r}:{props:e,exclude:t},Wu)}function Oe(e,t,r,n){var i=!Cr||(r&2)!==0,o=(r&8)!==0,a=(r&16)!==0,l=n,c=!0,p=void 0,h=()=>a&&i?(p??=Yr(n),s(p)):(c&&(c=!1,l=a?D(n):n),l);let u;if(o){var d=Et in e||Xn in e;u=It(e,t)?.set??(d&&t in e?w=>e[t]=w:void 0)}var v,_=!1;o?[v,_]=Bs(()=>e[t]):v=e[t],v===void 0&&n!==void 0&&(v=h(),u&&(i&&Ha(t),u(v)));var m;if(i?m=()=>{var w=e[t];return w===void 0?h():(c=!0,w)}:m=()=>{var w=e[t];return w!==void 0&&(l=void 0),w===void 0?l:w},i&&(r&4)===0)return m;if(u){var g=e.$$legacy;return(function(w,k){return arguments.length>0?((!i||!k||g||_)&&u(k?m():w),w):m()})}var y=!1,x=((r&1)!==0?Yr:cn)(()=>(y=!1,m()));$&&(x.label=t),o&&s(x);var T=R;return(function(w,k){if(arguments.length>0){let C=k?s(x):i&&o?Ve(w):w;return b(x,C),y=!0,l!==void 0&&(l=C),w}return Dt&&y||(T.f&16384)!==0?x.v:s(x)})}function cc(e){return new Ys(e)}var Ys=class{#e;#r;constructor(t){var r=new Map,n=(a,l)=>{var c=vn(l,!1,!1);return r.set(a,c),c};let i=new Proxy({...t.props||{},$$events:{}},{get(a,l){return s(r.get(l)??n(l,Reflect.get(a,l)))},has(a,l){return l===Xn?!0:(s(r.get(l)??n(l,Reflect.get(a,l))),Reflect.has(a,l))},set(a,l,c){return b(r.get(l)??n(l,c),c),Reflect.set(a,l,c)}}),o={target:t.target,anchor:t.anchor,props:i,context:t.context,intro:t.intro??!1,recover:t.recover,transformError:t.transformError};this.#r=t.hydrate?Ms(t.component,o):Hn(t.component,o),!Pe&&(!t?.props?.$$host||t.sync===!1)&&jr(),this.#e=i.$$events;for(let a of Object.keys(this.#r))a==="$set"||a==="$destroy"||a==="$on"||We(this,a,{get(){return this.#r[a]},set(l){this.#r[a]=l},enumerable:!0});this.#r.$set=a=>{Object.assign(i,a)},this.#r.$destroy=()=>{xi(this.#r)}}$set(t){this.#r.$set(t)}$on(t,r){this.#e[t]=this.#e[t]||[];let n=(...i)=>r.call(this,...i);return this.#e[t].push(n),()=>{this.#e[t]=this.#e[t].filter(i=>i!==n)}}$destroy(){this.#r.$destroy()}};var tf;typeof HTMLElement=="function"&&(tf=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(e,t,r){super(),this.$$ctor=e,this.$$s=t,r&&(this.$$shadowRoot=this.attachShadow(r))}addEventListener(e,t,r){if(this.$$l[e]=this.$$l[e]||[],this.$$l[e].push(t),this.$$c){let n=this.$$c.$on(e,t);this.$$l_u.set(t,n)}super.addEventListener(e,t,r)}removeEventListener(e,t,r){if(super.removeEventListener(e,t,r),this.$$c){let n=this.$$l_u.get(t);n&&(n(),this.$$l_u.delete(t))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let e=function(n){return i=>{let o=yr("slot");n!=="default"&&(o.name=n),j(i,o)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let t={},r=rf(this);for(let n of this.$$s)n in r&&(n==="default"&&!this.$$d.children?(this.$$d.children=e(n),t.default=!0):t[n]=e(n));for(let n of this.attributes){let i=this.$$g_p(n.name);i in this.$$d||(this.$$d[i]=qs(i,n.value,this.$$p_d,"toProp"))}for(let n in this.$$p_d)!(n in this.$$d)&&this[n]!==void 0&&(this.$$d[n]=this[n],delete this[n]);this.$$c=cc({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:t,$$host:this}}),this.$$me=ys(()=>{wt(()=>{this.$$r=!0;for(let n of Po(this.$$c)){if(!this.$$p_d[n]?.reflect)continue;this.$$d[n]=this.$$c[n];let i=qs(n,this.$$d[n],this.$$p_d,"toAttribute");i==null?this.removeAttribute(this.$$p_d[n].attribute||n):this.setAttribute(this.$$p_d[n].attribute||n,i)}this.$$r=!1})});for(let n in this.$$l)for(let i of this.$$l[n]){let o=this.$$c.$on(n,i);this.$$l_u.set(i,o)}this.$$l={}}}attributeChangedCallback(e,t,r){this.$$r||(e=this.$$g_p(e),this.$$d[e]=qs(e,r,this.$$p_d,"toProp"),this.$$c?.$set({[e]:this.$$d[e]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(e){return Po(this.$$p_d).find(t=>this.$$p_d[t].attribute===e||!this.$$p_d[t].attribute&&t.toLowerCase()===e)||e}});function qs(e,t,r,n){let i=r[e]?.type;if(t=i==="Boolean"&&typeof t!="boolean"?t!=null:t,!n||!r[e])return t;if(n==="toAttribute")switch(i){case"Object":case"Array":return t==null?null:JSON.stringify(t);case"Boolean":return t?"":null;case"Number":return t??null;default:return t}else switch(i){case"Object":case"Array":return t&&JSON.parse(t);case"Boolean":return t;case"Number":return t!=null?+t:t;default:return t}}function rf(e){let t={};return e.childNodes.forEach(r=>{t[r.slot||"default"]=!0}),t}if($){let e=function(t){if(!(t in globalThis)){let r;Object.defineProperty(globalThis,t,{configurable:!0,get:()=>{if(r!==void 0)return r;Ba(t)},set:n=>{r=n}})}};e("$state"),e("$effect"),e("$derived"),e("$inspect"),e("$props"),e("$bindable")}function dc(){return P===null&&Pa(),Ol(P)}function ko(e){q===null&&ri("onMount"),Cr&&q.l!==null?sf(q).m.push(e):Bt(()=>{let t=D(e);if(typeof t=="function")return t})}function sf(e){var t=e.l;return t.u??={a:[],b:[],m:[]}}vl();typeof window<"u"&&((globalThis.__svelte??={}).v??=new Set).add("5");var Un=class extends Map{#e=new Map;#r=G(0);#t=G(0);#o=Kt||-1;constructor(t){if(super(),$&&(t=new Map(t),fe(this.#r,"SvelteMap version"),fe(this.#t,"SvelteMap.size")),t){for(var[r,n]of t)super.set(r,n);this.#t.v=super.size}}#n(t){return Kt===this.#o?G(t):je(t)}has(t){var r=this.#e,n=r.get(t);if(n===void 0)if(super.has(t))n=this.#n(0),$&&fe(n,`SvelteMap get(${On(t)})`),r.set(t,n);else return s(this.#r),!1;return s(n),!0}forEach(t,r){this.#i(),super.forEach(t,r)}get(t){var r=this.#e,n=r.get(t);if(n===void 0)if(super.has(t))n=this.#n(0),$&&fe(n,`SvelteMap get(${On(t)})`),r.set(t,n);else{s(this.#r);return}return s(n),super.get(t)}getOrInsert(t,r){return super.has(t)||this.set(t,r),this.get(t)}getOrInsertComputed(t,r){return super.has(t)||this.set(t,r(t)),this.get(t)}set(t,r){var n=this.#e,i=n.get(t),o=super.get(t),a=super.set(t,r),l=this.#r;if(i===void 0)i=this.#n(0),$&&fe(i,`SvelteMap get(${On(t)})`),n.set(t,i),b(this.#t,super.size),Be(l);else if(o!==r){Be(i);var c=l.reactions===null?null:new Set(l.reactions),p=c===null||!i.reactions?.every(h=>c.has(h));p&&Be(l)}return a}delete(t){var r=this.#e,n=r.get(t),i=super.delete(t);return n!==void 0&&(r.delete(t),b(n,-1)),i&&(b(this.#t,super.size),Be(this.#r)),i}clear(){if(super.size!==0){super.clear();var t=this.#e;b(this.#t,0);for(var r of t.values())b(r,-1);Be(this.#r),t.clear()}}#i(){s(this.#r);var t=this.#e;if(this.#t.v!==t.size){for(var r of super.keys())if(!t.has(r)){var n=this.#n(0);$&&fe(n,`SvelteMap get(${On(r)})`),t.set(r,n)}}for([,n]of this.#e)s(n)}keys(){return s(this.#r),super.keys()}values(){return this.#i(),super.values()}entries(){return this.#i(),super.entries()}[Symbol.iterator](){return this.entries()}get size(){return s(this.#t),super.size}};var uc=Symbol("replace"),To=class extends URLSearchParams{#e=$?fe(G(0),"SvelteURLSearchParams version"):G(0);#r=fc();#t=!1;#o(){if(!this.#r||this.#t)return;this.#t=!0;let t=super.toString();this.#r.search=t&&`?${t}`,this.#t=!1}[uc](t){if(!this.#t&&t.toString()!==super.toString()){this.#t=!0;for(let r of[...super.keys()])super.delete(r);for(let[r,n]of t)super.append(r,n);Be(this.#e),this.#t=!1}}append(t,r){super.append(t,r),this.#o(),Be(this.#e)}delete(t,r){var n=super.has(t,r);super.delete(t,r),n&&(this.#o(),Be(this.#e))}get(t){return s(this.#e),super.get(t)}getAll(t){return s(this.#e),super.getAll(t)}has(t,r){return s(this.#e),super.has(t,r)}keys(){return s(this.#e),super.keys()}forEach(t,r){s(this.#e),super.forEach(t,r)}set(t,r){var n=super.getAll(t);super.set(t,r);var i=super.getAll(t);(n.length!==i.length||n.some((o,a)=>o!==i[a]))&&(this.#o(),Be(this.#e))}sort(){super.sort(),this.#o(),Be(this.#e)}toString(){return s(this.#e),super.toString()}values(){return s(this.#e),super.values()}entries(){return s(this.#e),super.entries()}[Symbol.iterator](){return this.entries()}get size(){return s(this.#e),super.size}};var lf=null;function fc(){return lf}function sa(e,t=void 0){return function(r){return r.key==="Enter"||r.key===" "&&!r.preventDefault()?e.call(t,r):void 0}}function ke(...e){return Object.assign(...e)}function Qr(e){return Object.keys(e)}function cf(e){return Object.entries(e)}function Qs(e,t){return Object.hasOwn(e,t)}function Sc(e){return Math.floor(e)}function df(e){return Math.ceil(e)}function Vn(...e){return Math.min(...e)}function Pr(...e){return Math.max(...e)}function uf(){return Symbol("ec")}function $n(e){return e.length}function Fr(e){return!$n(e)}function Di(e=new Date){return-e.getTimezoneOffset()}function Wn(e){return Array.isArray(e)}function Te(e){return typeof e=="function"}function Rc(e){if(typeof e!="object"||e===null)return!1;let t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}function aa(e){return e instanceof Date}var Ro=e=>e;function ff(e){return t=>t===void 0?void 0:e(t)}var pc=new WeakMap,pf=1;function Ac(e){let t=pc.get(e);return t||(t=pf++,pc.set(e,t)),t}function Nc(e){return{url:e.url?.replace(/&+$/,"")||"",method:e.method?.toUpperCase()||"GET",extraParams:e.extraParams??{}}}function jt(e,t){return t?null:Te(e)?r=>{let n=e(r);return Gs??=new ResizeObserver(vf),Gs.observe(r),()=>{Gs.unobserve(r),Te(n)&&n()}}:r=>{typeof e=="string"?r.innerText=e:e?.domNodes?r.replaceChildren(...e.domNodes):e?.html&&(r.innerHTML=e.html)}}var Gs,vc=new WeakMap,ea=new Set,hc;function vf(e){for(let{target:t,contentRect:{height:r}}of e)vc.get(t)!==r&&(vc.set(t,r),hc??=requestAnimationFrame(()=>{hc=void 0;for(let n of ea)n()}))}function hf(e){return()=>(ea.add(e),()=>{ea.delete(e)})}function _f(e){return t=>{let r=n=>{t&&!t.contains(n.target)&&t.dispatchEvent(new CustomEvent(e+"outside",{detail:{jsEvent:n}}))};return document.addEventListener(e,r,!0),()=>{document.removeEventListener(e,r,!0)}}}function gf(e,t=!1){return r=>{let n,i=new ResizeObserver(o=>{for(let a of o){if(t){let{inlineSize:l}=a.contentBoxSize?.[0]??{inlineSize:a.contentRect.width};if(l===n)continue;n=l}e(r,a)}});return i.observe(r),()=>{i.unobserve(r)}}}function jn(e,t,r,n){return n?{snippet:n,arg:t?.()}:{content:(Te(e)?e(t?.()):e)??(Te(r)?r():r)}}var _c=new Map,gc=new Map;function Oc(e){let t=_c.get(e);if(t===void 0){try{t=new Intl.DateTimeFormat("en-US",{timeZone:e,hourCycle:"h23",era:"short",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"})}catch{t=null}_c.set(e,t)}return t}function mf(e){return!!Oc(e)}function Si(e,t){if(!(Math.abs(t)<=864e13))return NaN;let r=gc.get(e)??gc.set(e,new Map).get(e),n=Sc(t/(en*1e3)),i=r.get(n);if(i===void 0){let o=Ws(e,n*en*1e3);i=o===Ws(e,Vn((n+1)*86400*1e3-1,864e13))?o:null,r.set(n,i)}return i??Ws(e,t)}function Ws(e,t){let{era:r,...n}=Object.fromEntries(Oc(e).formatToParts(t).map(({type:o,value:a})=>[o,o==="era"?a:+a])),i=new Date(0).setUTCFullYear(r==="BC"?1-n.year:n.year,n.month-1,n.day);return i+=((n.hour*60+n.minute)*60+n.second)*1e3,Math.round((i-t)/6e4)}function $f(e,t){let r=Si(e,t-en*1e3),n=Si(e,t+en*1e3);if(r===n)return r;let i=[r,n].filter(o=>Si(e,t-o*6e4)===o);return Fr(i)?r:Pr(...i)}var en=86400;function bn(e,t=void 0){return aa(e)?kf(e,t):Tf(e,t)}function la(e){let t=new Date;return da(Hc(t),Di(t),e)}function Yn(e){return Ot(la(e))}function Bn(e){if(typeof e=="number")e={seconds:e};else if(typeof e=="string"){let r=0,n=2;for(let i of e.split(":",3))r+=parseInt(i,10)*Math.pow(60,n--);e={seconds:r}}else aa(e)&&(e={hours:e.getUTCHours(),minutes:e.getUTCMinutes(),seconds:e.getUTCSeconds()});let t=e.weeks||e.week||0;return{years:e.years||e.year||0,months:e.months||e.month||0,days:t*7+(e.days||e.day||0),seconds:(e.hours||e.hour||0)*60*60+(e.minutes||e.minute||0)*60+(e.seconds||e.second||0),inWeeks:!!t}}function Z(e){let t=new Date(Vt(e));return Zn(t,ua(e)),t}function xt(e,t,r=1){e.setUTCFullYear(e.getUTCFullYear()+r*t.years);let n=e.getUTCMonth()+r*t.months;for(e.setUTCMonth(n),n%=12,n<0&&(n+=12);e.getUTCMonth()!==n;)ca(e);return e.setUTCDate(e.getUTCDate()+r*t.days),e.setUTCSeconds(e.getUTCSeconds()+r*t.seconds),e}function yf(e,t,r=1){return xt(e,t,-r)}function tr(e,t=1){return e.setUTCDate(e.getUTCDate()+t),e}function ca(e,t=1){return tr(e,-t)}function Ot(e){return e.setUTCHours(0,0,0,0),e}function Ke(e){return new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds())}function zr(e,t=19){return e.toISOString().substring(0,t)}function Vt(e){return e.getTime()}function nt(e,...t){return t.every(r=>Vt(e)===Vt(r))}function bf(e,t){let r=t-e.getUTCDay();return e.setUTCDate(e.getUTCDate()+(r>=0?r:r+7)),e}function Ic(e,t){let r=t-e.getUTCDay();return e.setUTCDate(e.getUTCDate()+(r<=0?r:r-7)),e}function mc(e){return typeof e=="string"&&e.length<=10}function wf(e,t){return e.setUTCHours(t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds(),0),e}function Ze(e){return e.seconds}function Mc(e,t,r){return xt(e,t),Uc(e,r,tr),e}function Lc(e,t,r){return yf(e,t),Uc(e,r,ca),e}function Pc(e,t){e=Z(e),t===0?e.setUTCDate(e.getUTCDate()+6-e.getUTCDay()):e.setUTCDate(e.getUTCDate()+4-(e.getUTCDay()||7));let r=new Date(Date.UTC(e.getUTCFullYear(),0,1));return Math.ceil(((e-r)/1e3/en+1)/7)}function xf(e,t,r,n){return jn(r,()=>({date:Ke(t),week:e}),()=>"W"+String(e).padStart(2,"0"),n)}function Fc(e,t={}){let r=e.match(/(?:Z|([+-])(\d{2}):?(\d{2}))$/);if(r)return ke(t,r),r[1]?+(r[1]+"1")*(+r[2]*60+ +r[3]):0}function Ef(e){return/^(?:Z|[+-]\d{2}:?\d{2})$/.test(e)?Fc(e):void 0}function da(e,t,r){return typeof r=="string"?(js(e,-t),r=r==="local"?Di(e):Si(r,Vt(e)),js(e,r)):r!==t&&js(e,r-t),Zn(e,r)}function Oo(e,t,r=void 0){return t==="local"?r?Di(r):(Vt(e)-Vt(Ke(e)))/6e4:typeof t=="string"?r&&Si(t,Vt(r))===Di(r)?Di(r):$f(t,Vt(e)):t}var zc=Symbol("ec");function Zn(e,t){return e[zc]=t,e}function ua(e){return e[zc]}function Hc(e){return new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds()))}function kf(e,t=void 0){let r=Hc(e);return Zn(r,Oo(r,t,e))}function Tf(e,t=void 0){let r={},n=Fc(e,r);n!==void 0&&(e=e.substring(0,r.index));let i=e.match(/\d+/g),o=new Date(Date.UTC(+i[0],+i[1]-1,+i[2],+i[3]||0,+i[4]||0,+i[5]||0));return t!==void 0&&n!==void 0?da(o,n,t):Zn(o,n??Oo(o,t))}function js(e,t){e.setUTCMinutes(e.getUTCMinutes()+t)}function Uc(e,t,r){if(t.length&&t.length<7)for(;t.includes(e.getUTCDay());)r(e)}var fa=uf();function Bc(e,t){e[fa]=t}function Cf(e){return!!e?.[fa]}function Vc(e){return e[fa]}function Yc(e,t,r,n=[]){let i=document.createElement(e);i.className=t,typeof r=="string"?i.innerText=r:r.domNodes?i.replaceChildren(...r.domNodes):r.html&&(i.innerHTML=r.html);for(let o of n)i.setAttribute(...o);return i}function Do(e){return e.getBoundingClientRect()}function Ci(e){return Do(e).height}function qc(e,t,r=document,n=[]){n.push(r);for(let i of r.elementsFromPoint(e,t)){if(Cf(i))return i;if(i.shadowRoot&&!n.includes(i.shadowRoot)){let o=qc(e,t,i.shadowRoot,n);if(o)return o}}return null}function ta(e,t=void 0){return function(r){r.stopPropagation(),e&&e.call(t,r)}}function Df(e,t,r,n){return{type:e,title:t,currentStart:r.start,currentEnd:r.end,activeStart:n.start,activeEnd:n.end,calendar:void 0}}function xr(e){return e=ke({},e),e.currentStart=Ke(e.currentStart),e.currentEnd=Ke(e.currentEnd),e.activeStart=Ke(e.activeStart),e.activeEnd=Ke(e.activeEnd),e}var Sf=1;function Ao(e,t=void 0){let r=[];for(let n of e){if(n.start==null)continue;let i=bn(n.start,t),o={id:n.id!=null?String(n.id):`{generated-${Sf++}}`,resourceIds:Zs(n,"resourceId").map(String),allDay:n.allDay??(mc(n.start)&&(n.end==null||mc(n.end))),start:i,end:n.end==null?Z(i):bn(n.end,t),title:n.title??"",editable:n.editable,startEditable:n.startEditable,durationEditable:n.durationEditable,display:n.display??"auto",layoutGroup:n.layoutGroup?.toString(),extendedProps:n.extendedProps??{},backgroundColor:n.backgroundColor??n.color,textColor:n.textColor,classNames:Zs(n,"className"),styles:Zs(n,"style")};if(o.allDay){Ot(o.start);let a=Z(o.end);Ot(o.end),(!nt(o.end,a)||nt(o.end,o.start))&&tr(o.end)}r.push(o)}return r}function Zs(e,t){let r=e[t+"s"]??e[t]??[];return Wn(r)?r:[r]}function Rf(e){return e.map(t=>({events:t.events,...Nc(t)}))}function Af(e,t,r){return r.formatRange(e.start,t&&e.event.display!=="pointer"&&!e.zeroDuration?e.end:null)}function Nf(e,t,r){let n;switch(e.event.display){case"background":n=[];break;case"pointer":n=e.event.allDay?[]:[$c(t,e,r)];break;default:n=[...e.event.allDay?[]:[$c(t,e,r)],Yc("h4",r.eventTitle,e.event.title)]}return{domNodes:n}}function $c(e,t,r){return Yc("time",r.eventTime,e,[["datetime",zr(t.start)]])}function Of(e,t,r){let n=t.classNames;return e&&(Te(e)&&(e=e({event:er(t),view:xr(r)})),n=[...Wn(e)?e:[e],...n]),n}function er(e){return If(e,Ke)}function If(e,t){return e=ke({},e),e.start=t(e.start),e.end=t(e.end),e}var yc=0;function Mf(e,t){e.length=t.length,++yc;for(let r of e)r?.reposition(yc)}function qn(e,t,r,n=void 0){return(!n||e.resourceIds.includes(n.id))&&e.start<r&&e.end>t}function Gc(e){return Wc(e)||Lf(e)||jc(e)}function pr(e){return e==="background"}function Wc(e){return e==="preview"}function Lf(e){return e==="ghost"}function jc(e){return e==="pointer"}function Ri(e,t,r){return t=e.start>t?e.start:t,r=e.end<r?e.end:r,{start:t,end:r,event:e,zeroDuration:nt(t,r)}}function Gn(e,t,r=!0){let n=[],i,o,a,l;for(let{gridColumn:c,gridRow:p,resource:h,dayStart:u,dayEnd:d,disabled:v}of t)!v&&qn(e,u,d,h)&&(n.push(u),i=d,o||(o=c,a=p,l=h));if(n.length){let c=Ri(e,n[0],i);return ke(c,{gridColumn:o,gridRow:a,resource:l,dates:n}),r&&pa(c),[c]}return[]}function Zc(e){let t={},r={};for(let n of e){let{gridColumn:i,gridRow:o}=n;for(let l=1;l<n.dates.length;++l){let c=`${o}_${i+l}`;r[c]?r[c].chunks.push(n):r[c]={sorted:!1,chunks:[n]}}let a=`${o}_${i}`;n.long=r[a],n.prev=t[a],t[a]=n}}function Pf(e,t,r=1,n=1){e.prev&&(r=e.prev.bottom+n);let i=r+t;if(e.long){let o=e.long;o.sorted||(o.chunks.sort((a,l)=>a.top-l.top),o.sorted=!0);for(let a of o.chunks)if(r<a.bottom&&i>a.top){let l=a.bottom-r+n;r+=l,i+=l}}return ke(e,{top:r,bottom:i}),r}function pa(e){let{event:t,gridColumn:r,gridRow:n}=e;e.id=`${Ac(t)}-${r}-${n}`}function tn(e,t){return()=>{let{options:{locale:r}}=e,n=e.options[t],i;return D(()=>{if(Te(n))i=o=>n(Ke(o));else{let o=Kc(r,n);i=a=>{let[l,c]=o(a);return l.format(c)}}}),{format:i}}}function Kc(e,t){let r=new Intl.DateTimeFormat(e,t),n;return(i,o)=>{let a=Ke(i),l=o&&Ke(o);return bc(a,i)&&(!o||bc(l,o))?[r,a,l]:[n??=new Intl.DateTimeFormat(e,{...t,timeZone:"UTC"}),i,o]}}function bc(e,t){return e.getDate()===t.getUTCDate()&&e.getHours()===t.getUTCHours()&&e.getMinutes()===t.getUTCMinutes()}function wc(e,t,r=!1){return()=>{let{options:{locale:n}}=e,i=e.options[t],o;return D(()=>{if(Te(i))o=(a,l)=>i(Ke(a),l&&Ke(l));else{let a=Kc(n,i);o=(l,c)=>{c&&r&&(c=wf(Z(l),c));let p;if([p,l,c]=a(l,c),!c)return p.format(l);if(l<=c)return p.formatRange(l,c);{let h=p.formatRangeToParts(c,l),u="",d=["startRange","endRange"],v=[!1,!1];for(let _ of h){let m=d.indexOf(_.source);m>=0?v[m]||(u+=Ff(d[1-m],h),v[m]=!0):u+=_.value}return u}}}}),{formatRange:o}}}function Ff(e,t){let r="";for(let n of t)n.source==e&&(r+=n.value);return r}function Xc(e){return Io(e,"day")}function Jc(e){return Io(e,"week")}function Qc(e){return Io(e,"month")}function zf(e){return Io(e,"year")}function Io(e,t){return{...e,next:"Next "+t,prev:"Previous "+t}}function yn(e){return t=>({...t,view:e})}function Hf(e){let t,r;return e&&({start:t,end:r}=e,t&&(t=Ot(bn(t))),r&&(r=Ot(bn(r)))),{start:t,end:r}}function Kn(e,t){return t.start&&e<t.start||t.end&&e>t.end}function va(e){let t=[];return ed(e,0,void 0,t),t}function ed(e,t,r,n){let i=[];for(let o of e){let a=Uf(o);i.push(a),n.push(a);let l={level:t,parent:r,children:[]};Bc(a,l),o.children&&(l.children=ed(o.children,t+1,a,n))}return i}function Uf(e){return{id:e.id!=null?String(e.id):"",title:e.title??"",eventBackgroundColor:td(e),eventTextColor:rd(e),expanded:e.expanded,extendedProps:e.extendedProps??{}}}function td(e){return e?.eventBackgroundColor}function rd(e){return e?.eventTextColor}function xc(e,t){return Fr(e.resourceIds)?void 0:t.find(r=>e.resourceIds.includes(r.id))}function nd(e,t,r,n,i){let o=[];e=Z(e);let a=Z(e);for(xt(e,n.min),xt(a,n.max);e<a;)o.push([zr(e),i.format(e)]),xt(e,t,r);let l=Sc((e-a)/1e3/Ze(t));return l&&l!==r&&(o.at(-1)[2]=r-l),o}function id(e,t,r,n,i){let o=Bn(e),a=Bn(t);if(r){let l=Bn(Vn(Ze(o),Pr(0,Ze(a)-en))),c=Bn(Pr(Ze(a),Ze(l)+en)),p=Te(r?.eventFilter)?r.eventFilter:h=>!pr(h.display);e:for(let h of n){let u=xt(Z(h),o),d=xt(Z(h),a),v=xt(Z(h),l),_=xt(Z(h),c);for(let m of i)if(!m.allDay&&p(m)&&m.start<_&&m.end>v){if(m.start<u){let g=Pr((m.start-h)/1e3,Ze(l));g<Ze(o)&&(o.seconds=g)}if(m.end>d){let g=Vn((m.end-h)/1e3,Ze(c));g>Ze(a)&&(a.seconds=g)}if(Ze(o)===Ze(l)&&Ze(a)===Ze(c))break e}}}return{min:o,max:a}}function No(e){let t=0,r=G(Ve(t));return od(e,()=>s(r),()=>!0,()=>b(r,++t,!0))}function Bf(e){let t=0,r=Ve({});return od(e,n=>r[n],(n,i)=>n!==i,n=>r[n]=++t)}function od(e,t,r,n){return new Proxy(e,{get(i,o,a){return Qs(i,o)&&t(o),Reflect.get(i,o,a)},set(i,o,a,l){let c=r(i[o],a),p=Reflect.set(i,o,a,l);return c&&n(o),p}})}function Vf(e){let t={buttonText:{today:"today"},customButtons:{},customScrollbars:!1,date:void 0,dateIncrement:void 0,datesSet:void 0,dayCellContent:void 0,dayHeaderFormat:{weekday:"short",month:"numeric",day:"numeric"},dayHeaderAriaLabelFormat:{dateStyle:"full"},displayEventEnd:!0,duration:{weeks:1},events:[],eventAllUpdated:void 0,eventBackgroundColor:void 0,eventClassNames:void 0,eventClick:void 0,eventColor:void 0,eventContent:void 0,eventDidMount:void 0,eventFilter:void 0,eventGap:1,eventMouseEnter:void 0,eventMouseLeave:void 0,eventOrder:void 0,eventOrderStrict:!1,eventSources:[],eventTextColor:void 0,eventTimeFormat:{hour:"numeric",minute:"2-digit"},filterEventsWithResources:!1,firstDay:0,headerToolbar:{start:"title",center:"",end:"today prev,next"},height:void 0,hiddenDays:[],highlightedDates:[],icons:{},lazyFetching:!0,loading:void 0,locale:void 0,refetchResourcesOnNavigate:!1,resources:[],selectable:!1,theme:{active:"ec-active",bgEvent:"ec-bg-event",bgEvents:"ec-bg-events",body:"ec-body",button:"ec-button",buttonGroup:"ec-button-group",calendar:"ec",colHead:"ec-col-head",customScrollbars:"ec-custom-scrollbars",day:"ec-day",dayHead:"ec-day-head",disabled:"ec-disabled",endClipped:"ec-end-clipped",event:"ec-event",eventBody:"ec-event-body",eventTime:"ec-event-time",eventTitle:"ec-event-title",events:"ec-events",grid:"ec-grid",header:"ec-header",hidden:"ec-hidden",highlight:"ec-highlight",icon:"ec-icon",main:"ec-main",noBeb:"ec-no-beb",noIeb:"ec-no-ieb",startClipped:"ec-start-clipped",today:"ec-today",title:"ec-title",toolbar:"ec-toolbar",view:"",weekdays:["ec-sun","ec-mon","ec-tue","ec-wed","ec-thu","ec-fri","ec-sat"],weekNumber:"ec-week-number"},timeZone:"local",titleFormat:{year:"numeric",month:"short",day:"numeric"},validRange:void 0,view:void 0,viewDidMount:void 0,views:{}};for(let r of e)r.createOptions?.(t);return t}function Yf(e){let t={date:r=>r===void 0?Yn("local"):Ot(bn(r)),dateIncrement:ff(Bn),duration:Bn,events:Ao,eventSources:Rf,hiddenDays:r=>[...new Set(r)],highlightedDates:r=>r.map(n=>Ot(bn(n))),resources:r=>Wn(r)?va(r):Rc(r)?Nc(r):r,validRange:Hf};for(let r of e)r.createParsers?.(t);return t}var ra=["buttonText","customButtons","icons","theme"];function qf(e,t){let r=Vf(e),n=Yf(e);r=na(r,n),t=na(t,n);let i=Xs(r,"views")??{},o=Xs(t,"views")??{},a=Bf({});ke(a,r),t.view&&(a.view=t.view);let l={},c={},p={},h=new Set([...Qr(i),...Qr(o)]);for(let u of h){let d=o[u]??{},v=Ec(r,i[u]??i[d.type]??{}),_=Ec(v,t,d),m=Xs(_,"component");delete _.view;for(let g of Qr(_))Qs(a,g)?(l[g]??=[],l[g].push(ra.includes(g)?(y,x)=>_[g]=x?Ks(v[g]):Te(y)?y(v[g]):y:(y,x)=>_[g]=x?Ks(v[g]):y)):delete _[g];c[u]=_,p[u]=m}return ke(a,c[a.view]),[a,function(d,v,_=!0){if(Qs(a,d)){let m=!_&&v===void 0;!_&&!m&&(v=d in n?n[d](v):Ks(v)),l[d]?.forEach(g=>g(v,m)),m?a[d]=d==="view"?r.view:c[a.view][d]:a[d]=ra.includes(d)&&Te(v)?c[a.view][d]:v}},function(d){return ke(a,c[d]),p[d]}]}function Ks(e){return Rc(e)?{...e}:Wn(e)?[...e]:e}function na(e,t){let r={...e};for(let n of Qr(t))n in r&&(r[n]=t[n](r[n]));if(e.views){r.views={};for(let n of Qr(e.views))r.views[n]=na(e.views[n],t)}return r}function Xs(e,t){let r=e[t];return delete e[t],r}function Ec(...e){let t={};for(let r of e){let n={};for(let i of ra)Te(r[i])&&(n[i]=r[i](t[i]));t={...t,...r,...n}}return t}function Gf(e,t){let r=[];for(let n of Qr(e))e[n]!==t[n]&&r.push([n,e[n]]);return r}function Wf(e){return()=>{let{options:{view:t}}=e;D(()=>{let r=e.setViewOptions(t);e.extensions={},e.features=[],e.viewComponent=r(e)})}}function jf(e,t){let r=D(()=>e.options.events),n=r,i=D(()=>e.offset);return()=>{let{activeRange:o,fetchedRange:{events:a},offset:l,viewDates:c,options:{events:p,eventSources:h,lazyFetching:u,timeZone:d}}=e;D(()=>{let v=h.map(_=>Te(_.events)?_.events:_);Fr(v)&&p!==r&&(ad(p,l),r=p),sd(v,p,_=>Ao(_,l),_=>{(_!==n||l!==i)&&(n=_,i=l,e.events=No(_))},d,o,a,c,!0,u,t)})}}function Zf(e,t){let r=D(()=>e.options.resources);return()=>{let{activeRange:n,fetchedRange:{resources:i},viewDates:o,options:{lazyFetching:a,refetchResourcesOnNavigate:l,resources:c,timeZone:p}}=e;D(()=>{sd(Wn(c)?[]:[c],c,va,h=>{h!==r&&(r=h,e.resources=No(h))},p,n,i,o,l,a,t)})}}function sd(e,t,r,n,i,o,a,l,c,p,h){if(!Fr(l)){if(Fr(e)){n(t);return}if((c||!a.start)&&(!p||!a.start||a.start>o.start||a.end<o.end||a.timeZone!==i)){let u=[],d=g=>h.stop(),v=g=>{u=u.concat(r(g)),n(u),h.stop()},_=zr(o.start),m=zr(o.end);for(let g of e)if(h.start(),Te(g)){let y=g(c?{start:Ke(o.start),end:Ke(o.end),startStr:_,endStr:m,timeZone:i}:{},v,d);y!==void 0&&Promise.resolve(y).then(v,d)}else{let y=Te(g.extraParams)?g.extraParams():ke({},g.extraParams);c&&(y.start=_,y.end=m,i!=="local"&&(y.timeZone=i)),y=new URLSearchParams(y);let x=g.url,T={},w;["GET","HEAD"].includes(g.method)?x+=(x.includes("?")?"&":"?")+y:(T["content-type"]="application/x-www-form-urlencoded;charset=UTF-8",w=String(y)),fetch(x,{method:g.method,headers:T,body:w,signal:dc(),credentials:"same-origin"}).then(k=>k.json()).then(v).catch(d)}ke(a,{...o,timeZone:i})}}}function Kf(e){let t=0;function r(n){let{options:{loading:i}}=e;Te(i)&&i(n)}return{start:()=>++t===1&&r(!0),stop:()=>--t===0&&r(!1)}}function Xf(e){return()=>{let{offset:t}=e,r=setInterval(()=>{let n=la(t),i=Ot(Z(n));e.now=n,nt(e.today,i)||(e.today=i)},1e3);return()=>clearInterval(r)}}function Jf(e){return()=>{let{offset:t,options:r}=e;D(()=>{ad(e.events,t);let n=ua(r.date);if(n!==void 0){let i=(Yn(t)-Yn(n))/(en*1e3),o=tr(Z(r.date),i);e.setOption("date",Zn(o,Oo(o,t)))}})}}function ad(e,t){for(let r of e)if(!r.allDay)for(let n of["start","end"]){let i=r[n],o=ua(i);o!==void 0?da(i,o,t):Zn(i,Oo(i,t))}}function Qf(e){return()=>{let{activeRange:t,options:{datesSet:r}}=e;D(()=>{Te(r)&&r({start:Ke(t.start),end:Ke(t.end),startStr:zr(t.start),endStr:zr(t.end),view:xr(e.view)})})}}function ep(e){let t;return()=>{let{filteredEvents:r,options:{eventAllUpdated:n}}=e;D(()=>{Te(n)&&(t||(t=setTimeout(()=>{t=null,n({view:xr(e.view)})})))})}}function tp(e){return()=>{let{options:{view:t,viewDidMount:r}}=e;D(()=>{Te(r)&&Mr().then(()=>r({view:xr(e.view)}))})}}function rp(e){let t;return()=>{let{options:{date:r,duration:n,firstDay:i}}=e,o,a;return D(()=>{o=Z(r),n.years?(o.setUTCMonth(0),o.setUTCDate(1)):n.months?o.setUTCDate(1):n.inWeeks&&Ic(o,i),a=xt(Z(o),n)}),t&&nt(t.start,o)&&nt(t.end,a)?t:t={start:o,end:a}}}function np(e){let t;return()=>{let{currentRange:r,extensions:{activeRange:n}}=e,i,o;D(()=>{i=Z(r.start),o=Z(r.end)});let a=n?n(i,o):{start:i,end:o};return t&&nt(t.start,a.start)&&nt(t.end,a.end)?t:t=a}}function ip(e){return()=>{let{events:t,resources:r,options:{eventFilter:n,eventOrder:i,filterEventsWithResources:o,view:a}}=e,l=[...t];return D(()=>{if(Te(n)){let c=t.map(er),p=xr(e.view);l=l.filter((h,u)=>n({event:er(h),index:u,events:c,view:p}))}o&&(l=l.filter(c=>r.some(p=>c.resourceIds.includes(p.id)))),Te(i)?l.sort((c,p)=>i(er(c),er(p))):l.sort((c,p)=>c.start-p.start||p.allDay-c.allDay)}),l}}function op(e){return()=>{let{options:{timeZone:t}}=e,r;return D(()=>{r=t==="UTC"?0:t==="local"?t:Ef(t)??(mf(t)?t:"local")}),r}}function sp(e){return()=>{let{options:t,activeRange:r}=e,{hiddenDays:n}=t,i=[];return D(()=>{let o=Ot(Z(r.start)),a=Ot(Z(r.end));for(;o<a;)n.includes(o.getUTCDay())||i.push(Z(o)),tr(o);if(!i.length&&n.length&&n.length<7){for(;n.includes(o.getUTCDay());)tr(o);Mr().then(()=>{e.setOption("date",o)})}}),i}}function ap(e){return()=>{let{currentRange:t,intlTitle:r}=e,n;return D(()=>{n=r.formatRange(t.start,ca(Z(t.end)))}),n}}function lp(e){return()=>{let{activeRange:t,currentRange:r,viewTitle:n,options:{view:i}}=e,o;return D(()=>{o=Df(i,n,r,t)}),o}}var cp=class{#e;get auxComponents(){return s(this.#e)}set auxComponents(e){b(this.#e,e,!0)}#r;get offset(){return s(this.#r)}set offset(e){b(this.#r,e)}#t;get currentRange(){return s(this.#t)}set currentRange(e){b(this.#t,e)}#o;get activeRange(){return s(this.#o)}set activeRange(e){b(this.#o,e)}#n;get fetchedRange(){return s(this.#n)}set fetchedRange(e){b(this.#n,e,!0)}#i;get events(){return s(this.#i)}set events(e){b(this.#i,e)}#s;get filteredEvents(){return s(this.#s)}set filteredEvents(e){b(this.#s,e)}#a;get mainEl(){return s(this.#a)}set mainEl(e){b(this.#a,e,!0)}#l;get now(){return s(this.#l)}set now(e){b(this.#l,e,!0)}#f;get resources(){return s(this.#f)}set resources(e){b(this.#f,e)}#u;get scrollDate(){return s(this.#u)}set scrollDate(e){b(this.#u,e,!0)}#_;get today(){return s(this.#_)}set today(e){b(this.#_,e,!0)}#c;get intlEventTime(){return s(this.#c)}set intlEventTime(e){b(this.#c,e)}#p;get intlDayHeader(){return s(this.#p)}set intlDayHeader(e){b(this.#p,e)}#b;get intlDayHeaderAL(){return s(this.#b)}set intlDayHeaderAL(e){b(this.#b,e)}#w;get intlTitle(){return s(this.#w)}set intlTitle(e){b(this.#w,e)}#$;get viewDates(){return s(this.#$)}set viewDates(e){b(this.#$,e)}#g;get viewTitle(){return s(this.#g)}set viewTitle(e){b(this.#g,e)}#d;get view(){return s(this.#d)}set view(e){b(this.#d,e)}#v;get viewComponent(){return s(this.#v)}set viewComponent(e){b(this.#v,e,!0)}#y;get extensions(){return s(this.#y)}set extensions(e){b(this.#y,e,!0)}#h;get features(){return s(this.#h)}set features(e){b(this.#h,e,!0)}#m;get interaction(){return s(this.#m)}set interaction(e){b(this.#m,e,!0)}#x;get iClasses(){return s(this.#x)}set iClasses(e){b(this.#x,e,!0)}#k;get iClass(){return s(this.#k)}set iClass(e){b(this.#k,e,!0)}options;setOption;setViewOptions;constructor(e,t){[this.options,this.setOption,this.setViewOptions]=qf(e,t),this.#e=G(Ve([])),this.#r=f(op(this)),this.#t=f(rp(this)),this.#o=f(np(this)),this.#n=G(Ve({events:{},resources:{}})),this.#i=G(No(this.options.events)),this.#s=f(ip(this)),this.#a=G(),this.#l=G(Ve(la(this.offset))),this.#f=G(No(Wn(this.options.resources)?this.options.resources:[])),this.#u=G(),this.#_=G(Ve(Ot(Z(this.now)))),this.#c=f(wc(this,"eventTimeFormat",!0)),this.#p=f(tn(this,"dayHeaderFormat")),this.#b=f(tn(this,"dayHeaderAriaLabelFormat")),this.#w=f(wc(this,"titleFormat")),this.#$=f(sp(this)),this.#g=f(ap(this)),this.#d=f(lp(this)),this.#v=G(),this.#y=G(Ve({})),this.#h=G(Ve([])),this.snippets={},this.#m=G(Ve({})),this.iEvents=new Un,this.#x=G(Ve(Ro)),this.#k=G();for(let r of e)r.initState?.(this);this.#E()}#E(){let e=Kf(this);br(Wf(this)),br(Jf(this)),br(Xf(this)),Bt(jf(this,e)),Bt(Zf(this,e)),Bt(Qf(this)),Bt(ep(this)),Bt(tp(this))}},dp=V("<h2></h2>"),kc=V("<button><i></i></button>"),Tc=V("<button> </button>"),up=V("<div><!></div>"),fp=V("<button></button>");function Cc(e,t){st(t,!0);let r=ze("state"),n=f(()=>r.currentRange),i=f(()=>r.snippets),o=f(()=>r.today),a=f(()=>r.viewTitle),l=f(()=>r.viewDates),c=f(()=>r.options.buttonText),p=f(()=>r.options.customButtons),h=f(()=>r.options.date),u=f(()=>r.options.dateIncrement),d=f(()=>r.options.duration),v=f(()=>r.options.hiddenDays),_=f(()=>r.options.theme),m=f(()=>r.options.validRange),g=f(()=>r.options.view),y=G(!1),x=G(!1),T=G(!1),w=!1;br(()=>{s(l),s(m),t.buttons,D(()=>{w||(w=!0,t.buttons.includes("prev")&&(b(y,!1),s(m).start&&b(y,k(C),!0)),t.buttons.includes("next")&&(b(x,!1),s(m).end&&b(x,k(A),!0)),t.buttons.includes("today")&&(b(T,s(o)>=s(n).start&&s(o)<s(n).end,!0),!s(T)&&(s(m).start||s(m).end)&&b(T,k(F),!0)),Mr().then(()=>w=!1))})});function k(X){let O=s(h);X();let M=s(l).every(L=>Kn(L,s(m)));return r.setOption("date",O),M}function C(){r.setOption("date",Lc(Z(s(h)),s(u)??s(d),s(v)))}function A(){r.setOption("date",Mc(Z(s(h)),s(u)??s(d),s(v)))}function F(){r.setOption("date",Z(s(o)))}function Y(X){return"customButton"+X.charAt(0).toUpperCase()+X.slice(1)}var H=pt(),re=qe(H);At(re,17,()=>t.buttons,Qt,(X,O)=>{var M=pt(),L=qe(M),ne=z=>{var N=dp();Ge(N,()=>jt(s(a))),_e(()=>ee(N,1,s(_).title)),j(z,N)},ve=z=>{var N=kc(),De=Mn(N);_e(()=>{ee(N,1,`${s(_).button??""} ec-${s(O)??""}`),vt(N,"aria-label",s(c).prev),vt(N,"title",s(c).prev),N.disabled=s(y),ee(De,1,`${s(_).icon??""} ec-${s(O)??""}`)}),rt("click",N,C),j(z,N)},ae=z=>{var N=kc(),De=Mn(N);_e(()=>{ee(N,1,`${s(_).button??""} ec-${s(O)??""}`),vt(N,"aria-label",s(c).next),vt(N,"title",s(c).next),N.disabled=s(x),ee(De,1,`${s(_).icon??""} ec-${s(O)??""}`)}),rt("click",N,A),j(z,N)},ge=z=>{var N=Tc(),De=Mn(N,!0);_e(()=>{ee(N,1,`${s(_).button??""} ec-${s(O)??""}`),N.disabled=s(T),wo(De,s(c)[s(O)])}),rt("click",N,F),j(z,N)},W=z=>{let N=f(()=>jn(s(p)[s(O)]?.content,void 0,void 0,s(i)[Y(s(O))]));var De=up(),rn=ye(De);Nt(rn,()=>s(N).snippet??me),se(De),Ge(De,()=>jt(s(N).content,s(N).snippet)),_e(()=>ee(De,1,`ec-${s(O)??""}`)),j(z,De)},Ce=f(()=>s(i)[Y(s(O))]||s(p)[s(O)]?.content!=null),te=z=>{var N=fp();Ge(N,()=>jt(s(p)[s(O)].text)),_e(()=>ee(N,1,ur([s(_).button,`ec-${s(O)}`,s(p)[s(O)].active&&s(_).active]))),rt("click",N,function(...De){s(p)[s(O)].click?.apply(this,De)}),j(z,N)},J=z=>{var N=Tc(),De=Mn(N,!0);_e(()=>{ee(N,1,ur([s(_).button,`ec-${s(O)}`,s(g)===s(O)&&s(_).active])),wo(De,s(c)[s(O)])}),rt("click",N,()=>r.setOption("view",s(O))),j(z,N)};Wt(L,z=>{s(O)==="title"?z(ne):s(O)==="prev"?z(ve,1):s(O)==="next"?z(ae,2):s(O)==="today"?z(ge,3):s(Ce)?z(W,4):s(p)[s(O)]?z(te,5):z(J,-1)}),j(X,M)}),j(e,H),at()}cr(["click"]);var pp=V("<div><!></div>"),vp=V("<div></div>"),hp=V("<nav></nav>");function _p(e,t){st(t,!0);let r=f(()=>ze("state")),n=f(()=>s(r).options.headerToolbar),i=f(()=>s(r).options.theme),o=f(()=>{let l={};for(let c of["start","center","end"])l[c]=s(n)[c]?.split(" ").filter(Boolean).map(p=>p.split(",").filter(Boolean))??[];return l});var a=hp();At(a,21,()=>Qr(s(o)),Qt,(l,c)=>{var p=vp();At(p,21,()=>s(o)[s(c)],Qt,(h,u)=>{var d=pt(),v=qe(d),_=g=>{var y=pp();Cc(ye(y),{get buttons(){return s(u)}}),se(y),_e(()=>ee(y,1,s(i).buttonGroup)),j(g,y)},m=g=>{Cc(g,{get buttons(){return s(u)}})};Wt(v,g=>{s(u).length>1?g(_):g(m,-1)}),j(h,d)}),se(p),_e(()=>ee(p,1,`ec-${s(c)??""}`)),j(l,p)}),se(a),_e(()=>ee(a,1,s(i).toolbar)),j(e,a),at()}var gp=new Set(["$$slots","$$events","$$legacy","plugins","options"]),mp=V("<div><!> <!> <!></div>");function $p(e,t){st(t,!0);let r=Oe(t,"plugins",19,()=>[]),n=Oe(t,"options",19,()=>({})),i=Vs(t,gp),o=new cp(r(),n());o.snippets=i,ni("state",o);let a=f(()=>o.auxComponents),l=f(()=>o.features),c=f(()=>o.events),p=f(()=>o.interaction),h=f(()=>o.iClass),u=f(()=>o.offset),d=f(()=>o.view),v=f(()=>o.viewComponent),_=f(()=>o.options.date),m=f(()=>o.options.dateIncrement),g=f(()=>o.options.duration),y=f(()=>o.options.height),x=f(()=>o.options.hiddenDays),T=f(()=>o.options.customScrollbars),w=f(()=>o.options.theme),k={...n()};br(()=>{for(let[U,ce]of Gf(n(),k))D(()=>{C(U,ce)});ke(k,n())});function C(U,ce){return U==="date"&&ce===void 0?o.setOption(U,Yn(s(u))):o.setOption(U,ce,!1),this}function A(U){for(let ce of Qr(U))C(ce,U[ce]);return this}function F(U){let ce=o.options[U];return aa(ce)?Ke(ce):ce}function Y(){return o.fetchedRange.resources={},this}function H(){return o.fetchedRange.events={},this}function re(){return s(c).map(er)}function X(U){U=String(U);for(let ce of s(c))if(ce.id===U)return er(ce);return null}function O(U){return U=Ao([U],s(u))[0],U?(s(c).push(U),er(U)):null}function M(U){let ce=String(U.id),vr=s(c).findIndex(nn=>nn.id===ce);return vr>=0?(U=Ao([U],s(u))[0],U?(s(c)[vr]=U,er(U)):null):null}function L(U){U=String(U);let ce=s(c).findIndex(vr=>vr.id===U);return ce>=0&&s(c).splice(ce,1),this}function ne(){return xr(s(d))}function ve(){return s(p).action?.unselect(),this}function ae(U,ce){let vr=qc(U,ce);if(vr){let nn=Vc(vr)(U,ce);return nn.date=Ke(nn.date),nn}return null}function ge(U){return U=U===void 0?Yn(s(u)):Ot(bn(U)),o.setOption("date",Z(U)),o.scrollDate=U,this}function W(){return o.setOption("date",Mc(Z(s(_)),s(m)??s(g),s(x))),this}function Ce(){return o.setOption("date",Lc(Z(s(_)),s(m)??s(g),s(x))),this}var te={setOption:C,setOptions:A,getOption:F,refetchResources:Y,refetchEvents:H,getEvents:re,getEventById:X,addEvent:O,updateEvent:M,removeEventById:L,getView:ne,unselect:ve,dateFromPoint:ae,gotoDate:ge,next:W,prev:Ce},J=mp();let z;var N=ye(J);_p(N,{});var De=bt(N,2);Ti(De,()=>s(v),(U,ce)=>{ce(U,{})});var rn=bt(De,2);return At(rn,17,()=>s(a),Qt,(U,ce)=>{var vr=pt(),nn=qe(vr);Ti(nn,()=>s(ce),(wd,xd)=>{xd(wd,{})}),j(U,vr)}),se(J),_e(U=>{ee(J,1,ur([s(w).calendar,s(w).view,s(h)&&s(w)[s(h)],s(T)&&s(w).customScrollbars])),vt(J,"role",U),z=Jr(J,"",z,{height:s(y)})},[()=>s(l).includes("list")?"list":"table"]),j(e,J),at(te)}function yp(e){"weekNumbers"in e||ke(e,{weekNumbers:!1,weekNumberContent:void 0})}function bp(e){return()=>{let{viewDates:t,options:{duration:r,hiddenDays:n}}=e,i;return D(()=>i=r.months||r.inWeeks?7-n.length:t.length),i}}function wp(e,t){return()=>{let{options:{highlightedDates:r,validRange:n},viewDates:i}=e,{colsCount:o}=t,a=[];return D(()=>{let l=[],c=1,p=1;for(let h of i)l.push({gridColumn:c,gridRow:p,resource:void 0,dayStart:h,dayEnd:tr(Z(h)),disabled:Kn(h,n),highlight:r.some(u=>nt(u,h))}),c===o&&(a.push(l),l=[],c=0,++p),++c}),a}}function xp(e,t){return()=>{let{filteredEvents:r}=e,{grid:n}=t,i=[],o=[];return D(()=>{for(let a of r)for(let l of n)pr(a.display)?a.allDay&&(o=o.concat(Gn(a,l))):i=i.concat(Gn(a,l));Zc(i)}),{chunks:i,bgChunks:o}}}function Ep(e,t){return()=>{let{iEvents:r}=e,{grid:n}=t,i=[];for(let[,o]of r)o&&D(()=>{for(let a of n)i=i.concat(Gn(o,a,!1))});return i}}var kp=class{#e;get colsCount(){return s(this.#e)}set colsCount(e){b(this.#e,e)}#r;get grid(){return s(this.#r)}set grid(e){b(this.#r,e)}#t;get gridEl(){return s(this.#t)}set gridEl(e){b(this.#t,e,!0)}#o;get chunks(){return s(this.#o)}set chunks(e){b(this.#o,e)}#n;get bgChunks(){return s(this.#n)}set bgChunks(e){b(this.#n,e)}#i;get iChunks(){return s(this.#i)}set iChunks(e){b(this.#i,e)}#s;get intlDayCell(){return s(this.#s)}set intlDayCell(e){b(this.#s,e)}#a;get intlDayPopover(){return s(this.#a)}set intlDayPopover(e){b(this.#a,e)}#l;get popupDay(){return s(this.#l)}set popupDay(e){b(this.#l,e,!0)}constructor(e){this.#e=f(bp(e)),this.#r=f(wp(e,this)),this.#t=G();let t=f(xp(e,this)),r=f(()=>s(t).chunks),n=f(()=>s(t).bgChunks);this.#o=f(()=>s(r)),this.#n=f(()=>s(n)),this.#i=f(Ep(e,this)),this.hiddenChunks=new Un,this.#s=f(tn(e,"dayCellFormat")),this.#a=f(tn(e,"dayPopoverFormat")),this.#l=G(null)}},Tp=V("<div><!></div>");function ld(e,t){st(t,!0);let r=Oe(t,"el",15),n=Oe(t,"allDay",3,!1),i=Oe(t,"resource",3,void 0),o=Oe(t,"dateFromPoint",3,()=>t.date),a=Oe(t,"resourceFromPoint",3,()=>i()),l=Oe(t,"classes",3,Ro),c=Oe(t,"disabled",3,!1),p=Oe(t,"highlight",3,!1),h=Oe(t,"role",3,"cell"),u=Oe(t,"noIeb",3,!1),d=Oe(t,"noBeb",3,!1),v=Oe(t,"defaultContent",3,void 0),_=f(()=>ze("state")),m=f(()=>s(_).today),g=f(()=>s(_).snippets),y=f(()=>s(_).interaction.action),x=f(()=>s(_).options.dayCellContent),T=f(()=>s(_).options.theme),w=f(()=>ze("view-state")),k=f(()=>s(w).snap),C=f(()=>nt(t.date,s(m))),A=f(()=>jn(s(x),()=>({allDay:n(),date:Ke(t.date),isToday:s(C),resource:i()}),v(),s(g).dayCellContent)),F=f(()=>l()([s(T).day,s(T).weekdays?.[t.date.getUTCDay()],s(C)&&s(T).today,p()&&s(T).highlight,c()&&s(T).disabled,u()&&s(T).noIeb,d()&&s(T).noBeb]));ko(()=>{Bc(r(),(M,L)=>({allDay:n(),date:o()(M,L),resource:a()(M,L),dayEl:r(),disabled:c()}))});let Y=f(()=>!c()&&s(y)?M=>s(y).select(M,s(k)):void 0);var H=Tp(),re=ye(H),X=M=>{var L=pt(),ne=qe(L);Nt(ne,()=>t.content,()=>s(A)),j(M,L)},O=M=>{var L=pt(),ne=qe(L);Nt(ne,()=>s(A).snippet??me,()=>s(A).arg),j(M,L)};Wt(re,M=>{t.content?M(X):M(O,-1)}),se(H),Lr(H,M=>r(M),()=>r()),Ge(H,()=>t.content?null:jt(s(A).content,s(A).snippet)),_e(()=>{ee(H,1,ur(s(F))),vt(H,"role",h())}),rt("pointerdown",H,function(...M){s(Y)?.apply(this,M)}),j(e,H),at()}cr(["pointerdown"]);var Cp=V("<div><!></div>"),Dp=V("<article><!></article>");function cd(e,t){st(t,!0);let r=Oe(t,"el",15),n=Oe(t,"classes",3,Ro),i=Oe(t,"styles",3,Ro),o=f(()=>ze("state")),a=f(()=>s(o).intlEventTime),l=f(()=>s(o).resources),c=f(()=>s(o).snippets),p=f(()=>s(o).view),h=f(()=>s(o).options.displayEventEnd),u=f(()=>s(o).options.eventBackgroundColor),d=f(()=>s(o).options.eventColor),v=f(()=>s(o).options.eventContent),_=f(()=>s(o).options.eventClick),m=f(()=>s(o).options.eventDidMount),g=f(()=>s(o).options.eventClassNames),y=f(()=>s(o).options.eventMouseEnter),x=f(()=>s(o).options.eventMouseLeave),T=f(()=>s(o).options.eventTextColor),w=f(()=>s(o).options.theme),k=f(()=>t.chunk.event),C=f(()=>t.chunk.event.display),A=f(()=>s(k).backgroundColor??td(t.chunk.resource??xc(s(k),s(l)))??s(u)??s(d)),F=f(()=>s(k).textColor??rd(t.chunk.resource??xc(s(k),s(l)))??s(T)),Y=f(()=>cf(i()({"background-color":s(A),color:s(F)})).map(te=>`${te[0]}:${te[1]}`).concat(s(k).styles).join(";")),H=f(()=>{let te=[pr(s(C))?s(w).bgEvent:s(w).event];if(s(k).allDay){nt(Ot(Z(t.chunk.start)),s(k).start)||te.push(s(w).startClipped);let J=Z(t.chunk.end),z=Z(s(k).end);J.setUTCSeconds(J.getUTCSeconds()-1),z.setUTCSeconds(z.getUTCSeconds()-1),nt(Ot(J),Ot(z))||te.push(s(w).endClipped)}else nt(t.chunk.start,s(k).start)||te.push(s(w).startClipped),nt(t.chunk.end,s(k).end)||te.push(s(w).endClipped);return n()(te.concat(Of(s(g),s(k),s(p))))}),re=f(()=>Af(t.chunk,s(h),s(a))),X=f(()=>jn(s(v),()=>({event:er(s(k)),timeText:s(re),view:xr(s(p))}),()=>Nf(t.chunk,s(re),s(w)),s(c).eventContent));ko(()=>{Te(s(m))&&s(m)({event:er(s(k)),timeText:s(re),el:r(),view:xr(s(p))})});function O(te,J){return Te(te)&&!Gc(J)?z=>te({event:er(s(k)),el:r(),jsEvent:z,view:xr(s(p))}):void 0}let M=f(()=>!pr(s(C))&&O(s(_),s(C))||void 0),L=f(()=>s(M)&&sa(s(M))),ne=f(()=>O(s(y),s(C))),ve=f(()=>O(s(x),s(C)));var ae=Dp();{let te=J=>{var z=Cp(),N=ye(z);Nt(N,()=>s(X).snippet??me,()=>s(X).arg),se(z),Ge(z,()=>jt(s(X).content,s(X).snippet)),_e(()=>ee(z,1,ur(s(w).eventBody))),j(J,z)};var ge=ye(ae),W=J=>{var z=pt(),N=qe(z);Nt(N,()=>t.body,()=>te,()=>s(A),()=>s(F)),j(J,z)},Ce=J=>{te(J)};Wt(ge,J=>{t.body?J(W):J(Ce,-1)}),se(ae),Lr(ae,J=>r(J),()=>r())}_e(()=>{ee(ae,1,ur(s(H))),Jr(ae,s(Y)),vt(ae,"role",s(M)?"button":void 0),vt(ae,"tabindex",s(M)?0:void 0)}),rt("click",ae,function(...te){s(M)?.apply(this,te)}),rt("keydown",ae,function(...te){s(L)?.apply(this,te)}),zn("mouseenter",ae,function(...te){s(ne)?.apply(this,te)}),zn("mouseleave",ae,function(...te){s(ve)?.apply(this,te)}),rt("pointerdown",ae,function(...te){t.onpointerdown?.apply(this,te)}),j(e,ae),at()}cr(["click","keydown","pointerdown"]);var xR=V("<div><!></div>");var ER=V("<time></time>");function Sp(e,t){st(t,!0);let r=Oe(t,"el",15),n=f(()=>ze("state")),i=f(()=>s(n).iClasses),o=f(()=>s(n).interaction.action),a=f(()=>s(n).interaction.resizer),l=f(()=>ze("view-state")),c=f(()=>s(l).snap),p=f(()=>t.chunk.event),h=f(()=>t.chunk.event.display),u=f(()=>_=>s(i)(_,s(p)));function d(_){return s(o)?.draggable(_)?m=>s(o).drag(_,m,t.forceDate,t.forceMargin,s(c)):s(o)?.noAction}let v=f(()=>!pr(s(h))&&!Gc(s(h))?d(s(p)):void 0);cd(e,{get chunk(){return t.chunk},get classes(){return s(u)},get styles(){return t.styles},get onpointerdown(){return s(v)},get el(){return r()},set el(m){r(m)},body:(m,g=me)=>{var y=pt(),x=qe(y),T=k=>{var C=pt(),A=qe(C);Ti(A,()=>s(a),(F,Y)=>{Y(F,{get chunk(){return t.chunk},get axis(){return t.axis},get forceDate(){return t.forceDate},get forceMargin(){return t.forceMargin},children:(H,re)=>{var X=pt(),O=qe(X);Nt(O,g),j(H,X)},$$slots:{default:!0}})}),j(k,C)},w=k=>{var C=pt(),A=qe(C);Nt(A,g),j(k,C)};Wt(x,k=>{s(a)?k(T):k(w,-1)}),j(m,y)},$$slots:{body:!0}}),at()}var Rp=V("<span><!></span>"),Ap=V('<a role="button" tabindex="0" aria-haspopup="dialog"><!></a>'),Np=V("<div><time><!></time> <!></div> <div><!></div>",1);function Op(e,t){st(t,!0);let r=ze("state"),n=ze("view-state");f(()=>r.features);let i=f(()=>r.snippets),o=f(()=>r.options.date),a=f(()=>r.options.firstDay),l=f(()=>r.options.moreLinkContent),c=f(()=>r.options.theme),p=f(()=>r.options.weekNumbers),h=f(()=>r.options.weekNumberContent),u=f(()=>n.hiddenChunks),d=f(()=>n.intlDayCell),v=f(()=>t.day.dayStart),_=f(()=>t.day.disabled),m=f(()=>t.day.highlight),g=f(()=>s(v).getUTCMonth()!==s(o).getUTCMonth()),y=f(()=>A=>[...A,s(g)&&s(c).otherMonth]),x=f(()=>s(p)&&s(v).getUTCDay()===(s(a)?1:0)),T=f(()=>s(x)?xf(Pc(s(v),s(a)),s(v),s(h),s(i).weekNumberContent):{}),w=f(()=>s(u).get(Vt(s(v)))),k=f(()=>{if(!s(w))return{};let A=s(w).length,F="+"+A+" more";return jn(s(l),()=>({num:A,text:F}),F,s(i).moreLinkContent)});function C(){n.popupDay=t.day}ld(e,{get date(){return s(v)},allDay:!0,get classes(){return s(y)},get disabled(){return s(_)},get highlight(){return s(m)},get noIeb(){return t.noIeb},get noBeb(){return t.noBeb},defaultContent:()=>s(d).format(s(v)),content:(F,Y=me)=>{var H=Np(),re=qe(H),X=ye(re),O=ye(X);Nt(O,()=>Y().snippet??me,()=>Y().arg),se(X),Ge(X,()=>jt(Y().content,Y().snippet));var M=bt(X,2),L=ge=>{var W=Rp(),Ce=ye(W);Nt(Ce,()=>s(T).snippet??me,()=>s(T).arg),se(W),Ge(W,()=>jt(s(T).content,s(T).snippet)),_e(()=>ee(W,1,s(c).weekNumber)),j(ge,W)};Wt(M,ge=>{s(x)&&ge(L)}),se(re);var ne=bt(re,2),ve=ye(ne),ae=ge=>{var W=Ap(),Ce=f(()=>ta(C)),te=f(()=>sa(C)),J=f(ta),z=ye(W);Nt(z,()=>s(k).snippet??me,()=>s(k).arg),se(W),Ge(W,()=>jt(s(k).content,s(k).snippet)),rt("click",W,function(...N){s(Ce)?.apply(this,N)}),rt("keydown",W,function(...N){s(te)?.apply(this,N)}),rt("pointerdown",W,function(...N){s(J)?.apply(this,N)}),j(ge,W)};Wt(ve,ge=>{s(w)&&ge(ae)}),se(ne),_e(ge=>{ee(re,1,s(c).dayHead),vt(X,"datetime",ge),ee(ne,1,s(c).dayFoot)},[()=>zr(s(v),10)]),j(F,H)},$$slots:{content:!0}}),at()}cr(["click","keydown","pointerdown"]);function So(e,t){st(t,!0);let r=Oe(t,"inPopup",3,!1),n=f(()=>ze("state")),i=f(()=>s(n).options.dayMaxEvents),o=f(()=>s(n).options.eventGap),a=f(()=>ze("view-state")),l=f(()=>s(a).colsCount),c=f(()=>s(a).gridEl),p=f(()=>s(a).hiddenChunks),h=f(()=>s(a).popupDay),u,d=G(1),v=G(!1),_=f(()=>t.chunk.event),m=f(()=>t.chunk.event.display);function g(){return s(c).children.item((t.chunk.gridRow-1)*s(l)+t.chunk.gridColumn-1)}Bt(()=>{!r()&&(Wc(s(m))||jc(s(m)))&&b(d,Ci(g().firstElementChild)||1,!0)});let y=f(()=>C=>{if(C["grid-column"]=`${t.chunk.gridColumn} / span ${t.chunk.dates.length}`,C["grid-row"]=t.chunk.gridRow,!pr(s(m))){let A=r()?1:s(d);if(s(_)._margin){let[F,Y]=s(_)._margin;F>A&&t.chunk.gridRow===Y&&(A=F)}C["margin-block-start"]=`${A}px`}return s(v)&&(C.visibility="hidden"),C});function x(){b(d,Pf(t.chunk,Ci(u),Ci(g().firstElementChild)||1,s(o)),!0)}function T(){if(s(i)===!0){let C=g(),A=Ci(C)-w(C);if(b(v,t.chunk.bottom>A),s(v))for(let F of t.chunk.dates){let Y=Vt(F);if(s(p).has(Y)){let H=s(p).get(Y);H.includes(t.chunk)||s(p).set(Y,[...H,t.chunk])}else s(p).set(Y,[t.chunk])}}else b(v,!1),s(p).size&&s(p).clear()}function w(C){let A=0;for(let F=0;F<t.chunk.dates.length&&(A=Pr(A,Ci(C.lastElementChild)),C=C.nextElementSibling,!!C);++F);return A}var k={reposition:x,hide:T};{let C=f(()=>r()&&s(h).dayStart),A=f(()=>[s(d),t.chunk.gridRow]);Sp(e,{get chunk(){return t.chunk},get styles(){return s(y)},axis:"x",get forceDate(){return s(C)},get forceMargin(){return s(A)},get el(){return u},set el(F){u=F}})}return at(k)}var Ip=V('<dialog closedby="closerequest"><header><time></time>  <a role="button" tabindex="0">&times;</a></header> <div></div></dialog>');function Mp(e,t){st(t,!0);let r=ze("view-state"),n=f(()=>ze("state")),i=f(()=>s(n).interaction),o=f(()=>s(n).options.buttonText),a=f(()=>s(n).options.theme),l=f(()=>r.colsCount),c=f(()=>r.chunks),p=f(()=>r.gridEl),h=f(()=>r.intlDayPopover),u=f(()=>r.popupDay),d=G(void 0),v=G(""),_=f(()=>s(u).gridColumn),m=f(()=>s(u).gridRow),g=f(()=>s(u).dayStart),y=f(()=>s(u).dayEnd),x=f(()=>{let M=[];for(let L of s(c))L.gridRow===s(m)&&L.gridColumn<=s(_)&&L.gridColumn+L.dates.length>s(_)&&M.push(ke({},L,Ri(L.event,s(g),s(y))));return M.sort((L,ne)=>L.top-ne.top),M});ko(()=>{s(d).show()}),Bt(()=>{s(x).length?D(T):w()});function T(){let M=s(p).children.item((s(m)-1)*s(l)+s(_)-1),L=Do(s(d)),ne=Do(M),ve=Do(s(p));b(v,"");let ae;if(L.width>=ve.width){ae=ve.left-ne.left;let W=ne.right-ve.right;b(v,s(v)+`inset-inline-end:${W}px;`)}else ae=(ne.width-L.width)/2,ne.left+ae<ve.left?ae=ve.left-ne.left:ne.left+ae+L.width>ve.right&&(ae=ve.right-ne.left-L.width);b(v,s(v)+`inset-inline-start:${ae}px;`);let ge;L.height>=ve.height?(ge=ve.top-ne.top,b(v,s(v)+`block-size:${ve.height}px;`)):(ge=(ne.height-L.height)/2,ne.top+ge<ve.top?ge=ve.top-ne.top:ne.top+ge+L.height>ve.bottom&&(ge=ve.bottom-ne.top-L.height)),b(v,s(v)+`inset-block-start:${ge}px;`)}function w(){r.popupDay=null}function k(){w(),s(i).action?.noClick()}var C=Ip();let A;var F=ye(C),Y=ye(F);Ge(Y,()=>jt(s(h).format(s(g))));var H=bt(Y,2);go(H,!0);var re=f(()=>ta(w)),X=f(()=>sa(w));se(F);var O=bt(F,2);At(O,21,()=>s(x),Qt,(M,L)=>{So(M,{get chunk(){return s(L)},inPopup:!0})}),se(O),se(C),Lr(C,M=>b(d,M),()=>s(d)),Ge(C,()=>_f("pointerdown")),_e(M=>{ee(C,1,s(a).popup),A=Jr(C,s(v),A,{"grid-area":`${s(m)+1} / ${s(_)}`}),ee(F,1,s(a).dayHead),vt(Y,"datetime",M),vt(H,"aria-label",s(o).close),ee(O,1,s(a).events)},[()=>zr(s(g),10)]),zn("pointerdownoutside",C,k),zn("close",C,w),rt("click",H,function(...M){s(re)?.apply(this,M)}),rt("keydown",H,function(...M){s(X)?.apply(this,M)}),j(e,C),at()}cr(["click","keydown"]);var Lp=V('<div role="columnheader"><span></span></div>'),Pp=V('<section><header><div role="row"></div></header> <div><div></div> <div><!> <!> <!></div></div> <!></section>');function ia(e,t){st(t,!0);let r=ze("state"),n=new kp(r);ni("view-state",n);let i=f(()=>r.intlDayHeader),o=f(()=>r.intlDayHeaderAL),a=f(()=>r.options.dayMaxEvents),l=f(()=>r.options.eventGap),c=f(()=>r.options.theme),p=f(()=>n.grid),h=f(()=>n.chunks),u=f(()=>n.bgChunks),d=f(()=>n.iChunks),v=f(()=>n.hiddenChunks),_=f(()=>n.popupDay),m=[];function g(){Mf(m,s(h)),s(v).clear(),Mr().then(x)}let y=!1;function x(){s(v).size,(s(a)===!0||y)&&(y=s(a)===!0,m.forEach(A=>A?.hide()))}Bt(()=>{s(l),s(h),Mr().then(g)}),Bt(x);var T=pt(),w=qe(T),k=A=>{var F=Pp();let Y;var H=ye(F),re=ye(H);At(re,21,()=>s(p)[0],Qt,(W,Ce,te)=>{let J=()=>s(Ce).dayStart;var z=Lp();vt(z,"aria-colindex",1+te);var N=ye(z);Ge(N,()=>jt(s(i).format(J()))),se(z),_e((De,rn)=>{ee(z,1,De),vt(N,"aria-label",rn)},[()=>ur([s(c).colHead,s(c).weekdays?.[J().getUTCDay()]]),()=>s(o).format(J())]),j(W,z)}),se(re),se(H);var X=bt(H,2),O=ye(X);At(O,21,()=>s(p),Qt,(W,Ce,te)=>{var J=pt(),z=qe(J);At(z,17,()=>s(Ce),Qt,(N,De,rn)=>{{let U=f(()=>rn+1===$n(s(Ce))),ce=f(()=>te+1===$n(s(p)));Op(N,{get day(){return s(De)},get noIeb(){return s(U)},get noBeb(){return s(ce)}})}}),j(W,J)}),se(O),Lr(O,W=>n.gridEl=W,()=>n?.gridEl);var M=bt(O,2),L=ye(M);At(L,19,()=>s(h),W=>W.id,(W,Ce,te)=>{Lr(So(W,{get chunk(){return s(Ce)}}),(J,z)=>m[z]=J,J=>m?.[J],()=>[s(te)])});var ne=bt(L,2);At(ne,17,()=>s(u),W=>W.id,(W,Ce)=>{So(W,{get chunk(){return s(Ce)}})});var ve=bt(ne,2);At(ve,17,()=>s(d),Qt,(W,Ce)=>{So(W,{get chunk(){return s(Ce)}})}),se(M),se(X);var ae=bt(X,2),ge=W=>{Mp(W,{})};Wt(ae,W=>{s(_)&&W(ge)}),se(F),Lr(F,W=>r.mainEl=W,()=>r?.mainEl),Ge(F,()=>gf(g)),Ge(F,()=>hf(g)),_e((W,Ce)=>{ee(F,1,ur([s(c).main,s(a)===!0&&s(c).uniform])),Y=Jr(F,"",Y,{"--ec-grid-cols":W,"--ec-grid-rows":Ce}),ee(H,1,s(c).header),ee(re,1,s(c).grid),ee(X,1,s(c).body),ee(O,1,s(c).grid),ee(M,1,s(c).events)},[()=>$n(s(p)[0]),()=>$n(s(p))]),j(A,F)},C=f(()=>!Fr(s(p))&&!Fr(s(p)[0]));Wt(w,A=>{s(C)&&A(k)}),j(e,T),at()}var dd={createOptions(e){yp(e),ke(e,{dayMaxEvents:!1,dayCellFormat:{day:"numeric"},dayPopoverFormat:{month:"long",day:"numeric",year:"numeric"},moreLinkContent:void 0,view:"dayGridMonth"}),ke(e.buttonText,{dayGridDay:"day",dayGridMonth:"month",dayGridWeek:"week",close:"Close"}),ke(e.theme,{uniform:"ec-uniform",dayFoot:"ec-day-foot",otherMonth:"ec-other-month",popup:"ec-popup"}),ke(e.views,{dayGridDay:{buttonText:Xc,component:()=>ia,dayHeaderFormat:{weekday:"long"},displayEventEnd:!1,duration:{days:1},theme:yn("ec-day-grid ec-day-view")},dayGridWeek:{buttonText:Jc,component:()=>ia,displayEventEnd:!1,theme:yn("ec-day-grid ec-week-view")},dayGridMonth:{buttonText:Qc,component:Fp,dayHeaderFormat:{weekday:"short"},dayHeaderAriaLabelFormat:{weekday:"long"},displayEventEnd:!1,duration:{months:1},theme:yn("ec-day-grid ec-month-view"),titleFormat:{year:"numeric",month:"long"}}})}};function Fp(e){return e.features=["dayNumber"],e.extensions.activeRange=(t,r)=>{let{options:{firstDay:n}}=e;return{start:Ic(t,n),end:bf(r,n)}},ia}var kR=V("<div></div>"),TR=V("<!> <!> <!>",1);cr(["pointerdown"]);var CR=V("<!> <!>",1);var zp=class{#e;get intlListDay(){return s(this.#e)}set intlListDay(e){b(this.#e,e)}#r;get intlListDaySide(){return s(this.#r)}set intlListDaySide(e){b(this.#r,e)}constructor(e){this.#e=f(tn(e,"listDayFormat")),this.#r=f(tn(e,"listDaySideFormat"))}},Hp=V("<div></div> <!>",1);function Up(e,t){st(t,!0);let r=f(()=>ze("state")),n=f(()=>s(r).interaction),i=f(()=>s(r).options.theme),o=f(()=>a=>(delete a["background-color"],delete a.color,a));{let a=(c,p=me,h=me,u=me)=>{var d=Hp(),v=qe(d);let _;var m=bt(v,2);Nt(m,p),_e(()=>{ee(v,1,s(i).eventTag),_=Jr(v,"",_,{"background-color":h()})}),j(c,d)},l=f(()=>s(n).action?.noAction);cd(e,{get chunk(){return t.chunk},get styles(){return s(o)},get onpointerdown(){return s(l)},body:a,$$slots:{body:!0}})}at()}var Bp=V("<h4><time><!></time> <time></time></h4> <!>",1);function Vp(e,t){st(t,!0);let r=f(()=>ze("state")),n=f(()=>s(r).filteredEvents),i=f(()=>s(r).options.highlightedDates),o=f(()=>s(r).options.theme),a=f(()=>s(r).options.validRange),l=f(()=>ze("view-state")),c=f(()=>s(l).intlListDay),p=f(()=>s(l).intlListDaySide),h=f(()=>s(i).some(y=>nt(y,t.date))),u=f(()=>Kn(t.date,s(a))),d=f(()=>zr(t.date,10)),v=f(()=>{let y=[];if(!s(u)){let x=t.date,T=tr(Z(t.date));for(let w of s(n))if(!pr(w.display)&&qn(w,x,T)){let k=Ri(w,x,T);y.push(k)}}return y});var _=pt(),m=qe(_),g=y=>{ld(y,{get date(){return t.date},allDay:!0,role:"listitem",get disabled(){return s(u)},get highlight(){return s(h)},defaultContent:()=>s(c).format(t.date),content:(T,w=me)=>{var k=Bp(),C=qe(k),A=ye(C),F=ye(A);Nt(F,()=>w().snippet??me,()=>w().arg),se(A),Ge(A,()=>jt(w().content,w().snippet));var Y=bt(A,2);Ge(Y,()=>jt(s(p).format(t.date))),se(C);var H=bt(C,2);At(H,17,()=>s(v),re=>re.event,(re,X)=>{Up(re,{get chunk(){return s(X)}})}),_e(()=>{ee(C,1,s(o).dayHead),vt(A,"datetime",s(d)),ee(Y,1,s(o).daySide),vt(Y,"datetime",s(d))}),j(T,k)},$$slots:{content:!0}})};Wt(m,y=>{s(v).length&&y(g)}),j(e,_),at()}var Yp=V("<div><!></div>"),qp=V("<section><!></section>");function Gp(e,t){st(t,!0);let r=ze("state"),n=new zp(r);ni("view-state",n);let i=f(()=>r.filteredEvents),o=f(()=>r.snippets),a=f(()=>r.view),l=f(()=>r.viewDates),c=f(()=>r.options.noEventsClick),p=f(()=>r.options.noEventsContent),h=f(()=>r.options.theme),u=f(()=>{let x=!0;if(!Fr(s(l))){let T=s(l)[0],w=tr(Z(s(l).at(-1)));for(let k of s(i))if(!pr(k.display)&&k.start<w&&k.end>T){x=!1;break}}return x}),d=f(()=>jn(s(p),void 0,void 0,s(o).noEventsContent));function v(x){Te(s(c))&&s(c)({jsEvent:x,view:xr(s(a))})}var _=qp(),m=ye(_),g=x=>{var T=Yp(),w=ye(T);Nt(w,()=>s(d).snippet??me,()=>s(d).arg),se(T),Ge(T,()=>jt(s(d).content,s(d).snippet)),_e(()=>ee(T,1,s(h).noEvents)),rt("click",T,v),j(x,T)},y=x=>{var T=pt(),w=qe(T);At(w,17,()=>s(l),Qt,(k,C)=>{Vp(k,{get date(){return s(C)}})}),j(x,T)};Wt(m,x=>{s(u)?x(g):x(y,-1)}),se(_),Lr(_,x=>r.mainEl=x,()=>r?.mainEl),_e(()=>ee(_,1,s(h).main)),j(e,_),at()}cr(["click"]);var ud={createOptions(e){ke(e,{listDayFormat:{weekday:"long"},listDaySideFormat:{year:"numeric",month:"long",day:"numeric"},noEventsClick:void 0,noEventsContent:"No events",view:"listWeek"}),ke(e.buttonText,{listDay:"day",listWeek:"week",listMonth:"month",listYear:"year"}),ke(e.theme,{daySide:"ec-day-side",eventTag:"ec-event-tag",noEvents:"ec-no-events"}),ke(e.views,{listDay:{buttonText:Xc,component:Co,duration:{days:1},theme:yn("ec-list ec-day-view"),titleFormat:{year:"numeric",month:"long",day:"numeric"}},listWeek:{buttonText:Jc,component:Co,duration:{weeks:1},theme:yn("ec-list ec-week-view")},listMonth:{buttonText:Qc,component:Co,duration:{months:1},theme:yn("ec-list ec-month-view"),titleFormat:{year:"numeric",month:"long"}},listYear:{buttonText:zf,component:Co,duration:{years:1},theme:yn("ec-list ec-year-view"),titleFormat:{year:"numeric"}}})}};function Co(e){return e.features=["list"],Gp}function oa(e,t,r=!0){let n=[];for(let{gridColumn:i,gridRow:o,resource:a,start:l,end:c,disabled:p}of t)if(!p&&qn(e,l,c,a)){let h=Ri(e,l,c);ke(h,{gridColumn:i,gridRow:o,resource:a,top:(h.start-l)/1e3,height:(h.end-h.start)/1e3,maxHeight:(c-h.start)/1e3}),r&&pa(h),n.push(h)}return n}function Wp(e){let t={};for(let r of e){let{gridColumn:n}=r,i=t[n],o=0;if(i&&r.start<i.end){for(;o<i.columns.length&&!(i.columns[o].at(-1).end<=r.start);++o);r.end>i.end&&(i.end=r.end)}else i={columns:[],end:r.end};i.columns.length<o+1&&i.columns.push([]),i.columns[o].push(r),t[n]=i,r.group=i,r.groupColumn=o}}function jp(e,t){return()=>{let{viewDates:r,options:{highlightedDates:n,validRange:i}}=e,{slotTimeLimits:o}=t,a=[];return D(()=>{let l=1;for(let c of r)a.push({gridColumn:l,gridRow:1,resource:void 0,start:xt(Z(c),o.min),end:xt(Z(c),o.max),dayStart:c,dayEnd:tr(Z(c)),disabled:Kn(c,i),highlight:n.some(p=>nt(p,c))}),++l}),[a]}}function Zp(e,t){return()=>{let{filteredEvents:r}=e,{grid:n}=t,i=[],o=[],a=[],l=[];return D(()=>{for(let c of r)for(let p of n)pr(c.display)?(o=o.concat(oa(c,p)),c.allDay&&(l=l.concat(Gn(c,p)))):c.allDay?a=a.concat(Gn(c,p)):i=i.concat(oa(c,p));Wp(i),Zc(a)}),{chunks:i,bgChunks:o,allDayChunks:a,allDayBgChunks:l}}}function Kp(e,t){return()=>{let{iEvents:r}=e,{grid:n}=t,i=[],o=[];for(let[,a]of r)a&&D(()=>{for(let l of n)a.allDay?o=o.concat(Gn(a,l,!1)):i=i.concat(oa(a,l,!1))});return{iChunks:i,allDayIChunks:o}}}function Xp(e){return()=>{let{filteredEvents:t,viewDates:r,options:{flexibleSlotTimeLimits:n,slotMinTime:i,slotMaxTime:o}}=e,a;return D(()=>{a=id(i,o,n,r,t)}),a}}function Jp(e){return()=>{let{options:{slotDuration:t,slotLabelInterval:r}}=e,n;return D(()=>{n=r===void 0?Ze(t)<3600?2:1:df(Ze(r)/Ze(t))||1}),n}}function Qp(e,t){return()=>{let{offset:r,options:{slotDuration:n}}=e,{intlSlotLabel:i,slotLabelPeriodicity:o,slotTimeLimits:a}=t,l;return D(()=>{l=nd(Yn(r),n,o,a,i)}),l}}function ev(e){return()=>{let{options:{slotDuration:t,snapDuration:r}}=e;return r??=t,{duration:r,ratio:Ze(r)/Ze(t)}}}function ha(){return class{#e;get intlSlotLabel(){return s(this.#e)}set intlSlotLabel(e){b(this.#e,e)}#r;get slotLabelPeriodicity(){return s(this.#r)}set slotLabelPeriodicity(e){b(this.#r,e)}#t;get sidebarWidth(){return s(this.#t)}set sidebarWidth(e){b(this.#t,e,!0)}#o;get snap(){return s(this.#o)}set snap(e){b(this.#o,e)}constructor(e){this.#e=f(tn(e,"slotLabelFormat")),this.#r=f(Jp(e)),this.#t=G(0),this.#o=f(ev(e))}}}function fd(e){return class extends e{#e;get slotTimeLimits(){return s(this.#e)}set slotTimeLimits(t){b(this.#e,t)}#r;get slots(){return s(this.#r)}set slots(t){b(this.#r,t)}#t;get chunks(){return s(this.#t)}set chunks(t){b(this.#t,t)}#o;get bgChunks(){return s(this.#o)}set bgChunks(t){b(this.#o,t)}#n;get allDayChunks(){return s(this.#n)}set allDayChunks(t){b(this.#n,t)}#i;get allDayBgChunks(){return s(this.#i)}set allDayBgChunks(t){b(this.#i,t)}#s;get iChunks(){return s(this.#s)}set iChunks(t){b(this.#s,t)}#a;get allDayIChunks(){return s(this.#a)}set allDayIChunks(t){b(this.#a,t)}constructor(t){super(t),this.#e=f(Xp(t)),this.#r=f(Qp(t,this));let r=f(Zp(t,this)),n=f(()=>s(r).chunks),i=f(()=>s(r).bgChunks),o=f(()=>s(r).allDayChunks),a=f(()=>s(r).allDayBgChunks);this.#t=f(()=>s(n)),this.#o=f(()=>s(i)),this.#n=f(()=>s(o)),this.#i=f(()=>s(a));let l=f(Kp(t,this)),c=f(()=>s(l).iChunks),p=f(()=>s(l).allDayIChunks);this.#s=f(()=>s(c)),this.#a=f(()=>s(p))}}}var DR=class extends fd(ha()){#e;get grid(){return s(this.#e)}set grid(e){b(this.#e,e)}constructor(e){super(e),this.#e=f(jp(e,this))}},tv;function rv(e){return()=>{let{activeRange:t,filteredEvents:r,resources:n,options:{filterResourcesWithEvents:i},extensions:{viewResources:o}}=e,a=o?o(n):n;return D(()=>{i&&(a=n.filter(l=>r.some(c=>!pr(c.display)&&qn(c,t.start,t.end,l)))),a.length||(a=tv??=va([{}]))}),a}}function nv(e,t){return()=>{let{viewDates:r,options:{datesAboveResources:n,highlightedDates:i,validRange:o}}=e,{slotTimeLimits:a,viewResources:l}=t,c=[];return D(()=>{let p=1,h=[l,r],u=[Ac,Vt];n&&(h.reverse(),u.reverse());for(let d of h[0]){let v=[],_=u[0](d);for(let m of h[1]){let g=n?d:m,y=n?m:d;v.push({gridColumn:p,gridRow:1,resource:y,key:u[1](m),groupKey:_,start:xt(Z(g),a.min),end:xt(Z(g),a.max),dayStart:g,dayEnd:tr(Z(g)),disabled:Kn(g,o),highlight:i.some(x=>nt(x,g))}),++p}c.push(v)}}),c}}function pd(e){return class extends e{#e;get viewResources(){return s(this.#e)}set viewResources(t){b(this.#e,t)}constructor(t){super(t),this.#e=f(rv(t))}}}var SR=class extends pd(fd(ha())){#e;get grid(){return s(this.#e)}set grid(e){b(this.#e,e)}constructor(e){super(e),this.#e=f(nv(e,this))}},RR=V("<span><!></span>");var AR=V("<div></div>");var NR=V("<div></div>"),OR=V('<div aria-hidden="true"></div>');var IR=V('<div><aside><!></aside> <div role="row"></div> <div><!> <!> <!></div></div>'),MR=V("<div><time></time></div>"),LR=V('<section><header><aside></aside> <div role="row"><!></div> <!></header> <div role="rowgroup"><aside aria-hidden="true"><!> <!></aside> <div role="row"></div> <!> <div><!> <!> <!></div></div> <!></section>');var PR=V("<!> <!>",1);function iv(e,t){let r=0,n=t.length;for(;r<n;){let i=r+n>>1;t[i].dayEnd>e.start?n=i:r=i+1}for(;r>0&&t[r-1].end>e.start;)--r;return r}function vd(e,t,r,n=!0){let i=[],o,a,l,c,p,h,u=0;for(let d=iv(e,t);d<t.length;++d){let{gridColumn:v,gridRow:_,resource:m,dayStart:g,dayEnd:y,start:x,end:T,disabled:w}=t[d];if(g>=e.end)break;w||(r?qn(e,g,y,m)&&(i.length||(o=g,l=v,c=_,p=m),i.push(g),a=y):qn(e,x,T,m)&&(i.length||(o=x,l=v,c=_,p=m,h=Pr(e.start-x,0)/1e3),i.push(g),a=T,u+=(Vn(T,e.end)-Pr(x,e.start))/1e3))}if(i.length){let d=Ri(e,o,a);return ke(d,{gridColumn:l,gridRow:c,resource:p,dates:i,left:h,width:u}),n&&pa(d),d}return null}function hd(e,t){let r=t[0]?.resource;return!r||e.resourceIds.includes(r.id)}function ov(e,t){let r=[],n={};for(let a of e){let{gridColumn:l,gridRow:c,dates:p,start:h,end:u,event:{layoutGroup:d}}=a;a.span=t?[l,l+p.length]:[+h,+u];let v;if(d!==void 0){let _=`${c}_${d}`;v=n[_],v||(v=Dc(a,r),n[_]=v)}else v=Dc(a,r);a.rivals=v.chunks.filter(_=>Js(_.span,a.span)),v.chunks.push(a),sv(v.span,a.span),v.startColumn=Vn(v.startColumn,l),v.endColumn=Pr(v.endColumn,l+p.length)}let i=[],o=(a,l)=>(i[a]??=[])[l]??={spanning:[],starting:[]};for(let a of r){let{gridRow:l,startColumn:c,endColumn:p,span:h}=a,u=[],d=o(l,c);for(let v of d.spanning)Js(v.span,h)&&u.push(v);for(let v=c+1;v<p;++v)for(let _ of o(l,v).starting)Js(_.span,h)&&u.push(_);a.rivals=u,d.starting.push(a);for(let v=c;v<p;++v)o(l,v).spanning.push(a)}return r}function Dc(e,t){let{gridColumn:r,gridRow:n,span:i}=e,o={gridRow:n,chunks:[],span:[...i],startColumn:r,endColumn:r};return t.push(o),o}function Js([e,t],[r,n]){return e<n&&t>r}function sv(e,t){e[0]=Vn(e[0],t[0]),e[1]=Pr(e[1],t[1])}function av(e,t){return()=>{let{viewDates:r,options:{highlightedDates:n,validRange:i}}=e,{dayTimeLimits:o,viewResources:a}=t,l=[];return D(()=>{let c=1;for(let p of a){let h=[],u=1;for(let d of r){let v=o[Vt(d)];h.push({gridColumn:u,gridRow:c,resource:p,start:xt(Z(d),v.min),end:xt(Z(d),v.max),dayStart:d,dayEnd:tr(Z(d)),disabled:Kn(d,i),highlight:n.some(_=>nt(_,d))}),++u}l.push(h),++c}}),l}}function lv(e){return e.months===1&&!e.years&&!e.days&&!e.seconds}function cv(e){return e.inWeeks&&e.days===7&&!e.years&&!e.months&&!e.seconds}function dv(e,t){return()=>{let{features:r,options:{duration:n,firstDay:i,weekNumbers:o}}=e,{grid:a}=t,l=[],c=[];return D(()=>{let p,h;if(!Fr(a)){for(let{dayStart:u,gridColumn:d}of a[0])if(r.includes("month")&&(p&&p.date.getUTCMonth()===u.getUTCMonth()?++p.span:(p={date:u,gridColumn:d,span:1},l.push(p))),o){let v=Pc(u,i);h&&h.number===v?++h.span:(h={number:v,date:u,gridColumn:d,span:1},c.push(h))}}$n(l)===1&&lv(n)&&(l=[]),$n(c)===1&&cv(n)&&(c=[])}),{months:l,weeks:c}}}function uv(e,t){return()=>{let{filteredEvents:r}=e,{grid:n,monthView:i}=t,o=[],a=[],l;return D(()=>{for(let c of r){let p=pr(c.display);if(p&&i&&!c.allDay)continue;let h=p?a:o;for(let u of n){if(!hd(c,u))continue;let d=vd(c,u,i);d&&h.push(d)}}l=ov(o,i)}),{chunks:o,bgChunks:a,units:l}}}function fv(e,t){return()=>{let{iEvents:r}=e,{grid:n,monthView:i}=t,o=[];for(let[,a]of r)a&&D(()=>{for(let l of n){if(!hd(a,l))continue;let c=vd(a,l,i,!1);c&&o.push(c)}});return o}}function pv(e){return()=>{let{filteredEvents:t,viewDates:r,options:{flexibleSlotTimeLimits:n,slotMinTime:i,slotMaxTime:o}}=e,a={};return D(()=>{for(let l of r)a[Vt(l)]=id(i,o,n,[l],t)}),a}}function vv(e,t){return()=>{let{viewDates:r,options:{slotDuration:n}}=e,{dayTimeLimits:i,intlSlotLabel:o,slotLabelPeriodicity:a}=t,l={};return D(()=>{for(let c of r){let p=Vt(c);l[p]=p in i?nd(c,n,a,i[p],o):[]}}),l}}function hv(e){return()=>{let{resources:t}=e,r;return D(()=>{r=t.some(n=>Vc(n).children.length)}),r}}function _v(e){return()=>{let{options:{slotDuration:t}}=e,r;return D(()=>{r=!Ze(t)}),r}}var FR=class extends pd(ha()){#e;get dayTimeLimits(){return s(this.#e)}set dayTimeLimits(e){b(this.#e,e)}#r;get daySlots(){return s(this.#r)}set daySlots(e){b(this.#r,e)}#t;get grid(){return s(this.#t)}set grid(e){b(this.#t,e)}#o;get extraHeads(){return s(this.#o)}set extraHeads(e){b(this.#o,e)}#n;get intlMonthHeader(){return s(this.#n)}set intlMonthHeader(e){b(this.#n,e)}#i;get monthView(){return s(this.#i)}set monthView(e){b(this.#i,e)}#s;get chunks(){return s(this.#s)}set chunks(e){b(this.#s,e)}#a;get bgChunks(){return s(this.#a)}set bgChunks(e){b(this.#a,e)}#l;get units(){return s(this.#l)}set units(e){b(this.#l,e)}#f;get iChunks(){return s(this.#f)}set iChunks(e){b(this.#f,e)}#u;get nestedResources(){return s(this.#u)}set nestedResources(e){b(this.#u,e)}constructor(e){super(e),this.#e=f(pv(e)),this.#r=f(vv(e,this)),this.#t=f(av(e,this)),this.#o=f(dv(e,this)),this.#n=f(tn(e,"monthHeaderFormat")),this.#i=f(_v(e));let t=f(uv(e,this)),r=f(()=>s(t).chunks),n=f(()=>s(t).bgChunks),i=f(()=>s(t).units);this.#s=f(()=>s(r)),this.#a=f(()=>s(n)),this.#l=f(()=>s(i)),this.#f=f(fv(e,this)),this.#u=f(hv(e))}};var zR=V("<span></span>"),HR=V("<button></button>"),UR=V("<!> <span><!></span>",1);cr(["click"]);var BR=V("<div></div>");var VR=V("<time></time>"),YR=V("<span><!></span>"),qR=V("<div><time></time></div>"),GR=V('<div role="rowheader"><!> <!></div>'),WR=V("<div></div>"),jR=V("<div><!></div>"),ZR=V('<section><header><aside></aside> <div role="row"><!> <!> <!> <!></div></header> <div role="rowgroup"><aside></aside> <div role="row"></div> <div><!> <!> <!> <!> <!></div></div> <!></section>');function _d(e,t,r){return Hn($p,{target:e,props:{plugins:t,options:r}})}function gd(e){return xi(e)}var md=`/*!
 * EventCalendar v5.22.0
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
        --ec-today-bg-color: var(--ec-color-200);
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
            --ec-today-bg-color: var(--ec-color-200);
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

    .ec-timeline .ec-body & {
        grid-row: 1 / -1;
        position: relative;
        border-block-end: none;

        > :not(.ec-lines) {
            position: relative;
        }
    }

    .ec-timeline:not(.ec-month-view, .ec-year-view) .ec-body & {
        border-inline: none;
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

.ec-row {
    grid-column: 1 / -1;
    border-block-end: 1px solid var(--ec-border-color);

    &.ec-no-beb {
        border-block-end: none;
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
        position: relative;
        font-size: .95em;
        padding: .18rem 0;
        overflow: clip;
        text-overflow: ellipsis;

        /* The line does not take space from the label */
        &:after {
            content: '';
            position: absolute;
            inset-block: 0;
            inset-inline-end: 0;
            border-inline-end: 1px solid var(--ec-border-color);
        }
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
}

.ec-slots:last-child > .ec-slot:last-child:after {
    content: none;
}

/* Slot lines: a group per slot label with a solid line, dotted lines between the slots inside the group */
.ec-lines {
    display: flex;
    pointer-events: none;

    > div {
        display: flex;
        flex: none;
        box-sizing: border-box;

        > div {
            flex: none;
            box-sizing: border-box;
        }
    }

    .ec-time-grid & {
        flex-direction: column;

        > div {
            flex-direction: column;
            block-size: calc(var(--ec-slot-height) * var(--ec-slot-label-periodicity));
            border-block-end: 1px solid var(--ec-border-color);

            > div {
                block-size: var(--ec-slot-height);
                border-block-end: 1px dotted var(--ec-border-color);
            }
        }

        > :last-child {
            border-block-end: none;
        }
    }

    .ec-time-grid .ec-body > & {
        grid-area: 1 / 2 / -1 / -1;
    }

    .ec-time-grid .ec-sidebar > & {
        position: absolute;
        inset-block: 0;
        inset-inline-end: 0;
        inline-size: .375rem;
    }

    .ec-timeline & {
        position: absolute;
        inset: 0;

        > div {
            inline-size: calc(var(--ec-slot-width) * var(--ec-slot-label-periodicity));
            border-inline-end: 1px solid var(--ec-border-color);

            > div {
                inline-size: var(--ec-slot-width);
                border-inline-end: 1px dotted var(--ec-border-color);
            }
        }
    }

    .ec-timeline .ec-no-ieb > & > :last-child {
        border-inline-end: none;
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
/*$vite$:1*/`;var dA=md,mv=600;function $d(e,t){return t&&e>0&&e<mv?"listMonth":"dayGridMonth"}function bd(e,t=!1){let{head:r,row:n,foot:i}=t?Mo.compact:Mo.comfortable;return`calc(${r}em + ${e} * ${n}em + ${i}em)`}function $v(e,t,r,n,i,o=!1){let{head:a,row:l,foot:c}=i?Mo.compact:Mo.comfortable,p=yv(e),h=[];for(let u of bv(t,r)){let d=Math.max(0,...u.map(_=>p.get(_)??0));if(d===0){h.push(`${a}em`);continue}let v=d<=n?`calc(${a}em + ${d} * ${l}em)`:`calc(${a}em + ${n} * ${l}em + ${c}em)`;h.push(o?`minmax(${a}em, 1fr)`:v)}return`max-content ${h.join(" ")}`}function yv(e){let t=new Map;for(let r of e){if(!r.startDate)continue;let n=Ai(r.startDate),i=r.endDate?Ai(r.endDate):n;for(let o of wv(n,i))t.set(o,(t.get(o)??0)+1)}return t}function bv(e,t){let r=[],n=new Date(e.getFullYear(),e.getMonth(),e.getDate());for(;n<t&&r.length<10;){let i=[];for(let o=0;o<7;o++)i.push(Ni(n)),n.setDate(n.getDate()+1);r.push(i)}return r}function wv(e,t){let r=[e];if(t<=e)return r;let n=new Date(`${e}T00:00:00`),i=new Date(`${t}T00:00:00`);for(;r.length<400&&(n.setDate(n.getDate()+1),!(n>i));)r.push(Ni(n));return r}function xv(e=!1){return`minmax(${bd(1,e)}, 1fr)`}var Mo={comfortable:{head:2.4,row:1.6,foot:1.8},compact:{head:1.25,row:1.2,foot:.95}};function Ai(e){return e.slice(0,10)}function Ni(e){let t=String(e.getFullYear()).padStart(4,"0"),r=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${t}-${r}-${n}`}function Ev(e,t){let r;for(let n of e){if(!n.startDate)continue;let i=Ai(n.startDate);(n.endDate?Ai(n.endDate):i)<t||(r===void 0||i<r)&&(r=i)}return r}function kv(e){let t;for(let r of e){if(!r.startDate)continue;let n=Ai(r.startDate);(t===void 0||n>t)&&(t=n)}return t}function Tv(e,t,r){if(t.kind==="today")return;if(t.kind==="date")return t.date;let n=Ni(r);return Ev(e,n)??kv(e)}function yd(e,t){if(e)return t==="UTC"&&!Oi(e)?`${e}Z`:e}function Cv(e){return e.flatMap(t=>{let r=yd(t.startDate,t.timezone);if(!r)return[];let n=Oi(t.startDate),i=(n&&t.endDate?Lo(t.endDate,1):yd(t.endDate,t.timezone))??r;return[{title:t.name,start:r,end:i,allDay:n,extendedProps:{previewEvent:t}}]})}function Dv(e){let t=e==="es"?"es-ES":"en-US",r=Sv[e];return{locale:t,firstDay:e==="es"?1:0,buttonText:{close:r.close},titleFormat:n=>Rv(new Intl.DateTimeFormat(t,{month:"long",year:"numeric"}).format(n)),dayHeaderFormat:{weekday:"short"},dayHeaderAriaLabelFormat:{weekday:"long"},eventTimeFormat:{hour:"numeric",minute:"2-digit"},moreLinkContent:n=>r.moreLink(n.num),noEventsContent:()=>r.noEvents}}var Sv={en:{close:"Close",moreLink:e=>`+${e} more`,noEvents:"No events this month"},es:{close:"Cerrar",moreLink:e=>`+${e} m\xE1s`,noEvents:"No hay eventos este mes"}};function Rv(e){return e.charAt(0).toLocaleUpperCase()+e.slice(1)}function Av(e){e.addEventListener("pointerdownoutside",t=>{let{target:r}=t,n=t.detail?.jsEvent;!(r instanceof Node)||!n?.composedPath||n.composedPath().includes(r)&&t.stopImmediatePropagation()},!0)}function uA(e,t,r){let{lang:n,maxPerDay:i,responsive:o,bounded:a,compact:l,fillsHeight:c}=r,p=r.now??new Date,h=Tv(t,r.initialDate,p);l?e.setAttribute("data-density","compact"):e.removeAttribute("data-density"),i==="off"?(e.removeAttribute("data-day-rows"),e.style.removeProperty("--ote-calendar-row-height")):(e.setAttribute("data-day-rows",String(i)),e.style.setProperty("--ote-calendar-row-height",a?xv(l):bd(i,l)));let u=(m,g)=>{if(i==="off"){e.removeAttribute("data-week-rows"),e.style.removeProperty("--ote-calendar-week-rows");return}e.setAttribute("data-week-rows",""),e.style.setProperty("--ote-calendar-week-rows",$v(t,m,g,i,l,c))};Av(e);let d=$d(e.clientWidth,o),v=_d(e,[dd,ud],{...Dv(n),view:d,...h?{date:h}:{},events:Cv(t),height:"100%",dayMaxEvents:i!=="off",datesSet(m){let g=r.now??new Date,y=+new Date(g.getFullYear(),g.getMonth(),g.getDate());if(r.onDatesSet?.({title:typeof m.view.title=="string"?m.view.title:"",showsToday:y>=+m.start&&y<+m.end}),m.view.type==="list"){e.removeAttribute("data-week-rows");return}u(m.start,m.end)},headerToolbar:{start:"",center:"",end:""},eventClick(m){let g=m.event.extendedProps.previewEvent;g&&r.onEventClick(g)}}),_;return o&&typeof ResizeObserver<"u"&&(_=new ResizeObserver(m=>{let g=m[0]?.contentRect.width??e.clientWidth,y=$d(g,o);y!==d&&(d=y,v.setOption("view",y))}),_.observe(e)),{prev(){v.prev()},next(){v.next()},today(){v.setOption("date",Ni(r.now??new Date))},currentDate(){let m=v.getOption("date");return m instanceof Date?Ni(m):typeof m=="string"?m:void 0},destroy(){_?.disconnect(),gd(v)}}}export{dA as CALENDAR_CSS,Mo as CALENDAR_DENSITY,mv as CALENDAR_LIST_BREAKPOINT,xv as boundedRowHeight,Dv as calendarLocaleOptions,$d as calendarViewForWidth,bd as dayRowHeight,Ev as nextEventDate,uA as renderCalendar,Tv as resolveCalendarDate,Ni as toISODate,$v as weekRowTracks};
/*! Bundled license information:

@event-calendar/core/dist/index.js:
  (*!
   * EventCalendar v5.22.0
   * https://github.com/vkurko/calendar
   *)
*/
//# sourceMappingURL=calendar-layout.js.map
