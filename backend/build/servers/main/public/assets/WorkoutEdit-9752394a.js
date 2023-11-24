import{$ as P,z as j,k as o,j as e,N as x,i as m,F as B,a0 as R,B as g,E as M,r as V,a1 as L,S as O}from"./index-c64035b7.js";import{E as H}from"./ErrorMsg-f30ad68c.js";import{E as $}from"./Empty-ac286b7c.js";import{F as z}from"./Footer-a644ac59.js";import{D as A,S as G,P as q}from"./StrictModeDroppable-f280bda9.js";import{S as _,W as J}from"./WorkoutEditMainInputs-657d763c.js";const K=({item:n})=>{const{workout:i,updateWorkout:b,removeWorkoutItem:w,currItemId:I,addWorkoutItemToSuperset:C,removeWorkoutItemFromSuperset:k,setCurrItemId:f}=P(),S=j.calcItemDuration(n),p=250;function N(t){const r=t.target.value,a={...n,name:r};u(a)}function v(t){const r=Number(t.target.value),a={...n,durationInMin:r};u(a)}function F(t){const r=Number(t.target.value),a=i==null?void 0:i.items.map(d=>d.id!==I?d:{...d,sets:r}),c={...i,items:a};b(c)}function y(t){const r=Number(t.target.value),a={...n,reps:r};u(a)}function E(t){if(n.type!=="anaerobic")return;const r=Number(t.target.value),a={...n,weight:r};u(a)}function W(t){if(n.type!=="anaerobic")return;const r={...n,weightUnit:t};u(r)}function T(t){const r=Number(t.target.value),a={...n,restInSec:r};u(a)}function D(t){if(!i||n.type!=="superset")return;const r=t.target.value,a=n.items.map(d=>d.id!==t.target.id?d:{...d,name:r}),c={...n,items:a};u(c)}function U(t){if(!i||n.type!=="superset")return;const r=Number(t.target.value),a=n.items.map(d=>d.id!==t.target.id?d:{...d,reps:r}),c={...n,items:a};u(c)}function s(t){if(!i||n.type!=="superset")return;const r=Number(t.target.value),a=n.items.map(d=>d.id!==t.target.id?d:{...d,weight:r}),c={...n,items:a};u(c)}function l({weightUnit:t,supersetItemId:r}){if(!i||n.type!=="superset")return;const a=n.items.map(d=>d.id!==r?d:{...d,weightUnit:t}),c={...n,items:a};u(c)}function u(t){if(!i)return;const r=i.items.map(c=>c.id!==t.id?c:t),a={...i,items:r};b(a)}function h(){w(n.id)}return I!==n.id?o("section",{className:"mini-workout-item-preview","data-testid":"mini-workout-item-preview",onClick:()=>f(n.id),children:[e("span",{children:n.name}),e(x,{className:"mini-workout-item-preview__icon"})]}):o("section",{className:"workout-edit__form","data-testid":"workout-item-edit",children:[o("div",{className:"workout-edit__form__input-container name-input",children:[e("label",{htmlFor:"item-name-input",children:"Name:"}),e("input",{id:"item-name-input","data-testid":"workout-item-name-input",autoComplete:"off",defaultValue:n.name,onChange:m(N,p).debouncedFunc})]}),n.type==="aerobic"&&o("div",{className:"workout-edit__form__input-container",children:[e("label",{htmlFor:"item-duration-input",children:"Duration (in min):"}),e("input",{id:"item-duration-input","data-testid":"workout-item-duration-input",type:"number",defaultValue:S,onChange:m(v,p).debouncedFunc})]}),n.type!=="aerobic"&&o(B,{children:[o("div",{className:"workout-edit__form__input-container",children:[e("label",{htmlFor:"item-sets-input",children:"Sets:"}),e("input",{id:"item-sets-input",type:"number","data-testid":"workout-item-sets-input",defaultValue:n.sets,onChange:m(F,p).debouncedFunc})]}),o("div",{className:"workout-edit__form__input-container",children:[e("label",{htmlFor:"item-rest-input",children:"Rest (in sec):"}),e("input",{id:"item-rest-input",type:"number","data-testid":"workout-item-rest-input",defaultValue:n.restInSec,onChange:m(T,p).debouncedFunc})]})]}),n.type==="anaerobic"&&o(B,{children:[o("div",{className:"workout-edit__form__input-container",children:[e("label",{htmlFor:"item-reps-input",children:"reps:"}),e("input",{id:"item-reps-input",type:"number","data-testid":"workout-item-reps-input",defaultValue:n.reps,onChange:m(y,p).debouncedFunc})]}),(n.weightUnit==="kg"||n.weightUnit==="lbs")&&o("div",{className:"workout-edit__form__input-container",children:[e("label",{htmlFor:"item-weight-input",children:"weight:"}),e("input",{id:"item-weight-input",type:"number","data-testid":"workout-item-weight-input",defaultValue:n.weight,onChange:m(E,p).debouncedFunc})]}),o("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"weight unit:"}),o(_,{onChange:W,listHeight:250,children:[e(_.SelectTrigger,{children:o("div",{children:[e("span",{children:n.weightUnit}),e(x,{})]})}),e(_.SelectList,{children:Object.values(R).map(t=>e(_.SelectItem,{value:t,children:t},t))})]})]})]}),n.type==="superset"&&e("div",{className:"workout-edit__form__superset-item-list","data-testid":"superset-item-list",children:n.items.map((t,r)=>o("div",{className:"workout-edit__form__superset-item-container",children:[o("h3",{children:["Item ",r+1]}),o("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"name:"}),e("input",{id:t.id,type:"text","data-testid":"superset-item-name-input",defaultValue:t.name,onChange:m(D,p).debouncedFunc})]}),o("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"reps:"}),e("input",{id:t.id,type:"number","data-testid":"superset-item-reps-input",defaultValue:t.reps,onChange:m(U,p).debouncedFunc})]}),(t.weightUnit==="kg"||t.weightUnit==="lbs")&&o("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"weight:"}),e("input",{id:t.id,type:"number","data-testid":"superset-item-weight-input",defaultValue:t.weight,onChange:m(s,p).debouncedFunc})]}),o("div",{className:"workout-edit__form__input-container",children:[e("label",{children:"weight unit:"}),o(_,{onChange:l,listHeight:250,children:[e(_.SelectTrigger,{children:o("div",{children:[e("span",{children:t.weightUnit}),e(x,{})]})}),e(_.SelectList,{children:Object.values(R).map(a=>e(_.SelectItem,{value:{weightUnit:a,supersetItemId:t.id},children:a},a))})]})]}),e("div",{className:"workout-edit__form__input-container__btns-container",children:e(g,{className:"superset__btn-delete",onClickFn:()=>k(n.id,t.id),dataTestId:"delete-superset-item-btn",children:"delete"})})]},r))}),o("div",{className:"workout-edit__form__input-container__btns-container",children:[e(g,{className:"btn",onClickFn:h,dataTestId:"delete-workout-item-btn",children:"delete"}),n.type==="superset"&&e(g,{className:"btn workout-edit__btn",onClickFn:()=>C(n),dataTestId:"add-superset-item-btn",children:"add item"})]})]})},ne=()=>{const n=M(),{workout:i,isLoading:b,isSuccess:w,isError:I,navigate:C,addWorkoutItem:k,updateWorkout:f,duration:S}=P(),[p,N]=V.useState((i==null?void 0:i.items)??[]),v=(i==null?void 0:i.items.length)===0,F=w&&!v;function y(){i&&C(`/workouts/details/${i.id}`)}function E(s){if(!i)return;const l=s.target.value,u={...i,description:l};f(u)}function W(s){if(!i)return;const l={...i,type:s};f(l)}function T(s){if(!i)return;const l={...i,split:s};f(l)}function D(s){if(!s.destination||!i)return;const u=((t,r,a)=>{const c=Array.from(t),[d]=c.splice(r,1);return c.splice(a,0,d),c})(i.items,s.source.index,s.destination.index);N(u);const h={...i,items:u};f(h)}function U(s,l){return{background:s?"var(--color-warning)":"",transform:s?"rotate(7deg)":"",...l}}return V.useEffect(()=>(n(L(!0)),()=>{n(L(!1))}),[n]),V.useEffect(()=>{i&&N(i.items)},[i]),b?e(O,{withContainer:!0,containerSize:{width:"100%",height:"75vh"}}):I?e(H,{msg:"Something went wrong"}):!w||!i?null:e("main",{className:"page workout-edit","data-testid":"workout-edit-page",children:o("form",{className:"workout-edit__form",children:[e(J,{workout:i,handleTypeSelectChange:W,handleDescInputChange:E,handleSplitSelectChange:T}),o("div",{className:"workout-edit-page__duration-container",children:[e("h3",{children:"duration:"}),o("h4",{children:[S," minutes"]})]}),o("div",{className:"workout-edit__form__btns",children:[e(g,{className:"btn workout-edit__btn",onClickFn:()=>k("aerobic"),children:"add cardio"}),e(g,{className:"btn workout-edit__btn",onClickFn:()=>k("anaerobic"),children:"add set"}),e(g,{className:"btn workout-edit__btn",onClickFn:()=>k("superset"),children:"add superset"})]}),v&&e($,{entityName:"exercises"}),F&&e("div",{className:"workout-edit__items-list-container","data-testid":"workout-edit-items-list-container",children:e(A,{onDragEnd:D,children:e(G,{droppableId:"droppable",children:s=>o("ul",{className:"workout-edit__items-list",...s.droppableProps,ref:s.innerRef,children:[p.map((l,u)=>e(q,{draggableId:l.id,index:u,children:(h,t)=>e("li",{ref:h.innerRef,...h.draggableProps,...h.dragHandleProps,style:U(t.isDragging,h.draggableProps.style),className:"workout-edit__items-list__item",children:e(K,{item:l})})},l.id)),s.placeholder]})})})}),e(z,{className:"workout-edit__form__footer",children:e(g,{className:"btn  workout-edit__btn-open",onClickFn:y,children:"open"})})]})})};export{ne as default};
