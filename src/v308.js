// FitTogether V2.0.135: per-exercise strength progress in statistics.
const read308=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write308=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const num308=v=>{const n=Number(v);return Number.isFinite(n)?n:0}
const esc308=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const fmt308=(v,d=1)=>num308(v).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d})
const cardio308=s=>s?.kind==='cardio'||s?.loadType==='cardio'
const statsPage308=()=>[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.includes('Deine Statistik'))
const strengthSets308=()=>{
  const workouts=read308('ft-completed-workouts',[]),rows=[]
  workouts.forEach((w,wi)=>{const date=num308(w?.date);(Array.isArray(w?.sets)?w.sets:[]).forEach((s,si)=>{const name=String(s?.exercise||'').trim();if(!name||cardio308(s))return;rows.push({name,date,wi,si,reps:num308(s?.actualReps??s?.reps??s?.plannedReps),weight:num308(s?.actualWeight??s?.weight??s?.plannedWeight),extra:num308(s?.actualExtraWeight??s?.extraWeight??s?.plannedExtraWeight),loadType:String(s?.loadType||'')})})});return rows
}
const sessions308=(rows,name)=>{
  const target=name.toLocaleLowerCase('de-DE'),map=new Map()
  rows.filter(r=>r.name.toLocaleLowerCase('de-DE')===target).forEach(r=>{const key=`${r.wi}|${r.date}`;if(!map.has(key))map.set(key,{date:r.date,sets:[]});map.get(key).sets.push(r)})
  return [...map.values()].sort((a,b)=>a.date-b.date).map(x=>{
    const weighted=x.sets.filter(s=>s.weight>0||s.extra>0),maxLoad=weighted.length?Math.max(...weighted.map(s=>s.weight+s.extra)):0
    const atMax=weighted.filter(s=>s.weight+s.extra===maxLoad),maxReps=Math.max(0,...x.sets.map(s=>s.reps)),repsAtLoad=Math.max(0,...atMax.map(s=>s.reps)),volume=x.sets.reduce((sum,s)=>sum+(s.weight+s.extra)*s.reps,0)
    const loadType=atMax[0]?.loadType||x.sets[0]?.loadType||''
    return{...x,maxLoad,maxReps,repsAtLoad,volume,loadType}
  })
}
const loadSuffix308=t=>/dumbbell|kurzhantel/i.test(t)?' kg/Arm':/barbell|langhantel/i.test(t)?' kg gesamt':' kg'
const performance308=s=>s?(s.maxLoad>0?`${fmt308(s.maxLoad)}${loadSuffix308(s.loadType)} × ${s.repsAtLoad||'–'}`:`${s.maxReps||'–'} Wdh.`):'–'
const best308=sessions=>{
  if(!sessions.length)return null
  return sessions.reduce((best,s)=>{if(!best)return s;if(s.maxLoad!==best.maxLoad)return s.maxLoad>best.maxLoad?s:best;if(s.repsAtLoad!==best.repsAtLoad)return s.repsAtLoad>best.repsAtLoad?s:best;return s.maxReps>best.maxReps?s:best},null)
}
const trendText308=(prev,last)=>{
  if(!prev||!last)return'Noch nicht genug Vergleichsdaten.'
  if(last.maxLoad>prev.maxLoad)return`Gewicht +${fmt308(last.maxLoad-prev.maxLoad)} kg gegenüber dem letzten Mal.`
  if(last.maxLoad<prev.maxLoad)return`Gewicht ${fmt308(last.maxLoad-prev.maxLoad)} kg gegenüber dem letzten Mal.`
  const a=last.maxLoad>0?last.repsAtLoad:last.maxReps,b=prev.maxLoad>0?prev.repsAtLoad:prev.maxReps,d=a-b
  if(d>0)return`Bei gleichem Gewicht +${d} Wdh. gegenüber dem letzten Mal.`
  if(d<0)return`Bei gleichem Gewicht ${d} Wdh. gegenüber dem letzten Mal.`
  return'Leistung gegenüber dem letzten Mal stabil.'
}
const bars308=sessions=>{
  const recent=sessions.slice(-6),weighted=recent.some(s=>s.maxLoad>0),values=recent.map(s=>weighted?s.maxLoad:s.maxReps),max=Math.max(1,...values)
  return`<div class="exercise-bars-v308">${recent.map((s,i)=>{const h=Math.max(14,Math.round(values[i]/max*100)),date=s.date?new Date(s.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}):'–';return`<div><i style="height:${h}%"></i><small>${date}</small></div>`}).join('')}</div>`
}
const renderExercise308=(panel,rows,names,selected)=>{
  const body=panel.querySelector('.stats-accordion-body-v306'),sessions=sessions308(rows,selected),last=sessions.at(-1),prev=sessions.at(-2),best=best308(sessions)
  const bestWeight=best?.maxLoad>0?`${fmt308(best.maxLoad)}${loadSuffix308(best.loadType)}`:'–',bestReps=best?(best.maxLoad>0?best.repsAtLoad:best.maxReps):0
  body.innerHTML=`<label class="exercise-select-v308"><span>Übung auswählen</span><select data-exercise308>${names.map(n=>`<option${n===selected?' selected':''}>${esc308(n)}</option>`).join('')}</select></label>${sessions.length?`<div class="exercise-progress-grid-v308"><div><small>BESTLEISTUNG</small><strong>${bestWeight}</strong><span>${bestReps?`${bestReps} Wdh.`:'bisher'}</span></div><div><small>LETZTES MAL</small><strong>${performance308(prev)}</strong><span>${prev?.date?new Date(prev.date).toLocaleDateString('de-DE'):'–'}</span></div><div><small>AKTUELL</small><strong>${performance308(last)}</strong><span>${last?.date?new Date(last.date).toLocaleDateString('de-DE'):'–'}</span></div></div><div class="exercise-trend-v308"><div><small>ENTWICKLUNG · LETZTE ${Math.min(6,sessions.length)} EINHEITEN</small><strong>${esc308(trendText308(prev,last))}</strong></div>${bars308(sessions)}</div>`:'<p class="exercise-empty-v308">Für diese Übung gibt es noch keine abgeschlossenen Kraftsätze.</p>'}`
  body.querySelector('[data-exercise308]')?.addEventListener('change',e=>{write308('ft-progress-exercise-v308',e.target.value);renderExercise308(panel,rows,names,e.target.value)})
}
const enhance308=()=>{
  const stats=statsPage308(),hub=stats?.querySelector('.stats-hub-v306');if(!stats||!hub)return
  const rows=strengthSets308(),map=new Map();rows.forEach(r=>map.set(r.name.toLocaleLowerCase('de-DE'),r.name));const names=[...map.values()].sort((a,b)=>a.localeCompare(b,'de-DE'))
  let panel=hub.querySelector('.exercise-progress-v308')
  if(!panel){panel=document.createElement('details');panel.className='stats-accordion-v306 exercise-progress-v308';panel.innerHTML='<summary><span><small>FORTSCHRITT</small><strong>Übungsfortschritt</strong></span><b>›</b></summary><div class="stats-accordion-body-v306"></div>';const training=hub.querySelector('.training-stats-v307')||hub.querySelector('.training-history-wrap-v306');training?hub.insertBefore(panel,training):hub.appendChild(panel)}
  const saved=String(read308('ft-progress-exercise-v308','')||''),selected=names.includes(saved)?saved:(names.at(-1)||'')
  const signature=[rows.length,names.length,selected,rows.at(-1)?.date||0,rows.at(-1)?.weight||0,rows.at(-1)?.reps||0].join('|');if(panel.dataset.signature===signature)return;panel.dataset.signature=signature
  if(!names.length){panel.querySelector('.stats-accordion-body-v306').innerHTML='<p class="exercise-empty-v308">Nach deinem ersten aufgezeichneten Krafttraining erscheint hier der Fortschritt pro Übung.</p>';return}
  renderExercise308(panel,rows,names,selected)
}
let q308=false
const schedule308=()=>{if(q308)return;q308=true;requestAnimationFrame(()=>{q308=false;enhance308()})}
if(typeof document!=='undefined'){const start=()=>{enhance308();new MutationObserver(schedule308).observe(document.body,{childList:true,subtree:true});window.addEventListener('pageshow',schedule308);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule308()})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
