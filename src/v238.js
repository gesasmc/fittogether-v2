// FitTogether V2.0.38: exercise-library availability filter and clearer exercise browsing.
export const FITTOGETHER_VERSION='V2.0.38'

const read238=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
const write238=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}}

const initialEquipment238=()=>{
  const saved=read238('ft-available-equipment-v238',null)
  if(saved)return saved
  return {
    bodyweight:true,
    dumbbell:read238('ft-dumbbell-weights',[]).length>0,
    barbell:read238('ft-barbell-weights',[]).length>0,
    band:false,
    machine:false
  }
}

const matchEquipment238=(text,equipment)=>{
  const t=String(text||'').toLowerCase()
  if(/cardio|yoga|dehnen/.test(t))return true
  if(/kurzhantel|dumbbell/.test(t))return equipment.dumbbell
  if(/langhantel|sz-stange|barbell/.test(t))return equipment.barbell
  if(/körpergewicht|body.?weight/.test(t))return equipment.bodyweight
  if(/widerstandsband|band/.test(t))return equipment.band
  if(/kabelzug|maschine|multipresse|machine|cable/.test(t))return equipment.machine
  return false
}

let onlyMine238=read238('ft-exercise-only-mine-v238',false)
let equipment238=initialEquipment238()

const applyExerciseFilter238=()=>{
  const grid=document.querySelector('.exercise-grid')
  if(!grid)return
  const cards=[...grid.querySelectorAll('.exercise-card-v2')]
  let visible=0
  cards.forEach(card=>{
    const show=!onlyMine238||matchEquipment238(card.textContent,equipment238)
    card.hidden=!show
    if(show)visible++
  })
  const count=document.querySelector('.exercise-count-v238')
  if(count)count.textContent=`${visible} sichtbar${cards.length===80?' · aktuell 80 geladen':''}`
}

const renderEquipmentChips238=box=>{
  const chips=box.querySelector('.equipment-chips-v238')
  if(!chips)return
  const defs=[
    ['bodyweight','Körpergewicht'],
    ['dumbbell','Kurzhantel'],
    ['barbell','Langhantel'],
    ['band','Widerstandsband'],
    ['machine','Kabel/Maschine']
  ]
  chips.innerHTML=defs.map(([key,label])=>`<button type="button" data-equipment="${key}" class="${equipment238[key]?'active':''}">${label}</button>`).join('')
  chips.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{
    const key=btn.dataset.equipment
    equipment238={...equipment238,[key]:!equipment238[key]}
    write238('ft-available-equipment-v238',equipment238)
    renderEquipmentChips238(box)
    applyExerciseFilter238()
  })
}

const enhanceExercises238=()=>{
  const grid=document.querySelector('.exercise-grid')
  const filterRow=document.querySelector('.filter-row')
  if(!grid||!filterRow)return
  let box=document.querySelector('.exercise-advanced-v238')
  if(!box){
    box=document.createElement('section')
    box.className='exercise-advanced-v238'
    box.innerHTML=`<div class="exercise-availability-head-v238"><div><strong>Meine Ausstattung</strong><small class="exercise-count-v238"></small></div><label class="only-mine-v238"><input type="checkbox"><span>Nur verfügbare Übungen</span></label></div><div class="equipment-chips-v238"></div><p>Kurzhantel und Langhantel werden automatisch aus deinen hinterlegten Gewichten erkannt. Weitere Geräte kannst du hier an- oder abwählen.</p>`
    filterRow.insertAdjacentElement('afterend',box)
    const cb=box.querySelector('.only-mine-v238 input')
    cb.checked=onlyMine238
    cb.onchange=()=>{
      onlyMine238=cb.checked
      write238('ft-exercise-only-mine-v238',onlyMine238)
      applyExerciseFilter238()
    }
    renderEquipmentChips238(box)
  }
  applyExerciseFilter238()
}

let queued238=false
const enhance238=()=>{
  queued238=false
  enhanceExercises238()
  document.querySelectorAll('body *').forEach(el=>{
    if(el.children.length)return
    const t=el.textContent||''
    if(/V2\.0\.3[5-7]/.test(t))el.textContent=t.replace(/V2\.0\.3[5-7]/g,FITTOGETHER_VERSION)
  })
}
const schedule238=()=>{if(queued238)return;queued238=true;requestAnimationFrame(enhance238)}
if(typeof document!=='undefined'){
  const observer=new MutationObserver(m=>{
    if(m.some(x=>[...x.addedNodes].some(n=>n.nodeType===1&&!n.classList?.contains('exercise-advanced-v238'))))schedule238()
  })
  const start=()=>{enhance238();observer.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
