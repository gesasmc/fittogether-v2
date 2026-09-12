// FitTogether V2.0.137: Smart Coach progress plus concrete next-session adjustment suggestions.
const read309=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const num309=v=>{const n=Number(v);return Number.isFinite(n)?n:0}
const maybe309=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null}
const esc309=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const norm309=v=>String(v||'').toLocaleLowerCase('de-DE').replace(/[^a-z0-9äöüß]+/g,' ').trim()
const cardio309=s=>s?.kind==='cardio'||s?.loadType==='cardio'
const strengthRows309=()=>{const rows=[];read309('ft-completed-workouts',[]).forEach((w,wi)=>{const date=num309(w?.date);(Array.isArray(w?.sets)?w.sets:[]).forEach(s=>{const name=String(s?.exercise||'').trim();if(!name||cardio309(s))return;rows.push({wi,date,name,key:norm309(name),reps:num309(s?.actualReps??s?.reps??s?.plannedReps),weight:num309(s?.actualWeight??s?.weight??s?.plannedWeight),extra:num309(s?.actualExtraWeight??s?.extraWeight??s?.plannedExtraWeight),loadType:String(s?.loadType||''),rir:maybe309(s?.rir),rirTarget:maybe309(s?.rirTarget)})})});return rows}
const avg309=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null
const sessions309=(rows,key)=>{const map=new Map();rows.filter(r=>r.key===key).forEach(r=>{const id=`${r.wi}|${r.date}`;if(!map.has(id))map.set(id,{date:r.date,sets:[]});map.get(id).sets.push(r)});return[...map.values()].sort((a,b)=>a.date-b.date).map(x=>{const weighted=x.sets.filter(s=>s.weight>0||s.extra>0),maxLoad=weighted.length?Math.max(...weighted.map(s=>s.weight+s.extra)):0,maxReps=Math.max(0,...x.sets.map(s=>s.reps)),atMax=weighted.filter(s=>s.weight+s.extra===maxLoad),repsAtLoad=Math.max(0,...atMax.map(s=>s.reps)),loadType=atMax[0]?.loadType||x.sets[0]?.loadType||'',rir=avg309(x.sets.map(s=>s.rir).filter(v=>v!=null)),rirTarget=avg309(x.sets.map(s=>s.rirTarget).filter(v=>v!=null));return{...x,maxLoad,maxReps,repsAtLoad,loadType,rir,rirTarget}})}
const compare309=s=>{const last=s.at(-1),prev=s.at(-2);if(!last||!prev)return{state:'new',text:'Noch wenig Vergleichsdaten'};if(last.maxLoad>prev.maxLoad)return{state:'up',text:`+${(last.maxLoad-prev.maxLoad).toLocaleString('de-DE',{maximumFractionDigits:1})} kg`};if(last.maxLoad<prev.maxLoad)return{state:'down',text:'Letztes Mal leichter'};const a=last.maxLoad>0?last.repsAtLoad:last.maxReps,b=prev.maxLoad>0?prev.repsAtLoad:prev.maxReps;if(a>b)return{state:'up',text:`+${a-b} Wdh.`};if(a<b)return{state:'down',text:`${a-b} Wdh.`};if(s.length>=3){const p2=s.at(-3),a2=p2?.maxLoad===last.maxLoad?(last.maxLoad>0?p2.repsAtLoad:p2.maxReps):null;if(a2!=null&&a2===a)return{state:'stalled',text:'3 Einheiten stabil'}}return{state:'stable',text:'Leistung stabil'}}
const currentExercises309=box=>[...box.querySelectorAll('.smart-preview-v297 span')].map(x=>x.textContent?.trim()).filter(Boolean).filter(x=>!/^\+\d+ weitere$/i.test(x))
const weights309=t=>{const key=/dumbbell|kurzhantel/i.test(t)?'ft-dumbbell-weights':/barbell|langhantel/i.test(t)?'ft-barbell-weights':'';if(!key)return[];const raw=read309(key,[]);return[...new Set((Array.isArray(raw)?raw:[]).map(x=>typeof x==='object'?(x?.weight??x?.value??x?.kg):x).map(num309).filter(x=>x>0))].sort((a,b)=>a-b)}
const suffix309=t=>/dumbbell|kurzhantel/i.test(t)?' kg/Arm':/barbell|langhantel/i.test(t)?' kg gesamt':' kg'
const nextLoad309=s=>{if(!s?.maxLoad)return null;return weights309(s.loadType).find(x=>x>s.maxLoad+.001)||null}
const perfValue309=s=>s?(s.maxLoad>0?s.maxLoad*1000+(s.repsAtLoad||0):s.maxReps||0):0
const fmtRir309=v=>v==null?'':v.toLocaleString('de-DE',{minimumFractionDigits:v%1?1:0,maximumFractionDigits:1})
const advice309=(sessions,cmp)=>{
  const last=sessions.at(-1),prev=sessions.at(-2),third=sessions.at(-3);if(!last||!prev)return{action:'Daten sammeln',detail:'Noch 1–2 Einheiten für eine sichere Anpassung.'}
  const rir=last.rir,target=last.rirTarget,next=nextLoad309(last),loadUp=last.maxLoad>prev.maxLoad,repNow=last.maxLoad>0?last.repsAtLoad:last.maxReps,repPrev=prev.maxLoad>0?prev.repsAtLoad:prev.maxReps,repUp=last.maxLoad===prev.maxLoad&&repNow>repPrev
  const repeatedDown=!!third&&perfValue309(last)<perfValue309(prev)&&perfValue309(prev)<perfValue309(third)
  const reserveHigh=rir!=null&&(rir>=2.5||(target!=null&&rir>=target+1))
  const nearLimit=rir!=null&&(rir<=1||(target!=null&&rir<target-.5))
  if(repeatedDown)return{action:'Gewicht halten',detail:'Zwei Einheiten rückläufig. Erholung und RIR prüfen; erst bei erneutem Rückgang ca. 5 % reduzieren.'}
  if(cmp.state==='down')return{action:'Gewicht halten',detail:'Noch nicht erhöhen. Nächste Einheit sauber bestätigen und RIR beobachten.'}
  if(cmp.state==='stalled'){
    if(nearLimit)return{action:'Gewicht halten',detail:`RIR Ø ${fmtRir309(rir)} ist schon nah am Limit. Erst Leistung stabilisieren.`}
    if(reserveHigh)return{action:'+1–2 Wdh.',detail:`RIR Ø ${fmtRir309(rir)} zeigt noch Reserve. Erst Wiederholungen erhöhen.`}
    return{action:'+1 Wdh. anpeilen',detail:'Drei Einheiten stabil. Kleine Wiederholungssteigerung vor mehr Gewicht.'}
  }
  if(cmp.state==='up'){
    if(loadUp)return{action:'Gewicht halten',detail:'Die Gewichtssteigerung zuerst noch einmal sauber bestätigen.'}
    if(repUp&&reserveHigh&&next)return{action:`${next.toLocaleString('de-DE',{maximumFractionDigits:1})}${suffix309(last.loadType)} testen`,detail:`Mehr Wiederholungen mit RIR Ø ${fmtRir309(rir)}. Nächste verfügbare Gewichtsstufe ist sinnvoll.`}
    if(repUp)return{action:'+1 Wdh. anpeilen',detail:'Fortschritt ist da. Wiederholungen weiter ausbauen, bevor das Gewicht erneut steigt.'}
  }
  if(cmp.state==='stable'){
    if(nearLimit)return{action:'Gewicht halten',detail:`RIR Ø ${fmtRir309(rir)} lässt kaum Reserve. Kein Gewichtssprung nötig.`}
    if(reserveHigh&&next)return{action:`${next.toLocaleString('de-DE',{maximumFractionDigits:1})}${suffix309(last.loadType)} testen`,detail:`Stabil mit RIR Ø ${fmtRir309(rir)}. Nächste verfügbare Stufe kann getestet werden.`}
    if(rir!=null&&rir>=2)return{action:'+1–2 Wdh.',detail:`RIR Ø ${fmtRir309(rir)} zeigt noch etwas Reserve.`}
    return{action:'Gewicht halten',detail:'Leistung bestätigen; ohne klare Reserve kein automatischer Gewichtssprung.'}
  }
  return{action:'Gewicht halten',detail:'Aktuellen Stand erst noch einmal bestätigen.'}
}
const render309=()=>{const box=document.querySelector('.smart-today-v297');if(!box||document.querySelector('.active-training,.rest-overlay,.training-overlay'))return;const names=currentExercises309(box);if(!names.length){box.querySelector('.smart-progress-v309')?.remove();return}const rows=strengthRows309(),items=names.map(name=>{const s=sessions309(rows,norm309(name)),cmp=compare309(s);return{name,cmp,count:s.length,advice:advice309(s,cmp),last:s.at(-1)}}).filter(x=>x.count>0);if(!items.length){box.querySelector('.smart-progress-v309')?.remove();return}const up=items.filter(x=>x.cmp.state==='up').length,stalled=items.filter(x=>x.cmp.state==='stalled').length,down=items.filter(x=>x.cmp.state==='down').length,stable=items.length-up-stalled-down;const sig=items.map(x=>`${x.name}:${x.cmp.state}:${x.cmp.text}:${x.count}:${x.advice.action}:${x.advice.detail}`).join('|');let panel=box.querySelector('.smart-progress-v309');if(!panel){panel=document.createElement('div');panel.className='smart-progress-v309';const reason=box.querySelector('.smart-reason-v297');reason?.insertAdjacentElement('afterend',panel)||box.querySelector('.smart-preview-v297')?.insertAdjacentElement('beforebegin',panel)||box.appendChild(panel)}if(panel.dataset.sig===sig)return;panel.dataset.sig=sig;let message='Die letzten Einheiten sind überwiegend stabil.';if(up)message=`${up} Übung${up>1?'en':''} zeigt${up>1?'en':''} Fortschritt. Der Coach legt daraus das nächste sinnvolle Ziel ab.`;else if(stalled)message=`${stalled} Übung${stalled>1?'en':''} stagniert${stalled>1?'en':''}. Kleine Anpassungen sind sinnvoller als große Gewichtssprünge.`;else if(down)message='Ein Teil der Leistung lag zuletzt niedriger. Erst stabilisieren, dann wieder steigern.';panel.innerHTML=`<div class="smart-progress-head-v309"><div><small>SMART COACH · NÄCHSTE EINHEIT</small><strong>Fortschritt & Anpassung</strong></div><div class="smart-progress-badges-v309">${up?`<span class="up">↑ ${up}</span>`:''}${stalled?`<span class="warn">• ${stalled}</span>`:''}${stable?`<span>${stable}</span>`:''}</div></div><p>${esc309(message)}</p><div class="smart-progress-list-v309">${items.slice(0,3).map(x=>`<div class="${x.cmp.state}"><div class="smart-progress-row-v309"><span>${esc309(x.name)}</span><b>${esc309(x.cmp.text)}</b></div><div class="smart-next-v309"><small>NÄCHSTES ZIEL</small><strong>${esc309(x.advice.action)}</strong><em>${esc309(x.advice.detail)}</em></div></div>`).join('')}</div>`}
let q309=false
const schedule309=()=>{if(q309)return;q309=true;requestAnimationFrame(()=>{q309=false;render309()})}
if(typeof document!=='undefined'){const start=()=>{render309();new MutationObserver(schedule309).observe(document.body,{childList:true,subtree:true});window.addEventListener('pageshow',schedule309);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule309()})};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
