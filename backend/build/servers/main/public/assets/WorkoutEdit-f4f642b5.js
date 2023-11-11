import{W as y,m as d,j as e,X as R,l as g,B as S,Y as M,u as H,r as D,Z as P,S as O}from"./index-cfe9248a.js";import{E as $}from"./ErrorMsg-de8c4123.js";import{E as z,D as G,S as X,P as Y}from"./Empty-d8a29991.js";import{S as W,W as Z}from"./WorkoutEditMainInputs-5ef08c69.js";import{F as q}from"./Footer-f4a9b764.js";const x=({item:o})=>{const{setCurrItemId:n}=y();return d("section",{className:"mini-workout-item-preview",onClick:()=>n(o.id),children:[e("span",{children:o.name}),e(R,{className:"mini-workout-item-preview__icon"})]})},J=({item:o})=>{const{workout:n,updateWorkout:i,removeWorkoutItem:_,currItemId:h}=y();function F(w){const v=w.target.value,b=n==null?void 0:n.items.map(f=>f.id!==h?f:{...f,name:v}),C={...n,items:b};i(C)}function N(w){const v=Number(w.target.value),b=n==null?void 0:n.items.map(f=>f.id!==h?f:{...f,durationInMin:v}),C={...n,items:b};i(C)}return h!==o.id?e(x,{item:o}):d("section",{className:"workout-edit__form",children:[d("div",{className:"workout-edit__form__input-container name-input",children:[e("label",{children:"Name:"}),e("input",{autoComplete:"off",defaultValue:o.name,onChange:g(F,500).debouncedFunc})]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"Duration (in min):"}),e("input",{type:"number",defaultValue:o.durationInMin,onChange:g(N,500).debouncedFunc})]}),e("div",{className:"workout-edit__form__input-container__btns-container",children:e(S,{className:"btn",onClickFn:()=>_(o.id),children:"delete"})})]})},K=({item:o})=>{const{removeWorkoutItem:n,workout:i,updateWorkout:_,currItemId:h}=y();function F(){n(o.id)}function N(u){const m=u.target.value,t=i==null?void 0:i.items.map(r=>r.id!==h?r:{...r,name:m}),c={...i,items:t};_(c)}function w(u){const m=Number(u.target.value),t=i==null?void 0:i.items.map(r=>r.id!==h?r:{...r,sets:m}),c={...i,items:t};_(c)}function v(u){const m=Number(u.target.value),t=i==null?void 0:i.items.map(r=>r.id!==h?r:{...r,reps:m}),c={...i,items:t};_(c)}function b(u){const m=Number(u.target.value),t=i==null?void 0:i.items.map(r=>r.id!==h?r:{...r,weight:m}),c={...i,items:t};_(c)}function C(u){const m=i==null?void 0:i.items.map(c=>c.id!==h?c:{...c,weightUnit:u}),t={...i,items:m};_(t)}function f(u){const m=Number(u.target.value),t=i==null?void 0:i.items.map(r=>r.id!==h?r:{...r,restInSec:m}),c={...i,items:t};_(c)}return h!==o.id?e(x,{item:o}):d("section",{className:"workout-edit__form",children:[d("div",{className:"workout-edit__form__input-container name-input",children:[e("label",{children:"Name:"}),e("input",{autoComplete:"off",defaultValue:o.name,onChange:g(N,500).debouncedFunc})]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"Sets:"}),e("input",{type:"number",defaultValue:o.sets,onChange:g(w,500).debouncedFunc})]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"Reps:"}),e("input",{type:"number",defaultValue:o.reps,onChange:g(v,500).debouncedFunc})]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"Weight:"}),e("input",{type:"number",defaultValue:o.weight,onChange:g(b,500).debouncedFunc})]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"Weight unit:"}),d(W,{onChange:C,listHeight:250,children:[e(W.SelectTrigger,{children:d("div",{children:[e("span",{children:o.weightUnit}),e(R,{})]})}),e(W.SelectList,{children:Object.values(M).map(u=>e(W.SelectItem,{value:u,children:u},u))})]})]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"Rest (in sec):"}),e("input",{type:"number",defaultValue:o.restInSec,onChange:g(f,500).debouncedFunc})]}),e("div",{className:"workout-edit__form__input-container__btns-container",children:e(S,{className:"btn",onClickFn:F,children:"delete"})})]})},Q=({item:o})=>{const{workout:n,updateWorkout:i,addWorkoutItemToSuperset:_,removeWorkoutItemFromSuperset:h,removeWorkoutItem:F,currItemId:N}=y();function w(t){const c=t.target.value,r=n==null?void 0:n.items.map(a=>a.id!==N?a:{...a,name:c}),p={...n,items:r};i(p)}function v(t){const c=Number(t.target.value),r=n==null?void 0:n.items.map(a=>a.id!==N?a:{...a,restInSec:c}),p={...n,items:r};i(p)}function b(t){const c=Number(t.target.value),r=n==null?void 0:n.items.map(a=>a.id!==N?a:{...a,sets:c}),p={...n,items:r};i(p)}function C(t){if(!n)return;const c=t.target.value,r=n.items.map(a=>{if(a.id!==o.id)return a;const I=a.items.map(l=>l.id!==t.target.id?l:{...l,name:c});return{...a,items:I}}),p={...n,items:r};i(p)}function f(t){if(!n)return;const c=Number(t.target.value),r=n.items.map(a=>{if(a.id!==o.id)return a;const I=a.items.map(l=>l.id!==t.target.id?l:{...l,reps:c});return{...a,items:I}}),p={...n,items:r};i(p)}function u(t){if(!n)return;const c=Number(t.target.value),r=n.items.map(a=>{if(a.id!==o.id)return a;const I=a.items.map(l=>l.id!==t.target.id?l:{...l,weight:c});return{...a,items:I}}),p={...n,items:r};i(p)}function m({weightUnit:t,supersetItemId:c}){if(!n)return;const r=n.items.map(a=>{if(a.id!==o.id)return a;const I=a.items.map(l=>l.id!==c?l:{...l,weightUnit:t});return{...a,items:I}}),p={...n,items:r};i(p)}return N!==o.id?e(x,{item:o}):d("section",{className:"workout-edit__form superset",children:[d("div",{className:"workout-edit__form__input-container name-input",children:[e("label",{children:"Superset Name:"}),e("input",{autoComplete:"off",defaultValue:o.name,onChange:g(w,500).debouncedFunc})]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"Rest In Sec:"}),e("input",{type:"number",defaultValue:o.restInSec,onChange:g(v,500).debouncedFunc})]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"Sets:"}),e("input",{type:"number",defaultValue:o.sets,onChange:g(b,500).debouncedFunc})]}),e("div",{className:"workout-edit__form__superset-item-list",children:o.items.map((t,c)=>d("div",{className:"workout-edit__form__superset-item-container",children:[d("h3",{children:["Item ",c+1]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"name:"}),e("input",{id:t.id,type:"text",defaultValue:t.name,onChange:g(C,500).debouncedFunc})]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"reps:"}),e("input",{id:t.id,type:"number",defaultValue:t.reps,onChange:g(f,500).debouncedFunc})]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"weight:"}),e("input",{id:t.id,type:"number",defaultValue:t.weight,onChange:g(u,500).debouncedFunc})]}),d("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"weight unit:"}),d(W,{onChange:m,listHeight:250,children:[e(W.SelectTrigger,{children:d("div",{children:[e("span",{children:t.weightUnit}),e(R,{})]})}),e(W.SelectList,{children:Object.values(M).map(r=>e(W.SelectItem,{value:{weightUnit:r,supersetItemId:t.id},children:r},r))})]})]}),e("div",{className:"workout-edit__form__input-container__btns-container",children:e(S,{className:"superset__btn-delete",onClickFn:()=>h(o.id,t.id),children:"delete"})})]},c))}),d("div",{className:"workout-edit__form__input-container__btns-container",children:[e(S,{className:"btn",onClickFn:()=>F(o.id),children:"delete"}),e(S,{className:"btn workout-edit__btn",onClickFn:()=>_(o),children:"add item"})]})]})};const oe=()=>{const o=H(),{workout:n,isLoading:i,isSuccess:_,isError:h,navigate:F,addWorkoutAerobicItem:N,addWorkoutAnaerobicItem:w,addSupersetWorkoutItem:v,updateWorkout:b,duration:C}=y(),[f,u]=D.useState((n==null?void 0:n.items)??[]),m=(n==null?void 0:n.items.length)===0,t=_&&!m;function c(){n&&F(`/workouts/details/${n.id}`)}function r(s){if(!n)return;const k=s.target.value,T={...n,description:k};b(T)}function p(s){if(!n)return;const k={...n,type:s};b(k)}function a(s){if(!n)return;const k={...n,split:s};b(k)}function I(s){if(!s.destination||!n)return;const T=((E,L,j)=>{const V=Array.from(E),[A]=V.splice(L,1);return V.splice(j,0,A),V})(n.items,s.source.index,s.destination.index);u(T);const U={...n,items:T};b(U)}function l(s,k){return{background:s?"var(--color-warning)":"",transform:s?"rotate(7deg)":"",...k}}function B(s){switch(s.type){case"aerobic":return e(J,{item:s},s.id);case"anaerobic":return e(K,{item:s},s.id);case"superset":return e(Q,{item:s},s.id)}}return D.useEffect(()=>(o(P(!0)),()=>{o(P(!1))}),[o]),D.useEffect(()=>{n&&u(n.items)},[n]),i?e(O,{withContainer:!0,containerSize:{width:"100%",height:"75vh"}}):h?e($,{msg:"Something went wrong"}):!_||!n?null:e("main",{className:"page workout-edit",children:d("form",{className:"workout-edit__form",children:[e(Z,{workout:n,handleTypeSelectChange:p,handleDescInputChange:r,handleSplitSelectChange:a}),d("div",{className:"workout-edit-page__duration-container",children:[e("h3",{children:"duration:"}),d("h4",{children:[C," minutes"]})]}),d("div",{className:"workout-edit__form__btns",children:[e(S,{className:"btn workout-edit__btn",onClickFn:N,children:"add cardio"}),e(S,{className:"btn workout-edit__btn",onClickFn:w,children:"add set"}),e(S,{className:"btn workout-edit__btn",onClickFn:v,children:"add superset"})]}),m&&e(z,{entityName:"exercises"}),t&&e(G,{onDragEnd:I,children:e(X,{droppableId:"droppable",children:s=>d("ul",{className:"workout-edit__items-list",...s.droppableProps,ref:s.innerRef,children:[f.map((k,T)=>e(Y,{draggableId:k.id,index:T,children:(U,E)=>e("li",{ref:U.innerRef,...U.draggableProps,...U.dragHandleProps,style:l(E.isDragging,U.draggableProps.style),className:"workout-edit__items-list__item",children:B(k)})},k.id)),s.placeholder]})})}),e(q,{className:"workout-edit__form__footer",children:e(S,{className:"btn  workout-edit__btn-open",onClickFn:c,children:"open"})})]})})};export{oe as default};