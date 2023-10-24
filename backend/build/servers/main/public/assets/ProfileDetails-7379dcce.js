import{$ as _,r as fe,w as pe,j as r,S as ae,i as d,x as F,y as ye,z as ve,O as ge}from"./index-a80dd77a.js";import{E as oe}from"./ErrorMsg-22e74056.js";import{X as se,Y as le,R as _e,C as be}from"./YAxis-3592b077.js";import{u as Ae,d as we,D as xe,s as Pe,L as X,f as V,C as Ne,A as De,n as K,o as Se,k as q,F as Oe,r as Ee,G as Ce,l as ce,H as ee,I as ke,z as Le,J as je,E as Te,K as Ie}from"./generateCategoricalChart-9e319dd3.js";import{c as te}from"./index-bb57fac0.js";import{B as J}from"./Button-9d3db0cb.js";import{u as Fe,C as O}from"./index.esm-76e52906.js";var We=["type","layout","connectNulls","ref"];function T(e){"@babel/helpers - typeof";return T=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},T(e)}function Ge(e,t){if(e==null)return{};var n=$e(e,t),i,a;if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)i=o[a],!(t.indexOf(i)>=0)&&Object.prototype.propertyIsEnumerable.call(e,i)&&(n[i]=e[i])}return n}function $e(e,t){if(e==null)return{};var n={},i=Object.keys(e),a,o;for(o=0;o<i.length;o++)a=i[o],!(t.indexOf(a)>=0)&&(n[a]=e[a]);return n}function U(){return U=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},U.apply(this,arguments)}function ie(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),n.push.apply(n,i)}return n}function A(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?ie(Object(n),!0).forEach(function(i){N(e,i,n[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ie(Object(n)).forEach(function(i){Object.defineProperty(e,i,Object.getOwnPropertyDescriptor(n,i))})}return e}function j(e){return Ue(e)||Ke(e)||Re(e)||Be()}function Be(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Re(e,t){if(e){if(typeof e=="string")return Q(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Q(e,t)}}function Ke(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function Ue(e){if(Array.isArray(e))return Q(e)}function Q(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function ze(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function re(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,ue(i.key),i)}}function Me(e,t,n){return t&&re(e.prototype,t),n&&re(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function Ve(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&Z(e,t)}function Z(e,t){return Z=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(i,a){return i.__proto__=a,i},Z(e,t)}function Ye(e){var t=Xe();return function(){var i=Y(e),a;if(t){var o=Y(this).constructor;a=Reflect.construct(i,arguments,o)}else a=i.apply(this,arguments);return He(this,a)}}function He(e,t){if(t&&(T(t)==="object"||typeof t=="function"))return t;if(t!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return E(e)}function E(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Xe(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function Y(e){return Y=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(n){return n.__proto__||Object.getPrototypeOf(n)},Y(e)}function N(e,t,n){return t=ue(t),t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function ue(e){var t=qe(e,"string");return T(t)==="symbol"?t:String(t)}function qe(e,t){if(T(e)!=="object"||e===null)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var i=n.call(e,t||"default");if(T(i)!=="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}var I=function(e){Ve(n,e);var t=Ye(n);function n(){var i;ze(this,n);for(var a=arguments.length,o=new Array(a),l=0;l<a;l++)o[l]=arguments[l];return i=t.call.apply(t,[this].concat(o)),N(E(i),"state",{isAnimationFinished:!0,totalLength:0}),N(E(i),"getStrokeDasharray",function(s,u,h){for(var c=h.reduce(function(x,D){return x+D}),m=Math.floor(s/c),f=s%c,v=u-s,p=[],g=0,y=0;;y+=h[g],++g)if(y+h[g]>f){p=[].concat(j(h.slice(0,g)),[f-y]);break}var w=p.length%2===0?[0,v]:[v];return[].concat(j(n.repeat(h,m)),j(p),w).map(function(x){return"".concat(x,"px")}).join(", ")}),N(E(i),"id",Ae("recharts-line-")),N(E(i),"pathRef",function(s){i.mainCurve=s}),N(E(i),"handleAnimationEnd",function(){i.setState({isAnimationFinished:!0}),i.props.onAnimationEnd&&i.props.onAnimationEnd()}),N(E(i),"handleAnimationStart",function(){i.setState({isAnimationFinished:!1}),i.props.onAnimationStart&&i.props.onAnimationStart()}),i}return Me(n,[{key:"componentDidMount",value:function(){if(this.props.isAnimationActive){var a=this.getTotalLength();this.setState({totalLength:a})}}},{key:"getTotalLength",value:function(){var a=this.mainCurve;try{return a&&a.getTotalLength&&a.getTotalLength()||0}catch{return 0}}},{key:"renderErrorBar",value:function(a,o){if(this.props.isAnimationActive&&!this.state.isAnimationFinished)return null;var l=this.props,s=l.points,u=l.xAxis,h=l.yAxis,c=l.layout,m=l.children,f=Pe(m,ke);if(!f)return null;var v=function(y,w){return{x:y.x,y:y.y,value:y.value,errorVal:ce(y.payload,w)}},p={clipPath:a?"url(#clipPath-".concat(o,")"):null};return _.createElement(X,p,f.map(function(g,y){return _.cloneElement(g,{key:"bar-".concat(y),data:s,xAxis:u,yAxis:h,layout:c,dataPointFormatter:v})}))}},{key:"renderDots",value:function(a,o,l){var s=this.props.isAnimationActive;if(s&&!this.state.isAnimationFinished)return null;var u=this.props,h=u.dot,c=u.points,m=u.dataKey,f=V(this.props),v=V(h,!0),p=c.map(function(y,w){var x=A(A(A({key:"dot-".concat(w),r:3},f),v),{},{value:y.value,dataKey:m,cx:y.x,cy:y.y,index:w,payload:y.payload});return n.renderDotItem(h,x)}),g={clipPath:a?"url(#clipPath-".concat(o?"":"dots-").concat(l,")"):null};return _.createElement(X,U({className:"recharts-line-dots",key:"dots"},g),p)}},{key:"renderCurveStatically",value:function(a,o,l,s){var u=this.props,h=u.type,c=u.layout,m=u.connectNulls;u.ref;var f=Ge(u,We),v=A(A(A({},V(f,!0)),{},{fill:"none",className:"recharts-line-curve",clipPath:o?"url(#clipPath-".concat(l,")"):null,points:a},s),{},{type:h,layout:c,connectNulls:m});return _.createElement(Ne,U({},v,{pathRef:this.pathRef}))}},{key:"renderCurveWithAnimation",value:function(a,o){var l=this,s=this.props,u=s.points,h=s.strokeDasharray,c=s.isAnimationActive,m=s.animationBegin,f=s.animationDuration,v=s.animationEasing,p=s.animationId,g=s.animateNewValues,y=s.width,w=s.height,x=this.state,D=x.prevPoints,W=x.totalLength;return _.createElement(De,{begin:m,duration:f,isActive:c,easing:v,from:{t:0},to:{t:1},key:"line-".concat(p),onAnimationEnd:this.handleAnimationEnd,onAnimationStart:this.handleAnimationStart},function(C){var P=C.t;if(D){var G=D.length/u.length,S=u.map(function(b,H){var B=Math.floor(H*G);if(D[B]){var R=D[B],L=K(R.x,b.x),de=K(R.y,b.y);return A(A({},b),{},{x:L(P),y:de(P)})}if(g){var he=K(y*2,b.x),me=K(w/2,b.y);return A(A({},b),{},{x:he(P),y:me(P)})}return A(A({},b),{},{x:b.x,y:b.y})});return l.renderCurveStatically(S,a,o)}var z=K(0,W),k=z(P),$;if(h){var M="".concat(h).split(/[,\s]+/gim).map(function(b){return parseFloat(b)});$=l.getStrokeDasharray(k,W,M)}else $="".concat(k,"px ").concat(W-k,"px");return l.renderCurveStatically(u,a,o,{strokeDasharray:$})})}},{key:"renderCurve",value:function(a,o){var l=this.props,s=l.points,u=l.isAnimationActive,h=this.state,c=h.prevPoints,m=h.totalLength;return u&&s&&s.length&&(!c&&m>0||!Se(c,s))?this.renderCurveWithAnimation(a,o):this.renderCurveStatically(s,a,o)}},{key:"render",value:function(){var a,o=this.props,l=o.hide,s=o.dot,u=o.points,h=o.className,c=o.xAxis,m=o.yAxis,f=o.top,v=o.left,p=o.width,g=o.height,y=o.isAnimationActive,w=o.id;if(l||!u||!u.length)return null;var x=this.state.isAnimationFinished,D=u.length===1,W=te("recharts-line",h),C=c&&c.allowDataOverflow,P=m&&m.allowDataOverflow,G=C||P,S=q(w)?this.id:w,z=(a=V(s))!==null&&a!==void 0?a:{r:3,strokeWidth:2},k=z.r,$=k===void 0?3:k,M=z.strokeWidth,b=M===void 0?2:M,H=Oe(s)?s:{},B=H.clipDot,R=B===void 0?!0:B,L=$*2+b;return _.createElement(X,{className:W},C||P?_.createElement("defs",null,_.createElement("clipPath",{id:"clipPath-".concat(S)},_.createElement("rect",{x:C?v:v-p/2,y:P?f:f-g/2,width:C?p:p*2,height:P?g:g*2})),!R&&_.createElement("clipPath",{id:"clipPath-dots-".concat(S)},_.createElement("rect",{x:v-L/2,y:f-L/2,width:p+L,height:g+L}))):null,!D&&this.renderCurve(G,S),this.renderErrorBar(G,S),(D||s)&&this.renderDots(G,R,S),(!y||x)&&Ee.renderCallByParent(this.props,u))}}],[{key:"getDerivedStateFromProps",value:function(a,o){return a.animationId!==o.prevAnimationId?{prevAnimationId:a.animationId,curPoints:a.points,prevPoints:o.curPoints}:a.points!==o.curPoints?{curPoints:a.points}:null}},{key:"repeat",value:function(a,o){for(var l=a.length%2!==0?[].concat(j(a),[0]):a,s=[],u=0;u<o;++u)s=[].concat(j(s),j(l));return s}},{key:"renderDotItem",value:function(a,o){var l;if(_.isValidElement(a))l=_.cloneElement(a,o);else if(we(a))l=a(o);else{var s=te("recharts-line-dot",a?a.className:"");l=_.createElement(xe,U({},o,{className:s}))}return l}}]),n}(fe.PureComponent);N(I,"displayName","Line");N(I,"defaultProps",{xAxisId:0,yAxisId:0,connectNulls:!1,activeDot:!0,dot:!0,legendType:"line",stroke:"#3182bd",strokeWidth:1,fill:"#fff",points:[],isAnimationActive:!Ce.isSsr,animateNewValues:!0,animationBegin:0,animationDuration:1500,animationEasing:"ease",hide:!1,label:!1});N(I,"getComposedData",function(e){var t=e.props,n=e.xAxis,i=e.yAxis,a=e.xAxisTicks,o=e.yAxisTicks,l=e.dataKey,s=e.bandSize,u=e.displayedData,h=e.offset,c=t.layout,m=u.map(function(f,v){var p=ce(f,l);return c==="horizontal"?{x:ee({axis:n,ticks:a,bandSize:s,entry:f,index:v}),y:q(p)?null:i.scale(p),value:p,payload:f}:{x:q(p)?null:n.scale(p),y:ee({axis:i,ticks:o,bandSize:s,entry:f,index:v}),value:p,payload:f}});return A({points:m,layout:c},h)});var Je=Le({chartName:"LineChart",GraphicalChild:I,axisComponents:[{axisType:"xAxis",AxisComp:se},{axisType:"yAxis",AxisComp:le}],formatAxisMap:je});const Qe=()=>{const{userDailyStats:e,isLoading:t,isSuccess:n,isError:i}=pe();if(t)return r(ae,{});if(i)return r(oe,{});if(!n||!e)return null;const a=e.map(o=>({...o,date:new Intl.DateTimeFormat("en-GB",{month:"numeric",day:"numeric",year:"2-digit"}).format(new Date(o.date))}));return r("div",{style:{width:"100%",maxWidth:1200,height:300},children:r(_e,{children:d(Je,{data:a,margin:{top:25,right:35,left:0,bottom:10},style:{backgroundColor:"white",borderRadius:10,boxShadow:"0 0 10px rgba(0,0,0,0.5)",display:"flex"},children:[r(be,{strokeDasharray:"4 1"}),r(se,{dataKey:"date"}),r(le,{}),r(Te,{}),r(Ie,{}),r(I,{type:"monotone",dataKey:"weight",stroke:"#ab1010"}),r(I,{type:"monotone",dataKey:"waist",stroke:"#6543ff"})]})})})};const Ze=()=>{const{user:e,userDailyStats:t,setIsEditing:n}=F();if(!e||!t)return null;const{username:i,fullname:a,birthdate:o,height:l,weight:s,totalDailyEnergyExpenditure:u,targetCaloricIntakePerDay:h,weightLossGoal:c}=e;function m(){n(!0)}return d("section",{className:"profile-details__user-info",children:[d("div",{className:"user-info__item-container",children:[r("h2",{children:"User name:"}),r("p",{children:i})]}),d("div",{className:"user-info__item-container",children:[r("h2",{children:"Full name:"}),r("p",{children:a})]}),d("div",{className:"user-info__item-container",children:[r("h2",{children:"Birth date:"}),r("p",{children:new Date(o).toLocaleDateString()})]}),d("div",{className:"user-info__item-container",children:[r("h2",{children:"Height:"}),r("p",{children:`${l} cm`})]}),d("div",{className:"user-info__item-container",children:[r("h2",{children:"Weight:"}),r("p",{children:`${s} kg`})]}),d("div",{className:"user-info__item-container",children:[r("h2",{children:"Total Daily Energy Expenditure:"}),r("p",{children:`${u} kcal`})]}),d("div",{className:"user-info__item-container",children:[r("h2",{children:"Target Caloric Intake Per Day:"}),r("p",{children:`${h} kcal`})]}),d("div",{className:"user-info__item-container",children:[r("h2",{children:"Current Weight Loss Goal:"}),r("p",{children:`${c.weightGoal} kg`})]}),d("div",{className:"user-info__item-container",children:[r("h2",{children:"days in process:"}),r("p",{children:t.length})]}),r(J,{className:"user-info__edit-btn",onClickFn:m,children:"Edit"})]})},et=()=>{const{recommendedWeight:e}=F();if(!e)return null;const t=Object.entries(e);return d("section",{className:"profile-details__items-list",children:[r("h2",{className:"profile-details__items-list__title",children:"Recommended Weight"}),r("ul",{className:"profile-details__items-list__items-container",children:t.map(([n,i])=>d("li",{className:"profile-details__items-list__item",children:[r("h3",{className:"profile-details__items-list__item__title",children:n}),d("p",{className:"profile-details__items-list__item__value",children:[i," kg"]})]},n))})]})},tt=()=>{const{caloriesToLose:e}=F();if(!e)return null;const t=Object.entries(e).map(([n,i])=>n==="dailyIntakes"?["daily intakes",i]:[n,i]);return d("section",{className:"profile-details__items-list",children:[r("h2",{className:"profile-details__items-list__title",children:"Expendable Energy"}),r("ul",{className:"profile-details__items-list__items-container",children:t.map(([n,i])=>d("li",{className:"profile-details__items-list__item",children:[r("h3",{className:"profile-details__items-list__item__title",children:n}),r("p",{className:"profile-details__items-list__item__value",children:i})]},n))})]})};const it=({children:e,className:t})=>r("footer",{className:t,children:e}),ne=({title:e,time:t})=>{const n=Object.entries(t);return d("section",{className:"profile-details__goal-calender",children:[r("h2",{className:"profile-details__goal-calender__title",children:e}),r("div",{className:"profile-details__goal-calender__list",children:n.map(([i,a])=>d("div",{className:"profile-details__goal-calender__list__item",children:[r("div",{className:"profile-details__goal-calender__list__item__value-cotnainer",children:r("h4",{children:a})}),r(it,{className:"profile-details__goal-calender__list__item__footer",children:r("h4",{children:i})})]},i))})]})},rt=()=>{var u,h;const{user:e,updateUser:t,setIsEditing:n}=F(),i={username:(e==null?void 0:e.username)||"",fullname:(e==null?void 0:e.fullname)||"",birthdate:(e==null?void 0:e.birthdate)||new Date,height:(e==null?void 0:e.height)||0,weight:(e==null?void 0:e.weight)||0,totalDailyEnergyExpenditure:(e==null?void 0:e.totalDailyEnergyExpenditure)||0,targetCaloricIntakePerDay:(e==null?void 0:e.targetCaloricIntakePerDay)||0,weightGoal:(e==null?void 0:e.weightLossGoal)||ye.getUtilWeightLossGoal()},{control:a,handleSubmit:o}=Fe({defaultValues:i});if(!e)return null;function l(){n(!1)}function s(c){if(!e)return;const m={...e,...c};t(m),n(!1)}return d("form",{className:"user-edit-form",onSubmit:o(s),children:[d("div",{className:"user-edit__item-container",children:[r("label",{htmlFor:"username",children:"user name:"}),r(O,{name:"username",control:a,render:({field:c})=>r("input",{id:"username",...c})})]}),d("div",{className:"user-edit__item-container",children:[r("label",{htmlFor:"fullname",children:"full name:"}),r(O,{name:"fullname",control:a,render:({field:c})=>r("input",{id:"fullname",...c})})]}),d("div",{className:"user-edit__item-container",children:[r("label",{htmlFor:"birthdate",children:"birthdate:"}),r(O,{name:"birthdate",control:a,render:({field:c})=>r("input",{id:"birthdate",type:"date",value:new Date(c.value).toISOString().split("T")[0],onChange:m=>c.onChange(new Date(m.target.value))})})]}),d("div",{className:"user-edit__item-container",children:[r("label",{htmlFor:"height",children:"height:"}),r(O,{name:"height",control:a,render:({field:c})=>r("input",{id:"height",type:"number",...c})})]}),d("div",{className:"user-edit__item-container",children:[r("label",{htmlFor:"weight",children:"weight:"}),r(O,{name:"weight",control:a,render:({field:c})=>r("input",{id:"weight",type:"number",...c})})]}),d("div",{className:"user-edit__item-container",children:[r("label",{htmlFor:"startingWeight",children:"goal weight - current:"}),r(O,{name:"weightLossGoal.startingWeight",control:a,defaultValue:(u=e.weightLossGoal)==null?void 0:u.startingWeight,render:({field:c})=>r("input",{id:"startingWeight",type:"number",...c})})]}),d("div",{className:"user-edit__item-container",children:[r("label",{htmlFor:"weightGoal",children:"goal weight - goal:"}),r(O,{name:"weightLossGoal.weightGoal",control:a,defaultValue:(h=e.weightLossGoal)==null?void 0:h.weightGoal,render:({field:c})=>r("input",{id:"weightGoal",type:"number",...c})})]}),d("div",{className:"user-edit__btns-container",children:[r(J,{onClickFn:l,children:"cancel"}),r(J,{type:"submit",children:"update"})]})]})},nt=()=>{const{weightToLose:e}=F();return d("section",{className:"profile-details__items-list",children:[r("h2",{className:"profile-details__items-list__title",children:"Weight To Lose"}),r("ul",{className:"profile-details__items-list__items-container",children:r("li",{className:"profile-details__items-list__item",children:d("p",{className:"profile-details__items-list__item__value",children:[e," kg"]})})})]})},ht=()=>{const{user:e,isLoading:t,isSuccess:n,isError:i,timeToMaxRecommendedWeight:a,timeToCurrentWeightLossGoal:o,isEditing:l}=F();return t?r(ae,{withContainer:!0,containerSize:{width:"100%"}}):i?r(oe,{msg:"Something went wrong"}):!n||!e?null:d("main",{className:"page profile-details",children:[l?r(rt,{}):r(Ze,{}),r(Qe,{}),r(ve,{}),o&&r(ne,{title:"time to current weight loss goal",time:o}),r(et,{}),r(nt,{}),r(tt,{}),a&&r(ne,{title:"time to max recommended weight",time:a}),r(ge,{})]})};export{ht as default};