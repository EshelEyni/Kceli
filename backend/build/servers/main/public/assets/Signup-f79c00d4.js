import{R as J,l as Vt,a as bt,j as G,h as ye,q as mt}from"./index-1ecd1dfb.js";var ce=e=>e.type==="checkbox",ae=e=>e instanceof Date,O=e=>e==null;const st=e=>typeof e=="object";var S=e=>!O(e)&&!Array.isArray(e)&&st(e)&&!ae(e),At=e=>S(e)&&e.target?ce(e.target)?e.target.checked:e.target.value:e,_t=e=>e.substring(0,e.search(/\.\d+(\.|$)/))||e,wt=(e,i)=>e.has(_t(i)),xt=e=>{const i=e.constructor&&e.constructor.prototype;return S(i)&&i.hasOwnProperty("isPrototypeOf")},Te=typeof window<"u"&&typeof window.HTMLElement<"u"&&typeof document<"u";function Z(e){let i;const s=Array.isArray(e);if(e instanceof Date)i=new Date(e);else if(e instanceof Set)i=new Set(e);else if(!(Te&&(e instanceof Blob||e instanceof FileList))&&(s||S(e)))if(i=s?[]:{},!s&&!xt(e))i=e;else for(const r in e)e.hasOwnProperty(r)&&(i[r]=Z(e[r]));else return e;return i}var de=e=>Array.isArray(e)?e.filter(Boolean):[],D=e=>e===void 0,f=(e,i,s)=>{if(!i||!S(e))return s;const r=de(i.split(/[,[\].]+?/)).reduce((u,l)=>O(u)?u:u[l],e);return D(r)||r===e?D(e[i])?s:e[i]:r},ee=e=>typeof e=="boolean";const Ke={BLUR:"blur",FOCUS_OUT:"focusout",CHANGE:"change"},U={onBlur:"onBlur",onChange:"onChange",onSubmit:"onSubmit",onTouched:"onTouched",all:"all"},H={max:"max",min:"min",maxLength:"maxLength",minLength:"minLength",pattern:"pattern",required:"required",validate:"validate"};J.createContext(null);var Ft=(e,i,s,r=!0)=>{const u={defaultValues:i._defaultValues};for(const l in e)Object.defineProperty(u,l,{get:()=>{const d=l;return i._proxyFormState[d]!==U.all&&(i._proxyFormState[d]=!r||U.all),s&&(s[d]=!0),e[d]}});return u},N=e=>S(e)&&!Object.keys(e).length,pt=(e,i,s,r)=>{s(e);const{name:u,...l}=e;return N(l)||Object.keys(l).length>=Object.keys(i).length||Object.keys(l).find(d=>i[d]===(!r||U.all))},De=e=>Array.isArray(e)?e:[e];function Dt(e){const i=J.useRef(e);i.current=e,J.useEffect(()=>{const s=!e.disabled&&i.current.subject&&i.current.subject.subscribe({next:i.current.next});return()=>{s&&s.unsubscribe()}},[e.disabled])}var $=e=>typeof e=="string",St=(e,i,s,r,u)=>$(e)?(r&&i.watch.add(e),f(s,e,u)):Array.isArray(e)?e.map(l=>(r&&i.watch.add(l),f(s,l))):(r&&(i.watchAll=!0),s),Ne=e=>/^\w*$/.test(e),it=e=>de(e.replace(/["|']|\]/g,"").split(/\.|\[/));function _(e,i,s){let r=-1;const u=Ne(i)?[i]:it(i),l=u.length,d=l-1;for(;++r<l;){const A=u[r];let b=s;if(r!==d){const L=e[A];b=S(L)||Array.isArray(L)?L:isNaN(+u[r+1])?{}:[]}e[A]=b,e=e[A]}return e}var kt=(e,i,s,r,u)=>i?{...s[e],types:{...s[e]&&s[e].types?s[e].types:{},[r]:u||!0}}:{};const Ce=(e,i,s)=>{for(const r of s||Object.keys(e)){const u=f(e,r);if(u){const{_f:l,...d}=u;if(l&&i(l.name)){if(l.ref.focus){l.ref.focus();break}else if(l.refs&&l.refs[0].focus){l.refs[0].focus();break}}else S(d)&&Ce(d,i)}}};var Ge=e=>({isOnSubmit:!e||e===U.onSubmit,isOnBlur:e===U.onBlur,isOnChange:e===U.onChange,isOnAll:e===U.all,isOnTouch:e===U.onTouched}),Je=(e,i,s)=>!s&&(i.watchAll||i.watch.has(e)||[...i.watch].some(r=>e.startsWith(r)&&/^\.\w+/.test(e.slice(r.length)))),Et=(e,i,s)=>{const r=de(f(e,s));return _(r,"root",i[s]),_(e,s,r),e},Re=e=>e.type==="file",Q=e=>typeof e=="function",ve=e=>{if(!Te)return!1;const i=e?e.ownerDocument:0;return e instanceof(i&&i.defaultView?i.defaultView.HTMLElement:HTMLElement)},ge=e=>$(e),Pe=e=>e.type==="radio",Ve=e=>e instanceof RegExp;const Qe={value:!1,isValid:!1},Xe={value:!0,isValid:!0};var at=e=>{if(Array.isArray(e)){if(e.length>1){const i=e.filter(s=>s&&s.checked&&!s.disabled).map(s=>s.value);return{value:i,isValid:!!i.length}}return e[0].checked&&!e[0].disabled?e[0].attributes&&!D(e[0].attributes.value)?D(e[0].value)||e[0].value===""?Xe:{value:e[0].value,isValid:!0}:Xe:Qe}return Qe};const Ye={isValid:!1,value:null};var nt=e=>Array.isArray(e)?e.reduce((i,s)=>s&&s.checked&&!s.disabled?{isValid:!0,value:s.value}:i,Ye):Ye;function et(e,i,s="validate"){if(ge(e)||Array.isArray(e)&&e.every(ge)||ee(e)&&!e)return{type:s,message:ge(e)?e:"",ref:i}}var ie=e=>S(e)&&!Ve(e)?e:{value:e,message:""},tt=async(e,i,s,r,u)=>{const{ref:l,refs:d,required:A,maxLength:b,minLength:L,min:j,max:p,pattern:h,validate:R,name:M,valueAsNumber:K,mount:fe,disabled:Ae}=e._f,v=f(i,M);if(!fe||Ae)return{};const P=d?d[0]:l,I=m=>{r&&P.reportValidity&&(P.setCustomValidity(ee(m)?"":m||""),P.reportValidity())},k={},ne=Pe(l),re=ce(l),_e=ne||re,q=(K||Re(l))&&D(l.value)&&D(v)||ve(l)&&l.value===""||v===""||Array.isArray(v)&&!v.length,X=kt.bind(null,M,s,k),W=(m,V,x,C=H.maxLength,T=H.minLength)=>{const B=m?V:x;k[M]={type:m?C:T,message:B,ref:l,...X(m?C:T,B)}};if(u?!Array.isArray(v)||!v.length:A&&(!_e&&(q||O(v))||ee(v)&&!v||re&&!at(d).isValid||ne&&!nt(d).isValid)){const{value:m,message:V}=ge(A)?{value:!!A,message:A}:ie(A);if(m&&(k[M]={type:H.required,message:V,ref:P,...X(H.required,V)},!s))return I(V),k}if(!q&&(!O(j)||!O(p))){let m,V;const x=ie(p),C=ie(j);if(!O(v)&&!isNaN(v)){const T=l.valueAsNumber||v&&+v;O(x.value)||(m=T>x.value),O(C.value)||(V=T<C.value)}else{const T=l.valueAsDate||new Date(v),B=ue=>new Date(new Date().toDateString()+" "+ue),Y=l.type=="time",le=l.type=="week";$(x.value)&&v&&(m=Y?B(v)>B(x.value):le?v>x.value:T>new Date(x.value)),$(C.value)&&v&&(V=Y?B(v)<B(C.value):le?v<C.value:T<new Date(C.value))}if((m||V)&&(W(!!m,x.message,C.message,H.max,H.min),!s))return I(k[M].message),k}if((b||L)&&!q&&($(v)||u&&Array.isArray(v))){const m=ie(b),V=ie(L),x=!O(m.value)&&v.length>+m.value,C=!O(V.value)&&v.length<+V.value;if((x||C)&&(W(x,m.message,V.message),!s))return I(k[M].message),k}if(h&&!q&&$(v)){const{value:m,message:V}=ie(h);if(Ve(m)&&!v.match(m)&&(k[M]={type:H.pattern,message:V,ref:l,...X(H.pattern,V)},!s))return I(V),k}if(R){if(Q(R)){const m=await R(v,i),V=et(m,P);if(V&&(k[M]={...V,...X(H.validate,V.message)},!s))return I(V.message),k}else if(S(R)){let m={};for(const V in R){if(!N(m)&&!s)break;const x=et(await R[V](v,i),P,V);x&&(m={...x,...X(V,x.message)},I(x.message),s&&(k[M]=m))}if(!N(m)&&(k[M]={ref:P,...m},!s))return k}}return I(!0),k};function Lt(e,i){const s=i.slice(0,-1).length;let r=0;for(;r<s;)e=D(e)?r++:e[i[r++]];return e}function Mt(e){for(const i in e)if(e.hasOwnProperty(i)&&!D(e[i]))return!1;return!0}function E(e,i){const s=Array.isArray(i)?i:Ne(i)?[i]:it(i),r=s.length===1?e:Lt(e,s),u=s.length-1,l=s[u];return r&&delete r[l],u!==0&&(S(r)&&N(r)||Array.isArray(r)&&Mt(r))&&E(e,s.slice(0,-1)),e}function Se(){let e=[];return{get observers(){return e},next:u=>{for(const l of e)l.next&&l.next(u)},subscribe:u=>(e.push(u),{unsubscribe:()=>{e=e.filter(l=>l!==u)}}),unsubscribe:()=>{e=[]}}}var be=e=>O(e)||!st(e);function te(e,i){if(be(e)||be(i))return e===i;if(ae(e)&&ae(i))return e.getTime()===i.getTime();const s=Object.keys(e),r=Object.keys(i);if(s.length!==r.length)return!1;for(const u of s){const l=e[u];if(!r.includes(u))return!1;if(u!=="ref"){const d=i[u];if(ae(l)&&ae(d)||S(l)&&S(d)||Array.isArray(l)&&Array.isArray(d)?!te(l,d):l!==d)return!1}}return!0}var lt=e=>e.type==="select-multiple",Ot=e=>Pe(e)||ce(e),ke=e=>ve(e)&&e.isConnected,ut=e=>{for(const i in e)if(Q(e[i]))return!0;return!1};function me(e,i={}){const s=Array.isArray(e);if(S(e)||s)for(const r in e)Array.isArray(e[r])||S(e[r])&&!ut(e[r])?(i[r]=Array.isArray(e[r])?[]:{},me(e[r],i[r])):O(e[r])||(i[r]=!0);return i}function ot(e,i,s){const r=Array.isArray(e);if(S(e)||r)for(const u in e)Array.isArray(e[u])||S(e[u])&&!ut(e[u])?D(i)||be(s[u])?s[u]=Array.isArray(e[u])?me(e[u],[]):{...me(e[u])}:ot(e[u],O(i)?{}:i[u],s[u]):s[u]=!te(e[u],i[u]);return s}var Ee=(e,i)=>ot(e,i,me(i)),ct=(e,{valueAsNumber:i,valueAsDate:s,setValueAs:r})=>D(e)?e:i?e===""?NaN:e&&+e:s&&$(e)?new Date(e):r?r(e):e;function Le(e){const i=e.ref;if(!(e.refs?e.refs.every(s=>s.disabled):i.disabled))return Re(i)?i.files:Pe(i)?nt(e.refs).value:lt(i)?[...i.selectedOptions].map(({value:s})=>s):ce(i)?at(e.refs).value:ct(D(i.value)?e.ref.value:i.value,e)}var Ct=(e,i,s,r)=>{const u={};for(const l of e){const d=f(i,l);d&&_(u,l,d._f)}return{criteriaMode:s,names:[...e],fields:u,shouldUseNativeValidation:r}},oe=e=>D(e)?e:Ve(e)?e.source:S(e)?Ve(e.value)?e.value.source:e.value:e,Tt=e=>e.mount&&(e.required||e.min||e.max||e.maxLength||e.minLength||e.pattern||e.validate);function rt(e,i,s){const r=f(e,s);if(r||Ne(s))return{error:r,name:s};const u=s.split(".");for(;u.length;){const l=u.join("."),d=f(i,l),A=f(e,l);if(d&&!Array.isArray(d)&&s!==l)return{name:s};if(A&&A.type)return{name:l,error:A};u.pop()}return{name:s}}var Nt=(e,i,s,r,u)=>u.isOnAll?!1:!s&&u.isOnTouch?!(i||e):(s?r.isOnBlur:u.isOnBlur)?!e:(s?r.isOnChange:u.isOnChange)?e:!0,Rt=(e,i)=>!de(f(e,i)).length&&E(e,i);const Pt={mode:U.onSubmit,reValidateMode:U.onChange,shouldFocusError:!0};function Ut(e={},i){let s={...Pt,...e},r={submitCount:0,isDirty:!1,isLoading:Q(s.defaultValues),isValidating:!1,isSubmitted:!1,isSubmitting:!1,isSubmitSuccessful:!1,isValid:!1,touchedFields:{},dirtyFields:{},errors:{}},u={},l=S(s.defaultValues)||S(s.values)?Z(s.defaultValues||s.values)||{}:{},d=s.shouldUnregister?{}:Z(l),A={action:!1,mount:!1,watch:!1},b={mount:new Set,unMount:new Set,array:new Set,watch:new Set},L,j=0;const p={isDirty:!1,dirtyFields:!1,touchedFields:!1,isValidating:!1,isValid:!1,errors:!1},h={values:Se(),array:Se(),state:Se()},R=e.resetOptions&&e.resetOptions.keepDirtyValues,M=Ge(s.mode),K=Ge(s.reValidateMode),fe=s.criteriaMode===U.all,Ae=t=>a=>{clearTimeout(j),j=setTimeout(t,a)},v=async t=>{if(p.isValid||t){const a=s.resolver?N((await q()).errors):await W(u,!0);a!==r.isValid&&h.state.next({isValid:a})}},P=t=>p.isValidating&&h.state.next({isValidating:t}),I=(t,a=[],n,y,c=!0,o=!0)=>{if(y&&n){if(A.action=!0,o&&Array.isArray(f(u,t))){const g=n(f(u,t),y.argA,y.argB);c&&_(u,t,g)}if(o&&Array.isArray(f(r.errors,t))){const g=n(f(r.errors,t),y.argA,y.argB);c&&_(r.errors,t,g),Rt(r.errors,t)}if(p.touchedFields&&o&&Array.isArray(f(r.touchedFields,t))){const g=n(f(r.touchedFields,t),y.argA,y.argB);c&&_(r.touchedFields,t,g)}p.dirtyFields&&(r.dirtyFields=Ee(l,d)),h.state.next({name:t,isDirty:V(t,a),dirtyFields:r.dirtyFields,errors:r.errors,isValid:r.isValid})}else _(d,t,a)},k=(t,a)=>{_(r.errors,t,a),h.state.next({errors:r.errors})},ne=(t,a,n,y)=>{const c=f(u,t);if(c){const o=f(d,t,D(n)?f(l,t):n);D(o)||y&&y.defaultChecked||a?_(d,t,a?o:Le(c._f)):T(t,o),A.mount&&v()}},re=(t,a,n,y,c)=>{let o=!1,g=!1;const w={name:t};if(!n||y){p.isDirty&&(g=r.isDirty,r.isDirty=w.isDirty=V(),o=g!==w.isDirty);const F=te(f(l,t),a);g=f(r.dirtyFields,t),F?E(r.dirtyFields,t):_(r.dirtyFields,t,!0),w.dirtyFields=r.dirtyFields,o=o||p.dirtyFields&&g!==!F}if(n){const F=f(r.touchedFields,t);F||(_(r.touchedFields,t,n),w.touchedFields=r.touchedFields,o=o||p.touchedFields&&F!==n)}return o&&c&&h.state.next(w),o?w:{}},_e=(t,a,n,y)=>{const c=f(r.errors,t),o=p.isValid&&ee(a)&&r.isValid!==a;if(e.delayError&&n?(L=Ae(()=>k(t,n)),L(e.delayError)):(clearTimeout(j),L=null,n?_(r.errors,t,n):E(r.errors,t)),(n?!te(c,n):c)||!N(y)||o){const g={...y,...o&&ee(a)?{isValid:a}:{},errors:r.errors,name:t};r={...r,...g},h.state.next(g)}P(!1)},q=async t=>s.resolver(d,s.context,Ct(t||b.mount,u,s.criteriaMode,s.shouldUseNativeValidation)),X=async t=>{const{errors:a}=await q(t);if(t)for(const n of t){const y=f(a,n);y?_(r.errors,n,y):E(r.errors,n)}else r.errors=a;return a},W=async(t,a,n={valid:!0})=>{for(const y in t){const c=t[y];if(c){const{_f:o,...g}=c;if(o){const w=b.array.has(o.name),F=await tt(c,d,fe,s.shouldUseNativeValidation&&!a,w);if(F[o.name]&&(n.valid=!1,a))break;!a&&(f(F,o.name)?w?Et(r.errors,F,o.name):_(r.errors,o.name,F[o.name]):E(r.errors,o.name))}g&&await W(g,a,n)}}return n.valid},m=()=>{for(const t of b.unMount){const a=f(u,t);a&&(a._f.refs?a._f.refs.every(n=>!ke(n)):!ke(a._f.ref))&&we(t)}b.unMount=new Set},V=(t,a)=>(t&&a&&_(d,t,a),!te(Ue(),l)),x=(t,a,n)=>St(t,b,{...A.mount?d:D(a)?l:$(t)?{[t]:a}:a},n,a),C=t=>de(f(A.mount?d:l,t,e.shouldUnregister?f(l,t,[]):[])),T=(t,a,n={})=>{const y=f(u,t);let c=a;if(y){const o=y._f;o&&(!o.disabled&&_(d,t,ct(a,o)),c=ve(o.ref)&&O(a)?"":a,lt(o.ref)?[...o.ref.options].forEach(g=>g.selected=c.includes(g.value)):o.refs?ce(o.ref)?o.refs.length>1?o.refs.forEach(g=>(!g.defaultChecked||!g.disabled)&&(g.checked=Array.isArray(c)?!!c.find(w=>w===g.value):c===g.value)):o.refs[0]&&(o.refs[0].checked=!!c):o.refs.forEach(g=>g.checked=g.value===c):Re(o.ref)?o.ref.value="":(o.ref.value=c,o.ref.type||h.values.next({name:t,values:{...d}})))}(n.shouldDirty||n.shouldTouch)&&re(t,c,n.shouldTouch,n.shouldDirty,!0),n.shouldValidate&&ue(t)},B=(t,a,n)=>{for(const y in a){const c=a[y],o=`${t}.${y}`,g=f(u,o);(b.array.has(t)||!be(c)||g&&!g._f)&&!ae(c)?B(o,c,n):T(o,c,n)}},Y=(t,a,n={})=>{const y=f(u,t),c=b.array.has(t),o=Z(a);_(d,t,o),c?(h.array.next({name:t,values:{...d}}),(p.isDirty||p.dirtyFields)&&n.shouldDirty&&h.state.next({name:t,dirtyFields:Ee(l,d),isDirty:V(t,o)})):y&&!y._f&&!O(o)?B(t,o,n):T(t,o,n),Je(t,b)&&h.state.next({...r}),h.values.next({name:t,values:{...d}}),!A.mount&&i()},le=async t=>{const a=t.target;let n=a.name,y=!0;const c=f(u,n),o=()=>a.type?Le(c._f):At(t);if(c){let g,w;const F=o(),se=t.type===Ke.BLUR||t.type===Ke.FOCUS_OUT,ht=!Tt(c._f)&&!s.resolver&&!f(r.errors,n)&&!c._f.deps||Nt(se,f(r.touchedFields,n),r.isSubmitted,K,M),Fe=Je(n,b,se);_(d,n,F),se?(c._f.onBlur&&c._f.onBlur(t),L&&L(0)):c._f.onChange&&c._f.onChange(t);const pe=re(n,F,se,!1),gt=!N(pe)||Fe;if(!se&&h.values.next({name:n,type:t.type,values:{...d}}),ht)return p.isValid&&v(),gt&&h.state.next({name:n,...Fe?{}:pe});if(!se&&Fe&&h.state.next({...r}),P(!0),s.resolver){const{errors:Ze}=await q([n]),vt=rt(r.errors,u,n),je=rt(Ze,u,vt.name||n);g=je.error,n=je.name,w=N(Ze)}else g=(await tt(c,d,fe,s.shouldUseNativeValidation))[n],y=Number.isNaN(F)||F===f(d,n,F),y&&(g?w=!1:p.isValid&&(w=await W(u,!0)));y&&(c._f.deps&&ue(c._f.deps),_e(n,w,g,pe))}},ue=async(t,a={})=>{let n,y;const c=De(t);if(P(!0),s.resolver){const o=await X(D(t)?t:c);n=N(o),y=t?!c.some(g=>f(o,g)):n}else t?(y=(await Promise.all(c.map(async o=>{const g=f(u,o);return await W(g&&g._f?{[o]:g}:g)}))).every(Boolean),!(!y&&!r.isValid)&&v()):y=n=await W(u);return h.state.next({...!$(t)||p.isValid&&n!==r.isValid?{}:{name:t},...s.resolver||!t?{isValid:n}:{},errors:r.errors,isValidating:!1}),a.shouldFocus&&!y&&Ce(u,o=>o&&f(r.errors,o),t?c:b.mount),y},Ue=t=>{const a={...l,...A.mount?d:{}};return D(t)?a:$(t)?f(a,t):t.map(n=>f(a,n))},qe=(t,a)=>({invalid:!!f((a||r).errors,t),isDirty:!!f((a||r).dirtyFields,t),isTouched:!!f((a||r).touchedFields,t),error:f((a||r).errors,t)}),dt=t=>{t&&De(t).forEach(a=>E(r.errors,a)),h.state.next({errors:t?r.errors:{}})},Be=(t,a,n)=>{const y=(f(u,t,{_f:{}})._f||{}).ref;_(r.errors,t,{...a,ref:y}),h.state.next({name:t,errors:r.errors,isValid:!1}),n&&n.shouldFocus&&y&&y.focus&&y.focus()},ft=(t,a)=>Q(t)?h.values.subscribe({next:n=>t(x(void 0,a),n)}):x(t,a,!0),we=(t,a={})=>{for(const n of t?De(t):b.mount)b.mount.delete(n),b.array.delete(n),a.keepValue||(E(u,n),E(d,n)),!a.keepError&&E(r.errors,n),!a.keepDirty&&E(r.dirtyFields,n),!a.keepTouched&&E(r.touchedFields,n),!s.shouldUnregister&&!a.keepDefaultValue&&E(l,n);h.values.next({values:{...d}}),h.state.next({...r,...a.keepDirty?{isDirty:V()}:{}}),!a.keepIsValid&&v()},$e=({disabled:t,name:a,field:n,fields:y})=>{if(ee(t)){const c=t?void 0:f(d,a,Le(n?n._f:f(y,a)._f));_(d,a,c),re(a,c,!1,!1,!0)}},xe=(t,a={})=>{let n=f(u,t);const y=ee(a.disabled);return _(u,t,{...n||{},_f:{...n&&n._f?n._f:{ref:{name:t}},name:t,mount:!0,...a}}),b.mount.add(t),n?$e({field:n,disabled:a.disabled,name:t}):ne(t,!0,a.value),{...y?{disabled:a.disabled}:{},...s.progressive?{required:!!a.required,min:oe(a.min),max:oe(a.max),minLength:oe(a.minLength),maxLength:oe(a.maxLength),pattern:oe(a.pattern)}:{},name:t,onChange:le,onBlur:le,ref:c=>{if(c){xe(t,a),n=f(u,t);const o=D(c.value)&&c.querySelectorAll&&c.querySelectorAll("input,select,textarea")[0]||c,g=Ot(o),w=n._f.refs||[];if(g?w.find(F=>F===o):o===n._f.ref)return;_(u,t,{_f:{...n._f,...g?{refs:[...w.filter(ke),o,...Array.isArray(f(l,t))?[{}]:[]],ref:{type:o.type,name:t}}:{ref:o}}}),ne(t,!1,void 0,o)}else n=f(u,t,{}),n._f&&(n._f.mount=!1),(s.shouldUnregister||a.shouldUnregister)&&!(wt(b.array,t)&&A.action)&&b.unMount.add(t)}}},Ie=()=>s.shouldFocusError&&Ce(u,t=>t&&f(r.errors,t),b.mount),We=(t,a)=>async n=>{n&&(n.preventDefault&&n.preventDefault(),n.persist&&n.persist());let y=Z(d);if(h.state.next({isSubmitting:!0}),s.resolver){const{errors:c,values:o}=await q();r.errors=c,y=o}else await W(u);E(r.errors,"root"),N(r.errors)?(h.state.next({errors:{}}),await t(y,n)):(a&&await a({...r.errors},n),Ie(),setTimeout(Ie)),h.state.next({isSubmitted:!0,isSubmitting:!1,isSubmitSuccessful:N(r.errors),submitCount:r.submitCount+1,errors:r.errors})},yt=(t,a={})=>{f(u,t)&&(D(a.defaultValue)?Y(t,f(l,t)):(Y(t,a.defaultValue),_(l,t,a.defaultValue)),a.keepTouched||E(r.touchedFields,t),a.keepDirty||(E(r.dirtyFields,t),r.isDirty=a.defaultValue?V(t,f(l,t)):V()),a.keepError||(E(r.errors,t),p.isValid&&v()),h.state.next({...r}))},He=(t,a={})=>{const n=t?Z(t):l,y=Z(n),c=t&&!N(t)?y:l;if(a.keepDefaultValues||(l=n),!a.keepValues){if(a.keepDirtyValues||R)for(const o of b.mount)f(r.dirtyFields,o)?_(c,o,f(d,o)):Y(o,f(c,o));else{if(Te&&D(t))for(const o of b.mount){const g=f(u,o);if(g&&g._f){const w=Array.isArray(g._f.refs)?g._f.refs[0]:g._f.ref;if(ve(w)){const F=w.closest("form");if(F){F.reset();break}}}}u={}}d=e.shouldUnregister?a.keepDefaultValues?Z(l):{}:Z(c),h.array.next({values:{...c}}),h.values.next({values:{...c}})}b={mount:new Set,unMount:new Set,array:new Set,watch:new Set,watchAll:!1,focus:""},!A.mount&&i(),A.mount=!p.isValid||!!a.keepIsValid,A.watch=!!e.shouldUnregister,h.state.next({submitCount:a.keepSubmitCount?r.submitCount:0,isDirty:a.keepDirty?r.isDirty:!!(a.keepDefaultValues&&!te(t,l)),isSubmitted:a.keepIsSubmitted?r.isSubmitted:!1,dirtyFields:a.keepDirtyValues?r.dirtyFields:a.keepDefaultValues&&t?Ee(l,t):{},touchedFields:a.keepTouched?r.touchedFields:{},errors:a.keepErrors?r.errors:{},isSubmitting:!1,isSubmitSuccessful:!1})},ze=(t,a)=>He(Q(t)?t(d):t,a);return{control:{register:xe,unregister:we,getFieldState:qe,handleSubmit:We,setError:Be,_executeSchema:q,_getWatch:x,_getDirty:V,_updateValid:v,_removeUnmounted:m,_updateFieldArray:I,_updateDisabledField:$e,_getFieldArray:C,_reset:He,_resetDefaultValues:()=>Q(s.defaultValues)&&s.defaultValues().then(t=>{ze(t,s.resetOptions),h.state.next({isLoading:!1})}),_updateFormState:t=>{r={...r,...t}},_subjects:h,_proxyFormState:p,get _fields(){return u},get _formValues(){return d},get _state(){return A},set _state(t){A=t},get _defaultValues(){return l},get _names(){return b},set _names(t){b=t},get _formState(){return r},set _formState(t){r=t},get _options(){return s},set _options(t){s={...s,...t}}},trigger:ue,register:xe,handleSubmit:We,watch:ft,setValue:Y,getValues:Ue,reset:ze,resetField:yt,clearErrors:dt,unregister:we,setError:Be,setFocus:(t,a={})=>{const n=f(u,t),y=n&&n._f;if(y){const c=y.refs?y.refs[0]:y.ref;c.focus&&(c.focus(),a.shouldSelect&&c.select())}},getFieldState:qe}}function qt(e={}){const i=J.useRef(),s=J.useRef(),[r,u]=J.useState({isDirty:!1,isValidating:!1,isLoading:Q(e.defaultValues),isSubmitted:!1,isSubmitting:!1,isSubmitSuccessful:!1,isValid:!1,submitCount:0,dirtyFields:{},touchedFields:{},errors:{},defaultValues:Q(e.defaultValues)?void 0:e.defaultValues});i.current||(i.current={...Ut(e,()=>u(d=>({...d}))),formState:r});const l=i.current.control;return l._options=e,Dt({subject:l._subjects.state,next:d=>{pt(d,l._proxyFormState,l._updateFormState,!0)&&u({...l._formState})}}),J.useEffect(()=>{e.values&&!te(e.values,s.current)?(l._reset(e.values,l._options.resetOptions),s.current=e.values):l._resetDefaultValues()},[e.values,l]),J.useEffect(()=>{l._state.mount||(l._updateValid(),l._state.mount=!0),l._state.watch&&(l._state.watch=!1,l._subjects.state.next({...l._formState})),l._removeUnmounted()}),i.current.formState=Ft(r,l),i.current}const Bt={value:/^[a-zA-Z0-9]+$/,message:"Must contain only letters and numbers"},$t={value:/^[a-zA-Z0-9 ]+$/,message:"Must contain only letters, numbers and spaces"},It={value:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,message:"Must be a valid email"};function Wt(e){return`Please enter ${e}`}function Ht(e){return{value:e,message:`Must be at least ${e} characters`}}function zt(e){return{value:e,message:`Must be at most ${e} characters`}}const Zt={lettersAndNumberPattern:Bt,lettersAndNumberPatternWithSpace:$t,emailPattern:It,createRequiredValidationMsg:Wt,createMinLengthValidation:Ht,createMaxLengthValidation:zt},{lettersAndNumberPattern:Me,lettersAndNumberPatternWithSpace:jt,emailPattern:Kt,createRequiredValidationMsg:z,createMinLengthValidation:he,createMaxLengthValidation:Oe}=Zt,Yt=()=>{const e=Vt(),i=bt(),{register:s,handleSubmit:r,setError:u,trigger:l,formState:{errors:d,isDirty:A,touchedFields:b}}=qt(),L=async h=>{await l(h)},j=[{id:"username",type:"text",validation:{required:z("username"),minLength:he(3),maxLength:Oe(20),pattern:Me},defaultValue:"eshel2"},{id:"fullname",type:"text",validation:{required:z("fullname"),minLength:he(3),pattern:jt},defaultValue:"eshel eyni"},{id:"email",type:"text",validation:{required:z("email"),pattern:Kt},defaultValue:"eshel2@email.com"},{id:"password",type:"password",validation:{required:z("password"),minLength:he(6),maxLength:Oe(20),pattern:Me},defaultValue:"eshel123"},{id:"passwordConfirm",type:"password",validation:{required:z("passwordConfirm"),minLength:he(6),maxLength:Oe(20),pattern:Me},defaultValue:"eshel123"},{id:"weight",type:"number",validation:{required:z("weight")},defaultValue:"120"},{id:"height",type:"number",validation:{required:z("height")},defaultValue:"182"},{id:"gender",type:"radio",validation:{required:z("gender")},options:["male","female"],defaultValue:"male"},{id:"birthdate",type:"date",validation:{required:z("birthdate")},defaultValue:"1992-01-09"}];return G("section",{className:"signup-page",children:ye("form",{onSubmit:r(async h=>{if(h.password!==h.passwordConfirm){u("passwordConfirm",{type:"manual",message:"Passwords do not match"});return}await i(mt(h)),e("/home")}),children:[G("h1",{children:"Signup"}),j.map(h=>{var R,M;return ye("div",{children:[G("label",{htmlFor:h.id,children:ye("fieldset",{children:[G("legend",{children:h.id}),h.type==="radio"?(R=h.options)==null?void 0:R.map(K=>ye("label",{children:[G("input",{...s(h.id,h.validation),type:h.type,value:K,defaultChecked:h.defaultValue===K,onBlur:()=>L(h.id)}),K]},K)):G("input",{id:h.id,...s(h.id,h.validation),type:h.type,autoComplete:"off",defaultValue:h.defaultValue,onBlur:()=>L(h.id)})]})}),(A||b[h.id])&&d[h.id]&&G("p",{children:(M=d[h.id])==null?void 0:M.message})]},h.id)}),G("button",{type:"submit",children:"Signup"})]})})};export{Yt as default};