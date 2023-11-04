import{T as W,u as _,j as e,m as g,U as P,F as L,S as I,B as U,D as $}from"./index-c30fed78.js";import{S as C,P as N,E as R,D as F}from"./Empty-8acca534.js";import{b as T,W as x}from"./WorkoutPreview-bec81bb7.js";import{E as B}from"./ErrorMsg-a2f163e0.js";const j=({workoutDay:t})=>{const{loggedInUser:u,workouts:a}=W(),k=_();function p(s){if(!u||!a)return;const{workoutSchedule:d}=u,c=d.map(n=>{if(n.name!==t.name)return n;const l=n.workouts.filter((o,i)=>i!==s);return{...n,workouts:l}});k(P({...u,workoutSchedule:c}))}return e(C,{droppableId:t.name,direction:"vertical",children:(s,d)=>g("section",{className:"workout-day",style:{backgroundColor:d.draggingOverWith?"var(--color-success)":""},children:[e("h2",{className:"workout-day__name",children:t.name}),e("ul",{...s.droppableProps,ref:s.innerRef,className:"workout-day__list",children:t.workouts.map((c,n)=>{const l=`workday-${t.name}-workout-${c.id}`;return e(N,{draggableId:l,index:n,children:o=>g("li",{...o.draggableProps,...o.dragHandleProps,ref:o.innerRef,style:{...o.draggableProps.style},className:"workout-day__list__item",children:[e("span",{children:c.description}),e(T,{size:18,onClick:()=>p(n)})]})},c.id+n)})}),s.placeholder]})})};const y=()=>{const{workoutSchedule:t}=W();return t?e("ul",{className:"workout-schedule",children:t.map(u=>e("li",{children:e(j,{workoutDay:u})},u.name))}):null};const z=()=>{const{workouts:t,isLoading:u,isSuccess:a,isError:k,isEmpty:p}=W();return g(L,{children:[u&&e(I,{}),a&&!p&&e(C,{droppableId:"workout-list",direction:"horizontal",children:s=>g("ul",{...s.droppableProps,ref:s.innerRef,className:"workout-list",children:[t.map((d,c)=>{const n=`workout-list-workout-${d.id}-index-${c}`;return e(N,{draggableId:n,index:c,children:l=>e("li",{...l.draggableProps,...l.dragHandleProps,ref:l.innerRef,style:{...l.draggableProps.style},className:"workout-list__item",children:e(x,{workout:d})})},d.id+c)}),s.placeholder]})}),a&&p&&e(R,{entityName:"workouts"}),k&&e(B,{msg:"Couldn't get workouts. Please try again later"})]})},q=()=>{const{createWorkout:t,isLoadingCreateWorkout:u,loggedInUser:a,workouts:k,setWorkoutSchedule:p}=W(),s=_();function d(){t($.getDefaultWorkout())}function c(o){if(!o.destination)return;const{source:i}=o;switch(i.droppableId){case"workout-list":n(o);break;case"sun":case"mon":case"tue":case"wed":case"thu":case"fri":case"sat":l(o);break}}function n(o){if(!o.destination||!a||!k)return;const{source:i,destination:b}=o,{workoutSchedule:f}=a,m=f.map(r=>{if(r.name!==b.droppableId)return r;const h={...k[i.index]},w=[...r.workouts,h];return{...r,workouts:w}});p(m),s(P({...a,workoutSchedule:m}))}function l(o){if(!o.destination||!a||!k)return;const{source:i,destination:b}=o,{workoutSchedule:f}=a,m=f.map(r=>{if(r.name===b.droppableId){const h=f.find(E=>E.name===i.droppableId);if(!h)return r;const w={...h.workouts[i.index]},S=[...r.workouts,w];return{...r,workouts:S}}if(r.name===i.droppableId){const h=r.workouts.filter((w,S)=>S!==i.index);return{...r,workouts:h}}return r});p(m),s(P({...a,workoutSchedule:m}))}return e("main",{className:"page workout-page",children:g(F,{onDragEnd:c,children:[e(y,{}),e(U,{className:"btn workout-page__btn",onClickFn:d,children:"add new workout"}),u?e(I,{}):e(z,{})]})})};export{q as default};
