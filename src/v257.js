// FitTogether V2.0.58: lightweight, repeat-safe pause timer controls.
// Important: do not scan/rewrite the whole DOM on every timer tick or overlay change.
const FT257='V2.0.58'
const read257=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write257=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}

const clamp257=v=>Math.max(10,Math.min(600,Number(v)||90))
const findRestDispatch257=overlay=>{
  try{
    const key=Object.keys(overlay).find(k=>k.startsWith('__reactFiber$'))
    let fiber=key?overlay[key]:null
    while(fiber){
      // RestOverlay has exactly one numeric state hook: the remaining seconds.
      if(typeof fiber.type==='function'){
        let hook=fiber.memoizedState
        while(hook){
          if(typeof hook.memoizedState==='number'&&typeof hook?.queue?.dispatch==='function')return hook.queue.dispatch
          hook=hook.next
        }
      }
      fiber=fiber.return
    }
  }catch{}
  return null
}

const adjust257=(overlay,delta)=>{
  if(!overlay?.isConnected)return
  const dispatch=findRestDispatch257(overlay)
  if(!dispatch)return
  // Update the live React timer without touching any parent training state.
  dispatch(current=>clamp257(Number(current)+delta))
  // Persist the user's preferred pause duration in 10-second steps.
  const preferred=clamp257(Number(read257('ft-timer-default',90))+delta)
  write257('ft-timer-default',preferred)
}

const enhanceOverlay257=overlay=>{
  if(!overlay||overlay.dataset.ft257Ready==='1')return
  overlay.dataset.ft257Ready='1'
  const skip=[...overlay.querySelectorAll('button')].find(b=>b.textContent?.includes('Pause überspringen'))
  if(!skip)return
  const row=document.createElement('div')
  row.className='rest-adjust-v257'
  const minus=document.createElement('button')
  minus.type='button';minus.textContent='−10 Sek.';minus.setAttribute('aria-label','Pause 10 Sekunden kürzer')
  const plus=document.createElement('button')
  plus.type='button';plus.textContent='+10 Sek.';plus.setAttribute('aria-label','Pause 10 Sekunden länger')
  minus.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();adjust257(overlay,-10)})
  plus.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();adjust257(overlay,10)})
  row.append(minus,plus)
  skip.insertAdjacentElement('beforebegin',row)
}

const enhanceAdded257=node=>{
  if(!(node instanceof Element))return
  if(node.matches?.('.rest-overlay'))enhanceOverlay257(node)
  node.querySelectorAll?.('.rest-overlay').forEach(enhanceOverlay257)
}

const updateVersionNode257=node=>{
  if(!(node instanceof Element))return
  const candidates=[node,...(node.querySelectorAll?.('*')||[])]
  for(const el of candidates){
    if(el.children.length)continue
    const t=el.textContent||''
    if(t.includes('V2.0.56')||t.includes('V2.0.57'))el.textContent=t.replaceAll('V2.0.56',FT257).replaceAll('V2.0.57',FT257)
  }
}

if(typeof document!=='undefined'){
  const start=()=>{
    document.querySelectorAll('.rest-overlay').forEach(enhanceOverlay257)
    updateVersionNode257(document.body)
    const obs=new MutationObserver(records=>{
      for(const record of records){
        for(const node of record.addedNodes){enhanceAdded257(node);updateVersionNode257(node)}
      }
    })
    obs.observe(document.body,{childList:true,subtree:true})
  }
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
