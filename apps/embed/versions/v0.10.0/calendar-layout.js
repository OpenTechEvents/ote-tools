function Kn(e){return e!==void 0&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function Hi(e,t){let r=new Date(`${e}T00:00:00Z`);return r.setUTCDate(r.getUTCDate()+t),r.toISOString().slice(0,10)}var os=globalThis.process?.env?.NODE_ENV,_=os&&!os.toLowerCase().startsWith("prod");var lr=Array.isArray,ss=Array.prototype.indexOf,cr=Array.prototype.includes,Xr=Array.from,zi=Object.keys,Oe=Object.defineProperty,ht=Object.getOwnPropertyDescriptor,Ui=Object.getOwnPropertyDescriptors,Bi=Object.prototype,as=Array.prototype,Kr=Object.getPrototypeOf,Vi=Object.isExtensible;var ue=()=>{};function Zn(e){for(var t=0;t<e.length;t++)e[t]()}function Jn(){var e,t,r=new Promise((n,i)=>{e=n,t=i});return{promise:r,resolve:e,reject:t}}var st=Symbol("$state"),Qn=Symbol("component"),wn=Symbol("legacy props"),ls=Symbol(""),ei=Symbol("proxy path"),ti=Symbol("attributes"),xn=Symbol("class"),En=Symbol("style"),kn=Symbol("text");var Yi=Symbol("hmr anchor"),dr=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},qi=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml");var Zr=3,Dt=8;var yt={};var le=Symbol("uninitialized"),St=Symbol("filename");var ri="http://www.w3.org/1999/xhtml";var yr="font-weight: bold",br="font-weight: normal";function cs(e){_?console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${e}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,yr,br):console.warn("https://svelte.dev/e/await_reactivity_loss")}function ds(e,t){_?console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${e}\` (${t}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,yr,br):console.warn("https://svelte.dev/e/await_waterfall")}function fs(){_?console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,yr,br):console.warn("https://svelte.dev/e/derived_inert")}function us(e,t,r){_?console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${e}\` attribute on \`${t}\` changed its value between server and client renders. The client value, \`${r}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,yr,br):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function Or(e){_?console.warn(`%c[svelte] hydration_mismatch
%c${e?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${e}`:"Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,yr,br):console.warn("https://svelte.dev/e/hydration_mismatch")}function ps(){_?console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,yr,br):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function ni(e){_?console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${e}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,yr,br):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function hs(){_?console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",yr,br):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var A=!1;function ye(e){A=e}var L;function ie(e){if(e===null)throw Or(),yt;return L=e}function Ge(){return ie(We(L))}function re(e){if(A){if(We(L)!==null)throw Or(),yt;L=e}}function Gi(e=1){if(A){for(var t=e,r=L;t--;)r=We(r);L=r}}function zt(e=!0){for(var t=0,r=L;;){if(r.nodeType===Dt){var n=r.data;if(n==="]"){if(t===0)return r;t-=1}else(n==="["||n==="[!"||n[0]==="["&&!isNaN(Number(n.slice(1))))&&(t+=1)}var i=We(r);e&&r.remove(),r=i}}function wr(e){if(!e||e.nodeType!==Dt)throw Or(),yt;return e.data}function ii(e){return e===this.v}function Wi(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function oi(e){return!Wi(e,this.v)}function vs(e){if(_){let t=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${e}"
https://svelte.dev/e/invariant_violation`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invariant_violation")}function Tn(e){if(_){let t=new Error(`lifecycle_outside_component
\`${e}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function gs(){if(_){let e=new Error("set_context_after_init\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\nhttps://svelte.dev/e/set_context_after_init");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/set_context_after_init")}function _s(){if(_){let e=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/async_derived_orphan")}function $s(){if(_){let e=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/derived_references_self")}function ji(e,t,r){if(_){let n=new Error(`each_key_duplicate
${r?`Keyed each block has duplicate key \`${r}\` at indexes ${e} and ${t}`:`Keyed each block has duplicate key at indexes ${e} and ${t}`}
https://svelte.dev/e/each_key_duplicate`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function ys(e,t,r){if(_){let n=new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${e} was \`${t}\` but is now \`${r}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw n.name="Svelte error",n}else throw new Error("https://svelte.dev/e/each_key_volatile")}function bs(e){if(_){let t=new Error(`effect_in_teardown
\`${e}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function ws(){if(_){let e=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function xs(e){if(_){let t=new Error(`effect_orphan
\`${e}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_orphan")}function Es(){if(_){let e=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function ks(){if(_){let e=new Error("get_abort_signal_outside_reaction\n`getAbortSignal()` can only be called inside an effect or derived\nhttps://svelte.dev/e/get_abort_signal_outside_reaction");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/get_abort_signal_outside_reaction")}function Ts(){if(_){let e=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/hydration_failed")}function Cs(){if(_){let e=new Error("invalid_snippet\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\nhttps://svelte.dev/e/invalid_snippet");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invalid_snippet")}function Ds(e){if(_){let t=new Error(`props_invalid_value
Cannot do \`bind:${e}={undefined}\` when \`${e}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_invalid_value")}function Ss(e){if(_){let t=new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${e}\` are readonly
https://svelte.dev/e/props_rest_readonly`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function Rs(e){if(_){let t=new Error(`rune_outside_svelte
The \`${e}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function As(){if(_){let e=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function Ns(){if(_){let e=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Os(){if(_){let e=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function Is(){if(_){let e=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var Ie=!1,fr=!1,Ut=!1;var Cn=null;function oe(e,t){return e.label=t,ai(e.v,t),e}function ai(e,t){return e?.[ei]?.(t),e}function tn(e){return typeof e=="symbol"?`Symbol(${e.description})`:typeof e=="function"?"<function>":typeof e=="object"&&e?"<object>":String(e)}function Bt(e){let t=new Error,r=Gl();return r.length===0?null:(r.unshift(`
`),Oe(t,"stack",{value:r.join(`
`)}),Oe(t,"name",{value:e}),t)}function Gl(){let e=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let t=new Error().stack;if(Error.stackTraceLimit=e,!t)return[];let r=t.split(`
`),n=[];for(let i=0;i<r.length;i++){let s=r[i],a=s.replaceAll("\\","/");if(s.trim()!=="Error"){if(s.includes("validate_each_keys"))return[];a.includes("svelte/src/internal")||a.includes("node_modules/.vite")||n.push(s)}}return n}function Ls(e,t){if(!_)throw new Error("invariant(...) was not guarded by if (DEV)");e||vs(t)}function Wl(e){let t=e.p;for(;t!==null&&t.c===null;)t=t.p;return t?.c??null}function Xi(e,t){return e===null&&Tn(t),e.c??=new Map(Wl(e)||void 0)}var G=null;function ur(e){G=e}var Vt=null;function rn(e){Vt=e}var Yt=null;function li(e){Yt=e}function xe(e){return Xi(G,"getContext").get(e)}function Dn(e,t){let r=Xi(G,"setContext");if(Ie){var n=S.f,i=!O&&(n&32)!==0&&!G.i;i||gs()}return r.set(e,t),t}function Xe(e,t=!1,r){G={p:G,i:!1,c:null,e:null,s:e,x:null,r:S,l:fr&&!t?{s:null,u:null,$:[]}:null},_&&(G.function=r,Yt=r)}function Ke(e){var t=G,r=t.e;if(r!==null){t.e=null;for(var n of r)Ki(n)}return e!==void 0&&(t.x=e),t.i=!0,G=t.p,_&&(Yt=G?.function??null),Sn(e)}function Sn(e={}){return Oe(e,Qn,{value:!0}),e}function tr(){return!fr||G!==null&&G.l===null}var Ir=[];function Ps(){var e=Ir;Ir=[],Zn(e)}function Ee(e){if(Ir.length===0&&!Mr){var t=Ir;queueMicrotask(()=>{t===Ir&&Ps()})}Ir.push(e)}function Fs(){for(;Ir.length>0;)Ps()}var jl=-7169;function se(e,t){e.f=e.f&jl|t}function nn(e){(e.f&512)!==0||e.deps===null?se(e,1024):se(e,4096)}function ci(e,t){(e.f&2048)!==0?t.set(e,2048):(e.f&4096)!==0&&t.get(e)!==2048&&t.set(e,4096),se(e,1024)}function Hs(e){return`{${e.toString().replace(/^async \(\) => /,"").replace(/^\(/,"").replace(/\$\.get\((.+?)\)/g,(t,r)=>r).replace(/\$\.track_reactivity_loss\((.+?)\)\(\)/g,(t,r)=>r).replace(/\)$/,"")}}`}function di(e,t){if(t){let r=document.body;e.autofocus=!0,Ee(()=>{document.activeElement===r&&e.focus()})}}function At(e){var t=O,r=S;ke(null),Le(null);try{return e()}finally{ke(t),Le(r)}}function fi(e,t,r,n){let i=tr()?kr:Pr;var s=e.filter(d=>!d.settled),a=t.map(i);if(_&&a.forEach((d,g)=>{d.label=t[g].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\$\.get\((.+?)\)/g,($,m)=>m)}),r.length===0&&s.length===0){n(a);return}var l=S,c=Us(),p=s.length===1?s[0].promise:s.length>1?Promise.all(s.map(d=>d.promise)):null;function v(d){if((l.f&16384)===0){c();try{n([...a,...d])}catch(g){gt(g,l)}on()}}var h=Zi();if(r.length===0){p.then(()=>v([])).finally(h);return}function u(){Promise.all(r.map(d=>Qi(d))).then(v).catch(d=>gt(d,l)).finally(h)}p?p.then(()=>{if((l.f&16384)!==0){h();return}c(),u(),on()}):u()}function Us(){var e=S,t=O,r=G,n=P;if(_)var i=Vt;return function(a=!0){Le(e),ke(t),ur(r),a&&(e.f&16384)===0&&(n?.activate(),n?.apply()),_&&(Ji(null),rn(i))}}var Kl=!1;function on(e=!0){Kl=!1,Le(null),ke(null),ur(null),e&&P?.deactivate(),_&&(Ji(null),rn(null))}function Zi(){var e=S,t=e.b,r=P,n=!!t?.is_rendered();return t?.update_pending_count(1,r),r.increment(n,e),()=>{t?.update_pending_count(-1,r),r.decrement(n,e)}}var mt=null;function Ji(e){mt=e}var Nn=new Set;function kr(e){var t=2050;S!==null&&(S.f|=524288);let r={ctx:G,deps:null,effects:null,equals:ii,f:t,fn:e,reactions:null,rv:0,v:le,wv:0,parent:S,ac:null};return _&&Ut&&(r.created=Bt("created at")),r}var sn=Symbol("obsolete");function Qi(e,t,r){let n=S;n===null&&_s();var i=void 0,s=Pe(le);_&&(s.label=t??Hs(e));var a=!O,l=new Set;return Ys(()=>{var c=S;_&&(mt={effect:c,effect_deps:new Set,warned:!1});var p=Jn();i=p.promise;try{Promise.resolve(e()).then(p.resolve,d=>{d!==dr&&p.reject(d)}).finally(on)}catch(d){p.reject(d),on()}if(_){if(mt){if(c.deps!==null)for(let d=0;d<at;d+=1)mt.effect_deps.add(c.deps[d]);if(Ue!==null)for(let d=0;d<Ue.length;d+=1)mt.effect_deps.add(Ue[d])}mt=null}var v=P;if(a){if((c.f&32768)!==0)var h=Zi();if(n.b?.is_rendered())v.async_deriveds.get(c)?.reject(sn);else for(let d of l.values())d.reject(sn);l.add(p),v.async_deriveds.set(c,p)}let u=(d,g=void 0)=>{_&&(mt=null),h?.(),l.delete(p),g!==sn&&(v.activate(),g?(s.f|=8388608,Gt(s,g)):((s.f&8388608)!==0&&(s.f^=8388608),_&&r!==void 0&&!s.equals(d)&&(Nn.add(s),setTimeout(()=>{Nn.has(s)&&(c.f&16384)===0&&(ds(s.label,r),Nn.delete(s))})),Gt(s,d)),v.deactivate())};p.promise.then(u,d=>u(null,d||"unknown"))}),Je(()=>{for(let c of l)c.reject(sn)}),_&&(s.f|=4194304),new Promise(c=>{function p(v){function h(){v===i?c(s):p(i)}v.then(h,h)}p(i)})}function f(e){let t=kr(e);return Ie||hi(t),t}function Pr(e){let t=kr(e);return t.equals=oi,t}function Bs(e){var t=e.effects;if(t!==null){e.effects=null;for(var r=0;r<t.length;r+=1)ge(t[r])}}var eo=[];function On(e){var t,r=S,n=e.parent;if(!wt&&n!==null&&e.v!==le&&(n.f&24576)!==0)return fs(),e.v;if(Le(n),_){let i=Fr;ui(new Set);try{cr.call(eo,e)&&$s(),eo.push(e),Bs(e),t=pi(e)}finally{Le(r),ui(i),eo.pop()}}else try{Bs(e),t=pi(e)}finally{Le(r)}return t}function to(e){var t=On(e);if(!e.equals(t)&&(e.wv=an(),(!P?.is_fork||e.deps===null)&&(P!==null?(P.capture(e,t,!0),Wt?.capture(e,t,!0)):e.v=t,e.deps===null))){se(e,1024);return}wt||(Be!==null?(xr()||P?.is_fork)&&Be.set(e,t):nn(e))}function Vs(e){if(e.effects!==null)for(let t of e.effects)(t.teardown||t.ac)&&(t.teardown?.(),t.ac!==null&&At(()=>{t.ac.abort(dr),t.ac=null}),t.fn!==null&&(t.teardown=ue),Hr(t,0),In(t))}function ro(e){if(e.effects!==null)for(let t of e.effects)t.teardown&&t.fn!==null&&rr(t)}var vi=null,ln=null,P=null,Wt=null,Be=null,oo=null,Mr=!1,no=!1,cn=null,Mn=null,qs=0,io=new Set,Ql=1,xt=class e{id=Ql++;started=!1;linked=!0;prev=null;next=null;async_deriveds=new Map;current=new Map;previous=new Map;#e=new Set;#t=new Set;#r=0;#n=new Map;#i=null;#o=[];#a=[];#s=new Map;#l=new Map;#d=new Set;is_fork=!1;#c=!1;constructor(){ln===null?vi=ln=this:(ln.next=this,this.prev=ln),ln=this}#v(){if(this.is_fork)return!0;for(let t of this.#n.keys())if(!this.#_(t))return!0;return!1}#_(t){for(var r=t;r!==null;r=r.parent)if(this.#l.has(r))return!0;return!1}skip_effect(t){this.#l.has(t)||this.#l.set(t,{d:[],m:[]}),this.#d.delete(t)}unskip_effect(t,r=n=>this.schedule(n)){var n=this.#l.get(t);if(n){this.#l.delete(t);for(var i of n.d)se(i,2048),r(i);for(i of n.m)se(i,4096),r(i)}this.#d.add(t)}#f(){var t=[];for(let s of this.#o)if(!((s.f&16384)!==0||(s.f&6144)===0)){for(var r=s,n=!1;r.parent!==null;){r=r.parent;var i=r.f;if((i&96)!==0){if((i&1024)===0){n=!0;break}r.f^=1024}}n||t.push(r)}return this.#o=[],t}#g(){if(this.started=!0,_)for(let l of this.current.keys())io.add(l);for(let[l,c]of this.#s)se(l,c),this.schedule(l);this.apply();for(var t=cn=[],r=[],n=Mn=[];this.#o.length>0;){qs++>1e3&&(this.#p(),ec());for(let l of this.#f())try{this.#$(l,t,r)}catch(c){throw Xs(l),this.#v()||this.discard(),c}}if(P=null,n.length>0){var i=e.ensure();for(let l of n)i.schedule(l)}if(cn=null,Mn=null,this.#v()){this.#h(r),this.#h(t);for(let[l,c]of this.#l)js(l,c);n.length>0&&P.#g();return}let s=this.#b();if(s){this.#h(r),this.#h(t),s.#u(this);return}this.#s.clear();for(let l of this.#e)l(this);this.#e.clear(),Wt=this,Gs(r),Gs(t),Wt=null,this.#i?.resolve();var a=P;this.#r===0&&(this.#o.length===0||a!==null)&&(this.#p(),Ie&&(this.#y(),P=a)),a!==null&&(Ot.clear(),a.#g())}#$(t,r,n){t.f^=1024;for(var i=t.first;i!==null;){var s=i.f,a=(s&96)!==0,l=a&&(s&1024)!==0,c=l||(s&8192)!==0||this.#l.has(i);if(!c&&i.fn!==null){a?i.f^=1024:(s&4)!==0?r.push(i):Ie&&(s&16777224)!==0?n.push(i):Cr(i)&&((s&16)!==0&&this.add_dirty_reaction(i,4096),rr(i));var p=i.first;if(p!==null){i=p;continue}}for(;i!==null;){var v=i.next;if(v!==null){i=v;break}i=i.parent}}}#b(){for(var t=this.prev;t!==null;t=t.prev)if(!t.is_fork&&this.#m(t))return t;return null}#m(t){for(let[r,[,n]]of this.current)if(!n&&t.current.has(r))return!0;return!1}#u(t){for(let[n,i]of t.current)!this.previous.has(n)&&t.previous.has(n)&&this.previous.set(n,t.previous.get(n)),this.current.set(n,i);for(let[n,i]of t.async_deriveds){let s=this.async_deriveds.get(n);s&&i.promise.then(s.resolve).catch(s.reject)}t.async_deriveds.clear(),this.transfer_reactions(t.#s);let r=n=>{var i=n.reactions;if(i!==null&&!((n.f&2)!==0&&(n.f&6144)===0))for(let l of i){var s=l.f;if((s&2)!==0)r(l);else{var a=l;s&4194320&&!this.async_deriveds.has(a)&&(this.#s.delete(a),se(a,2048),this.schedule(a))}}};for(let n of this.current.keys())r(n);this.oncommit(()=>t.discard()),t.#p(),P=this,this.#g()}#h(t){for(var r=0;r<t.length;r+=1)ci(t[r],this.#s)}capture(t,r,n=!1){t.v!==le&&!this.previous.has(t)&&this.previous.set(t,t.v),(t.f&8388608)===0&&(this.current.set(t,[r,n]),Be?.set(t,r)),this.is_fork||(t.v=r)}activate(){P=this}deactivate(){P=null,Be=null}flush(){try{_&&io.clear(),no=!0,P=this,this.#g()}finally{if(qs=0,oo=null,cn=null,Mn=null,no=!1,P=null,Be=null,Ot.clear(),_)for(let t of io)t.updated=null}}discard(){for(let t of this.#t)t(this);this.#t.clear();for(let t of this.async_deriveds.values())t.reject(sn);this.#p(),this.#i?.resolve()}register_created_effect(t){this.#a.push(t)}#y(){for(let h=vi;h!==null;h=h.next){var t=h.id<this.id,r=[];for(let[u,[d,g]]of this.current){if(h.current.has(u)){var n=h.current.get(u)[0];if(t&&d!==n)h.current.set(u,[d,g]);else continue}r.push(u)}if(t)for(let[u,d]of this.async_deriveds){let g=h.async_deriveds.get(u);g&&d.promise.then(g.resolve).catch(g.reject)}var i=[...h.current.keys()].filter(u=>!h.current.get(u)[1]);if(!(!h.started||i.length===0)){var s=i.filter(u=>!this.current.has(u));if(s.length===0)t&&h.discard();else if(r.length>0){if(_&&!h.#c&&Ls(h.#o.length===0,"Batch has scheduled effects"),t)for(let u of this.#d)h.unskip_effect(u,d=>{(d.f&4194320)!==0?h.schedule(d):h.#h([d])});h.activate();var a=new Set,l=new Map;for(var c of r)Ws(c,s,a,l);l=new Map;var p=[...h.current].filter(([u,d])=>{let g=this.current.get(u);return g?g[0]!==d[0]||g[1]!==d[1]:!0}).map(([u])=>u);if(p.length>0)for(let u of this.#a)(u.f&155648)===0&&so(u,p,l)&&((u.f&4194320)!==0?(se(u,2048),h.schedule(u)):h.add_dirty_reaction(u,2048));if(h.#o.length>0&&!h.#c){h.apply();for(var v of h.#f())h.#$(v,[],[])}h.deactivate()}}}}increment(t,r){if(this.#r+=1,t){let n=this.#n.get(r)??0;this.#n.set(r,n+1)}}decrement(t,r){if(this.#r-=1,t){let n=this.#n.get(r)??0;n===1?this.#n.delete(r):this.#n.set(r,n-1)}this.#c||(this.#c=!0,Ee(()=>{this.#c=!1,this.linked&&this.flush()}))}transfer_reactions(t){for(let[r,n]of t)this.add_dirty_reaction(r,n);t.clear()}add_dirty_reaction(t,r){(r===2048||this.#s.get(t)!==2048)&&this.#s.set(t,r)}oncommit(t){this.#e.add(t)}ondiscard(t){this.#t.add(t)}settled(){return(this.#i??=Jn()).promise}static ensure(){if(P===null){let t=P=new e;!no&&!Mr&&Ee(()=>{t.started||t.flush()})}return P}apply(){if(!Ie||!this.is_fork&&this.prev===null&&this.next===null){Be=null;return}Be=new Map;for(let[t,[r]]of this.current)Be.set(t,r);for(let t=vi;t!==null;t=t.next)if(!(t===this||t.is_fork)&&(t.id>=this.id||!t.#m(this)))for(let[r,n]of t.previous)Be.has(r)||Be.set(r,n)}schedule(t){if(oo=t,t.b?.is_pending&&(t.f&16777228)!==0&&(t.f&32768)===0){t.b.defer_effect(t);return}this.#o.push(t)}#p(){if(this.linked){var t=this.prev,r=this.next;t===null?vi=r:t.next=r,r===null?ln=t:r.prev=t,this.linked=!1}}};function Tr(e){var t=Mr,r=Wt;Wt=null,Mr=!0;try{var n;for(e&&(Tr(),n=e());;){if(Fs(),P===null)return n;P.flush()}}finally{Mr=t,Wt=r}}function ec(){if(_){var e=new Map;for(let r of P.current.keys())for(let[n,i]of r.updated??[]){var t=e.get(n);t||(t={error:i.error,count:0},e.set(n,t)),t.count+=i.count}for(let r of e.values())r.error&&console.error(r.error)}try{Es()}catch(r){_&&Oe(r,"stack",{value:""}),gt(r,oo)}}var Nt=null;function Gs(e){var t=e.length;if(t!==0){for(var r=0;r<t;){var n=e[r++];if((n.f&24576)===0&&Cr(n)&&(Nt=new Set,rr(n),n.deps===null&&n.first===null&&n.nodes===null&&n.teardown===null&&n.ac===null&&ao(n),Nt?.size>0)){Ot.clear();for(let i of Nt){if((i.f&24576)!==0)continue;let s=[i],a=i.parent;for(;a!==null;)Nt.has(a)&&(Nt.delete(a),s.push(a)),a=a.parent;for(let l=s.length-1;l>=0;l--){let c=s[l];(c.f&24576)===0&&rr(c)}}Nt.clear()}}Nt=null}}function Ws(e,t,r,n){if(!r.has(e)&&(r.add(e),e.reactions!==null))for(let i of e.reactions){let s=i.f;(s&2)!==0?Ws(i,t,r,n):(s&4194320)!==0&&(s&2048)===0&&so(i,t,n)&&(se(i,2048),Ln(i))}}function so(e,t,r){let n=r.get(e);if(n!==void 0)return n;if(e.deps!==null)for(let i of e.deps){if(cr.call(t,i))return!0;if((i.f&2)!==0&&so(i,t,r))return r.set(i,!0),!0}return r.set(e,!1),!1}function Ln(e){P.schedule(e)}function js(e,t){if(!((e.f&32)!==0&&(e.f&1024)!==0)){(e.f&2048)!==0?t.d.push(e):(e.f&4096)!==0&&t.m.push(e),se(e,1024);for(var r=e.first;r!==null;)js(r,t),r=r.next}}function Xs(e){se(e,1024);for(var t=e.first;t!==null;)Xs(t),t=t.next}var Fr=new Set,Ot=new Map;function ui(e){Fr=e}var co=!1;function Zs(){co=!0}function Pe(e,t){var r={f:0,v:e,reactions:null,equals:ii,rv:0,wv:0};return _&&Ut&&(r.created=t??Bt("created at"),r.updated=null,r.set_during_effect=!1,r.trace=null),r}function F(e,t){let r=Pe(e,t);return hi(r),r}function Br(e,t=!1,r=!0){let n=Pe(e);return t||(n.equals=oi),fr&&r&&G!==null&&G.l!==null&&(G.l.s??=[]).push(n),n}function b(e,t,r=!1){O!==null&&(!lt||(O.f&131072)!==0)&&tr()&&(O.f&4325394)!==0&&(jt===null||!jt.has(e))&&Os();let n=r?Ce(t):t;return _&&ai(n,e.label),Gt(e,n,Mn)}var Ur=null,lo=0;function Gt(e,t,r=null){if(!e.equals(t)){wt?Ot.set(e,t):Ot.has(e)||Ot.set(e,e.v);var n=xt.ensure();if(n.capture(e,t),_){if(Ut||S!==null){e.updated??=new Map;let i=(e.updated.get("")?.count??0)+1;if(e.updated.set("",{error:null,count:i}),Ut||i>5){let s=Bt("updated at");if(s!==null){let a=e.updated.get(s.stack);a||(a={error:s,count:0},e.updated.set(s.stack,a)),a.count++}}}S!==null&&(e.set_during_effect=!0)}if((e.f&2)!==0){let i=e;(e.f&2048)!==0&&On(i),Be===null&&nn(i)}e.wv=an(),Ur=null,lo=0,Js(e,2048,r),Ur=null,tr()&&S!==null&&(S.f&1024)!==0&&(S.f&96)===0&&(Et===null?Qs([e]):Et.push(e)),!n.is_fork&&Fr.size>0&&!co&&gi()}return t}function gi(){co=!1;for(let e of Fr){(e.f&1024)!==0&&se(e,4096);let t;try{t=Cr(e)}catch{t=!0}t&&rr(e)}Fr.clear()}function Te(e){b(e,e.v+1)}function Js(e,t,r){var n=e.reactions;if(n!==null){var i=tr(),s=n.length;if(lo+=s,lo>1e5&&Ur===null&&(Ur=new Set),Ur!==null){if(Ur.has(e))return;Ur.add(e)}for(var a=0;a<s;a++){var l=n[a],c=l.f;if(!(!i&&l===S)){var p=(c&2048)===0;if(p&&se(l,t),(c&131072)!==0)Fr.add(l);else if((c&2)!==0){var v=l;Be?.delete(v),Js(v,4096,r)}else if(p){var h=l;(c&16)!==0&&Nt!==null&&Nt.add(h),r!==null?r.push(h):Ln(h)}}}}}var rc=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function Ce(e){if(typeof e!="object"||e===null||st in e||Qn in e)return e;let t=Kr(e);if(t!==Bi&&t!==as)return e;var r=new Map,n=lr(e),i=F(0),s=_&&Ut?Bt("created at"):null,a=It,l=h=>{if(It===a)return h();var u=O,d=It;ke(null),fo(a);var g=h();return ke(u),fo(d),g};n&&(r.set("length",F(e.length,s)),_&&(e=ic(e)));var c="";let p=!1;function v(h){if(!p){p=!0,c=h,oe(i,`${c} version`);for(let[u,d]of r)oe(d,Vr(c,u));p=!1}}return new Proxy(e,{defineProperty(h,u,d){(!("value"in d)||d.configurable===!1||d.enumerable===!1||d.writable===!1)&&As();var g=r.get(u);return g===void 0?l(()=>{var $=F(d.value,s);return r.set(u,$),_&&typeof u=="string"&&oe($,Vr(c,u)),$}):b(g,d.value,!0),!0},deleteProperty(h,u){var d=r.get(u);if(d===void 0){if(u in h){let g=l(()=>F(le,s));r.set(u,g),Te(i),_&&oe(g,Vr(c,u))}}else b(d,le),Te(i);return!0},get(h,u,d){if(u===st)return e;if(_&&u===ei)return v;var g=r.get(u),$=u in h;if(g===void 0&&(!$||ht(h,u)?.writable)&&(g=l(()=>{var y=Ce($?h[u]:le),w=F(y,s);return _&&oe(w,Vr(c,u)),w}),r.set(u,g)),g!==void 0){var m=o(g);return m===le?void 0:m}return Reflect.get(h,u,d)},getOwnPropertyDescriptor(h,u){this.has?.(h,u);var d=Reflect.getOwnPropertyDescriptor(h,u),g=r.get(u);if(g!==void 0){var $=o(g);if($===le)return;if(d&&"value"in d)d.value=$;else return{enumerable:!0,configurable:!0,value:$,writable:!0}}return d},has(h,u){if(u===st)return!0;var d=r.get(u),g=d!==void 0&&d.v!==le||Reflect.has(h,u);if(d!==void 0||(S!==null||O!==null)&&(!g||ht(h,u)?.writable)){d===void 0&&(d=l(()=>{var m=g?Ce(h[u]):le,y=F(m,s);return _&&oe(y,Vr(c,u)),y}),r.set(u,d));var $=o(d);if($===le)return!1}return g},set(h,u,d,g){var $=r.get(u),m=u in h;if(n&&u==="length")for(var y=d;y<$.v;y+=1){var w=r.get(y+"");w!==void 0?b(w,le):y in h&&(w=l(()=>F(le,s)),r.set(y+"",w),_&&oe(w,Vr(c,y)))}if($===void 0)(!m||ht(h,u)?.writable)&&($=l(()=>F(void 0,s)),_&&oe($,Vr(c,u)),b($,Ce(d)),r.set(u,$));else{m=$.v!==le;var k=l(()=>Ce(d));b($,k)}var x=Reflect.getOwnPropertyDescriptor(h,u);if(x?.set&&x.set.call(g,d),!m){if(n&&typeof u=="string"){var C=r.get("length"),E=Number(u);Number.isInteger(E)&&E>=C.v&&b(C,E+1)}Te(i)}return!0},ownKeys(h){o(i);var u=Reflect.ownKeys(h).filter($=>{var m=r.get($);return m===void 0||m.v!==le});for(var[d,g]of r)g.v!==le&&!(d in h)&&u.push(d);return u},setPrototypeOf(){Ns()}})}function Vr(e,t){return typeof t=="symbol"?`${e}[Symbol(${t.description??""})]`:rc.test(t)?`${e}.${t}`:/^\d+$/.test(t)?`${e}[${t}]`:`${e}['${t}']`}function mi(e){try{if(e!==null&&typeof e=="object"&&st in e)return e[st]}catch{}return e}var nc=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function ic(e){return new Proxy(e,{get(t,r,n){var i=Reflect.get(t,r,n);return nc.has(r)?function(...s){Zs();var a=i.apply(this,s);return gi(),a}:i}})}function ea(){let e=Array.prototype,t=Array.__svelte_cleanup;t&&t();let{indexOf:r,lastIndexOf:n,includes:i}=e;e.indexOf=function(s,a){let l=r.call(this,s,a);if(l===-1){for(let c=a??0;c<this.length;c+=1)if(mi(this[c])===s){ni("array.indexOf(...)");break}}return l},e.lastIndexOf=function(s,a){let l=n.call(this,s,a??this.length-1);if(l===-1){for(let c=0;c<=(a??this.length-1);c+=1)if(mi(this[c])===s){ni("array.lastIndexOf(...)");break}}return l},e.includes=function(s,a){let l=i.call(this,s,a);if(!l){for(let c=0;c<this.length;c+=1)if(mi(this[c])===s){ni("array.includes(...)");break}}return l},Array.__svelte_cleanup=()=>{e.indexOf=r,e.lastIndexOf=n,e.includes=i}}var _i,ta,Pn,ra,na;function $i(){if(_i===void 0){_i=window,ta=document,Pn=/Firefox/.test(navigator.userAgent);var e=Element.prototype,t=Node.prototype,r=Text.prototype;ra=ht(t,"firstChild").get,na=ht(t,"nextSibling").get,Vi(e)&&(e[xn]=void 0,e[ti]=null,e[En]=void 0,e.__e=void 0),Vi(r)&&(r[kn]=void 0),_&&(e.__svelte_meta=null,ea())}}function De(e=""){return document.createTextNode(e)}function Ze(e){return ra.call(e)}function We(e){return na.call(e)}function pe(e,t){if(!A)return Ze(e);var r=Ze(L);if(r===null)r=L.appendChild(De());else if(t&&r.nodeType!==Zr){var n=De();return r?.before(n),ie(n),n}return t&&bi(r),ie(r),r}function Se(e,t=!1){if(!A){var r=Ze(e);return r instanceof Comment&&r.data===""?We(r):r}if(t){if(L?.nodeType!==Zr){var n=De();return L?.before(n),ie(n),n}bi(L)}return L}function dn(e,t=!1){if(!A)return Ze(e);var r=pe(e,t);return re(e),r}function rt(e,t=1,r=!1){let n=A?L:e;for(var i;t--;)i=n,n=We(n);if(!A)return n;if(r){if(n?.nodeType!==Zr){var s=De();return n===null?i?.after(s):n.before(s),ie(s),s}bi(n)}return ie(n),n}function An(e){e.textContent=""}function yi(){if(!Ie||Nt!==null)return!1;var e=S.f;return(e&32768)!==0}function nr(e,t,r){return t==null||t===ri?r?document.createElement(e,{is:r}):document.createElement(e):r?document.createElementNS(t,e,{is:r}):document.createElementNS(t,e)}function bi(e){if(e.nodeValue.length<65536)return;let t=e.nextSibling;for(;t!==null&&t.nodeType===Zr;)t.remove(),e.nodeValue+=t.nodeValue,t=e.nextSibling}var uo=new WeakMap;function ia(e){var t=S;if(t===null)return O.f|=8388608,e;if(_&&e instanceof Error&&!uo.has(e)&&uo.set(e,oc(e,t)),(t.f&32768)===0&&(t.f&4)===0)throw _&&!t.parent&&e instanceof Error&&oa(e),e;gt(e,t)}function gt(e,t){if(e===yt)throw e;if(!(t!==null&&(t.f&16384)!==0)){for(;t!==null;){if((t.f&128)!==0&&(t.f&33570816)===0){if((t.f&32768)===0)throw e;try{t.b.error(e);return}catch(r){e=r}}t=t.parent}throw _&&e instanceof Error&&oa(e),e}}function oc(e,t){let r=ht(e,"message");if(!(r&&!r.configurable)){for(var n=Pn?"  ":"	",i=`
${n}in ${t.fn?.name||"<unknown>"}`,s=t.ctx;s!==null;)i+=`
${n}in ${s.function?.[St].split("/").pop()}`,s=s.p;return{message:e.message+`
${i}
`,stack:e.stack?.split(`
`).filter(a=>!a.includes("svelte/src/internal")).join(`
`)}}}function oa(e){let t=uo.get(e);t&&(Oe(e,"message",{value:t.message}),Oe(e,"stack",{value:t.stack}))}function vo(e){S===null&&(O===null&&xs(e),ws()),wt&&bs(e)}function sc(e,t){var r=t.last;r===null?t.last=t.first=e:(r.next=e,e.prev=r,t.last=e)}function Mt(e,t){var r=S;if(_)for(;r!==null&&(r.f&131072)!==0;)r=r.parent;r!==null&&(r.f&8192)!==0&&(e|=8192);var n={ctx:G,deps:null,nodes:null,f:e|2048|512,first:null,fn:t,last:null,next:null,parent:r,b:r&&r.b,prev:null,teardown:null,wv:0,ac:null};_&&(n.component_function=Yt),P?.register_created_effect(n);var i=n;if((e&4)!==0)cn!==null?cn.push(n):xt.ensure().schedule(n);else if(t!==null){try{rr(n)}catch(a){throw ge(n),a}i.deps===null&&i.teardown===null&&i.nodes===null&&i.first===i.last&&(i.f&524288)===0&&(i=i.first,(e&16)!==0&&(e&65536)!==0&&i!==null&&(i.f|=65536))}if(i!==null&&(i.parent=r,r!==null&&sc(i,r),O!==null&&(O.f&2)!==0&&(e&64)===0)){var s=O;(s.effects??=[]).push(i)}return n}function xr(){return O!==null&&!lt}function Je(e){let t=Mt(8,null);return se(t,1024),t.teardown=e,t}function $t(e){vo("$effect"),_&&Oe(e,"name",{value:"$effect"});var t=S.f,r=!O&&(t&32)!==0&&G!==null&&!G.i;if(r){var n=G;(n.e??=[]).push(e)}else return Ki(e)}function Ki(e){return Mt(1048580,e)}function ir(e){return vo("$effect.pre"),_&&Oe(e,"name",{value:"$effect.pre"}),Mt(1048584,e)}function go(e){xt.ensure();let t=Mt(524352,e);return()=>{ge(t)}}function la(e){xt.ensure();let t=Mt(524352,e);return(r={})=>new Promise(n=>{r.outro?or(t,()=>{ge(t),n(void 0)}):(ge(t),n(void 0))})}function kt(e){return Mt(4,e)}function Ys(e){return Mt(4718592,e)}function nt(e,t=0){return Mt(8|t,e)}function fe(e,t=[],r=[],n=[]){fi(n,t,r,i=>{Mt(8,()=>{e(...i.map(o))})})}function dt(e,t=0){var r=Mt(16|t,e);return _&&(r.dev_stack=Vt),r}function mo(e,t=0){var r=Mt(16777216|t,e);return _&&(r.dev_stack=Vt),r}function Re(e){return Mt(524320,e)}function _o(e){var t=e.teardown;if(t!==null){let r=wt,n=O;po(!0),ke(null);try{t.call(null)}catch(i){gt(i,e.parent)}finally{po(r),ke(n)}}}function In(e,t=!1){var r=e.first;for(e.first=e.last=null;r!==null;){let i=r.ac;i!==null&&At(()=>{i.abort(dr)});var n=r.next;(r.f&64)!==0?r.parent=null:ge(r,t),r=n}}function ca(e){for(var t=e.first;t!==null;){var r=t.next;(t.f&32)===0&&ge(t),t=r}}function ge(e,t=!0){var r=!1;(t||(e.f&262144)!==0)&&e.nodes!==null&&e.nodes.end!==null&&(da(e.nodes.start,e.nodes.end),r=!0),e.f|=33554432,In(e,t&&!r),Hr(e,0);var n=e.nodes&&e.nodes.t;if(n!==null)for(let s of n)s.stop();_o(e),e.f^=33554432,e.f|=16384;var i=e.parent;i!==null&&i.first!==null&&ao(e),_&&(e.component_function=null),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes=e.ac=e.b=null}function da(e,t){for(;e!==null;){var r=e===t?null:We(e);e.remove(),e=r}}function ao(e){var t=e.parent,r=e.prev,n=e.next;r!==null&&(r.next=n),n!==null&&(n.prev=r),t!==null&&(t.first===e&&(t.first=n),t.last===e&&(t.last=r))}function or(e,t,r=!0){var n=[];e.f|=256,fa(e,n,!0);var i=()=>{r&&ge(e),t&&t()},s=n.length;if(s>0){var a=()=>--s||i();for(var l of n)l.out(a)}else i()}function fa(e,t,r){if((e.f&8192)===0){e.f^=8192;var n=e.nodes&&e.nodes.t;if(n!==null)for(let l of n)(l.is_global||r)&&t.push(l);for(var i=e.first;i!==null;){var s=i.next;if((i.f&64)===0){var a=(i.f&65536)!==0||(i.f&32)!==0&&(e.f&16)!==0;fa(i,t,a?r:!1)}i=s}}}function fn(e){e.f&=-257,ua(e,!0)}function ua(e,t){if((e.f&256)===0&&(e.f&8192)!==0){e.f^=8192,(e.f&1024)===0&&(se(e,2048),xt.ensure().schedule(e));for(var r=e.first;r!==null;){var n=r.next,i=(r.f&65536)!==0||(r.f&32)!==0;ua(r,i?t:!1),r=n}var s=e.nodes&&e.nodes.t;if(s!==null)for(let a of s)(a.is_global||t)&&a.in()}}function un(e,t){if(e.nodes)for(var r=e.nodes.start,n=e.nodes.end;r!==null;){var i=r===n?null:We(r);t.append(r),r=i}}var pa=null;var wt=!1;function po(e){wt=e}var O=null,lt=!1;function ke(e){O=e}var S=null;function Le(e){S=e}var jt=null;function hi(e){O!==null&&(!Ie&&(O.f&2097152)!==0||(O.f&2)!==0)&&(jt??=new Set).add(e)}var Ue=null,at=0,Et=null;function Qs(e){Et=e}var va=1,Yr=0,It=Yr;function fo(e){It=e}function an(){return++va}function Cr(e){var t=e.f;if((t&2048)!==0)return!0;if((t&4096)!==0){for(var r=e.deps,n=r.length,i=0;i<n;i++){var s=r[i];if(Cr(s)&&to(s),s.wv>e.wv)return!0}(t&512)!==0&&Be===null&&se(e,1024)}return!1}function ga(e,t,r=!0){var n=e.reactions;if(n!==null&&!(!Ie&&jt!==null&&jt.has(e)))for(var i=0;i<n.length;i++){var s=n[i];(s.f&2)!==0?ga(s,t,!1):t===s&&(r?se(s,2048):(s.f&1024)!==0&&se(s,4096),Ln(s))}}function pi(e){var t=Ue,r=at,n=Et,i=O,s=jt,a=G,l=lt,c=It,p=e.f;Ue=null,at=0,Et=null,O=(p&96)===0?e:null,jt=null,ur(e.ctx),lt=!1,It=++Yr,e.ac!==null&&(At(()=>{e.ac.abort(dr)}),e.ac=null);try{e.f|=2097152;var v=e.fn,h=v();e.f|=32768;var u=ha(e);if(tr()&&Et!==null&&!lt&&u!==null&&(e.f&6146)===0)for(var d=0;d<Et.length;d++)ga(Et[d],e);if(i!==null&&i!==e){if(Yr++,i.deps!==null)for(let g=0;g<r;g+=1)i.deps[g].rv=Yr;if(t!==null)for(let g of t)g.rv=Yr;Et!==null&&(n===null?n=Et:n.push(...Et))}return(e.f&8388608)!==0&&(e.f^=8388608),h}catch(g){return ha(e),ia(g)}finally{e.f^=2097152,Ue=t,at=r,Et=n,O=i,jt=s,ur(a),lt=l,It=c}}function ha(e){var t=e.deps,r=P?.is_fork;if(Ue!==null){var n;if(r||Hr(e,at),t!==null&&at>0)for(t.length=at+Ue.length,n=0;n<Ue.length;n++)t[at+n]=Ue[n];else e.deps=t=Ue;if(xr()&&(e.f&512)!==0)for(n=at;n<t.length;n++)(t[n].reactions??=[]).push(e)}else!r&&t!==null&&at<t.length&&(Hr(e,at),t.length=at);return t}function ac(e,t){let r=t.reactions;if(r!==null){var n=ss.call(r,e);if(n!==-1){var i=r.length-1;i===0?r=t.reactions=null:(r[n]=r[i],r.pop())}}if(r===null&&(t.f&2)!==0&&(Ue===null||!cr.call(Ue,t))){var s=t;(s.f&512)!==0&&(s.f^=512),s.v!==le&&nn(s),s.ac!==null&&At(()=>{s.ac.abort(dr),s.ac=null,se(s,2048)}),Vs(s),Hr(s,0)}}function Hr(e,t){var r=e.deps;if(r!==null)for(var n=t;n<r.length;n++)ac(e,r[n])}function rr(e){var t=e.f;if((t&16384)===0){se(e,1024);var r=S;if(S=e,_){var n=Yt;li(e.component_function);var i=Vt;rn(e.dev_stack??Vt)}try{(t&16777232)!==0?ca(e):In(e),_o(e);var s=pi(e);if(e.teardown=typeof s=="function"?s:null,e.wv=va,_&&Ut&&(e.f&2048)!==0&&e.deps!==null)for(var a of e.deps)a.set_during_effect&&(a.wv=an(),a.set_during_effect=!1)}finally{S=r,_&&(li(n),rn(i))}}}async function gr(){if(Ie)return new Promise(e=>{requestAnimationFrame(()=>e()),setTimeout(()=>e())});await Promise.resolve(),Tr()}function o(e){var t=e.f,r=(t&2)!==0;if(pa?.add(e),O!==null&&!lt){var n=S!==null&&(S.f&16384)!==0;if(!n&&(jt===null||!jt.has(e))){var i=O.deps;if((O.f&2097152)!==0)e.rv<Yr&&(e.rv=Yr,Ue===null&&i!==null&&i[at]===e?at++:Ue===null?Ue=[e]:Ue.push(e));else{O.deps??=[],cr.call(O.deps,e)||O.deps.push(e);var s=e.reactions;s===null?e.reactions=[O]:cr.call(s,O)||s.push(O)}}}if(_){if(!lt&&mt&&P===null&&Wt===null&&!mt.warned&&(mt.effect.f&2097152)===0&&!mt.effect_deps.has(e)){mt.warned=!0,cs(e.label);var a=Bt("traced at");a&&console.warn(a)}if(Nn.delete(e),Ut&&!lt&&Cn!==null&&O!==null&&Cn.reaction===O){if(e.trace)e.trace();else if(a=Bt("traced at"),a){var l=Cn.entries.get(e);l===void 0&&(l={traces:[]},Cn.entries.set(e,l));var c=l.traces[l.traces.length-1];a.stack!==c?.stack&&l.traces.push(a)}}}if(wt&&Ot.has(e))return Ot.get(e);if(r){var p=e;if(wt){var v=p.v;return((p.f&1024)===0&&p.reactions!==null||_a(p))&&(v=On(p)),Ot.set(p,v),v}var h=(p.f&512)===0&&!lt&&O!==null&&(O.f&512)!==0,u=(p.f&32768)===0;Cr(p)&&(h&&(p.f|=512),to(p)),h&&!u&&(ro(p),ma(p))}if(Be?.has(e))return Be.get(e);if((e.f&8388608)!==0)throw e.v;return e.v}function ma(e){if(e.f|=512,e.deps!==null)for(let r of e.deps){var t=r.reactions;t===null?r.reactions=[e]:cr.call(t,e)||t.push(e),(r.f&2)!==0&&(r.f&512)===0&&(ro(r),ma(r))}}function _a(e){if(e.v===le)return!0;if(e.deps===null)return!1;for(let t of e.deps)if(Ot.has(t)||(t.f&2)!==0&&_a(t))return!0;return!1}function D(e){var t=lt;try{return lt=!0,e()}finally{lt=t}}var cc=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var Eg=[...cc,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var dc=["touchstart","touchmove"];function $a(e){return dc.includes(e)}var fc=["$state","$state.raw","$derived","$derived.by"],kg=[...fc,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];var Hn=Symbol("events"),bo=new Set,wi=new Set;function wa(e,t,r,n={}){function i(s){if(n.capture||xi.call(t,s),!s.cancelBubble)return At(()=>r?.call(this,s))}return e.startsWith("pointer")||e.startsWith("touch")||e==="wheel"?(i.__removed=!1,Ee(()=>{i.__removed||t.addEventListener(e,i,n)})):t.addEventListener(e,i,n),i}function pn(e,t,r,n,i){var s={capture:n,passive:i},a=wa(e,t,r,s);(t===document.body||t===window||t===document||t instanceof HTMLMediaElement)&&Je(()=>{a.__removed=!0,t.removeEventListener(e,a,s)})}function Ve(e,t,r){(t[Hn]??={})[e]=r}function Xt(e){for(var t=0;t<e.length;t++)bo.add(e[t]);for(var r of wi)r(e)}var $o=null,yo=!1;function xi(e){var t=this,r=t.ownerDocument,n=e.type,i=e.composedPath?.()||[],s=i[0]||e.target;$o=e,yo||(yo=!0,setTimeout(()=>{yo=!1,$o=null}));var a=0,l=$o===e&&e[Hn];if(l){var c=i.indexOf(l);if(c!==-1&&(t===document||t===window)){e[Hn]=t;return}var p=i.indexOf(t);if(p===-1)return;c<=p&&(a=c)}if(s=i[a]||e.target,s!==t){Oe(e,"currentTarget",{configurable:!0,get(){return s||r}});var v=O,h=S;ke(null),Le(null);try{for(var u,d=[];s!==null&&s!==t;){try{var g=s[Hn]?.[n];g!=null&&(!s.disabled||e.target===s)&&g.call(s,e)}catch($){u?d.push($):u=$}if(e.cancelBubble)break;a++,s=a<i.length?i[a]:null}if(u){for(let $ of d)queueMicrotask(()=>{throw $});throw u}}finally{e[Hn]=t,delete e.currentTarget,ke(v),Le(h)}}}var pc=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:e=>e});function xa(e){return pc?.createHTML(e)??e}function wo(e){var t=nr("template");return t.innerHTML=xa(e.replaceAll("<!>","<!---->")),t.content}function Kt(e,t){var r=S;r.nodes===null&&(r.nodes={start:e,end:t,a:null,t:null})}function U(e,t){var r=(t&1)!==0,n=(t&2)!==0,i,s=!e.startsWith("<!>");return()=>{if(A)return Kt(L,null),L;i===void 0&&(i=wo(s?e:"<!>"+e),r||(i=Ze(i)));var a=n||Pn?document.importNode(i,!0):i.cloneNode(!0);if(r){var l=Ze(a),c=a.lastChild;Kt(l,c)}else Kt(a,a);return a}}function Qe(){if(A)return Kt(L,null),L;var e=document.createDocumentFragment(),t=document.createComment(""),r=De();return e.append(t,r),Kt(t,r),e}function B(e,t){if(A){var r=S;((r.f&32768)===0||r.nodes.end===null)&&(r.nodes.end=L),Ge();return}e!==null&&e.before(t)}function Ei(e){let t=0,r=Pe(0),n;return _&&oe(r,"createSubscriber version"),()=>{xr()&&(o(r),nt(()=>(t===0&&(n=D(()=>e(()=>Te(r)))),t+=1,()=>{Ee(()=>{t-=1,t===0&&(n?.(),n=void 0,Te(r))})})))}}var _c=589824;function ko(e,t,r,n){new Eo(e,t,r,n)}var Eo=class{parent;is_pending=!1;transform_error;#e;#t=A?L:null;#r;#n;#i;#o=null;#a=null;#s=null;#l=null;#d=0;#c=0;#v=!1;#_=new Map;#f=null;#g=Ei(()=>(this.#f=Pe(this.#d),_&&oe(this.#f,"$effect.pending()"),()=>{this.#f=null}));constructor(t,r,n,i){this.#e=t,this.#r=r,this.#n=s=>{var a=S;a.b=this,a.f|=128,n(s)},this.parent=S.b,this.transform_error=i??this.parent?.transform_error??(s=>s),this.#i=dt(()=>{if(A){let s=wr(this.#t);Ge();let a=s==="[!";if(s.startsWith("[?")){let c=JSON.parse(s.slice("[?".length));this.#b(c)}else a?this.#h():this.#$()}else this.#y()},_c),A&&(this.#e=L)}#$(){try{this.#o=Re(()=>this.#n(this.#e))}catch(t){this.error(t)}}#b(t){let r=this.#r.failed,{reset:n,invoke_onerror:i}=this.#m(t);Ee(i),r&&(this.#s=Re(()=>{r(this.#e,()=>t,()=>n)}))}#m(t){var r=!1,n=!1;let i=()=>{if(!this.#u()){if(r){hs();return}r=!0,n&&Is(),this.#s!==null&&or(this.#s,()=>{this.#s=null}),this.#w(()=>{this.#y()})}};return{reset:i,invoke_onerror:()=>{if(!this.#u())try{n=!0,this.#r.onerror?.(t,i),n=!1}catch(a){gt(a,this.#i&&this.#i.parent)}}}}#u(){return(this.#i.f&33570816)!==0}#h(){let t=this.#r.pending;t&&(this.is_pending=!0,this.#a=Re(()=>t(this.#e)),Ee(()=>{if(!this.#u()){var r=this.#l=document.createDocumentFragment(),n=De(),i=!1;if(r.append(n),this.#o=this.#w(()=>{try{return Re(()=>this.#n(n))}catch(s){try{this.error(s),i=!0}catch(a){gt(a,this.#i.parent)}return null}}),this.#o===null){this.#l=null,i&&this.#p(P);return}this.#c===0&&(this.#e.before(r),this.#l=null,or(this.#a,()=>{this.#a=null}),this.#p(P))}}))}#y(){try{if(this.is_pending=this.has_pending_snippet(),this.#c=0,this.#d=0,this.#o=Re(()=>{this.#n(this.#e)}),this.#c>0){var t=this.#l=document.createDocumentFragment();un(this.#o,t);let r=this.#r.pending;this.#a=Re(()=>r(this.#e))}else this.#p(P)}catch(r){this.error(r)}}#p(t){this.is_pending=!1,t.transfer_reactions(this.#_)}defer_effect(t){ci(t,this.#_)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#r.pending}#w(t){var r=S,n=O,i=G;Le(this.#i),ke(this.#i),ur(this.#i.ctx);try{return xt.ensure(),t()}finally{Le(r),ke(n),ur(i)}}#x(t,r){if(!this.has_pending_snippet()){this.parent&&this.parent.#x(t,r);return}this.#c+=t,this.#c===0&&(this.#p(r),this.#a&&or(this.#a,()=>{this.#a=null}),this.#l&&(this.#e.before(this.#l),this.#l=null))}update_pending_count(t,r){this.#x(t,r),this.#d+=t,!(!this.#f||this.#v)&&(this.#v=!0,Ee(()=>{this.#v=!1,this.#f&&Gt(this.#f,this.#d)}))}get_effect_pending(){return this.#g(),o(this.#f)}error(t){if(t===yt||!this.#r.onerror&&!this.#r.failed)throw t;P?.is_fork?(this.#o&&P.skip_effect(this.#o),this.#a&&P.skip_effect(this.#a),this.#s&&P.skip_effect(this.#s),P.oncommit(()=>{this.#u()||this.#E(t)})):this.#E(t)}#E(t){this.#o&&(ge(this.#o),this.#o=null),this.#a&&(ge(this.#a),this.#a=null),this.#s&&(ge(this.#s),this.#s=null),A&&(ie(this.#t),Gi(),ie(zt()));let r=this.#r.failed,n=i=>{if(this.#u())return;let{reset:s,invoke_onerror:a}=this.#m(i);a(),r&&!this.#u()&&(this.#s=this.#w(()=>{try{return Re(()=>{var l=S;l.b=this,l.f|=128,r(this.#e,()=>i,()=>s)})}catch(l){return gt(l,this.#i.parent),null}}))};Ee(()=>{if(!this.#u()){var i;try{i=this.transform_error(t)}catch(s){gt(s,this.#i&&this.#i.parent);return}i!==null&&typeof i=="object"&&typeof i.then=="function"?i.then(n,s=>gt(s,this.#i&&this.#i.parent)):n(i)}})}};var To=!0;function Ti(e,t){var r=t==null?"":typeof t=="object"?`${t}`:t;r!==(e[kn]??=e.nodeValue)&&(e[kn]=r,e.nodeValue=`${r}`)}function hn(e,t){return ka(e,t)}function Do(e,t){$i(),t.intro=t.intro??!1;let r=t.target,n=A,i=L;try{for(var s=Ze(r);s&&(s.nodeType!==Dt||s.data!=="[");)s=We(s);if(!s)throw yt;ye(!0),ie(s);let a=ka(e,{...t,anchor:s});return ye(!1),a}catch(a){if(a instanceof Error&&a.message.split(`
`).some(l=>l.startsWith("https://svelte.dev/e/")))throw a;return a!==yt&&console.warn("Failed to hydrate: ",a),t.recover===!1&&Ts(),$i(),An(r),ye(!1),hn(e,t)}finally{ye(n),ie(i)}}var ki=new Map;function ka(e,{target:t,anchor:r,props:n={},events:i,context:s,intro:a=!0,transformError:l}){$i();var c=void 0,p=la(()=>{var v=r??t.appendChild(De());ko(v,{pending:()=>{}},d=>{Xe({});var g=G;if(s&&(g.c=s),i&&(n.$$events=i),A&&Kt(d,null),To=a,c=e(d,n)||Sn(),To=!0,A&&(S.nodes.end=L,L===null||L.nodeType!==Dt||L.data!=="]"))throw Or(),yt;Ke()},l);var h=new Set,u=d=>{for(var g=0;g<d.length;g++){var $=d[g];if(!h.has($)){h.add($);var m=$a($);for(let k of[t,document]){var y=ki.get(k);y===void 0&&(y=new Map,ki.set(k,y));var w=y.get($);w===void 0?(k.addEventListener($,xi,{passive:m}),y.set($,1)):y.set($,w+1)}}}};return u(Xr(bo)),wi.add(u),()=>{for(var d of h)for(let m of[t,document]){var g=ki.get(m),$=g.get(d);--$==0?(m.removeEventListener(d,xi),g.delete(d),g.size===0&&ki.delete(m)):g.set(d,$)}wi.delete(u),v!==r&&v.parentNode?.removeChild(v)}});return Co.set(c,p),c}var Co=new WeakMap;function zn(e,t){let r=Co.get(e);return r?(Co.delete(e),r(t)):(_&&ps(),Promise.resolve())}var Zt=class{anchor;#e=new Map;#t=new Map;#r=new Map;#n=new Set;#i=!0;constructor(t,r=!0){this.anchor=t,this.#i=r}#o=t=>{if(this.#e.has(t)){var r=this.#e.get(t),n=this.#t.get(r);if(n)fn(n),this.#n.delete(r);else{var i=this.#r.get(r);i&&(fn(i.effect),this.#t.set(r,i.effect),this.#r.delete(r),_&&(i.fragment.lastChild[Yi]=this.anchor),i.fragment.lastChild.remove(),this.anchor.before(i.fragment),n=i.effect)}for(let[s,a]of this.#e){if(this.#e.delete(s),s===t)break;let l=this.#r.get(a);l&&(ge(l.effect),this.#r.delete(a))}for(let[s,a]of this.#t){if(s===r||this.#n.has(s))continue;let l=()=>{if(Array.from(this.#e.values()).includes(s)){var p=document.createDocumentFragment();un(a,p),p.append(De()),this.#r.set(s,{effect:a,fragment:p})}else ge(a);this.#n.delete(s),this.#t.delete(s)};this.#i||!n?(this.#n.add(s),or(a,l,!1)):l()}}};#a=t=>{this.#e.delete(t);let r=Array.from(this.#e.values());for(let[n,i]of this.#r)r.includes(n)||(ge(i.effect),this.#r.delete(n))};ensure(t,r){var n=P,i=yi();if(r&&!this.#t.has(t)&&!this.#r.has(t))if(i){var s=document.createDocumentFragment(),a=De();s.append(a),this.#r.set(t,{effect:Re(()=>r(a)),fragment:s})}else this.#t.set(t,Re(()=>r(this.anchor)));if(this.#e.set(n,t),i){for(let[l,c]of this.#t)l===t?n.unskip_effect(c):n.skip_effect(c);for(let[l,c]of this.#r)l===t?n.unskip_effect(c.effect):n.skip_effect(c.effect);n.oncommit(this.#o),n.ondiscard(this.#a)}else A&&(this.anchor=L),this.#o(n)}};function Tt(e,t,r=!1){var n;A&&(n=L,Ge());var i=new Zt(e),s=r?65536:0;function a(l,c){if(A){var p=wr(n);if(l!==parseInt(p.substring(1))){var v=zt();ie(v),i.anchor=v,ye(!1),i.ensure(l,c),ye(!0);return}}i.ensure(l,c)}dt(()=>{var l=!1;t((c,p=0)=>{l=!0,a(p,c)}),l||a(-1,null)},s)}function Lt(e,t){return t}function kc(e,t,r){for(var n=[],i=t.length,s,a=t.length,l=0;l<i;l++){let h=t[l];or(h,()=>{if(s){if(s.pending.delete(h),s.done.add(h),s.pending.size===0){var u=e.outrogroups;So(e,Xr(s.done)),u.delete(s),u.size===0&&(e.outrogroups=null)}}else a-=1},!1)}if(a===0){var c=n.length===0&&r!==null&&e.pending.size===0;if(c){var p=r,v=p.parentNode;An(v),v.append(p),e.items.clear()}So(e,t,!c)}else s={pending:new Set(t),done:new Set},(e.outrogroups??=new Set).add(s)}function So(e,t,r=!0){var n;if(e.pending.size>0){n=new Set;for(let a of e.pending.values())for(let l of a)n.add(e.items.get(l).e)}for(var i=0;i<t.length;i++){var s=t[i];if(n?.has(s)){s.f|=33554432;let a=document.createDocumentFragment();un(s,a)}else ge(t[i],r)}}var Ta;function ft(e,t,r,n,i,s=null){var a=e,l=new Map,c=(t&4)!==0;if(c){var p=e;a=A?ie(Ze(p)):p.appendChild(De())}A&&Ge();var v=null,h=Pr(()=>{var w=r();return lr(w)?w:w==null?[]:Xr(w)});_&&oe(h,"{#each ...}");var u=new Map,d=!0;function g(w){if((y.effect.f&16384)===0){y.pending.delete(w);var k=o(h);y.fallback=v,Tc(y,k,a,t,n),v!==null&&(k.length===0?(v.f&33554432)===0?fn(v):(v.f^=33554432,Bn(v,null,a)):or(v,()=>{v=null}))}}function $(w){y.pending.delete(w)}var m=dt(()=>{var w=o(h),k=w.length;let x=!1;if(A){var C=wr(a)==="[!";C!==(k===0)&&(a=zt(),ie(a),ye(!1),x=!0)}for(var E=new Set,R=P,V=yi(),I=0;I<k;I+=1){A&&L.nodeType===Dt&&L.data==="]"&&(a=L,x=!0,ye(!1));var j=w[I],ee=n(j,I);if(_){var K=n(j,I);ee!==K&&ys(String(I),String(ee),String(K))}var T=d?null:l.get(ee);T?(T.v&&Gt(T.v,j),T.i&&Gt(T.i,I),V&&R.unskip_effect(T.e)):(T=Cc(l,d?a:Ta??=De(),j,ee,I,i,t,r),d||(T.e.f|=33554432),l.set(ee,T)),E.add(ee)}if(k===0&&s&&!v&&(d?v=Re(()=>s(a)):(v=Re(()=>s(Ta??=De())),v.f|=33554432)),k>E.size&&(_?Dc(w,n):ji("","","")),A&&k>0&&ie(zt()),!d)if(u.set(R,E),V){for(let[Y,X]of l)E.has(Y)||R.skip_effect(X.e);R.oncommit(g),R.ondiscard($)}else g(R);x&&ye(!0),o(h)}),y={effect:m,flags:t,items:l,pending:u,outrogroups:null,fallback:v};d=!1,A&&(a=L)}function Un(e){for(;e!==null&&(e.f&32)===0;)e=e.next;return e}function Tc(e,t,r,n,i){var s=(n&8)!==0,a=t.length,l=e.items,c=Un(e.effect.first),p,v=null,h,u=[],d=[],g,$,m,y;if(s)for(y=0;y<a;y+=1)g=t[y],$=i(g,y),m=l.get($).e,(m.f&33554432)===0&&(m.nodes?.a?.measure(),(h??=new Set).add(m));for(y=0;y<a;y+=1){if(g=t[y],$=i(g,y),m=l.get($).e,e.outrogroups!==null)for(let j of e.outrogroups)j.pending.delete(m),j.done.delete(m);if((m.f&8192)!==0&&(fn(m),s&&(m.nodes?.a?.unfix(),(h??=new Set).delete(m))),(m.f&33554432)!==0)if(m.f^=33554432,m===c)Bn(m,null,r);else{var w=v?v.next:c;m===e.effect.last&&(e.effect.last=m.prev),m.prev&&(m.prev.next=m.next),m.next&&(m.next.prev=m.prev),Dr(e,v,m),Dr(e,m,w),Bn(m,w,r),v=m,u=[],d=[],c=Un(v.next);continue}if(m!==c){if(p!==void 0&&p.has(m)){if(u.length<d.length){var k=d[0],x;v=k.prev;var C=u[0],E=u[u.length-1];for(x=0;x<u.length;x+=1)Bn(u[x],k,r);for(x=0;x<d.length;x+=1)p.delete(d[x]);Dr(e,C.prev,E.next),Dr(e,v,C),Dr(e,E,k),c=k,v=E,y-=1,u=[],d=[]}else p.delete(m),Bn(m,c,r),Dr(e,m.prev,m.next),Dr(e,m,v===null?e.effect.first:v.next),Dr(e,v,m),v=m;continue}for(u=[],d=[];c!==null&&c!==m;)(p??=new Set).add(c),d.push(c),c=Un(c.next);if(c===null)continue}(m.f&33554432)===0&&u.push(m),v=m,c=Un(m.next)}if(e.outrogroups!==null){for(let j of e.outrogroups)j.pending.size===0&&(So(e,Xr(j.done)),e.outrogroups?.delete(j));e.outrogroups.size===0&&(e.outrogroups=null)}if(c!==null||p!==void 0){var R=[];if(p!==void 0)for(m of p)(m.f&8192)===0&&R.push(m);for(;c!==null;)(c.f&8192)===0&&c!==e.fallback&&R.push(c),c=Un(c.next);var V=R.length;if(V>0){var I=(n&4)!==0&&a===0?r:null;if(s){for(y=0;y<V;y+=1)R[y].nodes?.a?.measure();for(y=0;y<V;y+=1)R[y].nodes?.a?.fix()}kc(e,R,I)}}s&&Ee(()=>{if(h!==void 0)for(m of h)m.nodes?.a?.apply()})}function Cc(e,t,r,n,i,s,a,l){var c=(a&1)!==0?(a&16)===0?Br(r,!1,!1):Pe(r):null,p=(a&2)!==0?Pe(i):null;return _&&c&&(c.trace=()=>{l()[p?.v??i]}),{v:c,i:p,e:Re(()=>(s(t,c??r,p??i,l),()=>{e.delete(n)}))}}function Bn(e,t,r){if(e.nodes)for(var n=e.nodes.start,i=e.nodes.end,s=t&&(t.f&33554432)===0?t.nodes.start:r;n!==null;){var a=We(n);if(s.before(n),n===i)return;n=a}}function Dr(e,t,r){t===null?e.effect.first=r:t.next=r,r===null?e.effect.last=t:r.prev=t}function Dc(e,t){let r=new Map,n=e.length;for(let i=0;i<n;i++){let s=t(e[i],i);if(r.has(s)){let a=String(r.get(s)),l=String(i),c=String(s);c.startsWith("[object ")&&(c=null),ji(a,l,c)}r.set(s,i)}}function ut(e,t,...r){var n=new Zt(e);dt(()=>{let i=t()??null;_&&i==null&&Cs(),n.ensure(i,i&&(s=>i(s,...r)))},65536)}function Vn(e,t,r){var n;A&&(n=L,Ge());var i=new Zt(e);dt(()=>{var s=t()??null;if(A){var a=wr(n),l=a==="[",c=s!==null;if(l!==c){var p=zt();ie(p),i.anchor=p,ye(!1),i.ensure(s,s&&(v=>r(v,s))),ye(!0);return}}i.ensure(s,s&&(v=>r(v,s)))},65536)}function Fe(e,t){var r=void 0,n;mo(()=>{r!==(r=t())&&(n&&(ge(n),n=null),r&&(n=Re(()=>{kt(()=>r(e))})))})}function Sa(e){var t,r,n="";if(typeof e=="string"||typeof e=="number")n+=e;else if(typeof e=="object")if(Array.isArray(e)){var i=e.length;for(t=0;t<i;t++)e[t]&&(r=Sa(e[t]))&&(n&&(n+=" "),n+=r)}else for(r in e)e[r]&&(n&&(n+=" "),n+=r);return n}function Ra(){for(var e,t,r=0,n="",i=arguments.length;r<i;r++)(e=arguments[r])&&(t=Sa(e))&&(n&&(n+=" "),n+=t);return n}function Jt(e){return typeof e=="object"?Ra(e):e??""}var Aa=[...` 	
\r\f\xA0\v\uFEFF`];function Oa(e,t,r){var n=e==null?"":""+e;if(t&&(n=n?n+" "+t:t),r){for(var i of Object.keys(r))if(r[i])n=n?n+" "+i:i;else if(n.length)for(var s=i.length,a=0;(a=n.indexOf(i,a))>=0;){var l=a+s;(a===0||Aa.includes(n[a-1]))&&(l===n.length||Aa.includes(n[l]))?n=(a===0?"":n.substring(0,a))+n.substring(l+1):a=l}}return n===""?null:n}function Na(e,t=!1){var r=t?" !important;":";",n="";for(var i of Object.keys(e)){var s=e[i];s!=null&&s!==""&&(n+=" "+i+": "+s+r)}return n}function Ro(e){return e[0]!=="-"||e[1]!=="-"?e.toLowerCase():e}function Ia(e,t){if(t){var r="",n,i;if(Array.isArray(t)?(n=t[0],i=t[1]):n=t,e){e=String(e).replaceAll(/\/\*.*?\*\//g,"").trim();var s=!1,a=0,l=!1,c=[];n&&c.push(...Object.keys(n).map(Ro)),i&&c.push(...Object.keys(i).map(Ro));var p=0,v=-1;let $=e.length;for(var h=0;h<$;h++){var u=e[h];if(l?u==="/"&&e[h-1]==="*"&&(l=!1):s?s===u&&(s=!1):u==="/"&&e[h+1]==="*"?l=!0:u==='"'||u==="'"?s=u:u==="("?a++:u===")"&&a--,!l&&s===!1&&a===0){if(u===":"&&v===-1)v=h;else if(u===";"||h===$-1){if(v!==-1){var d=Ro(e.substring(p,v).trim());if(!c.includes(d)){u!==";"&&h++;var g=e.substring(p,h).trim();r+=" "+g+";"}}p=h+1,v=-1}}}}return n&&(r+=Na(n)),i&&(r+=Na(i,!0)),r=r.trim(),r===""?null:r}return e==null?null:String(e)}function Z(e,t,r,n,i,s){var a=e[xn];if(A||a!==r||a===void 0){var l=Oa(r,n,s);(!A||l!==e.getAttribute("class"))&&(l==null?e.removeAttribute("class"):t?e.className=l:e.setAttribute("class",l)),e[xn]=r}else if(s&&i!==s)for(var c in s){var p=!!s[c];(i==null||p!==!!i[c])&&e.classList.toggle(c,p)}return s}function Ao(e,t={},r,n){for(var i in r){var s=r[i];t[i]!==s&&(r[i]==null?e.style.removeProperty(i):e.style.setProperty(i,s,n))}}function Sr(e,t,r,n){var i=e[En];if(A||i!==t){var s=Ia(t,n);(!A||s!==e.getAttribute("style"))&&(s==null?e.removeAttribute("style"):e.style.cssText=s),e[En]=t}else n&&(Array.isArray(n)?(Ao(e,r?.[0],n[0]),Ao(e,r?.[1],n[1],"important")):Ao(e,r,n));return n}var Hc=Symbol("is custom element"),zc=Symbol("is html"),Uc=qi?"link":"LINK";function et(e,t,r,n){var i=Bc(e);if(A&&(i[t]=e.getAttribute(t),t==="src"||t==="srcset"||t==="href"&&e.nodeName===Uc)){n||Yc(e,t,r??"");return}var s=i[t];s!==(i[t]=r)&&(t==="loading"&&(e[ls]=r),r==null?e.removeAttribute(t):typeof r!="string"&&Vc(e).has(t)?e[t]=r:A&&(typeof r=="number"||typeof r=="boolean")&&s===String(r)||e.setAttribute(t,r))}function Bc(e){return e[ti]??={[Hc]:e.nodeName.includes("-"),[zc]:e.namespaceURI===ri}}var Ma=new Map;function Vc(e){var t=e.getAttribute("is")||e.nodeName,r=Ma.get(t);if(r)return r;Ma.set(t,r=new Set);for(var n,i=e,s=Element.prototype;s!==i;){n=Ui(i);for(var a in n)n[a].set&&a!=="innerHTML"&&a!=="textContent"&&a!=="innerText"&&r.add(a);i=Kr(i)}return r}function Yc(e,t,r){_&&(t==="srcset"&&qc(e,r)||No(e.getAttribute(t)??"",r)||us(t,e.outerHTML.replace(e.innerHTML,e.innerHTML&&"..."),String(r)))}function No(e,t){return e===t?!0:new URL(e,document.baseURI).href===new URL(t,document.baseURI).href}function La(e){return e.split(",").map(t=>t.trim().split(" ").filter(Boolean))}function qc(e,t){var r=La(e.srcset),n=La(t);return n.length===r.length&&n.every(([i,s],a)=>s===r[a][1]&&(No(r[a][0],i)||No(i,r[a][0])))}function Oo(e,t){return e===t||e?.[st]===t}function mr(e=Sn(),t,r,n){var i=G.r,s=S;return kt(()=>{var a,l;return nt(()=>{a=l,l=n?.()||[],D(()=>{Oo(r(...l),e)||(t(e,...l),a&&Oo(r(...a),e)&&t(null,...a))})}),()=>{let c=s;for(;c!==i&&c.parent!==null&&c.parent.f&33554432;)c=c.parent;let p=()=>{l&&Oo(r(...l),e)&&t(null,...l)},v=c.teardown;c.teardown=()=>{p(),v?.()}}}),e}var Di=!1;function Io(e){var t=Di;try{return Di=!1,[e(),Di]}finally{Di=t}}var Jc={get(e,t){if(!e.exclude.has(t))return e.props[t]},set(e,t){return _&&Ss(`${e.name}.${String(t)}`),!1},getOwnPropertyDescriptor(e,t){if(!e.exclude.has(t)&&t in e.props)return{enumerable:!0,configurable:!0,value:e.props[t]}},has(e,t){return e.exclude.has(t)?!1:t in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(t=>!e.exclude.has(t))}};function Mo(e,t,r){return new Proxy(_?{props:e,exclude:t,name:r}:{props:e,exclude:t},Jc)}function Ae(e,t,r,n){var i=!fr||(r&2)!==0,s=(r&8)!==0,a=(r&16)!==0,l=n,c=!0,p=void 0,v=()=>a&&i?(p??=kr(n),o(p)):(c&&(c=!1,l=a?D(n):n),l);let h;if(s){var u=st in e||wn in e;h=ht(e,t)?.set??(u&&t in e?x=>e[t]=x:void 0)}var d,g=!1;s?[d,g]=Io(()=>e[t]):d=e[t],d===void 0&&n!==void 0&&(d=v(),h&&(i&&Ds(t),h(d)));var $;if(i?$=()=>{var x=e[t];return x===void 0?v():(c=!0,x)}:$=()=>{var x=e[t];return x!==void 0&&(l=void 0),x===void 0?l:x},i&&(r&4)===0)return $;if(h){var m=e.$$legacy;return(function(x,C){return arguments.length>0?((!i||!C||m||g)&&h(C?$():x),x):$()})}var y=!1,w=((r&1)!==0?kr:Pr)(()=>(y=!1,$()));_&&(w.label=t),s&&o(w);var k=S;return(function(x,C){if(arguments.length>0){let E=C?o(w):i&&s?Ce(x):x;return b(w,E),y=!0,l!==void 0&&(l=E),x}return wt&&y||(k.f&16384)!==0?w.v:o(w)})}function Fa(e){return new Lo(e)}var Lo=class{#e;#t;constructor(t){var r=new Map,n=(s,a)=>{var l=Br(a,!1,!1);return r.set(s,l),l};let i=new Proxy({...t.props||{},$$events:{}},{get(s,a){return o(r.get(a)??n(a,Reflect.get(s,a)))},has(s,a){return a===wn?!0:(o(r.get(a)??n(a,Reflect.get(s,a))),Reflect.has(s,a))},set(s,a,l){return b(r.get(a)??n(a,l),l),Reflect.set(s,a,l)}});this.#t=(t.hydrate?Do:hn)(t.component,{target:t.target,anchor:t.anchor,props:i,context:t.context,intro:t.intro??!1,recover:t.recover,transformError:t.transformError}),!Ie&&(!t?.props?.$$host||t.sync===!1)&&Tr(),this.#e=i.$$events;for(let s of Object.keys(this.#t))s==="$set"||s==="$destroy"||s==="$on"||Oe(this,s,{get(){return this.#t[s]},set(a){this.#t[s]=a},enumerable:!0});this.#t.$set=s=>{Object.assign(i,s)},this.#t.$destroy=()=>{zn(this.#t)}}$set(t){this.#t.$set(t)}$on(t,r){this.#e[t]=this.#e[t]||[];let n=(...i)=>r.call(this,...i);return this.#e[t].push(n),()=>{this.#e[t]=this.#e[t].filter(i=>i!==n)}}$destroy(){this.#t.$destroy()}};var sd;typeof HTMLElement=="function"&&(sd=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(e,t,r){super(),this.$$ctor=e,this.$$s=t,r&&(this.$$shadowRoot=this.attachShadow(r))}addEventListener(e,t,r){if(this.$$l[e]=this.$$l[e]||[],this.$$l[e].push(t),this.$$c){let n=this.$$c.$on(e,t);this.$$l_u.set(t,n)}super.addEventListener(e,t,r)}removeEventListener(e,t,r){if(super.removeEventListener(e,t,r),this.$$c){let n=this.$$l_u.get(t);n&&(n(),this.$$l_u.delete(t))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let e=function(n){return i=>{let s=nr("slot");n!=="default"&&(s.name=n),B(i,s)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let t={},r=ad(this);for(let n of this.$$s)n in r&&(n==="default"&&!this.$$d.children?(this.$$d.children=e(n),t.default=!0):t[n]=e(n));for(let n of this.attributes){let i=this.$$g_p(n.name);i in this.$$d||(this.$$d[i]=Po(i,n.value,this.$$p_d,"toProp"))}for(let n in this.$$p_d)!(n in this.$$d)&&this[n]!==void 0&&(this.$$d[n]=this[n],delete this[n]);this.$$c=Fa({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:t,$$host:this}}),this.$$me=go(()=>{nt(()=>{this.$$r=!0;for(let n of zi(this.$$c)){if(!this.$$p_d[n]?.reflect)continue;this.$$d[n]=this.$$c[n];let i=Po(n,this.$$d[n],this.$$p_d,"toAttribute");i==null?this.removeAttribute(this.$$p_d[n].attribute||n):this.setAttribute(this.$$p_d[n].attribute||n,i)}this.$$r=!1})});for(let n in this.$$l)for(let i of this.$$l[n]){let s=this.$$c.$on(n,i);this.$$l_u.set(i,s)}this.$$l={}}}attributeChangedCallback(e,t,r){this.$$r||(e=this.$$g_p(e),this.$$d[e]=Po(e,r,this.$$p_d,"toProp"),this.$$c?.$set({[e]:this.$$d[e]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(e){return zi(this.$$p_d).find(t=>this.$$p_d[t].attribute===e||!this.$$p_d[t].attribute&&t.toLowerCase()===e)||e}});function Po(e,t,r,n){let i=r[e]?.type;if(t=i==="Boolean"&&typeof t!="boolean"?t!=null:t,!n||!r[e])return t;if(n==="toAttribute")switch(i){case"Object":case"Array":return t==null?null:JSON.stringify(t);case"Boolean":return t?"":null;case"Number":return t??null;default:return t}else switch(i){case"Object":case"Array":return t&&JSON.parse(t);case"Boolean":return t;case"Number":return t!=null?+t:t;default:return t}}function ad(e){let t={};return e.childNodes.forEach(r=>{t[r.slot||"default"]=!0}),t}if(_){let e=function(t){if(!(t in globalThis)){let r;Object.defineProperty(globalThis,t,{configurable:!0,get:()=>{if(r!==void 0)return r;Rs(t)},set:n=>{r=n}})}};e("$state"),e("$effect"),e("$derived"),e("$inspect"),e("$props"),e("$bindable")}function Ha(){return O===null&&ks(),(O.ac??=new AbortController).signal}function Si(e){G===null&&Tn("onMount"),fr&&G.l!==null?dd(G).m.push(e):$t(()=>{let t=D(e);if(typeof t=="function")return t})}function dd(e){var t=e.l;return t.u??={a:[],b:[],m:[]}}typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");var vn=class extends Map{#e=new Map;#t=F(0);#r=F(0);#n=It||-1;constructor(t){if(super(),_&&(t=new Map(t),oe(this.#t,"SvelteMap version"),oe(this.#r,"SvelteMap.size")),t){for(var[r,n]of t)super.set(r,n);this.#r.v=super.size}}#i(t){return It===this.#n?F(t):Pe(t)}has(t){var r=this.#e,n=r.get(t);if(n===void 0)if(super.has(t))n=this.#i(0),_&&oe(n,`SvelteMap get(${tn(t)})`),r.set(t,n);else return o(this.#t),!1;return o(n),!0}forEach(t,r){this.#o(),super.forEach(t,r)}get(t){var r=this.#e,n=r.get(t);if(n===void 0)if(super.has(t))n=this.#i(0),_&&oe(n,`SvelteMap get(${tn(t)})`),r.set(t,n);else{o(this.#t);return}return o(n),super.get(t)}getOrInsert(t,r){return super.has(t)||this.set(t,r),this.get(t)}getOrInsertComputed(t,r){return super.has(t)||this.set(t,r(t)),this.get(t)}set(t,r){var n=this.#e,i=n.get(t),s=super.get(t),a=super.set(t,r),l=this.#t;if(i===void 0)i=this.#i(0),_&&oe(i,`SvelteMap get(${tn(t)})`),n.set(t,i),b(this.#r,super.size),Te(l);else if(s!==r){Te(i);var c=l.reactions===null?null:new Set(l.reactions),p=c===null||!i.reactions?.every(v=>c.has(v));p&&Te(l)}return a}delete(t){var r=this.#e,n=r.get(t),i=super.delete(t);return n!==void 0&&(r.delete(t),b(n,-1)),i&&(b(this.#r,super.size),Te(this.#t)),i}clear(){if(super.size!==0){super.clear();var t=this.#e;b(this.#r,0);for(var r of t.values())b(r,-1);Te(this.#t),t.clear()}}#o(){o(this.#t);var t=this.#e;if(this.#r.v!==t.size){for(var r of super.keys())if(!t.has(r)){var n=this.#i(0);_&&oe(n,`SvelteMap get(${tn(r)})`),t.set(r,n)}}for([,n]of this.#e)o(n)}keys(){return o(this.#t),super.keys()}values(){return this.#o(),super.values()}entries(){return this.#o(),super.entries()}[Symbol.iterator](){return this.entries()}get size(){return o(this.#r),super.size}};var za=Symbol("replace"),Ri=class extends URLSearchParams{#e=_?oe(F(0),"SvelteURLSearchParams version"):F(0);#t=Ua();#r=!1;#n(){if(!this.#t||this.#r)return;this.#r=!0;let t=super.toString();this.#t.search=t&&`?${t}`,this.#r=!1}[za](t){if(!this.#r&&t.toString()!==super.toString()){this.#r=!0;for(let r of[...super.keys()])super.delete(r);for(let[r,n]of t)super.append(r,n);Te(this.#e),this.#r=!1}}append(t,r){super.append(t,r),this.#n(),Te(this.#e)}delete(t,r){var n=super.has(t,r);super.delete(t,r),n&&(this.#n(),Te(this.#e))}get(t){return o(this.#e),super.get(t)}getAll(t){return o(this.#e),super.getAll(t)}has(t,r){return o(this.#e),super.has(t,r)}keys(){return o(this.#e),super.keys()}forEach(t,r){o(this.#e),super.forEach(t,r)}set(t,r){var n=super.getAll(t);super.set(t,r);var i=super.getAll(t);(n.length!==i.length||n.some((s,a)=>s!==i[a]))&&(this.#n(),Te(this.#e))}sort(){super.sort(),this.#n(),Te(this.#e)}toString(){return o(this.#e),super.toString()}values(){return o(this.#e),super.values()}entries(){return o(this.#e),super.entries()}[Symbol.iterator](){return this.entries()}get size(){return o(this.#e),super.size}};var ud=null;function Ua(){return ud}function Ko(e,t=void 0){return function(r){return r.key==="Enter"||r.key===" "&&!r.preventDefault()?e.call(t,r):void 0}}function Ct(e,t){return t?null:r=>{typeof e=="string"?r.innerText=e:e?.domNodes?r.replaceChildren(...e.domNodes):e?.html&&(r.innerHTML=e.html)}}function pd(e){return t=>{let r=n=>{t&&!t.contains(n.target)&&t.dispatchEvent(new CustomEvent(e+"outside",{detail:{jsEvent:n}}))};return document.addEventListener(e,r,!0),()=>{document.removeEventListener(e,r,!0)}}}function hd(e,t=!1){return r=>{let n,i=new ResizeObserver(s=>{for(let a of s){if(t){let{inlineSize:l}=a.contentBoxSize?.[0]??{inlineSize:a.contentRect.width};if(l===n)continue;n=l}e(r,a)}});return i.observe(r),()=>{i.unobserve(r)}}}function me(...e){return Object.assign(...e)}function Wr(e){return Object.keys(e)}function vd(e){return Object.entries(e)}function Uo(e,t){return Object.hasOwn(e,t)}function gd(e){return Math.floor(e)}function md(e){return Math.ceil(e)}function qn(...e){return Math.min(...e)}function Rr(...e){return Math.max(...e)}function _d(){return Symbol("ec")}function qr(e){return e.length}function jr(e){return!qr(e)}function Zo(e=new Date){return-e.getTimezoneOffset()}function $n(e){return Array.isArray(e)}function we(e){return typeof e=="function"}function Qa(e){if(typeof e!="object"||e===null)return!1;let t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}function Jo(e){return e instanceof Date}var Ii=e=>e;function $d(e){return t=>t===void 0?void 0:e(t)}var Ba=new WeakMap,yd=1;function el(e){let t=Ba.get(e);return t||(t=yd++,Ba.set(e,t)),t}function tl(e){return{url:e.url?.replace(/&+$/,"")||"",method:e.method?.toUpperCase()||"GET",extraParams:e.extraParams??{}}}function yn(e,t,r,n){return n?{snippet:n,arg:t?.()}:{content:(we(e)?e(t?.()):e)??(we(r)?r():r)}}var Bo=86400;function Ft(e=new Date,t=void 0){return Jo(e)?kd(e,t):Td(e,t)}function gn(e){if(typeof e=="number")e={seconds:e};else if(typeof e=="string"){let r=0,n=2;for(let i of e.split(":",3))r+=parseInt(i,10)*Math.pow(60,n--);e={seconds:r}}else Jo(e)&&(e={hours:e.getUTCHours(),minutes:e.getUTCMinutes(),seconds:e.getUTCSeconds()});let t=e.weeks||e.week||0;return{years:e.years||e.year||0,months:e.months||e.month||0,days:t*7+(e.days||e.day||0),seconds:(e.hours||e.hour||0)*60*60+(e.minutes||e.minute||0)*60+(e.seconds||e.second||0),inWeeks:!!t}}function W(e){let t=new Date($r(e));return Gn(t,Yo(e)),t}function it(e,t,r=1){e.setUTCFullYear(e.getUTCFullYear()+r*t.years);let n=e.getUTCMonth()+r*t.months;for(e.setUTCMonth(n),n%=12,n<0&&(n+=12);e.getUTCMonth()!==n;)Qo(e);return e.setUTCDate(e.getUTCDate()+r*t.days),e.setUTCSeconds(e.getUTCSeconds()+r*t.seconds),e}function bd(e,t,r=1){return it(e,t,-r)}function Ht(e,t=1){return e.setUTCDate(e.getUTCDate()+t),e}function Qo(e,t=1){return Ht(e,-t)}function pt(e){return e.setUTCHours(0,0,0,0),e}function Ne(e){return new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds())}function _r(e,t=19){return e.toISOString().substring(0,t)}function $r(e){return e.getTime()}function Ye(e,...t){return t.every(r=>$r(e)===$r(r))}function wd(e,t){let r=t-e.getUTCDay();return e.setUTCDate(e.getUTCDate()+(r>=0?r:r+7)),e}function rl(e,t){let r=t-e.getUTCDay();return e.setUTCDate(e.getUTCDate()+(r<=0?r:r-7)),e}function Va(e){return typeof e=="string"&&e.length<=10}function xd(e,t){return e.setUTCHours(t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds(),0),e}function He(e){return e.seconds}function nl(e,t,r){return it(e,t),ll(e,r,Ht),e}function il(e,t,r){return bd(e,t),ll(e,r,Qo),e}function ol(e,t){e=W(e),t===0?e.setUTCDate(e.getUTCDate()+6-e.getUTCDay()):e.setUTCDate(e.getUTCDate()+4-(e.getUTCDay()||7));let r=new Date(Date.UTC(e.getUTCFullYear(),0,1));return Math.ceil(((e-r)/1e3/Bo+1)/7)}function Ed(e,t,r,n){return yn(r,()=>({date:Ne(t),week:e}),()=>"W"+String(e).padStart(2,"0"),n)}function sl(e,t={}){let r=e.match(/(?:Z|([+-])(\d{2}):?(\d{2}))$/);if(r)return me(t,r),r[1]?+(r[1]+"1")*(+r[2]*60+ +r[3]):0}function es(e,t,r){return r==="local"&&(r=Zo(new Date(e.getTime()-t*6e4))),r!==t&&e.setUTCMinutes(e.getUTCMinutes()+r-t),Gn(e,r)}function Vo(e,t){return t==="local"?Zo(Ne(e)):t}var al=Symbol("ec");function Gn(e,t){return e[al]=t,e}function Yo(e){return e[al]}function kd(e,t=void 0){return es(new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds())),Zo(e),t??"local")}function Td(e,t=void 0){let r={},n=sl(e,r);n!==void 0&&(e=e.substring(0,r.index));let i=e.match(/\d+/g),s=new Date(Date.UTC(+i[0],+i[1]-1,+i[2],+i[3]||0,+i[4]||0,+i[5]||0));return t!==void 0&&n!==void 0?es(s,n,t):Gn(s,n??Vo(s,t))}function ll(e,t,r){if(t.length&&t.length<7)for(;t.includes(e.getUTCDay());)r(e)}var ts=_d();function cl(e,t){e[ts]=t}function Cd(e){return!!e?.[ts]}function dl(e){return e[ts]}function fl(e,t,r,n=[]){let i=document.createElement(e);i.className=t,typeof r=="string"?i.innerText=r:r.domNodes?i.replaceChildren(...r.domNodes):r.html&&(i.innerHTML=r.html);for(let s of n)i.setAttribute(...s);return i}function Ni(e){return e.getBoundingClientRect()}function Yn(e){return Ni(e).height}function ul(e,t,r=document,n=[]){n.push(r);for(let i of r.elementsFromPoint(e,t)){if(Cd(i))return i;if(i.shadowRoot&&!n.includes(i.shadowRoot)){let s=ul(e,t,i.shadowRoot,n);if(s)return s}}return null}function qo(e,t=void 0){return function(r){r.stopPropagation(),e&&e.call(t,r)}}function Dd(e,t,r,n){return{type:e,title:t,currentStart:r.start,currentEnd:r.end,activeStart:n.start,activeEnd:n.end,calendar:void 0}}function ar(e){return e=me({},e),e.currentStart=Ne(e.currentStart),e.currentEnd=Ne(e.currentEnd),e.activeStart=Ne(e.activeStart),e.activeEnd=Ne(e.activeEnd),e}var Sd=1;function Mi(e,t=void 0){return e.map(r=>{let n={id:r.id!=null?String(r.id):`{generated-${Sd++}}`,resourceIds:Fo(r,"resourceId").map(String),allDay:r.allDay??(Va(r.start)&&Va(r.end)),start:Ft(r.start,t),end:Ft(r.end,t),title:r.title??"",editable:r.editable,startEditable:r.startEditable,durationEditable:r.durationEditable,display:r.display??"auto",layoutGroup:r.layoutGroup?.toString(),extendedProps:r.extendedProps??{},backgroundColor:r.backgroundColor??r.color,textColor:r.textColor,classNames:Fo(r,"className"),styles:Fo(r,"style")};if(n.allDay){pt(n.start);let i=W(n.end);pt(n.end),(!Ye(n.end,i)||Ye(n.end,n.start))&&Ht(n.end)}return n})}function Fo(e,t){let r=e[t+"s"]??e[t]??[];return $n(r)?r:[r]}function Rd(e){return e.map(t=>({events:t.events,...tl(t)}))}function Ad(e,t,r){return r.formatRange(e.start,t&&e.event.display!=="pointer"&&!e.zeroDuration?e.end:null)}function Nd(e,t,r){let n;switch(e.event.display){case"background":n=[];break;case"pointer":n=e.event.allDay?[]:[Ya(t,e,r)];break;default:n=[...e.event.allDay?[]:[Ya(t,e,r)],fl("h4",r.eventTitle,e.event.title)]}return{domNodes:n}}function Ya(e,t,r){return fl("time",r.eventTime,e,[["datetime",_r(t.start)]])}function Od(e,t,r){let n=t.classNames;return e&&(we(e)&&(e=e({event:Pt(t),view:ar(r)})),n=[...$n(e)?e:[e],...n]),n}function Pt(e){return Id(e,Ne)}function Id(e,t){return e=me({},e),e.start=t(e.start),e.end=t(e.end),e}var qa=0;function Md(e,t){e.length=t.length,++qa;for(let r of e)r?.reposition(qa)}function mn(e,t,r,n=void 0){return(!n||e.resourceIds.includes(n.id))&&e.start<r&&e.end>t}function pl(e){return hl(e)||Ld(e)||vl(e)}function Qt(e){return e==="background"}function hl(e){return e==="preview"}function Ld(e){return e==="ghost"}function vl(e){return e==="pointer"}function Wn(e,t,r){return t=e.start>t?e.start:t,r=e.end<r?e.end:r,{start:t,end:r,event:e,zeroDuration:Ye(t,r)}}function _n(e,t,r=!0){let n=[],i,s,a,l;for(let{gridColumn:c,gridRow:p,resource:v,dayStart:h,dayEnd:u,disabled:d}of t)!d&&mn(e,h,u,v)&&(n.push(h),i=u,s||(s=c,a=p,l=v));if(n.length){let c=Wn(e,n[0],i);return me(c,{gridColumn:s,gridRow:a,resource:l,dates:n}),r&&rs(c),[c]}return[]}function gl(e){let t={},r={};for(let n of e){let{gridColumn:i,gridRow:s}=n;for(let l=1;l<n.dates.length;++l){let c=`${s}_${i+l}`;r[c]?r[c].chunks.push(n):r[c]={sorted:!1,chunks:[n]}}let a=`${s}_${i}`;n.long=r[a],n.prev=t[a],t[a]=n}}function Pd(e,t,r=1,n=1){e.prev&&(r=e.prev.bottom+n);let i=r+t;if(e.long){let s=e.long;s.sorted||(s.chunks.sort((a,l)=>a.top-l.top),s.sorted=!0);for(let a of s.chunks)if(r<a.bottom&&i>a.top){let l=a.bottom-r+n;r+=l,i+=l}}return me(e,{top:r,bottom:i}),r}function rs(e){let{event:t,gridColumn:r,gridRow:n}=e;e.id=`${el(t)}-${r}-${n}`}function Ar(e,t){return()=>{let{options:{locale:r}}=e,n=e.options[t],i;return D(()=>{i=we(n)?{format:n}:new Intl.DateTimeFormat(r,n)}),{format:s=>i.format(Ne(s))}}}function Ga(e,t,r=!1){return()=>{let{options:{locale:n}}=e,i=e.options[t],s;return D(()=>{if(we(i))s=(a,l)=>i(Ne(a),l&&Ne(l));else{let a=new Intl.DateTimeFormat(n,i);s=(l,c)=>{if(!c)return a.format(Ne(l));if(r&&(c=xd(W(l),c)),l=Ne(l),c=Ne(c),l<=c)return a.formatRange(l,c);{let p=a.formatRangeToParts(c,l),v="",h=["startRange","endRange"],u=[!1,!1];for(let d of p){let g=h.indexOf(d.source);g>=0?u[g]||(v+=Fd(h[1-g],p),u[g]=!0):v+=d.value}return v}}}}),{formatRange:s}}}function Fd(e,t){let r="";for(let n of t)n.source==e&&(r+=n.value);return r}function ml(e){return Pi(e,"day")}function _l(e){return Pi(e,"week")}function $l(e){return Pi(e,"month")}function Hd(e){return Pi(e,"year")}function Pi(e,t){return{...e,next:"Next "+t,prev:"Previous "+t}}function Gr(e){return t=>({...t,view:e})}function zd(e){let t,r;return e&&({start:t,end:r}=e,t&&(t=pt(Ft(t))),r&&(r=pt(Ft(r)))),{start:t,end:r}}function bn(e,t){return t.start&&e<t.start||t.end&&e>t.end}function ns(e){let t=[];return yl(e,0,void 0,t),t}function yl(e,t,r,n){let i=[];for(let s of e){let a=Ud(s);i.push(a),n.push(a);let l={level:t,parent:r,children:[]};cl(a,l),s.children&&(l.children=yl(s.children,t+1,a,n))}return i}function Ud(e){return{id:e.id!=null?String(e.id):"",title:e.title??"",eventBackgroundColor:bl(e),eventTextColor:wl(e),expanded:e.expanded,extendedProps:e.extendedProps??{}}}function bl(e){return e?.eventBackgroundColor}function wl(e){return e?.eventTextColor}function Wa(e,t){return jr(e.resourceIds)?void 0:t.find(r=>e.resourceIds.includes(r.id))}function xl(e,t,r,n,i){let s=[];e=W(e);let a=W(e);for(it(e,n.min),it(a,n.max);e<a;)s.push([_r(e),i.format(e)]),it(e,t,r);let l=gd((e-a)/1e3/He(t));return l&&l!==r&&(s.at(-1)[2]=r-l),s}function El(e,t,r,n,i){let s=gn(e),a=gn(t);if(r){let l=gn(qn(He(s),Rr(0,He(a)-Bo))),c=gn(Rr(He(a),He(l)+Bo)),p=we(r?.eventFilter)?r.eventFilter:v=>!Qt(v.display);e:for(let v of n){let h=it(W(v),s),u=it(W(v),a),d=it(W(v),l),g=it(W(v),c);for(let $ of i)if(!$.allDay&&p($)&&$.start<g&&$.end>d){if($.start<h){let m=Rr(($.start-v)/1e3,He(l));m<He(s)&&(s.seconds=m)}if($.end>u){let m=qn(($.end-v)/1e3,He(c));m>He(a)&&(a.seconds=m)}if(He(s)===He(l)&&He(a)===He(c))break e}}}return{min:s,max:a}}function Li(e){let t=0,r=F(Ce(t));return kl(e,()=>o(r),()=>!0,()=>b(r,++t,!0))}function Bd(e){let t=0,r=Ce({});return kl(e,n=>r[n],(n,i)=>n!==i,n=>r[n]=++t)}function kl(e,t,r,n){return new Proxy(e,{get(i,s,a){return Uo(i,s)&&t(s),Reflect.get(i,s,a)},set(i,s,a,l){let c=r(i[s],a),p=Reflect.set(i,s,a,l);return c&&n(s),p}})}function Vd(e){let t={buttonText:{today:"today"},customButtons:{},customScrollbars:!1,date:new Date,dateIncrement:void 0,datesSet:void 0,dayCellContent:void 0,dayHeaderFormat:{weekday:"short",month:"numeric",day:"numeric"},dayHeaderAriaLabelFormat:{dateStyle:"full"},displayEventEnd:!0,duration:{weeks:1},events:[],eventAllUpdated:void 0,eventBackgroundColor:void 0,eventClassNames:void 0,eventClick:void 0,eventColor:void 0,eventContent:void 0,eventDidMount:void 0,eventFilter:void 0,eventGap:1,eventMouseEnter:void 0,eventMouseLeave:void 0,eventOrder:void 0,eventOrderStrict:!1,eventSources:[],eventTextColor:void 0,eventTimeFormat:{hour:"numeric",minute:"2-digit"},filterEventsWithResources:!1,firstDay:0,headerToolbar:{start:"title",center:"",end:"today prev,next"},height:void 0,hiddenDays:[],highlightedDates:[],icons:{},lazyFetching:!0,loading:void 0,locale:void 0,refetchResourcesOnNavigate:!1,resources:[],selectable:!1,theme:{active:"ec-active",bgEvent:"ec-bg-event",bgEvents:"ec-bg-events",body:"ec-body",button:"ec-button",buttonGroup:"ec-button-group",calendar:"ec",colHead:"ec-col-head",customScrollbars:"ec-custom-scrollbars",day:"ec-day",dayHead:"ec-day-head",disabled:"ec-disabled",endClipped:"ec-end-clipped",event:"ec-event",eventBody:"ec-event-body",eventTime:"ec-event-time",eventTitle:"ec-event-title",events:"ec-events",grid:"ec-grid",header:"ec-header",hidden:"ec-hidden",highlight:"ec-highlight",icon:"ec-icon",main:"ec-main",noBeb:"ec-no-beb",noIeb:"ec-no-ieb",startClipped:"ec-start-clipped",today:"ec-today",title:"ec-title",toolbar:"ec-toolbar",view:"",weekdays:["ec-sun","ec-mon","ec-tue","ec-wed","ec-thu","ec-fri","ec-sat"],weekNumber:"ec-week-number"},timeZone:"local",titleFormat:{year:"numeric",month:"short",day:"numeric"},validRange:void 0,view:void 0,viewDidMount:void 0,views:{}};for(let r of e)r.createOptions?.(t);return t}function Yd(e){let t={date:r=>pt(Ft(r)),dateIncrement:$d(gn),duration:gn,events:Mi,eventSources:Rd,hiddenDays:r=>[...new Set(r)],highlightedDates:r=>r.map(n=>pt(Ft(n))),resources:r=>$n(r)?ns(r):Qa(r)?tl(r):r,validRange:zd};for(let r of e)r.createParsers?.(t);return t}var Go=["buttonText","customButtons","icons","theme"];function qd(e,t){let r=Vd(e),n=Yd(e);r=Wo(r,n),t=Wo(t,n);let i=Ho(r,"views")??{},s=Ho(t,"views")??{},a=Bd({});me(a,r),t.view&&(a.view=t.view);let l={},c={},p={},v=new Set([...Wr(i),...Wr(s)]);for(let h of v){let u=s[h]??{},d=ja(r,i[h]??i[u.type]??{}),g=ja(d,t,u),$=Ho(g,"component");delete g.view;for(let m of Wr(g))Uo(a,m)?(l[m]??=[],l[m].push(Go.includes(m)?y=>g[m]=we(y)?y(d[m]):y:y=>g[m]=y)):delete g[m];c[h]=g,p[h]=$}return me(a,c[a.view]),[a,function(u,d,g=!0){Uo(a,u)&&(g||(u in n?d=n[u](d):Qa(d)?d={...d}:$n(d)&&(d=[...d])),l[u]?.forEach($=>$(d)),a[u]=Go.includes(u)&&we(d)?c[a.view][u]:d)},function(u){return me(a,c[u]),p[u]}]}function Wo(e,t){let r={...e};for(let n of Wr(t))n in r&&(r[n]=t[n](r[n]));if(e.views){r.views={};for(let n of Wr(e.views))r.views[n]=Wo(e.views[n],t)}return r}function Ho(e,t){let r=e[t];return delete e[t],r}function ja(...e){let t={};for(let r of e){let n={};for(let i of Go)we(r[i])&&(n[i]=r[i](t[i]));t={...t,...r,...n}}return t}function Gd(e,t){let r=[];for(let n of Wr(e))e[n]!==t[n]&&r.push([n,e[n]]);return r}function Wd(e){return()=>{let{options:{view:t}}=e;D(()=>{let r=e.setViewOptions(t);e.extensions={},e.features=[],e.viewComponent=r(e)})}}function jd(e,t){return()=>{let{activeRange:r,fetchedRange:{events:n},offset:i,viewDates:s,options:{events:a,eventSources:l,lazyFetching:c,timeZone:p}}=e;D(()=>{Tl(l.map(v=>we(v.events)?v.events:v),a,v=>Mi(v,i),v=>e.events=Li(v),p,r,n,s,!0,c,t)})}}function Xd(e,t){return()=>{let{activeRange:r,fetchedRange:{resources:n},viewDates:i,options:{lazyFetching:s,refetchResourcesOnNavigate:a,resources:l,timeZone:c}}=e;D(()=>{Tl($n(l)?[]:[l],l,ns,p=>e.resources=Li(p),c,r,n,i,a,s,t)})}}function Tl(e,t,r,n,i,s,a,l,c,p,v){if(!jr(l)){if(jr(e)){n(t);return}if((c||!a.start)&&(!p||!a.start||a.start>s.start||a.end<s.end||a.timeZone!==i)){let h=[],u=m=>v.stop(),d=m=>{h=h.concat(r(m)),n(h),v.stop()},g=_r(s.start),$=_r(s.end);for(let m of e)if(v.start(),we(m)){let y=m(c?{start:Ne(s.start),end:Ne(s.end),startStr:g,endStr:$,timeZone:i}:{},d,u);y!==void 0&&Promise.resolve(y).then(d,u)}else{let y=we(m.extraParams)?m.extraParams():me({},m.extraParams);c&&(y.start=g,y.end=$,i!=="local"&&(y.timeZone=i)),y=new URLSearchParams(y);let w=m.url,k={},x;["GET","HEAD"].includes(m.method)?w+=(w.includes("?")?"&":"?")+y:(k["content-type"]="application/x-www-form-urlencoded;charset=UTF-8",x=String(y)),fetch(w,{method:m.method,headers:k,body:x,signal:Ha(),credentials:"same-origin"}).then(C=>C.json()).then(d).catch(u)}me(a,{...s,timeZone:i})}}}function Kd(e){let t=0;function r(n){let{options:{loading:i}}=e;we(i)&&i(n)}return{start:()=>++t===1&&r(!0),stop:()=>--t===0&&r(!1)}}function Zd(e){return()=>{let{offset:t}=e,r=setInterval(()=>{let n=Ft(void 0,t),i=pt(W(n));e.now=n,Ye(e.today,i)||(e.today=i)},1e3);return()=>clearInterval(r)}}function Jd(e){return()=>{let{offset:t,options:r}=e;D(()=>{for(let i of e.events)if(!i.allDay)for(let s of["start","end"]){let a=i[s],l=Yo(a);l!==void 0?es(a,l,t):Gn(a,Vo(a,t))}let n=Yo(r.date);if(n!==void 0){let i=Ft(void 0,t).getUTCDay()-Ft(void 0,n).getUTCDay(),s=Ht(W(r.date),i);e.setOption("date",s)}Gn(r.date,Vo(r.date,t))})}}function Qd(e){return()=>{let{activeRange:t,options:{datesSet:r}}=e;D(()=>{we(r)&&r({start:Ne(t.start),end:Ne(t.end),startStr:_r(t.start),endStr:_r(t.end),view:ar(e.view)})})}}function ef(e){let t;return()=>{let{filteredEvents:r,options:{eventAllUpdated:n}}=e;D(()=>{we(n)&&(t||(t=setTimeout(()=>{t=null,n({view:ar(e.view)})})))})}}function tf(e){return()=>{let{options:{view:t,viewDidMount:r}}=e;D(()=>{we(r)&&gr().then(()=>r({view:ar(e.view)}))})}}function rf(e){let t;return()=>{let{options:{date:r,duration:n,firstDay:i}}=e,s,a;return D(()=>{s=W(r),n.years?(s.setUTCMonth(0),s.setUTCDate(1)):n.months?s.setUTCDate(1):n.inWeeks&&rl(s,i),a=it(W(s),n)}),t&&Ye(t.start,s)&&Ye(t.end,a)?t:t={start:s,end:a}}}function nf(e){let t;return()=>{let{currentRange:r,extensions:{activeRange:n}}=e,i,s;D(()=>{i=W(r.start),s=W(r.end)});let a=n?n(i,s):{start:i,end:s};return t&&Ye(t.start,a.start)&&Ye(t.end,a.end)?t:t=a}}function of(e){return()=>{let{events:t,options:{eventFilter:r,eventOrder:n,filterEventsWithResources:i,resources:s,view:a}}=e,l=[...t];return D(()=>{if(we(r)){let c=t.map(Pt),p=ar(e.view);l=l.filter((v,h)=>r({event:Pt(v),index:h,events:c,view:p}))}i&&(l=l.filter(c=>s.some(p=>c.resourceIds.includes(p.id)))),we(n)?l.sort((c,p)=>n(Pt(c),Pt(p))):l.sort((c,p)=>c.start-p.start||p.allDay-c.allDay)}),l}}function sf(e){return()=>{let{options:{timeZone:t}}=e,r;return D(()=>{r=t==="UTC"?0:sl(t)??"local"}),r}}function af(e){return()=>{let{options:t,activeRange:r}=e,{hiddenDays:n}=t,i=[];return D(()=>{let s=pt(W(r.start)),a=pt(W(r.end));for(;s<a;)n.includes(s.getUTCDay())||i.push(W(s)),Ht(s);if(!i.length&&n.length&&n.length<7){for(;n.includes(s.getUTCDay());)Ht(s);gr().then(()=>{e.setOption("date",s)})}}),i}}function lf(e){return()=>{let{currentRange:t,intlTitle:r}=e,n;return D(()=>{n=r.formatRange(t.start,Qo(W(t.end)))}),n}}function cf(e){return()=>{let{activeRange:t,currentRange:r,viewTitle:n,options:{view:i}}=e,s;return D(()=>{s=Dd(i,n,r,t)}),s}}var df=class{#e;get auxComponents(){return o(this.#e)}set auxComponents(e){b(this.#e,e,!0)}#t;get offset(){return o(this.#t)}set offset(e){b(this.#t,e)}#r;get currentRange(){return o(this.#r)}set currentRange(e){b(this.#r,e)}#n;get activeRange(){return o(this.#n)}set activeRange(e){b(this.#n,e)}#i;get fetchedRange(){return o(this.#i)}set fetchedRange(e){b(this.#i,e,!0)}#o;get events(){return o(this.#o)}set events(e){b(this.#o,e)}#a;get filteredEvents(){return o(this.#a)}set filteredEvents(e){b(this.#a,e)}#s;get mainEl(){return o(this.#s)}set mainEl(e){b(this.#s,e,!0)}#l;get now(){return o(this.#l)}set now(e){b(this.#l,e,!0)}#d;get resources(){return o(this.#d)}set resources(e){b(this.#d,e)}#c;get scrollDate(){return o(this.#c)}set scrollDate(e){b(this.#c,e,!0)}#v;get today(){return o(this.#v)}set today(e){b(this.#v,e,!0)}#_;get intlEventTime(){return o(this.#_)}set intlEventTime(e){b(this.#_,e)}#f;get intlDayHeader(){return o(this.#f)}set intlDayHeader(e){b(this.#f,e)}#g;get intlDayHeaderAL(){return o(this.#g)}set intlDayHeaderAL(e){b(this.#g,e)}#$;get intlTitle(){return o(this.#$)}set intlTitle(e){b(this.#$,e)}#b;get viewDates(){return o(this.#b)}set viewDates(e){b(this.#b,e)}#m;get viewTitle(){return o(this.#m)}set viewTitle(e){b(this.#m,e)}#u;get view(){return o(this.#u)}set view(e){b(this.#u,e)}#h;get viewComponent(){return o(this.#h)}set viewComponent(e){b(this.#h,e,!0)}#y;get extensions(){return o(this.#y)}set extensions(e){b(this.#y,e,!0)}#p;get features(){return o(this.#p)}set features(e){b(this.#p,e,!0)}#w;get interaction(){return o(this.#w)}set interaction(e){b(this.#w,e,!0)}#x;get iClasses(){return o(this.#x)}set iClasses(e){b(this.#x,e,!0)}#E;get iClass(){return o(this.#E)}set iClass(e){b(this.#E,e,!0)}options;setOption;setViewOptions;constructor(e,t){[this.options,this.setOption,this.setViewOptions]=qd(e,t),this.#e=F(Ce([])),this.#t=f(sf(this)),this.#r=f(rf(this)),this.#n=f(nf(this)),this.#i=F(Ce({events:{},resources:{}})),this.#o=F(Li(this.options.events)),this.#a=f(of(this)),this.#s=F(),this.#l=F(Ce(Ft(void 0,this.offset))),this.#d=F(Li($n(this.options.resources)?this.options.resources:[])),this.#c=F(),this.#v=F(Ce(pt(W(this.now)))),this.#_=f(Ga(this,"eventTimeFormat",!0)),this.#f=f(Ar(this,"dayHeaderFormat")),this.#g=f(Ar(this,"dayHeaderAriaLabelFormat")),this.#$=f(Ga(this,"titleFormat")),this.#b=f(af(this)),this.#m=f(lf(this)),this.#u=f(cf(this)),this.#h=F(),this.#y=F(Ce({})),this.#p=F(Ce([])),this.snippets={},this.#w=F(Ce({})),this.iEvents=new vn,this.#x=F(Ce(Ii)),this.#E=F();for(let r of e)r.initState?.(this);this.#k()}#k(){let e=Kd(this);ir(Wd(this)),ir(Jd(this)),ir(Zd(this)),$t(jd(this,e)),$t(Xd(this,e)),$t(Qd(this)),$t(ef(this)),$t(tf(this))}},ff=U("<h2></h2>"),Xa=U("<button><i></i></button>"),Ka=U("<button> </button>"),uf=U("<div><!></div>"),pf=U("<button></button>");function Za(e,t){Xe(t,!0);let r=xe("state"),n=f(()=>r.currentRange),i=f(()=>r.snippets),s=f(()=>r.today),a=f(()=>r.viewTitle),l=f(()=>r.viewDates),c=f(()=>r.options.buttonText),p=f(()=>r.options.customButtons),v=f(()=>r.options.date),h=f(()=>r.options.dateIncrement),u=f(()=>r.options.duration),d=f(()=>r.options.hiddenDays),g=f(()=>r.options.theme),$=f(()=>r.options.validRange),m=f(()=>r.options.view),y=F(!1),w=F(!1),k=F(!1),x=!1;ir(()=>{o(l),o($),t.buttons,D(()=>{x||(x=!0,t.buttons.includes("prev")&&(b(y,!1),o($).start&&b(y,C(E),!0)),t.buttons.includes("next")&&(b(w,!1),o($).end&&b(w,C(R),!0)),t.buttons.includes("today")&&(b(k,o(s)>=o(n).start&&o(s)<o(n).end,!0),!o(k)&&(o($).start||o($).end)&&b(k,C(V),!0)),gr().then(()=>x=!1))})});function C(K){let T=o(v);K();let Y=o(l).every(X=>bn(X,o($)));return r.setOption("date",T),Y}function E(){r.setOption("date",il(W(o(v)),o(h)??o(u),o(d)))}function R(){r.setOption("date",nl(W(o(v)),o(h)??o(u),o(d)))}function V(){r.setOption("date",W(o(s)))}function I(K){return"customButton"+K.charAt(0).toUpperCase()+K.slice(1)}var j=Qe(),ee=Se(j);ft(ee,17,()=>t.buttons,Lt,(K,T)=>{var Y=Qe(),X=Se(Y),ae=z=>{var N=ff();Fe(N,()=>Ct(o(a))),fe(()=>Z(N,1,o(g).title)),B(z,N)},he=z=>{var N=Xa(),$e=dn(N);fe(()=>{Z(N,1,`${o(g).button??""} ec-${o(T)??""}`),et(N,"aria-label",o(c).prev),et(N,"title",o(c).prev),N.disabled=o(y),Z($e,1,`${o(g).icon??""} ec-${o(T)??""}`)}),Ve("click",N,E),B(z,N)},ne=z=>{var N=Xa(),$e=dn(N);fe(()=>{Z(N,1,`${o(g).button??""} ec-${o(T)??""}`),et(N,"aria-label",o(c).next),et(N,"title",o(c).next),N.disabled=o(w),Z($e,1,`${o(g).icon??""} ec-${o(T)??""}`)}),Ve("click",N,R),B(z,N)},M=z=>{var N=Ka(),$e=dn(N,!0);fe(()=>{Z(N,1,`${o(g).button??""} ec-${o(T)??""}`),N.disabled=o(k),Ti($e,o(c)[o(T)])}),Ve("click",N,V),B(z,N)},J=z=>{let N=f(()=>yn(o(p)[o(T)]?.content,void 0,void 0,o(i)[I(o(T))]));var $e=uf(),q=pe($e);ut(q,()=>o(N).snippet??ue),re($e),Fe($e,()=>Ct(o(N).content,o(N).snippet)),fe(()=>Z($e,1,`ec-${o(T)??""}`)),B(z,$e)},ot=f(()=>o(i)[I(o(T))]||o(p)[o(T)]?.content!=null),H=z=>{var N=pf();Fe(N,()=>Ct(o(p)[o(T)].text)),fe(()=>Z(N,1,Jt([o(g).button,`ec-${o(T)}`,o(p)[o(T)].active&&o(g).active]))),Ve("click",N,function(...$e){o(p)[o(T)].click?.apply(this,$e)}),B(z,N)},te=z=>{var N=Ka(),$e=dn(N,!0);fe(()=>{Z(N,1,Jt([o(g).button,`ec-${o(T)}`,o(m)===o(T)&&o(g).active])),Ti($e,o(c)[o(T)])}),Ve("click",N,()=>r.setOption("view",o(T))),B(z,N)};Tt(X,z=>{o(T)==="title"?z(ae):o(T)==="prev"?z(he,1):o(T)==="next"?z(ne,2):o(T)==="today"?z(M,3):o(ot)?z(J,4):o(p)[o(T)]?z(H,5):z(te,-1)}),B(K,Y)}),B(e,j),Ke()}Xt(["click"]);var hf=U("<div><!></div>"),vf=U("<div></div>"),gf=U("<nav></nav>");function mf(e,t){Xe(t,!0);let r=f(()=>xe("state")),n=f(()=>o(r).options.headerToolbar),i=f(()=>o(r).options.theme),s=f(()=>{let l={};for(let c of["start","center","end"])l[c]=o(n)[c]?.split(" ").filter(Boolean).map(p=>p.split(",").filter(Boolean))??[];return l});var a=gf();ft(a,21,()=>Wr(o(s)),Lt,(l,c)=>{var p=vf();ft(p,21,()=>o(s)[o(c)],Lt,(v,h)=>{var u=Qe(),d=Se(u),g=m=>{var y=hf();Za(pe(y),{get buttons(){return o(h)}}),re(y),fe(()=>Z(y,1,o(i).buttonGroup)),B(m,y)},$=m=>{Za(m,{get buttons(){return o(h)}})};Tt(d,m=>{o(h).length>1?m(g):m($,-1)}),B(v,u)}),re(p),fe(()=>Z(p,1,`ec-${o(c)??""}`)),B(l,p)}),re(a),fe(()=>Z(a,1,o(i).toolbar)),B(e,a),Ke()}var _f=new Set(["$$slots","$$events","$$legacy","plugins","options"]),$f=U("<div><!> <!> <!></div>");function yf(e,t){Xe(t,!0);let r=Ae(t,"plugins",19,()=>[]),n=Ae(t,"options",19,()=>({})),i=Mo(t,_f),s=new df(r(),n());s.snippets=i,Dn("state",s);let a=f(()=>s.auxComponents),l=f(()=>s.features),c=f(()=>s.events),p=f(()=>s.interaction),v=f(()=>s.iClass),h=f(()=>s.offset),u=f(()=>s.view),d=f(()=>s.viewComponent),g=f(()=>s.options.date),$=f(()=>s.options.dateIncrement),m=f(()=>s.options.duration),y=f(()=>s.options.height),w=f(()=>s.options.hiddenDays),k=f(()=>s.options.customScrollbars),x=f(()=>s.options.theme),C={...n()};ir(()=>{for(let[q,ve]of Gd(n(),C))D(()=>{E(q,ve)});me(C,n())});function E(q,ve){return s.setOption(q,ve,!1),this}function R(q){let ve=s.options[q];return Jo(ve)?Ne(ve):ve}function V(){return s.fetchedRange.resources={},this}function I(){return s.fetchedRange.events={},this}function j(){return o(c).map(Pt)}function ee(q){q=String(q);for(let ve of o(c))if(ve.id===q)return Pt(ve);return null}function K(q){return q=Mi([q],o(h))[0],o(c).push(q),Pt(q)}function T(q){let ve=String(q.id),er=o(c).findIndex(Nr=>Nr.id===ve);return er>=0?(q=Mi([q],o(h))[0],o(c)[er]=q,Pt(q)):null}function Y(q){q=String(q);let ve=o(c).findIndex(er=>er.id===q);return ve>=0&&o(c).splice(ve,1),this}function X(){return ar(o(u))}function ae(){return o(p).action?.unselect(),this}function he(q,ve){let er=ul(q,ve);if(er){let Nr=dl(er)(q,ve);return Nr.date=Ne(Nr.date),Nr}return null}function ne(q){return q=pt(Ft(q)),s.setOption("date",W(q)),s.scrollDate=q,this}function M(){return s.setOption("date",nl(W(o(g)),o($)??o(m),o(w))),this}function J(){return s.setOption("date",il(W(o(g)),o($)??o(m),o(w))),this}var ot={setOption:E,getOption:R,refetchResources:V,refetchEvents:I,getEvents:j,getEventById:ee,addEvent:K,updateEvent:T,removeEventById:Y,getView:X,unselect:ae,dateFromPoint:he,gotoDate:ne,next:M,prev:J},H=$f();let te;var z=pe(H);mf(z,{});var N=rt(z,2);Vn(N,()=>o(d),(q,ve)=>{ve(q,{})});var $e=rt(N,2);return ft($e,17,()=>o(a),Lt,(q,ve)=>{var er=Qe(),Nr=Se(er);Vn(Nr,()=>o(ve),(Vl,Yl)=>{Yl(Vl,{})}),B(q,er)}),re(H),fe(q=>{Z(H,1,Jt([o(x).calendar,o(x).view,o(v)&&o(x)[o(v)],o(k)&&o(x).customScrollbars])),et(H,"role",q),te=Sr(H,"",te,{height:o(y)})},[()=>o(l).includes("list")?"list":"table"]),B(e,H),Ke(ot)}function bf(e){"weekNumbers"in e||me(e,{weekNumbers:!1,weekNumberContent:void 0})}function wf(e){return()=>{let{viewDates:t,options:{duration:r,hiddenDays:n}}=e,i;return D(()=>i=r.months||r.inWeeks?7-n.length:t.length),i}}function xf(e,t){return()=>{let{options:{highlightedDates:r,validRange:n},viewDates:i}=e,{colsCount:s}=t,a=[];return D(()=>{let l=[],c=1,p=1;for(let v of i)l.push({gridColumn:c,gridRow:p,resource:void 0,dayStart:v,dayEnd:Ht(W(v)),disabled:bn(v,n),highlight:r.some(h=>Ye(h,v))}),c===s&&(a.push(l),l=[],c=0,++p),++c}),a}}function Ef(e,t){return()=>{let{filteredEvents:r}=e,{grid:n}=t,i=[],s=[];return D(()=>{for(let a of r)for(let l of n)Qt(a.display)?a.allDay&&(s=s.concat(_n(a,l))):i=i.concat(_n(a,l));gl(i)}),{chunks:i,bgChunks:s}}}function kf(e,t){return()=>{let{iEvents:r}=e,{grid:n}=t,i=[];for(let[,s]of r)s&&D(()=>{for(let a of n)i=i.concat(_n(s,a,!1))});return i}}var Tf=class{#e;get colsCount(){return o(this.#e)}set colsCount(e){b(this.#e,e)}#t;get grid(){return o(this.#t)}set grid(e){b(this.#t,e)}#r;get gridEl(){return o(this.#r)}set gridEl(e){b(this.#r,e,!0)}#n;get chunks(){return o(this.#n)}set chunks(e){b(this.#n,e)}#i;get bgChunks(){return o(this.#i)}set bgChunks(e){b(this.#i,e)}#o;get iChunks(){return o(this.#o)}set iChunks(e){b(this.#o,e)}#a;get intlDayCell(){return o(this.#a)}set intlDayCell(e){b(this.#a,e)}#s;get intlDayPopover(){return o(this.#s)}set intlDayPopover(e){b(this.#s,e)}#l;get popupDay(){return o(this.#l)}set popupDay(e){b(this.#l,e,!0)}constructor(e){this.#e=f(wf(e)),this.#t=f(xf(e,this)),this.#r=F();let t=f(Ef(e,this)),r=f(()=>o(t).chunks),n=f(()=>o(t).bgChunks);this.#n=f(()=>o(r)),this.#i=f(()=>o(n)),this.#o=f(kf(e,this)),this.hiddenChunks=new vn,this.#a=f(Ar(e,"dayCellFormat")),this.#s=f(Ar(e,"dayPopoverFormat")),this.#l=F(null)}},Cf=U("<div><!></div>");function Cl(e,t){Xe(t,!0);let r=Ae(t,"el",15),n=Ae(t,"allDay",3,!1),i=Ae(t,"resource",3,void 0),s=Ae(t,"dateFromPoint",3,()=>t.date),a=Ae(t,"classes",3,Ii),l=Ae(t,"disabled",3,!1),c=Ae(t,"highlight",3,!1),p=Ae(t,"role",3,"cell"),v=Ae(t,"noIeb",3,!1),h=Ae(t,"noBeb",3,!1),u=Ae(t,"defaultContent",3,void 0),d=f(()=>xe("state")),g=f(()=>o(d).today),$=f(()=>o(d).snippets),m=f(()=>o(d).interaction.action),y=f(()=>o(d).options.dayCellContent),w=f(()=>o(d).options.theme),k=f(()=>xe("view-state")),x=f(()=>o(k).snap),C=f(()=>Ye(t.date,o(g))),E=f(()=>yn(o(y),()=>({allDay:n(),date:Ne(t.date),isToday:o(C),resource:i()}),u(),o($).dayCellContent)),R=f(()=>a()([o(w).day,o(w).weekdays?.[t.date.getUTCDay()],o(C)&&o(w).today,c()&&o(w).highlight,l()&&o(w).disabled,v()&&o(w).noIeb,h()&&o(w).noBeb]));Si(()=>{cl(r(),(T,Y)=>({allDay:n(),date:s()(T,Y),resource:i(),dayEl:r(),disabled:l()}))});let V=f(()=>!l()&&o(m)?T=>o(m).select(T,o(x)):void 0);var I=Cf(),j=pe(I),ee=T=>{var Y=Qe(),X=Se(Y);ut(X,()=>t.content,()=>o(E)),B(T,Y)},K=T=>{var Y=Qe(),X=Se(Y);ut(X,()=>o(E).snippet??ue,()=>o(E).arg),B(T,Y)};Tt(j,T=>{t.content?T(ee):T(K,-1)}),re(I),mr(I,T=>r(T),()=>r()),Fe(I,()=>t.content?null:Ct(o(E).content,o(E).snippet)),fe(()=>{Z(I,1,Jt(o(R))),et(I,"role",p())}),Ve("pointerdown",I,function(...T){o(V)?.apply(this,T)}),B(e,I),Ke()}Xt(["pointerdown"]);var Df=U("<div><!></div>"),Sf=U("<article><!></article>");function Dl(e,t){Xe(t,!0);let r=Ae(t,"el",15),n=Ae(t,"classes",3,Ii),i=Ae(t,"styles",3,Ii),s=f(()=>xe("state")),a=f(()=>o(s).intlEventTime),l=f(()=>o(s).resources),c=f(()=>o(s).snippets),p=f(()=>o(s).view),v=f(()=>o(s).options.displayEventEnd),h=f(()=>o(s).options.eventBackgroundColor),u=f(()=>o(s).options.eventColor),d=f(()=>o(s).options.eventContent),g=f(()=>o(s).options.eventClick),$=f(()=>o(s).options.eventDidMount),m=f(()=>o(s).options.eventClassNames),y=f(()=>o(s).options.eventMouseEnter),w=f(()=>o(s).options.eventMouseLeave),k=f(()=>o(s).options.eventTextColor),x=f(()=>o(s).options.theme),C=f(()=>t.chunk.event),E=f(()=>t.chunk.event.display),R=f(()=>o(C).backgroundColor??bl(t.chunk.resource??Wa(o(C),o(l)))??o(h)??o(u)),V=f(()=>o(C).textColor??wl(t.chunk.resource??Wa(o(C),o(l)))??o(k)),I=f(()=>vd(i()({"background-color":o(R),color:o(V)})).map(H=>`${H[0]}:${H[1]}`).concat(o(C).styles).join(";")),j=f(()=>{let H=[Qt(o(E))?o(x).bgEvent:o(x).event];if(o(C).allDay){Ye(pt(W(t.chunk.start)),o(C).start)||H.push(o(x).startClipped);let te=W(t.chunk.end),z=W(o(C).end);te.setUTCSeconds(te.getUTCSeconds()-1),z.setUTCSeconds(z.getUTCSeconds()-1),Ye(pt(te),pt(z))||H.push(o(x).endClipped)}else Ye(t.chunk.start,o(C).start)||H.push(o(x).startClipped),Ye(t.chunk.end,o(C).end)||H.push(o(x).endClipped);return n()(H.concat(Od(o(m),o(C),o(p))))}),ee=f(()=>Ad(t.chunk,o(v),o(a))),K=f(()=>yn(o(d),()=>({event:Pt(o(C)),timeText:o(ee),view:ar(o(p))}),()=>Nd(t.chunk,o(ee),o(x)),o(c).eventContent));Si(()=>{we(o($))&&o($)({event:Pt(o(C)),timeText:o(ee),el:r(),view:ar(o(p))})});function T(H,te){return we(H)&&!pl(te)?z=>H({event:Pt(o(C)),el:r(),jsEvent:z,view:ar(o(p))}):void 0}let Y=f(()=>!Qt(o(E))&&T(o(g),o(E))||void 0),X=f(()=>o(Y)&&Ko(o(Y))),ae=f(()=>T(o(y),o(E))),he=f(()=>T(o(w),o(E)));var ne=Sf();{let H=te=>{var z=Df(),N=pe(z);ut(N,()=>o(K).snippet??ue,()=>o(K).arg),re(z),Fe(z,()=>Ct(o(K).content,o(K).snippet)),fe(()=>Z(z,1,Jt(o(x).eventBody))),B(te,z)};var M=pe(ne),J=te=>{var z=Qe(),N=Se(z);ut(N,()=>t.body,()=>H,()=>o(R),()=>o(V)),B(te,z)},ot=te=>{H(te)};Tt(M,te=>{t.body?te(J):te(ot,-1)}),re(ne),mr(ne,te=>r(te),()=>r())}fe(()=>{Z(ne,1,Jt(o(j))),Sr(ne,o(I)),et(ne,"role",o(Y)?"button":void 0),et(ne,"tabindex",o(Y)?0:void 0)}),Ve("click",ne,function(...H){o(Y)?.apply(this,H)}),Ve("keydown",ne,function(...H){o(X)?.apply(this,H)}),pn("mouseenter",ne,function(...H){o(ae)?.apply(this,H)}),pn("mouseleave",ne,function(...H){o(he)?.apply(this,H)}),Ve("pointerdown",ne,function(...H){t.onpointerdown?.apply(this,H)}),B(e,ne),Ke()}Xt(["click","keydown","pointerdown"]);var $C=U("<div><!></div>");var yC=U("<time></time>");function Rf(e,t){Xe(t,!0);let r=Ae(t,"el",15),n=f(()=>xe("state")),i=f(()=>o(n).iClasses),s=f(()=>o(n).interaction.action),a=f(()=>o(n).interaction.resizer),l=f(()=>xe("view-state")),c=f(()=>o(l).snap),p=f(()=>t.chunk.event),v=f(()=>t.chunk.event.display),h=f(()=>g=>o(i)(g,o(p)));function u(g){return o(s)?.draggable(g)?$=>o(s).drag(g,$,t.forceDate,t.forceMargin,o(c)):o(s)?.noAction}let d=f(()=>!Qt(o(v))&&!pl(o(v))?u(o(p)):void 0);Dl(e,{get chunk(){return t.chunk},get classes(){return o(h)},get styles(){return t.styles},get onpointerdown(){return o(d)},get el(){return r()},set el($){r($)},body:($,m=ue)=>{var y=Qe(),w=Se(y),k=C=>{var E=Qe(),R=Se(E);Vn(R,()=>o(a),(V,I)=>{I(V,{get chunk(){return t.chunk},get axis(){return t.axis},get forceDate(){return t.forceDate},get forceMargin(){return t.forceMargin},children:(j,ee)=>{var K=Qe(),T=Se(K);ut(T,m),B(j,K)},$$slots:{default:!0}})}),B(C,E)},x=C=>{var E=Qe(),R=Se(E);ut(R,m),B(C,E)};Tt(w,C=>{o(a)?C(k):C(x,-1)}),B($,y)},$$slots:{body:!0}}),Ke()}var Af=U("<span><!></span>"),Nf=U('<a role="button" tabindex="0" aria-haspopup="dialog"><!></a>'),Of=U("<div><time><!></time> <!></div> <div><!></div>",1);function If(e,t){Xe(t,!0);let r=xe("state"),n=xe("view-state");f(()=>r.features);let i=f(()=>r.snippets),s=f(()=>r.options.date),a=f(()=>r.options.firstDay),l=f(()=>r.options.moreLinkContent),c=f(()=>r.options.theme),p=f(()=>r.options.weekNumbers),v=f(()=>r.options.weekNumberContent),h=f(()=>n.hiddenChunks),u=f(()=>n.intlDayCell),d=f(()=>t.day.dayStart),g=f(()=>t.day.disabled),$=f(()=>t.day.highlight),m=f(()=>o(d).getUTCMonth()!==o(s).getUTCMonth()),y=f(()=>R=>[...R,o(m)&&o(c).otherMonth]),w=f(()=>o(p)&&o(d).getUTCDay()===(o(a)?1:0)),k=f(()=>o(w)?Ed(ol(o(d),o(a)),o(d),o(v),o(i).weekNumberContent):{}),x=f(()=>o(h).get($r(o(d)))),C=f(()=>{if(!o(x))return{};let R=o(x).length,V="+"+R+" more";return yn(o(l),()=>({num:R,text:V}),V,o(i).moreLinkContent)});function E(){n.popupDay=t.day}Cl(e,{get date(){return o(d)},allDay:!0,get classes(){return o(y)},get disabled(){return o(g)},get highlight(){return o($)},get noIeb(){return t.noIeb},get noBeb(){return t.noBeb},defaultContent:()=>o(u).format(o(d)),content:(V,I=ue)=>{var j=Of(),ee=Se(j),K=pe(ee),T=pe(K);ut(T,()=>I().snippet??ue,()=>I().arg),re(K),Fe(K,()=>Ct(I().content,I().snippet));var Y=rt(K,2),X=M=>{var J=Af(),ot=pe(J);ut(ot,()=>o(k).snippet??ue,()=>o(k).arg),re(J),Fe(J,()=>Ct(o(k).content,o(k).snippet)),fe(()=>Z(J,1,o(c).weekNumber)),B(M,J)};Tt(Y,M=>{o(w)&&M(X)}),re(ee);var ae=rt(ee,2),he=pe(ae),ne=M=>{var J=Nf(),ot=f(()=>qo(E)),H=f(()=>Ko(E)),te=f(qo),z=pe(J);ut(z,()=>o(C).snippet??ue,()=>o(C).arg),re(J),Fe(J,()=>Ct(o(C).content,o(C).snippet)),Ve("click",J,function(...N){o(ot)?.apply(this,N)}),Ve("keydown",J,function(...N){o(H)?.apply(this,N)}),Ve("pointerdown",J,function(...N){o(te)?.apply(this,N)}),B(M,J)};Tt(he,M=>{o(x)&&M(ne)}),re(ae),fe(M=>{Z(ee,1,o(c).dayHead),et(K,"datetime",M),Z(ae,1,o(c).dayFoot)},[()=>_r(o(d),10)]),B(V,j)},$$slots:{content:!0}}),Ke()}Xt(["click","keydown","pointerdown"]);function Oi(e,t){Xe(t,!0);let r=Ae(t,"inPopup",3,!1),n=f(()=>xe("state")),i=f(()=>o(n).options.dayMaxEvents),s=f(()=>o(n).options.eventGap),a=f(()=>xe("view-state")),l=f(()=>o(a).colsCount),c=f(()=>o(a).gridEl),p=f(()=>o(a).hiddenChunks),v=f(()=>o(a).popupDay),h=F(void 0),u=F(1),d=F(!1),g=f(()=>t.chunk.event),$=f(()=>t.chunk.event.display);function m(){return o(c).children.item((t.chunk.gridRow-1)*o(l)+t.chunk.gridColumn-1)}$t(()=>{!r()&&(hl(o($))||vl(o($)))&&b(u,Yn(m().firstElementChild)||1,!0)});let y=f(()=>E=>{if(E["grid-column"]=`${t.chunk.gridColumn} / span ${t.chunk.dates.length}`,E["grid-row"]=t.chunk.gridRow,!Qt(o($))){let R=r()?1:o(u);if(o(g)._margin){let[V,I]=o(g)._margin;V>R&&t.chunk.gridRow===I&&(R=V)}E["margin-block-start"]=`${R}px`}return o(d)&&(E.visibility="hidden"),E});function w(){b(u,Pd(t.chunk,Yn(o(h)),Yn(m().firstElementChild)||1,o(s)),!0)}function k(){if(o(i)===!0){let E=m(),R=Yn(E)-x(E);if(b(d,t.chunk.bottom>R),o(d))for(let V of t.chunk.dates){let I=$r(V);if(o(p).has(I)){let j=o(p).get(I);j.includes(t.chunk)||o(p).set(I,[...j,t.chunk])}else o(p).set(I,[t.chunk])}}else b(d,!1),o(p).size&&o(p).clear()}function x(E){let R=0;for(let V=0;V<t.chunk.dates.length&&(R=Rr(R,Yn(E.lastElementChild)),E=E.nextElementSibling,!!E);++V);return R}var C={reposition:w,hide:k};{let E=f(()=>r()&&o(v).dayStart),R=f(()=>[o(u),t.chunk.gridRow]);Rf(e,{get chunk(){return t.chunk},get styles(){return o(y)},axis:"x",get forceDate(){return o(E)},get forceMargin(){return o(R)},get el(){return o(h)},set el(V){b(h,V,!0)}})}return Ke(C)}var Mf=U('<dialog closedby="closerequest"><header><time></time>  <a role="button" tabindex="0">&times;</a></header> <div></div></dialog>');function Lf(e,t){Xe(t,!0);let r=xe("view-state"),n=f(()=>xe("state")),i=f(()=>o(n).interaction),s=f(()=>o(n).options.buttonText),a=f(()=>o(n).options.theme),l=f(()=>r.colsCount),c=f(()=>r.chunks),p=f(()=>r.gridEl),v=f(()=>r.intlDayPopover),h=f(()=>r.popupDay),u=F(void 0),d=F(""),g=f(()=>o(h).gridColumn),$=f(()=>o(h).gridRow),m=f(()=>o(h).dayStart),y=f(()=>o(h).dayEnd),w=f(()=>{let Y=[];for(let X of o(c))X.gridRow===o($)&&X.gridColumn<=o(g)&&X.gridColumn+X.dates.length>o(g)&&Y.push(me({},X,Wn(X.event,o(m),o(y))));return Y.sort((X,ae)=>X.top-ae.top),Y});Si(()=>{o(u).show()}),$t(()=>{o(w).length?D(k):x()});function k(){let Y=o(p).children.item((o($)-1)*o(l)+o(g)-1),X=Ni(o(u)),ae=Ni(Y),he=Ni(o(p));b(d,"");let ne;if(X.width>=he.width){ne=he.left-ae.left;let J=ae.right-he.right;b(d,o(d)+`inset-inline-end:${J}px;`)}else ne=(ae.width-X.width)/2,ae.left+ne<he.left?ne=he.left-ae.left:ae.left+ne+X.width>he.right&&(ne=he.right-ae.left-X.width);b(d,o(d)+`inset-inline-start:${ne}px;`);let M;X.height>=he.height?(M=he.top-ae.top,b(d,o(d)+`block-size:${he.height}px;`)):(M=(ae.height-X.height)/2,ae.top+M<he.top?M=he.top-ae.top:ae.top+M+X.height>he.bottom&&(M=he.bottom-ae.top-X.height)),b(d,o(d)+`inset-block-start:${M}px;`)}function x(){r.popupDay=null}function C(){x(),o(i).action?.noClick()}var E=Mf();let R;var V=pe(E),I=pe(V);Fe(I,()=>Ct(o(v).format(o(m))));var j=rt(I,2);di(j,!0);var ee=f(()=>qo(x)),K=f(()=>Ko(x));re(V);var T=rt(V,2);ft(T,21,()=>o(w),Lt,(Y,X)=>{Oi(Y,{get chunk(){return o(X)},inPopup:!0})}),re(T),re(E),mr(E,Y=>b(u,Y),()=>o(u)),Fe(E,()=>pd("pointerdown")),fe(Y=>{Z(E,1,o(a).popup),R=Sr(E,o(d),R,{"grid-area":`${o($)+1} / ${o(g)}`}),Z(V,1,o(a).dayHead),et(I,"datetime",Y),et(j,"aria-label",o(s).close),Z(T,1,o(a).events)},[()=>_r(o(m),10)]),pn("pointerdownoutside",E,C),pn("close",E,x),Ve("click",j,function(...Y){o(ee)?.apply(this,Y)}),Ve("keydown",j,function(...Y){o(K)?.apply(this,Y)}),B(e,E),Ke()}Xt(["click","keydown"]);var Pf=U('<div role="columnheader"><span></span></div>'),Ff=U('<section><header><div role="row"></div></header> <div><div></div> <div><!> <!> <!></div></div> <!></section>');function jo(e,t){Xe(t,!0);let r=xe("state"),n=new Tf(r);Dn("view-state",n);let i=f(()=>r.intlDayHeader),s=f(()=>r.intlDayHeaderAL),a=f(()=>r.options.dayMaxEvents),l=f(()=>r.options.eventGap),c=f(()=>r.options.theme),p=f(()=>n.grid),v=f(()=>n.chunks),h=f(()=>n.bgChunks),u=f(()=>n.iChunks),d=f(()=>n.hiddenChunks),g=f(()=>n.popupDay),$=[];function m(){Md($,o(v)),o(d).clear(),gr().then(y)}function y(){o(d).size,$.forEach(E=>E?.hide())}$t(()=>{o(l),o(v),gr().then(m)}),$t(y);var w=Qe(),k=Se(w),x=E=>{var R=Ff();let V;var I=pe(R),j=pe(I);ft(j,21,()=>o(p)[0],Lt,(M,J,ot)=>{let H=()=>o(J).dayStart;var te=Pf();et(te,"aria-colindex",1+ot);var z=pe(te);Fe(z,()=>Ct(o(i).format(H()))),re(te),fe((N,$e)=>{Z(te,1,N),et(z,"aria-label",$e)},[()=>Jt([o(c).colHead,o(c).weekdays?.[H().getUTCDay()]]),()=>o(s).format(H())]),B(M,te)}),re(j),re(I);var ee=rt(I,2),K=pe(ee);ft(K,21,()=>o(p),Lt,(M,J,ot)=>{var H=Qe(),te=Se(H);ft(te,17,()=>o(J),Lt,(z,N,$e)=>{{let q=f(()=>$e+1===qr(o(J))),ve=f(()=>ot+1===qr(o(p)));If(z,{get day(){return o(N)},get noIeb(){return o(q)},get noBeb(){return o(ve)}})}}),B(M,H)}),re(K),mr(K,M=>n.gridEl=M,()=>n?.gridEl);var T=rt(K,2),Y=pe(T);ft(Y,19,()=>o(v),M=>M.id,(M,J,ot)=>{mr(Oi(M,{get chunk(){return o(J)}}),(H,te)=>$[te]=H,H=>$?.[H],()=>[o(ot)])});var X=rt(Y,2);ft(X,17,()=>o(h),M=>M.id,(M,J)=>{Oi(M,{get chunk(){return o(J)}})});var ae=rt(X,2);ft(ae,17,()=>o(u),Lt,(M,J)=>{Oi(M,{get chunk(){return o(J)}})}),re(T),re(ee);var he=rt(ee,2),ne=M=>{Lf(M,{})};Tt(he,M=>{o(g)&&M(ne)}),re(R),mr(R,M=>r.mainEl=M,()=>r?.mainEl),Fe(R,()=>hd(m)),fe((M,J)=>{Z(R,1,Jt([o(c).main,o(a)===!0&&o(c).uniform])),V=Sr(R,"",V,{"--ec-grid-cols":M,"--ec-grid-rows":J}),Z(I,1,o(c).header),Z(j,1,o(c).grid),Z(ee,1,o(c).body),Z(K,1,o(c).grid),Z(T,1,o(c).events)},[()=>qr(o(p)[0]),()=>qr(o(p))]),B(E,R)},C=f(()=>!jr(o(p))&&!jr(o(p)[0]));Tt(k,E=>{o(C)&&E(x)}),B(e,w),Ke()}var Sl={createOptions(e){bf(e),me(e,{dayMaxEvents:!1,dayCellFormat:{day:"numeric"},dayPopoverFormat:{month:"long",day:"numeric",year:"numeric"},moreLinkContent:void 0,view:"dayGridMonth"}),me(e.buttonText,{dayGridDay:"day",dayGridMonth:"month",dayGridWeek:"week",close:"Close"}),me(e.theme,{uniform:"ec-uniform",dayFoot:"ec-day-foot",otherMonth:"ec-other-month",popup:"ec-popup"}),me(e.views,{dayGridDay:{buttonText:ml,component:()=>jo,dayHeaderFormat:{weekday:"long"},displayEventEnd:!1,duration:{days:1},theme:Gr("ec-day-grid ec-day-view")},dayGridWeek:{buttonText:_l,component:()=>jo,displayEventEnd:!1,theme:Gr("ec-day-grid ec-week-view")},dayGridMonth:{buttonText:$l,component:Hf,dayHeaderFormat:{weekday:"short"},dayHeaderAriaLabelFormat:{weekday:"long"},displayEventEnd:!1,duration:{months:1},theme:Gr("ec-day-grid ec-month-view"),titleFormat:{year:"numeric",month:"long"}}})}};function Hf(e){return e.features=["dayNumber"],e.extensions.activeRange=(t,r)=>{let{options:{firstDay:n}}=e;return{start:rl(t,n),end:wd(r,n)}},jo}var bC=U("<div></div>"),wC=U("<!> <!> <!>",1);Xt(["pointerdown"]);var xC=U("<!> <!>",1);var zf=class{#e;get intlListDay(){return o(this.#e)}set intlListDay(e){b(this.#e,e)}#t;get intlListDaySide(){return o(this.#t)}set intlListDaySide(e){b(this.#t,e)}constructor(e){this.#e=f(Ar(e,"listDayFormat")),this.#t=f(Ar(e,"listDaySideFormat"))}},Uf=U("<div></div> <!>",1);function Bf(e,t){Xe(t,!0);let r=f(()=>xe("state")),n=f(()=>o(r).interaction),i=f(()=>o(r).options.theme),s=f(()=>a=>(delete a["background-color"],delete a.color,a));{let a=(c,p=ue,v=ue,h=ue)=>{var u=Uf(),d=Se(u);let g;var $=rt(d,2);ut($,p),fe(()=>{Z(d,1,o(i).eventTag),g=Sr(d,"",g,{"background-color":v()})}),B(c,u)},l=f(()=>o(n).action?.noAction);Dl(e,{get chunk(){return t.chunk},get styles(){return o(s)},get onpointerdown(){return o(l)},body:a,$$slots:{body:!0}})}Ke()}var Vf=U("<h4><time><!></time> <time></time></h4> <!>",1);function Yf(e,t){Xe(t,!0);let r=f(()=>xe("state")),n=f(()=>o(r).filteredEvents),i=f(()=>o(r).options.highlightedDates),s=f(()=>o(r).options.theme),a=f(()=>o(r).options.validRange),l=f(()=>xe("view-state")),c=f(()=>o(l).intlListDay),p=f(()=>o(l).intlListDaySide),v=f(()=>o(i).some(y=>Ye(y,t.date))),h=f(()=>bn(t.date,o(a))),u=f(()=>_r(t.date,10)),d=f(()=>{let y=[];if(!o(h)){let w=t.date,k=Ht(W(t.date));for(let x of o(n))if(!Qt(x.display)&&mn(x,w,k)){let C=Wn(x,w,k);y.push(C)}}return y});var g=Qe(),$=Se(g),m=y=>{Cl(y,{get date(){return t.date},allDay:!0,role:"listitem",get disabled(){return o(h)},get highlight(){return o(v)},defaultContent:()=>o(c).format(t.date),content:(k,x=ue)=>{var C=Vf(),E=Se(C),R=pe(E),V=pe(R);ut(V,()=>x().snippet??ue,()=>x().arg),re(R),Fe(R,()=>Ct(x().content,x().snippet));var I=rt(R,2);Fe(I,()=>Ct(o(p).format(t.date))),re(E);var j=rt(E,2);ft(j,17,()=>o(d),ee=>ee.event,(ee,K)=>{Bf(ee,{get chunk(){return o(K)}})}),fe(()=>{Z(E,1,o(s).dayHead),et(R,"datetime",o(u)),Z(I,1,o(s).daySide),et(I,"datetime",o(u))}),B(k,C)},$$slots:{content:!0}})};Tt($,y=>{o(d).length&&y(m)}),B(e,g),Ke()}var qf=U("<div><!></div>"),Gf=U("<section><!></section>");function Wf(e,t){Xe(t,!0);let r=xe("state"),n=new zf(r);Dn("view-state",n);let i=f(()=>r.filteredEvents),s=f(()=>r.snippets),a=f(()=>r.view),l=f(()=>r.viewDates),c=f(()=>r.options.noEventsClick),p=f(()=>r.options.noEventsContent),v=f(()=>r.options.theme),h=f(()=>{let w=!0;if(!jr(o(l))){let k=o(l)[0],x=Ht(W(o(l).at(-1)));for(let C of o(i))if(!Qt(C.display)&&C.start<x&&C.end>k){w=!1;break}}return w}),u=f(()=>yn(o(p),void 0,void 0,o(s).noEventsContent));function d(w){we(o(c))&&o(c)({jsEvent:w,view:ar(o(a))})}var g=Gf(),$=pe(g),m=w=>{var k=qf(),x=pe(k);ut(x,()=>o(u).snippet??ue,()=>o(u).arg),re(k),Fe(k,()=>Ct(o(u).content,o(u).snippet)),fe(()=>Z(k,1,o(v).noEvents)),Ve("click",k,d),B(w,k)},y=w=>{var k=Qe(),x=Se(k);ft(x,17,()=>o(l),Lt,(C,E)=>{Yf(C,{get date(){return o(E)}})}),B(w,k)};Tt($,w=>{o(h)?w(m):w(y,-1)}),re(g),mr(g,w=>r.mainEl=w,()=>r?.mainEl),fe(()=>Z(g,1,o(v).main)),B(e,g),Ke()}Xt(["click"]);var Rl={createOptions(e){me(e,{listDayFormat:{weekday:"long"},listDaySideFormat:{year:"numeric",month:"long",day:"numeric"},noEventsClick:void 0,noEventsContent:"No events",view:"listWeek"}),me(e.buttonText,{listDay:"day",listWeek:"week",listMonth:"month",listYear:"year"}),me(e.theme,{daySide:"ec-day-side",eventTag:"ec-event-tag",noEvents:"ec-no-events"}),me(e.views,{listDay:{buttonText:ml,component:Ai,duration:{days:1},theme:Gr("ec-list ec-day-view"),titleFormat:{year:"numeric",month:"long",day:"numeric"}},listWeek:{buttonText:_l,component:Ai,duration:{weeks:1},theme:Gr("ec-list ec-week-view")},listMonth:{buttonText:$l,component:Ai,duration:{months:1},theme:Gr("ec-list ec-month-view"),titleFormat:{year:"numeric",month:"long"}},listYear:{buttonText:Hd,component:Ai,duration:{years:1},theme:Gr("ec-list ec-year-view"),titleFormat:{year:"numeric"}}})}};function Ai(e){return e.features=["list"],Wf}function Xo(e,t,r=!0){let n=[];for(let{gridColumn:i,gridRow:s,resource:a,start:l,end:c,disabled:p}of t)if(!p&&mn(e,l,c,a)){let v=Wn(e,l,c);me(v,{gridColumn:i,gridRow:s,resource:a,top:(v.start-l)/1e3,height:(v.end-v.start)/1e3,maxHeight:(c-v.start)/1e3}),r&&rs(v),n.push(v)}return n}function jf(e){let t={};for(let r of e){let{gridColumn:n}=r,i=t[n],s=0;if(i&&r.start<i.end){for(;s<i.columns.length&&!(i.columns[s].at(-1).end<=r.start);++s);r.end>i.end&&(i.end=r.end)}else i={columns:[],end:r.end};i.columns.length<s+1&&i.columns.push([]),i.columns[s].push(r),t[n]=i,r.group=i,r.groupColumn=s}}function Xf(e,t){return()=>{let{viewDates:r,options:{highlightedDates:n,validRange:i}}=e,{slotTimeLimits:s}=t,a=[];return D(()=>{let l=1;for(let c of r)a.push({gridColumn:l,gridRow:1,resource:void 0,start:it(W(c),s.min),end:it(W(c),s.max),dayStart:c,dayEnd:Ht(W(c)),disabled:bn(c,i),highlight:n.some(p=>Ye(p,c))}),++l}),[a]}}function Kf(e,t){return()=>{let{filteredEvents:r}=e,{grid:n}=t,i=[],s=[],a=[],l=[];return D(()=>{for(let c of r)for(let p of n)Qt(c.display)?(s=s.concat(Xo(c,p)),c.allDay&&(l=l.concat(_n(c,p)))):c.allDay?a=a.concat(_n(c,p)):i=i.concat(Xo(c,p));jf(i),gl(a)}),{chunks:i,bgChunks:s,allDayChunks:a,allDayBgChunks:l}}}function Zf(e,t){return()=>{let{iEvents:r}=e,{grid:n}=t,i=[],s=[];for(let[,a]of r)a&&D(()=>{for(let l of n)a.allDay?s=s.concat(_n(a,l,!1)):i=i.concat(Xo(a,l,!1))});return{iChunks:i,allDayIChunks:s}}}function Jf(e){return()=>{let{filteredEvents:t,viewDates:r,options:{flexibleSlotTimeLimits:n,slotMinTime:i,slotMaxTime:s}}=e,a;return D(()=>{a=El(i,s,n,r,t)}),a}}function Qf(e){return()=>{let{options:{slotDuration:t,slotLabelInterval:r}}=e,n;return D(()=>{n=r===void 0?He(t)<3600?2:1:md(He(r)/He(t))||1}),n}}function eu(e,t){return()=>{let{offset:r,options:{slotDuration:n}}=e,{intlSlotLabel:i,slotLabelPeriodicity:s,slotTimeLimits:a}=t,l;return D(()=>{l=xl(pt(Ft(void 0,r)),n,s,a,i)}),l}}function tu(e){return()=>{let{options:{slotDuration:t,snapDuration:r}}=e;return r??=t,{duration:r,ratio:He(r)/He(t)}}}function is(){return class{#e;get intlSlotLabel(){return o(this.#e)}set intlSlotLabel(e){b(this.#e,e)}#t;get slotLabelPeriodicity(){return o(this.#t)}set slotLabelPeriodicity(e){b(this.#t,e)}#r;get sidebarWidth(){return o(this.#r)}set sidebarWidth(e){b(this.#r,e,!0)}#n;get snap(){return o(this.#n)}set snap(e){b(this.#n,e)}constructor(e){this.#e=f(Ar(e,"slotLabelFormat")),this.#t=f(Qf(e)),this.#r=F(0),this.#n=f(tu(e))}}}function Al(e){return class extends e{#e;get slotTimeLimits(){return o(this.#e)}set slotTimeLimits(t){b(this.#e,t)}#t;get slots(){return o(this.#t)}set slots(t){b(this.#t,t)}#r;get chunks(){return o(this.#r)}set chunks(t){b(this.#r,t)}#n;get bgChunks(){return o(this.#n)}set bgChunks(t){b(this.#n,t)}#i;get allDayChunks(){return o(this.#i)}set allDayChunks(t){b(this.#i,t)}#o;get allDayBgChunks(){return o(this.#o)}set allDayBgChunks(t){b(this.#o,t)}#a;get iChunks(){return o(this.#a)}set iChunks(t){b(this.#a,t)}#s;get allDayIChunks(){return o(this.#s)}set allDayIChunks(t){b(this.#s,t)}constructor(t){super(t),this.#e=f(Jf(t)),this.#t=f(eu(t,this));let r=f(Kf(t,this)),n=f(()=>o(r).chunks),i=f(()=>o(r).bgChunks),s=f(()=>o(r).allDayChunks),a=f(()=>o(r).allDayBgChunks);this.#r=f(()=>o(n)),this.#n=f(()=>o(i)),this.#i=f(()=>o(s)),this.#o=f(()=>o(a));let l=f(Zf(t,this)),c=f(()=>o(l).iChunks),p=f(()=>o(l).allDayIChunks);this.#a=f(()=>o(c)),this.#s=f(()=>o(p))}}}var EC=class extends Al(is()){#e;get grid(){return o(this.#e)}set grid(e){b(this.#e,e)}constructor(e){super(e),this.#e=f(Xf(e,this))}},ru;function nu(e){return()=>{let{activeRange:t,filteredEvents:r,resources:n,options:{filterResourcesWithEvents:i},extensions:{viewResources:s}}=e,a=s?s(n):n;return D(()=>{i&&(a=n.filter(l=>r.some(c=>!Qt(c.display)&&mn(c,t.start,t.end,l)))),a.length||(a=ru??=ns([{}]))}),a}}function iu(e,t){return()=>{let{viewDates:r,options:{datesAboveResources:n,highlightedDates:i,validRange:s}}=e,{slotTimeLimits:a,viewResources:l}=t,c=[];return D(()=>{let p=1,v=[l,r],h=[el,$r];n&&(v.reverse(),h.reverse());for(let u of v[0]){let d=[],g=h[0](u);for(let $ of v[1]){let m=n?u:$,y=n?$:u;d.push({gridColumn:p,gridRow:1,resource:y,key:h[1]($),groupKey:g,start:it(W(m),a.min),end:it(W(m),a.max),dayStart:m,dayEnd:Ht(W(m)),disabled:bn(m,s),highlight:i.some(w=>Ye(w,m))}),++p}c.push(d)}}),c}}function Nl(e){return class extends e{#e;get viewResources(){return o(this.#e)}set viewResources(t){b(this.#e,t)}constructor(t){super(t),this.#e=f(nu(t))}}}var kC=class extends Nl(Al(is())){#e;get grid(){return o(this.#e)}set grid(e){b(this.#e,e)}constructor(e){super(e),this.#e=f(iu(e,this))}},TC=U("<span><!></span>");var CC=U("<div></div>");var DC=U('<div><aside><!></aside> <div role="row"></div> <div><!> <!> <!></div></div>'),SC=U("<div><time></time></div>"),RC=U('<section><header><aside></aside> <div role="row"><!></div> <!></header> <div role="rowgroup"><aside aria-hidden="true"></aside> <div role="row"></div> <div><!> <!> <!></div></div> <!></section>');var AC=U("<!> <!>",1);function ou(e,t){let r=0,n=t.length;for(;r<n;){let i=r+n>>1;t[i].dayEnd>e.start?n=i:r=i+1}for(;r>0&&t[r-1].end>e.start;)--r;return r}function Ol(e,t,r,n=!0){let i=[],s,a,l,c,p,v,h=0;for(let u=ou(e,t);u<t.length;++u){let{gridColumn:d,gridRow:g,resource:$,dayStart:m,dayEnd:y,start:w,end:k,disabled:x}=t[u];if(m>=e.end)break;x||(r?mn(e,m,y,$)&&(i.length||(s=m,l=d,c=g,p=$),i.push(m),a=y):mn(e,w,k,$)&&(i.length||(s=w,l=d,c=g,p=$,v=Rr(e.start-w,0)/1e3),i.push(m),a=k,h+=(qn(k,e.end)-Rr(w,e.start))/1e3))}if(i.length){let u=Wn(e,s,a);return me(u,{gridColumn:l,gridRow:c,resource:p,dates:i,left:v,width:h}),n&&rs(u),u}return null}function Il(e,t){let r=t[0]?.resource;return!r||e.resourceIds.includes(r.id)}function su(e,t){let r=[],n={};for(let a of e){let{gridColumn:l,gridRow:c,dates:p,start:v,end:h,event:{layoutGroup:u}}=a;a.span=t?[l,l+p.length]:[+v,+h];let d;if(u!==void 0){let g=`${c}_${u}`;d=n[g],d||(d=Ja(a,r),n[g]=d)}else d=Ja(a,r);a.rivals=d.chunks.filter(g=>zo(g.span,a.span)),d.chunks.push(a),au(d.span,a.span),d.startColumn=qn(d.startColumn,l),d.endColumn=Rr(d.endColumn,l+p.length)}let i=[],s=(a,l)=>(i[a]??=[])[l]??={spanning:[],starting:[]};for(let a of r){let{gridRow:l,startColumn:c,endColumn:p,span:v}=a,h=[],u=s(l,c);for(let d of u.spanning)zo(d.span,v)&&h.push(d);for(let d=c+1;d<p;++d)for(let g of s(l,d).starting)zo(g.span,v)&&h.push(g);a.rivals=h,u.starting.push(a);for(let d=c;d<p;++d)s(l,d).spanning.push(a)}return r}function Ja(e,t){let{gridColumn:r,gridRow:n,span:i}=e,s={gridRow:n,chunks:[],span:[...i],startColumn:r,endColumn:r};return t.push(s),s}function zo([e,t],[r,n]){return e<n&&t>r}function au(e,t){e[0]=qn(e[0],t[0]),e[1]=Rr(e[1],t[1])}function lu(e,t){return()=>{let{viewDates:r,options:{highlightedDates:n,validRange:i}}=e,{dayTimeLimits:s,viewResources:a}=t,l=[];return D(()=>{let c=1;for(let p of a){let v=[],h=1;for(let u of r){let d=s[$r(u)];v.push({gridColumn:h,gridRow:c,resource:p,start:it(W(u),d.min),end:it(W(u),d.max),dayStart:u,dayEnd:Ht(W(u)),disabled:bn(u,i),highlight:n.some(g=>Ye(g,u))}),++h}l.push(v),++c}}),l}}function cu(e){return e.months===1&&!e.years&&!e.days&&!e.seconds}function du(e){return e.inWeeks&&e.days===7&&!e.years&&!e.months&&!e.seconds}function fu(e,t){return()=>{let{features:r,options:{duration:n,firstDay:i,weekNumbers:s}}=e,{grid:a}=t,l=[],c=[];return D(()=>{let p,v;if(!jr(a)){for(let{dayStart:h,gridColumn:u}of a[0])if(r.includes("month")&&(p&&p.date.getUTCMonth()===h.getUTCMonth()?++p.span:(p={date:h,gridColumn:u,span:1},l.push(p))),s){let d=ol(h,i);v&&v.number===d?++v.span:(v={number:d,date:h,gridColumn:u,span:1},c.push(v))}}qr(l)===1&&cu(n)&&(l=[]),qr(c)===1&&du(n)&&(c=[])}),{months:l,weeks:c}}}function uu(e,t){return()=>{let{filteredEvents:r}=e,{grid:n,monthView:i}=t,s=[],a=[],l;return D(()=>{for(let c of r){let p=Qt(c.display);if(p&&i&&!c.allDay)continue;let v=p?a:s;for(let h of n){if(!Il(c,h))continue;let u=Ol(c,h,i);u&&v.push(u)}}l=su(s,i)}),{chunks:s,bgChunks:a,units:l}}}function pu(e,t){return()=>{let{iEvents:r}=e,{grid:n,monthView:i}=t,s=[];for(let[,a]of r)a&&D(()=>{for(let l of n){if(!Il(a,l))continue;let c=Ol(a,l,i,!1);c&&s.push(c)}});return s}}function hu(e){return()=>{let{filteredEvents:t,viewDates:r,options:{flexibleSlotTimeLimits:n,slotMinTime:i,slotMaxTime:s}}=e,a={};return D(()=>{for(let l of r)a[$r(l)]=El(i,s,n,[l],t)}),a}}function vu(e,t){return()=>{let{viewDates:r,options:{slotDuration:n}}=e,{dayTimeLimits:i,intlSlotLabel:s,slotLabelPeriodicity:a}=t,l={};return D(()=>{for(let c of r){let p=$r(c);l[p]=p in i?xl(c,n,a,i[p],s):[]}}),l}}function gu(e){return()=>{let{resources:t}=e,r;return D(()=>{r=t.some(n=>dl(n).children.length)}),r}}function mu(e){return()=>{let{options:{slotDuration:t}}=e,r;return D(()=>{r=!He(t)}),r}}var NC=class extends Nl(is()){#e;get dayTimeLimits(){return o(this.#e)}set dayTimeLimits(e){b(this.#e,e)}#t;get daySlots(){return o(this.#t)}set daySlots(e){b(this.#t,e)}#r;get grid(){return o(this.#r)}set grid(e){b(this.#r,e)}#n;get extraHeads(){return o(this.#n)}set extraHeads(e){b(this.#n,e)}#i;get intlMonthHeader(){return o(this.#i)}set intlMonthHeader(e){b(this.#i,e)}#o;get monthView(){return o(this.#o)}set monthView(e){b(this.#o,e)}#a;get chunks(){return o(this.#a)}set chunks(e){b(this.#a,e)}#s;get bgChunks(){return o(this.#s)}set bgChunks(e){b(this.#s,e)}#l;get units(){return o(this.#l)}set units(e){b(this.#l,e)}#d;get iChunks(){return o(this.#d)}set iChunks(e){b(this.#d,e)}#c;get nestedResources(){return o(this.#c)}set nestedResources(e){b(this.#c,e)}constructor(e){super(e),this.#e=f(hu(e)),this.#t=f(vu(e,this)),this.#r=f(lu(e,this)),this.#n=f(fu(e,this)),this.#i=f(Ar(e,"monthHeaderFormat")),this.#o=f(mu(e));let t=f(uu(e,this)),r=f(()=>o(t).chunks),n=f(()=>o(t).bgChunks),i=f(()=>o(t).units);this.#a=f(()=>o(r)),this.#s=f(()=>o(n)),this.#l=f(()=>o(i)),this.#d=f(pu(e,this)),this.#c=f(gu(e))}};var OC=U("<span></span>"),IC=U("<button></button>"),MC=U("<!> <span><!></span>",1);Xt(["click"]);var LC=U("<div></div>");var PC=U("<time></time>"),FC=U("<span><!></span>"),HC=U("<div><time></time></div>"),zC=U('<div role="rowheader"><!> <!></div>'),UC=U('<section><header><aside></aside> <div role="row"><!> <!> <!> <!></div></header> <div role="rowgroup"><aside></aside> <div role="row"></div> <div><!> <!> <!></div></div> <!></section>');function Ml(e,t,r){return hn(yf,{target:e,props:{plugins:t,options:r}})}function Ll(e){return zn(e)}var Pl=`/*!
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
/*$vite$:1*/`;var rD=Pl,$u=600;function Fl(e,t){return t&&e>0&&e<$u?"listMonth":"dayGridMonth"}function zl(e,t=!1){let{head:r,row:n,foot:i}=t?Fi.compact:Fi.comfortable;return`calc(${r}em + ${e} * ${n}em + ${i}em)`}function yu(e,t,r,n,i,s=!1){let{head:a,row:l,foot:c}=i?Fi.compact:Fi.comfortable,p=bu(e),v=[];for(let h of wu(t,r)){let u=Math.max(0,...h.map(g=>p.get(g)??0));if(u===0){v.push(`${a}em`);continue}let d=u<=n?`calc(${a}em + ${u} * ${l}em)`:`calc(${a}em + ${n} * ${l}em + ${c}em)`;v.push(s?`minmax(${a}em, 1fr)`:d)}return`max-content ${v.join(" ")}`}function bu(e){let t=new Map;for(let r of e){if(!r.startDate)continue;let n=jn(r.startDate),i=r.endDate?jn(r.endDate):n;for(let s of xu(n,i))t.set(s,(t.get(s)??0)+1)}return t}function wu(e,t){let r=[],n=new Date(e.getFullYear(),e.getMonth(),e.getDate());for(;n<t&&r.length<10;){let i=[];for(let s=0;s<7;s++)i.push(Xn(n)),n.setDate(n.getDate()+1);r.push(i)}return r}function xu(e,t){let r=[e];if(t<=e)return r;let n=new Date(`${e}T00:00:00`),i=new Date(`${t}T00:00:00`);for(;r.length<400&&(n.setDate(n.getDate()+1),!(n>i));)r.push(Xn(n));return r}function Eu(e=!1){return`minmax(${zl(1,e)}, 1fr)`}var Fi={comfortable:{head:2.4,row:1.6,foot:1.8},compact:{head:1.25,row:1.2,foot:.95}};function jn(e){return e.slice(0,10)}function Xn(e){let t=String(e.getFullYear()).padStart(4,"0"),r=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${t}-${r}-${n}`}function Ul(e,t){let r;for(let n of e){if(!n.startDate)continue;let i=jn(n.startDate);(n.endDate?jn(n.endDate):i)<t||(r===void 0||i<r)&&(r=i)}return r}function ku(e){let t;for(let r of e){if(!r.startDate)continue;let n=jn(r.startDate);(t===void 0||n>t)&&(t=n)}return t}function Tu(e,t,r){if(t.kind==="today")return;if(t.kind==="date")return t.date;let n=Xn(r);return Ul(e,n)??ku(e)}function Hl(e,t){if(e)return t==="UTC"&&!Kn(e)?`${e}Z`:e}function Cu(e){return e.flatMap(t=>{let r=Hl(t.startDate,t.timezone);if(!r)return[];let n=Kn(t.startDate),i=(n&&t.endDate?Hi(t.endDate,1):Hl(t.endDate,t.timezone))??r;return[{title:t.name,start:r,end:i,allDay:n,extendedProps:{previewEvent:t}}]})}function Du(e){let t=e==="es"?"es-ES":"en-US",r=Bl[e];return{locale:t,firstDay:e==="es"?1:0,buttonText:{prev:r.prev,next:r.next,today:r.today,close:r.close},titleFormat:n=>Su(new Intl.DateTimeFormat(t,{month:"long",year:"numeric"}).format(n)),dayHeaderFormat:{weekday:"short"},dayHeaderAriaLabelFormat:{weekday:"long"},eventTimeFormat:{hour:"numeric",minute:"2-digit"},moreLinkContent:n=>r.moreLink(n.num),noEventsContent:()=>r.noEvents}}var Bl={en:{prev:"Previous month",next:"Next month",today:"Today",close:"Close",nextEvent:"Next event",moreLink:e=>`+${e} more`,noEvents:"No events this month"},es:{prev:"Mes anterior",next:"Mes siguiente",today:"Hoy",close:"Cerrar",nextEvent:"Pr\xF3ximo evento",moreLink:e=>`+${e} m\xE1s`,noEvents:"No hay eventos este mes"}};function Su(e){return e.charAt(0).toLocaleUpperCase()+e.slice(1)}function nD(e,t,r){let{lang:n,maxPerDay:i,responsive:s,bounded:a,compact:l,fillsHeight:c}=r,p=r.now??new Date,v=Bl[n],h=Tu(t,r.initialDate,p),u=Ul(t,Xn(p));l?e.setAttribute("data-density","compact"):e.removeAttribute("data-density"),i==="off"?(e.removeAttribute("data-day-rows"),e.style.removeProperty("--ote-calendar-row-height")):(e.setAttribute("data-day-rows",String(i)),e.style.setProperty("--ote-calendar-row-height",a?Eu(l):zl(i,l)));let d=(y,w)=>{if(i==="off"){e.removeAttribute("data-week-rows"),e.style.removeProperty("--ote-calendar-week-rows");return}e.setAttribute("data-week-rows",""),e.style.setProperty("--ote-calendar-week-rows",yu(t,y,w,i,l,c))},g=Fl(e.clientWidth,s),$=Ml(e,[Sl,Rl],{...Du(n),view:g,...h?{date:h}:{},events:Cu(t),height:"100%",dayMaxEvents:i!=="off",datesSet(y){if(y.view.type==="list"){e.removeAttribute("data-week-rows");return}d(y.start,y.end)},...u?{customButtons:{nextEvent:{text:v.nextEvent,click(){$.setOption("date",u)}}}}:{},headerToolbar:{start:"title",center:"",end:`${u?"nextEvent ":""}today prev,next`},eventClick(y){let w=y.event.extendedProps.previewEvent;w&&r.onEventClick(w)}}),m;return s&&typeof ResizeObserver<"u"&&(m=new ResizeObserver(y=>{let w=y[0]?.contentRect.width??e.clientWidth,k=Fl(w,s);k!==g&&(g=k,$.setOption("view",k))}),m.observe(e)),{currentDate(){let y=$.getOption("date");return y instanceof Date?Xn(y):typeof y=="string"?y:void 0},destroy(){m?.disconnect(),Ll($)}}}export{rD as CALENDAR_CSS,Fi as CALENDAR_DENSITY,$u as CALENDAR_LIST_BREAKPOINT,Eu as boundedRowHeight,Du as calendarLocaleOptions,Fl as calendarViewForWidth,zl as dayRowHeight,Ul as nextEventDate,nD as renderCalendar,Tu as resolveCalendarDate,Xn as toISODate,yu as weekRowTracks};
/*! Bundled license information:

@event-calendar/core/dist/index.js:
  (*!
   * EventCalendar v5.18.1
   * https://github.com/vkurko/calendar
   *)
*/
//# sourceMappingURL=calendar-layout.js.map
