import{J as w,L as S,j as i,m as n,B as M,T as L}from"./index-757a4c32.js";import{u as P}from"./index.esm-1f88139f.js";import{u as q}from"./usePageLoaded-a3fd546c.js";const $={value:/^[a-zA-Z0-9]+$/,message:"Must contain only letters and numbers"},x={value:/^[a-zA-Z0-9 ]+$/,message:"Must contain only letters, numbers and spaces"},A={value:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,message:"Must be a valid email"};function N(a){return`Please enter ${a}`}function C(a){return{value:a,message:`Must be at least ${a} characters`}}function F(a){return{value:a,message:`Must be at most ${a} characters`}}const z={lettersAndNumberPattern:$,lettersAndNumberPatternWithSpace:x,emailPattern:A,createRequiredValidationMsg:N,createMinLengthValidation:C,createMaxLengthValidation:F},{lettersAndNumberPattern:l,lettersAndNumberPatternWithSpace:Z,emailPattern:j,createRequiredValidationMsg:t,createMinLengthValidation:d,createMaxLengthValidation:o}=z,W=()=>{q({});const a=w(),p=S(),{register:u,handleSubmit:f,setError:v,trigger:y,formState:{errors:s,isDirty:m,touchedFields:b}}=P(),c=async e=>{await y(e)},V=[{id:"username",type:"text",validation:{required:t("username"),minLength:d(3),maxLength:o(20),pattern:l},defaultValue:""},{id:"fullname",type:"text",validation:{required:t("fullname"),minLength:d(3),pattern:Z},defaultValue:""},{id:"email",type:"text",validation:{required:t("email"),pattern:j},defaultValue:""},{id:"password",type:"password",validation:{required:t("password"),minLength:d(6),maxLength:o(20),pattern:l},defaultValue:""},{id:"passwordConfirm",type:"password",validation:{required:t("passwordConfirm"),minLength:d(6),maxLength:o(20),pattern:l},defaultValue:""},{id:"weight",type:"number",validation:{required:t("weight")},defaultValue:""},{id:"height",type:"number",validation:{required:t("height")},defaultValue:""},{id:"gender",type:"radio",validation:{required:t("gender")},options:["male","female"],defaultValue:"male"},{id:"birthdate",type:"date",validation:{required:t("birthdate")},defaultValue:new Date().toISOString().split("T")[0]}];return i("section",{className:"page signup-page",children:n("form",{onSubmit:f(async e=>{if(e.password!==e.passwordConfirm){v("passwordConfirm",{type:"manual",message:"Passwords do not match"});return}await p(L(e)),a("/home")}),children:[i("h1",{children:"Signup"}),V.map(e=>{var g,h;return n("div",{className:e.type==="radio"?"input-field-radio":"input-field",children:[i("label",{htmlFor:e.id,children:n("fieldset",{children:[i("legend",{children:e.id}),e.type==="radio"?(g=e.options)==null?void 0:g.map(r=>n("label",{children:[i("input",{...u(e.id,e.validation),type:e.type,value:r,defaultChecked:e.defaultValue===r,onBlur:()=>c(e.id)}),r]},r)):i("input",{id:e.id,...u(e.id,e.validation),type:e.type,autoComplete:"off",defaultValue:e.defaultValue,onBlur:()=>c(e.id)})]})}),(m||b[e.id])&&s[e.id]&&i("p",{children:(h=s[e.id])==null?void 0:h.message})]},e.id)}),i(M,{type:"submit",isDisabled:m&&Object.keys(s).length>0,children:"Signup"})]})})};export{W as default};
