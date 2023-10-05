import{a as I,y as $,z as b,A,o as F,j as t,e as d,C as S,G as T,r as y,S as L,F as R,H as Y,B as z}from"./index-d69445ec.js";import{c as _}from"./calorieUtilService-95d7373f.js";import{E as X}from"./ErrorMsg-bcd3a83b.js";import{X as w,Y as E,R as G,C as j}from"./YAxis-4442102a.js";import{z as W,M as N,J as H,E as K,t as O}from"./generateCategoricalChart-27953ab7.js";import{c as q}from"./index-8fafa2cb.js";import{B as k}from"./Button-cd24714a.js";var P=W({chartName:"BarChart",GraphicalChild:N,defaultTooltipEventType:"axis",validateTooltipEventTypes:["axis","item"],axisComponents:[{axisType:"xAxis",AxisComp:w},{axisType:"yAxis",AxisComp:E}],formatAxisMap:H});function J(e){const{loggedInUser:n}=I(),{data:r,error:s,isLoading:a,isSuccess:o,isError:c}=$({queryKey:["calenderData",e],queryFn:()=>{const g=e.getMonth()+1,p=e.getFullYear();return F.getCalenderData(g,p)}}),l=!!r&&r.length===0;return{days:Q({date:e,data:r,loggedInUser:n}),error:s,isLoading:a,isSuccess:o,isError:c,isEmpty:l}}function Q({date:e,data:n,loggedInUser:r}){return U(e).map(s=>V({date:s,data:n,loggedInUser:r}))}function U(e){const n=b(e.getMonth()+1,e.getFullYear()),r=Array.from({length:n-1},(l,h)=>new Date(e.getFullYear(),e.getMonth(),h+1)),s=r[0].getDay(),a=r[r.length-1].getDay(),o=Array.from({length:s},(l,h)=>new Date(e.getFullYear(),e.getMonth(),h-s+1)),c=Array.from({length:6-a},(l,h)=>new Date(e.getFullYear(),e.getMonth()+1,h+1));return[...o,...r,...c]}function V({date:e,data:n,loggedInUser:r}){const s=Z(e);if(!n)return s;const a=n.find(l=>A(new Date(l.date),e));if(!a)return s;const o=_.getTotalCalories(a),c=ee(a,r,o);return{...s,id:a.id,data:a,backgroundColor:c}}function Z(e){return{id:null,data:null,backgroundColor:"",date:e,day:e.getDate(),consumedCalories:0}}function ee(e,n,r){return e&&n?_.getBcgByCosumedCalories({consumedCalories:r,targetCalorie:n.targetCaloricIntakePerDay}):""}const te=({intakes:e})=>{const r=e.sort((s,a)=>{const o=new Date(s.recordedAt).getTime(),c=new Date(a.recordedAt).getTime();return o-c}).map(s=>({name:s.items.reduce((a,o,c,l)=>l.length===1?o.name:c===0?a+`${o.name}, `:c===l.length-1?a+`and ${o.name}`:a+` ${o.name}, `,""),calories:s.items.reduce((a,o)=>a+o.calories,0)}));return t("div",{style:{width:"100%",maxWidth:1200,height:300},children:t(G,{children:d(P,{data:r,children:[t(j,{strokeDasharray:"3 3"}),t(w,{dataKey:"name"}),t(E,{}),t(K,{}),t(N,{dataKey:"calories",barSize:25,children:r.map((s,a)=>t(O,{fill:S[a%S.length]},`cell-${a}`))})]})})})},ae=({day:e})=>{const{data:n}=e;if(!n)return t("p",{children:"No data for this day"});const r=_.getTotalCalories(n);return d("section",{className:"day-info",children:[t("h2",{children:`Consumed Calories: ${r}`}),t("h3",{children:`Weight: ${n.weight}`}),t("h3",{children:`Waist: ${n.waist}`}),t("h3",{children:`Target Caloric Intake: ${n.targetCaloricIntake}`}),d("div",{children:[t("h4",{children:"Workouts:"}),t("ul",{children:n.workouts.map((s,a)=>t("li",{children:`${s.type} - ${s.description}`},a))})]}),d("div",{children:[t("h4",{children:"Intakes:"}),t("ul",{children:n.intakes.map((s,a)=>t("li",{children:`${s.isRecorded?"Recorded":"Not Recorded"} - ${s.items.map(o=>o.name).join(", ")}`},a))})]}),t(te,{intakes:n.intakes})]})};function ne(e){return T({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48zm62.63 304L296 374.63 177.37 256 296 137.37 318.63 160l-96 96z"}}]})(e)}function re(e){return T({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48zm-40 326.63L193.37 352l96-96-96-96L216 137.37 334.63 256z"}}]})(e)}const me=()=>{const[e,n]=y.useState(new Date),[r,s]=y.useState(null),{days:a,isLoading:o,isSuccess:c,isError:l}=J(e),h=y.useRef(null),g=y.useRef(0);function p(i){s(i)}function D(i){const m=new Date(e);m.setMonth(e.getMonth()+i),n(m)}return y.useEffect(()=>{const i=f=>{const C=f.touches[0];g.current=C.clientX},m=f=>{const C=B=>{const x=new Date(e);x.setMonth(e.getMonth()+B),n(x)},v=f.changedTouches[0].clientX,M=50;v-g.current>M&&C(-1),g.current-v>M&&C(1)},u=h.current;if(u)return u.addEventListener("touchstart",i,!1),u.addEventListener("touchend",m,!1),()=>{u&&(u.removeEventListener("touchstart",i),u.removeEventListener("touchend",m))}},[e,c]),d("main",{className:"page schedule-page",children:[o&&t(L,{}),l&&t(X,{}),c&&d(R,{children:[d(Y,{className:"schedule-page__header",children:[d("h2",{className:"schedule-page__header__title",children:[e.toLocaleString("default",{month:"long"})," ",e.getFullYear()]}),d("div",{className:"schedule-page__header__btns-container",children:[t(k,{onClickFn:()=>D(-1),children:t(ne,{className:"schedule-page__header__btns-container__btn__icon"})}),t(k,{onClickFn:()=>D(1),children:t(re,{className:"schedule-page__header__btns-container__btn__icon"})})]})]}),d("ul",{className:"schedule-grid",ref:h,children:[z.map(i=>t("li",{className:"schedule-grid__item",children:t("h3",{className:"schedule-grid__item__title",children:i.short})},i.short)),a.map(i=>{const{backgroundColor:m,date:u}=i,f=i.backgroundColor?"white":"";return t("li",{className:q("schedule-grid__item",{active:r&&A(i.date,r.date)}),onClick:()=>p(i),style:{backgroundColor:m,color:f},children:t("h3",{className:"schedule-grid__item__title",children:i.day})},u.toISOString())})]}),r&&t(ae,{day:r})]})]})};export{me as default};