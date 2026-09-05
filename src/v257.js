// FitTogether V2.0.57: stable pause timer with +/-10s controls that persist the default.
const FT257='V2.0.57'
const read257=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write257=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}

const parseShown257=el=>{const t=el?.textContent?.trim()||'';const m=t.match(/(\d+):(\d{2})/);return m?Number(m[1])*60+Number(m[2]):null}
const findStateDispatch257=overlay=>{
  try{
    const key=Object.keys(overlay).find(k=>k.startsWith('__reactFiber$'))
    let f=key?overlay[key]:null
    while(f){
      let h=f.memoizedState
      while(h){if(h?.queue?.dispatch&&typeof h.memoizedState==='number')return h.queue.dispatch;h=h.next}
      f=f.return
    }
  }catch{}
  return null
}
const adjust257=(overlay,delta)=>{
  const strong=overlay.querySelector('strong')
  const shown=parseShown257(strong)
  const dispatch=findStateDispatch257(overlay)
  if(shown==null||!dispatch)return
  const next=Math.max(10,Math.min(600,shown+delta))
  dispatch(()=>next)
  const base=Math.max(10,Math.min(600,Number(read257('ft-timer-default',90)||90)+delta))
  write257('ft-timer-default',base)
  window.FitTogetherCloud?.upload?.()
}
const enhance257=()=>{
  document.querySelectorAll('.rest-overlay').forEach(overlay=>{
    if(!overlay.querySelector('.rest-adjust-v257')){
      const row=document.createElement('div');row.className='rest-adjust-v257'
      const minus=document.createElement('button');minus.type='button';minus.textContent='−10 Sek.';minus.setAttribute('aria-label','Pause 10 Sekunden kürzer')
      const plus=document.createElement('button');plus.type='button';plus.textContent='+10 Sek.';plus.setAttribute('aria-label','Pause 10 Sekunden länger')
      minus.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();adjust257(overlay,-10)})
      plus.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();adjust257(overlay,10)})
      row.append(minus,plus)
      const skip=[...overlay.querySelectorAll('button')].find(b=>b.textContent?.includes('Pause überspringen'))
      skip?.insertAdjacentElement('beforebegin',row)
    }
  })
  document.querySelectorAll('body *').forEach(el=>{if(el.children.length)return;const t=el.textContent||'';if(t.includes('V2.0.56'))el.textContent=t.replaceAll('V2.0.56',FT257)})
}
let queued257=false
const schedule257=()=>{if(queued257)return;queued257=true;requestAnimationFrame(()=>{queued257=false;enhance257()})}
if(typeof document!=='undefined'){
  const obs=new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule257()})
  const start=()=>{enhance257();obs.observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
