import{A as u,E as d,r as g,j as a,k as n,B as p,H as h,_ as r}from"./index-4a049eae.js";const _=()=>{const t=u(),l=d(),[s,i]=g.useState({username:"eshel2",password:"eshel123"});function o(e){i({...s,[e.target.name]:e.target.value})}async function c(){try{const{username:e,password:m}=s;await l(h(e,m)),t("/home")}catch(e){e instanceof Error?r.error(e.message):r.error("An unknown error occurred")}}return a("main",{className:"page",children:n("form",{className:"login-form",children:[a("h1",{className:"login-form__title",children:"login"}),n("div",{className:"login-form__input-container",children:[a("label",{htmlFor:"username",className:"login-form__label",children:"username"}),a("input",{id:"username",type:"text",name:"username",onChange:o,autoComplete:"off",value:s.username,className:"login-form__input"})]}),n("div",{className:"login-form__input-container",children:[a("label",{htmlFor:"password",className:"login-form__label",children:"password"}),a("input",{id:"password",type:"password",name:"password",onChange:o,autoComplete:"off",value:s.password,className:"login-form__input"})]}),a(p,{onClickFn:c,children:"login"})]})})};export{_ as default};
