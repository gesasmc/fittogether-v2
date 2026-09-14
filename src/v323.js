// FitTogether V2.0.159: iOS-safe cleanup for plan reorder drag previews.
const cleanup323=()=>{
  document.querySelectorAll('.drag-ghost-v322').forEach(x=>x.remove())
  if(!document.querySelector('.plan-reorder-backdrop-v322')){
    document.querySelectorAll('.dragging-v322').forEach(x=>x.classList.remove('dragging-v322'))
    document.querySelectorAll('.drag-active-v322').forEach(x=>x.classList.remove('drag-active-v322'))
  }
}
if(typeof document!=='undefined'){
  const start=()=>{
    cleanup323()
    ;['pointerup','pointercancel','touchend','touchcancel'].forEach(type=>document.addEventListener(type,()=>requestAnimationFrame(cleanup323),{capture:true,passive:true}))
    window.addEventListener('blur',cleanup323)
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible')cleanup323()})
    new MutationObserver(m=>{
      if(m.some(x=>[...x.removedNodes].some(n=>n?.nodeType===1&&(n.matches?.('.plan-reorder-backdrop-v322')||n.querySelector?.('.plan-reorder-backdrop-v322')))))requestAnimationFrame(cleanup323)
    }).observe(document.body,{childList:true,subtree:true})
  }
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
