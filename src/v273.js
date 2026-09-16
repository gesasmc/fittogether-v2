// FitTogether V2.0.354: the existing equipment selector is the single source of truth.
// Do not render a second "Meine Ausstattung" panel. The authoritative selector stores
// its state in ft-available-equipment-v238; the other stores are compatibility mirrors only.
const read274=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write274=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}

const removeDuplicate274=()=>{
  document.querySelectorAll?.('.equipment-central-v273').forEach(node=>node.remove())
}

const sync274=()=>{
  const selected=read274('ft-available-equipment-v238',null)
  if(!selected||typeof selected!=='object')return false
  // Bodyweight is always available. Preserve every richer equipment key from the
  // real selector (bench, pull-up bar, kettlebell, cardio machines, etc.).
  const equipment={...selected,bodyweight:true}
  const profile=read274('ft-equipment-profile',{})||{}
  const quick=read274('ft-quickstart-settings-v271',{})||{}
  if(JSON.stringify(profile.equipment||{})!==JSON.stringify(equipment)){
    write274('ft-equipment-profile',{...profile,equipment})
  }
  if(JSON.stringify(quick.equipment||{})!==JSON.stringify(equipment)){
    write274('ft-quickstart-settings-v271',{...quick,equipment})
  }
  return true
}

if(typeof window!=='undefined'){
  // Run before the React app opens the Smart Trainer so stale profile values cannot win.
  sync274()
  const start=()=>{
    removeDuplicate274()
    sync274()
    // The authoritative selector writes localStorage in this same tab. Storage events do
    // not fire in the tab that performed the write, so mirror once after normal UI clicks.
    document.addEventListener('click',()=>setTimeout(()=>{removeDuplicate274();sync274()},0),true)
    window.addEventListener('pageshow',()=>{removeDuplicate274();sync274()})
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){removeDuplicate274();sync274()}})
  }
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
