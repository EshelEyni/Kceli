import{J as u,L as d,r as g,j as a,m as n,B as p,M as f,_ as r}from"./index-0315acf3.js";import{u as h}from"./usePageLoaded-4d37a409.js";const N=()=>{h({title:"Login / Kceli"});const t=u(),i=d(),[s,l]=g.useState({username:"",password:""});function o(e){l({...s,[e.target.name]:e.target.value})}async function m(){try{const{username:e,password:c}=s;await i(f(e,c)),t("/home")}catch(e){e instanceof Error?r.error(e.message):r.error("An unknown error occurred")}}return a("main",{className:"page",children:n("form",{className:"login-form",children:[a("h1",{className:"login-form__title",children:"login"}),n("div",{className:"login-form__input-container",children:[a("label",{htmlFor:"username",className:"login-form__label",children:"username"}),a("input",{id:"username",type:"text",name:"username",onChange:o,autoComplete:"off",value:s.username,className:"login-form__input"})]}),n("div",{className:"login-form__input-container",children:[a("label",{htmlFor:"password",className:"login-form__label",children:"password"}),a("input",{id:"password",type:"password",name:"password",onChange:o,autoComplete:"off",value:s.password,className:"login-form__input"})]}),a(p,{onClickFn:m,children:"login"})]})})};export{N as default};
