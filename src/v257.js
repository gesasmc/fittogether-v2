// FitTogether V2.0.63: independent pause timer that never touches React internals.
const FT257='V2.0.63'
const read257=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const write257=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
const clamp257=v=>Math.max(10,Math.min(600,Number(v)||90))
const fmt257=v=>`${Math.floor(v/60)}:${String(v%60).padStart(2,'0')}`
let active257=null

const close257=()=>{
  if(!active257)return
  clearInterval(active257.interval)
  active257.node?.remove()
  active257=null
}

const createProxy257=source=>{
  if(!source?.isConnected||source.dataset.ftProxySource==='1')return
  const skip=[...source.querySelectorAll('button')].find(b=>b.textContent?.includes('Pause überspringen'))
  if(!skip)return
  source.dataset.ftProxySource='1'
  close257()

  let preferred=clamp257(read257('ft-timer-default',90))
  let left=preferred
  const node=document.createElement('div')
  node.className='rest-overlay rest-proxy-v263'
  node.innerHTML=`<small>PAUSE</small><strong>${fmt257(left)}</strong><span>Nächste Übung startet danach automatisch</span><div class="rest-adjust-v257"><button type="button" data-minus>−10 Sek.</button><button type="button" data-plus>+10 Sek.</button></div><button type="button" data-skip>Pause überspringen ›</button>`
  document.body.appendChild(node)

  const render=()=>{const el=node.querySelector('strong');if(el)el.textContent=fmt257(left)}
  node.querySelector('[data-minus]').onclick=()=>{left=clamp257(left-10);preferred=clamp257(preferred-10);write257('ft-timer-default',preferred);render()}
  node.querySelector('[data-plus]').onclick=()=>{left=clamp257(left+10);preferred=clamp257(preferred+10);write257('ft-timer-default',preferred);render()}
  node.querySelector('[data-skip]').onclick=()=>close257()

  const interval=setInterval(()=>{
    if(!node.isConnected){clearInterval(interval);if(active257?.node===node)active257=null;return}
    left=Math.max(0,left-1);render()
    if(left<=0)close257()
  },1000)
  active257={node,interval}

  // Advance React immediately behind our own overlay. This removes the fragile built-in countdown
  // from the equation while the user still sees and controls the full pause above it.
  requestAnimationFrame(()=>{if(source.isConnected)skip.click()})
}

const inspect257=node=>{
  if(!(node instanceof Element))return
  if(node.matches?.('.rest-overlay')&&!node.classList.contains('rest-proxy-v263'))createProxy257(node)
  node.querySelectorAll?.('.rest-overlay:not(.rest-proxy-v263)').forEach(createProxy257)
}

if(typeof document!=='undefined'){
  const start=()=>{
    document.querySelectorAll('.rest-overlay:not(.rest-proxy-v263)').forEach(createProxy257)
    const obs=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)inspect257(node)})
    obs.observe(document.body,{childList:true,subtree:true})
  }
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
