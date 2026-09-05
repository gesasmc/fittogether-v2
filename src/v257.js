// FitTogether V2.0.62: safe, repeatable pause timer controls.
// Never mutate an arbitrary React numeric state. Only use the hook that matches the visible countdown.
const FT257='V2.0.62'
const read257=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write257=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}

const clamp257=v=>Math.max(10,Math.min(600,Number(v)||90))
const displayedSeconds257=overlay=>{
  if(!overlay)return null
  const leaves=[...overlay.querySelectorAll('*')].filter(el=>el.children.length===0)
  for(const el of leaves){
    const t=(el.textContent||'').trim()
    const m=t.match(/^(\d{1,2}):([0-5]\d)$/)
    if(m)return Number(m[1])*60+Number(m[2])
  }
  return null
}
const findRestDispatch257=overlay=>{
  try{
    const shown=displayedSeconds257(overlay)
    if(shown==null)return null
    const key=Object.keys(overlay).find(k=>k.startsWith('__reactFiber$'))
    let fiber=key?overlay[key]:null
    let candidate=null,bestDiff=Infinity
    while(fiber){
      if(typeof fiber.type==='function'){
        let hook=fiber.memoizedState
        while(hook){
          const value=hook.memoizedState
          if(typeof value==='number'&&typeof hook?.queue?.dispatch==='function'){
            const diff=Math.abs(value-shown)
            if(diff<bestDiff){bestDiff=diff;candidate=hook.queue.dispatch}
          }
          hook=hook.next
        }
      }
      fiber=fiber.return
    }
    return bestDiff<=1?candidate:null
  }catch{return null}
}

const adjust257=(overlay,delta)=>{
  if(!overlay?.isConnected)return
  const dispatch=findRestDispatch257(overlay)
  if(!dispatch)return
  dispatch(current=>clamp257(Number(current)+delta))
  const shown=displayedSeconds257(overlay)
  const preferred=clamp257((shown??Number(read257('ft-timer-default',90)))+delta)
  write257('ft-timer-default',preferred)
}

const enhanceOverlay257=overlay=>{
  if(!overlay||overlay.dataset.ft257Ready==='1')return
  const skip=[...overlay.querySelectorAll('button')].find(b=>b.textContent?.includes('Pause überspringen'))
  if(!skip)return
  overlay.dataset.ft257Ready='1'
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

if(typeof document!=='undefined'){
  const start=()=>{
    document.querySelectorAll('.rest-overlay').forEach(enhanceOverlay257)
    const obs=new MutationObserver(records=>{
      for(const record of records)for(const node of record.addedNodes)enhanceAdded257(node)
    })
    obs.observe(document.body,{childList:true,subtree:true})
  }
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
