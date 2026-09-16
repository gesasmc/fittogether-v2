// FitTogether: one central source of truth for owned equipment.
// This module owns the "Meine Ausstattung" settings panel and keeps the exercise filter mirror in sync.
const read274=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write274=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const defaults274=()=>({
  bodyweight:true,
  dumbbell:read274('ft-dumbbell-weights',[]).length>0,
  barbell:read274('ft-barbell-weights',[]).length>0,
  band:false,
  machine:false,
  treadmill:false,
  bike:false,
  rower:false,
})
const normalizeEquipment274=value=>{
  const e=value||{},d=defaults274()
  return{
    ...d,
    bodyweight:e.bodyweight??d.bodyweight,
    dumbbell:e.dumbbell??d.dumbbell,
    barbell:e.barbell??d.barbell,
    band:!!(e.band??e.resistanceBand??d.band),
    machine:!!(e.machine??e.cable??d.machine),
    treadmill:!!(e.treadmill??d.treadmill),
    bike:!!(e.bike??e.indoorBike??e.ergometer??d.bike),
    rower:!!(e.rower??e.rowingMachine??e.rowing??d.rower),
  }
}
const profile274=()=>{
  const stored=read274('ft-equipment-profile',{})||{}
  const mirror=read274('ft-available-equipment-v238',null)||{}
  // The settings profile is authoritative. The mirror only fills genuinely missing legacy keys.
  let equipment=normalizeEquipment274({...mirror,...(stored.equipment||{})})
  // V2.0.351 could overwrite the two cardio devices that were already selected before the sync regression.
  // Repair that state exactly once; afterwards the normal settings toggles are authoritative again.
  if(!read274('ft-cardio-equipment-repair-v352',false)){
    equipment={...equipment,bike:true,rower:true}
    write274('ft-cardio-equipment-repair-v352',true)
  }
  return{
    ...stored,
    equipment,
    dumbbellWeights:stored.dumbbellWeights||read274('ft-dumbbell-weights',[2,4,6,8,10]),
    barbellWeights:stored.barbellWeights||read274('ft-barbell-weights',[20,30,40,50]),
  }
}
const persist274=(profile,{upload=true}={})=>{
  const equipment=normalizeEquipment274(profile.equipment)
  const next={...profile,equipment}
  write274('ft-equipment-profile',next)
  write274('ft-available-equipment-v238',equipment)
  write274('ft-dumbbell-weights',next.dumbbellWeights||[])
  write274('ft-barbell-weights',next.barbellWeights||[])
  if(upload)try{window.FitTogetherCloud?.upload?.()}catch{}
  return next
}
const defs274=[
  ['bodyweight','Körpergewicht'],
  ['dumbbell','Kurzhanteln'],
  ['barbell','Langhantel'],
  ['band','Widerstandsband'],
  ['machine','Kabel / Kraftmaschine'],
  ['treadmill','Laufband'],
  ['bike','Indoor-Bike / Ergometer'],
  ['rower','Rudergerät'],
]
const render274=box=>{
  const profile=profile274()
  box.innerHTML=`<div class="equipment-central-head-v273"><strong>Meine Ausstattung</strong><small>Diese Auswahl gilt für Übungsfilter und Smarten Trainer.</small></div><div class="equipment-central-grid-v273">${defs274.map(([key,label])=>`<button type="button" data-eq="${key}" class="${profile.equipment[key]?'active':''}">${profile.equipment[key]?'✓ ':''}${label}</button>`).join('')}</div><p class="equipment-central-note-v273">Im Smarten Trainer erscheinen nur Geräte, die hier aktiviert sind.</p>`
  box.querySelectorAll('[data-eq]').forEach(button=>button.onclick=()=>{
    const current=profile274(),key=button.dataset.eq
    current.equipment={...current.equipment,[key]:!current.equipment[key]}
    persist274(current)
    render274(box)
  })
}
const enhance274=()=>{
  if(document.querySelector('.rest-overlay'))return
  const page=[...document.querySelectorAll('.page')].find(p=>p.querySelector('.sub-head strong')?.textContent?.trim()==='Einstellungen')
  if(!page)return
  let box=page.querySelector('.equipment-central-v273')
  if(!box){
    box=document.createElement('section')
    box.className='equipment-central-v273'
    const title=[...page.querySelectorAll('.section-title')].find(x=>x.textContent.includes('Meine Gewichte'))
    if(title)title.insertAdjacentElement('beforebegin',box);else page.appendChild(box)
  }
  render274(box)
}
const sync274=()=>{persist274(profile274(),{upload:false})}
let queued274=false
const schedule274=()=>{
  if(queued274||document.querySelector('.rest-overlay'))return
  queued274=true
  requestAnimationFrame(()=>{queued274=false;enhance274()})
}
if(typeof window!=='undefined'){
  sync274()
  const start=()=>{
    enhance274()
    new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule274()}).observe(document.body,{childList:true,subtree:true})
  }
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
  window.addEventListener('storage',e=>{if(e.key==='ft-equipment-profile'||e.key==='ft-available-equipment-v238'){sync274();schedule274()}})
}
