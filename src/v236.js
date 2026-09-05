// FitTogether V2.0.36: replace duplicated weight summary cards with training metrics.
export const FITTOGETHER_VERSION='V2.0.36'
const read236=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)??JSON.stringify(fallback))}catch{return fallback}}

const updateStatsCards236=()=>{
  const stats=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.includes('Statistik'))
  if(!stats)return
  const cards=[...stats.querySelectorAll('.stat-grid-v216 > div')]
  if(cards.length<4)return
  const completed=read236('ft-completed-workouts',[])
  const totalExercises=completed.reduce((sum,x)=>sum+(Number(x?.exercises)||1),0)
  const cardioSeconds=completed.reduce((sum,x)=>sum+(x?.kind==='cardio'||x?.actualSeconds!=null?(Number(x?.actualSeconds)||Number(x?.durationSeconds)||0):0),0)
  const cardioMinutes=Math.round(cardioSeconds/60)
  cards[2].innerHTML=`<strong>${totalExercises}</strong><span>ÜBUNGEN GESAMT</span>`
  cards[3].innerHTML=`<strong>${cardioMinutes} Min.</strong><span>CARDIO GESAMT</span>`
}

let scheduled236=false
const enhance236=()=>{scheduled236=false;updateStatsCards236();document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(t.includes('V2.0.35'))el.textContent=t.replaceAll('V2.0.35',FITTOGETHER_VERSION)})}
const schedule236=()=>{if(scheduled236)return;scheduled236=true;requestAnimationFrame(enhance236)}
if(typeof document!=='undefined'){
  const observer=new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule236()})
  const start=()=>{enhance236();observer.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
