export const FITTOGETHER_VERSION='V2.0.28'

let queued=false
const updateVersion=()=>{
  queued=false
  document.querySelectorAll('body *').forEach(el=>{
    if(el.children.length)return
    const text=el.textContent
    if(!text)return
    const next=text.replaceAll('V2.0.26',FITTOGETHER_VERSION).replaceAll('V2.0.27',FITTOGETHER_VERSION)
    if(next!==text)el.textContent=next
  })
}
const schedule=()=>{if(queued)return;queued=true;queueMicrotask(updateVersion)}

if(typeof document!=='undefined'){
  const observer=new MutationObserver(schedule)
  const start=()=>{updateVersion();observer.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
