// FitTogether V2.0.160: smoother iPhone/iPad plan reordering using one rAF-throttled gesture layer.
const initSmoothReorder324=overlay=>{
  if(!overlay||overlay.dataset.smooth324)return
  overlay.dataset.smooth324='1'
  const scroll=overlay.querySelector('.reorder-days-v322')
  let drag=null,pointerId=null,lastX=0,lastY=0,raf=0,lastTarget=null,lastBefore=null
  const finish=()=>{
    if(raf)cancelAnimationFrame(raf);raf=0
    drag?.classList.remove('dragging-v324')
    overlay.classList.remove('drag-active-v324')
    drag=null;pointerId=null;lastTarget=null;lastBefore=null
    overlay.querySelectorAll('.reorder-ex-list-v322').forEach(list=>{
      list.querySelector('.reorder-empty-v322')?.remove()
      if(!list.querySelector('.reorder-ex-v322'))list.insertAdjacentHTML('beforeend','<p class="reorder-empty-v322">Übungen hierher ziehen</p>')
    })
  }
  const tick=()=>{
    raf=0;if(!drag||!overlay.isConnected)return
    const rect=scroll?.getBoundingClientRect()
    if(scroll&&rect){
      const edge=72
      if(lastY<rect.top+edge)scroll.scrollTop-=Math.max(4,(rect.top+edge-lastY)*.16)
      else if(lastY>rect.bottom-edge)scroll.scrollTop+=Math.max(4,(lastY-(rect.bottom-edge))*.16)
    }
    drag.style.pointerEvents='none'
    const hit=document.elementFromPoint(lastX,lastY)
    drag.style.pointerEvents=''
    if(!hit)return
    if(drag.classList.contains('reorder-day-v322')){
      const target=hit.closest('.reorder-day-v322')
      if(!target||target===drag||target.parentNode!==drag.parentNode)return
      const r=target.getBoundingClientRect(),before=lastY<r.top+r.height/2
      if(target!==lastTarget||before!==lastBefore){
        target.parentNode.insertBefore(drag,before?target:target.nextSibling)
        lastTarget=target;lastBefore=before
      }
      return
    }
    const target=hit.closest('.reorder-ex-v322')
    if(target&&target!==drag){
      const r=target.getBoundingClientRect(),before=lastY<r.top+r.height/2
      if(target!==lastTarget||before!==lastBefore){
        target.parentNode.insertBefore(drag,before?target:target.nextSibling)
        lastTarget=target;lastBefore=before
      }
      return
    }
    const list=hit.closest('.reorder-ex-list-v322')
    if(list&&drag.parentNode!==list){list.appendChild(drag);lastTarget=list;lastBefore=null}
  }
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(tick)}
  overlay.addEventListener('pointerdown',e=>{
    const handle=e.target.closest('.drag-handle-v322');if(!handle)return
    const item=handle.closest('.reorder-ex-v322,.reorder-day-v322');if(!item)return
    e.preventDefault();e.stopImmediatePropagation()
    drag=item;pointerId=e.pointerId;lastX=e.clientX;lastY=e.clientY
    drag.classList.add('dragging-v324');overlay.classList.add('drag-active-v324')
    try{handle.setPointerCapture(pointerId)}catch{}
    try{navigator.vibrate?.(10)}catch{}
  },true)
  overlay.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==pointerId)return
    e.preventDefault();e.stopImmediatePropagation();lastX=e.clientX;lastY=e.clientY;schedule()
  },{capture:true,passive:false})
  ;['pointerup','pointercancel'].forEach(type=>overlay.addEventListener(type,e=>{
    if(!drag||e.pointerId!==pointerId)return
    e.preventDefault();e.stopImmediatePropagation();finish()
  },true))
}
const scan324=()=>document.querySelectorAll('.plan-reorder-backdrop-v322').forEach(initSmoothReorder324)
if(typeof document!=='undefined'){
  const start=()=>{scan324();new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length))requestAnimationFrame(scan324)}).observe(document.body,{childList:true,subtree:true})}
  document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
