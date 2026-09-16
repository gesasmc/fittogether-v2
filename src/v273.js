// FitTogether V2.0.74: keep one central equipment profile and migrate legacy state safely.
// The central profile is the source of truth. Legacy data is only used when no central profile exists yet.
const read274=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write274=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const sync274=()=>{
  const profile=read274('ft-equipment-profile',{})||{}
  const central=profile?.equipment
  const legacy=read274('ft-available-equipment-v238',null)
  const equipment=central??legacy
  if(!equipment)return
  write274('ft-equipment-profile',{...profile,equipment})
  write274('ft-available-equipment-v238',equipment)
  const quick=read274('ft-quickstart-settings-v271',{})||{}
  write274('ft-quickstart-settings-v271',{...quick,equipment})
}
if(typeof window!=='undefined'){
  sync274()
  window.addEventListener('storage',e=>{if(e.key==='ft-equipment-profile'||e.key==='ft-available-equipment-v238')sync274()})
}
