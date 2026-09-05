// FitTogether V2.0.53: Smart Trainer respects available equipment and keeps the setup simple.
const FT253='V2.0.53'
const read253=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write253=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const equipment253=()=>{
  const saved=read253('ft-available-equipment-v238',null)
  return saved||{bodyweight:true,dumbbell:read253('ft-dumbbell-weights',[]).length>0,barbell:read253('ft-barbell-weights',[]).length>0,band:false,machine:false}
}
const needs253=x=>{
  const t=`${x?.name||''} ${x?.query||''} ${x?.equipment||''}`.toLowerCase()
  if(/dumbbell|kurzhantel/.test(t))return 'dumbbell'
  if(/barbell|langhantel|ez bar/.test(t))return 'barbell'
  if(/cable|machine|latziehen|trizepsdrücken|beinpresse|beinstrecken|beinbeugen/.test(t))return 'machine'
  if(/band|widerstandsband/.test(t))return 'band'
  return 'bodyweight'
}
const fallback253=(x)=>{
  const t=String(x?.name||'').toLowerCase()
  if(/latziehen|rudern|klimm/.test(t))return {name:'Klimmzug',query:'pull up',sets:x.sets||3,reps:x.reps||'6–10',equipment:'bodyweight'}
  if(/brust|bankdrücken|fliegende|trizeps|schulter/.test(t))return {name:'Liegestütz',query:'push up',sets:x.sets||3,reps:x.reps||'8–15',equipment:'bodyweight'}
  if(/bein|kniebeuge|kreuzheben|wade|hip/.test(t))return {name:'Kniebeuge (Körpergewicht)',query:'bodyweight squat',sets:x.sets||3,reps:x.reps||'10–20',equipment:'bodyweight'}
  return {name:'Liegestütz',query:'push up',sets:x.sets||3,reps:x.reps||'8–15',equipment:'bodyweight'}
}
const adaptLatest253=()=>{
  if(!read253('ft-smart-only-equipment-v253',true))return
  const plans=read253('ft-plans',[]);if(!plans.length)return
  const i=plans.length-1,p=plans[i];if(!String(p?.name||'').startsWith('Smart Plan'))return
  const eq=equipment253()
  p.equipmentAware=true
  p.sessions=(p.sessions||[]).map(s=>{
    if(typeof s==='string')return s
    const seen=new Set()
    const exercises=(s.exercises||[]).map(x=>{
      if(x?.warmup)return x
      const need=needs253(x)
      if(eq[need]!==false)return x
      if(eq.bodyweight===false)return null
      return fallback253(x)
    }).filter(Boolean).filter(x=>{const k=String(x.name||x.query);if(seen.has(k))return false;seen.add(k);return true})
    return {...s,exercises}
  })
  plans[i]=p;write253('ft-plans',plans);window.FitTogetherCloud?.upload?.()
}
const equipmentText253=()=>{
  const e=equipment253(),labels=[]
  if(e.bodyweight)labels.push('Körpergewicht')
  if(e.dumbbell)labels.push('Kurzhantel')
  if(e.barbell)labels.push('Langhantel')
  if(e.band)labels.push('Band')
  if(e.machine)labels.push('Kabel/Maschine')
  return labels.length?labels.join(' · '):'Keine Ausstattung gewählt'
}
const enhanceCoach253=()=>{
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.page-head h1')?.textContent?.trim()==='Smarter Trainer')
  if(!page)return
  const settings=page.querySelector('.coach-settings');if(!settings)return
  let row=page.querySelector('.equipment-choice-v253')
  if(!row){
    row=document.createElement('label');row.className='equipment-choice-v253'
    row.innerHTML='<span><strong>Meine Ausstattung berücksichtigen</strong><small></small></span><input type="checkbox">'
    settings.appendChild(row)
    const input=row.querySelector('input');input.checked=read253('ft-smart-only-equipment-v253',true);input.onchange=()=>write253('ft-smart-only-equipment-v253',input.checked)
  }
  const small=row.querySelector('small');if(small)small.textContent=equipmentText253()
  let note=page.querySelector('.coach-equipment-note-v253')
  const preview=page.querySelector('.coach-suggestion')
  if(preview&&!note){note=document.createElement('div');note.className='coach-equipment-note-v253';preview.insertAdjacentElement('afterbegin',note)}
  if(note)note.textContent='Der Plan nutzt nur Geräte, die du in FitTogether als vorhanden hinterlegt hast.'
}
const click253=e=>{
  const btn=e.target.closest('button');if(!btn)return
  if(btn.textContent?.includes('Plan speichern'))setTimeout(adaptLatest253,100)
}
const version253=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(/V2\.0\.(50|51|52)/.test(t))el.textContent=t.replace(/V2\.0\.(50|51|52)/g,FT253)})
let q253=false
const enhance253=()=>{q253=false;enhanceCoach253();version253()}
const schedule253=()=>{if(q253)return;q253=true;requestAnimationFrame(enhance253)}
if(typeof document!=='undefined'){
 document.addEventListener('click',click253,true)
 const obs=new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule253()})
 const start=()=>{enhance253();obs.observe(document.body,{childList:true,subtree:true})}
 document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
