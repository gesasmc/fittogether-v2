// FitTogether V2.0.74: keep the existing equipment selector as the single source of truth.
// The previous V2.0.73 block duplicated the already existing "Meine Ausstattung" UI.
// No second settings block is rendered here anymore.
const read274=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write274=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const sync274=()=>{
  const equipment=read274('ft-available-equipment-v238',null)
  if(!equipment)return
  const profile=read274('ft-equipment-profile',{})
  write274('ft-equipment-profile',{...profile,equipment})
  const quick=read274('ft-quickstart-settings-v271',{})
  write274('ft-quickstart-settings-v271',{...quick,equipment})
}
if(typeof window!=='undefined'){
  sync274()
  window.addEventListener('storage',e=>{if(e.key==='ft-available-equipment-v238')sync274()})
}
