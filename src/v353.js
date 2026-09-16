// FitTogether V2.0.353: exact per-day equipment requirements for Smart Trainer plans.
// Existing V2.0.352 plans are revalidated and rebuilt. Database labels such as
// "body weight" are not trusted when the movement actually requires equipment.
// Plans deliberately edited by the user in V2.0.355 are preserved as-is.
const r353=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const w353=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const VERSION353='V2.0.353'
const smart353=p=>p?.smart===true||/^smart plan/i.test(String(p?.name||''))
const cardioKeys353=new Set(['bike','rower','treadmill','elliptical','stepper','jumprope'])

const eqKey353=value=>{
  const s=String(value||'').toLowerCase().trim()
  if(!s)return''
  if(/stepper\s*\/\s*box|plyo.?box|jump.?box|step.?box/.test(s))return'box'
  if(/indoor.?bike|stationary.?bike|exercise.?bike|ergometer|fahrrad|bicycle|cycling|\bbike\b/.test(s))return'bike'
  if(/rudergerät|rowing.?machine|\brower\b|\browing\b/.test(s))return'rower'
  if(/laufband|treadmill/.test(s))return'treadmill'
  if(/crosstrainer|elliptical/.test(s))return'elliptical'
  if(/^stepper$|stair.?stepper|stair.?climber/.test(s))return'stepper'
  if(/springseil|jump.?rope/.test(s))return'jumprope'
  if(/kurzhantel|dumbbell/.test(s))return'dumbbell'
  if(/langhantel|barbell|ez.?bar|sz.?stange/.test(s))return'barbell'
  if(/kettlebell/.test(s))return'kettlebell'
  if(/landmine/.test(s))return'landmine'
  if(/widerstandsband|resistance.?band|\bband\b/.test(s))return'band'
  if(/kabelzug|\bcable\b/.test(s))return'cable'
  if(/maschine|machine|smith|leverage/.test(s))return'machine'
  if(/trx|schlingentrainer|suspension/.test(s))return'trx'
  if(/klimmzugstange|pull.?up.?bar/.test(s))return'pullupbar'
  if(/dip.?barren|dip.?bar/.test(s))return'dipbars'
  if(/medizinball|medicine.?ball/.test(s))return'medicineball'
  if(/gymnastikball|stability.?ball|swiss.?ball/.test(s))return'stabilityball'
  if(/bosu|balance.?board|balance.?trainer/.test(s))return'bosu'
  if(/^bank$|trainingsbank|weight.?bench|exercise.?bench/.test(s))return'bench'
  if(/körpergewicht|body.?weight|calisthenic|\bnone\b/.test(s))return'bodyweight'
  return''
}

const text353=x=>`${x?.name||''} ${x?.query||''} ${x?.equipment||''} ${x?.category||''} ${x?.bodyPart||''}`.toLowerCase()
const requirements353=x=>{
  const t=text353(x),req=new Set(),explicit=eqKey353(x?.equipment)
  // Movement semantics override misleading source labels.
  if(/gironda.*sternum.*chin|chin.?up|pull.?up|klimmzug/.test(t)&&!/assisted|maschine|machine/.test(t))req.add('pullupbar')
  else if(/dip/.test(t)&&!/bench.?dip|bank.?dip/.test(t)&&!/assisted|maschine|machine/.test(t))req.add('dipbars')
  else if(/bench.?dip|bank.?dip/.test(t)){req.add('bench')}
  else if(explicit)req.add(explicit)

  // Strong name-level equipment signals always win over generic metadata.
  if(/barbell|langhantel|ez.?bar|sz.?stange/.test(t)){req.delete('bodyweight');req.add('barbell')}
  if(/dumbbell|kurzhantel/.test(t)){req.delete('bodyweight');req.add('dumbbell')}
  if(/kettlebell/.test(t)){req.delete('bodyweight');req.add('kettlebell')}
  if(/landmine/.test(t)){req.delete('bodyweight');req.add('landmine')}
  if(/resistance.?band|widerstandsband|\bband\b/.test(t)){req.delete('bodyweight');req.add('band')}
  if(/cable|kabel/.test(t)){req.delete('bodyweight');req.add('cable')}
  if(/smith|leverage|machine|maschine/.test(t)&&!/rowing.?machine|exercise.?bike|stationary.?bike/.test(t)){req.delete('bodyweight');req.add('machine')}
  if(/trx|suspension|schlingentrainer/.test(t)){req.delete('bodyweight');req.add('trx')}
  if(/medicine.?ball|medizinball/.test(t)){req.delete('bodyweight');req.add('medicineball')}
  if(/stability.?ball|swiss.?ball|gymnastikball/.test(t)){req.delete('bodyweight');req.add('stabilityball')}
  if(/bosu|balance.?board|balance.?trainer/.test(t)){req.delete('bodyweight');req.add('bosu')}
  if(/plyo.?box|jump.?box|step.?box/.test(t)){req.delete('bodyweight');req.add('box')}

  // Exercises that structurally require a bench need the bench selected as well.
  if(/bench press|bankdrücken|incline|decline|schrägbank|negativbank|chest.?supported/.test(t)&&!req.has('machine'))req.add('bench')

  if(!req.size&&/push.?up|liegestütz|plank|air.?squat|body.?weight|körpergewicht|lunge|ausfallschritt|crunch|sit.?up/.test(t))req.add('bodyweight')
  return req
}

const sessionType353=s=>String(s?.type||(/cardio/i.test(String(s?.title||''))?'Cardio':'Kraft'))
const selected353=s=>new Set((Array.isArray(s?.equipment)?s.equipment:[]).map(eqKey353).filter(Boolean))
const allowedExercise353=(x,s)=>{
  const allowed=selected353(s),req=requirements353(x)
  if(!req.size)return false
  for(const key of req)if(!allowed.has(key))return false
  return true
}
const isCardio353=x=>{
  const raw=`${x?.kind||''} ${x?.loadType||''} ${x?.category||''} ${x?.bodyPart||''}`.toLowerCase()
  if(/cardio|cardiovascular/.test(raw))return true
  const req=requirements353(x);return[...req].some(k=>cardioKeys353.has(k))
}
const cardioLabel353={bike:'Indoor Bike',rower:'Rudergerät',treadmill:'Laufband',elliptical:'Crosstrainer',stepper:'Stepper',jumprope:'Springseil'}
const cardioQuery353={bike:'stationary bike',rower:'rowing machine',treadmill:'treadmill',elliptical:'elliptical',stepper:'stepper',jumprope:'jump rope'}

const cleanSync353=(s,plan={})=>{
  if(!s||typeof s==='string'||!Array.isArray(s.equipment)||!s.equipment.length)return s
  const type=sessionType353(s),allowed=selected353(s),all=Array.isArray(s.exercises)?s.exercises:[]
  if(type==='Cardio'){
    const keys=[...allowed].filter(k=>cardioKeys353.has(k)),duration=Number(s.duration||plan.minutes||plan.duration||60)||60,each=Math.max(5,Math.floor(duration/Math.max(1,keys.length)))
    return{...s,type:'Cardio',exercises:keys.map(k=>({name:cardioLabel353[k]||k,query:cardioQuery353[k]||k,kind:'cardio',loadType:'cardio',category:'Cardio',equipment:cardioLabel353[k]||k,duration:each,minutes:each,sets:1,reps:''}))}
  }
  return{...s,type:'Kraft',exercises:all.filter(x=>!x?.warmup&&!isCardio353(x)&&allowedExercise353(x,s))}
}

const syncPurge353=()=>{
  const plans=r353('ft-plans',[]);if(!Array.isArray(plans)||!plans.length)return false
  let changed=false
  const next=plans.map(p=>{
    if(!smart353(p)||!Array.isArray(p.sessions)||p.manualEditsV355===true)return p
    const sessions=p.sessions.map(s=>cleanSync353(s,p))
    if(JSON.stringify(sessions)!==JSON.stringify(p.sessions)||p.strictEquipmentVersion!==VERSION353){changed=true;return{...p,sessions,strictEquipmentV352:undefined,strictEquipmentVersion:VERSION353,version:VERSION353}}
    return p
  })
  if(changed){w353('ft-plans',next);try{window.dispatchEvent(new Event('storage'))}catch{};setTimeout(()=>{try{window.FitTogetherCloud?.upload?.()}catch{}},0)}
  return changed
}

const MUSCLES353=['abductors','abs','adductors','biceps','calves','delts','forearms','glutes','hamstrings','lats','pectorals','quads','serratus-anterior','spine','traps','triceps','upper-back']
const API353='https://raw.githubusercontent.com/JahelCuadrado/ExerciseGymGifsDB/main/api/en/muscles/'
let db353=null,loading353=null
const loadDb353=()=>db353?Promise.resolve(db353):(loading353||(loading353=Promise.all(MUSCLES353.map(m=>fetch(`${API353}${m}.json`).then(r=>r.ok?r.json():{exercises:[]}).then(g=>(g.exercises||[]).map(x=>({...x,muscle:x.muscle||m}))))).then(gs=>{db353=gs.flat();return db353}).catch(()=>[])))
const targets353=(plan,s)=>{
  const focus=String(plan?.focus||'').toLowerCase(),title=String(s?.title||'').toLowerCase()
  if(/brust/.test(focus))return['pectorals','delts','triceps']
  if(/rücken/.test(focus))return['lats','upper-back','traps','biceps']
  if(/beine/.test(focus))return['quads','glutes','hamstrings','calves','adductors','abductors']
  if(/schulter/.test(focus))return['delts','traps','triceps']
  if(/arme/.test(focus))return['biceps','triceps','forearms']
  if(/push/.test(title))return['pectorals','delts','triceps']
  if(/pull/.test(title))return['lats','upper-back','traps','biceps']
  if(/bein|unterkörper/.test(title))return['quads','glutes','hamstrings','calves']
  return['pectorals','lats','quads','delts','upper-back','glutes','hamstrings','biceps','triceps','abs']
}
const wanted353=min=>{const m=Number(min)||60;if(m>=75)return 7;if(m>=55)return 6;if(m>=40)return 5;if(m>=25)return 4;return 3}
const pick353=(items,plan,s,count,seed)=>{
  const targets=targets353(plan,s),used=new Set(),out=[]
  const usable=x=>!isCardio353(x)&&allowedExercise353(x,s)
  const add=x=>{const id=String(x?.id||x?.name||'');if(!x||!id||used.has(id))return false;used.add(id);out.push(x);return true}
  for(let round=0;round<60&&out.length<count;round++)for(const muscle of targets){const pool=items.filter(x=>x.muscle===muscle&&usable(x)&&!used.has(String(x.id||x.name)));if(!pool.length)continue;add(pool[Math.abs(seed+round*31+muscle.length*17)%pool.length]);if(out.length>=count)break}
  if(out.length<count){const rest=items.filter(x=>usable(x)&&!used.has(String(x.id||x.name)));for(let i=0;i<rest.length&&out.length<count;i++)add(rest[Math.abs(seed+i*43)%rest.length])}
  return out
}
const reps353=goal=>String(goal||'').toLowerCase().includes('kraft')?'4–6':String(goal||'').toLowerCase().includes('fitness')?'10–15':'8–12'
const rebuildAll353=async()=>{
  const plans=r353('ft-plans',[]);if(!Array.isArray(plans)||!plans.length)return false
  const items=await loadDb353();if(!items.length)return false
  let changed=false
  const next=plans.map((plan,pi)=>{
    if(!smart353(plan)||!Array.isArray(plan.sessions)||plan.manualEditsV355===true)return plan
    const sessions=plan.sessions.map((s,si)=>{
      if(!s||typeof s==='string'||!Array.isArray(s.equipment)||!s.equipment.length)return s
      if(sessionType353(s)==='Cardio')return cleanSync353(s,plan)
      const count=wanted353(s.duration||plan.minutes||plan.duration),picked=pick353(items,plan,s,count,Number(plan.createdAt||Date.now())+pi*997+si*101)
      const sets=String(plan.goal||'').toLowerCase().includes('kraft')?4:3
      const fresh=picked.map(x=>({name:x.name,query:x.name,sets,reps:reps353(plan.goal),equipment:x.equipment||'',image:x.thumbUrl||x.gifUrl||'',gifUrl:x.gifUrl||'',thumbUrl:x.thumbUrl||'',muscle:x.muscle||'',source:'ExerciseGymGifsDB'}))
      return{...s,type:'Kraft',exercises:fresh}
    })
    const rebuilt={...plan,sessions,strictEquipmentV352:undefined,strictEquipmentVersion:VERSION353,databaseSmart:true,databaseSize:items.length,version:VERSION353}
    if(JSON.stringify(rebuilt)!==JSON.stringify(plan))changed=true
    return rebuilt
  })
  if(changed){w353('ft-plans',next);try{window.dispatchEvent(new Event('storage'))}catch{};try{window.FitTogetherCloud?.upload?.()}catch{}}
  return changed
}

syncPurge353()
rebuildAll353()
if(typeof document!=='undefined'){
  document.addEventListener('click',e=>{const b=e.target?.closest?.('button');if(b?.textContent?.includes('Plan speichern')){setTimeout(syncPurge353,40);setTimeout(rebuildAll353,300)}},true)
  window.addEventListener('pageshow',()=>{syncPurge353();rebuildAll353()})
  setTimeout(syncPurge353,600)
  setTimeout(rebuildAll353,1200)
}
