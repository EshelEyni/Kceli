import{J as S,L as A,j as i,m as d,B as M,T as L,_ as p}from"./index-26b4495b.js";import{u as P}from"./index.esm-37eb81b2.js";import{u as q}from"./usePageLoaded-12442b19.js";import{A as x}from"./index-5a953799.js";const $={value:/^[a-zA-Z0-9]+$/,message:"Must contain only letters and numbers"},N={value:/^[a-zA-Z0-9 ]+$/,message:"Must contain only letters, numbers and spaces"},F={value:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,message:"Must be a valid email"};function C(t){return`Please enter ${t}`}function D(t){return{value:t,message:`Must be at least ${t} characters`}}function z(t){return{value:t,message:`Must be at most ${t} characters`}}const Z={lettersAndNumberPattern:$,lettersAndNumberPatternWithSpace:N,emailPattern:F,createRequiredValidationMsg:C,createMinLengthValidation:D,createMaxLengthValidation:z},{lettersAndNumberPattern:u,lettersAndNumberPatternWithSpace:_,emailPattern:j,createRequiredValidationMsg:r,createMinLengthValidation:l,createMaxLengthValidation:m}=Z,O=()=>{q({});const t=S(),f=A(),{register:c,handleSubmit:y,setError:v,trigger:b,formState:{errors:o,isDirty:g,touchedFields:V}}=P(),h=async e=>{await b(e)},w=[{id:"username",type:"text",validation:{required:r("username"),minLength:l(3),maxLength:m(20),pattern:u},defaultValue:""},{id:"fullname",type:"text",validation:{required:r("fullname"),minLength:l(3),pattern:_},defaultValue:""},{id:"email",type:"text",validation:{required:r("email"),pattern:j},defaultValue:""},{id:"password",type:"password",validation:{required:r("password"),minLength:l(8),maxLength:m(20),pattern:u},defaultValue:""},{id:"passwordConfirm",type:"password",validation:{required:r("passwordConfirm"),minLength:l(8),maxLength:m(20),pattern:u},defaultValue:""},{id:"weight",type:"number",validation:{required:r("weight")},defaultValue:""},{id:"height",type:"number",validation:{required:r("height")},defaultValue:""},{id:"gender",type:"radio",validation:{required:r("gender")},options:["male","female"],defaultValue:"male"},{id:"birthdate",type:"date",validation:{required:r("birthdate")},defaultValue:new Date(new Date().setFullYear(new Date().getFullYear()-18)).toISOString().split("T")[0]}];return i("section",{className:"page signup-page",children:d("form",{onSubmit:y(async e=>{var n,s;try{if(e.password!==e.passwordConfirm){v("passwordConfirm",{type:"manual",message:"Passwords do not match"});return}await f(L(e)),t("/home")}catch(a){a instanceof x&&((s=(n=a==null?void 0:a.response)==null?void 0:n.data)!=null&&s.message)?p.error(a.response.data.message):p.error("An unknown error occurred")}}),children:[i("h1",{children:"Signup"}),w.map(e=>{var n,s;return d("div",{className:e.type==="radio"?"input-field-radio":"input-field",children:[i("label",{htmlFor:e.id,children:d("fieldset",{children:[i("legend",{children:e.id}),e.type==="radio"?(n=e.options)==null?void 0:n.map(a=>d("label",{children:[i("input",{...c(e.id,e.validation),type:e.type,value:a,defaultChecked:e.defaultValue===a,onBlur:()=>h(e.id)}),a]},a)):i("input",{id:e.id,...c(e.id,e.validation),type:e.type,autoComplete:"off",defaultValue:e.defaultValue,onBlur:()=>h(e.id)})]})}),(g||V[e.id])&&o[e.id]&&i("p",{className:"input-field__error-message",children:(s=o[e.id])==null?void 0:s.message})]},e.id)}),i(M,{type:"submit",isDisabled:g&&Object.keys(o).length>0,children:"Signup"})]})})};export{O as default};