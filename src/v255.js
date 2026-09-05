// FitTogether V2.0.55: make the rest-overlay skip button reliably tappable on iOS.
const FT255='V2.0.55'
let skipping255=false
const forcePauseSkip255=e=>{
  const btn=e.target?.closest?.('.rest-overlay button')
  if(!btn||!btn.textContent?.includes('Pause überspringen')||skipping255)return
  skipping255=true
  e.preventDefault?.()
  e.stopPropagation?.()
  // Fire the React delegated click immediately from the pointer interaction.
  btn.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}))
  setTimeout(()=>{skipping255=false},300)
}
const version255=()=>document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(t.includes('V2.0.54'))el.textContent=t.replaceAll('V2.0.54',FT255)})
if(typeof document!=='undefined'){
  document.addEventListener('pointerdown',forcePauseSkip255,true)
  document.addEventListener('touchstart',forcePauseSkip255,{capture:true,passive:false})
  const obs=new MutationObserver(()=>version255())
  const start=()=>{version255();obs.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
