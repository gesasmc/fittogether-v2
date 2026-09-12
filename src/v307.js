// FitTogether V2.0.134: compact progress and training statistics.
const read307=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const num307=v=>{const n=Number(v);return Number.isFinite(n)?n:0}
const fmt307=(v,d=1)=>num307(v).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d})
const statsPage307=()=>[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.includes('Deine Statistik'))
const sets307=x=>Array.isArray(x?.sets)?x.sets:[]
const cardioSet307=s=>s?.kind==='cardio'||s?.loadType==='cardio'
const hasCardio307=x=>x?.kind==='cardio'||sets307(x).some(cardioSet307)||x?.actualSeconds!=null||x?.durationSeconds!=null
const hasStrength307=x=>{const sets=sets307(x);if(sets.length)return sets.some(s=>!cardioSet307(s));return x?.kind!=='cardio'}
const cardioSeconds307=x=>{const cardio=sets307(x).filter(cardioSet307);if(cardio.length)return cardio.reduce((sum,s)=>sum+(num307(s?.durationSeconds)||num307(s?.durationMinutes)*60),0);return hasCardio307(x)?(num307(x?.actualSeconds)||num307(x?.durationSeconds)):0}
const date307=x=>new Date(num307(x?.date)||0)
const startWeek307=()=>{const d=new Date();d.setHours(0,0,0,0);const day=d.getDay()||7;d.setDate(d.getDate()-day+1);return d.getTime()}
const startMonth307=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),1).getTime()}
const metric307=(label,value,sub='')=>`<div class="progress-metric-v307"><small>${label}</small><strong>${value}</strong>${sub?`<span>${sub}</span>`:''}</div>`
const renderWeightTrend307=stats=>{
  const wrap=stats.querySelector('.weight-history-wrap-v306'),body=wrap?.querySelector('.stats-accordion-body-v306');if(!body)return
  const weights=read307('ft-weight-history',[]).filter(x=>num307(x?.weight)>0).slice().sort((a,b)=>num307(a?.date)-num307(b?.date))
  const goal=num307(read307('ft-weight-goal-v305',null)?.weight),first=num307(weights[0]?.weight),current=num307(weights.at(-1)?.weight),delta=first&&current?current-first:0
  const sig=[weights.length,first,current,goal].join('|');let box=body.querySelector('.weight-trend-v307')
  if(!box){box=document.createElement('div');box.className='weight-trend-v307';body.prepend(box)}if(box.dataset.signature===sig)return;box.dataset.signature=sig
  const change=!first||!current?'–':`${delta>0?'+':''}${fmt307(delta)} kg`
  box.innerHTML=`<div class="progress-grid-v307">${metric307('START',first?`${fmt307(first)} kg`:'–')}${metric307('AKTUELL',current?`${fmt307(current)} kg`:'–')}${metric307('ZIEL',goal?`${fmt307(goal)} kg`:'–')}${metric307('VERÄNDERUNG',change)}</div>`
}
const renderTrainingStats307=(stats,hub)=>{
  const rows=read307('ft-completed-workouts',[]),weekStart=startWeek307(),monthStart=startMonth307()
  const valid=rows.filter(x=>num307(x?.date)>0),week=valid.filter(x=>num307(x.date)>=weekStart),month=valid.filter(x=>num307(x.date)>=monthStart)
  const strength=valid.filter(hasStrength307).length,cardio=valid.filter(hasCardio307).length,cardioMin=Math.round(valid.reduce((sum,x)=>sum+cardioSeconds307(x),0)/60)
  const sig=[valid.length,week.length,month.length,strength,cardio,cardioMin,valid.at(-1)?.date||0].join('|')
  let panel=hub.querySelector('.training-stats-v307')
  if(!panel){panel=document.createElement('details');panel.className='stats-accordion-v306 training-stats-v307';panel.innerHTML='<summary><span><small>AUSWERTUNG</small><strong>Training & Aktivität</strong></span><b>›</b></summary><div class="stats-accordion-body-v306"></div>';const history=hub.querySelector('.training-history-wrap-v306');history?hub.insertBefore(panel,history):hub.appendChild(panel)}
  if(panel.dataset.signature===sig)return;panel.dataset.signature=sig
  panel.querySelector('.stats-accordion-body-v306').innerHTML=`<div class="progress-grid-v307 training-grid-v307">${metric307('DIESE WOCHE',String(week.length),week.length===1?'Training':'Trainings')}${metric307('DIESEN MONAT',String(month.length),month.length===1?'Training':'Trainings')}${metric307('KRAFT / CARDIO',`${strength} / ${cardio}`,'absolvierte Einheiten')}${metric307('CARDIO GESAMT',`${cardioMin} Min.`,'aufgezeichnet')}</div>${valid.length?'<p class="progress-note-v307">Gemischte Trainings zählen bei Kraft und Cardio jeweils mit.</p>':'<p class="progress-note-v307">Sobald du Trainings abschließt, erscheint hier deine Auswertung.</p>'}`
}
const enhance307=()=>{const stats=statsPage307();if(!stats)return;const hub=stats.querySelector('.stats-hub-v306');if(!hub)return;renderWeightTrend307(stats);renderTrainingStats307(stats,hub)}
let queued307=false
const schedule307=()=>{if(queued307)return;queued307=true;requestAnimationFrame(()=>{queued307=false;enhance307()})}
if(typeof document!=='undefined'){const start=()=>{enhance307();new MutationObserver(schedule307).observe(document.body,{childList:true,subtree:true});window.addEventListener('pageshow',schedule307);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule307()})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
