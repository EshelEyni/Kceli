import{n as w,u as M,j as i,f as n,x as S}from"./index-544b77a7.js";import{u as q}from"./index.esm-8a8de971.js";const x={value:/^[a-zA-Z0-9]+$/,message:"Must contain only letters and numbers"},P={value:/^[a-zA-Z0-9 ]+$/,message:"Must contain only letters, numbers and spaces"},$={value:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,message:"Must be a valid email"};function A(a){return`Please enter ${a}`}function L(a){return{value:a,message:`Must be at least ${a} characters`}}function N(a){return{value:a,message:`Must be at most ${a} characters`}}const C={lettersAndNumberPattern:x,lettersAndNumberPatternWithSpace:P,emailPattern:$,createRequiredValidationMsg:A,createMinLengthValidation:L,createMaxLengthValidation:N},{lettersAndNumberPattern:s,lettersAndNumberPatternWithSpace:F,emailPattern:z,createRequiredValidationMsg:t,createMinLengthValidation:d,createMaxLengthValidation:l}=C,W=()=>{const a=w(),g=M(),{register:o,handleSubmit:p,setError:f,trigger:v,formState:{errors:u,isDirty:y,touchedFields:b}}=q(),m=async e=>{await v(e)},V=[{id:"username",type:"text",validation:{required:t("username"),minLength:d(3),maxLength:l(20),pattern:s},defaultValue:"eshel2"},{id:"fullname",type:"text",validation:{required:t("fullname"),minLength:d(3),pattern:F},defaultValue:"eshel eyni"},{id:"email",type:"text",validation:{required:t("email"),pattern:z},defaultValue:"eshel2@email.com"},{id:"password",type:"password",validation:{required:t("password"),minLength:d(6),maxLength:l(20),pattern:s},defaultValue:"eshel123"},{id:"passwordConfirm",type:"password",validation:{required:t("passwordConfirm"),minLength:d(6),maxLength:l(20),pattern:s},defaultValue:"eshel123"},{id:"weight",type:"number",validation:{required:t("weight")},defaultValue:"120"},{id:"height",type:"number",validation:{required:t("height")},defaultValue:"182"},{id:"gender",type:"radio",validation:{required:t("gender")},options:["male","female"],defaultValue:"male"},{id:"birthdate",type:"date",validation:{required:t("birthdate")},defaultValue:"1992-01-09"}];return i("section",{className:"signup-page",children:n("form",{onSubmit:p(async e=>{if(e.password!==e.passwordConfirm){f("passwordConfirm",{type:"manual",message:"Passwords do not match"});return}await g(S(e)),a("/home")}),children:[i("h1",{children:"Signup"}),V.map(e=>{var c,h;return n("div",{children:[i("label",{htmlFor:e.id,children:n("fieldset",{children:[i("legend",{children:e.id}),e.type==="radio"?(c=e.options)==null?void 0:c.map(r=>n("label",{children:[i("input",{...o(e.id,e.validation),type:e.type,value:r,defaultChecked:e.defaultValue===r,onBlur:()=>m(e.id)}),r]},r)):i("input",{id:e.id,...o(e.id,e.validation),type:e.type,autoComplete:"off",defaultValue:e.defaultValue,onBlur:()=>m(e.id)})]})}),(y||b[e.id])&&u[e.id]&&i("p",{children:(h=u[e.id])==null?void 0:h.message})]},e.id)}),i("button",{type:"submit",children:"Signup"})]})})};export{W as default};
