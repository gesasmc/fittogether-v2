// FitTogether V2.0.74: keep one central equipment profile and migrate legacy state safely.
// Central values win per key; older stores only fill values that do not exist centrally yet.
const read274=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write274=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const sync274=()=>{
  const profile=read274('ft-equipment-profile',{})||{}
  const central=profile?.equipment||{}
  const legacy=read274('ft-available-equipment-v238',null)||{}
  const quick=read274('ft-quickstart-settings-v271',{})||{}
  const quickEquipment=quick?.equipment||{}
  const equipment={...quickEquipment,...legacy,...central}
  if(!Object.keys(equipment).length)return
  write274('ft-equipment-profile',{...profile,equipment})
  write274('ft-available-equipment-v238',equipment)
  write274('ft-quickstart-settings-v271',{...quick,equipment})
}
if(typeof window!=='undefined'){
  sync274()
  window.addEventListener('storage',e=>{if(e.key==='ft-equipment-profile'||e.key==='ft-available-equipment-v238'||e.key==='ft-quickstart-settings-v271')sync274()})
}
