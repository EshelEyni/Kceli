import{e as l,j as o,S as m,B as g,F as p,C as W}from"./index-92e94684.js";import{E as f}from"./ErrorMsg-183ceff9.js";import{E as w}from"./Empty-0b137457.js";import{B as h}from"./Button-4b3c095d.js";import{W as C}from"./WorkoutPreview-a593adf2.js";const E=({render:n,items:i,isLoading:u,isSuccess:t,isError:c,isEmpty:e,entityName:r,className:s})=>l("div",{className:`list-container ${s}`,children:[u&&o(m,{}),t&&!e&&o("div",{className:`list ${s}`,children:i.map((a,d,k)=>n(a,d,k))}),t&&e&&o(w,{entityName:r}),c&&o(f,{msg:`Couldn't get ${r}. Please try again later.`})]});const N=()=>{const{workouts:n,isLoading:i,isSuccess:u,isError:t,isEmpty:c,createWorkout:e,isLoadingCreateWorkout:r}=g();function s(){e(W.getDefaultWorkout())}return l("main",{className:"page workout-page",children:[r&&o(m,{}),!r&&l(p,{children:[o(h,{className:"btn workout-page__btn",onClickFn:s,children:"add new workout"}),o(E,{items:n,isLoading:i,isSuccess:u,isError:t,isEmpty:c,className:"workout-page__list",entityName:"workouts",render:a=>o(C,{workout:a},a.id)})]})]})};export{N as default};
