import{m as l,j as o,S as m,W as g,F as p,X as W}from"./index-33f863e7.js";import{E as f}from"./ErrorMsg-fd0eaff2.js";import{E as w}from"./Empty-fa52bb5b.js";import{B as h}from"./Button-2694552d.js";import{W as E}from"./WorkoutPreview-0c5fb030.js";const L=({render:n,items:i,isLoading:u,isSuccess:t,isError:c,isEmpty:e,entityName:r,className:s})=>l("div",{className:`list-container ${s}`,children:[u&&o(m,{}),t&&!e&&o("ul",{className:`list ${s}`,children:i.map((a,d,k)=>n(a,d,k))}),t&&e&&o(w,{entityName:r}),c&&o(f,{msg:`Couldn't get ${r}. Please try again later.`})]});const _=()=>{const{workouts:n,isLoading:i,isSuccess:u,isError:t,isEmpty:c,createWorkout:e,isLoadingCreateWorkout:r}=g();function s(){e(W.getDefaultWorkout())}return l("main",{className:"page workout-page",children:[r&&o(m,{}),!r&&l(p,{children:[o(h,{className:"btn workout-page__btn",onClickFn:s,children:"add new workout"}),o(L,{items:n,isLoading:i,isSuccess:u,isError:t,isEmpty:c,className:"workout-page__list",entityName:"workouts",render:a=>o(E,{workout:a},a.id)})]})]})};export{_ as default};
