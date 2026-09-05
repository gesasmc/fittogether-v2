// FitTogether V2.0.39: remove 80-item cap and add muscle filtering to the full exercise library.
export const FITTOGETHER_VERSION='V2.0.39'

const rawSlice239=Array.prototype.slice
Array.prototype.slice=function(start,end){
  if(start===0&&end===80&&this?.length>80){
    const sample=this[0]
    if(sample&&typeof sample==='object'&&('name'in sample)&&('gifUrl'in sample||'thumbUrl'in sample)){
      return rawSlice239.call(this,0)
    }
  }
  return rawSlice239.apply(this,arguments)
}

const MUSCLES239=['abductors','abs','adductors','biceps','calves','cardio','delts','forearms','glutes','hamstrings','lats','levator-scapulae','pectorals','quads','serratus-anterior','spine','traps','triceps','upper-back']
const API239='https://raw.githubusercontent.com/JahelCuadrado/ExerciseGymGifsDB/main/api/en/muscles/'
const labels239={abductors:'Abduktoren',abs:'Bauch',adductors:'Adduktoren',biceps:'Bizeps',calves:'Waden',cardio:'Cardio',delts:'Schultern',forearms:'Unterarme',glutes:'Gesäß',hamstrings:'Beinbeuger',lats:'Latissimus','levator-scapulae':'Schulterblattheber',pectorals:'Brust',quads:'Quadrizeps','serratus-anterior':'Sägemuskel',spine:'Rückenstrecker',traps:'Trapezmuskel',triceps:'Trizeps','upper-back':'Oberer Rücken'}
const read239=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write239=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
let selectedMuscle239=read239('ft-exercise-muscle-v239','Alle')
let mediaMap239=null
let loadPromise239=null
const loadMap239=()=>loadPromise239||(loadPromise239=Promise.all(MUSCLES239.map(m=>fetch(`${API239}${m}.json`).then(r=>r.json()).catch(()=>({exercises:[]})))).then(groups=>{
  const map=new Map()
  groups.forEach(g=>(g.exercises||[]).forEach(x=>{
    ;[x.thumbUrl,x.gifUrl].filter(Boolean).forEach(u=>map.set(String(u),String(x.muscle||'')))
  }))
  mediaMap239=map
  return map
}))

const equipment239=()=>read239('ft-available-equipment-v238',{bodyweight:true,dumbbell:true,barbell:true,band:false,machine:false})
const onlyMine239=()=>read239('ft-exercise-only-mine-v238',false)
const matchEquipment239=(text,equipment)=>{
  const t=String(text||'').toLowerCase()
  if(/cardio|yoga|dehnen/.test(t))return true
  if(/kurzhantel|dumbbell/.test(t))return equipment.dumbbell
  if(/langhantel|sz-stange|barbell/.test(t))return equipment.barbell
  if(/körpergewicht|body.?weight/.test(t))return equipment.bodyweight
  if(/widerstandsband|band/.test(t))return equipment.band
  if(/kabelzug|maschine|multipresse|machine|cable/.test(t))return equipment.machine
  return false
}
const normalizedSrc239=img=>img?.currentSrc||img?.src||''
const muscleForCard239=card=>{
  const src=normalizedSrc239(card.querySelector('img'))
  if(!src||!mediaMap239)return ''
  if(mediaMap239.has(src))return mediaMap239.get(src)
  for(const[url,muscle]of mediaMap239){if(src.endsWith(url)||url.endsWith(src))return muscle}
  return ''
}

const apply239=()=>{
  const grid=document.querySelector('.exercise-grid')
  if(!grid)return
  const cards=[...grid.querySelectorAll('.exercise-card-v2')]
  const equipment=equipment239(),onlyMine=onlyMine239()
  let visible=0
  cards.forEach(card=>{
    const eqOk=!onlyMine||matchEquipment239(card.textContent,equipment)
    const muscle=muscleForCard239(card)
    const muscleOk=selectedMuscle239==='Alle'||muscle===selectedMuscle239
    card.hidden=!(eqOk&&muscleOk)
    if(eqOk&&muscleOk)visible++
  })
  const count=document.querySelector('.exercise-count-v238')
  if(count)count.textContent=`${visible} von ${cards.length} sichtbar`
}

const ensureMuscleFilter239=()=>{
  const row=document.querySelector('.filter-row')
  if(!row||row.querySelector('.muscle-filter-v239'))return
  const select=document.createElement('select')
  select.className='muscle-filter-v239'
  select.setAttribute('aria-label','Muskel filtern')
  select.innerHTML='<option value="Alle">Alle Muskeln</option>'+MUSCLES239.filter(m=>m!=='cardio').map(m=>`<option value="${m}">${labels239[m]||m}</option>`).join('')
  select.value=selectedMuscle239
  select.onchange=()=>{selectedMuscle239=select.value;write239('ft-exercise-muscle-v239',selectedMuscle239);apply239()}
  row.appendChild(select)
}

let queued239=false
const enhance239=()=>{
  queued239=false
  const grid=document.querySelector('.exercise-grid')
  if(!grid)return
  ensureMuscleFilter239()
  loadMap239().then(apply239)
  document.querySelectorAll('body *').forEach(el=>{
    if(el.children.length)return
    const t=el.textContent||''
    if(/V2\.0\.3[5-8]/.test(t))el.textContent=t.replace(/V2\.0\.3[5-8]/g,FITTOGETHER_VERSION)
  })
}
const schedule239=()=>{if(queued239)return;queued239=true;requestAnimationFrame(enhance239)}
if(typeof document!=='undefined'){
  const observer=new MutationObserver(schedule239)
  const start=()=>{enhance239();observer.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
