import{r as n,H as d,X as f,s}from"./index-b957812d.js";function l(t){n.useEffect(()=>{const e=document.title;return document.title=t||"Kceli",()=>{document.title=e}},[t])}function D({title:t}){const e=d();l(t),n.useEffect(()=>{e(f(!1))},[e])}var r=(t=>(t.UNIT="unit",t.GRAM="g",t.CUP="cup",t.TABLE_SPOON="tbsp",t.TEA_SPOON="tsp",t.MILLILITER="ml",t))(r||{});const p=Object.values(r);function I(){return{id:s(),name:"",items:[c()],isRecorded:!0,recordedAt:null,type:"food"}}function c(){return{id:s(),unit:r.UNIT,quantity:1,name:""}}function g(t){switch(t){case"g":return 100;case"ml":return 100;case"unit":return 1;case"cup":return 1;case"tbsp":return 1;case"tsp":return 1;default:return 1}}function m(t){switch(t){case"g":return 25;case"ml":return 25;case"unit":return 1;case"cup":return 1;case"tbsp":return 1;case"tsp":return 1;default:return 1}}function A(t){return t.sort((u,a)=>{const o=new Date(u.recordedAt).getTime(),i=new Date(a.recordedAt).getTime();return o-i})}const k={getDefaultIntake:I,getDefaultIntakeItem:c,getUnitDefaultQuantity:g,getQuantityStepPerUnit:m,units:p,sortIntakesByRecordedAt:A};export{r as M,k as i,D as u};