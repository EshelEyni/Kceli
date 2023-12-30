import{ad as f,r as m,j as e,z as F,m as l,B as _,H as M,I as W,D as B,S as E,F as I}from"./index-9ff48d05.js";import{E as w}from"./ErrorMsg-2565b9b9.js";import{L as v}from"./List-91d44855.js";import{g as U,h as x}from"./index.esm-94e1d38f.js";import{c as L}from"./index-52bf59c1.js";import{u as P}from"./usePageLoaded-c87b3b9a.js";const z=({children:t})=>{const{isRunning:n}=f(),r=m.useRef(null),s=m.useRef(0),[o,d]=m.useState(N(1));return m.useEffect(()=>{const{current:a}=r;if(n){const c=setInterval(()=>{d(N(s.current)),s.current=s.current===100?0:s.current+1},10);r.current=c}else a&&clearInterval(a),d(N(0));return()=>{a&&clearInterval(a)}},[n]),e("div",{className:"seconds-circle","data-testid":"seconds-circle",style:{background:o},children:t})};function N(t){return`radial-gradient(closest-side,  var(--color-background) 85%, transparent 87%),
        conic-gradient(var(--color-text-gray) ${t}%, var(--color-background-light) 0)`}const H=({children:t})=>{const{initialTime:n,time:r,isRunning:s}=f(),o=m.useRef(null),[d,a]=m.useState(S(1));return m.useEffect(()=>{const{current:c}=o;if(s){const h=setInterval(()=>{const i=Math.abs((r-n)*60)/(n*60)*100;a(S(i))},10);o.current=h}else c&&clearInterval(c);return()=>{c&&clearInterval(c)}},[s,n,r]),m.useEffect(()=>{const h=Math.abs((r-n)*60)/(n*60)*100;a(S(h))},[n,r]),e("div",{className:"item-duration-circle","data-testid":"item-duration-circle",style:{background:d},children:e("div",{className:"item-duration-circle__border",children:t})})};function S(t){return`conic-gradient(var(--color-info) ${Math.max(t,.25)}%, var(--color-background-light) 0)`}const A=({children:t})=>{const{duration:n,completedDuration:r}=f(),s=r/n*100,[o,d]=m.useState(b(s||1));return m.useEffect(()=>{const a=r/n*100;d(b(a))},[r,n]),e("div",{className:"total-duration-circle","data-testid":"total-duration-circle",style:{background:o},children:e("div",{className:"total-duration-circle__border",children:t})})};function b(t){return`conic-gradient(#6A0DAD ${Math.max(t,.25)}%, var(--color-background-light) 0)`}function G(t){return F({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"}},{tag:"path",attr:{d:"M13 8v8h-3V8h3m0-3h-3C8.34 5 7 6.34 7 8v8c0 1.66 1.34 3 3 3h3c1.66 0 3-1.34 3-3V8c0-1.66-1.34-3-3-3zM1 8h2v11h3V5H1v3zm17.5 3c-.83 0-1.5.68-1.5 1.5v2c0 .82.67 1.5 1.5 1.5H21v1h-4v2h4.5c.83 0 1.5-.67 1.5-1.5v-2c0-.83-.67-1.5-1.5-1.5H19v-1h4v-2h-4.5z"}}]})(t)}const T=new Audio("/assets/sounds/SamsungRingtoneSoundEffect.mp3");function V(t){const n=Math.floor(t/60),r=Math.floor(t%60),s=Math.floor(t%1*100),o=n.toString().padStart(2,"0"),d=r.toString().padStart(2,"0"),a=s.toString().padStart(2,"0").slice(-2);return`${o}:${d}.${a}`}const j=()=>{const{time:t,setTime:n,isRunning:r,setIsRunning:s,onResetTimer:o,setInitialTime:d}=f(),a=m.useRef(null);function c(){t<=0||s(i=>!i)}function h(){n(0),d(0),s(!1)}function p(){n(i=>i+10),d(i=>i+10)}return m.useEffect(()=>{const{current:i}=a;if(r){const g=setInterval(()=>{n(k=>k>=0?k-.01:(s(!1),T.volume=.5,T.play(),clearInterval(g),0))},10);a.current=g}else i&&clearInterval(i);return()=>{i&&clearInterval(i)}},[r,n,s]),l("section",{className:"timer","data-testid":"timer",children:[e(A,{children:e(H,{children:e(z,{children:e("div",{className:"clock-wrapper",children:e("span",{className:"timer__count",children:V(t)})})})})}),l("div",{className:"timer__controls",children:[e(_,{className:"timer__controls__btn",onClickFn:h,children:e(U,{"data-testid":"clear-icon"})}),e(_,{className:"timer__controls__btn",onClickFn:p,children:e(G,{"data-testid":"increment-icon"})}),e(_,{className:"timer__controls__btn",onClickFn:c,children:r?e(M,{"data-testid":"pause-icon"}):e(W,{"data-testid":"play-icon"})}),e(_,{className:"timer__controls__btn",onClickFn:o,children:e(x,{"data-testid":"reset-icon"})})]})]})};const y=({item:t})=>{const{currItem:n,setCurrItem:r,isWorkoutStarted:s,onCompleteItem:o,onResetTimer:d}=f(),[a,c]=m.useState(t.type!=="aerobic"?t.sets:null),h=(n==null?void 0:n.id)===t.id;function p(){if(!(h||t.isCompleted)){if(r(t),t.type==="aerobic")return;c(t.sets)}}function i(){t.type==="anaerobic"&&(c(u=>u===0||typeof u!="number"?u:u-1),d(),a===1&&(o(t),c(null)))}function g(){return!h||!s||t.isCompleted?null:l("div",{className:"workout-item-display__btns-container "+L({aerobic:(n==null?void 0:n.type)==="aerobic"}),"data-testid":"workout-item-display-btns-container",children:[(n==null?void 0:n.type)!=="aerobic"&&e(_,{className:"workout-item-display__btns-container__btn-set-num",isDisabled:!s,onClickFn:i,children:e("span",{children:a})}),e(_,{className:"workout-item-display__btns-container__btn",isDisabled:!s,onClickFn:()=>o(t),children:"complete"})]})}function k(){return t.type!=="superset"?null:e("ul",{className:"workout-item-display__info__superset-set-list","data-testid":"workout-item-display-info-superset-set-list",children:t.items.map((u,$)=>{const R=u.weightUnit==="kg"||u.weightUnit==="lbs"?`${u.weight} ${u.weightUnit}`:u.weightUnit;return e("li",{className:"workout-item-display__info__superset-set-list__item",children:`${u.name} - ${u.reps} reps - ${R}`},$)})})}function D(){const u=`${t.name} - ${B.calcItemDuration(t)} min`;switch(t.type){case"anaerobic":{const C=t.weightUnit==="kg"||t.weightUnit==="lbs"?`${t.weight} ${t.weightUnit}`:t.weightUnit;return`${u} - ${t.sets} * ${t.reps} - ${C} - ${t.restInSec}s rest`}case"superset":return`${u} - ${t.sets} sets - ${t.items.length} items - ${t.restInSec}s rest`;default:return u}}return l("section",{className:"workout-item-display",onClick:p,children:[l("div",{className:"workout-item-display__info","data-testid":"workout-item-display-info",children:[e("h4",{className:"workout-item-display__info__title","data-testid":"workout-item-display-info-title",children:D()}),k()]}),g()]})},Y=()=>{P({title:"Workout / Kceli"});const{workout:t,unCompletedItems:n,completedItems:r,isLoading:s,isSuccess:o,isError:d,duration:a,isWorkoutStarted:c,isLoadingUpdateDailyData:h,onStart:p}=f();return d?e(w,{}):!o||!t?null:l("main",{className:"page workout-details","data-testid":"workout-details",children:[(s||h)&&e(E,{containerSize:{height:"100px"}}),d&&e(w,{}),o&&!t&&e(w,{msg:"Workout not found"}),o&&t&&l("div",{className:"workout-details__wrapper",children:[l("section",{className:"workout-details__info",children:[l("div",{className:"workout-details__info__item",children:[e("h2",{children:"description:"}),l("h3",{children:[" ",t.description]})]}),l("div",{className:"workout-details__info__item",children:[e("h2",{children:"duration: "}),l("h3",{children:[a," min"]})]}),l("div",{className:"workout-details__info__item",children:[e("h2",{children:"type: "}),e("h3",{children:t.type})]}),"split"in t&&l("div",{className:"workout-details__info__item",children:[e("h2",{children:"split: "})," ",e("h3",{children:t.split})]}),!c&&e(_,{onClickFn:p,children:"Start"})]}),!c&&l(I,{children:[e("h2",{className:"workout-details__title",children:"items:"}),e(v,{items:t.items,className:"workout-details__list",render:i=>e(y,{item:i},i.id),dataTestId:"workout-items-list"})]}),c&&l(I,{children:[e(j,{}),e(v,{items:n,className:"workout-details__list",render:i=>e(y,{item:i},i.id),dataTestId:"workout-uncompleted-items-list"}),r.length>0&&l("div",{className:"workout-details__completed-list-container",children:[e("h2",{className:"workout-details__completed-list-container__title",children:"Completed Items:"}),e("hr",{className:"workout-details__completed-list-container__hr"}),e(v,{items:r,className:"workout-details__list",render:i=>e(y,{item:i},i.id),dataTestId:"workout-completed-items-list"})]})]})]})]})};export{Y as default};
