// FitTogether V2.0.352: Smart Trainer obeys the selected training type and equipment PER DAY.
// No global equipment fallback, no automatic cardio on strength days, no hidden warm-up injection.
const r352=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const w352=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const smart352=p=>p?.smart===true||/^smart plan/i.test(String(p?.name||''))
const cardioKeys352=new Set(['bike','rower','treadmill','elliptical','stepper','jumprope'])
const key352=value=>{
  const s=String(value||'').toLowerCase().trim()
  if(!s)return''
  if(/stepper\s*\/\s*box|plyo.?box|jump.?box|box step/.test(s))return'box'
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
const exerciseKey352=x=>{
  const explicit=key352(x?.equipment)
  if(explicit)return explicit
  const t=`${x?.name||''} ${x?.query||''} ${x?.category||''} ${x?.bodyPart||''}`.toLowerCase()
  const direct=key352(t)
  if(direct)return direct
  if(/goblet squat/.test(t))return'dumbbell'
  if(/push.?up|liegestütz|plank|body.?weight|körpergewicht|air squat|ausfallschritt/.test(t))return'bodyweight'
  return''
}
const isCardio352=x=>{
  const raw=`${x?.kind||''} ${x?.loadType||''} ${x?.category||''} ${x?.bodyPart||''}`.toLowerCase()
  return /cardio|cardiovascular/.test(raw)||cardioKeys352.has(exerciseKey352(x))
}
const sessionType352=s=>String(s?.type||(/cardio/i.test(String(s?.title||''))?'Cardio':'Kraft'))
const selected352=s=>new Set((Array.isArray(s?.equipment)?s.equipment:[]).map(key352).filter(Boolean))
const cardioLabel352={bike:'Indoor Bike',rower:'Rudergerät',treadmill:'Laufband',elliptical:'Crosstrainer',stepper:'Stepper',jumprope:'Springseil'}
const cardioQuery352={bike:'stationary bike',rower:'rowing machine',treadmill:'treadmill',elliptical:'elliptical',stepper:'stepper',jumprope:'jump rope'}
const cleanSession352=(s,plan={})=>{
  if(!s||typeof s==='string'||!Array.isArray(s.equipment)||!s.equipment.length)return s
  const type=sessionType352(s),allowed=selected352(s),all=Array.isArray(s.exercises)?s.exercises:[]
  if(type==='Cardio'){
    const cardioAllowed=[...allowed].filter(k=>cardioKeys352.has(k))
    const duration=Number(s.duration||plan.minutes||plan.duration||60)||60
    const each=Math.max(5,Math.floor(duration/Math.max(1,cardioAllowed.length)))
    const exercises=cardioAllowed.map(k=>({name:cardioLabel352[k]||k,query:cardioQuery352[k]||k,kind:'cardio',loadType:'cardio',category:'Cardio',equipment:cardioLabel352[k]||k,duration:each,minutes:each,sets:1,reps:''}))
    return{...s,type:'Cardio',strictEquipmentV352:true,exercises}
  }
  const exercises=all.filter(x=>{
    if(x?.warmup||isCardio352(x))return false
    const k=exerciseKey352(x)
    return !!k&&allowed.has(k)
  })
  return{...s,type:'Kraft',strictEquipmentV352:true,exercises}
}
const sanitizePlans352=()=>{
  const plans=r352('ft-plans',[])
  if(!Array.isArray(plans)||!plans.length)return false
  let changed=false
  const next=plans.map(p=>{
    if(!smart352(p)||p.strictEquipmentV352===true||!Array.isArray(p.sessions))return p
    let planChanged=false
    const sessions=p.sessions.map(s=>{
      const cleaned=cleanSession352(s,p)
      if(JSON.stringify(cleaned)!==JSON.stringify(s))planChanged=true
      return cleaned
    })
    if(!planChanged)return{...p,strictEquipmentV352:true,version:'V2.0.352'}
    changed=true
    return{...p,sessions,strictEquipmentV352:true,version:'V2.0.352'}
  })
  if(!changed&&next.every((p,i)=>p===plans[i]||p.strictEquipmentV352===plans[i]?.strictEquipmentV352))return false
  w352('ft-plans',next)
  try{window.dispatchEvent(new Event('storage'))}catch{}
  setTimeout(()=>{try{window.FitTogetherCloud?.upload?.()}catch{}},0)
  return true
}

const MUSCLES352=['abductors','abs','adductors','biceps','calves','delts','forearms','glutes','hamstrings','lats','pectorals','quads','serratus-anterior','spine','traps','triceps','upper-back']
const API352='https://raw.githubusercontent.com/JahelCuadrado/ExerciseGymGifsDB/main/api/en/muscles/'
let db352=null,loading352=null
const loadDb352=()=>db352?Promise.resolve(db352):(loading352||(loading352=Promise.all(MUSCLES352.map(m=>fetch(`${API352}${m}.json`).then(r=>r.ok?r.json():{exercises:[]}).then(g=>(g.exercises||[]).map(x=>({...x,muscle:x.muscle||m}))))).then(groups=>{db352=groups.flat();return db352}).catch(()=>[])))
const targets352=(plan,s)=>{
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
const wanted352=min=>{const m=Number(min)||60;if(m>=75)return 7;if(m>=55)return 6;if(m>=40)return 5;if(m>=25)return 4;return 3}
const pick352=(items,plan,s,count,seed)=>{
  const allowed=selected352(s),targets=targets352(plan,s),used=new Set(),out=[]
  const usable=x=>{const k=exerciseKey352(x);return !!k&&!cardioKeys352.has(k)&&allowed.has(k)}
  const add=x=>{const id=String(x?.id||x?.name||'');if(!x||!id||used.has(id))return;used.add(id);out.push(x)}
  for(let round=0;round<50&&out.length<count;round++)for(const muscle of targets){const pool=items.filter(x=>x.muscle===muscle&&usable(x)&&!used.has(String(x.id||x.name)));if(!pool.length)continue;add(pool[Math.abs(seed+round*31+muscle.length*17)%pool.length]);if(out.length>=count)break}
  if(out.length<count){const rest=items.filter(x=>usable(x)&&!used.has(String(x.id||x.name)));for(let i=0;i<rest.length&&out.length<count;i++)add(rest[Math.abs(seed+i*43)%rest.length])}
  return out
}
const reps352=goal=>String(goal||'').toLowerCase().includes('kraft')?'4–6':String(goal||'').toLowerCase().includes('fitness')?'10–15':'8–12'
const rebuildLatest352=async()=>{
  const plans=r352('ft-plans',[]);if(!Array.isArray(plans)||!plans.length)return
  const index=plans.length-1,plan=plans[index];if(!smart352(plan)||!Array.isArray(plan.sessions))return
  const items=await loadDb352();if(!items.length)return
  let changed=false
  const sessions=plan.sessions.map((s,si)=>{
    if(!s||typeof s==='string'||!Array.isArray(s.equipment)||!s.equipment.length)return s
    if(sessionType352(s)==='Cardio'){const cleaned=cleanSession352(s,plan);changed=JSON.stringify(cleaned)!==JSON.stringify(s)||changed;return cleaned}
    const count=wanted352(s.duration||plan.minutes||plan.duration),picked=pick352(items,plan,s,count,Number(plan.createdAt||Date.now())+si*101)
    if(!picked.length)return cleanSession352(s,plan)
    const sets=String(plan.goal||'').toLowerCase().includes('kraft')?4:3
    const fresh=picked.map(x=>({name:x.name,query:x.name,sets,reps:reps352(plan.goal),equipment:x.equipment||'',image:x.thumbUrl||x.gifUrl||'',gifUrl:x.gifUrl||'',thumbUrl:x.thumbUrl||'',muscle:x.muscle||'',source:'ExerciseGymGifsDB'}))
    changed=true
    return{...s,type:'Kraft',strictEquipmentV352:true,exercises:fresh}
  })
  if(!changed)return
  plans[index]={...plan,sessions,strictEquipmentV352:true,databaseSmart:true,databaseSize:items.length,version:'V2.0.352'}
  w352('ft-plans',plans)
  try{window.dispatchEvent(new Event('storage'))}catch{}
  try{window.FitTogetherCloud?.upload?.()}catch{}
}

sanitizePlans352()
if(typeof document!=='undefined'){
  document.addEventListener('click',e=>{const b=e.target?.closest?.('button');if(b?.textContent?.includes('Plan speichern'))setTimeout(rebuildLatest352,250)},true)
  window.addEventListener('pageshow',sanitizePlans352)
  setTimeout(sanitizePlans352,800)
  setTimeout(sanitizePlans352,2200)
}
