// FitTogether V2.0.143: plan editor days start collapsed and can be expanded individually.
const FT314='V2.0.143'
const collapseSessions314=root=>{
  if(!root?.matches?.('.plan-editor-backdrop-v313')&&!root?.querySelector?.('.plan-editor-backdrop-v313'))return
  const editor=root.matches?.('.plan-editor-backdrop-v313')?root:root.querySelector('.plan-editor-backdrop-v313')
  if(!editor)return
  editor.querySelectorAll('.plan-session-v313').forEach((sec,i)=>{
    if(sec.dataset.collapse314)return
    sec.dataset.collapse314='1'
    sec.classList.add('collapsed-v314')
    const head=sec.querySelector('.plan-session-head-v313'),left=head?.firstElementChild
    if(!head||!left)return
    const toggle=document.createElement('button')
    toggle.type='button';toggle.className='plan-day-toggle-v314';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',`Tag ${i+1} aufklappen`);toggle.innerHTML='<span>›</span>'
    left.insertAdjacentElement('afterend',toggle)
    const setOpen=open=>{sec.classList.toggle('collapsed-v314',!open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',`Tag ${i+1} ${open?'einklappen':'aufklappen'}`)}
    toggle.onclick=e=>{e.preventDefault();e.stopPropagation();setOpen(sec.classList.contains('collapsed-v314'))}
    left.onclick=e=>{e.preventDefault();setOpen(sec.classList.contains('collapsed-v314'))}
  })
}
const scan314=()=>collapseSessions314(document)
if(typeof document!=='undefined'){
 const obs=new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length))requestAnimationFrame(scan314)})
 const start=()=>{scan314();obs.observe(document.body,{childList:true,subtree:true})}
 document.body?start():document.addEventListener('DOMContentLoaded',start,{once:true})
}
