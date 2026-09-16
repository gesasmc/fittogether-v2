// FitTogether V2.0.351: reliable Smart Trainer takeover using the live central equipment selection.
const r351=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const w351=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const esc351=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const WEEK351=['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag']
const profile351=()=>r351('ft-available-equipment-v238',null)??r351('ft-equipment-profile',{})?.equipment??{}
const strengthDefs351=p=>[
  ['bodyweight','Körpergewicht',!!p.bodyweight],
  ['dumbbell','Kurzhantel',!!p.dumbbell],
  ['barbell','Langhantel',!!p.barbell],
  ['band','Widerstandsband',!!p.band],
  ['machine','Kabel/Maschine',!!p.machine],
].filter(x=>x[2])
const cardioDefs351=p=>[
  ['bike','Indoor-Bike',!!(p.bike??p.indoorBike??p.ergometer)],
  ['rower','Rudergerät',!!(p.rower??p.rowingMachine??p.rowing)],
  ['treadmill','Laufband',!!p.treadmill],
].filter(x=>x[2])
const defaults351=()=>Object.fromEntries(WEEK351.map((d,i)=>[d,{type:i===0||i===2||i===4?'Kraft':'Frei',equipment:[]}]))
const loadDays351=(strength,cardio)=>{
  const saved=r351('ft-smart-week-v351',null)||r351('ft-smart-week-v350',null)||defaults351(),out={...defaults351(),...saved}
  for(const day of WEEK351){const d=out[day]||{type:'Frei',equipment:[]},allowed=(d.type==='Cardio'?cardio:strength).map(x=>x[0]);const eq=(d.equipment||[]).filter(k=>allowed.includes(k));out[day]={type:d.type||'Frei',equipment:eq.length?eq:(d.type==='Frei'?[]:allowed.slice())}}
  return out
}
const strengthPool351={
  bodyweight:[['Liegestütz','push up'],['Kniebeuge','bodyweight squat'],['Ausfallschritte','bodyweight lunge'],['Plank','plank']],
  dumbbell:[['Kurzhantel-Bankdrücken','dumbbell bench press'],['Schulterdrücken','dumbbell shoulder press'],['Seitheben','dumbbell lateral raise'],['Bizeps-Curl','dumbbell biceps curl'],['Rumänisches Kreuzheben','dumbbell romanian deadlift']],
  barbell:[['Langhantelrudern','barbell bent over row'],['Kniebeuge','barbell squat'],['Rumänisches Kreuzheben','barbell romanian deadlift'],['Langhantel-Bankdrücken','barbell bench press']],
  band:[['Bandrudern','band row'],['Band Face Pull','band face pull'],['Band Kniebeuge','band squat'],['Band Brustdrücken','band chest press']],
  machine:[['Latziehen','cable pulldown'],['Trizepsdrücken','cable triceps pushdown'],['Beinpresse','leg press'],['Beinbeugen','leg curl'],['Beinstrecken','leg extension']],
}
const makeStrength351=(day,keys,minutes,goal,index)=>{
  const candidates=[];keys.forEach(k=>(strengthPool351[k]||[]).forEach(([name,query])=>candidates.push({name,query,equipment:k,sets:goal==='Kraft'?4:3,reps:goal==='Kraft'?'4–6':goal==='Allgemeine Fitness'?'10–15':'8–12'})))
  const count=Math.max(3,Math.min(7,Math.round(minutes/10))),picked=[];for(let i=0;i<candidates.length&&picked.length<count;i++){const x=candidates[(i+index*2)%candidates.length];if(!picked.some(y=>y.name===x.name))picked.push(x)}
  return{title:`${day} · Kraft`,day,type:'Kraft',duration:minutes,exercises:picked}
}
const makeCardio351=(day,keys,minutes)=>{const each=Math.max(5,Math.floor(minutes/Math.max(1,keys.length)));const names={bike:['Indoor-Bike','stationary bike'],rower:['Rudergerät','rowing machine'],treadmill:['Laufband','treadmill']};return{title:`${day} · Cardio`,day,type:'Cardio',duration:minutes,exercises:keys.map(k=>({name:names[k]?.[0]||k,query:names[k]?.[1]||k,equipment:k,sets:1,reps:`${each} Min.`,kind:'cardio',loadType:'cardio'}))}}
const enhance351=()=>{
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Smarter Trainer')
  if(!page||page.dataset.smart351)return
  page.dataset.smart351='1'
  page.querySelector('.coach-settings')?.style.setProperty('display','none','important')
  page.querySelector('.coach-suggestion')?.style.setProperty('display','none','important')
  const p=profile351(),strength=strengthDefs351(p),cardio=cardioDefs351(p),days=loadDays351(strength,cardio)
  let goal='Muskelaufbau',minutes=60
  const host=document.createElement('section');host.className='smart-runtime-v351';page.appendChild(host)
  const saveState=()=>w351('ft-smart-week-v351',days)
  const render=()=>{
    const active=WEEK351.filter(d=>days[d].type!=='Frei'),invalid=active.some(d=>days[d].equipment.length===0),sessions=[];let si=0
    active.forEach(day=>{const d=days[day];sessions.push(d.type==='Cardio'?makeCardio351(day,d.equipment,minutes):makeStrength351(day,d.equipment,minutes,goal,si++))})
    host.innerHTML=`<div class="coach-settings"><label><span>Dein Ziel</span><select data-goal><option>Muskelaufbau</option><option>Kraft</option><option>Allgemeine Fitness</option></select></label><label><span>Zeit pro Training</span><select data-minutes>${[30,45,60,75,90].map(m=>`<option value="${m}">${m} Min.</option>`).join('')}</select></label></div><div class="smart-week-v328"><div class="smart-week-head-v328"><small>DEINE WOCHE</small><strong>Trainingstage & Ausstattung</strong></div>${WEEK351.map(day=>{const d=days[day],defs=d.type==='Cardio'?cardio:strength;return`<div class="smart-day-v328 ${d.type.toLowerCase()}"><div class="smart-day-top-v328"><strong>${day}</strong><div>${['Kraft','Cardio','Frei'].map(t=>`<button type="button" data-type="${t}" data-day="${day}" class="${d.type===t?'active':''}">${t}</button>`).join('')}</div></div>${d.type!=='Frei'?`<div class="smart-eq-v328"><small>${d.type==='Cardio'?'Cardio-Geräte für diesen Tag':'Ausstattung für diesen Tag'}</small><div>${defs.map(([k,l])=>`<button type="button" data-eq="${k}" data-day="${day}" class="${d.equipment.includes(k)?'active':''}">${d.equipment.includes(k)?'✓ ':''}${l}</button>`).join('')}</div>${defs.length===0?'<em>In „Meine Ausstattung“ ist dafür aktuell nichts aktiviert.</em>':d.equipment.length===0?'<em>Bitte mindestens eine Ausstattung auswählen.</em>':''}</div>`:''}</div>`}).join('')}</div><div class="coach-suggestion"><small>DEIN WOCHENPLAN</small><h2>${esc351(goal)} · ${active.length} Trainingstage · ${minutes} Min.</h2><div class="coach-plan-preview">${sessions.map((s,i)=>`<div><b>TAG ${i+1}</b><span>${esc351(s.title)} · ${s.exercises.length} Übungen</span></div>`).join('')}</div><button type="button" class="primary-action" data-save ${!active.length||invalid?'disabled':''}>${invalid?'Ausstattung pro Trainingstag wählen':'Plan speichern'}</button></div>`
    const gs=host.querySelector('[data-goal]');gs.value=goal;gs.onchange=()=>{goal=gs.value;render()}
    const ms=host.querySelector('[data-minutes]');ms.value=String(minutes);ms.onchange=()=>{minutes=Number(ms.value)||60;render()}
    host.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>{const day=b.dataset.day,type=b.dataset.type,allowed=(type==='Cardio'?cardio:strength).map(x=>x[0]);days[day]={type,equipment:type==='Frei'?[]:allowed.slice()};saveState();render()})
    host.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>{const day=b.dataset.day,k=b.dataset.eq,d=days[day],has=d.equipment.includes(k);days[day]={...d,equipment:has?d.equipment.filter(x=>x!==k):[...d.equipment,k]};saveState();render()})
    host.querySelector('[data-save]')?.addEventListener('click',()=>{const activeDays=WEEK351.filter(d=>days[d].type!=='Frei');if(!activeDays.length||activeDays.some(d=>days[d].equipment.length===0))return;let ix=0;const out=activeDays.map(day=>days[day].type==='Cardio'?makeCardio351(day,days[day].equipment,minutes):makeStrength351(day,days[day].equipment,minutes,goal,ix++));const plans=r351('ft-plans',[]);plans.push({name:`Smart Plan · ${goal}`,days:activeDays.length,minutes,goal,smart:true,sessions:out,createdAt:Date.now(),version:'V2.0.351'});w351('ft-plans',plans);saveState();window.FitTogetherCloud?.upload?.();page.querySelector('.sub-head button')?.click()})
  }
  render()
}
let q351=false
const schedule351=()=>{if(q351)return;q351=true;requestAnimationFrame(()=>{q351=false;enhance351()})}
if(typeof document!=='undefined'){const start=()=>{enhance351();new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length))schedule351()}).observe(document.body,{childList:true,subtree:true});window.addEventListener('pageshow',schedule351)};document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})}
