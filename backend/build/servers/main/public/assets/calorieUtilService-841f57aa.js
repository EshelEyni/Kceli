function l(e,r){return!e||!r?0:(r.targetCaloricIntake||e.targetCaloricIntakePerDay)-s(r)}function u(e,r){if(!e||!r)return 0;const t=r.totalDailyEnergyExpenditure||e.totalDailyEnergyExpenditure,c=(s(r)-t)/7700;return Number(c.toFixed(2))}function s(e){switch(!0){case!e:return 0;case(e&&"intakes"in e):return n({dailyData:e});case(e&&"items"in e):return F(e);default:return 0}}function n({dailyData:e,isRecorded:r=!0}){return Math.round(e.intakes.filter(t=>t.isRecorded===r).reduce((t,o)=>o.items.reduce((a,c)=>a+(c.calories??0),t),0))}function F(e){return e.items.reduce((r,t)=>r+t.calories,0)}function x({targetCalorie:e,consumedCalories:r}){const t=[{excessRate:0,color:"#005FB3"},{excessRate:10,color:"#4682B4"},{excessRate:20,color:"#FFFF99"},{excessRate:30,color:"#ffea00"},{excessRate:40,color:"#FF7F7F"},{excessRate:50,color:"#FF0000"},{excessRate:60,color:"#8B0000"},{excessRate:70,color:"#800000"},{excessRate:80,color:"#660000"},{excessRate:90,color:"#330000"},{excessRate:100,color:"#171717"}],a=r/e*100-100,c=t.find(i=>i.excessRate>=a);return(c==null?void 0:c.color)||"#171717"}const f={calcRemainingCalories:l,getBcgByCosumedCalories:x,getTotalCalories:s,calcEstimatedBodyFatStatusPerDay:u,getTotalCaloriesFromDailyData:n};export{f as c};
