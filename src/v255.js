// FitTogether V2.0.55 compatibility layer.
// The old pointer/touch re-dispatch workaround caused duplicate events on later pauses.
// Keep only the version bridge; V2.0.57 handles pause controls safely.
const FT255='V2.0.55'
const version255=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(t.includes('V2.0.54'))el.textContent=t.replaceAll('V2.0.54',FT255)})
if(typeof document!=='undefined'){
  const obs=new MutationObserver(()=>version255())
  const start=()=>{version255();obs.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
