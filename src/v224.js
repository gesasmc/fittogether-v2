// FitTogether V2.0.24: equipment selection + adaptive Smart Trainer.
const read224=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
const rawSet224=Storage.prototype.setItem
const write224=(key,value)=>{try{rawSet224.call(localStorage,key,JSON.stringify(value))}catch{}}
const norm224=s=>String(s||'').trim().toLowerCase()
const EQUIPMENT224=[
  ['dumbbell','Kurzhanteln'],['barbell','Langhantel'],['bench','Hantelbank'],['band','Widerstandsbänder'],
  ['cable','Kabelzug'],['pullupbar','Klimmzugstange'],['kettlebell','Kettlebell'],['machine','Kraftmaschinen'],
  ['smith','Multipresse'],['rower','Rudergerät'],['bike','Ergometer / Indoor Bike'],['treadmill','Laufband'],['elliptical','Crosstrainer']
]
const DEFAULT_EQUIPMENT224=['dumbbell','barbell','bench','band','rower','bike']
const equipment224=()=>read224('ft-equipment',DEFAULT_EQUIPMENT224)
const has224=k=>equipment224().includes(k)
const eqLabel224=k=>EQUIPMENT224.find(x=>x[0]===k)?.[1]||k
const ex224=(name,query,sets=3,reps='8–12',equipment='bodyweight')=>({name,query,sets,reps,equipment,smartGenerated:true})
const requirement224=x=>{
  const n=norm224(x?.name),q=norm224(x?.query)
  if(n.includes('kurzhantel')||q.includes('dumbbell'))return'dumbbell'
  if(n.includes('langhantel')||q.includes('barbell'))return'barbell'
  if(n.includes('latziehen')||n.includes('trizepsdrücken')||q.includes('cable'))return'cable'
  if(n.includes('klimmzug')||q.includes('pull up')||q.includes('pull-up'))return'pullupbar'
  if(n.includes('beinpresse')||n.includes('beinstrecken')||n.includes('beinbeugen')||q.includes('leg press')||q.includes('leg extension')||q.includes('leg curl'))return'machine'
  return'bodyweight'
}
const replacement224=x=>{
  const n=norm224(x?.name),sets=x?.sets||3,reps=x?.reps||'8–12'
  if(n.includes('bankdrücken')||n.includes('brust-fliegende'))return ex224('Liegestütz','push up',sets,reps)
  if(n.includes('schulterdrücken')||n.includes('seitheben'))return has224('band')?ex224('Schulterdrücken mit Widerstandsband','band shoulder press',sets,reps,'band'):ex224('Pike Push Up','pike push up',sets,reps)
  if(n.includes('trizepsdrücken'))return ex224('Enge Liegestütze','close grip push up',sets,reps)
  if(n.includes('latziehen'))return has224('pullupbar')?ex224('Klimmzug','pull up',sets,reps,'pullupbar'):has224('band')?ex224('Rudern mit Widerstandsband','band seated row',sets,reps,'band'):ex224('Superman','superman',sets,reps)
  if(n.includes('langhantelrudern'))return has224('dumbbell')?ex224('Kurzhantelrudern','dumbbell bent over row',sets,reps,'dumbbell'):has224('band')?ex224('Rudern mit Widerstandsband','band seated row',sets,reps,'band'):ex224('Superman','superman',sets,reps)
  if(n.includes('rumänisches kreuzheben'))return has224('dumbbell')?ex224('Rumänisches Kreuzheben mit Kurzhanteln','dumbbell romanian deadlift',sets,reps,'dumbbell'):ex224('Hip Hinge','bodyweight hip hinge',sets,reps)
  if(n.includes('beinpresse'))return ex224('Kniebeuge','bodyweight squat',sets,reps)
  if(n.includes('beinbeugen'))return ex224('Glute Bridge','glute bridge',sets,reps)
  if(n.includes('beinstrecken'))return ex224('Ausfallschritte','reverse lunge',sets,reps)
  if(n.includes('hip thrust'))return ex224('Glute Bridge','glute bridge',sets,reps)
  if(n.includes('kniebeuge'))return has224('dumbbell')?ex224('Goblet Squat','dumbbell goblet squat',sets,reps,'dumbbell'):ex224('Kniebeuge','bodyweight squat',sets,reps)
  return ex224(x?.name||'Körpergewichtsübung',x?.query||x?.name||'bodyweight exercise',sets,reps)
}
const compatible224=x=>{const req=requirement224(x);return req==='bodyweight'||has224(req)}
const focusCandidate224=focus=>{
  if(focus==='Brust')return has224('dumbbell')&&has224('bench')?ex224('Kurzhantel-Bankdrücken','dumbbell bench press',3,'8–12','dumbbell'):ex224('Liegestütz','push up',3,'8–15')
  if(focus==='Rücken')return has224('cable')?ex224('Latziehen','cable lat pulldown',3,'8–12','cable'):has224('pullupbar')?ex224('Klimmzug','pull up',3,'6–10','pullupbar'):has224('dumbbell')?ex224('Kurzhantelrudern','dumbbell bent over row',3,'8–12','dumbbell'):has224('band')?ex224('Rudern mit Widerstandsband','band seated row',3,'10–15','band'):ex224('Superman','superman',3,'12–15')
  if(focus==='Beine')return has224('barbell')?ex224('Kniebeuge','barbell squat',3,'8–12','barbell'):has224('dumbbell')?ex224('Goblet Squat','dumbbell goblet squat',3,'8–12','dumbbell'):ex224('Kniebeuge','bodyweight squat',3,'12–20')
  if(focus==='Schultern')return has224('dumbbell')?ex224('Schulterdrücken','dumbbell shoulder press',3,'8–12','dumbbell'):has224('band')?ex224('Schulterdrücken mit Widerstandsband','band shoulder press',3,'10–15','band'):ex224('Pike Push Up','pike push up',3,'8–12')
  if(focus==='Arme')return has224('dumbbell')?ex224('Bizeps-Curl','dumbbell biceps curl',3,'10–15','dumbbell'):has224('band')?ex224('Bizeps-Curl mit Widerstandsband','band biceps curl',3,'10–15','band'):ex224('Enge Liegestütze','close grip push up',3,'8–15')
  return null
}
const nextWeight224=(req,current)=>{
  const weights=req==='dumbbell'?read224('ft-dumbbell-weights',[]):req==='barbell'?read224('ft-barbell-weights',[]):[]
  return weights.find(v=>Number(v)>Number(current))??null
}
const parseReps224=v=>{const m=String(v??'').match(/\d+/g);return m?Number(m.at(-1)):0}
const adaptPerformance224=x=>{
  if(x?.warmup)return x
  const allSettings=read224('ft-exercise-settings',{}),key=norm224(x.name),s={...(allSettings[key]||{})}
  const hist=read224('ft-exercise-history',[]).filter(h=>norm224(h.exercise)===key),last=hist.at(-1)
  if(!last)return x
  const req=requirement224(x),noWeight=Boolean(s.noWeight),currentReps=Number(s.reps)||Number(last.reps)||parseReps224(x.reps)||10,currentWeight=noWeight?0:Number(s.weight??last.weight)||0
  let reps=currentReps,weight=currentWeight,reason='Leistung gehalten'
  const settingsAlreadyReacted=Number(s.updatedAt||0)>Number(last.date||0)
  if(last.rir>=4){
    const recent=hist.slice(-3),veryEasy=recent.filter(h=>Number(h.rir)>=4).length
    const candidate=!noWeight&&veryEasy>=2?nextWeight224(req,currentWeight):null
    if(candidate!==null){weight=candidate;reps=Math.max(5,currentReps-2);reason=`Mehrfach RIR 4+ · Gewicht auf ${candidate} kg erhöht`}
    else if(!settingsAlreadyReacted){reps=currentReps+2;reason='RIR 4+ · Wiederholungen erhöht'}
    else reason='RIR 4+ · bereits automatisch gesteigert'
  }else if(last.rir===3){reps=currentReps+1;reason='RIR 3 · Wiederholungen leicht erhöht'}
  else if(last.rir===2){reason='RIR 2 · Ziel bestätigt'}
  else if(last.rir===1){reps=Math.max(1,currentReps-1);reason='RIR 1 · etwas entlastet'}
  else if(last.rir===0){reps=Math.max(1,currentReps-2);reason='RIR 0 · Wiederholungen reduziert'}
  allSettings[key]={...s,name:x.name,noWeight,weight,reps,updatedAt:Date.now(),smartReason:reason}
  write224('ft-exercise-settings',allSettings)
  return{...x,smartTarget:{weight,reps,rir:last.rir},smartReason:reason}
}
const applyFocus224=(exercises,focus)=>{
  if(!focus||focus==='Ausgeglichen')return exercises
  const candidate=focusCandidate224(focus);if(!candidate)return exercises
  const warm=exercises.filter(x=>x.warmup),work=exercises.filter(x=>!x.warmup)
  const token=norm224(candidate.name).split(' ')[0]
  if(work.some(x=>norm224(x.name).includes(token)))return[...warm,...work]
  if(work.length>=3)work[work.length-1]=candidate;else work.push(candidate)
  return[...warm,candidate,...work.filter(x=>x!==candidate)]
}
const adaptPlan224=plan=>{
  if(!plan||plan._smartV224)return plan
  const sessions=(plan.sessions||[]).map(session=>{
    if(typeof session==='string')return session
    let exercises=(session.exercises||[]).map(x=>x?.warmup?x:(compatible224(x)?x:replacement224(x)))
    exercises=applyFocus224(exercises,plan.focus)
    const seen=new Set();exercises=exercises.filter(x=>{const k=norm224(x.name);if(x.warmup)return true;if(seen.has(k))return false;seen.add(k);return true}).map(adaptPerformance224)
    return{...session,exercises,equipmentAware:true}
  })
  return{...plan,sessions,equipment:equipment224(),adaptive:true,_smartV224:true,adaptedAt:Date.now()}
}
// Intercept only plan saves so React immediately receives an equipment-aware adaptive plan.
Storage.prototype.setItem=function(key,value){
  if(this===localStorage&&key==='ft-plans'){
    try{const plans=JSON.parse(value);if(Array.isArray(plans)&&plans.length){plans[plans.length-1]=adaptPlan224(plans[plans.length-1]);value=JSON.stringify(plans)}}catch{}
  }
  return rawSet224.call(this,key,value)
}
const renderEquipment224=()=>{
  const page=[...document.querySelectorAll('.page h1')].find(h=>h.textContent?.trim()==='Einstellungen')?.closest('.page');if(!page)return
  if(page.querySelector('.equipment-picker-v224'))return
  const weightTitle=[...page.querySelectorAll('.section-title span')].find(s=>s.textContent?.includes('Meine Gewichte'))?.closest('.section-title')
  if(!weightTitle)return
  const card=document.createElement('div');card.className='equipment-picker-v224'
  const selected=new Set(equipment224())
  card.innerHTML=`<div class="equipment-picker-head-v224"><strong>Mein Equipment</strong><small>Der Smarte Trainer plant nur mit Dingen, die du wirklich besitzt.</small></div><div class="equipment-grid-v224">${EQUIPMENT224.map(([id,name])=>`<button type="button" data-eq="${id}" class="${selected.has(id)?'active':''}"><span>${selected.has(id)?'✓':'+'}</span><b>${name}</b></button>`).join('')}</div><p>Körpergewichtsübungen sind immer verfügbar.</p>`
  weightTitle.insertAdjacentElement('beforebegin',card)
  card.querySelectorAll('[data-eq]').forEach(btn=>btn.onclick=()=>{const id=btn.dataset.eq,current=new Set(equipment224());current.has(id)?current.delete(id):current.add(id);write224('ft-equipment',[...current]);btn.classList.toggle('active',current.has(id));btn.querySelector('span').textContent=current.has(id)?'✓':'+'})
}
const renderCoachInfo224=()=>{
  const page=[...document.querySelectorAll('.page h1')].find(h=>h.textContent?.trim()==='Smarter Trainer')?.closest('.page');if(!page)return
  const suggestion=page.querySelector('.coach-suggestion');if(!suggestion||page.querySelector('.smart-data-v224'))return
  const history=read224('ft-exercise-history',[]),names=new Set(history.map(x=>norm224(x.exercise))).size,eq=equipment224().map(eqLabel224)
  const box=document.createElement('div');box.className='smart-data-v224';box.innerHTML=`<strong>Adaptive Planung aktiv</strong><span>${eq.length?eq.join(' · '):'Nur Körpergewicht'}</span><small>${names?`${names} Übungen mit Leistungs-/RIR-Daten werden berücksichtigt.`:'Sobald du trainierst, fließen RIR und Leistung automatisch in neue Pläne ein.'}</small>`
  suggestion.insertAdjacentElement('beforebegin',box)
}
const updateVersion224=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length===0&&el.textContent?.includes('V2.0.23'))el.textContent=el.textContent.replaceAll('V2.0.23','V2.0.24')})
const enhance224=()=>{renderEquipment224();renderCoachInfo224();updateVersion224()}
if(typeof document!=='undefined'){const obs224=new MutationObserver(enhance224);const start224=()=>{enhance224();obs224.observe(document.body,{childList:true,subtree:true})};document.body?start224():document.addEventListener('DOMContentLoaded',start224,{once:true})}
