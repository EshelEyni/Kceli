import{j as o,m as g,a0 as S,S as E,L as x,B as U,D as A,a1 as P}from"./index-9ff48d05.js";import{S as N,P as L,D as R}from"./StrictModeDroppable-6f5f4330.js";import{W as T}from"./WorkoutPreview-78cd9d57.js";import{E as j}from"./Empty-6526e219.js";import{E as B}from"./ErrorMsg-2565b9b9.js";import{G as F}from"./GoalEdit-3aa1e4d9.js";import{A as D,G as H}from"./GoalDisplay-e93f1f06.js";import{u as M}from"./usePageLoaded-c87b3b9a.js";import"./index-52bf59c1.js";import"./index.esm-94e1d38f.js";const O=({workoutDay:t})=>o(N,{droppableId:t.name,direction:"vertical",children:(a,s)=>g("section",{className:"workout-day",style:{backgroundColor:s.draggingOverWith?"var(--color-success)":""},children:[o("h2",{className:"workout-day__name",children:t.name}),o("ul",{...a.droppableProps,ref:a.innerRef,className:"workout-day__list",children:t.workouts.map((i,c)=>{const u=`workday-${t.name}-workout-${i.id}`;return o(L,{draggableId:u,index:c,children:n=>o("li",{...n.draggableProps,...n.dragHandleProps,ref:n.innerRef,style:{...n.draggableProps.style},className:"workout-day__list__item",children:o("span",{children:i.description})})},i.id+c)})}),a.placeholder]})});const z=()=>{const{workoutSchedule:t}=S();return t?o("ul",{className:"workout-schedule","data-testid":"workout-schedule",children:t.map(a=>o("li",{children:o(O,{workoutDay:a})},a.name))}):null};const K=()=>{const{workouts:t,isLoading:a,isSuccess:s,isError:i,isEmpty:c}=S();return g("div",{className:"workout-list-container","data-testid":"workout-list",children:[a&&o(E,{}),s&&!c&&o(N,{droppableId:"workout-list",direction:"horizontal",children:u=>g("ul",{...u.droppableProps,ref:u.innerRef,className:"workout-list",children:[t.map((n,p)=>{const f=`workout-list-workout-${n.id}-index-${p}`;return o(L,{draggableId:f,index:p,children:d=>o("li",{...d.draggableProps,...d.dragHandleProps,ref:d.innerRef,style:{...d.draggableProps.style},className:"workout-list__item",children:o(T,{workout:n})})},n.id+p)}),u.placeholder]})}),s&&c&&o(j,{entityName:"workouts"}),i&&o(B,{msg:"Couldn't get workouts. Please try again later"})]})},ro=()=>{M({title:"Workouts / Kceli"});const{createWorkout:t,isLoadingCreateWorkout:a,loggedInUser:s,workouts:i,setWorkoutSchedule:c,goals:u,isLoadingGoals:n,isSuccessGoals:p,isErrorGoals:f,isEmptyGoals:d}=S(),_=x();function I(){t(A.getDefaultWorkout())}function y(e){if(!e.destination)return;const{source:l}=e;switch(l.droppableId){case"workout-list":G(e);break;case"sun":case"mon":case"tue":case"wed":case"thu":case"fri":case"sat":$(e);break}}function G(e){if(!e.destination||!s||!i)return;const{source:l,destination:W}=e,{workoutSchedule:h}=s,k=h.map(r=>{if(r.name!==W.droppableId)return r;const m={...i[l.index]},w=[...r.workouts,m];return{...r,workouts:w}});c(k),_(P({...s,workoutSchedule:k}))}function $(e){if(!e.destination||!s||!i)return;const{source:l,destination:W}=e,{workoutSchedule:h}=s,k=h.map(r=>{if(r.name===W.droppableId){const m=h.find(C=>C.name===l.droppableId);if(!m)return r;const w={...m.workouts[l.index]},b=[...r.workouts,w];return{...r,workouts:b}}if(r.name===l.droppableId){const m=r.workouts.filter((w,b)=>b!==l.index);return{...r,workouts:m}}return r});c(k),_(P({...s,workoutSchedule:k}))}return o("main",{className:"page workout-page",children:g(R,{onDragEnd:y,children:[o(z,{}),o(U,{className:"btn workout-page__btn",onClickFn:I,children:"add new workout"}),g("div",{className:"workout-page__goals",children:[o(F,{type:"workout"}),o(D,{className:"workout-page__goals__list",items:u,render:e=>o(H,{goal:e,isEditEnabled:!0},e.id),isLoading:n,isError:f,isSuccess:p,isEmpty:d,entityName:"goal"})]}),a?o(E,{}):o(K,{})]})})};export{ro as default};
